var args = process.argv.slice(2)
var argv = require('minimist')(args, {
  boolean: ['devtool', 'watch'],
  default: { devtool: true },
  '--': true
})

argv.entries = argv._
argv.browserifyArgs = argv['--'] || []
require('./lib/app')(argv)
