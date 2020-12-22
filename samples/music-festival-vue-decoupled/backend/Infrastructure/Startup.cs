using Microsoft.Owin;
using Microsoft.Owin.Extensions;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using MusicFestival.CMS.Infrastructure;
using MusicFestival.CMS.Infrastructure.Authentication;
using Owin;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using System.Web.Helpers;

[assembly: OwinStartup(typeof(Startup))]

namespace MusicFestival.CMS.Infrastructure
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            JwtSecurityTokenHandler.DefaultMapInboundClaims = false;

            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                CookieName = "epi.mgmt.login"
            });

            app.AddOpenIdConnect(
                new OpenIdConnectOptions
                {
                    Authority = "http://localhost:8081",
                    ClientId = "festival-management",
                    ClientSecret = "festival-management",
                    RedirectUri = "https://localhost:44340/signin-oidc"
                },
                requireHttps: false);

            app.UseStageMarker(PipelineStage.Authenticate);

            app.Map("/util/logout.aspx", map =>
            {
                map.Run(ctx =>
                {
                    ctx.Authentication.SignOut();
                    return Task.CompletedTask;
                });
            });

            app.Map("/logout", map =>
            {
                map.Run(ctx =>
                {
                    ctx.Authentication.SignOut();
                    return Task.CompletedTask;
                });
            });

            AntiForgeryConfig.UniqueClaimTypeIdentifier = OpenIdConnectConfigurationsDefaults.NameClaimType;
        }
    }
}