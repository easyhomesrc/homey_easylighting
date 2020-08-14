'use strict'

const SrZigBeeDriver = require('../../lib/SrZigBeeDriver')

class MyDriver extends SrZigBeeDriver {

  onInit () {
    super.onInit()

    this.getDeviceTriggerCard('on').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('off').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('level_step_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('level_move_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('level_stop_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })
  }

}

module.exports = MyDriver