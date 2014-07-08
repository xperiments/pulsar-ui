///<reference path="../../../reference.ts"/>
module pulsar.core.library
{
	import LibraryLoader 	= pulsar.core.library.LibraryLoader;
	import LibraryParser 	= pulsar.core.library.LibraryParser;
	import Event			= pulsar.core.events.Event;

	export class LibraryLoader extends pulsar.core.events.EventDispatcher
	{

		public library:LibraryFactory;
		private imageLoader:HTMLImageElement;
		private imageParser:LibraryParser;
		private loading:boolean = false;
		private static E_COMPLETE:Event = new Event( Event.COMPLETE );
		private static E_ERROR:Event = new Event( Event.ERROR );
		private static E_OPEN:Event = new Event( Event.OPEN );

		constructor()
		{
			super();
			this.initialize();
		}

		public load( url:string ):void
		{
			if(!this.loading)
			{
				this.imageLoader.src = url;
				this.dispatchEvent( LibraryLoader.E_OPEN );
			}
			this.loading = true;
		}

		/* PRIVATES */

		private initialize():void
		{

			this.imageLoader = <HTMLImageElement>document.createElement('image');
			this.imageLoader.onload = ()=>this.onImageLoaded();
			this.imageLoader.onerror = ()=>this.onImageError();
			this.imageParser = new LibraryParser();

		}
		private onImageLoaded():void
		{
			if( LibraryLoader.isValidImage( this.imageLoader ) )
			{
				this.library = this.imageParser.parse( this.imageLoader );
				this.dispatchEvent( LibraryLoader.E_COMPLETE );
			}
			else
			{
				this.dispatchEvent( LibraryLoader.E_ERROR );
			}
			this.loading = false;

		}
		private onImageError():void
		{
			this.dispatchEvent( LibraryLoader.E_ERROR );
		}



		/* UTILS */
		private static isValidImage( img:HTMLImageElement )
		{
			// During the onload event, IE correctly identifies any images that
			// weren’t downloaded as not complete. Others should too. Gecko-based
			// browsers act like NS4 in that they report this incorrectly.
			if (!img.complete)
			{
				return false;
			}

			// However, they do have two very useful properties: naturalWidth and
			// naturalHeight. These give the true size of the image. If it failed
			// to load, either of these should be zero.

			if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0)
			{
				return false;
			}

			// No other way of checking: assume it’s ok.
			return true;
		}


	}
}