'use strict'

const { ZwaveDevice } = require('homey-zwavedriver')

const CapabilityToThermostatSetpointType = {
  'manual_mode': 'Heating 1',
  'auto_mode': 'Energy Save Heating',
  'dry_mode': 'Dry Air',
  'off_mode': 'Heating 1',
  'away_mode': 'Away Heating',
}

const CapabilityToThermostatMode = {
  'manual_mode': 'Heat',
  'auto_mode': 'Energy Save Heat',
  'dry_mode': 'Dry Air',
  'off_mode': 'Off',
  'away_mode': 'AWAY',
}

const ThermostatModeToCapability = {
  'Heat': 'manual_mode',
  'Energy Save Heat': 'auto_mode',
  'Dry Air': 'dry_mode',
  'Off': 'off_mode',
  'AWAY': 'away_mode',
}

class MyThermostat extends ZwaveDevice {

  async onNodeInit ({ node }) {

    // this.enableDebug()
    // this.printNode()

    this.registerCapability('measure_power', 'METER')
    this.registerCapability('meter_power', 'METER')

    this.registerCapability('target_temperature', 'THERMOSTAT_SETPOINT')
    this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL',
      { multiChannelNodeId: 1 })

    this.registerThermostatModeCapability()
    this.registerTemperatureControlReferenceSelectionCapability()

    this.registerTemperatureSensorCapability('my_ZV9092A_home_sensor', 1)
    this.registerTemperatureSensorCapability('my_ZV9092A_floor_sensor', 2)
  }

  registerThermostatModeCapability () {

    this.registerCapability('my_ZV9092A_thermostat_mode', 'THERMOSTAT_MODE', {
      get: 'THERMOSTAT_MODE_GET',
      getOpts: {
        getOnStart: true,
      },
      set: 'THERMOSTAT_MODE_SET',
      setParser: (value) => {

        this.log('THERMOSTAT_MODE_SET ', value)
        if (!CapabilityToThermostatMode.hasOwnProperty(value)) {
          return null
        }
        const mode = CapabilityToThermostatMode[value]
        if (typeof mode !== 'string') {
          return null
        }

        if (CapabilityToThermostatSetpointType.hasOwnProperty(value)) {

          this.thermostatSetpointType = CapabilityToThermostatSetpointType[value]

          clearTimeout(this.refreshTargetTemperatureTimeout)
          this.refreshTargetTemperatureTimeout = this.homey.setTimeout(() => {

            this.log('Refresh Capability Value')
            this.refreshCapabilityValue('target_temperature',
              'THERMOSTAT_SETPOINT')
          }, 1000)
        }

        return {
          'Level': {
            'No of Manufacturer Data fields': 0,
            'Mode': mode,
          },
          'Manufacturer Data': Buffer.from([]),
        }
      },
      report: 'THERMOSTAT_MODE_REPORT',
      reportParser: report => {

        this.log('CONFIGURATION_REPORT ', report)

        if (report
          && report.hasOwnProperty('Level')
          && report['Level'].hasOwnProperty('Mode')) {

          const mode = report['Level']['Mode']
          if (typeof mode === 'string' &&
            ThermostatModeToCapability.hasOwnProperty(mode)) {

            const capabilityMode = ThermostatModeToCapability[mode]
            this.log('Capability Mode ', capabilityMode)

            if (CapabilityToThermostatSetpointType.hasOwnProperty(
              capabilityMode)) {

              this.thermostatSetpointType = CapabilityToThermostatSetpointType[capabilityMode]

              clearTimeout(this.refreshTargetTemperatureTimeout)
              this.refreshTargetTemperatureTimeout = this.homey.setTimeout(() => {

                this.log('Refresh Capability Value')
                this.refreshCapabilityValue('target_temperature',
                  'THERMOSTAT_SETPOINT')
              }, 1000)
            }

            return capabilityMode
          }
        }

        return null
      },
    })
  }

  registerTemperatureControlReferenceSelectionCapability () {

    this.registerCapability('my_ZV9092A_temperature_control_reference',
      'CONFIGURATION', {
        get: 'CONFIGURATION_GET',
        getOpts: {
          getOnStart: true,
        },
        getParser: (value) => {

          this.log('CONFIGURATION_GET ', value)

          return {
            'Parameter Number': 10,
          }
        },
        set: 'CONFIGURATION_SET',
        setParser: (value) => {

          this.log('CONFIGURATION_SET ', value)

          let selection = 1

          if (value === 'room_sensor') {

            selection = 1

          } else if (value === 'floor_sensor') {

            selection = 2

          } else if (value === 'room_floor_sensor') {

            selection = 3
          }

          return {
            'Parameter Number': 10,
            'Level': {
              'Size': 1,
              'Default': false,
            },
            'Configuration Value': Buffer.from([selection]),
          }

        },
        report: 'CONFIGURATION_REPORT',
        reportParser: (value) => {

          this.log('CONFIGURATION_REPORT ', value)

          if (value
            && value.hasOwnProperty('Parameter Number')
            && value['Parameter Number'] === 10
            && value.hasOwnProperty('Configuration Value')) {

            const configurationValue = value['Configuration Value']
            if (typeof configurationValue === 'object' &&
              Buffer.isBuffer(configurationValue)) {

              const currentValue = configurationValue[0]
              this.log('configurationValue ', currentValue)

              if (currentValue === 1) {

                // this.setCapabilityValue('my_ZV9092A_temperature_control_reference', 'room_sensor').then()

                return 'room_sensor'

              } else if (currentValue === 2) {

                // this.setCapabilityValue('my_ZV9092A_temperature_control_reference', 'floor_sensor').then()

                return 'floor_sensor'

              } else if (currentValue === 3) {

                // this.setCapabilityValue('my_ZV9092A_temperature_control_reference', 'room_floor_sensor').then()

                return 'room_floor_sensor'
              }
            }
          }
        },
      })
  }

  registerTemperatureSensorCapability (capabilityId, nodeId) {

    // my_ZV9092A_floor_sensor
    this.registerCapability(capabilityId, 'SENSOR_MULTILEVEL',
      {
        multiChannelNodeId: nodeId,
        get: 'SENSOR_MULTILEVEL_GET',
        getOpts: {
          getOnOnline: true,
          getOnStart: true,
        },
        getParser: () => ({
          'Sensor Type': 'Temperature (version 1)',
          Properties1: {
            Scale: 0,
          },
        }),
        report: 'SENSOR_MULTILEVEL_REPORT',
        reportParser: report => {
          if (
            report
            && report.hasOwnProperty('Sensor Type')
            && report['Sensor Type'] === 'Temperature (version 1)'
            && report.hasOwnProperty('Sensor Value (Parsed)')
            && report.hasOwnProperty('Level')
            && report.Level.hasOwnProperty('Scale')
          ) {
            // Some devices send this when no temperature sensor is connected
            if (report['Sensor Value (Parsed)'] === -999.9) return null
            if (report.Level.Scale ===
              0) return report['Sensor Value (Parsed)']
            if (report.Level.Scale ===
              1) return (report['Sensor Value (Parsed)'] - 32) / 1.8
          }
          return null
        },
      })
  }

}

module.exports = MyThermostat
