import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import UIList from './uiElements/UIList';
export default class InfoContainer extends UIList
{
    constructor()
    {
        super();
        this.onHide = new Signals();


        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.prizeDark.alpha = 0.25;
        this.prizeDark.interactive = true;
        this.prizeDark.buttonMode = true;
        this.prizeDark.on('mousedown', this.hideCallback.bind(this)).on('touchstart', this.hideCallback.bind(this));
        this.addChild(this.prizeDark);


        this.infoItens = [];
        this.infoList = new UIList();

        this.infoContainer = new PIXI.Container();
        let shipInfoSprite = new PIXI.Sprite.from('score_plinth');
        this.infoContainer.addChild(shipInfoSprite);
        shipInfoSprite.anchor.set(0.5);


        this.infoIcon = new PIXI.Sprite.from('back_button');
        this.infoList.elementsList.push(this.infoIcon);
        this.infoIcon.listScl = 0.2
        this.infoIcon.fitHeight = 0.75
        this.infoItens.push(this.infoIcon);
        this.infoList.addChild(this.infoIcon);

        this.addChild(this.infoContainer)
        this.infoScale = config.width / this.infoContainer.width * 0.75
        this.infoContainer.scale.set(this.infoScale)
        this.realSize = {
            w:this.infoContainer.width / this.infoScale,
            h:this.infoContainer.height/ this.infoScale,
        }
        // this.infoContainer.pivot.x = this.infoContainer.width / 2;
        this.infoContainer.pivot.y = this.infoContainer.height / 2;

        this.infoLabel = new PIXI.Text('Do you want change your cats by fish?',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '42px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.infoLabel.scaleContentMax = true;
        this.infoList.addChild(this.infoLabel);
        this.infoList.elementsList.push(this.infoLabel);
        this.infoItens.push(this.infoLabel);

        this.infoList.w = shipInfoSprite.width * 0.85
        this.infoList.h = shipInfoSprite.height * 0.85
        this.infoList.updateHorizontalList();
        this.infoList.x = -shipInfoSprite.width / 2 + shipInfoSprite.width * 0.075
        this.infoList.y = -shipInfoSprite.height / 2 + shipInfoSprite.height * 0.075

        this.infoContainer.addChild(this.infoList);


        this.infoContainer.x = 300;
        this.infoContainer.y = 300;
        this.hide();
    }
    update(delta)
    {
        if (this.visible)
        {
            this.starBackground.rotation += 0.05
        }
    }
    hideCallback()
    {
        this.onHide.dispatch();
        this.hide();
    }
    hide()
    {
        this.visible = false;
    }
    show(pos, icon = null, desc = 'lalala',  align = {x:0.5, y: 0.5})
    {

        SOUND_MANAGER.play('pickup_item2')
        this.infoList.elementsList = [];
        for (var i = 0; i < this.infoItens.length; i++) {
            this.infoList.elementsList.push(this.infoItens[i]);
        }
        if(this.containerThumb && this.containerThumb.parent){
            this.containerThumb.parent.removeChild(this.containerThumb)
        }
        if(icon instanceof PIXI.Container){
            this.containerThumb = icon
            this.infoIcon.addChild(this.containerThumb);
            this.infoIcon.visible = true;
            this.infoIcon.texture = null;
        }
        else if(!icon){
            for (var j = this.infoList.elementsList.length - 1; j >= 0; j--)
            {
                if (this.infoIcon == this.infoList.elementsList[j])
                {
                    this.infoList.elementsList.splice(j, 1)
                }
            }
            this.infoIcon.visible = false
        }else{
            this.infoIcon.texture = new PIXI.Texture.from(icon);
            this.infoIcon.visible = true
        }

        this.infoContainer.x = pos.x - align.x * this.realSize.w/2
        this.infoContainer.y = pos.y - align.y * this.realSize.h/2
        this.infoLabel.text = desc

        this.infoList.updateHorizontalList();
        // this.infoLabel.pivot.x = this.infoLabel.width / 2;
        // this.infoLabel.pivot.y = this.infoLabel.height / 2;

        // this.infoLabel.x = 

        this.infoContainer.scale.set(this.infoScale, 0);
        TweenLite.to(this.infoContainer.scale, 0.75,
        {
            x: this.infoScale,
            y: this.infoScale,
            ease: Elastic.easeOut
        });
        TweenLite.to(this.prizeDark, 0.5,
        {
            alpha: 0.75
        });
        this.visible = true;
    }
}