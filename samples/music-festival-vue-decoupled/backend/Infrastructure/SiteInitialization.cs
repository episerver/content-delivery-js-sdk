using EPiServer.ContentApi.Cms;
using EPiServer.ContentApi.Core.Configuration;
using EPiServer.Core.Internal;
using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using System.Linq;
using System.Web.Mvc;

namespace MusicFestival.CMS.Infrastructure
{
    [InitializableModule]
    [ModuleDependency(typeof(ServiceContainerInitialization), typeof(ContentApiCmsInitialization))]
    public class SiteInitialization : IConfigurableModule
    {
        public void ConfigureContainer(ServiceConfigurationContext context)
        {
            DependencyResolver.SetResolver(new StructureMapDependencyResolver(context.StructureMap()));

            context.Services.ConfigureForExternalTemplates();
            context.Services.ConfigureForContentDeliveryClient();
            context.Services.Configure<ExternalApplicationOptions>(o => o.OptimizeForDelivery = true);
            context.Services.Configure<ContentApiConfiguration>(config =>
            {
                config.EnablePreviewFeatures = true;

                // Set MinimumRoles to empty to allow anonymous calls (for visitors to view site in view mode).
                config.Default()
                    .SetMinimumRoles(string.Empty)
                    .SetRequiredRole(string.Empty)
                    .SetClients(new[]
                    {
                        new ContentApiClient
                        {
                            ClientId = "music-festival",
                            AccessControlAllowOrigin = "https://localhost:8080"
                        }
                    });
            });
        }

        public void Initialize(InitializationEngine context)
        {
            var options = ServiceLocator.Current.GetInstance<DisplayOptions>();
            options
                .Add("full", "Full", ContentAreaTags.FullWidth, "", "epi-icon__layout--full")
                .Add("wide", "Wide", ContentAreaTags.TwoThirdsWidth, "", "epi-icon__layout--two-thirds")
                .Add("half", "Half", ContentAreaTags.HalfWidth, "", "epi-icon__layout--half")
                .Add("narrow", "Narrow", ContentAreaTags.OneThirdWidth, "", "epi-icon__layout--one-third");

            AreaRegistration.RegisterAllAreas();
        }

        public void Uninitialize(InitializationEngine context) { }

        public static class ContentAreaTags
        {
            public const string FullWidth = "u-md-sizeFull";
            public const string TwoThirdsWidth = "u-md-size2of3";
            public const string HalfWidth = "u-md-size1of2";
            public const string OneThirdWidth = "u-md-size1of3";
            public const string NoRenderer = "norenderer";
        }
    }
}