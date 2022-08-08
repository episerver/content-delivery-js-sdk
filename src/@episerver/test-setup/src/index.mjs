import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';

export const baseUrl = 'http://localhost:8080';
export const apiUrl = `${baseUrl}/api/episerver/v3.0/`;
export const tempPath = './temp';

const basePath = '../test-setup/'; 
const appDataPath = path.join(basePath, 'backend/App_Data/');

let dotnet;

export async function start() {
  cleanUpData();
  newData();

  return new Promise((resolve, reject) => {
    dotnet = spawn('dotnet', [ 'run', '--project', path.join(basePath, 'backend')], { stdio: 'inherit', })
      .on('error', (error) => reject(error))
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

export function createTempDirectory() {
  console.log(`Creating temporary directory '${tempPath}'.`)

  fs.mkdirSync(tempPath);
}

export function removeTempDirectory() {
  console.log(`Removing temporary directory '${tempPath}'.`)

  fs.rmSync(tempPath, { recursive: true, force: true });
}

function cleanUpData() {
  console.log(`Removing directory '${appDataPath}'.`)

  fs.rmSync(appDataPath, { recursive: true, force: true });
}

function newData() {
  console.log(`Creating directory '${appDataPath}'.`)

  fs.mkdirSync(appDataPath);

  fs.copyFileSync(
    path.join(basePath, '/data/DefaultSiteContent.episerverdata'),
    path.join(appDataPath, 'DefaultSiteContent.episerverdata'));
}
