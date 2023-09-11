import {
Howl,
Howler
}
    from 'howler';
import AbstractSoundManager from './AbstractSoundManager'
export default class SoundManager extends AbstractSoundManager {
    constructor() {
        super();
        this.audioList = [];
        this.playingList = [];

        this.currentLoop = null;
        Howler.volume(0.5);
    }
    getFileName(path) {
        let tempSplit = path.split('/')
        let fileName = tempSplit[tempSplit.length - 1]
        return fileName.substr(0, fileName.length - 4)
    }
    load(list) {
        // alert(list)
        for (var i = list.length - 1; i >= 0; i--) {
            let url = list[i].url.substr(0, list[i].url.length - 4)

            if (window.iOS) {
                url += '.mp3'
            }
            else {
                url += '.ogg'
            }

            // if(i == 0){
            //     alert(url)
            // }

            let sound = new Howl(
                {
                    src: [url],
                    // src: [url+'.ogg', url+'.mp3'],
                    // src: [list[i].url],
                    autoplay: false,
                    loop: false,
                    volume: 1,
                    onend: (e) => {
                        this.removeFromPlayListSoundId(e)
                    }
                });
            this.audioList[this.getFileName(list[i].url)] = sound;
        }

    }
    setRateOnLoops(rate) {
        rate = Math.max(0.5, rate)
        rate = Math.min(4, rate)
        for (let audio_id in this.audioList) {
            if (this.isPlaying(audio_id)) {
                if (this.audioList[audio_id].loop) {
                    this.audioList[audio_id].rate(rate) //rate;
                }
            }
        }
    }
    playLoopOnce(id, volume = 1) {
        if (this.isPlaying(id)) {
            return
        }
        this.playLoop(id, volume)
    }
    playLoop(id, volume = 1) {

        this.stopAll();
        if (this.currentLoop) {
            this.currentLoop.stop();
        }
        this.audioList[id].loop(true);
        this.audioList[id].volume(volume);
        let hid = this.audioList[id].play();

        this.currentLoop = this.audioList[id]
        this.playingList.push(
            {
                sound: this.audioList[id],
                hID: hid
            });
    }
    playOnce(id, volume = 1) {
        this.audioList[id].stop();
        this.play(id, volume);
    }
    play(id, volume = 1, rate = 1) {
        this.audioList[id].loop(false);
        this.audioList[id].volume(volume);
        let hid = this.audioList[id].play();        
        this.audioList[id].rate(rate)
        this.playingList.push(
            {
                sound: this.audioList[id],
                hID: hid
            });
    }
    stop(id) {
        if(! this.audioList[id]){
            return;
        }
        this.audioList[id].stop();
        this.removeFromPlayList(id);
    }
    fadeIn(id, volume = 1, time = 1000) {
        this.audioList[id].stop();
        this.removeFromPlayList(id);
        let hid = this.audioList[id].play();
        this.playingList.push(
            {
                sound: this.audioList[id],
                hID: hid
            });
        this.audioList[id].fade(this.audioList[id].volume, volume, time);
    }
    fadeOutAll(time = 1000) {

        for (var audio_id in this.audioList) {
            if (this.isPlaying(audio_id)) {
                this.fadeOut(audio_id, time)
            }
        }

        for (var i = this.playingList.length - 1; i >= 0; i--) {
            this.playingList[i].sound.stop();
            this.playingList.splice(i, 1);
        }
    }
    fadeOut(id, time = 1000) {
        let vol = this.audioList[id].volume
        this.audioList[id].fade(vol, 0, time);
        setTimeout(() => {
            this.removeFromPlayList(id);
        }, time);
    }
    stopAll() {
        for (var i = this.playingList.length - 1; i >= 0; i--) {
            this.playingList[i].sound.stop();
            this.playingList.splice(i, 1);
        }
    }
    removeFromPlayListSoundId(hID) {
        for (var i = this.playingList.length - 1; i >= 0; i--) {
            if (this.playingList[i].hID == hID) {
                this.playingList.splice(i, 1);
            }
        }
    }

    removeFromPlayList(id) {
        for (var i = this.playingList.length - 1; i >= 0; i--) {
            if (this.playingList[i].sound == this.audioList[id]) {
                this.playingList.splice(i, 1);
            }
        }
    }

    isPlaying(id) {

        for (var i = this.playingList.length - 1; i >= 0; i--) {
            if (this.playingList[i].sound == this.audioList[id]) {
                return true;
            }
        }
        return false;
    }
    mute() {
        Howler.volume(0);
        this.isMute = true;

    }

    unmute() {
        Howler.volume(0.5);
        this.isMute = false;
    }

    toggleMute() {
        if (this.isMute) {
            this.unmute();
        }
        else {
            this.mute();
        }
    }
}