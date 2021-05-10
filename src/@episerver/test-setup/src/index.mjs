import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';

export const baseUrl = 'http://localhost:8080';
export const apiUrl = `${baseUrl}/api/episerver/v2.0/`;

const basePath = '../test-setup/'; 
const appDataPath = path.join(basePath, 'backend/App_Data/');

let dotnet;

export async function start() {
  cleanUpData();
  newData();

  return new Promise((resolve, reject) => {
    dotnet = spawn('dotnet', [ 'run', '-p', path.join(basePath, 'backend')], { stdio: 'inherit', })
      .on('error', reject)
      .on('exit', (code) => process.exit(code));

    waitForResponse()
      .then(resolve)
      .catch(reject);
  })
}

export async function stop() {
  dotnet.kill('SIGINT');

  cleanUpData();

  return Promise.resolve();
}

async function waitForResponse() {
  console.log('Waiting for server...')

  let started = false;

  while (!started) {
    await new Promise(resolve => setTimeout(resolve, 5000));

    http.get(baseUrl, () => {
      started = true;
    }).on('error', () => {});

    console.log('Still waiting for server...')
  }

  console.log('Server ready!')

  return Promise.resolve();
}

function cleanUpData() {
  console.log(`Cleaning up path '${appDataPath}'.`)

  fs.rmdirSync(appDataPath, { recursive: true, force: true });
}

function newData() {
  console.log(`Creating path '${appDataPath}'.`)

  fs.mkdirSync(appDataPath);

  fs.copyFileSync(
    path.join(basePath, '/data/DefaultSiteContent.episerverdata'),
    path.join(appDataPath, 'DefaultSiteContent.episerverdata'));

  fs.copyFileSync(
    path.join(basePath, '/data/musicfestival.mdf'),
    path.join(appDataPath, 'musicfestival.mdf'));
}
