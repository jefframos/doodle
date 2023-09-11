import Bullet from "./Bullet";

export default class SinoidBullet extends Bullet {
    constructor() {
        super();
    }
    build(weapon, parent, fromPlayer) {
        super.build(weapon, parent, fromPlayer)

        this.target = weapon;

        this.sin = 0;
    }
    update(delta) {
        super.update(delta);
        this.sin += delta * 4;
        let ang = this.angle + Math.cos(this.sin);
        this.physics.velocity.x = Math.cos(ang)* this.speed * delta;
        this.physics.velocity.z = Math.sin(ang)* this.speed * delta;
    }
    
}