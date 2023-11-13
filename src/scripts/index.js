import * as PIXI from 'pixi.js';

import CookieManager from './game/CookieManager';
import Game from './Game';
import GameStaticData from './game/data/GameStaticData';
import MainScreenManager from './game/screen/MainScreenManager';
import SoundManager from './soundManager/SoundManager'
import Utils from './game/core/utils/Utils';
import audioManifest from './manifests/manifest-audio'
import globals from './globals';
import jsonManifest from './manifests/manifest-json'
import plugins from './plugins';
import signals from 'signals';
import spritesheetManifest from './manifests/manifest'

window.PIXI = PIXI;


//Utils.easeOutQuad
// getValues(10, 60, 'floor', 'easeOutQuad', 1, 5)
// getValues(10, 40, 'floor', 'easeOutQuad', 1, 5)
// getValues(8, 28, 'floor', 'easeOutQuad', 1, 5)
// getValues(40, 100, 'floor', 'easeOutQuad', 1, 5)
// getValues(12, 40, 'floor', 'easeOutQuad', 1, 5)
// getValues(20, 200, 'floor', 'easeOutQuad', 1, 5)
// getValues(12, 35, 'floor', 'easeOutQuad', 1, 5)
// getValues(10, 30, 'floor', 'easeOutQuad', 1, 5)
//   getValues(2, 30, 'floor', 'easeOutQuad', 0.8,5)
//   getValues(2, 10, 'floor', 'easeOutQuad', 0.8,5)

//   getValues(1, 15, 'floor', 'easeOutQuad', 0.8,5)
//   getValues(10, 120, 'floor', 'easeOutQuad', 0.8,5)

//   getValues(1, 15, 'floor', 'easeOutQuad', 0.8,5)
//   getValues(2, 25, 'floor', 'easeOutQuad', 0.8,5)

//   getValues(5, 40, 'floor', 'easeOutQuad', 0.8,5)

//   getValues(2, 30, 'floor', 'easeOutQuad', 0.8,5)
//   getValues(2, 10, 'floor', 'easeOutQuad', 0.8,5)

//   getValues(2, 10, 'floor', 'easeOutQuad', 0.8,5)
//   getValues(10, 120, 'floor', 'easeOutQuad', 0.8,5)

//   getValues(2, 10, 'floor', 'easeOutQuad', 0.8,5)
 //getValues(0.4, 0.12, null, 'easeOutCubic', 0.8, 10)
// getValues(0.025, 0.2, null, 'easeOutCubic', 0.8, 5)
// getValues(0.12, 0.35, null, 'easeOutCubic', 0.8, 5)
 getValues(0.3, 0.8, null, 'easeOutCubic', 0.8, 5)
// getValues(4, 8, null, 'easeOutQuad', 1, 5)
// getValues(55, 380, 'floor', 'easeOutQuad', 1, 5)


// //  getValues(10, 250, 'floor', 'easeOutQuad', 0.8,5)
// getValues(50, 120, 'floor', 'easeOutCubic', 1, 5, 0.8)


 //getValues(30, 50, 'floor', 'easeOutQuad', 1, 10)
// getValues(15, 300, 'floor', 'easeOutQuad', 1, 10)
// getValues(40, 400, 'floor', 'easeOutQuad', 1, 10)
// getValues(100, 500, 'floor', 'easeOutQuad', 1, 10)
// getValues(35, 280, 'floor', 'easeOutQuad', 1, 10)
// getValues(800, 2500, 'floor', 'easeOutQuad', 1, 10)
// getValues(22, 280, 'floor', 'easeOutQuad', 1, 10)
// getValues(1000, 3000, 'floor', 'easeOutQuad', 1, 10)
// getValues(15, 280, 'floor', 'easeOutQuad', 1, 10)
// getValues(50, 750, 'floor', 'easeOutQuad', 1, 10)
// getValues(55, 900, 'floor', 'easeOutQuad', 1, 10)

// getValues(0.3, 0.18, null, 'easeOutCubic', 1)
function getValues(value1, value2, math = null, ease = 'easeOutCubic', scale = 0.8, total = 10) {

    let list = '[' //+ value1 +','
    for (let index = (total - 1); index >= 0; index--) {
        let n = Utils[ease]((index / (total - 1)) * scale)
        let v = Utils.lerp(value2, value1, n)// * Math.abs(value2 - value1) + value2
        v = v.toFixed(2)
        if (math) {
            v = Math[math](v)
        }
        list += v

        if (index > 0) {
            list += ','
        }


    }
    list += ']'
    console.log(list)
}


//(function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = 'https://mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })()


window.iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
window.isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);


if (!window.isMobile) {
    config.width = config.desktopRes.width
    config.height = config.desktopRes.height
} else {
    config.width = config.mobileRes.width
    config.height = config.mobileRes.height
}





window.noPoki = true;


window.onAdds = new signals.Signal();
window.onStopAdds = new signals.Signal();

window.SOUND_MANAGER = new SoundManager();


window.game = new Game(config);

Game.MainLoader = new PIXI.Loader();



const jsons = [];

if (!window.noPoki) {

    PokiSDK.init().then(
        () => {
            console.log("Poki SDK successfully initialized");
            loadManifests();


            RewardsManager.instance.hasAdBlock = false;
        }
    ).catch(
        () => {
            loadManifests();
            console.log("Initialized, but the user likely has adblock");
            RewardsManager.instance.hasAdBlock = true;
            // fire your function to continue to game
        }
    );
} else {
    loadManifests();

}

//loadManifests();

function loadManifests() {
    if (!window.noPoki) {



        RewardsManager.instance.initialize(window.noPoki);
        PokiSDK.gameLoadingStart();


    }


    for (var i = spritesheetManifest['default'].length - 1; i >= 0; i--) {
        let dest = 'assets/' + spritesheetManifest['default'][i]
        
        jsons.push(dest);
        Game.MainLoader.add(dest)
    }
    Game.MainLoader.add('pokes.json')
    Game.MainLoader.load(afterLoadManifests);
}
//PokiSDK.setDebug(true);

function afterLoadManifests(evt) {

    for (var key in PIXI.utils.TextureCache) {
        var copyKey = key;
        copyKey = copyKey.substr(0, copyKey.length - 4)
        copyKey = copyKey.split('/')
        copyKey = copyKey[copyKey.length - 1]
        var temp = PIXI.utils.TextureCache[key];
        delete PIXI.utils.TextureCache[key];
        PIXI.utils.TextureCache[copyKey] = temp;
    }

    startLoader();

}

function startLoader() {


    iOS = true;
    for (var i = 0; i < jsonManifest.length; i++) {
        jsonManifest[i].url = jsonManifest[i].url.replace(/\\/, "/")
        let url = jsonManifest[i].url//.substr(0, jsonManifest[i].url.length - 4);
        Game.MainLoader.add(jsonManifest[i].id, url)
    }

    for (var i = 0; i < audioManifest.length; i++) {
        audioManifest[i].url = audioManifest[i].url.replace(/\\/, "/")
        let url = audioManifest[i].url.substr(0, audioManifest[i].url.length - 4);

        if (iOS) {
            url += '.mp3'
        } else {
            url += '.ogg'
        }

        Game.MainLoader.add(audioManifest[i].id, url)
    }
    //console.log('load fonts here maybe...');
    Game.MainLoader
        .add('./assets/fonts/stylesheet.css')
        .add('./assets/fonts/poppins-black-webfont.woff')
        .add('./assets/fonts/poppins-bold-webfont.woff')
        .add('./assets/fonts/poppins-extrabold-webfont.woff')
        .add('./assets/fonts/poppins-medium-webfont.woff')
        .add('./assets/fonts/poppins-regular-webfont.woff')
        .load(configGame);

    Game.MainLoader.onProgress.add((e) => {
        game.updateLoader(e.progress)
    })
}


window.loadedOnce = false;

function configGame(evt) {

    GameStaticData.instance.initialize();


    //breaks on mobile
    // const firstPlayer = CookieManager.instance.getPlayer(0)
    // if (!firstPlayer) {
    //     CookieManager.instance.savePlayer(0)
    // }
    // CookieManager.instance.sortPlayers()


    //ViewDatabase.instance.initialize();
    //window.localizationManager = new LocalizationManager('');
    SOUND_MANAGER.load(audioManifest);
    window.RESOURCES = evt.resources;
    window.TILE_ASSSETS_POOL = []

    if (!window.noPoki && !window.loadedOnce) {
        PokiSDK.gameLoadingFinished();
        window.loadedOnce = true;
    }

    if (!window.screenManager) {
        window.screenManager = new MainScreenManager();
    }

    game.screenManager = screenManager;
    game.stage.addChild(screenManager);
    game.initialize()
    game.start();

    setTimeout(() => {
        game.resize();
    }, 1);
    //RewardsManager.instance.gameplayStart(true)
    //window.addEventListener("focus", myFocusFunction, true);
    //window.addEventListener("blur", myBlurFunction, true);

    //SOUND_MANAGER.playLoop('dream1')
    setTimeout(() => {
        game.resize();
    }, 100);

    if(CookieManager.instance.isMute){
        SOUND_MANAGER.mute();
    }
}

window.onresize = function (event) {
    if (!window.game) return;
    window.game.resize();
};
function myFocusFunction() {
    TweenLite.killTweensOf(screenManager);
    // TweenLite.to(screenManager, 0.5, {
    //     timeScale: 1
    // })
    // if (GAME_DATA.mute) {
    //     return
    // }
    if (!CookieManager.instance.getSettings().isMute) {
        SOUND_MANAGER.unmute();
    }else{
        SOUND_MANAGER.mute(false);
    }
}

function myBlurFunction() {
    TweenLite.killTweensOf(screenManager);
    // TweenLite.to(screenManager, 0.5, {
    //     timeScale: 0
    // })
   
    if (CookieManager.instance.getSettings().isMute) {
        SOUND_MANAGER.mute(false);
    }
}


window.onEscPressed = new signals();
window.onSpacePressed = new signals();

window.getKey = function (e) {
    if (window.GAMEPLAY_IS_STOP) return;
    if (e.key === "Escape") { // escape key maps to keycode `27`
        // <DO YOUR WORK HERE>
        window.onEscPressed.dispatch()
        // if(this.gameRunning){
        // 	this.inGameMenu.toggleState();
        // }
    }

    if (e.keyCode === 32) { // escape key maps to keycode `27`
        window.onSpacePressed.dispatch()
        // <DO YOUR WORK HERE>

    }
}

document.addEventListener('keydown', (event) => {
    window.getKey(event);
    event.preventDefault()
})
//tryStuff()

var startTime = Date.now();
var frame = 0;


window.FPS = 0
function tick() {
    var time = Date.now();
    frame++;
    if (time - startTime > 1000) {
        window.FPS = (frame / ((time - startTime) / 1000)).toFixed(1);
        startTime = time;
        frame = 0;
    }
    window.requestAnimationFrame(tick);
}
tick();

