import Camera from "../core/Camera";
import Game from "../../Game";
import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import LightSource from "../core/view/LightSource";
import RenderModule from "../core/modules/RenderModule";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";
import utils from "../../utils";

export default class Clouds extends GameObject {

    constructor() {
        super()
        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.RenderLayers.FrontLayer;
        this.gameView.view = new PIXI.Container();        
        this.gameView.view.alpha = 0.15

        this.cloudsLeft = [];
        this.cloudsRight = [];


        this.totalClouds = 3
        for (let index = 0; index < this.totalClouds; index++) {
            const element = new PIXI.Sprite.from('cloud-fog');
            this.gameView.view.addChild(element)
            element.scale.set(2 + Math.random())
            element.anchor.set(0.5)
            this.cloudsLeft.push(element)
        }
        
        for (let index = 0; index < 3; index++) {
            const element = new PIXI.Sprite.from('cloud-fog');
            this.gameView.view.addChild(element)
            element.scale.set(2 + Math.random())
            element.anchor.set(0.5)
            this.cloudsRight.push(element)
        }

        this.maxDistance = 1000
        this.cloudDistance = this.maxDistance / this.totalClouds

        this.distanceTest = {
            width:this.maxDistance*2,
            height:this.maxDistance
        }
    } 

    start() {
        for (let index = 0; index < this.cloudsLeft.length; index++) {
            this.cloudsLeft[index].y = index * this.cloudDistance - this.cloudDistance + (Math.random() * this.cloudDistance)
            this.cloudsLeft[index].x = Math.random() * 400
        }

        for (let index = 0; index < this.cloudsRight.length; index++) {
            this.cloudsRight[index].y = index * this.cloudDistance - this.cloudDistance+ (Math.random() * this.cloudDistance) 
            this.cloudsRight[index].x = -(Math.random() * 400)
        }
    }
    update(delta) {
        this.gameView.update(delta)
        
        if(Game.IsPortrait){

            this.distanceTest.width = this.maxDistance
            this.distanceTest.height = this.maxDistance * 1.5
        }else{
            this.distanceTest.width = this.maxDistance * 1.5
            this.distanceTest.height = this.maxDistance

        }
        
        this.cloudsLeft.forEach(element => {
            element.x -= delta * 5
           this.testRespaw(element);
        });
        
        this.cloudsRight.forEach(element => {
            element.x += delta * 5
            this.testRespaw(element);
        });
    }

    testRespaw(element){

        element.alpha = Utils.lerp(element.alpha, 1, 0.2)
        const distY =(this.transform.position.z + element.y) - this.parent.transform.position.z
        if(distY > this.distanceTest.height/2){
            element.y -= this.distanceTest.height
            element.alpha = 0
        }else if(distY < -this.distanceTest.height/2){
            element.y += this.distanceTest.height
            element.alpha = 0
        }

        const distX =(this.transform.position.x + element.x) - this.parent.transform.position.x
        if(distX > this.distanceTest.width/2){
            element.x -= this.distanceTest.width
            element.alpha = 0
        }else if(distX < -this.distanceTest.width/2){
            element.x += this.distanceTest.width
            element.alpha = 0
        }
    }
    lateUpdate(delta) {
        super.lateUpdate(delta);
        this.gameView.view.zIndex = -1

    }
}