# Episerver Content Delivery JavaScript SDK - Content Definitions

SDK and CLI for managing definitions and modelling of data in an Episerver application running the [Content Definitions API](https://world.episerver.com/documentation/developer-guides/content-definitions-api/). The SDK is written in TypeScript and includes types.

Please visit [Episerver World](https://world.episerver.com/) for full documentation of the APIs. 

## Installing

Using npm:

```bash
$ npm install @episerver/content-definitions
````

using yarn:

```bash
$ yarn install @episerver/content-definitions
````

## Examples

### CLI

Help:
```bash
$ npx epi-definitions --help
```

```bash
Usage: cli <command> [options]

Options:
  -V, --version            output the version number
  -h, --help               display help for command

Commands:
  import [options] <path>  Import a manifest with definitions from the specified path to a management application.
  help [command]           display help for command
```

Importing of content definitions manifest:

```bash
$ npx epi-definitions import manifest.json -s https://site.com --allowed-upgrades major --authority https://login.com --client-id definitions-cli --client-secret definitions-cli
```

```bash
Usage: cli import [options] <path>

Import a manifest with definitions from the specified path to a management application.

Options:
  -s, --source <source>                     URL to the management application.
  --authority <authority>                   Login authority.
  --client-id <clientId>                    Login client ID.
  --client-secret <clientSecret>            Login client secret.
  --allowed-upgrades [allowedUpgrades]      Which semantic upgrades of definitions should be allowed. Allowed values are "none", "patch", "minor", and "major".  
  --allowed-downgrades [allowedDowngrades]  Which semantic downgrades of definitions should be allowed. Allowed values are "none", "patch", "minor", and "major".
  -h, --help                                display help for command
```
