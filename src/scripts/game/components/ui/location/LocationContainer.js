import * as PIXI from 'pixi.js';

import Game from '../../../../Game';
import MainScreenModal from '../MainScreenModal';

export default class LocationContainer extends MainScreenModal {
    constructor() {
        super();

    }
    addBackgroundShape() {
        this.modalTexture = 'modal_container0002';
        super.addBackgroundShape();

    }
    resize(res, newRes) {

        if (this.infoBackContainer) {

            this.infoBackContainer.width = Game.Borders.width - 80
            this.infoBackContainer.height = Game.Borders.height /2 - 80

            this.infoBackContainer.x = 50
            this.infoBackContainer.y = Game.Borders.height - this.infoBackContainer.height - 50
        }

        this.contentContainer.x = 50
        this.contentContainer.y = Game.Borders.height - this.infoBackContainer.height - 50

    }
    show() {
        this.visible = true;
        this.container.visible = true;
        this.container.alpha = 0.5;
        TweenLite.killTweensOf(this.container)
        TweenLite.killTweensOf(this.container.scale)

        TweenLite.to(this.container, 0.25, {alpha:1})
        this.onShow.dispatch(this)
    }
}