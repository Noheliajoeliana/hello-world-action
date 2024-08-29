// esbuild.config.js
const { build } = require('esbuild');

build({
  entryPoints: ['index.js'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  minify: true,
  sourcemap: false,
  target: ['node16'],
}).catch(() => process.exit(1));