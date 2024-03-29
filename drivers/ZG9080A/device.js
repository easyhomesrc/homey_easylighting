'use strict'

const { ZigBeeDevice } = require('homey-zigbeedriver')
const { CLUSTER, Cluster } = require('zigbee-clusters')
const { mapValueRange } = require('homey-zigbeedriver/lib/util')

const Homey = require('homey');

const stateCommands = {
  up: {
    command: 'upOpen',
  },
  idle: {
    command: 'stop',
  },
  down: {
    'command': 'downClose',
  },
}

const UP_OPEN = 'upOpen'
const DOWN_CLOSE = 'downClose'
const REPORT_DEBOUNCER = 5000

class ZigBeeCurtain extends ZigBeeDevice {

  async onNodeInit ({ zclNode, node }) {

    let isLift = true

    this.registerCapability('onoff', CLUSTER.WINDOW_COVERING, {
      set: 'goToLiftPercentage',
      setParser: async value => {

        if (this._reportPercentageDebounce) {
          this._reportPercentageDebounce.refresh()
        } else {
          this._reportPercentageDebounce = this.homey.setTimeout(() => {
            this._reportDebounceEnabled = false
            this._reportPercentageDebounce = null
          }, REPORT_DEBOUNCER)
        }

        this._reportDebounceEnabled = true
        return {
          percentageLiftValue: (value === false ? 0 : 100)
        }
      },
      endpoint: 1
    })

    if (this.hasCapability('windowcoverings_state')) {
      this.registerCapability('windowcoverings_state',
        CLUSTER.WINDOW_COVERING, {
          set: value => stateCommands[value].command,
          setParser: () => {},
          endpoint: 1,
        })
    }

    if (this.hasCapability('windowcoverings_set')) {
      this.registerCapability('windowcoverings_set', CLUSTER.WINDOW_COVERING,
        {
          getOpts: {
            getOnStart: true,
            getOnOnline: true,
            pollInterval: 60 * 60 * 1000
          },
          get: 'currentPositionLiftPercentage',
          set: 'goToLiftPercentage',
          async setParser (value) {
            // Refresh timer or set new timer to prevent reports from updating the dim slider directly
            // when set command from Homey
            if (this._reportPercentageDebounce) {
              this._reportPercentageDebounce.refresh()
            } else {
              this._reportPercentageDebounce = this.homey.setTimeout(() => {
                this._reportDebounceEnabled = false
                this._reportPercentageDebounce = null
              }, REPORT_DEBOUNCER)
            }

            // Used to check if reports are generated based on set command from Homey
            this._reportDebounceEnabled = true

            if (isLift) {
              this.setCapabilityValue('onoff', value !== 0)
            }

            const mappedValue = mapValueRange(0, 1, 0, 100, value)
            const gotToLiftPercentageCommand = {
              // Round, otherwise might not be accepted by device
              percentageLiftValue: Math.round(mappedValue),
            }
            this.debug(
              `set → \`windowcoverings_set\`: ${value} → setParser → goToLiftPercentage`,
              gotToLiftPercentageCommand)
            // Send goToLiftPercentage command
            return gotToLiftPercentageCommand
          },
          report: 'currentPositionLiftPercentage',
          reportParser (value) {
            // Validate input
            if (value < 0 || value > 100) return null

            if (isLift) {
              this.setCapabilityValue('onoff', value !== 0)
            }

            // Parse input value
            const parsedValue = mapValueRange(0, 100, 0, 1, value)

            // Refresh timer if needed
            if (this._reportPercentageDebounce) {
              this._reportPercentageDebounce.refresh()
            }

            // If reports are not generated by set command from Homey update directly
            if (!this._reportDebounceEnabled) return parsedValue

            return null
          },
          endpoint: 1
        })
    }

    if (this.hasCapability('windowcoverings_tilt_set')) {
      this.registerCapability('windowcoverings_tilt_set', CLUSTER.WINDOW_COVERING, {
        getOpts: {
          getOnStart: true,
          getOnOnline: true,
          pollInterval: 60 * 60 * 1000
        },
        get: 'currentPositionTiltPercentage',
        set: 'goToTiltPercentage',
        setParser(value) {

          if (isLift === false) {
            this.setCapabilityValue('onoff', value !== 0)
          }

          return {
            percentageTiltValue: value * 100,
          };
        },
        report: 'currentPositionTiltPercentage',
        reportParser(value) {

          if (isLift === false) {
            this.setCapabilityValue('onoff', value !== 0)
          }

          return value / 100;
        },
        endpoint: 1
      })
    }

  }

}

module.exports = ZigBeeCurtain
