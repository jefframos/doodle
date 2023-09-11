import GameAgent from "../core/entity/GameAgent";
import Layer from "../core/Layer";

export default class StandardZombie extends GameAgent {
    constructor() {
        super();
        //this.setDebug(15)


    }
    build(radius = 15) {
        super.build();
        //this.view.scale.set(0.2)
        this.buildCircle(0, 0, 15);

        this.characterAnimationID = 'Zombie1';
        let animations = [
            {
                id: 'Walk',
                name: 'zombieWalk',
                frames: 10,
                speed: 0.2
            },
            {
                id: 'Idle',
                name: 'zombieIdle',
                frames: 5,
                speed: 0.2
            },
            {
                id: 'Die',
                name: 'zombieDying',
                frames: 6,
                speed: 0.2,
                loop: false
            },
        ]

        this.injectAnimations(animations, true);
        this.body.isSensor = false;
        this.layerCategory = Layer.Enemy
        this.layerMask = Layer.Environment | Layer.Player | Layer.Bullet

        this.view.scale.set(0.2)

    }
    onAnimationEnd(animation, state) {
        this.destroy()
    }
    die() {
        this.body.isSensor = true;
        this.view.play('Die')

        this.dying = true;
    }
    update(delta) {

        if (!this.dying) {
            this.timer += delta * (this.speed * delta * Math.random())

            let dir = this.timer
            this.physics.velocity.x = Math.cos(dir) * this.speed * this.speedAdjust * delta
            this.physics.velocity.y = Math.sin(dir) * this.speed * this.speedAdjust * delta
            this.speedAdjust = Math.sin(this.view.currentFrame / 9 * Math.PI) + 0.1

            if (this.physics.magnitude > 0) {
                this.view.play('Walk')
            } else {

                this.view.play('Idle')
            }
        }else{
            this.physics.velocity.x = 0
            this.physics.velocity.y = 0
        }

        super.update(delta)
    }
}