export default class InGameViewDataStatic {

    constructor() {
        this.ingameIcon = '',
            this.ingameAmountIconOverrider = -1,
            this.inGameRotation = 0,
            this.ingameBaseWidth = 20,
            this.viewOffset = { x: 0, y: 0 },
            this.anchor = { x: 0.15, y: 0.01 },
            this.progressBar = {
                active: false,
                rotation: 0,
                width: 20,
                height: 4,
                x: 0,
                y: 0
            }
            this.shootAnimation = {
                active:false,
                sprite:"",
                min:1,
                max:1,
                addZero:false,
                time:0.1,
                loop:false
            }
            this.defaultAnimation = {
                active:false,
                sprite:"",
                min:1,
                max:1,
                addZero:false,
                time:0.1,
                loop:false
            }
    }
}