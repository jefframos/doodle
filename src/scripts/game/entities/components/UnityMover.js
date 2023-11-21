import BaseComponent from "../../core/gameObject/BaseComponent";
import BaseMap from "../units/maps/BaseMap";
import Vector3 from "../../core/gameObject/Vector3";

export default class UnityMover extends BaseComponent {
    constructor() {
        super();

        this.angle = 0;
        this.speed = 1;
        this.currentTarget = null;
    }
    enable() {
        super.enable();

        this.worldMap = this.engine.findByType(BaseMap);

    }
    findClosestTower(point) {
        let closest = 0;
        let minDist = 999999;
        for (var i = 0; i < this.targets.length; i++) {
            let tower = this.targets[i];

            let dist = Vector3.distance(tower.transform.position, point)
            if (dist < minDist) {
                minDist = dist;
                closest = i;
            }
        }

        return this.targets[closest];
    }
    refreshTargets() {
        this.targets = this.worldMap.getEnemieTowers();
        this.currentTarget = this.findClosestTower(this.gameObject.transform.position)
        this.angle = Vector3.atan2XZ(this.currentTarget.transform.position, this.gameObject.transform.position)
    }
    update(delta) {
        this.refreshTargets()
        this.gameObject.physics.velocity.x = Math.cos(this.angle) * this.speed
        this.gameObject.physics.velocity.z = Math.sin(this.angle) * this.speed

        if(Vector3.distance(this.currentTarget.transform.position, this.gameObject.transform.position) < 30){
            this.gameObject.health.damage(20)
        }

    }
}