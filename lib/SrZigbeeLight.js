'use strict'

const { ZigBeeLightDevice } = require('homey-zigbeedriver')
const { CLUSTER } = require('zigbee-clusters')
const { callFormatter } = require('../lib/SrUtils')

class SrZigbeeLight extends ZigBeeLightDevice {

  async onNodeInit ({
    zclNode,
    supportsHueAndSaturation,
    supportsColorTemperature,
  }) {
    super.onNodeInit(
      { zclNode, supportsHueAndSaturation, supportsColorTemperature })

    /* 
      为避免延迟上报导致更新UI时滑块反复跳动，在进行changeDimLevel操作时，将此项设为true。
      如果 isChangingDim 为 true，则在进行 parseAttributeReport 上报时，直接返回null，
      以避免上报延时导致顺序错乱。
     */
    this.isChangingDim = false
    this.changeDimTimeout = null

    this._registerMeterPowerMeasurePower().then(this.log).catch(this.error)

    // 当使用开关按钮开关灯时，如果与上次操作状态一致，则Homey 页面的开关状态会保持不变。
    if (this.hasCapability('onoff')) {
      this.zclNode.endpoints[1].clusters.onOff.on('attr.onOff', async value => {
        const oldValue = await this.getCapabilityValue('onoff')
        if (value === oldValue) {
          console.log(`attr.onOff old value, ignore`, value)
        } else {
          console.log(`attr.onOff new value`, value)
          await this.setCapabilityValue('onoff', value).catch(this.error)
        }
      })
    }

    // 调光变化太小时不更新
    if (this.hasCapability('dim')) {
      this.zclNode.endpoints[1].clusters.levelControl.on('attr.currentLevel', async value => {
        const oldValue = await this.getCapabilityValue('dim')
        // dim能力的范围是0-1，currentLevel的范围是[0x00, 0xFE]即[0, 254]。因此dim换算成currentLevel应该乘以0XFE
        // currentLevel范围查看（3.10.2.3章节）：https://etc.athom.com/zigbee_cluster_specification.pdf
        // dim范围查看：https://apps-sdk-v3.developer.homey.app/tutorial-device-capabilities.html
        const diff = Math.abs(oldValue * 254 - value)
        console.log(`attr.currentLevel oldValue newValue diff`, oldValue, value, diff)
        if (diff >= 5) {
          let newValue = parseFloat((value / 0xFE).toFixed(2))
          await this.setCapabilityValue('dim', newValue).catch(this.error)
        }
      })
    }
  }

  async changeDimLevel (dim, opts = {}) {

    this.isChangingDim = true
    this.log('tmd isChangingDim true ')

    this.clearChangeDimTimeout()

    return super.changeDimLevel(dim, opts).then(async () => {

      // Don't recall `parseAttributeReport` within 2.5 seconds when `changeDimLevel`.
      this.changeDimTimeout = this.homey.setTimeout(() => {

        this.log('tmd isChangingDim false ')
        this.isChangingDim = false
        this.changeDimTimeout = null

      }, 2500)
    }).catch(this.error)
  }

  async parseAttributeReport (capabilityId, cluster, payload) {

    if (this.isChangingDim && capabilityId === 'dim') {

      this.log('tmd report return null, isChangingDim true ')
      return null
    }

    return super.parseAttributeReport(capabilityId, cluster, payload).catch(this.error)
  }

  clearChangeDimTimeout () {

    if (this.changeDimTimeout !== null) {

      this.log('tmd clear changeDimTimeout')
      clearTimeout(this.changeDimTimeout)
      this.changeDimTimeout = null
    }
  }

  /**
   * 用于定制`meter_power`和`measure_power`能力（Capability）的数据
   */
  async _registerMeterPowerMeasurePower () {

    // 自定义能源更新的`pollInterval`轮询间隔和所报告的数值
    if (this.hasCapability('meter_power')) {

      const {
        multiplier,
        divisor,
      } = await this.zclNode.endpoints[this.getClusterEndpoint(
        CLUSTER.METERING)].clusters[CLUSTER.METERING.NAME].readAttributes(
        'multiplier', 'divisor').catch(this.error)
      // this.log('multiplier ' + multiplier + ", divisor " + divisor)
      let meterFactory = 1.0 / 3600000.0
      if (multiplier > 0 && divisor > 0) {
        meterFactory = multiplier / divisor
      }

      this.registerCapability('meter_power', CLUSTER.METERING, {
        get: 'currentSummationDelivered',
        report: 'currentSummationDelivered',
        reportParser: value => value * meterFactory,
        getParser: value => value * meterFactory,
        getOpts: {
          getOnStart: true,
          pollInterval: 60 * 60 * 1000,
        },
        // reportOpts: {
        //   configureAttributeReporting: {
        //     minInterval: 0, // Minimally once every 5 minutes
        //     maxInterval: 3600, // Maximally once every ~16 hours
        //     minChange: 0.2,
        //   },
        // },
      })
    }

    // 自定义能源更新的`pollInterval`轮询间隔和所报告的数值
    if (this.hasCapability('measure_power')) {

      const {
        acPowerMultiplier,
        acPowerDivisor,
      } = await this.zclNode.endpoints[this.getClusterEndpoint(
        CLUSTER.ELECTRICAL_MEASUREMENT)].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
        'acPowerMultiplier', 'acPowerDivisor').catch(this.error)
      // this.log('acPowerMultiplier ' + acPowerMultiplier + ", acPowerDivisor " + acPowerDivisor)
      let measureFactory = 0.1
      if (acPowerMultiplier > 0 && acPowerDivisor > 0) {
        measureFactory = acPowerMultiplier / acPowerDivisor
      }

      this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT, {
        get: 'activePower',
        report: 'activePower',
        reportParser: value => value * measureFactory,
        getParser: value => value * measureFactory,
        getOpts: {
          getOnStart: true,
          pollInterval: 60 * 60 * 1000,
        },
        // reportOpts: {
        //   configureAttributeReporting: {
        //     minInterval: 0, // Minimally once every 5 seconds
        //     maxInterval: 3600, // Maximally once every ~16 hours
        //     minChange: 0.5,
        //   },
        // },
      })
    }
  }

  /**
   * 从设备中读取 cluster 属性值并写入到设置中去
   * @param {String} key cluster属性的键名。来源于自定义Cluster或zigbee规范中
   * @param {String} endpointKey endpoint的id
   * @param {Function|Object} formatter 如果formatter类型为object且从设备读取值不为object类型，则尝试将从设备读取的值当做key来从此object中获取其值；如果这个值是function类型，则运行该函数获取其值
   * @example
   * const { binaryToString } = require('../../lib/SrUtils')
   * async onNodeInit({ node }) {
   *   super._clusterAttributeToSetting('dimmingBrightnessCurve', 1, binaryToString)
   * }
   */
   _clusterAttributeToSetting (key, endpointKey, formatter) {
    this.zclNode
      .endpoints[endpointKey || 1]
      .clusters
      .basic
      .readAttributes(key)
      .then(value => {
        value = value[key]
        this.log(`_clusterAttributeToSetting read attributes ${key}`, value)
        const settings = {}
        settings[key] = callFormatter(formatter, value)
        this.log(`_clusterAttributeToSetting settings ${key}`, settings)
        this
          .setSettings(settings)
          .catch(this.error)
      }).catch(this.error)
  }

  /**
   * 将设置中的 cluster 属性值写入到设备
   * @param {object} newSettings New setting object in onSettings event data
   * @param {String} key cluster属性的键名。来源于自定义Cluster或zigbee规范中
   * @param {String} endpointKey endpoint的id
   * @param {Function|Object} formatter 如果formatter类型为object且从设备读取值不为object类型，则尝试将从设备读取的值当做key来从此object中获取其值；如果这个值是function类型，则运行该函数获取其值
   * @example
   * super._clusterAttributeFromSetting(newSettings, 'dimmingBrightnessCurve', 1, {
   *   '15': 0x0f,
   *   '18': 0x12,
   *   '0': 0x00
   * })
   */
  _clusterAttributeFromSetting(newSettings, key, endpointKey, formatter) {
    const value = newSettings[key]
    if (value != null || value != undefined) {
      this.log(`_clusterAttributeFromSetting settings ${key}`, value)
      let data = callFormatter(formatter, value)
      const attributes = {}
      attributes[key] = data
      this.log(`_clusterAttributeFromSetting write attributes ${key}`, attributes)
      this.zclNode
        .endpoints[endpointKey]
        .clusters
        .basic
        .writeAttributes(attributes)
    }
  }

}

module.exports = SrZigbeeLight
