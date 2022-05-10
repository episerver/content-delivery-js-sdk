using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.Security;
using EPiServer.Shell.Security;
using EPiServer.Web;

namespace Backend;

public class ProvisionDatabase : IHostedService
{
    private readonly ILogger<ProvisionDatabase> _logger;
    private readonly ISiteDefinitionRepository _siteDefinitionRepository;
    private readonly IContentSecurityRepository _contentSecurityRepository;
    private readonly UIUserProvider _userProvider;
    private readonly UIRoleProvider _roleProvider;

    public ProvisionDatabase(
        ILogger<ProvisionDatabase> logger,
        ISiteDefinitionRepository siteDefinitionRepository,
        IContentSecurityRepository contentSecurityRepository,
        UIUserProvider userProvider,
        UIRoleProvider roleProvider)
    {
        _logger = logger;
        _siteDefinitionRepository = siteDefinitionRepository;
        _contentSecurityRepository = contentSecurityRepository;
        _userProvider = userProvider;
        _roleProvider = roleProvider;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await AddUsersAndRolesAsync();
        await AddPrimarySiteHost();
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private async Task AddUsersAndRolesAsync()
    {
        _logger.LogInformation("Provisioning users and roles.");

        await AddRole("WebAdmins", AccessLevel.FullAccess);
        await AddRole("WebEditors", AccessLevel.FullAccess ^ AccessLevel.Administer);

        await AddUser("bob", "bob", "WebEditors", "WebAdmins");
        await AddUser("alice", "alice", "WebEditors");
    }

    private async Task AddUser(string userName, string password, params string[] roleNames)
    {
        _logger.LogInformation($"Adding user {userName}.");

        if (await _userProvider.GetUserAsync(userName) is not null)
        {
            _logger.LogInformation($"User {userName} already exists.");
            return;
        }

        var email = $"epic-{userName}@mailinator.com";
        await _userProvider.CreateUserAsync(userName, password, email, null, null, true);
        await _roleProvider.AddUserToRolesAsync(userName, roleNames);
    }

    private async Task AddRole(string roleName, AccessLevel accessLevel)
    {
        _logger.LogInformation($"Adding role {roleName}.");

        if (await _roleProvider.RoleExistsAsync(roleName))
        {
            _logger.LogInformation($"Role {roleName} already exists.");
            return;
        }

        await _roleProvider.CreateRoleAsync(roleName);

        var permissions = (IContentSecurityDescriptor)_contentSecurityRepository.Get(ContentReference.RootPage).CreateWritableClone();
        permissions.AddEntry(new AccessControlEntry(roleName, accessLevel));

        _contentSecurityRepository.Save(ContentReference.RootPage, permissions, SecuritySaveType.Replace);
        _contentSecurityRepository.Save(ContentReference.WasteBasket, permissions, SecuritySaveType.Replace);
    }

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
