import BeamView from "../../view/BeamView";
import GameView from "../../../core/view/GameView";
import Layer from "../../../core/Layer";
import PhysicsProperties from "../../../core/physics/PhysicsProperties";
import RenderModule from "../../../core/modules/RenderModule";
import Sensor from "../../../core/utils/Sensor";
import signals from "signals";

export default class Beam extends Sensor {
    constructor() {
        super();
        
        this.gameView = new GameView(this)
        //this.gameView.layer = RenderModule.RenderLayers.Base;
        this.gameView.view = new PIXI.Sprite()
        this.gameView.view.alpha = 1
        this.beamView = new BeamView();
        this.gameView.view.addChild(this.beamView)
    }

    build(width = 50, height = 50, anchor = { x: 0, y: 0 }) {
        this.physics = new PhysicsProperties();

        this.buildRect(-anchor.x * width, 0, width, height) 
        
        this.gameView.view.scale.set(1)
        this.beamWidth = width
        this.beamHeight = height

        this.rigidBody.isSensor = true;
        this.autoSetAngle = false;
        
        this.beamView.build(this.beamWidth, 0)
        this.beamView.visible = false;
    }
    hide() {
        this.gameView.view.alpha = 0
        this.beamView.visible = false;

    }
    show() {
        this.gameView.view.alpha = 1
    }
    updateBeam(from, distance) {

        this.beamView.fromTo(from, distance)
        this.beamView.build(distance, this.beamHeight)
        this.beamView.visible = true;
    }
    update(delta, unscaleDelta) {
        super.update(delta, unscaleDelta)
        this.gameView.view.rotation = this.physics.angle
        this.beamView.update(delta)
    }
    destroy() {
        super.destroy()
    }
}