import * as PIXI from 'pixi.js';

import UIUtils from '../../utils/UIUtils';

export default class CardInfo extends PIXI.Container {
    constructor(texture =  UIUtils.baseButtonTexture+'_0007', width = 100, height = 150) {
        super();

        this.cardBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.addChild(this.cardBackground);
        this.cardBackground.width = width;
        this.cardBackground.height = height;

        this.pivot.x = -width/2;
        this.pivot.y = height;
        
    }
}