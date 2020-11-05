'use strict'

const SrZwaveDriver = require('../../lib/SrZwaveDriver')

class MyDriver extends SrZwaveDriver {

  onInit () {
    super.onInit()

    this.onFlowTrigger = this.getDeviceTriggerCard('ZV9001K4_DIM_on')
    this.onFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.offFlowTrigger = this.getDeviceTriggerCard('ZV9001K4_DIM_off')
    this.offFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.onKeyHeldDownFlowTrigger = this.getDeviceTriggerCard(
      'ZV9001K4_DIM_on_key_held_down')
    this.onKeyHeldDownFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.onKeyReleasedFlowTrigger = this.getDeviceTriggerCard('ZV9001K4_DIM_on_key_released')
    this.onKeyReleasedFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.offKeyHeldDownFlowTrigger = this.getDeviceTriggerCard(
      'ZV9001K4_DIM_off_key_held_down')
    this.offKeyHeldDownFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.offKeyReleasedFlowTrigger = this.getDeviceTriggerCard(
      'ZV9001K4_DIM_off_key_released')
    this.offKeyReleasedFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.levelUpFlowTrigger = this.getDeviceTriggerCard('ZV9001K4_DIM_level_up')
    this.levelUpFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.levelDownFlowTrigger = this.getDeviceTriggerCard('ZV9001K4_DIM_level_down')
    this.levelDownFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.levelUpKeyHeldDownFlowTrigger = this.getDeviceTriggerCard(
      'ZV9001K4_DIM_level_up_key_held_down')
    this.levelUpKeyHeldDownFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.levelUpKeyReleasedFlowTrigger = this.getDeviceTriggerCard('ZV9001K4_DIM_level_up_key_released')
    this.levelUpKeyReleasedFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.levelDownKeyHeldDownFlowTrigger = this.getDeviceTriggerCard(
      'ZV9001K4_DIM_level_down_key_held_down')
    this.levelDownKeyHeldDownFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })

    this.levelDownKeyReleasedFlowTrigger = this.getDeviceTriggerCard(
      'ZV9001K4_DIM_level_down_key_released')
    this.levelDownKeyReleasedFlowTrigger.registerRunListener(async (args, state) => {
      return true
    })
  }
}

module.exports = MyDriver
