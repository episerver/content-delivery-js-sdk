import * as backend from 'test-setup';
import { defaultConfig } from "../lib/main.js";

defaultConfig.apiUrl = backend.apiUrl;

export async function mochaGlobalSetup() {
  await backend.start();
};

export async function mochaGlobalTeardown() {
  await backend.stop();
};