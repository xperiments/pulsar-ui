///<reference path="../../../reference.ts"/>
module pulsar.core.library
{
	export interface LibraryAtlasFrame
	{
		x:number;
		y:number;
		w:number;
		h:number;
	}
	export interface LibraryAtlasItem
	{
		frame:LibraryAtlasFrame;
		type:number;
	}
	export interface LibraryAtlas
	{
		[uid:string]:LibraryAtlasItem

	}
	export class LibraryParser
	{
		public imageData:ImageData;
		public libImage:HTMLImageElement;
		public libraryName:string;
		public atlas:LibraryAtlas;

		private canvas:HTMLCanvasElement;
		private context:CanvasRenderingContext2D;
		private factory:LibraryFactory;
		constructor( )
		{
			this.initialize();
		}
		private initialize( ):void
		{
			this.canvas = <HTMLCanvasElement>document.createElement('canvas');
			this.context = this.canvas.getContext('2d');
		}

		public parse( libImage:HTMLImageElement ):LibraryFactory
		{
			this.libImage = libImage;
			this.drawToCanvas( );
			this.readAtlasJSON();
			return new LibraryFactory( this );

		}

		private drawToCanvas( ):void
		{
			this.canvas.width = this.libImage.width;
			this.canvas.height = this.libImage.height;
			this.context.drawImage( this.libImage, 0, 0 );
			this.imageData = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
		}

		private readAtlasJSON():void
		{
			var data:Uint8Array = this.imageData.data;
			var code:string = LibraryParser.decodeString( this.context, <LibraryAtlasFrame>
			{
				 x:parseInt( LibraryParser.rgbToHex( data[ 0 ], data[ 1 ], data[ 2 ] )   ,16)
				,y:parseInt( LibraryParser.rgbToHex( data[ 4 ], data[ 5 ], data[ 6 ] )   ,16)
				,w:parseInt( LibraryParser.rgbToHex( data[ 8 ], data[ 9 ], data[ 10 ] )  ,16)
				,h:parseInt( LibraryParser.rgbToHex( data[ 12 ], data[ 13 ], data[ 14 ] ),16)
			});
			this.unpackAtlas( JSON.parse( code ) );

		}
		private unpackAtlas( atlas:any )
		{
			var out:LibraryAtlas = {};

			for( var i in atlas.elements )
			{
				var el:number[] = atlas.elements[i];
				out[i] =
				{
					frame:
					{
						 x:el[0]
						,y:el[1]
						,w:el[2]
						,h:el[3]
					}
					,type:el[4]
				}
			}
			this.atlas = out;
			this.libraryName = atlas.name;
		}


		public static decodeString(context:CanvasRenderingContext2D, frame:LibraryAtlasFrame):string
		{
			var imageData = context.getImageData( frame.x, frame.y, frame.w, frame.h).data;
			var hexHeader:string = LibraryParser.rgbToHex(imageData[0], imageData[1], imageData[2]);
			var lengthHeader:number = parseInt(hexHeader, 16);
			var str:string = "";
			var i, e, s,total:number
			var fromCharCode:string[] = [];
			var count:number = 0;
			for( i=0; i<256; i++ )
			{
				fromCharCode.push( String.fromCharCode( i ) );
			}

			for( i=0,total=Math.floor( lengthHeader/3 )*3; i<total; i+=3)
			{
				s = (i / 3) * 4;
				str += fromCharCode[imageData[4 + s]];
				str += fromCharCode[imageData[4 + s + 1]];
				str += fromCharCode[imageData[4 + s + 2]];

			}
			for( e=0, total=(lengthHeader%3); e<total; e++ )
			{
				s = (i / 3) * 4 + e;
				str += fromCharCode[imageData[4 + s]];
			}
			return str;
		}

		private static rgbToHex(r:number, g:number, b:number):string
		{
			return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7);
		}
	}
}