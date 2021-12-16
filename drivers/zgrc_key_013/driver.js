'use strict'

const SrZigBeeDriver = require('../../lib/SrZigBeeDriver')

class MyDriver extends SrZigBeeDriver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit () {
    super.onInit()

    const groupFlowIds = [
      'zgrc_key_013_on',
      'zgrc_key_013_off',
      'zgrc_key_013_move_level_up',
      'zgrc_key_013_move_level_down',
      'zgrc_key_013_move_level_stopped',
      'zgrc_key_013_recall_scene',
      'zgrc_key_013_store_scene',
    ]

    groupFlowIds.forEach(flowId => {
      this.getDeviceTriggerCard(flowId).
        registerRunListener(async (args, state) => {
          return args.group === state.group
        })
    })

  }

}

module.exports = MyDriver
