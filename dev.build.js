const {resolve} = require('path')
const buildPath = resolve(__dirname, 'build')

const {build} = require('esbuild')

build({
    entryPoints: ['./client/client.ts'], 
    outdir: resolve (buildPath, 'client'), 
    bundle: true, 
    minify: true, 
    platform: 'browser', 
    target: 'es2020',
    logLevel: "info",
    watch: true
}).catch(() => process.exit(1))