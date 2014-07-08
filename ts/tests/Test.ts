/**
 * Created by xperiments on 18/03/14.
 */
///<reference path="../reference.ts"/>

import DisplayObjectContainer	= PIXI.DisplayObjectContainer;
import DisplayObject			= PIXI.DisplayObject;
import MovieClip				= PIXI.MovieClip;
import Texture					= PIXI.Texture;
import Sprite					= PIXI.Sprite;
import Stage					= PIXI.Stage;

import Point					= PIXI.Point;
import Rectangle				= PIXI.Rectangle;
import Sprite9					= pulsar.core.display.Sprite9;
import UISkinScaleMode			= pulsar.ui.UISkinScaleMode;
import Sprite9Renderer			= pulsar.ui.renderers.Sprite9Renderer;
import TranformTool				= pulsar.utils.display.TranformTool;


var stage
var renderer
var evntDownBind;
var evntupBind;
var button;
var button1;
var button2;


var textInput;
window.onload =()=>
{

	stage = new pulsar.core.display.Stage( 0x0FFFF0, true );
	renderer = PIXI.autoDetectRenderer(800,600);

    document.body.appendChild( renderer.view );
    renderer.render( stage );

	var l = new pulsar.ui.loaders.ThemeLoader("pulsar.ui.default","resources/ui.json", true );
	l.addEventListener("ready",(event:PIXI.IEvent)=>{
		console.log('====',event.type , event.content.json )
		button = new pulsar.ui.SimpleButton("Demo", 100, 78, pulsar.ui.UIHorizontalAlign.LEFT, {
			"up"   :{
				textureFrame:"simple-button-up.png",
				scaleMode:UISkinScaleMode.SCALE9,
				scaleGrid:new PIXI.Rectangle(10,10,134,58)
			}
			,"over" :{
				textureFrame:"simple-button-over.png",
				scaleMode:UISkinScaleMode.SCALE9,
				scaleGrid:new PIXI.Rectangle(10,10,134,58)
			}
			,"down" :{
				textureFrame:"simple-button-down.png",
				scaleMode:UISkinScaleMode.SCALE9,
				scaleGrid:new PIXI.Rectangle(10,10,134,58),
				style:{ font:'30px Arial', fill:'#FFFFFF'}
			}

		});
		evntDownBind = button.addEventListener( "mousedown", down.bind(this) )
		evntupBind = button.addEventListener( "mouseup", up.bind(this) )

		button1 = new pulsar.ui.SimpleButton("Demo1", pulsar.ui.UIHorizontalAlign.CENTER);
		button2 = new pulsar.ui.SimpleButton("Demo2", pulsar.ui.UIHorizontalAlign.RIGHT);

		button1.position.x = 160;
		button2.position.x = 320;


		pulsar.ui.TextInput.createDOMInputContainer();
		textInput = new pulsar.ui.TextInput();
		textInput.position.y = 120;

		stage.addChild( button );
		stage.addChild( button1 );
		stage.addChild( button2 );
		stage.addChild( textInput );



		var buttonRenderer9 = new Sprite9Renderer();
			buttonRenderer9.register( "base", "simple-button-down.png" );
		var c = new Sprite( buttonRenderer9.render( "base", 300,300 ) );
		var d = new Sprite( buttonRenderer9.render( "base", 400,80 ) );
		var e = new Sprite( buttonRenderer9.render( "base", 400,80 ) );
		d.position.y = 200;
		//scale9Sprite.position.x = 300;
		//scale9Sprite.position.y = 300;
		//stage.addChild( c );
		//stage.addChild( d );

		var tranformTool = new TranformTool();
		stage.addChild( tranformTool );
		tranformTool.setTarget( button )
		OEF();
	});
	l.load();




}

var XX = 0;

function down()
{
	console.log('down')
}
function up()
{
	console.log('up')

	//button.removeEventListener( "mousedown", evntDownBind )
	//button.removeEventListener( "mouseup", evntupBind )

}
function OEF()
{
	//button.position.x = Math.sin( (XX++) * .017453292519943295 )*500;
	//button.position.y = Math.sin( (XX++) * .017453292519943295 )*500;
	//button.rotation+=.017453292519943295;
	requestAnimationFrame(OEF);
	renderer.render(stage)

}