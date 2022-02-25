import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import TweenMax from 'gsap';
import UIButton1 from './UIButton1';


export default class PopUpOverlay extends PIXI.Container {
    constructor() {
        super();
        this.background = new PIXI.Graphics().beginFill(0x000000).drawRect(-5000, -5000, 10000, 10000);

        this.modalSize = { width: 500, height: 300 };
        this.addChild(this.background);
        this.background.alpha = 0.25;
        this.background.interactive = true;
        this.interactive = true;
        this.textBoxContainer = new PIXI.Container();

        this.backShape= new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)
		this.backShape.width = this.modalSize.width
		this.backShape.height = this.modalSize.height
		this.backShape.tint = config.colors.white
        this.backShape.interactive = true;

        this.textBoxContainer.addChild(this.backShape);

        this.tutorialLabel = new PIXI.Text('', { font: '32px', fill: config.colors.background, align: 'center', wordWrap: true, wordWrapWidth: 300, fontWeight: '500', fontFamily: window.STANDARD_FONT1 });
        this.tutorialLabel.x = 50;
        this.tutorialLabel.y = 20;
        this.textBoxContainer.addChild(this.tutorialLabel);
        this.addChild(this.textBoxContainer);
        this.textBoxContainer.scale.set(0);

        // let center = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 20)
        // this.addChild(center)

        this.confirmButton = new UIButton1(config.colors.green, window.iconsData.next, config.colors.white);
        this.confirmButton.onClick.add(() => {
            if (this.callbackConfirm) {
                this.callbackConfirm();
                this.callbackConfirm = null;
            }
            this.close();
        });

        this.cancelButton = new UIButton1(config.colors.red, window.iconsData.cancel, config.colors.white);
        this.cancelButton.onClick.add(() => {
            this.doCancel();
        });

        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.on('pointerdown', this.doCancel.bind(this));

        this.textBoxContainer.addChild(this.confirmButton)
        this.textBoxContainer.addChild(this.cancelButton)
        this.first = true;

        this.close();
    }
    close() {
        this.confirmButton.interactive = false;
        this.cancelButton.interactive = false;
        this.background.interactive = false;
        TweenMax.killTweensOf(this.background);
        TweenMax.killTweensOf(this.textBoxContainer);
        TweenMax.to(this.background, 0.4, {
            alpha: 0, onComplete: () => {
                this.visible = false;

            }
        });
        TweenMax.to(this.textBoxContainer, 0.2, { alpha: 0 });
    }
    doCancel() {
        if (this.callbackCancel) {
            this.callbackCancel();
            this.callbackCancel = null;
        }
        this.close();
    }
    show(data, callbackConfirm, callbackCancel, requireOption = false) {
        this.visible = true;
        this.callbackConfirm = callbackConfirm;
        this.callbackCancel = callbackCancel;
        this.tutorialLabel.text = data.text;

        this.backShape.width = this.modalSize.width
		this.backShape.height = this.tutorialLabel.height + 200;

        this.textBoxContainer.scale.set(1)
        this.cancelButton.x = 100;
        this.confirmButton.x = this.modalSize.width - 100;


        TweenMax.killTweensOf(this.background);
        TweenMax.to(this.background, 0.25, { alpha: 0.25 });

        TweenMax.killTweensOf(this.textBoxContainer);
        this.textBoxContainer.x = -this.modalSize.width / 2;
        this.textBoxContainer.y = -this.modalSize.height / 2;

        this.tutorialLabel.x = this.modalSize.width / 2 - this.tutorialLabel.width / 2;
        this.tutorialLabel.y = 50;

        this.confirmButton.y = this.tutorialLabel.y + this.tutorialLabel.height + 80;
        this.cancelButton.y = this.tutorialLabel.y + this.tutorialLabel.height + 80;
        //this.tutorialLabel.y = 20;

        TweenMax.to(this.textBoxContainer, 0.25, { alpha: 1, onComplete:()=>{
            this.confirmButton.interactive = true;
            this.cancelButton.interactive = true;
            this.background.interactive = !requireOption;
        } })
        TweenMax.from(this.textBoxContainer, 0.5, { y: this.textBoxContainer.y - 50, ease: Back.easeOut })
    }

    resize(scaledResolution, innerResolution) {



    }
}