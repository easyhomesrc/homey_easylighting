'use strict'

/**
 * Reference from https://github.com/athombv/com.ikea.tradfri.git
 *
 * Add a parameter `_endpoint` for this Object.
 *
 */

const { BoundCluster } = require('zigbee-clusters')

class LevelControlBoundCluster extends BoundCluster {

  constructor ({
    onMoveToLevel,
    onStep,
    onStepWithOnOff,
    onMove,
    onStopWithOnOff,
    onStop,
    onMoveToLevelWithOnOff,
    onMoveWithOnOff,
    endpoint,
  }) {
    super()
    this._onMoveToLevel = onMoveToLevel
    this._onStep = onStep
    this._onStepWithOnOff = onStepWithOnOff
    this._onMove = onMove
    this._onStopWithOnOff = onStopWithOnOff
    this._onStop = onStop
    this._onMoveToLevelWithOnOff = onMoveToLevelWithOnOff
    this._onMoveWithOnOff = onMoveWithOnOff
    this._endpoint = endpoint
  }

  moveToLevel (payload) {
    if (typeof this._onMoveToLevel === 'function') {
      this._onMoveToLevel(payload, this._endpoint)
    }
  }

  step (payload) {
    if (typeof this._onStep === 'function') {
      this._onStep(payload, this._endpoint)
    }
  }

  stepWithOnOff (payload) {
    if (typeof this._onStepWithOnOff === 'function') {
      this._onStepWithOnOff(payload, this._endpoint)
    }
  }

  move (payload) {
    if (typeof this._onMove === 'function') {
      this._onMove(payload, this._endpoint)
    }
  }

  moveToLevelWithOnOff (payload) {
    if (typeof this._onMoveToLevelWithOnOff === 'function') {
      this._onMoveToLevelWithOnOff(payload, this._endpoint)
    }
  }

  moveWithOnOff (payload) {
    if (typeof this._onMoveWithOnOff === 'function') {
      this._onMoveWithOnOff(payload, this._endpoint)
    }
  }

  stop () {
    if (typeof this._onStop === 'function') {
      this._onStop(this._endpoint)
    }
  }

  stopWithOnOff () {
    if (typeof this._onStopWithOnOff === 'function') {
      this._onStopWithOnOff(this._endpoint)
    }
  }

}

module.exports = LevelControlBoundCluster
