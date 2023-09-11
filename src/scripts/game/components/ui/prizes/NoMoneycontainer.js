import * as PIXI from 'pixi.js';

import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import GameData from '../../../data/GameData';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import RewardsManager from '../../../data/RewardsManager';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';

export default class NoMoneycontainer extends MainScreenModal {
    constructor() {
        super();


        this.addScreenBlocker();



        this.topBlocker = new PIXI.Sprite.from('base-gradient');
        //this.topBlocker = new PIXI.Sprite.from('square_button_0001');
        //this.topBlocker.tint = 0x851F88;
        this.topBlocker.tint = 0;
        this.topBlocker.scale.y = -1
        this.addChildAt(this.topBlocker, 0);


        this.blocker.alpha = 1;
        this.blocker.tint = 0;


        this.blackout = UIUtils.getRect(0, 100, 100)
        this.blackout.alpha = 0.8
        this.addChildAt(this.blackout, 0);



        this.buttons = new UIList()
        this.buttons.w = 380
        this.buttons.h = 80
        this.infoBackContainer.addChild(this.buttons);

        this.collectButton = UIUtils.getPrimaryLabelButton(() => {
            this.hide()
        }, 'Cancel')
        this.collectButton.updateBackTexture('square_button_0006')
        this.collectButton.resize(180, 80)
        this.buttons.addElement(this.collectButton);
        this.videoButton = UIUtils.getPrimaryVideoButton((button) => {
            this.videoCurrencyCallback();
        }, 'Free')
        this.videoButton.resize(180, 80)
        this.videoButton.updateBackTexture(UIUtils.baseButtonTexture + '_0002')

        this.videoButton.buttonListContent.w = 120
        this.videoButton.buttonListContent.h = 80
        this.videoButton.buttonListContent.updateHorizontalList()
        this.videoButton.buttonListContent.x = 180 / 2 - this.videoButton.buttonListContent.w / 2
        this.buttons.addElement(this.videoButton);


        this.congratulationsLabel = UIUtils.getSpecialLabel1('Collect your prize!', { fontSize: 32 })
        this.congratulationsLabel.anchor.set(0.5)

        this.infoBackContainer.addChild(this.congratulationsLabel)

        this.youHaveList = new UIList()
        this.youHaveList.w = 350
        this.youHaveList.h = 50

        this.currencyIcon = new PIXI.Sprite();
        this.youHaveLabel = UIUtils.getPrimaryLabel()

        this.youHaveList.addElement(this.youHaveLabel)
        this.youHaveList.addElement(this.currencyIcon, { align: 0.1, listScl: 0.2 })

        this.infoBackContainer.addChild(this.youHaveList)

        this.youNeed = new UIList()
        this.youNeed.w = 350
        this.youNeed.h = 50

        this.currencyIcon2 = new PIXI.Sprite();
        this.youNeedLabel = UIUtils.getPrimaryLabel()

        this.youNeed.addElement(this.youNeedLabel)
        this.youNeed.addElement(this.currencyIcon2, { align: 0.1, listScl: 0.2 })

        this.infoBackContainer.addChild(this.youNeed)

    }
    addBackgroundShape() {
        this.modalTexture = 'modal_blur';
        super.addBackgroundShape();

    }
    recenterContainer() {
        this.container.pivot.x = this.container.width / 2
        this.container.x = Game.Borders.width / 2

        this.container.pivot.y = this.container.height / 2
        this.container.y = Game.Borders.height / 2

    }
    videoCurrencyCallback() {
        RewardsManager.instance.doReward(() => {
            if (this.currentCurrency == 1) {
                GameData.instance.addSoftCurrency(500)
                this.hide();
            } else if (this.currentCurrency == 2) {
                GameData.instance.addHardCurrency(2)
                this.hide();
            }
        })
    }
    showInfo(data) {

        const targetCurrency = data.price;
        let currentCurrency = 0
        this.currentCurrency = -1
        if (data.currency == 1) {
            currentCurrency = GameData.instance.softCurrency
            this.currentCurrency = 1
            this.videoButton.priceLabel.text = 'free\n500x'
            this.videoButton.visible = true;
        } else if (data.currency == 2) {
            currentCurrency = GameData.instance.hardCurrency
            this.currentCurrency = 2
            this.videoButton.priceLabel.text = 'free\n2x'
            this.videoButton.visible = true;
        } else if (data.currency == 3) {
            currentCurrency = GameData.instance.specialCurrency
            this.videoButton.visible = false;
        }
        this.videoButton.buttonListContent.updateHorizontalList()
        this.youHaveLabel.text = 'you have ' + currentCurrency;
        this.currencyIcon.texture = PIXI.Texture.from(UIUtils.getIconUIIcon(data.texture));

        this.youNeedLabel.text = 'you need ' + targetCurrency;
        this.currencyIcon2.texture = PIXI.Texture.from(UIUtils.getIconUIIcon(data.texture));

        this.youHaveList.updateHorizontalList()
        this.youNeed.updateHorizontalList()

        this.congratulationsLabel.text = "You don't have enough currency"

        this.youHaveList.x = this.infoBackContainer.width / 2 - this.youHaveList.w / 2
        this.youHaveList.y = this.infoBackContainer.height / 2 - 50

        this.youNeed.x = this.infoBackContainer.width / 2 - this.youNeed.w / 2
        this.youNeed.y = this.youHaveList.y + 50

        this.buttons.updateHorizontalList()

        this.buttons.x = this.infoBackContainer.width / 2 - this.buttons.width / 2
        this.buttons.y = this.infoBackContainer.height - this.buttons.height - 50
    }
    resize(res, newRes) {
        if (this.infoBackContainer) {

            this.infoBackContainer.width = 550
            this.infoBackContainer.height = 500
        }

        this.contentContainer.x = 0
        this.contentContainer.y = 0

        this.blocker.width = Game.Borders.width
        this.blocker.height = Game.Borders.height

        this.blackout.width = Game.Borders.width
        this.blackout.height = Game.Borders.height

        this.topBlocker.width = Game.Borders.width
        this.topBlocker.height = Game.Borders.height
        this.topBlocker.scale.y = -1
        this.topBlocker.y = this.topBlocker.height

        this.congratulationsLabel.x = this.infoBackContainer.width / 2
        this.congratulationsLabel.y = 100


        this.recenterContainer();
    }

    update(delta) {
        if (!this.isOpen) {
            return;
        }
        super.update(delta)



    }
}