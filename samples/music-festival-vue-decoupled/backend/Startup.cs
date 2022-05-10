using EPiServer.Cms.Shell;
using EPiServer.Cms.Shell.UI;
using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.ContentApi.Cms;
using EPiServer.ContentApi.Core.DependencyInjection;
using EPiServer.ContentDefinitionsApi;
using EPiServer.Core;
using EPiServer.Data;
using EPiServer.OpenIDConnect;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;

namespace MusicFestival.Backend
{
    public class Startup
    {
        private readonly IWebHostEnvironment _webHostingEnvironment;
        private readonly Uri _frontendUri = new Uri("http://localhost:8080");

        public Startup(IWebHostEnvironment webHostingEnvironment)
        {
            _webHostingEnvironment = webHostingEnvironment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            AppDomain.CurrentDomain.SetData("DataDirectory", Path.Combine(_webHostingEnvironment.ContentRootPath, "App_Data"));

            services
                .AddCmsAspNetIdentity<ApplicationUser>()
                .AddCms()
                .AddAdminUserRegistration(o => o.Behavior = RegisterAdminUserBehaviors.Enabled | RegisterAdminUserBehaviors.LocalRequestsOnly)
                .AddEmbeddedLocalization<Startup>()
                .ConfigureForExternalTemplates()
                .Configure<ExternalApplicationOptions>(options => options.OptimizeForDelivery = true)
                .Configure<DisplayOptions>(options =>
                {
                    options
                        .Add("full", "Full", "u-md-sizeFull", string.Empty, "epi-icon__layout--full")
                        .Add("wide", "Wide", "u-md-size2of3", string.Empty, "epi -icon__layout--two-thirds")
                        .Add("half", "Half", "u-md-size1of2", string.Empty, "epi-icon__layout--half")
                        .Add("narrow", "Narrow", "u-md-size1of3", string.Empty, "epi-icon__layout--one-third");
                });

            services.AddOpenIDConnect<ApplicationUser>(
                useDevelopmentCertificate: true,
                signingCertificate: null,
                encryptionCertificate: null,
                createSchema: true,
                options =>
                {
                    options.RequireHttps = false; // Do not use in production

                    options.Applications.Add(new OpenIDConnectApplication
                    {
                        ClientId = "frontend",
                        Scopes = { "openid", "offline_access", "profile", "email", "roles", ContentDeliveryApiOptionsDefaults.Scope },
                        PostLogoutRedirectUris = { _frontendUri },
                        RedirectUris =
                        {
                            new Uri(_frontendUri, "/login-callback"),
                            new Uri(_frontendUri, "/login-renewal"),
                        },
                    });

                    options.Applications.Add(new OpenIDConnectApplication
                    {
                        ClientId = "cli",
                        ClientSecret = "cli",
                        Scopes = { ContentDefinitionsApiOptionsDefaults.Scope },
                    });
                });

            services.AddContentDefinitionsApi(OpenIDConnectOptionsDefaults.AuthenticationScheme);
            services.AddContentDeliveryApi(OpenIDConnectOptionsDefaults.AuthenticationScheme);
            services.ConfigureForContentDeliveryClient();

            services.AddHostedService<ProvisionDatabase>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles();
            app.UseRouting();

            app.UseCors(b => b
                .WithOrigins(new[] { "http://localhost:8080" })
                .WithExposedContentDeliveryApiHeaders()
                .WithExposedContentDefinitionApiHeaders()
                .WithHeaders("Authorization")
                .AllowAnyMethod()
                .AllowCredentials());

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapContent();
            });
        }
    }
}
