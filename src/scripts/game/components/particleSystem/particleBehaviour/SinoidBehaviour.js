import ParticleBehaviour from "./ParticleBehaviour";

export default class SinoidBehaviour extends ParticleBehaviour {
    constructor() {
        super();
        this.property = 'velocityOffsetX';
        this.type = 'descriptor'

        this.angle = Math.random() * Math.PI * 2;
    }

    build(params) {
        super.build(params);
        this.speed = ParticleBehaviour.findValue(params.speed) | 1;
        this.length = ParticleBehaviour.findValue(params.length) | 0.1;
    }

    reset() {
        this.angle = Math.random() * Math.PI * 2;
    }

    update(delta) {

        this.angle += delta * this.speed;
        this.currentValue = Math.sin(this.angle) * this.length;
    }
}