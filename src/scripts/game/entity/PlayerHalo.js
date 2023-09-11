import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import LightSource from "../core/view/LightSource";
import RenderModule from "../core/modules/RenderModule";

export default class PlayerHalo extends GameObject {

    constructor() {
        super()
        this.gameView = new LightSource(this);
        this.gameView.setRadius(100)
        this.gameView.setColor()
        this.gameView.layer = RenderModule.RenderLayers.Base;
        this.playerTileID = { i: 0, j: 0 }
    }
    setRadius(radius) {
        this.gameView.setRadius(radius)

    }
    setArc(radius, distance, arcAngle = Math.PI * 0.25) {
        this.gameView.setArc(radius, distance, arcAngle)
    }
    setColor(color = 0xFFFED9, intensity = 0.5) {
        this.gameView.setColor(color, intensity);
    }
    start() {
    }
    update(delta) {
        this.gameView.update(delta)
        this.transform.position.x = this.parent.transform.position.x
        this.transform.position.y = 0
        this.transform.position.z = this.parent.transform.position.z
    }

    lateUpdate(delta) {
        super.lateUpdate(delta);
        this.gameView.view.zIndex = -1
    }
}