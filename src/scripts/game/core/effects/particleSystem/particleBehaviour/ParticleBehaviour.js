export default class ParticleBehaviour {
    constructor() {

        this.property = 'alpha';
        this.type = 'sprite'

        this.time = 3;
        this.delay = 0;

        this.startValue = 0;
        this.endValue = 1;

        this.currentTime = 0;
        this.currentValue = 0;

        this.normalValue = 0;

        this.anchor = { x: 0.5, y: 0.5 }

        this.autoKill = false;
        this.shouldKill = false;

        this.delay = 0;

        this.tween = 'easeOutCubic';
    }
    reset() {
        this.currentTime = 0;
        this.autoKill = false;
        this.shouldKill = false;
    }
    build(params) {
        this.delay = ParticleBehaviour.findValue(params.delay);
        if (!this.delay) {
            this.delay = 0;
        }
    }
    update(delta) {
        if (this.currentTime >= this.time) {
            if (this.autoKill) {
                this.shouldKill = true;
            }
            return;
        }
        this.normalValue = ParticleBehaviour[this.tween](this.currentTime / this.time, 0, 1, 1);

        if (typeof this.currentValue === 'number') {
            this.currentValue = this.normalValue * (this.endValue - this.startValue) + this.startValue;
        }

        if (this.delay <= 0) {
            this.currentTime += delta;
        } else {
            this.delay -= delta;
        }


    }


    static linearTween(t, b, c, d) {
        return c * t / d + b;
    }
    static easeOutCubic(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    }
    static easeInExpo(t, b, c, d) {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    }

    static easeInCirc(t, b, c, d) {
        t /= d;
        return -c * (Math.sqrt(1 - t * t) - 1) + b;
    }

    static findValue(data) {
        if (Array.isArray(data)) {
            if (data.length == 1) {
                return data[0];
            }
            if (typeof data[0] === 'string' || data[0] instanceof String) {
                return data[Math.floor(Math.random() * data.length)]
            } else {
                return Math.random() * ([1] - data[0]) + data[0];
            }
        }
        return data;
    }
}