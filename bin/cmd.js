#!/usr/bin/env node
var path = require('path')
var server = path.join(__dirname, '../server.js')
require('../')(server)
