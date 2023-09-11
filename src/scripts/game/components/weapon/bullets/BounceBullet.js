import Bullet from "./Bullet";
import GameManager from "../../../manager/LevelManager";
import Shadow from "../../view/Shadow";
import Vector3 from "../../../core/gameObject/Vector3";

export default class BounceBullet extends Bullet {
    constructor() {
        super();
        this.sin = 0;
        this.rotation = 0;
    }
    build(weapon, parent, fromPlayer) {
        super.build(weapon, parent, fromPlayer);
        this.addChild(this.engine.poolGameObject(Shadow))

        this.rotation = 0;

        this.deafultScale = {x:this.gameView.view.scale.x, y: this.gameView.view.scale.y}
    }
    afterCollide(entity) {

        let angle = Math.atan2(entity.transform.position.z - this.transform.position.z, entity.transform.position.x - this.transform.position.x);
        this.angle = angle + Math.PI + Math.random() * 0.1 - 0.5;
    }

    update(delta) {
        super.update(delta);
        if (GameManager.instance.distanceFromPlayer(Vector3.sum(this.transform.position, this.physics.velocity)) > this.weapon.weaponAttributes.detectionZone) {
            //this.angle = GameManager.instance.angleFromPlayer(this.transform.position) + Math.PI;
        }
        this.sin += delta * 7
        this.sin %= Math.PI
        
        let value = this.easeOutQuad(this.normalizedKillTime);
        this.rotation -= delta * 7 * value
        this.transform.position.y = Math.sin(this.sin) * -40 * value - this.weapon.weaponAttributes.radius
        this.gameView.view.rotation = this.rotation      
    }

    easeOutQuad(x) {
        return 1 - (1 - x) * (1 - x);
    }

}