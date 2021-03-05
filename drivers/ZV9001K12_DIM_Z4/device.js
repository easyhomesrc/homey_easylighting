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

              this.driver.allOnFlowTrigger.trigger(this, null, null)

            } else if (sceneNumber === 2) {

              this.driver.allOffFlowTrigger.trigger(this, null, null)

            } else if (sceneNumber === 11) {

              this.driver.s1FlowTrigger.trigger(this, null, null)

            } else if (sceneNumber === 12) {

              this.driver.s2FlowTrigger.trigger(this, null, null)

            } else if (sceneNumber >= 3 && sceneNumber <= 10) {

              const group = Math.ceil(sceneNumber / 2.0) - 1
              const isOn = (sceneNumber % 2) > 0
              const state = {
                group: group.toString(),
              }

              if (isOn) {

                this.driver.onFlowTrigger.trigger(this, null, state)

              } else {

                this.driver.offFlowTrigger.trigger(this, null, state)
              }

            }

          } else if (keyAttributes === 'Key Held Down') {

            if (sceneNumber === 1) {

              this.driver.allOnKeyHeldDownFlowTrigger.trigger(this, null, null)

            } else if (sceneNumber === 2) {

              this.driver.allOffKeyHeldDownFlowTrigger.trigger(this, null, null)

            } else if (sceneNumber === 11) {

              this.driver.s1KeyHeldDownFlowTrigger.trigger(this, null, null)

            } else if (sceneNumber === 12) {

              this.driver.s2KeyHeldDownFlowTrigger.trigger(this, null, null)

            } else if (sceneNumber >= 3 && sceneNumber <= 10) {

              const group = Math.ceil(sceneNumber / 2.0) - 1
              const isOn = (sceneNumber % 2) > 0
              const state = {
                group: group.toString(),
              }

              if (isOn) {

                this.driver.onKeyHeldDownFlowTrigger.trigger(this, null, state)

              } else {

                this.driver.offKeyHeldDownFlowTrigger.trigger(this, null, state)
              }

            }

          } else if (keyAttributes === 'Key Released') {

            if (sceneNumber === 1) {

              this.driver.allOnKeyReleasedFlowTrigger.trigger(this, null, null)

            } else if (sceneNumber === 2) {

              this.driver.allOffKeyReleasedFlowTrigger.trigger(this, null, null)

            } else if (sceneNumber === 11) {

              this.driver.s1KeyReleasedFlowTrigger.trigger(this, null, null)

            } else if (sceneNumber === 12) {

              this.driver.s2KeyReleasedFlowTrigger.trigger(this, null, null)

            } else if (sceneNumber >= 3 && sceneNumber <= 10) {

              const group = Math.ceil(sceneNumber / 2.0) - 1
              const isOn = (sceneNumber % 2) > 0
              const state = {
                group: group.toString(),
              }

              if (isOn) {

                this.driver.onKeyReleasedFlowTrigger.trigger(this, null, state)

              } else {

                this.driver.offKeyReleasedFlowTrigger.trigger(this, null, state)
              }

            }
          }
        }
      },
    )
  }

}

module.exports = MyRemote
