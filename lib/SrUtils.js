'use strict'

const { mapValueRange } = require('homey-zigbeedriver/lib/util')

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
