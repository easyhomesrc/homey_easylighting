'use strict'

const { ZwaveDevice } = require('homey-zwavedriver')

class MyOutlet extends ZwaveDevice {

  async onNodeInit ({ node }) {

    // this.enableDebug()
    // this.printNode()

    this.registerCapability('onoff', 'SWITCH_BINARY')
    this.registerCapability('measure_power', 'METER')
    this.registerCapability('meter_power', 'METER')
  }

}

module.exports = MyOutlet
