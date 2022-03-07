import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import StarParticle from './StarParticle';
import TweenLite from 'gsap';


export default class FXContainer extends PIXI.Container {
    constructor(backContainer) {
        super();
        this.backContainer = backContainer;
        this.sprites = [];
        this.particles = [];
        this.particlePool = [];
        this.spritesPool = [];

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
        this.particleSpeedTarget = innerResolution.height * 0.4;
    }

    startFireworks(position, xVelocity, color) {
        let particle = this.getParticle();
        particle.anchor.set(0.5)
        particle.scale.set(0.15)
        particle.target = null;
        particle.targetPosition = null
        particle.position = position;
        particle.tint = color;
        particle.alpha = 1;
        particle.timeToLive = 2 + Math.random() * 2;
        particle.scaleSpeed = 0;
        particle.gravity = this.particleSpeed * 0.01 + this.particleSpeed * 0.01 * Math.random();
        particle.speed = this.particleSpeedTarget;
        particle.acceleration = this.particleSpeedTarget * 0.5;
        particle.timeToStick = 50;
        particle.angle = -Math.PI * Math.random();
        particle.isFireworks = true;


        let speedScale = 1;
        particle.velocity = { x: xVelocity, y: -300 };


        particle.targetVelocity = { x: 0, y: 0 }
        this.backContainer.addChild(particle);
        this.particles.push(particle)

        particle.callback = () => {
            this.addParticlesToScoreGravity(
                8,
                particle.position,
                null,
                particle.tint,
                0.5
            )
        }
    }


    popSprite(src, pos, width, color) {
        let sprite = PIXI.Sprite.fromFrame(src)
        sprite.anchor.set(0.5);
        sprite.scale.set(width / sprite.width);
        sprite.tint = color;
        let fallData = {
            gravity: 500,
            timeToDie: 5,
            timeToFall: 0.75,
            velocity: { x: Math.random() * CARD.width, y: 0 },
            angularVelocity: (Math.random() - 0.5) * Math.PI * 2
        }
        sprite.fallData = fallData;

        sprite.position = pos;

        TweenMax.from(sprite.scale, 0.5, {
            x: sprite.scale.x * 0.8,
            y: sprite.scale.y * 1.2,
            ease: Elastic.easeOut
        })

        this.addChild(sprite);

        this.sprites.push(sprite)
    }
    update(delta) {
        for (let index = this.sprites.length - 1; index >= 0; index--) {
            const element = this.sprites[index];

            if (element.fallData.timeToFall > 0) {
                element.fallData.timeToFall -= delta;
            } else if (element.parent) {
                element.x += element.fallData.velocity.x * delta;
                element.y += element.fallData.velocity.y * delta;

                element.fallData.velocity.y += element.fallData.gravity * delta;
                element.rotation += element.fallData.angularVelocity * delta

                if (element.fallData.timeToDie > 0) {
                    element.fallData.timeToDie -= delta;
                    if (element.fallData.timeToDie <= 0) {
                        element.parent.removeChild(element);
                        this.sprites.splice(index, 1);
                    }
                }

            }
        }
        for (let index = this.particles.length - 1; index >= 0; index--) {
            const element = this.particles[index];
            element.x += element.velocity.x * delta;
            element.y += element.velocity.y * delta;

            element.scale.x -= element.scaleSpeed * delta;
            element.scale.y -= element.scaleSpeed * delta;

            if (element.scale.x < 0) {
                element.scale.set(0);
            }
            if( element.isFireworks && (element.y < 150 || element.velocity.y > 20)){
                element.timeToLive = 0;
            }
            if (element.timeToLive <= 0) {
                if (element.callback) {
                    element.callback();
                    element.callback = null;
                }
                element.parent.removeChild(element);
                this.particlePool.push(element);
                this.particles.splice(index, 1);
            } else {
                element.timeToLive -= delta;
            }

            if (element.parent) {
                if (element.timeToStick > 0) {
                    element.timeToStick -= delta;
                    element.velocity.y += element.gravity;
                } else if (element.target) {
                    //let angle = Math.atan2(element.y - element.target.y,element.x - element.target.x);

                    let distance = utils.distance(element.x, element.y, element.targetPosition.x, element.targetPosition.y);

                    let distanceScale = this.particleSpeedTarget * 0.2 / distance;

                    distanceScale = Math.min(distanceScale, 1);

                    let angle = Math.atan2(element.targetPosition.y - element.y, element.targetPosition.x - element.x);
                    element.angle = this.angleLerp(element.angle, angle, 0.1 + (distanceScale) * 0.9)
                    element.rotation = element.angle;


                    element.targetVelocity.x = Math.cos(element.angle) * element.speed;
                    element.targetVelocity.y = Math.sin(element.angle) * element.speed;

                    element.speed += element.acceleration * delta;

                    element.velocity.x = utils.lerp(element.velocity.x, element.targetVelocity.x, 0.1 + (distanceScale) * 0.9);
                    element.velocity.y = utils.lerp(element.velocity.y, element.targetVelocity.y, 0.1 + (distanceScale) * 0.9);

                    if (distance < 20) {
                        element.parent.removeChild(element);

                        if (element.callback) {
                            element.callback();
                        }
                        if (element.target.getParticles) {
                            element.target.getParticles(element);
                            let max = Math.min(this.particles.length, 10);
                            let extra = max / 10 * 0.025
                            window.SOUND_MANAGER.play('coin', { speed: Math.random() * 0.1 + 1 + extra, volume: 0.05 })
                        }
                        this.particlePool.push(element);
                        this.particles.splice(index, 1);
                    }
                } else {
                    //console.log(element.scaleSpeed)

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
            toReturn = new PIXI.Sprite.fromFrame('p1.png')
        }

        return toReturn;
    }
    addParticlesToScore(totalParticles, from, target, color, speedScale = 1) {

        //for (let index = 0; index < totalParticles; index++) {
            // let particle = this.getParticle();
            // this.addChild(particle)
            // particle.x = from.x + Math.random() * 10 - 5
            // particle.y = from.y + Math.random() * 10 - 5
            // particle.tint = color;
            // particle.alpha = 0.1
        //}
        for (let index = 0; index < totalParticles; index++) {
            let particle = this.getParticle();
            particle.anchor.set(0.5)
            particle.scale.set(0.5)
            particle.target = target;
            particle.targetPosition = target ? this.toLocal(target.getGlobalPosition()) : null;;
            particle.position = from;
            particle.tint = color;
            particle.alpha = 1;
            particle.timeToLive = 4;
            particle.scaleSpeed = target ? 0 : 1;
            particle.gravity = target ? this.particleSpeed * 0.1 : 0;
            particle.speed = this.particleSpeedTarget;
            particle.acceleration = this.particleSpeedTarget * 0.5;
            particle.timeToStick = target ? Math.random() * 0.15 + 0.15 : 5;
            particle.angle = target ? -Math.PI * Math.random() : -Math.PI * 2 * Math.random();
            particle.isFireworks = false;
            if (!target) {
                particle.angle = (Math.PI * 2) * (index + 1) / totalParticles
                particle.velocity = { x: Math.cos(particle.angle) * this.particleSpeed * speedScale, y: Math.sin(particle.angle) * this.particleSpeed * speedScale };
            } else {

                particle.velocity = { x: Math.cos(particle.angle) * this.particleSpeed * 1.5, y: Math.sin(particle.angle) * this.particleSpeed * 0.5 };
            }

            particle.targetVelocity = { x: 0, y: 0 }
            this.addChild(particle);
            this.particles.push(particle)
        }

    }

    addParticlesToScoreGravity(totalParticles, from, target, color, speedScale = 1) {

        for (let index = 0; index < totalParticles; index++) {
            let particle = this.getParticle();
            particle.anchor.set(0.5)
            particle.scale.set(0.5)
            particle.target = target;
            particle.targetPosition = target ? this.toLocal(target.getGlobalPosition()) : null;;
            particle.position = from;
            particle.tint = color;
            particle.alpha = 1;
            particle.timeToLive = 4 + 2 * Math.random();
            particle.scaleSpeed = target ? 0 : 1;
            particle.gravity = this.particleSpeed * 0.01 + Math.random() * -this.particleSpeed * 0.005;
            particle.speed = this.particleSpeedTarget;
            particle.acceleration = this.particleSpeedTarget * 0.5;
            particle.timeToStick = target ? Math.random() * 0.15 + 0.15 : 5;
            particle.angle = target ? -Math.PI * Math.random() : -Math.PI * 2 * Math.random();
            particle.isFireworks = false;

            if (!target) {
                particle.angle = (Math.PI * 2) * (index + 1) / totalParticles
                particle.velocity = { x: Math.cos(particle.angle) * this.particleSpeed * speedScale, y: Math.sin(particle.angle) * this.particleSpeed * speedScale };
            } else {

                particle.velocity = { x: Math.cos(particle.angle) * this.particleSpeed * 1.5, y: Math.sin(particle.angle) * this.particleSpeed * 0.5 };
            }

            particle.targetVelocity = { x: 0, y: 0 }
            this.addChild(particle);
            this.particles.push(particle)
        }

    }
}