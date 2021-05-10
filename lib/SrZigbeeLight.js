'use strict'

const { ZigBeeLightDevice } = require('homey-zigbeedriver')
const { CLUSTER } = require('zigbee-clusters')

let isChangingDim = false
let changeDimTimeout = null

class SrZigbeeLight extends ZigBeeLightDevice {

  async onNodeInit ({
    zclNode,
    supportsHueAndSaturation,
    supportsColorTemperature,
  }) {
    super.onNodeInit(
      { zclNode, supportsHueAndSaturation, supportsColorTemperature })

    this._registerMeterPowerMeasurePower().then(this.log).catch(this.error)
  }

  async changeDimLevel (dim, opts = {}) {

    isChangingDim = true
    this.log('tmd isChangingDim true ')

    this.clearChangeDimTimeout()

    return super.changeDimLevel(dim, opts).then(async () => {

      // Don't recall `parseAttributeReport` within 2.5 seconds when `changeDimLevel`.
      changeDimTimeout = setTimeout(() => {

        this.log('tmd isChangingDim false ')
        isChangingDim = false
        changeDimTimeout = null

      }, 2500)
    })
  }

  async parseAttributeReport (capabilityId, cluster, payload) {

    if (isChangingDim && capabilityId === 'dim') {

      this.log('tmd report return null, isChangingDim true ')
      return null
    }

    return super.parseAttributeReport(capabilityId, cluster, payload)
  }

  clearChangeDimTimeout() {

    if (changeDimTimeout !== null) {

      this.log('tmd clear changeDimTimeout')
      clearTimeout(changeDimTimeout)
      changeDimTimeout = null
    }
  }

  async _registerMeterPowerMeasurePower() {

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

module.exports = SrZigbeeLight
