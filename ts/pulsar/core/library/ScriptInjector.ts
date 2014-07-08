///<reference path="../../../reference.ts"/>
module pulsar.core.library
{
	import LibraryLoader 	= pulsar.core.library.LibraryLoader;
	import LibraryParser 	= pulsar.core.library.LibraryParser;
	import EventDispatcher	= pulsar.core.events.EventDispatcher;
	import Event			= pulsar.core.events.Event;
	export class ScriptInjector extends EventDispatcher
	{
		private static E_COMPLETE:Event = new Event( Event.COMPLETE );
		script:HTMLScriptElement;

		constructor()
		{
			super();
		}

		public inject(scriptCode:string):void
		{
			this.script = <HTMLScriptElement>document.createElement('script');
			this.script.text = scriptCode;
			(document['head'] || document.getElementsByTagName('head')[0]).appendChild(this.script);
			this.onInjectComplete();
		}

		private onInjectComplete():void
		{
			this.dispatchEvent(ScriptInjector.E_COMPLETE);
		}
	}
}