import * as PIXI from 'pixi.js';

import Game from '../../Game';
import MainScreenManager from './MainScreenManager';
import TweenMax from 'gsap';
import UIUtils from '../utils/UIUtils';
import Utils from '../core/utils/Utils';
import config from '../../config';

export default class ScreenTransition extends PIXI.Container {
    constructor() {
        super();
        this.container = new PIXI.Container();

        this.addChild(this.container)

        this.blocker = new PIXI.Graphics().beginFill(0).drawRect(-5000, -5000, 10000, 10000)
        this.addChild(this.blocker)
        this.blocker.interactive = true;
        this.blocker.alpha = 0
        this.strips = [];


        this.baseRect = {
            width: 800,
            height: 2000,
        }
        this.totalStripes = 5
        for (var i = 0; i < this.totalStripes; i++) {
            let stripe = new PIXI.NineSlicePlane(PIXI.Texture.from('tile', 0, 0, 0, 0))
            stripe.width = this.baseRect.width / this.totalStripes
            stripe.height = this.baseRect.height
            stripe.pivot.y = stripe.height / 2
            stripe.y = stripe.pivot.y;
            stripe.x = this.baseRect.width / this.totalStripes * i;
            stripe.interactive = true;
            stripe.tint = 0x272822
            this.strips.push(stripe);
            this.container.addChild(stripe)
        }

        this.logo = new PIXI.Sprite.from('main-logo')
        this.addChild(this.logo)
        this.logo.anchor.set(0.5)


        this.direction = 1
    }

    transitionIn(delay) {
        this.totalTransitionTime = MainScreenManager.Transition.transitionTimer;

        if (this.totalTransitionTime <= 0) {

            this.visible = false;
        } else {
            this.visible = true;
            this.time = 0.01;
            this.direction = 1
        }

    }

    transitionOut(delay, force) {
        this.totalTransitionTime = MainScreenManager.Transition.transitionTimer;
        if (this.totalTransitionTime <= 0) {

            this.visible = false;
        } else {
            this.direction = -1
            if (force) {
                this.time = this.totalTransitionTime
            } else {
                this.time = Math.min(this.totalTransitionTime, this.time)
            }
        }
    }
    update(delta) {

        let anyUpdate = false;

        let nTime = (this.time / this.totalTransitionTime)
        for (var i = 0; i < this.strips.length; i++) {
            const element = this.strips[i];
            const n = i / this.totalStripes

            const scaledN = (nTime) - n * 0.2

            if (scaledN > 0 && scaledN <= 1) {
                element.scale.y = Utils.easeOutBack(scaledN) //* 0.2
                anyUpdate = true
            } else if (scaledN < 0) {
                element.scale.y = 0
            }
        }

        if (anyUpdate) {
            this.time += delta * this.direction
        }

        if ((this.direction > 0 && nTime > 0.05) || (this.direction < 0 && nTime > 0.1)) {
            this.blocker.visible = true;
            const targetScaleX = 1 / this.scale.x
            const targetScaleY = 1 / this.scale.y
            if (this.direction > 0) {

                this.logo.scale.x = Utils.easeOutElastic(nTime) * targetScaleX
                this.logo.scale.y = (1.5 * targetScaleY) - Utils.easeOutElastic(nTime) * (0.5 * targetScaleY)
            } else {
                this.logo.scale.y = Utils.easeOutBack(nTime) * targetScaleY
                this.logo.scale.x = (1.5 * targetScaleX) - Utils.easeOutElastic(nTime) * (0.5 * targetScaleX)
            }
        } else {
            this.logo.scale.set(0)
            this.blocker.visible = false;
        }
    }
    resize(newSize, innerResolution) {
        this.container.pivot.x = this.baseRect.width / 2
        this.container.pivot.y = this.baseRect.height / 2

        this.scale.x = Game.Borders.width / this.baseRect.width
        this.scale.y = Game.Borders.height / this.baseRect.height

        this.logo.scale.x = 1 / this.scale.x
        this.logo.scale.y = 1 / this.scale.y
    }
}