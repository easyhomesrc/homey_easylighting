'use strict'

const SrZigbeeLight = require('../../lib/SrZigbeeLight')
const { CLUSTER } = require('zigbee-clusters')

/**
 * Zigbee Compatible Ceiling Mount Occupancy Sensor
 */
class ZccmoSensorDevice extends SrZigbeeLight {

  async onNodeInit ({
    zclNode,
    supportsHueAndSaturation,
    supportsColorTemperature,
  }) {
    super.onNodeInit(
      { zclNode, supportsHueAndSaturation, supportsColorTemperature })

    try {

      this.registerCapability('measure_luminance',
        CLUSTER.ILLUMINANCE_MEASUREMENT)
      this.registerCapability('alarm_motion', CLUSTER.OCCUPANCY_SENSING, {
        get: 'occupancy',
        report: 'occupancy',
        reportParser: value => value['occupied'],
      })

    } catch (error) {
      this.error(error)
    }
  }
}

module.exports = ZccmoSensorDevice
