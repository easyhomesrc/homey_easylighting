'use strict'

const { Cluster, CLUSTER } = require('zigbee-clusters')
const SrSceneCluster = require('../../lib/SrSceneCluster')
const ZigBeeRemoteControl = require('../../lib/ZigBeeRemoteControl')
const OnOffBoundCluster = require('../../lib/OnOffBoundCluster')
const LevelControlBoundCluster = require('../../lib/LevelControlBoundCluster')
const SrUtils = require('../../lib/SrUtils')
const SrSceneBoundCluster = require('../../lib/SrSceneBoundCluster')

Cluster.addCluster(SrSceneCluster)

class MyDevice extends ZigBeeRemoteControl {

  async onNodeInit ({ zclNode, node }) {
    await super.onNodeInit({ zclNode, node })

    Object.keys(this.zclNode.endpoints).forEach((endpoint) => {

      this.zclNode.endpoints[endpoint].bind(CLUSTER.ON_OFF.NAME,
        new OnOffBoundCluster({
          onSetOff: this._onOffCommandHandler.bind(this, 'zgrc_key_013_off'),
          onSetOn: this._onOffCommandHandler.bind(this, 'zgrc_key_013_on'),
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

  _onOffCommandHandler (flowId, endpoint) {

    this.log(
      `_onOffCommandHandler => ${flowId}, ${endpoint}`)

    const tokens = {}
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard(flowId).trigger(this, tokens, state)
  }

  _onLevelMoveWithOnOff ({ moveMode, rate }, endpoint) {

    this.log(
      `_onLevelMoveWithOnOff ${moveMode} ${rate}, ${endpoint}`)

    const tokens = {
      'rate': SrUtils.getMoveLevelRateToken(rate),
    }
    const state = { 'group': endpoint }

    if (moveMode === 'up') {

      this.driver.getDeviceTriggerCard('zgrc_key_013_move_level_up').
        trigger(this, tokens, state)

    } else if (moveMode === 'down') {

      this.driver.getDeviceTriggerCard('zgrc_key_013_move_level_down').
        trigger(this, tokens, state)
    }
  }

  _onLevelStopWithOnOff (endpoint) {

    this.log(
      `_onLevelStopWithOnOff, ${endpoint}`)

    const tokens = {}
    const state = { 'group': endpoint }
    this.driver.getDeviceTriggerCard('zgrc_key_013_move_level_stopped').
      trigger(this, tokens, state)
  }

  _onRecallScene ({ groupId, sceneId }, endpoint) {

    this.log(`_onRecallScene ${groupId} ${sceneId}, ${endpoint}`)

    const tokens = {}
    const state = { 'group': sceneId.toString() }
    this.driver.getDeviceTriggerCard('zgrc_key_013_recall_scene').
      trigger(this, tokens, state)
  }

  _onStoreScene ({ groupId, sceneId }, endpoint) {

    this.log(`_onStoreScene ${groupId} ${sceneId}, ${endpoint}`)

    const tokens = {}
    const state = { 'group': sceneId.toString() }
    this.driver.getDeviceTriggerCard('zgrc_key_013_store_scene').
      trigger(this, tokens, state)
  }

}

module.exports = MyDevice
