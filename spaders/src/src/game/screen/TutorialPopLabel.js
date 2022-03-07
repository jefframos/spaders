import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import TweenMax from 'gsap';
import UIButton1 from './UIButton1';


export default class TutorialPopLabel extends PIXI.Container {
    constructor() {
        super();
        this.textBoxContainer = new PIXI.Container();
        this.backShape  = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame("largeCard.png"), 20, 20, 20, 20)
        this.backShape.alpha = 1

        this.textBoxContainer.addChild(this.backShape);

        if(window.isMobile){

            this.tutorialLabel = new PIXI.Text('', { font: '13px', fill: config.colors.background, align: 'center', fontWeight: '500', fontFamily: window.STANDARD_FONT1 });
        }else{

            this.tutorialLabel = new PIXI.Text('', { font: '16px', fill: config.colors.background, align: 'center', fontWeight: '500', fontFamily: window.STANDARD_FONT1 });
        }

        this.textBoxContainer.addChild(this.tutorialLabel);
        this.addChild(this.textBoxContainer);
        this.textBoxContainer.scale.set(0);

    

        //this.tutorialActionShape = new PIXI.Graphics().lineStyle(1,0x00FF00).drawRect(0, 0, 300, 300);
        this.tutorialActionShape = new PIXI.Graphics().beginFill(0x00FF00).drawRect(0, 0, 300, 300);
        this.addChild(this.tutorialActionShape)
        this.tutorialActionShape.interactive = true;
        this.tutorialActionShape.buttonMode = true;
        this.tutorialActionShape.alpha = 0;
        this.tutorialActionShape.on('pointerup', this.manageCallbacks.bind(this));
    }
    popLabel(data, callbackNext) {

        this.trackingData = data;
        
        this.sortPositions({x:1,y:1});
        
        let obj = {chars:0}
        let targetTime = data.text.length * 0.02
        targetTime = Math.min(targetTime, 1.5)
        TweenMax.to(obj,targetTime , {delay: data.delay,chars:data.text.length, onUpdate:()=>{

            this.tutorialLabel.text = data.text.substring(0, Math.floor(obj.chars));
            if(this.tutorialLabel.text.length == 1 || this.tutorialLabel.text.length %4 == 0){
                window.SOUND_MANAGER.play('place', { volume: 0.3 + Math.random()*0.2, speed: 0.85 + Math.random() * 0.75 })
            }
            this.backShape.width = this.tutorialLabel.width + 25
            this.backShape.height = this.tutorialLabel.height + 20
            this.backShape.alpha = 1
            this.tutorialLabel.x = 8
            this.tutorialLabel.y = 10
            if(this.trackingData.useGlobalScale){
                this.backShape.x = 0

            }else{

                this.backShape.x = -5
            }
        }, ease:Linear.easeNone})
        
        TweenMax.killTweensOf(this.textBoxContainer.scale);
        this.textBoxContainer.visible = false;
        this.tutorialActionShape.visible = false;
        this.textBoxContainer.scale.set(1.5, 0.5)
        TweenMax.to(this.textBoxContainer.scale, 0.75, {
            delay: data.delay, x: 1, y: 1, ease: Elastic.easeOut, onStart: () => {
                this.textBoxContainer.visible = true;
                setTimeout(() => {                    
                    this.tutorialActionShape.visible = true;
                }, 500);
            }
        })

        this.currentCallback = callbackNext;
        this.dataCallback = data.callback;

    }
    sortPositions(scale) {
        if (!this.trackingData) {
            return;
        }

        let loc = this.toLocal(this.trackingData.target.getGlobalPosition());
       

        
       
        let targetScale = {x:1,y:1}

        if(this.trackingData.useGlobalScale){
            targetScale = scale;
        }
        this.tutorialActionShape.width = this.trackingData.target.width * targetScale.x;
        this.tutorialActionShape.height = this.trackingData.target.height* targetScale.y;
        this.tutorialActionShape.x = loc.x
        this.tutorialActionShape.y = loc.y

        //loc = this.toLocal(this.trackingData.targetSpeech.getGlobalPosition());
        
        this.textBoxContainer.position.x = loc.x;
        this.textBoxContainer.position.y = loc.y;
        if (this.trackingData.centerBox) {
            if (this.trackingData.centerBox.x) {
                this.textBoxContainer.x = loc.x + this.tutorialActionShape.width * this.trackingData.centerBox.x - this.textBoxContainer.width / 2;
            }
            if (this.trackingData.centerBox.y) {
                this.textBoxContainer.y = loc.y + this.tutorialActionShape.height * this.trackingData.centerBox.y - this.textBoxContainer.height / 2;
            }
        }

        this.textBoxContainer.position.x += this.trackingData.textBoxOffset.x * this.textBoxContainer.width;
        this.textBoxContainer.position.y += this.trackingData.textBoxOffset.y * this.textBoxContainer.height;


    }
    manageCallbacks() {

        if (this.dataCallback) {
            this.dataCallback();
        }

        if (this.currentCallback) {
            this.currentCallback()
        }
    }
    update(delta, scale) {
        this.sortPositions(scale);
    }
}