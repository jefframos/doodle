import * as PIXI from 'pixi.js';

import BaseButton from '../components/ui/BaseButton';
import CookieManager from '../CookieManager';
import Game from '../../Game';
import InteractableView from '../view/card/InteractableView';
import MainScreenContainer from './mainScreen/MainScreenContainer';
import MainScreenManager from './MainScreenManager';
import Screen from '../../screenManager/Screen'
import UIUtils from '../utils/UIUtils';
import signals from "signals";

export default class MainMenu extends Screen {
    constructor(label, targetContainer) {
        super(label, targetContainer);

        this.container = new PIXI.Container()
        this.addChild(this.container);
        
        this.mainScreenContainer = new MainScreenContainer();
        this.container.addChild(this.mainScreenContainer);
        
        
        this.onStartGame = new signals.Signal();
        
        this.startGame = new BaseButton( UIUtils.baseButtonTexture+'_0007', 350, 50);
        const confirmText = new PIXI.Text('Start', window.LABELS.LABEL1)
        confirmText.style.strokeThickness = 0
        confirmText.style.fontSize = 32
        this.startGame.addLabelOnCenter(confirmText)
        InteractableView.addMouseUp(this.startGame, () => { 
            this.onStartGame.dispatch();             
        })
        this.container.addChild(this.startGame);

        this.charcatrBuilder = new BaseButton( UIUtils.baseButtonTexture+'_0007', 350, 50);
        const charBuilder = new PIXI.Text('Build', window.LABELS.LABEL1)
        charBuilder.style.strokeThickness = 0
        charBuilder.style.fontSize = 32
        this.charcatrBuilder.addLabelOnCenter(charBuilder)
        InteractableView.addMouseUp(this.charcatrBuilder, () => { 
            this.screenManager.change(MainScreenManager.Screens.CharacterBuild)
        })
        
        this.container.addChild(this.charcatrBuilder);



        this.cleanCache = new BaseButton( UIUtils.baseButtonTexture+'_0004', 350, 50);
        const wipData = new PIXI.Text('WipeData', window.LABELS.LABEL1)
        wipData.style.strokeThickness = 0
        wipData.style.fontSize = 32
        this.cleanCache.addLabelOnCenter(wipData)
        InteractableView.addMouseUp(this.cleanCache, () => { 
            CookieManager.instance.wipeData();
        })
        
        this.container.addChild(this.cleanCache);

        this.unlockCosmetics = new BaseButton( UIUtils.baseButtonTexture+'_0007', 350, 50);
        const unlockAllCosmetics = new PIXI.Text('Cosmetics', window.LABELS.LABEL1)
        unlockAllCosmetics.style.strokeThickness = 0
        unlockAllCosmetics.style.fontSize = 32
        this.unlockCosmetics.addLabelOnCenter(unlockAllCosmetics)
        InteractableView.addMouseUp(this.unlockCosmetics, () => { 
            CookieManager.instance.unlockAllWardrobe();
        })
        
        this.container.addChild(this.unlockCosmetics);
    }
    build(){
        super.build();
    }
    update(delta){

        this.charcatrBuilder.x =  Game.Borders.width / 2- this.charcatrBuilder.width / 2
        this.charcatrBuilder.y =  Game.Borders.height / 2 - 50

        this.startGame.x =  Game.Borders.width / 2 - this.startGame.width / 2
        this.startGame.y =  Game.Borders.height / 2 + 50


        this.cleanCache.x =  Game.Borders.width / 2 - this.cleanCache.width / 2
        this.cleanCache.y =  Game.Borders.height / 2 + 200


        this.unlockCosmetics.x =  Game.Borders.width / 2 - this.unlockCosmetics.width / 2
        this.unlockCosmetics.y =  Game.Borders.height / 2 - 150
    }
}