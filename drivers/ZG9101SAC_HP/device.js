'use strict'

const { ZigBeeLightDevice } = require('homey-zigbeedriver')
const SrSceneCluster = require('../../lib/SrSceneCluster')

const { CLUSTER, Cluster } = require('zigbee-clusters')

Cluster.addCluster(SrSceneCluster)

class DimLight extends ZigBeeLightDevice {

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

}

module.exports = DimLight