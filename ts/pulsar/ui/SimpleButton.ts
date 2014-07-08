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

	import Skin						= pulsar.core.texture.Skin;
	import UISkinDefinition			= pulsar.ui.UISkinDefinition;
	import UISkinScaleMode			= pulsar.ui.UISkinScaleMode;
	import Bitmap9					= pulsar.core.display.Bitmap9;



	export enum SimpleButtonFrames
	{
		up,
		down,
		over,
		out
	}
	export class SimpleButton extends UIComponent
	{

		public static DEFAULT_SKIN:UISkinDefinition =
		{
			"up"   :{ textureFrame:"simple-button-up.png" }
			,"over" :{ textureFrame:"simple-button-over.png" }
			,"down" :{ textureFrame:"simple-button-down.png" }

		};

		public textures:{ [name:string]:Texture } = { };

		private _text:string;
		private _textAlign:UIHorizontalAlign;
		private _background:Sprite;
		private _label:TextField;
		private _labelAlign:UIHorizontalAlign;
		private _skinData:UISkinDefinition;
		private _currentFrame:SimpleButtonFrames = SimpleButtonFrames.up;

		constructor( label:string ="Button", width:number = 100, height:number = 35, textAlign:UIHorizontalAlign = UIHorizontalAlign.LEFT, skin:UISkinDefinition = SimpleButton.DEFAULT_SKIN )
		{
			super();
			this.width = width;
			this.height = height;
			this._text = label;
			this._textAlign = textAlign;
			this._skinData = skin;
			this._initUI();

		}


		/* PUBLICS */

		public set text( label:string )
		{
			this._label.setStyle( ( this._skinData[ this._currentFrame ] && this._skinData[ this._currentFrame ].style && this._label.setStyle( this._skinData[ this._currentFrame ].style ) ) || UIComponent.defaultTextFormat )
			this._label.setText( label );
			this._text = label;
			this._label.position.y = (this.getBounds().height/2)-(this._label.getLocalBounds().height/2);
		}
		public set textAlign( align:UIHorizontalAlign )
		{
			this._labelAlign = align;
			switch( align )
			{
				case UIHorizontalAlign.CENTER:
					this._label.position.x = this.getLocalBounds().width/2-this._label.getLocalBounds().width/2;
					this.text = this._text;
					break;
				case UIHorizontalAlign.RIGHT:
					this._label.position.x = this.getLocalBounds().width-this._label.getLocalBounds().width;
					break;

			}
		}
		public setSize( width:number, height:number ):void
		{
			console.log(width,height)
			this.width = width;
			this.height = height;
			this._updateTextures();
		}

		/* PRIVATES */
		private _initUI()
		{

			this._mapTextures( false );

			this._background = new Sprite( this.textures['up'] );

			this.addChild( this._background );
			this.interactive = true;
			this.buttonMode = true;
			this.touchstart = this.mousedown = this._onMouseDown.bind(this);
			this.touchend = this.mouseup = this.mouseupoutside = this._onMouseUp.bind(this);

			this._label = new TextField( this._text  );
			this.text = this._text;
			this.textAlign = this._textAlign;
			this.addChild( this._label );
		}

		private _updateTextures()
		{
			var texture:Texture;
			Object.keys( this._skinData )
				.map( (key:string)=>
				{
					if( this._skinData[key].scaleMode == UISkinScaleMode.SCALE9 )
					{
						this.textures[ key ].destroy(true);
						texture = Texture.fromCanvas( Bitmap9.render( this._skinData[key] , this.width, this.height ).canvas );
						this.textures[ key ] = texture;
					}
				});
			this._setButtonFrame( SimpleButtonFrames.up );
		}
		private _mapTextures( update:boolean )
		{
			var texture:Texture;
			Object.keys( this._skinData )
				.map( (key:string)=>
				{
					texture = Texture.fromFrame( this._skinData[key].textureFrame );
					if( this._skinData[key].scaleMode == UISkinScaleMode.SCALE9 )
					{
						texture = Texture.fromCanvas( Bitmap9.render( this._skinData[key] , this.width, this.height ).canvas );
					}
					this.textures[ key ] = texture;
				});

		}
		private _setButtonFrame( frame:SimpleButtonFrames ):void
		{
			switch( frame )
			{
				case SimpleButtonFrames.down:
					this._background.setTexture( this.textures['down'] );
					this.dispatchEvent({type:'mousedown'});
					break;

				case SimpleButtonFrames.up:
					this._background.setTexture( this.textures['up'] );
					this.dispatchEvent({type:'mouseup'});
					break;
			}
			this.text = this._text;
		}
		private _onMouseDown(){ this._setButtonFrame( SimpleButtonFrames.down ) }
		private _onMouseUp(){ this._setButtonFrame( SimpleButtonFrames.up ) }

	}
}