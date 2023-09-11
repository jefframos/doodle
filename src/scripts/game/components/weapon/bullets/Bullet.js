import BaseEnemy from "../../../entity/BaseEnemy";
import BaseWeapon from "../BaseWeapon";
import EffectsManager from "../../../manager/EffectsManager";
import GameData from "../../../data/GameData";
import GameManager from "../../../manager/LevelManager";
import GameView from "../../../core/view/GameView";
import Layer from "../../../core/Layer";
import PhysicsEntity from "../../../core/physics/PhysicsEntity";
import PhysicsModule from "../../../core/modules/PhysicsModule";
import Player from "../../../entity/Player";
import PlayerHalo from "../../../entity/PlayerHalo";
import RenderModule from "../../../core/modules/RenderModule";
import Shadow from "../../view/Shadow";
import SpriteSheetAnimation from "../../utils/SpriteSheetAnimation";
import Utils from "../../../core/utils/Utils";
import Vector3 from "../../../core/gameObject/Vector3";
import WeaponAttributes from "../../../data/WeaponAttributes";
import config from "../../../../config";
import signals from "signals";

export default class Bullet extends PhysicsEntity {
    constructor() {
        super();

        this.gameView = new GameView(this)
        this.gameView.view = new PIXI.Sprite()
        this.gameView.view.alpha = 1
        this.hitting = false;
        this.enemiesShot = [];


        this.onSpawn = new signals.Signal;
        this.onDestroy = new signals.Signal;
        this.onDestroyOnHit = new signals.Signal;
        this.onHit = new signals.Signal;

        this.spritesheetAnimation = new SpriteSheetAnimation();
        this.baseScale = { x: 1, y: 1 }
        //   this.setDebug(15)
    }
    build(weapon, parent, fromPlayer) {
        super.build()
        this.weapon = weapon;
        this.piercing = 0;
        if (weapon.weaponViewData.baseViewData.targetLayer == EffectsManager.TargetLayer.BaseLayer) {
            if (this.gameView.layer != RenderModule.RenderLayers.Default) {

                this.renderModule.swapLayer(this.gameView, RenderModule.RenderLayers.Default)
            }
        } else if (this.gameView.layer != RenderModule.RenderLayers.Gameplay) {
            this.renderModule.swapLayer(this.gameView, RenderModule.RenderLayers.Gameplay)
        }

        this.spawnParent = parent;
        this.safeTimer = 10;

        this.originPosition = parent.transform.position.clone()

        this.resetEvents();



        this.buildCircle(0, 0, this.weapon.weaponAttributes.radius)
        //this.setDebug()

        this.hitting = false;

        this.forceField = this.weapon.weaponAttributes.forceField;

        this.distanceSpan = 0;
        this.enemiesShot = [];

        this.rigidBody.collisionFilter.group = 2
        this.rigidBody.collisionFilter.mask = 3

        this.speed = this.weapon.weaponAttributes.bulletSpeed


        let player = null;
        if (fromPlayer) {
            player = this.engine.findByType(Player)
        }

        this.critical = 0;
        if (this.weapon.weaponAttributes.useRelativePower) {
            let att = parent.attributes;
            if (!att && parent.parent) {
                att = parent.parent.attributes
            }
            if (!att && parent.parent.parent) {
                att = parent.parent.parent.attributes
            }
            if (!att && this.spawnParent) {
                att = this.spawnParent.attributes
            }
            if (!att && this.spawnParent.spawnParent.parent) {
                att = this.spawnParent.spawnParent.parent.attributes
            }
            this.power = this.weapon.weaponAttributes.power * att.defaultPower
        } else {
            this.power = this.weapon.weaponAttributes.power;

            if (fromPlayer) {
                this.power = player.attributes.power;
                this.critical = player.attributes.critical;
            }
        }

        if (fromPlayer) {
            this.piercing = player.attributes.piercing;
        }
        this.piercing += this.weapon.weaponAttributes.piercing;

        //console.log(this.piercing)

        this.power = Math.round(this.power)
        this.usesTime = this.weapon.weaponAttributes.lifeRangeSpan <= 0;
        this.lifeSpan = this.weapon.weaponAttributes.lifeSpan
        this.distanceSpan = this.weapon.weaponAttributes.lifeRangeSpan;

        this.normalizedKillTime = 1;
        this.totalTime = this.usesTime ? this.weapon.weaponAttributes.lifeSpan : this.distanceSpan / this.speed;

        //console.log(fromPlayer)
        this.fromPlayer = fromPlayer;
        if (fromPlayer) {
            this.layerCategory = Layer.Bullet
            this.layerMask = Layer.BulletCollision
        } else {
            this.layerCategory = Layer.EnemyBullet
            this.layerMask = Layer.EnemyBulletCollision
        }

        this.rigidBody.isSensor = true

        this.gameView.view.rotation = 0;
        this.gameView.view.alpha = 1;
        this.gameView.view.visible = true;

        this.fromWeapon = this.spawnParent instanceof BaseWeapon

        this.rotationSpeed = Utils.findValue(this.weapon.weaponViewData.rotationSpeed);
        if (this.weapon.weaponViewData.baseViewData.rotationSpeed !== undefined) {
            this.rotationSpeed = Utils.findValue(this.weapon.weaponViewData.baseViewData.rotationSpeed);
        }




        if (this.spritesheetAnimation) {
            this.spritesheetAnimation.reset();
            this.spritesheetAnimation.stop();
        }

        if (this.weapon.weaponViewData.baseViewData.hasAnimation) {
            this.setBulletAnimation();
        }

    }

    afterBuild() {
        super.afterBuild();

        if (this.weapon.weaponViewData.baseViewData.hasShadow) {

            this.shadow = this.engine.poolGameObject(Shadow)
            this.shadow.transform.position.x = this.transform.position.x
            this.shadow.transform.position.z = this.transform.position.z
            this.addChild(this.shadow)
        }


        // let light = this.engine.poolGameObject(PlayerHalo)
        // light.setRadius(100)
        // light.setColor(null, 0.1)
        // this.addChild(light)
    }

    setBulletAnimation() {

        this.spritesheetAnimation.reset();

        const animData = {
            time: 0.1,
            loop: true,
            totalFramesRange: { min: this.weapon.weaponViewData.baseViewData.frames[0], max: this.weapon.weaponViewData.baseViewData.frames[1] },
        }

        this.spritesheetAnimation.addLayer('default', this.weapon.weaponViewData.baseViewData.viewData, animData);

        this.spritesheetAnimation.stop();

        this.gameView.view.texture = this.spritesheetAnimation.currentTexture

        this.spritesheetAnimation.play('default')

    }
    enable() {
        super.enable();
        this.gameView.view.visible = false
    }
    shoot(ang, magnitude) {
        this.enemiesShot = [];


        this.angle = ang;

        //this.speed += this.speed * magnitude * 0.5
        this.gameView.view.rotation = this.angle + Math.PI / 2

        this.gameView.view.scale.set(1);


        this.physics.velocity.x = 0
        this.physics.velocity.y = 0
        this.physics.velocity.z = 0

        this.endGravity = 0;
        this.onSpawn.dispatch(this)

        this.baseScale = { x: this.gameView.view.scale.x, y: this.gameView.view.scale.y }
        this.baseAnchor = { x: this.gameView.view.anchor.x, y: this.gameView.view.anchor.y }
        this.baseHeight = this.transform.position.y || this.viewOffset.y;

        this.timeAlive = 0;
    }
    collisionExit(collided) {
        if (this.enemiesShot.filter(item => item.entity == collided).length <= 0) return;
        //console.log(this.enemiesShot.filter(item => item.entity == collided))
        this.enemiesShot = this.enemiesShot.filter(item => item.entity !== collided)

    }
    collisionEnter(collided) {
        if (collided.rigidBody.isSensor) {
            return;
        }
        if (this.enemiesShot.filter(item => item.entity == collided).length > 0) {
            return;
        }
        this.enemiesShot.push({ entity: collided, timer: this.weapon.weaponAttributes.damageOverTime });
        if (false && collided.rigidBody.isStatic) {
            this.destroy()

        } else {
            if (collided.die) {

                collided.getShot(this.power, Math.random() < (this.critical));
                this.piercing--;
                this.onHit.dispatch(this, collided);

                if (collided.dying) {
                    //if kill enemy
                } else {
                    if (collided.applyForce && this.weapon.weaponAttributes.forceFeedback) {
                        let angle = 0;
                        if (this.forceField && this.fromWeapon) {
                            angle = Math.atan2(collided.transform.position.z - this.spawnParent.transform.position.z, collided.transform.position.x - this.spawnParent.transform.position.x);
                        } else {
                            angle = Math.atan2(collided.transform.position.z - this.transform.position.z, collided.transform.position.x - this.transform.position.x);
                        }
                        let forceBack = { x: Math.cos(angle) * this.weapon.weaponAttributes.forceFeedback, y: Math.sin(angle) * this.weapon.weaponAttributes.forceFeedback };
                        collided.applyForce(forceBack)
                    }
                }

                this.afterCollide(collided);

                if (this.piercing <= 0) {
                    this.onDestroyOnHit.dispatch(this);
                    this.destroy()
                }
                //this.destroy()
            } else {

                if (!collided.rigidBody.isStatic) {

                    this.onDestroyOnHit.dispatch(this);
                    collided.destroy();
                }
            }
            //this.destroy()
        }

        //console.log(this.enemiesShot)
    }
    afterCollide(entity) { }
    start() {
        this.physicsModule = this.engine.findByType(PhysicsModule)
        this.renderModule = this.engine.findByType(RenderModule)

    }

    update(delta, unscaleDelta) {
        super.update(delta)

        this.timeAlive += delta;

        this.physics.velocity.x = Math.cos(this.angle) * this.speed * delta
        this.physics.velocity.z = Math.sin(this.angle) * this.speed * delta

        this.gameView.view.x = this.transform.position.x
        this.gameView.view.y = this.transform.position.z + this.viewOffset.y


        this.enemiesShot.forEach(element => {
            if (element.entity.enabledAndAlive) {

                if (element.timer <= 0 && element.entity.damage) {
                    element.entity.damage(this.power);
                    element.timer = this.weapon.weaponAttributes.damageOverTime;
                } else {
                    element.timer -= delta;
                }
            }
        });


        if (this.weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.Hoaming) {
            let closest = GameManager.instance.findClosestEnemy(this.transform.position)
            if (closest && this.timeAlive > 0.7) {
                this.smoothAngle(Vector3.atan2XZ(closest.transform.position, this.transform.position), delta * 3)
            }
        }


        if (this.rotationSpeed) {
            this.gameView.view.rotation += this.rotationSpeed * delta + this.weapon.weaponViewData.baseViewData.angleOffset;
        } else {
            let targetAngle = 0;

            if (!this.weapon.weaponViewData.baseViewData.lockRotation) {
                targetAngle = this.transform.angle
            }

            if (this.weapon.weaponViewData.baseViewData.rotationFacing) {
                this.gameView.view.rotation = Math.atan2(0, Math.abs(this.physics.velocity.x))
            } else {

                this.gameView.view.rotation = targetAngle + this.weapon.weaponViewData.baseViewData.angleOffset;
            }
        }
        this.gameView.view.visible = true;
        if (!this.usesTime) {

            this.distanceSpan -= this.speed * delta;

            this.normalizedKillTime = this.distanceSpan / this.weapon.weaponAttributes.lifeRangeSpan;

            if (this.distanceSpan <= 0) {
                this.normalizedKillTime = 0;
                if (this.weapon.weaponAttributes.extendedBehaviour == WeaponAttributes.ExtendedBehaviour.Boomerang) {

                    let targetPosition = this.originPosition

                    if (this.fromWeapon) {
                        targetPosition = this.spawnParent.transform.position;
                    }


                    this.smoothAngle(Vector3.atan2XZ(targetPosition, this.transform.position), delta * 2)


                    this.safeTimer -= delta;
                    if (Vector3.distance(targetPosition, this.transform.position) < this.weapon.weaponAttributes.radius * 2 || this.safeTimer <= 0) {
                        this.destroy()
                    }

                } else {
                    this.destroy()
                }
            }

        } else {
            this.lifeSpan -= delta
            this.normalizedKillTime = this.lifeSpan / this.weapon.weaponAttributes.lifeSpan;

            if (this.lifeSpan <= 0) {
                this.normalizedKillTime = 0;

                this.destroy()
            }
        }
        if (this.normalizedKillTime < this.weapon.weaponViewData.baseViewData.fallTimer) {
            let remaining = this.normalizedKillTime * this.totalTime;
            remaining /= this.totalTime * this.weapon.weaponViewData.baseViewData.fallTimer
            this.transform.position.y = Math.min(0, Utils.lerp(this.baseHeight, this.baseHeight * remaining, 1));
        }



        this.updateFacing();


        if (this.spritesheetAnimation.isPlaying) {
            this.spritesheetAnimation.update(delta);
            this.gameView.view.texture = this.spritesheetAnimation.currentTexture
        }

    }
    updateFacing() {
        let up = Math.sin(this.angle) > 0
        let right = Math.cos(this.angle) > 0

        let faceDirection = 1;
        if (!right) {
            faceDirection = -1
        } else {
            faceDirection = 1
        }

        if (!this.weapon.weaponViewData.baseViewData.rotationFacing) {
            this.gameView.view.scale.y = this.baseScale.y * faceDirection
        } else {

            this.gameView.view.scale.x = this.baseScale.x * faceDirection
        }
    }
    smoothAngle(target, delta) {
        let ang = target

        let scale = 1 / 60 / delta;
        scale *= 0.1;
        scale = Math.max(scale, 0.05)
        scale = Math.min(scale, 0.95)
        this.angle = Utils.angleLerp(this.angle, ang, scale * 2);
    }
    destroy() {

        this.gameView.view.visible = false;
        this.gameView.view.scale.set(1);

        this.onDestroy.dispatch(this);
        super.destroy();
    }
    resetEvents() {
        this.onSpawn.removeAll();
        this.onDestroy.removeAll();
        this.onDestroyOnHit.removeAll();
        this.onHit.removeAll();
    }
}