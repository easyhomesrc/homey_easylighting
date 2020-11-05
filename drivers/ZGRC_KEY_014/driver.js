'use strict'

const SrZigBeeDriver = require('../../lib/SrZigBeeDriver')

class MyDriver extends SrZigBeeDriver {

  onInit () {
    super.onInit()

    this.getDeviceTriggerCard('ZGRC_KEY_014_on').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('ZGRC_KEY_014_off').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('ZGRC_KEY_014_recall_scene').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('ZGRC_KEY_014_store_scene').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('ZGRC_KEY_014_level_move_with_onoff').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('ZGRC_KEY_014_level_stop_with_onoff').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

  }

}

module.exports = MyDriver
