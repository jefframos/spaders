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

		this.onDestroyAllStartedCards = new signals();
	}
	start() {
	}
	update(delta) {
		this.grids.forEach(element => {
			element.sin += delta * element.speed;
			element.alpha = element.startAlpha * Math.sin(element.sin);

			element.alpha = Math.max(0, element.alpha);

		});
	}
	createGrid() {
		this.cardsStartedOnGrid = 0;
		for (let index = this.children.length - 1; index >= 0; index--) {
			this.removeChildAt(index);
		}
		let gridContainer = new PIXI.Container();
		// let gridBackground = new PIXI.Graphics().beginFill(0).drawRect(0,0,GRID.width, GRID.height);
		// gridContainer.addChild(gridBackground)
		this.gridsSquares = [];
		this.grids = [];

		for (var i = GRID.i - 1; i >= 0; i--) {
			let gridLine = [];
			for (var j = GRID.j - 1; j >= 0; j--) {
				let gridSquare = PIXI.Sprite.fromImage('./assets/images/gridSquare.png')
				gridSquare.scale.set(CARD.width / gridSquare.width);
				gridSquare.x = i * CARD.width;
				gridSquare.y = j * CARD.height;

				gridSquare.alpha = Math.random() * 0.15 + 0.075
				gridSquare.speed = 0.35;
				gridSquare.startAlpha = gridSquare.alpha;
				gridSquare.sin = Math.random() * Math.PI * 2;

				gridContainer.addChild(gridSquare)

				this.grids.push(gridSquare);

				let gridEffectSquare = PIXI.Sprite.fromImage('./assets/images/gridSquare.png')
				gridEffectSquare.scale.set(CARD.width / gridEffectSquare.width);
				gridEffectSquare.x = i * CARD.width;
				gridEffectSquare.y = j * CARD.height;
				gridEffectSquare.alpha = 0;
				gridContainer.addChild(gridEffectSquare)
				gridLine.unshift({shape:gridEffectSquare, card:null});
			}
			this.gridsSquares.unshift(gridLine);
		}




		// for (var i = GRID.j-1; i >= 0; i--) {
		// 	let line = new PIXI.Sprite.fromImage('./assets/images/lineBorder.png')
		// 	line.y = i * CARD.width;
		// 	line.x = - line.width
		// 	line.height = CARD.height;
		// 	gridContainer.addChild(line)
		// }

		// for (var i = GRID.j-1; i >= 0; i--) {
		// 	let line = new PIXI.Sprite.fromImage('./assets/images/lineBorder.png')
		// 	line.y = i * CARD.width + CARD.height;
		// 	line.rotation = Math.PI;
		// 	line.x = GRID.i * CARD.width + line.width
		// 	line.height = CARD.height;
		// 	gridContainer.addChild(line)
		// }

		// for (var i = GRID.i; i > 0; i--) {
		// 	let line = new PIXI.Sprite.fromImage('./assets/images/lineBorder.png')
		// 	line.y = - line.width;
		// 	line.rotation = Math.PI * 0.5;
		// 	line.x = i * CARD.width
		// 	line.height = CARD.height;
		// 	gridContainer.addChild(line)
		// }

		
		gridContainer.alpha = 1

		this.addChild(gridContainer);
	}
	destroyCard(card){
		if(this.gridsSquares[card.pos.i][card.pos.j].card){
			this.gridsSquares[card.pos.i][card.pos.j].shape.alpha = 0;
			this.cardsStartedOnGrid --;
	
			if(this.cardsStartedOnGrid <= 0){
				console.log("All cards", this.cardsStartedOnGrid)

				this.onDestroyAllStartedCards.dispatch();
			}
		}
	}
	paintTile(card){
		this.gridsSquares[card.pos.i][card.pos.j].card = card;
		this.gridsSquares[card.pos.i][card.pos.j].shape.tint = card.currentColor;
		TweenMax.to(this.gridsSquares[card.pos.i][card.pos.j].shape, 0.5, {delay:0.5, alpha:0.25})
		this.cardsStartedOnGrid ++;
	}
}