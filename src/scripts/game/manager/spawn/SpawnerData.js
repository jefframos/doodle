import SessionSpawner from "./SessionSpawner"
import Utils from "../../core/utils/Utils"

export default class SpawnerData {
    constructor() {
        this.once = false
        this.areaType = SessionSpawner.SpawnAreaType.Rect
        this.width = 100
        this.height = 100
        this.radius = 100
        this.length = 100
        this.total = 15
        this.maxActive = 15
        this.levels = [0]
        this.active = false;
        this.entity = ''
        this.toSpawnData = { entity: '', x: 0, z: 0 }
        this.totalSpawned = 0;
        this.groupID = 0;
        this.distanceToSpawn = 400;
        this.randomPoint = Utils.randomCircle()

        this.angle = Math.random() * 3.14 * 2;
        this.safeDistance = 250;
        this.offset = null;

        this.defaults = {};
        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                this.defaults[key] = this[key];

            }
        }
    }
    reset() {
        for (const key in this.defaults) {
            if (Object.hasOwnProperty.call(this.defaults, key)) {
                this[key] = this.defaults[key];
            }
        }
    }
    build(data) {
        this.reset();
        this.totalSpawned = 0;
        this.groupID = 0;
        this.toSpawnData = { entity: '', x: 0, z: 0 }
        for (const key in data) {
            if (this[key] !== undefined) {
                this[key] = data[key];
            }
        }

    }
    updateDistanceToSpawn(distance) {
        this.distanceToSpawn = distance;
    }
    get level() {
        return this.levels[Math.floor(this.levels.length * Math.random())];
    }
    get canSpawn() {
        return this.totalSpawned < this.total;
    }
    get entityId() {
        return this.entity;
    }
    get entityToSpawn() {
        this.toSpawnData.entity = this.entity;
        this.addRelativeSpawnPoint();
        return this.toSpawnData;
    }
    findOffset() {
        if (this.offset) {
            return;
        }
        switch (this.areaType) {
            case SessionSpawner.SpawnAreaType.Rect:
                this.offset = { x: Math.cos(this.angle) * (this.width + this.distanceToSpawn), y: Math.sin(this.angle) * (this.height + this.distanceToSpawn) }
                break;
            case SessionSpawner.SpawnAreaType.Circle:
            case SessionSpawner.SpawnAreaType.Arc:
                const length = Math.random() * this.length
                this.offset = { x: Math.cos(this.angle) * (this.radius + length + this.distanceToSpawn), y: Math.sin(this.angle) * (this.radius + length + this.distanceToSpawn) }
                break;
            case SessionSpawner.SpawnAreaType.Point:

                this.offset = { x: Math.cos(this.angle) * 300, y: Math.sin(this.angle) * 300 }
                break;
        }
    }
    addRelativeSpawnPoint() {
        if (this.totalSpawned >= this.maxActive * this.groupID) {
            this.groupID++;
            this.randomPoint = Utils.randomCircle()
        }
        this.findOffset();
        switch (this.areaType) {
            case SessionSpawner.SpawnAreaType.Rect:
                this.toSpawnData.x = this.randomPoint.x * Math.random() * this.width + this.offset.x;
                this.toSpawnData.z = this.randomPoint.y * Math.random() * this.height + this.offset.y;
                this.randomPoint = Utils.randomCircle()

                break;
            case SessionSpawner.SpawnAreaType.Circle:
                this.toSpawnData.x = this.randomPoint.x * Math.random() * this.radius + this.offset.x;
                this.toSpawnData.z = this.randomPoint.y * Math.random() * this.radius + this.offset.y;
                this.randomPoint = Utils.randomCircle()

                break;
            case SessionSpawner.SpawnAreaType.Arc:

                const length = Math.random() * this.length
                this.toSpawnData.x = this.randomPoint.x * (this.radius + length)// + this.offset.x;
                this.toSpawnData.z = this.randomPoint.y * (this.radius + length)// + this.offset.y;
                this.randomPoint = Utils.randomCircle()

                break;
            case SessionSpawner.SpawnAreaType.Point:
                this.toSpawnData.x = 0;
                this.toSpawnData.z = 0;
                break;
        }

    }
}
