import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class PartySlot extends PIXI.Container {
    constructor(i, j, size) {
        super();

        this.id = {
            i: i,
            j: j
        }
        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.size = size;


        this.backSlot = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.from('party-slot'), 10, 10, 10, 10)
        this.backSlot.width = size
        this.backSlot.height = size

        // this.backSlot = new PIXI.Sprite.from('party-slot');
        // this.backSlot.scale.set(size / this.backSlot.width)
        this.container.addChild(this.backSlot)

        this.label = new PIXI.Text(i + '-' + j, LABELS.LABEL1);
        // this.container.addChild(this.label)
        this.label.x = this.backSlot.width / 2 - this.label.width / 2;

        this.entitySprite = new PIXI.Sprite.from('');
        this.container.addChild(this.entitySprite)
        this.entitySprite.anchor.set(0.5, 1)
        this.entitySprite.visible = false;

        this.onClick = new Signals();
        this.onHold = new Signals();
        this.onUp = new Signals();
        this.onEndHold = new Signals();

        this.backSlot.buttonMode = true;
        this.backSlot.interactive = true;
        this.backSlot.on('mousedown', this.onMouseDown.bind(this)).on('touchstart', this.onMouseDown.bind(this));
        this.backSlot.on('mouseover', this.onMouseMove.bind(this)).on('pointerover', this.onMouseMove.bind(this));
        this.backSlot.on('mouseout', this.onMouseCancel.bind(this)).on('touchout', this.onMouseCancel.bind(this));
        this.backSlot.on('mouseup', this.onMouseUp.bind(this))
            .on('touchend', this.onMouseUp.bind(this))
            .on('mouseupoutside', this.onMouseUp.bind(this))
            .on('touchendoutside', this.onMouseUp.bind(this));
        this.holdTimeout = 0;

        this.dir = 1;
        this.entityScale = 1;
        this.animSprite = false;

    }
    update(delta) {
        if (this.animSprite) {
            this.sin += delta * 5;
            this.sin %= Math.PI * 2;
            this.entitySprite.scale.x = (this.entityScale * this.dir) + Math.sin(this.sin) * 0.02
            this.entitySprite.scale.y = this.entityScale + Math.cos(this.sin) * 0.02
        }
    }
    updateDir(mousePos) {
    	let local = this.toLocal(mousePos)
    	if(local.x < this.backSlot.width / 2){
    		this.dir = -1;
    	}else{
    		this.dir = 1;
    	}
    }
    showSprite() {
        if (!this.charData) {
            return;
        }
        this.entitySprite.alpha = 1;
        this.entitySprite.visible = true;
        return this.entitySprite.texture;
    }
    removeEntity() {
        this.charData = null;
        this.entitySprite.visible = false;
        this.animSprite = false;
    }
    hideSprite() {
        if (!this.charData) {
            return;
        }
        this.entitySprite.alpha = 0//.5

        return this.entitySprite.texture;
    }
    addEntity(charData) {
    	//console.log(charData);
        if (this.charData) {
            return;
        } else {
            this.charData = charData;
        }
        this.entitySprite.texture = PIXI.Texture.from(this.charData.graphicsData.textures.front);
        this.entitySprite.x = this.backSlot.width / 2;
        this.entitySprite.y = this.backSlot.height / 2;
        this.entityScale = Math.abs(this.backSlot.width / this.charData.graphicsData.baseWidth * 0.75)
        this.entitySprite.scale.set(0, 2);
        this.sin = Math.random();
        this.showSprite()
        TweenLite.to(this.entitySprite.scale, 0.5, {
            x: this.entityScale * this.dir,
            y: this.entityScale,
            ease: Elastic.easeOut,
            onComplete:()=>{
            	this.animSprite = true;
            }
        })

    }
    onMouseMove(e) {
        if (this.holding) {
            return;
        }
        if (!this.mouseDown) {
            this.backSlot.tint = 0x00FFFF
        }
    }

    onMouseCancel(e) {
        if (this.holding) {
            return;
        }
        this.backSlot.tint = 0xFFFFFF
        if (!this.mouseDown) {
            return;
        }
        clearTimeout(this.holdTimeout)
        this.cancel = true;
        this.endHold();
    }
    onMouseUp(e) {
        if (!this.mouseDown) {
            this.onUp.dispatch(this);
            return;
        }
        this.mouseDown = false;
        if (this.cancel) {
            this.cancel = false;
            this.holding = false;
            return;
        }
        if (this.holding) {

            this.endHold();
            // console.log('onEndHold');
        } else {
            clearTimeout(this.holdTimeout)
            this.onClick.dispatch(this);
        }
    }
    onMouseDown(e) {
        this.mouseDown = true;
        this.hold();
        // this.holdTimeout = setTimeout(() => {
        // }, 200);
    }

    endHold() {
        this.holding = false;
        this.onEndHold.dispatch(this);
        this.backSlot.tint = 0xFFFFFF
    }

    hold() {
    	if(!this.charData){
    		return;
    	}
        this.holding = true;
        this.onHold.dispatch(this);
        this.backSlot.tint = 0xFF0000

        // this.entitySprite.alpha = 0.5
    }

}