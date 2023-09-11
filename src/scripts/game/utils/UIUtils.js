import BaseButton from "../components/ui/BaseButton";
import BodyPartySlot from "../components/ui/BodyPartySlot";
import ColorButton from "../components/ui/ColorButton";
import ColorSlot from "../components/ui/ColorSlot";
import InteractableView from "../view/card/InteractableView";
import Pool from "../core/utils/Pool";
import UIList from "../ui/uiElements/UIList";
import Utils from "../core/utils/Utils";

export default class UIUtils {
    constructor() {

    }
    static baseButtonTexture = 'square_button';
    static baseBorderButtonTexture = 'square_button_border';
    static baseTabTexture = 'tab_button';
    static colorset = {
        rarity: [0xC3C3C3, 0xABFD0F, 0x49A1F5, 0xBE67F1, 0xFA657D, 0xFBF658],
        skin: [0xF6E4DE, 0xF8D8CB, 0xF9C6B2, 0xFDB193, 0xBB7F6A, 0xA05940, 0x964C32, 0x612E1B, 0x4BCC3E, 0x6AE95D, 0x87F37C, 0xADFFA5, 0x419AC0, 0x5DBFE9, 0x86CEEE, 0xC0EBFD],
        clothes: [0xFFFFFF, 0xEC1A62, 0x2BFF00, 0xDF65F8, 0x4260A5, 0xAA968F, 0x3C3C3C, 0x2E4476],
        hair: [0xAA968F, 0x3C3C3C, 0xFBE574, 0x856036, 0xF86C5A, 0x2BFF00, 0xDF65F8, 0xEC1A62, 0xFFFFFF],
    }
    static getCircle(color = 0xFF0000, radius = 20) {
        return new PIXI.Graphics().beginFill(color).drawCircle(0, 0, radius)
    }
    static getRect(color = 0xFF0000, width = 20, height = 20) {
        return new PIXI.Graphics().beginFill(color).drawRect(0, 0, width, height)
    }
    static getCloseButton(callback) {
        const button = new BaseButton(UIUtils.baseButtonTexture + '_0011', 100, 100);
        InteractableView.addMouseUp(button, () => { if (callback) callback() })
        button.addIcon(UIUtils.getIconUIIcon('close'), 70)

        button.scale.set(Utils.scaleToFit(button, 60))
        return button;
    }

    static getPrimaryButton(callback, label, icon) {
        const button = new BaseButton(UIUtils.baseButtonTexture + '_0001', 100, 100);
        InteractableView.addMouseUp(button, () => { if (callback) callback() })
        if (icon) {
            button.addIcon(icon)
        }
        if (label) {
            UIUtils.addLabel(button, label)
        }
        return button;
    }

    static getPrimaryShapelessButton(callback, label, icon) {
        const button = new BaseButton(null, 150, 150);
        InteractableView.addMouseUp(button, () => { if (callback) callback() })

        const warningIcon = new PIXI.Sprite.from(UIUtils.getIconUIIcon('warning'));
        warningIcon.scale.set(Utils.scaleToFit(warningIcon, 30))
        warningIcon.anchor.set(0.5)
        warningIcon.x = 10
        warningIcon.y = 30
        button.addChild(warningIcon)
        button.warningIcon = warningIcon;
        warningIcon.visible = false;

        if (icon) {
            button.addIcon(icon, 90)
        }
        if (label) {
            UIUtils.addLabel(button, label, { fontSize: 24 })

            warningIcon.x = button.text.x + button.text.width / 2 + 17
            warningIcon.y = button.text.y+ button.text.height / 2

        }
        return button;
    }
    static getMainPlayButton(callback, label, icon) {
        const button = new BaseButton(UIUtils.baseBorderButtonTexture + '_0001', 300, 100);
        InteractableView.addMouseUp(button, () => { if (callback) callback() })
        if (icon) {
            button.addIcon(icon, 80, { x: 0.5, y: 0.5 }, { x: 80, y: 0 })
        }
        if (label) {
            UIUtils.addLabel(button, label, { fontSize: 48 }, icon ? { x: -50, y: 0 } : { x: 0, y: 0 })
        }
        return button;
    }
    static getPrimaryLabel(label, params = {}) {
        const style = {}
        for (const key in window.LABELS.LABEL1) {
            style[key] = window.LABELS.LABEL1[key];
        }

        for (const key in params) {
            style[key] = params[key];
        }
        const textLabel = new PIXI.Text(label, style)
        textLabel.text = label;
        return textLabel;
    }
    static getTertiaryLabel(label, params = {}) {
        const style = {}
        for (const key in window.LABELS.LABEL3) {
            style[key] = window.LABELS.LABEL3[key];
        }

        for (const key in params) {
            style[key] = params[key];
        }
        const textLabel = new PIXI.Text(label, style)
        textLabel.text = label;
        return textLabel;
    }
    static getSpecialLabel1(label, params = {}) {
        const textLabel = new PIXI.Text(label, {
            align: "center",
            fill: [
                "#ff8652",
                "#f2b650"
            ],
            dropShadow: true,
            dropShadowAngle: 1.5,
            dropShadowDistance: 3,
            fillGradientType: 1,
            fontSize: 34,
            strokeThickness: 3,
            wordWrap: true,
            wordWrapWidth: 300,
            fontFamily: window.MAIN_FONT
        })
        for (const key in params) {
            textLabel.style[key] = params[key];
        }
        return textLabel;
    }

    static getSpecialLabel2(label, params = {}) {
        const textLabel = new PIXI.Text(label, {
            align: "center",
            fill: [
                "#FFD91C",
                "#1CFFFA"
            ],
            dropShadow: true,
            dropShadowAngle: 1.5,
            dropShadowDistance: 3,
            fillGradientType: 1,
            fontSize: 24,
            strokeThickness: 3,
            wordWrap: true,
            wordWrapWidth: 300,
            fontFamily: window.MAIN_FONT
        })
        for (const key in params) {
            textLabel.style[key] = params[key];
        }
        return textLabel;
    }
    static getSecondaryLabel(label, params = {}) {
        const textLabel = new PIXI.Text(label, window.LABELS.LABEL1)
        for (const key in params) {
            textLabel.style[key] = params[key];
        }
        return textLabel;
    }
    static addLabel(button, label, params = {}, offset = { x: 0, y: 0 }) {
        const textLabel = new PIXI.Text(label, window.LABELS.LABEL1)

        for (const key in params) {
            textLabel.style[key] = params[key];
        }
        button.addLabelOnCenter(textLabel, offset)
        return textLabel;
    }
    static getBodyPartySlot(callback, label, icon) {

        const button = new BodyPartySlot()//Pool.instance.getElement(BodyPartySlot)

        button.addShape(UIUtils.baseButtonTexture + '_0009', 85, 85);

        if (!button.warningIcon) {

            const warningIcon = new PIXI.Sprite.from(UIUtils.getIconUIIcon('warning'));
            warningIcon.scale.set(Utils.scaleToFit(warningIcon, 30))
            warningIcon.anchor.set(0.5)
            warningIcon.x = 80
            warningIcon.y = 5
            button.addChild(warningIcon)
            button.warningIcon = warningIcon;
            warningIcon.visible = false;
        }

        if (!button.mouseUpCallback && callback) {
            button.mouseUpCallback = callback;
            let cb = InteractableView.addMouseUp(button, () => { button.mouseUpCallback(button) })
        }
        if (icon) {
            button.addIcon(icon)
        }
        if (label) {
            UIUtils.addLabel(button, label)
        }

        return button;
    }


    static getColorSlot(callback, color = 0, width = 85, height = 85) {

        const button = Pool.instance.getElement(ColorSlot)

        button.addShape(UIUtils.baseButtonTexture + '_0009', width, height);
        button.setColor(color)
        if (!button.mouseUpCallback && callback) {
            button.mouseUpCallback = callback;
            let cb = InteractableView.addMouseUp(button, () => { button.mouseUpCallback(button) })
        }

        return button;
    }
    static getPrimaryLabelButton(callback, label, icon) {
        const button = new BaseButton(UIUtils.baseButtonTexture + '_0001', 120, 65);
        button.setActiveTexture(UIUtils.baseButtonTexture + '_0002')
        InteractableView.addMouseUp(button, () => { if (callback) callback(button) })
        if (icon) {
            button.addIcon(icon)
        }
        if (label) {
            UIUtils.addLabel(button, label, { fontSize: 24, fill: 0xFFFFFF })
        }
        return button;
    }
    static getPrimaryShopButton(callback, label, icon) {
        const button = new BaseButton(UIUtils.baseButtonTexture + '_0001', 120, 65);
        button.setActiveTexture(UIUtils.baseButtonTexture + '_0002')
        InteractableView.addMouseUp(button, () => { if (callback) callback(button) })



        const buttonList = new UIList();

        buttonList.w = 120
        buttonList.h = 65

        button.labelButtonValue = UIUtils.getPrimaryLabel('free')
        button.currencyButtonIcon = new PIXI.Sprite.from(UIUtils.getIconUIIcon('video'))

        buttonList.addElement(button.labelButtonValue, { align: 0.8, listScl: 0.5, fitHeight: 0.7 })
        buttonList.addElement(button.currencyButtonIcon, { align: 0.2, listScl: 0.5, fitHeight: 0.7 })

        button.addChild(buttonList)
        button.buttonListContent = buttonList;

        buttonList.updateHorizontalList()




        return button;
    }
    static getPrimaryVideoButton(callback, label) {
        const button = new BaseButton(UIUtils.baseButtonTexture + '_0001', 120, 65);
        button.setActiveTexture(UIUtils.baseButtonTexture + '_0002')
        InteractableView.addMouseUp(button, () => { if (callback) callback(button) })


        const buttonList = new UIList();

        buttonList.w = 120
        buttonList.h = 65


        const priceLabel = UIUtils.getPrimaryLabel('free')
        button.priceLabel = priceLabel;
        buttonList.addElement(priceLabel, { align: 0.8, scaleContentMax: true, fitHeight: 0.8 })
        buttonList.addElement(new PIXI.Sprite.from(UIUtils.getIconUIIcon('video')), { align: 0.2, scaleContentMax: true, fitHeight: 0.7, listScl: 0.4 })

        button.addChild(buttonList)
        button.buttonListContent = buttonList;

        buttonList.updateHorizontalList()
        return button;
    }

    static getPrimaryLabelTabButton(callback, label, icon) {
        const button = new BaseButton(UIUtils.baseTabTexture + '_0003', 170, 65);
        button.setPadding(20, 20, 70, 70)
        InteractableView.addMouseUp(button, () => { if (callback) callback(button) })
        if (icon) {
            button.addIcon(icon)
        }
        if (label) {
            UIUtils.addLabel(button, label, { fontSize: 18, fill: 0xFFFFFF, strokeThickness: 3 }, { x: -5, y: -5 })
        }
        return button;
    }
    static getPrimaryLargeLabelButton(callback, label, icon) {
        const button = new BaseButton(UIUtils.baseButtonTexture + '_0001', 280, 100);
        button.setActiveTexture(UIUtils.baseButtonTexture + '_0002')
        InteractableView.addMouseUp(button, () => { if (callback) callback(button) })
        if (icon) {
            button.addIcon(icon, 60, { x: 0.5, y: 0.5 }, { x: 80, y: 0 })
        }
        if (label) {
            if (icon) {
                UIUtils.addLabel(button, label, { fontSize: 40 }, { x: -30, y: 0 })
            } else {
                UIUtils.addLabel(button, label, { fontSize: 40 })
            }
        }
        return button;
    }
    static getBodyTypeLabelButton(callback, label, icon) {
        const button = new BaseButton(UIUtils.baseButtonTexture + '_0009', 80, 80);
        button.setActiveTexture(UIUtils.baseButtonTexture + '_0010')
        InteractableView.addMouseUp(button, () => { if (callback) callback(button) })

        const warningIcon = new PIXI.Sprite.from(UIUtils.getIconUIIcon('warning'));
        warningIcon.scale.set(Utils.scaleToFit(warningIcon, 30))
        warningIcon.anchor.set(0.5)
        warningIcon.x = 75
        warningIcon.y = 5
        button.addChild(warningIcon)
        button.warningIcon = warningIcon;
        warningIcon.visible = false;


        if (icon) {
            button.addIcon(icon)
        }
        if (label) {
            UIUtils.addLabel(button, label, { strokeThickness: 0, fontSize: 18, fill: 0 })
        }
        return button;
    }
    static getColorButton(callback, color = 0, width = 85, height = 85) {

        const button = Pool.instance.getElement(ColorButton)

        button.addShape(UIUtils.baseButtonTexture + '_0009', width, height);
        button.setColor(color)
        if (!button.mouseUpCallback && callback) {
            button.mouseUpCallback = callback;
            let cb = InteractableView.addMouseUp(button, () => { button.mouseUpCallback(button); })
        }

        return button;
    }
    static getAttributShort(attribute) {
        switch (attribute) {
            case 'basePower':
                return 'POW'
            case 'baseFrequency':
                return 'FREQ'
            case 'baseBulletSpeed':
                return 'BSPD'
            case 'baseBrustFireAmount':
                return 'AMMO'
            case 'baseAmount':
                return 'AMMO'
            case 'baseDefense':
                return 'DEF'
            case 'baseSpeed':
                return 'SPD'
            case 'basePiercing':
                return 'PIERCING'
            case 'baseHealth':
                return 'HP'
            case 'baseEvasion':
                return 'EVD'
            case 'critical':
            case 'baseCritical':
                return 'CRIT'
            case 'baseCollectionRadius':
                return 'RAD'
            case 'baseItemHeal':
                return 'HEAL'
            case 'baseTotalMain':
                return 'WEAPON'
            case 'coin':
                return 'COINS'
            case 'heal':
                return 'HEAL'
            case 'Damage':
                return 'DMG'
        }
        console.log('NO Short For', attribute)

        return attribute
    }
    static getIconByAttribute(attribute) {
        switch (attribute) {
            case 'basePower':
                return 'ico_power'
            case 'baseFrequency':
                return 'ico_frequency'
            case 'baseBulletSpeed':
                return 'ico_bullet_speed'
            case 'baseBrustFireAmount':
                return 'ico_amount'
            case 'baseAmount':
                return 'ico_amount'
            case 'baseDefense':
                return 'ico_defense'
            case 'baseSpeed':
                return 'ico_speed'
            case 'baseHealth':
                return 'heart'
        }


        console.log('NO Icon For', attribute)
        return 'icon-help'
    }
    static getIconUIIcon(type) {
        switch (type) {
            case 'companion':
                return 'pet-icon'
            case 'map':
                return 'ico_map'
            case 'coin-bag':
                return 'money-bag'
            case 'enemy-kill':
                return 'enemy-icon'
            case 'prize':
                return 'ico_slot-machine'
            case 'shop':
                return 'ico_shop'
            case 'customization':
                return 'customize-icon'
            case 'battle':
                return 'play-level-icon'
            case 'warning':
                return 'info'
            case 'video':
                return 'video-icon'
            case 'softCurrency':
                return 'coin1'
            case 'hardCurrency':
                return 'hard-currency'
            case 'specialCurrency':
                return 'special-currency'
            case 'wearable':
                return 'customize-icon'
            case 'close':
                return 'x-icon'
            case 'inGameChest':
                return 'ingame-item-chest-0001'
            case 'chestPin':
                return 'chestPin'
            case 'chest':
                return 'item-chest-0001'
            case 'heal':
                return 'burguer'
            case 'bomb':
                return 'dynamite'
            case 'magnet':
                return 'magnet'
            case 'healCard':
                return 'burguer'
            case 'coinsCard':
                return 'money-bag'
            case 'wardrobe':
                return 'wardrobe-icon'
            case 'ingame-timer':
                return 'watch-icon'
        }


        console.log(type)
        return 'interrogation'
    }

}