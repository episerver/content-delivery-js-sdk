import fs from 'fs';
import https from 'https';
import { isLocal } from "./utils.mjs";
import { getAccessToken } from "./authService.mjs";

const basePath = '/api/episerver/v2.0/contentmanifest';

export async function importManifest(path, source, options, login) {
  let manifest;

  try {
    manifest = fs.readFileSync(path, 'utf8');
  } catch (error) {
    console.error(error.message);
    return;
  }

  const url = new URL(basePath, source);
  if (options.allowedUpgrades) url.searchParams.append('allowedUpgrades', options.allowedUpgrades);
  if (options.allowedDowngrades) url.searchParams.append('allowedDowngrades', options.allowedDowngrades);

  const requestOptions = {
    host: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': manifest.length,
      'Authorization': `Bearer ${await getAccessToken(login)}`,
    },
    rejectUnauthorized: !isLocal(url.hostname),
  };

  const request = https.request(requestOptions, response => {
    streamToJSON(response).then(data => {
      if (response.statusCode == 200 && data.messages) {
        data.messages.forEach(message => {
          console.log(message.severity, message.message);
        });
      } else {
        console.error(data);
      }
    }).catch(error => {
      console.error(error);
    });
  });

  request.on('error', error => console.error(error));
  request.write(manifest);
  request.end();
}

async function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream.on('error', error => reject(error));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  })
}

async function streamToJSON(stream) {
  return new Promise((resolve, reject) => {
    streamToString(stream).then(data => {
      resolve(JSON.parse(data));
    }).catch(reject)
  });
}
