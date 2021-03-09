using System.Collections.Generic;

namespace MusicFestival.CMS.Infrastructure.Authentication
{
    /// <summary>
    /// Configuration options for OpenID Connect.
    /// </summary>
    public class OpenIdConnectOptions
    {
        /// <summary>
        /// Gets or sets the Authority to use when making OpenID Connect calls.
        /// </summary>
        public string Authority { get; set; }

        /// <summary>
        /// Gets or sets the 'client_id'.
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        /// Gets or sets the 'client_secret'.
        /// </summary>
        public string ClientSecret { get; set; }

        /// <summary>
        /// Gets or sets the redirect uri.
        /// </summary>
        public string RedirectUri { get; set; }

        /// <summary>
        /// Gets or sets the valid API audiences (API resouce names).
        /// </summary>
        public IEnumerable<string> ValidAudiences { get; set; } = new[]
        {
            OpenIdConnectOptionsDefaults.ContentDefinitionsApiName,
            OpenIdConnectOptionsDefaults.ContentDeliveryApiName,
            OpenIdConnectOptionsDefaults.ContentManagementApiName,
        };

        /// <summary>
        /// Gets or sets the name that defines the user name claim type.
        /// </summary>
        public string UsernameClaimType { get; set; } = OpenIdConnectOptionsDefaults.UsernameClaimType;

        /// <summary>
        /// Gets or sets the name that defines the name claim type.
        /// </summary>
        public string NameClaimType { get; set; } = OpenIdConnectOptionsDefaults.NameClaimType;

        /// <summary>
        /// Gets or sets the role claim type.
        /// </summary>
        public string RoleClaimType { get; set; } = OpenIdConnectOptionsDefaults.RoleClaimType;
    }
}
