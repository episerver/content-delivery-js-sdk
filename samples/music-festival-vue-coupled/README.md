# Optimizely Content Delivery - Decoupled

This sample site demonstrates one approach to render Optimizely content in a client side framework that is using client side routing for navigation with a working On-Page Edit (OPE) mode in the Optimizely UI, where the frontend and backend are hosted in the same application.

The ASP.NET Core SPA Proxy is being used, meaning during development the frontend is hosted in its own process, in this case by webpack's development server, and backend calls are proxied back to the dotnet process. In production, the frontend app will be hosted by the dotnet process.

The frontend uses [Vue CLI](https://cli.vuejs.org/) with [Vuex](https://next.vuex.vuejs.org/) to handle the state of the app in a `single source of truth`. Most of the techniques are framework agnostic and can be used with any other framework, such as React or Angular.

Content is fetched from Optimizely using the Content Delivery API: https://world.optimizely.com/documentation/developer-guides/cms/content/content-delivery-api/

## Prerequisites

This project uses:
* Node.js 14+
* npm 6+
* .NET SDK 6+
* SQL Server 2016 Express LocalDB ([download here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads))

## Setup and Run

1. Run `setup.cmd`. You can re-run `setup.cmd` at any time to reset the backend with a fresh database.
2. Since we reference two NPM modules locally, we need to install them first (this is not needed if you install the modules from npmjs.com).
    * Open terminal for `../../src/@episerver/content-definitions` and run `npm install` (only needed first run).
    * Open terminal for `../../src/@episerver/content-delivery` and run `npm install` (only needed first run).
3. Open terminal and run `dotnet run`.
    * Navigate to http://localhost:8081/episerver/cms.
    * Create an admin user. If the UI is not displayed automatically, navigate to http://localhost:8081/util/register first.
    * Navigate to http://localhost:8081/.
    * The SPA proxy will automatically start the frontend and redirect to http://localhost:8080 when webpacks's server is ready.

## Notable files

### Vuex store modules

* [epiContext.js](ClientApp/src/store/modules/epiContext.js): makes `inEditMode` and `isEditable` flags available to the OPE helpers.
* [epiDataModel.js](ClientApp/src/store/modules/epiDataModel.js): the module that stores and updates the model object to be displayed on every component.

### On-Page Editing helpers

* [epiBootstrap.js](ClientApp/src/epiBootstrap.js): registers the `contentSaved` and `epiReady` message handlers that updates the vuex store.
* [epiEdit.js](ClientApp/src/directives/epiEdit.js): a directive that can be added on components to make them optionally editable (e.g. `<span v-epi-edit="Name">`), through `isEditable` and `epiDisableEditing`.
* [EpiProperty.vue](ClientApp/src/components/EpiProperty.vue): a component that renders a button to edit a property (e.g. `<epi-property property-name="Name">`).

### Routing helpers

* [EpiPageComponentSelector.vue](ClientApp/src/components/EpiPageComponentSelector.vue): loads the Vue page component and owns its model.
* [EpiBlockComponentSelector.vue](ClientApp/src/components/EpiBlockComponentSelector.vue): loads the Vue block component.
* [EpiLink.vue](ClientApp/src/components/EpiLink.vue): regular links when in OPE and Vue router links otherwise.
* [EpiViewModeLink.vue](ClientApp/src/components/EpiViewModeLink.vue): disables links completely when in OPE.
