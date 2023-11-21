import BaseMap from "./maps/BaseMap";
import GameStaticData from "../../data/GameStaticData";
import GameViewSpriteSheet from "../../components/GameViewSpriteSheet";
import Health from "../../components/Health";
import Layer from "../../core/Layer";
import PhysicsEntity from "../../core/physics/PhysicsEntity";
import RenderModule from "../../core/modules/RenderModule";
import Shadow from "../../components/view/Shadow";
import SpriteScaleBounceAppear from "../../components/SpriteScaleBounceAppear";
import UIUtils from "../../utils/UIUtils";
import UnityMover from "../components/UnityMover";
import Vector3 from "../../core/gameObject/Vector3";
import WorldGameView from "../../core/view/WorldGameView";

export default class BaseUnit extends PhysicsEntity {

    constructor() {
        super()
        this.gameView = new WorldGameView(this);

        this.gameView.view = new PIXI.Sprite()
        this.gameView.view.anchor.set(0.5, 1)
        //this.gameView.view.scale.set(0.5)
        this.gameView.layer = RenderModule.RenderLayers.Gameplay

        this.nameLabel = UIUtils.getPrimaryLabel()
        this.gameView.view.addChild(this.nameLabel)

        this.sin = Math.random()
    }

    build() {
        super.build();

        this.buildCircle(0, 0, 20)

        this.layerCategory = Layer.Enemy
        this.layerMask = Layer.EnemyCollision


        this.addChild(this.engine.poolGameObject(Shadow))



        var pokeId = Math.ceil(Math.random() * 150)
        var path = pokeId
        if (pokeId < 10) {
            path = '00' + pokeId
        } else if (pokeId < 100) {
            path = '0' + pokeId
        }

        var data = GameStaticData.instance.getUnitById(pokeId - 1)
        var forme = data.formes[0].forme[0]
        var stats = forme.stats[0].attribute


        this.positionNormal = {
            x: 0,
            y: 0
        }
        this.speed = parseInt(stats.speed) / 256

        this.aspect = 'landscape'

        this.nameLabel.anchor.x = 0.5
        this.nameLabel.style.fontSize = 14
        this.nameLabel.scale.set(0.75)
        this.nameLabel.text = data.attribute.name

        let animationFrames = {
            down: [path + '_0_0', path + '_0_1', path + '_0_2', path + '_0_3'],
            left: [path + '_1_0', path + '_1_1', path + '_1_2', path + '_1_3'],
            right: [path + '_2_0', path + '_2_1', path + '_2_2', path + '_2_3'],
            up: [path + '_3_0', path + '_3_1', path + '_3_2', path + '_3_3'],
        }


        this.spriteSheet = this.addComponent(GameViewSpriteSheet);

        for (const key in animationFrames) {
            const element = animationFrames[key];

            element.forEach(testFrame => {

                var test = PIXI.Texture.from(testFrame)
                if (!test) {
                    console.log(testFrame)
                }
            });

            this.spriteSheet.addAnimation(key, element, 0.3, { x: 0.5, y: 1 })
        }

        this.health = this.addComponent(Health)
        this.health.reset();
        // this.health.gotKilled.add(() => {
        //     this.destroy()
        // })

        this.worldMap = this.engine.findByType(BaseMap);


        if (!this.worldMap) {
            this.engine.callbackWhenAdding(BaseMap, (worldMap) => {
                this.worldMap = worldMap[0];
                this.initializeMap();
            });
        } else {
            this.initializeMap();
        }
    }
    start() {
        super.start();       
    }
    initializeMap() {
        this.worldMap.onAspectChange.add(this.onAspectChange.bind(this))
        this.mover = this.addComponent(UnityMover)
        this.mover.speed = this.speed * 3;

    }
    onAspectChange(aspect) {

    }

    update(delta, unscaledDelta) {
        super.update(delta, unscaledDelta);
        this.spriteSheet.play(this.getCardinalDirection(this.physics.velocity.x, this.physics.velocity.z))

        if(this.health.currentHealth <= 0){
            this.destroy()
        }
    }

    lateUpdate(delta) {
        super.lateUpdate(delta);
    }

    getCardinalDirection(velocityX, velocityY) {
        // Set a threshold for velocity to avoid jitter due to small values
        const threshold = 0.02;

        // Determine horizontal direction
        let horizontalDirection = 'right';
        if (Math.abs(velocityX) > threshold) {
            horizontalDirection = velocityX > 0 ? 'right' : 'left';
        }

        // Determine vertical direction
        let verticalDirection = 'down';
        if (Math.abs(velocityY) > threshold) {
            verticalDirection = velocityY > 0 ? 'down' : 'up';
        }

        // Choose the dominant direction
        if (Math.abs(velocityX) > Math.abs(velocityY)) {
            return horizontalDirection;
        } else {
            return verticalDirection;
        }
    }
    // Function to get 4-axis direction based on velocity
    getDirection(velocityX, velocityY) {
        // Set a threshold for velocity to avoid jitter due to small values
        const threshold = 0.02;

        // Check horizontal direction
        let horizontalDirection = '';
        if (Math.abs(velocityX) > threshold) {
            horizontalDirection = velocityX > 0 ? 'right' : 'left';
        }

        // Check vertical direction
        let verticalDirection = '';
        if (Math.abs(velocityY) > threshold) {
            verticalDirection = velocityY > 0 ? 'down' : 'up';
        }

        // Combine directions
        let direction = '';
        if (horizontalDirection && verticalDirection) {
            direction = `${verticalDirection}-${horizontalDirection}`;
        } else {
            direction = horizontalDirection || verticalDirection;
        }
        return direction;
    }
}