const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.module
      .rule('less')
      .oneOf('normal')
      .use('import-glob-loader')
      .loader('import-glob-loader');
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // Make all requesets go to index so friendly URLs
      // are working. But only if no static file is already being served.
      middlewares.push({
        name: 'serve-app',
        path: '*',
        middleware: (req, res) => {
          res.sendFile(path.join(__dirname, 'public/index.html'));
        },
      });

      return middlewares;
    },
  },
});
