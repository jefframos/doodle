import * as PIXI from 'pixi.js';

import Particle from './Particle'
import Pool from '../../utils/Pool';

export default class ParticleEmmiter {

    constructor(container, maxParticles = 1000) {
        this.container = container;
        this.position = { x: 0, y: 0 }
        this.particles = [];
        this.frequency = 0.1;
        this.emitTimer = 0;
        this.maxParticles = maxParticles;
        this.active = true;

        this.totalParticles = 0;
    }

    get x() {
        return this.position.x;
    }
    set x(value) {
        this.position.x = value;
    }
    get y() {
        return this.position.y;
    }
    set y(value) {
        this.position.y = value;
    }
    get canEmit() {
        return this.emitTimer <= 0 && this.active;
    }
    reset() {
        for (let index = this.particles.length - 1; index >= 0; index--) {
            const particle = this.particles[index];
            Pool.instance.returnElement(particle);
            this.container.removeChild(particle.sprite);
            this.particles.splice(index, 1);

        }
    }
    emit(particleDescriptor, position, quant = -1, overrides = {}) {
        if(quant <= 0){
            quant = particleDescriptor.baseData.baseAmount || 1;
        }
        for (let index = 0; index < quant; index++) {
            let particle = Pool.instance.getElement(Particle);
            particle.build(particleDescriptor)

            if (Array.isArray(position)) {
                particle.x = position[0] + this.x;
                particle.y = position[1] + this.y;
            } else {
                particle.x = Math.random() * (position.maxX - position.minX) + position.minX + this.x;
                particle.y = Math.random() * (position.maxY - position.minY) + position.minY + this.y;
            }

            for (const key in overrides) {
                if (particle.sprite[key] !== undefined) {
                    particle.sprite[key] = overrides[key];
                }
            }
            this.container.addChild(particle.sprite);
            this.particles.push(particle)

            this.emitTimer = this.frequency;
            if (this.particles.length > this.maxParticles) {
                let first = this.particles[0];
                first.destroy();
                Pool.instance.returnElement(first);
                particle.sprite.parent.removeChild(first.sprite);
                this.particles.splice(0, 1)
            }
        }

    }
    update(delta) {
        this.emitTimer -= delta;
        this.totalParticles = this.particles.length;
        for (let index = this.particles.length - 1; index >= 0; index--) {
            const particle = this.particles[index];
            particle.update(delta)
            if (particle.shouldDestroy) {
                particle.destroy();
                Pool.instance.returnElement(particle);
                particle.sprite.parent.removeChild(particle.sprite);
                this.particles.splice(index, 1);
            }
        }
    }
}