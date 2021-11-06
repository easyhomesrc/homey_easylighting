const { BasicCluster, ZCLDataTypes } = require('zigbee-clusters')

class SrBasicCluster extends BasicCluster {

  static get COMMANDS () {
    return super.COMMANDS
  }

  static get ATTRIBUTES () {
    return {
      externalSwitchType: {
        id: 0x8803,
        type: ZCLDataTypes.uint8,
      },
    }
  }
}

module.exports = SrBasicCluster
