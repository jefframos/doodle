import * as PIXI from 'pixi.js';

import CompanionData from '../../../data/CompanionData';
import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';
import WeaponData from '../../../data/WeaponData';

export default class LoadoutStatsView extends PIXI.Container {
    constructor() {
        super();

        this.modalTexture = 'modal_blur'

        this.containerBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(this.modalTexture), 20, 20, 20, 20);
        this.containerBackground.width = 170
        this.containerBackground.height = 200
        this.containerBackground.alpha = 0.5

        this.addChild(this.containerBackground)

        this.uiList = new UIList();
        this.addChild(this.uiList)

        this.uiList.w = 10
        this.uiList.h = 10

        this.uiList.x = 10;
        this.uiList.y = 10;
        this.rows = 0;

        this.starsSprites = [];

        this.starsList = new UIList();
        this.starsList.w = this.containerBackground.width - 20
        this.starsList.h = 30
        for (var i = 0; i < 5; i++) {
            const star = new PIXI.Sprite.from('icon_close');
            this.starsList.addElement(star, { fitHeight: 0.8 })
            this.starsSprites.push(star)
        }
        this.starsList.updateHorizontalList();

        this.currentCardData = null;
        this.currentLevel = -1;
    }
    addRow(attribute, label, isSprite) {

if(!label){
    return;
}
        //(UIUtils.getIconByAttribute

        const rowList = new UIList();
        this.addChild(rowList)
        rowList.w = this.containerBackground.width - 30
        rowList.h = 30

        if (isSprite) {

            rowList.addElement(new PIXI.Sprite.from(attribute), { fitHeight: 1, listScl: 0.3 });
        } else {

            const tempLabelAtt = UIUtils.getPrimaryLabel(UIUtils.getAttributShort(attribute), { fontSize: 22 });
            rowList.addElement(tempLabelAtt, { align: 0, listScl: 0.6, scaleContentMax: true });
        }

        const tempLabel = UIUtils.getPrimaryLabel(label, { fontSize: 22, fill: 0xAFFE0F });
        rowList.addElement(tempLabel, { align: 0, listScl: 0.7, scaleContentMax: true });

        this.rows++;

        this.uiList.addElement(rowList, { align: 0 });
        rowList.updateHorizontalList()
        this.uiList.h = this.rows * 30

        this.containerBackground.height = this.uiList.h

    }
    updateData(data, level) {
        if (!data) {
            this.uiList.removeAllElements();
            this.visible = false;
            return;
        }
        if (this.currentCardData) {
            if (this.currentCardData.id == data.id && this.currentLevel == level) {
                return
            }
        }

        this.visible = true;
        this.currentLevel = level
        this.currentCardData = data
        this.uiList.removeAllElements();
        this.rows = 0;
        this.uiList.h = 30
        this.containerBackground.height = this.uiList.h

        for (let index = 0; index < this.starsSprites.length; index++) {
            if (index <= level) {
                this.starsSprites[index].texture = PIXI.Texture.from('filled-star')
            } else {
                this.starsSprites[index].texture = PIXI.Texture.from('blank-star')
            }
        }
        this.uiList.addElement(this.starsList, { align: 0 });
        this.rows++;
        this.rows++;
        if (data instanceof WeaponData) {
            const atts = this.getWeaponAttributes(data, level);
            atts.forEach(element => {
                this.addRow(element.icon, element.value)
            });
        } else if (data instanceof CompanionData) {
            const weapon = EntityBuilder.instance.getWeapon(data.weapon.id)
            this.addRow(weapon.entityData.icon, weapon.entityData.name, true)
            const atts = this.getWeaponAttributes(weapon, level);
            console.log(data, weapon)
            atts.forEach(element => {
                this.addRow(element.icon, element.value)
            });
        } else {
            if (data.attribute && data.value && level < data.value.length) {
                this.addRow(data.attribute, data.value[level])
            }

            if (data.secAttribute && data.secValue && level < data.secValue.length) {
                this.addRow(data.secAttribute, data.secValue[level])
            }
        }
        this.containerBackground.height += 20
        this.uiList.updateVerticalList()
    }
    getWeaponAttributes(data, level) {
        const att = []

        att.push({ icon: 'basePower', value: this.getAttributeValue(data.weaponAttributes, 'basePower', level) })
        att.push({ icon: 'baseFrequency', value: this.getAttributeValue(data.weaponAttributes, 'baseFrequency', level) })
        //att.push({ icon: 'baseBulletSpeed', value: this.getAttributeValue(data.weaponAttributes, 'baseBulletSpeed', level) })
        att.push({ icon: 'critical', value: this.getAttributeValue(data.weaponAttributes, 'critical', level) })

        if (Array.isArray(data.weaponAttributes.baseAmount)) {
            att.push({ icon: 'baseAmount', value: data.weaponAttributes.baseAmount[level] })
        } else if (Array.isArray(data.weaponAttributes.baseBrustFireAmount)) {
            att.push({ icon: 'baseBrustFireAmount', value: data.weaponAttributes.baseBrustFireAmount[level] })
        } else {
            att.push({ icon: 'baseAmount', value: this.getAttributeValue(data.weaponAttributes, 'baseAmount', level) })
        }

        return att
    }


    getAttributeValue(attributes, type, level) {

        if (Array.isArray(attributes[type])) {
            level = Math.min(level, attributes[type].length - 1)
            return attributes[type][level]
        } else {
            return attributes[type]
        }
    }

}