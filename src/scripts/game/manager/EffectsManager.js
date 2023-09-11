import AlphaBehaviour from "../components/particleSystem/particleBehaviour/AlphaBehaviour";
import ColorBehaviour from "../components/particleSystem/particleBehaviour/ColorBehaviour";
import Game from "../../Game";
import GameObject from "../core/gameObject/GameObject";
import GameStaticData from "../data/GameStaticData";
import ParticleDescriptor from "../components/particleSystem/ParticleDescriptor";
import ParticleEmitter from "../components/particleSystem/ParticleEmitter";
import RenderModule from "../core/modules/RenderModule";
import SinoidBehaviour from "../components/particleSystem/particleBehaviour/SinoidBehaviour";
import SpriteSheetBehaviour from "../components/particleSystem/particleBehaviour/SpriteSheetBehaviour";

export default class EffectsManager extends GameObject {
    static instance;
    static TargetLayer = {
        GameplayLayer: 'GameplayLayer',
        BaseLayer: 'BaseLayer'
    }
    static ParticleBehaviours = {
        Alpha: AlphaBehaviour,
        Color: ColorBehaviour,
        Sinoid: SinoidBehaviour,
        SpriteSheet: SpriteSheetBehaviour
    }
    constructor(container, gameContainer) {
        super();
        EffectsManager.instance = this;
        this.effectsContainer = container;
        this.gameContainer = gameContainer;
        this.effectsContainer.alpha = true;
        this.particleDescriptors = {};
        this.makeDescriptors();

        //console.log(this.particleDescriptors)

        this.labels = [];
        this.news = 0
        this.fontPool = {};
        //this.damageFontPool = [];


        this.fontDefault = {
            fontFamily: window.MAIN_FONT,
            align: "center",
            dropShadow: true,
            dropShadowAngle: 1.5,
            fontSize: 22,
            dropShadowDistance: 2,
            fill: "#00FF00",
            fontWeight: 600,
            letterSpacing: 2,
            strokeThickness: 3,
        }

        this.addBitmapFont('HEAL', {fill: "#00FF00"});
        this.addBitmapFont('DAMAGE', {fill: "#ffffff"});
        this.addBitmapFont('PLAYER_DAMAGE', {fill: "#ff4444"});
        this.addBitmapFont('BURN', {fill: "#f97b1a"});
        this.addBitmapFont('POISON', {fill: "#a71af9"});
        this.addBitmapFont('COIN', {fill: "#FFC900"});
        this.addBitmapFont('EVASION', {fill: "#f5ff66", fontSize:18});
        this.addBitmapFont('CRITICAL', {
            align: "center",
            dropShadow: true,
            dropShadowAngle: 1.5,
            dropShadowBlur: 4,
            dropShadowDistance: 3,
            fill: [
                "#ff0000",
                "#f5ff66"
            ],
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 10,
            stroke: "#ffffff",
            strokeThickness: 3,
            wordWrap: true,
            wordWrapWidth: 300
        });

        this.explosionShape = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(-5000,-5000,10000,10000);
        Game.UIOverlayContainer.addChild(this.explosionShape )
        this.explosionShape.alpha = 0;
    }
    addBitmapFont(name, overrides) {

        let copyDefault = {};
        for (const key in this.fontDefault) {
            if (Object.hasOwnProperty.call(this.fontDefault, key)) {
                if (overrides && overrides[key] !== undefined) {
                    copyDefault[key] = overrides[key];
                } else {
                    copyDefault[key] = this.fontDefault[key];
                }
            }
        }
        PIXI.BitmapFont.from(name, copyDefault);
    }
    bombExplode(){
        TweenLite.killTweensOf(this.explosionShape.alpha)
        this.explosionShape.alpha = 1;
        TweenLite.to(this.explosionShape, 1, {delay:0.15, alpha:0});
    }
    makeDescriptors() {
        let descriptors = GameStaticData.instance.getAllDataFrom('vfx', 'particleDescriptors')
        //console.log(descriptors)
        descriptors.forEach(data => {
            this.particleDescriptors[data.id] = new ParticleDescriptor(data)

            if (data.baseBehaviours) {

                if (Array.isArray(data.baseBehaviours)) {

                    data.baseBehaviours.forEach(behaviour => {
                        let behaviourConstructor = EffectsManager.ParticleBehaviours[behaviour.behaviourId];
                        if (behaviourConstructor.name == SpriteSheetBehaviour.name) {
                            this.particleDescriptors[data.id].addBaseBehaviours(behaviourConstructor, GameStaticData.instance.getSharedDataById('vfx', behaviour.vfxId));
                        } else {

                            this.particleDescriptors[data.id].addBaseBehaviours(behaviourConstructor, behaviour)
                        }
                    });
                } else {
                    EffectsManager.ParticleBehaviours[data.baseBehaviours];
                    let behaviour = GameStaticData.instance.getDataById('vfx', 'behaviours', data.baseBehaviours)
                    let behaviourConstructor = EffectsManager.ParticleBehaviours[behaviour.behaviourId]

                    if (behaviourConstructor.name == SpriteSheetBehaviour.name) {
                        this.particleDescriptors[data.id].addBaseBehaviours(behaviourConstructor, GameStaticData.instance.getSharedDataById('vfx', behaviour.vfxId));
                    } else {

                        this.particleDescriptors[data.id].addBaseBehaviours(behaviourConstructor, behaviour)
                    }

                }

            }
        });
    }
    start() {
        this.renderModule = this.engine.findByType(RenderModule);
        this.baseLayer = this.renderModule.layers[RenderModule.RenderLayers.Floor].container;
        this.bottomLayer = this.renderModule.layers[RenderModule.RenderLayers.Default].container;

        this.particleEmitter = new ParticleEmitter(this.gameContainer);
        this.particleEmitterBottom = new ParticleEmitter(this.bottomLayer);
        this.particleEmitterKill = new ParticleEmitter(this.baseLayer, 500);
    }
    update(delta) {
        this.effectsContainer.pivot.x = this.gameContainer.pivot.x
        this.effectsContainer.pivot.y = this.gameContainer.pivot.y

        this.effectsContainer.scale.x = this.gameContainer.scale.x
        this.effectsContainer.scale.y = this.gameContainer.scale.y


        this.effectsContainer.x = this.gameContainer.x
        this.effectsContainer.y = this.gameContainer.y

        //for (let index = 0; index < this.labels.length; index++) {
        for (let index = this.labels.length - 1; index >= 0; index--) {
            this.labels[index].timer -= delta;
            this.labels[index].y -= delta * 5
            if (this.labels[index].timer < 0.5) {
                this.labels[index].alpha = this.labels[index].timer * 2;
            }
            if (this.labels[index].timer <= 0) {
                this.fontPool[this.labels[index]._fontName].push(this.labels[index]);
                this.labels.splice(index, 1)
            }

        }

        this.particleEmitter.update(delta)
        this.particleEmitterBottom.update(delta)
        this.particleEmitterKill.update(delta)
    }
    popKill(entity) {
        //this.particleEmitter.emit(this.skullDescriptor, { minX: entity.gameView.x, maxX: entity.gameView.x, minY: entity.gameView.y, maxY: entity.gameView.y }, 1);
        //this.particleEmitterKill.emit(this.bloodPuddle, { minX: entity.gameView.x, maxX: entity.gameView.x, minY: entity.gameView.y, maxY: entity.gameView.y }, 1);
        return

    }
    popLabel(textLabel, entity, value) {
        let ang = Math.random() * Math.PI * 2;
        let dist = Math.random() * 30;
        textLabel.alpha = 1
        textLabel.text = value
        textLabel.x = entity.gameView.x + Math.cos(ang) * dist
        textLabel.y = entity.gameView.y - Math.sin(ang) * dist
        textLabel.timer = 1
        textLabel.anchor.set(0.5)
        textLabel.scale.set(0.5)
        this.labels.push(textLabel)
        this.effectsContainer.addChild(textLabel)
    }
    popEvasion(entity) {
        this.popLabel(this.getBitmapFont('EVASION'), entity, 'Evade')
    }
    popCustomLabel(label, entity, value) {
        this.popLabel(this.getBitmapFont(label), entity, value)
    }
    popDamage(entity, value) {
        this.popLabel(this.getBitmapFont('DAMAGE'), entity, value)
    }
    popDamagePlayer(entity, value) {
        this.popLabel(this.getBitmapFont('PLAYER_DAMAGE'), entity, value)
    }
    popHeal(entity, value) {
        this.popLabel(this.getBitmapFont('HEAL'), entity, value)
    }
    popCoin(entity, value) {
        this.popLabel(this.getBitmapFont('COIN'), entity, value)
    }
    testParticles(entity, value) {
        this.particleEmitter.emit(this.particleDescriptors['FREE_BLOOD_SPLAT'], [entity.gameView.x, entity.gameView.y]);
        //this.particleEmitter.emit(this.bloodSplat, { minX: entity.gameView.x, maxX: entity.gameView.x, minY: entity.gameView.y, maxY: entity.gameView.y }, 1);
    }
    emitByIdInRadius(position, radius, descriptor, quant = 1, overrides, target = EffectsManager.TargetLayer.GameplayLayer) {
        if (quant <= 0) {
            quant = this.particleDescriptors[descriptor].baseData.baseAmount;
        }
        for (let index = 0; index < quant; index++) {
            if (target == EffectsManager.TargetLayer.GameplayLayer) {
                this.particleEmitter.emit(this.particleDescriptors[descriptor], { minX: position.x - radius, maxX: position.x + radius, minY: position.y - radius, maxY: position.y + radius }, 1, overrides);
            } else {
                this.particleEmitterBottom.emit(this.particleDescriptors[descriptor], { minX: position.x - radius, maxX: position.x + radius, minY: position.y - radius, maxY: position.y + radius }, 1, overrides);
            }
        }
    }

    emitParticles(position, descriptor, quant = 1, overrides, target = EffectsManager.TargetLayer.GameplayLayer) {
        if (quant <= 0) {
            quant = descriptor.baseData.baseAmount;
        }
        for (let index = 0; index < quant; index++) {
            if (target == EffectsManager.TargetLayer.GameplayLayer) {
                this.particleEmitter.emit(descriptor, { minX: position.x, maxX: position.x, minY: position.y, maxY: position.y }, 1, overrides);
            } else {
                this.particleEmitterBottom.emit(descriptor, { minX: position.x, maxX: position.x, minY: position.y, maxY: position.y }, 1, overrides);
            }
        }
    }

    emitById(position, descriptor, quant = 1, overrides, target = EffectsManager.TargetLayer.GameplayLayer) {
        if (quant <= 0) {
            if(this.particleDescriptors[descriptor].baseData){
                quant = this.particleDescriptors[descriptor].baseData.baseAmount;
            }
        }
        for (let index = 0; index < quant; index++) {
            if (target == EffectsManager.TargetLayer.GameplayLayer) {
                this.particleEmitter.emit(this.particleDescriptors[descriptor], { minX: position.x, maxX: position.x, minY: position.y, maxY: position.y }, 1, overrides);
            } else {
                this.particleEmitterBottom.emit(this.particleDescriptors[descriptor], { minX: position.x, maxX: position.x, minY: position.y, maxY: position.y }, 1, overrides);
            }
        }
    }

    getBitmapFont(type = 'DAMAGE') {
        if (!this.fontPool[type]) {
            this.fontPool[type] = [];
        }
        if (this.fontPool[type].length > 0) {
            let element = this.fontPool[type].pop();
            return element;
        }
        let newElement = new PIXI.BitmapText("150", { fontName: type });
        this.news++
        return newElement;

    }
}