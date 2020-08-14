'use strict'

const { ColorControlCluster, ZCLDataTypes } = require('zigbee-clusters')

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

class SrColorControlCluster extends ColorControlCluster {

  // static get NAME() {
  //   return 'srColorControl';
  // }

  // ColorControlCluster commands:
  // [0, 3, 6, 7, 10]

  static get COMMANDS () {
    return {
      ...COMMANDS,
      moveHue: {
        id: 0x01,
        args: {
          moveMode: ZCLDataTypes.enum8({
            stop: 0x00,
            up: 0x01,
            reserved: 0x02,
            down: 0x03,
          }),
          rate: ZCLDataTypes.uint8,
        },
      },
      stepHue: {
        id: 0x02,
        args: {
          stepMode: ZCLDataTypes.enum8({
            reserved1: 0x00,
            up: 0x01,
            reserved2: 0x02,
            down: 0x03,
          }),
          stepSize: ZCLDataTypes.uint8,
          transitionTime: ZCLDataTypes.uint8,
        },
      },
      moveSaturation: {
        id: 0x04,
        args: {
          moveMode: ZCLDataTypes.enum8({
            stop: 0x00,
            up: 0x01,
            reserved: 0x02,
            down: 0x03,
          }),
          rate: ZCLDataTypes.uint8,
        },
      },
      stepSaturation: {
        id: 0x05,
        args: {
          stepMode: ZCLDataTypes.enum8({
            reserved1: 0x00,
            up: 0x01,
            reserved2: 0x02,
            down: 0x03,
          }),
          stepSize: ZCLDataTypes.uint8,
          transitionTime: ZCLDataTypes.uint8,
        },
      },
      moveColor: {
        id: 0x08,
        args: {
          rateX: ZCLDataTypes.int16,
          rateY: ZCLDataTypes.int16,
        },
      },
      stepColor: {
        id: 0x09,
        args: {
          stepX: ZCLDataTypes.int16,
          stepY: ZCLDataTypes.int16,
          transitionTime: ZCLDataTypes.uint16,
        },
      },
      stopMoveStep: {
        id: 0x47,
      },
      moveColorTemperature: {
        id: 0x4B,
        args: {
          moveMode: ZCLDataTypes.enum8({
            stop: 0x00,
            up: 0x01,
            reserved: 0x02,
            down: 0x03,
          }),
          rate: ZCLDataTypes.uint16,
          colorTemperatureMinimumMireds: ZCLDataTypes.uint16,
          colorTemperatureMaximumMireds: ZCLDataTypes.uint16,
        },
      },
      stepColorTemperature: {
        id: 0x4C,
        args: {
          stepMode: ZCLDataTypes.enum8({
            reserved1: 0x00,
            up: 0x01,
            reserved2: 0x02,
            down: 0x03,
          }),
          stepSize: ZCLDataTypes.uint16,
          transitionTime: ZCLDataTypes.uint16,
          colorTemperatureMinimumMireds: ZCLDataTypes.uint16,
          colorTemperatureMaximumMireds: ZCLDataTypes.uint16,
        },
      },
    }
  }

}

module.exports = SrColorControlCluster