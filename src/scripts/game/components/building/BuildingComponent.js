import BaseComponent from '../../core/gameObject/BaseComponent';
import signals from 'signals';

export default class BuildingComponent extends BaseComponent{
    constructor() {
        super();        

        this.acc = 0

        this.gridContainer = new PIXI.Container();

        this.tile = new PIXI.Sprite.from('tile_0060')
        this.gridContainer.addChild(this.tile)
        this.tile.width = 45
        this.tile.height = 45
        this.tile.alpha = 0.5

        this.tile2 = new PIXI.Sprite.from('tile_0060')
        this.gridContainer.addChild(this.tile2)
        this.tile2.width = 45
        this.tile2.height = 45
        this.tile2.tint = 0xFF0000
        this.hide();
    }
    enable(){
        super.enable();
    }
    setGameView(container){
        this.container = container;
        this.container.addChild(this.gridContainer)
    }
    hide(){
        this.gridContainer.visible = false;
    }
    show(){
        this.gridContainer.visible = true;
    }
    destroy(){

        this.container.removeChild(this.gridContainer)
        super.destroy();
    }
    update(delta){       
    }
    updateMousePosition(mousePosition){
        this.tile2.x = mousePosition.mouseX
        this.tile2.y = mousePosition.mouseY
    }
    updateGridPosition(playerPosition){
        this.tile.x = playerPosition.i * 45
        this.tile.y = playerPosition.j * 45
    }
}