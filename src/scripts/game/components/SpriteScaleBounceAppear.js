import BaseComponent from '../core/gameObject/BaseComponent';
import Eugine from '../core/Eugine';
import Utils from '../core/utils/Utils';
import signals from 'signals';

export default class SpriteScaleBounceAppear extends BaseComponent {
    constructor() {
        super();

        this.acc = 0
        this.time = 0.75;
        this.timer = 0;
    }
    enable() {
        super.enable();
        this.timer = 0;
        if (this.gameObject.gameView.view) {
            this.gameObject.gameView.view.scale.y = 0;
        }
    }
    update(delta) {
        delta *= Eugine.PhysicsTimeScale;
        if (this.gameObject.gameView.view && this.timer <  this.time) {
            this.gameObject.gameView.view.scale.y = Utils.easeOutElastic(this.timer /  this.time) * 0.5;
            this.timer += delta;

        }
    }
}