using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.ContentApi.Cms.Configuration;
using EPiServer.ContentApi.Core.Configuration;
using EPiServer.ContentApi.OpenIDConnect;
using EPiServer.ContentDefinitionsApi;
using EPiServer.Core;
using EPiServer.Data;
using EPiServer.DependencyInjection;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace MusicFestival.Backend
{
    public class Startup
    {
        private readonly IWebHostEnvironment _environment;
        private readonly Uri _frontendUri = new Uri("https://localhost:8080");

        public Startup(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            var dbPath = Path.Combine(_environment.ContentRootPath, "App_Data\\musicfestival.mdf");
            var connectionstring = $"Data Source=(LocalDb)\\MSSQLLocalDB;AttachDbFilename={dbPath};Initial Catalog=musicfestival;Integrated Security=True;Connect Timeout=30;MultipleActiveResultSets=True";

            services.AddCms();
            services.AddEmbeddedLocalization<Startup>();
            services.Configure<DataAccessOptions>(options => options.SetConnectionString(connectionstring));
            services.Configure<ExternalApplicationOptions>(options => options.OptimizeForDelivery = true);
            services.ConfigureForExternalTemplates();

            services.Configure<DisplayOptions>(options =>
            {
                options
                    .Add("full", "Full", "u-md-sizeFull", string.Empty, "epi-icon__layout--full")
                    .Add("wide", "Wide", "u-md-size2of3", string.Empty, "epi -icon__layout--two-thirds")
                    .Add("half", "Half", "u-md-size1of2", string.Empty, "epi-icon__layout--half")
                    .Add("narrow", "Narrow", "u-md-size1of3", string.Empty, "epi-icon__layout--one-third");
            });

            services.AddCmsAspNetIdentity<ApplicationUser>(configureIdentity: options =>
            {
                // Use sane claim types
                // TODO: Should we configure this automatically?
                options.ClaimsIdentity.EmailClaimType = Claims.Email;
                options.ClaimsIdentity.RoleClaimType = Claims.Role;
                options.ClaimsIdentity.UserNameClaimType = Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = Claims.Subject;

                // Use sane passwords.
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredUniqueChars = 0;
                options.Password.RequiredLength = 3; // Do not use in production
            });


            services.AddDbContext<OpenIDConnectDbContext>(); // TODO: Should not be needed
            services.AddHostedService<OpenIdDictDatabaseTableCreator>(); // TODO: Should not be needed
            services.AddContentApiOpenIDConnect<OpenIDConnectDbContext, ApplicationUser>(options =>
            {
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
                options.EnablePreviewMode = true;
                options.FlattenPropertyModel = true;
                options.ForceAbsolute = true;
                options.ValidateTemplateForContentUrl = false;
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

            // TODO: Enable CORS for all APIs with our method
            app.UseCors(b => b
                .WithOrigins(new[] { "https://localhost:8080" })
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
