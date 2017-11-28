const emoji = require('node-emoji')

const getWebpackConfig = require('../utils/getWebpackConfig')
const createWebpackCompiler = require('../utils/createWebpackCompiler')

module.exports = function build(options) {
  const config = getWebpackConfig(options)
  const compiler = createWebpackCompiler(config)
  console.log(
    emoji.get('eyes'),
    ' Creating development build and rebuilding on changes...\n'
  )
  compiler.watch({}, () => {})
}