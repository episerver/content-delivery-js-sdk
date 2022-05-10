using System.Security.Claims;
using EPiServer.Cms.UI.AspNetIdentity;
using Microsoft.AspNetCore.Authentication;

namespace Backend;

/// <summary>
/// A workaround to pass a username in the bearer token directly.
/// This makes testing easier as we don't have to obtain a real 
/// access token first.
/// </summary>
public class UsernameAuthenticationHandler : IAuthenticationHandler
{
    public const string SchemeName = "UsernameAuthentication";
    public const string DisplayName = "Username Authentication";

    private ClaimsPrincipal? _principal;

    public async Task InitializeAsync(AuthenticationScheme scheme, HttpContext context)
    {
        var bearer = context.Request.Headers["Authorization"];

        if (string.IsNullOrEmpty(bearer))
        {
            return;
        }

        var username = bearer.ToString().Replace("Bearer ", string.Empty);
        var signInManager = context.RequestServices.GetService<ApplicationSignInManager<ApplicationUser>>();
        var user = await signInManager!.UserManager.FindByNameAsync(username);

        if (user is not null)
        {
            _principal = await signInManager.CreateUserPrincipalAsync(user);
        }
    }

    public Task<AuthenticateResult> AuthenticateAsync()
    {
        if (_principal is not null)
        {
            return Task.FromResult(AuthenticateResult.Success(
              new AuthenticationTicket(_principal, SchemeName)));
        }
        else
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }
    }

    public Task ChallengeAsync(AuthenticationProperties? properties) => Task.CompletedTask;

    public Task ForbidAsync(AuthenticationProperties? properties) => Task.CompletedTask;
}
