using EPiServer.Cms.Shell;
using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.ContentApi.Cms;
using EPiServer.ContentApi.Core.DependencyInjection;
using EPiServer.Core;
using EPiServer.Security;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using EPiServer.Web.Routing;

namespace MusicFestival.Backend;

public class Startup
{
    private readonly IWebHostEnvironment _webHostingEnvironment;
    private readonly Uri _frontendUri = new("http://localhost:8080");

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
            .AddAdminUserRegistration()
            .AddEmbeddedLocalization<Program>()
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

        services.Configure<UIOptions>(options => options.UsePreviewTokens = true);

        services.AddContentDeliveryApi(PreviewTokenOptions.SchemeName);
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
            .WithOrigins(["http://localhost:8080"])
            .WithExposedContentDeliveryApiHeaders()
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

        app.UseStatusCodePages(context =>
        {
            if (context.HttpContext.Response.HasStarted == false &&
                context.HttpContext.Response.StatusCode == StatusCodes.Status404NotFound &&
                context.HttpContext.Request.Path == "/")
            {
                context.HttpContext.Response.Redirect("/episerver/cms");
            }

            return Task.CompletedTask;
        });
    }
}
