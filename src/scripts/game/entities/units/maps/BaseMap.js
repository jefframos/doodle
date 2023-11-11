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
        this.gameView.layer = RenderModule.RenderLayers.Base

        this.floorTexture = new PIXI.TilingSprite(PIXI.Texture.from('grass-patch-1'), 256, 256);
        this.gameView.view.addChild(this.floorTexture)

        this.dimensions = {
            width: 1000,
            height: 600
        }

        this.team1Towers = [];
        this.team2Towers = [];

        this.team1Tower = this.addChild(Eugine.poolGameObject(BaseTower, true));
        this.team1Towers.push(this.team1Tower)


        this.team2Tower = this.addChild(Eugine.poolGameObject(BaseTower, true));
        this.team2Towers.push(this.team2Tower)





        this.dropZone = new PIXI.Sprite.from('tile')
        this.gameView.view.addChild(this.dropZone);
        this.dropZone.alpha = 0.01;

        this.aspectBuild = ''

        InteractableView.addMouseUp(this.dropZone, (e) => {
            this.onMapUp.dispatch(e.data.global)
        })
    }
    start() {

        this.ladscapeEnvironment = [];
        this.updateView();
        this.buildBounds();
    }
    buildBounds() {

        if (Game.IsPortrait) {
            if (this.aspectBuild == 'portrait') {
                return;
            }
            this.aspectBuild = 'portrait'

            this.ladscapeEnvironment.forEach(element => {
                element.destroy();
            });
            this.ladscapeEnvironment = [];

            const top = this.addChild(Eugine.poolGameObject(StaticPhysicObject, false));
            top.build({ x: this.dimensions.width / 2, y: 0, width: this.dimensions.width, height: 40, layer: RenderModule.RenderLayers.Gameplay })
            this.ladscapeEnvironment.push(top)

            const bottom = this.addChild(Eugine.poolGameObject(StaticPhysicObject, false));
            bottom.build({ x: this.dimensions.width / 2, y: this.dimensions.height, width: this.dimensions.width, height: 40, layer: RenderModule.RenderLayers.Gameplay })
            this.ladscapeEnvironment.push(bottom)

            const left = this.addChild(Eugine.poolGameObject(StaticPhysicObject, false));
            left.build({ x: 0, y: this.dimensions.height / 2, width: 40, height: this.dimensions.height, layer: RenderModule.RenderLayers.Gameplay })
            this.ladscapeEnvironment.push(left)

            const right = this.addChild(Eugine.poolGameObject(StaticPhysicObject, false));
            right.build({ x: this.dimensions.width, y: this.dimensions.height / 2, width: 40, height: this.dimensions.height, layer: RenderModule.RenderLayers.Gameplay })
            this.ladscapeEnvironment.push(right)
        } else {
            if (this.aspectBuild == 'landscape') {
                return;
            }
            this.aspectBuild = 'landscape'

            this.ladscapeEnvironment.forEach(element => {
                element.destroy();
            });
            this.ladscapeEnvironment = [];

            const top = this.addChild(Eugine.poolGameObject(StaticPhysicObject, false));
            top.build({ x: this.dimensions.width / 2, y: 0, width: this.dimensions.width, height: 40, layer: RenderModule.RenderLayers.Gameplay })
            this.ladscapeEnvironment.push(top)

            const bottom = this.addChild(Eugine.poolGameObject(StaticPhysicObject, false));
            bottom.build({ x: this.dimensions.width / 2, y: this.dimensions.height, width: this.dimensions.width, height: 40, layer: RenderModule.RenderLayers.Gameplay })
            this.ladscapeEnvironment.push(bottom)

            const left = this.addChild(Eugine.poolGameObject(StaticPhysicObject, false));
            left.build({ x: 0, y: this.dimensions.height / 2, width: 40, height: this.dimensions.height, layer: RenderModule.RenderLayers.Gameplay })
            this.ladscapeEnvironment.push(left)

            const right = this.addChild(Eugine.poolGameObject(StaticPhysicObject, false));
            right.build({ x: this.dimensions.width, y: this.dimensions.height / 2, width: 40, height: this.dimensions.height, layer: RenderModule.RenderLayers.Gameplay })
            this.ladscapeEnvironment.push(right)
        }
    }
    resize(resolution, innerResolution) {

        this.updateView();
        this.buildBounds();
    }

    updateView() {

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