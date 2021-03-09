const fs = require('fs');
const https = require('https');
const axios = require("axios");
const { isLocal } = require("../lib/utils");
const { GetAccessToken } = require("../lib/authService");

module.exports = {
  importManifest: async (path, source, options, login) => {
    let data;

    try {
      data = JSON.parse(fs.readFileSync(path, 'utf8'))
    } catch (error) {
      console.error('Error', error.message);
      return;
    }

    axios({
      url: `${source}/api/episerver/v2.0/contentmanifest`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${await GetAccessToken(login)}`,
      },
      params: {
        allowedUpgrades: options.allowedUpgrades,
        allowedDowngrades: options.allowedDowngrades,
      },
      data: data,
      httpsAgent: new https.Agent({
        rejectUnauthorized: isLocal(source),
      }),
    }).then((response) => {
      response.data.messages.forEach(message => {
        console.log(message.severity, message.message);
      });
    }).catch((error) => {
      if (error.response) {
        console.error('Error', error.response.status, error.response.statusText);
      } else {
        console.error('Error', error.message);
      }
    });
  },
}