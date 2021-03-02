namespace MusicFestival.CMS.Infrastructure.Authentication
{
    /// <summary>
    /// Default values related to OpenIdConnect configuration.
    /// </summary>
    public static class OpenIdConnectOptionsDefaults
    {
        /// <summary>
        /// The claim type to use for name claims.
        /// </summary>
        public const string UsernameClaimType = "email";

        /// <summary>
        /// TThe claims with which to populate the claims identity.
        /// </summary>
        public const string NameClaimType = "name";

        /// <summary>
        /// The claim type to use for role claims.
        /// </summary>
        public const string RoleClaimType = "role";

        /// <summary>
        /// The default Content Definitions API resource name.
        /// </summary>
        public const string ContentDefinitionsApiName = "epi_content_definitions";

        /// <summary>
        /// The default Content Delivery API resource name.
        /// </summary>
        public const string ContentDeliveryApiName = "epi_content_delivery";

        /// <summary>
        /// The default Content Management API resource name.
        /// </summary>
        public const string ContentManagementApiName = "epi_content_management";
    }
}
