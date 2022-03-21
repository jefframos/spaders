import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import colorSchemes from '../../colorSchemes';
import config from '../../config';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
import Planet from './Planet';
import ProgressBar from './ProgressBar';
export default class TierMap extends PIXI.Container {
    constructor(unscaledTierSize) {
        super();

        this.unscaledTierSize = unscaledTierSize;
        this.buildBase();
    }

    buildBase() {

        console.log("BUILD")
        this.sizeGrid = { i: 10, j: 10 }
        this.sizeTile = { width: 64, height: 64 }
        this.mapContainer = new PIXI.Container();
        this.buttonsContainer = new PIXI.Container();
        this.terrainLayers = [[], []]
        this.pathLayer = [[]]

        this.addLayer(this.terrainLayers, 0)
        this.addLayer(this.terrainLayers, 1)
        this.addLayer(this.pathLayer, 0)

        this.addChild(this.mapContainer)
        this.addChild(this.buttonsContainer)

        let center = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, this.width / 4);
        center.x = this.width / 2
        center.y = this.height / 2

        center.alpha = 0

        this.addChild(center)
    }

    addLayer(target, id) {
        for (var i = 0; i < this.sizeGrid.i; i++) {

            let line = [];
            for (var j = 0; j < this.sizeGrid.j; j++) {
                //let gridSquare = PIXI.Sprite.fromFrame('gridSquare.png')
                let gridSquare = new PIXI.Sprite.fromFrame('gridSquare.png');//PIXI.Sprite.fromFrame(colorScheme.sprite)

                gridSquare.width = this.sizeTile.width
                gridSquare.height = this.sizeTile.height
                //gridSquare.scale.set(CARD.width / gridSquare.width);
                gridSquare.x = j * this.sizeTile.width;
                gridSquare.y = i * this.sizeTile.height
                gridSquare.alpha = 0
                this.mapContainer.addChild(gridSquare);
                line.push(gridSquare);
            }

            target[id].push(line);
        }
    }

    addTierLevel(tierButton, pos) {
        this.buttonsContainer.addChild(tierButton);
        tierButton.x = pos.i * this.sizeTile.width + this.sizeTile.width / 2 - tierButton.width / 2;
        tierButton.y = pos.j * this.sizeTile.height + this.sizeTile.height - tierButton.height;
    }
    cleanMap() {
        for (let index = 0; index < this.terrainLayers.length; index++) {

            let layer1 = this.terrainLayers[index];

            for (let i = 0; i < layer1.length; i++) {
                for (let j = 0; j < layer1[i].length; j++) {


                    layer1[i][j].setTexture(PIXI.Texture.EMPTY)
                    layer1[i][j].alpha = 0;

                }
            }

        }

        for (let index = 0; index < this.pathLayer.length; index++) {

            let layer1 = this.pathLayer[index];

            for (let i = 0; i < layer1.length; i++) {
                for (let j = 0; j < layer1[i].length; j++) {


                    layer1[i][j].setTexture(PIXI.Texture.EMPTY)
                    layer1[i][j].alpha = 0;

                }
            }

        }
    }
    drawMap(mapData) {
        console.log(mapData, this.layers);
        //CACHE HERE
        this.cleanMap()

        let colors = colorSchemes.getCurrentColorScheme();

        let layer1 = this.terrainLayers;

        for (let index = 0; index < mapData.terrainLayers.length; index++) {

            layer1 = this.terrainLayers[index];

            for (let i = 0; i < layer1.length; i++) {
                for (let j = 0; j < layer1[i].length; j++) {

                    let id = mapData.terrainLayers[index][i][j] - 1;
                    if (id >= 0) {

                        layer1[i][j].setTexture(PIXI.Texture.fromFrame(mapData.tiles[id]))
                        layer1[i][j].alpha = 1;

                        layer1[i][j].tint = colors.list[index > 0 ? 3 : 0].color
                    }
                }
            }

        }



        let layer2 = this.pathLayer[0];

        for (let i = 0; i < layer2.length; i++) {
            for (let j = 0; j < layer2[i].length; j++) {
                let id = mapData.pathLayers[0][i][j] - 1;
                if (id >= 0) {

                    layer2[i][j].setTexture(PIXI.Texture.fromFrame(mapData.tiles[id]))
                    layer2[i][j].alpha = 1;

                    // layer1[i][j].tint = colors.list[1].color
                }
            }
        }


    }
}