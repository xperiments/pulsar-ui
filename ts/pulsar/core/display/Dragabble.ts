/**
 * Created by xperiments on 24/03/14.
 */
///<reference path="../../../reference.ts"/>
module pulsar.core.display
{
	import DisplayObjectContainer	= PIXI.DisplayObjectContainer;
	import Graphics					= PIXI.Graphics;

	import EventDispatcher			= pulsar.core.events.EventDispatcher;
	import IEventDispatcher			= pulsar.core.events.IEventDispatcher;
	import IEventDispatcherListener	= pulsar.core.events.IEventDispatcherListener;
	import StaticEvent				= pulsar.core.events.StaticEvent;
	import Event					= pulsar.core.events.Event;

	export class DragabbleEvent
	{
		static DRAG_START:string = null;
		static DRAG_END:string = null;
		static DRAG_MOVE:string = null;
	}
	export module DragabbleEvent {
		StaticEvent.init(DragabbleEvent);
	}

	export class Dragabble extends DisplayObjectContainer implements IEventDispatcher
	{
		private _isDragging:Boolean = false;
		private _canDrag:Boolean = false;
		private _dragEventData:PIXI.InteractionData;

		static DRAG_START:string = "pulsar.core.display";
		constructor()
		{
			super();
			this.interactive = true;
			this.buttonMode = true;

		}
		mousedown = ( event:PIXI.InteractionData )=>
		{
			event.originalEvent.preventDefault();
			this._dragEventData = event;
			this._isDragging = true;
			this.dispatchEvent( new Event( DragabbleEvent.DRAG_START ) );

		};
		touchstart = this.mousedown;

		mouseup = ( event:PIXI.InteractionData )=>
		{
			this._dragEventData = null;
			this._isDragging = false;
			;this.dispatchEvent( new Event( DragabbleEvent.DRAG_END ) );
		}
		mouseupoutside = this.mouseup;
		touchend = this.mouseup;
		touchendoutside = this.mouseup;

		mousemove = ( event:PIXI.InteractionData )=>
		{
			if(this._isDragging)
			{
				var newPosition = this._dragEventData.getLocalPosition(this.parent);
					this.position.x = newPosition.x;
					this.position.y = newPosition.y;
				this.dispatchEvent( new Event( DragabbleEvent.DRAG_MOVE, this.position ) );
			}
		};
		touchmove = this.mousemove;

		// EventTarget mixing
		public addEventListener:( type:string, listener:IEventDispatcherListener )=>IEventDispatcherListener;
		public hasEventListener:( type:string, listener:IEventDispatcherListener )=>boolean;
		public removeEventListener:(type:string, listener:IEventDispatcherListener )=>IEventDispatcherListener;
		public dispatchEvent:(event:any)=>void;

	}
	pulsar.utils.applyMixins( Dragabble,[ EventDispatcher ]);
}