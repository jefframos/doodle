import * as PIXI from 'pixi.js';

import InteractableView from '../../../view/card/InteractableView';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';
import signals from 'signals';

export default class RouletteSlotView extends PIXI.Container {
    constructor(id) {
        super();

        this.id = id;
        this.slotHeight = 150;
        this.panelHeight = this.slotHeight * 2;
        this.background = new PIXI.Sprite.from('single-slot')
        this.addChild(this.background);

        this.background.width = 150
        this.background.height = this.panelHeight

        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.stripContainer = new PIXI.Container();
        this.container.addChild(this.stripContainer);


        this.containerMask = UIUtils.getRect(0xFF0455, 150, this.panelHeight)
        this.container.addChild(this.containerMask);
        this.container.mask = this.containerMask;

        InteractableView.addMouseClick(this, () => {
            this.onSlotSelected.dispatch()
        })

        this.midOffset = this.slotHeight * 0.5
        this.onSlotSelected = new signals.Signal();
        this.onFinishSpin = new signals.Signal();
        this.totalImages = 3;

        this.offset = 0;
        this.prizes = [];
        this.sprites = [];


        this.normal = 0;

        this.curveTimer = 3;
        this.curveCurrentTime = 0;


        this.spinSpeed = 1500;

        this.centerDataIndex = 0;


        this.baseGrad = new PIXI.Sprite.from('base-gradient')
        this.baseGrad.scale.set(Utils.scaleToFit(this.baseGrad, 150))
        this.baseGrad.scale.y *= 0.5
        this.topGrad = new PIXI.Sprite.from('base-gradient')
        this.topGrad.scale.set(Utils.scaleToFit(this.topGrad, 150))
        this.topGrad.scale.y *= -0.5
        this.topGrad.anchor.y = 1

        this.baseGrad.y = this.panelHeight - this.baseGrad.height
        this.container.addChild(this.baseGrad);
        this.container.addChild(this.topGrad);

        this.baseGrad.tint = this.topGrad.tint = 0x5533aa;
        this.baseGrad.blendMode = this.topGrad.blendMode = PIXI.BLEND_MODES.OVERLAY

        this.avoid = [];
        this.force = -1

    }
    addSlotImagesList(prizes) {
        this.prizes = prizes;

        this.currentSpotId = Math.floor(Math.random() * this.prizes.length)

        while (this.stripContainer.children.length) {
            this.stripContainer.removeChildAt(0);
        }

        this.sprites = [];

        for (let index = 0; index < this.totalImages; index++) {
            const element = this.prizes[(this.currentSpotId + index) % this.prizes.length];
            const sprite = new PIXI.Sprite.from(element.icon);
            sprite.y = index * this.slotHeight - this.slotHeight
            this.sprites.push(sprite);
            sprite.scale.set(Utils.scaleToFit(sprite, 100))
            sprite.anchor.set(0.5);
            sprite.x = 75
            this.stripContainer.addChild(sprite);
        }
        this.offset = this.slotHeight * 0.5
    }
    spin(time = 3, force = -1, avoid = []) {

        this.avoid = avoid;
        this.force = force;
        TweenLite.killTweensOf(this)
        this.offset = Math.random() * this.slotHeight

        this.spinning = true;

        this.spinSpeed = 2000 + Math.random() * 200;

        this.curveTimer = time + Math.random();
        this.curveCurrentTime = 0;
    }
    endState() {
        this.spinning = false;
        const distNormal = Math.max(0.2, Utils.distance(this.offset, 0, this.slotHeight, 0) / this.slotHeight)
        TweenLite.to(this, (3 * distNormal), { offset: this.slotHeight * 0.5, ease: Elastic.easeOut })
        this.centerDataIndex = (this.currentSpotId + 1) % this.prizes.length;     
        console.log(this.id, this.centerDataIndex)   
        this.onFinishSpin.dispatch(this.id, this.centerDataIndex);
    }
    shouldContinueSpinning() {

        if (this.force >= 0) {

            let adjusted = this.force - 1
            if (adjusted < 0) {
                adjusted = this.prizes.length - 1;
            }
            return this.currentSpotId != adjusted;
        }
        if (this.avoid.length > 0) {
            if (this.avoid.includes(this.currentSpotId)) {
                return false;
            }
        }
        return true;
    }
    update(delta) {
        if (this.spinning) {
            let shouldStop = false;
            let shouldEnd = false;
            if (this.curveCurrentTime >= this.curveTimer) {
                shouldEnd = true;
                
                if (this.avoid.length == 0 && this.force < 0 || !this.shouldContinueSpinning()) {
                    shouldStop = true;
                    this.endState();
                }
            }

            if (!shouldStop) {
                this.curveCurrentTime += delta;
                this.normal = shouldEnd ? 1 : this.curveCurrentTime / this.curveTimer;
                this.offset += delta * this.spinSpeed * Utils.easeOutQuad(1 - (this.normal * 0.75));
            }
        }
        if (this.offset > this.slotHeight) {
            this.offset %= this.slotHeight
            this.currentSpotId--;
            this.currentSpotId %= this.prizes.length
            if (this.currentSpotId < 0) {
                this.currentSpotId = this.prizes.length - 1
            }
            this.updateSpritesTextures()
        }
        for (let index = 0; index < this.sprites.length; index++) {
            this.sprites[index].y = index * this.slotHeight + this.offset - this.panelHeight * 0.5 + this.midOffset
        }

    }
    updateSpritesTextures() {
        for (let index = 0; index < this.totalImages; index++) {
            const image = this.prizes[(this.currentSpotId + index) % this.prizes.length];

            const sprite = this.sprites[index]
            sprite.texture = PIXI.Texture.from(image.icon)
            sprite.scale.set(Utils.scaleToFit(sprite, 100))

        }
    }
}