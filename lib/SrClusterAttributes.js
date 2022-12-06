const { ZCLDataTypes } = require('zigbee-clusters')

module.exports = {
  externalSwitchType: {
    id: 0x8803,
    type: ZCLDataTypes.uint8,
  },
  /*
   Dimming brightness curve, Works after reset power
   of the device,
     0x00: linear,
     0x0f: logarithmic with gamma value 1.5,
     0x12: logarithmic with gamma value 1.8 
   */
  dimmingBrightnessCurve: {
    id: 0x8806,
    type: ZCLDataTypes.uint8,
  },
  /*
    Motion sensor daylight sensor lux threshold,
    2 bytes, only when the detected lux is lower than the 
    threshold, turning on the light is permitted,
    for instance 0x0000, this function does not work.
   */
  motionSensorDaylightSensorLuxThreshold: {
    id: 0x8903,
    type: ZCLDataTypes.uint16,
  },
  /*
    Motion sensor operation mode, 1 byte,xf
      0x00: means auto mode,
      0x01: means manual mode,

    Auto mode means that when a motion is detected, 
    the device will output PWM according to the set 
    brightness threshold, and delay time. PWM status 
    needs to be reported to the gateway. 
    Manual mode means that PWM output is controlled 
    and determined by the gateway or the wireless 
    switch, not associated with motion detection.
   */
  motionSensorOperationMode: {
    id: 0x8904,
    type: ZCLDataTypes.uint8,
  },
  /*
    Motion sensor sensitivity setting,
    Works after reset power of the device,
    1 byte, data range 0-15, 0 is the highest sensitivity, 
    15 is the lowest sensitivity.
   */
  motionSensorSensitivity: {
    id: 0x8905,
    type: ZCLDataTypes.uint8,
  },
  /*
    Motion sensor microwave detection enabled or 
    disabled, Works after reset power of the device,
    1 byte, 0x00: disabled, 0x01: enabled
   */
  enableMotionSensor: {
    id: 0x8906,
    type: ZCLDataTypes.uint8,
  },
  /*
    Configuration of whether to enable the brightness 
    module, 0=disabled, 1=enabled
   */
  enableBrightnessModule: {
    id: 0x890c,
    type: ZCLDataTypes.uint8,
  },
  /*
    Light on time (the first delay time),
    Works after reset power of the device,
    When motion sensor mode is set as auto mode, and 
    motion is detected, after the person leaves, light on 
    time of the device, 2 bytes, unit is second,
    For instance 0x003c means 60 seconds.
   */
  lightOnTime: {
    id: 0x8902,
    type: ZCLDataTypes.uint16,
  },
  /*
    Configuration of the brightness value of PWM 
    output when motion detected, this brightness value 
    is controlled through PWM output working as PID 
    closed loop control to achieve the constant light 
    output. Value range is 0-1000LUX, 0LUX means this 
    attribute is disabled, and PWM output when motion 
    detected is not associated with the brightness 
    value.
    default:0x0000
   */
  pwmBrightnessValue : {
    id: 0x8908,
    type: ZCLDataTypes.uint16,
  },
  /*
    Configuration of PWM output percentage when 
    motion detected,
    Value Range is 0x00-0xfe, which means 0-100%,
    When configured PID closed loop control brightness 
    LUX is 0, PWM output of the device is according to 
    this value.
    default:0xfe
   */
  pwmOutputPercentage: {
    id: 0x8909,
    type: ZCLDataTypes.uint8,
  },
}