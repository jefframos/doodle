import * as PIXI from 'pixi.js';
import Signals from 'signals';
import ListScroller from '../uiElements/ListScroller';
import RecruitCharItem from './RecruitCharItem';
import UIButton1 from './../UIButton1';

export default class StandardPanel1 extends ListScroller {
    constructor(rect = {
        w: 500,
        h: 500
    }, itensPerPage = 5) {

        super(rect, itensPerPage)

        this.backBlocker = new PIXI.Graphics().beginFill(0).drawRect(-config.width*2, -config.height*2, config.width * 4, config.height * 4);
        this.backBlocker.alpha = 0.5;
        this.backBlocker.interactive = true;
        this.backBlocker.buttonMode = true;
        this.addChildAt(this.backBlocker, 0)


        this.backButton = new UIButton1(0, 'icon-close')
        this.backButton.onClick.add(() => {
            this.hide();
            this.onClose.dispatch();
        })
        this.addChild(this.backButton)
        //this.backButton.scale.set(config.height / this.backButton.height * 0.1)
        this.onClose = new Signals();

        this.backButton.x = rect.w
        this.backButton.y = 0

    }

    resetPosition() {
    }
    show() {
        this.visible = true;
        this.resetPosition()
    }

    hide() {
        this.visible = false;
    }
}