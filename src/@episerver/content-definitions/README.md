# Optimizely Content Delivery JavaScript SDK - Content Definitions

SDK and CLI for managing content definitions and modelling of data in an Optimizely application running the [Content Definitions API](https://world.optimizely.com/documentation/developer-guides/content-definitions-api/).

Please visit [Optimizely World](https://world.optimizely.com/) for full documentation of the APIs. 

## Installing

Using npm:

```bash
$ npm install @episerver/content-definitions@latest --save-dev
````

using yarn:

```bash
$ yarn install @episerver/content-definitions@latest --save-dev
````

## Examples

Help:

```bash
$ npx content-definitions --help
```

```bash
Usage: cli <command> [options]

Options:
  -V, --version          Output the version number
  -h, --help             Display help for command

Commands:
  push [options] <path>  Push a manifest with content definitions to a management application from the specified path.
  pull [options] [path]  Pull a manifest with content definitions from a management application to the specified path.
  help [command]         Display help for command
```

Push content definitions manifest:

```bash
$ npx content-definitions push manifest.json -s https://example.com --allowed-upgrades major --authority https://example.com --client-id xxx --client-secret xxx
```

```bash
Usage: cli push [options] <path>

Push a manifest with content definitions to a management application from the specified path.

Options:
  -s, --source <source>                     URL to the management application.
  --authority <authority>                   Login authority.
  --client-id <clientId>                    Login client ID.
  --client-secret <clientSecret>            Login client secret.
  --allowed-upgrades [allowedUpgrades]      Which semantic upgrades of definitions should be allowed. Allowed values are "none", "patch", "minor", and "major".  
  -f, --force [force]                       Should the push proceed even though there are warnings or the changes are not allowed.
  -h, --help                                Display help for command
```
Pull content definitions manifest:

```bash
$ npx content-definitions pull manifest.json -s https://example.com --authority https://example.com --client-id xxx --client-secret xxx
```

Note that path is optional, if left empty the manifest will be displayed in the output instead. 

```bash
Usage: cli pull [options] [path]

Pull a manifest with content definitions from a management application to the specified path.

Options:
  -s, --source <source>           URL to the management application.
  --authority <authority>         Login authority.
  --client-id <clientId>          Login client ID.
  --client-secret <clientSecret>  Login client secret.
  -h, --help                      Display help for command
```
