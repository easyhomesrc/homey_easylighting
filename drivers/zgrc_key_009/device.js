'use strict'

const { CLUSTER, Cluster } = require('zigbee-clusters')
const OnOffBoundCluster = require('../../lib/OnOffBoundCluster')
const LevelControlBoundCluster = require('../../lib/LevelControlBoundCluster')
const ColorControlBoundCluster = require('../../lib/ColorControlBoundCluster')
const ZigBeeRemoteControl = require('../../lib/ZigBeeRemoteControl')

const SrUtils = require('../../lib/SrUtils')
const SrColorControlCluster = require('../../lib/SrColorControlCluster')
const SrSceneCluster = require('../../lib/SrSceneCluster')
const SrSceneBoundCluster = require('../../lib/SrSceneBoundCluster')

Cluster.addCluster(SrSceneCluster)
Cluster.addCluster(SrColorControlCluster)

class MyDevice extends ZigBeeRemoteControl {

  async onNodeInit ({ zclNode, node }) {
    await super.onNodeInit({ zclNode, node })

    // Flows

    Object.keys(this.zclNode.endpoints).forEach((endpoint) => {

      this.zclNode.endpoints[endpoint].bind(CLUSTER.ON_OFF.NAME,
        new OnOffBoundCluster({
          onSetOff: this._onOffCommandHandler.bind(this, 'ZGRC_KEY_009_off'),
          onSetOn: this._onOffCommandHandler.bind(this, 'ZGRC_KEY_009_on'),
          endpoint: endpoint,
        }))

      this.zclNode.endpoints[endpoint].bind(CLUSTER.LEVEL_CONTROL.NAME,
        new LevelControlBoundCluster({
          onStopWithOnOff: this._onLevelStopWithOnOff.bind(this),
          onMoveWithOnOff: this._onLevelMoveWithOnOff.bind(this),
          onStepWithOnOff: this._onStepWithOnOff.bind(this),
          endpoint: endpoint,
        }))

      this.zclNode.endpoints[endpoint].bind(CLUSTER.COLOR_CONTROL.NAME,
        new ColorControlBoundCluster({
          onMoveToColorTemperature: this._onMoveToColorTemperature.bind(this),
          onMoveToColor: this._onMoveToColor.bind(this),
          onMoveColorTemperature: this._onMoveColorTemperature.bind(this),
          onStopMoveStep: this._onStopMoveStep.bind(this),
          onMoveHue: this._onMoveHue.bind(this),
          endpoint: endpoint,
        }))

      this.zclNode.endpoints[endpoint].bind(SrSceneCluster.NAME,
        new SrSceneBoundCluster({
          onSrStoreScene: this._onStoreScene.bind(this),
          onSrRecallScene: this._onRecallScene.bind(this),
          endpoint: endpoint,
        }))

    })
  }

  _onOffCommandHandler (type, endpoint) {

    this.log(
      `_onOffCommandHandler => ${type}, ${endpoint}`)

    const tokens = {}
    this.driver.getDeviceTriggerCard(type).trigger(this, tokens, null)
  }

  _onLevelMoveWithOnOff ({ moveMode, rate }, endpoint) {

    this.log(
      `_onLevelMoveWithOnOff ${moveMode} ${rate}, ${endpoint}`)

    const tokens = {
      'rate': SrUtils.getMoveLevelRateToken(rate),
    }

    if (moveMode === 'up') {

      this.driver.getDeviceTriggerCard('ZGRC_KEY_009_level_move_with_onoff_up').
        trigger(this, tokens, null)

    } else if (moveMode === 'down') {

      this.driver.getDeviceTriggerCard(
        'ZGRC_KEY_009_level_move_with_onoff_down').
        trigger(this, tokens, null)
    }
  }

  _onLevelStopWithOnOff (endpoint) {

    this.log(
      `_onLevelStopWithOnOff, ${endpoint}`)

    const tokens = {}
    this.driver.getDeviceTriggerCard('ZGRC_KEY_009_level_stop_with_onoff').
      trigger(this, tokens, null)
  }

  _onStepWithOnOff ({ mode, stepSize }, endpoint) {

    const tokens = {
      'percentage': SrUtils.getStepLevelStepSizeToken(stepSize),
    }

    this.log(
      `_onStepWithOnOff ${mode} ${stepSize}, ${endpoint} `, tokens)

    if (mode === 'up') {

      this.driver.getDeviceTriggerCard('ZGRC_KEY_009_level_step_with_onoff_up').
        trigger(this, tokens, null)

    } else if (mode === 'down') {

      this.driver.getDeviceTriggerCard(
        'ZGRC_KEY_009_level_step_with_onoff_down').
        trigger(this, tokens, null)
    }
  }

  _onMoveToColorTemperature ({ colorTemperature }, endpoint) {

    /*
    {
      colorTemperature: 450,
      transitionTime: 0
    }
     */

    const tokens = {
      'color_temperature': SrUtils.getColorTemperatureToken(
        colorTemperature),
    }

    this.log(`_onMoveToColorTemperature `, colorTemperature, endpoint, tokens)

    this.driver.getDeviceTriggerCard('ZGRC_KEY_009_move_to_color_temperature').
      trigger(this, tokens, null)
  }

  _onMoveColorTemperature ({ moveMode, rate }, endpoint) {

    /*
    {
      moveMode: 'up', // or 'down',
      rate: 60,
      colorTemperatureMinimumMireds: 155,
      colorTemperatureMaximumMireds: 450
    }
     */

    const tokens = {
      rate: SrUtils.getMoveColorTemperatureRateToken(rate),
    }
    this.log(`_onMoveColorTemperature `, moveMode, rate, endpoint, tokens)

    if (moveMode === 'up') {

      this.driver.getDeviceTriggerCard(
        'ZGRC_KEY_009_move_color_temperature_up').
        trigger(this, tokens, null)

    } else if (moveMode === 'down') {

      this.driver.getDeviceTriggerCard(
        'ZGRC_KEY_009_move_color_temperature_down').
        trigger(this, tokens, null)
    }
  }

  _onStopMoveStep (endpoint) {

    this.log(`_onStopMoveStep`, endpoint)

    this.driver.getDeviceTriggerCard('ZGRC_KEY_009_stop_move_step').
      trigger(this, null, null)
  }

  _onMoveToColor ({ colorX, colorY }, endpoint) {

    /*
    {
      colorX: 10878,
      colorY: 589,
      transitionTime: 0
    }
     */

    const tokens = {
      'color_x': colorX,
      'color_y': colorY,
    }
    this.log(`_onMoveToColor `, colorX, colorY, endpoint, tokens)
    this.driver.getDeviceTriggerCard('ZGRC_KEY_009_move_to_color').
      trigger(this, tokens, null)
  }

  _onMoveHue ({ moveMode, rate }, endpoint) {

    /*
    { moveMode: 'up', rate: 30 }
    { moveMode: 'stop', rate: 0 }
     */

    const tokens = {
      rate: SrUtils.getMoveHueRateToken(rate),
    }
    this.log(`_onMoveHue `, moveMode, rate, endpoint, tokens)

    if (moveMode === 'up') {

      this.driver.getDeviceTriggerCard('ZGRC_KEY_009_move_hue_up').
        trigger(this, tokens, null)

    } else if (moveMode === 'down') {

      this.driver.getDeviceTriggerCard('ZGRC_KEY_009_move_hue_down').
        trigger(this, tokens, null)

    } else if (moveMode === 'stop') {

      this.driver.getDeviceTriggerCard('ZGRC_KEY_009_move_hue_stop').
        trigger(this, null, null)

    }
  }

  _onStoreScene({ sceneId }, endpoint) {

    this.log(`_onStoreScene`, sceneId, endpoint)
    this.driver.getDeviceTriggerCard('ZGRC_KEY_009_store_scene_s' + sceneId).
      trigger(this, null, null)
  }

  _onRecallScene({ sceneId }, endpoint) {

    this.log(`_onRecallScene`, sceneId, endpoint)
    this.driver.getDeviceTriggerCard('ZGRC_KEY_009_recall_scene_s' + sceneId).
      trigger(this, null, null)
  }

}

module.exports = MyDevice
