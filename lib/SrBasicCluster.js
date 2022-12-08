const { BasicCluster } = require('zigbee-clusters')
const SrClusterAttributes = require('./SrClusterAttributes')

class SrBasicCluster extends BasicCluster {

  static get COMMANDS () {
    return super.COMMANDS
  }

  static get ATTRIBUTES () {
    return {
      ...SrClusterAttributes
    }
  }
}

module.exports = SrBasicCluster
