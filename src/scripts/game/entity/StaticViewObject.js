import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import Layer from "../core/Layer";
import RenderModule from "../core/modules/RenderModule";
import Shadow from "../components/view/Shadow";
import TagManager from "../core/TagManager";
import Utils from "../core/utils/Utils";

export default class StaticViewObject extends GameObject {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.view = new PIXI.Sprite()
        this.gameView.layer = RenderModule.RenderLayers.Gameplay
        //this.gameView.tag = TagManager.Tags.Occlusion;
        this.viewOffset = {x:0, y:0}
    }
    build(params) {
        super.build()


        const render = this.engine.findByType(RenderModule);


        // if( params.layer && this.gameView.view.layer != RenderModule.RenderLayers[params.layer]){
        //     render.swapLayer(this.gameView, RenderModule.RenderLayers[params.layer])
        // }else if(this.gameView.view.layer != RenderModule.RenderLayers.Base){
        //     render.swapLayer(this.gameView, RenderModule.RenderLayers.Base)
        // }


        if(params.width){
            this.gameView.view.scale.set(params.width / this.gameView.view.width )
        }else{
            this.gameView.view.scale.set(0.5);
        }
        if(!params.anchor){

            this.gameView.view.anchor.set(0.5, 1)
        }else{
            this.gameView.view.anchor.x =  params.anchor.x
            this.gameView.view.anchor.y =  params.anchor.y           
        }

        this.gameView.view.texture = PIXI.Texture.from(Utils.findValueOrRandom(params.texture));
        this.transform.position.x = params.x
        this.transform.position.z = params.z
    }
    update(delta) {
        super.update(delta);
        this.gameView.update(delta)
    }
    onRender() {
    }
}