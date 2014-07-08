/**
 * MovieClipUtils.ts
 * Created by xperiments on 25/03/14.
 */
///<reference path="../../../reference.ts"/>

module pulsar.core.display
{
	import FrameLoop 				= pulsar.core.events.FrameLoop;
	import EventDispatcher			= pulsar.core.events.EventDispatcher;
	import IEventDispatcher			= pulsar.core.events.IEventDispatcher;
	import IEventDispatcherListener	= pulsar.core.events.IEventDispatcherListener;

	export class Stage extends PIXI.Stage implements IEventDispatcher
	{
		private paused:boolean = false;
		public frameLoop:FrameLoop;
		constructor(background:number = 0xFFFFFF, interactive:boolean = false)
		{
			super( background, interactive );
			this.frameLoop = new FrameLoop();
		}

		public pause()
		{
			this.frameLoop.stop();
			this.paused = true;
		}

		public resume()
		{
			this.paused = false;
			this.frameLoop.start();
		}

		public isPaused()
		{
			return this.paused;
		}

		// EventTarget mixing
		public addEventListener:( type:string, listener:IEventDispatcherListener )=>IEventDispatcherListener;
		public hasEventListener:( type:string, listener:IEventDispatcherListener )=>boolean;
		public removeEventListener:(type:string, listener:IEventDispatcherListener )=>IEventDispatcherListener;
		public dispatchEvent:(event:any)=>void;
	}
	pulsar.utils.applyMixins( Stage,[ EventDispatcher ]);
}