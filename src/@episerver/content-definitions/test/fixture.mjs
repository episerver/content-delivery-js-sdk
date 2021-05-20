import * as backend from 'test-setup';

export async function mochaGlobalSetup() {
  backend.removeTempDirectory();
  backend.createTempDirectory();

  await backend.start();
};

export async function mochaGlobalTeardown() {
  backend.removeTempDirectory();
  
  await backend.stop();
};

