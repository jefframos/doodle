import * as PIXI from 'pixi.js';
import Signals from 'signals';
import ListScroller from '../uiElements/ListScroller';
import RecruitCharItem from './RecruitCharItem';
import StandardPanel1 from './StandardPanel1';

export default class RecruitCharPanel extends StandardPanel1 {
    constructor(rect = {
        w: 500,
        h: 500
    }, itensPerPage = 5) {
        super(rect, itensPerPage, true);
        
        this.container = new PIXI.Container();

        this.background = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.from('smallButton'), 10, 10, 10, 10)
        this.addChildAt(this.background, 0)

        this.background.width = rect.w ;
        this.background.height = rect.h;
        this.background.tint = 0;

        this.onItemShop = new Signals();
        this.onShowInfo = new Signals();
        this.onVideoItemShop = new Signals();
        // this.onShopItem = new Signals();

        this.items = [];

        let chars = PARTY_DATA.getStaticCharsList()
        for (var i = 0; i < chars.length; i++) {
            let recruitPanel = new RecruitCharItem({
                w: rect.w,
                h: rect.h / 5
            })
            let data = PARTY_DATA.getStaticCharData(chars[i]);
            recruitPanel.setId(data);
            this.items.push(recruitPanel)
        }


        this.addItens(this.items)

        this.onItemSelect = new Signals();

    }

    show() {
        this.visible = true;
        this.resetPosition()
    }

    hide() {
        this.visible = false;
    }
    addItens(itens) {
        for (var i = 0; i < itens.length; i++) {
            let tempItem = itens[i];
            this.listContainer.addChild(tempItem)
            tempItem.y = this.itemHeight * this.itens.length - 1;
            tempItem.onItemSelect.add(this.onItemSelectCallback.bind(this));
            tempItem.onShowInfo.add(this.onShowInfoCallback.bind(this));
            // if (tempItem.onConfirmShop) {
            //     tempItem.onConfirmShop.add(this.onShopItemCallback.bind(this));
            //     tempItem.onShowInfo.add(this.onShowInfoCallback.bind(this));
            // }
            this.itens.push(tempItem);

        }
        this.lastItemClicked = this.itens[0]
    }

    onItemSelectCallback(itemData) {
        this.endDrag();
        // console.log(itemData);
        this.onItemSelect.dispatch(itemData);
        this.hide();
    }
    onShowInfoCallback(itemData, button) {
        this.onShowInfo.dispatch(itemData, button);
    }
    onShopItemCallback(itemData, realCost, button) {
        // let staticData = GAME_DATA[itemData.staticData][itemData.id];
        // if (staticData.shopType == 'video')
        // {
        //     this.onVideoItemShop.dispatch(itemData);
        //     return
        // }
        this.endDrag();
        // GAME_DATA.buyUpgrade(itemData, realCost);
        this.onItemShop.dispatch(itemData, button);
        // this.updateItems();
    }
}