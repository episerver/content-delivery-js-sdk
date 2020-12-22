// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using System.Threading.Tasks;
using IdentityServer;
using IdentityServer.Models.Home;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace EPiServer.Templates.Alloy.Mvc.Identity.Controllers
{
    [SecurityHeaders]
    [AllowAnonymous]
    public class ErrorController : Controller
    {
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IWebHostEnvironment _environment;

        public ErrorController(IIdentityServerInteractionService interaction, IWebHostEnvironment environment)
        {
            _interaction = interaction;
            _environment = environment;
        }

        /// <summary>
        /// Shows the error page
        /// </summary>
        public async Task<IActionResult> Index(string errorId)
        {
            var vm = new ErrorViewModel();

            // retrieve error details from identityserver
            var message = await _interaction.GetErrorContextAsync(errorId);
            if (message != null)
            {
                vm.Error = message;

                if (!_environment.IsDevelopment())
                {
                    // only show in development
                    message.ErrorDescription = null;
                }
            }

            return View("Error", vm);
        }
    }
}
