import * as PIXI from 'pixi.js';

import Game from '../../../Game';
import signals from 'signals';

export default class MainScreenModal extends PIXI.Container {
    constructor() {
        super();

        this.container = new PIXI.Container();
        this.addChild(this.container)
        this.container.interactive = true;


        this.modalTexture = 'modal_container0001';
        this.addBackgroundShape();
        this.contentContainer = new PIXI.Container();
        this.container.addChild(this.contentContainer)

        this.onHide = new signals.Signal();
        this.onShow = new signals.Signal();


    }
    addScreenBlocker(){
        this.blocker = new PIXI.Sprite.from('base-gradient');
        this.blocker.width = 10000
        this.blocker.height = 10000
        this.blocker.interactive = true;
        this.blocker.tint = 0;
        this.blocker.alpha = 0.25;
        this.addChildAt(this.blocker,0);
    }
    addBackgroundShape() {
        if(!this.modalTexture){
            this.infoBackContainer = new PIXI.Container();
        }else{

            this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from(this.modalTexture), 20, 20, 20, 20);
        }
        this.container.addChild(this.infoBackContainer);
    }
    get isOpen() {
        return this.visible;
    }
    show() {
        this.recenterContainer();

        this.visible = true;
        this.container.alpha = 0.5;
        this.container.scale.set(0.1, 0.5);

        TweenLite.killTweensOf(this.container)
        TweenLite.killTweensOf(this.container.scale)

        TweenLite.to(this, 0.25, {alpha:1})
        TweenLite.to(this.container, 0.25, { alpha: 1 })
        TweenLite.to(this.container.scale, 0.75, { x: 1, y: 1, ease: Elastic.easeOut })
        this.onShow.dispatch(this)
    }
    hide() {

        TweenLite.killTweensOf(this)
        TweenLite.killTweensOf(this.container)
        TweenLite.killTweensOf(this.container.scale)


        TweenLite.to(this, 0.25, {alpha:0})
        TweenLite.to(this.container, 0.25, {
            alpha: 0, onComplete: () => {
                this.visible = false;
            }
        })

        this.onHide.dispatch(this)
    }
    start() {

    }
    resize(res, newRes) {

        if (this.infoBackContainer) {

            this.infoBackContainer.width = Game.Borders.width - 80
            this.infoBackContainer.height = Game.Borders.height - 80 - 60
        }

        this.recenterContainer();

    }
    recenterContainer() {
        this.container.pivot.x = this.container.width / 2
        this.container.x = Game.Borders.width/ 2
        
        this.container.pivot.y = this.container.height / 2
        this.container.y = Game.Borders.height / 2

    }
    update(delta) {

    }
    aspectChange(isPortrait) {

        if (isPortrait) {
        } else {

        }
    }
}