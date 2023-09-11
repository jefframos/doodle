import Bullet from "../components/weapon/bullets/Bullet";
import EffectsManager from "../manager/EffectsManager";
import EntityAttributes from "../data/EntityAttributes";
import EntityBuilder from "../screen/EntityBuilder";
import EntityLifebar from "../components/ui/progressBar/EntityLifebar";
import GameAgent from "./GameAgent";
import InGameWeapon from "../data/InGameWeapon";
import Layer from "../core/Layer";
import Player from "./Player";
import PlayerHalo from "./PlayerHalo";
import RenderModule from "../core/modules/RenderModule";
import Sensor from "../core/utils/Sensor";
import Shadow from "../components/view/Shadow";
import SpriteFacing from "../components/SpriteFacing";
import SpriteJump from "../components/SpriteJump";
import Vector3 from "../core/gameObject/Vector3";

export default class Companion extends GameAgent {
    constructor() {
        super();
        this.gameView.layer = RenderModule.RenderLayers.Gameplay
        this.gameView.view = new PIXI.Sprite.from('pet-dog-10001')
    }
    build(companionData, level) {
        super.build()
        this.level = level;
        this.staticData = companionData;
        this.attributes.reset(companionData.attributes);
        this.viewData = companionData.view;


        this.health.reset()

        this.currentEnemiesColliding = []

        this.sensor = this.engine.poolGameObject(Sensor)
        this.sensor.build(200)
        this.addChild(this.sensor)
        this.buildCircle(0, 0, this.attributes.radius);

        this.speed = this.attributes.speed
        this.distance = this.attributes.distance

        this.shootBaseTime = 2
        this.shootTimer = 0.5
        this.transform.angle = -Math.PI / 2

        if (this.viewData.jumpHight) {

            this.layerCategory = Layer.FlightCompanion
            this.layerMask = Layer.Nothing
            this.transform.position.y = -this.viewData.jumpHight

        } else {
            this.transform.position.y = 0;

            this.layerCategory = Layer.Player
            this.layerMask = Layer.PlayerCollision

            this.lifeBar = this.engine.poolGameObject(EntityLifebar)
            this.addChild(this.lifeBar)

            
            this.lifeBar.build(this.attributes.radius, 3, 1);
            this.lifeBar.updateView({ x: 0, y: -30 }, 0x8636f0, 0xFF0000);
        }


        this.rigidBody.isSensor = true

        this.gameView.view.anchor.set(0.3, 1)
        this.gameView.view.scale.set(20 / this.gameView.view.width * Math.abs(this.gameView.view.scale.x) * 2 * (this.viewData.scale || 1))
        this.gameView.view.scale.y = Math.abs(this.gameView.view.scale.y);
        
        this.gameView.applyScale();
        
        this.anchorOffset = 0
        
        this.addChild(this.engine.poolGameObject(Shadow))
        
        let spriteFacing = this.addComponent(SpriteFacing);
        spriteFacing.lerp = 0.1
        spriteFacing.startScaleX = -1
        
        this.makeAnimations(this.staticData).stopTimerDefault = 0.5

        if (this.staticData.weapon) {

            this.addWeaponData(EntityBuilder.instance.weaponsData[this.staticData.weapon.id], this.level)
        }

        this.targetAngle = Math.random() * Math.PI * 2;

        this.targetPosition = new Vector3();

    }

    afterBuild() {
        this.targetPosition.copy(this.parent.transform.position)

        let light = this.engine.poolGameObject(PlayerHalo)
        // light.setRadius(200)
        // light.setColor(0xFB9974, 0.5)

        light.setArc(50, 150, Math.PI * 0.25)
        light.setColor(0xFFFED9, 0.5)
        this.addChild(light)


    }
    collisionEnter(collided) {
        if (collided.layerCategory != Layer.Enemy) return;
        if (this.findInCollision(collided)) return;
        this.currentEnemiesColliding.push({ entity: collided, timer: 0 });
    }
    collisionExit(collided) {
        if (collided.layerCategory != Layer.Enemy) return;
        if (!this.findInCollision(collided)) return;
        this.currentEnemiesColliding = this.currentEnemiesColliding.filter(item => item.entity !== collided);
    }

    update(delta) {


        this.currentEnemiesColliding.forEach(element => {
            if (element.timer <= 0) {
                this.damage(10);
                element.timer = 1;
            } else {
                element.timer -= delta;
            }
        });

        //console.log(this.sensor.collisionList.length)
        this.targetPosition.copy(this.parent.transform.position)

        this.targetAngle += delta;
        this.targetAngle %= Math.PI * 2;

        this.targetPosition.x += Math.cos(this.targetAngle) * this.distance
        this.targetPosition.z += Math.sin(this.targetAngle) * this.distance

        this.sensor.x = this.transform.position.x
        this.sensor.z = this.transform.position.z

        if (Vector3.distance(this.transform.position, this.targetPosition) > this.speed) {
            this.transform.angle = Vector3.atan2XZ(this.targetPosition, this.transform.position)
            this.physics.velocity.x = Math.cos(this.transform.angle) * this.speed * delta
            this.physics.velocity.z = Math.sin(this.transform.angle) * this.speed * delta
        } else {
            this.physics.velocity.zero();
        }

        super.update(delta)

    }
}