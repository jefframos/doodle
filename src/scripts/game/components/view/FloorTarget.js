import GameObject from '../../core/gameObject/GameObject';
import GameView from '../../core/view/GameView';
import RenderModule from '../../core/modules/RenderModule';
import Utils from '../../core/utils/Utils';

export default class FloorTarget extends GameObject {
    constructor() {
        super();
        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.RenderLayers.Base;
        this.gameView.view = new PIXI.Sprite.from('targetShoot0');
        this.gameView.view.anchor.set(0.5);
        this.gameView.view.visible = false;

        this.targetScale = 0;
    }
    getNewParent(parent) {
        this.gameView.view.visible = false;
        if (parent.rigidBody) {
            this.gameView.view.scale.set(this.rigidBodyWidth / this.gameView.view.width * this.gameView.view.scale.x * 2)
            this.targetScale = this.gameView.view.scale.x;
            this.gameView.view.scale.set(0.1)
        }
    }
    updateScale(scale) {
        if (this.parent.rigidBody) {
            this.gameView.view.scale.set(this.rigidBodyWidth / this.gameView.view.width * this.gameView.view.scale.x * 2 * scale)
            this.targetScale = this.gameView.view.scale.x;

            this.gameView.view.scale.set(0.1)
        }
    }
    get rigidBodyWidth() {
        if (this.parent.rigidBody.circleRadius) {
            return this.parent.rigidBody.circleRadius
        }
        return this.parent.rigidBody.bounds.max.x - this.parent.rigidBody.bounds.min.x
    }
    update(delta) {
        if (this.parent) {
            this.transform.position.x = this.parent.transform.position.x;
            this.transform.position.z = this.parent.transform.position.z;

            this.gameView.view.visible = true;
            this.gameView.view.alpha = 1;

            this.gameView.view.scale.x = Utils.lerp(this.gameView.view.scale.x, this.targetScale, 0.1)
            this.gameView.view.scale.y = Utils.lerp(this.gameView.view.scale.y, this.targetScale, 0.2)
        }
    }
}