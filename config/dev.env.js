'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_SERVER: '"http://localhost:3001"',
  MOSQUITTO_SERVER: '"ws://127.0.0.1:1884"'
})
