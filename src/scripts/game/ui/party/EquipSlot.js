import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class EquipSlot extends PIXI.Container {
    constructor(type = 'weapon') {
        super();
        this.type = type;
        let width = 60;

        this.slotSprite = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.from('smallButton'), 10, 10, 10, 10)
        this.slotSprite.width = width
        this.slotSprite.height = width
        //this.slotSprite.pivot.set(width / 2)
        this.addChild(this.slotSprite);
        this.label = new PIXI.Text('', window.LABELS.LABEL_STATS)

        this.label.style.fill = 0xFF0000
        this.addChild(this.label);
    }

    addEquip(equip) {
        this.label.text = equip;
    }
}