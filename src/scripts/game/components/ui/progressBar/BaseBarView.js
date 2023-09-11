import * as PIXI from 'pixi.js';

import Color from '../../../core/utils/Color';
import Utils from '../../../core/utils/Utils';

export default class BaseBarView extends PIXI.Container {
    constructor() {
        super()

        this.barContainer = new PIXI.Container();
        this.addChild(this.barContainer)

        this.backBar = new PIXI.NineSlicePlane(PIXI.Texture.from('tile'), 5, 5, 5, 5);
        this.backBar.width = 50
        this.backBar.height = 10
        this.backBar.tint = 0x272822;
        this.barContainer.addChild(this.backBar);

        this.fillBar = new PIXI.NineSlicePlane(PIXI.Texture.from('tile'), 5, 5, 5, 5);
        this.fillBar.width = 50
        this.fillBar.height = 10
        this.barContainer.addChild(this.fillBar);
    }
    setColors(startColor, endColor) {
        this.startValue = Color.toRGB(startColor);
        this.endValue = Color.toRGB(endColor);
        this.currentRGB = { r: this.startValue.r, g: this.startValue.g, b: this.startValue.b }
        this.fillBar.tint = Color.rgbToColor(this.startValue);
    }
    build(width, height, border) {
        this.maxWidth = width
        this.maxHeight = height

        this.backBar.width = width + border * 2
        this.backBar.height = height + border * 2

        this.backBar.x = -border
        this.backBar.y = -border

        this.fillBar.width = width
        this.fillBar.height = height

    }

    rebuild(width, height, border) {
        this.build(width, height, border);
        this.forceUpdateNormal(this.barNormal)
    }
    forceUpdateNormal(value) {
        this.barNormal = value;
        Color.colorLerp(this.currentRGB, this.endValue, this.startValue, this.barNormal);
        this.fillBar.width = this.maxWidth * this.barNormal;
        this.fillBar.tint = Color.rgbToColor(this.currentRGB);
    }
    updateNormal(value) {
        this.barNormal = value;
    }
    update(delta) {

        Color.colorLerp(this.currentRGB, this.endValue, this.startValue, this.barNormal);
        this.fillBar.width = Utils.lerp(this.fillBar.width, this.maxWidth * this.barNormal, 0.5);
        this.fillBar.tint = Color.rgbToColor(this.currentRGB);

    }
    set fillTint(value) {
        this.fillBar.tint = value;
    }
}