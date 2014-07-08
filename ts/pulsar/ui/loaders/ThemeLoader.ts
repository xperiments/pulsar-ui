/**
 * SkinLoader.ts
 * Created by xperiments on 01/04/14.
 */
///<reference path="../../../reference.ts"/>



module pulsar.ui.loaders
{
	export class ThemeLoader extends PIXI.SpriteSheetLoader
	{
		private static _skinDict:{ [name:string]:ThemeLoader } = {};
		public static get( skinName:string ):ThemeLoader
		{
			return ThemeLoader._skinDict[ skinName ] || null;
		}
		constructor( public skinName:string, url:string, crossorigin?:boolean)
		{
			super ( url, crossorigin );
			ThemeLoader._skinDict[ skinName ] = this;
			this.addEventListener('loaded', ( event:PIXI.IEvent)=>{
				console.log( event.content )
				event.type = "ready";
				pulsar.utils.setZeroTimeout(()=>{this.dispatchEvent(event);});
			})
		}

	}
}
