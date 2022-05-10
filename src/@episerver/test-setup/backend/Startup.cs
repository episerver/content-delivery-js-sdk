using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.ContentApi.Core.Configuration;
using EPiServer.ContentApi.Core.DependencyInjection;
using EPiServer.ContentApi.Core.Serialization;
using EPiServer.ContentDefinitionsApi;
using EPiServer.Core;
using EPiServer.Data;
using EPiServer.OpenIDConnect;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection.Extensions;
using static Microsoft.Extensions.DependencyInjection.ServiceDescriptor;

namespace Backend;

public class Startup
{
    internal static readonly string ConnectionString = $"Data Source=(localdb)\\MSSQLLocalDB;Database=db{Guid.NewGuid()};Integrated Security=true;MultipleActiveResultSets=true";

    public Startup()
    { }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCmsAspNetIdentity<ApplicationUser>(configureIdentity: options =>
        {
            // Use sane passwords
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequiredUniqueChars = 0;
            options.Password.RequiredLength = 3;
        });

        services
            .AddCms()
            .AddEmbeddedLocalization<Startup>()
            .ConfigureForExternalTemplates()
            .Configure<ExternalApplicationOptions>(options => options.OptimizeForDelivery = true)
            .Configure<DataAccessOptions>(options =>
            {
                options.SetConnectionString(ConnectionString);
                options.CreateDatabaseSchema = true;
            });

        services.AddOpenIDConnect<ApplicationUser>(
            useDevelopmentCertificate: true, 
            signingCertificate: null, 
            encryptionCertificate: null, 
            createSchema: true, 
            options =>
            {
                options.RequireHttps = false;
                options.Applications.Add(new OpenIDConnectApplication
                {
                    ClientId = "cli",
                    ClientSecret = "cli",
                    Scopes = { ContentDefinitionsApiOptionsDefaults.Scope },
                });
            });

        services.Configure<AuthenticationOptions>(options =>
        {
            options.AddScheme<UsernameAuthenticationHandler>(
                UsernameAuthenticationHandler.SchemeName,
                UsernameAuthenticationHandler.DisplayName);
        });

        services.AddContentDefinitionsApi(OpenIDConnectOptionsDefaults.AuthenticationScheme);
        services.AddContentDeliveryApi(UsernameAuthenticationHandler.SchemeName);

        services.ConfigureContentApiOptions(options  =>
        {
            options.EnablePreviewFeatures = true;
            options.EnablePreviewMode = true;
            options.ExpandedBehavior = ExpandedLanguageBehavior.RequestedLanguage;
            options.FlattenPropertyModel = true;
            options.ForceAbsolute = true;
            options.IncludeSiteHosts = true;
        });

            services.AddHostedService<ProvisionDatabase>();
            services.TryAddEnumerable(Singleton(typeof(IFirstRequestInitializer), typeof(CreateTestContentFirstRequestInitializer)));
            services.AddSingleton<IContentApiModelFilter, CustomHeaderContentApiFilter>();
        }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IHostApplicationLifetime lifetime)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseStaticFiles();
        app.UseRouting();
        app.UseCors();
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapContent();
        });

        lifetime.ApplicationStopping.Register(OnShutdown);
    }

    private void OnShutdown()
    {
        DatabaseHelper.Drop(ConnectionString);
    }
}
