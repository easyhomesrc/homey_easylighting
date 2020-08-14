'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { CLUSTER } = require('zigbee-clusters')

class MyLight extends ZigBeeDevice {

  onNodeInit ({ zclNode, node }) {
    super.onNodeInit({ zclNode, node })

    this.registerCapability('onoff', CLUSTER.ON_OFF)
  }

}

module.exports = MyLight;
