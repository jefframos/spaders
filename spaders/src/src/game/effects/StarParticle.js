import * as PIXI from 'pixi.js';
import config from '../../config';
export default class StarParticle extends PIXI.Container {
    constructor(size) {
        super();

        let listParticles = ['./assets/images/p1.png', './assets/images/p2.png', './assets/images/p1.png', './assets/images/p2.png']
        let p = listParticles[Math.floor(Math.random() * listParticles.length)];
        // console.log(p);
        this.graphics = new PIXI.Sprite(PIXI.Texture.from(p)); // new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0,0,size,size);
        this.graphics.anchor.set(0.5);

        if (p == listParticles[listParticles.length - 1]) {
            this.graphics.scale.set(size / this.graphics.width * 4.5 * 0.05)
        } else {
            this.graphics.scale.set(size / this.graphics.width * 1.5 * 0.05)
        }
        // this.graphics.rotation = Math.PI / 4;
        this.addChild(this.graphics);
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    update(delta) {
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;

        if (this.x > config.width * 1.2) {
            this.x = -Math.random() * config.width * 0.15;
        } else if (this.x < -config.width * 0.2) {
            this.x = config.width + Math.random() * config.width * 0.15;
        }

        if (this.y > config.height * 1.2) {
            this.y = -Math.random() * config.height * 0.05;
        } else if (this.y < -config.height * 0.2) {
            this.y = config.height + Math.random() * config.height * 0.05;
        }

    }
}