# Episerver Content Delivery JavaScript SDKs and samples

[![Npm publish](https://github.com/episerver/content-delivery-js-sdk/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/episerver/content-delivery-js-sdk/actions/workflows/npm-publish.yml) [![Continuous integration](https://github.com/episerver/content-delivery-js-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/episerver/content-delivery-js-sdk/actions/workflows/ci.yml)


This repository contains the source code for the Content Delivery SDKs and samples.

> Note the SDK is in preview. Please provide feedback and report issues.

Visit [Episerver World](https://world.episerver.com/documentation/developer-guides/content-delivery-api/) for full documentation of the REST APIs.

## Content Definitions

[Source code and documentation](https://github.com/episerver/content-delivery-js-sdk/tree/master/src/%40episerver/content-definitions).

## Content Delivery

[Source code and documentation](https://github.com/episerver/content-delivery-js-sdk/tree/master/src/%40episerver/content-delivery).

## Prerequisites for building and testing the SDKs

This project uses:
* Node.js 12+
* npm 6+
* .NET SDK 5+
* SQL Server 2016 Express LocalDB ([download here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads))

## Creating a release

 1. Update version in all SDK package.json files.
 2. Merge to master branch.
 3. Create new Github release based of master branch.
 4. Tag version with following format: v1.2.0.
 5. Give the release a title and write an optional description.
 6. Publish.

## Contributing

The easiest way to contribute is to join in with the discussions on Github issues or create new issues with questions, suggestions or any other feedback. If you want to contribute code or documentation, you are more than welcome to create pull-requests, but make sure that you read the contribution page first.