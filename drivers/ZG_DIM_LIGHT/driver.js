'use strict'

const SrZigBeeDriver = require('../../lib/SrZigBeeDriver')

class MyDriver extends SrZigBeeDriver {

  onInit () {
    super.onInit()

    this._levelStepActionCard = this.getActionCard('ZG_DIM_LIGHT_level_step_with_onoff')
    this._levelStepActionCard.registerRunListener((args, state) => {
      return args.device.levelStepRunListener(args, state)
    })

    this._levelMoveActionCard = this.getActionCard('ZG_DIM_LIGHT_level_move_with_onoff')
    this._levelMoveActionCard.registerRunListener((args, state) => {
      return args.device.levelMoveRunListener(args, state)
    })

    this._levelStopActionCard = this.getActionCard('ZG_DIM_LIGHT_level_stop_with_onoff')
    this._levelStopActionCard.registerRunListener((args, state) => {
      return args.device.levelStopRunListener(args, state)
    })

    this._recallSceneActionCard = this.getActionCard('ZG_DIM_LIGHT_recall_scene')
    this._recallSceneActionCard.registerRunListener((args, state) => {
      return args.device.recallSceneRunListener(args, state)
    })

    this._storeSceneActionCard = this.getActionCard('ZG_DIM_LIGHT_store_scene')
    this._storeSceneActionCard.registerRunListener((args, state) => {
      return args.device.storeSceneRunListener(args, state)
    })
  }

}

module.exports = MyDriver
