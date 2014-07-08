
///<reference path="../../../reference.ts" />

module pulsar.core.texture
{
	import Texture					= PIXI.Texture;
	import Rectangle				= PIXI.Rectangle;
	import UISkinElement			= pulsar.ui.UISkinElement;
	import UISkinScaleMode			= pulsar.ui.UISkinScaleMode;
	import Bitmap9					= pulsar.core.display.Bitmap9;


	export class Skin
	{

		static getScale1Texture( skin:UISkinElement ){ return Texture.fromFrame( skin.textureFrame ); }
		static getScale9Texture( skin:UISkinElement , width:number = 100, height:number = 100 ){ return Bitmap9.render( skin , width, height ) }
		static getScale3Texture( skin:UISkinElement ){}

	}

}