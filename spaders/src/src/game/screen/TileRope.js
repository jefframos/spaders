import * as PIXI from 'pixi.js';

export default class TileRope extends PIXI.mesh.Rope{	
	constructor(texture, points, tolerance){
		super(texture, points, tolerance);

        if (tolerance === void 0) { tolerance = 7; }
        this.tolerance = tolerance;
        //_scale = 0.8;
        this._scale = 1;
        this.closed = false;

        this.points = points;
    }
    clearMesh (points, total) {
        if (points === void 0) { points = []; }
        if (total === void 0) { total = points.length; }
        this.vertices = new Float32Array(total * 4);
        this.colors = new Float32Array(total * 2);
        this.indices = new Uint16Array(total * 2);
        this.uvs = new Float32Array(total * 4);
        this.points = points;
    }
    render() {
        this.vertices = new Float32Array(this.points.length * 4);
        this.uvs = new Float32Array(this.points.length * 4);
        this.colors = new Float32Array(this.points.length * 2);
        this.indices = new Uint16Array(this.points.length * 2);
        this.refresh();
    }
    updateTransform() {
        var points = this.points;
        if (points.length < 1) {
            return;
        }
        var lastPoint = points[0];
        var nextPoint;
        var perpX = 0;
        var perpY = 0;
        var vertices = this.vertices;
        var total = points.length, point, index, ratio, perpLength, num;
        var closed = (this.closed && total > 3);
        if (closed)
            lastPoint = points[total - 2];
        for (var i = 0; i < total; i++) {
            point = points[i];
            index = i * 4;
            if (i < points.length - 1) {
                nextPoint = points[i + 1];
            }
            else {
                if (closed)
                    nextPoint = points[1];
                else
                    nextPoint = point;
            }
            perpY = -(nextPoint.x - lastPoint.x);
            perpX = nextPoint.y - lastPoint.y;
            ratio = (1 - (i / (total - 1))) * 10;
            if (ratio > 1) {
                ratio = 1;
            }
            perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
            num = this._texture.height / 2 * this._scale;
            perpX /= perpLength;
            perpY /= perpLength;
            perpX *= num;
            perpY *= num;
            vertices[index + 0] = point.x + perpX;
            vertices[index + 1] = point.y + perpY;
            vertices[index + 2] = point.x - perpX;
            vertices[index + 3] = point.y - perpY;
            lastPoint = point;
        }
        this.containerUpdateTransform();
    }
    refresh() {
        var points = this.points;
        if (points.length < 1 || !this._texture._uvs) {
            return;
        }
        var uvs = this.uvs;
        var indices = this.indices;
        var colors = this.colors;
        //texturewidth
        var textureWidth = this._texture.width;
        uvs[0] = 0;
        uvs[1] = 0;
        uvs[2] = 0;
        uvs[3] = 1;
        colors[0] = 1;
        colors[1] = 1;
        indices[0] = 0;
        indices[1] = 1;
        var total = points.length, point, index, amount;
        var xOffset = 0;
        var prevPoint = points[0];
        for (var i = 1; i < total; i++) {
            point = points[i];
            index = i * 4;
            amount = i / (total - 1);
            var distx = points[i - 1].x - points[i].x;
            var disty = points[i - 1].y - points[i].y;
            var dist = Math.sqrt(distx * distx + disty * disty);
            var factor = dist / textureWidth / this._scale;
            xOffset += factor;
            uvs[index] = xOffset;
            uvs[index + 1] = 0;
            uvs[index + 2] = xOffset;
            uvs[index + 3] = 1;
            index = i * 2;
            colors[index] = 1;
            colors[index + 1] = 1;
            index = i * 2;
            indices[index] = index;
            indices[index + 1] = index + 1;
        }
        this.dirty = true;
    }
}