import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import { sound } from '@pixi/sound';

export default class SoundManager {
    constructor() {
        this.sound = sound
        this.soundData = []
        this.soundData.push({ id: 'ingame-soundtrack', src: './audio/dream2.mp3', sound: null })
        this.soundData.push({ id: 'main-soundtrack', src: './audio/dream1.mp3', sound: null })
        this.soundData.push({ id: 'kill', src: './audio/fx/kill.mp3', sound: null })
        this.soundData.push({ id: 'magic', src: './audio/fx/teleport.mp3', sound: null })
        this.soundData.push({ id: 'pop', src: './audio/fx/pop.mp3', sound: null })
        this.soundData.push({ id: 'pop2', src: './audio/fx/pop2.mp3', sound: null })
        this.soundData.push({ id: 'revealSpecial', src: './audio/fx/getCrazyOne.mp3', sound: null })
        this.soundData.push({ id: 'dropTile', src: './audio/fx/dropTile.mp3', sound: null })
        this.soundData.push({ id: 'getThemAll', src: './audio/fx/getThemAll.mp3', sound: null })
        this.soundData.push({ id: 'coin', src: './audio/fx/getstar.mp3', sound: null })
        //this.soundData.push({ id: 'place', src: './audio/fx/place.mp3', sound: null })
        this.soundData.push({ id: 'place', src: './audio/fx/Pop-Low-Pitch-Up-02.mp3', sound: null })
        this.soundData.push({ id: 'fireworks', src: './audio/fx/Ping-Slide-Down.mp3', sound: null })
        this.soundData.push({ id: 'shoosh', src: './audio/fx/shoosh.mp3', sound: null })
        this.soundData.push({ id: 'coins_04', src: './audio/fx/coins_04.mp3', sound: null })
        this.soundData.push({ id: 'tap', src: './audio/fx/Tap-01.mp3', sound: null })
        this.soundData.push({ id: 'tap2', src: './audio/fx/Pop-Tone.mp3', sound: null })
        this.soundData.push({ id: 'tapPlay', src: './audio/fx/Pop-Musical.mp3', sound: null })
        this.soundData.push({ id: 'explosion', src: './audio/fx/Fire-Burst-Small-01.mp3', sound: null })
        this.soundData.push({ id: 'startLevel', src: './audio/fx/Harp-Flutter-02.mp3', sound: null })
        this.soundData.push({ id: 'endLevel', src: './audio/fx/Musical-Beep-Loop-02.mp3', sound: null })

        this.soundData.forEach(element => {
            element.sound = sound.add(element.id, element.src)
        });

        this.currentSoundtrack = null;

        this.fxMasterVolume = 0.2;
        this.soundtrackMasterVolume = 0.8;

            this.isMute = false;
        if(!window.COOKIE_MANAGER.settings.sound){
            this.mute();
        }

        this.thisLoopPlay = {}
    }
    update(){
        this.thisLoopPlay = {};
    }
    mute(){
        this.sound.muteAll();
        this.isMute = true;
    }
    toggleMute(){
        this.isMute = this.sound.toggleMuteAll();
        window.COOKIE_MANAGER.updateSettings({sound:!this.isMute})

        return this.isMute;
    }
    playMainMenu() {
        this.stopSound('ingame-soundtrack');
        this.playUnique('main-soundtrack');
    }
  
    speedUpSoundTrack(speed = 1.15) {
        if(this.currentSoundtrack){
            this.currentSoundtrack.speed = speed;
        }
    }
    playInGame() {
        this.stopSound('main-soundtrack');
        this.playUnique('ingame-soundtrack', true, 2);
    }
    play(id, data = {}) {
        let soundData = this.findById(id)
        if (!soundData) {
            return;
        }

        //this avoinds the same sound to be played on the same loop, update needs to be called for this to work
        if(this.thisLoopPlay[id]){
            return
        }else{
            this.thisLoopPlay[id] = true;
        }

        if(data.volume){
            data.volume *= this.fxMasterVolume;
        }else{
            data.volume = this.fxMasterVolume;
        }
        let playPromise = soundData.sound.play(data);

        if(playPromise.then){
            playPromise.then(function() {
                // carregou
              }, function(error) {
                console.log(soundData, error)
              });
        }
       
    }
    playUnique(id, loop = true, offset = 0) {

        let soundData = this.findById(id)
        if (!soundData) {
            return;
        }
        if (!soundData.sound.isPlaying) {
            soundData.sound.loop = loop;
            soundData.sound.singleInstance = loop;
            soundData.sound.volume = this.soundtrackMasterVolume;
            soundData.sound.play(offset);

            this.currentSoundtrack = soundData.sound;
        }
    }
    stopSound(id) {
        let soundData = this.findById(id)
        if (!soundData) {
            return;
        }
        if (soundData.sound.isPlaying) {
            console.log("STOP", id)
            soundData.sound.stop(soundData.id);
        }
    }
    findById(id) {
        let toReturn = null;
        this.soundData.forEach(element => {
            if (element.id == id) {
                toReturn = element;
            }
        });

        if (!toReturn) {
            console.log("no sound found", id)
        }
        return toReturn;
    }
}