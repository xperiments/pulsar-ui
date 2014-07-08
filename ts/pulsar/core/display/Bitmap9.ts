/**
 *
 *	Bitmap9 class. An implementation of the scale9grid from AS3
 *
 *	@author		Pedro Casaubon
 *	@version	01.0
 * 	@date       16/04/2014
 * 	@link		http://www.xperiments.es
 *
 */


interface CanvasRenderingContext2D {
	drawImage(image: HTMLCanvasElement, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number): void;
	drawImage(image: HTMLVideoElement, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number): void;

}
///<reference path="../../../reference.ts"/>
module pulsar.core.display
{
	import Rectangle 				= PIXI.Rectangle;
	import Texture	 				= PIXI.Texture;
	import BaseTexture 				= PIXI.BaseTexture;
	import CanvasBuffer 			= PIXI.CanvasBuffer;
	import UISkinElement			= pulsar.ui.UISkinElement;

	export class Bitmap9
	{

		/**
		 * Renders an image from a scale9 base texture
		 * @param texture The original scale9 texture
		 * @param scale9Grid  Rectangle representing the scale9 corners
		 * @param width Width of the resulting scaled image
		 * @param height Height of the resulting scaled image
		 * @returns {HTMLImageElement}
		 */

		public static render( skin:UISkinElement, width:number, height:number ):CanvasBuffer
		{
			var texture = Texture.fromFrame( skin.textureFrame );
			var scale9Grid = skin.scaleGrid;
			var canvas = new CanvasBuffer( width, height );
			// define bitmap source areas
			var rows : number[] = [0, scale9Grid.y, scale9Grid.y+scale9Grid.height, texture.frame.height];
			var cols : number[] = [0, scale9Grid.x, scale9Grid.x+scale9Grid.width, texture.frame.width];

			// define bitmap destination areas
			var dRows : number[] = [0, scale9Grid.y, height - ( texture.frame.height - (scale9Grid.y+scale9Grid.height) ), height];
			var dCols : number[] = [0, scale9Grid.x, width - ( texture.frame.width - (scale9Grid.x+scale9Grid.width) ), width];

			// rectangle containing current origin area
			var origin : Rectangle = new Rectangle(0,0,0,0);

			// rectangle containing current destination area
			var draw : Rectangle = new Rectangle(0,0,0,0);

			for (var cy : number = 0;cy < 3; cy++)
			{
				for (var cx : number = 0 ;cx < 3; cx++)
				{
					// compute current origin and draw area Rectangles
					// origin = new Rectangle(cols[cx], rows[cy], cols[cx + 1] - cols[cx], rows[cy + 1] - rows[cy]);
					origin.x = cols[cx]+texture.frame.x;
					origin.y = rows[cy]+texture.frame.y;
					origin.width = cols[cx + 1] - cols[cx];
					origin.height = rows[cy + 1] - rows[cy];

					draw.x = dCols[cx];
					draw.y = dRows[cy];
					draw.width = dCols[cx + 1] - dCols[cx];
					draw.height = dRows[cy + 1] - dRows[cy];

					// draw the image portion
					canvas.context.drawImage( texture.baseTexture.source, origin.x, origin.y, origin.width, origin.height, draw.x, draw.y, draw.width, draw.height );
				}
			}
			return canvas;

		}
	}
}
