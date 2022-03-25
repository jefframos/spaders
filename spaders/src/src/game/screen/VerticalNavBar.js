import * as PIXI from 'pixi.js';
import * as signals from 'signals';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import TweenMax from 'gsap';
import colorSchemes from '../../colorSchemes';

export default class VerticalNavBar extends PIXI.Container {
    constructor(color, icon, iconColor, width = 60) {
        super();

        this.sectionPanel = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('verticalbar.png'), 0, 35, 0, 5)
        this.sectionPanel.height = 0

        this.addChild(this.sectionPanel)

        this.sectionPanel.pivot.x = this.sectionPanel.width / 2
        this.sectionPanel.pivot.y = this.sectionPanel.height

        this.sectionLabel = new PIXI.Text("", {
            font: '24px',
            fill: 0xFFFFFF,
            align: 'left',
            letterSpacing: 1,
            //fontWeight: '200',
            fontFamily: window.LOGO_FONT,
            stroke: 0x000000,
		    strokeThickness: 4
        });
        this.sectionLabel.pivot.y = this.sectionLabel.height / 2
        this.addChild(this.sectionLabel);
        this.sectionLabel.rotation = -Math.PI / 2
        this.sectionLabel.y = -50

        //this.setSectionLabel("Video games")
        window.COOKIE_MANAGER.onChangeColors.add(() => {
            this.updateColorScheme();
        })

        this.updateColorScheme();
    }
    updateColorScheme() {
        let colorScheme = colorSchemes.getCurrentColorScheme();
        console.log(colorScheme)
        this.sectionPanel.tint = colorScheme.fillBarColor
    }
    setSectionLabel(text = "") {
        let dir = 1;
        if (this.sectionLabel.text.length > text.length) {
            dir = -1;
        }
        this.sectionLabel.text = text;
        this.sectionLabel.pivot.y = this.sectionLabel.height / 2
        this.sectionLabel.y = -50

        TweenMax.killTweensOf(this.sectionPanel)
        if (text == "") {
            this.sectionPanel.height = 0;
            this.sectionPanel.pivot.y = this.sectionPanel.height
        } else {
            this.sectionPanel.height = (-this.sectionLabel.y * 2) + this.sectionLabel.width
            TweenMax.from(this.sectionPanel, 0.5, {
                height: this.sectionPanel.height - 50 * dir, ease: Back.easeOut, onUpdate: () => {
                    this.sectionPanel.pivot.y = this.sectionPanel.height
                }
            })
        }
    }
}