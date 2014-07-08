/**
 * Theme.ts
 * Created by xperiments on 02/04/14.
 */
///<reference path="../../../reference.ts"/>
module pulsar.ui.themes
{
	import SpriteSheetLoader = PIXI.SpriteSheetLoader;
	import setZeroTimeout = pulsar.utils.setZeroTimeout;
	import EventDispatcher			= pulsar.core.events.EventDispatcher;
	import IEventDispatcher			= pulsar.core.events.IEventDispatcher;
	import IEventDispatcherListener	= pulsar.core.events.IEventDispatcherListener;


	export class Theme implements IEventDispatcher
	{

		private _loader:SpriteSheetLoader;
		public url:string;
		public crossOrigin:boolean = false;
		constructor(){
			this._loader = new SpriteSheetLoader( this.url, this.crossOrigin );
			this._loader.addEventListener( Theme.LOAD, ( event:PIXI.IEvent)=>{
				event.type = Theme.READY;
				setZeroTimeout(()=>{this.dispatchEvent(event);});
			})
		}
		public load(){}
		public onLoaded(){}

		// EventTarget mixing
		public addEventListener:( type:string, listener:IEventDispatcherListener )=>IEventDispatcherListener;
		public hasEventListener:( type:string, listener:IEventDispatcherListener )=>boolean;
		public removeEventListener:(type:string, listener:IEventDispatcherListener )=>IEventDispatcherListener;
		public dispatchEvent:(event:any)=>void;

	}
	pulsar.utils.applyMixins( UIComponent,[ EventDispatcher ]);
	export module Theme
	{
		var _skinDict:{ [name:string]:Theme } = {};
		export function get( skinName:string ):Theme
		{
			return _skinDict[ skinName ] || null;
		}
		export function set( skinName:string, theme:Theme ):void
		{
			_skinDict[ skinName ] = theme;
		}
		export var LOAD:string = "load";
		export var READY:string = "ready";
	}

}
