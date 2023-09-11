import BaseComponent from '../core/gameObject/BaseComponent';
import Pool from '../core/utils/Pool';
import Shaders from '../shader/Shaders';
import SpriteSheetAnimation from './utils/SpriteSheetAnimation';
import SpriteSheetBehaviour from './particleSystem/particleBehaviour/SpriteSheetBehaviour';
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
    update(delta) {
        if (!this.spriteSheet) {
            return;
        }
        this.spriteSheet.update(delta);
        if (this.spriteSheet.currentFrame) {
            this.view.texture = PIXI.Texture.from(this.spriteSheet.currentFrame)
            this.view.anchor = this.spriteSheet.anchor;
        }
        if (this.gameObject.physics.magnitude > 0.1 || this.alwaysWalking) {
            this.spriteSheet.play(GameViewSpriteSheet.AnimationType.Running)
            this.stopTimer = this.stopTimerDefault
        } else {

            if (this.stopTimer <= 0) {
                this.spriteSheet.play(GameViewSpriteSheet.AnimationType.Idle)
            } else {
                this.stopTimer -= delta;
            }
        }

    }
}