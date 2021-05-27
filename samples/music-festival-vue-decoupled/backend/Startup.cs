using EPiServer.DependencyInjection;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MusicFestival.Backend
{
    public class Startup
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;

        private const string corsPolicyName = "cors";

        public Startup(IWebHostEnvironment environment, IConfiguration configuration)
        {
            _configuration = configuration;
            _environment = environment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.ConfigureDataAccess(_environment.ContentRootPath);
            services.ConfigureDisplayOptions();

            services.AddAuthentication(
                _configuration.GetValue<string>("Login:Authority"),
                _configuration.GetValue<string>("Login:ClientId"),
                _configuration.GetValue<string>("Login:ClientSecret"));

            services.AddMvc();
            services.AddCors(options =>
            {
                options.AddPolicy(
                    corsPolicyName,
                    // TODO: Remove when policy factory exists in library!
                    new CorsPolicy
                    {
                        Headers =
                        {
                            "Authorization",
                            // TODO: More headers needed?
                        },
                        ExposedHeaders =
                        {
                            "x-epi-continuation",
                            "x-epi-contentguid",
                            "x-epi-branch",
                            "x-epi-siteid",
                            "x-epi-startpageguid",
                            "x-epi-remainingroute",
                            "x-epi-contextmode",
                        },
                        Origins = { "https://localhost:8080" },
                        SupportsCredentials = true,
                    });
            });

            services.AddCms();
            services.AddTinyMce();
            services.AddEmbeddedLocalization<Startup>();
            services.AddContentDeliveryApi();
            services.AddContentDefinitionsApi();
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
            app.UseCors();
            app.UseAuthenticationWithMultipleSchemes();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints
                    .MapControllers()
                    // TODO: Remove when method exists in library!
                    .RequireCorsForNamespace("EPiServer.ContentApi.Cms", corsPolicyName);

                endpoints.MapContent();
            });
        }
    }
}
