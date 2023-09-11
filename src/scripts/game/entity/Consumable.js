import * as PIXI from 'pixi.js';

import Collectable from './Collectable';
import EffectsManager from '../manager/EffectsManager';
import Game from '../../Game';
import GameData from '../data/GameData';
import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import LevelManager from '../manager/LevelManager';
import Player from './Player';
import RenderModule from "../core/modules/RenderModule";
import Shadow from '../components/view/Shadow';
import UIUtils from '../utils/UIUtils';
import Utils from '../core/utils/Utils';
import Vector3 from '../core/gameObject/Vector3';

export default class Consumable extends Collectable {
    static Type = {
        Magnet: 1,
        Coin: 2,
        Chest: 3,
        Heal: 4,
        Bomb: 5,
        SingleCoin: 6
    }
    constructor() {
        super();

        this.glow = new PIXI.Sprite.from('shine')
        this.glow.anchor.set(0.5)
        this.glow.scale.set(1.5)
        this.glow.alpha = 1

        this.gameView.layer = RenderModule.RenderLayers.Gameplay;
        this.gameView.view.texture = PIXI.Texture.EMPTY;
        this.gameView.view.addChild(this.glow)
        this.gameView.view.scale.set(1)
        this.consumableSprite = new PIXI.Sprite.from('shine')
        this.gameView.view.addChild(this.consumableSprite)
        this.consumableSprite.anchor.set(0.5)

        console.log("ADD AN EXP PLANT")
    }
    build(params) {
        super.build(params);

        //this.addChild(this.engine.poolGameObject(Shadow))
    }
    setType(value) {
        let size = 25
        this.type = value;
        switch (value) {
            case Consumable.Type.Magnet:
                this.consumableSprite.texture = PIXI.Texture.from(UIUtils.getIconUIIcon('magnet'))

                break;
            case Consumable.Type.Coin:
                this.consumableSprite.texture = PIXI.Texture.from(UIUtils.getIconUIIcon('coin-bag'))

                break;
            case Consumable.Type.SingleCoin:
                this.consumableSprite.texture = PIXI.Texture.from(UIUtils.getIconUIIcon('softCurrency'))
                size = 15;

                break;
            case Consumable.Type.Chest:

                break;
            case Consumable.Type.Heal:
                this.consumableSprite.texture = PIXI.Texture.from(UIUtils.getIconUIIcon('heal'))

                break;
            case Consumable.Type.Bomb:
                this.consumableSprite.texture = PIXI.Texture.from(UIUtils.getIconUIIcon('bomb'))

                break;
        }

        this.glow.y = - size / 2
        this.gameView.view.scale.set(Utils.scaleToFit(this.consumableSprite, size))

        this.posSin = 0;
    }
    setCollectableTexture() {
    }
    collectCallback() {
        SOUND_MANAGER.play('teleport', 0.2, Math.random() * 0.1 + 0.9)
        switch (this.type) {
            case Consumable.Type.Magnet:
                LevelManager.instance.collectAllPickups();
                break;
            case Consumable.Type.Coin:
                const value = Math.round(Math.random() * 20 + 10);
                GameData.instance.addSoftCurrency(value);
                LevelManager.instance.collectCoins(value);
                EffectsManager.instance.popCoin(this, '+' + value)
                break;
            case Consumable.Type.Chest:

                break;
            case Consumable.Type.SingleCoin:
                const value2 = Math.round(Math.random() * 3 + 1);
                GameData.instance.addSoftCurrency(value2);
                LevelManager.instance.collectCoins(value2);
                EffectsManager.instance.popCoin(this, '+' + value2)
                break;
            case Consumable.Type.Heal:
                this.player.itemHeal();

                break;
            case Consumable.Type.Bomb:
                this.player.explodeAround();

                EffectsManager.instance.bombExplode();
                break;
        }
    }

    update(delta, unscaledDelta) {
        super.update(delta, unscaledDelta);

        this.timer += delta;
        this.posSin += delta;

        this.transform.position.y = Math.sin(this.posSin) * 10 + 10
        this.glow.rotation = Game.Time % Math.PI * 5;

        if (this.timer > 0.1) {

            EffectsManager.instance.emitById(Vector3.XZtoXY(Vector3.sum(this.transform.position, new Vector3(Math.random() * 30 - 15, 0, Math.random() * 30 - 15 - 30))), 'SPARKS_01', 1)
            this.timer = 0;
        }
    }
}