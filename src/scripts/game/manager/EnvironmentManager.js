import AmbientLightSystem from "../components/AmbientLightSystem";
import BasicFloorRender from "./BasicFloorRender";
import Camera from "../core/Camera";
import Game from "../../Game";
import GameObject from "../core/gameObject/GameObject";
import GameStaticData from "../data/GameStaticData";
import GameView from "../core/view/GameView";
import LevelManager from "./LevelManager";
import Player from "../entity/Player";
import RandomGenerator from "../core/utils/RandomGenerator";
import RenderModule from "../core/modules/RenderModule";
import StaticPhysicObject from "../entity/StaticPhysicObject";
import StaticViewObject from "../entity/StaticViewObject";
import Trees from "../entity/Trees";
import Utils from "../core/utils/Utils";
import WorldManager from "./WorldManager";
import alea from 'alea';
import { createNoise2D } from 'simplex-noise';

export default class EnvironmentManager extends GameObject {
    static instance;

    static Compare = {
        Less: 'less',
        More: 'more',
        Nor: 'nor',
        Between: 'between',
        Always: 'always'
    }
    static Constructors = {
        'StaticViewObject': StaticViewObject,
        'Trees': Trees
    }
    constructor() {
        super()

        this.bakedData = {
            layers: []
        };




        this.rnd = new RandomGenerator(1)

        const prng = alea('seed2');
        this.noise2D = createNoise2D(prng);

        this.drawBounds = { width: 800, height: 800 };
        this.drawBoundsDistance = { i: 4, j: 4 };

        this.chunkSize = { width: 256, height: 256 }
        this.currentChunkId = { i: -11111111, j: -11111111 };
        this.nextChunkId = { i: 0, j: 0 };
        this.drawOffset = { i: 0, j: 0 };
    }

    destroy() {
        super.destroy();
    }
    start() {
        this.levelManager = LevelManager.instance;

        this.environmentData = GameStaticData.instance.getDataById('environment', 'levels', this.levelManager.currentLevelData.environmentData)// Math.floor(Math.random() * 2))
        this.patches = this.environmentData.assets


        this.player = this.engine.findByType(Player);
        this.ambientLightSystem = this.engine.camera.findComponent(AmbientLightSystem);


        if (this.ambientLightSystem) {
            this.updateLights();

        }





        this.patches.forEach(patch => {
            if (!patch.structure.list) {
                patch.structure.list = [];
                for (let index = 1; index <= patch.structure.total; index++) {
                    patch.structure.list.push(patch.structure.spriteName + (index < 10 ? '0' + index : index))
                }
            }
        });

        if (!this.player) {
            this.engine.callbackWhenAdding(Player, (player) => {
                this.player = player[0];
                this.updateWorldElements();
            });
        } else {
            this.updateWorldElements();
        }
        const floor = this.engine.poolGameObject(BasicFloorRender);
        floor.groundTexture = this.environmentData.groundTexture;
        floor.setTileSize(this.environmentData.groundWidth || 256)
        this.addChild(floor)
    }
    updateLights() {
        if (this.environmentData.ambientColor) {
            this.ambientLightSystem.setLevelLightSetup(this.environmentData.ambientColor, this.environmentData.intensityLight)
        } else {

            this.ambientLightSystem.setDefault();
        }
    }
    build(params) {
        super.build(params);


    }
    update(delta) {
        super.update(delta);
    }
    updateWorldElements() {

        this.bakedData = {}
        this.updatePlayerChunk();

    }
    drawLayer(layer, playerOrigin) {
        this.drawBounds.width = this.drawBoundsDistance.i * this.chunkSize.width
        this.drawBounds.height = this.drawBoundsDistance.j * this.chunkSize.height

        const layerName = layer.layerName

        const scale = 0.25

        if (this.bakedData[layerName]) {

            for (let index = this.bakedData[layerName].length - 1; index >= 0; index--) {
                this.bakedData[layerName][index].destroy();

            }
        }

        this.bakedData[layerName] = [];
        for (let i = -this.drawBoundsDistance.i; i <= this.drawBoundsDistance.i; i++) {
            for (let j = -this.drawBoundsDistance.j; j <= this.drawBoundsDistance.j; j++) {
                for (let k = 0; k <= layer.density; k++) {
                    let v = this.noise2D((i + playerOrigin.i) * scale, (j + playerOrigin.j) * scale)
                    let targetPosition = {
                        x: (i + playerOrigin.i) * this.chunkSize.width + this.rnd.randomOffset(v + k + this.totalLayersDraw) * this.chunkSize.width - this.chunkSize.width / 2,
                        y: (j + playerOrigin.j) * this.chunkSize.height + this.rnd.randomOffset(v - k + this.totalLayersDraw) * this.chunkSize.height - this.chunkSize.height / 2
                    }

                    let compare = false;
                    switch (layer.compare) {
                        case EnvironmentManager.Compare.More:
                            compare = v > layer.weight
                            break
                        case EnvironmentManager.Compare.Less:
                            compare = v < layer.weight
                            break
                        case EnvironmentManager.Compare.Between:
                            compare = v > layer.weight[0] && v < layer.weight[1]
                            break
                        case EnvironmentManager.Compare.Nor:
                            compare = v < layer.weight[0] || v > layer.weight[1]
                            break
                        case EnvironmentManager.Compare.Always:
                            compare = true;
                            break
                    }
                    if (compare) {
                        const data = {layer:layer.layer,  x: targetPosition.x, z: targetPosition.y, texture: layer.list[Math.floor(this.rnd.randomOffset(v + this.totalLayersDraw * layer.list.length) * layer.list.length)] }
                        data.width = layer.width;
                        data.height = layer.height;
                        const entity = this.levelManager.addEntity(EnvironmentManager.Constructors[layer.constructor], data)
                        this.bakedData[layerName].push(entity)
                        this.addChild(entity)
                    }
                }
            }
        }
        this.totalLayersDraw += 2.15;
    }
    updatePlayerChunk() {

        this.nextChunkId.i = Math.floor((this.player.transform.position.x + this.chunkSize.width / 2) / this.chunkSize.width)
        this.nextChunkId.j = Math.floor((this.player.transform.position.z + this.chunkSize.height / 2) / this.chunkSize.height)

        if (this.nextChunkId.i != this.currentChunkId.i || this.nextChunkId.j != this.currentChunkId.j) {

            this.drawOffset.i = this.nextChunkId.i - this.currentChunkId.i
            this.drawOffset.j = this.nextChunkId.j - this.currentChunkId.j
            this.currentChunkId.i = this.nextChunkId.i
            this.currentChunkId.j = this.nextChunkId.j

            this.drawAllLayers();

        }
    }
    drawAllLayers() {
        this.totalLayersDraw = 0;

        this.patches.forEach(element => {

            this.drawLayer(element.structure, this.currentChunkId)
        });
        // this.drawLayer(this.patches.rocks, this.currentChunkId)
        // this.drawLayer(this.patches.grass2, this.currentChunkId)
        // this.drawLayer(this.patches.plants, this.currentChunkId)
        // this.drawLayer(this.patches.trunks, this.currentChunkId)

        // this.drawLayer(this.patches.trees, this.currentChunkId)
    }
    update(delta) {

        this.updatePlayerChunk();

    }
    resize(res, newRes) {
        const nextI = Math.ceil(res.width * Game.GlobalScale.max / this.chunkSize.width) + 1
        const nextJ = Math.ceil(res.height * Game.GlobalScale.max / this.chunkSize.height) + 1

        let redraw = false;
        if (this.drawBoundsDistance.i != nextI || this.drawBoundsDistance.j != nextJ) {
            redraw = true;
        }
        this.drawBoundsDistance.i = nextI
        this.drawBoundsDistance.j = nextJ

        if (redraw) {
            this.drawAllLayers();

        }
    }
}
