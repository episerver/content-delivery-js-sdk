const path = require('path');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
    ? env.ASPNETCORE_URLS.split(';')[0]
    : 'http://localhost:8081';

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
    proxy: {
      '/api': {
        target,
        secure: true,
      },
      // Do not expect everything to work through the proxy.
      // Access the CMS from the target/origin directly.
      '/(episerver|Episerver|EPiServer)': {
        target: target,
        ws: true,
        cookieDomainRewrite: true,
        hostRewrite: target,
        secure: true,
        bypass: (req, res, proxyOptions) => {
          // Do not proxy content preview URLs, these do also start with 'episerver'.
          if (req.query['epieditmode']) {
            return req.originalUrl;
          }
        },
      },
      '/(util|Util)': {
        target,
        cookieDomainRewrite: true,
        hostRewrite: target,
        secure: true,
      },
      '/_framework': {
        target,
        ws: true,
        secure: true,
      },
    },
  },
};
