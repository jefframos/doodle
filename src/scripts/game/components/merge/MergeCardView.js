import * as PIXI from 'pixi.js';

import BaseButton from '../ui/BaseButton';
import InteractableView from '../../view/card/InteractableView';
import LoadoutCardView from '../deckBuilding/LoadoutCardView';
import UIUtils from '../../utils/UIUtils';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class MergeCardView extends LoadoutCardView {
    constructor(texture = UIUtils.baseButtonTexture + '_0006', width = 120, height = 120) {
        super(texture, width, height)
        this.locked = false;
        this.unhighlight();

        this.lockIcon = new PIXI.Sprite.from('icon_confirm')
        this.addChild(this.lockIcon)
        this.lockIcon.visible = false

        //this.hideLevelLabel();
    }

    highlight() {

    }
    unhighlight() {

    }
    lock() {
        this.locked = true;
        this.lockIcon.visible = true;
        this.lockIcon.x = this.baseWidth - this.lockIcon.width - 10
        this.lockIcon.y = 10
    }
    unlock() {
        this.locked = false;
        this.lockIcon.visible = false;
    }

}