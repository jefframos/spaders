import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import TweenMax from 'gsap';
import TutorialPopLabel from './TutorialPopLabel';
import Grid from '../elements/Grid';
import Board from '../core/Board';
import Card from '../elements/Card';
import FXContainer from '../effects/FXContainer';
import colorSchemes from '../../colorSchemes';
import UIButton1 from './UIButton1';


export default class TutorialOverlay extends PIXI.Container {
    constructor() {
        super();

        this.tutorialPopLabel = new TutorialPopLabel()
        this.background = new PIXI.Graphics().beginFill(config.colors.background).drawRect(-5000, -5000, 10000, 10000);
        this.addChild(this.background);
        this.background.alpha = 1;

        this.backgroundInteractable = new PIXI.Graphics().beginFill(0x332266).drawRect(0, 0, 10000, 10000);
        this.addChild(this.backgroundInteractable);
        this.backgroundInteractable.alpha = 0;

        this.interactive = true;
        this.backGridContainer = new PIXI.Container();
        this.gridContainer = new PIXI.Container();
        this.frontGridContainer = new PIXI.Container();
        this.cardsContainer = new PIXI.Container();
        this.grid = new Grid(this);
        this.grid.onDestroyAllStartedCards.add(() => this.onDestroyAllStartedCards());

        this.addChild(this.backGridContainer);
        this.addChild(this.gridContainer);
        this.gridContainer.addChild(this.grid);
        this.addChild(this.cardsContainer);
        this.addChild(this.frontGridContainer);



        this.board = new Board(this);
        this.board.onDestroyCard.add((card) => this.onDestroyCard(card));

        this.fxContainer = new FXContainer(this.frontGridContainer)
        this.addChild(this.fxContainer);
        this.addChild(this.tutorialPopLabel);

        this.first = true;

        this.requireSpecificAction = false;


        this.customPieces = [
            {
                boardPieces: 0,
                currentStep: 0,
                currentShoot: 0,
                board: [
                    [0, 5],
                    [0, 2],
                ],
                mine: [
                    [0, 1, 5],
                    [1],
                    [1],
                ],
                shootCol: [1, 2, 1],
                cardLife: [0, 0, 0]
            },
            {
                boardPieces: 0,
                currentStep: 0,
                currentShoot: 0,
                board: [
                    [4],
                    [5],
                    [6],
                    [3],
                    [7],
                    [5],
                    [6],
                ],
                mine: [
                    [0, 1, 2, 3, 7],
                    [1],
                    [1],
                    [1],
                    [1],
                    [1],
                ],
                shootCol: [2, 2, 1, 1, 1],
                cardLife: [0, 0, 0, 0, 0],
            },
            {
                boardPieces: 0,
                currentStep: 0,
                currentShoot: 0,
                board: [
                    [3, 5, 7],
                    [5],
                    [6],
                    [3],
                    [7],
                    [5],
                    [6],
                ],
                mine: [
                    [7],
                    [1],
                    [3],
                    [1],
                    [1],
                    [1],
                ],
                shootCol: [2, 1, 0, 1, 1],
                cardLife: [0, 0, 1, 0, 0],
            }
        ]


        this.currentTutorial = 0;
        this.tutorial = [
            {
                textBoxOffset: { x: 0, y: 0 },
                text: 'Hi, welcome to Spaders!',
                callback: this.showFirstCard.bind(this, 0),
                requireSpecificAction: false,
                target: "backgroundInteractable",
                centerBox: { x: 0.5, y: 0.3 }
            },
            {
                textBoxOffset: { x: 0, y: 0 },
                text: 'This are the Spaders',
                callback: null,
                requireSpecificAction: false,
                useGlobalScale: false,
                target: "backgroundInteractable",
                centerBox: { x: 0.5, y: 0.6 }
            },
            {
                textBoxOffset: { x: 0, y: 0 },
                text: 'Every spader have\nfew attack arrows',
                callback: null,
                requireSpecificAction: false,
                useGlobalScale: false,
                target: "backgroundInteractable",
                centerBox: { x: 0.5, y: 0.65 }
            },
            {
                textBoxOffset: { x: 0, y: 0 },
                text: 'And life',
                callback: null,
                requireSpecificAction: false,
                useGlobalScale: false,
                target: "backgroundInteractable",
                centerBox: { x: 0.77, y: 0.52 }
            },
            {
                textBoxOffset: { x: 0, y: 0 },
                text: 'Life is also their attack power',
                callback: null,
                requireSpecificAction: false,
                useGlobalScale: false,
                target: "backgroundInteractable",
                centerBox: { x: 0.5, y: 0.52 }
            },
            {
                textBoxOffset: { x: 0, y: 0 },
                text: "Let's see how it works",
                callback: this.startNewTutorial.bind(this, 0),
                requireSpecificAction: false,
                target: "backgroundInteractable",
                centerBox: { x: 0.5, y: 0.6 }
            },
            {
                textBoxOffset: { x: 0, y: -1.25 },
                text: 'Every level has a board\nwith other Spaders',
                callback: null,
                requireSpecificAction: false,
                target: "gridContainer",
                centerBox: { x: 0.5, y: 0 },
                delay: 1.4
            },
            {
                textBoxOffset: { x: 0, y: -1.25 },
                text: 'Every starter spader have a TILE behind',
                callback: null,
                requireSpecificAction: false,
                target: "gridContainer",
                centerBox: { x: 0.5, y: 0 },
                delay: 0
            },
            {
                textBoxOffset: { x: 0, y: -1.25 },
                text: 'When you kill then, their TILE is removed',
                callback: this.shoot.bind(this),
                requireSpecificAction: false,
                target: "gridContainer",
                centerBox: { x: 0.5, y: 0 },
                delay: 0
            },
            {
                textBoxOffset: { x: 0, y: -1.25 },
                text: 'If you attack and the other spader have an\nopposite arrow, it will attack you back',
                callback: this.shoot.bind(this, true),
                requireSpecificAction: false,
                target: "gridContainer",
                centerBox: { x: 0.5, y: 0 },
                delay: 1.5
            }, {
                textBoxOffset: { x: 0, y: -1.1 },
                text: 'By using the counter attack, you wipe two\n at the same time',
                callback: null,
                requireSpecificAction: false,
                target: "gridContainer",
                centerBox: { x: 0.5, y: 0 },
                delay: 1
            },
            {
                textBoxOffset: { x: 0, y: -1.1 },
                text: 'First, you should wipe all starters',
                callback: this.getNewPiece.bind(this),
                requireSpecificAction: false,
                target: "gridContainer",
                centerBox: { x: 0.5, y: 0 },
                delay: 0
            },
            {
                textBoxOffset: { x: 0, y: -1.1 },
                text: 'And then kill the leftovers',
                callback: this.shoot.bind(this, true),
                requireSpecificAction: false,
                target: "gridContainer",
                centerBox: { x: 0.5, y: 0 },
                delay: 0
            },
            {
                textBoxOffset: { x: 0, y: -2 },
                text: 'Thats how you win',
                callback: this.startNewTutorial.bind(this, 1),
                requireSpecificAction: false,
                target: "gridContainer",
                delay: 1,
                centerBox: { x: 0.5, y: 0.5 }
            },
            {
                textBoxOffset: { x: 0, y: -1.1 },
                text: 'Some spaders needs more than one attack',
                callback: null,
                requireSpecificAction: false,
                target: "gridContainer",
                useGlobalScale: false,
                centerBox: { x: 0.5, y: 0 },
                delay: 1
            },
            {
                textBoxOffset: { x: 0, y:-1.1},
                text: 'Try to attack as much as you can in one move',
                callback: this.shoot.bind(this),
                requireSpecificAction: false,
                target: "gridContainer",
                useGlobalScale: false,
                centerBox: { x: 0.5, y: 0 },
                delay: 0
            },
            {
                textBoxOffset: { x: 0, y:-1.1},
                text: 'High combos transform random spaders in bombs',
                callback: this.allCrazy.bind(this),
                requireSpecificAction: false,
                target: "gridContainer",
                centerBox: { x: 0.5, y: 0 },
                delay: 2
            },
            {
                textBoxOffset: { x: 0, y:-1.1},
                text: 'If you kill them, they will explode',
                callback: this.shoot.bind(this, true),
                requireSpecificAction: false,
                target: "gridContainer",
                centerBox: { x: 0.5, y: 0 },
                delay: 0
            },
            {
                textBoxOffset: { x: 0, y: 0 },
                text: 'For stronger Spaders...',
                callback: this.startNewTutorial.bind(this, 2),
                requireSpecificAction: false,
                target: "backgroundInteractable",
                centerBox: { x: 0.5, y: 0.5 },
                delay: 1
            },
            {
                textBoxOffset: { x: 0, y: -1.1 },
                text: 'Try to use their arrows to counter\nattack you',
                callback: this.shoot.bind(this, false),
                requireSpecificAction: false,
                target: "gridContainer",
                centerBox: { x: 0.5, y: 0 },
                delay: 2
            },
            {
                textBoxOffset: { x: 0, y: -1.1 },
                text: 'This is the best way to\nkeep the board cleaner',
                callback: this.shoot.bind(this, false),
                requireSpecificAction: false,
                target: "gridContainer",
                centerBox: { x: 0.5, y: 0 },
                delay: 2
            },
            {
                textBoxOffset: { x: 0, y: -1.1 },
                text: 'And make easier to complete\nthe levels',
                callback: this.shoot.bind(this, true),
                requireSpecificAction: false,
                target: "gridContainer",
                centerBox: { x: 0.5, y: 0 },
                delay: 2
            },
            {
                textBoxOffset: { x: 0, y: 0},
                text: 'Have fun!',
                callback: null,
                requireSpecificAction: false,
                target: "gridContainer",
                centerBox: { x: 0.5, y: 0.5 },
                delay: 2
            }]
            
            this.killTutorialButton = new UIButton1(config.colors.dark, window.iconsData.cancel, config.colors.white);
            this.addChild(this.killTutorialButton)
            this.killTutorialButton.onClick.add(()=>{this.killTutorial()});
            this.killTutorialButton.scale.set(0.5)
    }
    nextTutorial() {

        if (this.currentTutorial >= this.tutorial.length) {
            this.hide();
            return;
        }

        let action = this.tutorial[this.currentTutorial]
        if (typeof action.target === 'string') {
            action.target = this[action.target]
        }
        if (action.targetSpeech && typeof action.targetSpeech === 'string') {
            action.targetSpeech = this[action.targetSpeech]
        }
        this.tutorialPopLabel.popLabel(action, this.nextTutorial.bind(this));
        this.currentTutorial++;
    }

    killTutorial(){
        this.cleanLevel();
        this.hide();
    }
    hide() {
        TweenMax.to(this, 0.5, {
            alpha: 0, onComplete: () => {
                this.visible = false;
            }
        })
    }
    show() {
        this.visible = true;

        this.currentTutorial = 0;

        TweenMax.to(this, 0.5, { alpha: 1 })
        this.nextTutorial();

        this.customPieces.forEach(element => {
            element.currentStep = 0;
            element.boardPieces = 0;
            element.currentShoot = 0;
        });
    }

    allCrazy() {
        this.board.addCrazyCards2(5);
    }
    showFirstCard() {
        CARD.width = 72
        CARD.height = 72
        this.firstCard = new PIXI.Container();

        for (let index = 0; index < 3; index++) {
            let card1 = new Card()
            card1.life = index;
            card1.createCard(3);
            card1.addExtraZone([0, 3])
            card1.updateSprite(card1.life);
            card1.updateCard(true);
            this.firstCard.addChild(card1)
            card1.x = CARD.width * index;
            if (index % 2 != 0) {
                card1.y = -CARD.width;
            }
            TweenMax.from(card1, 0.5, { delay: index * 0.2 + 0.3, alpha: 0, y: card1.y + CARD.width, ease: Back.easeOut })
            //TweenMax.from(card1.scale, 0.8, {delay:index * 0.2 + 0.3, x:0.5, y:1.5, ease:Elastic.easeOut})
        }
        this.cardsContainer.addChild(this.firstCard);
        utils.resizeToFitAR({ width: this.gameCanvas.width * 0.7, height: this.gameCanvas.height * 0.3 }, this.firstCard)
        this.firstCard.x = -this.firstCard.width / 2
        this.firstCard.y = -this.firstCard.height / 2

    }

    update(delta) {
        this.tutorialPopLabel.update(delta, this.gridContainer.scale);
        this.grid.update(delta);
        this.board.update(delta);
        this.fxContainer.update(delta);

        if (this.firstCard && this.firstCard.children.length) {
            this.firstCard.children.forEach(element => {
                if (element.update) {
                    element.update(delta)
                }
            });
        }
        if (this.currentCard) {
            this.currentCard.update(delta);
            this.currentCard.y = ((this.gridContainer.height) / this.gridContainer.scale.y) + this.offsetCard.y - CARD.height - 10;
            this.trailHorizontal.y = this.currentCard.y - this.offsetCard.y;
            this.trailHorizontal.tint = this.currentCard.currentColor;
            this.trailHorizontal.alpha = 0.35;
            this.trailVertical.tint = this.currentCard.currentColor;
            this.trailVertical.alpha = 0.35;
            this.trailVertical.x = utils.lerp(this.trailVertical.x, this.currentCard.x, 0.3);
        } else {
            if (this.trailVertical) {
                this.trailVertical.alpha = utils.lerp(this.trailVertical.alpha, 0, 0.3);
            }
        }
    }
    resize(gameCanvas, innerResolution) {
        this.gameCanvas = gameCanvas;
        if (this.gridContainer.width > 0) {
            utils.resizeToFitAR({ width: this.gameCanvas.width * 0.5, height: this.gameCanvas.height * 0.6 }, this.gridContainer)
        }
        this.fxContainer.resize(innerResolution);
        this.gridContainer.x = this.gameCanvas.x + this.gameCanvas.width / 2 - this.gridContainer.width / 2 + this.grid.backgroundOffset.x / 2//+  (this.gridContainer.width) / 2 + this.grid.backgroundOffset.x / 4
        this.gridContainer.y = this.gameCanvas.y + this.gameCanvas.height / 2 - this.gridContainer.height / 2;

        this.backgroundInteractable.x = this.gameCanvas.x
        this.backgroundInteractable.y = this.gameCanvas.y
        this.backgroundInteractable.width = this.gameCanvas.width
        this.backgroundInteractable.height = this.gameCanvas.height

        this.backGridContainer.position = this.gridContainer.position
        this.frontGridContainer.position = this.gridContainer.position
        this.cardsContainer.position = this.gridContainer.position

        this.backGridContainer.scale = this.gridContainer.scale
        this.frontGridContainer.scale = this.gridContainer.scale
        this.cardsContainer.scale = this.gridContainer.scale

        //this.tutorialPopLabel.scale = this.gridContainer.scale
        this.tutorialPopLabel.x = this.gameCanvas.x
        this.tutorialPopLabel.y = this.gameCanvas.y

        let toLoc = this.toLocal({ x: 0, y: 0 });
		this.killTutorialButton.x = toLoc.x + innerResolution.width - this.killTutorialButton.width;
		this.killTutorialButton.y = toLoc.y + this.killTutorialButton.width;
    }




    startNewTutorial(id) {
        
        this.cleanLevel();
        this.currentTutorialLevel = id;
        this.showGameOverState = id > 2;
        let level = window.getLevelData("tutorial", 0, id).level;
        window.COOKIE_MANAGER.updateColorPallete(level.colorPalletId)
        this.updateGridDimensions(level)
        //console.log(level)
        this.currentLevelData = level;
        this.offsetCard = { x: 0, y: 0 }

        this.grid.resetGrid(level)
        this.grid.createGrid(level)

        this.addPieces();
        this.addHorizontalTrail();
        setTimeout(() => {
            this.getNewPiece()
        }, 1000);

        this.currentPositionID = 1;
        this.cardsContainer.alpha = 0;
        TweenMax.to(this.cardsContainer, 0.5, { alpha: 1, delay: 1 });
    }

    updateGridDimensions(currentLevel) {
        window.GRID.i = currentLevel.pieces[0].length
        window.GRID.j = currentLevel.pieces.length


        let min = 60;

        if (GRID.height > GRID.width) {
            window.CARD = {
                width: Math.min(GRID.height / GRID.j, min),
                height: Math.min(GRID.height / GRID.j, min)
            }
        } else {

            window.CARD = {
                width: Math.min(GRID.width / GRID.i, min),
                height: Math.min(GRID.width / GRID.i, min)
            }
        }

        window.GRID.width = window.GRID.i * CARD.width;
        window.GRID.height = window.GRID.j * CARD.height;

        window.GRID.widthDraw = CARD.width / currentLevel.levelDataScale;
        window.GRID.heightDraw = CARD.height / currentLevel.levelDataScale;
    }
    shoot(ignoreSpawn = false) {
        let timer = this.board.shootCard(this.currentPositionID, this.currentCard);

        this.cardsContainer.addChild(this.currentCard)
        this.currentCard.move({
            x: this.currentCard.pos.i * CARD.width,
            y: this.currentCard.pos.j * CARD.height
        }, 0.1);
        this.currentCard = null;

        if (!ignoreSpawn) {
            setTimeout(() => {
                this.getNewPiece();
            }, timer);
        }
    }
    onDestroyAllStartedCards() {
        if (!this.showGameOverState) {
            return;
        }
        setTimeout(() => {
            this.board.setFinalState();
            let targetPosition = this.gridContainer.position
            targetPosition.x += this.gridContainer.width / 2
            targetPosition.y += this.gridContainer.height / 2
            this.fxContainer.popSprite('finish-them-all.png', targetPosition, this.gridContainer.width, config.colors.purple)
        }, 500);
        if (this.currentCard) {
            this.currentCard.setZeroLife();
        }
    }
    addPoints() {

    }
    onDestroyCard(card) {
        this.grid.destroyCard(card);
    }
    getNewPiece() {



        this.currentCard = this.getCard();
        this.currentCard.scale.set(1)
        this.currentCard.alpha = 0;

        let tut = this.customPieces[this.currentTutorialLevel];
        this.currentCard.life = tut.cardLife[tut.currentShoot];
        this.currentCard.createCard(3);
        this.currentCard.updateSprite(this.currentCard.life);


        console.log(tut.mine[tut.currentStep])
        this.currentCard.addActionZones(3, tut.mine[tut.currentShoot])
        this.currentPositionID = tut.shootCol[tut.currentShoot]
        tut.currentShoot++;

        this.currentCard.updateCard(true);
        this.currentCard.visible = false;

        TweenMax.killTweensOf(this.currentCard)
        setTimeout(() => {
            this.currentCard.visible = true;

            this.offsetCard.y = CARD.height * 3;
            TweenMax.to(this.offsetCard, 0.3, { y: 0, ease: Back.easeOut })

            TweenMax.to(this.currentCard, 0.3, { delay: 0.1, alpha: 1, y: this.gridContainer.height + 20 })
            this.frontGridContainer.addChild(this.currentCard);

            this.currentCard.x = this.currentPositionID * CARD.width
        }, 100);

    }
    addPieces() {

        for (var i = 0; i < this.currentLevelData.pieces.length; i++) {
            for (var j = 0; j < this.currentLevelData.pieces[i].length; j++) {
                if (this.currentLevelData.pieces[i][j] >= 0) {

                    let customData = null;
                    let card = this.placeCard(j, i, ENEMIES.list[this.currentLevelData.pieces[i][j]], customData, this.currentLevelData.pieces[i][j])

                    this.cardsContainer.addChild(card);
                }
            }
        }
    }

    placeCard(i, j, data, customData = {}, cardID = 0) {
        let card = this.getCard();
        card.life = data.life;

        let tut = this.customPieces[this.currentTutorialLevel];
        let order = tut.board[tut.boardPieces]
        card.createCard(order.length, { order });
        tut.boardPieces++;

        console.log(tut)
        //card.addActionZones(2, tut.board[tut.boardPieces])

        card.updateSprite(data.life, data, cardID);
        card.x = i * CARD.width;
        card.y = j * CARD.height - CARD.height;
        TweenMax.killTweensOf(card);
        card.alpha = 1;
        card.y = j * CARD.height;
        card.pos.i = i;
        card.pos.j = j;
        // card.addExtraZone([4, 5, 6])
        card.updateCard(false, data);
        this.board.addCard(card);
        this.grid.paintTile(card)
        return card;
    }
    getCard() {
        let card;
        if (CARD_POOL.length) {
            card = CARD_POOL[0];
            CARD_POOL.shift();
        } else {
            card = new Card(this);
        }
        return card;
    }
    addHorizontalTrail() {
        let scheme = colorSchemes.getCurrentColorScheme().grid;
        this.trailHorizontal = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame(scheme.spriteTrail), 20, 20, 20, 20)

        this.trailHorizontal.width = GRID.width
        this.trailHorizontal.height = CARD.height


        this.trailVertical = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame(scheme.spriteTrail), 20, 20, 20, 20)
        this.trailVertical.width = CARD.width
        this.trailVertical.height = GRID.height + CARD.width + this.grid.backgroundOffset.y * 0.25

        this.cardsContainer.addChildAt(this.trailHorizontal, 0)
        this.cardsContainer.addChildAt(this.trailVertical, 0)
    }
    cleanLevel() {
        if (this.trailHorizontal && this.trailHorizontal.parent) {
            this.trailHorizontal.parent.removeChild(this.trailHorizontal)
        }
        if (this.trailVertical && this.trailVertical.parent) {
            this.trailVertical.parent.removeChild(this.trailVertical)
        }
        if (this.currentCard && this.currentCard.parent) {
            this.currentCard.parent.removeChild(this.currentCard)
        }
        if (this.firstCard && this.firstCard.parent) {
            this.firstCard.parent.removeChild(this.firstCard)
        }
        for (let index = this.cardsContainer.children.length - 1; index >= 0; index--) {
			this.cardsContainer.removeChildAt(0);
		}

        for (let index = this.grid.children.length - 1; index >= 0; index--) {
			this.grid.removeChildAt(0);
		}
    }
}

