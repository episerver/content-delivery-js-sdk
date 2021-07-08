using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.ContentApi.Core.Configuration;
using EPiServer.Core.Internal;
using EPiServer.Data;
using EPiServer.DependencyInjection;
using EPiServer.Security;
using EPiServer.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OAuth.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Backend
{
    public static class Configuration
    {
        private const string NameClaimType = "email";
        private const string RoleClaimType = "role";

        public static IServiceCollection ConfigureDataAccess(this IServiceCollection services, string contentRootPath)
        {
            services.Configure<DataAccessOptions>(options =>
            {
                options.SetConnectionString(Startup.ConnectionString);
                options.CreateDatabaseSchema = true;
            });

            // Temporary until we have OIDC 
            services.AddCmsAspNetIdentity<ApplicationUser>(o =>
            {
                if (string.IsNullOrEmpty(o.ConnectionStringOptions?.ConnectionString))
                {
                    o.ConnectionStringOptions = new ConnectionStringOptions()
                    {
                        ConnectionString = Startup.ConnectionString
                    };
                }
            });

            return services;
        }

        public static IServiceCollection ConfigureDisplayOptions(this IServiceCollection services)
        {
            services.Configure<DisplayOptions>(options =>
            {
                options
                    .Add("full", "Full", "u-md-sizeFull", string.Empty, "epi-icon__layout--full")
                    .Add("wide", "Wide", "u-md-size2of3", string.Empty, "epi -icon__layout--two-thirds")
                    .Add("half", "Half", "u-md-size1of2", string.Empty, "epi-icon__layout--half")
                    .Add("narrow", "Narrow", "u-md-size1of3", string.Empty, "epi-icon__layout--one-third");
            });

            return services;
        }

        public static IServiceCollection AddContentDeliveryApi(this IServiceCollection services)
        {
            services.AddContentDeliveryApi(options => 
            {
                options.EnablePreviewFeatures = true;
                options.EnablePreviewMode = true;
                options.ExpandedBehavior = ExpandedLanguageBehavior.RequestedLanguage;
                options.IncludeSiteHosts = true;
                options.FlattenPropertyModel = true;
                options.ForceAbsolute = true;
                options.ValidateTemplateForContentUrl = false;
            });

            services.ConfigureForExternalTemplates();
            services.Configure<ExternalApplicationOptions>(o => o.OptimizeForDelivery = true);

            return services;
        }

        public static AuthenticationBuilder AddAuthentication(this IServiceCollection services, string authority, string clientId, string clientSecret)
        {
            services.Configure<ClaimTypeOptions>(options =>
            {
                options.Email = "email";
                options.GivenName = "given_name";
                options.Surname = "family_name";
            });

            var builder = services
                .AddAuthentication(options =>
                {
                    options.DefaultScheme = "cookie";
                    options.DefaultChallengeScheme = "oidc";
                })
                .AddJwtBearer("jwt", options =>
                {
                    options.Authority = authority;
                    options.MapInboundClaims = false;
                    options.RequireHttpsMetadata = false; // Do not use in production
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        NameClaimType = NameClaimType,
                        RoleClaimType = RoleClaimType,
                        ValidateIssuerSigningKey = true,
                        ValidateAudience = true,
                        ValidateIssuer = true,
                        ValidAudiences = new[]
                        {
                            "epi_content_definitions",
                            "epi_content_delivery",
                            "epi_content_management",
                        },
                        ValidIssuers = new[]
                        {
                            authority,
                        },
                    };
                })
                .AddCookie("cookie", options =>
                {
                    options.Cookie.Name = "epi-login";
                    options.AccessDeniedPath = "/error/403";
                    options.Events.OnSignedIn = async ctx =>
                    {
                        // Sync the user to Episerver so it's searchable
                        // in the UI for admins when managing access rights.
                        if (ctx.Principal.Identity is ClaimsIdentity claimsIdentity)
                        {
                            var synchronizingUserService = ctx
                                .HttpContext
                                .RequestServices
                                .GetRequiredService<ISynchronizingUserService>();

                            await synchronizingUserService.SynchronizeAsync(claimsIdentity);
                        }
                    };
                })
                .AddOpenIdConnect("oidc", options =>
                {
                    options.SignInScheme = "cookie";
                    options.Authority = authority;
                    options.ClientId = clientId;
                    options.ClientSecret = clientSecret;
                    options.ResponseType = OpenIdConnectResponseType.Code;
                    options.UsePkce = true;
                    options.RequireHttpsMetadata = false; // Do not use in production

                    options.Scope.Clear();
                    options.Scope.Add(OpenIdConnectScope.OpenIdProfile);
                    options.Scope.Add(OpenIdConnectScope.OfflineAccess);
                    options.Scope.Add(OpenIdConnectScope.Email);
                    options.Scope.Add("roles");

                    options.MapInboundClaims = false;
                    options.GetClaimsFromUserInfoEndpoint = true;
                    options.ClaimActions.Add(new JsonKeyClaimAction(RoleClaimType, ClaimValueTypes.String, RoleClaimType));

                    options.TokenValidationParameters.NameClaimType = NameClaimType;
                    options.TokenValidationParameters.RoleClaimType = RoleClaimType;

                    options.Events.OnRedirectToIdentityProvider = ctx =>
                    {
                        // We should not redirect API requests.
                        // Just return HTTP status codes so clients knows when to challange.
                        if (ctx.Request.Path.StartsWithSegments("/api/episerver"))
                        {
                            ctx.HandleResponse();
                        }

                        // XHR requests cannot handle redirects either.
                        if (ctx.Response.StatusCode == 401 && IsXhrRequest(ctx.Request))
                        {
                            ctx.HandleResponse();
                        }

                        return Task.CompletedTask;
                    };
                });

            return builder;
        }

        /// <summary>
        /// Adds a middleware to the specified <see cref="IApplicationBuilder"/>, which enables authentication capabilities.
        /// This replaces the default AuthenticationMiddleware with same functionality, 
        /// but with support for multiple authentication schemes. This is only needed when you combine different schemes,
        /// e.g. JWT and cookies.
        /// </summary>
        public static IApplicationBuilder UseAuthenticationWithMultipleSchemes(this IApplicationBuilder app)
        {
            app.Use(async (ctx, next) =>
            {
                var schemeProvider = ctx.RequestServices.GetRequiredService<IAuthenticationSchemeProvider>();

                ctx.Features.Set<IAuthenticationFeature>(new AuthenticationFeature
                {
                    OriginalPath = ctx.Request.Path,
                    OriginalPathBase = ctx.Request.PathBase
                });

                var handlers = ctx.RequestServices.GetRequiredService<IAuthenticationHandlerProvider>();
                foreach (var scheme in await schemeProvider.GetRequestHandlerSchemesAsync())
                {
                    var handler = await handlers.GetHandlerAsync(ctx, scheme.Name) as IAuthenticationRequestHandler;
                    if (handler is object && await handler.HandleRequestAsync())
                    {
                        return;
                    }
                }

                // Instead of calling schemeProvider.GetDefaultAuthenticateSchemeAsync()
                // we try to authenticate each scheme in the order they're registered.
                // This is only needed since we have both cookies and JWT and want JWT
                // to take precedence over cookies.
                foreach (var scheme in await schemeProvider.GetAllSchemesAsync())
                {
                    var result = await ctx.AuthenticateAsync(scheme.Name);
                    if (result?.Principal != null)
                    {
                        ctx.User = result.Principal;

                        break;
                    }
                }

                await next();
            });

            return app;
        }

        private static bool IsXhrRequest(HttpRequest request)
        {
            if (request.Headers.ContainsKey("Accept") &&
                request.Headers.GetCommaSeparatedValues("Accept").Contains("application/json"))
            {
                return true;
            }

            const string parameter = "X-Requested-With";
            const string value = "XMLHttpRequest";

            return request.Query[parameter] == value ||
                   request.Headers[parameter] == value;
        }
    }
}
