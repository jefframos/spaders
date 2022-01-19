import * as PIXI from 'pixi.js';
import config  from '../../config';
import utils  from '../../utils';
export default class Grid extends PIXI.Container{
	constructor(game){
		super();
		this.game = game;
	}
	start(){
	}

	createGrid(){
		for (let index = this.children.length - 1; index >= 0 ; index--) {
			this.removeChildAt(index);
		}
		let gridContainer = new PIXI.Container();
		let gridBackground = new PIXI.Graphics().beginFill(0).drawRect(0,0,GRID.width, GRID.height);
		gridContainer.addChild(gridBackground)

		for (var i = GRID.i; i >= 0; i--) {
			let line = new PIXI.Graphics().beginFill(0x999999).drawRect(-1,0,2, GRID.height);
			line.x = i * CARD.width;
			gridContainer.addChild(line)
		}

		for (var j = GRID.j; j >= 0; j--) {
			let line = new PIXI.Graphics().beginFill(0x999999).drawRect(0,-1,GRID.width, 2);
			line.y = j * CARD.height;
			gridContainer.addChild(line)
		}
		gridContainer.alpha = 1

		this.addChild(gridContainer);
	}
}