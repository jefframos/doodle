import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import UIList from '../uiElements/UIList';
import UIBar from '../uiElements/UIBar';
import UILabelButton1 from '../UILabelButton1';
import StatContainer from './StatContainer';
export default class RecruitCharItem extends UIList {
    constructor(rect = {
        w: 400,
        h: 80
    }) {
        super();

        this.w = rect.w;
        this.h = rect.h;
        this.elementsList = [];
        this.rect = rect;


        this.infoButton = new PIXI.Sprite.from('button-3');
        this.infoButton.scaleContent = true;
        this.infoButton.listScl = 0.2;
        this.infoButton.align = 1;
        // this.infoButton.fitWidth = 0.75;
        this.infoButton.fitHeight = 0.75;
        // this.infoButton.scaleContentMax = true;
        this.elementsList.push(this.infoButton);
        this.container.addChild(this.infoButton);

        this.itemTexture = new PIXI.Sprite.from('');
        this.itemTexture.anchor.set(0.5);


        this.infoButton.interactive = true;
        this.infoButton.buttonMode = true;
       // this.infoButton.on('mouseup', this.onShopItem.bind(this)).on('touchend', this.onShopItem.bind(this));


        this.descriptionContainer = new PIXI.Container();
        this.descriptionLabel = new PIXI.Text('TESTE', {
            fontFamily: MAIN_FONT,
            fontSize: '14px',
            fill: 0xFFFFFF,
            align: 'left',
            fontWeight: '800'
        });

        this.descriptionContainer.scaleContentMax = true;
        this.descriptionContainer.listScl = 0.3;
        // this.descriptionContainer.align = 0.5;
        this.descriptionContainer.addChild(this.descriptionLabel);

        this.elementsList.push(this.descriptionContainer);
        this.container.addChild(this.descriptionContainer);

        this.updateHorizontalList();

        this.onItemSelect = new Signals();
        this.onShowInfo = new Signals();

        this.statsView = new StatContainer();
        this.statsView.listScl = 0.5;
        this.statsView.fitHeight = 0.5
        //this.addChild(this.statsView);
        //this.elementsList.push(this.statsView);
        
        this.recruitButton = new UILabelButton1(0x33ff99, 100)
        this.recruitButton.addCenterLabel("Add to Party", 0, 0.8)
        this.recruitButton.onClick.add(()=>{
            this.onShopItem()
        })       
        this.recruitButton.scale.set(config.height / this.recruitButton.height * 0.1)
        this.recruitButton.listScl = 0.3;
        this.recruitButton.fitHeight = 0.5
        this.addChild(this.recruitButton);
        this.elementsList.push(this.recruitButton)
        
        this.infoSheetCharacter = new UILabelButton1(0xFFFFFF, 50)
        this.infoSheetCharacter.addCenterLabel("i", 0)
        this.infoSheetCharacter.onClick.add(()=>{
            this.onInfoCallback()
        })       
        this.infoSheetCharacter.scale.set(config.height / this.infoSheetCharacter.height * 0.1)
        this.infoSheetCharacter.listScl = 0.2;
        this.infoSheetCharacter.fitHeight = 0.5
        this.addChild(this.infoSheetCharacter);
        this.elementsList.push(this.infoSheetCharacter)


    }
    setId(data) {

        this.label = data.label;
        this.charData = data;
        this.statsView.showCharData(data)
        this.descriptionLabel.text = this.label;
        if (this.itemTexture && this.itemTexture.parent) {
            this.itemTexture.parent.removeChild(this.itemTexture);
        }
        this.itemTexture.texture = PIXI.Texture.from(data.graphicsData.textures.front);
        this.itemTexture.scale.set(this.infoButton.height / this.itemTexture.height * 0.5)
        this.itemTexture.anchor.set(0.5);
        this.itemTexture.x = this.infoButton.width / this.infoButton.scale.x / 2
        this.itemTexture.y = this.infoButton.height / this.infoButton.scale.y / 2
        this.infoButton.addChild(this.itemTexture)
        this.updateHorizontalList();
    }
    onInfoCallback() {
        this.onShowInfo.dispatch(this.charData, this.infoButton);
    }
    onShopItem() {
        this.onItemSelect.dispatch(this.charData);
    }
}