import CookieManager from "../CookieManager";
import EntityAttributes from "./EntityAttributes";
import EntityBuilder from "../screen/EntityBuilder";
import GameStaticData from "./GameStaticData";
import signals from "signals";

export default class GameData {
    static _instance;
    static get instance() {
        if (!GameData._instance) {
            GameData._instance = new GameData();
        }
        return GameData._instance;
    }
    constructor() {
        this.onUpdateEquipment = new signals.Signal();
        this.onUpdateCompanion = new signals.Signal();
        this.onUpdateCurrency = new signals.Signal();
        this.notEnoughcurrency = new signals.Signal();

        this.attributes = new EntityAttributes();

        this.defaultPlayerData = GameStaticData.instance.getEntityByIndex('player', 0);
    }
    get currentPlayer() {
        return CookieManager.instance.getPlayer(CookieManager.instance.currentPlayer)
    }
    get loadout() {
        return CookieManager.instance.loadout
    }
    get totalPlayers() {
        return CookieManager.instance.totalPlayers
    }
    get currentEquippedWeapon() {
        return CookieManager.instance.loadout.currentWeapon[CookieManager.instance.currentPlayer]
    }

    get currentEquippedCompanion() {
        return CookieManager.instance.loadout.currentCompanion[CookieManager.instance.currentPlayer]
    }

    get currentEquippedTrinket() {
        return CookieManager.instance.loadout.currentTrinket[CookieManager.instance.currentPlayer]
    }

    get currentEquippedMask() {
        return CookieManager.instance.loadout.currentMask[CookieManager.instance.currentPlayer]
    }

    get currentEquippedShoe() {
        return CookieManager.instance.loadout.currentShoe[CookieManager.instance.currentPlayer]
    }
    get currentEquippedWeaponData() {
        return EntityBuilder.instance.getWeapon(this.currentEquippedWeapon.id)
    }
    get currentEquippedCompanionData() {
        return EntityBuilder.instance.getCompanion(this.currentEquippedCompanion.id)
    }
    get inventory() {
        return CookieManager.instance.inventory;
    }
    get resources() {
        return CookieManager.instance.resources;
    }
    get softCurrency() {
        return CookieManager.instance.resources.softCurrency;
    }
    get hardCurrency() {
        return CookieManager.instance.resources.hardCurrency;
    }
    get specialCurrency() {
        return CookieManager.instance.resources.specialCurrency;
    }
    addSoftCurrency(value) {
        const result = CookieManager.instance.addSoftCurrency(value);
        this.onUpdateCurrency.dispatch(this.resources)
        return result;
    }
    addHardCurrency(value) {
        const result = CookieManager.instance.addHardCurrency(value);
        this.onUpdateCurrency.dispatch(this.resources)
        return result;
    }
    addSpecialCurrency(value) {
        const result = CookieManager.instance.addSpecialCurrency(value);
        this.onUpdateCurrency.dispatch(this.resources)
        return result;
    }
    showCantBuy(data) {
        this.notEnoughcurrency.dispatch(data)
    }
    getAttributesFromEquipabble(equip, level) {
        this.addAttributes = new EntityAttributes()
        this.addAttributes.resetAll();
        this.addAttributes.addMultiplyer(equip.attribute, equip.value[level])
        if (equip.secAttribute) {
            this.addAttributes.addMultiplyer(equip.secAttribute, equip.secValue[level])
        }
        return this.addAttributes;
    }
    getPlayer(id) {
        return CookieManager.instance.getPlayer(id)
    }
    savePlayer(id, structure) {
        CookieManager.instance.savePlayer(id, structure)
    }
    changePlayer(id) {
        CookieManager.instance.changePlayer(id)
    }
    changeMainWeapon(id, level) {
        CookieManager.instance.saveEquipment('currentWeapon', id, level)
    }
    changeCompanion(id, level) {
        CookieManager.instance.saveEquipment('currentCompanion', id, level)
        this.onUpdateCompanion.dispatch(id, level)
    }
    changeMask(id, level) {
        CookieManager.instance.saveEquipment('currentMask', id, level)
        this.onUpdateEquipment.dispatch('mask', id, level)
    }
    changeShoe(id, level) {
        CookieManager.instance.saveEquipment('currentShoe', id, level)
        this.onUpdateEquipment.dispatch('shoe', id, level)
    }
    changeTrinket(id, level) {
        CookieManager.instance.saveEquipment('currentTrinket', id, level)
        this.onUpdateEquipment.dispatch('trinket', id, level)
    }
    addToInventory(type, item) {
        //console.log('addToInventory', type, item)

        CookieManager.instance.saveEquipsPiece(type, item.id)
        CookieManager.instance.addToInventory(type, item)

    }
    anyNewEquip() {
        return CookieManager.instance.allNewEquipsDiscover().length > 0;
    }
    getEquipsNewPerArea(area) {
        return CookieManager.instance.getEquipsNewPerArea(area);
    }
    removeFromInventory(type, item, quant) {
        CookieManager.instance.removeFromInventory(type, item, quant)
    }
    getLoadoutAttributes() {
        const addAttributes = new EntityAttributes()
        addAttributes.resetAll()
        addAttributes.reset(this.defaultPlayerData.attributes);
        const equippedShoe = this.currentEquippedShoe
        if (equippedShoe.id) {
            const shoeAttribute = this.getAttributesFromEquipabble(EntityBuilder.instance.getEquipable(equippedShoe.id), equippedShoe.level);
            addAttributes.sumAttributes(shoeAttribute)
        }



        const equippedTrinket = this.currentEquippedTrinket
        if (equippedTrinket.id) {
            const trinketAttribute = this.getAttributesFromEquipabble(EntityBuilder.instance.getEquipable(equippedTrinket.id), equippedTrinket.level);
            addAttributes.sumAttributes(trinketAttribute)

        }

        return addAttributes;
    }
    lastOpened(id) {
        return CookieManager.instance.lastOpened(id)
    }
    openChest(id) {
        CookieManager.instance.openChest(id)
    }

    dailyAvailable(id) {
        return CookieManager.instance.dailyAvailable(id)
    }
    getDaily(id) {
        CookieManager.instance.getDaily(id)
    }
}