#!/usr/bin/env node

import { Command } from 'commander';
import { pushManifest, pullManifest } from '../src/manifest.mjs';

const program = new Command();

program
  .version('1.0.0')
  .usage('<command> [options]');

program
  .command('push <path>')
  .description('Push a manifest with content definitions to a management application from the specified path.')
  .requiredOption('-s, --source <source>', 'URL to the management application.')
  .requiredOption('--authority <authority>', 'Login authority.')
  .requiredOption('--client-id <clientId>', 'Login client ID.')
  .requiredOption('--client-secret <clientSecret>', 'Login client secret.')
  .option('--allowed-upgrades [allowedUpgrades]', 'Which semantic upgrades of definitions should be allowed. Allowed values are "none", "patch", "minor", and "major".')
  .option('-f, --force [force]', 'Should the push proceed even though there are warnings or the changes are not allowed.')
  .action(async (path, cmd) => {
    const options = {
      allowedUpgrades: cmd.allowedUpgrades,
      force: cmd.force
    };

    const login = {
      authority: cmd.authority,
      clientId: cmd.clientId,
      clientSecret: cmd.clientSecret
    };

    pushManifest(path, cmd.source, options, login)
      .then(result => {
        result.forEach(message => {
          console.log(message.severity, message.message);
        });
      })
      .catch(error => console.error(error))
  });

program
  .command('pull [path]')
  .description('Pull a manifest with content definitions from a management application to the specified path.')
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

    pullManifest(path, cmd.source, login)
      .then(result => console.log(result))
      .catch(error => console.error(error))
  });

await program.parseAsync(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}