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
        this.currentButtons = []
        this.buildBase();
    }

    buildBase() {

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


        this.boundPointsGraphics = { minx: null, maxx: null, miny: null, maxy: null }
        this.boundPoints = { minx: 0, maxx: 0, miny: 0, maxy: 0 }
        let center = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 20);
        center.x = this.width / 2
        center.y = this.height / 2

        center.alpha = 1

        //this.addChild(center)
    }
    update(delta) {
        if (!this.parent.visible) {
            return;
        }
        this.currentButtons.forEach(element => {
            element.update(delta);
        });
    }
    drawBounds() {
        let center = { x: this.width / 2 / this.scale.x, y: this.height / 2 / this.scale.y }
        if (!this.boundPointsGraphics.minx) {

            this.boundPointsGraphics.minx = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 20);
            this.boundPointsGraphics.maxx = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 20);
            this.boundPointsGraphics.miny = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 20);
            this.boundPointsGraphics.maxy = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 20);

            this.boundPointsGraphics.minx.position = center
            this.boundPointsGraphics.maxx.position = center
            this.boundPointsGraphics.miny.position = center
            this.boundPointsGraphics.maxy.position = center

            this.addChild(this.boundPointsGraphics.minx)
            this.addChild(this.boundPointsGraphics.maxx)
            this.addChild(this.boundPointsGraphics.miny)
            this.addChild(this.boundPointsGraphics.maxy)

        }
        this.boundPointsGraphics.minx.x = this.boundPoints.minx
        this.boundPointsGraphics.maxx.x = this.boundPoints.maxx
        this.boundPointsGraphics.miny.y = this.boundPoints.miny
        this.boundPointsGraphics.maxy.y = this.boundPoints.maxy

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
        tierButton.x = pos.i * this.sizeTile.width + this.sizeTile.width / 2 - tierButton.unscaledCardSize.width / 2;
        tierButton.y = pos.j * this.sizeTile.height// + this.sizeTile.height - tierButton.height;

        this.currentButtons.push(tierButton);
    }
    cleanMap() {
        if (this.mapRenderSprite.parent) {
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

        this.currentButtons = []
    }

    removeEmpty() {

    }

    drawMap(mapData, tileSize = { width: 64, height: 64 }, customTotalLevels = -1) {
        // console.log(mapData)
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
        console.log(mapData.terrainLayers)

        let tintId = 0;
        for (let index = 0; index < mapData.terrainLayers.length; index++) {

            let layer1 = this.addLayer(this.terrainLayers);

            for (let i = 0; i < layer1.length; i++) {
                for (let j = 0; j < layer1[i].length; j++) {

                    let id = mapData.terrainLayers[index].tiles[i][j] - 1;
                    if (id >= 0) {


                        layer1[i][j].x += mapData.terrainLayers[index].offsetx
                        layer1[i][j].y += mapData.terrainLayers[index].offsety
                        //layer1[i][j].setTexture(PIXI.Texture.fromFrame('tile_1_'+id%64+'.png'))
                        layer1[i][j].setTexture(PIXI.Texture.fromFrame(mapData.tiles[id]))
                        layer1[i][j].alpha = 1;
                        if (!mapData.terrainLayers[index].noColor) {
                            layer1[i][j].tint = mapData.terrainColors[tintId % mapData.terrainColors.length]
                            
                        }
                    } else {
                        if (layer1[i][j].parent) {
                            layer1[i][j].parent.removeChild(layer1[i][j])
                        }
                    }
                }
            }

            if (!mapData.terrainLayers[index].noColor) {
                tintId++
            }

        }

        tintId = 0
        let tempPaths = []
        let totalPaths = customTotalLevels < 0 ? 99999 : customTotalLevels;
        for (let index = 0; index < mapData.pathLayers.length; index++) {
            let layer2 = this.addLayer(this.pathLayer);
            for (let i = 0; i < layer2.length; i++) {


                for (let j = layer2[i].length - 1; j >= 0; j--) {
                    let id = mapData.pathLayers[index].tiles[i][j] - 1;
                    if (id >= 0) {

                        layer2[i][j].x += mapData.pathLayers[index].offsetx
                        layer2[i][j].y += mapData.pathLayers[index].offsety

                        layer2[i][j].setTexture(PIXI.Texture.fromFrame(mapData.tiles[id]))
                        layer2[i][j].alpha = 1;

                        if (!mapData.pathColors[index].noColor) {
                            layer2[i][j].tint = mapData.pathColors[tintId % mapData.pathColors.length]
                        }

                        tempPaths.push(layer2[i][j]);
                    } else {
                        if (layer2[i][j].parent) {
                            layer2[i][j].parent.removeChild(layer2[i][j])
                        }
                    }
                }
            }

            if (!mapData.pathColors[index].noColor) {
                tintId++
            }
        }

        // while (tempPaths.length > totalPaths) {
        //     tempPaths[0].visible = false;
        //     tempPaths.shift()
        // }

        let texture = renderer.generateTexture(this.mapRenderContainer);


        this.mapRenderSprite.setTexture(texture)

        window.tilemapRenders[mapData.name] = texture;


        this.calculateMapBounds();
        // //not quite working
        setTimeout(() => {
            this.calculateMapBounds()
            //this.drawBounds();
        }, 100);
    }

    calculateMapBounds() {
        this.boundPoints.minx = this.width * 0.4 / this.scale.x
        this.boundPoints.maxx = this.width * 0.6 / this.scale.x
        this.boundPoints.miny = this.height * 0.4 / this.scale.y
        this.boundPoints.maxy = this.height * 0.6 / this.scale.y
    }
}