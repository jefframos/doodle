import BaseEnemy from "../entity/BaseEnemy";
import GameStaticData from "../data/GameStaticData";
import SessionSpawner from "./spawn/SessionSpawner";
import Utils from "../core/utils/Utils";

export default class EnemyGlobalSpawner {

    constructor(gameManager) {
        this.gameManager = gameManager;
        this.distanceToSpawn = 600;
    }
    spawnRandom() {
        this.spawnSingleEntity(GameStaticData.instance.getEntityByIndex('enemy', 0));
    }
    spawnEnemy(spawnData) {
        spawnData.updateDistanceToSpawn(this.distanceToSpawn);

        const toSpawn = spawnData.entityToSpawn;
        let enemyData = GameStaticData.instance.getEntityById('enemy', Utils.findValueOrRandom(toSpawn.entity));

        spawnData.totalSpawned++;
        let enemy = this.gameManager.addEntity(BaseEnemy, enemyData, {level:spawnData.level})
        enemy.currentSpawnPool = spawnData;
        enemy.setPositionXZ(
            this.gameManager.player.transform.position.x + toSpawn.x
            , this.gameManager.player.transform.position.z + toSpawn.z)
    }
    respawnEntity(entity) {
        entity.currentSpawnPool.addRelativeSpawnPoint()

        const toSpawn = entity.currentSpawnPool.entityToSpawn;
        entity.setPositionXZ(
            this.gameManager.player.transform.position.x + toSpawn.x
            , this.gameManager.player.transform.position.z + toSpawn.z)

        entity.respawn();
    }
    spawnSingleEntity(enemyData) {
        //find out if uses baseEnemy
        let enemy = this.gameManager.addEntity(BaseEnemy, enemyData)
        let circleRandom = Utils.randomCircle()
        enemy.setPositionXZ(
            this.gameManager.player.transform.position.x + circleRandom.x * this.distanceToSpawn
            , this.gameManager.player.transform.position.z + circleRandom.y * this.distanceToSpawn)
    }
}