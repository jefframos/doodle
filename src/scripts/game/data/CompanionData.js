import EntityAttributes from "./EntityAttributes";
import EntityData from "./EntityData";

export default class CompanionData {

    constructor(staticData) {
        this.staticData = staticData;
        this.attributes = new EntityAttributes();
        this.attributes.reset(staticData.attributes)
        this.staticData = staticData;

        this.entityData = new EntityData();
        this.entityData.copyOver(staticData.entityData)

        for (const key in staticData) {
            if (this[key] == undefined) {
                this[key] = staticData[key];
            }
        }
    }
    clone() {
        let attributes = new CompanionData(this.staticData);

        for (const key in this) {
            if (this[key] && this[key].clone) {
                attributes[key] = this[key].clone();
            } else {
                attributes[key] = this[key];
            }

        }
        return attributes;
    }
}
