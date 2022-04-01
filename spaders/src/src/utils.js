import TweenMax from 'gsap';
import colorSchemes from './colorSchemes';
import config from './config';
export default {
    horizontalListHelper(list) {
        let scales = []
        list.forEach(element => {
            if (element.customLength) {
                scales.push(element.customLength);
            } else {
                scales.push(1 / list.length)
            }

        });
        let margin = 2;
        let length = config.width * scales[0] - margin * 2;
        let nextPosition = 0;
        let doDebug = false;

        for (let index = 0; index < list.length; index++) {
            length = config.width * scales[index] - margin * 2;
            //console.log(length)

            const element = list[index];
            element.x = nextPosition; //+ length*0.5
            element.scale.set(1)
            if (doDebug && !element.debugShape) {
                //element.debugShape = new PIXI.Graphics().beginFill(0x005566).drawRect(-length/2, -this.topCanvas.height / 2, length, this.topCanvas.height);
                element.debugShape = new PIXI.Graphics().beginFill(0xFFFFFF * Math.random()).drawRect(0, 0, length, element.height);
                if (element.parent) {
                    element.parent.addChild(element.debugShape);
                }
                element.debugShape.alpha = 0.8
                element.debugShape.x = element.x
            }
            if (element.margin) {
                let scl = (length - element.margin * 2) / (element.width / element.scale.x)
                element.scale.set(scl)
                element.x += element.margin
                if (element.debug) {
                    console.log(element.width, length)
                }
            }
            nextPosition += length
        }
    },
    uniq_fast(a) {
		var seen = {};
		var out = [];
		var len = a.length;
		var j = 0;
		for(var i = 0; i < len; i++) {
			 var item = a[i];
			 if(seen[item] !== 1) {
				   seen[item] = 1;
				   out[j++] = item;
			 }
		}
		return out;
	},
    flat3Arrays(array1, array2, array3){
        var comb6 = array3.flatMap(t => array1.flatMap(d => array2.map(v => [t, d, v])))
		comb6.forEach(element => {
			element.sort()
		});
		comb6 = this.uniq_fast(comb6)

		for (let index = comb6.length - 1; index >= 0; index--) {
			if (comb6[index][0] == comb6[index][1] || comb6[index][2] == comb6[index][1] || comb6[index][0] == comb6[index][2]) {
				comb6.splice(index, 1)
			}
		}

        return comb6

    },
    flat2Arrays(array1, array2){
        var comb6 = array1.flatMap(d => array2.map(v => [d, v]))
		comb6.forEach(element => {
			element.sort()
		});
		comb6 = this.uniq_fast(comb6)

		for (let index = comb6.length - 1; index >= 0; index--) {
			if (comb6[index][0] == comb6[index][1] ) {
				comb6.splice(index, 1)
			}
		}

        return comb6

    },
    trimMatrix(pieces, ignoreBlocker = false) {
        if (pieces.length <= 0) {
            return;
        }
        let colCounters = [];
        let lineCounters = [];
        for (let i = 0; i < pieces.length; i++) {
            colCounters.push(0);
        }
        for (let i = 0; i < pieces[0].length; i++) {
            lineCounters.push(0);
        }
        for (let i = 0; i < pieces.length; i++) {
            for (let j = 0; j < pieces[i].length; j++) {
                const element = pieces[i][j];
                if (element >= 0) {
                    //if (!ignoreBlocker || (ignoreBlocker && element != 19)) {
                   // if (!ignoreBlocker) {
                        lineCounters[j]++;
                        colCounters[i]++;
                    //}
                }
            }
        }


        let padding = { left: 0, right: 0, top: 0, bottom: 0 }

        for (let i = 0; i < lineCounters.length; i++) {
            const element = lineCounters[i];
            if (element == 0) {
                padding.left++;
            } else {
                break;
            }
        }
        for (let i = lineCounters.length - 1; i >= 0; i--) {
            const element = lineCounters[i];
            if (element == 0) {
                padding.right++;
            } else {
                break;
            }
        }

        for (let i = 0; i < colCounters.length; i++) {
            const element = colCounters[i];
            if (element == 0) {
                padding.top++;
            } else {
                break;
            }
        }
        for (let i = colCounters.length - 1; i >= 0; i--) {
            const element = colCounters[i];
            if (element == 0) {
                padding.bottom++;
            } else {
                break;
            }
        }

        pieces.splice(0, padding.top);
        pieces.splice(pieces.length - padding.bottom, padding.bottom);

        for (let i = 0; i < pieces.length; i++) {
            pieces[i].splice(0, padding.left);
            pieces[i].splice(pieces[i].length - padding.right, padding.right);
        }


            return padding
        // console.log(lineCounters);
        // console.log(colCounters);
        // console.log(padding);
    },
    paddingMatrix(pieces, padding = { left: 0, right: 0, top: 0, bottom: 0 }) {

        if (pieces.length <= 0) {
            return;
        }
        let totPadding = 0;
        for (const key in padding) {
            totPadding += padding[key];
        }
        if (totPadding == 0) {
            return;
        }
        //console.log(pieces)
        if(padding.left < 0){
            for (let i = 0; i < pieces.length; i++) {
                for (let p = 0; p < Math.abs(padding.left); p++) {
                    pieces[i].shift();
                }
            }
        }else{

            for (let i = 0; i < pieces.length; i++) {
                for (let p = 0; p < padding.left; p++) {
                    pieces[i].unshift(-1);
                }
                for (let p = 0; p < padding.right; p++) {
                    pieces[i].push(-1);
                }
            }
        }
        
        if(padding.top < 0){
            for (let i = 0; i < Math.abs(padding.top); i++) {
                let colCounters = [];
                for (let index = 0; index < pieces[0].length; index++) {
                    colCounters.shift();
                }
            }
        }
        for (let i = 0; i < padding.top; i++) {
            let colCounters = [];
            for (let index = 0; index < pieces[0].length; index++) {
                colCounters.push(-1);
            }
            pieces.unshift(colCounters);
        }

        for (let i = 0; i < padding.bottom; i++) {
            let colCounters = [];
            for (let index = 0; index < pieces[0].length; index++) {
                colCounters.push(-1);
            }
            pieces.push(colCounters);
        }
    },

    getArrounds(pieces, i, j) {
        let arrounds = [];
        let offsets = [
            { i: 0, j: -1 },
            { i: 0, j: 1 },

            { i: -1, j: -1 },
            { i: 1, j: 1 },

            { i: 1, j: 0 },
            { i: -1, j: 0 },

            { i: 1, j: -1 },
            { i: -1, j: 1 },
        ]

        offsets.forEach(element => {
            let next = {
                i: i + element.i,
                j: j + element.j,
            }

            if (
                (next.i >= 0 && next.i < pieces.length - 1) &&
                (next.j >= 0 && next.j < pieces[i].length - 1)
            ) {
                if (pieces[next.i][next.j] >= 0 && pieces[next.i][next.j] < 32) {
                    arrounds.push({
                        id: pieces[next.i][next.j],
                        i: next.i,
                        j: next.j,
                    })
                }
            }
        })

        return arrounds;
    },

    scaleLevel(pieces, scale = 2, debug = false) {
        let scaledLevel = [];
        for (let i = 0; i < pieces.length; i += scale) {
            let col = [];
            for (let j = 0; j < pieces[i].length; j += scale) {

                let scalePiecesObject = {}
                scalePiecesObject['p' + pieces[i][j]]
                let scalePieces = []
                scalePieces.push(pieces[i][j])
                let pass = 0;
                if (i + 1 < pieces.length) {
                    scalePieces.push(pieces[i + 1][j])
                    pass++
                }
                if (j + 1 < pieces[i].length) {
                    scalePieces.push(pieces[i][j + 1])
                    pass++
                }
                if (pass >= 2) {
                    scalePieces.push(pieces[i + 1][j + 1])
                }

                let more = -1;
                scalePieces.forEach(sclPiece => {
                    if (sclPiece >= 0) {

                        if (scalePiecesObject['p' + sclPiece]) {
                            scalePiecesObject['p' + sclPiece].quant++;
                            more = sclPiece;
                        } else {
                            scalePiecesObject['p' + sclPiece] = {
                                quant: 1,
                                id: sclPiece
                            }
                            if (more < 0) {
                                more = sclPiece;
                            }
                        }
                    }
                });

                //console.log(scalePiecesObject);
                col.push(more);
            }
            scaledLevel.push(col);
        }
        //console.log(scaledLevel)
        return scaledLevel;
    },
    addBlockers(pieces, distance = 2, colorPallete = 0, debug = false) {
        if (pieces.length <= 0) {
            return;
        }
        let colorScheme = colorSchemes.getColorScheme(colorPallete);

        let colCounters = [];
        let lineCounters = [];
        for (let i = 0; i < pieces.length; i++) {
            colCounters.push(0);
        }
        for (let i = 0; i < pieces[0].length; i++) {
            lineCounters.push(0);
        }
        for (let i = 0; i < pieces.length; i++) {
            for (let j = 0; j < pieces[i].length; j++) {
                const element = pieces[i][j];
                if (element >= 0 && lineCounters[j] == 0) {
                    lineCounters[j] = i;
                }
            }
        }

        for (let index = 0; index < lineCounters.length; index++) {
            if (lineCounters[index] == 0) {
                if (index < lineCounters.length / 2) {

                    for (let j = 0; j < lineCounters.length; j++) {
                        if (lineCounters[j] > 0) {
                            lineCounters[index] = lineCounters[j];
                            break;
                        }

                    }
                } else {
                    for (let j = lineCounters.length - 1; j >= 0; j--) {
                        if (lineCounters[j] > 0) {
                            lineCounters[index] = lineCounters[j];
                            break;
                        }

                    }
                }
            }
        }

        for (let index = 0; index < lineCounters.length; index++) {
            const element = lineCounters[index];
            let pos = { i: element - distance - 1, j: index }

            if (element > 0 && pos.i > 0) {
                let arrounds = this.getArrounds(pieces, pos.i, pos.j);
                while (arrounds.length > 0 && pos.i >= 0) {

                    arrounds = this.getArrounds(pieces, pos.i, pos.j);
                    if (arrounds.length > 0) {
                        if (lineCounters[index] && lineCounters[index] > 0) {
                            lineCounters[index]--;
                        }
                    }
                    pos.i--;
                }
            }

        }


        for (let i = 0; i < pieces.length; i++) {
            for (let j = 0; j < pieces[i].length; j++) {
                const element = pieces[i][j];
                if (i < lineCounters[j] - distance) {
                    pieces[i][j] = colorScheme.block.id;
                    //console.log(colorScheme.block.id)
                }
            }
        }
    },
    resizeToFitMaxAR(size, element, res) {
		if (!res) {
			res = element
		}
		let sclX = (size.width) / (res.width / res.scale.x);
		let sclY = (size.height) / (res.height / res.scale.y);
		let min = Math.max(sclX, sclY);
		element.scale.set(min)
	},
    resizeToFitAR(size, element, res) {
		if (!res) {
			res = element
		}
		let sclX = (size.width) / (res.width / res.scale.x);
		let sclY = (size.height) / (res.height / res.scale.y);
		let min = Math.min(sclX, sclY);
		element.scale.set(min)
	},
	resizeToFit(size, element) {
		let sclX = (size.width) / (element.width / element.scale.x);
		let sclY = (size.height) / (element.height / element.scale.y);
		let min = Math.min(sclX, sclY);
		element.scale.set(sclX, sclY)
	},
    formatPointsLabel(tempPoints) {
        if (tempPoints < 10) {
            return "00000" + tempPoints
        } else if (tempPoints < 100) {
            return "0000" + tempPoints
        } else if (tempPoints < 1000) {
            return "000" + tempPoints
        } else if (tempPoints < 10000) {
            return "00" + tempPoints
        } else if (tempPoints < 100000) {
            return "0" + tempPoints
        } else {
            return tempPoints
        }
    },
    convertNumToTime(number) {
        var sec_num = parseInt(number, 10); // don't forget the second param
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return hours + ':' + minutes + ':' + seconds;
    },
    getRandomValue(array, exception) {
        let value = array[Math.floor(Math.random() * array.length)];
        if (exception) {
            let equal = true;
            while (equal) {
                equal = false;
                for (let i = 0; i < exception.length; i++) {
                    if (exception[i] == value) {
                        equal = true;
                    }
                }
                if (equal) {
                    value = array[Math.floor(Math.random() * array.length)]
                }
            }
        }
        return value
    },
    scaleSize(element, innerResolution, ratio, offset = { x: 1, y: 1 }) {
        if (innerResolution.width / innerResolution.height >= ratio) {
            //var w = window.innerHeight * this.ratio;
            var w = innerResolution.height * ratio //* offset.x;
            var h = innerResolution.height //* offset.x;
        } else {
            var w = innerResolution.width //* offset.y;
            var h = innerResolution.width / ratio //* offset.y;

        }

        element.width = w;
        element.height = h;
    },
    centerObject(target, parent) {
        target.x = parent.width / 2 - target.width * 0.5;
        target.y = parent.height / 2 - target.height * 0.5;
    },

    centerObject2(target, parent) {
        target.x = parent.width / 2;
        target.y = parent.height / 2;
    },

    alphabetCompare(a, b) {
        var yA = a.type;
        var yB = b.type;
        if (yA < yB) {
            return -1;
        }
        if (yA > yB) {
            return 1;
        }
        return 0;
    },
    xCompare(a, b) {
        var yA = a.x;
        var yB = b.x;
        if (yA > yB) {
            return -1;
        }
        if (yA < yB) {
            return 1;
        }
        return 0;
    },
    distCompare(a, b) {
        var yA = a.dist;
        var yB = b.dist;
        if (yA === yB) {
            return 0;
        }
        if (a.noDepth || b.noDepth) {
            return 0;
        }
        if (yA < yB) {
            return -1;
        }
        if (yA > yB) {
            return 1;
        }
        return 0;
    },
    depthCompare(a, b) {
        var yA = a.y;
        var yB = b.y;
        if (yA === yB) {
            return 0;
        }
        if (a.noDepth || b.noDepth) {
            return 0;
        }
        if (yA < yB) {
            return -1;
        }
        if (yA > yB) {
            return 1;
        }
        return 0;
    },
    createNoiseTexture(config) {

        var params = config ? config : {};

        var canvas = document.createElement('canvas');
        canvas.width = params.width ? params.width : 32
        canvas.height = params.height ? params.height : 32

        var ctx = canvas.getContext('2d'),
            x, y,
            number,
            opacity = params.opacity ? params.opacity : 0.2

        for (x = 0; x < canvas.width; x++) {
            for (y = 0; y < canvas.height; y++) {
                number = Math.floor(Math.random() * 60);
                ctx.fillStyle = "rgba(" + number + "," + number + "," + number + "," + opacity + ")";
                ctx.fillRect(x, y, 1, 1);
            }
        }

        var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas))
        sprite.anchor.set(0.5);
        return sprite;
    },

    createDotTexture(config) {

        var params = config ? config : {};

        var canvas = document.createElement('canvas');
        canvas.width = params.width ? params.width : 32
        canvas.height = params.height ? params.height : 32

        var ctx = canvas.getContext('2d');



        var x = canvas.width / 2,
            y = canvas.height / 2,
            // Radii of the white glow.
            innerRadius = config.innerRadius ? config.innerRadius : 0,
            outerRadius = config.outerRadius ? config.outerRadius : canvas.width * 0.3,
            // Radius of the entire circle.
            radius = canvas.width;

        var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.5, '#333');
        // gradient.addColorStop(0.75, '#030303');
        gradient.addColorStop(0.75, '#020202');
        gradient.addColorStop(0.95, '#010101');
        gradient.addColorStop(0.7, 'black');

        ctx.arc(x, y, radius, 0, 2 * Math.PI);

        ctx.fillStyle = gradient;
        ctx.fill();

        var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas))
        sprite.anchor.set(0.5);
        return sprite;
    },

    perlinNoise(config) {
        var params = config ? config : {};

        var canvas = document.createElement('canvas');
        canvas.width = params.width ? params.width : 32
        canvas.height = params.height ? params.height : 32

        var noise = this.randomNoise(canvas);
        var ctx = canvas.getContext('2d');
        ctx.save();

        /* Scale random iterations onto the canvas to generate Perlin noise. */
        for (var size = 4; size <= noise.width; size *= 2) {
            var x = (Math.random() * (noise.width - size)) | 0,
                y = (Math.random() * (noise.height - size)) | 0;
            ctx.globalAlpha = 4 / size;
            ctx.drawImage(noise, x, y, size, size, 0, 0, canvas.width, canvas.height);
        }

        ctx.restore();
        var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas))
        sprite.anchor.set(0.5);
        return sprite;
    },

    randomNoise(canvas, x, y, width, height, alpha) {
        var canvas = document.createElement('canvas');
        x = x || 0;
        y = y || 0;
        width = width || canvas.width;
        height = height || canvas.height;
        alpha = alpha || 255;
        var g = canvas.getContext("2d"),
            imageData = g.getImageData(x, y, width, height),
            random = Math.random,
            pixels = imageData.data,
            n = pixels.length,
            i = 0;
        while (i < n) {
            pixels[i++] = pixels[i++] = pixels[i++] = (random() * 256) | 0;
            pixels[i++] = alpha;
        }
        g.putImageData(imageData, x, y);
        return canvas;
    },

    getSprite(frame) {
        let texture = PIXI.Texture.fromFrame(frame);
        return new PIXI.Sprite(texture);
    },

    shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    },
    lerp(x, y, a) {
        return x * (1 - a) + y * a;
    },
    clamp(a, min = 0, max = 1) {
        return Math.min(max, Math.max(min, a));
    },
    invlerp(x, y, a) {
        return clamp((a - x) / (y - x));
    },
    range(x1, y1, x2, y2, a) {
        return lerp(x2, y2, invlerp(x1, y1, a));
    },
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    },
    killColorTween(target) {
        for (let i = this.tweenList.length - 1; i >= 0; i--) {
            if (this.tweenList[i].target == target) {
                this.tweenList[i].tween.kill();
                this.tweenList.splice(i, 1);
            }
        }
    },

    addColorTween(currentColor, targetColor, time = 2, delay = 0, callback = null, onComplete = null) {
        if (!this.tweenList) {
            this.tweenList = [];
        }
        const currentColorData = this.toRGB(currentColor);
        const targetColorData = this.toRGB(targetColor);
        const black = this.toRGB(0x000000);
        const tweenObj = {
            tween: TweenMax.to(currentColorData, time,
                {
                    delay,
                    r: targetColorData.r,
                    g: targetColorData.g,
                    b: targetColorData.b,
                    onComplete: onComplete,
                    ease: Linear.easeNone,
                    onUpdate: function () {
                        currentColorData.r = Math.floor(currentColorData.r);
                        currentColorData.g = Math.floor(currentColorData.g);
                        currentColorData.b = Math.floor(currentColorData.b);

                        callback(this.rgbToColor(currentColorData.r, currentColorData.g, currentColorData.b))
                        //targ.tint = this.rgbToColor(currentColorData.r, currentColorData.g, currentColorData.b);
                    }.bind(this),
                }),
            currentColor: this.rgbToColor(currentColorData.r, currentColorData.g, currentColorData.b),
        };

        this.tweenList.push(tweenObj);

        return tweenObj;
    },
    invertColor(rgb) {
        const r = 255 - rgb >> 16 & 0xFF;
        const g = 255 - rgb >> 8 & 0xFF;
        const b = 255 - rgb & 0xFF;

        return this.rgbToColor(r, g, b);
    },
    toRGB(rgb) {
        const r = rgb >> 16 & 0xFF;
        const g = rgb >> 8 & 0xFF;
        const b = rgb & 0xFF;

        return {
            r,
            g,
            b,
        };
    },
    rgbToColor(r, g, b) {
        return r << 16 | g << 8 | b;
    },

    linear(t) { return t },
    // accelerating from zero velocity
    easeInQuad(t) { return t * t },
    // decelerating to zero velocity
    easeOutQuad(t) { return t * (2 - t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
    // accelerating from zero velocity 
    easeInCubic(t) { return t * t * t },
    // decelerating to zero velocity 
    easeOutCubic(t) { return (--t) * t * t + 1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic(t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
    // accelerating from zero velocity 
    easeInQuart(t) { return t * t * t * t },
    // decelerating to zero velocity 
    easeOutQuart(t) { return 1 - (--t) * t * t * t },
    // acceleration until halfway, then deceleration
    easeInOutQuart(t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
    // accelerating from zero velocity
    easeInQuint(t) { return t * t * t * t * t },
    // decelerating to zero velocity
    easeOutQuint(t) { return 1 + (--t) * t * t * t * t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint(t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }

}