import BaseComponent from '../core/gameObject/BaseComponent';
import Eugine from '../core/Eugine';
import Particle from './particleSystem/Particle';
import Pool from '../core/utils/Pool';

export default class SpriteSheetGameView extends BaseComponent {
    static total = 0;
    constructor() {
        super();
        this.descriptor = null;
        this.particle = null;
        this.autoDestroy = false;
        this.colorOverride = 0xFFFFFF;

        this.particle = Pool.instance.getElement(Particle);

        this.idTest = SpriteSheetGameView.total
        SpriteSheetGameView.total++
    }
    enable() {
        super.enable();
        this.gameObject.gameView.view.texture = PIXI.Texture.EMPTY;
    }
    restart() {


        this.particle.reset();
        this.gameObject.gameView.view.texture = PIXI.Texture.EMPTY;
    }
    setDescriptor(particleDescriptor, param = {}) {
        for (const key in param) {
            if (Object.hasOwnProperty.call(param, key) && this.gameObject.gameView.view[key] !== undefined) {
                this.gameObject.gameView.view[key] = param[key];
            }
        }
        if (param.viewOffset) {
            this.gameObject.gameView.viewOffset = param.viewOffset;
        }

        this.descriptor = particleDescriptor;


        this.particle.build(particleDescriptor)
        if (param.color) {
            this.gameObject.gameView.view.tint = param.color;
            this.colorOverride = param.color;
        } else {
            this.colorOverride = 0xFFFFFF;
        }

    }
    update(delta) {
        if (this.particle) {
            delta *= Eugine.PhysicsTimeScale;
            this.particle.update(delta);
            if (!this.particle.behaviours[0].isLoop && this.particle.behaviours[0].normalTime >= 1) {
                this.gameObject.gameView.view.texture = PIXI.Texture.EMPTY;
            } else {
                this.gameObject.gameView.view.texture = this.particle.sprite.texture
            }
        }
    }
}