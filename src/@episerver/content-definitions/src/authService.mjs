import { isLocal } from './utils.mjs';
import { Issuer, custom } from 'openid-client';

export async function getAccessToken(login) {
  const url = new URL(login.authority);

  custom.setHttpOptionsDefaults({
    https: {
      rejectUnauthorized: !isLocal(url.hostname),
    },
  });

  var issuer = await Issuer.discover(login.authority)
    .catch(error => console.error(error.error));

  if (!issuer) {
    return '';
  }

  const client = new issuer.Client({
    client_id: login.clientId,
    client_secret: login.clientSecret,
  });

  const grant = await client.grant({
    grant_type: 'client_credentials',
    scope: 'epi_content_definitions',
  }).catch(error => console.error(error.error));

  return grant?.access_token;
}
