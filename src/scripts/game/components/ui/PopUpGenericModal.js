import * as PIXI from 'pixi.js';

import Game from '../../../Game';
import UIList from '../../ui/uiElements/UIList';
import UIUtils from '../../utils/UIUtils';
import MainScreenModal from './MainScreenModal';

export default class PopUpGenericModal extends MainScreenModal {
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


        
        this.cancelButton = UIUtils.getPrimaryLabelButton(() => {
            this.hide()
        }, 'Cancel')
        this.cancelButton.updateBackTexture('square_button_0006')
        this.cancelButton.resize(180, 60)
        this.infoBackContainer.addChild(this.cancelButton);


        this.modalText = UIUtils.getSpecialLabel2('Collect your prize!', { fontSize: 22 })
        this.modalText.anchor.set(0.5)
        this.modalText.style.fill = 0xFF0000
        this.infoBackContainer.addChild(this.modalText)
        this.hideCloseButton = true;

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

    showInfo(text) {
        this.modalText.text = text;
        this.cancelButton.x = this.infoBackContainer.width / 2 - this.cancelButton.width / 2
        this.cancelButton.y = this.infoBackContainer.height - this.cancelButton.height - 50
    }
    resize(res, newRes) {
        if (this.infoBackContainer) {

            this.infoBackContainer.width = 550
            this.infoBackContainer.height = 250
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

        this.modalText.x = this.infoBackContainer.width / 2
        this.modalText.y = 100


        this.recenterContainer();
    }

    update(delta) {
        if (!this.isOpen) {
            return;
        }
        super.update(delta)
    }
}