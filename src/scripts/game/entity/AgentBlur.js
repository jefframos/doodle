import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import LightSource from "../core/view/LightSource";
import RenderModule from "../core/modules/RenderModule";

export default class AgentBlur extends GameObject {

    constructor() {
        super()
        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.RenderLayers.FrontLayer;
        this.gameView.view = new PIXI.Sprite.from('small-blur')
        this.gameView.view.anchor.set(0.5)
        this.gameView.view.alpha = 0.2
    } 
    setColor(color = 0xFFFED9) {
        this.gameView.view.tint = color;
    }
    start() {
    }
    update(delta) {
        this.gameView.update(delta)
        this.transform.position.x = this.parent.transform.position.x
        this.transform.position.y = -50
        this.transform.position.z = this.parent.transform.position.z
    }

    lateUpdate(delta) {
        super.lateUpdate(delta);
        this.gameView.view.zIndex = -1
    }
}