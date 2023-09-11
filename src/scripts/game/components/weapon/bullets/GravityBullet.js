import Bullet from "./Bullet";
import Shadow from "../../view/Shadow";

export default class GravityBullet extends Bullet {
    constructor() {
        super();
    }
    build(weapon, parent, fromPlayer) {
        super.build(weapon, parent, fromPlayer)

        this.target = weapon;

        this.timeToFall = weapon.weaponAttributes.baseLifeRangeSpan / weapon.weaponAttributes.baseBulletSpeed;
        this.currentTime = 0;       
        
        this.addChild(this.engine.poolGameObject(Shadow))

        this.high = weapon.weaponViewData.baseViewData.maxHeight;
    }
    collisionEnter() { }
    update(delta) {
        super.update(delta);

        this.currentTime += delta;
        this.normalized = this.currentTime / this.timeToFall;

        this.transform.position.y = this.easeOutQuad(this.normalized * 2) * -this.high;

        if (this.currentTime <= 0) {
            this.destroy();
        }
    }
    easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
    easeOutQuad(x) {
        return 1 - (1 - x) * (1 - x);
    }

    easeInQuad(x) {
        return x * x;
    }
}