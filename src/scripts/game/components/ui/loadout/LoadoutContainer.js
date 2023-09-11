import * as PIXI from 'pixi.js';

import AttributesContainer from './AttributesContainer';
import BodyPartsListScroller from '../../../ui/buildCharacter/BodyPartsListScroller';
import EntityAttributes from '../../../data/EntityAttributes';
import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import GameData from '../../../data/GameData';
import GameStaticData from '../../../data/GameStaticData';
import ItemMergeSystem from '../../merge/ItemMergeSystem';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
import LoadoutStatsView from './LoadoutStatsView';
import MainScreenModal from '../MainScreenModal';
import MergeCardView from '../../merge/MergeCardView';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';
import WeaponLevelContainer from './WeaponLevelContainer';
import signals from 'signals';
import CookieManager from '../../../CookieManager';

export default class LoadoutContainer extends MainScreenModal {
    static Sections = {
        Weapon: 1,
        Caompanion: 2,
        Shoe: 3,
        Trinket: 4
    }
    constructor() {
        super();


        this.slotSize = 120


        this.attributesView = new AttributesContainer();
        this.contentContainer.addChild(this.attributesView)


        this.mergeSectionButton = UIUtils.getPrimaryLabelTabButton(() => {
            if (!this.findMerge()) {
                this.infoUpgradeLabel.alpha = 1
                TweenLite.killTweensOf(this.infoUpgradeLabel)
                TweenLite.to(this.infoUpgradeLabel, 0.5, { delay: 3, alpha: 0 })
                TweenMax.fromTo(this.infoUpgradeLabel, 0.1, {
                    x: 162,
                }, {
                    x: 168,
                    repeat: 5,
                    yoyo: true,
                    ease: Quad.easeInOut
                })
            }
        }, "UPGRADE")

        this.infoUpgradeLabel = UIUtils.getTertiaryLabel('*Requires 3 of the same item to upgrade')
        this.mergeSectionButton.addChild(this.infoUpgradeLabel)
        this.infoUpgradeLabel.style.fontSize = 16
        this.infoUpgradeLabel.x = 168
        this.infoUpgradeLabel.alpha = 0;
        this.contentContainer.addChild(this.mergeSectionButton)
        this.warningIcon = new PIXI.Sprite.from('info');
        this.warningIcon.scale.set(Utils.scaleToFit(this.warningIcon, 30))
        this.warningIcon.anchor.set(0.5)
        this.warningIcon.x = 0
        this.mergeSectionButton.addChild(this.warningIcon)
        this.mergeSectionButton.warningIcon = this.warningIcon;
        this.mergeSectionButton.setActiveTexture(UIUtils.baseTabTexture + '_0003')

        this.autoMergeAll = UIUtils.getPrimaryLabelTabButton(() => {
            this.mergeSystem.findAllMerges(this.currentSlots);
        }, "Auto upgrade")
        this.autoMergeAll.setActiveTexture(UIUtils.baseTabTexture + '_0003')
        this.autoMergeAll.setActive()
        this.contentContainer.addChild(this.autoMergeAll)
        this.autoMergeAll.scale.x = -1;
        this.autoMergeAll.text.scale.x = -1;

        this.autoMergeAll.visible = false;

        this.onUpdateMainWeapon = new signals.Signal();
        this.weaponsScroller = new BodyPartsListScroller({ w: this.slotSize * 4, h: this.slotSize }, { width: this.slotSize + 10, height: this.slotSize + 10 }, { x: 10, y: 10 })
        this.contentContainer.addChild(this.weaponsScroller);
        this.weaponsScroller.addBaseGradient('base-gradient')
        this.equippableWeapons = [];

        this.slotsList = new UIList();

        this.slotsList.w = this.slotSize;
        this.slotsList.h = (this.slotSize + 30) * 2;
        this.contentContainer.addChild(this.slotsList);


        this.previousSection = -1;
        this.slotsListInGame = new UIList();

        this.slotsListInGame.w = this.slotSize;
        this.slotsListInGame.h = (this.slotSize + 30) * 2;
        this.contentContainer.addChild(this.slotsListInGame);

        this.currentWeaponSlot = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
        this.currentWeaponSlot.addWarning()
        //this.currentWeaponSlot.setIconType();
        this.slotsListInGame.addElement(this.currentWeaponSlot, { align: 0 });

        this.currentWeaponSlot.onCardClicked.add((card) => {
            this.playSelectCategory()
            this.disableMainSlots();
            this.selectCard(card)
            this.showSection(LoadoutContainer.Sections.Weapon)
        })

        this.currentShoeSlot = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
        this.currentShoeSlot.addWarning()
        //this.currentShoeSlot.setIconType(true);
        this.slotsList.addElement(this.currentShoeSlot, { align: 0 });
        this.currentShoeSlot.onCardClicked.add((card) => {
            this.playSelectCategory()
            this.disableMainSlots();
            this.selectCard(card)
            this.showSection(LoadoutContainer.Sections.Shoe)
        })

        this.currentTrinketSlot = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
        this.currentTrinketSlot.addWarning()
        //this.currentTrinketSlot.setIconType(true);
        this.slotsList.addElement(this.currentTrinketSlot, { align: 0 });
        this.currentTrinketSlot.onCardClicked.add((card) => {
            this.playSelectCategory()
            this.disableMainSlots();
            this.selectCard(card)
            this.showSection(LoadoutContainer.Sections.Trinket)
        })

        this.currentCompanionSlot = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
        this.currentCompanionSlot.addWarning()
        //this.currentCompanionSlot.setIconType();
        this.slotsListInGame.addElement(this.currentCompanionSlot, { align: 0 });
        this.currentCompanionSlot.onCardClicked.add((card) => {
            this.playSelectCategory()
            this.disableMainSlots();
            this.selectCard(card)
            this.showSection(LoadoutContainer.Sections.Caompanion)
        })



        this.mainslots = [this.currentWeaponSlot, this.currentShoeSlot, this.currentTrinketSlot, this.currentCompanionSlot]
        this.slotsList.updateVerticalList()
        this.slotsListInGame.updateVerticalList()

        this.mergeContainer = new PIXI.Container();
        this.container.addChild(this.mergeContainer)
        this.mergeSystem = new ItemMergeSystem(this.mergeContainer, this.slotSize);
        this.mergeSystem.onUpgradeItem.add(() => {
            setTimeout(() => {
                this.refresh();
            }, 1);
        })





        this.weaponLevelView = new WeaponLevelContainer();
        this.container.addChild(this.weaponLevelView)

        this.loadoutStatsView = new LoadoutStatsView();
        this.container.addChild(this.loadoutStatsView)

    }
    playSelectCategory() {
        SOUND_MANAGER.play('Pop-Tone', 0.2)
        SOUND_MANAGER.play('shoosh', 0.2)
    }
    playChangeEquip() {
        SOUND_MANAGER.play('Pop-Tone', 0.2)
        SOUND_MANAGER.play('getstar', 0.2)
    }
    disableMainSlots() {
        this.mainslots.forEach(element => {
            element.unselected();
        });

    }
    selectCard(card) {
        this.currentSelectedCard = card;
        card.selected();

        this.updateStatsView();

    }
    updateStatsView() {
        if (!this.currentSelectedCard || !this.loadoutStatsView) {
            return;
        }
        this.loadoutStatsView.x = this.currentSelectedCard.x + this.currentSelectedCard.parent.x + this.currentSelectedCard.parent.parent.x

        const left = this.loadoutStatsView.x < Game.Borders.width / 2
        const offset = left ? this.currentSelectedCard.width + 5 : -this.loadoutStatsView.width - 5;

        this.loadoutStatsView.x += offset

        this.loadoutStatsView.updateData(this.currentSelectedCard.cardData, this.currentSelectedCard.level);

        const isOnTop = this.currentSelectedCard.y < 50;

        if (isOnTop) {

            this.loadoutStatsView.y = this.currentSelectedCard.y + this.currentSelectedCard.parent.y + this.currentSelectedCard.parent.parent.y
        } else {

            this.loadoutStatsView.y = this.currentSelectedCard.y + this.currentSelectedCard.parent.y + this.currentSelectedCard.parent.parent.y - this.loadoutStatsView.height + this.currentSelectedCard.height
        }


        this.weaponLevelView.y = this.loadoutStatsView.y
        this.weaponLevelView.x = this.loadoutStatsView.x + this.loadoutStatsView.width

    }
    refresh() {
        this.refreshSection(this.previousSection, true)
        let canMerge = this.findMerge()
    }
    findMerge(show = true) {
        const entityCount = {}
        this.currentSlots.forEach(element => {
            if (element.cardData && element.level < 5) {
                if (entityCount[element.cardData.id + '-' + element.level]) {
                    entityCount[element.cardData.id + '-' + element.level].total++
                } else {
                    entityCount[element.cardData.id + '-' + element.level] = {
                        total: 1,
                        level: element.level,
                        data: element.cardData,
                        card: element
                    }
                }
            }
        });

        var canMerge = false;
        for (const key in entityCount) {
            const element = entityCount[key];
            if (element.total >= 3) {
                canMerge = true;
                break;
            }
        }


        this.autoMergeAll.visible = false;
        if (!canMerge) {



            return false
        }

        if (show) {
            const tempMergeDraw = this.mergeSystem.buildMergeView(entityCount)
            this.updateListView(tempMergeDraw, true)
            this.autoMergeAll.visible = true;
        }
        return true;
    }
    addBackgroundShape() {
        // this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('infoBack'), 20, 20, 20, 20);
        // this.container.addChild(this.infoBackContainer);
    }
    showWeaponLevels() {
        this.weaponLevelView.visible = true
        this.weaponLevelView.updateWeaponData(GameData.instance.currentEquippedWeaponData)
        console.log(GameData.instance.currentEquippedWeaponData)
    }
    showSection(id) {


        this.previousSection = id;
        this.weaponLevelView.visible = false;
        switch (id) {
            case LoadoutContainer.Sections.Weapon:
                CookieManager.instance.clearEquipsPieceNew('weapons')
                this.updateListView(this.equippableWeapons)
                this.showWeaponLevels();
                break;
            case LoadoutContainer.Sections.Shoe:
                CookieManager.instance.clearEquipsPieceNew('shoes')
                this.updateListView(this.equippableShoes)
                break;
            case LoadoutContainer.Sections.Trinket:
                CookieManager.instance.clearEquipsPieceNew('trinkets')
                this.updateListView(this.equippableTrinkets)
                break;
            case LoadoutContainer.Sections.Caompanion:
                CookieManager.instance.clearEquipsPieceNew('companions')
                this.updateListView(this.equippableCompanions)
                break;
        }

        if (!this.findMerge(false)) {
            this.mergeSectionButton.text.alpha = 0.65;
            this.mergeSectionButton.updateBackTexture(UIUtils.baseTabTexture + '_0002')
            this.mergeSectionButton.warningIcon.visible = false;
        } else {
            this.mergeSectionButton.text.alpha = 1;
            this.mergeSectionButton.updateBackTexture(UIUtils.baseTabTexture + '_0003')
            this.mergeSectionButton.warningIcon.visible = true;
        }

        this.refreshAllNews();
    }
    refreshAllNews() {
        let areaNew = null
        areaNew = GameData.instance.getEquipsNewPerArea('weapons')
        this.currentWeaponSlot.warning.visible = areaNew.length > 0
        areaNew = GameData.instance.getEquipsNewPerArea('shoes')
        this.currentShoeSlot.warning.visible = areaNew.length > 0
        areaNew = GameData.instance.getEquipsNewPerArea('trinkets')
        this.currentTrinketSlot.warning.visible = areaNew.length > 0
        areaNew = GameData.instance.getEquipsNewPerArea('companions')
        this.currentCompanionSlot.warning.visible = areaNew.length > 0

    }
    refreshSection(id, applySection = false) {
        let areaNew = null
        switch (id) {
            case LoadoutContainer.Sections.Weapon:
                areaNew = GameData.instance.getEquipsNewPerArea('weapons')
                this.currentWeaponSlot.warning.visible = areaNew.length > 0
                this.refreshWeapons();
                if (applySection) {
                    this.showSection(id)
                }
                break;
            case LoadoutContainer.Sections.Shoe:
                areaNew = GameData.instance.getEquipsNewPerArea('shoes')
                this.currentWeaponSlot.warning.visible = areaNew.length > 0
                this.refreshShoes();
                if (applySection) {
                    this.showSection(id)
                }
                break;
            case LoadoutContainer.Sections.Trinket:
                areaNew = GameData.instance.getEquipsNewPerArea('trinkets')
                this.currentWeaponSlot.warning.visible = areaNew.length > 0
                this.refreshTrinkets();
                if (applySection) {
                    this.showSection(id)
                }
                break;
            case LoadoutContainer.Sections.Caompanion:
                areaNew = GameData.instance.getEquipsNewPerArea('companions')
                this.currentWeaponSlot.warning.visible = areaNew.length > 0
                this.refreshCompanions();
                if (applySection) {
                    this.showSection(id)
                }
                break;
        }

    }

    refreshWeapons() {
        const fullInventory = GameData.instance.inventory;

        this.equippableWeapons = [];
        let availableCards = fullInventory.weapons

        for (let index = 0; index < availableCards.length; index++) {
            const card = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
            let dt = EntityBuilder.instance.getWeapon(availableCards[index].id)
            //console.log(availableCards[index].level)
            card.setData(dt, availableCards[index].level)
            card.resetPivot()
            card.onCardClicked.add((card) => {
                this.playChangeEquip();
                GameData.instance.changeMainWeapon(card.cardData.id, card.level);
                this.currentWeaponSlot.setData(EntityBuilder.instance.getWeapon(card.cardData.id), card.level)
                this.onUpdateMainWeapon.dispatch(card.cardData);
                this.loadoutStatsView.updateData(card.cardData, card.level);

                this.refreshAttributes();
                this.showWeaponLevels();

            })
            this.equippableWeapons.push(card)
        }

        this.equippableWeapons.sort((a, b) => a.level - b.level);
        this.equippableWeapons.sort((a, b) => a.cardData.id.localeCompare(b.cardData.id));

        this.showWeaponLevels();
    }
    refreshCompanions() {
        const fullInventory = GameData.instance.inventory;

        this.equippableCompanions = [];


        let availableCompanions = fullInventory.companions

        console.log(availableCompanions)

        for (let index = 0; index < availableCompanions.length; index++) {
            const card = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
            let dt = EntityBuilder.instance.getCompanion(availableCompanions[index].id)
            card.setData(dt, availableCompanions[index].level)
            card.resetPivot()
            card.onCardClicked.add((card) => {
                this.playChangeEquip();
                GameData.instance.changeCompanion(card.cardData.id, card.level);
                this.currentCompanionSlot.setData(EntityBuilder.instance.getCompanion(card.cardData.id), availableCompanions[index].level)
                this.loadoutStatsView.updateData(card.cardData, card.level);

                this.refreshAttributes();

            })
            this.equippableCompanions.push(card)
        }

        this.equippableCompanions.sort((a, b) => a.level - b.level);
        this.equippableCompanions.sort((a, b) => a.cardData.id.localeCompare(b.cardData.id));

        let removeCompanion = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
        removeCompanion.resetPivot()
        removeCompanion.remover()
        removeCompanion.onCardClicked.add((removeCompanion) => {
            this.playChangeEquip();
            GameData.instance.changeCompanion(null);
            this.currentCompanionSlot.setData(null)
            this.currentCompanionSlot.setIcon(UIUtils.getIconUIIcon('--'), 80)
        })
        this.equippableCompanions.unshift(removeCompanion)

    }
    refreshTrinkets() {
        const fullInventory = GameData.instance.inventory;

        this.equippableTrinkets = [];
        let availableTrinkets = fullInventory.trinkets

        for (let index = 0; index < availableTrinkets.length; index++) {
            let dt = EntityBuilder.instance.getEquipable(availableTrinkets[index].id)

            const card = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
            card.setData(dt, availableTrinkets[index].level)
            card.resetPivot()
            card.onCardClicked.add((card) => {
                this.playChangeEquip();
                GameData.instance.changeTrinket(card.cardData.id, card.level);
                this.currentTrinketSlot.setData(EntityBuilder.instance.getEquipable(card.cardData.id), availableTrinkets[index].level)
                this.loadoutStatsView.updateData(card.cardData, card.level);

                this.refreshAttributes();

            })
            this.equippableTrinkets.push(card)
        }

        this.equippableTrinkets.sort((a, b) => a.level - b.level);
        this.equippableTrinkets.sort((a, b) => a.cardData.id.localeCompare(b.cardData.id));

        let removeTrinket = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
        //removeTrinket.setData(dt)
        removeTrinket.resetPivot()
        removeTrinket.remover()
        removeTrinket.onCardClicked.add((removeTrinket) => {
            this.playChangeEquip();
            GameData.instance.changeTrinket(null);
            this.currentTrinketSlot.setData(null)
            this.currentTrinketSlot.setIcon(UIUtils.getIconUIIcon('--'), 80)
        })
        this.equippableTrinkets.unshift(removeTrinket)
    }
    refreshShoes() {
        const fullInventory = GameData.instance.inventory;

        this.equippableShoes = [];
        let availableShoes = fullInventory.shoes

        for (let index = 0; index < availableShoes.length; index++) {
            let dt = EntityBuilder.instance.getEquipable(availableShoes[index].id)

            const card = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
            card.setData(dt, availableShoes[index].level, 100)
            card.resetPivot()
            card.onCardClicked.add((card) => {
                this.playChangeEquip();
                GameData.instance.changeShoe(card.cardData.id, card.level);
                this.currentShoeSlot.setData(EntityBuilder.instance.getEquipable(card.cardData.id), availableShoes[index].level)
                this.loadoutStatsView.updateData(card.cardData, card.level);

                this.refreshAttributes();

            })
            this.equippableShoes.push(card)
        }

        this.equippableShoes.sort((a, b) => a.level - b.level);
        this.equippableShoes.sort((a, b) => a.cardData.id.localeCompare(b.cardData.id));
    }
    show() {
        this.visible = true;
        this.alpha = 1;
        this.container.alpha = 0.5;
        TweenLite.killTweensOf(this.container)
        TweenLite.killTweensOf(this.container.scale)

        TweenLite.to(this.container, 0.25, { alpha: 1 })
        this.onShow.dispatch(this)

        const fullInventory = GameData.instance.inventory;

        const cards = GameStaticData.instance.getAllCards()

        this.currentWeaponSlot.setData(EntityBuilder.instance.getWeapon(GameData.instance.currentEquippedWeaponData.id), GameData.instance.currentEquippedWeapon.level)
        this.currentWeaponSlot.resetPivot()

        const shoe = GameData.instance.currentEquippedShoe
        this.currentShoeSlot.setData(shoe ? EntityBuilder.instance.getShoe(shoe.id) : null, shoe ? shoe.level : 0, 100)
        this.currentShoeSlot.resetPivot()

        const trinket = GameData.instance.currentEquippedTrinket
        this.currentTrinketSlot.setData(trinket ? EntityBuilder.instance.getTrinket(trinket.id) : null, trinket ? trinket.level : 0)
        if (!trinket.id) {
            this.currentTrinketSlot.setIcon(UIUtils.getIconUIIcon('--'), 80)
        }
        this.currentTrinketSlot.resetPivot()

        const companion = GameData.instance.currentEquippedCompanion
        this.currentCompanionSlot.setData(companion ? EntityBuilder.instance.getCompanion(companion.id) : null, companion ? companion.level : 0)
        if (!companion.id) {
            this.currentCompanionSlot.setIcon(UIUtils.getIconUIIcon('--'), 80)
        }
        this.currentCompanionSlot.resetPivot();

        this.refreshSection(LoadoutContainer.Sections.Weapon)
        this.refreshSection(LoadoutContainer.Sections.Shoe)
        this.refreshSection(LoadoutContainer.Sections.Trinket)
        this.refreshSection(LoadoutContainer.Sections.Caompanion)

        this.showSection(LoadoutContainer.Sections.Weapon)

        this.slotsList.updateVerticalList()
        this.slotsListInGame.updateVerticalList()
        this.resize()

        this.refreshAttributes();
        this.disableMainSlots();
        this.selectCard(this.currentWeaponSlot)

        this.refreshAllNews();

    }
    refreshAttributes() {

        if (this.currentSelectedCard) {
            this.selectCard(this.currentSelectedCard)
        }

        const loadoutData = GameData.instance.loadout;
        const playerData = GameStaticData.instance.getEntityByIndex('player', 0)


        this.defaultAttributes = new EntityAttributes()
        //console.log(this.defaultAttributes.multipliers)
        this.defaultAttributes.reset(playerData.attributes)

        console.log(this.defaultAttributes)

        this.atributes = new EntityAttributes()
        //console.log(this.atributes.multipliers)
        this.atributes.reset(playerData.attributes)

        this.addAttributes = new EntityAttributes()
        this.addAttributes.resetAll();

        if (loadoutData.currentShoe.length > 0) {
            const equippedShoe = EntityBuilder.instance.getEquipable(loadoutData.currentShoe[0].id)
            if (equippedShoe) {
                const shoeAttribute = GameData.instance.getAttributesFromEquipabble(equippedShoe, loadoutData.currentShoe[0].level);
                // console.log('shoeAttribute', shoeAttribute)
                this.addAttributes.sumAttributes(shoeAttribute)
            }
        }

        if (loadoutData.currentTrinket.length > 0) {

            const equippedTrinket = EntityBuilder.instance.getEquipable(loadoutData.currentTrinket[0].id)
            if (equippedTrinket) {
                const trinketAttribute = GameData.instance.getAttributesFromEquipabble(equippedTrinket, loadoutData.currentTrinket[0].level);
                // console.log('trinketAttribute', trinketAttribute)
                this.addAttributes.sumAttributes(trinketAttribute)

            }
        }

        this.defaultAttributes.basePower = 0;
        this.defaultAttributes.baseFrequency = 0;

        GameData.instance.currentEquippedWeaponData.weaponAttributes.level = GameData.instance.currentEquippedWeapon.level

        this.atributes.weaponPower = GameData.instance.currentEquippedWeaponData.weaponAttributes.power;
        this.atributes.basePower = this.atributes.basePower;
        this.atributes.baseFrequency = GameData.instance.currentEquippedWeaponData.weaponAttributes.frequency
        this.atributes.baseCritical = GameData.instance.currentEquippedWeaponData.weaponAttributes.critical

        this.atributes.sumAttributes(this.addAttributes)
        this.attributesView.updateAttributes(this.defaultAttributes, this.atributes)


    }
    updateListView(slots, showMerge = false) {
        //this.mergeSystem.destroyCards()
        if (!showMerge) {

            this.mergeSystem.hide();
        }
        this.currentSlots = slots;
        this.weaponsScroller.removeAllItems();
        this.weaponsScroller.addItens(this.currentSlots)

    }
    recenterContainer() {

    }
    update(delta) {
        super.update(delta);

        this.attributesView.visible = !this.autoMergeAll.visible;
        //this.weaponLevelView
    }
    resize(res, newRes) {
        super.resize(res, newRes)
        if (!this.currentSlots) {
            return;
        }

        const margin = 20;

        this.weaponsScroller.removeAllItems();

        if (Game.IsPortrait) {
            this.weaponsScroller.gridDimensions.j = Math.floor((Game.Borders.width) / this.weaponsScroller.scale.x / (this.slotSize + margin))
            this.weaponsScroller.resize({ w: this.weaponsScroller.gridDimensions.j * (this.slotSize + margin) + 20 - margin, h: ((Game.Borders.height / 2) / this.weaponsScroller.scale.y - 130) }, { width: this.slotSize + margin, height: this.slotSize + margin })
        } else {

            this.weaponsScroller.gridDimensions.j = Math.floor((Game.Borders.width - 130) / this.weaponsScroller.scale.x / (this.slotSize + margin))
            this.weaponsScroller.resize({ w: this.weaponsScroller.gridDimensions.j * (this.slotSize + margin) + 20 - margin, h: ((Game.Borders.height / 2) / this.weaponsScroller.scale.y - 75) }, { width: this.slotSize + margin, height: this.slotSize + margin })
        }
        this.weaponsScroller.addItens(this.currentSlots)

        this.weaponsScroller.y = Game.Borders.height - 20 - this.weaponsScroller.rect.h
        this.weaponsScroller.x = (Game.Borders.width) / 2 - (this.weaponsScroller.rect.w) / 2


        //this.slotsList.scale.set(Utils.scaleToFit(this.slotsList, Game.Borders.height / 2 - 150))
        this.slotsListInGame.x = this.weaponsScroller.x + 10
        this.slotsListInGame.y = Game.Borders.height / 2 - this.slotsListInGame.h * this.slotsListInGame.scale.y

        //this.slotsListInGame.scale.set(Utils.scaleToFit(this.slotsListInGame, Game.Borders.height / 2 - 150))
        this.slotsList.x = this.weaponsScroller.rect.w + this.weaponsScroller.x - this.slotsList.w * this.slotsList.scale.x
        this.slotsList.y = Game.Borders.height / 2 - this.slotsList.h * this.slotsList.scale.y
        this.mergeSectionButton.x = this.weaponsScroller.x


        this.mergeSectionButton.y = this.weaponsScroller.y - this.autoMergeAll.height + 13
        this.autoMergeAll.x = this.weaponsScroller.x + this.weaponsScroller.rect.w
        this.autoMergeAll.y = this.weaponsScroller.y - this.autoMergeAll.height + 10


        //this.mergeContainer.scale.set(Math.max(1, this.slotsList.scale.y))
        this.mergeContainer.x = this.weaponsScroller.x + (this.weaponsScroller.rect.w) / 2
        this.mergeContainer.y = this.weaponsScroller.y

        let attScale = Utils.scaleToFit(this.attributesView, (Game.Borders.width) * 0.47);

        this.attributesView.setSize(800, 40)
        if (Game.IsPortrait) {
            this.attributesView.y = 100
            attScale = Utils.scaleToFit(this.attributesView, (Game.Borders.width) * 0.9);
            this.attributesView.scale.set(Math.min(1, attScale))
        } else {
            let scl = 0.6;
            if (Game.Screen.AspectRatio < 1.41) {
                scl = 0.42
            }
            else if (Game.Screen.AspectRatio < 1.81) {
                scl = 0.5
            }
            attScale = Utils.scaleToFit(this.attributesView, (Game.Borders.width) * scl);
            this.attributesView.scale.set(Math.min(1, attScale))
            this.attributesView.y = this.weaponsScroller.y - this.attributesView.height + 1

        }
        this.attributesView.x = (Game.Borders.width) / 2 - (this.attributesView.width) / 2


        this.mergeSystem.resize(res, newRes);

        this.updateStatsView();

    }

}