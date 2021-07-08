using EPiServer.DependencyInjection;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace Backend
{
    public class Startup
    {
        internal static readonly string ConnectionString = $"Data Source=(localdb)\\MSSQLLocalDB;Database=db{Guid.NewGuid()};Integrated Security=true;MultipleActiveResultSets=true";
        
        private readonly IWebHostEnvironment _environment;

        public Startup(IWebHostEnvironment environment)
        {
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

        public void Configure(
            IApplicationBuilder app, 
            IWebHostEnvironment env, 
            Microsoft.Extensions.Hosting.IHostApplicationLifetime lifetime)
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

            lifetime.ApplicationStopping.Register(OnShutdown);
        }

        private void OnShutdown()
        {
            DatabaseHelper.Drop(ConnectionString);
        }
    }
}
