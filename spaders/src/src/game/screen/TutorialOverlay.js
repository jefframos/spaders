import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import TweenMax from 'gsap';


export default class TutorialOverlay extends PIXI.Container {
    constructor() {
        super();
        this.background = new PIXI.Graphics().beginFill(0xFF0000).drawRect(-5000, -5000, 10000, 10000);
        this.addChild(this.background);
        this.background.alpha = 0.1;
        this.interactive = true;
        this.textBoxContainer = new PIXI.Container();
        this.backShape = new PIXI.Graphics();
		this.backShape.beginFill(config.colors.white);
		this.backShape.drawRoundedRect(0, 0, 290, 100, 20);
		this.backShape.endFill();
		this.backShape.alpha = 1

        this.textBoxContainer.addChild(this.backShape);
        
        this.tutorialLabel = new PIXI.Text('', { font: '18px', fill: config.colors.background, align: 'right', fontWeight: '500', fontFamily: window.STANDARD_FONT1 });
        
        this.textBoxContainer.addChild(this.tutorialLabel);
        this.addChild(this.textBoxContainer);
        this.textBoxContainer.scale.set(0);

       this.first = true;
    }
    popLabel(data, callback){

        if(this.first){
            this.first = false;
            this.on('pointerup', ()=>{
                if(this.currentCallback){
                    this.currentCallback();
                }
            });
        }
        let loc = this.toLocal(data.position);
        this.textBoxContainer.position = loc;

        this.tutorialLabel.text = data.text;

		this.backShape.clear();
        this.backShape.beginFill(config.colors.white);
		this.backShape.drawRoundedRect(-10,-10, this.tutorialLabel.width + 20, this.tutorialLabel.height + 20, 20);
		this.backShape.endFill();
		this.backShape.alpha = 1
        TweenMax.killTweensOf(this.textBoxContainer.scale);
        this.textBoxContainer.scale.set(1.5,0.5)
        TweenMax.to(this.textBoxContainer.scale, 0.5, {x:1, y:1, ease:Elastic.easeOut})
        this.currentCallback = callback;
        if(data.target){
            data.target.interactive = true;
            data.target.on('pointerup', ()=>{
                data.target.interactive = false;
                if(data.callback){
                    data.callback();
                }

                if(callback){
                    callback()
                }
            });
        }
    }
}