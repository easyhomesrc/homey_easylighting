'use strict'

const SrZwaveDriver = require('../../lib/SrZwaveDriver')

class MyDriver extends SrZwaveDriver {

  onInit () {
    super.onInit()

    this.onFlowTrigger = this.getDeviceTriggerCard('ZV9001K2_DIM2_on')
    this.onFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.offFlowTrigger = this.getDeviceTriggerCard('ZV9001K2_DIM2_off')
    this.offFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.onKeyHeldDownFlowTrigger = this.getDeviceTriggerCard(
      'ZV9001K2_DIM2_on_key_held_down')
    this.onKeyHeldDownFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.onKeyReleasedFlowTrigger = this.getDeviceTriggerCard('ZV9001K2_DIM2_on_key_released')
    this.onKeyReleasedFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.offKeyHeldDownFlowTrigger = this.getDeviceTriggerCard(
      'ZV9001K2_DIM2_off_key_held_down')
    this.offKeyHeldDownFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.offKeyReleasedFlowTrigger = this.getDeviceTriggerCard('ZV9001K2_DIM2_off_key_released')
    this.offKeyReleasedFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })
  }
}

module.exports = MyDriver
