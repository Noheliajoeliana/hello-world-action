const fs = require('fs/promises');
require('@vercel/ncc')('./index.js', {
  cache: false,
  minify: true,
  sourceMapRegister: false
}).then(async ({ code }) => {
  await fs.mkdir('./dist').catch(e => e);
  return fs.writeFile('./dist/index.js', code, { flag: 'w+' });
});