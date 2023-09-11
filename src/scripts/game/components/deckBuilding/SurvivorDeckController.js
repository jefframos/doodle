import BaseButton from "../ui/BaseButton";
import CardInfo from "./CardInfo";
import CardPlacementSystem from "./CardPlacementSystem";
import CardView from "./CardView";
import EntityBuilder from "../../screen/EntityBuilder";
import EntityData from "../../data/EntityData";
import Game from "../../../Game";
import GameObject from "../../core/gameObject/GameObject";
import GameStaticData from "../../data/GameStaticData";
import GameView from "../../core/view/GameView";
import GameplayItem from "../../data/GameplayItem";
import GridInfoView from "./GridInfoView";
import GridSlotView from "./grid/GridSlotView";
import GridView from "./grid/GridView";
import InputModule from "../../core/modules/InputModule";
import InteractableView from "../../view/card/InteractableView";
import Player from "../../entity/Player";
import RenderModule from "../../core/modules/RenderModule";
import RewardsManager from "../../data/RewardsManager";
import SpriteButton from "../ui/SpriteButton";
import UIList from "../../ui/uiElements/UIList";
import UIUtils from "../../utils/UIUtils";
import Utils from "../../core/utils/Utils";
import conversionUtils from "../../../conversionUtils";
import signals from "signals";

export default class SurvivorDeckController extends GameObject {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.UILayerOverlay;
        this.gameView.view = new PIXI.Container();


        this.backShape = new PIXI.Graphics().beginFill(0xffffff).drawRect(0, 0, 10000, 10000)
        this.gameView.view.addChild(this.backShape)
        this.backShape.tint = 0
        this.backShape.alpha = 0.9
        this.onConfirmLoudout = new signals.Signal();
        this.onReshuffle = new signals.Signal();

        this.blocker = new PIXI.Sprite.from('base-gradient');
        this.blocker.width = 1000
        this.blocker.height = 1000
        this.blocker.interactive = true;
        this.blocker.tint = 0;
        this.blocker.alpha = 1;
        this.gameView.view.addChildAt(this.blocker);

        this.gridContainer = new PIXI.Container();
        this.cardsContainer = new PIXI.Container();
        this.cardsContainer.sortableChildren = true;
        this.transitionContainer = new PIXI.Container();

        this.gameView.view.addChild(this.gridContainer)
        this.gameView.view.addChild(this.cardsContainer)
        this.gameView.view.addChild(this.transitionContainer)

        this.uiButtons = new UIList();
        this.uiButtons.w = 480
        this.uiButtons.h = 80

        this.pickAll = UIUtils.getPrimaryVideoButton(() => {
            RewardsManager.instance.doReward(() => {
                this.pickAllCards()
            })
        })
        this.uiButtons.addElement(this.pickAll)

        this.pickAll.resize(220, 80)
        this.pickAll.updateBackTexture(UIUtils.baseButtonTexture + '_0005')
        this.pickAll.priceLabel.text = "Pick\nAll"
        this.pickAll.buttonListContent.w = 220
        this.pickAll.buttonListContent.h = 60
        this.pickAll.buttonListContent.updateHorizontalList()
        this.pickAll.buttonListContent.x = 260 / 2 - this.pickAll.buttonListContent.w / 2
        this.pickAll.buttonListContent.y = 80 / 2 - this.pickAll.buttonListContent.h / 2

        this.reshuffle = UIUtils.getPrimaryVideoButton(() => {
            RewardsManager.instance.doReward(() => {
                this.reshuffleDeck()
            })
        }, "Reshuffle")

        this.reshuffle.resize(220, 80)
        this.reshuffle.updateBackTexture(UIUtils.baseButtonTexture + '_0002')
        this.reshuffle.priceLabel.text = "Reshuffle"
        this.reshuffle.buttonListContent.w = 220
        this.reshuffle.buttonListContent.h = 60
        this.reshuffle.buttonListContent.updateHorizontalList()
        this.reshuffle.buttonListContent.x = 260 / 2 - this.reshuffle.buttonListContent.w / 2
        this.reshuffle.buttonListContent.y = 80 / 2 - this.reshuffle.buttonListContent.h / 2


        this.uiButtons.addElement(this.reshuffle)


        this.gameView.view.addChild(this.uiButtons)

        this.handCards = [];

        this.highlightedCard = null;

        this.cardWidth = 170
        this.cardHeight = 450
        this.cardDistance = 190
        this.cardContainerMaxWidth = 720

        this.state = 0;
    }
    pickAllCards() {
        //this.handCards

        this.handCards.forEach(element => {
            this.holdingData = element.cardData
            this.pickCard(element);
        });

        RewardsManager.instance.gameplayStart();

    }
    reshuffleDeck() {
        this.onReshuffle.dispatch();
    }
    start() {
        super.start();
        this.input = this.engine.findByType(InputModule)
        this.highlightedCard = null;
    }
    setPlayer(player) {
        this.player = player
        this.player.sessionData.equipmentUpdated.add(this.rebuildWeaponGrid.bind(this))
        this.rebuildWeaponGrid(this.player.sessionData.equipmentList)
    }
    rebuildWeaponGrid(data) {

        //this.gridView.updateEquipment(data);
    }
    buildCards(data, totalCards = 3, pickAll, reshffleUses, pickedCards) {

        SOUND_MANAGER.play('getThemAll', 0.5)
        RewardsManager.instance.gameplayStop();
        for (let i = this.handCards.length - 1; i >= 0; i--) {
            if (this.handCards[i].parent) {
                this.handCards[i].parent.removeChild(this.handCards[i]);
            }

        }
        this.cardHolding = null;
        this.holdingData = null;

        if (Game.Debug.debug){
            totalCards = 5
        }

        totalCards = Math.min(data.length, totalCards)
        
        this.handCards = [];
        for (let i = 0; i < totalCards; i++) {
            let dt = null
            switch (data[i].entityData.type) {
                case EntityData.EntityDataType.Weapon:

                    dt = EntityBuilder.instance.getWeapon(data[i].weaponId)
                    break;
                case EntityData.EntityDataType.Companion:
                    dt = EntityBuilder.instance.getCompanion(data[i].companionId)

                    break;
                case EntityData.EntityDataType.Attribute:
                    dt = EntityBuilder.instance.getAttribute(data[i].attributeId)

                    break;
                case EntityData.EntityDataType.Acessory:
                    dt = EntityBuilder.instance.getAcessory(data[i].acessoryId)

                    break;
                case EntityData.EntityDataType.WeaponAttachment:
                    dt = EntityBuilder.instance.getWeapon(data[i].weaponId)
                    dt.setAsAttachment();
                    break;
                case EntityData.EntityDataType.Coins:
                    dt = EntityBuilder.instance.getAttribute(data[i].attributeId)
                    //dt.setAsAttachment();
                    break;
                case EntityData.EntityDataType.Heal:
                    dt = EntityBuilder.instance.getAttribute(data[i].attributeId)
                    // dt.setAsAttachment();
                    break;
            }


            let cardView = new CardView(UIUtils.baseButtonTexture + '_0006', this.cardWidth, this.cardHeight);
            this.cardsContainer.addChild(cardView);
            cardView.id = i;
            cardView.zIndex = i;
            cardView.onCardClicked.add((card) => {
                //this.onCardClicked.dispatch(card.cardData)
                //this.pickCard(card);
                //card.visible = false;
                //return
                if (this.state == 0) {
                    this.state = 1;
                    this.highlightCard(card)
                } else {
                    if (this.highlightedCard == card) {
                        this.state = 0;
                        this.returnHighlighted();
                    } else {
                        this.returnHighlighted();
                        this.highlightCard(card)
                    }
                }

            })
            cardView.onCardConfirmed.add((card) => {
                this.highlightCard(card)
                this.pickCard(card);
                RewardsManager.instance.gameplayStart();
            })
            this.handCards.push(cardView)

           // pickedCards.find(element => element > 10)
        
        let level = 0;
        
        if(dt && dt.entityData && pickedCards[dt.entityData.type]){
            if(pickedCards[dt.entityData.type][dt.id]){
                level = pickedCards[dt.entityData.type][dt.id]
            }
        }

            cardView.setData(dt, data[i], this.player, level);
            cardView.show(i)
        }

        this.cardsContainer.y = Game.Screen.height / 2
        this.cardsContainer.x = Game.Screen.width / 2
        //this.cardsContainer.addChild(UIUtils.getCircle());


        this.uiButtons.removeAllElements();
        this.pickAll.visible = pickAll < 0.2 || Game.Debug.debug
        this.reshuffle.visible = reshffleUses > 0 || Game.Debug.debug
        if (this.pickAll.visible) {
            this.uiButtons.addElement(this.pickAll)
        }
        if (this.reshuffle.visible) {
            this.uiButtons.addElement(this.reshuffle)
        }
        this.reshuffle.priceLabel.text = "Reshuffle\n(" + reshffleUses + ")"
        this.reshuffle.buttonListContent.updateHorizontalList()
        this.uiButtons.updateHorizontalList()

        TweenLite.killTweensOf(this.uiButtons)
        this.uiButtons.alpha = 0
        this.uiButtons.visible = false;
        TweenLite.to(this.uiButtons, 0.3, { delay: 0.8, alpha: 1, onStart: () => { this.uiButtons.visible = true; } })

    }
    pickCard(card) {
        //this.player.sessionData.addEquipment
        
        if (CardPlacementSystem.isSpecialType(card.cardData.entityData.type)) {
            this.destroyHighlighted();
            this.onConfirmLoudout.dispatch(card.cardData)
            return;
        }

        let weaponData = EntityBuilder.instance.weaponsData[this.holdingData.id]

        let data = weaponData
        if (weaponData) {
            this.player.sessionData.addEquipmentNEW(weaponData);
        } else {
            data = this.holdingData.clone()
            this.player.sessionData.addEquipmentNEW(this.holdingData.clone());
        }

        this.state = 0;
        this.destroyHighlighted();

        this.onConfirmLoudout.dispatch(data)

    }
    highlightCard(card) {
        this.highlightedCard = card;
        this.holdingData = card.cardData
        this.highlightedCard.highlight();
        this.transitionContainer.addChild(card)
        this.handCards = this.handCards.filter(item => item !== card);
    }
    returnHighlighted() {
        this.highlightedCard.unhighlight();
        this.highlightedCard.zIndex = this.highlightedCard.id
        this.handCards.splice(this.highlightedCard.id, 0, this.highlightedCard);
        this.holdingData = null
        this.cardsContainer.addChild(this.highlightedCard)
        this.highlightedCard = null;

    }
    destroyHighlighted() {
        if (!this.highlightedCard || !this.highlightedCard.parent) {
            return;
        }
        this.highlightedCard.parent.removeChild(this.highlightedCard)
        this.holdingData = null
        this.highlightedCard = null;
    }
    update(delta, unscaleDelta) {

        if (this.highlightedCard != null) {
            this.highlightedCard.update(delta)
        }
        if (this.handCards.length) {
            let arc = 1
            let rotChunk = arc / this.handCards.length

            const dist = Math.min(this.cardDistance * this.handCards.length, this.cardContainerMaxWidth) / this.handCards.length;
            for (let index = this.handCards.length - 1; index >= 0; index--) {
                const element = this.handCards[index];
                element.update(unscaleDelta)
                let rot = (rotChunk * index) - (arc / 2) + rotChunk / 2
                //element.rotation = Utils.angleLerp(element.rotation, rot, 0.5)

                let extraH = 200;
                // if (this.state == 1) {
                //     extraH = 250;
                // }

                element.y = Utils.lerp(element.y, element.baseHeight / 2, 0.25)
                //element.y = Utils.lerp(element.y, Math.cos(rot) * -this.cardContainerMaxWidth + this.cardContainerMaxWidth + extraH, 0.25)
                element.x = Utils.lerp(element.x, dist * index - (dist * this.handCards.length / 2 - dist * 0.5), 0.5)
            }

        }

        if (this.state == 1) {
            this.highlightedCard.x = Utils.lerp(this.highlightedCard.x, 0, 0.5)
            this.highlightedCard.y = Utils.lerp(this.highlightedCard.y, 0, 0.5)
            this.highlightedCard.rotation = Utils.angleLerp(this.highlightedCard.rotation, 0, 0.5)

        }

        this.cardsContainer.x = Game.Borders.width * 0.5
        this.cardsContainer.y = Game.Borders.height * 0.5 - 50
        this.transitionContainer.x = this.cardsContainer.x;
        this.transitionContainer.y = this.cardsContainer.y;



        this.backShape.alpha = Utils.lerp(this.backShape.alpha, 0.9, 0.1)

        this.blocker.width = Game.Borders.width;
        this.blocker.height = Game.Borders.height;

        this.backShape.width = Game.Borders.width;
        this.backShape.height = Game.Borders.height;


        this.uiButtons.x = Game.Borders.width / 2 - this.uiButtons.w / 2
        this.uiButtons.y = Game.Borders.height - this.uiButtons.height - 40

        if (Game.IsPortrait) {
            this.uiButtons.y -= 80
        }

    }
    aspectChange(isPortrait) {
        // if (isPortrait) {
        //     this.cardsContainer.scale.set(1.5)
        //     this.transitionContainer.scale.set(1.5)
        // } else {
        //     this.cardsContainer.scale.set(1.25)
        //     this.transitionContainer.scale.set(1.25)
        // }
    }
    resize() {

        this.cardsContainer.x = Game.Borders.width * 0.5
    }

    disable() {
        super.disable();
        this.gameView.view.visible = false;
    }

    enable() {
        super.enable();
        this.backShape.alpha = 0;
        this.gameView.view.visible = true;
        this.uiButtons.updateHorizontalList()
    }
}