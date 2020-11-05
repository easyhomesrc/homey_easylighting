'use strict'

const SrZigBeeDriver = require('../../lib/SrZigBeeDriver')

class MyDriver extends SrZigBeeDriver {

  onInit () {
    super.onInit()

    this.getDeviceTriggerCard('ZG2833K2_EU07_on').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZG2833K2_EU07_off').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZG2833K2_EU07_level_move_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })

    this.getDeviceTriggerCard('ZG2833K2_EU07_level_stop_with_onoff').
      registerRunListener(async (args, state) => {
        return true
      })
  }

}

module.exports = MyDriver
