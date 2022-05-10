using EPiServer.Web;

namespace MusicFestival.Backend;

public class ProvisionDatabase : IHostedService
{
    private readonly ILogger<ProvisionDatabase> _logger;
    private readonly ISiteDefinitionRepository _siteDefinitionRepository;

    public ProvisionDatabase(
        ILogger<ProvisionDatabase> logger,
        ISiteDefinitionRepository siteDefinitionRepository)
    {
        _logger = logger;
        _siteDefinitionRepository = siteDefinitionRepository;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await AddPrimarySiteHost();
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private Task AddPrimarySiteHost()
    {
        _logger.LogInformation("Provisioning primary site host.");

        var site = _siteDefinitionRepository
            .List()
            .FirstOrDefault();

        if (site is null)
        {
            _logger.LogInformation("Primary site host already exists.");

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

        _siteDefinitionRepository.Save(site);

        return Task.CompletedTask;
    }
}
