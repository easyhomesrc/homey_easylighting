'use strict'

const { BoundCluster } = require('zigbee-clusters')

class ColorControlBoundCluster extends BoundCluster {

  constructor ({
    onMoveToHue,
    onMoveToSaturation,
    onMoveToHueAndSaturation,
    onMoveToColor,
    onMoveToColorTemperature,
    onMoveHue,
    onStepHue,
    onMoveSaturation,
    onStepSaturation,
    onMoveColor,
    onStepColor,
    onStopMoveStep,
    onMoveColorTemperature,
    onStepColorTemperature,
    endpoint,
  }) {
    super()
    // From ColorControlCluster
    this._onMoveToHue = onMoveToHue
    this._onMoveToSaturation = onMoveToSaturation
    this._onMoveToHueAndSaturation = onMoveToHueAndSaturation
    this._onMoveToColor = onMoveToColor
    this._onMoveToColorTemperature = onMoveToColorTemperature

    // From SrColorControlCluster
    this._onMoveHue = onMoveHue
    this._onStepHue = onStepHue
    this._onMoveSaturation = onMoveSaturation
    this._onStepSaturation = onStepSaturation
    this._onMoveColor = onMoveColor
    this._onStepColor = onStepColor
    this._onStopMoveStep = onStopMoveStep
    this._onMoveColorTemperature = onMoveColorTemperature
    this._onStepColorTemperature = onStepColorTemperature

    this._endpint = endpoint
  }

  moveToHue (payload) {
    if (typeof this._onMoveToHue === 'function') {
      this._onMoveToHue(payload, this._endpint)
    }
  }

  moveToSaturation (payload) {
    if (typeof this._onMoveToSaturation === 'function') {
      this._onMoveToSaturation(payload, this._endpint)
    }
  }

  moveToHueAndSaturation (payload) {
    if (typeof this._onMoveToHueAndSaturation === 'function') {
      this._onMoveToHueAndSaturation(payload, this._endpint)
    }
  }

  moveToColor (payload) {
    if (typeof this._onMoveToColor === 'function') {
      this._onMoveToColor(payload, this._endpint)
    }
  }

  moveToColorTemperature (payload) {
    if (typeof this._onMoveToColorTemperature === 'function') {
      this._onMoveToColorTemperature(payload, this._endpint)
    }
  }

  moveHue (payload) {
    if (typeof this._onMoveHue === 'function') {
      this._onMoveHue(payload, this._endpint)
    }
  }

  stepHue (payload) {
    if (typeof this._onStepHue === 'function') {
      this._onStepHue(payload, this._endpint)
    }
  }

  moveSaturation (payload) {
    if (typeof this._onMoveSaturation === 'function') {
      this._onMoveSaturation(payload, this._endpint)
    }
  }

  stepSaturation (payload) {
    if (typeof this._onStepSaturation === 'function') {
      this._onStepSaturation(payload, this._endpint)
    }
  }

  moveColor (payload) {
    if (typeof this._onMoveColor === 'function') {
      this._onMoveColor(payload, this._endpint)
    }
  }

  stepColor (payload) {
    if (typeof this._onStepColor === 'function') {
      this._onStepColor(payload, this._endpint)
    }
  }

  stopMoveStep () {
    if (typeof this._onStopMoveStep === 'function') {
      this._onStopMoveStep(this._endpint)
    }
  }

  moveColorTemperature (payload) {
    if (typeof this._onMoveColorTemperature === 'function') {
      this._onMoveColorTemperature(payload, this._endpint)
    }
  }

  stepColorTemperature (payload) {
    if (typeof this._onStepColorTemperature === 'function') {
      this._onStepColorTemperature(payload, this._endpint)
    }
  }

}

module.exports = ColorControlBoundCluster

/**
 * From zigbee-clusters.CLUSTER.COLOR_CONTROL
 *
 const COMMANDS = {
  moveToHue: {
    id: 0,
    args: {
      hue: ZCLDataTypes.uint8,
      direction: ZCLDataTypes.enum8({ // TODO: ?
        shortestDistance: 0,
        longestDistance: 1,
        up: 2,
        down: 3,
      }),
      transitionTime: ZCLDataTypes.uint16,
    },
  },
  moveToSaturation: {
    id: 3,
    args: { // TODO
      saturation: ZCLDataTypes.uint8,
      transitionTime: ZCLDataTypes.uint16,
    },
  },
  moveToHueAndSaturation: {
    id: 6,
    args: {
      hue: ZCLDataTypes.uint8,
      saturation: ZCLDataTypes.uint8,
      transitionTime: ZCLDataTypes.uint16,
    },
  },
  moveToColor: {
    id: 7,
    args: {
      colorX: ZCLDataTypes.uint16,
      colorY: ZCLDataTypes.uint16,
      transitionTime: ZCLDataTypes.uint16,
    },
  },
  moveToColorTemperature: {
    id: 10,
    args: {
      colorTemperature: ZCLDataTypes.uint16,
      transitionTime: ZCLDataTypes.uint16,
    },
  },
}
 */