import * as PIXI from 'pixi.js';

import Signals from 'signals';
import config from '../../../config';

export default class UIBar extends PIXI.Container
{
    constructor()
    {
        super();
        
        this.powerBarContainer = new PIXI.Container();
        this.powerBarBackground = new PIXI.Sprite.from('progressbar_frame');
        this.powerBarBarBg = new PIXI.Sprite.from('progressbar_bar');
        this.powerBarBar = new PIXI.Sprite.from('progressbar_bar');
        this.powerBarMask = new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, this.powerBarBar.width, this.powerBarBar.height);

        this.powerBarContainer.addChild(this.powerBarBackground)
        this.powerBarContainer.addChild(this.powerBarBarBg)
        this.powerBarContainer.addChild(this.powerBarBar)
        this.powerBarContainer.addChild(this.powerBarMask)
        this.powerBarBarBg.tint = 0;
        this.powerBarBarBg.alpha = 0.5
        this.powerBarBarBg.x = this.powerBarBackground.width / 2 - this.powerBarBarBg.width / 2
        this.powerBarBarBg.y = this.powerBarBackground.height / 2 - this.powerBarBarBg.height / 2

        this.powerBarBar.x = this.powerBarBackground.width / 2 - this.powerBarBar.width / 2
        this.powerBarBar.y = this.powerBarBackground.height / 2 - this.powerBarBar.height / 2

        this.powerBarMask.x = this.powerBarBar.x
        this.powerBarMask.y = this.powerBarBar.y
        this.powerBarBar.mask = this.powerBarMask;
        this.powerBarMask.scale.x = 0;
        this.updatePowerBar(0);

        // this.powerBarContainer.pivot.x = this.powerBarContainer.width / 2;
        // this.powerBarContainer.scale.set(this.powerBarContainer.height /this.h * 0.9)
        this.powerBarContainer.scale.set(config.width / this.powerBarContainer.width * 0.5)
        // this.powerBarContainer.x = config.width / 2;
        // this.powerBarContainer.y = this.marginTop
        this.addChild(this.powerBarContainer);

        this.pivot.x = this.powerBarBackground.width / 2;
        this.pivot.y = this.powerBarBackground.height / 2;
    }
    toggleColor(tggColor = 0xFFFF00){
        if(this.powerBarBar.tint == this.standardColor){
            this.powerBarBar.tint = tggColor;
        }else{
            this.powerBarBar.tint = this.standardColor;
        }
    }
    updatePowerBar(value, type = 0, force) {
        TweenLite.killTweensOf(this.powerBarMask.scale)
        TweenLite.to(this.powerBarMask.scale, force ? 0 : 0.5, {
            x: value
        })
        if (type == 0) {
            this.powerBarBar.tint = 0xFFFFFF;
        } else if (type == 1) {
            this.powerBarBar.tint = 0x00FFFF;
        } else if (type == 2) {
            this.powerBarBar.tint = 0xFF00FF;
        }
        this.standardColor = this.powerBarBar.tint;
    }
}