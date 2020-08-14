'use strict'

const { BoundCluster } = require('zigbee-clusters')

class SrSceneBoundCluster extends BoundCluster {

  constructor ({
    onSrStoreScene,
    onSrRecallScene,
    endpoint,
  }) {
    super()
    this._onSrStoreScene = onSrStoreScene
    this._onSrRecallScene = onSrRecallScene
    this._endpoint = endpoint
  }

  srStoreScene (payload) {
    if (typeof this._onSrStoreScene === 'function') {
      this._onSrStoreScene(payload, this._endpoint)
    }
  }

  srRecallScene (payload) {
    if (typeof this._onSrRecallScene === 'function') {
      this._onSrRecallScene(payload, this._endpoint)
    }
  }

}

module.exports = SrSceneBoundCluster
