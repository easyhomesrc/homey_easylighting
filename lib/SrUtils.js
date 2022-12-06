'use strict'

const { mapValueRange } = require('homey-zigbeedriver/lib/util')

/**
 * 如果value数值超过了range限定范围，则将数值设置为range范围边界
 * @param {Number} value 数值
 * @param {Array} range 范围。索引0是起始范围（包含）；1是结束范围（包含）。
 * @example
 * limitedRange(99, [0, 10])// return 10
 * limitedRange(-99, [0, 10])// return 0
 */
function limitedRange(value, range) {
  if (range[0] && value < range[0]) {
    return range[0]
  } else if (range[1] && value > range[1]) {
    return range[1]
  } else {
    return value
  }
}

/**
 * 调用格式化函数。如果formatter类型为object且value值不为object类型，则尝试将value当做key来从此object中获取其值；
 * 如果这个值是function类型，则运行该函数获取其值
 * @param {Function|Object} formatter 格式化函数
 * @param {any} value 被格式化的值
 * @example
 * callFormatter({0x01:value => `${value} is 0x01`}, 0x01)
 * // return 1 is 0x01
 */
function callFormatter(formatter, value) {
  if (!formatter) {
    return value
  }
  if(typeof value != 'object' && formatter[value]) {
    return callFormatter(formatter[value], value)
  } else if (typeof formatter === 'function') {
    return formatter(value)
  } else {
    return formatter
  }
}

/**
 * @param {Number} value binary digits
 * @returns true: 0x01;false: 0x00
 */
function binaryToString(value) {
  return Number.parseInt(value).toString()
}

/**
 * 字符串转16进制
 * @param {String} value digits string
 */
 function stringToBinary(value) {
  return Buffer.from(value, 'hex').toString('hex')
}

/**
 * @param {Number} value binary digits
 * @returns true: 0x01;false: 0x00
 */
function binaryToNumber(value) {
  return Number.parseInt(value)
}

/**
 * 无符号10进制数字转16进制。成功转换时返回转换后的数字，否则返回空
 * @param {Number} value digits string
 * @param {Number} byteSize 字节大小。比如16进制1字节是 1 byte.
 */
 function numberToBinary(value, byteSize) {
  byteSize = byteSize || 1
  // NodeJS的Buffer最高支持 48 位无符号整数
  byteSize = byteSize > 48 ? 48 : byteSize
  if (value < 0) {
    return
  }
  const buf = Buffer.allocUnsafe(byteSize)
  const methodName = `writeUInt${byteSize * 8}BE`
  if (buf[methodName]) {
    buf[methodName](value)
    return buf.toString('hex')
  } else {
    // Incompatible node version
    return
  }
}

/**
 * @param {Number} value binary digits
 * @returns true: 0x01;false: 0x00
 */
function binaryToBoolean(value) {
  return value === 0x01 ? true : false
}

/**
 * @param {Boolean} value 
 * @returns true: 0x01;false: 0x00
 */
function booleanToBinary(value) {
  return value ? 0x01 : 0x00
}

/**
 *
 * @param hue [0, 0xFE]
 * @return HomeyHue [0.00, 1.00]
 */
function getHomeyHue (hue) {
  // return Math.round(zigbeeHue * 100 / 254.0) / 100
  return parseFloat((hue / 0xFE).toFixed(2))
}

function getHomeySaturation (saturation) {
  return parseFloat((saturation / 0xFE).toFixed(2))
}

function getMoveToLevelToken (level) {
  const tokenLevel = parseFloat((level / 0xFE).toFixed(2))
  return Math.min(Math.max(0.01, tokenLevel), 1)
}

function getMoveHueMoveModeToken (moveMode) {
  if (moveMode === 'stop') return 0
  if (moveMode === 'up') return 0x01
  if (moveMode === 'down') return 0x03
  return 0
}

function getMoveSaturationMoveModeToken (moveMode) {
  if (moveMode === 'stop') return 0
  if (moveMode === 'up') return 1
  if (moveMode === 'down') return 3
  return 0
}

function getMoveSaturationRateToken (rate) {
  const newRate = mapValueRange(0, 0xFE, 0, 1, rate)
  return parseFloat(newRate.toFixed(2))
}

function getStepLevelModeToken (mode) {
  if (mode === 'up') return 0
  if (mode === 'down') return 1
  return 0
}

function getStepLevelStepSizeToken (stepSize) {
  return parseFloat((stepSize / 0xFE).toFixed(2))
}

function getMoveLevelMoveModeToken (moveMode) {
  if (moveMode === 'up') return 0
  if (moveMode === 'down') return 1
  return 0
}

function getMoveHueRateToken (rate) {
  return getMoveSaturationRateToken(rate)
}

function getMoveLevelRateToken (rate) {
  return parseFloat((rate / 0xFE).toFixed(2))
}

function getStepColorTemperatureStepModeToken (stepMode) {
  if (stepMode === 'up') return 1
  if (stepMode === 'down') return 3
  return 1
}

function getStepColorTemperatureStepSizeToken (stepSize) {
  return parseFloat((stepSize / (450 - 155)).toFixed(2))
}

function getColorTemperatureToken (colorTemperature) {
  const value = mapValueRange(155, 450, 0, 1, colorTemperature)
  return parseFloat(value.toFixed(2))
}

function getMoveColorTemperatureMoveModeToken (moveMode) {
  if (moveMode === 'stop') return 0
  if (moveMode === 'up') return 1
  if (moveMode === 'down') return 3
  return 0
}

function getMoveColorTemperatureRateToken (rate) {
  return parseFloat((rate / (450 - 155)).toFixed(2))
}

function getColorXYToken (value) {
  const result = mapValueRange(0, 0xFFFF, 0, 1, value)
  return parseFloat(result.toFixed(2))
}

function getInt16 (number) {
  const int16 = new Int16Array(1)
  int16[0] = number
  return int16[0]
}

module.exports = {
  limitedRange,
  callFormatter,
  binaryToString,
  stringToBinary,
  binaryToNumber,
  numberToBinary,
  binaryToBoolean,
  booleanToBinary,
  mapValueRange,
  getHomeyHue,
  getMoveToLevelToken,
  getHomeySaturation,
  getMoveHueMoveModeToken,
  getMoveSaturationMoveModeToken,
  getMoveHueRateToken,
  getMoveSaturationRateToken,
  getStepLevelModeToken,
  getStepLevelStepSizeToken,
  getMoveLevelMoveModeToken,
  getMoveLevelRateToken,
  getStepColorTemperatureStepModeToken,
  getStepColorTemperatureStepSizeToken,
  getColorTemperatureToken,
  getMoveColorTemperatureMoveModeToken,
  getMoveColorTemperatureRateToken,
  getColorXYToken,
  getInt16,
}
