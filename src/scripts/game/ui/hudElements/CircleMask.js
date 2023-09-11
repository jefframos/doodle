
/**
*
*   Simple App to get a pixi stage up and running..
*
*/

import * as PIXI from 'pixi.js';

class CircleMask extends PIXI.Graphics
{
    constructor(){
        super();

        this.thickness = 10;
        this.startRads = 0;
        this.endRads = Math.PI;
        this.xRadius = 100;
        this.yRadius = 100;
        this._ratio = 0;

        this.redraw();
    }

    redraw()
	{
        this.clear();
        this.beginFill(0xFF0000);

        var segs = 8;
        var angleSize = ( Math.PI * 2 ) / segs;

        var fullSegsRequired = Math.ceil(this._ratio * 8);

        this.moveTo(0, 0);

        for (var i = 0; i < fullSegsRequired; i++) {

            var angle = i * angleSize;
            this.lineTo(Math.sin(angle) * -100, Math.cos(angle)  *-100);

        }

        angle = this._ratio * Math.PI * 2;
        this.lineTo(Math.sin(angle) * -100, Math.cos(angle)  *-100);

        this.endFill();
    }

    set ratio(value){
        this._ratio = value;

        if(this._ratio > 1)this._ratio = 1;
        else if(this._ratio < 0)this._ratio = 0;

		// redraw..
        this.redraw();

    }

    get ratio(){
        return this._ratio;
    }

}


export default CircleMask;
