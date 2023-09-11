import * as PIXI from 'pixi.js';

import Signals from 'signals';
import config from '../../../../config';
import utils from '../../../../utils';

export default class StandardBullet extends PIXI.Container {
    constructor() {
        super();
        this.speed = 120
        this.resetVelocity();

        this.entitySprite = PIXI.Sprite.from('arrow');
        this.entitySprite.anchor.set(0.5)
        // this.entitySprite.tint = 0xFF0000;

        this.addChild(this.entitySprite)

        this.entitySprite.y = -20

        this.acceleration = { x: 1, y: 1 };
        this.gravity = 2;

        this.spriteVelocity = { x: 0, y: 0 }

        this.onCollide = new Signals();
        this.onDestroy = new Signals();

        this.type = 'physical'
    }

    reset() {
        this.shotting = false;
    }
    shoot(entity, target, targetList, bulletData) {
        //usar bullet speed
        this.speed = bulletData.speed;

        this.entitySprite.scale.set(entity.radius / this.entitySprite.width / this.entitySprite.scale.x)

        this.entity = entity;

        this.target = target;
        this.attackAngle = Math.atan2(entity.y - target.y, entity.x - target.x);
        this.entitySprite.rotation = this.attackAngle - Math.PI / 2

        this.targetList = targetList;
        this.velocity.x = -(this.speed) * Math.cos(this.attackAngle);
        this.velocity.y = -(this.speed) * Math.sin(this.attackAngle);

        this.shotting = true;
    }
    update(delta) {
        if (!this.shotting) {
            this.alpha -= delta / 10;
            if (this.alpha <= 0) {
                this.onDestroy.dispatch(this);
            }
            return;
        } else {
            for (var i = this.targetList.length - 1; i >= 0; i--) {
                let targ = this.targetList[i];
                let pass = true;
                if (this.targetList.length > 1 && targ != this.target) {
                    if (this.entity == targ) {
                        pass = false
                    }
                }
                if (pass && targ.actionType != StandardEntity.ACTIONS.DEAD) {
                    if (utils.distance(this.x, this.y, targ.x, targ.y) < targ.radius) {
                        this.collide(targ);
                        return;
                    }
                }
            }
            this.updateForces(delta);
            this.updateGravity(delta);
        }
    }
    collide(target) {
        this.onCollide.dispatch(this.entity, target, this.type)
        this.onDestroy.dispatch(this);
    }
    updateForces(delta) {
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;
    }

    updateGravity(delta) {
        this.entitySprite.y -= this.spriteVelocity.y * delta;
        this.spriteVelocity.y -= this.gravity * delta;

        if (this.entitySprite.y >= 0) {
            this.entitySprite.y = 0;
            this.shotting = false;
        }
    }

    udpateVelocity() {
        let axis = ['x', 'y']
        for (var i = 0; i < axis.length; i++) {
            if (this.velocity[axis[i]] < this.virtualVelocity[axis[i]]) {
                this.velocity[axis[i]] += this.acceleration[axis[i]];
                if (this.velocity[axis[i]] > this.virtualVelocity[axis[i]]) {
                    this.velocity[axis[i]] = this.virtualVelocity[axis[i]];
                }
            } else if (this.velocity[axis[i]] > this.virtualVelocity[axis[i]]) {
                this.velocity[axis[i]] -= this.acceleration[axis[i]];
                if (this.velocity[axis[i]] < this.virtualVelocity[axis[i]]) {
                    this.velocity[axis[i]] = this.virtualVelocity[axis[i]];
                }
            }
        }

    }
    resetVelocity() {
        this.jumpForce = 0;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.virtualVelocity = {
            x: 0,
            y: 0
        }
    }
}