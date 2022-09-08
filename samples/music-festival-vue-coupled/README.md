# Optimizely Content Delivery - Coupled

This sample site demonstrates one approach to render Optimizely content with a client-side framework that is using client side routing, with a working On-Page Edit (OPE) mode, and where the client app and backend are hosted in the same application. The client app is hosted in its own Noje.js process and then proxied by dotnet.

The frontend uses [Nuxt 3](https://v3.nuxtjs.org/), but most of the techniques are framework agnostic and can be used with any other framework, such as React or Angular.

Content is fetched from Optimizely using the Content Delivery API: https://world.optimizely.com/documentation/developer-guides/cms/content/content-delivery-api/

## Prerequisites

This project uses:
* Node.js 18+
* .NET SDK 6+
* SQL Server 2016 Express LocalDB ([download here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads))

## Setup and Run

1. Run `setup.cmd` or `setup.sh` depending on your operating system. You can re-run the setup at any time to reset the backend with a fresh database.
2. Since we reference two NPM modules locally, we need to install them first (this is not needed if you install the modules from npmjs.com).
    * Open terminal for `../../src/@episerver/content-definitions` and run `npm install` (only needed first run).
    * Open terminal for `../../src/@episerver/content-delivery` and run `npm install` (only needed first run).
    * Open terminal for `ClientApp` and run `npm install`.
3. Open terminal and run `dotnet run`.
    * Navigate to http://localhost:8080.
    * Create an admin user.
    * The Node.js proxy will automatically start the client app and dotnet will serve it when it's ready.
