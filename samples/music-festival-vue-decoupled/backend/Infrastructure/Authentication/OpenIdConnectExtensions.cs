using System;
using System.Globalization;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using EPiServer.Security;
using EPiServer.ServiceLocation;
using IdentityModel.Client;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security.Notifications;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Owin.Security.OpenIdConnect;
using Owin;

namespace MusicFestival.CMS.Infrastructure.Authentication
{
    /// <summary>
    /// Extension methods for OpenIdConnect.
    /// </summary>
    public static class OpenIdConnectExtensions
    {
        /// <summary>
        /// Adds the Microsoft.Owin.Security.OpenIdConnect.OpenIdConnectAuthenticationMiddleware.
        /// </summary>
        /// <param name="app">IAppBuilder.</param>
        /// <param name="options">Configuration options for OpenIdConnect.</param>
        /// <param name="requireHttps">Require https for the metadata address or authority.</param>
        /// <param name="authenticationFailedHandler">Handles error on authentication failed.</param>
        /// <param name="authorizationTokenFailedHandler">Handles error on authorization token failed.</param>
        /// <param name="authorizationUserInforFailedHandler">Handles error on authorization user failed.</param>
        public static void AddOpenIdConnect(
            this IAppBuilder app,
            OpenIdConnectOptions options,
            bool requireHttps = true,
            Func<AuthenticationFailedNotification<OpenIdConnectMessage, OpenIdConnectAuthenticationOptions>, Task> authenticationFailedHandler = null,
            Func<AuthorizationCodeReceivedNotification, Task> authorizationTokenFailedHandler = null,
            Func<AuthorizationCodeReceivedNotification, Task> authorizationUserInforFailedHandler = null)
        {
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions
            {
                AccessTokenFormat = new JwtFormat(
                  new TokenValidationParameters
                  {
                      ValidAudiences = options.ValidAudiences,
                      ValidateIssuer = true,
                      NameClaimType = options.NameClaimType,
                      RoleClaimType = options.RoleClaimType
                  },
                  new OpenIdConnectSecurityTokenProvider($"{options.Authority}/.well-known/openid-configuration", requireHttps))
            });

            app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions
            {
                AuthenticationType = OpenIdConnectAuthenticationDefaults.AuthenticationType,
                ClientId = options.ClientId,
                ClientSecret = options.ClientSecret,
                Authority = options.Authority,
                RedirectUri = options.RedirectUri,
                ResponseType = OpenIdConnectResponseType.CodeIdToken,
                Scope = $"{OpenIdConnectScope.OpenIdProfile} {OpenIdConnectScope.OfflineAccess} {OpenIdConnectScope.Email} {options.RoleClaimType}",
                RequireHttpsMetadata = requireHttps,
                TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = options.NameClaimType,
                    RoleClaimType = options.RoleClaimType
                },
                Notifications = new OpenIdConnectAuthenticationNotifications
                {
                    AuthenticationFailed = notification =>
                    {
                        notification.HandleResponse();

                        if (authenticationFailedHandler is object)
                        {
                            authenticationFailedHandler(notification);
                        }
                        else
                        {
                            notification.Response.Write(notification.Exception.Message);
                        }

                        return Task.CompletedTask;
                    },
                    RedirectToIdentityProvider = notification =>
                    {
                        notification.ProtocolMessage.UiLocales = CultureInfo.CurrentUICulture.Name;

                        if (notification.ProtocolMessage.RequestType == OpenIdConnectRequestType.Logout)
                        {
                            // This is needed for logout to work.
                            notification.ProtocolMessage.IdTokenHint = notification.OwinContext.Authentication.User
                                .FindFirst(OpenIdConnectParameterNames.IdToken)?.Value;
                        }

                        // We should not redirect API requests, just return HTTP status codes
                        // so client knows it needs to challange.
                        if (notification.Request.Path.StartsWithSegments(new PathString("/api/episerver")))
                        {
                            notification.HandleResponse();
                        }

                        // XHR requests cannot handle redirects.
                        if (notification.OwinContext.Response.StatusCode == 401 &&
                            IsXhrRequest(notification.OwinContext.Request))
                        {
                            notification.HandleResponse();
                        }

                        // Avoid redirect loop, send 403 when user is authenticated but does not have access.
                        if (notification.OwinContext.Response.StatusCode == 401 &&
                            notification.OwinContext.Authentication.User.Identity.IsAuthenticated)
                        {
                            notification.OwinContext.Response.StatusCode = 403;
                            notification.HandleResponse();
                        }

                        return Task.CompletedTask;
                    },
                    AuthorizationCodeReceived = async (notification) =>
                    {
                        // Back channel calls are made from here.
                        var configuration = await notification.Options.ConfigurationManager
                             .GetConfigurationAsync(notification.Request.CallCancelled);

                        TokenResponse tokenResponse;

                        using (var client = new HttpClient())
                        {
                            tokenResponse = await client.RequestAuthorizationCodeTokenAsync(
                                new AuthorizationCodeTokenRequest
                                {
                                    Address = configuration.TokenEndpoint,
                                    ClientId = notification.Options.ClientId,
                                    ClientCredentialStyle = ClientCredentialStyle.PostBody,
                                    ClientSecret = notification.Options.ClientSecret,
                                    Code = notification.ProtocolMessage.Code,
                                    RedirectUri = notification.Request.Uri.ToString(),
                                },
                                notification.Request.CallCancelled);

                            if (tokenResponse.IsError ||
                                string.IsNullOrWhiteSpace(tokenResponse.AccessToken) ||
                                string.IsNullOrWhiteSpace(tokenResponse.RefreshToken))
                            {
                                notification.HandleResponse();
                                if (authorizationTokenFailedHandler is object)
                                {
                                    await authorizationTokenFailedHandler(notification);
                                }
                                else
                                {
                                    notification.Response.Write("Error retrieving tokens.");
                                }

                                return;
                            }
                        }

                        UserInfoResponse userInfoResponse;

                        using (var client = new HttpClient())
                        {
                            userInfoResponse = await client.GetUserInfoAsync(
                                new UserInfoRequest
                                {
                                    Address = configuration.UserInfoEndpoint,
                                    Token = tokenResponse.AccessToken,
                                },
                                notification.Request.CallCancelled);

                            if (userInfoResponse.IsError)
                            {
                                notification.HandleResponse();
                                if (authorizationUserInforFailedHandler is object)
                                {
                                    await authorizationUserInforFailedHandler(notification);
                                }
                                else
                                {
                                    notification.Response.Write("Error retrieving user info.");
                                }

                                return;
                            }
                        }

                        var id = new ClaimsIdentity(
                            userInfoResponse.Claims,
                            notification.AuthenticationTicket.Identity.AuthenticationType,
                            options.UsernameClaimType,
                            options.RoleClaimType);

                        notification.AuthenticationTicket = new AuthenticationTicket(id, notification.AuthenticationTicket.Properties);

                        // Sync user information and roles to Episerver
                        await ServiceLocator.Current.GetInstance<ISynchronizingUserService>().SynchronizeAsync(id);
                    },
                },
            });
        }

        private static bool IsXhrRequest(IOwinRequest request)
        {
            if (request.Headers.ContainsKey("Accept") &&
                request.Headers.GetCommaSeparatedValues("Accept").Contains("application/json"))
            {
                return true;
            }

            const string parameter = "X-Requested-With";
            const string value = "XMLHttpRequest";

            return request.Query?[parameter] == value ||
                   request.Headers?[parameter] == value;
        }
    }
}
