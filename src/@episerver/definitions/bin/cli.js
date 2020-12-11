#!/usr/bin/env node

const { program } = require('commander');
const { importManifest } = require('../lib/manifest');

program
  .version(`@episerver/definitions ${require('../package').version}`)
  .usage('<command> [options]');

program
  .command('import <path>')
  .description('Imports a manifest from the specified path to a management application.')
  .requiredOption('-s, --source <source>', 'URL to the management application.')
  .option('--allowed-upgrades [allowedUpgrades]', 'Specify which semantic upgrades of definitions should be allowed. Allowed values are "none", "patch", "minor", and "major".')
  .option('--allowed-downgrades [allowedDowngrades]', 'Specify which semantic downgrades of definitions should be allowed. Allowed values are "none", "patch", "minor", and "major".')
  .action((path, cmd) => {
    importManifest(
      path, 
      cmd.source, 
      cmd.allowedUpgrades, 
      cmd.allowedDowngrades)
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}