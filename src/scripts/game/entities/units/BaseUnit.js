
import GameViewSpriteSheet from "../../components/GameViewSpriteSheet";
import Shadow from "../../components/view/Shadow";
import Layer from "../../core/Layer";
import Vector3 from "../../core/gameObject/Vector3";
import RenderModule from "../../core/modules/RenderModule";
import PhysicsEntity from "../../core/physics/PhysicsEntity";
import WorldGameView from "../../core/view/WorldGameView";
import GameStaticData from "../../data/GameStaticData";
import UIUtils from "../../utils/UIUtils";
import BaseMap from "./maps/BaseMap";

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

        this.spriteSheet = this.addComponent(GameViewSpriteSheet);

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
            x:0,
            y:0
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

        for (const key in animationFrames) {
            const element = animationFrames[key];
            
            element.forEach(testFrame => {
                
                var test = PIXI.Texture.from(testFrame)
                if(!test){
                    console.log(testFrame)
                }
            });

            this.spriteSheet.addAnimation(key, element, 0.3, { x: 0.5, y: 1 })
        }

        //console.log(forme)
        //console.log(stats)

    }
    start() {
        super.start();

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
    initializeMap(){
        this.worldMap.onAspectChange.add(this.onAspectChange.bind(this))
        this.targets = this.worldMap.getEnemieTowers();

    }
    onAspectChange(aspect){
        
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

    update(delta, unscaledDelta) {
        super.update(delta, unscaledDelta);

        this.sin += delta;

        // this.physics.velocity.z = Math.cos(this.sin) * this.speed
        this.spriteSheet.play(this.getCardinalDirection(this.physics.velocity.x, this.physics.velocity.z))
        
        if(this.worldMap){
            
            this.positionNormal.x = this.transform.x / this.worldMap.dimensions.width
            this.positionNormal.y = this.transform.z / this.worldMap.dimensions.height
            
            const target = this.findClosestTower(this.transform.position);
            
            const angle = Vector3.atan2XZ(target.transform.position, this.transform.position)
            
            this.physics.velocity.x = Math.cos(angle) * this.speed
            this.physics.velocity.z = Math.sin(angle) * this.speed

            
            if(Vector3.distance(target.transform.position, this.transform.position) < 30){
                this.destroy();
            }
        }
        
        //console.log(Math.sin(this.physics.velocity.x))
    }

    lateUpdate(delta) {
        super.lateUpdate(delta);
    }

    getCardinalDirection(velocityX, velocityY) {
        // Set a threshold for velocity to avoid jitter due to small values
        const threshold = 0.1;

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
        const threshold = 0.1;

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