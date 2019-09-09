var plantarium_serviceworker = (function () {
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

	// Thank's IE8 for his funny defineProperty


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

	// toObject with fallback for non-array-like ES3 strings




	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
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

	var document = global_1.document; // typeof document.createElement is 'object' in old IE

	var EXISTS = isObject(document) && isObject(document.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty


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

	// `Array.prototype.{ indexOf, includes }` methods implementation


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

	// all object keys, includes non-enumerable and symbols


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

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray


	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject


	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
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

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
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

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: FORCED
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
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }

	    A.length = n;
	    return A;
	  }
	});

	// `Array.prototype.fill` method implementation
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

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys


	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
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

	// `Array.prototype.fill` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.fill


	_export({
	  target: 'Array',
	  proto: true
	}, {
	  fill: arrayFill
	}); // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	addToUnscopables('fill');

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  }

	  return it;
	};

	// optional / simple context binding


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

	// `FlattenIntoArray` abstract operation
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

	// `Array.prototype.flat` method
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

	var $map = arrayIteration.map;

	 // `Array.prototype.map` method
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

	// this method was added to unscopables after implementation
	// in popular engines, so it's moved to a separate module


	addToUnscopables('flat');

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

	var $filter = arrayIteration.filter;

	 // `Array.prototype.filter` method
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

	var sloppyArrayMethod = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !method || !fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () {
	      throw 1;
	    }, 1);
	  });
	};

	var $forEach = arrayIteration.forEach;

	 // `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach


	var arrayForEach = sloppyArrayMethod('forEach') ? function forEach(callbackfn
	/* , thisArg */
	) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach


	_export({
	  target: 'Array',
	  proto: true,
	  forced: [].forEach != arrayForEach
	}, {
	  forEach: arrayForEach
	});

	var nativeSort = [].sort;
	var test = [1, 2, 3]; // IE8-

	var FAILS_ON_UNDEFINED = fails(function () {
	  test.sort(undefined);
	}); // V8 bug

	var FAILS_ON_NULL = fails(function () {
	  test.sort(null);
	}); // Old WebKit

	var SLOPPY_METHOD = sloppyArrayMethod('sort');
	var FORCED$1 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || SLOPPY_METHOD; // `Array.prototype.sort` method
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

	// `RegExp.prototype.flags` getter implementation
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

	var samplingCurve = new Curve();
	function curveToArray (points) {
	  samplingCurve.points = points;
	  return samplingCurve.array;
	}

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

	var defineProperty = objectDefineProperty.f;





	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
	    defineProperty(it, TO_STRING_TAG$2, {
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

	// `Object.setPrototypeOf` method
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

	var defineProperty$1 = objectDefineProperty.f;









	var DataView = global_1.DataView;
	var DataViewPrototype = DataView && DataView.prototype;
	var Int8Array$1 = global_1.Int8Array;
	var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
	var Uint8ClampedArray = global_1.Uint8ClampedArray;
	var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
	var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
	var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
	var ObjectPrototype$2 = Object.prototype;
	var isPrototypeOf = ObjectPrototype$2.isPrototypeOf;
	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
	var NATIVE_ARRAY_BUFFER = !!(global_1.ArrayBuffer && DataView); // Fixing native typed arrays in Opera Presto crashes the browser, see #595

	var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
	var TYPED_ARRAY_TAG_REQIRED = false;
	var NAME;
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
	  } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME)) {
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

	for (NAME in TypedArrayConstructorsList) {
	  if (!global_1[NAME]) NATIVE_ARRAY_BUFFER_VIEWS = false;
	} // WebKit bug - typed arrays constructors prototype is Object.prototype


	if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
	  // eslint-disable-next-line no-shadow
	  TypedArray = function TypedArray() {
	    throw TypeError('Incorrect invocation');
	  };

	  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
	    if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME], TypedArray);
	  }
	}

	if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$2) {
	  TypedArrayPrototype = TypedArray.prototype;
	  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
	    if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME].prototype, TypedArrayPrototype);
	  }
	} // WebKit bug - one more object in Uint8ClampedArray prototype chain


	if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
	  objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
	}

	if (descriptors && !has(TypedArrayPrototype, TO_STRING_TAG$3)) {
	  TYPED_ARRAY_TAG_REQIRED = true;
	  defineProperty$1(TypedArrayPrototype, TO_STRING_TAG$3, {
	    get: function () {
	      return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
	    }
	  });

	  for (NAME in TypedArrayConstructorsList) if (global_1[NAME]) {
	    hide(global_1[NAME], TYPED_ARRAY_TAG, NAME);
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

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);

	  return target;
	};

	var anInstance = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  }

	  return it;
	};

	// `ToIndex` abstract operation
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

	var SPECIES$2 = wellKnownSymbol('species'); // `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor

	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$2]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var ArrayBuffer = arrayBuffer.ArrayBuffer;
	var DataView$1 = arrayBuffer.DataView;
	var nativeArrayBufferSlice = ArrayBuffer.prototype.slice;
	var INCORRECT_SLICE = fails(function () {
	  return !new ArrayBuffer(2).slice(1, undefined).byteLength;
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
	    var result = new (speciesConstructor(this, ArrayBuffer))(toLength(fin - first));
	    var viewSource = new DataView$1(this);
	    var viewTarget = new DataView$1(result);
	    var index = 0;

	    while (first < fin) {
	      viewTarget.setUint8(index++, viewSource.getUint8(first++));
	    }

	    return result;
	  }
	});

	var ITERATOR$2 = wellKnownSymbol('iterator');
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

	  iteratorWithReturn[ITERATOR$2] = function () {
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

	    object[ITERATOR$2] = function () {
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

	/* eslint-disable no-new */






	var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

	var ArrayBuffer$1 = global_1.ArrayBuffer;
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
	  return new Int8Array$2(new ArrayBuffer$1(2), 1, undefined).length !== 1;
	});

	var toOffset = function (it, BYTES) {
	  var offset = toInteger(it);
	  if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset');
	  return offset;
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$3] || it['@@iterator'] || iterators[classof(it)];
	};

	var ITERATOR$4 = wellKnownSymbol('iterator');
	var ArrayPrototype$1 = Array.prototype; // check on default Array iterator

	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$4] === it);
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

	var SPECIES$3 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$3]) {
	    defineProperty(Constructor, SPECIES$3, {
	      configurable: true,
	      get: function () {
	        return this;
	      }
	    });
	  }
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

	// `Float32Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects


	typedArrayConstructor('Float32', 4, function (init) {
	  return function Float32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var min$2 = Math.min; // `Array.prototype.copyWithin` method implementation
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
	  var count = min$2((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
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

	var $includes = arrayIncludes.includes;

	var aTypedArray$8 = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes

	arrayBufferViewCore.exportProto('includes', function includes(searchElement
	/* , fromIndex */
	) {
	  return $includes(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $indexOf = arrayIncludes.indexOf;

	var aTypedArray$9 = arrayBufferViewCore.aTypedArray; // `%TypedArray%.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof

	arrayBufferViewCore.exportProto('indexOf', function indexOf(searchElement
	/* , fromIndex */
	) {
	  return $indexOf(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var Uint8Array$1 = global_1.Uint8Array;
	var arrayValues = es_array_iterator.values;
	var arrayKeys = es_array_iterator.keys;
	var arrayEntries = es_array_iterator.entries;
	var aTypedArray$a = arrayBufferViewCore.aTypedArray;
	var exportProto$1 = arrayBufferViewCore.exportProto;
	var nativeTypedArrayIterator = Uint8Array$1 && Uint8Array$1.prototype[ITERATOR$5];
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

	exportProto$1(ITERATOR$5, typedArrayValues, !CORRECT_ITER_NAME);

	var aTypedArray$b = arrayBufferViewCore.aTypedArray;
	var $join = [].join; // `%TypedArray%.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
	// eslint-disable-next-line no-unused-vars

	arrayBufferViewCore.exportProto('join', function join(separator) {
	  return $join.apply(aTypedArray$b(this), arguments);
	});

	var min$3 = Math.min;
	var nativeLastIndexOf = [].lastIndexOf;
	var NEGATIVE_ZERO = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
	var SLOPPY_METHOD$1 = sloppyArrayMethod('lastIndexOf'); // `Array.prototype.lastIndexOf` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof

	var arrayLastIndexOf = NEGATIVE_ZERO || SLOPPY_METHOD$1 ? function lastIndexOf(searchElement
	/* , fromIndex = @[*-1] */
	) {
	  // convert -0 to +0
	  if (NEGATIVE_ZERO) return nativeLastIndexOf.apply(this, arguments) || 0;
	  var O = toIndexedObject(this);
	  var length = toLength(O.length);
	  var index = length - 1;
	  if (arguments.length > 1) index = min$3(index, toInteger(arguments[1]));
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

	// `Array.prototype.{ reduce, reduceRight }` methods implementation


	var createMethod$2 = function (IS_RIGHT) {
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
	  left: createMethod$2(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
	  right: createMethod$2(true)
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
	var floor$1 = Math.floor; // `%TypedArray%.prototype.reverse` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse

	arrayBufferViewCore.exportProto('reverse', function reverse() {
	  var that = this;
	  var length = aTypedArray$g(that).length;
	  var middle = floor$1(length / 2);
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
	var FORCED$2 = fails(function () {
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
	}, FORCED$2);

	var aTypedArray$i = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;
	var $slice = [].slice;
	var FORCED$3 = fails(function () {
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
	}, FORCED$3);

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
	var FORCED$4 = fails(function () {
	  return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
	}) || !fails(function () {
	  Int8Array$3.prototype.toLocaleString.call([1, 2]);
	}); // `%TypedArray%.prototype.toLocaleString` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring

	arrayBufferViewCore.exportProto('toLocaleString', function toLocaleString() {
	  return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$m(this)) : aTypedArray$m(this), arguments);
	}, FORCED$4);

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

	var s;

	var draw = function draw() {
	  for (var _len = arguments.length, points = new Array(_len), _key = 0; _key < _len; _key++) {
	    points[_key] = arguments[_key];
	  }

	  s.push(new Float32Array(points.flat()));
	};

	draw.setSkeleton = function (_s) {
	  s = _s;
	};

	function lerp(v0, v1, t) {
	  return v0 * (1 - t) + v1 * t;
	}

	function interpolateArray(array) {
	  var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	  //Clamp to 0-1 range
	  //alpha = Math.max(Math.min(alpha, 1), 0);
	  var _alpha = (array.length - 1) * alpha; //Get value below and above i


	  var i = Math.floor(_alpha);
	  var j = Math.ceil(_alpha); //Lerp the two values

	  return lerp(array[j], array[i], j - _alpha);
	}

	function interpolateSkeleton (skeleton, alpha) {
	  //alpha = Math.max(Math.min(alpha, 1), 0);
	  var _alpha = (skeleton.length / 3 - 1) * alpha;

	  var i = Math.floor(_alpha);
	  var j = Math.ceil(_alpha);
	  var a = j - _alpha;
	  return [lerp(skeleton[j * 3 + 0], skeleton[i * 3 + 0], a), lerp(skeleton[j * 3 + 1], skeleton[i * 3 + 1], a), lerp(skeleton[j * 3 + 2], skeleton[i * 3 + 2], a)];
	}

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
	var noise$1 = {
	  n1d: function n1d(x) {
	    return noise.noise2D(x, 0);
	  },
	  n2d: function n2d(x, y) {
	    return noise.noise2D(x, y);
	  },
	  n3d: function n3d(x, y, z) {
	    return noise.noise3D(x, y, z);
	  },

	  get seed() {
	    return seed;
	  },

	  set seed(s) {
	    seed = s;
	    noise = new OpenSimplexNoise(seed);
	  }

	};

	// `Uint16Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects


	typedArrayConstructor('Uint16', 2, function (init) {
	  return function Uint16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var $reduce$1 = arrayReduce.left;

	 // `Array.prototype.reduce` method
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

	// `Uint32Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects


	typedArrayConstructor('Uint32', 4, function (init) {
	  return function Uint32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	function join () {
	  for (var _len = arguments.length, geometries = new Array(_len), _key = 0; _key < _len; _key++) {
	    geometries[_key] = arguments[_key];
	  }

	  if (geometries.length === 1) {
	    return geometries[0];
	  }

	  var position = new Float32Array(geometries.reduce(function (a, b) {
	    return a + b.position.length;
	  }, 0));
	  var normal = new Float32Array(geometries.reduce(function (a, b) {
	    return a + b.normal.length;
	  }, 0));
	  var uv = new Float32Array(geometries.reduce(function (a, b) {
	    return a + b.uv.length;
	  }, 0));
	  var indexSize = geometries.reduce(function (a, b) {
	    return a + b.index.length;
	  }, 0);
	  var index = indexSize > 65536 ? new Uint32Array(indexSize) : new Uint16Array(indexSize);
	  var posOffset = 0;
	  var normalOffset = 0;
	  var uvOffset = 0;
	  var indexOffset = 0;

	  for (var i = 0; i < geometries.length; i++) {
	    //Copy normal array
	    var _normal = geometries[i].normal;
	    var normalLength = _normal.length;

	    for (var j = 0; j < normalLength; j++) {
	      normal[normalOffset + j] = _normal[j];
	    }

	    normalOffset += normalLength; //Copy uv array

	    var _uv = geometries[i].uv;
	    var uvLength = _uv.length;

	    for (var _j = 0; _j < uvLength; _j++) {
	      uv[uvOffset + _j] = _uv[_j];
	    }

	    uvOffset += uvLength; //Transfer index

	    var _index = geometries[i].index;
	    var indexLength = _index.length;

	    for (var _j2 = 0; _j2 < indexLength; _j2++) {
	      index[_j2 + indexOffset] = _index[_j2] + posOffset / 3;
	    }

	    indexOffset += indexLength; //Copy position array

	    var _pos = geometries[i].position;
	    var posLength = _pos.length;

	    for (var _j3 = 0; _j3 < posLength; _j3++) {
	      position[posOffset + _j3] = _pos[_j3];
	    }

	    posOffset += posLength;
	  }

	  return {
	    position: position,
	    normal: normal,
	    uv: uv,
	    index: index
	  };
	}

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


	function lerp$1(out, a, b, t) {
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
	    lerp$1(this, this, v, t);
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
	// Not automatic - devs to use these methods manually
	// gl.colorMask( colorMask, colorMask, colorMask, colorMask );
	// gl.clearColor( r, g, b, a );
	// gl.stencilMask( stencilMask );
	// gl.stencilFunc( stencilFunc, stencilRef, stencilMask );
	// gl.stencilOp( stencilFail, stencilZFail, stencilZPass );
	// gl.clearStencil( stencil );


	const tempVec3$1 = new Vec3();
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


	function multiply$2(out, a, b) {
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


	function rotateX$1(out, a, rad) {
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


	function rotateY$1(out, a, rad) {
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


	function rotateZ$1(out, a, rad) {
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
	  let dot$$1 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
	  let invDot = dot$$1 ? 1.0 / dot$$1 : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

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
	    rotateX$1(this, this, a);
	    this.onChange();
	    return this;
	  }

	  rotateY(a) {
	    rotateY$1(this, this, a);
	    this.onChange();
	    return this;
	  }

	  rotateZ(a) {
	    rotateZ$1(this, this, a);
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
	      multiply$2(this, qA, qB);
	    } else {
	      multiply$2(this, this, qA);
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


	function multiply$3(out, a, b) {
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


	function scale$3(out, a, v) {
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


	function rotateX$2(out, a, rad) {
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


	function rotateY$2(out, a, rad) {
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


	function rotateZ$2(out, a, rad) {
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
	    rotateX$2(this, m, v);
	    return this;
	  }

	  rotateY(v, m = this) {
	    rotateY$2(this, m, v);
	    return this;
	  }

	  rotateZ(v, m = this) {
	    rotateZ$2(this, m, v);
	    return this;
	  }

	  scale(v, m = this) {
	    scale$3(this, m, typeof v === "number" ? [v, v, v] : v);
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

	const tmpMat4 = new Mat4();

	const tempMat4 = new Mat4();
	const tempVec3a = new Vec3();
	const tempVec3b = new Vec3();
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


	function add$5(out, a, b) {
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


	function subtract$4(out, a, b) {
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


	function multiply$5(out, a, b) {
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


	function divide$2(out, a, b) {
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


	function scale$5(out, a, b) {
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


	function distance$2(a, b) {
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


	function squaredDistance$2(a, b) {
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


	function length$3(a) {
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


	function squaredLength$3(a) {
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


	function negate$2(out, a) {
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


	function inverse$2(out, a) {
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


	function lerp$3(out, a, b, t) {
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


	function transformMat3$1(out, a, m) {
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


	function transformMat4$2(out, a, m) {
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


	function exactEquals$5(a, b) {
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
	    if (vb) add$5(this, va, vb);else add$5(this, this, va);
	    return this;
	  }

	  sub(va, vb) {
	    if (vb) subtract$4(this, va, vb);else subtract$4(this, this, va);
	    return this;
	  }

	  multiply(v) {
	    if (v.length) multiply$5(this, this, v);else scale$5(this, this, v);
	    return this;
	  }

	  divide(v) {
	    if (v.length) divide$2(this, this, v);else scale$5(this, this, 1 / v);
	    return this;
	  }

	  inverse(v = this) {
	    inverse$2(this, v);
	    return this;
	  } // Can't use 'length' as Array.prototype uses it


	  len() {
	    return length$3(this);
	  }

	  distance(v) {
	    if (v) return distance$2(this, v);else return length$3(this);
	  }

	  squaredLen() {
	    return this.squaredDistance();
	  }

	  squaredDistance(v) {
	    if (v) return squaredDistance$2(this, v);else return squaredLength$3(this);
	  }

	  negate(v = this) {
	    negate$2(this, v);
	    return this;
	  }

	  cross(va, vb) {
	    return cross$1(va, vb);
	  }

	  scale(v) {
	    scale$5(this, this, v);
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
	    return exactEquals$5(this, v);
	  }

	  applyMatrix3(mat3) {
	    transformMat3$1(this, this, mat3);
	    return this;
	  }

	  applyMatrix4(mat4) {
	    transformMat4$2(this, this, mat4);
	    return this;
	  }

	  lerp(v, a) {
	    lerp$3(this, this, v, a);
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
	const tempVec3$2 = new Vec3();
	const tempVec2a = new Vec2();
	const tempVec2b = new Vec2();


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

	var lastNormal;
	function calculateNormals (geometry) {
	  var position = geometry.position;
	  var index = geometry.index;
	  var normals = geometry.normal; //Calculate normals per face
	  //Process 3 vertices at a time

	  /*let vA, vB, vC;
	  const cb = new Vec3();
	  const ab = new Vec3();
	    const fl = index.length / 9;
	  for (let f = 0; f < fl; f++) {
	    vA = new Vec3(position[index[f * 9 + 0]], position[index[f * 9 + 1]], position[index[f * 9 + 2]]);
	      vB = new Vec3(position[index[f * 9 + 3]], position[index[f * 9 + 4]], position[index[f * 9 + 5]]);
	      vC = new Vec3(position[index[f * 9 + 6]], position[index[f * 9 + 7]], position[index[f * 9 + 8]]);
	  
	    cb.cross(vC.sub(vB), vA.sub(vB));
	      normals[index[f * 9 + 0]] = cb[0];
	    normals[index[f * 9 + 1]] = cb[1];
	    normals[index[f * 9 + 2]] = cb[2];
	      normals[index[f * 9 + 3]] = cb[3];
	    normals[index[f * 9 + 4]] = cb[4];
	    normals[index[f * 9 + 5]] = cb[5];
	      normals[index[f * 9 + 6]] = cb[6];
	    normals[index[f * 9 + 7]] = cb[7];
	    normals[index[f * 9 + 8]] = cb[8];
	  }*/

	  for (var i = 0; i < index.length / 3; i++) {
	    var v1 = new Vec3(position[index[i * 3 + 0] * 3 + 0], position[index[i * 3 + 0] * 3 + 1], position[index[i * 3 + 0] * 3 + 2]);
	    var v2 = new Vec3(position[index[i * 3 + 1] * 3 + 0] - v1.x, position[index[i * 3 + 1] * 3 + 1] - v1.y, position[index[i * 3 + 1] * 3 + 2] - v1.z);
	    var v3 = new Vec3(position[index[i * 3 + 2] * 3 + 0] - v1.x, position[index[i * 3 + 2] * 3 + 1] - v1.y, position[index[i * 3 + 2] * 3 + 2] - v1.z);
	    var normal = new Vec3().cross(v2, v3).normalize();

	    if (normal[0] === 0 && normal[1] === 0 && normal[3] === 0) {
	      normal = lastNormal;
	    }

	    for (var j = 0; j < 3; j++) {
	      normals[index[i * 3 + j] * 3 + 0] = normal.x;
	      normals[index[i * 3 + j] * 3 + 1] = normal.y;
	      normals[index[i * 3 + j] * 3 + 2] = normal.z;
	    }

	    lastNormal = normal;
	  }

	  return geometry;
	}

	/*
	  Javascript version of:  
	  http://paulbourke.net/geometry/rotate/source.c
	  
	*/

	/*
	   Rotate a point p by angle theta around an arbitrary axis r
	   Return the rotated point.
	   Positive angles are anticlockwise looking down the axis
	   towards the origin.
	   Assume right hand coordinate system.
	*/

	function arbitraryRotate(point, theta, axis) {
	  axis.normalize();
	  var costheta = Math.cos(theta);
	  var sintheta = Math.sin(theta);
	  return new Vec3((costheta + (1 - costheta) * axis[0] * axis[0]) * point[0] + ((1 - costheta) * axis[0] * axis[1] - axis[2] * sintheta) * point[1] + ((1 - costheta) * axis[0] * axis[2] + axis[1] * sintheta) * point[2], ((1 - costheta) * axis[0] * axis[1] + axis[2] * sintheta) * point[0] + (costheta + (1 - costheta) * axis[1] * axis[1]) * point[1] + ((1 - costheta) * axis[1] * axis[2] - axis[0] * sintheta) * point[2], ((1 - costheta) * axis[0] * axis[2] - axis[1] * sintheta) * point[0] + ((1 - costheta) * axis[1] * axis[2] + axis[0] * sintheta) * point[1] + (costheta + (1 - costheta) * axis[2] * axis[2]) * point[2]);
	}

	function getStart(origin, axis) {
	  if (origin[0] === 0 && origin[2] === 0) {
	    return new Vec3(0, 0, 1);
	  } else {
	    return new Vec3().cross(origin, axis).normalize();
	  }
	}

	function ring (origin, axis, radius) {
	  var resolution = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 3;
	  var testVec = arguments.length > 4 ? arguments[4] : undefined;
	  axis.normalize(); //General parameters

	  var positionAmount = resolution * 3;
	  var angle = 360 * (Math.PI / 180) / resolution; // Convert to radians
	  //Final model

	  var position = new Float32Array(positionAmount);
	  var x = origin[0];
	  var y = origin[1];
	  var z = origin[2];
	  var start = getStart(origin, axis).multiply(radius);

	  for (var i = 0; i < resolution; i++) {
	    var _angle = angle * i;

	    var v = arbitraryRotate(start, _angle, testVec || axis);
	    position[i * 3 + 0] = x + v[0];
	    position[i * 3 + 1] = y + v[1];
	    position[i * 3 + 2] = z + v[2];
	  }

	  return position;
	}

	function mergeRings(rings, position) {
	  var offset = 0;
	  var l = rings.length;

	  for (var i = 0; i < l; i++) {
	    var r = rings[i];
	    var _l = r.length;

	    for (var j = 0; j < _l; j++) {
	      position[offset + j] = r[j];
	    }

	    offset += _l;
	  }
	}

	function tube (skeleton, diameter, resX) {
	  var resY = skeleton.length / 3;
	  var numPosition = resY * resX * 3;
	  var numIndices = resY * resX * 6 - resX * 6;
	  var numUV = resY * resX * 2;
	  var position = new Float32Array(numPosition);
	  var normal = new Float32Array(numPosition);
	  var uv = new Float32Array(numUV);
	  var index = numIndices > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
	  var rings = []; //Create all rings

	  var l = resY;

	  for (var i = 0; i < l; i++) {
	    var _diameter = interpolateArray(diameter, 1 - i / (l - 1)); //Current point along line


	    var currentPoint = new Vec3(skeleton[i * 3 + 0], skeleton[i * 3 + 1], skeleton[i * 3 + 2]);

	    if (i === 0) {
	      var _i = 1; //Get average of previous segment and next segment

	      var avg = new Vec3((currentPoint[0] - skeleton[_i * 3 + 3] - (skeleton[_i * 3 - 3] - currentPoint[0])) / 2, (currentPoint[1] - skeleton[_i * 3 + 4] - (skeleton[_i * 3 - 2] - currentPoint[1])) / 2, (currentPoint[2] - skeleton[_i * 3 + 5] - (skeleton[_i * 3 - 1] - currentPoint[2])) / 2);
	      var v2 = new Vec3((skeleton[_i * 3 + 3] - skeleton[_i * 3 - 3]) / 2, (skeleton[_i * 3 + 4] - skeleton[_i * 3 - 2]) / 2, (skeleton[_i * 3 + 5] - skeleton[_i * 3 - 1]) / 2);
	      rings[0] = ring(currentPoint, avg, -_diameter, resX, v2);
	    } else if (i < l - 1) {
	      //Get average of previous segment and next segment
	      var _avg = new Vec3((currentPoint[0] - skeleton[i * 3 + 3] - (skeleton[i * 3 - 3] - currentPoint[0])) / 2, (currentPoint[1] - skeleton[i * 3 + 4] - (skeleton[i * 3 - 2] - currentPoint[1])) / 2, (currentPoint[2] - skeleton[i * 3 + 5] - (skeleton[i * 3 - 1] - currentPoint[2])) / 2);

	      var _v = new Vec3((skeleton[i * 3 + 3] - skeleton[i * 3 - 3]) / 2, (skeleton[i * 3 + 4] - skeleton[i * 3 - 2]) / 2, (skeleton[i * 3 + 5] - skeleton[i * 3 - 1]) / 2);

	      rings[i] = ring(currentPoint, _avg, _diameter, resX, _v);
	    } else {
	      var prevSegment = new Vec3(currentPoint[0] - skeleton[i * 3 - 3], currentPoint[1] - skeleton[i * 3 - 2], currentPoint[2] - skeleton[i * 3 - 1]);
	      rings[i] = ring(currentPoint, prevSegment, _diameter, resX);
	    }
	  }

	  mergeRings(rings, position); //Create the indeces

	  for (var _i2 = 0; _i2 < resY; _i2++) {
	    var indexOffset = _i2 * resX * 6;
	    var positionOffset = _i2 * resX;

	    for (var j = 0; j < resX; j++) {
	      var _indexOffset = indexOffset + j * 6;

	      var _positionOffset = positionOffset + j;

	      if (j === resX - 1) {
	        index[_indexOffset + 0] = _positionOffset;
	        index[_indexOffset + 1] = _positionOffset - resX + 1;
	        index[_indexOffset + 2] = _positionOffset + 1;
	        index[_indexOffset + 3] = _positionOffset + 1;
	        index[_indexOffset + 4] = _positionOffset + resX;
	        index[_indexOffset + 5] = _positionOffset;
	      } else {
	        index[_indexOffset + 0] = _positionOffset;
	        index[_indexOffset + 1] = _positionOffset + 1;
	        index[_indexOffset + 2] = _positionOffset + resX + 1;
	        index[_indexOffset + 3] = _positionOffset + resX + 1;
	        index[_indexOffset + 4] = _positionOffset + resX;
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

	var skeleton;
	var toRadian = Math.PI / 180;

	function getStemSize(size, i) {
	  if ("variation" in size) {
	    return size.value - size.value * size.variation * ((noise$1.n1d(12312 + i * 400) + 1) / 2);
	  } else {
	    return size.value;
	  }
	}

	function getOriginAngle(h, i) {
	  if ("variation" in h) {
	    return h.value * toRadian + h.value * toRadian * noise$1.n1d(531723 + i * 200) * h.variation;
	  } else {
	    return h.value * toRadian;
	  }
	}

	function getOriginRotation(h, i, amount) {
	  if ("variation" in h) {
	    return h.value * (i / amount) * toRadian + noise$1.n1d(31231 + i * 300) * h.variation * toRadian;
	  } else {
	    return h.value * (i / amount) * toRadian;
	  }
	}

	function getOriginPosition(pos, i) {
	  if ("variation" in pos) {
	    return [pos.value + noise$1.n1d(15092 + i * 512) * pos.variation, 0, 0];
	  } else {
	    return [pos.value, 0, 0];
	  }
	}

	function getOrigin(rot, pos, i, amount) {
	  var origin = getOriginPosition(pos, i);
	  var rotation = getOriginRotation(rot, i, amount);
	  var x = Math.cos(rotation) * origin[0] - Math.sin(rotation) * origin[2];
	  var y = origin[1];
	  var z = Math.sin(rotation) * origin[0] + Math.cos(rotation) * origin[2];
	  return [-x, y, z];
	}

	function getNoiseStrength(noise) {
	  if (noise.curve && noise.curve.length) {
	    return curveToArray(noise.curve);
	  } else {
	    return [0, 1];
	  }
	}

	function createStemSkeleton (stem, settings, i, stemAmount) {
	  //Check if we need to regenerate else return cached skeleton

	  /*const newDescription = JSON.stringify(stem);
	  if (!settings.forceUpdate && oldDescription === newDescription && skeleton.length) {
	    return skeleton;
	  }*/
	  var amountPoints = settings.stemResY || 20;
	  skeleton = new Float32Array(amountPoints * 3);
	  var stemsize = getStemSize(stem.size, i);
	  var origin = getOrigin(stem.originRotation, stem.originOffset, i, stemAmount);
	  var originAngle = getOriginAngle(stem.originAngle, i);
	  var XYRotation = getOriginRotation(stem.originRotation, i, stemAmount);
	  var gravity = (stem.gravity || 0) * Math.PI * 0.5;
	  var noiseScale = stem.noiseScale || 1;
	  var noiseStrength = stem.noiseStrength.value || 0;
	  var noiseStrengthCurve = getNoiseStrength(stem.noiseStrength);

	  for (var j = 0; j < amountPoints; j++) {
	    var a = j / amountPoints; //Create point

	    var x = origin[0];
	    var y = a * stemsize;
	    var z = origin[2];

	    if (noiseStrength) {
	      x += noise$1.n1d(2312312 + a * noiseScale + i * 100) * interpolateArray(noiseStrengthCurve, a) * noiseStrength;
	      z += noise$1.n1d(92538165 + a * noiseScale + i * 100) * interpolateArray(noiseStrengthCurve, a) * noiseStrength;
	    } //Apply gravity


	    var gravityAngle = gravity * a + originAngle;

	    var _x = Math.cos(gravityAngle) * (x - origin[0]) - Math.sin(gravityAngle) * (y - origin[1]) + origin[0];

	    var _y = Math.sin(gravityAngle) * (x - origin[0]) + Math.cos(gravityAngle) * (y - origin[1]) + origin[1];

	    var _z = z; //Apply rotation on the XZ Plane

	    var __x = Math.cos(-XYRotation) * (_x - origin[0]) - Math.sin(-XYRotation) * (_z - origin[2]) + origin[0];

	    var __y = _y;

	    var __z = Math.sin(-XYRotation) * (_x - origin[0]) + Math.cos(-XYRotation) * (_z - origin[2]) + origin[2];

	    skeleton[j * 3 + 0] = __x;
	    skeleton[j * 3 + 1] = __y;
	    skeleton[j * 3 + 2] = __z;
	  }

	  return skeleton;
	}

	function getStemDiameter(diameter, i) {
	  var v = 0.1;

	  if ("variation" in diameter) {
	    v = diameter.value - diameter.value * diameter.variation * ((noise$1.n1d(93815 + i * 200) + 1) / 2);
	  } else {
	    v = diameter.value;
	  }

	  if (diameter.curve && diameter.curve.length) {
	    return curveToArray(diameter.curve).map(function (_v) {
	      return v * _v;
	    });
	  } else {
	    return [0, 1 * v];
	  }
	}

	function createStemGeometry (stem, settings, skeleton, i) {
	  //Check if we need to regenerate

	  /*const newDescription = JSON.stringify(stem);
	  if (!settings.forceUpdate && oldDescription === newDescription && geometry) {
	    return geometry;
	  }*/
	  var diameter = getStemDiameter(stem.diameter, i);
	  var resX = settings.stemResX || 3;
	  return tube(skeleton, diameter, resX);
	}

	function getLowestBranch(param, i) {
	  if ("variation" in param) {
	    return param.value - param.value * param.variation * noise$1.n1d(931852 + i * 600);
	  } else {
	    return param.value;
	  }
	}

	function getBranchLengthArray(length) {
	  var v = length.value;

	  if (length.curve) {
	    return curveToArray(length.curve).map(function (_v) {
	      return v * _v;
	    });
	  } else {
	    return [0, v];
	  }
	}

	function getArrayFromParam(param) {
	  var v = param.value;

	  if (param.curve) {
	    return curveToArray(param.curve).map(function (_v, i, a) {
	      return v + _v - i / (a.length - 1);
	    });
	  } else {
	    return [v];
	  }
	}

	function createBranchSkeleton (branch, skeleton, i) {
	  var branches = [];
	  var branchAmount = branch.amount || 3;
	  var gravity = branch.gravity || 0;
	  var lowestBranch = getLowestBranch(branch.lowestBranch, i);
	  var branchLengthArray = getBranchLengthArray(branch.length);
	  var branchLengthVariation = branch.length.variation || 0;
	  var branchOffset = branch.offset.value || 0;
	  var branchOffsetVariation = branch.offset.variation || 0;
	  var branchAngleArray = getArrayFromParam(branch.angle);
	  var branchAngleVariation = branch.angle.variation || 0;
	  var branchRotation = branch.rotation.value || 0;
	  var branchRotationVariation = branch.rotation.variation || 0;
	  var branchNoiseStrengthArray = getArrayFromParam(branch.noiseStrength);
	  var branchNoiseStrength = branch.noiseStrength.value;
	  var branchNoiseScale = branch.noiseScale || 1;
	  var branchDistance = (1 - lowestBranch) / branchAmount;
	  var skeletonLength = skeleton.length / 3;

	  for (var j = 0; j < branchAmount; j++) {
	    var a = j / branchAmount;
	    var switchSide = j % 2 === 0; //Compute branch length

	    var length = interpolateArray(branchLengthArray, 1 - a);

	    if (branchLengthVariation) {
	      length -= length * branchLengthVariation * ((noise$1.n1d(341341 + j * 123969) + 1) / 2);
	    } //Compute position along stem


	    var positionAlongStem = lowestBranch + j * branchDistance;

	    if (branchOffsetVariation) {
	      positionAlongStem -= branchDistance * branchOffsetVariation * noise$1.n1d(92584 + j * 198);
	    }

	    if (switchSide) {
	      positionAlongStem += (1 - branchOffset) * branchDistance;
	    } //Point along stem


	    var origin = new Vec3().fromArray(interpolateSkeleton(skeleton, positionAlongStem)); //Get previos and next stem segment

	    var p = Math.max(Math.min(Math.floor(skeletonLength * positionAlongStem), skeletonLength - 3), 1);
	    var n = Math.max(Math.min(Math.ceil(skeletonLength * positionAlongStem), skeletonLength - 2), 1);
	    var prevSegment = new Vec3(origin[0] - skeleton[p * 3 - 3], origin[1] - skeleton[p * 3 - 2], origin[2] - skeleton[p * 3 - 1]);
	    var nextSegment = new Vec3(skeleton[n * 3 + 3] - origin[0], skeleton[n * 3 + 4] - origin[1], skeleton[n * 3 + 5] - origin[2]);
	    var average = new Vec3((prevSegment[0] + nextSegment[0]) / 2, (prevSegment[1] + nextSegment[1]) / 2, (prevSegment[2] + nextSegment[2]) / 2);
	    var offsetVec = new Vec3().cross(prevSegment, nextSegment).normalize();
	    var rotationAxis = new Vec3().cross(average, offsetVec);
	    var branchAngle = interpolateArray(branchAngleArray, a) * Math.PI;

	    if (branchAngleVariation) {
	      branchAngle -= branchAngle * branchAngleVariation * noise$1.n1d(896217392 + j * 123) * Math.PI;
	    }

	    var _branchRotation = branchRotation * j;

	    if (branchRotationVariation) {
	      _branchRotation -= branchRotationVariation * noise$1.n1d(896217392 + j * 123) * Math.PI;
	    }

	    var amountPoints = 3 + Math.floor(skeletonLength * length * 0.5);
	    branches[j] = new Float32Array(amountPoints * 3);

	    for (var k = 0; k < amountPoints; k++) {
	      var _a = k / (amountPoints - 1); //Create the basic point


	      var x = offsetVec[0] * (switchSide ? -length : length) * _a;
	      var y = offsetVec[1] * (switchSide ? -length : length) * _a;
	      var z = offsetVec[2] * (switchSide ? -length : length) * _a;

	      if (branchNoiseStrength) {
	        x += _a * (noise$1.n1d(2312312 + _a * branchNoiseScale + i * 100 + j * 100) * interpolateArray(branchNoiseStrengthArray, _a) * branchNoiseStrength);
	        y += _a * (noise$1.n1d(92538165 + _a * branchNoiseScale + i * 100 + j * 100) * interpolateArray(branchNoiseStrengthArray, _a) * branchNoiseStrength);
	        z += _a * (noise$1.n1d(5126126 + _a * branchNoiseScale + i * 100 + j * 100) * interpolateArray(branchNoiseStrengthArray, _a) * branchNoiseStrength);
	      } //Apply angle rotation


	      var pos = arbitraryRotate(new Vec3(x, y, z), switchSide ? branchAngle : -branchAngle, rotationAxis); //Apply rotation around stem

	      var _pos = arbitraryRotate(pos, _branchRotation, average); //Apply gravity; (sine wave for now, rotating around average would look nicer)


	      var curlBack = 1 - _a * 0.5 * gravity;

	      var __x = _pos[0] * curlBack;

	      var __y = _pos[1] + Math.sin(_a * Math.PI * 0.5 + Math.PI * 0.5) * gravity - gravity;

	      var __z = _pos[2] * curlBack;

	      branches[j][k * 3 + 0] = origin[0] + __x;
	      branches[j][k * 3 + 1] = origin[1] + __y;
	      branches[j][k * 3 + 2] = origin[2] + __z;
	    } //const element = array[i];

	  }

	  return branches;
	}

	var quot = /"/g; // B.2.3.2.1 CreateHTML(string, tag, attribute, value)
	// https://tc39.github.io/ecma262/#sec-createhtml

	var createHtml = function (string, tag, attribute, value) {
	  var S = String(requireObjectCoercible(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};

	// check the existence of a method, lowercase
	// of a tag and escaping quotes in arguments


	var forcedStringHtmlMethod = function (METHOD_NAME) {
	  return fails(function () {
	    var test = ''[METHOD_NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  });
	};

	// `String.prototype.sub` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.sub


	_export({
	  target: 'String',
	  proto: true,
	  forced: forcedStringHtmlMethod('sub')
	}, {
	  sub: function sub() {
	    return createHtml(this, 'sub', '', '');
	  }
	});

	function mergeRings$1(rings, position) {
	  var offset = 0;
	  var l = rings.length;

	  for (var i = 0; i < l; i++) {
	    var r = rings[i];
	    var _l = r.length;

	    for (var j = 0; j < _l; j++) {
	      position[offset + j] = r[j];
	    }

	    offset += _l;
	  }
	}

	function tube$1 (skeleton, diameter, resX) {
	  var resY = skeleton.length / 3;
	  var numPosition = resY * resX * 3;
	  var numIndices = resY * resX * 6 - resX * 6;
	  var numUV = resY * resX * 2;
	  var position = new Float32Array(numPosition);
	  var normal = new Float32Array(numPosition);
	  var uv = new Float32Array(numUV);
	  var index = numIndices > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
	  var rings = []; //Create all rings

	  var axis;

	  for (var i = 0; i < resY; i++) {
	    var _diameter = interpolateArray(diameter, 1 - i / (resY - 1)); //Current point along line


	    var origin = new Vec3(skeleton[i * 3 + 0], skeleton[i * 3 + 1], skeleton[i * 3 + 2]);

	    if (i < resY - 1) {
	      //Next point along line
	      var next = new Vec3(skeleton[i * 3 + 3], skeleton[i * 3 + 4], skeleton[i * 3 + 5]);
	      axis = next.sub(origin);
	      rings[i] = ring(origin, axis, _diameter, resX);
	    } else {
	      rings[i] = ring(origin, axis, _diameter, resX);
	    }
	  }

	  mergeRings$1(rings, position); //Create the indeces

	  for (var _i = 0; _i < resY; _i++) {
	    var indexOffset = _i * resX * 6;
	    var positionOffset = _i * resX;

	    for (var j = 0; j < resX; j++) {
	      var _indexOffset = indexOffset + j * 6;

	      var _positionOffset = positionOffset + j;

	      if (j === resX - 1) {
	        index[_indexOffset + 0] = _positionOffset;
	        index[_indexOffset + 1] = _positionOffset - resX + 1;
	        index[_indexOffset + 2] = _positionOffset + 1;
	        index[_indexOffset + 3] = _positionOffset + 1;
	        index[_indexOffset + 4] = _positionOffset + resX;
	        index[_indexOffset + 5] = _positionOffset;
	      } else {
	        index[_indexOffset + 0] = _positionOffset;
	        index[_indexOffset + 1] = _positionOffset + 1;
	        index[_indexOffset + 2] = _positionOffset + resX + 1;
	        index[_indexOffset + 3] = _positionOffset + resX + 1;
	        index[_indexOffset + 4] = _positionOffset + resX;
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

	function getBranchDiameter(diameter, stemDiameter, i) {
	  var v = 0.1;

	  if ("variation" in stemDiameter) {
	    v = diameter.value - diameter.value * stemDiameter.variation * ((noise$1.n1d(93815 + i * 200) + 1) / 2);
	  } else {
	    v = diameter.value;
	  }

	  if (diameter.curve && diameter.curve.length) {
	    return curveToArray(diameter.curve).map(function (_v) {
	      return v * _v * stemDiameter.value;
	    });
	  } else {
	    return [0.0001, v * stemDiameter.value];
	  }
	}

	function createBranchGeometry (pd, settings, skeletons, i) {
	  //Check if we need to regenerate

	  /*const newDescription = JSON.stringify(pd);
	  if (!settings.forceUpdate && oldDescription === newDescription && geometry) {
	    return geometry;
	  }*/
	  var diameter = getBranchDiameter(pd.branches.diameter, pd.stem.diameter, i);
	  var amount = skeletons.length;
	  var resX = settings.stemResX || 3;
	  var lowestBranch = pd.branches.lowestBranch.value || 0;
	  return join.apply(void 0, _toConsumableArray(skeletons.map(function (skeleton, i) {
	    return tube$1(skeleton, diameter.map(function (v) {
	      return v * ((1 - i / amount) * (1 - lowestBranch));
	    }), resX);
	  })));
	}

	function getCurvatureArray(param) {
	  if (param.curve && param.curve.length > 2) {
	    return curveToArray(param.curve).map(function (v, i, a) {
	      return (v - 1 * (i / a.length)) * 0.2;
	    });
	  } else {
	    return [0, 0];
	  }
	}

	function getSizeArray(param) {
	  if (param.curve && param.curve.length > 2) {
	    return curveToArray(param.curve).map(function (v, i, a) {
	      return param.value * (v - 1 * (i / a.length - 1));
	    });
	  } else {
	    return [param.value];
	  }
	}

	function createLeaves (leaf, settings, branchSkeletons, stemSkeletons) {
	  var leafPoints = leaf.shape;
	  var leafPointsAmount = leaf.shape.length;
	  var leafRes = settings.leafResX || 5; //////////////////////////
	  //-Create leaf Geometry-//
	  //////////////////////////

	  var uv = new Float32Array(leafPointsAmount * leafRes * 2);
	  var position = new Float32Array(leafPointsAmount * leafRes * 3);
	  var normal = new Float32Array(leafPointsAmount * leafRes * 3);
	  var index = new Uint16Array((leafPointsAmount - 1) * (leafRes - 1) * 6);
	  var yCurvatureArray = getCurvatureArray(leaf.yCurvature);
	  var yCurvatureStrength = leaf.yCurvature.value;
	  var gravity = leaf.gravity || 0;
	  var xCurvatureArray = getCurvatureArray(leaf.xCurvature);
	  var xCurvatureStrength = leaf.xCurvature.value; //Create all the points

	  for (var i = 0; i < leafPointsAmount; i++) {
	    var p = leafPoints[i];

	    var _a = i / (leafPointsAmount - 1);

	    for (var j = 0; j < leafRes; j++) {
	      var a = -1 * (j / (leafRes - 1) * 2 - 1);

	      var _offset2 = i * 3 * leafRes + j * 3;

	      var x = a * p.x * 0.5;
	      var y = interpolateArray(yCurvatureArray, _a) * yCurvatureStrength + interpolateArray(xCurvatureArray, Math.abs(a)) * xCurvatureStrength * Math.sin(Math.abs(_a) * Math.PI);
	      var z = p.y;
	      var gravityAngle = _a * _a * gravity;
	      var curlBack = 1 - _a * 0.2 * gravity;
	      var _x = x;

	      var _y = (Math.cos(gravityAngle) * y - Math.sin(gravityAngle) * z) * curlBack;

	      var _z = (Math.sin(gravityAngle) * y + Math.cos(gravityAngle) * z) * curlBack;

	      position[_offset2 + 0] = _x;
	      position[_offset2 + 1] = _y;
	      position[_offset2 + 2] = _z;
	      normal[_offset2 + 0] = _a;
	      normal[_offset2 + 1] = 1 - _a;
	      normal[_offset2 + 2] = 0;
	      var uvOffset = i * 2 * leafRes + j * 2;
	      uv[uvOffset + 0] = p.x * a * -0.5 - 0.5;
	      uv[uvOffset + 1] = p.y;
	    }
	  } //Create the indeces


	  var segmentAmount = leafPointsAmount - 1;
	  var facesPerSegment = leafRes - 1;

	  for (var _i = 0; _i < segmentAmount; _i++) {
	    for (var _j = 0; _j < facesPerSegment; _j++) {
	      var _o = _i * facesPerSegment * 6 + _j * 6;

	      var o = _i * leafRes + _j;
	      index[_o + 0] = o;
	      index[_o + 1] = o + 1;
	      index[_o + 2] = o + 1 + leafRes;
	      index[_o + 3] = o + 1 + leafRes;
	      index[_o + 4] = o + leafRes;
	      index[_o + 5] = o;
	    }
	  } //////////////////////
	  //-Create instances-//
	  //////////////////////


	  var leafAmount = leaf.amount || 3;
	  var lowestLeaf = leaf.lowestLeaf || 0;
	  var leafDistance = (1 - lowestLeaf) / (leafAmount - 1);
	  var onStem = !!leaf.onStem;
	  var onBranches = !!leaf.onBranches;
	  var leafAngle = leaf.angle.value || 0;
	  var leafAngleArray = getSizeArray(leaf.angle);
	  var leafAngleVariation = leaf.angle.variation || 0;
	  var leafRotation = leaf.rotation.value || 0;
	  var leafRotationVariation = leaf.rotation.variation || 0;
	  var leafOffset = leaf.offset.value || 0;
	  var leafOffsetVariation = leaf.offset.variation || 0;
	  var leafSizeArray = getSizeArray(leaf.size);
	  var leafSizeVariation = leaf.size.variation || 0;
	  var instanceCount = (onStem ? stemSkeletons.length : 0) * leafAmount + (onBranches ? branchSkeletons.flat().length : 0) * leafAmount;
	  var offset = new Float32Array(instanceCount * 3);
	  var scale = new Float32Array(instanceCount * 3);
	  var rotation = new Float32Array(instanceCount * 3);
	  var dirVec = new Vec3(0, 0, 1);
	  var _offset = 0;
	  var stemAmount = stemSkeletons.length;

	  for (var _i2 = 0; _i2 < stemAmount; _i2++) {
	    if (onStem) {
	      var stemSkeleton = stemSkeletons[_i2];
	      var amountPoints = stemSkeleton.length / 3;

	      for (var k = 0; k < leafAmount; k++) {
	        var switchSide = k % 2 === 0;
	        var alpha = k / (leafAmount - 1);
	        var positionAlongStem = 1 - k * leafDistance - (switchSide ? (leafOffset - 1) * leafDistance : 0) * 4;

	        if (leafOffsetVariation) {
	          positionAlongStem -= leafDistance * 2 * noise$1.n1d(123123923 + k * 2324 + _i2 * 24124) * leafOffsetVariation;
	        }

	        var origin = new Vec3().fromArray(interpolateSkeleton(stemSkeleton, positionAlongStem));

	        var _alpha = (amountPoints - 1) * alpha; //Get previous and next stem segment


	        var _p = Math.floor(_alpha);

	        var n = Math.ceil(_alpha);
	        var prev = new Vec3(stemSkeleton[_p * 3 + 0], stemSkeleton[_p * 3 + 1], stemSkeleton[_p * 3 + 2]);
	        var next = new Vec3(stemSkeleton[n * 3 + 0], stemSkeleton[n * 3 + 1], stemSkeleton[n * 3 + 2]);
	        offset[_offset + 0] = origin[0];
	        offset[_offset + 1] = origin[1];
	        offset[_offset + 2] = origin[2];

	        var _leafSize = interpolateArray(leafSizeArray, 1 - alpha);

	        var s = _leafSize * alpha * (1 - k / (leafAmount - 1));

	        if (leafSizeVariation) {
	          s -= s * ((noise$1.n1d(1297213 + k * 123 + _i2 * 942) + 1) / 2) * leafSizeVariation;
	        }

	        scale[_offset + 0] = s;
	        scale[_offset + 1] = s;
	        scale[_offset + 2] = s;

	        var _next = next.clone().sub(prev);

	        _next[1] = 0;

	        _next.normalize();

	        var rotY = dirVec.angle(_next) * (_next.x > 0 ? 1 : -1);

	        if (leafAngleVariation) {
	          rotY -= rotY * noise$1.n1d(1297213 + k * 123 + _i2 * 942) * leafAngleVariation * 2;
	        }

	        var _leafRotation = leafRotation;

	        if (leafRotationVariation) {
	          _leafRotation -= _leafRotation * noise$1.n1d(1297213 + k * 123 + _i2 * 942) * leafRotationVariation;
	        }

	        var _leafAngle = interpolateArray(leafAngleArray, alpha);

	        rotation[_offset + 0] = _leafRotation;
	        rotation[_offset + 1] = rotY + (switchSide ? _leafAngle : -_leafAngle);
	        rotation[_offset + 2] = 0;
	        _offset += 3;
	      }
	    } //Create leaves along branch


	    if (onBranches) {
	      var _branchSkeletons = branchSkeletons[_i2];
	      var branchAmount = _branchSkeletons.length;

	      for (var _j2 = 0; _j2 < branchAmount; _j2++) {
	        var branchSkeleton = _branchSkeletons[_j2];

	        var _amountPoints = branchSkeleton.length / 3;

	        for (var _k = 0; _k < leafAmount - 1; _k++) {
	          var _switchSide = _k % 2 === 0;

	          var _alpha2 = _k / (leafAmount - 1);

	          var _positionAlongStem = 1 - _k * leafDistance - (_switchSide ? (leafOffset - 1) * leafDistance : 0) * 4;

	          if (leafOffsetVariation) {
	            _positionAlongStem -= leafDistance * 2 * noise$1.n1d(123123923 + _k * 2324 + _i2 * 24124) * leafOffsetVariation;
	          }

	          var _origin = new Vec3().fromArray(interpolateSkeleton(branchSkeleton, _positionAlongStem));

	          var _alpha3 = (_amountPoints - 1) * _alpha2; //Get previous and next stem segment


	          var _p2 = Math.floor(_alpha3);

	          var _n = Math.ceil(_alpha3);

	          var _prev = new Vec3(branchSkeleton[_p2 * 3 + 0], branchSkeleton[_p2 * 3 + 1], branchSkeleton[_p2 * 3 + 2]);

	          var _next2 = new Vec3(branchSkeleton[_n * 3 + 0], branchSkeleton[_n * 3 + 1], branchSkeleton[_n * 3 + 2]);

	          offset[_offset + 0] = _origin[0];
	          offset[_offset + 1] = _origin[1];
	          offset[_offset + 2] = _origin[2];

	          var _leafSize2 = interpolateArray(leafSizeArray, 1 - _alpha2);

	          var _s = _leafSize2 * _alpha2 * (1 - _j2 / (branchAmount - 1));

	          if (leafSizeVariation) {
	            _s -= _s * ((noise$1.n1d(1297213 + _k * 123 + _i2 * 942) + 1) / 2) * leafSizeVariation;
	          }

	          scale[_offset + 0] = _s;
	          scale[_offset + 1] = _s;
	          scale[_offset + 2] = _s;

	          var _next3 = _next2.clone().sub(_prev);

	          _next3[1] = 0;

	          _next3.normalize();

	          var _rotY = dirVec.angle(_next3) * (_next3.x > 0 ? 1 : -1);

	          if (leafAngleVariation) {
	            _rotY -= _rotY * noise$1.n1d(1297213 + _k * 123 + _i2 * 942) * leafAngleVariation * 2;
	          }

	          var _leafRotation2 = leafRotation;

	          if (leafRotationVariation) {
	            _leafRotation2 -= _leafRotation2 * noise$1.n1d(1297213 + _k * 123 + _i2 * 942) * leafRotationVariation;
	          }

	          var _leafAngle2 = interpolateArray(leafAngleArray, _alpha2);

	          rotation[_offset + 0] = _leafRotation2;
	          rotation[_offset + 1] = _rotY + (_switchSide ? _leafAngle2 : -_leafAngle2);
	          rotation[_offset + 2] = 0;
	          _offset += 3;
	        }
	      }
	    }
	  }

	  return {
	    position: position,
	    normal: normal,
	    uv: uv,
	    index: index,
	    offset: offset,
	    rotation: rotation,
	    scale: scale
	  };
	}

	var debugLines = [];
	draw.setSkeleton(debugLines);

	var Generator =
	/*#__PURE__*/
	function () {
	  function Generator() {
	    _classCallCheck(this, Generator);
	  }

	  _createClass(Generator, [{
	    key: "generate",
	    value: function generate(pd, settings) {
	      //If the settings change force regeneration of all parts

	      /*const newSettings = JSON.stringify(settings);
	      settings.forceUpdate = oldSettings !== newSettings;
	      oldSettings = newSettings;*/
	      //Load seed from settings
	      if (settings.useRandomSeed === true) {
	        noise$1.seed = Math.floor(Math.random() * 100000);
	      } else if (typeof settings.seed === "number") {
	        noise$1.seed = settings.seed;
	      }

	      var skeletons = [];
	      var leaf;
	      var branchSkeletons = []; //Create the stem skeletons

	      debugLines.length = 0;
	      var stemSkeletons = new Array(pd.stem.amount).fill(null).map(function (v, i) {
	        return createStemSkeleton(pd.stem, settings, i, pd.stem.amount);
	      }); //Create the stem geometries from the stem skeletons

	      var stemGeometries = stemSkeletons.map(function (skeleton, i) {
	        return createStemGeometry(pd.stem, settings, skeleton, i);
	      });

	      if (pd.branches.enable) {
	        //Create the branch skeletons from the stem skeletons
	        branchSkeletons = stemSkeletons.map(function (skeleton, i) {
	          return createBranchSkeleton(pd.branches, skeleton, i);
	        }); //Create the branch geometries

	        var branchGeometries = branchSkeletons.map(function (skeletons, i) {
	          return createBranchGeometry(pd, settings, skeletons, i);
	        });
	        stemGeometries.push.apply(stemGeometries, _toConsumableArray(branchGeometries));
	        skeletons.push.apply(skeletons, _toConsumableArray(branchSkeletons.flat()));
	      }

	      if (pd.leaves.enable) {
	        leaf = calculateNormals(createLeaves(pd.leaves, settings, branchSkeletons, stemSkeletons));
	      }

	      var final = calculateNormals(join.apply(void 0, _toConsumableArray(stemGeometries.concat())));
	      skeletons.push.apply(skeletons, debugLines);
	      skeletons.push.apply(skeletons, _toConsumableArray(stemSkeletons));
	      final.skeleton = skeletons;
	      final.leaf = leaf;
	      return final;
	    }
	  }]);

	  return Generator;
	}();

	expose(Generator);

	return Generator;

}());
//# sourceMappingURL=sw.js.map
