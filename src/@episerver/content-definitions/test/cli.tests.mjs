import 'chai/register-should.js';
import fs from 'fs';
import { execute } from './cmd.mjs';
import { baseUrl, tempPath } from 'test-setup';

const CLI = './bin/cli.mjs';
const authority = baseUrl;
const clientId = 'id';
const clientSecret = 'secret';

describe('Content Definitions CLI', () => {
  describe('import', () => {
    const pathNew = './test/manifests/new.json';
    const pathMajorUpdate = './test/manifests/major-update.json';

    it('should require \'source\'', async () => {
      try {
        await execute(CLI,
          [
            'import',
            pathNew,
          ]);
      } catch (error) {
        error.should.include('required option \'-s, --source <source>\'');
      }
    });

    it('should require \'authority\'', async () => {
      try {
        await execute(CLI,
          [
            'import',
            pathNew,
            '-s',
            baseUrl,
          ]);
      } catch (error) {
        error.should.include('required option \'--authority <authority>\'');
      }
    });

    it('should require \'client ID\'', async () => {
      try {
        await execute(CLI,
          [
            'import',
            pathNew,
            '-s',
            baseUrl,
            '--authority',
            authority,
          ]);
      } catch (error) {
        error.should.include('required option \'--client-id <clientId>\'');
      }
    });

    it('should require \'client secret\'', async () => {
      try {
        await execute(CLI,
          [
            'import',
            pathNew,
            '-s',
            baseUrl,
            '--authority',
            authority,
            '--client-id',
            clientId,
          ]);
      } catch (error) {
        error.should.include('required option \'--client-secret <clientSecret>\'');
      }
    });

    describe('without \'--allowed-upgrades major\'', () => {
      it('should import manifest', async () => {
        const result = await execute(CLI,
          [
            'import',
            pathNew,
            '-s',
            baseUrl,
            '--authority',
            authority,
            '--client-id',
            clientId,
            '--client-secret',
            clientSecret,
          ]);

        result.should.include('Imported 1 content type.');
      });

      it('should not import manifest with major upgrades', async () => {
        const result = await execute(CLI,
          [
            'import',
            pathMajorUpdate,
            '-s',
            baseUrl,
            '--authority',
            authority,
            '--client-id',
            clientId,
            '--client-secret',
            clientSecret,
          ]);

        result.should.include('The version transition is not allowed');
      });
    });

    describe('with \'--allowed-upgrades major\'', () => {
      it('should import manifest with major upgrades', async () => {
        const result = await execute(CLI,
          [
            'import',
            pathMajorUpdate,
            '-s',
            baseUrl,
            '--authority',
            authority,
            '--client-id',
            clientId,
            '--client-secret',
            clientSecret,
            '--allowed-upgrades',
            'major',
          ]);

        result.should.include('Imported 1 content type.');
      });
    });
  });

  describe('export', () => {
    it('should require \'source\'', async () => {
      try {
        await execute(CLI,
          [
            'export',
          ]);
      } catch (error) {
        error.should.include('required option \'-s, --source <source>\'');
      }
    });

    it('should require \'authority\'', async () => {
      try {
        await execute(CLI,
          [
            'export',
            '-s',
            baseUrl,
          ]);
      } catch (error) {
        error.should.include('required option \'--authority <authority>\'');
      }
    });

    it('should require \'client ID\'', async () => {
      try {
        await execute(CLI,
          [
            'export',
            '-s',
            baseUrl,
            '--authority',
            authority,
          ]);
      } catch (error) {
        error.should.include('required option \'--client-id <clientId>\'');
      }
    });

    it('should require \'client secret\'', async () => {
      try {
        await execute(CLI,
          [
            'export',
            '-s',
            baseUrl,
            '--authority',
            authority,
            '--client-id',
            clientId,
          ]);
      } catch (error) {
        error.should.include('required option \'--client-secret <clientSecret>\'');
      }
    });

    it('should export to stdout when no path is provided', async () => {
      const result = await execute(CLI,
        [
          'export',
          '-s',
          baseUrl,
          '--authority',
          authority,
          '--client-id',
          clientId,
          '--client-secret',
          clientSecret,
        ]);

      result.should.include('propertyGroups');
      result.should.include('contentTypes');
    });

    it('should export to file when path is provided', async () => {
      const path = tempPath + '/manifest.json';

      const result = await execute(CLI,
        [
          'export',
          path,
          '-s',
          baseUrl,
          '--authority',
          authority,
          '--client-id',
          clientId,
          '--client-secret',
          clientSecret,
        ]);

      fs.existsSync(path).should.equal(true);
      result.should.include(`Manifest saved to ${path}`);
    });
  });
});