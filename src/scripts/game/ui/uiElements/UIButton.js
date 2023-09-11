import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class UIButton extends PIXI.Container
{
    constructor(texture, scl = 0.75)
    {
        super();

        this.back = new PIXI.Sprite(PIXI.Texture.from('button_off'));
        this.back.anchor.set(0.5)

        this.icon = new PIXI.Sprite(PIXI.Texture.from(texture));
        this.icon.anchor.set(0.5)
        if(scl){
            this.icon.scale.set(this.back.width / this.icon.width * scl)
        }

        this.addChild(this.back);
        this.addChild(this.icon);

        this.on('mouseup', this.mouseUp.bind(this))
            .on('touchend', this.mouseUp.bind(this))
            .on('pointerout', this.mouseUp.bind(this))
            .on('pointerupoutside', this.mouseUp.bind(this))
            .on('mouseupoutside', this.mouseUp.bind(this));
        this.on('mousedown', this.mouseDown.bind(this)).on('touchstart', this.mouseDown.bind(this));

        this.iconPos = this.icon.y;
    }
    mouseDown()
    {
        this.back.texture = PIXI.Texture.from('button_on');
        this.icon.y = this.iconPos + 10;
        SOUND_MANAGER.play('button_click')
    }
    mouseUp()
    {
        this.back.texture = PIXI.Texture.from('button_off');
        this.icon.y = this.iconPos
    }
    zeroAnchor()
    {
        this.back.anchor.set(0)
        this.icon.position.set(this.back.width / 2, this.back.height / 2)
        this.iconPos = this.icon.y;
    }
    customAnchor(x,y)
    {
        this.back.anchor.set(x,y)
        this.icon.position.set(this.back.width / 2 - this.back.width * this.back.anchor.x, this.back.height / 2 - this.back.height * this.back.anchor.y)
        this.iconPos = this.icon.y;
    }
    changeTexture(tex)
    {
        this.icon.texture = PIXI.Texture.from(tex);
    }
}