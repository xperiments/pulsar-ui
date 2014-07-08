/**
 * ui.ts
 * Created by xperiments on 25/03/14.
 */
///<reference path="../../reference.ts"/>



module pulsar.ui
{
	import Rectangle				= PIXI.Rectangle;
	import ITextStyle				= PIXI.ITextStyle;

	export enum UIHorizontalAlign
	{
		LEFT,
		CENTER,
		RIGHT
	}

	export enum UISkinScaleMode
	{
		DEFAULT,
		SCALE3,
		SCALE9
	}

	export interface UISkinElement
	{
		textureFrame:string;
		scaleMode?:UISkinScaleMode;
		scaleGrid?:Rectangle;
		style?:ITextStyle;
	}

	export interface UISkinDefinition
	{
		[ keyName:string ]:UISkinElement; // keyname => Texture frameId
	}

}

