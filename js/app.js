var pulsar;
(function (pulsar) {
    /**
    * utils.ts
    * Created by xperiments on 07/04/14.
    */
    ///<reference path="../../reference.ts"/>
    (function (utils) {
        function applyMixins(derivedCtor, baseCtors) {
            baseCtors.forEach(function (baseCtor) {
                Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                    name !== "constructor" && (derivedCtor.prototype[name] = baseCtor.prototype[name]);
                });
            });
        }
        utils.applyMixins = applyMixins;
        function as(cls) {
            return cls;
        }
        utils.as = as;

        // start matching after: comment start block => ! or @preserve => optional whitespace => newline
        // stop matching before: last newline => optional whitespace => comment end block
        var reMultilineCommentContents = /\/\*!?(?:\@preserve)?\s*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)\s*\*\//;
        function stripIndentation(str) {
            var match = str.match(/^[ \t]+/gm);

            if (!match) {
                return str;
            }

            var indent = Math.min.apply(Math, match.map(function (el) {
                return el.length;
            }));
            var re = new RegExp('^[ \\t]{' + indent + '}', 'gm');

            return indent > 0 ? str.replace(re, '') : str;
        }
        function multiline(fn, stripIndent) {
            if (typeof stripIndent === "undefined") { stripIndent = true; }
            if (typeof fn !== 'function') {
                throw new TypeError('Expected a function.');
            }

            var match = reMultilineCommentContents.exec(fn.toString());

            if (!match) {
                throw new TypeError('Multiline comment missing.');
            }

            return stripIndent ? stripIndentation(match[1]) : match[1];
        }
        utils.multiline = multiline;
    })(pulsar.utils || (pulsar.utils = {}));
    var utils = pulsar.utils;
})(pulsar || (pulsar = {}));
///<reference path="../../reference.ts"/>
var pulsar;
(function (pulsar) {
    (function (utils) {
        var timeouts = [];
        var messageName = "pulsar.utils.zeroTimeout";

        // Like setTimeout, but only takes a function argument.  There's
        // no time argument (always zero) and no arguments (you have to
        // use a closure).
        function setZeroTimeout(fn) {
            timeouts.push(fn);
            window.postMessage(messageName, "*");
        }
        utils.setZeroTimeout = setZeroTimeout;

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
    })(pulsar.utils || (pulsar.utils = {}));
    var utils = pulsar.utils;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    (function (utils) {
        (function (MathUtils) {
            /**
            * Returns the next power of two that is equal to or bigger than the specified num.
            * @param num
            * @returns {number}
            */
            function getNextPowerOfTwo(num) {
                if (num > 0 && (num & (num - 1)) == 0) {
                    return num;
                } else {
                    var result = 1;
                    while (result < num)
                        result <<= 1;
                    return result;
                }
            }
            MathUtils.getNextPowerOfTwo = getNextPowerOfTwo;

            /**
            *
            * @param min
            * @param max
            * @returns {number}
            */
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            MathUtils.getRandomInt = getRandomInt;
        })(utils.MathUtils || (utils.MathUtils = {}));
        var MathUtils = utils.MathUtils;
    })(pulsar.utils || (pulsar.utils = {}));
    var utils = pulsar.utils;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    (function (core) {
        /**
        * Created by xperiments on 19/03/14.
        */
        ///<reference path="../../../reference.ts"/>
        (function (events) {
            var Event = (function () {
                function Event(type, content) {
                    this.type = type;
                    this.content = content;
                }
                Event.ACTIVATE = "activate";
                Event.ADDED = "added";
                Event.ADDED_TO_STAGE = "addedToStage";
                Event.CANCEL = "cancel";
                Event.CHANGE = "change";
                Event.CLEAR = "clear";
                Event.CLOSE = "close";
                Event.COMPLETE = "complete";
                Event.CONNECT = "connect";
                Event.COPY = "copy";
                Event.CUT = "cut";
                Event.DEACTIVATE = "deactivate";
                Event.ENTER_FRAME = "enterFrame";
                Event.ERROR = "error";
                Event.INIT = "init";
                Event.MOUSE_LEAVE = "mouseLeave";
                Event.OPEN = "open";
                Event.PASTE = "paste";
                Event.REMOVED = "removed";
                Event.REMOVED_FROM_STAGE = "removedFromStage";
                Event.RENDER = "render";
                Event.RESIZE = "resize";
                Event.SCROLL = "scroll";
                Event.SELECT = "select";
                Event.SELECT_ALL = "selectAll";
                Event.UNLOAD = "unload";
                Event.FULLSCREEN = "fullScreen";
                return Event;
            })();
            events.Event = Event;
            var ListenerUtils = (function () {
                function ListenerUtils() {
                }
                ListenerUtils.getDelegate = function (method, context) {
                    return method.bind(context);
                };
                return ListenerUtils;
            })();
            events.ListenerUtils = ListenerUtils;

            var EventDispatcher = (function () {
                function EventDispatcher() {
                }
                EventDispatcher.prototype.addEventListener = function (type, listener) {
                    if (this._listeners === undefined)
                        this._listeners = {};
                    var listeners = this._listeners;
                    if (listeners[type] === undefined) {
                        listeners[type] = [];
                    }
                    if (listeners[type].indexOf(listener) === -1) {
                        listeners[type].push(listener);
                    }
                    return listener;
                };

                EventDispatcher.prototype.hasEventListener = function (type, listener) {
                    if (this._listeners === undefined)
                        return false;
                    var listeners = this._listeners;
                    if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1) {
                        return true;
                    }
                    return false;
                };

                EventDispatcher.prototype.removeEventListener = function (type, listener) {
                    if (this._listeners === undefined)
                        return null;
                    var listeners = this._listeners;
                    var listenerArray = listeners[type];
                    if (listenerArray !== undefined) {
                        var index = listenerArray.indexOf(listener);
                        if (index !== -1) {
                            listenerArray.splice(index, 1);
                        }
                    }
                    return listener;
                };

                EventDispatcher.prototype.dispatchEvent = function (event) {
                    if (this._listeners === undefined)
                        return;
                    var listeners = this._listeners;
                    var listenerArray = listeners[event.type];
                    if (listenerArray !== undefined) {
                        event.target = this;
                        var array = [];
                        var length = listenerArray.length;
                        for (var i = 0; i < length; i++) {
                            array[i] = listenerArray[i];
                        }
                        for (var i = 0; i < length; i++) {
                            array[i].call(this, event);
                        }
                    }
                };
                return EventDispatcher;
            })();
            events.EventDispatcher = EventDispatcher;
        })(core.events || (core.events = {}));
        var events = core.events;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    (function (core) {
        /**
        * Created by pedro.casaubon on 07/07/14.
        */
        ///<reference path="../../../reference.ts"/>
        (function (events) {
            var StaticEvent = (function () {
                function StaticEvent() {
                }
                StaticEvent.init = function (EventClass) {
                    Object.keys(EventClass).forEach(function (key) {
                        EventClass[key] = [StaticEvent.className(EventClass), key].join('.');
                    });
                };

                StaticEvent.className = function (cls) {
                    var funcNameRegex = /function (.{1,})\(/;
                    var results = (funcNameRegex).exec(cls.toString());
                    return (results && results.length > 1) ? results[1] : "";
                };
                return StaticEvent;
            })();
            events.StaticEvent = StaticEvent;
        })(core.events || (core.events = {}));
        var events = core.events;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var pulsar;
(function (pulsar) {
    (function (core) {
        ///<reference path="../../../reference.ts"/>
        (function (events) {
            var FrameLoop = (function (_super) {
                __extends(FrameLoop, _super);
                function FrameLoop() {
                    _super.call(this);
                    this._isRunning = false;
                    this._loop$ = this._loop.bind(this);
                }
                FrameLoop.prototype.start = function () {
                    this._isRunning = true;
                    this._loop();
                    return this;
                };

                FrameLoop.prototype.stop = function () {
                    this._isRunning = false;
                };

                FrameLoop.prototype._loop = function () {
                    if (!this._isRunning)
                        return;
                    this.dispatchEvent({ type: FrameLoop.ENTER_FRAME, content: null });
                    window.requestAnimationFrame(this._loop$);
                };
                FrameLoop.ENTER_FRAME = "pulsar.onEnterFrame";
                return FrameLoop;
            })(PIXI.EventTarget);
            events.FrameLoop = FrameLoop;
        })(core.events || (core.events = {}));
        var events = core.events;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
/**
* display.ts
* Created by xperiments on 01/04/14.
*/
///<reference path="../../../reference.ts"/>
/**
* MovieClipUtils.ts
* Created by xperiments on 25/03/14.
*/
///<reference path="../../../reference.ts"/>
var pulsar;
(function (pulsar) {
    (function (core) {
        (function (display) {
            var FrameLoop = pulsar.core.events.FrameLoop;
            var EventDispatcher = pulsar.core.events.EventDispatcher;

            var Stage = (function (_super) {
                __extends(Stage, _super);
                function Stage(background, interactive) {
                    if (typeof background === "undefined") { background = 0xFFFFFF; }
                    if (typeof interactive === "undefined") { interactive = false; }
                    _super.call(this, background, interactive);
                    this.paused = false;
                    this.frameLoop = new FrameLoop();
                }
                Stage.prototype.pause = function () {
                    this.frameLoop.stop();
                    this.paused = true;
                };

                Stage.prototype.resume = function () {
                    this.paused = false;
                    this.frameLoop.start();
                };

                Stage.prototype.isPaused = function () {
                    return this.paused;
                };
                return Stage;
            })(PIXI.Stage);
            display.Stage = Stage;
            pulsar.utils.applyMixins(Stage, [EventDispatcher]);
        })(core.display || (core.display = {}));
        var display = core.display;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
/**
*
*	Bitmap9 class. An implementation of the scale9grid from AS3
*
*	@author		Pedro Casaubon
*	@version	01.0
* 	@date       16/04/2014
* 	@link		http://www.xperiments.es
*
*/

var pulsar;
(function (pulsar) {
    (function (core) {
        ///<reference path="../../../reference.ts"/>
        (function (display) {
            var Rectangle = PIXI.Rectangle;
            var Texture = PIXI.Texture;

            var CanvasBuffer = PIXI.CanvasBuffer;

            var Bitmap9 = (function () {
                function Bitmap9() {
                }
                /**
                * Renders an image from a scale9 base texture
                * @param texture The original scale9 texture
                * @param scale9Grid  Rectangle representing the scale9 corners
                * @param width Width of the resulting scaled image
                * @param height Height of the resulting scaled image
                * @returns {HTMLImageElement}
                */
                Bitmap9.render = function (skin, width, height) {
                    var texture = Texture.fromFrame(skin.textureFrame);
                    var scale9Grid = skin.scaleGrid;
                    var canvas = new CanvasBuffer(width, height);

                    // define bitmap source areas
                    var rows = [0, scale9Grid.y, scale9Grid.y + scale9Grid.height, texture.frame.height];
                    var cols = [0, scale9Grid.x, scale9Grid.x + scale9Grid.width, texture.frame.width];

                    // define bitmap destination areas
                    var dRows = [0, scale9Grid.y, height - (texture.frame.height - (scale9Grid.y + scale9Grid.height)), height];
                    var dCols = [0, scale9Grid.x, width - (texture.frame.width - (scale9Grid.x + scale9Grid.width)), width];

                    // rectangle containing current origin area
                    var origin = new Rectangle(0, 0, 0, 0);

                    // rectangle containing current destination area
                    var draw = new Rectangle(0, 0, 0, 0);

                    for (var cy = 0; cy < 3; cy++) {
                        for (var cx = 0; cx < 3; cx++) {
                            // compute current origin and draw area Rectangles
                            // origin = new Rectangle(cols[cx], rows[cy], cols[cx + 1] - cols[cx], rows[cy + 1] - rows[cy]);
                            origin.x = cols[cx] + texture.frame.x;
                            origin.y = rows[cy] + texture.frame.y;
                            origin.width = cols[cx + 1] - cols[cx];
                            origin.height = rows[cy + 1] - rows[cy];

                            draw.x = dCols[cx];
                            draw.y = dRows[cy];
                            draw.width = dCols[cx + 1] - dCols[cx];
                            draw.height = dRows[cy + 1] - dRows[cy];

                            // draw the image portion
                            canvas.context.drawImage(texture.baseTexture.source, origin.x, origin.y, origin.width, origin.height, draw.x, draw.y, draw.width, draw.height);
                        }
                    }
                    return canvas;
                };
                return Bitmap9;
            })();
            display.Bitmap9 = Bitmap9;
        })(core.display || (core.display = {}));
        var display = core.display;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
/**
* Sprite9.ts
* Created by xperiments on 31/03/14.
*/
///<reference path="../../../reference.ts"/>
var pulsar;
(function (pulsar) {
    (function (core) {
        /**
        *
        *	Sprite9 class. An implementation of the scale9grid from AS3 for use in elements that change his size in runtime
        *
        *	@author		Pedro Casaubon
        *	@version	01.0
        * 	@date       16/04/2014
        * 	@link		http://www.xperiments.es
        *
        */
        (function (display) {
            var Rectangle = PIXI.Rectangle;

            var Sprite = PIXI.Sprite;
            var Texture = PIXI.Texture;

            var Sprite9 = (function (_super) {
                __extends(Sprite9, _super);
                function Sprite9(frame, scale9Grid) {
                    if (typeof scale9Grid === "undefined") { scale9Grid = Sprite9.ZERO_RECT; }
                    _super.call(this);
                    this.frame = frame;
                    this.scale9Grid = scale9Grid;
                    console.log('BBBB', PIXI.Texture.fromFrame(frame));
                    this._scale9Texture = Texture.fromFrame(frame);
                    this._scale9Sprites = [];

                    // define bitmap source areas
                    var rows = [0, scale9Grid.y, scale9Grid.y + scale9Grid.height, this._scale9Texture.frame.height];
                    var cols = [0, scale9Grid.x, scale9Grid.x + scale9Grid.width, this._scale9Texture.frame.width];

                    var origin;
                    var textureCount = 0;
                    for (var cx = 0; cx < 3; cx++) {
                        for (var cy = 0; cy < 3; cy++) {
                            origin = new Rectangle(cols[cx] + this._scale9Texture.frame.x, rows[cy] + this._scale9Texture.frame.y, Math.abs(cols[cx + 1] - cols[cx]), Math.abs(rows[cy + 1] - rows[cy]));
                            console.log(origin);
                            this._scale9Sprites[textureCount] = new Sprite(new Texture(this._scale9Texture.baseTexture, origin));
                            this.addChild(this._scale9Sprites[textureCount]);
                            textureCount++;
                        }
                    }
                }
                Sprite9.prototype.setSize = function (width, height) {
                    var draw;
                    var origin;
                    var textureCount = 0;

                    var rows = [0, this.scale9Grid.y, this.scale9Grid.y + this.scale9Grid.height, this._scale9Texture.frame.height];
                    var cols = [0, this.scale9Grid.x, this.scale9Grid.x + this.scale9Grid.width, this._scale9Texture.frame.width];

                    var dRows = [0, this.scale9Grid.y, height - ((this._scale9Texture.frame.height) - (this.scale9Grid.y + this.scale9Grid.height)), height];
                    var dCols = [0, this.scale9Grid.x, width - ((this._scale9Texture.frame.width) - (this.scale9Grid.x + this.scale9Grid.width)), width];

                    for (var cx = 0; cx < 3; cx++) {
                        for (var cy = 0; cy < 3; cy++) {
                            origin = new Rectangle(cols[cx], rows[cy], Math.abs(cols[cx + 1] - cols[cx]), Math.abs(rows[cy + 1] - rows[cy]));
                            draw = new Rectangle(dCols[cx], dRows[cy], Math.abs(dCols[cx + 1] - dCols[cx]), Math.abs(dRows[cy + 1] - dRows[cy]));

                            console.log(cx, cy, draw);
                            this._scale9Sprites[textureCount].position.x = draw.x;
                            this._scale9Sprites[textureCount].position.y = draw.y;

                            if (!(textureCount == 0 || textureCount == 2 || textureCount == 6 || textureCount == 8)) {
                                this._scale9Sprites[textureCount].scale.x = draw.width / origin.width;
                                this._scale9Sprites[textureCount].scale.y = draw.height / origin.height;
                            }
                            textureCount++;
                        }
                    }
                    return this;
                };

                Sprite9.prototype.flatten = function () {
                    return this.generateTexture();
                };
                Sprite9.ZERO_RECT = new Rectangle(0, 0, 100, 100);
                return Sprite9;
            })(PIXI.DisplayObjectContainer);
            display.Sprite9 = Sprite9;
        })(core.display || (core.display = {}));
        var display = core.display;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    (function (core) {
        ///<reference path="../../../reference.ts"/>
        (function (library) {
            var Event = pulsar.core.events.Event;
            var EventDispatcher = pulsar.core.events.EventDispatcher;

            var CssInjector = (function (_super) {
                __extends(CssInjector, _super);
                function CssInjector() {
                    _super.call(this);
                }
                /**
                * Injects cssStyle string a a new style element into  the head
                * @param cssStyle
                */
                CssInjector.prototype.inject = function (cssStyle) {
                    var _this = this;
                    var head = document.head || document.getElementsByTagName('head')[0];
                    this.style = document.createElement('style');
                    this.style.addEventListener('load', function () {
                        return _this.onInjectComplete();
                    });
                    this.style.type = 'text/css';
                    this.style.innerText = cssStyle;

                    //console.log( cssStyle )
                    document.body.appendChild(this.style);
                };

                CssInjector.prototype.onInjectComplete = function () {
                    this.dispatchEvent(new Event(Event.COMPLETE));
                };
                return CssInjector;
            })(EventDispatcher);
            library.CssInjector = CssInjector;
        })(core.library || (core.library = {}));
        var library = core.library;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    (function (core) {
        ///<reference path="../../../reference.ts"/>
        (function (library) {
            var EventDispatcher = pulsar.core.events.EventDispatcher;
            var Event = pulsar.core.events.Event;
            var ScriptInjector = (function (_super) {
                __extends(ScriptInjector, _super);
                function ScriptInjector() {
                    _super.call(this);
                }
                ScriptInjector.prototype.inject = function (scriptCode) {
                    this.script = document.createElement('script');
                    this.script.text = scriptCode;
                    (document['head'] || document.getElementsByTagName('head')[0]).appendChild(this.script);
                    this.onInjectComplete();
                };

                ScriptInjector.prototype.onInjectComplete = function () {
                    this.dispatchEvent(ScriptInjector.E_COMPLETE);
                };
                ScriptInjector.E_COMPLETE = new Event(Event.COMPLETE);
                return ScriptInjector;
            })(EventDispatcher);
            library.ScriptInjector = ScriptInjector;
        })(core.library || (core.library = {}));
        var library = core.library;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    (function (core) {
        ///<reference path="../../../reference.ts"/>
        (function (library) {
            var LibraryParser = (function () {
                function LibraryParser() {
                    this.initialize();
                }
                LibraryParser.prototype.initialize = function () {
                    this.canvas = document.createElement('canvas');
                    this.context = this.canvas.getContext('2d');
                };

                LibraryParser.prototype.parse = function (libImage) {
                    this.libImage = libImage;
                    this.drawToCanvas();
                    this.readAtlasJSON();
                    return new library.LibraryFactory(this);
                };

                LibraryParser.prototype.drawToCanvas = function () {
                    this.canvas.width = this.libImage.width;
                    this.canvas.height = this.libImage.height;
                    this.context.drawImage(this.libImage, 0, 0);
                    this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
                };

                LibraryParser.prototype.readAtlasJSON = function () {
                    var data = this.imageData.data;
                    var code = LibraryParser.decodeString(this.context, {
                        x: parseInt(LibraryParser.rgbToHex(data[0], data[1], data[2]), 16),
                        y: parseInt(LibraryParser.rgbToHex(data[4], data[5], data[6]), 16),
                        w: parseInt(LibraryParser.rgbToHex(data[8], data[9], data[10]), 16),
                        h: parseInt(LibraryParser.rgbToHex(data[12], data[13], data[14]), 16)
                    });
                    this.unpackAtlas(JSON.parse(code));
                };
                LibraryParser.prototype.unpackAtlas = function (atlas) {
                    var out = {};

                    for (var i in atlas.elements) {
                        var el = atlas.elements[i];
                        out[i] = {
                            frame: {
                                x: el[0],
                                y: el[1],
                                w: el[2],
                                h: el[3]
                            },
                            type: el[4]
                        };
                    }
                    this.atlas = out;
                    this.libraryName = atlas.name;
                };

                LibraryParser.decodeString = function (context, frame) {
                    var imageData = context.getImageData(frame.x, frame.y, frame.w, frame.h).data;
                    var hexHeader = LibraryParser.rgbToHex(imageData[0], imageData[1], imageData[2]);
                    var lengthHeader = parseInt(hexHeader, 16);
                    var str = "";
                    var i, e, s, total;
                    var fromCharCode = [];
                    var count = 0;
                    for (i = 0; i < 256; i++) {
                        fromCharCode.push(String.fromCharCode(i));
                    }

                    for (i = 0, total = Math.floor(lengthHeader / 3) * 3; i < total; i += 3) {
                        s = (i / 3) * 4;
                        str += fromCharCode[imageData[4 + s]];
                        str += fromCharCode[imageData[4 + s + 1]];
                        str += fromCharCode[imageData[4 + s + 2]];
                    }
                    for (e = 0, total = (lengthHeader % 3); e < total; e++) {
                        s = (i / 3) * 4 + e;
                        str += fromCharCode[imageData[4 + s]];
                    }
                    return str;
                };

                LibraryParser.rgbToHex = function (r, g, b) {
                    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7);
                };
                return LibraryParser;
            })();
            library.LibraryParser = LibraryParser;
        })(core.library || (core.library = {}));
        var library = core.library;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
///<reference path="../../../reference.ts"/>
var pulsar;
(function (pulsar) {
    (function (core) {
        (function (_library) {
            var LibraryLoader = pulsar.core.library.LibraryLoader;
            var Event = pulsar.core.events.Event;
            function $(id) {
                return __lib__.getLibrary(id);
            }
            _library.$ = $;
            function load(url) {
                var lib = new LibraryLoader();
                lib.addEventListener(Event.COMPLETE, function () {
                    return __lib__.setData(lib.library);
                });
                lib.load(url);
                return lib;
            }
            _library.load = load;

            window['$LIB'] = $;
            window['$LIB']['load'] = load;

            var InternalLibrary = (function () {
                function InternalLibrary() {
                    this.libraries = {};
                    if (!InternalLibrary.allowInstantiation) {
                        throw new Error("Error: Instantiation failed: Use InternalLibrary.getInstance() instead of new.");
                    }
                }
                InternalLibrary.getInstance = function () {
                    if (InternalLibrary.instance == null) {
                        InternalLibrary.allowInstantiation = true;
                        InternalLibrary.instance = new InternalLibrary();
                        InternalLibrary.allowInstantiation = false;
                    }
                    return InternalLibrary.instance;
                };

                InternalLibrary.prototype.setData = function (library) {
                    this.libraries[library.parser.libraryName] = library;
                };
                InternalLibrary.prototype.getLibrary = function (id) {
                    return this.libraries[id] || null;
                };
                return InternalLibrary;
            })();
            var __lib__ = InternalLibrary.getInstance();
        })(core.library || (core.library = {}));
        var library = core.library;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    (function (core) {
        ///<reference path="../../../reference.ts"/>
        (function (library) {
            var LibraryParser = pulsar.core.library.LibraryParser;

            var CssInjector = pulsar.core.library.CssInjector;
            var ScriptInjector = pulsar.core.library.ScriptInjector;

            var LibraryFactory = (function () {
                function LibraryFactory(parser) {
                    this.cachedImages = {};
                    this.cachedCanvases = {};
                    this.cachedCodes = {};
                    this.cachedShapes = {};
                    this.libraryElements = {};
                    this.parser = parser;
                }
                LibraryFactory.prototype.getLibImage = function () {
                    return this.parser.libImage;
                };
                LibraryFactory.prototype.getLibAtlas = function () {
                    //TODO Implement atlas decompression and return it
                };

                LibraryFactory.prototype.getCanvas = function (id, cache) {
                    if (typeof cache === "undefined") { cache = false; }
                    if (this.cachedCanvases[id])
                        return this.cachedCanvases[id];
                    var el = this.parser.atlas[id];
                    if (el && el.type == 0) {
                        var canvas = document.createElement('canvas');
                        var context = canvas.getContext('2d');
                        canvas.width = el.frame.w;
                        canvas.height = el.frame.h;
                        context.drawImage(this.parser.libImage, el.frame.x, el.frame.y, el.frame.w, el.frame.h, 0, 0, el.frame.w, el.frame.h);
                        if (cache)
                            this.cachedCanvases[id] = canvas;
                        return canvas;
                    }
                    return null;
                };
                LibraryFactory.prototype.getImage = function (id, cache) {
                    if (typeof cache === "undefined") { cache = false; }
                    var canvas;
                    var base64Image;
                    var image = document.createElement('image');
                    if (this.cachedImages[id]) {
                        base64Image = this.cachedImages[id];
                    } else {
                        canvas = this.getCanvas(id);
                        base64Image = canvas.toDataURL();
                    }

                    if (cache)
                        this.cachedImages[id] = base64Image;
                    image.src = base64Image;
                    return image;
                };

                LibraryFactory.prototype.getCode = function (id, cache) {
                    if (typeof cache === "undefined") { cache = false; }
                    if (this.cachedCodes[id])
                        return this.cachedCodes[id];
                    var el = this.parser.atlas[id];

                    // TODO REVISAR TYPE
                    if (el) {
                        var canvas = document.createElement('canvas');
                        var context = canvas.getContext('2d');
                        canvas.width = el.frame.w;
                        canvas.height = el.frame.h;
                        context.drawImage(this.parser.libImage, el.frame.x, el.frame.y, el.frame.w - 8, el.frame.h - 8, 0, 0, el.frame.w - 8, el.frame.h - 8);
                        var code = LibraryParser.decodeString(context, {
                            x: 0,
                            y: 0,
                            w: el.frame.w - 8,
                            h: el.frame.h - 8
                        });
                        if (cache)
                            this.cachedCodes[id] = code;
                        return code;
                    }
                    return null;
                };

                LibraryFactory.prototype.getShape = function (id, cache) {
                    if (typeof cache === "undefined") { cache = true; }
                    if (this.cachedShapes[id])
                        return this.cachedShapes[id];
                    this.injectScript(id);
                    var shape = new pulsar['lib']['shapes'][this.parser.libraryName.toLowerCase()][id]();
                    if (cache && shape)
                        this.cachedShapes[id] = shape;
                    return shape ? shape : null;
                };

                LibraryFactory.prototype.injectScript = function (id) {
                    var injector = new ScriptInjector();
                    injector.inject(this.getCode(id));
                    return injector;
                };
                LibraryFactory.prototype.injectCss = function (id) {
                    var cssInjector = new CssInjector();
                    cssInjector.inject(this.getCode(id));
                    return cssInjector;
                };
                return LibraryFactory;
            })();
            library.LibraryFactory = LibraryFactory;
        })(core.library || (core.library = {}));
        var library = core.library;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    (function (core) {
        ///<reference path="../../../reference.ts"/>
        (function (library) {
            var LibraryParser = pulsar.core.library.LibraryParser;
            var Event = pulsar.core.events.Event;

            var LibraryLoader = (function (_super) {
                __extends(LibraryLoader, _super);
                function LibraryLoader() {
                    _super.call(this);
                    this.loading = false;
                    this.initialize();
                }
                LibraryLoader.prototype.load = function (url) {
                    if (!this.loading) {
                        this.imageLoader.src = url;
                        this.dispatchEvent(LibraryLoader.E_OPEN);
                    }
                    this.loading = true;
                };

                /* PRIVATES */
                LibraryLoader.prototype.initialize = function () {
                    var _this = this;
                    this.imageLoader = document.createElement('image');
                    this.imageLoader.onload = function () {
                        return _this.onImageLoaded();
                    };
                    this.imageLoader.onerror = function () {
                        return _this.onImageError();
                    };
                    this.imageParser = new LibraryParser();
                };
                LibraryLoader.prototype.onImageLoaded = function () {
                    if (LibraryLoader.isValidImage(this.imageLoader)) {
                        this.library = this.imageParser.parse(this.imageLoader);
                        this.dispatchEvent(LibraryLoader.E_COMPLETE);
                    } else {
                        this.dispatchEvent(LibraryLoader.E_ERROR);
                    }
                    this.loading = false;
                };
                LibraryLoader.prototype.onImageError = function () {
                    this.dispatchEvent(LibraryLoader.E_ERROR);
                };

                /* UTILS */
                LibraryLoader.isValidImage = function (img) {
                    // During the onload event, IE correctly identifies any images that
                    // weren’t downloaded as not complete. Others should too. Gecko-based
                    // browsers act like NS4 in that they report this incorrectly.
                    if (!img.complete) {
                        return false;
                    }

                    // However, they do have two very useful properties: naturalWidth and
                    // naturalHeight. These give the true size of the image. If it failed
                    // to load, either of these should be zero.
                    if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
                        return false;
                    }

                    // No other way of checking: assume it’s ok.
                    return true;
                };
                LibraryLoader.E_COMPLETE = new Event(Event.COMPLETE);
                LibraryLoader.E_ERROR = new Event(Event.ERROR);
                LibraryLoader.E_OPEN = new Event(Event.OPEN);
                return LibraryLoader;
            })(pulsar.core.events.EventDispatcher);
            library.LibraryLoader = LibraryLoader;
        })(core.library || (core.library = {}));
        var library = core.library;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    (function (lib) {
        ///<reference path="../../../reference.ts"/>
        (function (shapes) {
            var Shape = (function () {
                function Shape() {
                    this.initialize();
                }
                Shape.prototype.setter = function (ctx, key, value) {
                    ctx[key] = value;
                };
                Shape.prototype.initialize = function () {
                    this._initialize(0, 0, 0);
                };
                Shape.prototype.render = function (ctx, ready) {
                    this.ready = ready;
                    this.ctx = ctx;
                    this._render(ctx);
                };
                Shape.prototype._render = function (ctx) {
                };
                Shape.prototype._initialize = function (totalImages, width, height) {
                    this.gradients = [];
                    this.images = [];
                    this.totalImages = totalImages;
                    this.totalToLoadImages = totalImages;
                    this.initializeGradients();
                    if (this.totalImages != 0) {
                        this.loadImages();
                    } else {
                        this.ready && this.ready();
                    }
                    this.width = width;
                    this.height = height;
                };

                Shape.prototype.onImageLoaded = function () {
                    if (--this.totalToLoadImages == 0) {
                        this.ready && this.ready();
                    }
                };
                Shape.prototype.loadImages = function () {
                };
                Shape.prototype.initializeGradients = function () {
                };
                return Shape;
            })();
            shapes.Shape = Shape;
        })(lib.shapes || (lib.shapes = {}));
        var shapes = lib.shapes;
    })(pulsar.lib || (pulsar.lib = {}));
    var lib = pulsar.lib;
})(pulsar || (pulsar = {}));
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
/**
* HSON.ts
* Created by xperiments on 04/04/14.
*/
///<reference path="../../../reference.ts"/>
var pulsar;
(function (pulsar) {
    (function (core) {
        (function (parsers) {
            (function (HSON) {
                function parse(input) {
                    var UNESCAPE_MAP = { '\\"': '"', "\\`": "`", "\\'": "'" };
                    var ML_ESCAPE_MAP = { '\n': '\\n', "\r": '\\r', "\t": '\\t', '"': '\\"' };
                    function unescapeQuotes(r) {
                        return UNESCAPE_MAP[r] || r;
                    }

                    return input.replace(/`(?:\\.|[^`])*`|'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|\/\*[^]*?\*\/|\/\/.*\n?/g, function (s) {
                        if (s.charAt(0) == '/')
                            return '';
                        else
                            return s;
                    }).replace(/(?:true|false|null)(?=[^\w_$]|$)|([a-zA-Z_$][\w_$]*)|`((?:\\.|[^`])*)`|'((?:\\.|[^'])*)'|"(?:\\.|[^"])*"|(,)(?=\s*[}\]])/g, function (s, identifier, multilineQuote, singleQuote, lonelyComma) {
                        if (lonelyComma)
                            return '';
                        else if (identifier != null)
                            return '"' + identifier + '"';
                        else if (multilineQuote != null)
                            return '"' + multilineQuote.replace(/\\./g, unescapeQuotes).replace(/[\n\r\t"]/g, function (r) {
                                return ML_ESCAPE_MAP[r];
                            }) + '"';
                        else if (singleQuote != null)
                            return '"' + singleQuote.replace(/\\./g, unescapeQuotes).replace(/"/g, '\\"') + '"';
                        else
                            return s;
                    });
                }
                HSON.parse = parse;
            })(parsers.HSON || (parsers.HSON = {}));
            var HSON = parsers.HSON;
        })(core.parsers || (core.parsers = {}));
        var parsers = core.parsers;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    (function (core) {
        (function (texture) {
            var BinaryBlock = (function () {
                function BinaryBlock(x, y, w, h, data, id) {
                    this.x = x;
                    this.y = y;
                    this.w = w;
                    this.h = h;
                    this.data = data;
                    this.id = id;
                }
                return BinaryBlock;
            })();
            texture.BinaryBlock = BinaryBlock;

            var BinarySortType = (function () {
                function BinarySortType(value) {
                    this.value = value;
                }
                // static sconstructor = (()=>{ return true})();
                BinarySortType.prototype.toString = function () {
                    return this.value;
                };

                BinarySortType.WIDTH = new BinarySortType("width");
                BinarySortType.HEIGHT = new BinarySortType("height");
                BinarySortType.MAX_SIDE = new BinarySortType("maxside");
                BinarySortType.AREA = new BinarySortType("area");
                return BinarySortType;
            })();
            texture.BinarySortType = BinarySortType;

            var BinarySort = (function () {
                function BinarySort() {
                }
                BinarySort.w = function (a, b) {
                    return b.w - a.w;
                };
                BinarySort.h = function (a, b) {
                    return b.h - a.h;
                };
                BinarySort.a = function (a, b) {
                    return b.area - a.area;
                };
                BinarySort.max = function (a, b) {
                    return Math.max(b.w, b.h) - Math.max(a.w, a.h);
                };
                BinarySort.min = function (a, b) {
                    return Math.min(b.w, b.h) - Math.min(a.w, a.h);
                };

                BinarySort.height = function (a, b) {
                    return BinarySort.msort(a, b, ['h', 'w']);
                };
                BinarySort.width = function (a, b) {
                    return BinarySort.msort(a, b, ['w', 'h']);
                };
                BinarySort.area = function (a, b) {
                    return BinarySort.msort(a, b, ['a', 'h', 'w']);
                };
                BinarySort.maxside = function (a, b) {
                    return BinarySort.msort(a, b, ['max', 'min', 'h', 'w']);
                };

                BinarySort.sort = function (blocks, sort) {
                    if (!sort.match(/(random)|(w)|(h)|(a)|(max)|(min)|(height)|(width)|(area)|(maxside)/))
                        return;

                    blocks.sort((BinarySort[sort]));
                };

                BinarySort.msort = function (a, b, criteria) {
                    /* sort by multiple criteria */
                    var diff;
                    var n;
                    var total = criteria.length;
                    for (n = 0; n < total; n++) {
                        var sortMethod = BinarySort[criteria[n]];
                        diff = sortMethod(a, b);
                        if (diff != 0) {
                            return diff;
                        }
                    }
                    return 0;
                };
                return BinarySort;
            })();
            texture.BinarySort = BinarySort;
            var BinaryPacker = (function () {
                function BinaryPacker() {
                }
                BinaryPacker.pack = function (blocks, mode) {
                    BinarySort.sort(blocks, mode);
                    BinaryPacker.fit(blocks);
                };
                BinaryPacker.fit = function (blocks) {
                    var n;
                    var node;
                    var block;

                    var len = blocks.length;

                    var w = len > 0 ? blocks[0].w : 0;
                    var h = len > 0 ? blocks[0].h : 0;

                    BinaryPacker.root = {
                        x: 0,
                        y: 0,
                        w: w,
                        h: h
                    };
                    for (n = 0; n < len; n++) {
                        block = blocks[n];
                        if (node = BinaryPacker.findNode(BinaryPacker.root, block.w, block.h)) {
                            block.fit = BinaryPacker.splitNode(node, block.w, block.h);
                        } else {
                            block.fit = BinaryPacker.growNode(block.w, block.h);
                        }
                    }
                };

                BinaryPacker.findNode = function (root, w, h) {
                    if (root.used) {
                        return BinaryPacker.findNode(root.right, w, h) || BinaryPacker.findNode(root.down, w, h);
                    } else {
                        if ((w <= root.w) && (h <= root.h)) {
                            return root;
                        } else {
                            return null;
                        }
                    }
                };

                BinaryPacker.splitNode = function (node, w, h) {
                    node.used = true;
                    node.down = {
                        x: node.x,
                        y: node.y + h,
                        w: node.w,
                        h: node.h - h
                    };
                    node.right = {
                        x: node.x + w,
                        y: node.y,
                        w: node.w - w,
                        h: h
                    };
                    return node;
                };

                BinaryPacker.growNode = function (w, h) {
                    var canGrowDown = (w <= BinaryPacker.root.w);
                    var canGrowRight = (h <= BinaryPacker.root.h);

                    var shouldGrowRight = canGrowRight && (BinaryPacker.root.h >= (BinaryPacker.root.w + w));
                    var shouldGrowDown = canGrowDown && (BinaryPacker.root.w >= (BinaryPacker.root.h + h));

                    if (shouldGrowRight)
                        return BinaryPacker.growRight(w, h);
                    else if (shouldGrowDown)
                        return BinaryPacker.growDown(w, h);
                    else if (canGrowRight)
                        return BinaryPacker.growRight(w, h);
                    else if (canGrowDown)
                        return BinaryPacker.growDown(w, h);
                    else
                        return null;
                };

                BinaryPacker.growRight = function (w, h) {
                    BinaryPacker.root = {
                        used: true,
                        x: 0,
                        y: 0,
                        w: BinaryPacker.root.w + w,
                        h: BinaryPacker.root.h,
                        down: BinaryPacker.root,
                        right: {
                            x: BinaryPacker.root.w,
                            y: 0,
                            w: w,
                            h: BinaryPacker.root.h
                        }
                    };
                    var node;
                    if (node = BinaryPacker.findNode(BinaryPacker.root, w, h)) {
                        return BinaryPacker.splitNode(node, w, h);
                    } else {
                        return null;
                    }
                };

                BinaryPacker.growDown = function (w, h) {
                    BinaryPacker.root = {
                        used: true,
                        x: 0,
                        y: 0,
                        w: BinaryPacker.root.w,
                        h: BinaryPacker.root.h + h,
                        down: {
                            x: 0,
                            y: BinaryPacker.root.h,
                            w: BinaryPacker.root.w,
                            h: h
                        },
                        right: BinaryPacker.root
                    };
                    var node;
                    if (node = BinaryPacker.findNode(BinaryPacker.root, w, h)) {
                        return BinaryPacker.splitNode(node, w, h);
                    } else {
                        return null;
                    }
                };
                return BinaryPacker;
            })();
            texture.BinaryPacker = BinaryPacker;
        })(core.texture || (core.texture = {}));
        var texture = core.texture;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
///<reference path="../../../reference.ts" />
var pulsar;
(function (pulsar) {
    (function (texture) {
        var BinaryBlock = pulsar.core.texture.BinaryBlock;

        var BinarySortType = pulsar.core.texture.BinarySortType;
        var BinaryPacker = pulsar.core.texture.BinaryPacker;

        var DynamicTextureAtlas = (function () {
            /**
            * Creates a new DynamicTextureAtlas
            * @param uid A unique identifier for use with DynamicTextureAtlas.getLibrary method
            * @param shapePadding The padding value that is appened to each Image Block
            */
            function DynamicTextureAtlas(uid, shapePadding) {
                if (typeof shapePadding === "undefined") { shapePadding = 2; }
                this.uid = uid;
                this.shapePadding = shapePadding;
                /**
                * Contains the blocks used in the Binary Packing
                * @type {Array}
                */
                this.blocks = [];
                DynamicTextureAtlas.LIBS[uid] = this;

                // Create the Canvas&Context
                this.canvas = document.createElement('canvas');
                this.context = this.canvas.getContext('2d');
            }
            DynamicTextureAtlas.getLibrary = function (id) {
                return DynamicTextureAtlas.LIBS[id];
            };

            /**
            * Add an element to the DynamicTextureAtlas
            * @param id The id that will be used to identify the element in the json SpriteAtlas
            * @param image
            */
            DynamicTextureAtlas.prototype.add = function (id, image) {
                var block;
                var shapePadding2x = this.shapePadding * 2;
                if (image instanceof HTMLImageElement) {
                    block = new BinaryBlock(this.shapePadding, this.shapePadding, image.width + shapePadding2x, image.height + shapePadding2x, image, id);
                } else if (image instanceof HTMLCanvasElement) {
                    block = new BinaryBlock(this.shapePadding, this.shapePadding, image.width + shapePadding2x, image.height + shapePadding2x, image, id);
                } else {
                    throw "Image element must be Canvas or Image";
                }

                this.blocks.push(block);
            };

            /**
            *
            * @param id
            * @param dataURL
            */
            DynamicTextureAtlas.prototype.addFromDataURL = function (id, dataURL) {
                var image = new Image();
                image.src = dataURL;

                this.blocks.push(new BinaryBlock(0, 0, image.width, image.height, image, id));
            };

            /**
            * Packs all block elements and generates the BaseTexture & TextureAtlas
            * @param mode
            */
            DynamicTextureAtlas.prototype.render = function (mode) {
                if (typeof mode === "undefined") { mode = BinarySortType.MAX_SIDE; }
                var i;
                var t;
                var total;

                // Packs & Order the image blocks
                BinaryPacker.pack(this.blocks, mode.toString());

                this.canvas.width = pulsar.utils.MathUtils.getNextPowerOfTwo(BinaryPacker.root.w);
                this.canvas.height = pulsar.utils.MathUtils.getNextPowerOfTwo(BinaryPacker.root.h);

                var textureAtlas = {};
                for (i = 0, total = this.blocks.length; i < total; i++) {
                    var cur = this.blocks[i];

                    // create Atlas Element
                    textureAtlas[this.uid + '.' + cur.id] = {
                        frame: { x: cur.fit.x + this.shapePadding, y: cur.fit.y + this.shapePadding, w: cur.fit.w, h: cur.fit.h },
                        rotated: false,
                        trimmed: false,
                        spriteSourceSize: { x: cur.fit.x + this.shapePadding, y: cur.fit.y + this.shapePadding, w: cur.fit.w, h: cur.fit.h },
                        sourceSize: { w: cur.fit.w, h: cur.fit.h }
                    };

                    // draw image to canvas
                    this.context.drawImage(cur.data, cur.fit.x + this.shapePadding, cur.fit.y + this.shapePadding);
                }

                // create texture from resulting canvas
                this.texture = new PIXI.BaseTexture(this.canvas);
                this.textureAtlas = textureAtlas;

                for (t in textureAtlas) {
                    var rect = textureAtlas[t].frame;

                    if (rect) {
                        PIXI.TextureCache[t] = new PIXI.Texture(this.texture, { x: rect.x, y: rect.y, width: rect.w, height: rect.h });

                        if (textureAtlas[t].trimmed) {
                            PIXI.TextureCache[t].realSize = textureAtlas[t].spriteSourceSize;
                            PIXI.TextureCache[t].trim.x = 0;
                        }
                    }
                }

                // Free blocks as it contains image references
                this.blocks = null;

                // Force PIXI to update texture cache for this textxure
                PIXI.texturesToUpdate.push(this.texture);
            };
            DynamicTextureAtlas.LIBS = [];
            return DynamicTextureAtlas;
        })();
        texture.DynamicTextureAtlas = DynamicTextureAtlas;
    })(pulsar.texture || (pulsar.texture = {}));
    var texture = pulsar.texture;
})(pulsar || (pulsar = {}));
/**
* ui.ts
* Created by xperiments on 25/03/14.
*/
///<reference path="../../reference.ts"/>
var pulsar;
(function (pulsar) {
    (function (ui) {
        (function (UIHorizontalAlign) {
            UIHorizontalAlign[UIHorizontalAlign["LEFT"] = 0] = "LEFT";
            UIHorizontalAlign[UIHorizontalAlign["CENTER"] = 1] = "CENTER";
            UIHorizontalAlign[UIHorizontalAlign["RIGHT"] = 2] = "RIGHT";
        })(ui.UIHorizontalAlign || (ui.UIHorizontalAlign = {}));
        var UIHorizontalAlign = ui.UIHorizontalAlign;

        (function (UISkinScaleMode) {
            UISkinScaleMode[UISkinScaleMode["DEFAULT"] = 0] = "DEFAULT";
            UISkinScaleMode[UISkinScaleMode["SCALE3"] = 1] = "SCALE3";
            UISkinScaleMode[UISkinScaleMode["SCALE9"] = 2] = "SCALE9";
        })(ui.UISkinScaleMode || (ui.UISkinScaleMode = {}));
        var UISkinScaleMode = ui.UISkinScaleMode;
    })(pulsar.ui || (pulsar.ui = {}));
    var ui = pulsar.ui;
})(pulsar || (pulsar = {}));
/**
* Created by xperiments on 24/03/14.
*/
///<reference path="../../reference.ts"/>
var pulsar;
(function (pulsar) {
    (function (ui) {
        var DisplayObjectContainer = PIXI.DisplayObjectContainer;

        var EventDispatcher = pulsar.core.events.EventDispatcher;

        var UIComponent = (function (_super) {
            __extends(UIComponent, _super);
            function UIComponent() {
                _super.call(this);
                this.uid = UIComponent.getUID();
            }
            UIComponent.getUID = function () {
                return (UIComponent.UID++).toString(16);
            };

            UIComponent.prototype.setSize = function (width, height) {
            };
            UIComponent.UID = 0;

            UIComponent.defaultTextFormat = {
                font: "bold 20px Arial",
                fill: "#FF00FF"
            };
            return UIComponent;
        })(DisplayObjectContainer);
        ui.UIComponent = UIComponent;
        pulsar.utils.applyMixins(UIComponent, [EventDispatcher]);
    })(pulsar.ui || (pulsar.ui = {}));
    var ui = pulsar.ui;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    /**
    * TextField.ts
    * Created by xperiments on 25/03/14.
    */
    ///<reference path="../../reference.ts"/>
    (function (ui) {
        var TextField = (function (_super) {
            __extends(TextField, _super);
            function TextField(label, textFormat) {
                if (typeof label === "undefined") { label = ""; }
                if (typeof textFormat === "undefined") { textFormat = ui.UIComponent.defaultTextFormat; }
                _super.call(this, label, textFormat);
                this.label = label;
                this.textFormat = textFormat;
            }
            return TextField;
        })(PIXI.Text);
        ui.TextField = TextField;
    })(pulsar.ui || (pulsar.ui = {}));
    var ui = pulsar.ui;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    /**
    * TextInput.ts
    * Created by xperiments on 25/03/14.
    */
    ///<reference path="../../reference.ts"/>
    (function (ui) {
        var TextInput = (function (_super) {
            __extends(TextInput, _super);
            function TextInput() {
                var _this = this;
                _super.call(this);
                var renderTexture = new PIXI.RenderTexture(150, 30);

                var btnGfx = new PIXI.Graphics();
                btnGfx.beginFill(0xFF0000);
                btnGfx.drawRect(0, 0, 150, 30);
                btnGfx.endFill();
                renderTexture.render(btnGfx, { x: 0, y: 0 }, false);
                this.background = new PIXI.Sprite(renderTexture);

                this.background.interactive = true;
                this.background.buttonMode = true;

                this.textfield = new ui.TextField("Input1");

                this.addChild(this.background);
                this.addChild(this.textfield);

                this.background.mousedown = this.background.touchstart = function () {
                    _this.focus();
                };
            }
            TextInput.createDOMInputContainer = function () {
                var input = document.createElement("input");
                input.type = "text";
                input.style.opacity = "1";
                input.style.position = "absolute";
                input.style.top = "0";
                input.style.left = "0";
                input.style.width = input.style.height = "0px";
                document.body.appendChild(input);
                TextInput.DOM_INPUT = input;
            };

            TextInput.prototype.focus = function () {
                this.textfield.setText("");
                TextInput.DOM_INPUT && TextInput.DOM_INPUT.focus();
            };
            TextInput.prototype.blur = function () {
                TextInput.DOM_INPUT && TextInput.DOM_INPUT.blur();
            };
            return TextInput;
        })(ui.UIComponent);
        ui.TextInput = TextInput;
    })(pulsar.ui || (pulsar.ui = {}));
    var ui = pulsar.ui;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    /**
    * Created by xperiments on 24/03/14.
    */
    ///<reference path="../../reference.ts"/>
    (function (ui) {
        var Texture = PIXI.Texture;
        var Sprite = PIXI.Sprite;

        var UISkinScaleMode = pulsar.ui.UISkinScaleMode;
        var Bitmap9 = pulsar.core.display.Bitmap9;

        (function (SimpleButtonFrames) {
            SimpleButtonFrames[SimpleButtonFrames["up"] = 0] = "up";
            SimpleButtonFrames[SimpleButtonFrames["down"] = 1] = "down";
            SimpleButtonFrames[SimpleButtonFrames["over"] = 2] = "over";
            SimpleButtonFrames[SimpleButtonFrames["out"] = 3] = "out";
        })(ui.SimpleButtonFrames || (ui.SimpleButtonFrames = {}));
        var SimpleButtonFrames = ui.SimpleButtonFrames;
        var SimpleButton = (function (_super) {
            __extends(SimpleButton, _super);
            function SimpleButton(label, width, height, textAlign, skin) {
                if (typeof label === "undefined") { label = "Button"; }
                if (typeof width === "undefined") { width = 100; }
                if (typeof height === "undefined") { height = 35; }
                if (typeof textAlign === "undefined") { textAlign = 0 /* LEFT */; }
                if (typeof skin === "undefined") { skin = SimpleButton.DEFAULT_SKIN; }
                _super.call(this);
                this.textures = {};
                this._currentFrame = 0 /* up */;
                this.width = width;
                this.height = height;
                this._text = label;
                this._textAlign = textAlign;
                this._skinData = skin;
                this._initUI();
            }
            Object.defineProperty(SimpleButton.prototype, "text", {
                /* PUBLICS */
                set: function (label) {
                    this._label.setStyle((this._skinData[this._currentFrame] && this._skinData[this._currentFrame].style && this._label.setStyle(this._skinData[this._currentFrame].style)) || ui.UIComponent.defaultTextFormat);
                    this._label.setText(label);
                    this._text = label;
                    this._label.position.y = (this.getBounds().height / 2) - (this._label.getLocalBounds().height / 2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SimpleButton.prototype, "textAlign", {
                set: function (align) {
                    this._labelAlign = align;
                    switch (align) {
                        case 1 /* CENTER */:
                            this._label.position.x = this.getLocalBounds().width / 2 - this._label.getLocalBounds().width / 2;
                            this.text = this._text;
                            break;
                        case 2 /* RIGHT */:
                            this._label.position.x = this.getLocalBounds().width - this._label.getLocalBounds().width;
                            break;
                    }
                },
                enumerable: true,
                configurable: true
            });
            SimpleButton.prototype.setSize = function (width, height) {
                console.log(width, height);
                this.width = width;
                this.height = height;
                this._updateTextures();
            };

            /* PRIVATES */
            SimpleButton.prototype._initUI = function () {
                this._mapTextures(false);

                this._background = new Sprite(this.textures['up']);

                this.addChild(this._background);
                this.interactive = true;
                this.buttonMode = true;
                this.touchstart = this.mousedown = this._onMouseDown.bind(this);
                this.touchend = this.mouseup = this.mouseupoutside = this._onMouseUp.bind(this);

                this._label = new ui.TextField(this._text);
                this.text = this._text;
                this.textAlign = this._textAlign;
                this.addChild(this._label);
            };

            SimpleButton.prototype._updateTextures = function () {
                var _this = this;
                var texture;
                Object.keys(this._skinData).map(function (key) {
                    if (_this._skinData[key].scaleMode == 2 /* SCALE9 */) {
                        _this.textures[key].destroy(true);
                        texture = Texture.fromCanvas(Bitmap9.render(_this._skinData[key], _this.width, _this.height).canvas);
                        _this.textures[key] = texture;
                    }
                });
                this._setButtonFrame(0 /* up */);
            };
            SimpleButton.prototype._mapTextures = function (update) {
                var _this = this;
                var texture;
                Object.keys(this._skinData).map(function (key) {
                    texture = Texture.fromFrame(_this._skinData[key].textureFrame);
                    if (_this._skinData[key].scaleMode == 2 /* SCALE9 */) {
                        texture = Texture.fromCanvas(Bitmap9.render(_this._skinData[key], _this.width, _this.height).canvas);
                    }
                    _this.textures[key] = texture;
                });
            };
            SimpleButton.prototype._setButtonFrame = function (frame) {
                switch (frame) {
                    case 1 /* down */:
                        this._background.setTexture(this.textures['down']);
                        this.dispatchEvent({ type: 'mousedown' });
                        break;

                    case 0 /* up */:
                        this._background.setTexture(this.textures['up']);
                        this.dispatchEvent({ type: 'mouseup' });
                        break;
                }
                this.text = this._text;
            };
            SimpleButton.prototype._onMouseDown = function () {
                this._setButtonFrame(1 /* down */);
            };
            SimpleButton.prototype._onMouseUp = function () {
                this._setButtonFrame(0 /* up */);
            };
            SimpleButton.DEFAULT_SKIN = {
                "up": { textureFrame: "simple-button-up.png" },
                "over": { textureFrame: "simple-button-over.png" },
                "down": { textureFrame: "simple-button-down.png" }
            };
            return SimpleButton;
        })(ui.UIComponent);
        ui.SimpleButton = SimpleButton;
    })(pulsar.ui || (pulsar.ui = {}));
    var ui = pulsar.ui;
})(pulsar || (pulsar = {}));
/**
* SkinLoader.ts
* Created by xperiments on 01/04/14.
*/
///<reference path="../../../reference.ts"/>
var pulsar;
(function (pulsar) {
    (function (ui) {
        (function (loaders) {
            var ThemeLoader = (function (_super) {
                __extends(ThemeLoader, _super);
                function ThemeLoader(skinName, url, crossorigin) {
                    var _this = this;
                    _super.call(this, url, crossorigin);
                    this.skinName = skinName;
                    ThemeLoader._skinDict[skinName] = this;
                    this.addEventListener('loaded', function (event) {
                        console.log(event.content);
                        event.type = "ready";
                        pulsar.utils.setZeroTimeout(function () {
                            _this.dispatchEvent(event);
                        });
                    });
                }
                ThemeLoader.get = function (skinName) {
                    return ThemeLoader._skinDict[skinName] || null;
                };
                ThemeLoader._skinDict = {};
                return ThemeLoader;
            })(PIXI.SpriteSheetLoader);
            loaders.ThemeLoader = ThemeLoader;
        })(ui.loaders || (ui.loaders = {}));
        var loaders = ui.loaders;
    })(pulsar.ui || (pulsar.ui = {}));
    var ui = pulsar.ui;
})(pulsar || (pulsar = {}));
/**
* Sprite9Renderer.ts
* Created by xperiments on 31/03/14.
*/
///<reference path="../../../reference.ts"/>
var pulsar;
(function (pulsar) {
    (function (ui) {
        (function (renderers) {
            var Rectangle = PIXI.Rectangle;

            var Sprite9 = pulsar.core.display.Sprite9;

            var Sprite9Renderer = (function () {
                function Sprite9Renderer() {
                    this.cachedRenderers = {};
                    this.cachedTextures = {};
                }
                Sprite9Renderer.prototype.register = function (id, frame) {
                    if (!this.cachedRenderers[id]) {
                        this.cachedRenderers[id] = new Sprite9(frame, new Rectangle(20, 20, 124, 38));
                    }
                    return this.cachedRenderers[id];
                };

                Sprite9Renderer.prototype.render = function (id, width, height) {
                    if (!this.cachedRenderers[id]) {
                        throw "Error no Texture frame: " + id + " pressent";
                    }
                    var textureKey = JSON.stringify({ id: id, width: width, height: height });
                    if (!this.cachedTextures[textureKey]) {
                        this.cachedTextures[textureKey] = this.cachedRenderers[id].setSize(width, height).flatten();
                    }
                    return this.cachedTextures[textureKey];
                };
                return Sprite9Renderer;
            })();
            renderers.Sprite9Renderer = Sprite9Renderer;
        })(ui.renderers || (ui.renderers = {}));
        var renderers = ui.renderers;
    })(pulsar.ui || (pulsar.ui = {}));
    var ui = pulsar.ui;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    (function (ui) {
        /**
        * Theme.ts
        * Created by xperiments on 02/04/14.
        */
        ///<reference path="../../../reference.ts"/>
        (function (themes) {
            var SpriteSheetLoader = PIXI.SpriteSheetLoader;
            var setZeroTimeout = pulsar.utils.setZeroTimeout;
            var EventDispatcher = pulsar.core.events.EventDispatcher;

            var Theme = (function () {
                function Theme() {
                    var _this = this;
                    this.crossOrigin = false;
                    this._loader = new SpriteSheetLoader(this.url, this.crossOrigin);
                    this._loader.addEventListener(Theme.LOAD, function (event) {
                        event.type = Theme.READY;
                        setZeroTimeout(function () {
                            _this.dispatchEvent(event);
                        });
                    });
                }
                Theme.prototype.load = function () {
                };
                Theme.prototype.onLoaded = function () {
                };
                return Theme;
            })();
            themes.Theme = Theme;
            pulsar.utils.applyMixins(ui.UIComponent, [EventDispatcher]);
            (function (Theme) {
                var _skinDict = {};
                function get(skinName) {
                    return _skinDict[skinName] || null;
                }
                Theme.get = get;
                function set(skinName, theme) {
                    _skinDict[skinName] = theme;
                }
                Theme.set = set;
                Theme.LOAD = "load";
                Theme.READY = "ready";
            })(themes.Theme || (themes.Theme = {}));
            var Theme = themes.Theme;
        })(ui.themes || (ui.themes = {}));
        var themes = ui.themes;
    })(pulsar.ui || (pulsar.ui = {}));
    var ui = pulsar.ui;
})(pulsar || (pulsar = {}));
///<reference path="../../../reference.ts" />
var pulsar;
(function (pulsar) {
    (function (core) {
        (function (texture) {
            var Texture = PIXI.Texture;

            var Bitmap9 = pulsar.core.display.Bitmap9;

            var Skin = (function () {
                function Skin() {
                }
                Skin.getScale1Texture = function (skin) {
                    return Texture.fromFrame(skin.textureFrame);
                };
                Skin.getScale9Texture = function (skin, width, height) {
                    if (typeof width === "undefined") { width = 100; }
                    if (typeof height === "undefined") { height = 100; }
                    return Bitmap9.render(skin, width, height);
                };
                Skin.getScale3Texture = function (skin) {
                };
                return Skin;
            })();
            texture.Skin = Skin;
        })(core.texture || (core.texture = {}));
        var texture = core.texture;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
var pulsar;
(function (pulsar) {
    (function (core) {
        /**
        * Created by xperiments on 24/03/14.
        */
        ///<reference path="../../../reference.ts"/>
        (function (display) {
            var DisplayObjectContainer = PIXI.DisplayObjectContainer;

            var EventDispatcher = pulsar.core.events.EventDispatcher;

            var StaticEvent = pulsar.core.events.StaticEvent;
            var Event = pulsar.core.events.Event;

            var DragabbleEvent = (function () {
                function DragabbleEvent() {
                }
                DragabbleEvent.DRAG_START = null;
                DragabbleEvent.DRAG_END = null;
                DragabbleEvent.DRAG_MOVE = null;
                return DragabbleEvent;
            })();
            display.DragabbleEvent = DragabbleEvent;
            (function (DragabbleEvent) {
                StaticEvent.init(DragabbleEvent);
            })(display.DragabbleEvent || (display.DragabbleEvent = {}));
            var DragabbleEvent = display.DragabbleEvent;

            var Dragabble = (function (_super) {
                __extends(Dragabble, _super);
                function Dragabble() {
                    var _this = this;
                    _super.call(this);
                    this._isDragging = false;
                    this._canDrag = false;
                    this.mousedown = function (event) {
                        event.originalEvent.preventDefault();
                        _this._dragEventData = event;
                        _this._isDragging = true;
                        _this.dispatchEvent(new Event(DragabbleEvent.DRAG_START));
                    };
                    this.touchstart = this.mousedown;
                    this.mouseup = function (event) {
                        _this._dragEventData = null;
                        _this._isDragging = false;
                        ;
                        _this.dispatchEvent(new Event(DragabbleEvent.DRAG_END));
                    };
                    this.mouseupoutside = this.mouseup;
                    this.touchend = this.mouseup;
                    this.touchendoutside = this.mouseup;
                    this.mousemove = function (event) {
                        if (_this._isDragging) {
                            var newPosition = _this._dragEventData.getLocalPosition(_this.parent);
                            _this.position.x = newPosition.x;
                            _this.position.y = newPosition.y;
                            _this.dispatchEvent(new Event(DragabbleEvent.DRAG_MOVE, _this.position));
                        }
                    };
                    this.touchmove = this.mousemove;
                    this.interactive = true;
                    this.buttonMode = true;
                }
                Dragabble.DRAG_START = "pulsar.core.display";
                return Dragabble;
            })(DisplayObjectContainer);
            display.Dragabble = Dragabble;
            pulsar.utils.applyMixins(Dragabble, [EventDispatcher]);
        })(core.display || (core.display = {}));
        var display = core.display;
    })(pulsar.core || (pulsar.core = {}));
    var core = pulsar.core;
})(pulsar || (pulsar = {}));
/**
* TypedArrayPolyfill.ts
* Created by xperiments on 07/04/14.
*/
///<reference path="../../../reference.ts"/>
// Checking if the typed arrays are supported
/* IE9 polyfill
(function checkTypedArrayCompatibility() {
if (typeof Uint8Array !== 'undefined') {
// some mobile versions do not support subarray (e.g. safari 5 / iOS)
if (typeof Uint8Array.prototype.subarray === 'undefined') {
Uint8Array.prototype.subarray = function subarray(start, end) {
return new Uint8Array(this.slice(start, end));
};
Float32Array.prototype.subarray = function subarray(start, end) {
return new Float32Array(this.slice(start, end));
};
}
// some mobile version might not support Float64Array
if (typeof Float64Array === 'undefined') {
window.Float64Array = Float32Array;
}
return;
}
function subarray(start, end) {
return new TypedArray(this.slice(start, end));
}
function setArrayOffset(array, offset) {
if (arguments.length < 2) {
offset = 0;
}
for (var i = 0, n = array.length; i < n; ++i, ++offset) {
this[offset] = array[i] & 0xFF;
}
}
function TypedArray(arg1) {
var result;
if (typeof arg1 === 'number') {
result = [];
for (var i = 0; i < arg1; ++i) {
result[i] = 0;
}
} else if ('slice' in arg1) {
result = arg1.slice(0);
} else {
result = [];
for (var i = 0, n = arg1.length; i < n; ++i) {
result[i] = arg1[i];
}
}
result.subarray = subarray;
result.buffer = result;
result.byteLength = result.length;
result.set = setArrayOffset;
if (typeof arg1 === 'object' && arg1.buffer) {
result.buffer = arg1.buffer;
}
return result;
}
window.Uint8Array = TypedArray;
window.Int8Array = TypedArray;
// we don't need support for set, byteLength for 32-bit array
// so we can use the TypedArray as well
window.Uint32Array = TypedArray;
window.Int32Array = TypedArray;
window.Uint16Array = TypedArray;
window.Float32Array = TypedArray;
window.Float64Array = TypedArray;
})();
*/
var pulsar;
(function (pulsar) {
    (function (utils) {
        /**
        * Created by xperiments on 24/03/14.
        */
        ///<reference path="../../../reference.ts"/>
        (function (display) {
            var DisplayObjectContainer = PIXI.DisplayObjectContainer;

            var Graphics = PIXI.Graphics;

            var Rectangle = PIXI.Rectangle;

            var Dragabble = pulsar.core.display.Dragabble;
            var DragabbleEvent = pulsar.core.display.DragabbleEvent;

            var TranformTool = (function (_super) {
                __extends(TranformTool, _super);
                function TranformTool() {
                    _super.call(this);
                    this.initialize();
                }
                TranformTool.prototype.initialize = function () {
                    var _this = this;
                    this.anchorPoints = {
                        TOP_LEFT: this.createAnchor(),
                        TOP_RIGHT: this.createAnchor(),
                        BOTTOM_RIGHT: this.createAnchor(),
                        BOTTOM_LEFT: this.createAnchor()
                    };
                    Object.keys(this.anchorPoints).forEach(function (key) {
                        _this.addChild(_this.anchorPoints[key]);
                    });

                    this.anchorMove = function (e) {
                        return _this.onAnchorMove(e);
                    };
                    this.anchorPoints.TOP_LEFT.addEventListener(DragabbleEvent.DRAG_MOVE, this.anchorMove);
                    this.anchorPoints.TOP_RIGHT.addEventListener(DragabbleEvent.DRAG_MOVE, this.anchorMove);
                    this.anchorPoints.BOTTOM_LEFT.addEventListener(DragabbleEvent.DRAG_MOVE, this.anchorMove);
                    this.anchorPoints.BOTTOM_RIGHT.addEventListener(DragabbleEvent.DRAG_MOVE, this.anchorMove);

                    this.anchorDragStart = function (e) {
                        return _this.onAnchorDragStart(e);
                    };
                    this.anchorPoints.TOP_LEFT.addEventListener(DragabbleEvent.DRAG_START, this.anchorDragStart);
                    this.anchorPoints.TOP_RIGHT.addEventListener(DragabbleEvent.DRAG_START, this.anchorDragStart);
                    this.anchorPoints.BOTTOM_LEFT.addEventListener(DragabbleEvent.DRAG_START, this.anchorDragStart);
                    this.anchorPoints.BOTTOM_RIGHT.addEventListener(DragabbleEvent.DRAG_START, this.anchorDragStart);

                    this.anchorDragEnd = function (e) {
                        return _this.onAnchorDragEnd(e);
                    };
                    this.anchorPoints.TOP_LEFT.addEventListener(DragabbleEvent.DRAG_END, this.anchorDragEnd);
                    this.anchorPoints.TOP_RIGHT.addEventListener(DragabbleEvent.DRAG_END, this.anchorDragEnd);
                    this.anchorPoints.BOTTOM_LEFT.addEventListener(DragabbleEvent.DRAG_END, this.anchorDragEnd);
                    this.anchorPoints.BOTTOM_RIGHT.addEventListener(DragabbleEvent.DRAG_END, this.anchorDragEnd);
                };
                TranformTool.prototype.setTarget = function (target) {
                    this.target = target;
                    this.position = target.position;
                    this.anchorPoints.TOP_LEFT.position.x = 0;
                    this.anchorPoints.TOP_LEFT.position.y = 0;

                    this.anchorPoints.TOP_RIGHT.position.x = this.target.width;
                    this.anchorPoints.TOP_RIGHT.position.y = this.target.position.y;

                    this.anchorPoints.BOTTOM_LEFT.position.x = 0;
                    this.anchorPoints.BOTTOM_LEFT.position.y = this.target.height;

                    this.anchorPoints.BOTTOM_RIGHT.position.x = this.target.width;
                    this.anchorPoints.BOTTOM_RIGHT.position.y = this.target.height;
                };
                TranformTool.prototype.onAnchorDragStart = function (e) {
                    var _this = this;
                    console.log('AAAA');
                    Mousetrap.bind('shift', function () {
                        return _this.onShiftKey();
                    }, 'keydown');
                    Mousetrap.bind('shift', function () {
                        return _this.offShiftKey();
                    }, 'keyup');
                };
                TranformTool.prototype.onAnchorDragEnd = function (e) {
                    Mousetrap.unbind('shift', 'keydown');
                    Mousetrap.unbind('shift', 'keyup');
                };
                TranformTool.prototype.onShiftKey = function () {
                    console.log('SHIFT');
                    this.shiftKeyPressed = true;
                };
                TranformTool.prototype.offShiftKey = function () {
                    console.log('-SHIFT');
                    this.shiftKeyPressed = false;
                };
                TranformTool.prototype.onAnchorMove = function (e) {
                    switch (e.target) {
                        case this.anchorPoints.TOP_LEFT:
                            this.anchorPoints.TOP_RIGHT.position.y = this.anchorPoints.TOP_LEFT.position.y;
                            this.anchorPoints.BOTTOM_LEFT.position.x = this.anchorPoints.TOP_LEFT.position.x;
                            break;
                        case this.anchorPoints.TOP_RIGHT:
                            this.anchorPoints.TOP_LEFT.position.y = this.anchorPoints.TOP_RIGHT.position.y;
                            this.anchorPoints.BOTTOM_RIGHT.position.x = this.anchorPoints.TOP_RIGHT.position.x;
                            break;
                        case this.anchorPoints.BOTTOM_LEFT:
                            this.anchorPoints.TOP_LEFT.position.x = this.anchorPoints.BOTTOM_LEFT.position.x;
                            this.anchorPoints.BOTTOM_RIGHT.position.y = this.anchorPoints.BOTTOM_LEFT.position.y;
                            break;
                        case this.anchorPoints.BOTTOM_RIGHT:
                            this.anchorPoints.TOP_RIGHT.position.x = this.anchorPoints.BOTTOM_RIGHT.position.x;
                            this.anchorPoints.BOTTOM_LEFT.position.y = this.anchorPoints.BOTTOM_RIGHT.position.y;
                            break;
                    }

                    this.target && this.target.setSize(this.anchorPoints.BOTTOM_RIGHT.position.x, this.anchorPoints.BOTTOM_RIGHT.position.y);
                };
                TranformTool.prototype.createAnchor = function () {
                    var dragableAnchor = new Dragabble();
                    var g = new Graphics();
                    g.interactive = true;
                    g.buttonMode = true;
                    g.beginFill(0xFF0000);
                    g.drawRect(0, 0, 10, 10);
                    g.hitArea = new Rectangle(0, 0, 10, 10);
                    dragableAnchor.addChild(g);
                    return dragableAnchor;
                };
                return TranformTool;
            })(DisplayObjectContainer);
            display.TranformTool = TranformTool;
        })(utils.display || (utils.display = {}));
        var display = utils.display;
    })(pulsar.utils || (pulsar.utils = {}));
    var utils = pulsar.utils;
})(pulsar || (pulsar = {}));
/**
* LibraryTest.ts
* Created by xperiments on 07/04/14.
*/
///<reference path="../reference.ts"/>
/*
if (window.attachEvent) {window.attachEvent('onload', your_function);}
else if (window.addEventListener) {window.addEventListener('load', your_function, false);}
else {document.addEventListener('load', your_function, false);}
window.addEventListener() =()=>
{
$LIB.load('resources/demo.lib.png' ).addEventListener(pulsar.core.events.Event.COMPLETE, onLoaded );
}
function onLoaded()
{
$LIB('SmartNews').injectScript("/js/libs/jquery.xml2json.js");
}*/
/**
* Created by xperiments on 18/03/14.
*/
///<reference path="../reference.ts"/>
var _this = this;
var DisplayObjectContainer = PIXI.DisplayObjectContainer;
var DisplayObject = PIXI.DisplayObject;
var MovieClip = PIXI.MovieClip;
var Texture = PIXI.Texture;
var Sprite = PIXI.Sprite;
var Stage = PIXI.Stage;

var Point = PIXI.Point;
var Rectangle = PIXI.Rectangle;
var Sprite9 = pulsar.core.display.Sprite9;
var UISkinScaleMode = pulsar.ui.UISkinScaleMode;
var Sprite9Renderer = pulsar.ui.renderers.Sprite9Renderer;
var TranformTool = pulsar.utils.display.TranformTool;

var stage;
var renderer;
var evntDownBind;
var evntupBind;
var button;
var button1;
var button2;

var textInput;
window.onload = function () {
    stage = new pulsar.core.display.Stage(0x0FFFF0, true);
    renderer = PIXI.autoDetectRenderer(800, 600);

    document.body.appendChild(renderer.view);
    renderer.render(stage);

    var l = new pulsar.ui.loaders.ThemeLoader("pulsar.ui.default", "resources/ui.json", true);
    l.addEventListener("ready", function (event) {
        console.log('====', event.type, event.content.json);
        button = new pulsar.ui.SimpleButton("Demo", 100, 78, 0 /* LEFT */, {
            "up": {
                textureFrame: "simple-button-up.png",
                scaleMode: 2 /* SCALE9 */,
                scaleGrid: new PIXI.Rectangle(10, 10, 134, 58)
            },
            "over": {
                textureFrame: "simple-button-over.png",
                scaleMode: 2 /* SCALE9 */,
                scaleGrid: new PIXI.Rectangle(10, 10, 134, 58)
            },
            "down": {
                textureFrame: "simple-button-down.png",
                scaleMode: 2 /* SCALE9 */,
                scaleGrid: new PIXI.Rectangle(10, 10, 134, 58),
                style: { font: '30px Arial', fill: '#FFFFFF' }
            }
        });
        evntDownBind = button.addEventListener("mousedown", down.bind(_this));
        evntupBind = button.addEventListener("mouseup", up.bind(_this));

        button1 = new pulsar.ui.SimpleButton("Demo1", 1 /* CENTER */);
        button2 = new pulsar.ui.SimpleButton("Demo2", 2 /* RIGHT */);

        button1.position.x = 160;
        button2.position.x = 320;

        pulsar.ui.TextInput.createDOMInputContainer();
        textInput = new pulsar.ui.TextInput();
        textInput.position.y = 120;

        stage.addChild(button);
        stage.addChild(button1);
        stage.addChild(button2);
        stage.addChild(textInput);

        var buttonRenderer9 = new Sprite9Renderer();
        buttonRenderer9.register("base", "simple-button-down.png");
        var c = new Sprite(buttonRenderer9.render("base", 300, 300));
        var d = new Sprite(buttonRenderer9.render("base", 400, 80));
        var e = new Sprite(buttonRenderer9.render("base", 400, 80));
        d.position.y = 200;

        //scale9Sprite.position.x = 300;
        //scale9Sprite.position.y = 300;
        //stage.addChild( c );
        //stage.addChild( d );
        var tranformTool = new TranformTool();
        stage.addChild(tranformTool);
        tranformTool.setTarget(button);
        OEF();
    });
    l.load();
};

var XX = 0;

function down() {
    console.log('down');
}
function up() {
    console.log('up');
    //button.removeEventListener( "mousedown", evntDownBind )
    //button.removeEventListener( "mouseup", evntupBind )
}
function OEF() {
    //button.position.x = Math.sin( (XX++) * .017453292519943295 )*500;
    //button.position.y = Math.sin( (XX++) * .017453292519943295 )*500;
    //button.rotation+=.017453292519943295;
    requestAnimationFrame(OEF);
    renderer.render(stage);
}
/// <reference path="typings/pixi/pixi.d.ts" />
/// <reference path="typings/tsd.d.ts" />
/// <reference path="typings/tween.js/tween.js.d.ts" />
/// <reference path="typings/mousetrap/mousetrap.d.ts" />
/// <reference path="pulsar/utils/utils.ts" />
/// <reference path="pulsar/utils/ZeroTimeout.ts" />
/// <reference path="pulsar/utils/MathUtils.ts" />
/* CORE */
/// <reference path="pulsar/core/events/events.ts" />
/// <reference path="pulsar/core/events/StaticEvent.ts" />
/// <reference path="pulsar/core/events/FrameLoop.ts" />
/// <reference path="pulsar/core/display/display.ts" />
/// <reference path="pulsar/core/display/Stage.ts" />
/// <reference path="pulsar/core/display/Bitmap9.ts" />
/// <reference path="pulsar/core/display/Sprite9.ts" />
/* LIBRARY MANAGEMENT */
/// <reference path="pulsar/core/library/CssInjector.ts" />
/// <reference path="pulsar/core/library/ScriptInjector.ts" />
/// <reference path="pulsar/core/library/LibraryParser.ts" />
/// <reference path="pulsar/core/library/Library.ts" />
/// <reference path="pulsar/core/library/LibraryFactory.ts" />
/// <reference path="pulsar/core/library/LibraryLoader.ts" />
/// <reference path="pulsar/core/library/Shape.ts" />
/// <reference path="pulsar/core/parsers/HSON.ts" />
/// <reference path="pulsar/core/texture/BinaryPacker.ts" />
/// <reference path="pulsar/core/texture/DynamicTextureAtlas.ts" />
/// <reference path="pulsar/ui/ui.ts" />
/// <reference path="pulsar/ui/UIComponent.ts" />
/// <reference path="pulsar/ui/TextField.ts" />
/// <reference path="pulsar/ui/TextInput.ts" />
/// <reference path="pulsar/ui/SimpleButton.ts" />
/// <reference path="pulsar/ui/loaders/ThemeLoader.ts" />
/// <reference path="pulsar/ui/renderers/Sprite9Renderer.ts" />
/// <reference path="pulsar/ui/themes/Theme.ts" />
/// <reference path="pulsar/core/texture/Skin.ts" />
//grunt-start
/// <reference path="pulsar/core/display/Dragabble.ts" />
/// <reference path="pulsar/core/library/TypedArrayPolyfill.ts" />
/// <reference path="pulsar/utils/display/TranformTool.ts" />
/// <reference path="tests/LibraryTest.ts" />
/// <reference path="tests/Test.ts" />
//grunt-end
//# sourceMappingURL=app.js.map
