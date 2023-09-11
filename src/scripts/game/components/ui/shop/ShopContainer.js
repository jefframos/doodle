import * as PIXI from 'pixi.js';

import Game from '../../../../Game';
import GameData from '../../../data/GameData';
import GameStaticData from '../../../data/GameStaticData';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import RewardsManager from '../../../data/RewardsManager';
import ShopCard from './ShopCard';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import ViewDatabase from '../../../data/ViewDatabase';
import TimedAction from '../../../data/TimedAction';
import ListScroller from '../../../ui/uiElements/ListScroller';
import EntityBuilder from '../../../screen/EntityBuilder';
import RandomGenerator from '../../../core/utils/RandomGenerator';

export default class ShopContainer extends MainScreenModal {
    constructor() {
        super();

        this.shopList = GameStaticData.instance.getAllDataFrom('database', 'economy')[0].items
        this.topBlocker = new PIXI.Sprite.from('base-gradient');
        //this.topBlocker = new PIXI.Sprite.from('square_button_0001');
        this.topBlocker.tint = 0x13202F;
        // this.topBlocker.scale.y = -1
        this.addChildAt(this.topBlocker, 0);

        this.scroller = new ListScroller({ w: 500, h: 500 }, { width: 75, height: 75 }, { x: 0, y: 0 })
        this.scroller.itemHeight = 500
        this.shopButtonsContainer = new PIXI.Container();

        this.container.addChild(this.scroller)


        this.chest1 = new ShopCard(this.chest1Click.bind(this), this.chest1VideoClick.bind(this), UIUtils.baseButtonTexture + '_0001', 250, 250, this.shopList[0].title, this.shopList[0].video)
        this.chest1.updateButtonTitle(this.shopList[0].totalItems + 'x\n' + this.shopList[0].description)
        this.chest1.setIcon('item-chest-0001')
        this.chest1.setValue(this.getCurrency(this.shopList[0].currency), 'x' + this.shopList[0].price)

        this.chest2 = new ShopCard(this.chest2Click.bind(this), this.chest2VideoClick.bind(this), UIUtils.baseButtonTexture + '_0003', 250, 250, this.shopList[1].title, this.shopList[1].video)
        this.chest2.updateButtonTitle(this.shopList[1].totalItems + 'x\n' + this.shopList[1].description)
        this.chest2.setIcon('item-chest-0002')
        this.chest2.setValue(this.getCurrency(this.shopList[1].currency), 'x' + this.shopList[1].price)

        // this.chest3 = new ShopCard(UIUtils.baseButtonTexture + '_0001', 250, 250)
        this.topLine = new UIList();
        this.shopButtonsContainer.addChild(this.topLine)

        this.topLine.addElement(this.chest1);
        this.topLine.addElement(this.chest2);
        // this.topLine.addElement(this.chest3);

        this.topButtons = [];
        this.topButtons.push(this.chest1);
        this.topButtons.push(this.chest2);
        // this.topButtons.push(this.chest3);


        this.chestMid1 = new ShopCard(this.chestMid1Click.bind(this), this.chestMid1VideoClick.bind(this), UIUtils.baseButtonTexture + '_0002', 250, 250, this.shopList[2].title, this.shopList[2].video)
        this.chestMid1.updateButtonTitle(this.shopList[2].totalItems + 'x\n' + this.shopList[2].description)
        this.chestMid1.setIcon('item-chest-0001')
        this.chestMid1.setValue(this.getCurrency(this.shopList[2].currency), 'x' + this.shopList[2].price)
        this.chestMid2 = new ShopCard(this.chestMid2Click.bind(this), this.chestMid2VideoClick.bind(this), UIUtils.baseButtonTexture + '_0003', 250, 250, this.shopList[3].title, this.shopList[3].video)
        this.chestMid2.updateButtonTitle(this.shopList[3].totalItems + 'x\n' + this.shopList[3].description)
        this.chestMid2.setIcon('item-chest-0002')
        this.chestMid2.setValue(this.getCurrency(this.shopList[3].currency), 'x' + this.shopList[3].price)
        this.midLine = new UIList();
        this.shopButtonsContainer.addChild(this.midLine)

        this.midLine.addElement(this.chestMid1);
        this.midLine.addElement(this.chestMid2);

        this.midButtons = [];
        this.midButtons.push(this.chestMid1);
        this.midButtons.push(this.chestMid2);




        this.dailyItem1 = new ShopCard(this.chestMid1Click.bind(this), () => { this.openDaily(0) }, UIUtils.baseButtonTexture + '_0006', 250, 250, '', true)
        this.dailyItem2 = new ShopCard(this.chestMid1Click.bind(this), () => { this.openDaily(1) }, UIUtils.baseButtonTexture + '_0006', 250, 250, '', true)
        this.dailyItem3 = new ShopCard(this.chestMid1Click.bind(this), () => { this.openDaily(2) }, UIUtils.baseButtonTexture + '_0006', 250, 250, '', true)


        this.dailyItem4 = new ShopCard(this.chestMid1Click.bind(this), () => { this.openDaily(3) }, UIUtils.baseButtonTexture + '_0006', 250, 250, '', true)
        this.dailyItem5 = new ShopCard(this.chestMid1Click.bind(this), () => { this.openDaily(4) }, UIUtils.baseButtonTexture + '_0006', 250, 250, '', true)
        this.dailyItem6 = new ShopCard(this.chestMid1Click.bind(this), () => { this.openDaily(5) }, UIUtils.baseButtonTexture + '_0006', 250, 250, '', true)


        this.midDailyLine = new UIList();
        this.shopButtonsContainer.addChild(this.midDailyLine)

        this.midDailyLine.addElement(this.dailyItem1);
        this.midDailyLine.addElement(this.dailyItem2);
        this.midDailyLine.addElement(this.dailyItem3);

        this.midDailyLine2 = new UIList();
        this.shopButtonsContainer.addChild(this.midDailyLine2)

        this.midDailyLine2.addElement(this.dailyItem4);
        this.midDailyLine2.addElement(this.dailyItem5);
        this.midDailyLine2.addElement(this.dailyItem6);

        this.dailyButtonsView = [];
        this.dailyButtonsView.push(this.dailyItem1);
        this.dailyButtonsView.push(this.dailyItem2);
        this.dailyButtonsView.push(this.dailyItem3);
        this.dailyButtonsView2 = [];
        this.dailyButtonsView2.push(this.dailyItem4);
        this.dailyButtonsView2.push(this.dailyItem5);
        this.dailyButtonsView2.push(this.dailyItem6);

        this.dailyButtonsData = [];
        this.dailyButtonsView.forEach(element => {
            this.dailyButtonsData.push(element)
        });
        this.dailyButtonsView2.forEach(element => {
            this.dailyButtonsData.push(element)
        });

        const date = new Date();
        this.dayId = date.getDay() * date.getMonth() / (15 * 6)
        this.dayId %= 1
        this.dayId = Math.min(1, this.dayId)
        this.dayId = Math.max(0, this.dayId)

        this.types = [
            PrizeManager.PrizeType.Companion,
            PrizeManager.PrizeType.Shoe,
            PrizeManager.PrizeType.Trinket,
            PrizeManager.PrizeType.Weapon
        ]


        this.rnd = new RandomGenerator(this.dayId)
        this.dailiesRando = [];
        this.dailiesPrize = [];
        for (let index = 1; index <= this.dailyButtonsData.length; index++) {
            let rando = this.rnd.random();

            this.dailiesRando.push(rando)

            let type = this.types[Math.floor(rando * index * index) % this.types.length];
            let itemDataId = PrizeManager.instance.getItemPrizeShop(type, rando, 0)

            this.dailiesPrize.push(itemDataId)

            let itemData = this.getCardEntity(type, itemDataId)
            this.dailyButtonsData[index - 1].removeDescription()
            this.dailyButtonsData[index - 1].setIcon(itemData.texture, 150)
            this.dailyButtonsData[index - 1].updateButtonTitle('-')
        }

        this.chestBottom1 = new ShopCard(this.bundleClick.bind(this), this.bundleVideoClick.bind(this), UIUtils.baseButtonTexture + '_0004', 250, 250, this.shopList[4].title, this.shopList[4].video)
        this.chestBottom1.setIcon('bundle-icon', 0.5)
        this.chestBottom1.updateButtonTitle(this.shopList[4].totalItems + 'x\n' + this.shopList[4].description)
        this.chestBottom1.setValue(this.getCurrency(this.shopList[4].currency), 'x' + this.shopList[4].price)

        this.chestBottom2 = new ShopCard(this.bundle2Click.bind(this), this.bundleVideoClick.bind(this), UIUtils.baseButtonTexture + '_0004', 250, 250, this.shopList[5].title, this.shopList[5].video)
        this.chestBottom2.setIcon('bundle-icon', 0.5)
        this.chestBottom2.updateButtonTitle(this.shopList[5].totalItems + 'x\n' + this.shopList[5].description)
        this.chestBottom2.setValue(this.getCurrency(this.shopList[5].currency), 'x' + this.shopList[5].price)

        this.bottomLine = new UIList();
        this.shopButtonsContainer.addChild(this.bottomLine)

        this.bottomLine.addElement(this.chestBottom1);
        this.bottomLine.addElement(this.chestBottom2);

        this.bottomButtons = [];
        this.bottomButtons.push(this.chestBottom1);
        this.bottomButtons.push(this.chestBottom2);

        this.titleBox = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0006'), 20, 20, 20, 20);
        this.container.addChild(this.titleBox);
        this.titleBox.width = 250
        this.titleBox.height = 80

        this.titleBox.y = -60
        this.titleLabel = UIUtils.getSecondaryLabel('Shop', { fontSize: 48 })
        this.titleLabel.anchor.set(0.5)
        this.titleLabel.x = this.titleBox.width / 2
        this.titleLabel.y = this.titleBox.height / 2
        this.titleBox.addChild(this.titleLabel)


        this.timedButtons = [];
        this.topShop1Timed = new TimedAction("SHOP_1", 300, this.chest1.videoButton.priceLabel, 'OPEN')
        this.topShop2Timed = new TimedAction("SHOP_2", 300, this.chest2.videoButton.priceLabel, 'OPEN')

        this.timedButtons.push(this.topShop1Timed)
        this.timedButtons.push(this.topShop2Timed)

        this.newItemEveryday = UIUtils.getSpecialLabel2('New Items Everyday!', { strokeThickness: 1, fontSize: 32, wordWrapWidth: 500 });
        this.shopButtonsContainer.addChild(this.newItemEveryday)


        this.scroller.addItens([this.shopButtonsContainer])

        this.collectedMessage = "Collected!\n";


    }
    getCardEntity(type, value) {
        let entityData = null;
        let texture = '';

        switch (type) {
            case PrizeManager.PrizeType.Companion:
                entityData = EntityBuilder.instance.getCompanion(value.id)
                texture = entityData.entityData.icon
                break;
            case PrizeManager.PrizeType.Shoe:
                entityData = EntityBuilder.instance.getShoe(value.id)
                texture = entityData.entityData.icon
                break;
            case PrizeManager.PrizeType.Trinket:
                entityData = EntityBuilder.instance.getTrinket(value.id)
                texture = entityData.entityData.icon
                break;
            case PrizeManager.PrizeType.Weapon:
                entityData = EntityBuilder.instance.getWeapon(value.id)
                texture = entityData.entityData.icon
                break;
        }
        let cardData = { texture, entityData }
        return cardData;
    }
    update(delta) {

        this.date = new Date();
        this.timedButtons.forEach(element => {
            element.updateTime(this.date.getTime())
        });
    }
    resetAllButtons() {
        this.topButtons.forEach(element => {
            element.restore()
        });
        this.midButtons.forEach(element => {
            element.restore()
        });
        this.dailyButtonsView.forEach(element => {
            element.restore()
        });
        this.bottomButtons.forEach(element => {
            element.restore()
        });
    }
    getCurrency(value) {
        if (value == 1) {
            return 'softCurrency'
        } else if (value == 2) {
            return 'hardCurrency'
        } else if (value == 3) {
            return 'specialCurrency'
        }
    }
    canBuy(data) {
        if (data.currency == 1) {
            if (GameData.instance.softCurrency >= data.price) {
                return true;
            }
        } else if (data.currency == 2) {
            if (GameData.instance.hardCurrency >= data.price) {
                return true;
            }
        } else if (data.currency == 3) {
            if (GameData.instance.specialCurrency >= data.price) {
                return true;
            }
        }
    }
    buy(data) {
        if (data.currency == 1) {
            GameData.instance.addSoftCurrency(-data.price)
        } else if (data.currency == 2) {
            GameData.instance.addHardCurrency(-data.price)
        } else if (data.currency == 3) {
            GameData.instance.addSpecialCurrency(-data.price)
        }
    }
    chest1Click(force) {
        const shopData = this.shopList[0];
        if (this.canBuy(shopData) || force) {
            PrizeManager.instance.getMetaPrize([0, 2, 3, 6], 1, shopData.totalItems);
            if (force) {
                return;
            }
            this.buy(shopData)
        } else {
            this.notEnoughMoney(shopData)
        }
    }
    openDaily(id) {
        if (!GameData.instance.dailyAvailable(id)) {
            RewardsManager.instance.doReward(() => {
                PrizeManager.instance.customPrize(this.dailiesPrize[id])
                GameData.instance.getDaily(id)

                this.dailyButtonsData[id].disableWithMessage(this.collectedMessage)
            })
        }
    }


    chest1VideoClick() {
        if (!this.topShop1Timed.canUse) {
            return;
        }
        RewardsManager.instance.doReward(() => {
            GameData.instance.openChest(this.topShop1Timed.id)
            this.chest1Click(true);
        })
    }
    chestMid1Click(force) {
        const shopData = this.shopList[2];
        if (this.canBuy(shopData) || force) {
            PrizeManager.instance.getMetaPrize([0], 2, shopData.totalItems);
            if (force) {
                return;
            }
            this.buy(shopData)
        } else {
            this.notEnoughMoney(shopData)
        }
    }
    chestMid1VideoClick() {
        RewardsManager.instance.doReward(() => {
            this.chest2Click(true);
        })
    }
    chest2Click(force) {
        console.log('chest2Click')
        const shopData = this.shopList[1];
        if (this.canBuy(shopData) || force) {
            PrizeManager.instance.getMetaPrize([1], 1, shopData.totalItems);
            if (force) {
                return;
            }
            this.buy(shopData)
        } else {
            this.notEnoughMoney(shopData)
        }
    }
    chest2VideoClick() {
        if (!this.topShop2Timed.canUse) {
            return;
        }
        RewardsManager.instance.doReward(() => {
            GameData.instance.openChest(this.topShop2Timed.id)
            this.chest2Click(true);
        })
    }
    chestMid2Click(force) {
        const shopData = this.shopList[3];
        if (this.canBuy(shopData) || force) {
            PrizeManager.instance.getMetaPrize([2, 3], 2, shopData.totalItems);
            if (force) {
                return;
            }
            this.buy(shopData)
        } else {
            this.notEnoughMoney(shopData)
        }
    }
    chestMid2VideoClick() {
        RewardsManager.instance.doReward(() => {
            this.chestMid2Click(true);
        })
    }
    bundle2Click(force) {
        const shopData = this.shopList[5];
        if (this.canBuy(shopData) || force) {
            PrizeManager.instance.getMetaPrize([0, 1, 2, 3, 6], 3, shopData.totalItems);
            if (force) {
                return;
            }
            this.buy(shopData)
        } else {
            this.notEnoughMoney(shopData)
        }
    }
    bundleClick(force) {
        const shopData = this.shopList[4];
        if (this.canBuy(shopData) || force) {
            PrizeManager.instance.getMetaPrize([0, 1, 2, 3, 6], 3, shopData.totalItems);
            if (force) {
                return;
            }
            this.buy(shopData)
        } else {
            this.notEnoughMoney(shopData)
        }
    }
    bundleVideoClick() {
        RewardsManager.instance.doReward(() => {
            this.bundleClick(true);
        })
    }
    notEnoughMoney(data) {
        data.texture = this.getCurrency(data.currency);
        GameData.instance.showCantBuy(data)
    }
    addBackgroundShape() {
        this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0002'), 20, 20, 20, 20);
        this.container.addChild(this.infoBackContainer);
    }
    show() {
        this.resize()
        super.show();


        for (let index = 0; index < this.dailyButtonsView.length; index++) {
            const element = this.dailyButtonsView[index];

            if (GameData.instance.dailyAvailable(index)) {
                this.dailyButtonsView[index].disableWithMessage(this.collectedMessage)
            }
        }

        if (!ViewDatabase.instance.canGetPiece()) {
            this.chestMid1.disableWithMessage('You Collected All Cosmestics')
        } else {
            this.chestMid1.enable()
        }
    }
    resize(res, newRes) {

        if (Game.IsPortrait) {
            this.infoBackContainer.width = Game.Borders.width - 80
            this.infoBackContainer.height = Game.Borders.height - 80
        } else {
            if (Game.Borders.width / Game.Borders.height < 1.5) {

                this.infoBackContainer.width = Game.Borders.width * 0.75
                this.infoBackContainer.height = Game.Borders.height - 80
            } else {

                this.infoBackContainer.width = Game.Borders.width * 0.5
                this.infoBackContainer.height = Game.Borders.height - 80
            }
        }

        this.infoBackContainer.height = Game.Borders.height - this.container.y + 20//- 40

        this.resizeLine(this.topLine, this.topButtons)
        this.resizeLine(this.midLine, this.midButtons)
        this.resizeLine(this.midDailyLine, this.dailyButtonsView)
        this.resizeLine(this.midDailyLine2, this.dailyButtonsView2)
        this.resizeLine(this.bottomLine, this.bottomButtons)

        this.scroller.resize({ w: this.infoBackContainer.width, h: this.infoBackContainer.height }, { w: this.shopButtonsContainer.width, h: this.shopButtonsContainer.height })
        this.scroller.itemHeight = this.shopButtonsContainer.height + 80

        this.topLine.x = 10
        this.topLine.y = 40

        this.midLine.x = this.topLine.x
        this.midLine.y = this.topLine.y + this.topLine.h + 10

        this.newItemEveryday.x = this.midLine.x + 15
        this.newItemEveryday.y = this.midLine.y + this.midLine.h + 10

        this.midDailyLine.x = this.midLine.x
        this.midDailyLine.y = this.newItemEveryday.y + this.newItemEveryday.height

        this.midDailyLine2.x = this.midDailyLine.x
        this.midDailyLine2.y = this.midDailyLine.y + this.midDailyLine.h + 10

        this.bottomLine.x = this.midDailyLine2.x
        this.bottomLine.y = this.midDailyLine2.y + this.midDailyLine2.h + 10


        this.titleBox.x = this.infoBackContainer.width / 2 - this.titleBox.width / 2

        this.topBlocker.width = Game.Borders.width
        this.topBlocker.height = Game.Borders.height

        this.recenterContainer()
    }
    recenterContainer() {
        this.container.pivot.x = this.container.width / 2
        this.container.x = Game.Borders.width / 2

        this.container.pivot.y = 0//this.container.height / 2
        this.container.y = 150

    }
    resizeLine(list, buttons) {
        list.w = this.infoBackContainer.width - 20
        if (Game.IsPortrait) {

            list.h = 200//(this.infoBackContainer.height - 80) / 3
        } else {

            list.h = 150//(this.infoBackContainer.height - 80) / 3
        }
        list.updateHorizontalList()

        buttons.forEach(element => {
            element.resize(list.w / buttons.length - 20, list.h)
        });
    }
    aspectChange(isPortrait) {
        if (isPortrait) {
        } else {

        }
    }
}