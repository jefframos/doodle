import * as PIXI from 'pixi.js';

import InteractableView from '../../view/card/InteractableView';
import UIUtils from '../../utils/UIUtils';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class GridInfoView extends PIXI.Container {
    constructor(texture =  UIUtils.baseButtonTexture+'_0006', width = 115, height = 150) {
        super()


        this.cardContainer = new PIXI.Container();
        this.addChild(this.cardContainer);    

        this.cardBackground = new PIXI.Sprite.from('new-card0001');
        this.cardContainer.addChild(this.cardBackground);
        this.cardBackground.width = width
        this.cardBackground.height = height
        this.cardBackground.tint = 0;


        this.label = new PIXI.Text('', window.LABELS.LABEL1)
        this.cardContainer.addChild(this.label);
        this.label.style.strokeThickness = 0
        this.label.style.wordWrap = true
        this.label.style.wordWrapWidth = width * 0.7
        this.label.style.fontSize = 14
        this.label.anchor.set(0.5,0)
        this.label.x = width / 2
        this.label.y = 30     

        this.cardContainer.x = -width / 2
        this.cardContainer.pivot.y = height
    }

    setData(cardData) {    
        this.label.text = cardData.entityData.name
    }
    update(delta) {
        
    }
}