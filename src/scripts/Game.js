import * as PIXI from 'pixi.js';

import UIUtils from './game/utils/UIUtils';
import config from './config';
import signals from 'signals';
import utils from './utils';

export default class Game {
    static Instance = null;
    static GlobalScale = { x: 1, y: 1 }
    static GlobalContainerPosition = { x: 0, y: 0 }
    static Screen = { width: 0, height: 0 }
    static IsPortrait = null;
    static MainLoader = new PIXI.Loader();
    static GameplayUIOverlayContainer = new PIXI.Container();
    static UIOverlayContainer = new PIXI.Container();
    static ScreenManagerContainer = new PIXI.Container();
    static TransitionContainer = new PIXI.Container();
    static Time;
    static Debug = {};
    static Borders = {
        topLeft: { x: 0, y: 0 },
        bottomLeft: { x: 0, y: 0 },
        topRight: { x: 0, y: 0 },
        bottomRight: { x: 0, y: 0 },
        width: 0,
        height: 0
    }
    constructor(config, screenManager) {
        Game.Instance = this;
        Game.GlobalScale = { x: 1, y: 1, min: 1, max: 1 }
        Game.GlobalContainerPosition = { x: 0, y: 0 }
        this.screenManager = screenManager;

        const Renderer = (config.webgl) ? PIXI.autoDetectRenderer : PIXI.CanvasRenderer;

        this.desktopResolution = {
            width: config.width,
            height: config.height,
        };

        Game.Screen.AspectRatio = 1;
        Game.Screen.width = config.width
        Game.Screen.height = config.height
        Game.Time = 0;

        Game.IsPortrait = window.innerHeight > window.innerWidth;
        this.ratio = config.width / config.height;
        window.renderer = new PIXI.Application({
            width: config.width,
            height: config.height,
            resolution: Math.max(window.devicePixelRatio, 1.5),
            antialias: false,
            backgroundColor: 0x272822
        });
        document.body.appendChild(window.renderer.view);

        this.stage = new PIXI.Container();
        window.renderer.stage.addChild(this.stage)


        this.frameskip = 1;
        this.lastUpdate = Date.now();


        this.forceResizeTimer = 5;

        this.latestWidth = 0;

        this.onAspectChanged = new signals.Signal();

        this.makeLoader();
        this.resize()
    }
    makeLoader() {
        this.loaderContainer = new PIXI.Container()
        let backLoader = new PIXI.Graphics().beginFill(0).drawRect(0, -15, 300, 30)
        this.fillLoader = new PIXI.Graphics().beginFill(0x29FF6D).drawRect(0, -15, 300, 30)
        this.loaderContainer.addChild(backLoader)
        this.loaderContainer.addChild(this.fillLoader)
        this.fillLoader.scale.x = 0
        backLoader.y = 150
        this.fillLoader.y = 150


        this.logo = new PIXI.Sprite()
        this.logo.x = 150
        this.logo.y = 0
        this.logo.anchor.set(0.5)

        this.loadingLabel = UIUtils.getPrimaryLabel('0%', { fontSize: 20 })
        this.loadingLabel.anchor.set(0.5)
        this.loadingLabel.x = 150
        this.loadingLabel.y = 150
        this.loaderContainer.addChild(this.logo)
        this.loaderContainer.addChild(this.loadingLabel)
        this.loaderContainer.pivot.x = 150
        this.stage.addChild(this.loaderContainer);

        this.loaderContainer.x = Game.Screen.width / 2
    }
    updateLoader(progress) {
        this.fillLoader.scale.x = progress / 100
        this.loadingLabel.text = Math.round(progress) + '%'
        this.resize()
    }
    initialize() {

        window.renderer.ticker.add(this._onTickEvent, this);
        setTimeout(() => {
            this.resize()
            this.stage.removeChild(this.loaderContainer);
        }, 10);
    }
    _onTickEvent(deltaTime) {
        this.dt = deltaTime / 60;
        this.update();


        if (this.latestWidth != window.innerWidth) {
            this.resize();
        }
        if (this.forceResizeTimer > 0) {
            this.forceResizeTimer -= this.dt;
            //this.resize()
        }
    }
    resize() {
        var w = window.innerHeight
        var h = window.innerWidth;

        this.latestWidth = window.innerWidth;

        window.isPortrait = w < h


        if (window.innerWidth / window.innerHeight >= this.ratio) {
            var w = window.innerHeight * this.ratio;
        } else {
            var h = window.innerWidth / this.ratio;
        }

        const width = window.innerWidth || document.documentElement.clientWidth ||
            document.body.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight ||
            document.body.clientHeight;

        var w = width;
        var h = height;
        //this.resolution = { width: window.outerWidth, height: window.outerHeight };
        this.resolution = { width: window.outerWidth, height: window.outerHeight };
        this.innerResolution = { width: w, height: h };

        window.renderer.view.style.position = 'absolute';

        window.renderer.view.style.width = `${this.innerResolution.width}px`;
        window.renderer.view.style.height = `${this.innerResolution.height}px`;




        let sclX = this.innerResolution.width / config.width
        let sclY = this.innerResolution.height / config.height


        let scl = Math.min(sclX, sclY)
        const newSize = {
            width: this.desktopResolution.width * scl,
            height: this.desktopResolution.height * scl,
        };

        window.renderer.view.style.width = `${this.innerResolution.width}px`;
        window.renderer.view.style.height = `${this.innerResolution.height}px`;


        window.renderer.view.style.left = '0px'//`${this.innerResolution.width / 2 - (newSize.width) / 2}px`;
        window.renderer.view.style.top = '0px'//`${this.innerResolution.height / 2 - (newSize.height) / 2}px`;
        // window.renderer.view.style.width = `${this.innerResolution.width}px`;
        // window.renderer.view.style.height = `${this.innerResolution.height}px`;
        //window.renderer.view.style.left = `${window.innerWidth / 2 - (this.innerResolution.width) / 2}px`;


        // let sclX = this.innerResolution.width /this.desktopResolution.width //* this.ratio
        // let sclY =  this.innerResolution.height /this.desktopResolution.height //* this.ratio


        // console.log(sclX, sclY)

        // utils.resizeToFitAR
        // let scaleMin = 1//Math.min(sclX, sclY) * this.ratio;
        // if(sclX < sclY){
        //     scaleMin = sclX* this.ratio
        // }else{

        //     scaleMin = sclY* this.ratio
        // }


        //element.scale.set(min)

        if (this.loaderContainer && this.loaderContainer.parent) {
            let newScaleX = newSize.width / this.innerResolution.width
            this.loaderContainer.scale.x = newScaleX//this.ratio
            let newScaleY = newSize.height / this.innerResolution.height
            this.loaderContainer.scale.y = newScaleY//this.ratio


            this.loaderContainer.x = Game.Screen.width / 2//this.desktopResolution.width / 2 - (this.desktopResolution.width / 2 * newScaleX) + 150 * newScaleX
            this.loaderContainer.y = Game.Screen.height / 2


        }

        if (this.screenManager) {

            if (!Game.ScreenManagerContainer.parent) {
                this.stage.addChild(Game.ScreenManagerContainer)
            }

            if (!Game.GameplayUIOverlayContainer.parent) {
                this.stage.addChild(Game.GameplayUIOverlayContainer)
            }

            if (!Game.UIOverlayContainer.parent) {
                this.stage.addChild(Game.UIOverlayContainer)
            }

            if (!Game.TransitionContainer.parent) {
                this.stage.addChild(Game.TransitionContainer)
            }

            //  let sclX = (this.innerResolution.width)/(this.desktopResolution.width) ;
            //  let sclY = (this.innerResolution.height)/(this.desktopResolution.height) ;
            //  let min = Math.min(sclX, sclY);
            // this.screenManager.scale.set(min)


            let newScaleX = newSize.width / this.innerResolution.width
            this.screenManager.scale.x = newScaleX//this.ratio
            let newScaleY = newSize.height / this.innerResolution.height
            this.screenManager.scale.y = newScaleY//this.ratio




            this.screenManager.x = this.desktopResolution.width / 2 - (this.desktopResolution.width / 2 * newScaleX)///- (this.innerResolution.width / 2 *newScaleX) // this.screenManager.scale.y
            //this.screenManager.pivot.y = this.innerResolution.height / 2 - (this.innerResolution.height / 2 / newScaleY) // this.screenManager.scale.y
            this.screenManager.y = this.desktopResolution.height / 2 - (this.desktopResolution.height / 2 * newScaleY)
            // 	this.screenManager.x = 0//window.innerWidth/2 * sclX - this.desktopResolution.width/2* sclX//this.innerResolution.width / 2 // this.screenManager.scale.x
            // 	this.screenManager.y = 0// window.innerHeight/2 * sclY - this.desktopResolution.height/2* sclY // this.screenManager.scale.y

            Game.TransitionContainer.scale.x = this.screenManager.scale.x
            Game.TransitionContainer.scale.y = this.screenManager.scale.y

            Game.GlobalScale.x = config.width / this.innerResolution.width
            Game.GlobalScale.y = config.height / this.innerResolution.height
            Game.GlobalScale.min = Math.min(Game.GlobalScale.x, Game.GlobalScale.y)
            Game.GlobalScale.max = Math.max(Game.GlobalScale.x, Game.GlobalScale.y)

            Game.GlobalContainerPosition.x = this.screenManager.x
            Game.GlobalContainerPosition.y = this.screenManager.y


            // 	//console.log(window.appScale)

            this.screenManager.resize(this.resolution, this.innerResolution);
            Game.UIOverlayContainer.scale.x = this.screenManager.scale.x
            Game.UIOverlayContainer.scale.y = this.screenManager.scale.y
            
            Game.GameplayUIOverlayContainer.scale.x = this.screenManager.scale.x
            Game.GameplayUIOverlayContainer.scale.y = this.screenManager.scale.y

            Game.ScreenManagerContainer.scale.x = this.screenManager.scale.x
            Game.ScreenManagerContainer.scale.y = this.screenManager.scale.y

            Game.Borders.topRight.x = config.width / Game.UIOverlayContainer.scale.x

            Game.Borders.bottomRight.x = Game.Borders.topRight.x
            Game.Borders.bottomRight.y = config.height / Game.UIOverlayContainer.scale.y

            Game.Borders.bottomLeft.y = Game.Borders.bottomRight.y

            Game.Borders.width = Game.Borders.topRight.x
            Game.Borders.height = Game.Borders.bottomLeft.y


            Game.Screen.AspectRatio = Game.Borders.width / Game.Borders.height;
            window.isPortrait = Game.Borders.width < Game.Borders.height

            if (Game.IsPortrait != window.isPortrait) {
                this.onAspectChanged.dispatch(window.isPortrait);
            }
            Game.IsPortrait = window.isPortrait;
        }
    }

    getBorder(type, parent) {
        var toGlobal = this.screenManager.toGlobal(Game.Borders[type])
        return parent.toLocal(toGlobal)
    }
    /**
     * 
     *  let sclX = this.innerResolution.width / config.width
        let sclY = this.innerResolution.height / config.height


        let scl = Math.min(sclX, sclY)
        const newSize = {
            width: this.desktopResolution.width * scl,
            height: this.desktopResolution.height * scl,
        };

        window.renderer.view.style.width = `${newSize.width}px`;
        window.renderer.view.style.height = `${newSize.height}px`;

  
        window.renderer.view.style.left = `${this.innerResolution.width / 2 - (newSize.width) / 2}px`;
        window.renderer.view.style.top = `${this.innerResolution.height / 2 - (newSize.height) / 2}px`;
     * 
     * 
     * 
     */
    update() {

        Game.Time += this.dt;
        this.screenManager.update(this.dt)
        // window.renderer.render(this.stage);
    }

    start() {
        //	this.animationLoop.start();
    }

    stop() {
        //	this.animationLoop.stop();
    }
}