'use strict'

/**
 * Reference from https://github.com/athombv/com.ikea.tradfri.git
 */

const { ZigBeeDevice } = require('homey-zigbeedriver')
const { CLUSTER, BoundCluster } = require('zigbee-clusters')

// Abstract class
class ZigBeeRemoteControl extends ZigBeeDevice {

  async onNodeInit ({ zclNode, node }) {

    // this.enableDebug()
    // this.printNode()

    let batteryMultiplier = 1.0
    this.log('battery multiplier init value ' + batteryMultiplier)

    const cluster = this.zclNode.endpoints[this.getClusterEndpoint(CLUSTER.BASIC)].clusters[CLUSTER.BASIC.NAME]
    cluster.readAttributes('swBuildId').then(({ swBuildId }) => {

      let value = 1.0
      this.log('swBuildId ' + swBuildId)

      const swBuildIdValue = this.getSwBuildIdValue(swBuildId)
      if (swBuildIdValue >= 276) {
        value = 0.5
      }

      this.log('updateBatterMultiplier from ' + swBuildId + ', multiplier ' + value)
      batteryMultiplier = value
    })

    // Register measure_battery
    this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION,
      {
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 5, // Minimally once every 5 seconds
            maxInterval: 60000, // Maximally once every ~16 hours
            minChange: 5,
          },
        },
        getOpts: {
          getOnStart: true,
          getOnOnline: true,
          pollInterval: 30000,
        },
        reportParser: report => {
          this.log('reportParser => ' + JSON.stringify(report))
          return Math.round(report * batteryMultiplier)
        },
      })

    // Get battery report
    this.getClusterCapabilityValue('measure_battery',
      CLUSTER.POWER_CONFIGURATION).then(() => {})

  }

  triggerFlowWithFlowId (flowId, tokens = {}, state = {}) {
    this.triggerFlow({ id: flowId, tokens: tokens, state: state }).
      then(() => this.log(`flow was triggered: ${flowId}`)).
      catch(err => this.log(`Error: triggering flow: ${flowId}, `, err))
  }

  testingCommandHandler (...args) {
    this.log(`testingCommandHandler => ${JSON.stringify(args)}`)
  }

  getSwBuildIdValue(swBuildId) {

    const components = swBuildId.split('_')
    if (components.length != 2) {
      return 0
    }
    const versionString = components[0].replace(/\./g, '')
    const version = parseInt(versionString)
    return version
  }

}

module.exports = ZigBeeRemoteControl
