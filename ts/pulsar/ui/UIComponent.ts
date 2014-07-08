/**
 * Created by xperiments on 24/03/14.
 */
///<reference path="../../reference.ts"/>

module pulsar.ui
{
	import DisplayObjectContainer	= PIXI.DisplayObjectContainer;
	import DisplayObject			= PIXI.DisplayObject;
	import MovieClip				= PIXI.MovieClip;
	import Texture					= PIXI.Texture;
	import Sprite					= PIXI.Sprite;
	import Stage					= PIXI.Stage;
	import EventTarget				= PIXI.EventTarget;

	import Point					= PIXI.Point;
	import Rectangle				= PIXI.Rectangle;

	import ITextStyle				= PIXI.ITextStyle;
	import IEventListener			= PIXI.IEventListener;
	import IEvent					= PIXI.IEvent;

	import EventDispatcher			= pulsar.core.events.EventDispatcher;
	import IEventDispatcher			= pulsar.core.events.IEventDispatcher;
	import IEventDispatcherListener	= pulsar.core.events.IEventDispatcherListener;


	export interface IUIComponent extends DisplayObjectContainer, IEventDispatcher
	{
		uid:string;
		setSize( width:number, height:number ):void;
	}

	export class UIComponent extends DisplayObjectContainer implements IUIComponent, IEventDispatcher
	{
		private static UID:number = 0;
		public static getUID():string{ return (UIComponent.UID++).toString(16) }
		public static defaultTextFormat:ITextStyle =
		{
			font:"bold 20px Arial"
			,fill:"#FF00FF"
		};

		public uid:string;




		constructor()
		{
			super();
			this.uid = UIComponent.getUID();
		}

		public setSize( width:number, height:number ):void
		{

		}
		// EventTarget mixing
		public addEventListener:( type:string, listener:IEventDispatcherListener )=>IEventDispatcherListener;
		public hasEventListener:( type:string, listener:IEventDispatcherListener )=>boolean;
		public removeEventListener:(type:string, listener:IEventDispatcherListener )=>IEventDispatcherListener;
		public dispatchEvent:(event:any)=>void;

	}
	pulsar.utils.applyMixins( UIComponent,[ EventDispatcher ]);
}