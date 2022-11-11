'use strict'

const { ZwaveLightDevice } = require('homey-zwavedriver')
const Utils = require('homey-zwavedriver/lib/util')

class DimLight extends ZwaveLightDevice {

  async onNodeInit ({ node }) {

    // this.enableDebug()
    // this.printNode()

    this.registerCapability('onoff', 'SWITCH_MULTILEVEL')
    this.registerCapability('dim', 'SWITCH_MULTILEVEL')

    this.registerReportListener('BASIC', 'BASIC_REPORT', report => {
      if (report && report.hasOwnProperty('Current Value')) {
        if (this.hasCapability('onoff')) this.setCapabilityValue('onoff',
          report['Current Value'] > 0)
        if (this.hasCapability('dim')) this.setCapabilityValue('dim',
          report['Current Value'] / 99)
      }
    })

    if (!this.hasCapability('light_hue')) {
      return
    }

    this.registerMultipleCapabilityListener(
      ['light_hue', 'light_saturation'],
      async (values, options) => {
        let hue;
        let saturation;

        if (typeof values.light_hue === 'number') {
          hue = values.light_hue;
        } else {
          hue = this.getCapabilityValue('light_hue');
        }
        if (typeof values.light_saturation === 'number') {
          saturation = values.light_saturation;
        } else {
          saturation = this.getCapabilityValue('light_saturation');
        }

        const value = 1; // brightness value is not determined in SWITCH_COLOR but with
        // SWITCH_MULTILEVEL, changing this throws the dim value vs real life brightness out of sync

        const rgb = Utils.convertHSVToRGB({ hue, saturation, value });

        this.debounceColorMode = setTimeout(() => {
          this.debounceColorMode = false;
        }, 200);

        let duration = 255;

        return this._sendColors({
          warm: 0,
          cold: 0,
          red: rgb.red,
          green: rgb.green,
          blue: rgb.blue,
          duration,
        });
      },
    );

    this.registerCapabilityListener('light_temperature', async (value, options) => {
      const warm = Math.floor(value * 255);
      const cold = Math.floor((1 - value) * 255);

      this.debounceColorMode = setTimeout(() => {
        this.debounceColorMode = false;
      }, 200);

      let duration = 255;

      return this._sendColors({
        warm,
        cold,
        red: 0,
        green: 0,
        blue: 0,
        duration,
      });
    });

    this.registerCapability('light_mode', 'SWITCH_COLOR', {
      set: 'SWITCH_COLOR_SET',
      setParser: (value, options) => {
        // set light_mode is always triggered with the set color/temperature flow cards, timeout
        // is needed because of homey's async nature surpassing the debounce
        setTimeout(async () => {
          if (this.debounceColorMode) {
            clearTimeout(this.debounceColorMode);
            this.debounceColorMode = false;
            this._setCapabilityValueSafe('light_mode', value);
            return;
          }

          if (value === 'color') {
            const hue = this.getCapabilityValue('light_hue') || 1;
            const saturation = this.getCapabilityValue('light_saturation') || 1;
            const _value = 1; // brightness value is not determined in SWITCH_COLOR but with
            // SWITCH_MULTILEVEL, changing this throws the dim value vs real life brightness out
            // of sync

            const rgb = Utils.convertHSVToRGB({ hue, saturation, _value });

            this._sendColors({
              warm: 0,
              cold: 0,
              red: rgb.red,
              green: rgb.green,
              blue: rgb.blue,
              duration: 255,
            }).catch(err => this.error('Error: could not send colors', err));
            return;
          }
          if (value === 'temperature') {
            const temperature = this.getCapabilityValue('light_temperature') || 1;
            const warm = temperature * 255;
            const cold = (1 - temperature) * 255;

            this._sendColors({
              warm,
              cold,
              red: 0,
              green: 0,
              blue: 0,
              duration: 255,
            }).catch(err => this.error('Error: could not send colors', err));
          }
        }, 50);
        return null;
      },
    });

    // Getting all color values during boot
    const commandClassColorSwitch = this.getCommandClass('SWITCH_COLOR');
    if (
      !(commandClassColorSwitch instanceof Error)
      && typeof commandClassColorSwitch.SWITCH_COLOR_GET === 'function'
    ) {
      // Timeout mandatory for stability, often fails getting 1 (or more) value without it
      setTimeout(() => {
        // Wait for all color values to arrive
        Promise.all([
          this._getColorValue(0),
          this._getColorValue(1),
          this._getColorValue(2),
          this._getColorValue(3),
          this._getColorValue(4),
        ]).then(result => {
          if (result[0] === 0 && result[1] === 0) {
            const hsv = Utils.convertRGBToHSV({
              red: result[2],
              green: result[3],
              blue: result[4],
            });

            this._setCapabilityValueSafe('light_mode', 'color');
            this._setCapabilityValueSafe('light_hue', hsv.hue);
            this._setCapabilityValueSafe('light_saturation', hsv.saturation);
          } else {
            const temperature = Math.round((result[0] / 255) * 100) / 100;
            this._setCapabilityValueSafe('light_mode', 'temperature');
            this._setCapabilityValueSafe('light_temperature', temperature);
          }
        }).catch(this.error);
      }, 500);
    }
  }

  async _getColorValue(colorComponentID) {
    const commandClassColorSwitch = this.getCommandClass('SWITCH_COLOR');
    if (
      !(commandClassColorSwitch instanceof Error)
      && typeof commandClassColorSwitch.SWITCH_COLOR_GET === 'function'
    ) {
      try {
        const result = await commandClassColorSwitch.SWITCH_COLOR_GET({
          'Color Component ID': colorComponentID,
        });
        return result && typeof result.Value === 'number' ? result.Value : 0;
      } catch (err) {
        this.error(err);
        return 0;
      }
    }
    return 0;
  }

  async _sendColors({
    warm, cold, red, green, blue, duration,
  }) {

    let setCommand = {
      Properties1: {
        'Color Component Count': 5,
      },
      vg1: [
        {
          'Color Component ID': 0,
          Value: Math.round(warm),
        },
        {
          'Color Component ID': 1,
          Value: Math.round(cold),
        },
        {
          'Color Component ID': 2,
          Value: Math.round(red),
        },
        {
          'Color Component ID': 3,
          Value: Math.round(green),
        },
        {
          'Color Component ID': 4,
          Value: Math.round(blue),
        },
      ],
    };

    setCommand = Buffer.from([
      setCommand.Properties1['Color Component Count'],
      0,
      setCommand.vg1[0].Value,
      1,
      setCommand.vg1[1].Value,
      2,
      setCommand.vg1[2].Value,
      3,
      setCommand.vg1[3].Value,
      4,
      setCommand.vg1[4].Value,
      setCommand.duration,
    ]);

    return this.node.CommandClass.COMMAND_CLASS_SWITCH_COLOR.SWITCH_COLOR_SET(setCommand);
  }

}

module.exports = DimLight
