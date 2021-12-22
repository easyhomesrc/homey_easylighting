'use strict'

const SrZigbeeLight = require('../../lib/SrZigbeeLight')
const SrSceneCluster = require('../../lib/SrSceneCluster')

const { CLUSTER, Cluster } = require('zigbee-clusters')

const SrBasicCluster = require('../../lib/SrBasicCluster')
Cluster.addCluster(SrBasicCluster)

Cluster.addCluster(SrSceneCluster)

class DimLight extends SrZigbeeLight {

  async onNodeInit ({ zclNode, node }) {
    super.onNodeInit({ zclNode, node })

    this._readExternalSwitchType()
  }

  async levelStepRunListener (args, state) {

    const payload = {
      mode: args.mode,
      stepSize: Math.round(args.step_size * 0xFE),
      transitionTime: args.transition_time * 10,
    }
    this.log(`levelStepRunListener => `, payload)
    return this.levelControlCluster.stepWithOnOff(payload).then(() => {
      this.onLevelControlEnd()
    })
  }

  async levelMoveRunListener (args, state) {

    const payload = {
      moveMode: args.move_mode,
      rate: Math.round(args.rate * 0xFE),
    }
    this.log(`levelMoveRunListener => `, payload)
    return this.levelControlCluster.moveWithOnOff(payload)
  }

  async levelStopRunListener (args, state) {

    this.log(`levelStopRunListener => `)
    return this.levelControlCluster.stopWithOnOff().then(() => {
      this.onLevelControlEnd()
    })
  }

  async onLevelControlEnd () {

    let levelControlCluster
    try {
      levelControlCluster = this.levelControlCluster
    } catch (err) {
      return
    }

    const {
      currentLevel,
    } = await levelControlCluster.readAttributes(
      'currentLevel',
    )

    this.log('onLevelControlEnd', {
      currentLevel,
    })

    await this.setCapabilityValue('dim', currentLevel / 0xFE)

    if (currentLevel === 0) {
      await this.setCapabilityValue('onoff', false)
    } else if (this.getCapabilityValue('onoff') === false && currentLevel > 0) {
      await this.setCapabilityValue('onoff', true)
    }
  }

  async storeSceneRunListener (args, state) {
    const payload = {
      groupId: args.group_id,
      sceneId: args.scene_id,
    }
    this.log('storeSceneRunListener => ', payload)
    return this.scenesCluster.srStoreScene(payload)
  }

  async recallSceneRunListener (args, state) {
    const payload = {
      groupId: args.group_id,
      sceneId: args.scene_id,
    }
    this.log('recallSceneRunListener => ', payload)
    return this.scenesCluster.srRecallScene(payload).then(() => {
      this.onEndDeviceAnnounce()
    }).catch(this.error)
  }

  get scenesCluster () {
    const scenesCluster = this.getClusterEndpoint(CLUSTER.SCENES)
    if (scenesCluster === null) throw new Error('missing_scenes_cluster')
    return this.zclNode.endpoints[scenesCluster].clusters.scenes
  }

  async onSettings ({ oldSettings, newSettings, changedKeys }) {

    if (typeof newSettings['external_switch_type'] === 'string') {
      const newType = newSettings['external_switch_type']
      this.log('newType ' + newType)

      let value = 0x00

      if (newType === 'push_button') {
        value = 0x00
      } else if (newType === 'normal_on_off') {
        value = 0x01
      } else if (newType === 'three_channels') {
        value = 0x02
      }

      this._basicCluster().writeAttributes({
        externalSwitchType: value,
      }).then(() => {
        this.log('write new type success')
      }).catch(this.error)
    }
  }

  _readExternalSwitchType () {

    this._basicCluster().readAttributes('externalSwitchType').then(value => {
      this.log(`read externalSwitchType`, value)

      const typeValue = value['externalSwitchType']
      let type = 'push_button'
      if (typeValue === 0) {
        type = 'push_button'
      } else if (typeValue === 1) {
        type = 'normal_on_off'
      } else if (typeValue === 2) {
        type = 'three_channels'
      }
      this.setSettings({
        'external_switch_type': type,
      }).catch(this.error)

    }).catch(this.error)
  }

  _basicCluster () {
    return this.zclNode.endpoints[1].clusters.basic
  }

}

module.exports = DimLight
