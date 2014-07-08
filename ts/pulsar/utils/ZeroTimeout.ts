/**
 * ZeroTimeout.ts
 * Created by xperiments on 01/04/14.
 */
///<reference path="../../reference.ts"/>
interface Window
{
	setZeroTimeout(fn:pulsar.utils.IZeroTimeoutCallBack):void;
}
module pulsar.utils
{
	export interface IZeroTimeoutCallBack{ ( ):void }
	var timeouts:IZeroTimeoutCallBack[] = [];
	var messageName:string = "pulsar.utils.zeroTimeout";

	// Like setTimeout, but only takes a function argument.  There's
	// no time argument (always zero) and no arguments (you have to
	// use a closure).
	export function setZeroTimeout(fn:IZeroTimeoutCallBack):void
	{
		timeouts.push(fn);
		window.postMessage(messageName, "*");
	}

	function handleMessage(event) {
		if (event.source == window && event.data == messageName) {
			event.stopPropagation();
			if (timeouts.length > 0) {
				var fn = timeouts.shift();
				fn();
			}
		}
	}

	window.addEventListener("message", handleMessage, true);

	// Add the one thing we want added to the window object.
	window.setZeroTimeout = setZeroTimeout;
}
