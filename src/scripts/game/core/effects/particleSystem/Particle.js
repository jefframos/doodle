import * as PIXI from 'pixi.js';

import ParticleDescriptor from './ParticleDescriptor'
import Pool from '../../utils/Pool';

export default class Particle {

    constructor() {
        this.descriptor = Pool.instance.getElement(ParticleDescriptor);
        this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
    }

    set x(value) {
        this.sprite.x = value;
    }
    set y(value) {
        this.sprite.y = value;
    }
    get shouldDestroy() {
        return this.descriptor.shouldDestroy;

    }
    get behaviours(){
        return this.descriptor.behaviours;
    }
    reset(){
        if(this.descriptor){
            this.descriptor.resetBehaviours();
        }
    }
    build(descriptor) {
        this.descriptor = Pool.instance.getElement(ParticleDescriptor);
        this.descriptor.reset()
        this.descriptor.clone(descriptor);
        this.sprite.texture = this.descriptor.texture ? this.descriptor.texture : PIXI.Texture.EMPTY;
        this.sprite.tint = this.descriptor.tint;

        if (descriptor.anchor) {
            this.sprite.anchor.set(descriptor.anchor.x, descriptor.anchor.y)
        } else {
            this.sprite.anchor.set(0.5)
        }

        this.sprite.rotation = 0;
        this.sprite.alpha = 1;
        this.sprite.scale.set(this.descriptor.scale);
        this.sprite.blendMode = this.descriptor.blendMode;

        this.update(0)

    }
    update(delta) {
        this.descriptor.update(delta);
        this.sprite.x += this.descriptor.velocityX * delta + this.descriptor.velocityOffsetX * delta;
        this.sprite.y += this.descriptor.velocityY * delta + this.descriptor.velocityOffsetY * delta;
        this.sprite.rotation += this.descriptor.rotationSpeed * delta;
        this.descriptor.velocityY += this.descriptor.gravity * delta;

        this.descriptor.behaviours.forEach(element => {
            if (element.shouldKill) {
                this.descriptor.shouldDestroy = true;
            }
            if (element.type == 'descriptor') {
                if (this.descriptor[element.property] !== undefined) {
                    this.descriptor[element.property] = element.currentValue;
                }
            } else if (element.type == 'sprite') {
                if (Array.isArray(element.property)) {
                    for (var i = 0; i < element.property.length; i++) {
                        if (this.sprite[element.property[i]] !== undefined) {
                            this.sprite[element.property[i]] = element.currentValue[i];
                        }
                    }
                } else {
                    if (this.sprite[element.property] !== undefined) {
                        this.sprite[element.property] = element.currentValue;
                    }
                }
            }
        });
    }
    destroy() {
        Pool.instance.returnElement(this.descriptor);
    }
}