'use strict'

const { ZwaveDevice } = require('homey-zwavedriver')

class SwitchLight extends ZwaveDevice {

  async onNodeInit ({ node }) {
    super.onNodeInit({ node })

    this.registerCapability('onoff', 'SWITCH_BINARY')

    if (this.hasCapability('measure_power')) {
      this.registerCapability('measure_power', 'METER')
    }

    if (this.hasCapability('meter_power')) {
      this.registerCapability('meter_power', 'METER')
    }

    this.registerReportListener('BASIC', 'BASIC_REPORT', report => {
      if (report && report.hasOwnProperty('Current Value')) {
        this.setCapabilityValue('onoff', report['Current Value'] > 0)
      }
    })
  }

}

module.exports = SwitchLight
