import * as PIXI from 'pixi.js';

import GameData from '../../../data/GameData';
import GameStaticData from '../../../data/GameStaticData';
import PrizeManager from '../../../data/PrizeManager';
import RewardsManager from '../../../data/RewardsManager';
import RouletteSlotView from './RouletteSlotView';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';
import signals from 'signals';
import TimedAction from '../../../data/TimedAction';

export default class RouletteView extends PIXI.Container {
    constructor(width = 800, height = 600) {
        super();

        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.onPrizeFound = new signals.Signal();

        this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('slot-machine-modal'), 120, 80, 120, 80);
        this.container.addChild(this.infoBackContainer);
        this.infoBackContainer.width = width
        this.infoBackContainer.height = height

        this.slotsContainer = new PIXI.Container();
        this.container.addChild(this.slotsContainer);


        this.spinVideoButton = UIUtils.getPrimaryLargeLabelButton(() => {
            if (this.freeSpinTimed.canUse) {
                GameData.instance.openChest(this.freeSpinTimed.id)
                RewardsManager.instance.doReward(() => {
                    this.spin(Math.random() + 0.65);
                })
            }
        }, 'Free', UIUtils.getIconUIIcon('video'))


        this.freeSpinTimed = new TimedAction("FREE_SPIN", 300, this.spinVideoButton.text, "FREE")

        this.spinVideoButton.updateBackTexture('square_button_0003')
        this.container.addChild(this.spinVideoButton);
        this.rollPrice = 200
        this.spinMoneyButton = UIUtils.getPrimaryLargeLabelButton(() => {
            if (GameData.instance.softCurrency >= this.rollPrice) {
                GameData.instance.addSoftCurrency(-this.rollPrice)
                this.spin(Math.random() + 0.65);
            }
        }, 'x' + this.rollPrice, UIUtils.getIconUIIcon('softCurrency'))
        this.spinMoneyButton.updateBackTexture('square_button_0002')
        this.container.addChild(this.spinMoneyButton);

        this.slots = [];

        this.rouletteState = []

        //PrizeManager
        

        this.prizeList = PrizeManager.instance.cassinoPrizeList;

        for (var i = 0; i < 3; i++) {
            let square = new RouletteSlotView(i)
            this.slotsContainer.addChild(square);
            square.x = i * 200
            square.addSlotImagesList(this.prizeList)
            square.onFinishSpin.add((slotId, prizeId) => {
                this.slotFinishSpin(slotId, prizeId)
            })
            this.slots.push(square);

            this.rouletteState.push({
                spinning: false,
                prizeId: -1
            })
        }

        this.slotsContainer.x = this.infoBackContainer.width / 2 - this.slotsContainer.width / 2;
        this.slotsContainer.y = this.infoBackContainer.height / 2 - this.slotsContainer.height / 2;

        this.spinVideoButton.x = this.infoBackContainer.width / 2 - this.spinVideoButton.width / 2 - 150;
        this.spinVideoButton.y = this.infoBackContainer.height / 2 - this.spinVideoButton.height / 2 + 220;

        this.spinMoneyButton.x = this.infoBackContainer.width / 2 - this.spinMoneyButton.width / 2 + 150;
        this.spinMoneyButton.y = this.infoBackContainer.height / 2 - this.spinMoneyButton.height / 2 + 220;



        this.currentData = Utils.cloneArray(GameStaticData.instance.getAllCards());

        Utils.shuffle(this.currentData)

        let starters = [];


        for (let index = this.currentData.length - 1; index >= 0; index--) {
            if (this.currentData[index].starter) {
                starters.push(this.currentData[index]);
            }
            if (this.currentData[index] && !this.currentData[index].enabled) {
                this.currentData.splice(index, 1);
            }
        }

        // this.prizeMarker = new PIXI.NineSlicePlane(PIXI.Texture.from('card-border'), 20, 20, 20, 20);
        // this.container.addChild(this.prizeMarker);
        // this.prizeMarker.width = 700
        // this.prizeMarker.x = this.infoBackContainer.width / 2 - this.prizeMarker.width / 2;
        // this.prizeMarker.y = this.infoBackContainer.height / 2 - this.prizeMarker.height / 2;



    }
    show() {
        this.spinVideoButton.visible = true;
        this.spinMoneyButton.visible = true;
        this.checkButtons()
    }
    calculatePrize() {
        let foundlings = [];
        for (let i = 0; i < 10; i++) {
            foundlings.push({ value: 0, id: i })
        }
        let match = 0
        for (var i = 0; i < this.rouletteState.length; i++) {
            foundlings[this.rouletteState[i].prizeId].value++;
            if (foundlings[this.rouletteState[i].prizeId].value > 1) {

                match++
            }
        }

        SOUND_MANAGER.stop('slot-machine')
        if (match <= 0) {

            this.onPrizeFound.dispatch(0, 0, match)
            SOUND_MANAGER.play('magic', 1)


        } else {

            let max = -999;
            let maxId = -1;
            foundlings.forEach(element => {
                if (max < element.value) {
                    max = element.value
                    maxId = element.id;
                }
            });
            this.onPrizeFound.dispatch(Math.max(1, match), maxId, max)
            SOUND_MANAGER.play('getThemAll', 1)

        }
    }
    slotFinishSpin(slotId, prizeId) {
        this.rouletteState[slotId].spinning = false;
        this.rouletteState[slotId].prizeId = prizeId;
        this.findEnd();
    }

    findEnd() {
        for (var i = 0; i < this.rouletteState.length; i++) {
            if (this.rouletteState[i].spinning) {
                return;
            }
        }
        this.calculatePrize();

        setTimeout(() => {
            this.spinVideoButton.visible = true;
            this.spinMoneyButton.visible = true;
            this.checkButtons()
        }, 2000);


    }
    spin(speed = 1, force = -1, avoid = []) {

        SOUND_MANAGER.play('slot-machine', 0.8)

        this.rouletteState.forEach(element => {
            element.spinning = true;
        });
        this.slots.forEach(element => {
            element.spin(speed, force, avoid);
        });

        this.spinVideoButton.visible = false;
        this.spinMoneyButton.visible = false;
    }
    checkButtons() {
        if (GameData.instance.softCurrency >= this.rollPrice) {
            this.spinMoneyButton.alpha = 1
        } else {
            this.spinMoneyButton.alpha = 0.5

        }
    }
    update(delta) {
        this.date = new Date();
        this.freeSpinTimed.updateTime(this.date.getTime())

        this.slots.forEach(element => {
            element.update(delta);
        });

    }
}