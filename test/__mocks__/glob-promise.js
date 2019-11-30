const path = require('path')
const glob = require('glob-promise')

module.exports = {
  sync: (params) => {
    const subpath = params.split(path.resolve(__dirname, '../..'))[1]
    if (params.search(/UnitTests/) !== -1) {
      params = `${path.resolve(__dirname, '../../test')}${subpath}`
    }
    const files = glob.sync(params)
    return files
  }
}
