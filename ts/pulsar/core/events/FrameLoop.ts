
///<reference path="../../../reference.ts"/>
module pulsar.core.events
{
	export class FrameLoop extends PIXI.EventTarget
	{
		static ENTER_FRAME:string = "pulsar.onEnterFrame";
		private _isRunning:boolean = false;

		constructor()
		{
			super();
			this._loop$ = this._loop.bind(this);
		}

		public start()
		{
			this._isRunning = true;
			this._loop();
			return this;
		}

		public stop()
		{
			this._isRunning = false;
		}

		private _loop()
		{
			if (!this._isRunning) return;
			this.dispatchEvent({type: FrameLoop.ENTER_FRAME, content: null})
			window.requestAnimationFrame(this._loop$);
		}

		private _loop$:()=>void;
	}
}