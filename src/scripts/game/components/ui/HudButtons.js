import BaseButton from "./BaseButton";
import Game from "../../../Game";
import GameObject from "../../core/gameObject/GameObject";
import GameView from "../../core/view/GameView";
import RenderModule from "../../core/modules/RenderModule";
import UIList from "../../ui/uiElements/UIList";
import UIUtils from "../../utils/UIUtils";
import signals from "signals";

export default class HudButtons extends GameObject {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.UILayerOverlay;
        this.gameView.view = new PIXI.Container();


        //this.gameView.view.y = Game.Screen.height / 2 - 40


        this.buttonSize = 80
        this.buttonsList = new UIList();
        this.buttonsList.w = 100
        this.buttonsList.h = this.buttonSize
        this.gameView.view.addChild(this.buttonsList)

        // this.bl.x = Game.Borders.bottomLeft.x
        // this.bl.y = Game.Borders.bottomLeft.y
        
        if (!Game.Debug.debug) {
            this.gameView.view.visible = false;
        }
    }
    update() {

        this.buttonsList.x = Game.Borders.bottomLeft.x + 20
        this.buttonsList.y = Game.Borders.bottomLeft.y - this.buttonSize - 80
    }
    addCallbackButton(callback, texture =  UIUtils.baseButtonTexture+'_0006') {
        this.openDeckButton = new BaseButton(texture, this.buttonSize, this.buttonSize);
        this.buttonsList.addElement(this.openDeckButton)
        this.openDeckButton.onButtonClicked.add(() => {
            callback();
        })
        this.buttonsList.w = this.buttonsList.elementsList.length * (this.buttonSize + 20)
        this.buttonsList.updateHorizontalList();

    }
    destroy(){
        this.buttonsList.removeAllElements();
        super.destroy()
    }
}