var JSONCanonical;

(function() {

// Source: https://github.com/mirkokiefer/canonical-json
/*
The original version of this code is taken from Douglas Crockford's json2.js:
https://github.com/douglascrockford/JSON-js/blob/master/json2.js

I made some modifications to ensure a canonical output.
*/

function f(n) {
    // Format integers to have at least two digits.
    return n < 10 ? '0' + n : n;
}

var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },
    rep;


function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
        var c = meta[a];
        return typeof c === 'string'
            ? c
            : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
}


function str(key, holder) {

// Produce a string from holder[key].

    var i,          // The loop counter.
        k,          // The member key.
        v,          // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

    if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
        value = value.toJSON(key);
    }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

    if (typeof rep === 'function') {
        value = rep.call(holder, key, value);
    }

// What happens next depends on the value's type.

    switch (typeof value) {
    case 'string':
        return quote(value);

    case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

        return isFinite(value) ? String(value) : 'null';

    case 'boolean':
    case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

        return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

    case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

        if (!value) {
            return 'null';
        }

// Make an array to hold the partial results of stringifying this object value.

        gap += indent;
        partial = [];

// Is the value an array?

        if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

            length = value.length;
            for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value) || 'null';
            }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

            v = partial.length === 0
                ? '[]'
                : gap
                ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                : '[' + partial.join(',') + ']';
            gap = mind;
            return v;
        }

// If the replacer is an array, use it to select the members to be stringified.

        if (rep && typeof rep === 'object') {
            length = rep.length;
            for (i = 0; i < length; i += 1) {
                if (typeof rep[i] === 'string') {
                    k = rep[i];
                    v = str(k, value);
                    if (v) {
                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                    }
                }
            }
        } else {

// Otherwise, iterate through all of the keys in the object.
            var keysSorted = Object.keys(value).sort()
            for (i in keysSorted) {
                k = keysSorted[i]
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = str(k, value);
                    if (v) {
                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                    }
                }
            }
        }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

        v = partial.length === 0
            ? '{}'
            : gap
            ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
            : '{' + partial.join(',') + '}';
        gap = mind;
        return v;
    }
}

// If the JSON object does not yet have a stringify method, give it one.
var stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

    var i;
    gap = '';
    indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

    if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
            indent += ' ';
        }

// If the space parameter is a string, it will be used as the indent string.

    } else if (typeof space === 'string') {
        indent = space;
    }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

    rep = replacer;
    if (replacer && typeof replacer !== 'function' &&
            (typeof replacer !== 'object' ||
            typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
    }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

    return str('', {'': value});
};

JSONCanonical = {
	'stringify': stringify
};

})();
/* Based on Alex Arnell's inheritance implementation. */






/** section: Language
 * class Class
 *
 *  Manages Prototype's class-based OOP system.
 *
 *  Refer to Prototype's web site for a [tutorial on classes and
 *  inheritance](http://prototypejs.org/learn/class-inheritance).
**/
var Class = (function() {

    
    // Claus: Copied together code from PrototypeJS to make its class file self-contained.
    // There is also a klass lib in bower, but I collected too many battle scars
    // to try yet another lib just to discover 'minor' differences in the semantics...

    // [BEGIN OF HACK]
    function $A(iterable) {
        if (!iterable) return [];
        // Safari <2.0.4 crashes when accessing property of a node list with property accessor.
        // It nevertheless works fine with `in` operator, which is why we use it here
        if ('toArray' in Object(iterable)) return iterable.toArray();
        var length = iterable.length || 0, results = new Array(length);
        while (length--) results[length] = iterable[length];
        return results;
      }

    var emptyFunction = function() { };
    
    // https://github.com/sstephenson/prototype/blob/master/src/prototype/lang/object.js
    var FUNCTION_CLASS = '[object Function]';
    var _toString = Object.prototype.toString;
    
    function isFunction(object) {
        return _toString.call(object) === FUNCTION_CLASS;
    }
    
    function argumentNames(arg) {
        var names = arg.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
          .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
          .replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
      }
    
    function update(array, args) {
        var arrayLength = array.length, length = args.length;
        while (length--) array[arrayLength + length] = args[length];
        return array;
      }
    
    function wrap(__method, wrapper) {
        //var __method = this;
        return function() {
          var a = update([__method.bind(this)], arguments);
          return wrapper.apply(this, a);
        }
      }
    // [END OF HACK]
    
    
    
  // Some versions of JScript fail to enumerate over properties, names of which 
  // correspond to non-enumerable properties in the prototype chain
  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      // check actual property name, so that it works with augmented Object.prototype
      if (p === 'toString') return false;
    }
    return true;
  })();
  
  /**
   *  Class.create([superclass][, methods...]) -> Class
   *    - superclass (Class): The optional superclass to inherit methods from.
   *    - methods (Object): An object whose properties will be "mixed-in" to the
   *        new class. Any number of mixins can be added; later mixins take
   *        precedence.
   *
   *  [[Class.create]] creates a class and returns a constructor function for
   *  instances of the class. Calling the constructor function (typically as
   *  part of a `new` statement) will invoke the class's `initialize` method.
   *
   *  [[Class.create]] accepts two kinds of arguments. If the first argument is
   *  a [[Class]], it's used as the new class's superclass, and all its methods
   *  are inherited. Otherwise, any arguments passed are treated as objects,
   *  and their methods are copied over ("mixed in") as instance methods of the
   *  new class. In cases of method name overlap, later arguments take
   *  precedence over earlier arguments.
   *
   *  If a subclass overrides an instance method declared in a superclass, the
   *  subclass's method can still access the original method. To do so, declare
   *  the subclass's method as normal, but insert `$super` as the first
   *  argument. This makes `$super` available as a method for use within the
   *  function.
   *
   *  To extend a class after it has been defined, use [[Class#addMethods]].
   *
   *  For details, see the
   *  [inheritance tutorial](http://prototypejs.org/learn/class-inheritance)
   *  on the Prototype website.
  **/
  function subclass() {};
  function create() {
    var parent = null, properties = $A(arguments);
    if (isFunction(properties[0]))
      parent = properties.shift();

    function klass() {
      this.initialize.apply(this, arguments);
    }

    _.extend(klass, Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      parent.subclasses.push(klass);
    }

    for (var i = 0, length = properties.length; i < length; i++)
      klass.addMethods(properties[i]);

    if (!klass.prototype.initialize)
      klass.prototype.initialize = emptyFunction;

    klass.prototype.constructor = klass;
    return klass;
  }

  /**
   *  Class#addMethods(methods) -> Class
   *    - methods (Object): The methods to add to the class.
   *
   *  Adds methods to an existing class.
   *
   *  [[Class#addMethods]] is a method available on classes that have been
   *  defined with [[Class.create]]. It can be used to add new instance methods
   *  to that class, or overwrite existing methods, after the class has been
   *  defined.
   *
   *  New methods propagate down the inheritance chain. If the class has
   *  subclasses, those subclasses will receive the new methods &mdash; even in
   *  the context of `$super` calls. The new methods also propagate to instances
   *  of the class and of all its subclasses, even those that have already been
   *  instantiated.
   *
   *  ##### Examples
   *
   *      var Animal = Class.create({
   *        initialize: function(name, sound) {
   *          this.name  = name;
   *          this.sound = sound;
   *        },
   *
   *        speak: function() {
   *          alert(this.name + " says: " + this.sound + "!");
   *        }
   *      });
   *
   *      // subclassing Animal
   *      var Snake = Class.create(Animal, {
   *        initialize: function($super, name) {
   *          $super(name, 'hissssssssss');
   *        }
   *      });
   *
   *      var ringneck = new Snake("Ringneck");
   *      ringneck.speak();
   *
   *      //-> alerts "Ringneck says: hissssssss!"
   *
   *      // adding Snake#speak (with a supercall)
   *      Snake.addMethods({
   *        speak: function($super) {
   *          $super();
   *          alert("You should probably run. He looks really mad.");
   *        }
   *      });
   *
   *      ringneck.speak();
   *      //-> alerts "Ringneck says: hissssssss!"
   *      //-> alerts "You should probably run. He looks really mad."
   *
   *      // redefining Animal#speak
   *      Animal.addMethods({
   *        speak: function() {
   *          alert(this.name + 'snarls: ' + this.sound + '!');
   *        }
   *      });
   *
   *      ringneck.speak();
   *      //-> alerts "Ringneck snarls: hissssssss!"
   *      //-> alerts "You should probably run. He looks really mad."
  **/
  function addMethods(source) {
    var ancestor   = this.superclass && this.superclass.prototype,
        properties = Object.keys(source);
        //properties = _.keys(source);

    // IE6 doesn't enumerate `toString` and `valueOf` (among other built-in `Object.prototype`) properties,
    // Force copy if they're not Object.prototype ones.
    // Do not copy other Object.prototype.* for performance reasons
    if (IS_DONTENUM_BUGGY) {
      if (source.toString != Object.prototype.toString)
        properties.push("toString");
      if (source.valueOf != Object.prototype.valueOf)
        properties.push("valueOf");
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i], value = source[property];
      if (ancestor && isFunction(value) &&
              argumentNames(value)[0] == "$super") {
        var method = value;
        value = wrap((function(m) {
          return function() { return ancestor[m].apply(this, arguments); };
        })(property), method);
        
        // We used to use `bind` to ensure that `toString` and `valueOf`
        // methods were called in the proper context, but now that we're 
        // relying on native bind and/or an existing polyfill, we can't rely
        // on the nuanced behavior of whatever `bind` implementation is on
        // the page.
        //
        // MDC's polyfill, for instance, doesn't like binding functions that
        // haven't got a `prototype` property defined.
        value.valueOf = (function(method) {
          return function() { return method.valueOf.call(method); };
        })(method);
        
        value.toString = (function(method) {
          return function() { return method.toString.call(method); };
        })(method);
      }
      this.prototype[property] = value;
    }

    return this;
  }

  return {
    create: create,
    Methods: {
      addMethods: addMethods
    }
  };
})();
"use strict";

/**
 * Defines the global variable into which the modules
 * will add their content
 * 
 * A note on naming convention:
 * The root objectand classes is spelled with upper camel case.
 * modules, functions and objects are in lower camel case.
 * (modules are just namespaces, and it feels pretty obstrusive writing them in upper camel case)
 * 
 */
var jassa = {
	vocab: {
		util: {},
		xsd: {},
		rdf: {},
		rdfs: {},
		owl: {},
		wgs84: {}
	},

	rdf: {
	},
		
	sparql: {},

	service: {},
	
	i18n: {},

	sponate: {},
	
	facete: {},
	
	util: {
		//collection: {}
	},
	
	client: {},
	
	geo: {
	    openlayers: {},
	    leaflet: {}
	}
};

// Upper case version for legacy code 
var Jassa = jassa;

// Export for nodejs
var module;

if(!module) {
    module = {};
}

module["exports"] = jassa;


(function() {
	
	var ns = Jassa.util;
	
	ns.MapUtils = {
	    indexBy: function(arr, keyOrFn, result) {
	        result = result || new ns.HashMap();

	        var fnKey;

            if(_(keyOrFn).isString()) {
                fnKey = function(obj) {
                    return obj[keyOrFn];
                }
            } else {
                fnKey = keyOrFn;
            }

	        _(arr).each(function(item) {
	            var key = fnKey(item);
	            result.put(key, item);
	        });
	        
	        return result;
	    }
	};
	
	ns.MultiMapUtils = {
	    get: function(obj, key) {
            return (key in obj)
                ? obj[key]
                : [];
	    },
	    
	    put: function(obj, key, val) {
            var values;
            
            if(key in obj) {
                values = obj[key];
            } else {
                values = [];
                obj[key] = values;
            }
            
            values.push(value);
	    },
	    
	    clear: function(obj) {
            var keys = _(obj).keys();
            _(keys).each(function(key) {
                delete obj[key];
            });	        
	    }
	};
	
	   
    ns.MultiMapObjectArray = Class.create({
        initialize: function() {
            this.entries = {};
        },
    
        clone: function() {
            var result = new ns.MultiMapObjectArray();
            result.addMultiMap(this);
            
            return result;
        },
    
        clear: function() {
            //this.entries = {};
            var keys = _(this.entries).keys();
            _(keys).each(function(key) {
                delete this.entries[key];
            });
        },
    
        addMultiMap: function(other) {
            for(var key in other.entries) {
                var values = other.entries[key];
                
                for(var i = 0; i < values.length; ++i) {
                    var value = values[i];
                    
                    this.put(key, value);
                }           
            }
        },
    
        get: function(key) {
            return (key in this.entries)
                ? this.entries[key]
                : [];
        },
    
        put: function(key, value) {
            var values;
            
            if(key in this.entries) {
                values = this.entries[key];
            } else {
                values = [];
                this.entries[key] = values;
            }
            
            values.push(value);
        },

        removeKey: function(key) {
            delete this.entries[key];
        }
    });
    
	
	
	
	ns.ArrayUtils = {
	        chunk: function(arr, chunkSize) {    
                var result = [];
                for (var i = 0; i < arr.length; i += chunkSize) {
                    var chunk = arr.slice(i, i + chunkSize);
        
                    result.push(chunk);
                }
                
                return result;
	        },

	        clear: function(arr) {
	            while(arr.length > 0) {
	                arr.pop();
	            }
	        },
	
	        replace: function(target, source) {
	            this.clear(target);

	            if(source) {
	                target.push.apply(target, source);
	            }
	        },
	
	
	        filter: function(arr, fn) {
	            var newArr = _(arr).filter(fn);            
	            this.replace(arr, newArr);
	            return arr;
	        },
	        
	        indexesOf: function(arr, val, fnEquals) {
	            fnEquals = fnEquals || ns.defaultEquals;
	            
	            var result = [];

	            _(arr).each(function(item, index) {
	                var isEqual = fnEquals(val, item);
	                if(isEqual) {
	                    result.push(index);
	                }
	            });
	            
	            return result;
	        },
	        
	        copyWithoutIndexes: function(arr, indexes) {
	            var map = {};
	            _(indexes).each(function(index) {
	                map[index] = true;
	            });
	            
	            var result = [];

	            for(var i = 0; i < arr.length; ++i) {
	                var omit = map[i];
	                if(!omit) {
	                    result.push(arr[i]);
	                }
	            }
	            
	            return result;
	        },
	        
	        removeIndexes: function(arr, indexes) {
	            var tmp = this.copyWithoutIndexes(arr, indexes);	            
	            this.replace(arr, tmp);
	            return arr;
	        }
	};
	
	ns.Iterator = Class.create({
		next: function() {
			throw "Not overridden";
		},
		
		hasNext: function() {
			throw "Not overridden";			
		}
	});
	
	
	   ns.IteratorAbstract = Class.create(ns.Iterator, {
	        initialize: function() {
	            this.current = null;
	            this.advance = true;
	            this.finished = false;
	        },
	        
	        finish: function() {
	            this.finished = true;

	            this.close();
	            return null;
	        },

	        $prefetch: function() {
//	          try {
	            this.current = this.prefetch();
//	          }
//	          catch(Exception e) {
//	              current = null;
//	              logger.error("Error prefetching data", e);
//	          }
	        },

	        hasNext: function() {
	            if(this.advance) {
	                this.$prefetch();
	                this.advance = false;
	            }

	            return this.finished == false;
	        },

	        next: function() {
	            if(this.finished) {
	                throw 'No more elments';
	            }

	            if(this.advance) {
	                this.$prefetch();
	            }

	            this.advance = true;
	            return this.current;
	        },

	        
	        prefetch: function() {
	            throw 'Not overridden';
	        }
	    });
	
	
	ns.Entry = Class.create({
		initialize: function(key, value) {
			this.key = key;
			this.value = value;
		},
		
		getKey: function() {
			return this.key;
		},
		
		getValue: function() {
			return this.value;
		},
		
		toString: function() {
			return this.key + "->" + this.value;
		}
	});
	
	/**
	 * Utility class to create an iterator over an array.
	 * 
	 */
	ns.IteratorArray = Class.create(ns.Iterator, {
		initialize: function(array, offset) {
			this.array = array;
			this.offset = offset ? offset : 0;
		},
		
		getArray: function() {
		    return this.array;
		},
	
		hasNext: function() {
			var result = this.offset < this.array.length;
			return result;
		},
		
		next: function() {
			var hasNext = this.hasNext();
			
			var result;
			if(hasNext) {			
				result = this.array[this.offset];
				
				++this.offset;
			}
			else {
				result = null;
			}
			
			return result;
		}		
	});
	
	
	/**
	 * A map that just wraps a json object
	 * Just there to provide a unified map interface
	 */
	ns.ObjectMap = Class.create({
		initialize: function(data) {
			this.data = data ? data : {};
		},
		
		get: function(key) {
			return this.data[key];
		},
		
		put: function(key, val) {
			this.data[key] = val;
		},
		
		remove: function(key) {
			delete this.data[key];
		},
		
		entries: function() {
			throw "Not implemented";
		},
		
		toString: function() {
			return JSON.stringify(this.data); 
		}
	});
	
	ns.defaultEquals = function(a, b) {
		var result;
		if(a && a.equals) {
			result = a.equals(b);
		}
		else if(b && b.equals) {
			result = b.equals(a);
		}
		else {
			result = _.isEqual(a, b);
		}
		
		return result;
	};
	
	ns.defaultHashCode = function(a) {
		var result;
		if(a && a.hashCode) {
			result = a.hashCode();
		}
		else {
			result = "" + a;
		}
		
		return result;
	};
	
	
	/**
	 * A map that retains insert order 
	 * 
	 */
	ns.ListMap = Class.create({
	    initialize: function(fnEquals, fnHash) {
	        this.map = new ns.HashMap(fnEquals, fnHash);
	        this.keys = [];
	    },
	    
	    put: function(key, value) {
	        var v = this.map.get(key);
	        if(v) {
	            throw 'Key ' + v + ' already inserted';
	        }
	        
	        this.keys.push(key);
	        this.map.put(key, value);
	    },
	    
	    get: function(key) {
	        var result = this.map.get(key);
	        return result;
	    },
	    
	    getByIndex: function(index) {
	        var key = this.keys[index];
	        var result = this.map.get(key);
	        return result;
	    },
	    
	    entries: function() {
	        var self = this;
	        var result = this.keys.map(function(key) {
	            var value = self.map.get(key);
	            
	            var r = {key: key, val: value};
	            return r;
	        });
	        
	        return result;
	    },
	    
	    remove: function(key) {
	        throw 'Implement me';
	        /*
	        var keys = this.keys;
	        for(var i = 0; i < keys.length; ++i) {
	            
	        }
	        
	        this.map.remove(key);
	        */
	    },
	    
	    removeByIndex: function(index) {
	        var key = this.keys[index];

	        this.remove(key);
	    },
	    
	    keyList: function() {
	        return this.keys;
	    },
	    
	    size: function() {
	        return this.keys.length;
	    }
	});
	
	

	ns.HashMap = Class.create({
		initialize: function(fnEquals, fnHash) {
			this.fnEquals = fnEquals ? fnEquals : ns.defaultEquals;
			this.fnHash = fnHash ? fnHash : ns.defaultHashCode;
			
			this.hashToBucket = {};
		},
		
		put: function(key, val) {
//			if(key == null) {
//				debugger;
//			}
//			console.log('Putting ' + key + ', ' + val);
			var hash = this.fnHash(key);
			
			var bucket = this.hashToBucket[hash];
			if(bucket == null) {
				bucket = [];
				this.hashToBucket[hash] = bucket;
			}
			

			var keyIndex = this._indexOfKey(bucket, key);
			if(keyIndex >= 0) {
				bucket[keyIndex].val = val;
				return;
			}

			var entry = {
				key: key,
				val: val
			};

			bucket.push(entry);
		},
		
		_indexOfKey: function(bucket, key) {
			if(bucket != null) {

				for(var i = 0; i < bucket.length; ++i) {
					var entry = bucket[i];

					var k = entry.key;
					if(this.fnEquals(k, key)) {
						//entry.val = val;
						return i;
					}
				}

			}
			
			return -1;
		},
		
		get: function(key) {
			var hash = this.fnHash(key);
			var bucket = this.hashToBucket[hash];
			var i = this._indexOfKey(bucket, key);
			var result = i >= 0 ? bucket[i].val : null;
			return result;
		},
		
		remove: function(key) {
			var hash = this.fnHash(key);
			var bucket = this.hashToBucket[hash];
			var i = this._indexOfKey(bucket, key);

			var doRemove = i >= 0;
			if(doRemove) {
				bucket.splice(i, 1);
			}
			
			return doRemove;
		},
		
		containsKey: function(key) {
			var hash = this.fnHash(key);
			var bucket = this.hashToBucket[hash];
			var result =  this._indexOfKey(bucket, key) >= 0;
			return result;
		},
		
		keyList: function() {
			var result = [];
			
			_.each(this.hashToBucket, function(bucket) {
				var keys = _(bucket).pluck('key');
				result.push.apply(result, keys);
			});
			
			return result;
		},
		
		entries: function() {
			var result = [];
			
			_(this.hashToBucket).each(function(bucket) {
				result.push.apply(result, bucket);
			});
			
			return result;			
		},
		
		toString: function() {
			var entries = this.entries();
			var entryStrs = entries.map(function(entry) { return entry.key + ': ' + entry.val});
			var result = '{' + entryStrs.join(', ') + '}';
			return result;
		}
	});
	
	
	
	ns.HashBidiMap = Class.create({
		/**
		 * 
		 */
		initialize: function(fnEquals, fnHash, inverseMap) {
			this.forward = new ns.HashMap(fnEquals, fnHash);
			this.inverse = inverseMap ? inverseMap : new ns.HashBidiMap(fnEquals, fnHash, this);
		},
		
		getInverse: function() {
			return this.inverse;
		},
		
		put: function(key, val) {
			this.remove(key);
			
			this.forward.put(key, val);
			this.inverse.forward.put(val, key);
		},
		
		remove: function(key) {
			var priorVal = this.get(key);
			this.inverse.forward.remove(priorVal);			
			this.forward.remove(key);
		},
		
		getMap: function() {
			return this.forward;
		},
		
		get: function(key) {
			var result = this.forward.get(key);
			return result;
		},
		
		keyList: function() {
			var result = this.forward.keyList();
			return result;
		}
	});

	
//	// Similar to a hash set, however items are 
//	ns.SetList = Class.create({
//	    
//	})

	ns.HashSet = Class.create({
		initialize: function(fnEquals, fnHash) {
			this.map = new ns.HashMap(fnEquals, fnHash);
		},
		
		add: function(item) {
			this.map.put(item, true);
		},
		
		contains: function(item) {
			var result = this.map.containsKey(item);
			return result;
		},
		
		remove: function(item) {
			this.map.remove(item);
		},
		
		entries: function() {
			var result = _(this.map.entries()).map(function(entry) {
				//return entry.getKey();
				return entry.key;
			});
			
			return result;
		},
		
		toString: function() {
			var entries = this.entries();
			var result = "{" + entries.join(", ") + "}";
			return result;
		}
	});
	
	
	/**
	 * Note: this is a read only collection
	 * 
	 */
	ns.NestedList = Class.create({
	    classLabel: 'jassa.util.NestedList',
	    
	    initialize: function() {
	        this.subLists = [];
	    },

	    /**
	     * Returns an array with the concatenation of all items
	     */
	    getArray: function() {
	        // tmp is an array of arrays
	        var tmp = _(this.subLists).each(function(subList) {
	            return subList.getArray();
	        });
	        
	        var result = _(tmp).flatten(true);
	        
	        return result;
	    },
	    
	    contains: function(item) {
	        var found = _(this.subLists).find(function(subList) {
	            var r = subList.contains(item);
	            return r;
	        });
	
	        var result = !!found;
	        return result;
	    }
	    
	    /*
	    get: function(index) {
	        
	    },
	    */
	});
	
	ns.ArrayList = Class.create({
	   initialize: function(fnEquals) {
	       this.items = [];
	       this.fnEquals = fnEquals || ns.defaultEquals;
	   },
	   
	   setItems: function(items) {
	       this.items = items;
	   },
	   
	   getArray: function() {
	       return this.items;
	   },
	   
	   get: function(index) {
	       var result = this.items[index];
	       return result;
	   },
	   
	   add: function(item) {
	       this.items.push(item);
	   },
	   
	   indexesOf: function(item) {
	       var items = this.items;
	       var fnEquals = this.fnEquals;
	       
	       var result = [];

	       _(items).each(function(it, index) {
               var isEqual = fnEquals(item, it);
               if(isEqual) {
                   result.push(index);
               }
	       });
	       
	       return result;
	   },
	   
	   contains: function(item) {
	       var indexes = this.indexesOf(item);
	       var result = indexes.length > 0;
	       return result;
	   },
	   
	   firstIndexOf: function(item) {
	       var indexes = this.indexesOf(item);
	       var result = (indexes.length > 0) ? indexes[0] : -1; 
	       return result;
	   },

	   lastIndexOf: function(item) {
           var indexes = this.indexesOf(item);
           var result = (indexes.length > 0) ? indexes[indexes.length - 1] : -1; 
           return result;
       },

       /**
        * Removes the first occurrence of the item from the list
        */
       remove: function(item) {
           var index = this.firstIndexOf(item);
           if(index >= 0) {
               this.removeByIndex(index);
           }
       },
       
	   removeByIndex: function(index) {
	       this.items.splice(index, 1);
	   },
	   
	   size: function() {
	       return this.items.length;
	   }
	});
	
	ns.CollectionUtils = {
	    /**
	     * Toggle the membership of an item in a collection and
	     * returns the item's new membership state (true = member, false = not a member)
	     * 
	     * 
	     * @param collection
	     * @param item
	     * 
	     */
		toggleItem: function(collection, item) {
		    var result;

			if(collection.contains(item)) {
				collection.remove(item);
				result = false;
			}
			else {
				collection.add(item);
				result = true;
			}
			
			return result;
		}
	};
	
})();
(function() {
	
	var ns = Jassa.util;
	
	ns.TreeUtils = {
		
		/**
		 * Generic method for visiting a tree structure
		 * 
		 */
		visitDepthFirst: function(parent, fnChildren, fnPredicate) {
			var proceed = fnPredicate(parent);
			
			if(proceed) {
				var children = fnChildren(parent);
				
				_(children).each(function(child) {
					ns.TreeUtils.visitDepthFirst(child, fnChildren, fnPredicate);
				});
			}
		},
		
	    /**
	     * Traverses a tree structure based on a child-attribute name and returns all nodes
	     * 
	     */
	    flattenTree: function(node, childPropertyName, result) {
	        if(result == null) {
	            result = [];
	        }
	        
	        if(node) {
	            result.push(node);
	        }
	        
	        var children = node[childPropertyName];
	        var self = this;
	        if(children) {
	            _(children).each(function(childNode) {
	                self.flattenTree(childNode, childPropertyName, result);
	            });
	        }
	        
	        return result;
	    }
			
	};
	
})();
(function() {

    var ns = Jassa.util;
    
    // requires JSONCanonical
    
    ns.JsonUtils = {
        stringifyCyclic: function(obj, fn) {
            var seen = [];
            var result = JSONCanonical.stringify(obj, function(key, val) {
               if (_(val).isObject()) {
                    if (seen.indexOf(val) >= 0) {
                        return;
                    }
                    
                    seen.push(val);
                    
                    if(fn) {
                        val = fn(key, val);
                    }
                }
                return val;
            });
            
            return result;
        }
    };
    
    
    ns.ObjectUtils = {

        /**
         * Recursively iterate the object tree and use a .hashCode function if available
         * TODO Add support to exclude attributes
         */
        hashCode: function(obj, skipOnce) {

            var result = ns.JsonUtils.stringifyCyclic(obj, function(key, val) {
                
                var r = null;

                if(!skipOnce && _(val).isObject()) {

                    var hashFnName = _(ns.ObjectUtils.defaultHashFnNames).find(function(name) {
                        return _(val[name]).isFunction();
                    });
                    
                    var fnHashCode = val[hashFnName];

                    if(fnHashCode) {
                        r = fnHashCode.apply(val);
                    } else {
                        r = val;
                    }

                } else {
                    r = val;
                }
                
                if(skipOnce) {
                    skipOnce = false;
                }
                
                return r;
            });
            
            return result;
        }
    };
    
    ns.ObjectUtils.defaultHashFnNames = ['hashCode']
})();
(function() {

    var ns = Jassa.util;

    
    /**
     * 
     * Essentially this is a map from state hash of the object
     * 
     */
    ns.SerializationContext = Class.create({
        initialize: function() {
            this._nextId = 1;
            
            // A hash map that compares keys by reference equality
            this.objToId = new ns.HashMap(
                    function(a, b) {
                        return a == b;
                    }, function(obj) {
                        return ns.ObjectUtils.hashCode(obj)
                    }
            );
            
            
            this.idToState = {};
        },
        
        nextId: function() {
            var result = '' + this._nextId++;
            return result;
        },
        
        getIdToState: function() {
            return this.idToState;
        },
        
        getObjToId: function() {
            return this.objToId;
        }
            
            
            // The root key of the object having been serialized
            // (The key may point to an array object)
            //this.rootKey = null;
//            this.idToState = {};
//        },
        
    }); 
    

    ns.Serializer = Class.create({
        initialize: function() {
            /**
             * A map from class label to the class object
             * 
             */
            this.classNameToClass = {};
                        
            /**
             * A map from class label to serialization function  
             */
            this.classNameToFnSerialize = {};
            
            
            /**
             * A map from class label to deserialization function 
             */
            this.classNameToFnDeserialize = {};
            
            /**
             * A map from class name to a prototype instance
             * (i.e. an instance of the class without any ctor arguments passed in)
             * This is a 'cache' attribute; prototypes are created on demand
             */
            this.classNameToPrototype = {};
        },
    
        registerOverride: function(classLabel, fnSerialize, fnDeserialize) {
            this.classNameToFnSerialize[classLabel] = fnSerialize;
            this.classNameToFnDeserialize[classLabel] = fnDeserialize;
        },
        
        
        /**
         * Find and index all classes that appear as members of the namespace (a JavaScript Object)
         * 
         */
        indexClasses: function(ns) {
            var tmp = this.findClasses(ns);
            
            _(this.classNameToClass).extend(tmp);
            
            return tmp;
        },
        

        findClasses: function(ns) {
            var result = {};
            
            _(ns).each(function(k) {
                // TODO Use custom function to obtain class names
                var classLabel = k.classLabel || (k.prototype ? k.prototype.classLabel : null);
                if(classLabel) {
                    result[classLabel] = k;
                }           
            });
            
            return result;
        },


        /**
         * Returns the class label for an instance
         * 
         */
        getLabelForClass: function(obj) {
            var objProto = Object.getPrototypeOf(obj);
            
            var result;
            _(this.classNameToClass).find(function(ctor, classLabel) {
                if(objProto == ctor.prototype) {
                    result = classLabel;
                    return true;
                }           
            });

            return result;
        },
        

        getClassForLabel: function(classLabel) {
            var result;
            _(this.classNameToClass).find(function(ctor, cl) {
                if(cl === classLabel) {
                    result = ctor;
                    return true;
                }           
            });

            return result;      
        },


        serialize: function(obj, context) {
            context = context || new ns.SerializationContext();
            
            var data = this.serializeRec(obj, context);
            
            var result = {
                root: data,
                idToState: context.getIdToState()
            };
            
            
            return result;
        },
        
        serializeRec: function(obj, context) {
            var result;

            //var id = context.getOrCreateId(obj);
            
            // Get or create an ID for the object
            var objToId = context.getObjToId();
            var id = objToId.get(obj);
            
            if(!id) {
                id = context.nextId();
                objToId.put(obj, id);
            }
            
            
            var idToState = context.getIdToState();
            var state = idToState[id];
            
            if(state) {
                result = {
                    ref: id
                };
            }            
            else if(_(obj).isFunction()) {
                result = undefined;
            }
            else if(_(obj).isObject()) {
            
                result = {};
                
                // Try to figure out the class of the object
                //var objClassLabel = obj.classLabel;
                
                var classLabel = this.getLabelForClass(obj);

                
                // TODO Source of Confusion: We use proto to refer toa prototypal instance of some class for the sake of
                // getting the default values as well as an JavaScript's object prototype... Fix the naming.
                
                // TODO Not sure how stable this proto stuff is across browsers
                var isPrimitiveObject = function(obj) {
                    var result = _(obj).isUndefined() || _(obj).isNull() || _(obj).isBoolean() || _(obj).isNumber() || _(obj).isDate() || _(obj).isString() || _(obj).isRegExp(); 
                    return result;
                };
                
                var isSimpleMap = function(obj) {
                    var objProto = obj.prototype || obj.__proto__;
                    
                    var isObject = _(obj).isObject && !isPrimitiveObject(obj);
 
                    var result = isObject && (objProto == null || objProto == Object.__proto__.__proto__);
                    
                    return result;
                };
                
                var isSimpleObject = isPrimitiveObject(obj) || isSimpleMap(obj) || _(obj).isArray();
                
                if(classLabel == null && !isSimpleObject) {
                    console.log('Failed to serialize instance without class label', obj);
                    throw 'Failed to serialize instance without class label';
                }
                
                var proto;
                if(classLabel) {
                    
                    proto = this.classNameToPrototype[classLabel];
                        
                    if(!proto) {
                        var clazz = this.getClassForLabel(classLabel);

                        if(clazz) {

                            try {
                                proto = new clazz();
                                this.classNameToPrototype[classLabel] = proto;
                            }
                            catch(e) {
                                console.log('[WARN] Failed to create a prototype instance of class ' + classLabel, e);
                            }
                        }
                    }                        
                }

                if(!proto) {
                    proto = {};
                }


                /*
                var data = {}; 
                
                var self = this;
                _(obj).each(function(v, k) {
                    
                    
                    var val = self.serializeRec(v, context);
                    
                    var compVal = proto[k];
                    var isEqual = _(val).isEqual(compVal) || (val == null && compVal == null); 
                    //console.log('is equal: ', isEqual, 'val: ', val, 'compVal: ', compVal);
                    if(isEqual) {
                        return;
                    }
                    
                    if(!_(val).isUndefined()) {
                        data[k] = val;
                    }
                    //serialize(clazz, k, v);
                });
                */
                var data = this.serializeAttrs(obj, context, proto);

//              }

                var x = {};
                
                if(classLabel) {
                    x.classLabel = classLabel;
                }

                if(_(data).keys().length > 0) {
                    x['attrs'] = data.attrs;

                    if(data.parent != null) {
                        x['parent'] = data.parent;
                    }
                }
                    

                // If the object is also an array, serialize its members
                // Array members are treated just like objects
                /*
                var self = this;
                if(_(obj).isArray()) {
                    var items = _(obj).map(function(item) {
                        var r = self.serializeRec(item, context);
                        return r;
                    });
                    
                    x['items'] = items;
                }                  
                */
                if(_(obj).isArray()) {
                    x['length'] = obj.length;
                }

                idToState[id] = x;

                result = {
                    ref: id
                };                
            }
            else {
                //result = {type: 'literal', 'value': obj};//null; //obj;
                result = {
                    value: obj
                };
                //throw "unhandled case for " + obj;
            }

            
            //return result;
            return result;
        },

        
        /**
         * Serialize an object's state, thereby taking the prototype chain into account
         * 
         * TODO: We assume that noone messed with the prototype chain after an instance of
         * an 'conceptual' class has been created.
         * 
         */
        serializeAttrs: function(obj, context, proto) {


            var current = obj;
            var result = {};
            var parent = result;
            
//            while(current != null) {
                var data = parent['attrs'] = {};

                
                var self = this;

                var keys = _(obj).keys(); 
                _(keys).each(function(k) {
                    var v = obj[k];

                //_(obj).each(function(v, k) {
                    
                    // Only traverse own properties
//                    if(!_(obj).has(k)) {
//                        return;
//                    }
                    
                    var val = self.serializeRec(v, context);
                    
                    var compVal = proto[k];
                    var isEqual = _(val).isEqual(compVal) || (val == null && compVal == null); 
                    //console.log('is equal: ', isEqual, 'val: ', val, 'compVal: ', compVal);
                    if(isEqual) {
                        return;
                    }
                    
                    if(!_(val).isUndefined()) {
                        data[k] = val;
                    }
                    //serialize(clazz, k, v);
                });

//                current = current.__proto__;
//                if(current) {
//                    parent = parent['parent'] = {};
//                }
//            };
            
            return result;
        },
        
        
        /**
         * @param graph: Object created by serialize(foo)
         * 
         */
        deserialize: function(graph, context) {
            //context = context || new ns.SerializationContext();
            
            var ref = graph.root;
            var idToState = graph.idToState;
            var idToObj = {};
                        
            var result = this.deserializeRef(ref, idToState, idToObj);
            
            return result;
        },
        
        deserializeRef: function(attr, idToState, idToObj) {
            var ref = attr.ref;
            var value = attr.value;
            
            var result;
            
            if(ref != null) {
                var objectExists = ref in idToObj;

                if(objectExists) {
                    result = idToObj[ref];
                }
                else {
                    result = this.deserializeState(ref, idToState, idToObj);
                    
//                    if(result == null) {
//                        console.log('Could not deserialize: ' + JSON.stringify(state) + ' with context ' + idToState);
//                        throw 'Deserialization error';
//                    }
                }
            }
            else {
                result = value;
            }
            /*
            else if(!_(value).isUndefined()) {
                result = value;
            }
            else if(_(value).isUndefined()) {
                // Leave the value 
            }
            else {
                console.log('Should not come here');
                throw 'Should not come here';
            }
            */
            return result;
        },

        deserializeState: function(id, idToState, idToObj) {
            
            var result;
            
            var state = idToState[id];

            if(state == null || !_(state).isObject()) {
                console.log('State must be an object, was: ', state);
                throw 'Deserialization error';
            }

            var attrs = state.attrs;
            //var items = state.items;
            var classLabel = state.classLabel;
            var length = state.length;
            
            if(classLabel) {
                var classFn = this.getClassForLabel(classLabel);
                
                if(!classFn) {
                    throw 'Unknown class label encountered in deserialization: ' + classLabel;
                }
                
                result = new classFn();
            } else if(length != null) { //items != null) {
                result = [];
            } else {
                result = {};
            }
            
            // TODO get the id
            idToObj[id] = result;
            
        
            var self = this;
            if(attrs != null) {
                var keys = _(attrs).keys(); 
                _(keys).each(function(k) {
                    var ref = attrs[k];

                    var val = self.deserializeRef(ref, idToState, idToObj);
                    
                    result[k] = val;
                });
            }
            
            if(length != null) {
                result.length = length;
            }
            /*
            if(items != null) {
                _(items).each(function(item) {
                    var r = self.deserializeRef(item, idToState, idToObj);

                    result.push(r);
                });                
            }
            */
        
            return result;
        }
        
    });
    
    ns.Serializer.singleton = new ns.Serializer();

})();
(function() {
	
	var ns = Jassa.rdf;
	

	/**
	 * The node base class similar to that of Apache Jena.
	 * 
	 * 
	 * TODO Rename getUri to getURI
	 * TODO Make this class a pure interface - move all impled methods to an abstract base class
	 * TODO Clarify who is responsible for .equals() (just do it like in Jena - Is it the base class or its derivations?)
	 */
	ns.Node = Class.create({
        classLabel: 'Node',
	    
		getUri: function() {
			throw "not a URI node";
		},
	
		getName: function() {
			throw " is not a variable node";
		},
		
		getBlankNodeId: function() {
			throw " is not a blank node";
		},
		
		getBlankNodeLabel: function() {
			//throw " is not a blank node";
		    // Convenience override
			return this.getBlankNodeId().getLabelString();
		},
		
		getLiteral: function() {
			throw " is not a literal node";
		},
		
		getLiteralValue: function() {
			throw " is not a literal node";
		},
		
		getLiteralLexicalForm: function() {
			throw " is not a literal node";			
		},
		
		getLiteralDatatype: function() {
			throw " is not a literal node";			
		},
		
		getLiteralDatatypeUri: function() {
			throw " is not a literal node";			
		},
		
		isBlank: function() {
			return false;
		},
		
		isUri: function() {
			return false;
		},
		
		isLiteral: function() {
			return false;
		},
		
		isVariable: function() {
			return false;
		},
		
		equals: function(that) {

			// By default we assume non-equality
			var result = false;
			
			if(that == null) {
				result = false;
			}
			else if(this.isLiteral()) {
				if(that.isLiteral()) {
					
					var isSameLex = this.getLiteralLexicalForm() === that.getLiteralLexicalForm();
					var isSameType = this.getLiteralDatatypeUri() === that.getLiteralDatatypeUri();
					var isSameLang = this.getLiteralLanguage() === that.getLiteralLanguage();
					
					result = isSameLex && isSameType && isSameLang;
				}
			}
			else if(this.isUri()) {
				if(that.isUri()) {
					result = this.getUri() === that.getUri();
				}
			}
			else if(this.isVariable()) {
				if(that.isVariable()) {
					result = this.getName() === that.getName();
				}
			}
			else if(this.isBlank()) {
				if(that.isBlank()) {
					result = this.getBlankNodeLabel() === that.getBlankNodeLabel(); 
				}
			}
			//else if(this.)
			else {
				throw 'not implemented yet';
			}
			
			return result;
		}
	});
	

	ns.Node_Concrete = Class.create(ns.Node, {
        classLabel: 'Node_Concrete',

		isConcrete: function() {
			return true;
		}
	});


	ns.Node_Uri = Class.create(ns.Node_Concrete, {
	    classLabel: 'Node_Uri',
	    
		initialize: function(uri) {
			this.uri = uri;
		},

		isUri: function() {
			return true;
		},
		
		getUri: function() {
			return this.uri;
		},
		
		toString: function() {
			return '<' + this.uri + '>';
		}
	});
	
	ns.Node_Blank = Class.create(ns.Node_Concrete, {
        classLabel: 'Node_Blank',

		// Note: id is expected to be an instance of AnonId
		initialize: function(anonId) {
			this.anonId = anonId;
		},
		
		isBlank: function() {
			return true;
		},
		
		getBlankNodeId: function() {
			return this.anonId;
		},
		
		toString: function() {
			return "_:" + this.anonId;
		}
	});
	
	ns.Node_Fluid = Class.create(ns.Node, {
		isConcrete: function() {
			return false;
		}		
	});

    // I don't understand the purpose of this class right now
	// i.e. how it is supposed to differ from ns.Var
	ns.Node_Variable = Class.create(ns.Node_Fluid, {
        classLabel: 'Node_Variable',

		isVariable: function() {
			return true;
		}
	});

	ns.Var = Class.create(ns.Node_Variable, {
        classLabel: 'Var',

		initialize: function(name) {
			this.name = name;
		},
		
		getName: function() {
			return this.name;
		},
		
		toString: function() {
			return '?' + this.name;
		}
	});

	
	ns.Node_Literal = Class.create(ns.Node_Concrete, {
        classLabel: 'Node_Literal',
	    
		initialize: function(literalLabel) {
			this.literalLabel = literalLabel;
		},
		
		isLiteral: function() {
			return true;
		},
		
		getLiteral: function() {
			return this.literalLabel;
		},

		getLiteralValue: function() {
			return this.literalLabel.getValue();
		},

		getLiteralLexicalForm: function() {
			return this.literalLabel.getLexicalForm();
		},
		
		getLiteralDatatype: function() {
			return this.literalLabel.getDatatype();
		},
		
		getLiteralDatatypeUri: function() {
			var dtype = this.getLiteralDatatype();
			var result = dtype ? dtype.getUri() : null; 
			return result;
		},
		
		getLiteralLanguage: function() {
			return this.literalLabel.getLanguage();
		},
		
		toString: function() {
			return this.literalLabel.toString();
		}
	});

	
	ns.escapeLiteralString = function(str) {
		return str;
	};
	
	/**
	 * An simple object representing a literal -
	 * independent from the Node inheritance hierarchy.
	 * 
	 * Differences to Jena:
	 *   - No getDatatypeUri method, as there is dtype.getUri() 
	 */
	ns.LiteralLabel = Class.create({
        classLabel: 'LiteralLabel',
	    
		/**
		 * Note: The following should hold:
		 * dtype.parse(lex) == val
		 * dtype.unpars(val) == lex
		 * 
		 * However, this class doesn't care about it.
		 * 
		 */
		initialize: function(val, lex, lang, dtype) {
			this.val = val;
			this.lex = lex;
			this.lang = lang;
			this.dtype = dtype;
		},
		
		/**
		 * Get the literal's value as a JavaScript object
		 */
		getValue: function() {
			return this.val;
		},
		
		getLexicalForm: function() {
			return this.lex
		},
		
		getLanguage: function() {
			return this.lang;
		},
		
		/**
		 * Return the dataype object associated with this literal.
		 */
		getDatatype: function() {
			return this.dtype;
		},
		
		toString: function() {
			var dtypeUri = this.dtype ? this.dtype.getUri() : null;
			var litStr = ns.escapeLiteralString(this.lex);
			
			var result;
			if(dtypeUri) {
				result = '"' + litStr + '"^^<' + dtypeUri + '>';
			} else {
				result = '"' + litStr + '"' + (this.lang ? '@' + this.lang : '');
			}
			
			return result;
		}
	});

	
	ns.AnonId = Class.create({
		getLabelString: function() {
			throw "not implemented";
		}
	});
	
	ns.AnonIdStr = Class.create(ns.AnonId, {
        classLabel: 'AnonIdStr',

		initialize: function(label) {
			this.label = label;
		},

		getLabelString: function() {
			return this.label;
		},
		
		toString: function() {
			return this.label;
		}
	});
	
	
	ns.DatatypeLabel = Class.create({
		parse: function(val) {
			throw 'Not implemented';
		},
		
		unparse: function(val) {
			throw 'Not implemented';
		}
	});
	
	
	ns.DatatypeLabelInteger = Class.create(ns.DatatypeLabel, {
        classLabel: 'DatatypeLabelInteger',
	    
		parse: function(str) {
			var result = parseInt(str, 10);
			return result;
		},
		
		unparse: function(val) {
			return '' + val;
		}
	});

	ns.DatatypeLabelFloat = Class.create(ns.DatatypeLabel, {
        classLabel: 'DatatypeLabelFloat',

        parse: function(str) {
			var result = parseFloat(str);
			return result;
		},
		
		unparse: function(val) {
			return '' + val;
		}
	});
	
	ns.DatatypeLabelString = Class.create(ns.DatatypeLabel, {
        classLabel: 'DatatypeLabelString',

		parse: function(str) {
			return str
		},
		
		unparse: function(val) {
			return val;
		}
	});

	
	ns.RdfDatatype = Class.create({
        classLabel: 'RdfDatatype',

		getUri: function() {
			throw "Not implemented";
		},
		
		unparse: function(value) {
			throw "Not implemented";
		},
		
	    /**
	     * Convert a value of this datatype out
	     * to lexical form.
	     */
		parse: function(str) {
			throw "Not implemented";
		}
	});


	ns.RdfDatatypeBase = Class.create(ns.RdfDatatype, {
        classLabel: 'RdfDatatypeBase',

		initialize: function(uri) {
			this.uri = uri;
		},
		
		getUri: function() {
			return this.uri;
		}
	});
	
	ns.RdfDatatype_Label = Class.create(ns.RdfDatatypeBase, {
        classLabel: 'RdfDatatype_Label',

		initialize: function($super, uri, datatypeLabel) {
			$super(uri);
			
			this.datatypeLabel = datatypeLabel;
		},

		parse: function(str) {
			var result = this.datatypeLabel.parse(str);
			return result;
		},
		
		unparse: function(val) {
			var result = this.datatypeLabel.unparse(val);
			return result;			
		}
	});
	

	// TODO Move to util package
	// http://stackoverflow.com/questions/249791/regex-for-quoted-string-with-escaping-quotes
    ns.strRegex = /"([^"\\]*(\\.[^"\\]*)*)"/;

    /**
     * 
     */
	ns.parseUri = function(str, prefixes) {
	    var result;
	    if(str.charAt(0) == '<') {
	        result = str.slice(1, -1);
	    } else {
	        console.log('[ERROR] Cannot deal with ' + str);
	        throw 'Not implemented';
	    }  
	    
	    return result;
	};
	
	
	
	
	ns.JenaParameters = {
	    enableSilentAcceptanceOfUnknownDatatypes: true
	};
	
	
    ns.TypedValue = Class.create({
        initialize: function(lexicalValue, datatypeUri) {
            this.lexicalValue = lexicalValue;
            this.datatypeUri = datatypeUri;
        },
        
        getLexicalValue: function() {
            return this.lexicalValue;
        },
        
        getDatatypeUri: function() {
            return this.datatypeUri;
        }
    });

	
	ns.BaseDatatype = Class.create(ns.RdfDatatype, {
	   initialize: function(datatypeUri)  {
	       this.datatypeUri = datatypeUri;
	   },

       getUri: function() {
           return this.datatypeUri;
       },
       
       unparse: function(value) {
           var result;

           if (value instanceof ns.TypedValue) {
               result = value.getLexicalValue();
           } else {
               result = '' + value;
           }
           return result;
       },
       
       /**
        * Convert a value of this datatype out
        * to lexical form.
        */
       parse: function(str) {
           var result = new ns.TypedValue(str, this.datatypeUri);
           return result;
       },
       
       toString: function() {
           return 'Datatype [' + this.datatypeUri + ']';
       }

	});
	
	/**
	 * TypeMapper similar to that of Jena
	 * 
	 */
	ns.TypeMapper = Class.create({
	    initialize: function(uriToDt) {
	        this.uriToDt = uriToDt;
	    },

	    getSafeTypeByName: function(uri) {
	        var uriToDt = this.uriToDt;

	        var dtype = uriToDt[uri];
	        if (dtype == null) {
	            if (uri == null) {
	                // Plain literal
	                return null;
	            } else {
	                // Uknown datatype
	                if (ns.JenaParameters.enableSilentAcceptanceOfUnknownDatatypes) {
	                    dtype = new ns.BaseDatatype(uri);
	                    this.registerDatatype(dtype);
	                } else {
	                    console.log('Attempted to created typed literal using an unknown datatype - ' + uri);
	                    throw 'Bailing out';
	                }
	            }
	        }
	        return dtype;
	    },
	    
	    registerDatatype: function(datatype) {
	        var typeUri = datatype.getUri();
            this.uriToDt[typeUri] = datatype;
	    }
	});
	

	ns.TypeMapper.staticInstance = null;

	ns.TypeMapper.getInstance = function() {
	    var self = ns.TypeMapper;
	    
        if(self.staticInstance == null) {
            self.staticInstance = new ns.TypeMapper(ns.RdfDatatypes);
        }
        
        return self.staticInstance;
    };

	
	
	
	ns.NodeFactory = {
		createAnon: function(anonId) {
			return new ns.Node_Blank(anonId);
		},
			
		createUri: function(uri) {
			return new ns.Node_Uri(uri);
		},
			
		createVar: function(name) {
			return new ns.Var(name);
		},
		
		createPlainLiteral: function(value, lang) {
		    if(lang == null) {
		        lang = '';
		    }
		    
			var label = new ns.LiteralLabel(value, value, lang);
			var result = new ns.Node_Literal(label);
			
			return result;
		},
		
		/**
		 * The value needs to be unparsed first (i.e. converted to string)
		 * 
		 */
		createTypedLiteralFromValue: function(val, typeUri) {
			var dtype = ns.RdfDatatypes[typeUri];
			if(!dtype) {
			    
			    var typeMapper = ns.TypeMapper.getInstance();
			    dtype = typeMapper.getSafeTypeByName(typeUri);
			    
				//console.log('[ERROR] No dtype for ' + typeUri);
				//throw 'Bailing out';
			}

			var lex = dtype.unparse(val);
			var lang = null;
			
			var literalLabel = new ns.LiteralLabel(val, lex, lang, dtype);
			
			var result = new ns.Node_Literal(literalLabel);
			
			return result;
		},

		
		/**
		 * The string needs to be parsed first (i.e. converted to the value)
		 * 
		 */
		createTypedLiteralFromString: function(str, typeUri) {
			var dtype = ns.RdfDatatypes[typeUri];
			if(!dtype) {
	             var typeMapper = ns.TypeMapper.getInstance();
	             dtype = typeMapper.getSafeTypeByName(typeUri);

//				console.log('[ERROR] No dtype for ' + typeUri);
//				throw 'Bailing out';
			}
			
			var val = dtype.parse(str);

			var lex = str;
			//var lex = dtype.unparse(val);
			//var lex = s; //dtype.parse(str);
			var lang = ''; // TODO Use null instead of empty string???
			
			var literalLabel = new ns.LiteralLabel(val, lex, lang, dtype);
			
			var result = new ns.Node_Literal(literalLabel);
			
			return result;
		},
		
		createFromTalisRdfJson: function(talisJson) {
			if(!talisJson || typeof(talisJson.type) === 'undefined') {
				throw "Invalid node: " + JSON.stringify(talisJson);
			}
			
			var result;
			switch(talisJson.type) {
				case 'bnode':
					var anonId = new ns.AnonIdStr(talisJson.value);
					result = new ns.NodeFactory.createAnon(anonId);
					break;
				case 'uri': 
					result = ns.NodeFactory.createUri(talisJson.value);	
					break;
				case 'literal':
					// Virtuoso at some version had a bug with langs - note: || is coalesce
					var lang = talisJson.lang || talisJson['xml:lang'];
					result = ns.NodeFactory.createPlainLiteral(talisJson.value, lang);
					break;
				case 'typed-literal':
					result = ns.NodeFactory.createTypedLiteralFromString(talisJson.value, talisJson.datatype);
					break;
				default:
					console.log("Unknown type: '" + talisJson.type + "'");
					throw 'Bailing out';
			}
			
			return result;
		},
		
		
//		_parseUri: function(str, prefixes) {
//		    if(str.charAt(0) == '<'))
//		    
//		    if(str.indexOf(''))
//		},
		
		/**
		 * Parses an RDF term and returns an rdf.Node object
		 * 
		 * blankNode: _:
		 * uri: <http://foo>
		 * plainLiteral ""@foo
		 * typedLiteral""^^<>
		 */
		parseRdfTerm: function(str, prefixes) {
		    if(!str) {
		        console.log('[ERROR] Null Pointer Exception');
		        throw 'Bailing out';
		    }
		    		    
	        str = str.trim();

		    if(str.length == 0) {
                console.log('[ERROR] Empty string');
                throw 'Bailing out';		        
		    }
		    		    
		    var c = str.charAt(0);

		    var result;
		    switch(c) {
		    case '<': 
		        var uriStr = str.slice(1, -1);
		        result = ns.NodeFactory.createUri(uriStr);
		        break;
		    case '_':
		        var anonId = new ns.AnonIdStr(c);
		        result = ns.NodeFactory.createAnon(anonId);
		        break;
		    case '"':
		        var matches = ns.strRegex.exec(str);
		        var match = matches[0];
		        var val = match.slice(1, -1);
		    
		        
		        //console.log('match: ' + match);
		        
		        var l = match.length;
		        var d = str.charAt(l);
		        
		        if(!d) {
                    result = ns.NodeFactory.createTypedLiteralFromString(val, 'http://www.w3.org/2001/XMLSchema#string');
		        }
		        //console.log('d is ' + d);
		        switch(d) {
		        case '':
		        case '@':
		            var langTag = str.substr(l + 1);
		            result = ns.NodeFactory.createPlainLiteral(val, langTag);
		            break;
		        case '^':
		            var type = str.substr(l + 2);
		            var typeStr = ns.parseUri(type);
		            result = ns.NodeFactory.createTypedLiteralFromString(val, typeStr);
		            break;
		        default: 
	                console.log('[ERROR] Excepted @ or ^^');
                    throw 'Bailing out';
		        }
		        break;
		    default:
		        console.log('Could not parse ' + str);
		        // Assume an uri in prefix notation
		        throw "Not implemented";
		    }
		    
		    return result;
//		    if(c == '<') { //uri
//		        
//		    }
//            else if(c == '"') {
//                
//            }
//		    else if(c == '_') { // blank node
//		        
//		    }
		    

		}
	};

	// Convenience methods
	_.extend(ns.Node, {
		uri: ns.NodeFactory.createUri,
		v: ns.NodeFactory.createVar
	});

	
	
	ns.getSubstitute = function(node, fnNodeMap) {
		var result = fnNodeMap(node);
		if(!result) {
			result = node;
		}
		
		return result;
	};
	
	ns.Triple = Class.create({
	    
        classLabel: 'jassa.rdf.Triple',

		initialize: function(s, p, o) {
			this.s = s;
			this.p = p;
			this.o = o;
		},
	
		toString: function() {
			return this.s + " " + this.p + " " + this.o;
		},
		
		copySubstitute: function(fnNodeMap) {
			var result = new ns.Triple(
				ns.getSubstitute(this.s, fnNodeMap),
				ns.getSubstitute(this.p, fnNodeMap),
				ns.getSubstitute(this.o, fnNodeMap)
			);
			
			return result;
			//	this.s.copySubstitute(fnNodeMap), this.p.copySubstitute(fnNodeMap), this.o.copySubstitute(fnNodeMap));
		},
	
		getSubject: function() {
			return this.s;
		},

		getProperty: function() {
			return this.p;
		},
	
		getObject: function() {
			return this.o;
		},
	
		getVarsMentioned: function() {
			var result = [];
			ns.Triple.pushVar(result, this.s);
			ns.Triple.pushVar(result, this.p);
			ns.Triple.pushVar(result, this.o);
			return result;
		}
	});
	
	
	ns.Triple.pushVar = function(array, node) {
		
		if(node.isVariable()) {
		    var c = _(array).some(function(item) {
		        return node.equals(item);
		    });
		    
		    if(!c) {
		        array.push(node);
		    }
			//_(array).union(node);
		}
		
		return array;
	};
	
	
})();

(function() {

	var rdf = Jassa.rdf;

	var ns = Jassa.vocab.util;

	/**
	 * Creates rdf.Node objects in the target namespace
	 * from strings in the source namepsace
	 * 
	 */
	ns.initNodes = function(target, source) {

		if(source == null) {
			source = target.str;
			
			if(source == null) {
				console.log('No source from where to init nodes');
				throw 'Bailing out';
			}
		}
		
		_.each(source, function(v, k) {
			target[k] = rdf.Node.uri(v);
		});
	};
	
})();	(function() {
	
	var util = Jassa.vocab.util;
	var ns = Jassa.vocab.xsd;

	var p = "http://www.w3.org/2001/XMLSchema#";

	// String versions
	ns.str = {
		xboolean: p + "boolean",
		xint: p + "int",
		xinteger: p + "integer",
		xlong: p + "long",
		decimal: p + "decimal",
		xfloat: p + "float",
		xdouble: p + "double",
		xstring: p + "string",
	
		date: p + "date",
	    dateTime: p + "dateTime"
	};
	
	
	util.initNodes(ns);

//	// Node versions
//	var str = ns.str;
//
//	_.each(ns.str, function(v, k) {
//		ns[k] = rdf.Node.uri(v);
//	});
	
//	_.extend(ns, {
//		xboolean: rdf.Node.uri(str.xboolean),
//		xint: rdf.Node.uri(str.xint),
//		xfloat: rdf.Node.uri(str.xfloat),
//		xdouble: rdf.Node.uri(str.xdouble),
//		xstring: rdf.Node.uri(str.xstring),
//	
//		date: rdf.Node.uri(str.date),
//	    dateTime: rdf.Node.uri(str.dateTime)
//	});

})();
(function() {

	// This file requires the xsd datatypes, whereas xsd depends on rdf-core
	
	var xsd = Jassa.vocab.xsd;
	var s = xsd.str;
	var ns = Jassa.rdf;
	
	
	ns.DatatypeLabels = {
		xinteger: new ns.DatatypeLabelInteger(),
		xfloat: new ns.DatatypeLabelFloat(),
		xdouble: new ns.DatatypeLabelFloat(),
		xstring: new ns.DatatypeLabelString(),
		decimal: new ns.DatatypeLabelFloat() // TODO Handle Decimal properly
	};
	
	
	ns.RdfDatatypes = {};
	
	ns.registerRdfDatype = function(uri, label) {
		ns.RdfDatatypes[uri] = new ns.RdfDatatype_Label(uri, label);
	};
	
	ns.registerRdfDatype(xsd.str.xint, ns.DatatypeLabels.xinteger);
	ns.registerRdfDatype(xsd.str.xlong, ns.DatatypeLabels.xinteger);
	ns.registerRdfDatype(xsd.str.xinteger, ns.DatatypeLabels.xinteger);
	ns.registerRdfDatype(xsd.str.xstring, ns.DatatypeLabels.xstring);
	ns.registerRdfDatype(xsd.str.xfloat, ns.DatatypeLabels.xfloat);
	ns.registerRdfDatype(xsd.str.xdouble, ns.DatatypeLabels.xdouble);

	ns.registerRdfDatype(xsd.str.decimal, ns.DatatypeLabels.xfloat);
	
	/**
	 * Some default datatypes.
	 * 
	 * TODO This is redundant with the datatypeLabel classes above
	 */
	
//	var xsdps = ns.XsdParsers = {};
//	
//	xsdps[s.xboolean] = function(str) { return str == 'true'; };
//	xsdps[s.xint] = function(str) { return parseInt(str, 10); };
//	xsdps[s.xfloat] = function(str) { return parseFloat(str); };
//	xsdps[s.xdouble] = function(str) { return parseFloat(str); };
//	xsdps[s.xstring] = function(str) { return str; };
//
//	xsdps[s.decimal] = function(str) { return parseInt(str, 10); };
//
//	
//	// TODO Parse to some object other than string
//	xsdps[s.date] = function(str) { return str; };
//	xsdps[s.dateTime] = function(str) { return str; };

	
	
})();
(function() {

	var util = Jassa.vocab.util;
	var ns = Jassa.vocab.rdf;
	
	var p = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
	
	ns.str = {
		type: p + "type",
		Property: p + "Property"
	};
	
	util.initNodes(ns);

})();	
(function() {

	var util = Jassa.vocab.util;
	var ns = Jassa.vocab.rdfs;
	
	var p = 'http://www.w3.org/2000/01/rdf-schema#';
	
	ns.str = {
		label: p + 'label',
		subClassOf: p + 'subClassOf'
	};
	
	util.initNodes(ns);

})();	
(function() {
	
	var util = Jassa.vocab.util;
	var ns = Jassa.vocab.owl;
	
	var p = 'http://www.w3.org/2002/07/owl#';
	
	ns.str = {
		'Class': p + 'Class',
		'DatatypeProperty': p + 'DatatypeProperty',
		'ObjectProperty': p + 'ObjectProperty',
		'AnnotationProperty': p + 'AnnotationProperty'
	};
	
	util.initNodes(ns);
	
})();	
(function() {
	
	var util = Jassa.vocab.util;
	var ns = Jassa.vocab.wgs84;
	
	var p = 'http://www.w3.org/2003/01/geo/wgs84_pos#';

	// String versions
	ns.str = {
		lon: p + "long",
		lat: p + "lat"
	};
		
	util.initNodes(ns);
	
})();(function() {

	var ns = Jassa.sparql;

	/*
	 * rdf.Node is the same as sparql.Node, but the former is strongly preferred. 
	 * This alias for the Node object between the rdf and sparql namespace exists for legacy reasons.
	 */
	ns.Node = Jassa.rdf.Node;

	
	
	
	
    ns.PrefixMappingImpl = Class.create({
        initialize: function(prefixes) {
            this.prefixes = prefixes ? prefixes : {};
        },
        
        expandPrefix: function(prefixed) {
            throw 'Not implemented yet - sorry';
        },
        
        getNsPrefixMap: function() {
            return this.prefixes;
        },
        
        getNsPrefixURI: function(prefix) {
            return this.prefixes[prefix];
        },
        
        /**
         * Answer the prefix for the given URI, or null if there isn't one.
         */
        getNsURIPrefix: function(uri) {
            var result = null;
            var bestNs = null;
            
            _(this.prefixes).each(function(u, prefix) {
                if(_(uri).startsWith(u)) {
                    if(!bestNs || (u.length > bestNs.length)) {
                        result = prefix;
                        bestNs = u;
                    }
                }
            });
   
           return result;
        },

        qnameFor: function(uri) {
            
        },
        
        removeNsPrefix: function(prefix) {
            delete this.prefixes[prefix];
        },
        
        samePrefixMappingAs: function(other) {
            throw 'Not implemented yet - Sorry';
        },
        
        setNsPrefix: function(prefix, uri) {
            this.prefixes[prefix] = uri;
            
            return this;
        },
        
        setNsPrefixes: function(obj) {
            var json = _(obj.getNsPrefixMap).isFunction() ? obj.getNsPrefixMap() : obj;

            var self = this;
            _(json).each(function(uri, prefix) {
                self.setNsPrefix(prefix, uri);
            });
            
            return this;
        },

        shortForm: function(uri) {
            var prefix = this.getNsPrefixURI(uri);
            
            var result;
            if(prefix) {

                var u = this.prefixes[uri];
                var qname = uri.substring(u.length);
                
                result = prefix + ':' + qname;
            } else {
                result = uri;
            }
            
            return result;
        },
        
        addPrefix: function(prefix, urlBase) {
            this.prefixes[prefix] = urlBase;
        },
        
        getPrefix: function(prefix) {
            var result = this.prefixes[prefix];
            return result;
        },
        
        addJson: function(json) {
            _.extend(this.prefixes, json);
        },
        
        getJson: function() {
            return this.prefixes;
        }
    });

})();(function() {

	var rdf = Jassa.rdf;
	var xsd = Jassa.vocab.xsd;

	
	var ns = Jassa.sparql;
	
	// NOTE This file is currently being portet to make use of classes	
		
	
	/**
	 * An string object that supports variable substitution and extraction
	 * to be used for ElementString and ExprString
	 * 
	 */
	ns.SparqlString = Class.create({
	    classLabel: 'jassa.sparql.SparqlString',
	    
		initialize: function(value, varsMentioned) {			
			this.value = value;
			this.varsMentioned = varsMentioned ? varsMentioned : [];
		},

		toString: function() {
			return this.value;
		},
		
		getString: function() {
			return this.value;
		},

		copySubstitute: function(fnNodeMap) {
			var str = this.value;
			var newVarsMentioned = [];
			
			// Avoid double substitution of variables by using some unlikely prefix
			// instead of the question mark
			var placeholder = '@@@@';
			var reAllPlaceholders = new RegExp(placeholder, 'g');
			
			_(this.varsMentioned).each(function(v) {

			    // A variable must not end in \w (this equals: _, [0-9], [a-z] or [a-Z])
				var reStr = '\\?' + v.getName() + '([^\\w])?';
				var re = new RegExp(reStr, 'g');

				var node = fnNodeMap(v);
				if(node) {
					//console.log('Node is ', node);
				    
				    var replacement;
					if(node.isVariable()) {
						//console.log('Var is ' + node + ' ', node);
						
					    replacement = placeholder + node.getName();
					    
						newVarsMentioned.push(node);						
					} else {
					    replacement = node.toString();
					}

					//var 
					str = str.replace(re, replacement + '$1');
				} else {
					newVarsMentioned.push(v);
				}
			});

			str = str.replace(reAllPlaceholders, '?');
			
			return new ns.SparqlString(str, newVarsMentioned);
		},
	
		getVarsMentioned: function() {
			return this.varsMentioned;
		}
	});

	ns.SparqlString.classLabel = 'SparqlString';

	
	ns.SparqlString.create = function(str, varNames) {
	    var vars;
	    if(varNames != null) {
	        vars = varNames.map(function(varName) {
	           return rdf.NodeFactory.createVar(varName); 
	        });
	    } else {
	        vars = ns.extractSparqlVars(str); 
	    }
		//vars = vars ? vars : 
		
		var result = new ns.SparqlString(str, vars);
		return result;
	};



	/**
	 * Expr classes, similar to those in Jena
	 * 
	 * Usally, the three major cases we need to discriminate are:
	 * - Varibles
	 * - Constants
	 * - Functions
	 *  
	 */
	ns.Expr = Class.create({
		isFunction: function() {
			return false;
		},
		
		isVar: function() {
			return false;
		},
		
		isConstant: function() {
			return false;
		},
		
		getFunction: function() {
			throw 'Override me';
		},
		
		getExprVar: function() {
			throw 'Override me';
		},
		
		getConstant: function() {
			throw 'Override me';
		},
		
		copySubstitute: function(fnNodeMap) {
			throw 'Override me';
		}
	});
	
	// TODO Should we introduce ExprNode ?

	ns.ExprVar = Class.create(ns.Expr, {
		classLabel: 'ExprVar',

		initialize: function(v) {
			this.v = v;
		},
		
		copySubstitute: function(fnNodeMap) {
			var node = fnNodeMap(this.v);
			
			var result;
			if(node == null) {
			    result = this;
			} else if(node.isVariable()) {
			    result = new ns.ExprVar(node); 
			} else {
			    result = sparql.NodeValue.makeNode(node);
			}
			
			//var result = (n == null) ? this : //node;//rdf.NodeValue.makeNode(node); 
			
			return result;
			//return new ns.ExprVar(this.v.copySubstitute(fnNodeMap));
			//return this;
		},

		getArgs: function() {
			return [];
		},
		
		copy: function(args) {
			if(args && args.length > 0) {
				throw "Invalid argument";
			}

			var result = new ns.ExprVar(this.v);
			return result;
		},
	
		isVar: function() {
			return true;
		},
		
		getExprVar: function() {
			return this;
		},
		
		asVar: function() {
			return this.v;
		},
		
		getVarsMentioned: function() {
			return [this.v];
		},
		
		toString: function() {
			return "" + this.v;
		}
	});

	ns.ExprFunction = Class.create(ns.Expr, {
	    getName: function() {
	        console.log('Implement me');
	        throw 'Implement me';
	    },
	    
		isFunction: function() {
			return true;
		},

		getFunction: function() {
			return this;
		}
	});

	ns.ExprFunctionBase = Class.create(ns.ExprFunction, {
	    initialize: function(name) {
	        this.name = name;
	    }
	});
	
	ns.ExprFunction0 = Class.create(ns.ExprFunctionBase, {
	    initialize: function($super, name) {
	        $super(name);
	    },

		getArgs: function() {
			return [];
		},

		copy: function(args) {
			if(args && args.length > 0) {
				throw "Invalid argument";
			}
			
			var result = this.$copy(args);
			return result;
		},

		toString: function() {
            var result = this.name + '(' + this.getArgs().join(', ') + ')';
            return result;
        }		
	});


	ns.ExprFunction1 = Class.create(ns.ExprFunction, {
		initialize: function($super, name, subExpr) {
		    $super(name);
			this.subExpr = subExpr;
		},
		
		getArgs: function() {
			return [this.subExpr];
		},

		copy: function(args) {
			if(args.length != 1) {
				throw "Invalid argument";
			}
			
			var result = this.$copy(args);
			return result;
		},
		
		getSubExpr: function() {
			return this.subExpr;
		}
	});


	ns.ExprFunction2 = Class.create(ns.ExprFunctionBase, {
		initialize: function($super, name, left, right) {
			$super(name);
		    this.left = left;
			this.right = right;
		},
		
		getArgs: function() {
			return [this.left, this.right];
		},

		copy: function(args) {
			if(args.length != 2) {
				throw "Invalid argument";
			}
			
			var result = this.$copy(args[0], args[1]);
			return result;
		},
		
		getLeft: function() {
			return this.left;
		},
		
		getRight: function() {
			return this.right;
		},
		
	    getVarsMentioned: function() {
	        var result = ns.PatternUtils.getVarsMentioned(this.getArgs());
	        return result;
	    }	    
	});
	


// TODO Change to ExprFunction1
	ns.E_OneOf = Class.create(ns.Expr, {
	    // TODO Jena uses an ExprList as the second argument
		initialize: function(lhsExpr, nodes) {
		
		    this.lhsExpr = lhsExpr;
			//this.variable = variable;
			this.nodes = nodes;
		},
	
		getVarsMentioned: function() {
			//return [this.variable];
		    var result = this.lhsExpr.getVarsMentioned();
		    return result;
		},
	
		copySubstitute: function(fnNodeMap) {		
			var newElements = _.map(this.nodes, function(x) { return rdf.getSubstitute(x, fnNodeMap); });
			return new ns.E_OneOf(this.lhsExpr.copySubstitute(fnNodeMap), newElements);
		},
	
		toString: function() {
		
			if(!this.nodes || this.nodes.length === 0) {
				// 
				return "FALSE";
			} else {		
				return "(" + this.lhsExpr + " In (" + this.nodes.join(", ") + "))";
			}
		}
	});

	//ns.E_In = ns.E_OneOf
	
	ns.E_Str = Class.create(ns.ExprFunction1, {
		initialize: function($super) {
			$super('str');
		}, 
		
		copySubstitute: function(fnNodeMap) {
			return new ns.E_Str(this.subExpr.copySubstitute(fnNodeMap));
		},

		getVarsMentioned: function() {
			return this.subExpr.getVarsMentioned();
		},
	
	
		$copy: function(args) {
			return new ns.E_Str(args[0]);
		},
	
		toString: function() {
			return "str(" + this.subExpr + ")";
		}
	});
	
	
	ns.E_Regex = function(expr, pattern, flags) {
		this.expr = expr;
		this.pattern = pattern;
		this.flags = flags;
	};
		
	ns.E_Regex.prototype = {
			copySubstitute: function(fnNodeMap) {
				return new ns.E_Regex(this.expr.copySubstitute(fnNodeMap), this.pattern, this.flags);
			},
	
			getVarsMentioned: function() {
				return this.expr.getVarsMentioned();
			},
	
			getArgs: function() {
				return [this.expr];
			},
	
			copy: function(args) {
				if(args.length != 1) {
					throw "Invalid argument";
				}
		
				var newExpr = args[0];
				var result = new ns.E_Regex(newExpr, this.pattern, this.flags);
				return result;
			},
	
	
		toString: function() {		
			var patternStr = this.pattern.replace("'", "\\'");
			var flagsStr = this.flags ? ", '" + this.flags.replace("'", "\\'") + "'" : "";
	
			
			return "Regex(" + this.expr + ", '" + patternStr + "'" + flagsStr + ")"; 
		}
	};
	
	
	
	ns.E_Like = function(expr, pattern) {
		this.expr = expr;
		this.pattern = pattern;
	};
		
	ns.E_Like.prototype = {
			copySubstitute: function(fnNodeMap) {
				return new ns.E_Like(this.expr.copySubstitute(fnNodeMap), this.pattern);
			},
	
			getVarsMentioned: function() {
				return this.expr.getVarsMentioned();
			},
	
			getArgs: function() {
				return [this.expr];
			},
	
			copy: function(args) {

				var result = ns.newUnaryExpr(ns.E_Like, args);
				return result;
			},
	
	
		toString: function() {		
			var patternStr = this.pattern.replace("'", "\\'");
	
			
			return "(" + this.expr + " Like '" + patternStr + "')"; 
		}
	};
	


	ns.E_Function = Class.create(ns.Expr, {
	    initialize: function(functionIri, args) {
    		this.functionIri = functionIri;
    		this.args = args;
    	},
	
    	copySubstitute: function(fnNodeMap) {
    		var newArgs = _(this.args).map(function(arg) {
    		    var r = arg.copySubstitute(fnNodeMap);
    		    return r;
    		});
    		
    		return new ns.E_Function(this.functionIri, newArgs);
    	},
	
    	getArgs: function() {
    	    return this.args;
    	},
	
    	copy: function(newArgs) {
    	    return new ns.E_Function(this.functionIri, newArgs);
    	},
	
    	toString: function() {
    		var argStr = this.args.join(", ");
    		
    		// TODO HACK for virtuoso and other cases
    		// If the functionIri contains a ':', we assume its a compact iri
    		var iri = '' + this.functionIri;
    		var fnName = (iri.indexOf(':') < 0) ? '<' + iri + '>' : iri;  
    		
    		var result = fnName + '(' + argStr + ')';
    		return result;
    	},
    	
    	getVarsMentioned: function() {
            var result = ns.PatternUtils.getVarsMentioned(this.getArgs());
            return result;
    	}
	});
	
	
	ns.E_Equals = Class.create(ns.ExprFunction2, {
	    initialize: function($super, left, right) {
	        $super('=', left, right);
	    },
	    
		copySubstitute: function(fnNodeMap) {
//		    if(!this.right.copySubstitute) {
//		        debugger;
//		    }
			return new ns.E_Equals(this.left.copySubstitute(fnNodeMap), this.right.copySubstitute(fnNodeMap));
		},	
	
		$copy: function(left, right) {
			return new ns.E_Equals(left, right);
		},
	
		toString: function() {
			return "(" + this.left + " = " + this.right + ")";
		},
	
		eval: function(binding) {
			// TODO Evaluate the expression
		}
	});

	
	ns.E_LangMatches = function(left, right) {
		this.left = left;
		this.right = right;		
	};
	
	ns.E_LangMatches.prototype = {
			copySubstitute: function(fnNodeMap) {
				return new ns.E_LangMatches(this.left.copySubstitute(fnNodeMap), this.right.copySubstitute(fnNodeMap));
			},

			getArgs: function() {
				return [this.left, this.right];
			},
			
			copy: function(args) {
				return ns.newBinaryExpr(ns.E_LangMatches, args);
			},
			
			toString: function() {
				return "langMatches(" + this.left + ", " + this.right + ")";
			},
			
			getVarsMentioned: function() {
			    var result = ns.PatternUtils.getVarsMentioned(this.getArgs());
			    return result;
			}
	};
	

	ns.E_Lang = function(expr) {
		this.expr = expr;		
	};
	
	ns.E_Lang.prototype = {
			copySubstitute: function(fnNodeMap) {
				return new ns.E_Lang(this.expr.copySubstitute(fnNodeMap));
			},

			getArgs: function() {
				return [this.expr];
			},
			
			copy: function(args) {
				var result = ns.newUnaryExpr(ns.E_Lang, args);
				return result;
			},
			
			toString: function() {
				return "lang(" + this.expr + ")";
			},
			
			getVarsMentioned: function() {
			    return this.expr.getVarsMentioned();
			}
	};
	
	ns.E_Bound = function(expr) {
		this.expr = expr;		
	};
	
	ns.E_Bound.prototype = {
			copySubstitute: function(fnNodeMap) {
				return new ns.E_Bound(fnNodeMap(this.expr));
			},

			getArgs: function() {
				return [this.expr];
			},
			
			copy: function(args) {
				var result = ns.newUnaryExpr(ns.E_Bound, args);
				return result;
			},
			
			toString: function() {
				return "bound(" + this.expr + ")";
			}
	};
	
	
	
	
	ns.E_GreaterThan = Class.create(ns.ExprFunction2, {
	    initialize: function($super, left, right) {
	        $super('>', left, right);
	    },

	    copySubstitute: function(fnNodeMap) {
	        return new ns.E_GreaterThan(this.left.copySubstitute(fnNodeMap), this.right.copySubstitute(fnNodeMap));
	    },

//	    getArgs: function() {
//    		return [this.left, this.right];
//    	},
	
    	copy: function(args) {
    	    return ns.newBinaryExpr(ns.E_GreaterThan, args);
    	},
	
    	toString: function() {
    	    return "(" + this.left + " > " + this.right + ")";
    	}
	});

	ns.E_LessThan = Class.create(ns.ExprFunction2, {
        initialize: function($super, left, right) {
            $super('<', left, right);
        },

        copySubstitute: function(fnNodeMap) {
            return new ns.E_LessThan(this.left.copySubstitute(fnNodeMap), this.right.copySubstitute(fnNodeMap));
        },

//        getArgs: function() {
//            return [this.left, this.right];
//        },
	
        copy: function(args) {
            return ns.newBinaryExpr(ns.E_LessThan, args);
        },

        toString: function() {
            return "(" + this.left + " < " + this.right + ")";
        }
    });
	
	ns.E_LogicalAnd = Class.create(ns.ExprFunction2, {
        initialize: function($super, left, right) {
            $super('&&', left, right);
        },

	    copySubstitute: function(fnNodeMap) {
	        // return new ns.E_LogicalAnd(fnNodeMap(this.left), fnNodeMap(this.right));
	        return new ns.E_LogicalAnd(this.left.copySubstitute(fnNodeMap), this.right.copySubstitute(fnNodeMap));
	    },
	
//	    getArgs: function() {
//	        return [this.left, this.right];
//	    },
	
	    copy: function(args) {
	        return ns.newBinaryExpr(ns.E_LogicalAnd, args);
	    },
	
	    toString: function() {
	        return "(" + this.left + " && " + this.right + ")";
	    }	    
	});
	
	ns.E_LogicalOr = Class.create(ns.ExprFunction2, {
        initialize: function($super, left, right) {
            $super('||', left, right);
        },

	    copySubstitute: function(fnNodeMap) {
	        return new ns.E_LogicalOr(this.left.copySubstitute(fnNodeMap), this.right.copySubstitute(fnNodeMap));
	    },
	
	    getArgs: function() {
	        return [this.left, this.right];
	    },
	
	    copy: function(args) {
	        return ns.newBinaryExpr(ns.E_LogicalOr, args);
	    },

	    toString: function() {
	        return "(" + this.left + " || " + this.right + ")";
	    }	    
    });



	ns.E_LogicalNot = function(expr) {
		this.expr = expr;
	};

	ns.E_LogicalNot.prototype = {
			copySubstitute: function(fnNodeMap) {
				return new ns.E_LogicalNot(this.expr.copySubstitute(fnNodeMap));
			},

			getArgs: function() {
				return [this.left, this.right];
			},
			
			copy: function(args) {
				return ns.newBinaryExpr(ns.E_LogicalOr, args);
			},

			toString: function() {
				return "(!" + this.expr + ")";
			}
	};

	
	
	
	/**
	 * If null, '*' will be used
	 * 
	 * TODO Not sure if modelling aggregate functions as exprs is a good thing to do.
	 * 
	 * @param subExpr
	 * @returns {ns.E_Count}
	 */
	ns.E_Count = function(subExpr, isDistinct) {
		this.subExpr = subExpr;
		this.isDistinct = isDistinct ? isDistinct : false;
	};

	ns.E_Count.prototype.copySubstitute = function(fnNodeMap) {
		var subExprCopy = this.subExpr ? this.subExpr.copySubstitute(fnNodeMap) : null;
		
		return new ns.E_Count(subExprCopy, this.isDistinct);
	};
	
	ns.E_Count.prototype.toString = function() {		
		return "Count(" + (this.isDistinct ? "Distinct " : "") + (this.subExpr ? this.subExpr : "*") +")";
	};



	ns.E_Min = function(subExpr) {
		this.subExpr = subExpr;
	};

	ns.E_Min.prototype.copySubstitute = function(fnNodeMap) {
		var subExprCopy = this.subExpr ? this.subExpr.copySubstitute(fnNodeMap) : null;
		
		return new ns.E_Min(subExprCopy);
	};
	
	ns.E_Min.prototype.getArgs = function() {
		return [this.subExpr];
	};
	
	ns.E_Min.prototype.copy = function(args) {
		if(args.length != 1) {
			throw "Invalid argument";
		}

		var newSubExpr = args[0];

		var result = new ns.E_Min(newSubExpr);
	};

	ns.E_Min.prototype.toString = function() {		
		return "Min(" + this.subExpr + ")";
	};
	

	
	ns.E_Max = function(subExpr) {
		this.subExpr = subExpr;
	};

	ns.E_Max.prototype.copySubstitute = function(fnNodeMap) {
		var subExprCopy = this.subExpr ? this.subExpr.copySubstitute(fnNodeMap) : null;
		
		return new ns.E_Min(subExprCopy);
	};

	ns.E_Max.prototype.getArgs = function() {
		return [this.subExpr];
	};
	
	ns.E_Max.prototype.copy = function(args) {
		if(args.length != 1) {
			throw "Invalid argument";
		}

		var newSubExpr = args[0];

		var result = new ns.E_Max(newSubExpr);
	};
	
	ns.E_Max.prototype.toString = function() {		
		return "Max(" + this.subExpr + ")";
	};



	ns.ExprString = Class.create(ns.Expr, {
	    classLabel: 'jassa.sparql.ExprString',
	    
		initialize: function(sparqlString) {
			this.sparqlString = sparqlString;
		},
		
		copySubstitute: function(fnNodeMap) {
			var newSparqlString = this.sparqlString.copySubstitute(fnNodeMap);
			return new ns.ExprString(newSparqlString);
		},
		
		getVarsMentioned: function() {
			return this.sparqlString.getVarsMentioned();
		},

		getArgs: function() {
			return [];
		},
		
		copy: function(args) {
			if(args.length != 0) {
				throw "Invalid argument";
			}

			return this;
		},

		toString: function() {
			return "(!" + this.expr + ")";
		}				
	});
	
	ns.ExprString.create = function(str, varNames) {		
		var result = new ns.ExprString(ns.SparqlString.create(str, varNames));
		return result;
	};
	
	
	
	// TODO Not sure about the best way to design this class
	// Jena does it by subclassing for each type e.g. NodeValueDecimal
	
	// TODO Do we even need this class? There is NodeValueNode now!
	ns.NodeValue = Class.create(ns.Expr, {
		initialize: function(node) {
			this.node = node;
		},
		
		isConstant: function() {
			return true;
		},

		getConstant: function() {
			return this;
		},

		
		getArgs: function() {
			return [];
		},

		getVarsMentioned: function() {
			return [];
		},
		
		asNode: function() {
			throw "makeNode is not overridden";
		},
//		getNode: function() {
//			return this.node;
//		},

		copySubstitute: function(fnNodeMap) {
			// TODO Perform substitution based on the node value
			// But then we need to map a node to a nodeValue first...
			return this;
			//return new ns.NodeValue(this.node.copySubstitute(fnNodeMap));
		},
	
		toString: function() {
		    var node = this.node;

//		    var tmp = node.toString();
//		    if(tmp.indexOf('#string') > 0) {
//		        debugger;
//		    }
		    
		    var result;
		    if(node.isLiteral()) {
		        if(node.getLiteralDatatypeUri() === xsd.xstring.getUri()) {
		            result = '"' + node.getLiteralLexicalForm() + '"'; 
		        }
		        else if(node.dataType === xsd.xdouble.value) {
		            // TODO This is a hack - why is it here???
		            return parseFloat(this.node.value);		            
		        }
		    }
		    else {
		        result = node.toString();
		    }
			// TODO Numeric values do not need the full rdf term representation
			// e.g. "50"^^xsd:double - this method should output "natural/casual"
			// representations
			return result;
	
			/*
			var node = this.node;
			var type = node.type;
			
			switch(type) {
			case 1: return this.node.toString();
			case 2: return ns.valueFragment(node) + ns.languageFragment(node);
			case 3: return ns.valueFragment(node) + ns.datatypeFragment(node);
			default: {
					console.warn("Should not happen; type = " + node.type);
					break;
			}		
			}
			*/
		}
	});

	/**
	 * Static functions for ns.NodeValue
	 * 
	 * Note: It seems we could avoid all these specific sub types and 
	 * do something more generic
	 */
	_.extend(ns.NodeValue, {
			    
		createLiteral: function(val, typeUri) {
			var node = rdf.NodeFactory.createTypedLiteralFromValue(val, typeUri);
			var result = new ns.NodeValueNode(node);
			return result;
			
//			var dtype = rdf.RdfDatatypes[dtypeUri];
//			if(!dtype) {
//				console.log('[ERROR] No dtype for ' + dtypeUri);
//			}
//			
//			var lex = dtype.unparse(val);
//			var lang = null;
//			
//			var literalLabel = new rdf.LiteralLabel(val, lex, lang, dtype);
//			
//			var node = new rdf.Node_Literal(literalLabel);
//			
//			var result = new ns.NodeValueNode(node);
//			
//			return result;
		},
		
		
		makeString: function(str) {
			return ns.NodeValue.createLiteral(str, xsd.str.xstring);
		},
		
		makeInteger: function(val) {
			return new ns.NodeValue.createLiteral(val, xsd.str.xint);
		},

		makeDecimal: function(val) {
            return new ns.NodeValue.createLiteral(val, xsd.str.decimal);
        },
		
		makeFloat: function(val) {
			return new ns.NodeValue.createLiteral(val, xsd.str.xfloat);
		},
		
		makeNode: function(node) {
		    var result = new ns.NodeValueNode(node);
		    return result;

		    /*
		    var result;
		    if(node.isVariable()) {
		        return new ns.ExprVar(node);
 		    } else {
 		        result = new ns.NodeValueNode(node);
 		    }
		    return result;
		    */
		}

		
//		makeFloat: function(val) {
//			return new ns.NodeValueFloat(val);
//		}
	});
	
	
	
	ns.NodeValueNode = Class.create(ns.NodeValue, {
		initialize: function(node) {
			this.node = node;
		},
		
		asNode: function() {
			return this.node;
		},
		
		toString: function() {
		    var node = this.node;
		    
		    var result = null;
            if(node.isLiteral()) {
                if(node.getLiteralDatatypeUri() === xsd.xstring.getUri()) {
                    result = '"' + node.getLiteralLexicalForm() + '"'; 
                }
            }
            
            if(result == null) {
                result = node.toString();
            }

			return result;
		}
	});
	
    ns.NodeValue.nvNothing = ns.NodeValue.makeNode(rdf.NodeFactory.createAnon(new rdf.AnonIdStr('node value nothing')));

	
//	ns.NodeValueInteger = Class.create(ns.NodeValue, {
//		initialize: function(val) {
//			this.val = val;
//		},
//		
//		getInteger: function() {
//			return this.val;
//		},
//		
//		makeNode: function() {
//			var result = rdf.Node.typedLit(str, xsd.str.xstring);
//			return result;			
//		}
//	});
	
//	ns.NodeValueInteger = Class.create(ns.NodeValue, {
//		initialize: function(val) {
//			this.val = val;
//		},
//		
//		getInteger: function() {
//			return this.val;
//		},
//		
//		makeNode: function() {
//			var result = rdf.Node.typedLit(str, xsd.str.xstring);
//			return result;			
//		}
//	});
	
	
//	ns.NodeValueString = Class.create(ns.NodeValue, {
//		initialize: function(str) {
//			this.str = str
//		},
//		
//		
//		// Having a generic get type function is more extensible to custom types
//		// Yet, convenience functions for common types, such as isString(),
//		// would be quite nice from an API perspective
//		getType: function() {
//			return 'string';
//		},
//		
//		getString: function() {
//			return this.str;
//		},
//		
//		makeNode: function() {
//			var result = rdf.Node.typedLit(str, xsd.str.xstring);
//			return result;
//		}
//	});
	
	// Jena-style compatibility
//	ns.NodeValue.makeNode = function(node) {
//		return new ns.NodeValue(node);
//	};

	ns.valueFragment = function(node) {
		return '"' + node.value.toString().replace('"', '\\"') + '"';
	};
	
	ns.languageFragment = function(node) {
		return node.language ? "@" + node.language : "";
	};
	
	ns.datatypeFragment = function(node) {
		return node.dataType ? '^^<' + node.datatype + '>' : "";
	};
	

	
	
})();




	/*
	 * TODO E_Cast should be removed -
	 * a cast expression should be modeled as a function taking a single argument which is the value to cast.
	 * 
	 */
//	
//	ns.E_Cast = function(expr, node) {
//		this.expr = expr;
//		this.node = node;
//	};
//	
//	ns.E_Cast.prototype.copySubstitute = function(fnNodeMap) {
//		return new ns.E_Cast(this.expr.copySubstitute(fnNodeMap), this.node.copySubstitute(fnNodeMap));		
//	};
//	


//ns.E_Cast.prototype.getVarsMentioned = function() {
//var result = this.expr.getVarsMentioned();
//
//// Note: Actually a variable is invalid in the node postition 
//if(node.isVar()) {
//	result.push(result);
//}
//
//return result;
//};
//
//ns.E_Cast.prototype.getArgs = function() {
//return [this.expr];
//};
//
//ns.E_Cast.prototype.copy = function(args) {
//if(args.length != 1) {
//	throw "Invalid argument";
//}
//
//var result =new ns.E_Cast(args[0], this.node);
//return result;
//};
//
//ns.E_Cast.prototype.toString = function() {
//return this.node + "(" + this.expr + ")";
//};
/**
 * Problem:
 * Somehow there needs to be an interface to build queries, but at the same time there needs
 * to be a way to execute them.
 * 
 * Having something like Jena's Query object in js would be really really neat.
 * 
 * 
 *  
 * 
 * @returns
 */

(function() {

	var rdf = Jassa.rdf;
	var xsd = Jassa.vocab.xsd;

	
	var util = Jassa.util;

	var ns = Jassa.sparql;

	
	//var strings = Namespace("org.aksw.ssb.utils.strings");
	//var strings = require('underscore.strings');
	
	
	
	/**
	 * A binding is a map from variables to entries.
	 * An entry is a on object {v: sparql.Var, node: sparql.Node }
	 * 
	 * The main speciality of this object is that
	 * .entries() returns a *sorted* array of variable bindings (sorted by the variable name).
	 *  .toString() re-uses the ordering.
	 *  
	 * This means, that two bindings are equal if their strings are equal.
	 *  
	 * TODO We could generalize this behaviour into some 'base class'. 
	 *  
	 * 
	 */
	ns.Binding = function(varNameToEntry) {
		this.varNameToEntry = varNameToEntry ? varNameToEntry : {};
	};
	
	/**
	 * Create method in case the variables are not objects
	 * 
	 * TODO Replace with an ordinary hashMap.
	 */
	ns.Binding.create = function(varNameToNode) {
		
		var tmp = {};
		_.map(varNameToNode, function(node, vStr) {
			tmp[vStr] = {v: ns.Node.v(vStr), node: node};
		});
		
		var result = new ns.Binding(tmp);
		return result;
	};
	
	ns.Binding.fromTalisJson = function(b) {
		
		var tmp = {};
		_.each(b, function(val, k) {
			//var v = rdf.Node.v(k);
			var node = rdf.NodeFactory.createFromTalisRdfJson(val);
			tmp[k] = node;
		});
		
		var result = ns.Binding.create(tmp);
		
		return result;
	};
	
	ns.Binding.prototype = {
		put: function(v, node) {
			this.varNameToEntry[v.getName()] = {v: v, node: node};
		},
		
		get: function(v) {
		    if(!(v instanceof rdf.Var)) {
		        throw 'var not an instance of Var';
		    }
		    var varName = v.getName();
		    
			var entry = this.varNameToEntry[varName];
			
			var result = entry ? entry.node : null;
			
			return result;
		},
	
		entries: function() {
			var tmp = _.values(this.varNameToEntry);
			var result = _.sortBy(tmp, function(entry) { return entry.v.getName(); });
			//alert(JSON.stringify(result));
			return result;
		},
	
		toString: function() {
			var e = this.entries();
			
			//var result = "[" + e.join()
			
			var tmp = _.map(e, function(item) {
				return '"' + item.v.getName() + '": "' + item.node + '"';  
			});
			
			var result = '{' + tmp.join(', ') + '}'; 

			return result;
		},
		
		getVars: function() {
			var result = [];

			_(this.varNameToEntry).each(function(entry) {
				result.push(entry.v);
			});
			
			return result;
		}
		
//		getVarNames: function() {
//		    var result = this.getVars().map(function(v) { return v.getName(); });
//		    return result;
//		}
	};

	

		
	ns.orify = function(exprs) {
		var result = ns.opify(exprs, ns.E_LogicalOr);
		return result;
	};

	ns.andify = function(exprs) {
		var result = ns.opify(exprs, ns.E_LogicalAnd);
		return result;
	};

	
	/**
	 * Deprecated
	 * 
	 * This object is overridden by opifyBalanced
	 * 
	 */
	ns.opify = function(exprs, fnCtor) {
		var open = exprs;
		var next = [];
		
		while(open.length > 1) {
		
			for(var i = 0; i < open.length; i+=2) {
				
				var a = open[i];
	
				if(i + 1 == open.length) {
					next.push(a);
					break;
				}
				
				var b = open[i + 1];
		
				var newExpr = fnCtor(a, b);
				
				next.push(newExpr); //;new ns.E_LogicalOr(a, b));
			}
			
			var tmp = open;
			open = next;
			next = [];
		}
		
		return open;
	};
	

	
	ns.uniqTriples = function(triples) {
		var result =  _.uniq(triples, false, function(x) { return x.toString(); });
		return result;
	};
	
	/**
	 * Combine two arrays of triples into a singe one with duplicates removed
	 * 
	 */
	ns.mergeTriples = function(a, b) {
		var combined = a.concat(b);		
		var result = ns.uniqTriples(combined);
		return result;		
	};
	
	
	//console.log("The namespace is: ", ns);
	
	//var ns = {};
	
	ns.varPattern = /\?(\w+)/g;
	//ns.prefixPattern =/(^|\s+)(\w+):\w+(\s+|$)/g;
	ns.prefixPattern =/((\w|-)+):(\w|-)+/g;

	ns.extractVarNames = function(vars) {
		var result = [];
		for(var i = 0; i < vars.length; ++i) {
			var v = vars[i];
			
			result.push(v.getName());
		}

		return result;
	};
	
	/**
	 * Extract SPARQL variables from a string
	 * 
	 * @param str
	 * @returns {Array}
	 */
	ns.extractSparqlVars = function(str) {
		var varNames = ns.extractAll(ns.varPattern, str, 1);
		var result = [];
		for(var i = 0; i < varNames.length; ++i) {
			var varName = varNames[i];
			var v = ns.Node.v(varName);
			result.push(v);
		}
		
		return result;
	};

	ns.extractPrefixes = function(str) {
		return ns.extractAll(ns.prefixPattern, str, 1);	
	};
	
	/**
	 * Return a new string with prefixes expanded
	 * 
	 * Yes, it sucks doing it without a proper parser...
	 * And yes, the Java world is so much better, it doesn't even compare to this crap here
	 * 
	 */
	ns.expandPrefixes = function(prefixes, str) {
		var usedPrefixes = ns.extractPrefixes(str);

		
		var result = str;
		for(var i = 0; i < usedPrefixes.length; ++i) {
			var prefix = usedPrefixes[i];
			
			var url = prefixes[prefix];
			if(!url) {
				continue;
			}
			

			// TODO Add a cache
			var re = new RegExp(prefix + ':(\\w+)', 'g');

			result = result.replace(re, '<' + url + '$1>');
			//console.log(result + ' prefixes' + prefix + url);

		}
		
		return result;
	};


	ns.extractAll = function(pattern, str, index) {
		// Extract variables from the fragment	
		var match;
		var result = [];
		
		while (match = pattern.exec(str)) {
			result.push(match[index]);
		}
		
		result = _.uniq(result);
		
		return result;
		
	};
	
	/*
	ns.parseJsonRs = function(jsonRs) {
		var bindings = jsonRs.results.bindings;
		
		var bindings = jsonRs.results.bindings;
		
		var tmpUris = {};
		for(var i = 0; i < bindings.length; ++i) {

			var binding = bindings[i];
			
			var newBinding = {};
			
			$.each(binding, function(varName, node) {
				var newNode = node ? null : Node.parseJson(node);
				
				newBinding[varName] = newNode;
			});
			
			bindings[i] = newBinding;
		}
	};
	*/
	
	
	

	
	ns.BasicPattern = function(triples) {
		this.triples = triples ? triples : [];
	};
	
	ns.BasicPattern.prototype.copySubstitute = function(fnNodeMap) {
		var newElements = _.map(this.triples, function(x) { return x.copySubstitute(fnNodeMap); });
		return new ns.BasicPattern(newElements);
	};
	
	ns.BasicPattern.prototype.toString = function() {
		return this.triples.join(" . "); 
	};

	/*
	ns.BasicPattern.prototype.copySubstitute = function() {

	};
	*/
	
	ns.Template = function(bgp) {
		this.bgp = bgp;
	};

	ns.Template.prototype.copySubstitute = function(fnNodeMap) {
		return new ns.Template(this.bgp.copySubstitute(fnNodeMap));
	};
	
	ns.Template.prototype.toString = function() {
		return "{ " + this.bgp + " }";
	};
	
	
    ns.Element = Class.create({

    });
	    

	
	ns.ElementNamedGraph = Class.create(ns.Element, {
	    
	    classLabel: 'jassa.sparql.ElementNamedGraph',
	    
	    initialize: function(element, namedGraphNode) {
	        this.element = element;
	        this.namedGraphNode = namedGraphNode;
	    },
	
		getArgs: function() {
			return [this.element];
		},
	
		copy: function(args) {
			if(args.length != 1) {
				throw "Invalid argument";
			}
		
			var newElement = args[0];
			var result = new ns.ElementNamedGraph(newElement, this.namedGraphNode);
			return result;
		},
	
		toString: function() {
			return "Graph " + this.namedGraphNode + " { " + this.element + " }";
		},
	
		copySubstitute: function(fnNodeMap) {
			return new ns.ElementNamedGraph(this.element.copySubstitute(fnNodeMap), this.namedGraphNode.copySubstitute(fnNodeMap));
		},
	
		getVarsMentioned: function() {
		
			var result = this.element.getVarsMentioned();
			if(this.namedGraphNode.isVar()) {
				_.union(result, [this.namedGraphNode]);
			}
		
			return result;
		},
	
		flatten: function() {
			return new ns.ElementNamedGraph(this.element.flatten(), this.namedGraphNode);
		}
	});
	

		

	
	
	/**
	 * An element that injects a string "as is" into a query.
	 * 
	 */
	ns.ElementString = Class.create(ns.Element, {
	    classLabel: 'jassa.sparql.ElementString',
	    
		initialize: function(sparqlString) {
//			if(_(sparqlString).isString()) {
//				debugger;
//			}
			this.sparqlString = sparqlString;	
		},
 
		getArgs: function() {
			return [];
		},
	
		copy: function(args) {
			if(args.length != 0) {
				throw "Invalid argument";
			}
			
			// FIXME: Should we clone the attributes too?
			//var result = new ns.ElementString(this.sparqlString);
			return this;
			//return result;
		},
	
		toString: function() {
			return this.sparqlString.getString();
		},

		copySubstitute: function(fnNodeMap) {
			var newSparqlString = this.sparqlString.copySubstitute(fnNodeMap);
			return new ns.ElementString(newSparqlString);
		},
	
		getVarsMentioned: function() {
			return this.sparqlString.getVarsMentioned();
		},
	
		flatten: function() {
			return this;
		}
	});


	ns.ElementString.create = function(str, varNames) {
		var result = new ns.ElementString(ns.SparqlString.create(str, varNames));
		return result;
	};
	
	/*
	ns.ElementSubQueryString = function(value) {
		this.value = value;
	};
	
	ns.ElementSubQueryString = function(value) {
		
	}
	*/
	
	
	ns.ElementSubQuery = Class.create(ns.Element, {
	    classLabel: 'jassa.sparql.ElementSubQuery',

	    initialize: function(query) {
	        this.query = query;
	    },

	    getArgs: function() {
			return [];
		},
	
		copy: function(args) {
			if(args.length != 0) {
				throw "Invalid argument";
			}
			
			// FIXME: Should we clone the attributes too?
      // FIXME: query not defined
			var result = new ns.ElementSubQuery(query);
			return result;
		},
	
		toString: function() {
			return "{ " + this.query + " }";
		},

		copySubstitute: function(fnNodeMap) {
			return new ns.ElementSubQuery(this.query.copySubstitute(fnNodeMap));
		},
	
		flatten: function() {
			return new ns.ElementSubQuery(this.query.flatten());
		},
		
		getVarsMentioned: function() {
		    return this.query.getVarsMentioned();
		}
	});
	
	ns.ElementFilter = Class.create(ns.Element, {
	    classLabel: 'jassa.sparql.ElementFilter',

	    initialize: function(expr) {
    	    if(_(expr).isArray()) {
    	        console.log('[WARN] Array argument for filter is deprecated');
    	        expr = ns.andify(expr);
    	    }
    	    
    		this.expr = expr;
	    },
	
		getArgs: function() {
			return [];
		},
	
		copy: function(args) {
			if(args.length != 0) {
				throw "Invalid argument";
			}
		
		// 	FIXME: Should we clone the attributes too?
			var result = new ns.ElemenFilter(this.expr);
			return result;
		},
	
		copySubstitute: function(fnNodeMap) {
//			var exprs = _(this.exprs).map(function(expr) {
//				return expr.copySubstitute(fnNodeMap);
//			});

		    var newExpr = this.expr.copySubstitute(fnNodeMap);
			return new ns.ElementFilter(newExpr);
		},

		getVarsMentioned: function() {
//            _(this.elements).reduce(function(memo, element) {
//                var evs = element.getVarsMentioned();
//                var r = _(memo).union(evs);
//                return r;
//            }, result);
		    //console.log('filter expr ', this.expr);
			return this.expr.getVarsMentioned();
		},
	
		flatten: function() {
			return this;
		},
	
		toString: function() {
			
			//var expr = ns.andify(this.exprs);
			
			return "Filter(" + this.expr + ")";
		}
	});
	
	
	ns.ElementOptional = Class.create(ns.Element, {
	    classLabel: 'jassa.sparql.ElementOptional',
	    
	    initialize: function(element) {
	        this.optionalPart = element;
	    },
	
		getArgs: function() {
			return [this.optionalPart];
		},
	
		copy: function(args) {
			if(args.length != 1) {
				throw "Invalid argument";
			}
			
			// FIXME: Should we clone the attributes too?
			var result = new ns.ElementOptional(this.expr);
			return result;
		},
	
		getVarsMentioned: function() {
			return this.optionalPart.getVarsMentioned();
		},

		copySubstitute: function(fnNodeMap) {
			return new ns.ElementOptional(this.optionalPart.copySubstitute(fnNodeMap));
		},
	
		flatten: function() {
			return new ns.ElementOptional(this.optionalPart.flatten());
		},
	
		toString: function() {
			return "Optional {" + this.optionalPart + "}";
		}
	});
	
	
	ns.ElementUnion = Class.create(ns.Element, {
	    classLabel: 'jassa.sparql.ElementUnion',

	    initialize: function(elements) {
	        this.elements = elements ? elements : [];
	    },

		getArgs: function() {
			return this.elements;
		},
	
		copy: function(args) {		
			var result = new ns.ElementUnion(args);
			return result;
		},
	
		getVarsMentioned: function() {
			var result = [];
			for(var i in this.elements) {
				result = _.union(result, this.elements[i].getVarsMentioned());
			}
			return result;
		},

		copySubstitute: function(fnNodeMap) {
			var tmp = _.map(this.elements, function(element) { return element.copySubstitute(fnNodeMap); });
		
			return new ns.ElementUnion(tmp);		
		},
	
		flatten: function() {
			var tmp = _.map(this.elements, function(element) { return element.flatten(); });
			
			return new ns.ElementUnion(tmp);
		},
	
		toString: function() {
			return "{" + this.elements.join("} Union {") + "}";
		}
	});

	
	ns.ElementTriplesBlock = Class.create(ns.Element, {
	    classLabel: 'jassa.sparql.ElementTriplesBlock',

	    initialize: function(triples) {
	        this.triples = triples ? triples : [];
	    },

	    getArgs: function() {
			return [];
		},

		copy: function(args) {
			if(args.length != 0) {
				throw "Invalid argument";
			}
	
			var result = new ns.ElementTriplesBlock(this.triples);
			return result;
		},

		getTriples: function() {
			return this.triples;
		},

		addTriples: function(otherTriples) {
			this.triples = this.triples.concat(otherTriples);
		},

		uniq: function() {
			this.triples = ns.uniqTriples(this.triples);
	//this.triples = _.uniq(this.triples, false, function(x) { return x.toString(); });
		},

		copySubstitute: function(fnNodeMap) {
			var newElements = _.map(this.triples, function(x) { return x.copySubstitute(fnNodeMap); });
			return new ns.ElementTriplesBlock(newElements);
		},

		getVarsMentioned: function() {
			var result = [];
			_.each(this.triples, function(triple) {
				result = _.union(result, triple.getVarsMentioned());				
			});

			return result;
		},

		flatten: function() {
			return this;
		},
	
		toString: function() {
			return this.triples.join(" . ");
		}
	});
	

	ns.ElementGroup = Class.create(ns.Element, {
	    classLabel: 'jassa.sparql.ElementGroup',

	    initialize: function(elements) {
		    this.elements = elements ? elements : [];
	    },

	    getArgs: function() {
			return this.elements;
		},
	
		copy: function(args) {
			var result = new ns.ElementTriplesBlock(args);
			return result;
		},
	
		copySubstitute: function(fnNodeMap) {
			var newElements = _.map(this.elements, function(x) { return x.copySubstitute(fnNodeMap); });
			return new ns.ElementGroup(newElements);
		},
	
		getVarsMentioned: function() {
			var result = ns.PatternUtils.getVarsMentioned(this.elements);
			return result;
//			var result = [];
//			for(var i in this.elements) {
//				result = _.union(result, this.elements[i].getVarsMentioned());
//			}
//			return result;
		},

		toString: function() {
			//return this.elements.join(" . ");
			return ns.joinElements(" . ", this.elements);
		},
		
	
		flatten: function() {
			var processed = ns.ElementUtils.flatten(this.elements); 
	
			if(processed.length === 1) {
				return processed[0];
			} else {
				return new ns.ElementGroup(ns.ElementUtils.flattenElements(processed));
			}
		}
	});
	
	

	
	ns.joinElements = function(separator, elements) {
		var strs = _.map(elements, function(element) { return "" + element; });
		var filtered = _.filter(strs, function(str) { return str.length != 0; });
		
		return filtered.join(separator);
	};
	
	
	ns.newUnaryExpr = function(ctor, args) {
		if(args.length != 1) {
			throw "Invalid argument";
		}

		var newExpr = args[0];
		
		var result = new ctor(newExpr);
		return result;		
	};
	
	
	ns.newBinaryExpr = function(ctor, args) {
		if(args.length != 2) {
			throw "Invalid argument";
		}

		var newLeft = args[0];
		var newRight = args[1];
		
		var result = new ctor(newLeft, newRight);
		return result;		
	};
	

	
	
	
	/*
	 * Not used. Distinct is part of the query object - or at least I hope it to be.
	 */
//	ns.E_Distinct = function(subExpr) {
//		this.subExpr = subExpr;
//	};
//
//	ns.E_Distinct.prototype.copySubstitute = function(fnNodeMap) {
//		return new ns.E_Distinct(this.subExpr.copySubstitute(fnNodeMap));
//	};
//	
//	ns.E_Distinct.prototype.getArgs = function() {
//		return [this.subExpr];
//	};
//	
//	ns.E_Distinct.prototype.copy = function(args) {
//		return new ns.E_Count(this.subExpr);
//	};
//
//	
//	ns.E_Distinct.prototype.toString = function() {
//		return "Distinct(" + this.subExpr +")";
//	};

	
//	ns.ExprVar = function(v) {
//		this.v = v;
//	};
//	
//	ns.ExprVar.prototype = {
//		classLabel: 'ExprVar',
//			
//		copySubstitute: function(fnNodeMap) {
//			return new ns.ExprVar(this.v.copySubstitute(fnNodeMap));
//		},
//
//		getArgs: function() {
//			return [];
//		},
//
//		copy: function(args) {
//			if(args && args > 0) {
//				throw "Invalid argument";
//			}
//	
//			var result = new ns.ExprVar(this.v);
//			return result;
//		},
//
//		toString: function() {
//			return "" + this.v;
//		},
//		
//		accept: function(visitor) {
//			var fn = visitor["visit" + this.classLabel];
//
//			var args = [this].concat(arguments.slice(1));
//			var result = fn.apply(visitor, args);
//			return result;
//		}
//	};

	

	
	ns.QueryType = {};
	ns.QueryType.Unknown = -1;
	ns.QueryType.Select = 0;
	ns.QueryType.Construct = 1;
	ns.QueryType.Ask = 2;
	ns.QueryType.Describe = 3;
	
	
	// TODO Duplication - ns.Order and ns.SortCondition are the same - the latter should be retained!
//	ns.OrderDir = {};
//	ns.OrderDir.Asc = 0;
//	ns.OrderDir.Desc = -1;
//	
//	ns.Order = function(expr, direction) {
//		this.expr = expr;
//		this.direction = direction ? direction : ns.OrderDir.Asc;
//	};
//	
//	ns.Order.prototype.toString = function() {
//		
//		var result = "" + this.expr;
//		
//		if(this.direction == ns.OrderDir.Desc) {
//			result = "Desc(" + result + ")";
//		}
//		
//		return result;
//	};
//	

	// http://jena.apache.org/documentation/javadoc/arq/com/hp/hpl/jena/sparql/core/VarExprList.html
	ns.VarExprList = Class.create({
	    classLabel: 'jassa.sparql.VarExprList',

	    initialize: function() {
	        this.vars = [];
	        this.varToExpr = {};
	    },

	    
	    // TODO Deprecate
		getVarList: function() {
			return this.vars;
		},
		
		getVars: function() {
		    return this.vars;  
		},
			
		getExprMap: function() {
			return this.varToExpr;
		},

		add: function(v, expr) {
		    if(this.contains(v)) {
		       console.log('VarExprList already contained ' + v);
		       throw 'Bailing out';
		    }
		    
			this.vars.push(v);
			
			if(expr) {
				this.varToExpr[v.getName()] = expr;
			}
		},
		
		contains: function(v) {
		    var result = _(this.vars).some(function(item) {
		        var r = v.equals(item);
		        return r;
		    });
		    
		    return result;
		},
		
		getExpr: function(v) {
		    var varName = v.getName();
		    var result = this.varToExpr[varName];
		    
		    return result;
		},
		
		// TODO Remove this method - add all is for another varExprList
		/*
		addAll: function(vars) {
		    console.log('DEPRECATED - DONT USE');
			this.vars.push.apply(this.vars, vars);
		},
		*/
		
		// Addition will overwrite existing vars
		addAll: function(varExprList) {
		    var vs = varExprList.getVars();
		    
		    var self = this;
		    _(vs).each(function(v) {
		        var expr = varExprList.getExpr(v);
		        self.add(v, expr);
		    });		    
		},
		
		entries: function() {
			var self = this;
			var result = _(this.vars).map(function(v) {
				var expr = self.varToExpr[v.getName()];

				//return expr;
				return {v: v, expr: expr};
			});
			
//			for(var i = 0; i < this.vars.length; ++i) {
//				var v = this.vars[i];
//				
//				result.push({v:v, expr:expr});
//			}

			return result;
		},
		
		copySubstitute: function(fnNodeMap) {
			var result = new ns.VarExprList();
			
			var entries = this.entries();
			for(var i = 0; i < entries.length; ++i) {
				var entry = entries[i];
				var newVar = fnNodeMap(entry.v);
				var newExpr = entry.expr ? entry.expr.copySubstitute(fnNodeMap) : null;
				
				result.add(newVar, newExpr);
			}
			
			return result;
		},
		
		toString: function() {
			var arr = [];
			var projEntries = this.entries();
			for(var i = 0; i < projEntries.length; ++i) {
				var entry = projEntries[i];
				var v = entry.v;
				var expr = entry.expr;
			
				if(expr) {
					arr.push("(" + expr + " As " + v + ")");
				} else {
					arr.push("" + v);				
				}
			}
			
			var result = arr.join(" ");
			return result;
		}
	});
	
	
	ns.SortCondition = Class.create({
	    classLabel: 'jassa.sparql.SortCondition',
	    
	    initialize: function(expr, direction) {
	        this.expr = expr;
	        this.direction = direction;
	    },

		getExpr: function() {
			return this.expr;
		},
		
		getDirection: function() {
			return this.direction;
		},
		
		toString: function() {
			var result;
			if(this.direction >= 0) {
				result = "Asc(" + this.expr + ")";
			} else if(this.direction < 0) {
				result = "Desc(" + this.expr + ")";
			}
			
			return result;
		},
		
		copySubstitute: function(fnNodeMap) {
			var exprCopy = this.expr.copySubstitute(fnNodeMap);
			
			var result = new ns.SortCondition(exprCopy, this.direction);
			
			return result;
		}
	});
	
	
	ns.Query = Class.create({
	    classLabel: 'jassa.sparql.Query',
	    
		initialize: function() {
			this.type = 0; // select, construct, ask, describe
			
			this.distinct = false;
			this.reduced = false;
			
			this.resultStar = false;
			
			// TODO Rename to project(ion)
			this.projectVars = new ns.VarExprList();
			//this.projectVars = []; // The list of variables to appear in the projection
			//this.projectExprs = {}; // A map from variable to an expression
			
			//this.projection = {}; // Map from var to expr; map to null for using the var directly
			
			//this.order = []; // A list of expressions
			
			this.groupBy = []; 
			this.orderBy = [];
	
			
			this.elements = [];
			
			this.constructTemplate = null;
			
			this.limit = null;
			this.offset = null;		
		},
	
		isResultStar: function() {
		    return this.resultStar;
		},
		
		setResultStar: function(enable) {
	        this.resultStar = (enable === true) ? true : false;
		},
		
		getQueryPattern: function() {
		    return this.elements[0];
		},
		
		setQueryPattern: function(element) {
		    util.ArrayUtils.clear(this.elements);
		    this.elements.push(element);
		},
		
		// TODO Deprecate
		getElements: function() {
			return this.elements;
		},
				
		// TODO This should only return the variables!!
		getProjectVars: function() {
		    var result = this.projectVars ? this.projectVars.getVars() : null;
			return result;
		},

		// TODO Remove this method
		setProjectVars: function(projectVars) {
			this.projectVars = projectVars;
		},
		
		getProject: function() {
		    return this.projectVars;
		},

		getGroupBy: function() {
			return this.groupBy;
		},
		
		getOrderBy: function() {
			return this.orderBy;
		},
		
		getLimit: function() {
		    return this.limit;
		},
		
		getOffset: function() {
		    return this.offset;
		},

		toStringOrderBy: function() {
			var result = (this.orderBy && this.orderBy.length > 0)
				? "Order By " + this.orderBy.join(" ") + " "
				: "";
				//console.log("Order: ", this.orderBy);
			return result;
		},

		toStringGroupBy: function() {
			var result = (this.groupBy && this.groupBy.length > 0)
				? "Group By " + this.groupBy.join(" ") + " "
				: "";
				//console.log("Order: ", this.orderBy);
			return result;
		},
		
		clone: function() {
			return this.copySubstitute(ns.fnIdentity);
		},

		flatten: function() {
			var result = this.clone();

			var tmp = _.map(result.elements, function(element) { return element.flatten(); });

			var newElements = ns.ElementUtils.flattenElements(tmp);
			
			result.elements = newElements;

			return result;
		},
		
		
		getVarsMentioned: function() {
		    
	        console.log('sparql.Query.getVarsMentioned(): Not implemented properly yet. Things may break!');
	        // TODO Also include projection, group by, etc in the output - not just the elements
		    
		    var result = _(this.elements).reduce(function(memo, element) {
		        var evs = element.getVarsMentioned();
		        var r = _(memo).union(evs);
		        return r;
		    }, []);		    
		    
		    return result;		    
		},
		
		copySubstitute: function(fnNodeMap) {
			var result = new ns.Query();
			result.type = this.type;
			result.distinct = this.distinct;
			result.reduced = this.reduced;
			result.resultStar = this.resultStar;
			result.limit = this.limit;
			result.offset = this.offset;
	 				
			result.projectVars = this.projectVars.copySubstitute(fnNodeMap);

			//console.log("PROJECTION  " + this.projectVars + " --- " + result.projectVars);

			/*
			for(key in this.projection) {
				var value = this.projection[key]; 

				var k = fnNodeMap(ns.Node.v(key));
				var v = value ? value.copySubstitute(fnNodeMap) : null;
				
				result.projection[k] = v;
			}*/
			
			if(this.constructTemplate) {
				result.constructTemplate = this.constructTemplate.copySubstitute(fnNodeMap);
			}

			result.orderBy = this.orderBy == null
				? null
				:  _.map(this.orderBy, function(item) { return item.copySubstitute(fnNodeMap); });			

			result.groupBy = this.groupBy == null
				? null
				:  _.map(this.groupBy, function(item) { return item.copySubstitute(fnNodeMap); });			


			result.elements = _(this.elements).map(function(element) {
//				console.log("Element: ", element);
//				debugger;
				var r = element.copySubstitute(fnNodeMap);
				return r;
			});		

			//console.log("CLONE ORIG " + this);
			//console.log("CLONE RES " + result);
			
			return result;
		},
		
		
		/**
		 * Convenience function for setting limit, offset and distinct from JSON
		 * 
		 * @param options
		 */
		setOptions: function(options) {
			if(typeof options === 'undefined') {
				return;
			}
			
			if(typeof options.limit !== 'undefined') {
				this.setLimit(options.limit);
			}
			
			if(typeof(options.offset) !== 'undefined') {
				this.setOffset(options.offset);
			}

			if(typeof(options.distinct) !== 'undefined') {
				this.setDistinct(options.distinct);
			}
		},

		setOffset: function(offset) {
			this.offset = offset ? offset : null;
		},

		setLimit: function(limit) {
			if(limit === 0) {
				this.limit = 0;
			} else {
				this.limit = limit ? limit : null;
			}
		},
		
		isDistinct: function() {
		    return this.distinct;
		},
		
		
		setDistinct: function(enable) {
			this.distinct = (enable === true) ? true : false;
		},
		
		isReduced: function() {
		    return this.reduced;
		},
		
		setReduced: function(enable) {
            this.reduced = (enable === true) ? true : false;		    
		},

		toString: function() {
			switch(this.type) {
			case ns.QueryType.Select: return this.toStringSelect();
			case ns.QueryType.Construct: return this.toStringConstruct();
			
			}
		},

			
		toStringProjection: function() {
			if(this.resultStar) {
				return "*";
			}

			return "" + this.projectVars;		
		},

		
		toStringLimitOffset: function() {
			var result = "";
			
			if(this.limit != null) {
				result += " Limit " + this.limit;
			}
			
			if(this.offset != null) {
				result += " Offset " + this.offset;
			}
			
			return result;		
		},
		

		toStringSelect: function() {
			var distinctStr = this.distinct ? "Distinct " : "";
			
			//console.log("Elements: ", this.elements);
			var result = "Select " + distinctStr + this.toStringProjection() + " {" + ns.joinElements(" . ", this.elements) + "} " + this.toStringGroupBy() + this.toStringOrderBy() + this.toStringLimitOffset();
			
			return result;		
		},

		toStringConstruct: function() {
			var result = "Construct " + this.constructTemplate + " {" + ns.joinElements(" . ", this.elements) + "}" + this.toStringOrderBy() + this.toStringLimitOffset();
			
			return result;
		}
	});

	
	ns.fnIdentity = function(x) { return x; };
	

	
	
	
	/**
	 * Creates a new (compound) expressions from an array
	 * of individual exrpessions.
	 * [a, b, c, d] with ctor set to "E_LogicalAnd" (abbr. And) will become
	 * And(And(a, b), And(c, d))
	 * 
	 */
	ns.opifyBalanced = function(exprs, ctor) {
		//console.warn("Constructor", ctor);

		if(exprs.length === 0) {
			return null;
		}

		var open = exprs;
		
		while(open.length > 1) {
			var next = [];

			for(var i = 0; i < open.length; i+=2) {
				var hasSecond = i + 1 < open.length;
				
				var a = open[i];
				
				if(hasSecond) {
					var b = open[i + 1];
					next.push(new ctor(a, b));
				} else {
					next.push(a);
				}
			}
			
			open = next;
		}
		
		return open[0];
	}; 

	ns.opify = ns.opifyBalanced; 
	
		

	/*
	var testElement = new ns.ElementTriplesBlock([]);

	var json = serializer.serialize(testElement);
	
	alert('serialized: ' + JSON.stringify(json));
	
	
	var obj = serializer.deserialize(json);
	alert('deserialized: ' + JSON.stringify(obj));
	
	//serializeElement(testElement);
	*/
	
})();
		
// Move some utility functions from Elements here
(function() {
	
    var rdf = Jassa.rdf;
	var util = Jassa.util;

	var ns = Jassa.sparql;
	
	
	ns.VarGenerator = Class.create({
	    initialize: function(generator) {
	        this.generator = generator;
	    },
	    
	    next: function() {
	        var varName = this.generator.next();
	        
	        var result = rdf.NodeFactory.createVar(varName);
	        
	        return result;
	    }
	});

	ns.VarUtils = {
	    /**
	     * Convert an array of variable names to variable objects
	     * 
	     */
	    createVars: function(varNames) {
	        var result = varNames.map(function(varName) {
	            return rdf.NodeFactory.createVar(varName);
	        });

	        return result;
	    },
	    
	    
	    /**
	     * Convert an array of variable objects into an array of variable names
	     * 
	     * 
	     */
	    getVarNames: function(vars) {
	        var result = vars.map(function(v) {
	            return v.getName();
	        });
	        
	        return result;
	    },
	    
	    /**
	     * Create a generator which yields fresh variables that is not contained in the array 'vars'.
	     * The new var name will have the given prefix
	     * 
	     */
	    createVarGen: function(prefix, excludeVars) {
	        if(!prefix) {
	            prefix = 'v';
	        }
	        
	        var excludeVarNames = this.getVarNames(excludeVars);
	        var generator = ns.GenSym.create(prefix);
	        var genVarName = new sparql.GeneratorBlacklist(generator, excludeVarNames);

	        var result = new ns.VarGenerator(genVarName);
	        
	        return result;
	    }
	};
	
	
	ns.Generator = Class.create({
		next: function() {
			throw "Override me";
		}
	});
	
	/**
	 * Another class that mimics Jena's behaviour.
	 * 
	 * @param prefix
	 * @param start
	 * @returns {ns.GenSym}
	 */
	ns.GenSym = Class.create(ns.Generator, {
		initialize: function(prefix, start) {
			this.prefix = prefix ? prefix : "v";
			this.nextValue = start ? start : 0;
		},
	
		next: function() {
			++this.nextValue;
			
			var result = this.prefix + "_" + this.nextValue;
			
			return result;
		}
	});

	ns.GenSym.create = function(prefix) {
		var result = new ns.GenSym(prefix, 0);
		return result;
	};

	/**
	 * 
	 * @param generator
	 * @param blacklist Array of strings
	 * @returns {ns.GeneratorBlacklist}
	 */
	ns.GeneratorBlacklist = Class.create(ns.Generator, {
		
		initialize: function(generator, blacklist) {
			this.generator = generator;
			this.blacklist = blacklist;
		},

		next: function() {
			var result;
			
			do {
				result = this.generator.next();
			} while(_.contains(this.blacklist, result));
				
			return result;
		}

	});



	ns.fnToString = function(x) {
		return x.toString();
	};

	ns.fnGetVarName = function(x) {
		return x.getName();
	};


	
	ns.PatternUtils = {
		getVarsMentioned: function(elements) {
			
			var result = _(elements).reduce(function(memo, element) {
			    
			    var fn = element.getVarsMentioned; 
			    if(!fn || !_(fn).isFunction()) {
			        console.log('[ERROR] .getVarsMentioned not found on object ', element);
			    }
			    
				var vs = element.getVarsMentioned();
			    var r = _(memo).union(vs);
			    return r;
			}, []);
			
			return result;
		}
	};

	
	ns.ElementFactory = Class.create({
	    createElement: function() {
	        throw "Not overridden";
	    }
	});

	
	/**
	 * Element factory returning an initially provided object
	 */
	ns.ElementFactoryConst = Class.create(ns.ElementFactory, {
	    initialize: function(element) {
	        this.element = element;
	    },
	    
	    createElement: function() {
	        return this.element;
	    }
	});
	
	
    /**
     * Element factory that simplify combines the elements of its sub element factories.
     * Does not do any variable renaming
     * 
     * options: {
     *     simplify: Perform some transformations, such as removing duplicates
     *     forceGroup: always return an instance of ElementGroup, even if it would have only a single member
     * }
     * 
     * 
     * @param options
     * @param elementFactories: Array of elementFactories
     */
    ns.ElementFactoryCombine = Class.create(ns.ElementFactory, {
        initialize: function(simplify, elementFactories, forceGroup) {
            this.simplify = simplify;
            this.elementFactories = elementFactories;
            this.forceGroup = forceGroup;
        },
        
        isSimplify: function() {
            return this.simplify;
        },
        
        getElementFactories: function() {
            return this.elementFactories;
        },
        
        isForceGroup: function() {
            return this.forceGroup;
        },
        
        createElement: function() {
            var elements = _(this.elementFactories).chain().map(function(elementFactory) {
                var r = elementFactory.createElement();
                return r;
            }).filter(function(x) {
                return x != null;
            }).value();
            
            var result = new sparql.ElementGroup(elements);
            
            // Simplify the element
            if(this.simplify) {
                result = result.flatten();
            }

            // Remove unneccesary ElementGroup unless it is enforced
            if(!this.forceGroup) {
                var members = result.getArgs(); 
                if(members.length === 1) {
                    result = members[0];
                }
            }

            return result;
        }
    });	
	
	/**
	 * This factory creates an element Based on two elements (a, b) and corresponding join variables.
	 * 
	 * The variables in the first element are retained, whereas those of the
	 * second element are renamed as needed.
	 * 
	 * The purpose of this class is to support joining a concept created from faceted search
	 * with a sponate sparql element.
	 * 
	 * Example:
	 * {?x a Castle} join {?y rdfs:label} on (?x = ?y)
	 * after the join, the result will be
	 * {?y a Castle . ?y rdfs:label}
	 * 
	 * 
	 * 
	 * 
	 */
	ns.ElementFactoryJoin = Class.create(ns.ElementFactory, {
	    initialize: function(elementFactoryA, elementFactoryB, joinVarsA, joinVarsB, joinType) {
	        this.elementFactoryA = elementFactoryA;
	        this.elementFactoryB = elementFactoryB;
	        this.joinVarsA = joinVarsA;
	        this.joinVarsB = joinVarsB;
	        this.joinType = joinType ? joinType : ns.JoinType.INNER_JOIN;
	    },
	   
	    createElement: function() {
	        var elementA = this.elementFactoryA.createElement();
	        var elementB = this.elementFactoryB.createElement();

	        
	        var varsA = elementA.getVarsMentioned();
	        var varsB = elementB.getVarsMentioned();
	        
//            var aliasGenerator = new ns.GenSym('v');
//            var varNamesA = sparql.VarUtils.getVarNames(varsA);
//            var varNameGenerator = new ns.GeneratorBlacklist(new ns.GenSym('v'), varNamesA); 
	        
            var varMap = ns.ElementUtils.createJoinVarMap(varsB, varsA, this.joinVarsB, this.joinVarsA); //, varNameGenerator);
            
            elementA = ns.ElementUtils.createRenamedElement(elementA, varMap);

            if(this.joinType == ns.JoinType.LEFT_JOIN) {
                elementB = new ns.ElementOptional(elementB);
            }
	        
            var result = new ns.ElementGroup([elementA, elementB]);
	        
	        //var rootJoinNode = ns.JoinBuilderElement.create(elementA);
	        //var joinNode = rootJoinNode.joinAny(this.joinType, this.joinVarsB, elementA, this.joinVarsA);

	        //var joinBuilder = joinNode.getJoinBuilder();
	        //var elements = joinBuilder.getElements();
	        //var result = new ns.ElementGroup(elements);
	        //var aliasToVarMap = joinBuilder.getAliasToVarMap();

	        return result;
	    }
	});
	
	
	/**
	 * Variables of conceptB are renamed
	 * 
	 */
	ns.ElementFactoryJoinConcept = Class.create(ns.ElementFactory, {
        initialize: function(conceptFactoryA, conceptFactoryB, joinType) {
            this.conceptFactoryA = conceptFactoryA;
            this.conceptFactoryB = conceptFactoryB;
            this.joinType = joinType || ns.JoinType.INNER_JOIN;
        },
	    
        createElement: function() {

            var conceptA = this.conceptFactoryA.createConcept();
            var conceptB = this.conceptFactoryB.createConcept();
            
            var elementA = conceptA.getElement();
            var elementB = conceptB.getElement();
            
            if(conceptB.isSubjectConcept()) {
                return elementA;
            }
            
            var joinVarsA = [conceptA.getVar()];
            var joinVarsB = [conceptB.getVar()];
            
            var rootJoinNode = ns.JoinBuilderElement.create(elementA);
            var joinNode = rootJoinNode.joinAny(this.joinType, joinVarsA, elementB, joinVarsB);

            var joinBuilder = joinNode.getJoinBuilder();
            var elements = joinBuilder.getElements();
            var result = new sparql.ElementGroup(elements);
            
            return result;
        }
	});
	
	
	ns.ElementUtils = {
        createFilterElements: function(exprs) {
            var result = _(exprs).map(function(expr) {
                var r = new sparql.ElementFilter(expr);
                return r;
            });
            
            return result;
        },
            
        createElementsTriplesBlock: function(triples) {
            var result = [];
            
            if(triples.length > 0) {
                var element = new sparql.ElementTriplesBlock(triples);
                result.push(element);
            }
            
            return result;
        }, 

		flatten: function(elements) {
			var result = _.map(elements, function(element) { return element.flatten(); });

			return result;
		},
		
		
		/**
		 * Bottom up
		 * - Merge ElementTripleBlocks
		 * - Merge ElementGroups
		 */
		flattenElements: function(elements) {
			var result = [];
			
			var triples = [];
			
			var tmps = [];
			_.each(elements, function(item) {
				if(item instanceof ns.ElementGroup) {
					tmps.push.apply(tmps, item.elements);
				} else {
					tmps.push(item);
				}
			});
			
			_.each(tmps, function(item) {
				if(item instanceof ns.ElementTriplesBlock) {
					triples.push.apply(triples, item.getTriples());
				} else {
					result.push(item);
				}
			});		

			if(triples.length > 0) {			
				var ts = ns.uniqTriples(triples);
				
				result.unshift(new ns.ElementTriplesBlock(ts));
			}
			
			//console.log("INPUT ", elements);
			//console.log("OUTPUT ", result);
			
			return result;
		},
		
		/**
		 * Returns a map that maps *each* variable from vbs to a name that does not appear in vas.
		 */
		createDistinctVarMap: function(vas, vbs, generator) {
			var vans = vas.map(ns.fnGetVarName);
			var vbns = vbs.map(ns.fnGetVarName);
			
			// Get the var names that are in common
			//var vcns = _(vans).intersection(vbns);
			
			if(generator == null) {
				var g = new ns.GenSym('v');
				generator = new ns.GeneratorBlacklist(g, vans);
			}

			// Rename all variables that are in common
      // FIXME: fnNodeEquals is not defined (commented out in sponate-utils.js as of 2014-06-05)
			var result = new util.HashBidiMap(ns.fnNodeEquals);
			//var rename = {};

			_(vbs).each(function(oldVar) {
				var vbn = oldVar.getName();
				
				var newVar;
				if(_(vans).contains(vbn)) {
					var newName = generator.next();
					newVar = ns.Node.v(newName);
					
				} else {
					newVar = oldVar;
				}
				
				//rename[vcn] = newVar;
				
				// TODO Somehow re-use existing var objects... 
				//var oldVar = ns.Node.v(vcn);
				
				result.put(oldVar, newVar);
			});
			
			return result;
		},
		
		/**
		 * distinctMap is the result of making vbs and vas distinct
		 * 
		 * [?s ?o] [?s ?p] join on ?o = ?s
		 * 
		 * Step 1: Make overlapping vars distinct
		 * [?s ?o] [?x ?p] -> {?s: ?x, ?p: ?p}
		 * 
		 * Step 2: Make join vars common again
		 * [?s ?o] [?x ?s] -> {?s: ?x, ?p: ?s}
		 */
		createJoinVarMap: function(sourceVars, targetVars, sourceJoinVars, targetJoinVars, generator) {
			
			if(sourceJoinVars.length != targetJoinVars.length) {
				console.log('[ERROR] Cannot join on different number of columns');
				throw 'Bailing out';
			}
			
			var result = ns.ElementUtils.createDistinctVarMap(sourceVars, targetVars, generator);
			
			for(var i = 0; i < sourceJoinVars.length; ++i) {
				var sourceJoinVar = sourceJoinVars[i];
				var targetJoinVar = targetJoinVars[i];

				// Map targetVar to sourceVar 
				result.put(targetJoinVar, sourceJoinVar);
				//rename[targetVar.getName()] = sourceVar;
			}

			return result;
		},
		
		/**
		 * Var map must be a bidi map
		 */
		createRenamedElement: function(element, varMap) {
			var fnSubst = function(v) {
				var result = varMap.get(v);//[v.getName()];
				return result;
			};
			
			//debugger;
			var newElement = element.copySubstitute(fnSubst);
			
			return newElement;
		}

		
		/**
		 * Rename all variables in b that appear in the array of variables vas.
		 * 
		 * 
		 */
//		makeElementDistinct: function(b, vas) {
//			//var vas = a.getVarsMentioned();
//			var vbs = b.getVarsMentioned();
//
//			var vans = vas.map(ns.fnGetVarName);
//			var vbns = vbs.map(ns.fnGetVarName);
//			
//			// Get the var names that are in common
//			var vcns = _(vans).intersection(vbns);
//			
//			var g = new ns.GenSym('v');
//			var gen = new ns.GeneratorBlacklist(g, vans);
//
//			// Rename all variables that are in common
//			var rename = new col.HashBidiMap(ns.fnNodeEquals);
//			//var rename = {};
//
//			_(vcns).each(function(vcn) {
//				var newName = gen.next();
//				var newVar = ns.Node.v(newName);
//				//rename[vcn] = newVar;
//				
//				// TODO Somehow re-use existing var objects... 
//				var oldVar = ns.Node.v(vcn);
//				
//				rename.put(oldVar, newVar);
//			});
//			
//			console.log('Common vars: ' + vcns + ' rename: ' + JSON.stringify(rename.getMap()));
//			
//			var fnSubst = function(v) {
//				var result = rename.get(v);//[v.getName()];
//				return result;
//			};
//			
//			//debugger;
//			var newElement = b.copySubstitute(fnSubst);
//			
//			var result = {
//				map: rename,
//				element: newElement
//			};
//			
//			return result;
//		}
	};

    ns.ExprUtils = {
            
        copySubstitute: function(expr, binding) {
            var fn = (function(node) {
                
                var result = null;
                
                if(node.isVar()) {
                    //var varName = node.getName();
                    //var subst = binding.get(varName);
                    var subst = binding.get(node);
                    
                    if(subst != null) {
                        result = subst;
                    }
                }
                
                if(result == null) {
                    result = node;
                }
                
                return result;
            });
            

            var result = expr.copySubstitute(fn);
            return result;
        },
        
        /**
         * 
         * If varNames is omitted, all vars of the binding are used
         */
        bindingToExprs: function(binding, vars) {
            if(vars == null) {
                vars = binding.getVars();
            }

            var result = _(vars).each(function(v) {
                var exprVar = new sparql.ExprVar(v);
                var node = binding.get(v);
                
                // TODO What if node is NULL?
                
                var nodeValue = sparql.NodeValue.makeNode(node);
                
                var expr = new sparql.E_Equals(exprVar, nodeValue);
                
                return expr;
            });
            
            return result;
        }
        
    };
	
})();(function() {
    
    var util = Jassa.util;
    var sparql = Jassa.sparql;


    var ns = Jassa.sparql;
        
    
    ns.JoinType = {
            INNER_JOIN: 'inner_join',
            LEFT_JOIN: 'left_join'
    };
    
    /**
     * A convenient facade on top of a join builder
     * 
     */
    ns.JoinNode = Class.create({
        initialize: function(joinBuilder, alias, targetJoinVars) {
            this.joinBuilder = joinBuilder;
            this.alias = alias;
            this.targetJoinVars = targetJoinVars;
        },
        
        getJoinBuilder: function() {
            return this.joinBuilder;
        },
        
        /**
         * Returns the variables on which this node is joined to the parent
         * 
         * For the root node, this is the set of default vars on which joins
         * can be performed
         * 
         */
        getJoinVars: function() {
            return this.targetJoinVars;
        },
        
        getElement: function() {
            return this.joinBuilder.getElement(this.alias);
        },

        getVarMap: function() {
            return this.joinBuilder.getVarMap(this.alias);
        },
        
        // Returns all join node object 
        // joinBuilder = new joinBuilder();
        // node = joinBuilder.getRootNode();
        // node.join([?s], element, [?o]);
        //    ?s refers to the original element wrapped by the node
        //    ?o also refers to the original element of 'element'
        // 
        // joinBuilder.getRowMapper();
        // joinBuilder.getElement();
        // TODO: Result must include joinType
        getJoinNodeInfos: function() {
            var state = this.joinBuilder.getState(this.alias);
            
            var joinBuilder = this.joinBuilder;
            var self = this;
            var result = _(state.getJoinInfos()).map(function(joinInfo) {
                var alias = joinInfo.getAlias();
                var targetJoinNode = self.joinBuilder.getJoinNode(alias);
               
                var r = new ns.JoinNodeInfo(targetJoinNode, joinInfo.getJoinType());
                return r;
            });
            
            return result;
        },

        joinAny: function(joinType, sourceJoinVars, targetElement, targetJoinVars, targetAlias) {
            var result = this.joinBuilder.addJoin(joinType, this.alias, sourceJoinVars, targetElement, targetJoinVars, targetAlias);

            return result;
        },
        
        join: function(sourceJoinVars, targetElement, targetJoinVars, targetAlias) {
            var result = this.joinAny(ns.JoinType.INNER_JOIN, sourceJoinVars, targetElement, targetJoinVars, targetAlias);
            return result;
        },

        leftJoin: function(sourceJoinVars, targetElement, targetJoinVars, targetAlias) {
            var result = this.joinAny(ns.JoinType.LEFT_JOIN, sourceJoinVars, targetElement, targetJoinVars, targetAlias);
            return result;
        },
        
        
        
        joinTree: function(joinNode) {
            
        },
        
        leftJoinTree: function(joinNode) {
            
        },
        
        joinTreeAny: function(joinNode) {
            
        }
    });
    
    
    
    /**
     * 
     * 
     */
    ns.JoinNodeInfo = Class.create({
        initialize: function(joinNode, joinType) {
            this.joinNode = joinNode;
            this.joinType = joinType;
        },

        getJoinNode: function() {
            return this.joinNode;
        },
       
        getJoinType: function() {
            return this.joinType;
        },
       
        toString: function() {
            return this.joinType + " " + this.joinNode;
        }
    });
    
    
    /**
     * This object just holds information
     * about the join type of a referred alias. 
     * 
     */
    ns.JoinInfo = Class.create({
       initialize: function(alias, joinType) {
           this.alias = alias;
           this.joinType = joinType;
       },
       
       getAlias: function() {
           return this.alias;
       },
       
       getJoinType: function() {
           return this.joinType;
       },
       
       toString: function() {
           return this.joinType + " " + this.alias;
       }
    });

    
    ns.JoinTargetState = Class.create({
        initialize: function(varMap, joinNode, element, elementVars) {
            this.varMap = varMap;
            this.joinNode = joinNode;
            this.element = element;
            this.elementVars = elementVars;
            
            //this.targetJoinVars = targetJoinVars;
            
            this.joinInfos = [];            
        },
        
        getVarMap: function() {
            return this.varMap;
        },
        
        getJoinNode: function() {
            return this.joinNode;
        },
        
        getElement: function() {
            return this.element;
        },
        
        getElementVars: function() {
            return this.elementVars;
        },
        
        getJoinInfos: function() {
            return this.joinInfos;
        }
    });
    
    /**
     * Aliases are automatically assigned if none is given explicitly
     * 
     * The alias can be retrieved using
     * joinNode.getAlias();
     * 
     * 
     * a: castle
     * 
     * 
     * b: owners
     * 
     * 
     */
    ns.JoinBuilderElement = Class.create({
        initialize: function(rootElement, rootElementVars, rootAlias, defaultRootJoinVars) {

            // Null elements can be used for pseudo-joins that only allocated variables
            // TODO Instead of null elements we now support default join variables for the root node
            if(rootElement == null) {
                console.log('[Error] Root element must not be null');
                throw 'Bailing out';
            }
            
            
            this.usedVarNames = [];
            this.usedVars = [];

            this.aliasGenerator = new ns.GenSym('a');
            this.varNameGenerator = new ns.GeneratorBlacklist(new ns.GenSym('v'), this.usedVarNames); 
            

            this.aliasToState = {};
            
            
            this.rootAlias = rootAlias ? rootAlias : this.aliasGenerator.next(); 
             
            
            //var rootElementVars = targetElement.getVarsMentioned();

            if(defaultRootJoinVars == null) {
                defaultRootJoinVars = [];
            }
            
            var rootState = this.createTargetState(this.rootAlias, new util.HashBidiMap(), defaultRootJoinVars, rootElement, rootElementVars, defaultRootJoinVars);

            this.aliasToState[this.rootAlias] = rootState;
            
            this.rootNode = rootState.getJoinNode(); //new ns.JoinNode(rootAlias);
        },

        getRootNode: function() {
            return this.rootNode;
        },

        getJoinNode: function(alias) {
            var state = this.aliasToState[alias];
            
            var result = state ? state.getJoinNode() : null;
            
            return result;
        },


        getState: function(alias) {
            return this.aliasToState[alias];
        },
    
        getElement: function(alias) {
            var state = this.aliasToState[alias];
            var result = state ? state.getElement() : null;
            return result;
        },
        
        
//        getAliasVarMap: function() {
//            var result = {};
//        },
        
//      getElement: function(alias) {
//          return this.aliasToElement[alias];
//      },
//      
//      getJoinNode: function(alias) {
//          return this.aliasToJoinNode[alias];
//      },
//      
//      getVarMap: function(alias) {
//          return this.aliasToVarMap[alias];
//      },
        
        addVars: function(vars) {
            
            var self = this;
            _(vars).each(function(v) {
                
                var varName = v.getName();
                var isContained = _(self.usedVarNames).contains(varName);
                if(!isContained) {
                    self.usedVarNames.push(varName);
                    self.usedVars.push(v);
                }
            });
        },
        
        createTargetState: function(targetAlias, sourceVarMap, sourceJoinVars, targetElement, oldTargetVars, targetJoinVars) {
            var sjv = sourceJoinVars.map(function(v) {
                var rv = sourceVarMap.get(v);               
                return rv;
            });
            
            //var sourceVars = this.ge; // Based on renaming!
            //var oldTargetVars = targetElement.getVarsMentioned();
            var targetVarMap = ns.ElementUtils.createJoinVarMap(this.usedVars, oldTargetVars, sjv, targetJoinVars, this.varGenerator);
            
            var newTargetElement = null;
            if(targetElement != null) {
                newTargetElement = ns.ElementUtils.createRenamedElement(targetElement, targetVarMap);
            }
            
            var newTargetVars = targetVarMap.getInverse().keyList();
            this.addVars(newTargetVars);

            
            var result = new ns.JoinNode(this, targetAlias, targetJoinVars);

            var targetState = new ns.JoinTargetState(targetVarMap, result, newTargetElement, newTargetVars); 
//          
//          var targetState = {
//              varMap: targetVarMap,
//              joinNode: result,
//              element: newTargetElement,
//              joins: []
//          };
//
            return targetState;
        },
        


        addJoin: function(joinType, sourceAlias, sourceJoinVars, targetElement, targetJoinVars, targetAlias) {
            var sourceState = this.aliasToState[sourceAlias];
            var sourceVarMap = sourceState.getVarMap();

            if(!targetAlias) {
                targetAlias = this.aliasGenerator.next();
            }

            var targetElementVars = targetElement.getVarsMentioned();
            
            var targetState = this.createTargetState(targetAlias, sourceVarMap, sourceJoinVars, targetElement, targetElementVars, targetJoinVars);
                        
            //var targetVarMap = targetState.varMap;            
            //var newTargetVars = targetVarMap.getInverse().keyList();
            
            // TODO support specification of join types (i.e. innerJoin, leftJoin)
            var joinInfo = new ns.JoinInfo(targetAlias, joinType);
            sourceState.getJoinInfos().push(joinInfo);
            //sourceState.joins.push(targetAlias);
            

            this.aliasToState[targetAlias] = targetState;
            
            var result = targetState.getJoinNode();
            return result;
        },

        
        getElementsRec: function(node) {
            var resultElements = [];
            
            var element = node.getElement();
            if(element != null) {

                resultElements.push(element);
            }
                
            var children = node.getJoinNodeInfos();
            
            var self = this;
            _(children).each(function(child) {
                var childNode = child.getJoinNode();
                var childElements = self.getElementsRec(childNode);

                var childElement = new ns.ElementGroup(childElements);


                var joinType = child.getJoinType();
                switch(joinType) {
                case ns.JoinType.LEFT_JOIN:
                    childElement = new ns.ElementOptional(childElement);
                    break;
                case ns.JoinType.INNER_JOIN:
                    break;
                default:
                    console.log('[ERROR] Unsupported join type: ' + joinType);
                    throw 'Bailing out';
                }
                resultElements.push(childElement);
            });
            
            return resultElements;
        },
        
        getElements: function() {
            var rootNode = this.getRootNode();
            
            var result = this.getElementsRec(rootNode);

            //var result = [];
            /*
            var rootNode = this.getRootNode();

            util.TreeUtils.visitDepthFirst(rootNode, ns.JoinBuilderUtils.getChildren, function(node) {
                result.push(node.getElement());
                return true;
            });
            */
            return result;
        },
        
        getAliasToVarMap: function() {
            var result = {};
            _(this.aliasToState).each(function(state, alias) {
                result[alias] = state.varMap;
            });
            
            return result;
        }
        

//      getVarMap: function() {
//          _.each()
//      }
    });

    ns.JoinBuilderUtils = {
        getChildren: function(node) {
            // FIXME: getJoinNodes not defined
            return node.getJoinNodes();
        }
    };

    ns.JoinBuilderElement.create = function(rootElement, rootAlias, defaultJoinVars) {
        
        var vars = rootElement.getVarsMentioned();
        
        var joinBuilder = new ns.JoinBuilderElement(rootElement, vars, rootAlias, defaultJoinVars);
        var result = joinBuilder.getRootNode();
        
        return result;
    };
    
    
    /**
     * Creates a join node with a 'null' element,
     * however with a set of allocated variables.
     * 
     * 
     */
    ns.JoinBuilderElement.createWithEmptyRoot = function(varNames, rootAlias) {
        // FIXME: varNamesToNodes not defined
        var vars = sparql.VarUtils.varNamesToNodes(varNames);
        
        var joinBuilder = new ns.JoinBuilderElement(null, vars, rootAlias);
        var result = joinBuilder.getRootNode();
        
        return result;        
    };
    
})();(function() {
	
	var util = Jassa.util;
	var ns = Jassa.service;
	
	
	ns.ResultSet = Class.create(util.Iterator, {
		getVarNames: function() {
		    throw 'Override me';
		}
	});
	
	/**
	 * Resultset based on an array of bindings
	 * 
	 * Converts a plain json result set to an array of bindings...
	 * 
	 * TODO This class already exists somewhere in Sponate...
	 */
	ns.ResultSetArrayIteratorBinding = Class.create(ns.ResultSet, {
		initialize: function(itBinding, varNames) {
			this.itBinding = itBinding;
			this.varNames = varNames;
		},
		
		hasNext: function() {
			return this.itBinding.hasNext();
		},
		
		next: function() {
			return this.nextBinding();
		},
		
		nextBinding: function() {
			return this.itBinding.next();
		},
		
		getVarNames: function() {
		    return this.varNames;
		},
		
		getBindings: function() {
		    return this.itBinding.getArray();
		},
		
		// Return the binding array
		getIterator: function() {
			//return this.itBinding.getArray();
		    return this.itBinding;
		}
	});
	
	
})();
(function($) {

    var util = Jassa.util;
	var ns = Jassa.service;


	ns.SparqlService = Class.create({
		getServiceId: function() {
		    console.log('[ERROR] Method not overridden');
			throw '[ERROR] Method not overridden';
		},

		getStateHash: function() {
            console.log('[ERROR] Method not overridden');
            throw '[ERROR] Method not overridden';
		},
		
		createQueryExecution: function(queryStrOrObj) {
            console.log('[ERROR] Method not overridden');
            throw '[ERROR] Method not overridden';
		}
	});

	
	/**
	 * Base class for processing query strings.
	 */
	ns.SparqlServiceBaseString = Class.create(ns.SparqlService, {
		createQueryExecution: function(queryStrOrObj) {
			var result;
			if(_(queryStrOrObj).isString()) {
				result = this.createQueryExecutionStr(queryStrOrObj);
			} else {
				result = this.createQueryExecutionObj(queryStrOrObj);
			}
			
			return result;
		},

		createQueryExecutionObj: function(queryObj) {
			var queryStr = "" + queryObj;
			var result = this.createQueryExecutionStr(queryStr);
			
			return result;
		},

		createQueryExecutionStr: function(queryStr) {
			throw "Not implemented";
		}
	});
	

	ns.SparqlServiceHttp = Class.create(ns.SparqlServiceBaseString, {
		initialize: function(serviceUri, defaultGraphUris, ajaxOptions, httpArgs) {
			this.serviceUri = serviceUri;
            this.defaultGraphUris = defaultGraphUris;
			//this.setDefaultGraphs(defaultGraphUris);
			
            this.ajaxOptions = ajaxOptions;
			this.httpArgs = httpArgs;
		},

		getServiceId: function() {
			return this.serviceUri;
		},
		
		/**
		 * This method is intended to be used by caches,
		 * 
		 * A service is not assumed to return the same result for
		 * a query if this method returned different hashes.   
		 * 
		 * The state hash does not include the serviceId
		 * 
		 */
		getStateHash: function() {
//			var idState = {
//					serviceUri: this.serviceUri,
//					defaultGraphUris: this.defaultGraphUris
//			}
//			
//			var result = JSON.stringify(idState);

			var result = JSONCanonical.stringify(this.defaultGraphUris);
			
			result += JSONCanonical.stringify(this.httpArgs);

			return result;
		},
		
		hashCode: function() {
		   return this.getServiceId() + '/' + this.getStateHash();
		},
		
		setDefaultGraphs: function(uriStrs) {
			this.defaultGraphUris = uriStrs;// ? uriStrs : [];
		},
	
		getDefaultGraphs: function() {
			return this.defaultGraphUris;
		},
		
		createQueryExecutionStr: function(queryStr) {
		    var ajaxOptions = _({}).defaults(this.ajaxOptions);
		    
			var result = new ns.QueryExecutionHttp(queryStr, this.serviceUri, this.defaultGraphUris, ajaxOptions, this.httpArgs);
			return result;
		},
		
		createQueryExecutionObj: function($super, query) {
			if(true) {
				if(query.flatten) {
					var before = query;
					query = before.flatten();
					
					//console.log("FLATTEN BEFORE: " + before, before);
					//console.log("FLATTEN AFTER:"  + query, query);
				}
			}
			
			var result = $super(query);
			return result;
		}
	});
	

    
//    ns.CacheQuery = Class.create({
//        
//    });
//
	

    ns.RequestCache = Class.create({
        initialize: function(executionCache, resultCache) {
            this.executionCache = executionCache ? executionCache : {};
            this.resultCache = resultCache ? resultCache : new Cache();           
        },
  
        getExecutionCache: function() {
            return this.executionCache;
        },
  
        getResultCache: function() {
            return this.resultCache;
        }
    });


	/**
	 * Result Cache stores result sets - this is an instance of a class
	 * 
	 * Execution Cache holds all running queries' promises - this is just an associative array - i.e. {}
	 * Once the promises are resolved, the corresponding entries are removed from the execution cache
	 * 
	 * TODO Its not really a cache but more a registry
	 * 
	 */
	ns.SparqlServiceCache = Class.create(ns.SparqlServiceBaseString, {
	    
	    initialize: function(queryExecutionFactory, resultCache, executionCache) {
	        this.qef = queryExecutionFactory;
	        this.requestCache = new ns.RequestCache();
	        
	        /*
            this.executionCache = executionCache ? executionCache : {};
	        this.resultCache = resultCache ? resultCache : new Cache();
	        */
	    },
	    
	    getServiceId: function() {
	        return this.qef.getServiceId();
	    },
	    
	    getStateHash: function() {
	        return this.qef.getStateHash();
	    },
	    
	    hashCode: function() {
	        return 'cached:' + this.qef.hashCode();
	    },

	    createQueryExecutionStr: function(queryStr) {
	        var serviceId = this.qef.getServiceId();
	        var stateHash = this.qef.getStateHash();
	        
	        var cacheKey = serviceId + '-' + stateHash + queryStr;
	        
	        var qe = this.qef.createQueryExecution(queryStr);

	        var result = new ns.QueryExecutionCache(qe, cacheKey, this.requestCache);
	        
	        return result;
	    }

	});
	

    
	
})(jQuery);
(function() {
	
    var util = Jassa.util;
	var sparql = Jassa.sparql;
	
	var ns = Jassa.service;

	
	/**
	 * A query cache that for a given SPARQL select query and one of its variables caches the corresponding bindings.
	 * 
	 * 
	 * @param sparqlService
	 * @returns {ns.QueryCacheFactory}
	 */
	
	
//	ns.QueryCacheFactory = Class.create({
//	    initialize: function(sparqlService) {
//	        this.sparqlService = sparqlService;
//	        this.queryToCache = {};
//	    },
//	
//	    /**
//	     * If a cache was already created for a query, the same cache is returned
//	     * 
//	     */
//	    create: function(query) {
//    		var queryStr = query.toString();
//    		var result = this.queryToCache[queryStr];
//    		
//    		if(!result) {
//    			result = new ns.QueryCache(this.sparqlService, query);
//    			this.queryToCache[queryStr] = result;
//    			
//    		}
//    
//    		return result;
//	    }
//	});
//
	
	
// TODO How to unify the simple cache and a fully fledged binding cache?
//  I.e. how to unify lookups based on an array of nodes
//   with those of an array of bindings?
//    
	
// TODO How to keep track of pagination?
// TODO How to deal with 'sub-caches'? I.e. There is an index on (?x) and another on (?x, ?y)
	    // Well, this is more related to how to find the best index and that's a different topic
	
	ns.QueryCacheNodeFactory = Class.create({
		createQueryCache: function(sparqlService, query, indexExpr) {
			throw 'Not overridden';
		}
	});
	
	
	ns.QueryCacheNodeFactoryImpl = Class.create(ns.QueryCacheNodeFactory, {
		initialize: function() {
			this.keyToCache = new Cache(); 
		},
		
		createQueryCache: function(sparqlService, query, indexExpr) {
      // FIXME: SparqlService.getServiceState() not defined
			var key = 'cache:/' + sparqlService.getServiceId() + '/' + sparqlService.getServiceState() + '/' + query + '/' + indexExpr;
			
			console.log('cache requested with id: ' + key);
			
			var cache = this.keyToCache.getItem(key);
			if(cache == null) {
				cache = new ns.QueryCacheBindingHashSingle(sparqlService, query, indexExpr);
				this.keyToCache.addItem(key, cache);
			}
			
			return cache;
		}
	});
	
	

	/*
	ns.SparqlLookpServiceCache = Class.create({
	    initialize: function(sparqlLookupService, cache) {
	        this.sparqlLookupService = sparqlLookupService;
	        
	        this.cache = cache || new Cache();
	    },
	    
	    lookup: function(nodes) {
	        // Make nodes unique
	        var uniq = _(nodes).uniq(); // TODO equality
	        
	        
	        
	        
	    }
	})
	*/
	
	
	ns.QueryCacheBindingHashSingle = Class.create({
	    initialize: function(sparqlService, query, indexExpr) {
            this.sparqlService = sparqlService;
            this.query = query;

            //this.indexVarName = indexVarName;
            this.indexExpr = indexExpr;
            
            
            this.maxChunkSize = 50;
            
            //this.indexVar = rdf.
            
            this.exprEvaluator = new sparql.ExprEvaluatorImpl();
            
            this.nodeToBindings = new Cache();
            
            // Cache for nodes for which no data existed
            this.nodeMisses = new Cache();
	    },
	    
	    fetchResultSet: function(nodes) {
	        var self = this;
	        var nodeToBindings = this.nodeToBindings;

	        
	        var stats = this.analyze(nodes);
	        
	        var resultBindings = [];
	        
	        // Fetch data from the cache
	        _(stats.cachedNodes).each(function(node) {
	            var bindings = nodeToBindings.getItem(node.toString());
	            resultBindings.push.apply(resultBindings, bindings);
	        });
	        
	        // Fetch data from the chunks
	        
	        var fetchTasks = _(stats.nonCachedChunks).map(function(chunk) {
	            var promise = self.fetchChunk(chunk);
	            return promise;
	        });
	    
            var masterTask = $.when.apply(window, fetchTasks);
            
            var exprEvaluator = this.exprEvaluator;
            var indexExpr = this.indexExpr; 
            
            // TODO Cache the misses
            var result = masterTask.pipe(function() {          
                
                var seenKeys = {};
                
                for(var i = 0; i < arguments.length; ++i) {
                    var rs = arguments[i];
                    while(rs.hasNext()) {
                        var binding = rs.nextBinding();
                    
                        resultBindings.push(binding);
                        
                        var keyNode = exprEvaluator.eval(indexExpr, binding);
                        
                        var hashKey = keyNode.toString();
                        
                        // Keep track of which nodes we have encountered
                        seenKeys[hashKey] = keyNode;
                        
                        var cacheEntry = nodeToBindings.getItem(hashKey);
                        if(cacheEntry == null) {
                            cacheEntry = [];
                            nodeToBindings.setItem(hashKey, cacheEntry);
                        }
                        
                        cacheEntry.push(binding);
                    }              
                }
              
                var itBinding = new util.IteratorArray(resultBindings);
                var r = new ns.ResultSetArrayIteratorBinding(itBinding);
                
                return r;
            });
//                .fail(function() {
//                
//            });

            return result;
	    },
	    
	    fetchChunk: function(nodes) {
	        var query = this.query.clone();
	        
	        var filterExpr = new sparql.E_OneOf(this.indexExpr, nodes);
	        var filterElement = new sparql.ElementFilter([filterExpr]);
	        query.getElements().push(filterElement);
	        
	        var qe = this.sparqlService.createQueryExecution(query);
	        
	        var result = qe.execSelect();
	        return result;
	        //var v = rdf.NodeFactory.createVar(this.index);
	    },
	    
	    /**
	     * Given an array of nodes, this method returns:
	     * (a) the array of nodes for which cache entries exist
	     * (b) the array of nodes for which NO cache entries exist
	     * (c) the array of nodes for which it is known that no data exists
	     * (c) chunked arrays of nodes for which no cache entries exist
	     * (d) the maxChunkSize used to create the chunks
	     * 
	     * @param nodes
	     * @returns
	     */
	    analyze: function(nodes) {
	        var nodeToBindings = this.nodeToBindings;
	        
	        var cachedNodes = [];
	        var nonCachedNodes = [];
	        
	        _(nodes).each(function(node) {
	            var nodeStr = node.toString();
	            var entry = nodeToBindings.getItem(node.toString());
	            if(entry == null) {
                    nonCachedNodes.push(node);
	            } else {
                    cachedNodes.push(node);
	            }
	        });
	        
	        
            var maxChunkSize = this.maxChunkSize;

            var nonCachedChunks = [];
            for (var i = 0; i < nonCachedNodes.length; i += maxChunkSize) {
                var chunk = nodes.slice(i, i + maxChunkSize);
    
                nonCachedChunks.push(chunk);
            }

	        var result = {
	            cachedNodes: cachedNodes,
	            nonCachedNodes: nonCachedNodes,
	            nonCachedChunks: nonCachedChunks,
	            maxChunkSize: maxChunkSize
	        };

	        return result;
	    }
	
	});
	

})();
/**
 * Sparql endpoint class.
 * Allows execution of sparql queries against a preconfigured service
 * 
 */			
(function($) {

    var util = Jassa.util;
    
	var ns = Jassa.service;
	
	
	ns.QueryExecution = Class.create({
		execSelect: function() {
			throw "Not overridden";
		},
		
		execAsk: function() {
			throw "Not overridden";			
		},
		
		execDescribeTriples: function() {
			throw "Not overridden";
		},
		
		execConstructTriples: function() {
			throw "Not overridden";			
		},
		
		setTimeout: function(timeoutInMillis) {
			throw "Not overridden";
		}
	});
	
	
	ns.QueryExecutionHttp = Class.create(ns.QueryExecution, {
		initialize: function(queryString, serviceUri, defaultGraphUris, ajaxOptions, httpArgs) {
			this.queryString = queryString;
			this.serviceUri = serviceUri;
			this.defaultGraphUris = defaultGraphUris;
			
            this.ajaxOptions = ajaxOptions || {};
			this.httpArgs = httpArgs;
		},
		
		/**
		 * 
		 * @returns {Promise<sparql.ResultSet>}
		 */
		execSelect: function() {
			var result = this.execAny().pipe(ns.ServiceUtils.jsonToResultSet);
			return result;
		},
	
		execAsk: function() {
			var result = this.execAny().pipe(function(json) {
				return json['boolean'];
			});
			
			return result;
		},

		// Returns an iterator of triples
		execConstructTriples: function() {
		    throw 'Not implemented yet';
			//return this.execAny(queryString);
		},
	
		execDescribeTriples: function() {
		    throw 'Not implemented yet';
			//return this.execAny(queryString);
		},
		
		setTimeout: function(timeoutInMillis) {
			this.ajaxOptions.timeout = timeoutInMillis;
		},
		
		getTimeout: function() {
		    return this.ajaxOptions.timeout;
		},

		execAny: function() {

		    var ajaxSpec = ns.ServiceUtils.createSparqlRequestAjaxSpec(this.serviceUri, this.defaultGraphUris, this.queryString, this.httpArgs, this.ajaxOptions);
		    var result = $.ajax(ajaxSpec);

			return result;
		}
	});

//	
//	ns.HttpService = Class.create({
//	    exec: function(ajaxSpec) {
//	        console.log('[ERROR] Not overridden');
//	        throw 'Not overridden';
//	    }
//	});
//
//	
//	
//	
//	ns.HttpServiceRaw = Class.create({
//	    exec: function(ajaxSpec, cacheKey) {
//	        return $.ajax(ajaxSpec);
//	    }
//	});
//
//	
//	
//	ns.HttpServiceCache = Class.create(ns.HttpService, {
//	    initialize: function(executionCache, resultCache) {            
//            this.executionCache = executionCache ? executionCache : {};
//            this.resultCache = resultCache ? resultCache : new Cache();
//	    },
//	   
//	    exec: function(ajaxSpec, cacheKey) {
//	        
//	        //var ajaxSpec = this.ajaxSpec;
//	        //var cacheKey = this.cacheKey;
//	        var executionCache = this.executionCache;
//	        var resultCache = this.resultCache;
//	        
//            var result = executionCache[cacheKey];
//            
//            if(!result) {
//                // Check if there is an entry in the result cache
//                var str = resultCache.getItem(cacheKey);
//                
//                if(str) {                     
//                    //console.log('[DEBUG] QueryCache: Reusing cache entry for cacheKey: ' + cacheKey);
//                    var deferred = $.Deferred();
//                    var data = JSON.parse(str);
//                    deferred.resolve(data);
//                    result = deferred.promise();
//                }
//                else {
//                    var request = $.ajax(ajaxSpec);
//                    
//                    result = request.pipe(function(data) {
//                        resultCache.setItem(cacheKey, data);
//                        return data;
//                    });
//                    
//                    executionCache[cacheKey] = result;
//                }
//            }
//            
//            return result;
//	    }
//	});

	
	/**
	 * A query execution that does simple caching based on the query strings.
	 * 
	 * 
	 */
    ns.QueryExecutionCache = Class.create(ns.QueryExecution, {
        initialize: function(queryExecution, cacheKey, requestCache) {
            this.queryExecution = queryExecution;
             
            this.cacheKey = cacheKey;
            this.requestCache = requestCache;
        },
         
        setTimeout: function(timeoutInMillis) {
            this.queryExecution.setTimeout(timeoutInMillis);
        },

        execSelect: function() {
            var cacheKey = this.cacheKey;
             
            var requestCache = this.requestCache;
            var resultCache = requestCache.getResultCache();
            var executionCache = requestCache.getExecutionCache();

            // Check the cache whether the same query is already running
            // Re-use its promise if this is the case
             
            // TODO Reusing promises must take timeouts into account
             
            var executionPromise = executionCache[cacheKey];

            if(!executionPromise) {
                 
                // Check if there is an entry in the result cache
                var cacheData = resultCache.getItem(cacheKey);
                if(cacheData) {                     
                    var deferred = $.Deferred();
                    deferred.resolve(cacheData);
                    executionPromise = deferred.promise();
                }
                else {
                    var request = this.queryExecution.execSelect();
                     
                    var trans = request.pipe(function(rs) {
                        var cacheData = {
                            bindings: rs.getBindings(),
                            varNames: rs.getVarNames()
                        };
                         
                        return cacheData;
                    });


                    var skipInsert = false;

                    executionPromise = trans.pipe(function(cacheData) {
                        skipInsert = true;

                        delete executionCache[cacheKey]; 
                        resultCache.setItem(cacheKey, cacheData);
                         
                        return cacheData;
                    });

                    if(!skipInsert) {
                        executionCache[cacheKey] = executionPromise;
                    }
                }
            }
            else {
                // Note: Multiple query execution could happen from angular apply loops that execute too often
                // So this could indicate performance issues
                console.log('[INFO] Joined query execution for: ' + cacheKey);
            }

            var result = executionPromise.pipe(function(cacheData) {
                var rs = ns.QueryExecutionCache.createResultSetFromCacheData(cacheData);
                return rs;
            });
            
            return result;
        } 
    });

    ns.QueryExecutionCache.createResultSetFromCacheData = function(cacheData) {
        var itBinding = new util.IteratorArray(cacheData.bindings);
        var varNames = cacheData.varNames;
        var rs = new ns.ResultSetArrayIteratorBinding(itBinding, varNames);

        return rs;
    };
	
})(jQuery);
(function() {

    var util = Jassa.util;
    
	var ns = Jassa.service;	
	

	/**
	 * Takes a query and upon calling 'next' updates its limit and offset values accordingly
	 * 
	 */
	ns.QueryPaginator = Class.create({
	    initialize: function(query, pageSize) {
    		this.query = query;
    		
    		var queryOffset = query.getOffset();
            var queryLimit = query.getLimit();

            this.nextOffset = queryOffset || 0;
    		this.nextRemaining = queryLimit == null ? null : queryLimit;
    		
    		this.pageSize = pageSize;
	    },
	
	    getPageSize: function() {
	        return this.pageSize;
	    },

	    // Returns the next limit and offset
	    next: function() {
	        var offset = this.nextOffset === 0 ? null : this.nextOffset;
    		this.query.setOffset(offset);
    
    		if(this.nextRemaining == null) {
    			this.query.setLimit(this.pageSize);
    			this.nextOffset += this.pageSize;
    		} else {
    			var limit = Math.min(this.pageSize, this.nextRemaining);
    			this.nextOffset += limit;
    			this.nextRemaining -= limit;
    			
    			if(limit === 0) {
    				return null;
    			}
    			
    			this.query.setLimit(limit);
    		}
    		
    		return this.query;
    	}
	});
	
	
	ns.QueryExecutionPaginate = Class.create(ns.QueryExecution, {
	    initialize: function(sparqlService, query, pageSize) {
	        this.sparqlService = sparqlService;
	        this.query = query;
	        this.pageSize = pageSize;
            this.timeoutInMillis = null;
	    },
	    
        executeSelectRec: function(queryPaginator, prevResult, deferred) {
            var query = queryPaginator.next();
            console.log('Query Pagination: ' + query);
            if(!query) {
                deferred.resolve(prevResult);
                return;
            }
            
            var self = this;
            //console.log("Backend: ", this.backend);
            //var totalLimit = this.query.getLimit();
            
            var qe = this.sparqlService.createQueryExecution(query);
            qe.setTimeout(this.timeoutInMillis);

            qe.execSelect().done(function(rs) {
    
                if(!rs) {
                    throw "Null result set for query: " + query;
                }


                                
                // If result set size equals pageSize, request more data.           
                var result;
                if(!prevResult) {
                    result = rs;
                } else {
                    // Extract the arrays that backs the result set ...
                    var oldArr = prevResult.getIterator().getArray();
                    var newArr = rs.getIterator().getArray();
                    
                    
                    // ... and concatenate them
                    var nextArr = oldArr.concat(newArr);

//                    if(totalLimit) {
//                        nextArr.splice(0, totalLimit);
//                    }
                    
                    var itBinding = new util.IteratorArray(nextArr);
                    result = new ns.ResultSetArrayIteratorBinding(itBinding);
                }
                
                var rsSize = rs.getIterator().getArray().length;
                //console.debug("rsSize, PageSize: ", rsSize, self.pageSize);                
                var pageSize = queryPaginator.getPageSize();

                // result size is empty or less than the pageSize or
                // limit reached
                if(rsSize === 0 || rsSize < pageSize) {
                    deferred.resolve(result);
                } else {                
                    return self.executeSelectRec(queryPaginator, result, deferred);
                }
                
            }).fail(function() {
                deferred.fail();
            });
        },
        
        execSelect: function() {
            var clone = this.query.clone();
            var pageSize = this.pageSize || ns.QueryExecutionPaginate.defaultPageSize;
            var paginator = new ns.QueryPaginator(clone, pageSize);
            
            var deferred = $.Deferred();
            
            this.executeSelectRec(paginator, null, deferred);
            
            return deferred.promise();
        },

		setTimeout: function(timeoutInMillis) {
			this.timeoutInMillis = timeoutInMillis;

            if(!this.timeoutMsgShown) {
                console.log('[WARN] Only preliminary timeout implementation for paginated query execution');
                this.timeoutMsgShown = true;
            }
        }
	});

	ns.QueryExecutionPaginate.defaultPageSize = 1000;

	ns.SparqlServicePaginate = Class.create(ns.SparqlService, {
	    initialize: function(sparqlService, pageSize) {
    		this.sparqlService = sparqlService;
    		this.pageSize = pageSize;
	    },
	
	    getServiceId: function() {
	        return this.sparqlService.getServiceId();
	    },
	    
		getStateHash: function() {
			return this.sparqlService.getStateHash();
		},

		hashCode: function() {
            return 'paginate:' + this.sparqlService.hashCode();
        },

		createQueryExecution: function(query) {
		    var result = new ns.QueryExecutionPaginate(this.sparqlService, query, this.pageSize);
		    return result;
		}
    });

	
})();

(function() {
	
    var util = Jassa.util;
    var sparql = Jassa.sparql;

	var ns = Jassa.service;	
	
	
	/**
	 * Transforms query using sorting with limit/offset
	 * 
	 * Select { ... } Order By {sortConditions} Limit {limit} Offset {offset} ->
	 * 
	 * Select * { { Select { ... } Order By {sortConditions} } } Limit {limit} Offset {offset}
	 * 
	 * Warning: This transformation may not work cross-database:
	 * Database management systems may discard ordering on sub queries (which is SQL compliant). 
	 * 
	 */
    ns.SparqlServiceVirtFix = Class.create(ns.SparqlService, {
        initialize: function(sparqlService) {
            this.sparqlService = sparqlService;
        },
    
        getServiceId: function() {
            return this.sparqlService.getServiceId();
        },
        
        getStateHash: function() {
            return this.sparqlService.getStateHash();
        },

        hashCode: function() {
            return 'virtfix:' + this.sparqlService.hashCode();
        },

        createQueryExecution: function(query) {
            
            var orderBy = query.getOrderBy();
            var limit = query.getLimit();
            var offset = query.getOffset();
            
            var isTransformNeeded = orderBy.length > 0 && (limit || offset);
            
            var q;
            if(isTransformNeeded) {
                var subQuery = query.clone();
                subQuery.setLimit(null);
                subQuery.setOffset(null);
                
                q = new sparql.Query();
                var e = new sparql.ElementSubQuery(subQuery);
                q.getElements().push(e);
                q.setLimit(limit);
                q.setOffset(offset);
                q.setResultStar(true);
                
            } else {
                q = query;
            }
            
            var result = this.sparqlService.createQueryExecution(q);
            return result;
        }        
    });

})();	
	
(function($) {

    var util = Jassa.util;
    var sparql = Jassa.sparql;
    
    // TODO: Get rid of this dependency
    var facete = Jassa.facete;
    
	var ns = Jassa.service;

    // Great! Writing to the object in a deferred done handler causes js to freeze...
    //ns.globalSparqlCache = {};

	ns.ServiceUtils = {

	    // FIXME constrainQueryVar, constrainQueryExprVar, chunkQuery should go to a different place, such as sparql.QueryUtils
	        
	    constrainQueryVar: function(query, v, nodes) {
            var exprVar = new sparql.ExprVar(v);
            var result = constrainQueryExprVar(query, exprVar, nodes);
            return result;
	    },

	    constrainQueryExprVar: function(query, exprVar, nodes) {
            var result = query.clone();
            var e = new sparql.ElementFilter(new sparql.E_OneOf(exprVar, nodes));
            result.getElements().push(e);
            
            return result;
	    },

	    /**
	     * Returns an array of queries where the variable v has been constraint to elements in nodes.
	     */
	    chunkQuery: function(query, v, nodes, maxChunkSize) {
            var chunks = util.ArrayUtils.chunk(nodes, maxChunkSize);
            var exprVar = new sparql.ExprVar(v);

            var self = this;
            var result = _(chunks).map(function(chunk) {
                var r = self.constrainQueryExprVar(query, exprVar, nodes);
                return r;
            });
            
            return result;
	    },

	    mergeResultSets: function(arrayOfResultSets) {
            var bindings = [];
            var varNames = [];
            _(arrayOfResultSets).each(function(rs) {
                var vns = rs.getVarNames();
                varNames = _(varNames).union(vns);
                
                var arr = rs.getIterator().getArray();
                bindings.push.apply(bindings, arr);
            });
	        
	        var itBinding = new util.IteratorArray(bindings);
	        var result = new ns.ResultSetArrayIteratorBinding(itBinding, varNames);

	        return result;
	    },
	    
	    execSelectForNodes: function(sparqlService, query, v, nodes, maxChunkSize) {
	        var queries = this.chunkQuery(query, v, nodes, maxChunkSize);
	        
	        var promises = _(queries).map(function(query) {
	            var qe = sparqlService.createQueryExecution(query);
	            var r = qe.execSelect();
	            return r;
	        });
	        
            var masterTask = jQuery.when.apply(window, promises);
            
            var self = this;
            var result = masterTask.pipe(function(/* arguments will be result sets */) {
                var r = self.mergeResultSets(arguments);
                return r;
            });

            return result;
	    },
	        
		/**
		 * TODO Rather use .close()
		 * 
		 * @param rs
		 * @returns
		 */
		consumeResultSet: function(rs) {
			while(rs.hasNext()) {
				rs.nextBinding();
			}
		},
			
		resultSetToList: function(rs, variable) {
			var result = [];
			while(rs.hasNext()) {
				var binding = rs.nextBinding();

				var node = binding.get(variable);
				result.push(node);
			}
			return result;
		},
			
		// TODO: If there is only one variable in the rs, use it.
		resultSetToInt: function(rs, variable) {
			var result = null;

			if(rs.hasNext()) {
				var binding = rs.nextBinding();

				var node = binding.get(variable);
				
				// TODO Validate that the result actually is int.
				result = node.getLiteralValue();
			}
			
			return result;
		},

		
		fetchList: function(queryExecution, variable) {
			var self = this;
			var result = queryExecution.execSelect().pipe(function(rs) {
				var r = self.resultSetToList(rs, variable);
				return r;
			});
		
			return result;		
		},
		
		
		/**
		 * Fetches the first column of the first row of a result set and parses it as int.
		 * 
		 */
		fetchInt: function(queryExecution, variable) {
			var self = this;
			var result = queryExecution.execSelect().pipe(function(rs) {
				var r = self.resultSetToInt(rs,variable);
				return r;
			});

			return result;
		},
		
		
		/**
		 * Count the results of a query, whith fallback on timeouts
		 * 
		 * Attempt to count the full result set based on firstTimeoutInMs
		 * 
		 * if this fails, repeat the count attempt using the scanLimit
		 * 
		 * TODO Finish
		 */
		fetchCountQuery: function(sparqlService, query, firstTimeoutInMs, limit) {
		    
		    var elements = [new sparql.ElementSubQuery(query)];
		    
		    var varsMentioned = query.getVarsMentioned();
		    
		    var varGen = sparql.VarUtils.createVarGen('c', varsMentioned);

		    var outputVar = varGen.next();
		    //var outputVar = rdf.NodeFactory.createVar('_cnt_');
		    
		    //createQueryCount(elements, limit, variable, outputVar, groupVars, useDistinct, options)
		    var countQuery = facete.QueryUtils.createQueryCount(elements, null, null, outputVar, null, null, null);
		    
		    var qe = sparqlService.createQueryExecution(countQuery);
		    qe.setTimeout(firstTimeoutInMs);
		    
		    var deferred = jQuery.Deferred();
		    var p1 = ns.ServiceUtils.fetchInt(qe, outputVar); 
		    p1.done(function(count) {
		        
		        deferred.resolve({
		            count: count,
		            limit: null,
		            hasMoreItems: false
		        });

		    }).fail(function() {

		        // Try counting with the fallback size
	            var countQuery = facete.QueryUtils.createQueryCount(elements, limit, null, outputVar, null, null, null);		        
	            var qe = sparqlService.createQueryExecution(countQuery);
	            var p2 = ns.ServiceUtils.fetchInt(qe, outputVar); 
	            p2.done(function(count) {
	                	                
	                deferred.resolve({
	                    count: count,
	                    limit: limit,
	                    hasMoreItems: count >= limit // using greater for robustness, although it should never happen
	                });	            
	            }).fail(function() {
	               deferred.fail(); 
	            });	            

		    });
		    
		    var result = deferred.promise();
		    return result;
		},

	    
	    //ns.globalSparqlCacheQueue = [];
	    
	    /**
	     * 
	     * @param baseURL
	     * @param query
	     * @param callback
	     * @param format
	     */
		createSparqlRequestAjaxSpec: function(baseUrl, defaultGraphIris, queryString, dataDefaults, ajaxDefaults) {
            var data = {
                'query': queryString,
                'default-graph-uri': defaultGraphIris
            };

            var result = {
		        url: baseUrl,
		        dataType: 'json',
		        crossDomain: true,
		        traditional: true,
		        data: data
		    };
		    
		    _(data).defaults(dataDefaults);
		    _(result).defaults(ajaxDefaults);
		    
		    return result;
		},
		
           // TODO Maybe move to a conversion utils package.
        jsonToResultSet: function(json) {
        
            var varNames = json.head.vars;
            var bindings = json.results.bindings;
        
            var tmp = bindings.map(function(b) {
                var bindingObj = sparql.Binding.fromTalisJson(b);
                return bindingObj;                  
            });
            
            var itBinding = new util.IteratorArray(tmp);
            
            var result = new ns.ResultSetArrayIteratorBinding(itBinding, varNames);
            return result;
        }
	};

})(jQuery);
(function() {
	
    var util = Jassa.util;
    var sparql = Jassa.sparql;
    
    var ns = Jassa.service;
    
    
    // Select ?a (Sum(b) As ?c) { ?a ?b ?c } --- joinCond: ?a ?c
    
    // getVarsMentioned() vs getVarsProvided()
    
    ns.Buffer = Class.create({
        isFull: function() {
            throw 'Not overridden';
        }
    });
    
    ns.BufferSet = Class.create(ns.Buffer, {
        initialize: function(maxItemCount) {
            // FIXME: util.SetList not defined
            this.data = new util.SetList();
            this.maxItemCount = maxItemCount;
        },
        
        add: function(item) {
            if(this.isFull()) {
                throw 'Buffer was full with ' + this.maxItemCount + ' items; Could not add item ' + item;
            }
            
            this.data.add(item);
        },
        
        isFull: function() {
            var result = this.data.size() >= this.maxItemCount;
            return result;
        },
        
        clear: function() {
            this.data.clear();
        },
        
        entries: function() {
            
        }
    });
    

    
    ns.BindingLookup = Class.create({
        initialize: function(sparqlService, element, joinExprs) {
            this.sparqlService = sparqlService;
            this.element = element;
            //this.joinExprs = joinExprs;
            // array of exprs - implicitly anded
            // if joinExprs is null, the bindings are used as constraints directly
            
            //this.exprSubstitutor = new sparql.ExprSubstitutor();
        },
        
        lookupByIterator: function(itBindings) {
            
            // Each binding (in order) maps to the join expr,
            // Each join expr maps to its corresponding set of bindings
            // MapList<Binding, MapList<Expr
   
            //var buffer = new util.Buffer(30);

            var bindingToExprs = [];
            
            while(itBindings.hasNext()) {
                var binding = itBindings.nextBinding();

//                var exprs = this.joinExprs.map(function(expr) {
//                    var r = sparql.ExprUtils.copySubstitute(joinExprs, binding);
//                    return r;
//                });
                
                
                var exprs = sparql.ExprUtils.bindingToExprs(binding);
                var exprsKey = exprs.join(', ');
                
                bindingToExprs.push({
                    binding: binding,
                    exprs: exprs,
                    exprsKey: exprsKey
                });
            }

            // FIXME: expr not defined
            var elementFilter = new sparql.ElementFilter(expr);
            
//            var filteredElement = new sparql.ElementGroup([
//                this.element,
//                elementFilter
//            ]);

            var subQuery = this.query.clone();
            subQuery.getElements().push(elementFilter);
            
            // TODO: Add columns for variables in B
            
            var rsB = this.sparqlService.execSelect(subQuery);
            
            
        }
    });
    
    
    ns.ResultSetHashJoin = Class.create(util.IteratorAbstract, {
        // Expression must be expressed in terms of variable appearing in (the bindings of) rsA and elementB
        /**
         * 
         * Example:
         *   Given the condition (?a < ?b) with ?a being provided by rsA, and elementB = {?x numberOfSeats ?b}
         *   Then the buffer will be filled with values of (?a), such as [1, 2, 3, 4, 5]...
         *   For each value in the buffer, we create an element {?x numberOfSeats ?b . Filter(?b < 1 ||  ?b < 2 || ?b < 3 ...) }
         * 
         * TODO Combine serviceB and elementB into 'thingWhereWeCanLookupTuplesByBindings'
         */
        initialize: function(rsA, serviceB, elementB, expr) {
            this.rsA = rsA;
            this.serviceB = serviceB;
            this.elementB = elementB;
            this.expr = expr;
            
            rsA.getVarsMentioned();
            expr.getVarsMentioned();
        },
        
        $prefetch: function() {
            var maxBufferSize = 20;
            var buffer = [];
            
            
            // Fill the buffer
            // FIXME: rsA not defined
            while(rsA.hasNext()) {
            
                
            }
            
            // If either the buffer is full or there are no more bindings in rsa,
            // Execute the join
            // FIXME: rsa not defined
            if(buffer.isFull() || !rsa.hasNext()) {
                
            }
            
        } 
    });
    
    
	var QueryExecutionUtils  = {
	    /**
	     * Given a result set rsA, and elementB, an serviceB and a condition on which
	     * to join
	     * 
	     */
	    createResultSetJoinHash: function(rsA, serviceB, elementB, expr) {
	        
	    },
	    
	    
	        
		execJoin: function(sparqlService, elementA, elementB, expr) {
			
		}
	};

//	var QepJoinFetchRight = Class.create({
//		initialize: function(lhs, rhs) {
//			
//		}
//	});
	
})();(function() {
    
    var ns = Jassa.service;
    
    ns.SparqlServiceFactory = Class.create({
        createSparqlService: function() {
            throw 'Not overridden';
        }
    });
    
    
    /**
     * 
     * 
     * 
     */
    ns.SparqlServiceFactoryConst = Class.create({
        initialize: function(sparqlService) {
            this.sparqlService = sparqlService;
        },
        
        createSparqlService: function() {
            var result = this.sparqlService;
            
            if(result == null) {
                console.log('[ERROR] Creation of a SPARQL service requested, but none was provided');
                throw 'Bailing out';
            }
            
            return result;
        },
        
        setSparqlService: function(sparqlService) {
            this.sparqlService = sparqlService;
        }
    });

    
    ns.SparqlServiceFactoryDefault = Class.create({
        initialize: function() {
            this.hashToCache = {};
        },
        
        createSparqlService: function(sparqlServiceIri, defaultGraphIris) {
            var tmp = new ns.SparqlServiceHttp(sparqlServiceIri, defaultGraphIris);
            tmp = new ns.SparqlServiceCache(tmp);
            
            var hash = tmp.getStateHash();
            
            var cacheEntry = this.hashToCache[hash];
            
            var result;
            if(cacheEntry) {
                result = cacheEntry;                
            } else {
                this.hashToCache[hash] = tmp;
                result = tmp;
            }
            
            return result;
        }
    });

})();

(function() {

    var util = Jassa.util;
    var sparql = Jassa.sparql;

    var ns = Jassa.service;


    ns.TableServiceUtils = {
        bindingToJsMap: function(varList, binding) {
            var result = {};
            
            _(varList).each(function(v) {
                var varName = v.getName();
                //result[varName] = '' + binding.get(v);
                result[varName] = binding.get(v);
            });

            return result;
       },
       
       createNgGridOptionsFromQuery: function(query) {
           if(!query) {
               return [];
           }
           
           var projectVarList = query.getProjectVars(); //query.getProjectVars().getVarList();
           var projectVarNameList = sparql.VarUtils.getVarNames(projectVarList);

           var result = _(projectVarNameList).map(function(varName) {
               var col = {
                   field: varName,
                   displayName: varName
               };
                   
               return col;
           });
           
           return result;
       },

       fetchCount: function(sparqlService, query, timeoutInMillis, secondaryCountLimit) {
           var result;
           if(!query) {
               var deferred = jQuery.Deferred();
               deferred.resolve(0);
               result = deferred.promise();
           } else {           
               query = query.clone();
    
               query.setLimit(null);
               query.setOffset(null);
     
               var result = ns.ServiceUtils.fetchCountQuery(sparqlService, query, timeoutInMillis, secondaryCountLimit);
           }

           return result;
       },
       
       fetchData: function(sparqlService, query, limit, offset) {
           if(!query) {
               var deferred = jQuery.Deferred();

               var itBinding = new util.IteratorArray([]);
               var varNames = [];
               var rs = new ns.ResultSetArrayIteratorBinding(itBinding, varNames);
              
               
               deferred.resolve(rs);
               return deferred.promise();
           }

           // Clone the query as to not modify the original object
           query = query.clone();

           query.setLimit(limit);
           query.setOffset(offset);
           
           var qe = sparqlService.createQueryExecution(query);

           var result = qe.execSelect().pipe(function(rs) {
               var data = [];
               
               var projectVarList = query.getProjectVars(); //query.getProjectVars().getVarList();
               
               while(rs.hasNext()) {
                   var binding = rs.next();
                   
                   var o = ns.TableServiceUtils.bindingToJsMap(projectVarList, binding);
                   
                   data.push(o);
               }
               
               return data;
           });
           
           return result;           
       },
       
       
       createNgGridOptionsFromQuery: function(query) {
       },


       collectNodes: function(rows) {
           // Collect nodes
           var result = [];
           _(rows).each(function(item, k) {
               _(item).each(function(node) {
                   result.push(node);
               });
           });

           _(result).uniq(false, function(x) { return '' + x; });
           
           return result;
       },

       fetchSchemaTableConfigFacet: function(tableConfigFacet, lookupServicePathLabels) {
           var paths = tableConfigFacet.getPaths().getArray();
           
           // We need to fetch the column headings
           var promise = lookupServicePathLabels.lookup(paths);
           
           var result = promise.pipe(function(map) {
               
               var colDefs = _(paths).map(function(path) {
                   var r = {
                       field: tableConfigFacet.getColumnId(path),
                       displayName: map.get(path),
                       path: path
                   };
                   return r;
               });

               var r = {
                   colDefs: colDefs
               };

               return r;
           });
           
           return result;           
       },

       // rows is expected to be a List<Map<String, Node>>
       transformToNodeLabels: function(lookupServiceNodeLabels, rows) {
           
           var nodes = this.collectNodes(rows);
           
           // Get the node labels
           var p = lookupServiceNodeLabels.lookup(nodes);
           
           // Transform every node
           var result = p.pipe(function(nodeToLabel) {
               var r = _(rows).map(function(row) {
                   var r = {};
                   _(row).each(function(node, key) {
                       var label = nodeToLabel.get(node);
                       r[key] = {
                           node: node,
                           displayLabel: label
                       };
                   });
                   return r;
               });
               return r;                    
           });
           
           return result;
       }
    };

    ns.TableService = Class.create({
        /**
         * Expected to return an object:
         * 
         * {    
         *    columns: [{id: 's', tags: your data}, {id: 'p'}]
         *    tags: your data
         * }
         */
        fetchSchema: function() {
            console.log('Implement me');
            throw 'Implement me';
        },
        
        /**
         * Expected to return a promise which yields an integral value for the total number of rows
         */
        fetchCount: function() {
            console.log('Implement me');
            throw 'Implement me';
        },        
        
        /**
         * Expected to return a promise which yields an array of objects (maps) from field name to field data
         */
        fetchData: function(limit, offset) {
            console.log('Implement me');
            throw 'Implement me';            
        }
        
        /**
         * For identical hash codes, the response of the fetchData method is assumed to
         * be the same
         */
//        getDataConfigHash: function() {
//            console.log('Implement me');
//            throw 'Implement me';                        
//        },
//        
//        getSchemaConfigHash: function() {
//            console.log('Implement me');
//            throw 'Implement me';
//        }
    });



    ns.TableServiceQuery = Class.create(ns.TableService, {
        /**
         * TODO Possibly add primaryCountLimit - i.e. a limit that is never counted beyond, even if the backend might be fast enough
         */
        initialize: function(sparqlService, query, timeoutInMillis, secondaryCountLimit) {
            this.sparqlService = sparqlService;
            this.query = query;
            this.timeoutInMillis = timeoutInMillis || 3000;
            this.secondaryCountLimit = secondaryCountLimit || 1000;
        },
        
//        getDataConfigHash: function() {
//            var query = this.queryFactory.createQuery();
//            var result = '' + query;
//            return result;
//            //return '' + this.queryFactory.createQuery();
//        },
//        
//        getSchemaConfigHash: function() {
//            return '' + this.query;
//        },
        
        fetchSchema: function() {
            var schema = {
                colDefs: ns.TableServiceUtils.createNgGridOptionsFromQuery(this.query)
            };

            var deferred = $.Deferred();
            deferred.resolve(schema);
            
            return deferred.promise();
        },
        
        fetchCount: function() {
            var result = ns.TableServiceUtils.fetchCount(this.sparqlService, this.query, this.timeoutInMillis, this.secondaryCountLimit);
            return result;
        },
        
        fetchData: function(limit, offset) {
            var result = ns.TableServiceUtils.fetchData(this.sparqlService, this.query, limit, offset);
            return result;
        }        
    });

    
    /**
     * So the issue is: actually we need a lookup service to get the column headings
     * The lookup service would need the sparqlService
     * 
     * 
     */
    ns.TableServiceFacet = Class.create(ns.TableService, {
        initialize: function(tableServiceQuery, tableConfigFacet, lookupServiceNodeLabels, lookupServicePathLabels) {
            this.tableServiceQuery = tableServiceQuery;
            this.tableConfigFacet = tableConfigFacet;
            this.lookupServiceNodeLabels = lookupServiceNodeLabels;
            this.lookupServicePathLabels = lookupServicePathLabels;
        },
        
        fetchSchema: function() {
            // Ignores the schema of the underlying table Service
            var result = ns.TableServiceUtils.fetchSchemaTableConfigFacet(this.tableConfigFacet, this.lookupServicePathLabels);
            return result;
        },
                
        fetchCount: function() {
            var result = this.tableServiceQuery.fetchCount();
            return result;            
        },
                
        fetchData: function(limit, offset) {
            
            var promise = this.tableServiceQuery.fetchData(limit, offset);
            //var promise = ns.TableServiceUtils.fetchData(this.sparqlService, this.query, limit, offset);

            var self = this;
            var result = promise.pipe(function(rows) {
                var r = ns.TableServiceUtils.transformToNodeLabels(self.lookupServiceNodeLabels, rows);
                return r;
            });
            
            return result;
        }
    });
    
    
})();

(function() {

    var ns = jassa.service;
    
    ns.LookupService = Class.create({
        getIdStr: function(id) {
            console.log('Not overridden');
            throw 'Not overridden';
        },

        /**
         * This method must return a promise for a Map<Id, Data>
         */
        lookup: function(ids) {
            console.log('Not overridden');
            throw 'Not overridden';
        }
    });
    
    
    /**
     * This function must convert ids to unique strings
     * Only the actual service (e.g. sparql or rest) needs to implement it
     * Layers on top of it (e.g. caching, delaying) will then delegate to the
     * inner-most getIdStr function.
     *
     */
    ns.LookupServiceBase = Class.create(ns.LookupService, {
        getIdStr: function(id) {
            var result = '' + id;
            return result;
        }
    });

    ns.LookupServiceDelegateBase = Class.create(ns.LookupService, {
        initialize: function(delegate) {
            this.delegate = delegate;
        },

        getIdStr: function(id) {
            var result = this.delegate.getIdStr(id);
            return result;
        }
    });

    /**
     * Lookup service is simply a service that can asynchronously map ids to documents (data).
     *
     */
    ns.LookupServiceCache = Class.create(ns.LookupServiceDelegateBase, {
        initialize: function($super, delegate, requestCache) {
            $super(delegate);
            this.requestCache = requestCache || new service.RequestCache();
        },
        
        /**
         * This method must return a promise for the documents
         */
        lookup: function(ids) {
            var self = this;

            //console.log('cache status [BEFORE] ' + JSON.stringify(self.requestCache));

            // Make ids unique
            var uniq = _(ids).uniq(false, function(id) {
                var idStr = self.getIdStr(id);                
                return idStr;
            });

            var resultMap = new util.HashMap();

            var resultCache = this.requestCache.getResultCache();
            var executionCache = this.requestCache.getExecutionCache();
            
            // Check whether we need to wait for promises that are already executing
            var open = [];
            var waitForIds = [];
            var waitForPromises = [];
            
            _(uniq).each(function(id) {
                var idStr = self.getIdStr(id);

                var data = resultCache.getItem(idStr);
                if(!data) {
                    
                    var promise = executionCache[idStr];
                    if(promise) {
                        waitForIds.push(id);

                        var found = _(waitForPromises).find(function(p) {
                            var r = (p == promise);
                            return r;
                        });

                        if(!found) {
                            waitForPromises.push(promise);
                        }
                    }
                    else {
                        open.push(id);
                        waitForIds.push(id);
                    }
                } else {
                    resultMap.put(id, data);
                }
            });
            
            
            if(open.length > 0) {
                var p = this.fetchAndCache(open);
                waitForPromises.push(p);
            }
            
            var result = jQuery.when.apply(window, waitForPromises).pipe(function() {
                var maps = arguments;
                _(waitForIds).each(function(id) {
                    
                    var data = null;
                    _(maps).find(function(map) {
                        data = map.get(id);
                        return !!data;
                    });
                    
                    if(data) {
                        resultMap.put(id, data);
                    }
                });
                
                return resultMap;
            });
            
            return result;
        },
        
        /**
         * Function for actually retrieving data from the underlying service and updating caches as needed.
         *
         * Don't call this method directly; it may corrupt caches!
         */
        fetchAndCache: function(ids) {
            var resultCache = this.requestCache.getResultCache();            
            var executionCache = this.requestCache.getExecutionCache();

            var self = this;
            
            var p = this.delegate.lookup(ids);
            var result = p.pipe(function(map) {
                
                var r = new util.HashMap();

                _(ids).each(function(id) {
                    //var id = self.getIdFromDoc(doc);
                    var idStr = self.getIdStr(id);
                    var doc = map.get(id);
                    resultCache.setItem(idStr, doc);
                    r.put(id, doc);
                });

                _(ids).each(function(id) {
                    var idStr = self.getIdStr(id);
                    delete executionCache[idStr];
                });
                
                return r;
            });

            _(ids).each(function(id) {
                var idStr = self.getIdStr(id);
                executionCache[idStr] = result;
            });
            
            return result;
        }
        
    });


    /**
     * Wrapper that collects ids for a certain amount of time before passing it on to the
     * underlying lookup service.
     */
    ns.LookupServiceTimeout = Class.create(ns.LookupServiceDelegateBase, {
        
        initialize: function(delegate, delayInMs, maxRefreshCount) {
            this.delegate = delegate;

            this.delayInMs = delayInMs;
            this.maxRefreshCount = maxRefreshCount || 0;
            
            this.idStrToId = {};
            this.currentDeferred = null;
            this.currentPromise = null;
            this.currentTimer = null;            
            this.currentRefreshCount = 0;
        },
        
        getIdStr: function(id) {
            var result = this.delegate.getIdStr(id);
            return result;
        },
        
        lookup: function(ids) {
            if(!this.currentDeferred) {
                this.currentDeferred = jQuery.Deferred();
                this.currentPromise = this.currentDeferred.promise();
            }

            var self = this;
            _(ids).each(function(id) {
                var idStr = self.getIdStr(id);
                var val = self.idStrToId[idStr];
                if(!val) {
                    self.idStrToId[idStr] = id;
                }
            });
            
            if(!this.currentTimer) {
                this.startTimer();
            }

            // Filter the result by the ids which we requested
            var result = this.currentPromise.pipe(function(map) {
                var r = new util.HashMap();
                _(ids).each(function(id) {
                    var val = map.get(id);
                    r.put(id, val);
                });
                return r;
            });
            
            
            return result;
        },
        
        startTimer: function() {

            var self = this;
            var seenRefereshCount = this.currentRefreshCount;
            var deferred = self.currentDeferred;
            
            this.currentTimer = setTimeout(function() {
                
                if(self.maxRefreshCount < 0 || seenRefereshCount < self.maxRefreshCount) {
                    //clearTimeout(this.currentTimer);
                    ++self.currentRefreshCount;
                    self.startTimer();
                    return;
                }
                
                var ids = _(self.idStrToId).values();
                
                self.idStrToId = {};
                self.currentRefreshCount = 0;
                self.currentDeferred = null;
                self.currentTimer = null;

                var p = self.delegate.lookup(ids);
                p.pipe(function(map) {
                    deferred.resolve(map);
                }).fail(function() {
                    deferred.fail();
                });
                
            }, this.delayInMs);
        }

        // TODO Rather than refresing for the whole time interval, we could
        // refresh upon every change (up to a maximum delay time)
        /*
        var self = this;
        var isModified = false;
        _(ids).each(function(id) {
            var idStr = self.delegate.getIdStr(id);
            var val = self.idStrToId[idStr];
            if(!val) {
                idStrToId[idStr] = id;
                isModified = true;
            }
        });

        if(!isModified) {
            return result;
        }
        */

    });

    
    ns.LookupServiceSponate = Class.create(ns.LookupServiceBase, {
        initialize: function(source) {
            // Note: By source we mean e.g. store.labels
            this.source = source;
        },
        
        lookup: function(nodes) {
            var result = this.source.find().nodes(nodes).asList(true).pipe(function(docs) {
                var r = new util.HashMap();
                _(docs).each(function(doc) {
                    r.put(doc.id, doc);
                });
                return r;
            });

            return result;
        }
    });


    // In-place transform the values for the looked up documents
    ns.LookupServiceTransform = Class.create(ns.LookupServiceDelegateBase, {
        initialize: function($super, delegate, fnTransform) {
            $super(delegate);
            this.fnTransform = fnTransform;
        },
                
        lookup: function(ids) {
            var fnTransform = this.fnTransform;

            var result = this.delegate.lookup(ids).pipe(function(map) {
                
                _(ids).each(function(id) {
                    var val = map.get(id);
                    var t = fnTransform(val, id);
                    map.put(id, t);
                });
                
                return map;
            });
            
            return result;
        }
    });
    
})();(function() {
	
	var ns = Jassa.sparql;
	

	ns.evaluators = {
		'&&': function() {
			
		}
			
	};
	
	
	ns.ExprEvaluator = Class.create({
	   eval: function(expr, binding) {
	       throw 'Not overridden';
	   } 
	});
	

	ns.ExprEvaluatorImpl = Class.create(ns.ExprEvaluator, {
		
		eval: function(expr, binding) {
			
			var result;

			if(expr.isVar()) {
				var e = expr.getExprVar();
				result = this.evalExprVar(e, binding);
			}
			else if(expr.isFunction()) {
				var e = expr.getFunction();
				result = this.evalExprFunction(e, binding);
			}
			else if(expr.isConstant()) {
				var e = expr.getConstant();
        // FIXME: this.evalConstant not defined
				result = this.evalConstant(e, binding);
			}
			else {
				throw 'Unsupported expr type';
			}
			
			return result;
		},
		

		evalExprVar: function(expr, binding) {
			//console.log('Expr' + JSON.stringify(expr));
			var v = expr.asVar();
			
			var node = binding.get(v);
			
			var result;
			if(node == null) {
				//console.log('No Binding for variable "' + v + '" in ' + expr + ' with binding ' + binding);
				//throw 'Bailing out';
			    return ns.NodeValue.nvNothing;
			    //return null;
			} else {
				result = ns.NodeValue.makeNode(node);
			}
			
			return result;
		},

		
		evalExprFunction: function(expr, binding) {
			
		},

		evalNodeValue: function(expr, binding) {
		}

	});

	
})();(function($) {
    
    var service = Jassa.service;
    var ns = Jassa.client;


    /**
     * Client wrapper for an API that searches for property paths
     * connecting a source concept to a target concept.
     * 
     */
    ns.ConceptPathFinderApi = Class.create({
        initialize: function(apiUrl, sparqlServiceIri, defaultGraphIris, joinSummaryServiceIri, joinSummaryGraphIris) {
            this.apiUrl = apiUrl;
            this.sparqlServiceIri = sparqlServiceIri;
            this.defaultGraphIris = defaultGraphIris;
            
            // TODO Path finding options and strategy should go into generic attributes
            //this.nPaths = nPaths;
            //this.maxHops = maxHops;
            
            this.joinSummaryServiceIri = joinSummaryServiceIri;
            this.joinSummaryGraphIris = joinSummaryGraphIris;
        },

        createAjaxConfig: function(sourceConcept, targetConcept) {
			var result = {
                'service-uri': this.sparqlServiceIri,
                'default-graph-uri': this.defaultGraphIris,
                'source-element': sourceConcept.getElement().toString(),
                'source-var':  sourceConcept.getVar().getName(),
                'target-element': targetConcept.getElement().toString(),
                'target-var': targetConcept.getVar().getName(),
                'js-service-uri': this.joinSummaryServiceIri,
                'js-graph-uri': this.joinSummaryGraphIris
                //'n-paths': this.nPaths,
                //'max-hops': this.maxHops
            };

			return result;
        },

        createSparqlService: function(sourceConcept, targetConcept) {
			var data = this.createAjaxConfig(sourceConcept, targetConcept);

            // TODO How can we turn the ajax spec into a (base) URL?

			var result = new service.SparqlServiceHttp(this.apiUrl, [], null, data);
			return result;
        },

        findPaths: function(sourceConcept, targetConcept) {
			var data = this.createAjaxConfig(sourceConcept, targetConcept);

            var ajaxSpec = {
                url: this.apiUrl,
                dataType: 'json',
                crossDomain: true,
                traditional: true, // Serializes JSON arrays by repeating the query string paramater
				data: data
            };

            //console.log('[DEBUG] Path finding ajax spec', ajaxSpec);
            
            var result = $.ajax(ajaxSpec).pipe(function(pathStrs) {
                var result = [];
                
                for(var i = 0; i < pathStrs.length; ++i) {
                    var pathStr = pathStrs[i];
                    
                    //console.log("pathStr is", pathStr);
                    
                    var path = facete.Path.parse(pathStr);
                    result.push(path);
                }
                
                return result;
            });
            
            return result;
        },
        
        findPathsOldApi: function(sourceConcept, targetConcept) {
            
            var querySpec = {
                    service: {
                        serviceIri: this.sparqlServiceIri,
                        defaultGraphIris: this.defaultGraphIris
                    },
                    sourceConcept: {
                        elementStr: sourceConcept.getElement().toString(),
                        varName: sourceConcept.getVar().value
                    },
                    targetConcept: {
                        elementStr: targetConcept.getElement().toString(),
                        varName: targetConcept.getVar().value
                    }
            };
            
            var ajaxSpec = {
                url: this.apiUrl,
                dataType: 'json',
                data: {
                    query: JSON.stringify(querySpec)
                }
            };

            //console.log('[DEBUG] Path finding ajax spec', ajaxSpec);
            
            var result = $.ajax(ajaxSpec).pipe(function(pathStrs) {
                var result = [];
                
                for(var i = 0; i < pathStrs.length; ++i) {
                    var pathStr = pathStrs[i];
                    
                    //console.log("pathStr is", pathStr);
                    
                    var path = facete.Path.parse(pathStr);
                    result.push(path);
                }
                
                return result;
            });
            
            return result;
        }
    });
    
})(jQuery);
(function() {
	
	var ns = Jassa.sponate;

	
//	ns.Map = Class.create({
//		initialize: function(fnEquals, fnHash) {
//			this.fnHash = fnHash ? fnHash : (function(x) { return '' + x; }); 
//			this.hashToItems = {};
//		},
//		
//		put: function(key, val) {
//			var hash = fnHash(key);
//			
//		}
//	});

	
	/**
	 * Datastructure for a map which retains order of inserts
	 * 
	 */
	ns.MapList = Class.create({
		initialize: function() {
			this.items = [];			
			this.keyToIndex = {};			
		},
		
		put: function(key, item) {
			if(key == null) {
				console.log('key must not be null');
				throw 'Bailing out';
			}
			
			var index = this.keyToIndex[key];
			if(index) {
				console.log('Index already existed');
				throw 'Bailing out';
			}
			
			index = this.items.length;
			this.items.push(item);
			
			this.keyToIndex[key] = index;
		},
		
		get: function(key) {
			var index = this.keyToIndex[key];
			
			var result = (index == null) ? null : this.items[index];
			
			return result;
		},
		
		getByIndex: function(index) {
			return this.items[index];
		},
		
		getItems: function() {
			return this.items; 
		},
		
		getKeyToIndex: function() {
			return this.keyToIndex;
		}
		
//		asArray: function() {
//			return this.items.slice(0);
//		},
//		
//		asMap: function() {
//			
//		}
	});

	
})();(function() {

    var rdf = Jassa.rdf;
    var sparql = Jassa.sparql;
    var util = Jassa.util;

    var ns = Jassa.sponate;

    ns.AccumulatorFactoryFn = Class.create({
        classLabel: 'AccumulatorFactoryFn',
        
        initialize: function(fn, referencedVars) {
            this.fn = fn;
            this.referencedVars = referencedVars;
        },

        createAggregator: function() {
            var result = new ns.AccumulatorFn(this.fn, this.referencedVars);
            return result;
        },
        
        getVarsMentioned: function() {
            return this.referencedVars;
        }
    });
    
    ns.AccumulatorFn = Class.create({
        classLabel: 'AccumulatorFn',
        
        initialize: function(fn) {
            this.fn = fn;
            // TODO Is this really a node, or an arbitrary object?
            this.node = null;
        },
        
        processBinding: function(binding) {
            var val = this.fn(binding);
            this.node = val;
        },
        
        getJson: function(retainRdfNodes) {
            return this.node;
            //return this.node.toString();
        },
        
        toNode: function() {
            return this.node
        }
    });

	
	/**
	 * TODO Like Jena, we could use the namings Aggregator and Accumulator
	 * I think our aggregators are closer to accumulators. 
	 * 
	 */
	
	/**
	 * A path of attributes.
	 * 
	 * Just an array of attribute names.
	 * 
	 * 
	 */
	ns.AttrPath = Class.create({
        classLabel: 'AttrPath',

		initialize: function(steps) {
			this.steps = steps ? steps : [];
		},
		
		getSteps: function() {
			return this.steps;
		},
		
		toString: function() {
			return this.steps.join('.');
		},
		
		slice: function(start, end) {
			var result = this.steps.slice(start, end);
			return result;
		},
		
		first: function() {
			return this.steps[0];
		},
		
		at: function(index) {
			return this.steps[index];
		},
		
		isEmpty: function() {
		    return this.steps.length == 0;
		},
		
		size: function() {
		    return this.steps.length;
		},
		
		concat: function(that) {
			var tmp = this.steps.concat(that.getSteps());
			var result = new ns.AttrPath(tmp);
			return result;
		},
		
		
		/**
		 * Retrieve the value of a path in a json document
		 * 
		 */
		find: function(doc) {
			var result = doc;
			
			var steps = this.steps;
			for(var i = 0; i < steps.length; ++i) {			
				var attr = steps[i];

				if(!_(result).isObject()) {
					console.log('[ERROR] Cannot access attribute of non-object', this.steps, doc, result);
					throw 'Bailing out';
				}
				
				result = result[attr];
			}
			
			return result;
		}
	});
	
	ns.AttrPath.parse = function(str) {
		var steps = str.split('.');
		
		return new ns.AttrPath(steps);
	};
	

	
	/*
	 * patterns
	 * 
	 * This object's state are the 'blue brint' for building the json documents from sparql bindings
	 * 
	 */

	// DON'T USE ANYMORE - visitor pattern in JavaScript turned out to be pretty useless
	ns.callVisitor = function(name, self, args) {

//		if(self !== this) {
//			console.log('Different this pointers');
//		}
		
		// The first argument is the visitor
		var visitor = args[0];

		var fn = visitor[name];

		if(!fn) {
			console.log('[ERROR] No visitor with name ' + name + ' in ', self);
			throw 'Bailing out';
		}
		
		var tmp = Array.prototype.slice.call(args, 1);
		var xargs = [self].concat(tmp);
		//console.log('xargs', xargs.length, xargs);
		
		//debugger;
		var result = fn.apply(visitor, xargs);
		
		return result;
		
	};
	
	/**
	 * 
	 * 
	 */
	ns.Pattern = Class.create({
        classLabel: 'Pattern',

		callVisitor: function(name, self, args) {
			var result = ns.callVisitor(name, self, args);
			return result;
		},

		getClassName: function() {
            throw 'override me';		    
		},
		
//		accept: function() {
//			throw 'override me';
//		},

		toString: function() {
			return 'override me';
		},

		getVarsMentioned: function() {
			throw 'override me';
		},
		
		/**
		 * Get the list of sub patterns; empty array if none
		 */
		getSubPatterns: function() {
			throw 'override me';
		},
		
		$getReferences: function(result) {
			throw 'override me';
		},
		
		/**
		 * Find a pattern by an object of type ns.AttrPath.
		 * If a string is passed, it will be parsed first.
		 * 
		 * 
		 */
		findPattern: function(rawAttrPath, start) {
			
			var attrPath;
			if(_(attrPath).isString()) {
				attrPath = ns.AttrPath.parse(rawAttrPath);
			} else {
				attrPath = rawAttrPath;
			}
			
			start = start ? start : 0;
			
			var result;
			// On empty paths return this.
			var pathLength = attrPath.size();
			if(start > pathLength) {
			    console.log('[ERROR] Start in path ' + start + ' greater than path length ' + pathLength);
			}
			else if(start == pathLength) {
			    result = this;
			}
			else {
			    result = this.$findPattern(attrPath, start);
			}
			return result;
		},
		
		$findPattern: function(attrPath, start) {
			console.log('[ERROR] "findPattern" for path "' + attrPath + '" is not supported on this kind of object: ' + JSON.stringify(this));
			throw 'Bailing out';
		}
	});
	
	
//	ns.Iterator = Class.create({
//		next: function() {
//			throw 'Not overridden';
//		},
//		
//		hasNext: function() {
//			throw 'Not overridden';
//		}
//	});
	


			
	
	
/*
	ns.IteratorDepthFirst = Class.create({
		initialize: function(node, fnGetChildern, fnGetValue) {
			this.fnGetChildren = fnGetChildren;
			this.fnGetValue = fnGetValue;
		},
		
		prefetch: function() {
			
		}
	});
*/
	
	ns.PatternUtils = {
		/**
		 * Get all patterns in a pattern
		 */
		getRefs: function(pattern) {
			var result = [];
			
			var fn = function(pattern) {
				var proceed = true;
				if(pattern instanceof ns.PatternRef) {
					result.push(pattern);
					proceed = false;
				}
				
				return proceed;
			};
			
			util.TreeUtils.visitDepthFirst(pattern, ns.PatternUtils.getChildren, fn);
			
			return result;
		},
		
		getChildren: function(pattern) {
			return pattern.getSubPatterns();
		}
		
		/**
		 * Generic method for visiting a tree structure
		 * 
		 */
//		visitDepthFirst: function(parent, fnChildren, fnPredicate) {
//			var proceed = fnPredicate(parent);
//			
//			if(proceed) {
//				var children = fnChildren(parent);
//				
//				_(children).each(function(child) {
//					ns.PatternUtils.visitDepthFirst(child, fnChildren, fnPredicate);
//				});
//			}
//		}
			
	};
	
	ns.PatternCustomAgg = Class.create(ns.Pattern, {
	    classLabel: 'PatternCustomAgg',
    
	    initialize: function(customAggFactory) {
	        this.customAggFactory = customAggFactory;
	    },
    
	    getCustomAggFactory: function() {
	        return this.customAggFactory;
	    },
       
	    getClassName: function() {
	        return 'PatternCustomAgg';
	    },
       
	    getVarsMentioned: function() {
	        var result = this.customAggFactory.getVarsMentioned();
	        return result;
	    },
       
	    getSubPatterns: function() {
	        return [];
	    }
	});
	
	/**
	 * A pattern for a single valued field.
	 * 
	 * Can carry a name to a client side aggregator to use.
	 * 
	 * 
	 */
	ns.PatternLiteral = Class.create(ns.Pattern, {
	    classLabel: 'PatternLiteral',

		initialize: function(expr, aggregatorName) {
			this.expr = expr;
			this.aggregatorName = aggregatorName;
		},
		
        getClassName: function() {
            return 'PatternLiteral';            
        },
		
		getExpr: function() {
			return this.expr;
		},
		
//		accept: function(visitor) {
//			var result = this.callVisitor('visitLiteral', this, arguments);
//			return result;
//		},
		
		toString: function() {
			return '' + this.expr;
		},

		getVarsMentioned: function() {
			var result = this.expr.getVarsMentioned();
			return result;
		},
		
		getSubPatterns: function() {
			return [];
		}
	});


	/**
	 * A pattern for a map from *predefined* keys to patterns.
	 * 
	 */
	ns.PatternObject = Class.create(ns.Pattern, {
	    classLabel: 'PatternObject',

		initialize: function(attrToPattern) {

		    //console.log('attrToPattern', attrToPattern);
		    
		    
			this.attrToPattern = attrToPattern;
		},

		getClassName: function() {
            return "PatternObject";            
        },

		getMembers: function() {
			return this.attrToPattern;
		},

//		putPattern: function(attr, subPattern) {
//			var p = this.attrToPattern[attr];
//			if(p) {
//				throw 'Sub pattern already set for ' + attr;
//			}
//			
//			this.attrToPattern[attr] = subPattern;
//		},
		
		getPattern: function(attr) {
			return this.attrToPattern[attr];
		},
		
//		accept: function(visitor) {
//			var result = this.callVisitor('visitObject', this, arguments);
//			return result;
//		},
		
		toString: function() {
			var parts = [];
			_(this.attrToPattern).each(function(v, k) { parts.push('"' + k + '": ' + v); });
			
			var result = '{' + parts.join(',') + '}';
			return result;
		},

		getVarsMentioned: function() {
			var result = [];
			
			var fnToString = (function(x) {
				//console.log('x: ' + x, x, x.toString());
				return x.toString();
			});
			
			_(this.attrToPattern).each(function(member, k) {
			    var vs = member.getVarsMentioned();
			    
			    if(!vs) {
			        console.log('[ERROR] Could not retrieve vars for member of pattern', this, member);
			    }
			    else {
			        result = result.concat(vs);
			    }
			});
			result = _.uniq(result, false, fnToString);	
			
			return result;		
		},
		
		$findPattern: function(attrPath, start) {
			var attr = attrPath.at(start);
			
			var pattern = this.attrToPattern[attr];
			
			var result;
			if(pattern) {
//			    if(attrPath.size() > start + 1) {
			        result = pattern.findPattern(attrPath, start + 1);
//			    }
//			    else {
//			        result = pattern;
//			    }
			} else {
				result = null;
			}
			
			return result;
		},
		
		getSubPatterns: function() {
			var result = [];
			
			_.each(this.attrToPattern, function(member, k) {
				result.push(member);
			});

			return result;
		}
	});

	
	/**
	 * A pattern for a map from *variable* keys to patters
	 * 
	 * map[keyExpr(binding)] = pattern(binding);
	 * 
	 * The subPattern corresponds to the element contained
	 * 
	 * TODO An array can be seen as a map from index to item
	 * So formally, PatternMap is thus the best candidate for a map, yet
	 * we should add a flag to treat this pattern as an array, i.e. the groupKey as an index
	 * 
	 */
	ns.PatternMap = Class.create(ns.Pattern, {
	    classLabel: 'PatternMap',

	    
		initialize: function(keyExpr, subPattern, isArray) {
			this.keyExpr = keyExpr;
			this.subPattern = subPattern;
			this._isArray = isArray;
		},
		
        getClassName: function() {
            return "PatternMap";            
        },

		getKeyExpr: function() {
			return this.keyExpr;
		},
		
		getSubPattern: function() {
			return this.subPattern;
		},
		
		isArray: function() {
			return this._isArray;
		},
		
		toString: function() {
			var result = '[' + this.subPattern + ' / ' + this.keyExpr + '/' + this.type + ']';
			return result;
		},

//		accept: function(visitor) {
//			var result = this.callVisitor('visitMap', this, arguments);
//			return result;
//		},
		
		getVarsMentioned: function() {
			var result = this.subPattern.getVarsMentioned();
			return result;
		},
		
		getSubPatterns: function() {
			return [this.subPattern];
		},
		
		$findPattern: function(attrPath, start) {
		    var result = this.subPattern.findPattern(attrPath, start);
		    return result;
        }

	});

	
	/**
	 * A PatternRef represents a reference to another Mapping.
	 * However, because we allow forward references, we might not be able
	 * to resolve references during parsing.
	 * For this reason, we first just store the original configuration
	 * in the stub object, and later resolve it into a full blown refSpec.
	 * 
	 */
	ns.PatternRef = Class.create(ns.Pattern, {
	    classLabel: 'PatternRef',

		initialize: function(stub) {
			this.stub = stub;
			this.refSpec = null;
		},

		getClassName: function() {
            return "PatternRef";            
        },
		
		getStub: function() {
			return this.stub;
		},
		
		setRefSpec: function(refSpec) {
			this.refSpec = refSpec;
		},
		
		getRefSpec: function() {
			return this.refSpec;
		},
		
		toString: function() {
			return JSON.stringify(this);
		},
		
//		accept: function(visitor) {
//			var result = this.callVisitor('visitRef', this, arguments);
//			return result;
//		},

		getVarsMentioned: function() {
			var result = [];
			
			var stub = this.stub;
      // FIXME: joinColumn not defined
			if(stub.joinColumn != null) {
				// TODO HACK Use proper expression parsing here
				var v = rdf.Node.v(stub.joinColumn.substr(1));
				result.push(v);
			} else {
				console.log('[ERROR] No join column declared; cannot get variable');
				throw 'Bailing out';
			}
			
			
			return result;
			
			//if(refSpec)
		},
		
		getSubPatterns: function() {
			return [];
		}
	});


	/**
	 * A reference to a table of which some columns are source, and others are target columns
	 * 
	 */
	ns.JoinTableRef = Class.create({
		initialize: function(tableName, sourceColumns, targetColumns) {
			this.tableName = tableName;
			this.sourceColumns = sourceColumns;
			this.targetColumns = targetColumns;
		},
		
		getTableName: function() {
			return this.tableName;
		},
		
		getSourceColumns: function() {
			return this.sourceColumns;
		},
		
		getTargetColumns: function() {
			return this.targetColumns;
		},
		
		toString: function() {
			var result
				= '(' + this.sourceColumns.join(', ') + ') '
				+ this.tableName
        // FIXME: this.targetJoinColumns not defined
				+ ' (' + this.targetJoinColumns.join() + ')';
			
			return result;
		}
	});

	/**
	 * 
	 * 
	 */
	ns.TableRef = Class.create({
		initialize: function(tableName, columnNames) {
			this.tableName = tableName;
			this.columnNames = columnNames;
		},
		
		getTableName: function() {
			return this.tableName;
		},
		
		getColumnNames: function() {
			return this.columnNames;
		},
		
		toString: function() {
			var result = this.tableName + '(' + this.columnNames.join(', ') + ')';
			return result;
		}
	});


	/**
	 * A reference to another map's pattern
	 * 
	 */
//	ns.RefPattern = Class.create({
//		initialize: function(mapName, attrPath) {
//			this.mapName = mapName;
//			this.attrPath = attrPath;
//		},
//		
//		getMapName: function() {
//			return this.mapName;
//		},
//		
//		getAttrPath: function() {
//			return this.attrPath;
//		},
//		
//		toString: function() {
//			var result = this.mapName + '::' + attrPath;
//			return result;
//		}
//
//	});
	

	/**
	 * A reference to another map
	 * 
	 */
	ns.MapRef = Class.create({
		initialize: function(mapName, tableRef, attrPath) {
			this.mapName = mapName;
			this.tableRef = tableRef;
		},
		
		getMapName: function() {
			return this.mapName;
		},
		
		getTableRef: function() {
			return this.tableRef;
		},

		getAttrPath: function() {
			return this.attrPath;
		},
		
		toString: function() {
			var result = this.patternRef + '/' + this.tableRef + '@' + this.attrPath;
			return result;
		}
	});
	
	/**
	 * Specification of a reference.
	 * 
	 * 
	 */
	ns.RefSpec = Class.create({

		initialize: function(sourceMapRef, targetMapRef, isArray, joinTableRef) {
			this.sourceMapRef = sourceMapRef;
			this.targetMapRef = targetMapRef;
			this.isArray = isArray;
			this.joinTableRef = joinTableRef;
		},
	
		getSourceMapRef: function() {
			return this.sourceMapRef;
		},
		
		getTargetMapRef: function() {
			return this.targetMapRef;
		},
		
		isArray: function() {
			return this.isArray;
		},
		
		getJoinTableRef: function() {
			return this.joinTableRef;
		},
		
		toString: function() {
			var result = this.sourceMapRef + ' references ' + this.targetMapRef + ' via ' + this.joinTableRef + ' as array? ' + this.isArray;
			return result;
		}
	});


	/*
	 * Aggregators
	 *     TODO: Possibly rename aggregators to accumulators and pattern to aggregators.
	 */
		
	ns.Aggregator = Class.create({
	    classLabel: 'Aggregator',

	    
		getPattern: function() {
			throw 'override me';
		},
		
		getJson: function(retainRdfNodes) {
			throw 'override me';
		}
	});

	
	ns.AggregatorCustomAgg = Class.create(ns.Aggregator, {
	    classLabel: 'AggregatorCustomAgg',
	    
	    
	    initialize: function(patternCustomAgg, customAgg) {
	        this.customAgg = customAgg;
          this.patternCustomAgg = patternCustomAgg;
	    },
	   
	    getPattern: function() {
	        return this.patternCustomAgg;
	    },
	   
	    process: function(binding, context) {
	        this.customAgg.processBinding(binding);
	    },
	   
	    getJson: function(retainRdfNodes) {
	        var result = this.customAgg.getJson(retainRdfNodes);
	        return result;
	    }
	});
	
	
	ns.AggregatorLiteral = Class.create(ns.Aggregator, {
	    classLabel: 'AggregatorLiteral',

		initialize: function(patternLiteral) {
			this.patternLiteral = patternLiteral;
			
			this.node = null;
		},
		
		getPattern: function() {
			return this.patternLiteral;
		},
		
		process: function(binding, context) {
			var expr = this.patternLiteral.getExpr();

			var exprEvaluator = context.exprEvaluator;
			
			var ex = exprEvaluator.eval(expr, binding);
			if(ex.isConstant()) {
				var c = ex.getConstant();
				var node = c.asNode();

				this.setNode(node);
	
			} else {
				console.log('[ERROR] Could not evaluate to constant');
				throw 'Bailing out';
			}			
		},
		
		setNode: function(newNode) {
			var oldNode = this.node;
			
			if(oldNode == null) {
				this.node = newNode;
			}
			else {
				if(!oldNode.equals(newNode)) {
					console.log('[ERROR] Value already set: Attempted to override ' + oldNode + ' with ' + newNode);
				}
			}
		},
		
		getJson: function(retainRdfNodes) {
			var result;

			var node = this.node;
			
			if(node) {
			    
			    if(retainRdfNodes) {
			        result = node;
			    } else {
			    
    				if(node.isUri()) {
    					result = node.toString();
    				} else if (node.isLiteral()) {
    					result = node.getLiteralValue();
    					
    					if(result instanceof rdf.TypedValue) {
    					    result = result.getLexicalValue();
    					}
    					
    				} else if(sparql.NodeValue.nvNothing.asNode().equals(node)) {
    				    result = null;
    				} else {
    				    console.log('[ERROR] Unsupported node types: ', node);
              throw 'Unsupported node type';
    				}
			    }
			}

			return result;
		}

	});
	
	ns.AggregatorObject = Class.create(ns.Aggregator, {
	    classLabel: 'AggregatorObject',

		/**
		 * An aggregator factory must have already taken
		 * care of initializing the attrToAggr map.
		 * 
		 */
		initialize: function(patternObject, attrToAggr) {
			this.patternObject = patternObject;
			this.attrToAggr = attrToAggr;
		},
		
		
		process: function(binding, context) {
			
			_(this.attrToAggr).each(function(aggr, attr) {
				aggr.process(binding, context);
			});
			
		},
		
		getJson: function(retainRdfNodes) {
			var result = {};
			
			_(this.attrToAggr).each(function(aggr, attr) {
	    		var json = aggr.getJson(retainRdfNodes);
	    		result[attr] = json;
		    });

			return result;
		}
	});
	
	
	ns.AggregatorMap = Class.create(ns.Aggregator, {
	    classLabel: 'AggregatorMap',

		initialize: function(patternMap) {
			this.patternMap = patternMap;
			
			this.keyToAggr = new ns.MapList();
		},
		
		getPattern: function() {
			return this.patternMap
		},
		
		process: function(binding, context) {
			var pattern = this.patternMap;
			
			var keyExpr = pattern.getKeyExpr();
			var subPattern = pattern.getSubPattern();
			var isArray = pattern.isArray();

			var exprEvaluator = context.exprEvaluator;
			var aggregatorFactory = context.aggregatorFactory;

			var keyEx = exprEvaluator.eval(keyExpr, binding);
			
			if(!keyEx.isConstant()) {
				console.log('[ERROR] Could not evaluate key to a constant ' + JSON.stringify(keyEx) + ' with binding ' + binding);
				throw 'Bailing out';
			}
			
			var key = keyEx.getConstant().asNode();
			
			var keyStr = '' + key;
			
			var aggr = this.keyToAggr.get(keyStr);

			if(aggr == null) {
				aggr = aggregatorFactory.create(subPattern);
				
				this.keyToAggr.put(keyStr, aggr);
			}
			
			aggr.process(binding, context);
		},
		
		getJson: function(retainRdfNodes) {
			var result;

			var isArray = this.patternMap.isArray();
			if(isArray) {
				result = this.getJsonArray(retainRdfNodes);
			} else {
				result = this.getJsonMap(retainRdfNodes);
			}

			return result;
		},
		
		getJsonArray: function(retainRdfNodes) {
			var aggrs = this.keyToAggr.getItems();
			var result = aggrs.map(function(aggr) {
				var data = aggr.getJson(retainRdfNodes);
				return data;
			});
				
			return result;
		},
		
		getJsonMap: function(retainRdfNodes) {
			var result = {};
			
			var aggrs = this.keyToAggr.getItems();
			var keyToIndex = this.keyToAggr.getKeyToIndex();
			
			_(keyToIndex).each(function(index, aggr) {
          // FIXME: items not defined
          var aggr = items[index];
          var data = aggr.getJson(retainRdfNodes);
          // FIXME: key not defined
          result[key] = data;
			});
			
			return result;			
		}

	});
	
	
	ns.AggregatorRefCounter = 0;

	/**
	 * TODO: An aggregatorRef cannot turn itself into a proxy,
	 * instead, the parent object needs to be enhanced with proxy capabilities
	 * 
	 * I see two options:
	 * (a) We make use of the ns.Field class, and pass each aggregator the field from which it is referenced.
	 * This is somewhat ugly, because then the aggregator needs to know how to react when being
	 * placed into an array or an object
	 *  
	 * (b) We make a postprocessing step of the (almost) final json and check which properties
	 * and array elements point to proxy objects
	 * 
	 * This post processing is maybe the best solution, as it reduces complexity here
	 * and we separate the concerns. 
	 * 
	 */
	ns.AggregatorRef = Class.create(ns.Aggregator, {
	    classLabel: 'AggregatorRef',

		initialize: function(patternRef) {
			// th
			this.name = '' + (ns.AggregatorRefCounter++);
			
			this.patternRef = patternRef;
			
			this.json = null;
			//this.map = new ns.MapList();
			
			this.bindings = [];
		},
		
		/**
		 * The name is used so we can refer to a specific aggregator
		 * 
		 * 
		 */
		getName: function() {
			return this.name;
		},
		
		process: function(binding, context) {
			this.bindings.push(binding);

			//context.registryRef.addRef(this, binding)
		},
		
		getJson: function(retainRdfNodes) {
			return this.json;
		},
		
		// The sponate system takes care of resolving references
		setJson: function(json) {
			this.json = json;
		}
	});

	
	
//	ns.AggregatorFactory = Class.create({
//	   createAggregator: function() {
//	       throw 'Not overridden';
//	   } 
//	});
	
	
	/**
	 * TODO: This smells like a desig flaw:
	 * Aggregators should be independent of the pattern -
	 * aggregators should only have a reference to a childAggregatorFactory,
	 * whereas this factory may be based on a pattern
	 * 
	 * AggregatorFactory
	 * 
	 * Recursively instantiates aggregators based on patterns.
	 * 
	 */
	ns.AggregatorFactory = Class.create({
	    classLabel: 'AggregatorFactory',

		initialize: function() {
			//this.pattern = pattern;
			
			// Registry for custom aggregators 
			//this.nameToAggregator = {};			
		},
	
		create: function(pattern) {
		    var fnName = "visit" + pattern.getClassName();
		    var fn = this[fnName];
		    if(!fn) {
		        console.log('[ERROR] Function with name "' + fnName + '" not found.');
		        throw 'Bailing out';
		    }
			var result = fn.call(this, pattern);
			return result;
		},
		
		
		visitPatternObject: function(patternObject) {
			var attrToAggr = {};
			
			var self = this;
			var members = patternObject.getMembers();
			_(members).each(function(attrPattern, attr) {
				var aggr = self.create(attrPattern);
				
				attrToAggr[attr] = aggr;
			});

			//console.log('attrToAggr ', attrToAggr);
			var result = new ns.AggregatorObject(patternObject, attrToAggr);
			return result;
		},

		visitPatternArray: function(pattern) {
      // FIXME: AggregatorArray not defined
			return ns.AggregatorArray(pattern);
		},
		
		visitPatternMap: function(patternMap) {
			return new ns.AggregatorMap(patternMap);
		},
		
		visitPatternLiteral: function(patternLiteral) {
			return new ns.AggregatorLiteral(patternLiteral);
		},
		
		visitPatternRef: function(patternRef) {
			return new ns.AggregatorRef(patternRef);
		},
		
		visitPatternCustomAgg: function(patternCustomAgg) {
		    var customAgg = patternCustomAgg.getCustomAggFactory().createAggregator();
		    return new ns.AggregatorCustomAgg(patternCustomAgg, customAgg);
		}
	});
	
	
	
	/**
	 * A collection to keep track of references.
	 * 
	 * Intended to be called in AggregatorRef.process 
	 * 
	 */
	ns.RegistryRef = Class.create({
		initialize: function() {
			
		},
		
		addRef: function(aggergatorRef, binding) {
			
		}
	});

	

	ns.AggregatorFacade = Class.create({
		
		initialize: function(pattern) {			
			this.context = {
				exprEvaluator: new sparql.ExprEvaluatorImpl(),
				aggregatorFactory: new ns.AggregatorFactory(),
				refRegistry: new ns.RegistryRef()
			};
			
			this.rootAggregator = this.context.aggregatorFactory.create(pattern);
		},

		process: function(binding) {
			this.rootAggregator.process(binding, this.context);
		},
		
		
		getJson: function(retainRdfNodes) {
			var result = this.rootAggregator.getJson(retainRdfNodes);
			
			return result;
		}
	});
	
	
	ns.ParserPattern = Class.create({

		initialize: function() {
			this.attrs = {
				id: 'id',
				ref: 'ref'
			};
		},
		
		/**
		 * An array can indicate each of the following meanings:
		 * 
		 * - [ string ]
		 *   If the argument is a string, we have an array of literals,
		 *   whereas the string will be interpreted as an expression.
		 *   
		 * - [ object ]
		 * 
		 *   If the argument is an object, the following intepretation rules apply:
		 *   
		 *   - If there is an 'id' attribute, we interpret it as an array of objects, with the id as the grouping key,
		 *     and a subPattern corresponding to the object
		 *   [{ id: '?s' }]
		 *
		 *   - If there is a 'ref' attribute, we intepret the object as a specification of a reference
		 *   
		 *   
		 *   - If neither 'id' nor 'ref' is specified ...
		 *   TODO i think then the object should be interpreted as some kind of *explicit* specification, wich 'id' and 'ref' variants being syntactic sugar for them
		 * 
		 */
		parseArray: function(val) {

			if(val.length != 1) {
				console.log('[ERROR] Arrays must have exactly one element that is either a string or an object', val);
				throw 'Bailing out';
			}
			
			var config = val[0];
			
			var result;
			if(_(config).isString()) {
				
				result = this.parseArrayLiteral(config);
				
			} else if(_(config).isObject()) {
				
				result = this.parseArrayConfig(config);
				
			} else {
				throw 'Bailing out';
			}
			
			return result;
		},

		parseArrayConfig: function(config) {

			var idAttr = this.attrs.id;
			var refAttr = this.attrs.ref;

			var hasId = config[idAttr] != null;
			var hasRef = config[refAttr] != null;
			
			if(hasId && hasRef) {
				console.log('[ERROR] id and ref are mutually exclusive');
				throw 'Bailing out';
			}
			
			var result;
			if(hasId) {
				
				var subPattern = this.parseObject(config);
				//console.log(config, JSON.stringify(subPattern));
				
				// Expects a PatternLiteral
				var idPattern = subPattern.getPattern(idAttr);
				var idExpr = idPattern.getExpr();				
				result = new ns.PatternMap(idExpr, subPattern, true); 
				
			} else if(hasRef) {
				result = this.parseArrayRef(config);
			} else {
				console.log('[ERROR] Not implemented');
				throw 'Bailing out';
			}
			
			return result;
		},
		
		
		/**
		 * Here we only keep track that we encountered a reference.
		 * We cannot validate it here, as we lack information
		 * 
		 * 
		 */
		parseArrayRef: function(config) {

			var result = new ns.PatternRef(config);
			return result;
		},
		
		parseArrayLiteral: function() {

		},
		
		
		parseLiteral: function(val) {
			var expr = this.parseExprString(val);
			
			var result = new ns.PatternLiteral(expr);
			return result;
		},
		
		/**
		 * An object is an entity having a set of fields,
		 * whereas fields can be of different types
		 * 
		 */
		parseObject: function(val) {
			
			var attrToPattern = {};
	
			var self = this;
			_(val).each(function(v, attr) {
		    	var v = val[attr];
		    	var subPattern = self.parsePattern(v); 
		    	
		    	attrToPattern[attr] = subPattern;				
			});
			
			var result = new ns.PatternObject(attrToPattern);
			return result;
		}, 

//		parsePattern: function(fieldName, val) {
//			// if the value is an array, create an array field
//			// TODO An array field can be either an array of literals or of objects
//			// How to represent them?
//			// Maybe we could have Object and Literal Fields plus a flag whether these are arrays?
//			// So then we wouldn't have a dedicated arrayfield.
//			// if the value is an object, create an object reference field
//			
//			// friends: ArrayField(
//		},
		
		parsePattern: function(val) {
			
			var result;
			
			if(_(val).isString()) {
				result = this.parseLiteral(val);
			}
			else if(_(val).isArray()) {
				result = this.parseArray(val);
			}
            else if(_(val).isFunction()) {
                result = new ns.PatternCustomAgg(new ns.AccumulatorFactoryFn(val));
            }
            else if(val instanceof rdf.Node && val.isVariable()) {
                var expr = new sparql.ExprVar(val);             
                result = new ns.PatternLiteral(expr);               
            }
            else if(val instanceof sparql.Expr) {
                result = new ns.PatternLiteral(expr);               
            }
			else if(_(val).isObject()) {
			    
			    var fnCustomAggFactory = val['createAggregator'];
			    if(fnCustomAggFactory) {
			        result = new ns.PatternCustomAgg(val); 
			        //console.log('aggregator support not implemented');
			        //throw 'Bailing out';
			    }
			    else {
			        result = this.parseObject(val);
			    }
			}
			else {
			    console.log('[ERROR] Unknown item type: ', val);
				throw "Unkown item type";
			}

			
			return result;
		},
					
			
		parseExpr: function(obj) {
			var result;
			
			if(_.isString(obj)) {
				result = this.parseExprString(obj);
			}
			
			return result;
		},

		parseExprString: function(str) {
			var result;
			
			if(_(str).startsWith('?')) {
				var varName = str.substr(1);				
				var v = sparql.Node.v(varName);
				result = new sparql.ExprVar(v);

			} else {
				result = sparql.NodeValue.makeString(str);
				// TODO: This must be a node value
				//result = sparql.Node.plainLit(str);
			}
			
			// TODO Handle special strings, such as ?\tag 

			//console.log('Parsed', str, 'to', result);
			
			return result;
		}
		
	});
	

	
	ns.parseExpr = function(str) {
		
	}

})();

(function() {

	
	var util = Jassa.util;
	var rdf = Jassa.rdf;
	var sparql = Jassa.sparql;
	var service = Jassa.service;
	var facete = Jassa.facete;
	
	var ns = Jassa.sponate;
	
	
	ns.QueryConfig = Class.create({
		initialize: function(criteria, limit, offset, concept, _isLeftJoin, nodes) {
			this.criteria = criteria;
			this.limit = limit;
			this.offset = offset;
			
			// HACK The following two attributes belong together, factor them out into a new class
			this.concept = concept;
			this._isLeftJoin = _isLeftJoin;
			
			// Note: For each element in the nodes array, corresponding data will be made available.
			// Thus, if nodes is an empty array, no results will be fetched; set to null to ignore the setting
			this.nodes = nodes;
		},
		
		shallowClone: function() {
		    var r = new ns.QueryConfig(this.criteria, this.limit, this.offset, this.concept, this._isLeftJoin, this.nodes);
		    return r;
		},
		
		getCriteria: function() {
			return this.criteria;		
		},
		
		setCriteria: function(criteria) {
		    this.criteria = criteria;
		},
		
		getLimit: function() {
			return this.limit;
		},
		
		setLimit: function(limit) {
		    this.limit = limit;
		},
		
		getOffset: function() {
			return this.offset;
		},
		
		setOffset: function(offset) {
		    this.offset = offset;
		},
		
		getConcept: function() {
		    return this.concept;
		},
		
		setConcept: function(concept) {
		    this.concept = concept;
		},
		
		isLeftJoin: function() {
		    return this._isLeftJoin;
		},
		
		setLeftJoin: function(isLeftJoin) {
		    this._isLeftJoin = isLeftJoin;
		},
		
		getNodes: function() {
		    return this.nodes;
		},
		
		setNodes: function(nodes) {
		    this.nodes = nodes;
		}
	});
	
	/**
	 * The cursor is both a flow api and a result set / iterator.
	 * 
	 * (Not sure I like this design, i.e. making distinct concepts look like if they were same,
	 * but that's the way ppl do JavaScript, sigh)
	 * 
	 * Calling next, hasNext or forEach starts retrieving the data
	 * 
	 */
	ns.Cursor = Class.create({
		hasNext: function() {
			
		},
		
		next: function() {
			
		},
		

		forEach: function(fn) {
			while(this.hasNext()) {
				var json = this.next();
				
				fn(json);
			}
		}
	}); 
	
	
	ns.CursorFlow = Class.create({
		
		
		hasNext: function() {
			
		},
		
		skip: function(n) {
			
		},
		
		limit: function(n) {
			
		},
		
		sort: function(attr) {
			
		}
		
	});

	
	ns.QueryFlow = Class.create({
		initialize: function(store, criteria) {
			this.store = store;
			this.config = new ns.QueryConfig();
			
			this.config.setCriteria(criteria);
		},
		
		/**
		 * Join the lookup with the given concept
		 */
		concept: function(_concept, isLeftJoin) {
		    this.config.setConcept(_concept);
		    this.config.setLeftJoin(isLeftJoin);
		    
		    return this;
		},
		
		/**
		 * Specify a set of nodes for which to perform the lookup
		 * If concept is specified, nodes will be applied to the concept
		 * 
		 * //Use of .concept(...) and .nodes(..) is mutually exclusive
		 * 
		 */
		nodes: function(_nodes) {
		    this.config.setNodes(_nodes);
		    
		    return this;
		},
		
		skip: function(offset) {
			this.config.setOffset(offset);
			
			return this;
		},
		
		limit: function(limit) {
			this.config.setLimit(limit);
			
			return this;
		},		
		
		asList: function(retainRdfNodes) {
			var promise = this.execute(retainRdfNodes);

			// TODO This should be part of the store facade
			var result = promise.pipe(function(it) {
				var arr = [];
				while(it.hasNext()) {
					arr.push(it.next());
				}
				
				return arr;
			});
			
			return result;
		},
		
		hasNext: function() {
			
		},
		
		next: function() {
			
		},
		
		
		// TODO This is a hack right now - not sure how to design the execution yet
		execute: function(retainRdfNodes) {
			var result = this.store.execute(this.config, retainRdfNodes);
			return result;
		},
		
        count: function() {
            var result = this.store.executeCount(this.config);
            return result;          
        }		
	});
	
	
	
	
	
	/**
	 * 
	 * TODO We need to attach a post processor, e.g. for ?/ label
	 * 
	 * TODO Pagination will break with criteria queries as the criteria-to-sparql translation is not working yet
	 *   
	 * 
	 */
	ns.Store = Class.create({
		/**
		 * A sparql service (assumed to return talis json rdf)
		 * 
		 */
		initialize: function(sparqlService, context, mappingName, cacheFactory) {
			this.sparqlService = sparqlService;
			this.context = context;
			this.mappingName = mappingName;
			this.cacheFactory = cacheFactory;
		},
		
		find: function(crit) {
			var criteriaParser = this.context.getCriteriaParser(); 


			var criteria = criteriaParser.parse(crit);
						
			var result = new ns.QueryFlow(this, criteria);
			return result;
		},
		
		getByIds: function(nodes) {
		    
		},
		
		getByConcept: function(concept, doJoin) {
		    
		},
		
		

		createQuerySpec: function(config) {
			// TODO Compile the criteria to
			// a) SPARQL filters
			// b) post processors
			
			var context = this.context;
			var criteria = config.getCriteria();
			var limit = config.getLimit();
			var offset = config.getOffset();
			var concept = config.getConcept();
			var isLeftJoin = config.isLeftJoin();
			var nodes = config.getNodes();
			
			//console.log('context', JSON.stringify(this.context), this.context.getNameToMapping());
			
			var mapping = this.context.getMapping(this.mappingName);
			

			// Resolve references if this has not been done yet
			// TODO Optimize this by caching prior resolution
			ns.ContextUtils.resolveMappingRefs(this.context, mapping);
			console.log('Refs: ', mapping.getPatternRefs());

			
			// Compile criterias
			var criteriaCompiler = new ns.CriteriaCompilerSparql();
			
			var elementCriteria = criteriaCompiler.compile(context, mapping, criteria);
			console.log('Compiled criteria: ' + elementCriteria, elementCriteria);
			
			

			
			
			//console.log('mapping:', mapping);
			
			// Retrieve the mapping's table and the associated element
			
			var elementFactory = mapping.getElementFactory(); //this.context.getElementFactory(mapping.getTableName());
			var outerElement = elementFactory.createElement();
			
			
			if(elementCriteria) {
			    //element = new sparql.ElementGrou()
			}
			
			var pattern = mapping.getPattern();
			//console.log('Pattern here ' + JSON.stringify(pattern));

			
			
			
			var vars = pattern.getVarsMentioned();
			//console.log('' + vars);
		
			
			var idExpr;
			if(pattern instanceof ns.PatternMap) {
				idExpr = pattern.getKeyExpr();
			}

			
			var sortConditions = [];
			if(idExpr != null) {
				//console.log('Expr' + JSON.stringify(idExpr));
				
				var sc = new sparql.SortCondition(idExpr, 1);

				sortConditions.push(sc);
			}

			
            var idVar;
            if(!(idExpr instanceof sparql.ExprVar)) {
                console.log("[ERROR] Currently the idExpr must be a variable. This restriction may be lifted in the future");
                throw "Bailing out";
            }
            idVar = idExpr.asVar();

						
			var requireSubQuery = limit != null || offset != null || (concept != null && !concept.isSubjectConcept()) || elementCriteria.length > 0;

            var innerElement = outerElement;

//            debugger;
            if(requireSubQuery) {


	            if(concept && (isLeftJoin || !concept.isSubjectConcept())) {
	                var conceptElement = concept.getElement();
                    var conceptVar = concept.getVar();
	                 
	                var elementA = conceptElement;
	                var elementB = innerElement;

	                //console.log('elementA: ' + elementA);
	                //console.log('elementB: ' + elementB);

	                
	                var varsA = elementA.getVarsMentioned();
	                var varsB = elementB.getVarsMentioned();
	                 
	                var joinVarsA = [conceptVar];
	                var joinVarsB = [idVar];
	                 
	                var varMap = sparql.ElementUtils.createJoinVarMap(varsB, varsA, joinVarsB, joinVarsA); //, varNameGenerator);
	                var elementA = sparql.ElementUtils.createRenamedElement(elementA, varMap);
	                 
                    //console.log('elementA renamed: ' + elementA);
	                 
	                 //var conceptElement = concept.getElement();
	                concept = new facete.Concept(elementA, idVar);
	                 
                    var q = facete.ConceptUtils.createQueryList(concept);
	                elementA = new sparql.ElementSubQuery(q);
	                 
	               
	                if(isLeftJoin) {
	                   elementB = new sparql.ElementOptional(elementB);
	                }
	               
	                innerElement = new sparql.ElementGroup([elementA, elementB]);
	               
	               /*
	                 var efa = new sparql.ElementFactoryConst(conceptElement);
	                 var efb = new sparql.ElementFactoryConst(innerElement);
	                 

	                 var joinType = isLeftJoin ? sparql.JoinType.LEFT_JOIN : sparql.JoinType.INNER_JOIN;
	                 
	                 var efj = new sparql.ElementFactoryJoin(efa, efb, [concept.getVar()], [idVar], joinType);
	                 innerElement = efj.createElement();
	                 */
	             }

			    
				var subQuery = new sparql.Query();
				
				var subQueryElements = subQuery.getElements();
				subQueryElements.push(innerElement);
				
				if(elementCriteria.length > 0) {
				    subQueryElements.push(new sparql.ElementFilter(elementCriteria));
				}
			
				
				var subElement = new sparql.ElementSubQuery(subQuery);
				var oe = outerElement;
				
				if(isLeftJoin) {
				    //subElement = new sparql.ElementOptional(subElement);
				    oe = new sparql.ElementOptional(outerElement);
				}
				
				subQuery.setLimit(limit);
				subQuery.setOffset(offset);
				subQuery.setDistinct(true);
				subQuery.getProject().add(idVar);
				outerElement = new sparql.ElementGroup([
				                                   subElement,
				                                   oe]);

				// TODO Do we need a sort condition on the inner query?
				// Note that the inner query already does a distinct
				//var orderBys = subQuery.getOrderBy();
				//orderBys.push.apply(orderBys, sortConditions);

				
				innerElement = subElement;
			}

            
            var result = {
                requireSubQuery: requireSubQuery,
                innerElement: innerElement,
                outerElement: outerElement,
                idVar: idVar,
                idExpr: idExpr,
                vars: vars,
                sortConditions: sortConditions,
                pattern: pattern,
                criteria: criteria,
                nodes: nodes
            };
            
            //console.log('innerElement: ' + innerElement);
            //console.log('outerElement: ' + outerElement);
            

            
            return result;
		},

		
		execute: function(config, retainRdfNodes) {
		    var spec = this.createQuerySpec(config);
		    
		    var result = this.executeData(spec, retainRdfNodes);
		    
		    return result;
		},
		
		executeCount: function(config) {
            var spec = this.createQuerySpec(config);

            if(spec.nodes) {
                console.log('Counting if nodes are provided is not implemented yet');
                throw 'Counting if nodes are provided is not implemented yet';
            }
                

            var element = spec.innerElement;
            var idVar = spec.idVar;
            
            var concept = new facete.Concept(element, idVar);
            var outputVar = rdf.NodeFactory.createVar('_c_');
            var query = facete.ConceptUtils.createQueryCount(concept, outputVar);
            var qe = this.sparqlService.createQueryExecution(query);
            var result = service.ServiceUtils.fetchInt(qe, outputVar);
            
            return result;
		},
		
		executeData: function(spec, retainRdfNodes) {
		    var outerElement = spec.outerElement;
        // FIXME: spec.idExpr not defined
		    var idExpr = spec.idExpr;
		    var idVar = spec.idVar;
		    var sortConditions = spec.sortConditions;
		    var vars = spec.vars;
		    var pattern = spec.pattern;
		    var criteria = spec.criteria;

			//console.log('' + pattern, idExpr);
			//console.log('idExpr' + idExpr);
			
			
			// Query generation
			var query = new sparql.Query();
			query.getElements().push(outerElement);
			_(vars).each(function(v) { query.getProject().add(v); });
			if(idExpr != null) {
				//console.log('Expr' + JSON.stringify(idExpr));
				
				var sc = new sparql.SortCondition(idExpr, 1);

				var orderBys = query.getOrderBy();
				orderBys.push.apply(orderBys, sortConditions);
				//query.getOrderBy().push(sc);
			}
			//query.setLimit(10);
			
			var rsPromise;
			if(spec.nodes) {
			    rsPromise = service.ServiceUtils.execSelectForNodes(this.sparqlService, query, idVar, spec.nodes);
			}
			else {
	            var qe = this.sparqlService.createQueryExecution(query);
	            rsPromise = qe.execSelect();			    
			}

			var result = rsPromise.pipe(function(rs) {
			    var r = ns.SponateUtils.processResultSet(rs, pattern, retainRdfNodes, false);
			    return r;
			});
			
			return result;
			//console.log('' + query);
			
			
			
			// TODO We are no longer retrieving triples, but objects
			// Thus limit and offset applies to entities -> sub query! 			
		}
	});
	
	
	ns.QueryPlan = Class.create({
		initialize: function() {
			
		}
	});
	
})();

/*
Advanced
Novel
Grandiose
Enhanced
Library /
Api
for
Magic Sparql (Marql)
or simply: Angular + Magic Sparql = Angular Marql
*/

/*
 * Thinking about how to create the join stuff...
 * 
 * We need to distinguish two levels:
 * - Projection
 * - Selection
 *
 * Generic query structure:
 * 
 * Select projectionVars {
 *   { Select Distinct ?s {
 *     SelectionElement
 *   } Limit foo Offset bar }
 *   Optional {
 *      Projection(?s)
 *   }
 * }
 * 
 * We can perform optimizations of the selection and projection element are isomorph, but
 * we can add this later.
 *   
 * 
 * Projection will always follow the join rules that have been configured in the references
 * 
 * For the selection however, whenever a criteria spans accross ref boundaries, we
 * directly join in the referenced map's element as to perform the filter on the database
 * 
 * This means, we need some kind of collection where we can just add in joins as we encounter them
 * In fact, this is the purpose of the CriteraRewriterSparql:
 * The result of compiling a criteria is a concept - which internally has all the joins set
 * 
 * And how to do the projection when there is eager fetching?
 * Again we collect all joins, however, this time we combine them with OPTIONALS
 * 
 * So what does the 'QueryPlan' or whatever object look like?
 * 
 * 
 * Note: Each proxyObject should also have some special attribute like
 * @proxyState or @proxyControl
 * Which then reveals which properties are the ones being proxied
 * 
 * then we could do something like object['@proxyControl'].myProperty.fetch(10, 20)
 * object['@proxyControl'].myProperty.count() // This needs to trigger a batch count though
 * 
 * 
 * So the goal is to be able to retrieve only parts of an relation
 * 
 * Actually, isn't this just like having store objects again?
 * 
 * foo = store.castles.find().asList();
 * var bar =foo.owners.limit(10).find().asList();
 * bar.friends.facebook.limit(10).find(name: {$regex:...}).asList();
 * 
 * find().asStores(); ->
 * 
 * find()
 * 
 * Yup, that's how it is.
 * 
 * So if we want to do it like this, we must not fetch all values of the join column in advance,
 * but rather track the groupKey of the parent PatternMap
 * 
 * 
 * So what does the query plan look like?
 * Well, I don't think we need something like that -
 * we just need to satisfy all references.
 * 
 * open = [initial mapping]
 * closed =[]
 * 
 * 
 * Compiling the criteria:
 * C
 * 
 * If we hit a ref,
 * 
 * 
 * gen = new GenSym('a');
 * while(!open is empty) {
 *    sourceMapping = open.pop();
 *    if(closed.contains(sourceMapping)) {
 *        circular reference; create a proxy instead (we could allow a certain number of round trips though)
 *    }
 *    close.push(sourceMapping);
 *    
 *    refs = sourceMapping.getRefs();
 *    var sourceAlias = gen.next(); // create a new alias for the mapping
 *    			// or maybe the alias is less for the mapping and more for its table
 *    
 *    for(ref in ref) {
 *        if ref.joinType = immediate { // TODO align terminology with hibernate
 *            targetMapping = context.getMapping(ref.getTargetMappingName)
 *            
 *            var targetAlias
 *            
 *            
 *            
 *        }
 *    
 *    }
 *    
 *    
 * 
 * }
 * 
 * 
 * owners: [{ aggColumn: '?s', joinColumn: '?x', }]
 * 
 * -> Aggregator {
 *     refSpec: { targetMapping: 'owners', aggColumn: ?s, sourcColumn: ?x, targetColumn: ?z} 
 *     
 *     bindings: [{?s='<>'}, {   }] // The bindings that were passed to the aggregator
 * }
 * 
 * 
 * Required operations:
 * - Find all aggregators with the same refSpec
 * - 
 * 
 * castles:
 * [{id: ?s, name:[{ref: labels, attr:name}]]
 * ?s a Castle
 * 
 * 
 * labels:
 * [{id: ?s, name: ?l}]
 * ?s label ?l
 * 
 * 
 * 
 * aliasToMapping: { //Note: This points to mapping objects
 *     a: { mappingName: castles , aggregator , aggregatorRefs}
 * }
 * 
 * [?s a Castle] With[] As a
 * [?x label ?l] With [x->s] As b   | b->{s->x}    x->{b, s}
 * 
 * joinGraph: {
 *   root: a,
 *   joins: {
 *     a: {target: b, sourceColumns, targetColumns, optional: true}
 *   }
 * }
 * 
 * For each row, k
 * 
 * }
 * 
 * 
 */

//  var processResult = function(it) {
//  var instancer = new ns.AggregatorFacade(pattern);
//  //var instancer = new sponate.PatternVisitorData(pattern);
//  //var instancer = new sponate.FactoryAggregator();
//  // TODO
//  
//  while(it.hasNext()) {
//      var binding = it.nextBinding();
//      
//      instancer.process(binding);
//  }
//  
//  var json = instancer.getJson(retainRdfNodes);
//  
//  
//  
//  //console.log('Final json: ' + JSON.stringify(json));
//  
//  var result;
//  if(_(json).isArray()) {
//
//      var filtered;
//      if(retainRdfNodes) {
//          filtered = json;
//      }
//      else {
//          var filtered = _(json).filter(function(item) {                                              
//              var isMatch = criteria.match(item);
//              return isMatch;
//          })
//          
//          var all = json.length;
//          var fil = filtered.length;
//          var delta = all - fil;
//
//          console.log('[DEBUG] ' + delta + ' items filtered on the client ('+ fil + '/' + all + ' remaining) using criteria ' + JSON.stringify(criteria));
//      }
//
//      result = new util.IteratorArray(filtered);
//      
//  } else {
//      console.log('[ERROR] Implement me');
//      throw 'Implement me';
//  }
//  
//  return result;
//};
//
//
(function() {
	
	/*
	 * This file enhances sponate with relational json document mappings
	 */
	
	var sparql = Jassa.sparql;
	var ns = Jassa.sponate;
	
	
	/**
	 * A simple table definition
	 * 
	 */
	ns.Table = Class.create({
		/**
		 * TODO: Not sure what the type of schema should be... - is it a name or an object? Probably name.
		 * 
		 */
		initialize: function(name, columnNames, schema) {
			this.name = name;
			this.columnNames = columnNames;
			this.schema = schema;
		},
		
		getName: function() {
			return this.name;
		},
				
		getColumnNames: function() {
			return this.columnNames;
		},
		
		getSchema: function() {
			return this.schema;
		},
		
		toString: function() {
			return this.name + '(' + this.columnNames.join(', ') + ')';
		}
	});
	

	/**
	 * A fake element parser. Replace it with something better at some point.
	 * 
	 */
	ns.SparqlParserFake = Class.create({
		initialize: function() {
			this.prefixes = {};
		},

		parseElement: function(str) {
			var vars = sparql.extractSparqlVars(str);
			
			var result = ns.ElementString.create(str, vars);
		}
	});


	/**
	 * This class represents a relational schema.
	 * 
	 * Right now its just table tables and their columns.
	 * 
	 */
	ns.Schema = Class.create({
		initialize: function() {
			this.nameToTable = {};
		},
		
		//createTable: function(name, )
		addTable: function(table) {
			var tableName = table.getName();

			this.nameToTable[tableName] = table;
		},
		
		getTable: function(tableName) {
			var result = this.nameToTable[tableName];
			return result;
		}
	});

	// Use sparql.PrefixMapping instead
	/*
	ns.PrefixMap = Class.create({
		initialize: function(prefixes) {
			this.prefixes = prefixes ? prefixes : {};
		},
		
		addPrefix: function(prefix, urlBase) {
			this.prefixes[prefix] = urlBase;
		},
		
		getPrefix: function(prefix) {
			var result = this.prefixes[prefix];
			return result;
		},
		
		addJson: function(json) {
			_.extend(this.prefixes, json);
		},
		
		getJson: function() {
			return this.prefixes;
		}
	});
	*/


	/*
	ns.SparqlTable = Class.create({
		initialize: function(context, table, element) {
			this.context = context;
			this.table = table;
			this.element = element;
		},
		
		getContext: function() {
			return this.context;
		},
		
		getTable: function() {
			return this.table;
		},
		
		getElement: function() {
			return element;
		},
		
		toString: function() {
			return '' + this.table + ' with ' + this.element;
		}
	});
	*/
	
	/**
	 * 
     * A Sponate context is the central object for storing all relevant
     * information about the mappings
     *  
     * - prefixes
     * - the relational schema
     * - mappings from table to SPARQL elements
     *
     * TODO Better rename to SponateContext, as to reduce ambiguity with other context objects
	 */
	ns.Context = Class.create({
		
		initialize: function(schema) {
			this.schema = schema ? schema : new ns.Schema();
			this.prefixMapping = new sparql.PrefixMappingImpl();
			
			// TODO We should not map to element directly, but to ElementProvider
			this.tableNameToElementFactory = {};
			
			// Note: the names of mappings and tables are in different namespaces
			// In fact, in most cases tables are implicitely created - with the name of the mapping
			this.nameToMapping = {};
			
			this.patternParser = new ns.ParserPattern();

			this.criteriaParser = new ns.CriteriaParser();
		},
		
		getSchema: function() {
			return this.schema;
		},
		
		getPrefixMapping: function() {
			return this.prefixMapping;
		},
		
		getPatternParser: function() {
			return this.patternParser;
		},
		
		getTableNameToElementFactory: function() {
			return this.tableNameToElementFactory;
		},
		
		getNameToMapping: function() {
			return this.nameToMapping;
		},
		
		mapTableNameToElementFactory: function(tableName, elementFactory) {
			this.tableNameToElementFactory[tableName] = elementFactory;
		},
		
		addMapping: function(name, mapping) {
			//var name = mapping.getName();
			this.nameToMapping[name] = mapping;
		},
		
		getMapping: function(mappingName) {
			var result = this.nameToMapping[mappingName];
			return result;
		},
		
		getElementFactory: function(tableName) {
			var result = this.tableNameToElementFactory[tableName];
			return result;
		},
		
		getCriteriaParser: function() {
			return this.criteriaParser;
		}
	});
	
	ns.ContextUtils = {

		/**
		 * Creates and adds a sparql table to a context
		 * 
		 */
		createTable: function(context, name, elementStr) {
			var prefixes = context.getPrefixMapping().getNsPrefixMap();//getJson();

			var vars = sparql.extractSparqlVars(elementStr);

			var str = sparql.expandPrefixes(prefixes, elementStr);
			
			var element = sparql.ElementString.create(str, vars);
			
			// TODO Maybe prefix them with '?' ???
			//var varNames = sparql.extractVarNames(vars);
			var colNames = vars.map(function(v) { return v.toString(); });
			
			var table = new ns.Table(name, colNames);
			
			context.getSchema().addTable(table);
			
			context.mapTableNameToElementFactory(name, element);
			
		},
		
		
		/**
		 * Resolve all reference patterns of a mapping:
		 * 
		 * 
		 * 
		 */
//		resolveMappingRefs: function(context, mappingName) {
//			var sourceMapping = context.getMapping(mappingName);
//			
//			if(sourceMapping == null) {
//				console.log('[ERROR] No mapping: ' + mappingName);
//				throw 'Bailing out';
//			}

		resolveMappingRefs: function(context, sourceMapping) {
			var patternRefs = sourceMapping.getPatternRefs();

			_(patternRefs).each(function(patternRef) {
				
				var stub = patternRef.getStub();
				var refSpec = ns.ContextUtils.createRefSpec(sourceMapping, stub, context);
				patternRef.setRefSpec(refSpec);
				
			});
		},
	
		/**
		 * Resolves references in PatternRef objects
		 * against the context
		 * 
		 */
		createRefSpec: function(sourceMapping, stub, context) {
			var schema = context.getSchema();
			
			var sourceMappingName = sourceMapping.getName();
			var targetMappingName = stub.ref;
	
			var targetMapping = context.getMapping(targetMappingName);
			if(targetMapping == null) {
				console.log('[ERROR] Target mapping ' + targetMapping + ' not defined');
				throw 'Bailing out';
			}
			
			var sourceTableName = sourceMapping.getTableName();
			var targetTableName = targetMapping.getTableName();
			
			var sourceTable = schema.getTable(sourceTableName);
			var targetTable = schema.getTable(targetTableName);
			
			// Cardinality 1 means no array
			var isArray = stub.card == 1 ? false : true;
	
			// TODO attr path
	
			var sourceColumns;
			var targetColumns;

      // FIXME: joinColumn not defined
			if(stub.joinColumn) {
				sourceColumns = [stub.joinColumn];
			}

      // FIXME: refJoinColumn not defined
			if(stub.refJoinColumn) {
				targetColumns = [stub.refJoinColumn];
			}
			
	//		ns.validateColumnRefs(sourceTable, sourceColumns);
	//		ns.validateColumnRefs(targetTable, targetColumns);
			
			var joinTable = stub.joinTable;
			if(joinTable != null) {
				console.log('[ERROR] Implement me');
				throw 'Bailing out';
			}
			
			
			var sourceTableRef = new ns.TableRef(sourceTableName, sourceColumns);
			var targetTableRef = new ns.TableRef(targetTableName, targetColumns);
			
			var sourceMapRef = new ns.MapRef(sourceMappingName, sourceTableRef, null);
			var targetMapRef = new ns.MapRef(targetMappingName, targetTableRef, null);
			
			var result = new ns.RefSpec(sourceMapRef, targetMapRef, isArray, null);
	
			return result;
		}

	}	
	
})();
(function() {

	// TODO Differntiate between developer utils and user utils
	// In fact, the latter should go to the facade file
	
	var sparql = Jassa.sparql; 
	var util = Jassa.util;

	var ns = Jassa.sponate;

	
	ns.MapParser = Class.create({
	    initialize: function(prefixMapping, patternParser) {
	        this.prefixMapping = prefixMapping;
	        this.patternParser = patternParser || new ns.ParserPattern();
	    },
	    
	    parseMap: function(spec) {
	        var result = ns.SponateUtils.parseMap(spec, this.prefixMapping, this.patternParser);
	        return result;
	    }
	});
	
	ns.SponateUtils = {

	    // TODO: We need to deal with references
	    processResultSet: function(rs, pattern, retainRdfNodes, doClientFiltering) {
            var accumulator = new ns.AggregatorFacade(pattern);
            
            while(rs.hasNext()) {
                var binding = rs.nextBinding();
                
                accumulator.process(binding);
            }
            
            var json = accumulator.getJson(retainRdfNodes);
            
            //console.log('Final json: ' + JSON.stringify(json));
            
            var result;
            if(_(json).isArray()) {

                var filtered = json;

                if(doClientFiltering && !retainRdfNodes) {
                    var filtered = _(json).filter(function(item) {                                              
                        var isMatch = criteria.match(item);
                        return isMatch;
                    });
                    
                    var all = json.length;
                    var fil = filtered.length;
                    var delta = all - fil;

                    console.log('[DEBUG] ' + delta + ' items filtered on the client ('+ fil + '/' + all + ' remaining) using criteria ' + JSON.stringify(criteria));
                }

                result = new util.IteratorArray(filtered);
                
            } else {
                console.log('[ERROR] Implement me');
                throw 'Implement me';
            }
            
            return result;
        },
	        
	    /**
	     * Parse a sponate mapping spec JSON object and return a sponate.Mapping object 
	     * 
	     * TODO Add fallback to default patternParser if none provided
	     */
	    parseMap: function(spec, prefixMapping, patternParser) {
            var name = spec.name;

            var jsonTemplate = spec.template;
            var from = spec.from;

            var context = this.context;
            
            // Parse the 'from' attribute into an ElementFactory
            // TODO Move to util class
            var elementFactory;
            if(_(from).isString()) {
                
                var elementStr = from;
                
                if(prefixMapping != null) {
                    var prefixes = prefixMapping.getNsPrefixMap();
                    //var vars = sparql.extractSparqlVars(elementStr);
                    var str = sparql.expandPrefixes(prefixes, elementStr);
                }

                var element = sparql.ElementString.create(str);//, vars);
                
                elementFactory = new sparql.ElementFactoryConst(element);
            }
            else if(from instanceof sparql.Element) {
                elementFactory = new sparql.ElementFactoryConst(from);
            }
            else if(from instanceof sparql.ElementFactory) {
                elementFactory = from;
            }
            else {
                console.log('[ERROR] Unknown argument type for "from" attribute', from);
                throw 'Bailing out';
            }
            
            //this.context.mapTableNameToElementFactory(name, elementFactory);
            
            // TODO The support joining the from element
            
            var pattern = patternParser.parsePattern(jsonTemplate);           

            var patternRefs = ns.PatternUtils.getRefs(pattern);

            //console.log('Parsed pattern', JSON.stringify(pattern));

            // The table name is the same as that of the mapping
            //ns.ContextUtils.createTable(this.context, name, from, patternRefs);
    

            var result = new ns.Mapping(name, pattern, elementFactory, patternRefs);

            return result;
	    },
	    
        defaultPrefLangs:  ['en', ''],

        prefLabelPropertyUris: [
            'http://www.w3.org/2000/01/rdf-schema#label'
	    ],

        createDefaultLabelMap: function(prefLangs, prefLabelPropertyUris, s, p, o) {

            prefLangs = prefLangs || ns.SponateUtils.defaultPrefLangs;
            prefLabelPropertyUris = prefLabelPropertyUris || ns.SponateUtils.prefLabelPropertyUris;
            s = s || 's';
            p = p || 'p';
            o = o || 'o';
            
            var mapParser = new ns.MapParser();
            
            var labelUtilFactory = new ns.LabelUtilFactory(prefLabelPropertyUris, prefLangs);
                
            // A label util can be created based on var names and holds an element and an aggregator factory.
            var labelUtil = labelUtilFactory.createLabelUtil(o, s, p);

            var result = mapParser.parseMap({
                name: 'labels',
                template: [{
                    id: '?' + s,
                    displayLabel: labelUtil.getAggFactory(),
                    hiddenLabels: [{id: '?' + o}]
                }],
                from: labelUtil.getElement()
            });
            
            return result;
        }    
	    
	};
	
	/**
	 * @Deprecated - Do not use - will be removed asap.
	 * Superseded by service.SparqlServiceHttp
	 * 
	 */
//	ns.ServiceSponateSparqlHttp = Class.create({
//		initialize: function(rawService) {
//			this.rawService = rawService;
//		},
//		
//		execSelect: function(query, options) {
//			var promise = this.rawService.execSelect(query, options);
//			
//			var result = promise.pipe(function(json) {
//				var bindings = json.results.bindings;
//
//				var tmp = bindings.map(function(b) {
//					//console.log('Talis Json' + JSON.stringify(b));
//					var bindingObj = sparql.Binding.fromTalisJson(b);
//					//console.log('Binding obj: ' + bindingObj);
//					return bindingObj;					
//				});
//				
//				var it = new ns.IteratorArray(tmp);
//				
//				//console.log()
//				
//				return it;
//			});
//			
//			return result;
//		}
//	});

	
	/**
	 * A factory for backend services.
	 * Only SPARQL supported yet.
	 * 
	 */
//	ns.ServiceUtils = {
//	
//		createSparqlHttp: function(serviceUrl, defaultGraphUris, httpArgs) {
//		
//			var rawService = new sparql.SparqlServiceHttp(serviceUrl, defaultGraphUris, httpArgs);
//			var result = new ns.ServiceSponateSparqlHttp(rawService);
//			
//			return result;
//		}	
//	};
//	

	/*
	ns.AliasedElement = Class.create({
		initialize: function(element, alias) {
			this.element = element;
			this.alias = alias;
		},
		
		getElement: function() {
			return this.element;
		},
		
		getAlias: function() {
			return this.alias;
		},
		
		toString: function() {
			return '' + this.element + ' As ' + this.alias;
		}
	});
	*/
	


//	ns.fnNodeEquals = function(a, b) { return a.equals(b); };

	/*
	 * We need to map a generated var back to the alias and original var
	 * newVarToAliasVar:
	 * {?foo -> {alias: 'bar', var: 'baz'} }
	 * 
	 * We need to map and alias and a var to the generater var
	 * aliasToVarMap
	 * { bar: { baz -> ?foo } }
	 *
	 * 
	 * 
	 * 
	 */
//	ns.VarAliasMap = Class.create({
//		initialize: function() {
//			// newVarToOrig
//			this.aliasToVarMap = new ns.HashMap(ns.fnNodeEquals)
//			this.newVarToAliasVar = new ns.HashMap(ns.fnNodeEquals);
//		},
//		
//		/*
//		addVarMap: function(alias, varMap) {
//			
//		},
//		
//		put: function(origVar, alias, newVar) {
//			this.newVarToAliasVar.put(newVar, {alias: alias, v: origVar});
//			
//			var varMap = this.aliasToBinding[alias];
//			if(varMap == null) {
//				varMap = new ns.BidiHashMap();
//				this.aliasToVarMap[alias] = varMap;
//			}
//			
//			varMap.put(newVar, origVar);
//		},
//		*/
//		
//		getOrigAliasVar: function(newVar) {
//			var entry = this.newVarToAliasVar.get(newVar);
//			
//			var result = entry == null ? null : entry;
//		},
//		
//		getVarMap: function(alias) {
//		}
//	});
//	
//	
//	ns.VarAliasMap.create = function(aliasToVarMap) {
//		var newVarToAliasVar = new ns.HashMap()
//		
//	};
//	
	
	ns.JoinElement = Class.create({
		initialize: function(element, varMap) {
			this.element = element;
		}
		
	});


	ns.JoinUtils = {
		/**
		 * Create a join between two elements 
		 */
		join: function(aliasEleA, aliasEleB, joinVarsB) {
			//var aliasA = aliasEleA. 
			
			var varsA = eleA.getVarsMentioned();
			var varsB = eleB.getVarsMentioned();
			
			
		},
			
		
		
		/**
		 * This method prepares all the joins and mappings to be used for the projects
		 * 
		 * 
		 * 
		 * transient joins will be removed unless they join with something that is
		 * not transient
		 * 
		 */
		createMappingJoin: function(context, rootMapping) {
			var generator = new sparql.GenSym('a');
			var rootAlias = generator.next();

			// Map<String, MappingInfo>
			var aliasToState = {};
			
			// ListMultimap<String, JoinInfo>
			var aliasToJoins = {};
		
			
			aliasToState[rootAlias] = {
				mapping: rootMapping,
				aggs: [] // TODO The mapping's aggregators
			};
			
			var open = [a];
			// FIXME: open won't ever be empty here
			while(open.isEmpty()) {
				var sourceAlias = open.shift();
				
				var sourceState = aliasToState[sourceAlias];
				var sourceMapping = sourceState.mapping;
				
				ns.ContextUtils.resolveMappingRefs(this.context, sourceMapping);
				var refs = this.mapping.getPatternRefs();

				// For each reference, if it is an immediate join, add it to the join graph
				// TODO And what if it is a lazy join??? We want to be able to batch those.
				_(refs).each(function(ref) {
					var targetMapRef = ref.getTargetMapRef();
					
					var targetAlias = generator.next();

					aliasToState[targetAlias] = {
            // FIXME: targetMapping not defined
						mapping: targetMapping
					};
				
					var joins = aliasToJoins[sourceAlias];
					if(joins == null) {
						joins = [];
						aliasToJoins[sourceAlias] = joins;
					}
					
					// TODO What was the idea behind isTransient?
					// I think it was like this: If we want to fetch distinct resources based on a left join's lhs, and there is no constrain on the rhs, we can skip the join
					var join = {
						targetAlias: targetAlias,						
						isTransient: true
					};
					
					joins.push(join);
				});
				
				
				var result = {
					aliasToState: aliasToState, 
					aliasToJoins: aliasToJoins
				};
				
				return result;
			}
		}
			
	};

	
	ns.GraphItem = Class.create({
		initialize: function(graph, id) {
			this.graph = graph;
			this.id = id;
		},
		
		getGraph: function() {
			return this.graph;
		},
		
		getId: function() {
			return this.id;
		}
	});


	ns.Node = Class.create(ns.GraphItem, {
		initialize: function($super, graph, id) {
			$super(graph, id);
		},
		
		getOutgoingEdges: function() {
      // FIXME: getEdges not defined
			var result = this.graph.getEdges(this.id);
			return result;
		}
	});

	
	ns.Edge = Class.create({
		
		initialize: function(graph, id, nodeIdFrom, nodeIdTo) {
			this.graph = graph;
			this.id = id;
			this.nodeIdFrom = nodeIdFrom;
			this.nodeIdTo = nodeIdTo;
		},
		
		getNodeFrom: function() {
			var result = this.graph.getNode(this.nodeIdFrom);
			return result;
		},
		
		getNodeTo: function() {
			var result = this.graph.getNode(this.nodeIdTo);
			return result;			
		}

	});
	

	/**
	 * Not used
	 */
	ns.Graph = Class.create({
		initialize: function(fnCreateNode, fnCreateEdge) {
			this.fnCreateNode = fnCreateNode;
			this.fnCretaeEdge = fnCreateEdge;
			
			this.idToNode = {};
			
			// {v1: {e1: data}}
			// outgoing edges
			this.nodeIdToEdgeIdToEdge = {};
			this.idToEdge = {};

			this.nextNodeId = 1;
			this.nextEdgeId = 1;
		},
		
		createNode: function(/* arguments */) {
			var nodeId = '' + (++this.nextNodeId);
			
			var tmp = Array.prototype.slice.call(arguments, 0);
			var xargs = [this, nodeId].concat(tmp);
			
			var result = this.fnCreateNode.apply(this, xargs);
			this.idToNode[nodeId] = result;
			
			return result;
		},
		
		createEdge: function(nodeIdFrom, nodeIdTo /*, arguments */) {
			var edgeId = '' + (++this.nextEdgeId);
			
			var tmp = Array.prototype.slice.call(arguments, 0);
			// TODO Maybe we should pass the nodes rather than the node ids
			var xargs = [this.graph, nodeIdFrom, nodeIdTo].concat(tmp);

			// FIXME: this.fnEdgeNode not defined
			var result = this.fnEdgeNode.apply(this, xargs);
			
			var edgeIdToEdge = this.nodeIdToEdgeIdToEdge[edges];
			if(edgeIdToEdge == null) {
				edgeIdToEdge = {};
				this.nodeIdToEdgeIdToEdge = edgeIdToEdge; 
			}
			
			edgeIdToEdge[edgeId] = result;
			this.idToEdge[edgeId] = result;
			
			
			return result;
		}		
		
	});
	
	ns.NodeJoinElement = Class.create(ns.Node, {
		initialize: function($super, graph, nodeId, element, alias) {
			$super(graph, nodeId); 
			// http://localhost/jassa/?file=jassa-facete
			this.element = element; // TODO ElementProvider?
			this.alias = alias;
		},
		
		getElement: function() {
			return this.element;
		},
		
		getAlias: function() {
			return this.alias;
		}		
	});

	
	ns.fnCreateMappingJoinNode = function(graph, nodeId) {
		console.log('Node arguments:', arguments);
    // FIXME: ns.MappingJoinNode not defined
		return new ns.MappingJoinNode(graph, nodeId);
	};


	ns.fnCreateMappingEdge = function(graph, edgeId) {
		return new ns.MappingJoinEdge(graph, edgeId);
	};


	ns.JoinGraphElement = Class.create(ns.Graph, {
		initialize: function($super) {
			$super(ns.fnCreateMappingJoinNode, ns.fnCreateMappingEdge);
		}
	});
	
	
	/**
	 * This row mapper splits a single binding up into multiple ones
	 * according to how the variables are mapped by aliases.
	 * 
	 * 
	 */
	ns.RowMapperAlias = Class.create({
		initialize: function(aliasToVarMap) {
			this.aliasToVarMap = aliasToVarMap;
		},
		
		/**
		 * 
		 * Returns a map from alias to bindings
		 * e.g. { a: binding, b: binding}
		 */
		map: function(binding) {
			//this.varAliasMap
			
			var vars = binding.getVars();
			
			var result = {};
			
			_(this.aliasToVarMap).each(function(varMap, alias) {
				
				var b = new sparql.Binding();
				result[alias] = b;
				
				var newToOld = varMap.getInverse();
				var newVars = newToOld.keyList();
				
				_(newVars).each(function(newVar) {
					var oldVar = newToOld.get(newVar);
					
					var node = binding.get(newVar);
					b.put(oldVar, node);
				});
				
			});
			
			return result;
//			
//			var varAliasMap = this.varAliasMap;
//			_(vars).each(function(v) {
//				
//				var node = binding.get(v);
//				
//				var aliasVar = varAliasMap.getOrigAliasVar(v);
//				var ov = aliasVar.v;
//				var oa = aliasVar.alias;
//				
//				var resultBinding = result[oa];
//				if(resultBinding == null) {
//					resultBinding = new ns.Binding();
//					result[oa] = resultBinding;
//				}
//				
//				resultBinding.put(ov, node);
//			});
//			
//			
//			return result;
		}
	});
	

	ns.MappingJoinEdge = Class.create(ns.Edge, {
		initialize: function($super, graph, edgeId) {
			$super(graph, graph, edgeId); 
		}
	});

	
	
})();

/**
 * An API that hides the underlying complexity.
 *
 */
(function() {

	var sparql = Jassa.sparql;
	var ns = Jassa.sponate;
	
	
	ns.Mapping = Class.create({
	    classLabel: 'jassa.sponate.Mapping',
	    
		initialize: function(name, pattern, elementFactory, patternRefs) {
			// TODO Remove the name attribute
		    this.name = name;
			this.pattern = pattern;
			this.elementFactory = elementFactory;
			
			// TODO Remove this attribute
			//this.tableName = name;

			// Cached value; inferred from pattern
			this.patternRefs = patternRefs || [];
		},
		
		getName: function() {
			return this.name;
		},
		
		getPattern: function() {
			return this.pattern;
		},
		
		getElementFactory: function() {
		    return this.elementFactory;
		},
		
//		getTableName: function() {
//			return this.tableName;
//		},
		
		getPatternRefs: function() {
			return this.patternRefs;
		},
		
		toString: function() {
		    var result = '[pattern: ' + this.pattern + ', element: ' + this.elementFactory.createElement() + ']';
		    return result;
		}
	});
	
	/**
	 * An easy to use API on top of the more complex system.
	 * 
	 * TODO Add example how to invoke
	 * 
	 */
	ns.StoreFacade = Class.create({
		
		/**
		 * Service and prefixes (a JSON map) are two common things that
		 * make sense to pass in to the constructor. 
		 * 
		 * 
		 */
		initialize: function(service, prefixes) {
			this.service = service;

			this.context = new ns.Context();

			prefixes = prefixes || {};
			this.context.getPrefixMapping().setNsPrefixes(prefixes);
		},

		addMap: function(obj, name) {
		    var result = (obj instanceof ns.Mapping) ? this.addMapObj(name, obj) : this.addMapSpec(obj);
		    return result;
		},
		
		addMapObj: function(name, map) {
            //var name = nameOverride || mapping.getName();

            var elementFactory = map.getElementFactory();
            this.context.mapTableNameToElementFactory(name, elementFactory);

            this.context.addMapping(name, map);
                
            // Create a new store object
            this.createStore(name);
                
            return this;
		    
		},
		
		/**
		 * Add a mapping specification
		 * 
		 */
		addMapSpec: function(spec) {
		    var map = ns.SponateUtils.parseMap(spec, this.context.getPrefixMapping(), this.context.getPatternParser());
	            
		    var name = spec.name; //mapping.getName();

		    var result = this.addMapObj(name, map);
		    return result;
		    
//		    var elementFactory = mapping.getElementFactory();
//            this.context.mapTableNameToElementFactory(name, elementFactory);
//
//		    this.context.addMapping(mapping);
//	            
//		    // Create a new store object
//		    this.createStore(name);
//	            
//		    return this;

		    
		    /*
			var name = spec.name;

			var jsonTemplate = spec.template;
			var from = spec.from;

			var context = this.context;
			
			// Parse the 'from' attribute into an ElementFactory
			// TODO Move to util class
			var elementFactory;
			if(_(from).isString()) {
			    
			    var elementStr = from;
			    
	            var prefixes = context.getPrefixMap().getJson();
	            //var vars = sparql.extractSparqlVars(elementStr);
	            var str = sparql.expandPrefixes(prefixes, elementStr);
	            
	            var element = sparql.ElementString.create(str);//, vars);
	            
			    elementFactory = new sparql.ElementFactoryConst(element);
			}
			else if(from instanceof sparql.Element) {
			    elementFactory = new sparql.ElementFactoryConst(from);
			}
			else if(from instanceof sparql.ElementFactory) {
			    elementFactory = from;
			}
			else {
			    console.log('[ERROR] Unknown argument type for "from" attribute', from);
			    throw 'Bailing out';
			}
			
            this.context.mapTableNameToElementFactory(name, elementFactory);
			
			// TODO The support joining the from element
			
			var pattern = this.context.getPatternParser().parsePattern(jsonTemplate);			

			var patternRefs = ns.PatternUtils.getRefs(pattern);

			//console.log('Parsed pattern', JSON.stringify(pattern));

			// The table name is the same as that of the mapping
			//ns.ContextUtils.createTable(this.context, name, from, patternRefs);
	

			var mapping = new ns.Mapping(name, pattern, name, patternRefs);
			
			this.context.addMapping(mapping);
			
			// Create a new store object
			this.createStore(name);
			
			return this;
			*/
		},
		
		createStore: function(name) {

			if(name in this) {
				console.log('[ERROR] An attribute / store with name ' + name + ' already exists');
				throw 'Bailing out';
			}
			
			this[name] = new ns.Store(this.service, this.context, name);
		},
		
		/*
		 * Functions for access to underlying components  
		 */
		
		getSchema: function() {
      // FIXME: schema not defined
			return schema;
		}
	});
	
	
})();
(function() {
	
	var ns = Jassa.sponate;

	/*
	ns.AttrStep = Class.create({
		initialize: function(name) {
			this.name = name;
		}
	});
	*/
	

	
	/**
	 * Parser for criterias.
	 * 
	 * A criteria is a form of constraint.
	 * 
	 */
	ns.CriteriaParser = Class.create({
		
		parse: function(crit) {

			var rootPath = new ns.AttrPath();

			var result = this.parseAny(crit, rootPath);
			return result;
		},
		
		parseAny: function(crit, basePath) {
			
			var result;
			if(crit == null) {
				result = new ns.CriteriaTrue();
			}
			else if(_(crit).isObject()) {
				result = this.parseObject(crit, basePath);
			}
			else if(_(crit).isArray()) {
				throw 'Not implemented';
			} else { // Primitive value; treat as equals
				result = this.parse_$eq(basePath, crit);				
			}
			
			return result;
		},
		
		
		parseObject: function(critObject, basePath) {
			
			//var basePath = context.basePath;
			
			var self = this;
			

            var options = critObject['$options'];

			var criterias = _(critObject).chain().omit('$options').map(function(val, key) {
				
				var criteria;

				if(_(key).startsWith('$')) {
				    
					// Call some special function
					var fnName = 'parse_' + key;
					var fn = self[fnName];
					
					if(!fn) {
						console.log('[ERROR] No criteria implementation for ' + key);
						throw 'Bailing out';
					}
					
					criteria = fn.call(self, basePath, val, options);
					
				} else {				
					var tmpPath = ns.AttrPath.parse(key);				
					var attrPath = basePath.concat(tmpPath);
					
					if(!val) {
						console.log('[ERROR] No value for attribute ' + key);
						throw 'Bailing out';
					}
					
					criteria = self.parseAny(val, attrPath);
				}
				
				return criteria;
			}).value();
			
			var result;
			if(criterias.length == 1) {
				result = criterias[0];
			} else {
			    
			    // TODO Not sure if the path argument is correct here
				result = new ns.CriteriaLogicalAnd(new ns.AttrPath(), criterias);
			}

			return result;
		},
		

		parse_$eq: function(attrPath, val) {
			return new ns.CriteriaEq(attrPath, val);
		},

		parse_$gt: function(attrPath, val) {
			return new ns.CriteriaGt(attrPath, val);
		},

		parse_$gte: function(attrPath, val) {
			return new ns.CriteriaGte(attrPath, val);
		},

		parse_$lt: function(attrPath, val) {
			return new ns.CriteriaLt(attrPath, val);
		},

		parse_$lte: function(attrPath, val) {
			return new ns.CriteriaLte(attrPath, val);
		},

		parse_$ne: function(attrPath, val) {
			return new ns.CriteriaNe(attrPath, val);
		},

		parse_$regex: function(attrPath, val, flags) {
			var regex;

			
			if(_(val).isString()) {
				regex = new RegExp(val, flags);
			} else if (val instanceof RegExp) {
			    // TODO Handle the case when val already is a regex and flags are provided
				regex = val;
			} else {
				console.log('[ERROR] Not a regex: ' + val);
				throw 'Bailing out';
			}
			
			var result = new ns.CriteriaRegex(attrPath, regex);
			return result;
		},
		
		
		parse_$elemMatch: function(attrPath, val) {

			var c = this.parse(val);
			
			var criterias;
			if(c instanceof ns.CriteriaLogicalAnd) {
				criterias = c.getCriterias();
			} else {
				criterias = [c];
			}

			var result = new ns.CriteriaElemMatch(attrPath, criterias);
			return result;
		},
		
		parse_$or: function(attrPath, val) {

			if(!_(val).isArray()) {
				console.log('Argument of $or must be an array');
				throw 'Bailing out';
			}
			
			var self = this;
			var criterias = val.map(function(crit) {
				var result = self.parse(crit);
				return result;
			});
			
			var result;
			if(criterias.length == 1) {
				result = criterias[0];
			} else {
				result = new ns.CriteriaLogicalOr(attrPath, criterias);
			}
			
			return result;
		}
		
		
	});
	
	
	/**
	 * Criterias
	 * 
	 * Represent constraints on JSON documents
	 * 
	 * For convenience, they can readily match json (i.e. no compilation to a filter object necessary)
	 * Note: Usually good engineering mandates separating these concerns, and maybe we shoot ourselves into the foot by not doing it here
	 * So in the worst case, we would create a FilterFactory which creates filters from criterias.
	 * a filter is equivalent to a predicate - i.e. a function that returns boolean.
	 * 
	 * 
	 */
	
	ns.Criteria = Class.create({
		getOpName: function() {
			throw 'Not overridden';
		},
		
		match: function(doc) {
			throw 'Not overridden';
		},
		
		callVisitor: function(name, self, args) {
			var result = ns.callVisitor(name, self, args);
			return result;
		},
		
		accept: function(visitor) {
		    console.log('Not overridden');
			throw 'Not overridden';
		}
	});
	
	
	ns.CriteriaBase = Class.create(ns.Criteria, {
		initialize: function(opName) {
			this.opName = opName;
		},
		
		getOpName: function() {
			return this.opName;
		},
		
		accept: function(visitor) {
//		    debugger;
            var result = ns.callVisitor('visitCriteria' + this.opName, this, arguments);
            return result;
        }
	});
	
	
	ns.CriteriaFalse = Class.create(ns.CriteriaBase, {
		initialize: function($super) {
			$super('$false');
		},
		
		match: function(doc) {
			return false;
		}
	});

	ns.CriteriaTrue = Class.create(ns.CriteriaBase, {
		initialize: function($super) {
			$super('$true');
		},
		
		match: function(doc) {
			return true;
		}
	});
	

	
	ns.CriteriaPath = Class.create(ns.CriteriaBase, {
		initialize: function($super, opName, attrPath) {
			$super(opName);
			this.attrPath = attrPath;
			if(!attrPath) {
				throw 'npe';
			}
		},
		
		getAttrPath: function() {
			return this.attrPath;
		},
		
		match: function(doc) {
			var val = this.attrPath.find(doc);
			
			var result = this.$match(doc, val);
			
			return result;
		},
		
		
		// Minor convenience, as the base function already took care of resolving the value
		$match: function(doc, val) {
			throw 'Not overridden';
		}
		
	});

    ns.CriteriaPathValue = Class.create(ns.CriteriaPath, {
        initialize: function($super, opName, attrPath, value) {
            $super(opName, attrPath);
            this.value = value;
        },

        getValue: function() {
            return this.value;
        },
        
        toString: function() {
            return '(' + this.attrPath + ' ' + this.opName + ' ' + this.value + ')';
        }
    });

	
	/**
	 * @param the document on which to apply the criteria 
	 */
	ns.CriteriaEq = Class.create(ns.CriteriaPathValue, {
		initialize: function($super, attrPath, value) {
			$super('$eq', attrPath, value);
		},
		
		$match: function(doc, val) {
			var result = val == this.value;
			return result;
		}
	});

	
	ns.CriteriaGt = Class.create(ns.CriteriaPath, {
		initialize: function($super, attrPath, value) {
			$super('$gt', attrPath);
			this.value = value;
		},
		
		$match: function(doc, val) {
			var result = val > this.value;
			return result;
		}
	});

	ns.CriteriaGte = Class.create(ns.CriteriaPath, {
		initialize: function($super, attrPath, value) {
			$super('$gte', attrPath);
			this.value = value;
		},
		
		$match: function(doc, val) {
			var result = val >= this.value;
			return result;
		}
	});

	
	ns.CriteriaLt = Class.create(ns.CriteriaPath, {
		initialize: function($super, attrPath, value) {
			$super('$lt', attrPath);
			this.value = value;
		},
		
		$match: function(doc, val) {
			var result = val < this.value;
			return result;
		}
	});

	ns.CriteriaLte = Class.create(ns.CriteriaPath, {
		initialize: function($super, attrPath, value) {
			$super('$lte', attrPath);
			this.value = value;
		},
		
		$match: function(doc, val) {
			var result = val <= this.value;
			return result;
		}
	});

	
	ns.CriteriaNe = Class.create(ns.CriteriaPath, {
		initialize: function($super, attrPath, value) {
			$super('$ne', attrPath);
			this.value = value;
		},
		
		$match: function(doc, val) {
			var result = val != this.value;
			return result;
		}
	});
	

	
	/**
	 * @param the document on which to apply the criteria 
	 */
	ns.CriteriaRegex = Class.create(ns.CriteriaPath, {
		initialize: function($super, attrPath, regex) {
			$super('$regex', attrPath);
			this.regex = regex;
			
//			console.log('REGEX', regex);
//			this.pattern = pattern;
//			this.flags = flags;
		},
		
		getRegex: function() {
		    return this.regex;
		},
		
//		getPattern: function() {
//		    return this.pattern;
//		},
//		
//		getFlags: function() {
//		    return this.flags
//		},
		
		$match: function(doc, val) {
			var result = this.regex.test(val);

			return result;
		}
		
//		accept: function(visitor) {
//			var result = this.callVisitor('visitRegex', this, arguments);
//			return result;
//		}
	});

	

    ns.CriteriaPathCollection = Class.create(ns.CriteriaPath, {
        initialize: function($super, opName, attrPath, criterias) {
            $super(opName, attrPath);
            this.criterias = criterias;
        },
        
        getCriterias: function() {
            return this.criterias;
        },
        
        toString: function() {
            return '[' + this.criterias.join(', ') + ']';
        }
    });

	/**
	 * A criteria where
	 * 
	 */
	ns.CriteriaLogicalAnd = Class.create(ns.CriteriaPathCollection, {
		initialize: function($super, attrPath, criterias) {
			$super('$and', attrPath, criterias);
		},
		
		match: function(doc) {
			var result = _(this.criterias).every(function(criteria) {
				var subResult = criteria.match(doc);
				return subResult;
			});
			
			return result;
		}
	});
		

	ns.CriteriaLogicalOr = Class.create(ns.CriteriaPathCollection, {
		initialize: function($super, attrPath, criterias) {
			$super('$or', attrPath, criterias);
			//this.criterias = criterias;
		},
		
//		getCriterias: function() {
//			return this.criterias;
//		},
		
		$match: function(doc, val) {

			var result = _(this.criterias).some(function(criteria) {
				var subResult = criteria.match(val);
				return subResult;
			});
			
			return result;
		}
//		,
//		
//		accept: function(visitor) {
//			var result = this.callVisitor('visitLogicalOr', this, arguments);
//			return result;
//		}

	});
		

	/**
	 * http://docs.mongodb.org/manual/reference/operator/elemMatch/#op._S_elemMatch
	 * 
	 * "Matching arrays must have at least one element that matches all specified criteria."
	 * 
	 */
	ns.CriteriaElemMatch = Class.create(ns.CriteriaPathCollection, {
		initialize: function($super, attrPath, criterias) {
			$super('$elemMatch', attrPath, criterias);
//			this.criterias = criterias;
		},
		
//		getCriterias: function() {
//			return this.criterias;
//		},
		
		$match: function(doc, val) {
			if(!_(val).isArray()) {
				console.log('[ERROR] Cannon apply $elemMatch to non-array', val);
				throw 'Bailing out';
			}
			
			console.log('$elemMatch ' + this.attrPath);
			
			var result = this.matchArray(val);
			return result;
		},
		
		// There has to be at least 1 item which satisfies all of the criterias
		matchArray: function(docArray) {
			
			var self = this;
			var result = _(docArray).some(function(doc) {
				var itemMatch = _(self.criterias).every(function(criteria) {
					//console.log('Matching doc', doc, criteria);
					var criteriaMatch = criteria.match(doc);
					return criteriaMatch;
				});

				return itemMatch;				
			});
			
			return result;
		},
		
		accept: function(visitor) {
			var result = this.callVisitor('visitElemMatch', this, arguments);
			return result;
		}
	});
	
	
	
})();

(function() {
	
    var sparql = Jassa.sparql;
    
    
	var ns = Jassa.sponate;


	ns.CriteriaCompilerSparql = Class.create({


		/**
		 * The result is a joinNode (can be converted to an element)....
		 * 
		 * So maybe the result is simply a list of sparq.Elements that correspond to the criteria.
		 * 
		 */
		compile: function(context, mapping, criteria) {

		    //var tableName = mapping.getTableName();
		    //var tableNameToElementFactory = context.getTableNameToElementFactory();
		    //var elementFactory = tableNameToElementFactory[tableName];
		    var elementFactory = mapping.getElementFactory();
		    
		    var element = elementFactory.createElement();
		    		    
		    var joinNode = sparql.JoinBuilderElement.create(element);
		    
		    //var result = []; // list of elements
		    
//		    var result = {
//		            exprs: [];
//		    }
		    
		    // TODO The result format is still unclear ; most likely it is
		    // something along the lines of a mapping from
		    // join alias to exprs and elements
		    var result = [];
		    
            console.log("Compile request for criteria: " + criteria + '; ' + JSON.stringify(criteria));

            var pattern = mapping.getPattern();

            // TODO Why the heck did I use the visitor pattern here???? Was I drunk???
            // TODO: Just build the function name and call it!
		    
            
            //criteria.accept(this, pattern, context, joinNode, result);
            this.visitCriteria(criteria, pattern, context, joinNode, result);
            
		    
            return result;
            
//		    var alias = joinNode.getAlias();
//
//		    var joinBuilder = joinNode.getJoinBuilder();
//		    var aliasToVarMap = joinBuilder.getAliasToVarMap();

		    
		    
//		    var foo = joinNode.join([vs], b, [vs]);
//		    //var bar = foo.join([vl], b, [vs]);
//		    joinNode.join([vs], a, [vl]);
//
//		    var joinBuilder = foo.getJoinBuilder();
//		    var elements = joinBuilder.getElements();
//		    var els = new sparql.ElementGroup(elements);
//		    var aliasToVarMap = joinBuilder.getAliasToVarMap();
//		    
//		    
//		    var rowMapper = new sponate.RowMapperAlias(aliasToVarMap);
//		    var aliasToBinding = rowMapper.map(binding);
		    
//		    console.log('Final Element: ' + els);
//		    console.log('Var map:',  aliasToVarMap);
//		    console.log('Alias to Binding: ', JSON.stringify(aliasToBinding));

		    
		    
//			var joinGraph = new ns.Graph(ns.fnCreateMappingJoinNode, ns.fnCreateMappingEdge);
//			
//			var joinNode = joinGraph.createNode(mapping);
//			var result = criteria.accept(this, criteria, context, joinGraph, joinNode);
//
//			return result;
		    
		},
		
		visitCriteria: function(criteria, pattern, context, joinNode, result) {
		    var fnName = 'visitCriteria' + criteria.getOpName();
		    var fn = this[fnName];
		    
		    if(!fn) {
	            console.log('Member not found: ' + fnName);
	            throw 'Bailing out';
		    }
		    
		    var result = fn.call(this, criteria, pattern, context, joinNode, result);
		    return result;
		},
		
//		findPattern: function(pattern, attrPath) {
//
//			// At each step check whether we encounter a reference
//			_(attrPath.getSteps()).each(function(step) {
//				pattern.f
//			});
//		},
//		
		
		visitCriteria$elemMatch: function(criteria, pattern, context, joinNode, result) {
//          debugger;
            var subPattern = pattern.findPattern(criteria.getAttrPath());
            
            var self = this;
            var subCriterias = criteria.getCriterias();
            var orExprs = [];
            
            _(subCriterias).each(function(subCriteria) {
                var andExprs = [];
                //subCriteria.accept(self, subPattern, context, joinNode, andExprs);
                self.visitCriteria(subCriteria, subPattern, context, joinNode, andExprs);

                
                var andExpr = sparql.andify(andExprs);
                orExprs.push(andExpr);
            });

            var orExpr = sparql.orify(orExprs);
            result.push(orExpr);
		},

		
		getExpr: function(pattern) {
            if(pattern instanceof ns.PatternLiteral) {
                var expr = pattern.getExpr();
                
                return expr;
                //var element = new sparql.ElementFilter([e]);
            } else {
                console.log('[ERROR] pattern type not supported yet');
                throw 'Bailing out';
            }
		    
		},
		
		visitEq: function(criteria, pattern, context, joinNode, result) {
//            debugger;
            var subPattern = pattern.findPattern(this.attrPath);

            var expr = this.getExpr(subPattern);
            // FIXME: ap not defined
            var e = new sparql.E_Equals(new sparql.E_Str(expr), sparql.NodeValue.makeString(ap.getValue()));
            result.push(e);
		},
		
		visitCriteria$and: function(criteria, pattern, context, joinNode, result) {
//            debugger;
		    console.log('Pattern: ' + pattern);
            var subPattern = pattern.findPattern(criteria.getAttrPath());
		    
		    
            var self = this;
		    var subCriterias = criteria.getCriterias();
		    _(subCriterias).each(function(subCriteria) {
	            //criteria.accept(self, subPattern, context, joinNode, result);
                self.visitCriteria(subCriteria, subPattern, context, joinNode, result);
		    });
		},

		visitCriteria$or: function(criteria, pattern, context, joinNode, result) {
//            debugger;
            var subPattern = pattern.findPattern(criteria.getAttrPath());

            
		    var self = this;
            var subCriterias = criteria.getCriterias();
            var orExprs = [];
            
            _(subCriterias).each(function(subCriteria) {
                var andExprs = [];
                //subCriteria.accept(self, subPattern, context, joinNode, andExprs);
                self.visitCriteria(subCriteria, subPattern, context, joinNode, andExprs);

                
                var andExpr = sparql.andify(andExprs);
                orExprs.push(andExpr);
            });

            var orExpr = sparql.orify(orExprs);
            result.push(orExpr);
        },

        visitCriteria$regex: function(criteria, pattern, context, joinNode, result) {
//            debugger;
            var subPattern = pattern.findPattern(criteria.getAttrPath());

            var regexStr = criteria.getRegex().toString();
            var flagDelim = regexStr.lastIndexOf('/');
            
            var patternStr = regexStr.substring(1, flagDelim);
            var flags = regexStr.substring(flagDelim + 1);
            
            //var regexStr = .slice(1, -1);
            var expr = this.getExpr(subPattern);
            
            //var flags = criteria.getFlags();
            
            var e = new sparql.E_Regex(new sparql.E_Str(expr), patternStr, flags);
            result.push(e);
        },
		
        visitCriteria$true: function(criteria, pattern, context, joinNode, result) {
            
        },
        
		/**
		 * 
		 * 
		 */
		visitRef: function(criteria, context, graph, joinNode) {
			
		},


		visitGt: function() {

		}
		
		
	});
	
	
})();(function() {

    var rdf = Jassa.rdf;
    var sparql = Jassa.sparql;
    
    var ns = Jassa.sponate;
    
    var compareArray = function(as, bs, op) {
        var zipped = _.zip(as, bs);
        
        var result = false;
        for(var i = 0; i < zipped.length; ++i) {
           var item = zipped[i];
           var a = item[0];
           var b = item[1];
           
           if(op(a, b)) {
               if(op(b, a)) {
                   continue;
               }
               
               result = true;
               break;
           } else { //else if(op(b, a)) {
               if(!op(b, a)) {
                   continue;
               }

               result = false;
               break;
           }
        }
//         _(zipped).each(function(item) {
            
//         });
        
//      var result = zipped.every(function(a) {
//          var r = op(a[0], a[1]);
//          return r;
//      });
       
        return result;
    };
    
    var cmpLessThan = function(a, b) {
        return a < b;
    };
    
    // TODO Move to utils
    ns.extractLabelFromUri = function(str) {
        var a = str.lastIndexOf('#');
        var b = str.lastIndexOf('/');
        
        var i = Math.max(a, b);

        var result = (i === str.length) ? str : str.substring(i + 1); 

        if(result === '') {
            result = str; // Rather show the URI than an empty string
        }
        
        return result;
    };
    
    ns.AggregatorFactoryLabel = Class.create({
        initialize: function(labelPrios, prefLangs, labelExpr, subjectExpr, propertyExpr) {
            this.labelPrios = labelPrios;
            this.prefLangs = prefLangs;
            this.labelExpr = labelExpr;
            this.subjectExpr = subjectExpr;
            this.propertyExpr = propertyExpr;
        },
        
        createAggregator: function() {
            var result = new ns.AggregatorLabel(
                this.labelPrios, this.prefLangs, this. labelExpr, this.subjectExpr, this.propertyExpr
            );
            return result;
        },
        
        getVarsMentioned: function() {
            var vm = (function(expr) {
                var result = expr ? expr.getVarsMentioned() : [];
                return result;
            });
            
            var result = _.union(vm(this.labelExpr), vm(this.subjectExpr), vm(this.propertyExpr));
            return result;
        }
    });
    
    
    ns.AggregatorLabel = Class.create({
        initialize: function(labelPrios, prefLangs, labelExpr, subjectExpr, propertyExpr) {
            this.subjectExpr = subjectExpr;
            this.propertyExpr = propertyExpr;
            this.labelExpr = labelExpr;
            

            //this.exprEvaluator = exprEvaluator ? exprEvaluator : new sparql.ExprEvaluatorImpl();
            this.exprEvaluator = new sparql.ExprEvaluatorImpl();
            
            this.labelPrios = labelPrios;
            this.prefLangs = prefLangs;

            //this.defaultPropery = defaultProperty;
            
            this.bestMatchNode = null;
            this.bestMatchScore = [1000, 1000];
        },
        
        processBinding: function(binding) {
            
            // Evaluate label, property and subject based on the binding
            var property = this.exprEvaluator.eval(this.propertyExpr, binding);
            var label = this.exprEvaluator.eval(this.labelExpr, binding);
            var subject = this.exprEvaluator.eval(this.subjectExpr, binding);
           
            if(this.bestMatchNode == null && subject.isConstant()) {
                this.bestMatchNode = subject.getConstant().asNode();
            }
            
            // Determine the score vector for the property and the language
            var propertyScore = -1;
            var langScore;
            
            var l;
            if(property && property.isConstant()) {
                var p = property.getConstant().asNode();
                if(p.isUri()) {
                    var propertyUri = p.getUri();
                    propertyScore = this.labelPrios.indexOf(propertyUri);
                }
            }
            
            if(label && label.isConstant()) {
                l = label.getConstant().asNode();
                
                var lang = l.isLiteral() ? l.getLiteralLanguage() : 'nolang';
                
//              var val = l.getLiteralLexicalForm();

//              if(val == 'Foobar' || val == 'Baz') {
//                  console.log('here');
//              }

                
                langScore = this.prefLangs.indexOf(lang);
            }
            
            
            var score = [propertyScore, langScore];
            
            var allNonNegative = _(score).every(function(item) {
                return item >= 0;
            });
            
            if(allNonNegative) {
            
                // Check if the new score is better (less than) than the current best match
                var cmp = compareArray(score, this.bestMatchScore, cmpLessThan);
                if(cmp === true) {
                    this.bestMatchScore = score;
                    this.bestMatchNode = l;
                }
            }
        },
        
        getNode: function() {
            return this.bestMatchNode;  
        },
        
        getJson: function() {
            var result = null;
            var bestMatchNode = this.bestMatchNode;
            
            if(bestMatchNode) {
                if(bestMatchNode.isUri()) {
                    var uri = bestMatchNode.getUri();
                    result = ns.extractLabelFromUri(uri);
                }
                else {
                    result = bestMatchNode.getLiteralValue();
                }
            }

            return result;
        }
    });
    
    //var aggLabel = new ns.AggregatorLabel(prefLabelPropertyUris, prefLangs, labelExpr, subjectExpr, propertyExpr);


    //var aggFactoryLabel = new ns.AggregatorFactoryLabel(prefLabelPropertyUris, prefLangs, labelExpr, subjectExpr, propertyExpr);

    
    ns.LabelUtil = Class.create({
        initialize: function(aggFactory, element) {
            this.aggFactory = aggFactory;
            this.element = element;
        },
        
        getAggFactory: function() {
            return this.aggFactory;
        },
        
        getElement: function() {
            return this.element;
        }
    });

    ns.LabelUtilFactory = Class.create({
       initialize: function(prefLabelPropertyUris, prefLangs) {
           this.prefLabelPropertyUris = prefLabelPropertyUris;
           this.prefLangs = prefLangs;
           
           // TODO Add option fetchAllLangs (prevent fetching only desired langs - may have performance bonus on lang switches)
           // TODO Add option prefPropertyOverLang (by default, the language is more important than the property)
           
           this.prefLabelProperties = _(this.prefLabelPropertyUris).map(function(uri) {
              return rdf.NodeFactory.createUri(uri); 
           });
       },
       
       createLabelUtil: function(labelVarName, subjectVarName, propertyVarName) {
            var s = rdf.NodeFactory.createVar(subjectVarName);
            var p = rdf.NodeFactory.createVar(propertyVarName);
            var o = rdf.NodeFactory.createVar(labelVarName);

            var subjectExpr = new sparql.ExprVar(s);
            var propertyExpr = new sparql.ExprVar(p);
            var labelExpr = new sparql.ExprVar(o);

            // First, create the aggregator object
            var aggFactoryLabel = new ns.AggregatorFactoryLabel(this.prefLabelPropertyUris, this.prefLangs, labelExpr, subjectExpr, propertyExpr);
        
            
            // Second, create the element
            var langTmp = _(this.prefLangs).map(function(lang) {
                var r = new sparql.E_LangMatches(new sparql.E_Lang(labelExpr), sparql.NodeValue.makeString(lang));
                return r;
            });
                
            // Combine multiple expressions into a single logicalOr expression.
            var langConstraint = sparql.orify(langTmp);
            
            //var propFilter = new sparql.E_LogicalAnd(
            var propFilter = new sparql.E_OneOf(propertyExpr, this.prefLabelProperties);
            //);
            
            var els = [];
            els.push(new sparql.ElementTriplesBlock([ new rdf.Triple(s, p, o)] ));
            els.push(new sparql.ElementFilter([propFilter]));
            els.push(new sparql.ElementFilter([langConstraint]));
            
            var langElement = new sparql.ElementGroup(els);
            
            var result = new ns.LabelUtil(aggFactoryLabel, langElement);
            return result;
       }
    });

    
    
})();
(function() {

    var rdf = Jassa.rdf;
    var sparql = Jassa.sparql;
    
    var ns = Jassa.sponate;
    
    var compareArray = function(as, bs, op) {
        var zipped = _.zip(as, bs);
        
        var result = false;
        for(var i = 0; i < zipped.length; ++i) {
           var item = zipped[i];
           var a = item[0];
           var b = item[1];
           
           if(op(a, b)) {
               if(op(b, a)) {
                   continue;
               }
               
               result = true;
               break;
           } else { //else if(op(b, a)) {
               if(!op(b, a)) {
                   continue;
               }

               result = false;
               break;
           }
        }
//         _(zipped).each(function(item) {
            
//         });
        
//      var result = zipped.every(function(a) {
//          var r = op(a[0], a[1]);
//          return r;
//      });
       
        return result;
    };
    
    var cmpLessThan = function(a, b) {
        return a < b;
    };
    
    // TODO Move to utils
    ns.extractLabelFromUri = function(str) {
        var a = str.lastIndexOf('#');
        var b = str.lastIndexOf('/');
        
        var i = Math.max(a, b);

        var result = (i === str.length) ? str : str.substring(i + 1); 

        if(result === '') {
            result = str; // Rather show the URI than an empty string
        }
        
        return result;
    };
    
    ns.AggregatorFactoryLabel = Class.create({
        initialize: function(labelPrios, prefLangs, labelExpr, subjectExpr, propertyExpr) {
            this.labelPrios = labelPrios;
            this.prefLangs = prefLangs;
            this.labelExpr = labelExpr;
            this.subjectExpr = subjectExpr;
            this.propertyExpr = propertyExpr;
        },
        
        createAggregator: function() {
            var result = new ns.AggregatorLabel(
                this.labelPrios, this.prefLangs, this. labelExpr, this.subjectExpr, this.propertyExpr
            );
            return result;
        },
        
        getVarsMentioned: function() {
            var vm = (function(expr) {
                var result = expr ? expr.getVarsMentioned() : [];
                return result;
            });
            
            var result = _.union(vm(this.labelExpr), vm(this.subjectExpr), vm(this.propertyExpr));
            return result;
        }
    });
    
    
    ns.AggregatorLabel = Class.create({
        initialize: function(labelPrios, prefLangs, labelExpr, subjectExpr, propertyExpr) {
            this.subjectExpr = subjectExpr;
            this.propertyExpr = propertyExpr;
            this.labelExpr = labelExpr;
            

            //this.exprEvaluator = exprEvaluator ? exprEvaluator : new sparql.ExprEvaluatorImpl();
            this.exprEvaluator = new sparql.ExprEvaluatorImpl();
            
            this.labelPrios = labelPrios;
            this.prefLangs = prefLangs;

            //this.defaultPropery = defaultProperty;
            
            this.bestMatchNode = null;
            this.bestMatchScore = [1000, 1000];
        },
        
        processBinding: function(binding) {
            
            // Evaluate label, property and subject based on the binding
            var property = this.exprEvaluator.eval(this.propertyExpr, binding);
            var label = this.exprEvaluator.eval(this.labelExpr, binding);
            var subject = this.exprEvaluator.eval(this.subjectExpr, binding);
           
            if(this.bestMatchNode == null && subject.isConstant()) {
                this.bestMatchNode = subject.getConstant().asNode();
            }
            
            // Determine the score vector for the property and the language
            var propertyScore = -1;
            var langScore;
            
            var l;
            if(property && property.isConstant()) {
                var p = property.getConstant().asNode();
                if(p.isUri()) {
                    var propertyUri = p.getUri();
                    propertyScore = this.labelPrios.indexOf(propertyUri);
                }
            }
            
            if(label && label.isConstant()) {
                l = label.getConstant().asNode();
                
                var lang = l.isLiteral() ? l.getLiteralLanguage() : 'nolang';
                
//              var val = l.getLiteralLexicalForm();

//              if(val == 'Foobar' || val == 'Baz') {
//                  console.log('here');
//              }

                
                langScore = this.prefLangs.indexOf(lang);
            }
            
            
            var score = [propertyScore, langScore];
            
            var allNonNegative = _(score).every(function(item) {
                return item >= 0;
            });
            
            if(allNonNegative) {
            
                // Check if the new score is better (less than) than the current best match
                var cmp = compareArray(score, this.bestMatchScore, cmpLessThan);
                if(cmp === true) {
                    this.bestMatchScore = score;
                    this.bestMatchNode = l;
                }
            }
        },
        
        getNode: function() {
            return this.bestMatchNode;  
        },
        
        getJson: function() {
            var result = null;
            var bestMatchNode = this.bestMatchNode;
            
            if(bestMatchNode) {
                if(bestMatchNode.isUri()) {
                    var uri = bestMatchNode.getUri();
                    result = ns.extractLabelFromUri(uri);
                }
                else {
                    result = bestMatchNode.getLiteralValue();
                }
            }

            return result;
        }
    });
    
    //var aggLabel = new ns.AggregatorLabel(prefLabelPropertyUris, prefLangs, labelExpr, subjectExpr, propertyExpr);


    //var aggFactoryLabel = new ns.AggregatorFactoryLabel(prefLabelPropertyUris, prefLangs, labelExpr, subjectExpr, propertyExpr);

    
    ns.LabelUtil = Class.create({
        initialize: function(aggFactory, element) {
            this.aggFactory = aggFactory;
            this.element = element;
        },
        
        getAggFactory: function() {
            return this.aggFactory;
        },
        
        getElement: function() {
            return this.element;
        }
    });

    ns.LabelUtilFactory = Class.create({
       initialize: function(prefLabelPropertyUris, prefLangs) {
           this.prefLabelPropertyUris = prefLabelPropertyUris;
           this.prefLangs = prefLangs;
           
           // TODO Add option fetchAllLangs (prevent fetching only desired langs - may have performance bonus on lang switches)
           // TODO Add option prefPropertyOverLang (by default, the language is more important than the property)
           
           this.prefLabelProperties = _(this.prefLabelPropertyUris).map(function(uri) {
              return rdf.NodeFactory.createUri(uri); 
           });
       },
       
       createLabelUtil: function(labelVarName, subjectVarName, propertyVarName) {
            var s = rdf.NodeFactory.createVar(subjectVarName);
            var p = rdf.NodeFactory.createVar(propertyVarName);
            var o = rdf.NodeFactory.createVar(labelVarName);

            var subjectExpr = new sparql.ExprVar(s);
            var propertyExpr = new sparql.ExprVar(p);
            var labelExpr = new sparql.ExprVar(o);

            // First, create the aggregator object
            var aggFactoryLabel = new ns.AggregatorFactoryLabel(this.prefLabelPropertyUris, this.prefLangs, labelExpr, subjectExpr, propertyExpr);
        
            
            // Second, create the element
            var langTmp = _(this.prefLangs).map(function(lang) {
                var r = new sparql.E_LangMatches(new sparql.E_Lang(labelExpr), sparql.NodeValue.makeString(lang));
                return r;
            });
                
            // Combine multiple expressions into a single logicalOr expression.
            var langConstraint = sparql.orify(langTmp);
            
            //var propFilter = new sparql.E_LogicalAnd(
            var propFilter = new sparql.E_OneOf(propertyExpr, this.prefLabelProperties);
            //);
            
            var els = [];
            els.push(new sparql.ElementTriplesBlock([ new rdf.Triple(s, p, o)] ));
            els.push(new sparql.ElementFilter([propFilter]));
            els.push(new sparql.ElementFilter([langConstraint]));
            
            var langElement = new sparql.ElementGroup(els);
            
            var result = new ns.LabelUtil(aggFactoryLabel, langElement);
            return result;
       }
    });

    
    
})();
/*
 * With Sponate we use jQuery as the 'standard' deferred api.
 *
 * We are not going to abstract this away, we'll just provide a wrapper/bridge to angular.
 * 
 * http://xkcd.com/927/
 * 
 */

// TODO We need to intercept store creation to add the plugin,
// in other words, we need a store factory

(function() {

	var tmp = Jassa.sponate;
	
	if(!tmp.angular) {
		tmp.angular = {};
	}
	
	var ns = Jassa.sponate.angular;
	


	/**
	 * @Deprecated
	 * 
	 * use $q.when(jQueryPromise) wrapper
	 */
	ns.bridgePromise = function(jqPromise, ngDeferred, ngScope, fn) {
		jqPromise.done(function(data) {
			
			var d = fn ? fn(data) : data;
//			ngScope.$apply(function() {
			ngDeferred.resolve(d);
//			});

			
			
			var doRefresh = function() {
			
    		    //if (ngScope && ngScope.$root.$$phase != '$apply' && ngScope.$root.$$phase != '$digest') {
    			//if (ngScope && !ngScope.$root.$$phase) {
    			if (ngScope && !ngScope.$$phase && !ngScope.$root.$$phase) {
    		        ngScope.$apply();
    		    }
    			else {
    			    setTimeout(doRefresh, 25);
    			}
			};
			
			doRefresh();
			
		}).fail(function(data) {
			ngDeferred.reject(data);
		});
		
		return ngDeferred.promise;
	}

})();
(function() {

    var ns = Jassa.sponate;
    var sparql = Jassa.sparql;
    var sponate = Jassa.sponate;

    ns.GeoMapFactory = Class.create({
        classLabel: 'GeoMapFactory',
        
        initialize: function(baseSponateView, bboxExprFactory) {
            //this.template = template;
            //this.baseElement = baseElement;
            this.baseSponateView = baseSponateView;
            this.bboxExprFactory = bboxExprFactory;
        },

        createMapForGlobal: function() {
            var result = this.createMapForBounds(null);
            return result;
        },
        
        createMapForBounds: function(bounds) {
            var baseSponateView = this.baseSponateView;
            var bboxExprFactory = this.bboxExprFactory;
            
            var pattern = baseSponateView.getPattern();
            var baseElementFactory = baseSponateView.getElementFactory();
            
            var baseElement = baseElementFactory.createElement();
            var element = baseElement;         
            if(bounds) {
                var filterExpr = bboxExprFactory.createExpr(bounds);
                var filterElement = new sparql.ElementFilter(filterExpr);
               
                element = new sparql.ElementGroup([baseElement, filterElement]);
            }
               
            var result = new sponate.Mapping(null, pattern, new sparql.ElementFactoryConst(element));
            return result;
        }
    });
    
})();
(function() {

	var ns = Jassa.facete;
	var sparql = Jassa.sparql;
	var rdf = Jassa.rdf;

	/**
	 * 
	 * @param direction
	 * @param resource
	 * @returns {ns.Step}
	 */
	ns.Step = Class.create({
		
		initialize: function(propertyName, isInverse) {
			this.type = "property";
			this.propertyName = propertyName;
			this._isInverse = isInverse;
		},
	
		toJson: function() {
			var result = {
				isInverse: this.isInverse,
				propertyName: this.propertyName
			};
			
			return result;
		},
		
		getPropertyName: function() {
			return this.propertyName;
		},

		isInverse: function() {
			return this._isInverse;
		},


		equals: function(other) {
			return _.isEqual(this, other);
		},

		toString: function() {
			if(this._isInverse) {
				return "<" + this.propertyName;
			} else {
				return this.propertyName;
			}
		},
		
		createElement: function(sourceVar, targetVar, generator) {
			var propertyNode = sparql.Node.uri(this.propertyName);
			
			var triple;
			if(this._isInverse) {
				triple = new rdf.Triple(targetVar, propertyNode, sourceVar);
			} else {
				triple = new rdf.Triple(sourceVar, propertyNode, targetVar);
			}
			
			var result = new sparql.ElementTriplesBlock([triple]);
			
			return result;
		}
	});
	
	ns.Step.classLabel = 'Step';

	
	/**
	 * Create a Step from a json specification:
	 * {
	 *     propertyName: ... ,
	 *     isInverse: 
	 * }
	 * 
	 * @param json
	 */
	ns.Step.fromJson = function(json) {
    // FIXME: checkNotNull cannot be resolved
		var propertyName = checkNotNull(json.propertyName);
		var isInverse = json.IsInverse();
		
		var result = new ns.Step(propertyName, isInverse);
		return result;
	};
	
	ns.Step.parse = function(str) {
		var result;
		if(_(str).startsWith("<")) {
			result = new ns.Step(str.substring(1), true);
		} else {
			result = new ns.Step(str, false);
		}
		return result;
	};

	
	/**
	 * A path is a sequence of steps
	 * 
	 * @param steps
	 * @returns {ns.Path}
	 */
	ns.Path = Class.create({
		initialize: function(steps) {
			this.steps = steps ? steps : [];
		},
		
		getLength: function() {
		    return this.steps.length;
		},
		
		isEmpty: function() {
			var result = this.steps.length === 0;
			return result;
		},
		
		toString: function() {
			var result = this.steps.join(" ");
			return result;
		},	
	
		concat: function(other) {
			var result = new ns.Path(this.steps.concat(other.steps));
			return result;
		},
	
		getLastStep: function() {
			var steps = this.steps;
			var n = steps.length;
			
			var result;
			if(n === 0) {
				result = null;
			} else {
				result = steps[n - 1];
			}
			
			return result;
		},
		
		getSteps: function() {
			return this.steps;
		},
	
		startsWith: function(other) {
			var n = other.steps.length;
			if(n > this.steps.length) {
				return false;
			}
			
			for(var i = 0; i < n; ++i) {
				var thisStep = this.steps[i];
				var otherStep = other.steps[i];
				
				//console.log("      ", thisStep, otherStep);
				if(!thisStep.equals(otherStep)) {
					return false;
				}
			}
			
			return true;			
		},
		
		hashCode: function() {
			return this.toString();
		},
		
		// a equals b = a startsWidth b && a.len = b.len
		equals: function(other) {
			var n = this.steps.length;
			if(n != other.steps.length) {
				return false;
			}
			
			var result = this.startsWith(other);
			return result;
		},
	
	
		// Create a new path with a step appended
		// TODO Maybe replace with clone().append() - no, because then the path would not be immutable anymore
		copyAppendStep: function(step) {
			var newSteps = this.steps.slice(0);
			newSteps.push(step);
			
			var result = new ns.Path(newSteps);
			
			return result;
		},
		
		toJson: function() {
			var result = [];
			var steps = this.steps;
			
			for(var i = 0; i < steps.length; ++i) {
				var step = steps[i];
				
				var stepJson = step.toJson(); 
				result.push(stepJson);
			}
			
			return result;
		},
		
		/*
		 * 
		 * TODO Make result distinct
		 */
		getPropertyNames: function() {
			var result = [];
			var steps = this.steps;
			
			for(var i = 0; i < steps.length; ++i) {
				var step = steps[i];
				var propertyName = step.getPropertyName();
				result.push(propertyName);
			}
			
			return result;
		}
	});

	ns.Path.classLabel = 'Path';
	
	/**
	 * Input must be a json array of json for the steps.
	 * 
	 */
	ns.Path.fromJson = function(json) {
		var steps = [];
		
		for(var i = 0; i < json.length; ++i) {
			var item = json[i];
			
			var step = ns.Step.fromJson(item);
			
			steps.push(step);
		}
		
		var result = new ns.Path(steps);
		return result;
	};

	
	ns.Path.parse = function(pathStr) {
		pathStr = _(pathStr).trim();
		
		var items = pathStr.length !== 0 ? pathStr.split(" ") : [];		
		var steps = _.map(items, function(item) {
			
			if(item === "<^") {
				return new ns.StepFacet(-1);
			} else if(item === "^" || item === ">^") {
				return new ns.StepFacet(1);
			} else {
				return ns.Step.parse(item);
			}
		});
		
		//console.log("Steps for pathStr " + pathStr + " is ", steps);
		
		var result = new ns.Path(steps);
		
		return result;
	};
	
	
	ns.PathUtils = {
        parsePathSpec: function(pathSpec) {
            var result = (pathSpec instanceof ns.Path) ? pathSpec : ns.Path.parse(pathSpec); 

            return result;
        }        	        
	};

	/**
	 * Combines a path with a direction
	 * 
	 * Used for the facet tree service, to specify for each path whether to fetch the 
	 * ingoing or outgoing properties (or both)
	 */
	ns.PathHead = Class.create({
	    initialize: function(path, inverse) {
	        this.path = path;
	        this.inverse = inverse ? true : false;
	    },
	    
	    getPath: function() {
	        return this.path;
	    },
	    
	    isInverse: function() {
	        return this.inverse;
	    },
	    
	    equals: function(that) {
	        var pathEquals = this.path.equals(that.path);
	        var inverseEquals = this.inverse = that.inverse;
	        var result = pathEquals && inverseEquals;
	        return result;
	    }
	});
	
	
	// @Deprecated - Do not use anymore
	ns.Path.fromString = ns.Path.parse;
	
})();
(function() {
	
	var sparql = Jassa.sparql;
	
	var rdf = Jassa.rdf;

	var ns = Jassa.facete;

	
	/**
	 * Returns a new array of those triples, that are directly part of the given array of elements.
	 * 
	 */
	ns.getElementsDirectTriples = function(elements) {
		var result = [];
		for(var i = 0; i < elements.length; ++i) {
			var element = elements[i];
			if(element instanceof sparql.ElementTriplesBlock) {
				result.push.apply(result, element.triples);
			}
		}
		
		return result;
	};
	
	
	/**
	 * Combines the elements of two concepts, yielding a new concept.
	 * The new concept used the variable of the second argument.
	 * 
	 */
	ns.ConceptUtils = {
		createCombinedConcept: function(baseConcept, tmpConcept) {
			// TODO The variables of baseConcept and tmpConcept must match!!!
			// Right now we just assume that.
			
			
			// Check if the concept of the facetFacadeNode is empty
			var tmpElements = tmpConcept.getElements();
			var baseElement = baseConcept.getElement();
			
			// Small workaround (hack) with constraints on empty paths:
			// In this case, the tmpConcept only provides filters but
			// no triples, so we have to include the base concept
			var hasTriplesTmp = tmpConcept.hasTriples();
			
			var e;
			if(tmpElements.length > 0) {
	
				if(hasTriplesTmp && baseConcept.isSubjectConcept()) {
					e = tmpConcept.getElement();
				} else {
					var baseElements = baseConcept.getElements();
	
					var newElements = [];
					newElements.push.apply(newElements, baseElements);
					newElements.push.apply(newElements, tmpElements);
					
					e = new sparql.ElementGroup(newElements);
				}
			} else {
				e = baseElement;
			}
			
			// FIXME: ConceptInt class is not defined
			var concept = new ns.ConceptInt(e, tmpConcept.getVariable());
	
			return concept;
		},
		
		createSubjectConcept: function(subjectVar) {
			
			//var s = sparql.Node.v("s");
			var s = subjectVar;
			var p = sparql.Node.v("_p_");
			var o = sparql.Node.v("_o_");
			
			var conceptElement = new sparql.ElementTriplesBlock([new rdf.Triple(s, p, o)]);

			//pathManager = new facets.PathManager(s.value);
			
			var result = new ns.Concept(conceptElement, s);

			return result;
		},
		
		
		/**
		 * Creates a query based on the concept
		 * TODO: Maybe this should be part of a static util class?
		 */
		createQueryList: function(concept) {
			var result = new sparql.Query();
			result.setDistinct(true);
			
			result.getProject().add(concept.getVar());
			var resultElements = result.getElements();
			var conceptElements = concept.getElements();

			resultElements.push.apply(resultElements, conceptElements);
			
			return result;
		},

		
		createQueryCount: function(concept, outputVar, scanLimit) {
		    var result = ns.QueryUtils.createQueryCount(concept.getElements(), scanLimit, concept.getVar(), outputVar, null, true);
		    
		    return result;
		},
		
        createQueryCountNotAsConciseAsPossible: function(concept, outputVar) {
            /*
            var subQuery = new sparql.Query();
            
            subQuery.getProject().add(concept.getVar());
            subQuery.setDistinct(true);

            var subQueryElements = subQuery.getElements();
            var conceptElements = concept.getElements();
            subQueryElements.push.apply(subQueryElements, conceptElements)
            */
            
            var subQuery = ns.ConceptUtils.createQueryList(concept);
            
            var result = new sparql.Query();
            result.getProject().add(outputVar, new sparql.E_Count());

            result.getElements().push(subQuery);
 
            return result;          
        },

		createQueryCountDoesNotWorkWithVirtuoso: function(concept, outputVar) {
			var result = new sparql.Query();
			
			result.getProject().add(outputVar, new sparql.E_Count(new sparql.ExprVar(concept.getVar()), true));

			var resultElements = result.getElements();
			var conceptElements = concept.getElements();
			resultElements.push.apply(resultElements, conceptElements);

			return result;			
		}
	};

	

	/**
	 * A class for holding information which variable
	 * of an element corresponds to the property and
	 * which to the 
	 * 
	 * ({?s ?p ?o}, ?p, ?o)
	 * 
	 * 
	 */
	ns.FacetConcept = Class.create({
		initialize: function(elements, facetVar, facetValueVar) {
			this.elements = elements;
			this.facetVar = facetVar;
			this.facetValueVar = facetValueVar;
		},
		
		getElements: function() {
			return this.elements;
		},
		
		getFacetVar: function() {
			return this.facetVar;
		},
		
		getFacetValueVar: function() {
			return this.facetValueVar;
		},
		
		toString: function() {
			var result = "FacetConcept: ({" + this.elements.join(", ") + "}, " + this.facetVar + ", " + this.facetValueVar + ")";
			return result;
		}
	});


	/**
	 * A concept is pair comprised of a sparql graph
	 * pattern (referred to as element) and a variable.
	 * 
	 */
	ns.Concept = Class.create({
		
		classLabel: 'Concept',
		
		initialize: function(element, variable) {
			this.element = element;
			this.variable = variable;
		},
		
		toJson: function() {
			var result = {
					element: JSON.parse(JSON.stringify(this.element)),
					variable: this.variable
			};
			
			return result;
		},
		
		getElement: function() {
			return this.element;
		},
		
		hasTriples: function() {
			var elements = this.getElements();
			var triples = ns.getElementsDirectTriples(elements);
			var result = triples.length > 0;
			
			return result;
		},
		
		/**
		 * Convenience method to get the elements as an array.
		 * Resolves sparql.ElementGroup
		 * 
		 */
		getElements: function() {
			var result;
			
			if(this.element instanceof sparql.ElementGroup) {
				result = this.element.elements;
			} else {
				result = [ this.element ];
			}
			
			return result;
		},

		getVar: function() {
			return this.variable;				
		},
		
		getVariable: function() {
			
			if(!this.warningShown) {				
				//console.log('[WARN] Deprecated. Use .getVar() instead');
				this.warningShown = true;
			}
			
			return this.getVar();
		},
		
		toString: function() {
			return "" + this.element + "; " +  this.variable;
		},
		
		// Whether this concept is isomorph to (?s ?p ?o, ?s)
		isSubjectConcept: function() {
			var result = false;
			
			var v = this.variable;
			var e = this.element;
			
			if(e instanceof sparql.ElementTriplesBlock) {
				var ts = e.triples;
				
				if(ts.length === 1) {
					var t = ts[0];
					
					var s = t.getSubject();
					var p = t.getProperty();
					var o = t.getObject();
					
					result = v.equals(s) && p.isVariable() && o.isVariable();
				}
			}

			
			return result;
		},

		combineWith: function(that) {
			var result = ns.createCombinedConcept(this, that);
			return result;
		},
		
		createOptimizedConcept: function() {
			var element = this.getElement();
			var newElement = element.flatten();

      // FIXME: ConceptInt class is not defined
			var result = new ns.ConceptInt(newElement, this.variable);

			return result;
		},
		

		
		/**
		 * Remove unnecessary triple patterns from the element:
		 * Example:
		 * ?s ?p ?o
		 * ?s a :Person
		 *  
		 *  We can remove ?s ?p ?o, as it does not constraint the concepts extension.
		 */
		getOptimizedElement: function() {

			/* This would become a rather complex function, the method isSubjectConcept is sufficient for our use case */
			
			
		}
	});


	//ns.Concept.classLabel = 'Concept';


	/**
	 * Array version constructor
	 * 
	 */
	ns.Concept.createFromElements = function(elements, variable) {
		var element;
		if(elements.length == 1) {
			element = elements[0];
		} else {
			element = new sparql.ElementGroup(elements);
		}
		
		var result = new ns.Concept(element, variable);
		
		return result;
	};

	
})();

(function() {

    
    var sparql = Jassa.sparql;
    
	var ns = Jassa.facete;

	
	/**
	 * Wrapper that returns the element of 'factored' concepts
	 */
	ns.ElementFactoryConceptFactory = Class.create(sparql.ElementFactory, {
	    initialize: function(conceptFactory) {
	        this.conceptFactory = conceptFactory;
	    },
	    
	    createElement: function() {
	        var concept = this.conceptFactory.createConcept();
	        var result = concept ? concept.getElement() : null;
	        
	        return result;
	    }
	});
	    

	
	ns.ConceptFactory = Class.create({
		createConcept: function() {
			throw "not overridden";
		}
	});


	ns.ConceptFactoryConst = Class.create(ns.ConceptFactory, {
		initialize: function(concept) {
			this.concept = concept;
		},
		
		getConcept: function() {
			return this.concept;
		},
		
		setConcept: function(concept) {
			this.concept = concept;
		},
		
		createConcept: function() {
			return this.concept;
		}
	});
		
	ns.ConceptFactoryFacetConfig = Class.create(ns.ConceptFactory, {
	    initialize: function(facetConfig, path, excludeSelfConstraints) {
	        this.facetConfig = facetConfig;
	        this.path = path || new facete.Path();
	        this.excludeSelfConstraints = excludeSelfConstraints;
	    },
	    
	    createConcept: function() {
	        var facetConceptGenerator = ns.FaceteUtils.createFacetConceptGenerator(this.facetConfig);
	        var result = facetConceptGenerator.createConceptResources(this.path, this.excludeSelfConstraints);	        
	        return result;
	    }
	});

	ns.ConceptFactoryFacetTreeConfig = Class.create(ns.ConceptFactory, {
        initialize: function(facetTreeConfig, path, excludeSelfConstraints) {
            this.facetTreeConfig = facetTreeConfig;
            this.path = path || new facete.Path();
            this.excludeSelfConstraints = excludeSelfConstraints;
        },
        
        setPath: function(path) {
            this.path = path;
        },
        
        getPath: function() {
            return this.path;
        },
        
        getFacetTreeConfig: function() {
            return this.facetTreeConfig;
        },
        
        setFacetTreeConfig: function(facetTreeConfig) {
            this.facetTreeConfig = facetTreeConfig;
        },

        isExcludeSelfConstraints: function() {
            return this.excludeSelfConstraints;
        },
        
        setExcludeSelfConstraints: function(excludeSelfConstraints) {
            this.excludeSelfConstraints = excludeSelfConstraints;
        },
        
        createConcept: function() {
            var facetConfig = this.facetTreeConfig.getFacetConfig();
            
            var facetConceptGenerator = ns.FaceteUtils.createFacetConceptGenerator(facetConfig);
            var result = facetConceptGenerator.createConceptResources(this.path, this.excludeSelfConstraints);          
            return result;
        }	
	});
	
	
	/*
    ns.ConceptFactoryFacetService = Class.create(ns.ConceptFactory, {
        initialize: function(facetService) {
            this.facetService = facetService;
        },
        
        createConcept: function() {
            var result = this.facetService.createConceptFacetValues(new facete.Path());
            return result;
        }
    });
	 */

})();
(function() {
	
	var ns = Jassa.facete;
	
	ns.FacetNodeFactory = Class.create({
		createFacetNode: function() {
			throw "Override me";
		}
	});
	
	
	ns.FacetNodeFactoryConst = Class.create(ns.FacetNodeFactory, {
		initialize: function(facetNode) {
			this.facetNode = facetNode;
		},

		createFacetNode: function() {
			return this.facetNode;
		}
	});
	
})();(function() {
	
	var ns = Jassa.facete;

	ns.QueryFactory = Class.create({
		createQuery: function() {
			throw "Not overridden";
		}
	});


	/**
	 * A query factory that injects facet constraints into an arbitrary query returned by
	 * a subQueryFactory.
	 * 
	 * 
	 * 
	 */
	ns.QueryFactoryFacets = Class.create(ns.QueryFactory, {
		initialize: function(subQueryFactory, rootFacetNode, constraintManager) {
			this.subQueryFactory = subQueryFactory;
			this.rootFacetNode = rootFacetNode;
			this.constraintManager = constraintManager ? constraintManager : new ns.ConstraintManager();
		},
	
		getRootFacetNode: function() {
			return this.rootFacetNode;
		},
			
		getConstraintManager: function() {
			return this.constraintManager;
		},
			
		createQuery: function() {
			var query = this.subQueryFactory.createQuery();

			if(query == null) {
				return null;
			}
			
			//var varsMentioned = query.getVarsMentioned();
			var varsMentioned = query.getProject();//.getVarList();
			

			var varNames = _.map(varsMentioned, function(v) {
				return v.value;
			});
			
			
			var elements = this.constraintManager.createElements(this.rootFacetNode);
			query.elements.push.apply(query.elements, elements);
			
			return query;
		}	
	});


	ns.QueryFactoryFacets.create = function(subQueryFactory, rootVarName, generator) {
    // FIXME: facets.GenSym cannot be resolved
		generator = generator ? generator : new facets.GenSym("fv");
		var rootFacetNode = facets.FacetNode.createRoot(rootVarName, generator);
		
		var result = new ns.QueryFactoryFacets(subQueryFactory, rootFacetNode);

		return result;
	};

	
	
//	ns.ConstraintNode = function(facetNode, parent) {
//		this.facetNode = facetNode;
//		this.parent = parent;
//		
//		this.idToConstraint = {};
//	};
//

//	ns.SparqlDataflow = function(query, fnPostProcessor) {
//		this.query = query;
//		this.fnPostProcessor = fnPostProcessor;
//	};
//	
//	ns.SparqlDataflow.prototype = {
//		createDataProvider: function(sparqlServer) {
//
//			var executor = new facets.ExecutorQuery(sparqlService, query);
//			var result = new DataProvider(executor);
//			
//			// TODO Attach the postProcessing workflow
//			
//			return result;
//		}
//	};	
	
//	ns.ElementDesc = Class.create({
//		initialize: function(element, focusVar, facetVar) {
//			this.element = element;
//			this.focusVar = focusVar;
//			this.facetVar = facetVar;
//		},
//
//		createConcept: function() {
//			var result = new facets.ConceptInt(this.element, this.facetVar);
//			return result;
//		},
//		
//		createQueryFacetValueCounts: function() {
//			var element = this.element;
//			
//			var focusVar = this.focusVar;
//			var facetVar = this.facetVar;
//
//			var sampleLimit = null;
//							
//			countVar = countVar ? countVar : sparql.Node.v("__c");
//			var result = queryUtils.createQueryCount(element, sampleLimit, focusVar, countVar, [facetVar], options);
//			
//			return result;
//		},
//		
//		createQueryFacetValues: function() {
//			var element = this.element;
//							
//			var focusVar = this.focusVar;
//			var facetVar = this.facetVar;
//
//			var sampleLimit = null;
//			
//			countVar = countVar ? countVar : sparql.Node.v("__c");
//			var result = queryUtils.createQueryCountDistinct(element, sampleLimit, focusVar, countVar, [facetVar], options);
//
//			return result;
//		}
//	});
	
	
})();
(function() {
	
    var util = Jassa.util;
    
	var ns = Jassa.facete;
	
	
	/**
	 * Not used yet; its only here as an idea.
	 * 
	 * A specification based on a sparql expression.
	 * The variables of this expression can be either mapped to paths or to values.  
	 * 
	 * These mappings must be disjoint.
	 * 
	 */
	
//	ns.ConstraintSpecExpr = Class.create(ns.ConstraintSpec, {
//        classLabel: 'jassa.facete.ConstraintSpecExpr',
//
//		/**
//		 * expr: sparql.Expr
//		 * varToPath: util.Map<Var, Path>
//		 * varToNode: sparql.Binding
//		 */
//		initialize: function(expr, varToPath, varToNode) {
//			this.expr = expr;
//			this.varToPath = varToPath;
//			this.varToNode = varToNode;
//		},
//		
//		getPaths: function() {
//			// extract the paths from varToPath
//		}
//	});
	
//	ns.ConstraintSpecBBox = Class.create(ns.ConstraintSpecSinglePath, {
//		
//	});
	
	
	
})();

(function() {
	
	var vocab = Jassa.vocab;
	var sparql = Jassa.sparql;
	var xsd = Jassa.xsd;
	var ns = Jassa.facete;

    /**
     * ConstraintSpecs can be arbitrary objects, however they need to expose the
     * declared paths that they affect.
     * DeclaredPaths are the ones part of spec, affectedPaths are those after considering the constraint's sparql element. 
     * 
     */
    ns.Constraint = Class.create({
        getName: function() {
            console.log('[ERROR] Override me');         
            throw 'Override me';
        },
        
        getDeclaredPaths: function() {
            console.log('[ERROR] Override me');
            throw 'Override me';
        },
        
        createElementsAndExprs: function(facetNode) {
            console.log('[ERROR] Override me');
            throw 'Override me';            
        },
        
        equals: function() {
              console.log('[ERROR] Override me');
            throw 'Override me';
        },
        
        hashCode: function() {
            console.log('[ERROR] Override me');
            throw 'Override me';
        }
    });
    

    /**
     * The class of constraint specs that are only based on exactly one path.
     * 
     * Offers the method getDeclaredPath() (must not return null)
     * Do not confuse with getDeclaredPaths() which returns the path as an array
     * 
     */
    ns.ConstraintBasePath = Class.create(ns.Constraint, {
        initialize: function(name, path) {
            this.name = name;
            this.path = path;
        },
        
        getName: function() {
            return this.name;
        },
        
        getDeclaredPaths: function() {
            return [this.path];
        },
        
        getDeclaredPath: function() {
            return this.path;
        }
    });


    /*
    ns.ConstraintBasePath = Class.create(ns.ConstraintBaseSinglePath, {
        initialize: function($super, name, path) {
            $super(name, path);
        }
    });
    */
    
    ns.ConstraintBasePathValue = Class.create(ns.ConstraintBasePath, {
        //classLabel: 'jassa.facete.ConstraintSpecPathValue',

        initialize: function($super, name, path, value) {
            $super(name, path);
            this.value = value;
        },

        getValue: function() {
            return this.value;
        },
        
        equals: function(that) {
            if(!that instanceof ns.ConstraintBasePathValue) {
                return false;
            }
            
            var a = this.name == that.name;
            var b = this.path.equals(that.path);
            var c = this.value.equals(that.value);
            
            var r = a && b &&c;
            return r;
        },
        
        hashCode: function() {
            var result = util.ObjectUtils.hashCode(this, true);
            return result;
        }
    });
	

    ns.ConstraintExists = Class.create(ns.ConstraintBasePath, {
        classLabel: 'jassa.facete.ConstraintExists',

        initialize: function($super, path) {
            $super('exists', path);
        },
        
        createElementsAndExprs: function(facetNode) {
            var result = ns.ConstraintUtils.createConstraintExists(facetNode, this.path);
            return result;
        }
    });

    
    ns.ConstraintLang = Class.create(ns.ConstraintBasePathValue, {
        classLabel: 'jassa.facete.ConstraintLang',
        
        initialize: function($super, path, langStr) {
            $super('lang', path, langStr);
        },
        
        createElementsAndExprs: function(facetNode) {
            var result = ns.ConstraintUtils.createConstraintLang(facetNode, this.path, this.value);
            return result;
        }
    });

    ns.ConstraintEquals = Class.create(ns.ConstraintBasePathValue, {
        classLabel: 'jassa.facete.ConstraintEquals',
        
        initialize: function($super, path, node) {
            $super('equals', path, node);
        },
        
        createElementsAndExprs: function(facetNode) {
            var result = ns.ConstraintUtils.createConstraintEquals(facetNode, this.path, this.value);
            return result;
        }
    });
    
    ns.ConstraintRegex = Class.create(ns.ConstraintBasePathValue, {
        classLabel: 'jassa.facete.ConstraintRegex',
        
        initialize: function($super, path, regexStr) {
            $super('regex', path, regexStr);
        },
        
        createElementsAndExprs: function(facetNode) {
            var result = ns.ConstraintUtils.createConstraintRegex(facetNode, this.path, this.regexStr);
            return result;
        }
    });
    
	
	
	// The three basic constraint types: mustExist, equals, and range.
	// Futhermore: bbox (multiple implementations possible, such as lat long or wktLiteral based)
	
	ns.ConstraintElementFactory = Class.create({
		createElementsAndExprs: function(rootFacetNode, constraintSpec) {
		    console.log('[ERROR] Override me');
			throw "Override me";
		}
	});

	
//	ns.ConstraintElementFactoryTriplesBase = Class.create(ns.ConstraintElementFactory, {
//		createElementsAndExprs: function() {
//			
//		},
//		
//		createTriplesAndExprs: function() {
//			throw "Override me";
//		}
//	});
/*
	ns.ConstraintElementFactoryExist = Class.create(ns.ConstraintElementFactory, {
		createElementsAndExprs: function(rootFacetNode, constraintSpec) {
		    var result = ns.ConstraintUtils.createExists(rootFacetNode, constraint)
		}
	});
*/

	/*
    ns.ConstraintElementFactoryLang = Class.create(ns.ConstraintElementFactory, {
        createElementsAndExprs: function(rootFacetNode, constraintSpec) {
            var facetNode = rootFacetNode.forPath(constraintSpec.getDeclaredPath());

            var pathVar = facetNode.getVar();
            var exprVar = new sparql.ExprVar(pathVar);

            var elements = sparql.ElementUtils.createElementsTriplesBlock(facetNode.getTriples());

            // NOTE Value is assumed to be node holding a string, maybe check it here
            var val = constraintSpec.getValue().getLiteralValue();

            var exprs = [new sparql.E_LangMatches(new sparql.E_Lang(exprVar), val)];
            
            var result = new ns.ElementsAndExprs(elements, exprs);
            
            //console.log('constraintSpec.getValue() ', constraintSpec.getValue());
            return result;
        }
    });
*/
	/*
    ns.ConstraintElementFactoryRegex = Class.create(ns.ConstraintElementFactory, {
        createElementsAndExprs: function(rootFacetNode, constraintSpec) {
            var facetNode = rootFacetNode.forPath(constraintSpec.getDeclaredPath());

            var pathVar = facetNode.getVar();
            var exprVar = new sparql.ExprVar(pathVar);
            
            //var elements = [new sparql.ElementTriplesBlock(facetNode.getTriples())];
            var elements = sparql.ElementUtils.createElementsTriplesBlock(facetNode.getTriples());
    
            //var valueExpr = constraintSpec.getValue();
            //var valueExpr = sparql.NodeValue.makeNode(constraintSpec.getValue());
            
            // NOTE Value is assumed to be node holding a string, maybe check it here
            var val = constraintSpec.getValue().getLiteralValue();
    
    
            var exprs = [new sparql.E_Regex(exprVar, val, 'i')];
            
            var result = new ns.ElementsAndExprs(elements, exprs);
            
            //console.log('constraintSpec.getValue() ', constraintSpec.getValue());
            return result;
        }
    });
*/
	
	/**
	 * constraintSpec.getValue() must return an instance of sparql.NodeValue
	 * 
	 */
/*	
	ns.ConstraintElementFactoryEqual = Class.create(ns.ConstraintElementFactory, {
		createElementsAndExprs: function(rootFacetNode, constraintSpec) {
			var facetNode = rootFacetNode.forPath(constraintSpec.getDeclaredPath());

			var pathVar = facetNode.getVar();
			var exprVar = new sparql.ExprVar(pathVar);
			
			//var elements = [new sparql.ElementTriplesBlock(facetNode.getTriples())];
			var elements = sparql.ElementUtils.createElementsTriplesBlock(facetNode.getTriples());
	
			//var valueExpr = constraintSpec.getValue();
			var valueExpr = sparql.NodeValue.makeNode(constraintSpec.getValue());
	
	
			var exprs = [new sparql.E_Equals(exprVar, valueExpr)];
			
			var result = new ns.ElementsAndExprs(elements, exprs);
			
			//console.log('constraintSpec.getValue() ', constraintSpec.getValue());
			return result;
		}
	});
*/	
	
//	ns.ConstraintElementSparqlExpr = Class.create(ns.ConstraintElementFactory, {
//		createElement: function(rootFacetNode, constraintSpec) {
//			
//		}
//	});


	ns.ConstraintElementFactoryBBoxRange = Class.create(ns.ConstraintElementFactory, {
		initialize: function() {
			this.stepX = new ns.Step(vocab.wgs84.str.lon);
			this.stepY = new ns.Step(vocab.wgs84.str.lat);
		},
		
		createElementsAndExprs: function(rootFacetNode, spec) {
			var facetNode = rootFacetNode.forPath(spec.getPath());
			var bounds = spec.getValue();
			
			var fnX = facetNode.forStep(this.stepX);
			var fnY = facetNode.forStep(this.stepY);

			var triplesX = fnX.getTriples();		
			var triplesY = fnY.getTriples();
			
			var triples = sparql.util.mergeTriples(triplesX, triplesY);
			
			//var element = new sparql.ElementTriplesBlock(triples);
			
			// Create the filter
			var varX = fnX.getVar();
			var varY = fnY.getVar();
			
			var expr = ns.createWgsFilter(varX, varY, this.bounds, xsd.xdouble);
			
			var elements = [new sparql.ElementTriplesBlock(triples)];
			var exprs = [expr];
			
			// Create the result
			var result = new ns.ElementsAndExprs(elements, exprs);
	
			return result;
		}		
	});
	
	

	/**
	 * constraintManager.addConstraint(new ConstraintBBox(path, bounds))
	 */	
//	ns.ConstraintBBox = Class.create(ns.PathExpr, {
//		initialize: function(path, bounds) {
//			
//		}
//	});
//	
//	
//	ns.ConstraintSparqlTransformer = Class.create({
//		
//	});
//	
	
	
	/*
	 * Wgs84 
	 */
		
	// TODO Should there be only a breadcrumb to the resource that carries lat/long
	// Or should there be two breadcrumbs to lat/long directly???
//	ns.PathConstraintWgs84 = function(pathX, pathY, bounds) {
//		this.pathX = pathX;
//		this.pathY = pathY;
//		this.bounds = bounds;
//
//		//this.long = "http://www.w3.org/2003/01/geo/wgs84_pos#long";
//		//this.lat = "http://www.w3.org/2003/01/geo/wgs84_pos#lat";
//	};
//	
//	
//	/**
//	 * This is a factory for arbitrary bbox constraints at a preset path.
//	 * 
//	 * @param path
//	 * @returns {ns.ConstraintWgs84.Factory}
//	 */
//	ns.PathConstraintWgs84.Factory = function(path, pathX, pathY) {
//		this.path = path;
//		this.pathX = pathX;
//		this.pathY = pathY;
//	};
//	
//	ns.PathConstraintWgs84.Factory.create = function(path) {
//		path = path ? path : new facets.Path();
//		
//		var pathX = path.copyAppendStep(new facets.Step(geo.lon.value)); //new ns.Breadcrumb.fromString(breadcrumb.pathManager, breadcrumb.toString() + " " + geo.long.value);
//		var pathY = path.copyAppendStep(new facets.Step(geo.lat.value)); ///new ns.Breadcrumb.fromString(breadcrumb.pathManager, breadcrumb.toString() + " " + geo.lat.value);
//
//		var result = new ns.PathConstraintWgs84.Factory(path, pathX, pathY);
//		return result;
//	};
//	
//	ns.PathConstraintWgs84.Factory.prototype = {
//		getPath: function() {
//			return this.path;
//		},
//	
//		/**
//		 * Note: bounds may be null
//		 */
//		createConstraint: function(bounds) {
//			return new ns.PathConstraintWgs84(this.pathX, this.pathY, bounds);
//		}
//	
//
////		getTriples: function(pathManager) {
////			var breadcrumbX = new facets.Breadcrumb(pathManager, this.pathX); 
////			var breadcrumbY = new facets.Breadcrumb(pathManager, this.pathY);
////			
////			var triplesX = breadcrumbX.getTriples();		
////			var triplesY = breadcrumbY.getTriples();
////			
////			var result = sparql.mergeTriples(triplesX, triplesY);
////			
////			return result;		
////		}
//	};
//
//	
//	ns.PathConstraintWgs84.prototype = {
//		createConstraintElementNewButNotUsedYet: function(breadcrumb) {
//			var path = breadcrumb.getPath();
//			
//			var pathX = path.copyAppendStep(new facets.Step(geo.lon.value));
//			var pathY = path.copyAppendStep(new facets.Step(geo.lat.value));
//	
//			// Create breadcrumbs
//			var breadcrumbX = new facets.Breadcrumb(pathManager, pathX); 
//			var breadcrumbY = new facets.Breadcrumb(pathManager, pathY);
//	
//			// Create the graph pattern
//			var triplesX = breadcrumbX.getTriples();		
//			var triplesY = breadcrumbY.getTriples();
//			
//			var triples = sparql.mergeTriples(triplesX, triplesY);
//			
//			//var element = new sparql.ElementTriplesBlock(triples);
//			
//			// Create the filter
//			var vX = breadcrumbX.getTargetVariable();
//			var vY = breadcrumbY.getTargetVariable();
//			
//			var expr = ns.createWgsFilter(vX, vY, this.bounds, xsd.xdouble);
//	
//			// Create the result
//			var result = new ns.ConstraintElement(triples, expr);
//	
//			return result;
//		},
//
//		getPath: function() {
//			return this.path;
//		},
//		
//		createElements: function(facetNode) {
//			var result = [];
//
//			// Create breadcrumbs
//			var facetNodeX = facetNode.forPath(this.pathX); 
//			var facetNodeY = facetNode.forPath(this.pathY);
//	
//			// Create the graph pattern
//			var triplesX = facetNodeX.getTriples();		
//			var triplesY = facetNodeY.getTriples();
//			
//			var triples = sparql.mergeTriples(triplesX, triplesY);
//
//			result.push(new sparql.ElementTriplesBlock(triples));
//			
//			if(!this.bounds) {
//				return result;
//			}
//			
//			//var element = new sparql.ElementTriplesBlock(triples);
//			
//			// Create the filter
//			var vX = facetNodeX.getVar();
//			var vY = facetNodeY.getVar();
//			
//			var expr = ns.createWgsFilter(vX, vY, this.bounds, xsd.xdouble);
//	
//			result.push(new sparql.ElementFilter([expr]));
//			
//			// Create the result
//			//var result = new ns.ConstraintElement(triples, expr);
//			return result;
//		}
//
////		createConstraintElement: function(pathManager) {
////			// Create breadcrumbs
////			var breadcrumbX = new facets.Breadcrumb(pathManager, this.pathX); 
////			var breadcrumbY = new facets.Breadcrumb(pathManager, this.pathY);
////	
////			// Create the graph pattern
////			var triplesX = breadcrumbX.getTriples();		
////			var triplesY = breadcrumbY.getTriples();
////			
////			var triples = sparql.mergeTriples(triplesX, triplesY);
////			
////			//var element = new sparql.ElementTriplesBlock(triples);
////			
////			// Create the filter
////			var vX = breadcrumbX.getTargetVariable();
////			var vY = breadcrumbY.getTargetVariable();
////			
////			var expr = ns.createWgsFilter(vX, vY, this.bounds, xsd.xdouble);
////	
////			// Create the result
////			var result = new ns.ConstraintElement(triples, expr);
////			return result;
////		}
//	};
//
	
})();(function() {
	
    var vocab = Jassa.vocab;
    var sparql = Jassa.sparql;
    
    var ns = Jassa.facete;
	
	
	ns.ElementsAndExprs = Class.create({
		initialize: function(elements, exprs) {
			this.elements = elements;
			this.exprs = exprs;
		},
		
		getElements: function() {
			return this.elements;
		},
		
		getExprs: function() {
			return this.exprs;
		},
		
		toElements: function() {
		    var result = [];
		    
		    var filterElements = sparql.ElementUtils.createFilterElements(this.exprs);

		    result.push.apply(result, this.elements);
		    result.push.apply(result, filterElements);
		    
		    return result;
		}
	});

	
    
    ns.ConstraintUtils = {
        createConstraintExists: function(rootFacetNode, path) {

            var facetNode = rootFacetNode.forPath(path);
            var elements = sparql.ElementUtils.createElementsTriplesBlock(facetNode.getTriples());
            var triplesAndExprs = new ns.ElementsAndExprs(elements, []);
            
            return result;
        },
        
        createConstraintLang: function(rootFacetNode, path, langStr) {
            var facetNode = rootFacetNode.forPath(path);

            var pathVar = facetNode.getVar();
            var exprVar = new sparql.ExprVar(pathVar);

            var elements = sparql.ElementUtils.createElementsTriplesBlock(facetNode.getTriples());

            // NOTE Value is assumed to be node holding a string, maybe check it here
            var val = langStr; //constraintSpec.getValue().getLiteralValue();

            var exprs = [new sparql.E_LangMatches(new sparql.E_Lang(exprVar), val)];
            
            var result = new ns.ElementsAndExprs(elements, exprs);
            
            //console.log('constraintSpec.getValue() ', constraintSpec.getValue());
            return result;
        },
        
        createConstraintRegex: function(rootFacetNode, path, str) {
            var facetNode = rootFacetNode.forPath(path);

            var pathVar = facetNode.getVar();
            var exprVar = new sparql.ExprVar(pathVar);
            
            //var elements = [new sparql.ElementTriplesBlock(facetNode.getTriples())];
            var elements = sparql.ElementUtils.createElementsTriplesBlock(facetNode.getTriples());
    
            //var valueExpr = constraintSpec.getValue();
            //var valueExpr = sparql.NodeValue.makeNode(constraintSpec.getValue());
            
            // NOTE Value is assumed to be node holding a string, maybe check it here
            var val = str; //constraintSpec.getValue().getLiteralValue();
    
    
            var exprs = [new sparql.E_Regex(exprVar, val, 'i')];
            
            var result = new ns.ElementsAndExprs(elements, exprs);
            
            //console.log('constraintSpec.getValue() ', constraintSpec.getValue());
            return result;
        },
        
        createConstraintEquals: function(rootFacetNode, path, node) {
            var facetNode = rootFacetNode.forPath(path);

            var pathVar = facetNode.getVar();
            var exprVar = new sparql.ExprVar(pathVar);
            
            //var elements = [new sparql.ElementTriplesBlock(facetNode.getTriples())];
            var elements = sparql.ElementUtils.createElementsTriplesBlock(facetNode.getTriples());
    
            //var valueExpr = constraintSpec.getValue();
            var valueExpr = sparql.NodeValue.makeNode(node); //constraintSpec.getValue());
    
    
            var exprs = [new sparql.E_Equals(exprVar, valueExpr)];
            
            var result = new ns.ElementsAndExprs(elements, exprs);
            
            //console.log('constraintSpec.getValue() ', constraintSpec.getValue());
            return result;
        }
    };
    	
	
	/**
	 * @Deprecated in favor of the more generic ElementsAndExprs
	 * 
	 * A class that - as the name states - combines triples and exprs.
	 *
	 *
	 *
	 * Additionally provides a createElements to turn its state into an array of sparql elements.
	 * 
	 */
//	ns.TriplesAndExprs = Class.create({
//		initialize: function(triples, exprs) {
//			this.triples = triples;
//			this.exprs = exprs;
//		},
//		
//		getTriples: function() {
//			return this.triples;
//		},
//		
//		getExprs: function() {
//			return this.exprs;
//		},
//		
//		createElements: function() {
//			var triples = this.triples;
//			var exprs = this.exprs;
//
//			var result = [];
//
//			if(triples && triples.length > 0) {
//				result.push(new sparql.ElementTriplesBlock(triples));
//			}
//			
//			if(exprs && exprs.length > 0) {
//				result.push(new sparql.ElementFilter(exprs))
//				/*
//				var filters = _(exprs).map(function(expr) {
//					return new sparql.ElementFilter(expr);
//				});
//				*/
//			}
//			
//			return result;
//		}
//	});
	
	
})();(function() {

	var util = Jassa.util;
	var sparql = Jassa.sparql;
	
	var ns = Jassa.facete;


	/**
	 * TODO Rename to constraint list
	 * 
	 * A constraint manager is a container for ConstraintSpec objects.
	 * 
	 * @param cefRegistry A Map<String, ConstraintElementFactory>
	 */
	ns.ConstraintManager = Class.create({
	    classLabel: 'jassa.facete.ConstraintList',
	    
		initialize: function(constraints) {
			
//			if(!cefRegistry) {
//				cefRegistry = ns.createDefaultConstraintElementFactories(); 
//			}
			
			//this.cefRegistry = cefRegistry;
			this.constraints = constraints || [];
		},
		
		/**
		 * Returns a new constraintManager with a new array of the original constraints
		 */
		shallowClone: function() {
		    var result = new ns.ConstraintManager(this.constraints.slice(0));
		    return result;
		},

		/**
		 * Yields all constraints having at least one
		 * variable bound to the exact path
		 * 
		 * Note: In general, a constraint may make use of multiple paths
		 */
		getConstraintsByPath: function(path) {
			var result = [];
			
			var constraints = this.constraints;
			
			for(var i = 0; i < constraints.length; ++i) {
				var constraint = constraints[i];
				
				var paths = constraint.getDeclaredPaths();
				
				var isPath = _.some(paths, function(p) {
					var tmp = p.equals(path);
					return tmp;
				});
				
				if(isPath) {
					result.push(constraint);
				}
			}
			
			return result;
		},
		

		getConstrainedSteps: function(path) {
			//console.log("getConstrainedSteps: ", path);
			//checkNotNull(path);
			
			var tmp = [];
			
			var steps = path.getSteps();
			var constraints = this.constraints;
			
			for(var i = 0; i < constraints.length; ++i) {
				var constraint = constraints[i];
				//console.log("  Constraint: " + constraint);

				var paths = constraint.getDeclaredPaths();
				//console.log("    Paths: " + paths.length + " - " + paths);
				
				for(var j = 0; j < paths.length; ++j) {
					var p = paths[j];
					var pSteps = p.getSteps();
					var delta = pSteps.length - steps.length; 
					
					//console.log("      Compare: " + delta, p, path);
					
					var startsWith = p.startsWith(path);
					//console.log("      Startswith: " + startsWith);
					if(delta == 1 && startsWith) {
						var step = pSteps[pSteps.length - 1];
						tmp.push(step);
					}
				}
			}
			
			var result = _.uniq(tmp, function(step) { return "" + step; });
			
			//console.log("Constraint result", constraints.length, result.length);
			
			return result;
		},
		
		getConstraints: function() {
		    return this.constraints;  
		},
		
		addConstraint: function(constraint) {
			this.constraints.push(constraint);
		},
		
		// Fcuking hack because of legacy code and the lack of a standard collection library...
		// TODO Make the constraints a hash set (or a list set)
		removeConstraint: function(constraint) {
		    var result = false;

		    var cs = this.constraints;
		    
		    var n = [];
		    for(var i = 0; i < cs.length; ++i) {
		        var c = cs[i];
		        
		        if(!c.equals(constraint)) {
		            n.push(c);
		        } else {
		            result = true;
		        }
		    }
		    
		    this.constraints = n;
		    return result;
		},

		toggleConstraint: function(constraint) {
		    var wasRemoved = this.removeConstraint(constraint);
		    if(!wasRemoved) {
		        this.addConstraint(constraint);
		    }
		},

		
//		createElement: function(facetNode, excludePath) {
//			console.log("Should not be invoked");
//			
//			var elements = this.createElements(facetNode, excludePath);
//			var result;
//			if(elements.length === 1) {
//				result = elements[0];
//			} else {
//				result = new sparql.ElementGroup(elements);
//			}
//			
//			return result;
//		},
		
		createElementsAndExprs: function(facetNode, excludePath) {
			//var triples = [];
			var elements = [];
			var resultExprs = [];
			
			
			var pathToExprs = {};
			
			var self = this;

			_(this.constraints).each(function(constraint) {
				var paths = constraint.getDeclaredPaths();
				
				var pathId = _(paths).reduce(
					function(memo, path) {
						return memo + ' ' + path;
					},
					''
				);

				// Check if any of the paths is excluded
				if(excludePath) {
					var skip = _(paths).some(function(path) {
						//console.log("Path.equals", excludePath, path);
						
						var tmp = excludePath.equals(path);
						return tmp;
					});

					if(skip) {
						return;
					}
				}
				
				
				_(paths).each(function(path) {
					
					//if(path.equals(excludePath)) {
						// TODO Exclude only works if there is only a single path
						// Or more generally, if all paths were excluded...
						// At least that somehow seems to make sense
					//}
					
					var fn = facetNode.forPath(path);
					
					//console.log("FNSTATE", fn);
					
					var tmpElements = fn.getElements();
					elements.push.apply(elements, tmpElements);
				});
				
				//var constraintName = constraint.getName();
//				var cef = self.cefRegistry.get(constraintName);
//				if(!cef) {
//					throw "No constraintElementFactory registered for " + constraintName;
//				}
				
				var ci = constraint.createElementsAndExprs(facetNode);
				
				//var ci = constraint.instanciate(facetNode);
				var ciElements = ci.getElements();
				var ciExprs = ci.getExprs();
				
				if(ciElements) {
					elements.push.apply(elements, ciElements);
				}				
				
				if(ciExprs && ciExprs.length > 0) {
				
					var exprs = pathToExprs[pathId];
					if(!exprs) {
						exprs = [];
						pathToExprs[pathId] = exprs;
					}
					
					var andExpr = sparql.andify(ciExprs);
					exprs.push(andExpr);
				}				
			});

			_(pathToExprs).each(function(exprs) {
				var orExpr = sparql.orify(exprs);
				resultExprs.push(orExpr);
			});
			
	        var result = new ns.ElementsAndExprs(elements, resultExprs);

	        return result;
		} 
	});

		/*
	    createElements: function() {
			
				var element = new sparql.ElementFilter(orExpr);

				//console.log("andExprs" +  element);

				elements.push(element);
			});

			//console.log("pathToExprs", pathToExprs);

			//console.log("[ConstraintManager::createElements]", elements);
			
			return elements;
		}
		
	});
	*/

})();



/**
 * An expressions whose variables are expressed in terms
 * of paths.
 * 
 * TODO What if we constrained a geo resource to a bounding box?
 * If the instance function accepted a facet node,
 * then a constraint could use it to create new triples (e.g. geoResource lat/long ?var)
 * 
 * On the other hand, as this essentially places constraints at
 * different paths (i.e. range constraints on lat/long paths),
 * so actually, we could expand this constraints to sub-constraints,
 * resulting in a hierarchy of constraints, and also resulting
 * in another layer of complexity...
 * 
 * 
 * 
 * 
 * Constraint.intstanciate(facetNode
 * 
 * 
 * @param expr
 * @param varToPath
 * @returns {ns.Constraint}
 */
//ns.ConstraintExpr = Class.create({
//	initialize: function(expr, varToPath)  {
//		this.expr = expr;
//		this.varToPath = varToPath;
//	},
//
//	/*
//	 * Get the paths used by this expression
//	 */
//	getPaths: function() {
//		var result = _.values(this.varToPath);
//		return result;
//	},
//		
//	getId: function() {
//		
//	},
//	
//	toString: function() {
//		return this.getId();
//	},
//	
//	/**
//	 * Returns an array of elements.
//	 * 
//	 * Change: It now returns an element and a set of expressions.
//	 * The expressions get ORed when on the same path
//	 * 
//	 * Replaces the variables in the expressions
//	 * with those for the paths.
//	 * 
//	 * 
//	 * Usually the facetNode should be the root node.
//	 * 
//	 * @param varNode
//	 */
//	instanciate: function(facetNode) {
//		var varMap = {};
//		
//		_.each(this.varToPath, function(path, varName) {
//			var targetFacetNode = facetNode.forPath(path);
//			var v = targetFacetNode.getVariable();
//			varMap[varName] = v;
//		});
//		
//		var fnSubstitute = function(node) {
//			//console.log("Node is", node);
//			if(node.isVar()) {
//				var varName = node.getValue();
//				var v = varMap[varName];
//				if(v) {
//					return v;
//				}
//			}
//			return node;
//		};
//		
//		//console.log("Substituting in ", this.expr);
//		var tmpExpr = this.expr.copySubstitute(fnSubstitute);
//		
//		var result = {
//				elements: [], //element],
//				exprs: [tmpExpr]
//		};
//		
//		/*
//		var result = [element];
//		*/
//		
//		return result;
//		//substitute
//	}
//});


///**
//* A class which is backed by a a jassa.util.list<Constraint>
//* Only the backing list's .toArray() method is used, essentially
//* using the list as a supplier.
//* 
//* The question is, whether the methods
//* .getConstraintSteps()
//* .getConstraintsByPath()
//* 
//* justify a list wrapper.
//* Or maybe these should be static helpers?
//* 
//*  
//*/
//ns.ConstraintList = Class.create({
// classLabel: 'jassa.facete.ConstraintList', 
//     
// initialize: function(list) {
//     this.list = list || new util.ArrayList();
// },
//
//   /**
//    * Yields all constraints having at least one
//    * variable bound to the exact path
//    * 
//    * Note: In general, a constraint may make use of multiple paths
//    */
//   getConstraintsByPath: function(path) {
//       var result = [];
//       
//       var constraints = this.constraints;
//       
//       for(var i = 0; i < constraints.length; ++i) {
//           var constraint = constraints[i];
//           
//           var paths = constraint.getDeclaredPaths();
//           
//           var isPath = _.some(paths, function(p) {
//               var tmp = p.equals(path);
//               return tmp;
//           });
//           
//           if(isPath) {
//               result.push(constraint);
//           }
//       }
//       
//       return result;
//   },
//   
//
//   getConstrainedSteps: function(path) {
//       //console.log("getConstrainedSteps: ", path);
//       //checkNotNull(path);
//       
//       var tmp = [];
//       
//       var steps = path.getSteps();
//       var constraints = this.constraints;
//       
//       for(var i = 0; i < constraints.length; ++i) {
//           var constraint = constraints[i];
//           //console.log("  Constraint: " + constraint);
//
//           var paths = constraint.getDeclaredPaths();
//           //console.log("    Paths: " + paths.length + " - " + paths);
//           
//           for(var j = 0; j < paths.length; ++j) {
//               var p = paths[j];
//               var pSteps = p.getSteps();
//               var delta = pSteps.length - steps.length; 
//               
//               //console.log("      Compare: " + delta, p, path);
//               
//               var startsWith = p.startsWith(path);
//               //console.log("      Startswith: " + startsWith);
//               if(delta == 1 && startsWith) {
//                   var step = pSteps[pSteps.length - 1];
//                   tmp.push(step);
//               }
//           }
//       }
//       
//       var result = _.uniq(tmp, function(step) { return "" + step; });
//       
//       //console.log("Constraint result", constraints.length, result.length);
//       
//       return result;
//   },
//   
//   getConstraints: function() {
//       return this.constraints;  
//   },
//   
//   addConstraint: function(constraint) {
//       this.constraints.push(constraint);
//   },
//   
//   // Fcuking hack because of legacy code and the lack of a standard collection library...
//   // TODO Make the constraints a hash set (or a list set)
//   removeConstraint: function(constraint) {
//       var result = false;
//
//       var cs = this.constraints;
//       
//       var n = [];
//       for(var i = 0; i < cs.length; ++i) {
//           var c = cs[i];
//           
//           if(!c.equals(constraint)) {
//               n.push(c);
//           } else {
//               result = true;
//           }
//       }
//       
//       this.constraints = n;
//       return result;
//   },
//
//   toggleConstraint: function(constraint) {
//       var wasRemoved = this.removeConstraint(constraint);
//       if(!wasRemoved) {
//           this.addConstraint(constraint);
//       }
//   }
//});
//
//
///**
//* TODO This is dead code and should be removed
//* 
//* The constraint compiler provides a method for transforming a constraintList
//* into corresponding SPARQL elements.
//* 
//* The compiler is initialized with a constraintElementFactory. The compiler
//* just delegates to these factories.
//* 
//*/
//ns.ConstraintCompiler = Class.create({
//   initialize: function(cefRegistry) {            
//       if(!cefRegistry) {
//           cefRegistry = ns.createDefaultConstraintElementFactories(); 
//       }
//       
//       this.cefRegistry = cefRegistry;
//   },
//   
//   getCefRegistry: function() {
//       return this.cefRegistry;
//   },
//   
//   
//   createElementsAndExprs: function(constraintList, facetNode, excludePath) {
//       //var triples = [];
//       var elements = [];
//       var resultExprs = [];
//       
//       
//       var pathToExprs = {};
//       
//       var self = this;
//
//       var constraints = constraintList.toArray();
//       
//       _(constraints).each(function(constraint) {
//           var paths = constraint.getDeclaredPaths();
//           
//           var pathId = _(paths).reduce(
//               function(memo, path) {
//                   return memo + ' ' + path;
//               },
//               ''
//           );
//
//           // Check if any of the paths is excluded
//           if(excludePath) {
//               var skip = _(paths).some(function(path) {
//                   //console.log("Path.equals", excludePath, path);
//                   
//                   var tmp = excludePath.equals(path);
//                   return tmp;
//               });
//
//               if(skip) {
//                   return;
//               }
//           }
//           
//           
//           _(paths).each(function(path) {
//               
//               //if(path.equals(excludePath)) {
//                   // TODO Exclude only works if there is only a single path
//                   // Or more generally, if all paths were excluded...
//                   // At least that somehow seems to make sense
//               //}
//               
//               var fn = facetNode.forPath(path);
//               
//               //console.log("FNSTATE", fn);
//               
//               var tmpElements = fn.getElements();
//               elements.push.apply(elements, tmpElements);
//           });
//           
//           var constraintName = constraint.getName();
//           var cef = self.cefRegistry.get(constraintName);
//           if(!cef) {
//               throw "No constraintElementFactory registered for " + constraintName;
//           }
//           
//           var ci = cef.createElementsAndExprs(facetNode, constraint);
//           
//           //var ci = constraint.instanciate(facetNode);
//           var ciElements = ci.getElements();
//           var ciExprs = ci.getExprs();
//           
//           if(ciElements) {
//               elements.push.apply(elements, ciElements);
//           }               
//           
//           if(ciExprs && ciExprs.length > 0) {
//           
//               var exprs = pathToExprs[pathId];
//               if(!exprs) {
//                   exprs = [];
//                   pathToExprs[pathId] = exprs;
//               }
//               
//               var andExpr = sparql.andify(ciExprs);
//               exprs.push(andExpr);
//           }               
//       });
//
//       _(pathToExprs).each(function(exprs) {
//           var orExpr = sparql.orify(exprs);
//           resultExprs.push(orExpr);
//       });
//       
//       var result = new ns.ElementsAndExprs(elements, resultExprs);
//
//       return result;
//   }     
//});

/*  
ns.createDefaultConstraintElementFactories = function() {
    var result = new util.ObjectMap();

    result.put("exist", new ns.ConstraintElementFactoryExist());
    result.put("equal", new ns.ConstraintElementFactoryEqual());
    //registry.put("range", new facete.ConstaintElementFactoryRange());     
    result.put("bbox", new ns.ConstraintElementFactoryBBoxRange());

    result.put("regex", new ns.ConstraintElementFactoryRegex());
    result.put("lang", new ns.ConstraintElementFactoryLang());

    
    return result;
};
*/  

(function() {
    
    var ns = Jassa.facete;
    
    ns.ConstraintTaggerFactory = Class.create({
        initialize: function(constraintManager) {
            this.constraintManager = constraintManager;
        },
        
        createConstraintTagger: function(path) {
            var constraints = this.constraintManager.getConstraintsByPath(path);
            
            var equalConstraints = {};

            _(constraints).each(function(constraint) {
                var constraintType = constraint.getName();
                 
                if(constraintType === 'equals') {
                    var node = constraint.getValue();
                    equalConstraints[node.toString()] = node;
                }
            });
    
            console.log('eqConstraints: ', equalConstraints);
            var result = new ns.ConstraintTagger(equalConstraints);
            return result;
        }
    });
     
    ns.ConstraintTagger = Class.create({
        initialize: function(equalConstraints) {
            this.equalConstraints = equalConstraints;
        },
        
        getTags: function(node) {
            var result = {
                isConstrainedEqual: this.equalConstraints[node.toString()] ? true : false
            };
            
            return result;
        }
    }); 
    
})();(function() {

    var rdf = Jassa.rdf;
	var sparql = Jassa.sparql;
	
	var ns = Jassa.facete;


	/**
	 * A class for generating variables for step-ids.
	 * So this class does not care about the concrete step taken.
	 * 
	 * @param variableName
	 * @param generator
	 * @param parent
	 * @param root
	 * @returns {ns.VarNode}
	 */
	ns.VarNode = Class.create({
		initialize: function(variableName, generator, stepId, parent, root) {
			this.variableName = variableName;
			this.generator = generator;
			this.stepId = stepId; // Null for root
			this.parent = parent;
			this.root = root;
			
			
			//console.log("VarNode status" , this);
			if(!this.root) {
				if(this.parent) {
					this.root = parent.root;
				}
				else {
					this.root = this;
				}
			}
	
			
			this.idToChild = {};
		},

		isRoot: function() {
			var result = this.parent ? false : true;
			return result;
		},

		/*
		getSourceVarName: function() {
			var result = this.root.variableName;
			return result;
		},
		*/
		
		getVariableName: function() {
			return this.variableName;
		},
		
		/*
		forPath: function(path) {
			var steps = path.getSteps();
			
			var result;
			if(steps.length === 0) {
				result = this;
			} else {
				var step = steps[0];
				
				// TODO Allow steps back
				
				result = forStep(step);
			}
			
			return result;
		},
		*/

		getIdStr: function() {
			var tmp = this.parent ? this.parent.getIdStr() : "";
			
			var result = tmp + this.variableName;
			return result;
		},

		getStepId: function(step) {
			return "" + JSON.stringify(step);
		},
		
		getSteps: function() {
			return this.steps;
		},
			
		/**
		 * Convenience method, uses forStep
		 * 
		 * @param propertyUri
		 * @param isInverse
		 * @returns
		 */
		forProperty: function(propertyUri, isInverse) {
			var step = new ns.Step(propertyUri, isInverse);
			
			var result = this.forStep(step);

			return result;
		},

		forStepId: function(stepId) {
			var child = this.idToChild[stepId];
			
			if(!child) {
				
				var subName = this.generator.next();
				child = new ns.VarNode(subName, this.generator, stepId, this);
				
				//Unless we change something
				// we do not add the node to the parent
				this.idToChild[stepId] = child;				
			}
			
			return child;
		},
		
		/*
		 * Recursively scans the tree, returning the first node
		 * whose varName matches. Null if none found.
		 * 
		 * TODO: Somehow cache the variable -> node mapping 
		 */
		findNodeByVarName: function(varName) {
			if(this.variableName === varName) {
				return this;
			}
			
			var children = _.values(this.idToChild);
			for(var i = 0; i < children.length; ++i) {
				var child = children[i];

				var tmp = child.findNodeByVarName(varName);
				if(tmp) {
					return tmp;
				}
			}
			
			return null;
		}
	});

	
	/**
	 * This class only has the purpose of allocating variables
	 * and generating elements.
	 * 
	 * The purpose is NOT TO DECIDE on which elements should be created.
	 * 
	 * 
	 * @param parent
	 * @param root
	 * @param generator
	 * @returns {ns.FacetNode}
	 */
	ns.FacetNode = Class.create({
		initialize: function(varNode, step, parent, root) {
			this.parent = parent;
			this.root = root;
			if(!this.root) {
				if(this.parent) {
					this.root = parent.root;
				}
				else {
					this.root = this;
				}
			}
	
			
			this.varNode = varNode;
			
			/**
			 * The step for how this node can be  reached from the parent
			 * Null for the root 
			 */
			this.step = step;
	
	
			this._isActive = true; // Nodes can be disabled; in this case no triples/constraints will be generated
			
			this.idToChild = {};
			
			//this.idToConstraint = {};
		},

		getRootNode: function() {
			return this.root;
		},
			
		isRoot: function() {
			var result = this.parent ? false : true;
			return result;
		},
		
		/*
		getVariableName: function() {
			return this.varNode.getVariableName();
		},*/
		
		getVar: function() {
			var varName = this.varNode.getVariableName();
			var result = rdf.NodeFactory.createVar(varName);
			return result;			
		},
		
		getVariable: function() {
			if(!this.warningShown) {				
				//console.log('[WARN] Deprecated. Use .getVar() instead');
				this.warningShown = true;
			}

			return this.getVar();
		},
		
		getStep: function() {
			return this.step;
		},
		
		getParent: function() {
			return this.parent;
		},
		
		getPath: function() {
			var steps = [];
			
			var tmp = this;
			while(tmp != this.root) {
				steps.push(tmp.getStep());
				tmp = tmp.getParent();
			}
			
			steps.reverse();
			
			var result = new ns.Path(steps);
			
			return result;
		},
		
		forPath: function(path) {
			var steps = path.getSteps();
			
			var result = this;
			_.each(steps, function(step) {
				// TODO Allow steps back
				result = result.forStep(step);
			});
			
			return result;
		},		

		getIdStr: function() {
			// TODO concat this id with those of all parents
		},
		
		getSteps: function() {
			return this.steps;
		},
		
		getConstraints: function() {
			return this.constraints;
		},
		
		isActiveDirect: function() {
			return this._isActive;
		},
				
		
		/**
		 * Returns an array having at most one element.
		 * 
		 * 
		 */
		getElements: function() {
			var result = [];
			
			var triples = this.getTriples();
			if(triples.length > 0) {
				var element = new sparql.ElementTriplesBlock(triples);
				result.push(element);				
			}
			
			
			return result;
		},
		
		/**
		 * Get triples for the path starting from the root node until this node
		 * 
		 * @returns {Array}
		 */
		getTriples: function() {
			var result = [];			
			this.getTriples2(result);
			return result;
		},
		
		getTriples2: function(result) {
			this.createDirectTriples2(result);
			
			if(this.parent) {
				this.parent.getTriples2(result);
			}
			return result;			
		},

		/*
		createTriples2: function(result) {
			
		},*/
		
		createDirectTriples: function() {
			var result = [];
			this.createDirectTriples2(result);
			return result;
		},
				
		
		
		/**
		 * Create the element for moving from the parent to this node
		 * 
		 * TODO Cache the element, as the generator might allocate new vars on the next call
		 */
		createDirectTriples2: function(result) {
			if(this.step) {
				var sourceVar = this.parent.getVariable();
				var targetVar = this.getVariable();
				
				var tmp = this.step.createElement(sourceVar, targetVar, this.generator);
				
				// FIXME
				var triples = tmp.getTriples();
				
				result.push.apply(result, triples);
				
				//console.log("Created element", result);
			}
			
			return result;
			
			/*
			if(step instanceof ns.Step) {
				result = ns.FacetUtils.createTriplesStepProperty(step, startVar, endVar);
			} else if(step instanceof ns.StepFacet) {
				result = ns.FacetUtils.createTriplesStepFacets(generator, step, startVar, endVar);
			} else {
				console.error("Should not happen: Step is ", step);
			}
			*/
		},
		
		isActive: function() {
			if(!this._isActive) {
				return false;
			}
			
			if(this.parent) {
				return this.parent.isActive();
			}
			
			return true;
		},
		
		attachToParent: function() {
			if(!this.parent) {
				return
			}
			
			this.parent[this.id] = this;			
			this.parent.attachToParent();
		},
		
		/*
		hasConstraints: function() {
			var result = _.isEmpty(idToConstraint);
			return result;
		},
		
		// Whether neither this nor any child have constraints
		isEmpty: function() {
			if(this.hasConstraints()) {
				return false;
			}
			
			var result = _.every(this.idConstraint, function(subNode) {
				var subItem = subNode;
				var result = subItem.isEmpty();
				return result;
			});
			
			return result;
		},
		*/
			
		/**
		 * Convenience method, uses forStep
		 * 
		 * @param propertyUri
		 * @param isInverse
		 * @returns
		 */
		forProperty: function(propertyUri, isInverse) {
			var step = new ns.Step(propertyUri, isInverse);
			
			var result = this.forStep(step);

			return result;
		},
			
		forStep: function(step) {
			//console.log("Step is", step);
			
			var stepId = "" + JSON.stringify(step);
			
			var child = this.idToChild[stepId];
			
			if(!child) {
				
				var subVarNode = this.varNode.forStepId(stepId);
				
				child = new ns.FacetNode(subVarNode, step, this, this.root);
				
				/*
				child = {
						step: step,
						child: facet
				};*/
				
				//Unless we change something
				// we do not add the node to the parent
				this.idToChild[stepId] = child;				
			}

			return child;
		},
		
		/**
		 * Remove the step that is equal to the given one
		 * 
		 * @param step
		 */
		/*
		removeConstraint: function(constraint) {
			this.constraints = _.reject(this.constraints, function(c) {
				_.equals(c, step);
			});
		},
		
		addConstraint: function(constraint) {
			this.attachToParent();
			
			var id = JSON.stringify(constraint); //"" + constraint;

			// TODO Exception if the id is object
			//if(id == "[object]")
			
			this.idToConstraint[id] = constraint;
		},
		*/
		
		/**
		 * Copy the state of this node to another one
		 * 
		 * @param targetNode
		 */
		copyTo: function(targetNode) {
			//targetNode.variableName = this.variableName;
			
			_.each(this.getConstraints(), function(c) {
				targetNode.addConstraint(c);
			});			
		},
		
		
		/**
		 * 
		 * 
		 * @returns the new root node.
		 */
		copyExclude: function() {
			// Result is a new root node
			var result = new ns.FacetNode();
			console.log("Now root:" , result);
			
			this.root.copyExcludeRec(result, this);
			
			return result;
		},
			
		copyExcludeRec: function(targetNode, excludeNode) {
			
			console.log("Copy:", this, targetNode);
			
			if(this === excludeNode) {
				return;
			}
			
			this.copyTo(targetNode);
			
			_.each(this.getSteps(), function(s) {
				var childStep = s.step;
				var childNode = s.child;
				
				console.log("child:", childStep, childNode);
				
				if(childNode === excludeNode) {
					return;
				}
				
				
				
				var newChildNode = targetNode.forStep(childStep);
				console.log("New child:", newChildNode);
				
				childNode.copyExcludeRec(newChildNode, excludeNode);
			});			

			
			//return result;
		}
	});


	/**
	 * Use this instead of the constructor
	 * 
	 */
	ns.FacetNode.createRoot = function(v, generator) {

		var varName = v.getName();
		generator = generator ? generator : new sparql.GenSym("fv");
		
		var varNode = new ns.VarNode(varName, generator);		
		var result = new ns.FacetNode(varNode);
		return result;
	};

	
	/**
	 * The idea of this class is to have a singe object
	 * for all this currently rather distributed facet stuff
	 * 
	 * 
	 * 
	 */
	ns.FacetManager = Class.create({
		initialize: function(varName, generator) { //rootNode, generator) {
			
			var varNode = new ns.VarNode(varName, generator);
			
			this.rootNode = new ns.FacetNode(varNode);
	
			//this.rootNode = rootNode;
			this.generator = generator;
		},
	
			/*
			create: function(varName, generator) {
				var v = checkNotNull(varName);
				var g = checkNotNull(generator);
				
				var rootNode = new ns.FacetNode(this, v);
				
				var result = new ns.FacetManager(rootNode, g);
				
				return result;
			},*/
		
		getRootNode: function() {
			return this.rootNode;
		},
		
		getGenerator: function() {
			return this.generator;
		}
	});
	
	
	/**
	 * Ties together a facetNode (only responsible for paths) and a constraint collection.
	 * Constraints can be declaratively set on the facade and are converted to
	 * appropriate constraints for the constraint collection.
	 * 
	 * e.g. from
	 * var constraint = {
	 * 	type: equals,
	 * 	path: ...,
	 * 	node: ...}
	 * 
	 * a constraint object is compiled.
	 * 
	 * 
	 * @param constraintManager
	 * @param facetNode
	 * @returns {ns.SimpleFacetFacade}
	 */
	ns.SimpleFacetFacade = Class.create({
		initialize: function(constraintManager, facetNode) {
			this.constraintManager = constraintManager;
			//this.facetNode = checkNotNull(facetNode);
			this.facetNode = facetNode;
		},

		getFacetNode: function() {
			return this.facetNode;
		},
		
		getVariable: function() {
			var result = this.facetNode.getVariable();
			return result;
		},
		
		getPath: function() {
			return this.facetNode.getPath();
		},
		
		forProperty: function(propertyName, isInverse) {
			var fn = this.facetNode.forProperty(propertyName, isInverse);
			var result = this.wrap(fn);
			return result;								
		},
		
		forStep: function(step) {
			var fn = this.facetNode.forStep(step);
			var result = this.wrap(fn);
			return result;				
		},
		
		wrap: function(facetNode) {
			var result = new ns.SimpleFacetFacade(this.constraintManager, facetNode);
			return result;
		},
		
		forPathStr: function(pathStr) {
			var path = ns.Path.fromString(pathStr);
			var result = this.forPath(path);
			
			//console.log("path result is", result);
			
			return result;
		},
		
		forPath: function(path) {
			var fn = this.facetNode.forPath(path);
			var result = this.wrap(fn);
			return result;
		},

		createConstraint: function(json) {
			if(json.type != "equals") {
				
				throw "Only equals supported";
			}
			
			var node = json.node;

			//checkNotNull(node);
			
			var nodeValue = sparql.NodeValue.makeNode(node);
      // FIXME: createEquals is not defined in ConstraintUtils
			var result = ns.ConstraintUtils.createEquals(this.facetNode.getPath(), nodeValue);
			
			return result;
		},
		
		/**
		 * 
		 * Support:
		 * { type: equals, value: }
		 * 
		 * 
		 * @param json
		 */
		addConstraint: function(json) {
			var constraint = this.createConstraint(json);				
			this.constraintManager.addConstraint(constraint);
		},
		
		removeConstraint: function(json) {
			var constraint = this.createConstraint(json);
      // FIXME: ConstraintManager class has no method moveConstraint (only removeConstraint)
			this.constraintManager.moveConstraint(constraint);				
		},
		
		// Returns the set of constraint that reference a path matching this one
		getConstraints: function() {
			var path = this.facetNode.getPath();
			var constraints = this.constraintManager.getConstraintsByPath(path);
			
			return constraints;
		},
		
		/**
		 * TODO: Should the result include the path triples even if there is no constraint? Currently it includes them.
		 * 
		 * Returns a concept for the values at this node.
		 * This concept can wrapped for getting the distinct value count
		 * 
		 * Also, the element can be extended with further elements
		 */
		createElements: function(includeSelfConstraints) {
			var rootNode = this.facetNode.getRootNode();
			var excludePath = includeSelfConstraints ? null : this.facetNode.getPath();
			
			// Create the constraint elements
			var elements = this.constraintManager.createElements(rootNode, excludePath);
			//console.log("___Constraint Elements:", elements);
			
			// Create the element for this path (if not exists)
			var pathElements = this.facetNode.getElements();
			//console.log("___Path Elements:", elements);
			
			elements.push.apply(elements, pathElements);
			
			var result = sparql.ElementUtils.flatten(elements);
			//console.log("Flattened: ", result);
			
			// Remove duplicates
			
			return result;
		},
		
		
		/**
		 * Creates the corresponding concept for the given node.
		 * 
		 * @param includeSelfConstraints Whether the created concept should
		 *        include constraints that affect the variable
		 *        corresponding to this node. 
		 * 
		 */
		createConcept: function(includeSelfConstraints) {
			var elements = this.createElements(includeSelfConstraints);
			//var element = new sparql.ElementGroup(elements);
			var v = this.getVariable();
			
			var result = new ns.Concept(elements, v);
			return result;
		},
		
		
		/**
		 * Returns a list of steps of _this_ node for which constraints exist
		 * 
		 * Use the filter to only select steps that e.g. correspond to outgoing properties
		 */
		getConstrainedSteps: function() {
			var path = this.getPath();
			var result = this.constraintManager.getConstrainedSteps(path);
			return result;
		}
	});
			
			/**
			 * Returns a list of steps for _this_ node for which constraints exists
			 * 
			 */
			
			
			
			
			/**
			 * Creates a util class for common facet needs:
			 * - Create a concept for sub-facets
			 * - Create a concept for the facet values
			 * - ? more?
			 */
			/*
			createUtils: function() {
				
			}
			*/

})();

(function() {

	var rdf = Jassa.rdf;
	var vocab = Jassa.vocab;
	var sparql = Jassa.sparql;
	
	var ns = Jassa.facete;

	ns.QueryUtils = {
		
//		createTripleRdfProperties: function(propertyVar) {
//			var result = new rdf.Triple(propertyVar, vocab.rdf.type, vocab.rdf.Property);
//			return result;
//		},

//		createElementRdfProperties: function(propertyVar) {
//			var triple = this.createTripleRdfProperties(propertyVar);
//			var result = new sparql.ElementTriplesBlock([triple]);
//			return result;
//		},
	
		
		
		createElementsFacet: function(concept, isInverse, facetVar, valueVar) {
			var result = [];
			
			// If the concept is isomorph to (?s ?p ?o , ?s), skip it because we are going to add the same triple
			if(!concept.isSubjectConcept()) {
				var elements = concept.getElements();
				result.push.apply(result, elements);
			}
			
			var s = concept.getVariable();
			var p = facetVar;
			var o = valueVar;
		
			var triples = isInverse
				? [ new rdf.Triple(o, p, s) ]
				: [ new rdf.Triple(s, p, o) ];
			
			var triplesBlock = new sparql.ElementTriplesBlock(triples);
			
			result.push(triplesBlock);
			
			return result;
		},
	
		/**
		 * Select ?facetVar (Count(Distinct(?__o)) As ?countFacetVar) { }
		 * 
		 */
		createQueryFacetCount: function(concept, facetVar, countFacetVar, isInverse, sampleSize) {
	
			//var facetVar = sparql.Node.v("__p");
			var valueVar = sparql.Node.v("__o");
			var elements = ns.createElementsFacet(concept, isInverse, facetVar, valueVar);
			
			var result = ns.createQueryCount(element, sampleSize, valueVar, countFacetVar, [facetVar], true);
	
			return result;
		},

		
//		createElementSubQuery: function(elements, limit, offset) {
//			if(limit == null && offset == null) {
//				return elements;
//			}
//			
//			var subQuery = new sparql.Query();
//			
//			var subQueryElements = subQuery.getElements();
//			subQueryElements.push.apply(subQueryElements, elements);
//
//			//subQuery.setResultStar(true);
//			subQuery.setLimit(limit);
//			subQuery.setOffset(offset);
//			
//			var resultElement = new sparql.ElementSubQuery(subQuery);			
//
//			return resultElement;
//		},
			
//			if(groupVars) {
//				for(var i = 0; i < groupVars.length; ++i) {					
//					var groupVar = groupVars[i];					
//					subQuery.projectVars.add(groupVar);
//					//subQuery.groupBy.push(groupVar);
//				}
//			}
//			
//			if(variable) {
//				subQuery.projectVars.add(variable);
//			}
//			
//			if(subQuery.projectVars.vars.length === 0) {
//		    	subQuery.isResultStar = true;
//			}
//			
//			subQuery.limit = limit;
//			
//			result.getElements().push(new sparql.ElementSubQuery(subQuery));			
//			} else {
//				var resultElements = result.getElements();
//				resultElements.push.apply(resultElements, elements);
//			}
//		},

        /**
         * Creates a query with
         * Select (Count(*) As outputVar) {{ Select Distinct ?variable { element } }} 
         * 
         */		
        createQueryCount: function(elements, limit, variable, outputVar, groupVars, useDistinct, options) {

            var exprVar = variable ? new sparql.ExprVar(variable) : null;

            var varQuery = new sparql.Query();
            if(limit) {
                var subQuery = new sparql.Query();
                
                var subQueryElements = subQuery.getElements();
                subQueryElements.push.apply(subQueryElements, elements); //element.copySubstitute(function(x) { return x; }));
    
                if(groupVars) {
                    for(var i = 0; i < groupVars.length; ++i) {                 
                        var groupVar = groupVars[i];                    
                        subQuery.projectVars.add(groupVar);
                        //subQuery.groupBy.push(groupVar);
                    }
                }
                
                if(variable) {
                    subQuery.projectVars.add(variable);
                }
                
                if(subQuery.projectVars.vars.length === 0) {
                    subQuery.setResultStar(true);
                }
                
                subQuery.limit = limit;
                
                varQuery.getElements().push(new sparql.ElementSubQuery(subQuery));            
            } else {
                var varQueryElements = varQuery.getElements();
                varQueryElements.push.apply(varQueryElements, elements);
            }
            
            //result.groupBy.push(outputVar);

            if(groupVars) {
                _(groupVars).each(function(groupVar) {
                    varQuery.getProject().add(groupVar);
                    //varQuery.getGroupBy().push(new sparql.ExprVar(groupVar));
                });
            }

            
            varQuery.setDistinct(useDistinct);
            if(variable) {
                varQuery.getProject().add(variable)
            } else {
                varQuery.setResultStar(true);
            }

            var elementVarQuery = new sparql.ElementSubQuery(varQuery);
            
            var result = new sparql.Query();
            
            if(groupVars) {
                _(groupVars).each(function(groupVar) {
                    result.getProject().add(groupVar);
                    result.getGroupBy().push(new sparql.ExprVar(groupVar));
                });
            }
            
            result.getProject().add(outputVar, new sparql.E_Count());
            result.getElements().push(elementVarQuery);
            
            //exp, new sparql.E_Count(exprVar, useDistinct));
            //ns.applyQueryOptions(result, options);
            
            
            
    //debugger;
            //console.log("Created count query:" + result + " for element " + element);
            return result;
        },
        
        
		/**
		 * Creates a query with Count(Distinct ?variable)) As outputVar for an element.
		 * 
		 */
		createQueryCountDoesNotWorkWithVirtuoso: function(elements, limit, variable, outputVar, groupVars, useDistinct, options) {
	
			
			var exprVar = variable ? new sparql.ExprVar(variable) : null;
			
			var result = new sparql.Query();
			if(limit) {
				var subQuery = new sparql.Query();
				
				var subQueryElements = subQuery.getElements();
				subQueryElements.push.apply(subQueryElements, elements); //element.copySubstitute(function(x) { return x; }));
	
				if(groupVars) {
					for(var i = 0; i < groupVars.length; ++i) {					
						var groupVar = groupVars[i];					
						subQuery.projectVars.add(groupVar);
						//subQuery.groupBy.push(groupVar);
					}
				}
				
				if(variable) {
					subQuery.projectVars.add(variable);
				}
				
				if(subQuery.projectVars.vars.length === 0) {
			    	subQuery.setResultStar(true);
				}
				
				subQuery.limit = limit;
				
				result.getElements().push(new sparql.ElementSubQuery(subQuery));			
			} else {
				var resultElements = result.getElements();
				resultElements.push.apply(resultElements, elements);
			}
			
			//result.groupBy.push(outputVar);
			if(groupVars) {
				_(groupVars).each(function(groupVar) {
					result.getProject().add(groupVar);
					result.getGroupBy().push(new sparql.ExprVar(groupVar));
				});
			}
			
			result.getProject().add(outputVar, new sparql.E_Count(exprVar, useDistinct));
			//ns.applyQueryOptions(result, options);
			
	//debugger;
			//console.log("Created count query:" + result + " for element " + element);
			return result;
		}
	};

})();
(function() {

	var vocab = Jassa.vocab;
	var util = Jassa.util;
	var sparql = Jassa.sparql;
	var rdf = Jassa.rdf;
	
	var ns = Jassa.facete;

	
	/**
	 * A set (list) of nodes. Can be negated to mean everything except for this set. 
	 * Used as a base for the creation of filters and bindings for use with prepared queries.
	 * 
	 */
	ns.NodeSet = Class.create({
		initialize: function(nodes, isNegated) {
			this.nodes = nodes;
			this.isNegated = isNegated;
		},
		
		getNodes: function() {
			return this.nodes;
		},
		
		isNegated: function() {
			return this.isNegated;
		}
	});
	
	
//	ns.FacetConceptBound = Class.create({
//		initialize: function(facetConcept, nodeSet) {
//			//this.concept = concept;
//			//this.element = element;
//			//this.bindings = bindings;
//			
//		},
//		
//		getElement: function() {
//			return this.element;
//		},
//		
//		
//	});
	

	ns.FacetConceptItem = Class.create({
		initialize: function(step, concept) {
			this.step = step;
			this.concept = concept;
		},
		
		getStep: function() {
			return this.step;
		},
		
		getFacetConcept: function() {
			return this.concept;
		},
		
		toString: function() {
			return this.step + ": " + this.concept;
		}
	});
	
	
	/**
	 * Returns a single element or null
	 * 
	 * TODO A high level API based on binding objects may be better
	 */
	ns.createFilter = function(v, nodes, isNegated) {
		var uris = [];
		
//		var nodes = uriStrs.map(function(uriStr) {
//			return rdf.NodeFactory.createUri(uriStr);
//		});

		var result = null;
		if(nodes.length > 0) {
			var expr = new sparql.E_OneOf(new sparql.ExprVar(v), nodes);
			
			if(isNegated) {
				expr = new sparql.E_LogicalNot(expr);
			}

			result = new sparql.ElementFilter([expr]);
		}
		
		return result;
	};
	
	// TODO Move to util package
	ns.itemToArray = function(item) {
		var result = [];
		if(item != null) {
			result.push(item);
		}

		return result;
	};


	/**
	 * 
	 * 
	 * Use null or leave undefined to indicate no constraint 
	 */
	ns.LimitAndOffset = Class.create({
		initialize: function(limit, offset) {
			this.limit = limit;
			this.offset = offset;
		},
		
		getOffset: function() {
			return this.offset;
		},

		getLimit: function() {
			return this.limit;
		},
		
		setOffset: function(offset) {
		    this.offset = offset;
		},
		
		setLimit: function(limit) {
		    this.limit = limit;
		}
	});

	
	ns.FacetState = Class.create({
		isExpanded: function() {
			throw "Override me";
		},
		
		getResultRange: function() {
			throw "Override me";
		},
		
		getAggregationRange: function() {
			throw "Override me";
		}				
	});

	ns.FacetStateImpl = Class.create(ns.FacetState, {
		initialize: function(isExpanded, resultRange, aggregationRange) {
			this._isExpanded = isExpanded;
			this.resultRange = resultRange;
			this.aggregationRange = aggregationRange;
		},
		
		isExpanded: function() {
			return this._isExpanded;
		},
		
		getResultRange: function() {
			return this.resultRange; 
		},
		
		getAggregationRange: function() {
			return this.aggregationRange;			
		}		
	});
	

	ns.FacetStateProvider = Class.create({
		getFacetState: function(path) {
			throw "Override me";
		}
	});
	
	
	
	ns.FacetStateProviderImpl = Class.create({
		initialize: function(defaultLimit) {
		    this.defaultLimit = defaultLimit;
		    
			this.pathToState = new util.HashMap();
		},
		
		getMap: function() {
			return this.pathToState;
		},
		
		getFacetState: function(path) {
		    var result = this.pathToState.get(path);
		    
		    if(!result) {
		        result = new ns.FacetStateImpl(null, new ns.LimitAndOffset(this.defaultLimit, 0), null);
		        this.pathToState.put(path, result);
		    }
		    
			return result;
		}
	});
	
	
	ns.FacetConceptGenerator = Class.create({
		createFacetConcept: function(path, isInverse) {
			throw "Override me";
		},

		createFacetValueConcept: function(path, isInverse) {
			throw "Override me";
		}

	});

	
	/**
	 * This is just a POJO
	 * 
	 */
	ns.FacetGeneratorConfig = Class.create({
		initialize: function(baseConcept, rootFacetNode, constraintManager) {
			this.baseConcept = baseConcept;
			this.rootFacetNode = rootFacetNode;
			this.constraintManager = constraintManager;
		},

		getBaseConcept: function() {
			return this.baseConcept;
		},
		
		getRootFacetNode: function() {
			return this.rootFacetNode;			
		},
		
		getConstraintManager: function() {
			return this.constraintManager;			
		}
	});


	// TODO Probably it is better to just make the "dataSource" an abstraction,
	// rather than the facet concept generator.
	ns.FacetGeneratorConfigProvider = Class.create({
		getConfig: function() {
			throw "Override me";			
		}
	});
	
	
	ns.FacetGeneratorConfigProviderConst = Class.create(ns.FacetGeneratorConfigProvider, {
		initialize: function(facetConfig) {
			this.facetConfig = facetConfig;
		},
		
		getConfig: function() {
			return this.facetConfig;
		}
	});
		
	ns.FacetGeneratorConfigProviderIndirect = Class.create(ns.FacetGeneratorConfigProvider, {
		initialize: function(baseConceptFactory, rootFacetNodeFactory, constraintManager) {
			this.baseConceptFactory = baseConceptFactory;
			this.rootFacetNodeFactory = rootFacetNodeFactory;
			this.constraintManager = constraintManager;
		},
		
		getConfig: function() {
			var baseConcept = this.baseConceptFactory.createConcept();
			var rootFacetNode = this.rootFacetNodeFactory.createFacetNode(); 
			var constraintManager = this.constraintManager;			
			//var constraintElements = constraintManager.createElements(rootFacetNode);
			
			var result = new ns.FacetGeneratorConfig(baseConcept, rootFacetNode, constraintManager);
			return result;
		}
	});

	
	ns.FacetConceptGeneratorFactory = Class.create({
		createFacetConceptGenerator: function() {
			throw "Implement me";
		}
	});
	
	
	/**
	 * Retrieves a facetConfig from a facetConfigProvider and uses it
	 * for the creation of a facetConceptGenerator.
	 * 
	 * These layers of indirection are there to allow creating a facetConceptFactory whose state
	 * can be made static* - so whose state is based on a snapshot of the states of 
	 * {baseConcept, rootFacetNode, constraintManager}.
	 * 
	 * *Currently the contract does not enforce this; the design is just aimed at enabling this.
	 * 
	 * Multiple calls to createFacetConfigGenerator may yield new objects with different configurations.
	 * 
	 */
	ns.FacetConceptGeneratorFactoryImpl = Class.create(ns.FacetConceptGeneratorFactory, {
		initialize: function(facetConfigProvider) {
			this.facetConfigProvider = facetConfigProvider;
		},
		
		createFacetConceptGenerator: function() {
			var facetConfig = this.facetConfigProvider.getConfig();
			
			var result = new ns.FacetConceptGeneratorImpl(facetConfig);
			return result;
		}
	});

	ns.FacetConceptGeneratorImpl = Class.create(ns.FacetConceptGenerator, {
		initialize: function(facetConfig) {
			this.facetConfig = facetConfig;
		},
		
		
		/**
		 * Create a concept for the set of resources at a given path
		 * 
		 * 
		 */
		createConceptResources: function(path, excludeSelfConstraints) {
			var facetConfig = this.facetConfig;
			
			var baseConcept = facetConfig.getBaseConcept();
			var rootFacetNode = facetConfig.getRootFacetNode(); 
			var constraintManager = facetConfig.getConstraintManager();

			
			var excludePath = excludeSelfConstraints ? path : null;			
			//var constraintElements = constraintManager.createElements(rootFacetNode, excludePath);

			var elementsAndExprs = constraintManager.createElementsAndExprs(rootFacetNode, excludePath);
			var constraintElements = elementsAndExprs.getElements();
			var constraintExprs = elementsAndExprs.getExprs();
			
			var facetNode = rootFacetNode.forPath(path);
			var facetVar = facetNode.getVar();

			
			var baseElements = baseConcept.getElements();
            var pathElements = facetNode.getElements();

            var facetElements = []; 
            facetElements.push.apply(facetElements, pathElements);
            facetElements.push.apply(facetElements, constraintElements);

            
			if(baseConcept.isSubjectConcept()) {
				if(facetElements.length == 0) {
				    facetElements = baseElements;
				}  
			} else {
				facetElements.push.apply(facetElements, baseElements); 
			}
			
			var filterElements = _(constraintExprs).map(function(expr) {
			    var element = new sparql.ElementFilter(expr);
			    return element;
			});
			
			facetElements.push.apply(facetElements, filterElements);
			
			

			// TODO Fix the API - it should only need one call
			var finalElements = sparql.ElementUtils.flatten(facetElements);
			finalElements = sparql.ElementUtils.flattenElements(finalElements);
			
			//var result = new ns.Concept(finalElements, propertyVar);
			var result = ns.Concept.createFromElements(finalElements, facetVar);
			return result;
		},
		
		/**
		 * Creates a concept for the facets at a given path
		 * 
		 * This method signature is not final yet.
		 *
		 * TODO Possibly add support for specifying the p ond o variables
		 * 
		 * @param path The path for which to describe the set of facets
		 * @param isInverse Whether at the given path the outgoing or incoming facets should be described
		 * @param enableOptimization Returns the concept (?p a Property, ?p) in cases where (?s ?p ?o, ?p) would be returned.
		 * @param singleProperty Whether to create a concept where only a single property at the given path is selected. Useful for creating concepts for individual properties
		 * TODO Add @param resourceLimit If given, this limit will be applied for the resources at each node of the path (maybe the limit should be part of the path object???)  
		 */
		createConceptFacetsCore: function(path, isInverse, enableOptimization, singleProperty) { //excludeSelfConstraints) {

			
			var facetConfig = this.facetConfig;
			
			var baseConcept = facetConfig.getBaseConcept();
			var rootFacetNode = facetConfig.getRootFacetNode(); 
			var constraintManager = facetConfig.getConstraintManager();

			
			//var excludePath = excludeSelfConstraints ? path : null;			
			var singleStep = null;
			if(singleProperty) {
				singleStep = new ns.Step(singleProperty.getUri(), isInverse);
			}

			
			var excludePath = null;
			if(singleStep) {
				excludePath = path.copyAppendStep(singleStep);
			}
			
			var elementsAndExprs = constraintManager.createElementsAndExprs(rootFacetNode, excludePath);
			var constraintElements = elementsAndExprs.toElements();

			var facetNode = rootFacetNode.forPath(path);
			var facetVar = facetNode.getVar();

			
			var baseElements = baseConcept.getElements();
			//baseElements.push.apply(baseElements, constraintElements);
			
			var facetElements; 
			if(baseConcept.isSubjectConcept()) {
				facetElements = constraintElements;
			} else {
				facetElements = baseElements.concat(constraintElements); 
			}
			
			var varsMentioned = sparql.PatternUtils.getVarsMentioned(facetElements); //.getVarsMentioned();
			var varNames = varsMentioned.map(function(v) { return v.getName(); });
			
			var genProperty = new sparql.GeneratorBlacklist(sparql.GenSym.create("p"), varNames);
			var genObject = new sparql.GeneratorBlacklist(sparql.GenSym.create("o"), varNames);
			
			var propertyVar = rdf.NodeFactory.createVar(genProperty.next());
			var objectVar = rdf.NodeFactory.createVar(genObject.next());
			
			// If there are no constraints, and the path points to root (i.e. is empty),
			// we can use the optimization of using the query ?s a rdf:Property
			// This makes several assumptions, TODO point to a discussion 

			// but on large datasets it may work much better than having to scan everything for the properties.
			
			var hasConstraints = facetElements.length !== 0;

			var triple; 
			
			if(enableOptimization && !hasConstraints && path.isEmpty()) {
				//triple = new rdf.Triple(propertyVar, vocab.rdf.type, vocab.rdf.Property);
				
				var types = [vocab.rdf.Property, vocab.owl.AnnotationProperty, vocab.owl.DatatypeProperty, vocab.owl.ObjectProperty];
				
        var v = rdf.NodeFactory.createVar('_x_');
        var exprVar = new sparql.ExprVar(v);
				var typeExprs = _(types).map(function(node) {
				   var nodeValue = sparql.NodeValue.makeNode(node);
				   var expr = new sparql.E_Equals(exprVar, nodeValue);
				   return expr;
				});
				
				var filterExpr = sparql.orify(typeExprs); 
				
				triple = new rdf.Triple(propertyVar, vocab.rdf.type, v);

				var element = new sparql.ElementGroup([
                    new sparql.ElementTriplesBlock([triple]),
                    new sparql.ElementFilter(filterExpr)
                ]);
				
				//console.log('ELEMENTE' + element);
				
                facetElements.push(element);
				
			} else {
				if(!isInverse) {
					triple = new rdf.Triple(facetVar, propertyVar, objectVar);
				} else {
					triple = new rdf.Triple(objectVar, propertyVar, facetVar);
				}
	            facetElements.push(new sparql.ElementTriplesBlock([triple]));
			}
			
			
			
			if(singleStep) {
				var exprVar = new sparql.ExprVar(propertyVar);
				var expr = new sparql.E_Equals(exprVar, sparql.NodeValue.makeNode(singleProperty));
				facetElements.push(new sparql.ElementFilter([expr]));
			}
			
			
			var pathElements = facetNode.getElements();
			facetElements.push.apply(facetElements, pathElements);

			// TODO Fix the API - it should only need one call
			var finalElements = sparql.ElementUtils.flatten(facetElements);
			finalElements = sparql.ElementUtils.flattenElements(finalElements);
			
			//var result = new ns.Concept(finalElements, propertyVar);
			var result = new ns.FacetConcept(finalElements, propertyVar, objectVar);
			return result;
		},
		
		/**
		 * Creates a concept that fetches all facets at a given path
		 *
		 * Note that the returned concept does not necessarily
		 * offer access to the facet's values (see first example).
		 * 
		 * Examples:
		 * - ({?s a rdf:Property}, ?s)
		 * - ({?s a ex:Foo . ?s ?p ?o }, ?p)
		 * 
         * TODO We should add arguments to support scanLimit and resourceLimit (such as: only derive facets based on distinct resources within the first 1000000 triples)
		 * 
		 */
		createConceptFacets: function(path, isInverse) {
			var facetConcept = this.createConceptFacetsCore(path, isInverse, true);
			
			var result = new ns.Concept.createFromElements(facetConcept.getElements(), facetConcept.getFacetVar());
			return result;
		},

		
		/**
		 * TODO The name is a bit confusing...
		 * 
		 * The returned concept (of type FacetConcept) holds a reference
		 * to the facet and facet value variables.
		 * 
		 * Intended use is to first obtain the set of properties, then use this
		 * method, and constraint the concept based on the obtained properties.
		 * 
		 * Examples:
		 * - ({?p a rdf:Propery . ?s ?p ?o }, ?p, ?o })
		 * - ({?s a ex:Foo . ?o ?p ?s }, ?p, ?o)
		 * 
		 * 
		 * @return  
		 */
		createConceptFacetValues: function(path, isInverse, properties, isNegated) { //(model, facetFacadeNode) {

			isInverse = isInverse == null ? false : isInverse;
			
			var result;
			
			var propertyNames = properties.map(function(property) {
				return property.getUri();
			});
			
			
			var facetConfig = this.facetConfig;
			
			var baseConcept = facetConfig.getBaseConcept();
			var rootFacetNode = facetConfig.getRootFacetNode(); 
			var constraintManager = facetConfig.getConstraintManager();


			var facetNode = rootFacetNode.forPath(path);
			

			// Set up the concept for fetching facets on constrained paths
			// However make sure to filter them by the user supplied array of properties
			var tmpConstrainedSteps = constraintManager.getConstrainedSteps(path);
			
			//console.log("ConstrainedSteps: ", tmpConstrainedSteps);
			
			var constrainedSteps = _(tmpConstrainedSteps).filter(function(step) {
				var isSameDirection = step.isInverse() === isInverse;
				if(!isSameDirection) {
					return false;
				}
				
				var isContained = _(propertyNames).contains(step.getPropertyName());
								
				var result = isNegated ? !isContained : isContained;
				return result;
			});
			
			var excludePropertyNames = constrainedSteps.map(function(step) {
				return step.getPropertyName();
			});

			var includeProperties = [];
			var excludeProperties = [];
			
			_(properties).each(function(property) {
				if(_(excludePropertyNames).contains(property.getUri())) {
					excludeProperties.push(property);
				}
				else {
					includeProperties.push(property);
				}
			});
			
			//console.log("excludePropertyNames: ", excludePropertyNames);
			
			// The first part of the result is formed by conceptItems for the constrained steps
			var result = this.createConceptItems(facetNode, constrainedSteps);
			
			
			// Set up the concept for fetching facets of all concepts that were NOT constrained
			//var genericConcept = facetFacadeNode.createConcept(true);
			var genericFacetConcept = this.createConceptFacetsCore(path, isInverse, false);
			var genericElements = genericFacetConcept.getElements();
			
			//var genericConcept = genericFacetConcept.getConcept();
			
			//var genericElement = ns.createConceptItemForPath(baseConcept, facetNode, constraintManager, path, false);
			
			// Combine this with the user specified array of properties
			var filterElement = ns.createFilter(genericFacetConcept.getFacetVar(), includeProperties, false);
			if(filterElement != null) {
				genericElements.push(filterElement);
			}
			
			// Important: If there are no properties to include, we can drop the genericConcept
			if(includeProperties.length > 0) {
			    var genericConceptItem = new ns.FacetConceptItem(null, genericFacetConcept);
			
			    result.push(genericConceptItem);
			}
			
			return result;
		},
		
		createConceptItems: function(facetNode, constrainedSteps) {
			var self = this;
			
			var result = _(constrainedSteps).map(function(step) {
				var tmp = self.createConceptItem(facetNode, step);
				return tmp;
			});
			
			return result;
		},
	
		createConceptItem: function(facetNode, step) {
			var propertyName = step.getPropertyName();
	
			var property = rdf.NodeFactory.createUri(propertyName);
			
			//var targetNode = facetNode.forStep(step);
			//var path = targetNode.getPath();
			
			var path = facetNode.getPath();
			var targetConcept = this.createConceptFacetsCore(path, step.isInverse(), false, property);
			//var targetConcept = ns.createConceptForPath(rootFacetNode, constraintManager, path, true);
			//var subNode = facetFacadeNode.forProperty(stepfacetUri.value, step.isInverse);
				
			var result = new ns.FacetConceptItem(step, targetConcept);
			return result;
		}
		
//		
//		createConceptsFacetValues: function(path, isInverse, properties, isNegated) {
//			
//			var self = this;
//	
//			var sampleSize = null; // 50000;
//			//var facetVar = sparql.Node.v("__p");
//			//var countVar = sparql.Node.v("__c");
//			
//			var query = queryUtils.createQueryFacetCount(concept, facetVar,
//					countVar, this.isInverse, sampleSize);
//	
//			//console.log("[DEBUG] Fetching facets with query: " + query);
//			
//			var uris = [];
//			if(steps && steps.length > 0) {
//				
//				// Create the URIs from the steps
//				for(var i = 0; i < steps.length; ++i) {
//					var step = steps[i];
//					
//					if(step.isInverse() === this.isInverse) {
//						var propertyUri = sparql.Node.uri(step.propertyName);
//	
//						uris.push(propertyUri);
//					}
//				}
//				
//				// Skip fetching if we have inclusion mode with no uris
//				if(mode === true) {
//					if(uris.length === 0) {
//						return null;
//					}
//				}	
//	
//				
//				if(uris.length !== 0) {
//					var expr = new sparql.E_In(new sparql.ExprVar(facetVar), uris);
//					
//					if(!mode) {
//						expr = new sparql.E_LogicalNot(expr);
//					}
//	
//					var filter = new sparql.ElementFilter([expr]);
//	
//					//console.log("Filter: ", filter);
//					query.elements.push(filter);
//				}
//			}
//			
//			return query;
//	
//		}

//		createConceptFacetValues: function(path, isInverse) {
//			var result = this.createConceptFacetsCore(path, isInverse, false);
//			
//			return result;
//		}
		
		
	});
	


//	ns.createConceptForPath = function(rootFacetNode, constraintManager, path, includeSelfConstraints) {
//
//		var facetNode = rootFacetNode.forPath(path); 
//		var excludePath = includeSelfConstraints ? null : facetNode.getPath();
//		
//		// Create the constraint elements
//		var elements = constraintManager.createElements(rootNode, excludePath);
//		//console.log("___Constraint Elements:", elements);
//		
//		// Create the element for this path (if not exists)
//		var pathElements = facetNode.getElements();
//		//console.log("___Path Elements:", elements);
//		
//		elements.push.apply(elements, pathElements);
//		
//		var result = sparql.ElementUtils.flatten(elements);
//		
//		
//		
//		//console.log("Flattened: ", result);
//		
//		// Remove duplicates
//		
//		return result;
//	};
	

	
// The FacetQueryGenerator related classes did not turn out to be useful, as the query generation
// in general is determined by the data fetching strategy.
	
//	ns.FacetQueryGeneratorFactory = Class.create({
//		createFacetQueryGenerator: function() {
//			throw "Override me";
//		}
//	});
//	
	
//	ns.FacetQueryGeneratorFactoryImpl = Class.create(ns.FacetQueryGeneratorFactory, {
//		initialize: function(facetConceptGeneratorFactory, facetStateProvider) {
//			this.facetConceptGeneratorFactory = facetConceptGeneratorFactory;
//			this.facetStateProvider = facetStateProvider;
//		},
//		
//		createFacetQueryGenerator: function() {
//			var facetConceptGenerator = this.facetConceptGeneratorFactory.createFacetConceptGenerator(); 
//
//			var result = new ns.FacetQueryGeneratorImpl(facetConceptGenerator, this.facetStateProvider);
//			return result;
//		}
//	});
//
//	ns.FacetQueryGeneratorFactoryImpl.createFromFacetConfigProvider = function(facetConfigProvider, facetStateProvider) {
//		var fcgf = new ns.FacetConceptGeneratorFactoryImpl(facetConfigProvider);
//		
//		var result = new ns.FacetQueryGeneratorFactoryImpl(fcgf, facetStateProvider);
//		return result;
//	};
	
	
//	
//	/**
//	 * Combines the FacetConceptGenerator with a facetStateProvider
//	 * in order to craft query objects.
//	 * 
//	 */
//	ns.FacetQueryGeneratorImpl = Class.create({
//		initialize: function(facetConceptFactory, facetStateProvider) {
//			this.facetConceptFactory = facetConceptFactory;
//			this.facetStateProvider = facetStateProvider;
//		},
//		
//		/**
//		 * Creates a query for retrieving the properties at a given path.
//		 * 
//		 * Applies limit and offset both for aggregation and retrieval according
//		 * to the facetState for that path.
//		 * 
//		 * 
//		 * The intended use of the querie's result set is to retrieve the facet count for each of the properties 
//		 * 
//		 * TODO: Which component should be responsible for retrieving all facets that match a certain keyword?
//		 * 
//		 * 
//		 * 
//		 */
//		createQueryFacetList: function(path, isInverse) {
//			var concept = this.facetConceptFactory.createFacetConcept(path, isInverse);
//			
//			var facetState = this.facetStateProvider.getFacetState(path, isInverse);
//			
//			return concept;
//		},
//		
//		createQueryFacetCount: function() {
//			
//		},
//		
//		
//		/**
//		 * Create a set of queries that yield the facet value counts
//		 * for a given set of properties facing at a direction at a given path
//		 * 
//		 * The result looks something like this:
//		 * TODO Finalize this, and create a class for it.
//		 * 
//		 * {
//		 *    constrained: {propertyName: concept}
//		 *    unconstrained: concept
//		 * }
//		 * 
//		 * 
//		 */
//		createFacetValueCountQueries: function(path, isInverse, properties, isNegated) {
//			
//			var self = this;
//
//			var sampleSize = null; // 50000;
//			//var facetVar = sparql.Node.v("__p");
//			//var countVar = sparql.Node.v("__c");
//			
//			var query = queryUtils.createQueryFacetCount(concept, facetVar,
//					countVar, this.isInverse, sampleSize);
//
//			//console.log("[DEBUG] Fetching facets with query: " + query);
//			
//			var uris = [];
//			if(steps && steps.length > 0) {
//				
//				// Create the URIs from the steps
//				for(var i = 0; i < steps.length; ++i) {
//					var step = steps[i];
//					
//					if(step.isInverse() === this.isInverse) {
//						var propertyUri = sparql.Node.uri(step.propertyName);
//
//						uris.push(propertyUri);
//					}
//				}
//				
//				// Skip fetching if we have inclusion mode with no uris
//				if(mode === true) {
//					if(uris.length === 0) {
//						return null;
//					}
//				}	
//
//				
//				if(uris.length !== 0) {
//					var expr = new sparql.E_In(new sparql.ExprVar(facetVar), uris);
//					
//					if(!mode) {
//						expr = new sparql.E_LogicalNot(expr);
//					}
//
//					var filter = new sparql.ElementFilter([expr]);
//
//					//console.log("Filter: ", filter);
//					query.elements.push(filter);
//				}
//			}
//			
//			return query;
//			
//			
//		},
//		
//		
//		/**
//		 * Some Notes on partitioning:
//		 * - TODO Somehow cache the relation between filter configuration and fetch strategy
//		 * Figure out which facet steps have constraints:
//		 * For each of them we have to fetch the counts individually by excluding
//		 * constraints on that path			
//		 * On the other hand, we can do a single query to capture all non-constrained paths
//		 */
//		createFacetValueCountQueries: function(path, isInverse, propertyNames, isNegated) { //(model, facetFacadeNode) {
//
//			// TODO get access to rootFacetNode
//			var facetNode = this.rootFacetNode.forPath(path);
//			
//
//			// Set up the concept for fetching facets on constrained paths
//			// However make sure to filter them by the user supplied array of properties
//			var tmpConstrainedSteps = this.constraintManager.getConstrainedSteps(path);
//			
//			var constrainedSteps = _(tmpConstrainedSteps).filter(function(step) {
//				var isSameDirection = step.isInverse() === isInverse;
//				if(!isSameDirection) {
//					return false;
//				}
//				
//				var isContained = _(propertyNames).contains(step.getPropertyName());
//								
//				var result = isNegated ? !isContained : isContained;
//				return result;
//			});
//			
//			var excludePropertyNames = constrainedSteps.map(function(step) {
//				return step.getPropertyName();
//			});
//			
//			var constrainedConceptItems = this.createConceptItems(facetNode, constrainedSteps);
//
//			// Set up the concept for fetching facets of all concepts that were NOT constrained
//			var genericConcept = facetFacadeNode.createConcept(true);
//			
//			
//			// Combine this with the user specified array of properties 
//			var filterElement = ns.createFilter(genericConcept.getVar(), excludePropertyNames, isNegated);
//			if(filterElement != null) {
//				genericConcept.getElements().push(filterElement);
//			}
//			
//				
//			
//		},
//
//
//		/**
//		 * This function loads the facets of a specific concept.
//		 */
//		fnFetchSubFacets: function(sparqlService, conceptItem) {
//	
//			var facetUri = conceptItem.property;
//			var concept = conceptItem.concept;
//			
//			var element = concept.getElement();
//			var variable = concept.getVariable();
//			
//			var outputVar = sparql.Node.v("__c");
//			var limit = null;
//	
//			var query = queryUtils.createQueryCount(element, null, variable, outputVar, null, true, null);
//			//console.log("Fetching facets with ", query);
//			var queryExecution = queryUtils.fetchInt(sparqlService, query, outputVar);
//	
//			
//			var promise = queryExecution.pipe(function(facetCount) {
//				conceptItem.facetCount = facetCount;
//				//item.facetFacadeNode = subNode;
//				//item.step = step;
//	
//				//console.log("ConceptItem: ", conceptItem);
//				
//				// We need to return arrays for result 
//				var result = [conceptItem];
//				return result;
//			});
//	
//			return promise;
//		},
//
//	
//		/**
//		 * Create the list of all facets that carry constraints and
//		 * for which we have to fetch their facets.
//		 */
//		createConceptItems: function(facetNode, constrainedSteps) {
//			var self = this;
//			
//			var result = _(constrainedSteps).map(function(step) {
//				var tmp = self.createConceptItem(facetNode, step);
//				return tmp;
//			});
//			
//			return result;
//		},
//		
//		createConceptItem: function(facetNode, step) {
//			var propertyName = step.getPropertyName();
//
//			var targetNode = facetNode.forStep(step);
//			var targetConcept = targetNode.createConcept();
//			//var subNode = facetFacadeNode.forProperty(stepfacetUri.value, step.isInverse);
//
//			var result = new ns.StepAndConcept(step, targetConcept);
//
////			var prefix = self.isInverse ? "<" : "";
////
////			var result = {
////				id: "simple_" + prefix + propertyName,
////				type: 'property',
////				property: propertyName,
////				isInverse: step.isInverse,
////				concept: targetConcept,
////				step: step,
////				facetFacadeNode: targetNode
////			};		
////			
//			return result;
//		}
//	});
//	

})();





//ns.FacetConceptGeneratorDelegate = Class.create(ns.FacetConceptGenerator, {
//getDelegate: function() {
//	throw "Override me";
//},
//
//createFacetConcept: function(path, isInverse) {
//	var delegate = this.getDelegate();
//	var result = delegate.createFacetConcept(path, isInverse);
//	return result;
//},
//
//createFacetValueConcept: function(path, isInverse) {
//	var delegate = this.getDelegate();
//	var result = delegate.createFacetValueConcept(path, isInverse);
//	return result;
//}
//});


//ns.FacetConceptGeneratorIndirect = Class.create(ns.FacetConceptGeneratorDelegate, {
//initialize: function(baseConceptFactory, rootFacetNodeFactory, constraintManager, facetStateProvider) {
//	this.baseConceptFactory = baseConceptFactory;
//	this.rootFacetNodeFactory = rootFacetNodeFactory;
//	this.constraintManager = constraintManager;
//	this.facetStateProvider = facetStateProvider;
//},
//
//getDelegate: function() {
//	var rootFacetNode = this.rootFacetNodeFactory.createFacetNode(); 
//	var baseConcept = this.baseConceptFactory.createConcept();
//	var constraintManager = this.constraintManager;			
//	var constraintElements = constraintManager.createElements(rootFacetNode);
//
//	var result = new ns.FacetConceptGenerator(baseConcept, rootFacetNode, constraintManager);
//	
//	return result;
//}
//});

(function($) {

	
	var service = Jassa.service;
	var rdf = Jassa.rdf;
    var sponate = Jassa.sponate;	
    var util = Jassa.util;
    var sparql = Jassa.sparql;

	var ns = Jassa.facete;
	
	
	/**
	 * TODO: Actually this object could take the FacetTreeConfig as its sole config argument (the other arg would be the service)
	 * 
	 */
	ns.FacetTreeServiceImpl = Class.create({
		initialize: function(facetService, expansionSet, expansionMap, facetStateProvider, pathToFilterString) { //facetStateProvider) {
			this.facetService = facetService;
			this.expansionSet = expansionSet;
			this.expansionMap = expansionMap;
			this.facetStateProvider = facetStateProvider;

			this.pathToFilterString = pathToFilterString;
		},
		
		fetchFacetTree: function(path) {
			//var path = new ns.Path.parse();

		    var parentFacetItem;

            if(path.isEmpty()) {
                parentFacetItem = new ns.FacetItem(path, rdf.NodeFactory.createUri('http://root'), null);
            } else {
                parentFacetItem = new ns.FacetItem(path, rdf.NodeFactory.createUri(path.getLastStep().getPropertyName()), null);                
            }

            parentFacetItem.setDoc({
                displayLabel: 'Items'
            });
    
            // Apply tags for the root element
            var tags = this.facetService.getTags(path);
            parentFacetItem.setTags(tags);
		    
			var result = this.fetchFacetTreeRec(path, parentFacetItem);
			
//			result.done(function(facetTree) {
//			    console.log("FacetTree: ", facetTree);
//			});
			
			return result;
		},
		
		fetchFavFacets: function(paths) {
		    var self = this;
		    var promises = _(paths).map(function(path) {
		       var parentFacetItem = new ns.FacetItem(path, rdf.NodeFactory.createUri(path.getLastStep().getPropertyName()), null);
		       var r =  self.fetchFacetTreeRec(path, parentFacetItem);
		       return r;
		    });
		    
		    
		    var result = $.Deferred();
		    $.when.apply(window, promises).done(function() {
                var r = _(arguments).map(function(item) {
                    return item;
                });
                
		        result.resolve(r);
		    }).fail(result.fail);
		    
		    
		    return result.promise();
		},
		
		
		
		/**
		 * Returns Promise<List<FacetItem>>
		 * 
		 */
		fetchFacetTreeChildren: function(path, isInverse) {

		    var baseData = {
		            path: path,
		            children: [],
		            limit: null,
		            offset: null
		    };
		        
            //baseData.children = [];
            
            var limit = null;
            var offset = null;

            var state = this.facetStateProvider.getFacetState(path);
            
            if(state) {
                var resultRange = state.getResultRange();
                
                limit = resultRange.getLimit();
                offset = resultRange.getOffset() || 0;
            }


            baseData.limit = limit;
            baseData.offset = offset;


            var filterString = this.pathToFilterString.get(path);
            var baseFlow = this.facetService.createFlow(path, isInverse, filterString);

            var countPromise = baseFlow.count();
            
            //var countPromise = this.facetService.fetchFacetCount(path, false);
            //var childFacetsPromise = this.facetService.fetchFacets(path, false, limit, offset);
            
            var dataFlow = baseFlow.skip(offset).limit(limit);
            
            // TODO How to decide whether to fetch forward or backward facets?
            
            //var childFacetsPromise = this.facetService.fetchFacetsFromFlow(dataFlow, path, false);
            //var childFacetsPromise = this.facetService.fetchFacetsFromFlow(dataFlow, pathHead.getPath(), pathHead.isInverse());
            var childFacetsPromise = this.facetService.fetchFacetsFromFlow(dataFlow, path, isInverse);


            var promises = [countPromise, childFacetsPromise];
            
             
            var result = $.Deferred();
            var self = this;
            $.when.apply(window, promises).pipe(function(childFacetCount, facetItems) {
//console.log('facetItems:', facetItems);
                baseData.childFacetCount = childFacetCount;
                
                var o = limit ? Math.floor((offset || 0) / limit) : 0; 
                
                baseData.pageIndex = 1 + o;
                baseData.pageCount = 1 + (limit ? Math.floor(childFacetCount / limit) : 0);
                
                var childPromises = _(facetItems).map(function(facetItem) {
                    var path = facetItem.getPath();

                    var childPromise = self.fetchFacetTreeRec(path, facetItem);
                    //.pipe(function(childItem) {
                    //});

                    return childPromise;
                });

                
                $.when.apply(window, childPromises).done(function() {
                    _(arguments).each(function(childItem) {
                        baseData.children.push(childItem);
                    });

                    result.resolve(baseData);
                }).fail(function() {
                    result.fail();
                });
                
            });                
		  
            return result;
		},
		
	    /**
         * Given a path, this method fetches all child facets at its target location.
         * 
         * Note that there are 2 components involved:
         * Fetching the child facets
         * 
         * @param facetItem Information about the path leading to this recursion,
         *        such as: count of distinct facet values
         *        null for the root node
         */
		fetchFacetTreeRec: function(path, parentFacetItem) {

		    var isExpanded = this.expansionSet.contains(path);
		    var expansionState = this.expansionMap.get(path);

		    var isOutgoingActive = (expansionState & 1) != 0;
		    var isIncomingActive = (expansionState & 2) != 0;

            // This is the basic information returned for non-expanded facets
            var baseData = {
                item: parentFacetItem,
                isExpanded: isExpanded,
                expansionState: expansionState,
                isOutgoingActive: isOutgoingActive,
                isIncomingActive: isIncomingActive, 
                //state: facetState,
                incoming: null,
                outgoing: null
            };

//            if(isIncomingActive) {
//                console.log('WHAAAAAAAAAAT?');
//            }
            
            var self = this;
            
            
            var result = $.Deferred();
            
            var promises = [];

            if(isExpanded) {
                
                if(isOutgoingActive) { // outgoing
                    var promise = this.fetchFacetTreeChildren(path, false).pipe(function(childData) {
                       baseData.outgoing = childData; 
                    });
                    
                    promises.push(promise);
                }
                
                if(isIncomingActive) { // incoming
                    var promise = this.fetchFacetTreeChildren(path, true).pipe(function(childData) {
                       baseData.incoming = childData; 
                    });
                    promises.push(promise);
                }
            }
            
            $.when.apply(window, promises).done(function() {
                result.resolve(baseData);
            });
            
            return result.promise();
		},
		
		
		fetchFacetTreeRecOldWrongChildFacetCounts: function(path) {
			
		    console.log('fetchFacetTreeRec: ' + path);
			var self = this;
			
			
			var result = $.Deferred();
			
            var limit = null;
            var offset = null;

            var state = this.facetStateProvider.getFacetState(path);
			
            if(state) {
                var resultRange = state.getResultRange();
                
                limit = resultRange.getLimit();
                offset = resultRange.getOffset();
            }
			
            var countPromise = this.facetService.fetchFacetCount(path, false);
			
			var childFacetsPromise = this.facetService.fetchFacets(path, false, limit, offset);
//            promise.done(function(facetItems) {
			
			var promises = [countPromise, childFacetsPromise];
			
            $.when.apply(window, promises).done(function(childFacetCount, facetItems) {
			
				var data = [];
				
				var childPromises = [];
				
				var i = 0;
				_(facetItems).each(function(facetItem) {
					
					var path = facetItem.getPath();

										
					var uri = facetItem.getNode().getUri();
					
					var isExpanded = self.expansionSet.contains(path);
					//var childPath = path.copyAppendStep(new facete.Step(uri, false));

					// Check if the node corresponding to the path is expanded so
					// that we need to fetch the child facets
					//var facetState = this.facetStateProvider.getFacetState(path);

//					console.log("facetState:", childFacetState);
//					console.log("childPath:" + childPath);
					//console.log("childPath:" + facetItem.getPath());

					
					var dataItem = {
						item: facetItem,
						isExpanded: isExpanded,
						//state: facetState,
						children: null,
						childFacetCount: childFacetCount,
						limit: limit,
						offset: offset
					};
					++i;

					data.push(dataItem);
					
					// TODO: Fetch the distinct value count for the path
					if(!isExpanded) {
						return;
					}
//					if(!(facetState && facetState.isExpanded())) {
//						return;
//					}
					console.log("Got a child facet for path " + path + ' with ' + childFacetCount + ' children');
					
					var childPromise = self.fetchFacetTreeRec(path).pipe(function(childItems) {
						dataItem.children = childItems;
					});

					childPromises.push(childPromise);
				});

				
				$.when.apply(window, childPromises)
					.done(function() {

//						var data = [];
//						_(arguments).each(function(arg) {
//							console.log('got arg', arg);
//						});
//						
//						var item = {
//							path: path,
//							distinctValueCount: 
//						};
						
						result.resolve(data);
					}).
					fail(function() {
						result.fail();
					});
				
			});
			
			return result.promise();
		}
	});
	
	
	ns.FacetService = Class.create({
		fetchFacets: function(path, isInverse) {
			throw "Override me";
		}
	});
	
	
	ns.FacetItem = Class.create({
	    /**
	     * doc: The json document returned via the sponate mapping of the labelMap.
	     * Should at least contain the fields 'displayLabel' and 'hiddenLabels'.
	     * 
	     */
		initialize: function(path, node, distinctValueCount, tags, doc) {
			this.path = path;
			this.node = node;
			this.distinctValueCount = distinctValueCount;
			this.tags = tags || {};
			this.doc = doc || {};
		},

//		getUri: functino() {
//			return node.getUri 
//		},
		getNode: function() {
			return this.node;
		},
		
		getPath: function() {
			return this.path;
		},
		
		getDoc: function() {
		    return this.doc;
		},

		setDoc: function(doc) {
		    this.doc = doc;
		},
		
		getDistinctValueCount: function() {
			return this.distinctValueCount;
		},
		
		getTags: function() {
		    return this.tags;
		},
		
		setTags: function(tags) {
		    this.tags = tags;
		}
	});
	
	
	   ns.FacetFetchingWorkflow = Class.create({
	        execute: function(sparqlService, labelMap) {
	            
	        }
	    });


	ns.FacetServiceImpl = Class.create(ns.FacetService, {
		initialize: function(sparqlService, facetConceptGenerator, labelMap, pathTaggerManager) {
			this.sparqlService = sparqlService;
			this.facetConceptGenerator = facetConceptGenerator;
			this.labelMap = labelMap;
			this.pathTaggerManager = pathTaggerManager;
		},
		
		getTags: function(path) {
            var result = this.pathTaggerManager.createTags(path);
            return result;
		},
		
		/*
		getFacetConfig: function() {
		    var result = new facete.FacetConfig();
		    result.setPathTaggerManager(this.pathTaggerManager);
		    return result;
		},
		*/

/*		
		createConceptFacetValues: function(path, excludeSelfConstraints) {
			var concept = this.facetConceptGenerator.createConceptResources(path, excludeSelfConstraints);
			return concept;
		},
*/
	
		createFlow: function(path, isInverse, filterString) {

		    var labelStore = new sponate.StoreFacade(this.sparqlService, {});//, cacheFactory);
		    labelStore.addMap(this.labelMap, 'labels');

		    
		    var concept = this.facetConceptGenerator.createConceptFacets(path, isInverse);
		    
            var criteria = {};
            if(filterString) {
                criteria = {$or: [
                    {hiddenLabels: {$elemMatch: {id: {$regex: filterString, $options: 'i'}}}},
                    {id: {$regex: filterString, $options: 'i'}}
                ]};
            }

		    
		    var result = labelStore.labels.find(criteria).concept(concept, true);
		    return result;
		},
		
		fetchFacetCount: function(path, isInverse) {
            var concept = this.facetConceptGenerator.createConceptFacets(path, isInverse);
            
            //var groupVar = facetConcept.getFacetVar();
            var outputVar = rdf.NodeFactory.createVar('_c_');
//            var countVar = concept.getVar();
//            var elements = concept.getElements();
        
            //var query = ns.QueryUtils.createQueryCount(elements, null, countVar, outputVar, null, true); 

            var query = ns.ConceptUtils.createQueryCount(concept, outputVar);

            var qe = this.sparqlService.createQueryExecution(query);
            
            var promise = service.ServiceUtils.fetchInt(qe, outputVar);

            return promise;
		},
		
		
		/**
		 * Fetches *ALL* facets and their corresponding counts with a single query.
		 * 
		 * TODO The result should be cached, and limit/offset should then work on the cache
		 * 
		 */
		fetchFacets2: function(path, isInverse, limit, offset) {
            var facetConcept = this.facetConceptGenerator.createConceptFacetsCore(path, isInverse, false);

            var elements = facetConcept.getElements();
            var groupVar = facetConcept.getFacetVar();
            var countVar = facetConcept.getFacetValueVar();
            
            var outputVar = rdf.NodeFactory.createVar('_c_');
            
            var query = ns.QueryUtils.createQueryCount(elements, null, countVar, outputVar, [groupVar], true);
            
            var countExpr = query.getProject().getExpr(outputVar);
            //console.log('sort cond: ' + countExpr);
            query.getOrderBy().push(new sparql.SortCondition(countExpr, -1));
            
            //console.log('All facet query: ' + query);
            
            //query.getOrderBys().add(new sparql.SortCondition(countVar))
            var promise = this.sparqlService.createQueryExecution(query).execSelect();
            
            var result = promise.pipe(function(rs) {
                var r = [];
                while(rs.hasNext()) {
                    var binding = rs.nextBinding();
                    
                    var property = binding.get(groupVar);
                    var dvc = binding.get(outputVar);
                    
                    var propertyName = property.getUri();
                    var distinctValueCount = dvc.getLiteralValue();
                    
                    var step = new ns.Step(propertyName, isInverse);
                    var childPath = path.copyAppendStep(step);
                    var item = new ns.FacetItem(childPath, property, distinctValueCount);


                    r.push(item);
                }

                return r;
            });
            

            // Apply tags
            var tmp = this.pipeTagging(result);
            return tmp;
            
            //result = this.pipeTagging(result);
            //return result;
		},
		
		
		pipeTagging: function(promise) {
		    var self = this;
		    
            var result = promise.pipe(function(items) {
                //ns.FacetTreeUtils.applyTags(items, self.pathTagger);
                
                _(items).each(function(item) {
                    //self.pathTaggerManager.applyTags(item);
                    //ns.FacetTreeUtils.applyTags(self.pathTaggerManager, item);
                    var tags = self.pathTaggerManager.createTags(item.getPath());
                    item.setTags(tags);
                });
                
                return items;
            });

            return result;
		},
		
		fetchFacetsFromFlow: function(flow, path, isInverse) {
            var promise = flow.asList(true); // Retains RDF nodes
		    
            var deferred = $.Deferred();

            var self = this;
	        promise.done(function(docs) {
	            /*
	            var properties = _(docs).map(function(doc) {
	                return rdf.NodeFactory.parseRdfTerm(doc.id);
	            });
	            */
	            var map = util.MapUtils.indexBy(docs, 'id');
	            var properties = _(docs).pluck('id');

	            if(properties.length === 0) {
                    deferred.resolve([]);
                    return;
	            }

                var promise = self.fetchFacetValueCounts(path, isInverse, properties, false);

                promise.done(function(r) {
                    console.log('PropertyCounts', r);
                    
                    // This feels a bit hacky, as it sets an attribute on another functions result
                    _(r).each(function(item) {
                        var doc = map.get(item.getNode());
                        item.setDoc(doc);
                    });
                    
                    deferred.resolve(r);
                }).fail(function() {
                    deferred.fail();
                });

	        }).fail(function() {
	           deferred.fail();
	        });
	        
            // Apply tags
	        var tmp = this.pipeTagging(deferred);
	        return tmp.promise();

            //deferred = this.pipeTagging(deferred);
	        //return deferred.promise(); 
		},
		
		
		/**
		 * Retrieve information about a single facet instead of its children
		 */
		fetchFacet: function(path) {
		    var scanLimit = 1000;

		    var outputVar = rdf.NodeFactory.createVar();
		    var concept = this.facetConceptGenerator.createConceptResources(path, false, scanLimit);
		    // TODO Thresholded count
            //var countQuery = ns.QueryUtils.createQueryCount(concept.getElements(), scanLimit, concept.getVar(), outputVar, null, false);
            var query = ns.ConceptUtils.createQueryCount(concept, outputVar); // scanLimit
            var qe = this.sparqlService.createQueryExecution(query);
            var promise = service.ServiceUtils.fetchInt(qe, outputVar);
            
            var self = this;
            var p2 = promise.pipe(function(count) {
                var node = path.isEmpty() ? rdf.NodeFactory.createUri('http://root') : rdf.NodeFactory.createUri(path.getLastStep().getPropertyName());
                var r = new ns.FacetItem(path, node, count, null, null);

                // FIXME: item cannot be resolved
                var tags = self.pathTaggerManager.createTags(item.getPath());
                item.setTags(tags);
                
                return r;
            });
            
            return p2;		    
		},

		
		/**
		 * TODO Superseded by fetchFacetsFromFlow
		 * 
		 * This strategy first fetches a list of properties,
		 * and only for the list members does to counting,
		 * this way, ordering by count is supported
		 * 
		 */
		fetchFacets: function(path, isInverse, limit, offset) {
		    
//		    this.fetchFacetCount(path, isInverse).done(function(cnt) {
//		        console.log('Number of facets at ' + path + ': ' + cnt); 
//		    });
		    
			var concept = this.facetConceptGenerator.createConceptFacets(path, isInverse);
			
			var query = ns.ConceptUtils.createQueryList(concept);
			//alert("" + query);
			query.setLimit(limit);
			query.setOffset(offset);
			
			//var query = this.facetQueryGenerator.createQueryFacets();
			
			var qe = this.sparqlService.createQueryExecution(query);
			
			var promise = service.ServiceUtils.fetchList(qe, concept.getVar());

			
			var self = this;
			
			var deferred = $.Deferred();

			promise.done(function(properties) {
				var promise = self.fetchFacetValueCounts(path, isInverse, properties, false);
				
				promise.done(function(r) {
	                console.log('PropertyCounts', r);
					deferred.resolve(r);
				}).fail(function() {
					deferred.fail();
				});

			}).fail(function() {
				deferred.fail();
			});
			
			
			return deferred.promise();
		},
		
		
		fetchFacetValueCountsThresholded: function(path, isInverse, properties, isNegated, scanLimit, maxQueryLength) {
		    scanLimit = 10000;
		    // Check the scan counts (i.e. how many triples we would have to scan in order to compute the counts of distinct values)
		    var querySpecs = this.createQuerySpecsFacetValueScanCounts(path, isInverse, properties, isNegated, scanLimit, maxQueryLength);
		    var promise = this.processQuerySpecsFacetValueCounts(path, isInverse, properties, querySpecs);
		    
		    var result = jQuery.Deferred();
		    
		    var self = this;
		    promise.done(function(facetItems) {
		        var selectiveItems = _(facetItems).filter(function(x) {
		            return x.getDistinctValueCount() < scanLimit;
		        });

		        var selectiveProperties = _(selectiveItems).map(function(x) {
		            return x.getNode();
		        });

                // Check which properties had scan counts below the threshold
		        
		        var p = self.fetchFacetValueCountsFull(path, isInverse, selectiveProperties, isNegated, scanLimit);
		        
		        p.done(function(fis) {
                    var selectivePropertyNameToItem = _(fis).indexBy(function(x) { return x.getNode().getUri(); });

                    var r = _(properties).map(function(property) {
                        var propertyName = property.getUri();
                        var item = selectivePropertyNameToItem[propertyName];

                        if(!item) {
                            var distinctValueCount = -1;
                            
                            var step = new ns.Step(propertyName, isInverse);
                            var childPath = path.copyAppendStep(step);
                            var item = new ns.FacetItem(childPath, property, distinctValueCount);                            
                        }
                        
                        return item;
		            });
		            
                    result.resolve(r);
		            
		        }).fail(function() {
		           result.fail.apply(this, arguments); 
		        });
		        
		        
		        
		        
		    }).fail(function() {
		        result.fail.apply(this, arguments);
		    });
		    
            // Apply tags
		    var tmp = this.pipeTagging(result);
		    return tmp;
		    
            //result = this.pipeTagging(result);
		    //return result;
		},
		
		/**
		 * Variation of fetchFacetValueCounts that adds only counts of to a certain limit for each property
		 * 
		 * @param path
		 * @param isInverse
		 * @param properties
		 * @param isNegated - Not supported yet with this strategy / requires fetching ALL properties first
		 */
		createQuerySpecsFacetValueScanCounts: function(path, isInverse, properties, isNegated, scanLimit, maxQueryLength) {
		    
		    if(isNegated) {
		        console.log('Negated property sets not (yet) supported with thresholded counting strategy');
		        throw 'Bailing out';
		    }
		    
	        var outputVar = rdf.NodeFactory.createVar('_c_');

	        // TODO Hack: We assume that the var is called this way, but we need to ensure this
	        var groupVar = rdf.NodeFactory.createVar('p_1');
		    
	        var self = this;
		    var unionMembers = _(properties).map(function(property) {
		        
	            var facetConceptItems = self.facetConceptGenerator.createConceptFacetValues(path, isInverse, [property], isNegated);
		        var facetConceptItem = facetConceptItems[0];
		        
                var facetConcept = facetConceptItem.getFacetConcept();
                
                var groupVar = facetConcept.getFacetVar();
                var countVar = facetConcept.getFacetValueVar(); 
                var elements = facetConcept.getElements();
            
                
                /*
                var limitQuery = new sparql.Query();
                var limitElements = limitQuery.getElements();

                limitQuery.getProject().add(groupVar);
                limitQuery.getProject().add(countVar);

                limitElements.push.apply(limitElements, elements);
                limitQuery.setLimit(scanLimit);
                */
                
                /*
                var distinctQuery = new sparql.Query();
                distinctQuery.setDistinct(true);
                distinctQuery.getProject().add(groupVar);
                distinctQuery.getProject().add(countVar);
                distinctQuery.getElements().push(new sparql.ElementSubQuery(limitQuery));
                distinctQuery.setLimit(limit);
                */
                
                
                //var subElement = new sparql.ElementSubQuery(limitQuery);
                //var subElement = new sparql.ElementSubQuery(distinctQuery);
                
                //var countQuery = ns.QueryUtils.createQueryCount([subElement], null, countVar, outputVar, [groupVar], false);
                var countQuery = ns.QueryUtils.createQueryCount(elements, scanLimit, countVar, outputVar, [groupVar], false);
                
                // TODO: The count is just a check for the scan counts, but not for the distinct values...
                // This means, for each p1 that is below the scan limit, we can do another query
                
                //var countQuery = ns.QueryUtils.createQueryCount(elements, null, countVar, outputVar, [groupVar], true);
                
                return countQuery;
		    });
		    
		    // For each union query group...		    
		    var finalQuery;
		    if(unionMembers.length > 1) {
		        var unionElements = _(unionMembers).map(function(query) {
		            var r = new sparql.ElementSubQuery(query);
		            return r;
		        });
		        
		        var elementUnion = new sparql.ElementUnion(unionElements);		    
		        
                finalQuery = new sparql.Query();
		        finalQuery.getProject().add(groupVar);
		        finalQuery.getProject().add(outputVar);

		        var finalElements = finalQuery.getElements();
                finalQuery.getElements().push(elementUnion);
		    }
		    else if(unionMembers.length === 1) {
		        finalQuery = unionMembers[0];
		    }
		    else {
		        console.log('Should not happen');
		        throw 'Should not happen';
		    }
		    
		    var querySpec = {
		        query: finalQuery,
		        groupVar: groupVar,
		        //countVar: outputVar
		        outputVar: outputVar
		    };
		    
		    var result = [querySpec];
		    
		    return result;
		},
		
		processQuerySpecsFacetValueCounts: function(path, isInverse, properties, querySpecs) {
            var nameToItem = {};
            
            _(properties).each(function(property) {
                var propertyName = property.getUri();
                
                nameToItem[propertyName] = {
                    property: property,
                    distinctValueCount: 0
                }
            });

            var self = this;
            var promises = _(querySpecs).map(function(querySpec) {
                
                //var facetConcept = item.getFacetConcept();
                
                var query = querySpec.query;
                var groupVar = querySpec.groupVar;
                //var countVar = querySpec.countVar;
                var outputVar = querySpec.outputVar;
                
                var qe = self.sparqlService.createQueryExecution(query);
                
                
                var promise = qe.execSelect().pipe(function(rs) {
                    
                    // Overwrite entries based on the result set
                    while(rs.hasNext()) {
                        var binding = rs.nextBinding();
                        
                        var property = binding.get(groupVar);
                        var propertyName = property.getUri();
                        
                        var distinctValueCount = binding.get(outputVar).getLiteralValue();
                                            
                        nameToItem[propertyName] = {
                            property: property,
                            distinctValueCount: distinctValueCount
                        }
                    }
                });
                
                //console.log("Test: " + query);
                return promise;
            });

            var d = $.Deferred();
            $.when.apply(window, promises).done(function() {
                
                // Create the result                    
                var r = _(properties).map(function(property) {
                    var propertyName = property.getUri();
                    var item = nameToItem[propertyName];

                    var distinctValueCount = item.distinctValueCount;
                    
                    var step = new ns.Step(propertyName, isInverse);
                    var childPath = path.copyAppendStep(step);
                    var tmp = new ns.FacetItem(childPath, property, distinctValueCount);
                    return tmp
                });
                
                //return r;

                
//              var r = [];
//              
//              for(var i = 0; i < arguments.length; ++i) {
//                  var items = arguments[i];
//                  //alert(items);
//                  
//                  r.push.apply(r, items);
//              }

                d.resolve(r);
            }).fail(function() {
                d.fail();
            });

            return d.promise();

		},
		
		
		//elements, limit, variable, outputVar, groupVars, useDistinct, options
		/**
		 * Returns the distinctValueCount for a set of properties at a given path
		 * 
		 * Creates a query of the form
		 * Select ?p Count(*) As ?c {
		 *     { /facet constraints with some var such as ?s/ }
		 *     ?s ?p ?o .
		 *     Filter(?p In (/given list of properties/))
		 * }
		 * 
		 */
		fetchFacetValueCounts: function(path, isInverse, properties, isNegated) {
		    //var result = fetchFacetValueCountsFull(path, isInverse, properties, isNegated);
		    var result = this.fetchFacetValueCountsThresholded(path, isInverse, properties, isNegated);
		    
		    return result;
		},
		
		fetchFacetValueCountsFull: function(path, isInverse, properties, isNegated) {
			var facetConceptItems = this.facetConceptGenerator.createConceptFacetValues(path, isInverse, properties, isNegated);
			

			var outputVar = rdf.NodeFactory.createVar('_c_');
			
						
            // Initialize the result
            // TODO Actually we don't need to store the property - we could map to
            // the distinct value count directly
            var nameToItem = {};
            
            _(properties).each(function(property) {
                var propertyName = property.getUri();
                
                nameToItem[propertyName] = {
                    property: property,
                    distinctValueCount: 0
                }
            });

			
			var self = this;
			var promises = _(facetConceptItems).map(function(item) {
			
				var facetConcept = item.getFacetConcept();
				
				var groupVar = facetConcept.getFacetVar();
				var countVar = facetConcept.getFacetValueVar(); 
				var elements = facetConcept.getElements();
			
				var query = ns.QueryUtils.createQueryCount(elements, null, countVar, outputVar, [groupVar], true); 
				
				var qe = self.sparqlService.createQueryExecution(query);
				
				//qe.setTimeout()
				
				
				var promise = qe.execSelect().pipe(function(rs) {
				    
				    // Overwrite entries based on the result set
					while(rs.hasNext()) {
						var binding = rs.nextBinding();
						
						var property = binding.get(groupVar);
						var propertyName = property.getUri();
						
						var distinctValueCount = binding.get(outputVar).getLiteralValue();
											
						nameToItem[propertyName] = {
						    property: property,
						    distinctValueCount: distinctValueCount
						}
					}
				});
				
				//console.log("Test: " + query);
				return promise;
			});
			
	
			var d = $.Deferred();
			$.when.apply(window, promises).done(function() {
			    
                // Create the result                    
                var r = _(properties).map(function(property) {
                    var propertyName = property.getUri();
                    var item = nameToItem[propertyName];

                    var distinctValueCount = item.distinctValueCount;
                    
                    var step = new ns.Step(propertyName, isInverse);
                    var childPath = path.copyAppendStep(step);
                    var tmp = new ns.FacetItem(childPath, property, distinctValueCount);
                    return tmp
                });
                
                //return r;

			    
//				var r = [];
//				
//				for(var i = 0; i < arguments.length; ++i) {
//					var items = arguments[i];
//					//alert(items);
//					
//					r.push.apply(r, items);
//				}

				d.resolve(r);
			}).fail(function() {
				d.fail();
			});

			return d.promise();
		}
	});
	
	
	
	
	// Below code needs to be ported or removed
	
	var Todo = {
	
		/**
		 * Tries to count all pages. If it fails, attempts to count the
		 * pages within the current partition
		 */
		refreshPageCount: function() {
			//console.log("Refreshing page count");

			var self = this;

			if(!this.tableExecutor) {
				self.paginatorModel.set({pageCount: 1});
				return;
			}

			var result = $.Deferred();

			//console.log('isLoading', self.tableModel.attributes);
			self.paginatorModel.set({isLoadingPageCount: true});
			
			var successAction = function(info) {				
				self.tableModel.set({
					itemCount: info.count,
					hasMoreItems: info.more
				});
				
				self.paginatorModel.set({
					isLoadingPageCount: false
				});
				
				result.resolve();
			};
				
			
			// Experiment with timeouts:
			// If the count does not return within 'timeout' seconds, we try to count again
			// with a certain threshold
			var sampleSize = 10000;
			var timeout = 3000;
			
			
			var task = this.tableExecutor.fetchResultSetSize(null, null, { timeout: timeout });
			
			
			task.fail(function() {
				
				console.log("[WARN] Timeout encountered when retrieving page count - retrying with sample strategy");
				
				var sampleTask = self.tableExecutor.fetchResultSetSize(
					sampleSize,
					null,
					{ timeout: timeout }
				); 

				sampleTask.pipe(successAction);
				
				sampleTask.fail(function() {
					console.log("[ERROR] Timout encountered during fallback sampling strategy - returning only 1 page");
					
					self.paginatorModel.set({
						isLoadingPageCount: false
					});

					result.resolve({
						itemCount: 1,
						hasMoreItems: true
					});
					
				})
				
			});
			
			
			task.pipe(successAction);
		},
		
		omfgWhatDidIDo_IWasABadProgrammer: function() {
		
			
			/*
			 * For each obtained concept, fetch the facets and facet counts  
			 */
			var promises = [];			
			for(var i = 0; i < conceptItems.length; ++i) {
				var conceptItem = conceptItems[i];
				//console.log("Fetching data for concept item: ", conceptItem);
				var promise = this.fnFetchSubFacets(this.sparqlService, conceptItem);
				promises.push(promise);
			}
			
	
			//console.log("GenericConcept: " + concept, concept.isSubjectConcept());
	
	
			var children = model.get("children");
			//var syncer = new backboneUtils.CollectionCombine(children);
	
			// Get the facets of the concept
			var tmpPromises = _.map(this.facetProviders, function(facetProvider) {
				// TODO: We do not want the facets of the concept,
				// but of the concept + constraints
				
				// This means: We need to get all constraints at the current path -
				// or more specifically: All steps.
				
				
				var tmp = facetProvider.fetchFacets(concept, false, constrainedSteps);
	
				var promise = tmp.pipe(function(items) {
	
	
					var mapped = [];
					for(var i = 0; i < items.length; ++i) {
						var item = items[i];
	
						//var mapped = _.map(items, function(item) {
	
						var facetUri = item.facetUri;
						var isInverse = item.isInverse;
	
						var step = {
							type: 'property',
							property: facetUri,
							isInverse: isInverse
						};
						
						var subFacadeNode = facetFacadeNode.forProperty(facetUri, isInverse);
						
						/*
						item = {
								facetFacadeNode: subNode,
								step: step
						};
						*/
						item.facetFacadeNode = subFacadeNode;
						item.facetNode = subFacadeNode.getFacetNode();
						item.step = step;
	
						mapped.push(item);
					}
						//console.log("Mapped model:", item);
	
						//return item;
					//});
	
					return mapped;
				});
	
				return promise;
			});
	
			model.set({
				isLoading : true
			});
	
			promises.push.apply(promises, tmpPromises);
	
			//console.log("[DEBUG] Number of promises loading " + promises.length, promises);
			
			var finalPromise = $.when.apply(null, promises);
			
			finalPromise.always(function() {
				model.set({
					isLoading : false
				});
			});
	
			
				
			var reallyFinalPromise = $.Deferred();
				
			finalPromise.pipe(function() {
				
				
				
				//console.log("Arguments: ", arguments);
				var items = [];
				for(var i = 0; i < arguments.length; ++i) {
					var args = arguments[i];
					
					items.push.apply(items, args);
				}
	
	            var itemIds = [];
	            for(var i = 0; i < items.length; ++i) {
	                var item = items[i];
	                var itemId = item.id;
	                itemIds.push(itemId);
	            }
	
	
	            // Find all children, whose ID was not yeld
	            var childIds = children.map(function(child) {
	                return child.id;
	            });
	
	
	            var removeChildIds = _.difference(childIds, itemIds);
	            children.remove(removeChildIds);
	/*
	            for(var i = 0; i < removeChildIds.length; ++i) {
	                var childId = removeChildIds
	            }
	*/
	
				for(var i = 0; i < items.length; ++i) {
					var item = items[i];
					
					var previous = children.get(item.id);
					if(previous) {
						var tmp = item;
						item = previous;
						item.set(tmp);
					} else {
						children.add(item);
					}
				}
	
				var subPromises = [];
				children.each(function(child) {
					var facetFacadeNode = child.get('facetFacadeNode');
					var subPromise = self.updateFacets(child, facetFacadeNode);
					subPromises.push(subPromise);
				});
				
				var task = $.when.apply(null, subPromises);
				
				task.done(function() {
					reallyFinalPromise.resolve();					
				}).fail(function() {
					reallyFinalPromise.fail();
				});
				
				/*
				_.each(items, function(item) {
					item.done(function(a) {
						console.log("FFS", a);
					});
				});*/
				/*
				console.log("Children", children);
				console.log("Items", items);
				for(var i = 0; i < items.length; ++i) {
					var item = items[i];
					console.log("Child[" + i + "]: ", item); // + JSON.stringify(items[i]));
				}
				children.set(items);
				console.log("New children", children);
				*/
		});
		}
	};

})(jQuery);

(function() {

    var sponate = Jassa.sponate;

    var ns = Jassa.facete;
    
    
    ns.FacetValueService = Class.create({
        initialize: function(sparqlService, facetTreeConfig) {
            this.sparqlService = sparqlService;
            this.facetTreeConfig = facetTreeConfig;
        },
      
        getFacetTreeConfig: function() {
            return this.facetTreeConfig;
        },
        
        createFacetValueFetcher: function(path, filterText, excludeSelfConstraints) {

            excludeSelfConstraints = excludeSelfConstraints || true;
            
            var facetConfig = this.facetTreeConfig.getFacetConfig();

            var facetConceptGenerator = ns.FaceteUtils.createFacetConceptGenerator(facetConfig);
            var concept = facetConceptGenerator.createConceptResources(path, excludeSelfConstraints);
            var constraintTaggerFactory = new ns.ConstraintTaggerFactory(facetConfig.getConstraintManager());
            
            var store = new sponate.StoreFacade(this.sparqlService);
            var labelMap = sponate.SponateUtils.createDefaultLabelMap();
            store.addMap(labelMap, 'labels');
            var labelsStore = store.labels;
            
            var criteria = {};
            if(filterText) {
                criteria = {$or: [
                    {hiddenLabels: {$elemMatch: {id: {$regex: filterText, $options: 'i'}}}},
                    {id: {$regex: filterText, $options: 'i'}}
                ]};
            }
            var baseFlow = labelsStore.find(criteria).concept(concept, true);

            var result = new ns.FacetValueFetcher(baseFlow, this.facetTreeConfig, path);
            return result;
        }
    });

    
    ns.FacetValueFetcher = Class.create({
                
        initialize: function(baseFlow, facetTreeConfig, path) {
            this.baseFlow = baseFlow;
            this.facetTreeConfig = facetTreeConfig;
            this.path = path;
        },
        
        fetchCount: function() {
            var countPromise = this.baseFlow.count();
            return countPromise;
        },
        
        fetchData: function(offset, limit) {
            
            var dataFlow = this.baseFlow.skip(offset).limit(limit);

            var self = this;

            var dataPromise = dataFlow.asList(true).pipe(function(docs) {
                var path = self.path;
                
                var facetConfig = self.facetTreeConfig.getFacetConfig();
                var constraintTaggerFactory = new ns.ConstraintTaggerFactory(facetConfig.getConstraintManager());
                
                var tagger = constraintTaggerFactory.createConstraintTagger(path);
                
                var r = _(docs).map(function(doc) {
                    // TODO Sponate must support retaining node objects
                    //var node = rdf.NodeFactory.parseRdfTerm(doc.id);
                    var node = doc.id;
                    
                    var label = doc.displayLabel ? doc.displayLabel : '' + doc.id;
                    //console.log('displayLabel', label);
                    var tmp = {
                        displayLabel: label,
                        path: path,
                        node: node,
                        tags: tagger.getTags(node)
                    };

                    return tmp;
                    
                });

                return r;
            });
            
            return dataPromise;
        }
    });

    
    
    
/*    
    // TODO This class is NOT used yet - its purpose is to make the FacetValueListCtrl simpler 
    ns.FacetValueService = Class.create({
        initialize: function(facetService, facetConceptGenerator, constraintTaggerFactory) {
            this.sparqlService = sparqlService;
            this.facetService = facetService;
            this.constraintTaggerFactory = constraintTaggerFactory;
        },
       
        fetchFacetValues: function(path, excludeSelfConstraints) {
            var facetService = this.facetService;
            var constraintTaggerFactory = this.constraintTaggerFactory;


            var concept = facetConceptGenerator.createConceptResources(path, excludeSelfConstraints);

            var concept = facetService.createConceptFacetValues(path, true);
            var countVar = rdf.NodeFactory.createVar("_c_");
            var queryCount = facete.ConceptUtils.createQueryCount(concept, countVar);
            var qeCount = qef.createQueryExecution(queryCount);
            var countPromise = service.ServiceUtils.fetchInt(qeCount, countVar);
            
            var query = facete.ConceptUtils.createQueryList(concept);           
            
            

            
            var pageSize = 10;
            
            query.setLimit(pageSize);
            query.setOffset(($scope.currentPage - 1) * pageSize);
            
            var qe = qef.createQueryExecution(query);
            var dataPromise = service.ServiceUtils.fetchList(qe, concept.getVar()).pipe(function(nodes) {

                var tagger = constraintTaggerFactory.createConstraintTagger(path);
                
                var r = _(nodes).map(function(node) {
                    var tmp = {
                        path: path,
                        node: node,
                        tags: tagger.getTags(node)
                    };

                    return tmp;
                });

                return r;
            });
            
            var result = {
                countPromise: countPromise,
                dataPromise: dataPromise
            };
            
            return result;
        }
    });
  
*/

})();
(function() {

    var util = Jassa.util;
    var rdf = Jassa.rdf;
    
    // TODO Get rid of this dependency :/
    var sponate = Jassa.sponate;
    
    var ns = Jassa.facete;
    
    ns.FacetConfig = Class.create({
        classLabel: 'jassa.facete.FacetConfig',
        
        initialize: function(baseConcept, rootFacetNode, constraintManager, labelMap, pathTaggerManager) {
            this.baseConcept = baseConcept;
            
            // TODO ISSUE: We may modify the rootFacetNode during an update cycle, which triggers a new cycle, and thus
            // negatively impacts performance. The easiest solution would be to exclude this method from the watch list.
            this.rootFacetNode = rootFacetNode;
            this.constraintManager = constraintManager;
            
            this.labelMap = labelMap || sponate.SponateUtils.createDefaultLabelMap(); 
            this.pathTaggerManager = pathTaggerManager || new ns.ItemTaggerManager();
        },
        
        getBaseConcept: function() {
            return this.baseConcept;
        },
        
        setBaseConcept: function(baseConcept) {
            this.baseConcept = baseConcept;
        },
        
        getRootFacetNode: function() {
            return this.rootFacetNode;
        },
        
        setRootFacetNode: function(rootFacetNode) {
            this.rootFacetNode = rootFacetNode;
        },
        
        getConstraintManager: function() {
            return this.constraintManager;
        },
        
        setConstraintManager: function(constraintManager) {
            this.constraintManager = constraintManager;
        },
        
        getLabelMap: function() {
            return this.labelMap;
        },
        
        setLabelMap: function(labelMap) {
            this.labelMap = labelMap;
        },
        
        getPathTaggerManager: function() {
            return this.pathTaggerManager;
        },

        /**
         * The purpose of this method is to detect changes in the configuration!
         * TODO rely on hash codes from child components
         * 
         */
        hashCode: function() {
            
            // We omit the facetNode attribute, as this one should not be changed 'on the outside' anyway;
            // internal changes cause angular's digest loop to execute twice
            // TODO HACK We shouldn't abuse hashCode() for hacking about issues which are specific to how we do things with angular
            var shallowCopy = _(this).omit('rootFacetNode');
            
            var result = util.ObjectUtils.hashCode(shallowCopy, true);
            return result;
        }
        
        // The following attributes are pretty much UI dependent
        // facetStateProvider, pathToFilterString, expansionSet
    });

    ns.FacetConfig.createDefaultFacetConfig = function() {
        var baseVar = rdf.NodeFactory.createVar("s");
        var baseConcept = ns.ConceptUtils.createSubjectConcept(baseVar);
        //var sparqlStr = sparql.SparqlString.create("?s a ?t");
        //var baseConcept = new ns.Concept(new sparql.ElementString(sparqlStr));
        var rootFacetNode = ns.FacetNode.createRoot(baseVar);

        var constraintManager = new ns.ConstraintManager();
        
        var result = new ns.FacetConfig(baseConcept, rootFacetNode, constraintManager);
        return result;
    };


    /**
     * 
     * ExpansionSet: Whether a path is expanded at all
     * ExpansionMap: If a path is expanded, whether to fetch the incoming or outgoing properties or both
     * 
     */
    ns.FacetTreeConfig = Class.create({
        classLabel: 'jassa.facete.FacetTreeConfig',
        
        initialize: function(facetConfig, labelMap, expansionSet, expansionMap, facetStateProvider, pathToFilterString) {
            this.facetConfig = facetConfig || ns.FacetConfig.createDefaultFacetConfig();

            //this.labelMap = labelMap; // TODO Use some default (shouldn't the label map be part of the facetConfig???)
            this.expansionSet = expansionSet || new util.HashSet();
            this.expansionMap = expansionMap || new util.HashMap();
            this.facetStateProvider = facetStateProvider || new ns.FacetStateProviderImpl(10);
            this.pathToFilterString = pathToFilterString || new util.HashMap();
        },
        
        getFacetConfig: function() {
            return this.facetConfig;
        },
        
        setFacetConfig: function(facetConfig) {
            this.facetConfig = facetConfig;
        },
        
//        getLabelMap: function() {
//            return this.labelMap;
//        },
        
        getExpansionSet: function() {
            return this.expansionSet;
        },

        getExpansionMap: function() {
            return this.expansionMap;
        },
        
        getFacetStateProvider: function() {
            return this.facetStateProvider;
        },
        
        getPathToFilterString: function() {
            return this.pathToFilterString;
        },
        
        /**
         * The purpose of this method is to detect changes in the configuration!
         * TODO rely on hash codes from child components
         * 
         */
        hashCode: function() {
            var result = util.ObjectUtils.hashCode(this, true);
            return result;
        }
    });

    
    /**
     * 
     * 
     * TODO Possibly rename to FaceteConfigUtils
     */
    ns.FaceteUtils = {
            createFacetConceptGenerator: function(facetConfig) {
                var baseConcept = facetConfig.getBaseConcept();
                var rootFacetNode = facetConfig.getRootFacetNode();
                var constraintManager = facetConfig.getConstraintManager();
                
                var result = this.createFacetConceptGenerator2(baseConcept, rootFacetNode, constraintManager);
                return result;
            },
            
            createFacetConceptGenerator2: function(baseConcept, rootFacetNode, constraintManager) {
                // Based on above objects, create a provider for the configuration
                // which the facet service can build upon
                var facetConfigProvider = new ns.FacetGeneratorConfigProviderIndirect(
                    new ns.ConceptFactoryConst(baseConcept),
                    new ns.FacetNodeFactoryConst(rootFacetNode),
                    constraintManager
                );
                
                var fcgf = new ns.FacetConceptGeneratorFactoryImpl(facetConfigProvider);
                var result = fcgf.createFacetConceptGenerator();
                
                return result;
            },
            
//            createFacetService: function(facetConfig) {
//                var result = this.createFacetService2(facetConfig.);
//            },
//            
            createFacetService: function(sparqlService, facetConfig) {
                var facetConceptGenerator = this.createFacetConceptGenerator(facetConfig);

                //labelMap = labelMap || sponate.SponateUtils.createDefaultLabelMap();
                
                var facetService = new ns.FacetServiceImpl(sparqlService, facetConceptGenerator, facetConfig.getLabelMap(), facetConfig.getPathTaggerManager());

                return facetService;
            },
            
            
            
            createFacetTreeService: function(sparqlService, facetTreeConfig) {


                var facetService = this.createFacetService(sparqlService, facetTreeConfig.getFacetConfig());
                
                var expansionSet = facetTreeConfig.getExpansionSet();
                var expansionMap = facetTreeConfig.getExpansionMap();
                var facetStateProvider = facetTreeConfig.getFacetStateProvider();
                var pathToFilterString = facetTreeConfig.getPathToFilterString();
                

                var facetTreeService = new ns.FacetTreeServiceImpl(facetService, expansionSet, expansionMap, facetStateProvider, pathToFilterString);

                return facetTreeService;

                //var constraintTaggerFactory = new ns.ConstraintTaggerFactory(constraintManager);       
                
                
                //var faceteConceptFactory = new ns.ConceptFactoryFacetService(facetService);
                
                
                //var result = new ns.ConceptSpace(facetTreeService);
                
                //return result;            
            },
            
            createFacetTreeTagger: function(pathToFilterString) {
                //var tableMod = new ns.FaceteTableMod(); 
                //tableMod.togglePath(new ns.Path());
                
                
                var pathTagger = new ns.ItemTaggerManager();
                //pathTagger.getTaggerMap()['table'] = new ns.ItemTaggerTablePath(tableMod);
                pathTagger.getTaggerMap()['filter'] = new ns.ItemTaggerFilterString(pathToFilterString);
                var facetTreeTagger = new ns.FacetTreeTagger(pathTagger);
                
                return facetTreeTagger;
            }

        };

    
    
})();
(function() {
	
	var service = Jassa.service;
	var rdf = Jassa.rdf;
	
	
	var facete = Jassa.facete;
	
	var ns = Jassa.facete;

	

	/**
	 * Example / Test about the API is supposed to work
	 * 
	 */
	ns.test = function() {
		var qef = new service.SparqlServiceHttp("http://localhost/sparql", []);

		var constraintManager = new facete.ConstraintManager();
		
		


		
		var baseVar = rdf.NodeFactory.createVar("s");
		//alert("test" + baseVar);
		var baseConcept = facete.ConceptUtils.createSubjectConcept(baseVar);
		var rootFacetNode = facete.FacetNode.createRoot(baseVar);
		var facetStateProvider = new facete.FacetStateProviderImpl();		
		
		var facetConfigProvider = new facete.FacetGeneratorConfigProviderIndirect(
			new facete.ConceptFactoryConst(baseConcept),
			new facete.FacetNodeFactoryConst(rootFacetNode),
			constraintManager
		);
		
		var fcgf = new ns.FacetConceptGeneratorFactoryImpl(facetConfigProvider);
		var facetConceptGenerator = fcgf.createFacetConceptGenerator();
		
		var facetService = new facete.FacetServiceImpl(qef, facetConceptGenerator);
		

		
//		constraintManager.addConstraint(new facete.ConstraintSpecPathValue(
//			"equal",
//			facete.Path.parse("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
//			sparql.NodeValue.makeNode(rdf.NodeFactory.createUri("http://www.w3.org/2002/07/owl#Class"))
//		));

		
		
		facetService.fetchFacets(facete.Path.parse("")).done(function(list) {
			
			//alert(JSON.stringify(list));
			
			_(list).each(function(item) {
				console.log("FacetItem: " + JSON.stringify(item));
			});
		});
		
		
		var cn = facetService.createConceptFacetValues(facete.Path.parse(""));
		console.log("FacetValues: " + cn);
		
		//var fqgf = facete.FacetQueryGeneratorFactoryImpl.createFromFacetConfigProvider(facetConfigProvider, facetStateProvider);

		
		//var queryGenerator = fqgf.createFacetQueryGenerator();
		
		//var facetConcept = queryGenerator.createFacetConcept(facete.Path.parse("http://foo"));
//		var facetConcept = queryGenerator.createQueryFacetList(facete.Path.parse(""));
//		
//		alert("" + facetConcept);
		
		
	};


	ns.testQueryApi = function() {
		var qef = new service.SparqlServiceHttp("http://localhost/sparql", []);
		var qe = qef.createQueryExecution("Select * { ?s ?p ?o } Limit 10");
		
		//qe.setTimeOut(3000);
		var s = rdf.NodeFactory.createVar("s");
		
		qe.execSelect().done(function(rs) {
			while(rs.hasNext()) {
				console.log("" + rs.nextBinding().get(s));
			}
		});
		
	};

	
})();
(function() {

    var rdf = Jassa.rdf;
    var sparql = Jassa.sparql;
    var util = Jassa.util;
    
    var ns = Jassa.facete;

    
    /**
     * 
     * 
     * @param sortDir Sort direction; {=0: unspecified, >0: ascending, <0 descending}
     * @param nullDir Whether to sort null values first or last
     * 
     * sortType: 'data' ordinary sort of the data , 'null' sort null values first or last
     * 
     */
    ns.SortCondition = Class.create({
        initialize: function(columnId, sortDir, sortType) {
            this.columnId = columnId;
            this.sortDir = sortDir == null ? 1 : sortDir;
            this.sortType = sortType || 'data';
        },
        
        getColumnId: function() {
            return this.columnId;
        },
        
        getSortType: function() {
            return this.sortType;
        },
        
        setSortType: function(sortType) {
            this.sortType = sortType;
        },
        
        getSortDir: function() {
            return this.sortDir;
        },
        
        setSortDir: function(sortDir) {
            this.sortDir = sortDir;
        }
    });
 
    /**
     * Note used yet.
     * searchMode: exact, regex, beginsWith, endsWith
     */
    ns.FilterString = Class.create({
        initialize: function(str, mode) {
            this.str = str;
            this.mode = mode;
        }
    });


    /**
     * @param id Id of the column - string recommended; cannot be modified once set
     * 
     */
    ns.ColumnView = Class.create({
        initialize: function(tableMod, columnId) {
            this.tableMod = tableMod;
            this.columnId = columnId;
           /*
           this.sortCondition = sortCondition || new ns.SortCondition();
           this.aggregator = aggregator || null;
           this.filter = filter || null;
           */
        },
       
        getId: function() {
            return this.columnId;
        },
       
        getSortConditions: function() {
            var result = {};

            var id = this.columnId;

            _(this.tableMod.getSortConditions()).each(function(sc) {
                var cid = sc.getColumnId();
                if(cid === id) {
                    var sortType = sc.getSortType();
                   
                    result[sortType] = sc.getSortDir();
                }
            });
           
            return result;
        },
       
        getAggregator: function() {
            var result = this.tableMod.getAggregator(this.columnId);
            return result;
        },
       
        setAggregator: function(aggregator) {
            //this.tableMod.setAggregator(this.columnId, aggregator);
            this.tableMod.getAggregators()[this.columnId] = aggregator;
        }
    });
    
    

    ns.Aggregator = Class.create({
        initialize: function(name, attrs) {
            this.name = name;
            this.attrs = attrs; // Optional attributes;
        },
        
        getName: function() {
            return this.name;
        },
        
        getAttrs: function() {
            return this.attrs;
        }
    });

    
    
    
    /**
     * Object that holds configuration for modifications to a table.
     * Needs to be interpreted by another object.
     * 
     * { myCol1: {sortDir: 1, aggName: sum, path: foo}, ... }
     * - sum(?varForFoo) As myCol1
     * 
     */
    ns.TableMod = Class.create({
        initialize: function() {
            this.columnIds = []; // Array of active column ids

            this.colIdToColView = {};
            this.sortConditions = []; // Array of sortConditions in which to apply sort conditions

            this.colIdToAgg = {};
            
            this.limitAndOffset = new ns.LimitAndOffset();
            
            this._isDistinct = true;
        },
        
        isDistinct: function() {
            return this._isDistinct;
        },
        
        setDistinct: function(isDistinct) {
            this._isDistinct = isDistinct;
        },
        
        getColumnIds: function() {
            return this.columnIds;
        },
        
        getColumn: function(id) {
            return this.colIdToColView[id];
        },
        
        // Returns the active columns
        getColumns: function() {
            var self = this;
            var result = _(this.columnIds).map(function(columnId) {
                var r = self.colIdToColView[columnId];
                
                return r;
            });
            
            
            return result;
        },
        
        getSortConditions: function() {
            return this.sortConditions;
        },
        
        getLimitAndOffset: function() {
            return this.limitAndOffset;
        },
        
        getAggregator: function(columnId) {
            var result = this.colIdToAgg[columnId];
            return result;
        },
        
        getAggregators: function() {
            return this.colIdToAgg;
        },
        
        //setAggregator: function()
        
        /**
         * Adds a column based on a ColumnState object.
         * 
         * @param suppressActive default: false; true: Do not add the id to the array of active columns 
         */
        addColumn: function(columnId, suppressActive) {
            var colView = this.colIdToColView[columnId];
            if(colView) {
                throw 'Column ' + columnId + ' already part of the table';
            }
            
            colView = new ns.ColumnView(this, columnId);            
            this.colIdToColView[columnId] = colView;
            
            if(!suppressActive) {
                this.columnIds.push(columnId);
            }
            
            // TODO Fail on duplicate
            /*
            var columnId = columnState.getId();
            this.columnIds.push(columnId);
            
            this.idToState[columnId] = columnState;
            */
            
            return colView;
        },
        
        /**
         * Removes a column by id
         * 
         * Also removes dependent objects, such as sort conditions and aggregations 
         */
        removeColumn: function(columnId) {
            delete this.colIdToColView[columnId];
            
            var self = this;
            util.ArrayUtils.filter(this.columnIds, function(cid) {            
                var r = columnId != cid;
                return r;
            });
            
            util.ArrayUtils.filter(this.sortConditions, function(sc) {
                var r = columnId != sc.getColumnId();
            });

            delete this.colIdToAgg[columnId];
        }
    });

    /*
        getSortConditions: function() {
            return this.sortConditions;
        },
        
        getAggregators: function() {
            return this.aggregators;
        },
        
        getLimitAndOffset: function() {
            return limitAndOffset;
        },
        
        getSearchStrings: function() {
            return this.searchStrings;
        },
        
        removeColumn: function(columnId) {            
            util.ArrayUtils.filter(this.sortConditions, function(sc) {            
               var r = sc.getColumnId() != columnId;
               return r;
            });

            util.ArrayUtils.filter(this.aggregators, function(agg) {            
                var r = agg.getColumnId() != columnId;
                return r;
            });
            
            delete this.searchStrings[columnId]; 
        },
      */  
        
        /**
         * TODO Should this method return a ColumnViews on the internal state?
         * Then we could toggle e.g. the sortDirection on a column directly
         * 
         * @returns
         */
    /*
        getEffectiveColumnData: function() {
            
            var result = [];
            for(var i = 0; i < this.columnNames.length; ++i) {
                var columnName = this.columnNames[i];
                
                var data = {
                    index: i,
                    name: columnName,
                    sort: {
                        index: null
                        condition: null
                    },
                    aggregator: null
                }
                
                
            }
            
            return result;
        }
    });
*/
   

    ns.ExprModFactoryAggCount = Class.create({
       createExpr: function(baseExpr) {
           var result = new sparql.E_Count(baseExpr);
           
           return result;
       } 
    });

    ns.ExprModFactoryAggMin = Class.create({
        createExpr: function(baseExpr) {
            var result = new sparql.E_Min(baseExpr);
            
            return result;
        } 
    });
     
    ns.ExprModFactoryAggMax = Class.create({
        createExpr: function(baseExpr) {
            var result = new sparql.E_Min(baseExpr);
            
            return result;
        } 
    });

    
    ns.ExprModRegistry = {
        'count': new ns.ExprModFactoryAggCount,
        'min': new ns.ExprModFactoryAggMin,
        'max': new ns.ExprModFactoryAggMax
    };
    
    
    ns.ElementFactoryFacetPaths = Class.create({
        initialize: function(facetConfig, paths) {
            this.facetConfig = facetConfig;
            this.paths = paths || new util.ArrayList();
        },
        
        createElement: function() {
            var facetConceptGenerator = facete.FaceteUtils.createFacetConceptGenerator(this.facetConfig);
            var concept = facetConceptGenerator.createConceptResources(new facete.Path());

            var rootFacetNode = this.facetConfig.getRootFacetNode();
            
            
            var pathElements = _(this.paths).map(function(path) {
                var facetNode = rootFacetNode.forPath(path);
                
                console.log('facetNode: ', facetNode);
                
                var e = facetNode.getElements(true);
                
                
                // TODO On certain constraints affecting the path, we can skip the Optional
                var g = new sparql.ElementGroup(e);

                var r;
                if(e.length !== 0) {
                    r = new sparql.ElementOptional(g);
                }
                else {
                    r = g;
                }
                
                return r;
            });
                        
            var elements = [];
            elements.push.apply(elements, concept.getElements());
            elements.push.apply(elements, pathElements);
            
            var tmp = new sparql.ElementGroup(elements);
            
            var result = tmp.flatten();

            return result;
        }
    });

    
    // TODO: Maybe this class should be TableModFacet and inherit from TableMod?
    ns.TableConfigFacet = Class.create({
        initialize: function(facetConfig, tableMod, paths) {
            this.facetConfig = facetConfig;
            this.tableMod = tableMod || new ns.TableMod();
            this.paths = paths || new util.ArrayList();
        },
        
        getFacetConfig: function() {
            return this.facetConfig;
        },

        getTableMod: function() {
            return this.tableMod;
        },

        getPaths: function() {
            return this.paths;
        },        
                
        /**
         * Return the path for a given column id
         */
        getPath: function(colId) {
            var index = _(this.tableMod.getColumnIds()).indexOf(colId);
            var result = this.paths.get(index);
            return result;
        },
        
        getColumnId: function(path) {
            var index = this.paths.firstIndexOf(path);
            var result = this.tableMod.getColumnIds()[index];
            return result;
        },
        
        togglePath: function(path) {
            // Updates the table model accordingly
            var status = util.CollectionUtils.toggleItem(this.paths, path);
            
            var rootFacetNode = this.facetConfig.getRootFacetNode();
            var facetNode = rootFacetNode.forPath(path);
            var varName = facetNode.getVar().getName();
            
            if(status) {
                this.tableMod.addColumn(varName);
            }
            else {
                this.tableMod.removeColumn(varName);
            }
        },
        
        createDataConcept: function() {
            var emptyPath = new ns.Path();
            var paths = this.paths.getArray().slice(0);

            if(!this.paths.contains(emptyPath)) {
                paths.push(emptyPath);
            }
            
            var dataElementFactory = new ns.ElementFactoryFacetPaths(this.facetConfig, paths);
            var dataElement = dataElementFactory.createElement();
            
            var rootFacetNode = this.facetConfig.getRootFacetNode();
            var dataVar = rootFacetNode.getVar();
            
            var result = new ns.Concept(dataElement, dataVar);

            return result;
        }
        
    /*
        createQueryFactory: function() {
            // create an ElementFactory based on the paths and the facetConfig
            var elementFactory = new ns.ElementFactoryFacetPaths(this.facetConfig, this.paths);

            var queryFactory = new ns.QueryFactoryTableMod(elementFactory, tableMod);
            
            return queryFactory;
        }
    */
    });

    ns.QueryFactoryFacetTable = Class.create(ns.QueryFactory, {
        initialize: function(tableConfigFacet) {
            this.tableConfigFacet = tableConfigFacet;
        },
        
        createQuery: function() {
            var facetConfig = this.tableConfigFacet.getFacetConfig();
            
            // TODO Possible source of confusion: the config uses a collection for paths, but here we switch to a native array 
            var paths = this.tableConfigFacet.getPaths().getArray();
            var tableMod = this.tableConfigFacet.getTableMod();

            
            var elementFactory = new ns.ElementFactoryFacetPaths(facetConfig, paths);

            var queryFactory = new ns.QueryFactoryTableMod(elementFactory, tableMod);
            
            var result = queryFactory.createQuery();
            
            return result;
        }
    });
    
    
    ns.TableUtils = {
        /**
         * Create an angular grid option object from a tableMod
         */
        createNgGridColumnDefs: function(tableMod) {

            var columnViews = tableMod.getColumns();
            
            var result = _(columnViews).each(function(columnView) {
                var col = {
                    field: columnView.getId(),
                    displayName: columnView.getId()
                };
                
                return col;
            });
            
            return result;
        }
    };
    
    ns.QueryFactoryTableMod = Class.create(ns.QueryFactory, {
        initialize: function(elementFactory, tableMod) {
            this.elementFactory = elementFactory;
            this.tableMod = tableMod;
        },
        
        createQuery: function() {
            var tableMod = this.tableMod;
            var element = this.elementFactory.createElement();
            
            if(!element) {
                return null;
            }
            
            
            var isDistinct = tableMod.isDistinct();

            
            var result = new sparql.Query();
            result.getElements().push(element);
            
            var columns = tableMod.getColumns();

            
            // Map from column id to SPARQL expression representing this column
            var idToColExpr = {};
            
            var aggColumnIds = [];
            var nonAggColumnIds = [];
            
            _(columns).each(function(c) {
                var columnId = c.getId();
                var v = rdf.NodeFactory.createVar(columnId);
                var ev = new sparql.ExprVar(v);
                
                
                var agg = c.getAggregator();
                if(agg) {
                    aggColumnIds.push(columnId);
                    
                    var aggName = agg.getName();
                    
                    var aggExprFactory = ns.ExprModRegistry[aggName];
                    if(!aggExprFactory) {
                        throw 'No aggExprFactory for ' + aggName;
                    }
                    
                    var aggExpr = aggExprFactory.createExpr(ev);
                    
                    ev = aggExpr;

                    result.getProject().add(v, ev);
                    
                } else {
                    nonAggColumnIds.push(columnId);
                    result.getProject().add(v);
                }
                
                
                idToColExpr[columnId] = ev;
            });
            
            if(aggColumnIds.length > 0) {
                _(nonAggColumnIds).each(function(nonAggColumnId) {
                    var expr = idToColExpr[nonAggColumnId]; 
                    result.getGroupBy().push(expr); 
                });
                
                // Aggregation implies distinct
                isDistinct = false;
            }
            
            
            // Apply limit / offset
            var lo = tableMod.getLimitAndOffset();
            result.setLimit(lo.getLimit());
            result.setOffset(lo.getOffset());
            
            // Apply sort conditions
            var sortConditions = tableMod.getSortConditions();
            
            
            _(sortConditions).each(function(sortCondition) {
                var columnId = sortCondition.getColumnId();

                var colExpr = idToColExpr[columnId];
                
                if(!colExpr) {
                    console.log('[ERROR] Should not happen');
                    throw 'Should not happen';
                }

                // Ordering of null values
                //var sortCondition = cs.getSortCondition();
                var sortDir = sortCondition.getSortDir();
                var sortType = sortCondition.getSortType();

                var sortCond = null;

                switch(sortType) {
                case 'null':
                    // Null ordering only works with non-aggregate columns
                    if(_(aggColumnIds).indexOf(columnId) < 0) {

                        if(sortDir > 0) {
                            sortCond = new sparql.SortCondition(new sparql.E_LogicalNot(new sparql.E_Bound(colExpr)), 1);
                        } else if(sortDir < 0) {
                            sortCond = new sparql.SortCondition(new sparql.E_Bound(colExpr), 1);                    
                        }
                    
                    }

                    break;

                case 'data': 
                    sortCond = !sortDir ? null : new sparql.SortCondition(colExpr, sortDir);

                    break;
                
                default:
                    console.log('Should not happen');
                    throw 'Should not happen';
                }
                
                if(sortCond) {
                    result.getOrderBy().push(sortCond);
                }
                
                
            });
            
            result.setDistinct(isDistinct);
            
            return result;
        }
    });
    

    /*
     * TODO: How to connect this class with a facetTreeConfig?
     * We might need a FacetNodeFactoryFacetTreeConfig
     * 
     */
    ns.FaceteTable = Class.create({
        initialize: function() {
            //this.pathVarMap = pathVarMap;// Formerly called facetNode
            // FIXME: varNode not defined!!!
            this.varNode = varNode;            
            this.paths = new util.ArrayList();
            this.tableMod = tableMod;
        },

        getPaths: function() {
            return this.paths;
        },
        
        getTableMod: function() {
            return this.tableMod;
        },
        
        togglePath: function(path) {
            // Updates the table model accordingly
            var status = util.CollectionUtils.toggleItem(this.paths, path);
            
            var target = this.varNode.forPath(path);
            var varName = target.getVarName();
            
            if(status) {
                // FIXME: this.tableMode not defined
                this.tableMode.addColumn(varName);
            }
            else {
                // FIXME: this.tableMode not defined
                this.tableMode.removeColumn(varName);
            }
        }
    });
    
    
    
    /*
     * Old code below, delete once the new code is working 
     */
    
    ns.FaceteTableModOld = Class.create({
        initialize: function() {
           this.columnIds = [];
           //this.columnIdToPath = [];
           
           //this.pathToColumnId = [];
           this.columnIdToPath = new util.HashBidiMap();
           
           this.columnIdToData = {};
           
           this.tableMod = new ns.TableMod();
        },
        
        getTableMod: function() {
            return this.tableMod;
        },
        
        createColumnData: function() {
            var self = this;
            var result = _(this.columnIds).map(function(columnId) {
                var r = self.columnIdToData;
                
                if(!r) {
                    r = {};
                    self.columnIdToData[columnId] = r;
                }
                
                
                
                return r;
            });            
        },
        
        getColumns: function() {
            var self = this;
            var result = _(this.columnIds).map(function(columnId) {
                var r = self.columnIdToData;
                return r;
            });

//            var self = this;
//            
//            var tableMod = this.tableMod;
//            var sortConditions = tableMod.getSortConditions();
//            var aggregators = tableMod.getAggregators();
//            
//            var sortMap = sortConditions.createMap();
//            
//            var result = _(this.columnIds).map(function(columnId) {
//                var r = {};
//                
//                var path = self.columnIdToPath[columnIdToPath];
//                
//                var sort = sortMap[columnId];
//                if(sort) {
//                    r.sort = sort;
//                }
//
//            });
//            
//            return result;
        },

        putColumn: function(columnId, path) {
            this.columnIds.push(path);
            this.columnIdToPath.put(columnId, path);
        },
        
        removeColumn: function(columnId) {
            var tableMod = this.tableMod;
            //debugger;
            //var pathToColumnId = this.columnIdToPath.getInverse();
            
            this.columnIdToPath.remove(columnId);
            tableMod.removeColumn(columnId);
            
            util.ArrayUtils.filter(this.columnIds, function(item) {
                return item != columnId;
            });
        },
        
        getPaths: function() {
            var r = this.columnIdToPath.getInverse().keyList(); //.map(function(entry) {
            var result = new util.ArrayList();
            result.setItems(r);
//                return entry.getValue(); 
//            });
    
            return result;
        },
        
        togglePath: function(path) {
            var pathToColumnId = this.columnIdToPath.getInverse();
            var columnId = pathToColumnId.get(path);
            
            if(columnId) {
                this.removeColumn(columnId);
            } else {
                columnId = 'col_' + this.columnIds.length;
                
                this.putColumn(columnId, path);                
            }
            
            /*
            var columnIds = pathToColumnId.get(path);
            if(columnIds.length === 0) {
                var columnId = 'col_' + this.columnIds.length;
                
                this.addColumn(columnId, path);
                //pathToColumnId.put(path, columnId);
                //this.columnIds.push(columnId);
            } else {
                var lastColumnId = columnIds[columnIds.length - 1];
                this.removeColumn(lastColumnId);
            }
            */
        }
    });

    
})();
(function() {

    var util = Jassa.util;
    
    var ns = Jassa.facete;


    /**
     * Tags all nodes in a facetTree, based on pathTaggers
     * 
     */
    ns.FacetTreeTagger = Class.create({
        initialize: function(pathTagger) {
            this.pathTagger = pathTagger;
        },
        
        applyTags: function(facetNode) {
            
            ns.FacetTreeUtils.applyTags(this.pathTagger, facetNode);
            
            return facetNode;
        }
    });
    

    ns.FacetTreeUtils = {
        //TODO Probably not used anymore
        applyTags: function(pathTagger, facetNode) {
            var facetNodes = util.TreeUtils.flattenTree(facetNode, 'children');
        
            _(facetNodes).each(function(node) {
                var path = node.item.getPath();
                var tags = pathTagger.createTags(path);
                _(node).extend(tags);
            });
            
            return facetNode;
        }
    };
    
    
    /**
     * Interface for retrieval of tags for a given object
     *
     */
    ns.ItemTagger = Class.create({
        createTags: function(item) {
            throw 'Not overidden';
        } 
    });

    
    /**
     * Item Tagger that aggregates a set of item taggers
     * 
     */
    ns.ItemTaggerManager = Class.create(ns.ItemTagger, {
        initialize: function() {
            this.taggerMap = {}
        },
        
        getTaggerMap: function() {
            return this.taggerMap;
        },
        
        /**
         * @param item The object for which to create the tags
         */
        createTags: function(item) {
            var result = {};
            _(this.taggerMap).each(function(tagger, key) {
                var tags = tagger.createTags(item);
                
                result[key] = tags;
            });
            
            return result;
        }
    });

    
    ns.ItemTaggerFilterString = Class.create(ns.ItemTagger, {
        initialize: function(pathToFilterString) {
            this.pathToFilterString = pathToFilterString;
        },
        
        createTags: function(path) {
            var filterString = this.pathToFilterString.get(path);
            //var isContained = paths.contains(path);
            
            var result = { filterString: filterString };
            //console.log('table: ' + path, isContained);
            return result;
        }
    });

    /**
     * Item Tagger for paths of whether they are linked as a table column
     * 
     */
    ns.ItemTaggerMembership = Class.create(ns.ItemTagger, {
        initialize: function(collection) {
            this.collection = collection;
        },
        
        createTags: function(item) {
            var isContained = this.collection.contains(item);
            
            var result = { isContained: isContained };
            //console.log('table: ' + path, isContained);
            return result;
        }
    });
    /*
    ns.PathTaggerFacetTableConfig = Class.create(ns.ItemTagger, {
        initialize: function(tableConfig) {
            this.tableMod = tableMod;
        },
        
        createTags: function(path) {
            var paths = this.tableMod.getPaths();
            var isContained = paths.contains(path);
            
            var result = { isContained: isContained };
            //console.log('table: ' + path, isContained);
            return result;
        }
    });
    */
    
    
    
    
    /**
     * Tags paths as active when they are in the collection of
     * active map links
     * 
     * TODO Apparently not used yet
     */
    ns.ItemTaggerMapLinkPath = Class.create(ns.ItemTagger, {
        initialize: function(mapLinkManager, conceptSpace) {
            this.mapLinkManager = mapLinkManager;
            this.conceptSpace = conceptSpace;
        },
        
        createTags: function(path) {
            var result = { isActive: isContained };
            return result;
        }
    });    
    

})();
(function() {

    var ns = Jassa.geo;
    
    ns.BBoxExprFactory = Class.create({
        createExpr: function(bounds) {
            throw 'Not implemented';
        }
    });
    

    ns.BBoxExprFactoryWgs84 = Class.create(ns.BBoxExprFactory, {
        initialize: function(xVar, yVar, castNode) {
            //this.geoVar = geoVar;
            this.xVar = xVar;
            this.yVar = yVar;
            this.castNode = castNode;
        },
        
        createExpr: function(bounds) {
            var result = ns.GeoExprUtils.createExprWgs84Intersects(this.xVar, this.yVar, bounds, this.castNode);
            return result;
        }
    });
    

    ns.BBoxExprFactoryWkt = Class.create(ns.BBoxExprFactory, {
        initialize: function(wktVar, intersectsFnName, geomFromTextFnName) {
            this.wktVar = wktVar;
            this.intersectsFnName = intersectsFnName;
            this.geomFromTextFnName = geomFromTextFnName;
        },
        
        createExpr: function(bounds) {
            var result = ns.GeoExprUtils.createExprOgcIntersects(this.wktVar,bounds, this.intersectsFnName, this.geomFromTextFnName);
            return result;
        }
    });
    
})();
/**
 * A LooseQuadTree data structure.
 * 
 * @param bounds Maximum bounds (e.g. (-180, -90) - (180, 90) for spanning the all wgs84 coordinates)
 * @param maxDepth Maximum depth of the tree
 * @param k The factor controlling the additional size of nodes in contrast to classic QuadTrees.
 * @returns {QuadTree}
 */

(function() {
    
	var ns = Jassa.geo;
	
	
    ns.Point = Class.create({
        initialize: function(x, y) {
            this.x = x;
            this.y = y;
        },
        
        getX: function() {
            return this.x;
        },
        
        getY: function() {
            return this.y;
        }
    });
    
    ns.Bounds = Class.create({
        initialize: function(left, bottom, right, top) {
            this.left = left;
            this.right = right;
            this.bottom = bottom;
            this.top = top;
        },
    
        containsPoint: function(point) {
            return point.x >= this.left && point.x < this.right && point.y >= this.bottom && point.y < this.top;
        },
    
    
        getCenter: function() {
            return new ns.Point(0.5 * (this.left + this.right), 0.5 * (this.bottom + this.top));
        },
    
        getWidth: function() {
            return this.right - this.left; 
        },
    
        getHeight: function() {
            return this.top - this.bottom;
        },
    
    
        /**
         * Checks for full containment (mere overlap does not yield true)
         * 
         * @param bounds
         * @returns {Boolean}
         */
        contains: function(bounds) {
            return bounds.left >= this.left && bounds.right < this.right && bounds.bottom >= this.bottom && bounds.top < this.top;
        },
    
        rangeX: function() {
            return new ns.Range(this.left, this.right);
        },
    
        rangeY: function() {
            return new ns.Range(this.bottom, this.top);
        },
    
        overlap: function(bounds) {
            if(!bounds.rangeX || !bounds.rangeY) {
                console.error("Missing range");
                throw 'Error';
            }
        
            var ox = this.rangeX().getOverlap(bounds.rangeX());
            if(!ox) {
                return null;
            }
            
            var oy = this.rangeY().getOverlap(bounds.rangeY());
            if(!oy) {
                return null;
            }
            
            return new ns.Bounds(ox.min, oy.min, oy.max, ox.max);
        },
    
        isOverlap: function(bounds) {
            var tmp = this.overlap(bounds);
            return tmp != null;
        },
    
        toString: function() {
        //return "[" + this.left + ", " + this.bottom + ", " + this.right + ", " + this.top + "]"; 
            return "[" + this.left + " - " + this.right + ", " + this.bottom + " - " + this.top + "]";
        }
    });
    
    ns.Bounds.createFromJson = function(json) {
        var result = new ns.Bounds(json.left, json.bottom, json.right, json.top);
        return result;
    };

    ns.Range = Class.create({
        initialize: function(min, max) {
            this.min = min;
            this.max = max;
        },
    
        getOverlap: function(other) {
            var min = Math.max(this.min, other.min);
            var max = Math.min(this.max, other.max);
    
            return (min > max) ? null : new ns.Range(min, max); 
        }
    });
	
	
	ns.QuadTree = Class.create({
	    initialize: function(bounds, maxDepth, k) {
    		if(k == undefined) {
    			k = 0.25;
    		}
    		
    		this.node = new ns.Node(null, bounds, maxDepth, 0, k);
    		
    		// Map in which nodes objects with a certain ID are located
    		// Each ID may be associated with a set of geometries
    		this.idToNodes = [];
	    },
	
	    getRootNode: function() {
	        return this.node;
	    },
	
    	/**
    	 * Retrieve the node that completely encompasses the given bounds
    	 * 
    	 * 
    	 * @param bounds
    	 */
        aquireNodes: function(bounds, depth) {
            return this.node.aquireNodes(bounds, depth);
        },
	
	
        query: function(bounds, depth) {
            return this.node.query(bounds, depth);
        },
	
        insert: function(item) {
		
        }
	});
	
	
	// Node
	
	ns.Node = Class.create({ 
	    initialize: function(parent, bounds, maxDepth, depth, k, parentChildIndex) {
    		this.parent = parent;
    		this.parentChildIndex = parentChildIndex;
    		
    		this._bounds = bounds;
    		this._maxDepth = maxDepth;
    		this._depth = depth;
    		this._k = k;  // expansion factor for loose quad tree [0, 1[ - recommended range: 0.25-0.5
    	
    		this.isLoaded = false;
    		this.children = null;
    		
    		this.data = {};
    		
    		this._minItemCount = null; // Concrete minumum item count
    		this.infMinItemCount = null; // Inferred minimum item count by taking the sum
    		
    		// The contained items: id->position (so each item must have an id)
    		this.idToPos = {};
    		
    		this._classConstructor = ns.Node;
    	},
	
    	getId: function() {
    	    var parent = this.parent;
    	    var parentId = parent ? parent.getId() : '';
    	    
    	    var indexId = this.parentChildIndex != null ? this.parentChildIndex : 'r'; // r for root
    	    var result = parentId + indexId;
    	    return result;
    	},
    	
    	isLeaf: function() {
    	    return !this.children;
    	},
		
	
    	addItem: function(id, pos) {
    	    this.idToPos[id] = pos;
    	},
	
	
    	addItems: function(idToPos) {
          var id;
    	    for(id in idToPos) {
    	        var pos = idToPos[id];
			
    	        this.addItem(id, pos);
    	    }
    	},
	
	
    	removeItem: function(id) {
    	    delete this.idToPos[id];
    	},
	
    	/**
    	 * Sets the minimum item count on this node and recursively updates
    	 * the inferred minimum item count (.infMinItemCount) on its parents.
    	 * 
    	 * @param value
    	 */
    	setMinItemCount: function(value) {
    		this._minItemCount = value;
    	    this.infMinItemCount = value;
    		
    		if(this.parent) {
    			this.parent.updateInfMinItemCount();
    		}
    	},
    	
    	getMinItemCount: function() {
    	    return this._minItemCount;
    	},
	
    	/**
    	 * True if either the minItemCount is set, or all children have it set 
    	 * FIXME This description is not concise - mention the transitivity
    	 * 
    	 * @returns
    	 */
    	isCountComplete: function() {
    		if(this.getMinItemCount() !== null) {
    			return true;
    		}
    		
    		if(this.children) {
    			var result = _.reduce(
    					this.children,
    					function(memo, child) {
    						return memo && child.isCountComplete();
    					},
    					true);
    
    			return result;
    		}
    		
    		return false;
    	},
	
    	updateInfMinItemCount: function() {
    		if(!this.children && this._minItemCount !== null) {
    			return;
    		}
    		
    		var sum = 0;
    		
    		_(this.children).each(function(child, index) {
    			if(child._minItemCount !== null) {
    				sum += child._minItemCount;
    			} else if(child.infMinItemCount) {
    				sum += child.infMinItemCount;
    			}
    		});
    		
    		this.infMinItemCount = sum;
    		
    		if(this.parent) {
    			this.parent.updateInfMinItemCount();
    		}
    	},
    	
    	getBounds: function() {
    	    return this._bounds;
    	},
	
	
    	getCenter: function() {
    	    return this._bounds.getCenter();
    	},
	
	
    	subdivide: function() {
    		var depth = this._depth + 1;
    		
    		var c = this.getCenter();
    	
    		//console.log("k is " + this._k);
    		
    		// expansions
    		var ew = this._k * 0.5 * this._bounds.getWidth();
    		var eh = this._k * 0.5 * this._bounds.getHeight();
    		
    		this.children = [];
    		
    		this.children[ns.Node.TOP_LEFT] = new this._classConstructor(this, new ns.Bounds(
    			this._bounds.left, 
    			c.y - eh,
                c.x + ew, 
    			this._bounds.top
    		),
    		this._maxDepth, depth, this._k, ns.Node.TOP_LEFT);
    		
    		this.children[ns.Node.TOP_RIGHT] = new this._classConstructor(this, new ns.Bounds(
    			c.x - ew, 
    			c.y - eh,
                this._bounds.right, 
    			this._bounds.top
    		),
    		this._maxDepth, depth, this._k, ns.Node.TOP_RIGHT);
    		
    		this.children[ns.Node.BOTTOM_LEFT] = new this._classConstructor(this, new ns.Bounds(
    			this._bounds.left, 
    			this._bounds.bottom,
                c.x + ew, 
    			c.y + eh
    		),
    		this._maxDepth, depth, this._k, ns.Node.BOTTOM_LEFT);
    	
    		this.children[ns.Node.BOTTOM_RIGHT] = new this._classConstructor(this, new ns.Bounds(
    			c.x - ew, 
                this._bounds.bottom,
    			this._bounds.right, 
    			c.y + eh
    		),
    		this._maxDepth, depth, this._k, ns.Node.BOTTOM_RIGHT);
    		
    		
    		// Uncomment for debug output
    		/*
    		console.log("Subdivided " + this._bounds + " into ");
    		for(var i in this.children) {
    			var child = this.children[i];
    			console.log("    " + child._bounds);
    		}
    		*/
    	},
	
	
    	_findIndexPoint: function(point) {
        // FIXME: bounds not defined
    		var center = this.getCenter(bounds);
    		var left = point.x < center.x;
    		var top = point.y > center.y;
    		
    		var index; 
    		if(left) {
    			if(top) {
    				index = Node.TOP_LEFT;
    			} else {
    				index = Node.BOTTOM_LEFT;
    			}
    		} else {
    			if(top) {
    				index = Node.TOP_RIGHT;
    			} else {
    				index = Node.BOTTOM_RIGHT;
    			}
    		}
    		
    		return index;	
    	},
	
    	_findIndex: function(bounds) {
    		var topLeft = new ns.Point(bounds.left, bounds.top);
    		return this._findIndexPoint(topLeft);
    	},
	
    	getOverlaps: function(bounds) {
    		
    	},
	
	
	
    	/**
    	 * Return loaded and leaf nodes within the bounds
    	 * 
    	 * @param bounds
    	 * @param depth The maximum number of levels to go beyond the level derived from the size of bounds
    	 * @returns {Array}
    	 */
    	query: function(bounds, depth) {
    		var result = [];
    		
    		this.queryRec(bounds, result);
    		
    		return result;
    	},
	
    	queryRec: function(bounds, result) {
    		if(!this._bounds.isOverlap(bounds)) {
    			return;
    		}
    	
    		var w = bounds.getWidth() / this._bounds.getWidth();
    		var h = bounds.getHeight() / this._bounds.getHeight();
    		
    		var r = Math.max(w, h);
    		
    		// Stop recursion on encounter of a loaded node or leaf node or node that exceeded the depth limit
        // FIXME: depth is not defined
    		if(this.isLoaded || !this.children || r >= depth) {
    			result.push(this);
    			return;
    		}
    		
    		for(var i in this.children) {
    			var child = this.children[i];
    			// FIXME: depth is not defined
    			child.queryRec(bounds, depth, result);
    		}	
    	},
	
	
	
	
    	/**
    	 * If the node'size is above a certain ration of the size of the bounds,
    	 * it is placed into result. Otherwise, it is recursively split until
    	 * the child nodes' ratio to given bounds has become large enough.
    	 * 
    	 * Use example:
    	 * If the screen is centered on a certain location, then this method
    	 * picks tiles (quad-tree-nodes) of appropriate size (not too big and not too small).
    	 * 
    	 * 
    	 * @param bounds
    	 * @param depth
    	 * @param result
    	 */
    	splitFor: function(bounds, depth, result) {
    		/*
    		console.log("Depth = " + depth);
    		console.log(this.getBounds());
    		*/
    		
    		
    		/*
    		if(depth > 10) {
    			result.push(this);
    			return;
    		}*/
    		
    		
    		if(!this._bounds.isOverlap(bounds)) {
    			return;
    		}
    		
    		// If the node is loaded, avoid splitting it
    		if(this.isLoaded) {
    			if(result) {
    				result.push(this);
    			}
    			return;
    		}
    		
    		// How many times the current node is bigger than the view rect
    		var w = bounds.getWidth() / this._bounds.getWidth();
    		var h = bounds.getHeight() / this._bounds.getHeight();
    	
    		var r = Math.max(w, h);
    		//var r = Math.min(w, h);
    		
    		if(r >= depth || this._depth >= this._maxDepth) {
    			if(result) {
    				result.push(this);
    				//console.log("Added a node");
    			}
    			return;
    		}
    		
    		if(!this.children) {
    			this.subdivide();
    		}
    		
    		for(var i = 0; i < this.children.length; ++i) {
    			var child = this.children[i];
    			
    			//console.log("Split for ",child, bounds);
    			child.splitFor(bounds, depth, result);
    		}	
    	},
	
	
    	aquireNodes: function(bounds, depth) {
    		var result = [];
    		
    		this.splitFor(bounds, depth, result);
    		
    		return result;
    	},
    	
    	
    	unlink: function() {
    		if(!this.parent) {
    			return;
    		}

        var i;
    		for(i in this.parent.children) {
    			var child = this.parent.children[i];
    			
    			if(child == this) {
    				this.parent.children = new ns.Node(this.parent, this._bounds, this._depth, this._k);
    			}
    		}		
    	}
	});
	
	
    ns.Node.TOP_LEFT = 0;
    ns.Node.TOP_RIGHT = 1;
    ns.Node.BOTTOM_LEFT = 2;
    ns.Node.BOTTOM_RIGHT = 3;
    
})();

(function() {

    var ns = Jassa.geo;
    var sparql = Jassa.sparql;
    
    
    ns.GeoExprUtils = {
        /**
         * @param varX The SPARQL variable that corresponds to the longitude
         * @param varY The SPARQL variable that corresponds to the longitude
         * @param bounds The bounding box to use for filtering
         * @param castNode An optional SPAQRL node used for casting, e.g. xsd.xdouble
         */
        createExprWgs84Intersects: function(varX, varY, bounds, castNode) {
            var lon = new sparql.ExprVar(varX);
            var lat = new sparql.ExprVar(varY);
            
            // Cast the variables if requested
            // TODO E_Cast should not be used - use E_Function(castNode.getUri(), lon) instead - i.e. the cast type equals the cast function name
            if(castNode) {
                // FIXME: E_Cast not defined
                lon = new sparql.E_Cast(lon, castNode);
                lat = new sparql.E_Cast(lat, castNode);
            }
            
            var xMin = sparql.NodeValue.makeDecimal(bounds.left);
            var xMax = sparql.NodeValue.makeDecimal(bounds.right);
            var yMin = sparql.NodeValue.makeDecimal(bounds.bottom);
            var yMax = sparql.NodeValue.makeDecimal(bounds.top);

            var result = new sparql.E_LogicalAnd(
                new sparql.E_LogicalAnd(new sparql.E_GreaterThan(lon, xMin), new sparql.E_LessThan(lon, xMax)),
                new sparql.E_LogicalAnd(new sparql.E_GreaterThan(lat, yMin), new sparql.E_LessThan(lat, yMax))
            );

            return result;
        },
            
            
        createExprOgcIntersects: function(v, bounds, intersectsFnName, geomFromTextFnName) {
            var ogc = 'http://www.opengis.net/rdf#';

            intersectsFnName = intersectsFnName || (ogc + 'intersects'); 
            geomFromTextFnName = geomFromTextFnName || (ogc + "geomFromText");              
            
            
            var exprVar = new sparql.ExprVar(v);
            var wktStr = this.boundsToWkt(bounds);
            
            // FIXME: Better use typeLit with xsd:string
            var wktNodeValue = sparql.NodeValue.makeString(wktStr); //new sparql.NodeValue(rdf.NodeFactory.createPlainLiteral(wktStr));
            
            var result = new sparql.E_Function(
                    intersectsFnName,
                [exprVar, new sparql.E_Function(geomFromTextFnName, [wktNodeValue])]
            );

            return result;
        },
         
        /**
         * Convert a bounds object to a WKT polygon string
         * 
         * TODO This method could be moved to a better place
         * 
         */
        boundsToWkt: function(bounds) {
            var ax = bounds.left;
            var ay = bounds.bottom;
            var bx = bounds.right;
            var by = bounds.top;
            
            var result = "POLYGON((" + ax + " " + ay + "," + bx + " " + ay
                    + "," + bx + " " + by + "," + ax + " " + by + "," + ax
                    + " " + ay + "))";

            return result;
        }   
    };

    
})();
(function($) {
    
    var ns = Jassa.geo;
    var xsd = Jassa.xsd;
    var sparql = Jassa.sparql;
    var sponate = Jassa.sponate;

    var defaultDocWktExtractorFn = function(doc) {
        var wktStr = doc.wkt;

        var points = ns.WktUtils.extractPointsFromWkt(wktStr);
        var result = ns.WktUtils.createBBoxFromPoints(points);

        return result;
    };

    var number = '(\\d+(\\.\\d*)?)';
    var nonNumber = '[^\\d]*';
    ns.pointRegexPattern = new RegExp(nonNumber + '(' + number + '\\s+' + number + nonNumber + ')');

    ns.WktUtils = {

        extractPointsFromWkt: function(wktStr) {
            var result = [];

            var match;
            while (match = ns.pointRegexPattern.exec(wktStr)) {
                var strX = match[2];
                var strY = match[4];
                var x = parseFloat(strX);
                var y = parseFloat(strY);
                
                
                var p = new ns.Point(x, y);
                result.push(p);
                
                wktStr = wktStr.replace(match[0], '');                
            }
            
            return result;
        },
        
        createBBoxFromPoints: function(points) {
            var minX = null;
            var minY = null;
            var maxX = null;
            var maxY = null;
            
            _(points).each(function(point) {
                var x = point.getX();
                var y = point.getY();
                
                minX = !minX ? x : Math.min(minX, x);
                minY = !minY ? y : Math.min(minY, y);
                maxX = !maxX ? x : Math.max(maxX, x);
                maxY = !maxY ? y : Math.max(maxY, y);
            });
            
            var result = new ns.Bounds(minX, minY, maxX, maxY);
            return result;
        }
    };
    
    
    ns.QuadTreeCacheService = Class.create({
       
        
    });
    
    
    /**
     * 
     * fetchData
     *   runWorkflow
     *      runGlobalWorkflow
     *      runTiledWorkflow
     * 
     * 
     * Given a geoQueryFactory (i.e. a factory object, that can create queries for given bounds),
     * this class caches results for bounds.
     * 
     * The process is as follows:
     * The orginial bounds are extended to the size of tiles in a quad tree.
     * Then the data is fetched.
     * A callback with the data and the original bounds is invoked.
     * IMPORTANT! The callback has to make sure how to filter the data against the original bounds (if needed)
     * 
     * TODO This class is not aware of postprocessing by filtering against original bounds - should it be?
     * 
     * @param backend
     * @returns {ns.QuadTreeCache}
     */
    ns.QuadTreeCache = Class.create({ 
        initialize: function(sparqlService, geoMapFactory, concept, fnGetBBox, options) {
            this.sparqlService = sparqlService;
            
            var maxBounds = new ns.Bounds(-180.0, -90.0, 180.0, 90.0);
            this.quadTree = new ns.QuadTree(maxBounds, 18, 0);
        
            
            this.concept = concept;
            
            if(!options) {
                options = {};
            }
            
            this.maxItemsPerTileCount = options.maxItemsPerTileCount || 25;
            this.maxGlobalItemCount = options.maxGlobalItemCount || 50;
            
            this.geoMapFactory = geoMapFactory;
            

            
            this.fnGetBBox = fnGetBBox || defaultDocWktExtractorFn;
        },

        
        /**
         * Method for fetching data within the given bounds
         * 
         */
        fetchData: function(bounds) {
            var result = this.runWorkflow(bounds);
            return result;
        },
        
        createFlowForBounds: function(bounds) {
            var store = new sponate.StoreFacade(this.sparqlService); //, prefixes); 
            var geoMap = this.geoMapFactory.createMapForBounds(bounds);
            store.addMap(geoMap, 'geoMap');
            return store.geoMap;            
        },
        
        createFlowForGlobal: function() {
            var store = new sponate.StoreFacade(this.sparqlService); //, prefixes); 
            var geoMap = this.geoMapFactory.createMapForGlobal();
            store.addMap(geoMap, 'geoMap');
            return store.geoMap;
        },
        
        runCheckGlobal: function() {
            var result;
            
            var rootNode = this.quadTree.getRootNode();

            var self = this;
            if(!rootNode.checkedGlobal) {
            
                var countFlow = this.createFlowForGlobal().find().concept(this.concept).limit(self.maxGlobalItemCount);
                var countTask = countFlow.count();
                var globalCheckTask = countTask.pipe(function(geomCount) {
                    console.debug("Global check counts", geomCount, self.maxGlobalItemCount);
                    var canUseGlobal = !(geomCount >= self.maxGlobalItemCount);
                    rootNode.canUseGlobal = canUseGlobal;
                    rootNode.checkedGlobal = true;
                    
                    return canUseGlobal;
                });
                
                result = globalCheckTask;

            } else {
                var deferred = $.Deferred();
                deferred.resolve(rootNode.canUseGlobal);
                result = deferred.promise();
            }
            
            return result;
        },
        
        runWorkflow: function(bounds) {
            
            var deferred = $.Deferred();
            
            var rootNode = this.quadTree.getRootNode();
            
            var self = this;
            this.runCheckGlobal().pipe(function(canUseGlobal) {
                console.log('Can use global? ', canUseGlobal);
                var task;
                if(canUseGlobal) {
                    task = self.runGlobalWorkflow(rootNode);
                } else {
                    task = self.runTiledWorkflow(bounds);
                }                

                task.done(function(nodes) {
                    deferred.resolve(nodes);
                }).fail(function() {
                    deferred.fail();
                });
            }).fail(function() {
                deferred.fail(); 
            });
            
            var result = deferred.promise();
            
            return result;
        },
    
        runGlobalWorkflow: function(node) {
        
            var self = this;
            
    
            // Fetch the items
            var baseFlow = this.createFlowForGlobal().find().concept(this.concept);            
            var result = baseFlow.asList(true).pipe(function(docs) {
                //console.log("Global fetching: ", geomToFeatureCount);
                self.loadTaskAction(node, docs);
                
                return [node];
            });
    
            /*
            loadTask.done(function() {
                $.when(self.postProcess([node])).done(function() {
                    //console.log("Global workflow completed.");
                    //console.debug("Workflow completed. Resolving deferred.");
                    result.resolve([node]);
                }).fail(function() {
                    result.fail();
                });
            }).fail(function() {
                result.fail();
            });
            */
    
            return result;
        },
        
        
        /**
         * This method implements the primary workflow for tile-based fetching data.
         * 
         * globalGeomCount = number of geoms - facets enabled, bounds disabled.
         * if(globalGeomCount > threshold) {
         * 
         * 
         *    nodes = aquire nodes.
         *    foreach(node in nodes) {
         *        fetchGeomCount in the node - facets TODO enabled or disabled?
         *        
         *        nonFullNodes = nodes where geomCount < threshold
         *        foreach(node in nonFullNodes) {
         *            fetch geomToFeatureCount - facets enabled
         *            
         *            fetch all positions of geometries in that area
         *            -- Optionally: fetchGeomToFeatureCount - facets disabled - this can be cached per type of interest!!
         *        }
         *    }
         * } 
         * 
         */
        runTiledWorkflow: function(bounds) {
            var self = this;

            console.log("Aquiring nodes for " + bounds);
            var nodes = this.quadTree.aquireNodes(bounds, 2);

            //console.log('Done aquiring');
            
            // Init the data attribute if needed
            _(nodes).each(function(node) {
                if(!node.data) {
                    node.data = {};
                }
            });
            
    
            // Mark empty nodes as loaded
            _(nodes).each(function(node) {
                if(node.isCountComplete() && node.infMinItemCount === 0) {
                    node.isLoaded = true;
                }
            });
    
            
            var uncountedNodes = _(nodes).filter(function(node) { return self.isCountingNeeded(node); });
            //console.log("# uncounted nodes", uncountedNodes.length);
    
            // The deferred is only resolved once the whole workflow completed
            var result = $.Deferred();
    
            
            var countTasks = this.createCountTasks(uncountedNodes);
            
            $.when.apply(window, countTasks).done(function() {
                var nonLoadedNodes = _(nodes).filter(function(node) { return self.isLoadingNeeded(node); });
                //console.log("# non loaded nodes", nonLoadedNodes.length, nonLoadedNodes);
                
                var loadTasks = self.createLoadTasks(nonLoadedNodes);
                $.when.apply(window, loadTasks).done(function() {
                    //ns.QuadTreeCache.finalizeLoading(nodes);
                    
                    $.when(self.postProcess(nodes)).then(function() {
                        //self.isLocked = false;
                        //console.debug("Workflow completed. Resolving deferred.");
                        result.resolve(nodes);
                    });
                });
            }).fail(function() {
                result.fail();
            });
            
            return result;
        },

        
        
        
        createCountTask: function(node) {

            var self = this;
            var limit = self.maxItemsPerTileCount ? self.maxItemsPerTileCount + 1 : null;

            var countFlow = this.createFlowForBounds(node.getBounds()).find().concept(this.concept).limit(limit);
            var result = countFlow.count().pipe(function(itemCount) {
                node.setMinItemCount(itemCount); 
                
                // If the value is 0, also mark the node as loaded
                if(itemCount === 0) {
                    //self.initNode(node);
                    node.isLoaded = true;
                }
            });
            
            return result;
        },
    
        /**
         * If either the minimum number of items in the node is above the threshold or
         * all children have been counted, then there is NO need for counting
         * 
         */
        isCountingNeeded: function(node) {
            //console.log("Node To Count:", node, node.isCountComplete());            
            return !(this.isTooManyGeoms(node) || node.isCountComplete());
        },
    
    

        /**
         * Loading is needed if NONE of the following criteria applies:
         * . node was already loaded
         * . there are no items in the node
         * . there are to many items in the node
         * 
         */
        isLoadingNeeded: function(node) {
    
            //(node.data && node.data.isLoaded)
            var noLoadingNeeded = node.isLoaded || (node.isCountComplete() && node.infMinItemCount === 0) || this.isTooManyGeoms(node);
            
            return !noLoadingNeeded;
        },
    
    
        isTooManyGeoms: function(node) {    
            //console.log("FFS", node.infMinItemCount, node.getMinItemCount());
            return node.infMinItemCount >= this.maxItemsPerTileCount;
        },
        
    
    
        createCountTasks: function(nodes) {
            var self = this;
            var result = _(nodes).chain()
                .map(function(node) {
                    return self.createCountTask(node);
                })
                .compact() // Remove null entries
                .value();
            
            /*
            var result = [];
            $.each(nodes, function(i, node) {
                var task = self.createCountTask(node);
                if(task) {
                    result.push(task);
                }
            });
            */
    
            return result;
        },
    
//    
//        /**
//         * 
//         * @param node
//         * @returns
//         */
//        createTaskGeomToFeatureCount: function(node) {
//            var result = this.backend.fetchGeomToFeatureCount().pipe(function(geomToFeatureCount) {
//                node.data.geomToFeatureCount = geomToFeatureCount;
//            });
//            
//            return result;
//        },
    
    
        /**
         * Sets the node's state to loaded, attaches the geomToFeatureCount to it.
         * 
         * @param node
         * @param geomToFeatureCount
         */
        loadTaskAction: function(node, docs) {
            //console.log('Data for ' + node.getBounds() + ': ', docs);
            node.data.docs = docs;
            node.isLoaded = true;            
        },
    
        createLoadTasks: function(nodes) {
            var self = this;
            var result = [];
                        
            //$.each(nodes, function(index, node) {
            _(nodes).each(function(node) {
                //console.debug("Inferred minimum item count: ", node.infMinItemCount);
    
                //if(node.data.absoluteGeomToFeatureCount)

                var loadFlow = self.createFlowForBounds(node.getBounds()).find().concept(self.concept);
                var loadTask = loadFlow.asList(true).pipe(function(docs) {
                    self.loadTaskAction(node, docs);
                });
    
                result.push(loadTask);
            });
            
            return result;
        },
        
            
        /**
         * TODO Finishing this method at some point to merge nodes together could be useful
         * 
         */
        finalizeLoading: function(nodes) {
            // Restructure all nodes that have been completely loaded, 
            var parents = [];
            
            $.each(nodes, function(index, node) {
                if(node.parent) {
                    parents.push(node.parent);
                }
            });
    
            parents = _.uniq(parents);
            
            var change = false;         
            do {
                change = false;
                for(var i in parents) {
                    var p = parents[i];
    
                    var children = p.children;
    
                    var didMerge = ns.tryMergeNode(p);
                    if(!didMerge) {
                        continue;
                    }
                    
                    change = true;
    
                    $.each(children, function(i, child) {
                        var indexOf = _.indexOf(nodes, child);
                        if(indexOf >= 0) {
                            nodes[indexOf] = undefined;
                        }
                    });
                    
                    nodes.push(p);
                    
                    if(p.parent) {
                        parents.push(p.parent);
                    }
                    
                    break;
                }
            } while(change == true);
            
            _.compact(nodes);
            
            /*
            $.each(nodes, function(i, node) {
                node.isLoaded = true;
            });
            */
            
            //console.log("All done");
            //self._setNodes(nodes, bounds);
            //callback.success(nodes, bounds);      
        },

    
        /**
         * TODO Make sure we never need this method again.
         * 
         * Extracts labels and geometries from the databanks that were fetched for the nodes 
         * 
         */
        postProcess: function(nodes) {
            
            return;
            
            var self = this;

            var deferred = $.Deferred();
            
            /*
            deferred.resolve({});

            return deferred;
            */
            
            
            // Here we create an rdfQuery databank object with the information we gathered
            
            var subTasks = _.map(nodes, function(node) {
    
                if(!node.data || !node.data.geomToFeatureCount) {
                    return;
                }
                
    
                
                node.data.graph = $.rdf.databank();
                
                var uriStrs = _.keys(node.data.geomToFeatureCount);
                var uris = _.map(uriStrs, function(uriStr) { return sparql.Node.uri(uriStr); });
                
                
                //console.debug("Post processing uris", uris);

                /*
                var p1 = self.labelFetcher.fetch(uriStrs).pipe(function(data) {
                    //console.log("Labels", data);
                    node.data.geomToLabel = data;
                });
                */
                

                var p2 = self.geomPosFetcher.fetch(uris).pipe(function(data) {
                    //console.log("Positions", data);
                    node.data.geomToPoint = data;
                });
    
                var databank = node.data.graph;
                _.each(node.data.geomToFeatureCount, function(count, geom) {
                    var s = sparql.Node.uri(geom);
                    var o = sparql.NodeFactory.createTypedLiteralFromString(count, xsd.xinteger.value);

                    // FIXME: appvocab.featureCount not defined (I mean, it defined in MapView.js but I don't know if
                    // MapView.js is loaded
                    var tripleStr = "" + s + " " + appvocab.featureCount + " " + o;
                    // FIXME: there is Jassa.rdf.Triple(s, p, o)
                    var triple = $.rdf.triple(tripleStr);
                    
                    databank.add(triple);                   
                });

                
                var subTask = $.when(p2).then(function() {
                    
                    var data = node.data;
                    var geomToLabel = data.geomToLabel;
                    var databank = data.graph;
                    
                    _.each(geomToLabel, function(label, uri) {
                        var s = sparql.Node.uri(uri);
                        var o = sparql.NodeFactory.createPlainLiteral(label.value, label.language);
                        
                        var tripleStr = "" + s + " " + rdfs.label + " " + o;
                        // FIXME: there is Jassa.rdf.Triple(s, p, o)
                        var triple = $.rdf.triple(tripleStr);
                        
                        databank.add(triple);
                    });
    
                    var geomToPoint = data.geomToPoint;
                    
                    _.each(geomToPoint, function(point, uri) {
                        var s = sparql.Node.uri(uri);
                        var oLon = sparql.NodeFactory.createTypedLiteralFromString(point.x, xsd.xdouble.value);
                        var oLat = sparql.NodeFactory.createTypedLiteralFromString(point.y, xsd.xdouble.value);

                        var lonTriple = "" + s + " " + geo.lon + " " + oLon; 
                        var latTriple = "" + s + " " + geo.lat + " " + oLat;
                        
                        //alert(lonTriple + " ---- " + latTriple);
                        
                        databank.add(lonTriple);
                        databank.add(latTriple);
                    });
                });
                
                return subTask;         
            });
            
            $.when.apply(window, subTasks).then(function() {
                deferred.resolve();
            });
            
            return deferred.promise();
        }


    
    });

    /**
     * 
     * 
     * @param parent
     * @returns {Boolean} true if the node was merged, false otherwise
     */
    ns.tryMergeNode = function(parent) {
        return false;
        
        if(!parent) {
            return;
        }
    
        // If all children are loaded, and the total number
        var itemCount = 0;
        for(var i in parent.children) {
            var child = parent.children[i];
            
            if(!child.isLoaded) {
                return false;
            }
            
            itemCount += child.itemCount;
        }
        
        if(itemCount >= self.maxItemsPerTileCount) {
            return false;
        }
        
        parent.isLoaded = true;
    
        for(var i in parent.children) {
            var child = parent.children[i];

            // FIXME: mergeMapsInPlace not defined
            mergeMapsInPlace(parent.idToPos, child.idToPos);

            // FIXME: mergeMapsInPlace not defined
            mergeMapsInPlace(parent.data.idToLabels, child.data.idToLabels);
            // FIXME: mergeMapsInPlace not defined
            mergeMapsInPlace(parent.data.idToTypes, child.data.idToTypes);
            
            //parent.data.ids.addAll(child.data.ids);
            //parent.data.addAll(child.data);
        }
        
        
        // Unlink children
        parent.children = null;
        
        console.log("Merged a node");
        
        return true;
    };


    
    
})(jQuery);(function() {
    
    var ns = Jassa.geo;
    
//    ns.createMapDiff = function(a, b) {
//
//        var aIds = _(a).keys();
//        var bIds = _(b).keys();
//        
//        var addedIds = _(aIds).difference(bIds);
//        var removedIds = _(bIds).difference(aIds);
//
//        var added = _(a).pick(addedIds);
//        var remoed = _(b).pick(removedIds);
//
//        var result = {
//                added: added,
//                removed: removed
//        };
//
//        return result;
//    };

    
    ns.ViewStateUtils = {
        createStateHash: function(sparqlService, geoMap, concept) {
            var serviceHash = sparqlService.getStateHash();         
            var geoHash = JSON.stringify(geoMap); //geoMap.getElementFactory().createElement().toString();
            var conceptHash = '' + concept;

            var result = serviceHash + geoHash + conceptHash;
            return result;
        },

        // TODO This function is generig; move to a better location 
        diffObjects: function(newObjs, oldObjs, idFn) {

            //function(node) {return node.getNodeId(); }
            var newIdToObj = _(newObjs).indexBy(idFn);
            var oldIdToObj = _(oldObjs).indexBy(idFn);
            
            var newIds = _(newIdToObj).keys();
            var oldIds = _(oldIdToObj).keys();
            
            var retainedIds = _(newIds).intersection(oldIds);
            
            var result = {
                retained:  _(oldIdToObj).chain().pick(retainedIds).values().value(),
                added: _(newIdToObj).chain().omit(oldIds).values().value(),
                removed: _(oldIdToObj).chain().omit(newIds).values().value()
            };

            return result;
        },
        
        diffViewStates: function(newViewState, oldViewState) {
            //oldViewState = oldViewState || new ns.ViewState(); 

            var newStateHash = newViewState.getStateHash();
            var oldStateHash = oldViewState ? oldViewState.getStateHash() : '';
            
            var newNodes = newViewState.getNodes();
            var oldNodes = oldViewState ? oldViewState.getNodes() : [];
            
            
            var result;
            
            // If the hashes do not match, replace the whole old state
            if(newStateHash != oldStateHash) {
                result = {
                    retained: [],
                    added: newNodes,
                    removed: oldNodes
                }
            }
            else {
                var idFn = function(node) {
                    var result = node.getId();
                    //console.log('NodeId', result);
                    return result;
                };
                
                result = this.diffObjects(newNodes, oldNodes, idFn);
            }
            return result;
        }        
    };
    
    /**
     * TODO/Note This data should be (also) part of the model I suppose
     */
    ns.ViewState = Class.create({
        initialize: function(sparqlService, geoMap, concept, bounds, nodes) {
            this.sparqlService = sparqlService;
            //this.concept = concept;
            this.geoMap = geoMap;
            this.concept = concept;
            this.bounds = bounds; //null; //new qt.Bounds(-9999, -9998, -9999, -9998);
            this.nodes = nodes;
        },

        getStateHash: function() {
            return ns.ViewStateUtils.createStateHash(this.sparqlService, this.geoMap, this.concept);  
        },

        // TODO Maybe the view state should remain agnostic of service and concept, and
        // instead only reveal the nodes that are part of it
        getSparqlService: function() {
             return this.sparqlService;
        },
        
        getGeoMap: function() {
            return this.geoMap;
        },
//        getConcept: function() {
//            return this.concept;
//        },
        
        /**
         * Returns the quad tree nodes intersecting with the viewport
         */
        getNodes: function() {
            return this.nodes;
        },
        
        getBounds: function() {
            return this.bounds;
        }
        
        //getVisibleG
    });

    
    /**
     * TODO Maybe replace sparqlService with sparqlServiceFactory?
     * But then the object would have to deal with services with different state.
     * Or we have a QuadTreeProvider/Factory, that creates QuadTreeObjects as needed,
     * depending on the combined state of the service and concept.
     * - Or we have a factory, that creates a MapCtrl as needed for each given service.
     * I guess the last approach is good enough.
     * 
     * 
     * Hm, rather I would prefer if some 'template' object was returned,
     * that could be instantiated with a service.
     * 
     * mapCtrl.foo(geoMapFactory, conceptFactory).createService(sparqlService);
     * or service.execute(mapping?)
     * 
     */
    ns.ViewStateFetcher = Class.create({
        //initialize: function(sparqlService, geoMapFactory, conceptFactory) {
        initialize: function() {
//            this.sparqlService = sparqlService;
//            this.geoMapFactory = geoMapFactory;
//            this.conceptFactory = conceptFactory;

            //this.conceptToService = {};
            this.hashToCache = {};
        },
        
        //fetchViewState: function(bounds) {
        fetchViewState: function(sparqlService, geoMapFactory, concept, bounds, quadTreeConfig) {
//            var sparqlService = this.sparqlService;
//            var geoMapFactory = this.geoMapFactory;
//            var conceptFactory = this.conceptFactory;
            quadTreeConfig = quadTreeConfig || {};
            
            _(quadTreeConfig).defaults(ns.ViewStateFetcher.defaultQuadTreeConfig);

            //quadTreeConfig =
            
            //var concept = conceptFactory.createConcept();
            
            // TODO Make this configurable

            var geoMap = geoMapFactory.createMapForGlobal();
            // TODO This should be a concept, I assume
            //var geoConcept = geoMap.createConcept();
            
            var hash = ns.ViewStateUtils.createStateHash(sparqlService, geoMap, concept);
            

            // TODO Combine the concept with the geoConcept...
            
            //var serviceHash = sparqlService.getStateHash();         
            //var geoConceptHash = geoMap.getElementFactory().createElement().toString();

            
            //console.log("[DEBUG] Query hash (including facets): " + hash);
            
            var cacheEntry = this.hashToCache[hash];
            if(!cacheEntry) {
                cacheEntry = new ns.QuadTreeCache(sparqlService, geoMapFactory, concept, null, quadTreeConfig);
                this.hashToCache[hash] = cacheEntry;
            }
            
            var nodePromise = cacheEntry.fetchData(bounds);
            
            // Create a new view state object
            var result = nodePromise.pipe(function(nodes) {
                var r = new ns.ViewState(sparqlService, geoMap, concept, bounds, nodes);
                return r;
            });
            
            return result;
        }
    });
    
    ns.ViewStateFetcher.defaultQuadTreeConfig = {
        maxItemsPerTileCount: 1000,
        maxGlobalItemCount: 5000
    };
    
    
})();
(function() {

    var ns = Jassa.geo.openlayers;
    var geo = Jassa.geo;

    /**
     * MapUtils for a OpenLayers map
     * 
     */
    ns.MapUtils = {
        getExtent: function(map) {
            var olRawExtent = map.getExtent();
            var e = olRawExtent.transform(map.projection, map.displayProjection);

            var result = new geo.Bounds(e.left, e.bottom, e.right, e.top);
            
            return result;
        }                  
    };

})();
(function() {

    var rdf = Jassa.rdf;
    var sparql = Jassa.sparql;
    var sponate = Jassa.sponate;
    var facete = Jassa.facete;
    
    var ns = Jassa.geo;

    var vs = rdf.NodeFactory.createVar('s');
    var vx = rdf.NodeFactory.createVar('x');
    var vy = rdf.NodeFactory.createVar('y');
    var vw = rdf.NodeFactory.createVar('w');

    
    ns.GeoConcepts = {
        conceptWgs84: new facete.Concept(sparql.ElementString.create('?s <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?x ;  <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?y'), vs),
        
        conceptGeoVocab:  new facete.Concept(sparql.ElementString.create('?s <http://www.opengis.net/ont/geosparql#asWKT> ?w'), vs)
    };
    
    var mapParser = new sponate.MapParser();

    ns.GeoMapUtils = {
        wgs84GeoView: mapParser.parseMap({
            name: 'lonlat',
            template: [{
                id: ns.GeoConcepts.conceptWgs84.getVar(), //'?s',
                lon: vx, // '?x',
                lat: vy, // '?y'
                wkt: function(b) {
					var result = rdf.NodeFactory.createTypedLiteralFromString('POINT(' + b.get(vx).getLiteralValue() + ' ' + b.get(vy).getLiteralValue() + ')', 'http://www.opengis.net/ont/geosparql#wktLiteral');
					return result;
				}
            }],
            from: ns.GeoConcepts.conceptWgs84.getElement()
        }),

        ogcGeoView: mapParser.parseMap({
            name: 'lonlat',
            template: [{
                id: ns.GeoConcepts.conceptGeoVocab.getVar(),
                wkt: vw
            }],
            from: ns.GeoConcepts.conceptGeoVocab.getElement()
        })
    };

    var intersectsFnName = 'bif:st_intersects';
    var geomFromTextFnName = 'bif:st_geomFromText';

    ns.GeoMapFactoryUtils = {
    
        wgs84MapFactory: new sponate.GeoMapFactory(
                ns.GeoMapUtils.wgs84GeoView,
                new ns.BBoxExprFactoryWgs84(vx, vy)
        ),

        ogcVirtMapFactory: new sponate.GeoMapFactory(
                ns.GeoMapUtils.ogcGeoView,
                new ns.BBoxExprFactoryWkt(vw, intersectsFnName, geomFromTextFnName)
        ),
        
        // TODO Replace defaults with geosparql rather than virtuoso bifs
        createWktMapFactory: function(wktPredicateName, intersectsFnName, geomFromTextFnName) {
            wktPredicateName = wktPredicateName || 'http://www.opengis.net/ont/geosparql#asWKT';
            intersectsFnName = intersectsFnName || 'bif:st_intersects';
            geomFromTextFnName = geomFromTextFnName || 'bif:st_geomFromText'; 
           
            var predicate = rdf.NodeFactory.createUri(wktPredicateName);
            
            var geoConcept = new facete.Concept(
                new sparql.ElementTriplesBlock([new rdf.Triple(vs, predicate, vw)]),
                vs
            );

            var baseMap = mapParser.parseMap({
                name: 'geoMap-' + wktPredicateName,
                template: [{
                    id: geoConcept.getVar(),
                    wkt: vw
                }],
                from: geoConcept.getElement()
            });
            
            
            var result = new sponate.GeoMapFactory(
                    baseMap,
                    new ns.BBoxExprFactoryWkt(vw, intersectsFnName, geomFromTextFnName)
            );
            
            return result;
        }
    };

})();
