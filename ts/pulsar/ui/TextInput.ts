/**
 * TextInput.ts
 * Created by xperiments on 25/03/14.
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

	export class TextInput extends UIComponent
	{
		public static DOM_INPUT:HTMLInputElement;

		public static createDOMInputContainer()
		{
			var input = document.createElement("input");
			input.type = "text";
			input.style.opacity = "1";
			input.style.position = "absolute";
			input.style.top = "0";
			input.style.left = "0";
			input.style.width = input.style.height = "0px";
			document.body.appendChild( input );
			TextInput.DOM_INPUT = input;
		}

		private backgroundTexture:PIXI.RenderTexture;
		private background:PIXI.Sprite;
		private textfield:TextField;
		constructor()
		{
			super();
			var renderTexture = new PIXI.RenderTexture(150,30);

			var btnGfx = new PIXI.Graphics();
			btnGfx.beginFill(0xFF0000);
			btnGfx.drawRect(0,0,150,30);
			btnGfx.endFill();
			renderTexture.render( btnGfx, <Point>{x:0,y:0}, false );
			this.background = new PIXI.Sprite( renderTexture );

			this.background.interactive = true;
			this.background.buttonMode = true;

			this.textfield = new TextField("Input1");

			this.addChild(this.background);
			this.addChild(this.textfield);


			this.background.mousedown = this.background.touchstart = ()=>{this.focus()}

		}
		focus()
		{
			this.textfield.setText("");
			TextInput.DOM_INPUT && TextInput.DOM_INPUT.focus();
		}
		blur()
		{
			TextInput.DOM_INPUT && TextInput.DOM_INPUT.blur();
		}
	}
}