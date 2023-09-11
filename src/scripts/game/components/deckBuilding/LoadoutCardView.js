import * as PIXI from 'pixi.js';

import BaseButton from '../ui/BaseButton';
import InteractableView from '../../view/card/InteractableView';
import UIUtils from '../../utils/UIUtils';
import Utils from '../../core/utils/Utils';
import signals from 'signals';
import LevelStars from '../ui/loadout/LevelStars';

export default class LoadoutCardView extends PIXI.Container {
    constructor(texture = UIUtils.baseButtonTexture + '_0006', width = 115, height = 150) {
        super()
        this.baseWidth = width;
        this.baseHeight = height;
        this.safeShape = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.addChild(this.safeShape);
        this.safeShape.width = width
        this.safeShape.height = height
        this.safeShape.alpha = 0;

        this.cardData = null;
        this.empty = UIUtils.baseButtonTexture + '_0006';

        this.textures = [this.empty, UIUtils.baseButtonTexture + '_0001', UIUtils.baseButtonTexture + '_0002', UIUtils.baseButtonTexture + '_0003', UIUtils.baseButtonTexture + '_0004', UIUtils.baseButtonTexture + '_0005']

        this.cardContainer = new PIXI.Container();
        this.addChild(this.cardContainer);

        this.cardBorder = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.cardContainer.addChild(this.cardBorder);
        this.cardBorder.width = width
        this.cardBorder.height = height


        this.cardIconContainer = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.cardContainer.addChild(this.cardIconContainer);
        this.cardIconContainer.width = 40
        this.cardIconContainer.height = 40
        this.cardIconContainer.x = width - 20
        this.cardIconContainer.y = - 20
        this.cardIconContainer.visible = false;

        // this.levelLabel = UIUtils.getPrimaryLabel(1, {strokeThickness:0, dropShadow:false, fontSize:48, fill:0x4882D1});
        this.levelLabel = UIUtils.getPrimaryLabel(1, { strokeThickness: 3, dropShadow: false, fontSize: 48, fill: "#ffffff" });
        //this.cardContainer.addChild(this.levelLabel);

        this.levelLabel.anchor.set(1, 1)
        this.levelLabel.x = width - 14
        this.levelLabel.y = height - 14
        this.levelLabel.alpha = 0.3


        this.stars = new LevelStars();
        //this.cardContainer.addChild(this.stars);

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


        this.offset = { x: 0, y: 0 }

        // let zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0,0,10)
        // this.addChild(zero)

        this.cardContainer.x = -width / 2
        this.cardContainer.pivot.y = height

        this.safeShape.x = -width / 2
        this.safeShape.pivot.y = height

        this.state = 0;

        this.smallFontSize = 12
        this.largeFontSize = 16

        this.iconSize = 80;


        this.border = new PIXI.NineSlicePlane(PIXI.Texture.from(UIUtils.baseButtonTexture + '_0008'), 20, 20, 20, 20);
        this.addChild(this.border);
        this.border.width = width
        this.border.height = height
        this.unselected();


        this.valueLabel = UIUtils.getPrimaryLabel('', { strokeThickness: 3, dropShadow: false, fontSize: 24, fill: "#ffffff" });
        this.cardContainer.addChild(this.valueLabel);

        this.valueLabel.anchor.set(0.5, 1)
        this.valueLabel.x = width / 2
        this.valueLabel.y = height - 10

    }
    addWarning(){
        this.warning = new PIXI.Sprite.from(UIUtils.getIconUIIcon('warning'));
        this.warning.scale.set(Utils.scaleToFit(this.warning, 30))
        this.warning.anchor.set(0.5)
        this.warning.x = 20
        this.warning.y = 20
        this.addChild(this.warning)
        this.warning.visible = false;
    }
    remover() {
        this.levelLabel.text = '';
        this.cardImage.texture = PIXI.Texture.from(UIUtils.getIconUIIcon('close'));
    }
    resize(width, height) {
        this.baseWidth = width;
        this.baseHeight = height;

        this.safeShape.width = width
        this.safeShape.height = height

        this.border.width = width
        this.border.height = height

        this.cardBorder.width = width
        this.cardBorder.height = height

        this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, this.iconSize));

        this.cardImage.x = width / 2
        this.cardImage.y = height / 2

        this.levelLabel.x = width - 14
        this.levelLabel.y = height - 14
    }
    selected() {
        this.border.visible = true;
    }
    unselected() {
        this.border.visible = false;
    }
    setIconType(left = false) {
        if (left) {
            this.cardIconContainer.x = -20;
        }
        this.cardIconContainer.visible = true;

    }
    resetPivot() {
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
    hideLevelLabel() {
        this.levelLabel.visible = false;
        this.shouldHideLevelLabel = true;
    }
    showLevelLabel() {
        this.levelLabel.visible = true;
    }
    setIcon(texture, customIconSize) {
        if (typeof texture === 'string'){
            this.cardImage.texture = PIXI.Texture.from(texture);
        }else{
            this.cardImage.texture = PIXI.Texture.EMPTY;
            this.cardImage.addChild(texture)
        }
        //this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, customIconSize))
    }
    setData(cardData, level = 0, customIconSize = 80) {
        this.iconSize = customIconSize
        if (!cardData) {
            this.cardBorder.texture = PIXI.Texture.from(this.empty);
            this.cardImage.texture = PIXI.Texture.EMPTY;
            this.cardData = null;
            this.levelLabel.visible = false;
            return;
        }

        if (this.shouldHideLevelLabel) {
            this.levelLabel.visible = false;

        } else {
            this.levelLabel.visible = true;

        }
        this.cardData = cardData;
        this.level = level;
        // if(level <= 0){
        //     this.levelLabel.visible = false;
        // }else{
        // }
        this.levelLabel.text = level + 1
        let cardID = 0
        this.cardBorder.texture = PIXI.Texture.from(this.textures[cardID]);
        if (cardData) {
            this.updateTexture(cardData.entityData.icon)
            this.cardBorder.texture = PIXI.Texture.from(this.textures[level])
            this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, customIconSize))
        } else {
            this.cardImage.texture = PIXI.Texture.EMPTY;
            this.cardBorder.texture = PIXI.Texture.from(this.textures[level])
        }
    }

}