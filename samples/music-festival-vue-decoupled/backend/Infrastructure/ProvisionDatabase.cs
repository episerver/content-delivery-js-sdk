using EPiServer.Cms.Shell;
using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.Personalization;
using EPiServer.Security;
using EPiServer.ServiceLocation;
using EPiServer.Shell.Security;
using EPiServer.Web;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.Linq;

namespace MusicFestival.CMS.Infrastructure
{
    [InitializableModule]
    [ModuleDependency(typeof(EPiServer.Web.InitializationModule))]
    public class ProvisionDatabase : IInitializableModule
    {
        private IContentSecurityRepository _securityRepository;
        private ISiteDefinitionRepository _siteDefinitionRepository;
        private UIUserProvider _userProvider;
        private UIRoleProvider _roleProvider;

        public void Initialize(InitializationEngine context)
        {
            _securityRepository = context.Locate.Advanced.GetInstance<IContentSecurityRepository>();
            _siteDefinitionRepository = context.Locate.Advanced.GetInstance<ISiteDefinitionRepository>();

            AddUsersAndRoles();
            AddFrontendWebsite();
        }

        public void Uninitialize(InitializationEngine context) { }

        #region Users and Roles

        private void AddUsersAndRoles()
        {
            if (UIRoleProvider.RoleExists("WebAdmins"))
            {
                return;
            }

            var password = "sparr0wHawk";

            AddRole("WebAdmins", AccessLevel.FullAccess);
            AddRole("WebEditors", AccessLevel.FullAccess ^ AccessLevel.Administer);

            AddUser("cmsadmin", "Administrator Administrator", password, new[] { "WebEditors", "WebAdmins" });
            AddUser("alfred", "Alfred Andersson", password, new[] { "WebEditors", "WebAdmins" });
            AddUser("emil", "Emil Svensson", password, new[] { "WebEditors" });
            AddUser("ida", "Ida Svensson", password, new[] { "WebEditors" });
            AddUser("lina", "Lina Lindström", password, new[] { "WebEditors" });
        }

        private void AddUser(string userName, string fullName, string passWord, string[] roleNames)
        {
            if (UIUserProvider.GetUser(userName) == null)
            {
                var email = string.Format("epic-{0}@mailinator.com", userName);
                IEnumerable<string> erros;
                UIUserCreateStatus status;
                var user = UIUserProvider.CreateUser(userName, passWord, email, null, null, true, out status, out erros);
                UIRoleProvider.AddUserToRoles(user.Username, roleNames);

                var profile = EPiServerProfile.Get(user.Username);
                var nameParts = fullName.Split(' ');
                profile["FirstName"] = nameParts[0];
                profile["LastName"] = nameParts[1];
                // E-mail must be part of profile properties to be resolved by QueryableNotificationUsersImpl
                profile["Email"] = email;
                profile.Save();
            }
        }

        private void AddRole(string roleName, AccessLevel accessLevel)
        {
            if (!UIRoleProvider.RoleExists(roleName))
            {
                UIRoleProvider.CreateRole(roleName);

                var permissions = (IContentSecurityDescriptor)_securityRepository.Get(ContentReference.RootPage).CreateWritableClone();
                permissions.AddEntry(new AccessControlEntry(roleName, accessLevel));

                _securityRepository.Save(ContentReference.RootPage, permissions, SecuritySaveType.Replace);
                _securityRepository.Save(ContentReference.WasteBasket, permissions, SecuritySaveType.Replace);
            }
        }

        private UIUserProvider GetDefaultUserProvider()
        {
            UIUserProvider userProvider = null;
            try
            {
                // Throws if not Owin is configured.
                ServiceLocator.Current.TryGetExistingInstance(out userProvider);
                return userProvider;
            }
            catch { }

            // When aspnet identity the provider is not in the service locator before owin is set up, then we create our own.
            var userManager = new ApplicationUserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext<ApplicationUser>("EPiServerDB")));
            userProvider = new ApplicationUserProvider<ApplicationUser>(() => userManager);
            return userProvider;
        }

        private UIRoleProvider GetDefaultRoleProvider()
        {
            UIRoleProvider roleProvider = null;
            try
            {
                // Throws if not Owin is configured.
                ServiceLocator.Current.TryGetExistingInstance(out roleProvider);
                return roleProvider;
            }
            catch { }

            // When aspnet identity the provider is not in the service locator before owin is set up, then we create our own.
            var userManager = new ApplicationUserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext<ApplicationUser>("EPiServerDB")));
            var roleManager = new ApplicationRoleManager<ApplicationUser>(new RoleStore<IdentityRole>(new ApplicationDbContext<ApplicationUser>("EPiServerDB")));
            roleProvider = new ApplicationRoleProvider<ApplicationUser>(() => userManager, () => roleManager);
            return roleProvider;
        }

        private UIUserProvider UIUserProvider => _userProvider ?? (_userProvider = GetDefaultUserProvider());

        private UIRoleProvider UIRoleProvider => _roleProvider ?? (_roleProvider = GetDefaultRoleProvider());

        #endregion

        #region Sites

        private void AddFrontendWebsite()
        {
            var site = _siteDefinitionRepository
                .List()
                .First()
                .CreateWritableClone();

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
        }

        #endregion
    }
}