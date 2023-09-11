import GameObject from "../core/GameObject";
import GameView from "../core/view/GameView";
import Player from "../entity/Player";
import RenderModule from "../modules/RenderModule";
import WorldManager from "./WorldManager";

export default class WorldRender extends GameObject {
    static instance;

    constructor() {
        super()
        this.gameView = new GameView();
        this.gameView.view = new PIXI.Container()

        this.gameView.layer = RenderModule.RenderLayers.Base;

        this.tileMap = WorldManager.instance.tileMapManager;

        this.visibleTiles = [];
        this.i = 40;
        this.j = 40

        this.tileSize = 64;
        for (let i = 0; i < this.i; i++) {
            let line = []
            for (let j = 0; j < this.j; j++) {
                let tile = new PIXI.Sprite.from('tile')
                this.gameView.view.addChild(tile)
                line.push(tile)
                tile.width = this.tileSize
                tile.height = this.tileSize
                tile.x = i * this.tileSize - this.i / 2 * this.tileSize
                tile.y = j * this.tileSize - this.j / 2 * this.tileSize
            }
            this.visibleTiles.push(line)
        }
        this.playerTileID = { i: 0, j: 0 }
    }
    start() {
        this.player = this.engine.findByType(Player)
    }
    update(delta) {
        this.playerTileID.i = Math.floor(this.player.transform.position.x / this.tileSize)
        this.playerTileID.j = Math.floor(this.player.transform.position.y / this.tileSize)
        this.gameView.view.x = this.playerTileID.i * this.tileSize
        this.gameView.view.y = this.playerTileID.j * this.tileSize

        //this.tileMap.tiles

        let halfBackI = this.playerTileID.i - this.visibleTiles[0].length / 2;
        let halfFrontI = this.playerTileID.i + this.visibleTiles[0].length / 2;

        let halfBackJ = this.playerTileID.j - this.visibleTiles.length / 2;
        let halfFrontJ = this.playerTileID.j + this.visibleTiles.length / 2;

        //for (let i = this.playerTileID.i - this.visibleTiles[0].length / 2; i < this.playerTileID.i + this.visibleTiles[0].length / 2; i++) {

        //console.log(this.playerTileID)

        for (let i = 0; i < this.visibleTiles.length; i++) {
            for (let j = 0; j < this.visibleTiles[i].length; j++) {
                const tile = this.visibleTiles[i][j];

                if (
                    i + this.playerTileID.i >= 0 &&
                    i + this.playerTileID.i < this.tileMap.tiles.length &&
                    j + this.playerTileID.j >= 0 &&
                    j + this.playerTileID.j < this.tileMap.tiles[0].length) {
                    let biomeData = this.tileMap.tiles  [i + this.playerTileID.i][j + this.playerTileID.j ];

                    if (biomeData) {
                        tile.tint = biomeData.isAdj? biomeData.biome.adjColor:biomeData.biome.coreColor;
                        tile.visible = true;
                    } else {
                        tile.visible = false;
                    }
                }else{
                    tile.visible = false;
                }

            }

        }
        // let n = false

        // let tileCounti = -1
        // let tileCountj = -1
        // for (let i = halfBackI; i < halfFrontI -1; i++) {
        //     tileCountj ++;

        //     if(tileCountj >= this.visibleTiles.length) break;
        //     for (let j = halfBackJ; j < halfFrontJ -1; j++) {
        //         tileCounti ++;

        //         if(tileCounti >= this.visibleTiles[0].length) break;
        //         if(j < 0 || i < 0 || j >= this.tileMap.tiles[0].length || i >= this.tileMap.tiles.length ) continue

        //         if(!n){
        //             n = true
        //             console.log(i,j)
        //             console.log(halfBackI, halfFrontI, this.tileMap.tiles.length, this.tileMap.tiles[0].length, this.playerTileID)         
        //         }
        //         const element = this.tileMap.tiles[j][i];
        //         if (element) {
        //             this.visibleTiles[tileCounti][tileCountj].tint = element.coreColor;
        //             this.visibleTiles[tileCounti][tileCountj].visible = true;
        //         } else {
        //             this.visibleTiles[tileCounti][tileCountj].visible = false;
        //         }
        //     }

        // }
    }
}