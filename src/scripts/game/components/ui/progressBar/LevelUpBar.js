import * as PIXI from 'pixi.js';

import Color from '../../../core/utils/Color';
import Utils from '../../../core/utils/Utils';

export default class LevelUpBar extends PIXI.Container {
    constructor() {
        super()

        this.barContainer = new PIXI.Container();
        this.addChild(this.barContainer)

        this.backBar = new PIXI.NineSlicePlane(PIXI.Texture.from('backlevelbar'), 5, 0, 5, 0);
        this.backBar.width = 50
        this.backBar.height = 10
        this.barContainer.addChild(this.backBar);

        this.fillBar = new PIXI.NineSlicePlane(PIXI.Texture.from('level-glow'), 20, 10, 50, 10);
        this.fillBar.width = 50
        this.fillBar.height = 50
        this.barContainer.addChild(this.fillBar);
        
        this.tiledBubbles = new PIXI.TilingSprite(PIXI.Texture.from('bubbles0001'),52,35)
        this.barContainer.addChild(this.tiledBubbles);
        
        this.cap1 = new PIXI.Sprite.from('energy-cap-1')
        this.cap2 = new PIXI.Sprite.from('energy-cap-1')
        this.cap1.anchor.set(0.5)
        this.cap2.anchor.set(0.5)
        this.cap1.y = 25
        this.cap2.y = 25
        //this.barContainer.addChild(this.cap1);
        this.barContainer.addChild(this.cap2);

        this.tiledBubbles.x = 200
        this.tiledBubbles.y = 200

        this.barContainer.y = 5

        this.bubbleFrameTimer = 0;
        this.bubbleFrame = 1;
    }
    build(width) {
        this.maxWidth = width
        this.maxHeight = 50

        this.backBar.width = width - 60
        this.backBar.x = 30
        this.backBar.y = 5
        this.backBar.height = 40 

        this.cap1.x = 25
        this.cap2.x = width - 25

        this.cap2.scale.x = -1

        this.fillBar.width = 50
        this.fillBar.height = 66
        this.fillBar.y = -6
        

    }

    rebuild(width, height, border) {
        this.build(width, height, border);
        this.forceUpdateNormal(this.barNormal)
    }
    forceUpdateNormal(value) {
        this.barNormal = value;
        
    }
    updateNormal(value) {
        this.barNormal = value;
    }
    update(delta) {

        this.fillBar.width = Utils.lerp(this.fillBar.width, Math.max(70, this.maxWidth * this.barNormal), 1);

        this.tiledBubbles.x = this.fillBar.x + 25
        this.tiledBubbles.y = this.fillBar.y + 18
        this.tiledBubbles.width = this.fillBar.width - 50
        this.bubbleFrameTimer += delta;
        if(this.bubbleFrameTimer >= 0.5){
            this.bubbleFrameTimer = 0;
            this.bubbleFrame ++;
            this.bubbleFrame %= 5
            if(this.bubbleFrame == 0) this.bubbleFrame++
            this.tiledBubbles.texture = PIXI.Texture.from('bubbles000'+this.bubbleFrame)
        }

        
    }
    set fillTint(value) {
        this.fillBar.tint = value;
    }
}