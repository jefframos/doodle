import * as PIXI from 'pixi.js';

import UIList from '../../ui/uiElements/UIList';
import UIUtils from '../../utils/UIUtils';

export default class CardAttributeDrawer extends PIXI.Container {
    constructor(icon = UIUtils.getIconByAttribute('baseHealth')) {
        super();


        this.backShape  = new PIXI.NineSlicePlane(PIXI.Texture.from('grid1'), 50, 0, 50, 0);
        this.addChild(this.backShape);
        
        this.uiList = new UIList();
        this.addChild(this.uiList)

        this.uiList.w = 120
        this.uiList.h = 50



        this.label = UIUtils.getTertiaryLabel('100', { fontSize: 14 });
        this.attName = UIUtils.getTertiaryLabel('100', { fontSize: 14 });
        this.icon = new PIXI.Sprite.from(icon)

        //this.label.style.stroke = false
        this.label.style.dropShadow = false

        //this.attName.style.stroke = false
        this.attName.style.dropShadow = false
        //this.uiList.addElement(this.icon, { fitHeight: 0.8, align: 0 });
        this.uiList.addElement(this.attName, { align: 0 });
        this.uiList.addElement(this.label, { align: 1 });

        this.uiList.updateHorizontalList()

    }
    updateAttributes(attributeType, defaultAttribute, attribute, customIcon, attach = '', forceGreen = false) {
        this.attName.text = UIUtils.getAttributShort(attributeType);
        if (customIcon) {
            this.icon.texture = PIXI.Texture.from(customIcon)
        }
        if (forceGreen || defaultAttribute < attribute) {
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
        this.backShape.width = w + 20
        this.backShape.height = h + 10
        this.uiList.x = 10
        this.backShape.x = -2
        this.backShape.y = -5
        this.uiList.updateHorizontalList()
    }
}