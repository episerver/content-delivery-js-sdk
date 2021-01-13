using EPiServer.Cms.Shell;
using EPiServer.Enterprise.Internal;
using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.Web;
using System;
using System.Linq;
using System.Web;

namespace MusicFestival.CMS.Infrastructure
{
    [InitializableModule]
    [ModuleDependency(typeof(DefaultSiteContentInitialization))]
    public class ProvisionDatabase : IInitializableHttpModule
    {
        private static bool hasProvisioned;

        private ISiteDefinitionRepository _siteDefinitionRepository;

        public void Initialize(InitializationEngine context)
        {
            _siteDefinitionRepository = context.Locate.Advanced.GetInstance<ISiteDefinitionRepository>();
        }

        public void Uninitialize(InitializationEngine context) { }

        public void InitializeHttpEvents(HttpApplication application)
        {
            application.BeginRequest += ApplicationBeginRequest;
        }

        private void ApplicationBeginRequest(object sender, EventArgs e)
        {
            if (!hasProvisioned)
            {
                hasProvisioned = AddFrontendWebsite();
            }
        }

        private bool AddFrontendWebsite()
        {
            var site = _siteDefinitionRepository
                .List()
                .FirstOrDefault();

            if (site is null)
            {
                return false;
            }
            else
            {
                site = site.CreateWritableClone();
            }

            if (!site.Hosts.Any(x => x.Type == HostDefinitionType.Primary))
            {
                var editHost = site.Hosts.First(x => x.Name != "*");
                editHost.Type = HostDefinitionType.Edit;

                site.Hosts.Add(new HostDefinition
                {
                    Type = HostDefinitionType.Primary,
                    Name = "localhost:8080"
                });
            }

            _siteDefinitionRepository.Save(site);

            return true;
        }
    }
}