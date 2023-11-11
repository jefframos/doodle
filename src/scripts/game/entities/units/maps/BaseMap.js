import signals from "signals";
import GameObject from "../../../core/gameObject/GameObject";
import Vector3 from "../../../core/gameObject/Vector3";
import RenderModule from "../../../core/modules/RenderModule";
import WorldGameView from "../../../core/view/WorldGameView";
import InteractableView from "../../../view/card/InteractableView";
import BaseTower from "./BaseTower";
import Game from "../../../../Game";
import StaticPhysicObject from "../../../entity/StaticPhysicObject";


export default class BaseMap extends GameObject {

    constructor() {
        super()

        this.onMapUp = new signals.Signal();

        this.gameView = new WorldGameView(this);

        this.gameView.view = new PIXI.Container()
        this.gameView.layer = RenderModule.RenderLayers.Floor

        this.floorTexture = new PIXI.TilingSprite(PIXI.Texture.from('grass-patch-1'), 256, 256);
        this.gameView.view.addChild(this.floorTexture)

        this.dimensions = {
            width: 1000,
            height: 600
        }
        
        this.team1Tower = this.addChild(Eugine.poolGameObject(BaseTower, true));

        this.team2Tower = this.addChild(Eugine.poolGameObject(BaseTower, true));
        this.team2Tower.z = this.dimensions.height / 2

        this.test = this.addChild(Eugine.poolGameObject(StaticPhysicObject, false));
        this.test.build({x:270,y:500, width:150,height:200, layer:RenderModule.RenderLayers.Gameplay})
        
        this.dropZone = new PIXI.Sprite.from('tile')
        this.gameView.view.addChild(this.dropZone);
        this.dropZone.alpha = 0.01;

        this.updateView();

        InteractableView.addMouseUp(this.dropZone, (e) => {
            this.onMapUp.dispatch(e.data.global)
        })
    }
    resize(resolution, innerResolution) {

        this.updateView();
    }

    updateView(){
        
        if (Game.IsPortrait) {

            this.dimensions = {
                width: 600,
                height: 1000
            }
            this.dropZone.width = this.dimensions.width
            this.dropZone.height = this.dimensions.height / 2;
            this.dropZone.y = this.dimensions.height / 2;

            this.team2Tower.x = this.dimensions.width / 2
            this.team2Tower.z = 50

            this.team1Tower.x = this.dimensions.width / 2
            this.team1Tower.z = this.dimensions.height - 50
        } else {

            this.dimensions = {
                width: 1000,
                height: 600
            }

            this.dropZone.y = 0;

            this.dropZone.width = this.dimensions.width / 2
            this.dropZone.height = this.dimensions.height;

            this.team1Tower.x = 50
            this.team1Tower.z = this.dimensions.height / 2

            this.team2Tower.x = this.dimensions.width - 50
            this.team2Tower.z = this.dimensions.height / 2
        }

        this.floorTexture.width = this.dimensions.width
        this.floorTexture.height = this.dimensions.height

        this.mapCenter = new Vector3(this.floorTexture.width / 2, 0, this.floorTexture.height / 2);

    }
}