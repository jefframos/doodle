import * as PIXI from 'pixi.js';
import Signals from 'signals';
import EquipSlot from './EquipSlot';

export default class EquipContainer extends PIXI.Container {
    constructor(size = { w: 180, h: 180 }) {
        super();
        this.statLabels = {};
        this.size = size;
        this.equipList = {};
        this.addEquipSlot('head')
        this.addEquipSlot('legs')
        this.addEquipSlot('left-hand')
        this.addEquipSlot('right-hand')
        this.addEquipSlot('body')
        this.addEquipSlot('trinket')
    }
    addEquipSlot(type) {
        let equipSlot = new EquipSlot(type)
        equipSlot.normalPos = { x: 0, y: 0 };
        switch (type) {
            case 'head':
                equipSlot.normalPos.x = 0.5
                break;

            case 'legs':
                equipSlot.normalPos.x = 0.5
                equipSlot.normalPos.y = 1
                break;
            case 'left-hand':
                equipSlot.normalPos.x = 0
                equipSlot.normalPos.y = 0.5
                break;
            case 'right-hand':
                equipSlot.normalPos.x = 1
                equipSlot.normalPos.y = 0.5
                break;
            case 'body':
                equipSlot.normalPos.x = 0.5
                equipSlot.normalPos.y = 0.5
                break;
            case 'trinket':
                equipSlot.normalPos.x = 1
                equipSlot.normalPos.y = 1
                break;
            default:
                break;
        }

        this.equipList[type] = equipSlot;
        equipSlot.x = this.size.w * equipSlot.normalPos.x
        equipSlot.y = this.size.h * equipSlot.normalPos.y
        this.addChild(equipSlot);
    }
    updateEquip(charData) {
        this.equipList['right-hand'].addEquip(charData.defaultWeapon)
    }

    

}