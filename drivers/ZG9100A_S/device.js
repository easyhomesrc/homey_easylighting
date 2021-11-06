'use strict'

const { ZigBeeDevice } = require('homey-zigbeedriver')
const { CLUSTER, Cluster } = require('zigbee-clusters')

const SrBasicCluster = require('../../lib/SrBasicCluster')
Cluster.addCluster(SrBasicCluster)

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

    this._readExternalSwitchType()
  }

  async onSettings ({ oldSettings, newSettings, changedKeys }) {

    if (typeof newSettings['external_switch_type'] === 'string') {
      const newType = newSettings['external_switch_type']
      this.log('newType ' + newType)

      let value = 0x00

      if (newType === 'push_button') {
        value = 0x00
      } else if (newType === 'normal_on_off') {
        value = 0x01
      } else if (newType === 'three_channels') {
        value = 0x02
      }

      this._basicCluster().writeAttributes({
        externalSwitchType: value,
      }).then(() => {
        this.log('write new type success')
      }).catch(this.error)
    }
  }

  _readExternalSwitchType () {

    this._basicCluster().readAttributes('externalSwitchType').then(value => {
      this.log(`read externalSwitchType`, value)

      const typeValue = value['externalSwitchType']
      let type = 'push_button'
      if (typeValue === 0) {
        type = 'push_button'
      } else if (typeValue === 1) {
        type = 'normal_on_off'
      } else if (typeValue === 2) {
        type = 'three_channels'
      }
      this.setSettings({
        'external_switch_type': type,
      }).catch(this.error)

    }).catch(this.error)
  }

  _basicCluster () {
    return this.zclNode.endpoints[1].clusters.basic
  }
}

module.exports = MyLight
