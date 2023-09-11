import * as PIXI from 'pixi.js';

import Utils from '../../core/utils/Utils';

export default class PlayerActiveEquipmentOnHud extends PIXI.Container {
    constructor() {
        super();
        this.icon = new PIXI.Sprite();
        this.icon.anchor.set(0.5)
        this.levelLabel = new PIXI.Text("", window.LABELS.LABEL1)
        this.levelLabel.anchor.set(0.5)
        this.levelLabel.style.fontSize = 20

        this.background = new PIXI.Sprite.from('tile')
        this.background.alpha = 0;
        this.addChild(this.background)
        this.addChild(this.icon)
        this.addChild(this.levelLabel)
    }
    setItem(item, size = 55) {
        this.icon.texture = PIXI.Texture.from(item.entityData.icon)
        this.icon.scale.set(Utils.scaleToFit(this.icon, size))
       // this.icon.rotation = Math.PI / 4
        this.icon.x = size/2
        this.icon.y = size/2

        this.background.width = size
        this.background.height = size
    }
    setLevel(level = 0) {
        this.levelLabel.text = level +1;
        //this.levelLabel.text = level ? level+1 : '';
        this.levelLabel.x = this.background.width- 10
        this.levelLabel.y = this.background.height - 10
    }
}
