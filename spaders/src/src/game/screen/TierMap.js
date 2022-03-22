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
        this.mapRenderContainer = new PIXI.Container();
        this.mapRenderSprite = new PIXI.Sprite();

        this.addChild(this.mapContainer)
        this.mapContainer.addChild(this.mapRenderSprite)
        this.addChild(this.buttonsContainer)

        this.terrainLayers = []
        this.pathLayer = []


        let center = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, this.width / 4);
        center.x = this.width / 2
        center.y = this.height / 2

        center.alpha = 0

        this.addChild(center)
    }

    addLayer(target) {
        let newLayer = []
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
                this.mapRenderContainer.addChild(gridSquare);
                line.push(gridSquare);
            }

            newLayer.push(line);
        }
        target.push(newLayer)

        return newLayer;
    }

    addTierLevel(tierButton, pos) {
        this.buttonsContainer.addChild(tierButton);
        tierButton.x = pos.i * this.sizeTile.width + this.sizeTile.width / 2 - tierButton.width / 2;
        tierButton.y = pos.j * this.sizeTile.height + this.sizeTile.height - tierButton.height;
    }
    cleanMap() {
        if(this.mapRenderSprite.parent){
            this.mapRenderSprite.parent.removeChild(this.mapRenderSprite)
        }


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

    drawMap(mapData, tileSize = { width: 64, height: 64 }, customTotalLevels = -1) {

        this.cleanMap()
        this.mapContainer.addChild(this.mapRenderSprite)

        this.sizeTile = tileSize

        this.sizeGrid = { i: mapData.height, j: mapData.width }

        if (window.tilemapRenders[mapData.name]) {
            this.mapRenderSprite.setTexture(window.tilemapRenders[mapData.name])
            return;
        }

        this.terrainLayers = []
        this.pathLayer = []

        this.mapRenderContainer = new PIXI.Container();

        //CACHE HERE
        
        this.paths = []

        for (let index = 0; index < mapData.terrainLayers.length; index++) {

            let layer1 = this.addLayer(this.terrainLayers);

            for (let i = 0; i < layer1.length; i++) {
                for (let j = 0; j < layer1[i].length; j++) {

                    let id = mapData.terrainLayers[index][i][j] - 1;
                    if (id >= 0) {
                        layer1[i][j].setTexture(PIXI.Texture.fromFrame(mapData.tiles[id]))
                        layer1[i][j].alpha = 1;
                        layer1[i][j].tint = mapData.terrainColors[index % mapData.terrainColors.length]
                    }
                }
            }

        }


        let tempPaths = []
        let totalPaths = customTotalLevels < 0 ? 99999 : customTotalLevels;
        for (let index = 0; index < mapData.pathLayers.length; index++) {
            let layer2 = this.addLayer(this.pathLayer);
            for (let i = 0; i < layer2.length; i++) {


                for (let j = layer2[i].length-1; j >=0 ; j--) {
                    let id = mapData.pathLayers[index][i][j] - 1;
                    if (id >= 0) {
                        layer2[i][j].setTexture(PIXI.Texture.fromFrame(mapData.tiles[id]))
                        layer2[i][j].alpha = 1;
                        layer2[i][j].tint = mapData.pathColors[index % mapData.pathColors.length]                        

                        tempPaths.push(layer2[i][j]);
                    }
                }
            }
        }

        while (tempPaths.length > totalPaths) {
            tempPaths[0].visible = false;
            tempPaths.shift()
        }
        let texture = renderer.generateTexture(this.mapRenderContainer);


        this.mapRenderSprite.setTexture(texture)

        window.tilemapRenders[mapData.name] = texture;
    }
}