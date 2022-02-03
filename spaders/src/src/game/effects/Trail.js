import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';

export default class Trail
{
    constructor(trailContainer, points = 30, texture = './assets/images/trail1.jpg')
    {
        this.trailPoints = [];
        this.nextPointTimer = 0;

        this.trailContainer = trailContainer;
        this.polygon = new PIXI.Graphics();
        this.trailContainer.addChild(this.polygon);
        this.polyMesh = [];

        this.totalPoints = points;

        this.polyVerts = new Float32Array(this.totalPoints * 2);
        this.polyUvs = new Float32Array(this.totalPoints * 2);
        this.polyIndicies = new Uint16Array(this.totalPoints);

        for (let i = 0; i < this.totalPoints; i++)
        {
            this.polyUvs[i * 2] = 0.5;
            this.polyUvs[(i * 2) + 1] = 1 * (1 - (i % 2));
        }

        for (let i = 0; i < this.polyIndicies.length; i++)
        {
            this.polyIndicies[i] = i;
        }

        this.mesh = new PIXI.mesh.Mesh(PIXI.Texture.from(texture), this.polyVerts, this.polyUvs, this.polyIndicies, PIXI.DRAW_MODES.TRIANGLE_STRIP);
        this.trailContainer.addChild(this.mesh);

        this.trailTickDistance = 5;
        this.trailTick = 15;
        this.speed = 0.08;
        this.frequency = 0.01;

        this.firstIteraction = true;

        this.trailDots = [];

        this.meshPoint = { x: 0, y: 0 };

        for (let i = 0; i < this.totalPoints; i++)
        {
            const tPoint = new PIXI.Container();
            const gr = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0, 0, this.trailTick / 2);
            const gr2 = new PIXI.Graphics().beginFill(0x000000).drawCircle(0, -this.trailTick / 2, 2);

            tPoint.addChild(gr);
            tPoint.addChild(gr2);
            tPoint.alpha = 0.2;
            tPoint.scale.set(0);
            this.trailDots.push(tPoint);
        }

        this.killed = true;
    }

    changeTexture(texture)
    {
        this.mesh.texture = texture;
    }
    scaleSort(a, b)
    {
        const yA = a.scale.x;
        const yB = b.scale.x;

        if (yA < yB)
        {
            return -1;
        }
        if (yA > yB)
        {
            return 1;
        }

        return 0;
    }
    drawPointsTexture()
    {
        this.trailMesh = [];
        this.polyMesh = [];

        let sin = 0;
        let cos = 0;
        let rod = 0;

        for (let i = this.trailDots.length - 2; i >= 0; i--)
        {
            const point = this.trailDots[i];
            const nextPoint = this.trailDots[i + 1];

            rod = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
            sin = Math.sin(rod);
            cos = Math.cos(rod);

            this.meshPoint.x = point.x - (point.scale.x * this.trailTick) * sin;
            this.meshPoint.y = point.y + (point.scale.x * this.trailTick) * cos;
            // const meshPoint = { x: point.x - (point.scale.x * this.trailTick) * sin, y: point.y + (point.scale.x * this.trailTick) * cos };

            this.trailMesh.push({ x: point.x - (point.scale.x * this.trailTick) * sin, y: point.y + (point.scale.x * this.trailTick) * cos });
            this.trailMesh.push({ x: point.x - (point.scale.x * this.trailTick) * -sin, y: point.y + (point.scale.x * this.trailTick) * -cos });
        }

        for (let i = 0; i < this.trailMesh.length; i++)
        {
            this.polyMesh.push(this.trailMesh[i].x);
            this.polyMesh.push(this.trailMesh[i].y);
            this.polyVerts[(i * 2)] = (this.trailMesh[i].x);
            this.polyVerts[(i * 2) + 1] = (this.trailMesh[i].y);
        }

        // this.polygon.clear();
        // this.polygon.lineStyle(1,0);
        // this.polygon.drawPolygon(this.polyMesh);
        // this.polygon.endFill();
        // this.trailContainer.addChild(this.polygon);
    }

    drawPoints()
    {
        this.trailGraphic.clear();
        if (this.trailPoints.length < 5)
        {
            return;
        }

        this.trailMesh = [];
        this.trailGraphic.beginFill(0xffffff);
        this.trailGraphic.alpha = 0.2;
        this.trailGraphic.lineStyle(1, 0);
        this.trailGraphic.blendMode = PIXI.BLEND_MODES.ADD;
        const lastPoint = this.trailPoints[this.trailPoints.length - 1];
        // let firstPoint = this.trailPoints[0];
        let sin = 0;
        let cos = 0;

        let rod = 0;

        const extraAngle = -3.14 / 4;

        for (let i = 0; i < this.trailPoints.length - 1; i++)
        {
            // rod = point.rotatio

            const point = this.trailPoints[i];
            // if(point.scale.x > 0){
            const nextPoint = this.trailPoints[i + 1];

            rod = (Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) + extraAngle);//  * 180 / 3.14;
            sin = Math.sin(rod);
            cos = Math.cos(rod);
            this.trailMesh.push({ x: point.x - (point.scale.x * this.trailTick) * sin, y: point.y + (point.scale.x * this.trailTick) * cos });
            // }
        }

        let flag1 = true;

        for (let i = this.trailPoints.length - 1; i >= 1; i--)
        {
            // rod = point.rotatio
            const point = this.trailPoints[i];
            // if(point.scale.x > 0){
            const nextPoint = this.trailPoints[i - 1];

            rod = (Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) + extraAngle - 3.14);// * 180 / 3.14;
            sin = Math.sin(rod);
            cos = Math.cos(rod);

            this.meshPoint.x = point.x + (point.scale.x * this.trailTick) * sin;
            this.meshPoint.y = point.y - (point.scale.x * this.trailTick) * cos;

            if (flag1)
            {
                const last = this.trailMesh[this.trailMesh.length - 1];
                const next = meshPoint;
                const midleAngle = -Math.atan2(next.y - last.y, next.x - last.x);
                const dist = this.distance(next.x, next.y, last.x, last.y) / 2;
                const middleMeshPoint = {
                    x: point.x + Math.sin(midleAngle) * dist,
                    y: point.y + Math.cos(midleAngle) * dist,
                };

                this.trailMesh.push(middleMeshPoint);
                flag1 = false;
            }
            this.trailMesh.push(meshPoint);
            // }
        }

        this.trailGraphic.moveTo(this.trailMesh[i].x, this.trailMesh[i].y);
        for (let i = 0; i < this.trailMesh.length - 1; i++)
        {
            this.trailGraphic.lineTo(this.trailMesh[i].x, this.trailMesh[i].y);
        }
        // this.trailGraphic.lineTo(this.trailMesh[this.trailMesh.length-1].x + (this.trailMesh[this.trailMesh.length-1].x - lastPoint.x) / 2,
        // 	this.trailMesh[this.trailMesh.length-1].y - lastPoint.y + (this.trailMesh[this.trailMesh.length-1].y - lastPoint.y) / 2);
    }
    updatePoint(pos)
    {
        if (this.firstIteraction)
        {
            for (let i = 0; i < this.trailDots.length; i++)
            {
                this.trailDots[i].x = pos.x;
                this.trailDots[i].y = pos.y;
            }
            this.firstIteraction = false;
        }

        if (this.trailDots.length)
        {
            const firstPoint = this.trailDots[this.trailDots.length - 2];

            if (this.distance(firstPoint.x, firstPoint.y, pos.x, pos.y) < this.trailTickDistance)
            {
                this.nextPointTimer = this.frequency;

                return;
            }
        }

        const dot = this.trailDots[0];

        this.trailDots.splice(0, 1);
        dot.x = pos.x;
        dot.y = pos.y;
        this.trailDots.push(dot);

        dot.scale.set(1);
        // TweenLite.to(dot.scale, 0.1, { x: 1, y: 1 });
        this.nextPointTimer = this.frequency;
    }
    distance(x1, y1, x2, y2)
    {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    build()
    {

    }

    reset(pos = null)
    {
        for (let i = this.trailDots.length - 1; i >= 0; i--)
        {
            this.trailDots[i].scale.set(0);
            if (pos)
            {
                this.trailDots[i].x = pos.x;
                this.trailDots[i].y = pos.y;
            }
            else
            {
                this.trailDots[i].x = this.trailDots[0].x;
                this.trailDots[i].y = this.trailDots[0].y;
            }
        }
        // this.trailDots = [];

        // for (var i = 0; i < this.totalPoints; i++) {
        // 	let tPoint = new PIXI.Container();
        // 	let gr = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0,0,this.trailTick/2);
        // 	let gr2 = new PIXI.Graphics().beginFill(0x000000).drawCircle(0,-this.trailTick/2,2);
        // 	tPoint.addChild(gr)
        // 	tPoint.addChild(gr2)
        // 	tPoint.alpha = 0.2
        // 	tPoint.scale.set(0)
        // 	this.trailDots.push(tPoint);
        // }
        this.nextPointTimer = 0;
        this.drawPointsTexture();
    }

    update(delta, pos)
    {
        this.nextPointTimer -= delta;

        let zeroScale = true;

        for (let i = this.trailDots.length - 1; i >= 0; i--)
        {
            this.trailDots[i].scale.x -= this.speed;// delta * this.speed;
            this.trailDots[i].scale.y -= this.speed;// delta * this.speed;

            if (this.trailDots[i].scale.x <= 0)
            {
                this.trailDots[i].scale.set(0);
            }
            else
            {
                zeroScale = false;
            }
        }

        this.killed = zeroScale;

        if (this.nextPointTimer <= 0 && pos)
        {
            this.updatePoint(pos);
        }
        this.drawPointsTexture();
    }
}