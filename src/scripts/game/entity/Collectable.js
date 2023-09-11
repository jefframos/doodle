import * as PIXI from 'pixi.js';

import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import Player from './Player';
import RenderModule from "../core/modules/RenderModule";
import Shadow from '../components/view/Shadow';
import Utils from '../core/utils/Utils';
import Vector3 from '../core/gameObject/Vector3';

export default class Collectable extends GameObject {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.RenderLayers.Base;
        this.gameView.view = new PIXI.Sprite.from("pickup0001")
        this.gameView.view.anchor.set(0.5,0.5)
        this.gameView.view.scale.set(Utils.scaleToFit(this.gameView.view, 30))
        this.xp = 1;

    }
    setType() { }
   
    start() {
        super.start();
        this.player = this.engine.findByType(Player)
        this.lerpTime = 0.35 + Math.random() * 0.15;
        this.currentLerp = 0;
        this.attracting = false;
        this.setCollectableTexture();
    }
    update(delta) {
        super.update(delta)
        if (!this.player) {
            return;
            this.destroy()
        }
        if (this.attracting) {
            this.currentLerp += delta;

            if (this.currentLerp >= this.lerpTime * 0.5) {
                this.collectCallback();
                this.destroy()
            } else {
                this.transform.position = Vector3.lerp(this.transform.position, Vector3.sum(this.player.transform.position, new Vector3(0, -20, 0)), this.currentLerp / this.lerpTime)
            }
        }
        if (Vector3.distance(this.transform.position, this.player.transform.position) < (this.player.collectRadius + 17)) {
            this.attracting = true;
        }
    }
    setCollectableTexture() {
        let pickup = ''
        if(this.xp >3){
            pickup = '3'
        }else if(this.xp >=2){
            pickup = '2'
        }
        this.gameView.view.texture = PIXI.Texture.from("pickup"+pickup+"000" + Math.ceil(Math.random() * 5))
    }
    collectCallback() {
        //console.log(this.player.attributes.xpMultiplier)

        SOUND_MANAGER.play('getstar', 0.15, Math.random() * 0.3 + 0.7)
        this.player.sessionData.addXp(this.xp * this.player.attributes.xpMultiplier)

    }
}