'use strict';

/**
 * Copy from https://github.com/athombv/com.ikea.tradfri.git
 *
 * Add a parameter `_endpoint` for this Object.
 */

const { BoundCluster } = require('zigbee-clusters');

class OnOffBoundCluster extends BoundCluster {

  constructor({
    onSetOff, onSetOn, onWithTimedOff, onToggle, endpoint
  }) {
    super();
    this._onToggle = onToggle;
    this._onWithTimedOff = onWithTimedOff;
    this._onSetOff = onSetOff;
    this._onSetOn = onSetOn;
    this._endpint = endpoint;
  }

  toggle() {
    if (typeof this._onToggle === 'function') {
      this._onToggle(this._endpint);
    }
  }

  onWithTimedOff({ onOffControl, onTime, offWaitTime }) {
    if (typeof this._onWithTimedOff === 'function') {
      this._onWithTimedOff({ onOffControl, onTime, offWaitTime }, this._endpint);
    }
  }

  setOn() {
    if (typeof this._onSetOn === 'function') {
      this._onSetOn(this._endpint);
    }
  }

  setOff() {
    if (typeof this._onSetOff === 'function') {
      this._onSetOff(this._endpint);
    }
  }

}

module.exports = OnOffBoundCluster;
