import * as PIXI from 'pixi.js';
import * as signals from 'signals';

import TweenLite from 'gsap';
import utils from '../../utils';
import UIButton1 from './UIButton1';

export default class UIButton2 extends UIButton1 {
    constructor(color, icon, iconColor = 0xFFFFFF, width = 65, height = 65, texture = 'square-pattern1') {
        super(color, icon, iconColor, width, height, texture);
    }

    build(color, icon, iconColor = 0xFFFFFF, width = 65, height = 65, texture = 'square-pattern1') {
        this.w = width;
        this.h = height;

        this.mainContainer = new PIXI.Container();
        //this.backShape = PIXI.Sprite.fromImage(

        if (!icon) {
            this.icon = new PIXI.Sprite();

        } else {
            //console.log(typeof (icon))
            if (icon instanceof PIXI.RenderTexture ||
                icon instanceof PIXI.Texture) {
                this.icon = new PIXI.Sprite();
                this.icon.texture = icon;
            } else {

                this.icon = PIXI.Sprite.from(icon);
            }
        }
        this.icon.tint = iconColor;
       
       this.backShape = new PIXI.Sprite.from(texture)
       this.backShape.scale.set(width /this.backShape.width,height / this.backShape.height)

        this.backShape.anchor.set(0.5);
        this.icon.anchor.set(0.5);


        this.updateIconScale();
        this.mainContainer.addChild(this.backShape);
        this.mainContainer.addChild(this.icon);
        this.addChild(this.mainContainer);

        this.onClick = new signals.Signal()

        this.on('touchstart', this.touchStart.bind(this));
        this.on('touchend', this.click.bind(this));
        this.interactive = true;
        this.buttonMode = true;
    }
    addCenterLabel(label, color = 0xFFFFFF, fit = 0) {
        this.buttonLabel = new PIXI.Text(label, LABELS.LABEL1);
        this.buttonLabel.style.fontSize = 24
        if(fit){
            this.buttonLabel.scale.set(this.backShape.width / this.buttonLabel.width * fit)
        }
        this.addChild(this.buttonLabel);
    }
}