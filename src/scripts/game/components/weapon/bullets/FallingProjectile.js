import Bullet from "./Bullet";
import FloorTarget from "../../view/FloorTarget";
import RenderModule from "../../../core/modules/RenderModule";
import Utils from "../../../core/utils/Utils";

export default class FallingProjectile extends Bullet {
    constructor() {
        super();
    }
    build(weapon, parent, fromPlayer) {
        
        super.build(weapon, parent, fromPlayer)
        
        //this.gameView.layer = RenderModule.RenderLayers.Default
        this.target = weapon;

        this.timeToFall = 3;
        this.currentTime = 0;

        let target = this.engine.poolGameObject(FloorTarget)
        this.addChild(target)
        target.updateScale(2)

        this.high = weapon.weaponViewData.baseViewData.maxHeight || 200;

        this.transform.position.y = -this.high
        this.gameView.view.visible = false;

        
        
    }
    collisionEnter() { }
    update(delta) {
        super.update(delta);
        
        this.gameView.view.visible = true;
        this.gameView.view.scale.set(1)
        this.gameView.view.alpha = 1
        this.currentTime += delta;
        this.normalized = this.currentTime / this.timeToFall;
        this.transform.position.y = Utils.easeOutCubic(1 - this.normalized) * -this.high;
        this.gameView.view.rotation = Math.PI
        if (this.currentTime <= 0) {
            this.gameView.view.visible = false;
            this.destroy();
        }
    }

}