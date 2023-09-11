import ParticleBehaviour from "./ParticleBehaviour";

export default class ColorBehaviour extends ParticleBehaviour {
    constructor(time) {
        super();

        this.property = 'tint';
        this.type = 'sprite'

        this.time = time;
        this.startValue = 1;
        this.endValue = 0;

        this.currentRGB = { r: 0, g: 0, b: 0 }
    }
    build(params) {
        super.build(params);
        this.startValue = this.toRGB(ParticleBehaviour.findValue(params.startValue));
        this.endValue = this.toRGB(ParticleBehaviour.findValue(params.endValue));
        this.time = ParticleBehaviour.findValue(params.time);
        this.currentValue = this.rgbToColor(this.startValue.r, this.startValue.g, this.startValue.b);
    }
    update(delta) {
        super.update(delta);

        this.currentRGB.r = Math.floor(this.normalValue * (this.endValue.r - this.startValue.r) + this.startValue.r);
        this.currentRGB.g = Math.floor(this.normalValue * (this.endValue.g - this.startValue.g) + this.startValue.g);
        this.currentRGB.b = Math.floor(this.normalValue * (this.endValue.b - this.startValue.b) + this.startValue.b);

        this.currentValue = this.rgbToColor(this.currentRGB.r, this.currentRGB.g, this.currentRGB.b);
    }

    toRGB(rgb) {
        var r = rgb >> 16 & 0xFF;
        var g = rgb >> 8 & 0xFF;
        var b = rgb & 0xFF;
        return {
            r: r,
            g: g,
            b: b
        };
    }
    rgbToColor(r, g, b) {
        return r << 16 | g << 8 | b;
    }
}