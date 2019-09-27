(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var O = 'object';

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global_1 = // eslint-disable-next-line no-undef
	check(typeof globalThis == O && globalThis) || check(typeof window == O && window) || check(typeof self == O && self) || check(typeof commonjsGlobal == O && commonjsGlobal) || // eslint-disable-next-line no-new-func
	Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;
	var objectPropertyIsEnumerable = {
	  f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string

	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document; // typeof document.createElement is 'object' in old IE

	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};
	var objectGetOwnPropertyDescriptor = {
	  f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  }

	  return it;
	};

	var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty

	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};
	var objectDefineProperty = {
	  f: f$2
	};

	var hide = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    hide(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  }

	  return value;
	};

	var isPure = false;

	var shared = createCommonjsModule(function (module) {
	  var SHARED = '__core-js_shared__';
	  var store = global_1[SHARED] || setGlobal(SHARED, {});
	  (module.exports = function (key, value) {
	    return store[key] || (store[key] = value !== undefined ? value : {});
	  })('versions', []).push({
	    version: '3.2.1',
	    mode:  'global',
	    copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	  });
	});

	var functionToString = shared('native-function-to-string', Function.toString);

	var WeakMap$1 = global_1.WeakMap;
	var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(functionToString.call(WeakMap$1));

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$2 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (nativeWeakMap) {
	  var store = new WeakMap$2();
	  var wmget = store.get;
	  var wmhas = store.has;
	  var wmset = store.set;

	  set = function (it, metadata) {
	    wmset.call(store, it, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return wmget.call(store, it) || {};
	  };

	  has$1 = function (it) {
	    return wmhas.call(store, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;

	  set = function (it, metadata) {
	    hide(it, STATE, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };

	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	  var getInternalState = internalState.get;
	  var enforceInternalState = internalState.enforce;
	  var TEMPLATE = String(functionToString).split('toString');
	  shared('inspectSource', function (it) {
	    return functionToString.call(it);
	  });
	  (module.exports = function (O, key, value, options) {
	    var unsafe = options ? !!options.unsafe : false;
	    var simple = options ? !!options.enumerable : false;
	    var noTargetGet = options ? !!options.noTargetGet : false;

	    if (typeof value == 'function') {
	      if (typeof key == 'string' && !has(value, 'name')) hide(value, 'name', key);
	      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	    }

	    if (O === global_1) {
	      if (simple) O[key] = value;else setGlobal(key, value);
	      return;
	    } else if (!unsafe) {
	      delete O[key];
	    } else if (!noTargetGet && O[key]) {
	      simple = true;
	    }

	    if (simple) O[key] = value;else hide(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	  })(Function.prototype, 'toString', function toString() {
	    return typeof this == 'function' && getInternalState(this).source || functionToString.call(this);
	  });
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace]) : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor; // `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger

	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min; // `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength

	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).

	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key); // Don't enum bug & hidden keys


	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }

	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames

	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
	  f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;
	var objectGetOwnPropertySymbols = {
	  f: f$4
	};

	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails(detection) : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';
	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/

	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }

	  if (target) for (key in source) {
	    sourceProperty = source[key];

	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];

	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      hide(sourceProperty, 'sham', true);
	    } // extend global


	    redefine(target, key, sourceProperty, options);
	  }
	};

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  }

	  return it;
	};

	var bindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;

	  switch (length) {
	    case 0:
	      return function () {
	        return fn.call(that);
	      };

	    case 1:
	      return function (a) {
	        return fn.call(that, a);
	      };

	    case 2:
	      return function (a, b) {
	        return fn.call(that, a, b);
	      };

	    case 3:
	      return function (a, b, c) {
	        return fn.call(that, a, b, c);
	      };
	  }

	  return function ()
	  /* ...args */
	  {
	    return fn.apply(that, arguments);
	  };
	};

	// https://tc39.github.io/ecma262/#sec-toobject

	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	// https://tc39.github.io/ecma262/#sec-isarray

	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var Symbol$1 = global_1.Symbol;
	var store$1 = shared('wks');

	var wellKnownSymbol = function (name) {
	  return store$1[name] || (store$1[name] = nativeSymbol && Symbol$1[name] || (nativeSymbol ? Symbol$1 : uid)('Symbol.' + name));
	};

	var SPECIES = wellKnownSymbol('species'); // `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate

	var arraySpeciesCreate = function (originalArray, length) {
	  var C;

	  if (isArray(originalArray)) {
	    C = originalArray.constructor; // cross-realm fallback

	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  }

	  return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var push = [].push; // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation

	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = bindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;

	    for (; length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);

	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	            case 3:
	              return true;
	            // some

	            case 5:
	              return value;
	            // find

	            case 6:
	              return index;
	            // findIndex

	            case 2:
	              push.call(target, value);
	            // filter
	          } else if (IS_EVERY) return false; // every
	      }
	    }

	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var sloppyArrayMethod = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !method || !fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () {
	      throw 1;
	    }, 1);
	  });
	};

	var $forEach = arrayIteration.forEach; // `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach

	var arrayForEach = sloppyArrayMethod('forEach') ? function forEach(callbackfn
	/* , thisArg */
	) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach


	_export({
	  target: 'Array',
	  proto: true,
	  forced: [].forEach != arrayForEach
	}, {
	  forEach: arrayForEach
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype; // some Chrome versions have non-configurable methods on DOMTokenList

	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    hide(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	var support = {
	  searchParams: 'URLSearchParams' in self,
	  iterable: 'Symbol' in self && 'iterator' in Symbol,
	  blob: 'FileReader' in self && 'Blob' in self && function () {
	    try {
	      new Blob();
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }(),
	  formData: 'FormData' in self,
	  arrayBuffer: 'ArrayBuffer' in self
	};

	function isDataView(obj) {
	  return obj && DataView.prototype.isPrototypeOf(obj);
	}

	if (support.arrayBuffer) {
	  var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

	  var isArrayBufferView = ArrayBuffer.isView || function (obj) {
	    return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
	  };
	}

	function normalizeName(name) {
	  if (typeof name !== 'string') {
	    name = String(name);
	  }

	  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
	    throw new TypeError('Invalid character in header field name');
	  }

	  return name.toLowerCase();
	}

	function normalizeValue(value) {
	  if (typeof value !== 'string') {
	    value = String(value);
	  }

	  return value;
	} // Build a destructive iterator for the value list


	function iteratorFor(items) {
	  var iterator = {
	    next: function () {
	      var value = items.shift();
	      return {
	        done: value === undefined,
	        value: value
	      };
	    }
	  };

	  if (support.iterable) {
	    iterator[Symbol.iterator] = function () {
	      return iterator;
	    };
	  }

	  return iterator;
	}

	function Headers(headers) {
	  this.map = {};

	  if (headers instanceof Headers) {
	    headers.forEach(function (value, name) {
	      this.append(name, value);
	    }, this);
	  } else if (Array.isArray(headers)) {
	    headers.forEach(function (header) {
	      this.append(header[0], header[1]);
	    }, this);
	  } else if (headers) {
	    Object.getOwnPropertyNames(headers).forEach(function (name) {
	      this.append(name, headers[name]);
	    }, this);
	  }
	}

	Headers.prototype.append = function (name, value) {
	  name = normalizeName(name);
	  value = normalizeValue(value);
	  var oldValue = this.map[name];
	  this.map[name] = oldValue ? oldValue + ', ' + value : value;
	};

	Headers.prototype['delete'] = function (name) {
	  delete this.map[normalizeName(name)];
	};

	Headers.prototype.get = function (name) {
	  name = normalizeName(name);
	  return this.has(name) ? this.map[name] : null;
	};

	Headers.prototype.has = function (name) {
	  return this.map.hasOwnProperty(normalizeName(name));
	};

	Headers.prototype.set = function (name, value) {
	  this.map[normalizeName(name)] = normalizeValue(value);
	};

	Headers.prototype.forEach = function (callback, thisArg) {
	  for (var name in this.map) {
	    if (this.map.hasOwnProperty(name)) {
	      callback.call(thisArg, this.map[name], name, this);
	    }
	  }
	};

	Headers.prototype.keys = function () {
	  var items = [];
	  this.forEach(function (value, name) {
	    items.push(name);
	  });
	  return iteratorFor(items);
	};

	Headers.prototype.values = function () {
	  var items = [];
	  this.forEach(function (value) {
	    items.push(value);
	  });
	  return iteratorFor(items);
	};

	Headers.prototype.entries = function () {
	  var items = [];
	  this.forEach(function (value, name) {
	    items.push([name, value]);
	  });
	  return iteratorFor(items);
	};

	if (support.iterable) {
	  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
	}

	function consumed(body) {
	  if (body.bodyUsed) {
	    return Promise.reject(new TypeError('Already read'));
	  }

	  body.bodyUsed = true;
	}

	function fileReaderReady(reader) {
	  return new Promise(function (resolve, reject) {
	    reader.onload = function () {
	      resolve(reader.result);
	    };

	    reader.onerror = function () {
	      reject(reader.error);
	    };
	  });
	}

	function readBlobAsArrayBuffer(blob) {
	  var reader = new FileReader();
	  var promise = fileReaderReady(reader);
	  reader.readAsArrayBuffer(blob);
	  return promise;
	}

	function readBlobAsText(blob) {
	  var reader = new FileReader();
	  var promise = fileReaderReady(reader);
	  reader.readAsText(blob);
	  return promise;
	}

	function readArrayBufferAsText(buf) {
	  var view = new Uint8Array(buf);
	  var chars = new Array(view.length);

	  for (var i = 0; i < view.length; i++) {
	    chars[i] = String.fromCharCode(view[i]);
	  }

	  return chars.join('');
	}

	function bufferClone(buf) {
	  if (buf.slice) {
	    return buf.slice(0);
	  } else {
	    var view = new Uint8Array(buf.byteLength);
	    view.set(new Uint8Array(buf));
	    return view.buffer;
	  }
	}

	function Body() {
	  this.bodyUsed = false;

	  this._initBody = function (body) {
	    this._bodyInit = body;

	    if (!body) {
	      this._bodyText = '';
	    } else if (typeof body === 'string') {
	      this._bodyText = body;
	    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	      this._bodyBlob = body;
	    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	      this._bodyFormData = body;
	    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	      this._bodyText = body.toString();
	    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	      this._bodyArrayBuffer = bufferClone(body.buffer); // IE 10-11 can't handle a DataView body.

	      this._bodyInit = new Blob([this._bodyArrayBuffer]);
	    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	      this._bodyArrayBuffer = bufferClone(body);
	    } else {
	      this._bodyText = body = Object.prototype.toString.call(body);
	    }

	    if (!this.headers.get('content-type')) {
	      if (typeof body === 'string') {
	        this.headers.set('content-type', 'text/plain;charset=UTF-8');
	      } else if (this._bodyBlob && this._bodyBlob.type) {
	        this.headers.set('content-type', this._bodyBlob.type);
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	      }
	    }
	  };

	  if (support.blob) {
	    this.blob = function () {
	      var rejected = consumed(this);

	      if (rejected) {
	        return rejected;
	      }

	      if (this._bodyBlob) {
	        return Promise.resolve(this._bodyBlob);
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(new Blob([this._bodyArrayBuffer]));
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as blob');
	      } else {
	        return Promise.resolve(new Blob([this._bodyText]));
	      }
	    };

	    this.arrayBuffer = function () {
	      if (this._bodyArrayBuffer) {
	        return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
	      } else {
	        return this.blob().then(readBlobAsArrayBuffer);
	      }
	    };
	  }

	  this.text = function () {
	    var rejected = consumed(this);

	    if (rejected) {
	      return rejected;
	    }

	    if (this._bodyBlob) {
	      return readBlobAsText(this._bodyBlob);
	    } else if (this._bodyArrayBuffer) {
	      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
	    } else if (this._bodyFormData) {
	      throw new Error('could not read FormData body as text');
	    } else {
	      return Promise.resolve(this._bodyText);
	    }
	  };

	  if (support.formData) {
	    this.formData = function () {
	      return this.text().then(decode);
	    };
	  }

	  this.json = function () {
	    return this.text().then(JSON.parse);
	  };

	  return this;
	} // HTTP methods whose capitalization should be normalized


	var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

	function normalizeMethod(method) {
	  var upcased = method.toUpperCase();
	  return methods.indexOf(upcased) > -1 ? upcased : method;
	}

	function Request(input, options) {
	  options = options || {};
	  var body = options.body;

	  if (input instanceof Request) {
	    if (input.bodyUsed) {
	      throw new TypeError('Already read');
	    }

	    this.url = input.url;
	    this.credentials = input.credentials;

	    if (!options.headers) {
	      this.headers = new Headers(input.headers);
	    }

	    this.method = input.method;
	    this.mode = input.mode;
	    this.signal = input.signal;

	    if (!body && input._bodyInit != null) {
	      body = input._bodyInit;
	      input.bodyUsed = true;
	    }
	  } else {
	    this.url = String(input);
	  }

	  this.credentials = options.credentials || this.credentials || 'same-origin';

	  if (options.headers || !this.headers) {
	    this.headers = new Headers(options.headers);
	  }

	  this.method = normalizeMethod(options.method || this.method || 'GET');
	  this.mode = options.mode || this.mode || null;
	  this.signal = options.signal || this.signal;
	  this.referrer = null;

	  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	    throw new TypeError('Body not allowed for GET or HEAD requests');
	  }

	  this._initBody(body);
	}

	Request.prototype.clone = function () {
	  return new Request(this, {
	    body: this._bodyInit
	  });
	};

	function decode(body) {
	  var form = new FormData();
	  body.trim().split('&').forEach(function (bytes) {
	    if (bytes) {
	      var split = bytes.split('=');
	      var name = split.shift().replace(/\+/g, ' ');
	      var value = split.join('=').replace(/\+/g, ' ');
	      form.append(decodeURIComponent(name), decodeURIComponent(value));
	    }
	  });
	  return form;
	}

	function parseHeaders(rawHeaders) {
	  var headers = new Headers(); // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
	  // https://tools.ietf.org/html/rfc7230#section-3.2

	  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
	  preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
	    var parts = line.split(':');
	    var key = parts.shift().trim();

	    if (key) {
	      var value = parts.join(':').trim();
	      headers.append(key, value);
	    }
	  });
	  return headers;
	}

	Body.call(Request.prototype);
	function Response(bodyInit, options) {
	  if (!options) {
	    options = {};
	  }

	  this.type = 'default';
	  this.status = options.status === undefined ? 200 : options.status;
	  this.ok = this.status >= 200 && this.status < 300;
	  this.statusText = 'statusText' in options ? options.statusText : 'OK';
	  this.headers = new Headers(options.headers);
	  this.url = options.url || '';

	  this._initBody(bodyInit);
	}
	Body.call(Response.prototype);

	Response.prototype.clone = function () {
	  return new Response(this._bodyInit, {
	    status: this.status,
	    statusText: this.statusText,
	    headers: new Headers(this.headers),
	    url: this.url
	  });
	};

	Response.error = function () {
	  var response = new Response(null, {
	    status: 0,
	    statusText: ''
	  });
	  response.type = 'error';
	  return response;
	};

	var redirectStatuses = [301, 302, 303, 307, 308];

	Response.redirect = function (url, status) {
	  if (redirectStatuses.indexOf(status) === -1) {
	    throw new RangeError('Invalid status code');
	  }

	  return new Response(null, {
	    status: status,
	    headers: {
	      location: url
	    }
	  });
	};

	var DOMException = self.DOMException;

	try {
	  new DOMException();
	} catch (err) {
	  DOMException = function (message, name) {
	    this.message = message;
	    this.name = name;
	    var error = Error(message);
	    this.stack = error.stack;
	  };

	  DOMException.prototype = Object.create(Error.prototype);
	  DOMException.prototype.constructor = DOMException;
	}

	function fetch(input, init) {
	  return new Promise(function (resolve, reject) {
	    var request = new Request(input, init);

	    if (request.signal && request.signal.aborted) {
	      return reject(new DOMException('Aborted', 'AbortError'));
	    }

	    var xhr = new XMLHttpRequest();

	    function abortXhr() {
	      xhr.abort();
	    }

	    xhr.onload = function () {
	      var options = {
	        status: xhr.status,
	        statusText: xhr.statusText,
	        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	      };
	      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
	      var body = 'response' in xhr ? xhr.response : xhr.responseText;
	      resolve(new Response(body, options));
	    };

	    xhr.onerror = function () {
	      reject(new TypeError('Network request failed'));
	    };

	    xhr.ontimeout = function () {
	      reject(new TypeError('Network request failed'));
	    };

	    xhr.onabort = function () {
	      reject(new DOMException('Aborted', 'AbortError'));
	    };

	    xhr.open(request.method, request.url, true);

	    if (request.credentials === 'include') {
	      xhr.withCredentials = true;
	    } else if (request.credentials === 'omit') {
	      xhr.withCredentials = false;
	    }

	    if ('responseType' in xhr && support.blob) {
	      xhr.responseType = 'blob';
	    }

	    request.headers.forEach(function (value, name) {
	      xhr.setRequestHeader(name, value);
	    });

	    if (request.signal) {
	      request.signal.addEventListener('abort', abortXhr);

	      xhr.onreadystatechange = function () {
	        // DONE (success or failure)
	        if (xhr.readyState === 4) {
	          request.signal.removeEventListener('abort', abortXhr);
	        }
	      };
	    }

	    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	  });
	}
	fetch.polyfill = true;

	if (!self.fetch) {
	  self.fetch = fetch;
	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;
	}

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
	};

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  return !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};

	    constructor[SPECIES$1] = function () {
	      return {
	        foo: 1
	      };
	    };

	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var SPECIES$2 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max; // `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !arrayMethodHasSpeciesSupport('slice')
	}, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length); // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible

	    var Constructor, result, n;

	    if (isArray(O)) {
	      Constructor = O.constructor; // cross-realm fallback

	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$2];
	        if (Constructor === null) Constructor = undefined;
	      }

	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }

	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));

	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);

	    result.length = n;
	    return result;
	  }
	});

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$'); // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation

	var createMethod$2 = function (TYPE) {
	  return function ($this) {
	    var string = String(requireObjectCoercible($this));
	    if (TYPE & 1) string = string.replace(ltrim, '');
	    if (TYPE & 2) string = string.replace(rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$2(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
	  end: createMethod$2(2),
	  // `String.prototype.trim` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
	  trim: createMethod$2(3)
	};

	var trim = stringTrim.trim;
	var nativeParseInt = global_1.parseInt;
	var hex = /^[+-]?0[Xx]/;
	var FORCED = nativeParseInt(whitespaces + '08') !== 8 || nativeParseInt(whitespaces + '0x16') !== 22; // `parseInt` method
	// https://tc39.github.io/ecma262/#sec-parseint-string-radix

	var _parseInt = FORCED ? function parseInt(string, radix) {
	  var S = trim(String(string));
	  return nativeParseInt(S, radix >>> 0 || (hex.test(S) ? 16 : 10));
	} : nativeParseInt;

	// https://tc39.github.io/ecma262/#sec-parseint-string-radix

	_export({
	  global: true,
	  forced: parseInt != _parseInt
	}, {
	  parseInt: _parseInt
	});

	function resizeTables (table) {
	  var row = table.getElementsByTagName("tr")[0];
	  var cols = Array.prototype.slice.call(row.children);
	  if (!cols) return;
	  table.style.overflow = "hidden";
	  var tableHeight = table.offsetHeight;

	  for (var i = 0; i < cols.length - 1; i++) {
	    var div = createDiv(tableHeight);
	    div.style.transition = "all 0.2s ease";
	    cols[i].appendChild(div);
	    cols[i].style.position = "relative";
	    setListeners(div);
	  }

	  function show(e) {
	    e.style.borderRight = "2px solid gray";
	    e.style.opacity = "1";
	  }

	  function hide(e) {
	    e.style.borderRight = "";
	    e.style.opacity = "0";
	  }

	  function setListeners(div) {
	    var pageX, curCol, nxtCol, curColWidth, nxtColWidth, mouseDown;
	    div.addEventListener("mousedown", function (e) {
	      show(div);
	      mouseDown = true;
	      var element = e.target;
	      curCol = element.parentElement;
	      nxtCol = curCol.nextElementSibling;
	      pageX = e.pageX;
	      var padding = paddingDiff(curCol);
	      curColWidth = curCol.offsetWidth - padding;
	      if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
	    });
	    div.addEventListener("mouseover", function () {
	      return show(div);
	    });
	    div.addEventListener("mouseout", function () {
	      return !mouseDown && hide(div);
	    });
	    document.addEventListener("mousemove", function (e) {
	      if (curCol && mouseDown) {
	        var diffX = e.pageX - pageX;
	        if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + "px";
	        curCol.style.width = curColWidth + diffX + "px";
	      }
	    });
	    document.addEventListener("mouseup", function () {
	      mouseDown = false;
	      hide(div);
	    });
	  }

	  function createDiv(height) {
	    var div = document.createElement("div");
	    div.style.top = "0";
	    div.style.right = "0";
	    div.style.width = "2px";
	    div.style.position = "absolute";
	    div.style.cursor = "col-resize";
	    div.style.userSelect = "none";
	    div.style.height = height + "px";
	    return div;
	  }

	  function paddingDiff(col) {
	    if (getStyleVal(col, "box-sizing") == "border-box") {
	      return 0;
	    }

	    var padLeft = getStyleVal(col, "padding-left");
	    var padRight = getStyleVal(col, "padding-right");
	    return parseInt(padLeft) + parseInt(padRight);
	  }

	  function getStyleVal(elm, css) {
	    return window.getComputedStyle(elm, null).getPropertyValue(css);
	  }
	}

	var version = "0.0.7";

	function _typeof(obj) {
	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
	  try {
	    var info = gen[key](arg);
	    var value = info.value;
	  } catch (error) {
	    reject(error);
	    return;
	  }

	  if (info.done) {
	    resolve(value);
	  } else {
	    Promise.resolve(value).then(_next, _throw);
	  }
	}

	function _asyncToGenerator(fn) {
	  return function () {
	    var self = this,
	        args = arguments;
	    return new Promise(function (resolve, reject) {
	      var gen = fn.apply(self, args);

	      function _next(value) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
	      }

	      function _throw(err) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
	      }

	      _next(undefined);
	    });
	  };
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (typeof call === "object" || typeof call === "function")) {
	    return call;
	  }

	  return _assertThisInitialized(self);
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  }
	}

	function _iterableToArray(iter) {
	  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance");
	}

	// https://tc39.github.io/ecma262/#sec-array.prototype.fill


	var arrayFill = function fill(value
	/* , start = 0, end = @length */
	) {
	  var O = toObject(this);
	  var length = toLength(O.length);
	  var argumentsLength = arguments.length;
	  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
	  var end = argumentsLength > 2 ? arguments[2] : undefined;
	  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);

	  while (endPos > index) O[index++] = value;

	  return O;
	};

	// https://tc39.github.io/ecma262/#sec-object.keys

	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// https://tc39.github.io/ecma262/#sec-object.defineproperties

	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;

	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);

	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var IE_PROTO = sharedKey('IE_PROTO');
	var PROTOTYPE = 'prototype';

	var Empty = function () {
	  /* empty */
	}; // Create object with fake `null` prototype: use iframe Object with cleared prototype


	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var length = enumBugKeys.length;
	  var lt = '<';
	  var script = 'script';
	  var gt = '>';
	  var js = 'java' + script + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  iframe.src = String(js);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;

	  while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];

	  return createDict();
	}; // `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create


	var objectCreate = Object.create || function create(O, Properties) {
	  var result;

	  if (O !== null) {
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

	    result[IE_PROTO] = O;
	  } else result = createDict();

	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	hiddenKeys[IE_PROTO] = true;

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype; // Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  hide(ArrayPrototype, UNSCOPABLES, objectCreate(null));
	} // add a key to Array.prototype[@@unscopables]


	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	// https://tc39.github.io/ecma262/#sec-array.prototype.fill

	_export({
	  target: 'Array',
	  proto: true
	}, {
	  fill: arrayFill
	}); // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	addToUnscopables('fill');

	var $indexOf = arrayIncludes.indexOf;
	var nativeIndexOf = [].indexOf;
	var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var SLOPPY_METHOD = sloppyArrayMethod('indexOf'); // `Array.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof

	_export({
	  target: 'Array',
	  proto: true,
	  forced: NEGATIVE_ZERO || SLOPPY_METHOD
	}, {
	  indexOf: function indexOf(searchElement
	  /* , fromIndex = 0 */
	  ) {
	    return NEGATIVE_ZERO // convert -0 to +0
	    ? nativeIndexOf.apply(this, arguments) || 0 : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $map = arrayIteration.map; // `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !arrayMethodHasSpeciesSupport('map')
	}, {
	  map: function map(callbackfn
	  /* , thisArg */
	  ) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var nativeSort = [].sort;
	var test = [1, 2, 3]; // IE8-

	var FAILS_ON_UNDEFINED = fails(function () {
	  test.sort(undefined);
	}); // V8 bug

	var FAILS_ON_NULL = fails(function () {
	  test.sort(null);
	}); // Old WebKit

	var SLOPPY_METHOD$1 = sloppyArrayMethod('sort');
	var FORCED$1 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || SLOPPY_METHOD$1; // `Array.prototype.sort` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.sort

	_export({
	  target: 'Array',
	  proto: true,
	  forced: FORCED$1
	}, {
	  sort: function sort(comparefn) {
	    return comparefn === undefined ? nativeSort.call(toObject(this)) : nativeSort.call(toObject(this), aFunction$1(comparefn));
	  }
	});

	var max$2 = Math.max;
	var min$2 = Math.min;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded'; // `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !arrayMethodHasSpeciesSupport('splice')
	}, {
	  splice: function splice(start, deleteCount
	  /* , ...items */
	  ) {
	    var O = toObject(this);
	    var len = toLength(O.length);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;

	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$2(max$2(toInteger(deleteCount), 0), len - actualStart);
	    }

	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }

	    A = arraySpeciesCreate(O, actualDeleteCount);

	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }

	    A.length = actualDeleteCount;

	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];else delete O[to];
	      }

	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];else delete O[to];
	      }
	    }

	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }

	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	var UIElement =
	/*#__PURE__*/
	function () {
	  function UIElement(stage, wrapper, config) {
	    var _this = this;

	    _classCallCheck(this, UIElement);

	    _defineProperty(this, "stage", void 0);

	    _defineProperty(this, "wrapper", void 0);

	    _defineProperty(this, "config", void 0);

	    _defineProperty(this, "_enabled", true);

	    _defineProperty(this, "_update", void 0);

	    _defineProperty(this, "_init", void 0);

	    this.stage = stage;
	    this.wrapper = document.createElement("div");
	    this.wrapper.classList.add("ui-element-wrapper");
	    this.config = config;
	    wrapper.append(this.wrapper);

	    if (config.onUpdate) {
	      var _update = this.config.onUpdate.bind(this);

	      this._update = function (v) {
	        var original = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.stage.pd;

	        _update(v, original);

	        _this.stage.pd = _this.stage.pd;
	      };
	    }

	    if (config.tooltip) {
	      var tooltip = document.createElement("span");
	      this.wrapper.classList.add("tooltip");
	      tooltip.classList.add("tooltip-text");
	      tooltip.innerHTML = config.tooltip;
	      this.wrapper.append(tooltip);
	    }
	  }

	  _createClass(UIElement, [{
	    key: "init",
	    value: function init(_pd) {
	      if (this._init) this._init(_pd);
	    }
	  }, {
	    key: "update",
	    value: function update(v, orig) {
	      if (this._update) {
	        this._update(v, orig);
	      }
	    }
	  }, {
	    key: "enabled",
	    get: function get() {
	      return this._enabled;
	    },
	    set: function set(v) {
	      this.wrapper.blur();
	      v ? this.wrapper.classList.remove("ui-element-disabled") : this.wrapper.classList.add("ui-element-disabled");
	      this._enabled = v;
	    }
	  }]);

	  return UIElement;
	}();

	function debounce(func, wait, immediate) {
	  var timeout;
	  return function () {
	    var later = function later() {
	      timeout = null;
	      if (!immediate) func();
	    };

	    var callNow = immediate && !timeout;
	    clearTimeout(timeout);
	    timeout = setTimeout(later, wait);
	    if (callNow) func();
	  };
	}

	var DatePrototype = Date.prototype;
	var INVALID_DATE = 'Invalid Date';
	var TO_STRING = 'toString';
	var nativeDateToString = DatePrototype[TO_STRING];
	var getTime = DatePrototype.getTime; // `Date.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-date.prototype.tostring

	if (new Date(NaN) + '' != INVALID_DATE) {
	  redefine(DatePrototype, TO_STRING, function toString() {
	    var value = getTime.call(this); // eslint-disable-next-line no-self-compare

	    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
	  });
	}

	var throttle = (function (func, limit) {
	  var lastFunc;
	  var lastRan;
	  return function () {
	    if (!lastRan) {
	      func();
	      lastRan = Date.now();
	    } else {
	      clearTimeout(lastFunc);
	      lastFunc = setTimeout(function () {
	        if (Date.now() - lastRan >= limit) {
	          func();
	          lastRan = Date.now();
	        }
	      }, limit - (Date.now() - lastRan));
	    }
	  };
	});

	/**
	 * Calculates the length of a vec3
	 *
	 * @param {vec3} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	function length(a) {
	  let x = a[0];
	  let y = a[1];
	  let z = a[2];
	  return Math.sqrt(x * x + y * y + z * z);
	}
	/**
	 * Copy the values from one vec3 to another
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the source vector
	 * @returns {vec3} out
	 */


	function copy(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  return out;
	}
	/**
	 * Set the components of a vec3 to the given values
	 *
	 * @param {vec3} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @returns {vec3} out
	 */


	function set$1(out, x, y, z) {
	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	  return out;
	}
	/**
	 * Adds two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */


	function add(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  return out;
	}
	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */


	function subtract(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  return out;
	}
	/**
	 * Multiplies two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */


	function multiply(out, a, b) {
	  out[0] = a[0] * b[0];
	  out[1] = a[1] * b[1];
	  out[2] = a[2] * b[2];
	  return out;
	}
	/**
	 * Divides two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */


	function divide(out, a, b) {
	  out[0] = a[0] / b[0];
	  out[1] = a[1] / b[1];
	  out[2] = a[2] / b[2];
	  return out;
	}
	/**
	 * Scales a vec3 by a scalar number
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec3} out
	 */


	function scale(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  return out;
	}
	/**
	 * Calculates the euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} distance between a and b
	 */


	function distance(a, b) {
	  let x = b[0] - a[0];
	  let y = b[1] - a[1];
	  let z = b[2] - a[2];
	  return Math.sqrt(x * x + y * y + z * z);
	}
	/**
	 * Calculates the squared euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} squared distance between a and b
	 */


	function squaredDistance(a, b) {
	  let x = b[0] - a[0];
	  let y = b[1] - a[1];
	  let z = b[2] - a[2];
	  return x * x + y * y + z * z;
	}
	/**
	 * Calculates the squared length of a vec3
	 *
	 * @param {vec3} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */


	function squaredLength(a) {
	  let x = a[0];
	  let y = a[1];
	  let z = a[2];
	  return x * x + y * y + z * z;
	}
	/**
	 * Negates the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to negate
	 * @returns {vec3} out
	 */


	function negate(out, a) {
	  out[0] = -a[0];
	  out[1] = -a[1];
	  out[2] = -a[2];
	  return out;
	}
	/**
	 * Returns the inverse of the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to invert
	 * @returns {vec3} out
	 */


	function inverse(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  out[2] = 1.0 / a[2];
	  return out;
	}
	/**
	 * Normalize a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to normalize
	 * @returns {vec3} out
	 */


	function normalize$1(out, a) {
	  let x = a[0];
	  let y = a[1];
	  let z = a[2];
	  let len = x * x + y * y + z * z;

	  if (len > 0) {
	    //TODO: evaluate use of glm_invsqrt here?
	    len = 1 / Math.sqrt(len);
	  }

	  out[0] = a[0] * len;
	  out[1] = a[1] * len;
	  out[2] = a[2] * len;
	  return out;
	}
	/**
	 * Calculates the dot product of two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} dot product of a and b
	 */


	function dot(a, b) {
	  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	}
	/**
	 * Computes the cross product of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */


	function cross(out, a, b) {
	  let ax = a[0],
	      ay = a[1],
	      az = a[2];
	  let bx = b[0],
	      by = b[1],
	      bz = b[2];
	  out[0] = ay * bz - az * by;
	  out[1] = az * bx - ax * bz;
	  out[2] = ax * by - ay * bx;
	  return out;
	}
	/**
	 * Performs a linear interpolation between two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */


	function lerp(out, a, b, t) {
	  let ax = a[0];
	  let ay = a[1];
	  let az = a[2];
	  out[0] = ax + t * (b[0] - ax);
	  out[1] = ay + t * (b[1] - ay);
	  out[2] = az + t * (b[2] - az);
	  return out;
	}
	/**
	 * Transforms the vec3 with a mat4.
	 * 4th vector component is implicitly '1'
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec3} out
	 */


	function transformMat4(out, a, m) {
	  let x = a[0],
	      y = a[1],
	      z = a[2];
	  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
	  w = w || 1.0;
	  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
	  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
	  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
	  return out;
	}
	/**
	 * Transforms the vec3 with a quat
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {quat} q quaternion to transform with
	 * @returns {vec3} out
	 */


	function transformQuat(out, a, q) {
	  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
	  let x = a[0],
	      y = a[1],
	      z = a[2];
	  let qx = q[0],
	      qy = q[1],
	      qz = q[2],
	      qw = q[3];
	  let uvx = qy * z - qz * y;
	  let uvy = qz * x - qx * z;
	  let uvz = qx * y - qy * x;
	  let uuvx = qy * uvz - qz * uvy;
	  let uuvy = qz * uvx - qx * uvz;
	  let uuvz = qx * uvy - qy * uvx;
	  let w2 = qw * 2;
	  uvx *= w2;
	  uvy *= w2;
	  uvz *= w2;
	  uuvx *= 2;
	  uuvy *= 2;
	  uuvz *= 2;
	  out[0] = x + uvx + uuvx;
	  out[1] = y + uvy + uuvy;
	  out[2] = z + uvz + uuvz;
	  return out;
	}
	/**
	 * Get the angle between two 3D vectors
	 * @param {vec3} a The first operand
	 * @param {vec3} b The second operand
	 * @returns {Number} The angle in radians
	 */


	const angle = function () {
	  const tempA = [0, 0, 0];
	  const tempB = [0, 0, 0];
	  return function (a, b) {
	    copy(tempA, a);
	    copy(tempB, b);
	    normalize$1(tempA, tempA);
	    normalize$1(tempB, tempB);
	    let cosine = dot(tempA, tempB);

	    if (cosine > 1.0) {
	      return 0;
	    } else if (cosine < -1.0) {
	      return Math.PI;
	    } else {
	      return Math.acos(cosine);
	    }
	  };
	}();
	/**
	 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {vec3} a The first vector.
	 * @param {vec3} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */


	function exactEquals(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
	}

	class Vec3 extends Array {
	  constructor(x = 0, y = x, z = x) {
	    super(x, y, z);
	    return this;
	  }

	  get x() {
	    return this[0];
	  }

	  set x(v) {
	    this[0] = v;
	  }

	  get y() {
	    return this[1];
	  }

	  set y(v) {
	    this[1] = v;
	  }

	  get z() {
	    return this[2];
	  }

	  set z(v) {
	    this[2] = v;
	  }

	  set(x, y = x, z = x) {
	    if (x.length) return this.copy(x);
	    set$1(this, x, y, z);
	    return this;
	  }

	  copy(v) {
	    copy(this, v);
	    return this;
	  }

	  add(va, vb) {
	    if (vb) add(this, va, vb);else add(this, this, va);
	    return this;
	  }

	  sub(va, vb) {
	    if (vb) subtract(this, va, vb);else subtract(this, this, va);
	    return this;
	  }

	  multiply(v) {
	    if (v.length) multiply(this, this, v);else scale(this, this, v);
	    return this;
	  }

	  divide(v) {
	    if (v.length) divide(this, this, v);else scale(this, this, 1 / v);
	    return this;
	  }

	  inverse(v = this) {
	    inverse(this, v);
	    return this;
	  } // Can't use 'length' as Array.prototype uses it


	  len() {
	    return length(this);
	  }

	  distance(v) {
	    if (v) return distance(this, v);else return length(this);
	  }

	  squaredLen() {
	    return this.squaredDistance();
	  }

	  squaredDistance(v) {
	    if (v) return squaredDistance(this, v);else return squaredLength(this);
	  }

	  negate(v = this) {
	    negate(this, v);
	    return this;
	  }

	  cross(va, vb) {
	    cross(this, va, vb);
	    return this;
	  }

	  scale(v) {
	    scale(this, this, v);
	    return this;
	  }

	  normalize() {
	    normalize$1(this, this);
	    return this;
	  }

	  dot(v) {
	    return dot(this, v);
	  }

	  equals(v) {
	    return exactEquals(this, v);
	  }

	  applyMatrix4(mat4) {
	    transformMat4(this, this, mat4);
	    return this;
	  }

	  applyQuaternion(q) {
	    transformQuat(this, this, q);
	    return this;
	  }

	  angle(v) {
	    return angle(this, v);
	  }

	  lerp(v, t) {
	    lerp(this, this, v, t);
	    return this;
	  }

	  clone() {
	    return new Vec3(this[0], this[1], this[2]);
	  }

	  fromArray(a, o = 0) {
	    this[0] = a[o];
	    this[1] = a[o + 1];
	    this[2] = a[o + 2];
	    return this;
	  }

	  toArray(a = [], o = 0) {
	    a[o] = this[0];
	    a[o + 1] = this[1];
	    a[o + 2] = this[2];
	    return a;
	  }

	  transformDirection(mat4) {
	    const x = this[0];
	    const y = this[1];
	    const z = this[2];
	    this[0] = mat4[0] * x + mat4[4] * y + mat4[8] * z;
	    this[1] = mat4[1] * x + mat4[5] * y + mat4[9] * z;
	    this[2] = mat4[2] * x + mat4[6] * y + mat4[10] * z;
	    return this.normalize();
	  }

	} // attribute params


	const tempVec3 = new Vec3();
	let ID = 0;
	let ATTR_ID = 0;

	class Geometry {
	  constructor(gl, attributes = {}) {
	    this.gl = gl;
	    this.attributes = attributes;
	    this.id = ID++; // Store one VAO per program attribute locations order

	    this.VAOs = {};
	    this.drawRange = {
	      start: 0,
	      count: 0
	    };
	    this.instancedCount = 0; // Unbind current VAO so that new buffers don't get added to active mesh

	    this.gl.renderer.bindVertexArray(null);
	    this.gl.renderer.currentGeometry = null; // Alias for state store to avoid redundant calls for global state

	    this.glState = this.gl.renderer.state; // create the buffers

	    for (let key in attributes) {
	      this.addAttribute(key, attributes[key]);
	    }
	  }

	  addAttribute(key, attr) {
	    this.attributes[key] = attr; // Set options

	    attr.id = ATTR_ID++;
	    attr.size = attr.size || 1;
	    attr.type = attr.type || (attr.data.constructor === Float32Array ? this.gl.FLOAT : attr.data.constructor === Uint16Array ? this.gl.UNSIGNED_SHORT : this.gl.UNSIGNED_INT); // Uint32Array

	    attr.target = key === 'index' ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER;
	    attr.normalize = attr.normalize || false;
	    attr.buffer = this.gl.createBuffer();
	    attr.count = attr.data.length / attr.size;
	    attr.divisor = attr.instanced || 0;
	    attr.needsUpdate = false; // Push data to buffer

	    this.updateAttribute(attr); // Update geometry counts. If indexed, ignore regular attributes

	    if (attr.divisor) {
	      this.isInstanced = true;

	      if (this.instancedCount && this.instancedCount !== attr.count * attr.divisor) {
	        console.warn('geometry has multiple instanced buffers of different length');
	        return this.instancedCount = Math.min(this.instancedCount, attr.count * attr.divisor);
	      }

	      this.instancedCount = attr.count * attr.divisor;
	    } else if (key === 'index') {
	      this.drawRange.count = attr.count;
	    } else if (!this.attributes.index) {
	      this.drawRange.count = Math.max(this.drawRange.count, attr.count);
	    }
	  }

	  updateAttribute(attr) {
	    // Already bound, prevent gl command
	    if (this.glState.boundBuffer !== attr.id) {
	      this.gl.bindBuffer(attr.target, attr.buffer);
	      this.glState.boundBuffer = attr.id;
	    }

	    this.gl.bufferData(attr.target, attr.data, this.gl.STATIC_DRAW);
	    attr.needsUpdate = false;
	  }

	  setIndex(value) {
	    this.addAttribute('index', value);
	  }

	  setDrawRange(start, count) {
	    this.drawRange.start = start;
	    this.drawRange.count = count;
	  }

	  setInstancedCount(value) {
	    this.instancedCount = value;
	  }

	  createVAO(program) {
	    this.VAOs[program.attributeOrder] = this.gl.renderer.createVertexArray();
	    this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
	    this.bindAttributes(program);
	  }

	  bindAttributes(program) {
	    // Link all attributes to program using gl.vertexAttribPointer
	    program.attributeLocations.forEach((location, name) => {
	      // If geometry missing a required shader attribute
	      if (!this.attributes[name]) {
	        console.warn(`active attribute ${name} not being supplied`);
	        return;
	      }

	      const attr = this.attributes[name];
	      this.gl.bindBuffer(attr.target, attr.buffer);
	      this.glState.boundBuffer = attr.id;
	      this.gl.vertexAttribPointer(location, attr.size, attr.type, attr.normalize, 0, // stride
	      0 // offset
	      );
	      this.gl.enableVertexAttribArray(location); // For instanced attributes, divisor needs to be set.
	      // For firefox, need to set back to 0 if non-instanced drawn after instanced. Else won't render

	      this.gl.renderer.vertexAttribDivisor(location, attr.divisor);
	    }); // Bind indices if geometry indexed

	    if (this.attributes.index) this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.buffer);
	  }

	  draw({
	    program,
	    mode = this.gl.TRIANGLES
	  }) {
	    if (this.gl.renderer.currentGeometry !== `${this.id}_${program.attributeOrder}`) {
	      if (!this.VAOs[program.attributeOrder]) this.createVAO(program);
	      this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
	      this.gl.renderer.currentGeometry = `${this.id}_${program.attributeOrder}`;
	    } // Check if any attributes need updating


	    program.attributeLocations.forEach((location, name) => {
	      const attr = this.attributes[name];
	      if (attr.needsUpdate) this.updateAttribute(attr);
	    });

	    if (this.isInstanced) {
	      if (this.attributes.index) {
	        this.gl.renderer.drawElementsInstanced(mode, this.drawRange.count, this.attributes.index.type, this.drawRange.start, this.instancedCount);
	      } else {
	        this.gl.renderer.drawArraysInstanced(mode, this.drawRange.start, this.drawRange.count, this.instancedCount);
	      }
	    } else {
	      if (this.attributes.index) {
	        this.gl.drawElements(mode, this.drawRange.count, this.attributes.index.type, this.drawRange.start);
	      } else {
	        this.gl.drawArrays(mode, this.drawRange.start, this.drawRange.count);
	      }
	    }
	  }

	  computeBoundingBox(array) {
	    // Use position buffer if available
	    if (!array && this.attributes.position) array = this.attributes.position.data;
	    if (!array) console.warn('No position buffer found to compute bounds');

	    if (!this.bounds) {
	      this.bounds = {
	        min: new Vec3(),
	        max: new Vec3(),
	        center: new Vec3(),
	        scale: new Vec3(),
	        radius: Infinity
	      };
	    }

	    const min = this.bounds.min;
	    const max = this.bounds.max;
	    const center = this.bounds.center;
	    const scale = this.bounds.scale;
	    min.set(+Infinity);
	    max.set(-Infinity);

	    for (let i = 0, l = array.length; i < l; i += 3) {
	      const x = array[i];
	      const y = array[i + 1];
	      const z = array[i + 2];
	      min.x = Math.min(x, min.x);
	      min.y = Math.min(y, min.y);
	      min.z = Math.min(z, min.z);
	      max.x = Math.max(x, max.x);
	      max.y = Math.max(y, max.y);
	      max.z = Math.max(z, max.z);
	    }

	    scale.sub(max, min);
	    center.add(min, max).divide(2);
	  }

	  computeBoundingSphere(array) {
	    // Use position buffer if available
	    if (!array && this.attributes.position) array = this.attributes.position.data;
	    if (!array) console.warn('No position buffer found to compute bounds');
	    if (!this.bounds) this.computeBoundingBox(array);
	    let maxRadiusSq = 0;

	    for (let i = 0, l = array.length; i < l; i += 3) {
	      tempVec3.fromArray(array, i);
	      maxRadiusSq = Math.max(maxRadiusSq, this.bounds.center.squaredDistance(tempVec3));
	    }

	    this.bounds.radius = Math.sqrt(maxRadiusSq);
	  }

	  remove() {
	    if (this.vao) this.gl.renderer.deleteVertexArray(this.vao);

	    for (let key in this.attributes) {
	      this.gl.deleteBuffer(this.attributes[key].buffer);
	      delete this.attributes[key];
	    }
	  }

	} // TODO: upload empty texture if null ? maybe not
	// TODO: upload identity matrix if null ?
	// TODO: sampler Cube


	let ID$1 = 0; // cache of typed arrays used to flatten uniform arrays

	const arrayCacheF32 = {};

	class Program {
	  constructor(gl, {
	    vertex,
	    fragment,
	    uniforms = {},
	    transparent = false,
	    cullFace = gl.BACK,
	    frontFace = gl.CCW,
	    depthTest = true,
	    depthWrite = true,
	    depthFunc = gl.LESS
	  } = {}) {
	    this.gl = gl;
	    this.uniforms = uniforms;
	    this.id = ID$1++;
	    if (!vertex) console.warn('vertex shader not supplied');
	    if (!fragment) console.warn('fragment shader not supplied'); // Store program state

	    this.transparent = transparent;
	    this.cullFace = cullFace;
	    this.frontFace = frontFace;
	    this.depthTest = depthTest;
	    this.depthWrite = depthWrite;
	    this.depthFunc = depthFunc;
	    this.blendFunc = {};
	    this.blendEquation = {}; // set default blendFunc if transparent flagged

	    if (this.transparent && !this.blendFunc.src) {
	      if (this.gl.renderer.premultipliedAlpha) this.setBlendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);else this.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	    } // compile vertex shader and log errors


	    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	    gl.shaderSource(vertexShader, vertex);
	    gl.compileShader(vertexShader);

	    if (gl.getShaderInfoLog(vertexShader) !== '') {
	      console.warn(`${gl.getShaderInfoLog(vertexShader)}\nVertex Shader\n${addLineNumbers(vertex)}`);
	    } // compile fragment shader and log errors


	    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	    gl.shaderSource(fragmentShader, fragment);
	    gl.compileShader(fragmentShader);

	    if (gl.getShaderInfoLog(fragmentShader) !== '') {
	      console.warn(`${gl.getShaderInfoLog(fragmentShader)}\nFragment Shader\n${addLineNumbers(fragment)}`);
	    } // compile program and log errors


	    this.program = gl.createProgram();
	    gl.attachShader(this.program, vertexShader);
	    gl.attachShader(this.program, fragmentShader);
	    gl.linkProgram(this.program);

	    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
	      return console.warn(gl.getProgramInfoLog(this.program));
	    } // Remove shader once linked


	    gl.deleteShader(vertexShader);
	    gl.deleteShader(fragmentShader); // Get active uniform locations

	    this.uniformLocations = new Map();
	    let numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);

	    for (let uIndex = 0; uIndex < numUniforms; uIndex++) {
	      let uniform = gl.getActiveUniform(this.program, uIndex);
	      this.uniformLocations.set(uniform, gl.getUniformLocation(this.program, uniform.name)); // split uniforms' names to separate array and struct declarations

	      const split = uniform.name.match(/(\w+)/g);
	      uniform.uniformName = split[0];

	      if (split.length === 3) {
	        uniform.isStructArray = true;
	        uniform.structIndex = Number(split[1]);
	        uniform.structProperty = split[2];
	      } else if (split.length === 2 && isNaN(Number(split[1]))) {
	        uniform.isStruct = true;
	        uniform.structProperty = split[1];
	      }
	    } // Get active attribute locations


	    this.attributeLocations = new Map();
	    const locations = [];
	    const numAttribs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);

	    for (let aIndex = 0; aIndex < numAttribs; aIndex++) {
	      const attribute = gl.getActiveAttrib(this.program, aIndex);
	      const location = gl.getAttribLocation(this.program, attribute.name);
	      locations[location] = attribute.name;
	      this.attributeLocations.set(attribute.name, location);
	    }

	    this.attributeOrder = locations.join('');
	  }

	  setBlendFunc(src, dst, srcAlpha, dstAlpha) {
	    this.blendFunc.src = src;
	    this.blendFunc.dst = dst;
	    this.blendFunc.srcAlpha = srcAlpha;
	    this.blendFunc.dstAlpha = dstAlpha;
	    if (src) this.transparent = true;
	  }

	  setBlendEquation(modeRGB, modeAlpha) {
	    this.blendEquation.modeRGB = modeRGB;
	    this.blendEquation.modeAlpha = modeAlpha;
	  }

	  applyState() {
	    if (this.depthTest) this.gl.renderer.enable(this.gl.DEPTH_TEST);else this.gl.renderer.disable(this.gl.DEPTH_TEST);
	    if (this.cullFace) this.gl.renderer.enable(this.gl.CULL_FACE);else this.gl.renderer.disable(this.gl.CULL_FACE);
	    if (this.blendFunc.src) this.gl.renderer.enable(this.gl.BLEND);else this.gl.renderer.disable(this.gl.BLEND);
	    if (this.cullFace) this.gl.renderer.setCullFace(this.cullFace);
	    this.gl.renderer.setFrontFace(this.frontFace);
	    this.gl.renderer.setDepthMask(this.depthWrite);
	    this.gl.renderer.setDepthFunc(this.depthFunc);
	    if (this.blendFunc.src) this.gl.renderer.setBlendFunc(this.blendFunc.src, this.blendFunc.dst, this.blendFunc.srcAlpha, this.blendFunc.dstAlpha);
	    if (this.blendEquation.modeRGB) this.gl.renderer.setBlendEquation(this.blendEquation.modeRGB, this.blendEquation.modeAlpha);
	  }

	  use({
	    flipFaces = false
	  } = {}) {
	    let textureUnit = -1;
	    const programActive = this.gl.renderer.currentProgram === this.id; // Avoid gl call if program already in use

	    if (!programActive) {
	      this.gl.useProgram(this.program);
	      this.gl.renderer.currentProgram = this.id;
	    } // Set only the active uniforms found in the shader


	    this.uniformLocations.forEach((location, activeUniform) => {
	      let name = activeUniform.uniformName; // get supplied uniform

	      let uniform = this.uniforms[name]; // For structs, get the specific property instead of the entire object

	      if (activeUniform.isStruct) {
	        uniform = uniform[activeUniform.structProperty];
	        name += `.${activeUniform.structProperty}`;
	      }

	      if (activeUniform.isStructArray) {
	        uniform = uniform[activeUniform.structIndex][activeUniform.structProperty];
	        name += `[${activeUniform.structIndex}].${activeUniform.structProperty}`;
	      }

	      if (!uniform) {
	        return warn(`Active uniform ${name} has not been supplied`);
	      }

	      if (uniform && uniform.value === undefined) {
	        return warn(`${name} uniform is missing a value parameter`);
	      }

	      if (uniform.value.texture) {
	        textureUnit = textureUnit + 1; // Check if texture needs to be updated

	        uniform.value.update(textureUnit);
	        return setUniform(this.gl, activeUniform.type, location, textureUnit);
	      } // For texture arrays, set uniform as an array of texture units instead of just one


	      if (uniform.value.length && uniform.value[0].texture) {
	        const textureUnits = [];
	        uniform.value.forEach(value => {
	          textureUnit = textureUnit + 1;
	          value.update(textureUnit);
	          textureUnits.push(textureUnit);
	        });
	        return setUniform(this.gl, activeUniform.type, location, textureUnits);
	      }

	      setUniform(this.gl, activeUniform.type, location, uniform.value);
	    });
	    this.applyState();
	    if (flipFaces) this.gl.renderer.setFrontFace(this.frontFace === this.gl.CCW ? this.gl.CW : this.gl.CCW);
	  }

	  remove() {
	    this.gl.deleteProgram(this.program);
	  }

	}

	function setUniform(gl, type, location, value) {
	  value = value.length ? flatten(value) : value;
	  const setValue = gl.renderer.state.uniformLocations.get(location); // Avoid redundant uniform commands

	  if (value.length) {
	    if (setValue === undefined) {
	      // clone array to store as cache
	      gl.renderer.state.uniformLocations.set(location, value.slice(0));
	    } else {
	      if (arraysEqual(setValue, value)) return; // Update cached array values

	      setValue.set(value);
	      gl.renderer.state.uniformLocations.set(location, setValue);
	    }
	  } else {
	    if (setValue === value) return;
	    gl.renderer.state.uniformLocations.set(location, value);
	  }

	  switch (type) {
	    case 5126:
	      return value.length ? gl.uniform1fv(location, value) : gl.uniform1f(location, value);
	    // FLOAT

	    case 35664:
	      return gl.uniform2fv(location, value);
	    // FLOAT_VEC2

	    case 35665:
	      return gl.uniform3fv(location, value);
	    // FLOAT_VEC3

	    case 35666:
	      return gl.uniform4fv(location, value);
	    // FLOAT_VEC4

	    case 35670: // BOOL

	    case 5124: // INT

	    case 35678: // SAMPLER_2D

	    case 35680:
	      return value.length ? gl.uniform1iv(location, value) : gl.uniform1i(location, value);
	    // SAMPLER_CUBE

	    case 35671: // BOOL_VEC2

	    case 35667:
	      return gl.uniform2iv(location, value);
	    // INT_VEC2

	    case 35672: // BOOL_VEC3

	    case 35668:
	      return gl.uniform3iv(location, value);
	    // INT_VEC3

	    case 35673: // BOOL_VEC4

	    case 35669:
	      return gl.uniform4iv(location, value);
	    // INT_VEC4

	    case 35674:
	      return gl.uniformMatrix2fv(location, false, value);
	    // FLOAT_MAT2

	    case 35675:
	      return gl.uniformMatrix3fv(location, false, value);
	    // FLOAT_MAT3

	    case 35676:
	      return gl.uniformMatrix4fv(location, false, value);
	    // FLOAT_MAT4
	  }
	}

	function addLineNumbers(string) {
	  let lines = string.split('\n');

	  for (let i = 0; i < lines.length; i++) {
	    lines[i] = i + 1 + ': ' + lines[i];
	  }

	  return lines.join('\n');
	}

	function flatten(a) {
	  const arrayLen = a.length;
	  const valueLen = a[0].length;
	  if (valueLen === undefined) return a;
	  const length = arrayLen * valueLen;
	  let value = arrayCacheF32[length];
	  if (!value) arrayCacheF32[length] = value = new Float32Array(length);

	  for (let i = 0; i < arrayLen; i++) value.set(a[i], i * valueLen);

	  return value;
	}

	function arraysEqual(a, b) {
	  if (a.length !== b.length) return false;

	  for (let i = 0, l = a.length; i < l; i++) {
	    if (a[i] !== b[i]) return false;
	  }

	  return true;
	}

	let warnCount = 0;

	function warn(message) {
	  if (warnCount > 100) return;
	  console.warn(message);
	  warnCount++;
	  if (warnCount > 100) console.warn('More than 100 program warnings - stopping logs.');
	} // TODO: Handle context loss https://www.khronos.org/webgl/wiki/HandlingContextLost
	// Not automatic - devs to use these methods manually
	// gl.colorMask( colorMask, colorMask, colorMask, colorMask );
	// gl.clearColor( r, g, b, a );
	// gl.stencilMask( stencilMask );
	// gl.stencilFunc( stencilFunc, stencilRef, stencilMask );
	// gl.stencilOp( stencilFail, stencilZFail, stencilZPass );
	// gl.clearStencil( stencil );


	const tempVec3$1 = new Vec3();

	class Renderer {
	  constructor({
	    canvas = document.createElement('canvas'),
	    width = 300,
	    height = 150,
	    dpr = 1,
	    alpha = false,
	    depth = true,
	    stencil = false,
	    antialias = false,
	    premultipliedAlpha = false,
	    preserveDrawingBuffer = false,
	    powerPreference = 'default',
	    autoClear = true,
	    webgl = 2
	  } = {}) {
	    const attributes = {
	      alpha,
	      depth,
	      stencil,
	      antialias,
	      premultipliedAlpha,
	      preserveDrawingBuffer,
	      powerPreference
	    };
	    this.dpr = dpr;
	    this.alpha = alpha;
	    this.color = true;
	    this.depth = depth;
	    this.stencil = stencil;
	    this.premultipliedAlpha = premultipliedAlpha;
	    this.autoClear = autoClear; // Attempt WebGL2 unless forced to 1, if not supported fallback to WebGL1

	    if (webgl === 2) this.gl = canvas.getContext('webgl2', attributes);
	    this.isWebgl2 = !!this.gl;

	    if (!this.gl) {
	      this.gl = canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);
	    } // Attach renderer to gl so that all classes have access to internal state functions


	    this.gl.renderer = this; // initialise size values

	    this.setSize(width, height); // Store device parameters

	    this.parameters = {};
	    this.parameters.maxTextureUnits = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS); // gl state stores to avoid redundant calls on methods used internally

	    this.state = {};
	    this.state.blendFunc = {
	      src: this.gl.ONE,
	      dst: this.gl.ZERO
	    };
	    this.state.blendEquation = {
	      modeRGB: this.gl.FUNC_ADD
	    };
	    this.state.cullFace = null;
	    this.state.frontFace = this.gl.CCW;
	    this.state.depthMask = true;
	    this.state.depthFunc = this.gl.LESS;
	    this.state.premultiplyAlpha = false;
	    this.state.flipY = false;
	    this.state.unpackAlignment = 4;
	    this.state.framebuffer = null;
	    this.state.viewport = {
	      width: null,
	      height: null
	    };
	    this.state.textureUnits = [];
	    this.state.activeTextureUnit = 0;
	    this.state.boundBuffer = null;
	    this.state.uniformLocations = new Map(); // store requested extensions

	    this.extensions = {}; // Initialise extra format types

	    if (this.isWebgl2) {
	      this.getExtension('EXT_color_buffer_float');
	      this.getExtension('OES_texture_float_linear');
	    } else {
	      this.getExtension('OES_texture_float');
	      this.getExtension('OES_texture_float_linear');
	      this.getExtension('OES_texture_half_float');
	      this.getExtension('OES_texture_half_float_linear');
	      this.getExtension('OES_element_index_uint');
	      this.getExtension('OES_standard_derivatives');
	      this.getExtension('EXT_sRGB');
	      this.getExtension('WEBGL_depth_texture');
	    } // Create method aliases using extension (WebGL1) or native if available (WebGL2)


	    this.vertexAttribDivisor = this.getExtension('ANGLE_instanced_arrays', 'vertexAttribDivisor', 'vertexAttribDivisorANGLE');
	    this.drawArraysInstanced = this.getExtension('ANGLE_instanced_arrays', 'drawArraysInstanced', 'drawArraysInstancedANGLE');
	    this.drawElementsInstanced = this.getExtension('ANGLE_instanced_arrays', 'drawElementsInstanced', 'drawElementsInstancedANGLE');
	    this.createVertexArray = this.getExtension('OES_vertex_array_object', 'createVertexArray', 'createVertexArrayOES');
	    this.bindVertexArray = this.getExtension('OES_vertex_array_object', 'bindVertexArray', 'bindVertexArrayOES');
	    this.deleteVertexArray = this.getExtension('OES_vertex_array_object', 'deleteVertexArray', 'deleteVertexArrayOES');
	  }

	  setSize(width, height) {
	    this.width = width;
	    this.height = height;
	    this.gl.canvas.width = width * this.dpr;
	    this.gl.canvas.height = height * this.dpr;
	    Object.assign(this.gl.canvas.style, {
	      width: width + 'px',
	      height: height + 'px'
	    });
	  }

	  setViewport(width, height) {
	    if (this.state.viewport.width === width && this.state.viewport.height === height) return;
	    this.state.viewport.width = width;
	    this.state.viewport.height = height;
	    this.gl.viewport(0, 0, width, height);
	  }

	  enable(id) {
	    if (this.state[id] === true) return;
	    this.gl.enable(id);
	    this.state[id] = true;
	  }

	  disable(id) {
	    if (this.state[id] === false) return;
	    this.gl.disable(id);
	    this.state[id] = false;
	  }

	  setBlendFunc(src, dst, srcAlpha, dstAlpha) {
	    if (this.state.blendFunc.src === src && this.state.blendFunc.dst === dst && this.state.blendFunc.srcAlpha === srcAlpha && this.state.blendFunc.dstAlpha === dstAlpha) return;
	    this.state.blendFunc.src = src;
	    this.state.blendFunc.dst = dst;
	    this.state.blendFunc.srcAlpha = srcAlpha;
	    this.state.blendFunc.dstAlpha = dstAlpha;
	    if (srcAlpha !== undefined) this.gl.blendFuncSeparate(src, dst, srcAlpha, dstAlpha);else this.gl.blendFunc(src, dst);
	  }

	  setBlendEquation(modeRGB, modeAlpha) {
	    if (this.state.blendEquation.modeRGB === modeRGB && this.state.blendEquation.modeAlpha === modeAlpha) return;
	    this.state.blendEquation.modeRGB = modeRGB;
	    this.state.blendEquation.modeAlpha = modeAlpha;
	    if (modeAlpha !== undefined) this.gl.blendEquationSeparate(modeRGB, modeAlpha);else this.gl.blendEquation(modeRGB);
	  }

	  setCullFace(value) {
	    if (this.state.cullFace === value) return;
	    this.state.cullFace = value;
	    this.gl.cullFace(value);
	  }

	  setFrontFace(value) {
	    if (this.state.frontFace === value) return;
	    this.state.frontFace = value;
	    this.gl.frontFace(value);
	  }

	  setDepthMask(value) {
	    if (this.state.depthMask === value) return;
	    this.state.depthMask = value;
	    this.gl.depthMask(value);
	  }

	  setDepthFunc(value) {
	    if (this.state.depthFunc === value) return;
	    this.state.depthFunc = value;
	    this.gl.depthFunc(value);
	  }

	  activeTexture(value) {
	    if (this.state.activeTextureUnit === value) return;
	    this.state.activeTextureUnit = value;
	    this.gl.activeTexture(this.gl.TEXTURE0 + value);
	  }

	  bindFramebuffer({
	    target = this.gl.FRAMEBUFFER,
	    buffer = null
	  } = {}) {
	    if (this.state.framebuffer === buffer) return;
	    this.state.framebuffer = buffer;
	    this.gl.bindFramebuffer(target, buffer);
	  }

	  getExtension(extension, webgl2Func, extFunc) {
	    // if webgl2 function supported, return func bound to gl context
	    if (webgl2Func && this.gl[webgl2Func]) return this.gl[webgl2Func].bind(this.gl); // fetch extension once only

	    if (!this.extensions[extension]) {
	      this.extensions[extension] = this.gl.getExtension(extension);
	    } // return extension if no function requested


	    if (!webgl2Func) return this.extensions[extension]; // return extension function, bound to extension

	    return this.extensions[extension][extFunc].bind(this.extensions[extension]);
	  }

	  sortOpaque(a, b) {
	    if (a.renderOrder !== b.renderOrder) {
	      return a.renderOrder - b.renderOrder;
	    } else if (a.program.id !== b.program.id) {
	      return a.program.id - b.program.id;
	    } else if (a.zDepth !== b.zDepth) {
	      return a.zDepth - b.zDepth;
	    } else {
	      return b.id - a.id;
	    }
	  }

	  sortTransparent(a, b) {
	    if (a.renderOrder !== b.renderOrder) {
	      return a.renderOrder - b.renderOrder;
	    }

	    if (a.zDepth !== b.zDepth) {
	      return b.zDepth - a.zDepth;
	    } else {
	      return b.id - a.id;
	    }
	  }

	  sortUI(a, b) {
	    if (a.renderOrder !== b.renderOrder) {
	      return a.renderOrder - b.renderOrder;
	    } else if (a.program.id !== b.program.id) {
	      return a.program.id - b.program.id;
	    } else {
	      return b.id - a.id;
	    }
	  }

	  getRenderList({
	    scene,
	    camera,
	    frustumCull,
	    sort
	  }) {
	    let renderList = [];
	    if (camera && frustumCull) camera.updateFrustum(); // Get visible

	    scene.traverse(node => {
	      if (!node.visible) return true;
	      if (!node.draw) return;

	      if (frustumCull && node.frustumCulled && camera) {
	        if (!camera.frustumIntersectsMesh(node)) return;
	      }

	      renderList.push(node);
	    });

	    if (sort) {
	      const opaque = [];
	      const transparent = []; // depthTest true

	      const ui = []; // depthTest false

	      renderList.forEach(node => {
	        // Split into the 3 render groups
	        if (!node.program.transparent) {
	          opaque.push(node);
	        } else if (node.program.depthTest) {
	          transparent.push(node);
	        } else {
	          ui.push(node);
	        }

	        node.zDepth = 0; // Only calculate z-depth if renderOrder unset and depthTest is true

	        if (node.renderOrder !== 0 || !node.program.depthTest || !camera) return; // update z-depth

	        node.worldMatrix.getTranslation(tempVec3$1);
	        tempVec3$1.applyMatrix4(camera.projectionViewMatrix);
	        node.zDepth = tempVec3$1.z;
	      });
	      opaque.sort(this.sortOpaque);
	      transparent.sort(this.sortTransparent);
	      ui.sort(this.sortUI);
	      renderList = opaque.concat(transparent, ui);
	    }

	    return renderList;
	  }

	  render({
	    scene,
	    camera,
	    target = null,
	    update = true,
	    sort = true,
	    frustumCull = true,
	    clear
	  }) {
	    if (target === null) {
	      // make sure no render target bound so draws to canvas
	      this.bindFramebuffer();
	      this.setViewport(this.width * this.dpr, this.height * this.dpr);
	    } else {
	      // bind supplied render target and update viewport
	      this.bindFramebuffer(target);
	      this.setViewport(target.width, target.height);
	    }

	    if (clear || this.autoClear && clear !== false) {
	      // Ensure depth buffer writing is enabled so it can be cleared
	      if (this.depth && (!target || !target.depth)) {
	        this.enable(this.gl.DEPTH_TEST);
	        this.setDepthMask(true);
	      }

	      this.gl.clear((this.color ? this.gl.COLOR_BUFFER_BIT : 0) | (this.depth ? this.gl.DEPTH_BUFFER_BIT : 0) | (this.stencil ? this.gl.STENCIL_BUFFER_BIT : 0));
	    } // updates all scene graph matrices


	    if (update) scene.updateMatrixWorld(); // Update camera separately if not in scene graph

	    if (camera && camera.parent === null) camera.updateMatrixWorld(); // Get render list - entails culling and sorting

	    const renderList = this.getRenderList({
	      scene,
	      camera,
	      frustumCull,
	      sort
	    });
	    renderList.forEach(node => {
	      node.draw({
	        camera
	      });
	    });
	  }

	}
	/**
	 * Copy the values from one vec4 to another
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the source vector
	 * @returns {vec4} out
	 */


	function copy$1(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  return out;
	}
	/**
	 * Set the components of a vec4 to the given values
	 *
	 * @param {vec4} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {vec4} out
	 */


	function set$1$1(out, x, y, z, w) {
	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	  out[3] = w;
	  return out;
	}
	/**
	 * Normalize a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to normalize
	 * @returns {vec4} out
	 */


	function normalize$1$1(out, a) {
	  let x = a[0];
	  let y = a[1];
	  let z = a[2];
	  let w = a[3];
	  let len = x * x + y * y + z * z + w * w;

	  if (len > 0) {
	    len = 1 / Math.sqrt(len);
	  }

	  out[0] = x * len;
	  out[1] = y * len;
	  out[2] = z * len;
	  out[3] = w * len;
	  return out;
	}
	/**
	 * Calculates the dot product of two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} dot product of a and b
	 */


	function dot$1(a, b) {
	  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
	}
	/**
	 * Set a quat to the identity quaternion
	 *
	 * @param {quat} out the receiving quaternion
	 * @returns {quat} out
	 */


	function identity(out) {
	  out[0] = 0;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  return out;
	}
	/**
	 * Sets a quat from the given angle and rotation axis,
	 * then returns it.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {vec3} axis the axis around which to rotate
	 * @param {Number} rad the angle in radians
	 * @returns {quat} out
	 **/


	function setAxisAngle(out, axis, rad) {
	  rad = rad * 0.5;
	  let s = Math.sin(rad);
	  out[0] = s * axis[0];
	  out[1] = s * axis[1];
	  out[2] = s * axis[2];
	  out[3] = Math.cos(rad);
	  return out;
	}
	/**
	 * Multiplies two quats
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {quat} out
	 */


	function multiply$1(out, a, b) {
	  let ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  let bx = b[0],
	      by = b[1],
	      bz = b[2],
	      bw = b[3];
	  out[0] = ax * bw + aw * bx + ay * bz - az * by;
	  out[1] = ay * bw + aw * by + az * bx - ax * bz;
	  out[2] = az * bw + aw * bz + ax * by - ay * bx;
	  out[3] = aw * bw - ax * bx - ay * by - az * bz;
	  return out;
	}
	/**
	 * Rotates a quaternion by the given angle about the X axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */


	function rotateX(out, a, rad) {
	  rad *= 0.5;
	  let ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  let bx = Math.sin(rad),
	      bw = Math.cos(rad);
	  out[0] = ax * bw + aw * bx;
	  out[1] = ay * bw + az * bx;
	  out[2] = az * bw - ay * bx;
	  out[3] = aw * bw - ax * bx;
	  return out;
	}
	/**
	 * Rotates a quaternion by the given angle about the Y axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */


	function rotateY(out, a, rad) {
	  rad *= 0.5;
	  let ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  let by = Math.sin(rad),
	      bw = Math.cos(rad);
	  out[0] = ax * bw - az * by;
	  out[1] = ay * bw + aw * by;
	  out[2] = az * bw + ax * by;
	  out[3] = aw * bw - ay * by;
	  return out;
	}
	/**
	 * Rotates a quaternion by the given angle about the Z axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */


	function rotateZ(out, a, rad) {
	  rad *= 0.5;
	  let ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  let bz = Math.sin(rad),
	      bw = Math.cos(rad);
	  out[0] = ax * bw + ay * bz;
	  out[1] = ay * bw - ax * bz;
	  out[2] = az * bw + aw * bz;
	  out[3] = aw * bw - az * bz;
	  return out;
	}
	/**
	 * Performs a spherical linear interpolation between two quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {quat} out
	 */


	function slerp(out, a, b, t) {
	  // benchmarks:
	  //    http://jsperf.com/quaternion-slerp-implementations
	  let ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  let bx = b[0],
	      by = b[1],
	      bz = b[2],
	      bw = b[3];
	  let omega, cosom, sinom, scale0, scale1; // calc cosine

	  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

	  if (cosom < 0.0) {
	    cosom = -cosom;
	    bx = -bx;
	    by = -by;
	    bz = -bz;
	    bw = -bw;
	  } // calculate coefficients


	  if (1.0 - cosom > 0.000001) {
	    // standard case (slerp)
	    omega = Math.acos(cosom);
	    sinom = Math.sin(omega);
	    scale0 = Math.sin((1.0 - t) * omega) / sinom;
	    scale1 = Math.sin(t * omega) / sinom;
	  } else {
	    // "from" and "to" quaternions are very close
	    //  ... so we can do a linear interpolation
	    scale0 = 1.0 - t;
	    scale1 = t;
	  } // calculate final values


	  out[0] = scale0 * ax + scale1 * bx;
	  out[1] = scale0 * ay + scale1 * by;
	  out[2] = scale0 * az + scale1 * bz;
	  out[3] = scale0 * aw + scale1 * bw;
	  return out;
	}
	/**
	 * Calculates the inverse of a quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate inverse of
	 * @returns {quat} out
	 */


	function invert(out, a) {
	  let a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
	  let invDot = dot ? 1.0 / dot : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

	  out[0] = -a0 * invDot;
	  out[1] = -a1 * invDot;
	  out[2] = -a2 * invDot;
	  out[3] = a3 * invDot;
	  return out;
	}
	/**
	 * Calculates the conjugate of a quat
	 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate conjugate of
	 * @returns {quat} out
	 */


	function conjugate(out, a) {
	  out[0] = -a[0];
	  out[1] = -a[1];
	  out[2] = -a[2];
	  out[3] = a[3];
	  return out;
	}
	/**
	 * Creates a quaternion from the given 3x3 rotation matrix.
	 *
	 * NOTE: The resultant quaternion is not normalized, so you should be sure
	 * to renormalize the quaternion yourself where necessary.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {mat3} m rotation matrix
	 * @returns {quat} out
	 * @function
	 */


	function fromMat3(out, m) {
	  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
	  // article "Quaternion Calculus and Fast Animation".
	  let fTrace = m[0] + m[4] + m[8];
	  let fRoot;

	  if (fTrace > 0.0) {
	    // |w| > 1/2, may as well choose w > 1/2
	    fRoot = Math.sqrt(fTrace + 1.0); // 2w

	    out[3] = 0.5 * fRoot;
	    fRoot = 0.5 / fRoot; // 1/(4w)

	    out[0] = (m[5] - m[7]) * fRoot;
	    out[1] = (m[6] - m[2]) * fRoot;
	    out[2] = (m[1] - m[3]) * fRoot;
	  } else {
	    // |w| <= 1/2
	    let i = 0;
	    if (m[4] > m[0]) i = 1;
	    if (m[8] > m[i * 3 + i]) i = 2;
	    let j = (i + 1) % 3;
	    let k = (i + 2) % 3;
	    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
	    out[i] = 0.5 * fRoot;
	    fRoot = 0.5 / fRoot;
	    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
	    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
	    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
	  }

	  return out;
	}
	/**
	 * Creates a quaternion from the given euler angle x, y, z.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {vec3} euler Angles to rotate around each axis in degrees.
	 * @param {String} order detailing order of operations. Default 'XYZ'.
	 * @returns {quat} out
	 * @function
	 */


	function fromEuler(out, euler, order = 'YXZ') {
	  let sx = Math.sin(euler[0] * 0.5);
	  let cx = Math.cos(euler[0] * 0.5);
	  let sy = Math.sin(euler[1] * 0.5);
	  let cy = Math.cos(euler[1] * 0.5);
	  let sz = Math.sin(euler[2] * 0.5);
	  let cz = Math.cos(euler[2] * 0.5);

	  if (order === 'XYZ') {
	    out[0] = sx * cy * cz + cx * sy * sz;
	    out[1] = cx * sy * cz - sx * cy * sz;
	    out[2] = cx * cy * sz + sx * sy * cz;
	    out[3] = cx * cy * cz - sx * sy * sz;
	  } else if (order === 'YXZ') {
	    out[0] = sx * cy * cz + cx * sy * sz;
	    out[1] = cx * sy * cz - sx * cy * sz;
	    out[2] = cx * cy * sz - sx * sy * cz;
	    out[3] = cx * cy * cz + sx * sy * sz;
	  } else if (order === 'ZXY') {
	    out[0] = sx * cy * cz - cx * sy * sz;
	    out[1] = cx * sy * cz + sx * cy * sz;
	    out[2] = cx * cy * sz + sx * sy * cz;
	    out[3] = cx * cy * cz - sx * sy * sz;
	  } else if (order === 'ZYX') {
	    out[0] = sx * cy * cz - cx * sy * sz;
	    out[1] = cx * sy * cz + sx * cy * sz;
	    out[2] = cx * cy * sz - sx * sy * cz;
	    out[3] = cx * cy * cz + sx * sy * sz;
	  } else if (order === 'YZX') {
	    out[0] = sx * cy * cz + cx * sy * sz;
	    out[1] = cx * sy * cz + sx * cy * sz;
	    out[2] = cx * cy * sz - sx * sy * cz;
	    out[3] = cx * cy * cz - sx * sy * sz;
	  } else if (order === 'XZY') {
	    out[0] = sx * cy * cz - cx * sy * sz;
	    out[1] = cx * sy * cz - sx * cy * sz;
	    out[2] = cx * cy * sz + sx * sy * cz;
	    out[3] = cx * cy * cz + sx * sy * sz;
	  }

	  return out;
	}
	/**
	 * Copy the values from one quat to another
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the source quaternion
	 * @returns {quat} out
	 * @function
	 */


	const copy$2 = copy$1;
	/**
	 * Set the components of a quat to the given values
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {quat} out
	 * @function
	 */

	const set$2 = set$1$1;
	/**
	 * Calculates the dot product of two quat's
	 *
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {Number} dot product of a and b
	 * @function
	 */

	const dot$2 = dot$1;
	/**
	 * Normalize a quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quaternion to normalize
	 * @returns {quat} out
	 * @function
	 */

	const normalize$2 = normalize$1$1;

	class Quat extends Array {
	  constructor(x = 0, y = 0, z = 0, w = 1) {
	    super(x, y, z, w);

	    this.onChange = () => {};

	    return this;
	  }

	  get x() {
	    return this[0];
	  }

	  set x(v) {
	    this[0] = v;
	    this.onChange();
	  }

	  get y() {
	    return this[1];
	  }

	  set y(v) {
	    this[1] = v;
	    this.onChange();
	  }

	  get z() {
	    return this[2];
	  }

	  set z(v) {
	    this[2] = v;
	    this.onChange();
	  }

	  get w() {
	    return this[3];
	  }

	  set w(v) {
	    this[3] = v;
	    this.onChange();
	  }

	  identity() {
	    identity(this);
	    this.onChange();
	    return this;
	  }

	  set(x, y, z, w) {
	    if (x.length) return this.copy(x);
	    set$2(this, x, y, z, w);
	    this.onChange();
	    return this;
	  }

	  rotateX(a) {
	    rotateX(this, this, a);
	    this.onChange();
	    return this;
	  }

	  rotateY(a) {
	    rotateY(this, this, a);
	    this.onChange();
	    return this;
	  }

	  rotateZ(a) {
	    rotateZ(this, this, a);
	    this.onChange();
	    return this;
	  }

	  inverse(q = this) {
	    invert(this, q);
	    this.onChange();
	    return this;
	  }

	  conjugate(q = this) {
	    conjugate(this, q);
	    this.onChange();
	    return this;
	  }

	  copy(q) {
	    copy$2(this, q);
	    this.onChange();
	    return this;
	  }

	  normalize(q = this) {
	    normalize$2(this, q);
	    this.onChange();
	    return this;
	  }

	  multiply(qA, qB) {
	    if (qB) {
	      multiply$1(this, qA, qB);
	    } else {
	      multiply$1(this, this, qA);
	    }

	    this.onChange();
	    return this;
	  }

	  dot(v) {
	    return dot$2(this, v);
	  }

	  fromMatrix3(matrix3) {
	    fromMat3(this, matrix3);
	    this.onChange();
	    return this;
	  }

	  fromEuler(euler) {
	    fromEuler(this, euler, euler.order);
	    return this;
	  }

	  fromAxisAngle(axis, a) {
	    setAxisAngle(this, axis, a);
	    return this;
	  }

	  slerp(q, t) {
	    slerp(this, this, q, t);
	    return this;
	  }

	  fromArray(a, o = 0) {
	    this[0] = a[o];
	    this[1] = a[o + 1];
	    this[2] = a[o + 2];
	    this[3] = a[o + 3];
	    return this;
	  }

	  toArray(a = [], o = 0) {
	    a[o] = this[0];
	    a[o + 1] = this[1];
	    a[o + 2] = this[2];
	    a[o + 3] = this[3];
	    return a;
	  }

	}
	/**
	 * Copy the values from one mat4 to another
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */


	function copy$3(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  out[6] = a[6];
	  out[7] = a[7];
	  out[8] = a[8];
	  out[9] = a[9];
	  out[10] = a[10];
	  out[11] = a[11];
	  out[12] = a[12];
	  out[13] = a[13];
	  out[14] = a[14];
	  out[15] = a[15];
	  return out;
	}
	/**
	 * Set the components of a mat4 to the given values
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m03 Component in column 0, row 3 position (index 3)
	 * @param {Number} m10 Component in column 1, row 0 position (index 4)
	 * @param {Number} m11 Component in column 1, row 1 position (index 5)
	 * @param {Number} m12 Component in column 1, row 2 position (index 6)
	 * @param {Number} m13 Component in column 1, row 3 position (index 7)
	 * @param {Number} m20 Component in column 2, row 0 position (index 8)
	 * @param {Number} m21 Component in column 2, row 1 position (index 9)
	 * @param {Number} m22 Component in column 2, row 2 position (index 10)
	 * @param {Number} m23 Component in column 2, row 3 position (index 11)
	 * @param {Number} m30 Component in column 3, row 0 position (index 12)
	 * @param {Number} m31 Component in column 3, row 1 position (index 13)
	 * @param {Number} m32 Component in column 3, row 2 position (index 14)
	 * @param {Number} m33 Component in column 3, row 3 position (index 15)
	 * @returns {mat4} out
	 */


	function set$3(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m02;
	  out[3] = m03;
	  out[4] = m10;
	  out[5] = m11;
	  out[6] = m12;
	  out[7] = m13;
	  out[8] = m20;
	  out[9] = m21;
	  out[10] = m22;
	  out[11] = m23;
	  out[12] = m30;
	  out[13] = m31;
	  out[14] = m32;
	  out[15] = m33;
	  return out;
	}
	/**
	 * Set a mat4 to the identity matrix
	 *
	 * @param {mat4} out the receiving matrix
	 * @returns {mat4} out
	 */


	function identity$1(out) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = 1;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = 1;
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}
	/**
	 * Inverts a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */


	function invert$1(out, a) {
	  let a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  let a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  let a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  let a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15];
	  let b00 = a00 * a11 - a01 * a10;
	  let b01 = a00 * a12 - a02 * a10;
	  let b02 = a00 * a13 - a03 * a10;
	  let b03 = a01 * a12 - a02 * a11;
	  let b04 = a01 * a13 - a03 * a11;
	  let b05 = a02 * a13 - a03 * a12;
	  let b06 = a20 * a31 - a21 * a30;
	  let b07 = a20 * a32 - a22 * a30;
	  let b08 = a20 * a33 - a23 * a30;
	  let b09 = a21 * a32 - a22 * a31;
	  let b10 = a21 * a33 - a23 * a31;
	  let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

	  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	  if (!det) {
	    return null;
	  }

	  det = 1.0 / det;
	  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
	  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
	  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
	  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
	  return out;
	}
	/**
	 * Calculates the determinant of a mat4
	 *
	 * @param {mat4} a the source matrix
	 * @returns {Number} determinant of a
	 */


	function determinant(a) {
	  let a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  let a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  let a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  let a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15];
	  let b00 = a00 * a11 - a01 * a10;
	  let b01 = a00 * a12 - a02 * a10;
	  let b02 = a00 * a13 - a03 * a10;
	  let b03 = a01 * a12 - a02 * a11;
	  let b04 = a01 * a13 - a03 * a11;
	  let b05 = a02 * a13 - a03 * a12;
	  let b06 = a20 * a31 - a21 * a30;
	  let b07 = a20 * a32 - a22 * a30;
	  let b08 = a20 * a33 - a23 * a30;
	  let b09 = a21 * a32 - a22 * a31;
	  let b10 = a21 * a33 - a23 * a31;
	  let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

	  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	}
	/**
	 * Multiplies two mat4s
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */


	function multiply$2(out, a, b) {
	  let a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  let a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  let a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  let a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15]; // Cache only the current line of the second matrix

	  let b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3];
	  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
	  b0 = b[4];
	  b1 = b[5];
	  b2 = b[6];
	  b3 = b[7];
	  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
	  b0 = b[8];
	  b1 = b[9];
	  b2 = b[10];
	  b3 = b[11];
	  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
	  b0 = b[12];
	  b1 = b[13];
	  b2 = b[14];
	  b3 = b[15];
	  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
	  return out;
	}
	/**
	 * Translate a mat4 by the given vector
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to translate
	 * @param {vec3} v vector to translate by
	 * @returns {mat4} out
	 */


	function translate(out, a, v) {
	  let x = v[0],
	      y = v[1],
	      z = v[2];
	  let a00, a01, a02, a03;
	  let a10, a11, a12, a13;
	  let a20, a21, a22, a23;

	  if (a === out) {
	    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
	    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
	    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
	    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
	  } else {
	    a00 = a[0];
	    a01 = a[1];
	    a02 = a[2];
	    a03 = a[3];
	    a10 = a[4];
	    a11 = a[5];
	    a12 = a[6];
	    a13 = a[7];
	    a20 = a[8];
	    a21 = a[9];
	    a22 = a[10];
	    a23 = a[11];
	    out[0] = a00;
	    out[1] = a01;
	    out[2] = a02;
	    out[3] = a03;
	    out[4] = a10;
	    out[5] = a11;
	    out[6] = a12;
	    out[7] = a13;
	    out[8] = a20;
	    out[9] = a21;
	    out[10] = a22;
	    out[11] = a23;
	    out[12] = a00 * x + a10 * y + a20 * z + a[12];
	    out[13] = a01 * x + a11 * y + a21 * z + a[13];
	    out[14] = a02 * x + a12 * y + a22 * z + a[14];
	    out[15] = a03 * x + a13 * y + a23 * z + a[15];
	  }

	  return out;
	}
	/**
	 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {vec3} v the vec3 to scale the matrix by
	 * @returns {mat4} out
	 **/


	function scale$1(out, a, v) {
	  let x = v[0],
	      y = v[1],
	      z = v[2];
	  out[0] = a[0] * x;
	  out[1] = a[1] * x;
	  out[2] = a[2] * x;
	  out[3] = a[3] * x;
	  out[4] = a[4] * y;
	  out[5] = a[5] * y;
	  out[6] = a[6] * y;
	  out[7] = a[7] * y;
	  out[8] = a[8] * z;
	  out[9] = a[9] * z;
	  out[10] = a[10] * z;
	  out[11] = a[11] * z;
	  out[12] = a[12];
	  out[13] = a[13];
	  out[14] = a[14];
	  out[15] = a[15];
	  return out;
	}
	/**
	 * Rotates a matrix by the given angle around the X axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */


	function rotateX$1(out, a, rad) {
	  let s = Math.sin(rad);
	  let c = Math.cos(rad);
	  let a10 = a[4];
	  let a11 = a[5];
	  let a12 = a[6];
	  let a13 = a[7];
	  let a20 = a[8];
	  let a21 = a[9];
	  let a22 = a[10];
	  let a23 = a[11];

	  if (a !== out) {
	    // If the source and destination differ, copy the unchanged rows
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	  } // Perform axis-specific matrix multiplication


	  out[4] = a10 * c + a20 * s;
	  out[5] = a11 * c + a21 * s;
	  out[6] = a12 * c + a22 * s;
	  out[7] = a13 * c + a23 * s;
	  out[8] = a20 * c - a10 * s;
	  out[9] = a21 * c - a11 * s;
	  out[10] = a22 * c - a12 * s;
	  out[11] = a23 * c - a13 * s;
	  return out;
	}
	/**
	 * Rotates a matrix by the given angle around the Y axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */


	function rotateY$1(out, a, rad) {
	  let s = Math.sin(rad);
	  let c = Math.cos(rad);
	  let a00 = a[0];
	  let a01 = a[1];
	  let a02 = a[2];
	  let a03 = a[3];
	  let a20 = a[8];
	  let a21 = a[9];
	  let a22 = a[10];
	  let a23 = a[11];

	  if (a !== out) {
	    // If the source and destination differ, copy the unchanged rows
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	  } // Perform axis-specific matrix multiplication


	  out[0] = a00 * c - a20 * s;
	  out[1] = a01 * c - a21 * s;
	  out[2] = a02 * c - a22 * s;
	  out[3] = a03 * c - a23 * s;
	  out[8] = a00 * s + a20 * c;
	  out[9] = a01 * s + a21 * c;
	  out[10] = a02 * s + a22 * c;
	  out[11] = a03 * s + a23 * c;
	  return out;
	}
	/**
	 * Rotates a matrix by the given angle around the Z axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */


	function rotateZ$1(out, a, rad) {
	  let s = Math.sin(rad);
	  let c = Math.cos(rad);
	  let a00 = a[0];
	  let a01 = a[1];
	  let a02 = a[2];
	  let a03 = a[3];
	  let a10 = a[4];
	  let a11 = a[5];
	  let a12 = a[6];
	  let a13 = a[7];

	  if (a !== out) {
	    // If the source and destination differ, copy the unchanged last row
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	  } // Perform axis-specific matrix multiplication


	  out[0] = a00 * c + a10 * s;
	  out[1] = a01 * c + a11 * s;
	  out[2] = a02 * c + a12 * s;
	  out[3] = a03 * c + a13 * s;
	  out[4] = a10 * c - a00 * s;
	  out[5] = a11 * c - a01 * s;
	  out[6] = a12 * c - a02 * s;
	  out[7] = a13 * c - a03 * s;
	  return out;
	}
	/**
	 * Returns the translation vector component of a transformation
	 *  matrix. If a matrix is built with fromRotationTranslation,
	 *  the returned vector will be the same as the translation vector
	 *  originally supplied.
	 * @param  {vec3} out Vector to receive translation component
	 * @param  {mat4} mat Matrix to be decomposed (input)
	 * @return {vec3} out
	 */


	function getTranslation(out, mat) {
	  out[0] = mat[12];
	  out[1] = mat[13];
	  out[2] = mat[14];
	  return out;
	}
	/**
	 * Returns the scaling factor component of a transformation
	 *  matrix. If a matrix is built with fromRotationTranslationScale
	 *  with a normalized Quaternion paramter, the returned vector will be
	 *  the same as the scaling vector
	 *  originally supplied.
	 * @param  {vec3} out Vector to receive scaling factor component
	 * @param  {mat4} mat Matrix to be decomposed (input)
	 * @return {vec3} out
	 */


	function getScaling(out, mat) {
	  let m11 = mat[0];
	  let m12 = mat[1];
	  let m13 = mat[2];
	  let m21 = mat[4];
	  let m22 = mat[5];
	  let m23 = mat[6];
	  let m31 = mat[8];
	  let m32 = mat[9];
	  let m33 = mat[10];
	  out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
	  out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
	  out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
	  return out;
	}

	function getMaxScaleOnAxis(mat) {
	  let m11 = mat[0];
	  let m12 = mat[1];
	  let m13 = mat[2];
	  let m21 = mat[4];
	  let m22 = mat[5];
	  let m23 = mat[6];
	  let m31 = mat[8];
	  let m32 = mat[9];
	  let m33 = mat[10];
	  const x = m11 * m11 + m12 * m12 + m13 * m13;
	  const y = m21 * m21 + m22 * m22 + m23 * m23;
	  const z = m31 * m31 + m32 * m32 + m33 * m33;
	  return Math.sqrt(Math.max(x, y, z));
	}
	/**
	 * Returns a quaternion representing the rotational component
	 *  of a transformation matrix. If a matrix is built with
	 *  fromRotationTranslation, the returned quaternion will be the
	 *  same as the quaternion originally supplied.
	 * @param {quat} out Quaternion to receive the rotation component
	 * @param {mat4} mat Matrix to be decomposed (input)
	 * @return {quat} out
	 */


	function getRotation(out, mat) {
	  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
	  let trace = mat[0] + mat[5] + mat[10];
	  let S = 0;

	  if (trace > 0) {
	    S = Math.sqrt(trace + 1.0) * 2;
	    out[3] = 0.25 * S;
	    out[0] = (mat[6] - mat[9]) / S;
	    out[1] = (mat[8] - mat[2]) / S;
	    out[2] = (mat[1] - mat[4]) / S;
	  } else if (mat[0] > mat[5] && mat[0] > mat[10]) {
	    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
	    out[3] = (mat[6] - mat[9]) / S;
	    out[0] = 0.25 * S;
	    out[1] = (mat[1] + mat[4]) / S;
	    out[2] = (mat[8] + mat[2]) / S;
	  } else if (mat[5] > mat[10]) {
	    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
	    out[3] = (mat[8] - mat[2]) / S;
	    out[0] = (mat[1] + mat[4]) / S;
	    out[1] = 0.25 * S;
	    out[2] = (mat[6] + mat[9]) / S;
	  } else {
	    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
	    out[3] = (mat[1] - mat[4]) / S;
	    out[0] = (mat[8] + mat[2]) / S;
	    out[1] = (mat[6] + mat[9]) / S;
	    out[2] = 0.25 * S;
	  }

	  return out;
	}
	/**
	 * Creates a matrix from a quaternion rotation, vector translation and vector scale
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     let quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *     mat4.scale(dest, scale)
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @param {vec3} s Scaling vector
	 * @returns {mat4} out
	 */


	function fromRotationTranslationScale(out, q, v, s) {
	  // Quaternion math
	  let x = q[0],
	      y = q[1],
	      z = q[2],
	      w = q[3];
	  let x2 = x + x;
	  let y2 = y + y;
	  let z2 = z + z;
	  let xx = x * x2;
	  let xy = x * y2;
	  let xz = x * z2;
	  let yy = y * y2;
	  let yz = y * z2;
	  let zz = z * z2;
	  let wx = w * x2;
	  let wy = w * y2;
	  let wz = w * z2;
	  let sx = s[0];
	  let sy = s[1];
	  let sz = s[2];
	  out[0] = (1 - (yy + zz)) * sx;
	  out[1] = (xy + wz) * sx;
	  out[2] = (xz - wy) * sx;
	  out[3] = 0;
	  out[4] = (xy - wz) * sy;
	  out[5] = (1 - (xx + zz)) * sy;
	  out[6] = (yz + wx) * sy;
	  out[7] = 0;
	  out[8] = (xz + wy) * sz;
	  out[9] = (yz - wx) * sz;
	  out[10] = (1 - (xx + yy)) * sz;
	  out[11] = 0;
	  out[12] = v[0];
	  out[13] = v[1];
	  out[14] = v[2];
	  out[15] = 1;
	  return out;
	}
	/**
	 * Calculates a 4x4 matrix from the given quaternion
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat} q Quaternion to create matrix from
	 *
	 * @returns {mat4} out
	 */


	function fromQuat(out, q) {
	  let x = q[0],
	      y = q[1],
	      z = q[2],
	      w = q[3];
	  let x2 = x + x;
	  let y2 = y + y;
	  let z2 = z + z;
	  let xx = x * x2;
	  let yx = y * x2;
	  let yy = y * y2;
	  let zx = z * x2;
	  let zy = z * y2;
	  let zz = z * z2;
	  let wx = w * x2;
	  let wy = w * y2;
	  let wz = w * z2;
	  out[0] = 1 - yy - zz;
	  out[1] = yx + wz;
	  out[2] = zx - wy;
	  out[3] = 0;
	  out[4] = yx - wz;
	  out[5] = 1 - xx - zz;
	  out[6] = zy + wx;
	  out[7] = 0;
	  out[8] = zx + wy;
	  out[9] = zy - wx;
	  out[10] = 1 - xx - yy;
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}
	/**
	 * Generates a perspective projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} fovy Vertical field of view in radians
	 * @param {number} aspect Aspect ratio. typically viewport width/height
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */


	function perspective(out, fovy, aspect, near, far) {
	  let f = 1.0 / Math.tan(fovy / 2);
	  let nf = 1 / (near - far);
	  out[0] = f / aspect;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = f;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = (far + near) * nf;
	  out[11] = -1;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 2 * far * near * nf;
	  out[15] = 0;
	  return out;
	}
	/**
	 * Generates a orthogonal projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} left Left bound of the frustum
	 * @param {number} right Right bound of the frustum
	 * @param {number} bottom Bottom bound of the frustum
	 * @param {number} top Top bound of the frustum
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */


	function ortho(out, left, right, bottom, top, near, far) {
	  let lr = 1 / (left - right);
	  let bt = 1 / (bottom - top);
	  let nf = 1 / (near - far);
	  out[0] = -2 * lr;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = -2 * bt;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = 2 * nf;
	  out[11] = 0;
	  out[12] = (left + right) * lr;
	  out[13] = (top + bottom) * bt;
	  out[14] = (far + near) * nf;
	  out[15] = 1;
	  return out;
	}
	/**
	 * Generates a matrix that makes something look at something else.
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {vec3} eye Position of the viewer
	 * @param {vec3} center Point the viewer is looking at
	 * @param {vec3} up vec3 pointing up
	 * @returns {mat4} out
	 */


	function targetTo(out, eye, target, up) {
	  let eyex = eye[0],
	      eyey = eye[1],
	      eyez = eye[2],
	      upx = up[0],
	      upy = up[1],
	      upz = up[2];
	  let z0 = eyex - target[0],
	      z1 = eyey - target[1],
	      z2 = eyez - target[2];
	  let len = z0 * z0 + z1 * z1 + z2 * z2;

	  if (len > 0) {
	    len = 1 / Math.sqrt(len);
	    z0 *= len;
	    z1 *= len;
	    z2 *= len;
	  }

	  let x0 = upy * z2 - upz * z1,
	      x1 = upz * z0 - upx * z2,
	      x2 = upx * z1 - upy * z0;
	  len = x0 * x0 + x1 * x1 + x2 * x2;

	  if (len > 0) {
	    len = 1 / Math.sqrt(len);
	    x0 *= len;
	    x1 *= len;
	    x2 *= len;
	  }

	  out[0] = x0;
	  out[1] = x1;
	  out[2] = x2;
	  out[3] = 0;
	  out[4] = z1 * x2 - z2 * x1;
	  out[5] = z2 * x0 - z0 * x2;
	  out[6] = z0 * x1 - z1 * x0;
	  out[7] = 0;
	  out[8] = z0;
	  out[9] = z1;
	  out[10] = z2;
	  out[11] = 0;
	  out[12] = eyex;
	  out[13] = eyey;
	  out[14] = eyez;
	  out[15] = 1;
	  return out;
	}

	class Mat4 extends Array {
	  constructor(m00 = 1, m01 = 0, m02 = 0, m03 = 0, m10 = 0, m11 = 1, m12 = 0, m13 = 0, m20 = 0, m21 = 0, m22 = 1, m23 = 0, m30 = 0, m31 = 0, m32 = 0, m33 = 1) {
	    super(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
	    return this;
	  }

	  set x(v) {
	    this[12] = v;
	  }

	  get x() {
	    return this[12];
	  }

	  set y(v) {
	    this[13] = v;
	  }

	  get y() {
	    return this[13];
	  }

	  set z(v) {
	    this[14] = v;
	  }

	  get z() {
	    return this[14];
	  }

	  set w(v) {
	    this[15] = v;
	  }

	  get w() {
	    return this[15];
	  }

	  set(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
	    if (m00.length) return this.copy(m00);
	    set$3(this, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
	    return this;
	  }

	  translate(v, m = this) {
	    translate(this, m, v);
	    return this;
	  }

	  rotateX(v, m = this) {
	    rotateX$1(this, m, v);
	    return this;
	  }

	  rotateY(v, m = this) {
	    rotateY$1(this, m, v);
	    return this;
	  }

	  rotateZ(v, m = this) {
	    rotateZ$1(this, m, v);
	    return this;
	  }

	  scale(v, m = this) {
	    scale$1(this, m, typeof v === "number" ? [v, v, v] : v);
	    return this;
	  }

	  multiply(ma, mb) {
	    if (mb) {
	      multiply$2(this, ma, mb);
	    } else {
	      multiply$2(this, this, ma);
	    }

	    return this;
	  }

	  identity() {
	    identity$1(this);
	    return this;
	  }

	  copy(m) {
	    copy$3(this, m);
	    return this;
	  }

	  fromPerspective({
	    fov,
	    aspect,
	    near,
	    far
	  } = {}) {
	    perspective(this, fov, aspect, near, far);
	    return this;
	  }

	  fromOrthogonal({
	    left,
	    right,
	    bottom,
	    top,
	    near,
	    far
	  }) {
	    ortho(this, left, right, bottom, top, near, far);
	    return this;
	  }

	  fromQuaternion(q) {
	    fromQuat(this, q);
	    return this;
	  }

	  setPosition(v) {
	    this.x = v[0];
	    this.y = v[1];
	    this.z = v[2];
	    return this;
	  }

	  inverse(m = this) {
	    invert$1(this, m);
	    return this;
	  }

	  compose(q, pos, scale) {
	    fromRotationTranslationScale(this, q, pos, scale);
	    return this;
	  }

	  getRotation(q) {
	    getRotation(q, this);
	    return this;
	  }

	  getTranslation(pos) {
	    getTranslation(pos, this);
	    return this;
	  }

	  getScaling(scale) {
	    getScaling(scale, this);
	    return this;
	  }

	  getMaxScaleOnAxis() {
	    return getMaxScaleOnAxis(this);
	  }

	  lookAt(eye, target, up) {
	    targetTo(this, eye, target, up);
	    return this;
	  }

	  determinant() {
	    return determinant(this);
	  }

	} // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)


	function fromRotationMatrix(out, m, order = 'YXZ') {
	  if (order === 'XYZ') {
	    out[1] = Math.asin(Math.min(Math.max(m[8], -1), 1));

	    if (Math.abs(m[8]) < 0.99999) {
	      out[0] = Math.atan2(-m[9], m[10]);
	      out[2] = Math.atan2(-m[4], m[0]);
	    } else {
	      out[0] = Math.atan2(m[6], m[5]);
	      out[2] = 0;
	    }
	  } else if (order === 'YXZ') {
	    out[0] = Math.asin(-Math.min(Math.max(m[9], -1), 1));

	    if (Math.abs(m[9]) < 0.99999) {
	      out[1] = Math.atan2(m[8], m[10]);
	      out[2] = Math.atan2(m[1], m[5]);
	    } else {
	      out[1] = Math.atan2(-m[2], m[0]);
	      out[2] = 0;
	    }
	  } else if (order === 'ZXY') {
	    out[0] = Math.asin(Math.min(Math.max(m[6], -1), 1));

	    if (Math.abs(m[6]) < 0.99999) {
	      out[1] = Math.atan2(-m[2], m[10]);
	      out[2] = Math.atan2(-m[4], m[5]);
	    } else {
	      out[1] = 0;
	      out[2] = Math.atan2(m[1], m[0]);
	    }
	  } else if (order === 'ZYX') {
	    out[1] = Math.asin(-Math.min(Math.max(m[2], -1), 1));

	    if (Math.abs(m[2]) < 0.99999) {
	      out[0] = Math.atan2(m[6], m[10]);
	      out[2] = Math.atan2(m[1], m[0]);
	    } else {
	      out[0] = 0;
	      out[2] = Math.atan2(-m[4], m[5]);
	    }
	  } else if (order === 'YZX') {
	    out[2] = Math.asin(Math.min(Math.max(m[1], -1), 1));

	    if (Math.abs(m[1]) < 0.99999) {
	      out[0] = Math.atan2(-m[9], m[5]);
	      out[1] = Math.atan2(-m[2], m[0]);
	    } else {
	      out[0] = 0;
	      out[1] = Math.atan2(m[8], m[10]);
	    }
	  } else if (order === 'XZY') {
	    out[2] = Math.asin(-Math.min(Math.max(m[4], -1), 1));

	    if (Math.abs(m[4]) < 0.99999) {
	      out[0] = Math.atan2(m[6], m[5]);
	      out[1] = Math.atan2(m[8], m[0]);
	    } else {
	      out[0] = Math.atan2(-m[9], m[10]);
	      out[1] = 0;
	    }
	  }

	  return out;
	}

	const tmpMat4 = new Mat4();

	class Euler extends Array {
	  constructor(x = 0, y = x, z = x, order = 'YXZ') {
	    super(x, y, z);
	    this.order = order;

	    this.onChange = () => {};

	    return this;
	  }

	  get x() {
	    return this[0];
	  }

	  set x(v) {
	    this[0] = v;
	    this.onChange();
	  }

	  get y() {
	    return this[1];
	  }

	  set y(v) {
	    this[1] = v;
	    this.onChange();
	  }

	  get z() {
	    return this[2];
	  }

	  set z(v) {
	    this[2] = v;
	    this.onChange();
	  }

	  set(x, y = x, z = x) {
	    if (x.length) return this.copy(x);
	    this[0] = x;
	    this[1] = y;
	    this[2] = z;
	    this.onChange();
	    return this;
	  }

	  copy(v) {
	    this[0] = v[0];
	    this[1] = v[1];
	    this[2] = v[2];
	    return this;
	  }

	  reorder(order) {
	    this.order = order;
	    this.onChange();
	    return this;
	  }

	  fromRotationMatrix(m, order = this.order) {
	    fromRotationMatrix(this, m, order);
	    return this;
	  }

	  fromQuaternion(q, order = this.order) {
	    tmpMat4.fromQuaternion(q);
	    return this.fromRotationMatrix(tmpMat4, order);
	  }

	}

	class Transform {
	  constructor() {
	    this.parent = null;
	    this.children = [];
	    this.visible = true;
	    this.matrix = new Mat4();
	    this.worldMatrix = new Mat4();
	    this.matrixAutoUpdate = true;
	    this.position = new Vec3();
	    this.quaternion = new Quat();
	    this.scale = new Vec3(1);
	    this.rotation = new Euler();
	    this.up = new Vec3(0, 1, 0);

	    this.rotation.onChange = () => this.quaternion.fromEuler(this.rotation);

	    this.quaternion.onChange = () => this.rotation.fromQuaternion(this.quaternion);
	  }

	  setParent(parent, notifyParent = true) {
	    if (notifyParent && this.parent && parent !== this.parent) this.parent.removeChild(this, false);
	    this.parent = parent;
	    if (notifyParent && parent) parent.addChild(this, false);
	  }

	  addChild(child, notifyChild = true) {
	    if (!~this.children.indexOf(child)) this.children.push(child);
	    if (notifyChild) child.setParent(this, false);
	  }

	  removeChild(child, notifyChild = true) {
	    if (!!~this.children.indexOf(child)) this.children.splice(this.children.indexOf(child), 1);
	    if (notifyChild) child.setParent(null, false);
	  }

	  updateMatrixWorld(force) {
	    if (this.matrixAutoUpdate) this.updateMatrix();

	    if (this.worldMatrixNeedsUpdate || force) {
	      if (this.parent === null) this.worldMatrix.copy(this.matrix);else this.worldMatrix.multiply(this.parent.worldMatrix, this.matrix);
	      this.worldMatrixNeedsUpdate = false;
	      force = true;
	    }

	    for (let i = 0, l = this.children.length; i < l; i++) {
	      this.children[i].updateMatrixWorld(force);
	    }
	  }

	  updateMatrix() {
	    this.matrix.compose(this.quaternion, this.position, this.scale);
	    this.worldMatrixNeedsUpdate = true;
	  }

	  traverse(callback) {
	    // Return true in callback to stop traversing children
	    if (callback(this)) return;

	    for (let i = 0, l = this.children.length; i < l; i++) {
	      this.children[i].traverse(callback);
	    }
	  }

	  decompose() {
	    this.matrix.getTranslation(this.position);
	    this.matrix.getRotation(this.quaternion);
	    this.matrix.getScaling(this.scale);
	    this.rotation.fromQuaternion(this.quaternion);
	  }

	  lookAt(target, invert = false) {
	    if (invert) this.matrix.lookAt(this.position, target, this.up);else this.matrix.lookAt(target, this.position, this.up);
	    this.matrix.getRotation(this.quaternion);
	    this.rotation.fromQuaternion(this.quaternion);
	  }

	}

	const tempMat4 = new Mat4();
	const tempVec3a = new Vec3();
	const tempVec3b = new Vec3();

	class Camera extends Transform {
	  constructor(gl, {
	    near = 0.1,
	    far = 100,
	    fov = 45,
	    aspect = 1,
	    left,
	    right,
	    bottom,
	    top
	  } = {}) {
	    super(gl);
	    this.near = near;
	    this.far = far;
	    this.fov = fov;
	    this.aspect = aspect;
	    this.projectionMatrix = new Mat4();
	    this.viewMatrix = new Mat4();
	    this.projectionViewMatrix = new Mat4(); // Use orthographic if values set, else default to perspective camera

	    if (left || right) this.orthographic({
	      left,
	      right,
	      bottom,
	      top
	    });else this.perspective();
	  }

	  perspective({
	    near = this.near,
	    far = this.far,
	    fov = this.fov,
	    aspect = this.aspect
	  } = {}) {
	    this.projectionMatrix.fromPerspective({
	      fov: fov * (Math.PI / 180),
	      aspect,
	      near,
	      far
	    });
	    this.type = 'perspective';
	    return this;
	  }

	  orthographic({
	    near = this.near,
	    far = this.far,
	    left = -1,
	    right = 1,
	    bottom = -1,
	    top = 1
	  } = {}) {
	    this.projectionMatrix.fromOrthogonal({
	      left,
	      right,
	      bottom,
	      top,
	      near,
	      far
	    });
	    this.type = 'orthographic';
	    return this;
	  }

	  updateMatrixWorld() {
	    super.updateMatrixWorld();
	    this.viewMatrix.inverse(this.worldMatrix); // used for sorting

	    this.projectionViewMatrix.multiply(this.projectionMatrix, this.viewMatrix);
	    return this;
	  }

	  lookAt(target) {
	    super.lookAt(target, true);
	    return this;
	  } // Project 3D coordinate to 2D point


	  project(v) {
	    v.applyMatrix4(this.viewMatrix);
	    v.applyMatrix4(this.projectionMatrix);
	    return this;
	  } // Unproject 2D point to 3D coordinate


	  unproject(v) {
	    v.applyMatrix4(tempMat4.inverse(this.projectionMatrix));
	    v.applyMatrix4(this.worldMatrix);
	    return this;
	  }

	  updateFrustum() {
	    if (!this.frustum) {
	      this.frustum = [new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3()];
	    }

	    const m = this.projectionViewMatrix;
	    this.frustum[0].set(m[3] - m[0], m[7] - m[4], m[11] - m[8]).constant = m[15] - m[12]; // -x

	    this.frustum[1].set(m[3] + m[0], m[7] + m[4], m[11] + m[8]).constant = m[15] + m[12]; // +x

	    this.frustum[2].set(m[3] + m[1], m[7] + m[5], m[11] + m[9]).constant = m[15] + m[13]; // +y

	    this.frustum[3].set(m[3] - m[1], m[7] - m[5], m[11] - m[9]).constant = m[15] - m[13]; // -y

	    this.frustum[4].set(m[3] - m[2], m[7] - m[6], m[11] - m[10]).constant = m[15] - m[14]; // +z (far)

	    this.frustum[5].set(m[3] + m[2], m[7] + m[6], m[11] + m[10]).constant = m[15] + m[14]; // -z (near)

	    for (let i = 0; i < 6; i++) {
	      const invLen = 1.0 / this.frustum[i].distance();
	      this.frustum[i].multiply(invLen);
	      this.frustum[i].constant *= invLen;
	    }
	  }

	  frustumIntersectsMesh(node) {
	    // If no position attribute, treat as frustumCulled false
	    if (!node.geometry.attributes.position) return true;
	    if (!node.geometry.bounds || node.geometry.bounds.radius === Infinity) node.geometry.computeBoundingSphere();
	    const center = tempVec3a;
	    center.copy(node.geometry.bounds.center);
	    center.applyMatrix4(node.worldMatrix);
	    const radius = node.geometry.bounds.radius * node.worldMatrix.getMaxScaleOnAxis();
	    return this.frustumIntersectsSphere(center, radius);
	  }

	  frustumIntersectsSphere(center, radius) {
	    const normal = tempVec3b;

	    for (let i = 0; i < 6; i++) {
	      const plane = this.frustum[i];
	      const distance = normal.copy(plane).dot(center) + plane.constant;
	      if (distance < -radius) return false;
	    }

	    return true;
	  }

	}
	/**
	 * Copies the upper-left 3x3 values into the given mat3.
	 *
	 * @param {mat3} out the receiving 3x3 matrix
	 * @param {mat4} a   the source 4x4 matrix
	 * @returns {mat3} out
	 */


	function fromMat4(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[4];
	  out[4] = a[5];
	  out[5] = a[6];
	  out[6] = a[8];
	  out[7] = a[9];
	  out[8] = a[10];
	  return out;
	}
	/**
	 * Copy the values from one mat3 to another
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */


	function copy$4(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  out[6] = a[6];
	  out[7] = a[7];
	  out[8] = a[8];
	  return out;
	}
	/**
	 * Set the components of a mat3 to the given values
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m10 Component in column 1, row 0 position (index 3)
	 * @param {Number} m11 Component in column 1, row 1 position (index 4)
	 * @param {Number} m12 Component in column 1, row 2 position (index 5)
	 * @param {Number} m20 Component in column 2, row 0 position (index 6)
	 * @param {Number} m21 Component in column 2, row 1 position (index 7)
	 * @param {Number} m22 Component in column 2, row 2 position (index 8)
	 * @returns {mat3} out
	 */


	function set$4(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m02;
	  out[3] = m10;
	  out[4] = m11;
	  out[5] = m12;
	  out[6] = m20;
	  out[7] = m21;
	  out[8] = m22;
	  return out;
	}
	/**
	 * Set a mat3 to the identity matrix
	 *
	 * @param {mat3} out the receiving matrix
	 * @returns {mat3} out
	 */


	function identity$2(out) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 1;
	  out[5] = 0;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 1;
	  return out;
	}
	/**
	 * Inverts a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */


	function invert$2(out, a) {
	  let a00 = a[0],
	      a01 = a[1],
	      a02 = a[2];
	  let a10 = a[3],
	      a11 = a[4],
	      a12 = a[5];
	  let a20 = a[6],
	      a21 = a[7],
	      a22 = a[8];
	  let b01 = a22 * a11 - a12 * a21;
	  let b11 = -a22 * a10 + a12 * a20;
	  let b21 = a21 * a10 - a11 * a20; // Calculate the determinant

	  let det = a00 * b01 + a01 * b11 + a02 * b21;

	  if (!det) {
	    return null;
	  }

	  det = 1.0 / det;
	  out[0] = b01 * det;
	  out[1] = (-a22 * a01 + a02 * a21) * det;
	  out[2] = (a12 * a01 - a02 * a11) * det;
	  out[3] = b11 * det;
	  out[4] = (a22 * a00 - a02 * a20) * det;
	  out[5] = (-a12 * a00 + a02 * a10) * det;
	  out[6] = b21 * det;
	  out[7] = (-a21 * a00 + a01 * a20) * det;
	  out[8] = (a11 * a00 - a01 * a10) * det;
	  return out;
	}
	/**
	 * Multiplies two mat3's
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @returns {mat3} out
	 */


	function multiply$3(out, a, b) {
	  let a00 = a[0],
	      a01 = a[1],
	      a02 = a[2];
	  let a10 = a[3],
	      a11 = a[4],
	      a12 = a[5];
	  let a20 = a[6],
	      a21 = a[7],
	      a22 = a[8];
	  let b00 = b[0],
	      b01 = b[1],
	      b02 = b[2];
	  let b10 = b[3],
	      b11 = b[4],
	      b12 = b[5];
	  let b20 = b[6],
	      b21 = b[7],
	      b22 = b[8];
	  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
	  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
	  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
	  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
	  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
	  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
	  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
	  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
	  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
	  return out;
	}
	/**
	 * Translate a mat3 by the given vector
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to translate
	 * @param {vec2} v vector to translate by
	 * @returns {mat3} out
	 */


	function translate$1(out, a, v) {
	  let a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a10 = a[3],
	      a11 = a[4],
	      a12 = a[5],
	      a20 = a[6],
	      a21 = a[7],
	      a22 = a[8],
	      x = v[0],
	      y = v[1];
	  out[0] = a00;
	  out[1] = a01;
	  out[2] = a02;
	  out[3] = a10;
	  out[4] = a11;
	  out[5] = a12;
	  out[6] = x * a00 + y * a10 + a20;
	  out[7] = x * a01 + y * a11 + a21;
	  out[8] = x * a02 + y * a12 + a22;
	  return out;
	}
	/**
	 * Rotates a mat3 by the given angle
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat3} out
	 */


	function rotate(out, a, rad) {
	  let a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a10 = a[3],
	      a11 = a[4],
	      a12 = a[5],
	      a20 = a[6],
	      a21 = a[7],
	      a22 = a[8],
	      s = Math.sin(rad),
	      c = Math.cos(rad);
	  out[0] = c * a00 + s * a10;
	  out[1] = c * a01 + s * a11;
	  out[2] = c * a02 + s * a12;
	  out[3] = c * a10 - s * a00;
	  out[4] = c * a11 - s * a01;
	  out[5] = c * a12 - s * a02;
	  out[6] = a20;
	  out[7] = a21;
	  out[8] = a22;
	  return out;
	}
	/**
	 * Scales the mat3 by the dimensions in the given vec2
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to rotate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat3} out
	 **/


	function scale$2(out, a, v) {
	  let x = v[0],
	      y = v[1];
	  out[0] = x * a[0];
	  out[1] = x * a[1];
	  out[2] = x * a[2];
	  out[3] = y * a[3];
	  out[4] = y * a[4];
	  out[5] = y * a[5];
	  out[6] = a[6];
	  out[7] = a[7];
	  out[8] = a[8];
	  return out;
	}
	/**
	 * Calculates a 3x3 matrix from the given quaternion
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {quat} q Quaternion to create matrix from
	 *
	 * @returns {mat3} out
	 */


	function fromQuat$1(out, q) {
	  let x = q[0],
	      y = q[1],
	      z = q[2],
	      w = q[3];
	  let x2 = x + x;
	  let y2 = y + y;
	  let z2 = z + z;
	  let xx = x * x2;
	  let yx = y * x2;
	  let yy = y * y2;
	  let zx = z * x2;
	  let zy = z * y2;
	  let zz = z * z2;
	  let wx = w * x2;
	  let wy = w * y2;
	  let wz = w * z2;
	  out[0] = 1 - yy - zz;
	  out[3] = yx - wz;
	  out[6] = zx + wy;
	  out[1] = yx + wz;
	  out[4] = 1 - xx - zz;
	  out[7] = zy - wx;
	  out[2] = zx - wy;
	  out[5] = zy + wx;
	  out[8] = 1 - xx - yy;
	  return out;
	}
	/**
	 * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {mat4} a Mat4 to derive the normal matrix from
	 *
	 * @returns {mat3} out
	 */


	function normalFromMat4(out, a) {
	  let a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  let a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  let a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  let a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15];
	  let b00 = a00 * a11 - a01 * a10;
	  let b01 = a00 * a12 - a02 * a10;
	  let b02 = a00 * a13 - a03 * a10;
	  let b03 = a01 * a12 - a02 * a11;
	  let b04 = a01 * a13 - a03 * a11;
	  let b05 = a02 * a13 - a03 * a12;
	  let b06 = a20 * a31 - a21 * a30;
	  let b07 = a20 * a32 - a22 * a30;
	  let b08 = a20 * a33 - a23 * a30;
	  let b09 = a21 * a32 - a22 * a31;
	  let b10 = a21 * a33 - a23 * a31;
	  let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

	  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	  if (!det) {
	    return null;
	  }

	  det = 1.0 / det;
	  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	  return out;
	}

	class Mat3 extends Array {
	  constructor(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
	    super(m00, m01, m02, m10, m11, m12, m20, m21, m22);
	    return this;
	  }

	  set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
	    if (m00.length) return this.copy(m00);
	    set$4(this, m00, m01, m02, m10, m11, m12, m20, m21, m22);
	    return this;
	  }

	  translate(v, m = this) {
	    translate$1(this, m, v);
	    return this;
	  }

	  rotate(v, m = this) {
	    rotate(this, m, v);
	    return this;
	  }

	  scale(v, m = this) {
	    scale$2(this, m, v);
	    return this;
	  }

	  multiply(ma, mb) {
	    if (mb) {
	      multiply$3(this, ma, mb);
	    } else {
	      multiply$3(this, this, ma);
	    }

	    return this;
	  }

	  identity() {
	    identity$2(this);
	    return this;
	  }

	  copy(m) {
	    copy$4(this, m);
	    return this;
	  }

	  fromMatrix4(m) {
	    fromMat4(this, m);
	    return this;
	  }

	  fromQuaternion(q) {
	    fromQuat$1(this, q);
	    return this;
	  }

	  fromBasis(vec3a, vec3b, vec3c) {
	    this.set(vec3a[0], vec3a[1], vec3a[2], vec3b[0], vec3b[1], vec3b[2], vec3c[0], vec3c[1], vec3c[2]);
	    return this;
	  }

	  inverse(m = this) {
	    invert$2(this, m);
	    return this;
	  }

	  getNormalMatrix(m) {
	    normalFromMat4(this, m);
	    return this;
	  }

	}

	let ID$2 = 0;

	class Mesh extends Transform {
	  constructor(gl, {
	    geometry,
	    program,
	    mode = gl.TRIANGLES,
	    frustumCulled = true,
	    renderOrder = 0
	  } = {}) {
	    super(gl);
	    this.gl = gl;
	    this.id = ID$2++;
	    this.geometry = geometry;
	    this.program = program;
	    this.mode = mode; // Used to skip frustum culling

	    this.frustumCulled = frustumCulled; // Override sorting to force an order

	    this.renderOrder = renderOrder;
	    this.modelViewMatrix = new Mat4();
	    this.normalMatrix = new Mat3(); // Add empty matrix uniforms to program if unset

	    if (!this.program.uniforms.modelMatrix) {
	      Object.assign(this.program.uniforms, {
	        modelMatrix: {
	          value: null
	        },
	        viewMatrix: {
	          value: null
	        },
	        modelViewMatrix: {
	          value: null
	        },
	        normalMatrix: {
	          value: null
	        },
	        projectionMatrix: {
	          value: null
	        },
	        cameraPosition: {
	          value: null
	        }
	      });
	    }
	  }

	  draw({
	    camera
	  } = {}) {
	    this.onBeforeRender && this.onBeforeRender({
	      mesh: this,
	      camera
	    }); // Set the matrix uniforms

	    if (camera) {
	      this.program.uniforms.projectionMatrix.value = camera.projectionMatrix;
	      this.program.uniforms.cameraPosition.value = camera.position;
	      this.program.uniforms.viewMatrix.value = camera.viewMatrix;
	      this.modelViewMatrix.multiply(camera.viewMatrix, this.worldMatrix);
	      this.normalMatrix.getNormalMatrix(this.modelViewMatrix);
	      this.program.uniforms.modelMatrix.value = this.worldMatrix;
	      this.program.uniforms.modelViewMatrix.value = this.modelViewMatrix;
	      this.program.uniforms.normalMatrix.value = this.normalMatrix;
	    } // determine if faces need to be flipped - when mesh scaled negatively


	    let flipFaces = this.program.cullFace && this.worldMatrix.determinant() < 0;
	    this.program.use({
	      flipFaces
	    });
	    this.geometry.draw({
	      mode: this.mode,
	      program: this.program
	    });
	    this.onAfterRender && this.onAfterRender({
	      mesh: this,
	      camera
	    });
	  }

	} // TODO: facilitate Compressed Textures
	// TODO: cube map
	// TODO: delete texture
	// TODO: should I support anisotropy? Maybe a way to extend the update easily
	// TODO: check is ArrayBuffer.isView is best way to check for Typed Arrays?
	// TODO: use texSubImage2D for updates
	// TODO: need? encoding = linearEncoding


	const emptyPixel = new Uint8Array(4);

	function isPowerOf2(value) {
	  return (value & value - 1) === 0;
	}

	let ID$3 = 0;

	class Texture {
	  constructor(gl, {
	    image,
	    target = gl.TEXTURE_2D,
	    type = gl.UNSIGNED_BYTE,
	    format = gl.RGBA,
	    internalFormat = format,
	    wrapS = gl.CLAMP_TO_EDGE,
	    wrapT = gl.CLAMP_TO_EDGE,
	    generateMipmaps = true,
	    minFilter = generateMipmaps ? gl.NEAREST_MIPMAP_LINEAR : gl.LINEAR,
	    magFilter = gl.LINEAR,
	    premultiplyAlpha = false,
	    unpackAlignment = 4,
	    flipY = true,
	    level = 0,
	    width,
	    // used for RenderTargets or Data Textures
	    height = width
	  } = {}) {
	    this.gl = gl;
	    this.id = ID$3++;
	    this.image = image;
	    this.target = target;
	    this.type = type;
	    this.format = format;
	    this.internalFormat = internalFormat;
	    this.minFilter = minFilter;
	    this.magFilter = magFilter;
	    this.wrapS = wrapS;
	    this.wrapT = wrapT;
	    this.generateMipmaps = generateMipmaps;
	    this.premultiplyAlpha = premultiplyAlpha;
	    this.unpackAlignment = unpackAlignment;
	    this.flipY = flipY;
	    this.level = level;
	    this.width = width;
	    this.height = height;
	    this.texture = this.gl.createTexture();
	    this.store = {
	      image: null
	    }; // Alias for state store to avoid redundant calls for global state

	    this.glState = this.gl.renderer.state; // State store to avoid redundant calls for per-texture state

	    this.state = {};
	    this.state.minFilter = this.gl.NEAREST_MIPMAP_LINEAR;
	    this.state.magFilter = this.gl.LINEAR;
	    this.state.wrapS = this.gl.REPEAT;
	    this.state.wrapT = this.gl.REPEAT;
	  }

	  bind() {
	    // Already bound to active texture unit
	    if (this.glState.textureUnits[this.glState.activeTextureUnit] === this.id) return;
	    this.gl.bindTexture(this.target, this.texture);
	    this.glState.textureUnits[this.glState.activeTextureUnit] = this.id;
	  }

	  update(textureUnit = 0) {
	    const needsUpdate = !(this.image === this.store.image && !this.needsUpdate); // Make sure that texture is bound to its texture unit

	    if (needsUpdate || this.glState.textureUnits[textureUnit] !== this.id) {
	      // set active texture unit to perform texture functions
	      this.gl.renderer.activeTexture(textureUnit);
	      this.bind();
	    }

	    if (!needsUpdate) return;
	    this.needsUpdate = false;

	    if (this.flipY !== this.glState.flipY) {
	      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
	      this.glState.flipY = this.flipY;
	    }

	    if (this.premultiplyAlpha !== this.glState.premultiplyAlpha) {
	      this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
	      this.glState.premultiplyAlpha = this.premultiplyAlpha;
	    }

	    if (this.unpackAlignment !== this.glState.unpackAlignment) {
	      this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, this.unpackAlignment);
	      this.glState.unpackAlignment = this.unpackAlignment;
	    }

	    if (this.minFilter !== this.state.minFilter) {
	      this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.minFilter);
	      this.state.minFilter = this.minFilter;
	    }

	    if (this.magFilter !== this.state.magFilter) {
	      this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.magFilter);
	      this.state.magFilter = this.magFilter;
	    }

	    if (this.wrapS !== this.state.wrapS) {
	      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.wrapS);
	      this.state.wrapS = this.wrapS;
	    }

	    if (this.wrapT !== this.state.wrapT) {
	      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.wrapT);
	      this.state.wrapT = this.wrapT;
	    }

	    if (this.image) {
	      if (this.image.width) {
	        this.width = this.image.width;
	        this.height = this.image.height;
	      } // TODO: all sides if cubemap
	      // gl.TEXTURE_CUBE_MAP_POSITIVE_X
	      // TODO: check is ArrayBuffer.isView is best way to check for Typed Arrays?


	      if (this.gl.renderer.isWebgl2 || ArrayBuffer.isView(this.image)) {
	        this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0
	        /* border */
	        , this.format, this.type, this.image);
	      } else {
	        this.gl.texImage2D(this.target, this.level, this.internalFormat, this.format, this.type, this.image);
	      } // TODO: support everything
	      // WebGL1:
	      // gl.texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels);
	      // gl.texImage2D(target, level, internalformat, format, type, ImageData? pixels);
	      // gl.texImage2D(target, level, internalformat, format, type, HTMLImageElement? pixels);
	      // gl.texImage2D(target, level, internalformat, format, type, HTMLCanvasElement? pixels);
	      // gl.texImage2D(target, level, internalformat, format, type, HTMLVideoElement? pixels);
	      // gl.texImage2D(target, level, internalformat, format, type, ImageBitmap? pixels);
	      // WebGL2:
	      // gl.texImage2D(target, level, internalformat, width, height, border, format, type, GLintptr offset);
	      // gl.texImage2D(target, level, internalformat, width, height, border, format, type, HTMLCanvasElement source);
	      // gl.texImage2D(target, level, internalformat, width, height, border, format, type, HTMLImageElement source);
	      // gl.texImage2D(target, level, internalformat, width, height, border, format, type, HTMLVideoElement source);
	      // gl.texImage2D(target, level, internalformat, width, height, border, format, type, ImageBitmap source);
	      // gl.texImage2D(target, level, internalformat, width, height, border, format, type, ImageData source);
	      // gl.texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView srcData, srcOffset);


	      if (this.generateMipmaps) {
	        // For WebGL1, if not a power of 2, turn off mips, set wrapping to clamp to edge and minFilter to linear
	        if (!this.gl.renderer.isWebgl2 && (!isPowerOf2(this.image.width) || !isPowerOf2(this.image.height))) {
	          this.generateMipmaps = false;
	          this.wrapS = this.wrapT = this.gl.CLAMP_TO_EDGE;
	          this.minFilter = this.gl.LINEAR;
	        } else {
	          this.gl.generateMipmap(this.target);
	        }
	      }
	    } else {
	      if (this.width) {
	        // image intentionally left null for RenderTarget
	        this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, null);
	      } else {
	        // Upload empty pixel if no image to avoid errors while image or video loading
	        this.gl.texImage2D(this.target, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
	      }
	    }

	    this.store.image = this.image;
	    this.onUpdate && this.onUpdate();
	  }

	} // TODO: multi target rendering


	class Color extends Array {
	  constructor(r = 0, g = 0, b = 0) {
	    if (typeof r === 'string') [r, g, b] = Color.hexToRGB(r);
	    super(r, g, b);
	    return this;
	  }

	  get r() {
	    return this[0];
	  }

	  set r(v) {
	    this[0] = v;
	  }

	  get g() {
	    return this[1];
	  }

	  set g(v) {
	    this[1] = v;
	  }

	  get b() {
	    return this[2];
	  }

	  set b(v) {
	    this[2] = v;
	  }

	  set(r, g, b) {
	    if (typeof r === 'string') [r, g, b] = Color.hexToRGB(r);
	    if (r.length) return this.copy(r);
	    this[0] = r;
	    this[1] = g;
	    this[2] = b;
	    return this;
	  }

	  copy(v) {
	    this[0] = v[0];
	    this[1] = v[1];
	    this[2] = v[2];
	    return this;
	  }

	  static hexToRGB(hex) {
	    if (hex.length === 4) hex = hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
	    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    if (!r) console.warn(`Unable to convert hex string ${hex} to rgb values`);
	    return [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255];
	  }

	}
	/**
	 * Copy the values from one vec2 to another
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the source vector
	 * @returns {vec2} out
	 */


	function copy$5(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  return out;
	}
	/**
	 * Set the components of a vec2 to the given values
	 *
	 * @param {vec2} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} out
	 */


	function set$5(out, x, y) {
	  out[0] = x;
	  out[1] = y;
	  return out;
	}
	/**
	 * Adds two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */


	function add$1(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  return out;
	}
	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */


	function subtract$1(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  return out;
	}
	/**
	 * Multiplies two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */


	function multiply$4(out, a, b) {
	  out[0] = a[0] * b[0];
	  out[1] = a[1] * b[1];
	  return out;
	}
	/**
	 * Divides two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */


	function divide$1(out, a, b) {
	  out[0] = a[0] / b[0];
	  out[1] = a[1] / b[1];
	  return out;
	}
	/**
	 * Scales a vec2 by a scalar number
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec2} out
	 */


	function scale$3(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  return out;
	}
	/**
	 * Calculates the euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} distance between a and b
	 */


	function distance$1(a, b) {
	  var x = b[0] - a[0],
	      y = b[1] - a[1];
	  return Math.sqrt(x * x + y * y);
	}
	/**
	 * Calculates the squared euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} squared distance between a and b
	 */


	function squaredDistance$1(a, b) {
	  var x = b[0] - a[0],
	      y = b[1] - a[1];
	  return x * x + y * y;
	}
	/**
	 * Calculates the length of a vec2
	 *
	 * @param {vec2} a vector to calculate length of
	 * @returns {Number} length of a
	 */


	function length$1(a) {
	  var x = a[0],
	      y = a[1];
	  return Math.sqrt(x * x + y * y);
	}
	/**
	 * Calculates the squared length of a vec2
	 *
	 * @param {vec2} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */


	function squaredLength$1(a) {
	  var x = a[0],
	      y = a[1];
	  return x * x + y * y;
	}
	/**
	 * Negates the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to negate
	 * @returns {vec2} out
	 */


	function negate$1(out, a) {
	  out[0] = -a[0];
	  out[1] = -a[1];
	  return out;
	}
	/**
	 * Returns the inverse of the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to invert
	 * @returns {vec2} out
	 */


	function inverse$1(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  return out;
	}
	/**
	 * Normalize a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to normalize
	 * @returns {vec2} out
	 */


	function normalize$3(out, a) {
	  var x = a[0],
	      y = a[1];
	  var len = x * x + y * y;

	  if (len > 0) {
	    //TODO: evaluate use of glm_invsqrt here?
	    len = 1 / Math.sqrt(len);
	  }

	  out[0] = a[0] * len;
	  out[1] = a[1] * len;
	  return out;
	}
	/**
	 * Calculates the dot product of two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} dot product of a and b
	 */


	function dot$3(a, b) {
	  return a[0] * b[0] + a[1] * b[1];
	}
	/**
	 * Computes the cross product of two vec2's
	 * Note that the cross product returns a scalar
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} cross product of a and b
	 */


	function cross$1(a, b) {
	  return a[0] * b[1] - a[1] * b[0];
	}
	/**
	 * Performs a linear interpolation between two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec2} out
	 */


	function lerp$1(out, a, b, t) {
	  var ax = a[0],
	      ay = a[1];
	  out[0] = ax + t * (b[0] - ax);
	  out[1] = ay + t * (b[1] - ay);
	  return out;
	}
	/**
	 * Transforms the vec2 with a mat3
	 * 3rd vector component is implicitly '1'
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat3} m matrix to transform with
	 * @returns {vec2} out
	 */


	function transformMat3(out, a, m) {
	  var x = a[0],
	      y = a[1];
	  out[0] = m[0] * x + m[3] * y + m[6];
	  out[1] = m[1] * x + m[4] * y + m[7];
	  return out;
	}
	/**
	 * Transforms the vec2 with a mat4
	 * 3rd vector component is implicitly '0'
	 * 4th vector component is implicitly '1'
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec2} out
	 */


	function transformMat4$1(out, a, m) {
	  let x = a[0];
	  let y = a[1];
	  out[0] = m[0] * x + m[4] * y + m[12];
	  out[1] = m[1] * x + m[5] * y + m[13];
	  return out;
	}
	/**
	 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
	 *
	 * @param {vec2} a The first vector.
	 * @param {vec2} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */


	function exactEquals$1(a, b) {
	  return a[0] === b[0] && a[1] === b[1];
	}

	class Vec2 extends Array {
	  constructor(x = 0, y = x) {
	    super(x, y);
	    return this;
	  }

	  get x() {
	    return this[0];
	  }

	  set x(v) {
	    this[0] = v;
	  }

	  get y() {
	    return this[1];
	  }

	  set y(v) {
	    this[1] = v;
	  }

	  set(x, y = x) {
	    if (x.length) return this.copy(x);
	    set$5(this, x, y);
	    return this;
	  }

	  copy(v) {
	    copy$5(this, v);
	    return this;
	  }

	  add(va, vb) {
	    if (vb) add$1(this, va, vb);else add$1(this, this, va);
	    return this;
	  }

	  sub(va, vb) {
	    if (vb) subtract$1(this, va, vb);else subtract$1(this, this, va);
	    return this;
	  }

	  multiply(v) {
	    if (v.length) multiply$4(this, this, v);else scale$3(this, this, v);
	    return this;
	  }

	  divide(v) {
	    if (v.length) divide$1(this, this, v);else scale$3(this, this, 1 / v);
	    return this;
	  }

	  inverse(v = this) {
	    inverse$1(this, v);
	    return this;
	  } // Can't use 'length' as Array.prototype uses it


	  len() {
	    return length$1(this);
	  }

	  distance(v) {
	    if (v) return distance$1(this, v);else return length$1(this);
	  }

	  squaredLen() {
	    return this.squaredDistance();
	  }

	  squaredDistance(v) {
	    if (v) return squaredDistance$1(this, v);else return squaredLength$1(this);
	  }

	  negate(v = this) {
	    negate$1(this, v);
	    return this;
	  }

	  cross(va, vb) {
	    return cross$1(va, vb);
	  }

	  scale(v) {
	    scale$3(this, this, v);
	    return this;
	  }

	  normalize() {
	    normalize$3(this, this);
	    return this;
	  }

	  dot(v) {
	    return dot$3(this, v);
	  }

	  equals(v) {
	    return exactEquals$1(this, v);
	  }

	  applyMatrix3(mat3) {
	    transformMat3(this, this, mat3);
	    return this;
	  }

	  applyMatrix4(mat4) {
	    transformMat4$1(this, this, mat4);
	    return this;
	  }

	  lerp(v, a) {
	    lerp$1(this, this, v, a);
	  }

	  clone() {
	    return new Vec2(this[0], this[1]);
	  }

	  fromArray(a, o = 0) {
	    this[0] = a[o];
	    this[1] = a[o + 1];
	    return this;
	  }

	  toArray(a = [], o = 0) {
	    a[o] = this[0];
	    a[o + 1] = this[1];
	    return a;
	  }

	}


	const STATE$1 = {
	  NONE: -1,
	  ROTATE: 0,
	  DOLLY: 1,
	  PAN: 2,
	  DOLLY_PAN: 3
	};
	const tempVec3$2 = new Vec3();
	const tempVec2a = new Vec2();
	const tempVec2b = new Vec2();

	function Orbit(object, {
	  element = document,
	  enabled = true,
	  target = new Vec3(),
	  ease = 0.25,
	  inertia = 0.85,
	  enableRotate = true,
	  rotateSpeed = 0.1,
	  enableZoom = true,
	  zoomSpeed = 1,
	  enablePan = true,
	  panSpeed = 0.1,
	  minPolarAngle = 0,
	  maxPolarAngle = Math.PI,
	  minAzimuthAngle = -Infinity,
	  maxAzimuthAngle = Infinity,
	  minDistance = 0,
	  maxDistance = Infinity
	} = {}) {
	  this.enabled = enabled;
	  this.target = target; // Catch attempts to disable - set to 1 so has no effect

	  ease = ease || 1;
	  inertia = inertia || 1;
	  this.minDistance = minDistance;
	  this.maxDistance = maxDistance; // current position in sphericalTarget coordinates

	  const sphericalDelta = {
	    radius: 1,
	    phi: 0,
	    theta: 0
	  };
	  const sphericalTarget = {
	    radius: 1,
	    phi: 0,
	    theta: 0
	  };
	  const spherical = {
	    radius: 1,
	    phi: 0,
	    theta: 0
	  };
	  const panDelta = new Vec3(); // Grab initial position values

	  const offset = new Vec3();
	  offset.copy(object.position).sub(this.target);
	  spherical.radius = sphericalTarget.radius = offset.distance();
	  spherical.theta = sphericalTarget.theta = Math.atan2(offset.x, offset.z);
	  spherical.phi = sphericalTarget.phi = Math.acos(Math.min(Math.max(offset.y / sphericalTarget.radius, -1), 1));

	  this.update = () => {
	    // apply delta
	    sphericalTarget.radius *= sphericalDelta.radius;
	    sphericalTarget.theta += sphericalDelta.theta;
	    sphericalTarget.phi += sphericalDelta.phi; // apply boundaries

	    sphericalTarget.theta = Math.max(minAzimuthAngle, Math.min(maxAzimuthAngle, sphericalTarget.theta));
	    sphericalTarget.phi = Math.max(minPolarAngle, Math.min(maxPolarAngle, sphericalTarget.phi));
	    sphericalTarget.radius = Math.max(this.minDistance, Math.min(this.maxDistance, sphericalTarget.radius)); // ease values

	    spherical.phi += (sphericalTarget.phi - spherical.phi) * ease;
	    spherical.theta += (sphericalTarget.theta - spherical.theta) * ease;
	    spherical.radius += (sphericalTarget.radius - spherical.radius) * ease; // apply pan to target. As offset is relative to target, it also shifts

	    this.target.add(panDelta); // apply rotation to offset

	    let sinPhiRadius = spherical.radius * Math.sin(Math.max(0.000001, spherical.phi));
	    offset.x = sinPhiRadius * Math.sin(spherical.theta);
	    offset.y = spherical.radius * Math.cos(spherical.phi);
	    offset.z = sinPhiRadius * Math.cos(spherical.theta); // Apply updated values to object

	    object.position.copy(this.target).add(offset);
	    object.lookAt(this.target); // Apply inertia to values

	    sphericalDelta.theta *= inertia;
	    sphericalDelta.phi *= inertia;
	    panDelta.multiply(inertia); // Reset scale every frame to avoid applying scale multiple times

	    sphericalDelta.radius = 1;
	  }; // Everything below here just updates panDelta and sphericalDelta
	  // Using those two objects' values, the orbit is calculated


	  const rotateStart = new Vec2();
	  const panStart = new Vec2();
	  const dollyStart = new Vec2();
	  let state = STATE$1.NONE;
	  this.mouseButtons = {
	    ORBIT: 0,
	    ZOOM: 1,
	    PAN: 2
	  };

	  function getZoomScale() {
	    return Math.pow(0.95, zoomSpeed);
	  }

	  function panLeft(distance, m) {
	    tempVec3$2.set(m[0], m[1], m[2]);
	    tempVec3$2.multiply(-distance);
	    panDelta.add(tempVec3$2);
	  }

	  function panUp(distance, m) {
	    tempVec3$2.set(m[4], m[5], m[6]);
	    tempVec3$2.multiply(distance);
	    panDelta.add(tempVec3$2);
	  }

	  const pan = (deltaX, deltaY) => {
	    let el = element === document ? document.body : element;
	    tempVec3$2.copy(object.position).sub(this.target);
	    let targetDistance = tempVec3$2.distance();
	    targetDistance *= Math.tan((object.fov || 45) / 2 * Math.PI / 180.0);
	    panLeft(2 * deltaX * targetDistance / el.clientHeight, object.matrix);
	    panUp(2 * deltaY * targetDistance / el.clientHeight, object.matrix);
	  };

	  function dolly(dollyScale) {
	    sphericalDelta.radius /= dollyScale;
	  }

	  function handleMoveRotate(x, y) {
	    tempVec2a.set(x, y);
	    tempVec2b.sub(tempVec2a, rotateStart).multiply(rotateSpeed);
	    let el = element === document ? document.body : element;
	    sphericalDelta.theta -= 2 * Math.PI * tempVec2b.x / el.clientHeight;
	    sphericalDelta.phi -= 2 * Math.PI * tempVec2b.y / el.clientHeight;
	    rotateStart.copy(tempVec2a);
	  }

	  function handleMouseMoveDolly(e) {
	    tempVec2a.set(e.clientX, e.clientY);
	    tempVec2b.sub(tempVec2a, dollyStart);

	    if (tempVec2b.y > 0) {
	      dolly(getZoomScale());
	    } else if (tempVec2b.y < 0) {
	      dolly(1 / getZoomScale());
	    }

	    dollyStart.copy(tempVec2a);
	  }

	  function handleMovePan(x, y) {
	    tempVec2a.set(x, y);
	    tempVec2b.sub(tempVec2a, panStart).multiply(panSpeed);
	    pan(tempVec2b.x, tempVec2b.y);
	    panStart.copy(tempVec2a);
	  }

	  function handleTouchStartDollyPan(e) {
	    if (enableZoom) {
	      let dx = e.touches[0].pageX - e.touches[1].pageX;
	      let dy = e.touches[0].pageY - e.touches[1].pageY;
	      let distance = Math.sqrt(dx * dx + dy * dy);
	      dollyStart.set(0, distance);
	    }

	    if (enablePan) {
	      let x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
	      let y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
	      panStart.set(x, y);
	    }
	  }

	  function handleTouchMoveDollyPan(e) {
	    if (enableZoom) {
	      let dx = e.touches[0].pageX - e.touches[1].pageX;
	      let dy = e.touches[0].pageY - e.touches[1].pageY;
	      let distance = Math.sqrt(dx * dx + dy * dy);
	      tempVec2a.set(0, distance);
	      tempVec2b.set(0, Math.pow(tempVec2a.y / dollyStart.y, zoomSpeed));
	      dolly(tempVec2b.y);
	      dollyStart.copy(tempVec2a);
	    }

	    if (enablePan) {
	      let x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
	      let y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
	      handleMovePan(x, y);
	    }
	  }

	  const onMouseDown = e => {
	    if (!this.enabled) return;

	    switch (e.button) {
	      case this.mouseButtons.ORBIT:
	        if (enableRotate === false) return;
	        rotateStart.set(e.clientX, e.clientY);
	        state = STATE$1.ROTATE;
	        break;

	      case this.mouseButtons.ZOOM:
	        if (enableZoom === false) return;
	        dollyStart.set(e.clientX, e.clientY);
	        state = STATE$1.DOLLY;
	        break;

	      case this.mouseButtons.PAN:
	        if (enablePan === false) return;
	        panStart.set(e.clientX, e.clientY);
	        state = STATE$1.PAN;
	        break;
	    }

	    if (state !== STATE$1.NONE) {
	      window.addEventListener('mousemove', onMouseMove, false);
	      window.addEventListener('mouseup', onMouseUp, false);
	    }
	  };

	  const onMouseMove = e => {
	    if (!this.enabled) return;

	    switch (state) {
	      case STATE$1.ROTATE:
	        if (enableRotate === false) return;
	        handleMoveRotate(e.clientX, e.clientY);
	        break;

	      case STATE$1.DOLLY:
	        if (enableZoom === false) return;
	        handleMouseMoveDolly(e);
	        break;

	      case STATE$1.PAN:
	        if (enablePan === false) return;
	        handleMovePan(e.clientX, e.clientY);
	        break;
	    }
	  };

	  const onMouseUp = () => {
	    if (!this.enabled) return;
	    document.removeEventListener('mousemove', onMouseMove, false);
	    document.removeEventListener('mouseup', onMouseUp, false);
	    state = STATE$1.NONE;
	  };

	  const onMouseWheel = e => {
	    if (!this.enabled || !enableZoom || state !== STATE$1.NONE && state !== STATE$1.ROTATE) return;
	    e.stopPropagation();

	    if (e.deltaY < 0) {
	      dolly(1 / getZoomScale());
	    } else if (e.deltaY > 0) {
	      dolly(getZoomScale());
	    }
	  };

	  const onTouchStart = e => {
	    if (!this.enabled) return;
	    e.preventDefault();

	    switch (e.touches.length) {
	      case 1:
	        if (enableRotate === false) return;
	        rotateStart.set(e.touches[0].pageX, e.touches[0].pageY);
	        state = STATE$1.ROTATE;
	        break;

	      case 2:
	        if (enableZoom === false && enablePan === false) return;
	        handleTouchStartDollyPan(e);
	        state = STATE$1.DOLLY_PAN;
	        break;

	      default:
	        state = STATE$1.NONE;
	    }
	  };

	  const onTouchMove = e => {
	    if (!this.enabled) return;
	    e.preventDefault();
	    e.stopPropagation();

	    switch (e.touches.length) {
	      case 1:
	        if (enableRotate === false) return;
	        handleMoveRotate(e.touches[0].pageX, e.touches[0].pageY);
	        break;

	      case 2:
	        if (enableZoom === false && enablePan === false) return;
	        handleTouchMoveDollyPan(e);
	        break;

	      default:
	        state = STATE$1.NONE;
	    }
	  };

	  const onTouchEnd = () => {
	    if (!this.enabled) return;
	    state = STATE$1.NONE;
	  };

	  const onContextMenu = e => {
	    if (!this.enabled) return;
	    e.preventDefault();
	  };

	  function addHandlers() {
	    element.addEventListener('contextmenu', onContextMenu, false);
	    element.addEventListener('mousedown', onMouseDown, false);
	    window.addEventListener('wheel', onMouseWheel, false);
	    element.addEventListener('touchstart', onTouchStart, {
	      passive: false
	    });
	    element.addEventListener('touchend', onTouchEnd, false);
	    element.addEventListener('touchmove', onTouchMove, {
	      passive: false
	    });
	  }

	  this.remove = function () {
	    element.removeEventListener('contextmenu', onContextMenu, false);
	    element.removeEventListener('mousedown', onMouseDown, false);
	    window.removeEventListener('wheel', onMouseWheel, false);
	    element.removeEventListener('touchstart', onTouchStart, false);
	    element.removeEventListener('touchend', onTouchEnd, false);
	    element.removeEventListener('touchmove', onTouchMove, false);
	    window.removeEventListener('mousemove', onMouseMove, false);
	    window.removeEventListener('mouseup', onMouseUp, false);
	  };

	  addHandlers();
	} // TODO: test orthographic


	const tempVec3a$1 = new Vec3();
	const tempVec3b$1 = new Vec3();
	const tempVec3c = new Vec3();
	const tempMat4$1 = new Mat4();
	const prevPos = new Vec3();
	const prevRot = new Quat();
	const prevScl = new Vec3();
	const nextPos = new Vec3();
	const nextRot = new Quat();
	const nextScl = new Vec3();

	const tempMat4$2 = new Mat4();
	const tmp = new Vec3();

	var $filter = arrayIteration.filter; // `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !arrayMethodHasSpeciesSupport('filter')
	}, {
	  filter: function filter(callbackfn
	  /* , thisArg */
	  ) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray


	var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
	  var targetIndex = start;
	  var sourceIndex = 0;
	  var mapFn = mapper ? bindContext(mapper, thisArg, 3) : false;
	  var element;

	  while (sourceIndex < sourceLen) {
	    if (sourceIndex in source) {
	      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

	      if (depth > 0 && isArray(element)) {
	        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
	      } else {
	        if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
	        target[targetIndex] = element;
	      }

	      targetIndex++;
	    }

	    sourceIndex++;
	  }

	  return targetIndex;
	};

	var flattenIntoArray_1 = flattenIntoArray;

	// https://github.com/tc39/proposal-flatMap


	_export({
	  target: 'Array',
	  proto: true
	}, {
	  flat: function flat()
	  /* depthArg = 1 */
	  {
	    var depthArg = arguments.length ? arguments[0] : undefined;
	    var O = toObject(this);
	    var sourceLen = toLength(O.length);
	    var A = arraySpeciesCreate(O, 0);
	    A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
	    return A;
	  }
	});

	// in popular engines, so it's moved to a separate module

	addToUnscopables('flat');

	var TO_STRING_TAG = wellKnownSymbol('toStringTag'); // ES3 wrong here

	var CORRECT_ARGUMENTS = classofRaw(function () {
	  return arguments;
	}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) {
	    /* empty */
	  }
	}; // getting tag from ES6+ `Object.prototype.toString`


	var classof = function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
	  : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag // builtinTag case
	  : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
	  : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	var test$1 = {};
	test$1[TO_STRING_TAG$1] = 'z'; // `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring

	var objectToString = String(test$1) !== '[object z]' ? function toString() {
	  return '[object ' + classof(this) + ']';
	} : test$1.toString;

	var ObjectPrototype = Object.prototype; // `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring

	if (objectToString !== ObjectPrototype.toString) {
	  redefine(ObjectPrototype, 'toString', objectToString, {
	    unsafe: true
	  });
	}

	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags


	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var TO_STRING$1 = 'toString';
	var RegExpPrototype = RegExp.prototype;
	var nativeToString = RegExpPrototype[TO_STRING$1];
	var NOT_GENERIC = fails(function () {
	  return nativeToString.call({
	    source: 'a',
	    flags: 'b'
	  }) != '/a/b';
	}); // FF44- RegExp#toString has a wrong name

	var INCORRECT_NAME = nativeToString.name != TO_STRING$1; // `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring

	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING$1, function toString() {
	    var R = anObject(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, {
	    unsafe: true
	  });
	}

	function plotCBez(ptCount, pxTolerance, Ax, Ay, Bx, By, Cx, Cy, Dx, Dy) {
	  var deltaBAx = Bx - Ax;
	  var deltaCBx = Cx - Bx;
	  var deltaDCx = Dx - Cx;
	  var deltaBAy = By - Ay;
	  var deltaCBy = Cy - By;
	  var deltaDCy = Dy - Cy; //@ts-ignore

	  var ay, by;
	  var lastX = -10000;
	  var lastY = -10000;
	  var pts = [{
	    x: Ax,
	    y: Ay
	  }];

	  for (var i = 1; i < ptCount; i++) {
	    var t = i / ptCount;

	    var _ax = Ax + deltaBAx * t;

	    var _bx = Bx + deltaCBx * t;

	    var cx = Cx + deltaDCx * t;
	    _ax += (_bx - _ax) * t;
	    _bx += (cx - _bx) * t; //

	    ay = Ay + deltaBAy * t;
	    by = By + deltaCBy * t;
	    var cy = Cy + deltaDCy * t;
	    ay += (by - ay) * t;
	    by += (cy - by) * t;
	    var x = _ax + (_bx - _ax) * t;
	    var y = ay + (by - ay) * t;
	    var dx = x - lastX;
	    var dy = y - lastY;

	    if (dx * dx + dy * dy > pxTolerance) {
	      pts.push({
	        x: x,
	        y: y
	      });
	      lastX = x;
	      lastY = y;
	    }
	  }

	  pts.push({
	    x: Dx,
	    y: Dy
	  });
	  return pts;
	}

	var Curve =
	/*#__PURE__*/
	function () {
	  function Curve(ctx) {
	    _classCallCheck(this, Curve);

	    _defineProperty(this, "ctx", void 0);

	    _defineProperty(this, "_points", void 0);

	    _defineProperty(this, "_controlPoints", void 0);

	    _defineProperty(this, "_normalizedPoints", void 0);

	    this.ctx = ctx;
	    this._points = [];
	    this._controlPoints = [];
	    this._normalizedPoints = [];
	  }

	  _createClass(Curve, [{
	    key: "computeControlPoints",
	    value: function computeControlPoints() {
	      var tension = 0.4;
	      var length = this.points.length - 1;
	      this._controlPoints = this.points.map(function (p, i, a) {
	        if (i === 0) {
	          //First point
	          return {
	            rx: a[i + 1].x * tension * 0,
	            ry: p.y + (a[i + 1].y - p.y) * tension * 0
	          };
	        } else if (i === length) {
	          //Last point
	          return {
	            lx: a[i - 1].x + (p.x - a[i - 1].x) * tension * 2,
	            ly: a[i - 1].y + (p.y - a[i - 1].y) * tension * 2
	          };
	        } else {
	          //Middle points
	          var isExtremPoint = p.y > a[i + 1].y && p.y > a[i - 1].y || p.y < a[i + 1].y && p.y < a[i - 1].y;

	          if (isExtremPoint) {
	            return {
	              lx: a[i - 1].x + (p.x - a[i - 1].x) * tension,
	              ly: p.y,
	              rx: p.x + (a[i + 1].x - p.x) * tension,
	              ry: p.y
	            };
	          } else {
	            //Create vector from before and after point
	            var vec = {
	              x: a[i - 1].x - a[i + 1].x,
	              y: a[i - 1].y - a[i + 1].y
	            };
	            var vecLength = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
	            vec.x /= vecLength;
	            vec.y /= vecLength;
	            var lRight = a[i + 1].x - p.x;
	            var lLeft = p.x - a[i - 1].x; //let _lRight = Math.sqrt(Math.pow(p.x - a[i + 1].x, 2) + Math.pow(p.y - a[i + 1].y, 2));
	            //let _lLeft = Math.sqrt(Math.pow(p.x - a[i - 1].x, 2) + Math.pow(p.y - a[i - 1].y, 2));

	            return {
	              lx: p.x + vec.x * lLeft * tension,
	              ly: p.y + vec.y * lLeft * tension,
	              rx: p.x - vec.x * lRight * tension,
	              ry: p.y - vec.y * lRight * tension
	            };
	          }
	        }
	      });
	    }
	  }, {
	    key: "drawLinear",
	    value: function drawLinear(ctx) {
	      ctx.save();
	      ctx.beginPath();

	      this._points.forEach(function (p, i, a) {
	        if (i < a.length - 1) {
	          ctx.strokeStyle = "gray";
	          ctx.moveTo(p.x, p.y);
	          ctx.lineTo(a[i + 1].x, a[i + 1].y);
	        }
	      });

	      ctx.stroke();
	      ctx.restore();
	    }
	  }, {
	    key: "drawControlPoints",
	    value: function drawControlPoints(ctx) {
	      var _this = this;

	      this._controlPoints.forEach(function (p, i) {
	        if ("rx" in p && "ry" in p) {
	          ctx.fillRect(p.rx - 1, p.ry - 1, 2, 2);
	          ctx.beginPath();
	          ctx.moveTo(_this.points[i].x, _this.points[i].y);
	          ctx.lineTo(p.rx, p.ry);
	          ctx.stroke();
	        }

	        if ("lx" in p && "ly" in p) {
	          ctx.fillRect(p.lx - 1, p.ly - 1, 2, 2);
	          ctx.beginPath();
	          ctx.moveTo(_this.points[i].x, _this.points[i].y);
	          ctx.lineTo(p.lx, p.ly);
	          ctx.stroke();
	        }
	      });
	    }
	  }, {
	    key: "drawCurve",
	    value: function drawCurve(ctx) {
	      var _this2 = this;

	      this._points.forEach(function (p, i, a) {
	        if (i < a.length - 1) {
	          ctx.moveTo(p.x, p.y);
	          ctx.bezierCurveTo(_this2._controlPoints[i].rx, _this2._controlPoints[i].ry, _this2._controlPoints[i + 1].lx, _this2._controlPoints[i + 1].ly, a[i + 1].x, a[i + 1].y);
	          ctx.stroke();
	        }
	      });
	    }
	  }, {
	    key: "drawSamplePoints",
	    value: function drawSamplePoints(ctx) {
	      ctx.save();
	      ctx.fillStyle = "red";
	      this.array.forEach(function (p) {
	        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
	      });
	      ctx.restore();
	    }
	  }, {
	    key: "draw",
	    value: function draw(ctx) {
	      var w = ctx.canvas.width;
	      var h = ctx.canvas.height;
	      ctx.clearRect(0, 0, w, h); //this.drawLinear(ctx);

	      this.drawCurve(ctx); //this.drawControlPoints(ctx);
	      //this.drawSamplePoints(ctx);
	    }
	  }, {
	    key: "array",
	    get: function get() {
	      var _this3 = this;

	      var length = this.points.length - 1;
	      var seen = {};
	      return this.points.map(function (p, i, a) {
	        if (i < length) {
	          var _length = _this3._normalizedPoints[i + 1].x - _this3._normalizedPoints[i].x;

	          return plotCBez(_length * 20, 0, p.x, p.y, _this3._controlPoints[i].rx, _this3._controlPoints[i].ry, _this3._controlPoints[i + 1].lx, _this3._controlPoints[i + 1].ly, a[i + 1].x, a[i + 1].y);
	        } else {
	          return undefined;
	        }
	      }).flat().filter(function (p) {
	        if (!p) return false;
	        var id = p.x.toString();

	        if (id in seen) {
	          return false;
	        } else {
	          //@ts-ignore
	          seen[id] = true;
	          return true;
	        }
	      }).map(function (p) {
	        return Math.max(p.y, 0);
	      });
	    }
	  }, {
	    key: "points",
	    set: function set(pts) {
	      if (this.ctx) {
	        var w = this.ctx.canvas.width;
	        var h = this.ctx.canvas.height;
	        this._normalizedPoints = pts;
	        this._points = pts.sort(function (a, b) {
	          return a.x < b.x ? -1 : 1;
	        }).map(function (p) {
	          return {
	            x: p.x * w,
	            y: (1 - p.y) * h
	          };
	        });
	        this.computeControlPoints();
	        this.draw(this.ctx);
	      } else {
	        this._points = pts.sort(function (a, b) {
	          return a.x < b.x ? -1 : 1;
	        });
	        this._normalizedPoints = this._points;
	        this.computeControlPoints();
	      }
	    },
	    get: function get() {
	      return this._points;
	    }
	  }], [{
	    key: "arrayFromPoints",
	    value: function arrayFromPoints(pts) {
	      var c = new this();
	      c.points = pts;
	      return c.array;
	    }
	  }]);

	  return Curve;
	}();

	var hoverDistance = 0.1;

	var UICurve =
	/*#__PURE__*/
	function (_UIElement) {
	  _inherits(UICurve, _UIElement);

	  function UICurve(stage, wrapper, config) {
	    var _this;

	    _classCallCheck(this, UICurve);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(UICurve).call(this, stage, wrapper, config));

	    _defineProperty(_assertThisInitialized(_this), "points", [{
	      x: 0,
	      y: 0,
	      locked: true
	    }, {
	      x: 1,
	      y: 1,
	      locked: true
	    }]);

	    _defineProperty(_assertThisInitialized(_this), "ctx", void 0);

	    _defineProperty(_assertThisInitialized(_this), "isHovered", false);

	    _defineProperty(_assertThisInitialized(_this), "isRendering", false);

	    _defineProperty(_assertThisInitialized(_this), "activePoint", void 0);

	    _defineProperty(_assertThisInitialized(_this), "mousePos", new Vec2(0, 0));

	    _defineProperty(_assertThisInitialized(_this), "mouseDownPos", new Vec2(0, 0));

	    _defineProperty(_assertThisInitialized(_this), "pointDownPos", new Vec2(0, 0));

	    _defineProperty(_assertThisInitialized(_this), "width", 0);

	    _defineProperty(_assertThisInitialized(_this), "height", 0);

	    _defineProperty(_assertThisInitialized(_this), "curve", void 0);

	    _defineProperty(_assertThisInitialized(_this), "render", function () {
	      if (_this.isRendering) requestAnimationFrame(_this.render);

	      _this.draw();
	    });

	    var title = document.createElement("h4");
	    title.innerHTML = config.title;

	    _this.wrapper.append(title);

	    var canvas = document.createElement("canvas");
	    canvas.width = 200;
	    canvas.height = 200;

	    if (config.init) {
	      var _init = config.init.bind(_assertThisInitialized(_this));

	      _this._init = function (pd) {
	        var initValue = _init(pd);

	        if (initValue) {
	          initValue[0].locked = true;
	          initValue[initValue.length - 1].locked = true;
	          _this.points = initValue;
	        }
	      };
	    }

	    var update = throttle(function () {
	      _this.update({
	        curve: _this.points.map(function (p) {
	          return {
	            x: Math.floor(p.x * 1000) / 1000,
	            y: Math.floor(p.y * 1000) / 1000
	          };
	        })
	      });
	    }, 50);
	    _this.ctx = canvas.getContext("2d");
	    _this.curve = new Curve(_this.ctx);
	    var canvasWrapper = document.createElement("div");
	    canvasWrapper.addEventListener("mouseover", function () {
	      _this.isHovered = true;
	      _this.isRendering = true;

	      _this.render();
	    });
	    canvasWrapper.addEventListener("mouseout", function () {
	      _this.isHovered = false;
	      _this.isRendering = false;
	    });
	    canvasWrapper.addEventListener("mousemove", function (ev) {
	      if (_this.isHovered) {
	        _this.mousePos.x = ev.offsetX / _this.width;
	        _this.mousePos.y = (_this.height - ev.offsetY) / _this.height;

	        if (_this.activePoint) {
	          _this.activePoint.x = _this.pointDownPos.x + (_this.mousePos.x - _this.mouseDownPos.x);
	          _this.activePoint.y = _this.pointDownPos.y + (_this.mousePos.y - _this.mouseDownPos.y);
	          update();
	        }
	      }
	    });
	    canvasWrapper.addEventListener("mousedown", function (ev) {
	      if (_this.activePoint) {
	        _this.points.splice(_this.points.indexOf(_this.activePoint), 1);
	      } else {
	        var _points = _this.points.map(function (p, i) {
	          return {
	            i: i,
	            d: Math.abs(p.x - _this.mousePos.x) + Math.abs(p.y - _this.mousePos.y)
	          };
	        }).sort(function (a, b) {
	          return a.d < b.d ? -1 : 1;
	        });

	        if (_points[0].d < hoverDistance && !_this.points[_points[0].i].locked) {
	          _this.activePoint = _this.points[_points[0].i];
	          _this.pointDownPos.x = _this.activePoint.x;
	          _this.pointDownPos.y = _this.activePoint.y;
	          _this.mouseDownPos.x = ev.offsetX / _this.width;
	          _this.mouseDownPos.y = (_this.height - ev.offsetY) / _this.height;
	        } else {
	          var _point = {
	            x: _this.mousePos.x,
	            y: _this.mousePos.y,
	            locked: false
	          };
	          _this.activePoint = _point;
	          _this.pointDownPos.x = _this.activePoint.x;
	          _this.pointDownPos.y = _this.activePoint.y;
	          _this.mouseDownPos.x = ev.offsetX / _this.width;
	          _this.mouseDownPos.y = (_this.height - ev.offsetY) / _this.height;

	          _this.points.push(_point);
	        }
	      }

	      update();
	    });
	    document.addEventListener("mouseup", function () {
	      setTimeout(function () {
	        _this.activePoint = undefined;
	      }, 100);
	    });
	    canvasWrapper.classList.add("canvas-wrapper");
	    canvasWrapper.append(canvas);

	    _this.wrapper.append(canvasWrapper);

	    var resizeObserver = new ResizeObserver(debounce(function () {
	      var b = canvasWrapper.getBoundingClientRect();
	      _this.width = b.width;
	      _this.height = b.height;
	      canvas.width = b.width;
	      canvas.height = b.height;

	      _this.draw();
	    }, 50, false));
	    resizeObserver.observe(_this.wrapper);

	    _this.wrapper.classList.add("curve-wrapper");

	    _this.draw();

	    return _this;
	  }

	  _createClass(UICurve, [{
	    key: "draw",
	    value: function draw() {
	      var _this2 = this;

	      this.points = this.points.sort(function (a, b) {
	        return a.x > b.x ? -1 : 1;
	      });
	      this.ctx.clearRect(0, 0, this.width, this.height);
	      this.ctx.lineWidth = 1;
	      this.ctx.strokeStyle = "white";
	      this.ctx.fillStyle = "white";
	      this.curve.points = this.points;

	      if (this.isHovered) {
	        this.points.forEach(function (p) {
	          _this2.ctx.beginPath();

	          var mouseDistance = Math.abs(p.x - _this2.mousePos.x) + Math.abs(p.y - _this2.mousePos.y);

	          if (!p.locked) {
	            if (mouseDistance < hoverDistance) {
	              _this2.ctx.arc(p.x * _this2.width, (1 - p.y) * _this2.height, 5, 0, 2 * Math.PI);

	              _this2.ctx.fillStyle = "white";

	              _this2.ctx.fill();
	            } else {
	              _this2.ctx.arc(p.x * _this2.width, (1 - p.y) * _this2.height, 4, 0, 2 * Math.PI);

	              _this2.ctx.fillStyle = "#4b4b4b";

	              _this2.ctx.fill();

	              _this2.ctx.arc(p.x * _this2.width, (1 - p.y) * _this2.height, 4, 0, 2 * Math.PI);

	              _this2.ctx.lineWidth = 2;

	              _this2.ctx.stroke();
	            }
	          }
	        });
	      }
	    }
	  }]);

	  return UICurve;
	}(UIElement);

	var defineProperty = objectDefineProperty.f;
	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name'; // Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name

	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var UIButton =
	/*#__PURE__*/
	function (_UIElement) {
	  _inherits(UIButton, _UIElement);

	  function UIButton(stage, wrapper, config) {
	    var _this;

	    _classCallCheck(this, UIButton);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIButton).call(this, stage, wrapper, config));

	    _defineProperty(_assertThisInitialized(_this), "listeners", void 0);

	    _defineProperty(_assertThisInitialized(_this), "element", void 0);

	    _this.element = document.createElement("button");

	    _this.element.classList.add("ui-button");

	    _this.element.name = config.title;
	    _this.element.innerHTML = config.title;

	    _this.element.addEventListener("click", function () {
	      if (config.onClick) {
	        config.onClick();
	      }
	    }, false);

	    if (config.state) {
	      _this.element.classList.add("ui-button-" + config.state);
	    }

	    _this.wrapper.append(_this.element);

	    _this.listeners = [];
	    return _this;
	  }

	  _createClass(UIButton, [{
	    key: "onClick",
	    value: function onClick(cb) {
	      this.listeners.push(cb);
	    }
	  }]);

	  return UIButton;
	}(UIElement);

	// https://tc39.github.io/ecma262/#sec-object.defineproperty

	_export({
	  target: 'Object',
	  stat: true,
	  forced: !descriptors,
	  sham: !descriptors
	}, {
	  defineProperty: objectDefineProperty.f
	});

	var logLevel = parseInt(localStorage.pdLogLevel) || 1; //0 = only errors;
	//1 = errors+warnings
	//2 = all major components
	//3 = all components

	function logger(name) {
	  function log(msg) {
	    var _logLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

	    if (logLevel < _logLevel) return;
	    console.log(name + " | " + msg);
	  }

	  log.error = function (msg) {
	    console.error(name + " | " + msg);
	  };

	  log.level = logLevel;
	  Object.defineProperty(log, "level", {
	    get: function get() {
	      return logLevel;
	    },
	    set: function set(value) {
	      logLevel = value;
	      localStorage.pdLogLevel = logLevel;
	    }
	  });
	  return log;
	}

	var log = logger("ui-slider");

	var UISlider =
	/*#__PURE__*/
	function (_UIElement) {
	  _inherits(UISlider, _UIElement);

	  function UISlider(stage, wrapper, config) {
	    var _this;

	    _classCallCheck(this, UISlider);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(UISlider).call(this, stage, wrapper, config));

	    _defineProperty(_assertThisInitialized(_this), "element", void 0);

	    var title = document.createElement("h4");
	    title.innerHTML = config.title;

	    _this.wrapper.append(title);

	    _this.element = document.createElement("input");
	    _this.element.type = "range";
	    var min = "min" in config ? config.min * 1000 : 0;
	    _this.element.min = min.toString();
	    var max = "max" in config ? config.max * 1000 : 1000;
	    _this.element.max = max.toString();
	    _this.element.step = Math.abs((max - max) / 100).toString();
	    if (config.default !== undefined) _this.element.value = "" + config.default * 1000;

	    if (config.init) {
	      var _init = config.init.bind(_assertThisInitialized(_this));

	      _this._init = function (pd) {
	        var initValue = _init(pd);

	        if (initValue !== undefined) {
	          log("init " + _this.config.title + " with value: " + initValue, 3);
	          _this.element.value = (initValue * 1000).toString();
	        }
	      };
	    }

	    _this.element.addEventListener("input", throttle(function () {
	      _this.update({
	        value: parseInt(_this.element.value) / 1000
	      });
	    }, 20), false);

	    _this.wrapper.append(_this.element);

	    return _this;
	  }

	  return UISlider;
	}(UIElement);

	var nativeExec = RegExp.prototype.exec; // This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.

	var nativeReplace = String.prototype.replace;
	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	}(); // nonparticipating capturing group, copied from es5-shim's String#split patch.


	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
	    }

	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
	    match = nativeExec.call(re, str);

	    if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }

	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	_export({
	  target: 'RegExp',
	  proto: true,
	  forced: /./.exec !== regexpExec
	}, {
	  exec: regexpExec
	});

	var SPECIES$3 = wellKnownSymbol('species');
	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;

	  re.exec = function () {
	    var result = [];
	    result.groups = {
	      a: '7'
	    };
	    return result;
	  };

	  return ''.replace(re, '$<a>') !== '7';
	}); // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper

	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;

	  re.exec = function () {
	    return originalExec.apply(this, arguments);
	  };

	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);
	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};

	    O[SYMBOL] = function () {
	      return 7;
	    };

	    return ''[KEY](O) != 7;
	  });
	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    re.exec = function () {
	      execCalled = true;
	      return null;
	    };

	    if (KEY === 'split') {
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};

	      re.constructor[SPECIES$3] = function () {
	        return re;
	      };
	    }

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS || KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return {
	            done: true,
	            value: nativeRegExpMethod.call(regexp, str, arg2)
	          };
	        }

	        return {
	          done: true,
	          value: nativeMethod.call(str, regexp, arg2)
	        };
	      }

	      return {
	        done: false
	      };
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];
	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2 // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	    // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	    ? function (string, arg) {
	      return regexMethod.call(string, this, arg);
	    } // 21.2.5.6 RegExp.prototype[@@match](string)
	    // 21.2.5.9 RegExp.prototype[@@search](string)
	    : function (string) {
	      return regexMethod.call(string, this);
	    });
	    if (sham) hide(RegExp.prototype[SYMBOL], 'sham', true);
	  }
	};

	var createMethod$3 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? S.charAt(position) : first : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$3(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$3(true)
	};

	var charAt = stringMultibyte.charAt; // `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex

	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};

	// https://tc39.github.io/ecma262/#sec-regexpexec

	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;

	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);

	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }

	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	var max$3 = Math.max;
	var min$3 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	}; // @@replace logic


	fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative) {
	  return [// `String.prototype.replace` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	  function replace(searchValue, replaceValue) {
	    var O = requireObjectCoercible(this);
	    var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	    return replacer !== undefined ? replacer.call(searchValue, O, replaceValue) : nativeReplace.call(String(O), searchValue, replaceValue);
	  }, // `RegExp.prototype[@@replace]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	  function (regexp, replaceValue) {
	    var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	    if (res.done) return res.value;
	    var rx = anObject(regexp);
	    var S = String(this);
	    var functionalReplace = typeof replaceValue === 'function';
	    if (!functionalReplace) replaceValue = String(replaceValue);
	    var global = rx.global;

	    if (global) {
	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	    }

	    var results = [];

	    while (true) {
	      var result = regexpExecAbstract(rx, S);
	      if (result === null) break;
	      results.push(result);
	      if (!global) break;
	      var matchStr = String(result[0]);
	      if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	    }

	    var accumulatedResult = '';
	    var nextSourcePosition = 0;

	    for (var i = 0; i < results.length; i++) {
	      result = results[i];
	      var matched = String(result[0]);
	      var position = max$3(min$3(toInteger(result.index), S.length), 0);
	      var captures = []; // NOTE: This is equivalent to
	      //   captures = result.slice(1).map(maybeToString)
	      // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	      // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	      // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.

	      for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));

	      var namedCaptures = result.groups;

	      if (functionalReplace) {
	        var replacerArgs = [matched].concat(captures, position, S);
	        if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	        var replacement = String(replaceValue.apply(undefined, replacerArgs));
	      } else {
	        replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	      }

	      if (position >= nextSourcePosition) {
	        accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	        nextSourcePosition = position + matched.length;
	      }
	    }

	    return accumulatedResult + S.slice(nextSourcePosition);
	  }]; // https://tc39.github.io/ecma262/#sec-getsubstitution

	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;

	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }

	    return nativeReplace.call(replacement, symbols, function (match, ch) {
	      var capture;

	      switch (ch.charAt(0)) {
	        case '$':
	          return '$';

	        case '&':
	          return matched;

	        case '`':
	          return str.slice(0, position);

	        case "'":
	          return str.slice(tailPos);

	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;

	        default:
	          // \d\d?
	          var n = +ch;
	          if (n === 0) return match;

	          if (n > m) {
	            var f = floor$1(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }

	          capture = captures[n - 1];
	      }

	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	var FAILS_ON_PRIMITIVES = fails(function () {
	  objectKeys(1);
	}); // `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys

	_export({
	  target: 'Object',
	  stat: true,
	  forced: FAILS_ON_PRIMITIVES
	}, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	var arrow = "<svg   xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><title>arrow</title><path vector-effect='non-scaling-stroke' class=\"e8984219-5450-4c25-9fd7-19488c6edbdb\" d=\"M32.4,63.5,49.72,79.92a2,2,0,0,0,2.76,0L69.6,63.5\"/><line vector-effect='non-scaling-stroke' class=\"e8984219-5450-4c25-9fd7-19488c6edbdb\" x1=\"50.89\" y1=\"18.76\" x2=\"51.11\" y2=\"81.24\"/></svg>";

	var branch = "<svg   xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><title>branch</title><path vector-effect='non-scaling-stroke'   class=\"a2b3735f-2087-4189-87da-f0a015d0ca60\" d=\"M49.59,57.35,72.15,38.69\"/><path vector-effect='non-scaling-stroke'   class=\"a2b3735f-2087-4189-87da-f0a015d0ca60\" d=\"M51.58,29.45,38,11.21\"/><path vector-effect='non-scaling-stroke'   class=\"a2b3735f-2087-4189-87da-f0a015d0ca60\" d=\"M53.14,82.61,21.78,55.74\"/><path vector-effect='non-scaling-stroke'   class=\"a2b3735f-2087-4189-87da-f0a015d0ca60\" d=\"M33.46,47.91l4,21\"/><path vector-effect='non-scaling-stroke' class=\"a2b3735f-2087-4189-87da-f0a015d0ca60\" d=\"M56,97,50,58.18a1.51,1.51,0,0,1,0-.37l1-29.44a2.15,2.15,0,0,1,.15-.71L56,16\"/></svg>";

	var checkmark = "<svg   xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><title>checkmark</title><path vector-effect='non-scaling-stroke' class=\"b50603dd-20d5-40a2-a0ce-2fdf3b92ec21\" d=\"M75.5,30,40.43,72.47a2,2,0,0,1-3.08,0L24.5,57\"/></svg>";

	var cog = "<svg   xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><title>cog</title><circle vector-effect='non-scaling-stroke' class=\"ad7f69f9-69a5-44ad-b2cc-04c61d0f2e6b\" cx=\"50.37\" cy=\"50.5\" r=\"17.23\"/><path vector-effect='non-scaling-stroke'   class=\"ad7f69f9-69a5-44ad-b2cc-04c61d0f2e6b\" d=\"M37.31,18.88l-4-8.51a2,2,0,0,1,1.42-2.82l13.86-2.7a2,2,0,0,1,2.38,1.87l.44,9.91A2,2,0,0,0,53,18.51l9,1.68A2,2,0,0,0,64.19,19l3.57-8.6a2,2,0,0,1,3-.85L80.9,16.91a2,2,0,0,1,.32,2.95L74.8,27a2,2,0,0,0-.14,2.49l5.56,7.82a2,2,0,0,0,2.46.66l8.17-3.72a2,2,0,0,1,2.79,1.44L96,48.15a2,2,0,0,1-2,2.38H83.73a2,2,0,0,0-2,1.78l-1,9.29a2,2,0,0,0,1.09,2l9.25,4.69a2,2,0,0,1,.71,3L84.15,81.64a2,2,0,0,1-3.1.16L75,75.09a2,2,0,0,0-2.66-.27l-7.39,5.4a2,2,0,0,0-.64,2.45l3.42,7.46a2,2,0,0,1-1.42,2.79l-13,2.65a2,2,0,0,1-2.4-2V84.48a2,2,0,0,0-1.76-2l-9.56-1.14a2,2,0,0,0-2,1.13l-3.73,7.88a2,2,0,0,1-2.88.84l-11.08-7a2,2,0,0,1-.2-3.24l6.55-5.38a2,2,0,0,0,.34-2.74l-6.29-8.42a2,2,0,0,0-2.61-.53l-7,4.07a2,2,0,0,1-3-1.33L4.88,53a2,2,0,0,1,2-2.4h8.84a2,2,0,0,0,2-1.76L19,38.1a2,2,0,0,0-1-2l-7.75-4.19A2,2,0,0,1,9.49,29l6.74-9.63A2,2,0,0,1,19.11,19l8.31,6.61a2,2,0,0,0,2.31.13l6.83-4.27A2,2,0,0,0,37.31,18.88Z\"/></svg>";

	var cross$2 = "<svg   xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><title>cross</title><line vector-effect='non-scaling-stroke' class=\"b0ff5687-6367-498c-a1f2-615cbbb6ed44\" x1=\"27.84\" y1=\"74.16\" x2=\"72.16\" y2=\"29.84\"/><line vector-effect='non-scaling-stroke' class=\"b0ff5687-6367-498c-a1f2-615cbbb6ed44\" x1=\"27.84\" y1=\"29.99\" x2=\"72.16\" y2=\"74.01\"/></svg>";

	var io = "<svg   xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><title>io</title><path vector-effect='non-scaling-stroke' class=\"e0a9ccea-2715-4145-8a01-24da51743c00\" d=\"M51.09,63.5,63.21,79.92a1.13,1.13,0,0,0,1.94,0l12-16.42\"/><line vector-effect='non-scaling-stroke' class=\"e0a9ccea-2715-4145-8a01-24da51743c00\" x1=\"64\" y1=\"18.5\" x2=\"64.21\" y2=\"81.5\"/><path vector-effect='non-scaling-stroke' class=\"e0a9ccea-2715-4145-8a01-24da51743c00\" d=\"M49,37.36,36.89,20.94A1.12,1.12,0,0,0,35,21L23,37.36\"/><line vector-effect='non-scaling-stroke' class=\"e0a9ccea-2715-4145-8a01-24da51743c00\" x1=\"36.11\" y1=\"82.1\" x2=\"35.89\" y2=\"19.62\"/></svg>";

	var leaf = "<svg   xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><title>leaf</title><path vector-effect='non-scaling-stroke'   class=\"ab7adba3-fb48-4859-a54d-cb6c9f9a6587\" d=\"M50.69,96.21,72.45,72.77a2.12,2.12,0,0,0,.51-1L76.9,47.6a2.07,2.07,0,0,0-.14-1.13L66,22a1.91,1.91,0,0,0-.33-.52l-15-17\"/><path vector-effect='non-scaling-stroke'   class=\"ab7adba3-fb48-4859-a54d-cb6c9f9a6587\" d=\"M53.37,96.21,31.61,72.77a2,2,0,0,1-.5-1L27.16,47.6a2.07,2.07,0,0,1,.14-1.13L38,22a1.91,1.91,0,0,1,.33-.52l15-17\"/></svg>";

	var stem = "<svg   xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><title>stem</title><path vector-effect='non-scaling-stroke'   class=\"bd59ded3-e4fb-4805-984f-6d2c1d99ad47\" d=\"M49,95.5l8.34-22.33a2,2,0,0,0-.12-1.66L43.74,47a2,2,0,0,1,0-1.86L53.37,26a2,2,0,0,0,0-1.82L43.24,4.5\"/></svg>";

	var triangle = "<svg   xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><title>triangle</title><path vector-effect='non-scaling-stroke' class=\"a76fe6c1-eb52-45ce-b93a-eee1296926b9\" d=\"M34,71.92V32.08a2,2,0,0,1,3.15-1.64L65.6,50.36a2,2,0,0,1,0,3.28L37.15,73.56A2,2,0,0,1,34,71.92Z\"/></svg>";

	var objs = {};
	var exp = {};
	var strings = {
	  arrow: arrow,
	  branch: branch,
	  checkmark: checkmark,
	  cog: cog,
	  cross: cross$2,
	  io: io,
	  leaf: leaf,
	  stem: stem,
	  triangle: triangle
	};
	var d = document.createElement("div");
	Object.keys(strings).forEach(function (key) {
	  exp[key] = {};
	  Object.defineProperty(exp, key, {
	    get: function get() {
	      if (objs[key]) {
	        return objs[key].cloneNode(true);
	      } else {
	        d.innerHTML = strings[key];
	        objs[key] = d.children[0];
	        return objs[key];
	      }
	    }
	  });
	});

	var groupState = "groupState" in localStorage ? JSON.parse(localStorage.groupState) : {};
	var incrementer = 0;

	var Group = function Group(wrapper, config) {
	  var _this = this;

	  _classCallCheck(this, Group);

	  _defineProperty(this, "wrapper", document.createElement("div"));

	  _defineProperty(this, "open", false);

	  _defineProperty(this, "id", void 0);

	  this.id = (config.title + incrementer++).replace(/\s/g, "");
	  this.wrapper.classList.add("group-wrapper");
	  var contentWrapper = document.createElement("div");
	  contentWrapper.classList.add("ui-group-content-wrapper");
	  var toppart = document.createElement("div");
	  toppart.classList.add("group-toppart");
	  var triangle = document.createElement("span");
	  triangle.appendChild(exp.triangle);
	  toppart.append(triangle);

	  var _title = document.createElement("h3");

	  _title.innerHTML = config.title;
	  toppart.append(_title);
	  wrapper.append(toppart);
	  contentWrapper.append(this.wrapper);
	  wrapper.append(contentWrapper);

	  var updateGroupState = function updateGroupState() {
	    groupState[_this.id] = _this.open;
	    localStorage.setItem("groupState", JSON.stringify(groupState));
	  };

	  var timeout;

	  var open = function open() {
	    timeout && clearTimeout(timeout);
	    toppart.classList.add("group-open");

	    _this.wrapper.classList.add("group-open");

	    contentWrapper.style.maxHeight = _this.wrapper.getBoundingClientRect().height + "px";
	    timeout = setTimeout(function () {
	      contentWrapper.style.maxHeight = "5000px";
	    }, 300);
	  };

	  var close = function close() {
	    timeout && clearTimeout(timeout);
	    toppart.classList.remove("group-open");

	    _this.wrapper.classList.remove("group-open");

	    contentWrapper.style.maxHeight = "0px";
	  };

	  toppart.addEventListener("click", function () {
	    _this.open = !_this.open;
	    _this.open ? open() : close();
	    updateGroupState();
	  }, false);

	  if (this.id in groupState) {
	    this.open = groupState[this.id];
	    groupState[this.id] && open();
	  } else {
	    this.open = !!config.open;
	    config.open && open();
	  }
	};

	var id$1 = 0;

	var UICheckbox =
	/*#__PURE__*/
	function (_UIElement) {
	  _inherits(UICheckbox, _UIElement);

	  function UICheckbox(stage, wrapper, config) {
	    var _this;

	    _classCallCheck(this, UICheckbox);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(UICheckbox).call(this, stage, wrapper, config));

	    _defineProperty(_assertThisInitialized(_this), "element", void 0);

	    var title = document.createElement("h4");
	    title.innerHTML = config.title;
	    _this.config = config;

	    if (config.init) {
	      var _init = config.init.bind(_assertThisInitialized(_this));

	      _this._init = function (pd) {
	        var initValue = _init(pd);

	        if (typeof initValue === "boolean") {
	          _this.element.checked = initValue;
	        }
	      };
	    }

	    var _id = "checkbox-id-" + id$1++;

	    _this.element = document.createElement("input");
	    _this.element.type = "checkbox";
	    _this.element.id = _id;

	    _this.element.addEventListener("click", function () {
	      _this.update({
	        enabled: _this.element.checked
	      });
	    }, false);

	    var label = document.createElement("label");
	    label.classList.add("checkbox-label");
	    label.append(exp.cross);
	    label.setAttribute("for", _id);

	    _this.wrapper.append(_this.element);

	    _this.wrapper.append(label);

	    _this.wrapper.append(title);

	    if (config.default) {
	      _this.element.checked = true;
	    }

	    return _this;
	  }

	  return UICheckbox;
	}(UIElement);

	var hoverDistance$1 = 0.1;

	var UICurve$1 =
	/*#__PURE__*/
	function (_UIElement) {
	  _inherits(UICurve, _UIElement);

	  function UICurve(stage, wrapper, config) {
	    var _this;

	    _classCallCheck(this, UICurve);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(UICurve).call(this, stage, wrapper, config));

	    _defineProperty(_assertThisInitialized(_this), "points", [{
	      x: 0,
	      y: 0,
	      locked: true
	    }, {
	      x: 0,
	      y: 0,
	      locked: false
	    }, {
	      x: 0.617,
	      y: 0.34,
	      locked: false
	    }, {
	      x: 0.617,
	      y: 0.71,
	      locked: false
	    }, {
	      x: 0,
	      y: 1,
	      locked: false
	    }]);

	    _defineProperty(_assertThisInitialized(_this), "lctx", void 0);

	    _defineProperty(_assertThisInitialized(_this), "rctx", void 0);

	    _defineProperty(_assertThisInitialized(_this), "isHovered", false);

	    _defineProperty(_assertThisInitialized(_this), "grd", void 0);

	    _defineProperty(_assertThisInitialized(_this), "isRendering", false);

	    _defineProperty(_assertThisInitialized(_this), "activePoint", void 0);

	    _defineProperty(_assertThisInitialized(_this), "mousePos", new Vec2(0, 0));

	    _defineProperty(_assertThisInitialized(_this), "mouseDownPos", new Vec2(0, 0));

	    _defineProperty(_assertThisInitialized(_this), "pointDownPos", new Vec2(0, 0));

	    _defineProperty(_assertThisInitialized(_this), "width", 0);

	    _defineProperty(_assertThisInitialized(_this), "height", 0);

	    _defineProperty(_assertThisInitialized(_this), "render", function () {
	      if (_this.isRendering) requestAnimationFrame(_this.render);

	      _this.draw();
	    });

	    var title = document.createElement("h4");
	    title.innerHTML = config.title;

	    _this.wrapper.append(title);

	    var leftCanvas = document.createElement("canvas");
	    leftCanvas.width = 100;
	    leftCanvas.height = 200;
	    _this.lctx = leftCanvas.getContext("2d");
	    var rightCanvas = document.createElement("canvas");
	    rightCanvas.width = 100;
	    rightCanvas.height = 200;
	    _this.rctx = rightCanvas.getContext("2d");
	    _this.grd = _this.rctx.createLinearGradient(0, 0, 0, _this.height);

	    _this.grd.addColorStop(0, "#65e2a0");

	    _this.grd.addColorStop(1, "#337150");

	    if (config.init) {
	      var _init = config.init.bind(_assertThisInitialized(_this));

	      _this._init = function (pd) {
	        _this.points = _init(pd);
	      };
	    }

	    var update = throttle(function () {
	      _this.update({
	        shape: _this.points.map(function (p) {
	          return {
	            x: Math.floor(p.x * 1000) / 1000,
	            y: Math.floor(p.y * 1000) / 1000
	          };
	        })
	      });
	    }, 50);
	    var canvasWrapper = document.createElement("div");
	    leftCanvas.addEventListener("mouseover", function () {
	      _this.isHovered = true;
	      _this.isRendering = true;

	      _this.render();
	    });
	    leftCanvas.addEventListener("mouseout", function () {
	      _this.isHovered = false;
	      _this.isRendering = false;
	    });
	    leftCanvas.addEventListener("mousemove", function (ev) {
	      if (_this.isHovered) {
	        _this.mousePos.x = 1 - ev.offsetX / (_this.width / 2);
	        _this.mousePos.y = (_this.height - ev.offsetY) / _this.height;

	        if (_this.activePoint) {
	          _this.activePoint.x = _this.pointDownPos.x + (_this.mousePos.x - _this.mouseDownPos.x);
	          _this.activePoint.y = _this.pointDownPos.y + (_this.mousePos.y - _this.mouseDownPos.y);
	          update();
	        }
	      }
	    });
	    leftCanvas.addEventListener("mousedown", function (ev) {
	      if (_this.activePoint) {
	        _this.points.splice(_this.points.indexOf(_this.activePoint), 1);
	      } else {
	        //Find points closest to cursor
	        var _points = _this.points.map(function (p, i) {
	          return {
	            i: i,
	            d: Math.abs(p.x - _this.mousePos.x) + Math.abs(p.y - _this.mousePos.y)
	          };
	        }).sort(function (a, b) {
	          return a.d < b.d ? -1 : 1;
	        });

	        if (_points[0].d < hoverDistance$1 && !_this.points[_points[0].i].locked) {
	          _this.activePoint = _this.points[_points[0].i];
	          _this.pointDownPos.x = _this.activePoint.x;
	          _this.pointDownPos.y = _this.activePoint.y;
	          _this.mouseDownPos.x = 1 - ev.offsetX / (_this.width / 2);
	          _this.mouseDownPos.y = (_this.height - ev.offsetY) / _this.height;
	        } else {
	          var _point = {
	            x: _this.mousePos.x,
	            y: _this.mousePos.y,
	            locked: false
	          };
	          _this.activePoint = _point;
	          _this.pointDownPos.x = _this.activePoint.x;
	          _this.pointDownPos.y = _this.activePoint.y;
	          _this.mouseDownPos.x = 1 - ev.offsetX / (_this.width / 2);
	          _this.mouseDownPos.y = (_this.height - ev.offsetY) / _this.height;

	          _this.points.push(_point);
	        }
	      }

	      update();
	    });
	    document.addEventListener("mouseup", function () {
	      setTimeout(function () {
	        _this.activePoint = undefined;
	      }, 100);
	    });
	    canvasWrapper.classList.add("canvas-wrapper");
	    canvasWrapper.append(leftCanvas);
	    canvasWrapper.append(rightCanvas);

	    _this.wrapper.append(canvasWrapper);

	    var resizeObserver = new ResizeObserver(debounce(function () {
	      var b = canvasWrapper.getBoundingClientRect();
	      _this.width = b.width;
	      _this.height = b.height;
	      leftCanvas.width = b.width / 2;
	      leftCanvas.height = b.height;
	      rightCanvas.width = b.width / 2;
	      rightCanvas.height = b.height;
	      _this.grd = _this.rctx.createLinearGradient(0, 0, 0, _this.height);

	      _this.grd.addColorStop(0, "#65e2a0");

	      _this.grd.addColorStop(1, "#337150");

	      _this.draw();
	    }, 200, false));
	    resizeObserver.observe(_this.wrapper);

	    _this.wrapper.classList.add("leaf-creator-wrapper");

	    _this.draw();

	    return _this;
	  } //Convert normalized to actual pixel/canvas coordinates


	  _createClass(UICurve, [{
	    key: "draw",
	    value: function draw() {
	      var _this2 = this;

	      //Those are still normalized, 0 > x < 1
	      this.points = this.points.sort(function (a, b) {
	        return a.y < b.y ? -1 : 1;
	      });
	      var _points = this._points;
	      this.lctx.clearRect(0, 0, this.width / 2, this.height);
	      this.rctx.clearRect(0, 0, this.width / 2, this.height);
	      this.lctx.lineWidth = 2;
	      this.lctx.strokeStyle = "white";
	      this.lctx.fillStyle = "white"; //Draw left lines

	      this.lctx.beginPath();
	      this.lctx.moveTo(_points[0].x, this.height);
	      this.lctx.lineTo(_points[0].x, _points[0].y);

	      _points.forEach(function (p, i, a) {
	        if (i < a.length - 1) {
	          _this2.lctx.lineTo(p.x, p.y);
	        }
	      });

	      this.lctx.lineTo(_points[_points.length - 1].x, _points[_points.length - 1].y);
	      this.lctx.lineTo(this.width / 2, _points[_points.length - 1].y);
	      this.lctx.stroke();

	      if (this.isHovered) {
	        _points.forEach(function (p, i) {
	          //Need to get the normalized position to get distance from mousePos
	          var mouseDistance = Math.abs(_this2.points[i].x - _this2.mousePos.x) + Math.abs(_this2.points[i].y - _this2.mousePos.y);

	          _this2.lctx.beginPath();

	          if (!p.locked) {
	            if (mouseDistance < hoverDistance$1) {
	              _this2.lctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);

	              _this2.lctx.fillStyle = "white";

	              _this2.lctx.fill();
	            } else {
	              _this2.lctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);

	              _this2.lctx.fillStyle = "#4b4b4b";

	              _this2.lctx.fill();

	              _this2.lctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);

	              _this2.lctx.lineWidth = 2;

	              _this2.lctx.stroke();
	            }
	          }
	        });
	      } //Draw green leaf


	      this.rctx.beginPath();
	      this.rctx.moveTo(0, this.height);
	      this.rctx.lineTo(this.width / 2 - _points[0].x, this.height);
	      this.rctx.lineTo(this.width / 2 - _points[0].x, _points[0].y);

	      _points.forEach(function (p, i) {
	        if (i > 0) {
	          _this2.rctx.lineTo(_this2.width / 2 - p.x, p.y);
	        }
	      });

	      this.rctx.lineTo(0, _points[_points.length - 1].y);
	      this.rctx.closePath();
	      this.rctx.fillStyle = this.grd;
	      this.rctx.fill();
	    }
	  }, {
	    key: "_points",
	    get: function get() {
	      var _this3 = this;

	      return this.points.map(function (p) {
	        return {
	          x: (1 - p.x) * (_this3.width / 2),
	          y: _this3.height - p.y * _this3.height
	        };
	      });
	    }
	  }]);

	  return UICurve;
	}(UIElement);

	var UINumber =
	/*#__PURE__*/
	function (_UIElement) {
	  _inherits(UINumber, _UIElement);

	  function UINumber(stage, wrapper, config) {
	    var _this;

	    _classCallCheck(this, UINumber);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(UINumber).call(this, stage, wrapper, config));

	    _defineProperty(_assertThisInitialized(_this), "element", void 0);

	    _defineProperty(_assertThisInitialized(_this), "title", void 0);

	    _defineProperty(_assertThisInitialized(_this), "_value", 1);

	    _this.title = document.createElement("h4");
	    _this.title.innerHTML = config.title;

	    _this.title.classList.add("ui-number-title");

	    _this.wrapper.append(_this.title);

	    var buttonWrapper = document.createElement("div");
	    buttonWrapper.classList.add("ui-number-button-wrapper");
	    var subtractButton = document.createElement("button");
	    subtractButton.innerHTML = "-";
	    subtractButton.addEventListener("click", function () {
	      _this.value--;
	    });
	    buttonWrapper.append(subtractButton);
	    var addButton = document.createElement("button");
	    addButton.innerHTML = "+";
	    addButton.addEventListener("click", function () {
	      _this.value++;
	    });
	    buttonWrapper.append(addButton);

	    if (config.init) {
	      var _init = config.init.bind(_assertThisInitialized(_this));

	      _this._init = function (pd) {
	        var initValue = _init(pd);

	        if (initValue !== undefined) {
	          _this._value = initValue;
	          _this.element.value = initValue.toString();
	        }
	      };
	    }

	    _this.element = document.createElement("input");
	    _this.element.title = config.title;
	    _this.element.type = "number";
	    _this.element.value = config.default !== undefined ? _this.minMax(config.default).toString() : _this.minMax(1).toString();
	    _this._value = parseInt(_this.element.value);
	    _this.element.max = config.max !== undefined ? config.max.toString() : "10";
	    _this.element.min = config.min !== undefined ? config.min.toString() : "0";

	    _this.element.addEventListener("input", function () {
	      _this.value = parseInt(_this.element.value);
	    });

	    _this.element.addEventListener("click", function () {
	      this.select();
	    });

	    buttonWrapper.append(_this.element);

	    _this.wrapper.append(buttonWrapper);

	    return _this;
	  }

	  _createClass(UINumber, [{
	    key: "minMax",
	    value: function minMax(v) {
	      return Math.max(Math.min(v, this.config.max || 10), this.config.min || 0);
	    }
	  }, {
	    key: "value",
	    get: function get() {
	      return this._value;
	    },
	    set: function set(v) {
	      var _v = this.minMax(v);

	      if (!isNaN(_v)) {
	        this._value = _v;
	        this.element.value = _v.toString();
	        this.update({
	          value: _v
	        });
	      }
	    }
	  }]);

	  return UINumber;
	}(UIElement);

	var iterators = {};

	var correctPrototypeGetter = !fails(function () {
	  function F() {
	    /* empty */
	  }

	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var ObjectPrototype$1 = Object.prototype; // `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof

	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];

	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  }

	  return O instanceof Object ? ObjectPrototype$1 : null;
	};

	var ITERATOR = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	var returnThis = function () {
	  return this;
	}; // `%IteratorPrototype%` object
	// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object


	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys(); // Safari 8 has buggy iterators w/o `next`

	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	if (IteratorPrototype == undefined) IteratorPrototype = {}; // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()

	if ( !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var defineProperty$1 = objectDefineProperty.f;
	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
	    defineProperty$1(it, TO_STRING_TAG$2, {
	      configurable: true,
	      value: TAG
	    });
	  }
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

	var returnThis$1 = function () {
	  return this;
	};

	var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, {
	    next: createPropertyDescriptor(1, next)
	  });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  }

	  return it;
	};

	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.

	/* eslint-disable no-proto */

	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;

	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) {
	    /* empty */
	  }

	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$1 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$2 = function () {
	  return this;
	};

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];

	    switch (KIND) {
	      case KEYS:
	        return function keys() {
	          return new IteratorConstructor(this, KIND);
	        };

	      case VALUES:
	        return function values() {
	          return new IteratorConstructor(this, KIND);
	        };

	      case ENTRIES:
	        return function entries() {
	          return new IteratorConstructor(this, KIND);
	        };
	    }

	    return function () {
	      return new IteratorConstructor(this);
	    };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$1] || IterablePrototype['@@iterator'] || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY; // fix native

	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));

	    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
	      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
	          hide(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
	        }
	      } // Set @@toStringTag to native iterators


	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  } // fix Array#{values, @@iterator}.name in V8 / FF


	  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    INCORRECT_VALUES_NAME = true;

	    defaultIterator = function values() {
	      return nativeIterator.call(this);
	    };
	  } // define iterator


	  if ( IterablePrototype[ITERATOR$1] !== defaultIterator) {
	    hide(IterablePrototype, ITERATOR$1, defaultIterator);
	  }

	  iterators[NAME] = defaultIterator; // export additional methods

	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({
	      target: NAME,
	      proto: true,
	      forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME
	    }, methods);
	  }

	  return methods;
	};

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(ARRAY_ITERATOR); // `Array.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.github.io/ecma262/#sec-createarrayiterator

	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated),
	    // target
	    index: 0,
	    // next index
	    kind: kind // kind

	  }); // `%ArrayIteratorPrototype%.next` method
	  // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;

	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return {
	      value: undefined,
	      done: true
	    };
	  }

	  if (kind == 'keys') return {
	    value: index,
	    done: false
	  };
	  if (kind == 'values') return {
	    value: target[index],
	    done: false
	  };
	  return {
	    value: [index, target[index]],
	    done: false
	  };
	}, 'values'); // argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject

	iterators.Arguments = iterators.Array; // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	var freezing = !fails(function () {
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var internalMetadata = createCommonjsModule(function (module) {
	  var defineProperty = objectDefineProperty.f;
	  var METADATA = uid('meta');
	  var id = 0;

	  var isExtensible = Object.isExtensible || function () {
	    return true;
	  };

	  var setMetadata = function (it) {
	    defineProperty(it, METADATA, {
	      value: {
	        objectID: 'O' + ++id,
	        // object ID
	        weakData: {} // weak collections IDs

	      }
	    });
	  };

	  var fastKey = function (it, create) {
	    // return a primitive with prefix
	    if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;

	    if (!has(it, METADATA)) {
	      // can't set metadata to uncaught frozen object
	      if (!isExtensible(it)) return 'F'; // not necessary to add metadata

	      if (!create) return 'E'; // add missing metadata

	      setMetadata(it); // return object ID
	    }

	    return it[METADATA].objectID;
	  };

	  var getWeakData = function (it, create) {
	    if (!has(it, METADATA)) {
	      // can't set metadata to uncaught frozen object
	      if (!isExtensible(it)) return true; // not necessary to add metadata

	      if (!create) return false; // add missing metadata

	      setMetadata(it); // return the store of weak collections IDs
	    }

	    return it[METADATA].weakData;
	  }; // add metadata on freeze-family methods calling


	  var onFreeze = function (it) {
	    if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
	    return it;
	  };

	  var meta = module.exports = {
	    REQUIRED: false,
	    fastKey: fastKey,
	    getWeakData: getWeakData,
	    onFreeze: onFreeze
	  };
	  hiddenKeys[METADATA] = true;
	});
	var internalMetadata_1 = internalMetadata.REQUIRED;
	var internalMetadata_2 = internalMetadata.fastKey;
	var internalMetadata_3 = internalMetadata.getWeakData;
	var internalMetadata_4 = internalMetadata.onFreeze;

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var ArrayPrototype$1 = Array.prototype; // check on default Array iterator

	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$2] === it);
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$3] || it['@@iterator'] || iterators[classof(it)];
	};

	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value); // 7.4.6 IteratorClose(iterator, completion)
	  } catch (error) {
	    var returnMethod = iterator['return'];
	    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
	    throw error;
	  }
	};

	var iterate_1 = createCommonjsModule(function (module) {
	  var Result = function (stopped, result) {
	    this.stopped = stopped;
	    this.result = result;
	  };

	  var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
	    var boundFunction = bindContext(fn, that, AS_ENTRIES ? 2 : 1);
	    var iterator, iterFn, index, length, result, step;

	    if (IS_ITERATOR) {
	      iterator = iterable;
	    } else {
	      iterFn = getIteratorMethod(iterable);
	      if (typeof iterFn != 'function') throw TypeError('Target is not iterable'); // optimisation for array iterators

	      if (isArrayIteratorMethod(iterFn)) {
	        for (index = 0, length = toLength(iterable.length); length > index; index++) {
	          result = AS_ENTRIES ? boundFunction(anObject(step = iterable[index])[0], step[1]) : boundFunction(iterable[index]);
	          if (result && result instanceof Result) return result;
	        }

	        return new Result(false);
	      }

	      iterator = iterFn.call(iterable);
	    }

	    while (!(step = iterator.next()).done) {
	      result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
	      if (result && result instanceof Result) return result;
	    }

	    return new Result(false);
	  };

	  iterate.stop = function (result) {
	    return new Result(true, result);
	  };
	});

	var anInstance = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  }

	  return it;
	};

	var ITERATOR$4 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return {
	        done: !!called++
	      };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };

	  iteratorWithReturn[ITERATOR$4] = function () {
	    return this;
	  }; // eslint-disable-next-line no-throw-literal


	  Array.from(iteratorWithReturn, function () {
	    throw 2;
	  });
	} catch (error) {
	  /* empty */
	}

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;

	  try {
	    var object = {};

	    object[ITERATOR$4] = function () {
	      return {
	        next: function () {
	          return {
	            done: ITERATION_SUPPORT = true
	          };
	        }
	      };
	    };

	    exec(object);
	  } catch (error) {
	    /* empty */
	  }

	  return ITERATION_SUPPORT;
	};

	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if ( // it can work only with native `setPrototypeOf`
	  objectSetPrototypeOf && // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	  typeof (NewTarget = dummy.constructor) == 'function' && NewTarget !== Wrapper && isObject(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	var collection = function (CONSTRUCTOR_NAME, wrapper, common, IS_MAP, IS_WEAK) {
	  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var Constructor = NativeConstructor;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var exported = {};

	  var fixMethod = function (KEY) {
	    var nativeMethod = NativePrototype[KEY];
	    redefine(NativePrototype, KEY, KEY == 'add' ? function add(value) {
	      nativeMethod.call(this, value === 0 ? 0 : value);
	      return this;
	    } : KEY == 'delete' ? function (key) {
	      return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	    } : KEY == 'get' ? function get(key) {
	      return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
	    } : KEY == 'has' ? function has(key) {
	      return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	    } : function set(key, value) {
	      nativeMethod.call(this, key === 0 ? 0 : key, value);
	      return this;
	    });
	  }; // eslint-disable-next-line max-len


	  if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
	    new NativeConstructor().entries().next();
	  })))) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    internalMetadata.REQUIRED = true;
	  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
	    var instance = new Constructor(); // early implementations not supports chaining

	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance; // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false

	    var THROWS_ON_PRIMITIVES = fails(function () {
	      instance.has(1);
	    }); // most early implementations doesn't supports iterables, most modern - not close it correctly
	    // eslint-disable-next-line no-new

	    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) {
	      new NativeConstructor(iterable);
	    }); // for early implementations -0 and +0 not the same

	    var BUGGY_ZERO = !IS_WEAK && fails(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new NativeConstructor();
	      var index = 5;

	      while (index--) $instance[ADDER](index, index);

	      return !$instance.has(-0);
	    });

	    if (!ACCEPT_ITERABLES) {
	      Constructor = wrapper(function (dummy, iterable) {
	        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
	        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
	        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
	        return that;
	      });
	      Constructor.prototype = NativePrototype;
	      NativePrototype.constructor = Constructor;
	    }

	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }

	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER); // weak collections should not contains .clear method

	    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
	  }

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  _export({
	    global: true,
	    forced: Constructor != NativeConstructor
	  }, exported);
	  setToStringTag(Constructor, CONSTRUCTOR_NAME);
	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);
	  return Constructor;
	};

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);

	  return target;
	};

	var SPECIES$4 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$4]) {
	    defineProperty(Constructor, SPECIES$4, {
	      configurable: true,
	      get: function () {
	        return this;
	      }
	    });
	  }
	};

	var defineProperty$2 = objectDefineProperty.f;
	var fastKey = internalMetadata.fastKey;
	var setInternalState$1 = internalState.set;
	var internalStateGetterFor = internalState.getterFor;
	var collectionStrong = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, CONSTRUCTOR_NAME);
	      setInternalState$1(that, {
	        type: CONSTRUCTOR_NAME,
	        index: objectCreate(null),
	        first: undefined,
	        last: undefined,
	        size: 0
	      });
	      if (!descriptors) that.size = 0;
	      if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
	    });
	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var entry = getEntry(that, key);
	      var previous, index; // change existing entry

	      if (entry) {
	        entry.value = value; // create new entry
	      } else {
	        state.last = entry = {
	          index: index = fastKey(key, true),
	          key: key,
	          value: value,
	          previous: previous = state.last,
	          next: undefined,
	          removed: false
	        };
	        if (!state.first) state.first = entry;
	        if (previous) previous.next = entry;
	        if (descriptors) state.size++;else that.size++; // add to index

	        if (index !== 'F') state.index[index] = entry;
	      }

	      return that;
	    };

	    var getEntry = function (that, key) {
	      var state = getInternalState(that); // fast case

	      var index = fastKey(key);
	      var entry;
	      if (index !== 'F') return state.index[index]; // frozen object case

	      for (entry = state.first; entry; entry = entry.next) {
	        if (entry.key == key) return entry;
	      }
	    };

	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        var that = this;
	        var state = getInternalState(that);
	        var data = state.index;
	        var entry = state.first;

	        while (entry) {
	          entry.removed = true;
	          if (entry.previous) entry.previous = entry.previous.next = undefined;
	          delete data[entry.index];
	          entry = entry.next;
	        }

	        state.first = state.last = undefined;
	        if (descriptors) state.size = 0;else that.size = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function (key) {
	        var that = this;
	        var state = getInternalState(that);
	        var entry = getEntry(that, key);

	        if (entry) {
	          var next = entry.next;
	          var prev = entry.previous;
	          delete state.index[entry.index];
	          entry.removed = true;
	          if (prev) prev.next = next;
	          if (next) next.previous = prev;
	          if (state.first == entry) state.first = next;
	          if (state.last == entry) state.last = prev;
	          if (descriptors) state.size--;else that.size--;
	        }

	        return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn
	      /* , that = undefined */
	      ) {
	        var state = getInternalState(this);
	        var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
	        var entry;

	        while (entry = entry ? entry.next : state.first) {
	          boundFunction(entry.value, entry.key, this); // revert to the last existing entry

	          while (entry && entry.removed) entry = entry.previous;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(this, key);
	      }
	    });
	    redefineAll(C.prototype, IS_MAP ? {
	      // 23.1.3.6 Map.prototype.get(key)
	      get: function get(key) {
	        var entry = getEntry(this, key);
	        return entry && entry.value;
	      },
	      // 23.1.3.9 Map.prototype.set(key, value)
	      set: function set(key, value) {
	        return define(this, key === 0 ? 0 : key, value);
	      }
	    } : {
	      // 23.2.3.1 Set.prototype.add(value)
	      add: function add(value) {
	        return define(this, value = value === 0 ? 0 : value, value);
	      }
	    });
	    if (descriptors) defineProperty$2(C.prototype, 'size', {
	      get: function () {
	        return getInternalState(this).size;
	      }
	    });
	    return C;
	  },
	  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
	    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
	    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
	    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME); // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11

	    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
	      setInternalState$1(this, {
	        type: ITERATOR_NAME,
	        target: iterated,
	        state: getInternalCollectionState(iterated),
	        kind: kind,
	        last: undefined
	      });
	    }, function () {
	      var state = getInternalIteratorState(this);
	      var kind = state.kind;
	      var entry = state.last; // revert to the last existing entry

	      while (entry && entry.removed) entry = entry.previous; // get next entry


	      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
	        // or finish the iteration
	        state.target = undefined;
	        return {
	          value: undefined,
	          done: true
	        };
	      } // return step by kind


	      if (kind == 'keys') return {
	        value: entry.key,
	        done: false
	      };
	      if (kind == 'values') return {
	        value: entry.value,
	        done: false
	      };
	      return {
	        value: [entry.key, entry.value],
	        done: false
	      };
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true); // add [@@species], 23.1.2.2, 23.2.2.2

	    setSpecies(CONSTRUCTOR_NAME);
	  }
	};

	// https://tc39.github.io/ecma262/#sec-map-objects


	var es_map = collection('Map', function (get) {
	  return function Map() {
	    return get(this, arguments.length ? arguments[0] : undefined);
	  };
	}, collectionStrong, true);

	var charAt$1 = stringMultibyte.charAt;
	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$2 = internalState.set;
	var getInternalState$1 = internalState.getterFor(STRING_ITERATOR); // `String.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator

	defineIterator(String, 'String', function (iterated) {
	  setInternalState$2(this, {
	    type: STRING_ITERATOR,
	    string: String(iterated),
	    index: 0
	  }); // `%StringIteratorPrototype%.next` method
	  // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$1(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return {
	    value: undefined,
	    done: true
	  };
	  point = charAt$1(string, index);
	  state.index += point.length;
	  return {
	    value: point,
	    done: false
	  };
	});

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var ArrayValues = es_array_iterator.values;

	for (var COLLECTION_NAME$1 in domIterables) {
	  var Collection$1 = global_1[COLLECTION_NAME$1];
	  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;

	  if (CollectionPrototype$1) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype$1[ITERATOR$5] !== ArrayValues) try {
	      hide(CollectionPrototype$1, ITERATOR$5, ArrayValues);
	    } catch (error) {
	      CollectionPrototype$1[ITERATOR$5] = ArrayValues;
	    }
	    if (!CollectionPrototype$1[TO_STRING_TAG$3]) hide(CollectionPrototype$1, TO_STRING_TAG$3, COLLECTION_NAME$1);
	    if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
	        hide(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
	      }
	    }
	  }
	}

	var id$2 = 0;

	var UIProjectMeta =
	/*#__PURE__*/
	function (_UIElement) {
	  _inherits(UIProjectMeta, _UIElement);

	  function UIProjectMeta(stage, wrapper, config) {
	    var _this;

	    _classCallCheck(this, UIProjectMeta);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIProjectMeta).call(this, stage, wrapper, config));

	    _defineProperty(_assertThisInitialized(_this), "object", {});

	    _defineProperty(_assertThisInitialized(_this), "orig", {});

	    _defineProperty(_assertThisInitialized(_this), "rows", new Map());

	    _defineProperty(_assertThisInitialized(_this), "identifiers", void 0);

	    _this.wrapper.classList.add("ui-project-meta-wrapper");

	    var table = document.createElement("table");

	    if (config.title) {
	      var title = document.createElement("h3");
	      title.style.marginBottom = "15px";
	      title.innerHTML = config.title;

	      _this.wrapper.append(title);
	    }

	    _this.identifiers = config.identifiers;

	    if (config.identifiers) {
	      config.identifiers.forEach(function (id) {
	        var tr = document.createElement("tr");
	        var tdI = document.createElement("td");
	        tdI.innerHTML = id;
	        var tdV = document.createElement("td");
	        var text = document.createElement("input");
	        text.type = "text";
	        text.size = 10;
	        text.addEventListener("click", function () {
	          this.select();
	        });
	        text.addEventListener("change", function () {
	          if (text.value.length === 0 || text.value === "?") text.value = "?";else text.value = text.value.replace("?", "");
	          _this.object[id] = text.value;

	          _this.update(_this.object, _this.orig);

	          _this.orig = JSON.parse(JSON.stringify(_this.object));
	        }, false);
	        text.addEventListener("keydown", function (ev) {
	          if (ev.key === "Enter") {
	            this.blur();
	          }
	        }, false);
	        tdV.append(text);

	        _this.rows.set(id, text);

	        tr.append(tdI);
	        tr.append(tdV);
	        table.append(tr);
	      });
	    }

	    {
	      var _id = "ui-project-meta-" + id$2++;

	      var publicCheck = document.createElement("input");
	      publicCheck.type = "checkbox";
	      publicCheck.id = _id;
	      publicCheck.addEventListener("click", function () {
	        _this.object["public"] = publicCheck.checked;

	        _this.update(_this.object, _this.orig);

	        _this.orig = JSON.parse(JSON.stringify(_this.object));
	      }, false);
	      var label = document.createElement("label");
	      label.classList.add("checkbox-label");
	      label.append(exp.cross);
	      label.setAttribute("for", _id);
	      var tr = document.createElement("tr");
	      var p = document.createElement("td");
	      p.innerHTML = "public";
	      tr.append(p);
	      var c = document.createElement("td");
	      c.append(publicCheck);
	      c.append(label);
	      tr.append(c);
	      table.append(tr);
	    }

	    _this.wrapper.append(table);

	    return _this;
	  }

	  _createClass(UIProjectMeta, [{
	    key: "init",
	    value: function init(pd) {
	      if (this.config.init) {
	        var initValue = this.config.init(pd);
	        this.object = initValue;
	        this.orig = JSON.parse(JSON.stringify(initValue));
	        this.rows.forEach(function (p, k) {
	          if (k in initValue) {
	            //@ts-ignore
	            p.value = initValue[k];
	          } else {
	            p.value = "?";
	          }
	        });
	      }
	    }
	  }]);

	  return UIProjectMeta;
	}(UIElement);

	// https://tc39.github.io/ecma262/#sec-array.from


	var arrayFrom = function from(arrayLike
	/* , mapfn = undefined, thisArg = undefined */
	) {
	  var O = toObject(arrayLike);
	  var C = typeof this == 'function' ? this : Array;
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var index = 0;
	  var iteratorMethod = getIteratorMethod(O);
	  var length, result, step, iterator;
	  if (mapping) mapfn = bindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2); // if the target is not iterable or it's an array with the default iterator - use a simple case

	  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = iteratorMethod.call(O);
	    result = new C();

	    for (; !(step = iterator.next()).done; index++) {
	      createProperty(result, index, mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value);
	    }
	  } else {
	    length = toLength(O.length);
	    result = new C(length);

	    for (; length > index; index++) {
	      createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	    }
	  }

	  result.length = index;
	  return result;
	};

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
	  Array.from(iterable);
	}); // `Array.from` method
	// https://tc39.github.io/ecma262/#sec-array.from

	_export({
	  target: 'Array',
	  stat: true,
	  forced: INCORRECT_ITERATION
	}, {
	  from: arrayFrom
	});

	var $includes = arrayIncludes.includes; // `Array.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes

	_export({
	  target: 'Array',
	  proto: true
	}, {
	  includes: function includes(el
	  /* , fromIndex = 0 */
	  ) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	}); // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	addToUnscopables('includes');

	var MATCH = wellKnownSymbol('match'); // `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp

	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  }

	  return it;
	};

	var MATCH$1 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;

	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) {
	      /* empty */
	    }
	  }

	  return false;
	};

	// https://tc39.github.io/ecma262/#sec-string.prototype.includes


	_export({
	  target: 'String',
	  proto: true,
	  forced: !correctIsRegexpLogic('includes')
	}, {
	  includes: function includes(searchString
	  /* , position = 0 */
	  ) {
	    return !!~String(requireObjectCoercible(this)).indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';
	var IS_CONCAT_SPREADABLE_SUPPORT = !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});
	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED$2 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: FORCED$2
	}, {
	  concat: function concat(arg) {
	    // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;

	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];

	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER$1) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER$1) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }

	    A.length = n;
	    return A;
	  }
	});

	var runtime_1 = createCommonjsModule(function (module) {
	  /**
	   * Copyright (c) 2014-present, Facebook, Inc.
	   *
	   * This source code is licensed under the MIT license found in the
	   * LICENSE file in the root directory of this source tree.
	   */
	  var runtime = function (exports) {

	    var Op = Object.prototype;
	    var hasOwn = Op.hasOwnProperty;
	    var undefined$1; // More compressible than void 0.

	    var $Symbol = typeof Symbol === "function" ? Symbol : {};
	    var iteratorSymbol = $Symbol.iterator || "@@iterator";
	    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	    function wrap(innerFn, outerFn, self, tryLocsList) {
	      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	      var generator = Object.create(protoGenerator.prototype);
	      var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
	      // .throw, and .return methods.

	      generator._invoke = makeInvokeMethod(innerFn, self, context);
	      return generator;
	    }

	    exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
	    // record like context.tryEntries[i].completion. This interface could
	    // have been (and was previously) designed to take a closure to be
	    // invoked without arguments, but in all the cases we care about we
	    // already have an existing method we want to call, so there's no need
	    // to create a new function object. We can even get away with assuming
	    // the method takes exactly one argument, since that happens to be true
	    // in every case, so we don't have to touch the arguments object. The
	    // only additional allocation required is the completion record, which
	    // has a stable shape and so hopefully should be cheap to allocate.

	    function tryCatch(fn, obj, arg) {
	      try {
	        return {
	          type: "normal",
	          arg: fn.call(obj, arg)
	        };
	      } catch (err) {
	        return {
	          type: "throw",
	          arg: err
	        };
	      }
	    }

	    var GenStateSuspendedStart = "suspendedStart";
	    var GenStateSuspendedYield = "suspendedYield";
	    var GenStateExecuting = "executing";
	    var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
	    // breaking out of the dispatch switch statement.

	    var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
	    // .constructor.prototype properties for functions that return Generator
	    // objects. For full spec compliance, you may wish to configure your
	    // minifier not to mangle the names of these two functions.

	    function Generator() {}

	    function GeneratorFunction() {}

	    function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
	    // don't natively support it.


	    var IteratorPrototype = {};

	    IteratorPrototype[iteratorSymbol] = function () {
	      return this;
	    };

	    var getProto = Object.getPrototypeOf;
	    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

	    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	      // This environment has a native %IteratorPrototype%; use it instead
	      // of the polyfill.
	      IteratorPrototype = NativeIteratorPrototype;
	    }

	    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
	    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	    GeneratorFunctionPrototype.constructor = GeneratorFunction;
	    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
	    // Iterator interface in terms of a single ._invoke method.

	    function defineIteratorMethods(prototype) {
	      ["next", "throw", "return"].forEach(function (method) {
	        prototype[method] = function (arg) {
	          return this._invoke(method, arg);
	        };
	      });
	    }

	    exports.isGeneratorFunction = function (genFun) {
	      var ctor = typeof genFun === "function" && genFun.constructor;
	      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
	      // do is to check its .name property.
	      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
	    };

	    exports.mark = function (genFun) {
	      if (Object.setPrototypeOf) {
	        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	      } else {
	        genFun.__proto__ = GeneratorFunctionPrototype;

	        if (!(toStringTagSymbol in genFun)) {
	          genFun[toStringTagSymbol] = "GeneratorFunction";
	        }
	      }

	      genFun.prototype = Object.create(Gp);
	      return genFun;
	    }; // Within the body of any async function, `await x` is transformed to
	    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	    // `hasOwn.call(value, "__await")` to determine if the yielded value is
	    // meant to be awaited.


	    exports.awrap = function (arg) {
	      return {
	        __await: arg
	      };
	    };

	    function AsyncIterator(generator) {
	      function invoke(method, arg, resolve, reject) {
	        var record = tryCatch(generator[method], generator, arg);

	        if (record.type === "throw") {
	          reject(record.arg);
	        } else {
	          var result = record.arg;
	          var value = result.value;

	          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
	            return Promise.resolve(value.__await).then(function (value) {
	              invoke("next", value, resolve, reject);
	            }, function (err) {
	              invoke("throw", err, resolve, reject);
	            });
	          }

	          return Promise.resolve(value).then(function (unwrapped) {
	            // When a yielded Promise is resolved, its final value becomes
	            // the .value of the Promise<{value,done}> result for the
	            // current iteration.
	            result.value = unwrapped;
	            resolve(result);
	          }, function (error) {
	            // If a rejected Promise was yielded, throw the rejection back
	            // into the async generator function so it can be handled there.
	            return invoke("throw", error, resolve, reject);
	          });
	        }
	      }

	      var previousPromise;

	      function enqueue(method, arg) {
	        function callInvokeWithMethodAndArg() {
	          return new Promise(function (resolve, reject) {
	            invoke(method, arg, resolve, reject);
	          });
	        }

	        return previousPromise = // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
	        // invocations of the iterator.
	        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
	      } // Define the unified helper method that is used to implement .next,
	      // .throw, and .return (see defineIteratorMethods).


	      this._invoke = enqueue;
	    }

	    defineIteratorMethods(AsyncIterator.prototype);

	    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	      return this;
	    };

	    exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
	    // AsyncIterator objects; they just return a Promise for the value of
	    // the final result produced by the iterator.

	    exports.async = function (innerFn, outerFn, self, tryLocsList) {
	      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));
	      return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function (result) {
	        return result.done ? result.value : iter.next();
	      });
	    };

	    function makeInvokeMethod(innerFn, self, context) {
	      var state = GenStateSuspendedStart;
	      return function invoke(method, arg) {
	        if (state === GenStateExecuting) {
	          throw new Error("Generator is already running");
	        }

	        if (state === GenStateCompleted) {
	          if (method === "throw") {
	            throw arg;
	          } // Be forgiving, per 25.3.3.3.3 of the spec:
	          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


	          return doneResult();
	        }

	        context.method = method;
	        context.arg = arg;

	        while (true) {
	          var delegate = context.delegate;

	          if (delegate) {
	            var delegateResult = maybeInvokeDelegate(delegate, context);

	            if (delegateResult) {
	              if (delegateResult === ContinueSentinel) continue;
	              return delegateResult;
	            }
	          }

	          if (context.method === "next") {
	            // Setting context._sent for legacy support of Babel's
	            // function.sent implementation.
	            context.sent = context._sent = context.arg;
	          } else if (context.method === "throw") {
	            if (state === GenStateSuspendedStart) {
	              state = GenStateCompleted;
	              throw context.arg;
	            }

	            context.dispatchException(context.arg);
	          } else if (context.method === "return") {
	            context.abrupt("return", context.arg);
	          }

	          state = GenStateExecuting;
	          var record = tryCatch(innerFn, self, context);

	          if (record.type === "normal") {
	            // If an exception is thrown from innerFn, we leave state ===
	            // GenStateExecuting and loop back for another invocation.
	            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

	            if (record.arg === ContinueSentinel) {
	              continue;
	            }

	            return {
	              value: record.arg,
	              done: context.done
	            };
	          } else if (record.type === "throw") {
	            state = GenStateCompleted; // Dispatch the exception by looping back around to the
	            // context.dispatchException(context.arg) call above.

	            context.method = "throw";
	            context.arg = record.arg;
	          }
	        }
	      };
	    } // Call delegate.iterator[context.method](context.arg) and handle the
	    // result, either by returning a { value, done } result from the
	    // delegate iterator, or by modifying context.method and context.arg,
	    // setting context.delegate to null, and returning the ContinueSentinel.


	    function maybeInvokeDelegate(delegate, context) {
	      var method = delegate.iterator[context.method];

	      if (method === undefined$1) {
	        // A .throw or .return when the delegate iterator has no .throw
	        // method always terminates the yield* loop.
	        context.delegate = null;

	        if (context.method === "throw") {
	          // Note: ["return"] must be used for ES3 parsing compatibility.
	          if (delegate.iterator["return"]) {
	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            context.method = "return";
	            context.arg = undefined$1;
	            maybeInvokeDelegate(delegate, context);

	            if (context.method === "throw") {
	              // If maybeInvokeDelegate(context) changed context.method from
	              // "return" to "throw", let that override the TypeError below.
	              return ContinueSentinel;
	            }
	          }

	          context.method = "throw";
	          context.arg = new TypeError("The iterator does not provide a 'throw' method");
	        }

	        return ContinueSentinel;
	      }

	      var record = tryCatch(method, delegate.iterator, context.arg);

	      if (record.type === "throw") {
	        context.method = "throw";
	        context.arg = record.arg;
	        context.delegate = null;
	        return ContinueSentinel;
	      }

	      var info = record.arg;

	      if (!info) {
	        context.method = "throw";
	        context.arg = new TypeError("iterator result is not an object");
	        context.delegate = null;
	        return ContinueSentinel;
	      }

	      if (info.done) {
	        // Assign the result of the finished delegate to the temporary
	        // variable specified by delegate.resultName (see delegateYield).
	        context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

	        context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
	        // exception, let the outer generator proceed normally. If
	        // context.method was "next", forget context.arg since it has been
	        // "consumed" by the delegate iterator. If context.method was
	        // "return", allow the original .return call to continue in the
	        // outer generator.

	        if (context.method !== "return") {
	          context.method = "next";
	          context.arg = undefined$1;
	        }
	      } else {
	        // Re-yield the result returned by the delegate method.
	        return info;
	      } // The delegate iterator is finished, so forget it and continue with
	      // the outer generator.


	      context.delegate = null;
	      return ContinueSentinel;
	    } // Define Generator.prototype.{next,throw,return} in terms of the
	    // unified ._invoke helper method.


	    defineIteratorMethods(Gp);
	    Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
	    // @@iterator function is called on it. Some browsers' implementations of the
	    // iterator prototype chain incorrectly implement this, causing the Generator
	    // object to not be returned from this call. This ensures that doesn't happen.
	    // See https://github.com/facebook/regenerator/issues/274 for more details.

	    Gp[iteratorSymbol] = function () {
	      return this;
	    };

	    Gp.toString = function () {
	      return "[object Generator]";
	    };

	    function pushTryEntry(locs) {
	      var entry = {
	        tryLoc: locs[0]
	      };

	      if (1 in locs) {
	        entry.catchLoc = locs[1];
	      }

	      if (2 in locs) {
	        entry.finallyLoc = locs[2];
	        entry.afterLoc = locs[3];
	      }

	      this.tryEntries.push(entry);
	    }

	    function resetTryEntry(entry) {
	      var record = entry.completion || {};
	      record.type = "normal";
	      delete record.arg;
	      entry.completion = record;
	    }

	    function Context(tryLocsList) {
	      // The root entry object (effectively a try statement without a catch
	      // or a finally block) gives us a place to store values thrown from
	      // locations where there is no enclosing try statement.
	      this.tryEntries = [{
	        tryLoc: "root"
	      }];
	      tryLocsList.forEach(pushTryEntry, this);
	      this.reset(true);
	    }

	    exports.keys = function (object) {
	      var keys = [];

	      for (var key in object) {
	        keys.push(key);
	      }

	      keys.reverse(); // Rather than returning an object with a next method, we keep
	      // things simple and return the next function itself.

	      return function next() {
	        while (keys.length) {
	          var key = keys.pop();

	          if (key in object) {
	            next.value = key;
	            next.done = false;
	            return next;
	          }
	        } // To avoid creating an additional object, we just hang the .value
	        // and .done properties off the next function object itself. This
	        // also ensures that the minifier will not anonymize the function.


	        next.done = true;
	        return next;
	      };
	    };

	    function values(iterable) {
	      if (iterable) {
	        var iteratorMethod = iterable[iteratorSymbol];

	        if (iteratorMethod) {
	          return iteratorMethod.call(iterable);
	        }

	        if (typeof iterable.next === "function") {
	          return iterable;
	        }

	        if (!isNaN(iterable.length)) {
	          var i = -1,
	              next = function next() {
	            while (++i < iterable.length) {
	              if (hasOwn.call(iterable, i)) {
	                next.value = iterable[i];
	                next.done = false;
	                return next;
	              }
	            }

	            next.value = undefined$1;
	            next.done = true;
	            return next;
	          };

	          return next.next = next;
	        }
	      } // Return an iterator with no values.


	      return {
	        next: doneResult
	      };
	    }

	    exports.values = values;

	    function doneResult() {
	      return {
	        value: undefined$1,
	        done: true
	      };
	    }

	    Context.prototype = {
	      constructor: Context,
	      reset: function (skipTempReset) {
	        this.prev = 0;
	        this.next = 0; // Resetting context._sent for legacy support of Babel's
	        // function.sent implementation.

	        this.sent = this._sent = undefined$1;
	        this.done = false;
	        this.delegate = null;
	        this.method = "next";
	        this.arg = undefined$1;
	        this.tryEntries.forEach(resetTryEntry);

	        if (!skipTempReset) {
	          for (var name in this) {
	            // Not sure about the optimal order of these conditions:
	            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
	              this[name] = undefined$1;
	            }
	          }
	        }
	      },
	      stop: function () {
	        this.done = true;
	        var rootEntry = this.tryEntries[0];
	        var rootRecord = rootEntry.completion;

	        if (rootRecord.type === "throw") {
	          throw rootRecord.arg;
	        }

	        return this.rval;
	      },
	      dispatchException: function (exception) {
	        if (this.done) {
	          throw exception;
	        }

	        var context = this;

	        function handle(loc, caught) {
	          record.type = "throw";
	          record.arg = exception;
	          context.next = loc;

	          if (caught) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            context.method = "next";
	            context.arg = undefined$1;
	          }

	          return !!caught;
	        }

	        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	          var entry = this.tryEntries[i];
	          var record = entry.completion;

	          if (entry.tryLoc === "root") {
	            // Exception thrown outside of any try block that could handle
	            // it, so set the completion value of the entire function to
	            // throw the exception.
	            return handle("end");
	          }

	          if (entry.tryLoc <= this.prev) {
	            var hasCatch = hasOwn.call(entry, "catchLoc");
	            var hasFinally = hasOwn.call(entry, "finallyLoc");

	            if (hasCatch && hasFinally) {
	              if (this.prev < entry.catchLoc) {
	                return handle(entry.catchLoc, true);
	              } else if (this.prev < entry.finallyLoc) {
	                return handle(entry.finallyLoc);
	              }
	            } else if (hasCatch) {
	              if (this.prev < entry.catchLoc) {
	                return handle(entry.catchLoc, true);
	              }
	            } else if (hasFinally) {
	              if (this.prev < entry.finallyLoc) {
	                return handle(entry.finallyLoc);
	              }
	            } else {
	              throw new Error("try statement without catch or finally");
	            }
	          }
	        }
	      },
	      abrupt: function (type, arg) {
	        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	          var entry = this.tryEntries[i];

	          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
	            var finallyEntry = entry;
	            break;
	          }
	        }

	        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
	          // Ignore the finally entry if control is not jumping to a
	          // location outside the try/catch block.
	          finallyEntry = null;
	        }

	        var record = finallyEntry ? finallyEntry.completion : {};
	        record.type = type;
	        record.arg = arg;

	        if (finallyEntry) {
	          this.method = "next";
	          this.next = finallyEntry.finallyLoc;
	          return ContinueSentinel;
	        }

	        return this.complete(record);
	      },
	      complete: function (record, afterLoc) {
	        if (record.type === "throw") {
	          throw record.arg;
	        }

	        if (record.type === "break" || record.type === "continue") {
	          this.next = record.arg;
	        } else if (record.type === "return") {
	          this.rval = this.arg = record.arg;
	          this.method = "return";
	          this.next = "end";
	        } else if (record.type === "normal" && afterLoc) {
	          this.next = afterLoc;
	        }

	        return ContinueSentinel;
	      },
	      finish: function (finallyLoc) {
	        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	          var entry = this.tryEntries[i];

	          if (entry.finallyLoc === finallyLoc) {
	            this.complete(entry.completion, entry.afterLoc);
	            resetTryEntry(entry);
	            return ContinueSentinel;
	          }
	        }
	      },
	      "catch": function (tryLoc) {
	        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	          var entry = this.tryEntries[i];

	          if (entry.tryLoc === tryLoc) {
	            var record = entry.completion;

	            if (record.type === "throw") {
	              var thrown = record.arg;
	              resetTryEntry(entry);
	            }

	            return thrown;
	          }
	        } // The context.catch method must only be called with a location
	        // argument that corresponds to a known catch block.


	        throw new Error("illegal catch attempt");
	      },
	      delegateYield: function (iterable, resultName, nextLoc) {
	        this.delegate = {
	          iterator: values(iterable),
	          resultName: resultName,
	          nextLoc: nextLoc
	        };

	        if (this.method === "next") {
	          // Deliberately forget the last sent value so that we don't
	          // accidentally pass it on to the delegate.
	          this.arg = undefined$1;
	        }

	        return ContinueSentinel;
	      }
	    }; // Regardless of whether this script is executing as a CommonJS module
	    // or not, return the runtime object so that we can declare the variable
	    // regeneratorRuntime in the outer scope, which allows this module to be
	    // injected easily by `bin/regenerator --include-runtime script.js`.

	    return exports;
	  }( // If this script is executing as a CommonJS module, use module.exports
	  // as the regeneratorRuntime namespace. Otherwise create a new empty
	  // object. Either way, the resulting object will be used to initialize
	  // the regeneratorRuntime variable at the top of this file.
	   module.exports );

	  try {
	    regeneratorRuntime = runtime;
	  } catch (accidentalStrictMode) {
	    // This module should not be running in strict mode, so the above
	    // assignment should always work unless something is misconfigured. Just
	    // in case runtime.js accidentally runs in strict mode, we can escape
	    // strict mode using a global Function call. This could conceivably fail
	    // if a Content Security Policy forbids using Function, but in that case
	    // the proper solution is to fix the accidental strict mode problem. If
	    // you've misconfigured your bundler to force strict mode and applied a
	    // CSP to forbid Function, and you're not willing to fix either of those
	    // problems, please detail your unique predicament in a GitHub issue.
	    Function("r", "regeneratorRuntime = r")(runtime);
	  }
	});

	var meta = {
		name: "default",
		author: "jimfx"
	};
	var stem$1 = {
		diameter: {
			value: 0.016,
			variation: 0.2
		},
		originOffset: {
			value: 0.118,
			variation: 0.154
		},
		originAngle: {
			value: 10.651
		},
		originRotation: {
			value: 325.917
		},
		noiseStrength: {
			value: 0
		},
		size: {
			value: 1.946,
			variation: 0.503
		},
		amount: 3,
		gravity: 0.421
	};
	var branches = {
		enable: true,
		diameter: {
			value: 0.633
		},
		length: {
			value: 0.777,
			variation: 0.45,
			curve: [
				{
					x: 0,
					y: 0,
					locked: true
				},
				{
					x: 0.291,
					y: 0.78
				},
				{
					x: 1,
					y: 1,
					locked: true
				}
			]
		},
		angle: {
			value: 30
		},
		lowestBranch: {
			value: 0.379
		},
		offset: {
			value: 0.882
		},
		rotation: {
			value: 0
		},
		amount: 15,
		noiseScale: 1,
		noiseStrength: {
			value: 0
		},
		gravity: 0.509
	};
	var leaves = {
		enable: true,
		amount: 12,
		onBranches: true,
		onStem: false,
		diameter: {
			value: 1
		},
		angle: {
			value: 1
		},
		offset: {
			value: 1
		},
		rotation: {
			value: 1
		},
		size: {
			value: 0.249
		},
		xCurvature: {
			value: 1
		},
		yCurvature: {
			value: 1
		},
		shape: [
			{
				x: 0,
				y: 0
			},
			{
				x: 0.21,
				y: 0.275
			},
			{
				x: 0.3,
				y: 0.48
			},
			{
				x: 0.308,
				y: 0.645
			},
			{
				x: 0.213,
				y: 0.83
			},
			{
				x: 0.01,
				y: 1
			}
		],
		gravity: 0.355
	};
	var defaultPD = {
		meta: meta,
		stem: stem$1,
		branches: branches,
		leaves: leaves
	};

	var nextStage;
	var importerStage = {
	  title: "Importer",
	  init: function init(_pd) {
	    //we need to make a deep copy;
	    //or not, shallow copy seems to work fine
	    nextStage.init(_pd);
	  },
	  connect: function connect(stage) {
	    nextStage = stage;
	  }
	};

	/**
	 * Copyright 2019 Google Inc. All Rights Reserved.
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	const proxyMarker = Symbol("Comlink.proxy");
	const createEndpoint = Symbol("Comlink.endpoint");
	const throwSet = new WeakSet();
	const transferHandlers = new Map([["proxy", {
	  canHandle: obj => obj && obj[proxyMarker],

	  serialize(obj) {
	    const {
	      port1,
	      port2
	    } = new MessageChannel();
	    expose(obj, port1);
	    return [port2, [port2]];
	  },

	  deserialize: port => {
	    port.start();
	    return wrap(port);
	  }
	}], ["throw", {
	  canHandle: obj => throwSet.has(obj),

	  serialize(obj) {
	    const isError = obj instanceof Error;
	    let serialized = obj;

	    if (isError) {
	      serialized = {
	        isError,
	        message: obj.message,
	        stack: obj.stack
	      };
	    }

	    return [serialized, []];
	  },

	  deserialize(obj) {
	    if (obj.isError) {
	      throw Object.assign(new Error(), obj);
	    }

	    throw obj;
	  }

	}]]);

	function expose(obj, ep = self) {
	  ep.addEventListener("message", async ev => {
	    if (!ev || !ev.data) {
	      return;
	    }

	    const {
	      id,
	      type,
	      path
	    } = {
	      path: [],
	      ...ev.data
	    };
	    const argumentList = (ev.data.argumentList || []).map(fromWireValue);
	    let returnValue;

	    try {
	      const parent = path.slice(0, -1).reduce((obj, prop) => obj[prop], obj);
	      const rawValue = path.reduce((obj, prop) => obj[prop], obj);

	      switch (type) {
	        case 0
	        /* GET */
	        :
	          {
	            returnValue = await rawValue;
	          }
	          break;

	        case 1
	        /* SET */
	        :
	          {
	            parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);
	            returnValue = true;
	          }
	          break;

	        case 2
	        /* APPLY */
	        :
	          {
	            returnValue = await rawValue.apply(parent, argumentList);
	          }
	          break;

	        case 3
	        /* CONSTRUCT */
	        :
	          {
	            const value = await new rawValue(...argumentList);
	            returnValue = proxy(value);
	          }
	          break;

	        case 4
	        /* ENDPOINT */
	        :
	          {
	            const {
	              port1,
	              port2
	            } = new MessageChannel();
	            expose(obj, port2);
	            returnValue = transfer(port1, [port1]);
	          }
	          break;

	        default:
	          console.warn("Unrecognized message", ev.data);
	      }
	    } catch (e) {
	      returnValue = e;
	      throwSet.add(e);
	    }

	    const [wireValue, transferables] = toWireValue(returnValue);
	    ep.postMessage({ ...wireValue,
	      id
	    }, transferables);
	  });

	  if (ep.start) {
	    ep.start();
	  }
	}

	function wrap(ep) {
	  return createProxy(ep);
	}

	function createProxy(ep, path = []) {
	  const proxy = new Proxy(function () {}, {
	    get(_target, prop) {
	      if (prop === "then") {
	        if (path.length === 0) {
	          return {
	            then: () => proxy
	          };
	        }

	        const r = requestResponseMessage(ep, {
	          type: 0
	          /* GET */
	          ,
	          path: path.map(p => p.toString())
	        }).then(fromWireValue);
	        return r.then.bind(r);
	      }

	      return createProxy(ep, [...path, prop]);
	    },

	    set(_target, prop, rawValue) {
	      // FIXME: ES6 Proxy Handler `set` methods are supposed to return a
	      // boolean. To show good will, we return true asynchronously ¯\_(ツ)_/¯
	      const [value, transferables] = toWireValue(rawValue);
	      return requestResponseMessage(ep, {
	        type: 1
	        /* SET */
	        ,
	        path: [...path, prop].map(p => p.toString()),
	        value
	      }, transferables).then(fromWireValue);
	    },

	    apply(_target, _thisArg, rawArgumentList) {
	      const last = path[path.length - 1];

	      if (last === createEndpoint) {
	        return requestResponseMessage(ep, {
	          type: 4
	          /* ENDPOINT */

	        }).then(fromWireValue);
	      } // We just pretend that `bind()` didn’t happen.


	      if (last === "bind") {
	        return createProxy(ep, path.slice(0, -1));
	      }

	      const [argumentList, transferables] = processArguments(rawArgumentList);
	      return requestResponseMessage(ep, {
	        type: 2
	        /* APPLY */
	        ,
	        path: path.map(p => p.toString()),
	        argumentList
	      }, transferables).then(fromWireValue);
	    },

	    construct(_target, rawArgumentList) {
	      const [argumentList, transferables] = processArguments(rawArgumentList);
	      return requestResponseMessage(ep, {
	        type: 3
	        /* CONSTRUCT */
	        ,
	        path: path.map(p => p.toString()),
	        argumentList
	      }, transferables).then(fromWireValue);
	    }

	  });
	  return proxy;
	}

	function myFlat(arr) {
	  return Array.prototype.concat.apply([], arr);
	}

	function processArguments(argumentList) {
	  const processed = argumentList.map(toWireValue);
	  return [processed.map(v => v[0]), myFlat(processed.map(v => v[1]))];
	}

	const transferCache = new WeakMap();

	function transfer(obj, transfers) {
	  transferCache.set(obj, transfers);
	  return obj;
	}

	function proxy(obj) {
	  return Object.assign(obj, {
	    [proxyMarker]: true
	  });
	}

	function toWireValue(value) {
	  for (const [name, handler] of transferHandlers) {
	    if (handler.canHandle(value)) {
	      const [serializedValue, transferables] = handler.serialize(value);
	      return [{
	        type: 3
	        /* HANDLER */
	        ,
	        name,
	        value: serializedValue
	      }, transferables];
	    }
	  }

	  return [{
	    type: 0
	    /* RAW */
	    ,
	    value
	  }, transferCache.get(value) || []];
	}

	function fromWireValue(value) {
	  switch (value.type) {
	    case 3
	    /* HANDLER */
	    :
	      return transferHandlers.get(value.name).deserialize(value.value);

	    case 0
	    /* RAW */
	    :
	      return value.value;
	  }
	}

	function requestResponseMessage(ep, msg, transfers) {
	  return new Promise(resolve => {
	    const id = generateUUID();
	    ep.addEventListener("message", function l(ev) {
	      if (!ev.data || !ev.data.id || ev.data.id !== id) {
	        return;
	      }

	      ep.removeEventListener("message", l);
	      resolve(ev.data);
	    });

	    if (ep.start) {
	      ep.start();
	    }

	    ep.postMessage({
	      id,
	      ...msg
	    }, transfers);
	  });
	}

	function generateUUID() {
	  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
	}

	function graph (name, suffix, left, bottom, wrapper) {
	  var msCanvas = document.createElement("canvas");
	  msCanvas.style.display = "none";
	  var msWidth = 200;
	  var msMin = 20;
	  var msMax = 70;
	  msCanvas.width = msWidth;
	  msCanvas.height = 50;
	  var msArray = [];
	  var msCtx = msCanvas.getContext("2d");
	  msCanvas.style.bottom = bottom + "px";
	  msCanvas.style.left = left + "px";
	  wrapper.append(msCanvas);
	  var visible = false;

	  var exp = function exp(_ms) {
	    if (!visible) return;
	    var ms = Math.floor(_ms * 100) / 100;
	    msCtx.clearRect(0, 0, msWidth, 50);
	    msArray.push(ms);
	    if (msArray.length > msWidth / 2) msArray.shift();
	    var max = Math.max.apply(Math, msArray);
	    msArray.forEach(function (ms, i) {
	      var v = Math.min(Math.max((ms - msMin) / msMax, 0), 1);
	      msCtx.fillStyle = "rgba(".concat(v * 255, ", ").concat((1 - v) * 255, ", 0, 0.5)");
	      var height = 50 * (ms / max);
	      msCtx.fillRect(msWidth - i * 2, 50 - height, 2, height);
	    });
	    msCtx.fillStyle = "black";
	    msCtx.fillText(name + ": " + ms + suffix, 10, 40);
	  };

	  exp.show = function () {
	    visible = true;
	    msCanvas.style.display = "";
	  };

	  exp.hide = function () {
	    visible = false;
	    msCanvas.style.display = "none";
	  };

	  return exp;
	}

	var defineProperty$3 = objectDefineProperty.f;
	var DataView$1 = global_1.DataView;
	var DataViewPrototype = DataView$1 && DataView$1.prototype;
	var Int8Array$1 = global_1.Int8Array;
	var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
	var Uint8ClampedArray = global_1.Uint8ClampedArray;
	var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
	var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
	var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
	var ObjectPrototype$2 = Object.prototype;
	var isPrototypeOf = ObjectPrototype$2.isPrototypeOf;
	var TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');
	var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
	var NATIVE_ARRAY_BUFFER = !!(global_1.ArrayBuffer && DataView$1); // Fixing native typed arrays in Opera Presto crashes the browser, see #595

	var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
	var TYPED_ARRAY_TAG_REQIRED = false;
	var NAME$1;
	var TypedArrayConstructorsList = {
	  Int8Array: 1,
	  Uint8Array: 1,
	  Uint8ClampedArray: 1,
	  Int16Array: 2,
	  Uint16Array: 2,
	  Int32Array: 4,
	  Uint32Array: 4,
	  Float32Array: 4,
	  Float64Array: 8
	};

	var isView = function isView(it) {
	  var klass = classof(it);
	  return klass === 'DataView' || has(TypedArrayConstructorsList, klass);
	};

	var isTypedArray = function (it) {
	  return isObject(it) && has(TypedArrayConstructorsList, classof(it));
	};

	var aTypedArray = function (it) {
	  if (isTypedArray(it)) return it;
	  throw TypeError('Target is not a typed array');
	};

	var aTypedArrayConstructor = function (C) {
	  if (objectSetPrototypeOf) {
	    if (isPrototypeOf.call(TypedArray, C)) return C;
	  } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME$1)) {
	    var TypedArrayConstructor = global_1[ARRAY];

	    if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
	      return C;
	    }
	  }

	  throw TypeError('Target is not a typed array constructor');
	};

	var exportProto = function (KEY, property, forced) {
	  if (!descriptors) return;
	  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
	    var TypedArrayConstructor = global_1[ARRAY];

	    if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
	      delete TypedArrayConstructor.prototype[KEY];
	    }
	  }

	  if (!TypedArrayPrototype[KEY] || forced) {
	    redefine(TypedArrayPrototype, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
	  }
	};

	var exportStatic = function (KEY, property, forced) {
	  var ARRAY, TypedArrayConstructor;
	  if (!descriptors) return;

	  if (objectSetPrototypeOf) {
	    if (forced) for (ARRAY in TypedArrayConstructorsList) {
	      TypedArrayConstructor = global_1[ARRAY];

	      if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
	        delete TypedArrayConstructor[KEY];
	      }
	    }

	    if (!TypedArray[KEY] || forced) {
	      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
	      try {
	        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY] || property);
	      } catch (error) {
	        /* empty */
	      }
	    } else return;
	  }

	  for (ARRAY in TypedArrayConstructorsList) {
	    TypedArrayConstructor = global_1[ARRAY];

	    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
	      redefine(TypedArrayConstructor, KEY, property);
	    }
	  }
	};

	for (NAME$1 in TypedArrayConstructorsList) {
	  if (!global_1[NAME$1]) NATIVE_ARRAY_BUFFER_VIEWS = false;
	} // WebKit bug - typed arrays constructors prototype is Object.prototype


	if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
	  // eslint-disable-next-line no-shadow
	  TypedArray = function TypedArray() {
	    throw TypeError('Incorrect invocation');
	  };

	  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
	    if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1], TypedArray);
	  }
	}

	if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$2) {
	  TypedArrayPrototype = TypedArray.prototype;
	  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
	    if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1].prototype, TypedArrayPrototype);
	  }
	} // WebKit bug - one more object in Uint8ClampedArray prototype chain


	if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
	  objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
	}

	if (descriptors && !has(TypedArrayPrototype, TO_STRING_TAG$4)) {
	  TYPED_ARRAY_TAG_REQIRED = true;
	  defineProperty$3(TypedArrayPrototype, TO_STRING_TAG$4, {
	    get: function () {
	      return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
	    }
	  });

	  for (NAME$1 in TypedArrayConstructorsList) if (global_1[NAME$1]) {
	    hide(global_1[NAME$1], TYPED_ARRAY_TAG, NAME$1);
	  }
	} // WebKit bug - the same parent prototype for typed arrays and data view


	if (NATIVE_ARRAY_BUFFER && objectSetPrototypeOf && objectGetPrototypeOf(DataViewPrototype) !== ObjectPrototype$2) {
	  objectSetPrototypeOf(DataViewPrototype, ObjectPrototype$2);
	}

	var arrayBufferViewCore = {
	  NATIVE_ARRAY_BUFFER: NATIVE_ARRAY_BUFFER,
	  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
	  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
	  aTypedArray: aTypedArray,
	  aTypedArrayConstructor: aTypedArrayConstructor,
	  exportProto: exportProto,
	  exportStatic: exportStatic,
	  isView: isView,
	  isTypedArray: isTypedArray,
	  TypedArray: TypedArray,
	  TypedArrayPrototype: TypedArrayPrototype
	};

	// https://tc39.github.io/ecma262/#sec-toindex

	var toIndex = function (it) {
	  if (it === undefined) return 0;
	  var number = toInteger(it);
	  var length = toLength(number);
	  if (number !== length) throw RangeError('Wrong length or index');
	  return length;
	};

	var arrayBuffer = createCommonjsModule(function (module, exports) {

	  var NATIVE_ARRAY_BUFFER = arrayBufferViewCore.NATIVE_ARRAY_BUFFER;
	  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	  var defineProperty = objectDefineProperty.f;
	  var getInternalState = internalState.get;
	  var setInternalState = internalState.set;
	  var ARRAY_BUFFER = 'ArrayBuffer';
	  var DATA_VIEW = 'DataView';
	  var PROTOTYPE = 'prototype';
	  var WRONG_LENGTH = 'Wrong length';
	  var WRONG_INDEX = 'Wrong index';
	  var NativeArrayBuffer = global_1[ARRAY_BUFFER];
	  var $ArrayBuffer = NativeArrayBuffer;
	  var $DataView = global_1[DATA_VIEW];
	  var Math = global_1.Math;
	  var RangeError = global_1.RangeError; // eslint-disable-next-line no-shadow-restricted-names

	  var Infinity = 1 / 0;
	  var abs = Math.abs;
	  var pow = Math.pow;
	  var floor = Math.floor;
	  var log = Math.log;
	  var LN2 = Math.LN2; // IEEE754 conversions based on https://github.com/feross/ieee754

	  var packIEEE754 = function (number, mantissaLength, bytes) {
	    var buffer = new Array(bytes);
	    var exponentLength = bytes * 8 - mantissaLength - 1;
	    var eMax = (1 << exponentLength) - 1;
	    var eBias = eMax >> 1;
	    var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
	    var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
	    var index = 0;
	    var exponent, mantissa, c;
	    number = abs(number); // eslint-disable-next-line no-self-compare

	    if (number != number || number === Infinity) {
	      // eslint-disable-next-line no-self-compare
	      mantissa = number != number ? 1 : 0;
	      exponent = eMax;
	    } else {
	      exponent = floor(log(number) / LN2);

	      if (number * (c = pow(2, -exponent)) < 1) {
	        exponent--;
	        c *= 2;
	      }

	      if (exponent + eBias >= 1) {
	        number += rt / c;
	      } else {
	        number += rt * pow(2, 1 - eBias);
	      }

	      if (number * c >= 2) {
	        exponent++;
	        c /= 2;
	      }

	      if (exponent + eBias >= eMax) {
	        mantissa = 0;
	        exponent = eMax;
	      } else if (exponent + eBias >= 1) {
	        mantissa = (number * c - 1) * pow(2, mantissaLength);
	        exponent = exponent + eBias;
	      } else {
	        mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
	        exponent = 0;
	      }
	    }

	    for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);

	    exponent = exponent << mantissaLength | mantissa;
	    exponentLength += mantissaLength;

	    for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);

	    buffer[--index] |= sign * 128;
	    return buffer;
	  };

	  var unpackIEEE754 = function (buffer, mantissaLength) {
	    var bytes = buffer.length;
	    var exponentLength = bytes * 8 - mantissaLength - 1;
	    var eMax = (1 << exponentLength) - 1;
	    var eBias = eMax >> 1;
	    var nBits = exponentLength - 7;
	    var index = bytes - 1;
	    var sign = buffer[index--];
	    var exponent = sign & 127;
	    var mantissa;
	    sign >>= 7;

	    for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);

	    mantissa = exponent & (1 << -nBits) - 1;
	    exponent >>= -nBits;
	    nBits += mantissaLength;

	    for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);

	    if (exponent === 0) {
	      exponent = 1 - eBias;
	    } else if (exponent === eMax) {
	      return mantissa ? NaN : sign ? -Infinity : Infinity;
	    } else {
	      mantissa = mantissa + pow(2, mantissaLength);
	      exponent = exponent - eBias;
	    }

	    return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
	  };

	  var unpackInt32 = function (buffer) {
	    return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
	  };

	  var packInt8 = function (number) {
	    return [number & 0xFF];
	  };

	  var packInt16 = function (number) {
	    return [number & 0xFF, number >> 8 & 0xFF];
	  };

	  var packInt32 = function (number) {
	    return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
	  };

	  var packFloat32 = function (number) {
	    return packIEEE754(number, 23, 4);
	  };

	  var packFloat64 = function (number) {
	    return packIEEE754(number, 52, 8);
	  };

	  var addGetter = function (Constructor, key) {
	    defineProperty(Constructor[PROTOTYPE], key, {
	      get: function () {
	        return getInternalState(this)[key];
	      }
	    });
	  };

	  var get = function (view, count, index, isLittleEndian) {
	    var numIndex = +index;
	    var intIndex = toIndex(numIndex);
	    var store = getInternalState(view);
	    if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
	    var bytes = getInternalState(store.buffer).bytes;
	    var start = intIndex + store.byteOffset;
	    var pack = bytes.slice(start, start + count);
	    return isLittleEndian ? pack : pack.reverse();
	  };

	  var set = function (view, count, index, conversion, value, isLittleEndian) {
	    var numIndex = +index;
	    var intIndex = toIndex(numIndex);
	    var store = getInternalState(view);
	    if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
	    var bytes = getInternalState(store.buffer).bytes;
	    var start = intIndex + store.byteOffset;
	    var pack = conversion(+value);

	    for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
	  };

	  if (!NATIVE_ARRAY_BUFFER) {
	    $ArrayBuffer = function ArrayBuffer(length) {
	      anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
	      var byteLength = toIndex(length);
	      setInternalState(this, {
	        bytes: arrayFill.call(new Array(byteLength), 0),
	        byteLength: byteLength
	      });
	      if (!descriptors) this.byteLength = byteLength;
	    };

	    $DataView = function DataView(buffer, byteOffset, byteLength) {
	      anInstance(this, $DataView, DATA_VIEW);
	      anInstance(buffer, $ArrayBuffer, DATA_VIEW);
	      var bufferLength = getInternalState(buffer).byteLength;
	      var offset = toInteger(byteOffset);
	      if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset');
	      byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
	      if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
	      setInternalState(this, {
	        buffer: buffer,
	        byteLength: byteLength,
	        byteOffset: offset
	      });

	      if (!descriptors) {
	        this.buffer = buffer;
	        this.byteLength = byteLength;
	        this.byteOffset = offset;
	      }
	    };

	    if (descriptors) {
	      addGetter($ArrayBuffer, 'byteLength');
	      addGetter($DataView, 'buffer');
	      addGetter($DataView, 'byteLength');
	      addGetter($DataView, 'byteOffset');
	    }

	    redefineAll($DataView[PROTOTYPE], {
	      getInt8: function getInt8(byteOffset) {
	        return get(this, 1, byteOffset)[0] << 24 >> 24;
	      },
	      getUint8: function getUint8(byteOffset) {
	        return get(this, 1, byteOffset)[0];
	      },
	      getInt16: function getInt16(byteOffset
	      /* , littleEndian */
	      ) {
	        var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	        return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	      },
	      getUint16: function getUint16(byteOffset
	      /* , littleEndian */
	      ) {
	        var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	        return bytes[1] << 8 | bytes[0];
	      },
	      getInt32: function getInt32(byteOffset
	      /* , littleEndian */
	      ) {
	        return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
	      },
	      getUint32: function getUint32(byteOffset
	      /* , littleEndian */
	      ) {
	        return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
	      },
	      getFloat32: function getFloat32(byteOffset
	      /* , littleEndian */
	      ) {
	        return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
	      },
	      getFloat64: function getFloat64(byteOffset
	      /* , littleEndian */
	      ) {
	        return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
	      },
	      setInt8: function setInt8(byteOffset, value) {
	        set(this, 1, byteOffset, packInt8, value);
	      },
	      setUint8: function setUint8(byteOffset, value) {
	        set(this, 1, byteOffset, packInt8, value);
	      },
	      setInt16: function setInt16(byteOffset, value
	      /* , littleEndian */
	      ) {
	        set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	      },
	      setUint16: function setUint16(byteOffset, value
	      /* , littleEndian */
	      ) {
	        set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	      },
	      setInt32: function setInt32(byteOffset, value
	      /* , littleEndian */
	      ) {
	        set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	      },
	      setUint32: function setUint32(byteOffset, value
	      /* , littleEndian */
	      ) {
	        set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	      },
	      setFloat32: function setFloat32(byteOffset, value
	      /* , littleEndian */
	      ) {
	        set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
	      },
	      setFloat64: function setFloat64(byteOffset, value
	      /* , littleEndian */
	      ) {
	        set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
	      }
	    });
	  } else {
	    if (!fails(function () {
	      NativeArrayBuffer(1);
	    }) || !fails(function () {
	      new NativeArrayBuffer(-1); // eslint-disable-line no-new
	    }) || fails(function () {
	      new NativeArrayBuffer(); // eslint-disable-line no-new

	      new NativeArrayBuffer(1.5); // eslint-disable-line no-new

	      new NativeArrayBuffer(NaN); // eslint-disable-line no-new

	      return NativeArrayBuffer.name != ARRAY_BUFFER;
	    })) {
	      $ArrayBuffer = function ArrayBuffer(length) {
	        anInstance(this, $ArrayBuffer);
	        return new NativeArrayBuffer(toIndex(length));
	      };

	      var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE] = NativeArrayBuffer[PROTOTYPE];

	      for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
	        if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, NativeArrayBuffer[key]);
	      }

	      ArrayBufferPrototype.constructor = $ArrayBuffer;
	    } // iOS Safari 7.x bug


	    var testView = new $DataView(new $ArrayBuffer(2));
	    var nativeSetInt8 = $DataView[PROTOTYPE].setInt8;
	    testView.setInt8(0, 2147483648);
	    testView.setInt8(1, 2147483649);
	    if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
	      setInt8: function setInt8(byteOffset, value) {
	        nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
	      },
	      setUint8: function setUint8(byteOffset, value) {
	        nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
	      }
	    }, {
	      unsafe: true
	    });
	  }

	  setToStringTag($ArrayBuffer, ARRAY_BUFFER);
	  setToStringTag($DataView, DATA_VIEW);
	  exports[ARRAY_BUFFER] = $ArrayBuffer;
	  exports[DATA_VIEW] = $DataView;
	});

	var SPECIES$5 = wellKnownSymbol('species'); // `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor

	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$5]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var ArrayBuffer$1 = arrayBuffer.ArrayBuffer;
	var DataView$2 = arrayBuffer.DataView;
	var nativeArrayBufferSlice = ArrayBuffer$1.prototype.slice;
	var INCORRECT_SLICE = fails(function () {
	  return !new ArrayBuffer$1(2).slice(1, undefined).byteLength;
	}); // `ArrayBuffer.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice

	_export({
	  target: 'ArrayBuffer',
	  proto: true,
	  unsafe: true,
	  forced: INCORRECT_SLICE
	}, {
	  slice: function slice(start, end) {
	    if (nativeArrayBufferSlice !== undefined && end === undefined) {
	      return nativeArrayBufferSlice.call(anObject(this), start); // FF fix
	    }

	    var length = anObject(this).byteLength;
	    var first = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    var result = new (speciesConstructor(this, ArrayBuffer$1))(toLength(fin - first));
	    var viewSource = new DataView$2(this);
	    var viewTarget = new DataView$2(result);
	    var index = 0;

	    while (first < fin) {
	      viewTarget.setUint8(index++, viewSource.getUint8(first++));
	    }

	    return result;
	  }
	});

	/* eslint-disable no-new */

	var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
	var ArrayBuffer$2 = global_1.ArrayBuffer;
	var Int8Array$2 = global_1.Int8Array;
	var typedArraysConstructorsRequiresWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$1 || !fails(function () {
	  Int8Array$2(1);
	}) || !fails(function () {
	  new Int8Array$2(-1);
	}) || !checkCorrectnessOfIteration(function (iterable) {
	  new Int8Array$2();
	  new Int8Array$2(null);
	  new Int8Array$2(1.5);
	  new Int8Array$2(iterable);
	}, true) || fails(function () {
	  // Safari 11 bug
	  return new Int8Array$2(new ArrayBuffer$2(2), 1, undefined).length !== 1;
	});

	var toOffset = function (it, BYTES) {
	  var offset = toInteger(it);
	  if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset');
	  return offset;
	};

	var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

	var typedArrayFrom = function from(source
	/* , mapfn, thisArg */
	) {
	  var O = toObject(source);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod(O);
	  var i, length, result, step, iterator;

	  if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
	    iterator = iteratorMethod.call(O);
	    O = [];

	    while (!(step = iterator.next()).done) {
	      O.push(step.value);
	    }
	  }

	  if (mapping && argumentsLength > 2) {
	    mapfn = bindContext(mapfn, arguments[2], 2);
	  }

	  length = toLength(O.length);
	  result = new (aTypedArrayConstructor$1(this))(length);

	  for (i = 0; length > i; i++) {
	    result[i] = mapping ? mapfn(O[i], i) : O[i];
	  }

	  return result;
	};

	var typedArrayConstructor = createCommonjsModule(function (module) {

	  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	  var forEach = arrayIteration.forEach;
	  var getInternalState = internalState.get;
	  var setInternalState = internalState.set;
	  var nativeDefineProperty = objectDefineProperty.f;
	  var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  var round = Math.round;
	  var RangeError = global_1.RangeError;
	  var ArrayBuffer = arrayBuffer.ArrayBuffer;
	  var DataView = arrayBuffer.DataView;
	  var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
	  var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
	  var TypedArray = arrayBufferViewCore.TypedArray;
	  var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
	  var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
	  var isTypedArray = arrayBufferViewCore.isTypedArray;
	  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
	  var WRONG_LENGTH = 'Wrong length';

	  var fromList = function (C, list) {
	    var index = 0;
	    var length = list.length;
	    var result = new (aTypedArrayConstructor(C))(length);

	    while (length > index) result[index] = list[index++];

	    return result;
	  };

	  var addGetter = function (it, key) {
	    nativeDefineProperty(it, key, {
	      get: function () {
	        return getInternalState(this)[key];
	      }
	    });
	  };

	  var isArrayBuffer = function (it) {
	    var klass;
	    return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
	  };

	  var isTypedArrayIndex = function (target, key) {
	    return isTypedArray(target) && typeof key != 'symbol' && key in target && String(+key) == String(key);
	  };

	  var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
	    return isTypedArrayIndex(target, key = toPrimitive(key, true)) ? createPropertyDescriptor(2, target[key]) : nativeGetOwnPropertyDescriptor(target, key);
	  };

	  var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
	    if (isTypedArrayIndex(target, key = toPrimitive(key, true)) && isObject(descriptor) && has(descriptor, 'value') && !has(descriptor, 'get') && !has(descriptor, 'set') // TODO: add validation descriptor w/o calling accessors
	    && !descriptor.configurable && (!has(descriptor, 'writable') || descriptor.writable) && (!has(descriptor, 'enumerable') || descriptor.enumerable)) {
	      target[key] = descriptor.value;
	      return target;
	    }

	    return nativeDefineProperty(target, key, descriptor);
	  };

	  if (descriptors) {
	    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	      objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
	      objectDefineProperty.f = wrappedDefineProperty;
	      addGetter(TypedArrayPrototype, 'buffer');
	      addGetter(TypedArrayPrototype, 'byteOffset');
	      addGetter(TypedArrayPrototype, 'byteLength');
	      addGetter(TypedArrayPrototype, 'length');
	    }

	    _export({
	      target: 'Object',
	      stat: true,
	      forced: !NATIVE_ARRAY_BUFFER_VIEWS
	    }, {
	      getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
	      defineProperty: wrappedDefineProperty
	    }); // eslint-disable-next-line max-statements

	    module.exports = function (TYPE, BYTES, wrapper, CLAMPED) {
	      var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
	      var GETTER = 'get' + TYPE;
	      var SETTER = 'set' + TYPE;
	      var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
	      var TypedArrayConstructor = NativeTypedArrayConstructor;
	      var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
	      var exported = {};

	      var getter = function (that, index) {
	        var data = getInternalState(that);
	        return data.view[GETTER](index * BYTES + data.byteOffset, true);
	      };

	      var setter = function (that, index, value) {
	        var data = getInternalState(that);
	        if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
	        data.view[SETTER](index * BYTES + data.byteOffset, value, true);
	      };

	      var addElement = function (that, index) {
	        nativeDefineProperty(that, index, {
	          get: function () {
	            return getter(this, index);
	          },
	          set: function (value) {
	            return setter(this, index, value);
	          },
	          enumerable: true
	        });
	      };

	      if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	        TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
	          anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
	          var index = 0;
	          var byteOffset = 0;
	          var buffer, byteLength, length;

	          if (!isObject(data)) {
	            length = toIndex(data);
	            byteLength = length * BYTES;
	            buffer = new ArrayBuffer(byteLength);
	          } else if (isArrayBuffer(data)) {
	            buffer = data;
	            byteOffset = toOffset(offset, BYTES);
	            var $len = data.byteLength;

	            if ($length === undefined) {
	              if ($len % BYTES) throw RangeError(WRONG_LENGTH);
	              byteLength = $len - byteOffset;
	              if (byteLength < 0) throw RangeError(WRONG_LENGTH);
	            } else {
	              byteLength = toLength($length) * BYTES;
	              if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
	            }

	            length = byteLength / BYTES;
	          } else if (isTypedArray(data)) {
	            return fromList(TypedArrayConstructor, data);
	          } else {
	            return typedArrayFrom.call(TypedArrayConstructor, data);
	          }

	          setInternalState(that, {
	            buffer: buffer,
	            byteOffset: byteOffset,
	            byteLength: byteLength,
	            length: length,
	            view: new DataView(buffer)
	          });

	          while (index < length) addElement(that, index++);
	        });
	        if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
	        TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
	      } else if (typedArraysConstructorsRequiresWrappers) {
	        TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
	          anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
	          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
	          if (isArrayBuffer(data)) return $length !== undefined ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length) : typedArrayOffset !== undefined ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES)) : new NativeTypedArrayConstructor(data);
	          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
	          return typedArrayFrom.call(TypedArrayConstructor, data);
	        });
	        if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
	        forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
	          if (!(key in TypedArrayConstructor)) hide(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
	        });
	        TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
	      }

	      if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
	        hide(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
	      }

	      if (TYPED_ARRAY_TAG) hide(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
	      exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;
	      _export({
	        global: true,
	        forced: TypedArrayConstructor != NativeTypedArrayConstructor,
	        sham: !NATIVE_ARRAY_BUFFER_VIEWS
	      }, exported);

	      if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
	        hide(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
	      }

	      if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
	        hide(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
	      }

	      setSpecies(CONSTRUCTOR_NAME);
	    };
	  } else module.exports = function () {
	    /* empty */
	  };
	});

	// https://tc39.github.io/ecma262/#sec-typedarray-objects

	typedArrayConstructor('Float32', 4, function (init) {
	  return function Float32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var min$4 = Math.min; // `Array.prototype.copyWithin` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.copywithin

	var arrayCopyWithin = [].copyWithin || function copyWithin(target
	/* = 0 */
	, start
	/* = 0, end = @length */
	) {
	  var O = toObject(this);
	  var len = toLength(O.length);
	  var to = toAbsoluteIndex(target, len);
	  var from = toAbsoluteIndex(start, len);
	  var end = arguments.length > 2 ? arguments[2] : undefined;
	  var count = min$4((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
	  var inc = 1;

	  if (from < to && to < from + count) {
	    inc = -1;
	    from += count - 1;
	    to += count - 1;
	  }

	  while (count-- > 0) {
	    if (from in O) O[to] = O[from];else delete O[to];
	    to += inc;
	    from += inc;
	  }

	  return O;
	};

	var aTypedArray$1 = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.copyWithin` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin

	arrayBufferViewCore.exportProto('copyWithin', function copyWithin(target, start
	/* , end */
	) {
	  return arrayCopyWithin.call(aTypedArray$1(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	});

	var $every = arrayIteration.every;
	var aTypedArray$2 = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.every` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every

	arrayBufferViewCore.exportProto('every', function every(callbackfn
	/* , thisArg */
	) {
	  return $every(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$3 = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.fill` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
	// eslint-disable-next-line no-unused-vars

	arrayBufferViewCore.exportProto('fill', function fill(value
	/* , start, end */
	) {
	  return arrayFill.apply(aTypedArray$3(this), arguments);
	});

	var $filter$1 = arrayIteration.filter;
	var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor; // `%TypedArray%.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter

	arrayBufferViewCore.exportProto('filter', function filter(callbackfn
	/* , thisArg */
	) {
	  var list = $filter$1(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  var C = speciesConstructor(this, this.constructor);
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor$2(C))(length);

	  while (length > index) result[index] = list[index++];

	  return result;
	});

	var $find = arrayIteration.find;
	var aTypedArray$5 = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find

	arrayBufferViewCore.exportProto('find', function find(predicate
	/* , thisArg */
	) {
	  return $find(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $findIndex = arrayIteration.findIndex;
	var aTypedArray$6 = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.findIndex` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex

	arrayBufferViewCore.exportProto('findIndex', function findIndex(predicate
	/* , thisArg */
	) {
	  return $findIndex(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $forEach$1 = arrayIteration.forEach;
	var aTypedArray$7 = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach

	arrayBufferViewCore.exportProto('forEach', function forEach(callbackfn
	/* , thisArg */
	) {
	  $forEach$1(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $includes$1 = arrayIncludes.includes;
	var aTypedArray$8 = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes

	arrayBufferViewCore.exportProto('includes', function includes(searchElement
	/* , fromIndex */
	) {
	  return $includes$1(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $indexOf$1 = arrayIncludes.indexOf;
	var aTypedArray$9 = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof

	arrayBufferViewCore.exportProto('indexOf', function indexOf(searchElement
	/* , fromIndex */
	) {
	  return $indexOf$1(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ITERATOR$6 = wellKnownSymbol('iterator');
	var Uint8Array$1 = global_1.Uint8Array;
	var arrayValues = es_array_iterator.values;
	var arrayKeys = es_array_iterator.keys;
	var arrayEntries = es_array_iterator.entries;
	var aTypedArray$a = arrayBufferViewCore.aTypedArray;
	var exportProto$1 = arrayBufferViewCore.exportProto;
	var nativeTypedArrayIterator = Uint8Array$1 && Uint8Array$1.prototype[ITERATOR$6];
	var CORRECT_ITER_NAME = !!nativeTypedArrayIterator && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

	var typedArrayValues = function values() {
	  return arrayValues.call(aTypedArray$a(this));
	}; // `%TypedArray%.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries


	exportProto$1('entries', function entries() {
	  return arrayEntries.call(aTypedArray$a(this));
	}); // `%TypedArray%.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys

	exportProto$1('keys', function keys() {
	  return arrayKeys.call(aTypedArray$a(this));
	}); // `%TypedArray%.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values

	exportProto$1('values', typedArrayValues, !CORRECT_ITER_NAME); // `%TypedArray%.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator

	exportProto$1(ITERATOR$6, typedArrayValues, !CORRECT_ITER_NAME);

	var aTypedArray$b = arrayBufferViewCore.aTypedArray;
	var $join = [].join; // `%TypedArray%.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
	// eslint-disable-next-line no-unused-vars

	arrayBufferViewCore.exportProto('join', function join(separator) {
	  return $join.apply(aTypedArray$b(this), arguments);
	});

	var min$5 = Math.min;
	var nativeLastIndexOf = [].lastIndexOf;
	var NEGATIVE_ZERO$1 = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
	var SLOPPY_METHOD$2 = sloppyArrayMethod('lastIndexOf'); // `Array.prototype.lastIndexOf` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof

	var arrayLastIndexOf = NEGATIVE_ZERO$1 || SLOPPY_METHOD$2 ? function lastIndexOf(searchElement
	/* , fromIndex = @[*-1] */
	) {
	  // convert -0 to +0
	  if (NEGATIVE_ZERO$1) return nativeLastIndexOf.apply(this, arguments) || 0;
	  var O = toIndexedObject(this);
	  var length = toLength(O.length);
	  var index = length - 1;
	  if (arguments.length > 1) index = min$5(index, toInteger(arguments[1]));
	  if (index < 0) index = length + index;

	  for (; index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;

	  return -1;
	} : nativeLastIndexOf;

	var aTypedArray$c = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.lastIndexOf` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
	// eslint-disable-next-line no-unused-vars

	arrayBufferViewCore.exportProto('lastIndexOf', function lastIndexOf(searchElement
	/* , fromIndex */
	) {
	  return arrayLastIndexOf.apply(aTypedArray$c(this), arguments);
	});

	var $map$1 = arrayIteration.map;
	var aTypedArray$d = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor; // `%TypedArray%.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map

	arrayBufferViewCore.exportProto('map', function map(mapfn
	/* , thisArg */
	) {
	  return $map$1(aTypedArray$d(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
	    return new (aTypedArrayConstructor$3(speciesConstructor(O, O.constructor)))(length);
	  });
	});

	var createMethod$4 = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aFunction$1(callbackfn);
	    var O = toObject(that);
	    var self = indexedObject(O);
	    var length = toLength(O.length);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }

	      index += i;

	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw TypeError('Reduce of empty array with no initial value');
	      }
	    }

	    for (; IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }

	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	  left: createMethod$4(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
	  right: createMethod$4(true)
	};

	var $reduce = arrayReduce.left;
	var aTypedArray$e = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.reduce` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce

	arrayBufferViewCore.exportProto('reduce', function reduce(callbackfn
	/* , initialValue */
	) {
	  return $reduce(aTypedArray$e(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $reduceRight = arrayReduce.right;
	var aTypedArray$f = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.reduceRicht` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright

	arrayBufferViewCore.exportProto('reduceRight', function reduceRight(callbackfn
	/* , initialValue */
	) {
	  return $reduceRight(aTypedArray$f(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$g = arrayBufferViewCore.aTypedArray;
	var floor$2 = Math.floor; // `%TypedArray%.prototype.reverse` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse

	arrayBufferViewCore.exportProto('reverse', function reverse() {
	  var that = this;
	  var length = aTypedArray$g(that).length;
	  var middle = floor$2(length / 2);
	  var index = 0;
	  var value;

	  while (index < middle) {
	    value = that[index];
	    that[index++] = that[--length];
	    that[length] = value;
	  }

	  return that;
	});

	var aTypedArray$h = arrayBufferViewCore.aTypedArray;
	var FORCED$3 = fails(function () {
	  // eslint-disable-next-line no-undef
	  new Int8Array(1).set({});
	}); // `%TypedArray%.prototype.set` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set

	arrayBufferViewCore.exportProto('set', function set(arrayLike
	/* , offset */
	) {
	  aTypedArray$h(this);
	  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
	  var length = this.length;
	  var src = toObject(arrayLike);
	  var len = toLength(src.length);
	  var index = 0;
	  if (len + offset > length) throw RangeError('Wrong length');

	  while (index < len) this[offset + index] = src[index++];
	}, FORCED$3);

	var aTypedArray$i = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;
	var $slice = [].slice;
	var FORCED$4 = fails(function () {
	  // eslint-disable-next-line no-undef
	  new Int8Array(1).slice();
	}); // `%TypedArray%.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice

	arrayBufferViewCore.exportProto('slice', function slice(start, end) {
	  var list = $slice.call(aTypedArray$i(this), start, end);
	  var C = speciesConstructor(this, this.constructor);
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor$4(C))(length);

	  while (length > index) result[index] = list[index++];

	  return result;
	}, FORCED$4);

	var $some = arrayIteration.some;
	var aTypedArray$j = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.some` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some

	arrayBufferViewCore.exportProto('some', function some(callbackfn
	/* , thisArg */
	) {
	  return $some(aTypedArray$j(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$k = arrayBufferViewCore.aTypedArray;
	var $sort = [].sort; // `%TypedArray%.prototype.sort` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort

	arrayBufferViewCore.exportProto('sort', function sort(comparefn) {
	  return $sort.call(aTypedArray$k(this), comparefn);
	});

	var aTypedArray$l = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.subarray` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray

	arrayBufferViewCore.exportProto('subarray', function subarray(begin, end) {
	  var O = aTypedArray$l(this);
	  var length = O.length;
	  var beginIndex = toAbsoluteIndex(begin, length);
	  return new (speciesConstructor(O, O.constructor))(O.buffer, O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT, toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex));
	});

	var Int8Array$3 = global_1.Int8Array;
	var aTypedArray$m = arrayBufferViewCore.aTypedArray;
	var $toLocaleString = [].toLocaleString;
	var $slice$1 = [].slice; // iOS Safari 6.x fails here

	var TO_LOCALE_STRING_BUG = !!Int8Array$3 && fails(function () {
	  $toLocaleString.call(new Int8Array$3(1));
	});
	var FORCED$5 = fails(function () {
	  return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
	}) || !fails(function () {
	  Int8Array$3.prototype.toLocaleString.call([1, 2]);
	}); // `%TypedArray%.prototype.toLocaleString` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring

	arrayBufferViewCore.exportProto('toLocaleString', function toLocaleString() {
	  return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$m(this)) : aTypedArray$m(this), arguments);
	}, FORCED$5);

	var Uint8Array$2 = global_1.Uint8Array;
	var Uint8ArrayPrototype = Uint8Array$2 && Uint8Array$2.prototype;
	var arrayToString = [].toString;
	var arrayJoin = [].join;

	if (fails(function () {
	  arrayToString.call({});
	})) {
	  arrayToString = function toString() {
	    return arrayJoin.call(this);
	  };
	} // `%TypedArray%.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring


	arrayBufferViewCore.exportProto('toString', arrayToString, (Uint8ArrayPrototype || {}).toString != arrayToString);

	var wrapper = document.getElementById("overlay-wrapper");
	var canvas = document.createElement("canvas");
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	wrapper.append(canvas);
	var b = wrapper.parentElement.getBoundingClientRect();
	var w = b.width;
	var h = b.height;
	canvas.width = w;
	canvas.height = h;
	var ctx = canvas.getContext("2d");
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "black";
	ctx.font = "italic 10pt Calibri";
	var camera;
	var visible;
	var points;
	var pointsL;
	var showIndeces;
	var skeleton;
	var skeletonL;
	var showSkeleton;
	var showUV = false;
	var uv;
	var uvL = 0;
	var debug3D = {
	  draw: function draw() {
	    if (!camera || !visible) return;
	    ctx.clearRect(0, 0, w, h);

	    if (showIndeces && pointsL) {
	      var i;

	      for (i = 0; i < pointsL; i++) {
	        var v = new Vec3(points[i * 3], points[i * 3 + 1], points[i * 3 + 2]);
	        camera.project(v);
	        ctx.fillText(i.toString(), (w + w * v[0]) / 2, (h - h * v[1]) / 2);
	      }
	    }

	    if (showSkeleton && skeletonL) {
	      //Loop though each skeleton
	      for (var _i = 0; _i < skeletonL; _i++) {
	        //Loop through each point along the skeleton
	        var l = skeleton[_i].length / 3;

	        for (var j = 0; j < l; j++) {
	          var _v = new Vec3(skeleton[_i][j * 3], skeleton[_i][j * 3 + 1], skeleton[_i][j * 3 + 2]);

	          camera.project(_v); //Convert from normalized coordinates to screen space

	          var x = (w + w * _v[0]) / 2;
	          var y = (h - h * _v[1]) / 2;
	          ctx.fillRect(x - 2, y - 2, 4, 4);

	          if (j === 0) {
	            ctx.beginPath();
	            ctx.moveTo(x, y);
	          } else {
	            ctx.lineTo(x, y);
	          }
	        }

	        ctx.stroke();
	      }
	    }

	    if (showUV && uv) {
	      for (var _j = 0; _j < uvL; _j++) {
	        //Convert from normalized coordinates to screen space
	        var _x = uv[_j * 2 + 0];
	        var _y = uv[_j * 2 + 1];
	        ctx.fillRect(_x - 2, _y - 2, 4, 4);

	        if (_j === 0) {
	          ctx.beginPath();
	          ctx.moveTo(_x, _y);
	        } else {
	          ctx.lineTo(_x, _y);
	        }
	      }

	      ctx.stroke();
	    }
	  },

	  set camera(c) {
	    camera = c;
	  },

	  set points(p) {
	    points = p;
	    pointsL = p.length / 3;
	  },

	  set uv(_uv) {
	    uv = new Float32Array(_uv.length);
	    var l = _uv.length / 2;
	    uvL = l;

	    for (var i = 0; i < l; i++) {
	      uv[i * 2 + 0] = Math.floor((1 + _uv[i * 2 + 0]) * w);
	      uv[i * 2 + 1] = Math.floor(_uv[i * 2 + 1] * h);
	    }
	  },

	  set skeleton(s) {
	    skeleton = s;
	    skeletonL = s.length;
	  },

	  show: function show() {},
	  hide: function hide() {},
	  update: function update(s) {
	    if (s["debug_indices"] || s["debug_skeleton"] || s["debug_uv"]) {
	      visible = true;
	      canvas.style.display = "";
	      showIndeces = !!s["debug_indices"];
	      showSkeleton = !!s["debug_skeleton"];
	      showUV = !!s["debug_uv"];
	    } else {
	      visible = false;
	      canvas.style.display = "none";
	    }
	  }
	};

	var wrapper$1 = document.getElementById("popup-wrapper");
	function popup (msg) {
	  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "info";
	  var p = document.createElement("div");
	  p.classList.add("popup");
	  var iconWrapper = document.createElement("span");
	  var progressBar = document.createElement("div");
	  progressBar.classList.add("popup-progress");
	  var time = 2000;

	  switch (type) {
	    case "success":
	      p.classList.add("popup-success");
	      iconWrapper.append(exp.checkmark);
	      break;

	    case "info":
	      p.classList.add("popup-info");
	      break;

	    case "sync":
	      p.classList.add("popup-sync");
	      break;

	    case "error":
	      p.classList.add("popup-error");
	      console.error(msg);
	      iconWrapper.append(exp.cross);
	      time = 3000 + msg.length * 50;
	      break;

	    default:
	      break;
	  }

	  progressBar.style.transition = "width ".concat(time, "ms linear");
	  var text = document.createElement("p");
	  text.innerHTML = msg;
	  p.append(iconWrapper);
	  p.append(text);
	  p.append(progressBar);
	  wrapper$1.insertBefore(p, wrapper$1.firstChild);
	  setTimeout(function () {
	    progressBar.classList.add("popup-progress-extend");
	    setTimeout(function () {
	      p.classList.add("popup-out");
	      setTimeout(function () {
	        p.remove();
	      }, 300);
	    }, time);
	  }, 50);
	}

	var wrapper$2 = document.getElementById("overlay-wrapper");
	var renderPerf = graph("render", "ms", 0, 0, wrapper$2);
	var generatePerf = graph("generate", "ms", 0, 100, wrapper$2);
	var vertices = graph("vertices", "", 0, 200, wrapper$2);
	var pdDisplay = document.getElementById("pd-display");
	var showPD = false;
	var overlay = {
	  renderTime: renderPerf,
	  generateTime: generatePerf,
	  vertices: vertices,
	  debug3d: debug3D,
	  popup: popup,
	  pd: function pd(_pd) {
	    if (!showPD) return;
	    pdDisplay.innerHTML = JSON.stringify(_pd, null, 2);
	  },
	  update: function update(s) {
	    debug3D.update(s);

	    if (s["debug_generate_perf"]) {
	      generatePerf.show();
	      vertices.show();
	    } else {
	      generatePerf.hide();
	      vertices.hide();
	    }

	    if (s["debug_render_perf"]) {
	      renderPerf.show();
	    } else {
	      renderPerf.hide();
	    }

	    if (s["debug_pd"]) {
	      pdDisplay.style.display = "";
	      showPD = true;
	    } else {
	      pdDisplay.style.display = "none";
	      showPD = false;
	    }
	  }
	};

	var data$1;

	function init() {
	  return _init.apply(this, arguments);
	}

	function _init() {
	  _init = _asyncToGenerator(
	  /*#__PURE__*/
	  regeneratorRuntime.mark(function _callee9() {
	    var worker;
	    return regeneratorRuntime.wrap(function _callee9$(_context9) {
	      while (1) {
	        switch (_context9.prev = _context9.next) {
	          case 0:
	            worker = new Worker("dataService.js");
	            data$1 = wrap(worker);
	            worker.addEventListener("message", function (ev) {
	              if (ev.data && ev.data.type === "overlay") {
	                overlay.popup(ev.data.value.msg, ev.data.value.type);
	              }
	            });

	          case 3:
	          case "end":
	            return _context9.stop();
	        }
	      }
	    }, _callee9);
	  }));
	  return _init.apply(this, arguments);
	}

	var data$2 = {
	  savePlant: function () {
	    var _savePlant = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee(pd) {
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              if (data$1) {
	                _context.next = 3;
	                break;
	              }

	              _context.next = 3;
	              return init();

	            case 3:
	              data$1.savePlant(pd);

	            case 4:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee);
	    }));

	    function savePlant(_x) {
	      return _savePlant.apply(this, arguments);
	    }

	    return savePlant;
	  }(),
	  deletePlant: function () {
	    var _deletePlant = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee2(meta) {
	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              if (data$1) {
	                _context2.next = 3;
	                break;
	              }

	              _context2.next = 3;
	              return init();

	            case 3:
	              data$1.deletePlant(meta);

	            case 4:
	            case "end":
	              return _context2.stop();
	          }
	        }
	      }, _callee2);
	    }));

	    function deletePlant(_x2) {
	      return _deletePlant.apply(this, arguments);
	    }

	    return deletePlant;
	  }(),
	  getPlant: function () {
	    var _getPlant = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee3(meta) {
	      return regeneratorRuntime.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              if (data$1) {
	                _context3.next = 3;
	                break;
	              }

	              _context3.next = 3;
	              return init();

	            case 3:
	              _context3.next = 5;
	              return data$1.getPlant(meta);

	            case 5:
	              return _context3.abrupt("return", _context3.sent);

	            case 6:
	            case "end":
	              return _context3.stop();
	          }
	        }
	      }, _callee3);
	    }));

	    function getPlant(_x3) {
	      return _getPlant.apply(this, arguments);
	    }

	    return getPlant;
	  }(),
	  getPlantMetas: function () {
	    var _getPlantMetas = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee4() {
	      return regeneratorRuntime.wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              if (data$1) {
	                _context4.next = 3;
	                break;
	              }

	              _context4.next = 3;
	              return init();

	            case 3:
	              _context4.next = 5;
	              return data$1.getPlantMetas();

	            case 5:
	              return _context4.abrupt("return", _context4.sent);

	            case 6:
	            case "end":
	              return _context4.stop();
	          }
	        }
	      }, _callee4);
	    }));

	    function getPlantMetas() {
	      return _getPlantMetas.apply(this, arguments);
	    }

	    return getPlantMetas;
	  }(),
	  getID: function () {
	    var _getID = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee5() {
	      return regeneratorRuntime.wrap(function _callee5$(_context5) {
	        while (1) {
	          switch (_context5.prev = _context5.next) {
	            case 0:
	              if (data$1) {
	                _context5.next = 3;
	                break;
	              }

	              _context5.next = 3;
	              return init();

	            case 3:
	              _context5.next = 5;
	              return data$1.getID();

	            case 5:
	              return _context5.abrupt("return", _context5.sent);

	            case 6:
	            case "end":
	              return _context5.stop();
	          }
	        }
	      }, _callee5);
	    }));

	    function getID() {
	      return _getID.apply(this, arguments);
	    }

	    return getID;
	  }(),
	  setID: function () {
	    var _setID = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee6(id) {
	      return regeneratorRuntime.wrap(function _callee6$(_context6) {
	        while (1) {
	          switch (_context6.prev = _context6.next) {
	            case 0:
	              if (data$1) {
	                _context6.next = 3;
	                break;
	              }

	              _context6.next = 3;
	              return init();

	            case 3:
	              _context6.next = 5;
	              return data$1.setID(id);

	            case 5:
	              return _context6.abrupt("return", _context6.sent);

	            case 6:
	            case "end":
	              return _context6.stop();
	          }
	        }
	      }, _callee6);
	    }));

	    function setID(_x4) {
	      return _setID.apply(this, arguments);
	    }

	    return setID;
	  }(),
	  enableSync: function () {
	    var _enableSync = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee7() {
	      return regeneratorRuntime.wrap(function _callee7$(_context7) {
	        while (1) {
	          switch (_context7.prev = _context7.next) {
	            case 0:
	              if (data$1) {
	                _context7.next = 3;
	                break;
	              }

	              _context7.next = 3;
	              return init();

	            case 3:
	              _context7.next = 5;
	              return data$1.enableSync();

	            case 5:
	              return _context7.abrupt("return", _context7.sent);

	            case 6:
	            case "end":
	              return _context7.stop();
	          }
	        }
	      }, _callee7);
	    }));

	    function enableSync() {
	      return _enableSync.apply(this, arguments);
	    }

	    return enableSync;
	  }(),
	  disableSync: function () {
	    var _disableSync = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee8() {
	      return regeneratorRuntime.wrap(function _callee8$(_context8) {
	        while (1) {
	          switch (_context8.prev = _context8.next) {
	            case 0:
	              if (data$1) {
	                _context8.next = 3;
	                break;
	              }

	              _context8.next = 3;
	              return init();

	            case 3:
	              _context8.next = 5;
	              return data$1.disableSync();

	            case 5:
	              return _context8.abrupt("return", _context8.sent);

	            case 6:
	            case "end":
	              return _context8.stop();
	          }
	        }
	      }, _callee8);
	    }));

	    function disableSync() {
	      return _disableSync.apply(this, arguments);
	    }

	    return disableSync;
	  }()
	};

	var nativeJoin = [].join;
	var ES3_STRINGS = indexedObject != Object;
	var SLOPPY_METHOD$3 = sloppyArrayMethod('join', ','); // `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join

	_export({
	  target: 'Array',
	  proto: true,
	  forced: ES3_STRINGS || SLOPPY_METHOD$3
	}, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var arrayPush = [].push;
	var min$6 = Math.min;
	var MAX_UINT32 = 0xFFFFFFFF; // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError

	var SUPPORTS_Y = !fails(function () {
	  return !RegExp(MAX_UINT32, 'y');
	}); // @@split logic

	fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;

	  if ('abbc'.split(/(b)*/)[1] == 'c' || 'test'.split(/(?:)/, -1).length != 4 || 'ab'.split(/(?:ab)*/).length != 2 || '.'.split(/(.?)(.?)/).length != 4 || '.'.split(/()()/).length > 1 || ''.split(/.?/).length) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string]; // If `separator` is not a regex, use native split

	      if (!isRegexp(separator)) {
	        return nativeSplit.call(string, separator, lim);
	      }

	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0; // Make `global` and avoid `lastIndex` issues by working with a copy

	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;

	      while (match = regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;

	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }

	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }

	      if (lastLastIndex === string.length) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));

	      return output.length > lim ? output.slice(0, lim) : output;
	    }; // Chakra, V8

	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [// `String.prototype.split` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.split
	  function split(separator, limit) {
	    var O = requireObjectCoercible(this);
	    var splitter = separator == undefined ? undefined : separator[SPLIT];
	    return splitter !== undefined ? splitter.call(separator, O, limit) : internalSplit.call(String(O), separator, limit);
	  }, // `RegExp.prototype[@@split]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	  //
	  // NOTE: This cannot be properly polyfilled in engines that don't support
	  // the 'y' flag.
	  function (regexp, limit) {
	    var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
	    if (res.done) return res.value;
	    var rx = anObject(regexp);
	    var S = String(this);
	    var C = speciesConstructor(rx, RegExp);
	    var unicodeMatching = rx.unicode;
	    var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (SUPPORTS_Y ? 'y' : 'g'); // ^(? + rx + ) is needed, in combination with some S slicing, to
	    // simulate the 'y' flag.

	    var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	    var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	    if (lim === 0) return [];
	    if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
	    var p = 0;
	    var q = 0;
	    var A = [];

	    while (q < S.length) {
	      splitter.lastIndex = SUPPORTS_Y ? q : 0;
	      var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	      var e;

	      if (z === null || (e = min$6(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p) {
	        q = advanceStringIndex(S, q, unicodeMatching);
	      } else {
	        A.push(S.slice(p, q));
	        if (A.length === lim) return A;

	        for (var i = 1; i <= z.length - 1; i++) {
	          A.push(z[i]);
	          if (A.length === lim) return A;
	        }

	        q = p = e;
	      }
	    }

	    A.push(S.slice(p));
	    return A;
	  }];
	}, !SUPPORTS_Y);

	function containsIncrementer(string) {
	  if (!string.includes("_")) return false;
	  var a = string.split("_");
	  if (isNaN(a[a.length - 1])) return false;
	  return true;
	}

	function increment(name, alreadyTakenNames) {
	  var newName = "";

	  if (containsIncrementer(name)) {
	    var _s = name.split("_");

	    _s[_s.length - 1] = parseInt(_s[_s.length - 1]) + 1 + "";
	    newName = _s.join("_");
	  } else {
	    newName = name + "_1";
	  }

	  if (alreadyTakenNames.includes(newName)) {
	    return increment(newName, alreadyTakenNames);
	  } else {
	    return newName;
	  }
	}

	var FileSaver_min = createCommonjsModule(function (module, exports) {
	  (function (a, b) {
	    b();
	  })(commonjsGlobal, function () {

	    function b(a, b) {
	      return "undefined" == typeof b ? b = {
	        autoBom: !1
	      } : "object" != typeof b && (console.warn("Deprecated: Expected third argument to be a object"), b = {
	        autoBom: !b
	      }), b.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type) ? new Blob(["\uFEFF", a], {
	        type: a.type
	      }) : a;
	    }

	    function c(b, c, d) {
	      var e = new XMLHttpRequest();
	      e.open("GET", b), e.responseType = "blob", e.onload = function () {
	        a(e.response, c, d);
	      }, e.onerror = function () {
	        console.error("could not download file");
	      }, e.send();
	    }

	    function d(a) {
	      var b = new XMLHttpRequest();
	      b.open("HEAD", a, !1);

	      try {
	        b.send();
	      } catch (a) {}

	      return 200 <= b.status && 299 >= b.status;
	    }

	    function e(a) {
	      try {
	        a.dispatchEvent(new MouseEvent("click"));
	      } catch (c) {
	        var b = document.createEvent("MouseEvents");
	        b.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), a.dispatchEvent(b);
	      }
	    }

	    var f = "object" == typeof window && window.window === window ? window : "object" == typeof self && self.self === self ? self : "object" == typeof commonjsGlobal && commonjsGlobal.global === commonjsGlobal ? commonjsGlobal : void 0,
	        a = f.saveAs || ("object" != typeof window || window !== f ? function () {} : "download" in HTMLAnchorElement.prototype ? function (b, g, h) {
	      var i = f.URL || f.webkitURL,
	          j = document.createElement("a");
	      g = g || b.name || "download", j.download = g, j.rel = "noopener", "string" == typeof b ? (j.href = b, j.origin === location.origin ? e(j) : d(j.href) ? c(b, g, h) : e(j, j.target = "_blank")) : (j.href = i.createObjectURL(b), setTimeout(function () {
	        i.revokeObjectURL(j.href);
	      }, 4E4), setTimeout(function () {
	        e(j);
	      }, 0));
	    } : "msSaveOrOpenBlob" in navigator ? function (f, g, h) {
	      if (g = g || f.name || "download", "string" != typeof f) navigator.msSaveOrOpenBlob(b(f, h), g);else if (d(f)) c(f, g, h);else {
	        var i = document.createElement("a");
	        i.href = f, i.target = "_blank", setTimeout(function () {
	          e(i);
	        });
	      }
	    } : function (a, b, d, e) {
	      if (e = e || open("", "_blank"), e && (e.document.title = e.document.body.innerText = "downloading..."), "string" == typeof a) return c(a, b, d);
	      var g = "application/octet-stream" === a.type,
	          h = /constructor/i.test(f.HTMLElement) || f.safari,
	          i = /CriOS\/[\d]+/.test(navigator.userAgent);

	      if ((i || g && h) && "object" == typeof FileReader) {
	        var j = new FileReader();
	        j.onloadend = function () {
	          var a = j.result;
	          a = i ? a : a.replace(/^data:[^;]*;/, "data:attachment/file;"), e ? e.location.href = a : location = a, e = null;
	        }, j.readAsDataURL(a);
	      } else {
	        var k = f.URL || f.webkitURL,
	            l = k.createObjectURL(a);
	        e ? e.location = l : location.href = l, e = null, setTimeout(function () {
	          k.revokeObjectURL(l);
	        }, 4E4);
	      }
	    });
	    f.saveAs = a.saveAs = a,  (module.exports = a);
	  });
	});

	var download = function download(data, name, mimetype, extension) {
	  var blob = new Blob([data], {
	    type: mimetype + ";charset=utf-8"
	  });
	  FileSaver_min.saveAs(blob, name + "." + extension);
	};

	function json() {
	  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "default";
	  download(JSON.stringify(data), name, "application/json", "json");
	}
	function obj(data) {
	  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "default";
	  download(data, name, "text/plain", "obj");
	}

	function versionToNumber(v) {
	  return parseInt(v.split(".").join(""));
	}

	var nativeAssign = Object.assign; // `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	// should work with symbols and should have deterministic property order (V8 bug)

	var objectAssign = !nativeAssign || fails(function () {
	  var A = {};
	  var B = {}; // eslint-disable-next-line no-undef

	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) {
	    B[chr] = chr;
	  });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) {
	  // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;

	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;

	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  }

	  return T;
	} : nativeAssign;

	// https://tc39.github.io/ecma262/#sec-object.assign

	_export({
	  target: 'Object',
	  stat: true,
	  forced: Object.assign !== objectAssign
	}, {
	  assign: objectAssign
	});

	function upgradePlant(pd) {
	  return Object.assign(JSON.parse(JSON.stringify(defaultPD)), pd);
	}

	var version$1 = versionToNumber(version);
	var log$1 = logger("project manager");
	var plantStore = new Map();
	var metaStore = new Map();
	var activePlantName = localStorage.activePlantName;
	var pd;
	var nextStage$1;
	var projectManager = {
	  updateMeta: function () {
	    var _updateMeta = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee(oldMeta, newMeta) {
	      var oldPD;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              if (!plantStore.has(oldMeta.name)) {
	                _context.next = 17;
	                break;
	              }

	              oldPD = plantStore.get(oldMeta.name);

	              if (plantStore.has(newMeta.name)) {
	                newMeta.name = increment(newMeta.name, Array.from(plantStore.keys()));
	              }

	              if (!oldPD) {
	                _context.next = 11;
	                break;
	              }

	              plantStore.delete(oldMeta.name);
	              metaStore.delete(oldMeta.name);
	              data$2.deletePlant(oldMeta);
	              oldPD.meta = newMeta;
	              this.save(oldPD);
	              _context.next = 17;
	              break;

	            case 11:
	              _context.next = 13;
	              return data$2.getPlant(oldMeta);

	            case 13:
	              oldPD = _context.sent;
	              oldPD.meta = newMeta;
	              data$2.deletePlant(oldMeta);
	              data$2.savePlant(oldPD);

	            case 17:
	              this.setActivePlant(newMeta);

	            case 18:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, this);
	    }));

	    function updateMeta(_x, _x2) {
	      return _updateMeta.apply(this, arguments);
	    }

	    return updateMeta;
	  }(),
	  setActivePlant: function () {
	    var _setActivePlant = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee2(meta) {
	      var pd, activePD;
	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              if (!(meta.name === activePlantName)) {
	                _context2.next = 2;
	                break;
	              }

	              return _context2.abrupt("return");

	            case 2:
	              //Unload old project
	              if (plantStore.has(activePlantName)) {
	                plantStore.set(activePlantName, undefined);
	              }

	              activePlantName = meta.name;
	              localStorage.setItem("activePlantName", name);
	              _context2.next = 7;
	              return data$2.getPlant(meta);

	            case 7:
	              pd = _context2.sent;
	              //Load new from database
	              plantStore.set(activePlantName, pd);
	              activePD = plantStore.get(activePlantName);

	              if (activePD.meta.plantariumVersion) {
	                if (versionToNumber(activePD.meta.plantariumVersion) < version$1) {
	                  log$1("upgraded project ".concat(activePD.meta.name, " from version: ").concat(activePD.meta.plantariumVersion, " to version:").concat(version), 2);
	                  activePD.meta.plantariumVersion = version;
	                  importerStage.init(upgradePlant(activePD));
	                } else {
	                  importerStage.init(activePD);
	                }
	              } else {
	                activePD.meta.plantariumVersion = version;
	                importerStage.init(activePD);
	              }

	              return _context2.abrupt("return", true);

	            case 12:
	            case "end":
	              return _context2.stop();
	          }
	        }
	      }, _callee2);
	    }));

	    function setActivePlant(_x3) {
	      return _setActivePlant.apply(this, arguments);
	    }

	    return setActivePlant;
	  }(),
	  newPlant: function newPlant(_name) {
	    var plant = _name && plantStore.has(_name) ? JSON.parse(JSON.stringify(plantStore.get(_name))) : JSON.parse(JSON.stringify(defaultPD));
	    this.addPlant(plant);
	    this.updateUI();
	    return plant;
	  },
	  addPlant: function addPlant(_pd) {
	    _pd.meta.name = increment(_pd.meta.name, Array.from(plantStore.keys()));
	    data$2.savePlant(_pd);
	    metaStore.set(_pd.meta.name, _pd.meta);
	    this.setActivePlant(_pd.meta);
	  },
	  deletePlant: function deletePlant(_meta) {
	    plantStore.delete(_meta.name);
	    metaStore.delete(_meta.name);
	    data$2.deletePlant(_meta);

	    if (metaStore.size === 0) {
	      this.addPlant(defaultPD);
	    } else if (!plantStore.has(activePlantName)) {
	      this.setActivePlant(plantStore.keys().next().value);
	    }
	  },
	  save: function save(pd) {
	    pd.meta.lastSaved = Date.now();
	    plantStore.set(pd.meta.name, pd);
	    metaStore.set(pd.meta.name, pd.meta);
	    data$2.savePlant(pd);
	  },
	  download: function () {
	    var _download = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee3(meta) {
	      var pd;
	      return regeneratorRuntime.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              _context3.next = 2;
	              return data$2.getPlant(meta);

	            case 2:
	              pd = _context3.sent;
	              json(pd, meta.name);

	            case 4:
	            case "end":
	              return _context3.stop();
	          }
	        }
	      }, _callee3);
	    }));

	    function download(_x4) {
	      return _download.apply(this, arguments);
	    }

	    return download;
	  }(),

	  get plantNames() {
	    return Array.from(plantStore.keys());
	  },

	  get plantMetas() {
	    return Array.from(metaStore.values());
	  },

	  get activePlantName() {
	    return activePlantName;
	  },

	  set pd(_pd) {
	    pd = _pd;

	    if (nextStage$1) {
	      nextStage$1.pd = _pd;
	    }

	    this.save(_pd);
	  },

	  get pd() {
	    return pd;
	  },

	  init: function () {
	    var _init = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee4() {
	      var plantMetas, projectName;
	      return regeneratorRuntime.wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              _context4.next = 2;
	              return data$2.getPlantMetas();

	            case 2:
	              plantMetas = _context4.sent;

	              if (!plantMetas.length) {
	                data$2.savePlant(defaultPD);
	                plantStore.set(defaultPD.meta.name, defaultPD);
	                metaStore.set(defaultPD.meta.name, defaultPD.meta);
	                this.setActivePlant(defaultPD.meta);
	              } else {
	                plantMetas.forEach(function (meta) {
	                  metaStore.set(meta.name, meta);
	                });
	              }

	              if (activePlantName) {
	                //Load active project from database
	                log$1("load project " + activePlantName, 2);
	                this.setActivePlant({
	                  name: activePlantName
	                });
	              } else if (plantStore.size > 0) {
	                //Set first project active
	                projectName = plantStore.keys().next().value;
	                log$1("load project " + projectName, 2);
	                this.setActivePlant(projectName);
	              } else {
	                log$1("load project default project", 2);
	                this.addPlant(defaultPD);
	              }

	            case 5:
	            case "end":
	              return _context4.stop();
	          }
	        }
	      }, _callee4, this);
	    }));

	    function init() {
	      return _init.apply(this, arguments);
	    }

	    return init;
	  }(),
	  connect: function connect(_s) {
	    nextStage$1 = _s;
	  },
	  updateUI: function updateUI() {
	    pd && importerStage.init(pd);
	  }
	};

	var activeElement, callback, value;

	function setCursorPos(el) {
	  el.focus();

	  if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
	    var range = document.createRange();
	    range.selectNodeContents(el);
	    range.collapse(false);
	    var sel = window.getSelection();
	    sel.removeAllRanges();
	    sel.addRange(range);
	  } else if (typeof document.body.createTextRange != "undefined") {
	    var textRange = document.body.createTextRange();
	    textRange.moveToElementText(el);
	    textRange.collapse(false);
	    textRange.select();
	  }
	}

	function stopEditing(ev) {
	  if (ev.type === "blur" || ev.keyCode === 13) {
	    if (activeElement.getAttribute("contenteditable")) {
	      activeElement.removeAttribute("contenteditable");
	      activeElement.removeEventListener("blur", function (ev) {
	        return stopEditing(ev);
	      }, false);
	      activeElement.removeEventListener("keydown", function (ev) {
	        return stopEditing(ev);
	      }, false);
	      if (value !== activeElement.innerText) callback(activeElement.innerText);
	    }
	  }
	}

	function makeEditable (el, cb) {
	  activeElement = el;
	  callback = cb;
	  value = el.innerText;
	  el.setAttribute("contenteditable", "true");
	  el.addEventListener("keydown", function (ev) {
	    return stopEditing(ev);
	  }, false);
	  el.addEventListener("blur", function (ev) {
	    return stopEditing(ev);
	  }, false);
	  setCursorPos(el);
	}

	var deleteWrapper = document.createElement("div");
	deleteWrapper.classList.add("ui-delete-wrapper");
	var deleteWrapperCancel = document.createElement("button");
	deleteWrapperCancel.innerHTML = "cancel";
	deleteWrapperCancel.classList.add("ui-delete-cancel");
	var deleteWrapperConfirm = document.createElement("button");
	deleteWrapperConfirm.innerHTML = "confirm";
	deleteWrapperConfirm.classList.add("ui-delete-confirm");
	deleteWrapper.append(deleteWrapperConfirm);
	deleteWrapper.append(deleteWrapperCancel);

	var UIPlantList =
	/*#__PURE__*/
	function (_UIElement) {
	  _inherits(UIPlantList, _UIElement);

	  function UIPlantList(stage, wrapper, config) {
	    var _this;

	    _classCallCheck(this, UIPlantList);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIPlantList).call(this, stage, wrapper, config));

	    _defineProperty(_assertThisInitialized(_this), "rows", new Map());

	    _defineProperty(_assertThisInitialized(_this), "table", document.createElement("table"));

	    _defineProperty(_assertThisInitialized(_this), "scrollWrapper", document.createElement("div"));

	    _this.wrapper.classList.add("ui-project-list-wrapper");

	    _this.scrollWrapper.classList.add("ui-project-list-scroll-wrapper");

	    var addNewButton = document.createElement("button");
	    addNewButton.addEventListener("click", function () {
	      projectManager.newPlant();
	    }, false);
	    addNewButton.innerHTML = "+";

	    _this.scrollWrapper.append(_this.table);

	    _this.wrapper.append(_this.scrollWrapper);

	    _this.wrapper.append(addNewButton);

	    return _this;
	  }

	  _createClass(UIPlantList, [{
	    key: "addPlant",
	    value: function addPlant(_meta) {
	      var _this2 = this;

	      var _active = projectManager.activePlantName;
	      var tr = document.createElement("tr"); //Create projectName

	      var projectName = document.createElement("td");
	      var p = document.createElement("p");
	      p.innerHTML = _meta.name;
	      projectName.addEventListener("dblclick", function () {
	        return makeEditable(p, function (value) {
	          var newMeta = JSON.parse(JSON.stringify(_meta));
	          newMeta.name = value;
	          p.innerHTML = value;
	          projectManager.updateMeta(_meta, newMeta);
	        });
	      });
	      projectName.append(p);
	      tr.append(projectName); //Create the buttons

	      var buttons = document.createElement("td");
	      buttons.align = "right";
	      var downloadJSONButton = document.createElement("button");
	      downloadJSONButton.addEventListener("click", function () {
	        projectManager.download(_meta);
	      }, false);
	      downloadJSONButton.append(exp.arrow);
	      buttons.append(downloadJSONButton); //Create the delete Button

	      var deleteButton = document.createElement("button");
	      deleteButton.addEventListener("click", function (ev) {
	        ev.preventDefault();
	        ev.stopPropagation();

	        _this2.deletePlant(_meta);
	      }, false);
	      deleteButton.append(exp.cross);
	      buttons.append(deleteButton);
	      tr.append(buttons);
	      tr.addEventListener("click", function () {
	        return projectManager.setActivePlant(_meta);
	      }, false);

	      if (_meta.name === _active) {
	        tr.classList.add("ui-project-list-row-active");
	      }

	      this.rows.set(_meta.name, tr);
	      this.table.insertBefore(tr, this.table.firstChild);
	      this.scrollTop();
	    }
	  }, {
	    key: "deletePlant",
	    value: function deletePlant(_meta) {
	      var _this3 = this;

	      var rowToBeDeleted = this.rows.get(_meta.name);
	      rowToBeDeleted.parentNode.insertBefore(deleteWrapper, rowToBeDeleted);

	      deleteWrapperCancel.onclick = function () {
	        deleteWrapper.remove();
	      };

	      deleteWrapperConfirm.onclick = function () {
	        rowToBeDeleted.classList.add("ui-row-deleted");
	        setTimeout(function () {
	          rowToBeDeleted.remove();
	        }, 500);
	        projectManager.deletePlant(_meta);

	        _this3.rows.delete(_meta.name);

	        deleteWrapper.remove();
	      };
	    }
	  }, {
	    key: "init",
	    value: function init() {
	      var _this4 = this;

	      var newMetas = projectManager.plantMetas;
	      var newNames = newMetas.map(function (_meta) {
	        return _meta.name;
	      }); //Remove rows if they are not present in the new data

	      Array.from(this.rows.keys()).forEach(function (k) {
	        if (!newNames.includes(k)) {
	          var el = _this4.rows.get(k);

	          _this4.rows.delete(k);

	          el.remove();
	        }
	      }); //Create all rows that arent created yet

	      var _active = projectManager.activePlantName;
	      newMetas.forEach(function (_meta) {
	        var el = _this4.rows.get(_meta.name);

	        if (el) {
	          //If name already has a row activate that row
	          _meta.name === _active ? el.classList.add("ui-project-list-row-active") : el.classList.remove("ui-project-list-row-active");
	        } else {
	          _this4.addPlant(_meta);
	        }
	      });
	    }
	  }, {
	    key: "scrollTop",
	    value: function scrollTop() {
	      var _this5 = this;

	      var _scrollTop = this.scrollWrapper.scrollTop;
	      var i = 0;
	      var l = 30;
	      var a = 0;

	      var render = function render() {
	        i++;

	        if (i <= l) {
	          requestAnimationFrame(render);
	          a = 1 - i / l;
	          _this5.scrollWrapper.scrollTop = a * (2 - a) * _scrollTop;
	        }
	      };

	      render();
	    }
	  }]);

	  return UIPlantList;
	}(UIElement);

	var UITab =
	/*#__PURE__*/
	function (_UIElement) {
	  _inherits(UITab, _UIElement);

	  function UITab(stage, wrapper, config) {
	    var _this;

	    _classCallCheck(this, UITab);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(UITab).call(this, stage, wrapper, config));

	    _defineProperty(_assertThisInitialized(_this), "elements", new Map());

	    _defineProperty(_assertThisInitialized(_this), "active", void 0);

	    _defineProperty(_assertThisInitialized(_this), "activeID", void 0);

	    var list = document.createElement("ul");
	    list.classList.add("ui-tab-wrapper");

	    if (config.title) {
	      var title = document.createElement("h4");
	      title.innerHTML = config.title;
	      title.classList.add("ui-number-title");

	      _this.wrapper.append(title);
	    }

	    if (config.init) {
	      var _init = config.init.bind(_assertThisInitialized(_this));

	      _this._init = function (pd) {
	        _this.setActive(_init(pd));
	      };
	    }

	    if (config.identifiers) {
	      config.identifiers.forEach(function (id) {
	        var listItem = document.createElement("li");
	        listItem.style.width = "".concat(100 / config.identifiers.length, "%");

	        _this.elements.set(id, listItem);

	        if (config.default && config.default === id) {
	          _this.setActive(id);
	        }

	        listItem.addEventListener("click", function () {
	          _this.setActive(id);
	        }, false);
	        var p = document.createElement("p");
	        p.innerHTML = id;
	        listItem.append(p);
	        list.append(listItem);
	      });
	    }

	    _this.wrapper.append(list);

	    return _this;
	  }

	  _createClass(UITab, [{
	    key: "setActive",
	    value: function setActive(id) {
	      if (id !== this.activeID) {
	        this.activeID = id;

	        if (this.active) {
	          this.active.classList.remove("ui-tab-active");
	        }

	        if (this.elements.has(id)) {
	          this.active = this.elements.get(id);
	          this.active.classList.add("ui-tab-active");
	        }

	        this.update(id);
	      }
	    }
	  }]);

	  return UITab;
	}(UIElement);

	var id$3 = 0;

	var UIFileInput =
	/*#__PURE__*/
	function (_UIElement) {
	  _inherits(UIFileInput, _UIElement);

	  function UIFileInput(stage, wrapper, config) {
	    var _this;

	    _classCallCheck(this, UIFileInput);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIFileInput).call(this, stage, wrapper, config));

	    _defineProperty(_assertThisInitialized(_this), "element", void 0);

	    _this.element = document.createElement("input");
	    _this.element.id = "input-file-" + id$3;
	    _this.element.type = "file";
	    _this.element.accept = "application/json";
	    _this.element.multiple = true;

	    _this.element.addEventListener("input", function () {
	      _this.parseFiles(_this.element.files);
	    });

	    var label = document.createElement("label");
	    label.setAttribute("for", "input-file-" + id$3++);
	    label.innerHTML = config.title || "Upload File";
	    label.classList.add("ui-button");
	    label.addEventListener("drop", function (ev) {
	      ev.preventDefault();

	      _this.parseFiles(ev.dataTransfer.files);
	    });
	    label.addEventListener("dragover", function (ev) {
	      ev.preventDefault();
	    });

	    _this.wrapper.append(_this.element);

	    _this.wrapper.append(label);

	    return _this;
	  }

	  _createClass(UIFileInput, [{
	    key: "parseFiles",
	    value: function parseFiles(files) {
	      var _this2 = this;

	      if (!files || !files.length) {
	        return;
	      }

	      var fr = new FileReader();
	      var i = 0;
	      var l = files.length;
	      var res = [];

	      fr.onload = function (e) {
	        if (e.target) {
	          res.push(JSON.parse(e.target.result));
	        }

	        if (i < l) {
	          fr.readAsText(files.item(i++));
	        } else {
	          _this2.update(res);

	          _this2.element.value = "";
	        }
	      };

	      fr.readAsText(files.item(i++));
	    }
	  }]);

	  return UIFileInput;
	}(UIElement);

	var UIText =
	/*#__PURE__*/
	function (_UIElement) {
	  _inherits(UIText, _UIElement);

	  function UIText(stage, wrapper, config) {
	    var _this;

	    _classCallCheck(this, UIText);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIText).call(this, stage, wrapper, config));

	    _defineProperty(_assertThisInitialized(_this), "element", void 0);

	    var text = document.createElement("input");
	    _this.element = text;
	    text.classList.add("ui-text-input");
	    text.type = "text";
	    text.size = 10;
	    text.placeholder = config.title;
	    text.addEventListener("click", function () {
	      this.select();
	    });
	    text.addEventListener("change", function () {
	      _this.update(text.value);
	    }, false);
	    text.addEventListener("keydown", function (ev) {
	      if (ev.key === "Enter") {
	        this.blur();
	      }
	    }, false);

	    if (config.title) {
	      var title = document.createElement("h4");
	      title.innerHTML = config.title;
	      title.classList.add("ui-number-title");

	      _this.wrapper.append(title);
	    }

	    if (config.init) {
	      var _init = config.init.bind(_assertThisInitialized(_this));

	      _this._init = function (pd) {
	        var v = _init(pd);

	        text.value = v;

	        _this.update(v);
	      };
	    }

	    _this.wrapper.append(text);

	    return _this;
	  }

	  return UIText;
	}(UIElement);



	var elements = /*#__PURE__*/Object.freeze({
		Curve: UICurve,
		Button: UIButton,
		Slider: UISlider,
		Group: Group,
		Checkbox: UICheckbox,
		LeafCreator: UICurve$1,
		Number: UINumber,
		ProjectMeta: UIProjectMeta,
		ProjectList: UIPlantList,
		Tab: UITab,
		FileInput: UIFileInput,
		Text: UIText
	});

	var log$2 = logger("create elements from config");

	function loopThroughChildren(stage, wrapper, config) {
	  var array = [];

	  if (_typeof(config.children) === "object") {
	    config.children.forEach(function (child) {
	      //If child is a group, create it and loop again
	      if (child.type === "Group") {
	        var group = new Group(wrapper, child);

	        if ("children" in child) {
	          array.push.apply(array, _toConsumableArray(loopThroughChildren(stage, group.wrapper, child)));
	        } //If the child is a UIElement, create it

	      } else if (child.type in elements) {
	        //@ts-ignore
	        array.push(new elements[child.type](stage, wrapper, child));
	      } else {
	        log$2.error("can't create nonexistent element " + child.type);
	      }
	    });
	  }

	  return array;
	}

	function createFromConfig(stage) {
	  return loopThroughChildren(stage, stage.wrapper, stage.config);
	}

	var log$3 = logger("stage handler");
	var topbar = document.getElementById("topbar");
	var activeStage;
	var activeButton;
	var activeButtonBackground = document.createElement("div");
	activeButtonBackground.classList.add("button-background");
	topbar.append(activeButtonBackground);
	var activeStageTitle = window.location.hash.replace("#", "") || "stem";
	log$3("default active stage: " + activeStageTitle, 3);
	var StageHandler = {
	  registerStage: function registerStage(stage, config) {
	    var button = document.createElement("button");
	    button.classList.add("topbar-button");

	    if (config) {
	      if (config.align) {
	        button.classList.add("align-right");
	      }

	      if (config.icon) {
	        button.append(exp[config.icon]);

	        if (config.iconOnly) {
	          button.classList.add("only-icon");
	        } else {
	          button.classList.add("button-icon");
	        }
	      }
	    }

	    if (!config.iconOnly) {
	      button.innerHTML += "<p>".concat(stage.config.title, "</p>");
	    }

	    button.addEventListener("click", function () {
	      if (activeStage !== stage) {
	        log$3("activating stage " + stage.title, 3);
	        activeStage.hide();
	        activeStage = stage;
	        window.location.hash = stage.title;
	        activeStage.show();
	        activeButton.classList.remove("button-active");
	        activeButton = button;
	        activeButton.classList.add("button-active");
	        var bounds = activeButton.getBoundingClientRect();
	        activeButtonBackground.style.width = bounds.width + "px";
	        activeButtonBackground.style.left = bounds.left + "px";
	      }
	    }, false);

	    if (stage.title === activeStageTitle) {
	      activeStage = stage;
	      activeButton = button;
	      activeButton.classList.add("button-active");
	      stage.show();
	      setTimeout(function () {
	        var bounds = activeButton.getBoundingClientRect();
	        activeButtonBackground.style.width = bounds.width + "px";
	        activeButtonBackground.style.left = bounds.left + "px";
	      }, 1);
	    }

	    topbar.append(button);
	  }
	};

	var log$4 = logger("stage class");
	var sidebar = document.getElementById("sidebar");

	var Stage =
	/*#__PURE__*/
	function () {
	  function Stage(config) {
	    _classCallCheck(this, Stage);

	    _defineProperty(this, "title", void 0);

	    _defineProperty(this, "config", void 0);

	    _defineProperty(this, "wrapper", void 0);

	    _defineProperty(this, "_listeners", []);

	    _defineProperty(this, "_nextStage", void 0);

	    _defineProperty(this, "_pd", {});

	    _defineProperty(this, "_elements", []);

	    this.title = config.title;
	    this.config = config;
	    this.wrapper = document.createElement("div");
	    this.wrapper.classList.add("stage-wrapper"); //Create all the elements (sliders, curves...)

	    this._elements = createFromConfig(this);
	    sidebar.append(this.wrapper);
	    StageHandler.registerStage(this, config);
	  }

	  _createClass(Stage, [{
	    key: "show",
	    value: function show() {
	      var _this = this;

	      this.wrapper.style.display = "";
	      setTimeout(function () {
	        _this.wrapper.classList.add("stage-wrapper-visible");
	      }, 300);
	    }
	  }, {
	    key: "hide",
	    value: function hide() {
	      var _this2 = this;

	      this.wrapper.classList.remove("stage-wrapper-visible");
	      setTimeout(function () {
	        _this2.wrapper.style.display = "none";
	      }, 300);
	    }
	  }, {
	    key: "init",
	    value: function init(pd) {
	      log$4("init stage " + this.config.title, 2);
	      this._pd = pd;

	      this._elements.forEach(function (el) {
	        return el.init(pd);
	      });

	      if (this._nextStage) {
	        this._nextStage.init(pd);
	      }
	    }
	  }, {
	    key: "connect",
	    value: function connect(stage) {
	      this._nextStage = stage;
	    }
	  }, {
	    key: "onActivate",
	    value: function onActivate(cb) {
	      this._listeners.push(cb);
	    }
	  }, {
	    key: "pd",
	    get: function get() {
	      return this._pd;
	    },
	    set: function set(v) {
	      this._pd = v;

	      if (this._nextStage) {
	        this._nextStage.pd = this._pd;
	      }
	    }
	  }]);

	  return Stage;
	}();

	var stemConfig = {
	  title: "stem",
	  type: "stage",
	  icon: "stem",
	  children: [{
	    type: "Number",
	    title: "Amount",
	    min: 1,
	    max: 150,
	    init: function init(pd) {
	      return pd.stem.amount;
	    },
	    onUpdate: function onUpdate(output, originalState) {
	      originalState.stem.amount = output.value;
	    }
	  }, {
	    type: "Slider",
	    title: "Gravity",
	    min: 0.001,
	    max: 1,
	    init: function init(pd) {
	      return pd.stem.gravity;
	    },
	    onUpdate: function onUpdate(output, originalState) {
	      originalState.stem.gravity = output.value;
	    }
	  }, {
	    title: "Origin",
	    type: "Group",
	    children: [{
	      type: "Slider",
	      title: "Position",
	      tooltip: "How far the stems are offset from the center",
	      min: 0,
	      max: 1,
	      init: function init(pd) {
	        return pd.stem.originOffset.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.stem.originOffset.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      title: "Position Variation",
	      tooltip: "How much the offset varies",
	      min: 0,
	      max: 1,
	      init: function init(pd) {
	        return pd.stem.originOffset.variation || 0;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.value === 0) {
	          delete originalState.stem.originOffset.variation;
	        } else {
	          originalState.stem.originOffset.variation = output.value;
	        }
	      }
	    }, {
	      type: "Slider",
	      title: "Rotation",
	      tooltip: "Stem rotation around the z axis",
	      default: 0,
	      min: 0,
	      max: 360,
	      init: function init(pd) {
	        return pd.stem.originRotation.value || 0;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.stem.originRotation.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      title: "Rotation Variation",
	      tooltip: "How much the stem rotation varies",
	      default: 0,
	      min: 0,
	      max: 360,
	      init: function init(pd) {
	        return pd.stem.originRotation.variation || 0;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.value === 0) {
	          delete originalState.stem.originRotation.variation;
	        } else {
	          originalState.stem.originRotation.variation = output.value;
	        }
	      }
	    }, {
	      type: "Slider",
	      title: "Angle",
	      default: 0,
	      min: 0,
	      max: 90,
	      init: function init(pd) {
	        return pd.stem.originAngle.value || 0;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.stem.originAngle.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      title: "Angle Variation",
	      default: 0,
	      min: 0,
	      max: 1.57,
	      init: function init(pd) {
	        if ("variation" in pd.stem.originAngle) {
	          return pd.stem.originAngle.variation;
	        } else {
	          return 0;
	        }
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.value === 0) {
	          delete originalState.stem.originAngle.variation;
	        } else {
	          originalState.stem.originAngle.variation = output.value;
	        }
	      }
	    }]
	  }, {
	    title: "Thiccness",
	    type: "Group",
	    children: [{
	      type: "Slider",
	      title: "Diameter",
	      min: 0.002,
	      max: 0.1,
	      init: function init(pd) {
	        return pd.stem.diameter.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.stem.diameter.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      title: "Diameter Variation",
	      default: 0,
	      min: 0,
	      max: 1,
	      init: function init(pd) {
	        return pd.stem.diameter.variation;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.value === 0) {
	          delete originalState.stem.diameter.variation;
	        } else {
	          originalState.stem.diameter.variation = output.value;
	        }
	      }
	    }, {
	      type: "Curve",
	      title: "Stem Diameter",
	      init: function init(pd) {
	        return pd.stem.diameter.curve;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.curve && output.curve.length <= 2) {
	          delete originalState.stem.diameter.curve;
	        } else {
	          originalState.stem.diameter.curve = output.curve;
	        }
	      }
	    }]
	  }, {
	    type: "Group",
	    title: "Noise",
	    children: [{
	      type: "Slider",
	      title: "Scale",
	      min: 1,
	      max: 10,
	      init: function init(pd) {
	        return pd.stem.noiseScale;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.stem.noiseScale = output.value;
	      }
	    }, {
	      type: "Slider",
	      title: "Strength",
	      min: 0,
	      max: 1,
	      init: function init(pd) {
	        return pd.stem.noiseStrength.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.stem.noiseStrength.value = output.value;
	      }
	    }, {
	      type: "Curve",
	      title: "Strength Curve",
	      init: function init(pd) {
	        return pd.stem.noiseStrength.curve;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.curve && output.curve.length <= 2) {
	          delete originalState.stem.noiseStrength.curve;
	        } else {
	          originalState.stem.noiseStrength.curve = output.curve;
	        }
	      }
	    }]
	  }, {
	    type: "Group",
	    title: "Size",
	    children: [{
	      type: "Slider",
	      title: "Size",
	      min: 0.1,
	      max: 4,
	      init: function init(pd) {
	        return pd.stem.size.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.stem.size.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      default: 0,
	      min: 0,
	      max: 1,
	      title: "Size Variation",
	      init: function init(pd) {
	        return pd.stem.size.variation;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.value === 0) {
	          delete originalState.stem.size.variation;
	        } else {
	          originalState.stem.size.variation = output.value;
	        }
	      }
	    }]
	  }]
	};

	var branchConfig = {
	  title: "branch",
	  type: "stage",
	  icon: "branch",
	  children: [{
	    type: "Checkbox",
	    title: "Use Branches",
	    default: true,
	    init: function init(pd) {
	      return pd.branches.enable;
	    },
	    onUpdate: function onUpdate(output, originalState) {
	      originalState.branches.enable = output.enabled;
	      projectManager.updateUI();
	    }
	  }, {
	    type: "Number",
	    title: "Amount",
	    min: 1,
	    max: 50,
	    init: function init(pd) {
	      this.enabled = pd.branches.enable;
	      return pd.branches.amount;
	    },
	    onUpdate: function onUpdate(output, originalState) {
	      originalState.branches.amount = output.value;
	    }
	  }, {
	    type: "Slider",
	    title: "Gravity",
	    min: 0,
	    max: 1,
	    init: function init(pd) {
	      this.enabled = pd.branches.enable;
	      return pd.branches.gravity;
	    },
	    onUpdate: function onUpdate(output, originalState) {
	      originalState.branches.gravity = output.value;
	    }
	  }, {
	    type: "Slider",
	    title: "Lowest Branch",
	    tooltip: "position of the lowest branch along the stem",
	    min: 0,
	    max: 1,
	    init: function init(pd) {
	      this.enabled = pd.branches.enable;
	      return pd.branches.lowestBranch.value;
	    },
	    onUpdate: function onUpdate(output, originalState) {
	      originalState.branches.lowestBranch.value = output.value;
	    }
	  }, {
	    title: "Offset",
	    type: "Group",
	    children: [{
	      type: "Slider",
	      title: "Offset",
	      tooltip: "offset the position of every 2nd branch along the stem",
	      min: 0,
	      max: 1,
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.offset.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.branches.offset.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      title: "Offset Variation",
	      min: 0,
	      max: 1,
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.offset.variation;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.branches.offset.variation = output.value;
	      }
	    }]
	  }, {
	    title: "Length",
	    type: "Group",
	    children: [{
	      type: "Slider",
	      title: "Length",
	      min: 0.05,
	      max: 2,
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.length.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.branches.length.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      default: 0,
	      title: "Variation",
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.length.variation;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.value === 0) {
	          delete originalState.branches.length.variation;
	        } else {
	          originalState.branches.length.variation = output.value;
	        }
	      }
	    }, {
	      type: "Curve",
	      title: "Length",
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.length.curve;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.curve && output.curve.length <= 2) {
	          delete originalState.branches.length.curve;
	        } else {
	          originalState.branches.length.curve = output.curve;
	        }
	      }
	    }]
	  }, {
	    title: "Diameter",
	    type: "Group",
	    children: [{
	      type: "Slider",
	      title: "Diameter",
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.diameter.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.branches.diameter.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      default: 0,
	      title: "Variation",
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.diameter.variation;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.value === 0) {
	          delete originalState.branches.diameter.variation;
	        } else {
	          originalState.branches.diameter.variation = output.value;
	        }
	      }
	    }, {
	      type: "Curve",
	      title: "Diameter",
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.diameter.curve;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.curve && output.curve.length <= 2) {
	          delete originalState.branches.diameter.curve;
	        } else {
	          originalState.branches.diameter.curve = output.curve;
	        }
	      }
	    }]
	  }, {
	    title: "Angle",
	    type: "Group",
	    children: [{
	      type: "Slider",
	      title: "Angle",
	      min: -0.5,
	      max: 0.5,
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.angle.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.branches.angle.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      title: "Angle Variation",
	      default: 0,
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.angle.variation;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.value === 0) {
	          delete originalState.branches.angle.variation;
	        } else {
	          originalState.branches.angle.variation = output.value;
	        }
	      }
	    }, {
	      type: "Curve",
	      title: "Angle",
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.angle.curve;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.curve && output.curve.length <= 2) {
	          delete originalState.branches.angle.curve;
	        } else {
	          originalState.branches.angle.curve = output.curve;
	        }
	      }
	    }]
	  }, {
	    title: "Rotation",
	    type: "Group",
	    children: [{
	      type: "Slider",
	      title: "Rotation",
	      tooltip: "rotates the branch around the stem",
	      min: 0,
	      max: 1,
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.rotation.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.branches.rotation.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      title: "Rotation Variation",
	      default: 0,
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.rotation.variation;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.value === 0) {
	          delete originalState.branches.rotation.variation;
	        } else {
	          originalState.branches.rotation.variation = output.value;
	        }
	      }
	    }]
	  }, {
	    type: "Group",
	    title: "Noise",
	    children: [{
	      type: "Slider",
	      title: "Scale",
	      min: 1,
	      max: 10,
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.noiseScale;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.branches.noiseScale = output.value;
	      }
	    }, {
	      type: "Slider",
	      title: "Strength",
	      min: 0,
	      max: 1,
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.noiseStrength.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.branches.noiseStrength.value = output.value;
	      }
	    }, {
	      type: "Curve",
	      title: "Strength Curve",
	      init: function init(pd) {
	        this.enabled = pd.branches.enable;
	        return pd.branches.noiseStrength.curve;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.curve && output.curve.length <= 2) {
	          delete originalState.branches.noiseStrength.curve;
	        } else {
	          originalState.branches.noiseStrength.curve = output.curve;
	        }
	      }
	    }]
	  }]
	};

	var leafConfig = {
	  title: "leaf",
	  type: "stage",
	  icon: "leaf",
	  children: [{
	    type: "Checkbox",
	    title: "Use Leaves",
	    default: true,
	    init: function init(pd) {
	      return pd.leaves.enable;
	    },
	    onUpdate: function onUpdate(output, originalState) {
	      originalState.leaves.enable = output.enabled;
	      projectManager.updateUI();
	    }
	  }, {
	    type: "Number",
	    title: "Amount",
	    min: 1,
	    max: 64,
	    init: function init(pd) {
	      this.enabled = pd.leaves.enable;
	      return pd.leaves.amount;
	    },
	    onUpdate: function onUpdate(output, originalState) {
	      originalState.leaves.amount = output.value;
	    }
	  }, {
	    type: "Slider",
	    title: "Gravity",
	    init: function init(pd) {
	      this.enabled = pd.leaves.enable;
	      return pd.leaves.gravity;
	    },
	    onUpdate: function onUpdate(output, originalState) {
	      originalState.leaves.gravity = output.value;
	    }
	  }, {
	    type: "Group",
	    title: "Distribution",
	    children: [{
	      type: "Slider",
	      title: "Lowest Leaf",
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.lowestLeaf;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.lowestLeaf = output.value;
	      }
	    }, {
	      type: "Checkbox",
	      title: "On Branches",
	      default: true,
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable && pd.leaves.enable;
	        return pd.leaves.onBranches;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.onBranches = output.enabled;
	      }
	    }, {
	      type: "Checkbox",
	      title: "On Stem",
	      default: false,
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.onStem;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.onStem = output.enabled;
	      }
	    }]
	  }, {
	    title: "Offset",
	    type: "Group",
	    children: [{
	      type: "Slider",
	      title: "Offset",
	      min: 0,
	      max: 1,
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.offset.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.offset.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      title: "Offset Variation",
	      min: 0,
	      max: 1,
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.offset.variation;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.offset.variation = output.value;
	      }
	    }]
	  }, {
	    type: "Group",
	    title: "Size",
	    children: [{
	      type: "Slider",
	      title: "Size",
	      min: 0.1,
	      max: 1,
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.size.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.size.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      title: "Size Variation",
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.size.variation;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.size.variation = output.value;
	      }
	    }, {
	      type: "Curve",
	      title: "Size",
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.size.curve;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.size.curve = output.curve;
	      }
	    }]
	  }, {
	    title: "Shape",
	    type: "Group",
	    children: [{
	      type: "LeafCreator",
	      title: "Outline",
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.shape;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.shape = output.shape;
	      }
	    }, {
	      type: "Curve",
	      title: "X Curvature",
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.xCurvature.curve;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.xCurvature.curve = output.curve;
	      }
	    }, {
	      type: "Slider",
	      title: "X Curvature Strength",
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.xCurvature.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.xCurvature.value = output.value;
	      }
	    }, {
	      type: "Curve",
	      title: "Y Curvature",
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.yCurvature.curve;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.yCurvature.curve = output.curve;
	      }
	    }, {
	      type: "Slider",
	      title: "Y Curvature Strength",
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.yCurvature.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.yCurvature.value = output.value;
	      }
	    }]
	  }, {
	    title: "Angle",
	    type: "Group",
	    children: [{
	      type: "Slider",
	      title: "Angle",
	      min: 0,
	      max: Math.PI,
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.angle.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.angle.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      title: "Angle Variation",
	      default: 0,
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.angle.variation;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.value === 0) {
	          delete originalState.leaves.angle.variation;
	        } else {
	          originalState.leaves.angle.variation = output.value;
	        }
	      }
	    }, {
	      type: "Curve",
	      title: "Angle",
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.angle.curve;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.curve && output.curve.length <= 2) {
	          delete originalState.leaves.angle.curve;
	        } else {
	          originalState.leaves.angle.curve = output.curve;
	        }
	      }
	    }]
	  }, {
	    title: "Rotation",
	    type: "Group",
	    children: [{
	      type: "Slider",
	      title: "Rotation",
	      min: -1,
	      max: 1,
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.rotation.value;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        originalState.leaves.rotation.value = output.value;
	      }
	    }, {
	      type: "Slider",
	      title: "Rotation Variation",
	      default: 0,
	      init: function init(pd) {
	        this.enabled = pd.leaves.enable;
	        return pd.leaves.rotation.variation;
	      },
	      onUpdate: function onUpdate(output, originalState) {
	        if (output.value === 0) {
	          delete originalState.leaves.rotation.variation;
	        } else {
	          originalState.leaves.rotation.variation = output.value;
	        }
	      }
	    }]
	  }]
	};

	var settings = new Map();
	var obj$1 = {};

	var save = function save() {
	  obj$1 = {};
	  settings.forEach(function (v, k) {
	    obj$1[k] = v;
	  });
	  localStorage.setItem("settings", JSON.stringify(obj$1));
	};

	var load = function load() {
	  if ("settings" in localStorage) {
	    obj$1 = JSON.parse(localStorage["settings"]);
	    Object.keys(obj$1).forEach(function (k) {
	      settings.set(k, obj$1[k]);
	    });
	  } else {
	    localStorage.setItem("settings", "{}");
	  }

	  if (!settings.get("theme") && matchMedia("(prefers-color-scheme: dark)")) {
	    settings.set("theme", "dark");
	    obj$1["theme"] = "dark";
	  }
	};

	load();
	var settings$1 = {
	  get: function get(key) {
	    return settings.get(key);
	  },
	  set: function set(key, value) {
	    var old = settings.get(key);

	    if (old !== value) {
	      settings.set(key, value);
	      save();
	    }
	  },

	  get object() {
	    return obj$1;
	  }

	};

	function getSeed(seed) {
	  if (typeof seed === "number") {
	    return seed;
	  } else {
	    return Math.floor(Math.random() * 100000);
	  }
	}

	var nativePromiseConstructor = global_1.Promise;

	var location$1 = global_1.location;
	var set$6 = global_1.setImmediate;
	var clear = global_1.clearImmediate;
	var process = global_1.process;
	var MessageChannel$1 = global_1.MessageChannel;
	var Dispatch = global_1.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;

	var run = function (id) {
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global_1.postMessage(id + '', location$1.protocol + '//' + location$1.host);
	}; // Node.js 0.9+ & IE10+ has setImmediate, otherwise:


	if (!set$6 || !clear) {
	  set$6 = function setImmediate(fn) {
	    var args = [];
	    var i = 1;

	    while (arguments.length > i) args.push(arguments[i++]);

	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
	    };

	    defer(counter);
	    return counter;
	  };

	  clear = function clearImmediate(id) {
	    delete queue[id];
	  }; // Node.js 0.8-


	  if (classofRaw(process) == 'process') {
	    defer = function (id) {
	      process.nextTick(runner(id));
	    }; // Sphere (JS game engine) Dispatch API

	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    }; // Browsers with MessageChannel, includes WebWorkers

	  } else if (MessageChannel$1) {
	    channel = new MessageChannel$1();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = bindContext(port.postMessage, port, 1); // Browsers with postMessage, skip WebWorkers
	    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (global_1.addEventListener && typeof postMessage == 'function' && !global_1.importScripts && !fails(post)) {
	    defer = post;
	    global_1.addEventListener('message', listener, false); // IE8-
	  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
	    defer = function (id) {
	      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    }; // Rest old browsers

	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task = {
	  set: set$6,
	  clear: clear
	};

	var userAgent = getBuiltIn('navigator', 'userAgent') || '';

	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
	var macrotask = task.set;
	var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
	var process$1 = global_1.process;
	var Promise$1 = global_1.Promise;
	var IS_NODE = classofRaw(process$1) == 'process'; // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`

	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$2(global_1, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
	var flush, head, last, notify, toggle, node, promise, then; // modern engines have queueMicrotask method

	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (IS_NODE && (parent = process$1.domain)) parent.exit();

	    while (head) {
	      fn = head.fn;
	      head = head.next;

	      try {
	        fn();
	      } catch (error) {
	        if (head) notify();else last = undefined;
	        throw error;
	      }
	    }

	    last = undefined;
	    if (parent) parent.enter();
	  }; // Node.js


	  if (IS_NODE) {
	    notify = function () {
	      process$1.nextTick(flush);
	    }; // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339

	  } else if (MutationObserver && !/(iphone|ipod|ipad).*applewebkit/i.test(userAgent)) {
	    toggle = true;
	    node = document.createTextNode('');
	    new MutationObserver(flush).observe(node, {
	      characterData: true
	    }); // eslint-disable-line no-new

	    notify = function () {
	      node.data = toggle = !toggle;
	    }; // environments with maybe non-completely correct, but existent Promise

	  } else if (Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    then = promise.then;

	    notify = function () {
	      then.call(promise, flush);
	    }; // for other environments - macrotask based on:
	    // - setImmediate
	    // - MessageChannel
	    // - window.postMessag
	    // - onreadystatechange
	    // - setTimeout

	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global_1, flush);
	    };
	  }
	}

	var microtask = queueMicrotask || function (fn) {
	  var task = {
	    fn: fn,
	    next: undefined
	  };
	  if (last) last.next = task;

	  if (!head) {
	    head = task;
	    notify();
	  }

	  last = task;
	};

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction$1(resolve);
	  this.reject = aFunction$1(reject);
	}; // 25.4.1.5 NewPromiseCapability(C)


	var f$5 = function (C) {
	  return new PromiseCapability(C);
	};

	var newPromiseCapability = {
	  f: f$5
	};

	var promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var hostReportErrors = function (a, b) {
	  var console = global_1.console;

	  if (console && console.error) {
	    arguments.length === 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform = function (exec) {
	  try {
	    return {
	      error: false,
	      value: exec()
	    };
	  } catch (error) {
	    return {
	      error: true,
	      value: error
	    };
	  }
	};

	var task$1 = task.set;
	var SPECIES$6 = wellKnownSymbol('species');
	var PROMISE = 'Promise';
	var getInternalState$2 = internalState.get;
	var setInternalState$3 = internalState.set;
	var getInternalPromiseState = internalState.getterFor(PROMISE);
	var PromiseConstructor = nativePromiseConstructor;
	var TypeError$1 = global_1.TypeError;
	var document$2 = global_1.document;
	var process$2 = global_1.process;
	var $fetch = global_1.fetch;
	var versions = process$2 && process$2.versions;
	var v8 = versions && versions.v8 || '';
	var newPromiseCapability$1 = newPromiseCapability.f;
	var newGenericPromiseCapability = newPromiseCapability$1;
	var IS_NODE$1 = classofRaw(process$2) == 'process';
	var DISPATCH_EVENT = !!(document$2 && document$2.createEvent && global_1.dispatchEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;
	var FORCED$6 = isForced_1(PROMISE, function () {
	  // correct subclassing with @@species support
	  var promise = PromiseConstructor.resolve(1);

	  var empty = function () {
	    /* empty */
	  };

	  var FakePromise = (promise.constructor = {})[SPECIES$6] = function (exec) {
	    exec(empty, empty);
	  }; // unhandled rejections tracking support, NodeJS Promise without it fails @@species test


	  return !((IS_NODE$1 || typeof PromiseRejectionEvent == 'function') && (!isPure || promise['finally']) && promise.then(empty) instanceof FakePromise // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	  // we can't detect it synchronously, so just check versions
	  && v8.indexOf('6.6') !== 0 && userAgent.indexOf('Chrome/66') === -1);
	});
	var INCORRECT_ITERATION$1 = FORCED$6 || !checkCorrectnessOfIteration(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () {
	    /* empty */
	  });
	}); // helpers

	var isThenable = function (it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};

	var notify$1 = function (promise, state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  var chain = state.reactions;
	  microtask(function () {
	    var value = state.value;
	    var ok = state.state == FULFILLED;
	    var index = 0; // variable length - can't use forEach

	    while (chain.length > index) {
	      var reaction = chain[index++];
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;

	      try {
	        if (handler) {
	          if (!ok) {
	            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
	            state.rejection = HANDLED;
	          }

	          if (handler === true) result = value;else {
	            if (domain) domain.enter();
	            result = handler(value); // can throw

	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }

	          if (result === reaction.promise) {
	            reject(TypeError$1('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (error) {
	        if (domain && !exited) domain.exit();
	        reject(error);
	      }
	    }

	    state.reactions = [];
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(promise, state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;

	  if (DISPATCH_EVENT) {
	    event = document$2.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global_1.dispatchEvent(event);
	  } else event = {
	    promise: promise,
	    reason: reason
	  };

	  if (handler = global_1['on' + name]) handler(event);else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;

	    if (IS_UNHANDLED) {
	      result = perform(function () {
	        if (IS_NODE$1) {
	          process$2.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      }); // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should

	      state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    if (IS_NODE$1) {
	      process$2.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind = function (fn, promise, state, unwrap) {
	  return function (value) {
	    fn(promise, state, value, unwrap);
	  };
	};

	var internalReject = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify$1(promise, state, true);
	};

	var internalResolve = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;

	  try {
	    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
	    var then = isThenable(value);

	    if (then) {
	      microtask(function () {
	        var wrapper = {
	          done: false
	        };

	        try {
	          then.call(value, bind(internalResolve, promise, wrapper, state), bind(internalReject, promise, wrapper, state));
	        } catch (error) {
	          internalReject(promise, wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify$1(promise, state, false);
	    }
	  } catch (error) {
	    internalReject(promise, {
	      done: false
	    }, error, state);
	  }
	}; // constructor polyfill


	if (FORCED$6) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromiseConstructor, PROMISE);
	    aFunction$1(executor);
	    Internal.call(this);
	    var state = getInternalState$2(this);

	    try {
	      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
	    } catch (error) {
	      internalReject(this, state, error);
	    }
	  }; // eslint-disable-next-line no-unused-vars


	  Internal = function Promise(executor) {
	    setInternalState$3(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: [],
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };

	  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = IS_NODE$1 ? process$2.domain : undefined;
	      state.parent = true;
	      state.reactions.push(reaction);
	      if (state.state != PENDING) notify$1(this, state, false);
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });

	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalState$2(promise);
	    this.promise = promise;
	    this.resolve = bind(internalResolve, promise, state);
	    this.reject = bind(internalReject, promise, state);
	  };

	  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
	  };

	  if ( typeof nativePromiseConstructor == 'function') {
	    nativeThen = nativePromiseConstructor.prototype.then; // wrap native Promise#then for native async functions

	    redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
	      var that = this;
	      return new PromiseConstructor(function (resolve, reject) {
	        nativeThen.call(that, resolve, reject);
	      }).then(onFulfilled, onRejected);
	    }); // wrap fetch result

	    if (typeof $fetch == 'function') _export({
	      global: true,
	      enumerable: true,
	      forced: true
	    }, {
	      // eslint-disable-next-line no-unused-vars
	      fetch: function fetch(input) {
	        return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
	      }
	    });
	  }
	}

	_export({
	  global: true,
	  wrap: true,
	  forced: FORCED$6
	}, {
	  Promise: PromiseConstructor
	});
	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);
	PromiseWrapper = path[PROMISE]; // statics

	_export({
	  target: PROMISE,
	  stat: true,
	  forced: FORCED$6
	}, {
	  // `Promise.reject` method
	  // https://tc39.github.io/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability$1(this);
	    capability.reject.call(undefined, r);
	    return capability.promise;
	  }
	});
	_export({
	  target: PROMISE,
	  stat: true,
	  forced:  FORCED$6
	}, {
	  // `Promise.resolve` method
	  // https://tc39.github.io/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve( this, x);
	  }
	});
	_export({
	  target: PROMISE,
	  stat: true,
	  forced: INCORRECT_ITERATION$1
	}, {
	  // `Promise.all` method
	  // https://tc39.github.io/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate_1(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        $promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  },
	  // `Promise.race` method
	  // https://tc39.github.io/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      iterate_1(iterable, function (promise) {
	        $promiseResolve.call(C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var generate;
	var generateModel = /*#__PURE__*/
	(function () {
	  var _ref = _asyncToGenerator(
	  /*#__PURE__*/
	  regeneratorRuntime.mark(function _callee(pd, settings) {
	    var worker;
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            if (generate) {
	              _context.next = 9;
	              break;
	            }

	            worker = new Worker("generator.js");
	            worker.addEventListener("message", function (msg) {
	              return msg.type && msg.type === "popup" && overlay.popup(msg.value, msg.time);
	            });
	            generate = wrap(worker);
	            _context.next = 6;
	            return generate(pd, settings);

	          case 6:
	            return _context.abrupt("return", _context.sent);

	          case 9:
	            _context.next = 11;
	            return generate(pd, settings);

	          case 11:
	            return _context.abrupt("return", _context.sent);

	          case 12:
	          case "end":
	            return _context.stop();
	        }
	      }
	    }, _callee);
	  }));

	  return function (_x, _x2) {
	    return _ref.apply(this, arguments);
	  };
	})();

	function convertToObj (model) {
	  var output = "";
	  var indexVertex = 0;
	  var indexVertexUvs = 0;
	  var indexNormals = 0;
	  var i,
	      j,
	      l,
	      m,
	      face = [];

	  var parseMesh = function parseMesh(mesh) {
	    var nbVertex = 0;
	    var nbNormals = 0;
	    var nbVertexUvs = 0; // shortcuts

	    var vertices = mesh.position;
	    var normals = mesh.normal;
	    var uvs = mesh.uv;
	    var indices = mesh.index; // name of the mesh object

	    output += "o " + "defualt" + "\n"; // vertices

	    if (vertices !== undefined) {
	      for (i = 0, l = vertices.length; i < l; i += 3, nbVertex += 3) {
	        // transform the vertex to export format
	        output += "v " + vertices[i + 0] + " " + vertices[i + 1] + " " + vertices[i + 2] + "\n";
	      }
	    } // uvs


	    if (uvs !== undefined) {
	      for (i = 0, l = uvs.length; i < l; i += 2, nbVertexUvs += 2) {
	        // transform the uv to export format
	        output += "vt " + uvs[i + 0] * -1 + " " + uvs[i + 1] + "\n";
	      }
	    } // normals


	    if (normals !== undefined) {
	      for (i = 0, l = normals.length; i < l; i += 3, nbNormals += 3) {
	        // transform the normal to export format
	        output += "vn " + normals[i + 0] + " " + normals[i + 1] + " " + normals[i + 2] + "\n";
	      }
	    } // faces


	    if (indices !== null) {
	      for (i = 0, l = indices.length; i < l; i += 3) {
	        for (m = 0; m < 3; m++) {
	          j = indices[i + m] + 1;
	          face[m] = indexVertex + j + "/" + (uvs ? indexVertexUvs + j : "") + "/" + (indexNormals + j);
	        } // transform the face to export format


	        output += "f " + face.join(" ") + "\n";
	      }
	    } else {
	      for (i = 0, l = vertices.length; i < l; i += 3) {
	        for (m = 0; m < 3; m++) {
	          j = i + m + 1;
	          face[m] = indexVertex + j + "/" + (uvs ? indexVertexUvs + j : "") + "/" + (indexNormals + j);
	        } // transform the face to export format


	        output += "f " + face.join(" ") + "\n";
	      }
	    } // update index


	    indexVertex += nbVertex;
	    indexVertexUvs += nbVertexUvs;
	    indexNormals += nbNormals;
	  };

	  parseMesh(model);
	  return output;
	}

	var exporter = {
	  download: function () {
	    var _download = _asyncToGenerator(
	    /*#__PURE__*/
	    regeneratorRuntime.mark(function _callee2(pd) {
	      var amount, seed, useRandomSeed, models;
	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              amount = settings$1.get("exp_amount") || 1;
	              seed = settings$1.get("exp_seed") || settings$1.get("seed") || getSeed();
	              useRandomSeed = !!settings$1.get("exp_useRandomSeed");
	              _context2.next = 5;
	              return Promise.all(new Array(amount).fill(null).map(
	              /*#__PURE__*/
	              _asyncToGenerator(
	              /*#__PURE__*/
	              regeneratorRuntime.mark(function _callee() {
	                var s;
	                return regeneratorRuntime.wrap(function _callee$(_context) {
	                  while (1) {
	                    switch (_context.prev = _context.next) {
	                      case 0:
	                        s = JSON.parse(JSON.stringify(settings$1.object));

	                        if (useRandomSeed) {
	                          s.seed = getSeed();
	                        } else {
	                          s.seed = seed;
	                        }

	                        _context.next = 4;
	                        return generateModel(pd, s);

	                      case 4:
	                        return _context.abrupt("return", _context.sent);

	                      case 5:
	                      case "end":
	                        return _context.stop();
	                    }
	                  }
	                }, _callee);
	              }))));

	            case 5:
	              models = _context2.sent;
	              models.map(function (o) {
	                return convertToObj(o);
	              }).forEach(function (str, i) {
	                var name = amount === 1 ? pd.meta.name : pd.meta.name + "_var" + (i + 1);
	                obj(str, name);
	              });

	            case 7:
	            case "end":
	              return _context2.stop();
	          }
	        }
	      }, _callee2);
	    }));

	    function download(_x) {
	      return _download.apply(this, arguments);
	    }

	    return download;
	  }()
	};

	var ioConfig = {
	  title: "import/export",
	  type: "stage",
	  icon: "io",
	  children: [{
	    type: "ProjectMeta",
	    title: "Active project:",
	    identifiers: ["name", "author", "latinName", "class", "family"],
	    init: function init(pd) {
	      return pd.meta;
	    },
	    onUpdate: function onUpdate(newMeta, originalMeta) {
	      projectManager.updateMeta(originalMeta, newMeta);
	    }
	  }, {
	    type: "Group",
	    title: "Projects",
	    open: true,
	    children: [{
	      type: "ProjectList",
	      title: "Project List"
	    }]
	  }, {
	    type: "Group",
	    title: "Export",
	    children: [{
	      type: "Number",
	      title: "amount",
	      default: 10,
	      init: function init() {
	        return settings$1.get("exp_amount");
	      },
	      onUpdate: function onUpdate(v) {
	        settings$1.set("exp_amount", v.value);
	      }
	    }, {
	      type: "Checkbox",
	      title: "use random seed",
	      init: function init() {
	        return settings$1.get("exp_useRandomSeed");
	      },
	      onUpdate: function onUpdate(v) {
	        settings$1.set("exp_useRandomSeed", v.enabled);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Number",
	      title: "seed",
	      min: 0,
	      max: 100000,
	      default: getSeed(settings$1.get("exp_seed")),
	      init: function init() {
	        if (settings$1.get("exp_useRandomSeed")) {
	          var s = Math.floor(Math.random() * 100000);
	          settings$1.set("exp_seed", s);
	          this.enabled = false;
	          this.element.value = s;
	          return s;
	        } else {
	          this.enabled = true;
	          return settings$1.get("exp_seed");
	        }
	      },
	      onUpdate: function onUpdate(v) {
	        settings$1.set("exp_seed", v.value);
	      }
	    }, {
	      type: "Tab",
	      identifiers: ["obj", "stl", "gltf"],
	      default: settings$1.get("exp_filetype") || "obj",
	      title: "filetype",
	      onUpdate: function onUpdate(v) {
	        settings$1.set("exp_filetype", v);
	      }
	    }, {
	      type: "Button",
	      title: "download models",
	      onClick: function onClick() {
	        exporter.download(projectManager.pd);
	      }
	    }]
	  }, {
	    type: "Group",
	    title: "Import",
	    children: [{
	      type: "FileInput",
	      title: "Load File",
	      onUpdate: function onUpdate(_s) {
	        _s.forEach(function (s) {
	          return projectManager.addPlant(s);
	        });

	        projectManager.updateUI();
	      }
	    }]
	  }]
	};

	var log$5 = logger("config");
	var settingsConfig = {
	  title: "settings",
	  type: "stage",
	  align: "right",
	  icon: "cog",
	  iconOnly: true,
	  children: [{
	    type: "Checkbox",
	    title: "Enable Sync",
	    tooltip: "Enables syncing of projects to the cloud",
	    init: function init() {
	      return !!settings$1.get("enable_sync");
	    },
	    onUpdate: function onUpdate(v) {
	      settings$1.set("enable_sync", v.enabled);
	      v.enabled ? data$2.enableSync() : data$2.disableSync();
	      projectManager.updateUI();
	    }
	  }, {
	    type: "Text",
	    title: "User ID",
	    init: function init() {
	      var _this = this;

	      this.enabled = !!settings$1.get("enable_sync");

	      if (this.enabled) {
	        data$2.getID().then(function (id) {
	          return _this.element.value = id;
	        });
	      }

	      return "";
	    },
	    onUpdate: function () {
	      var _onUpdate = _asyncToGenerator(
	      /*#__PURE__*/
	      regeneratorRuntime.mark(function _callee(v) {
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.next = 2;
	                return data$2.setID(v);

	              case 2:
	                this.element.value = _context.sent;

	              case 3:
	              case "end":
	                return _context.stop();
	            }
	          }
	        }, _callee, this);
	      }));

	      function onUpdate(_x) {
	        return _onUpdate.apply(this, arguments);
	      }

	      return onUpdate;
	    }()
	  }, {
	    type: "Checkbox",
	    title: "use random seed",
	    init: function init() {
	      return settings$1.get("useRandomSeed");
	    },
	    onUpdate: function onUpdate(v) {
	      settings$1.set("useRandomSeed", v.enabled);
	    }
	  }, {
	    type: "Number",
	    title: "seed",
	    min: 0,
	    max: 100000,
	    default: getSeed(settings$1.get("seed")),
	    init: function init() {
	      if (settings$1.get("useRandomSeed")) {
	        this.enabled = false;
	        var s = Math.floor(Math.random() * 100000);
	        this.element.value = s;
	        return s;
	      } else {
	        this.enabled = true;
	        return settings$1.get("seed");
	      }
	    },
	    onUpdate: function onUpdate(v) {
	      settings$1.set("seed", v.value);
	    }
	  }, {
	    type: "Tab",
	    title: "Theme",
	    identifiers: ["light", "dark"],
	    init: function init() {
	      var _this2 = this;

	      matchMedia("(prefers-color-scheme: dark)").onchange = function (ev) {
	        var theme = ev.matches ? "dark" : "light";

	        _this2.setActive(theme);

	        _this2.update(theme);
	      };

	      return settings$1.get("theme") || "dark";
	    },
	    onUpdate: function onUpdate(v) {
	      settings$1.set("theme", v);
	      document.body.classList.forEach(function (c) {
	        if (c.includes("theme-")) {
	          document.body.classList.remove(c);
	        }
	      });
	      document.body.classList.add("themetransition");
	      document.body.classList.add("theme-" + v);
	      setTimeout(function () {
	        document.body.classList.remove("themetransition");
	      }, 300);
	    }
	  }, {
	    type: "Group",
	    title: "Ground",
	    children: [{
	      type: "Checkbox",
	      title: "Enable Ground",
	      default: true,
	      init: function init() {
	        var s = settings$1.get("ground_enable");

	        if (typeof s === "boolean" && !s) {
	          return false;
	        } else {
	          return true;
	        }
	      },
	      onUpdate: function onUpdate(v) {
	        settings$1.set("ground_enable", v.enabled);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Slider",
	      title: "Size",
	      min: 0,
	      max: 2,
	      default: 1,
	      init: function init() {
	        this.enabled = !!settings$1.get("ground_enable");
	        return settings$1.get("ground_size") || 2;
	      },
	      onUpdate: function onUpdate(v) {
	        settings$1.set("ground_size", v.value);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Number",
	      title: "X Resolution",
	      min: 3,
	      max: 32,
	      default: settings$1.get("ground_resX") || 12,
	      init: function init() {
	        this.enabled = !!settings$1.get("ground_enable");
	        return settings$1.get("ground_resX");
	      },
	      onUpdate: function onUpdate(v) {
	        settings$1.set("ground_resX", v.value);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Number",
	      title: "Y Resolution",
	      min: 3,
	      max: 32,
	      default: settings$1.get("ground_resY") || 12,
	      init: function init() {
	        this.enabled = !!settings$1.get("ground_enable");
	        return settings$1.get("ground_resY");
	      },
	      onUpdate: function onUpdate(v) {
	        settings$1.set("ground_resY", v.value);
	        projectManager.updateUI();
	      }
	    }]
	  }, {
	    type: "Group",
	    title: "Resolution",
	    children: [{
	      type: "Number",
	      title: "Stem X Resolution",
	      min: 3,
	      max: 32,
	      default: settings$1.get("stemResX") || 3,
	      onUpdate: function onUpdate(v) {
	        settings$1.set("stemResX", v.value);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Number",
	      title: "Stem Y Resolution",
	      min: 3,
	      max: 32,
	      default: settings$1.get("stemResY") || 20,
	      onUpdate: function onUpdate(v) {
	        settings$1.set("stemResY", v.value);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Number",
	      title: "Leaf X Resolution",
	      min: 3,
	      max: 32,
	      default: settings$1.get("leafResX") || 3,
	      onUpdate: function onUpdate(v) {
	        settings$1.set("leafResX", v.value);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Number",
	      title: "Leaf Y Resolution",
	      min: 3,
	      max: 32,
	      default: settings$1.get("leafResY") || 3,
	      onUpdate: function onUpdate(v) {
	        settings$1.set("leafResY", v.value);
	        projectManager.updateUI();
	      }
	    }]
	  }, {
	    type: "Group",
	    title: "Debug",
	    children: [{
	      type: "Button",
	      title: "Reset All",
	      state: "warning",
	      onClick: function onClick() {
	        if (confirm("delete all settings and projects?")) {
	          localStorage.clear();
	          window.location.reload();
	        }
	      }
	    }, {
	      type: "Checkbox",
	      title: "Disable Tooltips",
	      default: !!settings$1.get("disable_tooltips"),
	      init: function init() {
	        var v = !!settings$1.get("disable_tooltips");

	        if (v) {
	          document.body.classList.add("tooltip-disabled");
	        } else {
	          document.body.classList.remove("tooltip-disabled");
	        }

	        return v;
	      },
	      onUpdate: function onUpdate(v) {
	        settings$1.set("disable_tooltips", v.enabled);

	        if (v.enabled) {
	          document.body.classList.add("tooltip-disabled");
	        } else {
	          document.body.classList.remove("tooltip-disabled");
	        }

	        projectManager.updateUI();
	      }
	    }, {
	      type: "Checkbox",
	      title: "Show Indices",
	      default: settings$1.get("debug_indices"),
	      onUpdate: function onUpdate(v) {
	        settings$1.set("debug_indices", v.enabled);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Checkbox",
	      title: "Wireframe",
	      default: settings$1.get("debug_wireframe"),
	      onUpdate: function onUpdate(v) {
	        settings$1.set("debug_wireframe", v.enabled);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Checkbox",
	      title: "Generate Perf",
	      default: settings$1.get("debug_generate_perf"),
	      onUpdate: function onUpdate(v) {
	        settings$1.set("debug_generate_perf", v.enabled);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Checkbox",
	      title: "Render Perf",
	      default: settings$1.get("debug_render_perf"),
	      onUpdate: function onUpdate(v) {
	        settings$1.set("debug_render_perf", v.enabled);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Checkbox",
	      title: "Show PD",
	      default: settings$1.get("debug_pd"),
	      onUpdate: function onUpdate(v) {
	        settings$1.set("debug_pd", v.enabled);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Checkbox",
	      title: "Show Skeleton",
	      default: settings$1.get("debug_skeleton"),
	      onUpdate: function onUpdate(v) {
	        settings$1.set("debug_skeleton", v.enabled);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Checkbox",
	      title: "Disable Model",
	      default: settings$1.get("debug_disable_model"),
	      onUpdate: function onUpdate(v) {
	        settings$1.set("debug_disable_model", v.enabled);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Checkbox",
	      title: "Show UV",
	      default: settings$1.get("debug_uv"),
	      onUpdate: function onUpdate(v) {
	        settings$1.set("debug_uv", v.enabled);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Checkbox",
	      title: "Show Grid",
	      default: settings$1.get("debug_grid"),
	      onUpdate: function onUpdate(v) {
	        settings$1.set("debug_grid", v.enabled);
	        projectManager.updateUI();
	      }
	    }, {
	      type: "Group",
	      title: "Grid Settings",
	      children: [{
	        type: "Number",
	        title: "Resolution",
	        min: 3,
	        max: 32,
	        init: function init() {
	          if (settings$1.get("debug_grid")) {
	            this.enabled = true;
	          } else {
	            this.enabled = false;
	          }

	          return settings$1.get("debug_grid_resolution");
	        },
	        onUpdate: function onUpdate(v) {
	          settings$1.set("debug_grid_resolution", v.value);
	          projectManager.updateUI();
	        }
	      }, {
	        type: "Slider",
	        title: "Size",
	        min: 2,
	        max: 10,
	        default: 2,
	        init: function init() {
	          if (settings$1.get("debug_grid")) {
	            this.enabled = true;
	          } else {
	            this.enabled = false;
	          }

	          return settings$1.get("debug_grid_size") || 2;
	        },
	        onUpdate: function onUpdate(v) {
	          settings$1.set("debug_grid_size", v.value);
	          projectManager.updateUI();
	        }
	      }]
	    }, {
	      type: "Number",
	      title: "Log Level",
	      min: 0,
	      max: 3,
	      init: function init() {
	        this.title.innerHTML = "".concat(this.config.title, " (").concat(["error", "warning", "components", "all"][log$5.level], ")");
	        return log$5.level;
	      },
	      onUpdate: function onUpdate(v) {
	        log$5.level = v.value;
	        this.title.innerHTML = "".concat(this.config.title, " (").concat(["error", "warning", "components", "all"][log$5.level], ")");
	        projectManager.updateUI();
	      }
	    }]
	  }]
	};

	var trim$1 = stringTrim.trim;
	var nativeParseFloat = global_1.parseFloat;
	var FORCED$7 = 1 / nativeParseFloat(whitespaces + '-0') !== -Infinity; // `parseFloat` method
	// https://tc39.github.io/ecma262/#sec-parsefloat-string

	var _parseFloat = FORCED$7 ? function parseFloat(string) {
	  var trimmedString = trim$1(String(string));
	  var result = nativeParseFloat(trimmedString);
	  return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
	} : nativeParseFloat;

	// https://tc39.github.io/ecma262/#sec-parsefloat-string

	_export({
	  global: true,
	  forced: parseFloat != _parseFloat
	}, {
	  parseFloat: _parseFloat
	});

	// https://tc39.github.io/ecma262/#sec-typedarray-objects

	typedArrayConstructor('Uint16', 2, function (init) {
	  return function Uint16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// https://tc39.github.io/ecma262/#sec-typedarray-objects

	typedArrayConstructor('Uint32', 4, function (init) {
	  return function Uint32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var $reduce$1 = arrayReduce.left; // `Array.prototype.reduce` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.reduce

	_export({
	  target: 'Array',
	  proto: true,
	  forced: sloppyArrayMethod('reduce')
	}, {
	  reduce: function reduce(callbackfn
	  /* , initialValue */
	  ) {
	    return $reduce$1(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var samplingCurve = new Curve();

	var constants = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	  exports.NORM_2D = 1.0 / 47.0;
	  exports.NORM_3D = 1.0 / 103.0;
	  exports.NORM_4D = 1.0 / 30.0;
	  exports.SQUISH_2D = (Math.sqrt(2 + 1) - 1) / 2;
	  exports.SQUISH_3D = (Math.sqrt(3 + 1) - 1) / 3;
	  exports.SQUISH_4D = (Math.sqrt(4 + 1) - 1) / 4;
	  exports.STRETCH_2D = (1 / Math.sqrt(2 + 1) - 1) / 2;
	  exports.STRETCH_3D = (1 / Math.sqrt(3 + 1) - 1) / 3;
	  exports.STRETCH_4D = (1 / Math.sqrt(4 + 1) - 1) / 4;
	  exports.base2D = [[1, 1, 0, 1, 0, 1, 0, 0, 0], [1, 1, 0, 1, 0, 1, 2, 1, 1]];
	  exports.base3D = [[0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1], [2, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 1, 3, 1, 1, 1], [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 2, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 1]];
	  exports.base4D = [[0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1], [3, 1, 1, 1, 0, 3, 1, 1, 0, 1, 3, 1, 0, 1, 1, 3, 0, 1, 1, 1, 4, 1, 1, 1, 1], [1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 2, 1, 1, 0, 0, 2, 1, 0, 1, 0, 2, 1, 0, 0, 1, 2, 0, 1, 1, 0, 2, 0, 1, 0, 1, 2, 0, 0, 1, 1], [3, 1, 1, 1, 0, 3, 1, 1, 0, 1, 3, 1, 0, 1, 1, 3, 0, 1, 1, 1, 2, 1, 1, 0, 0, 2, 1, 0, 1, 0, 2, 1, 0, 0, 1, 2, 0, 1, 1, 0, 2, 0, 1, 0, 1, 2, 0, 0, 1, 1]];
	  exports.gradients2D = [5, 2, 2, 5, -5, 2, -2, 5, 5, -2, 2, -5, -5, -2, -2, -5];
	  exports.gradients3D = [-11, 4, 4, -4, 11, 4, -4, 4, 11, 11, 4, 4, 4, 11, 4, 4, 4, 11, -11, -4, 4, -4, -11, 4, -4, -4, 11, 11, -4, 4, 4, -11, 4, 4, -4, 11, -11, 4, -4, -4, 11, -4, -4, 4, -11, 11, 4, -4, 4, 11, -4, 4, 4, -11, -11, -4, -4, -4, -11, -4, -4, -4, -11, 11, -4, -4, 4, -11, -4, 4, -4, -11];
	  exports.gradients4D = [3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, -3, 1, 1, 1, -1, 3, 1, 1, -1, 1, 3, 1, -1, 1, 1, 3, 3, -1, 1, 1, 1, -3, 1, 1, 1, -1, 3, 1, 1, -1, 1, 3, -3, -1, 1, 1, -1, -3, 1, 1, -1, -1, 3, 1, -1, -1, 1, 3, 3, 1, -1, 1, 1, 3, -1, 1, 1, 1, -3, 1, 1, 1, -1, 3, -3, 1, -1, 1, -1, 3, -1, 1, -1, 1, -3, 1, -1, 1, -1, 3, 3, -1, -1, 1, 1, -3, -1, 1, 1, -1, -3, 1, 1, -1, -1, 3, -3, -1, -1, 1, -1, -3, -1, 1, -1, -1, -3, 1, -1, -1, -1, 3, 3, 1, 1, -1, 1, 3, 1, -1, 1, 1, 3, -1, 1, 1, 1, -3, -3, 1, 1, -1, -1, 3, 1, -1, -1, 1, 3, -1, -1, 1, 1, -3, 3, -1, 1, -1, 1, -3, 1, -1, 1, -1, 3, -1, 1, -1, 1, -3, -3, -1, 1, -1, -1, -3, 1, -1, -1, -1, 3, -1, -1, -1, 1, -3, 3, 1, -1, -1, 1, 3, -1, -1, 1, 1, -3, -1, 1, 1, -1, -3, -3, 1, -1, -1, -1, 3, -1, -1, -1, 1, -3, -1, -1, 1, -1, -3, 3, -1, -1, -1, 1, -3, -1, -1, 1, -1, -3, -1, 1, -1, -1, -3, -3, -1, -1, -1, -1, -3, -1, -1, -1, -1, -3, -1, -1, -1, -1, -3];
	  exports.lookupPairs2D = [0, 1, 1, 0, 4, 1, 17, 0, 20, 2, 21, 2, 22, 5, 23, 5, 26, 4, 39, 3, 42, 4, 43, 3];
	  exports.lookupPairs3D = [0, 2, 1, 1, 2, 2, 5, 1, 6, 0, 7, 0, 32, 2, 34, 2, 129, 1, 133, 1, 160, 5, 161, 5, 518, 0, 519, 0, 546, 4, 550, 4, 645, 3, 647, 3, 672, 5, 673, 5, 674, 4, 677, 3, 678, 4, 679, 3, 680, 13, 681, 13, 682, 12, 685, 14, 686, 12, 687, 14, 712, 20, 714, 18, 809, 21, 813, 23, 840, 20, 841, 21, 1198, 19, 1199, 22, 1226, 18, 1230, 19, 1325, 23, 1327, 22, 1352, 15, 1353, 17, 1354, 15, 1357, 17, 1358, 16, 1359, 16, 1360, 11, 1361, 10, 1362, 11, 1365, 10, 1366, 9, 1367, 9, 1392, 11, 1394, 11, 1489, 10, 1493, 10, 1520, 8, 1521, 8, 1878, 9, 1879, 9, 1906, 7, 1910, 7, 2005, 6, 2007, 6, 2032, 8, 2033, 8, 2034, 7, 2037, 6, 2038, 7, 2039, 6];
	  exports.lookupPairs4D = [0, 3, 1, 2, 2, 3, 5, 2, 6, 1, 7, 1, 8, 3, 9, 2, 10, 3, 13, 2, 16, 3, 18, 3, 22, 1, 23, 1, 24, 3, 26, 3, 33, 2, 37, 2, 38, 1, 39, 1, 41, 2, 45, 2, 54, 1, 55, 1, 56, 0, 57, 0, 58, 0, 59, 0, 60, 0, 61, 0, 62, 0, 63, 0, 256, 3, 258, 3, 264, 3, 266, 3, 272, 3, 274, 3, 280, 3, 282, 3, 2049, 2, 2053, 2, 2057, 2, 2061, 2, 2081, 2, 2085, 2, 2089, 2, 2093, 2, 2304, 9, 2305, 9, 2312, 9, 2313, 9, 16390, 1, 16391, 1, 16406, 1, 16407, 1, 16422, 1, 16423, 1, 16438, 1, 16439, 1, 16642, 8, 16646, 8, 16658, 8, 16662, 8, 18437, 6, 18439, 6, 18469, 6, 18471, 6, 18688, 9, 18689, 9, 18690, 8, 18693, 6, 18694, 8, 18695, 6, 18696, 9, 18697, 9, 18706, 8, 18710, 8, 18725, 6, 18727, 6, 131128, 0, 131129, 0, 131130, 0, 131131, 0, 131132, 0, 131133, 0, 131134, 0, 131135, 0, 131352, 7, 131354, 7, 131384, 7, 131386, 7, 133161, 5, 133165, 5, 133177, 5, 133181, 5, 133376, 9, 133377, 9, 133384, 9, 133385, 9, 133400, 7, 133402, 7, 133417, 5, 133421, 5, 133432, 7, 133433, 5, 133434, 7, 133437, 5, 147510, 4, 147511, 4, 147518, 4, 147519, 4, 147714, 8, 147718, 8, 147730, 8, 147734, 8, 147736, 7, 147738, 7, 147766, 4, 147767, 4, 147768, 7, 147770, 7, 147774, 4, 147775, 4, 149509, 6, 149511, 6, 149541, 6, 149543, 6, 149545, 5, 149549, 5, 149558, 4, 149559, 4, 149561, 5, 149565, 5, 149566, 4, 149567, 4, 149760, 9, 149761, 9, 149762, 8, 149765, 6, 149766, 8, 149767, 6, 149768, 9, 149769, 9, 149778, 8, 149782, 8, 149784, 7, 149786, 7, 149797, 6, 149799, 6, 149801, 5, 149805, 5, 149814, 4, 149815, 4, 149816, 7, 149817, 5, 149818, 7, 149821, 5, 149822, 4, 149823, 4, 149824, 37, 149825, 37, 149826, 36, 149829, 34, 149830, 36, 149831, 34, 149832, 37, 149833, 37, 149842, 36, 149846, 36, 149848, 35, 149850, 35, 149861, 34, 149863, 34, 149865, 33, 149869, 33, 149878, 32, 149879, 32, 149880, 35, 149881, 33, 149882, 35, 149885, 33, 149886, 32, 149887, 32, 150080, 49, 150082, 48, 150088, 49, 150098, 48, 150104, 47, 150106, 47, 151873, 46, 151877, 45, 151881, 46, 151909, 45, 151913, 44, 151917, 44, 152128, 49, 152129, 46, 152136, 49, 152137, 46, 166214, 43, 166215, 42, 166230, 43, 166247, 42, 166262, 41, 166263, 41, 166466, 48, 166470, 43, 166482, 48, 166486, 43, 168261, 45, 168263, 42, 168293, 45, 168295, 42, 168512, 31, 168513, 28, 168514, 31, 168517, 28, 168518, 25, 168519, 25, 280952, 40, 280953, 39, 280954, 40, 280957, 39, 280958, 38, 280959, 38, 281176, 47, 281178, 47, 281208, 40, 281210, 40, 282985, 44, 282989, 44, 283001, 39, 283005, 39, 283208, 30, 283209, 27, 283224, 30, 283241, 27, 283256, 22, 283257, 22, 297334, 41, 297335, 41, 297342, 38, 297343, 38, 297554, 29, 297558, 24, 297562, 29, 297590, 24, 297594, 21, 297598, 21, 299365, 26, 299367, 23, 299373, 26, 299383, 23, 299389, 20, 299391, 20, 299584, 31, 299585, 28, 299586, 31, 299589, 28, 299590, 25, 299591, 25, 299592, 30, 299593, 27, 299602, 29, 299606, 24, 299608, 30, 299610, 29, 299621, 26, 299623, 23, 299625, 27, 299629, 26, 299638, 24, 299639, 23, 299640, 22, 299641, 22, 299642, 21, 299645, 20, 299646, 21, 299647, 20, 299648, 61, 299649, 60, 299650, 61, 299653, 60, 299654, 59, 299655, 59, 299656, 58, 299657, 57, 299666, 55, 299670, 54, 299672, 58, 299674, 55, 299685, 52, 299687, 51, 299689, 57, 299693, 52, 299702, 54, 299703, 51, 299704, 56, 299705, 56, 299706, 53, 299709, 50, 299710, 53, 299711, 50, 299904, 61, 299906, 61, 299912, 58, 299922, 55, 299928, 58, 299930, 55, 301697, 60, 301701, 60, 301705, 57, 301733, 52, 301737, 57, 301741, 52, 301952, 79, 301953, 79, 301960, 76, 301961, 76, 316038, 59, 316039, 59, 316054, 54, 316071, 51, 316086, 54, 316087, 51, 316290, 78, 316294, 78, 316306, 73, 316310, 73, 318085, 77, 318087, 77, 318117, 70, 318119, 70, 318336, 79, 318337, 79, 318338, 78, 318341, 77, 318342, 78, 318343, 77, 430776, 56, 430777, 56, 430778, 53, 430781, 50, 430782, 53, 430783, 50, 431000, 75, 431002, 72, 431032, 75, 431034, 72, 432809, 74, 432813, 69, 432825, 74, 432829, 69, 433032, 76, 433033, 76, 433048, 75, 433065, 74, 433080, 75, 433081, 74, 447158, 71, 447159, 68, 447166, 71, 447167, 68, 447378, 73, 447382, 73, 447386, 72, 447414, 71, 447418, 72, 447422, 71, 449189, 70, 449191, 70, 449197, 69, 449207, 68, 449213, 69, 449215, 68, 449408, 67, 449409, 67, 449410, 66, 449413, 64, 449414, 66, 449415, 64, 449416, 67, 449417, 67, 449426, 66, 449430, 66, 449432, 65, 449434, 65, 449445, 64, 449447, 64, 449449, 63, 449453, 63, 449462, 62, 449463, 62, 449464, 65, 449465, 63, 449466, 65, 449469, 63, 449470, 62, 449471, 62, 449472, 19, 449473, 19, 449474, 18, 449477, 16, 449478, 18, 449479, 16, 449480, 19, 449481, 19, 449490, 18, 449494, 18, 449496, 17, 449498, 17, 449509, 16, 449511, 16, 449513, 15, 449517, 15, 449526, 14, 449527, 14, 449528, 17, 449529, 15, 449530, 17, 449533, 15, 449534, 14, 449535, 14, 449728, 19, 449729, 19, 449730, 18, 449734, 18, 449736, 19, 449737, 19, 449746, 18, 449750, 18, 449752, 17, 449754, 17, 449784, 17, 449786, 17, 451520, 19, 451521, 19, 451525, 16, 451527, 16, 451528, 19, 451529, 19, 451557, 16, 451559, 16, 451561, 15, 451565, 15, 451577, 15, 451581, 15, 451776, 19, 451777, 19, 451784, 19, 451785, 19, 465858, 18, 465861, 16, 465862, 18, 465863, 16, 465874, 18, 465878, 18, 465893, 16, 465895, 16, 465910, 14, 465911, 14, 465918, 14, 465919, 14, 466114, 18, 466118, 18, 466130, 18, 466134, 18, 467909, 16, 467911, 16, 467941, 16, 467943, 16, 468160, 13, 468161, 13, 468162, 13, 468163, 13, 468164, 13, 468165, 13, 468166, 13, 468167, 13, 580568, 17, 580570, 17, 580585, 15, 580589, 15, 580598, 14, 580599, 14, 580600, 17, 580601, 15, 580602, 17, 580605, 15, 580606, 14, 580607, 14, 580824, 17, 580826, 17, 580856, 17, 580858, 17, 582633, 15, 582637, 15, 582649, 15, 582653, 15, 582856, 12, 582857, 12, 582872, 12, 582873, 12, 582888, 12, 582889, 12, 582904, 12, 582905, 12, 596982, 14, 596983, 14, 596990, 14, 596991, 14, 597202, 11, 597206, 11, 597210, 11, 597214, 11, 597234, 11, 597238, 11, 597242, 11, 597246, 11, 599013, 10, 599015, 10, 599021, 10, 599023, 10, 599029, 10, 599031, 10, 599037, 10, 599039, 10, 599232, 13, 599233, 13, 599234, 13, 599235, 13, 599236, 13, 599237, 13, 599238, 13, 599239, 13, 599240, 12, 599241, 12, 599250, 11, 599254, 11, 599256, 12, 599257, 12, 599258, 11, 599262, 11, 599269, 10, 599271, 10, 599272, 12, 599273, 12, 599277, 10, 599279, 10, 599282, 11, 599285, 10, 599286, 11, 599287, 10, 599288, 12, 599289, 12, 599290, 11, 599293, 10, 599294, 11, 599295, 10];
	  exports.p2D = [0, 0, 1, -1, 0, 0, -1, 1, 0, 2, 1, 1, 1, 2, 2, 0, 1, 2, 0, 2, 1, 0, 0, 0];
	  exports.p3D = [0, 0, 1, -1, 0, 0, 1, 0, -1, 0, 0, -1, 1, 0, 0, 0, 1, -1, 0, 0, -1, 0, 1, 0, 0, -1, 1, 0, 2, 1, 1, 0, 1, 1, 1, -1, 0, 2, 1, 0, 1, 1, 1, -1, 1, 0, 2, 0, 1, 1, 1, -1, 1, 1, 1, 3, 2, 1, 0, 3, 1, 2, 0, 1, 3, 2, 0, 1, 3, 1, 0, 2, 1, 3, 0, 2, 1, 3, 0, 1, 2, 1, 1, 1, 0, 0, 2, 2, 0, 0, 1, 1, 0, 1, 0, 2, 0, 2, 0, 1, 1, 0, 0, 1, 2, 0, 0, 2, 2, 0, 0, 0, 0, 1, 1, -1, 1, 2, 0, 0, 0, 0, 1, -1, 1, 1, 2, 0, 0, 0, 0, 1, 1, 1, -1, 2, 3, 1, 1, 1, 2, 0, 0, 2, 2, 3, 1, 1, 1, 2, 2, 0, 0, 2, 3, 1, 1, 1, 2, 0, 2, 0, 2, 1, 1, -1, 1, 2, 0, 0, 2, 2, 1, 1, -1, 1, 2, 2, 0, 0, 2, 1, -1, 1, 1, 2, 0, 0, 2, 2, 1, -1, 1, 1, 2, 0, 2, 0, 2, 1, 1, 1, -1, 2, 2, 0, 0, 2, 1, 1, 1, -1, 2, 0, 2, 0];
	  exports.p4D = [0, 0, 1, -1, 0, 0, 0, 1, 0, -1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 1, 0, 0, 0, 0, 1, -1, 0, 0, 0, 1, 0, -1, 0, 0, -1, 0, 1, 0, 0, 0, -1, 1, 0, 0, 0, 0, 1, -1, 0, 0, -1, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, 0, -1, 1, 0, 2, 1, 1, 0, 0, 1, 1, 1, -1, 0, 1, 1, 1, 0, -1, 0, 2, 1, 0, 1, 0, 1, 1, -1, 1, 0, 1, 1, 0, 1, -1, 0, 2, 0, 1, 1, 0, 1, -1, 1, 1, 0, 1, 0, 1, 1, -1, 0, 2, 1, 0, 0, 1, 1, 1, -1, 0, 1, 1, 1, 0, -1, 1, 0, 2, 0, 1, 0, 1, 1, -1, 1, 0, 1, 1, 0, 1, -1, 1, 0, 2, 0, 0, 1, 1, 1, -1, 0, 1, 1, 1, 0, -1, 1, 1, 1, 4, 2, 1, 1, 0, 4, 1, 2, 1, 0, 4, 1, 1, 2, 0, 1, 4, 2, 1, 0, 1, 4, 1, 2, 0, 1, 4, 1, 1, 0, 2, 1, 4, 2, 0, 1, 1, 4, 1, 0, 2, 1, 4, 1, 0, 1, 2, 1, 4, 0, 2, 1, 1, 4, 0, 1, 2, 1, 4, 0, 1, 1, 2, 1, 2, 1, 1, 0, 0, 3, 2, 1, 0, 0, 3, 1, 2, 0, 0, 1, 2, 1, 0, 1, 0, 3, 2, 0, 1, 0, 3, 1, 0, 2, 0, 1, 2, 0, 1, 1, 0, 3, 0, 2, 1, 0, 3, 0, 1, 2, 0, 1, 2, 1, 0, 0, 1, 3, 2, 0, 0, 1, 3, 1, 0, 0, 2, 1, 2, 0, 1, 0, 1, 3, 0, 2, 0, 1, 3, 0, 1, 0, 2, 1, 2, 0, 0, 1, 1, 3, 0, 0, 2, 1, 3, 0, 0, 1, 2, 2, 3, 1, 1, 1, 0, 2, 1, 1, 1, -1, 2, 2, 0, 0, 0, 2, 3, 1, 1, 0, 1, 2, 1, 1, -1, 1, 2, 2, 0, 0, 0, 2, 3, 1, 0, 1, 1, 2, 1, -1, 1, 1, 2, 2, 0, 0, 0, 2, 3, 1, 1, 1, 0, 2, 1, 1, 1, -1, 2, 0, 2, 0, 0, 2, 3, 1, 1, 0, 1, 2, 1, 1, -1, 1, 2, 0, 2, 0, 0, 2, 3, 0, 1, 1, 1, 2, -1, 1, 1, 1, 2, 0, 2, 0, 0, 2, 3, 1, 1, 1, 0, 2, 1, 1, 1, -1, 2, 0, 0, 2, 0, 2, 3, 1, 0, 1, 1, 2, 1, -1, 1, 1, 2, 0, 0, 2, 0, 2, 3, 0, 1, 1, 1, 2, -1, 1, 1, 1, 2, 0, 0, 2, 0, 2, 3, 1, 1, 0, 1, 2, 1, 1, -1, 1, 2, 0, 0, 0, 2, 2, 3, 1, 0, 1, 1, 2, 1, -1, 1, 1, 2, 0, 0, 0, 2, 2, 3, 0, 1, 1, 1, 2, -1, 1, 1, 1, 2, 0, 0, 0, 2, 2, 1, 1, 1, -1, 0, 1, 1, 1, 0, -1, 0, 0, 0, 0, 0, 2, 1, 1, -1, 1, 0, 1, 1, 0, 1, -1, 0, 0, 0, 0, 0, 2, 1, -1, 1, 1, 0, 1, 0, 1, 1, -1, 0, 0, 0, 0, 0, 2, 1, 1, -1, 0, 1, 1, 1, 0, -1, 1, 0, 0, 0, 0, 0, 2, 1, -1, 1, 0, 1, 1, 0, 1, -1, 1, 0, 0, 0, 0, 0, 2, 1, -1, 0, 1, 1, 1, 0, -1, 1, 1, 0, 0, 0, 0, 0, 2, 1, 1, 1, -1, 0, 1, 1, 1, 0, -1, 2, 2, 0, 0, 0, 2, 1, 1, -1, 1, 0, 1, 1, 0, 1, -1, 2, 2, 0, 0, 0, 2, 1, 1, -1, 0, 1, 1, 1, 0, -1, 1, 2, 2, 0, 0, 0, 2, 1, 1, 1, -1, 0, 1, 1, 1, 0, -1, 2, 0, 2, 0, 0, 2, 1, -1, 1, 1, 0, 1, 0, 1, 1, -1, 2, 0, 2, 0, 0, 2, 1, -1, 1, 0, 1, 1, 0, 1, -1, 1, 2, 0, 2, 0, 0, 2, 1, 1, -1, 1, 0, 1, 1, 0, 1, -1, 2, 0, 0, 2, 0, 2, 1, -1, 1, 1, 0, 1, 0, 1, 1, -1, 2, 0, 0, 2, 0, 2, 1, -1, 0, 1, 1, 1, 0, -1, 1, 1, 2, 0, 0, 2, 0, 2, 1, 1, -1, 0, 1, 1, 1, 0, -1, 1, 2, 0, 0, 0, 2, 2, 1, -1, 1, 0, 1, 1, 0, 1, -1, 1, 2, 0, 0, 0, 2, 2, 1, -1, 0, 1, 1, 1, 0, -1, 1, 1, 2, 0, 0, 0, 2, 3, 1, 1, 0, 0, 0, 2, 2, 0, 0, 0, 2, 1, 1, 1, -1, 3, 1, 0, 1, 0, 0, 2, 0, 2, 0, 0, 2, 1, 1, 1, -1, 3, 1, 0, 0, 1, 0, 2, 0, 0, 2, 0, 2, 1, 1, 1, -1, 3, 1, 1, 0, 0, 0, 2, 2, 0, 0, 0, 2, 1, 1, -1, 1, 3, 1, 0, 1, 0, 0, 2, 0, 2, 0, 0, 2, 1, 1, -1, 1, 3, 1, 0, 0, 0, 1, 2, 0, 0, 0, 2, 2, 1, 1, -1, 1, 3, 1, 1, 0, 0, 0, 2, 2, 0, 0, 0, 2, 1, -1, 1, 1, 3, 1, 0, 0, 1, 0, 2, 0, 0, 2, 0, 2, 1, -1, 1, 1, 3, 1, 0, 0, 0, 1, 2, 0, 0, 0, 2, 2, 1, -1, 1, 1, 3, 1, 0, 1, 0, 0, 2, 0, 2, 0, 0, 2, -1, 1, 1, 1, 3, 1, 0, 0, 1, 0, 2, 0, 0, 2, 0, 2, -1, 1, 1, 1, 3, 1, 0, 0, 0, 1, 2, 0, 0, 0, 2, 2, -1, 1, 1, 1, 3, 3, 2, 1, 0, 0, 3, 1, 2, 0, 0, 4, 1, 1, 1, 1, 3, 3, 2, 0, 1, 0, 3, 1, 0, 2, 0, 4, 1, 1, 1, 1, 3, 3, 0, 2, 1, 0, 3, 0, 1, 2, 0, 4, 1, 1, 1, 1, 3, 3, 2, 0, 0, 1, 3, 1, 0, 0, 2, 4, 1, 1, 1, 1, 3, 3, 0, 2, 0, 1, 3, 0, 1, 0, 2, 4, 1, 1, 1, 1, 3, 3, 0, 0, 2, 1, 3, 0, 0, 1, 2, 4, 1, 1, 1, 1, 3, 3, 2, 1, 0, 0, 3, 1, 2, 0, 0, 2, 1, 1, 1, -1, 3, 3, 2, 0, 1, 0, 3, 1, 0, 2, 0, 2, 1, 1, 1, -1, 3, 3, 0, 2, 1, 0, 3, 0, 1, 2, 0, 2, 1, 1, 1, -1, 3, 3, 2, 1, 0, 0, 3, 1, 2, 0, 0, 2, 1, 1, -1, 1, 3, 3, 2, 0, 0, 1, 3, 1, 0, 0, 2, 2, 1, 1, -1, 1, 3, 3, 0, 2, 0, 1, 3, 0, 1, 0, 2, 2, 1, 1, -1, 1, 3, 3, 2, 0, 1, 0, 3, 1, 0, 2, 0, 2, 1, -1, 1, 1, 3, 3, 2, 0, 0, 1, 3, 1, 0, 0, 2, 2, 1, -1, 1, 1, 3, 3, 0, 0, 2, 1, 3, 0, 0, 1, 2, 2, 1, -1, 1, 1, 3, 3, 0, 2, 1, 0, 3, 0, 1, 2, 0, 2, -1, 1, 1, 1, 3, 3, 0, 2, 0, 1, 3, 0, 1, 0, 2, 2, -1, 1, 1, 1, 3, 3, 0, 0, 2, 1, 3, 0, 0, 1, 2, 2, -1, 1, 1, 1];
	});
	unwrapExports(constants);
	var constants_1 = constants.NORM_2D;
	var constants_2 = constants.NORM_3D;
	var constants_3 = constants.NORM_4D;
	var constants_4 = constants.SQUISH_2D;
	var constants_5 = constants.SQUISH_3D;
	var constants_6 = constants.SQUISH_4D;
	var constants_7 = constants.STRETCH_2D;
	var constants_8 = constants.STRETCH_3D;
	var constants_9 = constants.STRETCH_4D;
	var constants_10 = constants.base2D;
	var constants_11 = constants.base3D;
	var constants_12 = constants.base4D;
	var constants_13 = constants.gradients2D;
	var constants_14 = constants.gradients3D;
	var constants_15 = constants.gradients4D;
	var constants_16 = constants.lookupPairs2D;
	var constants_17 = constants.lookupPairs3D;
	var constants_18 = constants.lookupPairs4D;
	var constants_19 = constants.p2D;
	var constants_20 = constants.p3D;
	var constants_21 = constants.p4D;

	var lib = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  var Contribution2 =
	  /** @class */
	  function () {
	    function Contribution2(multiplier, xsb, ysb) {
	      this.dx = -xsb - multiplier * constants.SQUISH_2D;
	      this.dy = -ysb - multiplier * constants.SQUISH_2D;
	      this.xsb = xsb;
	      this.ysb = ysb;
	    }

	    return Contribution2;
	  }();

	  var Contribution3 =
	  /** @class */
	  function () {
	    function Contribution3(multiplier, xsb, ysb, zsb) {
	      this.dx = -xsb - multiplier * constants.SQUISH_3D;
	      this.dy = -ysb - multiplier * constants.SQUISH_3D;
	      this.dz = -zsb - multiplier * constants.SQUISH_3D;
	      this.xsb = xsb;
	      this.ysb = ysb;
	      this.zsb = zsb;
	    }

	    return Contribution3;
	  }();

	  var Contribution4 =
	  /** @class */
	  function () {
	    function Contribution4(multiplier, xsb, ysb, zsb, wsb) {
	      this.dx = -xsb - multiplier * constants.SQUISH_4D;
	      this.dy = -ysb - multiplier * constants.SQUISH_4D;
	      this.dz = -zsb - multiplier * constants.SQUISH_4D;
	      this.dw = -wsb - multiplier * constants.SQUISH_4D;
	      this.xsb = xsb;
	      this.ysb = ysb;
	      this.zsb = zsb;
	      this.wsb = wsb;
	    }

	    return Contribution4;
	  }();

	  function shuffleSeed(seed) {
	    var newSeed = new Uint32Array(1);
	    newSeed[0] = seed[0] * 1664525 + 1013904223;
	    return newSeed;
	  }

	  var OpenSimplexNoise =
	  /** @class */
	  function () {
	    function OpenSimplexNoise(clientSeed) {
	      this.initialize();
	      this.perm = new Uint8Array(256);
	      this.perm2D = new Uint8Array(256);
	      this.perm3D = new Uint8Array(256);
	      this.perm4D = new Uint8Array(256);
	      var source = new Uint8Array(256);

	      for (var i = 0; i < 256; i++) source[i] = i;

	      var seed = new Uint32Array(1);
	      seed[0] = clientSeed;
	      seed = shuffleSeed(shuffleSeed(shuffleSeed(seed)));

	      for (var i = 255; i >= 0; i--) {
	        seed = shuffleSeed(seed);
	        var r = new Uint32Array(1);
	        r[0] = (seed[0] + 31) % (i + 1);
	        if (r[0] < 0) r[0] += i + 1;
	        this.perm[i] = source[r[0]];
	        this.perm2D[i] = this.perm[i] & 0x0e;
	        this.perm3D[i] = this.perm[i] % 24 * 3;
	        this.perm4D[i] = this.perm[i] & 0xfc;
	        source[r[0]] = source[i];
	      }
	    }

	    OpenSimplexNoise.prototype.array2D = function (width, height) {
	      var output = new Array(width);

	      for (var x = 0; x < width; x++) {
	        output[x] = new Array(height);

	        for (var y = 0; y < height; y++) {
	          output[x][y] = this.noise2D(x, y);
	        }
	      }

	      return output;
	    };

	    OpenSimplexNoise.prototype.array3D = function (width, height, depth) {
	      var output = new Array(width);

	      for (var x = 0; x < width; x++) {
	        output[x] = new Array(height);

	        for (var y = 0; y < height; y++) {
	          output[x][y] = new Array(depth);

	          for (var z = 0; z < depth; z++) {
	            output[x][y][z] = this.noise3D(x, y, z);
	          }
	        }
	      }

	      return output;
	    };

	    OpenSimplexNoise.prototype.array4D = function (width, height, depth, wLength) {
	      var output = new Array(width);

	      for (var x = 0; x < width; x++) {
	        output[x] = new Array(height);

	        for (var y = 0; y < height; y++) {
	          output[x][y] = new Array(depth);

	          for (var z = 0; z < depth; z++) {
	            output[x][y][z] = new Array(wLength);

	            for (var w = 0; w < wLength; w++) {
	              output[x][y][z][w] = this.noise4D(x, y, z, w);
	            }
	          }
	        }
	      }

	      return output;
	    };

	    OpenSimplexNoise.prototype.noise2D = function (x, y) {
	      var stretchOffset = (x + y) * constants.STRETCH_2D;
	      var xs = x + stretchOffset;
	      var ys = y + stretchOffset;
	      var xsb = Math.floor(xs);
	      var ysb = Math.floor(ys);
	      var squishOffset = (xsb + ysb) * constants.SQUISH_2D;
	      var dx0 = x - (xsb + squishOffset);
	      var dy0 = y - (ysb + squishOffset);
	      var xins = xs - xsb;
	      var yins = ys - ysb;
	      var inSum = xins + yins;
	      var hash = xins - yins + 1 | inSum << 1 | inSum + yins << 2 | inSum + xins << 4;
	      var value = 0;

	      for (var c = this.lookup2D[hash]; c !== undefined; c = c.next) {
	        var dx = dx0 + c.dx;
	        var dy = dy0 + c.dy;
	        var attn = 2 - dx * dx - dy * dy;

	        if (attn > 0) {
	          var px = xsb + c.xsb;
	          var py = ysb + c.ysb;
	          var indexPartA = this.perm[px & 0xff];
	          var index = this.perm2D[indexPartA + py & 0xff];
	          var valuePart = constants.gradients2D[index] * dx + constants.gradients2D[index + 1] * dy;
	          value += attn * attn * attn * attn * valuePart;
	        }
	      }

	      return value * constants.NORM_2D;
	    };

	    OpenSimplexNoise.prototype.noise3D = function (x, y, z) {
	      var stretchOffset = (x + y + z) * constants.STRETCH_3D;
	      var xs = x + stretchOffset;
	      var ys = y + stretchOffset;
	      var zs = z + stretchOffset;
	      var xsb = Math.floor(xs);
	      var ysb = Math.floor(ys);
	      var zsb = Math.floor(zs);
	      var squishOffset = (xsb + ysb + zsb) * constants.SQUISH_3D;
	      var dx0 = x - (xsb + squishOffset);
	      var dy0 = y - (ysb + squishOffset);
	      var dz0 = z - (zsb + squishOffset);
	      var xins = xs - xsb;
	      var yins = ys - ysb;
	      var zins = zs - zsb;
	      var inSum = xins + yins + zins;
	      var hash = yins - zins + 1 | xins - yins + 1 << 1 | xins - zins + 1 << 2 | inSum << 3 | inSum + zins << 5 | inSum + yins << 7 | inSum + xins << 9;
	      var value = 0;

	      for (var c = this.lookup3D[hash]; c !== undefined; c = c.next) {
	        var dx = dx0 + c.dx;
	        var dy = dy0 + c.dy;
	        var dz = dz0 + c.dz;
	        var attn = 2 - dx * dx - dy * dy - dz * dz;

	        if (attn > 0) {
	          var px = xsb + c.xsb;
	          var py = ysb + c.ysb;
	          var pz = zsb + c.zsb;
	          var indexPartA = this.perm[px & 0xff];
	          var indexPartB = this.perm[indexPartA + py & 0xff];
	          var index = this.perm3D[indexPartB + pz & 0xff];
	          var valuePart = constants.gradients3D[index] * dx + constants.gradients3D[index + 1] * dy + constants.gradients3D[index + 2] * dz;
	          value += attn * attn * attn * attn * valuePart;
	        }
	      }

	      return value * constants.NORM_3D;
	    };

	    OpenSimplexNoise.prototype.noise4D = function (x, y, z, w) {
	      var stretchOffset = (x + y + z + w) * constants.STRETCH_4D;
	      var xs = x + stretchOffset;
	      var ys = y + stretchOffset;
	      var zs = z + stretchOffset;
	      var ws = w + stretchOffset;
	      var xsb = Math.floor(xs);
	      var ysb = Math.floor(ys);
	      var zsb = Math.floor(zs);
	      var wsb = Math.floor(ws);
	      var squishOffset = (xsb + ysb + zsb + wsb) * constants.SQUISH_4D;
	      var dx0 = x - (xsb + squishOffset);
	      var dy0 = y - (ysb + squishOffset);
	      var dz0 = z - (zsb + squishOffset);
	      var dw0 = w - (wsb + squishOffset);
	      var xins = xs - xsb;
	      var yins = ys - ysb;
	      var zins = zs - zsb;
	      var wins = ws - wsb;
	      var inSum = xins + yins + zins + wins;
	      var hash = zins - wins + 1 | yins - zins + 1 << 1 | yins - wins + 1 << 2 | xins - yins + 1 << 3 | xins - zins + 1 << 4 | xins - wins + 1 << 5 | inSum << 6 | inSum + wins << 8 | inSum + zins << 11 | inSum + yins << 14 | inSum + xins << 17;
	      var value = 0;

	      for (var c = this.lookup4D[hash]; c !== undefined; c = c.next) {
	        var dx = dx0 + c.dx;
	        var dy = dy0 + c.dy;
	        var dz = dz0 + c.dz;
	        var dw = dw0 + c.dw;
	        var attn = 2 - dx * dx - dy * dy - dz * dz - dw * dw;

	        if (attn > 0) {
	          var px = xsb + c.xsb;
	          var py = ysb + c.ysb;
	          var pz = zsb + c.zsb;
	          var pw = wsb + c.wsb;
	          var indexPartA = this.perm[px & 0xff];
	          var indexPartB = this.perm[indexPartA + py & 0xff];
	          var indexPartC = this.perm[indexPartB + pz & 0xff];
	          var index = this.perm4D[indexPartC + pw & 0xff];
	          var valuePart = constants.gradients4D[index] * dx + constants.gradients4D[index + 1] * dy + constants.gradients4D[index + 2] * dz + constants.gradients4D[index + 3] * dw;
	          value += attn * attn * attn * attn * valuePart;
	        }
	      }

	      return value * constants.NORM_4D;
	    };

	    OpenSimplexNoise.prototype.initialize = function () {
	      var contributions2D = [];

	      for (var i = 0; i < constants.p2D.length; i += 4) {
	        var baseSet = constants.base2D[constants.p2D[i]];
	        var previous = null;
	        var current = null;

	        for (var k = 0; k < baseSet.length; k += 3) {
	          current = new Contribution2(baseSet[k], baseSet[k + 1], baseSet[k + 2]);
	          if (previous === null) contributions2D[i / 4] = current;else previous.next = current;
	          previous = current;
	        }

	        current.next = new Contribution2(constants.p2D[i + 1], constants.p2D[i + 2], constants.p2D[i + 3]);
	      }

	      this.lookup2D = [];

	      for (var i = 0; i < constants.lookupPairs2D.length; i += 2) {
	        this.lookup2D[constants.lookupPairs2D[i]] = contributions2D[constants.lookupPairs2D[i + 1]];
	      }

	      var contributions3D = [];

	      for (var i = 0; i < constants.p3D.length; i += 9) {
	        var baseSet = constants.base3D[constants.p3D[i]];
	        var previous = null;
	        var current = null;

	        for (var k = 0; k < baseSet.length; k += 4) {
	          current = new Contribution3(baseSet[k], baseSet[k + 1], baseSet[k + 2], baseSet[k + 3]);
	          if (previous === null) contributions3D[i / 9] = current;else previous.next = current;
	          previous = current;
	        }

	        current.next = new Contribution3(constants.p3D[i + 1], constants.p3D[i + 2], constants.p3D[i + 3], constants.p3D[i + 4]);
	        current.next.next = new Contribution3(constants.p3D[i + 5], constants.p3D[i + 6], constants.p3D[i + 7], constants.p3D[i + 8]);
	      }

	      this.lookup3D = [];

	      for (var i = 0; i < constants.lookupPairs3D.length; i += 2) {
	        this.lookup3D[constants.lookupPairs3D[i]] = contributions3D[constants.lookupPairs3D[i + 1]];
	      }

	      var contributions4D = [];

	      for (var i = 0; i < constants.p4D.length; i += 16) {
	        var baseSet = constants.base4D[constants.p4D[i]];
	        var previous = null;
	        var current = null;

	        for (var k = 0; k < baseSet.length; k += 5) {
	          current = new Contribution4(baseSet[k], baseSet[k + 1], baseSet[k + 2], baseSet[k + 3], baseSet[k + 4]);
	          if (previous === null) contributions4D[i / 16] = current;else previous.next = current;
	          previous = current;
	        }

	        current.next = new Contribution4(constants.p4D[i + 1], constants.p4D[i + 2], constants.p4D[i + 3], constants.p4D[i + 4], constants.p4D[i + 5]);
	        current.next.next = new Contribution4(constants.p4D[i + 6], constants.p4D[i + 7], constants.p4D[i + 8], constants.p4D[i + 9], constants.p4D[i + 10]);
	        current.next.next.next = new Contribution4(constants.p4D[i + 11], constants.p4D[i + 12], constants.p4D[i + 13], constants.p4D[i + 14], constants.p4D[i + 15]);
	      }

	      this.lookup4D = [];

	      for (var i = 0; i < constants.lookupPairs4D.length; i += 2) {
	        this.lookup4D[constants.lookupPairs4D[i]] = contributions4D[constants.lookupPairs4D[i + 1]];
	      }
	    };

	    return OpenSimplexNoise;
	  }();

	  exports.default = OpenSimplexNoise;
	});
	var OpenSimplexNoise = unwrapExports(lib);

	var seed = 0;
	var noise = new OpenSimplexNoise(seed);

	function grid () {
	  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
	  var res = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
	  res = res + 2;
	  var amountPoints = (res * 4 - 4) * 3;
	  var position = new Float32Array(amountPoints * 2);
	  var normal = new Float32Array(amountPoints);
	  var uv = new Float32Array((res * 4 - 4) * 2);
	  var index = new Uint16Array(res * 4); //Create lines parallel to the x-axis;

	  for (var i = 0; i < res; i++) {
	    var a = i / (res - 1) * 2 - 1;
	    position[i * 6 + 0] = -size;
	    position[i * 6 + 1] = 0;
	    position[i * 6 + 2] = size * a;
	    position[i * 6 + 3] = size;
	    position[i * 6 + 4] = 0;
	    position[i * 6 + 5] = size * a;
	  } //Create lines parallel to the y-axis;


	  var offsetHalf = res * 6;

	  for (var _i = 0; _i < res; _i++) {
	    var _a = _i / (res - 1) * 2 - 1;

	    position[offsetHalf + _i * 6 + 0] = -size * _a;
	    position[offsetHalf + _i * 6 + 1] = 0;
	    position[offsetHalf + _i * 6 + 2] = -size;
	    position[offsetHalf + _i * 6 + 3] = -size * _a;
	    position[offsetHalf + _i * 6 + 4] = 0;
	    position[offsetHalf + _i * 6 + 5] = size;
	  }

	  return {
	    position: position,
	    normal: normal,
	    uv: uv,
	    index: index
	  };
	}

	var totalSize = 100;
	var slopeLength = 2;
	var groundHeight = 1;
	function ground (size) {
	  var resX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 12;
	  var resY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 12;
	  //General parameters
	  var angle = 360 * (Math.PI / 180) / resY; // Convert to radians
	  //Final model

	  var position = new Float32Array(resX * resY * 3 + 3);
	  var normal = new Float32Array(resX * resY * 3 + 3);
	  var uv = new Float32Array(resX * resY * 2);
	  var index = new Uint16Array(resX * resY * 6 - resY * 3); //Set first point

	  position[0] = 0;
	  position[1] = 1 - groundHeight;
	  position[2] = 0;
	  normal[0] = 0;
	  normal[1] = 1;
	  normal[2] = 0;
	  uv[0] = 0;
	  uv[1] = 0; //Create the positions

	  var xPositions = new Array(resX - 1).fill(null).map(function (v, i, a) {
	    return size + i / (a.length - 1) * slopeLength;
	  });
	  xPositions.push(totalSize);
	  var yPositions = xPositions.map(function (v, i, a) {
	    var slopeAlpha = (Math.max(Math.min(v, size + slopeLength), size) - size) / slopeLength;
	    return Math.sin((slopeAlpha + 0.5) * Math.PI) / 2 + 0.5 - groundHeight;
	  }); //Loop from center out

	  for (var i = 0; i < resX; i++) {
	    var xPos = xPositions[i];
	    var yPos = yPositions[i];

	    for (var j = 0; j < resY; j++) {
	      var _angle = angle * j;

	      var x = Math.cos(_angle) * xPos;
	      var y = yPos;
	      var z = Math.sin(_angle) * xPos;
	      var offset = 3 + i * resY * 3 + j * 3;
	      position[offset + 0] = x;
	      position[offset + 1] = y;
	      position[offset + 2] = z;
	      normal[offset + 0] = 0;
	      normal[offset + 1] = 1;
	      normal[offset + 2] = 0;
	      var uvOffset = 2 + i * resY * 2 + j * 2;
	      uv[uvOffset + 0] = x;
	      uv[uvOffset + 1] = z;
	    }
	  } //Create the indeces;
	  //For the center circle


	  for (var _i = 0; _i < resY; _i++) {
	    if (_i === resY - 1) {
	      index[(resY - 1) * 3 + 0] = 0;
	      index[(resY - 1) * 3 + 1] = 1;
	      index[(resY - 1) * 3 + 2] = resY;
	    } else {
	      index[_i * 3 + 0] = 0;
	      index[_i * 3 + 1] = _i + 1;
	      index[_i * 3 + 2] = _i + 2;
	    }
	  }

	  for (var _i2 = 0; _i2 < resX; _i2++) {
	    var indexOffset = resY * 3 + _i2 * resY * 6;
	    var positionOffset = 1 + _i2 * resY;

	    for (var _j = 0; _j < resY; _j++) {
	      var _indexOffset = indexOffset + _j * 6;

	      var _positionOffset = positionOffset + _j;

	      if (_j === resY - 1) {
	        index[_indexOffset + 0] = _positionOffset;
	        index[_indexOffset + 1] = _positionOffset - resY + 1;
	        index[_indexOffset + 2] = _positionOffset + 1;
	        index[_indexOffset + 3] = _positionOffset + 1;
	        index[_indexOffset + 4] = _positionOffset + resY;
	        index[_indexOffset + 5] = _positionOffset;
	      } else {
	        index[_indexOffset + 0] = _positionOffset;
	        index[_indexOffset + 1] = _positionOffset + 1;
	        index[_indexOffset + 2] = _positionOffset + resY + 1;
	        index[_indexOffset + 3] = _positionOffset + resY + 1;
	        index[_indexOffset + 4] = _positionOffset + resY;
	        index[_indexOffset + 5] = _positionOffset;
	      }
	    }
	  }

	  return {
	    position: position,
	    normal: normal,
	    uv: uv,
	    index: index
	  };
	}

	var GroundShaderFrag = "precision highp float;\nprecision highp int;\n#define GLSLIFY 1\n\nuniform float uTime;\nuniform sampler2D tMap;\nuniform vec3 uFogColor;\nuniform float uFogNear;\nuniform float uFogFar;\nuniform float texScale;\n\nvarying vec2 vUv;\nvarying vec4 vMVPos;\nvarying vec3 vPos;\n\nvoid main() {\n    vec3 tex = texture2D(tMap, vUv*texScale).rgb;\n    \n    // add the fog relative to the distance from the camera\n    float dist = length(vMVPos);\n    float fog = smoothstep(uFogNear, uFogFar, dist);\n    tex = mix(tex, uFogColor, fog);\n    \n    // add some fog along the height of each tree to simulate low-lying fog \n    tex = mix(tex, uFogColor, smoothstep(0.3, -1.2, vPos.y)); \n    \n    gl_FragColor.rgb = tex;\n}"; // eslint-disable-line

	var GroundShaderVert = "precision highp float;\nprecision highp int;\n#define GLSLIFY 1\n\nattribute vec2 uv;\nattribute vec3 position;\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float uTime;\n\nvarying vec2 vUv;\nvarying vec4 vMVPos;\nvarying vec3 vPos;\n\nvoid main() {\n    vUv = uv;\n    \n    // copy position so that we can modify the instances\n    vec3 pos = position;\n    \n    // pass scaled object position to fragment to add low-lying fog\n    vPos = pos;\n    \n    // pass model view position to fragment shader to get distance from camera \n    vMVPos = modelViewMatrix * vec4(pos, 1.0);\n    \n    gl_Position = projectionMatrix * vMVPos;\n}"; // eslint-disable-line

	var BasicShaderFrag = "precision highp float;\nprecision highp int;\n#define GLSLIFY 1\n\nuniform sampler2D tMap;\n\nvarying vec3 vNormal;\nvarying vec2 vUv;\n\nvoid main() {\n\n    vec3 normal = normalize(vNormal);\n\n    float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));\n\n    gl_FragColor.rgb = (vec3(0.308, 0.712, 0.5) + lighting * 0.5)-0.25;\n\n    gl_FragColor.a = 1.0;\n\n}"; // eslint-disable-line

	var BasicShaderVert = "precision highp float;\nprecision highp int;\n#define GLSLIFY 1\n\nattribute vec2 uv;\nattribute vec3 position;\nattribute vec3 normal;\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat3 normalMatrix;\n\nvarying vec3 vNormal;\nvarying vec2 vUv;\n\nvoid main() {\n    vUv = uv;\n\n    vNormal = normalize(normalMatrix * normal);\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}"; // eslint-disable-line

	var InstanceShaderFrag = "precision highp float;\nprecision highp int;\n#define GLSLIFY 1\n\nvarying vec3 vNormal;\n\nvoid main() {\n\n    vec3 normal = normalize(vNormal);\n\n    float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));\n\n    gl_FragColor.rgb = (vec3(0.308, 0.712, 0.5) + lighting * 0.5)-0.5;\n\n    gl_FragColor.a = 1.0;\n\n}"; // eslint-disable-line

	var InstanceShaderVert = "precision highp float;\nprecision highp int;\n#define GLSLIFY 1\nattribute vec2 uv;\nattribute vec3 position;\nattribute vec3 normal;\n\nattribute vec3 offset;\nattribute vec3 scale;\nattribute vec3 rotation;\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat3 normalMatrix;\n\nuniform float uTime;\nvarying vec2 vUv;\nvarying vec3 vNormal;\n\nmat4 rotationX( in float angle ) {\n\treturn mat4(\t1.0,\t\t0,\t\t\t0,\t\t\t0,\n\t\t\t \t\t0, \tcos(angle),\t-sin(angle),\t\t0,\n\t\t\t\t\t0, \tsin(angle),\t cos(angle),\t\t0,\n\t\t\t\t\t0, \t\t\t0,\t\t\t  0, \t\t1);\n}\n\nmat4 rotationY( in float angle ) {\n\treturn mat4(\tcos(angle),\t\t0,\t\tsin(angle),\t0,\n\t\t\t \t\t\t\t0,\t\t1.0,\t\t\t 0,\t0,\n\t\t\t\t\t-sin(angle),\t0,\t\tcos(angle),\t0,\n\t\t\t\t\t\t\t0, \t\t0,\t\t\t\t0,\t1);\n}\n\nmat4 rotationZ( in float angle ) {\n\treturn mat4(\tcos(angle),\t\t-sin(angle),\t0,\t0,\n\t\t\t \t\tsin(angle),\t\tcos(angle),\t\t0,\t0,\n\t\t\t\t\t\t\t0,\t\t\t\t0,\t\t1,\t0,\n\t\t\t\t\t\t\t0,\t\t\t\t0,\t\t0,\t1);\n}\n\nvoid main() {\n    vUv = uv;\n\n    vNormal = normalize(normalMatrix * normal);\n\n    // copy position so that we can modify the instances\n    vec4 pos = vec4(position.xyz, 1.0);\n\n    pos = pos *rotationX(rotation.x) *rotationY(rotation.y) ;\n\n    vec3 rotated = vec3(pos.x, pos.y, pos.z);\n\n    rotated *= scale;\n\n    rotated += offset;\n    \n    gl_Position = projectionMatrix * modelViewMatrix * vec4(rotated, 1.0);\n}"; // eslint-disable-line

	var WireFrameFrag = "precision highp float;\nprecision highp int;\n#define GLSLIFY 1\n\nvoid main() {\n    gl_FragColor.rgb = vec3(0.0, 0.0, 0.0);\n    gl_FragColor.a = 1.0;\n}"; // eslint-disable-line

	var WireFrameVert = "precision highp float;\nprecision highp int;\n#define GLSLIFY 1\n\nattribute vec3 position;\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat3 normalMatrix;\n\nvoid main() {\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}"; // eslint-disable-line

	var GroundShader = {
	  fragment: GroundShaderFrag,
	  vertex: GroundShaderVert
	};
	var BasicShader = {
	  fragment: BasicShaderFrag,
	  vertex: BasicShaderVert
	};
	var InstanceShader = {
	  fragment: InstanceShaderFrag,
	  vertex: InstanceShaderVert
	};
	var WireFrameShader = {
	  fragment: WireFrameFrag,
	  vertex: WireFrameVert
	};

	var shaders = /*#__PURE__*/Object.freeze({
		GroundShader: GroundShader,
		BasicShader: BasicShader,
		InstanceShader: InstanceShader,
		WireFrameShader: WireFrameShader
	});

	var textureCache = {};
	var shaderCache = {};
	var gl;

	var textureLoader = function textureLoader(src) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  if (textureCache[src]) return textureCache[src];
	  var texture = new Texture(gl, options);
	  var image = new Image();
	  textureCache[src] = texture;

	  image.onload = function () {
	    texture.image = image;
	  };

	  image.src = src;
	  return texture;
	};

	var shaderLoader = function shaderLoader(name) {
	  var uniforms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  if (shaderCache[name]) return shaderCache[name];

	  if (name in shaders) {
	    var shader = new Program(gl, {
	      vertex: shaders[name].vertex,
	      fragment: shaders[name].fragment,
	      uniforms: uniforms
	    });
	    shaderCache[name] = shader;
	    return shader;
	  } else {
	    console.error("cant load shader " + name);
	  }
	};

	var exp$1 = {
	  texture: textureLoader,
	  shader: shaderLoader,
	  setGl: function setGl(_gl) {
	    gl = _gl;
	  }
	};

	var canvas$1 = document.getElementById("render-canvas");
	var renderer;
	var scene;
	var camera$1;
	var controls;
	var plant;
	var plantMesh;
	var groundMesh;
	var gl$1;
	var leaf$1;
	var leafMesh;
	var showIndices;
	var showSkeleton$1;
	var gridSize = 5;
	var gridResolution = 8;
	var gridMesh;
	var _deferredSettings = {};

	function applySettings(_x) {
	  return _applySettings.apply(this, arguments);
	} //Init


	function _applySettings() {
	  _applySettings = _asyncToGenerator(
	  /*#__PURE__*/
	  regeneratorRuntime.mark(function _callee3(_s) {
	    var resX, resY, size, groundGeometry, gridNeedsUpdate, gridGeometry;
	    return regeneratorRuntime.wrap(function _callee3$(_context3) {
	      while (1) {
	        switch (_context3.prev = _context3.next) {
	          case 0:
	            if (!_deferredSettings) {
	              if (_s) {
	                _deferredSettings = _s;
	              }
	            }

	            if (plant) {
	              if (_s["debug_wireframe"]) {
	                plantMesh.mode = gl$1.LINES;
	                groundMesh.mode = gl$1.LINES;
	                leafMesh.mode = gl$1.LINES;
	              } else {
	                plantMesh.mode = gl$1.TRIANGLES;
	                groundMesh.mode = gl$1.TRIANGLES;
	                leafMesh.mode = gl$1.TRIANGLES;
	              }
	            }

	            if (_s["debug_indices"]) {
	              showIndices = true;
	            } else {
	              showIndices = false;
	            }

	            if (_s["debug_skeleton"]) {
	              showSkeleton$1 = true;
	            } else {
	              showSkeleton$1 = false;
	            }

	            if (groundMesh) {
	              resX = _s["ground_resX"] || 12;
	              resY = _s["ground_resY"] || 12;
	              size = _s["ground_size"] || 0.00001;

	              if (resX && resY && size) {
	                groundGeometry = ground(size, resX, resY);
	                groundMesh.geometry = new Geometry(gl$1, {
	                  position: {
	                    size: 3,
	                    data: new Float32Array(groundGeometry.position)
	                  },
	                  normal: {
	                    size: 3,
	                    data: new Float32Array(groundGeometry.normal)
	                  },
	                  uv: {
	                    size: 2,
	                    data: new Float32Array(groundGeometry.uv)
	                  },
	                  index: {
	                    size: 1,
	                    data: new Uint16Array(groundGeometry.index)
	                  }
	                });
	              }

	              if (_s["ground_enable"] !== false) {
	                groundMesh.visible = true;

	                if (!groundMesh.parent) {
	                  groundMesh.setParent(scene);
	                }
	              } else {
	                groundMesh.visible = false;
	              }
	            }

	            if (plant) {
	              plantMesh.visible = !_s["debug_disable_model"];
	            }

	            if (gridMesh) {
	              if (_s["debug_grid"]) {
	                gridMesh.visible = true;
	                gridNeedsUpdate = false;

	                if (_s["debug_grid_resolution"] !== gridResolution) {
	                  gridResolution = _s["debug_grid_resolution"];
	                  gridNeedsUpdate = true;
	                }

	                if (_s["debug_grid_size"] !== gridSize) {
	                  gridSize = _s["debug_grid_size"];
	                  gridNeedsUpdate = true;
	                }

	                if (gridNeedsUpdate) {
	                  gridGeometry = grid(gridSize, gridResolution);
	                  gridMesh.geometry = new Geometry(gl$1, {
	                    position: {
	                      size: 3,
	                      data: new Float32Array(gridGeometry.position)
	                    }
	                  });
	                }
	              } else {
	                gridMesh.visible = false;
	              }
	            }

	          case 7:
	          case "end":
	            return _context3.stop();
	        }
	      }
	    }, _callee3);
	  }));
	  return _applySettings.apply(this, arguments);
	}

	_asyncToGenerator(
	/*#__PURE__*/
	regeneratorRuntime.mark(function _callee2() {
	  var b;
	  return regeneratorRuntime.wrap(function _callee2$(_context2) {
	    while (1) {
	      switch (_context2.prev = _context2.next) {
	        case 0:
	          b = canvas$1.getBoundingClientRect();
	          renderer = new Renderer({
	            width: b.width,
	            antialias: true,
	            height: b.height,
	            dpr: window.devicePixelRatio || 1,
	            canvas: canvas$1
	          });
	          gl$1 = renderer.gl;
	          gl$1.clearColor(1, 1, 1, 1);
	          exp$1.setGl(gl$1); //Handle resizing

	          (function () {
	            var resize = throttle(function () {
	              var wrapper = canvas$1.parentElement;
	              var b = wrapper.getBoundingClientRect();
	              renderer.setSize(b.width, b.height);
	              canvas$1.style.height = "";
	              canvas$1.style.width = "";
	              camera$1.perspective({
	                aspect: gl$1.canvas.width / gl$1.canvas.height
	              });
	            }, 500);
	            var resizeObserver = new ResizeObserver(resize);
	            resizeObserver.observe(canvas$1.parentElement);
	          })();

	          camera$1 = new Camera(gl$1, {
	            fov: 70,
	            aspect: b.width / b.height
	          });
	          camera$1.position.set(0, 2, 4);
	          camera$1.lookAt(new Vec3(0, 0, 0));
	          if (localStorage.pdCamera) camera$1.position.fromArray(localStorage.pdCamera.split(",").map(function (v) {
	            return parseFloat(v);
	          }));
	          overlay.debug3d.camera = camera$1;
	          controls = new Orbit(camera$1, {
	            element: canvas$1,
	            target: new Vec3(0, 0.2, 0),
	            maxPolarAngle: 1.6,
	            minDistance: 0.2,
	            maxDistance: 15,
	            //enablePan: false,
	            ease: 0.7,
	            rotateSpeed: 0.5,
	            inertia: 0.5
	          });
	          scene = new Transform(); //Load the models;

	          _asyncToGenerator(
	          /*#__PURE__*/
	          regeneratorRuntime.mark(function _callee() {
	            var groundTexture, basicShader, gridGeometry;
	            return regeneratorRuntime.wrap(function _callee$(_context) {
	              while (1) {
	                switch (_context.prev = _context.next) {
	                  case 0:
	                    //Load the ground/dirt texture (from freepbr.com)
	                    groundTexture = exp$1.texture("assets/rocky_dirt1-albedo.jpg", {
	                      wrapS: gl$1.REPEAT,
	                      wrapT: gl$1.REPEAT
	                    });
	                    basicShader = exp$1.shader("BasicShader", {
	                      uTime: {
	                        value: 0
	                      },
	                      uMouse: {
	                        value: new Vec2(1, 1)
	                      },
	                      uResolution: {
	                        value: new Vec2(250, 250)
	                      },
	                      tMap: {
	                        value: groundTexture
	                      }
	                    }); //Create the grid;

	                    gridGeometry = grid(gridSize, gridResolution);
	                    gridMesh = new Mesh(gl$1, {
	                      mode: gl$1.LINES,
	                      geometry: new Geometry(gl$1, {
	                        position: {
	                          size: 3,
	                          data: new Float32Array(gridGeometry.position)
	                        }
	                      }),
	                      program: exp$1.shader("WireFrameShader")
	                    });
	                    gridMesh.setParent(scene);
	                    plant = new Geometry(gl$1, {
	                      position: {
	                        size: 3,
	                        data: new Float32Array([0, 0, 0])
	                      },
	                      normal: {
	                        size: 3,
	                        data: new Float32Array([0, 0, 0])
	                      },
	                      uv: {
	                        size: 2,
	                        data: new Float32Array([0, 0])
	                      },
	                      index: {
	                        size: 1,
	                        data: new Uint16Array([0, 0])
	                      }
	                    }); //Create the main mesh with the placeholder geometry

	                    plantMesh = new Mesh(gl$1, {
	                      geometry: plant,
	                      program: basicShader
	                    });
	                    plantMesh.setParent(scene);
	                    plant.computeBoundingBox();
	                    leaf$1 = new Geometry(gl$1, {
	                      position: {
	                        size: 3,
	                        data: new Float32Array([0, 0, 0, 0, 0, 0])
	                      },
	                      normal: {
	                        size: 3,
	                        data: new Float32Array([0, 0, 0, 0, 0, 0])
	                      },
	                      uv: {
	                        size: 2,
	                        data: new Float32Array([0, 0, 0, 0])
	                      },
	                      index: {
	                        size: 1,
	                        data: new Uint16Array([0, 1])
	                      },
	                      // simply add the 'instanced' property to flag as an instanced attribute.
	                      // set the value as the divisor number
	                      offset: {
	                        instanced: 1,
	                        size: 3,
	                        data: new Float32Array([0, 0, 0, 1, 1, 1])
	                      },
	                      rotation: {
	                        instanced: 1,
	                        size: 3,
	                        data: new Float32Array([0, 0, 0, 1, 1, 1])
	                      },
	                      scale: {
	                        instanced: 1,
	                        size: 3,
	                        data: new Float32Array([0, 0, 0, 1, 1, 1])
	                      }
	                    });
	                    leafMesh = new Mesh(gl$1, {
	                      geometry: leaf$1,
	                      program: exp$1.shader("InstanceShader", {
	                        uTime: {
	                          value: 0
	                        }
	                      })
	                    });
	                    leafMesh.setParent(scene); //Load ground object

	                    groundMesh = new Mesh(gl$1, {
	                      //mode: gl.LINES,
	                      program: exp$1.shader("GroundShader", {
	                        uTime: {
	                          value: 0
	                        },
	                        tMap: {
	                          value: groundTexture
	                        },
	                        // Pass relevant uniforms for fog
	                        uFogColor: {
	                          value: new Color("#ffffff")
	                        },
	                        uFogNear: {
	                          value: 10
	                        },
	                        uFogFar: {
	                          value: 30
	                        },
	                        texScale: {
	                          value: 1
	                        }
	                      }),
	                      geometry: new Geometry(gl$1, {
	                        position: {
	                          size: 3,
	                          data: new Float32Array([0, 0, 0])
	                        },
	                        normal: {
	                          size: 1,
	                          data: new Float32Array([0, 0, 0])
	                        },
	                        uv: {
	                          size: 2,
	                          data: new Float32Array([0, 0, 0])
	                        },
	                        index: {
	                          size: 1,
	                          data: new Uint16Array([0])
	                        }
	                      })
	                    });
	                    applySettings(_deferredSettings);

	                  case 14:
	                  case "end":
	                    return _context.stop();
	                }
	              }
	            }, _callee);
	          }))();

	          requestAnimationFrame(render);

	        case 15:
	        case "end":
	          return _context2.stop();
	      }
	    }
	  }, _callee2);
	}))(); //Render loop


	var i = 0;
	var start = 0;

	function render() {
	  i++;
	  overlay.renderTime(performance.now() - start);
	  requestAnimationFrame(render);
	  overlay.debug3d.draw();
	  controls.update();
	  renderer.render({
	    scene: scene,
	    camera: camera$1
	  });
	  if (i % 30 === 0) localStorage["pdCamera"] = camera$1.position;
	  start = performance.now();
	}

	var renderer$1 = {
	  render: function render(model) {
	    gl$1.disable(gl$1.CULL_FACE);

	    if (model && "position" in model && plant) {
	      overlay.vertices(model.position.length / 3);

	      if (showSkeleton$1 && model.skeleton) {
	        overlay.debug3d.skeleton = model.skeleton;
	      }

	      showIndices && (overlay.debug3d.points = model.position);

	      if (model.leaf) {
	        overlay.debug3d.uv = model.uv;

	        {
	          leafMesh.geometry = new Geometry(gl$1, {
	            position: {
	              size: 3,
	              data: new Float32Array(model.leaf.position)
	            },
	            normal: {
	              size: 3,
	              data: new Float32Array(model.leaf.normal)
	            },
	            uv: {
	              size: 2,
	              data: new Float32Array(model.leaf.uv)
	            },
	            index: {
	              size: 1,
	              data: new Uint16Array(model.leaf.index)
	            },
	            offset: {
	              instanced: 1,
	              size: 3,
	              data: new Float32Array(model.leaf.offset)
	            },
	            scale: {
	              instanced: 1,
	              size: 3,
	              data: new Float32Array(model.leaf.scale)
	            },
	            rotation: {
	              instanced: 1,
	              size: 3,
	              data: new Float32Array(model.leaf.rotation)
	            }
	          });
	          leafMesh.geometry.setInstancedCount(model.leaf.offset.length / 3);
	        }
	      } else {
	        leafMesh.geometry.setInstancedCount(0);
	      }

	      {
	        plantMesh.geometry = new Geometry(gl$1, {
	          position: {
	            size: 3,
	            data: new Float32Array(model.position)
	          },
	          normal: {
	            size: 3,
	            data: new Float32Array(model.normal)
	          },
	          uv: {
	            size: 2,
	            data: new Float32Array(model.uv)
	          },
	          index: {
	            size: 1,
	            data: new Uint32Array(model.index)
	          }
	        });
	      }
	    }
	  },
	  update: applySettings
	};

	var nextStage$2;

	function generate$1(_x) {
	  return _generate.apply(this, arguments);
	}

	function _generate() {
	  _generate = _asyncToGenerator(
	  /*#__PURE__*/
	  regeneratorRuntime.mark(function _callee(pd) {
	    var model;
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.next = 2;
	            return generateModel(pd, settings$1.object);

	          case 2:
	            model = _context.sent;
	            renderer$1.render(model);

	          case 4:
	          case "end":
	            return _context.stop();
	        }
	      }
	    }, _callee);
	  }));
	  return _generate.apply(this, arguments);
	}

	var display = {
	  set pd(_pd) {
	    if (nextStage$2) nextStage$2.pd = _pd;
	    overlay.pd(_pd);
	    generate$1(_pd);
	  },

	  init: function init(_pd) {
	    var _s = settings$1.object;
	    renderer$1.update(_s);
	    overlay.update(_s);
	    this.pd = _pd;
	    if (nextStage$2) nextStage$2.init(_pd);
	  },
	  connect: function connect(stage) {
	    nextStage$2 = stage;
	  }
	};

	if ("serviceWorker" in navigator) {
	  window.addEventListener("load", function () {
	    navigator.serviceWorker.register("sw.js").then(function (reg) {}, function (err) {
	      // registration failed :(
	      console.error(err);
	    });
	  });
	} else {
	  alert("\n    This application won't work for you right now, \n    as your browser seems a bit old, support is planned.\n    ");
	} //Import all the stages

	(function () {
	  resizeTables(document.querySelector("table"));
	  document.getElementById("version").innerHTML = "v" + version; //Initialize all the stages

	  var stemStage = new Stage(stemConfig);
	  var branchStage = new Stage(branchConfig);
	  var leafStage = new Stage(leafConfig);
	  var IOStage = new Stage(ioConfig);
	  var displayStage = display;
	  var settingsStage = new Stage(settingsConfig); //Connect all the stages

	  [importerStage, stemStage, branchStage, leafStage, IOStage, settingsStage, displayStage, projectManager].forEach(function (s, i, a) {
	    return s.connect(a[i + 1]);
	  });
	  projectManager.init();
	})();

}());
//# sourceMappingURL=bundle.js.map
