'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver')
const { CLUSTER } = require('zigbee-clusters');

/**
 * Zigbee Compatible Ceiling Mount Occupancy Sensor
 */
class ZccmoSensorDevice extends ZigBeeDevice {
  async onNodeInit({ node }) {
    this.registerCapability('onoff', CLUSTER.ON_OFF)
    this.registerCapability('dim', CLUSTER.LEVEL_CONTROL)
  }
}

module.exports = ZccmoSensorDevice;
