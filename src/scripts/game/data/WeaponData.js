import BaseWeapon from "../components/weapon/BaseWeapon";
import Bullet from "../components/weapon/bullets/Bullet";
import EntityData from "./EntityData";
import EntityViewData from "./EntityViewData";
import InGameViewDataStatic from "./InGameViewDataStatic";
import WeaponAttributes from "./WeaponAttributes";

export default class WeaponData {
    static WeaponType = {
        Physical: 'Physical',
        Magical: 'Magical'
    }
    constructor(name = 'none', id = '-') {
        this.weaponAttributes = new WeaponAttributes();
        this.weaponViewData = new EntityViewData();
        this.customConstructor = BaseWeapon;
        this.weaponType = WeaponData.WeaponType.Physical;
        this.bulletComponent = Bullet;
        this.entityData = new EntityData();
        this.ingameViewDataStatic = new InGameViewDataStatic()
        this.onDestroyId = null;
        this.isMain = true;
        this.onDestroyWeapon = [];
        this.onFixedDestroyWeapon = [];
        this.id = id;
        this.isAttachment = false;
        this.overridersList = [];
        this._baseLevel = 0;
        this._ingameData = null;
    }
    set ingameData(value) {
        this.weaponAttributes.level = value ? value.level : 0;
    }
    get level() {
        return this.weaponAttributes.level;
    }
    get displayLevel() {
        return this.weaponAttributes.level - this.baseLevel;
    }

    get baseLevel() {
        return this.weaponAttributes.baseLevel;
    }
    set baseLevel(value) {
        this.weaponAttributes.baseLevel = value;
    }
    set level(value) {
        this.weaponAttributes.level = value;
    }
    get bulletBehaviourComponent() {
        let toReturn = null;
        if (this.weaponAttributes.isMain || !this.weaponAttributes.overrider.bulletComponent) {
            toReturn = this.bulletComponent;
        } else {
            toReturn = this.weaponAttributes.overrider.bulletComponent;
        }
        return toReturn || Bullet;
    }
    get perLevelOverrider(){
        if(this.baseLevel < this.overridersList.length){
            return this.overridersList[this.baseLevel];
        }
        return null;
    }
    setLevelOverriders(overridersList) {
        this.overridersList = overridersList;
    }
    setAsAttachment() {
        this.isAttachment = true;
    }
    addMultiplier(multpliers) {
        this.weaponAttributes.addMultiplier(multpliers);
    }
    addFixedDestroyedWeapon(weapon) {
        this.onFixedDestroyWeapon.push(weapon);
    }
    addWeaponOnDestroy(weapon) {
        this.onDestroyWeapon.push(weapon);
    }
    clone() {
        let weapon = new WeaponData();

        for (const key in this) {
            if (this[key] && this[key].clone) {
                weapon[key] = this[key].clone();
            } else {
                weapon[key] = this[key];
            }

        }
        weapon.onDestroyWeapon = [];
        return weapon;
    }
}