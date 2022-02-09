import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import signals from 'signals';
import config from '../../config';
import utils from '../../utils';
export default class Grid extends PIXI.Container {
	constructor(game) {
		super();
		this.game = game;
		this.grids = [];
		this.dropTiles = [];

		this.onDestroyAllStartedCards = new signals();
	}
	start() {
	}
	update(delta) {

		for (let index = this.dropTiles.length - 1; index >= 0; index--) {
			const element = this.dropTiles[index];

			element.x += element.fallData.velocity.x * delta;
			element.y += element.fallData.velocity.y * delta;

			element.fallData.velocity.y += element.fallData.gravity * delta;

			element.rotation += element.fallData.angularVelocity * delta

			if (element.fallData.timeToDie > 0) {
				element.fallData.timeToDie -= delta;

				if (element.fallData.timeToDie <= 0) {
					if (element.parent) {
						element.parent.removeChild(element);
						this.dropTiles.splice(index, 1);
					}
				}
			}

		}
		this.grids.forEach(element => {
			element.sin += delta * element.speed;
			element.alpha = element.startAlpha * Math.sin(element.sin);

			element.alpha = Math.max(element.alphaMin, element.alpha);

		});
	}
	resetGrid() {
		this.cardsStartedOnGrid = 0;
		for (let index = this.children.length - 1; index >= 0; index--) {
			this.removeChildAt(index);
		}
		for (let index = this.game.backGridContainer.length - 1; index >= 0; index--) {
			this.removeChildAt(index);
		}

		for (let index = this.dropTiles.length - 1; index >= 0; index--) {
			const element = this.dropTiles[index];
			if (element.parent) {
				element.parent.removeChild(element);
				this.dropTiles.splice(index, 1);
			}
		}

		this.gridsSquares = [];
		this.grids = [];
		this.dropTiles = [];

	}
	createGrid() {
		console.log("CREATING GRID")
		
		this.resetGrid();
		let gridContainer = new PIXI.Container();

		for (var i = GRID.i - 1; i >= 0; i--) {
			let gridLine = [];
			for (var j = GRID.j - 1; j >= 0; j--) {
				//let gridSquare = PIXI.Sprite.fromFrame('gridSquare.png')
				let gridSquare = PIXI.Sprite.fromFrame('largeCard.png')
				gridSquare.scale.set(CARD.width / gridSquare.width);
				gridSquare.x = i * CARD.width;
				gridSquare.y = j * CARD.height;

				gridSquare.alphaMin = Math.random() * 0.025 + 0.025;
				gridSquare.alpha = Math.random() * 0.05 + 0.05
				gridSquare.speed = 0.35;
				gridSquare.startAlpha = gridSquare.alpha;
				gridSquare.sin = Math.random() * Math.PI * 2;

				gridContainer.addChild(gridSquare)

				this.grids.push(gridSquare);

				//let gridEffectSquare = PIXI.Sprite.fromFrame('gridSquare.png')
				let gridEffectSquare = PIXI.Sprite.fromFrame('largeCard.png')
				gridEffectSquare.scale.set(CARD.width / gridEffectSquare.width);
				gridEffectSquare.x = i * CARD.width;
				gridEffectSquare.y = j * CARD.height;
				gridEffectSquare.alpha = 0;
				gridContainer.addChild(gridEffectSquare)
				gridLine.unshift({ shape: gridEffectSquare, card: null });
			}
			this.gridsSquares.unshift(gridLine);
		}

		gridContainer.alpha = 1

		this.addChild(gridContainer);
	}
	destroyCard(card) {
		if (this.gridsSquares[card.pos.i][card.pos.j].card) {
			//this.gridsSquares[card.pos.i][card.pos.j].shape.alpha = 1;
			this.cardsStartedOnGrid--;

			let shape = this.gridsSquares[card.pos.i][card.pos.j].shape;
			let fallData = {
				gravity: 500,
				timeToDie: 5,
				velocity: { x: Math.random() * CARD.width, y: 0 },
				angularVelocity: (Math.random() - 0.5) * Math.PI * 2
			}
			shape.fallData = fallData;
			shape.anchor.set(0.5);
			shape.x += shape.width / 2
			shape.y += shape.height / 2

			this.game.backGridContainer.addChild(shape);
			this.dropTiles.push(shape);
			this.gridsSquares[card.pos.i][card.pos.j].card = null;
			window.SOUND_MANAGER.play('dropTile', {volume:0.5, speed:Math.random() * 0.2 + 0.8})
			if (this.cardsStartedOnGrid <= 0) {
				console.log("All cards", this.cardsStartedOnGrid)
				this.onDestroyAllStartedCards.dispatch();
			}
		}
	}
	paintTile(card) {
		this.gridsSquares[card.pos.i][card.pos.j].card = card;
		let color = card.currentColor;
		let alpha = 0.45;
		if (color == config.colors.dark) {
			color = 0x000000;
			alpha = 0.65
		}
		this.gridsSquares[card.pos.i][card.pos.j].shape.tint = color;
		TweenMax.to(this.gridsSquares[card.pos.i][card.pos.j].shape, 0.5, { delay: 0.5, alpha: alpha })
		this.cardsStartedOnGrid++;
	}
}