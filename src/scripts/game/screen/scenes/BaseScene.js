import * as PIXI from 'pixi.js';

import Pool from '../../core/utils/Pool';
import SpriteSheetAnimation from '../../components/utils/SpriteSheetAnimation';

export default class BaseScene extends PIXI.Container {

    static makeAssetSetup(data) {
        let obj = {
            src: '',
            anchor: { x: 0.5, y: 0.5 },
            scale: { x: 1, y: 1 },
            position: { x: 0, y: 0 },
            tint:0xFFFFFF,
            alpha:1,
            onUpdate:null,
            animation: {
                enabled: false,
                start: 0,
                end: 0
            }
        }

        for (const key in obj) {
            if (data[key] !== undefined) {
                obj[key] = data[key]
            }
        }
        return obj
    }

    constructor() {
        super();

        this.sceneContainer = new PIXI.Container();
        this.addChild(this.sceneContainer);
        this.sceneSetup = {
            assets: [],
            inScene: []
        }

        this.spriteSheet = Pool.instance.getElement(SpriteSheetAnimation)

    }
    buildScene() {
        this.beforeBuild();
        this.sceneSetup.assets.forEach(element => {
            let sprite = new PIXI.Sprite();
            sprite.anchor = element.anchor;
            sprite.position = element.position;
            sprite.scale = element.scale;
            sprite.tint = element.tint;
            sprite.alpha = element.alpha;
            
            const sceneObject = { sprite: sprite,  onUpdate: element.onUpdate }
            if (element.animation.enabled) {
                sceneObject.animation = new SpriteSheetAnimation();
                sceneObject.animation.addLayer('default', element.src, {
                    totalFramesRange: { min: element.animation.start, max: element.animation.end },
                    time: 0.1,
                    loop: true,
                    addZero: true
                });
                sceneObject.animation.play('default')
                sceneObject.animation.updateAnimation(0)
                sprite.texture = sceneObject.animation.currentTexture;

            } else {
                sprite.texture = PIXI.Texture.from(element.src)
            }

            this.sceneSetup.inScene.push(sceneObject)
            this.sceneContainer.addChild(sprite);
        });
        this.afterBuild();
    }
    afterBuild() {
    }
    update(delta) {
        this.sceneSetup.inScene.forEach(element => {
            if (element.animation) {
                element.animation.update(delta)
                element.sprite.texture = element.animation.currentTexture
            }
            if(element.onUpdate){
                element.onUpdate(delta,element)
            }
        });
    }
}
