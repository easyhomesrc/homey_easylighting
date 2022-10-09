'use strict'

const { ZigBeeDevice } = require('homey-zigbeedriver')
const { CLUSTER } = require('zigbee-clusters')

class MyDevice extends ZigBeeDevice {

  async onNodeInit ({ zclNode, node }) {

    const { subDeviceId } = this.getData()
    this.registerCapability('onoff', CLUSTER.ON_OFF,
      this.getOnOffConfiguration(subDeviceId))
  }

  getOnOffConfiguration (subDeviceId) {

    const endpointMap = {
      'secondOutlet': 2,
      'thirdOutlet': 3,
      'fourthOutlet': 4,
      'usb': 5,
    }

    let endpoint = 1
    if (endpointMap.hasOwnProperty(subDeviceId)) {
      endpoint = endpointMap[subDeviceId]
    }

    return {
      get: 'onOff',
      getOpts: {
        getOnStart: true,
      },
      set: value => (value ? 'setOn' : 'setOff'),
      setParser: () => ({}),
      report: 'onOff',
      reportParser (value) {
        return value
      },
      endpoint: endpoint,
    }
  }
}

module.exports = MyDevice
