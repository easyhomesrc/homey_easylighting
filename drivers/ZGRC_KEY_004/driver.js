'use strict'

const SrZigBeeDriver = require('../../lib/SrZigBeeDriver')

class MyDriver extends SrZigBeeDriver {

  onInit () {
    super.onInit()

    this.getDeviceTriggerCard('ZGRC_KEY_004_on').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_004_off').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_004_level_move_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_004_level_stop_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })
  }

}

module.exports = MyDriver
