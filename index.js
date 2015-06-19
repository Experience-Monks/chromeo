var proc = require('child_process')
var electron = require('electron-prebuilt')
var logger = require('./lib/fix-logs')
var minimist = require('minimist')

// spawn electron and clean up its logs
module.exports = function (server, args, opt) {
  args = args || process.argv.slice(2)

  var argv = minimist(args, {
    boolean: ['print'],
    alias: {
      rawOutput: 'raw-output'
    }
  }, opt)
  var p = proc.spawn(electron, [server].concat(args))

  p.stdout.pipe(process.stdout)

  // handle logging
  if (argv.rawOutput) {
    p.stderr.pipe(process.stderr)
  } else {
    // pipes actual errors and stdout from the server
    p.stderr.pipe(logger()).pipe(process.stderr)

    // optionally also pipe all console.logs to terminal
    // TODO: console.error should redirect to process.stderr
    p.stderr.pipe(logger({
      verbose: argv.console
    })).pipe(process.stdout)
  }
}
