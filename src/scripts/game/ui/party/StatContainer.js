import * as PIXI from 'pixi.js';
import Signals from 'signals';
import gambitUtils from '../../entity/gambits/gambitUtils';

export default class StatContainer extends PIXI.Container {
    constructor() {
        super();
        this.statLabels = {};

        this.addStatLabel("vigor", "VIG")
        this.addStatLabel("speed", "SPD")
        this.addStatLabel("movementSpeed", "MOV")
        this.addStatLabel("stamina", "STM")
        this.addStatLabel("magicPower", "MAG")
        this.addStatLabel("battlePower", "ATK")
        this.addStatLabel("defense", "DEF")
        this.addStatLabel("magicDefense", "MDF")



    }
    showCharData(charData){
        for (const key in charData.stats) {
            const element = charData.stats[key];
            this.updateStatLabel(key, element)
        }

    }

    updateStatLabel(stat, label) {
        if (this.statLabels[stat]) {
            this.statLabels[stat].text = this.statLabels[stat].att + " : " + label;
        }
    }
    addStatLabel(stat, label) {
        this.statLabels[stat] = new PIXI.Text(label, window.LABELS.LABEL_STATS)
        this.statLabels[stat].att = label
        this.addChild(this.statLabels[stat]);

        let countX = 0
        let countY = 0
        for (const key in this.statLabels) {
            const element = this.statLabels[key];
            element.y = 20 * countY
            element.x = 120 * countX
            countY++
            if (countY % 4 == 0) {
                countX++
                countY = 0;
            }
        }
    }
}