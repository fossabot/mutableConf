import * as fs from 'fs'
import * as _ from 'lodash'
const debug = require('debug')('mutableConf:Core')

var conf
var confPath

function mutableConf () {
  // Blank root function
}

mutableConf.init = (path, useSeed = 0, seed = { mutableConf: { format: '1.0.0' }, conf: {} }) => {
  return new Promise((resolve, reject) => {
    confPath = path
    fs.access(confPath, fs.constants.F_OK, (err) => {
      debug(`Config on disk at ${confPath} ${err ? 'does not exist, a new blank config will be created' : 'exists and will be loaded'}`)
      if (!err) {
        fs.readFile(confPath, 'utf8', (err, data) => {
          if (err) throw err
          conf = JSON.parse(data)
          resolve(conf)
          debug(`Config loaded: ${JSON.stringify(conf)}`)
        })
      } else if (err.code === 'ENOENT') {
        fs.writeFile(confPath, seed, () => debug(`Blank config created at ${confPath}`))
        conf = seed
        resolve(conf)
      } else if (err) {
        debug(err)
        reject(Error(err))
      }
    })
  })
}

mutableConf.set = (key, value) => {
  return new Promise((resolve, reject) => {
    debug(`Setting '${key}' to '${value}'`)
    _.set(conf, `conf.${key}`, value)
    mutableConf.save()
    resolve()
  })
}

mutableConf.get = (key) => {
  debug(conf)
  var value = _.get(conf, `conf.${key}`)
  return value
}

mutableConf.save = () => {
  var confFile = JSON.stringify(conf)
  fs.writeFile(confPath, confFile, () => debug(`Config saved at ${confPath}`))
}

export { mutableConf }
