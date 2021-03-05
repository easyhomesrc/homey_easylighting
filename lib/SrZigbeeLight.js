'use strict'

const { ZigBeeLightDevice } = require('homey-zigbeedriver')

let isChangingDim = false
let changeDimTimeout = null

class SrZigbeeLight extends ZigBeeLightDevice {

  async changeDimLevel (dim, opts = {}) {

    isChangingDim = true
    this.log('tmd isChangingDim true ')

    this.clearChangeDimTimeout()

    return super.changeDimLevel(dim, opts).then(async () => {

      // Don't recall `parseAttributeReport` within 2.5 seconds when `changeDimLevel`.
      changeDimTimeout = setTimeout(() => {

        this.log('tmd isChangingDim false ')
        isChangingDim = false
        changeDimTimeout = null

      }, 2500)
    })
  }

  async parseAttributeReport (capabilityId, cluster, payload) {

    if (isChangingDim && capabilityId === 'dim') {

      this.log('tmd report return null, isChangingDim true ')
      return null
    }

    return super.parseAttributeReport(capabilityId, cluster, payload)
  }

  clearChangeDimTimeout() {

    if (changeDimTimeout !== null) {

      this.log('tmd clear changeDimTimeout')
      clearTimeout(changeDimTimeout)
      changeDimTimeout = null
    }
  }

}

module.exports = SrZigbeeLight
