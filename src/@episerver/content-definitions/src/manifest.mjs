import fs from 'fs';
import http from 'http';
import https from 'https';
import { isLocal } from "./utils.mjs";
import { getAccessToken } from "./authService.mjs";

const basePath = '/api/episerver/v3.0/contentmanifest';

export async function pushManifest(path, source, options, login) {
  let manifest;
  try {
    manifest = fs.readFileSync(path, 'utf8');
  } catch (error) {
    return Promise.reject(error.message);
  }

  return new Promise(async (resolve, reject) => {
    const accessToken = await getAccessToken(login)
      .catch(error => reject(error));

    const url = new URL(basePath, source);
    if (options.allowedUpgrades) url.searchParams.append('allowedUpgrades', options.allowedUpgrades);
    if (options.force) url.searchParams.append('force', 'true');

    const requestOptions = {
      host: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': manifest.length,
        'Authorization': `Bearer ${accessToken}`,
      },
      rejectUnauthorized: !isLocal(url.hostname),
    };

    const client = url.protocol === 'http:' ? http : https;

    const request = client.request(requestOptions, response => {
      streamToJSON(response).then(data => {
        if (response.statusCode == 200 && data.messages) {
          resolve(data.messages);
        } else if (response.statusCode == 400) {
          reject(mapErrorDetailsToString(data));
        } else {
          reject(data);
        }
      }).catch(() => reject('Invalid JSON or not a valid source.'));
    });

    request.on('error', error => reject(error));
    request.write(manifest);
    request.end();
  });
}

export async function pullManifest(path, source, login) {
  return new Promise(async (resolve, reject) => {
    const accessToken = await getAccessToken(login)
      .catch(error => reject(error));

    const url = new URL(basePath, source);

    const requestOptions = {
      host: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      rejectUnauthorized: !isLocal(url.hostname),
    };

    const client = url.protocol === 'http:' ? http : https;

    const request = client.request(requestOptions, response => {
      streamToJSON(response).then(data => {
        if (response.statusCode == 200) {
          if (path) {
            fs.writeFileSync(path, JSON.stringify(data));
            resolve(`Manifest saved to ${path}`);
          } else {
            resolve(data);
          }
        } else {
          reject(data);
        }
      }).catch(() => reject('Invalid JSON or not a valid source.'));
    });

    request.on('error', error => reject(error));
    request.end();
  });
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
    }).catch(error => reject(error))
  });
}

function mapErrorDetailsToString(errorDetails)
{
  // Example error details response.
  // {
  //   "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  //   "title": "400",
  //   "status": 400,
  //   "detail": "InvalidModel",
  //   "instance": "/api/episerver/v2.0/contentmanifest",
  //   "traceId": "00-656349ad11f24d44835626c129c82415-dc922327f69d0a46-00",
  //   "code": "InvalidModel",
  //   "error":
  //   {
  //       "":
  //       [
  //           "A non-empty request body is required."
  //       ]
  //   }
  // }

  // Check whether error contains validation errors
  const errors = errorDetails.error || errorDetails.errors;
  if (errors) {
    let result = `${errorDetails.detail}.`;

    for (const key in errors) {
      if (key === '') {
        result = `${result} ${errors[key].join(", ")}`;
      } else {
        result = `${result} ${key}: ${errors[key].join(", ")}`;
      }
    }

    return result;
  } else {
    return errorDetails.detail;
  }
}
