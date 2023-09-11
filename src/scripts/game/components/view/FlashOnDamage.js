import BaseComponent from '../../core/gameObject/BaseComponent';
import Color from '../../core/utils/Color';
import Shaders from '../../shader/Shaders';
import Utils from '../../core/utils/Utils';

export default class FlashOnDamage extends BaseComponent {
    static FlashTextures = {}
    static ColorFilter = null;
    constructor() {
        super();

        if (!FlashOnDamage.ColorFilter) {
            FlashOnDamage.ColorFilter = new PIXI.filters.ColorMatrixFilter();
            let colorIntensity = 1;
            FlashOnDamage.ColorFilter.matrix = [
                1, colorIntensity, colorIntensity, colorIntensity, colorIntensity,
                colorIntensity, 1, colorIntensity, colorIntensity, colorIntensity,
                colorIntensity, colorIntensity, 1, colorIntensity, colorIntensity,
                0, 0, 0, 1, 0]
        }

        this.intensity = 0;
        this.flashTime = 0.25;
        this.flashCurrentTime = 0;

        this.currentRGB = { r: 0, g: 0, b: 0 }

        this.startValue = Color.toRGB(0xFFFFFF);
        

        this.uniformGroup = {
            intensity: 0
        }
        this.shader = new PIXI.Filter(null, Shaders.ENTITY_SPRITE_SHADER, this.uniformGroup)

    }
    generateTextureFromContainer(id, content) {
        if (FlashOnDamage.FlashTextures[id]) {
            return FlashOnDamage.FlashTextures[id]
        }
        let texture = renderer.renderer.generateTexture(content);
        FlashOnDamage.FlashTextures[id] = texture;

        return texture;

    }
    enable() {
        super.enable();
        this.intensity = 0;
        this.flashCurrentTime = 0;
        this.flashTexture = null;
        if (this.gameObject.health) {
            this.gameObject.health.gotDamaged.add(this.startFlash.bind(this))
        }

        if (this.gameObject.gameView && this.gameObject.gameView.view) {
            this.gameObject.gameView.view.tint = 0xFFFFFF
            this.intensity = 1;
        }

        if (this.gameObject.gameView.view.texture.textureCacheIds[0]) {
            var filename = this.gameObject.gameView.view.texture.textureCacheIds[0].replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, "")
            this.currentTextureID = filename + '-flash'
            if (!FlashOnDamage.FlashTextures[this.currentTextureID]) {
                let flashImage = new PIXI.Sprite.from(filename)
                flashImage.filters = [FlashOnDamage.ColorFilter]                
                this.flashTexture = this.generateTextureFromContainer(this.currentTextureID, flashImage)
            } else {
                this.flashTexture = FlashOnDamage.FlashTextures[this.currentTextureID];
            }
        }


    }
    destroy() {
        super.destroy();
        this.gameObject.health.gotDamaged.remove(this.startFlash.bind(this))
    }
    startFlash(ignore, ignore2, targetColor = 0xFF0000) {
        if (this.gameObject.health.isDead) return;
        this.intensity = 1;
        this.flashCurrentTime = this.flashTime;
        this.endValue = Color.toRGB(targetColor);
        if (this.gameObject.gameView && this.gameObject.gameView.view) {
            this.gameObject.gameView.view.tint = Color.rgbToColor(this.endValue);
        }
    }
    lateUpdate(delta) {

        if (this.flashCurrentTime > 0) {
            this.flashCurrentTime -= delta;

            this.intensity = this.easeOutBack(this.flashCurrentTime / this.flashTime)

            this.intensity = Math.max(0, this.intensity)

            if (this.uniformGroup) {
                this.uniformGroup.intensity = this.intensity;
            }

            this.currentRGB.r = Math.floor(this.intensity * (this.endValue.r - this.startValue.r) + this.startValue.r);
            this.currentRGB.g = Math.floor(this.intensity * (this.endValue.g - this.startValue.g) + this.startValue.g);
            this.currentRGB.b = Math.floor(this.intensity * (this.endValue.b - this.startValue.b) + this.startValue.b);

            this.currentValue = Color.rgbToColor(this.currentRGB);

            if (this.flashCurrentTime <= 0) {
                if (this.gameObject.gameView && this.gameObject.gameView.view) {
                    this.gameObject.gameView.view.tint = Color.rgbToColor(this.startValue);
                }
            } else {
                if (this.gameObject.gameView && this.gameObject.gameView.view) {
                    this.gameObject.gameView.view.tint = this.currentValue;
                    this.gameObject.gameView.view.texture = this.flashTexture
                }
            }
        }
    }


    easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
}