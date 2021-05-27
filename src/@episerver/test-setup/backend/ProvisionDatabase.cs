using EPiServer.Web;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Backend
{
    public class ProvisionDatabase : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;

        public ProvisionDatabase(IServiceProvider serviceProvider)
           => _serviceProvider = serviceProvider;

        public Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();

            var siteDefinitionRepository = scope.ServiceProvider.GetRequiredService<ISiteDefinitionRepository>();

            var site = siteDefinitionRepository
                .List()
                .FirstOrDefault();

            if (site is null)
            {
                return Task.CompletedTask;
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

            siteDefinitionRepository.Save(site);

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
