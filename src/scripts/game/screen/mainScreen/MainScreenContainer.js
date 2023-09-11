import * as PIXI from 'pixi.js';

export default class MainScreenContainer extends PIXI.Container {
    constructor() {
        super();

        this.container = new PIXI.Container()
        this.addChild(this.container);
            }
    build(){
        
    }
    update(delta){
    }
}