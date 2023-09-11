import * as PIXI from 'pixi.js';
export default class TextBox extends PIXI.Container {
    constructor(padding = 10, tex = config.assets.panel.tertiary, fontSize = 18) {
        super();
        this.padding = padding
        this.background = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.from(tex), 35 / 2, 35 / 2, 35 / 2, 35 / 2)
        this.addChild(this.background)
        this.label = new PIXI.Text('Thanks for helping us\nChoose your prize', LABELS.LABEL1);
        this.label.style.fontSize = fontSize
        // this.label.x = this.padding
        // this.label.y = this.padding
        this.label.anchor.set(0.5)
        this.addChild(this.label)
    }

    updateText(text) {
        this.label.text = text
        this.background.width = this.label.width + this.padding * 2 
        this.background.height = this.label.height + this.padding * 2
        this.background.pivot.set(this.background.width / 2, this.background.height / 2)
    }

    addIcon(tex, align = 1, pad = 10) {
        if (!this.icon) {
            this.icon = new PIXI.Sprite.from(tex)
        } else {
            this.icon.texture = new PIXI.Texture.from(tex)
        }
        this.icon.anchor.set(0.5)
        this.icon.scale.set((this.background.height - pad * 2) / this.icon.height)

        this.label.x = -this.icon.width / 2

        this.icon.x = this.label.x + this.label.width / 2 + pad + this.icon.width / 2

        this.background.width = this.label.width + this.padding * 2 + this.icon.width + pad
        this.background.height = this.label.height + this.padding * 2
        this.background.pivot.set(this.background.width / 2, this.background.height / 2)

        this.addChild(this.icon)
    }

}