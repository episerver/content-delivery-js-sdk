# Optimizely Content Delivery - Decoupled

This sample site demonstrates one approach to render Optimizely content in a client side framework that is using client side routing for navigation with a working On-Page Edit (OPE) mode in the Optimizely UI, where the frontend and backend are hosted as separate apps.

The frontend app uses [Vue CLI](https://cli.vuejs.org/) with [Vuex](https://next.vuex.vuejs.org/) to handle the state of the app in a `single source of truth`. Most of the techniques are framework agnostic and can be used with any other framework, such as React or Angular.

Content is fetched from Optimizely using the Content Delivery API: https://world.optimizely.com/documentation/developer-guides/cms/content/content-delivery-api/

## Prerequisites

This project uses:
* Node.js 18+
* .NET SDK 6+
* SQL Server 2016 Express LocalDB ([download here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads))

## Setup and Run

1. Run `setup.cmd`. You can re-run `setup.cmd` at any time to reset the backend with a fresh database.
2. Open terminal for `./backend` and run `dotnet run`.
    * Navigate to http://localhost:8081/.
    * Create an admin user. If the UI is not displayed automatically, navigate to http://localhost:8081/util/register.
    * Now you can access http://localhost:8081/episerver/cms.
3. Since we reference two NPM modules locally, we need to install them first (this is not needed if you install the modules from npmjs.com).
    * Open terminal for `../../src/@episerver/content-definitions` and run `npm install` (only needed first run).
    * Open terminal for `../../src/@episerver/content-delivery` and run `npm install` (only needed first run).
4. Open terminal for `./frontend` and run `npm install` (only needed first run).
    * Run `npm run serve`.
    * Navigate to http://localhost:8080/.

## Notable files

### Vuex store modules

* [epiContext.js](frontend/src/store/modules/epiContext.js): makes `inEditMode` and `isEditable` flags available to the OPE helpers.
* [epiDataModel.js](frontend/src/store/modules/epiDataModel.js): the module that stores and updates the model object to be displayed on every component.

### On-Page Editing helpers

* [epiBootstrap.js](frontend/src/epiBootstrap.js): registers the `contentSaved` and `epiReady` message handlers that updates the vuex store.
* [epiEdit.js](frontend/src/directives/epiEdit.js): a directive that can be added on components to make them optionally editable (e.g. `<span v-epi-edit="Name">`), through `isEditable` and `epiDisableEditing`.
* [EpiProperty.vue](frontend/src/components/EpiProperty.vue): a component that renders a button to edit a property (e.g. `<epi-property property-name="Name">`).

### Routing helpers

* [EpiPageComponentSelector.vue](frontend/src/components/EpiPageComponentSelector.vue): loads the Vue page component and owns its model.
* [EpiBlockComponentSelector.vue](frontend/src/components/EpiBlockComponentSelector.vue): loads the Vue block component.
* [EpiLink.vue](frontend/src/components/EpiLink.vue): regular links when in OPE and Vue router links otherwise.
* [EpiViewModeLink.vue](frontend/src/components/EpiViewModeLink.vue): disables links completely when in OPE.
