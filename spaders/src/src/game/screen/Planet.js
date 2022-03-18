import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import colorSchemes from '../../colorSchemes';
import config from '../../config';
import utils from '../../utils';
export default class Planet extends PIXI.Container {
    constructor() {
        super();

        this.planetSprite = new PIXI.Sprite.fromFrame("l0_planet_0_1.png");

        this.layers = [];

        for (let index = 1; index <= 6; index++) {
            let sprite = new PIXI.Sprite.fromFrame("l" + index + "_planet_0_1.png");
            this.planetSprite.addChild(sprite);
            this.layers.push(sprite);
        }

        this.addChild(this.planetSprite);

    }
    updateColors(colorList){
        this.planetSprite.tint = colorList.list[0].color;
        for (let index = 0; index < this.layers.length; index++) {
            const element = this.layers[index];
            element.tint = colorList.list[index].color
        }
    }
    updateMapTextures(id){
        for (let index = 1; index <= 6; index++) {
            this.layers[index - 1].setTexture(PIXI.Texture.fromFrame("l" + index + "_planet_"+id+"_1.png"))
        }

    }
}