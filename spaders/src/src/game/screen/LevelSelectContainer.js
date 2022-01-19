import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import { debug } from 'webpack';

export default class LevelSelectContainer extends PIXI.Container {
    constructor(screen) {
        super();

        this.gameScreen = screen;

        this.screenContainer = new PIXI.Container();
        this.addChild(this.screenContainer)

        this.levelCards = [];


       

        let navMargin = 20
        let navSize = (config.width - navMargin * 2) / 10

        this.currentTier = 0;

        this.navButtons = [];

        this.navMarker = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, navSize, 8);
        for (let index = 0; index < 10; index++) {
            
            let navButton = this.getRect(navSize, window.colorsOrder[index]);
            this.addChild(navButton)

            let label = new PIXI.Text(index + 1, { font: '24px', fill: 0xFFFFFF, align: 'center', fontWeight: '200', fontFamily: 'round_popregular' });
            label.pivot.x = label.width / 2
            label.pivot.y = label.height / 2
            label.x = navButton.width / 2
            label.y = navButton.height / 2
            navButton.addChild(label)
            
            navButton.x = index * navSize + navMargin

            navButton.interactive = true;
            navButton.buttonMode = true;
            navButton.on('mousedown', this.updateTier.bind(this, index)).on('touchstart', this.updateTier.bind(this, index));
            
            this.navButtons.push(navButton);
        }
        
        this.addChild(this.navMarker)
        this.navMarker.y = navSize + 8;
        this.updateTier(0);

        this.levelBackShape = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, config.width, config.height * 0.8);
		this.addChild(this.levelBackShape)
		this.levelBackShape.alpha = 0
    }
    updateTier(tier) {
        this.currentTier = tier;

        this.levelCards.forEach(element => {
            if(element.image.parent){
                element.image.parent.removeChild(element.image);
            }
        });
        this.levelCards = [];
        window.levelTiersData[this.currentTier].forEach(element => {

            this.addCard(element);
        });

        this.drawCards();

        TweenLite.to(this.navMarker, 0.25, {x: this.navButtons[this.currentTier].x})
    }
    getRect(size = 4, color = 0xFFFFFF) {
        return new PIXI.Graphics().beginFill(color).drawRect(0, 0, size, size);
    }
    show(force = false, delay = 0) {

        this.visible = true;

    }
    hide(force = false) {

        this.visible = true;
    }
    addCard(data) {
        let pieceSize = 16;
        let card = this.gameScreen.generateImage(data.pieces, pieceSize, 32)
        card.y = 0
        card.pivot.x = card.width / 2

        let label = new PIXI.Text(data.levelName, { font: '22px', fill: 0xFFFFFF, align: 'center', fontWeight: '200', fontFamily: 'round_popregular' });
        label.x = 0//card.width / 2 - pieceSize - label.width / 2
        label.y = card.height - pieceSize / 2 - 32

        //label.scale.set(card.width / label.width)

        card.addChild(label)

        card.on('mousedown', this.selectLevel.bind(this, data)).on('touchstart', this.selectLevel.bind(this, data));
        card.interactive = true;
        card.buttonMode = true;

        this.levelCards.push({ data: data, image: card })
    }

    selectLevel(data) {
        console.log(data)
        this.gameScreen.startNewLevel(data, false);
    }
    drawCards() {
        let maxPerLine = 3
        let margin = 30;
        let distance = (config.width - margin * 2) / maxPerLine
        let line = -1
        let col = 0

        let lines = []

        for (let index = 0; index < this.levelCards.length; index++) {
            const element = this.levelCards[index];
            this.addChild(element.image)
            if (index % maxPerLine == 0) {
                line++
            }
            element.image.x = (index % maxPerLine) * distance + margin + distance * 0.5///+ element.image.width / 2 + margin * 0.5
            
            if(index >= maxPerLine){
                element.image.y = 30 + lines[index - maxPerLine]
                console.log(lines[index % maxPerLine])
                console.log(lines)

            }else{

                element.image.y = 100
            }

            lines.push(element.image.y + element.image.height)

        }

    }
    update(delta) {


    }
    updateStartLabel() {
    }
    restart() {
    }
    goBack() {
    }
    removeEvents() {

    }
    addEvents() {

    }


}