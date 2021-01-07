#!/usr/bin/env node

const { program } = require('commander');
const { importManifest } = require('../api/manifest');

program
  .version(`@episerver/definitions ${require('../package').version}`)
  .usage('<command> [options]');

program
  .command('import <path>')
  .description('Import a manifest with definitions from the specified path to a management application.')
  .requiredOption('-s, --source <source>', 'URL to the management application.')
  .requiredOption('--authority <authority>', 'Login authority.')
  .requiredOption('--client-id <clientId>', 'Login client ID.')
  .requiredOption('--client-secret <clientSecret>', 'Login client secret.')
  .option('--allowed-upgrades [allowedUpgrades]', 'Which semantic upgrades of definitions should be allowed. Allowed values are "none", "patch", "minor", and "major".')
  .option('--allowed-downgrades [allowedDowngrades]', 'Which semantic downgrades of definitions should be allowed. Allowed values are "none", "patch", "minor", and "major".')
  .action((path, cmd) => {
    const options = {
      allowedUpgrades: cmd.allowedUpgrades,
      allowedDowngrades: cmd.allowedDowngrades
    };

    const login = {
      authority: cmd.authority,
      clientId: cmd.clientId,
      clientSecret: cmd.clientSecret
    };

    importManifest(
      path,
      cmd.source,
      options,
      login)
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}