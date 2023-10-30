import Game from "../../Game";
import Screen from "../../screenManager/Screen";
import Eugine from "../core/Eugine";
import PerspectiveCamera from "../core/PerspectiveCamera";
import Vector3 from "../core/gameObject/Vector3";
import RenderModule from "../core/modules/RenderModule";
import Pool from "../core/utils/Pool";
import Creature from "../entities/animation/Creature";
import EffectsManager from "../manager/EffectsManager";
import MainScreenManager from "./MainScreenManager";

export default class ArenaScreen extends Screen {
    constructor(label, targetContainer) {
        super(label, targetContainer);


        this.container = new PIXI.Container()
        this.addChild(this.container);

        this.gameplayContainer = new PIXI.Container();
        this.effectsContainer = new PIXI.Container();
        this.uiContainer = new PIXI.Container();

        this.container.addChild(this.gameplayContainer)
        this.container.addChild(this.effectsContainer)
        this.container.addChild(this.uiContainer)

        this.gameEngine = new Eugine();


        this.physics = this.gameEngine.physics
        this.renderModule = this.gameEngine.addGameObject(new RenderModule(this.gameplayContainer, this.uiContainer, Game.GameplayUIOverlayContainer))
        //this.inputModule = this.gameEngine.addGameObject(new InputModule(this))
        this.effectsManager = this.gameEngine.addGameObject(new EffectsManager(this.effectsContainer, this.gameplayContainer))
        this.camera = this.gameEngine.addCamera(new PerspectiveCamera())

        this.camera.setFollowPoint(new Vector3())

    }
    build(param) {
        super.build();
        this.gameEngine.start();
        //this.worldRender = this.gameEngine.addGameObject(new EnvironmentManager());

        let entity = this.gameEngine.poolGameObject(Creature, true)
        entity.x = 50

        let entity2 = this.gameEngine.poolGameObject(Creature, true)
        entity2.x = -50
    }
    update(delta) {
        const timeScale = 1.25
        const debugTimeScale = Game.Debug.timeScale | 1
        const scaledTime =  delta * debugTimeScale * timeScale;
        delta *= debugTimeScale;
        this.gameEngine.update(scaledTime, delta* debugTimeScale)
    }
    transitionOut(nextScreen, params) {
        this.removeEvents();
        this.nextScreen = nextScreen;
        super.transitionOut(nextScreen, params, MainScreenManager.Transition.timeOut);
    }
    transitionIn(param) {

        setTimeout(() => {
            super.transitionIn(param);
        }, MainScreenManager.Transition.timeIn);
    }

    aspectChange(isPortrait) {

        this.gameEngine.aspectChange(isPortrait);
    }
    resize(resolution, innerResolution) {
        this.container.x = config.width / 2
        this.container.y = config.height / 2
        this.gameEngine.resize(resolution, innerResolution);
    }
}