import EntityAttributes from "./EntityAttributes";
import EntityData from "./EntityData";
import EntityMultipliers from "./EntityMultipliers";
import GameStaticData from "./GameStaticData";
import GameplayItem from "./GameplayItem";
import Utils from "../core/utils/Utils";
import signals from "signals";

export default class PlayerSessionData {
    constructor() {

        this.equipmentUpdated = new signals.Signal();
        this.xpUpdated = new signals.Signal();
        this.onLevelUp = new signals.Signal();
        this.onOpenChest = new signals.Signal();
        this.attributesMultiplier = new EntityMultipliers();

        this.defaultPlayerData = GameStaticData.instance.getEntityByIndex('player', 0);
        this.defaultPlayerAttributes = new EntityAttributes(this.defaultPlayerData.attributes)
    }
    reset() {
        this.healthMultiplier = 1;
        this.defenseMultiplier = 1;
        this.speedMultiplier = 1;
        this.bulletSpeedMultiplier = 1;
        this.bulletFrenquencyMultiplier = 1;
        this.attributesMultiplier.reset();
        this.mainWeapon = null;

        this.equipmentList = [];

        this.xpData = {
            xp: 0,
            currentLevel: 0,
            untilNext: 0,
            normalUntilNext: 0,
            nextLevelXP: 0,
            currentLevelXP: 0,
            levelsXpDiff: 0
        }
        this.levelBreaks = [0];
        for (var i = 0; i < 100; i++) {
            this.levelBreaks.push(10 + (i * (10 + i)));
        }
    }
    get equipaments() {
        return this.equipmentList;
    }

    updateExp(amount) {
        let nextXp = this.xpData.xp + amount;
        let nextLevel = this.xpData.currentLevel;
        for (var i = 0; i < this.levelBreaks.length - 1; i++) {
            if (nextXp >= this.levelBreaks[i] && nextXp < this.levelBreaks[i + 1]) {
                nextLevel = i;
                this.xpData.currentLevelXP = this.levelBreaks[i];
                this.xpData.nextLevelXP = this.levelBreaks[i + 1];
                this.xpData.levelsXpDiff = this.levelBreaks[i + 1] - this.levelBreaks[i];
                break;
            }
        }

        let willLevelUp = false;
        if (nextLevel != this.xpData.currentLevel) {
            this.xpData.currentLevel = nextLevel;
            willLevelUp = true;
        }

        this.xpData.xp = nextXp;

        let range = this.levelBreaks[this.xpData.currentLevel + 1] - this.levelBreaks[this.xpData.currentLevel]
        let diffFrom = this.levelBreaks[this.xpData.currentLevel] ? nextXp % this.levelBreaks[this.xpData.currentLevel] - 1 : nextXp
        this.xpData.untilNext = range - diffFrom;
        //this.xpData.normalUntilNext = 1 - this.xpData.untilNext / range;

        this.xpData.normalUntilNext = (this.xpData.xp - this.xpData.currentLevelXP) / this.xpData.levelsXpDiff
        
        if (willLevelUp) {
            this.onLevelUp.dispatch(this.xpData);
        }

    }
    equipmentUpdateNEW() {
        this.findAttributesNEW()
        this.equipmentUpdated.dispatch(this.equipmentList);
    }
    setMainWeapon(weapon, level = 0) {
        this.starterLevel = level;
        this.mainWeapon = weapon;
        this.mainWeapon.baseLevel = level;
        this.addEquipmentNEW(weapon, level)
    }
    levelUpMainWeapon() {
        this.addEquipmentNEW(this.mainWeapon)
    }
    addEquipmentNEW(equipment, level = 0) {

        let gameItemId = -1;
        for (let index = 0; index < this.equipmentList.length; index++) {
            const element = this.equipmentList[index];
            if (element.item.id == equipment.id) {
                gameItemId = index;
                break;
            }
        }

        if (gameItemId < 0) {
            this.equipmentList.push(new GameplayItem(equipment))
            gameItemId = this.equipmentList.length - 1;
            this.equipmentList[gameItemId].item = equipment;
            if (level > 0) {
                this.equipmentList[gameItemId].level = level;
            } else {
                this.equipmentList[gameItemId].level = equipment.level || 0;
            }

        } else {
            this.equipmentList[gameItemId].level++;
        }


        this.equipmentList[gameItemId].item = equipment

        this.equipmentUpdateNEW();
    }

    removeEquipmentNEW(i) {
        this.equipmentList.splice(i, 1);
        this.equipmentUpdateNEW();
    }

    getEquipmentNEW(i) {
        const copy = new GameplayItem(this.equipmentList[i].item);
        copy.level = this.equipmentList[i].level;
        return copy;
    }

    findAttributesNEW() {
        this.attributesMultiplier.reset();
        for (var i = 0; i < this.equipmentList.length; i++) {
            let ingameData = this.equipmentList[i];
            if (!ingameData || !ingameData.item) {
                continue;
            }
            if (ingameData.item.entityData.type == EntityData.EntityDataType.Attribute) {
                this.attributesMultiplier.addMultiplyer(ingameData.item.attributeEffect, Utils.findValueByLevel(ingameData.item.modifierValue, ingameData.level));
            }

        }
    }

    openChest(){
        this.onOpenChest.dispatch();
    }
    addXp(amount) {
        this.updateExp(amount)
        this.xpUpdated.dispatch(this.xpData);
    }
}