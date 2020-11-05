'use strict'

const { CLUSTER, Cluster } = require('zigbee-clusters')

const SrColorControlCluster = require('../../lib/SrColorControlCluster')

const OnOffBoundCluster = require('../../lib/OnOffBoundCluster')
const LevelControlBoundCluster = require('../../lib/LevelControlBoundCluster')
const ColorControlBoundCluster = require('../../lib/ColorControlBoundCluster')

const ZigBeeRemoteControl = require('../../lib/ZigBeeRemoteControl')

const SrUtils = require('../../lib/SrUtils')

Cluster.addCluster(SrColorControlCluster)

class RemoteControl extends ZigBeeRemoteControl {

  async onNodeInit ({ zclNode, node }) {
    await super.onNodeInit({ zclNode, node })

    // Flows

    Object.keys(this.zclNode.endpoints).forEach((endpoint) => {

      this.zclNode.endpoints[endpoint].bind(CLUSTER.ON_OFF.NAME,
        new OnOffBoundCluster({
          onSetOff: this._onOffCommandHandler.bind(this, 'ZG2835_off'),
          onSetOn: this._onOffCommandHandler.bind(this, 'ZG2835_on'),
          endpoint: endpoint,
        }))

      this.zclNode.endpoints[endpoint].bind(CLUSTER.LEVEL_CONTROL.NAME,
        new LevelControlBoundCluster({
          onMoveToLevelWithOnOff: this._onMoveToLevelWithOnOff.bind(this),
          endpoint: endpoint,
        }))

      this.zclNode.endpoints[endpoint].bind(SrColorControlCluster.NAME,
        new ColorControlBoundCluster({
          onMoveToColorTemperature: this._onMoveToColorTemperature.bind(this),
          onMoveToHue: this._onMoveToHue.bind(this),
          endpoint: endpoint,
        }))

    })
  }

  _onOffCommandHandler (type, endpoint) {

    this.log(
      `_onOffCommandHandler => ${type}, ${endpoint}`)

    const tokens = {}
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard(type).trigger(this, tokens, state)
  }

  _onMoveToHue ({ hue }, endpoint) {

    const homeyHue = SrUtils.getHomeyHue(hue)
    this.log(`_onMoveToHue hue ${hue}, homey hue ${homeyHue}, ${endpoint}`)

    const tokens = { 'hue': homeyHue }
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard('ZG2835_move_to_hue').trigger(this, tokens, state)
  }

  _onMoveToColorTemperature ({ colorTemperature, transitionTime }, endpoint) {

    this.log(
      `_onMoveToColorTemperature ${colorTemperature} ${transitionTime}, ${endpoint}`)

    const tokens = {
      'color_temperature': SrUtils.getColorTemperatureToken(colorTemperature),
      'transition_time': Math.floor(transitionTime / 10),
    }
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard('ZG2835_move_to_color_temperature').
      trigger(this, tokens, state)
  }

  _onMoveToLevelWithOnOff ({ level, transitionTime }, endpoint) {

    this.log(`_onMoveToLevel ${level} ${transitionTime}, ${endpoint}`)

    const tokens = {
      'level': SrUtils.getMoveToLevelToken(level),
      'transition_time': Math.floor(transitionTime / 10),
    }
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard('ZG2835_move_to_level_with_onoff').
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
 Identify, On/Off, Level control, Ota, Color control
 [3, 5, 6, 8, 25, 768]

 */
