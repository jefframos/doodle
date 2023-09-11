import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';

import CharacterBuildScreen from './CharacterBuildScreen';
import Game from '../../Game';
import GameScreen from './GameScreen';
import GameStaticData from '../data/GameStaticData';
import MainMenu from './MainMenu';
import PrizeManager from '../data/PrizeManager';
import ScreenManager from '../../screenManager/ScreenManager';
import ScreenTransition from './ScreenTransition';
import ViewDatabase from '../data/ViewDatabase';
import config from '../../config';

export default class MainScreenManager extends ScreenManager {
    static Screens = {
        GameScreen: 'GameScreen',
        MainMenu: 'MainMenu',
        CharacterBuild: 'CharacterBuild',
    }
    static ScreensTarget = {
        ScreenContainer: Game.ScreenManagerContainer,
        GameplayContainer: null,
    }
    static Transition = {
        timeIn: 1000,
        timeOut: 1000,
        transitionTimer : 1.2
    }
    constructor() {
        super();
        //this.screensContainer = Game.ScreenManagerContainer;

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams) {

            urlParams.forEach((value, key) => {
                console.log(value, key);
                Game.Debug[key] = parseFloat(value)
            })
        }





        this.settings = {
            fps: 60
        }
        window.GUI = new dat.GUI({ closed: false });
        window.GUI.add(this.settings, 'fps', 1, 120).listen();

        this.backgroundContainer = new PIXI.Container();
        this.addChild(this.backgroundContainer);
        this.setChildIndex(this.backgroundContainer, 0);

        this.gameplayScreen = new GameScreen(MainScreenManager.Screens.GameScreen, MainScreenManager.ScreensTarget.GameplayContainer);
        this.addScreen(this.gameplayScreen);

        this.mainMenuScreen = new MainMenu(MainScreenManager.Screens.MainMenu, MainScreenManager.ScreensTarget.ScreenContainer)
        this.addScreen(this.mainMenuScreen);

        this.mainMenuScreen.onStartGame.add(() => {
            this.redirectToGame({level:0});
        })

        this.characterBuilding = new CharacterBuildScreen(MainScreenManager.Screens.CharacterBuild, MainScreenManager.ScreensTarget.ScreenContainer)
        this.addScreen(this.characterBuilding);


       





        this.timeScale = 1;

        this.popUpContainer = new PIXI.Container();
        this.addChild(this.popUpContainer);


        this.popUpList = [];


        this.currentPopUp = null;
        this.prevPopUp = null;


        this.forceChange(MainScreenManager.Screens.CharacterBuild);

        //debug list
        // noEnemy
        // char - int
        // debug
        // builder
        // game   
        //noTransition
        if (Game.Debug.noTransition){
            MainScreenManager.Transition.timeIn = 1
            MainScreenManager.Transition.timeOut = 1
            MainScreenManager.Transition.transitionTimer = 0
        }
        if (Game.Debug.builder) {
            this.forceChange(MainScreenManager.Screens.CharacterBuild);
        } else if (Game.Debug.game) {
            this.forceChange(MainScreenManager.Screens.GameScreen);
        } else if (Game.Debug.debugMenu) {
            this.forceChange(MainScreenManager.Screens.MainMenu);
        }


        this.isPaused = false;

        window.onAdds.add(() => {
            this.isPaused = true;
        })

        window.onStopAdds.add(() => {
            this.isPaused = false;
        })

        // this.screenTransition = new ScreenTransition();
        // this.addChild(this.screenTransition);

        // this.screenTransition.x = config.width/2;

        if (!Game.Debug.debug) {
            window.GUI.hide()
        }

        Game.Instance.onAspectChanged.add((isPortrait) => {
            this.aspectChange(isPortrait)
        })

        this.screenTransition = new ScreenTransition();
        Game.TransitionContainer.addChild(this.screenTransition)

        this.screenTransition.x = 0
        this.screenTransition.y = 0
        //this.screenTransition.visible = false;


        this.screenTransition.transitionOut(0, true);

    }
    addCoinsParticles(pos, quant = 5, customData = {}) {
        this.particleSystem.show(pos, quant, customData)
    }

    showPopUp(label, param = null) {

        if (this.currentPopUp) //} && this.currentPopUp.label != label)
        {
            this.prevPopUp = this.currentPopUp;
        }
        for (var i = 0; i < this.popUpList.length; i++) {
            if (this.popUpList[i].label == label) {
                if (this.particleSystem) {
                    this.particleSystem.killAll();
                }
                this.popUpList[i].show(param);
                this.popUpContainer.addChild(this.popUpList[i]);
                this.currentPopUp = this.popUpList[i];
                if (!this.prevPopUp) {
                    this.prevPopUp = this.popUpList[i];
                }
            }
        }
    }
    forceChange(screenLabel, param) {

        super.forceChange(screenLabel, param);
        // this.screenTransition.startTransitionOut();               
    }
    change(screenLabel, param) {

        super.change(screenLabel, param);


    }
    startTransitionInTo(screen) {
        //console.log("startTransitionInTo", screen.label)
        this.screenTransition.transitionOut();
        
    }
    startTransitionOutTo(screen, nextScreen) {
        //console.log("startTransitionOutTo", screen.label, nextScreen.label)
        this.screenTransition.transitionIn();
    }

    endTransitionInTo(screen) {
        //console.log("endTransitionInTo", screen.label)
    }
    endTransitionOutTo(screen, nextScreen) {
        //console.log("endTransitionOutTo", screen.label, nextScreen.label)
    }
  
    redirectToDebugMenu() {
        this.change(MainScreenManager.Screens.MainMenu);
    }
    redirectToMenu(fromWin = null) {
        this.change(MainScreenManager.Screens.CharacterBuild, {fromWin});
    }
    redirectToGame(params,harder) {
        window.HARDER = harder
        this.change(MainScreenManager.Screens.GameScreen, params);
    }
    update(delta) {
        this.settings.fps = window.FPS

        this.screenTransition.update(delta)

        if (this.isPaused) return;
        super.update(delta * this.timeScale);

        if (this.currentPopUp) {
            this.currentPopUp.update(delta * this.timeScale)
        }
        if (this.prevPopUp && this.prevPopUp.toRemove && this.prevPopUp.parent) {
            this.prevPopUp.parent.removeChild(this.prevPopUp);
            this.prevPopUp = null;
        }

        // if(this.screenTransition.active){
        //     this.screenTransition.update(delta)
        // }
    }

    toGame() {
        if (this.currentScreen.label == MainScreenManager.Screens.GameScreen) {
            this.currentScreen.resetGame();
            this.particleSystem.killAll();
        }
    }

    resize(newSize, innerResolution) {
        super.resize(newSize, innerResolution);


        if (this.screenTransition) {
            this.screenTransition.x = Game.Borders.width / 2
            this.screenTransition.y = Game.Borders.height / 2
            this.screenTransition.resize(newSize, innerResolution);
        }
    }

    shake(force = 1, steps = 4, time = 0.25) {
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;
        for (var i = steps; i >= 0; i--) {
            timelinePosition.append(TweenLite.to(this.screensContainer, speed, {
                x: Math.random() * positionForce - positionForce / 2,
                y: Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.screensContainer, speed, {
            x: 0,
            y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }
}