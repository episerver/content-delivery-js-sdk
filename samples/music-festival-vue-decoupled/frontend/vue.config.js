const path = require('path');

module.exports = {
  chainWebpack: (config) => {
    // Add support for globbing import
    config.module
      .rule('less')
      .oneOf('normal')
      .use('import-glob-loader')
      .loader('import-glob-loader');
  },
  devServer: {
    // Make all requesets go to index so friendly URLs
    // are working. But only if no static file is already being served.
    after(app) {
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public/index.html'));
      });
    },
  },
};
