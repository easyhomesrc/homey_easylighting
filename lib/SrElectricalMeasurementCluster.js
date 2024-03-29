'use strict'

/**
 * Reference from https://github.com/athombv/com.ikea.tradfri.git
 */

const { ElectricalMeasurementCluster, ZCLDataTypes } = require('zigbee-clusters')

const ATTRIBUTES = {
  measurementType: { id: 0, type: ZCLDataTypes.map32('activeMeasurementAC', 'reactiveMeasurementAC', 'apparentMeasurementAC', 'phaseAMeasurement', 'phaseBMeasurement', 'phaseCMeasurement', 'dcMeasurement', 'harmonicsMeasurement', 'powerQualityMeasurement') },
  acFrequency: { id: 768, type: ZCLDataTypes.uint16 },
  measuredPhase1stHarmonicCurrent: { id: 781, type: ZCLDataTypes.int16 },
  acFrequencyMultiplier: { id: 1024, type: ZCLDataTypes.uint16 },
  acFrequencyDivisor: { id: 1025, type: ZCLDataTypes.uint16 },
  phaseHarmonicCurrentMultiplier: { id: 1029, type: ZCLDataTypes.int8 },
  rmsVoltage: { id: 1285, type: ZCLDataTypes.uint16 },
  rmsCurrent: { id: 1288, type: ZCLDataTypes.uint16 },
  activePower: { id: 1291, type: ZCLDataTypes.int16 },
  reactivePower: { id: 1294, type: ZCLDataTypes.int16 },
  acVoltageMultiplier: { id: 1536, type: ZCLDataTypes.uint16 },
  acVoltageDivisor: { id: 1537, type: ZCLDataTypes.uint16 },
  acCurrentMultiplier: { id: 1538, type: ZCLDataTypes.uint16 },
  acCurrentDivisor: { id: 1539, type: ZCLDataTypes.uint16 },
  acPowerMultiplier: { id: 1540, type: ZCLDataTypes.uint16 },
  acPowerDivisor: { id: 1541, type: ZCLDataTypes.uint16 },
  acAlarmsMask: { id: 2048, type: ZCLDataTypes.map16('voltageOverload', 'currentOverload', 'activePowerOverload', 'reactivePowerOverload', 'averageRMSOverVoltage', 'averageRMSUnderVoltage', 'rmsExtremeOverVoltage', 'rmsExtremeUnderVoltage', 'rmsVoltageSag', 'rmsVoltageSwell') },
  acVoltageOverload: { id: 2049, type: ZCLDataTypes.uint16 },
  acCurrentOverload: { id: 2050, type: ZCLDataTypes.uint16 },
  acActivePowerOverload: { id: 2051, type: ZCLDataTypes.uint16 },
};

class SrElectricalMeasurementCluster extends ElectricalMeasurementCluster {

  static get ATTRIBUTES () {
    return {
      ...ATTRIBUTES,
      totalActivePower: { id: 0x0304, type: ZCLDataTypes.int32 }
    }
  }

}

module.exports = SrElectricalMeasurementCluster
