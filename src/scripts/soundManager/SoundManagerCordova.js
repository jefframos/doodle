//////cordova plugin add cordova-plugin-nativeaudio
import AbstractSoundManager from './AbstractSoundManager'
export default class SoundManagerCordova  extends AbstractSoundManager{
    constructor() {
        super();
        this.audioPlayingList = [];       
    }
    getFileName(path) {
        let tempSplit = path.split('/')
        let fileName = tempSplit[tempSplit.length - 1]
        return fileName.substr(0, fileName.length - 4)
    }
    load(list) {
        for (var i = list.length - 1; i >= 0; i--) {
            window.plugins.NativeAudio.preloadComplex(this.getFileName(list[i]), list[i], 0.5, 1, 0, function(msg) {}, function(msg) {
                //alert(msg)
            });
        }
    }

    fadeIn(id, time = 1000) {
        window.plugins.NativeAudio.stop( id );
        window.plugins.NativeAudio.play( id );
        this.audioPlayingList[id] = true;
    }

    fadeOut(id, time = 1000) {
        window.plugins.NativeAudio.stop( id );
        this.audioPlayingList[id] = false;
    }

    mute() {
        for(var index in this.audioPlayingList) { 
		    if(this.audioPlayingList[index]){
		    	window.plugins.NativeAudio.setVolumeForComplexAsset( id, 0);		    	
		    } 
		}
    }

    unmute() {
        for(var index in this.audioPlayingList) { 
		    if(this.audioPlayingList[index]){
		    	window.plugins.NativeAudio.setVolumeForComplexAsset( id, 0.5);		    	
		    } 
		}
    }

    disposeAll() {
    	for(var index in this.audioPlayingList) { 
		    if(this.audioPlayingList[index]){
		    	window.plugins.NativeAudio.unload( id);		    	
		    } 
		}
    }
    toggleMute() {
        if (this.isMute) {
            this.unmute();
        } else {
            this.mute();
        }
    }
}