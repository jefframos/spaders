import TweenMax from 'gsap';
import config from './config';
export default class ColorTweenManager {

    constructor() {
        this.tweenList = [];
    }

    killColorTween(target) {
        for (let i = this.tweenList.length - 1; i >= 0; i--) {
            if (this.tweenList[i].target == target) {
                this.tweenList[i].tween.kill();
                this.tweenList.splice(i, 1);
            }
        }
    }

    addColorTween(target, currentColor, targetColor, time = 0.5, delay = 0) {
        if (!this.tweenList) {
            this.tweenList = [];
        }
        const currentColorData = this.toRGB(currentColor);
        const targetColorData = this.toRGB(targetColor);
        const black = this.toRGB(0x000000);
        const tweenObj = {
            tween: TweenLite.to(currentColorData, time,
                {
                    delay,
                    r: targetColorData.r,
                    g: targetColorData.g,
                    b: targetColorData.b,
                    onUpdate: function (targ) {
                        currentColorData.r = Math.floor(currentColorData.r);
                        currentColorData.g = Math.floor(currentColorData.g);
                        currentColorData.b = Math.floor(currentColorData.b);
                        targ.tint = this.rgbToColor(currentColorData.r, currentColorData.g, currentColorData.b);
                    }.bind(this),
                    onUpdateParams: [target],
                }),
            target,
        };

        this.tweenList.push(tweenObj);

        return tweenObj;
    }
    invertColor(rgb) {
        const r = 255 - rgb >> 16 & 0xFF;
        const g = 255 - rgb >> 8 & 0xFF;
        const b = 255 - rgb & 0xFF;

        // console.log(r, g, b);

        return this.rgbToColor(r, g, b);

        // return {
        //     r,
        //     g,
        //     b,
        // };
    }
    toRGB(rgb) {
        const r = rgb >> 16 & 0xFF;
        const g = rgb >> 8 & 0xFF;
        const b = rgb & 0xFF;

        return {
            r,
            g,
            b,
        };
    }
    rgbToColor(r, g, b) {
        return r << 16 | g << 8 | b;
    }
}