import EffectsManager from "../manager/EffectsManager";
import EntityAttributes from "../data/EntityAttributes";
import FlashOnDamage from "../components/view/FlashOnDamage";
import GameStaticData from "../data/GameStaticData";
import GameView from "../core/view/GameView";
import GameViewSpriteSheet from "../components/GameViewSpriteSheet";
import Health from "../components/Health";
import InGameWeapon from "../data/InGameWeapon";
import PhysicsEntity from "../core/physics/PhysicsEntity";
import StatsModifier from "../components/StatsModifier";
import signals from "signals";

export default class GameAgent extends PhysicsEntity {
    constructor(debug = false) {
        super(debug);
        this.onDie = new signals.Signal();
        this.onRespawn = new signals.Signal();

        this.gameView = new GameView(this)
        this.totalDirections = 6
        this.dying = false;
        this.staticData = {};
        this.currentEnemiesColliding = [];
        this.invencibleSpawnTime = 0;

        if (debug) {
            this.setDebug(15)
        }

        

        this.attributes = new EntityAttributes();
        this.statsDictionary = {}

    }
    get isDead() { return this.health.currentHealth <= 0 }
    findInCollision(entity) {
        for (let index = 0; index < this.currentEnemiesColliding.length; index++) {
            if (this.currentEnemiesColliding[index].entity == entity) {
                return true;
            }

        }
        return false;
    }

    revive(){
        this.health.reset();
    }
    addWeaponData(weaponData, level = 0) {

        let mainWeapon = new InGameWeapon();
        mainWeapon.addWeaponFromData(weaponData)
        this.addWeapon(mainWeapon, level)
    }
    addWeapon(inGameWeapon, level = 0) {
        if (!inGameWeapon.hasWeapon) {
            return;
        }
        let weaponData = inGameWeapon.mainWeapon
        let weapon = this.engine.poolGameObject(weaponData.customConstructor)
        this.addChild(weapon)
        weapon.build(weaponData, level)
    }
    heal(value, customFont) {
        if (!this.health.canHeal) {
            return;
        }
        if (customFont) {
            EffectsManager.instance.popCustomLabel(customFont, this, value)
        } else {
            EffectsManager.instance.popHeal(this, value)
        }
        this.playVfx('onHeal')
        return this.health.heal(value);


    }
    getShot(value, isCritical) {
        if(isCritical){
            this.damage(Math.floor(value * (1.2 + Math.random() * 0.3)), 'CRITICAL')
        }else{

            this.damage(value)
        }
    }
   
    damage(value, customFont) {
        if (this.invencibleSpawnTime > 0) {
            return this.health.currentHealth;
        }
        if (customFont) {
            EffectsManager.instance.popCustomLabel(customFont, this, value)
        } else {
            if(this.isPlayer){
                EffectsManager.instance.popDamagePlayer(this, value)
            }else{
                EffectsManager.instance.popDamage(this, value)
            }
        }
        this.playVfx('onHit')
        return this.health.damage(value);
    }
    die() {
        if (this.dying) {
            return;
        }

        this.playVfx('onDie')
        this.rigidBody.isSensor = true;
        this.dying = true;
        this.onDie.dispatch(this);
        this.destroy()
    }
    playVfx(type) {
        if (!this.staticData || !this.staticData.vfx || !this.staticData.vfx[type]) { return }
        let centerPosition = this.gameView.view.position
        //centerPosition.x -= (this.gameView.view.anchor.x * this.gameView.view.width) + (this.gameView.view.width * 0.5)
        //centerPosition.y -= (this.gameView.view.anchor.y * this.gameView.view.height) + (this.gameView.view.height * 0.5)
        EffectsManager.instance.emitById(this.gameView.view.position, this.staticData.vfx[type], 0)
    }
    cleanStats() {
        for (let index = this.activeStatsEffect.length - 1; index >= 0; index--) {
            if (!this.activeStatsEffect[index].destroyed) {

                this.activeStatsEffect[index].destroy();
            }
        }
        this.activeAcessories = [];
        this.activeStatsEffect = [];
        this.statsDictionary = {};
    }
    addStatsModifier(statId, level = 0, unique = false) {
        //rebuild the list every time
        let stat = GameStaticData.instance.getDataById('misc', 'buffs', statId);
        if (this.statsDictionary[statId]) {
            this.statsDictionary[statId].build(stat);
            if (stat.effectOnHit) {
                this.statsDictionary[statId].effectOnHit = GameStaticData.instance.getDataById('misc', 'buffs', stat.effectOnHit);
            }
            this.statsDictionary[statId].restart();
        } else {
            let statsGO = this.engine.poolGameObject(StatsModifier)
            this.addChild(statsGO)
            statsGO.build(stat);
            if (stat.effectOnHit) {
                statsGO.effectOnHit = GameStaticData.instance.getDataById('misc', 'buffs', stat.effectOnHit);
            }
            this.statsDictionary[statId] = statsGO;
        }
        this.statsDictionary[statId].level = level;
        this.activeStatsEffect = [];
        for (const key in this.statsDictionary) {
            if (this.statsDictionary[key]) {
                this.activeStatsEffect.push(this.statsDictionary[key]);
            }
        }
    }
    onAnimationEnd(animation, state) { }
    start() {
        super.start();
        // this.view.visible = true;
    }
    weaponHitted(target) {
        this.activeStatsEffect.forEach(element => {
            element.weaponHitted(target);
        });
    }
    build() {
        super.build();

        this.activeStatsEffect = [];
        this.statsDictionary = {}

        this.invencibleSpawnTime = 0.5;

        this.health = this.addComponent(Health)
        this.health.removeAllSignals();

        this.health.gotKilled.add(this.die.bind(this))
        this.health.reset()

        this.angleChunk = 360 / this.totalDirections;
        this.angleChunkRad = Math.PI * 2 / this.totalDirections;
        this.timer = Math.random()
        this.speed = 20 * Math.random() + 10
        this.speedAdjust = 1;
        this.dying = false;

    }
    afterBuild() {
        super.afterBuild();
        this.flashOnDamage = this.addComponent(FlashOnDamage);
        //this.flashOnDamage.startFlash(null,null,0x00FFFF)
    }
    update(delta) {
        super.update(delta);
        if (this.invencibleSpawnTime > 0) {
            this.invencibleSpawnTime -= delta;
        }
        if (this.isPlayer) {
            //console.log(this.activeStatsEffect)
        }


    }

    lateUpdate(delta) {
        super.lateUpdate(delta);
        for (let index = this.activeStatsEffect.length - 1; index >= 0; index--) {
            const element = this.activeStatsEffect[index];
            if (element.isDestroyed) {
                this.activeStatsEffect.splice(index, 1);
                this.statsDictionary[element.statModifierData.id] = null;
            }
        }
    }
    onRender() {
    }
    destroy() {
        if (this.isDestroyed) return;
        super.destroy();

        this.activeStatsEffect.forEach(element => {
            if (!element.isDestroyed) {
                element.destroy();
            }
        });
    }

    calcFrame() {
        let ang = (this.transform.angle) * 180 / Math.PI + 90

        if (ang < 0 || ang > 180) {
            this.view.scale.x = -Math.abs(this.view.scale.x)
        } else {
            this.view.scale.x = Math.abs(this.view.scale.x)
        }

        ang = Math.abs(ang)
        if (ang > 180) {
            ang = 180 - ang % 180
        }
        let layer = Math.floor(ang / (180 / this.totalDirections))
        if (layer < 0) {
            layer += this.totalDirections
        }
        layer %= this.totalDirections
        return layer;
    }

    makeAnimations(data, alwaysWalking = false) {
        let spriteSheet = this.addComponent(GameViewSpriteSheet);
        let animData1 = {}
        spriteSheet.alwaysWalking = alwaysWalking;
        let idle = GameStaticData.instance.getSharedDataById('animation', data.animationData.idle).animationData

        let run = data.animationData.run ? GameStaticData.instance.getSharedDataById('animation', data.animationData.run) : null;

        if (run) {
            animData1[GameViewSpriteSheet.AnimationType.Running] = run.animationData;
        } else {
            animData1[GameViewSpriteSheet.AnimationType.Running] = idle;
        }
        animData1[GameViewSpriteSheet.AnimationType.Idle] = idle;

        spriteSheet.setData(animData1);
        spriteSheet.update(0.1);


        return spriteSheet;
    }
}