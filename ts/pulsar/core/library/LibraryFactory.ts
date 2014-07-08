///<reference path="../../../reference.ts"/>
module pulsar.core.library
{
	import LibraryFactory 		= pulsar.core.library.LibraryFactory;
	import LibraryLoader 		= pulsar.core.library.LibraryLoader;
	import LibraryParser 		= pulsar.core.library.LibraryParser;
	import LibraryAtlasFrame 	= pulsar.core.library.LibraryAtlasFrame;
	import CssInjector		 	= pulsar.core.library.CssInjector;
	import ScriptInjector	 	= pulsar.core.library.ScriptInjector;


	export class LibraryFactory
	{

		private cachedImages:{ [name:string]:string } = {};
		private cachedCanvases:{ [name:string]:HTMLCanvasElement } = {};
		private cachedCodes:{ [name:string]:string } = {};
		private cachedShapes:{ [name:string]:any } = {};
		private libraryElements:{ [uid:string]:any } = { };
		public parser:LibraryParser;
		constructor( parser:LibraryParser )
		{
			this.parser = parser;
		}

		public getLibImage():HTMLImageElement
		{
			return this.parser.libImage;
		}
		public getLibAtlas()
		{
			//TODO Implement atlas decompression and return it
		}

		public getCanvas( id:string , cache:boolean = false ):HTMLCanvasElement
		{
			if( this.cachedCanvases[ id ] ) return this.cachedCanvases[ id ];
			var el:any = this.parser.atlas[id];
			if( el && el.type == 0 )
			{

				var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
				var context:CanvasRenderingContext2D = canvas.getContext('2d');
				canvas.width = el.frame.w;
				canvas.height = el.frame.h;
				context.drawImage( this.parser.libImage, el.frame.x, el.frame.y, el.frame.w,el.frame.h,0,0,el.frame.w,el.frame.h);
				if( cache ) this.cachedCanvases[ id ] = canvas;
				return canvas;
			}
			return null;
		}
		public getImage( id:string, cache:boolean = false ):HTMLImageElement
		{
			var canvas:HTMLCanvasElement;
			var base64Image:string;
			var image:HTMLImageElement = <HTMLImageElement>document.createElement('image');
			if( this.cachedImages[ id ] )
			{
				base64Image = this.cachedImages[ id ];
			}
			else
			{
				canvas = this.getCanvas( id );
				base64Image = canvas.toDataURL();
			}

			if( cache ) this.cachedImages[ id ] = base64Image;
				image.src = base64Image;
			return image;
		}

		public getCode( id:string , cache:boolean = false):string
		{
			if( this.cachedCodes[ id ] ) return this.cachedCodes[ id ];
			var el:any = this.parser.atlas[id];

			// TODO REVISAR TYPE
			if( el )
			{
				var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
				var context:CanvasRenderingContext2D = canvas.getContext('2d');
				canvas.width = el.frame.w;
				canvas.height = el.frame.h;
				context.drawImage( this.parser.libImage, el.frame.x, el.frame.y, el.frame.w-8,el.frame.h-8,0,0,el.frame.w-8,el.frame.h-8);
				var code:string = LibraryParser.decodeString( context, <LibraryAtlasFrame>
				{
					x:0
					,y:0
					,w:el.frame.w-8
					,h:el.frame.h-8
				});
				if( cache ) this.cachedCodes[ id ] = code;
				return code;

			}
			return null;
		}

		public getShape( id:string, cache:boolean = true )
		{

			if( this.cachedShapes[ id ] ) return this.cachedShapes[id];
			this.injectScript( id);
			var shape:pulsar.lib.shapes.Shape = <pulsar.lib.shapes.Shape>new pulsar['lib']['shapes'][this.parser.libraryName.toLowerCase()][id]();
			if( cache && shape ) this.cachedShapes[ id ] = shape;
			return shape ? shape:null;
		}

		public injectScript( id:string ):ScriptInjector
		{
			var injector:ScriptInjector = new ScriptInjector();
				injector.inject( this.getCode( id ) );
			return injector;
		}
		public injectCss( id:string ):CssInjector
		{
			var cssInjector:CssInjector = new CssInjector();
				cssInjector.inject( this.getCode( id ) );
			return cssInjector;

		}

	}
}