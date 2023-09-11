import * as PIXI from 'pixi.js';

export default class UIList extends PIXI.Container {
    constructor() {
        super();
        this.container = new PIXI.Container();
        this.addChild(this.container);
        this.elementsList = [];
        this.w = 0;
        this.h = 0;
    }
    // listScl
    // fitHeight
    // fitWidth
    // scaleContent
    // scaleContentMax
    // align
    debug() {
        this.debugGr = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, this.w, this.h)
        this.container.addChild(this.debugGr)
        this.debugGr.alpha = 0.5;
    }
    removeElement(element) {
        this.container.removeChild(element)

        let toRemove = -1;
        for (let index = 0; index < this.elementsList.length; index++) {
            if (element == this.elementsList[index]) {
                toRemove = index
            }

        }
        if (toRemove >= 0) {

            this.elementsList.splice(toRemove, 1)
        }
    }
    addElement(element, att = {}) {
        // listScl 
        // fitHeight
        // fitWidth
        // scaleContent
        // scaleContentMax
        // align
        for (const key in att) {
            element[key] = att[key];
        }
        this.container.addChild(element)
        this.elementsList.push(element)
    }
    updateHorizontalList(debug = false) {
        let listSizes = [];
        let sum = 0;
        let quant = 0;
        for (var i = 0; i < this.elementsList.length; i++) {

            if (this.elementsList[i].listScl) {
                listSizes.push(this.elementsList[i].listScl)
                sum += this.elementsList[i].listScl;
                quant++;
            }
            else {
                listSizes.push(0);
            }
        }
        let adjust = 1 - sum;
        let scales = adjust / ((this.elementsList.length) - quant);
        let chunkSize = 0;
        for (var i = 0; i < this.elementsList.length; i++) {
            if (listSizes[i] == 0) {
                listSizes[i] = scales
            }
        }
        let plus = 0;
        let positions = [];
        let stdH = 1;
        let stdW = 1;
        let pixig;
        for (var i = 0; i < listSizes.length; i++) {
            if (debug) {

                pixig = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 5)
                this.container.addChild(pixig)
            }
            plus = 0;
            let nextX = 0;
            chunkSize = this.w * listSizes[i];
            if (i == 0) {
                nextX = 0;
            }
            else {
                nextX = positions[i - 1] + this.w * listSizes[i - 1]
            }
            positions.push(nextX);
            if (this.elementsList[i].fitHeight) {
                stdH = (this.elementsList[i].height / this.elementsList[i].scale.y)
                this.elementsList[i].scale.set(this.h / stdH * this.elementsList[i].fitHeight)
            }
            else if (this.elementsList[i].fitWidth) {
                stdW = (this.elementsList[i].width / this.elementsList[i].scale.x)
                this.elementsList[i].scale.set(chunkSize / stdW * this.elementsList[i].fitWidth)
            }
            else if (this.elementsList[i].scaleContent) {
                stdW = (this.elementsList[i].width / this.elementsList[i].scale.x)
                this.elementsList[i].scale.set(chunkSize / stdW)
            }
            else if (this.elementsList[i].scaleContentMax && (this.elementsList[i].width > chunkSize)) {
                stdW = (this.elementsList[i].width / this.elementsList[i].scale.x)
                this.elementsList[i].scale.set(chunkSize / stdW)
            }
            let align = 0.5
            if (this.elementsList[i].align != undefined) {
                align = this.elementsList[i].align;
            }

            this.elementsList[i].x = nextX + chunkSize * align - this.elementsList[i].width * align;
            if (debug) {

                pixig.x = this.elementsList[i].x
            }

            let vAlign = 0.5
            if (this.elementsList[i].vAlign != undefined) {
                vAlign = this.elementsList[i].vAlign;
            }
            this.elementsList[i].y = this.h / 2 - this.elementsList[i].height * vAlign
        }

    }

    removeAllElements() {
        while (this.container.children.length) {
            this.container.removeChildAt(0)
        }

        this.elementsList = []
    }
    updateVerticalList(debug = false) {
        let listSizes = [];
        let sum = 0;
        let quant = 0;
        for (var i = 0; i < this.elementsList.length; i++) {

            if (this.elementsList[i].listScl) {
                listSizes.push(this.elementsList[i].listScl)
                sum += this.elementsList[i].listScl;
                quant++;
            }
            else {
                listSizes.push(0);
            }
        }
        let adjust = 1 - sum;
        let scales = adjust / ((this.elementsList.length) - quant);
        let chunkSize = 0;
        for (var i = 0; i < this.elementsList.length; i++) {
            if (listSizes[i] == 0) {
                listSizes[i] = scales
            }
        }
        let plus = 0;
        let positions = [];
        let stdH = 1;
        let stdW = 1;
        let pixig;

        for (var i = 0; i < listSizes.length; i++) {
            if (debug) {

                pixig = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 5)
                this.container.addChild(pixig)
            }
            let anchorX = this.elementsList[i].anchorX !== undefined ? this.elementsList[i].anchorX : 0.5;
            // let pixig = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 5)
            // this.container.addChild(pixig)
            plus = 0;
            let nextX = 0;
            chunkSize = this.h * listSizes[i];
            if (i == 0) {
                nextX = 0;
            }
            else {
                nextX = positions[i - 1] + this.h * listSizes[i - 1]
            }
            positions.push(nextX);
            if (this.elementsList[i].fitHeight) {
                stdH = (this.elementsList[i].height / this.elementsList[i].scale.y)
                this.elementsList[i].scale.set(chunkSize / stdH * this.elementsList[i].fitHeight)
            }
            else if (this.elementsList[i].fitWidth) {
                stdW = (this.elementsList[i].width / this.elementsList[i].scale.x)
                this.elementsList[i].scale.set(this.w / stdW * this.elementsList[i].fitWidth)
            }
            else if (this.elementsList[i].scaleContent) {
                stdW = (this.elementsList[i].height / this.elementsList[i].scale.y)
                this.elementsList[i].scale.set(chunkSize / stdW)
            }
            else if (this.elementsList[i].scaleContentMax && (this.elementsList[i].height > chunkSize)) {
                stdW = (this.elementsList[i].height / this.elementsList[i].scale.y)
                this.elementsList[i].scale.set(chunkSize / stdW)
            }

            let vAlign = 0.5
            if (this.elementsList[i].vAlign != undefined) {
                vAlign = this.elementsList[i].vAlign;
            }

            let nextY = nextX + chunkSize * vAlign - this.elementsList[i].height * vAlign
            this.elementsList[i].y = nextY;
            // pixig.x = nextX

            let align = 0.5
            if (this.elementsList[i].align != undefined) {
                align = this.elementsList[i].align;
            }

            this.elementsList[i].x = this.elementsList[i].width * align;

            //this.elementsList[i].x = this.w * anchorX// - this.elementsList[i].width * anchorX
        }

    }
}