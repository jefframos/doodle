import GameObject from '../../core/gameObject/GameObject';
import GameView from '../../core/view/GameView';
import RenderModule from '../../core/modules/RenderModule';

export default class Shadow extends GameObject {
    constructor() {
        super();
        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.RenderLayers.Shadow;
        this.gameView.view = new PIXI.Sprite.from('shadow2');
        this.gameView.view.anchor.set(0.5);
    }
    getNewParent(parent) {
        if (parent.rigidBody) {
            this.gameView.view.scale.x = this.rigidBodyWidth / this.gameView.view.width * this.gameView.view.scale.x * 2
            this.gameView.view.scale.y = this.gameView.view.scale.x / 2
        }
    }
    updateScale(scale){
        if (this.parent.rigidBody) {
            this.gameView.view.scale.x = this.rigidBodyWidth / this.gameView.view.width * this.gameView.view.scale.x * 2 * scale
            this.gameView.view.scale.y = this.gameView.view.scale.x / 2
        }
    }
    get rigidBodyWidth(){
        if(this.parent.rigidBody.circleRadius){
            return this.parent.rigidBody.circleRadius
        }
        return this.parent.rigidBody.bounds.max.x - this.parent.rigidBody.bounds.min.x
    }
    update(delta) {
        if(this.parent){
            this.transform.position.x = this.parent.transform.position.x;
            this.transform.position.z = this.parent.transform.position.z;
        }
    }
}