import * as PIXI from 'pixi.js';

import MainScreenModal from '../MainScreenModal';
import AchievmentView from './AchievmentView';
import ListScroller from '../../../ui/uiElements/ListScroller';
import UIList from '../../../ui/uiElements/UIList';
import Game from '../../../../Game';

export default class AchievmentsContainer extends MainScreenModal {
    constructor() {
        super();
                
        this.achievmentsContainer = new UIList();
        this.achievmentsContainer.w = 500;
        this.achievmentsContainer.h = 0;
        
        this.scroller = new ListScroller({ w: 500, h: 500 }, { width: 75, height: 75 }, { x: 0, y: 0 })
        this.scroller.itemHeight = 500
        
        this.container.addChild(this.scroller)
        
        for (let index = 0; index < 6; index++) {
            let test = new AchievmentView(400,100);
            this.achievmentsContainer.addElement(test)
            this.achievmentsContainer.h += 120
        }

        this.achievmentsContainer.updateVerticalList();
        console.log(this.achievmentsContainer)
        this.scroller.addItens([this.achievmentsContainer])

    }

    resize(res, newRes) {

        this.infoBackContainer.width = 500
        this.infoBackContainer.height = Game.Borders.height - this.container.y + 20//- 40
        
        this.scroller.resize({ w: this.infoBackContainer.width, h: this.infoBackContainer.height }, { w: this.achievmentsContainer.width, h: this.achievmentsContainer.height })
       this.scroller.itemHeight = this.achievmentsContainer.height + 80
       this.recenterContainer()
    }
    recenterContainer() {
        this.container.pivot.x = this.container.width / 2
        this.container.x = Game.Borders.width / 2

        this.container.pivot.y = 0//this.container.height / 2
        this.container.y = 150

    }
}