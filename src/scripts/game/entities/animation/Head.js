
import Shadow from "../../components/view/Shadow";
import Layer from "../../core/Layer";
import RenderModule from "../../core/modules/RenderModule";
import PhysicsEntity from "../../core/physics/PhysicsEntity";
import GameView from "../../core/view/GameView";
import Creature from "./Creature";

export default class Head extends PhysicsEntity {

    constructor() {
        super()
        this.gameView = new GameView();

        this.gameView.view = new PIXI.Sprite.from('tile');
        this.gameView.view.anchor.set(0.5)
        this.gameView.view.scale.set(0.75)
        this.gameView.layer = RenderModule.RenderLayers.Gameplay
        this.gameView.view.alpha = 0.5

        this.sin = Math.random()
        


    }
   
    build() {
        super.build();

        this.buildCircle(0,0,20)
        
        this.layerCategory = Layer.Enemy
        this.layerMask = Layer.EnemyCollision

        this.addChild(this.engine.poolGameObject(Shadow))

        for (let index = 0; index < 5; index++) {
            this.addChild(this.engine.poolGameObject(Creature, true))            
        }
    }
    start() {
        super.start();
    }
    update(delta, unscaledDelta) {
        super.update(delta, unscaledDelta);

        this.sin += delta;

        this.physics.velocity.x =Math.sin(this.sin) * 0.5
        this.physics.velocity.z =Math.cos(this.sin) * 0.5


        //this.transform.position.y += 0.2


        
        this.gameView.view.x = this.transform.position.x
        this.gameView.view.y = this.transform.position.z + this.transform.position.y
    }

    lateUpdate(delta) {
        super.lateUpdate(delta);
    }
}