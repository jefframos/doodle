import * as PIXI from 'pixi.js';
import * as signals from 'signals';

import TweenLite from 'gsap';
import UIUtils from '../utils/UIUtils';
import config from '../../config';
import utils from '../../utils';

export default class UIButton1 extends PIXI.Container {
	constructor(color, icon, iconColor = 0xFFFFFF, width = 65, height = 65, texture = UIUtils.baseButtonTexture+"_0006") {
		super();
		this.build(color, icon, iconColor, width, height, texture)
		

	}
	build(color, icon, iconColor = 0xFFFFFF, width = 65, height = 65, texture = UIUtils.baseButtonTexture+"_0006") {
		this.w = width;
		this.h = height;

		this.mainContainer = new PIXI.Container();
		//this.backShape = PIXI.Sprite.fromImage(
		this.mainTexture = texture;
		if (!icon) {
			this.icon = new PIXI.Sprite();

		} else {
			//console.log(typeof (icon))
			if (icon instanceof PIXI.RenderTexture ||
				icon instanceof PIXI.Texture) {
				this.icon = new PIXI.Sprite();
				this.icon.texture = icon;
			} else {

				this.icon = PIXI.Sprite.from(icon);
			}
		}
		this.icon.tint = iconColor;
		this.enabled = true;
		
		this.backShape = new PIXI.NineSlicePlane(
			PIXI.Texture.from(texture), 0, 0, 0, 0)
		this.backShape.width = width
		this.backShape.height = height
		this.backShape.pivot.set(width / 2, height / 2)
		
		config.addPaddingSquareButton(this.backShape)

		this.icon.anchor.set(0.5);


		this.updateIconScale();
		
		this.mainContainer.addChild(this.backShape);
		this.mainContainer.addChild(this.icon);
		this.addChild(this.mainContainer);

		this.onClick = new signals.Signal()

		this.on('touchstart', this.touchStart.bind(this));
		this.on('touchend', this.click.bind(this));
		this.interactive = true;
		this.buttonMode = true;
	}
	addBadge(texture, scale = 0.8){
		this.badge = PIXI.Sprite.from(texture);
		this.badge.scale.set(scale);
		this.badge.anchor.set(this.badge.width * scale / this.badge.width);
		this.badge.x = this.backShape.width / 2 -4//- this.badge.width
		this.badge.y = -this.backShape.height / 2 + this.badge.height/2+8
		this.mainContainer.addChild(this.badge);

	}
	touchStart() {
		//this.backShape.scale.set(1.1)
	}
	changePivot(x, y) {
		
		this.backShape.pivot.set(this.w * x / 2, this.h * y / 2)

		this.icon.x = this.w * x + this.w / 2
		this.icon.y = this.h * y + this.h / 2
	}
	disableState(color, texture) {

		if (texture)
			this.backShape.texture = PIXI.Texture.from(texture)
		this.icon.alpha = 0.5
		// this.backShape.tint = color;
		//this.alpha = 0.5
	}
	enableState(color, texture) {

		if (texture)
			this.backShape.texture = PIXI.Texture.from(texture)
		this.icon.alpha = 1
		//this.alpha = 1
		// this.backShape.tint = color;
	}
	addFrontShape() {
		this.backShape.y = -10
		
	}
	resize(width, height) {
		if (!width || !height) {
			return
		}
		
		
		

		this.backShape.width = width
		this.backShape.height = height
		this.backShape.pivot.set(width / 2)


		this.updateIconScale();
	}
	updateIconScale(scale = 0.7) {

		utils.resizeToFitAR({
			width: this.backShape.width * scale,
			height: this.backShape.height * scale
		}, this.icon)

	}
	updateRotation(rot, invertIcon = false) {
		
		this.backShape.rotation = rot

		if (invertIcon) {
			this.icon.rotation = -rot
		}
	}
	setIconColor(color) {
		this.icon.tint = color;
	}
	setColor(color) {
		this.backShape.tint = color;
	}
	updateIconTexture(texture) {
		this.icon.texture = texture;
	}
	disable(){
		this.enabled = false;
		this.icon.tint = 0;

		this.backShape.texture = new PIXI.Texture.from(UIUtils.baseButtonTexture+"_0006");

	}
	enable(){
		this.enabled = true;
		this.icon.tint = 0xFFFFFF;

		this.backShape.texture = new PIXI.Texture.from(this.mainTexture);
	}
	click() {
		if(!this.enabled) return
		//this.backShape.scale.set(1)
		// SOUND_MANAGER.play('Tap-01', 0.1)
		this.onClick.dispatch();
		// //window.SOUND_MANAGER.play('tap2', { volume: 0.5 })
	}
	updateTextColor(color) {
		if (this.buttonLabel) {
			this.buttonLabel.style.fill = color;
		}
	}
	replaceIcon(icon) {
		if (this.icon && this.icon.parent) {
			this.icon.parent.removeChild(this.icon);
		}
		this.icon = icon;
		this.mainContainer.addChild(this.icon);

	}
	updateMenuColors(textColor, backgroundColor) {
		
		this.icon.tint = backgroundColor;

		if (this.backLabelLeft) {
			this.backLabelLeft.tint = backgroundColor;
		}

		if (this.buttonLabel) {
			this.buttonLabel.style.fill = textColor;
		}

		this.backShape.tint = textColor;
	}
	addLabelRight(label, color = 0xFFFFFF) {
		this.buttonLabel = new PIXI.Text(label, { font: '18px', fill: color, align: 'left', fontWeight: '300', fontFamily: MAIN_FONT });
		this.buttonLabel.pivot.x = 0//this.buttonLabel.width;
		this.buttonLabel.pivot.y = this.buttonLabel.height / 2;
		this.buttonLabel.x = this.mainContainer.width * 0.5 + 5;
		this.buttonLabel.y = this.backShape.width * 0.5;
		this.addChild(this.buttonLabel);
	}
	addLabelLeft(label, color = 0xFFFFFF) {
		this.buttonLabel = new PIXI.Text(label, { font: '18px', fill: color, align: 'right', fontWeight: '300', fontFamily: MAIN_FONT });
		this.buttonLabel.pivot.x = this.buttonLabel.width;
		this.buttonLabel.pivot.y = this.buttonLabel.height / 2;
		this.buttonLabel.x = -this.mainContainer.width * 0.5 - 5;
		this.buttonLabel.y = this.backShape.width * 0.5;
		this.addChild(this.buttonLabel);
	}
	addLabelLeftMenu(label) {
		this.buttonLabel = new PIXI.Text(label, {
			font: '32px', fill: this.backShape.tint, align: 'right', fontWeight: '800', fontFamily: MAIN_FONT
		});
		this.buttonLabel.pivot.x = this.buttonLabel.width;
		this.buttonLabel.pivot.y = this.buttonLabel.height / 2;
		this.buttonLabel.x = -this.mainContainer.width * 0.55;

		if (!this.backLabelLeft) {
			this.backLabelLeft = new PIXI.mesh.NineSlicePlane(
				PIXI.Texture.from('smallButton.png'), 10, 10, 10, 10)
			this.backLabelLeft.tint = this.icon.tint;
		}

		this.backLabelLeft.width = this.buttonLabel.width - this.buttonLabel.x;
		this.backLabelLeft.height = this.backShape.height;
		this.backLabelLeft.x = - this.backLabelLeft.width - this.backShape.width / 2
		this.backLabelLeft.y = -this.backLabelLeft.height / 2// - this.backShape.height / 2
		this.addChildAt(this.backLabelLeft, 0);
		this.addChild(this.buttonLabel);
	}
	updateTexture(texture) {
		this.icon.texture = PIXI.Texture.from(texture);
		this.updateIconScale();
	}
}
