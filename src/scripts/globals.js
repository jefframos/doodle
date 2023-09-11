import * as PIXI from 'pixi.js';

import config from './config';
import utils from './utils';

window.alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
window.numberList = []
window.numberList.push({ value: 1000, abv: 'k' })
window.numberList.push({ value: 1000000, abv: 'Mi' })
window.numberList.push({ value: 1000000000, abv: 'B' })
window.numberList.push({ value: 1000000000000, abv: 'T' })
let accum = 0
for (let index = 15; index < 309; index += 3) {

    let abv = ''
    if (accum < alphabet.length) {
        abv = alphabet[accum] + alphabet[accum]
    } else {
        let first = Math.floor(accum / alphabet.length) - 1
        if (first == accum % alphabet.length) {
            abv = alphabet[first] + alphabet[first] + alphabet[first]
        } else {
            abv = alphabet[first] + alphabet[accum % alphabet.length]
        }
    }
    accum++
    window.numberList.push({ value: Math.floor(Math.pow(10, index)), abv: abv })
}

//console.log(window.numberList)

window.getCurrency = function (e) {
    let a = Math.pow(2, e)
    console.log(a)
}

window.getLevels = function (e) {
    let a = e < 6 ? 6 * (e + 1) * (e + 1) - 6 * (e + 1) : e < 7 ? 5 * (e + 1) * (e + 1) - 5 * (e + 1) : e < 8 ? 4 * (e + 1) * (e + 1) - 4 * (e + 1) : e < 9 ? 3 * (e + 1) * (e + 1) - 3 * (e + 1) : e < 10 ? 2 * (e + 1) * (e + 1) - 2 * (e + 1) : (e + 1) * (e + 1) - (e + 1)
    return a
}

window.getPrices = function (e) {
    let s = 50;
    for (let index = 0; index < e; index++) {
        s *= 2.5
    }
    s = Math.floor(s)
    console.log(s * 10)
}

window.config = config;
window.utils = utils;

window.CATS_POOL = [];
window.LABEL_POOL = [];
window.COINS_POOL = [];
window.BLOOD_POOL = [];
window.SHADOW_POOL = [];
window.BULLET_POOL = [];

window.console.warn = function () { }
window.console.groupCollapsed = function (teste) {
    return teste
} //('hided warnings')

window.MAX_NUMBER = 1000000;

window.MAIN_FONT = 'ourland'
window.SEC_FONT = 'poppinsbold'



window.LABELS = {};
window.LABELS.LABEL1 = {
    fontFamily: window.MAIN_FONT,
    fontSize: '18px',
    fill: 0xFFFFFF,
    align: 'center',
    stroke: 0,
    letterSpacing:1,
    dropShadow: true,
    dropShadowAngle: 1.5,
    dropShadowDistance: 2,
    fillGradientType: 1,
    fontSize: 28,
    strokeThickness: 3,
}
window.LABELS.LABEL3 = {
    fontFamily: window.SEC_FONT,
    fontSize: '18px',
    fill: 0xFFFFFF,
    align: 'center',
    //stroke: 0,
    letterSpacing:1,
    //dropShadow: true,
    dropShadowAngle: 1.5,
    dropShadowDistance: 2,
    fillGradientType: 1,
    fontSize: 28,
    //strokeThickness: 3,
}
window.LABELS.LABEL_CHEST = {
    fontFamily: window.MAIN_FONT,
    fontSize: '18px',
    fill: 0xFFFFFF,
    align: 'center',
    stroke: 0xbb00bb,
    strokeThickness: 4,
}
window.LABELS.LABEL_SPACESHIP = {
    fontFamily: window.MAIN_FONT,
    fontSize: '18px',
    fill: 0xFFFFFF,
    align: 'center',
    stroke: 0xFFFF00,
    strokeThickness: 4,
}
window.LABELS.LABEL_STATS = {
    fontFamily: window.MAIN_FONT,
    fontSize: '14px',
    fill: 0xFFFFFF,
    align: 'center',
    stroke: 0,
    strokeThickness: 4
}

window.LABELS.LABEL2 = {
    fontFamily: window.MAIN_FONT,
    fontSize: '24px',
    fill: 0xFFFFFF,
    align: 'center',
}

window.LABELS.LABEL_DAMAGE = {
    fontFamily: window.MAIN_FONT,
    fontSize: '14px',
    fill: 0xFFFFFF,
    align: 'center',
    stroke: 0,
    strokeThickness: 4,
}

