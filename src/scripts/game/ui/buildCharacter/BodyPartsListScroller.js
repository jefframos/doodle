import * as PIXI from 'pixi.js';

import ListScroller from '../../ui/uiElements/ListScroller';
import Pool from '../../core/utils/Pool';
import Signals from 'signals';
import UIUtils from '../../utils/UIUtils';

export default class BodyPartsListScroller extends ListScroller {
    constructor(rect = { w: 250, h: 500 }, slotSize = { width: 75, height: 75 }, margin = { x: 0, y: 0 }) {
        super(rect, slotSize, margin);
        this.gridDimensions = { i: 5, j: 3 }
        this.onItemShop = new Signals();
        this.onShowInfo = new Signals();
        this.onVideoItemShop = new Signals();
        this.onShowBlock = new Signals();
        this.margin = margin;
        this.itens = [];
        this.calcSize(slotSize);
        this.title = UIUtils.getPrimaryLabel();
        this.addChild(this.title)
        this.title.style.fill = 0xFFFFFF
        this.title.x = - 25
        this.title.y = - 35
        
        //this.title.y= -50
    }

    addBaseGradient(texture, width, color = 0x312d2d) {
        this.extraHeight = 30
        this.baseGradient = new PIXI.Sprite.from(texture);
        this.baseGradient.tint = color;
        this.baseGradient.width = width;
        this.baseGradient.height = this.extraHeight;
        this.baseGradient.anchor.set(0, 1);
        this.baseGradient.y = this.rect.h + 2
        this.addChild(this.baseGradient)
    }
    resize(rect = { w: 250, h: 500 }, slotSize = { width: 75, height: 75 }, margin = { x: 0, y: 0 }) {
        super.resize(rect, slotSize, margin)

        if( this.baseGradient){
            this.baseGradient.width = rect.w
            this.baseGradient.y = this.rect.h + 2
        }
    }
    setTitle(label) {
        this.title.text = label;
        this.title.x = 5
    }
    addItens(itens) {
        let line = 0;
        let col = 0;

        while(this.listContainer.children.length > 0){
            this.listContainer.removeChildAt(0)
        }

        for (var i = 0; i < itens.length; i++) {
            let tempItem = itens[i];
            
            tempItem.x = this.itemWidth * col + this.margin.x;
            tempItem.y = this.itemHeight * line + this.margin.y;
                        
            col++
            this.totalLines = line + 1
            if (col >= this.gridDimensions.j) {
                line++;
            }
            col %= this.gridDimensions.j;
            
            if (tempItem.onConfirmShop) {
                tempItem.onConfirmShop.add(this.onShopItemCallback.bind(this));
            }
            this.itens.push(tempItem);
            this.listContainer.addChild(tempItem)

        }
        this.lastItemClicked = this.itens[0]
    }
    removeAllItems() {
        this.resetPosition();

        while (this.itens.length) {
            if (this.itens[0].parent) {
                this.itens[0].parent.removeChild(this.itens[0]);
                Pool.instance.returnElement(this.itens[0])
            }
            this.itens.shift();
        }
        this.totalLines = 0;
        //this.title.text = '';
    }
    onShowBlockCallback(itemData, button) {
        this.onShowBlock.dispatch(itemData, button);
    }
    onShowInfoCallback(itemData, button) {
        this.onShowInfo.dispatch(itemData, button);
    }
    onShopItemCallback(itemData, realCost, button, totalUpgrades) {

        itemData.upgrade(totalUpgrades)
        this.onItemShop.dispatch(itemData, button, totalUpgrades);
        this.updateItems();
    }
    hide() {
        for (var i = 0; i < this.itens.length; i++) {
            if (this.itens[i].hide) {
                this.itens[i].hide()
            }
        }
    }
    show() {
        for (var i = 0; i < this.itens.length; i++) {
            if (this.itens[i].show) {
                this.itens[i].show()
            }
        }
    }
    updateItems() {
        for (var i = 0; i < this.itens.length; i++) {
            this.itens[i].updateData()
        }
    }
    update(delta) {


    }
    updateAllItens() {
        // for (var i = 0; i < this.catsItemList.length; i++)
        // {
        //     this.catsItemList[i].updateItem(GAME_DATA.catsData[i])
        // }
    }

}