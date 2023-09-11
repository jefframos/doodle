import CardView from "./CardView";
import EntityBuilder from "../../screen/EntityBuilder";
import EntityData from "../../data/EntityData";
import Game from "../../../Game";
import GameData from "../../data/GameData";
import GameObject from "../../core/gameObject/GameObject";
import GameStaticData from "../../data/GameStaticData";
import GameView from "../../core/view/GameView";
import InteractableView from "../../view/card/InteractableView";
import LevelManager from "../../manager/LevelManager";
import RenderModule from "../../core/modules/RenderModule";
import Utils from "../../core/utils/Utils";
import signals from "signals";

export default class CardPlacementSystem {
    constructor(deckView, cardPlacementView) {
        this.deckView = deckView;

        this.deckView.onConfirmLoudout.add(this.onCardEquipped.bind(this))
        this.deckView.onReshuffle.add(this.onReshuffle.bind(this))
        this.cardPlacementView = cardPlacementView;
        this.enabled = false;
        this.player = null;
        this.pickedCardsList = [];
        this.typesPickedCardsList = [];
        this.onHide = new signals.Signal();

    }
    static isSpecialType(type) {
        return type === EntityData.EntityDataType.Coins || type === EntityData.EntityDataType.Heal
    }
    static getSpecialCallback(type, value, player) {
        if (type === EntityData.EntityDataType.Coins) {
            GameData.instance.addSoftCurrency(value);
            LevelManager.instance.collectCoins(value);
        } else {
            player.cardHeal(value);
        }
    }
    build() {

    }
    onCardEquipped(cardData) {
        this.deckView.setActive(false)
        this.hide();

        if (cardData.entityData.type) {
            if (CardPlacementSystem.isSpecialType(cardData.entityData.type)) {
                CardPlacementSystem.getSpecialCallback(cardData.entityData.type, cardData.value, this.player)

                return;
            }
        }

        if (!this.pickedCardsList[cardData.entityData.type]) {
            this.pickedCardsList[cardData.entityData.type] = [];
        }

        if (this.pickedCardsList[cardData.entityData.type][cardData.id]) {
            this.pickedCardsList[cardData.entityData.type][cardData.id]++
        } else {

            this.pickedCardsList[cardData.entityData.type][cardData.id] = 1;
            if (!this.typesPickedCardsList[cardData.entityData.type]) {
                this.typesPickedCardsList[cardData.entityData.type] = 1
            } else {
                this.typesPickedCardsList[cardData.entityData.type]++
            }
        }
    }
    onReshuffle() {
        this.reshufleUses--;
        this.show()
    }
    setPlayer(player) {
        this.player = player;
        this.pickedCardsList = [];
        this.reshufleUses = 1;
        this.typesPickedCardsList['Weapon'] = 1;
        this.pickedCardsList['Weapon'] = {}
        this.pickedCardsList['Weapon'][this.player.sessionData.mainWeapon.id] = 1;
        this.deckView.setPlayer(this.player)
    }
    setWeapons(weapons) {
        this.weapons = weapons;

    }
    show(fromChest) {
        this.enabled = true;

        this.currentData = Utils.cloneArray(GameStaticData.instance.getAllCards());

        // console.log(this.currentData)



        this.currentData.push({
            id: this.player.sessionData.mainWeapon.id,
            entityData: {
                type: 'Weapon'
            },
            weaponId: this.player.sessionData.mainWeapon.id,
            starter: true
        })


        Utils.shuffle(this.currentData)
        let starters = [];

        // starters.push({
        //     id: this.player.sessionData.mainWeapon.id,
        //     entityData: {
        //         type: 'Weapon'
        //     },
        //     weaponId: this.player.sessionData.mainWeapon.id,
        //     starter: true
        // })

        // starters.push(GameStaticData.instance.getCardById('AMOUNT_MODIFIER'))
        //  starters.push(GameStaticData.instance.getCardById('DEFENSE_MODIFIER'))
        //  starters.push(GameStaticData.instance.getCardById('NUKE_CARD'))


        // starters.push(GameStaticData.instance.getCardById('COIN_CARD'))
        // starters.push(GameStaticData.instance.getCardById('BURN_RING'))
         //starters.push(GameStaticData.instance.getCardById('HEAL_CARD'))


        //         starters.push(GameStaticData.instance.getCardById('ITEM_HEAL_MODIFIER'))



        let maxOf = 5
        for (let index = this.currentData.length - 1; index >= 0; index--) {
            if (this.currentData[index].starter && this.currentData[index].entityData.type != EntityData.EntityDataType.Equipable) {
                const cardType = this.currentData[index].entityData.type
                let cardId = this.currentData[index].id
                if (cardType == 'Weapon') {
                    cardId = this.currentData[index].weaponId;
                } else if (cardType == 'Acessory') {
                    cardId = this.currentData[index].acessoryId;
                } else if (cardType == 'Attribute') {
                    cardId = this.currentData[index].attributeId;
                }
                //if there is 4 of the same card type
                if (this.typesPickedCardsList[cardType] >= maxOf) {
                    if (this.pickedCardsList[cardType] && this.pickedCardsList[cardType][cardId] && this.pickedCardsList[cardType][cardId] < 5) {
                        starters.push(this.currentData[index]);
                    }
                } else if (!this.pickedCardsList[cardType] || !this.pickedCardsList[cardType][cardId] || this.pickedCardsList[cardType][cardId] < 5) {
                    starters.push(this.currentData[index]);
                } else {
                }
            }
            if (this.currentData[index] && !this.currentData[index].enabled) {
                this.currentData.splice(index, 1);
            }
        }
        
        if (starters.length < 3) {
            while (starters.length < 3) {
                starters.push(Math.random() > 0.5 ? GameStaticData.instance.getCardById('COIN_CARD') : GameStaticData.instance.getCardById('HEAL_CARD'))
            }
        }

        let cards = Math.random() < 0.1 ? 4 : 3;
        if(fromChest){
            cards = 4;
        }
        console.log(starters)
        this.deckView.buildCards(starters, cards , Math.random(), this.reshufleUses, this.pickedCardsList)
        
        this.deckView.setActive(true)
        this.cardPlacementView.setActive(true)
    }
    hide() {
        this.enabled = false;

        this.deckView.setActive(false)
        this.cardPlacementView.setActive(false)

        this.onHide.dispatch();
    }
    update(delta, unscaleDelta) {
        this.gameView.view.x = Utils.lerp(this.gameView.view.x, -this.gameView.view.width / 2, 0.1);
    }
    disable() {
        super.disable();
        this.gameView.view.visible = false;
    }

    enable() {
        super.enable();
        this.gameView.view.visible = true;
    }
}