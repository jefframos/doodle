import * as PIXI from 'pixi.js';

import BodyPartsListScroller from '../../../ui/buildCharacter/BodyPartsListScroller';
import Game from '../../../../Game';
import GameStaticData from '../../../data/GameStaticData';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';
import ViewDatabase from '../../../data/ViewDatabase';
import RewardsManager from '../../../data/RewardsManager';
import PrizeManager from '../../../data/PrizeManager';
import GameData from '../../../data/GameData';
import TimedAction from '../../../data/TimedAction';

export default class CharacterCustomizationContainer extends PIXI.Container {
    static _instance;
    static get instance() {
        if (!CharacterCustomizationContainer._instance) {
            CharacterCustomizationContainer._instance = new CharacterCustomizationContainer();
        }
        return CharacterCustomizationContainer._instance;
    }
    constructor(typeList = 'visuals') {
        super();





        this.typeList = typeList;
        this.container = new PIXI.Container();
        this.addChild(this.container)

        this.topBlocker = new PIXI.Sprite.from('base-gradient');
        //this.topBlocker = new PIXI.Sprite.from('square_button_0001');
        this.topBlocker.tint = 0x13202F;
        // this.topBlocker.scale.y = -1
        this.container.addChild(this.topBlocker);


        this.piecesScroller = new BodyPartsListScroller({ w: 300, h: 450 }, { width: 100, height: 100 }, { x: 7.5, y: 7.5 });
        this.container.addChild(this.piecesScroller);


        this.colorContainerHairScroller = new UIList();
        this.colorContainerHairScroller.w = 100;
        this.colorContainerHairScroller.h = 100;
        this.container.addChild(this.colorContainerHairScroller);





        this.torsosData = {
            _1: {
                colorset: UIUtils.colorset.clothes,
                parts: [{
                    param: 'sleeves',
                    frame: 0,
                    colorParam: 'sleevesColor',
                    color: -1
                }]
            },
        }


        this.staticData = GameStaticData.instance.getAllDataFrom('database', 'body-parts')[0];

        this.areas = [
            { typeList: 'visuals', label: 'Skin', param: 'skin', colorParam: 'skinColor', area: "skin", type: "colors", anchor: { x: 0.45, y: 0.42 }, mainIconId: '01', pivot: { x: 65, y: 90 }, iconSize: 150, range: [1, 21], src: 'head-0001', colorset: UIUtils.colorset.skin },

            { typeList: 'visuals', label: 'Torso', param: 'chest', colorParam: 'topClothColor', area: "chest", anchor: { x: 0.43, y: 0.6 }, mainIconId: '01', pivot: { x: 65, y: 120 }, iconSize: 120, range: [], src: ["sleeve-00{frame}", "front-arm0001", 'head-0001', "chest-00{frame}"], animated: false },

            // {type:'visuals', label: 'Sleves', param: 'sleeves', colorParam: 'sleevesColor', area: "sleeve", pivot: { x: 35, y: 140 }, mainIconId: '02', iconSize: 150, range: [0, 2], src: ["sleeve-00{frame}"] , colorset: UIUtils.colorset.clothes},
            //{ label: 'skin', param: 'arms', colorParam: null, area: "arms", subs: ["backArm", "frontArm"], pivot: { x: 35, y: 140 }, mainIconId: '01', iconSize: 150, range: [1, 1], src: ["front-arm00{frame}", "front-arm00{frame}"], animated: false },

            { typeList: 'visuals', label: 'Pants', param: 'leg', colorParam: null, area: "legs", subs: ["backLeg", "frontLeg"], anchor: { x: 0.5, y: 0.5 }, mainIconId: '01', iconSize: 80, range: [1, 8], src: 'leg-icon-exporter00{frame}', srcIcon: 'leg-icon-exporter0001', animated: false },

            //{ typeList: 'visuals', label: 'Shoes', param: 'shoe', colorParam: null, area: "shoes", subs: ["backShoes", "frontShoes"], anchor: { x: 0.35, y: 0.9 }, mainIconId: '01', iconSize: 200, range: [1, 8], src: "dynamic-shoe-00{frame}", animated: false },


            { typeList: 'visuals', label: 'Head', param: 'head', colorParam: null, area: "head", anchor: { x: 0.45, y: 0.42 }, mainIconId: '04', iconSize: 150, range: [1, 4], src: "head-00{frame}", animated: false },
            { typeList: 'visuals', label: 'Eyes', param: 'eyes', colorParam: null, area: "eyes", anchor: { x: 0.57, y: 0.43 }, mainIconId: '01', pivot: { x: 65, y: 90 }, iconSize: 150, range: [1, 19], src: ["eyes-00{frame}", 'head-0001'], animated: false },
            { typeList: 'visuals', label: 'Ears', param: 'ears', colorParam: null, area: "ears", anchor: { x: 0.30, y: 0.48 }, mainIconId: '03', pivot: { x: 65, y: 90 }, iconSize: 150, range: [1, 5], src: ["ear-00{frame}", 'head-0001'], animated: false },
            { typeList: 'visuals', label: 'Mouth', param: 'mouth', colorParam: null, area: "mouth", anchor: { x: 0.57, y: 0.52 }, mainIconId: '11', pivot: { x: 65, y: 90 }, iconSize: 150, range: [1, 20], src: ["mouth-00{frame}", 'head-0001'], animated: false },
            { typeList: 'visuals', label: 'Beard', param: 'frontFace', colorParam: 'faceHairColor', area: "frontFace", anchor: { x: 0.57, y: 0.5 }, pivot: { x: 65, y: 90 }, mainIconId: '01', iconSize: 150, range: [0, 9], src: ["front-face-00{frame}", 'head-0001'], animated: false, colorset: UIUtils.colorset.hair },
            //{ typeList: 'equip', label: 'Mask', param: 'mask', colorParam: null, area: "mask", anchor: { x: 0.57, y: 0.5 }, pivot: { x: 65, y: 90 }, mainIconId: '01', iconSize: 150, range: [0, 4], src: ["mask-00{frame}", 'head-0001'], animated: false },
            { typeList: 'equip', label: 'Trinket', param: 'trinket', colorParam: null, area: "trinket", anchor: { x: 0.48, y: 0.55 }, pivot: { x: 65, y: 90 }, mainIconId: '01', iconSize: 150, range: [0, 2], src: "trinket-00{frame}", animated: false },
            { typeList: 'visuals', label: 'Hair', param: 'topHead', colorParam: 'hairColor', area: "hair", subs: ["topHead", "backHead"], pivot: { x: 65, y: 90 }, mainIconId: '01', iconSize: 150, range: [0, 28], src: ["top-head-00{frame}", 'head-0001', "back-head-00{frame}"], animated: false, colorset: UIUtils.colorset.hair },
            { typeList: 'visuals', label: 'Hat', param: 'hat', colorParam: null, area: "hat", anchor: { x: 0.45, y: 0.4 }, pivot: { x: 65, y: 90 }, mainIconId: '01', iconSize: 150, range: [0, 20], src: ["hat-00{frame}", 'head-0001'], animated: false }]


        this.areas = this.areas.filter(item => item.typeList == this.typeList)

        this.areas.forEach(element => {
            if (this.staticData[element.area]) {
                element.range = [this.staticData[element.area].availables.min, this.staticData[element.area].availables.max]
            }
        });

        this.sectionList = new UIList();
        this.container.addChild(this.sectionList);
        this.sectionList.w = 0
        this.sectionList.h = 0;


        this.sectionListName = new UIList();
        this.container.addChild(this.sectionListName);
        this.sectionListName.w = 0
        this.sectionListName.h = 0;

        this.allButtons = [];

        let count = 0;
        this.areas.forEach(element => {
            const button = UIUtils.getBodyTypeLabelButton((button) => {
                this.openSection(element);
                button.setActive();
            }, '')
            button.area = element.area
            if (!Array.isArray(element.src)) {
                if (element.srcIcon) {
                    button.addIcon(element.srcIcon, element.iconSize, element.anchor)
                } else {
                    const src = element.src.replace('{frame}', element.mainIconId)
                    button.addIcon(src, element.iconSize, element.anchor)
                }
            } else {
                const iconContainer = new PIXI.Container();

                for (let index = element.src.length - 1; index >= 0; index--) {
                    const srcSub = element.src[index];

                    const src = srcSub.replace('{frame}', element.mainIconId) + (element.animated ? '01' : '')
                    const sprite = new PIXI.Sprite.from(src);
                    iconContainer.addChild(sprite)
                }
                button.addIconContainer(iconContainer, element.iconSize, element.pivot)

            }

            if (element.type == "colors" && element.colorset) {
                button.tintIcon(element.colorset[0])
            }


            this.allButtons.push(button);
            this.sectionList.addElement(button, { align: 0, vAlign: 0 })
            this.sectionList.h += 80 + 2;

            this.sectionListName.addElement(UIUtils.getPrimaryLabel(element.label), { align: 0, vAlign: 0 })
            this.sectionListName.h += 80 + 2;
        });

        this.currentShowingColors = [];
        this.sectionList.updateVerticalList();
        this.sectionListName.updateVerticalList();

        this.randomCustomization = UIUtils.getPrimaryShapelessButton(() => {
            if (this.openClothesChestTimed.canUse) {

                RewardsManager.instance.doReward(() => {
                    GameData.instance.openChest(this.openClothesChestTimed.id)
                    PrizeManager.instance.getMetaPrize([6], 1, 1);
                })
            }

        }, 'RANDOM', UIUtils.getIconUIIcon('wardrobe'))

        this.openClothesChestTimed = new TimedAction("FREE_CLOTHES", 300, this.randomCustomization.text, "FREE\nClothes")
        

        let videoClothesSprite = new PIXI.Sprite.from(UIUtils.getIconUIIcon('video'))
        
        videoClothesSprite.x = this.randomCustomization.width - 20
        videoClothesSprite.y = 20
        videoClothesSprite.scale.set(Utils.scaleToFit(videoClothesSprite, 40))
        videoClothesSprite.anchor.set(1,0)
        this.randomCustomization.addChild(videoClothesSprite)
        this.randomCustomization.text.y = 110
        this.container.addChild(this.randomCustomization)


    }
    get isOpen() {
        return this.container.visible;
    }
    update(delta) {
        this.date = new Date();
        this.openClothesChestTimed.updateTime(this.date.getTime())

        //console.log(Utils.floatToTime(Math.round((this.date.getTime() - GameData.instance.lastOpened(this.randomCustomization.openId)) / 1000)))
    }
    show() {
        this.container.visible = true;
        this.container.alpha = 0.5;
        TweenLite.killTweensOf(this.container)
        TweenLite.to(this.container, 0.25, { alpha: 1 })

        this.updateWarningButtons();

        if (!ViewDatabase.instance.canGetPiece()) {
            this.randomCustomization.visible = false;
        }
    }
    updateWarningButtons() {
        const current = ViewDatabase.instance.getNewWearablesList()

        this.allButtons.forEach(element => {
            if (current.filter(e => e.area === element.area).length > 0) {
                element.warningIcon.visible = true;

            } else {
                element.warningIcon.visible = false;
            }
        });
    }
    hide() {
        this.container.visible = false;
    }
    setPlayer(viewStructure) {
        this.playerViewStructure = viewStructure;

        this.openSection(this.areas[0])
        this.allButtons[0].setActive()
    }
    buildColorListOnly(colorset, colorParam) {
        for (let index = 0; index < colorset.length; index++) {
            const slot = UIUtils.getColorSlot(this.updateSlotColor.bind(this), colorset[index])
            if (Array.isArray(colorParam)) {
                slot.colorParam = colorParam
            } else {
                slot.colorParam = [colorParam]
            }
            this.currentShowingItems.push(slot)

        }
        this.piecesScroller.addItens(this.currentShowingItems)
    }
    hideColors() {
        this.colorContainerHairScroller.visible = false;
        this.colorContainerHairScroller.scale.set(1);
    }
    buildAltColorList(colorset, colorParam) {

        this.currentShowingColors = [];
        this.colorContainerHairScroller.removeAllElements();

        colorset.forEach(element => {
            let colorButton = UIUtils.getColorButton(this.updateSlotColor.bind(this), element, 60, 60)
            if (Array.isArray(colorParam)) {
                colorButton.colorParam = colorParam
            } else {
                colorButton.colorParam = [colorParam]
            }

            this.currentShowingColors.push(colorButton)
            this.colorContainerHairScroller.addElement(colorButton, { align: 0.5 })
            colorButton.visible = true;

        });

        if (Game.IsPortrait) {
            this.rebuildPortraitScrollers();
            this.colorContainerHairScroller.x = Game.Borders.width - (this.colorContainerHairScroller.w * this.colorContainerHairScroller.scale.x) - 40
        } else {
            this.rebuildLandscapeScroller()
            let middle = Game.Borders.width - this.piecesScroller.rect.w - this.colorContainerHairScroller.w - 40
            this.colorContainerHairScroller.x = Math.min(middle, Game.Borders.width / 2 - this.colorContainerHairScroller.w / 2)

        }
        this.colorContainerHairScroller.visible = true

    }
    updateSlotColor(slot) {
        slot.colorParam.forEach(element => {
            this.playerViewStructure[element] = slot.color;
        });
        this.findCurrentEquipped()

    }
    selectNewPiece(slot) {
        if (!slot.isAvailable) {
            return;
        }

        slot.warningIcon.visible = false;

        if (slot.region.colorsetData) {
            const colorsetData = slot.region.colorsetData['_' + slot.itemId]

            if (colorsetData) {
                let params = [slot.region.colorParam];
                colorsetData.parts.forEach(element => {
                    if (element.param) {
                        this.playerViewStructure[element.param] = element.frame
                    }
                    if (element.color < 0 && element.colorParam) {
                        params.push(element.colorParam)
                        this.playerViewStructure[element.colorParam] = this.playerViewStructure[slot.region.colorParam];
                    } else if (element.color >= 0 && element.colorParam) {
                        this.playerViewStructure[element.colorParam] = element.color;
                    }
                });
                this.buildAltColorList(colorsetData.colorset, params)
            } else {
                this.playerViewStructure[slot.region.colorParam] = 0xFFFFFF
                this.resetColorPieces();
            }
        } else {

        }

        this.playerViewStructure[slot.itemParam] = slot.itemId;

        this.findCurrentEquipped()

    }
    findCurrentEquipped() {
        if (this.currentRegion.colorset) {

            const currentColor = this.playerViewStructure['_' + this.currentRegion.colorParam];
            this.currentShowingColors.forEach(element => {
                if (element.color == currentColor) {
                    element.setActive()

                } else {
                    element.setDefault()
                }
            });

        }
        if (this.currentRegion.type == 'colors') {
            const currentColor = this.playerViewStructure['_' + this.currentRegion.colorParam];
            this.currentShowingItems.forEach(element => {
                if (element.color == currentColor) {
                    element.setActive()

                } else {
                    element.setDefault()
                }
            });
        } else {
            const currentId = this.playerViewStructure['_' + this.currentRegion.param];
            this.currentShowingItems.forEach(element => {
                if (element.itemId == currentId) {
                    element.setActive()

                } else {
                    element.setDefault()
                }
            });
        }
    }
    resetColorPieces() {
        this.currentShowingColors.forEach(element => {
            element.colorParam = [];
        });
        this.currentShowingColors = []

    }
    openSection(region, value) {
        this.allButtons.forEach(element => {
            element.setDefault();
        });
        this.currentRegion = region;
        this.currentShowingItems = []
        this.piecesScroller.removeAllItems();
        this.currentShowingColors = []

        this.piecesScroller.setTitle(this.currentRegion.label)
        if (ViewDatabase.instance.getAreaWardrobe(this.currentRegion.area)) {

            console.log(ViewDatabase.instance.getAreaWardrobe(this.currentRegion.area).length)
        }

        const currentNewWearables = ViewDatabase.instance.getNewWearablesList()
        let newSectionWearablesList = currentNewWearables.filter(e => e.area === region.area)

        if (newSectionWearablesList && newSectionWearablesList.length) {
            newSectionWearablesList = newSectionWearablesList[0].content
        }

        ViewDatabase.instance.saveWardrobeOpenSection(region.area)
        this.updateWarningButtons();


        if (this.currentRegion.type == 'colors') {
            this.buildColorListOnly(this.currentRegion.colorset, this.currentRegion.colorParam)
            this.findCurrentEquipped()

            return
        }
        if (this.currentRegion.colorParam && this.currentRegion.colorset) {
            this.buildAltColorList(this.currentRegion.colorset, this.currentRegion.colorParam)
        } else {
            this.hideColors();
        }
        if (this.currentRegion.range) {

            for (let index = this.currentRegion.range[0]; index <= this.currentRegion.range[1]; index++) {

                const frame = (this.currentRegion.animated ? index : Utils.formatNumber(index, 1))
                const slot = UIUtils.getBodyPartySlot(this.selectNewPiece.bind(this))

                const isAvailable = index <= 0 || ViewDatabase.instance.containsPiece(region.area, index) || Game.Debug.allItems
                slot.itemId = index;
                slot.itemParam = this.currentRegion.param;
                slot.region = region;
                slot.isAvailable = isAvailable;
                slot.warningIcon.visible = newSectionWearablesList.includes(index);

                if (index <= 0) {
                    slot.addIcon(PIXI.Texture.from(UIUtils.getIconUIIcon('close')), 50)
                    this.currentShowingItems.push(slot)
                    slot.warningIcon.visible = false;

                } else {
                    if (isAvailable) {
                        if (!Array.isArray(this.currentRegion.src)) {
                            const src = this.currentRegion.src.replace('{frame}', frame)
                            slot.addIcon(src, this.currentRegion.iconSize, this.currentRegion.anchor)
                        } else {
                            const iconContainer = new PIXI.Container();
                            this.currentRegion.src.forEach(srcSub => {
                                const src = srcSub.replace('{frame}', frame) + (this.currentRegion.animated ? "01" : "")

                                const sprite = new PIXI.Sprite.from(src);
                                iconContainer.addChildAt(sprite, 0)
                            });
                            slot.addIconContainer(iconContainer, this.currentRegion.iconSize, this.currentRegion.pivot)

                        }
                    } else {
                        slot.addIcon(UIUtils.getIconUIIcon('wearable-lock'), 50)

                    }
                    this.currentShowingItems.push(slot)
                }
            }

        }

        this.piecesScroller.addItens(this.currentShowingItems)

        this.findCurrentEquipped()
    }
    getSlotImage(area, rawFrame) {
        let region = null;
        this.areas.forEach(element => {
            if (element.area == area) {
                region = element
            }
        });
        //console.log(area,region)
        if (!region) {
            return UIUtils.getIconUIIcon('customization');
        }

        const frame = (region.animated ? rawFrame : Utils.formatNumber(rawFrame, 1))

        let image = null;
        if (!Array.isArray(region.src)) {
            const src = region.src.replace('{frame}', frame)
            image = new PIXI.Sprite.from(src)
            if(region.anchor){
                image.anchor = region.anchor
            }
            if(region.iconSize){
                image.scale.set(Utils.scaleToFit(image, region.iconSize));
            }
        } else {
            const iconContainer = new PIXI.Container();
            region.src.forEach(srcSub => {
                const src = srcSub.replace('{frame}', frame) + (region.animated ? "01" : "")

                const sprite = new PIXI.Sprite.from(src);
                iconContainer.addChildAt(sprite, 0)
            });
            image = iconContainer;
            image.scale.set(Utils.scaleToFit(image, region.iconSize));
        }
        if(region.pivot){
            image.pivot = region.pivot
        }
        return image
    }
    resize(res, newRes) {
        this.sectionList.x = 20;

        if (Game.IsPortrait) {

            this.rebuildPortraitScrollers()
            this.piecesScroller.x = Game.Borders.width / 2 - this.piecesScroller.rect.w / 2 + 80
            this.piecesScroller.y = Game.Borders.height - (this.piecesScroller.rect.h * this.piecesScroller.scale.y) - 20
            this.sectionList.y = Game.Borders.height - this.sectionList.h * this.sectionList.scale.y - 20
            this.randomCustomization.x = this.piecesScroller.x - 10
            this.randomCustomization.y = this.piecesScroller.y - this.randomCustomization.height - 50

        } else {
            this.rebuildLandscapeScroller()
            this.colorContainerHairScroller.scale.set(Math.min(1, Game.Borders.width / this.colorContainerHairScroller.w / 2));
            this.piecesScroller.x = Game.Borders.width - this.piecesScroller.rect.w - 20
            this.piecesScroller.y = Game.Borders.height - (this.piecesScroller.rect.h * this.piecesScroller.scale.y) - 20
            this.sectionList.y = Game.Borders.height - this.sectionList.h * this.sectionList.scale.y - 20
            this.colorContainerHairScroller.y = Game.Borders.height - (this.colorContainerHairScroller.h * this.colorContainerHairScroller.scale.y) - 20
            let middle = Game.Borders.width - this.piecesScroller.rect.w - (this.colorContainerHairScroller.w * this.colorContainerHairScroller.scale.x) - 40
            this.colorContainerHairScroller.x = Math.min(middle, Game.Borders.width / 2 - this.colorContainerHairScroller.w / 2)

            this.randomCustomization.x = this.piecesScroller.x - this.randomCustomization.width
            this.randomCustomization.y = this.piecesScroller.y - this.randomCustomization.height / 2 - 15

        }

        this.sectionListName.scale.set(this.sectionList.scale.x)
        this.sectionListName.x = this.sectionList.x + 75
        this.sectionListName.y = this.sectionList.y + 20


        this.topBlocker.width = Game.Borders.width
        this.topBlocker.height = Game.Borders.height / 2
        this.topBlocker.y = Game.Borders.height / 2



    }
    rebuildPortraitScrollers() {
        this.sectionList.scale.set(1)
        this.sectionListName.visible = false

        this.piecesScroller.removeAllItems();
        this.piecesScroller.scale.set(1.5)
        this.piecesScroller.gridDimensions.j = Math.floor((Game.Borders.width - 90) / this.piecesScroller.scale.x / 100)
        this.piecesScroller.resize({ w: Game.Borders.width - 80, h: ((Game.Borders.height / 2) / this.piecesScroller.scale.y - 50) }, { width: 100, height: 100 })
        this.piecesScroller.addItens(this.currentShowingItems)



        if (this.currentShowingColors.length <= 0) {
            this.colorContainerHairScroller.visible = false;
            this.colorContainerHairScroller.scale.set(1);

            return;
        }
        this.colorContainerHairScroller.w = 60
        this.colorContainerHairScroller.h = this.currentShowingColors.length * 62
        this.colorContainerHairScroller.updateVerticalList();
        let scale = Utils.scaleToFit(this.colorContainerHairScroller, (this.piecesScroller.y - 40))
        this.colorContainerHairScroller.scale.set(scale)
        this.colorContainerHairScroller.y = 20
        this.colorContainerHairScroller.x = Game.Borders.width - (this.colorContainerHairScroller.w * this.colorContainerHairScroller.scale.x) - 40


    }

    rebuildLandscapeScroller() {
        this.piecesScroller.scale.set(1)
        this.sectionListName.visible = true

        this.colorContainerHairScroller.h = 60
        this.colorContainerHairScroller.w = this.currentShowingColors.length * 62
        this.colorContainerHairScroller.updateHorizontalList();

        this.piecesScroller.removeAllItems();
        this.piecesScroller.gridDimensions.j = 3
        this.piecesScroller.resize({ w: 300, h: 570 }, { width: 100, height: 100 }, { x: 7.5, y: 7.5 })
        this.piecesScroller.addItens(this.currentShowingItems)

        this.sectionList.scale.set(0.75)

    }
    aspectChange(isPortrait) {

        if (isPortrait) {
            this.rebuildPortraitScrollers();
        } else {
            this.rebuildLandscapeScroller();

        }
    }
}
