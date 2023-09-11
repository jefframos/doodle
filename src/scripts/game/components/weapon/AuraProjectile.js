import BaseWeapon from "./BaseWeapon";
import Bullet from "./bullets/Bullet";
import WeaponAttributes from "../../data/WeaponAttributes";

export default class AuraProjectile extends BaseWeapon {
    constructor() {
        super();

    }

    shoot(customWeapon, customParent) {
        let bullets = super.shoot(customWeapon, customParent);
        bullets.forEach(bullet => {
            if (bullet.weapon == this.weaponData) {
                this.interactiveProjectiles.push({ angle: bullet.ang, projectile: bullet, distance: 0 })
                bullet.physics.velocity.x = 0
                bullet.physics.velocity.y = 0
                bullet.physics.velocity.z = 0

            }
        });

        return bullets
    }
    update(delta) {
        super.update(delta);

        for (let i = this.interactiveProjectiles.length - 1; i >= 0; i--) {
            let element = this.interactiveProjectiles[i];
            if(!element) continue;
            if (!element.projectile.enabledAndAlive) {
                this.removeProjectile(element.projectile)
            } else {
                element.projectile.x = this.transform.position.x
                element.projectile.z = this.transform.position.z
            }

        }
    }
    removeProjectile(element) {
        if (element.projectile && element.projectile.enabledAndAlive) {
            element.projectile.destroy();
        }
        this.interactiveProjectiles = this.interactiveProjectiles.filter(item => item.projectile !== element)
    }
    destroy() {
        super.destroy();
    }
}