/**
 * display.ts
 * Created by xperiments on 01/04/14.
 */
///<reference path="../../../reference.ts"/>

module pulsar.core.display
{
	export interface ITextureRenderer extends PIXI.DisplayObject
	{
		frame:string;
		setSize( width:number, height:number ):ITextureRenderer;
		flatten( ):PIXI.Texture;
	}
}