'use strict'

const SrZwaveDriver = require('../../lib/SrZwaveDriver')

class MyDriver extends SrZwaveDriver {

  onInit () {
    super.onInit()

    this.openFlowTrigger = this.getDeviceTriggerCard('open')
    this.openFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.closedFlowTrigger = this.getDeviceTriggerCard(
      'closed')
    this.closedFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })
  }
}

module.exports = MyDriver
