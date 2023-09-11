import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';

import AmbientLightSystem from '../components/AmbientLightSystem';
import BaseEnemy from '../entity/BaseEnemy';
import Bullet from '../components/weapon/bullets/Bullet';
import CameraOcclusion2D from '../components/CameraOcclusion2D';
import EffectsManager from '../manager/EffectsManager';
import EnvironmentManager from '../manager/EnvironmentManager';
import Eugine from '../core/Eugine';
import Game from '../../Game';
import GameStaticData from '../data/GameStaticData';
import InputModule from '../core/modules/InputModule';
import Layer from '../core/Layer';
import LevelManager from '../manager/LevelManager';
import MainScreenManager from './MainScreenManager';
import PerspectiveCamera from '../core/PerspectiveCamera';
import Player from '../entity/Player';
import Pool from '../core/utils/Pool';
import RenderModule from '../core/modules/RenderModule';
import Screen from '../../screenManager/Screen'
import TouchAxisInput from '../core/modules/TouchAxisInput';
import UIButton1 from '../ui/UIButton1';
import UIList from '../ui/uiElements/UIList';
import Vector3 from '../core/gameObject/Vector3';
import config from '../../config';
import RewardsManager from '../data/RewardsManager';

export default class GameScreen extends Screen {
    constructor(label, targetContainer) {
        super(label, targetContainer);


        // this.back = UIUtils.getRect(0xFF0000, 10000,10000)
        // this.addChild(this.back);

        this.container = new PIXI.Container()
        this.addChild(this.container);

        window.gameplayFolder = window.GUI.addFolder('Gameplay');

        PIXI.BitmapFont.from('damage1', {
            fontFamily: 'retro',
            align: "center",
            dropShadow: true,
            dropShadowAngle: 1.5,
            fontSize: 14,
            dropShadowDistance: 3,
            fill: "#ffcd1a",
            fontWeight: "bold",
            letterSpacing: 5,
            strokeThickness: 3,
            wordWrap: true,
            wordWrapWidth: 300
        });

        this.gameplayContainer = new PIXI.Container();
        this.effectsContainer = new PIXI.Container();
        this.uiContainer = new PIXI.Container();

        this.container.addChild(this.gameplayContainer)
        this.container.addChild(this.effectsContainer)
        this.container.addChild(this.uiContainer)

        this.gameEngine = new Eugine();
        window.ENGINE = this.gameEngine;

        this.worldTestContainer = new PIXI.Container();
        //this.worldManager = new WorldManager(this.worldTestContainer)
        this.addChild(this.worldTestContainer)



        this.physics = this.gameEngine.physics
        this.renderModule = this.gameEngine.addGameObject(new RenderModule(this.gameplayContainer, this.uiContainer, Game.GameplayUIOverlayContainer))
        this.inputModule = this.gameEngine.addGameObject(new InputModule(this))
        this.effectsManager = this.gameEngine.addGameObject(new EffectsManager(this.effectsContainer, this.gameplayContainer))
        this.camera = this.gameEngine.addCamera(new PerspectiveCamera())
        this.camera.addComponent(CameraOcclusion2D);
        this.camera.addComponent(AmbientLightSystem);
        this.camera.setFollowPoint(new Vector3())

        this.levelManager = new LevelManager(this.gameEngine);
        this.levelManager.onPlayerDie.add(this.playerDie.bind(this))
        this.levelManager.onConfirmGameOver.add(this.confirmGameOver.bind(this))
        this.debug = {
            timeScale: 1,
            enemiesPool: 0,
            bulletsPool: 0,
            REMOVE_ENEMIES: () => {
                this.destroyRandom(50)
            },
            ADD_ENEMIES: () => {
                for (let index = 0; index < 100; index++) {
                    setTimeout(() => {
                        this.addRandomAgents(1)
                    }, 5 * index);

                }
            },
            ADD_ONE_ENEMY: () => {
                this.addRandomAgents(1)
            },
            DAMAGE_PLAYER: () => {
                this.killPlayer();
            },
            RESPAWN: () => {
                this.spawnPlayer();
            },
            KILL_ALL_ENEMIES: () => {
                this.killAllEnemies();
            },
            BLOOD_SPLAT: () => {
                this.effectsManager.testParticles(this.player);
            }
        }
        window.gameplayFolder.add(this.debug, 'timeScale', 0.1, 10);
        window.gameplayFolder.add(this.debug, 'enemiesPool').listen();
        window.gameplayFolder.add(this.debug, 'bulletsPool').listen();
        window.gameplayFolder.add(this.debug, 'REMOVE_ENEMIES');
        window.gameplayFolder.add(this.debug, 'ADD_ENEMIES');
        window.gameplayFolder.add(this.debug, 'ADD_ONE_ENEMY');
        window.gameplayFolder.add(this.debug, 'RESPAWN');
        window.gameplayFolder.add(this.debug, 'DAMAGE_PLAYER');
        window.gameplayFolder.add(this.debug, 'KILL_ALL_ENEMIES');
        window.gameplayFolder.add(this.debug, 'BLOOD_SPLAT');

        //window.GUI.close()

        // this.zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0,0,10)
        // this.addChild(this.zero)

        //this should be on the input
        this.touchAxisInput = new TouchAxisInput();

        this.addChild(this.touchAxisInput)

        this.touchAxisInput.x = config.width / 2
        this.touchAxisInput.y = config.height - 200


        this.helperButtonList = new UIList();
        this.helperButtonList.h = 200;
        this.helperButtonList.w = 60;
        this.speedUpToggle = new UIButton1(0x002299, 'fast_forward_icon', 0xFFFFFF, 60, 60)
        this.helperButtonList.addElement(this.speedUpToggle)
        this.speedUpToggle.onClick.add(() => {
            for (let index = 0; index < 100; index++) {
                setTimeout(() => {
                    this.addRandomAgents(1)
                }, 5 * index);

            }
        })

        this.removeEntities = new UIButton1(0x002299, 'icon_close', 0xFFFFFF, 60, 60)
        this.helperButtonList.addElement(this.removeEntities)
        this.removeEntities.onClick.add(() => {
            this.destroyRandom(50)
            // for (let index = 0; index < 100; index++) {
            //     setTimeout(() => {
            //     }, 5 * index);

            // }
        })

        this.stats = new PIXI.Text('fps')
        this.stats.style.fill = 0xFFFFFF
        this.stats.style.fontSize = 20
        this.stats.style.align = 'right'
        this.stats.anchor.set(1)
        this.helperButtonList.addElement(this.stats)

        this.helperButtonList.updateVerticalList()
        this.helperButtonList.x = config.width - 50
        this.helperButtonList.y = 80

        if (window.isMobile) {

            if (Game.Debug.debug) {
                this.addChild(this.helperButtonList)
            }
            window.GUI.close()
            window.GUI.hide()

            this.camera.targetZoom = 1.5
        }

        this.container.scale.set(1)


    }

    onAdded() {


    }
    destroyRandom(quant) {
        for (let index = 0; index < quant; index++) {

            let id = this.gameEngine.gameObjects.length - index - 1;
            if (this.gameEngine.gameObjects.length <= 0) continue;
            if (id <= 0) continue;
            if (this.gameEngine.gameObjects[id].layerCategory != Layer.Enemy) continue;

            this.gameEngine.destroyGameObject(this.gameEngine.gameObjects[id])
        }
    }
    addRandomAgents(quant) {
        for (let index = 0; index < quant; index++) {

            GameManager.instance.spawnRandomEnemy();


        }
    }
    killAllEnemies() {
        for (let index = this.levelManager.activeEnemies.length - 1; index >= 0; index--) {
            const element = this.levelManager.activeEnemies[index];
            element.destroy();
        }

    }
    killPlayer() {
        this.levelManager.player.damage(50);
        //this.companion.destroy();

    }
    confirmGameOver(fromWin) {
        this.screenManager.redirectToMenu(fromWin);
    }
    playerDie() {
    }

    spawnPlayer() {

        //this.player = this.levelManager.addEntity(Player, GameStaticData.instance.getEntityByIndex('player', Math.floor(Math.random() * 7)))

        this.levelManager.setup();
        this.levelManager.start(this.currentLevelParams);
        this.levelManager.initGame();

        //console.log(Eugine.PhysicsTimeScale, "<--- implement timeScale")
    }

    build(param) {
        this.currentLevelParams = param;
        super.build();
        this.addEvents();
        this.gameEngine.start();
        this.spawnPlayer(); //SEND PLAYER PARAMETERS HERE
        this.worldRender = this.gameEngine.addGameObject(new EnvironmentManager());
    }
    update(delta) {
        delta *= this.debug.timeScale;
        this.levelManager.update(delta * Eugine.TimeScale)
        this.gameEngine.update(delta)
        this.levelManager.lateUpdate(delta * Eugine.TimeScale)

        this.debug.enemiesPool = Pool.instance.getPool(BaseEnemy).length
        this.debug.bulletsPool = Pool.instance.getPool(Bullet).length

        

        if (window.isMobile) {

            if (this.touchAxisInput.angle) {
            }
            
            this.touchAxisInput.visible = Eugine.TimeScale > 0;

            if (!this.touchAxisInput.visible) {
                this.inputModule.direction = 0;
                this.touchAxisInput.reset();
                this.inputModule.touchAxisDown = false;
                this.inputModule.mouseDown = false;
                
            } else {
                this.inputModule.touchAxisDown = this.touchAxisInput.dragging
                this.inputModule.direction = this.touchAxisInput.angle
            }
        } else {
            this.touchAxisInput.visible = false;
        }

        this.stats.text = 'FPS: ' + window.FPS + '\nPhys: ' + this.physics.physicsStats.totalPhysicsEntities

    }
    transitionOut(nextScreen, params) {
        this.removeEvents();
        this.nextScreen = nextScreen;

        setTimeout(() => {
            this.worldRender.destroy();
            this.levelManager.destroy();
        }, MainScreenManager.Transition.timeOut);

        super.transitionOut(nextScreen, params, MainScreenManager.Transition.timeOut);
    }
    transitionIn(param) {

        SOUND_MANAGER.playLoop('ancient', 0.5)

        RewardsManager.instance.gameplayStart(true);

        setTimeout(() => {
            super.transitionIn(param);
        }, MainScreenManager.Transition.timeIn);
    }

    destroy() {

    }
    removeEvents() {
    }
    addEvents() {
        this.removeEvents();

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