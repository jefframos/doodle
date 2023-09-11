import * as PIXI from 'pixi.js';

import Collectable from './Collectable';
import DirectionPin from './DirectionPin';
import EffectsManager from '../manager/EffectsManager';
import Game from '../../Game';
import GameData from '../data/GameData';
import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import LevelManager from '../manager/LevelManager';
import Player from './Player';
import RenderModule from "../core/modules/RenderModule";
import UIUtils from '../utils/UIUtils';
import Utils from '../core/utils/Utils';
import Vector3 from '../core/gameObject/Vector3';

export default class InGameChest extends Collectable {

    constructor() {
        super();
    }
    build(params) {
        super.build(params)

        this.pin = LevelManager.instance.addEntity(DirectionPin)
        this.addChild(this.pin)

        this.pin.customEntity = this
        this.pin.changeIcon(UIUtils.getIconUIIcon('chestPin'))

        this.timer = 0;
    }
    setCollectableTexture() {
        this.gameView.view.texture = PIXI.Texture.from(UIUtils.getIconUIIcon('chest'))
        this.gameView.view.scale.set(Utils.scaleToFit(this.gameView.view, 40))
        this.gameView.view.anchor.set(0.5)
    }
    collectCallback() {
        LevelManager.instance.openChest();
    }
    update(delta, unscaledDelta) {
        super.update(delta, unscaledDelta);

        this.timer += delta;

        if(this.timer > 0.1){

            EffectsManager.instance.emitById(Vector3.XZtoXY(Vector3.sum(this.transform.position, new Vector3(Math.random() * 30 - 15,0,Math.random() * 30 - 15  - 30))), 'SPARKS_01', 1)
            this.timer = 0;
        }
    }
}