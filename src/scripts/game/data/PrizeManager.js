import CookieManager from "../CookieManager";
import EntityBuilder from "../screen/EntityBuilder";
import GameData from "./GameData";
import GameStaticData from "./GameStaticData";
import ViewDatabase from "./ViewDatabase";
import signals from "signals";

export default class PrizeManager {
    static PrizeType = {
        Coin: 'coin',
        Key: 'key',
        MasterKey: 'MasterKey',
        Shoe: 'shoes',
        Trinket: 'trinkets',
        Companion: 'companions',
        Weapon: 'weapons',
        Wearable: 'wearable',
        Equippable: 'equippable',
    }
    static _instance;
    static get instance() {
        if (!PrizeManager._instance) {
            PrizeManager._instance = new PrizeManager();
        }
        return PrizeManager._instance;
    }
    constructor() {
        this.onGetMetaPrize = new signals.Signal();
        this.onUpdateCompanion = new signals.Signal();

        this.prizePool = [
            [
                { type: PrizeManager.PrizeType.Coin, value: [20, 50] },
                { type: PrizeManager.PrizeType.Key, value: 1 },
                { type: PrizeManager.PrizeType.Wearable, value: 1 },
            ]
        ]
        this.prizeList = [];
        this.prizeList.push({
            icon: 'pistol1-icon',
            type: PrizeManager.PrizeType.Weapon,
        })
        this.prizeList.push({
            icon: 'pet-icon',
            type: PrizeManager.PrizeType.Companion
        })
        this.prizeList.push({
            icon: 'dynamic-shoe-icon0001',
            type: PrizeManager.PrizeType.Shoe
        })
        this.prizeList.push({
            icon: 'trinket-icon0001',
            type: PrizeManager.PrizeType.Trinket
        })
        this.prizeList.push({
            icon: 'money-bag',
            type: PrizeManager.PrizeType.Coin,
        })
        this.prizeList.push({
            icon: 'active_engine',
            type: PrizeManager.PrizeType.Key
        })
        this.prizeList.push({
            icon: 'head-0004',
            type: PrizeManager.PrizeType.Wearable,
        })


        this.cassinoList = [];
        this.cassinoList.push({
            icon: 'weapon-ticket',
            type: PrizeManager.PrizeType.Weapon,
        })
        this.cassinoList.push({
            icon: 'pet-ticket',
            type: PrizeManager.PrizeType.Companion
        })
        this.cassinoList.push({
            icon: 'shoe-ticket',
            type: PrizeManager.PrizeType.Shoe
        })
        this.cassinoList.push({
            icon: 'trinket-ticket',
            type: PrizeManager.PrizeType.Trinket
        })
        this.cassinoList.push({
            icon: 'money-ticket',
            type: PrizeManager.PrizeType.Coin,
        })

        this.mainPrizePool = [0, 1, 2, 3, 4, 6]
        this.mainPrizePoolNoWearable = [0, 1, 2, 3, 4]
    }
    get metaPrizeList() {
        return this.prizeList;
    }
    get cassinoPrizeList() {
        return this.cassinoList;
    }
    getMetaLowerPrize(amount) {
        amount++
        const coinValue = Math.round((30 + Math.random() * (30)) * (amount * amount * amount))
        GameData.instance.addSoftCurrency(coinValue)
        this.onGetMetaPrize.dispatch({ type: [PrizeManager.PrizeType.Coin], value: [coinValue] })
    }
    customPrize(prizeData){
        GameData.instance.addToInventory(prizeData.type, prizeData)
        this.onGetMetaPrize.dispatch({ type: [prizeData.type], value: [prizeData] })
    }
    getWearable() {
        const prize = this.getItemPrize(PrizeManager.PrizeType.Wearable)
        this.onGetMetaPrize.dispatch(prize)
    }
    getMetaPrize(prizeId, maxLevel, total = 1, dispatch = true) {

        const itemPrizeList = []

        let pool = this.mainPrizePool;

        const canCosmetic = ViewDatabase.instance.canGetPiece()
        if (!canCosmetic) {
            pool = this.mainPrizePoolNoWearable;

            //REMOVE WEARABLE FROM THE LIST
            prizeId = prizeId.filter(function (item) {
                return item !== 6
            })

        }
        for (let index = 0; index < total; index++) {
            let id = prizeId[Math.floor(Math.random() * prizeId.length)]
            if (id < 0) {
                id = pool[Math.floor(Math.random() * pool.length)];
            }
            itemPrizeList.push(this.getItemPrize(this.prizeList[id].type, maxLevel))
        }
        const types = [];
        itemPrizeList.forEach(element => {
            if (element.type == PrizeManager.PrizeType.Coin) {
                GameData.instance.addSoftCurrency(element.value)

            } else if (element.type == PrizeManager.PrizeType.Key) {
                GameData.instance.addHardCurrency(element.value)

            } else if (element.type == PrizeManager.PrizeType.MasterKey) {
                GameData.instance.addSpecialCurrency(element.value)

            } else if (element.type == PrizeManager.PrizeType.Wearable) {
                ViewDatabase.instance.saveWardrobePiece(element.value.area, element.value.id)
            }
            else {
                
                GameData.instance.addToInventory(element.type, element)
            }
            types.push(element.type)
        });

        
        const prizeData = { type: types, value: itemPrizeList }
        if (dispatch) {
            this.onGetMetaPrize.dispatch(prizeData)
        }
        return prizeData;
    }
    updateItem(type, item, level) {
        const prize = { id: item.id, level }
        GameData.instance.addToInventory(type, prize)
        this.onGetMetaPrize.dispatch({ type: [type], value: [prize] })
    }
    updateItems(types, items, levels) {

        const collectedPrize = []
        for (let index = 0; index < items.length; index++) {
            const element = items[index];

            const prize = { id: element.id, level: levels[index] }
            GameData.instance.addToInventory(types[index], prize)

            collectedPrize.push(prize)
        }
        this.onGetMetaPrize.dispatch({ type: types, value: collectedPrize })
    }


    getItemPrize(type, maxLevel) {
        let allEquip = [];

        switch (type) {
            case PrizeManager.PrizeType.Coin:
                return { type: PrizeManager.PrizeType.Coin, value: Math.round((150 + Math.random() * 5) * ((maxLevel + 1) * maxLevel)) }

            case PrizeManager.PrizeType.Key:
                if (maxLevel == 2) {
                    return { type: PrizeManager.PrizeType.Key, value: 1 }
                } else {
                    return { type: PrizeManager.PrizeType.MasterKey, value: 1 }
                }
                return;
            case PrizeManager.PrizeType.Shoe:
                allEquip = EntityBuilder.instance.getAllShoes();
                break;

            case PrizeManager.PrizeType.Companion:
                allEquip = EntityBuilder.instance.getAllCompanion();
                break;

            case PrizeManager.PrizeType.Trinket:
                allEquip = EntityBuilder.instance.getAllTrinket();
                break;

            case PrizeManager.PrizeType.Weapon:
                allEquip = EntityBuilder.instance.getAllStarterWeapon();
                break;
            case PrizeManager.PrizeType.Wearable:
                const wearable = ViewDatabase.instance.findAvailablePiece();
                if (wearable.area) {
                    return { type: PrizeManager.PrizeType.Wearable, value: wearable }
                }
                break;
        }

        const equipPrize = allEquip[Math.floor(Math.random() * allEquip.length)]
        const itemPrize = { id: equipPrize.id, level: Math.floor(maxLevel * Math.random()), type }
        return itemPrize;
    }

    getItemPrizeShop(type, rando, maxLevel) {
        let allEquip = [];

        switch (type) {
            case PrizeManager.PrizeType.Coin:
                return { type: PrizeManager.PrizeType.Coin, value: Math.round((150 + Math.random() * 5) * ((maxLevel + 1) * maxLevel)) }

            case PrizeManager.PrizeType.Key:
                if (maxLevel == 2) {
                    return { type: PrizeManager.PrizeType.Key, value: 1 }
                } else {
                    return { type: PrizeManager.PrizeType.MasterKey, value: 1 }
                }
                return;
            case PrizeManager.PrizeType.Shoe:
                allEquip = EntityBuilder.instance.getAllShoes();
                break;

            case PrizeManager.PrizeType.Companion:
                allEquip = EntityBuilder.instance.getAllCompanion();
                break;

            case PrizeManager.PrizeType.Trinket:
                allEquip = EntityBuilder.instance.getAllTrinket();
                break;

            case PrizeManager.PrizeType.Weapon:
                allEquip = EntityBuilder.instance.getAllStarterWeapon();
                break;
            case PrizeManager.PrizeType.Wearable:
                const wearable = ViewDatabase.instance.findAvailablePiece();
                if (wearable.area) {
                    return { type: PrizeManager.PrizeType.Wearable, value: wearable }
                }
                break;
        }

        const equipPrize = allEquip[Math.floor(rando * allEquip.length)]
        const itemPrize = { id: equipPrize.id, level: Math.floor(maxLevel * rando), type }
        return itemPrize;
    }
}