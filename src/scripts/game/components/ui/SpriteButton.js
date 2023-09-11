import BaseButton from "./BaseButton";
import UIUtils from "../../utils/UIUtils";

export default class SpriteButton extends BaseButton {
    constructor(texture =  UIUtils.baseButtonTexture+'_0006', width = 100, height = 150) {
        super(texture, width, height)
        this.setColors();
    }
    addShape(texture, width, height) {
        this.safeShape = new PIXI.Sprite.from(texture);
        this.addChild(this.safeShape);
        this.safeShape.width = width
        this.safeShape.height = height
    }
    setColors(base = 0xFFFFFF, over = 0xFF0000, baseText = 0, overText = 0xFFFFFF) {
        this.baseColor = base
        this.overColor = over

        this.baseColorText = baseText
        this.overColorText = overText

        this.tint = this.baseColor;
        this.textTint = this.baseColorText;
    }
    over() {
        super.over();
        this.tint = this.overColor;
        this.textTint = this.overColorText;
    }
    out() {
        super.out();
        this.tint = this.baseColor;
        this.textTint = this.baseColorText;
    }
}