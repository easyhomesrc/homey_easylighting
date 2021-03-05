'use strict'

const { ZwaveDevice } = require('homey-zwavedriver')

class MyRemote extends ZwaveDevice {

  async onNodeInit ({ node }) {

    // this.enableDebug()
    // this.printNode()

    this.registerCapability('alarm_battery', 'BATTERY')
    this.registerCapability('measure_battery', 'BATTERY')

    this.registerReportListener('CENTRAL_SCENE',
      'CENTRAL_SCENE_NOTIFICATION', report => {

        this.log('CENTRAL_SCENE => report: ', report)

        if (report && report.hasOwnProperty('Scene Number')
          && report.hasOwnProperty('Properties1')
          && report.Properties1.hasOwnProperty('Key Attributes')) {

          const sceneNumber = report['Scene Number']
          const keyAttributes = report.Properties1['Key Attributes']

          const group = Math.ceil(sceneNumber / 2.0)
          const isOn = (sceneNumber % 2) > 0
          const state = {
            group: group.toString(),
          }

          if (keyAttributes === 'Key Pressed 1 time') {

            if (isOn) {

              this.driver.onFlowTrigger.trigger(this, null, state)

            } else {

              this.driver.offFlowTrigger.trigger(this, null, state)
            }

          } else if (keyAttributes === 'Key Held Down') {

            if (isOn) {

              this.driver.onKeyHeldDownFlowTrigger.trigger(this, null, state)

            } else {

              this.driver.offKeyHeldDownFlowTrigger.trigger(this, null, state)
            }

          } else if (keyAttributes === 'Key Released') {

            if (isOn) {

              this.driver.onKeyReleasedFlowTrigger.trigger(this, null, state)

            } else {

              this.driver.offKeyReleasedFlowTrigger.trigger(this, null, state)
            }
          }
        }
      },
    )
  }

}

module.exports = MyRemote
