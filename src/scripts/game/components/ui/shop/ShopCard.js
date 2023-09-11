import * as PIXI from 'pixi.js';

import MainMenu from '../../../screen/MainMenu';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';

export default class ShopCard extends PIXI.Container {
    constructor(callback, videoCallback, texture = UIUtils.baseButtonTexture + '_0006', width = 100, height = 150, title = '-', hasVideo = true) {
        super()

        this.safeShape = new PIXI.NineSlicePlane(PIXI.Texture.from(texture), 25, 25, 25, 25);
        this.safeShape.width = width
        this.safeShape.height = height
        this.addChild(this.safeShape);


        this.titleBox = new PIXI.NineSlicePlane(PIXI.Texture.from('tile'), 0, 0, 0, 0);
        this.addChild(this.titleBox);
        this.titleBox.width = width + 10
        this.titleBox.height = 37
        this.titleBox.x = -10
        this.titleBox.y = 10
        this.titleBox.alpha = 0
        this.titleBox.blendMode = PIXI.BLEND_MODES.OVERLAY


        this.labelTitle = new PIXI.Text(title, window.LABELS.LABEL1)
        this.addChild(this.labelTitle);
        this.labelTitle.style.fill = 0xFFFFFF
        this.labelTitle.style.wordWrap = true
        this.labelTitle.style.fontSize = 22
        this.labelTitle.anchor.set(0.5)

        this.iconSprite = new PIXI.Sprite();
        // this.iconSprite.anchor.set(0.5)
        // this.addChild(this.iconSprite);

        this.iconList = new UIList();
        this.iconList.h = 50
        this.iconList.w = 80


        this.descriptionList = new UIList();
        this.descriptionList.h = 50
        this.descriptionList.w = 80


        this.buttonsList = new UIList();
        this.buttonsList.h = 50
        this.buttonsList.w = 50

        this.messageList = new UIList();
        this.messageList.h = 50
        this.messageList.w = 50


        this.centerOffset = { x: 50, y: 0 }


        this.videoButton = UIUtils.getPrimaryVideoButton((button) => {
            videoCallback();
            // this.videoButton.visible = false;
        }, 'Free')

        this.videoButton.updateBackTexture(UIUtils.baseButtonTexture + '_0002')

        if (hasVideo) {
            this.buttonsList.addElement(this.videoButton, { fitHeight: 1, listScl: 1 })
        }


        this.confirmButton = UIUtils.getPrimaryShopButton((button) => {
            callback();
        }, title)


        this.hasVideo = hasVideo;
        if (hasVideo) {

            //this.buttonsList.addElement(this.confirmButton, { fitWidth:0.9,listScl: 0.7})
        } else {
            this.buttonsList.addElement(this.confirmButton, { fitHeight: 1, listScl: 1 })

        }


        this.buttonsList.updateHorizontalList();
        this.addChild(this.iconList);
        this.addChild(this.descriptionList);
        this.addChild(this.buttonsList);
        this.addChild(this.messageList);

        this.messaLabel = UIUtils.getPrimaryLabel({})
        this.messageList.addElement(this.messaLabel, { fitWidth: 0.8, scaleContentMax: true, listScl: 1 })
        this.messageList.visible = false;


        this.currencyIcon = new PIXI.Sprite.from(UIUtils.getIconUIIcon('softCurrency'))
        this.description = UIUtils.getPrimaryLabel('x50')
        this.iconList.addElement(this.iconSprite, { align: 0.5, fitHeight: 1.2,  })
        this.descriptionList.addElement(this.description, { align: 0.5, fitHeight: 1, scaleContentMax: true })
        this.descriptionList.updateHorizontalList();
        this.iconList.updateHorizontalList();
    }
    removeDescription() {
        this.descriptionList.removeElement(this.description)
        this.iconList.removeElement(this.iconSprite)
        this.iconList.addElement(this.iconSprite, { align: 0.5, fitHeight: 2, listScl: 1 })
        this.centerOffset.y = -20
        this.centerOffset.x = 0

    }
    restore() {
        if (this.hasVideo) {
            this.videoButton.visible = true;
        }
    }
    setValue(currencyType, value, customIconScale = 1.5) {
        this.iconSprite.fitHeight = customIconScale
        this.confirmButton.currencyButtonIcon.texture = PIXI.Texture.from(UIUtils.getIconUIIcon(currencyType))
        this.confirmButton.labelButtonValue.text = value;
        this.descriptionList.updateHorizontalList();
        this.iconList.updateHorizontalList();
        //this.price.text = value;
        //this.confirmButton.fitLabel(1)
    }
    updateButtonTitle(title) {
        this.description.text = title;
        this.descriptionList.updateHorizontalList();
    }
    disableWithMessage(message) {

        this.messaLabel.text = message
        this.messageList.updateHorizontalList();

        this.buttonsList.visible = false;
        this.messageList.visible = !this.buttonsList.visible;
    }
    enable() {
        this.buttonsList.visible = true;
        this.messageList.visible = !this.buttonsList.visible;
    }
    setIcon(texture, addScale = 0) {
        this.addIconScale = addScale;
        this.iconSprite.texture = PIXI.Texture.from(texture);
    }
    resize(width, height) {
        this.safeShape.width = width
        this.safeShape.height = height

        this.titleBox.height = Math.min(40, height * 0.15)

        this.labelTitle.style.wordWrapWidth = width
        this.titleBox.width = width - 20
        this.titleBox.x = 10
        this.labelTitle.y = this.titleBox.y + this.titleBox.height / 2
        this.labelTitle.x = this.titleBox.x + this.titleBox.width / 2


        this.buttonsList.h = height * 0.25

        this.buttonsList.updateHorizontalList();
        this.buttonsList.x = width / 2 - this.buttonsList.w / 2
        this.buttonsList.y = height - this.buttonsList.h - 15



        this.messageList.w = width - 30
        this.messageList.h = height * 0.2

        this.messageList.updateHorizontalList();
        this.messageList.x = width / 2 - this.messageList.w / 2
        this.messageList.y = height - this.messageList.h - 15

        if (width / height < 1.25) {
            this.description.fitHeight = 1
            this.description.fitWidth = 1
            this.descriptionList.h = height * 0.15
        } else {
            this.description.fitHeight = 1
            this.description.fitWidth = 1
            this.descriptionList.h = height * 0.3
        }

        if(this.centerOffset.y != 0){
            this.descriptionList.h = height * 0.3

        }
        this.descriptionList.w = width * 0.9

        this.iconList.w = this.descriptionList.w 
        this.iconList.h = this.descriptionList.h 

        this.descriptionList.updateHorizontalList();
        this.descriptionList.x = width / 2 - this.descriptionList.w / 2 + this.centerOffset.x;
        this.descriptionList.y = height / 2 - this.descriptionList.h / 2 + this.centerOffset.y;

        this.iconList.updateHorizontalList();
        this.iconList.x = width / 2 - this.iconList.w / 2 - this.centerOffset.x;
        this.iconList.y = height / 2 - this.iconList.h / 2 + this.centerOffset.y;


        this.buttonsList.w = width - 30
        // const videow = (this.buttonsList.w * 0.3)*1.5-5
        // const videoh = this.buttonsList.h*1.5-5
        // this.videoButton.resize(videow, videoh)
        // //this.videoButton.resizeIcon( this.buttonsList.h * 0.8)
        // this.videoButton.buttonListContent.w = videow * 0.8
        // this.videoButton.buttonListContent.h = videoh
        // this.videoButton.buttonListContent.updateHorizontalList()

        // this.videoButton.buttonListContent.x = videow / 2 - this.videoButton.buttonListContent.w / 2


        const confirmw = (this.buttonsList.w * (0.9)) * 1.5 - 5 - 5
        const confirmh = this.buttonsList.h * 1.5 - 5
        this.confirmButton.resize(confirmw, confirmh)


        this.confirmButton.buttonListContent.w = confirmw//Math.min(80,confirmw * 0.8)
        this.confirmButton.buttonListContent.h = confirmh * 0.9

        this.confirmButton.buttonListContent.updateHorizontalList()
        this.confirmButton.buttonListContent.x = this.confirmButton.labelButtonValue.width / 2 - this.confirmButton.currencyButtonIcon.width / 2
        this.confirmButton.buttonListContent.y = confirmh / 2 - this.confirmButton.buttonListContent.h / 2

        this.videoButton.resize(confirmw, confirmh)

        this.videoButton.buttonListContent.w = confirmw//Math.min(80,confirmw * 0.8)
        this.videoButton.buttonListContent.h = confirmh * 0.9
        this.videoButton.buttonListContent.updateHorizontalList()
        this.videoButton.buttonListContent.y = confirmh / 2 - this.videoButton.buttonListContent.h / 2
        //this.videoButton.buttonListContent.x = this.videoButton.labelButtonValue.width / 2 - this.videoButton.currencyButtonIcon.width / 2
    }
}