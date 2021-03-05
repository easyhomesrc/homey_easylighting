'use strict'

const SrZigbeeLight = require('../../lib/SrZigbeeLight')
const SrColorControlCluster = require('../../lib/SrColorControlCluster')
const SrSceneCluster = require('../../lib/SrSceneCluster')

const { CLUSTER, Cluster } = require('zigbee-clusters')

Cluster.addCluster(SrColorControlCluster)
Cluster.addCluster(SrSceneCluster)

class ColorLight extends SrZigbeeLight {

  async moveHueRunListener (args, state) {
    const payload = {
      moveMode: args.move_mode,
      rate: Math.round(args.rate * 0xFE),
    }
    this.log('moveHueRunListener => ', payload)
    return this.colorControlCluster.moveHue(payload).then(() => {
      // If stop, update attributes
      if (args.move_mode === 0) {
        console.log('update attributes ===> ')
        this.onEndDeviceAnnounce()
      }
    }).catch(this.error)
  }

  async moveSaturationRunListener (args, state) {
    const payload = {
      moveMode: args.move_mode,
      rate: Math.round(args.rate * 0xFE),
    }
    this.log('moveSaturationRunListener => ', payload)
    return this.colorControlCluster.moveSaturation(payload).then(() => {
      // If stop, update attributes
      if (args.move_mode === 0) {
        console.log('update attributes ===> ')
        this.onEndDeviceAnnounce()
      }
    }).catch(this.error)
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

  async stepColorTemperatureRunListener (args, state) {
    const payload = {
      stepMode: args.step_mode,
      stepSize: Math.round(args.step_size * (450 - 155)),
      transitionTime: args.transition_time * 10,
      colorTemperatureMinimumMireds: 155,
      colorTemperatureMaximumMireds: 450,
    }
    this.log('stepColorTemperatureRunListener => ', payload)
    return this.colorControlCluster.stepColorTemperature(payload).then(() => {
      this.onEndDeviceAnnounce()
    })
  }

  async moveColorTemperatureRunListener (args, state) {
    const payload = {
      moveMode: args.move_mode,
      rate: Math.round(args.rate * (450 - 155)),
      colorTemperatureMinimumMireds: 155,
      colorTemperatureMaximumMireds: 450,
    }
    this.log('moveColorTemperatureRunListener => ', payload)
    return this.colorControlCluster.moveColorTemperature(payload)
  }

  async stopMoveStepRunListener (args, state) {
    this.log('stopMoveStepRunListener => ')
    return this.colorControlCluster.stopMoveStep().then(() => {
      this.onEndDeviceAnnounce()
    })
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

module.exports = ColorLight
