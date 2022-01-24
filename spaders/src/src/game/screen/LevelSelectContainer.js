import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import { debug } from 'webpack';
//import { utils } from 'pixi.js/lib/core';

export default class LevelSelectContainer extends PIXI.Container {
    constructor(screen) {
        super();
        this.currentTier = 0;
        this.gameScreen = screen;

        this.navButtons = [];

        this.levelBackShape = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, config.width, config.height * 0.8);
        this.addChild(this.levelBackShape)
        this.levelBackShape.alpha = 0

        this.sections = window.levelSections.sections
        console.log(this.sections)

        this.unscaledCardSize = { width: window.innerWidth / 5, height: window.innerWidth / 5 }

        this.mainCanvas = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, config.width, config.height);
        this.addChild(this.mainCanvas)
        this.mainCanvas.alpha = 0

        this.newContainer = new PIXI.Container();
        this.sectionsContainer = new PIXI.Container();
        this.sectionsView = new PIXI.Container();

        this.levelsContainer = new PIXI.Container();
        this.levelsView = new PIXI.Container();

        this.tiersContainer = new PIXI.Container();
        this.tiersView = new PIXI.Container();

        //this.unscaledButtonSize = { width: 200, height: 200 }

        // this.backButton = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, this.unscaledButtonSize.width, this.unscaledButtonSize.height);
        // //this.addChild(this.backButton);

        // this.backButton.x = config.width + this.backButton.width;

        // this.backButton.buttonMode = true;
        // this.backButton.interactive = true;

        // this.backButton.on('mousedown', this.onBack.bind(this)).on('touchstart', this.onBack.bind(this));

        this.currentSection = "";
        this.currentTier = "";
        this.sectionButtons = [];
        this.levelCards = [];
        setTimeout(() => {
            this.addChild(this.newContainer)

            this.unscaledCardSize = { width: window.innerWidth / 5, height: window.innerWidth / 5 }

            if(this.unscaledCardSize.width > 120){
                this.unscaledCardSize = { width: 120, height: 120 }
            }

            this.sectionsContainer.addChild(this.sectionsView)
            this.newContainer.addChild(this.sectionsContainer)

            this.tiersContainer.addChild(this.tiersView)
            this.newContainer.addChild(this.tiersContainer)

            this.levelsContainer.addChild(this.levelsView)
            this.newContainer.addChild(this.levelsContainer)

            this.buildSections();


            this.resize({ width: window.innerWidth, height: window.innerHeight }, true)

        }, 100);

        this.sectionsContainer.x = 0;
        this.tiersContainer.x = config.width;
        this.levelsContainer.x = config.width * 2;
        //this.updateTier(0);
        this.currentUISection = 0;

        this.panelOrder = [this.sectionsContainer, this.tiersContainer, this.levelsContainer];

        this.currentResolution = { width: config.width, height: config.height };

        // let center = new PIXI.Graphics().beginFill(0xFF00FF).drawCircle(0, 0, 20)
        // this.sectionsView.addChild(center)

    }


    onBack() {
        if (this.currentUISection > 0) {
            this.currentUISection--
        }
    }
    buildSections() {
        for (let index = 0; index < this.sections.length; index++) {
            let section = this.sections[index];

            let navButton = this.buildSectionButton(section);
            this.sectionsView.addChild(navButton)

            navButton.y = index * navButton.height

            navButton.interactive = true;
            navButton.buttonMode = true;
            //navButton.on('mousedown', this.updateTier.bind(this, index)).on('touchstart', this.updateTier.bind(this, index));

            this.navButtons.push(navButton);
            navButton.on('mousedown', this.openSection.bind(this, section)).on('touchstart', this.openSection.bind(this, section));
            //this.sectionButtons.push(navButton);
        }
    }

    buildBackButton(text) {
        //let secButton = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, this.unscaledCardSize.width, this.unscaledCardSize.height);

        let secButton = PIXI.Sprite.fromImage('./assets/images/largeCard.png');//new PIXI.Graphics().beginFill(section.color).drawRect(0, 0, this.unscaledCardSize.width, this.unscaledCardSize.height);
        secButton.scale.set(this.unscaledCardSize.width / secButton.width)

        let label = new PIXI.Text(text, { font: '24px', fill: 0xFFFFFF, align: 'center', fontWeight: '200', fontFamily: 'round_popregular' });
        label.pivot.x = label.width / 2
        label.pivot.y = label.height / 2
        label.x = secButton.width / 2 / secButton.scale.x
        label.y = secButton.height / 2 / secButton.scale.y
        secButton.label = label;
        secButton.addChild(label)
        return secButton
    }

    buildSectionButton(section) {
        let secButton = PIXI.Sprite.fromImage('./assets/images/largeCard.png');//new PIXI.Graphics().beginFill(section.color).drawRect(0, 0, this.unscaledCardSize.width, this.unscaledCardSize.height);
        secButton.scale.set(this.unscaledCardSize.width / secButton.width)
        secButton.tint = section.color
        let label = new PIXI.Text(section.name, { font: '24px', fill: 0xFFFFFF, align: 'center', fontWeight: '200', fontFamily: 'round_popregular' });
        label.pivot.x = label.width / 2
        label.pivot.y = label.height / 2
        label.x = secButton.width / 2 / secButton.scale.x
        label.y = secButton.height / 2 / secButton.scale.y
        secButton.label = label;
        secButton.addChild(label)
        return secButton
    }
    buildLevelTierButton(level, index) {
        //let levelTierButton = new PIXI.Graphics().beginFill(window.colorsOrder[index]).drawRect(0, 0, this.unscaledCardSize.width, this.unscaledCardSize.height);

        let levelTierButton = PIXI.Sprite.fromImage('./assets/images/largeCard.png');//new PIXI.Graphics().beginFill(section.color).drawRect(0, 0, this.unscaledCardSize.width, this.unscaledCardSize.height);
        levelTierButton.scale.set(this.unscaledCardSize.width / levelTierButton.width)
        levelTierButton.tint = window.colorsOrder[index]

        let label = new PIXI.Text(level.name, { font: '24px', fill: 0xFFFFFF, align: 'center', fontWeight: '200', fontFamily: 'round_popregular' });
        label.pivot.x = label.width / 2
        label.pivot.y = label.height / 2
        label.x = levelTierButton.width / 2 / levelTierButton.scale.x
        label.y = levelTierButton.height / 2 / levelTierButton.scale.y
        levelTierButton.label = label;
        levelTierButton.addChild(label)
        return levelTierButton
    }
    openSection(section) {
        this.currentUISection = 1
        if (this.currentSection == section) {
            return;
        }

        console.log("section", section)
        this.currentSection = section;
        this.sectionButtons.forEach(element => {
            if (element.parent) {
                element.parent.removeChild(element);
            }
        });

        this.sectionButtons = [];



        let backButton = this.buildBackButton("Back");
        this.tiersView.addChild(backButton);
        this.sectionButtons.push(backButton);

        backButton.buttonMode = true;
        backButton.interactive = true;

        backButton.on('mousedown', this.onBack.bind(this)).on('touchstart', this.onBack.bind(this));


        for (let index = 0; index < section.levels.length; index++) {
            const level = section.levels[index];

            let levelTierButton = this.buildLevelTierButton(level, index);
            this.tiersView.addChild(levelTierButton);
            levelTierButton.y = index * levelTierButton.height// + titleSection.height;

            levelTierButton.interactive = true;
            levelTierButton.buttonMode = true;
            levelTierButton.on('mousedown', this.openLevelTier.bind(this, level.data)).on('touchstart', this.openLevelTier.bind(this, level.data));
            this.sectionButtons.push(levelTierButton);
        }
        this.resize(null, true);
        console.log(section)
    }

    openLevelTier(tier) {
        this.currentUISection = 2
        if (this.currentTier == tier) {
            return;
        }
        this.currentTier = tier;



        this.levelCards.forEach(element => {
            if (element.parent) {
                if (element.parent) {
                    element.parent.removeChild(element);
                }
            }
        });

        console.log("tier", tier)
        this.levelCards = [];


        let backButton = this.buildBackButton("Back");
        this.levelsView.addChild(backButton);
        this.levelCards.push(backButton);

        backButton.buttonMode = true;
        backButton.interactive = true;

        backButton.on('mousedown', this.onBack.bind(this)).on('touchstart', this.onBack.bind(this));


        tier.forEach(element => {
            this.addCard(element);
        });


    }

    update(delta) {

        for (let index = 0; index < this.panelOrder.length; index++) {
            const element = this.panelOrder[index];
            //element.x = index * config.width - this.currentUISection* config.width;
            element.x = utils.lerp(element.x, index * this.mainCanvas.width - this.currentUISection * this.mainCanvas.width, 0.1)
        }
        this.centerLevels();
    }

    addCard(data) {

        let pieceSize = 16;
        if (data.pieces[0].length >= data.pieces.length) {
            pieceSize = this.unscaledCardSize.width / data.pieces[0].length + 2;
        } else {
            pieceSize = this.unscaledCardSize.height / data.pieces.length + 2;
        }

        let levelCard = PIXI.Sprite.fromImage('./assets/images/largeCard.png');//new PIXI.Graphics().beginFill(section.color).drawRect(0, 0, this.unscaledCardSize.width, this.unscaledCardSize.height);
        levelCard.tint = config.colors.dark

        let card = this.gameScreen.generateImage(data.pieces, pieceSize, 32)
        card.y = 0
        card.removeChild(card.background)
        //card.pivot.x = 0//card.width / 2
        //card.pivot.y = 0

        let label = new PIXI.Text(data.levelName, { font: '30px', fill: 0xFFFFFF, align: 'center', fontWeight: '200', fontFamily: 'round_popregular' });
        label.x = levelCard.width / 2 - label.width / 2
        label.y = levelCard.height - label.height * 1.5

        this.gameScreen.resizeToFitAR(this.unscaledCardSize, card)
        utils.centerObject(card, levelCard)
        card.y -= label.height * 0.5
        
        levelCard.addChild(card)
        levelCard.addChild(label)

        levelCard.on('mousedown', this.selectLevel.bind(this, data)).on('touchstart', this.selectLevel.bind(this, data));
        levelCard.interactive = true;
        levelCard.buttonMode = true;

        levelCard.data = data;

        levelCard.scale.set(this.unscaledCardSize.width / levelCard.width)

        
        if (!this.levelsView.children.includes(levelCard)) {
            this.levelsView.addChild(levelCard)
        }

        this.levelCards.push(levelCard)
    }
    getGridGraphic() {
        return new PIXI.Graphics().beginFill(section.color).drawRect(0, 0, 100, 130);
    }
    selectLevel(data) {
        console.log(data)
        this.gameScreen.startNewLevel(data, false);
        this.currentUISection = 0;
        this.resize(null, true)
    }
    drawGrid(elements, margin = 10) {
        let maxPerLine = Math.floor(this.mainCanvas.width / (this.unscaledCardSize.width + margin * 2)) + 1
        let fullWidth = this.mainCanvas.width - margin * 2
        let distance = fullWidth / maxPerLine
        let line = -1
        let col = 0

        let lines = []

        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];

            if (index % maxPerLine == 0) {
                line++
            }
            let chunck = distance
            let adj = -(chunck * maxPerLine) / 2//0//(margin - fullWidth) * 0.5
            element.x = (index % maxPerLine) * chunck + adj + chunck / 2 - element.width / 2//+ distance * 0.5 - fullWidth * 0.5///+ element.width / 2 + margin * 0.5
           
            // // if(!element.debug){
            // //     element.debug = new PIXI.Graphics().beginFill(0xff0066).drawRect(0,0,chunck,element.height);
            // //     element.parent.addChild(element.debug)
            // //     element.debug.position = element.position
            // // }

            //element.scale.set(0.8)
            if (index >= maxPerLine) {
                element.y = 30 + lines[index - maxPerLine]
            } else {

                element.y = 50
            }

            // if(!element.debug){
            //     element.debug = new PIXI.Graphics().beginFill(0xff0066 * Math.random()).drawRect(0,0,chunck,element.height);
            //     element.parent.addChild(element.debug)
            //     element.debug.position = element.position
            //     element.debug.alpha = 0.5
            // }else{
            //     element.debug.position = element.position

            // }

            lines.push(element.y + element.height)

        }

    }
    resize(innerResolution, force) {
        if (!force && (this.currentResolution.width == innerResolution.width && this.currentResolution.height == innerResolution.height)) {
            //return;
        }
        if (innerResolution) {
            this.currentResolution = innerResolution
        }

        let globalPos = this.toLocal({ x: 0, y: this.y })
        this.mainCanvas.position = globalPos
        this.mainCanvas.width = this.currentResolution.width
        this.mainCanvas.height = this.currentResolution.height - this.y

        this.centerLevels();

        this.newContainer.y = this.mainCanvas.y;
    }
    centerLevels() {
        this.drawGrid(this.sectionButtons, 20);
        this.drawGrid(this.navButtons, 20);
        this.drawGrid(this.levelCards, 20);
        this.levelsView.pivot.x = this.mainCanvas.width / 2
        this.levelsView.x = this.mainCanvas.x + this.mainCanvas.width

        this.sectionsView.pivot.x = this.mainCanvas.width / 2
        this.sectionsView.x = this.mainCanvas.x + this.mainCanvas.width// - this.unscaledButtonSize.width / 2

        this.tiersView.pivot.x = this.mainCanvas.width / 2
        this.tiersView.x = this.mainCanvas.x + this.mainCanvas.width//- this.unscaledButtonSize.width / 2
        //this.tiersView.y = this.mainCanvas.y //- this.mainCanvas.height * 0.5;

    }
}
