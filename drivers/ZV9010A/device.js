'use strict'

const { ZwaveDevice } = require('homey-zwavedriver')

class MyRemote extends ZwaveDevice {

  async onNodeInit ({ node }) {

    // this.enableDebug()
    // this.printNode()

    this.registerCapability("alarm_contact", "NOTIFICATION")
    this.registerCapability('alarm_battery', 'BATTERY')
    this.registerCapability('measure_battery', 'BATTERY')

    this.registerReportListener('NOTIFICATION',
      'NOTIFICATION_REPORT', report => {

        this.log('NOTIFICATION_REPORT => report: ', report)

        if (report && report.hasOwnProperty('Event')) {

          const event = report['Event']

          if (event === 22) {

            // Open
            this.driver.openFlowTrigger.trigger(this, null, null)

          } else if (event === 23) {

            // Closed
            this.driver.closedFlowTrigger.trigger(this, null, null)
          }

        }
      },
    )
  }

}

module.exports = MyRemote
