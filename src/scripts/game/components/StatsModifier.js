import BaseComponent from '../core/gameObject/BaseComponent';
import EffectsManager from '../manager/EffectsManager';
import EntityBuilder from '../screen/EntityBuilder';
import GameObject from '../core/gameObject/GameObject';
import GameStaticData from '../data/GameStaticData';
import GameView from '../core/view/GameView';
import ParticleDescriptor from './particleSystem/ParticleDescriptor';
import PlayerHalo from '../entity/PlayerHalo';
import RenderModule from '../core/modules/RenderModule';
import SpriteSheetAnimation from './utils/SpriteSheetAnimation';
import Utils from '../core/utils/Utils';
import signals from 'signals';

export default class StatsModifier extends GameObject {
    static StatActionType = {
        OnShoot: 'OnShoot',
        OnGetHit: 'OnGetHit',
        OverTime: 'OverTime',
        OnHitEnemy: 'OnHitEnemy',
    }
    static ModifierType = {
        Health: 'Health'
    }
    constructor() {
        super();

        this.gameView = new GameView(this)
        this.gameView.view = new PIXI.Sprite()
        this.viewOffset = { x: 0, y: 0 }

        this.isOverTime = true;
        this.actionTime = 5;
        this.interval = 3;
        this.currentTimer = 3;

        this.effectOnHit = null

        this.level = 0;

        this.spritesheetAnimation = new SpriteSheetAnimation();
    }

    start() {
        this.renderModule = this.engine.findByType(RenderModule)
    }
    restart() {
        this.actionTime = this.statModifierData.timeActive;
        this.interval = this.statModifierData.interval;
    }
    build(data) {

        this.view = this.gameObject.gameView.view;

        this.statModifierData = data;
        this.activeDescriptor = this.statModifierData.descriptor

        if (this.spritesheetAnimation) {
            this.spritesheetAnimation.reset();
            this.spritesheetAnimation.stop();
        }

        this.effectOnHit = null

        if (!this.activeDescriptor) {

            let dataVfx = this.statModifierData.vfx || this.statModifierData.vfxAlt;

            if (dataVfx) {
                this.mainDescriptor = GameStaticData.instance.getDescriptor(dataVfx);

                if (this.statModifierData.vfxAlt) {
                    this.setData(GameStaticData.instance.getSharedDataById('vfx', dataVfx))
                } else {
                    this.setData(GameStaticData.instance.getSharedDataById('vfx', dataVfx))
                }
                if (!this.statModifierData.vfxSpawnOnAction) {
                    this.spawnVfx();
                }

                let light = this.engine.poolGameObject(PlayerHalo)
                light.setRadius(100)
                light.setColor(null, 0.1)
                this.addChild(light)
            }

        } else {
            this.gameView.view.visible = false;
        }
        this.gameView.view.width = this.parent.rigidBody.circleRadius * 2
        this.gameView.view.height = this.parent.rigidBody.circleRadius * 2

        this.actionTime = this.statModifierData.timeActive;
        this.interval = this.statModifierData.interval;
        this.currentTimer = this.interval / 2;

        if (this.statModifierData.actionType == StatsModifier.StatActionType.OnGetHit) {
            this.parent.health.gotDamaged.add(this.gotDamaged.bind(this))
        }

    }

    setData(data) {

        this.spritesheetAnimation.reset();

        const animData = {
            time: data.time / (data.endFrame - data.startFrame),
            loop: data.loop,
            anchor: data.anchor,
            totalFramesRange: { min: data.startFrame, max: data.endFrame },
            addZero: data.addZero
        }

        this.spritesheetAnimation.addLayer('default', data.spriteName, animData);

        this.spritesheetAnimation.stop();

        this.view.texture = this.spritesheetAnimation.currentTexture
    }

    spawnVfx() {
        if (this.statModifierData.vfxSpawnOnAction) {
            this.spritesheetAnimation.playOnce('default')
        } else {

            this.spritesheetAnimation.play('default')
        }
    }
    weaponHitted(target) {
        if (Math.random() > Utils.findValueByLevel(this.statModifierData.chance, this.level)) {
            return;
        }
        if (this.statModifierData.actionType == StatsModifier.StatActionType.OnHitEnemy) {
            if (target && !target.isDead) {
                target.addStatsModifier(this.effectOnHit.id, this.level)
            }
            this.applyEffect();
        }
    }
    gotDamaged() {
        this.applyEffect();
    }
    applyEffect() {

        if (this.statModifierData.type == StatsModifier.ModifierType.Health) {
            let value = Utils.findValueByLevel(this.statModifierData.value, this.level);
            if (this.statModifierData.isRelative) {
                value = Math.ceil(this.parent.health.maxHealth * value);
            }
            if (value < 0) {
                if (!this.parent.health.canHeal) {
                    return;
                }
                this.parent.heal(-value, this.statModifierData.customFont);
            } else if (value > 0) {
                this.parent.damage(value, this.statModifierData.customFont);
            }

        }

        if (this.statModifierData.vfxSpawnOnAction) {
            this.spawnVfx();
        }
    }

    update(delta) {
        super.update(delta);

        this.currentTimer -= delta;
        this.actionTime -= delta;

        this.x = this.parent.transform.position.x
        this.z = this.parent.transform.position.z + 1


        if (this.spritesheetAnimation && this.spritesheetAnimation.isPlaying) {
            this.spritesheetAnimation.update(delta);
            this.view.texture = this.spritesheetAnimation.currentTexture
            if (this.spritesheetAnimation.currentAnimation) {
                this.view.anchor.x = this.spritesheetAnimation.anchor.x;
                this.view.anchor.y = this.spritesheetAnimation.anchor.y;
            }
        } else {
            this.view.texture = PIXI.Texture.EMPTY;
        }


        if (this.parent.isDestroyed || this.actionTime <= 0) {
            this.destroy();
            return;
        }

        if (this.statModifierData.actionType != StatsModifier.StatActionType.OverTime) {
            return;
        }

        if (this.currentTimer <= 0) {
            this.currentTimer = this.interval;

            this.applyEffect();

            if (!this.isOverTime) {
                this.destroy();
            }
        }

        this.gameView.view.visible = true;
    }
    destroy() {
        super.destroy();
        if (this.spriteSheet) {
            this.gameObject.removeComponent(this.spriteSheet);
            this.spriteSheet = null;
        }
        this.gameView.view.visible = false;
    }
}