import GameObject from "../../../core/gameObject/GameObject";
import RenderModule from "../../../core/modules/RenderModule";
import WorldGameView from "../../../core/view/WorldGameView";


export default class BaseTower extends GameObject {

    constructor() {
        super()
        this.gameView = new WorldGameView(this);

        this.gameView.view = new PIXI.Sprite.from('barrel1')
        this.gameView.view.anchor.set(0.5, 1)
        this.gameView.view.scale.set(0.5)
        this.gameView.layer = RenderModule.RenderLayers.Gameplay

        this.nameLabel = new PIXI.Text()
        this.gameView.view.addChild(this.nameLabel)

        
    }
}