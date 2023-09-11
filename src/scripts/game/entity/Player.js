import AgentBlur from "./AgentBlur";
import Clouds from "../components/Clouds";
import Companion from "./Companion";
import EffectsManager from "../manager/EffectsManager";
import EntityBuilder from "../screen/EntityBuilder";
import EntityData from "../data/EntityData";
import EntityLifebar from "../components/ui/progressBar/EntityLifebar";
import GameAgent from "./GameAgent";
import GameData from "../data/GameData";
import GameStaticData from "../data/GameStaticData";
import InGameWeapon from "../data/InGameWeapon";
import InputModule from "../core/modules/InputModule";
import Layer from "../core/Layer";
import LevelManager from "../manager/LevelManager";
import PhysicsModule from "../core/modules/PhysicsModule";
import PlayerGameViewSpriteSheet from "../components/PlayerGameViewSpriteSheet";
import PlayerHalo from "./PlayerHalo";
import RenderModule from "../core/modules/RenderModule";
import Sensor from "../core/utils/Sensor";
import Shadow from "../components/view/Shadow";
import SpriteJump from "../components/SpriteJump";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";
import WeaponBuilder from "../screen/EntityBuilder";
import WeaponLoadingBar from "../components/ui/progressBar/WeaponLoadingBar";
import config from "../../config";
import signals from "signals";
import SpriteFacing from "../components/SpriteFacing";

export default class Player extends GameAgent {
    static MainPlayer = this;
    static Deaths = 0;
    constructor() {
        super();

        this.activeWeapons = [];

        this.onUpdateEquipment = new signals.Signal();
        this.totalDirections = 8
        this.autoSetAngle = false;
        this.gameView.layer = RenderModule.RenderLayers.Gameplay
        this.gameView.view = new PIXI.Sprite();
        //this.setDebug(15)        
        this.playerStats = {
            health: 0,
            deaths: 0
        }
        window.GUI.add(this.playerStats, 'health').listen();
        window.GUI.add(this.playerStats, 'deaths').listen();

        this.isPlayer = true;

        this.currentSessionData = null;


    }
    get collectRadius() {
        return this.attributes.collectionRadius;
    }
    get sessionData() {
        return this.currentSessionData
    }
    set sessionData(value) {
        this.currentSessionData = value;
        this.currentSessionData.equipmentUpdated.removeAll();
        this.currentSessionData.equipmentUpdated.add(this.rebuildWeaponGrid.bind(this))
        this.currentSessionData.setMainWeapon(WeaponBuilder.instance.weaponsData[GameData.instance.currentEquippedWeaponData.id], GameData.instance.currentEquippedWeapon.level)
        this.sessionStarted();
    }
    // makeAnimations(data) {
    //     this.playerView = this.addComponent(PlayerGameViewSpriteSheet);
    //     this.playerView.setData(data);
    //     this.playerView.update(1);
    // }

    build(playerData) {
        if (!playerData) {
            playerData = GameStaticData.instance.getEntityByIndex('player', Math.floor(Math.random() * 7))
        }

        this.invencibleTimer = 0;
        this.loadoutAttributes = GameData.instance.getLoadoutAttributes();
        this.baseMainWeaponLevel = GameData.instance.currentEquippedWeapon.level;
        this.staticData = playerData;

        console.log(playerData.attributes, this.loadoutAttributes)
        this.attributes.reset(this.loadoutAttributes);
        this.attributes.baseCollectionRadius = playerData.attributes.baseRadius;
        //this.attributes.sumAttributes(this.loadoutAttributes)

        this.viewData = playerData.view;
        Player.MainPlayer = this;
        super.build()

        this.distanceWalked = 0;

        this.activeAttachments = [];
        this.activeWeapons = [];
        this.activeCompanions = [];
        this.weaponsGameObject = [];
        this.activeStatsEffect = [];

        this.health.setNewHealth(this.attributes.health)

        this.currentEnemiesColliding = []
        //this.weaponLoadingBars = [];

        this.sensor = this.engine.poolGameObject(Sensor)
        this.sensor.build(250)
        this.sensor.onTrigger.add(this.onSensorTrigger.bind(this))
        this.addChild(this.sensor)
        this.buildCircle(0, 0, 15);


        this.lifeBar = this.engine.poolGameObject(EntityLifebar)
        this.addChild(this.lifeBar)

        this.lifeBar.build(40, 5, 2);
        this.lifeBar.updateView({ x: 0, y: -75 }, 0xFF33E4, 0xFF0000);


       
        //this.weaponShootBar = this.engine.poolGameObject(WeaponLoadingBar)
        //this.addChild(this.weaponShootBar)

        //this.weaponShootBar.build(20, 3, 1);
        //this.weaponShootBar.updateView({ x: 0, y: -68 }, 0xFF0000, 0xFF00ff);

        //this.weaponLoadingBars.push(this.weaponShootBar);
        

        this.speed = this.attributes.speed


        this.addChild(this.engine.poolGameObject(Shadow))

        // let jumpy = this.addComponent(SpriteJump)

        // jumpy.jumpHight = 10
        // jumpy.sinSpeed = 3

        this.transform.angle = -Math.PI / 2
        this.layerCategory = Layer.Player
        this.layerMask = Layer.PlayerCollision


        this.framesAfterStart = 0;
        this.makeAnimations(this.staticData)

        console.log('staticData',this.staticData)

        if (this.viewData.anchor) {
            this.gameView.view.anchor.set(this.viewData.anchor.x, this.viewData.anchor.y)
        } else {
            this.gameView.view.anchor.set(0.5, 1)
        }

        this.gameView.view.scale.set(1);
        let scale = 0.5//this.viewData.scale ? this.viewData.scale : 1
        this.gameView.view.scale.set(scale * 0.5);
        //this.gameView.view.scale.set(Utils.scaleToFit(this.gameView.view, this.attributes.radius * 2 * scale));
        this.gameView.view.scale.y = Math.abs(this.gameView.view.scale.y);
        this.gameView.view.scale.x = Math.abs(this.gameView.view.scale.x);
        this.gameView.applyScale();

        this.anchorOffset = 0;
        this.cleanStats();

        let halo = this.engine.poolGameObject(PlayerHalo);
        halo.setArc(50, 200, Math.PI * 0.25)
        halo.setColor(0xFFFED9, 0.5)
        this.addChild(halo)

        let blur = this.engine.poolGameObject(AgentBlur);
        blur.setColor(0xFFFED9)
        this.addChild(blur)

        let clouds = this.engine.poolGameObject(Clouds);
        this.addChild(clouds)

        let spriteFacing = this.addComponent(SpriteFacing);
        spriteFacing.lerp = 0.1
        spriteFacing.startScaleX = -1

    }
    afterBuild() {
        super.afterBuild()


        //this weapon is not the gameobject
        this.activeWeapons.forEach(element => {
            element.enable = false;
        });

        this.physics.velocity.x = 1
    }
    gameReady() {

        //this weapon is not the gameobject
        this.activeWeapons.forEach(element => {
            element.enable = false;
        });
        setTimeout(() => {

            this.activeWeapons.forEach(element => {
                element.enable = true;
            });
        }, 2000);

    }
    sessionStarted() {


        const comp = GameData.instance.currentEquippedCompanionData
        if (comp) {
            const compEquip = GameData.instance.currentEquippedCompanion
            this.sessionData.addEquipmentNEW(comp, compEquip.level)
        }

        //this.sessionData.addEquipmentNEW(EntityBuilder.instance.getCompanion('LIGHT_DRONE'))
    }
    addCompanion(companionID, level) {
        let companion = this.engine.poolGameObject(Companion)

        //console.log(EntityBuilder.instance.getCompanion(companionID), companionID)
        companion.build(EntityBuilder.instance.getCompanion(companionID), level);
        this.addChild(companion)
        let ang = Math.random() * Math.PI * 2
        companion.x = this.transform.position.x + Math.cos(ang) * 100
        companion.z = this.transform.position.z + Math.sin(ang) * 100

        this.activeCompanions.push(companion)
    }
    rebuildWeaponGrid(equipmentGrid) {
        this.clearWeapon();
        this.cleanStats();

        for (let i = 0; i < equipmentGrid.length; i++) {
            const element = equipmentGrid[i];
            if (!element || !element.item) continue;
            switch (element.item.entityData.type) {
                case EntityData.EntityDataType.Weapon:
                    if (element.item.isAttachment) {
                        this.activeAttachments.push(element.item);
                    } else {
                        this.addWeaponData(element, i)
                    }
                    break;
                case EntityData.EntityDataType.Companion:
                    this.addCompanion(element.item.staticData.id, element.level)
                    break;
                case EntityData.EntityDataType.Acessory:
                    this.addStatsModifier(element.item.effectId, element.level)
                    this.activeAcessories.push(element);
                    break;
            }

        }

        if (this.activeAttachments.length) {
            this.activeAttachments.forEach(attachmentData => {
                this.activeWeapons.forEach(weapon => {
                    console.log('THIS ATTACHMENT', attachmentData, weapon)
                    weapon.addWeaponFromData(attachmentData)
                });
            });
        }
        this.refreshEquipment();

    }
    clearWeapon() {
        for (let index = this.weaponsGameObject.length - 1; index >= 0; index--) {
            if (!this.weaponsGameObject[index].destroyed) {

                this.weaponsGameObject[index].destroy();
            }
        }
        for (let index = this.activeCompanions.length - 1; index >= 0; index--) {
            if (!this.activeCompanions[index].destroyed) {

                this.activeCompanions[index].destroy();
            }
        }
        // for (let index = this.weaponLoadingBars.length - 1; index >= 0; index--) {
        //     if (!this.weaponLoadingBars[index].destroyed) {

        //         this.weaponLoadingBars[index].destroy();
        //     }
        // }

        this.activeAttachments = [];
        // this.weaponLoadingBars = [];
        this.weaponsGameObject = [];
        this.activeCompanions = [];
        this.activeWeapons = [];
        this.refreshEquipment();
    }

    addWeaponData(weaponIngameData, slotID = 0) {
        if (!this.activeWeapons[slotID]) {
            let mainWeapon = new InGameWeapon();
            mainWeapon.addWeapon(weaponIngameData)
            this.addWeapon(mainWeapon, slotID)
        } else {
            this.activeWeapons[slotID].addWeapon(weaponIngameData);
        }
    }
    addWeapon(inGameWeapon, slotID = 0) {
        if (!inGameWeapon.hasWeapon) {
            return;
        }
        let weaponData = inGameWeapon.mainWeapon
        weaponData.baseLevel = this.baseMainWeaponLevel

        let first = null

        const t = weaponData.entityData.starter ? Math.max(1, this.attributes.totalMain) : 1;



        for (let index = 0; index < t; index++) {

            let weapon = this.engine.poolGameObject(weaponData.customConstructor)
            if (!first) {
                first = weapon;
            }
            this.addChild(weapon)
            this.weaponsGameObject.push(weapon);

            //console.log(weaponData.id, this.sessionData.mainWeapon.id)

            if (weaponData.id == this.sessionData.mainWeapon.id) {

                this.attributes.weaponPower = weaponData.weaponAttributes.power;
                this.attributes.basePower = this.loadoutAttributes.power
                this.attributes.baseFrequency = weaponData.weaponAttributes.frequency + this.loadoutAttributes.frequency
                this.attributes.baseCritical = weaponData.weaponAttributes.critical + this.loadoutAttributes.critical

            }
            weapon.build(weaponData)
            weapon.setIdOffset(index, t)
            if (index > 0) {
                weapon.currentShootTimer = first.currentShootTimer
                weapon.realShootTimer = first.realShootTimer;
            }

        }



        //this.weaponShootBar.setWeapon(first)
        inGameWeapon.onUpdateWeapon.add(() => {
            this.refreshEquipment();
        })
        this.activeWeapons[slotID] = inGameWeapon
        this.refreshEquipment();
    }
    refreshEquipment() {

        if (this.sessionData) {
            //find all attributes and add the multipliers here
            this.attributes.multipliers = this.sessionData.attributesMultiplier;
            let normal = this.health.normal;
            this.health.updateMaxHealth(this.attributes.health)
            this.health.health = Math.round(normal * this.attributes.health);

            this.speed = this.attributes.speed;

        }
        this.onUpdateEquipment.dispatch(this);

    }
    onSensorTrigger(element) {
    }
    revive() {
        super.revive();
        this.isDyingNow = false;
        this.gameView.view.scale.y = this.gameView.view.scale.x
        this.explodeAround();
    }
    explodeAround() {
        const closeEnemies = LevelManager.instance.findEnemyInRadius(this.transform.position, 500)
        closeEnemies.forEach(element => {
            if (element.destroy && !element.destroyed && element.damage) {
                element.damage(Math.round(Math.random() * 1000 + 1000));
            }
        });
    }
    itemHeal() {
        this.heal(Math.round(this.health.maxHealth * this.attributes.itemHeal))
    }
    cardHeal(value) {
        this.heal(Math.round(this.health.maxHealth * value))
    }
    die() {
        console.log("die");
        this.isDyingNow = true;

        this.dieTimer = 0;
        //this.clearWeapon();
        this.onDie.dispatch(this);
    }
    confirmDeath() {
        super.die();
        Player.Deaths++;
        this.isDyingNow = false;

    }
    damage(value) {
        if (Math.random() < this.attributes.evasion) {
            EffectsManager.instance.popEvasion(this)
            return
        }
        let def = value - this.attributes.defense;
        def = Math.floor(Math.max(def, 1));
        super.damage(def);
    }
    start() {
        this.input = this.engine.findByType(InputModule)
        this.physicsModule = this.engine.findByType(PhysicsModule)
        this.isDyingNow = false;

    }

    collisionEnter(collided) {
        if (collided.layerCategory != Layer.Enemy) return;
        if (this.findInCollision(collided)) return;
        this.currentEnemiesColliding.push({ entity: collided, timer: 0 });
    }
    collisionExit(collided) {
        if (collided.layerCategory != Layer.Enemy) return;
        if (!this.findInCollision(collided)) return;
        this.currentEnemiesColliding = this.currentEnemiesColliding.filter(item => item.entity !== collided);
    }
    resetVelocity() {
        this.physics.velocity.x = 0;
        this.physics.velocity.z = 0;
    }
    update(delta) {
        if (this.isDyingNow) {
            this.dieTimer += delta;
            if (this.dieTimer < 0.5 && Math.random() < 0.5) {
                EffectsManager.instance.emitById(
                    Vector3.XZtoXY(this.transform.position)
                    , 'BLOOD_SPLAT_RED', 1)

            }
            this.gameView.view.scale.y = Utils.lerp(this.gameView.view.scale.y, 0, 0.12)
            return;
        }
        this.framesAfterStart++
        if (this.framesAfterStart == 1) {
            this.sensor.collisionList.forEach(element => {
                if (element.destroy && !element.destroyed) {
                    element.destroy()
                }
            });
        }

        for (let index = 0; index < this.currentEnemiesColliding.length; index++) {
            const element = this.currentEnemiesColliding[index];
            if (element.timer <= 0 && this.invencibleTimer <= 0) {
                //console.log('=>=',this.attributes.rawHealth , element.entity.attributes.power2)
                let dead = this.damage(Math.round(this.attributes.rawHealth * element.entity.attributes.power2));
                this.invencibleTimer = 0.1;
                if (dead) {
                    return
                }
                element.timer = 1;
            } else {
                element.timer -= delta;
            }
        }

        if(this.invencibleTimer > 0){
            this.invencibleTimer -= delta;
        }
        this.playerStats.health = this.health.currentHealth
        this.playerStats.deaths = Player.Deaths

        this.sensor.x = this.transform.position.x
        this.sensor.z = this.transform.position.z

        this.transform.angle = Math.atan2(this.input.mousePosition.y - this.transform.position.z, this.input.mousePosition.x - this.transform.position.x)
        if (window.isMobile && this.input.touchAxisDown) {
            this.physics.velocity.x = Math.cos(this.input.direction) * this.speed * delta
            this.physics.velocity.z = Math.sin(this.input.direction) * this.speed * delta
            this.transform.angle = this.input.direction

            
        } else if (this.input.isMouseDown) {
            
            //from the middle
            this.transform.angle = Math.atan2(this.input.mousePosition.y - config.height / 2, this.input.mousePosition.x - config.width / 2)
            this.physics.velocity.x = Math.cos(this.transform.angle) * this.speed * delta
            this.physics.velocity.z = Math.sin(this.transform.angle) * this.speed * delta

        } else if (this.input.magnitude > 0) {
            this.transform.angle = this.input.direction

            this.physics.velocity.x = Math.cos(this.transform.angle) * this.speed * delta
            this.physics.velocity.z = Math.sin(this.transform.angle) * this.speed * delta



        } else {
            this.transform.angle = this.input.direction
            this.physics.velocity.x = 0
            this.physics.velocity.z = 0
        }

        this.distanceWalked += this.physics.magnitude * this.speed * delta;

        if (this.distanceWalked > 50) {
            EffectsManager.instance.emitById(Vector3.XZtoXY(
                Vector3.sum(Vector3.sum(this.transform.position, this.facingVector), new Vector3(0, 0, 0))
            ), 'SMOKE_01', 1)

            this.distanceWalked = 0;
        }


        super.update(delta)
    }

}