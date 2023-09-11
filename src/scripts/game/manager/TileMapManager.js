import utils from "../../utils";

export default class TileMapManager {
    constructor() {
        this.tiles = [];
    }
    buildMap(worldData, worldManager, tileWidth = 64, tileHeight = 64) {
        console.log(worldData, worldManager);

        let i = worldManager.gameWorld.width / tileWidth ;
        let j = worldManager.gameWorld.height / tileHeight ;

        this.pixelContainer = new PIXI.Container();

        let pixelSize = 2
        //console.log(pixelSize)
        for (let x = 0; x < i; x++) {
            let line = [];
            for (let y = 0; y < j; y++) {
                let point = [x * tileWidth/ worldManager.gameWorld.scale, y * tileHeight/ worldManager.gameWorld.scale]
                let found = worldManager.findCellByPosition(point)
                if (!found) {

                    line.push(null);
                } else {
                    if (found.biome) {
                        line.push({isAdj:found.isAdj, biome:found.biome});

                        let gr = new PIXI.Graphics().beginFill(found.isAdj? found.biome.adjColor: found.biome.coreColor).drawRect(x*pixelSize,y*pixelSize,pixelSize,pixelSize);
                        this.pixelContainer.addChild(gr);
                    } else {
                        line.push(null);
                    }
                }
            }
            this.tiles.push(line);
        }
        return utils.generateSpriteFromContainer('test',this.pixelContainer, []);
    }
}