'use strict'

const { ZigBeeDevice } = require('homey-zigbeedriver')
const { CLUSTER, Cluster } = require('zigbee-clusters')
const SrElectricalMeasurementCluster = require(
  '../../lib/SrElectricalMeasurementCluster')

Cluster.addCluster(SrElectricalMeasurementCluster)

class MyDevice extends ZigBeeDevice {

  async onNodeInit ({ zclNode, node }) {

    this.registerCapability('onoff', CLUSTER.ON_OFF,{
      get: 'onOff',
      getOpts: {
        getOnStart: true,
      },
      set: value => (value ? 'setOn' : 'setOff'),
      setParser: () => ({}),
      report: 'onOff',
      reportParser (value) {
        return value
      },
      endpoint: 1,
    })

    this._registerMeterPowerMeasurePower(zclNode).catch(this.error)
  }

  async _registerMeterPowerMeasurePower (zclNode) {

    // 自定义能源更新的`pollInterval`轮询间隔和所报告的数值
    if (this.hasCapability('meter_power')) {

      let meterFactory = 1.0 / 3600000.0

      this.registerCapability('meter_power', CLUSTER.METERING, {
        get: 'currentSummationDelivered',
        report: 'currentSummationDelivered',
        reportParser: value => {
          return value * meterFactory
        },
        getParser: value => value * meterFactory,
        endpoint: 1
      })
    }

    // 自定义能源更新的`pollInterval`轮询间隔和所报告的数值
    if (this.hasCapability('measure_power')) {

      await this.configureAttributeReporting([
        {
          endpointId: 1,
          cluster: CLUSTER.ELECTRICAL_MEASUREMENT,
          attributeName: 'totalActivePower',
          minInterval: 0,
          maxInterval: 3600,
          minChange: 10,
        },
      ])

      zclNode.endpoints[1].clusters.electricalMeasurement.on(
        'attr.totalActivePower',
        async (value) => {
          if (typeof value === 'number') {
            this.log('total value measure ', value)
            const power = value * 0.1
            await this.setCapabilityValue('measure_power', power).catch(this.error)
          }
        },
      )

      const currentValue = await zclNode.endpoints[1].clusters.electricalMeasurement.readAttributes(
        ['totalActivePower'])
      const currentPower = currentValue.totalActivePower
      if (typeof currentPower === 'number') {
        const power = currentPower * 0.1
        await this.setCapabilityValue('measure_power', power).catch(this.error)
        this.log('current power ', power)
      }
    }
  }
}

module.exports = MyDevice
