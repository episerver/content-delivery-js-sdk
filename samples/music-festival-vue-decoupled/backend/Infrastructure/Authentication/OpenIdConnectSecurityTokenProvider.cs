using System.Collections.Generic;
using System.Threading;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin.Security.Jwt;

namespace MusicFestival.CMS.Infrastructure.Authentication
{
    /// <summary>
    ///  Provides security key information for open id configuration.
    /// </summary>
    public class OpenIdConnectSecurityTokenProvider : IIssuerSecurityKeyProvider
    {
        private readonly ConfigurationManager<OpenIdConnectConfiguration> _configManager;

        /// <summary>
        /// Initialize a new instance of <see cref="OpenIdConnectSecurityTokenProvider"/>.
        /// </summary>
        /// <param name="metadataEndpoint">Metadata address.</param>
        /// <param name="requireHttps">Indicates that https is require or not.</param>
        public OpenIdConnectSecurityTokenProvider(string metadataEndpoint, bool requireHttps = true)
        {
            _configManager = new ConfigurationManager<OpenIdConnectConfiguration>(
                metadataEndpoint,
                new OpenIdConnectConfigurationRetriever(),
                new HttpDocumentRetriever()
                {
                    RequireHttps = requireHttps
                });
        }

        /// <summary>
        /// Gets the issuer the credentials are for.
        /// </summary>
        /// <value>
        /// The issuer the credentials are for.
        /// </value>
        public string Issuer => RetrieveMetadata().Issuer;

        /// <summary>
        /// Gets all known security tokens.
        /// </summary>
        /// <value>
        /// All known security tokens.
        /// </value>
        public IEnumerable<SecurityKey> SecurityKeys => RetrieveMetadata().SigningKeys;

        private OpenIdConnectConfiguration RetrieveMetadata()
        {
            return _configManager.GetConfigurationAsync(CancellationToken.None)
                .GetAwaiter()
                .GetResult();
        }
    }
}
