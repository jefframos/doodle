import * as PIXI from 'pixi.js';
import Signals from 'signals';
import ListScroller from '../uiElements/ListScroller';
import RecruitCharItem from './RecruitCharItem';
import StatContainer from './StatContainer';
import EquipContainer from './EquipContainer';
import StandardPanel1 from './StandardPanel1';
import UILabelButton1 from '../UILabelButton1';
import UIList from '../uiElements/UIList';
import { utils } from 'pixi.js/lib/core';
import gambitUtils from '../../entity/gambits/gambitUtils';

export default class CharacterSheetPanel extends StandardPanel1 {
    constructor(rect = {
        w: 500,
        h: 500
    }, itensPerPage = 4) {
        super(rect, itensPerPage, true);

        this.container = new PIXI.Container();

        this.background = PIXI.Sprite.from('panel-1');
        this.addChildAt(this.background, 0)

        this.background.scale.x = rect.w / this.background.width;
        this.background.scale.y = rect.h / this.background.height;

        this.onItemShop = new Signals();
        this.onShowInfo = new Signals();
        this.onRemoveFromParty = new Signals();
        this.onVideoItemShop = new Signals();
        // this.onShopItem = new Signals();

        this.items = [];

        // let chars = PARTY_DATA.getStaticCharsList()
        // for (var i = 0; i < chars.length; i++) {
        //     let recruitPanel = new RecruitCharItem({
        //         w: rect.w,
        //         h: rect.h / 4
        //     })
        //     let data = PARTY_DATA.getStaticCharData(chars[i]);
        //     recruitPanel.setId(data);
        //     this.items.push(recruitPanel)
        // }

        this.sheetContainer = new PIXI.Container();
        this.addChild(this.sheetContainer)

        this.topStatsList = new UIList();
        this.sheetContainer.addChild(this.topStatsList)

        this.classSpriteContainer = new PIXI.Container();
        this.topStatsList.addChild(this.classSpriteContainer);

        this.classSprite = PIXI.Sprite.from(PIXI.Texture.EMPTY);
        this.classSpriteContainer.addChild(this.classSprite)

        this.classSprite.anchor.x = 0.5
        // this.addItens(this.items)
        this.classLabel = new PIXI.Text('DELETE', window.LABELS.LABEL1)
        this.classSpriteContainer.addChild(this.classLabel)


        this.gambitsContainer = new PIXI.Container();
        this.sheetContainer.addChild(this.gambitsContainer);

        this.gambits = new PIXI.Text('', window.LABELS.LABEL1)
        this.gambits.style.align = 'left'
        this.gambitsContainer.addChild(this.gambits)
        this.gambitsContainer.x = 20
        this.gambitsContainer.y = 100
        this.gambitsContainer.scale.set(0.5)


        this.statsView = new StatContainer();
        this.topStatsList.addChild(this.statsView);
        this.onItemSelect = new Signals();


        this.topStatsList.w = rect.w
        this.topStatsList.h = 120
        this.classSpriteContainer.align = 0.5;
        this.classSpriteContainer.listScl = 0.4
        this.statsView.fitHeight = 0.5
        this.topStatsList.elementsList.push(this.classSpriteContainer);
        this.topStatsList.elementsList.push(this.statsView);
        this.topStatsList.updateHorizontalList();

        this.removeButton = new UILabelButton1(0xFF0000, 100, 30)
        this.removeButton.addCenterLabel('Remove')
        this.removeButton.onClick.add(() => {
            if(this.currentSlot){
                this.onRemoveFromParty.dispatch(this.currentSlot);
            }
            this.hide();
        })
        this.addChild(this.removeButton)

        
        
        this.removeButton.x = rect.w - this.removeButton.width  - 10
        this.removeButton.y = 100
        
        this.equipContainer = new EquipContainer();
        this.addChild(this.equipContainer)
        this.equipContainer.y = 200

        this.equipContainer.x = rect.w / 2 - this.equipContainer.width / 2;
    }

    show(characterData, slot = null) {
        this.currentSlot = slot;
        this.currentCharacterData = characterData;

        
        this.classLabel.text = this.currentCharacterData.label
        // this.classLabel.pivot.x = this.classLabel.width / 2
        this.classLabel.pivot.y = this.classLabel.height * 1.5
        this.classSprite.x = this.classLabel.width / 2
        
        this.statsView.showCharData(this.currentCharacterData)
        this.equipContainer.updateEquip(this.currentCharacterData);
        
        let gambits = gambitUtils.getGambitVerbose(characterData.gambits.default)
        this.gambits.text = '';
        gambits.forEach(element => {
            this.gambits.text += ('find '+element[0]+' with '+ element[1]+'\nthan use'+element[2]) +'\n\n'
        });

        this.classSprite.texture = PIXI.Texture.from(this.currentCharacterData.graphicsData.textures.front)
        this.visible = true;
        this.resetPosition()


        this.removeButton.visible = this.currentSlot != null
  
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