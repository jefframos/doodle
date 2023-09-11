import * as PIXI from 'pixi.js';

import GameData from '../../../data/GameData';
import GameStaticData from '../../../data/GameStaticData';
import InteractableView from '../../../view/card/InteractableView';
import PlayerGameViewSpriteSheet from '../../PlayerGameViewSpriteSheet';
import PlayerViewStructure from '../../../entity/PlayerViewStructure';
import SpriteSheetAnimation from '../../utils/SpriteSheetAnimation';
import UIList from '../../../ui/uiElements/UIList';
import signals from 'signals';

export default class CharacterBuildScreenCustomizationView extends PIXI.Container {
    constructor(data, id) {
        super();

        this.id = id;
        this.onUpdateCurrentPlayer = new signals.Signal();

        this.playerPreviewSprite = new PIXI.Sprite();

        this.companion = new PIXI.Sprite();
        this.companion.scale.set(1.25)

        this.companionAnimation = new SpriteSheetAnimation();


        this.playerPreviewStructure = new PlayerGameViewSpriteSheet();
        this.playerPreviewStructure.enable();
        this.playerPreviewStructure.baseScale = 1
        this.playerPreviewStructure.sinSpeed = 2
        this.playerPreviewStructure.view = this.playerPreviewSprite
        this.playerPreviewStructure.setData({})

        this.playerViewDataStructure = new PlayerViewStructure();

        if (data) {
            this.playerViewDataStructure.parse(data)
        }
        this.playerPreviewStructure.buildSpritesheet(this.playerViewDataStructure)

        this.playerViewDataStructure.onStructureUpdate.add(() => {
            GameData.instance.savePlayer(this.id, this.playerViewDataStructure)
        })
        this.playerViewDataStructure.onColorUpdate.add(() => {
            GameData.instance.savePlayer(this.id, this.playerViewDataStructure)
        })

        this.addChild(this.playerPreviewSprite);
        this.addChild(this.companion);
        this.companion.x = 120
        this.companion.y = 0

        InteractableView.addMouseDown(this.playerPreviewSprite, () => {
            if (!this.buttonsContainer.visible) {
                return;
            }
            //this.updateCurrentPlayer(this.id);

            this.onUpdateCurrentPlayer.dispatch(this.id)


        })
        //this.id = this.activePlayers.length;



        this.buttonsContainer = new PIXI.Container();
        this.addChild(this.buttonsContainer);

        const buttonsUIList = new UIList();
        buttonsUIList.w = 200
        buttonsUIList.h = 50
        buttonsUIList.x = -buttonsUIList.w / 2
        buttonsUIList.y = buttonsUIList.h / 2
        this.buttonsContainer.addChild(buttonsUIList)
        this.buttonsContainer.visible = true;

        this.hasCompanion = false;
        this.companionSin = Math.random() * 3.14;

    }
    removeCompanion() {
        this.companion.texture = PIXI.Texture.EMPTY;
        this.hasCompanion = false;

    }
    setCompanion(companionData) {
        let idle = GameStaticData.instance.getSharedDataById('animation', companionData.animationData.run).animationData
        this.companion.baseScale = companionData.view.scale
        this.companion.scale.set(this.companion.baseScale)
        this.companion.anchor.x = idle.params.anchor.x
        this.companion.anchor.y = idle.params.anchor.y
        this.companion.y = -companionData.view.jumpHight;
        this.companion.texture = PIXI.Texture.from(companionData.entityData.icon)


        this.companionAnimation.addLayer('standard', idle.spriteName, {
            totalFramesRange: idle.params.totalFramesRange,
            addZero: idle.params.addZero,
            time: idle.params.time
        })
        this.companionAnimation.play('standard')
        this.hasCompanion = true;

    }
    update(delta) {
        this.playerPreviewStructure.update(delta)
        if (!this.hasCompanion) {
            return;
        }
        this.companionAnimation.update(delta)
        this.companion.texture = this.companionAnimation.currentTexture;
        this.companionSin += delta * 0.5;

        const convertedBaseScale = this.playerPreviewStructure.baseScale * this.companion.baseScale
        const cos = Math.cos(this.companionSin)
        const sin = Math.sin(this.companionSin)
        this.companion.x = cos * 80*convertedBaseScale
        this.companion.y = Math.sin(this.companionSin) * 50*convertedBaseScale

        this.companion.scale.set(sin > 0 ? convertedBaseScale * -1 :  convertedBaseScale,  convertedBaseScale)


        this.children.sort((a, b) => {
            if (a.y < b.y) {
                return -1;
            } else if (a.y > b.y) {
                return 1;
            } else {
                return 0;
            }
        });
    }
}