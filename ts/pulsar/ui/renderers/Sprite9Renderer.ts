/**
 * Sprite9Renderer.ts
 * Created by xperiments on 31/03/14.
 */
///<reference path="../../../reference.ts"/>

module pulsar.ui.renderers
{

	import Texture					= PIXI.Texture;
	import Rectangle				= PIXI.Rectangle;
	import ITextureRenderer			= pulsar.core.display.ITextureRenderer;
	import Sprite9					= pulsar.core.display.Sprite9;


	export class Sprite9Renderer
	{
		cachedRenderers:{ [id:string]:ITextureRenderer; } = {};
		cachedTextures:{ [key:string]:Texture } = {};
		register<T extends ITextureRenderer>( id:string, frame:string ):T
		{
			if( !this.cachedRenderers[ id ] )
			{
				this.cachedRenderers[ id ] = new Sprite9( frame, new Rectangle(20,20,124,38) );
			}
			return <T>this.cachedRenderers[ id ];
		}

		render( id:string, width:number, height:number ):Texture
		{
			if(!this.cachedRenderers[ id ])
			{
				throw "Error no Texture frame: "+id+" pressent";
			}
			var textureKey:string = JSON.stringify({id:id, width:width, height:height});
			if(!this.cachedTextures[ textureKey ] )
			{
				this.cachedTextures[ textureKey ] = this.cachedRenderers[ id ].setSize( width,height ).flatten();
			}
			return this.cachedTextures[ textureKey ];
		}
	}
}
