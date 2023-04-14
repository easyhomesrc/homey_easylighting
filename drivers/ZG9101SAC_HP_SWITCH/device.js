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
  }

}

module.exports = MyLight;
