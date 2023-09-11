import GameView from "../core/view/GameView";
import Layer from "../core/Layer";
import PhysicsEntity from "../core/physics/PhysicsEntity";
import RenderModule from "../core/modules/RenderModule";
import Shadow from "../components/view/Shadow";
import TagManager from "../core/TagManager";

export default class StaticPhysicObject extends PhysicsEntity {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.view = new PIXI.Sprite()
        this.gameView.tag = TagManager.Tags.Occlusion;
        this.gameView.layer = RenderModule.RenderLayers.Gameplay

    }
    build(params) {
        super.build()

        const render = this.engine.findByType(RenderModule);

        if( params.layer && this.gameView.view.layer != RenderModule.RenderLayers[params.layer]){
            render.swapLayer(this.gameView, RenderModule.RenderLayers[params.layer])
        }else if(this.gameView.view.layer != RenderModule.RenderLayers.Base){
            render.swapLayer(this.gameView, RenderModule.RenderLayers.Base)
        }
        
        this.buildRect(params.x, params.z, params.width, params.height, true);
        
        this.gameView.view.scale.set(params.width / this.gameView.view.width )
        this.gameView.view.anchor.set(0.5, 1)

        this.layerCategory = Layer.Environment
        this.layerMask = Layer.EnvironmentCollision

    }
    afterBuild(){
        super.afterBuild()
        
        // let shadow = this.engine.poolGameObject(Shadow)
        // this.addChild(shadow)

        // shadow.transform.position.x = this.x
        // shadow.transform.position.z = this.z

    }
    update(delta) {
        super.update(delta);
        this.gameView.update(delta)
    }
}