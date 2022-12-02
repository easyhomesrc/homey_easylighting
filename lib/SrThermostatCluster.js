'use strict'

const { Cluster, ThermostatCluster, ZCLDataTypes, zclTypes } = require(
  'zigbee-clusters')

const ATTRIBUTES = {
  ...ThermostatCluster.ATTRIBUTES,
  startOfWeek: {
    id: 0x20,
    type: ZCLDataTypes.enum8({
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    }),
  },
  // Private attributes
  controlType: {
    id: 0x1003,
    type: ZCLDataTypes.enum8({
      room: 0,
      floor: 1,
      roomFloor: 2,
      other: 3,
    }),
    manufacturerId: 0x1224,
  },
  displayTemperature: {
    id: 0x1008,
    type: ZCLDataTypes.enum8({
      room: 0,
      floor: 1,
    }),
    manufacturerId: 0x1224,
  },
  operateDisplayBrightness: {
    id: 0x1000,
    type: ZCLDataTypes.enum8({
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
    }),
    manufacturerId: 0x1224,
  },
  displayAutoOffActivation: {
    id: 0x1001,
    type: ZCLDataTypes.enum8({
      disabled: 0,
      enabled: 1,
    }),
    manufacturerId: 0x1224,
  },
  powerUpStatus: {
    id: 0x1004,
    type: ZCLDataTypes.enum8({
      latestMode: 1,
      manualMode: 0,
    }),
    manufacturerId: 0x1224,
  },
  windowOpenCheck: {
    id: 0x1009,
    type: ZCLDataTypes.enum8({
      disabled: 0,
      enabled: 1,
    }),
    manufacturerId: 0x1224,
  },
  hysteresis: {
    id: 0x100A,
    type: ZCLDataTypes.uint8,
    manufacturerId: 0x1224,
  },
  windowOpenFlag: {
    id: 0x100B,
    type: ZCLDataTypes.enum8({
      closed: 0,
      opened: 1,
    }),
    manufacturerId: 0x1224,
  },
  internalOverHeat: {
    id: 0x2002,
    type: ZCLDataTypes.enum8({
      none: 0,
      level1: 1,
      level2: 2,
    }),
    manufacturerId: 0x1224,
  },
}

const COMMANDS = {
  ...ThermostatCluster.COMMANDS,
  setWeeklySchedule: {
    id: 1,
    args: {
      numberOfTransition: ZCLDataTypes.enum8({
        'zero': 0,
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
      }),
      dayOfWeek: ZCLDataTypes.map8('sun', 'mon', 'tue', 'wed', 'thu', 'fri',
        'sat', 'awayOrVacation'),
      mode: ZCLDataTypes.map8('heat', 'cool'),
      transitionTime1: ZCLDataTypes.uint16,
      heatSet1: ZCLDataTypes.int16,
      transitionTime2: ZCLDataTypes.uint16,
      heatSet2: ZCLDataTypes.int16,
      transitionTime3: ZCLDataTypes.uint16,
      heatSet3: ZCLDataTypes.int16,
      transitionTime4: ZCLDataTypes.uint16,
      heatSet4: ZCLDataTypes.int16,
    },
  },
  getWeeklySchedule: {
    id: 2,
    args: {
      daysToReturn: ZCLDataTypes.map8('sun', 'mon', 'tue', 'wed', 'thu', 'fri',
        'sat', 'awayOrVacation'),
      modeToReturn: ZCLDataTypes.map8('heat', 'cool'),
    },
  },
  getWeeklyScheduleResponse: {
    id: 0,
    args: {
      numberOfTransition: ZCLDataTypes.enum8({
        'zero': 0,
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
      }),
      dayOfWeek: ZCLDataTypes.map8('sun', 'mon', 'tue', 'wed', 'thu', 'fri',
        'sat', 'awayOrVacation'),
      /* dayOfWeek: ZCLDataTypes.uint8, */
      mode: ZCLDataTypes.map8('heat', 'cool'),
      transitionTime1: ZCLDataTypes.uint16,
      heatSet1: ZCLDataTypes.int16,
      transitionTime2: ZCLDataTypes.uint16,
      heatSet2: ZCLDataTypes.int16,
      transitionTime3: ZCLDataTypes.uint16,
      heatSet3: ZCLDataTypes.int16,
      transitionTime4: ZCLDataTypes.uint16,
      heatSet4: ZCLDataTypes.int16,
    },
  },
}

class SrThermostatCluster extends ThermostatCluster {

  static get ATTRIBUTES () {
    return ATTRIBUTES
  }

  static get COMMANDS () {
    return COMMANDS
  }

}

module.exports = SrThermostatCluster
