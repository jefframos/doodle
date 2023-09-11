export default class EntityMultipliers {
    constructor() {
        this.baseHealth = 1;
        this.baseDefense = 1;
        this.baseSpeed = 1;
        this.baseFrequency = 1;
        this.basePower = 1;
        this.baseMagicDefense = 1;
        this.baseMass = 1;
        this.baseRadius = 1;
        this.damageZone = 1;
        this.basePiercing = 0;
        this.baseAmount = 0;
        this.baseCollectionRadius = 1;
        this.baseDistance = 1;
        this.baseEvasion = 1;
        this.baseCritical = 1;
        this.baseTotalMain = 1;
        this.baseItemHeal = 0.3;
        this.baseXpMultiplier = 1;
        this.level = 0;
        this.writeDefaults();
    }
    writeDefaults() {
        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                this[key + 'default'] = this[key];
            }
        }
    }
    reset(attributes) {

        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                if(this[key + 'default'] !== undefined) {
                    this[key] = this[key + 'default'];
                }
            }
        }

        if(attributes){
            for (const key in attributes) {
                if (Object.hasOwnProperty.call(attributes, key)) {
                    this[key] = attributes[key];
                }
            }
        }
    }

    addMultiplyer(type, value){
        if(this[type] != undefined){
            this[type] += value;            
        }
    }
    findAttributeValue(att) {
        const attribute = this[att];
        if (Array.isArray(attribute)) {
            const level = Math.min(this.level, attribute.length - 1)
            return attribute[level]
        }
        return attribute
    }
    get xpMultiplier() {
        return this.findAttributeValue('baseXpMultiplier');
    }
    get itemHeal() {
        return this.findAttributeValue('baseItemHeal');
    }
    get totalMain() {
        return this.findAttributeValue('baseTotalMain');
    }
    get evasion() {
        return this.findAttributeValue('baseEvasion');
    }
    get critical() {
        return this.findAttributeValue('baseCritical');
    }
    get distance() {
        return this.findAttributeValue('baseDistance');
    }
    get collectionRadius() {
        return this.findAttributeValue('baseCollectionRadius');
    }
    get piercing() {
        return this.findAttributeValue('basePiercing');
    }
    get amount() {
        return this.findAttributeValue('baseAmount');
    }
    get health() {
        return this.findAttributeValue('baseHealth');
    }
    get frequency() {
        return this.findAttributeValue('baseFrequency');
    }
    get defense() {
        return this.findAttributeValue('baseDefense');
    }
    get speed() {
        return this.findAttributeValue('baseSpeed');
    }
    get zone() {
        return this.findAttributeValue('damageZone');
    }
    get power() {
        return this.findAttributeValue('basePower');
    }
    get magicDefense() {
        return this.findAttributeValue('baseMagicDefense');
    }
    get mass() {
        return this.findAttributeValue('baseMass');
    }
    get radius() {
        return this.findAttributeValue('baseRadius');
    }

    clone() {
        let attributes = new EntityMultipliers();

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