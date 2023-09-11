import * as PIXI from 'pixi.js';

import Signals from 'signals';

export default class ListScroller extends PIXI.Container {
    constructor(rect = { w: 250, h: 500 }, slotSize = { width: 75, height: 75 }, margin = { x: 0, y: 0 }, masked = true, space = 0) {
        super();
        this.marginTop = 0;
        this.space = space;
        this.itens = [];
        this.totalLines = 0;
        this.container = new PIXI.Container();
        this.listContainer = new PIXI.Container();

        this.modalTexture = 'modal_container0006'

        this.containerBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(this.modalTexture), 20, 20, 20, 20);
        this.containerBackground.width = rect.w
        this.containerBackground.height = rect.h
        //this.containerBackground = new PIXI.Graphics().beginFill(0x000000).drawRoundedRect(0, 0, rect.w, rect.h, 20);
        this.containerBackground.alpha = 0.55;




        this.rect = rect;

        this.isHorizontal = false;

        this.container.addChild(this.containerBackground);
        this.container.addChild(this.listContainer);
        this.addChild(this.container);

        this.dragCounter = 0;

        this.containerForeground = new PIXI.NineSlicePlane(PIXI.Texture.from(this.modalTexture), 20, 20, 20, 20);
        this.containerForeground.width = rect.w
        this.containerForeground.height = rect.h
        this.containerForeground.alpha = 0;

        this.addChild(this.containerForeground);


        if (masked) {
            this.maskGraphic = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, rect.w, rect.h);
            this.addChild(this.maskGraphic)
            //this.container.mask = this.maskGraphic;
        }
        this.container.interactive = true;

        this.extraHeight = 0;

        this.container.on('mousemove', this.moveDrag.bind(this))
            .on('touchmove', this.moveDrag.bind(this))

        this.container.on('mousedown', this.startDrag.bind(this))
            .on('touchstart', this.startDrag.bind(this));

        this.container.on('mouseup', this.endDrag.bind(this))
            .on('touchend', this.endDrag.bind(this))
            .on('touchendoutside', this.endDrag.bind(this))
            .on('mouseupoutside', this.endDrag.bind(this));
    }
    resize(rect = { w: 250, h: 500 }, slotSize = { width: 75, height: 75 }, margin = { x: 0, y: 0 }) {
        this.rect = rect;

        if (this.maskGraphic) {
            this.removeChild(this.maskGraphic)
            this.maskGraphic = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, rect.w, rect.h);
            this.addChild(this.maskGraphic)
            this.container.mask = this.maskGraphic;
        }

        if (this.containerBackground) {
            this.container.removeChild(this.containerBackground)
            // this.containerBackground = new PIXI.Graphics().beginFill(0x000000).drawRoundedRect(0, 0, rect.w, rect.h, 20);
            // this.containerBackground.alpha = 0.55;


            this.containerBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(this.modalTexture), 20, 20, 20, 20);
            this.containerBackground.width = rect.w
            this.containerBackground.height = rect.h

            this.containerForeground.width = rect.w
            this.containerForeground.height = rect.h
            //this.containerBackground = new PIXI.Graphics().beginFill(0x000000).drawRoundedRect(0, 0, rect.w, rect.h, 20);
            this.containerBackground.alpha = 0.55;
            this.container.addChildAt(this.containerBackground, 0)
        }
        this.calcSize(slotSize);
    }
    calcSize(slotSize) {

        if (!slotSize) {
            this.itemWidth = rect.w / this.gridDimensions.j
            this.itemHeight = rect.h / this.gridDimensions.i
        } else {
            this.itemWidth = slotSize.width
            this.itemHeight = slotSize.height
        }
    }
    resetPosition() {
        this.listContainer.y = 0;
        this.listContainer.x = 0;
        this.enableDrag = false;
    }
    addItens(itens, fit = false) {
        for (var i = 0; i < itens.length; i++) {
            let tempItem = itens[i];
            this.listContainer.addChild(tempItem)
            tempItem.y = (this.itemHeight + this.space) * this.itens.length - 1 + this.marginTop;

            if (fit) {
                tempItem.scale.set(this.itemHeight / tempItem.height);
            }

            this.itens.push(tempItem);

        }
        this.totalLines = this.itens.length;
        this.lastItemClicked = this.itens[0]
    }
    endDrag() {
        if (!this.enableDrag) {
            return;
        }
        this.dragging = false;
        this.containerBackground.interactive = false;
        this.containerForeground.interactive = false;
        this.containerForeground.visible = false;
        const axis = this.isHorizontal ? 'x' : 'y'

        let target = 0;
        let targY = this.listContainer[axis]
        let maxH = this.itemHeight * this.totalLines + this.extraHeight;
        let maxW = this.itemWidth * this.totalLines + this.extraHeight;

        if (this.isHorizontal) {
            if (this.goingDown == 1) {
                targY -= this.itemWidth / 2;
                target = Math.floor(targY / this.itemWidth) * this.itemWidth

            } else if (this.goingDown == -1) {

                targY += this.itemWidth / 2;
                target = Math.ceil(targY / this.itemWidth) * this.itemWidth
            }
        } else {

            if (this.goingDown == 1) {
                targY -= this.itemHeight / 2;
                target = Math.floor(targY / this.itemHeight) * this.itemHeight

            } else if (this.goingDown == -1) {

                targY += this.itemHeight / 2;
                target = Math.ceil(targY / this.itemHeight) * this.itemHeight
            }
        }


        if (axis == 'y') {

            console.log("HERE 2", target , maxH , this.containerBackground.height)
            if (target > 0) {
                TweenLite.to(this.listContainer, 0.75, {
                    y: 0,
                    ease: Back.easeOut
                })
            } else if (target + maxH < this.containerBackground.height) {
                TweenLite.to(this.listContainer, 0.75, {
                    y: this.containerBackground.height - maxH, // - this.listContainer.height,
                    ease: Back.easeOut
                })
            } else if (target != 0) {
                TweenLite.to(this.listContainer, 0.75, {
                    y: target,
                    ease: Back.easeOut
                })
            }
        } else {
            if (target > 0) {
                TweenLite.to(this.listContainer, 0.75, {
                    x: 0,
                    ease: Back.easeOut
                })
            } else if (target + maxW > this.containerBackground.width) {
                TweenLite.to(this.listContainer, 0.75, {
                    x: -(this.containerBackground.width - maxW), // - this.listContainer.height,
                    ease: Back.easeOut
                })
            } else if (target != 0) {
                TweenLite.to(this.listContainer, 0.75, {
                    x: target,
                    ease: Back.easeOut
                })
            }
        }
    }
    moveDrag(e) {
        if (!this.enableDrag) {
            this.goingDown = 0;
            return;
        }
        if (this.dragging) {

            const axis = this.isHorizontal ? 'x' : 'y'
            // this.spaceShipInfoContainer.visible = false;
            // if (this.lastItemClicked) {
            //     this.lastItemClicked.visible = true;
            // }
            this.container.alpha = 1;
            this.dragVelocity = {
                x: this.currentMousePos.x - e.data.global.x,
                y: this.currentMousePos.y - e.data.global.y
            }
            this.currentMousePos = {
                x: e.data.global.x,
                y: e.data.global.y
            };

            this.listContainer[axis] -= this.dragVelocity[axis]

            if (this.dragVelocity[axis] > 0) {
                this.containerBackground.interactive = true;
                this.containerForeground.interactive = true;
                this.containerForeground.visible = true;
                if (this.dragVelocity[axis] > 1) {

                    this.goingDown = 1;
                }
            } else if (this.dragVelocity[axis] < 0) {
                this.containerBackground.interactive = true;
                this.containerForeground.interactive = true;
                this.containerForeground.visible = true;
                if (this.dragVelocity[axis] < -1) {

                    this.goingDown = -1;
                }
            }

            this.dragCounter++;
        }
    }
    startDrag(e) {
        if (this.listContainer.height < this.containerBackground.height) {
            return
        }
        this.enableDrag = true;

        this.dragCounter = 0;
        this.goingDown = 0;
        TweenLite.killTweensOf(this.listContainer);
        this.dragging = true;
        this.currentMousePos = {
            x: e.data.global.x,
            y: e.data.global.y
        };
    }
}