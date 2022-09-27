import * as backend from 'test-setup';
import { defaultConfig } from "../lib/main.mjs";

defaultConfig.apiUrl = backend.apiUrl;

export async function mochaGlobalSetup() {
  await backend.start();
};

export async function mochaGlobalTeardown() {
  await backend.stop();
};