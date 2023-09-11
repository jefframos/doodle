import Pool from "../../core/utils/Pool";
import SpawnerData from "./SpawnerData";

export default class SessionSpawner {
    static SpawnType = {
        Single: 1,
        Brust: 2,
        Group: 3
    }
    static SpawnAreaType = {
        Point: 'point',
        Rect: 'rect',
        Circle: 'circle',
        Arc: 'arc'
    }
    constructor() {

        this.duration = 100;
        this.startAt = 100;
        this.spawnData = [];

    }
    build(startAt, duration, data) {
        this.startAt = startAt;
        this.duration = duration;
        this.spawnData = [];
        data.forEach(element => {
            let spData = Pool.instance.getElement(SpawnerData)
            spData.build(element)
            this.spawnData.push(spData)
        });

        return this;
    }
    reset() {
        this.duration = 100;
        this.spawnData = [];
    }
    destroy() {
        this.reset();

        this.spawnData.forEach(element => {
            Pool.instance.returnElement(element)
        });
        this.spawnData = [];
        Pool.instance.returnElement(this)
    }
}