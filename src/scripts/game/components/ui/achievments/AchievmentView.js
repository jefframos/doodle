import * as PIXI from 'pixi.js';

import Signals from 'signals';
import TweenMax from 'gsap';
import UIList from '../../../ui/uiElements/UIList';
import BaseBarView from '../progressBar/BaseBarView';

export default class AchievmentView extends PIXI.Container {
    constructor(width, height, padding = 0, texture = 'modal_container0010') {
        super();
        this.container = new PIXI.Container();

        this.addChild(this.container)
        this.onClaim = new Signals();
        this.popUp = new PIXI.NineSlicePlane(
            PIXI.Texture.from(texture), 50, 100, 50, 50)
        this.popUp.width = width
        this.popUp.height = height

        config.addPaddingPopup(this.popUp)

        this.container.addChild(this.popUp)

        this.contentList = new UIList()
        this.contentList.w = width - padding * 2
        this.contentList.h = height - padding * 2
        this.contentList.x = padding
        this.contentList.y = padding
        this.container.addChild(this.contentList)

        this.descriptionContainer = new PIXI.Container();
        this.claimContainer = new PIXI.Container();
        this.claimContainer.align = 1
        
        // this.claimButton = new ShopButton()

        

        // this.claimContainer.addChild(this.claimButton)

        // this.claimButton.onClickItem.removeAll()
        // this.claimButton.onClickItem.add(
        //     () => {
        //         //console.log(this.data.prizes)
        //         this.notificationDispatched = false;
        //         let prog = COOKIE_MANAGER.getAchievment(this.systemID, this.data.variable)
        //         this.onClaim.dispatch(this.convertPrize(prog.claimed))

        //         COOKIE_MANAGER.claimAchievment(this.systemID, this.data.variable);

        //         this.updateCurrentData()
        //     });
        this.systemID = ''
        this.data = {}
        this.notificationDispatched = false;
    }
    setData(data, systemID, systemOrder) {
        this.systemID = systemID;
        this.systemOrder = systemOrder;

        this.data = data;
        //let desc = data.title+'\n'+data.description
        let desc =  window.localizationManager.getLabel(data.description)
        this.descriptionLabel = this.addLabelToNotification(desc, this.popUp.width / 2)
        this.descriptionLabel.style.align = 'left'

        this.descriptionContainer.addChild(this.descriptionLabel)

        this.progressBar = new BaseBarView()
        this.progressBar.build(120,50)
        this.descriptionContainer.addChild(this.progressBar)
        this.progressBar.y = 55
        this.addElement(this.descriptionContainer)
        this.addElement(this.claimContainer)

    }
    cleatList() {
        this.contentList.removeAllElements();
    }

    addElement(element) {
        this.contentList.addElement(element)
        this.contentList.updateHorizontalList();
    }

    addLabelToNotification(text, wrap = 0) {
        let label = new PIXI.Text(text, LABELS.LABEL1);
        label.scaleContentMax = true;
        label.style.fontSize = 20
        if (wrap) {
            label.style.wordWrap = true
            label.style.wordWrapWidth = wrap
        }
        return label
    }

    addImageToNotification(imageSrc) {
        let sprite = new PIXI.Sprite.from(imageSrc);
        sprite.scaleContentMax = true;
        sprite.fitHeight = 0.8;
        return sprite
    }
    convertPrize(claimed){

        if(this.systemOrder > 0){

            return this.data.prizes[claimed] * (this.data.stageMultiplier * this.systemOrder)
        }else{
            return this.data.prizes[claimed]
        }
        
    }
    updateCurrentData(){
        let achieveData = COOKIE_MANAGER.getAchievment(this.systemID, this.data.variable);
        if(achieveData.claimed >= this.data.values.length){
            this.claimButton.deactiveMax();
            this.progressBar.visible = false;
            this.descriptionLabel.text = window.localizationManager.getLabel(this.data.title)
            this.contentList.updateHorizontalList();
            return 0
        }
        let currentValue = achieveData.progress;
        let nextUnclaimed = this.data.values[achieveData.claimed]
        this.progressBar.setLabel(currentValue + '/' + nextUnclaimed);
        this.descriptionLabel.text = this.descriptionLabel.text.replace('{x}', nextUnclaimed)

        this.claimButton.updateCoast(utils.formatPointsLabel(this.convertPrize(achieveData.claimed)))
        if (currentValue == 0) {
            this.progressBar.setProgressBar(0)
            this.claimButton.deactive();
            return 0
        }

        let bar = currentValue / nextUnclaimed;
        bar = Math.min(bar, 1)

        this.progressBar.setProgressBar(bar)
        if(bar >= 1){
            this.claimButton.enable();
            if(!this.notificationDispatched){
                this.notificationDispatched = true;
                return 1
            }
            return 2
        }else{
            this.claimButton.deactive();
        }

        return 0
    }
    show() {
        this.visible = true;

        this.updateCurrentData()
       
    }
    hide() {
        this.visible = false;
    }
}