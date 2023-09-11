import * as PIXI from 'pixi.js';

import InteractableView from '../../view/card/InteractableView';
import CookieManager from '../../CookieManager';

export default class AudioControllerView extends PIXI.Container {
    constructor() {
        super()

        this.button = new PIXI.Sprite.from('soundon')
        this.button.scale.set(0.75)
        this.addChild(this.button)
        InteractableView.addMouseClick(this.button, ()=>{this.changeSound()})
        setTimeout(() => {
            
            this.updateView();
        }, 1);
    }
    changeSound(){
        SOUND_MANAGER.toggleMute();
        CookieManager.instance.updateMute(SOUND_MANAGER.isMute)
        this.updateView();
    }
    updateView(){
        if(SOUND_MANAGER.isMute){
            this.button.texture = PIXI.Texture.from('soundoff')
        }else{
            this.button.texture = PIXI.Texture.from('soundon')
        }
    }
}