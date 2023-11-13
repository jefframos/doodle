import BaseComponent from '../core/gameObject/BaseComponent';
import Pool from '../core/utils/Pool';
import Shaders from '../shader/Shaders';
import SpriteSheetAnimation from './utils/SpriteSheetAnimation';
import Utils from '../core/utils/Utils';
import signals from 'signals';

export default class GameViewSpriteSheet extends BaseComponent {
    static AnimationType = {
        Idle: 'idle',
        Running: 'running'
    }
    constructor() {
        super();
    }
    enable() {
        super.enable()
        this.stopTimer = 0;
        this.stopTimerDefault = 0.1;

        
      

    }
    destroy() {
        super.destroy();
        Pool.instance.returnElement(this.spriteSheet);
        
        if(this.spriteSheet){
            this.spriteSheet.reset();
        }
        this.spriteSheet = null;
    }
    setData(data) {
        this.spriteSheet = Pool.instance.getElement(SpriteSheetAnimation)
        this.view = this.gameObject.gameView.view;

        this.spriteSheet.reset();

        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                this.spriteSheet.addLayer(key, element.spriteName, element.params);
            }
        }

        this.view.texture = PIXI.Texture.from(this.spriteSheet.currentFrame)
    }
    addAnimation(id, frames, speed, anchor = { x: 0.5, y: 0.5 }) {
        if (!this.spriteSheet) {
            this.spriteSheet = Pool.instance.getElement(SpriteSheetAnimation)
            this.view = this.gameObject.gameView.view;
        }
        this.spriteSheet.addFrames(id, frames, speed, anchor);
        //this.view.texture = PIXI.Texture.from(this.spriteSheet.currentFrame)

    }
    play(id){
        this.spriteSheet.play(id)
    }
    update(delta) {
        if (!this.spriteSheet) {
            return;
        }
        this.spriteSheet.update(delta);
        if (this.spriteSheet.currentFrame) {
            this.view.texture = PIXI.Texture.from(this.spriteSheet.currentFrame)
            this.view.anchor = this.spriteSheet.anchor;
        }        

    }
}