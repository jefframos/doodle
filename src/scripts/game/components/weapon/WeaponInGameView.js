import BaseBarView from '../ui/progressBar/BaseBarView';
import BaseWeapon from './BaseWeapon';
import Eugine from '../../core/Eugine';
import GameObject from '../../core/gameObject/GameObject';
import GameView from '../../core/view/GameView';
import RenderModule from '../../core/modules/RenderModule';
import Spring from '../../core/utils/Spring';
import SpriteSheetAnimation from '../utils/SpriteSheetAnimation';
import Utils from '../../core/utils/Utils';
import WeaponAttributes from '../../data/WeaponAttributes';
import signals from 'signals';

export default class WeaponInGameView extends GameObject {
    constructor() {
        super();
        this.spriteList = [];

        this.gameView = new GameView(this)
        this.gameView.view = new PIXI.Container()
        this.currentBulletList = []

        this.offset = { x: 0, y: 0 }
        this.viewOffset = { x: 0, y: 0 }

        this.spritesheetAnimation = new SpriteSheetAnimation();
    }
    enable() {
        super.enable();

        this.renderModule = this.engine.findByType(RenderModule)
        //this.renderModule.swapLayer(this.gameView, RenderModule.RenderLayers.Default)
    }
    setContainer(container) {
        this.container = this.gameView.view//container;
    }
    setData(weapon, parent) {
        this.parent = parent;
        this.weapon = weapon;

        let amount = weapon.ingameViewDataStatic.ingameAmountIconOverrider >= 0 ? weapon.ingameViewDataStatic.ingameAmountIconOverrider : weapon.weaponAttributes.amount;

        this.loadBars = [];

        this.spawnDistance = weapon.weaponAttributes.spawnDistance

        
        this.defautScale = { x: 1, y: 1 }
        for (var i = 0; i < amount; i++) {
            let sprite = new PIXI.Sprite.from(weapon.ingameViewDataStatic.ingameIcon);
            sprite.anchor.x = weapon.ingameViewDataStatic.anchor.x == undefined ? 0.5 : weapon.ingameViewDataStatic.anchor.x;
            sprite.anchor.y = weapon.ingameViewDataStatic.anchor.y == undefined ? 0.1 : weapon.ingameViewDataStatic.anchor.y;
            if (weapon.ingameViewDataStatic.ingameBaseWidth > 0) {

                sprite.scale.set(Utils.scaleToFit(sprite, weapon.ingameViewDataStatic.ingameBaseWidth || 30))
            } else {
                sprite.scale.set(Utils.scaleToFit(sprite,  20))

            }
            //all get same scale now
            sprite.scale.set(0.3)
            this.container.addChild(sprite)

            this.defautScale.x = sprite.scale.x
            this.defautScale.y = sprite.scale.y

            let spring = new Spring()
            spring.default = 1;
            spring.x = 1;
            spring.tx = 1;
            // sprite.visible = false;

            //console.log(weapon.ingameViewDataStatic)
            let bar = null;
            let hasBar = weapon.ingameViewDataStatic.progressBar.active;
            hasBar = false;
            if (hasBar) {
                let barData = weapon.ingameViewDataStatic.progressBar

                barData = {
                    width: 30,
                    height: 8,
                    rotation: Math.PI * 0.5,
                    x:-20,
                    y:30
                }
                bar = new BaseBarView();
                bar.build(barData.width, barData.height, 0)
                bar.rotation = barData.rotation
                bar.setColors(0xFF00FF, 0xFF0F0F)
                bar.x = barData.x;
                bar.y = barData.y;
                sprite.addChild(bar)
            }
            this.spriteList.push({ sprite, angle: 0, targetAngle: 0, spring, bar })
        }
        this.offset.x = this.weapon.weaponViewData.baseViewData.viewOffset.x || this.weapon.weaponViewData.baseSpawnViewData.viewOffset.x || weapon.ingameViewDataStatic.viewOffset.x
        this.offset.y = this.weapon.weaponViewData.baseViewData.viewOffset.y || this.weapon.weaponViewData.baseSpawnViewData.viewOffset.y || weapon.ingameViewDataStatic.viewOffset.y
        if (this.spritesheetAnimation) {
            this.spritesheetAnimation.reset();
            this.spritesheetAnimation.stop();
        }

        this.registerAnimations();

    }
    registerAnimations() {

        this.spritesheetAnimation.reset();

        if (!this.weapon.ingameViewDataStatic.defaultAnimation.active) {

            this.spritesheetAnimation.addFrame('default', this.weapon.ingameViewDataStatic.ingameIcon, this.weapon.ingameViewDataStatic.anchor);
        } else {
            const defaultData = {
                time: this.weapon.ingameViewDataStatic.defaultAnimation.time,
                loop: this.weapon.ingameViewDataStatic.defaultAnimation.loop,
                addZero: this.weapon.ingameViewDataStatic.defaultAnimation.addZero,
                totalFramesRange: { min: this.weapon.ingameViewDataStatic.defaultAnimation.min, max: this.weapon.ingameViewDataStatic.defaultAnimation.max },
            }
            this.spritesheetAnimation.addLayer('default', this.weapon.ingameViewDataStatic.defaultAnimation.sprite, defaultData);
        }

        if (this.weapon.ingameViewDataStatic.shootAnimation.active) {
            const shootData = {
                time: this.weapon.ingameViewDataStatic.shootAnimation.time,
                loop: this.weapon.ingameViewDataStatic.shootAnimation.loop,
                addZero: this.weapon.ingameViewDataStatic.shootAnimation.addZero,
                totalFramesRange: { min: this.weapon.ingameViewDataStatic.shootAnimation.min, max: this.weapon.ingameViewDataStatic.shootAnimation.max },

            }
            this.spritesheetAnimation.addLayer('shoot', this.weapon.ingameViewDataStatic.shootAnimation.sprite, shootData);

        }
        this.spritesheetAnimation.stop();
        this.spritesheetAnimation.play('default')
        this.gameView.view.texture = this.spritesheetAnimation.currentTexture;

    }
    updateBullets(bulletList) {
        this.currentBulletList = bulletList;
        for (let index = 0; index < this.currentBulletList.length; index++) {
            if (index >= this.spriteList.length) continue;
            const element = this.currentBulletList[index];
            const spriteElement = this.spriteList[index];
            spriteElement.targetAngle = element.angle + this.offsetAngle;
            spriteElement.spring.x = 0.5;
            spriteElement.spring.tx = 1;

            spriteElement.sprite.visible = false;
        }
        this.calcAngle();

        if (this.weapon.ingameViewDataStatic.shootAnimation.active) {
            this.spritesheetAnimation.playSequence('shoot', 'default')
        }

    }
    calcAngle() {
        if (this.weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.ParentAngle) {
            const totalBullets = this.spriteList.length;
            for (let index = 0; index < totalBullets; index++) {
                let facingAng = BaseWeapon.getFacingAngle(this.weapon, this.parent, this.alternateFacing);
                
                let halfAngle = this.weapon.weaponAttributes.angleOffset * index - (this.weapon.weaponAttributes.angleOffset * (totalBullets - 1) / 2)

                //console.log(this.weapon.weaponAttributes.angleOffset * index)

                let finalAng = facingAng + halfAngle;
                if (this.weapon.weaponAttributes.extendedBehaviour == WeaponAttributes.DirectionType.FacingBackwards) {
                    finalAng += Math.PI;
                }
                let ang = finalAng + this.weapon.weaponAttributes.angleStart;

                this.spriteList[index].targetAngle = ang + this.offsetAngle;
            }
        } else if (this.weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.FacingPlayer || this.weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.Hoaming) {
            const totalBullets = this.spriteList.length;
            for (let index = 0; index < totalBullets; index++) {
                this.spriteList[index].targetAngle = this.parent.facingAngle + this.offsetAngle;
            }
        } else if (this.weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.ParentDirection) {
            const totalBullets = this.spriteList.length;
            for (let index = 0; index < totalBullets; index++) {
                this.spriteList[index].targetAngle = this.parent.parent.latestAngle + this.offsetAngle;
            }
        }
    }

    update(delta) {
        delta *= Eugine.PhysicsTimeScale;

        this.offsetAngle = this.parent.offsetAngle

        for (let index = 0; index < this.currentBulletList.length; index++) {
            if (index >= this.spriteList.length) continue;

            const element = this.currentBulletList[index];
            const spriteElement = this.spriteList[index];
            spriteElement.targetAngle = element.angle;
        }
        this.spritesheetAnimation.update(delta);

        this.calcAngle();
        this.spriteList.forEach(element => {
            element.angle = Utils.angleLerp(element.angle, element.targetAngle, 0.8);
            element.spring.update()
            if (this.weapon.ingameViewDataStatic.inGameRotation) {
                element.sprite.rotation += delta * this.weapon.ingameViewDataStatic.inGameRotation
            } else {
                element.sprite.rotation = element.angle + Math.PI / 2
            }



            let faceDirection = 1;

            let extraY = 0;
            if (this.parent.parent) {
                extraY = this.parent.parent.transform.position.y;

            }
            element.sprite.x = Math.cos(element.angle) * this.spawnDistance + this.offset.x
            element.sprite.y = Math.sin(element.angle) * this.spawnDistance + this.offset.y + extraY * 0.9
            
            let up = Math.sin(element.angle) > 0
            let right = Math.cos(element.angle) > 0

            this.x = this.parent.transform.position.x
            this.z = this.parent.transform.position.z;
            if (up || (this.isAlwaysUp && this.offsetAngle == 0)) {
                this.z = this.parent.transform.position.z +1// this.renderModule.swapLayer(this.gameView, RenderModule.RenderLayers.FrontLayer)
            } else {
                this.z  = this.parent.transform.position.z -1;//this.renderModule.swapLayer(this.gameView, RenderModule.RenderLayers.BackLayer)
            }

            if (!right) {
                faceDirection = -1
            } else {
                faceDirection = 1
            }

            element.sprite.scale.y = element.spring.x * this.defautScale.y
            //element.sprite.scale.x = (element.spring.x * 0.2 + this.defautScale.x * 0.8) * faceDirection;
            element.sprite.scale.x = this.defautScale.x * faceDirection;


            if (element.bar) {
                element.bar.updateNormal(this.parent.shootNormal)
                element.bar.update(delta)
            }

            element.sprite.visible = true;
            element.sprite.texture = this.spritesheetAnimation.currentTexture
        });
    }
    get isAlwaysUp() {
        return this.weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.ParentAngle ||
            this.weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.FacingPlayer ||
            this.weapon.weaponAttributes.directionType == WeaponAttributes.DirectionType.Hoaming
    }
    destroy() {
        super.destroy();

        this.spriteList.forEach(element => {
            if (element.sprite.parent) {
                element.sprite.parent.removeChild(element.sprite);
            }
        });

        this.spriteList = [];
    }
}