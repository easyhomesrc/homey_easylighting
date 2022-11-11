'use strict'

const SrZigBeeDriver = require('../../lib/SrZigBeeDriver')

class MyDriver extends SrZigBeeDriver {

  onInit () {
    super.onInit()

    this._levelStepActionCard = this.getActionCard('1402755_level_step_with_onoff')
    this._levelStepActionCard.registerRunListener((args, state) => {
      return args.device.levelStepRunListener(args, state).catch(this.error)
    })

    this._levelMoveActionCard = this.getActionCard('1402755_level_move_with_onoff')
    this._levelMoveActionCard.registerRunListener((args, state) => {
      return args.device.levelMoveRunListener(args, state).catch(this.error)
    })

    this._levelStopActionCard = this.getActionCard('1402755_level_stop_with_onoff')
    this._levelStopActionCard.registerRunListener((args, state) => {
      return args.device.levelStopRunListener(args, state).catch(this.error)
    })

    this._recallSceneActionCard = this.getActionCard('1402755_recall_scene')
    this._recallSceneActionCard.registerRunListener((args, state) => {
      return args.device.recallSceneRunListener(args, state).catch(this.error)
    })

    this._storeSceneActionCard = this.getActionCard('1402755_store_scene')
    this._storeSceneActionCard.registerRunListener((args, state) => {
      return args.device.storeSceneRunListener(args, state).catch(this.error)
    })
  }

}

module.exports = MyDriver
