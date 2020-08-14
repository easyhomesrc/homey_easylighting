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

    this.getDeviceTriggerCard('move_to_hue').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('move_to_color_temperature').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('move_to_level_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })
  }

}

module.exports = MyDriver