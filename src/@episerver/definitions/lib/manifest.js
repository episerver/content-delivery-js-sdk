const fs = require('fs');
const axios = require("axios");

module.exports = {
  importManifest: (path, source, allowedUpgrades, allowedDowngrades) => {
    let data;

    try {
      data = JSON.parse(fs.readFileSync(path, 'utf8'))
    } catch (error) {
      console.error('Error', error.message);
      return;
    }
  
    axios({
      method: 'put',
      url: `${source}/api/episerver/v2.0/manifest`, 
      data: data,
      params: {
        allowedUpgrades: allowedUpgrades,
        allowedDowngrades: allowedDowngrades,
      },
    }).then((response) => {
      response.data.forEach(message => {
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