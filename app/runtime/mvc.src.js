(function(GLOBAL,undefined,define){var jsDump;
(function(){function quote(str){return'"'+str.toString().replace(/"/g,'\\"')+'"'}function literal(o){return o+""}function join(pre,arr,post){var s=jsDump.separator(),base=jsDump.indent();inner=jsDump.indent(1);if(arr.join)arr=arr.join(","+s+inner);if(!arr)return pre+post;return[pre,inner+arr,base+post].join(s)}function array(arr){var i=arr.length,ret=Array(i);this.up();while(i--)ret[i]=this.parse(arr[i]);this.down();return join("[",ret,"]")}var reName=/^function (\w+)/;jsDump={parse:function(obj,type){var parser=
this.parsers[type||this.typeOf(obj)];type=typeof parser;return type=="function"?parser.call(this,obj):type=="string"?parser:this.parsers.error},typeOf:function(obj){var type=typeof obj,f="function";return type!="object"&&type!=f?type:!obj?"null":obj.exec?"regexp":obj.getHours?"date":obj.scrollBy?"window":obj.nodeName=="#document"?"document":obj.nodeName?"node":obj.item?"nodelist":obj.callee?"arguments":obj.call||obj.constructor!=Array&&(obj+"").indexOf(f)!=-1?f:"length"in obj?"array":type},separator:function(){return this.multiline?
this.HTML?"\x3cbr /\x3e":"\n":this.HTML?"\x26nbsp;":" "},indent:function(extra){if(!this.multiline)return"";var chr=this.indentChar;if(this.HTML)chr=chr.replace(/\t/g,"   ").replace(/ /g,"\x26nbsp;");return Array(this._depth_+(extra||0)).join(chr)},up:function(a){this._depth_+=a||1},down:function(a){this._depth_-=a||1},setParser:function(name,parser){this.parsers[name]=parser},quote:quote,literal:literal,join:join,_depth_:1,parsers:{window:"[Window]",document:"[Document]",error:"[ERROR]",unknown:"[Unknown]",
"null":"null",undefined:"undefined","function":function(fn){var ret="function",name="name"in fn?fn.name:(reName.exec(fn)||[])[1];if(name)ret+=" "+name;ret+="(";ret=[ret,this.parse(fn,"functionArgs"),"){"].join("");return join(ret,this.parse(fn,"functionCode"),"}")},array:array,nodelist:array,arguments:array,object:function(map){var ret=[];this.up();for(var key in map)ret.push(this.parse(key,"key")+": "+this.parse(map[key]));this.down();return join("{",ret,"}")},node:function(node){var open=this.HTML?
"\x26lt;":"\x3c",close=this.HTML?"\x26gt;":"\x3e";var tag=node.nodeName.toLowerCase(),ret=open+tag;for(var a in this.DOMAttrs){var val=node[this.DOMAttrs[a]];if(val)ret+=" "+a+"\x3d"+this.parse(val,"attribute")}return ret+close+open+"/"+tag+close},functionArgs:function(fn){var l=fn.length;if(!l)return"";var args=Array(l);while(l--)args[l]=String.fromCharCode(97+l);return" "+args.join(", ")+" "},key:quote,functionCode:"[code]",attribute:quote,string:quote,date:quote,regexp:literal,number:literal,"boolean":literal},
DOMAttrs:{id:"id",name:"name","class":"className"},HTML:false,indentChar:"   ",multiline:true}})();;(function(){"use strict";



//== __global_defines.js ======================================================

'use strict';/**
 * @define {boolean}
 */
var DEBUG = true;

/**
 * @define {string}
 */
var FILE_NAME = "mvc.src.js";

/**
 * @define {string}
 */
var FILE_VERSION = "8.10.2.201809120835";

/**
 * @define {number}
 */
var SLOWDOWN = 0;




//== __global_export.js =======================================================

/*
 * Exporting
 */

/**
 * Exposes an unobfuscated global namespace path for the given object. Note that fields of the exported object will be obfuscated,
 * unless they are exported in turn via this function or goog.exportProperty
 * <p>
 * Also handy for making public items that are defined in anonymous closures.
 * 
 * @param {string} publicPath Unobfuscated name to export.
 * @param {*} object Value the name should point to.
 * @param {Object=} objectToExportTo Object to add the path to; default is <code>GLOBAL</code>.
 */
var exportSymbol = function(publicPath, object, objectToExportTo) {
  _exportPath(publicPath, object, objectToExportTo);
};

/**
 * Builds an object structure for the provided namespace path, ensuring that names that already exist are not overwritten. <br>
 * For example: "a.b.c" -> a = {};a.b={};a.b.c={};
 * 
 * @private
 * @param {string} name Name of the object that this file defines.
 * @param {*=} object Value to expose at the end of the path.
 * @param {Object=} objectToExportTo Object to add the path to; default is <code>GLOBAL</code>.
 */
var _exportPath = function(name, object, objectToExportTo) {
  var parts = name.split(".");
  var cur = objectToExportTo || GLOBAL;
  
  /*
   * Certain browsers cannot parse code in the form for((a in b); c;); This pattern is produced by the Closure Compiler when it
   * collapses the statement above into the conditional loop below. To prevent this from happening, use a for-loop and reserve the
   * init logic as below.
   */
  for (var part;parts.length && (part = parts.shift());) {
    var curPrev = cur;
    if (!parts.length && object !== undefined) {
      /* Last part and we have an object; use it */
      cur[part] = object;
      if (DEBUG) {
        _processExportedSymbol(cur, part, object);
      }
    } else {
      if (cur[part]) {
        cur = cur[part];
      } else {
        cur = cur[part] = {};
        if (DEBUG) {
          _processExportedSymbol(curPrev, part, cur);
        }
      }
    }
  }
};

/**
 * Exports a property unobfuscated into the object's namespace.
 * 
 * @param {Object} object Object whose static property is being exported.
 * @param {string} publicName Unobfuscated name to export.
 * @param {*} symbol Value the name should point to.
 */
var exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
  if (DEBUG) {
    _processExportedSymbol(object, publicName, symbol);
  }
};

if (DEBUG) {
  
  /**
   * Processes a symbol that was just exported.
   * 
   * @private
   * @param {!Object} owner Owner object.
   * @param {string} property Property name.
   * @param {*} value Property value.
   */
  var _processExportedSymbol = function(owner, property, value) {
    var parentName, name;
    
    /* Name all symbols */
    if (value && (typeof value === "function" || typeof value === "object")) {
      parentName = owner === GLOBAL ? "" : _getSymbolName(owner) || null;
      if (parentName !== null) {
        name = parentName ? parentName + "." + property : property;
        
        _nameSymbol(value, name);
        if (typeof value === "function") {
          _nameSymbol(value.prototype, name + ".prototype");
        }
      }
    }
  };
  
  /**
   * Gives a debug name to a symbol.
   * 
   * @private
   * @param {*} symbol Symbol to name.
   * @param {string} name Name to give.
   */
  var _nameSymbol = function(symbol, name) {
    
    /* Test whether defineProperty can be used with native objects */
    var nativeDefinePropertySupported = false;
    try {
      var o = {};
      Object.defineProperty(o, "test", {value:"foo"});
      nativeDefinePropertySupported = o["test"] === "foo";
    } catch (e) {
    }
    
    /* Proceed only if read-only, non-enumerable properties can be defined */
    var _nameSymbolImpl;
    if (nativeDefinePropertySupported) {
      _nameSymbolImpl = function(symbol, name) {
        if (!Object.prototype.hasOwnProperty.call(symbol, "__wr_symbol")) {
          Object.defineProperty(symbol, "__wr_symbol", {value:name, enumerable:false, configurable:true});
        }
        
        /* Give a displayName property to functions for Firebug */
        if (typeof symbol === "function" && !Object.prototype.hasOwnProperty.call(symbol, "displayName")) {
          Object.defineProperty(symbol, "displayName", {value:name, configurable:true});
        }
      };
    } else {
      _nameSymbolImpl = function(symbol, name) {
      };
    }
    _nameSymbol = _nameSymbolImpl;
    
    _nameSymbolImpl(symbol, name);
  };
  
  /**
   * Gets the debug name of a symbol.
   * 
   * @private
   * @param {*} symbol Symbol.
   * @return {?string} Name or <code>null</code>.
   */
  var _getSymbolName = function(symbol) {
    return symbol["__wr_symbol"] || null;
  };
  
}
;




//== __global_tools.js ========================================================

/*
 * Special values and functions
 */

/**
 * A function that does not return or do anything.
 * 
 * @internal
 */
var EMPTY_FUNCTION = function() {
};

/*
 * OO constructs
 */

/**
 * Placeholder function for use in interfaces and abstract classes to implement abstract methods.
 * <p>
 * The returned function always throws an error, so that if it is not overridden by an actual implementation, a runtime error will
 * result.
 * 
 * @internal
 * @const
 * @type {function(?):?}
 * @throws {Error} Always, since this function should never be called in a correct program.
 */
var ABSTRACT_METHOD = function() {
  throw new Error("Unimplemented abstract method");
};
/**
 * Constructs a new object having a specific object as prototype.
 * <p>
 * This function enables creating objects with a specific prototype chain without having to create an ad-hoc constructor function.
 * 
 * @internal
 * @param {Object} proto Object to use as prototype for the new object or <code>null</code> for using the the built-in {@link Object}
 *            prototype.
 * @param {Object=} properties Own properties to set on the new object. If not specified, nothing is set.
 * @return {!Object} Created object.
 */
var newObject = function(proto, properties) {
  var o;
  if (proto) {
    /** @constructor */
    var ctor = function() {
    };
    ctor.prototype = proto;
    o = new ctor;
  } else {
    o = {};
  }
  if (properties) {
    for (var p in properties) {
      if (properties.hasOwnProperty(p)) {
        o[p] = properties[p];
      }
    }
  }
  return o;
};

/**
 * @private
 * @param {!Function} derived
 * @param {!Function} base
 */
var _extendConstructor = function(derived, base) {
  derived._super = base.prototype;
  derived.prototype = newObject(base.prototype);
  derived.prototype["constructor"] = derived;
};

/**
 * Implements inheritance by having a constructor extend a base constructor.
 * <p>
 * Instances of the derived constructor will successfully pass an <code>instanceof</code> test against both their constructor and all
 * super-constructors. In addition, all constructor instances will inherit prototype properties of all super-constructors.
 * 
 * @internal
 * @param {function(new:Object)} derived Derived (more specific) constructor function.
 * @param {function(new:Object)} base Base (more generic) constructor function.
 */
var extendConstructor = _extendConstructor;

/**
 * Implements inheritance by having a function prototype extend the prototype of another function.
 * 
 * @internal
 * @param {*} derived Derived (more specific) function.
 * @param {*} base Base (more generic) function.
 */
var extendFunctionPrototype = (_extendConstructor);

/*
 * Tools for dynamic type checking
 */

if (DEBUG) {
  
  /**
   * Checks implementation of an interface on an object.
   * 
   * @param {*} iface Interface to check or <code>null</code> to check only for <code>null</code> and <code>undefined</code>.
   * @param {*} object Object to check.
   * @throws {TypeError} if interface check fails.
   */
  var checkInterface = function(iface, object) {
    var problem = _checkInterface(object, iface);
    if (problem) {
      throw new TypeError("Object does not fully implement interface " + iface + ". " + problem);
    }
  };
  
}

/**
 * Tests whether an object implements an interface.
 * 
 * @internal
 * @param {*} object Object to test against.
 * @param {*} iface Interface to test or <code>null</code> to test only for <code>null</code> or <code>undefined</code>.
 * @return {boolean} <code>true</code> if object implements the interface, <code>false</code> if it does not.
 */
var implementsInterface = function(object, iface) {
  return _checkInterface(object, iface) === null;
};

/**
 * Internally checks conformity of an object to an interface.
 * 
 * @private
 * @param {*} object Object to check.
 * @param {*} iface Interface to check or <code>null</code> to check only for <code>null</code> and <code>undefined</code>.
 * @return {?string} Message describing the first problem that makes the object not implement the interface or <code>null</code> if
 *         there is no such problem and the object fully implements the interface.
 */
var _checkInterface = function(object, iface) {
  var objectType = typeof object;
  if (objectType === "undefined" || object === null) {
    return "Object is null or undefined";
  }
  /* Determine the collection of properties to check */
  var properties;
  if (typeof iface === "function") {
    properties = iface.prototype;
  } else {
    properties = iface;
  }
  
  /*
   * Check that properties exist on the object prototype chain. Also check that functions and non-functions are the same properties.
   */
  var pType, oType;
  for (var p in properties) {
    pType = typeof properties[p];
    oType = typeof object[p];
    if (oType === "undefined") {
      return "Missing property '" + p + "'";
    }
    if (pType === "function" && oType !== "function" || pType !== "function" && oType === "function") {
      return "Property '" + p + "' " + (pType === "function" ? "should be" : "should not be") + " a function";
    }
  }
  
  /* Conforming */
  return null;
};

/*
 * Tools to aid debugging
 */

if (DEBUG) {
  
  /*
   * Extend native Object and Function prototypes with a new toString method that works differently only for symbols exported from
   * this library. This should be safe... and anyway, it's just for debug mode.
   */
  if (GLOBAL.Object && GLOBAL.Object.prototype) {
    GLOBAL.Object.prototype.toString = function() {
      var $super = GLOBAL.Object.prototype.toString;
      return function() {
        var symbolInfo = this && this["__wr_symbol"];
        
        /* Use symbol name if present */
        if (symbolInfo) {
          return String(symbolInfo);
        }
        
        return $super.call(this);
      };
    }();
  }
  if (GLOBAL.Function && GLOBAL.Function.prototype) {
    GLOBAL.Function.prototype.toString = function() {
      var $super = GLOBAL.Function.prototype.toString;
      return function() {
        var symbolInfo = this && this["__wr_symbol"];
        
        /* Use symbol name if present */
        if (symbolInfo) {
          return String(symbolInfo);
        }
        
        return $super.call(this);
      };
    }();
  }
  
}
;




//== wr/mvc/_mvc.js ===========================================================

var wr = {};
wr.mvc = {};

/**
 * @name wr.mvc
 * @namespace MVC library for implementing Angular applications on top of the WebRatio Module Runtime.
 *            <p>
 *            The entry point is the {@link wr.mvc.App} module, which should be bootstrapped on the main container HTML node. The
 *            directives and filters supplied by {@link wr.mvc.App} can then be used to wire the application to the WebRatio Mobile
 *            Runtime.
 */

/**
 * Key used for attaching the WebRatio modeled validation behavior to form fields.
 * <p>
 * The key is used in <code>ng-model</code> controllers and will also appear in special CSS classes used to signal a field validation
 * state. For example, a field invalid due to WebRatio validation will have the <code>ng-invalid-wr-validation</code> class applied to
 * it.
 * 
 * @const
 */
wr.mvc.VALIDATION_VALIDATOR_KEY = "wrValidation";

/**
 * @internal
 * @type {!Object<wrm.data.Type,string>}
 */
wr.mvc.PLATFORM_VALIDATION_KEY = {integer:"typeValidation.integer", float:"typeValidation.float", decimal:"typeValidation.decimal", date:"typeValidation.date", time:"typeValidation.time", timestamp:"typeValidation.timestamp"};

if (DEBUG) {
  wrm.util.obj.getEnumValues(wrm.data.Type).forEach(function(type) {
    if (!(wrm.data.Type.isTextual(type) || type === wrm.data.Type.BLOB || type === wrm.data.Type.BOOLEAN) && !wr.mvc.PLATFORM_VALIDATION_KEY[type]) {
      throw Error("Missing platform validation key for type " + type);
    }
  });
}

/**
 * @internal
 * @param {!angular.Scope} scope
 * @param {function(!angular.Scope)=} callback
 */
wr.mvc.applyScope = function(scope, callback) {
  if (!scope.$$phase) {
    scope.$apply(callback);
  } else {
    if (callback) {
      callback(scope);
    }
  }
};

/**
 * @internal
 * @param {!angular.Scope} scope
 * @param {function(!angular.Scope)=} callback
 */
wr.mvc.applyScopeAsync = function(scope, callback) {
  if (!scope.$$phase) {
    scope.$applyAsync(callback);
  } else {
    if (callback) {
      callback(scope);
    }
  }
};

/**
 * @internal
 * @param {!angular.Scope} scope
 */
wr.mvc.disconnectScope = function(scope) {
  if (scope.$root === scope) {
    throw new Error("Cannot disconnect the root scope");
  }
  if (scope["$$wrDisconnectedParent"]) {
    throw new Error("Scope already disconnected");
  }
  
  var parent = scope.$parent;
  scope["$$wrDisconnectedParent"] = parent;
  
  /* Sever links with parent and siblings (see Scope#$destroy) */
  if (parent["$$childHead"] === scope) {
    parent["$$childHead"] = scope["$$nextSibling"];
  }
  if (parent["$$childTail"] === scope) {
    parent["$$childTail"] = scope["$$prevSibling"];
  }
  if (scope["$$prevSibling"]) {
    scope["$$prevSibling"]["$$nextSibling"] = scope["$$nextSibling"];
  }
  if (scope["$$nextSibling"]) {
    scope["$$nextSibling"]["$$prevSibling"] = scope["$$prevSibling"];
  }
  scope["$$nextSibling"] = scope["$$prevSibling"] = null;
  scope.$parent = (null);
  
  /* Handle destruction while disconnected */
  scope.$destroy = wr.mvc._createDisconnectedDestroyFunction(scope.$destroy);
};

/**
 * @private
 * @param {function(this:angular.Scope)} destroyFn
 * @return {function(this:angular.Scope)}
 */
wr.mvc._createDisconnectedDestroyFunction = function(destroyFn) {
  return function destroyDisconnected() {
    
    /* Re attach the parent, because Scope#$destroy needs that */
    this.$parent = this["$$wrDisconnectedParent"];
    
    return destroyFn.apply(this, arguments);
  };
};

/**
 * @internal
 * @param {!angular.Scope} scope
 */
wr.mvc.reconnectScope = function(scope) {
  if (!scope["$$wrDisconnectedParent"]) {
    throw new Error("Scope not disconnected");
  }
  
  var parent = scope["$$wrDisconnectedParent"];
  scope["$$wrDisconnectedParent"] = null;
  
  /* Link the scope to the parent children (see Scope#$new) */
  scope["$$prevSibling"] = parent["$$childTail"];
  if (parent["$$childHead"]) {
    parent["$$childTail"]["$$nextSibling"] = scope;
    parent["$$childTail"] = scope;
  } else {
    parent["$$childHead"] = parent["$$childTail"] = scope;
  }
  scope.$parent = parent;
  
  /* If the parent was destroyed, the scope has received no notification of that: destroy it now */
  if (parent["$$destroyed"]) {
    scope.$destroy();
  }
  
  /* Stop handling destructions */
  delete scope.$destroy;
};

/**
 * @package
 * @param {!angular.Directive} directiveObj
 * @return {!angular.Directive}
 */
wr.mvc.enableCommentWrapping = function(directiveObj) {
  if (directiveObj.restrict) {
    throw new Error("Cannot specify 'restrict' for a comment-wrapped directive");
  }
  
  var originalLinkFn = directiveObj.link;
  var originalCompileFn = directiveObj.compile || function() {
    return originalLinkFn;
  };
  
  var START_COMMENT_RE = /^\s*directive:\s*(\S+)(\s+?.+)?\s*$/i;
  var END_COMMENT_RE = /^\s*end_directive:\s*(\S+)\s*$/i;
  var SPECIAL_CHARS_RE = /([\:\-\_]+(.))/g;
  
  function normalizeName(name) {
    return name.replace(SPECIAL_CHARS_RE, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
  }
  
  function getCommentDirName(regexp, commentNode) {
    var m = regexp.exec(commentNode.nodeValue);
    return m ? normalizeName(m[1]) : null;
  }
  
  var compile = function(element, attrs, transclude) {
    var node = element[0];
    
    /* For non-comments, call the original function */
    if (node.nodeType !== 8) {
      return originalCompileFn.call(this, element, attrs, transclude);
    }
    
    /* Extract directive name and attribute information */
    var match = START_COMMENT_RE.exec(node.nodeValue);
    var dirName = normalizeName(match[1]);
    var attrName = match[1];
    var attrValue = attrs[dirName] || "";
    
    /* Add directive attribute to all element sibling until the balanced end comment */
    var depth = 0;
    do {
      if (!node) {
        throw new Error("Unterminated comment-wrapped directive: " + attrName + (attrValue ? " " + attrValue : ""));
      }
      
      if (node.nodeType === 8) {
        if (getCommentDirName(START_COMMENT_RE, node) === dirName) {
          depth++;
        } else {
          if (getCommentDirName(END_COMMENT_RE, node) === dirName) {
            depth--;
          }
        }
      } else {
        if (depth === 1 && node.nodeType === 1) {
          node.setAttribute(attrName, attrValue || "");
        }
      }
      
      node = node.nextSibling;
    } while (depth > 0);
  };
  
  return angular.extend({}, directiveObj, {restrict:"AM", compile:compile});
};

/**
 * @internal
 * @enum {string}
 */
wr.mvc.Platform = {ANDROID:"android", IOS:"ios", WINDOWS:"windows", OTHER:"other"};

/**
 * @internal
 * @return {wr.mvc.Platform}
 */
wr.mvc.getPlatform = function() {
  if (device.platform === "Android" || device.platform === "android" || device.platform === "amazon-fireos" || device.platform === "Amazon") {
    return wr.mvc.Platform.ANDROID;
  } else {
    if (device.platform === "iOS") {
      return wr.mvc.Platform.IOS;
    } else {
      if (device.platform === "windows") {
        return wr.mvc.Platform.WINDOWS;
      }
    }
  }
  return wr.mvc.Platform.OTHER;
};




//== wr/mvc/l10n/PatternConverter.js ==========================================

wr.mvc.l10n = {};


/**
 * Constructs a new pattern converter.
 * 
 * @package
 * @constructor
 * @class Helper for converting localization patterns between different meta-formats.
 * @param {!string} patternSymbols
 * @param {!Object} rules
 */
wr.mvc.l10n.PatternConverter = function(patternSymbols, rules) {
  
  /** @private */
  this._tokenExpr = null;
  
  /** @private */
  this._rules = null;
  
  function buildTokenExpr(symbols, escapeChar) {
    
    function esc(s) {
      return s.replace(/([\]\^])/g, "\\$1");
    }
    
    var escapedEscapeChar = esc(escapeChar);
    
    var parts = [];
    parts.push("(");
    parts.push(escapedEscapeChar);
    parts.push("[^");
    parts.push(escapedEscapeChar);
    parts.push("]+");
    parts.push(escapedEscapeChar);
    parts.push(")|(");
    for (var i = 0;i < symbols.length;i++) {
      parts.push("[" + esc(symbols[i]) + "]+");
      if (i < symbols.length - 1) {
        parts.push("|");
      }
    }
    parts.push(")|(.)");
    
    return new RegExp(parts.join(""), "g");
  }
  
  var internalRules = {};
  var symbols = patternSymbols;
  var thisPatternConverter = this;
  this._iterate(rules || {}, function(symbol, translation) {
    if (symbol.length != 1) {
      throw new Error("Symbols must be single characters");
    } else {
      if (symbols.indexOf(symbol) < 0) {
        symbols += symbol;
      }
    }
    internalRules[symbol] = thisPatternConverter._makeTranslationArray(translation);
  });
  this._tokenExpr = buildTokenExpr(symbols, "'");
  this._rules = internalRules;
};

/**
 * @param {!string} pattern
 * @param {Function=} callback
 * @return {string}
 */
wr.mvc.l10n.PatternConverter.prototype.convert = function(pattern, callback) {
  var result = [], m;
  this._tokenExpr.lastIndex = 0;
  while (m = this._tokenExpr.exec(pattern)) {
    var symbolTxt = m[2], symbol = symbolTxt && symbolTxt.charAt(0), symbolLen = symbolTxt && symbolTxt.length, value = m[1] || m[3];
    if (symbol) {
      if (callback) {
        callback(symbol, symbolLen);
      }
      var rule = this._rules[symbol];
      value = rule ? rule[symbolLen] || rule[0] : value;
    }
    if (value) {
      result.push(value);
    }
  }
  return result.join("");
};

/**
 * @param {!string} pattern
 * @returns
 */
wr.mvc.l10n.PatternConverter.prototype.indexOfFirstRule = function(pattern) {
  return this._indexOfRule(pattern, false);
};

/**
 * @param {!string} pattern
 * @returns
 */
wr.mvc.l10n.PatternConverter.prototype.indexOfLastRule = function(pattern) {
  return this._indexOfRule(pattern, true);
};

/**
 * @private
 * @param {!string} pattern
 * @param {?boolean} last
 * @returns {number}
 */
wr.mvc.l10n.PatternConverter.prototype._indexOfRule = function(pattern, last) {
  var index = -1, m;
  this._tokenExpr.lastIndex = 0;
  while (m = this._tokenExpr.exec(pattern)) {
    if (m[1] && this._rules[m[1][0]]) {
      index = m.index + (last ? m[1].length : 0);
      if (!last) {
        break;
      }
    }
  }
  return index;
};

/**
 * @private
 * @param {!(string|Object)} tr
 * @returns {Array}
 */
wr.mvc.l10n.PatternConverter.prototype._makeTranslationArray = function(tr) {
  if (typeof tr === "string") {
    return [tr];
  } else {
    if (typeof tr === "object") {
      var arr = [];
      this._iterate(tr, function(range, subTranslation) {
        if (!/^(?:\d+(?:,\d+)?)?|%$/.test(range)) {
          throw new Error("Invalid symbol range");
        }
        if (range === "%") {
          var repeated = "";
          for (var i = 1;i <= 6;i++) {
            repeated += subTranslation;
            arr[i] = "" + repeated;
          }
        } else {
          var nums = range ? range.split(",") : [0, 0];
          nums = [Number(nums[0]), Number(nums[1] || nums[0])];
          for (var i = nums[0];i <= nums[1];i++) {
            arr[i] = subTranslation;
          }
        }
      });
      return arr;
    }
  }
  throw new Error("Invalid translation object");
};

/**
 * @private
 * @param {!Object} o
 * @param {!Function} callback
 */
wr.mvc.l10n.PatternConverter.prototype._iterate = function(o, callback) {
  for (var k in o) {
    if (o.hasOwnProperty(k)) {
      callback.call(o, k, o[k]);
    }
  }
};




//== wr/mvc/l10n/_l10n.js =====================================================



/**
 * @name wr.mvc.l10n
 * @namespace Utilities and components for supporting the localization of the application.
 */

/**
 * Creates a {@link wr.mvc.l10n.PatternConverter} to convert AngularJS date pattern to Java date pattern.
 * 
 * @package
 * @return {wr.mvc.l10n.PatternConverter}
 */
wr.mvc.l10n.createAngularToJavaPatternConverter = function() {
  var angularSymbols = "adEGHhMmsywZ";
  var rules = {y:{"%":"y"}, M:{"%":"M"}, d:{"%":"d"}, E:{"%":"E"}, H:{"%":"H"}, h:{"%":"h"}, m:{"%":"m"}, s:{1:"s", 2:"ss", 3:"SSS", "":"SSS"}, a:{"%":"a"}, Z:{"%":"Z"}, w:{"%":"W"}, G:{"%":"G"}};
  
  return new wr.mvc.l10n.PatternConverter(angularSymbols, rules);
};

/**
 * @package
 * @const
 * @type {!Object<wrm.l10n.NameWidth,string>}
 */
wr.mvc.l10n.CLDR_MONTH_WIDTH_TAGS = {};
wr.mvc.l10n.CLDR_MONTH_WIDTH_TAGS[wrm.l10n.NameWidth.NARROW] = "narrow";
wr.mvc.l10n.CLDR_MONTH_WIDTH_TAGS[wrm.l10n.NameWidth.ABBREVIATED] = "abbreviated";
wr.mvc.l10n.CLDR_MONTH_WIDTH_TAGS[wrm.l10n.NameWidth.SHORT] = "abbreviated";
wr.mvc.l10n.CLDR_MONTH_WIDTH_TAGS[wrm.l10n.NameWidth.WIDE] = "wide";

/**
 * @package
 * @const
 * @type {!Object<wrm.l10n.NameWidth,string>}
 */
wr.mvc.l10n.CLDR_DAY_WIDTH_TAGS = {};
wr.mvc.l10n.CLDR_DAY_WIDTH_TAGS[wrm.l10n.NameWidth.NARROW] = "narrow";
wr.mvc.l10n.CLDR_DAY_WIDTH_TAGS[wrm.l10n.NameWidth.ABBREVIATED] = "abbreviated";
wr.mvc.l10n.CLDR_DAY_WIDTH_TAGS[wrm.l10n.NameWidth.SHORT] = "short";
wr.mvc.l10n.CLDR_DAY_WIDTH_TAGS[wrm.l10n.NameWidth.WIDE] = "wide";

/**
 * @package
 * @const
 * @type {!Array<string>}
 */
wr.mvc.l10n.CLDR_DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/**
 * @package
 * @param {!Cldr} baseCldr
 * @param {string} locale
 * @return {!Promise<?Cldr>}
 */
wr.mvc.l10n.createInferredDeviceCldr = function(baseCldr, locale) {
  var NameWidth = wrm.l10n.NameWidth;
  
  /* Function for getting the device locale */
  function invokeGetLocaleName() {
    return new Promise(function(resolve, reject) {
      navigator.globalization.getLocaleName(function(r) {
        resolve(r.value);
      }, function(e) {
        reject(wrm.util.toError(e));
      });
    });
  }
  
  /* Function for getting the device date names */
  function invokeGetDateNames(item, type) {
    return new Promise(function(resolve, reject) {
      navigator.globalization.getDateNames(function(r) {
        resolve(r.value);
      }, function(e) {
        reject(wrm.util.toError(e));
      }, {type:type, item:item});
    });
  }
  
  /* Function for getting the number formatting info */
  function invokeGetNumberPattern() {
    return new Promise(function(resolve, reject) {
      navigator.globalization.getNumberPattern(resolve, function(e) {
        reject(wrm.util.toError(e));
      }, {type:"decimal"});
    });
  }
  
  var deviceLocale = null;
  var monthNames = {};
  var dayNames = {};
  var decimalSep = null;
  var groupingSep = null;
  
  /* Get the device locale. At the same time, load all names. */
  var promises = [];
  promises.push(invokeGetLocaleName().then(function(locale) {
    deviceLocale = locale;
  }));
  promises.push(invokeGetDateNames("months", "narrow").then(function(names) {
    monthNames[NameWidth.NARROW] = names;
    monthNames[NameWidth.ABBREVIATED] = names;
    monthNames[NameWidth.SHORT] = names;
  }));
  promises.push(invokeGetDateNames("months", "wide").then(function(names) {
    monthNames[NameWidth.WIDE] = names;
  }));
  promises.push(invokeGetDateNames("days", "narrow").then(function(names) {
    dayNames[NameWidth.NARROW] = names;
    dayNames[NameWidth.ABBREVIATED] = names;
    dayNames[NameWidth.SHORT] = names;
  }));
  promises.push(invokeGetDateNames("days", "wide").then(function(names) {
    dayNames[NameWidth.WIDE] = names;
  }));
  promises.push(invokeGetNumberPattern().then(function(format) {
    decimalSep = format.decimal;
    groupingSep = format.grouping;
  }));
  
  /* If the locale matches the requested one, create a makeshift CLDR instance */
  return Promise.all(promises).then(function() {
    if (locale !== deviceLocale) {
      return null;
    }
    
    var builder = new wr.mvc.l10n.CldrDataBuilder(baseCldr, deviceLocale);
    wrm.util.obj.getEnumValues(NameWidth).forEach(function(width) {
      builder.setMonthNames(width, monthNames[width]);
      builder.setDayNames(width, dayNames[width]);
    });
    builder.setDecimalSeparator(decimalSep);
    builder.setGroupSeparator(groupingSep);
    return builder.getData();
  });
};




//== wr/mvc/l10n/CldrLocaleInfo.js ============================================



/**
 * @package
 * @constructor
 * @class Locale information backed by a CLDR bundle.
 * @implements wrm.l10n.LocaleInfo
 * @param {!Cldr} cldr
 */
wr.mvc.l10n.CldrLocaleInfo = function(cldr) {
  
  /** @private */
  this._cldr = cldr;
};

/**
 * @param {!wrm.l10n.NameWidth} width
 * @return {!Array<string>}
 */
wr.mvc.l10n.CldrLocaleInfo.prototype.getMonthNames = function(width) {
  var widthTag = wr.mvc.l10n.CLDR_MONTH_WIDTH_TAGS[width];
  var namesByKey = (this._cldr.main(["dates/calendars/gregorian/months/format", widthTag]));
  return Object.keys(namesByKey).map(function(key) {
    return namesByKey[key];
  });
};

/**
 * @param {!wrm.l10n.NameWidth} width
 * @return {!Array<string>}
 */
wr.mvc.l10n.CldrLocaleInfo.prototype.getDayNames = function(width) {
  var widthTag = wr.mvc.l10n.CLDR_DAY_WIDTH_TAGS[width];
  var namesByKey = (this._cldr.main(["dates/calendars/gregorian/days/format", widthTag]));
  return Object.keys(namesByKey).map(function(key) {
    return namesByKey[key];
  });
};

/**
 * @return {number}
 */
wr.mvc.l10n.CldrLocaleInfo.prototype.getFirstDayOfWeek = function() {
  var region = this._cldr.attributes.region;
  var dayKey = this._cldr.get(["supplemental/weekData/firstDay", region]);
  if (typeof dayKey !== "string") {
    throw new Error("No first-day-of-week information in locale data");
  }
  return wr.mvc.l10n.CLDR_DAY_KEYS.indexOf(dayKey);
};




//== wr/mvc/l10n/LocalizationManager.js =======================================



/**
 * Constructs a new localization manager service.
 * 
 * @constructor
 * @class Service managing the localization of the application.
 *        <p>
 *        Before doing any work, this service <b>must be initialized</b> (an asynchronous operation) by calling {@link #initialize}.
 *        <p>
 *        At any time there is always a <i>current locale</i> used for all localization work. The locale is aligned with the underlying
 *        platform locale, unless overridden via {@link #overrideLocale}. To respond to changes in the platform locale, the
 *        {@link #refreshLocale} has to be called explicitly.
 * @ngInject
 * @param {string} WRAPP_DEFAULT_LOCALE
 * @param {!angular.$http} $http
 * @param {!wr.mvc.Logger} wrLogger
 */
wr.mvc.l10n.LocalizationManager = function(WRAPP_DEFAULT_LOCALE, $http, wrLogger) {
  
  /** @private */
  this._defaultLocale = WRAPP_DEFAULT_LOCALE;
  
  /** @private */
  this._$http = $http;
  
  /**
   * @private
   * @type {!Object<string,!Promise<boolean>>}
   */
  this._globalizeDataPromises = {};
  
  /**
   * @private
   * @type {?string}
   */
  this._forcedLocale = null;
  
  /**
   * @private
   * @type {?Promise}
   */
  this._initializePromise = null;
  
  /**
   * @private
   * @type {string}
   */
  this._currentLocale;
  
  /**
   * @private
   * @type {!wrm.l10n.LocalizationService}
   */
  this._l10nService;
  
  /** @private */
  this._log = wrLogger.createLog("wr.mvc.l10n.LocalizationManager");
  
  /* Cached locale-specific information */
  
  /**
   * @private
   * @type {!Object<!wrm.data.Type,!Object<!wr.mvc.l10n.LocalizationManager.Style,string>>}
   */
  this._deviceDateTimePatterns;
  
  /**
   * @private
   * @type {!Object<!wrm.data.Type,string>}
   */
  this._deviceNumberPatterns;
  
  /**
   * @private
   * @type {!Globalize}
   */
  this._globalize;
  
  /**
   * @private
   * @type {!Object<!wrm.data.Type,function(*):string>}
   */
  this._defaultFormatters;
  
  /**
   * @private
   * @type {!Object<string,function(*):string>}
   */
  this._customFormatters = {};
};
wr.mvc.l10n.LocalizationManager["$inject"] = ["WRAPP_DEFAULT_LOCALE", "$http", "wrLogger"];

/**
 * @internal
 * @param {!wrm.l10n.LocalizationService} l10nService
 * @return {!Promise}
 */
wr.mvc.l10n.LocalizationManager.prototype.initialize = function(l10nService) {
  var thisService = this;
  if (!this._initializePromise) {
    this._l10nService = l10nService;
    this._initializePromise = Promise.resolve().then(function() {
      return thisService._initGlobalize();
    }).then(function() {
      return thisService._refreshLocale();
    });
  } else {
    if (this._l10nService !== l10nService) {
      throw new Error("Already initialized with a different localization service");
    }
  }
  return this._initializePromise;
};

/**
 * @private
 * @return {!Promise}
 */
wr.mvc.l10n.LocalizationManager.prototype._initGlobalize = function() {
  var defaultLocale = this._defaultLocale;
  
  /* Load supplemental and default locale CLDR data: both MUST BE PRESENT for correct functionality */
  var loadPromises = [this._loadGlobalizeData("supplemental"), this._loadGlobalizeData("main-" + defaultLocale)];
  return Promise.all(loadPromises).then(function(loaded) {
    if (!loaded[0]) {
      throw new Error("Supplemental CLDR data not found");
    } else {
      if (!loaded[1]) {
        throw new Error("Default locale CLDR data not found");
      }
    }
  }).then(function() {
    
    /* Set the default locale */
    Globalize.locale(defaultLocale);
  });
};

/**
 * Refreshes the current locale, as seen by this service. This is required for detecting changes in the platform locale.
 * 
 * @return {!Promise<boolean>} <code>true</code> if the current locale did actually change.
 */
wr.mvc.l10n.LocalizationManager.prototype.refreshLocale = function() {
  return this._refreshLocale();
};

/**
 * Overrides the platform locale with a given one. Calling this method also causes the current locale to be refreshed.
 * 
 * @param {?string} locale A locale identifier or <code>null</code> to cancel all overrides.
 * @return {!Promise<boolean>} <code>true</code> if the current locale did actually change.
 */
wr.mvc.l10n.LocalizationManager.prototype.overrideLocale = function(locale) {
  this._forcedLocale = locale;
  return this._refreshLocale();
};

/**
 * @private
 * @return {!Promise<boolean>}
 */
wr.mvc.l10n.LocalizationManager.prototype._refreshLocale = function() {
  var thisService = this;
  var log = this._log;
  
  /* Compute the new current locale using the forced or the device one */
  var promise = Promise.resolve().then(function() {
    if (thisService._forcedLocale) {
      return thisService._forcedLocale;
    }
    return thisService._getDeviceLocale();
  }).then(function(newLocale) {
    var changed = newLocale !== thisService._currentLocale;
    thisService._currentLocale = newLocale;
    return changed;
  });
  
  /* Re-align to the current locale in case it changed */
  return promise.then(function(changed) {
    if (!changed) {
      return false;
    }
    log.debug("Current locale is", thisService._currentLocale);
    return thisService._alignToCurrentLocale().then(function() {
      return true;
    });
  });
};

/**
 * @private
 * @return {!Promise<string>}
 */
wr.mvc.l10n.LocalizationManager.prototype._getDeviceLocale = function() {
  return new Promise(function(resolve, reject) {
    GLOBAL.navigator.globalization.getLocaleName(function(locale) {
      resolve(locale.value);
    }, function(e) {
      reject(wrm.util.toError(e));
    });
  });
};

/**
 * @private
 * @return {!Promise}
 */
wr.mvc.l10n.LocalizationManager.prototype._alignToCurrentLocale = function() {
  var Type = wrm.data.Type;
  var Style = wr.mvc.l10n.LocalizationManager.Style;
  var l10nService = this._l10nService;
  var currentLocale = this._currentLocale;
  var thisService = this;
  
  /* Reload the device default patterns */
  var promise = Promise.resolve().then(function() {
    return thisService._reloadDeviceDateTimePatterns();
  }).then(function() {
    return thisService._reloadDeviceNumberPatterns();
  });
  
  /* Replace the Globalize instance with a new one aligned with the locale */
  promise = promise.then(function() {
    return thisService._reloadGlobalize();
  });
  
  /* Refresh the application localization service to the new current locale */
  promise = promise.then(function() {
    return l10nService.refreshLocale();
  });
  
  /* Construct formatters by using the application preferred pattern or one supplied by the device */
  return promise.then(function() {
    var formatters = {};
    
    /* Date/time types */
    [Type.DATE, Type.TIME, Type.TIMESTAMP].forEach(function(type) {
      var pattern = l10nService.getPreferredTypePattern(type) || thisService._deviceDateTimePatterns[type][Style.SHORT];
      formatters[type] = thisService._createDateTimeFormatter(type, {pattern:pattern});
    });
    
    /* Numeric types */
    [Type.INTEGER, Type.FLOAT, Type.DECIMAL].forEach(function(type) {
      var pattern = l10nService.getPreferredTypePattern(type) || thisService._deviceNumberPatterns[type];
      formatters[type] = thisService._createNumberFormatter(type, {pattern:pattern, maxFractionDigits:type === Type.INTEGER ? 0 : undefined});
    });
    
    thisService._defaultFormatters = formatters;
    thisService._customFormatters = {};
  });
};

/**
 * @private
 * @return {!Promise}
 */
wr.mvc.l10n.LocalizationManager.prototype._reloadDeviceDateTimePatterns = function() {
  var Type = wrm.data.Type;
  var thisService = this;
  
  var allPatterns = {};
  
  /* Retrieve patterns for each "date/time" type */
  var promises = [["date", Type.DATE], ["time", Type.TIME], ["date and time", Type.TIMESTAMP]].map(function(indexes) {
    return thisService._retrieveDeviceDateTimePatterns(indexes[0]).then(function(patterns) {
      allPatterns[indexes[1]] = patterns;
    });
  });
  return Promise.all(promises).then(function() {
    thisService._deviceDateTimePatterns = allPatterns;
  });
};

/**
 * @private
 * @param {string} selector
 * @return {!Promise<!Object<!wr.mvc.l10n.LocalizationManager.Style,string>>}
 */
wr.mvc.l10n.LocalizationManager.prototype._retrieveDeviceDateTimePatterns = function(selector) {
  var Style = wr.mvc.l10n.LocalizationManager.Style;
  
  /**
   * @param {string} formatLength
   * @return {!Promise<string>}
   */
  function invokeGetDatePattern(formatLength) {
    return new Promise(function(resolve, reject) {
      GLOBAL.navigator.globalization.getDatePattern(function(result) {
        resolve(result.pattern);
      }, function(e) {
        reject(wrm.util.toError(e));
      }, {formatLength:formatLength, selector:selector});
    });
  }
  
  /* Retrieve date patterns for the lengths supported by the plugin */
  var patterns = {};
  var promises = [["short", Style.SHORT], ["medium", Style.MEDIUM], ["long", Style.LONG], ["full", Style.FULL]].map(function(indexes) {
    return invokeGetDatePattern(indexes[0]).then(function(pattern) {
      patterns[indexes[1]] = pattern;
    });
  });
  return Promise.all(promises).then(function() {
    
    /* Fill-in missing device patterns by using a smaller one */
    var styles = [Style.SHORT, Style.MEDIUM, Style.LONG, Style.FULL];
    var smallerPattern = null;
    styles.forEach(function(style) {
      if (!smallerPattern) {
        smallerPattern = patterns[style];
      }
    });
    styles.forEach(function(style) {
      if (!patterns[style]) {
        patterns[style] = smallerPattern;
      } else {
        smallerPattern = patterns[style];
      }
    });
    
    return patterns;
  });
};

/**
 * @private
 * @return {!Promise}
 */
wr.mvc.l10n.LocalizationManager.prototype._reloadDeviceNumberPatterns = function() {
  var Type = wrm.data.Type;
  var thisService = this;
  
  /**
   * @return {!Promise<string>}
   */
  function invokeGetNumberPattern() {
    return new Promise(function(resolve, reject) {
      GLOBAL.navigator.globalization.getNumberPattern(function(result) {
        resolve(result.pattern);
      }, function(e) {
        reject(wrm.util.toError(e));
      }, {type:"decimal"});
    });
  }
  
  /* Retrieve the device "numeric" pattern */
  return Promise.resolve().then(function() {
    return invokeGetNumberPattern();
  }).then(function(pattern) {
    
    /* Use the pattern for all numeric types (fractional digits will control integer vs. decimal) */
    var allPatterns = {};
    allPatterns[Type.INTEGER] = pattern;
    allPatterns[Type.FLOAT] = pattern;
    allPatterns[Type.DECIMAL] = pattern;
    
    thisService._deviceNumberPatterns = allPatterns;
  });
};

/**
 * @private
 * @return {!Promise}
 */
wr.mvc.l10n.LocalizationManager.prototype._reloadGlobalize = function() {
  var thisService = this;
  var log = this._log;
  var defaultLocale = this._defaultLocale;
  var currentLocale = this._currentLocale;
  
  /* Load CLDR data for the requested locale (will use cache if already loaded) */
  return Promise.resolve().then(function() {
    return thisService._loadGlobalizeData("main-" + currentLocale.replace(/-/g, "_"));
  }).then(function(loaded) {
    if (loaded) {
      return true;
    }
    
    /* If not found, attempt to infer the CLDR data from the current device locale */
    var cldrPromise = wr.mvc.l10n.createInferredDeviceCldr(Globalize.locale(defaultLocale), currentLocale);
    return cldrPromise.then(function(cldr) {
      if (cldr) {
        log.warn("Locale information for", currentLocale, "inferred from device data");
        Globalize.load(cldr);
        return true;
      }
      return false;
    });
  }).then(function(loaded) {
    
    /* Instantiate Globalize with the current locale or the default locale (the latter ALREADY LOADED during initialize) */
    var actualLocale = loaded ? currentLocale : defaultLocale;
    var globalize = new Globalize(actualLocale);
    
    thisService._globalize = globalize;
  });
};

/**
 * @private
 * @param {string} name
 * @return {!Promise<boolean>}
 */
wr.mvc.l10n.LocalizationManager.prototype._loadGlobalizeData = function(name) {
  var promise = this._globalizeDataPromises[name];
  
  if (!promise) {
    var httpFunction = (this._$http);
    var config = {method:"GET", url:"app/lib/cldr/" + name + ".json", responseType:"json"};
    
    /* Load the CLDR data into Globalize */
    promise = httpFunction(config).then(function(response) {
      var cldrData = response.data;
      if (cldrData && typeof cldrData === "object") {
        Globalize.load(cldrData);
        return true;
      } else {
        return false;
      }
    }, function(response) {
      switch(response.status) {
        case 404:
        ;
        case 500:
        ;
        case 0:
        ;
        case -1:
          return false;
      }
      throw new Error("Error loading CLDR bundle '" + name + "' - " + response.status + " (" + response.statusText + ")");
    });
    
    this._globalizeDataPromises[name] = promise;
  }
  
  return promise;
};

/**
 * @private
 * @param {*} value
 * @param {!wrm.data.Type} type
 * @param {function(this:wr.mvc.l10n.LocalizationManager,!wrm.data.Type,?):(function(*):string)} formatterFactory
 * @param {?=} options
 * @return {string}
 */
wr.mvc.l10n.LocalizationManager.prototype._doFormat = function(value, type, formatterFactory, options) {
  if (DEBUG) {
    this._checkInitialized();
  }
  
  /* Use the cached formatter or create one ad-hoc */
  var formatter;
  if (!options) {
    formatter = this._defaultFormatters[type];
  } else {
    var optionsKey = wr.mvc.l10n.LocalizationManager._computeOptionsKey(options);
    formatter = this._customFormatters[optionsKey];
    if (!formatter) {
      this._customFormatters[optionsKey] = formatter = formatterFactory.call(this, type, options);
    }
  }
  
  return formatter(value);
};

/**
 * @private
 * @template T
 * @param {!wrm.data.Type} type
 * @param {function(T):string} coreFunction
 * @return {function((*|undefined)):string}
 */
wr.mvc.l10n.LocalizationManager.prototype._createGenericFromatter = function(type, coreFunction) {
  var log = this._log;
  
  return function(value) {
    
    /* Quick conversion for values that are already null/undefined */
    if (value === null || value === undefined) {
      return "";
    }
    
    /* Convert the value: if not possible, just serialize to string */
    var convertedValue;
    try {
      convertedValue = wrm.data.toSingle(type, value);
    } catch (e) {
      log.warn("Value not convertible to " + type, e);
      return String(value);
    }
    if (convertedValue === null || convertedValue === undefined) {
      return "";
    }
    
    return coreFunction(convertedValue);
  };
};

/**
 * @internal
 * @return {boolean}
 */
wr.mvc.l10n.LocalizationManager.prototype.isInitialized = function() {
  return !!this._l10nService && !!this._defaultFormatters;
};

/**
 * @private
 * @return {undefined}
 */
wr.mvc.l10n.LocalizationManager.prototype._checkInitialized = function() {
  if (!this.isInitialized()) {
    throw new Error("Localization manager not initialized");
  }
};

/*
 * Current locale information
 */

/**
 * Gets the current locale that is being used for all localization tasks.
 * 
 * @return {string} A locale identifier.
 */
wr.mvc.l10n.LocalizationManager.prototype.getCurrentLocale = function() {
  if (DEBUG && !this._currentLocale) {
    throw new Error("Current locale not available");
  }
  return this._currentLocale;
};

/**
 * Gets extended information and metadata about the current locale.
 * 
 * @return {!wrm.l10n.LocaleInfo} Locale information.
 */
wr.mvc.l10n.LocalizationManager.prototype.getLocaleInfo = function() {
  if (DEBUG) {
    this._checkInitialized();
  }
  return new wr.mvc.l10n.CldrLocaleInfo(this._globalize.cldr);
};

/*
 * Date formatting
 */

/**
 * Styles used for the display of localized values.
 * 
 * @enum {string}
 */
wr.mvc.l10n.LocalizationManager.Style = {SHORT:"short", MEDIUM:"medium", LONG:"long", FULL:"full"};

/**
 * Options for formatting date and time values.
 * 
 * @typedef {{style:(wr.mvc.l10n.LocalizationManager.Style|undefined), pattern:(string|undefined)}}
 */
wr.mvc.l10n.LocalizationManager.DateTimeFormatOptions;

/**
 * Formats a value according to the rules of WebRatio <i>date</i> values.
 * 
 * @param {*} value Value to format.
 * @param {wr.mvc.l10n.LocalizationManager.DateTimeFormatOptions=} options Options for formatting.
 * @return {string} Formatted value. If not convertible, the value {@link #toString} is returned. If <code>null</code> or
 *         <code>undefined</code>, the empty string is returned.
 */
wr.mvc.l10n.LocalizationManager.prototype.formatDate = function(value, options) {
  return this._doFormat(value, wrm.data.Type.DATE, this._createDateTimeFormatter, options);
};

/**
 * Formats a value according to the rules of WebRatio <i>time</i> values.
 * 
 * @param {*} value Value to format.
 * @param {wr.mvc.l10n.LocalizationManager.DateTimeFormatOptions=} options Options for formatting.
 * @return {string} Formatted value. If not convertible, the value {@link #toString} is returned. If <code>null</code> or
 *         <code>undefined</code>, the empty string is returned.
 */
wr.mvc.l10n.LocalizationManager.prototype.formatTime = function(value, options) {
  return this._doFormat(value, wrm.data.Type.TIME, this._createDateTimeFormatter, options);
};

/**
 * Formats a value according to the rules of WebRatio <i>timestamp</i> values.
 * 
 * @param {*} value Value to format.
 * @param {wr.mvc.l10n.LocalizationManager.DateTimeFormatOptions=} options Options for formatting.
 * @return {string} Formatted value. If not convertible, the value {@link #toString} is returned. If <code>null</code> or
 *         <code>undefined</code>, the empty string is returned.
 */
wr.mvc.l10n.LocalizationManager.prototype.formatTimestamp = function(value, options) {
  return this._doFormat(value, wrm.data.Type.TIMESTAMP, this._createDateTimeFormatter, options);
};

/**
 * @private
 * @param {!wrm.data.Type} type
 * @param {wr.mvc.l10n.LocalizationManager.DateTimeFormatOptions} options
 * @return {function(*):string}
 */
wr.mvc.l10n.LocalizationManager.prototype._createDateTimeFormatter = function(type, options) {
  var Type = wrm.data.Type;
  
  /* Prepare a Globalize formatter using either the pattern or the style */
  var globalizeOptions = {};
  if (options.pattern) {
    globalizeOptions.raw = options.pattern;
  } else {
    if (options.style) {
      switch(type) {
        case Type.DATE:
          globalizeOptions.date = options.style;
          break;
        case Type.TIME:
          globalizeOptions.time = options.style;
          break;
        case Type.TIMESTAMP:
          globalizeOptions.datetime = options.style;
          break;
      }
    }
  }
  var globalizeFormatter = this._globalize.dateFormatter(globalizeOptions);
  
  return this._createGenericFromatter(type, function(value) {
    return globalizeFormatter(value.asDate());
  });
};

/*
 * Number formatting
 */

/**
 * Options for formatting numeric values.
 * 
 * @typedef {{minFractionDigits:(number|undefined), maxFractionDigits:(number|undefined), pattern:(string|undefined)}}
 */
wr.mvc.l10n.LocalizationManager.NumberFormatOptions;

/**
 * Formats a value according to the rules of WebRatio <i>integer</i> values.
 * 
 * @param {*} value Value to format.
 * @param {wr.mvc.l10n.LocalizationManager.NumberFormatOptions=} options Options for formatting.
 * @return {string} Formatted value. If not convertible, the value {@link #toString} is returned. If <code>null</code> or
 *         <code>undefined</code>, the empty string is returned.
 */
wr.mvc.l10n.LocalizationManager.prototype.formatInteger = function(value, options) {
  return this._doFormat(value, wrm.data.Type.INTEGER, this._createNumberFormatter, options);
};

/**
 * Formats a value according to the rules of WebRatio <i>float</i> values.
 * 
 * @param {*} value Value to format.
 * @param {wr.mvc.l10n.LocalizationManager.NumberFormatOptions=} options Options for formatting.
 * @return {string} Formatted value. If not convertible, the value {@link #toString} is returned. If <code>null</code> or
 *         <code>undefined</code>, the empty string is returned.
 */
wr.mvc.l10n.LocalizationManager.prototype.formatFloat = function(value, options) {
  return this._doFormat(value, wrm.data.Type.FLOAT, this._createNumberFormatter, options);
};

/**
 * Formats a value according to the rules of WebRatio <i>decimal</i> values.
 * 
 * @param {*} value Value to format.
 * @param {wr.mvc.l10n.LocalizationManager.NumberFormatOptions=} options Options for formatting.
 * @return {string} Formatted value. If not convertible, the value {@link #toString} is returned. If <code>null</code> or
 *         <code>undefined</code>, the empty string is returned.
 */
wr.mvc.l10n.LocalizationManager.prototype.formatDecimal = function(value, options) {
  return this._doFormat(value, wrm.data.Type.DECIMAL, this._createNumberFormatter, options);
};

/**
 * @private
 * @param {!wrm.data.Type} type
 * @param {wr.mvc.l10n.LocalizationManager.NumberFormatOptions} options
 * @return {function(*):string}
 */
wr.mvc.l10n.LocalizationManager.prototype._createNumberFormatter = function(type, options) {
  var Type = wrm.data.Type;
  
  /* Prepare a Globalize formatter */
  var globalizeOptions = {};
  if (options.pattern) {
    globalizeOptions.raw = options.pattern;
  }
  if (typeof options.minFractionDigits === "number" || typeof options.maxFractionDigits === "number") {
    if (typeof options.minFractionDigits === "number") {
      globalizeOptions.minimumFractionDigits = options.minFractionDigits;
    } else {
      globalizeOptions.minimumFractionDigits = 0;
    }
    if (typeof options.maxFractionDigits === "number") {
      globalizeOptions.maximumFractionDigits = options.maxFractionDigits;
    } else {
      globalizeOptions.maximumFractionDigits = 20;
    }
  }
  var globalizeFormatter = this._globalize.numberFormatter(globalizeOptions);
  
  if (type === Type.DECIMAL) {
    return this._createGenericFromatter(type, function(value) {
      try {
        return globalizeFormatter(value.toNumber());
      } catch (e) {
        var symbols = this._globalize.cldr.main("numbers/symbols-numberSystem-latn");
        return value.toLocaleString({groupSeparator:symbols["group"], decimalSeparator:symbols["decimal"]});
      }
    });
  }
  
  return this._createGenericFromatter(type, globalizeFormatter);
};

/*
 * Messages formatting
 */

/**
 * Prepares a localized application message.
 * 
 * @param {string} key Key of the message to retrieve.
 * @param {!Object=} variables Variables to replace into the message format in place of <code>${x}</code> placeholders, with
 *            <code>x</code> being a 0-based number.
 * @return {string} Message string localized according the current locale.
 */
wr.mvc.l10n.LocalizationManager.prototype.formatMessage = function(key, variables) {
  if (DEBUG) {
    this._checkInitialized();
  }
  return this._l10nService.formatMessage(key, variables);
};

/*
 * Utilities
 */

/**
 * @private
 * @type {!Array<string>}
 */
wr.mvc.l10n.LocalizationManager._OPTIONS_KEYED_KEYS = ["style", "minFractionDigits", "maxFractionDigits", "pattern"];

/**
 * @private
 * @type {!Object<string,boolean>}
 */
wr.mvc.l10n.LocalizationManager._OPTIONS_KEYED_KEYS_MAP = function(keys) {
  var map = {};
  for (var i = 0;i < keys.length;i++) {
    map[keys[i]] = true;
  }
  return map;
}(wr.mvc.l10n.LocalizationManager._OPTIONS_KEYED_KEYS);

/**
 * @param {wr.mvc.l10n.LocalizationManager.DateTimeFormatOptions|wr.mvc.l10n.LocalizationManager.NumberFormatOptions} options
 * @return {string}
 */
wr.mvc.l10n.LocalizationManager._computeOptionsKey = function(options) {
  
  /* Ensure that the options object has no unknown keys (only in debug, since this is expensive) */
  if (DEBUG) {
    (function() {
      var unknownKeys = Object.keys(options).filter(function(key) {
        return !wr.mvc.l10n.LocalizationManager._OPTIONS_KEYED_KEYS_MAP[key];
      });
      if (unknownKeys.length > 0) {
        throw new Error("Unknown keys in options object: " + unknownKeys.join(","));
      }
    })();
  }
  
  /* Build the key string; use a raw for loop for performance */
  var result = "";
  var keys = wr.mvc.l10n.LocalizationManager._OPTIONS_KEYED_KEYS;
  for (var i = 0;i < keys.length;i++) {
    result += "," + String(options[keys[i]]);
  }
  return result;
};




//== wr/mvc/l10n/dateDecorator.js =============================================



/**
 * Decorator for the stock Angular <code>date</code> filter.
 * <p>
 * The decorator has the same behavior of the base filter, with the following additions.
 * <ul>
 * <li>Localization is performed according to WebRatio rules and can change dynamically.
 * <li>Additional formats such as <code>wr-date</code> enable formatting according to the default rules of a WebRatio type, without
 * having to specify a length or a pattern.
 * </ul>
 * 
 * @ngInject
 * @param {!function(*,?):string} $delegate
 * @param {!wr.mvc.l10n.LocalizationManager} wrLocalizationManager
 * @param {!wr.mvc.Logger} wrLogger
 * @return {!function(*,?):string} A filter function, accepting a value and returning a string. See the stock Angular filter for more
 *         information about the options.
 */
wr.mvc.l10n.dateDecorator = function($delegate, wrLocalizationManager, wrLogger) {
  var Style = wr.mvc.l10n.LocalizationManager.Style;
  var log = wrLogger.createLog("wr.mvc.l10n.dateDecorator");
  
  /**
   * @param {*} value
   * @param {string|undefined} timezone
   * @return {*}
   */
  function shiftTimezone(value, timezone) {
    if (timezone === undefined) {
      return value;
    }
    
    /* Skip null/empty values */
    var valueDT = wrm.data.toTimestamp(value);
    if (!valueDT) {
      return value;
    }
    
    /* Determine the desired time zone offset */
    var desiredOffset;
    if (timezone === "UTC") {
      desiredOffset = 0;
    } else {
      desiredOffset = Date.parse("Jan 01, 1970 00:00:00 " + timezone) / 6E4;
      if (isNaN(desiredOffset)) {
        log.warn("Unrecognized timezone", timezone);
        return value;
      }
    }
    
    /*
     * Since native dates are always displayed with the current time zone, hack the display by displacing the UTC milliseconds of
     * an amount equal to the difference between the desired time zone and the current display time zone
     */
    var valueDate = valueDT.asDate();
    var relativeOffset = valueDate.getTimezoneOffset() - desiredOffset;
    return new Date(valueDate.valueOf() + relativeOffset * 6E4);
  }
  
  /** @type {wr.mvc.l10n.PatternConverter} */
  var _patternConverter = null;
  
  /**
   * @return {wr.mvc.l10n.PatternConverter}
   */
  function getPatternConverter() {
    if (!_patternConverter) {
      _patternConverter = wr.mvc.l10n.createAngularToJavaPatternConverter();
    }
    return _patternConverter;
  }
  
  var dateFilter = function() {
    var value = arguments[0];
    var format = arguments[1] || "mediumDate";
    var timezone = arguments[2];
    
    switch(format) {
      case "wr-date":
        return wrLocalizationManager.formatDate(value);
        break;
      case "wr-time":
        return wrLocalizationManager.formatTime(value);
        break;
      case "wr-timestamp":
        return wrLocalizationManager.formatTimestamp(shiftTimezone(value, timezone));
        break;
      case "medium":
        return wrLocalizationManager.formatTimestamp(shiftTimezone(value, timezone), {"style":Style.MEDIUM});
        break;
      case "short":
        return wrLocalizationManager.formatTimestamp(shiftTimezone(value, timezone), {"style":Style.SHORT});
        break;
      case "fullDate":
        return wrLocalizationManager.formatDate(value, {"style":Style.FULL});
        break;
      case "longDate":
        return wrLocalizationManager.formatDate(value, {"style":Style.LONG});
        break;
      case "mediumDate":
        return wrLocalizationManager.formatDate(value, {"style":Style.MEDIUM});
        break;
      case "shortDate":
        return wrLocalizationManager.formatDate(value, {"style":Style.SHORT});
        break;
      case "mediumTime":
        return wrLocalizationManager.formatTime(value, {"style":Style.MEDIUM});
        break;
      case "shortTime":
        return wrLocalizationManager.formatTime(value, {"style":Style.SHORT});
        break;
      default:
        var pattern = getPatternConverter().convert(format);
        return wrLocalizationManager.formatTimestamp(shiftTimezone(value, timezone), {"pattern":pattern});
        break;
    }
  };
  
  /* This filter has to be stateful to respond to changes in the application locale */
  dateFilter["$stateful"] = true;
  
  return dateFilter;
};
wr.mvc.l10n.dateDecorator["$inject"] = ["$delegate", "wrLocalizationManager", "wrLogger"];




//== wr/mvc/l10n/numberDecorator.js ===========================================



/**
 * Decorator for the stock Angular <code>number</code> filter.
 * <p>
 * The decorator has the same behavior of the base filter, with the following additions.
 * <ul>
 * <li>Localization is performed according to WebRatio rules and can change dynamically.
 * <li>Additional formats such as <code>wr-integer</code> enable formatting according to the default rules of a WebRatio type, without
 * having to specify the format (e.g. fraction digits).
 * </ul>
 * 
 * @ngInject
 * @param {!function(*,?):string} $delegate
 * @param {!wr.mvc.l10n.LocalizationManager} wrLocalizationManager
 * @return {!function(*,?):string} A filter function, accepting a value and returning a string. See the stock Angular filter for more
 *         information about the options.
 */
wr.mvc.l10n.numberDecorator = function($delegate, wrLocalizationManager) {
  var _angularFilter = $delegate;
  
  var numberFilter = function() {
    var value = arguments[0];
    var maxFractionDigits = undefined;
    var format = "wr-decimal";
    var options = undefined;
    
    if (arguments.length == 2) {
      if (arguments[1] === "wr-integer" || arguments[1] === "wr-float" || arguments[1] === "wr-decimal") {
        format = arguments[1];
      } else {
        maxFractionDigits = arguments[1];
      }
    } else {
      if (arguments.length > 2) {
        maxFractionDigits = arguments[1];
        format = arguments[2];
      }
    }
    
    if (maxFractionDigits) {
      options = {"maxFractionDigits":maxFractionDigits};
    }
    
    if (format === "wr-integer") {
      return wrLocalizationManager.formatInteger(value, options);
    }
    if (format === "wr-float") {
      return wrLocalizationManager.formatFloat(value, options);
    }
    return wrLocalizationManager.formatDecimal(value, options);
  };
  
  /* This filter has to be stateful to respond to changes in the application locale */
  numberFilter["$stateful"] = true;
  
  return numberFilter;
};
wr.mvc.l10n.numberDecorator["$inject"] = ["$delegate", "wrLocalizationManager"];




//== wr/mvc/ui/FeedbackManager.js =============================================

wr.mvc.ui = {};

/**
 * Constructs a new feedback manager.
 * 
 * @package
 * @constructor
 * @class Manager controlling the overall experience of UI <i>feedbacks</i>.
 */
wr.mvc.ui.FeedbackManager = function() {
  
  /**
   * @private
   * @type {?wr.mvc.FeedbackController}
   */
  this._ctrl = null;
  
  /**
   * @private
   * @type {boolean}
   */
  this._open = false;
  
  /**
   * @private
   * @type {?Object.<string,function(!Object)>}
   */
  this._eventHandlers = null;
  
  /**
   * @private
   * @type {?number}
   */
  this._closeTimeout = null;
  
  /**
   * @private
   * @type {?Promise}
   */
  this._closing = null;
};

/**
 * @package
 * @param {!wr.mvc.FeedbackController} feedbackCtrl
 * @return {!{detachController:function(), throwEvent:function(string,!Object=):!Promise}}
 */
wr.mvc.ui.FeedbackManager.prototype.attachController = function(feedbackCtrl) {
  if (this._ctrl) {
    throw new Error("A feedback controller is already attached");
  }
  
  this._ctrl = feedbackCtrl;
  
  return {detachController:this._detachController.bind(this), throwEvent:this._throwEvent.bind(this)};
};

/**
 * @private
 * @return {undefined}
 */
wr.mvc.ui.FeedbackManager.prototype._detachController = function() {
  this._doClose();
  this._ctrl = null;
};

/**
 * @package
 * @const
 */
wr.mvc.ui.FeedbackManager.CLOSE_EVENT_TYPE = "Close";

/**
 * @package
 * @param {!Object} data
 * @param {number=} timeout
 * @param {!Object.<string,function(string,!Object)>=} eventHandlers
 * @return {!Promise}
 */
wr.mvc.ui.FeedbackManager.prototype.show = function(data, timeout, eventHandlers) {
  var thisFeedbackManager = this;
  return this._doClose().then(function() {
    thisFeedbackManager._doShow(data, timeout, eventHandlers);
  });
};

/**
 * @package
 * @return {!Promise}
 */
wr.mvc.ui.FeedbackManager.prototype.close = function() {
  return this._doClose();
};

/**
 * @private
 * @param {!Object} data
 * @param {number=} timeout
 * @param {!Object.<string,function(string,!Object)>=} eventHandlers
 */
wr.mvc.ui.FeedbackManager.prototype._doShow = function(data, timeout, eventHandlers) {
  var thisFeedbackManager = this;
  var ctrl = this.getController();
  
  ctrl.setFeedbackData(data);
  this._open = true;
  this._eventHandlers = angular.extend({}, eventHandlers);
  
  if (timeout && timeout > 0) {
    this._closeTimeout = GLOBAL.setTimeout(function() {
      thisFeedbackManager._throwEvent(wr.mvc.ui.FeedbackManager.CLOSE_EVENT_TYPE);
    }, timeout);
  }
};

/**
 * @private
 * @return {!Promise}
 */
wr.mvc.ui.FeedbackManager.prototype._doClose = function() {
  var thisFeedbackManager = this;
  
  /* Exit if already closed or closing */
  if (!this._open) {
    return Promise.resolve();
  }
  if (this._closing) {
    return this._closing;
  }
  
  var ctrl = this.getController();
  
  if (this._closeTimeout) {
    GLOBAL.clearTimeout(this._closeTimeout);
    this._closeTimeout = null;
  }
  
  this._closing = ctrl.clearFeedbackData().then(function() {
    thisFeedbackManager._open = false;
    thisFeedbackManager._eventHandlers = null;
    thisFeedbackManager._closing = null;
  });
  
  return this._closing;
};

/**
 * @private
 * @param {string} type
 * @param {!Object=} parameters
 * @return {!Promise}
 */
wr.mvc.ui.FeedbackManager.prototype._throwEvent = function(type, parameters) {
  var promise = Promise.resolve();
  
  /* Handle the event using the custom handler */
  var eventHandler = this._eventHandlers[type];
  if (eventHandler) {
    promise = promise.then(function() {
      eventHandler(parameters || {});
    });
  }
  
  /* Close the feedback (not chained to the promise on purpose!) */
  this._doClose();
  
  return promise;
};

/**
 * @private
 * @return {!wr.mvc.FeedbackController}
 */
wr.mvc.ui.FeedbackManager.prototype.getController = function() {
  if (!this._ctrl) {
    throw new Error("Feeback controller is not available");
  }
  return this._ctrl;
};




//== wr/mvc/ui/BlobProvider.js ================================================


/**
 * @interface Interface of an object that can provide {@link wrm.data.Blob} values on demand.
 *            <p>
 *            The provided BLOB may be authored anew by the user (for example, taking a photograph using a camera) or selected among a
 *            library of available BLOBs (such as an image gallery).
 *            <p>
 *            <h4>Attributes</h4>
 *            <p>
 *            Provided BLOBs can be better specified by attributes. All providers accept attributes that fall in the common set of
 *            attributes described below. While each attribute has a standardized meaning, it is possible that it is not accepted by
 *            all providers. See the documentation of each implementation for more details.
 *            <p>
 *            <table>
 *            <tr>
 *            <th>Attribute</th>
 *            <th>Meaning</th>
 *            </tr>
 *            <tr>
 *            <td><code>height</code></td>
 *            <td>Height of graphical media in pixels.</td>
 *            </tr>
 *            <tr>
 *            <td><code>quality</code></td>
 *            <td>Quality of captured content, such as the pixel density of an image or the sampling frequency of audio. Specified as a
 *            number between <code>0</code> (lowest quality) and <code>100</code> (highest quality).</td>
 *            </tr>
 *            <tr>
 *            <td><code>width</code></td>
 *            <td>Width of graphical media in pixels.</td>
 *            </tr>
 *            </table>
 */
wr.mvc.ui.BlobProvider = function() {
};

/**
 * @typedef {{ height:(number|undefined), quality:(number|undefined), width:(number|undefined) }}
 */
wr.mvc.ui.BlobProvider.Attributes;

/**
 * @internal
 * @const
 * @type {wr.mvc.ui.BlobProvider.Attributes}
 */
wr.mvc.ui.BlobProvider.DEFAULT_ATTRIBUTES = {height:undefined, quality:undefined, width:undefined};

/**
 * Creates an new BLOB from scratch (for example capturing it with a camera).
 * 
 * @param {string=} contentType Content type of the BLOB to capture. If not specified, an appropriate default is chosen.
 * @param {wr.mvc.ui.BlobProvider.Attributes=} attributes Attributes specifying the characteristics of the BLOB to capture. If not
 *            specified, appropriate defaults are chosen. Not all attributes are supported by all providers and content types. See
 *            {@link wr.mvc.ui.BlobProvider} documentation for more information.
 * @return {!Promise.<?wrm.data.Blob>} A BLOB value containing the captured BLOB or <code>null</code> if the user canceled the
 *         operation.
 *         <p>
 *         <b>Rejected</b> with {@link Error} if the content type is not supported.
 */
wr.mvc.ui.BlobProvider.prototype.capture = ABSTRACT_METHOD;

/**
 * Selects an existing BLOB (for example choosing it from a file library).
 * 
 * @param {string=} contentType Content type of the BLOB to select. If not specified, an appropriate default is chosen.
 * @param {wr.mvc.ui.BlobProvider.Attributes=} attributes Attributes specifying the characteristics of the BLOB to capture. If not
 *            specified, appropriate defaults are chosen. Not all attributes are supported by all providers and content types. See
 *            {@link wr.mvc.ui.BlobProvider} documentation for more information.
 * @return {!Promise.<?wrm.data.Blob>} A BLOB value containing the selected BLOB or <code>null</code> if the user canceled the
 *         operation.
 *         <p>
 *         <b>Rejected</b> with {@link Error} if the content type is not supported.
 */
wr.mvc.ui.BlobProvider.prototype.select = ABSTRACT_METHOD;




//== wr/mvc/ui/ImageProvider.js ===============================================



/**
 * @package
 * @constructor
 * @class A {@link wr.mvc.ui.BlobProvider} implementation for selecting images.
 * @implements wr.mvc.ui.BlobProvider
 */
wr.mvc.ui.ImageProvider = function() {
  
  /**
   * @private
   * @type {CameraOptions}
   */
  this._options = ({quality:50, destinationType:Camera.DestinationType.FILE_URI, allowEdit:false, mediaType:Camera.MediaType.PICTURE, correctOrientation:this._needOrientation()});
  
  /**
   * @private
   * @type {!Object.<string,Camera.EncodingType>}
   */
  this._contentMap = {"image":Camera.EncodingType.JPEG, "image/jpeg":Camera.EncodingType.JPEG, "image/png":Camera.EncodingType.PNG};
};

/** @override */
wr.mvc.ui.ImageProvider.prototype.capture = function(contentType, attributes) {
  return this._provide(Camera.PictureSourceType.CAMERA, contentType, attributes);
};

/** @override */
wr.mvc.ui.ImageProvider.prototype.select = function(contentType, attributes) {
  return this._provide(Camera.PictureSourceType.PHOTOLIBRARY, contentType, attributes);
};

/**
 * @private
 * @param {Camera.PictureSourceType} sourceType
 * @param {string=} contentType
 * @param {wr.mvc.ui.BlobProvider.Attributes=} attributes
 * @return {!Promise.<?wrm.data.Blob>}
 */
wr.mvc.ui.ImageProvider.prototype._provide = function(sourceType, contentType, attributes) {
  
  attributes = attributes || wr.mvc.ui.BlobProvider.DEFAULT_ATTRIBUTES;
  
  var cameraOptions = angular.extend({}, this._options);
  cameraOptions.sourceType = sourceType;
  cameraOptions.encodingType = this._getType(contentType);
  
  /* Set image preferences */
  if (attributes.width !== undefined) {
    cameraOptions.targetWidth = attributes.width;
  }
  if (attributes.height !== undefined) {
    cameraOptions.targetHeight = attributes.height;
  }
  if (attributes.quality !== undefined) {
    var MAX_QUALITY = 100;
    cameraOptions.quality = Math.ceil(Math.max(0, Math.min(100, attributes.quality)) / 100 * MAX_QUALITY);
  }
  
  var promise = this._retrieveImage(cameraOptions);
  
  return promise.then(function(newImage) {
    return newImage;
  });
};

/**
 * @private
 * @param {!CameraOptions} options
 * @return {!Promise.<?wrm.data.Blob>}
 */
wr.mvc.ui.ImageProvider.prototype._retrieveImage = function(options) {
  var thisProvider = this;
  return new Promise(function(resolve, reject) {
    return navigator.camera.getPicture(function(imageUri) {
      resolve(thisProvider._onPictureSuccess(imageUri));
    }, function(e) {
      reject(e);
    }, options);
  });
};

/**
 * @private
 * @param {!string} imageUri
 * @return {!Promise.<!wrm.data.Blob>}
 */
wr.mvc.ui.ImageProvider.prototype._onPictureSuccess = function(imageUri) {
  return wrm.util.fs.lookupFile(imageUri).then(function(file) {
    return wrm.data.Blob.fromFile(file, file.type || undefined, {fileName:file.name});
  });
};

/**
 * @private
 * @param {string=} contentType
 * @return {Camera.EncodingType}
 */
wr.mvc.ui.ImageProvider.prototype._getType = function(contentType) {
  contentType = contentType || "image/jpeg";
  var result = this._contentMap[contentType];
  if (result === undefined) {
    throw new Error("Content type " + contentType + " is not supported");
  }
  return result;
};

/**
 * @private
 * @returns {!boolean}
 */
wr.mvc.ui.ImageProvider.prototype._needOrientation = function() {
  var osDevice = wr.mvc.getPlatform();
  if (wr.mvc.Platform.ANDROID === osDevice) {
    return true;
  }
  return false;
};




//== wr/mvc/ui/_ui.js =========================================================



/**
 * @name wr.mvc.ui
 * @namespace Utilities supporting the implementation of the application UI.
 */

/**
 * Shows a native alert box.
 * 
 * @param {string} message Message to show.
 * @param {string} title Title to use for the alert box.
 * @param {string} buttonLabel Label to give to the only button of the alert box.
 * @return {!Promise} Promise resolved after the box is dismissed by the user.
 */
wr.mvc.ui.showAlert = function(message, title, buttonLabel) {
  return new Promise(function(resolve, reject) {
    navigator.notification.alert(message, resolve, title, buttonLabel);
  });
};

/**
 * Shows a native confirmation box.
 * 
 * @param {string} message Message to show.
 * @param {string} title Title to use for the confirmation box.
 * @param {!Array.<string>} buttonLabels Labels to give to the buttons of the confirmation box.
 * @param {number=} defaultButtonIndex Index of the button to assume as chosen when the user dismisses the confirmation box without any
 *            choice. If not specified, it defaults to <code>0</code>.
 * @return {!Promise.<number>} Promise resolved after the box is dismissed by the user. The result number is the index of the chosen
 *         button.
 */
wr.mvc.ui.showConfirm = function(message, title, buttonLabels, defaultButtonIndex) {
  defaultButtonIndex = defaultButtonIndex || 0;
  return new Promise(function(resolve, reject) {
    navigator.notification.confirm(message, function(choiceIndex) {
      resolve(choiceIndex > 0 ? choiceIndex - 1 : defaultButtonIndex);
    }, title, buttonLabels);
  });
};

/**
 * Shows a native dialog box prompting for user credentials.
 * <p>
 * The dialog contains two text fields for entering the username and password, in addition to a variable number of buttons. The
 * username field may be optionally preloaded and made read-only.
 * 
 * @param {string} message Message to show.
 * @param {string} title Title to use for the dialog box.
 * @param {?string} defaultUsername Username to preload into its text field or <code>null</code> to leave it empty.
 * @param {boolean} usernameChangeForbidden <code>true</code> for making the username field read-only.
 * @param {!Array<string>} buttonLabels Labels to give to the buttons of the dialog box.
 * @param {number=} defaultButtonIndex Index of the button to assume as chosen when the user dismisses the dialog box without any
 *            choice. If not specified, it defaults to <code>0</code>.
 * @return {!Promise<{buttonIndex:number, username:string, password:string}>} Promise resolved after the box is dismissed by the user.
 *         The result is an object containing
 *         <ul>
 *         <li><code>buttonIndex</code> - index of the chosen button;
 *         <li><code>username</code> - text entered in the username field;
 *         <li><code>password</code> - text entered in the password field.
 *         </ul>
 */
wr.mvc.ui.showCredentialsPrompt = function(message, title, defaultUsername, usernameChangeForbidden, buttonLabels, defaultButtonIndex) {
  defaultButtonIndex = defaultButtonIndex || 0;
  return new Promise(function(resolve, reject) {
    accountmanager.loginPrompt(message, function(result) {
      resolve({buttonIndex:result.buttonIndex > 0 ? result.buttonIndex - 1 : defaultButtonIndex, username:result.username, password:result.password});
    }, {title:title, usernameDefault:defaultUsername || "", usernameReadOnly:usernameChangeForbidden, buttonLabels:buttonLabels});
  });
};

/**
 * @private
 * @const
 */
wr.mvc.ui._FEEDBACK_MANAGER = new wr.mvc.ui.FeedbackManager;

/**
 * @internal
 * @param {!wr.mvc.FeedbackController} feedbackCtrl
 * @return {!{detachController:function(), throwEvent:function(string,!Object=):!Promise}}
 */
wr.mvc.ui.attachFeedbackController = function(feedbackCtrl) {
  return wr.mvc.ui._FEEDBACK_MANAGER.attachController(feedbackCtrl);
};

/**
 * @const
 */
wr.mvc.ui.FEEDBACK_CLOSE_EVENT_TYPE = "Close";

/**
 * Shows a non-modal interrupting feedback UI.
 * <p>
 * If another feedback is open, it is automatically closed before the new one is shown.
 * 
 * @param {!Object} data Data to use for rendering the feedback.
 * @param {number=} timeout Timeout for automatically closing the feedback. If not specified, it remains open until closed explicitly
 *            or replaced by another feedback.
 * @param {!Object.<string,function(string,!Object)>=} eventHandlers Definitions of additional custom events that may be thrown by the
 *            feedback UI. The keys are the event types. The values are the corresponding handler functions to call. The special event
 *            {@link wr.mvc.ui.FEEDBACK_CLOSE_EVENT_TYPE} can be added for being notified at the time the feedback closes.
 * @return {!Promise} Promise of showing the new feedback.
 */
wr.mvc.ui.showFeedback = function(data, timeout, eventHandlers) {
  return wr.mvc.ui._FEEDBACK_MANAGER.show(data, timeout, eventHandlers);
};

/**
 * Creates a new {@link wr.mvc.ui.BlobProvider} able to provide values of a specific binary object type.
 * 
 * @param {!wrm.data.Type} type A binary object data type.
 * @return {!wr.mvc.ui.BlobProvider} A newly created BLOB provider.
 */
wr.mvc.ui.createBlobProvider = function(type) {
  if (type !== wrm.data.Type.BLOB) {
    throw new Error("Not a binary object type");
  }
  
  /* All BLOBs are images: construct an image provider */
  return new wr.mvc.ui.ImageProvider;
};

/**
 * Opens a local file into a system-provided viewer.
 * 
 * @param {string} fileUrl System-dependent URL pointing to a local file.
 * @param {string} contentType Content type to assume for the opened file. This typically affects the type of viewer provided by the
 *            system.
 * @return {!Promise}
 */
wr.mvc.ui.openFileViewer = function(fileUrl, contentType) {
  return new Promise(function(resolve, reject) {
    cordova.plugins.fileOpener2.open(decodeURI(fileUrl), contentType, {success:function() {
      resolve(undefined);
    }, error:function(e) {
      reject(new Error("Unable to open the file: " + e.message));
    }});
  });
};




//== wr/mvc/route/Interactor.js ===============================================

wr.mvc.route = {};


/**
 * Constructs a new interaction helper.
 * 
 * @package
 * @constructor
 * @class Helper for handling the interactive behaviors that can occur while routing. For example this include showing dialogs or
 *        reporting progress.
 * @param {!angular.Scope} $rootScope
 * @param {!wrm.core.Manager} wrManager
 * @param {!wr.mvc.l10n.LocalizationManager} wrLocalizationManager
 * @param {!wr.mvc.Logger} wrLogger
 */
wr.mvc.route.Interactor = function($rootScope, wrManager, wrLocalizationManager, wrLogger) {
  
  /** @private */
  this._$rootScope = $rootScope;
  
  /** @private */
  this._manager = wrManager;
  
  /** @private */
  this._l10nManager = wrLocalizationManager;
  
  /** @private */
  this._l10nReady = false;
  
  /** @private */
  this._log = wrLogger.createLog("wr.mvc.route.Interactor");
  
  /**
   * @private
   * @type {{started:boolean, paused:boolean, startTimeout:?number, lastProgress:?wrm.nav.Progress}}
   */
  this._activity = {started:false, paused:false, startTimeout:null, lastProgress:null};
  
  /* Listen for activity events (which are actually reported by this object) */
  $rootScope.$on("wrActivityStart", this._handleActivityEvent.bind(this));
  $rootScope.$on("wrActivityProgress", this._handleActivityEvent.bind(this));
  $rootScope.$on("wrActivityStop", this._handleActivityEvent.bind(this));
};

/**
 * @package
 * @return {!Promise}
 */
wr.mvc.route.Interactor.prototype.init = function() {
  var thisInteractor = this;
  if (!this._l10nReady) {
    this._l10nReady = true;
    return this._manager.getLocalizationService().then(function(l10nService) {
      return thisInteractor._l10nManager.initialize(l10nService);
    });
  }
  return Promise.resolve();
};

/*
 * Dialogs
 */

/**
 * @package
 * @template R
 * @param {!wrm.nav.Dialog<R>} dialog
 * @return {!Promise<{value:R, data:!Object}>}
 */
wr.mvc.route.Interactor.prototype.presentDialog = function(dialog) {
  var thisInteractor = this;
  
  /* Pause activity while displaying the dialog */
  this._pauseActivity();
  
  /* Display depending on dialog class */
  var promise;
  if (dialog instanceof wrm.nav.LoginDialog) {
    promise = this._presentLoginDialog(dialog);
  } else {
    promise = this._presentDialog(dialog);
  }
  
  /* Resume activity after closing the dialog */
  return promise.then(function(result) {
    thisInteractor._resumeActivity();
    return result;
  }, function(e) {
    thisInteractor._resumeActivity();
    throw e;
  });
};

/**
 * @private
 * @template R
 * @param {!wrm.nav.LoginDialog<R>} dialog
 * @return {!Promise<{value:R, data:{username:string, password:string}}>}
 */
wr.mvc.route.Interactor.prototype._presentLoginDialog = function(dialog) {
  var log = this._log;
  
  /* Determine the message and title to use */
  var message = dialog.getMessage();
  var title = this.getLocalizedMessage("loginDialog.title");
  
  /* Display an appropriate dialog */
  var choiceLabels = dialog.getChoiceLabels();
  var useDefaultChoiceLabels = choiceLabels.length === 0;
  if (choiceLabels.length === 0) {
    choiceLabels.push(this.getLocalizedMessage("dialog.button.OK"));
  }
  return wr.mvc.ui.showCredentialsPrompt(message, title, dialog.getDefualtUsername(), dialog.isUsernameChangeForbidden(), choiceLabels, dialog.getDefaultChoiceIndex()).then(function(result) {
    var value = !useDefaultChoiceLabels ? dialog.getChoiceValue(result.buttonIndex) : undefined;
    return {value:value, data:{username:result.username, password:result.password}};
  })["catch"](function(e) {
    log.error("Error displaying login prompt", e);
  });
};

/**
 * @private
 * @template R
 * @param {!wrm.nav.Dialog<R>} dialog
 * @return {!Promise<{value:R, data:!Object}>}
 */
wr.mvc.route.Interactor.prototype._presentDialog = function(dialog) {
  var Flavor = wrm.nav.Dialog.Flavor;
  var log = this._log;
  
  /* Determine the message and title to use */
  var message, title;
  switch(dialog.getFlavor()) {
    case Flavor.POSITIVE:
      return Promise.reject(new Error("Positive dialogs are not supported"));
    case Flavor.CAUTIONAL:
      message = dialog.getMessage();
      title = this.getLocalizedMessage("dialog.title.warning");
      break;
    case Flavor.NEGATIVE:
    ;
    default:
      message = dialog.getMessage();
      title = this.getLocalizedMessage("dialog.title.error");
  }
  
  /* Display an appropriate dialog */
  var choiceLabels = dialog.getChoiceLabels();
  var useDefaultChoiceLabels = choiceLabels.length === 0;
  if (choiceLabels.length === 0) {
    choiceLabels.push(this.getLocalizedMessage("dialog.button.OK"));
  }
  return wr.mvc.ui.showConfirm(message, title, choiceLabels, dialog.getDefaultChoiceIndex()).then(function(buttonIndex) {
    var value = !useDefaultChoiceLabels ? dialog.getChoiceValue(buttonIndex) : undefined;
    return {value:value, data:{}};
  })["catch"](function(e) {
    log.error("Error displaying confirmation", e);
  });
};

/*
 * Activity feedback
 */

/**
 * @private
 * @const
 */
wr.mvc.route.Interactor._ACTIVITY_LATENCY = 700;

/**
 * @package
 * @param {boolean=} immediateFeedback
 * @return {undefined}
 */
wr.mvc.route.Interactor.prototype.startActivity = function(immediateFeedback) {
  this._doStopActivity();
  this._doStartActivity(false, immediateFeedback);
};

/**
 * @package
 * @return {undefined}
 */
wr.mvc.route.Interactor.prototype.stopActivity = function() {
  this._doStopActivity();
};

/**
 * @package
 * @param {!wrm.nav.Progress} progress
 */
wr.mvc.route.Interactor.prototype.progressActivity = function(progress) {
  var activity = this._activity;
  if (!activity.started || activity.paused) {
    return;
  }
  
  /* Report progress as first one when the start timeout fires, or immediately if it already fired */
  activity.lastProgress = progress;
  if (!activity.startTimeout) {
    this._doProgressActivity(progress);
  }
};

/**
 * @private
 * @return {undefined}
 */
wr.mvc.route.Interactor.prototype._pauseActivity = function() {
  this._doStopActivity(true);
};

/**
 * @private
 * @return {undefined}
 */
wr.mvc.route.Interactor.prototype._resumeActivity = function() {
  this._doStopActivity(true);
  this._doStartActivity(true);
};

/**
 * @private
 * @param {boolean=} resume
 * @param {boolean=} immediateFeedback
 * @return {undefined}
 */
wr.mvc.route.Interactor.prototype._doStartActivity = function(resume, immediateFeedback) {
  var thisInteractor = this;
  var activity = this._activity;
  
  /* Avoid starting a completely new activity when resuming */
  if (resume && !activity.started) {
    return;
  }
  
  /* Start a new activity, setting a timer for the first broadcast */
  activity.started = true;
  activity.paused = false;
  function activityStartFunction() {
    thisInteractor._$rootScope.$broadcast("wrActivityStart");
    if (activity.lastProgress) {
      thisInteractor._doProgressActivity(activity.lastProgress);
    }
    activity.startTimeout = null;
  }
  if (!resume) {
    activity.lastProgress = null;
  }
  if (immediateFeedback) {
    activityStartFunction();
  } else {
    activity.startTimeout = GLOBAL.setTimeout(activityStartFunction, wr.mvc.route.Interactor._ACTIVITY_LATENCY);
  }
};

/**
 * @private
 * @param {boolean=} pause
 * @return {undefined}
 */
wr.mvc.route.Interactor.prototype._doStopActivity = function(pause) {
  var activity = this._activity;
  if (!activity.started) {
    return;
  }
  
  /* Stop the current activity, broadcasting an event only if the first was broadcast */
  if (!pause) {
    activity.started = false;
    activity.paused = false;
    activity.lastProgress = null;
  } else {
    activity.paused = true;
  }
  if (activity.startTimeout) {
    GLOBAL.clearTimeout(activity.startTimeout);
    activity.startTimeout = null;
  } else {
    this._$rootScope.$broadcast("wrActivityStop");
  }
};

/**
 * @private
 * @param {!wrm.nav.Progress} progress
 */
wr.mvc.route.Interactor.prototype._doProgressActivity = function(progress) {
  this._$rootScope.$broadcast("wrActivityProgress", {message:progress.getMessage()});
};

/**
 * @private
 * @param {!angular.Scope.Event} event
 * @param {{message:?string}} args
 */
wr.mvc.route.Interactor.prototype._handleActivityEvent = function(event, args) {
  var $rootScope = this._$rootScope;
  switch(event.name) {
    case "wrActivityStart":
      $rootScope["activity"] = {"message":null};
      break;
    case "wrActivityProgress":
      if ($rootScope["activity"]) {
        $rootScope["activity"]["message"] = args.message;
      }
      break;
    case "wrActivityStop":
      $rootScope["activity"] = null;
      break;
  }
};

/*
 * Utilities
 */

/**
 * @package
 * @param {string} key
 * @return {string}
 */
wr.mvc.route.Interactor.prototype.getLocalizedMessage = function(key) {
  return this._l10nManager.formatMessage(key);
};




//== wr/mvc/route/ScreenSwitchInfo.js =========================================


/**
 * @constructor
 * @param {string} direction
 */
wr.mvc.route.ScreenSwitchInfo = function(direction) {
  
  /** @private */
  this._direction = direction;
};

/**
 * @return {string}
 */
wr.mvc.route.ScreenSwitchInfo.prototype.getDirection = function() {
  return this._direction;
};




//== wr/mvc/route/ScreenSwitcher.js ===========================================



/**
 * Constructs a new switcher.
 * 
 * @package
 * @constructor
 * @class Helper for switching partial templates that visually implement the UI of screens. The screens are also tied two-way to the
 *        location address.
 * @param {!angular.Scope} $rootScope
 * @param {!angular.$routeParams} $routeParams
 * @param {!angular.$location} $location
 * @param {!wr.mvc.Logger} wrLogger
 */
wr.mvc.route.ScreenSwitcher = function($rootScope, $routeParams, $location, wrLogger) {
  wr.mvc.route.ScreenSwitcher._INSTANCES.push(this);
  
  /** @private */
  this._$rootScope = $rootScope;
  
  /** @private */
  this._$routeParams = $routeParams;
  
  /** @private */
  this._$location = $location;
  
  /**
   * @private
   * @type {?wr.mvc.route.ScreenSwitcher._Switch}
   */
  this._pendingSwitch = null;
  
  /**
   * @private
   * @type {?wr.mvc.route.ScreenSwitcher._Switch}
   */
  this._lastSwitch = null;
  
  /* Register handlers for keeping track of Angular view changes and load errors */
  $rootScope.$on("$routeChangeSuccess", this._handleRouteChangeSuccess.bind(this));
  $rootScope.$on("$routeChangeError", this._handleRouteChangeError.bind(this));
  $rootScope.$on("$viewContentLoaded", this._handleViewContentLoaded.bind(this));
  
  /**
   * @private
   * @type {?function(?string):(!Promise|undefined)}
   */
  this._directSwitchHandler = null;
  
  /**
   * @private
   * @type {?function(?string):?wr.mvc.route.RenderingProvider}
   */
  this._renderingProviderFactory = null;
  
  /** @private */
  this._log = wrLogger.createLog("wr.mvc.route.ScreenSwitcher");
};

/**
 * @private
 * @type {!Array<!wr.mvc.route.ScreenSwitcher>}
 */
wr.mvc.route.ScreenSwitcher._INSTANCES = [];

/**
 * @param {function(?string):(!Promise|undefined)} handler
 */
wr.mvc.route.ScreenSwitcher.prototype.setDirectSwitchHandler = function(handler) {
  this._directSwitchHandler = handler || null;
};

/**
 * @param {function(?string):?wr.mvc.route.RenderingProvider} handler
 */
wr.mvc.route.ScreenSwitcher.prototype.setRenderingProviderFactory = function(handler) {
  this._renderingProviderFactory = handler || null;
};

/**
 * @private
 * @typedef {{requestedScreenId:string,direction:string,resolve:function(?),reject:function(Error)}}
 */
wr.mvc.route.ScreenSwitcher._Switch;

/**
 * @private
 * @param {?string} newScreenId
 * @return {!Promise|undefined}
 */
wr.mvc.route.ScreenSwitcher.prototype._handleRoutePreload = function(newScreenId) {
  
  /* Trap a potential direct switch (i.e. user-initiated) */
  return this._trapDirectSwitch(newScreenId);
};

/**
 * @private
 */
wr.mvc.route.ScreenSwitcher.prototype._handleRouteChangeSuccess = function() {
  var newScreenId = this._$routeParams["screenId"] || null;
  this._log.debug("Route change succeeded for location", this._$location.url(), "reaching screen", newScreenId);
  this._handleSuccessfulScreenSwitch(newScreenId);
};

/**
 * @private
 */
wr.mvc.route.ScreenSwitcher.prototype._handleRouteChangeError = function() {
  this._log.error("Route change failed for location", this._$location.url());
  this._handleFailedScreenSwitch();
};

/**
 * @private
 */
wr.mvc.route.ScreenSwitcher.prototype._handleViewContentLoaded = function() {
  var lastSwitch = this._lastSwitch;
  if (lastSwitch) {
    this._broadcastViewSwitchEvent("wrScreenSwitchSuccess", lastSwitch);
  }
};

/**
 * @private
 * @param {?string} newScreenId
 */
wr.mvc.route.ScreenSwitcher.prototype._handleSuccessfulScreenSwitch = function(newScreenId) {
  
  /* If a switch was expected, it is over with a success/failure depending on the new screen matching the requested one */
  var pendingSwitch = this._pendingSwitch;
  if (pendingSwitch) {
    this._lastSwitch = pendingSwitch;
    this._pendingSwitch = null;
    if (newScreenId === pendingSwitch.requestedScreenId) {
      this._log.debug("Completed switch to screen", pendingSwitch.requestedScreenId);
      pendingSwitch.resolve(undefined);
    } else {
      this._log.error("Failed switch to screen", pendingSwitch.requestedScreenId, ": instead reached", newScreenId);
      this._broadcastViewSwitchEvent("wrScreenSwitchFailure", pendingSwitch);
      pendingSwitch.reject(new Error("Switched to unexpected screen '" + newScreenId + "'"));
    }
  }
};

/**
 * @private
 */
wr.mvc.route.ScreenSwitcher.prototype._handleFailedScreenSwitch = function() {
  
  /* If a switch was expected, it is over with a failure */
  var pendingSwitch = this._pendingSwitch;
  if (pendingSwitch) {
    this._pendingSwitch = null;
    this._log.error("Failed switch to screen", pendingSwitch.requestedScreenId);
    this._broadcastViewSwitchEvent("wrScreenSwitchFailure", pendingSwitch);
    pendingSwitch.reject(new Error("Switch failed"));
  }
};

/**
 * @param {string} screenId
 * @param {string} direction
 * @return {!Promise}
 */
wr.mvc.route.ScreenSwitcher.prototype.switchTo = function(screenId, direction) {
  
  /* Cancel the current pending switch (if any) */
  var previousPendingSwitch = this._pendingSwitch;
  if (previousPendingSwitch) {
    this._pendingSwitch = null;
    this._log.debug("Canceled switch to screen", previousPendingSwitch.requestedScreenId);
    this._broadcastViewSwitchEvent("wrScreenSwitchFailure", previousPendingSwitch);
    previousPendingSwitch.reject(new Error("Switch failed"));
  }
  
  /* Prepare a promise for the switch operation */    /** @type {wr.mvc.route.ScreenSwitcher._Switch} */
  var pendingSwitch;
  var promise = new Promise(function(resolve, reject) {
    pendingSwitch = {requestedScreenId:screenId, direction:direction, resolve:resolve, reject:reject};
  });
  this._pendingSwitch = pendingSwitch;
  
  /* Change location and ensure that the route happens ASAP */
  this._log.debug("Initiating switch to screen", screenId);
  this._broadcastViewSwitchEvent("wrScreenSwitchStart", pendingSwitch);
  this._$location.path("/screens/" + screenId).search("direction", direction);
  wr.mvc.applyScope(this._$rootScope);
  
  return promise;
};

/**
 * @private
 * @param {?string} newScreenId
 * @return {!Promise|undefined}
 */
wr.mvc.route.ScreenSwitcher.prototype._trapDirectSwitch = function(newScreenId) {
  
  /* If there is a pending switch initiated from the outside, there is nothing to do */
  if (this._pendingSwitch) {
    return;
  }
  
  /*
   * Start a "fake" switch to the directly-accessed screen; this is done just in time to handle it as a regular switch in
   * success/error methods
   */
  var fakeSwitch = ({requestedScreenId:newScreenId, direction:"none", resolve:angular.noop, reject:angular.noop});
  this._pendingSwitch = fakeSwitch;
  this._broadcastViewSwitchEvent("wrScreenSwitchStart", fakeSwitch);
  
  /* Allow clients to handle the direct switch */
  if (this._directSwitchHandler) {
    return this._directSwitchHandler(newScreenId);
  }
};

/**
 * @private
 * @param {string} name
 * @param {wr.mvc.route.ScreenSwitcher._Switch} sswitch
 */
wr.mvc.route.ScreenSwitcher.prototype._broadcastViewSwitchEvent = function(name, sswitch) {
  this._$rootScope.$broadcast(name, {"screenId":sswitch.requestedScreenId, "backward":sswitch.direction === "backward"});
};

/**
 * @private
 * @param {?string} newScreenId
 * @return {?wr.mvc.route.RenderingProvider}
 */
wr.mvc.route.ScreenSwitcher.prototype._createRenderingProvider = function(newScreenId) {
  if (!this._renderingProviderFactory) {
    throw new Error("Missing rendering provider factory");
  }
  return this._renderingProviderFactory(newScreenId);
};

/**
 * @package
 * @param {!angular.$routeProvider} $routeProvider
 * @param {(function(string):(function(?):(!Promise|undefined)))|undefined} preloaderProviderFunction
 * @param {function(string):string} templateUrlFunction
 */
wr.mvc.route.ScreenSwitcher.configureRouting = function($routeProvider, preloaderProviderFunction, templateUrlFunction) {
  
  /**
   * @ngInject
   * @param {!angular.$route} $route
   * @param {!angular.$injector} $injector
   * @return {!Promise<?wr.mvc.route.RenderingProvider>}
   */
  function renderingResolver($route, $injector) {
    var allScreenSwitchers = wr.mvc.route.ScreenSwitcher._INSTANCES;
    var screenId = $route.current.params["screenId"];
    
    /* Let screen switchers handle the route preload phase */
    return Promise.all(allScreenSwitchers.map(function(screenSwitcher) {
      return screenSwitcher._handleRoutePreload(screenId);
    })).then(function() {
      
      /* Allow preparing preloaded data */
      if (preloaderProviderFunction) {
        var preloader = preloaderProviderFunction(screenId);
        if (preloader) {
          return $injector.invoke(preloader);
        }
      }
    }).then(function() {
      
      /* Let screen switcher create a rendering provider */
      var renderingProvider = null;
      for (var i = 0;i < allScreenSwitchers.length;i++) {
        renderingProvider = allScreenSwitchers[i]._createRenderingProvider(screenId);
        if (renderingProvider) {
          break;
        }
      }
      return renderingProvider;
    });
  }
  renderingResolver["$inject"] = ["$route", "$injector"];
  
  /**
   * @ngInject
   * @param {!angular.$route} $route
   * @return {!wr.mvc.route.ScreenSwitchInfo}
   */
  function switchInfo($route) {
    return new wr.mvc.route.ScreenSwitchInfo($route.current.params["direction"] || "none");
  }
  switchInfo["$inject"] = ["$route"];
  
  /* Add the route */
  $routeProvider.when("/screens/:screenId", {resolve:{"wrRenderingProvider":renderingResolver, "wrSwitchInfo":switchInfo}, templateUrl:function(params) {
    return templateUrlFunction(params["screenId"]);
  }});
};




//== wr/mvc/route/AttachedView.js =============================================



/**
 * Constructs a new attached view.
 * 
 * @package
 * @constructor
 * @class Wrapper objects holding a {@link wrm.core.View} object and binding it to Angular scopes. The scopes are automatically
 *        notified of updates each time the refreshable view is refreshed.
 */
wr.mvc.route.AttachedView = function() {
  
  /**
   * @private
   * @type {!Array.<!angular.Scope>}
   */
  this._scopes = [];
  
  var updating = false;
  var _updatingBG = false;
  var scopes = this._scopes;
  var view = (Object.create((Object.prototype), {"updating":{get:function() {
    return updating;
  }, set:function(value) {
    updating = value;
    this["applyChanges"]();
  }}, "_updatingBG":{get:function() {
    return _updatingBG;
  }, set:function(value) {
    _updatingBG = value;
    this["applyChanges"]();
  }}, "applyChanges":{value:function() {
    for (var i = 0;i < scopes.length;i++) {
      wr.mvc.applyScopeAsync(scopes[i]);
    }
  }}}));
  
  /**
   * @private
   * @type {!wrm.core.View}
   */
  this._view = view;
};

/**
 * @return {!wrm.core.View}
 */
wr.mvc.route.AttachedView.prototype.getView = function() {
  return this._view;
};

/**
 * @param {!angular.Scope} scope
 */
wr.mvc.route.AttachedView.prototype.attachScope = function(scope) {
  
  /* Enlist the new scope, including it in subsequent 'applyChanges' */
  var scopes = this._scopes;
  scopes.push(scope);
  
  /* Remove scope from array when it is destroyed */
  var unsubscribeFn = scope.$on("$destroy", function() {
    unsubscribeFn();
    for (var i = 0;i < scopes.length;i++) {
      if (scopes[i] === scope) {
        scopes.splice(i--, 1);
      }
    }
  });
};

/**
 * @param {!Object} object
 * @param {*} trackingId
 */
wr.mvc.route.AttachedView.markObjectForTracking = function(object, trackingId) {
  
  /*
   * Add to the object the internal property that is used by default for tracking by the ngRepeat Angular directive. This is an
   * undocumented feature that may change in future Angular versions. Also, this trick may be superseded by the future feature that
   * will allow specifying a custom equality logic (see https://github.com/angular/angular.js/issues/10069).
   */
  Object.defineProperty(object, "$$hashKey", {writable:true, value:trackingId});
  
};




//== wr/mvc/route/ModelHolder.js ==============================================



/**
 * Constructs a new model holder.
 * 
 * @package
 * @constructor
 * @class A set of scope models, each represented by a <code>NgModelController</code> object. The state of models is exposed in a
 *        <code>wrm.form.FormState</code> object. The exposed form state is mostly read only, with the exception of forcibly setting
 *        some state flags.
 *        <p>
 *        Controllers are added and removed dynamically by calling {@link #addController} and {@link #removeController}.
 * @param {!wr.mvc.route.Interactor} interactor The used interactor.
 */
wr.mvc.route.ModelHolder = function(interactor) {
  
  /** @private */
  this._uniqueId = wr.mvc.route.ModelHolder._nextUniqueId++;
  
  /**
   * @private
   * @type {!Array.<!angular.FormController>}
   */
  this._formCtrls = [];
  
  /**
   * @private
   * @type {!Object.<string,!angular.NgModelController>}
   */
  this._modelCtrls = {};
  
  /**
   * @private
   * @type {!Object.<string,{value:*,dirty:boolean,valid:boolean,invalid:boolean}>}
   */
  this._propertyStates = {};
  
  /**
   * @private
   * @type {!wrm.form.FormState}
   */
  this._formState = wr.mvc.route.ModelHolder._createFormState(this._formCtrls, this._modelCtrls, this._propertyStates, interactor);
};

/**
 * @private
 * @type {number}
 */
wr.mvc.route.ModelHolder._nextUniqueId = 0;

/**
 * @private
 * @param {!Array.<!angular.FormController>} formCtrls
 * @param {!Object.<string,!angular.NgModelController>} modelCtrls
 * @param {!Object.<string,{value:*,dirty:boolean,valid:boolean,invalid:boolean}>} propertyStates
 * @param {!wr.mvc.route.Interactor} interactor
 * @return {!wrm.form.FormState}
 */
wr.mvc.route.ModelHolder._createFormState = function(formCtrls, modelCtrls, propertyStates, interactor) {
  
  function getPropertyController(propertyName, optional) {
    var modelCtrl = modelCtrls[propertyName];
    if (!modelCtrl && !optional) {
      throw new Error("No input control found for property '" + propertyName + "'");
    }
    return modelCtrl;
  }
  
  return ({setValidity:function(validity) {
    formCtrls.forEach(function(formCtrl) {
      formCtrl.$setValidity(wr.mvc.VALIDATION_VALIDATOR_KEY, validity, formCtrl);
    });
  }, publishValidViewValues:function() {
    Object.keys(propertyStates).forEach(function(propertyState) {
      var modelCtr = modelCtrls[propertyState];
      if (propertyStates[propertyState].valid && (modelCtr.$modelValue === undefined && modelCtr["$$rawModelValue"] !== null)) {
        if (modelCtr.$modelValue !== modelCtr["$$rawModelValue"]) {
          modelCtr.$modelValue = modelCtr["$$rawModelValue"];
          modelCtr["$$writeModelToScope"]();
        }
      }
    });
  }, getProperty:function(propertyName) {
    return propertyStates[propertyName] || null;
  }, setPropertyValidity:function(propertyName, validity) {
    var modelCtrl = getPropertyController(propertyName, false);
    modelCtrl.$setValidity(wr.mvc.VALIDATION_VALIDATOR_KEY, validity);
  }, getPropertyPlatformValidity:function(propertyName) {
    var modelCtrl = getPropertyController(propertyName, true);
    if (modelCtrl) {
      return !wr.mvc.route.ModelHolder._platformHasNativeError(modelCtrl);
    }
    return true;
  }, getPlatformValidity:function() {
    var isPlatformValid = true;
    formCtrls.forEach(function(formCtrl) {
      if (isPlatformValid && wr.mvc.route.ModelHolder._platformHasNativeError(formCtrl)) {
        isPlatformValid = false;
        return;
      }
    });
    return isPlatformValid;
  }, getPropertyPlatformErrors:function(propertyName) {
    var modelCtrl = getPropertyController(propertyName, true);
    var errors = [];
    if (modelCtrl) {
      Object.keys(wr.mvc.PLATFORM_VALIDATION_KEY).forEach(function(key) {
        var typedKey = (key);
        if (modelCtrl.$error && modelCtrl.$error[wr.mvc.PLATFORM_VALIDATION_KEY[typedKey]]) {
          errors.push(interactor.getLocalizedMessage(wr.mvc.PLATFORM_VALIDATION_KEY[typedKey]));
        }
      });
    }
    return errors;
  }, clearPropertyDirtiness:function(propertyName) {
    var modelCtrl = getPropertyController(propertyName, true);
    if (modelCtrl) {
      modelCtrl.$setPristine();
      modelCtrl.$setUntouched();
    }
  }});
};

/**
 * @package
 * @param {string} propertyName
 * @param {!angular.NgModelController} modelCtrl
 * @param {?angular.FormController} formCtrl
 */
wr.mvc.route.ModelHolder.prototype.addController = function(propertyName, modelCtrl, formCtrl) {
  
  /* Check for another controller already added for the same property */
  var oldModelCtrl = this._modelCtrls[propertyName];
  if (oldModelCtrl) {
    if (oldModelCtrl !== modelCtrl) {
      throw new Error("Already added another model controller for property '" + propertyName + "'");
    }
    return;
  }
  
  /* Add the form controller (if referenced for the first time) */
  if (formCtrl && this._countFormControllerUsages(formCtrl, +1) === 1) {
    this._formCtrls.push(formCtrl);
  }
  
  this._modelCtrls[propertyName] = modelCtrl;
  this._propertyStates[propertyName] = this._createPropertyState(modelCtrl);
};

/**
 * @package
 * @param {string} propertyName
 * @param {!angular.NgModelController} modelCtrl
 * @param {?angular.FormController} formCtrl
 */
wr.mvc.route.ModelHolder.prototype.removeController = function(propertyName, modelCtrl, formCtrl) {
  
  /* Check for the currently added controller for the property */
  var oldModelCtrl = this._modelCtrls[propertyName];
  if (!oldModelCtrl || oldModelCtrl !== modelCtrl) {
    return;
  }
  
  /* Remove the form controller (if no longer referenced) */
  if (formCtrl && this._countFormControllerUsages(formCtrl, -1) <= 0) {
    for (var i = 0;i < this._formCtrls.length;i++) {
      if (this._formCtrls[i] === formCtrl) {
        this._formCtrls.splice(i, 1);
        break;
      }
    }
  }
  
  delete this._modelCtrls[propertyName];
  delete this._propertyStates[propertyName];
};

/**
 * @private
 * @param {!angular.FormController} formCtrl
 * @param {number} increment
 * @return {number}
 */
wr.mvc.route.ModelHolder.prototype._countFormControllerUsages = function(formCtrl, increment) {
  var propertyName = "_wr_holdCount_" + this._uniqueId;
  var oldCount = formCtrl[propertyName];
  if (oldCount === undefined) {
    Object.defineProperty(formCtrl, propertyName, {writable:true, value:0});
    oldCount = 0;
  }
  var newCount = oldCount + increment;
  formCtrl[propertyName] = newCount;
  return newCount;
};

/**
 * @private
 * @param {!angular.NgModelController} modelCtrl
 * @return {{value:*, dirty:boolean, valid:boolean, invalid:boolean}}
 */
wr.mvc.route.ModelHolder.prototype._createPropertyState = function(modelCtrl) {
  
  function makeGetter(getter) {
    return {configurable:true, enumerable:true, get:getter};
  }
  
  return (Object.create(null, {value:makeGetter(function() {
    return modelCtrl["$$rawModelValue"];
  }), dirty:makeGetter(function() {
    return modelCtrl.$dirty;
  }), valid:makeGetter(function() {
    return modelCtrl.$valid;
  }), invalid:makeGetter(function() {
    return modelCtrl.$invalid;
  })}));
};

/**
 * @return {!wrm.form.FormState}
 */
wr.mvc.route.ModelHolder.prototype.getFormState = function() {
  return this._formState;
};

/**
 * @param {!angular.NgModelController|!angular.FormController} modelCtrl
 * @return {boolean}
 */
wr.mvc.route.ModelHolder._platformHasNativeError = function(modelCtrl) {
  var errorsKey = Object.keys(modelCtrl.$error);
  switch(errorsKey.length) {
    case 0:
      return false;
    case 1:
      return !(errorsKey[0] === wr.mvc.VALIDATION_VALIDATOR_KEY);
    default:
      return true;
  }
};




//== wr/mvc/route/Rendering.js ================================================



/**
 * Constructs a new rendering.
 * 
 * @internal
 * @constructor
 * @class Full rendering of part of the application, including its underlying data scope.
 *        <p>
 *        When the rendering is being used as an active part of the UI, it is said to be <i>connected</i>. It can be disconnected and
 *        reconnected at any time.
 *        <p>
 *        When no longer used, the rendering <b>must</b> be explicitly destroyed by calling {@link #destroy}. This will cause any
 *        additional memory or native resource to be eventually reclaimed.
 * @param {!angular.Scope} scope
 * @param {!angular.JQLite} element
 * @param {!wrm.Log} log
 */
wr.mvc.route.Rendering = function(scope, element, log) {
  
  /** @private */
  this._id = wr.mvc.route.Rendering._nextId++;
  
  /** @private */
  this._scope = scope;
  
  /** @private */
  this._element = new wr.mvc.route.Rendering._Element(element);
  
  /**
   * @private
   * @type {boolean}
   */
  this._connected = true;
  
  /** @private */
  this._destroyAfterRelease = false;
  
  /** @private */
  this._destroyScheduled = false;
  
  /** @private */
  this._log = log;
};

/**
 * @private
 * @const
 */
wr.mvc.route.Rendering._DESTROY_ON_RELEASE_DELAY = 2E3;

/**
 * @private
 * @const
 */
wr.mvc.route.Rendering._NO_CACHE_SELECTOR = ".wr-noViewCache";

/** @private */
wr.mvc.route.Rendering._nextId = 0;

/**
 * @return {!angular.Scope}
 */
wr.mvc.route.Rendering.prototype.getScope = function() {
  this._checkNotDestroyed();
  return this._scope;
};

/**
 * @return {!angular.JQLite}
 */
wr.mvc.route.Rendering.prototype.getElement = function() {
  this._checkNotDestroyed();
  return this._element;
};

/**
 * @param {function(!wr.mvc.route.Rendering)=} exitFn
 */
wr.mvc.route.Rendering.prototype.release = function(exitFn) {
  this.disconnect();
  if (exitFn) {
    exitFn(this);
  }
  
  /* Decide to destroy if marked to do so or if the DOM is not compatible with caching */
  var shouldDestroy = this._destroyAfterRelease;
  if (!shouldDestroy) {
    if (this._element[0].querySelector(wr.mvc.route.Rendering._NO_CACHE_SELECTOR)) {
      this._log.debug(this, "cannot be cached");
      shouldDestroy = true;
    }
  }
  
  /* Destroy if marked to do so or if the DOM is not compatible with caching; wait a short time to allow animations */
  if (shouldDestroy) {
    GLOBAL.setTimeout(this.destroy.bind(this), wr.mvc.route.Rendering._DESTROY_ON_RELEASE_DELAY);
    this._destroyScheduled = true;
  }
};

/**
 * @package
 * @return {boolean}
 */
wr.mvc.route.Rendering.prototype.isConnected = function() {
  return this._connected;
};

/**
 * @package
 * @return {undefined}
 */
wr.mvc.route.Rendering.prototype.connect = function() {
  this._checkNotDestroyed();
  if (this._connected) {
    throw new Error("Rendering already connected");
  }
  this._connected = true;
  wr.mvc.reconnectScope(this._scope);
  this._log.debug(this, "connected");
};

/**
 * @package
 * @return {undefined}
 */
wr.mvc.route.Rendering.prototype.disconnect = function() {
  this._checkNotDestroyed();
  if (!this._connected) {
    throw new Error("Rendering already disconnected");
  }
  this._connected = false;
  wr.mvc.disconnectScope(this._scope);
  this._log.debug(this, "disconnected");
};

/**
 * @private
 * @return {undefined}
 */
wr.mvc.route.Rendering.prototype._checkNotDestroyed = function() {
  if (this.isDestroyed()) {
    throw new Error("Rendering destroyed");
  }
};

/**
 * @package
 * @return {boolean}
 */
wr.mvc.route.Rendering.prototype.isDestroyed = function() {
  return !this._scope || !this._element || this._destroyScheduled;
};

/**
 * @package
 * @return {undefined}
 */
wr.mvc.route.Rendering.prototype.destroyAfterRelease = function() {
  this._destroyAfterRelease = true;
};

/**
 * @package
 * @return {undefined}
 */
wr.mvc.route.Rendering.prototype.destroy = function() {
  if (this._connected) {
    throw new Error("Rendering still connected");
  }
  if (this._scope) {
    
    /*
     * Execute the actual destroy logic in a digest cycle. It must happen this way because the scope $destroy method will cause
     * some logic to run (e.g. for directive cleanup). If run outside of a digest cycle, any post-digest logic will then stay
     * behind until the next one. If we'd let that happen, it would cause short-lived memory leaks and hanging of integration tests
     * that use the management interface for waiting for rendering tasks.
     */
    wr.mvc.applyScopeAsync(this._scope, this._performDestroy.bind(this, this._scope, this._element));
    
    this._scope = null;
    this._element = null;
  }
};

/**
 * @private
 * @param {!angular.Scope} scope
 * @param {?wr.mvc.route.Rendering._Element} element
 */
wr.mvc.route.Rendering.prototype._performDestroy = function(scope, element) {
  scope.$destroy();
  if (element) {
    element.wrRemove();
  }
  this._log.debug(this, "destroyed");
};

/** @override */
wr.mvc.route.Rendering.prototype.toString = function() {
  return "Rendering " + this._id;
};

/*
 * Wrapped element
 */

/**
 * @private
 * @constructor
 * @extends angular.JQLite
 * @param {!angular.JQLite} element
 */
wr.mvc.route.Rendering._Element = function(element) {
  var originalDetach = element.detach;
  var originalRemove = element.remove;
  
  /** @override */
  element.detach = function() {
    if (DEBUG && arguments.length > 0) {
      throw new Error("Detach arguments not supported");
    }
    return originalDetach.call(this);
  };
  
  /** @override */
  element.remove = function() {
    if (DEBUG && arguments.length > 0) {
      throw new Error("Remove arguments not supported");
    }
    return originalDetach.call(this);
  };
  
  /**
   * @return {!angular.JQLite}
   */
  element.wrRemove = function() {
    return originalRemove.call(this);
  };
  
  return element;
};




//== wr/mvc/route/RenderingProvider.js ========================================



/**
 * @internal
 * @interface Provider for obtaining {@link wr.mvc.route.Rendering renderings}. The renderings can be constructed new or reused.
 */
wr.mvc.route.RenderingProvider = function() {
};

/**
 * Retrieves a rendering, either reusing one or creating a new one. Optionally executes a function for letting the rendering "enter"
 * the application UI.
 * 
 * @param {function(!wr.mvc.route.Rendering)=} enterFn
 * @param {function(function({scope:!angular.Scope,element:!angular.JQLite}))=} factoryFn
 * @return {!wr.mvc.route.Rendering}
 */
wr.mvc.route.RenderingProvider.prototype.retrieve = function(enterFn, factoryFn) {
};




//== wr/mvc/route/AbstractRenderingProvider.js ================================



/**
 * Constructs a new rendering provider.
 * 
 * @package
 * @constructor
 * @class Base implementation of a {@linkplain wr.mvc.route.RenderingProvider rendering provider}.
 *        <p>
 *        This class provides utility methods for constructing {@link wr.mvc.route.Rendering} instances directly or from a factory
 *        function. They may be overridden for supplying additional factory logic.
 * @implements wr.mvc.route.RenderingProvider
 * @param {!wrm.Log} log
 */
wr.mvc.route.AbstractRenderingProvider = function(log) {
  
  /**
   * @protected
   * @const
   */
  this.log = log;
};

/** @override */
wr.mvc.route.AbstractRenderingProvider.prototype.retrieve = function(enterFn, factoryFn) {
};

/**
 * @protected
 * @param {?function(function({scope:!angular.Scope,element:!angular.JQLite}))} factoryFn
 * @return {!wr.mvc.route.Rendering}
 */
wr.mvc.route.AbstractRenderingProvider.prototype.createRenderingWithFactory = function(factoryFn) {
  var thisRenderingProvider = this;
  
  /* A factory function is required */
  if (!factoryFn) {
    throw new Error("No available rendering to retrieve");
  }
  
  /* Invoke the factory with a rendering-constructing function. Ensure that exactly ONE rendering is created. */
  var rendering = null;
  factoryFn(function(config) {
    if (rendering) {
      throw new Error("Rendering already created");
    }
    rendering = thisRenderingProvider.createRendering(config.scope, config.element);
  });
  if (!rendering) {
    throw new Error("Factory function failed to synchronously create a rendering");
  }
  
  return (rendering);
};

/**
 * @protected
 * @param {!angular.Scope} scope
 * @param {!angular.JQLite} element
 * @return {!wr.mvc.route.Rendering}
 */
wr.mvc.route.AbstractRenderingProvider.prototype.createRendering = function(scope, element) {
  return new wr.mvc.route.Rendering(scope, element, this.log);
};




//== wr/mvc/route/ScreenRenderingProvider.js ==================================



/**
 * Constructs a new rendering provider.
 * 
 * @package
 * @constructor
 * @class Rendering provider logically bound to a <i>screen instance</i> and that always tries to reuse a previous rendering.
 *        <p>
 *        The saved rendering can be cleared (if not in use) by calling {@link #clearCachedRendering}.
 * @extends wr.mvc.route.AbstractRenderingProvider
 * @param {string} screenId
 * @param {!wrm.Log} log
 */
wr.mvc.route.ScreenRenderingProvider = function(screenId, log) {
  wr.mvc.route.AbstractRenderingProvider.call(this, log);
  
  /** @private */
  this._screenId = screenId;
  
  /**
   * @private
   * @type {?wr.mvc.route.Rendering}
   */
  this._cachedRendering = null;
};

extendConstructor(wr.mvc.route.ScreenRenderingProvider, wr.mvc.route.AbstractRenderingProvider);

/** @override */
wr.mvc.route.ScreenRenderingProvider.prototype.retrieve = function(enterFn, factoryFn) {
  var rendering = this._cachedRendering;
  if (rendering && !rendering.isDestroyed()) {
    rendering.connect();
  } else {
    rendering = this.createRenderingWithFactory(factoryFn || null);
    this._cachedRendering = rendering;
  }
  if (enterFn) {
    enterFn(rendering);
  }
  return rendering;
};

/** @override */
wr.mvc.route.ScreenRenderingProvider.prototype.createRendering = function(scope, element) {
  var rendering = wr.mvc.route.ScreenRenderingProvider._super.createRendering.call(this, scope, element);
  this.log.debug("Created", rendering, "for screen", this._screenId);
  return rendering;
};

/**
 * @return {undefined}
 */
wr.mvc.route.ScreenRenderingProvider.prototype.clearCachedRendering = function() {
  if (this._cachedRendering) {
    if (this._cachedRendering.isConnected()) {
      this._cachedRendering.destroyAfterRelease();
    } else {
      this._cachedRendering.destroy();
    }
    this._cachedRendering = null;
  }
};




//== wr/mvc/route/Site.js =====================================================



/**
 * Constructs a new site.
 * 
 * @package
 * @constructor
 * @class An interactive "station" visited by the application. A site hosts one or more screens, each bound to a navigation state, that
 *        can serve as the start points for more navigations originating from the site. At any time there is exactly one site screen
 *        that is designated as the <i>current</i>.
 * @param {string} id Identifier of the site.
 * @param {string} initialScreenId Identifier of the initial current screen.
 * @param {!wrm.nav.State} initialState State held by the initial current screen.
 * @param {!wr.mvc.route.Interactor} interactor The used interactor.
 * @param {!wrm.Log} log The used log.
 */
wr.mvc.route.Site = function(id, initialScreenId, initialState, interactor, log) {
  
  /** @private */
  this._id = id;
  
  /**
   * @private
   * @type {!Object<string,!wr.mvc.route.Site._ScreenRecord>}
   */
  this._records = {};
  
  /**
   * @private
   * @type {!wr.mvc.route.Site._ScreenRecord}
   */
  this._currentRecord;
  
  /**
   * @private
   * @type {!wr.mvc.route.Interactor}
   */
  this._interactor = interactor;
  
  /** @private */
  this._log = log;
  
  /* Switch to the initial screen */
  this.switchTo(initialScreenId, initialState);
};

/**
 * @package
 * @return {string}
 */
wr.mvc.route.Site.prototype.getId = function() {
  return this._id;
};

/**
 * @package
 * @param {string} screenId
 * @return {boolean}
 */
wr.mvc.route.Site.prototype.hasScreen = function(screenId) {
  return !!this._records[screenId];
};

/**
 * @package
 * @return {string}
 */
wr.mvc.route.Site.prototype.getCurrentScreenId = function() {
  return this._currentRecord.screenId;
};

/**
 * @package
 * @return {!Array<string>}
 */
wr.mvc.route.Site.prototype.getScreenIds = function() {
  return Object.keys(this._records);
};

/**
 * @package
 * @return {!wrm.nav.State}
 */
wr.mvc.route.Site.prototype.getCurrentState = function() {
  return this._currentRecord.state;
};

/**
 * @package
 * @param {string} screenId
 * @return {!wrm.nav.State}
 */
wr.mvc.route.Site.prototype.getState = function(screenId) {
  return this.getRecord(screenId).state;
};

/**
 * @package
 * @param {string} screenId
 * @return {!wr.mvc.route.RenderingProvider}
 */
wr.mvc.route.Site.prototype.getRenderingProvider = function(screenId) {
  return this.getRecord(screenId).renderingProvider;
};

/**
 * @package
 * @param {string} screenId
 * @return {boolean}
 */
wr.mvc.route.Site.prototype.hasAttachedViews = function(screenId) {
  var record = this.getRecord(screenId);
  return Object.keys(record.attachedViews).length > 0;
};

/**
 * @package
 * @param {string} screenId
 * @param {string} componentId
 * @return {!wr.mvc.route.AttachedView}
 */
wr.mvc.route.Site.prototype.retrieveAttachedView = function(screenId, componentId) {
  var record = this.getRecord(screenId);
  var attachedView = record.attachedViews[componentId];
  if (!attachedView) {
    record.attachedViews[componentId] = attachedView = new wr.mvc.route.AttachedView;
  }
  return attachedView;
};

/**
 * @package
 * @param {string} screenId
 * @param {string} componentId
 * @return {!wr.mvc.route.ModelHolder}
 */
wr.mvc.route.Site.prototype.retrieveModelHolder = function(screenId, componentId) {
  var record = this.getRecord(screenId);
  var modelHolder = record.modelHolders[componentId];
  if (!modelHolder) {
    record.modelHolders[componentId] = modelHolder = new wr.mvc.route.ModelHolder(this._interactor);
  }
  return modelHolder;
};

/**
 * @package
 * @return {undefined}
 */
wr.mvc.route.Site.prototype.clearCache = function() {
  Object.keys(this._records).forEach(function(screenId) {
    var record = this._records[screenId];
    record.renderingProvider.clearCachedRendering();
    record.attachedViews = {};
    record.modelHolders = {};
  }, this);
};

/**
 * @private
 * @param {string} screenId
 * @return {!wr.mvc.route.Site._ScreenRecord}
 */
wr.mvc.route.Site.prototype.getRecord = function(screenId) {
  var record = this._records[screenId];
  if (!record) {
    throw new Error("Site does not host screen " + screenId);
  }
  return record;
};

/**
 * @package
 * @param {string} screenId
 * @param {!wrm.nav.State} state
 * @return {boolean}
 */
wr.mvc.route.Site.prototype.switchTo = function(screenId, state) {
  
  /* Retrieve and change a record, or create a new one */
  var record = this._records[screenId];
  if (record) {
    record.state = state;
  } else {
    this._records[screenId] = record = new wr.mvc.route.Site._ScreenRecord(screenId, state, this._log);
  }
  
  /* Change the current record */
  var changing = !this._currentRecord || this._currentRecord.screenId !== screenId;
  this._currentRecord = record;
  return changing;
};

/**
 * @package
 * @return {undefined}
 */
wr.mvc.route.Site.prototype.discardNonCurrentScreens = function() {
  
  /* Delete all records other than the current-screen one */
  Object.keys(this._records).forEach(function(screenId) {
    if (screenId !== this._currentRecord.screenId) {
      delete this._records[screenId];
    }
  }, this);
};

/*
 * Screen Record
 */

/**
 * @private
 * @constructor
 * @param {string} screenId
 * @param {!wrm.nav.State} state
 * @param {!wrm.Log} log
 */
wr.mvc.route.Site._ScreenRecord = function(screenId, state, log) {
  this.screenId = screenId;
  this.state = state;
  
  /** @const */
  this.renderingProvider = new wr.mvc.route.ScreenRenderingProvider(screenId, log);
  
  /** @type {!Object.<string,!wr.mvc.route.AttachedView>} */
  this.attachedViews = {};
  
  /** @type {!Object.<string,!wr.mvc.route.ModelHolder>} */
  this.modelHolders = {};
};




//== wr/mvc/route/SiteStack.js ================================================



/**
 * Constructs a new empty site stack.
 * 
 * @package
 * @constructor
 * @class A stack collection of {@linkplain wr.mvc.route.Site sites}, representing the trace of past interactions with the application.
 * @param {!wr.mvc.Logger} wrLogger
 */
wr.mvc.route.SiteStack = function(wrLogger) {
  
  /**
   * @private
   * @type {!Array<!wr.mvc.route.Site>}
   */
  this._sites = [];
  
  /**
   * @private
   * @type {?function(!wr.mvc.route.Site,!wr.mvc.route.SiteStack)}
   */
  this._additionListener = null;
  
  /**
   * @private
   * @type {?function(!wr.mvc.route.Site,!wr.mvc.route.SiteStack)}
   */
  this._removalListener = null;
  
  /** @private */
  this._log = wrLogger.createLog("wr.mvc.route.SiteStack");
};

/**
 * @param {?function(!wr.mvc.route.Site,!wr.mvc.route.SiteStack)} listener
 */
wr.mvc.route.SiteStack.prototype.setAdditionListener = function(listener) {
  this._additionListener = listener;
};

/**
 * @param {?function(!wr.mvc.route.Site,!wr.mvc.route.SiteStack)} listener
 */
wr.mvc.route.SiteStack.prototype.setRemovalListener = function(listener) {
  this._removalListener = listener;
};

/**
 * @return {number}
 */
wr.mvc.route.SiteStack.prototype.getLength = function() {
  return this._sites.length;
};

/**
 * @return {?wr.mvc.route.Site}
 */
wr.mvc.route.SiteStack.prototype.getCurrent = function() {
  if (this._sites.length > 0) {
    return this._sites[this._sites.length - 1];
  }
  return null;
};

/**
 * @param {string} screenId
 * @return {?wr.mvc.route.Site}
 */
wr.mvc.route.SiteStack.prototype.getClosest = function(screenId) {
  var index = this._getClosestIndex(screenId);
  if (index !== null) {
    return this._sites[index];
  }
  return null;
};

/**
 * @param {number} indexFromCurrent
 * @return {?wr.mvc.route.Site}
 */
wr.mvc.route.SiteStack.prototype.getAt = function(indexFromCurrent) {
  var index = this._sites.length - 1 - indexFromCurrent;
  return this._sites[index] || null;
};

/**
 * @param {!wr.mvc.route.Site} site
 */
wr.mvc.route.SiteStack.prototype.push = function(site) {
  this._sites.push(site);
  if (this._additionListener) {
    this._additionListener(site, this);
  }
  this._log.debug("Pushed 1 site. New size", this._sites.length);
};

/**
 * @return {?wr.mvc.route.Site}
 */
wr.mvc.route.SiteStack.prototype.pop = function() {
  if (this._sites.length > 0) {
    var popped = this._sites.pop();
    if (this._removalListener) {
      this._removalListener(popped, this);
    }
    this._log.debug("Popped 1 site. New size", this._sites.length);
    return popped;
  }
  return null;
};

/**
 * @param {string} screenId
 * @return {!Array<!wr.mvc.route.Site>}
 */
wr.mvc.route.SiteStack.prototype.popUtilClosest = function(screenId) {
  var index = this._getClosestIndex(screenId);
  if (index === null) {
    index = -1;
  }
  var popped = this._sites.splice(index + 1);
  if (this._removalListener) {
    popped.forEach(function(poppedElem) {
      this._removalListener(poppedElem, this);
    }, this);
  }
  
  this._log.debug("Popped", popped.length, "sites. New size", this._sites.length);
  return popped;
};

/**
 * @param {!wr.mvc.route.Site} site
 */
wr.mvc.route.SiteStack.prototype.replaceAllWith = function(site) {
  if (this._removalListener) {
    var replaced = this._sites;
    this._sites = [];
    replaced.forEach(function(replacedElem) {
      this._removalListener(replacedElem, this);
    }, this);
  } else {
    this._sites.length = 0;
  }
  
  this._sites.push(site);
  if (this._additionListener) {
    this._additionListener(site, this);
  }
  
  this._log.debug("Replaced all sites. New size", this._sites.length);
};

/**
 * @return {undefined}
 */
wr.mvc.route.SiteStack.prototype.clear = function() {
  var oldLength = this._sites.length;
  
  if (this._removalListener) {
    var cleared = this._sites;
    this._sites = [];
    cleared.forEach(function(clearedElem) {
      this._removalListener(clearedElem, this);
    }, this);
  } else {
    this._sites.length = 0;
  }
  
  this._log.debug("Cleared", oldLength, "sites");
};

/**
 * @private
 * @param {string} screenId
 * @return {?number}
 */
wr.mvc.route.SiteStack.prototype._getClosestIndex = function(screenId) {
  for (var i = this._sites.length - 1;i >= 0;i--) {
    var site = this._sites[i];
    if (site && site.hasScreen(screenId)) {
      return i;
    }
  }
  return null;
};




//== wr/mvc/route/Track.js ====================================================


/**
 * Constructs a new routing tack.
 * 
 * @package
 * @constructor
 * @class Track of the history of a single contiguous series of routing episodes.
 */
wr.mvc.route.Track = function() {
  
  /** @private */
  this._started = false;
  
  /**
   * @private
   * @type {?string}
   */
  this._reachedFence = null;
  
  /** @private */
  this._fenceChanged = false;
};

/*
 * Access to the track
 */

/**
 * @return {?string}
 */
wr.mvc.route.Track.prototype.getReachedFence = function() {
  this._checkStarted();
  return this._reachedFence;
};

/**
 * @return {boolean}
 */
wr.mvc.route.Track.prototype.isFenceChanged = function() {
  this._checkStarted();
  return this._fenceChanged;
};

/**
 * @private
 * @return {undefined}
 */
wr.mvc.route.Track.prototype._checkStarted = function() {
  if (!this._started) {
    throw new Error("Routing not started");
  }
};

/*
 * Track mutation
 */

/**
 * @param {!wrm.nav.Destination} destination
 */
wr.mvc.route.Track.prototype.visit = function(destination) {
  var fenceChanging = this._reachedFence !== destination.getFence();
  this._reachedFence = destination.getFence();
  if (this._started) {
    if (fenceChanging) {
      this._fenceChanged = true;
    }
  }
  this._started = true;
};




//== wr/mvc/route/TransientRenderingProvider.js ===============================



/**
 * Constructs a new rendering provider.
 * 
 * @package
 * @constructor
 * @class Rendering provider that always supplies new <i>transient</i> renderings. A transient rendering will be destroyed just after
 *        being released.
 * @extends wr.mvc.route.AbstractRenderingProvider
 * @param {!wrm.Log} log
 */
wr.mvc.route.TransientRenderingProvider = function(log) {
  wr.mvc.route.AbstractRenderingProvider.call(this, log);
};

extendConstructor(wr.mvc.route.TransientRenderingProvider, wr.mvc.route.AbstractRenderingProvider);

/** @override */
wr.mvc.route.TransientRenderingProvider.prototype.retrieve = function(enterFn, factoryFn) {
  var rendering = this.createRenderingWithFactory(factoryFn || null);
  if (enterFn) {
    enterFn(rendering);
  }
  return rendering;
};

/** @override */
wr.mvc.route.TransientRenderingProvider.prototype.createRendering = function(scope, element) {
  var rendering = wr.mvc.route.TransientRenderingProvider._super.createRendering.call(this, scope, element);
  rendering.destroyAfterRelease();
  this.log.debug("Created temporary", rendering);
  return rendering;
};




//== wr/mvc/route/Router.js ===================================================



/**
 * Constructs a new router service.
 * 
 * @constructor
 * @class Top-level service responsible for controlling the flow of the application.
 *        <p>
 *        When notified of events (via the {@link #notifyEvent} or {@link #notifyUserEvent} methods) the router will use the supplied
 *        WebRatio Runtime Manager to obtain services and orchestrate the execution flow between them. For example, this may involve
 *        notifying a <i>notifiable</i> service about the event, followed by invoking any <i>navigable</i> service of the chain until
 *        an ending point is reached (usually, a service supporting a UI view).
 * @ngInject
 * @param {!angular.Scope} $rootScope
 * @param {!angular.$location} $location
 * @param {!angular.$routeParams} $routeParams
 * @param {!wr.mvc.l10n.LocalizationManager} wrLocalizationManager
 * @param {!wrm.core.Manager} wrManager
 * @param {!wr.mvc.Logger} wrLogger
 * @param {number} WRAPP_ROUTER_VIEW_CACHE_SIZE
 */
wr.mvc.route.Router = function($rootScope, $location, $routeParams, wrLocalizationManager, wrManager, wrLogger, WRAPP_ROUTER_VIEW_CACHE_SIZE) {
  
  /** @private */
  this._$rootScope = $rootScope;
  
  /** @private */
  this._manager = wrManager;
  
  /** @private */
  this._screenSwitcher = new wr.mvc.route.ScreenSwitcher($rootScope, $routeParams, $location, wrLogger);
  this._screenSwitcher.setDirectSwitchHandler(this._handleDirectlyAccessedScreen.bind(this));
  this._screenSwitcher.setRenderingProviderFactory(this._retrieveRenderingProvider.bind(this));
  
  /**
   * @private
   * @type {?string}
   */
  this._pendingDirectScreenId = null;
  
  /**
   * @private
   * @type {?Promise}
   */
  this._startupFinished = null;
  
  /** @private */
  this._triggeredOnce = false;
  
  /** @private */
  this._sites = new wr.mvc.route.SiteStack(wrLogger);
  this._sites.setAdditionListener(this._handleAddedSite.bind(this));
  this._sites.setRemovalListener(this._handleRemovedSite.bind(this));
  
  /** @private */
  this._viewCacheSize = WRAPP_ROUTER_VIEW_CACHE_SIZE;
  
  /**
   * @private
   * @type {!Object.<string,number>}
   */
  this._timers = {};
  
  /** @private */
  this._interactor = new wr.mvc.route.Interactor($rootScope, wrManager, wrLocalizationManager, wrLogger);
  
  /** @private */
  this._environ = new wr.mvc.route.Router._Environ(this);
  
  /** @private {?wrm.nav.Event} */
  this._pendingSynchronizationEvent = null;
  
  /** @private */
  this._runningNotificationCount = 0;
  
  /** @private */
  this._log = wrLogger.createLog("wr.mvc.route.Router");
};
wr.mvc.route.Router["$inject"] = ["$rootScope", "$location", "$routeParams", "wrLocalizationManager", "wrManager", "wrLogger", "WRAPP_ROUTER_VIEW_CACHE_SIZE"];

/**
 * @private
 * @constructor
 * @implements wrm.nav.Environ
 * @param {!wr.mvc.route.Router} router
 */
wr.mvc.route.Router._Environ = function(router) {
  this.retrieveView = router._retrieveView.bind(router);
  this.markObjectForViewTracking = wr.mvc.route.AttachedView.markObjectForTracking;
  this.retrieveFormState = router._retrieveFormState.bind(router);
  this.handleEvent = router._handleThrownEvent.bind(router);
  this.enterPanel = router._handleReachedScreen.bind(router);
  this.presentDialog = router._interactor.presentDialog.bind(router._interactor);
  this.reportProgress = router._interactor.progressActivity.bind(router._interactor);
  this.startTimerEvents = router._startTimer.bind(router);
  this.stopTimerEvents = router._stopTimer.bind(router);
  this.retrieveEventNotifier = router._retrieveEventNotifier.bind(router);
};

/**
 * Configures the Angular Route for changing location when a router service requires to switch the visible screen.
 * 
 * @param {!angular.$routeProvider} $routeProvider Provider service of the Route service to configure.
 * @param {function(string):string} templateUrlFunction Function obtaining the URL of an Angular template file from the id of a screen.
 */
wr.mvc.route.Router.configureScreenRouting = function($routeProvider, templateUrlFunction) {
  
  /* Prepare a preloader provider function for invoking screen assets before routing */
  var preloaderProviderFunction = function(screenId) {
    return ["wrManager", function(wrManager) {
      return wr.mvc.route.Router._preloadScreenDependencies(screenId, wrManager);
    }];
  };
  
  wr.mvc.route.ScreenSwitcher.configureRouting($routeProvider, preloaderProviderFunction, templateUrlFunction);
};

/*
 * Navigation and Notification
 */

/**
 * Notifies the application logic about the application starting up.
 * 
 * @return {!Promise} Promise of completing the notification and any resulting behavior.
 */
wr.mvc.route.Router.prototype.notifyStartup = function() {
  return this._notifyStartup(false);
};

/**
 * @private
 * @param {boolean} warm
 * @return {!Promise}
 */
wr.mvc.route.Router.prototype._notifyStartup = function(warm) {
  return this.notifyUserEvent("AppStartup", undefined, {"warm":!!warm});
};

/**
 * Notifies the application logic about a user-initiated event.
 * 
 * @param {string} type type of event.
 * @param {?string=} specifier specifier for restricting the event type; if <code>null</code> or not specified, the event type is not
 *            restricted.
 * @param {!Object.<string,*>=} parameters event-specific parameters, by their name; if not specified, no parameters are passed.
 * @return {!Promise} Promise of completing the notification and any resulting behavior.
 */
wr.mvc.route.Router.prototype.notifyUserEvent = function(type, specifier, parameters) {
  var event = new wrm.nav.Event(type, specifier, parameters);
  return this._notify(event, true);
};

/**
 * Notifies the application logic about an event.
 * 
 * @param {string} type type of event.
 * @param {?string=} specifier specifier for restricting the event type; if <code>null</code> or not specified, the event type is not
 *            restricted.
 * @param {!Object.<string,*>=} parameters event-specific parameters, by their name; if not specified, no parameters are passed.
 * @return {!Promise} Promise of completing the notification and any resulting behavior.
 */
wr.mvc.route.Router.prototype.notifyEvent = function(type, specifier, parameters) {
  var event = new wrm.nav.Event(type, specifier, parameters);
  return this._notify(event);
};

/**
 * @private
 * @param {string} specifier
 * @param {number} interval
 */
wr.mvc.route.Router.prototype._startTimer = function(specifier, interval) {
  if (typeof this._timers[specifier] !== "undefined") {
    throw new Error("Timer for " + specifier + " already running");
  }
  var handle = GLOBAL.setInterval(this.notifyEvent.bind(this, "Timer", specifier), interval);
  this._timers[specifier] = handle;
};

/**
 * @private
 * @param {string} specifier
 */
wr.mvc.route.Router.prototype._stopTimer = function(specifier) {
  var handle = this._timers[specifier];
  if (handle) {
    delete this._timers[specifier];
    GLOBAL.clearInterval(handle);
  }
};

/**
 * @private
 * @param {string} type
 * @param {?string=} specifier
 * @return {function(!Object.<string,*>=):!Promise}
 */
wr.mvc.route.Router.prototype._retrieveEventNotifier = function(type, specifier) {
  var thisRouter = this;
  
  /**
   * @param {!Object.<string,*>=} parameters
   * @return {!Promise}
   */
  var notifier = function(parameters) {
    return thisRouter.notifyEvent(type, specifier || null, angular.extend({}, parameters));
  };
  
  return notifier;
};

/**
 * @private
 * @param {!wrm.nav.Event} event
 * @param {boolean=} userInitiated
 * @return {!Promise}
 */
wr.mvc.route.Router.prototype._notify = function(event, userInitiated) {
  var $jscomp$this = this;
  var thisRouter = this;
  var manager = this._manager;
  var interactor = this._interactor;
  var log = this._log;
  
  userInitiated = userInitiated || false;
  var isStartup = event.getType() === "AppStartup";
  
  /* Derive a new state */
  var state = this._createState(false);
  var track = this._retrieveTrack(state);
  if (log.isDebugEnabled() && event.getType() !== "Timer") {
    log.debug(state, "Notifying event", event);
  }
  
  /* Count the new notification (has to be synchronous to avoid a spurious '0' count) */
  thisRouter._runningNotificationCount++;
  
  /* Ensure that interactions are ready (e.g. for dialogs) */
  var promise = interactor.init();
  
  /* Report activity for user-initiated events */
  promise = promise.then(function() {
    if (userInitiated) {
      interactor.startActivity(isStartup);
    }
  });
  
  /* Add artificial slowness */
  if (SLOWDOWN > 0) {
    promise = promise.then(function() {
      return wrm.util.sleep(SLOWDOWN);
    });
  }
  
  /* Wait for the startup navigation to finish */
  if (!isStartup) {
    promise = promise.then(function() {
      return thisRouter._startupFinished;
    });
  }
  
  /* Decide which service to notify: target the current primary panel, or the entire app */
  promise = promise.then(function() {
    var primaryPanelId = state.getContextualStartPrimaryPanelId();
    if (primaryPanelId) {
      return manager.getNotifiable(primaryPanelId);
    } else {
      return manager.getAppService();
    }
  });
  
  /* Notify the event */
  promise = promise.then(function(notifiable) {
    event.initTarget(notifiable);
    track.visit(notifiable);
    var notifyPromise = notifiable.notify(event, state);
    if (isStartup) {
      thisRouter._startupFinished = notifyPromise;
    }
    return notifyPromise;
  })["catch"](function(e) {
    log.error(state, "Error during event notification", e);
  });
  
  /* If caught, navigate the route */
  promise = promise.then(function(route) {
    if (route) {
      return thisRouter._navigate(route, state);
    }
    
    /* Otherwise, handle the event here */
    return thisRouter._handleUncaughtEvent(event, state);
  });
  
  /* Stop activity started by user-initiated events and handle the end of the very first triggered routing */
  promise = promise.finally(function() {
    if (userInitiated) {
      interactor.stopActivity();
    }
    $jscomp$this._handleFirstTriggerFinish();
    $jscomp$this._runningNotificationCount--;
    if ($jscomp$this._runningNotificationCount === 0 && $jscomp$this._pendingSynchronizationEvent) {
      $jscomp$this._handleBackgroundEvents([$jscomp$this._pendingSynchronizationEvent]);
      $jscomp$this._pendingSynchronizationEvent = null;
    }
  });
  
  return promise;
};

/**
 * @private
 * @param {?string} screenId
 * @return {!Promise|undefined}
 */
wr.mvc.route.Router.prototype._handleDirectlyAccessedScreen = function(screenId) {
  var thisRouter = this;
  
  if (!screenId) {
    return;
  }
  
  /* Keep track of pending direct switches */
  if (this._pendingDirectScreenId) {
    throw new Error("Another direct switch is still in progress");
  }
  this._pendingDirectScreenId = screenId;
  
  /*
   * Restart the routing by clearing all sites, performing a warm startup and finally navigating to the screen that is already being
   * accessed directly
   */
  var route = wrm.nav.Route.toService(screenId);
  var state = thisRouter._createState(true);
  this._sites.clear();
  return Promise.resolve().then(function() {
    return thisRouter._notifyStartup(true);
  }).then(function() {
    return thisRouter._navigate(route, state);
  });
};

/**
 * @private
 * @const
 * @type {!Object.<string,!wrm.core.FormInfo>}
 */
wr.mvc.route.Router._FORM_INFOS = {};

/**
 * @private
 * @param {string} screenId
 * @param {!wrm.core.Manager} manager
 * @return {!Promise}
 */
wr.mvc.route.Router._preloadScreenDependencies = function(screenId, manager) {
  return manager.getViewService(screenId).then(function(panelService) {
    return panelService.getFormInfo();
  }).then(function(formInfo) {
    wr.mvc.route.Router._FORM_INFOS[screenId] = formInfo;
  });
};

/**
 * @private
 * @param {!wrm.nav.Route} route
 * @param {!wrm.nav.State} state
 * @return {!Promise}
 */
wr.mvc.route.Router.prototype._navigate = function(route, state) {
  var thisRouter = this;
  return this._navigateLeg(route, state)["catch"](function(e) {
    thisRouter._log.error(state, "Error during navigation", e);
  });
};

/**
 * @private
 * @param {!wrm.nav.Route} route
 * @param {!wrm.nav.State} state
 * @return {!Promise}
 */
wr.mvc.route.Router.prototype._navigateLeg = function(route, state) {
  var thisRouter = this;
  var log = this._log;
  var track = this._retrieveTrack(state);
  
  /* Resolve the actual service route to navigate to */
  route = this._resolveRoute(route);
  if (log.isDebugEnabled()) {
    var caughtTimer = state.getCaughtEvent() && state.getCaughtEvent().getType() === "Timer";
    if (!caughtTimer || !!route.getServiceId()) {
      log.debug(state, "Navigating route", route);
    }
  }
  
  /* Ensure that interactions are ready (e.g. for dialogs) */
  var promise = this._interactor.init();
  
  /* Follow the route */
  promise = promise.then(function() {
    var serviceId = route.getServiceId();
    if (!serviceId) {
      return route;
    }
    
    /* Navigate the navigable service pointed by the route */
    return thisRouter._manager.getNavigable(serviceId).then(function(navService) {
      if (thisRouter._allowRouteDestination(navService, state)) {
        track.visit(navService);
        return navService.navigate(route.getGate(), state);
      } else {
        var nowhereRoute = wrm.nav.Route.toNowhere();
        log.debug(state, "Destination forbidden by event: navigating route", nowhereRoute);
        return nowhereRoute;
      }
    });
  });
  
  promise = promise.then(function(nextRoute) {
    
    /* If another destination is expected, continue the loop */
    if (!nextRoute.isStationary()) {
      return thisRouter._navigateLeg(nextRoute, state);
    }
    
    return thisRouter._handleFinishedNavigation(state);
  });
  
  return promise;
};

/**
 * @private
 * @param {!wrm.nav.Navigable} navService
 * @param {!wrm.nav.State} state
 * @return {boolean}
 */
wr.mvc.route.Router.prototype._allowRouteDestination = function(navService, state) {
  var event = state.getCaughtEvent();
  if (!event) {
    return true;
  }
  var panelAllowFn = event.getParameters()["_wrAllowNavigationToPanel"];
  if (typeof panelAllowFn !== "function") {
    return true;
  }
  
  /* Always allow non-panels */
  if (!(navService instanceof wrm.core.PanelService)) {
    return true;
  }
  
  /* Allow panel as indicated by the filter function */
  return panelAllowFn();
};

/**
 * @private
 */
wr.mvc.route.Router.prototype._handleFirstTriggerFinish = function() {
  if (this._triggeredOnce) {
    return;
  }
  this._triggeredOnce = true;
  this._$rootScope.$broadcast("wrEntranceComplete", {});
};

/**
 * Gets the number of currently ongoing notifications. A notification is considered to be still running for the entire duration of its
 * resulting behavior (typically, the navigation of a logical application flow).
 * 
 * @return {number} A non-negative integral number.
 */
wr.mvc.route.Router.prototype.getRunningNotificationCount = function() {
  return this._runningNotificationCount;
};

/*
 * Form operations
 */

/**
 * @param {string} screenId
 * @return {!wrm.core.FormInfo}
 */
wr.mvc.route.Router.prototype.getFormInfo = function(screenId) {
  var formInfo = wr.mvc.route.Router._FORM_INFOS[screenId];
  if (!formInfo) {
    throw new Error("No form information available screen " + screenId);
  }
  return formInfo;
};

/**
 * @param {string} screenId
 * @param {string} componentId
 * @param {string=} propertyName
 * @return {?Promise.<boolean>}
 */
wr.mvc.route.Router.prototype.validate = function(screenId, componentId, propertyName) {
  var manager = this._manager;
  var log = this._log;
  
  /* Derive a new state */
  var state = this._createState(false);
  
  /* Validate only in the start primary panel */
  var primaryPanelId = state.getContextualStartPrimaryPanelId();
  if (primaryPanelId !== screenId) {
    return null;
  }
  
  /* Validate using the primary panel */
  return Promise.resolve().then(function() {
    return manager.getViewService((primaryPanelId));
  }).then(function(panelService) {
    return panelService.validate(componentId, propertyName || null, state);
  })["catch"](function(e) {
    log.error(state, "Error during live validation", e);
  });
};

/*
 * State Handling
 */

/**
 * @private
 * @param {boolean} initial
 * @return {!wrm.nav.State}
 */
wr.mvc.route.Router.prototype._createState = function(initial) {
  
  /* Derive the new state from the current site whenever possible */
  var currentSite = this._sites.getCurrent();
  if (!initial && currentSite) {
    return this._attachTrack(currentSite.getCurrentState().createBranch());
  }
  
  /* Create a new state from scratch */
  return this._attachTrack(new wrm.nav.State(null, this._environ));
};

/**
 * @private
 * @param {!wrm.nav.State} state
 * @return {!wrm.nav.State}
 */
wr.mvc.route.Router.prototype._attachTrack = function(state) {
  if (DEBUG && state["_track"]) {
    throw new Error("Track already attached to state");
  }
  state["_track"] = new wr.mvc.route.Track;
  return state;
};

/**
 * @private
 * @param {!wrm.nav.State} state
 * @return {!wr.mvc.route.Track}
 */
wr.mvc.route.Router.prototype._retrieveTrack = function(state) {
  var track = state["_track"];
  if (DEBUG && !track) {
    throw new Error("Track not attached to state");
  }
  return track;
};

/**
 * @private
 * @param {string} screenId
 * @param {string} viewId
 * @return {?wrm.core.View}
 */
wr.mvc.route.Router.prototype._retrieveView = function(screenId, viewId) {
  var site = this._sites.getClosest(screenId);
  return site ? site.retrieveAttachedView(screenId, viewId).getView() : null;
};

/**
 * Attaches an Angular scope to this router, obtaining a usable <i>view</i> based upon it.
 * <p>
 * The obtained view is automatically bound to the scope in a way that any refresh of the view <i>will</i> cause an eventual digest
 * cycle of the scope. In addition, the view is removed when no longer necessary (i.e. when a screen template is switched out).
 * 
 * @param {string} screenId Identifier of the screen for which the scope is used.
 * @param {string} componentId Identifier of the component for which the scope is used.
 * @param {!angular.Scope} scope Scope to attach.
 * @return {!wrm.core.View} A view.
 */
wr.mvc.route.Router.prototype.attachScope = function(screenId, componentId, scope) {
  var site = this._sites.getClosest(screenId);
  if (!site) {
    throw new Error("No site available for attaching scopes of screen " + screenId);
  }
  
  var attachedView = site.retrieveAttachedView(screenId, componentId);
  attachedView.attachScope(scope);
  return attachedView.getView();
};

/**
 * @private
 * @param {string} screenId
 * @param {string} componentId
 * @return {wrm.form.FormState}
 */
wr.mvc.route.Router.prototype._retrieveFormState = function(screenId, componentId) {
  var site = this._sites.getClosest(screenId);
  return site ? site.retrieveModelHolder(screenId, componentId).getFormState() : null;
};

/**
 * Attaches Angular model and form controllers to this router. After attaching, the router is able to keep track of the state of the
 * model and the form (such as validation or dirty flags).
 * <p>
 * The controllers must be detached manually when no longer used by calling the returned function. The use of a dedicated detachment
 * function ensures that the controller can be detached even in cases when the original screen is no longer available for other
 * operations (e.g. because it has been switched out).
 * <p>
 * Attaching different model controllers to the same screen/form/property combination is not allowed and will cause an error to be
 * thrown. It is however possible to attach different properties with different form controllers.
 * <p>
 * Form controllers are optional. If not passed, it might not be possible for the router to keep track of form-only state.
 * 
 * @param {string} screenId Identifier of the screen from which the model comes from.
 * @param {string} componentId Identifier of the component to which the model belongs.
 * @param {string} formPropertyName Name of the <i>form property</i> that is represented by the model.
 * @param {!angular.NgModelController} modelCtrl Model controller to attach.
 * @param {?angular.FormController} formCtrl Form controller to attach.
 * @return {function()} A function that, when called, will detach the passed model controller.
 */
wr.mvc.route.Router.prototype.attachModelController = function(screenId, componentId, formPropertyName, modelCtrl, formCtrl) {
  var site = this._sites.getClosest(screenId);
  if (!site) {
    throw new Error("No site available for attaching model controllers of screen " + screenId);
  }
  
  var modelHolder = site.retrieveModelHolder(screenId, componentId);
  modelHolder.addController(formPropertyName, modelCtrl, formCtrl);
  return function() {
    modelHolder.removeController(formPropertyName, modelCtrl, formCtrl);
  };
};

/*
 * Route resolution
 */

/**
 * @private
 * @param {!wrm.nav.Route} route
 * @return {!wrm.nav.ServiceRoute}
 */
wr.mvc.route.Router.prototype._resolveRoute = function(route) {
  var resolvedRoute = this._doResolveRoute(route);
  if (!resolvedRoute) {
    throw new Error("Unable to resolve route " + route);
  }
  return resolvedRoute;
};

/**
 * @private
 * @param {!wrm.nav.Route} route
 * @return {?wrm.nav.ServiceRoute}
 */
wr.mvc.route.Router.prototype._doResolveRoute = function(route) {
  if (route instanceof wrm.nav.ServiceRoute) {
    return route;
  } else {
    if (route instanceof wrm.nav.MultipleRoute) {
      return this._doResolveMultipleRoute(route);
    } else {
      if (route instanceof wrm.nav.VirtualRoute) {
        switch(route.getType()) {
          case wrm.nav.VirtualRoute.Type.BACK:
            return this._doResolveBackRoute();
          case wrm.nav.VirtualRoute.Type.EXIT:
            return this._doResolveExitRoute();
          default:
            if (DEBUG) {
              throw new Error("Unsupported virtual route type");
            }
          ;
        }
      }
    }
  }
  if (DEBUG) {
    throw new Error("Unsupported route type");
  }
  return null;
};

/**
 * @private
 * @param {!wrm.nav.MultipleRoute} route
 * @return {?wrm.nav.ServiceRoute}
 */
wr.mvc.route.Router.prototype._doResolveMultipleRoute = function(route) {
  var routes = route.getRoutes();
  for (var i = 0;i < routes.length;i++) {
    var resolvedRoute = this._doResolveRoute(routes[i]);
    if (resolvedRoute) {
      return resolvedRoute;
    }
  }
  return null;
};

/**
 * @private
 * @return {?wrm.nav.ServiceRoute}
 */
wr.mvc.route.Router.prototype._doResolveBackRoute = function() {
  
  /* If there are at least two sites, route to the previous site screen */
  var previousSite = this._sites.getAt(1);
  if (previousSite) {
    this._log.debug("Back route: go to previous site");
    return wrm.nav.Route.toService(previousSite.getCurrentScreenId());
  }
  
  return null;
};

/**
 * @private
 * @return {!wrm.nav.ServiceRoute}
 */
wr.mvc.route.Router.prototype._doResolveExitRoute = function() {
  this._log.debug("Exit route: close application");
  navigator.app.exitApp();
  return wrm.nav.Route.toNowhere();
};

/*
 * Reactions to Manager execution
 */

/**
 * @private
 * @param {!wrm.nav.Event} event
 * @return {!Promise}
 */
wr.mvc.route.Router.prototype._handleThrownEvent = function(event) {
  
  /*
   * Handle synchronization events later, after navigations end and merging them together. This would be better done with a
   * "background event" concept
   */
  if (event.getType() === "SynchronizationSuccess") {
    this._log.debug("Received background event", event);
    if (!this._pendingSynchronizationEvent) {
      this._pendingSynchronizationEvent = event;
    }
    return Promise.resolve();
  }
  
  this._log.debug("Received event", event);
  return this._notify(event);
};

/**
 * @private
 * @param {!Array<!wrm.nav.Event>} events
 * @return {!Promise}
 */
wr.mvc.route.Router.prototype._handleBackgroundEvents = function(events) {
  var $jscomp$this = this;
  return Promise.resolve().then(function() {
    return Promise.all(events.map(function(event) {
      return $jscomp$this._notify(event);
    }));
  });
};

/**
 * @private
 * @param {!wrm.nav.Event} event
 * @param {!wrm.nav.State} state
 * @return {!Promise}
 */
wr.mvc.route.Router.prototype._handleUncaughtEvent = function(event, state) {
  this._log.warn(state, "Unhandled event", event);
  return Promise.resolve();
};

/**
 * @private
 * @const
 * @type {!Object.<string,boolean>}
 */
wr.mvc.route.Router._BACKWARD_EVENT_TYPES = {"BackEvent":true, "HomeEvent":true};

/**
 * @private
 * @param {string} screenId
 * @param {boolean} clearHistory
 * @param {!wrm.nav.State} state
 * @return {!wrm.nav.Reuse}
 */
wr.mvc.route.Router.prototype._handleReachedScreen = function(screenId, clearHistory, state) {
  var sites = this._sites;
  var screenSwitcher = this._screenSwitcher;
  
  this._log.debug(state, "Reached screen", screenId);
  var track = this._retrieveTrack(state);
  var event = state.getCaughtEvent();
  var eventType = event && event.getType();
  var backward = !!(eventType && wr.mvc.route.Router._BACKWARD_EVENT_TYPES[eventType]);
  var siteId = track.getReachedFence() || screenId;
  var siteFullyReusable = !track.isFenceChanged();
  var currentSiteChanged = false, currentScreenChanged = false;
  var attachedViewsAvailable = false;
  
  /* If navigating FORWARD and CLEARING HISTORY, replace the current site entirely */
  var existingSite = sites.getCurrent();
  if (!backward && clearHistory && (!existingSite || existingSite.getId() !== siteId)) {
    this._sites.replaceAllWith(new wr.mvc.route.Site(siteId, screenId, state, this._interactor, this._log));
    currentSiteChanged = true;
  } else {
    
    /*
     * If reached the screen by navigating BACKWARD, pop all sites up to the closest site that uses the same screen; this may
     * result in all sites being removed (but not including that site)
     */
    if (backward) {
      var removedSites = sites.popUtilClosest(screenId);
      currentSiteChanged = removedSites.length > 0;
      existingSite = sites.getCurrent();
      siteFullyReusable = true;
    }
    
    /* If the new current site is not compatible with the reached screen push a new site */
    if (!existingSite || existingSite.getId() !== siteId) {
      this._sites.push(new wr.mvc.route.Site(siteId, screenId, state, this._interactor, this._log));
      currentSiteChanged = true;
    } else {
      
      /* Compatible site: if possible, merge the navigation state onto the previous one, then switch screen */
      this._log.debug(state, "Reusing site", !siteFullyReusable ? "(partially)" : "");
      if (existingSite.hasScreen(screenId)) {
        state.mergeOnto(existingSite.getState(screenId));
        attachedViewsAvailable = existingSite.hasAttachedViews(screenId);
      }
      currentScreenChanged = existingSite.switchTo(screenId, state);
      if (!siteFullyReusable) {
        existingSite.discardNonCurrentScreens();
      }
    }
  }
  
  /* Physically switch screen if the current one, combined with its site, somehow changed */
  if (currentSiteChanged || currentScreenChanged) {
    if (this._pendingDirectScreenId === screenId) {
      this._pendingDirectScreenId = null;
    } else {
      var direction = eventType === "AppStartup" ? "none" : backward ? "backward" : "forward";
      screenSwitcher.switchTo(screenId, direction);
    }
  }
  
  /* Suppress any pending background events */
  this._pendingSynchronizationEvent = null;
  
  return attachedViewsAvailable ? wrm.nav.Reuse.FULL : wrm.nav.Reuse.NONE;
};

/**
 * @private
 * @param {!wrm.nav.State} state
 */
wr.mvc.route.Router.prototype._handleFinishedNavigation = function(state) {
  var log = this._log;
  
  if (log.isDebugEnabled()) {
    var caughtTimer = state.getCaughtEvent() && state.getCaughtEvent().getType() === "Timer";
    if (!caughtTimer || !!state.getReachedPanelId()) {
      log.debug(state, "Finished navigation in panel", state.getReachedPanelId());
    }
  }
};

/*
 * Sites and renderings management
 */

/**
 * @private
 * @param {!wr.mvc.route.Site} site
 */
wr.mvc.route.Router.prototype._handleAddedSite = function(site) {
  
  /* Clear any view cache outside of the cache window */
  var sitesLength = this._sites.getLength();
  for (var i = this._viewCacheSize;i < sitesLength;i++) {
    this._sites.getAt(i).clearCache();
  }
};

/**
 * @private
 * @param {!wr.mvc.route.Site} site
 */
wr.mvc.route.Router.prototype._handleRemovedSite = function(site) {
  site.clearCache();
};

/**
 * @private
 * @param {?string} screenId
 * @return {?wr.mvc.route.RenderingProvider}
 */
wr.mvc.route.Router.prototype._retrieveRenderingProvider = function(screenId) {
  if (!screenId) {
    return null;
  }
  
  /* Get the rendering provider attached to the closest site that contains the screen */
  var site = this._sites.getClosest(screenId);
  if (!site) {
    throw new Error("Missing site for screen " + screenId);
  }
  return site.getRenderingProvider(screenId);
};

/**
 * Creates a rendering provider for providing transient renderings.
 * <p>
 * Transient renderings are always created anew, never cached and immediately destroyed after release.
 * 
 * @param {!wrm.Log} log Log to use for the created renderings lifecycle.
 * @return {!wr.mvc.route.RenderingProvider} A rendering provider.
 */
wr.mvc.route.Router.createTransientRenderingProvider = function(log) {
  return new wr.mvc.route.TransientRenderingProvider(log);
};




//== wr/mvc/AppConfig.js ======================================================



/**
 * <i>Configuration blocks</i> to be executed while configuring the WebRatio MVC Module.
 * 
 * @package
 * @const
 */
wr.mvc.AppConfig = {};

if (!DEBUG) {
  
  /**
   * @ngInject
   * @param {!angular.$compileProvider} $compileProvider
   */
  wr.mvc.AppConfig.optimizeForProduction = function($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
  };
  wr.mvc.AppConfig.optimizeForProduction["$inject"] = ["$compileProvider"];
  
}

/**
 * @ngInject
 * @param {!angular.$routeProvider} $routeProvider
 */
wr.mvc.AppConfig.configRouteProvider = function($routeProvider) {
  
  wr.mvc.route.Router.configureScreenRouting($routeProvider, function(screenId) {
    return "screens/" + screenId + ".html";
  });
  
  $routeProvider.when("/", {template:""});
  
};
wr.mvc.AppConfig.configRouteProvider["$inject"] = ["$routeProvider"];

/**
 * @ngInject
 * @param {!Object} $compileProvider
 */
wr.mvc.AppConfig.wrapSanitizationWhitelist = function($compileProvider) {
  
  function wrapper(originalFunction) {
    var sanitizationWhitelist = originalFunction;
    return function(urlRegEx) {
      if (urlRegEx) {
        var current = sanitizationWhitelist();
        if (current && current.source) {
          urlRegEx = new RegExp(current.source + "|" + urlRegEx.source);
        }
      }
      return sanitizationWhitelist(urlRegEx);
    };
  }
  
  $compileProvider["aHrefSanitizationWhitelist"] = wrapper($compileProvider["aHrefSanitizationWhitelist"]);
  $compileProvider["imgSrcSanitizationWhitelist"] = wrapper($compileProvider["imgSrcSanitizationWhitelist"]);
};
wr.mvc.AppConfig.wrapSanitizationWhitelist["$inject"] = ["$compileProvider"];

/**
 * @ngInject
 * @param {!Object} $compileProvider
 * @param {string} WRAPP_EXTRA_SAFE_URL_PROTOCOLS
 * @param {string} WRAPP_EXTRA_SAFE_IMG_PROTOCOLS
 */
wr.mvc.AppConfig.setSafeProtocols = function($compileProvider, WRAPP_EXTRA_SAFE_URL_PROTOCOLS, WRAPP_EXTRA_SAFE_IMG_PROTOCOLS) {
  
  /* Anchors */
  var urlSafeProtocols = ["file", "http", "https"];
  WRAPP_EXTRA_SAFE_URL_PROTOCOLS.split("|").map(function(protocol) {
    if (protocol !== "") {
      urlSafeProtocols.push(protocol);
    }
  });
  var urlRegEx = new RegExp("^s*(" + urlSafeProtocols.join("|") + "):");
  $compileProvider["aHrefSanitizationWhitelist"](urlRegEx);
  
  /* Images */
  var imgSafeProtocols = ["file", "http", "https", "blob", "data", "cdvfile", "filesystem", "content"];
  WRAPP_EXTRA_SAFE_IMG_PROTOCOLS.split("|").map(function(protocol) {
    if (protocol !== "") {
      imgSafeProtocols.push(protocol);
    }
  });
  var imgRegEx = new RegExp("^s*(" + imgSafeProtocols.join("|") + "):");
  $compileProvider["imgSrcSanitizationWhitelist"](imgRegEx);
};
wr.mvc.AppConfig.setSafeProtocols["$inject"] = ["$compileProvider", "WRAPP_EXTRA_SAFE_URL_PROTOCOLS", "WRAPP_EXTRA_SAFE_IMG_PROTOCOLS"];

/**
 * @ngInject
 * @param {!angular.$provide} $provide
 */
wr.mvc.AppConfig.setFilterDecorators = function($provide) {
  $provide.decorator("dateFilter", wr.mvc.l10n.dateDecorator);
  $provide.decorator("numberFilter", wr.mvc.l10n.numberDecorator);
};
wr.mvc.AppConfig.setFilterDecorators["$inject"] = ["$provide"];




//== wr/mvc/AppRun.js =========================================================



/**
 * <i>Run blocks</i> to be executed at initialization of the WebRatio MVC Module.
 * 
 * @package
 * @const
 */
wr.mvc.AppRun = {};

/**
 * @ngInject
 * @return {undefined}
 */
wr.mvc.AppRun.configureWebRatioRuntime = function() {
  var Platform = wr.mvc.Platform;
  
  /* Set the temporary directory for the runtime to use */
  switch(wr.mvc.getPlatform()) {
    case Platform.ANDROID:
      wrm.setTempDirectory(cordova.file.externalCacheDirectory);
      wrm.setPersistentDirectory(cordova.file.dataDirectory);
      break;
    case Platform.IOS:
      wrm.setTempDirectory(cordova.file.cacheDirectory);
      wrm.setPersistentDirectory(cordova.file.dataDirectory);
      break;
    case Platform.WINDOWS:
      wrm.setTempDirectory(cordova.file.cacheDirectory);
      wrm.setPersistentDirectory(cordova.file.dataDirectory);
      break;
    default:
      throw new Error("Unsupported platform");;
  }
};

/**
 * @ngInject
 * @param {!angular.Scope} $rootScope
 * @param {!angular.$location} $location
 * @param {!wr.mvc.route.Router} wrRouter
 */
wr.mvc.AppRun.registerStartupNavigation = function($rootScope, $location, wrRouter) {
  var lastPath = null;
  
  /*
   * When navigating to the root path, trigger a "startup" navigation. On mobile devices this should happen only when the application
   * is started from scratch.
   */
  $rootScope.$on("$routeChangeSuccess", function() {
    var newPath = $location.path();
    if (newPath !== lastPath && newPath === "/") {
      lastPath = newPath;
      wrRouter.notifyStartup();
    }
  });
};
wr.mvc.AppRun.registerStartupNavigation["$inject"] = ["$rootScope", "$location", "wrRouter"];

/**
 * @ngInject
 * @param {!wr.mvc.EventsHub} wrEventsHub
 */
wr.mvc.AppRun.startEventsHub = function(wrEventsHub) {
  
  /* Start the events hub */
  wrEventsHub.start();
};
wr.mvc.AppRun.startEventsHub["$inject"] = ["wrEventsHub"];

/**
 * @ngInject
 * @param {!angular.Scope} $rootScope
 * @param {!wr.mvc.Logger} wrLogger
 */
wr.mvc.AppRun.publishPlatform = function($rootScope, wrLogger) {
  var platform = wr.mvc.getPlatform();
  if (DEBUG) {
    var log = wrLogger.createLog("wr.mvc.AppRun");
    if (platform !== "android" && platform !== "ios" && platform !== "windows") {
      log.error("wr.mvc.Platform values have been changed");
      throw new Error;
    }
  }
  $rootScope["device"] = $rootScope["device"] || {};
  $rootScope["device"]["platform"] = platform;
};
wr.mvc.AppRun.publishPlatform["$inject"] = ["$rootScope", "wrLogger"];




//== wr/mvc/BlobController.js =================================================



/**
 * Constructs a new controller instance.
 * 
 * @constructor
 * @class Controller used by the WebRatio <code>wrBlob</code> directive.
 *        <p>
 *        The controller should be bound to a {@linkplain wr.mvc.ModelHelper.Binding binding} that is expected to evaluate to a
 *        {@link wrm.data.Blob} object or to be empty. The binding is bound two-way with the target scope, so that information about
 *        the BLOB value are published to the scope. Any change in the binding will cause the in-scope values to change accordingly.
 *        <p>
 *        BLOB information is published in a scope-variable named <code>blob</code> and containing the following properties.
 *        <ul>
 *        <li><code>url</code> - an URL that can be used for linking to the BLOB contents from HTML, or <code>null</code> if there is
 *        no BLOB;
 *        <li><code>loading</code> - <code>true</code> while the BLOB contents are being prepared, <code>false</code> when they are
 *        ready.
 *        </ul>
 *        <p>
 *        In addition to properties, the BLOB information object also exposes the following methods:
 *        <ul>
 *        <li><code>clear</code> - clears the BLOB value, setting it to <code>null</code>;
 *        <li><code>select</code> - replaces the BLOB value with another one selected by the user;
 *        <li><code>capture</code> - replaces the BLOB value with another one created from scratch by the user;
 *        <li><code>open</code> - opens the BLOB value in an ad-hoc viewer provided by the system.
 *        </ul>
 *        Methods that change the BLOB value are only usable if the binding is assignable.
 *        <p>
 *        <h3>Native Plugins</h3>
 *        <p>
 *        This controller may require the following native plugins under certain circumstances.
 *        <ul>
 *        <li><code>cordova-plugin-camera</code> if calling <code>select</code> or <code>capture</code>,
 *        <li><code>cordova-plugin-file-opener2</code> if calling <code>open</code>.
 *        </ul>
 * @ngInject
 * @param {!angular.Scope} $scope
 * @param {!angular.$parse} $parse
 * @param {!wr.mvc.l10n.LocalizationManager} wrLocalizationManager
 * @param {!wr.mvc.Logger} wrLogger
 */
wr.mvc.BlobController = function($scope, $parse, wrLocalizationManager, wrLogger) {
  
  /** @private */
  this._$scope = $scope;
  
  /** @private */
  this._$parse = $parse;
  
  /** @private */
  this._l10nManager = wrLocalizationManager;
  
  /**
   * @private
   * @type {wr.mvc.BlobController._Info}
   */
  this._info = wr.mvc.BlobController._EMPTY_INFO;
  
  /**
   * @private
   * @type {?wr.mvc.ui.BlobProvider}
   */
  this._blobProvider = null;
  
  /** @private */
  this._log = wrLogger.createLog("wr.mvc.BlobController");
  
  /**
   * @private
   * @type {?wr.mvc.ModelHelper.Binding.<?wrm.data.Blob>}
   */
  this._binding = null;
  
  /* Dispose blob info on scope destruction */
  $scope.$on("$destroy", this._disposeInfo.bind(this));
  
  /**
   * @private
   * @type {!wrm.util.AsyncWorker.<wr.mvc.BlobController._Info>}
   */
  this._blobUrlReleaser = new wrm.util.AsyncWorker(function(item) {
    this._releaseInternalURL(item.blob, item.urlPromise || item.url);
    this._releaseExternalURL(item.blob, item.externalUrlPromise);
  }.bind(this));
};
wr.mvc.BlobController["$inject"] = ["$scope", "$parse", "wrLocalizationManager", "wrLogger"];

/**
 * @param {!wr.mvc.ModelHelper.Binding.<?wrm.data.Blob>} binding
 */
wr.mvc.BlobController.prototype.bind = function(binding) {
  if (this._binding) {
    throw new Error("Blob controller is already bound");
  }
  this._binding = binding;
  
  /* Watch updates of the binding value */
  binding.observe(this._handleUpdate.bind(this));
};

/**
 * @private
 * @typedef {{blob:?wrm.data.Blob, url:?string, urlPromise:?Promise.<string>, externalUrlPromise:?Promise.<string>,
 *          status:?wrm.data.AvailabilityStatus}}
 */
wr.mvc.BlobController._Info;

/**
 * @private
 * @const
 * @type {wr.mvc.BlobController._Info}
 */
wr.mvc.BlobController._EMPTY_INFO = {blob:null, url:null, urlPromise:null, externalUrlPromise:null, status:null};

/**
 * @private
 * @param {?wrm.data.Blob} newBlob
 */
wr.mvc.BlobController.prototype._handleUpdate = function(newBlob) {
  /* avoid updating if blob is the same. It must be done here because AngularJs doesn't support customized equality check */
  if (wrm.data.equal(this._info.blob, newBlob)) {
    return;
  }
  
  this._disposeInfo();
  this._updateInfo(newBlob);
  this._publishInfo();
};

/**
 * @private
 * @return {undefined}
 */
wr.mvc.BlobController.prototype._disposeInfo = function() {
  this._blobUrlReleaser.post(this._info);
  this._info = wr.mvc.BlobController._EMPTY_INFO;
};

/**
 * @private
 * @param {?wrm.data.Blob} blob
 */
wr.mvc.BlobController.prototype._updateInfo = function(blob) {
  var thisController = this;
  
  /* With no blob, set the empty information */
  if (!blob) {
    this._info = wr.mvc.BlobController._EMPTY_INFO;
    return;
  }
  
  /* Set new information, without including the URLs until asked for them */
  var newInfo = {blob:blob, url:null, urlPromise:null, externalUrlPromise:null, status:blob.getMetadata().availabilityStatus};
  this._info = newInfo;
  
  /* Publish the updated information */
  this._publishInfo();
  wr.mvc.applyScope(this._$scope);
};

/**
 * @private
 * @return {undefined}
 */
wr.mvc.BlobController.prototype._updateInfoWithUrl = function() {
  var info = this._info;
  var thisController = this;
  
  /* If there is no blob or the internal URL is already loaded or loading, do nothing */
  if (!info.blob || info.url || info.urlPromise || info.status !== wrm.data.AvailabilityStatus.AVAILABLE) {
    return;
  }
  
  /* Allocate the internal URL (asynchronously) */
  info.urlPromise = this._allocateInternalURL(info.blob);
  info.urlPromise.then(function(url) {
    if (thisController._info !== info) {
      return;
    }
    
    /* Set remaining information */
    info.url = url;
    info.urlPromise = null;
    
    /* Publish the updated information */
    thisController._publishInfo();
    wr.mvc.applyScope(thisController._$scope);
  });
};

/**
 * @private
 * @return {undefined}
 */
wr.mvc.BlobController.prototype._publishInfo = function() {
  var thisController = this;
  var info = this._info;
  
  var props = {};
  Object.defineProperty(props, "url", {get:function() {
    if (!info.url) {
      thisController._updateInfoWithUrl();
    }
    return info.url;
  }});
  props["loading"] = !info.url && !!info.blob || info.status === wrm.data.AvailabilityStatus.PENDING;
  props["failed"] = info.status === wrm.data.AvailabilityStatus.FAILED;
  props["clear"] = this._clear.bind(this);
  props["capture"] = this._captureNew.bind(this);
  props["select"] = this._selectNew.bind(this);
  props["open"] = this._open.bind(this);
  
  this._$scope["blob"] = props;
};

/**
 * @private
 * @return {undefined}
 */
wr.mvc.BlobController.prototype._clear = function() {
  var binding = this._getAssignableBinding();
  binding.assign(null);
};

/**
 * @private
 * @param {string=} contentType
 * @param {wr.mvc.ui.BlobProvider.Attributes=} attributes
 */
wr.mvc.BlobController.prototype._captureNew = function(contentType, attributes) {
  var binding = this._getAssignableBinding();
  this._getBlobProvider().capture(contentType, attributes).then(function(newBlob) {
    binding.assign(newBlob);
  });
};

/**
 * @private
 * @param {string=} contentType
 * @param {wr.mvc.ui.BlobProvider.Attributes=} attributes
 */
wr.mvc.BlobController.prototype._selectNew = function(contentType, attributes) {
  var binding = this._getAssignableBinding();
  this._getBlobProvider().select(contentType, attributes).then(function(newBlob) {
    binding.assign(newBlob);
  });
};

/**
 * @private
 * @return {!wr.mvc.ui.BlobProvider}
 */
wr.mvc.BlobController.prototype._getBlobProvider = function() {
  if (!this._blobProvider) {
    this._blobProvider = wr.mvc.ui.createBlobProvider(wrm.data.Type.BLOB);
  }
  return this._blobProvider;
};

/**
 * @private
 * @return {!wr.mvc.ModelHelper.Binding}
 */
wr.mvc.BlobController.prototype._getAssignableBinding = function() {
  var binding = this._binding;
  if (!binding || !binding.isAssignable()) {
    throw new Error("Not bound to an asisgnable model expression");
  }
  return binding;
};

/**
 * @private
 * @param {string=} contentType
 */
wr.mvc.BlobController.prototype._open = function(contentType) {
  var thisController = this;
  var l10nManager = this._l10nManager;
  var log = this._log;
  var info = this._info;
  
  /* If there is no blob, do nothing */
  if (!info.blob) {
    return;
  }
  
  /* Reuse or allocate an external URL */
  if (!info.externalUrlPromise) {
    info.externalUrlPromise = this._allocateExternalURL(info.blob);
  }
  
  /* Open a viewer pointing to the external URL */
  var blobType = contentType || info.blob.getContentType() || "application/octet-stream";
  var blobId = info.blob ? info.blob.getUniqueId() : "?";
  info.externalUrlPromise.then(function(url) {
    wr.mvc.ui.openFileViewer(url, blobType).then(function() {
      log.debug("Opened viewer for BLOB", blobId);
    }, function(e) {
      log.error("Error opening viewer for BLOB", blobId, e);
      var title = l10nManager.formatMessage("dialog.title.error");
      var message = l10nManager.formatMessage("notification.blobOpenError");
      var buttonLabel = l10nManager.formatMessage("dialog.button.OK");
      wr.mvc.ui.showAlert(message, title, buttonLabel);
    });
  });
};

/*
 * URLs management
 */

/**
 * @private
 * @param {!wrm.data.Blob} blob
 * @return {!Promise.<string>}
 */
wr.mvc.BlobController.prototype._allocateInternalURL = function(blob) {
  var log = this._log;
  
  var blobId = blob.getUniqueId();
  log.debug("Allocating internal URL for BLOB", blobId);
  
  var promise = blob.createObjectURL();
  return promise.then(function(url) {
    if (log.isDebugEnabled()) {
      log.debug("Allocated internal URL for BLOB", blobId, ":", url.length > 80 ? url.substring(0, 80) + "..." : url);
    }
    return url;
  }, function(e) {
    log.error("Error allocating internal URL for BLOB", blobId, e);
    throw e;
  });
};

/**
 * @private
 * @param {?wrm.data.Blob} blob
 * @param {?Promise.<string>|string} urlOrPromise
 */
wr.mvc.BlobController.prototype._releaseInternalURL = function(blob, urlOrPromise) {
  var log = this._log;
  
  var blobId = blob ? blob.getUniqueId() : "?";
  if (urlOrPromise) {
    Promise.resolve(urlOrPromise).then(function(url) {
      blob.revokeObjectURL(url);
      log.debug("Released internal URL for BLOB", blobId);
    });
  }
};

/**
 * @private
 * @param {!wrm.data.Blob} blob
 * @return {!Promise.<string>}
 */
wr.mvc.BlobController.prototype._allocateExternalURL = function(blob) {
  var log = this._log;
  
  var blobId = blob.getUniqueId();
  log.debug("Allocating external URL for BLOB", blobId);
  
  var promise = blob.createExternalURL();
  return promise.then(function(url) {
    if (log.isDebugEnabled()) {
      log.debug("Allocated external URL for BLOB", blobId, ":", url.length > 80 ? url.substring(0, 80) + "..." : url);
    }
    return url;
  }, function(e) {
    log.error("Error allocating external URL for BLOB", blobId, e);
    throw e;
  });
};

/**
 * @private
 * @param {?wrm.data.Blob} blob
 * @param {?Promise.<string>} urlPromise
 */
wr.mvc.BlobController.prototype._releaseExternalURL = function(blob, urlPromise) {
  var log = this._log;
  
  var blobId = blob ? blob.getUniqueId() : "?";
  if (urlPromise) {
    urlPromise.then(function(url) {
      blob.revokeExternalURL(url).then(function() {
        log.debug("Released external URL for BLOB", blobId);
      }, function(e) {
        log.error("Error releasing external URL for BLOB", blobId, e);
      });
    });
  }
};




//== wr/mvc/blobDirective.js ==================================================



/**
 * Directive for attaching a {@linkplain wrm.data.Blob BLOB value} to a target HTML element for displaying and modifying it.
 * <p>
 * The directive creates a new scope and binds it to the {@link wr.mvc.BlobController} controller. Presence of the controller causes
 * the BLOB information to be made available in scope as a <code>blob</code> variable. See {@link wr.mvc.BlobController} documentation
 * for more details.
 * <p>
 * The model can be referenced with an expression or by also adding <code>ng-model</code> on the same target element. The latter case
 * enables the implementation of custom form controls that integrate correctly with all form features such as validation.
 * <p>
 * <h3>Usage</h3>
 * <p>
 * As an attribute, specifying an expression to bind to.
 * 
 * 
 * <pre>
 * &lt;div wr-blob=&quot;blobExpression&quot;&gt;
 * ...
 * &lt;/div&gt;
 * </pre>
 * 
 * 
 * <p>
 * As an attribute, together with <code>ng-model</code>, to implement a custom form control.
 * 
 * 
 * <pre>
 * &lt;div ng-model=&quot;blobExpression&quot; wr-blob&gt;
 * ...
 * &lt;/div&gt;
 * </pre>
 * 
 * @ngInject
 * @param {!wr.mvc.ModelHelper} wrModelBinder
 * @return {!angular.Directive} Directive description object.
 */
wr.mvc.blobDirective = function(wrModelBinder) {
  return ({scope:true, require:["wrBlob", "?ngModel"], restrict:"A", controller:wr.mvc.BlobController, link:function(scope, element, attrs, ctrls) {
    var ctrl = ctrls[0];
    var modelCtrl = ctrls[1];
    
    /* Bind our controller to its expression or to the model controller */
    var binding;
    var expression = attrs["wrBlob"];
    if (expression) {
      binding = wrModelBinder.createExpressionBinding(scope, expression);
    } else {
      if (modelCtrl) {
        binding = wrModelBinder.createModelControllerBinding(scope, modelCtrl);
      } else {
        throw new Error("The wrBlob directive requires an expression or the ngModel directive");
      }
    }
    
    ctrl.bind(binding);
  }});
};
wr.mvc.blobDirective["$inject"] = ["wrModelBinder"];




//== wr/mvc/componentDirective.js =============================================



/**
 * Directive for designating a target HTML element as part of the interface of a WebRatio View Component. This is the preferred way for
 * constructing a UI on top of a component's <i>view object</i>.
 * <p>
 * The directive creates a new scope and publishes the component <i>view object</i> as a <code>view</code> scope variable. The
 * <code>wrScreen</code> directive is required on an ancestor element.
 * <p>
 * An alternative to using the directive is directly retrieving the <i>view object</i> from a screen controller via
 * {@link wr.mvc.ScreenController#getComponentView}.
 * <p>
 * <h3>Usage</h3>
 * <p>
 * As an attribute.
 * 
 * 
 * <pre>
 * &lt;div wr-component=&quot;componentId&quot;&gt;
 * ...
 * &lt;/div&gt;
 * </pre>
 * 
 * 
 * <p>
 * As a pair of comments.
 * 
 * 
 * <pre>
 * &lt;!-- directive: wr-component componentId --&gt;
 * &lt;div&gt;
 * ...
 * &lt;/div&gt;
 * &lt;!-- end_directive: wr-component --&gt;
 * </pre>
 * 
 * @return {!angular.Directive} Directive description object.
 */
wr.mvc.componentDirective = function() {
  return wr.mvc.enableCommentWrapping(({require:"^wrScreen", scope:true, link:{pre:function(scope, element, attrs, screenCtrl) {
    var id = attrs["wrComponent"];
    if (!id) {
      throw new Error("No component id specified for wrComponent");
    }
    
    var view = screenCtrl.retrieveComponentView(id, scope);
    scope["view"] = view;
    
    scope.$watch("view.updating", function(updating) {
      if (updating) {
        element.addClass("wr-view-updating");
      } else {
        element.removeClass("wr-view-updating");
      }
    });
    
    scope.$watch("view._updatingBG", function(updatingBackground) {
      if (updatingBackground) {
        element.addClass("wr-view-updating-bg");
      } else {
        element.removeClass("wr-view-updating-bg");
      }
    });
  }}}));
};




//== wr/mvc/EvalController.js =================================================



/**
 * Constructs a new controller instance.
 * 
 * @constructor
 * @class Controller used by the WebRatio <code>wrEval</code> directive. TODO
 * @ngInject
 * @param {!angular.Attributes} $attrs
 * @param {!angular.Scope} $scope
 * @param {!angular.$parse} $parse
 * @param {!wr.mvc.route.Router} wrRouter
 * @param {!wr.mvc.Logger} wrLogger
 */
wr.mvc.EvalController = function($attrs, $scope, $parse, wrRouter, wrLogger) {
  var variable = $attrs["wrEval"];
  if (!variable) {
    throw new Error("No eval expression specified(wr-eval)");
  }
  $scope.$watch(variable, function(newValue, oldValue) {
    if (newValue != undefined) {
      var camelCaser = function(str) {
        var camelCased = str.replace(/[-_ .]+(.)?/g, function(match, p) {
          return p ? p.toUpperCase() : "";
        }).replace(/[^\w]/gi, "");
        return camelCased;
      };
      newValue = camelCaser(newValue);
      var expression = $attrs["expr" + newValue];
      if (expression == undefined) {
        expression = $attrs["exprdefault"];
      }
      if (expression != undefined) {
        $scope.$eval(expression);
        $parse(variable).assign($scope, null);
      }
    }
  });
};
wr.mvc.EvalController["$inject"] = ["$attrs", "$scope", "$parse", "wrRouter", "wrLogger"];




//== wr/mvc/evalDirective.js ==================================================



/**
 * Directive for triggering an event-throw-expression in case a certain variable changes.
 * <h3>Usage</h3>
 * <p>
 * 
 * 
 * <pre>
 * &lt;div wr-eval=&quot;variable&quot; exprcase1=&quot;expr1&quot; exprcase2=&quot;expr2&quot; exprdefault=&quot;expr2&quot;/&gt;    
 * </pre>
 * 
 * @return {!angular.Directive} Directive description object.
 */
wr.mvc.evalDirective = function() {
  return {scope:true, restrict:"A", controller:wr.mvc.EvalController};
};




//== wr/mvc/EventsHub.js ======================================================


/**
 * Constructs a new events hub service.
 * 
 * @constructor
 * @class Service for capturing native events and notifying them to the WebRatio Mobile Runtime.
 *        <p>
 *        The service listens for various HTML events, normalizing their behavior and finally reporting them to the injected
 *        {@linkplain wr.mvc.route.Router router service} as WebRatio events, by calling {@link wr.mvc.route.Router#notifiyEvent}.
 * @ngInject
 * @param {!angular.JQLite} $document
 * @param {!angular.$injector} $injector
 * @param {!wr.mvc.route.Router} wrRouter
 */
wr.mvc.EventsHub = function($document, $injector, wrRouter) {
  
  /** @private */
  this._$document = $document;
  
  /** @private */
  this._$injector = $injector;
  
  /** @private */
  this._router = wrRouter;
  
  /** @private */
  this._started = false;
  
  /**
   * @private
   * @type {?wr.mvc.EventsHub._Notifier}
   */
  this._backNotifier = null;
  
  /**
   * @private
   * @type {?function()}
   */
  this._backUnbindFn = null;
};
wr.mvc.EventsHub["$inject"] = ["$document", "$injector", "wrRouter"];

/**
 * @type {function()}
 */
wr.mvc.EventsHub.prototype.start = function() {
  if (this._started) {
    throw new Error("Already started");
  }
  this._started = true;
  
  /* Bind HTML events to Runtime events */
  this._bindOnDocumentEvent("resume", "AppResume");
  if (!this._backNotifier) {
    this._backUnbindFn = this._bindOnDocumentEvent("backbutton", "BackEvent", true);
  }
};

/**
 * Overrides the default back button notification with a custom logic.
 * <p>
 * The returned function can be used for manually notifying a back button press. To cancel overriding, call
 * {@link #restoreBackButtonNotification}.
 * 
 * @return {function()} Notification function. When called, notifies a back button press to the WebRatio MVC. Throws an error after the
 *         default notification logic is restored and/or another override is initiated.
 * @throws {Error} if the back button notification is already being overridden.
 * @see #restoreBackButtonNotification
 */
wr.mvc.EventsHub.prototype.overrideBackButtonNotification = function() {
  if (this._backNotifier) {
    throw new Error("Back button notification is already overridden");
  }
  this._backUnbindFn();
  this._backUnbindFn = null;
  this._backNotifier = this._createNotifier("BackEvent");
  return this._backNotifier.notify;
};

/**
 * Restores the default back button notification logic. If the default is already active, nothing happens.
 * <p>
 * All notification function given away by previous calls to {@link #overrideBackButtonNotification} will stop working and should not
 * be called.
 * 
 * @see #overrideBackButtonNotification
 */
wr.mvc.EventsHub.prototype.restoreBackButtonNotification = function() {
  if (this._backUnbindFn) {
    return;
  }
  this._backNotifier.disable();
  this._backNotifier = null;
  this._backUnbindFn = this._bindOnDocumentEvent("backbutton", "BackEvent", true);
};

/**
 * @private
 * @param {string} eventType
 * @param {string} rtxEventType
 * @param {boolean=} preventDefault
 * @return {function()}
 */
wr.mvc.EventsHub.prototype._bindOnDocumentEvent = function(eventType, rtxEventType, preventDefault) {
  var thisEventHub = this;
  var document = this._$document[0];
  
  function handler(event) {
    if (preventDefault) {
      event.preventDefault();
    }
    thisEventHub._notifyEvent(rtxEventType);
  }
  
  document.addEventListener(eventType, handler);
  
  return function() {
    document.removeEventListener(eventType, handler);
  };
};

/**
 * @typedef {{notify:function(), disable:function()}}
 */
wr.mvc.EventsHub._Notifier;

/**
 * @private
 * @param {string} rtxEventType
 * @return {!wr.mvc.EventsHub._Notifier}
 */
wr.mvc.EventsHub.prototype._createNotifier = function(rtxEventType) {
  var thisEventHub = this;
  
  var disabled = false;
  return {notify:function() {
    if (disabled) {
      throw new Error("Event notifier has been disabled");
    }
    thisEventHub._notifyEvent(rtxEventType);
  }, disable:function() {
    disabled = true;
  }};
};

/**
 * @private
 * @param {string} rtxEventType
 */
wr.mvc.EventsHub.prototype._notifyEvent = function(rtxEventType) {
  this._router.notifyEvent(rtxEventType);
};




//== wr/mvc/FeedbackController.js =============================================



/**
 * Constructs a new controller instance.
 * 
 * @constructor
 * @class Controller used for implementing <i>feedbacks</i>.
 *        <p>
 *        Only a single instance of this controller can exist at any given time. All feedbacks are managed by that single instance.
 *        <p>
 *        When a feedback is shown, the <code>data</code> property on the <code>feedback</code> scope variable is filled with the
 *        feedback data. Conversely, the <code>data</code> object is deleted when the feedback is closed.
 *        <p>
 *        <h3>Events</h3>
 *        <p>
 *        The controller also enables template code to throw feedback <i>events</i> to be handled by the callbacks specified at the
 *        time of creating the feedback.
 * @ngInject
 * @param {!angular.JQLite} $element
 * @param {!angular.Attributes} $attrs
 * @param {!angular.Scope} $scope
 * @param {!angular.$animate} $animate
 * @param {!wr.mvc.route.Router} wrRouter
 * @param {!wr.mvc.Logger} wrLogger
 */
wr.mvc.FeedbackController = function($element, $attrs, $scope, $animate, wrRouter, wrLogger) {
  
  /** @private */
  this._$scope = $scope;
  
  /** @private */
  this._$element = $element;
  
  /** @private */
  this._router = wrRouter;
  
  /** @private */
  this._$animate = $animate;
  
  /**
   * @private
   * @type {?{detachController:function(), throwEvent:function(string,!Object=):!Promise}}
   */
  this._hooks = null;
  
  /** @private */
  this._log = wrLogger.createLog("wr.mvc.FeedbackController");
  
  this._init();
};
wr.mvc.FeedbackController["$inject"] = ["$element", "$attrs", "$scope", "$animate", "wrRouter", "wrLogger"];

/**
 * @private
 * @return {undefined}
 */
wr.mvc.FeedbackController.prototype._init = function() {
  var $scope = this._$scope;
  var router = this._router;
  
  var hooks = wr.mvc.ui.attachFeedbackController(this);
  this._hooks = hooks;
  
  var unsubscribeFunc = $scope.$on("$destory", function() {
    unsubscribeFunc();
    hooks.detachController();
  });
};

/**
 * @internal
 * @param {!Object} data
 */
wr.mvc.FeedbackController.prototype.setFeedbackData = function(data) {
  var $scope = this._$scope;
  wr.mvc.applyScope($scope, function() {
    $scope["feedback"]["data"] = data;
  });
};

/**
 * @internal
 * @return {!Promise}
 */
wr.mvc.FeedbackController.prototype.clearFeedbackData = function() {
  var $scope = this._$scope;
  var $element = this._$element;
  var $animate = this._$animate;
  var feedbackElement = $element.children();
  
  return new Promise(function(resolve) {
    wr.mvc.applyScope($scope, function() {
      $animate.leave(feedbackElement).then(function() {
        wr.mvc.applyScope($scope, function() {
          delete $scope["feedback"]["data"];
          resolve(undefined);
        });
      });
    });
  });
};

/**
 * Closes this feedback.
 * 
 * @param {!Event} $event The HTML event that initiated the closing of this feedback.
 * @return {!Promise} Promise of closing this feedback and completing any resulting behavior in the application.
 */
wr.mvc.FeedbackController.prototype.close = function($event) {
  return this.throwEvent($event, wr.mvc.ui.FEEDBACK_CLOSE_EVENT_TYPE);
};

/**
 * Throws an event from within this feedback.
 * 
 * @param {?Event} $event The HTML event that initiated the throwing of the feedback event.
 * @param {string} type Type of event to throw (e.g. <code>Accept</code>).
 * @param {?string=} specifier Specifier for restricting the scope of the event or <code>null</code> for a generic event.
 * @param {!Object=} parameters Parameters to throw along with the event, specified as an object with values keyed by parameter name.
 *            If not specified, the event is thrown without any parameter.
 * @return {!Promise} Promise of catching the event and completing any resulting behavior in the application.
 */
wr.mvc.FeedbackController.prototype.throwEvent = function($event, type, specifier, parameters) {
  var log = this._log;
  $event.stopPropagation();
  if (log.isDebugEnabled()) {
    log.debug("Throwing feedback event", type + " " + JSON.stringify(parameters || {}));
  }
  return this._hooks.throwEvent(type, parameters).then(undefined, function(e) {
    log.error("Error during feedback event handling", e);
  });
};




//== wr/mvc/feedbackDirective.js ==============================================



/**
 * Directive for designating a target HTML element as the visible interface of all <i>feedbacks</i> displayed by the MVC library. Only
 * a single instance of this directive can be active at any given time.
 * <p>
 * The directive creates a new scope and binds it to the {@link wr.mvc.FeedbackController} controller. The controller is also published
 * as a <code>feedback</code> scope variable.
 * <p>
 * <h3>Usage</h3>
 * <p>
 * As an attribute.
 * 
 * 
 * <pre>
 * &lt;div wr-feedback&gt;
 * ...
 * &lt;/div&gt;
 * </pre>
 * 
 * 
 * <p>
 * As a pair of comments.
 * 
 * 
 * <pre>
 * &lt;!-- directive: wr-feedback --&gt;
 * &lt;div&gt;
 * ...
 * &lt;/div&gt;
 * &lt;!-- end_directive: wr-feedback --&gt;
 * </pre>
 * 
 * @return {!angular.Directive} Directive description object.
 */
wr.mvc.feedbackDirective = function(wrRouter, $animate) {
  return wr.mvc.enableCommentWrapping(({scope:true, controller:wr.mvc.FeedbackController, controllerAs:"feedback"}));
};




//== wr/mvc/inputFormatDirective.js ===========================================


/**
 * Directive for enabling an HTML input element to support the data types of the WebRatio Runtime.
 * <p>
 * The directive must target an element that has the <code>ngModel</code> directive attached. Usually, the element also has a
 * <code>type</code> attribute (such as HTML inputs). The directive will then start converting bi-directionally between the value of
 * the model property and the string value of the input element. See below for further details.
 * <p>
 * The input format is specified as the value of the <code>wr-input-format</code> attribute itself. If not specified, the format is
 * inferred from the <code>type</code> attribute. If the format cannot be determined, an error is thrown.<br>
 * The valid types are those declared by the {@link wrm.data.Type} enumeration.
 * <p>
 * <h3>Conversions</h3>
 * <p>
 * The model property is always set to the appropriate WebRatio type:
 * <ul>
 * <li><code>date</code> format sets {@link wrm.data.Date} values,
 * <li><code>decimal</code> format sets {@link wrm.data.Decimal} values,
 * <li><code>time</code> format sets {@link wrm.data.Time} values,
 * <li><code>timestamp</code> format sets {@link wrm.data.DateTime} values.
 * </ul>
 * Reverse conversions are more lenient: for example, all data/time formats will accept any of the WebRatio date/time values listed
 * above, as well as native {@link Date} objects.
 * <p>
 * <h3>Usage</h3>
 * <p>
 * As an attribute on an HTML input, together with <code>ngModel</code>, inferring the format.
 * 
 * 
 * <pre>
 * &lt;input type=&quot;...&quot; ng-model=&quot;...&quot; wr-input-format&gt;
 * </pre>
 * 
 * 
 * <p>
 * With an explicit format.
 * 
 * 
 * <pre>
 * &lt;input type=&quot;text&quot; ng-model=&quot;...&quot; wr-input-format=&quot;timestamp&quot;&gt;
 * </pre>
 * 
 * @ngInject
 * @param {!wr.mvc.InputFormatter} wrInputFormatter
 * @return {!angular.Directive} Directive description object.
 */
wr.mvc.inputFormatDirective = function(wrInputFormatter, wrLogger) {
  var Type = wrm.data.Type;
  
  /**
   * Type names by INPUT element type attribute.
   * 
   * @const
   * @type {!Object.<string,wrm.data.Type>}
   */
  var TYPE_BY_INPUT_TYPE = {"date":Type.DATE, "datetime-local":Type.TIMESTAMP, "number":Type.FLOAT, "time":Type.TIME};
  
  return ({require:"ngModel", restrict:"A", link:function(scope, element, attrs, modelCtrl) {
    var typeName = attrs["wrInputFormat"] || TYPE_BY_INPUT_TYPE[attrs["type"]];
    var type = wrm.util.obj.castEnumValue(Type, typeName);
    wrInputFormatter.configureModelController(element, type, modelCtrl);
  }});
};
wr.mvc.inputFormatDirective["$inject"] = ["wrInputFormatter", "wrLogger"];




//== wr/mvc/formPropertyDirective.js ==========================================



/**
 * Directive for enhancing a model-bound HTML input element with the behavior of a <i>form property</i>, such as validation.
 * <p>
 * Form properties are the concept used by some WebRatio components to represent parts of their view that are editable and expected to
 * be modified by the user. Those properties are usually bound to an HTML input element by means of the <code>ngModel</code> directive.
 * <p>
 * <h3>Validation</h3>
 * <p>
 * This directive will enable automatic <b>input validation</b> mediated by the WebRatio Runtime in addition to the normal HTML
 * validation.<br>
 * The following properties are added to the <i>view</i> object of the component that is publishing the property.
 * <ul>
 * <li><code>formState.<i>propertyName</i>.valid</code> - flag indicating that the property is passing validation,
 * <li><code>formState.<i>propertyName</i>.invalid</code> - flag indicating that the property is not passing validation,
 * <li><code>formState.<i>propertyName</i>.dirty</code> - flag indicating that the property has been modified by the user,
 * <li><code>formState.<i>propertyName</i>.errors</code> - list of localized error messages about failing validation <i>on the
 * property</i>.
 * </ul>
 * In addition, the following property are added to the <i>view</i> to describe the state of all form properties of the component
 * (including other ones):
 * <ul>
 * <li><code>formState.valid</code> - flag indicating that all form properties and the form itself are passing validation,
 * <li><code>formState.invalid</code> - flag indicating that at least one form property or the form itself is not passing validation,
 * <li><code>formState.dirty</code> - flag indicating that at least one property has been modified by the user, *
 * <li><code>formState.errors</code> - list of localized error messages about failing validation <i>on the form itself</i>.
 * </ul>
 * Finally, all CSS classes provided by Angular for validation will be applied to the form elements as expected. For example, a control
 * failing validation is marked <code>ng-invalid</code>. See <code>NgModelController</code> documentation for more information.
 * <p>
 * <h3>Input Formatting</h3>
 * <p>
 * This directive will also apply bi-directional formatting to the input value, according to the modeled type of the WebRatio form
 * property. This doubles the behavior of this directive: {@see wr.mvc.inputFormatDirective} for more information.
 * <p>
 * If the <code>wrInputFormat</code> directive is already present on the target element, it will take precedence and this directive
 * will not change formatting.
 * <p>
 * <h3>Usage</h3>
 * <p>
 * As an attribute on an HTML input, together with <code>ngModel</code> and with a <code>wrScreen</code> on the same element or on
 * parents.
 * 
 * 
 * <pre>
 * &lt;input type=&quot;...&quot; ng-model=&quot;...&quot; wr-form-property&gt;
 * </pre>
 * 
 * @ngInject
 * @param {!angular.$parse} $parse
 * @param {!wr.mvc.InputFormatter} wrInputFormatter
 * @param {!wr.mvc.route.Router} wrRouter
 * @param {!wr.mvc.Logger} wrLogger
 * @return {!angular.Directive} Directive description object.
 */
wr.mvc.formPropertyDirective = function($parse, wrInputFormatter, wrRouter, wrLogger) {
  
  /* Function for extracting tow property expressions form a model expression */
  function splitModelExpressionProperties(expr) {
    var result = [];
    var lastDotIndex = -1;
    var parensDepth = 0;
    for (var i = 0;i < expr.length;i++) {
      var ch = expr.charAt(i);
      if (ch === "(") {
        parensDepth++;
      } else {
        if (ch === ")") {
          parensDepth--;
        } else {
          if (ch === ".") {
            if (parensDepth === 0) {
              result.push(expr.substring(lastDotIndex + 1, i));
              lastDotIndex = i;
            }
          }
        }
      }
    }
    result.push(expr.substring(lastDotIndex + 1));
    return result;
  }
  
  /* Function for retrieving, from a model expression, the component and the expression used to access its view */
  function extractViewPropertyReference(expr, scope) {
    var parts = splitModelExpressionProperties(expr);
    for (var i = 1;i <= parts.length;i++) {
      var viewExpr = parts.slice(0, i).join(".");
      var view = $parse(viewExpr)(scope);
      if (view && view["componentId"]) {
        return {componentId:view["componentId"], expr:parts.slice(i).join(".")};
      }
    }
    throw new Error("The ng-model expression does not reference a view: " + expr);
  }
  
  return ({require:["^wrScreen", "ngModel", "^?form"], restrict:"A", link:function(scope, element, attrs, ctrls) {
    var screenCtrl = ctrls[0];
    var modelCtrl = ctrls[1];
    var formCtrl = ctrls[2];
    
    /* Retrieve component id and form property name by parsing the model expression */
    var viewPropertyRef = extractViewPropertyReference(attrs["ngModel"], scope);
    var componentId = viewPropertyRef.componentId;
    var propertyName = screenCtrl.getFormInfo().resolvePropertyFromView(componentId, viewPropertyRef.expr);
    var propertyType = screenCtrl.getFormInfo().getPropertyType(componentId, propertyName);
    
    /* If not using the wr-input-format directive, attach formatters */
    if (!attrs.hasOwnProperty("wrInputFormat")) {
      wrInputFormatter.configureModelController(element, propertyType, modelCtrl);
    }
    
    /* Attach the model controller for tracking the form property state */
    var detachModelController = screenCtrl.attachModelController(componentId, propertyName, modelCtrl, formCtrl);
    
    /* Register an asynchronous validator using the screen controller */
    modelCtrl.$asyncValidators[wr.mvc.VALIDATION_VALIDATOR_KEY] = function wrMainDelegateValidator() {
      
      /* Never-interacted models are always "valid" */
      if (modelCtrl.$pristine) {
        return Promise.resolve();
      }
      
      var promise = screenCtrl.validate(componentId, propertyName);
      if (promise) {
        return promise.then(function(valid) {
          if (!valid) {
            throw new Error;
          }
        }, function(e) {
          return true;
        });
      }
    };
    
    /* Remove unnecessary angular validators */
    if (propertyType === wrm.data.Type.URL) {
      delete modelCtrl.$validators["url"];
    }
    
    /* Cleanup everything on element/scope destroy */
    function cleanup() {
      delete modelCtrl.$asyncValidators[wr.mvc.VALIDATION_VALIDATOR_KEY];
      detachModelController();
    }
    element.on("$destroy", cleanup);
    scope.$on("$destroy", cleanup);
  }});
};
wr.mvc.formPropertyDirective["$inject"] = ["$parse", "wrInputFormatter", "wrRouter", "wrLogger"];




//== wr/mvc/InputFormatter.js =================================================


/**
 * Constructs a new input formatter service.
 * 
 * @constructor
 * @class Service providing bi-directional conversions for WebRatio types to values suitable for HTML input elements.
 * @ngInject
 * @param {!angular.$filter} $filter
 * @param {!wr.mvc.Logger} wrLogger
 */
wr.mvc.InputFormatter = function($filter, wrLogger) {
  var Type = wrm.data.Type;
  var log = wrLogger.createLog("wr.mvc.InputFormatter");
  
  /**
   * @const
   * @type {{toModel:function(*):*,toView:function(*):string}}
   */
  this._defaultFormatter = {toModel:function(value) {
    return value;
  }, toView:function(value) {
    return value;
  }};
  
  /**
   * @const
   * @type {!Object.<wrm.data.Type,{toModel:function(*):*,toView:function(*):string}>}
   */
  this._formatters = {};
  this._formatters[Type.DATE] = {toModel:function(value) {
    return typeof value === "string" && !!value ? wrm.data.Date.fromString(value) : null;
  }, toView:function(value) {
    return $filter("date")(convertToDate(value), "yyyy-MM-dd");
  }};
  this._formatters[Type.TIME] = {toModel:function(value) {
    return typeof value === "string" && !!value ? wrm.data.Time.fromString(value) : null;
  }, toView:function(value) {
    return $filter("date")(convertToDate(value), "HH:mm:ss");
  }};
  this._formatters[Type.TIMESTAMP] = {toModel:function(value) {
    return typeof value === "string" && !!value ? wrm.data.DateTime.fromString(value) : null;
  }, toView:function(value) {
    return $filter("date")(convertToDate(value), "yyyy-MM-dd'T'HH:mm:ss");
  }};
  this._formatters[Type.DECIMAL] = {toModel:function(value) {
    return typeof value === "string" ? wrm.data.toDecimal(value) : null;
  }, toView:function(value) {
    if (value instanceof wrm.data.Decimal) {
      return value.toString();
    }
    return value;
  }};
  this._formatters[Type.INTEGER] = {toModel:function(value) {
    return typeof value === "string" ? wrm.data.toInteger(value) : null;
  }, toView:function(value) {
    return value;
  }};
  this._formatters[Type.FLOAT] = {toModel:function(value) {
    return typeof value === "string" ? wrm.data.toFloat(value) : null;
  }, toView:function(value) {
    return value;
  }};
  
  function convertToDate(value) {
    if (value === null || value === undefined) {
      return value;
    }
    if (angular.isDate(value)) {
      return value;
    }
    if (value instanceof wrm.data.Date || value instanceof wrm.data.Time || value instanceof wrm.data.DateTime) {
      return value.asDate();
    }
    log.warn("Value not convertible to Date", value);
    return null;
  }
  
  /**
   * @const
   * @type {!Object.<wrm.data.Type,function(*):*>}
   */
  this._validatorsPatchers = {};
  this._validatorsPatchers[Type.DATE] = function($validators) {
    if ($validators["min"]) {
      var _minValidator = $validators["min"];
      $validators["min"] = function(value) {
        return _minValidator.call(undefined, value ? value.asDate() : undefined);
      };
    }
    if ($validators["max"]) {
      var _maxValidator = $validators["max"];
      $validators["max"] = function(value) {
        return _maxValidator.call(undefined, value ? value.asDate() : undefined);
      };
    }
  };
  this._validatorsPatchers[Type.TIME] = function($validators) {
    if ($validators["min"]) {
      var _minValidator = $validators["min"];
      $validators["min"] = function(value) {
        return _minValidator.call(undefined, value ? value.asDate() : undefined);
      };
    }
    if ($validators["max"]) {
      var _maxValidator = $validators["max"];
      $validators["max"] = function(value) {
        return _maxValidator.call(undefined, value ? value.asDate() : undefined);
      };
    }
  };
  this._validatorsPatchers[Type.TIMESTAMP] = function($validators) {
    if ($validators["min"]) {
      var _minValidator = $validators["min"];
      $validators["min"] = function(value) {
        return _minValidator.call(undefined, value ? value.asDate() : undefined);
      };
    }
    if ($validators["max"]) {
      var _maxValidator = $validators["max"];
      $validators["max"] = function(value) {
        return _maxValidator.call(undefined, value ? value.asDate() : undefined);
      };
    }
  };
};
wr.mvc.InputFormatter["$inject"] = ["$filter", "wrLogger"];

/**
 * @param {!wrm.data.Type} type
 * @return {{toModel:function(*):*,toView:function(*):string}}
 */
wr.mvc.InputFormatter.prototype.getFormatter = function(type) {
  var formatter = this._formatters[type];
  return formatter || this._defaultFormatter;
};

/**
 * @param {!wrm.data.Type} type
 * @param {!Object.<string, function(?, ?):*>} $validators
 */
wr.mvc.InputFormatter.prototype.patchValidators = function(type, $validators) {
  if (this._validatorsPatchers[type]) {
    this._validatorsPatchers[type]($validators);
  }
};

/**
 * @package
 * @param {!angular.JQLite} element
 * @param {!wrm.data.Type} type
 * @param {!angular.NgModelController} modelCtrl
 */
wr.mvc.InputFormatter.prototype.configureModelController = function(element, type, modelCtrl) {
  var formatter = this.getFormatter(type);
  
  var parsers = [];
  
  if (element[0].validity !== null && typeof element[0].validity === "object") {
    parsers.push(function(value) {
      var validity = element[0].validity || {};
      return validity.badInput && !validity.typeMismatch ? undefined : value;
    });
  }
  
  parsers.push(function(data) {
    try {
      return formatter.toModel(data);
    } catch (e) {
      return undefined;
    }
  });
  
  modelCtrl.$$parserName = wr.mvc.PLATFORM_VALIDATION_KEY[type];
  
  /* View -> Model */
  modelCtrl.$parsers = parsers;
  
  /* Model -> View */
  modelCtrl.$formatters = [function(data) {
    return formatter.toView(data);
  }];
  
  this.patchValidators(type, modelCtrl.$validators);
};




//== wr/mvc/Logger.js =========================================================


/**
 * Constructs a new logger service.
 * 
 * @constructor
 * @class Service providing an enhanced log system when compared to the stock Angular log service.
 *        <p>
 *        Additional features include:
 *        <ul>
 *        <li>creation of logs bound to a fixed category reported in all log entries,
 *        <li>automatic formatting of messages (with timestamp, severity level, etc.),
 *        <li>automatic formatting of object arguments to meaningful output, even when not implementing {@link Object#toString}.
 *        </ul>
 *        <p>
 *        The injected <code>WRAPP_LOG_ENABLED</code> allows to disable logging entirely, producing log objects that actually do
 *        nothing. This is desirable in production builds for minimizing the performance impact of logging.
 *        <p>
 *        New logs are created by calling {@link #createLog} and implement the WebRatio Runtime {@link wrm.Log} interface.
 * @ngInject
 * @param {!angular.$log} $log
 * @param {boolean} WRAPP_LOG_ENABLED
 * @param {boolean} WRAPP_LOG_DB_ENABLED
 * @param {string} WRAPP_LOG_TIMESTAMP
 * @param {number} WRAPP_LOG_MAX_ARG_LENGTH
 */
wr.mvc.Logger = function($log, WRAPP_LOG_ENABLED, WRAPP_LOG_DB_ENABLED, WRAPP_LOG_TIMESTAMP, WRAPP_LOG_MAX_ARG_LENGTH) {
  
  /** @private */
  this._$log = WRAPP_LOG_ENABLED ? $log : null;
  
  /** @private */
  this._dbLogEnabled = WRAPP_LOG_DB_ENABLED;
  
  /** @private */
  this._timestampFormat = WRAPP_LOG_TIMESTAMP;
  
  /** @private */
  this._maxArgLength = WRAPP_LOG_MAX_ARG_LENGTH;
};
wr.mvc.Logger["$inject"] = ["$log", "WRAPP_LOG_ENABLED", "WRAPP_LOG_DB_ENABLED", "WRAPP_LOG_TIMESTAMP", "WRAPP_LOG_MAX_ARG_LENGTH"];

/**
 * Creates a new categorized log based on this logger.
 * 
 * @param {string} category Category of all entries logged by the new log.
 * @param {...*} var_args Arguments to prefix before all log messages. A common use of this is providing additional identifier to the
 *            source of the log entries.
 * @return {!wrm.Log} A log.
 */
wr.mvc.Logger.prototype.createLog = function(category, var_args) {
  if (!this._$log || !this._dbLogEnabled && category === "database") {
    return wr.mvc.Logger._FAKE_LOG;
  }
  
  var args = Array.prototype.slice.call(arguments, 0);
  args.shift();
  return new wr.mvc.Logger._LogImpl(this._$log, this._timestampFormat, category, args, this._maxArgLength);
};

/**
 * @private
 * @const
 * @type {!wrm.Log}
 */
wr.mvc.Logger._FAKE_LOG = ({error:angular.noop, warn:angular.noop, info:angular.noop, debug:angular.noop, isDebugEnabled:function() {
  return false;
}});

/**
 * @private
 * @constructor
 * @implements wrm.Log
 * @param {!angular.$log} $log
 * @param {string} timestampFormat
 * @param {string} category
 * @param {!Array.<*>} messagePrefixArgs
 * @param {number} maxArgLength
 */
wr.mvc.Logger._LogImpl = function($log, timestampFormat, category, messagePrefixArgs, maxArgLength) {
  this.error = wr.mvc.Logger._LogImpl._wrapFunction($log, $log.error, "ERROR", timestampFormat, category, messagePrefixArgs, maxArgLength);
  this.warn = wr.mvc.Logger._LogImpl._wrapFunction($log, $log.warn, "WARN", timestampFormat, category, messagePrefixArgs, maxArgLength);
  this.info = wr.mvc.Logger._LogImpl._wrapFunction($log, $log.info, "INFO", timestampFormat, category, messagePrefixArgs, maxArgLength);
  this.debug = wr.mvc.Logger._LogImpl._wrapFunction($log, $log.debug, "DEBUG", timestampFormat, category, messagePrefixArgs, maxArgLength);
  this.isDebugEnabled = function() {
    return true;
  };
};

/**
 * @private
 * @param {!angular.$log} $log
 * @param {function(this:angular.$log,?)} fn
 * @param {string} timestampFormat
 * @param {string} levelName
 * @param {string} category
 * @param {!Array.<*>} messagePrefixArgs
 * @param {number} maxArgLength
 * @return {function(this:angular.$log,?)}
 */
wr.mvc.Logger._LogImpl._wrapFunction = function($log, fn, levelName, timestampFormat, category, messagePrefixArgs, maxArgLength) {
  var includeDate = timestampFormat === "long";
  var includeTime = timestampFormat === "long" || timestampFormat === "short";
  var categoryAndLevel = levelName + " [" + category + "]";
  var boundFunction = fn.bind($log);
  
  return function() {
    var timestamp = new Date;
    var prefixParts = [];
    if (includeDate) {
      prefixParts.push(timestamp.getFullYear());
      prefixParts.push("-");
      prefixParts.push(("00" + (timestamp.getMonth() + 1)).slice(-2));
      prefixParts.push("-");
      prefixParts.push(("00" + timestamp.getDate()).slice(-2));
      prefixParts.push(" ");
    }
    if (includeTime) {
      prefixParts.push(("00" + timestamp.getHours()).slice(-2));
      prefixParts.push(":");
      prefixParts.push(("00" + timestamp.getMinutes()).slice(-2));
      prefixParts.push(":");
      prefixParts.push(("00" + timestamp.getSeconds()).slice(-2));
      prefixParts.push(".");
      prefixParts.push(("000" + timestamp.getMilliseconds()).slice(-3));
      prefixParts.push(" ");
    }
    prefixParts.push(categoryAndLevel);
    
    var args = Array.prototype.slice.call(arguments, 0);
    Array.prototype.unshift.apply(args, messagePrefixArgs);
    args.unshift(prefixParts.join(""));
    wr.mvc.Logger._LogImpl._LOG_SENDER.post({fn:boundFunction, message:wr.mvc.Logger._LogImpl._formatArgs(args, maxArgLength)});
  };
};

/**
 * @private
 * @param {!Array.<*>} args
 * @param {number} maxArgLength
 * @return {string}
 */
wr.mvc.Logger._LogImpl._formatArgs = function(args, maxArgLength) {
  
  /* Function for formatting a single argument */
  function formatArg(arg) {
    if (typeof arg !== "object" || arg === null) {
      return abbreviate(String(arg));
    }
    if (arg instanceof Error) {
      if (arg["stack"]) {
        return arg["stack"];
      } else {
        if (arg.message) {
          return arg.name + ": " + arg.message;
        }
      }
      return arg.name;
    }
    try {
      return abbreviate(jsDump.parse(arg));
    } catch (e) {
      return "[Error dumping object: " + String(e) + "]";
    }
  }
  
  /* Function for abbreviating an argument string */
  function abbreviate(str) {
    if (!str || str.length <= maxArgLength) {
      return str;
    }
    var head = str.substring(0, maxArgLength / 3 * 2);
    var tail = str.substring(str.length - (maxArgLength - head.length), str.length);
    var lineSep = str.indexOf("\n") >= 0 ? "\n" : "";
    return head + lineSep + "[..." + (str.length - maxArgLength) + " omitted...]" + lineSep + tail;
  }
  
  var formattedArgs = "";
  for (var i = 0;i < args.length;i++) {
    if (i > 0) {
      formattedArgs += " ";
    }
    formattedArgs += formatArg(args[i]);
  }
  return formattedArgs;
};

/**
 * @private
 * @const
 * @type {!wrm.util.AsyncWorker.<{fn:function(?), message:string}>}
 */
wr.mvc.Logger._LogImpl._LOG_SENDER = new wrm.util.AsyncWorker(function(item) {
  item.fn(item.message);
});

/* Augment the default object parser of the jsDump library so that it prefers using custom toString methods when available */
(function() {
  var defatulToString = Object.prototype.toString;
  var defaultObjectParser = jsDump.parsers["object"];
  jsDump.setParser("object", function(map) {
    if (map && map.toString !== defatulToString) {
      return map.toString();
    }
    return defaultObjectParser.apply(this, arguments);
  });
})();




//== wr/mvc/impl/FileDescriptorLoader.js ======================================

wr.mvc.impl = {};

/**
 * Constructs a new descriptor loader.
 * 
 * @constructor
 * @class Implementation of a WebRatio descriptor loader that retrieves configuration and descriptors from files that are part of the
 *        application bundle of resources.
 * @implements wrm.core.DescriptorLoader
 * @param {!wrm.Platform} platform Platform used for retrieving files.
 */
wr.mvc.impl.FileDescriptorLoader = function(platform) {
  
  /** @private */
  this._platform = platform;
};

/** @override */
wr.mvc.impl.FileDescriptorLoader.prototype.loadConfigurationObject = function(id) {
  return this._platform.readAppFile("conf/" + id + ".json");
};

/** @override */
wr.mvc.impl.FileDescriptorLoader.prototype.loadConfigurationProperties = function(id) {
  var thisLoader = this;
  return this._platform.readAppFile("conf/" + id + ".properties", true).then(function(buffer) {
    if (!buffer) {
      return null;
    }
    return thisLoader._parseProperties(thisLoader._decodeISO88591String(buffer));
  });
};

/**
 * @private
 * @param {!ArrayBuffer} buffer
 * @return {string}
 */
wr.mvc.impl.FileDescriptorLoader.prototype._decodeISO88591String = function(buffer) {
  var bytes = new Uint8Array(buffer);
  
  /*
   * ISO-8859-1 has the same code points of the first 256 Unicode chars, so it is just a matter of using them to build a string. The
   * reason this has to be done manually is that codes higher than 0x7F would be misinterpreted as (invalid) multiple-byte UTF-8
   * sequences.
   */
  var charCodes = new Array(bytes.byteLength);
  for (var i = 0;i < charCodes.length;i++) {
    charCodes[i] = bytes[i];
  }
  
  return String.fromCharCode.apply(null, charCodes);
};

/**
 * @private
 * @param {string} text
 * @return {!Object.<string,string>}
 */
wr.mvc.impl.FileDescriptorLoader.prototype._parseProperties = function(text) {
  var result = {};
  
  /* Remove leading whitespace from all lines */
  text = text.replace(/^[ \t\f]*(.*)$/gm, "$1");
  
  /* Join physical lines making up the same logical lines */
  text = text.replace(/^((?:.*[^\\])?(?:\\\\)*)\\(?:\r\n|[\r\n])/gm, "$1");
  
  /* Extract key and value from all non-blank, non-comment lines */
  var LINE_RE = /^[^\s#!].*$/gm;
  var LINE_PARTS_RE = /^(.*?[^\\])(?:[=:]\s*|\s+(?:[=:]\s*)?)(.+)?$/;
  var lineMatch, partsMatch, key, value;
  while (lineMatch = LINE_RE.exec(text)) {
    partsMatch = LINE_PARTS_RE.exec(lineMatch[0]);
    key = unescape(partsMatch[1]);
    value = unescape(partsMatch[2] || "");
    result[key] = value;
  }
  
  /* Function for unescaping keys and values */
  function unescape(s) {
    var ESCAPE_SEQUENCE_RE = /\\(u[0-9A-Fa-f]{4}|.)/g;
    return s.replace(ESCAPE_SEQUENCE_RE, function(sequence, value) {
      switch(value[0]) {
        case "u":
          return String.fromCharCode(parseInt(value.slice(1), 16));
        case "t":
          return "\t";
        case "n":
          return "\n";
        case "f":
          return "\f";
        case "r":
          return "\r";
        default:
          return value;
      }
    });
  }
  
  return result;
};

/** @override */
wr.mvc.impl.FileDescriptorLoader.prototype.loadServiceDescriptor = function(id) {
  return this._platform.readAppFile("services/" + id + ".json");
};




//== wr/mvc/impl/NgPlatform.js ================================================



/**
 * Constructs a new platform.
 * 
 * @constructor
 * @class WebRatio Runtime platform implementation based on services provided by Angular.js or, more broadly, by the present MVC
 *        library.
 * @implements wrm.Platform
 * @ngInject
 * @param {number} WRAPP_NETWORK_TIMEOUT
 * @param {!angular.$http} $http
 * @param {!wr.mvc.NotificationManager} wrNotificationManager
 * @param {!wr.mvc.l10n.LocalizationManager} wrLocalizationManager
 * @param {!wr.mvc.impl.Storage} wrStorage
 * @param {!wr.mvc.Logger} wrLogger
 */
wr.mvc.impl.NgPlatform = function(WRAPP_NETWORK_TIMEOUT, $http, wrNotificationManager, wrLocalizationManager, wrStorage, wrLogger) {
  
  /** @private */
  this._networkTimeout = WRAPP_NETWORK_TIMEOUT;
  
  /** @private */
  this._$http = $http;
  
  /** @private */
  this._notificationManager = wrNotificationManager;
  
  /** @private */
  this._localizationManager = wrLocalizationManager;
  
  /** @private */
  this._storage = wrStorage;
  
  /** @private */
  this._logger = wrLogger;
  
  /** @private */
  this._log = wrLogger.createLog("wr.mvc.impl.NgPlatform");
};
wr.mvc.impl.NgPlatform["$inject"] = ["WRAPP_NETWORK_TIMEOUT", "$http", "wrNotificationManager", "wrLocalizationManager", "wrStorage", "wrLogger"];

/** @override */
wr.mvc.impl.NgPlatform.prototype.getDeviceId = function() {
  return device.uuid;
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.getDeviceModel = function() {
  return device.model;
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.getDevicePlatform = function() {
  return device.platform;
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.getDevicePlatformVersion = function() {
  return device.version;
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.getWebEngineType = function() {
  return GLOBAL.navigator.userAgent;
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.createLog = function(category) {
  return this._logger.createLog.apply(this._logger, arguments);
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.retrieveDictionary = function(key) {
  return this._storage.getDictionary("mgr|" + key);
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.readAppFile = function(path, raw) {
  var thisPlatform = this;
  
  var httpFunction = (this._$http);
  var config = {method:"GET", url:path};
  if (raw) {
    config["responseType"] = "arraybuffer";
  }
  
  return httpFunction(config).then(function(response) {
    return thisPlatform._extractAppFileResult(response, raw);
  }, function(response) {
    switch(response.status) {
      case 404:
      ;
      case 500:
      ;
      case 0:
      ;
      case -1:
        return false;
    }
    throw new Error("Error loading file '" + path + "' - " + response.status + " (" + response.statusText + ")");
  });
};

/**
 * @private
 * @param {!angular.$http.Response} response
 * @param {boolean} raw
 * @return {*}
 */
wr.mvc.impl.NgPlatform.prototype._extractAppFileResult = function(response, raw) {
  var log = this._log;
  
  /* Start with the response data, as converted by $http */
  var data = response.data;
  
  /*
   * In raw mode, the result should be an ArrayBuffer. If it is not, this is probably caused by an incomplete support for XHR2 (known
   * to happen in WP8 Cordova). Since we are reading an APP FILE, transform the string into a buffer as a best-effort attempt. This
   * may cause some characters to be read incorrectly though.
   */
  if (typeof data === "string") {
    data = function(string) {
      var overflowed = false;
      var bytes = [];
      for (var i = 0;i < string.length;i++) {
        var b = string.charCodeAt(i);
        if (b > 255) {
          overflowed = true;
        }
        bytes.push(b);
      }
      if (overflowed) {
        log.warn("Possible encoding errors in last loaded app file");
      }
      return (new Uint8Array(bytes)).buffer;
    }(data);
  }
  
  return data;
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.makeHttpRequest = function(config) {
  var httpFunction = (this._$http);
  
  config = this._configureHttpRequest(config);
  return new Promise(function(resolve, reject) {
    httpFunction(config).then(resolve, reject);
  });
};

/**
 * @private
 * @param {!angular.$http.Config} config
 * @return {!angular.$http.Config}
 */
wr.mvc.impl.NgPlatform.prototype._configureHttpRequest = function(config) {
  
  /* Ensure to set a timeout and avoid an Angular bug (see #11143) */
  if (config.timeout === undefined) {
    config.timeout = this._networkTimeout;
  }
  
  return config;
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.getNotificationDeviceId = function() {
  return this._notificationManager.getDeviceId();
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.hasPendingNotifications = function() {
  return this._notificationManager.hasPendingNotifications();
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.addNotificationStatusListener = function(listener) {
  this._notificationManager.addSubscriptionListener(listener);
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.subscribeNotifications = function(name, handler) {
  var log = this._log;
  
  /* Function for passing a notification to the handler function */
  function doHandleNotification(notification) {
    handler({title:notification.getTitle(), message:notification.getMessage(), parameters:notification.getParameters()});
  }
  
  /* Unregister (this is for supporting warm restarts, only during testing) */
  if (DEBUG) {
    if (this._notificationManager.unregister(name)) {
      log.debug("Removed previous registration for '" + name + "'");
    }
  }
  
  /* Register */
  return this._notificationManager.register(name, function(notification) {
    
    /* Handle immediately of after accepting a feedback, depending on foreground/background */
    if (notification.isForeground()) {
      return wr.mvc.ui.showFeedback({"title":notification.getTitle(), "message":notification.getMessage()}, 7E3, {"Accept":function(params) {
        doHandleNotification(notification);
      }});
    } else {
      doHandleNotification(notification);
    }
  });
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.getCurrentLocale = function() {
  return this._localizationManager.getCurrentLocale();
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.getCurrentLocaleInfo = function() {
  return this._localizationManager.getLocaleInfo();
};

/** @override */
wr.mvc.impl.NgPlatform.prototype.overrideLocale = function(localeTag) {
  return this._localizationManager.overrideLocale(localeTag);
};




//== wr/mvc/managerFactory.js =================================================



/**
 * Factory for constructing instances of the WebRatio Mobile Runtime Manager, each one representing the business logic of a WebRatio
 * application.
 * 
 * @ngInject
 * @param {!wr.mvc.impl.NgPlatform} wrNgPlatform
 * @return {!wrm.core.Manager}
 */
wr.mvc.managerFactory = function(wrNgPlatform) {
  var desscriptorLoader = new wr.mvc.impl.FileDescriptorLoader(wrNgPlatform);
  return new wrm.core.Manager(desscriptorLoader, wrNgPlatform);
};
wr.mvc.managerFactory["$inject"] = ["wrNgPlatform"];




//== wr/mvc/ModelHelper.js ====================================================


/**
 * Constructs a new model helper service.
 * 
 * @constructor
 * @class Service supporting the abstraction of how two-way bindings are created with the application model.
 *        <p>
 *        Bindings are obtained by calling the factories of the service. All of them implement the {@link wr.mvc.ModelHelper.Binding}.
 * @ngInject
 * @param {!angular.$parse} $parse
 */
wr.mvc.ModelHelper = function($parse) {
  
  /** @private */
  this._$parse = $parse;
};
wr.mvc.ModelHelper["$inject"] = ["$parse"];

/**
 * Creates a new binding based upon a scope expression.
 * 
 * @template T
 * @param {!angular.Scope} scope Scope to which the expression refers.
 * @param {string} expression Angular expression string.
 * @return {!wr.mvc.ModelHelper.Binding.<T>} A binding object.
 */
wr.mvc.ModelHelper.prototype.createExpressionBinding = function(scope, expression) {
  return new wr.mvc.ModelHelper._ExpressionBinding(scope, expression, this._$parse(expression));
};

/**
 * Creates a new binding based on an Angular <code>ngModel</code> directive controller.
 * <p>
 * This is typically used to support the creation of custom form controls that integrate seamlessly with the <code>ngModel</code>
 * directive.
 * 
 * @template T
 * @param {!angular.Scope} scope Scope inside which the model controller is operating.
 * @param {!angular.NgModelController} modelCtrl A model controller instance.
 * @return {!wr.mvc.ModelHelper.Binding.<T>} A binding object.
 */
wr.mvc.ModelHelper.prototype.createModelControllerBinding = function(scope, modelCtrl) {
  return new wr.mvc.ModelHelper._ModelCtrlBinding(scope, modelCtrl);
};

/*
 * Binding interface
 */

/**
 * A model binding.
 * <p>
 * All bindings can be observed for changes by calling {@link #observe}. Some can also be changed by passing a new value to
 * {@link #assign}
 * 
 * @interface
 * @template T
 */
wr.mvc.ModelHelper.Binding = function() {
};

/**
 * Attaches an handler to this binding, in order to be notified of changes.
 * 
 * @param {function(T)} handler Handler that will get called whenever the value changes. The function argument is the new value. The
 *            context (<code>this</code>) is the Global Object.
 */
wr.mvc.ModelHelper.Binding.prototype.observe = ABSTRACT_METHOD;

/**
 * Determines whether new value can be assigned to this binding.
 * 
 * @return {boolean} <code>true</code> if assignable, <code>false</code> if not.
 */
wr.mvc.ModelHelper.Binding.prototype.isAssignable = ABSTRACT_METHOD;

/**
 * Assigns a new value to this binding.
 * 
 * @param {T} newValue New value to assign.
 * @see #isAssignable
 */
wr.mvc.ModelHelper.Binding.prototype.assign = ABSTRACT_METHOD;

/*
 * Expression binding
 */

/**
 * @private
 * @constructor
 * @implements wr.mvc.ModelHelper.Binding
 * @param {!angular.Scope} scope
 * @param {string} expression
 * @param {!angular.$parse.Expression} parsedExpression
 */
wr.mvc.ModelHelper._ExpressionBinding = function(scope, expression, parsedExpression) {
  
  /** @private */
  this._scope = scope;
  
  /** @private */
  this._expression = expression;
  
  /** @private */
  this._parsedExpression = parsedExpression;
};

/** @override */
wr.mvc.ModelHelper._ExpressionBinding.prototype.observe = function(handler) {
  this._scope.$watch(this._expression, handler);
};

/** @override */
wr.mvc.ModelHelper._ExpressionBinding.prototype.isAssignable = function() {
  return !!this._parsedExpression.assign;
};

/** @override */
wr.mvc.ModelHelper._ExpressionBinding.prototype.assign = function(newValue) {
  this._parsedExpression.assign(this._scope, newValue);
  wr.mvc.applyScope(this._scope);
};

/*
 * Model controller binding
 */

/**
 * @private
 * @constructor
 * @implements wr.mvc.ModelHelper.Binding
 * @param {!angular.Scope} scope
 * @param {!angular.NgModelController} modelCtrl
 */
wr.mvc.ModelHelper._ModelCtrlBinding = function(scope, modelCtrl) {
  
  /** @private */
  this._scope = scope;
  
  /** @private */
  this._modelCtrl = modelCtrl;
};

/** @override */
wr.mvc.ModelHelper._ModelCtrlBinding.prototype.observe = function(handler) {
  var modelCtrl = this._modelCtrl;
  modelCtrl.$render = function() {
    handler(modelCtrl.$viewValue);
  };
};

/** @override */
wr.mvc.ModelHelper._ModelCtrlBinding.prototype.isAssignable = function() {
  return true;
};

/** @override */
wr.mvc.ModelHelper._ModelCtrlBinding.prototype.assign = function(newValue) {
  var modelCtrl = this._modelCtrl;
  wr.mvc.applyScope(this._scope, function() {
    modelCtrl.$setViewValue(newValue);
    modelCtrl.$render();
  });
};




//== wr/mvc/ScreenController.js ===============================================


/**
 * Constructs a new controller instance.
 * 
 * @constructor
 * @class Controller used by the WebRatio <code>wrScreen</code> directive.
 *        <p>
 *        When attached to an HTML element, the controller uses the value of its <code>wrScreen</code> attribute as an id to retrieve a
 *        WebRatio Mobile Runtime panel. The panel is used as <i>primary</i> (together with its master panels) to support views inside
 *        the element.
 *        <p>
 *        <h3>Views</h3>
 *        <p>
 *        The screen controller manages the <i>view</i> objects for components of the attached panel. Each view is an object containing
 *        the data to be rendered by the component, in a format specific to each component. To obtain a view, call
 *        {@link #getComponentView}.
 *        <p>
 *        <h3>Events</h3>
 *        <p>
 *        The controller also enables template code to throw WebRatio <i>events</i> to be caught and handled by the injected
 *        {@linkplain wr.mvc.route.Router router}, which itself uses an instance of the WebRatio Mobile Runtime.
 * @ngInject
 * @param {!angular.JQLite} $element
 * @param {!angular.Attributes} $attrs
 * @param {!angular.Scope} $scope
 * @param {!wr.mvc.route.Router} wrRouter
 */
wr.mvc.ScreenController = function($element, $attrs, $scope, wrRouter) {
  var id = $attrs["wrScreen"];
  if (!id) {
    throw new Error("No screen id specified for wrScreen");
  }
  
  /** @private */
  this.id = id;
  
  /** @private */
  this._$scope = $scope;
  
  /** @private */
  this._router = wrRouter;
  
  /**
   * @private
   * @type {!Object.<string,!wrm.core.View>}
   */
  this._unscopedComponentViews = {};
};
wr.mvc.ScreenController["$inject"] = ["$element", "$attrs", "$scope", "wrRouter"];

/**
 * @package
 * @return {!wrm.core.FormInfo}
 */
wr.mvc.ScreenController.prototype.getFormInfo = function() {
  return this._router.getFormInfo(this.id);
};

/**
 * @package
 * @param {string} componentId
 * @param {!angular.Scope} scope
 * @return {!wrm.core.View}
 */
wr.mvc.ScreenController.prototype.retrieveComponentView = function(componentId, scope) {
  return this._retrieveComponentView(componentId, scope);
};

/**
 * Gets the <i>view object</i> belonging to a component of the attached panels.
 * <p>
 * The returned object is automatically bound to the screen element scope. Invoking the {@link wrm.core.RefreshableView#applyChanges}
 * method of the returned view will schedule a refresh of the bound Angular scope, effectively displaying changes on the template.
 * 
 * @param {string} componentId WebRatio identifier of the component.
 * @return {!wrm.core.View} A <i>view object</i>.
 */
wr.mvc.ScreenController.prototype.getComponentView = function(componentId) {
  var scope = this._$scope;
  var views = this._unscopedComponentViews;
  
  var view = views[componentId];
  if (!view) {
    view = this._retrieveComponentView(componentId, scope);
    views[componentId] = view;
    
    /* Remove view from cache when the scope is destroyed */
    var unsubscribeFn = scope.$on("$destroy", function() {
      unsubscribeFn();
      delete views[componentId];
    });
  }
  
  return view;
};

/**
 * @private
 * @param {string} componentId
 * @param {!angular.Scope} scope
 * @return {!wrm.core.View}
 */
wr.mvc.ScreenController.prototype._retrieveComponentView = function(componentId, scope) {
  var view = this._router.attachScope(this.id, componentId, scope);
  if (!view["componentId"]) {
    Object.defineProperty(view, "componentId", {value:componentId});
  }
  return view;
};

/**
 * @package
 * @param {string} componentId
 * @param {string} formPropertyName
 * @param {!angular.NgModelController} modelCtrl
 * @param {!angular.FormController} formCtrl
 * @return {function()}
 */
wr.mvc.ScreenController.prototype.attachModelController = function(componentId, formPropertyName, modelCtrl, formCtrl) {
  return this._router.attachModelController(this.id, componentId, formPropertyName, modelCtrl, formCtrl);
};

/**
 * @package
 * @param {string} componentId
 * @param {string=} propertyName
 * @return {?Promise.<boolean>}
 */
wr.mvc.ScreenController.prototype.validate = function(componentId, propertyName) {
  return this._router.validate(this.id, componentId, propertyName);
};

/**
 * Throws an event from within this screen to the WebRatio Mobile Runtime.
 * 
 * @param {?Event} $event The HTML event that initiated the throwing of the WebRatio event.
 * @param {string} type Type of WebRatio event to throw (e.g. <code>OnSelectEvent</code>).
 * @param {?string=} specifier Specifier for restricting the scope of the event or <code>null</code> for a generic event.
 * @param {!Object=} parameters Parameters to throw along with the event, specified as an object with values keyed by parameter name.
 *            If not specified, the event is thrown without any parameter.
 * @return {!Promise} Promise of catching the event and completing any resulting behavior in the application.
 */
wr.mvc.ScreenController.prototype.throwEvent = function($event, type, specifier, parameters) {
  if ($event) {
    this._shiftFocus($event);
  }
  return this._router.notifyUserEvent(type, specifier, parameters);
};

/**
 * @private
 * @param {!Event} $event
 */
wr.mvc.ScreenController.prototype._shiftFocus = function($event) {
  
  /* Determine whether the active element represents an ongoing focused task */
  var activeElement = $event.target.ownerDocument.activeElement;
  if (!activeElement || !/input|select|textarea|button|object/i.test(activeElement.tagName)) {
    return;
  }
  
  /* Check whether the event originated from the focused element */
  if ($event.target === activeElement) {
    return;
  }
  
  activeElement.blur();
};




//== wr/mvc/screenDirective.js ================================================



/**
 * Directive for designating a target HTML element as part of the visible interface of a WebRatio Screen and its Toolbars. This is
 * necessary in order to visualize the interface of view components enclosed in said containers.
 * <p>
 * The directive creates a new scope and binds it to the {@link wr.mvc.ScreenController} controller. The controller is also published
 * as a <code>screen</code> scope variable.
 * <p>
 * <h3>Usage</h3>
 * <p>
 * As an attribute.
 * 
 * 
 * <pre>
 * &lt;div wr-screen=&quot;screenId&quot;&gt;
 * ...
 * &lt;/div&gt;
 * </pre>
 * 
 * 
 * <p>
 * As a pair of comments.
 * 
 * 
 * <pre>
 * &lt;!-- directive: wr-screen screenId --&gt;
 * &lt;div&gt;
 * ...
 * &lt;/div&gt;
 * &lt;!-- end_directive: wr-screen --&gt;
 * </pre>
 * 
 * @return {!angular.Directive} Directive description object.
 */
wr.mvc.screenDirective = function() {
  return wr.mvc.enableCommentWrapping(({scope:true, controller:wr.mvc.ScreenController, controllerAs:"screen"}));
};




//== wr/mvc/Notification.js ===================================================


/**
 * Constructs a new notification.
 * 
 * @constructor
 * @class Information about a "typed" push notification, classified by means of a <i>name</i>.
 * @param {boolean} foreground <code>true</code> if received while on the foreground, <code>false</code> otherwise.
 * @param {string} title Short string containing the notification title.
 * @param {string} message Potentially long string containing the body of the message.
 * @param {!Object.<string,string>} parameters Object containing custom notification parameters keyed by their name.
 */
wr.mvc.Notification = function(foreground, title, message, parameters) {
  
  /** @private */
  this._foreground = foreground;
  
  /** @private */
  this._title = title;
  
  /** @private */
  this._message = message;
  
  /** @private */
  this._parameters = parameters;
};

/**
 * Determines whether this notification was received while on the foreground.
 * 
 * @return <code>true</code> if foreground, <code>false</code> otherwise.
 */
wr.mvc.Notification.prototype.isForeground = function() {
  return this._foreground;
};

/**
 * Gets the title of this notification.
 * 
 * @return A string, usually containing a short text.
 */
wr.mvc.Notification.prototype.getTitle = function() {
  return this._title;
};

/**
 * Gets the full message of this notification.
 * 
 * @return A string, usually longer than the title.
 */
wr.mvc.Notification.prototype.getMessage = function() {
  return this._message;
};

/**
 * Gets the custom parameters attached to this notification.
 * 
 * @return {!Object.<string,string>} An object containing custom parameter values keyed by their name.
 */
wr.mvc.Notification.prototype.getParameters = function() {
  return this._parameters;
};

/** @override */
wr.mvc.Notification.prototype.toString = function() {
  return "" + this._title + " (" + (this._foreground ? "foreground" : "background") + ")";
};




//== wr/mvc/NotificationManager.js ============================================



/**
 * Constructs a new notification manager service.
 * 
 * @constructor
 * @class Service enabling the receipt of <i>push notifications</i> from the cloud messaging network.
 *        <p>
 *        To be accepted, notifications must contain a special <code>wr-name</code> parameter, which acts as a kind of "type" of the
 *        notification. Further custom parameters may be added by prefixing their keys with <code>wr-p-</code>.
 *        <p>
 *        To register, call the {@link #register} method with an appropriate handler function. It is also possible to trigger
 *        "simulated" notifications manually by calling {@link #triggerNotification}.
 *        <p>
 *        The {@link #getDeviceId} method returns the current identifier of the device on the messaging network. That value is usually
 *        sent to the push server that is responsible for posting the notifications.
 * @ngInject
 * @param {?string} WRAPP_NOTIFICATIONS_SENDER_ID
 * @param {!wr.mvc.Logger} wrLogger
 */
wr.mvc.NotificationManager = function(WRAPP_NOTIFICATIONS_SENDER_ID, wrLogger) {
  
  /** @private */
  this._senderId = WRAPP_NOTIFICATIONS_SENDER_ID;
  
  /**
   * @private
   * @type {?string}
   */
  this._deviceId = null;
  
  /**
   * @private
   * @type {?Promise}
   */
  this._subscribePromise = null;
  
  /**
   * @private
   * @type {!wrm.util.ListenerList<?string>}
   */
  this._subscriptionListeners = new wrm.util.ListenerList;
  
  /**
   * @private
   * @type {!Object.<string,function(!wr.mvc.Notification):(!Promise|undefined)>}
   */
  this._handlers = {};
  
  /**
   * @private
   * @type {?Object.<string,!Array.<{notification:!wr.mvc.Notification,resolve:function(),reject:function(!Error)}>>}
   */
  this._queues = {};
  
  /** @private */
  this._log = wrLogger.createLog("wr.mvc.NotificationManager");
  
  /* Start a timer for stopping to queue notifications */
  GLOBAL.setTimeout(this._stopQueuing.bind(this), wr.mvc.NotificationManager._INITIAL_HOLD_TIME);
};
wr.mvc.NotificationManager["$inject"] = ["WRAPP_NOTIFICATIONS_SENDER_ID", "wrLogger"];

/**
 * @private
 * @const
 * @type {number}
 */
wr.mvc.NotificationManager._INITIAL_HOLD_TIME = 6E4;

/**
 * Prefix of all business parameters carried in the notification payloads. The remaining part of the key is considered to be the name
 * of the business parameter.
 * 
 * @const
 * @type {string}
 */
wr.mvc.NotificationManager.PARAMETER_PREFIX = "wr-";

/**
 * Prefix of business parameters that represent <i>custom</i> parameters. The remaining part of the key is considered to be the name of
 * the custom parameter.
 * 
 * @const
 * @type {string}
 */
wr.mvc.NotificationManager.CUSTOM_PARAMETER_PREFIX = "p-";

/**
 * Gets the identifier assigned to the running device for the purpose of receiving push notifications.
 * <p>
 * The identifier changes whenever the subscription to the messaging network changes. Use {@link #addSubscriptionListener} for
 * listening to subscription changes.
 * 
 * @return {!Promise.<?string>} The id, as a string, or <code>null</code> if not currently registered.
 * @see #addSubscriptionListener
 */
wr.mvc.NotificationManager.prototype.getDeviceId = function() {
  var deviceId = this._deviceId;
  if (deviceId && deviceId.indexOf("private:") === 0) {
    deviceId = null;
  }
  return Promise.resolve(deviceId);
};

/**
 * @private
 * @param {?string} deviceId
 */
wr.mvc.NotificationManager.prototype._setDeviceId = function(deviceId) {
  this._deviceId = deviceId;
  this._notifySubscriptionListeners();
};

/**
 * Adds a listener to be notified whenever the subscription to the messaging network changes.
 * 
 * @param {function(?string)} listener Function to be notified. The only parameter is the new current device identifier. The context
 *            (<code>this</code>) is the Global Object.
 * @see #removeSubscriptionListener
 * @see #getDeviceId
 */
wr.mvc.NotificationManager.prototype.addSubscriptionListener = function(listener) {
  this._subscriptionListeners.add(listener);
};

/**
 * Removes a subscription listener previously registered with {@link #addSubscriptionListener}.
 * 
 * @param {function(?string)} listener Listener function to remove.
 * @see #addSubscriptionListener
 */
wr.mvc.NotificationManager.prototype.removeSubscriptionListener = function(listener) {
  this._subscriptionListeners.remove(listener);
};

/**
 * @private
 * @return {undefined}
 */
wr.mvc.NotificationManager.prototype._notifySubscriptionListeners = function() {
  this._subscriptionListeners.notifyAll(this._deviceId);
};

/**
 * Determines whether there is at least one push notification waiting to be handled. Pending notifications are handled just after
 * {@link #register} is called.
 * 
 * @return {!Promise.<boolean>} <code>true</code> if there are pending notifications, <code>false</code> otherwise.
 */
wr.mvc.NotificationManager.prototype.hasPendingNotifications = function() {
  return new Promise(function(resolve, reject) {
    return GLOBAL.PushNotification.hasColdStartNotification(function(stringFlag) {
      resolve(stringFlag === true);
    }, function(errorMessage) {
      reject(new Error(errorMessage));
    });
  });
};

/*
 * Subscription/registration
 */

/**
 * Registers for receiving push notification.
 * <p>
 * If there are pending notifications, received prior of registering, the will be passed to the handler as soon as the registration is
 * complete.
 * <p>
 * If the application is not subscribed to the messaging network, it will initiate a new subscription process. The returned promise of
 * this method will not wait for such subscription to complete, and things like the device identifier may not be immediately available.
 * Use {@link #addSubscriptionListener} to be notified about subscription changes.
 * 
 * @param {string} name Name of the push notification to register for.
 * @param {function(!wr.mvc.Notification):(!Promise|undefined)} handler Handler function to invoke upon receiving each notification.
 *            The only parameter is a {@linkplain wr.mvc.Notification notification}. The returned value may be <code>undefined</code>
 *            or a promise, whose value is ignored, of completing the handling procedure. The context (<code>this</code>) is the Global
 *            Object.
 * @return {!Promise} Promise of completing the registration.
 * @see #addSubscriptionListener
 * @see #unregister
 */
wr.mvc.NotificationManager.prototype.register = function(name, handler) {
  var thisNotificationManager = this;
  var handlers = this._handlers;
  
  return Promise.resolve().then(function() {
    return thisNotificationManager._ensureSubscribed(false);
  }).then(function() {
    if (handlers[name]) {
      throw new Error("Handler already registered for '" + name + "' notifications");
    }
    handlers[name] = handler;
    thisNotificationManager._dumpQueue(name);
  });
};

/**
 * Unregisters from receiving push notifications.
 * <p>
 * The method removes the handled ass by a previous call to {@link #register} for the same notification name. If never registered for
 * the name, nothing happens.
 * 
 * @param {string} name Name of the push notification from which to unregister.
 * @return {boolean} <code>true</code> if there was an handler registered, <code>false</code> if not.
 * @see #register
 */
wr.mvc.NotificationManager.prototype.unregister = function(name) {
  var handlers = this._handlers;
  if (handlers.hasOwnProperty(name)) {
    delete handlers[name];
    return true;
  }
  return false;
};

/**
 * @private
 * @param {boolean} waitForDeviceId
 * @return {!Promise}
 */
wr.mvc.NotificationManager.prototype._ensureSubscribed = function(waitForDeviceId) {
  
  /* Reuse the last promise (already registered or registering in the same session) */
  if (this._subscribePromise) {
    return this._subscribePromise;
  }
  
  /* Listen for device id and set it when available */
  var deviceIdAdapter = wrm.util.newPromiseCallbackAdapter();
  var deviceIdPromise = deviceIdAdapter.promise.then(this._setDeviceId.bind(this));
  
  /* Subscribe in different ways depending on the platform (new registration) */
  var subscribePromise = this._subscribeDevice(this._handleRawNotification.bind(this), deviceIdAdapter.callback, this._createInitializationOptions());
  this._subscribePromise = subscribePromise;
  
  /* Make the caller wait for subscription and OPTIONALLY for device id */
  if (waitForDeviceId) {
    return Promise.all([subscribePromise, deviceIdPromise]);
  }
  return subscribePromise;
};

/**
 * @private
 * @return {!PushNotification.Options}
 */
wr.mvc.NotificationManager.prototype._createInitializationOptions = function() {
  var options = {};
  switch(wr.mvc.getPlatform()) {
    case wr.mvc.Platform.ANDROID:
      var senderId = this._senderId;
      /* A sender id is required */
      if (!senderId) {
        throw new Error("Notification sender id not available");
      }
      options.android = {senderID:senderId};
      break;
    case wr.mvc.Platform.IOS:
      options.ios = {alert:true, badge:true, sound:true};
      break;
    case wr.mvc.Platform.WINDOWS:
      options.windows = {silentForeground:true};
      break;
    default:
      throw new Error("Unsupported platform " + wr.mvc.getPlatform());;
  }
  return options;
};

/**
 * @private
 * @param {function(!wr.mvc.NotificationManager._RawNotification)} handler
 * @param {function(?string)} deviceIdCallback
 * @param {!PushNotification.Options} options
 * @return {!Promise}
 */
wr.mvc.NotificationManager.prototype._subscribeDevice = function(handler, deviceIdCallback, options) {
  var NotificationManager = wr.mvc.NotificationManager;
  var Mode = NotificationManager._Mode;
  var Notification = NotificationManager._RawNotification;
  var log = this._log;
  
  return new Promise(function(resolve, reject) {
    
    /* Register with the messaging network */
    var pushNotificationObject = GLOBAL.PushNotification.init(options);
    log.debug("Sent registration request");
    
    pushNotificationObject.on("registration", function(data) {
      log.debug("Received registration");
      deviceIdCallback(data.registrationId);
    });
    
    pushNotificationObject.on("notification", function(data) {
      log.debug("Received message");
      var additionalData = data.additionalData;
      var mode;
      if (additionalData.foreground) {
        mode = Mode.INLINE;
      } else {
        if (additionalData.coldstart) {
          mode = Mode.COLDSTART;
        } else {
          mode = Mode.BACKGROUND;
        }
      }
      var nTitle = NotificationManager._extractOptionalString(data.title);
      var nMessage = NotificationManager._extractOptionalString(data.message);
      var nPayload = NotificationManager._extractPayload(additionalData);
      handler(new Notification(mode, nTitle, nMessage, nPayload));
    });
    
    pushNotificationObject.on("error", function(e) {
      if (e.message === PushNotification.ErrorCode.NOTALLOWED) {
        deviceIdCallback(null);
        return;
      }
      log.error("Received error: ", e);
    });
    resolve();
    
  });
};

/**
 * @private
 * @param {string|undefined} string
 * @return {string}
 */
wr.mvc.NotificationManager._extractOptionalString = function(string) {
  return string || "";
};

/**
 * @private
 * @param {!Object} object
 * @return {!Object}
 */
wr.mvc.NotificationManager._extractPayload = function(object) {
  var PREFIX = wr.mvc.NotificationManager.PARAMETER_PREFIX;
  var result = {};
  Object.keys(object).forEach(function(key) {
    if (key.indexOf(PREFIX) === 0) {
      result[key.substring(PREFIX.length)] = object[key];
    }
  });
  return result;
};

/*
 * Triggering and queuing
 */

/**
 * @private
 * @param {!wr.mvc.NotificationManager._RawNotification} rawNotification
 */
wr.mvc.NotificationManager.prototype._handleRawNotification = function(rawNotification) {
  var PARAM_PREFIX = wr.mvc.NotificationManager.CUSTOM_PARAMETER_PREFIX;
  var Mode = wr.mvc.NotificationManager._Mode;
  var Notification = wr.mvc.Notification;
  var log = this._log;
  
  /* Extract Manager notification name and parameters */
  var payload = rawNotification.payload;
  var name = payload["name"];
  var params = {};
  Object.keys(payload).forEach(function(key) {
    if (key.indexOf(PARAM_PREFIX) === 0) {
      params[key.substring(PARAM_PREFIX.length)] = payload[key];
    }
  });
  if (!name) {
    log.warn("Ignoring foreign notification", rawNotification);
    return;
  }
  
  /* Trigger the notification asynchronously (not returning the promise on purpose!) */
  var foreground = rawNotification.mode === Mode.INLINE;
  var notification = new Notification(foreground, rawNotification.title, rawNotification.message, params);
  this.triggerNotification(name, notification);
};

/**
 * Triggers the receipt of a notification, causing the associated handler to be called.
 * 
 * @param {string} name Name for classifying the "type" of notification.
 * @param {!wr.mvc.Notification} notification Notification to trigger.
 * @return {!Promise} Promise of handling the notification.
 */
wr.mvc.NotificationManager.prototype.triggerNotification = function(name, notification) {
  var thisNotificationManager = this;
  var handlers = this._handlers;
  var queues = this._queues;
  
  /* First retrieve the handler; if not available but still "holding", put the notification in queue */
  var handler = handlers[name];
  if (!handler && !!queues) {
    var queue = queues[name];
    if (!queue) {
      queues[name] = queue = [];
    }
    return new Promise(function(resolve, reject) {
      queue.push({notification:notification, resolve:resolve, reject:reject});
    });
  }
  
  /* Trigger immediately */
  return new Promise(function(resolve, reject) {
    thisNotificationManager._doTriggerNotification(name, notification, resolve, reject);
  });
};

/**
 * @private
 * @param {string} name
 * @param {!wr.mvc.Notification} notification
 * @param {function(?)} resolve
 * @param {function(!Error)} reject
 */
wr.mvc.NotificationManager.prototype._doTriggerNotification = function(name, notification, resolve, reject) {
  var log = this._log;
  
  log.debug("Received", name, "notification:", notification);
  
  /* Notify the handler */
  var handler = this._handlers[name];
  if (!handler) {
    log.debug("No handler registered: ignoring");
    resolve(undefined);
  } else {
    resolve(Promise.resolve().then(function() {
      return handler(notification);
    }));
  }
};

/**
 * @private
 * @param {string} name
 * @return {undefined}
 */
wr.mvc.NotificationManager.prototype._dumpQueue = function(name) {
  var thisNotificationManager = this;
  var queues = this._queues;
  
  /* Retrieve (and delete) the queue to dump */
  var queue = queues && queues[name];
  if (!queue) {
    return;
  }
  delete queues[name];
  
  /* Force the asynchronous triggering of each notification */
  queue.forEach(function(queuedNotification) {
    GLOBAL.setTimeout(function() {
      thisNotificationManager._doTriggerNotification(name, queuedNotification.notification, queuedNotification.resolve, queuedNotification.reject);
    }, 0);
  });
};

/**
 * @private
 * @return {undefined}
 */
wr.mvc.NotificationManager.prototype._stopQueuing = function() {
  if (!this._queues) {
    return;
  }
  
  /* Dump all queues */
  Object.keys(this._queues).forEach(this._dumpQueue, this);
  
  this._queues = null;
};

/*
 * Raw notification object
 */

/**
 * @private
 * @enum {string}
 */
wr.mvc.NotificationManager._Mode = {COLDSTART:"COLDSTART", BACKGROUND:"BACKGROUND", INLINE:"INLINE"};

/**
 * @private
 * @constructor
 * @param {wr.mvc.NotificationManager._Mode} mode
 * @param {string} title
 * @param {string} message
 * @param {!Object} payload
 */
wr.mvc.NotificationManager._RawNotification = function(mode, title, message, payload) {
  this.mode = mode;
  this.title = title;
  this.message = message;
  this.payload = payload;
};

/** @override */
wr.mvc.NotificationManager._RawNotification.prototype.toString = function() {
  return "" + this.mode + " notification { title: " + this.title + ", message: " + this.message + ", payload: " + JSON.stringify(this.payload) + "}";
};




//== wr/mvc/viewDirective.js ==================================================



/**
 * Directive for showing the contents of the <i>view</i> associated to the current Angular <code>$route</code> route.
 * <p>
 * This directive is meant to be a replacement of the stock <code>ngView</code> directive.<br>
 * In addition to all the <code>ngView</code> features, it supports multiple animations and full caching of the expanded view DOMs and
 * their data.
 * <p>
 * This documentation only highlights the additional features. See the documentation of <code>ngView</code> for more information.
 * <p>
 * <h3>Animations</h3>
 * <p>
 * The views that enter and leave the screen are automatically decorated with CSS classes that can be used for deciding how to
 * show/hide them and how to animate the transition.
 * <ul>
 * <li><code>wr-view-present</code> when visible and interactive.
 * <li><code>wr-view-enter wr-view-switch-TYPE</code> when about to enter the screen.
 * <li><code>wr-view-enter wr-view-enter-active wr-view-switch-TYPE</code> when entering the screen.
 * <li><code>wr-view-leave wr-view-switch-TYPE</code> when about to leave the screen.
 * <li><code>wr-view-leave wr-view-leave-active wr-view-switch-TYPE</code> when leaving the screen.
 * <li><code>wr-view-away</code> when cached but not visible.
 * </ul>
 * The possible switch types (for the <code>TYPE</code> placeholder in the above example) are <b><code>forward</code></b>,
 * <b><code>backward</code></b> and <b><code>none</code></b>.
 * <p>
 * <h3>View Caching</h3>
 * <p>
 * When a view is switched out, it is detached from the document and stored away. The scope subtree associated with the detached DOM is
 * also disconnected, so that no watchers are run and no events are emitted/broadcast to the disconnected scopes. At the time of
 * re-entering the same view, the disconnected DOM and scope are attached again and reused. This improves performance and also has the
 * benefit of preserving scroll offsets and other graphical states.
 * <p>
 * It is important to note that <b>controllers are reused</b> when re-connecting a cached view. That means controller construction and
 * <code>$destroy</code> events are not guaranteed to occur each time a view enters or leaves the UI. If a directive or controller
 * needs to detect visual view enter/leave, it may do so by listening for the <b><code>wrViewEntering</code></b> and
 * <b><code>wrViewLeaving</code></b> events that are broadcast by this directive to the scope that is being switched in/out of the UI.
 * <p>
 * The meaning of a <i>re-entering</i> view is dictated by the WebRatio MVC router. For instance, it is not guaranteed that navigating
 * inside the same screen corresponds to navigating <i>back</i> into it. The concept is more closely related to the <i>backwards
 * navigation</i> that is possible in many applications.
 * <p>
 * The disconnected views <i>may be destroyed</i> before being reused, for example to save memory. In that case, a new view would be
 * created at the time of re-entering.
 * <p>
 * <h3>Usage</h3>
 * <p>
 * As an element.
 * 
 * 
 * <pre>
 * &lt;wr-view&gt;
 * ...
 * &lt;/wr-view&gt;
 * </pre>
 * 
 * 
 * <p>
 * As an attribute.
 * 
 * 
 * <pre>
 * &lt;div wr-view&gt;
 * ...
 * &lt;/div&gt;
 * </pre>
 * 
 * @ngInject
 * @param {!angular.$route} $route
 * @param {!angular.$anchorScroll} $anchorScroll
 * @param {!angular.$animate} $animate
 * @param {!wr.mvc.Logger} wrLogger
 * @return {!angular.Directive} Directive description object.
 */
wr.mvc.viewDirective = function($route, $anchorScroll, $animate, wrLogger) {
  
  /*
   * This directive is heavily inspired by the default Angular ngView directive and is meant to be a drop-in replacement to that.
   */
  
  /** @const */
  var PRESENT_CLASS_NAME = "wr-view-present";
  /** @const */
  var AWAY_CLASS_NAME = "wr-view-away";
  /** @const */
  var ENTER_CLASS_NAME = "wr-view-enter";
  /** @const */
  var LEAVE_CLASS_NAME = "wr-view-leave";
  /** @const */
  var SWITCH_CLASS_NAME_PREFIX = "wr-switch-";
  
  /** @const */
  var TRANSITIONEND_EVENTS = "transitionend webkitTransitionEnd";
  
  var log = wrLogger.createLog("wr.mvc.viewDirective");
  var transientRenderingProvider = wr.mvc.route.Router.createTransientRenderingProvider(log);
  var defaultSwitchInfo = new wr.mvc.route.ScreenSwitchInfo("none");
  
  return ({restrict:"ECA", terminal:true, priority:400, transclude:"element", link:function(scope, element, attrs, ctrl, transclude) {
    var currentRendering = null;
    var previousLeaveAnimation = null;
    var autoScrollExp = attrs["autoscroll"];
    var onloadExp = attrs["onload"] || "";
    
    /**
     * Function for switching out the current rendering element with an animation.
     * 
     * @param {string} switchClassName
     */
    function cleanupLastView(switchClassName) {
      if (previousLeaveAnimation) {
        previousLeaveAnimation["cancel"]();
        previousLeaveAnimation = null;
      }
      
      if (currentRendering) {
        currentRendering.release(function(rendering) {
          rendering.getScope().$broadcast("wrViewLeaving");
          previousLeaveAnimation = animate(rendering.getElement(), {initialParkingClassName:PRESENT_CLASS_NAME, className:LEAVE_CLASS_NAME, switchClassName:switchClassName, finalParkingClassName:AWAY_CLASS_NAME});
          previousLeaveAnimation.then(function() {
            previousLeaveAnimation = null;
          });
        });
        currentRendering = null;
      }
    }
    
    /**
     * Function for updating the current rendering element with a new one compatible with the route. The new element is also
     * switched in with an animation.
     */
    function update() {
      var locals = $route.current && $route.current.locals;
      var template = locals && locals["$template"];
      var renderingProvider = (locals && locals["wrRenderingProvider"]) || transientRenderingProvider;
      var switchInfo = (locals && locals["wrSwitchInfo"]) || defaultSwitchInfo;
      
      var switchClassName = SWITCH_CLASS_NAME_PREFIX + switchInfo.getDirection();
      
      if (angular.isDefined(template)) {
        var newRendering = renderingProvider.retrieve(function(rendering) {
          rendering.getScope().$broadcast("wrViewEntering");
          var parentElement = currentRendering ? currentRendering.getElement() : element;
          var renderingElement = rendering.getElement();
          var oldAnimateEnabled = $animate.enabled();
          $animate.enabled(false);
          animate(renderingElement, {domSetup:function() {
            if (!renderingElement[0].parentNode) {
              parentElement.after(renderingElement);
            }
          }, initialParkingClassName:AWAY_CLASS_NAME, className:ENTER_CLASS_NAME, switchClassName:switchClassName, finalParkingClassName:PRESENT_CLASS_NAME}).then(function() {
            $animate.enabled(oldAnimateEnabled);
            if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
              $anchorScroll();
            }
          });
          cleanupLastView(switchClassName);
        }, function(create) {
          var newScope = scope.$new();
          /*
           * Note: This will also link all children of ng-view that were contained in the original html. If that content
           * contains controllers, ... they could pollute/change the scope. However, using ng-view on an element with
           * additional content does not make sense... Note: We can't remove them in the cloneAttchFn of transclude as
           * that function is called before linking the content, which would apply child directives to non existing
           * elements.
           */
          transclude(newScope, function(clone) {
            create({scope:newScope, element:clone});
          });
        });
        
        currentRendering = newRendering;
        var newScope = newRendering.getScope();
        $route.current.scope = newScope;
        newScope.$emit("$viewContentLoaded");
        newScope.$eval(onloadExp);
      } else {
        cleanupLastView(switchClassName);
      }
    }
    
    /**
     * @param {!angular.JQLite} element
     * @param {{domSetup:(function()|undefined), initialParkingClassName:(string|undefined), className:string,
     *            switchClassName:string, finalParkingClassName:(string|undefined)}} options
     * @return {!Promise}
     */
    function animate(element, options) {
      var resolveFn = null;
      var finished = false;
      
      /* Function that begins the animation */
      function beginFn() {
        if (!finished) {
          if (options.domSetup) {
            options.domSetup();
          }
          element.addClass(options.className).addClass(options.switchClassName);
          if (options.initialParkingClassName) {
            element.removeClass(options.initialParkingClassName);
          }
        }
      }
      
      /* Function that makes the animation active */
      function activateFn(callback) {
        applyTransition(element, options.className + "-active", callback);
      }
      
      /* Function that concludes the animation */
      function finishFn() {
        if (!finished) {
          finished = true;
          if (options.finalParkingClassName) {
            element.addClass(options.finalParkingClassName);
          }
          element.removeClass(options.className + " " + options.switchClassName + " " + options.className + "-active");
          if (resolveFn) {
            resolveFn();
          }
        }
      }
      
      var promise = new Promise(function(resolve) {
        resolveFn = resolve;
        scheduleFrame(function() {
          beginFn();
          scheduleFrame(function() {
            activateFn(finishFn);
          });
        });
      });
      promise["cancel"] = finishFn;
      return promise;
    }
    
    /**
     * @param {!angular.JQLite} element
     * @param {string} className
     * @param {function()} callback
     */
    function applyTransition(element, className, callback) {
      element.addClass(className);
      var startTime = (new Date).valueOf();
      
      scheduleFrame(function() {
        var timing = getAnimationTiming(element);
        if (timing.duration === 0) {
          callback();
          return;
        }
        var finished = false;
        
        function onTransitionEnd(event) {
          event.stopPropagation();
          event = event["originalEvent"] || event;
          var timeStamp = event.timeStamp || (new Date).valueOf();
          var elapsedTime = parseFloat(event.elapsedTime.toFixed(3));
          if (Math.max(timeStamp - startTime, 0) >= timing.delay && elapsedTime >= timing.duration) {
            finishTransition();
          }
        }
        
        function finishTransition() {
          if (finished) {
            return;
          }
          finished = true;
          element.off(TRANSITIONEND_EVENTS, onTransitionEnd);
          if (timeoutHandle) {
            GLOBAL.clearTimeout(timeoutHandle);
          }
          callback();
        }
        
        element.on(TRANSITIONEND_EVENTS, onTransitionEnd);
        var timeoutHandle = GLOBAL.setTimeout(finishTransition, timing.duration);
      });
    }
    
    /**
     * @param {!angular.JQLite} element
     * @return {{duration:number, delay:number}}
     */
    function getAnimationTiming(element) {
      var style = GLOBAL.getComputedStyle(element[0]) || {};
      
      function parseMaxTime(timesListStr) {
        var maxValue = 0;
        var timeStrs = typeof timesListStr === "string" ? timesListStr.split(/\s*,\s*/) : [];
        for (var i = 0;i < timeStrs.length;i++) {
          maxValue = Math.max(parseFloat(timeStrs[i]) || 0, maxValue);
        }
        return maxValue;
      }
      
      return {duration:parseMaxTime(style["transition-duration"] || style["-webkit-transition-duration"]) * 1E3, delay:parseMaxTime(style["transition-delay"] || style["-webkit-transition-delay"]) * 1E3};
    }
    
    /**
     * @param {function()} callback
     * @return {number}
     */
    var scheduleFrame = function(callback) {
      var requestAnimationFrame = GLOBAL.requestAnimationFrame || GLOBAL["webkitRequestAnimationFrame"];
      
      /* Choose the best implementation */
      var impl;
      if (typeof requestAnimationFrame === "function") {
        
        /* Implementation based on the standard requestAnimationFrame */
        impl = function(callback) {
          return requestAnimationFrame.call(GLOBAL, callback);
        };
        
      } else {
        
        /* Implementation based on timeouts assuming 60fps */
        impl = function(callback) {
          return GLOBAL.setTimeout(callback, 16);
        };
        
      }
      
      scheduleFrame = impl;
      return impl(callback);
    };
    
    scope.$on("$routeChangeSuccess", update);
    update();
  }});
};
wr.mvc.viewDirective["$inject"] = ["$route", "$anchorScroll", "$animate", "wrLogger"];

/**
 * @internal
 * @ngInject
 * @param {!angular.$compile} $compile
 * @param {!angular.$controller} $controller
 * @param {!angular.$route} $route
 * @return {!angular.Directive}
 */
wr.mvc.viewDirective.auxiliaryDirective = function($compile, $controller, $route) {
  
  /*
   * This directive is called during the 'transclude' call of the main `wrView` directive. It will replace and compile the content of
   * the element with the loaded template. We need this directive so that the element content is already filled when the link
   * function of another directive on the same element as wrView is called. Note that IT IS NOT CALLED the rendering provider
   * supplies an existing rendering.
   */
  
  return ({restrict:"ECA", priority:-400, link:function(scope, element) {
    var current = $route.current;
    var locals = current.locals;
    
    element.html((locals["$template"]));
    var elementLink = $compile(element.contents());
    
    if (current.controller) {
      locals["$scope"] = scope;
      var controller = $controller(current.controller, locals);
      if (current.controllerAs) {
        scope[current.controllerAs] = controller;
      }
      element.data("$ngControllerController", controller);
      element.children().data("$ngControllerController", controller);
    }
    
    elementLink(scope);
  }});
};
wr.mvc.viewDirective.auxiliaryDirective["$inject"] = ["$compile", "$controller", "$route"];




//== wr/mvc/impl/Storage.js ===================================================


/**
 * Constructs a new storage service.
 * 
 * @constructor
 * @class Service providing storage across application runs.
 *        <p>
 *        The storage is exposed as a series of segregated <i>dictionaries</i>, each implementing a key-value store. Keys and values
 *        are restricted to be strings, so other data types must be serialized and deserialized in order to be stored.
 * @ngInject
 * @param {string} WRAPP_STORAGE_PREFIX
 */
wr.mvc.impl.Storage = function(WRAPP_STORAGE_PREFIX) {
  
  /** @private */
  this._prefix = WRAPP_STORAGE_PREFIX;
  
  /**
   * @private
   * @type {wr.mvc.impl.Storage._LocalStorage}
   */
  this._localStorage = GLOBAL["localStorage"];
  
  if (!this._localStorage) {
    throw new Error("Local storage not supported");
  }
};
wr.mvc.impl.Storage["$inject"] = ["WRAPP_STORAGE_PREFIX"];

/**
 * @typedef {{length:number, key:(function(number):?string), getItem:(function(string):string), setItem:function(string, string),
 *          removeItem:function(string)}}
 */
wr.mvc.impl.Storage._LocalStorage;

/**
 * Retrieves the storage dictionary identified by the specified key.
 * 
 * @param {string} key Key of the dictionary to retrieve.
 * @return {!wrm.data.Dictionary} A dictionary, containing all previous data and ready for operation.
 */
wr.mvc.impl.Storage.prototype.getDictionary = function(key) {
  return new wr.mvc.impl.Storage.Dictionary(this._localStorage, this._prefix + key + "|");
};

/**
 * Remove all dictionaries.
 */
wr.mvc.impl.Storage.prototype.clearAllDictionaries = function() {
  var keys = [];
  for (var i = 0;i < this._localStorage.length;i++) {
    var key = this._localStorage.key(i);
    if (key.indexOf(this._prefix) === 0) {
      keys.push(key);
    }
  }
  keys.forEach(function(key) {
    this._localStorage.removeItem(key);
  }, this);
};

/*
 * Dictionary
 */

/**
 * @private
 * @constructor
 * @implements wrm.data.Dictionary
 * @param {wr.mvc.impl.Storage._LocalStorage} localStorage
 * @param {string} keyPrefix
 */
wr.mvc.impl.Storage.Dictionary = function(localStorage, keyPrefix) {
  
  /** @private */
  this._localStorage = localStorage;
  
  /** @private */
  this._keyPrefix = keyPrefix;
};

/** @override */
wr.mvc.impl.Storage.Dictionary.prototype.getKeys = function() {
  var result = [];
  var keyCount = this._localStorage.length;
  for (var i = 0;i < keyCount;i++) {
    var key = this._localStorage.key(i);
    if (key.indexOf(this._keyPrefix) === 0) {
      result.push(key.substring(this._keyPrefix.length));
    }
  }
  return result;
};

/** @override */
wr.mvc.impl.Storage.Dictionary.prototype.get = function(key) {
  var value = this._localStorage.getItem(this._keyPrefix + key);
  return value !== null && value !== undefined ? value : null;
};

/** @override */
wr.mvc.impl.Storage.Dictionary.prototype.set = function(key, value) {
  this._localStorage.setItem(this._keyPrefix + key, value);
};

/** @override */
wr.mvc.impl.Storage.Dictionary.prototype.remove = function(key) {
  this._localStorage.removeItem(this._keyPrefix + key);
};

/** @override */
wr.mvc.impl.Storage.Dictionary.prototype.clear = function() {
  this.getKeys().forEach(function(key) {
    this.remove(key);
  }, this);
};




//== wr/mvc/l10n/localizeFilter.js ============================================


/**
 * Filter for getting the localized version of a message, as provided by the WebRatio Mobile Runtime.
 * <p>
 * The string to filter may be a meaningful message in a default language, or an internationalized key not intended for display. In any
 * case, the string is interpreted as a key and used for looking up a localized message. The actual lookup is performed by the WebRatio
 * Mobile Runtime, invoked through the {@linkplain wr.mvc.route.Router router service}.
 * <p>
 * <h3>Usage</h3>
 * <p>
 * 
 * 
 * <pre>
 * &lt;button&gt;{{ 'BUTTON_LABEL' | wr-localize }}&lt;/button&gt;
 * </pre>
 * 
 * @ngInject
 * @param {!wr.mvc.l10n.LocalizationManager} wrLocalizationManager
 * @return {function(string):string} A filter function, accepting a key and returning a localized message.
 */
wr.mvc.l10n.localizeFilter = function(wrLocalizationManager) {
  function filter(key) {
    if (wrLocalizationManager.isInitialized()) {
      return wrLocalizationManager.formatMessage(key);
    }
    return key;
  }
  
  /* This filter has to be stateful to respond to changes in the application locale */
  filter["$stateful"] = true;
  
  return filter;
};
wr.mvc.l10n.localizeFilter["$inject"] = ["wrLocalizationManager"];




//== wr/mvc/App.js ============================================================



/**
 * Module implementing the MVC layer of a WebRatio application.
 * <p>
 * Requires the following modules:
 * <ul>
 * <li>a custom <code>wr.mvc.App.CONFIG</code> module, providing configuration values;
 * <li>the Angular <code>ngRoute</code> module.
 * </ul>
 * 
 * @type {!angular.Module}
 */
wr.mvc.App = function() {
  var module = angular.module("wr.mvc.App", ["wr.mvc.App.CONFIG", "ngRoute"]);
  
  /* Configuration functions */
  angular.forEach(wr.mvc.AppConfig, function(configFunction) {
    module.config(configFunction);
  });
  
  /* Run functions */
  angular.forEach(wr.mvc.AppRun, function(runFunction) {
    module.run(runFunction);
  });
  
  /* Directives */
  module.directive("wrComponent", wr.mvc.componentDirective);
  module.directive("wrBlob", wr.mvc.blobDirective);
  module.directive("wrEval", wr.mvc.evalDirective);
  module.directive("wrFeedback", wr.mvc.feedbackDirective);
  module.directive("wrFormProperty", wr.mvc.formPropertyDirective);
  module.directive("wrInputFormat", wr.mvc.inputFormatDirective);
  module.directive("wrScreen", wr.mvc.screenDirective);
  module.directive("wrView", wr.mvc.viewDirective);
  module.directive("wrView", wr.mvc.viewDirective.auxiliaryDirective);
  
  /* Filters */
  module.filter("wrLocalize", wr.mvc.l10n.localizeFilter);
  
  /* Services */
  module.service("wrEventsHub", wr.mvc.EventsHub);
  module.service("wrInputFormatter", wr.mvc.InputFormatter);
  module.service("wrLogger", wr.mvc.Logger);
  module.factory("wrManager", wr.mvc.managerFactory);
  module.service("wrModelBinder", wr.mvc.ModelHelper);
  module.service("wrLocalizationManager", wr.mvc.l10n.LocalizationManager);
  module.service("wrNotificationManager", wr.mvc.NotificationManager);
  module.service("wrNgPlatform", wr.mvc.impl.NgPlatform);
  module.service("wrRouter", wr.mvc.route.Router);
  module.service("wrStorage", wr.mvc.impl.Storage);
  
  return module;
}();




//== wr/mvc/impl/_impl.js =====================================================


/**
 * @name wr.mvc.impl
 * @namespace Implementations of external WebRatio Runtime services.
 */





//== wr/mvc/l10n/CldrDataBuilder.js ===========================================



/**
 * @package
 * @constructor
 * @class Builder for creating "fake" CLDR objects from a base CLDR and some manual modifications.
 * @param {!Cldr} baseCldr
 */
wr.mvc.l10n.CldrDataBuilder = function(baseCldr, localeTag) {
  
  /* Clone the base data, changing the locale tag */
  var baseLocaleData = baseCldr.main([]);
  var copyData = {"main":{}};
  copyData["main"][localeTag] = angular.copy(baseLocaleData);
  
  /** @private */
  this._data = new wrm.util.ObjectMapper(copyData);
  
  /** @private */
  this._pathPrefix = ["main", localeTag];
};

/**
 * @return {!Object}
 */
wr.mvc.l10n.CldrDataBuilder.prototype.getData = function() {
  return this._data.getObject() || {};
};

/**
 * @private
 * @param {!Array<string>} path
 * @param {*} value
 */
wr.mvc.l10n.CldrDataBuilder.prototype._set = function(path, value) {
  this._data.setValue(this._pathPrefix.concat(path), value);
};

/**
 * @param {!wrm.l10n.NameWidth} width
 * @param {!Array<string>} names
 */
wr.mvc.l10n.CldrDataBuilder.prototype.setMonthNames = function(width, names) {
  var namesObj = {};
  names.forEach(function(name, i) {
    namesObj[String(i + 1)] = name;
  });
  
  var widthTag = wr.mvc.l10n.CLDR_MONTH_WIDTH_TAGS[width];
  this._set(["dates", "calendars", "gregorian", "months", "format", widthTag], namesObj);
  this._set(["dates", "calendars", "gregorian", "months", "stand-alone", widthTag], namesObj);
};

/**
 * @param {!wrm.l10n.NameWidth} width
 * @param {!Array<string>} names
 */
wr.mvc.l10n.CldrDataBuilder.prototype.setDayNames = function(width, names) {
  var namesObj = {};
  wr.mvc.l10n.CLDR_DAY_KEYS.forEach(function(key, i) {
    namesObj[key] = names[i];
  });
  
  var widthTag = wr.mvc.l10n.CLDR_DAY_WIDTH_TAGS[width];
  this._set(["dates", "calendars", "gregorian", "days", "format", widthTag], namesObj);
  this._set(["dates", "calendars", "gregorian", "days", "stand-alone", widthTag], namesObj);
};

/**
 * @param {string} separator
 */
wr.mvc.l10n.CldrDataBuilder.prototype.setDecimalSeparator = function(separator) {
  this._set(["numbers", "symbols-numberSystem-latn", "decimal"], separator);
};

/**
 * @param {string} separator
 */
wr.mvc.l10n.CldrDataBuilder.prototype.setGroupSeparator = function(separator) {
  this._set(["numbers", "symbols-numberSystem-latn", "group"], separator);
};




//== wr/mvc/mgmt/AppManagement.js =============================================

wr.mvc.mgmt = {};

/**
 * Module implementing the management infrastructure of a WebRatio application.
 * <p>
 * Does not require any other module.
 * <p>
 * To configure, inject <code>wrAppManagementConfigProvider</code> in a configuration block and call its <code>set</code> method.
 * 
 * @type {!angular.Module}
 */
wr.mvc.mgmt.AppManagement = function() {
  var module = angular.module("wr.mvc.mgmt.AppManagement", []);
  
  /* Configuration provider */
  module.provider("wrAppManagementConfig", function() {
    var config = {};
    return {set:function(newConfig) {
      config = newConfig || {};
    }, $get:function() {
      return config;
    }};
  });
  
  return module;
}();




//== wr/mvc/mgmt/_mgmt.js =====================================================


/**
 * @name wr.mvc.mgmt
 * @namespace Management instrumentation for controlling a WebRatio Application in a test environment.
 */

/*
 * Configuration objects
 */

wr.mvc.mgmt._OBJECTS_CACHE = {};

/**
 * @package
 * @template T
 * @param {function(new:T,...?)} ctor
 * @return {!Array.<string|number>}
 */
wr.mvc.mgmt.getConfigObjectKeys = function(ctor) {
  var objects = wr.mvc.mgmt.getConfigObjects(ctor);
  if (angular.isArray(objects)) {
    var keys = [];
    for (var i = 0;i < objects.length;i++) {
      keys.push(i);
    }
    return keys;
  } else {
    return Object.keys(objects);
  }
};

/**
 * @package
 * @template T
 * @param {function(new:T,...?)} ctor
 * @param {string|number} key
 * @return {T}
 */
wr.mvc.mgmt.getConfigObject = function(ctor, key) {
  var objects = wr.mvc.mgmt._doGetConfigObjects(ctor);
  var object = objects[key];
  if (!object) {
    throw new Error("Unable to find " + ctor["configName"] + " with key '" + key + "'");
  }
  return object;
};

/**
 * @package
 * @template T
 * @param {function(new:T,...?)} ctor
 * @return {!Array.<T>}
 */
wr.mvc.mgmt.getConfigObjects = function(ctor) {
  var objects = wr.mvc.mgmt._doGetConfigObjects(ctor);
  if (angular.isArray(objects)) {
    return objects;
  } else {
    return Object.keys(objects).map(function(key) {
      return objects[key];
    });
  }
};

/**
 * @private
 * @template T
 * @param {function(new:T)} ctor
 * @return {T}
 */
wr.mvc.mgmt._doGetConfigObjects = function(ctor) {
  var configName = ctor["configName"];
  if (!configName) {
    throw new Error("Constructor is not associated with configuration values");
  }
  
  /* Retrieve or construct the collection of objects */
  var objects = wr.mvc.mgmt._OBJECTS_CACHE[configName];
  if (!objects) {
    var values = wr.mvc.mgmt.getConfigValue(configName);
    
    if (angular.isArray(values)) {
      objects = values.map(function(value, index) {
        return wr.mvc.mgmt._constructConfigObject(ctor, index, value);
      });
      
    } else {
      if (typeof values === "object") {
        objects = {};
        Object.keys(values).forEach(function(key) {
          var value = values[key];
          objects[key] = wr.mvc.mgmt._constructConfigObject(ctor, key, value);
        });
        
      } else {
        throw new Error("Configuration of " + configName + " objects is invalid");
      }
    }
    
    wr.mvc.mgmt._OBJECTS_CACHE[configName] = objects;
  }
  
  return objects;
};

/**
 * @private
 * @template T
 * @param {function(new:T)} ctor
 * @param {string|number} key
 * @param {!Object} config
 * @return {T}
 */
wr.mvc.mgmt._constructConfigObject = function(ctor, key, config) {
  var injector = angular.element(GLOBAL.document).injector();
  try {
    return injector.instantiate(ctor, {"objectKey":key, "objectConfig":config});
  } catch (e) {
    throw new Error("Error constructing " + ctor["configName"] + " with key '" + key + "': " + e);
  }
};

/*
 * Configuration Code
 */

/**
 * @package
 * @template T
 * @param {!Function} fn
 * @return {T}
 */
wr.mvc.mgmt.invokeFunction = function(fn) {
  var injector = angular.element(GLOBAL.document).injector();
  return injector.invoke(fn);
};

/*
 * Direct configuration access
 */

/**
 * @package
 * @param {string} configName
 * @return {?}
 */
wr.mvc.mgmt.getConfigValue = function(configName) {
  return wr.mvc.mgmt._getConfigMapper().getValue(configName);
};

/**
 * @package
 * @param {string} configName
 * @return {Array.<?>}
 */
wr.mvc.mgmt.getConfigValues = function(configName) {
  return wr.mvc.mgmt._getConfigMapper().getValues(configName);
};

/**
 * @private
 * @return {!wrm.util.ObjectMapper}
 */
wr.mvc.mgmt._getConfigMapper = function() {
  var injector = angular.element(GLOBAL.document).injector();
  return injector.invoke(wr.mvc.mgmt._retrieveConfigMapper);
};

/**
 * @private
 * @ngInject
 * @param {!Object} wrAppManagementConfig
 * @return {!wrm.util.ObjectMapper}
 */
wr.mvc.mgmt._retrieveConfigMapper = function(wrAppManagementConfig) {
  return new wrm.util.ObjectMapper(wrAppManagementConfig);
};
wr.mvc.mgmt._retrieveConfigMapper["$inject"] = ["wrAppManagementConfig"];




//== wr/mvc/mgmt/DatabaseConfig.js ============================================



/**
 * @constructor
 * @class Represents a configured database in the managed application.
 *        <p>
 *        To retrieve all available databases, use the {@link #getAll} method.
 * @ngInject
 * @param {string} objectKey
 * @param {!Object} objectConfig
 */
wr.mvc.mgmt.DatabaseConfig = function(objectKey, objectConfig) {
  
  /** @private */
  this._name = objectKey;
};
wr.mvc.mgmt.DatabaseConfig["$inject"] = ["objectKey", "objectConfig"];

/** @const */
wr.mvc.mgmt.DatabaseConfig["configName"] = "databases";

/**
 * Gets all database configurations available in the managed application.
 * 
 * @return {!Array.<!wr.mvc.mgmt.DatabaseConfig>} List of database configurations.
 */
wr.mvc.mgmt.DatabaseConfig.getAll = function() {
  return wr.mvc.mgmt.getConfigObjects(wr.mvc.mgmt.DatabaseConfig);
};

/**
 * Drops the tables of the application database and reset the database version.
 * 
 * @return {!Promise}
 */
wr.mvc.mgmt.DatabaseConfig.prototype.clear = function() {
  var _thisService = this;
  return new Promise(function(resolve, reject) {
    var db = openDatabase(_thisService._name, "", _thisService._name, 2 * 1024 * 1024);
    console.log("[" + _thisService._name + "] Dropping tables...");
    var fn = function(tx) {
      tx.executeSql("SELECT tbl_name from sqlite_master WHERE type \x3d 'table'", [], function(tx, results) {
        var len = results.rows.length, i;
        for (i = 0;i < len;i++) {
          var tableName = results.rows.item(i)["tbl_name"];
          if (tableName && tableName.indexOf("data_") == 0) {
            tx.executeSql("drop table " + tableName, []);
          }
        }
      });
    };
    db.changeVersion(db.version, "", fn, function(e) {
      console.error("[" + _thisService._name + "] Drop tables failed");
      reject(e);
    }, function() {
      console.log("[" + _thisService._name + "] Drop tables done");
      resolve();
    });
  });
  
};

/** @override */
wr.mvc.mgmt.DatabaseConfig.prototype.toString = function() {
  return this._name;
};




//== wr/mvc/mgmt/DataClass.js =================================================



/**
 * @constructor
 * @class Represents a Domain Class inside the application.
 *        <p>
 *        To retrieve all classes, use the {@link #getAll} method. A single one can be retrieved by name via the {@link #get} method.
 * @ngInject
 * @param {string} objectKey
 * @param {!Object} objectConfig
 * @param {!wr.mvc.route.Router} wrRouter
 * @param {!wrm.core.Manager} wrManager
 */
wr.mvc.mgmt.DataClass = function(objectKey, objectConfig, wrRouter, wrManager) {
  
  /** @private */
  this._name = objectKey;
  
  /**
   * @private
   * @type {string}
   */
  this._id = objectConfig["id"];
  
  /** @private */
  this._router = wrRouter;
  
  /** @private */
  this._manager = wrManager;
};
wr.mvc.mgmt.DataClass["$inject"] = ["objectKey", "objectConfig", "wrRouter", "wrManager"];

/** @const */
wr.mvc.mgmt.DataClass["configName"] = "classes";

/**
 * Gets all data classes available in the managed application.
 * 
 * @return {!Array.<!wr.mvc.mgmt.DataClass>} List of data classes.
 */
wr.mvc.mgmt.DataClass.getAll = function() {
  return wr.mvc.mgmt.getConfigObjects(wr.mvc.mgmt.DataClass);
};

/**
 * Gets a data class available in the managed application by its name.
 * 
 * @param {string} name Full logical name of the data class.
 * @return {!wr.mvc.mgmt.DataClass} A data class.
 */
wr.mvc.mgmt.DataClass.get = function(name) {
  return wr.mvc.mgmt.getConfigObject(wr.mvc.mgmt.DataClass, name);
};

/**
 * Gets the full logical name of this data class.
 * 
 * @return {string} A string.
 */
wr.mvc.mgmt.DataClass.prototype.getName = function() {
  return this._name;
};

/**
 * @package
 * @return {string}
 */
wr.mvc.mgmt.DataClass.prototype.getEntityId = function() {
  return this._id;
};

/**
 * Synchronizes this data class with the back-end.
 * 
 * @return {!Promise} Promise of completing the synchronization.
 */
wr.mvc.mgmt.DataClass.prototype.synchronize = function() {
  var entityId = this._id;
  var router = this._router;
  var manager = this._manager;
  
  /* Obtain the required services */
  var promise = Promise.all([manager.getDataService(), manager.getDataSyncService()]);
  
  return promise.then(function(services) {
    var dataService = services[0];
    var dataSyncService = services[1];
    
    /* Setup a simulated environment */
    var environ = new wr.mvc.mgmt.ManagementEnviron;
    environ.setEventHandler(function(event) {
      return router.notifyEvent(event.getType(), event.getSpecifier(), event.getParameters() || undefined);
    });
    environ.setDialogHandler(function(dialog) {
      throw new Error("Attempted to show " + dialog.getFlavor() + " dialog with mesage '" + dialog.getMessage() + "'");
    });
    var state = new wrm.nav.State(null, environ);
    
    /* Synchronize */
    var entity = dataService.getMetadata().getEntity(entityId);
    return dataSyncService.synchronize({entities:[entity]}, state).then(function() {
      dataSyncService.collectSuccessEvents(state);
    });
  });
};

/**
 * Clears the date/time of the last successful synchronization of this data class with the back-end.
 * 
 * @return {!Promise} Promise of completing the operation.
 */
wr.mvc.mgmt.DataClass.prototype.clearLastSynchronizationDateTime = function() {
  var entityId = this._id;
  var manager = this._manager;
  
  var promise = Promise.all([manager.getDataService(), manager.getDataSyncService()]);
  
  return promise.then(function(services) {
    var dataService = services[0];
    var dataSyncService = services[1];
    var entity = dataService.getMetadata().getEntity(entityId);
    
    dataSyncService.clearLastSynchronizationDateTime(entity);
  });
};

/** @override */
wr.mvc.mgmt.DataClass.prototype.toString = function() {
  return this._name;
};




//== wr/mvc/mgmt/Locale.js ====================================================



/**
 * @constructor
 * @class Represents a locale supported by the application.
 *        <p>
 *        To retrieve all locales, use the {@link #getAll} method.
 * @ngInject
 * @param {string} objectKey
 * @param {!Object} objectConfig
 */
wr.mvc.mgmt.Locale = function(objectKey, objectConfig) {
  
  /** @private */
  this._code = objectKey;
  
  /**
   * @private
   * @type {string}
   */
  this._languageCode = objectConfig["language"];
  
  /**
   * @private
   * @type {?string}
   */
  this._countryCode = objectConfig["country"] || null;
};
wr.mvc.mgmt.Locale["$inject"] = ["objectKey", "objectConfig"];

/** @const */
wr.mvc.mgmt.Locale["configName"] = "locales";

/**
 * Gets all locales supported by the managed application.
 * 
 * @return {!Array<!wr.mvc.mgmt.Locale>} List of locales.
 */
wr.mvc.mgmt.Locale.getAll = function() {
  return wr.mvc.mgmt.getConfigObjects(wr.mvc.mgmt.Locale);
};

/**
 * Gets the unique ISO code of the locale.
 * 
 * @return {string} A string.
 */
wr.mvc.mgmt.Locale.prototype.getCode = function() {
  return this._code;
};

/**
 * Gets the code identifying the language of this locale.
 * 
 * @return {string} An ISO 639-1 language code.
 */
wr.mvc.mgmt.Locale.prototype.getLanguageCode = function() {
  return this._languageCode;
};

/**
 * Gets the code identifying the country of this locale. The country may not be present if the locale is country-neutral, tied only to
 * the language.
 * 
 * @return {?string} An ISO 3166 country code or <code>null</code> if this locale is country-neutral.
 */
wr.mvc.mgmt.Locale.prototype.getCountryCode = function() {
  return this._countryCode;
};

/**
 * Causes the managed application to be refreshed in response to a change in the platform locale configuration.
 * 
 * @return {!Promise} Promise of completing the refresh.
 */
wr.mvc.mgmt.Locale.refreshApp = function() {
  
  /**
   * @ngInject
   * @param {!angular.Scope} $rootScope
   * @param {!wrm.core.Manager} wrManager
   * @param {!wr.mvc.l10n.LocalizationManager} wrLocalizationManager
   * @param {!wr.mvc.route.Router} wrRouter
   * @return {!Promise}
   */
  function action($rootScope, wrManager, wrLocalizationManager, wrRouter) {
    return wrManager.getLocalizationService().then(function(l10nService) {
      return wrLocalizationManager.initialize(l10nService);
    }).then(function() {
      return wrLocalizationManager.refreshLocale();
    }).then(function(changed) {
      if (!changed) {
        return;
      }
      return wrRouter.notifyEvent("CurrentLocaleChange").then(function() {
        wr.mvc.applyScope($rootScope);
      });
    });
  }
  action["$inject"] = ["$rootScope", "wrManager", "wrLocalizationManager", "wrRouter"];
  
  return wr.mvc.mgmt.invokeFunction(action);
};

/** @override */
wr.mvc.mgmt.Locale.prototype.toString = function() {
  return this._code;
};




//== wr/mvc/mgmt/ManagementEnviron.js =========================================


/**
 * @package
 * @constructor
 * @class Navigation environment for use during management operations.
 * @implements wrm.nav.Environ
 */
wr.mvc.mgmt.ManagementEnviron = function() {
  
  /**
   * @private
   * @type {?function(!wrm.nav.Event):!Promise}
   */
  this._eventHandler = null;
  
  /**
   * @private
   * @type {?function(!wrm.nav.Dialog.<?>):!Promise.<?>}
   */
  this._dialogHandler = null;
};

/**
 * @package
 * @param {?function(!wrm.nav.Event):!Promise} eventHandler
 */
wr.mvc.mgmt.ManagementEnviron.prototype.setEventHandler = function(eventHandler) {
  this._eventHandler = eventHandler;
};

/**
 * @package
 * @param {?function(!wrm.nav.Dialog.<?>):!Promise.<?>} dialogHandler
 */
wr.mvc.mgmt.ManagementEnviron.prototype.setDialogHandler = function(dialogHandler) {
  this._dialogHandler = dialogHandler;
};

/*
 * State implementation
 */

/** @override */
wr.mvc.mgmt.ManagementEnviron.prototype.retrieveView = function(primaryPanelId, viewComponentId) {
  throw new Error("Not supported");
};

/** @override */
wr.mvc.mgmt.ManagementEnviron.prototype.markObjectForViewTracking = function(object, trackingId) {
  throw new Error("Not supported");
};

/** @override */
wr.mvc.mgmt.ManagementEnviron.prototype.retrieveFormState = function(primaryPanelId, viewComponentId) {
  throw new Error("Not supported");
};

/** @override */
wr.mvc.mgmt.ManagementEnviron.prototype.handleEvent = function(event) {
  if (this._eventHandler) {
    return this._eventHandler(event);
  }
  throw new Error("Unable to handle event: no event handler available");
};

/** @override */
wr.mvc.mgmt.ManagementEnviron.prototype.enterPanel = function(primaryPanelId, clearHistory) {
  throw new Error("Not supported");
};

/** @override */
wr.mvc.mgmt.ManagementEnviron.prototype.startTimerEvents = function(specifier, interval) {
  throw new Error("Not supported");
};

/** @override */
wr.mvc.mgmt.ManagementEnviron.prototype.stopTimerEvents = function(specifier) {
  throw new Error("Not supported");
};

/** @override */
wr.mvc.mgmt.ManagementEnviron.prototype.retrieveEventNotifier = function(type, specifier) {
  throw new Error("Not supported");
};

/** @override */
wr.mvc.mgmt.ManagementEnviron.prototype.presentDialog = function(dialog) {
  if (this._dialogHandler) {
    return this._dialogHandler(dialog);
  }
  throw new Error("Unable to present dialog: no dialog handler available");
};

/** @override */
wr.mvc.mgmt.ManagementEnviron.prototype.reportProgress = function(progress) {
};




//== wr/mvc/mgmt/NotificationPoint.js =========================================



/**
 * @constructor
 * @class Represents an endpoint for sending <i>push notifications</i> to the managed application.
 *        <p>
 *        To retrieve all available notification points, use the {@link #getAll} method.
 *        <p>
 *        Each endpoint is identified by a unique name ({@link #getName}) and accepts notifications made of
 *        <ul>
 *        <li>a title,
 *        <li>a message,
 *        <li>a fixed set of parameters.
 *        </ul>
 *        Use the {@link #send} method for triggering notifications in the managed application.
 * @ngInject
 * @param {string} objectKey
 * @param {!Object} objectConfig
 * @param {!wr.mvc.NotificationManager} wrNotificationManager
 */
wr.mvc.mgmt.NotificationPoint = function(objectKey, objectConfig, wrNotificationManager) {
  
  /** @private */
  this._name = objectKey;
  
  /**
   * @private
   * @type {!Array.<string>}
   */
  this._parameterNames = objectConfig["params"];
  
  /** @private */
  this._notificationManager = wrNotificationManager;
};
wr.mvc.mgmt.NotificationPoint["$inject"] = ["objectKey", "objectConfig", "wrNotificationManager"];

/** @const */
wr.mvc.mgmt.NotificationPoint["configName"] = "notifications";

/**
 * Gets all notification points available in the managed application.
 * 
 * @return {!Array.<!wr.mvc.mgmt.NotificationPoint>} List of notification points.
 */
wr.mvc.mgmt.NotificationPoint.getAll = function() {
  return wr.mvc.mgmt.getConfigObjects(wr.mvc.mgmt.NotificationPoint);
};

/**
 * Gets a notification point available in the managed application by its name.
 * 
 * @param {string} name Name of the notification point.
 * @return {!wr.mvc.mgmt.NotificationPoint} A notification point.
 */
wr.mvc.mgmt.NotificationPoint.get = function(name) {
  return wr.mvc.mgmt.getConfigObject(wr.mvc.mgmt.NotificationPoint, name);
};

/**
 * Gets the unique name of this notification point.
 * 
 * @return {string} A string name.
 */
wr.mvc.mgmt.NotificationPoint.prototype.getName = function() {
  return this._name;
};

/**
 * Gets the names of the parameters accepted by this notification point.
 * 
 * @return {!Array.<string>} List of strings, each being a parameter name.
 */
wr.mvc.mgmt.NotificationPoint.prototype.getParameterNames = function() {
  return this._parameterNames;
};

/**
 * Sends a notification through this notification point.
 * 
 * @param {string} title Short string containing the notification title.
 * @param {string} message Potentially long string containing the body of the message.
 * @param {!Object.<string,string>} parameters Actual parameters to send along with the notification.
 * @return {!Promise} Promise of completing the notification sending and any resulting internal application behavior.
 * @see #getParameterNames
 */
wr.mvc.mgmt.NotificationPoint.prototype.sendNotification = function(title, message, parameters) {
  var notification = new wr.mvc.Notification(true, title, message, angular.extend({}, parameters));
  return this._notificationManager.triggerNotification(this._name, notification);
};

/** @override */
wr.mvc.mgmt.NotificationPoint.prototype.toString = function() {
  return this._name;
};




//== wr/mvc/mgmt/Runtime.js ===================================================



/**
 * @constructor
 * @class Represents the runtime engine of the application.
 *        <p>
 *        To retrieve the singleton instance, use the {@link #get} method.
 * @ngInject
 * @param {!Object} objectConfig
 * @param {!angular.Scope} $rootScope
 * @param {!wr.mvc.route.Router} wrRouter
 * @param {!wr.mvc.impl.Storage} wrStorage
 * @param {!wrm.core.Manager} wrManager
 */
wr.mvc.mgmt.Runtime = function(objectConfig, $rootScope, wrRouter, wrStorage, wrManager) {
  
  /** @private */
  this._rootScope = $rootScope;
  
  /** @private */
  this._router = wrRouter;
  
  /** @private */
  this._storage = wrStorage;
  
  /** @private */
  this._manager = wrManager;
};
wr.mvc.mgmt.Runtime["$inject"] = ["objectConfig", "$rootScope", "wrRouter", "wrStorage", "wrManager"];

/** @const */
wr.mvc.mgmt.Runtime["configName"] = "runtime";

/**
 * Gets the runtime engine of the managed application.
 * 
 * @return {!wr.mvc.mgmt.Runtime} A single runtime engine.
 */
wr.mvc.mgmt.Runtime.get = function() {
  var instances = wr.mvc.mgmt.getConfigObjects(wr.mvc.mgmt.Runtime);
  if (instances.length != 1) {
    throw new Error("Invalid runtime engine configuration");
  }
  return instances[0];
};

/**
 * Determines whether the application is performing a navigation, composed by the chained execution of the logic of multiple services.
 * 
 * @return {boolean} <code>true</code> if navigating.
 */
wr.mvc.mgmt.Runtime.prototype.isNavigating = function() {
  return this._router.getRunningNotificationCount() > 0;
};

/**
 * Determines whether the application is still rendering the UI to align it with new/changed data. This roughly corresponds to the
 * <i>digest cycle</i> of Angular.
 * 
 * @return {boolean} <code>true</code> if rendering.
 */
wr.mvc.mgmt.Runtime.prototype.isRendering = function() {
  var rootScope = this._rootScope;
  
  /* Check for items in the internal queues that Angular uses for keeping track of two-way data binding tasks */
  if (rootScope["$$asyncQueue"].length > 0) {
    return true;
  }
  if (rootScope["$$postDigestQueue"].length > 0) {
    return true;
  }
  if (rootScope["$$applyAsyncQueue"].length > 0) {
    return true;
  }
  
  return false;
};

/**
 * Determines whether the application is performing file downloads in the background (for example as a tail of a data synchronization
 * job).
 * 
 * @return {!Promise<boolean>} <code>true</code> if downloading in the background.
 */
wr.mvc.mgmt.Runtime.prototype.isBackgroundDownloading = function() {
  return this._manager.getDataSyncService().then(function(srv) {
    return srv.isBackgroundDownloading();
  });
};

/**
 * Clears local data.
 */
wr.mvc.mgmt.Runtime.prototype.clearLocalData = function() {
  this._storage.clearAllDictionaries();
};

/**
 * Sets the order to use when synchronizing data classes. The order is used in all instances, both for automatic synchronizations and
 * for synchronizations triggered via the management API.
 * <p>
 * The default is to not enforce any order.
 * 
 * @param {?Array<!wr.mvc.mgmt.DataClass>} dataClasses List of data classes, in the order they should be synchronized, or
 *            <code>null</code> for not enforcing any order.
 * @return {!Promise} Promise of completing the order change.
 */
wr.mvc.mgmt.Runtime.prototype.setSynchronizationOrder = function(dataClasses) {
  var manager = this._manager;
  
  /* Obtain the required services */
  var promise = Promise.all([manager.getDataService(), manager.getDataSyncService()]);
  
  return promise.then(function(services) {
    var dataService = services[0];
    var dataSyncService = services[1];
    
    /* Convert the data classes into entities */
    var entities;
    if (dataClasses) {
      var metadata = dataService.getMetadata();
      entities = dataClasses.map(function(dataClass) {
        return metadata.getEntity(dataClass.getEntityId());
      });
    } else {
      entities = null;
    }
    
    /* Set the order */
    dataSyncService.setPreferredSynchronizationOrder(entities);
  });
};

/** @override */
wr.mvc.mgmt.Runtime.prototype.toString = function() {
  return "Runtime Engine";
};




//== wr/mvc/mgmt/Screen.js ====================================================



/**
 * @constructor
 * @class Represents a Screen inside the application.
 *        <p>
 *        To retrieve all screens, use the {@link #getAll} method. It is also possible to retrieve a single screen by its "qualified
 *        name" by calling {@link #getByQualifiedName}.
 * @ngInject
 * @param {string} objectKey
 * @param {!Object} objectConfig
 * @param {!angular.$location} $location
 * @param {!angular.$route} $route
 * @param {!angular.$routeParams} $routeParams
 * @param {!angular.Scope} $rootScope
 */
wr.mvc.mgmt.Screen = function(objectKey, objectConfig, $location, $route, $routeParams, $rootScope) {
  
  /** @private */
  this._id = objectKey;
  
  /**
   * @private
   * @type {string}
   */
  this._name = objectConfig["name"];
  
  /**
   * @private
   * @type {!Array.<string>}
   */
  this._setNames = objectConfig["setNames"];
  
  /* Compute the screen qualified name */
  var qualifiedNameParts = this._setNames.slice(0);
  qualifiedNameParts.push(this._name);
  var qualifiedName = qualifiedNameParts.join(" / ");
  
  /**
   * @private
   * @type {string}
   */
  this._qualifiedName = qualifiedName;
  
  /** @private */
  this._location = $location;
  
  /** @private */
  this._route = $route;
  
  /** @private */
  this._routeParams = $routeParams;
  
  /** @private */
  this._rootScope = $rootScope;
};
wr.mvc.mgmt.Screen["$inject"] = ["objectKey", "objectConfig", "$location", "$route", "$routeParams", "$rootScope"];

/** @const */
wr.mvc.mgmt.Screen["configName"] = "screens";

/**
 * @private
 * @type {?Object.<string,!wr.mvc.mgmt.Screen>}
 */
wr.mvc.mgmt.Screen._byQName = null;

/**
 * Gets all screens available in the managed application.
 * 
 * @return {!Array.<!wr.mvc.mgmt.Screen>} List of screens.
 */
wr.mvc.mgmt.Screen.getAll = function() {
  var screens = wr.mvc.mgmt.getConfigObjects(wr.mvc.mgmt.Screen);
  wr.mvc.mgmt.Screen._initQNameMap(screens);
  return screens;
};

/**
 * Gets a screen by its identifier.
 * 
 * @param {string} id Runtime identifier of the screen.
 * @return {!wr.mvc.mgmt.Screen} A screen.
 */
wr.mvc.mgmt.Screen.getById = function(id) {
  return wr.mvc.mgmt.getConfigObject(wr.mvc.mgmt.Screen, id);
};

/**
 * Gets a screen by its qualified name. If not found, an error is thrown.
 * 
 * @param {string} qualifiedName Qualified name of the screen to get. Excess whitespace around <code>/</code> separators are
 *            automatically normalized.
 * @return {!wr.mvc.mgmt.Screen} A screen.
 */
wr.mvc.mgmt.Screen.getByQualifiedName = function(qualifiedName) {
  qualifiedName = qualifiedName.replace(/\s*\/\s*/g, " / ").trim();
  
  var screens = wr.mvc.mgmt.getConfigObjects(wr.mvc.mgmt.Screen);
  wr.mvc.mgmt.Screen._initQNameMap(screens);
  
  var screen = wr.mvc.mgmt.Screen._byQName[qualifiedName];
  if (!screen) {
    throw new Error("Unable to find a screen named '" + qualifiedName + "'");
  }
  return screen;
};

/**
 * @private
 * @param {!Array.<!wr.mvc.mgmt.Screen>} screens
 */
wr.mvc.mgmt.Screen._initQNameMap = function(screens) {
  if (!!wr.mvc.mgmt.Screen._byQName) {
    return;
  }
  
  var result = {};
  var unnamedScreenIds = [];
  var duplicateQNamesSet = {};
  screens.forEach(function(screen) {
    if (!screen.getName()) {
      unnamedScreenIds.push(screen._id);
    }
    var qname = screen.getQualifiedName();
    if (result.hasOwnProperty(qname)) {
      duplicateQNamesSet[qname] = true;
    } else {
      result[qname] = screen;
    }
  });
  if (unnamedScreenIds.length > 0) {
    throw new Error("Found screens with no name: " + unnamedScreenIds.join(", "));
  }
  var duplicateKeys = Object.keys(duplicateQNamesSet);
  if (duplicateKeys.length > 0) {
    throw new Error("Found conflicting screen qualified names: " + duplicateKeys.join(", "));
  }
  
  wr.mvc.mgmt.Screen._byQName = result;
};

/**
 * Gets the name of this screen. Not guaranteed to be unique.
 * 
 * @return {string} A string.
 */
wr.mvc.mgmt.Screen.prototype.getName = function() {
  return this._name;
};

/**
 * Gets the names of all screen sets that contain this screen.
 * 
 * @return {!Array.<string>} List of names, from the farthest to the closest screen set.
 */
wr.mvc.mgmt.Screen.prototype.getSetNames = function() {
  return this._setNames;
};

/**
 * Gets the <i>qualified name</i> of this screen, computed from its own name and the name of the containing screen sets. <br>
 * The qualified name is guaranteed to be unique.
 * 
 * @return {string} A string.
 */
wr.mvc.mgmt.Screen.prototype.getQualifiedName = function() {
  return this._qualifiedName;
};

/**
 * Switches the application UI to this screen.
 * 
 * @return {!Promise} Promise of completing the switch.
 */
wr.mvc.mgmt.Screen.prototype.switchTo = function() {
  var location = this._location;
  var route = this._route;
  var routeParams = this._routeParams;
  var rootScope = this._rootScope;
  
  var desiredScreenId = this._id;
  var desiredUrl = "/screens/" + desiredScreenId;
  
  /* Watch the scope to detect when the switch is over */
  var promise = new Promise(function(resolve, reject) {
    
    var unsubscribe1 = rootScope.$on("$viewContentLoaded", function(event) {
      unsubscribe();
      var reachedScreenId = routeParams["screenId"];
      if (reachedScreenId === desiredScreenId) {
        resolve(undefined);
      } else {
        reject(new Error("Reached wrong screen " + reachedScreenId));
      }
    });
    
    var unsubscribe2 = rootScope.$on("$routeChangeError", function(event) {
      unsubscribe();
      reject(new Error("Error switching screen"));
    });
    
    function unsubscribe() {
      unsubscribe1();
      unsubscribe2();
    }
  });
  
  /* Initiate the switch */
  if (location.url() === desiredUrl) {
    route.reload();
  } else {
    rootScope.$apply(function() {
      location.url(desiredUrl);
    });
  }
  
  return promise;
};

/**
 * @return {?wr.mvc.mgmt.Screen}
 */
wr.mvc.mgmt.Screen.getCurrent = function() {
  
  /**
   * @ngInject
   * @param {!angular.$routeParams} $routeParams
   * @return {?wr.mvc.mgmt.Screen}
   */
  function action($routeParams) {
    var screenId = $routeParams["screenId"] || null;
    return !!screenId ? wr.mvc.mgmt.Screen.getById($routeParams["screenId"]) : null;
  }
  action["$inject"] = ["$routeParams"];
  
  return wr.mvc.mgmt.invokeFunction(action);
};

/**
 * @param {function()} listener
 * @return {function()}
 */
wr.mvc.mgmt.Screen.registerSwitchListener = function(listener) {
  
  /**
   * @ngInject
   * @param {!angular.Scope} $rootScope
   * @param {!angular.$routeParams} $routeParams
   * @return {function()}
   */
  function action($rootScope, $routeParams) {
    return $rootScope.$on("$viewContentLoaded", function(event) {
      listener();
    });
  }
  action["$inject"] = ["$rootScope", "$routeParams"];
  
  return wr.mvc.mgmt.invokeFunction(action);
};

/** @override */
wr.mvc.mgmt.Screen.prototype.toString = function() {
  return this._qualifiedName + " (" + this._id + ")";
};




//== wr/mvc/route/_route.js ===================================================


/**
 * @name wr.mvc.route
 * @namespace Implementation of the high-level flow of the application.
 */



exportSymbol("wr", wr);
})();})(this);