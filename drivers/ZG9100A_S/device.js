'use strict'

const { ZigBeeDevice } = require('homey-zigbeedriver')
const { CLUSTER } = require('zigbee-clusters')

class MyLight extends ZigBeeDevice {

  async onNodeInit ({ zclNode, node }) {
    super.onNodeInit({ zclNode, node })

    this.registerCapability('onoff', CLUSTER.ON_OFF)

    if (this.hasCapability('meter_power')) {

      const {
        multiplier,
        divisor,
      } = await this.zclNode.endpoints[this.getClusterEndpoint(
        CLUSTER.METERING)].clusters[CLUSTER.METERING.NAME].readAttributes(
        'multiplier', 'divisor')
      // this.log('multiplier ' + multiplier + ", divisor " + divisor)
      let meterFactory = 3600000
      if (multiplier > 0 && divisor > 0) {
        meterFactory = multiplier / divisor
      }

      this.registerCapability('meter_power', CLUSTER.METERING, {
        get: 'currentSummationDelivered',
        report: 'currentSummationDelivered',
        reportParser: value => value * meterFactory,
        getParser: value => value * meterFactory,
        getOpts: {
          getOnStart: true,
          pollInterval: 300000,
        },
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 300, // Minimally once every 5 minutes
            maxInterval: 60000, // Maximally once every ~16 hours
            minChange: 0.01 / meterFactory,
          },
        },
      })
    }

    if (this.hasCapability('measure_power')) {

      const {
        acPowerMultiplier,
        acPowerDivisor,
      } = await this.zclNode.endpoints[this.getClusterEndpoint(
        CLUSTER.ELECTRICAL_MEASUREMENT)].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
        'acPowerMultiplier', 'acPowerDivisor')
      // this.log('acPowerMultiplier ' + acPowerMultiplier + ", acPowerDivisor " + acPowerDivisor)
      let measureFactory = 0.1
      if (acPowerMultiplier > 0 && acPowerDivisor > 0) {
        measureFactory = acPowerMultiplier / acPowerDivisor
      }

      this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT, {
        get: 'activePower',
        report: 'activePower',
        reportParser: value => value * measureFactory,
        getParser: value => value * measureFactory,
        getOpts: {
          getOnStart: true,
          pollInterval: 60000,
        },
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 5, // Minimally once every 5 seconds
            maxInterval: 60000, // Maximally once every ~16 hours
            minChange: 1 / measureFactory,
          },
        },
      })
    }
  }

}

module.exports = MyLight
