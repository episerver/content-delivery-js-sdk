import { isLocal } from './utils.mjs';
import { Issuer, custom } from 'openid-client';

export async function getAccessToken(login) {
  const url = new URL(login.authority);

  custom.setHttpOptionsDefaults({
    https: {
      rejectUnauthorized: !isLocal(url.hostname),
    },
  });

  return new Promise(async (resolve, reject) => {
    const issuer = await Issuer.discover(login.authority)
      .catch(error => reject(error));

    if (!issuer) {
      return resolve();
    }

    const client = new issuer.Client({
      client_id: login.clientId,
      client_secret: login.clientSecret,
    });

    const grant = await client.grant({
      grant_type: 'client_credentials',
      scope: 'epi_content_definitions',
    }).catch(error => reject(error));

    resolve(grant?.access_token);
  });
}
