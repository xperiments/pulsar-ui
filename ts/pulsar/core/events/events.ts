/**
 * Created by xperiments on 19/03/14.
 */
///<reference path="../../../reference.ts"/>
module pulsar.core.events
{
	export class Event implements PIXI.IEvent
	{
		public static ACTIVATE : string = "activate";
		public static ADDED : string = "added";
		public static ADDED_TO_STAGE : string = "addedToStage";
		public static CANCEL : string = "cancel";
		public static CHANGE : string = "change";
		public static CLEAR : string = "clear";
		public static CLOSE : string = "close";
		public static COMPLETE : string = "complete";
		public static CONNECT : string = "connect";
		public static COPY : string = "copy";
		public static CUT : string = "cut";
		public static DEACTIVATE : string = "deactivate";
		public static ENTER_FRAME : string = "enterFrame";
		public static ERROR : string = "error";
		public static INIT : string = "init";
		public static MOUSE_LEAVE : string = "mouseLeave";
		public static OPEN : string = "open";
		public static PASTE : string = "paste";
		public static REMOVED : string = "removed";
		public static REMOVED_FROM_STAGE : string = "removedFromStage";
		public static RENDER : string = "render";
		public static RESIZE : string = "resize";
		public static SCROLL : string = "scroll";
		public static SELECT : string = "select";
		public static SELECT_ALL : string = "selectAll";
		public static UNLOAD : string = "unload";
		public static FULLSCREEN : string = "fullScreen";

		public target:any;
		constructor(public type:string, public content?:any)
		{
		}
	}
	export class ListenerUtils
	{
		static getDelegate(method:PIXI.IEventListener, context:any):PIXI.IEventListener
		{
			return method.bind(context);
		}
	}

	export interface IEventDispatcher
	{
		addEventListener( type:string, listener:IEventDispatcherListener ):IEventDispatcherListener;
		hasEventListener( type:string, listener:IEventDispatcherListener ):boolean;
		removeEventListener(type:string, listener:IEventDispatcherListener ):IEventDispatcherListener;
		dispatchEvent(event:any)
	}
	export interface IEventDispatcherListener
	{
		( event:Event ):void;
	}
	export class EventDispatcher implements IEventDispatcher
	{
		private _listeners:any;
		addEventListener( type:string, listener:IEventDispatcherListener ):IEventDispatcherListener
		{
			if (this._listeners === undefined) this._listeners = {};
			var listeners = this._listeners;
			if (listeners[ type ] === undefined)
			{
				listeners[ type ] = [];
			}
			if (listeners[ type ].indexOf(listener) === -1)
			{
				listeners[ type ].push(listener);
			}
			return listener;
		}

		hasEventListener( type:string, listener:IEventDispatcherListener ):boolean
		{
			if (this._listeners === undefined) return false;
			var listeners = this._listeners;
			if (listeners[ type ] !== undefined && listeners[ type ].indexOf(listener) !== -1)
			{
				return true;
			}
			return false;
		}

		removeEventListener(type:string, listener:IEventDispatcherListener):IEventDispatcherListener
		{
			if (this._listeners === undefined) return null;
			var listeners = this._listeners;
			var listenerArray = listeners[ type ];
			if (listenerArray !== undefined)
			{
				var index = listenerArray.indexOf(listener);
				if (index !== -1)
				{
					listenerArray.splice(index, 1);
				}
			}
			return listener;
		}

		dispatchEvent(event:any):void
		{
			if (this._listeners === undefined) return;
			var listeners = this._listeners;
			var listenerArray = listeners[ event.type ];
			if (listenerArray !== undefined)
			{
				event.target = this;
				var array = [];
				var length = listenerArray.length;
				for (var i = 0; i < length; i++)
				{
					array[ i ] = listenerArray[ i ];
				}
				for (var i = 0; i < length; i++)
				{
					array[ i ].call(this, event);
				}
			}
		}
	}
}