# Optimizely Content Delivery JavaScript SDKs and samples

[![Npm publish](https://github.com/episerver/content-delivery-js-sdk/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/episerver/content-delivery-js-sdk/actions/workflows/npm-publish.yml) [![Continuous integration](https://github.com/episerver/content-delivery-js-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/episerver/content-delivery-js-sdk/actions/workflows/ci.yml)


This repository contains the source code for the Content Delivery JavaScript SDKs and samples.

## Content Definitions

* [Source code and documentation](https://github.com/episerver/content-delivery-js-sdk/tree/master/src/%40episerver/content-definitions)
* [REST API documentation](https://world.optimizely.com/documentation/developer-guides/content-definitions-api/)

## Content Delivery

* [Source code and documentation](https://github.com/episerver/content-delivery-js-sdk/tree/master/src/%40episerver/content-delivery)
* [REST API documentation](https://world.optimizely.com/documentation/developer-guides/content-delivery-api/)

## Samples

* [Vue.js - Coupled](samples/music-festival-vue-coupled)
* [Vue.js - Decoupled](samples/music-festival-vue-decoupled)

## Prerequisites for building and testing the SDKs

This project uses:
* Node.js 14+
* npm 6+
* .NET SDK 6+
* SQL Server 2016 Express LocalDB ([download here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads))

## Create a release

 1. Update the version in all modules with `npm version 1.2.3`.
 2. Run `npm install` in all samples to update their package-lock.json files.
 3. Commit, push, and create PR to `master` branch.
 4. Create new Github release based of `master` branch.
 5. Tag version with following format `v1.2.3`.
 6. Give the release a title and write an optional description.
 7. Publish.

## Contributing

The easiest way to contribute is to join in with the discussions on Github issues or create new issues with questions, suggestions or any other feedback. If you want to contribute code or documentation, you are more than welcome to create pull-requests, but make sure that you read the contribution page first.
