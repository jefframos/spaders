
import * as PIXI from 'pixi.js';
import TweenMax from 'gsap';
import config from '../../config';

import utils from '../../utils';
import colorSchemes from '../../colorSchemes';

export default class ColorTweens {
    constructor(label) {
        this.currentColorOrder = 0;
        this.currentColor = 0xFFFFFF;
        this.currentTween = null;
        this.isActive = false;


        this.colorList = [
            config.colors.green,
            config.colors.blue,
            config.colors.yellow,
            config.colors.red2,
            config.colors.purple,
            config.colors.pink,
            config.colors.blue2,
        ]
    }
    stopTween() {
        this.isActive = false;
        if (this.currentTween) {
            this.currentTween.kill()
            TweenMax.killTweensOf(this.currentTween);
        }
    }
    startTween(scheme = 0) {
        if (this.currentTween) {
            this.currentTween.kill()
            TweenMax.killTweensOf(this.currentTween);
        }
        this.colorList = []
        for (let index = 0; index < 7; index++) {
            const element = colorSchemes.colorSchemes[scheme].list[index].color;
            this.colorList.push(element);
        }

        this.currentColorOrder = 0;
        this.tweenNext();
    }
    onUpdateCallback(color) {
        this.currentColor = color;
    }
    tweenNext() {

        this.isActive = true;
        this.currentColorOrder++;
        this.currentColorOrder %= this.colorList.length
        this.currentTweenedColor = this.colorList[this.currentColorOrder];

        let next = this.currentColorOrder + 1;
        next%= this.colorList.length
        this.nextTweenedColor = this.colorList[next];

        this.currentTween = utils.addColorTween(this.currentTweenedColor,
            this.nextTweenedColor,
            0.3,
            0,
            this.onUpdateCallback.bind(this),
            this.tweenNext.bind(this)).tween;
    }
}
