import * as PIXI from 'pixi.js';

import BaseScene from './BaseScene';
import Game from '../../../Game';

export default class CampfireScene extends BaseScene {
    constructor() {
        super();

        //0x729AAC
        this.sceneSetup.assets = [
            BaseScene.makeAssetSetup({ src: 'flat-pine', position: { x: 150, y: -580 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.7, y: 0.7 }, tint: 0x225772 }),
            BaseScene.makeAssetSetup({ src: 'flat-pine', position: { x: -150, y: -580 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.7, y: 0.7 }, tint: 0x225772 }),
            BaseScene.makeAssetSetup({ src: 'flat-pine', position: { x: -430, y: -550 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.7, y: 0.7 }, tint: 0x225772 }),
            BaseScene.makeAssetSetup({ src: 'flat-pine', position: { x: 430, y: -550 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.7, y: 0.7 }, tint: 0x225772 }),
            BaseScene.makeAssetSetup({ src: 'base-gradient', position: { x: 0, y: -550 }, scale: { x: 20, y: 0.7 }, anchor: { x: 0.5, y: 1 }, tint: 0x16465B }),


            BaseScene.makeAssetSetup({ src: 'flat-pine', position: { x: 30, y: -480 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.8, y: 0.8 }, tint: 0x225772 }),
            BaseScene.makeAssetSetup({ src: 'base-gradient', position: { x: 0, y: -480 }, scale: { x: 20, y: 0.7 }, anchor: { x: 0.5, y: 1 }, tint: 0x16465B }),

            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: 260, y: -400 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.7, y: 0.7 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: -380, y: -390 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.8, y: 0.8 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: 80, y: -395 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.7, y: 0.7 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'bushgreen',onUpdate: this.treeCallback.bind(this), position: { x: -210, y: -400 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.7, y: 0.7 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'bushgreen',onUpdate: this.treeCallback.bind(this), position: { x: -290, y: -390 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.4, y: 0.4 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'base-gradient', position: { x: 0, y: -390 }, scale: { x: 20, y: 0.7 }, anchor: { x: 0.5, y: 1 }, tint: 0x16465B }),

            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: -80, y: -375 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.7, y: 0.7 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: -80, y: -375 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.7, y: 0.7 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'bushgreen',onUpdate: this.treeCallback.bind(this), position: { x: -310, y: -180 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.7, y: 0.7 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: 210, y: -275 }, anchor: { x: 0.5, y: 1 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: -650, y: -200 }, anchor: { x: 0.5, y: 1 }, scale: { x: 1, y: 1 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: 650, y: -220 }, anchor: { x: 0.5, y: 1 }, scale: { x: 1, y: 1 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'base-gradient', position: { x: 0, y: -180 }, scale: { x: 20, y: 0.7 }, anchor: { x: 0.5, y: 1 }, tint: 0x16465B }),
            // BaseScene.makeAssetSetup({ src: 'base-gradient', position: { x: 0, y: -195 }, anchor: { x: 0.5, y: 1 }, tint:0xAEBD6E }),
            BaseScene.makeAssetSetup({ src: 'main-patch', position: { x: 0, y: 30 }, anchor: { x: 0.5, y: 0.5 }, tint: 0xAEBD6E, alpha: 0.1, scale: { x: -4, y: 4 } }),
            BaseScene.makeAssetSetup({ src: 'main-patch', position: { x: 0, y: 0 }, anchor: { x: 0.5, y: 0.5 }, tint: 0xAEBD6E, alpha: 0.1, scale: { x: 2, y: 2 } }),
            BaseScene.makeAssetSetup({ src: 'cloud-fog', onUpdate: this.loopRight.bind(this),position: { x: -200, y: -380 }, scale: { x: 10, y: 3.5 }, anchor: { x: 0.5, y: 0.5 }, alpha:0.1 }),
            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: 0, y: -195 }, anchor: { x: 0.5, y: 1 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'container', position: { x: -200, y: -100 }, anchor: { x: 0.5, y: 1 } }),
            BaseScene.makeAssetSetup({ src: 'log-sit', position: { x: -280, y: 0 }, anchor: { x: 0.5, y: 0.5 } }),
            BaseScene.makeAssetSetup({ src: 'flag', position: { x: -450, y: -300 }, anchor: { x: 0.5, y: 0.5 } }),
            BaseScene.makeAssetSetup({ src: 'barrel1', position: { x: 0, y: 0 }, anchor: { x: 0.5, y: 1 } }),
            BaseScene.makeAssetSetup({ src: 'rocks0002', position: { x: -460, y: 0 }, anchor: { x: 0.5, y: 1 }, scale: { x: -1, y: 1 } }),
            BaseScene.makeAssetSetup({ src: 'rocks0002', position: { x: -100, y: 180 }, anchor: { x: 0.5, y: 1 } }),
            BaseScene.makeAssetSetup({ src: 'rocks0006', position: { x: 300, y: 150 }, anchor: { x: 0.5, y: 1 } }),
            BaseScene.makeAssetSetup({ src: 'tent', position: { x: 250, y: -90 }, anchor: { x: 0.5, y: 1 } }),
            BaseScene.makeAssetSetup({ src: 'stool', position: { x: 245, y: 50 }, anchor: { x: 0.5, y: 1 } }),
            BaseScene.makeAssetSetup({ src: 'barrel2', position: { x: 390, y: -5 }, anchor: { x: 0.5, y: 1 } }),
            BaseScene.makeAssetSetup({ src: 'round-blur', position: { x: -5, y: -230 }, anchor: { x: 0.5, y: 0.5 }, scale: { x: 5, y: 4 }, alpha: 0.45, tint: 0xFF9768 }),

            BaseScene.makeAssetSetup({
                src: 'campfire-fire00', position: { x: -5, y: -105 }, scale: { x: 1, y: 0.8 }, anchor: { x: 0.5, y: 1 },
                animation: {
                    enabled: true,
                    start: 1,
                    end: 8
                }
            }),
            BaseScene.makeAssetSetup({ src: 'cloud-fog', onUpdate: this.loopLeft.bind(this),position: { x: 500, y: -100 }, scale: { x: 5, y: 4 }, anchor: { x: 0.5, y: 0.5 }, alpha:0.3 }),
            BaseScene.makeAssetSetup({ src: 'round-blur', position: { x: -5, y: -170 }, anchor: { x: 0.5, y: 0.5 }, alpha: 0.75, tint: 0xF46F3C }),
            BaseScene.makeAssetSetup({ src: 'round-blur', position: { x: -5, y: -130 }, anchor: { x: 0.5, y: 0.5 }, scale: { x: 5, y: 4 }, alpha: 0.25, tint: 0xFF9768 }),
            BaseScene.makeAssetSetup({ src: 'bushgreen',onUpdate: this.treeCallback.bind(this), position: { x: -180, y: 350 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.7, y: 0.7 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'bushgreen',onUpdate: this.treeCallback.bind(this), position: { x: -100, y: 380 }, anchor: { x: 0.5, y: 1 }, scale: { x: 0.5, y: 0.5 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'base-gradient', position: { x: 0, y: 380 }, scale: { x: 20, y: 0.7 }, anchor: { x: 0.5, y: 1 }, tint: 0x16465B }),
            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: -400, y: 500 }, anchor: { x: 0.5, y: 1 }, scale: { x: 1.5, y: 1.5 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: -690, y: 600 }, anchor: { x: 0.5, y: 1 }, scale: { x: -1.9, y: 1.9 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: -250, y: 580 }, anchor: { x: 0.5, y: 1 }, scale: { x: 1.3, y: 1.3 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: 380, y: 550 }, anchor: { x: 0.5, y: 1 }, scale: { x: 1.5, y: 1.5 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'dark-pine', onUpdate: this.treeCallback.bind(this), position: { x: 700, y: 330 }, anchor: { x: 0.5, y: 1 }, scale: { x: 1.7, y: 1.7 }, tint: 0xffffff }),
            BaseScene.makeAssetSetup({ src: 'base-gradient', position: { x: 0, y: 600 }, scale: { x: 20, y: 0.7 }, anchor: { x: 0.5, y: 1 }, tint: 0x16465B }),
            BaseScene.makeAssetSetup({ src: 'cloud-fog', onUpdate: this.loopRight.bind(this),position: { x: -700, y: 200 }, scale: { x: 4, y:3.5 }, anchor: { x: 0.5, y: 1 }, alpha:0.3 }),
            BaseScene.makeAssetSetup({ src: 'cloud-fog', onUpdate: this.loopRight.bind(this),position: { x: 0, y: 600 }, scale: { x: 8, y:12 }, anchor: { x: 0.5, y: 1 }, alpha:0.1 }),
        ]


    }
    loopLeft(delta, tree) {
        tree.sprite.x -= delta *5
        if(tree.sprite.x < -1200){
            tree.sprite.x = 1200
        }
    }
    loopRight(delta, tree) {
        tree.sprite.x += delta *5
        if(tree.sprite.x > 1200){
            tree.sprite.x = -1200
        }
    }
    treeCallback(delta, tree) {
        tree.sprite.skew.x = Math.cos(Game.Time * 0.2 + tree.sprite.y) * 0.08
    }
    beforeBuild() {
        this.middle = new PIXI.Graphics().beginFill(0x16465B).drawRect(-2000, -2000, 4000, 4000)
        this.sceneContainer.addChild(this.middle);

        this.campfireLight = new PIXI.Sprite.from('campfire-light')
        this.campfireLight.anchor.set(0.5)
        this.campfireLight.blendMode = PIXI.BLEND_MODES.ADD
        this.campfireLight.alpha = 0.3
        this.sceneContainer.addChild(this.campfireLight);
        this.lightFlickerTime = 0;

        this.grassTopContainer = new PIXI.Container();
        this.sceneContainer.addChild(this.grassTopContainer);

        // this.grassTopLeft = new PIXI.Sprite.from('grasspatch-top')
        // this.grassTopLeft.anchor.set(1, 0.5)        
        // this.grassTopLeft.tint = 0
        // this.grassTopContainer.addChild(this.grassTopLeft);

        // this.grassTopRight = new PIXI.Sprite.from('grasspatch-top')
        // this.grassTopRight.anchor.set(0, 0.5)        
        // this.grassTopRight.scale.x = -1;
        // this.grassTopRight.x = this.grassTopRight.width
        // this.grassTopRight.tint = 0
        // this.grassTopContainer.addChild(this.grassTopRight);


        this.patchesColor = 0x213143;

        // this.grassTopLeft = new PIXI.NineSlicePlane(PIXI.Texture.from('grasspatch-top'), 2, 5, 520,5);
        // this.grassTopLeft.tint = this.patchesColor
        // this.grassTopContainer.addChild(this.grassTopLeft);
        // this.grassTopLeft.width = 5000
        // this.grassTopLeft.pivot.set(this.grassTopLeft.width, this.grassTopLeft.height / 2)      


        // this.grassTopRight = new PIXI.NineSlicePlane(PIXI.Texture.from('grasspatch-top'), 2, 5, 520,5);
        // this.grassTopRight.tint = this.patchesColor
        // this.grassTopRight.scale.x = -1;

        // this.grassTopContainer.addChild(this.grassTopRight);
        // this.grassTopRight.width = 5000
        // this.grassTopRight.pivot.set(this.grassTopRight.width, this.grassTopRight.height / 2)        

        // this.grassTopRight.y = -2
        // this.grassTopRight.y = -2

        // this.topPatch = new PIXI.Sprite.from('tile')
        // this.topPatch.anchor.set(0.5,1)
        // this.topPatch.y = -this.grassTopRight.height / 2
        // this.topPatch.tint = this.patchesColor
        // this.topPatch.width = 5000
        // this.topPatch.height = 5000
        // this.grassTopContainer.addChild(this.topPatch);

        // this.bottomPatch = new PIXI.Sprite.from('tile')
        // this.bottomPatch.anchor.set(0.5,0)
        // this.bottomPatch.y = this.grassTopRight.height / 2 - 5
        // this.bottomPatch.tint = this.patchesColor
        // this.bottomPatch.width = 5000
        // this.bottomPatch.height = 5000
        // this.grassTopContainer.addChild(this.bottomPatch);


        // this.topPatch = new PIXI.Sprite.from('tile')
        // this.topPatch.anchor.set(0.5,1)
        // this.topPatch.y = -this.grassTopRight.height / 2
        // this.grassTopContainer.addChild(this.topPatch);

        //this.grassTopContainer.scale.set(0.9)

        this.campfireLightTop = new PIXI.Sprite.from('campfire-light')
        this.campfireLightTop.anchor.set(0.5)
        this.campfireLightTop.blendMode = PIXI.BLEND_MODES.ADD
        this.campfireLightTop.alpha = 0.3
        this.sceneContainer.addChild(this.campfireLightTop);


    }
    afterBuild() {


    }
    update(delta) {
        super.update(delta);

        if (this.lightFlickerTime <= 0) {

            this.campfireLight.alpha = Math.random() * 0.05 + 0.2
            this.campfireLight.scale.set(1.5 + Math.random() * 0.05)

            this.campfireLightTop.alpha = Math.random() * 0.05 + 0.2
            this.campfireLightTop.scale.set(1 + Math.random() * 0.05)

            this.lightFlickerTime = Math.random() * 0.2 + 0.1

        } else {
            this.lightFlickerTime -= delta;
        }

    }
}