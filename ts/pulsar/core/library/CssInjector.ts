
///<reference path="../../../reference.ts"/>
module pulsar.core.library
{
	import Event					= pulsar.core.events.Event;
	import EventDispatcher			= pulsar.core.events.EventDispatcher;
	import IEventDispatcher			= pulsar.core.events.IEventDispatcher;
	import IEventDispatcherListener	= pulsar.core.events.IEventDispatcherListener;

	export class CssInjector extends EventDispatcher
	{
		/**
		 * Injected style element
		 */
		public style:HTMLStyleElement;

		constructor()
		{
			super();
		}

		/**
		 * Injects cssStyle string a a new style element into  the head
		 * @param cssStyle
		 */
		public inject(cssStyle:string):void
		{
			var head:HTMLHeadElement = <HTMLHeadElement>document.head || document.getElementsByTagName('head')[0];
			this.style = <HTMLStyleElement>document.createElement('style');
			this.style.addEventListener('load', ()=>this.onInjectComplete());
			this.style.type = 'text/css';
			this.style.innerText = cssStyle;
			//console.log( cssStyle )
			document.body.appendChild(this.style)
		}

		private onInjectComplete():void
		{
			this.dispatchEvent(new Event(Event.COMPLETE));
		}
	}
}