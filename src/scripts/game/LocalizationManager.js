import * as PIXI from 'pixi.js';

export default class LocalizationManager {
    constructor(forceLanguage) {
        this.defaultLanguage = window.RESOURCES['localization_EN'].data.labels
        this.currentLanguage = window.RESOURCES['localization_EN'].data.labels

        let lang = navigator.language
        if (lang) {
            let lang2 = lang[0] + lang[1]
            lang2 = lang2.toUpperCase();
            if(forceLanguage){
                lang2 = forceLanguage;
            }
            if (window.RESOURCES['localization_' + lang2]) {
                let newLang = window.RESOURCES['localization_' + lang2];
                if (newLang.data && newLang.data.labels) {
                    this.currentLanguage = newLang.data.labels;
                }
            }

        }
    }
    getLabel(id, caps) {
        if (this.currentLanguage[id]) {
            return caps ? this.currentLanguage[id].toUpperCase() : this.currentLanguage[id]
        } else {
            if (this.defaultLanguage[id]) {
                return caps ? this.defaultLanguage[id].toUpperCase() : this.defaultLanguage[id]
            } else {
                return "_NOT FOUND"
            }
        }
    }

    getLabelTutorial(id, caps) {
        if(window.isPortrait){
            if(this.currentLanguage['mobile_'+id]){
                return caps ? this.currentLanguage['mobile_'+id].toUpperCase() : this.currentLanguage['mobile_'+id]
            }
        }
        if (this.currentLanguage[id]) {
            return caps ? this.currentLanguage[id].toUpperCase() : this.currentLanguage[id]
        } else {
            if (this.defaultLanguage[id]) {
                return caps ? this.defaultLanguage[id].toUpperCase() : this.defaultLanguage[id]
            } else {
                return "_NOT FOUND"
            }
        }
    }
}