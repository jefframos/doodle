import BaseComponent from '../core/gameObject/BaseComponent';
import Eugine from '../core/Eugine';
import signals from 'signals';

export default class SpriteJump extends BaseComponent {
    constructor() {
        super();

        this.acc = 0
        this.offsetSin = Math.random() * Math.PI;
        this.rnd = Math.random();
        this.jumpHight = 20

        this.sinSpeed = 0.8 + Math.random() * 0.2
        this.startPosition = 0;
    }
    enable() {
        super.enable();
        this.offsetSin = Math.random() * Math.PI;
        this.startPosition = this.gameObject.transform.position.y;
    }
    update(delta) {
        delta *= Eugine.PhysicsTimeScale;
        if (this.gameObject.gameView.view) {
            if (this.gameObject.physics.magnitude > 0) {
                this.offsetSin += delta * 4 * this.sinSpeed;
                this.offsetSin %= Math.PI
            } else {
                this.offsetSin = utils.lerp(this.offsetSin, 0, 0.5)
            }
            this.gameObject.transform.position.y = Math.sin(this.offsetSin) * 0.5 * -this.jumpHight + this.startPosition;
        }
    }
}