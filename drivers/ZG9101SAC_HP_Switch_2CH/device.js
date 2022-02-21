'use strict'

const { ZigBeeDevice } = require('homey-zigbeedriver')
const { CLUSTER } = require('zigbee-clusters')

class MyLight extends ZigBeeDevice {

  onNodeInit ({ zclNode, node }) {
    super.onNodeInit({ zclNode, node })

    // OnOff

    this.registerCapabilityListener('onoff', async isOn => {

      if (isOn === true) {

        await this._onOffCluster(1).setOn()
        await this._onOffCluster(2).setOn()

      } else {

        await this._onOffCluster(1).setOff()
        await this._onOffCluster(2).setOff()
      }
    })

    this._onOffCluster(1).on('attr.onOff', async isOn => {

      this.log(`1 attr.onOff`, isOn)

      await this.setCapabilityValue('light_channel_one_onoff', isOn)

      if (isOn) {
        await this.setCapabilityValue('onoff', true)
      } else {
        const isChannel2On = await this._onOffCluster(2).readAttributes('onOff')
        if (isChannel2On !== true) {
          await this.setCapabilityValue('onoff', false)
        }
      }
    })

    this._onOffCluster(2).on('attr.onOff', async isOn => {

      this.log(`2 attr.onOff`, isOn)

      await this.setCapabilityValue('light_channel_two_onoff', isOn)

      if (isOn) {
        await this.setCapabilityValue('onoff', true)
      } else {
        const isChannel1On = await this._onOffCluster(1).readAttributes('onOff')
        if (isChannel1On !== true) {
          await this.setCapabilityValue('onoff', false)
        }
      }
    })

    // Channels

    this.registerCapabilityListener('light_channel_one_onoff', async isOn => {

      if (isOn) {
        this._onOffCluster(1).setOn()
      } else {
        this._onOffCluster(1).setOff()
      }
    })

    this.registerCapabilityListener('light_channel_two_onoff', async isOn => {

      if (isOn) {
        this._onOffCluster(2).setOn()
      } else {
        this._onOffCluster(2).setOff()
      }
    })

    // Electrical Measurement

    this._measurementCluster(1).on('attr.activePower', async value => {

      this.log(`1 attr.activePower`, value)
      await this.setCapabilityValue('measure_power', value * 0.1)
    })

    // Metering
    this._registerMetering().catch(this.error)
  }

  async _registerMetering () {

    const { multiplier, divisor } = await this._meteringCluster(1).
      readAttributes('multiplier', 'divisor').catch(this.error)

    let meterFactory = 1 / 3600000
    if (multiplier > 0 && divisor > 0) {
      meterFactory = multiplier / divisor
    }

    this.log(`multiplier divisor`, multiplier, divisor, meterFactory)

    this._meteringCluster(1).
      on('attr.currentSummationDelivered', async value => {

        this.log(`1 attr.currentSummationDelivered`, value)
        await this.setCapabilityValue('meter_power', value * meterFactory)
      })

    // Read all attributes after got the meter factory.
    await this._readInitAttributeValues(meterFactory)
  }

  async _readInitAttributeValues (meterFactory) {

    // OnOff
    const isChannel1On  = await this._onOffCluster(1).readAttributes('onOff')
    const isChannel2On = await this._onOffCluster(2).readAttributes('onOff')
    const isOn = isChannel1On.onOff === true || isChannel2On.onOff === true
    this.log(`Init isChannel1On isChannel2On isOn`, isChannel1On, isChannel2On, isOn)

    await this.setCapabilityValue('light_channel_one_onoff', isChannel1On.onOff)
    await this.setCapabilityValue('light_channel_two_onoff', isChannel2On.onOff)
    await this.setCapabilityValue('onoff', isOn)

    // Measurement
    const { activePower } = await this._measurementCluster(1).
      readAttributes('activePower')
    const measurePower = activePower * 0.1
    this.log(`Init activePower`, measurePower)
    await this.setCapabilityValue('measure_power', measurePower)

    // Metering
    const { currentSummationDelivered } = await this._meteringCluster(1).
      readAttributes('currentSummationDelivered')
    const meterPower = currentSummationDelivered * meterFactory
    this.log(`Init metering`, meterPower)
    await this.setCapabilityValue('meter_power', meterPower)
  }

  _onOffCluster (endpoint) {
    return this.zclNode.endpoints[endpoint].clusters.onOff
  }

  _measurementCluster (endpoint) {
    return this.zclNode.endpoints[endpoint].clusters.electricalMeasurement
  }

  _meteringCluster (endpoint) {
    return this.zclNode.endpoints[endpoint].clusters.metering
  }

}

module.exports = MyLight
