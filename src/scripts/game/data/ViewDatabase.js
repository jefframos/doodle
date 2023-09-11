import CookieManager from "../CookieManager";
import EntityAttributes from "./EntityAttributes";
import EntityBuilder from "../screen/EntityBuilder";
import GameStaticData from "./GameStaticData";
import Utils from "../core/utils/Utils";
import signals from "signals";

export default class ViewDatabase {
    static _instance;
    static get instance() {
        if (!ViewDatabase._instance) {
            ViewDatabase._instance = new ViewDatabase();
        }
        return ViewDatabase._instance;
    }
    constructor() {
        this.onUpdateWearables = new signals.Signal();
    }

    initialize() {
        this.staticData = GameStaticData.instance.getAllDataFrom('database', 'body-parts')[0];
        CookieManager.instance.checkWardrobeStarters(this.staticData)

        this.findAvailablePiece()
    }
    containsPiece(region, id) {
        const wardrobe = CookieManager.instance.wardrobe;
        if (wardrobe && wardrobe[region]) {
            return wardrobe[region].includes(id)
        }
    }
    findAvailablePiece() {
        let toShuffle = [];

        for (const key in this.staticData) {
            toShuffle.push(key)
        }

        Utils.shuffle(toShuffle);

        const wardrobe = CookieManager.instance.wardrobe;

        let scramble = {}

        for (let index = 0; index < toShuffle.length; index++) {
            const area = toShuffle[index];
            scramble[area] = []
            for (let j = this.staticData[area].availables.min; j <= this.staticData[area].availables.max; j++) {
                if (j > 0) {
                    scramble[area].push(j)
                }
            }
            Utils.shuffle(scramble[area]);

        }
        const toReturn = { area: null, id: -1 }
        for (const key in scramble) {
            for (let index = 0; index < scramble[key].length; index++) {
                const scrambleKey = scramble[key][index];
                if (!wardrobe[key].includes(scrambleKey)) {
                    toReturn.area = key;
                    toReturn.id = scrambleKey;
                    break
                }
            }
        }

        return toReturn;
    }
    canGetPiece(){
        return ViewDatabase.instance.findAvailablePiece().area != null;
    }
    saveWardrobePiece(area, id) {
        CookieManager.instance.saveWardrobePiece(area, id)
        this.onUpdateWearables.dispatch();
    }
    saveWardrobeOpenSection(area) {
        CookieManager.instance.clearWardrobePieceNew(area)
        this.onUpdateWearables.dispatch();
    }
    getNewWearablesList() {
        return CookieManager.instance.allNewWardrobeDiscover()
    }
    getAreaWardrobe(area) {
        return CookieManager.instance.getAreaWardrobe(area)
    }
}