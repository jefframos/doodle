import BaseComponent from '../core/gameObject/BaseComponent';
import Eugine from '../core/Eugine';
import signals from 'signals';

export default class ZombieWalk extends BaseComponent {
    constructor() {
        super();

        this.offsetSin = Math.random() * Math.PI * 2;
        this.speed = 5;
    }
    enable() {
        super.enable();
        this.offsetSin = Math.random() * Math.PI * 2;
    }
    update(delta) {        
        delta *= Eugine.PhysicsTimeScale;

        
        
        if (this.gameObject.physics.magnitude > 0) {
            this.offsetSin += delta * this.speed;
            this.offsetSin %= Math.PI
        } else {
            this.offsetSin = utils.lerp(this.offsetSin, 0, 0.5)
        }
        this.gameObject.speedAdjust = Math.abs(Math.sin(this.offsetSin))
        
    }
}