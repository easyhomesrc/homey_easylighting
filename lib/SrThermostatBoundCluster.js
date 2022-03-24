'use strict'

const { BoundCluster } = require('zigbee-clusters')

class SrThermostatBoundCluster extends BoundCluster {

  constructor ({
    onGetWeeklyScheduleResponse,
    endpoint,
  }) {
    super()
    this._onGetWeeklyScheduleResponse = onGetWeeklyScheduleResponse
    this._endpoint = endpoint
  }

  getWeeklyScheduleResponse (payload) {
    this.log(`getWeeklyScheduleResponse in bound cluster`)
    if (typeof this._onGetWeeklyScheduleResponse === 'function') {
      this._onGetWeeklyScheduleResponse(payload)
    }
  }

}

module.exports = SrThermostatBoundCluster
