// esbuild.config.js
const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: ['./src/entry-client.tsx'],
  bundle: true,
  minify: true,
  format: 'iife', // IIFE is used to bundle for browsers; esbuild does not support UMD directly
  globalName: 'Widget', // This exposes your bundle as window.Widget
  outfile: path.resolve(__dirname, 'public', 'widget.js'),
  target: 'es2017',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
}).then(() => {
  console.log('Build succeeded with esbuild.');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});