import * as PIXI from 'pixi.js';

import AttributeDrawer from '../ui/loadout/AttributeDrawer';
import BaseButton from '../ui/BaseButton';
import CardAttributeDrawer from './CardAttributeDrawer';
import CardPlacementSystem from './CardPlacementSystem';
import EntityBuilder from '../../screen/EntityBuilder';
import EntityData from '../../data/EntityData';
import GameStaticData from '../../data/GameStaticData';
import InteractableView from '../../view/card/InteractableView';
import LevelStars from '../ui/loadout/LevelStars';
import StatsModifier from '../StatsModifier';
import UIList from '../../ui/uiElements/UIList';
import UIUtils from '../../utils/UIUtils';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class CardView extends PIXI.Container {
    constructor(texture = UIUtils.baseButtonTexture + '_0006', width = 125, height = 150) {
        super()
        this.baseWidth = width;
        this.baseHeight = height;
        this.safeShape = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 20, 20, 20, 20);
        this.addChild(this.safeShape);
        this.safeShape.width = width
        this.safeShape.height = height
        this.safeShape.alpha = 0;

        this.cardData = null;

        this.textures = ['ingame-card0001', 'ingame-card0002', 'ingame-card0003', 'ingame-card0004', 'ingame-card0005', 'ingame-card0006']

        this.fullContnainer = new PIXI.Container();
        this.addChild(this.fullContnainer);

        this.cardContentContnainer = new PIXI.Container();
        this.fullContnainer.addChild(this.cardContentContnainer);

        this.cardContainer = new PIXI.Container();
        this.fullContnainer.addChild(this.cardContainer);

        this.cardBackground = new PIXI.Sprite.from('ingame-card0003');
        this.cardBackground.width = width
        this.cardBackground.height = height

        this.cardBorder = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 0, 250, 0, 180);
        this.cardContentContnainer.addChild(this.cardBorder);
        this.cardBorder.width = width
        this.cardBorder.height = height


        this.cardIconContainer = new PIXI.Sprite.from('item_card_container')
        this.cardContainer.addChild(this.cardIconContainer);
        this.cardIconContainer.anchor.set(0.5);
        this.cardIconContainer.scale.set(Utils.scaleToFit(this.cardIconContainer, 100))

        this.cardImage = new PIXI.Sprite();
        this.cardIconContainer.addChild(this.cardImage);
        this.cardImage.anchor.set(0.5)

        this.mouseOver = false;

        this.onCardClicked = new signals.Signal();
        this.onCardConfirmed = new signals.Signal();
        this.onStartDrag = new signals.Signal();
        this.onEndDrag = new signals.Signal();
        InteractableView.addMouseEnter(this.cardContentContnainer, () => { this.mouseOver = true; })
        InteractableView.addMouseOut(this.cardContentContnainer, () => { this.mouseOver = false; })
        InteractableView.addMouseClick(this.cardContentContnainer, () => { 
            SOUND_MANAGER.play('dropTile', 0.5)
            this.onCardConfirmed.dispatch(this) })
        InteractableView.addMouseDown(this.cardContentContnainer, () => {
            this.onStartDrag.dispatch(this)
        })

        //this.titleBox = new PIXI.NineSlicePlane(PIXI.Texture.from('title-1'), 50, 0, 50, 0);
        this.titleBox = new PIXI.NineSlicePlane(PIXI.Texture.from('grid1'), 50, 0, 50, 0);
        this.cardContentContnainer.addChild(this.titleBox);
        this.titleBox.width = width + 10
        this.titleBox.height = 37
        this.titleBox.x = -10
        this.titleBox.y = 20



        this.labelTitle = new PIXI.Text('', window.LABELS.LABEL1)
        this.titleBox.addChild(this.labelTitle);
        this.labelTitle.style.fill = 0xFFFFFF
        //this.labelTitle.style.strokeThickness = 0
        this.labelTitle.style.wordWrap = true
        this.labelTitle.style.fontStyle = 'italic'
        this.labelTitle.style.wordWrapWidth = width
        this.labelTitle.style.fontSize = 20
        this.labelTitle.anchor.set(0.5)
        this.labelTitle.y = 25 / 2

        this.offset = { x: 0, y: 0 }

        // let zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0,0,10)
        // this.addChild(zero)

        this.cardContainer.x = -width / 2
        this.cardContainer.pivot.y = height

        this.cardContentContnainer.x = -width / 2
        this.cardContentContnainer.pivot.y = height
        this.safeShape.x = -width / 2
        this.safeShape.pivot.y = height


        this.state = 0;

        this.smallFontSize = 20
        this.largeFontSize = 20

        this.descriptionContainer = new PIXI.Container();
        this.cardContentContnainer.addChild(this.descriptionContainer)

        this.level = 0
        this.levels = new LevelStars();
        this.descriptionContainer.addChild(this.levels)
        this.levels.resize(this.cardBorder.width - 50, 25)
        this.levels.x = 25

        this.descriptionDrawerList = new UIList();
        this.descriptionDrawerList.w = this.cardBorder.width - 40;
        this.descriptionDrawerList.h = 50;
        this.descriptionDrawerList.x = 20;
        this.descriptionDrawerList.y = 40;

        this.descriptionContainer.addChild(this.descriptionDrawerList);
        //this.addAttributeDrawer('basePower', 50)
        //this.addAttributeDrawer('defense', 10)

    }

    addAttributeDrawer(attribute, value, attach = '', forceGreen = false) {
        if (value == 0) {
            return;
        }
        const drawer = new CardAttributeDrawer();
        drawer.updateAttributes(attribute, value - 1, value, UIUtils.getIconByAttribute(attribute), attach, forceGreen)

        drawer.rebuild(this.cardBorder.width - 60, 20)

        this.descriptionDrawerList.addElement(drawer, { align: 0 })
        this.descriptionDrawerList.h = this.descriptionDrawerList.elementsList.length * 30;
        this.descriptionDrawerList.updateVerticalList();
    }

    resetPivot() {
        this.cardContainer.x = 0
        this.cardContainer.pivot.y = 0
        this.cardContentContnainer.x = 0
        this.cardContentContnainer.pivot.y = 0

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
    getIdByType(type) {
        switch (type) {
            case EntityData.EntityDataType.Weapon:
                return 3
            case EntityData.EntityDataType.Companion:
                return 0

            case EntityData.EntityDataType.Attribute:
            case EntityData.EntityDataType.Coins:
            case EntityData.EntityDataType.Heal:
                return 5

            case EntityData.EntityDataType.Acessory:
                return 2
        }
        return 1
    }
    setData(cardData, baseData, player, level) {

        this.level = level
        if (CardPlacementSystem.isSpecialType(baseData.entityData.type)) {
            let cardID = this.getIdByType(baseData.entityData.type)
            this.cardBorder.texture = PIXI.Texture.from(this.textures[cardID]);

            if (baseData.entityData.type === EntityData.EntityDataType.Coins) {
                this.updateTexture(UIUtils.getIconUIIcon('coinsCard'));
                this.labelTitle.text = 'Coin Stash'

                this.addAttributeDrawer('coin', '+' + baseData.value)
            } else if (baseData.entityData.type === EntityData.EntityDataType.Heal) {
                this.updateTexture(UIUtils.getIconUIIcon('healCard'));
                this.labelTitle.text = 'Instant Heal'

                this.addAttributeDrawer('heal', '+' + Math.round(baseData.value * 100), '%', true)
            }

            //this.setDescription('Teste')
            this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, 180))
            this.cardData = baseData;
            this.levels.visible = false;
            return;
        }
        if (this.cardData == cardData) {
            return;
        }

        this.levels.setLevel(this.level)

        this.cardData = cardData;
        let cardID = this.getIdByType(cardData.entityData.type)
        this.cardBorder.texture = PIXI.Texture.from(this.textures[cardID]);
        this.updateTexture(cardData.entityData.icon)
        this.cardImage.scale.set(Utils.scaleToFit(this.cardImage, 180))
        this.labelTitle.text = cardData.entityData.name

        if (this.cardData.entityData.description) {
            this.setDescription(this.cardData.entityData.description);
        }

        if (this.cardData.entityData.type == EntityData.EntityDataType.Acessory) {
            let effect = GameStaticData.instance.getDataById('misc', 'buffs', this.cardData.effectId);
            if (effect.type == StatsModifier.ModifierType.Health) {
                const value = Utils.findValueByLevel(effect.value, level)

                if (value < 0) {
                    this.addAttributeDrawer(effect.shortDescription, '+' + Math.round(Math.abs(value) * 100), '%', true)
                    this.addAttributeDrawer('Every', effect.interval, ' s', true)
                    //console.log("VALUE", Utils.findValueByLevel(effect.value, level))
                } else {

                    let effectOnHit = GameStaticData.instance.getDataById('misc', 'buffs', effect.effectOnHit);
                    this.addAttributeDrawer(effectOnHit.shortDescription, Math.round(Math.abs(Utils.findValueByLevel(effect.chance, level)) * 100), '%', true)
                    let v = Utils.findValueByLevel(effectOnHit.value, level);
                    this.addAttributeDrawer('Damage', Math.round(v * 100), '%', true)
                    this.addAttributeDrawer('Every', effectOnHit.interval, ' s', true)
                }
            }



            //console.log(EntityBuilder.instance.getAcessory(this.cardData.id))
        } else if (this.cardData.entityData.type == EntityData.EntityDataType.Weapon) {
            this.cardData.weaponAttributes.level = level;
            if (Array.isArray(this.cardData.weaponAttributes.baseFrequency)) {
                this.addAttributeDrawer('baseFrequency', this.cardData.weaponAttributes.frequency, ' s')
            }

            if (Array.isArray(this.cardData.weaponAttributes.basePower)) {
                let power = Math.round(this.cardData.weaponAttributes.power * player.attributes.basePower)
                this.addAttributeDrawer('basePower',  '+' +this.cardData.weaponAttributes.power)
            }

            if (Array.isArray(this.cardData.weaponAttributes.baseAmount)) {
                this.addAttributeDrawer('baseAmount', this.cardData.weaponAttributes.amount)
            }

            if (Array.isArray(this.cardData.weaponAttributes.baseBrustFireAmount)) {
                this.addAttributeDrawer('baseAmount', this.cardData.weaponAttributes.brustFireAmount)
            }
        } else if (this.cardData.entityData.type == EntityData.EntityDataType.Attribute) {
            if (this.cardData.attributeEffect == 'baseTotalMain' || this.cardData.attributeEffect == 'basePiercing') {

                this.addAttributeDrawer(this.cardData.attributeEffect, '+' + this.cardData.modifierValue[this.level])
            } else if (this.cardData.attributeEffect == 'baseFrequency') {

                this.addAttributeDrawer(this.cardData.attributeEffect, '-' + this.cardData.modifierValue[this.level], ' s')
            } else if (this.cardData.attributeEffect == 'baseItemHeal') {

                this.addAttributeDrawer(this.cardData.attributeEffect, '+' + this.cardData.modifierValue[this.level] * 100, '%')
            }
            // else if(this.cardData.attributeEffect == 'basePower'){
            //     let nextPower = player.attributes.rawPower * ( 1+ this.cardData.modifierValue[this.level])
            //     console.log("calc", player.attributes.rawPower ,  1+ this.cardData.modifierValue[this.level], nextPower)
            //     this.addAttributeDrawer(this.cardData.attributeEffect,Math.round(nextPower - player.attributes.power))
            // }
            else {
                this.addAttributeDrawer(this.cardData.attributeEffect, '++', '', true)
                //this.addAttributeDrawer(this.cardData.attributeEffect, '+' + Math.round(player.attributes[this.cardData.attributeEffect] - this.cardData.modifierValue[this.level] * player.attributes[this.cardData.attributeEffect]))
            }
        }
    }
    setDescription(label) {
        if (this.labelDescription) {
            this.labelDescription.text = label;
        } else {
            this.labelDescription = UIUtils.getTertiaryLabel(label)
            this.descriptionContainer.addChild(this.labelDescription)
        }

        //this.labelDescription.style.fill = 0xf2a627
        // this.labelDescription.style.strokeThickness = 1
        // this.labelDescription.style.w = true
        this.labelDescription.style.wordWrap = true
        this.labelDescription.style.fontSize = 12
        this.labelDescription.style.wordWrapWidth = this.cardBorder.width - 50;
        this.labelDescription.style.dropShadow = false
        this.labelDescription.anchor.set(0.5, 0)
        // this.labelDescription.x = 0
        // this.labelDescription.y = 20


    }
    show(order) {

        this.animation = true;
        this.cardContentContnainer.alpha = 0;

        this.cardIconContainer.y = this.cardBorder.height / 2
        let targetScale = Utils.scaleToFit(this.cardIconContainer, 100)
        this.cardIconContainer.scale.set(targetScale * 2, 0);
        TweenLite.to(this.cardIconContainer.scale, 1, { delay: order * 0.2 + 0.2, x: targetScale, y: targetScale, ease: Elastic.easeOut })
        TweenLite.to(this.cardIconContainer, 0.3, { delay: order * 0.2 + 0.3, y: 50, ease: Back.easeOut })


        this.cardContentContnainer.y = -150

        this.descriptionContainer.alpha = 0;

        TweenLite.to(this.cardContentContnainer, 0.75, { delay: order * 0.2 + 0.3, alpha: 1, y: 0, ease: Elastic.easeOut })

        TweenLite.to(this.descriptionContainer, 0.25, { delay: order * 0.2 + 0.55, alpha: 1 })
        TweenLite.to(this.offset, 0.3, { delay: order * 0.2 + 0.3, y: 0, ease: Back.easeOut })

        this.cardBorder.height = 100
        TweenLite.to(this.cardBorder, 0.3, { delay: order * 0.2 + 0.3, height: this.baseHeight, ease: Back.easeOut })

        //this.cardIconContainer.y = 50

        setTimeout(() => {
            this.animation = false;
        }, (order * 0.2 + 1) * 1000);

    }
    update(delta) {
        if (!this.animation) {

            this.cardContainer.y = Utils.lerp(this.cardContainer.y, this.offset.y, 0.3);
            this.cardContentContnainer.y = Utils.lerp(this.cardContentContnainer.y, this.offset.y, 0.3);

            if (this.mouseOver && this.state != 1) {
                this.offset.y = -20
            } else {
                this.offset.y = 0
            }
        }

        this.labelTitle.style.fontSize = this.smallFontSize

        this.cardIconContainer.x = this.cardBorder.width / 2

        this.safeShape.pivot.y = this.baseHeight
        this.cardContainer.pivot.y = this.baseHeight
        this.cardContentContnainer.pivot.y = this.baseHeight

        this.margin = 20

        this.cardBackground.x = this.cardBorder.x
        this.cardBackground.width = this.cardBorder.width - 10
        this.cardBackground.height = this.cardBorder.height - 10

        this.titleBox.width = this.cardBorder.width - 8
        this.titleBox.height = this.labelTitle.height + 10
        this.titleBox.pivot.x = this.titleBox.width / 2
        this.titleBox.x = this.cardBorder.x + this.cardBorder.width / 2
        this.titleBox.y = 115


        this.labelTitle.anchor.y = 0
        this.labelTitle.x = this.titleBox.width / 2
        this.labelTitle.y = 5
        this.labelTitle.style.wordWrapWidth = this.cardBorder.width - 20

        this.descriptionContainer.y = this.titleBox.y + this.titleBox.height

        this.descriptionDrawerList.x = this.cardBorder.width / 2 - this.descriptionContainer.x - this.descriptionDrawerList.width / 2;

        if (this.descriptionDrawerList && this.labelDescription) {

            this.labelDescription.x = this.descriptionDrawerList.width / 2 + this.descriptionDrawerList.x
            this.labelDescription.y = this.descriptionDrawerList.y + this.descriptionDrawerList.height + 5

        }

    }
}