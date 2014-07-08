/**
 * TextField.ts
 * Created by xperiments on 25/03/14.
 */
///<reference path="../../reference.ts"/>
module pulsar.ui
{
	import ITextStyle				= PIXI.ITextStyle;

	export class TextField extends PIXI.Text
	{
		constructor( public label:string = "", public textFormat:ITextStyle = UIComponent.defaultTextFormat )
		{
			super( label , textFormat );
		}
	}

}