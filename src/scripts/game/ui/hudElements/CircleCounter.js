import * as PIXI from 'pixi.js';
import CircleMask from './CircleMask';
export default class CircleCounter extends PIXI.Container {
    constructor(maskRadius = 30, shapeRadius = 20) {
        super();

        this.circleMask = new CircleMask();

        this.addChild(this.circleMask);

        this.current = 0;
        this.max = 1;

        this.frontShape = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0, 0, shapeRadius);
        this.frontShape.alpha = 0.5
        this.maskedShape = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0, 0, maskRadius);
        this.addChild(this.maskedShape);
        //this.addChild(this.frontShape);

        this.maskedShape.mask = this.circleMask;

        this.update(0);
    }
    build(maskColor = 0x0084c9, frontColor = 0x0084c9) {
        this.maskedShape.tint = maskColor;
        this.frontShape.tint = frontColor;
    }
    update(value, force = false) {
        this.current = value;
        let ratio = this.current / this.max;

        this.circleMask.ratio = 1 - ratio

        //TweenLite.to(this.circleMask, force?0:0.5, {ratio: 1 - ratio, ease:Back.easeOut});
        // this.circleMask.ratio = 1 - ratio;
    }
}