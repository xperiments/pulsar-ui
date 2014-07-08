/**
 * Created by xperiments on 24/03/14.
 */
///<reference path="../../../reference.ts"/>
module pulsar.utils.display
{
	import DisplayObjectContainer	= PIXI.DisplayObjectContainer;
	import DisplayObject			= PIXI.DisplayObject;
	import MovieClip				= PIXI.MovieClip;
	import Texture					= PIXI.Texture;
	import Sprite					= PIXI.Sprite;
	import Stage					= PIXI.Stage;
	import EventTarget				= PIXI.EventTarget;
	import Graphics					= PIXI.Graphics;

	import Point					= PIXI.Point;
	import Rectangle				= PIXI.Rectangle;


	import EventDispatcher			= pulsar.core.events.EventDispatcher;
	import IEventDispatcher			= pulsar.core.events.IEventDispatcher;
	import IEventDispatcherListener	= pulsar.core.events.IEventDispatcherListener;
	import Event					= pulsar.core.events.Event;
	import Dragabble				= pulsar.core.display.Dragabble;
	import DragabbleEvent			= pulsar.core.display.DragabbleEvent;

	import UIComponent				= pulsar.ui.UIComponent;



	export interface ITransformToolAnchors
	{
		TOP_LEFT:Dragabble;
		TOP_RIGHT:Dragabble;
		BOTTOM_RIGHT:Dragabble;
		BOTTOM_LEFT:Dragabble;
	}
	export class TranformTool extends DisplayObjectContainer
	{
		anchorPoints:ITransformToolAnchors;
		anchorMove:(e:Event)=>void;
		anchorDragStart:(e:Event)=>void;
		anchorDragEnd:(e:Event)=>void;
		target:DisplayObjectContainer;
		shiftKeyPressed:boolean;
		constructor()
		{
			super();
			this.initialize();

		}
		initialize()
		{
			this.anchorPoints = <ITransformToolAnchors>
			{
				TOP_LEFT:this.createAnchor(),
				TOP_RIGHT:this.createAnchor(),
				BOTTOM_RIGHT:this.createAnchor(),
				BOTTOM_LEFT:this.createAnchor()
			};
			Object.keys( this.anchorPoints ).forEach( (key:string)=>{
				this.addChild( this.anchorPoints[key] );
			})

			this.anchorMove = (e:Event)=>this.onAnchorMove(e);
			this.anchorPoints.TOP_LEFT.addEventListener( DragabbleEvent.DRAG_MOVE , this.anchorMove );
			this.anchorPoints.TOP_RIGHT.addEventListener( DragabbleEvent.DRAG_MOVE , this.anchorMove );
			this.anchorPoints.BOTTOM_LEFT.addEventListener( DragabbleEvent.DRAG_MOVE , this.anchorMove );
			this.anchorPoints.BOTTOM_RIGHT.addEventListener( DragabbleEvent.DRAG_MOVE , this.anchorMove );

			this.anchorDragStart = (e:Event)=>this.onAnchorDragStart(e);
			this.anchorPoints.TOP_LEFT.addEventListener( DragabbleEvent.DRAG_START , this.anchorDragStart );
			this.anchorPoints.TOP_RIGHT.addEventListener( DragabbleEvent.DRAG_START , this.anchorDragStart );
			this.anchorPoints.BOTTOM_LEFT.addEventListener( DragabbleEvent.DRAG_START , this.anchorDragStart );
			this.anchorPoints.BOTTOM_RIGHT.addEventListener( DragabbleEvent.DRAG_START , this.anchorDragStart );

			this.anchorDragEnd = (e:Event)=>this.onAnchorDragEnd(e);
			this.anchorPoints.TOP_LEFT.addEventListener( DragabbleEvent.DRAG_END , this.anchorDragEnd );
			this.anchorPoints.TOP_RIGHT.addEventListener( DragabbleEvent.DRAG_END , this.anchorDragEnd );
			this.anchorPoints.BOTTOM_LEFT.addEventListener( DragabbleEvent.DRAG_END , this.anchorDragEnd );
			this.anchorPoints.BOTTOM_RIGHT.addEventListener( DragabbleEvent.DRAG_END , this.anchorDragEnd );

		}
		setTarget( target:DisplayObjectContainer )
		{
			this.target = target;
			this.position = target.position;
			this.anchorPoints.TOP_LEFT.position.x = 0;
			this.anchorPoints.TOP_LEFT.position.y = 0;

			this.anchorPoints.TOP_RIGHT.position.x = this.target.width;
			this.anchorPoints.TOP_RIGHT.position.y = this.target.position.y;

			this.anchorPoints.BOTTOM_LEFT.position.x = 0;
			this.anchorPoints.BOTTOM_LEFT.position.y = this.target.height;

			this.anchorPoints.BOTTOM_RIGHT.position.x = this.target.width;
			this.anchorPoints.BOTTOM_RIGHT.position.y = this.target.height;


		}
		onAnchorDragStart( e:Event )
		{
			console.log('AAAA')
			Mousetrap.bind('shift', ()=>this.onShiftKey(),'keydown' );
			Mousetrap.bind('shift', ()=>this.offShiftKey(),'keyup' );
		}
		onAnchorDragEnd( e:Event )
		{
			Mousetrap.unbind('shift','keydown' );
			Mousetrap.unbind('shift','keyup' );
		}
		onShiftKey()
		{
			console.log('SHIFT')
			this.shiftKeyPressed = true;
		}
		offShiftKey()
		{
			console.log('-SHIFT')
			this.shiftKeyPressed = false;
		}
		onAnchorMove( e:Event )
		{
			switch( e.target )
			{
				case this.anchorPoints.TOP_LEFT:
						this.anchorPoints.TOP_RIGHT.position.y = this.anchorPoints.TOP_LEFT.position.y;
						this.anchorPoints.BOTTOM_LEFT.position.x = this.anchorPoints.TOP_LEFT.position.x;
					break;
				case this.anchorPoints.TOP_RIGHT:
						this.anchorPoints.TOP_LEFT.position.y = this.anchorPoints.TOP_RIGHT.position.y;
						this.anchorPoints.BOTTOM_RIGHT.position.x = this.anchorPoints.TOP_RIGHT.position.x;
					break;
				case this.anchorPoints.BOTTOM_LEFT:
						this.anchorPoints.TOP_LEFT.position.x = this.anchorPoints.BOTTOM_LEFT.position.x;
						this.anchorPoints.BOTTOM_RIGHT.position.y = this.anchorPoints.BOTTOM_LEFT.position.y;
					break;
				case this.anchorPoints.BOTTOM_RIGHT:
						this.anchorPoints.TOP_RIGHT.position.x = this.anchorPoints.BOTTOM_RIGHT.position.x;
						this.anchorPoints.BOTTOM_LEFT.position.y = this.anchorPoints.BOTTOM_RIGHT.position.y;
					break;
			}

			this.target && (<any>this.target).setSize( this.anchorPoints.BOTTOM_RIGHT.position.x,this.anchorPoints.BOTTOM_RIGHT.position.y)


		}
		createAnchor():Dragabble
		{
			var dragableAnchor:Dragabble = new Dragabble();
			var g:Graphics = new Graphics();
				g.interactive = true;
				g.buttonMode = true;
				g.beginFill(0xFF0000);
				g.drawRect(0,0,10,10);
				g.hitArea = new Rectangle( 0,0,10,10);
			dragableAnchor.addChild(g);
			return dragableAnchor;
		}

	}
}