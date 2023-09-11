import * as PIXI from 'pixi.js';
import utils from '../../../utils';
import CircleMask from '../../effects/CircleMask';
export default class Minimap extends PIXI.Container {
    constructor() {
        super();
        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.background = new PIXI.Graphics();
        this.container.addChild(this.background);

        this.miniMapContainer = new PIXI.Container();
        this.container.addChild(this.miniMapContainer);
        this.interactive = true;
        this.buttonMode = true;
        this.on('mousemove', this.moveDrag.bind(this))
            .on('touchmove', this.moveDrag.bind(this))

        this.on('mousedown', this.startDrag.bind(this))
            .on('touchstart', this.startDrag.bind(this));

        this.on('mouseup', this.endDrag.bind(this))
            .on('touchend', this.endDrag.bind(this))
            .on('touchendoutside', this.endDrag.bind(this))
            .on('mouseupoutside', this.endDrag.bind(this))
            .on('pointerout', this.endDrag.bind(this))
            .on('mouseout', this.endDrag.bind(this));

        this.miniMapMask = new PIXI.Graphics().beginFill(0x00FF00).drawRect(0, 0, 100, 100)
        this.addChild(this.miniMapMask);
        this.mask = this.miniMapMask;
        this.arrayRooms = [];
    }
    destroy() {
    	this.interactive = false;
    	this.alpha = 0.5;
        for (var i = 0; i < this.arrayRooms.length; i++) {
            if (this.arrayRooms[i] && this.arrayRooms[i].parent) {
                this.arrayRooms[i].parent.removeChild(this.arrayRooms[i]);
            }
        }
    }
    build(gen) {
        this.gen = gen;

        this.arrayRooms = [];
        this.margin = {
            x: 15,
            y: 15
        };
        this.sizeTile = {
            x: 40,
            y: 40
        };
        this.sizeGraph = {
            x: 20,
            y: 20
        };

        this.tileSides = {
            w: (this.sizeTile.x - this.sizeGraph.x) / 2,
            h: (this.sizeTile.y - this.sizeGraph.y) / 2
        }

        // console.log(this.gen.rooms);

        var minX = 9999;
        var minY = 9999;
        var maxX = -9999;
        var maxY = -9999;
        var tempX = 0;
        var tempY = 0;

        for (var j = 0; j < this.gen.rooms.length; j++) {
            var item = this.gen.rooms[j];


            for (var i = 0; i < item.length; i++) {
                if (item[i].id > 0) {
                    // console.log('item', item[i]);
                    var tempRoomView = new PIXI.Graphics();
                    var nodeColor = 0xffffff;
                    if (item[i].mode === 1) {
                        nodeColor = 0x52d468;
                    } else if (item[i].mode === 2) {
                        nodeColor = 0xaeaeae;
                    } else if (item[i].mode === 3) {
                        nodeColor = 0xf7cd39;
                    } else if (item[i].mode === 4) {
                        nodeColor = 0xf73939;
                    } else if (item[i].mode === 5) {
                        nodeColor = 0x212121;
                    } else if (item[i].mode === 6) {
                        nodeColor = 0xcb52c4;
                    } else {
                        nodeColor = 0xffffff;
                    }
                    tempRoomView.beginFill(nodeColor);
                    var tempSideGraphic;

                    tempX = item[i].position[1] * this.sizeTile.x;
                    tempY = item[i].position[0] * this.sizeTile.y;
                    tempRoomView.position.x = tempX;
                    tempRoomView.position.y = tempY;
                    tempRoomView.drawRect(0, 0, this.sizeGraph.x, this.sizeGraph.y);
                    tempRoomView.endFill();
                    this.miniMapContainer.addChild(tempRoomView);

                    for (var k = 0; k < item[i].childrenSides.length; k++) {
                        if (item[i].childrenSides[k]) {
                            if (k === 0) { //left
                                tempSideGraphic = new PIXI.Graphics();
                                tempSideGraphic.beginFill(nodeColor);
                                tempSideGraphic.drawRect(0, 0, this.tileSides.w, this.tileSides.w);
                                tempX = -this.sizeGraph.x / 2;
                                tempY = this.sizeGraph.y / 4; //this.sizeGraph.y;
                            } else if (k === 1) { //right
                                tempSideGraphic = new PIXI.Graphics();
                                tempSideGraphic.beginFill(nodeColor);
                                tempSideGraphic.drawRect(0, 0, this.tileSides.w, this.tileSides.w);
                                tempX = this.sizeGraph.x; //this.sizeGraph.y;
                                tempY = this.sizeGraph.y / 4;
                            } else if (k === 2) { //right
                                tempSideGraphic = new PIXI.Graphics();
                                tempSideGraphic.beginFill(nodeColor);
                                tempSideGraphic.drawRect(0, 0, this.tileSides.w, this.tileSides.w);
                                tempX = this.sizeGraph.x / 4; //this.sizeGraph.y;
                                tempY = -this.sizeGraph.y / 2;
                            } else if (k === 3) { //down
                                tempSideGraphic = new PIXI.Graphics();
                                tempSideGraphic.beginFill(nodeColor);
                                tempSideGraphic.drawRect(0, 0, this.tileSides.w, this.tileSides.w);
                                tempX = this.sizeGraph.x / 4; //this.sizeGraph.y;
                                tempY = this.sizeGraph.y;
                            }
                            if (tempSideGraphic) {
                                tempSideGraphic.position.x = tempX;
                                tempSideGraphic.position.y = tempY;
                                tempRoomView.addChild(tempSideGraphic);
                            }
                            tempSideGraphic = null;
                        }
                    }
                    if (minX > item[i].position[1]) {
                        minX = item[i].position[1];
                    }
                    if (minY > item[i].position[0]) {
                        minY = item[i].position[0];
                    }

                    if (maxX < item[i].position[1]) {
                        maxX = item[i].position[1];
                    }
                    if (maxY < item[i].position[0]) {
                        maxY = item[i].position[0];
                    }
                    tempRoomView.id = item[i].id;
                    this.arrayRooms.push(tempRoomView);
                }
            }
        }
        for (var k = 0; k < this.arrayRooms.length; k++) {
            this.arrayRooms[k].position.x -= minX * this.sizeTile.x - this.margin.x - this.sizeGraph.x / 2;
            this.arrayRooms[k].position.y -= minY * this.sizeTile.y - this.margin.y - this.sizeGraph.y / 2;
        }
        // console.log(minX,minY,maxX,maxY, maxX * this.margin.x, this.margin.x);
        this.background.beginFill(0x0);
        this.background.drawRect(0, 0,
            (maxX - minX + 1) * this.sizeTile.x + this.margin.x * 2 + this.sizeGraph.x / 2,
            (maxY - minY + 1) * this.sizeTile.y + this.margin.y * 2 + this.sizeGraph.y / 2);
        this.background.endFill();

        this.interactive = true;

    }
    setArea(w = 100, h = 100) {
        if (this.miniMapMask && this.miniMapMask.parent) {
            this.miniMapMask.parent.removeChild(this.miniMapMask)
        }
        this.miniMapMask = new PIXI.Graphics().beginFill(0x00FF00).drawCircle(w / 2, w / 2, w / 2)
        this.addChild(this.miniMapMask);
        this.mask = this.miniMapMask;
        this.mapBounds = {
            x: 0,
            y: 0,
            w: w,
            h: h
        }


        this.background.beginFill(0x0);
        this.background.drawRect(0, 0, w, h);
        this.background.endFill();
    }
    centerMap(node) {
        let toCenter = this.arrayRooms[0]
        for (var i = 0; i < this.arrayRooms.length; i++) {
            if (this.arrayRooms[i].id == node.id) {
                toCenter = this.arrayRooms[i];
            }
        }
        this.currentCenter = toCenter;
        if (toCenter) {
            let pos = this.getCenterPosition()
            this.miniMapContainer.x = pos.x;
            this.miniMapContainer.y = pos.y;
        }
    }
    getCenterPosition() {
        let pos = {
            x: -this.currentCenter.x + this.mapBounds.x + this.mapBounds.w / 2 - this.sizeGraph.x / 2,
            y: -this.currentCenter.y + this.mapBounds.y + this.mapBounds.h / 2 - this.sizeGraph.y / 2
        }
        return pos;
    }
    endDrag() {
        if (!this.enableDrag) {
            return;
        }
        this.dragging = false;
        let pos = this.getCenterPosition()
        this.alpha = 0.5;
        TweenLite.to(this.miniMapContainer, 0.75, {
            x: pos.x,
            y: pos.y,
            ease: Back.easeOut
        })
    }
    moveDrag(e) {
        if (!this.enableDrag) {
            return;
        }
        if (this.dragging) {

            this.container.alpha = 1;
            this.dragVelocity = {
                x: this.currentMousePos.x - e.data.global.x,
                y: this.currentMousePos.y - e.data.global.y
            }
            this.currentMousePos = {
                x: e.data.global.x,
                y: e.data.global.y
            };

            this.miniMapContainer.x -= this.dragVelocity.x
            this.miniMapContainer.y -= this.dragVelocity.y

            console.log(this.dragVelocity.x);

            // if (this.dragVelocity.y > 0) {
            //     this.containerBackground.interactive = true;
            // } else if (this.dragVelocity.y < 0) {
            //     this.containerBackground.interactive = true;
            // }
        }
    }
    startDrag(e) {
    	console.log('START DRAG');
        this.enableDrag = true;
        TweenLite.killTweensOf(this.miniMapContainer);
        this.dragging = true;
        this.alpha = 1;
        this.currentMousePos = {
            x: e.data.global.x,
            y: e.data.global.y
        };
    }
}