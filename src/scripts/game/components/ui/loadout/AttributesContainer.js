import * as PIXI from 'pixi.js';

import AttributeDrawer from './AttributeDrawer';
import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';

export default class AttributesContainer extends PIXI.Container {
    constructor() {
        super();

        this.modalTexture = 'tile'

        this.containerBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(this.modalTexture), 20, 20, 20, 20);
        this.containerBackground.width = 500
        this.containerBackground.height = 50
        this.containerBackground.tint = 0
        this.containerBackground.alpha = 0.5

        this.addChild(this.containerBackground)

        this.uiList = new UIList();
        this.addChild(this.uiList)

        this.uiList.w = this.containerBackground.width - 20
        this.uiList.h = this.containerBackground.height - 20

        this.uiList.x = 10;
        this.uiList.y = 10;

        // this.healthLabel = UIUtils.getPrimaryLabel('100', { fontSize: 24 });
        this.speedLabel = UIUtils.getPrimaryLabel('100', { fontSize: 24 });
        this.powerLabel = UIUtils.getPrimaryLabel('100', { fontSize: 24 });
        this.defenseLabel = UIUtils.getPrimaryLabel('100', { fontSize: 24 });
        this.frequencyLabel = UIUtils.getPrimaryLabel('100', { fontSize: 20 });
        this.evasionLabel = UIUtils.getPrimaryLabel('100', { fontSize: 20 });
        this.criticalLabel = UIUtils.getPrimaryLabel('100', { fontSize: 20 });


        this.healthDrawer = new AttributeDrawer('baseHealth');

        this.powerDrawer = new AttributeDrawer('basePower');

        this.defenseDrawer = new AttributeDrawer('baseDefense');

        this.speedDrawer = new AttributeDrawer('baseSpeed');

        this.frequencyDrawer = new AttributeDrawer('baseFrequency');

        this.evasionDrawer = new AttributeDrawer('baseEvasion');

        this.critDrawer = new AttributeDrawer('baseCritical');


        let attSet = { scaleContentMax: false, align:0, vAlign: 0 }
        this.uiList.addElement(this.healthDrawer, attSet);
        this.uiList.addElement(this.powerDrawer, attSet);
        this.uiList.addElement(this.defenseDrawer, attSet);
        this.uiList.addElement(this.speedDrawer, attSet);
        //this.uiList.addElement(this.frequencyDrawer, attSet);
        this.uiList.addElement(this.evasionDrawer, attSet);
        this.uiList.addElement(this.critDrawer, attSet);
        this.resizeDrawers(this.uiList.w / this.uiList.elementsList.length)

    }
    setSize(width, height) {
        this.containerBackground.width = width
        this.containerBackground.height = height
        this.uiList.w = this.containerBackground.width - 20
        this.uiList.h = this.containerBackground.height - 20
        this.uiList.x = 10;
        this.uiList.y = this.containerBackground.height / 2 - this.uiList.height / 2;
        this.resizeDrawers(this.uiList.w / this.uiList.elementsList.length)

    }
    resizeDrawers(width) {
        this.healthDrawer.rebuild(width, this.uiList.h)
        this.powerDrawer.rebuild(width, this.uiList.h)
        this.defenseDrawer.rebuild(width, this.uiList.h)
        this.speedDrawer.rebuild(width, this.uiList.h)
        this.frequencyDrawer.rebuild(width, this.uiList.h)
        this.evasionDrawer.rebuild(width, this.uiList.h)
        this.critDrawer.rebuild(width, this.uiList.h)
        this.uiList.updateHorizontalList()
    }
    updateAttributes(defaultAttributes, attributes) {

        this.healthDrawer.updateAttributes(defaultAttributes.health, Math.round(attributes.health))
        this.powerDrawer.updateAttributes(defaultAttributes.power, Math.round(attributes.power))
        this.defenseDrawer.updateAttributes(defaultAttributes.defense, Math.round(attributes.defense))
        this.speedDrawer.updateAttributes(defaultAttributes.speed, Math.round(attributes.speed))
        this.frequencyDrawer.updateAttributes(Math.max(0.05, defaultAttributes.frequency).toFixed(2), Math.max(0.05, attributes.frequency).toFixed(2))
        this.evasionDrawer.updateAttributes(defaultAttributes.evasion, attributes.evasion.toFixed(2))
        this.critDrawer.updateAttributes(defaultAttributes.critical, attributes.critical.toFixed(2))
        this.uiList.updateHorizontalList()
    }
}