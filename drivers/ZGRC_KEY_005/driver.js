'use strict'

const SrZigBeeDriver = require('../../lib/SrZigBeeDriver')

class MyDriver extends SrZigBeeDriver {

  onInit () {
    super.onInit()

    this.getDeviceTriggerCard('ZGRC_KEY_005_on').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_005_off').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_005_level_step_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_005_level_move_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_005_level_stop_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_005_move_to_color_temperature').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_005_move_color_temperature').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_005_stop_move_step').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_005_move_to_color').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZGRC_KEY_005_move_hue').
      registerRunListener(async (args, state) => {
        return true
      })
  }

}

module.exports = MyDriver
