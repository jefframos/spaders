import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import StarParticle from './StarParticle';
import TweenLite from 'gsap';

export default class FXContainer extends PIXI.Container {
    constructor() {
        super();

        this.particles = [];
        this.particlePool = [];

        this.particleSpeed = 600;
        this.particleSpeedTarget = 600;
    }
    shortAngleDist(a0, a1) {
        var max = Math.PI * 2;
        var da = (a1 - a0) % max;
        return 2 * da % max - da;
    }

    angleLerp(a0, a1, t) {
        return a0 + this.shortAngleDist(a0, a1) * t;
    }
    resize(innerResolution) {
        this.particleSpeed = innerResolution.height * 0.3;
        this.particleSpeedTarget = innerResolution.height* 0.4;
    }
    update(delta) {
        for (let index = this.particles.length - 1; index >= 0; index--) {
            const element = this.particles[index];
            element.x += element.velocity.x * delta;
            element.y += element.velocity.y * delta;

            if (element.timeToStick > 0) {
                element.timeToStick -= delta;
                element.velocity.y += element.gravity;
            } else {
                //let angle = Math.atan2(element.y - element.target.y,element.x - element.target.x);

                let distance = utils.distance(element.x, element.y, element.target.x, element.target.y);

                let distanceScale = this.particleSpeedTarget * 0.2 / distance;

                distanceScale = Math.min(distanceScale, 1);

                let angle = Math.atan2(element.target.y - element.y, element.target.x - element.x);
                element.angle = this.angleLerp(element.angle, angle, 0.1 + (distanceScale) * 0.9)
                element.rotation = element.angle;


                element.targetVelocity.x = Math.cos(element.angle) * element.speed;
                element.targetVelocity.y = Math.sin(element.angle) * element.speed;

                element.speed += element.acceleration * delta;

                element.velocity.x = utils.lerp(element.velocity.x, element.targetVelocity.x, 0.1 + (distanceScale) * 0.9);
                element.velocity.y = utils.lerp(element.velocity.y, element.targetVelocity.y, 0.1 + (distanceScale) * 0.9);

                if (distance < 20 || element.timeToLive <= 0) {
                    element.parent.removeChild(element);
                    this.particlePool.push(element);
                    this.particles.splice(index, 1);
                }else{
                    element.timeToLive -= delta;
                }
            }
        }

    }
    getParticle() {
        let toReturn = null;
        if (this.particlePool.length) {
            toReturn = this.particlePool[0];
            this.particlePool.shift();
        } else {
            toReturn = new PIXI.Sprite.fromImage('./assets/images/p1.png')
        }

        return toReturn;
    }
    addParticlesToScore(totalParticles, from, target, color) {

        for (let index = 0; index < totalParticles; index++) {
            let particle = this.getParticle();
            particle.anchor.set(0.5)
            particle.scale.set(0.5)
            particle.target = target;
            particle.position = from;
            particle.tint = color;
            particle.alpha = 1;
            particle.timeToLive = 4;
            particle.gravity = this.particleSpeed * 0.1;
            particle.speed = this.particleSpeedTarget;
            particle.acceleration = this.particleSpeedTarget * 0.5;
            particle.timeToStick = Math.random() * 0.15 + 0.15;
            particle.angle = -Math.PI * Math.random();
            particle.targetVelocity = { x: 0, y: 0 }
            particle.velocity = { x: Math.cos(particle.angle) * this.particleSpeed * 1.5, y: Math.sin(particle.angle) * this.particleSpeed * 0.5};
            this.addChild(particle);
            this.particles.push(particle)
        }

    }
}