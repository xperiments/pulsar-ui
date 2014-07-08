/**
 * Sprite9.ts
 * Created by xperiments on 31/03/14.
 */
///<reference path="../../../reference.ts"/>

/**
 *
 *	Sprite9 class. An implementation of the scale9grid from AS3 for use in elements that change his size in runtime
 *
 *	@author		Pedro Casaubon
 *	@version	01.0
 * 	@date       16/04/2014
 * 	@link		http://www.xperiments.es
 *
 */

module pulsar.core.display
{
	import Rectangle 				= PIXI.Rectangle;
	import Point 					= PIXI.Point;
	import Sprite 					= PIXI.Sprite;
	import Texture	 				= PIXI.Texture;
	import BaseTexture 				= PIXI.BaseTexture;
	import CanvasBuffer 			= PIXI.CanvasBuffer;
	import UISkinElement			= pulsar.ui.UISkinElement;
	import ITextureRenderer			= pulsar.core.display.ITextureRenderer;

	export class Sprite9 extends PIXI.DisplayObjectContainer implements ITextureRenderer
	{
		private static ZERO_RECT:Rectangle = new Rectangle(0,0,100,100);

		private _scale9Sprites:Sprite[];
		private _size:PIXI.Point;
		private _scale9Texture:Texture;

		constructor( public frame:string, public scale9Grid:Rectangle = Sprite9.ZERO_RECT )
		{
			super();
			console.log('BBBB',PIXI.Texture.fromFrame(frame) );
			this._scale9Texture = Texture.fromFrame( frame );
			this._scale9Sprites = [];


			// define bitmap source areas
			var rows: number[] = [0, scale9Grid.y,scale9Grid.y+scale9Grid.height, this._scale9Texture.frame.height];
			var cols: number[] = [0, scale9Grid.x,scale9Grid.x+scale9Grid.width, this._scale9Texture.frame.width];

			var origin: Rectangle;
			var textureCount:number = 0;
			for (var cx: number = 0;cx < 3; cx++)
			{
				for (var cy : number = 0 ;cy < 3; cy++)
				{
					origin = new Rectangle(cols[cx]+this._scale9Texture.frame.x, rows[cy]+this._scale9Texture.frame.y, Math.abs( cols[cx + 1] - cols[cx] ), Math.abs( rows[cy + 1] - rows[cy] ) );
					console.log( origin )
					this._scale9Sprites[ textureCount ] = new Sprite( new Texture( this._scale9Texture.baseTexture, origin ) );
					this.addChild(this._scale9Sprites[ textureCount ]);
					textureCount++;
				}
			}

		}

		public setSize( width:number, height:number ):ITextureRenderer
		{

			var draw : Rectangle;
			var origin : Rectangle;
			var textureCount:number = 0;

			var rows : number[] = [0, this.scale9Grid.y, this.scale9Grid.y+this.scale9Grid.height, this._scale9Texture.frame.height];
			var cols : number[] = [0, this.scale9Grid.x, this.scale9Grid.x+this.scale9Grid.width, this._scale9Texture.frame.width];

			var dRows : number[] = [0, this.scale9Grid.y, height - ( (this._scale9Texture.frame.height) - (this.scale9Grid.y+this.scale9Grid.height) ), height];
			var dCols : number[] = [0, this.scale9Grid.x, width - ( (this._scale9Texture.frame.width)  - (this.scale9Grid.x+this.scale9Grid.width ) ), width];

			for (var cx : number = 0;cx < 3; cx++)
			{
				for (var cy : number = 0 ;cy < 3; cy++)
				{
					origin = new Rectangle(cols[cx], rows[cy], Math.abs( cols[cx + 1] - cols[cx] ), Math.abs( rows[cy + 1] - rows[cy] ) );
					draw = new Rectangle(dCols[cx], dRows[cy],  Math.abs( dCols[cx + 1] - dCols[cx] ),  Math.abs( dRows[cy + 1] - dRows[cy] ) );

					console.log( cx,cy,draw )
					this._scale9Sprites[ textureCount ].position.x =  draw.x;
					this._scale9Sprites[ textureCount ].position.y =  draw.y;

					if( !( textureCount == 0 || textureCount == 2 || textureCount == 6 || textureCount == 8) )
					{
						this._scale9Sprites[ textureCount ].scale.x = draw.width/origin.width;
						this._scale9Sprites[ textureCount ].scale.y = draw.height/origin.height;
					}
					textureCount++;
				}
			}
			return this;
		}

		public flatten():Texture
		{
			return this.generateTexture();
		}
	}
}