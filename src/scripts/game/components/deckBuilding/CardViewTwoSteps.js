import * as PIXI from 'pixi.js';

import BaseButton from '../ui/BaseButton';
import InteractableView from '../../view/card/InteractableView';
import UIUtils from '../../utils/UIUtils';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class CardViewTwoSteps extends PIXI.Container {
    constructor(texture = UIUtils.baseButtonTexture+'_0006', width = 115, height = 150) {
        super()
        this.baseWidth = width;
        this.baseHeight = height;
        this.safeShape = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.addChild(this.safeShape);
        this.safeShape.width = width
        this.safeShape.height = height
        this.safeShape.alpha = 0;

        this.cardData = null;

        this.textures = ['ingame-card0003']

        this.cardContainer = new PIXI.Container();
        this.addChild(this.cardContainer);

        this.cardBackground = new PIXI.Sprite.from('ingame-card0003');
        //this.cardContainer.addChild(this.cardBackground);
        //this.cardBackground.tint = 0x6794C7
        this.cardBackground.width = width
        this.cardBackground.height = height

        this.cardBorder = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 0, 120, 0, 120);
        this.cardContainer.addChild(this.cardBorder);
        this.cardBorder.width = width
        this.cardBorder.height = height*2

        this.cardImage = new PIXI.Sprite();

        this.cardContainer.addChild(this.cardImage);
        this.cardImage.anchor.set(0.5)
        // this.cardImage.scale.set(0.5)
        this.cardImage.x = width / 2
        this.cardImage.y = height / 2

        this.mouseOver = false;

        this.onCardClicked = new signals.Signal();
        this.onCardConfirmed = new signals.Signal();
        this.onStartDrag = new signals.Signal();
        this.onEndDrag = new signals.Signal();
        InteractableView.addMouseEnter(this.cardContainer, () => { this.mouseOver = true; })
        InteractableView.addMouseOut(this.cardContainer, () => { this.mouseOver = false; })
        InteractableView.addMouseClick(this.cardContainer, () => { this.onCardClicked.dispatch(this) })
        InteractableView.addMouseDown(this.cardContainer, () => {
            this.onStartDrag.dispatch(this)
        })

        this.cardDescriptionBackground = new PIXI.Sprite.from('tile');
        this.cardContainer.addChild(this.cardDescriptionBackground);
        this.cardDescriptionBackground.tint = 0x5F5259

        this.descriptionBox = new PIXI.NineSlicePlane(PIXI.Texture.from('description-box'), 18, 18, 18, 18);
        this.cardContainer.addChild(this.descriptionBox);
        this.descriptionBox.width = width + 20
        this.descriptionBox.height = 37
        this.descriptionBox.visible = false;

        //this.titleBox = new PIXI.NineSlicePlane(PIXI.Texture.from('title-1'), 50, 0, 50, 0);
        this.titleBox = new PIXI.NineSlicePlane(PIXI.Texture.from('grid1'), 50, 0, 50, 0);
        this.cardContainer.addChild(this.titleBox);
        this.titleBox.width = width + 20
        this.titleBox.height = 37
        this.titleBox.x = -10
        this.titleBox.y = 20



        this.labelTitle = new PIXI.Text('', window.LABELS.LABEL1)
        this.titleBox.addChild(this.labelTitle);
        this.labelTitle.style.fill = 0
        this.labelTitle.style.strokeThickness = 0
        this.labelTitle.style.wordWrap = true
        this.labelTitle.style.wordWrapWidth = width
        this.labelTitle.style.fontSize = 10
        this.labelTitle.anchor.set(0.5)
        this.labelTitle.y = 25/2

        this.offset = { x: 0, y: 0 }

        // let zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0,0,10)
        // this.addChild(zero)

        this.cardContainer.x = -width / 2
        this.cardContainer.pivot.y = height

        this.safeShape.x = -width / 2
        this.safeShape.pivot.y = height

        this.confirmCard = new BaseButton( UIUtils.baseButtonTexture+'_0001', 100, 50);
        this.addChild(this.confirmCard)
        this.confirmCard.pivot.x = this.confirmCard.safeShape.width
        UIUtils.addLabel(this.confirmCard, "Confirm", { strokeThickness: 0, fontSize: 18, fill: 0 })
        InteractableView.addMouseClick(this.confirmCard, () => { this.onCardConfirmed.dispatch(this) })


        this.cancelCard = new BaseButton( UIUtils.baseButtonTexture+'_0004', 100, 50);
        //this.addChild(this.cancelCard)

        this.state = 0;

       this.smallFontSize = 12
       this.largeFontSize = 16

    }
    resetPivot(){
        this.cardContainer.x = 0
        this.cardContainer.pivot.y = 0

        this.safeShape.x = 0
        this.safeShape.pivot.y = 0
    }
    highlight() {

        this.customWidth = 500;
        this.customHeight = 250;
        this.state = 1
    }
    unhighlight() {

        this.customWidth = this.baseWidth;
        this.customHeight = this.baseHeight;
        this.state = 0
    }
    updateTexture(textureID) {
        this.cardImage.texture = PIXI.Texture.from(textureID)
    }

    setData(cardData) {
        console.log(cardData)
        if (this.cardData == cardData) {
            return;
        }
        this.cardData = cardData;
        let cardID = 0
        this.cardBorder.texture = PIXI.Texture.from(this.textures[cardID]);
        this.updateTexture(cardData.entityData.icon)
        this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, 50))
        this.labelTitle.text = cardData.entityData.name

        if (this.cardData.entityData.description) {
            this.setDescription(this.cardData.entityData.description);
        }
    }
    setDescription(label) {
        if(this.labelDescription){
            this.labelDescription.text = label;
        }else{
            this.labelDescription = new PIXI.Text(label, window.LABELS.LABEL1)
            this.descriptionBox.addChild(this.labelDescription);
        }
        this.labelDescription.style.fill = 0xffffff
        this.labelDescription.style.strokeThickness = 1
        this.labelDescription.style.wordWrap = true
        this.labelDescription.style.fontSize = 12
        this.labelDescription.anchor.set(0.5, 0)
        this.labelDescription.x = 0
        this.labelDescription.y = 20

        this.descriptionBox.visible = true;
    }
    update(delta) {
        this.cardContainer.y = Utils.lerp(this.cardContainer.y, this.offset.y, 0.3);

        if (this.mouseOver && this.state != 1) {
            this.offset.y = -20
        } else {
            this.offset.y = 0
        }

        if (this.customWidth) {
            this.cardBorder.width = Utils.lerp(this.cardBorder.width, this.customWidth, 0.2);
            this.cardBorder.height = Utils.lerp(this.cardBorder.height, this.customHeight, 0.3);
            this.cardBorder.x = -this.cardBorder.width / 2 + this.baseWidth / 2

        }

        if (this.state == 1) {
            
            this.cardImage.x = Utils.lerp(this.cardImage.x, this.cardBorder.x + this.cardImage.width / 2 + 20, 0.2);
            this.cardImage.y = this.cardImage.height / 2 + 70
            this.labelTitle.style.fontSize = this.largeFontSize
        } else {

            this.cardImage.x = Utils.lerp(this.cardImage.x, this.cardBorder.width / 2, 0.2);
            this.labelTitle.style.fontSize = this.smallFontSize
            this.cardImage.y = this.cardBorder.height / 2

        }

        
        if (this.labelDescription) {
            this.labelDescription.style.wordWrapWidth = this.customWidth - 130
            

           
            this.descriptionBox.visible = this.state == 1
            if (this.state == 1) {
                this.labelDescription.alpha = Utils.lerp(this.labelDescription.alpha, 1, 0.2);
                this.labelDescription.scale.x = Utils.lerp(this.labelDescription.scale.x, 1, 0.15);
            } else {
                this.labelDescription.alpha = 0;
                this.labelDescription.scale.x = 0.1
            }

            this.descriptionBox.width = this.cardBorder.width - 100
            this.descriptionBox.height = this.labelDescription.height + 40
            this.descriptionBox.pivot.x = this.descriptionBox.width / 2
            this.descriptionBox.x = this.cardBorder.x + this.cardBorder.width / 2 + 30
            this.descriptionBox.y = 30
            this.labelDescription.x = (this.cardBorder.width - 100)/2
            
        }
        
        this.safeShape.pivot.y = this.cardBorder.height
        this.cardContainer.pivot.y = this.cardBorder.height
        
        this.margin = 20
        
        this.cardBackground.x =  this.cardBorder.x
        this.cardBackground.width =  this.cardBorder.width-10
        this.cardBackground.height =  this.cardBorder.height-10

        this.cardDescriptionBackground.width =  this.descriptionBox.width-10
        this.cardDescriptionBackground.height =  this.descriptionBox.height-10
        this.cardDescriptionBackground.x =  this.descriptionBox.x - this.descriptionBox.pivot.x + 5
        this.cardDescriptionBackground.y =  this.descriptionBox.y+5
        this.cardDescriptionBackground.visible = this.descriptionBox.visible;
        
        this.titleBox.width = this.cardBorder.width +22
        this.titleBox.pivot.x = this.titleBox.width / 2
        this.titleBox.x = this.cardBorder.x + this.cardBorder.width / 2
        this.labelTitle.x = this.titleBox.width / 2
        this.labelTitle.style.wordWrapWidth = this.cardBorder.width

        
        this.cancelCard.visible = this.confirmCard.visible = this.state == 1;
        this.cancelCard.x = -this.cardBorder.width / 2 + this.margin
        this.cancelCard.y = -this.cancelCard.height - this.margin

        this.confirmCard.x = this.cardBorder.width / 2 - this.margin
        this.confirmCard.y = -this.confirmCard.height - this.margin
    }
}