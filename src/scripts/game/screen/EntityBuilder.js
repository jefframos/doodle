import AcessoryData from "../data/AcessoryData";
import AttributeData from "../data/AttributeData";
import AuraProjectile from "../components/weapon/AuraProjectile";
import BaseWeapon from "../components/weapon/BaseWeapon";
import BounceBullet from "../components/weapon/bullets/BounceBullet";
import Bullet from "../components/weapon/bullets/Bullet";
import CircularBullet from "../components/weapon/bullets/CircularBullet";
import CompanionData from "../data/CompanionData";
import EffectsManager from "../manager/EffectsManager";
import EntityData from "../data/EntityData";
import FallingProjectile from "../components/weapon/bullets/FallingProjectile";
import FloatingProjectile from "../components/weapon/FloatingProjectile";
import GameStaticData from "../data/GameStaticData";
import GravityBullet from "../components/weapon/bullets/GravityBullet";
import InGameWeapon from "../data/InGameWeapon";
import LaserBeam from "../components/weapon/bullets/LaserBeam";
import ParticleDescriptor from "../components/particleSystem/ParticleDescriptor";
import SinoidBullet from "../components/weapon/bullets/SinoidBullet";
import SpriteSheetBehaviour from "../components/particleSystem/particleBehaviour/SpriteSheetBehaviour";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";
import WeaponAttachmentData from "../data/WeaponAttachmentData";
import WeaponAttributes from "../data/WeaponAttributes";
import WeaponData from "../data/WeaponData";

export default class EntityBuilder {
    static BulletsAvailable = {
        Bullet: Bullet,
        GravityBullet: GravityBullet,
        SinoidBullet: SinoidBullet,
        CircularBullet: CircularBullet,
        BounceBullet: BounceBullet,
        LaserBeam: LaserBeam,
        FallingProjectile: FallingProjectile
    }
    static WeaponsAvailable = {
        BaseWeapon: BaseWeapon,
        AuraProjectile: AuraProjectile,
        FloatingProjectile: FloatingProjectile
    }
    static _instance;
    static get instance() {
        if (!EntityBuilder._instance) {
            EntityBuilder._instance = new EntityBuilder();
        }
        return EntityBuilder._instance;
    };
    constructor(engine) {
        let vfxPackData = GameStaticData.instance.getAllDataFrom('vfx', 'weaponVFXPack');
        this.weaponVFXPackData = {};
        vfxPackData.forEach(element => {
            if (this.weaponVFXPackData[element.id]) {

            } else {
                this.weaponVFXPackData[element.id] = this.makeSpriteSheetPack(element)
            }
        });


        let weapons = GameStaticData.instance.getAllDataFrom('weapons', 'main');
        let companions = GameStaticData.instance.getAllDataFrom('entities', 'companions');
        let attributes = GameStaticData.instance.getAllDataFrom('modifiers', 'attributes');
        let acessories = GameStaticData.instance.getAllDataFrom('misc', 'acessories');
        let attachments = GameStaticData.instance.getAllDataFrom('misc', 'attachments');

        this.weaponsData = {};
        this.attachments = {};
        this.companionsData = {};
        this.attributeModifiersData = {};
        this.acessoriesData = {};
        this.equipablesData = {};
        this.trinketsData = {};
        this.shoesData = {};
        this.masksData = {};
        weapons.forEach(element => {
            if (this.weaponsData[element.id]) {

            } else {
                this.weaponsData[element.id] = this.makeWeapon(element)
            }
        });




        companions.forEach(element => {
            let companionData = new CompanionData(element)
            this.companionsData[element.id] = companionData;
        });

        attributes.forEach(element => {
            let attData = new AttributeData(element)
            this.attributeModifiersData[element.id] = attData;
        });

        acessories.forEach(element => {
            let attData = new AcessoryData(element)
            if (attData.entityData.type == EntityData.EntityDataType.Equipable) {
                this.equipablesData[element.id] = attData;
                if (attData.bodyPart == 'mask') {
                    this.masksData[element.id] = attData;
                } else if (attData.bodyPart == 'trinket') {
                    this.trinketsData[element.id] = attData;
                } else if (attData.bodyPart == 'shoe') {
                    this.shoesData[element.id] = attData;
                }
            } else {

                this.acessoriesData[element.id] = attData;
            }
        });

        attachments.forEach(element => {
            let attData = new WeaponAttachmentData(element)
            this.attachments[element.id] = attData;
        });

        this.weaponsArray = []
        this.weaponsStarterArray = []
        for (const key in this.weaponsData) {
            this.findDestroyWeapon(this.weaponsData[key])
        }

        for (const key in this.weaponsData) {
            if (this.weaponsData[key].isMain) {
                this.weaponsArray.push(this.weaponsData[key])
            }
            if (this.weaponsData[key].entityData && this.weaponsData[key].entityData.starter) {
                this.weaponsStarterArray.push(this.weaponsData[key])
            }
        }

        if (!window.weaponFolder) {
            window.weaponFolder = window.GUI.addFolder("Weapons");
            window.magicFolder = window.GUI.addFolder("Magic");
            window.weaponFolder.add(this, 'eraseWeapon')
            window.magicFolder.add(this, 'eraseWeapon')

            this.helpers = {};

            for (const key in this.weaponsData) {
                if (this.weaponsData[key].isMain) {
                    this.helpers[key] = () => {
                        let data = this.weaponsData[key];
                        this.equipWeapon(data)
                    }

                    switch (this.weaponsData[key].weaponType) {
                        case WeaponData.WeaponType.Physical:
                            window.weaponFolder.add(this.helpers, key)
                            break;
                        case WeaponData.WeaponType.Magical:
                            window.magicFolder.add(this.helpers, key)
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        for (const key in this.weaponsData) {
            if (Object.hasOwnProperty.call(this.weaponsData, key)) {
                this.findWeaponLevels(this.weaponsData[key])

            }
        }

    }
    getEquipable(id) {
        return this.equipablesData[id];
    }
    dataToArray(data) {
        const arrayData = [];
        for (const key in data) {
            arrayData.push(data[key]);
        }
        return arrayData;
    }
    getAllShoes() {
        return this.dataToArray(this.shoesData);
    }
    getAllMask() {

        return this.dataToArray(this.masksData);
    }
    getAllTrinket() {
        return this.dataToArray(this.trinketsData);
    }
    getAllWeapon() {
        return this.dataToArray(this.weaponsData);
    }
    getAllStarterWeapon() {
        return this.weaponsStarterArray;
    }
    getAllCompanion() {
        return this.dataToArray(this.companionsData);
    }
    getShoe(id) {
        return this.shoesData[id];

    }
    getMask(id) {
        return this.masksData[id];
    }
    getTrinket(id) {
        return this.trinketsData[id];
    }
    getWeapon(id) {
        return this.weaponsData[id];
    }
    getCompanion(id) {
        return this.companionsData[id];
    }
    getAttribute(id) {
        return this.attributeModifiersData[id];
    }
    getAcessory(id) {
        return this.acessoriesData[id];
    }
    findDestroyWeapon(weapon) {
        if (weapon.onDestroyId) {
            weapon.addFixedDestroyedWeapon(this.weaponsData[weapon.onDestroyId])
        }
    }
    makeWeapon(weaponData) {
        let weapon = new WeaponData(weaponData.name, weaponData.id);


        if (weaponData.ingameViewData) {
            let targetInGameViewData = GameStaticData.instance.getDataById('weapons', 'inGameView', weaponData.ingameViewData)
            if (targetInGameViewData) {
                for (const key in targetInGameViewData) {
                    if (weapon.ingameViewDataStatic[key] != undefined) {
                        if (key == 'progressBar') {
                            for (const progressBarKey in targetInGameViewData[key]) {
                                if (weapon.ingameViewDataStatic[key][progressBarKey] != undefined) {
                                    weapon.ingameViewDataStatic[key][progressBarKey] = targetInGameViewData[key][progressBarKey];
                                }
                            }

                        } else {
                            weapon.ingameViewDataStatic[key] = targetInGameViewData[key];
                        }
                    }
                }
            }
        }


        for (const key in weaponData) {
            if (Object.hasOwnProperty.call(weapon, key)) {
                weapon[key] = weaponData[key];
            }
        }

        let att = weaponData.attributes;
        let overrider = weaponData.overrider;



        for (const key in att) {
            if (Object.hasOwnProperty.call(weapon.weaponAttributes, key)) {
                weapon.weaponAttributes[key] = att[key];

            }
        }


        if (weaponData.view) {
            for (const key in weaponData.view) {
                if (Object.hasOwnProperty.call(weapon.weaponViewData, key)) {
                    weapon.weaponViewData[key] = weaponData.view[key];
                }
            }

            if (weaponData.view.overrider) {


                for (const key in weaponData.view.overrider) {
                    if (weapon.weaponViewData[key] && weaponData.view.overrider[key]) {
                        let targetOverrider = GameStaticData.instance.getDataById('weapons', 'viewOverriders', weaponData.view.overrider[key])
                        if (targetOverrider) {
                            for (const overriderKey in targetOverrider) {
                                if (weapon.weaponViewData[key][overriderKey] !== undefined) {
                                    if (overriderKey == 'viewOffset') {
                                        weapon.weaponViewData[key][overriderKey].x = targetOverrider[overriderKey].x || 0;
                                        weapon.weaponViewData[key][overriderKey].y = targetOverrider[overriderKey].y || 0;
                                        weapon.weaponViewData[key][overriderKey].z = targetOverrider[overriderKey].z || 0;
                                    } else {
                                        weapon.weaponViewData[key][overriderKey] = targetOverrider[overriderKey]
                                    }

                                }
                            }
                        }
                    }

                }
            }
            if (weaponData.view['standardVfxPack']) {
                weapon.weaponViewData.addStandardVfx(this.getVFXPack(weaponData.view['standardVfxPack']));
            }
            if (weaponData.view['spawnVfxPack']) {
                weapon.weaponViewData.addSpawnVfx(this.getVFXPack(weaponData.view['spawnVfxPack']));
            }
            if (weaponData.view['destroyVfxPack']) {
                weapon.weaponViewData.addDestroyVfx(this.getVFXPack(weaponData.view['destroyVfxPack']));
            }
        }
        if (weaponData.customConstructor) {
            if (typeof weaponData.customConstructor === 'string') {
                weapon.customConstructor = EntityBuilder.WeaponsAvailable[weaponData.customConstructor]
            }
            else{
                weapon.customConstructor = weaponData.customConstructor;
            }
        } else {
            weapon.customConstructor = EntityBuilder.WeaponsAvailable.BaseWeapon;
        }

        if (weaponData.bulletComponent) {
            if (typeof weaponData.bulletComponent === 'string') {
                weapon.bulletComponent = EntityBuilder.BulletsAvailable[weaponData.bulletComponent]
            }else{
                weapon.bulletComponent = weaponData.bulletComponent;

            }
        } else {
            weapon.bulletComponent = EntityBuilder.BulletsAvailable.Bullet;
        }

        weapon.weaponAttributes.makeOverrider()



        if (overrider) {
            let targetOverrider = GameStaticData.instance.getDataById('weapons', 'main', overrider)
            if (EntityBuilder.BulletsAvailable[targetOverrider.bulletComponent]) {
                weapon.weaponAttributes.overrider.bulletComponent = EntityBuilder.BulletsAvailable[targetOverrider.bulletComponent]
            }
            if (!weapon.weaponAttributes.overrider.bulletComponent) {
                weapon.weaponAttributes.overrider.bulletComponent = EntityBuilder.BulletsAvailable[weaponData.bulletComponent]
            }
            for (const key in targetOverrider.attributes) {
                if (Object.hasOwnProperty.call(weapon.weaponAttributes.overrider, key)) {
                    weapon.weaponAttributes.overrider[key] = targetOverrider.attributes[key];
                }
            }
        } else {
            weapon.weaponAttributes.overrider.bulletComponent = EntityBuilder.BulletsAvailable[weaponData.bulletComponent]
        }

        return weapon
    }
    findWeaponLevels(weapon) {
        let perLevelOverriders = [];
        let weaponData = GameStaticData.instance.getDataById('weapons', 'main', weapon.id)

        if (weaponData.levels) {

            for (let index = 1; index <= 5; index++) {
                const element = weaponData.levels['level' + index];
                if (element) {
                    let weaponStaticData = this.getWeapon(element)
                    let wp = this.makeWeapon(weaponStaticData)
                    perLevelOverriders.push(wp);
                } else {
                    perLevelOverriders.push(null)
                }
            }

        }
        weapon.setLevelOverriders(perLevelOverriders)
    }
    getVFXPack(vfxPackID) {
        if (!this.weaponVFXPackData[vfxPackID]) {
            console.error("the pack ", vfxPackID, "is not registerd");
        }
        return this.weaponVFXPackData[vfxPackID]
    }
    makeSpriteSheetPack(vfxPackData) {
        let vfxPack = {
            descriptor: new ParticleDescriptor(),
            viewOffset: vfxPackData.viewOffset,
            scale: vfxPackData.scale,
            targetLayer: vfxPackData.targetLayer,
            lockRotation: vfxPackData.lockRotation,
            color: vfxPackData.color
        }
        let spriteSheetParams = GameStaticData.instance.getDataById('vfx', 'weaponVFX', vfxPackData.vfxData)
        if (!spriteSheetParams) {
            console.error('coudn\'t find VFX for', vfxPackData.vfxData);
        }
        vfxPack.descriptor.addBaseBehaviours(SpriteSheetBehaviour, spriteSheetParams)
        return vfxPack;
    }
    equipWeapon(weaponData) {
        if (!this.mainWeapon) {
            this.mainWeapon = new InGameWeapon();
            this.mainWeapon.addWeapon(weaponData)
            this.player.addWeapon(this.mainWeapon)

        } else {
            this.mainWeapon.addWeapon(weaponData)

        }
    }
    eraseWeapon() {

        // if (this.mainWeapon) {
        //     this.mainWeapon.clear()
        // }
        // this.mainWeapon = null;
        // this.player.clearWeapon();
        // //this.mainWeapon = new InGameWeapon();

        // if (window.isMobile) {
        //     this.mainWeapon.addWeapon(this.weaponsData['MELEE_SWORD'])
        // }
        //this.player.addWeapon(this.mainWeapon)
    }
    addWeapons(player) {
        this.player = player;
        return

        this.mainWeapon = new InGameWeapon();
        this.mainWeapon2 = new InGameWeapon();
        Utils.shuffle(this.weaponsArray)
        // this.mainWeapon.addWeapon(this.weaponsData['MELEE_SWORD'])
        // this.mainWeapon.addWeapon(this.weaponsData['DAGGER_SNIPER'])

        this.mainWeapon.addWeapon(this.weaponsArray[Math.floor(Math.random() * this.weaponsArray.length)])
        this.mainWeapon2.addWeapon(this.weaponsArray[Math.floor(Math.random() * this.weaponsArray.length)])

        if (window.isMobile) {

            for (let i = 0; i < 3; i++) {
                this.mainWeapon.addWeapon(this.weaponsArray[i])
            }
        }
        player.addWeapon(this.mainWeapon)
        player.addWeapon(this.mainWeapon2)
    }
}