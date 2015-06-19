var fromArgs = require('browserify/bin/args')

module.exports = function createBrowserify (args, opt) {
  var browserify = fromArgs(args, {
    cache: {},
    packageCache: {},
    commondir: false,
    builtins: {
      _process: require.resolve('./process.js')
    },
    basedir: opt.basedir,
    debug: opt.debug !== false
  })

  var builtins = [
    'ipc', 'remote', 'web-frame', 'clipboard', 'crash-reporter',
    'native-image', 'screen', 'shell'
  ]

  builtins.forEach(function (x) {
    browserify.exclude(x)
  })

  return browserify
}
