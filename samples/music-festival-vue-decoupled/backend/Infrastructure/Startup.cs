using System;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;
using EPiServer.Cms.UI.AspNetIdentity;
using Microsoft.AspNet.Identity.Owin;
using EPiServer.Web.Routing;
using EPiServer.Core;
using Microsoft.AspNet.Identity;

[assembly: OwinStartup(typeof(MusicFestival.CMS.Infrastructure.Startup))]
namespace MusicFestival.CMS.Infrastructure
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.AddCmsAspNetIdentity<ApplicationUser>(new ApplicationOptions
            { 
                ConnectionStringName = "EPiServerDB" 
            });

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider.
            // Configure the sign in cookie.
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/util/login.aspx"),
                Provider = new CookieAuthenticationProvider
                {
                    // Enables the application to validate the security stamp when the user logs in.
                    // This is a security feature which is used when you change a password or add an external login to your account.
                    OnValidateIdentity = SecurityStampValidator.OnValidateIdentity<ApplicationUserManager<ApplicationUser>, ApplicationUser>(
                        validateInterval: TimeSpan.FromMinutes(30),
                        regenerateIdentity: (manager, user) => manager.GenerateUserIdentityAsync(user)),
                    OnApplyRedirect = (context) =>
                    {
                        if (!IsContentApiRequest(context.Request.Uri))
                        {
                            context.Response.Redirect(context.RedirectUri);
                        }
                    },
                    OnResponseSignOut = (context) => context.Response.Redirect(UrlResolver.Current.GetUrl(ContentReference.StartPage)),
                },
            });

            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);
        }

        private bool IsContentApiRequest(Uri requestUri)
        {
            if (requestUri == null)
            {
                return false;
            }

            if (requestUri.IsAbsoluteUri)
            {
                return requestUri.PathAndQuery.StartsWith("/api/episerver");
            }
            else
            {
                return requestUri.ToString().StartsWith("/api/episerver");
            }
        }
    }
}