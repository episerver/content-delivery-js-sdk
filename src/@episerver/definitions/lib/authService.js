const { isLocal } = require("./utils");
const { Issuer, custom } = require('openid-client');

async function GetAccessToken(login) {
  custom.setHttpOptionsDefaults({
    https: {
      rejectUnauthorized: isLocal(login.authority)
    },
  });

  var issuer = await Issuer.discover(login.authority)
    .catch((error) => console.error('Error', error.error));

  if (!issuer) {
    return '';
  }

  const client = new issuer.Client({
    client_id: login.clientId,
    client_secret: login.clientSecret,
  });

  const grant = await client.grant({
    grant_type: 'client_credentials',
    scope: 'epi_definitions',
  }).catch((error) => console.error('Error', error.error));

  return grant?.access_token;
}

module.exports = {
  GetAccessToken
}