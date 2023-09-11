import BaseComponent from '../core/gameObject/BaseComponent';
import Color from '../core/utils/Color';
import LightSource from '../core/view/LightSource';
import Player from '../entity/Player';
import RenderModule from '../core/modules/RenderModule';
import TagManager from '../core/TagManager';
import Utils from '../core/utils/Utils';
import Vector3 from '../core/gameObject/Vector3';
import signals from 'signals';

export default class AmbientLightSystem extends BaseComponent {
    constructor() {
        super();

        this.occlusionSpeed = 0.5;
        this.baseColor = Color.toRGB(0xFFFFFF)
        this.targetColor = Color.toRGB(0xFBB474)

        this.lightSourceList = [];

        this.minDistance = 200
        this.maxDistance = 300

        this.debug = 0;
        this.isDayTime = false;

        this.dayTimeSetup = {
            day: {
                ambientColor: 0xFFFFFF,
                intensityLight: 0
            },
            dusk: {
                ambientColor: 0xFBB474,
                intensityLight: 0.15
            },
            night: {
                ambientColor: 0x2C2255,
                intensityLight: 1
            }
        }
        this.dayTime = {
            ambientColor: 0xFFFFFF,
            intensityLight: 0
        }
        this.setDaytime('day')
    }
    setDefault(){
        this.setDaytime('day')

        this.renderModule.layers[this.player.gameView.layer].gameViews.forEach(element => {
            element.view.tint = 0xFFFFFF
        });
    }
    setLevelLightSetup(ambientColor = 0xFFFFFF, intensityLight = 0) {

        this.dayTime.ambientColor = ambientColor
        this.dayTime.intensityLight = intensityLight

        this.baseColor = Color.toRGB(0xFFFFFF)
        this.targetColor = Color.toRGB(this.dayTime.ambientColor)
    }
    setDaytime(type = 'day') {
        this.dayTime.ambientColor =  this.dayTimeSetup[type].ambientColor;
        this.dayTime.intensityLight =  this.dayTimeSetup[type].intensityLight;

        this.baseColor = Color.toRGB(0xFFFFFF)
        this.targetColor = Color.toRGB(this.dayTime.ambientColor)
    }
    get ambientColor() {
        return this.dayTime.ambientColor
    }
    enable() {
        super.enable();
        this.renderModule = this.gameObject.engine.findByType(RenderModule);
        this.renderModule.onNewRenderEntityAdded.add(this.entityAdded.bind(this));
        this.renderModule.onNewRenderEntityLateAdded.add(this.entityLateAdded.bind(this));
        if (!this.player) {
            this.gameObject.engine.callbackWhenAdding(Player, (player) => {
                this.player = player[0];
            });
        }

    }
    entityLateAdded(entityList) {
        entityList.forEach(entity => {
            if (entity.gameView instanceof LightSource) {
                this.lightSourceList.push(entity)
                if (this.dayTime.intensityLight <= 0) {
                    entity.gameView.view.visible = false;
                } else {
                    entity.gameView.view.visible = true;
                }
                entity.gameView.intensityModifier = this.dayTime.intensityLight;
                entity.gameObjectDestroyed.add(this.elementDestroyed.bind(this))
            } else if (entity.gameView.layer == RenderModule.RenderLayers.Gameplay) {

                entity.gameView.lightRange = this.dayTime.intensityLight

                if(this.dayTime.intensityLight <= 0){
                    entity.gameView.view.tint = 0xFFFFFF;
                }
                this.calcEntityFog(entity.gameView);
            }
        });
    }
    elementDestroyed(entity) {

        if(entity.view){
            entity.view.tint = 0xFFFFFF
        }
        this.lightSourceList = this.lightSourceList.filter(item => item !== entity)
    }
    entityAdded(entity) {

    }
    lateUpdate(delta) {
        if (!this.player) return;
        this.renderModule.layers[this.player.gameView.layer].gameViews.forEach(element => {
            this.calcEntityFog(element)
        });
    }
    calcEntityFog(entity) {

        if (this.dayTime.intensityLight <= 0) {
            this.lightSourceList.forEach(lightSource => {
                lightSource.gameView.view.visible = false;
                lightSource.gameView.intensityModifier = 0
            })
            return;
        }
        let range = 1;
        this.lightSourceList.forEach(lightSource => {
            const lightSourceData = lightSource.gameView.lightData;
            if (lightSource.gameObject && lightSource.gameObject.parent && lightSource.gameObject.parent.gameView) {
                lightSource.gameObject.parent.gameView.lightRange = 0
            }
            lightSource.gameView.intensityModifier = this.dayTime.intensityLight;
            const dist = lightSource.gameView.getDistanceFrom(entity.gameObject.transform.position)
            let tempRange = 1;

            if (dist < lightSourceData.minDistance) {
                tempRange = 0;
            } else {
                tempRange = Math.min((dist - lightSourceData.minDistance) / (lightSourceData.maxDistance - lightSourceData.minDistance), 1)
            }
            if (tempRange < range) {
                range = tempRange;
            }

        });
        range = Math.min(range, 1)
        entity.lightRange = Utils.lerp(entity.lightRange, range, 0.2)
        if (range > 0) {
            Color.colorLerp(entity.auxColorRGB, this.baseColor, this.targetColor, entity.lightRange)
            entity.auxColor = Color.rgbToColor(entity.auxColorRGB)
            entity.view.tint = entity.auxColor
        } else {
            entity.view.tint = 0xFFFFFF
        }
    }

}