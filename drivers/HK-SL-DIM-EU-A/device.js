'use strict'

const SrZigbeeLight = require('../../lib/SrZigbeeLight')
const SrSceneCluster = require('../../lib/SrSceneCluster')

const { CLUSTER, Cluster } = require('zigbee-clusters')

Cluster.addCluster(SrSceneCluster)

class DimLight extends SrZigbeeLight {

  async levelStepRunListener (args, state) {

    const payload = {
      mode: args.mode,
      stepSize: Math.round(args.step_size * 0xFE),
      transitionTime: args.transition_time * 10,
    }
    this.log(`levelStepRunListener => `, payload)
    return this.levelControlCluster.stepWithOnOff(payload).then(() => {
      this.onLevelControlEnd().catch(this.error)
    }).catch(this.error)
  }

  async levelMoveRunListener (args, state) {

    const payload = {
      moveMode: args.move_mode,
      rate: Math.round(args.rate * 0xFE),
    }
    this.log(`levelMoveRunListener => `, payload)
    return this.levelControlCluster.moveWithOnOff(payload).catch(this.error)
  }

  async levelStopRunListener (args, state) {

    this.log(`levelStopRunListener => `)
    return this.levelControlCluster.stopWithOnOff().then(() => {
      this.onLevelControlEnd().catch(this.error)
    }).catch(this.error)
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
    ).catch(this.error)

    this.log('onLevelControlEnd', {
      currentLevel,
    })

    await this.setCapabilityValue('dim', currentLevel / 0xFE).catch(this.error)

    if (currentLevel === 0) {
      await this.setCapabilityValue('onoff', false).catch(this.error)
    } else if (this.getCapabilityValue('onoff') === false && currentLevel > 0) {
      await this.setCapabilityValue('onoff', true).catch(this.error)
    }
  }

  async storeSceneRunListener (args, state) {
    const payload = {
      groupId: args.group_id,
      sceneId: args.scene_id,
    }
    this.log('storeSceneRunListener => ', payload)
    return this.scenesCluster.srStoreScene(payload).catch(this.error)
  }

  async recallSceneRunListener (args, state) {
    const payload = {
      groupId: args.group_id,
      sceneId: args.scene_id,
    }
    this.log('recallSceneRunListener => ', payload)
    return this.scenesCluster.srRecallScene(payload).then(() => {
      this.onEndDeviceAnnounce().catch(this.error)
    }).catch(this.error)
  }

  get scenesCluster () {
    const scenesCluster = this.getClusterEndpoint(CLUSTER.SCENES)
    if (scenesCluster === null) throw new Error('missing_scenes_cluster')
    return this.zclNode.endpoints[scenesCluster].clusters.scenes
  }

}

module.exports = DimLight
