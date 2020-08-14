'use strict'

const Homey = require('homey')

class SrZigBeeDriver extends Homey.Driver {

  getDeviceTriggerCard(flowId) {
    const card = this.homey.flow.getDeviceTriggerCard(flowId)
    if (card) {
      return card
    }
    throw Error(`No ${flowId} device trigger card found`)
  }

  getActionCard(flowId) {
    const card = this.homey.flow.getActionCard(flowId)
    if (card) return card
    throw Error(`No ${flowId} action card found`)
  }

}

module.exports = SrZigBeeDriver