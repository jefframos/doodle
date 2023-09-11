import BaseFillBar from "./BaseFillBar";
import UIUtils from "../../../utils/UIUtils";
import Utils from "../../../core/utils/Utils";

export default class EntityLifebar extends BaseFillBar {
    constructor() {
        super();       
    }
    build(width = 50, height = 10, border = 1) {
        super.build(width, height, border);        
        this.health = this.parent.health;

       // this.addIcon(UIUtils.getIconByAttribute("baseHealth"))
    }
    update(delta, unscaled){
        super.update(delta, unscaled);
        this.normal = this.health.normal;       
    }
}
