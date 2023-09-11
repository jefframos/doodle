import * as PIXI from 'pixi.js';

import InteractableView from '../../../view/card/InteractableView';
import UIList from '../../../ui/uiElements/UIList';
import Utils from '../../../core/utils/Utils';
import signals from 'signals';

export default class GridSlotView extends PIXI.Container {
    constructor(width = 110, height = 112) {
        super()

        this.slotTexture = 'tier-0-card_1'
        this.slotTrashTexture = 'new-slot0004'
        this.textures = ['tier-0-card_1', 'tier-1-card_1', 'tier-2-card_1', 'tier-3-card_1', 'tier-4-card_1']


        this.container = new PIXI.Container();
        this.addChild(this.container)

        this.cardBackground = new PIXI.Sprite.from(this.slotTexture)//new PIXI.NineSlicePlane(PIXI.Texture.from(this.slotTexture), 20, 20, 20, 20);
        this.container.addChild(this.cardBackground);
        this.cardBackground.width = width
        this.cardBackground.height = height

        this.backAlpha = 1//0.5
        this.cardBackground.alpha =this.backAlpha

        this.onMouseEnter = new signals.Signal();
        this.onMouseOut = new signals.Signal();


        this.levelList = new UIList();
        this.levelList.w = width;
        this.levelList.h = 20;
        this.levelList.y = 5;
        this.container.addChild(this.levelList);


        this.cardImage = new PIXI.Sprite();
        this.container.addChild(this.cardImage);
        this.cardImage.anchor.set(0.5)
        this.cardImage.x = width / 2
        this.cardImage.y = height / 2 - 5

        this.text = new PIXI.Text('')
        //this.container.addChild(this.text)

    }
    setAsTrash(){
        this.cardBackground.texture = PIXI.Texture.from(this.slotTrashTexture)
        this.isTrash = true;
    }
    holding() {
        this.cardImage.alpha = 0.5
    }
    release() {
        this.cardImage.alpha = 1
    }
    mouseOver() {
        this.cardBackground.alpha = 0.8
    }
    mouseOut() {
        this.cardBackground.alpha =this.backAlpha

    }
    wipe() {
        this.cardData = null;
        this.cardImage.texture = null
        this.text.text = "";
        this.levelList.removeAllElements();
        this.cardBackground.texture = PIXI.Texture.from(this.slotTexture)
    }
    updateLevelStars(total) {
        this.levelList.removeAllElements();
        for (let index = 0; index < total; index++) {
            let sprite = new PIXI.Sprite.from('gold-icon');
            sprite.fitHeight = 1
            this.levelList.addElement(sprite)
        }
        this.levelList.updateHorizontalList();
    }
    updateTexture(textureID) {
        this.cardImage.texture = PIXI.Texture.from(textureID)
        this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, 80))
    }

    setData(cardData) {
        this.cardData = cardData.item;
        if (this.cardData) {
            this.updateTexture(this.cardData.entityData.icon)
            this.text.text = "Level " + (cardData.level + 1)
        }
        this.cardBackground.texture = PIXI.Texture.from('tier-1-card_1');
        this.updateLevelStars(cardData.level + 1);
    }
    update() {
        // this.text.text = Math.floor(this.worldTransform.tx)+'\n'+this.x+'\n'+ Math.floor(this.worldTransform.tx / this.worldTransform.a)
        // this.text.style.fontSize = 14
        // this.text.style.fill = 0xFFFFFF
    }
}