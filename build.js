const fs = require('fs/promises');
require('@vercel/ncc')('./index.js', {
  // provide a custom cache path or disable caching
  cache: false,
  minify: true, // default
  sourceMapRegister: false
}).then(async ({ code }) => {
  await fs.mkdir('./dist').catch(e => e);
  return fs.writeFile('./dist/index.js', code, { flag: 'w+' });
}).catch(error => {
  console.log('ERROR', error)
})