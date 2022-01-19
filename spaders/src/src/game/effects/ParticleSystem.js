import * as PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';

export default class ParticleSystem extends PIXI.Container{
	constructor(){

		super();
		this.particles = [];
		this.particlesContainer = new PIXI.Container();

		this.addChild(this.particlesContainer);


	}
	removeAll(){
		for (var i = this.particles.length - 1; i >= 0; i--) {
			if(this.particles[i].parent){
				this.particles[i].parent.removeChild(this.particles[i]);
			}
			this.particles.splice(i,1);
		}
	}
	getParticle(src = null){
		let source = src?src:'coin/coin_0000'+Math.ceil(Math.random() * 8)+'.png';
		let sprite = PIXI.Sprite.fromImage(source);
		sprite.anchor.set(0.5)
		return sprite;
	}
	
	createParticles(pos = {x:0, y:0}, quant = 4, src = null){
		// return

		this.hasParticles = true;
		this.particleUpdater = 0;
		
		let yMultiplyer = 1
		let xMultiplyer = 1
		let scaleMultiplyer = 1
		let maxLife = Math.random() * 1.5;
		let gravity = 0

		for (let i = 0; i < quant; i++)
		{
		    let particle = this.getParticle(src);
		    // particle.tint = 0xFF0000
		    particle.anchor.set(1, 0.5);
		    // particle.scale.set(0.05 * Math.random() + 0.025);
		    particle.scale.set((0.1 * Math.random() + 0.3) * scaleMultiplyer);
		    let angle = Math.random() * (3.14 * 2)//- Math.atan2(this.velocity.y, this.velocity.x);
		    particle.x = pos.x + Math.random() *quant - quant/2 + 25;
		    particle.y = pos.y + Math.random() *quant - quant/2;
		    particle.alpha = 1;
		    particle.direction = angle;
		    particle.turningSpeed = Math.random() < 0.5 ? 1 : -1;
		    particle.lifetime = maxLife;
		    particle.life = maxLife;
		    particle.gravity = gravity;
		    particle.speed = {
		    	x:Math.random() * 50 - 25 + ((quant*quant)/2 * Math.random())* xMultiplyer,
		    	y:-200 - ((quant*quant)/2 * Math.random())* yMultiplyer
		    };
		    this.particles.push(particle);
		    this.particlesContainer.addChild(particle);

		 //    if(quant >= 50){
			// 	console.log('WHAT');
			// 	console.log(particle);
			// }
		}
		// console.log(quant);
		// if(quant >= 50){
		// 	console.log('WHAT');
		// 	console.log(particle);
		// }
	}


	update(delta){
		// return
		// console.log(this.particles.length);
		for (var i = this.particles.length - 1; i >= 0; i--)
	    {
	        var particle = this.particles[i];
	        particle.direction += particle.turningSpeed * 0.1;
	       	particle.position.x += particle.speed.x * particle.turningSpeed * delta// (Math.sin(particle.direction) * (particle.speed)) * delta;
	        particle.position.y += particle.speed.y * delta//(Math.cos(particle.direction) * (particle.speed) + particle.gravity) * delta;
	        particle.speed.y += particle.gravity * delta
	        //particle.rotation = -particle.direction + Math.PI;
	        // console.log(particle.lifetime / particle.life);
	        // particle.alpha = particle.lifetime / particle.life + 0.1;
	        // particle.scale.x -= delta*0.15
	        // particle.scale.y -= delta*0.15

	        particle.lifetime -= delta;
	        if(particle.lifetime <= 0){
	        	particle.position.y = 0;
	        	particle.lifetime = 1
	        	// particle.parent.removeChild(particle)
	        	// this.particles.splice(i, 1);
	        }
		}
	}
}