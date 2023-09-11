import RandomGenerator from "../core/utils/RandomGenerator";
import TileMapManager from "./TileMapManager";
import Voronoi from "voronoi";
import grahamScan from "graham-scan";
import utils from "../../utils";

export default class WorldManager {
    static instance;

    constructor(container) {

        this.biomes = {
            shrine: {
                weight: 30,
                coreColor: 0xaa33FF,
                adjColor: 0xee33FF,
                adjFreq: 1,
                propagation: 0,
            },
            boss: {
                weight: 300,
                coreColor: 0xFF0000,
                adjColor: 0xaa3333,
                adjFreq: 1,
                propagation: 0,
                endPropagationNode: 'forest'
            },
            denseForest: {
                weight: 3,
                coreColor: 0x108907,
                adjColor: 0x558955,
                adjFreq: 1,
                propagation: 0,
                endPropagationNode: 'forest'
            },
            forest: {
                weight: 3,
                coreColor: 0x108907,
                adjColor: 0x558955,
                adjFreq: 1,
                propagation: 2,
                endPropagationNode: 'grassland'
            },
            grassland: {
                weight: 2,
                coreColor: 0x108907,
                adjColor: 0x91ce7a,
                adjFreq: 1,
                propagation: 2,
            },
            deepLake: {
                weight: 8,
                coreColor: 0x2179f4,
                adjColor: 0x3be5f1,
                adjFreq: 1,
                propagation: 0,
                endPropagationNode: 'lake'

            },
            lake: {
                weight: 1,
                coreColor: 0x2179f4,
                adjColor: 0x3be5f1,
                adjFreq: 1,
                propagation: 1,
                endPropagationNode: 'marsh'
            },
            mountain: {
                weight: 5,
                coreColor: 0xaaaaaa,
                adjColor: 0x555555,
                adjFreq: 1,
                propagation: 1,
            },
            desert: {
                weight: 1,
                coreColor: 0xEAA56C,
                adjColor: 0xEAA5aa,
                adjFreq: 1,
                propagation: 1,
            },
            marsh: {
                weight: 4,
                coreColor: 0xEAA56C,
                adjColor: 0x107260,
                adjFreq: 1,
                propagation: 1,
            }
        }

        WorldManager.instance = this;
        this.container = container;
        this.container.scale.set(1)
        this.width = 500
        this.height = 500
        this.gameWorld = {
            scale: 20,
            width: this.width,
            height: this.height,
        }
        this.gameWorld.width = this.width * this.gameWorld.scale
        this.gameWorld.height = this.height * this.gameWorld.scale

        this.tileMapManager = new TileMapManager();

        this.playerInWorld = { x: 0, y: 0 }

        var voronoi = new Voronoi();
        var bbox = { xl: 0, xr: this.width, yt: 0, yb: this.height };
        var sites = []

        this.worldStats = {
            seed:34560// Math.round(Math.random() * 50000)
        }
        window.GUI.add(this.worldStats, 'seed').listen();

        this.randomGenerator = new RandomGenerator(this.worldStats.seed);

        let lines = 25
        let cols = 15
        let cellSize = { width: this.width / lines, height: this.height / cols }
        for (let i = 0; i <= lines; i++) {
            for (let j = 0; j <= cols; j++) {
                let ang = Math.atan2(j - cols / 2, i - lines / 2)

                let dist = utils.distance(i, j, cols / 2, lines / 2) / lines
                sites.push({
                    x: (cellSize.width) * i + Math.cos(ang) * 70 * dist + (this.randomGenerator.random() * cellSize.width - cellSize.width / 2),
                    y: (cellSize.height) * j + Math.sin(ang) * 70 * dist + (this.randomGenerator.random() * cellSize.height - cellSize.height / 2)//* dist
                })
            }
        }
        sites.push({
            x: (cellSize.width) * lines / 2,
            y: (cellSize.height) * cols / 2
        })

        var diagram = voronoi.compute(sites, bbox);
        ///https://www.npmjs.com/package/voronoi
        //console.log(diagram)
        this.cellsContainer = new PIXI.Container();
        this.container.addChild(this.cellsContainer)

        this.numbersContainer = new PIXI.Container();
        this.container.addChild(this.numbersContainer)
        this.busyTiles = []

        this.currentWorldData = {
            cells: []
        }
        diagram.cells.forEach(element => {
            if (element.halfedges.length) {
                let mid = new PIXI.BitmapText(element.site.voronoiId.toString(), { fontName: 'damage1' });
                mid.anchor.set(0.5)
                mid.x = element.site.x
                mid.y = element.site.y
                let toAdd = []
                let onBounds = true;
                for (let index = 0; index < element.halfedges.length; index++) {
                    const edge = element.halfedges[index];

                    let edgeA = { x: edge.edge.va.x, y: edge.edge.va.y }
                    let edgeB = { x: edge.edge.vb.x, y: edge.edge.vb.y }

                    toAdd = toAdd.filter(item => item.x !== edgeA.x && item.y !== edgeA.y)
                    toAdd.push(edgeA)

                    toAdd = toAdd.filter(item => item.x !== edgeB.x && item.y !== edgeB.y)
                    toAdd.push(edgeB)

                    if (onBounds) {
                        onBounds = this.onBounds(edge.edge.va)
                    }
                    if (onBounds) {
                        onBounds = this.onBounds(edge.edge.vb)
                    }
                }
                if (onBounds) {
                    let toScan = []
                    toAdd.forEach(v => {
                        toScan.push([v.x, v.y])
                    });
                    toScan = grahamScan(toScan);

                    let polygonPoints = []

                    toScan.forEach(result => {
                        polygonPoints.push({ x: result[0], y: result[1] })
                    });

                    let center = this.findCenter(toScan)
                    mid.x = center[0]
                    mid.y = center[1]
                    //this.numbersContainer.addChild(mid)
                    mid.scale.set(0.8)
                    this.busyTiles.push(-1)
                    this.currentWorldData.cells.push(
                        {
                            id: element.site.voronoiId,
                            isHole: false,
                            view: null,//wrong
                            numberView: mid,//wrong
                            color: 0,
                            neighborsOld: element.getNeighborIds(),
                            neighbors: [],
                            pointsArray: toScan,
                            points: polygonPoints,
                            center: { x: center[0], y: center[1] }
                        }
                    )
                }
            }
        });


        let idAccum = 0;
        this.currentWorldData.cells.forEach(element => {
            let currentID = element.id;

            this.currentWorldData.cells.forEach(others => {
                for (let index = 0; index < others.neighborsOld.length; index++) {
                    if (others.neighborsOld[index] == currentID) {
                        others.neighbors.push(idAccum);
                    }
                }
            });

            element.id = idAccum;
            element.numberView.text = idAccum
            idAccum++;
        });

        

        this.currentPlayerCell = 0;

        ////////FIND BOSS
        this.bossCell = this.findCellByPosition([this.width / 2, this.height / 2])
        this.busyTiles[this.bossCell.id] = 10
        this.setBiomeToCell(this.bossCell, this.biomes.boss)
        this.bossCell.neighbors.forEach(element => {
            this.busyTiles[element] = 10
            this.setBiomeToCell(this.currentWorldData.cells[element], this.biomes.boss, true)
        });
        this.shrines = [];
        let startAngle = Math.PI * 2 * this.randomGenerator.random();
        let totalShrines = 4;
        for (let index = 0; index < totalShrines; index++) {
            let shrine = this.findCellByPosition([this.width / 2 + Math.cos(startAngle) * this.width / 4, this.height / 2 + Math.sin(startAngle) * this.height / 4])
            if (!shrine) continue
            this.busyTiles[shrine.id] = 10

            this.setBiomeToCell(shrine, this.biomes.shrine)
            startAngle += Math.PI * 2 / totalShrines + this.randomGenerator.random() * 0.1;
            this.shrines.push(shrine)
        }


        this.mapBuildData = [
            {
                total: Math.floor(lines * 0.5),
                biome: this.biomes.denseForest,
                cells: []
            },
            {
                total: Math.floor(lines * 0.25),
                biome: this.biomes.deepLake,
                cells: []
            },
            {
                total: Math.floor(lines * 0.25),
                biome: this.biomes.mountain,
                cells: []
            },
        ]
        this.mapBuildData.forEach(element => {
            element.panic = 0;
            let biome = element.biome
            while (element.cells.length < element.total) {
                let cellID = Math.floor(this.currentWorldData.cells.length * this.randomGenerator.random());

                element.panic++;
                if (element.panic > 100) {
                    break
                }

                if (this.busyTiles[cellID] > biome.weight) continue;
                let cell = this.currentWorldData.cells[cellID]
                if (!cell) continue

                element.cells.push(cell)
                this.setBiomeToCell(cell, biome)
                this.busyTiles[cellID] = biome.weight
                this.applyNeighbors(cell, biome, biome.propagation)
            }
        });


        //this close gaps
        for (let index = 0; index < 3; index++) {
            this.currentWorldData.cells.forEach(element => {
                if (this.busyTiles[element.id] >= 0) {
                    //this.drawCell(element)
                } else {
                    element.isHole = true;
                }
            });
            this.findIsolated()
        }


        let view = this.tileMapManager.buildMap(this.currentWorldData, this);

        this.container.addChild(view)

        //view.y = 800

       // view.scale.set(0.5)

        //view.alpha = 0.5

        this.playerOnMap = new PIXI.Sprite.from('icon_increase')
        this.playerOnMap.anchor.set(0.5)
        this.container.addChild(this.playerOnMap)

    }
    drawTilemap() {

    }
    drawCell(cell) {
        let gr = new PIXI.Graphics();
        gr.lineStyle(1, 0x999999)
        gr.beginFill(0xffffff)
        gr.tint = cell.color


        gr.moveTo(cell.points[0].x, cell.points[0].y)
        for (let v = 1; v < cell.points.length; v++) {
            const vertex = cell.points[v];
            gr.lineTo(vertex.x, vertex.y)
        }
        gr.lineTo(cell.points[0].x, cell.points[0].y)
        this.cellsContainer.addChild(gr)
        cell.view = gr
    }
    findIsolated() {
        this.currentWorldData.cells.forEach(cell => {

            if (!cell.isHole) {
                let isSurounded = false;

                cell.neighbors.forEach(neighbor => {
                    if (!isSurounded && !this.currentWorldData.cells[neighbor].isHole) {
                        isSurounded = true;
                    }
                })
                if (!isSurounded) {
                    this.applyNeighbors(cell, this.biomes.marsh, 1)
                }
            }
        });
    }
    applyNeighbors(cell, element, propagation = -1) {
        if (propagation < 0) return;
        cell.neighbors.forEach(neighbor => {
            if (this.busyTiles[neighbor] < element.weight && this.randomGenerator.random() < element.adjFreq) {

                this.busyTiles[neighbor] = element.weight
                this.setBiomeToCell(this.currentWorldData.cells[neighbor], element, true)

                if (propagation > 0) {
                    this.applyNeighbors(this.currentWorldData.cells[neighbor], element, propagation - 1)
                } else if (propagation == 0 && element.endPropagationNode) {
                    this.applyNeighbors(this.currentWorldData.cells[neighbor], this.biomes[element.endPropagationNode], this.biomes[element.endPropagationNode].propagation)
                }
            }
        });
    }
    get scale() {
        return this.gameWorld.scale
    }
    setBiomeToCell(cell, biome, isAdj = false) {
        cell.color = isAdj ? biome.adjColor : biome.coreColor;
        cell.biome = biome;
        cell.isAdj = isAdj;        
        if (cell.view) {
            cell.view.tint = cell.color
        }
    }
    findCenter(arr) {
        var x = arr.map(function (a) { return a[0] });
        var y = arr.map(function (a) { return a[1] });
        var minX = Math.min.apply(null, x);
        var maxX = Math.max.apply(null, x);
        var minY = Math.min.apply(null, y);
        var maxY = Math.max.apply(null, y);
        return [(minX + maxX) / 2, (minY + maxY) / 2];
    }

    inside(point, vs) {
        var x = point[0], y = point[1];

        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }
    findCellByPosition(point) {
        for (let index = 0; index < this.currentWorldData.cells.length; index++) {
            const cellPoints = this.currentWorldData.cells[index].pointsArray;
            if (this.inside(point, cellPoints)) {
                if (Array.isArray(this.currentWorldData.cells[index])) {
                    console.log(this.currentWorldData.cells[index])
                    return null;
                }
                return this.currentWorldData.cells[index];
            }
        }
        return null;
    }
    onBounds(edge) {
        return edge.x > 0 && edge.x < this.width && edge.y > 0 && edge.y < this.height
    }
    getFirstNode() {
        for (let index = 0; index < this.currentWorldData.cells.length; index++) {
            const element = this.currentWorldData.cells[index];
            if (element.isHole) continue;
            this.currentPlayerCell = index;
            break;
        }
        return this.currentWorldData.cells[this.currentPlayerCell]
    }
    setPlayer(player) {
        this.player = player;
        this.playerInWorld.x = this.player.transform.position.x / this.gameWorld.scale
        this.playerInWorld.y = this.player.transform.position.y / this.gameWorld.scale
    }
    findPlayerCell() {
        let current = this.currentWorldData.cells[this.currentPlayerCell]
        let playerArrayPosition = [this.playerInWorld.x, this.playerInWorld.y]
        if (this.inside(playerArrayPosition, current.pointsArray)) {
            return this.currentPlayerCell;
        } else {
            for (let index = 0; index < current.neighbors.length; index++) {
                const neighborId = current.neighbors[index];
                let neighbor = this.currentWorldData.cells[neighborId]
                if (this.inside(playerArrayPosition, neighbor.pointsArray)) {
                    if (this.currentWorldData.cells[this.currentPlayerCell].view) {
                        this.currentWorldData.cells[this.currentPlayerCell].view.tint = this.currentWorldData.cells[this.currentPlayerCell].color;
                    }
                    return neighborId;
                }
            }
        }
        //this means is outside of the bounds
        return this.currentPlayerCell;
    }
    setCurrentPlayerCell(id) {
        this.currentPlayerCell = id;
    }
    update(delta) {
        if (!this.player) {
            return;
        }

        this.currentPlayerCell = this.findPlayerCell();

        if (this.currentWorldData.cells[this.currentPlayerCell].view) {
            this.currentWorldData.cells[this.currentPlayerCell].view.tint = 0xFFFFFF;
        }

        this.playerInWorld.x = this.player.transform.position.x / this.gameWorld.scale
        this.playerInWorld.y = this.player.transform.position.y / this.gameWorld.scale

        this.playerOnMap.rotation = this.player.transform.angle + Math.PI / 2;

        this.playerOnMap.x = this.playerInWorld.x
        this.playerOnMap.y = this.playerInWorld.y
    }
}