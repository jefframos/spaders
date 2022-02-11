import * as PIXI from 'pixi.js';
import config from '../../config';
export default class StarParticle extends PIXI.Container {
    constructor(size) {
        super();

        let listParticles = ['gridSquare.png']
        let p = listParticles[Math.floor(Math.random() * listParticles.length)];
        // console.log(p);
        this.graphics = new PIXI.Sprite.fromFrame(p)//(PIXI.Texture.fromFrame(p)); // new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0,0,size,size);
        this.graphics.anchor.set(0.5);

        //if (p == listParticles[listParticles.length - 1]) {
        //    this.graphics.scale.set(size / this.graphics.width * 4.5 * 0.05)
        //} else {
        this.graphics.scale.set(size / this.graphics.width)
        //}
        // this.graphics.rotation = Math.PI / 4;
        this.addChild(this.graphics);
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    update(velY, size) {

        this.y += velY * this.alpha

        if (this.y > size.height / 2) {
            this.y -= size.height * 1.5
            this.x = Math.random() * size.width - size.width / 2

        }

    }
}