//sword: soldier
//fast low range attack facing player, piercing
//

import EntityAttributes from "./EntityAttributes";
import EntityData from "./EntityData";
import EntityMultipliers from "./EntityMultipliers";

//longSword: knight
//unleash high range attack every x sec
//slow, high range attack facing player, piercing

//bow: archer
//slow, high distance, high damage, target closest enemy, piercing
//throw bombs

//crossbow: hunter
//fast, multiple shots, medium damage, shot in accum angle, no piercing
//spawn companions

//dagger: rogue
//fast, low range, high damage, attack closest enemy
//get invencible for x time after damage

//wand: mage
//attack in front and back directions alternating, no piercing
//random fireballs

//hamer: dwarf
//slow, high damage, attack in area
//collect more money

//axe: barbarian
//boomerang, attack closest, piercing
//throw extra piercing attack when damaged x amount

export default class WeaponAttributes {
    static BlockType = {
        IgnoreEnemyBullets: 'IgnoreEnemyBullets',
        DestroyEnemyBullets: 'DestroyEnemyBullets',
        DestroyEnemyBulletsAndDie: 'DestroyEnemyBulletsAndDie'
    }
    static DirectionType = {
        FacingPlayer: 'FacingPlayer',
        ClosestEnemy: 'ClosestEnemy',
        AngularSequence: 'AngularSequence',
        FacingAlternated: 'FacingAlternated',
        FacingBackwards: 'FacingBackwards',
        ParentAngle: 'ParentAngle',
        ParentDirection: 'ParentDirection',
        Hoaming: 'Hoaming',
        ClosestEnemySnap: 'ClosestEnemySnap',
        Random: 'Random',
        SameParentPosition: 'SameParentPosition'
    }
    static ExtendedBehaviour = {
        None: 0,
        Boomerang: 'Boomerang',
    }
    constructor() {
        this.isMain = true;

        this.baseRange = 60;
        this.baseLifeSpan = -1;
        this.baseLifeRangeSpan = 50;
        this.basePower = 100;
        this.baseRadius = 15;
        this.baseBulletSpeed = 200;
        this.baseAngularSpeed = 0;
        this.baseFrequency = 1;
        this.basePiercing = 10;
        this.baseAmount = 1;
        this.baseDamageZone = 100;
        this.baseDetectionZone = 500;
        this.baseDamageOverTime = 3;
        this.baseDirectionType = WeaponAttributes.DirectionType.FacingPlayer;
        this.baseBlockType = WeaponAttributes.BlockType.IgnoreEnemyBullets;
        this.useRelativePower = false;

        this.baseBrustFire = {
            amount: 0,
            interval: 0
        };
        this.baseExtendedBehaviour = WeaponAttributes.ExtendedBehaviour.None;
        this.baseBrustFireAmount = 0;
        this.baseBrustFireInterval = 0;
        this.baseBaseShootArc = 0;
        this.baseGeneralOffset = 0;
        this.baseAngleStart = 0;
        this.baseAngleOffset = 0.1;
        this.baseAngleNoise = 0.1;
        this.baseForceField = false;
        this.baseForceFeedback = 5;
        this.baseSpawnDistance = 20;
        this.baseCritical = 20;

        this.baseLevel = 0;
        this.level = 0;


        this.overrider = null;

        this.attributesMultiplier = new EntityMultipliers();
        this.attributesMultiplier.reset();
    }
    makeOverrider() {
        this.overrider = this.clone();
        this.overrider.isMain = false;
    }
    findAttributeValue(att) {
        const attribute = this.isMain ? this[att] : this.overrider[att]
        //console.log(att,mult)
        if (Array.isArray(attribute)) {
            const level = Math.min(this.level, attribute.length - 1)

            return attribute[level] //* mult
        }

        return attribute //* mult
    }
    addMultiplier(mult) {
        this.attributesMultiplier = mult;
    }
    get spawnDistance() {
        return this.findAttributeValue('baseSpawnDistance');
    }
    get brustFireInterval() {
        return this.findAttributeValue('baseBrustFireInterval');
    }
    get brustFireAmount() {
        let tempAmount = this.findAttributeValue('baseBrustFireAmount');
        if (this.baseBrustFireAmount > 0) {
            return this.findAttributeValue('baseBrustFireAmount') + this.attributesMultiplier.amount;
        }
        return this.findAttributeValue('baseBrustFireAmount');
    }
    get extendedBehaviour() {
        return this.findAttributeValue('baseExtendedBehaviour');
    }
    get baseShootArc() {
        return this.findAttributeValue('baseBaseShootArc');
    }
    get generalOffset() {
        return this.findAttributeValue('baseGeneralOffset');
    }
    get critical() {
        return this.findAttributeValue('baseCritical');
    }
    get angleStart() {
        return this.findAttributeValue('baseAngleStart');
    }
    get angleOffset() {
        return this.findAttributeValue('baseAngleOffset');
    }
    get angleNoise() {
        return this.findAttributeValue('baseAngleNoise');
    }
    get forceField() {
        return this.findAttributeValue('baseForceField');
    }
    get forceFeedback() {
        return this.findAttributeValue('baseForceFeedback');
    }
    get range() {
        return this.findAttributeValue('baseRange');
    }
    get lifeSpan() {
        return this.findAttributeValue('baseLifeSpan');
    }
    get lifeRangeSpan() {
        return this.findAttributeValue('baseLifeRangeSpan');
    }
    get power() {
        return this.findAttributeValue('basePower') * this.attributesMultiplier.power;
    }
    get radius() {
        return this.findAttributeValue('baseRadius') * this.attributesMultiplier.radius;
    }
    get bulletSpeed() {
        return this.findAttributeValue('baseBulletSpeed');
    }
    get angularSpeed() {
        return this.findAttributeValue('baseAngularSpeed');
    }
    get frequency() {
        return this.findAttributeValue('baseFrequency') / this.attributesMultiplier.frequency;
    }
    get piercing() {
        return this.findAttributeValue('basePiercing') + this.attributesMultiplier.piercing;
    }
    get amount() {
        let tempAmount = this.findAttributeValue('baseAmount')
        if (this.baseBrustFireAmount > 0) {
            return tempAmount;
        }
        return tempAmount + this.attributesMultiplier.amount;
    }
    get damageZone() {
        return this.findAttributeValue('baseDamageZone');
    }
    get detectionZone() {
        return this.findAttributeValue('baseDetectionZone');
    }
    get directionType() {
        return this.findAttributeValue('baseDirectionType');
    }
    get blockType() {
        return this.findAttributeValue('baseBlockType');
    }
    get shootArc() {
        return this.findAttributeValue('baseShootArc');
    }
    get damageOverTime() {
        return this.findAttributeValue('baseDamageOverTime');
    }

    clone() {
        let clone = new WeaponAttributes();
        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                clone[key] = this[key];
            }
        }
        return clone;
    }
}