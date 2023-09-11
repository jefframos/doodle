export default class EntityData {
    static EntityDataType = {
        None: 'None',
        Player: 'Player',
        Enemy: 'Enemy',
        SpecialEnemy: 'SpecialEnemy',
        Boss: 'Boss',
        Weapon: 'Weapon',
        Companion: 'Companion',
        Attribute: 'Attribute',
        Acessory:'Acessory',
        WeaponAttachment:'WeaponAttachment',
        Equipable:'Equipable',
        Coins:'Coins',
        Heal:'Heal'
    }
    constructor() {
        this.icon = 'icon_confirm';
        this.tier = 1;
        this.name = "";
        this.description = "";
        this.type = EntityData.EntityDataType.Weapon;
    }
    copyOver(obj){
        for (const key in obj) {
            if (Object.hasOwnProperty.call(this, key)) {
                this[key] = obj[key];                
            }
        }
    }
}
