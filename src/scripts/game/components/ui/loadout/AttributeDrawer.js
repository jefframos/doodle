import * as PIXI from 'pixi.js';

import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';

export default class AttributeDrawer extends PIXI.Container {
    constructor(att = 'baseHealth') {
        super();


        this.uiList = new UIList();
        this.addChild(this.uiList)

        this.uiList.w = 80
        this.uiList.h = 50



        this.label = UIUtils.getPrimaryLabel('100', { fontSize: 24 });
        this.attName = UIUtils.getPrimaryLabel(UIUtils.getAttributShort(att), { fontSize: 18 });
        this.icon = new PIXI.Sprite.from(UIUtils.getIconByAttribute(att))

        //this.uiList.addElement(this.icon, { fitHeight: 0.8, align: 0.5 });
        this.uiList.addElement(this.attName, { align: 1 });
        this.uiList.addElement(this.label, { align: 0 });

        this.uiList.updateHorizontalList()

    }
    updateAttributes(defaultAttribute, attribute, customIcon, attach = '') {
        if (customIcon) {
            this.icon.texture = PIXI.Texture.from(customIcon)
        }
        if (defaultAttribute < attribute) {
            this.label.style.fill = 0xAFFE0F
        } else {
            this.label.style.fill = 0xFFFFFF
        }
        this.label.text = attribute + attach;
        this.uiList.updateHorizontalList()
    }
    rebuild(w, h) {
        this.uiList.w = w
        this.uiList.h = h
        this.uiList.updateHorizontalList()
    }
}