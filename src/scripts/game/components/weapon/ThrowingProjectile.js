import BaseWeapon from "./BaseWeapon";
import Bullet from "./bullets/Bullet";
import WeaponAttributes from "../../data/WeaponAttributes";

export default class ThrowingProjectile extends BaseWeapon {
    constructor() {
        super();

    }
  
    shoot() {
        let bullets = super.shoot();
    }
    update(delta) {
        super.update(delta);
    }
    destroy(){
        super.destroy();
    }
}