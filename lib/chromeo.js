var simpleServer = require('simple-watchify-server')
var createWatchify = require('watchify')
var createBrowserify = require('./create-browserify')

module.exports = function (entries, opt) {
  var bundlerOpts = entries.concat(opt.browserifyArgs)

  var browserify = createBrowserify(bundlerOpts, opt)
  var watchify = createWatchify(browserify, {
    delay: 0
  })

  var server = simpleServer(watchify, opt)
  return server
}
