'use strict'

const { CLUSTER, Cluster } = require('zigbee-clusters')

const OnOffBoundCluster = require('../../lib/OnOffBoundCluster')
const LevelControlBoundCluster = require('../../lib/LevelControlBoundCluster')
const ColorControlBoundCluster = require('../../lib/ColorControlBoundCluster')

const ZigBeeRemoteControl = require('../../lib/ZigBeeRemoteControl')
const SrColorControlCluster = require('../../lib/SrColorControlCluster')

const SrUtils = require('../../lib/SrUtils')

Cluster.addCluster(SrColorControlCluster)

class RemoteControl extends ZigBeeRemoteControl {

  async onNodeInit ({ zclNode, node }) {
    await super.onNodeInit({ zclNode, node })

    // Flows

    Object.keys(this.zclNode.endpoints).forEach((endpoint) => {

      this.zclNode.endpoints[endpoint].bind(CLUSTER.ON_OFF.NAME,
        new OnOffBoundCluster({
          onSetOff: this._onOffCommandHandler.bind(this, 'ZGRC_KEY_002_off'),
          onSetOn: this._onOffCommandHandler.bind(this, 'ZGRC_KEY_002_on'),
          endpoint: endpoint,
        }))

      this.zclNode.endpoints[endpoint].bind(CLUSTER.LEVEL_CONTROL.NAME,
        new LevelControlBoundCluster({
          onStepWithOnOff: this._onLevelStepWithOnOff.bind(this),
          onStopWithOnOff: this._onLevelStopWithOnOff.bind(this),
          onMoveWithOnOff: this._onLevelMoveWithOnOff.bind(this),
          endpoint: endpoint,
        }))

      this.zclNode.endpoints[endpoint].bind(CLUSTER.COLOR_CONTROL.NAME,
        new ColorControlBoundCluster({
            onMoveToColorTemperature: this._onMoveToColorTemperature.bind(this),
            onMoveColorTemperature: this._onMoveColorTemperature.bind(this),
            onStopMoveStep: this._onStopMoveStep.bind(this),
            endpoint: endpoint,
          },
        ))

    })
  }

  _onOffCommandHandler (type, endpoint) {

    this.log(
      `_onOffCommandHandler => ${type}, ${endpoint}`)

    const tokens = {}
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard(type).trigger(this, tokens, state)
  }

  _onLevelStepWithOnOff ({ mode, stepSize, transitionTime }, endpoint) {

    const tokens = {
      'mode': SrUtils.getStepLevelModeToken(mode),
      'step_size': SrUtils.getStepLevelStepSizeToken(stepSize),
      'transition_time': Math.floor(transitionTime / 10),
    }
    this.log(
      `_onLevelStepWithOnOff ${mode} ${stepSize} ${transitionTime}, ${endpoint}`)
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard('ZGRC_KEY_002_level_step_with_onoff').
      trigger(this, tokens, state)
  }

  _onLevelMoveWithOnOff ({ moveMode, rate }, endpoint) {

    this.log(
      `_onLevelMoveWithOnOff ${moveMode} ${rate}, ${endpoint}`)

    const tokens = {
      'move_mode': SrUtils.getMoveLevelMoveModeToken(moveMode),
      'rate': SrUtils.getMoveLevelRateToken(rate),
    }
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard('ZGRC_KEY_002_level_move_with_onoff').
      trigger(this, tokens, state)
  }

  _onLevelStopWithOnOff (endpoint) {

    this.log(
      `_onLevelStopWithOnOff, ${endpoint}`)

    const tokens = {}
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard('ZGRC_KEY_002_level_stop_with_onoff').
      trigger(this, tokens, state)
  }

  _onMoveToColorTemperature ({ colorTemperature, transitionTime }, endpoint) {

    this.log(
      `_onMoveToColorTemperature, ${colorTemperature}, ${transitionTime} ${endpoint}`)

    const tokens = {
      'color_temperature': SrUtils.getColorTemperatureToken(colorTemperature),
      'transition_time': Math.floor(transitionTime / 10),
    }
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard('ZGRC_KEY_002_move_to_color_temperature').
      trigger(this, tokens,
        state)
  }

  _onMoveColorTemperature (
    { moveMode, rate, colorTemperatureMinimumMireds, colorTemperatureMaximumMireds },
    endpoint) {

    this.log(
      `_onMoveColorTemperature, ${moveMode} ${rate} ${colorTemperatureMinimumMireds} ${colorTemperatureMaximumMireds} ${endpoint}`)

    const tokens = {
      'move_mode': SrUtils.getMoveColorTemperatureMoveModeToken(moveMode),
      'rate': SrUtils.getMoveColorTemperatureRateToken(rate)
    }
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard('ZGRC_KEY_002_move_color_temperature').
      trigger(this, tokens, state)
  }

  _onStopMoveStep (endpoint) {

    this.log(`_onStopMoveStep, ${endpoint}`)

    const tokens = {}
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard('ZGRC_KEY_002_stop_move_step').
      trigger(this, tokens, state)
  }

}

module.exports = RemoteControl

/**

 1 Groups

 Input clusters:
 Basic, Power Configuration, Identify, Diagnostics
 [0, 1, 3, 2821]

 Output clusters:
 Identify, On/Off, Level control, Ota, ColorControl
 [3, 6, 8, 25, 768]

 */
