// This script sets up HTTPS for the application using the ASP.NET Core HTTPS certificate

const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');

const certFilePath = path.join(process.cwd(), `${process.env.npm_package_name}.pem`);
const keyFilePath = path.join(process.cwd(), `${process.env.npm_package_name}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
  spawn('dotnet', [
    'dev-certs',
    'https',
    '--export-path',
    certFilePath,
    '--format',
    'Pem',
    '--no-password',
  ], { stdio: 'inherit', })
  .on('exit', (code) => process.exit(code));
}