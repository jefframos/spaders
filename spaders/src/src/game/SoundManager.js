import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import { sound } from '@pixi/sound';

export default class SoundManager {
    constructor() {
        this.sound = sound
        this.soundData = []
        this.soundData.push({ id: 'ingame-soundtrack', src: './audio/dream2.mp3', sound: null })
        this.soundData.push({ id: 'main-soundtrack', src: './audio/dream1.mp3', sound: null })

        this.soundData.forEach(element => {
            element.sound = sound.add(element.id, element.src)
        });
    }
    toggleMute(){
        return this.sound.toggleMuteAll();
    }
    playMainMenu() {
        this.stopSound('ingame-soundtrack');
        this.playUnique('main-soundtrack');
    }
    playInGame() {
        this.stopSound('main-soundtrack');
        this.playUnique('ingame-soundtrack', true, 2);
    }
    playUnique(id, loop = true, offset = 0) {

        let soundData = this.findById(id)
        if (!soundData) {
            return;
        }
        if (!soundData.sound.isPlaying) {
            soundData.sound.loop = loop;
            console.log("PLAY", id)
            soundData.sound.play(offset);
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