/**
 * Created by pedro.casaubon on 07/07/14.
 */
///<reference path="../../../reference.ts"/>
module pulsar.core.events
{
	export class StaticEvent
	{
		static init(EventClass:any)
		{
			Object.keys(EventClass).forEach((key:string)=> {
				EventClass[key] = [ StaticEvent.className(EventClass), key ].join('.')
			})
		}

		static className(cls:any):string
		{
			var funcNameRegex = /function (.{1,})\(/;
			var results = (funcNameRegex).exec(cls.toString());
			return (results && results.length > 1) ? results[1] : "";
		}
	}
}