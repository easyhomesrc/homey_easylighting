'use strict'

const { CLUSTER, Cluster } = require('zigbee-clusters')

const SrSceneCluster = require('../../lib/SrSceneCluster')
const SrSceneBoundCluster = require('../../lib/SrSceneBoundCluster')

const OnOffBoundCluster = require('../../lib/OnOffBoundCluster')
const LevelControlBoundCluster = require('../../lib/LevelControlBoundCluster')

const ZigBeeRemoteControl = require('../../lib/ZigBeeRemoteControl')

const SrUtils = require('../../lib/SrUtils')

Cluster.addCluster(SrSceneCluster)

class RemoteControl extends ZigBeeRemoteControl {

  async onNodeInit ({ zclNode, node }) {
    await super.onNodeInit({ zclNode, node })

    // Flows

    Object.keys(this.zclNode.endpoints).forEach((endpoint) => {

      this.zclNode.endpoints[endpoint].bind(CLUSTER.ON_OFF.NAME,
        new OnOffBoundCluster({
          onSetOff: this._onOffCommandHandler.bind(this, 'ZGRC_KEY_014_off'),
          onSetOn: this._onOffCommandHandler.bind(this, 'ZGRC_KEY_014_on'),
          endpoint: endpoint,
        }))

      this.zclNode.endpoints[endpoint].bind(CLUSTER.LEVEL_CONTROL.NAME,
        new LevelControlBoundCluster({
          onStopWithOnOff: this._onLevelStopWithOnOff.bind(this),
          onMoveWithOnOff: this._onLevelMoveWithOnOff.bind(this),
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
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard(type).trigger(this, tokens, state)
  }

  _onRecallScene ({ groupId, sceneId }, endpoint) {

    this.log(`_onRecallScene ${groupId} ${sceneId}, ${endpoint}`)

    const tokens = {
      'group_id': groupId,
      'scene_id': sceneId,
    }
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard('ZGRC_KEY_014_recall_scene').
      trigger(this, tokens, state)
  }

  _onStoreScene ({ groupId, sceneId }, endpoint) {

    this.log(`_onStoreScene ${groupId} ${sceneId}, ${endpoint}`)

    const tokens = {
      'group_id': groupId,
      'scene_id': sceneId,
    }
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard('ZGRC_KEY_014_store_scene').
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
    this.driver.getDeviceTriggerCard('ZGRC_KEY_014_level_move_with_onoff').
      trigger(this, tokens, state)
  }

  _onLevelStopWithOnOff (endpoint) {

    this.log(
      `_onLevelStopWithOnOff, ${endpoint}`)

    const tokens = {}
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard('ZGRC_KEY_014_level_stop_with_onoff').
      trigger(this, tokens, state)
  }

}

module.exports = RemoteControl

/**

 (70100006)SR-ZG9001K12-DIM-Z3 instruction

 3 Groups

 # Input clusters
 Basic, Power Configuration, Identify, Diagnostics
 [0, 1, 3, 2821]

 # Output clusters
 Identify, Groups, Scenes, On/Off, Level Control, Ota
 [3, 4, 5, 6, 8, 25]

 */
