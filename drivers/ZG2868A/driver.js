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

    this.getDeviceTriggerCard('move_to_hue').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('move_to_saturation').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('move_saturation').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('recall_scene').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('store_scene').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('level_step_with_onoff').
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

    this.getDeviceTriggerCard('step_color_temperature').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('move_to_color_temperature').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('move_color_temperature').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })

    this.getDeviceTriggerCard('stop_move_step').
      registerRunListener(async (args, state) => {
        return args.group === state.group
      })
  }

}

module.exports = MyDriver