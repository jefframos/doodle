import Utils from "../core/utils/Utils";
import GameData from "./GameData";

export default class TimedAction {

    constructor(id, time, textField, readyLabel) {
        this.currentTime = 99999
        this.timeInterval = time;
        this.formatedTime = "00:00"
        this.id = id;
        this.textField = textField;
        this.readyLabel = readyLabel;
        this.textField.text = this.readyLabel
    }
    get canUse() {
        return this.currentTime <= 0;
    }
    updateTime(latestOpen) {
        this.currentTime = this.timeInterval + Math.round((GameData.instance.lastOpened(this.id) - latestOpen) / 1000)
        this.formatedTime = Utils.floatToTime(this.currentTime)


        if (this.canUse) {
            this.textField.text = this.readyLabel
        } else {
            this.textField.text = this.formatedTime
        }
    }
}
