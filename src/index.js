const debug = require('debug')('mutableConf:Loader')
debug('Initialising ESM')
// eslint-disable-next-line no-global-assign
require = require('esm')(module)
module.exports = require('./main.js')
