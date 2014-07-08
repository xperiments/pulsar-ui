/**
 * utils.ts
 * Created by xperiments on 07/04/14.
 */
///<reference path="../../reference.ts"/>
module pulsar.utils
{
	export function applyMixins(derivedCtor: any, baseCtors: any[])
	{
		baseCtors.forEach(baseCtor => {
			Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
				name!=="constructor" && ( derivedCtor.prototype[name] = baseCtor.prototype[name] );
			})
		});
	}
	export function as<T>(cls:T):T
	{
		return cls;
	}

	// start matching after: comment start block => ! or @preserve => optional whitespace => newline
	// stop matching before: last newline => optional whitespace => comment end block
	var reMultilineCommentContents = /\/\*!?(?:\@preserve)?\s*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)\s*\*\//;
	function stripIndentation (str):string
	{
		var match = str.match(/^[ \t]+/gm);

		if (!match) { return str; }

		var indent = Math.min.apply(Math, match.map(function (el) { return el.length }));
		var re = new RegExp('^[ \\t]{' + indent + '}', 'gm');

		return indent > 0 ? str.replace(re, '') : str;
	}
	export function multiline(fn:Function, stripIndent:Boolean = true ):string
	{
		if (typeof fn !== 'function') {
			throw new TypeError('Expected a function.');
		}

		var match = reMultilineCommentContents.exec(fn.toString());

		if (!match) {
			throw new TypeError('Multiline comment missing.');
		}

		return stripIndent ? stripIndentation(match[1]):match[1];
	}
}