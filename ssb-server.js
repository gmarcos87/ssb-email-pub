const ssbKeys = require('ssb-keys')
const ssbConfigInject = require('ssb-config/inject')
const path = require('path')

module.exports = function startSSB() {
  const config = ssbConfigInject()
  config.keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))
  config.logging.level = ''
  return require('scuttlebot/index')
    .use(require('scuttlebot/plugins/plugins'))
    .use(require('scuttlebot/plugins/master'))
    .use(require('scuttlebot/plugins/gossip'))
    .use(require('scuttlebot/plugins/replicate'))
    .use(require('ssb-friends'))
    .use(require('ssb-private'))
    .use(require('ssb-about'))
    .use(require('ssb-contacts'))
    .use(require('ssb-query'))
    .use(require('scuttlebot/plugins/invite'))
    .use(require('scuttlebot/plugins/block'))
    .use(require('scuttlebot/plugins/local'))
    .call(null, config)
}