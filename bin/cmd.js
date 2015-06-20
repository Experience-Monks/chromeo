#!/usr/bin/env node
var path = require('path')
var server = path.resolve(__dirname, '../', 'server.js')
require('../')(server)
