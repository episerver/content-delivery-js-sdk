# Episerver Content Delivery - Decoupled

This sample site demonstrates one approach to render Episerver content in a client side framework that is using client side routing for navigation with a working On Page Edit (OPE) mode in the Episerver UI, where the frontend and backend are hosted separately.

This particular solution uses [Vue CLI](https://cli.vuejs.org/) with [Vuex](https://vuex.vuejs.org/) to handle the state of the app in a `single source of truth`. Most of the techniques are framework agnostic and can be used with any other framework, such as React or Angular.

Content is fetched from Episerver using the Content Delivery API: https://world.episerver.com/documentation/developer-guides/cms/content/content-delivery-api/

## Prerequisites

This project uses:
* npm 6+
* Visual Studio 2019+
* SQL Server 2016 Express LocalDB ([download here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads))

## Setup and Run

1. Run `setup.cmd`. You can re-run `setup.cmd` at any time to reset the backend with a fresh database.
2. Open `MusicFestivalDecoupled.sln` and hit `Ctrl + F5` in Visual Studio.
3. Open terminal for `./frontend` and run `npm run serve`.
4. Login on `http:localhost:5200/episerver` with either one of the following:


|Name    |Password    |Mailbox | Email |
|--------|------------|--------|-------|
|cmsadmin|sparr0wHawk |        |       |
|emil    |sparr0wHawk |https://www.mailinator.com/v3/index.jsp?zone=public&query=epic-emil   |epic-emil@mailinator.com   |
|ida     |sparr0wHawk |https://www.mailinator.com/v3/index.jsp?zone=public&query=epic-ida    |epic-ida@mailinator.com    |
|alfred  |sparr0wHawk |https://www.mailinator.com/v3/index.jsp?zone=public&query=epic-alfred |epic-alfred@mailinator.com |
|lina    |sparr0wHawk |https://www.mailinator.com/v3/index.jsp?zone=public&query=epic-lina   |epic-lina@mailinator.com   |

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
* [EpiLink.vue](frontend/src/components/widgets/EpiLink.vue): regular links when in OPE and Vue router links otherwise.
* [EpiViewModeLink.vue](frontend/src/components/widgets/EpiViewModeLink.vue): disables links completely when in OPE.

## Debugging Vuex state

Using the [Vue-devtools](https://github.com/vuejs/vue-devtools) to see the state changes in the store in view mode works as expected. There are however some limitations to follow state changes when you are editing in Episerver edit mode because of the site is running inside an iframe. To be able to see the vuex state while editing you need to run the stand alone electron app as described on the github page: [Vue standalone Electron app](https://github.com/vuejs/vue-devtools/blob/master/shells/electron/README.md).