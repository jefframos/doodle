import GameView from "../core/view/GameView";
import Layer from "../core/Layer";
import PhysicsEntity from "../core/physics/PhysicsEntity";
import RenderModule from "../core/modules/RenderModule";
import Shadow from "../components/view/Shadow";
import TagManager from "../core/TagManager";
import WorldGameView from "../core/view/WorldGameView";

export default class StaticPhysicObject extends PhysicsEntity {
    constructor() {
        super();

        this.gameView = new WorldGameView(this);
        this.gameView.view = new PIXI.Sprite()
        //this.gameView.tag = TagManager.Tags.Occlusion;
        this.gameView.layer = RenderModule.RenderLayers.Gameplay

    }
    build(params) {
        super.build()

        const render = this.engine.findByType(RenderModule);

        if( params.layer && this.gameView.layer != params.layer){
            render.swapLayer(this.gameView, params.layer)
        }        
        this.buildRect(params.x, params.y, params.width, params.height, true);
        this.gameView.view.texture = PIXI.Texture.from('tile')
        this.gameView.view.width = params.width
        this.gameView.view.height = params.height
        this.gameView.view.anchor.set(0.5)


        this.layerCategory = Layer.Environment
        this.layerMask = Layer.EnvironmentCollision

    }
    afterBuild(){
        super.afterBuild()        

    }
    update(delta) {
        super.update(delta);

      //  console.log(this.transform.position)
        //console.log(this.gameView.view.position)
    }
}