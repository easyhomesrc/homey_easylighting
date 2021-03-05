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

          if (keyAttributes === 'Key Pressed 1 time') {

            if (sceneNumber === 1) {

              this.driver.onOffFlowTrigger.trigger(this, null, null)

            } else if (sceneNumber === 2) {

              this.driver.levelFlowTrigger.trigger(this, null, null)

            }

          } else if (keyAttributes === 'Key Held Down') {

            if (sceneNumber === 1) {

              this.driver.onOffKeyHeldDownFlowTrigger.trigger(this, null, null)

            } else if (sceneNumber === 2) {

              this.driver.levelKeyHeldDownFlowTrigger.trigger(this, null, null)

            }

          } else if (keyAttributes === 'Key Released') {

            if (sceneNumber === 1) {

              this.driver.onOffKeyReleasedFlowTrigger.trigger(this, null, null)

            } else if (sceneNumber === 2) {

              this.driver.levelKeyReleasedFlowTrigger.trigger(this, null, null)

            }
          }
        }
      },
    )
  }

}

module.exports = MyRemote
