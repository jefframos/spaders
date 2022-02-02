class Spring
{
    constructor()
    {
        this.x				 = 0;
        this.ax				 = 0;
        this.dx				 = 0;
        this.tx				 = 0;

        this.max			 = 300;

        this.damp			 = 0.8;// 0.6;
        this.springiness	 = 0.1;
    }

    update()
    {
        // var damp = this.damp;

        //	var springiness = this.springiness;
        //	var max = this.max;

        this.ax = (this.tx - this.x) * this.springiness;

        this.dx += this.ax;
        this.dx *= this.damp;

        if (this.dx < -this.max) this.dx = -this.max;
        else if (this.dx > this.max) this.dx = this.max;

        // Math2.cap(dx, -max, max);

        this.x += this.dx;
    }

    reset()
    {
        this.x = 0;
        this.ax = 0;
        this.dx = 0;
        this.tx = 0;
    }
}

export default Spring;