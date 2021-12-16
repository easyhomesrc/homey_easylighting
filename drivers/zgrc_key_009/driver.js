'use strict'

const SrZigBeeDriver = require('../../lib/SrZigBeeDriver')

class MyDriver extends SrZigBeeDriver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit () {
    super.onInit()

    const triggerCards = [
      'ZGRC_KEY_009_on',
      'ZGRC_KEY_009_off',
      'ZGRC_KEY_009_level_move_with_onoff_up',
      'ZGRC_KEY_009_level_move_with_onoff_down',
      'ZGRC_KEY_009_level_stop_with_onoff',
      'ZGRC_KEY_009_level_step_with_onoff_up',
      'ZGRC_KEY_009_level_step_with_onoff_down',
      'ZGRC_KEY_009_move_to_color_temperature',
      'ZGRC_KEY_009_move_color_temperature_up',
      'ZGRC_KEY_009_move_color_temperature_down',
      'ZGRC_KEY_009_stop_move_step',
      'ZGRC_KEY_009_move_to_color',
      'ZGRC_KEY_009_move_hue_up',
      'ZGRC_KEY_009_move_hue_down',
      'ZGRC_KEY_009_move_hue_stop',
      'ZGRC_KEY_009_recall_scene_s1',
      'ZGRC_KEY_009_recall_scene_s2',
      'ZGRC_KEY_009_store_scene_s1',
      'ZGRC_KEY_009_store_scene_s2',
    ]

    triggerCards.forEach(value => {
      this.getDeviceTriggerCard(value).
        registerRunListener(async (args, state) => {
          return true
        })
    })
  }

}

module.exports = MyDriver
