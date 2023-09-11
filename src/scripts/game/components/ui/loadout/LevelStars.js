import * as PIXI from 'pixi.js';

import UIList from '../../../ui/uiElements/UIList';

export default class LevelStars extends PIXI.Container {
    constructor() {
        super();

        this.starsSprites = [];

        this.starsList = new UIList();
        this.addChild(this.starsList)
        this.starsList.w = 100
        this.starsList.h = 30
        for (var i = 0; i < 5; i++) {
            const star = new PIXI.Sprite.from('blank-star');
            this.starsList.addElement(star, { fitHeight: 0.8 })
            this.starsSprites.push(star)
        }
        this.starsList.updateHorizontalList();

    }
    setLevel(level) {
        for (let index = 0; index < this.starsSprites.length; index++) {
            if (index <= level) {
                this.starsSprites[index].texture = PIXI.Texture.from('filled-star')
            } else {
                this.starsSprites[index].texture = PIXI.Texture.from('blank-star')
            }
        }
    }
    resize(width, height) {
        this.starsList.w = width;
        this.starsList.h = height;
        this.starsList.updateHorizontalList();

    }

}