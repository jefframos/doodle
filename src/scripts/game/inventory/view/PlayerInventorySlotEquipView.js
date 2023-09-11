import * as PIXI from 'pixi.js';

import UIList from '../../ui/uiElements/UIList';
import Utils from '../../core/utils/Utils';
import config from '../../../config';

export default class PlayerInventorySlotEquipView extends PIXI.Container {
    constructor() {
        super()



        this.cardBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(config.assets.bars.background), 20, 20, 20, 20);
        this.addChild(this.cardBackground);
        this.cardBackground.width = 30
        this.cardBackground.height = 30

        this.cardImage = new PIXI.Sprite();

        this.addChild(this.cardImage);
        this.cardImage.anchor.set(0.5)
        this.cardImage.x = this.cardBackground.width / 2
        this.cardImage.y = this.cardBackground.height / 2

        // this.zero = new PIXI.Graphics().beginFill(0).drawCircle(0, 0, 20)
        // this.addChild(this.zero)

        this.text = new PIXI.Text('', window.LABELS.LABEL1)
        this.addChild(this.text)
        this.text.style.fontSize = 14
        this.text.anchor.set(0, 0.5)
        this.text.x = this.cardBackground.width + 10
        this.text.y = this.cardBackground.height / 2;

    }

    registerItem(entity, isMaster) {
        this.cardImage.texture = PIXI.Texture.from(entity.entityData.icon)
        this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, 15))
        //this.text.text = weaponData.name
        if(isMaster){
            this.cardBackground.texture = PIXI.Texture.from(config.assets.bars.extra)
        }else{
            this.cardBackground.texture = PIXI.Texture.from(config.assets.bars.primary)
        }
    }

}