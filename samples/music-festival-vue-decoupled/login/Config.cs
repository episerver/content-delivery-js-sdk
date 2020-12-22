using IdentityModel;
using IdentityServer4.Models;
using System;
using System.Collections.Generic;

namespace IdentityServer
{
    public static class Config
    {
        private static readonly int TokenLifeTime = (int)TimeSpan.FromHours(8).TotalSeconds;

        public static IEnumerable<IdentityResource> Ids =>
            new IdentityResource[]
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email(),
                new IdentityResource
                {
                    Name = "role",
                    DisplayName = "Roles",
                    Description = "Allow the service access to your user roles.",
                    UserClaims = { "role" },
                    ShowInDiscoveryDocument = true,
                    Required = false,
                }
            };

        public static IEnumerable<ApiResource> Apis =>
            new ApiResource[]
            {
               new ApiResource("epi_content_delivery", "Episerver Content Delivery")
               {
                   ApiSecrets =
                   {
                       new Secret("epi_content_delivery".Sha256()),
                   },
                   UserClaims =
                   {
                       JwtClaimTypes.Email,
                       JwtClaimTypes.EmailVerified,
                       JwtClaimTypes.FamilyName,
                       JwtClaimTypes.GivenName,
                       JwtClaimTypes.Name,
                       JwtClaimTypes.Role,
                       JwtClaimTypes.Subject
                   }
               },
               new ApiResource("epi_content_management", "Episerver Content Management")
               {
                   ApiSecrets =
                   {
                       new Secret("epi_content_management".Sha256()),
                   }
               },
               new ApiResource("epi_definitions", "Episerver Definitions")
               {
                   ApiSecrets =
                   {
                       new Secret("epi_definitions".Sha256()),
                   }
               }
            };

        public static IEnumerable<Client> Clients =>
            new Client[]
            {
                new Client
                {
                    ClientId = "epi_definitions_cli",
                    ClientName = "Episerver Definitions CLI",
                    ClientSecrets = { new Secret("epi_definitions_cli".Sha256()) },
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    AllowedScopes = { "epi_content_delivery", "epi_definitions" },
                    AccessTokenLifetime = TokenLifeTime,
                    IdentityTokenLifetime = TokenLifeTime
                },
                new Client
                {
                    ClientId = "festival-management",
                    ClientName = "Music Festival Management",
                    ClientSecrets = { new Secret("festival-management".Sha256()) },
                    AllowedGrantTypes = GrantTypes.Hybrid, // Full framework doesn't handle code flow automatically
                    AllowedScopes = { "openid", "profile", "email", "role" },
                    AllowOfflineAccess = true,
                    FrontChannelLogoutUri = "https://localhost:44340/signout-oidc",
                    PostLogoutRedirectUris = { "https://localhost:44340/signout-oidc" },
                    RedirectUris = { "https://localhost:44340/signin-oidc" },
                    RequireClientSecret = false,
                    RequireConsent = false,
                    AccessTokenLifetime = TokenLifeTime,
                    IdentityTokenLifetime = TokenLifeTime
                },
                new Client
                {
                    ClientId = "festival",
                    ClientName = "Music Festival",
                    ClientSecrets = { new Secret("festival".Sha256()) },
                    AllowedGrantTypes = GrantTypes.Code,
                    AllowedScopes = { "openid", "profile", "email", "role", "epi_content_delivery", "epi_definitions" },
                    AllowOfflineAccess = true,
                    AllowedCorsOrigins =  { "https://localhost:8080" },
                    FrontChannelLogoutUri = "https://localhost:8080",
                    PostLogoutRedirectUris = { "https://localhost:8080" },
                    RedirectUris = { "https://localhost:8080/login-callback" },
                    RequireClientSecret = false,
                    RequireConsent = false,
                    RequirePkce = true,
                    AccessTokenLifetime = TokenLifeTime,
                    IdentityTokenLifetime = TokenLifeTime,
                }
            };
    }
}
