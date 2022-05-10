using EPiServer.Web;
using EPiServer;
using EPiServer.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAccess;
using EPiServer.Security;
using EPiServer.DataAbstraction;

namespace Backend;

public class CreateTestContentFirstRequestInitializer : IBlockingFirstRequestInitializer
{
    private IContentSecurityRepository? _contentSecurityRepository;
    private IContentRepository? _contentRepository;

    public bool CanRunInParallel => false;

    public Task InitializeAsync(HttpContext httpContext)
    {
        _contentSecurityRepository = httpContext.RequestServices.GetService<IContentSecurityRepository>();
        _contentRepository = httpContext.RequestServices.GetService<IContentRepository>();

        var page = _contentRepository!.GetDefault<TestPage>(ContentReference.StartPage);
        page.Name = "Protected";

        var contentReference = _contentRepository.Save(page, SaveAction.Publish, AccessLevel.NoAccess);

        var permissions = (IContentSecurityDescriptor)_contentSecurityRepository!.Get(contentReference).CreateWritableClone();
        permissions.ToLocal(false);
        permissions.AddEntry(new AccessControlEntry("bob", AccessLevel.FullAccess, SecurityEntityType.User));

        _contentSecurityRepository.Save(contentReference, permissions, SecuritySaveType.Replace);

        return Task.CompletedTask;
    }
}

[ContentType]
public class TestPage : PageData
{ }
