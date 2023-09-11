import * as PIXI from 'pixi.js';

import CircleCounter from '../../ui/hudElements/CircleCounter';
import Game from '../../../Game';
import InteractableView from '../../view/card/InteractableView';
import PlayerActiveEquipmentOnHud from './PlayerActiveEquipmentOnHud';
import Pool from '../../core/utils/Pool';
import SpriteSheetAnimation from '../utils/SpriteSheetAnimation';
import UIList from '../../ui/uiElements/UIList';
import UIUtils from '../../utils/UIUtils';
import Utils from '../../core/utils/Utils';
import WeaponData from '../../data/WeaponData';
import signals from 'signals';
import utils from '../../../utils';

export default class PlayerGameplayHud extends PIXI.Container {
    constructor() {
        super();

        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.onOpenMenu = new signals.Signal();

        this.lifeContainer = new PIXI.Sprite.from('player-life-container')
        //this.container.addChild(this.lifeContainer);

        this.equipmentContainer = new PIXI.Container();

        this.backEquipment = new PIXI.NineSlicePlane(PIXI.Texture.from('player-equipment-container'), 20, 0, 20, 0);
        //this.equipmentContainer.addChild(this.backEquipment);

        this.backEquipment.width = 50
        this.equipmentListLine1 = new UIList();
        this.equipmentListLine1.w = 0;
        this.equipmentListLine1.h = 50;
        this.equipmentListLine1.x = 15
        this.equipmentListLine1.y = -30
        this.equipmentContainer.addChild(this.equipmentListLine1);

        this.equipmentListLine2 = new UIList();
        this.equipmentListLine2.w = 0;
        this.equipmentListLine2.h = 50;
        this.equipmentListLine2.x = this.equipmentListLine1.x - 30
        this.equipmentListLine2.y =  this.equipmentListLine1.y + 60
        this.equipmentContainer.addChild(this.equipmentListLine2);


        this.lifeContainer.x = 0
        this.lifeContainer.y = 80
        
        this.container.addChild(this.equipmentContainer);
        this.equipmentContainer.x = 30
        this.equipmentContainer.y = 80

        this.lifeCounter = new CircleCounter(77, 50)
        this.lifeContainer.addChild(this.lifeCounter)
        this.lifeCounter.build(0xFF00DD, 0xff0000)
        this.lifeCounter.update(0.75)
        this.lifeCounter.rotation = Math.PI
        this.lifeCounter.x = 7
        this.lifeCounter.y = 7

        this.lifebarDetail = new PIXI.Sprite.from('lifebar-front')
        this.lifeContainer.addChild(this.lifebarDetail)
        this.lifebarDetail.x = 2
        this.lifebarDetail.y = 2

        this.levelupButton = UIUtils.getCloseButton(()=>{
            this.player.sessionData.levelUpMainWeapon();
        })
        //this.container.addChild(this.levelupButton);
        this.levelupButton.y = 500

        this.playerFaceContainer = new PIXI.Sprite.from('player-face-container')
        //this.container.addChild(this.playerFaceContainer);

        InteractableView.addMouseDown(this.playerFaceContainer, () => {
            this.onOpenMenu.dispatch();
        })

        this.goo = new PIXI.Sprite.from('goo')
        //this.container.addChild(this.goo);
        this.goo.x = 13
        this.goo.y = 108

        this.playerFaceMask = new PIXI.Sprite.from('player-face-mask')
        this.container.addChild(this.playerFaceMask);
        this.playerFaceMask.x = 12
        this.playerFaceMask.y = 132
        this.playerFaceMask.anchor.y = 1
        this.playerFace = new PIXI.Sprite()
        this.playerFace.anchor.set(0.5);
        this.playerFace.scale.set(1)

        this.playerFace.y = this.playerFaceContainer.height / 2
        //this.addChild(this.playerFace);

        this.playerFace.mask = this.playerFaceMask

        this.gooSpritesheet = new SpriteSheetAnimation();

        // addLayer(state, spriteName, param = { totalFramesRange: { min: 0, max: 1 }, time: 0.1, loop: true, addZero: false, anchor: { x: 0.5, y: 0.5 } }) {

        this.gooSpritesheet.addLayer('standard', 'goo-drip00', {
            totalFramesRange: { min: 1, max: 9 },
            addZero: true,
            time: 0.2
        })

        this.maxSize = 500;

        this.gooSpritesheet.play('standard')
    }
    registerPlayer(player) {
        this.player = player;
        setTimeout(() => {
            // this.playerFace.texture = player.playerView.staticTexture
            // this.playerFace.x = this.playerFace.width / 2
        }, 10);
        this.player.onUpdateEquipment.add(this.updatePlayerEquip.bind(this));
        this.player.health.healthUpdated.add(this.updatePlayerHealth.bind(this))
    }
    updatePlayerEquip() {
        this.equipmentListLine1.elementsList.forEach(element => {
            Pool.instance.returnElement(element);
        });
        this.equipmentListLine1.removeAllElements();
        this.equipmentListLine1.w = 0;

        this.equipmentListLine2.elementsList.forEach(element => {
            Pool.instance.returnElement(element);
        });
        this.equipmentListLine2.removeAllElements();
        this.equipmentListLine2.w = 0;


        let totalElements = 0;
        this.player.sessionData.equipaments.forEach(element => {

            if (element) {
                
                let icon = Pool.instance.getElement(PlayerActiveEquipmentOnHud)//new PIXI.Sprite.from(element.item.entityData.icon)
                icon.setItem(element.item, 60)
                
                if(element.item instanceof WeaponData){
                    icon.setLevel(element.level - element.item.baseLevel)
                }else{

                    icon.setLevel(element.level)
                }

                icon.align = 0

                if (totalElements % 2 === 0) {

                    this.equipmentListLine1.w += 60;
                    this.equipmentListLine1.h = 60;
                    this.equipmentListLine1.addElement(icon)
                } else {
                    this.equipmentListLine2.w += 60;
                    this.equipmentListLine2.h = 60;
                    this.equipmentListLine2.addElement(icon)
                }

                totalElements ++;
            }
        });

        this.equipmentListLine1.updateHorizontalList()
        this.equipmentListLine2.updateHorizontalList()
        this.backEquipment.width = this.equipmentListLine1.w + 25
    }
    updatePlayerHealth(delta) {

        this.lifeCounter.update(0.75 + (1 - this.player.health.normal) * 0.25);
    }
    resize(res, newRes) {

        if (!this.player) {
            return;
        }
        if (this.maxSize != (Game.Borders.width / Game.GlobalScale.x) - 250) {
            this.maxSize = (Game.Borders.width / Game.GlobalScale.x) - 250;
            this.updatePlayerEquip();
        }
    }
    update(delta) {
        if (!this.player) {
            return;
        }

        this.gooSpritesheet.updateAnimation(delta)
        this.goo.texture = this.gooSpritesheet.currentTexture
    }
}