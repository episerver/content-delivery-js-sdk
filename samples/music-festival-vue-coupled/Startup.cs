using EPiServer.Cms.Shell;
using EPiServer.Cms.Shell.UI;
using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.ContentApi.Core.DependencyInjection;

namespace MusicFestival;

public class Startup
{
    private readonly IWebHostEnvironment _webHostingEnvironment;

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
            .AddEmbeddedLocalization<ProvisionDatabase>()
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

        services.AddContentDeliveryApi();
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

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapContent();
            endpoints.MapFallbackToFile("index.html");
        });
    }
}
