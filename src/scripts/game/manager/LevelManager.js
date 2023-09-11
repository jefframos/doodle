import BaseEnemy from "../entity/BaseEnemy";
import Camera from "../core/Camera";
import Collectable from "../entity/Collectable";
import Consumable from "../entity/Consumable";
import DirectionPin from "../entity/DirectionPin";
import EffectsManager from "./EffectsManager";
import EnemyGlobalSpawner from "./EnemyGlobalSpawner";
import Eugine from "../core/Eugine";
import Game from "../../Game";
import GameData from "../data/GameData";
import GameOverView from "../components/ui/gameOver/GameOverView";
import GameStaticData from "../data/GameStaticData";
import GameplaySessionController from "./GameplaySessionController";
import InGameChest from "../entity/InGameChest";
import Layer from "../core/Layer";
import Player from "../entity/Player";
import PlayerSessionData from "../data/PlayerSessionData";
import Pool from "../core/utils/Pool";
import SessionSpawner from "./spawn/SessionSpawner";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";
import signals from "signals";

export default class LevelManager {
    static _instance;

    static get instance() {
        return LevelManager._instance;
    }
    constructor(engine) {
        LevelManager._instance = this;
        this.gameEngine = engine;
        this.gameplayEntities = [];
        this.entityRegister = [];
        this.activeEnemies = [];
        this.collectables = [];
        this.consumables = [];
        this.entitiesByType = {};
        this.entitiesByTier = [[], [], [], [], [], [], []];

        this.gameManagerStats = {
            GMtotalGameObjects: 0,
            GMenemiesDeaths: 0,
            Phase: 0,
            Time: 0,
        }
        window.gameplayFolder.add(this.gameManagerStats, 'GMtotalGameObjects').listen();
        window.gameplayFolder.add(this.gameManagerStats, 'GMenemiesDeaths').listen();

        window.gameplayFolder.add(this.gameManagerStats, 'Phase').listen();
        window.gameplayFolder.add(this.gameManagerStats, 'Time').listen();

        //this.destroyDistance = 1000;

        this.enemyGlobalSpawner = new EnemyGlobalSpawner(this);
        this.gameplayTime = 0;

        this.onPlayerDie = new signals.Signal();
        this.onConfirmGameOver = new signals.Signal();

        this.currentPhase = 0;
        this.init = false;

        this.matchStats = {
            enemiesKilled: 0,
            time: 0
        }

        this.timeLimit = 8 * 60;

        this.itemPools = [
            {
                types: [Consumable.Type.Heal, Consumable.Type.Bomb, Consumable.Type.Magnet, Consumable.Type.Coin],
                spawnTime: 45,
                currentSpawnTime: 0
            },
            {
                types: [Consumable.Type.Heal, Consumable.Type.Coin],
                spawnTime: 60,
                currentSpawnTime: 0
            },
            {
                types: [Consumable.Type.Bomb, Consumable.Type.Magnet],
                spawnTime: 180,
                currentSpawnTime: 0
            }
        ]
        this.itemSpawnTime = 45;
    }
    setup() {
        if (this.player && !this.player.isDead) {
            this.player.destroy();
        }

        if (Game.Debug.customChar) {
            Game.Debug.customChar = parseInt(Game.Debug.customChar)
        }
        const firstPlayer = GameData.instance.currentPlayer;


        const playerBuildParams = GameStaticData.instance.getEntityByIndex('player', Game.Debug.customChar !== undefined ? Game.Debug.customChar : 0)
        playerBuildParams.customViewData = firstPlayer;
        playerBuildParams.mainWeapon = GameData.instance.currentEquippedWeapon;
        this.player = this.addEntity(Player, playerBuildParams)


        this.player.onDie.add(() => {
            this.playerDie();
        })

        console.log('ADD XP AMOUNT ON ENTITY DATA');
        return this.player;
    }
    confirmGameOver(fromWin = false) {
        this.confirmPlayerDeath();
        this.onConfirmGameOver.dispatch(fromWin);
    }
    levelWin() {
        this.gameOverOverlay.setActive(true)
        this.gameOverOverlay.show(true, this.matchStats)
        this.init = false;
        Eugine.TimeScale = 0;
    }
    playerDie() {
        this.dyingTimer = 2;
    }
    completeDieTimer() {
        this.gameOverOverlay.setActive(true)
        this.gameOverOverlay.show(false, this.matchStats, this.revives > 0)
        Eugine.TimeScale = 0;
        this.dyingTimer = 0;
    }
    confirmPlayerDeath() {
        this.directionPin.destroy()
        this.onPlayerDie.dispatch();
        Eugine.TimeScale = 0;
    }
    revivePlayer() {
        this.player.revive()
        this.gameOverOverlay.setActive(false)

        Eugine.TimeScale = 1;

        this.revives--;

        EffectsManager.instance.bombExplode();
    }
    start(wavesData = {level:0}) {

        this.revives = 1;
        this.dyingTimer = 0;
        this.player.enabled = false

        const levelData = GameStaticData.instance.getWaves()[wavesData.level]
        this.currentLevelWaves = levelData.waves;
        this.currentLevelData = levelData;

        console.log(wavesData)
        this.timeLimit = levelData.lenght;
        //alert(this.timeLimit)

        this.levelStructure = { phases: [] }
        this.textTriggers = { phases: [], currentTrigger: 0 }
        this.currentLevelWaves.forEach(element => {
            if (element.textTrigger) {
                this.textTriggers.phases.push({
                    startAt: element.startAt,
                    text: element.textTrigger,
                    time: element.time,
                })
            } else {
                this.levelStructure.phases.push(Pool.instance.getElement(SessionSpawner).build(element.startAt || 0, element.duration, element.waves));

                if(element.alert){
                    this.textTriggers.phases.push({
                        startAt: element.startAt - 7,
                        text: "Enemy Horde Incoming",
                        time: 5,
                    })
                }
            }
        });


        this.textTriggers.phases.sort((a, b) => {
            if (a.startAt < b.startAt) {
              return -1;
            }
            if (a.startAt > b.startAt) {
              return 1;
            }
            return 0;
          });

         // console.log(this.textTriggers)

        this.gameSessionController = this.gameEngine.poolGameObject(GameplaySessionController, true);
        this.player.setPositionXZ(0, 0)

        
        this.gameOverOverlay = this.addEntity(GameOverView);
        this.gameOverOverlay.setActive(false)
        this.gameOverOverlay.onConfirmGameOver.add((fromWin) => {
            this.confirmGameOver(fromWin);
        })
        
        this.gameOverOverlay.onRevivePlayer.add(() => {
            this.revivePlayer();
        })
        
        this.gameSessionController.setLabelInfo('')
        this.gameSessionController.setLabelInfo('Survive for ' + Utils.floatToTime(this.timeLimit), 10)


    }
    destroy() {
        this.gameSessionController.destroy();
        this.player.destroy();
        this.gameOverOverlay.destroy();
        this.init = false;
        this.player.enabled = false;

        for (var i = this.activeEnemies.length - 1; i >= 0; i--) {
            this.activeEnemies[i].destroy();
        }
        for (var i = this.collectables.length - 1; i >= 0; i--) {
            this.collectables[i].destroy();
        }
        for (var i = this.consumables.length - 1; i >= 0; i--) {
            this.consumables[i].destroy();
        }


        this.collectables = [];
        this.consumables = [];
        this.activeEnemies = [];
    }
    onPlayerLevelUp(xpData) {

    }
    initGame() {
        this.init = true;
        Eugine.TimeScale = 1;
        this.latestItem = 0;
        this.gameOverOverlay.setActive(false)

        this.player.enabled = true;
        this.gameSessionController.playerReady()
        this.player.refreshEquipment()
        this.player.gameReady();
        this.gameplayTime = -1;
        this.currentPhase = 0;
        for (var i = this.activeEnemies.length - 1; i >= 0; i--) {
            this.activeEnemies[i].destroy();
        }
        for (var i = this.collectables.length - 1; i >= 0; i--) {
            this.collectables[i].destroy();
        }
        for (var i = this.consumables.length - 1; i >= 0; i--) {
            this.consumables[i].destroy();
        }
        this.collectables = [];
        this.consumables = [];
        this.activeEnemies = [];
        this.activeSpawners = [];
        this.entitiesByType = {};
        this.entitiesByTier = [[], [], [], [], [], [], []];
        Camera.Zoom = 3


        this.gameEngine.camera.followPoint.x = 0;//this.player.gameView.view.position.x;
        this.gameEngine.camera.followPoint.y = 0;
        this.gameEngine.camera.followPoint.z = 0;//this.player.gameView.view.position.y - this.player.transform.position.y;
        this.gameEngine.camera.snapFollowPoint()

        this.directionPin = this.addEntity(DirectionPin)

        this.matchStats = {
            enemiesKilled: 0,
            time: 0,
            coins: 0,
            special: 0
        }
        this.destroyDistanceV2 = {
            x: 0, y: 0
        }


        //this.addConsumable();

    }
    spawnRandomEnemy() {
        this.enemyGlobalSpawner.spawnRandom();
    }
    respawnEntity(entity) {
        this.enemyGlobalSpawner.respawnEntity(entity)
    }
    collectCoins(value) {
        this.matchStats.coins += value;
    }
    killSpecialMonster(value) {
        this.matchStats.special += Math.max(value, 1);
    }
    spawnEnemy(spawnData) {
        if (!spawnData) {
            console.log('cant spawn without data');
            return
        }
        if(Math.random() > 0.7)
        this.enemyGlobalSpawner.spawnEnemy(spawnData)
    }
    collectAllPickups() {
        this.collectables.forEach(element => {
            element.attracting = true;
        });
    }
    addEntity(constructor, buildParams, extra) {
        let entity = this.gameEngine.poolGameObject(constructor, false)
        entity.build(buildParams, extra)

        this.gameplayEntities.push(entity);

        this.gameManagerStats.GMtotalGameObjects = this.gameplayEntities.length
        entity.gameObjectDestroyed.addOnce(this.removeEntity.bind(this))
        if (entity.onRespawn) {
            entity.onRespawn.removeAll()
            entity.onRespawn.add(this.respawnEntity.bind(this))
        }

        if (entity.layerCategory && entity.layerCategory == Layer.Enemy) {
            this.activeEnemies.push(entity)

            this.entitiesByTier[buildParams.entityData.tier - 1].push(entity);

            if (!this.entitiesByType[buildParams.id]) {
                this.entitiesByType[buildParams.id] = []
            }

            this.entitiesByType[buildParams.id].push(entity)

        }

        this.registerEntity(entity)
        return entity;
    }
    registerEntity(entity) {

        if (this.entityRegister.indexOf(entity) < 0 && entity.health) {
            //entity.health.gotDamaged.remove(this.entityDamaged)

            entity.health.gotDamaged.add(this.entityDamaged.bind(this))
            entity.health.gotKilled.add(this.entityKilled.bind(this))
            // entity.health.gotKilledParticles.add(this.entityKilled.bind(this))

            this.entityRegister.push(entity);

        }
    }
    removeEntity(entity) {
        this.entityRegister = this.entityRegister.filter(item => item !== entity)
        this.gameplayEntities = this.gameplayEntities.filter(item => item !== entity)
        this.gameManagerStats.totalGameObjects = this.activeEnemies.length//this.gameplayEntities.length

        if (entity.layerCategory && entity.layerCategory == Layer.Enemy) {

            this.activeEnemies = this.activeEnemies.filter(item => item !== entity)
            this.entitiesByType[entity.staticData.id] = this.entitiesByType[entity.staticData.id].filter(item => item !== entity)
            this.entitiesByTier[entity.tier] = this.entitiesByTier[entity.tier].filter(item => item !== entity)
        }
    }
    entityDamaged(entity, value) {
        // if (entity.dying) return;
        // EffectsManager.instance.popDamage(entity.gameObject, value)
    }
    addConsumable(types) {
        let consumable = this.addEntity(Consumable);
        consumable.setType(types[Math.floor(Math.random() * types.length)])
        const angle = Math.random() * Math.PI * 2;
        consumable.setPositionXZ(this.player.transform.position.x + Math.cos(angle) * 300, this.player.transform.position.z + Math.sin(angle) * 300)
        this.consumables.push(consumable)

        this.latestItem = Math.round(this.gameplayTime / this.itemSpawnTime)

    }
    addSingleCoin(entity) {
        let consumable = this.addEntity(Consumable);
        consumable.setType(Consumable.Type.SingleCoin)
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 20 + 5
        consumable.setPositionXZ(entity.transform.position.x + Math.cos(angle) * dist, entity.transform.position.z + Math.sin(angle) * dist)
        this.consumables.push(consumable)


    }
    openChest() {
        this.player.sessionData.openChest();
    }
    dropEnemyChest(enemy) {

        let consumable = this.addEntity(InGameChest);
        consumable.setPositionXZ(enemy.transform.position.x, enemy.transform.position.z)
        this.consumables.push(consumable)
    }
    entityKilled(health, value) {

        this.matchStats.enemiesKilled++;
        SOUND_MANAGER.play('squash1', 0.2, Math.random() * 0.3 + 0.7)
        const entity = health.gameObject
        if (entity && entity.staticData && entity.staticData.entityData) {
            if (entity.staticData.entityData.tier) {

                if (entity.staticData.entityData.tier >= 4) {
                    this.killSpecialMonster(entity.staticData.entityData.tier - 2);
                    this.dropEnemyChest(entity);
                    return;
                }
            }
        }

        if (Math.random() > 0.85) {
            this.addSingleCoin(health.gameObject)
        }
        if (Math.random() > 0.6) return;
        let collectable = this.addEntity(Collectable);

        if (health.gameObject && health.gameObject.staticData && health.gameObject.staticData.entityData) {
            
            let added = 0;
            if(health.gameObject.attributes){
                added = Math.floor(health.gameObject.attributes.level / 3)
            }
            collectable.xp = Math.max(1, health.gameObject.staticData.entityData.tier + added);
            //////////MORE XP HERE console.log(collectable.xp)
            collectable.setCollectableTexture();
        }
        collectable.setPositionXZ(health.gameObject.transform.position.x, health.gameObject.transform.position.z)
        this.collectables.push(collectable);

    }
    findClosestEnemy(point) {
        let closest = 0;
        let minDist = 999999;
        for (var i = 0; i < this.activeEnemies.length; i++) {
            let enemy = this.activeEnemies[i];

            let dist = Vector3.distance(enemy.transform.position, point)
            if (dist < minDist) {
                minDist = dist;
                closest = i;
            }
        }

        return this.activeEnemies[closest];
    }
    findEnemyInRadius(point, radius) {
        let minDist = 999999;
        const inRadius = [];
        for (var i = 0; i < this.activeEnemies.length; i++) {
            let enemy = this.activeEnemies[i];

            let dist = Vector3.distance(enemy.transform.position, point)
            if (dist < radius) {
                inRadius.push(enemy)
            }
        }

        return inRadius;
    }
    findClosestEnemyWithHigherTier(point) {
        let tierId = 0;
        for (let index = this.entitiesByTier.length - 1; index >= 0; index--) {
            if (this.entitiesByTier[index].length) {
                tierId = index;
                break;
            }

        }
        let closest = 0;
        let minDist = 999999;
        for (var i = 0; i < this.entitiesByTier[tierId].length; i++) {
            let enemy = this.entitiesByTier[tierId][i];

            let dist = Vector3.distance(enemy.transform.position, point)
            if (dist < minDist) {
                minDist = dist;
                closest = i;
            }
        }

        return this.entitiesByTier[tierId][closest];
    }
    angleFromPlayer(point) {
        return Vector3.atan2XZ(point, this.player.transform.position);
    }
    distanceFromPlayer(point) {
        return Vector3.distance(point, this.player.transform.position);
    }
    update(delta) {
        if (!this.init) {
            return;
        }


        if (this.dyingTimer > 0) {
            this.dyingTimer -= delta;
            if (this.dyingTimer < 0) {
                this.completeDieTimer();
            }
            return;
        }
        if (Game.IsPortrait) {
            this.gameEngine.camera.targetZoom = 1.5;
        } else {
            this.gameEngine.camera.targetZoom = 1;

        }

        //using a fixed value
        this.enemyGlobalSpawner.distanceToSpawn = 500
        this.destroyDistanceV2.x = Camera.ViewportSize.width / 2 + 100;
        this.destroyDistanceV2.y = Camera.ViewportSize.height / 2 + 100;

        //console.log(Camera.instance.zoom)

        //console.log(this.destroyDistanceV2)

        if (this.gameplayTime >= this.timeLimit) {
            this.matchStats.time = this.timeLimit;
            this.levelWin();
            return;
        }

        if (this.textTriggers.currentTrigger >= 0 && this.textTriggers.currentTrigger < this.textTriggers.phases.length) {
            const textTriggerData = this.textTriggers.phases[this.textTriggers.currentTrigger]
            if (textTriggerData.startAt <= this.gameplayTime) {
                this.gameSessionController.setLabelInfo(textTriggerData.text, textTriggerData.time)
                this.textTriggers.currentTrigger++
            }
        }
        this.itemPools.forEach(element => {
            element.currentSpawnTime += delta;
            if (element.currentSpawnTime >= element.spawnTime) {
                this.addConsumable(element.types)
                element.currentSpawnTime = Math.random() * element.spawnTime * 0.1;
            }
        });


        //console.log(this.enemyGlobalSpawner.distanceToSpawn, this.destroyDistance)
        this.gameManagerStats.Phase = this.currentPhase
        if (this.gameplayTime > 0.5 && delta > 0) {
            for (var i = 0; i < this.levelStructure.phases.length; i++) {
                const phase = this.levelStructure.phases[i];
                if (phase.startAt < this.gameplayTime && (phase.startAt + phase.duration) > this.gameplayTime) {
                    this.updateLevelPhase(phase)
                }
            }
        }

        for (var i = this.collectables.length - 1; i >= 0; i--) {
            if (this.collectables[i].isDestroyed) {
                this.collectables.splice(i, 1);
            }
        }

        for (var i = this.consumables.length - 1; i >= 0; i--) {
            if (this.consumables[i].isDestroyed) {
                this.consumables.splice(i, 1);
            }
        }

        if (this.player) {
            this.gameEngine.camera.followPoint.x = this.player.gameView.view.position.x;
            this.gameEngine.camera.followPoint.y = 0;
            this.gameEngine.camera.followPoint.z = this.player.gameView.view.position.y - this.player.transform.position.y;
        }

        this.matchStats.time = this.gameplayTime;
    }

    lateUpdate(delta) {
        this.gameplayTime += delta;
        this.gameManagerStats.Time = this.gameplayTime
    }

    updateLevelPhase(phase) {
        if (Game.Debug.noEnemy || !phase) return;
        phase.spawnData.forEach(spawnerData => {
            if (spawnerData.canSpawn) {

                if (Array.isArray(spawnerData.entity)) {
                    let count = 0;

                    spawnerData.entity.forEach(element => {
                        if (this.entitiesByType[element]) {
                            count += this.entitiesByType[element].length;
                        }
                    });
                    if (count < spawnerData.maxActive) {
                        this.spawnEnemy(spawnerData);
                    }

                } else {

                    if (!this.entitiesByType[spawnerData.entityId] ||
                        this.entitiesByType[spawnerData.entityId].length < spawnerData.maxActive) {
                        this.spawnEnemy(spawnerData);
                    }
                }
            }
        });

    }
}