import 'chai/register-should.js';
import fs from 'fs';
import { execute } from './cmd.mjs';
import { baseUrl, tempPath } from 'test-setup';

const CLI = './bin/cli.mjs';
const authority = baseUrl;
const clientId = 'cli';
const clientSecret = 'cli';

describe('Content Definitions CLI', () => {
  describe('push', () => {
    const pathNew = './test/manifests/new.json';
    const pathMajorUpdate = './test/manifests/major-update.json';
    const pathMajorDowngrade = './test/manifests/major-downgrade.json';
    const pathEmptyJson = './test/manifests/empty-json.json';
    const pathNoJson = './test/manifests/no-json.json';

    it('should require \'source\'', async () => {
      try {
        await execute(CLI,
          [
            'push',
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
            'push',
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
            'push',
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
            'push',
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

    it('should fail with non-URI \'source\'', async () => {
      try {
        await execute(CLI,
          [
            'push',
            pathNew,
            '-s',
            'incorrect-source',
            '--authority',
            authority,
            '--client-id',
            clientId,
            '--client-secret',
            clientSecret,
          ]);
      } catch (error) {
        error.should.include('Invalid URL');
      }
    });

    it('should fail with invalid \'source\'', async () => {
      try {
        await execute(CLI,
          [
            'push',
            pathNew,
            '-s',
            'http://example.com',
            '--authority',
            authority,
            '--client-id',
            clientId,
            '--client-secret',
            clientSecret,
          ]);
      } catch (error) {
        error.should.include('Invalid JSON or not a valid source.');
      }
    });

    it('should fail when file doesn\'t exist', async () => {
      try {
        await execute(CLI,
          [
            'push',
            'do not exist.json',
            '-s',
            baseUrl,
            '--authority',
            authority,
            '--client-id',
            clientId,
            '--client-secret',
            clientSecret,
          ]);
      } catch (error) {
        error.should.include('no such file or directory');
      }
    });

    it('should fail when invalid credentials', async () => {
      try {
        await execute(CLI,
          [
            'push',
            pathNew,
            '-s',
            baseUrl,
            '--authority',
            authority,
            '--client-id',
            'xxx',
            '--client-secret',
            'xxx',
          ]);
      } catch (error) {
        error.should.include('invalid_client');
      }
    });

    it('should not import no JSON', async () => {
      try {
        await execute(CLI,
          [
            'push',
            pathNoJson,
            '-s',
            baseUrl,
            '--authority',
            authority,
            '--client-id',
            clientId,
            '--client-secret',
            clientSecret,
          ]);
      } catch (error) {
        error.should.include('A non-empty request body is required.');
      }
    });

    it('should not import empty JSON', async () => {
      try {
        await execute(CLI,
          [
            'push',
            pathEmptyJson,
            '-s',
            baseUrl,
            '--authority',
            authority,
            '--client-id',
            clientId,
            '--client-secret',
            clientSecret,
          ]);
      } catch (error) {
        error.should.include('The manifest doesn\'t contain any sections.');
      }
    });

    describe('without \'--allowed-upgrades major\'', () => {
      it('should import manifest', async () => {
        const result = await execute(CLI,
          [
            'push',
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
            'push',
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
            'push',
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

    describe('without \'--force\'', () => {
      it('should not import manifest with major downgrades', async () => {
        const result = await execute(CLI,
          [
            'push',
            pathMajorDowngrade,
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

    describe('with \'--force\'', () => {
      it('should import manifest with major downgrades', async () => {
        const result = await execute(CLI,
          [
            'push',
            pathMajorDowngrade,
            '-s',
            baseUrl,
            '--authority',
            authority,
            '--client-id',
            clientId,
            '--client-secret',
            clientSecret,
            '--force',
            'major',
          ]);

        result.should.include('Imported 1 content type.');
      });
    });
  });


  describe('pull', () => {
    it('should require \'source\'', async () => {
      try {
        await execute(CLI,
          [
            'pull',
          ]);
      } catch (error) {
        error.should.include('required option \'-s, --source <source>\'');
      }
    });

    it('should require \'authority\'', async () => {
      try {
        await execute(CLI,
          [
            'pull',
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
            'pull',
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
            'pull',
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

    it('should fail with non-URI \'source\'', async () => {
      try {
        await execute(CLI,
          [
            'pull',
            '-s',
            'incorrect-source',
            '--authority',
            authority,
            '--client-id',
            clientId,
            '--client-secret',
            clientSecret,
          ]);
      } catch (error) {
        error.should.include('Invalid URL');
      }
    });

    it('should fail with invalid \'source\'', async () => {
      try {
        await execute(CLI,
          [
            'pull',
            '-s',
            'http://example.com',
            '--authority',
            authority,
            '--client-id',
            clientId,
            '--client-secret',
            clientSecret,
          ]);
      } catch (error) {
        error.should.include('Invalid JSON or not a valid source.');
      }
    });

    it('should fail when invalid credentials', async () => {
      try {
        await execute(CLI,
          [
            'pull',
            '-s',
            baseUrl,
            '--authority',
            authority,
            '--client-id',
            'xxx',
            '--client-secret',
            'xxx',
          ]);
      } catch (error) {
        error.should.include('invalid_client');
      }
    });

    it('should export to stdout when no path is provided', async () => {
      const result = await execute(CLI,
        [
          'pull',
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
          'pull',
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