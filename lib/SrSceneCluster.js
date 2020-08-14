'use strict'

/**
 * Reference from https://github.com/athombv/com.ikea.tradfri.git
 */

const { ScenesCluster, ZCLDataTypes } = require('zigbee-clusters')

class SrSceneCluster extends ScenesCluster {

  static get COMMANDS () {
    return {
      // ...super.COMMANDS,
      srStoreScene: {
        id: 0x04,
        args: {
          groupId: ZCLDataTypes.uint16,
          sceneId: ZCLDataTypes.uint8
        }
      },
      srRecallScene: {
        id: 0x05,
        args: {
          groupId: ZCLDataTypes.uint16,
          sceneId: ZCLDataTypes.uint8
        }
      }
    }
  }

}

module.exports = SrSceneCluster