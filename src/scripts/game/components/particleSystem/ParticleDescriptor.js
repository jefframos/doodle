import * as PIXI from 'pixi.js';

import Pool from '../../core/utils/Pool';

export default class ParticleDescriptor {
    constructor(data = {velocityX:0, velocityY:0, tint:0xFFFFFF}) {
        this.baseData = data;
        this.reset();
    }
    reset(){
        this.lifeSpan = 1;
        this.direction = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.rotationSpeed = 0;
        this.blendMode = PIXI.BLEND_MODES.NORMAL;
        this.velocityOffsetX = 0;
        this.velocityOffsetY = 0;
        this.gravity = 0;
        this.scale = 1;
        this.texture = PIXI.Texture.EMPTY;
        this.baseBehaviours = [];
        this.behaviours = [];
        this.tint = 0xFFFFFF;
        this.baseAmount = 1;
        this.shouldDestroy = false;
    }
    findBehaviour(constructor) {

        for (let index = 0; index < this.baseBehaviours.length; index++) {
            const element = this.baseBehaviours[index];
            if (element.behavior == constructor) {
                let behaviour = Pool.instance.getElement(element.behavior);
                behaviour.reset();
                behaviour.build(element.params);
                return behaviour
            }

        }
    }
    resetBehaviours(){
        this.behaviours.forEach(element => {
            element.reset();
        });
    }

    addBaseBehaviours(behavior, params) {
        this.baseBehaviours.push({ behavior, params });
    }
    applyBaseData() {
        if (this.baseData) {
            this.reset();
            for (const key in this.baseData) {
                if (this[key] !== undefined) {
                    if (key == 'texture') {
                        if (Array.isArray(this.baseData[key])) {
                            this[key] = PIXI.Texture.from(this.baseData[key][Math.floor(Math.random() * this.baseData[key].length)]);
                        } else if (typeof this.baseData[key] === 'string' ){
                            this[key] = PIXI.Texture.from(this.baseData[key]);
                        }else{
                            this[key] = this.baseData[key];
                        }
                    } else {
                        if (Array.isArray(this.baseData[key])) {
                            this[key] = Math.random() * (this.baseData[key][1] - this.baseData[key][0]) + this.baseData[key][0];
                        } else {
                            this[key] = this.baseData[key];
                        }
                    }
                }
            }
        }

    }
    clone(descriptor) {
        for (const key in this) {
            if(descriptor[key]){
                this[key] = descriptor[key];
            }
        }
        this.applyBaseData();
        this.shouldDestroy = false;

        this.behaviours = [];
        descriptor.baseBehaviours.forEach(element => {
            let behaviour = Pool.instance.getElement(element.behavior);
            behaviour.reset();
            behaviour.build(element.params);
            this.behaviours.push(behaviour);
        });
    }
    update(delta) {
        this.lifeSpan -= delta;
        if (this.lifeSpan <= 0) {
            this.shouldDestroy = true;
        }

        this.behaviours.forEach(element => {
            element.update(delta);
        });
    }
}