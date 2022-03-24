'use strict'

const { ZigBeeLightDevice } = require('homey-zigbeedriver')
const { CLUSTER } = require('zigbee-clusters')

class SrZigbeeLight extends ZigBeeLightDevice {

  async onNodeInit ({
    zclNode,
    supportsHueAndSaturation,
    supportsColorTemperature,
  }) {
    super.onNodeInit(
      { zclNode, supportsHueAndSaturation, supportsColorTemperature })

    this.isChangingDim = false
    this.changeDimTimeout = null

    this._registerMeterPowerMeasurePower().then(this.log).catch(this.error)

    if (this.hasCapability('onoff')) {
      this.zclNode.endpoints[1].clusters.onOff.on('attr.onOff', async value => {
        const oldValue = await this.getCapabilityValue('onoff')
        if (value === oldValue) {
          console.log(`attr.onOff old value, ignore`, value)
        } else {
          console.log(`attr.onOff new value`, value)
          await this.setCapabilityValue('onoff', value).catch(this.error)
        }
      })
    }

    if (this.hasCapability('dim')) {
      this.zclNode.endpoints[1].clusters.levelControl.on('attr.currentLevel', async value => {
        const oldValue = await this.getCapabilityValue('dim')
        const diff = Math.abs(oldValue * 254 - value)
        console.log(`attr.currentLevel oldValue newValue diff`, oldValue, value, diff)
        if (diff >= 5) {
          let newValue = parseFloat((value / 0xFE).toFixed(2))
          await this.setCapabilityValue('dim', newValue).catch(this.error)
        }
      })
    }
  }

  async changeDimLevel (dim, opts = {}) {

    this.isChangingDim = true
    this.log('tmd isChangingDim true ')

    this.clearChangeDimTimeout()

    return super.changeDimLevel(dim, opts).then(async () => {

      // Don't recall `parseAttributeReport` within 2.5 seconds when `changeDimLevel`.
      this.changeDimTimeout = this.homey.setTimeout(() => {

        this.log('tmd isChangingDim false ')
        this.isChangingDim = false
        this.changeDimTimeout = null

      }, 2500)
    }).catch(this.error)
  }

  async parseAttributeReport (capabilityId, cluster, payload) {

    if (this.isChangingDim && capabilityId === 'dim') {

      this.log('tmd report return null, isChangingDim true ')
      return null
    }

    return super.parseAttributeReport(capabilityId, cluster, payload).catch(this.error)
  }

  clearChangeDimTimeout () {

    if (this.changeDimTimeout !== null) {

      this.log('tmd clear changeDimTimeout')
      clearTimeout(this.changeDimTimeout)
      this.changeDimTimeout = null
    }
  }

  async _registerMeterPowerMeasurePower () {

    if (this.hasCapability('meter_power')) {

      const {
        multiplier,
        divisor,
      } = await this.zclNode.endpoints[this.getClusterEndpoint(
        CLUSTER.METERING)].clusters[CLUSTER.METERING.NAME].readAttributes(
        'multiplier', 'divisor').catch(this.error)
      // this.log('multiplier ' + multiplier + ", divisor " + divisor)
      let meterFactory = 1.0 / 3600000.0
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
          pollInterval: 60 * 60 * 1000,
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
        'acPowerMultiplier', 'acPowerDivisor').catch(this.error)
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
          pollInterval: 60 * 60 * 1000,
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
