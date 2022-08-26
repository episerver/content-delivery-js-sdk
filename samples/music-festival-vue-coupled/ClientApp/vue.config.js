const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
    ? env.ASPNETCORE_URLS.split(';')[0]
    : 'http://localhost:8080';

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    // Add support for globbing import
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
    // The proxy is only needed if we want to be able to access the
    // client app via the Node.js process' host.
    proxy: {
      '/api': {
        target: target,
        secure: false,
      },
      // Do not expect everything to work through the proxy.
      // Access the CMS from the target/origin directly.
      '/(episerver|Episerver|EPiServer)': {
        target: target,
        cookieDomainRewrite: true,
        followRedirects: true,
        hostRewrite: target,
        secure: false,
        ws: true,
        bypass: (req, res, proxyOptions) => {
          // Do not proxy content preview URLs, these do also start with 'episerver'.
          if (req.query['epieditmode']) {
            return req.originalUrl;
          }
        },
      },
      '/(util|Util)': {
        target: target,
        cookieDomainRewrite: true,
        followRedirects: true,
        hostRewrite: target,
        secure: false,
      },
      '/_framework': {
        target: target,
        secure: false,
        ws: true,
      },
    },
  },
});
