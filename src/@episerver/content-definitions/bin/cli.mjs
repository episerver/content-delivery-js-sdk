#!/usr/bin/env node

import { Command } from 'commander';
import { importManifest, exportManifest } from '../src/manifest.mjs';

const program = new Command();

program
  .version('1.0.0')
  .usage('<command> [options]');

program
  .command('import <path>')
  .description('Import a manifest with content definitions from the specified path to a management application.')
  .requiredOption('-s, --source <source>', 'URL to the management application.')
  .requiredOption('--authority <authority>', 'Login authority.')
  .requiredOption('--client-id <clientId>', 'Login client ID.')
  .requiredOption('--client-secret <clientSecret>', 'Login client secret.')
  .option('--allowed-upgrades [allowedUpgrades]', 'Which semantic upgrades of definitions should be allowed. Allowed values are "none", "patch", "minor", and "major".')
  .option('--allowed-downgrades [allowedDowngrades]', 'Which semantic downgrades of definitions should be allowed. Allowed values are "none", "patch", "minor", and "major".')
  .action(async (path, cmd) => {
    const options = {
      allowedUpgrades: cmd.allowedUpgrades,
      allowedDowngrades: cmd.allowedDowngrades
    };

    const login = {
      authority: cmd.authority,
      clientId: cmd.clientId,
      clientSecret: cmd.clientSecret
    };

    importManifest(path, cmd.source, options, login)
      .then(result => {
        result.forEach(message => {
          console.log(message.severity, message.message);
        });
      })
      .catch(error => console.error(error))
  });

program
  .command('export [path]')
  .description('Export a manifest with content definitions to the specified path from a management application.')
  .requiredOption('-s, --source <source>', 'URL to the management application.')
  .requiredOption('--authority <authority>', 'Login authority.')
  .requiredOption('--client-id <clientId>', 'Login client ID.')
  .requiredOption('--client-secret <clientSecret>', 'Login client secret.')
  .action(async (path, cmd) => {
    const login = {
      authority: cmd.authority,
      clientId: cmd.clientId,
      clientSecret: cmd.clientSecret
    };

    exportManifest(path, cmd.source, login)
      .then(result => console.log(result))
      .catch(error => console.error(error))
  });

await program.parseAsync(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}