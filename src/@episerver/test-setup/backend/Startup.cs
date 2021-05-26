using EPiServer.DependencyInjection;
using EPiServer.ServiceLocation;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Backend
{
    public class Startup
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;

        public Startup(IWebHostEnvironment environment, IConfiguration configuration)
        {
            _configuration = configuration;
            _environment = environment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.ConfigureDataAccess(_environment.ContentRootPath);
            services.ConfigureDisplayOptions();

            // services.AddAuthentication(
            //     _configuration.GetValue<string>("Login:Authority"),
            //     _configuration.GetValue<string>("Login:ClientId"),
            //     _configuration.GetValue<string>("Login:ClientSecret"));

            services.AddMvc();

            services.AddCms();
            services.AddTinyMce();
            services.AddEmbeddedLocalization<Startup>();
            services.AddContentDeliveryApi();
            services.AddContentDefinitionsApi(options => 
            {
                options.DisableScopeValidation = true;
            });
            //services.AddHostedService<ProvisionDatabase>();
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
                endpoints.MapContent();
            });
        }
    }
}
