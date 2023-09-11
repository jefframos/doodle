import EffectsManager from "../manager/EffectsManager";
import EntityBuilder from "../screen/EntityBuilder";
import EntityLifebar from "../components/ui/progressBar/EntityLifebar";
import FlashOnDamage from "../components/view/FlashOnDamage";
import GameAgent from "./GameAgent";
import GameStaticData from "../data/GameStaticData";
import GameViewSpriteSheet from "../components/GameViewSpriteSheet";
import Layer from "../core/Layer";
import LevelManager from "../manager/LevelManager";
import Player from "./Player";
import Pool from "../core/utils/Pool";
import Shadow from "../components/view/Shadow";
import SpriteFacing from "../components/SpriteFacing";
import SpriteJump from "../components/SpriteJump";
import SpriteScaleBounceAppear from "../components/SpriteScaleBounceAppear";
import StatsModifier from "../components/StatsModifier";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";
import ZombieWalk from "../components/ZombieWalk";

export default class BaseEnemy extends GameAgent {
    constructor() {
        super();
        this.gameView.view = new PIXI.Sprite()
    }
    get tier() { return this.staticData.entityData.tier }
    build(enemyData, extraData) {
        super.build();

        this.inBoundsX = true;
        this.inBoundsZ = true;

        this.staticData = enemyData;
        this.attributes.reset(enemyData.attributes);

        this.attributes.level = extraData && extraData.level >= 0 ? extraData.level : 0;
        this.viewData = enemyData.view;

        this.buildCircle(0, 0, this.attributes.radius);
        this.rigidBody.isSensor = false;
        this.layerCategory = Layer.Enemy
        this.layerMask = Layer.EnemyCollision

        this.speed = this.attributes.speed;
        this.health.setNewHealth(this.attributes.health)

        let spriteFacing = this.addComponent(SpriteFacing);
        spriteFacing.lerp = 0.1
        spriteFacing.startScaleX = -1

        if (this.viewData.zombieWalk) {
            this.addComponent(ZombieWalk).speed = this.viewData.zombieWalk;
        }

        this.makeAnimations(this.staticData, true)

        if (this.viewData.anchor) {
            this.gameView.view.anchor.set(this.viewData.anchor.x, this.viewData.anchor.y)
        } else {
            this.gameView.view.anchor.set(0.5, 1)
        }

        this.gameView.view.scale.set(1);
        let scale = this.viewData.scale ? this.viewData.scale : 1
        this.gameView.view.scale.set(scale * 0.5);
        //this.gameView.view.scale.set(Utils.scaleToFit(this.gameView.view, this.attributes.radius * 2 * scale));
        this.gameView.view.scale.y = Math.abs(this.gameView.view.scale.y);
        this.gameView.view.scale.x = Math.abs(this.gameView.view.scale.x);
        this.gameView.applyScale();


        if (this.staticData.weapon) {
            this.addWeaponData(EntityBuilder.instance.getWeapon(this.staticData.weapon.id))
        }


        // this.lifeBar = this.engine.poolGameObject(EntityLifebar)
        // this.addChild(this.lifeBar)
        // this.lifeBar.build(this.attributes.radius * 2,5,2);

        this.bounceAppear = this.addComponent(SpriteScaleBounceAppear);

        let shadow = this.engine.poolGameObject(Shadow);
        this.addChild(shadow);
        //shadow.updateScale(scale);
        this.transform.position.y = 0;
        if (this.viewData.offset != undefined) {
            if (this.viewData.offset.y != undefined) {
                this.transform.position.y = this.viewData.offset.y
            }
        }



    }
    getShot(value, isCritical) {
        super.getShot(value, isCritical)

        SOUND_MANAGER.play('kill', 0.2, Math.random() * 0.5 + 0.5)
        // let stats = this.engine.poolGameObject(StatsModifier)
        // this.addChild(stats)
        // stats.build({
        //     type: StatsModifier.ModifierType.Health,
        //     value: 1,
        //     interval: 1
        // });
    }
    respawn() {
        if (this.bounceAppear) {
            this.bounceAppear.enable()
        }
    }
    afterBuild() {
        super.afterBuild()

        //view related attributes
        if (this.viewData.jumpHight) {
            //this.addComponent(SpriteJump).jumpHight = this.viewData.jumpHight;
        }
        //this.addWeaponData(WeaponBuilder.instance.weaponsData['LIGHTNING_IN_PLACE'])
    }
    destroy() {
        super.destroy();

        for (let index = this.activeStatsEffect.length - 1; index >= 0; index--) {
            if (!this.activeStatsEffect[index].destroyed) {
                this.activeStatsEffect[index].destroy();
            }
        }
    }
    update(delta) {
        if (!this.dying) {

            this.inBoundsX = Vector3.distanceX(this.transform.position, Player.MainPlayer.transform.position) < LevelManager.instance.destroyDistanceV2.x
            this.inBoundsY = Vector3.distanceZ(this.transform.position, Player.MainPlayer.transform.position) < LevelManager.instance.destroyDistanceV2.y
            if (!this.inBoundsX || !this.inBoundsY) {
                this.onRespawn.dispatch(this)
            }
            this.timer += delta * (this.speed * delta * Math.random())

            let dir = Math.atan2(Player.MainPlayer.transform.position.z - this.transform.position.z, Player.MainPlayer.transform.position.x - this.transform.position.x)//this.timer
            this.physics.velocity.x = Math.cos(dir) * this.speed * this.speedAdjust * delta
            this.physics.velocity.z = Math.sin(dir) * this.speed * this.speedAdjust * delta

        } else {
            this.physics.velocity.x = 0
            this.physics.velocity.z = 0
        }

        this.gameView.view.visible = true;
        super.update(delta)
    }
}