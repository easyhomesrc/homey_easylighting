'use strict'

const SrZigBeeDriver = require('../../lib/SrZigBeeDriver')

class MyDriver extends SrZigBeeDriver {

  onInit () {
    super.onInit()

    this.getDeviceTriggerCard('ZGRC_KEY_002_on').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_002_off').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_002_level_step_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_002_level_move_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_002_level_stop_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_002_move_to_color_temperature').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_002_move_color_temperature').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_002_stop_move_step').
      registerRunListener(async (args, state) => {
        return true
      })
  }

}

module.exports = MyDriver
