'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { CLUSTER } = require('zigbee-clusters')

class MyLight extends ZigBeeDevice {

  async onNodeInit ({ zclNode, node }) {
    super.onNodeInit({ zclNode, node })

    const deviceClass = this.getSetting('device_class')
    if (typeof deviceClass === 'string') {
      this.log('current deviceclass settings ' + deviceClass)
      if (this.getClass() !== deviceClass) {
        this.log('set new class ' + deviceClass)
        await this.setClass(deviceClass)
      }
    }

    this.registerCapability('onoff', CLUSTER.ON_OFF)

    this._registerMeasurementAndMetering().catch(this.error)
  }

  async _registerMeasurementAndMetering() {

    let meterFactory = 1 / 3600000

    this.registerCapability('meter_power', CLUSTER.METERING, {
      get: 'currentSummationDelivered',
      report: 'currentSummationDelivered',
      reportParser: value => value * meterFactory,
      getParser: value => value * meterFactory,
      getOpts: {
        getOnStart: true,
        pollInterval: 60 * 60 * 1000,
      }
    })

    let measureFactory = 0.1

    this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT, {
      get: 'activePower',
      report: 'activePower',
      reportParser: value => value * measureFactory,
      getParser: value => value * measureFactory,
      getOpts: {
        getOnStart: true,
        pollInterval: 60 * 60 * 1000,
      }
    })
  }

}

module.exports = MyLight;
