using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.ContentApi.Cms.Configuration;
using EPiServer.ContentApi.Core.Configuration;
using EPiServer.ContentDefinitionsApi;
using EPiServer.Core;
using EPiServer.Data;
using EPiServer.DependencyInjection;
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
        private readonly IWebHostEnvironment _environment;
        private readonly Uri _frontendUri = new Uri("http://localhost:3000");

        public Startup(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var connectionstring = $"Server=localhost;Database=EPiServerDB_4a713259;User Id=EPiServerDB_4a713259User;Password=9ul5TsYeS%P1WuAULf7$juuuu;MultipleActiveResultSets=True";

            services.AddCmsAspNetIdentity<ApplicationUser>(configureIdentity: options =>
            {
                // Use sane passwords
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredUniqueChars = 0;
                options.Password.RequiredLength = 3; // Do not use in production
            });

            services
                .AddCms()
                .AddEmbeddedLocalization<Startup>()
                .ConfigureForExternalTemplates()
                .Configure<DataAccessOptions>(options => options.SetConnectionString(connectionstring))
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
                        Scopes = { "openid", "offline_access", "profile", "email", "roles", ContentDeliveryAuthorizationOptionsDefaults.Scope },
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

            services.AddContentDeliveryApi(OpenIDConnectOptionsDefaults.AuthenticationScheme, options =>
            {
                options.ExpandedBehavior = ExpandedLanguageBehavior.RequestedLanguage;
                options.FlattenPropertyModel = true;
                options.ForceAbsolute = true;
            });

            services.AddContentDefinitionsApi(OpenIDConnectOptionsDefaults.AuthenticationScheme);

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

            // TODO: Enable CORS for all APIs with our own method
            app.UseCors(b => b
                .WithOrigins(new[] { "http://localhost:3000" })
                .AllowAnyHeader()
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
