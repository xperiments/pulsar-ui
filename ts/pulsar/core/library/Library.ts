///<reference path="../../../reference.ts"/>

module pulsar.core.library
{
	import LibraryFactory 	= pulsar.core.library.LibraryFactory;
	import LibraryLoader 	= pulsar.core.library.LibraryLoader;
	import Event			= pulsar.core.events.Event;
	export function $( id:string ):LibraryFactory
	{
		return __lib__.getLibrary( id );
	}
	export function load( url:string ):LibraryLoader
	{
		var lib = new LibraryLoader();
			lib.addEventListener( Event.COMPLETE ,()=>__lib__.setData(lib.library));
			lib.load( url );
		return lib;
	}

	window['$LIB'] = $;
	window['$LIB']['load'] = load;

	class InternalLibrary
	{
		private static instance:InternalLibrary;
		private static allowInstantiation:Boolean;
		public static getInstance():InternalLibrary
		{
			if (InternalLibrary.instance == null)
			{
				InternalLibrary.allowInstantiation = true;
				InternalLibrary.instance = new InternalLibrary();
				InternalLibrary.allowInstantiation = false;
			}
			return InternalLibrary.instance;
		}
		constructor()
		{
			if (!InternalLibrary.allowInstantiation) {
				throw new Error("Error: Instantiation failed: Use InternalLibrary.getInstance() instead of new.");
			}
		}

		private libraries:{[name:string]:LibraryFactory} = {};
		public setData(library:LibraryFactory){ this.libraries[ library.parser.libraryName ] = library }
		public getLibrary(id:string):LibraryFactory
		{
			return this.libraries[ id ] || null;
		}
	}
	var __lib__ = InternalLibrary.getInstance();
}



module window
{
	export interface $LIB
	{
		( id:string ):pulsar.core.library.LibraryFactory;
		load(url:string):pulsar.core.library.LibraryLoader;
	}
}
declare var $LIB:window.$LIB;