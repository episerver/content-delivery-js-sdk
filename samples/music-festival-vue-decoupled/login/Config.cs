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
                    Name = "roles",
                    DisplayName = "Roles",
                    Description = "Allow access to your user roles.",
                    UserClaims = { JwtClaimTypes.Role },
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
               new ApiResource("epi_content_definitions", "Episerver Content Definitions")
               {
                   ApiSecrets =
                   {
                       new Secret("epi_content_definitions".Sha256()),
                   }
               }
            };

        public static IEnumerable<Client> Clients =>
            new Client[]
            {
                new Client
                {
                    ClientId = "content-definitions-cli",
                    ClientName = "Episerver Content Definitions CLI",
                    ClientSecrets = { new Secret("content-definitions-cli".Sha256()) },
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    AllowedScopes = { "epi_content_definitions" },
                    AccessTokenLifetime = TokenLifeTime,
                    IdentityTokenLifetime = TokenLifeTime
                },
                new Client
                {
                    ClientId = "backend",
                    ClientName = "Music Festival Backend",
                    ClientSecrets = { new Secret("backend".Sha256()) },
                    AllowedGrantTypes = GrantTypes.Code,
                    AllowedScopes = { "openid", "profile", "email", "roles" },
                    AllowOfflineAccess = true,
                    RedirectUris = { "https://localhost:8082/signin-oidc" },
                    RequireClientSecret = false,
                    RequireConsent = false,
                    RequirePkce = true,
                    AccessTokenLifetime = TokenLifeTime,
                    IdentityTokenLifetime = TokenLifeTime
                },
                new Client
                {
                    ClientId = "frontend",
                    ClientName = "Music Festival Frontend",
                    ClientSecrets = { new Secret("frontend".Sha256()) },
                    AllowedGrantTypes = GrantTypes.Code,
                    AllowedScopes = { "openid", "profile", "email", "roles", "epi_content_delivery" },
                    AllowOfflineAccess = true,
                    AllowedCorsOrigins =  { "https://localhost:8080" },
                    FrontChannelLogoutUri = "https://localhost:8080",
                    PostLogoutRedirectUris = { "https://localhost:8080" },
                    RedirectUris = { "https://localhost:8080/login-callback", "https://localhost:8080/login-renewal" },
                    RequireClientSecret = false,
                    RequireConsent = false,
                    RequirePkce = true,
                    AccessTokenLifetime = TokenLifeTime,
                    IdentityTokenLifetime = TokenLifeTime,
                }
            };
    }
}
