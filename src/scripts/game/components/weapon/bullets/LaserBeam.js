import Beam from "./Beam";
import Bullet from "./Bullet";
import EffectsManager from "../../../manager/EffectsManager";
import Layer from "../../../core/Layer";
import Utils from "../../../core/utils/Utils";
import Vector3 from "../../../core/gameObject/Vector3";

export default class LaserBeam extends Bullet {
    constructor() {
        super();
    }
    build(weapon, parent, fromPlayer) {
        super.build(weapon, parent, fromPlayer)
        this.target = weapon;


        this.beam = this.engine.poolGameObject(Beam)
        this.beam.onCollisionEnter.add(this.onSensorCollisionEnter.bind(this))
        this.beam.onCollisionExit.add(this.onSensorCollisionExit.bind(this))
        this.beam.build(this.weapon.weaponAttributes.detectionZone, this.weapon.weaponAttributes.radius * 2, { x: 0, y: 0.5 })
        this.addChild(this.beam);

        this.beam.layerCategory = this.layerCategory
        this.beam.layerMask = Layer.Sensor + Layer.Enemy


        this.source = parent;
        this.collisionList = []
        if (this.fromWeapon) {
            this.source = this.spawnParent.parent;
        }
        this.angleModifier = 0;
        this.beamDistance = 20;
        this.beam.show();

        this.beam.transform.position.y = -20

        this.update(0.1)

    }
    onSensorCollisionExit(collided) {
        this.collisionExit(collided);
    }
    onSensorCollisionEnter(collided) {

        this.collisionEnter(collided)

        if (collided.dying || collided.destroyed) {
            this.collisionExit(collided);
        }

    }
    update(delta) {

        let origin = this.originPosition;
        let end;
        this.beamDistance = Utils.lerp(this.beamDistance, this.weapon.weaponAttributes.detectionZone / 2, 0.05)
        if (this.fromWeapon) {

            if (this.fromPlayer) {
                if (this.source.physics.magnitude == 0) {
                    this.angle = this.source.latestAngle;
                } else {
                    this.angle = Utils.angleLerp(this.angle, this.source.physics.angle + this.spawnAngle, 0.8)
                }
            } else {
                this.angle = Utils.angleLerp(this.angle, this.source.physics.angle + this.spawnAngle, 0.1)
            }
            //if is related with player >>> this.source.physics.magnitude != 0 || 
            //this.angle = Utils.angleLerp(this.angle, this.source.physics.angle + this.spawnAngle, this.angleModifier ? 0.1 : 1)
            // if (this.angleModifier == 0) {
            //     this.angleModifier = 1;
            // } else {
            //     this.angle += delta * this.weapon.weaponAttributes.angularSpeed;
            // }
            this.x = this.source.transform.position.x + Math.cos(this.angle) * this.beamDistance * 2
            this.z = this.source.transform.position.z + Math.sin(this.angle) * this.beamDistance * 2
            this.beam.x = this.source.transform.position.x + Math.cos(this.angle) * this.beamDistance
            this.beam.z = this.source.transform.position.z + Math.sin(this.angle) * this.beamDistance

            this.beam.updateBeam(origin, this.beamDistance);



            origin = this.source.transform.position;

        } else {
            //this.beamDistance = this.weapon.weaponAttributes.detectionZone / 2
            this.angle += delta * this.weapon.weaponAttributes.angularSpeed;
            this.x = this.originPosition.x //+ Math.cos(this.angle) * this.beamDistance
            this.z = this.originPosition.z //+ Math.sin(this.angle) * this.beamDistance
            this.beam.x = this.transform.position.x + Math.cos(this.angle) * this.beamDistance
            this.beam.z = this.transform.position.z + Math.sin(this.angle) * this.beamDistance

            this.beam.updateBeam(origin, this.beamDistance);

        }


        this.beam.transform.angle = this.angle;


        if (Math.random() < 0.5) {
            //EffectsManager.instance.emitByIdInRadius(this.gameView.view.position, 1, 'RED_FLOATING')
            //EffectsManager.instance.emitByIdInRadius(this.gameView.view.position, 20, 'RED_FLOATING')
        }

        super.update(delta);
    }
    updateFacing(){
        
    }
    destroy() {
        this.beam.onCollisionEnter.remove(this.onSensorCollisionEnter.bind(this))
        super.destroy();
        this.beam.hide();
    }
}