'use strict'

const SrZigBeeDriver = require('../../lib/SrZigBeeDriver')

class MyDriver extends SrZigBeeDriver {

  onInit () {
    super.onInit()

    this.getDeviceTriggerCard('on').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('off').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('level_move_with_onoff').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('level_stop_with_onoff').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })
  }

}

module.exports = MyDriver