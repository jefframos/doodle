import AmbientLightSystem from "../components/AmbientLightSystem";
import Camera from "../core/Camera";
import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import Player from "../entity/Player";
import RenderModule from "../core/modules/RenderModule";

export default class BasicFloorRender extends GameObject {

    constructor() {
        super()
        this.gameView = new GameView();

        this.gameView.view = new PIXI.TilingSprite(PIXI.Texture.from('floor_5'), 256, 256);
        this.gameView.view.anchor.set(0.5)
        this.gameView.view.tileScale.set(1.5)
       
        this.gameView.view.alpha = 1

        this.gameView.layer = RenderModule.RenderLayers.Base;
        this.playerTileID = { i: 0, j: 0 }

        this.setTileSize(100)
    }
    set groundTexture(value){
        this.gameView.view.texture = PIXI.Texture.from(value)
    }
    setTileSize(tileSize) {
        this.tileSize = tileSize * this.gameView.view.tileScale.x;
        this.gameView.view.scale.set(256/tileSize)
        this.gameView.view.width = this.tileSize * 10 /  this.gameView.view.scale.x
        this.gameView.view.height = this.tileSize * 10 /  this.gameView.view.scale.y
    }
    build(noLight) {
        super.build();

    }
    start() {
        super.start();
        
        this.player = this.engine.findByType(Player);
        
        if (!this.player) {
            this.engine.callbackWhenAdding(Player, (player) => {
                this.player = player[0];
            });
        }
        this.cameraFog = this.gameObject.engine.camera.findComponent(AmbientLightSystem)
        if(this.cameraFog){
            this.gameView.view.tint = this.cameraFog.ambientColor;
        }        
    }
    update(delta) {
        if(this.noLight){
            this.gameView.view.tint = 0xFFFFFF
        }
        if(!this.player) return;
        this.playerTileID.i = Math.floor(this.player.transform.position.x / this.tileSize)
        this.playerTileID.j = Math.floor(this.player.transform.position.z / this.tileSize)

        this.gameView.view.x = this.playerTileID.i * this.tileSize
        this.gameView.view.y = this.playerTileID.j * this.tileSize
    }

    lateUpdate(delta) {
        super.lateUpdate(delta);
        this.gameView.view.zIndex = -99999999999
    }
}