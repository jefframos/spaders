import * as PIXI from 'pixi.js';
export default class SprteSpritesheetAnimation extends PIXI.Sprite {
    constructor() {
        super();
        this.spriteLayers = [];
    }

    addLayer(spriteName, totalFramesRange = {min:0, max:1}, time = 0.1) {
        let animLayer = {
            currentAnimationTime: 0,
            currentFrame: 0,
            animationFrames: [],
            frameTime: time,
            sprite : new PIXI.Sprite()
        }

        for (let index = totalFramesRange.min; index <= totalFramesRange.max; index++) {
            animLayer.animationFrames.push(spriteName + index + ".png");            
        }

        this.spriteLayers.push(animLayer);

        this.addChild(animLayer.sprite)
        this.updateAnimation(0)
    }
    tintLayer(layerID, color){
        this.spriteLayers[layerID].sprite.tint = color;
    }
    updateAnimation(delta) {

        this.spriteLayers.forEach(element => {
            if (element.currentAnimationTime >= 0) {
                element.currentAnimationTime -= delta;
                if (element.currentAnimationTime < 0) {
                    element.currentFrame++;
                    element.currentFrame %= element.animationFrames.length;
                    element.currentAnimationTime = element.frameTime;
                }
            }

            element.sprite.setTexture(PIXI.Texture.fromFrame(element.animationFrames[element.currentFrame]));
        });
    }

    update(delta) {
        this.updateAnimation(delta);
    }
}