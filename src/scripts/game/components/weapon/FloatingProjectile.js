import BaseWeapon from "./BaseWeapon";
import EffectsManager from "../../manager/EffectsManager";
import EntityViewData from "../../data/EntityViewData";

export default class FloatingProjectile extends BaseWeapon {
    constructor() {
        super();
        console.log(this)
    }


    shoot(customWeapon, customParent) {
        let bullets = super.shoot(customWeapon, customParent);
        bullets.forEach(bullet => {
            if (bullet.weapon == this.weaponData) {
                this.interactiveProjectiles.push({ angle: bullet.spawnAngle, projectile: bullet, distance: 0 })
                bullet.physics.velocity.x = 0
                bullet.physics.velocity.y = 0
                bullet.physics.velocity.z = 0

            }
        });

        return bullets
    }
    removeProjectile(element) {
        if (element.projectile && element.projectile.enabledAndAlive) {
            element.projectile.destroy();
        }
        this.interactiveProjectiles = this.interactiveProjectiles.filter(item => item.projectile !== element)
    }
    update(delta) {
        super.update(delta);

        for (let i = this.interactiveProjectiles.length - 1; i >= 0; i--) {
            let element = this.interactiveProjectiles[i];

            if (!element.projectile.enabledAndAlive) {
                this.removeProjectile(element.projectile)
            } else {
                element.angle += delta * this.weaponData.weaponAttributes.bulletSpeed;
                element.distance += element.projectile.weapon.weaponAttributes.damageZone * delta;
                element.distance = Math.min(element.distance, element.projectile.weapon.weaponAttributes.damageZone)
                element.projectile.x = this.transform.position.x + Math.cos(element.angle) * element.distance;
                element.projectile.z = this.transform.position.z + Math.sin(element.angle) * element.distance;
                element.projectile.angle = element.angle
            }

        }
    }

    sortGraphics(type, bullet, customWeapon) {
        let weapon = customWeapon ? customWeapon : this.weaponData

        let isMain = weapon == this.weaponData;

        //TODO: ADD OPTION TO GET THE TRANSFORM ANGLE FOR THE SPRITESHEET
        let baseData = weapon.weaponViewData[type]
        if (isMain && baseData.viewType == EntityViewData.ViewType.SpriteSheet && bullet.spawnOrder == 0) {
            let target = bullet.transform.position
            EffectsManager.instance.emitParticles(
                { x: target.x, y: target.z }, baseData.viewData, 1, { rotation: bullet.angle })

            //todo: not sure about this
            bullet.spawnOrder++
            super.sortGraphics(type, bullet, customWeapon)

        } else {
            super.sortGraphics(type, bullet, customWeapon)
        }

    }

    destroyBullet(bullet) {
        super.destroyBullet(bullet)
        this.removeProjectile(bullet)
    }

    destroy() {
        super.destroy();
        this.interactiveProjectiles.forEach(element => {
            element.projectile.destroy();
        });
        this.interactiveProjectiles = []
    }
}