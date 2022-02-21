'use strict'

const { ZwaveDevice } = require('homey-zwavedriver')

class SwitchLight extends ZwaveDevice {

  async onNodeInit ({ node }) {
    super.onNodeInit({ node })

    this.registerCapability('onoff', 'SWITCH_BINARY')
    this.registerCapability('measure_power', 'METER')
    this.registerCapability('meter_power', 'METER')

    this.registerReportListener('BASIC', 'BASIC_REPORT', report => {
      if (report && report.hasOwnProperty('Current Value')) {
        this.setCapabilityValue('onoff', report['Current Value'] > 0)
      }
    })
  }

}

module.exports = SwitchLight
