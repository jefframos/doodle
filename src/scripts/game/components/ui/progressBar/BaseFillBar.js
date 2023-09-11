import BaseBarView from "./BaseBarView";
import BaseComponent from "../../../core/gameObject/BaseComponent";
import Color from "../../../core/utils/Color";
import GameObject from "../../../core/gameObject/GameObject";
import GameView from "../../../core/view/GameView";
import RenderModule from "../../../core/modules/RenderModule";
import Utils from "../../../core/utils/Utils";

export default class BaseFillBar extends GameObject {
    constructor() {
        super();
        this.intensity = 0;

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.RenderLayers.FrontLayer
        //this.filter = new PIXI.filters.ColorMatrixFilter();

        this.flashTime = 0.3;
        this.flashCurrentTime = 0;


        this.gameView.view = new PIXI.Container();

        this.bar = new BaseBarView();
        this.gameView.view.addChild(this.bar);
        this.bar.setColors(0x8636f0, 0xFF0000)
        this.maxWidth = 10
        this.maxHeight = 10

        this.offset = { x: 0, y: -50 }
    }
    addIcon(icon){
        if(!this.icon){
            this.icon = new PIXI.Sprite.from(icon);
            this.gameView.view.addChild(this.icon);
        }else{
            this.icon.texture = new PIXI.Texture.from(icon);
        }
        this.icon.scale.set(Utils.scaleToFit(this.icon, this.maxHeight + this.border))
        this.icon.anchor.set(0.5)
    }

    build(width = 50, height = 10, border = 1) {
        super.build();
        this.maxWidth = width
        this.maxHeight = height
        this.border = border

        this.bar.build(width , height , border);

        this.bar.x = -width / 2 - border;
        this.barNormal = 1;

    }
    updateView(offset, startColor = 0x8636f0, endColor = 0xFF0000) {
        this.offset = offset;
        this.bar.y = this.offset.y;
        this.bar.setColors(startColor, endColor)       
    }
    destroy() {
        super.destroy();
    }


    update(delta, unscaled) {
        super.update(delta, unscaled);
        this.barNormal = Math.max(0,Math.min(this.barNormal,1))
        this.bar.updateNormal(this.barNormal)
        this.bar.update(delta)
        this.transform.position.copy(this.parent.transform.position)

        if(this.icon){
            this.icon.x = this.bar.x - this.icon.width
            this.icon.y = this.bar.y + this.bar.height / 2 - this.border
        }
    }

    set normal(value) {
        this.barNormal = value;
    }
}