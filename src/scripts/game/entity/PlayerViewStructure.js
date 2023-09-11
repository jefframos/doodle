import UIUtils from "../utils/UIUtils"
import signals from "signals"

export default class PlayerViewStructure {
    static Colors = {
        WhiteSkin: 0xFBEDD6,
        Jeans: 0x4260A5
    }
    constructor() {
        this._chest = 1
        this._head = 1
        this._topHead = 1
        this._face = 1
        this._hat = 0
        this._leg = 1
        this._sleeves = 1
        this._backSleeves = 1
        this._arms = 1
        this._shoe = 1
        this._eyes = 1
        this._ears = 1
        this._mouth = 1
        this._mask = 0
        this._trinket = 0
        this._frontFace = 0
        this._backHead = 0
        this._trinketSprite = null
        this._maskSprite = null
        this._skinColor = UIUtils.colorset.skin[0]
        this._hairColor = UIUtils.colorset.hair[0]
        this._topClothColor = UIUtils.colorset.clothes[0]
        this._sleevesColor = UIUtils.colorset.clothes[0]
        this._faceHairColor = UIUtils.colorset.hair[0]
        this._botomColor = UIUtils.colorset.clothes[0]
        this._shoeColor = UIUtils.colorset.clothes[0]
        this.onStructureUpdate = new signals.Signal();
        this.onColorUpdate = new signals.Signal();
        this.onSpriteUpdate = new signals.Signal();
    }
    set trinketSprite(value) {
        this._trinketSprite = value;
        this.onSpriteUpdate.dispatch('trinketSprite', this._trinketSprite)
    }
    get trinketSprite() { return this._trinketSprite; }
    set maskSprite(value) {
        this._maskSprite = value;
        this.onSpriteUpdate.dispatch('maskSprite', this._maskSprite)
    }
    get maskSprite() { return this._maskSprite; }
    set trinket(value) {
        this._trinket = value;
        this.onStructureUpdate.dispatch('trinket', this._trinket)
    }
    get trinket() { return this._trinket; }
    set mask(value) {
        this._mask = value;
        this.onStructureUpdate.dispatch('mask', this._mask)
    }
    get mask() { return this._mask; }
    set ears(value) {
        this._ears = value;
        this.onStructureUpdate.dispatch('ears', this._ears)
    }
    get ears() { return this._ears; }
    set eyes(value) {
        this._eyes = value;
        this.onStructureUpdate.dispatch('eyes', this._eyes)
    }
    get eyes() { return this._eyes; }
    set mouth(value) {
        this._mouth = value;
        this.onStructureUpdate.dispatch('mouth', this._mouth)
    }
    get mouth() { return this._mouth; }
    set chest(value) {
        this._chest = value;
        this.sleeves = value;
        this.onStructureUpdate.dispatch('chest', this._chest)
    }
    get chest() { return this._chest; }
    set head(value) {
        this._head = value;
        this.onStructureUpdate.dispatch('head', this._head)
    }
    get head() { return this._head; }
    set topHead(value) {
        this._topHead = value;
        this.backHead = value;
        this.onStructureUpdate.dispatch('topHead', this._topHead)
    }
    get topHead() { return this._topHead; }
    set face(value) {
        this._face = value;
        this.onStructureUpdate.dispatch('face', this._face)
    }
    get face() { return this._face; }
    set hat(value) {
        this._hat = value;
        this.onStructureUpdate.dispatch('hat', this._hat)
    }
    get hat() { return this._hat; }
    set leg(value) {
        this._leg = value;
        this.onStructureUpdate.dispatch('leg', this._leg)
        this.onStructureUpdate.dispatch('frontLeg', this._leg)
        this.onStructureUpdate.dispatch('backLeg', this._leg)
        this.onStructureUpdate.dispatch('bottom', this._leg)
    }
    get leg() { return this._leg; }
    set sleeves(value) {
        this._sleeves = value;
        this.backSleeves = value;
        this.onStructureUpdate.dispatch('sleeves', this._sleeves)
    }
    get sleeves() { return this._sleeves; }

    set backSleeves(value) {
        this._backSleeves = value;
        this.onStructureUpdate.dispatch('backSleeves', this._backSleeves)
    }
    get backSleeves() { return this._backSleeves; }

    set arms(value) {
        this._arms = value;
        this.onStructureUpdate.dispatch('arms', this._arms)
    }
    get arms() { return this._arms; }
    set shoe(value) {
        this._shoe = value;
        this.onStructureUpdate.dispatch('shoe', this._shoe)
        this.onStructureUpdate.dispatch('backShoes', this._shoe)
        this.onStructureUpdate.dispatch('frontShoes', this._shoe)
    }
    get shoe() { return this._shoe; }
    set frontFace(value) {
        this._frontFace = value;
        this.onStructureUpdate.dispatch('frontFace', this._frontFace)
    }
    get frontFace() { return this._frontFace; }
    set backHead(value) {
        this._backHead = value;
        this.onStructureUpdate.dispatch('backHead', this._backHead)
    }
    get backHead() { return this._backHead; }
    set skinColor(value) {
        this._skinColor = value;
        this.onColorUpdate.dispatch('skinColor', this._skinColor)
    }
    get skinColor() { return this._skinColor; }
    set hairColor(value) {
        this._hairColor = value;
        this.onColorUpdate.dispatch('hairColor', this._hairColor)
    }
    get hairColor() { return this._hairColor; }
    set topClothColor(value) {
        this._topClothColor = value;
        this.onColorUpdate.dispatch('topClothColor', this._topClothColor)
    }
    get topClothColor() { return this._topClothColor; }
    set sleevesColor(value) {
        this._sleevesColor = value;
       // this.onColorUpdate.dispatch('sleevesColor', this._sleevesColor)
    }
    get sleevesColor() { return this._sleevesColor; }
    set botomColor(value) {
        this._botomColor = value;
        this.onColorUpdate.dispatch('botomColor', this._botomColor)
    }
    get botomColor() { return this._botomColor; }
    set shoeColor(value) {
        this._shoeColor = value;
        this.onColorUpdate.dispatch('shoeColor', this._shoeColor)
    }
    get shoeColor() { return this._shoeColor; }
    set faceHairColor(value) {
        this._faceHairColor = value;
        this.onColorUpdate.dispatch('faceHairColor', this._faceHairColor)
    }
    get faceHairColor() { return this._faceHairColor; }
    serialize(){

        const copy = {}
        for (const key in this) {
            if(key[0] == '_'){
                if (Object.hasOwnProperty.call(this, key)) {
                    copy[key] = this[key];
                    
                }
            }
        }
        return JSON.stringify(copy)
    }
    parse(data){
        const obj = JSON.parse(data)

        for (const key in obj) {
            if(key[0] == '_'){

                if (Object.hasOwnProperty.call(obj, key)) {
                    this[key] = obj[key];
                }
            }
        }
    }
    applyAll(){
        for (const key in this) {
            if(key[0] == '_'){
                if (Object.hasOwnProperty.call(this, key)) {
                    this[key.substring(1)] = this[key];                    
                }
            }
        }
    }
}