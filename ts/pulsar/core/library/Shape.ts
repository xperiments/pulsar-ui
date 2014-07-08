///<reference path="../../../reference.ts"/>
module pulsar.lib.shapes
{
	export interface ILibraryShape
	{
		gradients:CanvasGradient[];
		images:HTMLImageElement[];
		render( ctx:CanvasRenderingContext2D ,ready:()=>void ):void;
		setter( ctx:CanvasRenderingContext2D, key:string, value:string ):void;
	}
	export class Shape implements ILibraryShape
	{
		public gradients:CanvasGradient[];
		public images:HTMLImageElement[];
		private ready:()=>void;
		private ctx:CanvasRenderingContext2D;
		private totalImages:number;
		private totalToLoadImages:number;
		private width:number;
		private height:number;
		constructor( )
		{
			this.initialize();
		}
		public setter(ctx:CanvasRenderingContext2D, key:string, value:string):void
		{
			ctx[key] = value;

		}
		public initialize()
		{
			this._initialize( 0,0,0 );
		}
		public render(ctx:CanvasRenderingContext2D, ready:()=>void )
		{
			this.ready = ready;
			this.ctx = ctx;
			this._render( ctx );
		}
		public _render( ctx:CanvasRenderingContext2D )
		{

		}
		public _initialize( totalImages:number, width:number, height:number )
		{
			this.gradients = [];
			this.images = [];
			this.totalImages = totalImages;
			this.totalToLoadImages = totalImages;
			this.initializeGradients();
			if( this.totalImages !=0 )
			{
				this.loadImages();
			}
			else
			{
				this.ready && this.ready();
			}
			this.width =width;
			this.height =height;
		}

		private onImageLoaded()
		{
			if( --this.totalToLoadImages == 0 )
			{
				this.ready && this.ready();
			}
		}
		public loadImages():void{}
		public initializeGradients():void{}

	}
}

/*
module pulsar.lib.shapes.Monsters
{
	export class DEMO extends pulsar.lib.shapes.Shape
	{
		constructor( )
		{
			super();
		}
		public initialize()
		{
			this._initialize( 0, 0, 0 );
		}
		public _render( ctx:CanvasRenderingContext2D ):void
		{

		}
		public loadImages():void{}
		public initializeGradients():void{}
	}
}
*/

