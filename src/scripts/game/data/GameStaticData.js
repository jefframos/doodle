import { Assets } from 'pixi.js';
import EnemyStaticData from './EnemyStaticData';
import Game from '../../Game';
import ParticleDescriptor from '../components/particleSystem/ParticleDescriptor';
import SpriteSheetBehaviour from '../components/particleSystem/particleBehaviour/SpriteSheetBehaviour';

export default class GameStaticData {

    static _instance;
    static get instance() {
        if (!GameStaticData._instance) {
            GameStaticData._instance = new GameStaticData();
        }
        return GameStaticData._instance;
    }

    constructor() {
        this.staticAssets = {};
    }

    initialize() {
        let loadList = [
            { type: 'database', list: 'allData', path: ['allData'] },
            // { type: 'level', list: 'waves-level-1', path: ['enemy-wave-01'] },
            // { type: 'database', list: 'body-parts', path: ['body-parts'] },
            // { type: 'database', list: 'economy', path: ['game-shop'] },
            // { type: 'database', list: 'starter-inventory', path: ['starter-inventory'], shared: true },

            // { type: 'environment', list: 'levels', path: ['level-1', 'level-2', 'level-3'] },


            // { type: 'misc', list: 'attachments', path: ['attachments'] },
            // { type: 'misc', list: 'acessories', path: ['acessories'] },
            // { type: 'misc', list: 'buffs', path: ['buff-debuff'] },

            // { type: 'entities', list: 'enemy', path: ['enemies'] },
            // { type: 'entities', list: 'player', path: ['player'] },
            // { type: 'entities', list: 'companions', path: ['companions'] },

            // { type: 'cards', list: 'cards', path: ['cards'] },
            // { type: 'modifiers', list: 'attributes', path: ['attribute-modifiers'], shared: true },

            // { type: 'weapons', list: 'main', path: ['main-weapons'] },
            // { type: 'weapons', list: 'viewOverriders', path: ['weapon-view-overriders'] },
            // { type: 'weapons', list: 'inGameView', path: ['weapon-in-game-visuals'] },

            // { type: 'animation', list: 'entity', path: ['entity-animation'], shared: true },
            // { type: 'animation', list: 'player', path: ['player-animation'], shared: true },
            // { type: 'animation', list: 'companion', path: ['companion-animation'], shared: true },

            { type: 'vfx', list: 'weaponVFX', path: ['weapon-vfx'], shared: true },
            { type: 'vfx', list: 'entityVFXPack', path: ['general-vfx'], shared: true },

            { type: 'vfx', list: 'weaponVFXPack', path: ['weapon-vfx-pack'] },
            //{ type:'vfx',list: 'particleDescriptors', path: ['entity-particle-descriptor'] },
            { type: 'vfx', list: 'particleDescriptors', path: ['particle-descriptors'] },
            { type: 'vfx', list: 'behaviours', path: ['particle-behaviour'] },
        ]

        loadList.forEach(element => {
            if (!this.staticAssets[element.type]) {
                this.staticAssets[element.type] = {
                    sharedData: {}
                };
            }
            if (!this.staticAssets[element.type][element.list] && element.list !== undefined) {
                this.staticAssets[element.type][element.list] = {
                    allElements: []
                };
            }

            element.path.forEach(jsonPath => {
                let data = Game.MainLoader.resources[jsonPath].data
                if (data.list) {
                    data = Game.MainLoader.resources[jsonPath].data.list;
                }
                if (data.pokedex) {
                    data = Game.MainLoader.resources[jsonPath].data.pokedex;
                }
                data.forEach(row => {
                    this.staticAssets[element.type][element.list].allElements.push(row);
                    this.staticAssets[element.type][element.list][row.id] = row;
                    if (element.shared) {
                        this.staticAssets[element.type].sharedData[row.id] = row;
                    }
                });
            });
        });

        // this.staticAssets['vfxDescriptors'] = {};
        // this.convertSpriteSheet('vfx', 'weaponVFX')
        // this.convertSpriteSheet('vfx', 'entityVFXPack')
        console.log(this.staticAssets)
    }
    convertSpriteSheet(type, subtype) {
        let data = this.getAllDataFrom(type, subtype)
        this.staticAssets[type][subtype].descriptors = []
        data.forEach(spriteSheetParams => {
            let desc = new ParticleDescriptor()
            desc.addBaseBehaviours(SpriteSheetBehaviour, spriteSheetParams)
            this.staticAssets['vfxDescriptors'][spriteSheetParams.id] = (desc)
        });
    }
    getUnitById(id){
        var allData = this.getAllDataFrom('database', 'allData');
        return allData[id]
    }
    getDescriptor(id) {
        let data = this.staticAssets['vfxDescriptors'][id];
        if (!data) {
            console.error('unable to find descriptor for', id)
        } else {
            return data;
        }
    }
    getWaves(level = 'waves-level-1') {
        return this.getAllDataFrom('level', level);
    }
    getAllCards() {
        return this.getAllDataFrom('cards', 'cards');
    }
    getCardById(id) {
        let all = this.getAllDataFrom('cards', 'cards');
        for (let index = 0; index < all.length; index++) {
            const element = all[index];
            if (element.id == id) {
                return element;
            }
        }
    }
    getEntityByIndex(subtype = 'enemy', id = 0) {
        let type = 'entities';
        let data = this.staticAssets[type][subtype].allElements[id];
        if (!data) {
            console.error('unable to find data of', type, subtype, id)
        } else {
            return data;
        }
    }
    getEntityById(subtype = 'enemy', id) {
        let type = 'entities';
        let data = this.staticAssets[type][subtype][id];
        if (!data) {
            console.error('unable to find data of', type, subtype, id)
        } else {
            return data;
        }
    }

    getDataByIndex(type, subtype = 'enemy', id = 0) {
        let data = this.staticAssets[type][subtype].allElements[id];
        if (!data) {
            console.error('unable to find data of', type, subtype, id)
        } else {
            return data;
        }
    }
    getDataById(type, subtype = 'enemy', id) {
        let data = this.staticAssets[type][subtype][id];
        if (!data) {
            console.error('unable to find data of', type, subtype, id)
        } else {
            return data;
        }
    }
    getSharedDataById(type, id) {
        let data = this.staticAssets[type].sharedData[id];
        if (!data) {
            console.error('unable to find sharedData of', type, id)
        } else {
            return data;
        }
    }
    getAllDataFrom(type, subtype = 'enemy') {
        let data = this.staticAssets[type][subtype].allElements;
        if (!data) {
            console.error('unable to find data of', type, subtype, id)
        } else {
            return data;
        }
    }

}