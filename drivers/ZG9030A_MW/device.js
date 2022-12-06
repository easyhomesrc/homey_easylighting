'use strict';

const SrZigbeeLight = require('../../lib/SrZigbeeLight')
const { Cluster, CLUSTER } = require('zigbee-clusters');
const SrBasicCluster = require('../../lib/SrBasicCluster')
const { 
  binaryToString,
  binaryToBoolean,
  limitedRange
} = require('../../lib/SrUtils')

Cluster.addCluster(SrBasicCluster)

/**
 * Zigbee Compatible Ceiling Mount Occupancy Sensor
 */
class ZccmoSensorDevice extends SrZigbeeLight {

  async onNodeInit({ node }) {
    try {
      this.registerCapability('onoff', CLUSTER.ON_OFF)
      this.registerCapability('dim', CLUSTER.LEVEL_CONTROL)
      this.registerCapability('measure_luminance', CLUSTER.ILLUMINANCE_MEASUREMENT)
      this.registerCapability('alarm_motion', CLUSTER.OCCUPANCY_SENSING)

      super._clusterAttributeToSetting('dimmingBrightnessCurve', 1, binaryToString)
      super._clusterAttributeToSetting('motionSensorOperationMode', 1, binaryToBoolean)
      super._clusterAttributeToSetting('motionSensorDaylightSensorLuxThreshold', 1)
      super._clusterAttributeToSetting('motionSensorSensitivity', 1)
      super._clusterAttributeToSetting('enableMotionSensor', 2, binaryToBoolean)
      super._clusterAttributeToSetting('enableBrightnessModule', 3, binaryToBoolean)
      super._clusterAttributeToSetting('lightOnTime', 1)
      super._clusterAttributeToSetting('pwmBrightnessValue', 1)
      super._clusterAttributeToSetting('pwmOutputPercentage', 1)
    } catch (error) {
      this.error(error)
    }
  }

  async onSettings ({ oldSettings, newSettings, changedKeys }) {
    try {
      this.log({ oldSettings, newSettings, changedKeys })
      super._clusterAttributeFromSetting(newSettings, 'dimmingBrightnessCurve', 1)
      super._clusterAttributeFromSetting(newSettings, 'motionSensorOperationMode', 1)
      super._clusterAttributeFromSetting(newSettings, 'motionSensorDaylightSensorLuxThreshold', 1, value => limitedRange(value, [0, 0xffff]))
      super._clusterAttributeFromSetting(newSettings, 'motionSensorSensitivity', 1, value => limitedRange(value, [0, 0x0f]))
      super._clusterAttributeFromSetting(newSettings, 'enableMotionSensor', 2)
      super._clusterAttributeFromSetting(newSettings, 'enableBrightnessModule', 3)
      super._clusterAttributeFromSetting(newSettings, 'lightOnTime', 1, value => limitedRange(value, [0, 0xffff]))
      super._clusterAttributeFromSetting(newSettings, 'pwmBrightnessValue', 1, value => limitedRange(value, [0, 0xffff]))
      super._clusterAttributeFromSetting(newSettings, 'pwmOutputPercentage', 1, value => limitedRange(value, [0, 0xfe]))
    } catch (error) {
      this.error(error)
    }
  }
}

module.exports = ZccmoSensorDevice;
