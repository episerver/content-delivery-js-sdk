// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using System;

namespace IdentityServer.Models.Account
{
    public class AccountOptions
    {
        public static readonly bool AllowLocalLogin = true;

        public static readonly bool AllowRememberLogin = true;

        public static readonly TimeSpan RememberMeLoginDuration = TimeSpan.FromDays(30);

        public static readonly bool ShowLogoutPrompt = true;

        public static readonly bool AutomaticRedirectAfterSignOut = false;

        // specify the Windows authentication scheme being used
        public static readonly string WindowsAuthenticationSchemeName = Microsoft.AspNetCore.Server.IISIntegration.IISDefaults.AuthenticationScheme;

        // if user uses windows auth, should we load the groups from windows
        public static readonly bool IncludeWindowsGroups = false;

        public static readonly string InvalidCredentialsErrorMessage = "Invalid username or password";
    }
}
