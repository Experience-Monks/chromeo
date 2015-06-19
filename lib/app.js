var serializerr = require('serializerr')
var fs = require('fs')
var createChromeo = require('./chromeo')
var findNodeModules = require('find-node-modules')
var path = require('path')

module.exports = create

function create (opt) {
  opt = opt || {}

  var basedir = opt.basedir || process.cwd()

  // Tell Electron to also look for modules in basedir
  Error.stackTraceLimit = Infinity
  process.env.NODE_PATH = findNodeModules({
    cwd: basedir,
    relative: false
  }).join(path.delimiter)

  var app = require('app')
  app.commandLine.appendSwitch('disable-http-cache')
  app.commandLine.appendSwitch('v', 0)
  app.commandLine.appendSwitch('vmodule', 'console=0')

  var BrowserWindow = require('browser-window')

  // Report crashes to atom server.
  require('crash-reporter').start()

  var chromeo
  var mainWindow = null
  var lastError = null
  app.on('window-all-closed', close)

  process.on('uncaughtException', function (err) {
    process.stderr.write((err.stack ? err.stack : err) + '\n')
    if (opt.watch) {
      lastError = err
      printLastError()
    } else {
      close()
    }
  })

  function close () {
    app.quit()
    if (chromeo) {
      chromeo.close()
    }
  }

  app.on('ready', function () {
    var basePort = opt.port || 3384
    require('getport')(basePort, function (err, port) {
      if (err) {
        console.error('Could not get available port')
        process.exit(1)
      }

      var defaultIndex = opt.index
      if (typeof opt.index === 'string') {
        defaultIndex = function () {
          return fs.createReadStream(opt.index)
        }
      }

      start(opt.entries, {
        port: port,
        host: opt.host || 'localhost',
        dir: opt.dir || basedir,
        entry: opt.serve || 'bundle.js',
        title: opt.title || 'chromeo',
        defaultIndex: defaultIndex
      })
    })
  })

  function start (entries, opt) {
    entries = entries || []
    chromeo = createChromeo(entries, opt)
      .on('connect', function (ev) {
        var frame = opt.frame
          ? opt.frame
          : { width: 0, height: 0, x: 0, y: 0 }

        if (typeof frame === 'boolean') {
          // default frame
          frame = { width: 640, height: 320 }
        }

        // a hidden browser window
        mainWindow = new BrowserWindow(frame)

        var webContents = mainWindow.webContents
        webContents.once('did-start-loading', function () {
          if (String(opt.devtool) !== 'false') {
            mainWindow.openDevTools({
              detach: String(opt.detach) !== 'false'
            })
          }

          chromeo.on('update', function () {
            if (mainWindow) {
              mainWindow.reload()
            }
          })
        })

        webContents.once('did-frame-finish-load', function () {
          mainWindow.once('dom-ready', function () {
            printLastError()
          })
        })

        mainWindow.show()
        mainWindow.loadUrl(ev.uri)

        mainWindow.once('closed', function () {
          mainWindow = null
          chromeo.close()
        })
        printLastError()
      })
  }

  function printLastError () {
    if (!mainWindow || !lastError) return
    var err = serializerr(lastError)
    mainWindow.webContents.executeJavaScript([
      '(function() {',
      // simulate server-side Error object
      'var errObj = ' + JSON.stringify(err),
      'var err = new Error()',
      'mixin(err, errObj)',
      'try {throw err} catch(e) {console.error(e)}',
      'function mixin(a, b) { for (var key in b) a[key] = b[key] }',
      '})()'
    ].join('\n'))
    lastError = null
  }
}
