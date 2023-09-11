import * as PIXI from 'pixi.js';

import InteractableView from '../../view/card/InteractableView';
import UIUtils from '../../utils/UIUtils';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class BaseButton extends PIXI.Container {
    constructor(texture =  UIUtils.baseButtonTexture+'_0006', width = 100, height = 150) {
        super()
        this.textOffset = {x:0, y:0}
        this.addShape(texture, width, height);
        this.addEvents()

        this.mainTexture = texture;

        this.swapTexture = null;
        this.isActive = false;

        this.buttonSound = 'pop';

    }
    setActiveTexture(texture) {
        this.activeTexture = texture;
    }
    updateBackTexture(tex){
        this.mainTexture = tex;
        this.safeShape.texture = PIXI.Texture.from(this.mainTexture)
    }
    setActive() {
        this.isActive = true;
        this.safeShape.texture = PIXI.Texture.from(this.activeTexture)
    }
    setDefault() {
        this.isActive = false;
        this.safeShape.texture = PIXI.Texture.from(this.mainTexture)
    }
    set tint(value) {
        this.safeShape.tint = value;
    }
    set textTint(value) {
        if (this.text) {
            this.text.style.fill = value;
        }
    }
    tintIcon(color){
        if(this.icon){
            this.icon.tint = color;
        }
    }
    resize(width, height) {
        if (width) {
            this.safeShape.width = width
        }
        if (height) {
            this.safeShape.height = height
        }
        this.hitArea = new PIXI.Rectangle(0, 0, this.safeShape.width, this.safeShape.height);

        
        if (this.text) {      
            this.text.x = this.safeShape.width / 2 + this.textOffset.x;
            this.text.y = this.safeShape.height / 2 + this.textOffset.y;
        }
        
        if (!this.icon) {
            return;
        }else{

            //this.icon.scale.set(Utils.scaleToFit(this.icon, height));
        }
        this.icon.x = this.safeShape.width / 2 + this.iconOffset.x;
        this.icon.y = this.safeShape.height / 2 + this.iconOffset.y;

        
        if (this.text) {
            this.text.y += this.icon.height / 2 + 5
        }
    }
    resizeIcon(height){
        this.icon.scale.set(Utils.scaleToFit(this.icon, height));
    }
    simulateClick() {
        this.out();
        this.onButtonClicked.dispatch(this)
    }
    setPadding(left = 20, top = 20, right = 20, bottom = 20){
        this.safeShape.leftWidth = left;
        this.safeShape.topHeight = top;
        this.safeShape.rightWidth = right;
        this.safeShape.bottomHeight = bottom;
    }
    addShape(texture, width, height) {
        this.mainTexture = texture;
        const tex = texture ? PIXI.Texture.from(texture): PIXI.Texture.EMPTY
        if (this.safeShape) {
            this.safeShape.texture = tex
        } else {
            this.safeShape = new PIXI.NineSlicePlane(tex, 25, 25, 25, 25);
            this.addChild(this.safeShape);
        }
        this.safeShape.width = width
        this.safeShape.height = height
        this.hitArea = new PIXI.Rectangle(0, 0, width, height);
    }
    addEvents() {
        this.mouseOver = false;

        this.onButtonClicked = new signals.Signal();
        InteractableView.addMouseEnter(this, () => { this.over(); })
        InteractableView.addMouseOut(this, () => { this.out(); })
        InteractableView.addMouseClick(this, () => {
            this.out();
            SOUND_MANAGER.play(this.buttonSound, 0.2)
            this.onButtonClicked.dispatch(this)
        })
    }
    fitLabel(scale = 0.8){

        let newScale = this.safeShape.height / this.text.height * scale
  
        this.text.scale.set(Math.min(newScale, scale))
    }
    addLabelOnCenter(text, offset = { x: 0, y: 0 }) {
        this.textOffset = offset
        this.text = text;
        this.text.anchor.set(0.5);
        this.text.x = this.safeShape.width / 2 + offset.x;
        this.text.y = this.safeShape.height / 2 + offset.y;
        this.addChild(this.text);
    }
    addIcon(icon, height = 0, anchor = { x: 0.5, y: 0.5 }, offset = { x: 0, y: 0 }) {
        this.cleanUp();
        this.iconOffset = offset;
        if (this.icon) {
            this.icon.texture = PIXI.Texture.from(icon)
        } else {
            this.icon = new PIXI.Sprite.from(icon);
        }
        this.icon.interactive = false;

        if (height > 0) {
            this.icon.scale.set(Utils.scaleToFit(this.icon, height));
        }
        this.icon.anchor.x = anchor.x
        this.icon.anchor.y = anchor.y
        this.icon.x = this.safeShape.width / 2 + this.iconOffset.x;
        this.icon.y = this.safeShape.height / 2 + this.iconOffset.y;
        this.addChild(this.icon);
    }

    addIconContainer(iconContainer, height = 0, pivot = { x: 0.5, y: 0.5 }, offset = { x: 0, y: 0 }) {
        this.cleanUp();
        this.iconContainer = iconContainer;
        this.iconContainer.interactive = false;
        if (height > 0) {
            this.iconContainer.scale.set(Utils.scaleToFit(this.iconContainer, height));
        }
        this.iconContainer.pivot.x = pivot.x
        this.iconContainer.pivot.y = pivot.y
        this.iconContainer.x = this.safeShape.width / 2 + offset.x;
        this.iconContainer.y = this.safeShape.height / 2 + offset.y;
        this.addChild(this.iconContainer);
    }
    cleanUp() {
        if (this.iconContainer) {
            this.iconContainer.parent.removeChild(this.iconContainer);
            this.iconContainer = null;
        }
        if (this.icon) {
            this.icon.texture = PIXI.Texture.EMPTY;
        }
    }
    over() {
        this.mouseOver = true;

        if (this.isActive) {
            return;
        }
        if (this.swapTexture) {

            this.safeShape.texture = PIXI.Texture.from(this.swapTexture)
        }

    }
    out() {
        this.mouseOver = false;

        if (this.isActive) {
            return;
        }
        if (this.swapTexture) {

            this.safeShape.texture = PIXI.Texture.from(this.mainTexture)
        }
    }

}