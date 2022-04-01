import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import signals from 'signals';
import colorSchemes from '../../colorSchemes';
import config from '../../config';
import utils from '../../utils';
import TileDesigner from '../effects/TileDesigner';
export default class Grid extends PIXI.Container {
	constructor(game) {
		super();
		this.game = game;
		this.grids = [];
		this.dropTiles = [];

		this.onDestroyAllStartedCards = new signals();

		this.topGridContainer = new PIXI.Container();

		this.backgroundOffset = { x: 12, y: 16 }

		this.tileDesigner = new TileDesigner();
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
	}
	resetGrid() {
		this.cardsStartedOnGrid = 0;
		for (let index = this.children.length - 1; index >= 0; index--) {
			this.removeChildAt(index);
		}
		for (let index = this.game.backGridContainer.children.length - 1; index >= 0; index--) {
			this.game.backGridContainer.removeChildAt(index);
		}
		for (let index = this.topGridContainer.children.length - 1; index >= 0; index--) {
			this.topGridContainer.removeChildAt(index);
		}
		if (this.game && !this.topGridContainer.parent && this.game.frontGridContainer) {
			this.game.frontGridContainer.addChild(this.topGridContainer)
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
	getGridPreviewImage(levelData) {


		if (window.imageThumbs['toDraw' + levelData.idSaveData]) {
			return window.imageThumbs['toDraw' + levelData.idSaveData]
		}
		let scheme = colorSchemes.getCurrentColorScheme();
		let colorScheme = colorSchemes.getCurrentColorScheme().grid;
		let colorSchemeList = colorSchemes.getCurrentColorScheme().list;


		let gridDrawContainer = new PIXI.Container();

		let toDraw = levelData.piecesToDraw;
		let piecesToTraw = []
		for (let i = 0; i < toDraw.length; i++) {
			let temp = []
			for (let j = 0; j < toDraw[i].length; j++) {
				temp.push(toDraw[i][j]);

			}
			piecesToTraw.push(temp);
		}

		let targetSprite = colorScheme.sprite;
		let paddingSprite = 20;

		for (var i = piecesToTraw.length - 1; i >= 0; i--) {
			for (var j = 0; j < piecesToTraw[i].length; j++) {
				if (piecesToTraw[i][j] >= 0 && piecesToTraw[i][j] < scheme.block.id) {

					let gridSquare = new PIXI.mesh.NineSlicePlane(
						PIXI.Texture.fromFrame(targetSprite), paddingSprite, paddingSprite, paddingSprite, paddingSprite);

					gridSquare.width = GRID.widthDraw * levelData.levelDataScale
					gridSquare.height = GRID.heightDraw * levelData.levelDataScale
					gridSquare.scale.set(1 / levelData.levelDataScale)
					gridSquare.x = j * GRID.widthDraw;
					gridSquare.y = i * GRID.heightDraw;

					gridSquare.tint = colorSchemeList[piecesToTraw[i][j]].color
					gridDrawContainer.addChild(gridSquare)
				}
			}
		}

		let texture = renderer.generateTexture(gridDrawContainer);

		let gridSprite = new PIXI.Sprite()
		gridSprite.setTexture(texture)

		window.imageThumbs['toDraw' + levelData.idSaveData] = gridSprite;

		return gridSprite;

	}

	getGridBackground(levelData) {

	
		let colorScheme = colorSchemes.getCurrentColorScheme().grid;
		let gridBackground = new PIXI.Container();

		// for (var i = GRID.i - 1; i >= 0; i--) {
		// 	for (var j = GRID.j - 1; j >= 0; j--) {
		
		// 		let targetTile = this.tileDesigner.getTileSprite(i,j,levelData.pieces, true)
		
		// 		if(targetTile){

		// 			let gridSquare = new PIXI.mesh.NineSlicePlane(
		// 				PIXI.Texture.fromFrame(targetTile), 20, 20, 20, 20)
		// 			gridSquare.tint = colorScheme.background
		// 			gridSquare.width = CARD.width + 4
		// 			gridSquare.height = CARD.height + 4
		// 			gridSquare.x = i * CARD.width;
		// 			gridSquare.y = j * CARD.height;
	
		// 			gridBackground.addChild(gridSquare)					
		// 		}

		// 	}
		// }

		for (var i = GRID.i - 1; i >= 0; i--) {
			for (var j = GRID.j - 1; j >= 0; j--) {
		
				let targetTile = this.tileDesigner.getTileSprite(i,j,levelData.pieces)
		
				if(targetTile){

					let gridSquare = new PIXI.mesh.NineSlicePlane(
						PIXI.Texture.fromFrame(targetTile), 20, 20, 20, 20)
					//gridSquare.tint = colorScheme.background
					gridSquare.width = CARD.width + 4
					gridSquare.height = CARD.height + 4
					gridSquare.x = i * CARD.width;
					gridSquare.y = j * CARD.height;
	
					gridBackground.addChild(gridSquare)
					if (levelData && (levelData.pieces[j][i] == 32)) {
						//gridSquare.alpha = 0;
						//backGridContainerBlocker.addChild(gridSquare)
					} else {
	
					}
				}

			}
		}

		return gridBackground;
	}

	createGrid(levelData) {

		this.resetGrid();
		let gridContainer = new PIXI.Container();

		let colorScheme = colorSchemes.getCurrentColorScheme().grid;
		let colorSchemeList = colorSchemes.getCurrentColorScheme().list;

		//toDraw = null;
		if (levelData) {

			let gridDrawContainer = this.getGridPreviewImage(levelData)
			this.topGridContainer.addChild(gridDrawContainer)

			this.topGridContainer.x = 0;
			this.topGridContainer.y = 0;
			this.topGridContainer.alpha = 0;

			//let zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 10)
			//this.topGridContainer.addChild(zero)
			//TweenMax.to(this.topGridContainer, 0.3, { alpha: 1, delay: 0.2 });

			let drawOdd = levelData.piecesToDraw[0].length % 2 != 0
			let boardOdd = levelData.pieces[0].length % 2 != 0
			let scaleOdd = levelData.levelDataScale % 2 != 0

			let drawOddY = levelData.piecesToDraw.length % 2 != 0
			let boardOddY = levelData.pieces.length % 2 != 0

			if (levelData.padding.left) {
				gridDrawContainer.x = levelData.padding.left * CARD.width;


			}
			if (levelData.padding.top) {
				gridDrawContainer.y = levelData.padding.top * CARD.width;
			}
			this.topGridContainer.pivot.x = this.topGridContainer.width / 2;
			this.topGridContainer.pivot.y = this.topGridContainer.height / 2;
			this.topGridContainer.x += this.topGridContainer.width / 2;
			this.topGridContainer.y += this.topGridContainer.height / 2;

			if (levelData.levelDataScale > 1) {
				if (drawOddY && (boardOddY != drawOddY)) {
					this.topGridContainer.y += CARD.width * 0.25;
				} else if (!drawOddY && (boardOddY == drawOddY) && (scaleOdd && levelData.piecesToDraw[0].length < 20)) {
					this.topGridContainer.y += CARD.width * 0.5;
				}

				if (drawOdd && (boardOdd != drawOdd)) {
					this.topGridContainer.x += CARD.width * 0.25;
				} else if (!drawOdd && (boardOdd == drawOdd) && (scaleOdd && levelData.piecesToDraw[0].length < 20)) {
					this.topGridContainer.x += CARD.width * 0.5;
				}
			}
			TweenMax.to(this.topGridContainer, 0.25, { alpha: 1 });
			///////////////////this.topGridContainer.scale.set(0.5)
			//////////////////TweenMax.to(this.topGridContainer.scale, 3, { x:1.1, y:1.1 });
			////////

			this.topGridContainer.scale.set(1.1)
			//TweenMax.to(this.topGridContainer.scale, 0.75, { x: 1.1, y: 1.1 });


			setTimeout(() => {
				window.SOUND_MANAGER.play('shoosh', { volume: 0.75 });
			}, 50);

			setTimeout(() => {
				window.SOUND_MANAGER.play('explosion', { volume: 0.75 });
				window.SOUND_MANAGER.play('kill', { volume: 0.75 });
			}, 900);
			TweenMax.to(this.topGridContainer.scale, 0.5, { delay: 0.751, x: 1, y: 1, ease: Elastic.easeOut });
			TweenMax.from(this.topGridContainer, 1.25, { y: this.topGridContainer.height / 2 + levelData.padding.bottom * CARD.width, ease: Cubic.easeOut });
			TweenMax.to(this.topGridContainer, 0.5, {
				alpha: 0, delay: 1, onComplete: () => {
					this.topGridContainer.removeChild(gridDrawContainer)
				}
			});

			/////////
		}

		console.log(levelData)
		let backGridContainer = new PIXI.Container();
		let backGridContainerBlocker = new PIXI.Container();
		for (var i = GRID.i - 1; i >= 0; i--) {
			let gridLine = [];
			for (var j = GRID.j - 1; j >= 0; j--) {
				let gridSquare = new PIXI.mesh.NineSlicePlane(
					PIXI.Texture.fromFrame(colorScheme.sprite), 20, 20, 20, 20)

				gridSquare.width = CARD.width
				gridSquare.height = CARD.height
				gridSquare.x = i * CARD.width;
				gridSquare.y = j * CARD.height;

				gridSquare.alphaMin = Math.random() * 0.020 + 0.020 + colorScheme.minAlpha;
				gridSquare.alpha = Math.random() * Math.abs(colorScheme.maxAlpha - colorScheme.minAlpha) + colorScheme.minAlpha
				gridSquare.speed = 0.3;
				gridSquare.startAlpha = gridSquare.alpha;
				gridSquare.sin = Math.random() * Math.PI * 2;
				gridSquare.tint = colorScheme.color;

				backGridContainer.addChild(gridSquare)
				if (levelData && (levelData.pieces[j][i] == 32)) {
					gridSquare.alpha = 0;
					//backGridContainerBlocker.addChild(gridSquare)
				} else {

				}

				this.grids.push(gridSquare);

				let gridEffectSquare = new PIXI.mesh.NineSlicePlane(
					PIXI.Texture.fromFrame(colorScheme.spriteTile), 20, 20, 20, 20)//PIXI.Sprite.fromFrame(colorScheme.sprite)

				gridEffectSquare.width = CARD.width
				gridEffectSquare.height = CARD.height
				gridEffectSquare.x = i * CARD.width;
				gridEffectSquare.y = j * CARD.height;
				gridEffectSquare.alpha = 0;
				gridContainer.addChild(gridEffectSquare)
				gridLine.unshift({ shape: gridEffectSquare, card: null });
			}
			this.gridsSquares.unshift(gridLine);
		}
		let texture = renderer.generateTexture(backGridContainer);

		let textureBlocker = renderer.generateTexture(backGridContainerBlocker);

		this.gridSprite = new PIXI.Sprite()
		this.gridSprite.setTexture(texture)
		gridContainer.addChildAt(this.gridSprite, 0)

		this.gridSpriteBlockers = new PIXI.Sprite()
		//this.gridSpriteBlockers.setTexture(textureBlocker)
		gridContainer.addChildAt(this.gridSpriteBlockers, 0)

		if(levelData){
			let levelShape = this.getGridBackground(levelData)
			levelShape.width += 4
			levelShape.x -= 4
			levelShape.height += 4
			levelShape.y -= 4
			this.gridSpriteBlockers.addChildAt(levelShape, 0)
		}

		gridContainer.alpha = 0

		//this.gridSpriteBlockers.alpha = 0;

		TweenMax.to(gridContainer, 0.5, { alpha: 1, delay: 0.75 });
		this.addChild(gridContainer);

		//setTimeout(() => {

		// let back = new PIXI.mesh.NineSlicePlane(
		// 	PIXI.Texture.fromFrame(colorScheme.spriteTile), 20, 20, 20, 20)
		// back.tint = colorScheme.background;
		// back.width = gridContainer.width + this.backgroundOffset.x
		// back.height = gridContainer.height + this.backgroundOffset.y + CARD.height
		// back.x = -this.backgroundOffset.x / 2
		// back.y = -this.backgroundOffset.y / 4
		// gridContainer.addChildAt(back, 0);
		//}, 100);
	}
	endGameMode() {
		this.gridSpriteBlockers.alpha = 1;
	}
	removeCard(i, j) {
		let tile = this.gridsSquares[i][j]
		if (tile.card) {
			this.cardsStartedOnGrid--;

			tile.shape.parent.removeChild(tile.shape);
		}
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
			//shape.anchor.set(0.5);
			shape.pivot.x = shape.width / 2
			shape.pivot.y = shape.height / 2
			shape.x += shape.width / 2
			shape.y += shape.height / 2

			if(shape && this.game.frontGridContainer){
				this.game.frontGridContainer.addChild(shape);
			}
			this.dropTiles.push(shape);
			this.gridsSquares[card.pos.i][card.pos.j].card = null;
			window.SOUND_MANAGER.play('dropTile', { volume: 0.5, speed: Math.random() * 0.2 + 0.8, singleInstance: true })

			if (this.cardsStartedOnGrid <= 0) {
				this.onDestroyAllStartedCards.dispatch();
			}
		}
	}
	paintTile(card) {

		let colorScheme = colorSchemes.getCurrentColorScheme().grid;

		this.gridsSquares[card.pos.i][card.pos.j].card = card;
		let color = card.currentTileColor;
		let alpha = 0.45 + colorScheme.extraTileAlpha;
		if (color == config.colors.dark) {
			color = 0x000000;
			alpha = 0.65 + colorScheme.extraTileAlpha
		}
		this.gridsSquares[card.pos.i][card.pos.j].shape.tint = color;
		TweenMax.to(this.gridsSquares[card.pos.i][card.pos.j].shape, 0.5, { delay: 1, alpha: alpha })
		this.cardsStartedOnGrid++;
	}
}