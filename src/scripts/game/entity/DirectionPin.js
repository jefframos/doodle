import Camera from "../core/Camera";
import Game from "../../Game";
import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import Layer from "../core/Layer";
import LevelManager from "../manager/LevelManager";
import Player from "./Player";
import RenderModule from "../core/modules/RenderModule";
import Shadow from "../components/view/Shadow";
import TagManager from "../core/TagManager";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";

export default class DirectionPin extends GameObject {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.view = new PIXI.Sprite()
        this.gameView.layer = RenderModule.RenderLayers.FrontLayer;
    }
    build(params) {
        super.build()

        this.customEntity = null;
        this.gameView.view.texture = PIXI.Texture.from('pin-arrow');
        this.gameView.view.anchor.set(1, 0.5)

        this.gameView.view.scale.set(Utils.scaleToFit(this.gameView.view, 30))
        this.gameView.view.visible = false;


    }
    changeIcon(icon){
        this.gameView.view.texture = PIXI.Texture.from(icon);
    }
    start() {
        super.start();

        this.player = this.engine.findByType(Player);

        if (!this.player) {
            this.engine.callbackWhenAdding(Player, (player) => {
                this.player = player[0];
            });
        }
        this.gameView.view.visible = false;

    }
    update(delta) {
        super.update(delta);
        if (!this.player) {
            return
        }
        this.gameView.update(delta)

        const enemy = this.customEntity ? this.customEntity : LevelManager.instance.findClosestEnemyWithHigherTier(this.player.transform.position)

        //console.log(this.customEntity)
        if (enemy) {
            let distance = Vector3.distance(this.player.transform.position, enemy.transform.position);
            const angle = Vector3.atan2XZ(enemy.transform.position, this.player.transform.position)

            if ( distance < Camera.ViewportSize.min / 2) {
                this.gameView.view.visible = false;
                return;
            } else {
                distance = Math.min(distance, (Camera.ViewportSize.min / 2 - 100) + Math.sin(Game.Time * 4) * 4 - 50)
            }
            const lerp = this.gameView.view.visible ? 0.3 : 1;
            this.gameView.view.rotation = Utils.angleLerp(this.gameView.view.rotation, angle, lerp)


            if(Math.cos(this.gameView.view.rotation) > 0){
                this.gameView.view.scale.y = Math.abs(this.gameView.view.scale.x)
            }else{
                this.gameView.view.scale.y =- Math.abs(this.gameView.view.scale.x)

            }

            this.transform.position.x = Utils.lerp(this.transform.position.x, this.player.transform.position.x + Math.cos(angle) * distance, lerp)
            this.transform.position.z = Utils.lerp(this.transform.position.z, this.player.transform.position.z + Math.sin(angle) * distance, lerp)

            this.transform.position.y = Math.cos(Game.Time * 2) * 5 - 5

            this.gameView.view.visible = true;

        } else {
            this.gameView.view.visible = false;

        }
    }
    onRender() {
    }
}