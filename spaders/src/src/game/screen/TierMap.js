import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import colorSchemes from '../../colorSchemes';
import config from '../../config';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
import Planet from './Planet';
import ProgressBar from './ProgressBar';
export default class SquareButton extends PIXI.Container {
    constructor(unscaledTierSize) {
        super();

        this.unscaledTierSize = unscaledTierSize;

        this.buildBase();
    }

    buildBase() {
        this.sizeGrid = { i: 10, j: 5 }
        this.sizeTile = { width: 100, height: 100 }
        this.mapContainer = new PIXI.Container();
        this.buttonsContainer = new PIXI.Container();
        for (var i = 0; i < this.sizeGrid.i; i++) {
            for (var j = 0; j < this.sizeGrid.j; j++) {
                //let gridSquare = PIXI.Sprite.fromFrame('gridSquare.png')
                let gridSquare = new PIXI.mesh.NineSlicePlane(
                    PIXI.Texture.fromFrame('gridSquare.png'), 20, 20, 20, 20)//PIXI.Sprite.fromFrame(colorScheme.sprite)

                gridSquare.width = this.sizeTile.width
                gridSquare.height = this.sizeTile.height
                //gridSquare.scale.set(CARD.width / gridSquare.width);
                gridSquare.x = j * this.sizeTile.width;
                gridSquare.y = i * this.sizeTile.height;
                gridSquare.alpha = 0
                this.mapContainer.addChild(gridSquare);
            }
        }

        this.addChild(this.mapContainer)
        this.addChild(this.buttonsContainer)
    }
    addTierLevel(tierButton, pos) {
        console.log(tierButton, pos)
        this.buttonsContainer.addChild(tierButton);

        tierButton.x = pos.j * this.sizeTile.width + this.sizeTile.width / 2 - tierButton.width / 2;
        tierButton.y = pos.i * this.sizeTile.height + this.sizeTile.height / 2 - tierButton.height / 2;
    }
}