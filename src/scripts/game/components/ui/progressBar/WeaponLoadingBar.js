import BaseFillBar from "./BaseFillBar";
import UIUtils from "../../../utils/UIUtils";

export default class WeaponLoadingBar extends BaseFillBar {
    constructor() {
        super();
    }
    setWeapon(weapon){
        this.weapon = weapon;

        this.addIcon(UIUtils.getIconByAttribute("baseFrequency"))
    }
    update(delta, unscaled){
        super.update(delta, unscaled);

        if(!this.weapon) return
        this.normal = this.weapon.shootNormal;
    }
}
