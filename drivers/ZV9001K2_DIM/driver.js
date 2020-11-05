'use strict'

const SrZwaveDriver = require('../../lib/SrZwaveDriver')

class MyDriver extends SrZwaveDriver {

  onInit () {
    super.onInit()

    this.onOffFlowTrigger = this.getDeviceTriggerCard('ZV9001K2_DIM_on_off')
    this.onOffFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.onOffKeyHeldDownFlowTrigger = this.getDeviceTriggerCard(
      'ZV9001K2_DIM_on_off_key_held_down')
    this.onOffKeyHeldDownFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.onOffKeyReleasedFlowTrigger = this.getDeviceTriggerCard('ZV9001K2_DIM_on_off_key_released')
    this.onOffKeyReleasedFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.levelFlowTrigger = this.getDeviceTriggerCard('ZV9001K2_DIM_level')
    this.levelFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.levelKeyHeldDownFlowTrigger = this.getDeviceTriggerCard(
      'ZV9001K2_DIM_level_key_held_down')
    this.levelKeyHeldDownFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.levelKeyReleasedFlowTrigger = this.getDeviceTriggerCard('ZV9001K2_DIM_level_key_released')
    this.levelKeyReleasedFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })
  }
}

module.exports = MyDriver
