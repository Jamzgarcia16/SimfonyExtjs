/* global Function, exports, DOMParser, Error, Ext, Test, ST */

/**
 * Top level namespace for Jasmine, a lightweight JavaScript BDD/spec/testing framework.
 *
 * @namespace
 */
var jasmine = {};

/**
 * Set to `true` to enable a set of optimizations for unattended test runs
 * in CI environments.
 */
jasmine.CI_ENVIRONMENT = false;

/**
 * Set to `true` to enable debugging facilities like console dumps for leaked resources,
 * breaking on caught exceptions, etc. This mode is assumed to be mutually exclusive with
 * the above CI_ENVIRONMENT, but even when not in CI it is turned off by default.
 * Local runner will turn it on when a specific set of suites/specs is loaded, as opposed
 * to whole test suite.
 */
jasmine.DEBUGGING_MODE = false;

/**
 * Show diagnostic messages in the console if set to true
 *
 */
jasmine.VERBOSE = !jasmine.CI_ENVIRONMENT;

/**
 * Maximum levels of nesting that will be included when an object is pretty-printed.
 */
jasmine.MAX_PRETTY_PRINT_DEPTH = 1;

/**
 * Set to `true` to shuffle the execution order of specs and suites to get
 * less predictable results.
 */
jasmine.SHUFFLE = false;

/**
 * Default interval in milliseconds for event loop yields (e.g. to allow network activity
 * or to refresh the screen with the HTML-based runner). Small values here may result in
 * slow test running. Zero means no updates until all tests have completed.
 *
 */
jasmine.DEFAULT_UPDATE_INTERVAL = 250;

/**
 * Default timeout interval in milliseconds for waitsFor() blocks.
 */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

/**
 * Default timeout interval in milliseconds for WaitsForEvent blocks.
 */
jasmine.DEFAULT_EVENT_TIMEOUT = 1000;

/**
 * Default watchdog timeout interval used to abort runaway blocks that are
 * taking too long to complete. Set this reasonably high to accommodate for
 * the old and slow browsers; we want to catch otherwise catastrophic things
 * like endless loops.
 */
jasmine.DEFAULT_WATCHDOG_INTERVAL = 120000;

/**
 * By default exceptions thrown in the context of a test are caught by jasmine
 * so that it can run the remaining tests in the suite.
 * Set to false to let the exception bubble up in the browser.
 *
 */
jasmine.CATCH_EXCEPTIONS = true;

/**
 * Set to `false` to disable all leak checks performed after completion of every
 * spec. At the moment, we're checking for global variables, DOM nodes, Component
 * instances, timers, data Stores, etc. added but not removed in the spec.
 */
jasmine.CHECK_LEAKS = true;

/**
 * Set to `false` to disable Component creation point tracking. This is done by
 * capturing call stack in Component constructor, and this operation adds some
 * overhead that is only useful when debugging.
 * While this option is enabled by default, it is advised to disable it in CI
 * environments.
 */
jasmine.CAPTURE_CALL_STACK = !jasmine.CI_ENVIRONMENT;

/**
 * Set to `false` to disable clearing prototype upon object destruction. This is
 * a very useful option for unit tests so think hard before disabling it!
 */
jasmine.CLEAR_PROTOTYPE = true;

/**
 * Set to `false` to prevent saving result details for passed expectations.
 * By default we keep stringified details for expected and actual values
 * because the user might want to evaluate these; however there is a cost to it
 * that is meaningless when running in automated TC environments that only report
 * details for spec failures.
 */
jasmine.KEEP_PASSED_RESULTS = !jasmine.CI_ENVIRONMENT;

/**
 * The regular expression used by {@link #topSuite} to match class name
 * requirements.
 */
jasmine.TOP_SUITE_PREFIX = /^Ext\./;

/**
 * The delimiter to use when computing full name of a spec. To prevent collisions
 * we use HTML character entity for space that looks ordinary when rendered in HTML
 * but is highly unlikely to be used in suite/spec descriptions:
 *
 * // Spec full name is "foo bar&#32;baz"
 * describe("foo bar", function() {
 *     it("baz", function() {});
 * });
 *
 * // Spec full name is "foo&#32;bar baz"
 * describe("foo", function() {
 *     it("bar baz", function() {});
 * });
 */
jasmine.FULL_NAME_DELIMITER = '&#32;';
jasmine.FULL_NAME_DELIMITER_RE = new RegExp(jasmine.FULL_NAME_DELIMITER, 'g');

/**
 * @private
 */
jasmine._unimplementedMethod = function() {
    throw new Error("unimplemented method");
};

/**
 * Use `jasmine.undefined` instead of `undefined`, since `undefined` is just
 * a plain old variable and may be redefined by somebody else.
 *
 * @private
 */
jasmine.undefined = jasmine.___undefined___;

// Usually Ext will install this polyfill but it may be loaded later
if (!Function.prototype.bind) {
    Function.prototype.bind = (function() {
        var slice = Array.prototype.slice,
            proto = Function.prototype,
            emptyArgs = [];
        
        emptyArgs.isEmpty = true;
        
        return function(me) {
            var method = this,
                args = arguments.length > 1 ? slice.call(arguments, 1) : emptyArgs;
            
            if (args.isEmpty) {
                return function() {
                    return method.apply(me, arguments);
                }
            }
            else {
                return function() {
                    return method.apply(me, arguments.length ? args.concat(slice.call(arguments)) : args);
                }
            }
        };
    })();
}

(function() {
    var objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        enumerables = ['valueOf', 'toLocaleString', 'toString', 'constructor'];
    
    for (var i in { toString: 1 }) {
        enumerables = null;
    };
    
    jasmine.apply = function(object, config, defaults) {
        if (defaults) {
            Test.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };
})();

jasmine.abortAll = function() {
    jasmine.ABORT_ALL_QUEUES = true;
};

jasmine.isReady = function() {
    return jasmine.env.isReady();
};

jasmine.onReady = function() {
    var env = jasmine.env;
    
    return env.onReady.apply(env, arguments);
};

jasmine.blockReady = function() {
    return jasmine.env.blockReady();
};

jasmine.unblockReady = function() {
    return jasmine.env.unblockReady();
};

jasmine.emptyFn = function() {};

jasmine.getGlobal = function() {
    function getGlobal() {
        return this;
    }
    
    return getGlobal();
};

jasmine.startLoadingDependencies = jasmine.emptyFn;
jasmine.installDependenciesCallback = jasmine.emptyFn;

/**
 * Allows for bound functions to be compared. Internal use only.
 *
 * @ignore
 * @private
 * @param base {Object} bound 'this' for the function
 * @param name {Function} function to find
 */
jasmine._bindOriginal = function(base, name) {
  var original = base[name];
  
    if (original.apply) {
        return function() {
            return original.apply(base, arguments);
        };
    }
    else {
        // IE support
        return jasmine.getGlobal()[name];
    }
};

(function() {
    var global = jasmine.getGlobal();
    
    jasmine.setTimeout = jasmine._bindOriginal(global, 'setTimeout');
    jasmine.clearTimeout = jasmine._bindOriginal(global, 'clearTimeout');
    jasmine.setInterval = jasmine._bindOriginal(global, 'setInterval');
    jasmine.clearInterval = jasmine._bindOriginal(global, 'clearInterval');
    
    jasmine._setTimeout = global.setTimeout;
    jasmine._clearTimeout = global.clearTimeout;
    jasmine._setInterval = global.setInterval;
    jasmine._clearInterval = global.clearInterval;
    
    if (global.setImmediate) {
        jasmine._setImmediate = global.setImmediate;
    }
    
    if (global.clearImmediate) {
        jasmine._clearImmediate = global.clearImmediate;
    }
    
    jasmine._requestAnimationFrame = (function() {
        var requestAnimFrame = global.requestAnimationFrame ||
                global.webkitRequestAnimationFrame ||
                global.mozRequestAnimationFrame ||
                global.oRequestAnimationFrame ||
                function(callback) {
                    var currTime = jasmine.util.now(),
                        timeToCall = Math.max(0, 16 - (currTime - jasmine._lastFakeFrameTime)),
                        id = jasmine.setTimeout(function() {
                            callback(currTime + timeToCall);
                        }, timeToCall);
                    jasmine._lastFakeFrameTime = currTime + timeToCall;
                    return id;
                };
    
        return function(fn) {
            if (requestAnimFrame.apply) {
                return requestAnimFrame.apply(global, arguments);
            } else {
                return requestAnimFrame(fn);
            }
        };
    })();
})();

jasmine._lastFakeFrameTime = 0;

jasmine.MessageResult = function(values) {
    this.type = 'log';
    this.values = values;
    this.trace = new Error(); // todo: test better
};

jasmine.MessageResult.prototype.toString = function() {
    var text = "";
    
    for (var i = 0; i < this.values.length; i++) {
        if (i > 0) text += " ";
        
        if (jasmine.isString(this.values[i])) {
            text += this.values[i];
        }
        else {
            text += jasmine.pp(this.values[i]);
        }
    }
    
    return text;
};

jasmine.ErrorResult = function(params) {
    this.type = 'error';
    this.message = params.message || 'Error.';
    
    if (params.trace) {
        this.trace = params.trace;
    }
};

jasmine.ErrorResult.prototype.toString = function() {
    return this.message;
};

jasmine.ErrorResult.prototype.passed = function() {
    return false;
};

jasmine.ExpectationResult = function(params) {
    this.type = 'expect';
    this.matcherName = params.matcherName;
    this._passed = params.passed;
    this.message = this._passed ? 'Passed.' : params.message;
    
    if (!this._passed || params.keepPassed) {
        this.expected = params.expected;
        this.actual = params.actual;
    }
    
    this.error = this._passed ? '' : (params.error || '');
    this.trace = this._passed ? '' : (params.trace || '');
};

jasmine.ExpectationResult.prototype.toString = function() {
    return this.message;
};

jasmine.ExpectationResult.prototype._passed = function() {
    return this._passed;
};

jasmine.ExpectationResult.prototype.passed = function() {
    return this._passed;
};

/**
 * Getter for the Jasmine environment. Ensures one gets created
 */
jasmine.getEnv = function() {
    return jasmine.env;
};

/**
 * @ignore
 * @private
 * @param value
 * @returns {Boolean}
 */
jasmine.isArray = function(value) {
    return jasmine._isA("Array", value);
};

/**
 * @ignore
 * @private
 * @param value
 * @returns {Boolean}
 */
jasmine.isString = function(value) {
    return jasmine._isA("String", value);
};

/**
 * @ignore
 * @private
 * @param value
 * @returns {Boolean}
 */
jasmine.isNumber = function(value) {
    return jasmine._isA("Number", value);
};

/**
 * @ignore
 * @private
 * @param {String} typeName
 * @param value
 * @returns {Boolean}
 */
jasmine._isA = function(typeName, value) {
    return Object.prototype.toString.apply(value) === '[object ' + typeName + ']';
};

/**
 * Pretty printer for expectations. Takes any object and turns it into a human-readable string.
 *
 * @param {Object} value an object to be outputted
 * @param {Number} [depth] Optional nested object depth
 *
 * @returns {String}
 */
jasmine.pp = function(value, depth) {
    var stringPrettyPrinter = new jasmine.StringPrettyPrinter(depth);
    
    stringPrettyPrinter.format(value);
    
    return stringPrettyPrinter.string;
};

/**
 * Returns true if the object is a DOM Node.
 *
 * @param {Object} obj object to check
 * @returns {Boolean}
 */
jasmine.isDomNode = function(obj) {
    return obj.nodeType > 0;
};

/**
 * Returns a matchable 'generic' object of the class type.  For use in expecations of type when values don't matter.
 *
 * @example
 * // don't care about which function is passed in, as long as it's a function
 * expect(mySpy).toHaveBeenCalledWith(jasmine.any(Function));
 *
 * @param {Class} clazz
 * @returns matchable object of the type clazz
 */
jasmine.any = function(clazz) {
    return new jasmine.Matchers.Any(clazz);
};

/**
 * Returns a matchable subset of a JSON object. For use in expectations when you don't care about all of the
 * attributes on the object.
 *
 * @example
 * // don't care about any other attributes than foo.
 * expect(mySpy).toHaveBeenCalledWith(jasmine.objectContaining({foo: "bar"});
 *
 * @param sample {Object} sample
 * @returns matchable object for the sample
 */
jasmine.objectContaining = function(sample) {
    return new jasmine.Matchers.ObjectContaining(sample);
};

/**
 * Jasmine Spies are test doubles that can act as stubs, spies, fakes or when used in an expecation, mocks.
 *
 * Spies should be created in test setup, before expectations.  They can then be checked, using the standard Jasmine
 * expectation syntax. Spies can be checked if they were called or not and what the calling params were.
 *
 * A Spy has the following fields: wasCalled, callCount, mostRecentCall, and argsForCall (see docs).
 *
 * Spies are torn down at the end of every spec.
 *
 * Note: Do <b>not</b> call new jasmine.Spy() directly - a spy must be created using spyOn, jasmine.createSpy or jasmine.createSpyObj.
 *
 * @example
 * // a stub
 * var myStub = jasmine.createSpy('myStub');  // can be used anywhere
 *
 * // spy example
 * var foo = {
 *   not: function(bool) { return !bool; }
 * }
 *
 * // actual foo.not will not be called, execution stops
 * spyOn(foo, 'not');

 // foo.not spied upon, execution will continue to implementation
 * spyOn(foo, 'not').andCallThrough();
 *
 * // fake example
 * var foo = {
 *   not: function(bool) { return !bool; }
 * }
 *
 * // foo.not(val) will return val
 * spyOn(foo, 'not').andCallFake(function(value) {return value;});
 *
 * // mock example
 * foo.not(7 == 7);
 * expect(foo.not).toHaveBeenCalled();
 * expect(foo.not).toHaveBeenCalledWith(true);
 *
 * @constructor
 * @see spyOn, jasmine.createSpy, jasmine.createSpyObj
 * @param {String} name
 */
jasmine.Spy = function(name) {
    this.identity = name || 'unknown';
    this.isSpy = true;
    
    // The actual function this spy stubs.
    this.plan = jasmine.emptyFn;
    
    /**
     * Tracking of the most recent call to the spy.
     * @example
     * var mySpy = jasmine.createSpy('foo');
     * mySpy(1, 2);
     * mySpy.mostRecentCall.args = [1, 2];
     */
    this.mostRecentCall = {};
    
    /**
     * Holds arguments for each call to the spy, indexed by call count
     * @example
     * var mySpy = jasmine.createSpy('foo');
     * mySpy(1, 2);
     * mySpy(7, 8);
     * mySpy.mostRecentCall.args = [7, 8];
     * mySpy.argsForCall[0] = [1, 2];
     * mySpy.argsForCall[1] = [7, 8];
     */
    this.argsForCall = [];
    this.calls = [];
};

/**
 * Tells a spy to call through to the actual implemenatation.
 *
 * @example
 * var foo = {
 *   bar: function() { // do some stuff }
 * }
 *
 * // defining a spy on an existing property: foo.bar
 * spyOn(foo, 'bar').andCallThrough();
 */
jasmine.Spy.prototype.andCallThrough = function() {
    this.plan = this.originalValue;
    return this;
};

/**
 * For setting the return value of a spy.
 *
 * @example
 * // defining a spy from scratch: foo() returns 'baz'
 * var foo = jasmine.createSpy('spy on foo').andReturn('baz');
 *
 * // defining a spy on an existing property: foo.bar() returns 'baz'
 * spyOn(foo, 'bar').andReturn('baz');
 *
 * @param {Object} value
 */
jasmine.Spy.prototype.andReturn = function(value) {
    this.plan = function() {
        return value;
    };
    
    return this;
};

/**
 * For throwing an exception when a spy is called.
 *
 * @example
 * // defining a spy from scratch: foo() throws an exception w/ message 'ouch'
 * var foo = jasmine.createSpy('spy on foo').andThrow('baz');
 *
 * // defining a spy on an existing property: foo.bar() throws an exception w/ message 'ouch'
 * spyOn(foo, 'bar').andThrow('baz');
 *
 * @param {String} exceptionMsg
 */
jasmine.Spy.prototype.andThrow = function(exceptionMsg) {
    this.plan = function() {
        throw exceptionMsg;
    };
    
    return this;
};

/**
 * Calls an alternate implementation when a spy is called.
 *
 * @example
 * var baz = function() {
 *   // do some stuff, return something
 * }
 * // defining a spy from scratch: foo() calls the function baz
 * var foo = jasmine.createSpy('spy on foo').andCall(baz);
 *
 * // defining a spy on an existing property: foo.bar() calls an anonymnous function
 * spyOn(foo, 'bar').andCall(function() { return 'baz';} );
 *
 * @param {Function} fakeFunc
 */
jasmine.Spy.prototype.andCallFake = function(fakeFunc) {
    this.plan = fakeFunc;
    
    return this;
};

/**
 * Resets all of a spy's the tracking variables so that it can be used again.
 *
 * @example
 * spyOn(foo, 'bar');
 *
 * foo.bar();
 *
 * expect(foo.bar.callCount).toEqual(1);
 *
 * foo.bar.reset();
 *
 * expect(foo.bar.callCount).toEqual(0);
 */
jasmine.Spy.prototype.reset = function() {
    this.wasCalled = false;
    this.callCount = 0;
    this.argsForCall = [];
    this.calls = [];
    this.mostRecentCall = {};
};

jasmine.Spy.callSequence = 0;

jasmine.createSpy = function(name) {
    var spyObj,
        spy = new jasmine.Spy(name),
        setTimeout = jasmine._setTimeout,
        emptyArgs = [],
        prop;

    spyObj = function() {
        var spec = jasmine.env.currentSpec,
            callIndex = spyObj.callCount,
            args = arguments.length ? jasmine.util.argsToArray(arguments) : emptyArgs,
            result, doAfter;

        spyObj.callSequence = jasmine.Spy.callSequence++;
        spyObj.wasCalled = true;
        spyObj.callCount++;
        spyObj.mostRecentCall.object = spyObj.mostRecentCall.scope = this;
        spyObj.mostRecentCall.args = args;

        // N.B.: This is where the original function is called. Careful stepping through!
        spyObj.mostRecentCall.result = result = spyObj.plan.apply(this, arguments);

        spyObj.argsForCall[callIndex] = args;
        
        spyObj.calls[callIndex] = { object: this, scope: this, args: args, result: result };

        // Call any configured follow on unless it's too late.
        // Used in waitsForSpy.
        doAfter = spyObj.doAfter;
        
        if (doAfter) {
            spyObj.doAfter = null;
            delete spyObj.doAfter;
            
            doAfter();
        }

        return result;
    };
    
    for (prop in spy) {
        spyObj[prop] = spy[prop];
    }
    
    // We don't want spies to be cleaned up in Base destructor
    spyObj.$noClearOnDestroy = true;
    
    spyObj.reset();
    
    return spyObj;
};

/**
 * Determines whether an object is a spy.
 *
 * @param {jasmine.Spy|Object} putativeSpy
 * @returns {Boolean}
 */
jasmine.isSpy = function(putativeSpy) {
    return putativeSpy && putativeSpy.isSpy;
};

/**
 * Creates a more complicated spy: an Object that has every property a function that is a spy.  Used for stubbing something
 * large in one call.
 *
 * @param {String} baseName name of spy class
 * @param {Array} methodNames array of names of methods to make spies
 */
jasmine.createSpyObj = function(baseName, methodNames) {
    if (!jasmine.isArray(methodNames) || methodNames.length === 0) {
        throw new Error('createSpyObj requires a non-empty array of method names to create spies for');
    }
    
    var obj = {};
    
    for (var i = 0; i < methodNames.length; i++) {
        obj[methodNames[i]] = jasmine.createSpy(baseName + '.' + methodNames[i]);
    }
    
    return obj;
};

/**
 * All parameters are pretty-printed and concatenated together, then written
 * to the current spec's output.
 *
 * Be careful not to leave calls to <code>jasmine.log</code> in production code.
 */
jasmine.log = function() {
    var spec = jasmine.env.currentSpec;
    
    spec.log.apply(spec, arguments);
};

/**
 * Creates a Jasmine spec that will be added to the current suite.
 *
 * // TODO: pending tests
 *
 * @example
 * it('should be true', function() {
 *   expect(true).toEqual(true);
 * });
 *
 * @param {String} desc description of this specification
 * @param {Function} func defines the preconditions and expectations of the spec
 * @param {Object} [options] Options specific to this spec
 * @param {Number} [options.timeout] Override for global jasmine.DEFAULT_WATCHDOG_INTERVAL
 * @param {Boolean} [options.disableTryCatch] Override for global jasmine.CATCH_EXCEPTIONS
 */
var it = function(desc, func, options) {
    return jasmine.env.it(desc, func, options);
};

/**
 * Creates a *disabled* Jasmine spec.
 *
 * A convenience method that allows existing specs to be disabled temporarily during development.
 *
 * @param {String} desc description of this specification
 * @param {Function} func defines the preconditions and expectations of the spec
 * @param {Object} [options] Options specific to this spec
 */
var xit = function(desc, func, options) {
    return jasmine.env.it(desc, func, options).disable();
};

/**
 * Creates a Jasmine spec for an object.
 */
var specFor = function(object, specForFn) {
    jasmine.env.specFor(object, specForFn);
};

/**
 * Creates a *disabled* Jasmine spec for an object.
 */
var xspecFor = function(object, specForFn) {
    jasmine.env.xspecFor(object, specForFn);
};

/**
 * Function that installs a spy on an existing object's method name. 
 * Used within a Spec to create a spy.
 *
 * @example
 * // spy example
 * var foo = {
 *   not: function(bool) { return !bool; }
 * }
 * spyOn(foo, 'not'); // actual foo.not will not be called, execution stops
 *
 * @see jasmine.createSpy
 * @param obj
 * @param methodName
 * @return {jasmine.Spy} a Jasmine spy that can be chained with all spy methods
 */
var spyOn = function(obj, methodName) {
    return jasmine.env.spyOn(obj, methodName);
};

/**
 * Starts a chain for a Jasmine expectation.
 *
 * It is passed an Object that is the actual value and should chain to one of the many
 * jasmine.Matchers functions.
 *
 * @param {Object} actual Actual value to test against and expected value
 * @return {jasmine.Matchers}
 */
var expect = function(actual) {
    return jasmine.env.expect(actual);
};

/**
 * Defines part of a jasmine spec. Used in cominbination with waits or waitsFor
 * in asynchronous specs.
 *
 * @param {Function} func Function that defines part of a jasmine spec.
 */
var runs = function(func) {
    jasmine.env.runs(func);
};

var run = runs;

/**
 * Waits a fixed time period before moving to the next block.
 *
 * @deprecated Use waitsFor() instead
 * @param {Number} timeout milliseconds to wait
 */
var waits = function(timeout) {
    jasmine.env.waits(timeout);
};

var wait = waits;

/**
 * Waits for the latchFunction to return true before proceeding to the next block.
 *
 * @param {Function} latchFunction
 * @param {String} timeoutMessage
 * @param {Number} timeout
 * @param {Number} timeout_increment
 */
var waitsFor = function() {
    jasmine.env.waitsFor.apply(jasmine.env, arguments);
};

var waitFor = waitsFor;

/**
 * Waits for the Spy to have been called before proceeding to the next block.
 *
 * @param {jasmine.Spy} spy to wait for
 * @param {String} [timeoutMessage] Optional timeout message
 * @param {Number} [timeout] Optional timeout in ms
 */
var waitsForSpy = function() {
    return jasmine.env.waitsForSpy.apply(jasmine.env, arguments);
};

var waitForSpy = waitsForSpy;

var waitsForSpyCalled = function(spy, timeoutMessage, timeout) {
    waitsForSpy(spy, timeoutMessage, timeout);
    
    runs(function() {
        expect(spy).toHaveBeenCalled();
    });
};

var waitForSpyCalled = waitsForSpyCalled;

var spyOnEvent = jasmine.spyOnEvent = function(object, eventName, fn) {
    var obj = {
        fn: fn || Ext.emptyFn
    },
    spy = spyOn(obj, "fn").andCallThrough();
    object.addListener(eventName, obj.fn);
    return spy;
};

/**
 * Works just like waits() and waitsFor(), except waits for the next animationFrame.
 * Must wait an extra while for platforms which do not have RAF and which
 * just wait on a 16ms timer.
 */
var waitsForAnimation = function() {
    var setTimeout = jasmine._setTimeout,
        requestAnimationFrame = jasmine._requestAnimationFrame;

    waitsFor(function(done) {
        var doneCalled = false;

        requestAnimationFrame(function() {
            if (!doneCalled) {
                doneCalled = true;
                setTimeout(done, 1);
            }
        });

        // Set a secondary timeout in case the animation frame does not fire.
        // On iOS simulation devices animation frames can be indefinitely delayed,
        // so ensure that we signal done eventually.
        setTimeout(function() {
            if (!doneCalled) {
                doneCalled = true;
                done();
            }
        }, 60);
    }, 'animation frame to fire');
};

/**
 * Waits for the passed object to fire the passed event name before proceeding to the next block.
 *
 * @param {Ext.mixin.Observable} eventSource The object which is going to fire the event.
 * @param {String} eventName The name of the event to wait for.
 * @param {String} [timeoutMessage] Optional timeout message
 * @param {Number} [timeout] Optional timeout in ms
 */
var waitsForEvent = function(eventSource, eventName, timeoutMessage, timeout) {
    return jasmine.env.waitsForEvent(eventSource, eventName, timeoutMessage, timeout);
};

var waitForEvent = waitsForEvent;

jasmine.waitsForFocus = jasmine.waitForFocus = function(focusable, message, timeout) {
    return jasmine.waitsForFocusOrBlur('focus', focusable, message, timeout);
};

var waitsForFocus = jasmine.waitsForFocus,
    waitForFocus = jasmine.waitsForFocus;

jasmine.waitsForBlur = jasmine.waitForBlur = function(focusable, message, timeout) {
    return jasmine.waitsForFocusOrBlur('blur', focusable, message, timeout);
};

var waitsForBlur = jasmine.waitsForBlur,
    waitForBlur = jasmine.waitsForBlur;

/**
 * A function that is called before each spec in a suite.
 *
 * Used for spec setup, including validating assumptions.
 *
 * @param {Function} beforeEachFunction
 */
var beforeEach = function(beforeEachFunction) {
    jasmine.env.beforeEach(beforeEachFunction);
};

/**
 * A function that is called before all specs and `beforeEach` functions
 * in a suite, and only once per suite. Use this function for setup
 * when individual specs can safely share the test subject.
 *
 * See also the corresponding {@link #afterAll}.
 *
 * @param {Function} beforeAllFunction
 */
var beforeAll = function(beforeAllFunction) {
    jasmine.env.beforeAll(beforeAllFunction);
};

/**
 * A function that is called after each spec in a suite.
 *
 * Used for restoring any state that is hijacked during spec execution.
 *
 * @param {Function} afterEachFunction
 */
var afterEach = function(afterEachFunction) {
    jasmine.env.afterEach(afterEachFunction);
};

/**
 * A function that is called after all specs and `afterEach` functions
 * in a suite, and only once per suite. Use this function for tear down
 * of any resources allocated in `beforeAll`.
 *
 * See also corresponding {@link #beforeAll}.
 *
 * @param {Function} afterAllFunction
 */
var afterAll = function(afterAllFunction) {
    jasmine.env.afterAll(afterAllFunction);
};

/**
 * A "keyword" that inverts the meaning of the suite or spec that immediately
 * follows, to allow writing specs for cases not yet implemented, or not yet
 * working, or never expected to pass. This "keyword" function accepts an optional
 * Boolean condition value, or a function that should return a value; when the value
 * is `true` (or omitted), the following spec or suite is considered "to do".
 *
 * A "to do" spec **will be executed** but its result is reverted: when one or more
 * expectations in a "to do" spec are not met and the spec fails, that is considered
 * a success because the code under test is "to be implemented". However when all
 * expectations are met and the spec succeeds, such result is considered *a failure*
 * and the spec will be failed with corresponding error, on the premise that something
 * could possibly go wrong and somebody should look into that.
 *
 * Suites marked as "to do" behave in a similar way: all enabled specs are duly executed,
 * and if at least one of them fails that is considered normal. However if all specs
 * within the "to do" suite pass, that is considered a failure.
 *
 * When the condition is `false`, that means that the following spec or suite
 * should be considered implemented and working, and result inversion logic
 * is *not* applied. In effect, `toDo(false, "foo")` is equivalent to not having
 * `toDo` prefix at all.
 *
 * If an optional description is given, it will be attached to the tests that
 * wrongly pass in a toDo suite or spec.
 *
 * Suites or specs marked as "to do" and disabled with xdescribe() and xit()
 * will not be executed.
 *
 * Example usage:
 *
 *      toDo(). // Defaults to `true`
 *      describe('foo', function() {
 *          ...
 *      });
 *
 *      toDo("Not yet implemented").
 *      describe("new feature", function() {
 *          ...
 *      });
 *
 *      toDo(!window.addEventListener, 'IE8 and below are not yet supported').
 *      it('bar', function() {
 *          ...
 *      });
 *
 * Note that by convention, toDo() call should precede the suite or spec
 * without indenting it. This allows minimal changes to the code when
 * the pending functionality is implemented and toDo() block is removed.
 *
 * Parameters are recognized in any order, for convenience.
 *
 * @param {Boolean/Function} [condition=true] The condition that should be met
 * for the following suite or spec to be considered "to do". If the condition
 * is `false`, the suite or spec will behave in a normal way.
 *
 * @param {String} [description] Optional description for "to do".
 *
 */
var toDo = function() {
    return jasmine.env.toDo.apply(jasmine.env, arguments);
};

// People tend to forget the case, and TODO() might be easier to find.
var todo = toDo;
var TODO = toDo;

/**
 * Defines a top suite of unit tests for a particular module. Spec definitions
 * will be processed after optional module requirements are met.
 *
 * @param {String} description Name of the suite, usually the class under test.
 * @param {String/String[]} [requirements] The list of classes to load before
 * processing spec definitions. If this argument is omitted, and `description`
 * matches {@link jasmine.TOP_DESCRIBE_PREFIX} expression, then description
 * is assumed to be the class name to require.
 * @param {Function} specDefinitions Function that defines specs and suites
 *
 * Example:
 *
 *      // Require Ext.panel.Panel before defining specs for it
 *      topSuite("Ext.panel.Panel", function() {
 *          ...
 *      });
 *      
 *      // Explicitly list dependencies
 *      topSuite("grid-general", ["Ext.grid.Panel", "Ext.data.ProxyStore"],
 *      function() {
 *          ...
 *      });
 * 
 */
var topSuite = function() {
    return jasmine.env.topSuite.apply(jasmine.env, arguments);
};

var xtopSuite = jasmine.emptyFn;

/**
 * Defines a suite of specifications.
 *
 * Stores the description and all defined specs in the Jasmine environment as one suite of specs.
 * Variables declared are accessible by calls to beforeEach, it, and afterEach. Describe blocks
 * can be nested, allowing for specialization of setup in some tests.
 *
 * @example
 *
 *      describe("this should work", function() {
 *          beforeEach(function() {
 *              setUpForTests();
 *          });
 *          
 *          it("should be true", function() {
 *              expect(true).toBe(true);
 *          });
 *      });
 *      
 *      describe("this should work, too", function() {
 *          beforeEach(function() {
 *              doSomethingBeforeEachSpec();
 *          });
 *          
 *          it("should be false", function() {
 *              expect(false).toBe(false);
 *          });
 *          
 *          describe("nested suite", function() {
 *              beforeEach(function() {
 *                  doSomethingBeforeEachSpecInThisSuiteOnly();
 *              });
 *              
 *              it("should be obvious", function() {
 *                  expect(42 === 42).toBeTruthy();
 *              });
 *          });
 *      });
 *
 * @param {String} description A string, usually the class under test.
 * @param {Function} specDefinitions function that defines several specs and/or nested suites.
 */
var describe = function(description, specDefinitions) {
    var env = jasmine.env;
    
    if (env.currentSuite.isRootSuite) {
        return env.topSuite(description, '*', specDefinitions);
    }
    else {
        return env.describe(description, specDefinitions);
    }
};

/**
 * Disables a suite of specifications.  Used to disable some suites in a file, or files,
 * temporarily during development.
 *
 * @param {String} description A string, usually the class under test.
 * @param {Function} specDefinitions function that defines several specs.
 */
var xdescribe = function(description, specDefinitions) {
    // The reason we do it this way instead of passing as an argument is backward compat.
    // There are some ancient suites that pass extra arguments to describe(), which may
    // accidentally disable otherwise runnable suites.
    specDefinitions.enabled = false;
    
    return describe(description, specDefinitions);
};

// Provide the XMLHttpRequest class for IE 5.x-6.x:
jasmine.XmlHttpRequest = (typeof XMLHttpRequest !== "undefined") ? XMLHttpRequest : function() {
    function tryIt(f) {
        try {
            return f();
        }
        catch(e) {}
        
        return null;
    }
    
    var xhr = tryIt(function() {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        }) ||
        tryIt(function() {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        }) ||
        tryIt(function() {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }) ||
        tryIt(function() {
            return new ActiveXObject("Microsoft.XMLHTTP");
        });
    
    if (!xhr) {
        throw new Error("This browser does not support XMLHttpRequest.");
    }
    
    return xhr;
};

jasmine.setCurrentScript = function(file) {
    if (typeof Ext !== "undefined" && Ext.cmd && Ext.cmd.api && Ext.cmd.api.adapter) {
        Ext.cmd.api.adapter.setCurrentScript(file);
    }
};

jasmine.getCurrentScript = function() {
    if (typeof Ext !== "undefined" && Ext.cmd && Ext.cmd.api && Ext.cmd.api.adapter) {
        return Ext.cmd.api.adapter.getCurrentScript();
    }
    
    return null;
};

jasmine.setOptions = function(jsonString) {
    jasmine._options = JSON.parse(jsonString);
};

jasmine.getOptions = function() {
    return jasmine._options || {};
};

jasmine.initDebug = function() {
    var spec = jasmine.getOptions().spec;
    
    if (spec) {
        var specId = parseInt(spec);
        
        this.env.specFilter = function(spec) {
            if (spec.getId() === specId) {
                spec.debugBlocks = true;
                
                return true;
            }
            else {
                return false;
            }
        };
    }
};

jasmine.generateDebuggableBlock = function(fn) {
    return function() {
        debugger;
        /* Step into the function below */
        fn.apply(this, arguments);
    };
};

jasmine.showDebugPrompt = function(callback) {
    if (navigator.userAgent.toLowerCase().match(/chrome|safari|msie/)) {
        var div = document.createElement("div");
        
        div.setAttribute("style",[ 
            "background:#E5E4E2;",
            "z-index:99999;",
            "position:absolute;",
            "left:25%;",
            "right:25%;",
            "top:100px;",
            "border-radius: 5px;",
            "border:1px solid #777;",
            "text-align:center;",
            "box-shadow: 5px 5px 5px #888;"
        ].join(""));
        
        div.innerHTML = [
            '<p>Open the developer tools to debug and press ok.</p>',
            '<button id="sencha-debug-button">OK</button>',
            '<p></p>'
        ].join("");
        
        document.body.appendChild(div);
    
        var button = document.getElementById("sencha-debug-button");
        
        var onClick = function() {
            if (button.removeEventListener) {
                button.removeEventListener("click", onClick, false);
            }
            else {
                button.detachEvent("onmousedown", onClick);
            }
            
            document.body.removeChild(div);
            div = null;
            
            callback();
        };
        
        if (button.addEventListener) {
            button.addEventListener("click", onClick, false);
        }
        else {
            button.attachEvent("onmousedown", onClick);
        }
    }
    else {
        callback();
    }
};

jasmine.debuggerStatement = function(e) {
    // See the exception variable below
    var exception = e.message;
    debugger;
};

/**
 * @namespace
 */
jasmine.util = {};

jasmine.util.now = (typeof Date.now === 'function')
    ? Date.now
    : function now() {
        return new Date().getTime();
    };

/**
 * Declare that a child class inherit it's prototype from the parent class.
 *
 * @private
 * @param {Function} childClass
 * @param {Function} parentClass
 */
jasmine.util.inherit = function(childClass, parentClass) {
    /**
     * @private
     */
    var subclass = function() {};
    
    subclass.prototype = parentClass.prototype;
    childClass.prototype = new subclass();
};

jasmine.util.getOrigin = function() {
    var port = window.location.port,
        origin;

    origin = window.location.protocol + "//" + window.location.hostname;

    if (port) {
        origin += ":" + port;
    }

    return origin;
};

jasmine.util.getFileFromContextMapping = function(file) {
    var contextMapping = jasmine.contextMapping;
    
    if (file && contextMapping) {
        var origin = jasmine.util.getOrigin();
        
        for (var context in contextMapping) {
            file = file.replace(origin + context, contextMapping[context]);
        }
    }
    
    return file;
};

jasmine.util.formatException = function(e) {
    var lineNumber, file, message;
    
    if (e.line) {
        lineNumber = e.line;
    }
    else if (e.lineNumber) {
        lineNumber = e.lineNumber;
    }
    
    if (e.sourceURL) {
        file = e.sourceURL;
    }
    else if (e.fileName) {
        file = e.fileName;
    }
    
    file = jasmine.util.getFileFromContextMapping(file);
    
    message = (e.name && e.message) ? (e.name + ': ' + e.message) : e.toString();
    
    if (file && lineNumber) {
        message += ' in ' + file + ' (line ' + lineNumber + ')';
    }
    
    return message;
};

jasmine.util.htmlEscape = function(str) {
    if (!str) return str;
    
    // Avoid mangling &smth; HTML entities by matching only ampersand
    // characters *not* followed by either one or more word chars or
    // # and one or more digits, finished by semicolon
    return str.replace(/&(?!(?:#\d+|\w+);)/g, '&amp;').
               replace(/</g, '&lt;').
               replace(/>/g, '&gt;');
};

jasmine.util.argsToArray = function(args) {
    var arrayOfArgs = [],
        i, len;
    
    for (i = 0, len = args.length; i < len; i++) {
        arrayOfArgs.push(args[i]);
    }
    
    return arrayOfArgs;
};

jasmine.util.extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    
    return destination;
};

jasmine.util.isObjectEmpty = function(object) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            return false;
        }
    }
    
    return true;
};

jasmine.util.hashString = function(s, hash) {
    hash = hash || 0;
    
    // This is the fastest hashing algorithm of the "simple" bunch (in IE8)
    // http://jsperf.com/hashing-strings/53
    for (var i = 0, len = s.length; i < len; i++) {
        hash = hash * 31 + s.charCodeAt(i);
        hash &= hash;
    }
    
    // Convert to unsigned
    return hash >>> 0;
};

/**
 * Basic browsers detection.
 */
jasmine.browser = (function() {
    var ua = navigator.userAgent,
        isIE = !!window.ActiveXObject || /Trident/.test(ua),
        isIE6 = isIE && !window.XMLHttpRequest,
        isIE7 = isIE && !!window.XMLHttpRequest && !document.documentMode,
        isIE8 = isIE && (!!window.XMLHttpRequest && !!document.documentMode && !window.performance) || /MSIE 8/.test(ua),
        isIE9 = isIE && !!window.performance && !/MSIE 8/.test(ua),
        isIE10 = isIE && /MSIE 10/.test(ua),
        isIE11 = isIE && /rv:11/.test(ua),
        isOpera = !!window.opera,
        isOpera11 = isOpera && parseInt(window.opera.version(), 10) > 10,
        isSafari3 = /safari/.test(ua.toLowerCase()) && /version\/3/.test(ua.toLowerCase()),
        isEdge = /Edge\//.test(ua),
        isIOS = /AppleWebKit.+Mobile/.test(ua),
        isAndroid = /Android/.test(ua),
        isGecko = /Gecko\//.test(ua);

    return {
        isIE: isIE,
        isIE6: isIE6,
        isIE6m: isIE6,
        isIE6p: isIE6 || isIE6 || isIE8 || isIE9 || isIE10 || isIE11,
        isIE7: isIE7,
        isIE7m: isIE6 || isIE7,
        isIE7p: isIE7 || isIE8 || isIE9 || isIE10 || isIE11,
        isIE8: isIE8,
        isIE8m: isIE8 || isIE7 || isIE6,
        isIE8p: isIE8 || isIE9 || isIE10 || isIE11,
        isIE9: isIE9,
        isIE9m: isIE9 || isIE8 || isIE7 || isIE6,
        isIE9p: isIE9 || isIE10 || isIE11,
        isIE10: isIE10,
        isIE10m: isIE10 || isIE9 || isIE8 || isIE7 || isIE6,
        isIE10p: isIE10 || isIE11,
        isIE11: isIE11,
        isIE11m: isIE11 || isIE10 || isIE9 || isIE8 || isIE7 || isIE6,
        isIE11p: isIE11,
        isEdge: isEdge,
        isOpera: isOpera,
        isOpera11: isOpera11,
        isSafari3: isSafari3,
        isIOS: isIOS,
        isAndroid: isAndroid,
        isGecko: isGecko
    };
})();

jasmine.console = (function() {
    if (!jasmine.VERBOSE) {
        return {
            log: jasmine.emptyFn,
            warn: jasmine.emptyFn,
            error: jasmine.emptyFn,
            dir: jasmine.emptyFn
        };
    }
    else if (jasmine.browser.isIE9m) {
        var slice = Array.prototype.slice;
        
        return {
            log: function() {
                if (window.console) {
                    console.log(slice.apply(arguments).join(', '));
                }
            },
            warn: function() {
                if (window.console) {
                    console.warn(slice.apply(arguments).join(', '));
                }
            },
            error: function() {
                if (window.console) {
                    console.error(slice.apply(arguments).join(', '));
                }
            },
            dir: function() {
                if (window.console) {
                    if (console.dir) {
                        console.dir(arguments);
                    }
                    else {
                        console.log(slice.apply(arguments).join(', '));
                    }
                }
            }
        };
    }
    else {
        return {
            log: function() {
                if (window.console && window.console.log) {
                    console.log.apply(console, arguments);
                }
            },
            warn: function() {
                if (window.console && window.console.warn) {
                    console.warn.apply(console, arguments);
                }
            },
            error: function() {
                if (window.console && window.console.error) {
                    console.error.apply(console, arguments);
                }
            },
            dir: function() {
                if (window.console && window.console.dir) {
                    console.dir.apply(console, arguments);
                }
            }
        };
    }
})();

jasmine.array = {};

/**
 * Checks whether or not the specified item exists in the array.
 * Array.prototype.indexOf is missing in Internet Explorer, unfortunately.
 * We always have to use this static method instead for consistency.
 *
 * @param {Array} array The array to check
 * @param {Mixed} item The item to look for
 * @param {Number} from (Optional) The index at which to begin the search
 *
 * @return {Number} The index of item in the array (or -1 if it is not found)
 */
jasmine.array.indexOf = function(array, item, from) {
    if (array.indexOf) {
        return array.indexOf(item, from);
    }
        
    var i, length = array.length;

    for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
        if (array[i] === item) {
            return i;
        }
    }

    return -1;
};

/**
 * Removes the specified item from the array. If the item is not found nothing happens.
 *
 * @param {Array} array The array
 * @param {Mixed} item The item to remove
 *
 * @return {Array} The passed array itself
 */
jasmine.array.remove = function(array, item) {
    var index = this.indexOf(array, item);

    if (index > -1) {
        // Splicing is slow so we try faster option first
        if (index === array.length - 1) {
            array.length--;
        }
        else {
            array.splice(index, 1);
        }
    }
    
    return array;
};

/**
 * Convert array of items to a map: [1, 2] -> { 1: true, 2: true }
 * If the optional property is given, the value of that property on the
 * array item is used as the key:
 * [{ id: 'foo' }, { id: 'bar' }] ->  { foo: { id: 'foo' }, bar: { id: 'bar' } }
 *
 * @param {Array} items Array of items
 * @param {String} [property] Key property
 *
 * @return {Object} map of items
 */
jasmine.array.toMap = function(items, property) {
    var map = {},
        item, key, value, i, len;
    
    for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        
        if (property) {
            key = item[property];
            value = item;
        }
        else {
            key = item;
            value = true;
        }
        
        if (map[key] !== undefined && map[key] !== value) {
            jasmine.console.error('Whoa! Duplicate ' + property + ': ', key, value);
        }
        
        map[key] = value;
    }

    return map;
};

/**
 * Shuffle the source array into a copy and return the copy. This does not
 * modify the source array. This function uses the "inside out" version of
 * Fisher-Yates algorithm: https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
 *
 * @param {Array} source Array to be shuffled
 *
 * @return {Array} Shuffled copy of the source.
 */
jasmine.array.shuffle = function(source) {
    var random = Math.random,
        floor = Math.floor,
        copy = [],
        i, j, len;
    
    for (i = 0, len = source.length; i < len; i++) {
        j = floor(random() * i);
        
        if (i !== j) {
            copy[i] = copy[j];
        }
        
        copy[j] = source[i];
    }
    
    return copy;
};

jasmine.object = {};

/**
 * Object.keys() polyfill with IE8- optimization
 */
jasmine.object.keys = (typeof Object.keys === 'function')
    ? Object.keys
    : (function() {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        
        return function keys(object) {
            var keys = [],
                counter = 0,
                property;
            
            for (property in object) {
                if (hasOwnProperty.call(object, property)) {
                    keys[counter++] = property;
                }
            }
            
            return keys;
        };
      })();

jasmine.object.clone = (typeof Object.assign === 'function')
    ? (function() {
        return function clone(source) {
            var target = {};
            
            return Object.assign(target, source);
        };
      })()
    : (function() {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        
        return function clone(source) {
            var target = {},
                property;
            
            for (property in source) {
                if (hasOwnProperty.call(source, property)) {
                    target[property] = source[property];
                }
            }
            
            return target;
        };
      })();

/**
 * Environment for Jasmine
 *
 * @constructor
 */
jasmine.Env = function() {
    // We start not ready by default. Calling env.execute() will unblock readiness,
    // and we will proceed as usual unless something external blocked us additionally,
    // in which case we must wait until these external conditions are met.
    this.ready = false;
    this.readyBlockCounter = 1;
    this.readyCallbacks = [];
    this.testDependencies = {};
    
    // This is used to check suite/spec name collisions
    this.allTestNames = {};
    
    this._currentRunner = new jasmine.Runner(this);
    
    // Runner's root suite is the parentSuite for all
    this.currentSuite = this.rootSuite = this._currentRunner.rootSuite;
    this.currentSpec = null;
    this.suiteStack = [];
    
    this.totalSpecs = 0;
    this.remainingSpecs = 0;
    
    this.reporter = new jasmine.MultiReporter();
    
    this.updateInterval = jasmine.DEFAULT_UPDATE_INTERVAL;
    this.defaultTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    this.keepPassedResults = jasmine.KEEP_PASSED_RESULTS;
    this.lastUpdate = 0;
    this.activeQueue = null;
    
    this.specFilter = this.topSuiteFilter = function() {
        return true;
    };
    
    this.describeQueue = new jasmine.Queue(this);
    this._nextSpecId = 0;
    this._nextSuiteId = 0;
    this._equalityTesters = [];
    this.startupHooks = [];
    this.teardownHooks = [];
    
    this.allowedGlobalVariables = {};
    this.allowedComponents = {};
    this.allowedListeners = {};
    this.importantElementInstances = [];
    this.allowedImportantElementInstanceMethods = {};
    this.allowedResourceStack = [];
    
    // wrap matchers
    this.matchersClass = function() {
        jasmine.Matchers.apply(this, arguments);
    };
    
    jasmine.util.inherit(this.matchersClass, jasmine.Matchers);
    
    jasmine.Matchers._wrapInto(jasmine.Matchers.prototype, this.matchersClass);
    
    this.bodyScrolled = false;
    
    var me = this;
    
    me.bodyScrollListener = function() {
        me.bodyScrolled = true;
    };
};

jasmine.Env.prototype.setTimeout = jasmine.setTimeout;
jasmine.Env.prototype.clearTimeout = jasmine.clearTimeout;
jasmine.Env.prototype.setInterval = jasmine.setInterval;
jasmine.Env.prototype.clearInterval = jasmine.clearInterval;

jasmine.Env.prototype.isReady = function() {
    return this.ready;
};

jasmine.Env.prototype.onReady = function(callback) {
    if (this.ready) {
        callback();
    }
    else {
        this.readyCallbacks.push(callback);
    }
};

jasmine.Env.prototype.blockReady = function() {
    if (!this.ready) {
        this.readyBlockCounter++;
    }
    else {
        throw "This Jasmine environment has reached ready state before!";
    }
};

jasmine.Env.prototype.unblockReady = function() {
    if (!this.ready) {
        this.readyBlockCounter--;
        
        if (this.readyBlockCounter <= 0) {
            this.ready = true;
            this._runReadyCallbacks();
        }
    }
    else {
        throw "Mismatched call to jasmine.Env.unblockReady()";
    }
};

jasmine.Env.prototype._runReadyCallbacks = function() {
    var readyCallbacks = this.readyCallbacks,
        i, len, fn;
    
    for (i = 0, len = readyCallbacks.length; i < len; i++) {
        fn = readyCallbacks[i];
        
        if (fn) {
            fn();
            readyCallbacks[i] = null;
        }
    }
};

/**
 * @returns an object containing jasmine version build info, if set.
 */
jasmine.Env.prototype.version = function() {
    if (jasmine._version) {
        return jasmine._version;
    }
    else {
        throw new Error('Version not set');
    }
};

/**
 * @returns string containing jasmine version build info, if set.
 */
jasmine.Env.prototype.versionString = function() {
    if (!jasmine._version) {
        return "version unknown";
    }
    
    var version = this.version();
    var versionString = version.major + "." + version.minor + "." + version.build;
    
    if (version.release_candidate) {
        versionString += ".rc" + version.release_candidate;
    }
    
    versionString += " revision " + version.revision;
    
    return versionString;
};

/**
 * @returns a sequential integer starting at 0
 */
jasmine.Env.prototype.nextSpecId = function() {
    return this._nextSpecId++;
};

/**
 * @returns a sequential integer starting at 0
 */
jasmine.Env.prototype.nextSuiteId = function() {
    return this._nextSuiteId++;
};

jasmine.Env.prototype.checkName = function(name) {
    var names = this.allTestNames;
    
    if (names) {
        if (names[name]) {
            return true;
        }
        
        names[name] = true;
    }
    
    return false;
};

/**
 * Register a reporter to receive status updates from Jasmine.
 *
 * @param {jasmine.Reporter} reporter An object which will receive status updates.
 */
jasmine.Env.prototype.addReporter = function(reporter) {
    this.reporter.addReporter(reporter);
};

/**
 * Register a startup hook function that will be called before Env starts executing.
 * The function will be passed Env instance as the only argument.
 *
 * @param {Function} hook Function to call.
 */
jasmine.Env.prototype.addStartupHook = function(hook) {
    this.startupHooks.push(hook);
};

/**
 * Register a teardown hook function that will be called after Env stops executing.
 * The function will be passed Env instance as the only argument.
 *
 * @param {Function} hook Function to call.
 */
jasmine.Env.prototype.addTeardownHook = function(hook) {
    this.teardownHooks.push(hook);
};

jasmine.Env.prototype.setup = function(done) {
    var me = this;
    
    if (me.describeQueue) {
        me.runningDescribeQueue = true;
        
        me.reporter.reportEnvSetupStarting(me);
        
        me.describeQueue.start(function() {
            me.runningDescribeQueue = false;
            
            // We don't need this anymore
            me.describeQueue = me.currentSuite = me.allTestNames = null;
            
            me.reporter.reportEnvSetupFinishing(me);
            
            if (done) {
                me.setTimeout(done, 0);
            }
            
            // Assignment is intentional
            if (done = me.setupDone) {
                me.setTimeout(done, 0);
            }
        });
    }
};

jasmine.Env.prototype.execute = function(testIds) {
    var me = this,
        deps = jasmine.object.keys(me.testDependencies),
        queue = me.describeQueue,
        setupDone;

    // Studio may send file names in the testIds array. This function maps these file names
    // back to their top level suite id(s), and should only be invoked after the describe
    // queue has finished running.
    function getTestIds() {
        var rootSuiteIdsByFile, ids, id, suiteIds, i, ln;

        if (window.ST) {
            rootSuiteIdsByFile = ST.rootSuiteIdsByFile;

            if (testIds) {
                ids = [];
                for (i = 0, ln = testIds.length; i < ln; i++) {
                    id = testIds[i].toString();

                    if (id.substr(id.length - 3) === '.js') {
                        suiteIds = rootSuiteIdsByFile[id];

                        if (suiteIds) {
                            ids = ids.concat(suiteIds);
                        }
                    } else {
                        ids.push(id);
                    }
                }

                return ids;
            }
        }

        return testIds;
    }
    
    if (deps.length) {
        jasmine.blockReady();
        
        me.reporter.reportDependencyLoadStarting(me);
        jasmine.startLoadingDependencies(deps);
        
        jasmine.installDependenciesCallback(function() {
            me.reporter.reportDependencyLoadFinishing(me);
            jasmine.unblockReady();
        });
    }
    
    setupDone = function() {
        me._execute(getTestIds());
    };
    
    // We could be blocked only internally by the default counter in which case
    // it will unblock in the next statement. Otherwise we will wait for dependencies
    // to load, or some external condition to meet.
    me.onReady(function() {
        if (queue) {
            if (queue.isRunning()) {
                me.setupDone = setupDone;
            }
            else {
                me.setup(setupDone);
            }
        }
        else {
            setupDone();
        }
    });
    
    // Unblock the default not ready state set up in the Env constructor.
    jasmine.unblockReady();
};

jasmine.Env.prototype._execute = function(testIds) {
    var me = this,
        startupHooks = me.startupHooks,
        teardownHooks = me.teardownHooks,
        hook, i, len;
    
    // Prevent double dipping
    if (me.executing) {
        return;
    }
    
    me.executing = true;
    
    for (i = 0, len = startupHooks.length; i < len; i++) {
        hook = startupHooks[i];
        
        if (typeof hook === 'function') {
            hook(me);
        }
        
        // The hook function can be a closure that could potentially retain
        // a lot of objects. An ounce of preventive cleanup could be worth
        // a ton of RAM (especially when profiling code and hunting for leaks).
        hook = startupHooks[i] = null;
    }
    
    if (testIds) {
        me._currentRunner.filter(testIds);
    }
    
    // Most of the time there's only one reporter, and MultiReporter is a waste
//     if (!jasmine.CI_ENVIRONMENT && me.reporter.subReporters.length === 1) {
//         me.reporter = me.reporter.subReporters[0];
//     }
    
    me._currentRunner.execute(function() {
        for (i = 0, len = teardownHooks.length; i < len; i++) {
            hook = teardownHooks[i];
            
            if (typeof hook === 'function') {
                hook(me);
            }
            
            hook = teardownHooks[i] = null;
        }
    });
};

jasmine.Env.prototype.startSuite = function(suite) {
    if (this.currentSuite) {
        this.suiteStack.push(this.currentSuite);
    }
    
    this.currentSuite = suite;
};

jasmine.Env.prototype.finishSuite = function(suite) {
    if (this.currentSuite === suite) {
        this.currentSuite = this.suiteStack.pop();
    }
    else {
        throw new Error("Mismatched suite: " + suite.getId());
    }
};

jasmine.Env.prototype.require = function(dependencies) {
    var reqs = this.testDependencies,
        i, len, req;
    
    // Save a bit of time
    if (reqs['*']) {
        return;
    }
    
    if (!jasmine.isArray(dependencies)) {
        dependencies = [dependencies];
    }
    
    for (i = 0, len = dependencies.length; i < len; i++) {
        req = dependencies[i];
        reqs[req] = true;
    }
};

jasmine.Env.prototype.toDo = function() {
    var me = this,
        len = arguments.length,
        condition, description, todo, arg, i, len;
    
    if (len === 0) {
        condition = true;
    }
    else {
        for (i = 0; i < len; i++) {
            arg = arguments[i];
            
            if (typeof arg === 'string') {
                description = arg;
            }
            else if (typeof arg === 'function') {
                condition = arg;
            }
            else {
                condition = !!arg;
            }
        }
        
        if (condition === undefined) {
            condition = true;
        }
    }
    
    return new jasmine.ToDo(me, condition, description);
};

jasmine.Env.prototype.topSuite = function() {
    var desc, reqs, specs, suite, skipSelf;
    
    if (arguments.length === 2) {
        desc = reqs = arguments[0];
        specs = arguments[1];
    }
    else {
        desc = arguments[0];
        reqs = arguments[1];
        specs = arguments[2];
    }
    
    if (reqs !== false) {
        if (reqs !== '*') {
            if (!jasmine.isArray(reqs)) {
                reqs = [reqs];
            }
            
            if (reqs[0] === false) {
                skipSelf = true;
                reqs.shift();
            }
            
            if (!skipSelf && jasmine.TOP_SUITE_PREFIX.test(desc) &&
                jasmine.array.indexOf(reqs, desc) === -1) {
                reqs.unshift(desc);
            }
        }
        
        this.require(reqs);
    }
    
    suite = this.describe(desc, specs);
    
    return suite;
};

jasmine.Env.prototype.describe = function(desc, specDefinitions) {
    var me = this,
        reporter = me.reporter,
        declarationError = null,
        suite, parentSuite;
    
    if (!me.runningDescribeQueue) {
        me.describeQueue.add(
            new jasmine.Block(me, function() {
                me.describe.call(me, desc, specDefinitions);
            }, {
                fail: function(e) {
                    jasmine.console.error(e);
                }
            })
        );
        
        return;
    }
    
    parentSuite = me.currentSuite;
    
    // We only allow filtering top suites via filter function
    if (parentSuite.isRootSuite && !me.topSuiteFilter(desc)) {
        return;
    }
    
    // Try creating a suite first; this can throw an exception if something goes wrong.
    try {
        suite = new jasmine.Suite(this, desc, specDefinitions, parentSuite);
    }
    catch (e) {
        declarationError = e;
        
        // We need to create a suite in any case, to report the exception.
        // The new suite should NOT throw an exception even if identical name
        // is detected again - this is what the last argument is for.
        suite = new jasmine.Suite(me, desc + ' declaration exception', jasmine.emptyFn, parentSuite, true);
    }
    
    // We report the suite that was actually created, NOT the one we attempted to create
    reporter.reportSuiteDescribeStarting(suite);
    
    parentSuite.add(suite);
    
    if (parentSuite.ToDo && !specDefinitions.ToDo) {
        suite.ToDo = parentSuite.ToDo;
    }
    
    // currentSuite is what describe() and it() operate on so it needs to be set
    // BEFORE spec definition function is called!
    me.currentSuite = suite;
    
    // Now try to call the actual definitions, if the suite is valid
    if (!declarationError) {
        try {
            specDefinitions.call(suite);
        }
        catch(e) {
            declarationError = e;
        }
    }
    
    if (declarationError) {
        // We are explicitly enabling try/catch sequence for this spec only
        // because it's not very helpful when exceptions are allowed globally
        me.it("encountered a declaration exception", function() {
            throw declarationError;
        }, { disableTryCatch: false });
    }
    
    reporter.reportSuiteDescribeFinishing(suite);
    
    me.currentSuite = parentSuite;
    
    return suite;
};

jasmine.Env.prototype.spyOn = function(obj, methodName) {
    return this.currentSpec.spyOn(obj, methodName);
};

jasmine.Env.prototype.expect = function(actual) {
    return this.currentSpec.expect(actual);
};

jasmine.Env.prototype.runs = function(func, timeout, ensured) {
    (this.currentSpec || this.currentSuite).runs(func, timeout, ensured);
};

jasmine.Env.prototype.waits = function(timeout) {
    (this.currentSpec || this.currentSuite).waits(timeout);
};

jasmine.Env.prototype.waitsFor = function() {
    var runnable = this.currentSpec || this.currentSuite;
    
    runnable.waitsFor.apply(runnable, arguments);
};

jasmine.Env.prototype.waitsForSpy = (function() {
    var setTimeout = jasmine._setTimeout;
    
    return function(spy, message, timeout) {
        if (!jasmine.isSpy(spy)) {
            this.fail("Expected spy but got " + jasmine.pp(spy));
        }
        
        // Usually there's no point in specifying a message because default one with
        // spy identity will suffice, but providing a specific timeout is useful.
        if (typeof message === 'number') {
            timeout = message;
            message = null;
        }
    
        jasmine.env.waitsFor(function(done) {
            if (spy.wasCalled) {
                done();
            }
            else {
                // Need to unwind the stack in case the spy was a listener
                spy.doAfter = function() {
                    setTimeout(done, 1);
                };
            }
        }, message || (spy ? spy.identity : 'Unknown') + ' spy to fire', timeout);
    };
})();

jasmine.Env.prototype.waitsForEvent = function(source, event, message, timeout) {
    var runnable = this.currentSpec || this.currentSuite,
        block;
    
    if (source == null) {
        throw new Error("Expected event source but got " + source + " instead!");
    }
    
    if (!message) {
        if (source.$className) {
            message = source.$className;
        }
        else if (source.dom) {
            message = source.dom.tagName;
        }
        else if (source.tagName) {
            message = source.tagName;
        }
        else {
            message = 'Entity';
        }
        
        if (source.id) {
            message += '#' + source.id;
        }
        
        message += ' to fire "' + event + '" event';
    }

    timeout = timeout != null ? timeout : jasmine.DEFAULT_EVENT_TIMEOUT;
    
    block = new jasmine.WaitsForEventBlock(this, source, event, message, timeout, runnable);
    
    runnable.addToQueue(block);
};

jasmine.Env.prototype.currentRunner = function() {
    return this._currentRunner;
};

jasmine.Env.prototype.beforeEach = function(beforeEachFunction) {
    this.currentSuite.beforeEach(beforeEachFunction);
};

jasmine.Env.prototype.afterEach = function(afterEachFunction) {
    this.currentSuite.afterEach(afterEachFunction);
};

jasmine.Env.prototype.beforeAll = function(beforeAllFunction) {
    this.currentSuite.beforeAll(beforeAllFunction);
};

jasmine.Env.prototype.afterAll = function(afterAllFunction) {
    this.currentSuite.afterAll(afterAllFunction);
};

jasmine.Env.prototype.it = function(description, func, options) {
    return this.currentSuite.it(description, func, options);
};

jasmine.Env.prototype.specFor = function(object, specForFn) {
    var index = 0,
        property;

    for (property in object) {
        if (!object.hasOwnProperty(property)) {
            continue;
        }
        
        specForFn.call(this, property, object[property], index, object);
        index = index + 1;
    }
};

jasmine.Env.prototype.xspecFor = function(object, specForFn) {};

jasmine.Env.prototype._compareRegExps = function(a, b, mismatchKeys, mismatchValues) {
    if (a.source != b.source) {
        mismatchValues.push("expected pattern /" + b.source + "/ is not equal to the pattern /" + a.source + "/");
    }
    
    if (a.ignoreCase != b.ignoreCase) {
        mismatchValues.push("expected modifier i was" + (b.ignoreCase ? " " : " not ") + "set and does not equal the origin modifier");
    }
    
    if (a.global != b.global) {
        mismatchValues.push("expected modifier g was" + (b.global ? " " : " not ") + "set and does not equal the origin modifier");
    }
    
    if (a.multiline != b.multiline) {
        mismatchValues.push("expected modifier m was" + (b.multiline ? " " : " not ") + "set and does not equal the origin modifier");
    }
    
    if (a.sticky != b.sticky) {
        mismatchValues.push("expected modifier y was" + (b.sticky ? " " : " not ") + "set and does not equal the origin modifier");
    }
    
    return (mismatchValues.length === 0);
};

jasmine.Env.prototype._compareObjects = function(a, b, mismatchKeys, mismatchValues) {
    var property;
    
    if (a.__Jasmine_been_here_before__ === b && b.__Jasmine_been_here_before__ === a) {
        return true;
    }
    
    a.__Jasmine_been_here_before__ = b;
    b.__Jasmine_been_here_before__ = a;
    
    var hasKey = function(obj, keyName) {
        return obj !== null && obj[keyName] !== jasmine.undefined;
    };
    
    for (property in b) {
        if (!hasKey(a, property) && hasKey(b, property)) {
            mismatchKeys.push("expected has key '" + property + "', but missing from actual.");
        }
    }
    
    for (property in a) {
        if (!hasKey(b, property) && hasKey(a, property)) {
            mismatchKeys.push("expected missing key '" + property + "', but present in actual.");
        }
    }
    
    for (property in b) {
        if (property == '__Jasmine_been_here_before__') continue;
        
        if (!this._equals(a[property], b[property], mismatchKeys, mismatchValues)) {
            mismatchValues.push("'" + property + "' was '" + (b[property] ? jasmine.util.htmlEscape(b[property].toString()) : b[property]) + "' in expected, but was '" + (a[property] ? jasmine.util.htmlEscape(a[property].toString()) : a[property]) + "' in actual.");
        }
    }
    
    if (jasmine.isArray(a) && jasmine.isArray(b) && a.length != b.length) {
        mismatchValues.push("arrays were not the same length");
    }
    
    delete a.__Jasmine_been_here_before__;
    delete b.__Jasmine_been_here_before__;
    
    return (mismatchKeys.length === 0 && mismatchValues.length === 0);
};

jasmine.Env.prototype._equals = function(a, b, mismatchKeys, mismatchValues) {
    var equalityTesters = this._equalityTesters,
        i, len, equalityTester;
    
    mismatchKeys = mismatchKeys || [];
    mismatchValues = mismatchValues || [];

    for (i = 0, len = equalityTesters.length; i < len; i++) {
        var equalityTester = this._equalityTesters[i];
        var result = equalityTester(a, b, this, mismatchKeys, mismatchValues);
        
        if (result !== jasmine.undefined) {
            return result;
        }
    }

    if (a === b) return true;
    
    if (a === jasmine.undefined || a === null || b === jasmine.undefined || b === null) {
        return (a == jasmine.undefined && b == jasmine.undefined);
    }
    
    if (jasmine.isDomNode(a) && jasmine.isDomNode(b)) {
        return a === b;
    }
    
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() == b.getTime();
    }
    
    if (a.jasmineMatches) {
        return a.jasmineMatches(b);
    }
    
    if (b.jasmineMatches) {
        return b.jasmineMatches(a);
    }
    
    if (a instanceof jasmine.Matchers.ObjectContaining) {
        return a.matches(b);
    }
    
    if (b instanceof jasmine.Matchers.ObjectContaining) {
        return b.matches(a);
    }
    
    if (jasmine.isString(a) && jasmine.isString(b)) {
        return (a == b);
    }
    
    if (jasmine.isNumber(a) && jasmine.isNumber(b)) {
        return (a == b);
    }
    
    if (a instanceof RegExp && b instanceof RegExp) {
        return this._compareRegExps(a, b, mismatchKeys, mismatchValues);
    }
    
    if (typeof a === "object" && typeof b === "object") {
        return this._compareObjects(a, b, mismatchKeys, mismatchValues);
    }
    
    // Straight check
    return (a === b);
};

jasmine.Env.prototype._contains = function(haystack, needle) {
    if (jasmine.isArray(haystack)) {
        for (var i = 0; i < haystack.length; i++) {
            if (this._equals(haystack[i], needle)) {
                return true;
            }
        }
        
        return false;
    }
    
    return haystack.indexOf(needle) >= 0;
};

jasmine.Env.prototype.addEqualityTester = function(equalityTester) {
    this._equalityTesters.push(equalityTester);
};

jasmine.Env.prototype.addAllowedGlobalVariable = function(property) {
    var allowedGlobals = this.allowedGlobalVariables,
        i, len;
    
    if (property.charAt) { // string
        allowedGlobals[property] = true;
    }
    else {
        for (i = 0, len = property.length; i < len; i++) {
            allowedGlobals[property[i]] = true;
        }
    }
};

jasmine.Env.prototype._allowComponent = function(cmp, preventDestruction, marker) {
    this.allowedComponents[cmp.id] = true;
    cmp.$allowedComponent = marker;
    
    if (cmp.rendered) {
        cmp.el.dom.setAttribute('data-sticky', marker);
    }
    
    if (preventDestruction && !cmp.$originalDestroy) {
        cmp.$originalDestroy = cmp.destroy;
        
        cmp.destroy = function() {
            if (this.$allowedComponent) {
                spec = jasmine.env.currentSpec;
                
                if (spec) {
                    jasmine.console.error(spec.getFullName() + ' attempted to destroy ' + this.id);
                    spec.fail('attempted to destroy ' + this.id);
                }
                else {
                    jasmine.console.error('Attempted to destroy allowed component: ' + this.id);
                }
            }
            else {
                this.$originalDestroy.call(this);
            }
        }
    }
};

jasmine.Env.prototype.addAllowedComponent = function(cmp, preventDestruction, marker) {
    var suite, descendants, i, len;
    
    // This could be a string in certain cases
    if (cmp.charAt) {
        this.allowedComponents[cmp] = true;
        
        return;
    }
    
    if (marker == null) {
        suite = this.currentSuite;
        marker = !suite || suite.isRootSuite ? true : suite.getFullName();
    }

    this._allowComponent(cmp, preventDestruction, marker);
    
    if (cmp.query) {
        descendants = cmp.query('*');
        
        for (i = 0, len = descendants.length; i < len; i++) {
            this._allowComponent(descendants[i], preventDestruction, marker);
        }
    }
};

jasmine.Env.prototype._disallowComponent = function(cmp, marker) {
    delete this.allowedComponents[cmp.id];
    
    // $allowedComponent could have been removed already
    if (cmp.$allowedComponent != null && cmp.$allowedComponent !== marker) {
        throw "Mismatched $allowedComponent: " + marker + " on component " + cmp.id;
    }
    
    delete cmp.$allowedComponent;
    
    if (cmp.rendered && cmp.el.dom.hasAttribute('data-sticky')) {
        if (cmp.el.dom.getAttribute('data-sticky') !== (''+marker)) {
            throw "Mismatched data-sticky: " + cmp.el.dom.getAttribute('data-sticky') +
                  " on el " + cmp.el.id;
        }
        
        cmp.el.dom.removeAttribute('data-sticky');
    }
    
    if (cmp.$originalDestroy) {
        cmp.destroy = cmp.$originalDestroy;
        delete cmp.$originalDestroy;
    }
};

jasmine.Env.prototype.removeAllowedComponent = function(cmp, marker) {
    var suite, descendants, i, len;
    
    if (marker == null) {
        suite = this.currentSuite;
        marker = !suite || suite.isRootSuite ? true : suite.getFullName();
    }
    
    this._disallowComponent(cmp, marker);
    
    if (cmp.query) {
        descendants = cmp.query('*');
        
        for (i = 0, len = descendants.length; i < len; i++) {
            this._disallowComponent(descendants[i], marker);
        }
    }
};

jasmine.Env.prototype.preventGarbageCollection = function(cmp) {
    var cache = Ext.cache,
        nodes, node, el, i, len;
    
    if (cmp.rendered) {
        el = cache[cmp.el.id];
        
        if (el) {
            el.skipGarbageCollection = true;
            
            nodes = el.dom.querySelectorAll('*');
            
            for (i = 0, len = nodes.length; i < len; i++) {
                node = nodes[i];
                el = node.id && cache[node.id];
                
                if (el) {
                    el.skipGarbageCollection = true;
                }
            }
        }
    }
};

jasmine.Env.prototype.addAllowedListener = function(eventName) {
    var listeners = Ext.GlobalEvents.events[eventName];

    listeners = listeners && listeners.listeners;

    if (listeners) {
        this.allowedListeners[eventName] = Ext.Array.push(
            this.allowedListeners[eventName] || [],
            listeners[listeners.length - 1]);
    }
};

jasmine.Env.prototype.pushResources = function() {
    this.allowedResourceStack.push({
        allowedGlobalVariables: this.allowedGlobalVariables,
        originalWindowPropertiesCount: this.originalWindowPropertiesCount,
        allowedComponents: this.allowedComponents,
        allowedListeners: this.allowedListeners
    });
    
    this.allowedGlobalVariables = jasmine.object.clone(this.allowedGlobalVariables);
    this.allowedComponents = jasmine.object.clone(this.allowedComponents);
    this.allowedListeners = jasmine.object.clone(this.allowedListeners);
};

jasmine.Env.prototype.popResources = function() {
    var suite = this.currentSuite,
        resources, marker, timerId, items, item, i, len;
    
    marker = !suite || suite.isRootSuite ? true : suite.getId();
    
    if (Ext.ComponentMgr) {
        items = Ext.ComponentMgr.getAll();
        
        for (i = 0, len = items.length; i < len; i++) {
            item = items[i];
            
            if (item.$allowedComponent === marker) {
                this.removeAllowedComponent(item, marker);
            }
        }
    }
    
    items = jasmine.Clock.scheduledFunctions;
    
    for (timerId in items) {
        item = items[timerId];
        
        if (item.$allowedTimer === marker) {
            delete item.$allowedTimer;
        }
    }
    
    resources = this.allowedResourceStack.pop();
    
    if (resources) {
        this.allowedGlobalVariables = resources.allowedGlobalVariables;
        this.originalWindowPropertiesCount = resources.originalWindowPropertiesCount;
        this.allowedComponents = resources.allowedComponents;
        this.allowedListeners = resources.allowedListeners;
    }
};

jasmine.Env.prototype.enumerateResources = function(preventDestruction, marker) {
    var global = jasmine.getGlobal(),
        allowedGlobals = this.allowedGlobalVariables,
        allowedListeners = this.allowedListeners,
        globalEvents = Ext.globalEvents && Ext.globalEvents.events,
        items, item, eventName, listeners, event, fn, i, len;
    
    // Any properties already in the window object are ok
    items = jasmine.object.keys(global);
    this.originalWindowPropertiesCount = len = items.length;
        
    for (i = 0; i < len; i++) {
        item = items[i];
        allowedGlobals[item] = true;
    }
    
    if (Ext.ComponentMgr) {
        items = Ext.ComponentMgr.getAll();
        
        for (i = 0, len = items.length; i < len; i++) {
            item = items[i];
            
            if (!item.$allowedComponent) {
                this.addAllowedComponent(item, preventDestruction, marker);
            }
        }
    }
    
    if (globalEvents) {
        for (eventName in globalEvents) {
            event = globalEvents[eventName];
            listeners = allowedListeners[eventName] = [];
            
            for (i = 0, len = event.listeners.length; i < len; i++) {
                listeners.push(event.listeners[i]);
            }
        }
    }
    
    // There's no way to reliably associate a scheduled timer with a component
    // to check if the timer was scheduled by an allowed component or not.
    // So we have to pretend that any timers scheduled at this time are allowed.
    items = jasmine.Clock.scheduledFunctions;
    
    for (event in items) {
        item = items[event];
        
        if (!item.$skipTimerCheck) {
            item.$allowedTimer = marker;
        }
    }
};

jasmine.Env.prototype.checkResourceLeaks = function(spec) {
    var body = document.body,
        fail = false,
        specName, focusPublisher, items, i, len;
    
    specName = spec.getFullName(true);

    // Clear any tracked touches.
    if (Ext.testHelper) {
        Ext.testHelper.reset();
    }

    // Clear any gesture handlers which may be in progress or waiting for something.
    // We don't have a clear strategy on how to meaningfully fail tests that leave
    // pending gesture timers, so just clear them before running dangling scheduled
    // timers check.
    if (Ext.event && Ext.event.publisher) {
        if (Ext.event.publisher.Gesture) {
            // Not sure what to do with these
            if (Ext.event.publisher.Gesture.instance.reEnterCount) {
                jasmine.console.error('Gesture publisher: has reEnter count: ' + specName);
            }
            
            items = Ext.event.publisher.Gesture.instance.activeTouches;
            
            // Not sure what to do with these either?
            if (items.length) {
                spec.expect(items).toCleanup('Ext.event.publisher.Gesture active touches');
                fail = true;
            }
            
            Ext.event.publisher.Gesture.instance.reset();
        }
        
        if (Ext.event.gesture.DoubleTap) {
            Ext.event.gesture.DoubleTap.instance.reset();
        }
        
        if (Ext.event.gesture.LongPress) {
            Ext.event.gesture.LongPress.instance.reset();
        }
        
        if (Ext.event.publisher.Focus) {
            focusPublisher = Ext.event.publisher.Focus.instance;
            focusPublisher.previousActiveElement = null;
        }
    }

    // Clear any pending ZIndexManager response to window resize
    if (Ext.WindowManager) {
        Ext.Function.cancelAnimationFrame(Ext.WindowManager.containerResizeTimer);
        Ext.WindowManager.containerResizeTimer = null;
    }

    if (jasmine.CHECK_LEAKS) {
        if (Ext.util.Scheduler && Ext.util.Scheduler.instances && Ext.util.Scheduler.instances.length) {
            while (Ext.util.Scheduler.instances.length) {
                Ext.util.Scheduler.instances[Ext.util.Scheduler.instances.length - 1].destroy();
            }
            spec.fail("Spec has left Ext.util.Scheduler instances");
        }

        // The number of classes counted at test start must remain
        if (Ext.ClassManager.classCount < this.baseClassCount) {
            spec.fail("Some of the framework's classes have been undefined");
        }
    
        // Certain system timers must be exempt from destruction.
        // But remove all their tasks between Specs.
        if (Ext.state && Ext.state.Stateful.runner) {
            Ext.state.Stateful.runner.stopAll(true);
        }
        
        // Do not allow pending animations to hang over into the next spec.
        // Their target elements will have been destroyed.
        if (Ext.fx && Ext.fx.Manager) {
            // Finish them off quickly
            if (Ext.fx.Manager.items.length) {
                items = Ext.fx.Manager.items.getRange();
                
                spec.expect(items).toCleanup('Ext.fx.Anim animations');
                
                for (i = 0, len = items.length; i < len; i++) {
                    items[i].jumpToEnd();
                }
                
                fail = true;
                items = null;
                
                Ext.fx.Manager.clear();
            }
        }
        
        if (Ext.AnimationQueue) {
            if (Ext.AnimationQueue.queue.length) {
                // This is a battle for another day
//                 spec.expect(Ext.AnimationQueue.queue.slice()).toCleanup('Ext.AnimationQueue animations');
//                 fail = true;
                Ext.AnimationQueue.clear();
            }
        }
        
        if (Ext.TaskQueue) {
            // This, too is a battle for another day
//             if (
                    // Slice here because of very interesting bugs involving console.dir & arguments
//                 (Ext.TaskQueue.readQueue.length &&
//                     this.checkTaskQueue(Ext.TaskQueue.readQueue.slice(), 'readQueue', spec, specName)) ||
//                 (Ext.TaskQueue.writeQueue.length &&
//                     this.checkTaskQueue(Ext.TaskQueue.writeQueue.slice(), 'writeQueue', spec, specName))
//                 )
            if (Ext.TaskQueue.readQueue.length || Ext.TaskQueue.writeQueue.length) {
//                 fail = true;
                Ext.TaskQueue.clear();
            }
        }
        
        if (Ext.draw && Ext.draw.Animator) {
            if (Ext.draw.Animator.animations.length) {
                spec.expect(Ext.draw.Animator.animations).toCleanup('Ext.draw.Animator animations');
                fail = true;
                Ext.draw.Animator.clear();
            }
        }
    
        if (Ext.promise) {
            if (Ext.promise.Consequence.queueSize) {
                // The problem with leaked Promises is that we can't do anything about them.
//                 leaks = [];
//                 
//                 for (i = 0, len = Ext.promise.Consequence.queueSize; i < len; i++) {
//                     leaks.push(Ext.promise.Consequence.queue[i]);
//                 }
//                 
//                 spec.expect(leaks).toCleanup('Ext.promise.Consequence queue');
//                 fail = true;
                
                Ext.promise.Consequence.queueSize = 0;
//                 leaks.length = 0;
            }
        }

        if (Ext.data) {
            // Prototype corruption is quite rare and checks are not free;
            // so we only run them when debugging. They're also especially expensive
            // in IE8- because of missing Object.keys; the chance of code that corrupts
            // any of those prototypes being IE8 specific is sort of rare.
            if (jasmine.DEBUGGING_MODE && !jasmine.browser.isIE8m) {
                if (Ext.data.Store && this.checkPrototype(Ext.data.Store, spec, specName)) {
                    fail = true;
                }
                
                if (Ext.data.ProxyStore && this.checkPrototype(Ext.data.ProxyStore, spec, specName)) {
                    fail = true;
                }
                
                if (Ext.data.BufferedStore && this.checkPrototype(Ext.data.BufferedStore, spec, specName)) {
                    fail = true;
                }
            }
            
            if (Ext.data.StoreManager) {
                if (this.checkDataStores(spec)) {
                    fail = true;
                }
                
                Ext.data.StoreManager.clear();
            }
        }
        
        // In IE8- implicit global variables create non-enumerable properties in window object,
        // which basically means they're undetectable unless we know for sure that such properties
        // exist and what are their names. On the other hand, iterating over window properties
        // is VERY expensive, especially so in slow IE8. So we skip this check hoping that other
        // browsers will detect runaway globals, and usually that happens during development
        // so running this check is more or less pointless in CI.
        if (!jasmine.CI_ENVIRONMENT && !jasmine.browser.isIE8m) {
            if (this.checkGlobalVariables(spec)) {
                fail = true;
            }
        }
        
        if (Ext.GlobalEvents && this.checkGlobalListeners(spec)) {
            fail = true;
        }

        if (!Ext.isModern && Ext.Component) {
            if (this.checkLayoutSuspension(spec)) {
                fail = true;
            }
            
            if (this.checkFocusSuspension(spec)) {
                fail = true;
            }

            if (Ext.MessageBox && Ext.MessageBox.isVisible()) {
                Ext.MessageBox.hide();
            }
        }

        if (Ext.Element) {
            // This function checks if element instance has been modified, with any extra
            // methods being added that obscure the methods inherited from the prototype.
            // Unfortunately IE8- lacks Object.keys and the only way to compare an object
            // to its prototype is to iterate over all properties. This is extremely expensive,
            // on the order of 50% of the time spent checking leaks; and that adds up a lot.
            // The chance of such elements being modified only in IE8 is non-zero but at the time
            // there are no unit tests failing for this reason, so incurring all that expense
            // for that unlikely case seems to be a waste.
            if (!jasmine.browser.isIE8m && this.checkImportantElements(spec)) {
                fail = true;
            }
            
            if (this.collectDomGarbage(spec, specName)) {
                fail = true;
            }
        }
        
        if (this.checkTaskManager(spec)) {
            fail = true;
        }
        
        if (this.checkTimers(spec, specName)) {
            fail = true;
        }
        
        if (Ext.ComponentMgr) {
            if (this.checkComponents(spec, specName)) {
                fail = true;
            }
        }
        
        // Returns true if failed. DOM check should run AFTER component check,
        // to clean the document body in case there are any undestroyed Components!
        if (this.checkDom(spec)) {
            fail = true;
        }
    }

    // Ensure tests are scrolled to top to avoid iframe pointer position bugs.
    if (this.bodyScrolled && (body.scrollTop || body.scrollLeft)) {
        this.bodyScrolled = false;
        body.scrollTop = body.scrollLeft = 0;

        // Force synchronous layout
        if (Ext.isIE) {
            body.style.width = (body.offsetWidth + 1) + 'px';
            body.clientWidth;
            body.style.width = '';
        }
    }
    
    if (fail) {
        spec.fail('Failed one or more resource leak checks, see expectation results.');
    }

    // In TC testing, ensure body is refocused in case focus left on an indeterminate element
    // This can happen when elements are removed.
    if (top.Cmd && top.Cmd['native']) {
        if (focusPublisher) {
            focusPublisher.$suspendEvents = true;
        }
        
        if (Ext.GlobalEvents) {
            Ext.GlobalEvents.suspendEvents();
        }
        
        document.body.focus();
        
        if (focusPublisher) {
            delete focusPublisher.$suspendEvents;
        }
        
        if (Ext.GlobalEvents) {
            Ext.GlobalEvents.resumeEvents();
        }
    }

    // All visible components gone, so scrollPosition will be 0.
    // Viewport must not carry over stale scroll position.
    // The reportSpecResults call can fire a scroll event.
    if (Ext.scroll && Ext.scroll.Scroller && Ext.scroll.Scroller.viewport) {
        delete Ext.scroll.Scroller.viewport.trackingScrollTop;
        
        if (Ext.scroll.Scroller.viewport.onDomScrollEnd) {
            clearTimeout(Ext.scroll.Scroller.viewport.onDomScrollEnd.timer);
        }
    }
};

jasmine.Env.prototype.checkDom = function(spec) {
    var body = document.body,
        children = body && body.childNodes || [],
        len = children.length,
        bodyRegion, leaks, badNodes, stickies, child, i, fail;

    if (len) {
        badNodes = [];
        stickies = [];
        
        for (i = 0; i < len; i++) {
            child = children[i];
            
            // Only Element nodes support getAttribute
            if (child.nodeType === 1 && child.getAttribute('data-sticky')) {
                stickies.push(child);
            }
            else {
                badNodes.push(child);
            }
        }
        
        if (len = badNodes.length) {
            leaks = [];
            
            for (i = 0; i < len; i++) {
                child = badNodes[i];
                
                // Yeah this "pretty printing" is pretty lame but it's quick
                // and the result is much better than one long string with outerHTML
                leaks.push(child.tagName + (child.id ? '#' + child.id : '') +
                           (!jasmine.browser.isIE9m
                                ? ': ' + child.outerHTML.split('><').join('>\n<')
                                : ''));
                
                body.removeChild(child);
            }
            
            if (leaks.length) {
                spec.expect(leaks).toCleanup('DOM nodes');
                fail = true;
            }
            
            leaks.length = 0;
        }
        
        // See if there are any visible sticky elements left which obscure the body
        // and prevent mouse interactions from reaching the body.
        // Any tests which leave such elements around fail.
        if (len = stickies.length && Ext.Element) {
            bodyRegion = jasmine._bodyRegion;
            leaks = leaks || [];
            
            for (i = 0; i < len; i++) {
                child = Ext.get(stickies[i]);
                
                if (child.isVisible() && bodyRegion.intersect(child.getRegion()) &&
                    child.getStyle('pointer-events') !== 'none')
                {
                    leaks.push(child.dom.tagName + (child.id ? '#' + child.id : '') + 
                               (!jasmine.browser.isIE9m
                                    ? ': ' + child.dom.outerHTML.split('><').join('>\n<')
                                    : ''));
                    child.destroy();
                }
            }
            
            if (leaks.length) {
                spec.expect(leaks).toCleanup('[data-sticky] element(s) left visible');
                fail = true;
            }
        }
    }
    
    return fail;
};

jasmine.Env.prototype.checkGlobalListeners = function(spec) {
    var events = Ext.GlobalEvents.events,
        allowedListeners, allowedComponents, eventNames, eventName, event,
        eventName, event, listeners, referenceListeners, scope, fail, leaks,
        leaksFound, evCtr, evLen, i, len;
    
    eventNames = jasmine.object.keys(events);
    evLen = eventNames.length;

    if (evLen) {
        allowedListeners = this.allowedListeners;
        allowedComponents = this.allowedComponents;
        leaks = [];
        
        for (evCtr = 0; evCtr < evLen; evCtr++) {
            eventName = eventNames[evCtr];
            event = events[eventName];
            listeners = event.listeners;
            
            referenceListeners = allowedListeners[eventName];
            
            if (!referenceListeners) {
                for (i = 0, len = listeners.length; i < len; i++) {
                    leaks.push(listeners[i]);
                }
                
                // This is a crude version of cleanup that should do for now
                delete events[eventName];
            }
            else {
                leaksFound = false;
                
                for (i = 0, len = listeners.length; i < len; i++) {
                    if (listeners[i] !== referenceListeners[i]) {
                        scope = listeners[i].scope;
                        
                        if (scope && !allowedComponents[scope.id]) {
                            leaksFound = true;
                            leaks.push(listeners[i]);
                        }
                        
                        scope = null;
                    }
                }
                
                // Ditto
                if (leaksFound) {
                    event.listeners = [];
                    
                    for (i = 0, len = referenceListeners.length; i < len; i++) {
                        event.listeners.push(referenceListeners[i]);
                    }
                }
            }
        }
        
        if (leaks.length) {
            spec.expect(leaks).toCleanup('GlobalEvents listeners');
            fail = true;
        }
    }
    
    return fail;
};

jasmine.Env.prototype.checkComponents = function(spec, specName) {
    var allowedComponents = this.allowedComponents,
        quicktip, leaks, components, registeredQuicktips, id, i, len, cmp, cmpRoot, fail;

    if (Ext.ComponentMgr && Ext.ComponentMgr.count > 0) {
        components = Ext.ComponentMgr.all;
        leaks = [];
        
        for (id in components) {
            cmp = components[id];
            
            if (cmp.$allowedComponent) {
                continue;
            }
            
            // We must also check whether a potentially leaked component is WITHIN
            // an allowed component. It may have been added after the allowed component
            // list was created.
            cmpRoot = !cmp.destroyed && cmp.up(':not({getRefOwner && c.getRefOwner()})');
            
            // Allow QuickTips by default, they're mostly harmless
            if (!(allowedComponents[cmp.id] || (cmpRoot && allowedComponents[cmpRoot.id])) &&
                !(cmp.isQuickTip || (cmp.up && cmp.up('[isQuickTip]')))) {
                leaks.push(cmp);
            }
        }

        quicktip = Ext.tip && Ext.tip.QuickTipManager && Ext.tip.QuickTipManager.getQuickTip();
    
        if (quicktip && (registeredQuicktips = jasmine.object.keys(quicktip.targets)).length) {
            if (jasmine.DEBUGGING_MODE) {
                jasmine.console.error('QUICKTIPS STILL REGISTERED AFTER SPEC: ' + specName);
                jasmine.console.dir(registeredQuicktips);
            }
            
            spec.expect(registeredQuicktips).toCleanup("Registered QuickTips targets");
            
            // Do the clean up because this could cause failure in subsequent tests
            for (i = 0, len = registeredQuicktips.length; i < len; i++) {
                Ext.tip.QuickTipManager.unregister({
                    id: registeredQuicktips[i]
                });
            }
            
            fail = true;
        }
    }

    if (leaks && leaks.length) {
        if (jasmine.DEBUGGING_MODE) {
            jasmine.console.error('CLEAN UP YOUR COMPONENT LEAKS IN SPEC: ' + specName);
            jasmine.console.dir(leaks);
        }
        
        spec.expect(leaks).toCleanup("Undestroyed components");
        
        for (i = 0, len = leaks.length; i < len; i++) {
            // We don't destroy the leaked components so that they could be examined,
            // just unregistering them from ComponentManager cache is enough
            Ext.ComponentMgr.unregister(leaks[i]);
        }
        
        fail = true;
    }
    
    return fail;
};

jasmine.Env.prototype.checkGlobalVariables = function(spec) {
    var allowedGlobals, props, property, value, leaks, fail, i, len;
    
    // This is a very hot code path so care is taken not go assign any variables
    // or do anything at all unless we're fairly sure there are some leaks
    // to be detected.
    props = jasmine.object.keys(window);
    len = props.length;
    
    // We mostly defend against implicit global variable assignments, or explicit
    // window property assignments not properly cleaned up. In both cases we will
    // have extra properties in window object, so len should be > original count.
    // It is possible that some properties will be added while some other properties
    // will be deleted from window so that count check will yield false negative;
    // however this scenario is unlikely.
    // Note that in IE8- implicit global variables create non-enumerable properties
    // in window object, so there is no way to detect those without knowing for a fact
    // that they are there. Which sort of beats the check.
    if (len !== this.originalWindowPropertiesCount) {
        allowedGlobals = this.allowedGlobalVariables;
        leaks = [];
        
        for (i = 0; i < len; i++) {
            property = props[i];
            
            // Do not read the value unless we need to because
            // that can trigger DOM layouts.
            if (property in window && !allowedGlobals[property]) {
                try {
                    // IE throws error when trying to access window.localStorage
                    value = window[property];
                }
                catch (e) {
                    continue;
                }
                
                if (!value || // make sure we don't try to do a property lookup on a null value
                    // old browsers (IE6 and opera 11) add element IDs as enumerable properties
                    // of the window object, so make sure the global var is not a HTMLElement
                    value.nodeType !== 1 &&
                    // make sure it isn't a reference to a window object.  This happens in
                    // some browsers (e.g. IE6) when the document contains iframes.  The
                    // frames' window objects are referenced by id in the parent window object.
                    !(value.location && value.document)) {
                        fail = true;
                        leaks.push(property + ' = ' + jasmine.pp(value));
                        // add the bad global to allowed globals so that it only fails this one spec
                        allowedGlobals[property] = true;
                }
            }
        }
        
        if (fail) {
            spec.expect(leaks).toCleanup('Global variables');
        }
    }
    
    return fail;
};

jasmine.Env.prototype.checkLayoutSuspension = function(spec) {
    var count = Ext.Component.layoutSuspendCount,
        fail;
    
    if (count !== 0) {
        spec.fail('Spec completed with layouts suspended: count=' + count);
        Ext.Component.layoutSuspendCount = 0;
        fail = true;
    }
    
    if (Ext.Component.runningLayoutContext) {
        spec.fail('Spec completed with running layout:\n', Ext.Component.runningLayoutContext);
        Ext.Component.runningLayoutContext = Ext.destroy(Ext.Component.runningLayoutContext);
        fail = true;
    }
    
    if (Ext.Component.pendingLayouts) {
        // Not a failure condition if the test hasn't waited around for another scheduled
        // layout run.
        Ext.Component.pendingLayouts = Ext.destroy(Ext.Component.pendingLayouts);
    }
    
    return fail;
};

jasmine.Env.prototype.checkFocusSuspension = function(spec) {
    // If the ExtJS version supports focus suspension...
    if (Ext.suspendFocus) {
        var count = Ext.event.publisher.Focus.instance.suspendCount;
        
        if (count) {
            spec.fail('Spec completed with focus suspended: count=' + count);
            Ext.event.publisher.Focus.instance.suspendCount = 0;
            
            return true;
        }
    }
};

jasmine.Env.prototype.checkImportantElements = function(spec) {
    var elProto = Ext.dom.Element.prototype,
        elements = this.importantElementInstances,
        allowedMethods = this.allowedImportantElementInstanceMethods,
        leaks = [],
        fail, el, props, prop, elCounter, elLen, i, len;
    
    for (elCounter = 0, elLen = elements.length; elCounter < elLen; elCounter++) {
        el = elements[elCounter];
        props = jasmine.object.keys(el);
        
        for (i = 0, len = props.length; i < len; i++) {
            prop = props[i];
            
            if (typeof el[prop] === 'function' && (prop in elProto) && !allowedMethods[prop]) {
                leaks.push(el.dom.tagName + '#' + el.id + ' has property ' + prop);
                fail = true;
                
                // Do not allow this to poison subsequent specs
                delete el[prop];
            }
        }
    }
    
    if (fail) {
        spec.expect(leaks).toCleanup('Important Ext.dom.Element instance methods');
    }
    
    return fail;
};

jasmine.Env.prototype.checkDataStores = function(spec) {
    // We're bypassing public API here for the sake of performance
    var items = Ext.data.StoreManager.items,
        autoCreated = Ext.data.StoreManager.autoCreatedStores,
        itemsLen = items.length,
        autoCreatedLen = autoCreated.length,
        item, leaks, fail, i;

    // Usually there's only one store and it's the EmptyStore; that one is special
    // and is never included in autoCreatedStores.
    if (autoCreatedLen || (itemsLen && !(itemsLen === 1 && items[0] && items[0].isEmptyStore))) {
        leaks = [];
        
        for (i = 0; i < itemsLen; i++) {
            item = items[i];
            
            if (!item.isEmptyStore) {
                leaks.push(item);
            }
        }
        
        for (i = 0; i < autoCreatedLen; i++) {
            item = autoCreated[i];

            if (!item.destroyed) {
                leaks.push(item);
            }
        }
        
        if (leaks.length) {
            spec.expect(leaks).toCleanup('Store instances');
            fail = true;
        }
    }
    
    return fail;
};

jasmine.Env.prototype.checkTaskManager = function(spec) {
    var fail, tasks, task, leaks, i, len;
    
    // We have killed the TaskManager singleton's timer.
    // Ensure it knows this next time it's asked to run anything.
    if (Ext.TaskManager) {
        Ext.TaskManager.timerId = null;
        
        tasks = Ext.TaskManager.tasks;
        
        if (len = tasks.length) {
            leaks = [];
            
            for (i = 0; i < len; i++) {
                task = tasks[i];
                
                if (!task.stopped) {
                    leaks.push('Task ' + i + ': ' + (task.run.plan ? task.run.plan : task.run).toString());
                    
                    // And don't allow it to interfere with subsequent tests.
                    Ext.TaskManager.stop(task, true);
                }
            }
            
            if (leaks.length) {
                spec.expect(leaks).toCleanup('TaskManager queue');
                fail = true;
            }
            
            leaks.length = 0;
        }
    }
    
    return fail;
}

// Check for any pending setTimeout calls.
// They don't necessarily mean spec failures, it is just part of natural framework behaviour
// *but* there can be genuine runaway timers that should cause test failures. In any case
// we don't want unsafe dangling timers to poison subsequent specs.
jasmine.Env.prototype.checkTimers = function(spec, specName) {
    var clock = jasmine.Clock,
        leaks = [],
        fail, tasks, task, taskLeaks, timerId, fn, fnSource, i, len;
    
    tasks = clock.scheduledFunctions;
    
    for (timerId in tasks) {
        task = tasks[timerId];
        
        fn = task.scheduledFn.$origFn ? task.scheduledFn.$origFn : task.scheduledFn;
        
        // Some framework-wide timers are deemed safe and can fire at will
        if (!task.$skipTimerCheck && !task.$allowedTimer) {
            fnSource = fn.toString();
            
            // Some external libraries such as d3.js install timers and never clean them up.
            // Also the way WebDriver executes JavaScript involves setting timers.
            // We can't really do anything about that so let's ignore these.
            // IE doesn't support name property on Function objects.
            if (fn.name === 'poke$1' || fnSource.indexOf('poke$1') !== -1 ||
                fnSource.indexOf('StatusCode.SCRIPT_TIMEOUT') !== 1
            ) {
                task.$skipTimerCheck = true;
                continue;
            }
            
            leaks.push(fnSource + (task.created ? ', created at: ' + task.created : ''));
            
            if (jasmine.DEBUGGING_MODE) {
                // We only want to log an error in the unlikely case of runaway timers
                // started in a different spec somehow evading detection in that spec
                if (task.spec && task.spec !== specName) {
                    jasmine.console.error(task.spec + ' left scheduled timer: ');
                    jasmine.console.log(fn);
                    
                    if (task.created) {
                        jasmine.console.log(task.created);
                    }
                }
                
                jasmine.console.log('Leaked timer id: ' + timerId + ' in spec ' + specName);
                jasmine.console.log('Leaked function: ' + fnSource + (task.created ? ',\ncreated at: ' + task.created : ''));
            }
            
            taskLeaks = taskLeaks || [];
            taskLeaks.push(timerId);
        }
        // This is intentional: ($skipTimerCheck || $allowedTimer) && $clearTimer
        else if (fn.$clearTimer) {
            jasmine.clearTimeout(task.realTimeoutKey);
            delete tasks[timerId];
        }
    }
    
    if (taskLeaks && taskLeaks.length) {
        for (i = 0, len = taskLeaks.length; i < len; i++) {
            timerId = taskLeaks[i];
            
            // Don't allow it to fire in the next spec
            clock.installed.clearTimeout(timerId);
            delete tasks[timerId];
        }
    }
    
    if (leaks.length) {
        spec.expect(leaks).toCleanup('Scheduled timers');
        fail = true;
    }
    
    return fail;
};

jasmine.Env.prototype.checkTaskQueue = function(queue, type, spec, specName) {
    var fail, item, i, len;
    
    if (queue.length === 1 && queue[0].$skipResourceCheck) {
        return fail;
    }
    
    for (i = 0, len = queue.length; i < len; i++) {
        item = queue[i];
        
        if (!item.$skipResourceCheck) {
            fail = true;
            
            jasmine.console.log('Leaked Ext.TaskQueue.' + type + ' request in spec ' + specName);
            jasmine.console.dir(item);
        }
    }
    
    if (fail) {
        spec.expect(queue).toCleanup('Ext.TaskQueue.' + type, 5);
    }
    
    return fail;
};

jasmine.Env.prototype.collectDomGarbage = function(spec, specName) {
    var garbage = [],
            ids = [],
            msg = [],
        cache = Ext.cache,
        detachedBody = this.detachedBody,
        fail = false,
        tagName, eid, el, dom, isGarbage, elId, comp, events, eventName, event, listenerCount,
        i, len, j;

    for (eid in cache) {
        el = cache[eid];

        if (el.skipGarbageCollection) {
            continue;
        }

        isGarbage = false;
        dom = el.dom;

        // Should always have a DOM node
        if (!dom) {
            msg.push('Missing DOM node in element garbage collection: ' + eid);
            isGarbage = true;
        }
        else {
            try {
                tagName = dom.tagName;
                
                // In IE, accessing any properties of the window object of an orphaned iframe
                // can result in a "Permission Denied" error.  The same error also occurs
                // when accessing any properties of orphaned documentElement or body inside
                // of an iframe (documentElement and body become orphaned when the iframe
                // contentWindow is unloaded)
                isGarbage = dom.nodeType === 1 && tagName !== 'BODY' && tagName !== 'HTML' &&
                            tagName !== 'HEAD' &&
                            (!dom.parentNode || !dom.ownerDocument.body.contains(dom)) &&
                            !detachedBody.contains(dom);
            }
            catch (e) {
                // if an error was thrown in isGarbage it is most likely because we are
                // dealing with an inaccessible window or documentElement inside an orphaned
                // iframe in IE. In this case we can't do anything except remove the
                // cache entry.
                delete cache[eid];
                garbage.push(el);
                
                continue;
            }
        }
        
        if (isGarbage) {
            elId = (tagName ? tagName : '') + '#' + (el.id || eid);
            ids.push(elId);
            garbage.push(el);
            fail = true;
            
            msg.push(elId + ' is an orphan Ext.dom.Element instance');
            
            if (comp = el.comp) {
                msg.push('Owner Component ' + comp.id + '\r\nSpec: ' + comp.$spec +
                         '\r\nCreated: ' + comp.$created);
            }
            
            if (!el.destroyed) {
                // Log any active listeners
                events = jasmine.object.keys(el.events);
                
                for (i = 0, len = events.length; i < len; i++) {
                    eventName = events[i];
                    event = el.events[eventName];
                    listenerCount = event.listeners.length;
                        
                    if (listenerCount) {
                        jasmine.console.error(elId + ': event ' + eventName + ' has listeners in ' + specName + '\r\n', event);
                        
                        for (j = 0; j < listenerCount; j++) {
                            jasmine.console.log('\t   fn: ', event.listeners[j].fn);
                            
                            if (event.listeners[j].scope) {
                                jasmine.console.log('\tscope: ' +  event.listeners[j].scope.$className);
                                jasmine.console.log('\t       ',  event.listeners[j].scope);
                            }
                        }
                        
                        msg.push(elId + ': event ' + eventName + ' has listeners');
                    }
                }
                
                el.events = {};
            }
            
            delete cache[eid];
        }
    }

    for (i = 0, len = garbage.length; i < len; i++) {
        if (!garbage[i].destroyed) {
            garbage[i].collect();
        }
    }
    
    if (fail) {
        spec.fail(msg.join('\n'));
    }
    
    return fail;
};

jasmine.Env.prototype.checkPrototype = function(cls, spec, specName) {
    var proto = cls.prototype,
        propList = [],
        keys, propName, prop, fail, i, len;

    keys = jasmine.object.keys(proto);

    for (i = 0, len = keys.length; i < len; i++) {
        propName = keys[i];
        prop = proto[propName];
        
        if ((typeof prop === 'function') && !prop.prototype && prop.$owner !== cls) {
            fail = true;
            propList.push(propName);
        }
    }
    
    if (fail) {
        jasmine.console.error(specName + ' corrupted ' + cls.$className + "'s properties:");
        jasmine.console.error(propList.join(', '));
        spec.fail('corrupted ' + cls.$className + "'s properties: " + propList.join(', '));
    }
    
    return fail;
};

/** No-op base class for Jasmine reporters.
 *
 * @constructor
 */
jasmine.Reporter = function() {
};

jasmine.Reporter.prototype.reportRunnerStarting = jasmine.emptyFn;
jasmine.Reporter.prototype.reportRunnerResults = jasmine.emptyFn;
jasmine.Reporter.prototype.reportSuiteDescribeStarting = jasmine.emptyFn;
jasmine.Reporter.prototype.reportSuiteDescribeFinishing = jasmine.emptyFn;
jasmine.Reporter.prototype.reportSuiteStarting = jasmine.emptyFn;
jasmine.Reporter.prototype.reportSuiteResults = jasmine.emptyFn;
jasmine.Reporter.prototype.reportSpecAdded = jasmine.emptyFn;
jasmine.Reporter.prototype.reportSpecStarting = jasmine.emptyFn;
jasmine.Reporter.prototype.reportSpecResults = jasmine.emptyFn;
jasmine.Reporter.prototype.log = jasmine.emptyFn;

/** JavaScript API reporter.
 *
 * @constructor
 */
jasmine.JsApiReporter = function() {
    this.started = false;
    this.finished = false;
    this._suites = [];
    this._results = {};
};

jasmine.JsApiReporter.prototype.reportRunnerStarting = function(runner) {
    var suites, suite, i, len;
    
    this.started = true;
    
    suites = runner.suites();
    
    for (i = 0, len = suites.length; i < len; i++) {
        suite = suites[i];
        this._suites.push(this._summarize(suite));
    }
};

jasmine.JsApiReporter.prototype.suites = function() {
    return this._suites;
};

jasmine.JsApiReporter.prototype._summarize = function(suiteOrSpec) {
    var isSuite, summary, children, i, len;
    
    isSuite = suiteOrSpec.isSuite;
    
    summary = {
        id: suiteOrSpec.getId(),
        name: suiteOrSpec.description,
        type: isSuite ? 'suite' : 'spec',
        children: []
    };
    
    if (isSuite) {
        children = suiteOrSpec.children();
        
        for (i = 0, len = children.length; i < len; i++) {
            summary.children.push(this._summarize(children[i]));
        }
    }
    
    return summary;
};

jasmine.JsApiReporter.prototype.results = function() {
    return this._results;
};

jasmine.JsApiReporter.prototype.resultsForSpec = function(specId) {
    return this._results[specId];
};

//noinspection JSUnusedLocalSymbols
jasmine.JsApiReporter.prototype.reportRunnerResults = function(runner) {
    this.finished = true;
};

//noinspection JSUnusedLocalSymbols
jasmine.JsApiReporter.prototype.reportSuiteResults = function(suite) {
};

//noinspection JSUnusedLocalSymbols
jasmine.JsApiReporter.prototype.reportSpecResults = function(spec) {
    this._results[spec.getId()] = {
        messages: spec.results().items(),
        result: spec.results().failedCount > 0 ? "failed" : "passed"
    };
};

//noinspection JSUnusedLocalSymbols
jasmine.JsApiReporter.prototype.log = function(str) {
};

jasmine.JsApiReporter.prototype.resultsForSpecs = function(specIds) {
    var results = {},
        specId, i, len;
    
    for (i = 0, len = specIds.length; i < len; i++) {
        specId = specIds[i];
        results[specId] = this._summarizeResult(this._results[specId]);
    }
    
    return results;
};

jasmine.JsApiReporter.prototype._summarizeResult = function(result) {
    var summaryMessages = [],
        messagesLength = result.messages.length,
        messageIndex, resultMessage;
    
    for (messageIndex = 0; messageIndex < messagesLength; messageIndex++) {
        resultMessage = result.messages[messageIndex];
        
        summaryMessages.push({
            text: resultMessage.type === 'log' ? resultMessage.toString() : jasmine.undefined,
            passed: resultMessage.passed ? resultMessage.passed() : true,
            type: resultMessage.type,
            message: resultMessage.message,
            trace: {
                stack: resultMessage.passed && !resultMessage.passed() ? resultMessage.trace.stack : jasmine.undefined
            }
        });
    }
    
    return {
        result: result.result,
        messages: summaryMessages
    };
};

/**
 * @constructor
 * @param {jasmine.Env} env
 * @param actual
 * @param {jasmine.Spec} spec
 */
jasmine.Matchers = function(env, actual, spec, opt_isNot) {
    this.env = env;
    this.actual = actual;
    this.spec = spec;
    this.isNot = opt_isNot || false;
    this._reportWasCalled = false;
};

jasmine.Matchers._wrapInto = function(prototype, matchersClass) {
    var methodName, orig;
    
    for (methodName in prototype) {
        if (methodName == 'report') continue;
        
        orig = prototype[methodName];
        matchersClass.prototype[methodName] = jasmine.Matchers._matcherFn(methodName, orig);
    }
};

jasmine.Matchers._matcherFn = function(matcherName, matcherFunction) {
    return function() {
        var matcherArgs, result, message, englishyPredicate, expectationResult, i, len;
        
        matcherArgs = jasmine.util.argsToArray(arguments);
        
        // N.B.: This is where matching happens. Careful stepping through!
        result = matcherFunction.apply(this, arguments);
        
        if (this.isNot) {
            result = !result;
        }
        
        if (this._reportWasCalled) {
            return result;
        }
        
        if (result) {
            message = this.message;
        }
        else {
            if (this.message) {
                if (typeof this.message === 'function') {
                    message = this.message.apply(this, arguments);
                }
                else {
                    message = this.message;
                }
                
                if (jasmine.isArray(message)) {
                    message = message[this.isNot ? 1 : 0];
                }
            }
            else {
                englishyPredicate = matcherName.replace(/[A-Z]/g, function(s) { return ' ' + s.toLowerCase(); });
                message = "Expected " + jasmine.pp(this.actual) + (this.isNot ? " not " : " ") + englishyPredicate;
                
                if (matcherArgs.length > 0) {
                    for (i = 0, len = matcherArgs.length; i < len; i++) {
                        if (i > 0) {
                            message += ",";
                        }
                        
                        message += " " + jasmine.pp(matcherArgs[i]);
                    }
                }
                
                message += ".";
            }
        }
        
        expectationResult = new jasmine.ExpectationResult({
            keepPassed: this.spec.env.keepPassedResults,
            matcherName: matcherName,
            passed: result,
            expected: matcherArgs.length > 1 ? matcherArgs : matcherArgs[0],
            actual: this.actual,
            message: message
        });
        
        this.spec.addMatcherResult(expectationResult);
        
        return result;
    };
};

/**
 * toBe: compares the actual to the expected using ===
 * @param expected
 */
jasmine.Matchers.prototype.toBe = function(expected) {
    return this.actual === expected;
};

/**
 * toEqual: compares the actual to the expected using common sense equality. Handles Objects, Arrays, etc.
 *
 * @param expected
 */
jasmine.Matchers.prototype.toEqual = function(expected) {
    return this.env._equals(this.actual, expected);
};

/**
 * Matcher that compares the actual to the expected using a regular expression.  Constructs a RegExp, so takes
 * a pattern or a String.
 *
 * @param expected
 */
jasmine.Matchers.prototype.toMatch = function(expected) {
    return new RegExp(expected).test(this.actual);
};

/**
 * Matcher that compares the actual to jasmine.undefined.
 */
jasmine.Matchers.prototype.toBeDefined = function() {
    return (this.actual !== jasmine.undefined);
};

/**
 * Matcher that compares the actual to jasmine.undefined.
 */
jasmine.Matchers.prototype.toBeUndefined = function() {
    return (this.actual === jasmine.undefined);
};

/**
 * Matcher that compares the actual to null.
 */
jasmine.Matchers.prototype.toBeNull = function() {
    return (this.actual === null);
};

/**
 * Matcher that compares the actual to NaN.
 */
jasmine.Matchers.prototype.toBeNaN = function() {
	this.message = "Expected " + jasmine.pp(this.actual) + " to be NaN.";

	return (this.actual !== this.actual);
};

/**
 * Matcher that boolean not-nots the actual.
 */
jasmine.Matchers.prototype.toBeTruthy = function() {
    return !!this.actual;
};

/**
 * Matcher that boolean nots the actual.
 */
jasmine.Matchers.prototype.toBeFalsy = function() {
    return !this.actual;
};

/**
 * Matcher that checks to see if the actual, a Jasmine spy, was called.
 */
jasmine.Matchers.prototype.toHaveBeenCalled = function() {
    if (arguments.length > 0) {
        throw new Error('toHaveBeenCalled does not take arguments, use toHaveBeenCalledWith');
    }
    
    if (!jasmine.isSpy(this.actual)) {
        throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
    }
    
    this.message = [
        "Expected spy " + this.actual.identity + " to have been called.",
        "Expected spy " + this.actual.identity + " not to have been called."
    ];
    
    return this.actual.wasCalled;
};

/**
 * Matcher that checks to see if the actual, a Jasmine spy, was called with a set of parameters.
 *
 */
jasmine.Matchers.prototype.toHaveBeenCalledWith = function() {
    var expectedArgs = jasmine.util.argsToArray(arguments);
    
    if (!jasmine.isSpy(this.actual)) {
        throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
    }
    
    this.message = function() {
        var invertedMessage = "Expected spy " + this.actual.identity + " not to have been called with " + jasmine.pp(expectedArgs) + " but it was.";
        var positiveMessage = "";
        
        if (this.actual.callCount === 0) {
            positiveMessage = "Expected spy " + this.actual.identity + " to have been called with " + jasmine.pp(expectedArgs) + " but it was never called.";
        }
        else {
            positiveMessage = "Expected spy " + this.actual.identity + " to have been called with " + jasmine.pp(expectedArgs) + " but actual calls were " + jasmine.pp(this.actual.argsForCall).replace(/^\[ | \]$/g, '');
        }
        
        return [positiveMessage, invertedMessage];
    };
    
    return this.env._contains(this.actual.argsForCall, expectedArgs);
};

/**
 * Matcher that checks that the expected item is an element in the actual Array.
 *
 * @param {Object} expected
 */
jasmine.Matchers.prototype.toContain = function(expected) {
    return this.env._contains(this.actual, expected);
};

/**
 * Check that the actual value is less than expected.
 * Synomym: `toBeLT`
 *
 * @param {Number} expected
 */
jasmine.Matchers.prototype.toBeLessThan = function(expected) {
    this.message = [
        "Expected " + this.actual + " to be less than " + expected,
        "Expected " + this.actual + " not to be less than " + expected
    ];
    
    return this.actual < expected;
};

jasmine.Matchers.prototype.toBeLT = jasmine.Matchers.prototype.toBeLessThan;

/**
 * Check that the actual value is greater than expected.
 * Synonym: `toBeGT`
 *
 * @param {Number} expected
 */
jasmine.Matchers.prototype.toBeGreaterThan = function(expected) {
    this.message = [
        "Expected " + this.actual + " to be greater than " + expected,
        "Expected " + this.actual + " not to be greater than " + expected
    ];
    
    return this.actual > expected;
};

jasmine.Matchers.prototype.toBeGT = jasmine.Matchers.prototype.toBeGreaterThan;

/*
 * Check that the actual value is less than or equal to expected.
 * Synonyms: `toBeLE`, `toBeEqualOrLessThan`, `toBeAtMost`.
 *
 * @param {Number} expected
 *
 */
jasmine.Matchers.prototype.toBeLessThanOrEqual = function(expected) {
    this.message = [
        "Expected " + this.actual + " to be less than or equal to " + expected,
        "Expected " + this.actual + " not to be less than or equal to " + expected
    ];
    
    return this.actual <= expected;
};

jasmine.Matchers.prototype.toBeLE =
jasmine.Matchers.prototype.toBeEqualOrLessThan =
jasmine.Matchers.prototype.toBeAtMost =
    jasmine.Matchers.prototype.toBeLessThanOrEqual;

/**
 * Check that the actual value is greater than or equal to the expected.
 * Synonyms: `toBeGE`, `toBeEqualOrGreaterThan`, `toBeAtLeast`.
 *
 * @param {Number} expected
 */
jasmine.Matchers.prototype.toBeGreaterThanOrEqual = function(expected) {
    this.message = [
        "Expected " + this.actual + " to be greater than or equal to " + expected,
        "Expected " + this.actual + " not to be greater than or equal to " + expected
    ];
    
    return this.actual >= expected;
};

jasmine.Matchers.prototype.toBeGE =
jasmine.Matchers.prototype.toBeEqualOrGreaterThan =
jasmine.Matchers.prototype.toBeAtLeast =
    jasmine.Matchers.prototype.toBeGreaterThanOrEqual;


/**
 * Matcher that checks that the expected item is equal to the actual item
 * up to a given level of decimal precision (default 2).
 *
 * @param {Number} expected
 * @param {Number} precision, as number of decimal places
 */
jasmine.Matchers.prototype.toBeCloseTo = function(expected, precision) {
    if (!(precision === 0)) {
        precision = precision || 2;
    }
    
    this.message = "Expected " + this.actual + " to be close to " + expected +
                   " within " + precision + " decimal points";
    
    return Math.abs(expected - this.actual) < (Math.pow(10, -precision) / 2);
};

/**
 * Check that the actual value is within the margin of error from the expected.
 * Synonyms: `toBeAppr`, `toBeApproximately`.
 *
 * @param {Number} expected
 * @param {Number} [errorMargin=1]
 */
jasmine.Matchers.prototype.toBeApprox = function(expected, errorMargin) {
    errorMargin = errorMargin || 1;
    
    var min = expected - errorMargin,
        max = expected + errorMargin;
    
    this.message = "Expected " + this.actual + " to be approximately " +
                   expected + " by margin of " + errorMargin;
    
    return this.actual >= min && this.actual <= max;
};

jasmine.Matchers.prototype.toBeAppr =
jasmine.Matchers.prototype.toBeApproximately =
    jasmine.Matchers.prototype.toBeApprox;

/**
 * Check that the actual value is within the allowed deviation from expected.
 *
 * @param {Number} deviation
 * @param {Number} expected
 */
jasmine.Matchers.prototype.toBeWithin = function(deviation, expected) {
    var actual = this.actual;
    
    this.message = "Expected " + this.actual + " to be within " + deviation + " from " + expected;

    if (deviation > 0) {
        return actual >= (expected - deviation) && actual <= (expected + deviation);
    }
    else {
        return actual >= (expected + deviation) && actual <= (expected - deviation);
    }
};

/**
 * Matcher that checks that the expected exception was thrown by the actual.
 *
 * @param {String} [expected]
 */
jasmine.Matchers.prototype.toThrow = function(expected) {
    var global = Ext.global,
        oldOnError = window.onError,
        result = false,
        exception, not;
    
    if (typeof this.actual !== 'function') {
        throw new Error('Actual is not a function');
    }
    
    // mock the console to avoid logging to the real console during the tests
    Ext.global = {
        console: {
            dir: function(s) {
                return s;
            },
            log: function(s) {
                return s;
            },
            error: function(s) {
                return s;
            },
            warn: function(s) {
                return s;
            }
        }
    };
    
    // This is to allow setting breakpoints for console messages
    // that are not expected to be suppressed by jasmine.toThrow and alike
    Ext.global.console.dir.$emptyFn = Ext.global.console.log.$emptyFn = true;
    Ext.global.console.error.$emptyFn = Ext.global.console.warn.$emptyFn = true;
    
    // Exceptions thrown in event handlers for synthetic events like mousedown
    // are not catchable by try/catch block. Such exceptions bubble up to the
    // window though, and can be detected in onerror handler. We can also
    // "catch" these in Firefox and WebKit by returning true; that makes
    // the browser think that the exception was handled and it's not logged
    // in the console anymore. Unfortunately that doesn't work in IE,
    // and exceptions are still logged.
    window.onerror = function(msg) {
        exception = msg;
        
        if (oldOnError) {
            oldOnError();
        }
        
        return true;
    };
    
    try {
        this.actual();
    }
    catch (e) {
        exception = e;
    }
    
    if (exception) {
        result = (expected === jasmine.undefined || this.env._contains(exception.message || exception, expected.message || expected));
    }
    
    Ext.global = global;
    
    // IE8 throws "Not implemented" when trying to assign undefined
    window.onerror = oldOnError || null;
    
    not = this.isNot ? "not " : "";
    
    this.message = function() {
        if (exception && (expected === jasmine.undefined || !this.env._contains(exception.message || exception, expected.message || expected))) {
            return ["Expected function " + not + "to throw", expected ? expected.message || expected : " an exception", ", but it threw", exception.message || exception].join(' ');
        }
        else {
            return "Expected function to throw an exception.";
        }
    };
    
    return result;
};

/**
 * Check that the actual DOM node has the expected HTML markup.
 * Synomyms: `toHaveHTML`, `hasHTML`.
 *
 * @param {String} expected
 */
jasmine.Matchers.prototype.toHaveHtml = function(expected) {
    var me = this,
        actual = me.actual;

    if (actual && actual.isElement) {
        actual = actual.dom;
    }
    
    if (!actual || !actual.tagName) {
        throw new Error('Actual is not a dom element');
    }
    
    if (jasmine.browser.isSafari3) {
        expected = expected.replace(/&gt;/g, '>');
    }
    
    // this will normalize innerHTML which could vary a lot
    var normalizedHTML = actual.innerHTML.replace(/<[^>]*>/g, function(match1) {
        return match1.toLowerCase().replace(/=\w+/g, function(match2) { 
            return '="' + match2.split('=')[1] + '"'; 
        });
    });
    
    me.message = function() {
        return [
          "Expected DOM element innerHTML to be " + expected + " but was " + normalizedHTML,
          "Expected DOM element innerHTML to not be " + expected + "."
        ];
    };
    
    return normalizedHTML === expected;
};

jasmine.Matchers.prototype.toHaveHTML =
jasmine.Matchers.prototype.hasHTML =
    jasmine.Matchers.prototype.toHaveHtml;

/**
 * Check that the actual DOM node has the expected CSS class applied.
 *
 * @param {String} expected
 */
jasmine.Matchers.prototype.toHaveCls = function(expected) {
    // (this.actual.el || this.actual) ensures that this works for
    // Ext.Element, Ext.Component, and HTMLElement instances
    var el = Ext.fly(this.actual.el || this.actual, 'jasmine_toHaveCls'),
        hasClsCount = 0,
        expectedCount, i;
    
    if (!el || !el.dom) {
        this.message = "Expected HTMLElement or Ext.dom.Element but got " + jasmine.pp(this.actual);
        
        return false;
    }

    if (typeof expected === 'string') {
        // Allow space separated class list to be tested.
        expected = expected.split(/\s+/);
    }

    for (i = 0, expectedCount = expected.length; i < expectedCount; i++) {
        if (el.hasCls(expected[i])) {
            ++hasClsCount;
        }
    }

    this.message = [
        "Expected DOM element " + el.dom.tagName + (el.dom.id ? "#" + el.dom.id : "") +
            " to have CSS class " + expected.join(' ') + ".",
        "Expected DOM element " + el.dom.tagName + (el.dom.id ? "#" + el.dom.id : "") +
            " to not have CSS class " + expected.join(' ') + "."
    ];

    return this.isNot ? (hasClsCount > 0) : (hasClsCount === expectedCount);
};

/**
 * Check if an object has a property. This uses `hasOwnProperty`
 * to check for existence to make it type agnostic.
 *
 * @param {String} property The property to check existence on the taret.
 */
jasmine.Matchers.prototype.toHaveProperty = function (property) {
    var target = this.actual,
        hasProp;

    if (target) {
        hasProp = target.hasOwnProperty(property);

        if (this.isNot) {
            this.message = hasProp ?
                'Expected target to not have the property "' + property + '"' :
                'Target has property "' + property + '"';
        } else {
            this.message = hasProp ?
                'Target has property "' + property + '"' :
                'Expected target to have the property "' + property + '"';
        }
    }

    return hasProp;
};

/**
 * Checks if an object has all properties passed. This function
 * will iterate through all arguments to check for existence:
 *
 *     expect(target).toHaveProperties('foo', 'bar');
 */
jasmine.Matchers.prototype.toHaveProperties = function () {
    var target = this.actual,
        properties = jasmine.util.argsToArray(arguments),
        length = properties.length,
        bad = [],
        i, property, hasProp;

    if (target) {
        for (i = 0; i < length; i++) {
            property = properties[i];
            hasProp = target.hasOwnProperty(property);

            if (this.isNot) {
                if (hasProp) {
                    bad.push(property);
                }
            } else {
                if (!hasProp) {
                    bad.push(property);
                }
            }
        }

        this.message = bad.length ?
            'Expected target to ' + (this.isNot ? 'not' : '') + ' have properties: ' + bad.join(', ') :
            'Target ' + (this.isNot ? 'does not have' : 'has') + ' properties: ' + properties.join(', ');

        return this.isNot ? bad.length : !bad.length;
    }

    return false;
}

/**
 * Check that Component or Element has the specified attribute.
 * Synonym: `toHaveAttr`
 *
 * @param {String} attr The attribute to check
 * @param {String} [value] Value to check (optional for negative matcher)
 */
jasmine.Matchers.prototype.toHaveAttribute = function(attr, expectedValue) {
    var target = this.actual,
        msg, ret, hasAttr, actualValue;
    
    if (target) {
        target = (target.ariaEl ? target.ariaEl : Ext.fly(target)).dom;
        hasAttr = target.hasAttribute(attr);
        actualValue = target.getAttribute(attr);
        
        // If value is not provided then we're checking attribute existence
        if (arguments.length === 1) {
            ret = hasAttr;
            
            // jasmine.Matcher expectation inversion logic is a bit perverse
            // if you pardon my pun, so it's better to spell out the results
            // to be 100% sure they will get noticed.
            if (this.isNot) {
                msg = !ret ? 'DOM element has no attribute "' + attr + '"'
                           : 'Expected DOM element not to have attribute "' + attr +
                             '" but it is present' + (ret ? ' with value of "' + actualValue + '"' : '')
            }
            else {
                msg = ret ? 'DOM element has attribute "' + attr + '"'
                          : 'Expected DOM element to have attribute "' + attr + '" ' +
                            'but the attribute is not present'
            }
        }
        // Whoa, if we're matching an attribute NOT to have a GIVEN value,
        // what does that even mean? Any other attribute is valid except
        // the expected one? Surely that can't be a sane expectation?
        // It is weird and unlikely but who knows, typos happen.
        else if (this.isNot) {
            ret = false;
            msg = 'Expecting an attribute NOT to have value of "' + expectedValue +
                  '"? Hey that must be an error!';
        }
        else {
            // getAttribute always returns strings but many attributes contain
            // numerical values (tabIndex, etc) and we can accommodate for that
            // so that the dev wouldn't have to remember to write expectations
            // for strings all the time. Makes life a bit easier.
            actualValue = typeof expectedValue === 'number' ? +actualValue : actualValue;
            
            // When we are expecting the element to have attribute with a value,
            // it matches when:
            //  - Attribute is present AND
            //  - Attribute value matches
            //
            ret = hasAttr && actualValue === expectedValue;
            
            msg = ret ? 'DOM element has attribute "' + attr + '" with value of "' + expectedValue + '"'
                      : (hasAttr ? 'Expected DOM element to have attribute "' + attr + '" with value of "' +
                                    expectedValue + '" but the actual value is "' + actualValue + '"'
                                 : 'Expected DOM element to have attribute "' + attr + '" with value of "' +
                                    expectedValue + '" but the attribute is not present')
        }
    }
    else {
        msg = "Expected DOM element but got " + jasmine.pp(target);
        ret = false;
    }
    
    this.message = msg;
    
    return ret;
};

jasmine.Matchers.prototype.toHaveAttr = jasmine.Matchers.prototype.toHaveAttribute;

/*
 * Check that the actual Date value equals expected hour/minute/second/ms.
 *
 * @param {Number} hour Expected hour
 * @param {Number} [minute] Expected minute
 * @param {Number} [second] Expected second
 * @param {Number} [ms] Expected microsecond
 */
jasmine.Matchers.prototype.toEqualTime = function(hour, minute, second, ms) {
    var actual = this.actual;
    
    return actual instanceof Date &&
           actual.getHours() === hour &&
           actual.getMinutes() === (minute || 0) &&
           actual.getSeconds() === (second || 0) &&
           actual.getMilliseconds() === (ms || 0);
};

/*
 * Check that the DOM element has the expected position.
 *
 * @param {Number} x
 * @param {Number} y
 */
jasmine.Matchers.prototype.toBePositionedAt = function(x, y) {
    var xy = this.actual.getXY();
    
    this.message = "Expected Ext.Element to be positioned at (" + x + "," + y +
                   ") but was positioned at (" + xy[0] + "," + xy[1] + ")";
    
    return xy[0] === x && xy[1] === y;
};

// This is not a real matcher, it is only used to add a failed resource leak check
// result to the spec.
jasmine.Matchers.prototype.toCleanup = function(desc, depth) {
    if (jasmine.DEBUGGING_MODE) {
        jasmine.console.log(desc + ' resource leaks:');
        jasmine.console.dir(this.actual);
    }

    this.message = 'Leaked resource ' + desc + ': ' + jasmine.pp(this.actual, depth);
    
    return false;
};

// This matcher is used to pass or fail TODO suites. It is never to be used
// as inverted .not.toHaveFailed!
jasmine.Matchers.prototype.toHaveFailed = function(desc) {
    var specOrSuite = this.actual,
        passed = specOrSuite.results()._passed(),
        msg;
    
    if (passed) {
        if (specOrSuite.isSpec) {
            msg = 'Expected To Do spec to fail but it passed' + (desc ? ': ' + desc : '');
        }
        else {
            msg = 'Expected To DO suite to fail at least one spec or nested suite' +
                  ' but all specs passed' + (desc ? ': ' + desc : '');
        }
    }
    else {
        if (specOrSuite.isSpec) {
            msg = 'Expected To Do spec to fail and it did';
        }
        else {
            msg = 'Expected To Do suite to fail at least one spec or nested suite, and it did.';
        }
    }
    
    this.message = msg;
    
    return !passed;
};

(function() {
    var layoutFly, browsers, elementPropGetters;
    
    browsers = [
        "IE6", "IE7", "IE8", "IE9", "IE10", "IE11", "IE",
        "Gecko3", "Gecko4", "Gecko5", "Gecko10", "Gecko",
        "FF3_6", "FF4", "FF5",
        "Chrome",
        "Safari2", "Safari3", "Safari4", "Safari5", "Safari6", "Safari7", "Safari8", "Safari9",
        "Safari"
    ];

    elementPropGetters = {
        x: function(el, root) {
            var x = el.getX(),
                x0 = root ? root.el.getX() : el.getX();
            return x - x0;
        },
        y: function(el, root) {
            var y = el.getY(),
                y0 = root ? root.el.getY() : el.getY();
            return y - y0;
        },
        w: function(el) {
            return el.dom.offsetWidth;
        },
        h: function(el) {
            return el.dom.offsetHeight;
        },
        xywh: function(el, root) {
            var x= el.getX(),
                x0 = root ? root.el.getX() : el.getX(),
                y = el.getY(),
                y0 = root ? root.el.getY() : el.getY(),
                w = el.dom.offsetWidth,
                h = el.dom.offsetHeight,
                dims = [];
            dims.push(x - x0, y - y0, w, h);
            return dims.join(' ');
        },
        d: function(el) {
            // display != none
            return el.isVisible(true, 1);
        },
        v: function(el) {
            // visibility != hidden
            return el.isVisible(true, 2);
        },
        dv: function(el) { //
            // display != none && visibility != hidden
            return el.isVisible(true, 3);
        },
        cls: function(el) {
            return el.dom.className;
        }
    };
    
    function browserCheck(expected) {
        var browser, i, len;
        
        if (Ext.isNumeric(expected) || Ext.isArray(expected)) {
            return expected;
        }
        
        for (i = 0, len = browsers.length; i < len; i++) {
            browser = browsers[i];
            
            if (expected.hasOwnProperty(browser) && Ext["is" + browser]) {
                return expected[browser];
            }
        }
        
        return expected['*'] || expected;
    };
    
    function checkLayout(comp, layout, root, path) {
        Ext.Object.each(layout, function(name, value) {
            if (name === 'items' || name === 'dockedItems') {
                Ext.Object.each(value, function(id, sub) {
                    var isNum = String(parseInt(id, 10)) == id,
                        child = isNum ? comp[name].items[parseInt(id, 10)]
                                      : (comp.getComponent(id) || comp.child(id));
                    
                    if (isNum) {
                        id = '.' + name + '[' + id + ']';
                    }
                    else if (id.charAt(0) != ':') {
                        id = '_' + id;
                    }
                    
                    if (child) {
                        checkLayout(child, sub, comp, path + id);
                    }
                    else {
                        expect(id).toBe('found!');
                    }
                });
            }
            else {
                // the name is an element name like 'body'
                var el = comp[name];
                
                if (!el) {
                    layoutFly = layoutFly || new Ext.dom.Fly();
                    
                    // no child el matched, assume the key is a CSS selector
                    el = layoutFly.attach(comp.el.selectNode(name, true));
                }

                if (!el) {
                    throw '"' + name + '" not found on ' + jasmine.pp(comp);
                }
                
                if (el.isComponent) {
                    checkLayout(el, value, el.ownerCt, path + '_' + name);
                }
                else if (el.dom) {
                    value = browserCheck(value);
                    
                    if (value.xywh) {
                        var dims = value.xywh.split(' ');
                        
                        value.x = eval('(' + dims[0] + ')');
                        value.y = eval('(' + dims[1] + ')');
                        value.w = eval('(' + dims[2] + ')');
                        value.h = eval('(' + dims[3] + ')');
                        
                        delete value.xywh;
                    }
                    
                    Ext.Object.each(value, function(prop, expected) {
                        var actual, pfx;

                        actual = elementPropGetters[prop](el, root || comp.el);
                        pfx = (path ? path + '.' : '') + name + '.' + prop + '=';

                        if (Ext.isArray(expected)) {
                            if (actual < expected[0] || actual > expected[1]) {
                                expect(pfx + '=' + actual).toBe('in [' + expected[0] + ',' + expected[1] + ']');
                            }
                        }
                        else if (actual != expected) {
                            expect(pfx + actual).toEqual(expected);
                        }
                    });
                }
            }
        });
    }
    
    jasmine.Matchers.prototype.toHaveLayout = function(expected) {
        var comp = this.actual;
        
        checkLayout(comp, expected, comp.ownerCt, comp.xtype);
        
        return true;
    };
})();

jasmine.Matchers.Any = function(expectedClass) {
    this.expectedClass = expectedClass;
};

jasmine.Matchers.Any.prototype.jasmineMatches = function(other) {
    if (this.expectedClass == String) {
        return typeof other === 'string' || other instanceof String;
    }
    
    if (this.expectedClass == Number) {
        return typeof other === 'number' || other instanceof Number;
    }
    
    if (this.expectedClass == Function) {
        return typeof other === 'function' || other instanceof Function;
    }
    
    if (this.expectedClass == Object) {
        return typeof other === 'object';
    }
    
    return other instanceof this.expectedClass;
};

jasmine.Matchers.Any.prototype.jasmineToString = function() {
    return '<jasmine.any(' + this.expectedClass + ')>';
};

jasmine.Matchers.ObjectContaining = function(sample) {
    this.sample = sample;
};

jasmine.Matchers.ObjectContaining.prototype.jasmineMatches = function(other, mismatchKeys, mismatchValues) {
    var env = jasmine.env,
        property;

    function hasKey(obj, keyName) {
        return obj != null && obj[keyName] !== jasmine.undefined;
    }
    
    mismatchKeys = mismatchKeys || [];
    mismatchValues = mismatchValues || [];
    
    for (property in this.sample) {
        if (!hasKey(other, property) && hasKey(this.sample, property)) {
            mismatchKeys.push("expected has key '" + property + "', but missing from actual.");
        }
        else if (!env._equals(this.sample[property], other[property], mismatchKeys, mismatchValues)) {
            mismatchValues.push("'" + property + "' was '" + (other[property] ? jasmine.util.htmlEscape(other[property].toString()) : other[property]) + "' in expected, but was '" + (this.sample[property] ? jasmine.util.htmlEscape(this.sample[property].toString()) : this.sample[property]) + "' in actual.");
        }
    }
    
    return (mismatchKeys.length === 0 && mismatchValues.length === 0);
};

jasmine.Matchers.ObjectContaining.prototype.jasmineToString = function() {
    return "<jasmine.objectContaining(" + jasmine.pp(this.sample) + ")>";
};

/**
 * @constructor
 */
jasmine.MultiReporter = function() {
    this.subReporters = [];
};

jasmine.util.inherit(jasmine.MultiReporter, jasmine.Reporter);

jasmine.MultiReporter.prototype.addReporter = function(reporter) {
    this.subReporters.push(reporter);
};

jasmine.MultiReporter.prototype.report = function(methodName, args) {
    var reporters = this.subReporters,
        reporter, method, i, len;
    
    for (i = 0, len = reporters.length; i < len; i++) {
        reporter = reporters[i];
        
        if (method = reporter[methodName]) {
            method.apply(reporter, args);
        }
    }
};

(function() {
var slice = Array.prototype.slice;

jasmine.MultiReporter.prototype.reportDependencyLoadStarting = function() {
    return this.report('reportDependencyLoadStarting', slice.call(arguments));
};

jasmine.MultiReporter.prototype.reportDependencyLoadFinishing = function() {
    return this.report('reportDependencyLoadFinishing', slice.call(arguments));
};

jasmine.MultiReporter.prototype.reportEnvSetupStarting = function() {
    return this.report('reportEnvSetupStarting', slice.call(arguments));
};

jasmine.MultiReporter.prototype.reportEnvSetupFinishing = function() {
    return this.report('reportEnvSetupFinishing', slice.call(arguments));
};

jasmine.MultiReporter.prototype.reportRunnerStarting = function() {
    return this.report('reportRunnerStarting', slice.call(arguments));
};

jasmine.MultiReporter.prototype.reportRunnerResults = function() {
    return this.report('reportRunnerResults', slice.call(arguments));
};

jasmine.MultiReporter.prototype.reportSuiteDescribeStarting = function() {
    return this.report('reportSuiteDescribeStarting', slice.call(arguments));
};

jasmine.MultiReporter.prototype.reportSuiteDescribeFinishing = function() {
    return this.report('reportSuiteDescribeFinishing', slice.call(arguments));
};

jasmine.MultiReporter.prototype.reportSuiteStarting = function() {
    return this.report('reportSuiteStarting', slice.call(arguments));
};

jasmine.MultiReporter.prototype.reportSuiteResults = function() {
    return this.report('reportSuiteResults', slice.call(arguments));
};

jasmine.MultiReporter.prototype.reportSpecAdded = function() {
    return this.report('reportSpecAdded', slice.call(arguments));
};

jasmine.MultiReporter.prototype.reportSpecStarting = function() {
    return this.report('reportSpecStarting', slice.call(arguments));
};

jasmine.MultiReporter.prototype.reportSpecResults = function() {
    return this.report('reportSpecResults', slice.call(arguments));
};

jasmine.MultiReporter.prototype.log = function() {
    return this.report('log', slice.call(arguments));
};
})();

/**
 * Holds results for a set of Jasmine spec. Allows for the results array
 * to hold another jasmine.NestedResults.
 *
 * @constructor
 */
jasmine.NestedResults = function() {
    this._items = [];
    this.reset();
};

jasmine.NestedResults.prototype.reset = function() {
    this.totalCount = 0;
    this.passedCount = 0;
    this.failedCount = 0;
    this.skipped = false;
    this._items.length = 0;
};

/**
 * Roll up the result counts.
 *
 * @param result
 */
jasmine.NestedResults.prototype.rollupCounts = function(result) {
    this.totalCount += result.totalCount;
    this.passedCount += result.passedCount;
    this.failedCount += result.failedCount;
};

/**
 * Adds a log message.
 * @param values Array of message parts which will be concatenated later.
 */
jasmine.NestedResults.prototype.log = function(values) {
    this._items.push(new jasmine.MessageResult(values));
};

/**
 * Getter for the results: message & results.
 */
jasmine.NestedResults.prototype.items = function() {
    return this._items;
};

/**
 * Adds a result, tracking counts (total, passed, & failed)
 * @param {jasmine.ExpectationResult|jasmine.NestedResults} result
 */
jasmine.NestedResults.prototype.addResult = function(result) {
    if (result.type !== 'log') {
        if (result._items) {
            this.rollupCounts(result);
        }
        else {
            this.totalCount++;
            
            if (result.passed()) {
                this.passedCount++;
            }
            else {
                this.failedCount++;
            }
        }
    }
    
    this._items.push(result);
};

jasmine.NestedResults.prototype._passed = function() {
    return this.passedCount === this.totalCount;
};

/**
 * @returns {Boolean} True if *everything* below passed. This is a public API
 * and may return forced result for the sake of green runs.
 */
jasmine.NestedResults.prototype.passed = function() {
    // If this is a ToDo spec or suite, forced result will be injected
    return this.forcedResult != null ? this.forcedResult : this._passed();
};

/**
 * Base class for pretty printing for expectation results.
 */
jasmine.PrettyPrinter = function(depth) {
    this._ppNestLevel = 0;
    this._ppDepth = depth != null ? depth : jasmine.MAX_PRETTY_PRINT_DEPTH;
};

/**
 * Formats a value in a nice, human-readable string.
 *
 * @param value
 */
jasmine.PrettyPrinter.prototype.format = function(value) {
    var className, superclass;

    if (this._ppNestLevel > this._ppDepth) {
        throw new Error('jasmine.PrettyPrinter: format() nested too deeply!');
    }
    
    this._ppNestLevel++;
    
    try {
        if (value === jasmine.undefined) {
            this.emitScalar('undefined');
        }
        else if (value === null) {
            this.emitScalar('null');
        }
        else if (value === jasmine.getGlobal()) {
            this.emitScalar('<global>');
        }
        else if (value.jasmineToString) {
            this.emitScalar(value.jasmineToString());
        }
        else if (typeof value === 'string') {
            this.emitString(value);
        }
        else if (jasmine.isSpy(value)) {
            this.emitScalar("spy on " + value.identity);
        }
        else if (value instanceof RegExp) {
            this.emitScalar(value.toString());
        }
        else if (typeof value === 'function') {
            this.emitScalar('Function');
        }
        else if (typeof value.nodeType === 'number') {
            this.emitScalar('HTMLNode');
        }
        else if (value instanceof Date) {
            this.emitScalar('Date(' + value + ')');
        }
        else if (value.__Jasmine_been_here_before__) {
            this.emitScalar('<circular reference: ' + (jasmine.isArray(value) ? 'Array' : 'Object') + '>');
        }
        // Support for pretty printing instances of Ext classes.
        // Assignment within conditional is not accidental.
        else if ((className = value.$className) !== undefined) {
            if (!className) {
                // support for anonymous classes - Ext.define(null, ...)
                // loop up the inheritance chain to find nearest non-anonymous ancestor
                superclass = value.superclass;
                
                while (superclass && !superclass.$className) {
                    superclass = superclass.superclass;
                }
                
                if (superclass) {
                    className = superclass.$className;
                }
            }
            
            this.emitScalar(className + '#' + (value.id || (value.getId && value.getId())));
        }
        else if (jasmine.isArray(value) || typeof value == 'object') {
            value.__Jasmine_been_here_before__ = true;
            
            if (jasmine.isArray(value)) {
                this.emitArray(value);
            }
            else {
                this.emitObject(value);
            }
            
            delete value.__Jasmine_been_here_before__;
        }
        else {
            this.emitScalar(value.toString());
        }
    }
    catch (e) {}
    finally {
        this._ppNestLevel--;
    }
};

jasmine.PrettyPrinter.prototype.iterateObject = function(obj, fn, scope) {
    var property;
    
    scope = scope || this;
    
    for (property in obj) {
        if (!obj.hasOwnProperty(property) || property === '__Jasmine_been_here_before__') {
            continue;
        }
        
        fn.call(
            scope,
            property,
            obj.__lookupGetter__ ? (obj.__lookupGetter__(property) !== jasmine.undefined && 
            obj.__lookupGetter__(property) !== null) : false
        );
    }
};

jasmine.PrettyPrinter.prototype.emitArray = jasmine._unimplementedMethod;
jasmine.PrettyPrinter.prototype.emitObject = jasmine._unimplementedMethod;
jasmine.PrettyPrinter.prototype.emitScalar = jasmine._unimplementedMethod;
jasmine.PrettyPrinter.prototype.emitString = jasmine._unimplementedMethod;

jasmine.StringPrettyPrinter = function() {
    jasmine.PrettyPrinter.apply(this, arguments);
    
    this.string = '';
};

jasmine.util.inherit(jasmine.StringPrettyPrinter, jasmine.PrettyPrinter);

jasmine.StringPrettyPrinter.prototype.emitScalar = function(value) {
    this.append(value);
};

jasmine.StringPrettyPrinter.prototype.emitString = function(value) {
    this.append("'" + value + "'");
};

jasmine.StringPrettyPrinter.prototype.emitArray = function(array) {
    if (this._ppNestLevel > this._ppDepth) {
        this.append("Array");
        return;
    }
    
    this.append('[ ');
    
    for (var i = 0; i < array.length; i++) {
        if (i > 0) {
            this.append(', ');
        }
        
        this.format(array[i]);
    }
    
    this.append(' ]');
};

jasmine.StringPrettyPrinter.prototype.getIndent = function() {
    var whiteSpaces = [],
        i, len;
    
    for (i = 0, len = this.ws; i < len; i++) {
        whiteSpaces.push(' ');
    }
    
    return whiteSpaces.join('');
};

jasmine.StringPrettyPrinter.prototype.emitObject = function(obj) {
    var first = true,
        i = 0,
        indent;
    
    this.append('{\n');
    
    if (!this.ws) {
        this.ws = 0;
    }
    
    this.ws += 4;
    indent = this.getIndent();
    
    this.iterateObject(obj, function(property, isGetter) {
        if (first) {
            first = false;
        }
        else {
            this.append(',\n');
        }
        
        this.append(indent + property + ': ');
        
        if (isGetter) {
            this.append('<getter>');
        }
        else {
            if (typeof obj[property] !== "object") {
                this.format(obj[property]);   
            }
            else {
                this.append("<Object>");
            }
        }
    });
    
    this.ws -= 4;
    indent = this.getIndent();
    
    this.append(indent + '\n'+ indent + '}');
};

jasmine.StringPrettyPrinter.prototype.append = function(value) {
    this.string += value;
};

jasmine.Queue = function(env) {
    this.env = env;
    this.blocks = [];
    
    this.reset();
};

jasmine.Queue.prototype.reset = function() {
    this.blocks.length = 0;
    this.running = false;
    this.index = 0;
    this.offset = 0;
    this.abort = false;
};

jasmine.Queue.prototype.add = function(block, ensure) {
    if (ensure) {
        block.ensured = ensure;
    }
    
    this.blocks.push(block);
};

jasmine.Queue.prototype.remove = function(block) {
    jasmine.array.remove(this.blocks, block);
};

jasmine.Queue.prototype.insertNext = function(block, ensure) {
    block.ensured = !!ensure;
    this.blocks.splice((this.index + this.offset + 1), 0, block);
    this.offset++;
};

jasmine.Queue.prototype.start = function(onComplete) {
    this.running = true;
    this.onComplete = onComplete;
    this._next();
};

jasmine.Queue.prototype.stop = function() {
    this.abort = true;
};

jasmine.Queue.prototype.isRunning = function() {
    return this.running;
};

(function() {
var setTimeout = jasmine._setTimeout,
    clearTimeout = jasmine._clearTimeout;

jasmine.Queue.prototype._next = function() {
    var me = this,
        goAgain, calledSynchronously, completedSynchronously, onComplete, now;
    
    goAgain = true;

    while (goAgain) {
        goAgain = false;
        me.env.activeQueue = me;
        
        if (me.index < me.blocks.length) {
            calledSynchronously = true;
            completedSynchronously = false;

            onComplete = function() {
                if (calledSynchronously) {
                    completedSynchronously = true;
                    return;
                }

                if (me.blocks[me.index].abort || jasmine.ABORT_ALL_QUEUES) {
                    me.abort = true;
                }

                me.offset = 0;
                me.index++;

                now = jasmine.util.now();
                
                if (me.env.updateInterval && now - me.env.lastUpdate > me.env.updateInterval) {
                    me.env.lastUpdate = now;
                    
                    setTimeout(function() {
                        me._next();
                    }, 0);
                }
                else {
                    if (completedSynchronously) {
                        goAgain = true;
                    }
                    else {
                        me._next();
                    }
                }
            };

            // Can't use closed-over variable for block because reentrancy
            if (!me.abort || me.blocks[me.index].ensured) {
                me.blocks[me.index].execute(onComplete);
            }
            else {
                onComplete();
            }

            calledSynchronously = false;
            
            if (completedSynchronously) {
                onComplete();
            }
        }
        else {
            me.running = false;
            
            // Assignment is intentional, this is to unbind the Queue instance
            // from onComplete scope.
            if (onComplete = me.onComplete) {
                onComplete();
            }
        }
    }
};
})();

jasmine.Queue.prototype.kick = function(exception) {
    var block = this.running && this.blocks[this.index];
    
    if (block) {
        // This will clear any pending timers for the block, fail its spec and move along
        block.stop(exception);
    }
    else {
        throw new Error("Whoa! What is going on here?!");
    }
};

/**
 * Runner is a thin wrapper around root suite object with additional filtering
 * and reporting capabilities. It is kept mostly for backward API compatibility.
 *
 * @constructor
 * @param {jasmine.Env} env
 */
jasmine.Runner = function(env) {
    var rootSuite = new jasmine.Suite(env, 'Root', jasmine.emptyFn);
    
    rootSuite.id = 0;
    rootSuite.level = 0;
    rootSuite.isRootSuite = true;
    
    this.env = env;
    this.rootSuite = rootSuite;
};

jasmine.Runner.prototype.execute = function(done) {
    var me = this,
        env = me.env,
        reporter = env.reporter,
        setTimeout = jasmine._setTimeout,
        clearTimeout = jasmine._clearTimeout,
        watchdogTimeout = jasmine.DEFAULT_WATCHDOG_INTERVAL,
        watchdogFn;
    
    env.totalSpecs = env.remainingSpecs = me.rootSuite.totalSpecs;
    
    reporter.reportRunnerStarting(me);
    
    // TODO Why do we keep all the stuff in the Env instance? Refactor this mess.
    env.lastUpdate = jasmine.util.now();
    
    watchdogFn = function() {
        env.watchdogTimer = setTimeout(watchdogFn, watchdogTimeout);
        
        if ((jasmine.util.now() - env.lastUpdate) > watchdogTimeout) {
            env.activeQueue.kick({
                name: 'timeout',
                message: 'Execution aborted after ' + watchdogTimeout + ' milliseconds'
            });
        }
    };
    
    env.watchdogTimer = setTimeout(watchdogFn, watchdogTimeout);
    
    me.rootSuite.execute(function() {
        clearTimeout(env.watchdogTimer);
        
        reporter.reportRunnerResults(me);
        
        if (done) {
            done();
        }
    });
};

jasmine.Runner.prototype.suites = function() {
    return this.rootSuite.suites();
};

jasmine.Runner.prototype.results = function() {
    return this.rootSuite.results();
};

jasmine.Runner.prototype._convergeIds = function(testIds, oldSpecIds) {
    var result = {},
        key, value, id;
    
    // convert [1, 2] into { 1: true, 2: true }
    if (typeof testIds.length === 'number') {
        result = jasmine.array.toMap(testIds);
    }
    
    // Test runner may pass string names instead of ids for top level suites
    for (key in testIds) {
        value = testIds[key];
        id = typeof value === 'number' ? value : jasmine.util.hashString(value);
        
        result[id] = id;
    }
    
    // Old API support for backwards compatibility
    if (oldSpecIds) {
        if (typeof oldSpecIds.length === 'number') {
            oldSpecIds = jasmine.array.toMap(oldSpecIds);
        }
        
        for (id in oldSpecIds) {
            if (oldSpecIds.hasOwnProperty(id)) {
                result[id] = oldSpecIds[id];
            }
        }
    }
    
    return result;
};

jasmine.Runner.prototype.filter = function(testIds, oldSpecIds) {
    testIds = this._convergeIds(testIds, oldSpecIds);
    
    if (!jasmine.util.isObjectEmpty(testIds)) {
        this.rootSuite.filter(testIds);
        
        // If testIds were provided, that was because the dev wanted to run only
        // the specs or suites specified. If these can't be found, most probably
        // that means there was a typo in a spec name, or recent changes to the
        // test code changed the hash and it's no longer valid. Either way that
        // is something that happens only when debugging and is going to be
        // corrected soon. So instead of defaulting to run the whole nine yards,
        // just bail out.
        if (this.rootSuite.empty) {
            this.errorNoTestsFound = true;
        }
    }
    
    return this;
};

/**
 * To Do block.
 */
jasmine.ToDo = function(env, condition, description) {
    this.env = env;
    this.condition = condition;
    this.description = description;
    
    this.resolved = typeof condition === 'boolean';
};

jasmine.ToDo.prototype.describe = function(desc, specFunc) {
    // If ToDo is already resolved with condition being `false`
    // we treat it as if there is no ToDo at all, so we only
    // inject special logic in the spec when either condition
    // is *not* resolved yet (being a function to call), or
    // when condition is already resolved and is true.
    if (!this.resolved || this.condition) {
        specFunc.ToDo = this;
    }
    
    return this.env.describe(desc, specFunc);
};

jasmine.ToDo.prototype.xdescribe = function(desc, specFunc) {
    specFunc.enabled = false;
    
    return this.env.describe(desc, specFunc);
};

jasmine.ToDo.prototype.it = function(desc, func, options) {
    var spec = this.env.it(desc, func, options);
    
    // See above
    if (!this.resolved || this.condition) {
        spec.ToDo = this;
    }
    
    return spec;
};

jasmine.ToDo.prototype.xit = function(desc, func, options) {
    var spec = this.env.it(desc, func, options);
    
    spec.disable();
    
    return spec;
};

jasmine.ToDo.prototype.topSuite = function() {
    var i, len;
    
    for (i = 0, len = arguments.length; i < len; i++) {
        if (typeof arguments[i] === 'function') {
            arguments[i].ToDo = this;
        }
    }
    
    return this.env.topSuite.apply(this.env, arguments);
};

jasmine.ToDo.prototype.resolve = function() {
    if (!this.resolved) {
        this.condition = !!this.condition();
        this.resolved = true;
    }
    
    return this.condition;
};

jasmine.ToDo.prototype.getDescription = function() {
    return 'TODO' + (this.description ? ': ' + this.description : '');
};

/**
 * Internal representation of a Jasmine suite.
 *
 * @constructor
 * @param {jasmine.Env} env
 * @param {String} description
 * @param {Function} specDefinitions
 * @param {jasmine.Suite} parentSuite
 */
jasmine.Suite = function(env, description, specDefinitions, parentSuite, ignoreDuplicates) {
    this.description = description;
    this.queue = new jasmine.Queue(env);
    this.parentSuite = parentSuite;
    this.env = env;
    
    this._beforeAll = [];
    this._beforeEach = [];
    this._afterEach = [];
    this._afterAll = [];
    this._children = [];
    this._suites = [];
    this._specs = [];
    
    this.totalSpecs = 0;
    this.fileName = jasmine.getCurrentScript();
    
    if (parentSuite && !parentSuite.isRootSuite) {
        this.fullName = parentSuite.fullName + jasmine.FULL_NAME_DELIMITER + description;
        this.level = parentSuite.level + 1;
    }
    else {
        this.fullName = description;
        this.level = 1;
        this.isTopSuite = true;
    }
    
    if (env.checkName(this.fullName) && !ignoreDuplicates) {
        throw 'Duplicate suite name found: "' + this.fullName + '"';
    }
    
    this.enabled = true;
    
    for (var prop in specDefinitions) {
        if (specDefinitions.hasOwnProperty(prop)) {
            this[prop] = specDefinitions[prop];
        }
    }
};

jasmine.Suite.prototype.isSuite = true;

jasmine.Suite.prototype.isEnabled = function() {
    return this.enabled;
};

jasmine.Suite.prototype.isDisabled = function() {
    return !this.enabled;
};

jasmine.Suite.prototype.disable = function() {
    this.enabled = false;
    
    return this;
};

jasmine.Suite.prototype.enable = function() {
    this.enabled = true;
    
    return this;
};

jasmine.Suite.prototype.disableChildren = function() {
    var children = this.children(),
        i, len;
    
    for (i = 0, len = children.length; i < len; i++) {
        children[i].disable();
    }
    
    return this;
};

jasmine.Suite.prototype.getFullName = function(printable) {
    var name;
    
    if (printable) {
        name = this.printableFullName;
        
        if (!name) {
            this.printableFullName = name =
                (this.fullName || '').replace(jasmine.FULL_NAME_DELIMITER_RE, ' ');
        }
    }
    else {
        name = this.fullName;
    }
    
    return name;
};

jasmine.Suite.prototype.getId = function() {
    var id = this.id;
    
    if (id === undefined) {
        this.id = id = jasmine.util.hashString(this.fullName, this.parentSuite.getId());
    }
    
    return id;
};

jasmine.Suite.prototype.it = function(description, func, options) {
    var env = this.env,
        spec, timeout;
    
    spec = new jasmine.Spec(env, this, description);
    
    if (options && options.totalSpecs != null) {
        spec.totalSpecs = options.totalSpecs;
    }
    
    if (options && options.toStart) {
        this.addToStart(spec);
    }
    else {
        this.add(spec);
    }
    
    env.currentSpec = spec;
    
    if (func) {
        func.typeName = 'it';
        
        // Support for legacy third argument
        if (typeof options === 'number') {
            timeout = options;
        }
        else if (typeof options === 'object') {
            timeout = options.timeout;
            delete options.timeout;
            
            jasmine.apply(func, options);
        }
        
        // Timeout is applied to the block NOT to the func. It's historical.
        spec.runs(func, timeout);
    }
    
    env.currentSpec = null;
    env.reporter.reportSpecAdded(spec);
    
    return spec;
};

// TODO Eliminate this code duplication
jasmine.Suite.prototype.runs = function(func, timeout, ensure) {
    var block = new jasmine.Block(this.env, func, this);
    
    if (timeout != null) {
        block.timeout = parseInt(timeout);
    }
    
    this.addToQueue(block, ensure);
    
    return this;
};

jasmine.Suite.prototype.addToQueue = function(block, ensure) {
    var queue = this.queue;
    
    if (queue.isRunning()) {
        queue.insertNext(block, ensure);
    }
    else {
        queue.add(block, ensure);
    }
};

jasmine.Suite.prototype.waits = function(timeout) {
    var waitsFunc = new jasmine.WaitsBlock(this.env, timeout, this);
    
    this.addToQueue(waitsFunc);
    
    return this;
};

jasmine.Suite.prototype.waitsFor = function() {
    var _latchFunction = null;
    var _timeoutMessage = null;
    var _timeout = null;
    var _timeout_increment = null;
    var numberFound = false;
    
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        
        switch (typeof arg) {
            case 'function':
                _latchFunction = arg;
                break;
            
            case 'string':
                _timeoutMessage = arg;
                break;
            
            case 'number':
                // SECOND number is the increment
                if (numberFound) {
                    _timeout_increment = arg;
                }
                // FIRST number is the timeout
                else {
                    _timeout = arg;
                    numberFound = true;
                }
                
                break;
        }
    }
    
    var waitsForFunc = new jasmine.WaitsForBlock(
        this.env,
        _timeout,
        _latchFunction,
        _timeoutMessage,
        _timeout_increment,
        this
    );
    
    this.addToQueue(waitsForFunc);
    
    return this;
};

jasmine.Suite.prototype.beforeEach = function(beforeEachFunction) {
    // We can't create blocks here because a block is bound to its spec,
    // and beforeEach() is called in a suite context.
    beforeEachFunction.typeName = 'beforeEach';
    this._beforeEach.push(beforeEachFunction);
    this._beforeCache = null;
};

jasmine.Suite.prototype.getBefores = function() {
    var parent = this.parentSuite,
        parentBefores;
    
    if (this._beforeCache) {
        return this._beforeCache;
    }
    
    parentBefores = parent ? parent.getBefores() : [];
    
    return this._beforeCache = [].concat(parentBefores, this._beforeEach);
};

jasmine.Suite.prototype.afterEach = function(afterEachFunction) {
    // Same as beforeEach
    afterEachFunction.typeName = 'afterEach';
    this._afterEach.push(afterEachFunction);
    this._afterCache = null;
};

jasmine.Suite.prototype.getAfters = function() {
    var parent = this.parentSuite,
        parentAfters;
    
    if (this._afterCache) {
        return this._afterCache;
    }
    
    parentAfters = parent ? parent.getAfters() : [];
    
    return this._afterCache = [].concat(this._afterEach, parentAfters);
};

jasmine.Suite.prototype.beforeAll = function(beforeAllFunction) {
    beforeAllFunction.typeName = 'beforeAll';
    
    // beforeAll block runs in the suite scope so we can create it upfront
    var block = new jasmine.Block(this.env, beforeAllFunction, this);
    
    this._beforeAll.push(block);
};

jasmine.Suite.prototype.afterAll = function(afterAllFunction) {
    afterAllFunction.typeName = 'afterAll';
    
    // Ditto
    var block = new jasmine.Block(this.env, afterAllFunction, this);
    
    this._afterAll.push(block);
};

jasmine.Suite.prototype.add = function(test) {
    this._children.push(test);
    
    if (test.isSuite) {
        this._suites.push(test);
    }
    else {
        this._specs.push(test);
    }
    
    this.adjustCounts(test.totalSpecs);
};

jasmine.Suite.prototype.addToStart = function(test) {
    this._children.unshift(test);
    
    if (test.isSuite) {
        this._suites.unshift(test);
    }
    else {
        this._specs.unshift(test);
    }
    
    this.adjustCounts(test.totalSpecs);
};

jasmine.Suite.prototype.remove = function(suiteOrSpec) {
    jasmine.array.remove(this._children, suiteOrSpec);
    
    if (suiteOrSpec.isSuite) {
        jasmine.array.remove(this._suites, suiteOrSpec);
    }
    else {
        jasmine.array.remove(this._specs, suiteOrSpec);
    }
    
    this.adjustCounts(-suiteOrSpec.totalSpecs);
};

jasmine.Suite.prototype.removeAll = function() {
    this.adjustCounts(-this.totalSpecs);
    
    this._beforeEach.length = 0;
    this._afterEach.length = 0;
    this._beforeAll.length = 0;
    this._afterAll.length = 0;
    this._children.length = 0;
    this._suites.length = 0;
    this._specs.length = 0;
    
    this.queue.reset();
};

jasmine.Suite.prototype.specs = function() {
    return this._specs;
};

jasmine.Suite.prototype.suites = function() {
    return this._suites;
};

jasmine.Suite.prototype.children = function() {
    return this._children;
};

jasmine.Suite.prototype.execute = function(onComplete) {
    var env = this.env,
        queue = this.queue,
        children = this._children,
        beforeAll = this._beforeAll,
        afterAll = this._afterAll,
        todo = this.ToDo,
        haveBeforeAll = beforeAll.length > 0,
        child, i, len;
    
    if (!this.isRootSuite) {
        this.env.reporter.reportSuiteStarting(this);
    }
    
    if (!this.enabled) {
        this.disableChildren();
    }
    else if (todo) {
        this.invertResults = todo.resolve();
        this.ToDo = null;
        
        if (!this.invertResults) {
            todo = null;
        }
    }
    
    if (haveBeforeAll) {
        for (i = 0, len = beforeAll.length; i < len; i++) {
            queue.add(beforeAll[i]);
        }
        
        // beforeAll is supposed to allocate some resources that are going to be available
        // for any specs in the same suite and child suites. Therefore we need to account
        // for those resources as not being leaked when we run leak checks after each spec.
        child = new jasmine.Block(env, function() {
            env.pushResources();
            env.enumerateResources(false, this.isRootSuite ? true : this.getId());
        }, this);
        
        queue.add(child);
    }
    
    if (this.shuffle != null ? this.shuffle : jasmine.SHUFFLE) {
        children = jasmine.array.shuffle(children);
    }
    
    for (i = 0, len = children.length; i < len; i++) {
        child = children[i];
        
        if (todo && !child.ToDo) {
            child.forcedResult = true;
        }
        
        queue.add(children[i]);
    }
    
    if (this.invertResults) {
        child = this.todoSpec = new jasmine.Spec(env, this, 'is To Do');
        child.skipBeforesAndAfters = true;
        child.totalSpecs = 0;
        
        child.runs(function() {
            expect(this.suite).toHaveFailed(this.suite.todoDesc);
        });
        
        // This block should run regardless
        queue.add(child, true);
    }
    
    // If there were any beforeAll blocks we need to revert resource accounting stack
    // to where it was before this suite started, as well as check if everything was
    // cleaned up properly. It is not our responsibility to clean up, just to check.
    if (haveBeforeAll) {
        child = new jasmine.Block(env, env.popResources.bind(env), this);
        
        queue.add(child, true);
    }
    
    for (i = 0, len = afterAll.length; i < len; i++) {
        // afterAll blocks are ensured
        queue.add(afterAll[i], true);
    }
    
    if (haveBeforeAll) {
        // We make this a Spec insted of plain Block so that it could fail.
        // However its *only* function is to pass or fail, and we don't want
        // this Spec to do anything else, including running beforeEach/afterEach
        // functions and/or counting as a spec in the totals.
        child = new jasmine.Spec(env, this, 'should clean up resources allocated in beforeAll');
        child.skipBeforesAndAfters = true;
        child.totalSpecs = 0;
        
        this.add(child);
        queue.add(child, true);
    }
    
    env.startSuite(this);
    
    var me = this;
    
    queue.start(function() {
        me.finish(onComplete);
    });
};

jasmine.Suite.prototype.finish = function(onComplete) {
    var me = this,
        results;
    
    // Walk child results once and cache
    results = me.results(true);
    
    if (me.forcedResult != null) {
        results.forcedResult = me.forcedResult;
    }
    else if (me.invertResults) {
        if (!results._passed()) {
            results.forcedResult = true;
        }
    }
    
    if (!me.isRootSuite) {
        me.env.reporter.reportSuiteResults(me);
    }
    
    
    me.finished = true;
    me.env.finishSuite(me);
    
    // MUST NOT null the _children property because it is needed
    // to traverse the suite's child nodes upon expand and collapse
    // in local runner; also when collecting results. Since child
    // suites and specs are kept in _children array, clearing _specs
    // and _suites doesn't make much sense either.
    me._beforeEach = me._beforeCache = me._afterEach = me._afterCache = me.queue = null;
    me._beforeAll = me._afterAll = me.todoSpec = null;
    
    if (onComplete) {
        // This is to allow call stack to unwind and let previous suites finish
        // before advancing the queue. We only do this for top level suites
        // to avoid the performance penalty.
        if (me.isTopSuite) {
            var fireEmUp = jasmine._setImmediate || jasmine._setTimeout;
            
            fireEmUp(onComplete, 0);
        }
        else {
            onComplete();
        }
    }
};

jasmine.Suite.prototype.fail = function(args, typeName) {
    // We only store the first error message because whenever there is one
    // we abort the queue immediately. However afterEach and afterAll blocks
    // are ensured and will run even after queue abort, and it is very possible
    // that some of these will throw exceptions too. Since these potential errors
    // most probably will be caused by the first one, it's no use to store them.
    if (!this._error) {
        this._error = new jasmine.ErrorResult(args);
        this._error.typeName = typeName;
    }
    
    this.queue.stop();
};

jasmine.Suite.prototype.adjustCounts = function(amount) {
    // This *should* adjust root suite counters, too!
    if (amount > 0) {
        for (var suite = this; suite; suite = suite.parentSuite) {
            suite.totalSpecs += amount;
        }
    }
};

jasmine.Suite.prototype.results = function(cacheResults) {
    var children = this._children,
        error = this._error,
        results = this._results,
        todoSpec = this.todoSpec,
        results, invert, i, len;
    
    if (results) {
        return results;
    }
    
    results = new jasmine.NestedResults();
    results.description = this.description;
    
    if (error && error.typeName === 'beforeAll') {
        results.addResult(error);
    }
    
    for (i = 0, len = children.length; i < len; i++) {
        results.addResult(children[i].results());
    }
    
    if (error && error.typeName !== 'beforeAll') {
        results.addResult(error);
    }
    
    if (todoSpec) {
        results.addResult(todoSpec.results());
    }
    
    if (!this.enabled) {
        results.skipped = true;
    }
    
    if (cacheResults) {
        this._results = results;
    }
    
    return results;
};

jasmine.Suite.prototype.filter = function(testIds) {
    var toRemove = [],
        specs, suites, spec, suite, i, len;
    
    if (!testIds[this.getId()]) {
        suites = this.suites();
        specs = this.specs();
        
        for (i = 0, len = specs.length; i < len; i++) {
            spec = specs[i];
            
            if (!testIds[spec.getId()]) {
                toRemove.push(spec);
            }
        }
        
        for (i = 0, len = suites.length; i < len; i++) {
            suite = suites[i];
            
            suite.filter(testIds);
            
            if (suite.empty) {
                toRemove.push(suite);
            }
        }
        
        // Filtering out entire suite happens quite often so we optimize for that
        if ((suites.length + specs.length) === toRemove.length) {
            this.removeAll();
            this.empty = true;
        }
        else {
            for (i = 0, len = toRemove.length; i < len; i++) {
                this.remove(toRemove[i]);
            }
            
            this.filtered = true;
        }
    }
    
    return this;
};

jasmine.Suite.prototype.getParentSuite = function() {
    return this.parentSuite;
};

jasmine.Suite.prototype.getTopSuite = function() {
    var suite = this;

    while (suite.parentSuite && !suite.parentSuite.isRootSuite) {
        suite = suite.parentSuite;
    }

    return suite;
};

/**
 * Internal representation of a Jasmine specification, or test.
 *
 * @constructor
 * @param {jasmine.Env} env
 * @param {jasmine.Suite} suite
 * @param {String} description
 */
jasmine.Spec = function(env, suite, description) {
    if (!env) {
        throw new Error('jasmine.Env() required');
    }
    
    if (!suite) {
        throw new Error('jasmine.Suite() required');
    }
    
    this.env = env;
    this.suite = suite;
    this.description = description;
    this.queue = new jasmine.Queue(env);
    
    this._spies = [];
    
    this._results = new jasmine.NestedResults();
    this._results.description = description;
    this._results.isSpecResults = true;
    
    this.matchersClass = null;
    
    this.fileName = jasmine.getCurrentScript();
    
    // The dot at the end is added to prevent the possibility of collisions
    // with similar suite names, like this: "foo bar" -> "foo bar."
    this.fullName = this.suite.fullName + jasmine.FULL_NAME_DELIMITER + this.description + '.';
    
    if (env.checkName(this.fullName)) {
        throw 'Duplicate spec name found: "' + this.fullName + '"';
    }
    
    this.totalSpecs = 1;
    
    this.enabled = true;
};

jasmine.Spec.prototype.isSpec = true;

jasmine.Spec.prototype.getFullName = function(printable) {
    var name = this.fullName;
    
    return printable ? (name || '').replace(jasmine.FULL_NAME_DELIMITER_RE, ' ') : name;
};

jasmine.Spec.prototype.getId = function() {
    var id = this.id;
    
    if (id === undefined) {
        this.id = id = jasmine.util.hashString(this.fullName, this.suite.getId());
    }
    
    return id;
};

jasmine.Spec.prototype.results = function() {
    return this._results;
};

/**
 * All parameters are pretty-printed and concatenated together, then written to the spec's output.
 *
 * Be careful not to leave calls to <code>jasmine.log</code> in production code.
 */
jasmine.Spec.prototype.log = function() {
    return this._results.log(arguments);
};

jasmine.Spec.prototype.runs = function(func, timeout, ensure) {
    var block = new jasmine.Block(this.env, func, this);
    
    if (timeout != null) {
        block.timeout = parseInt(timeout);
    }
    
    this.addToQueue(block, ensure);
    
    return this;
};

jasmine.Spec.prototype.addToQueue = function(block, ensure) {
    var queue = this.queue;
    
    if (queue.isRunning()) {
        queue.insertNext(block, ensure);
    }
    else {
        queue.add(block, ensure);
    }
};

/**
 * @param {jasmine.ExpectationResult} result
 */
jasmine.Spec.prototype.addMatcherResult = function(result) {
    this._results.addResult(result);
};

jasmine.Spec.prototype.expect = function(actual) {
    var MatchersClass = this._getMatchersClass();
    
    var positive = new MatchersClass(this.env, actual, this);
    positive.not = new MatchersClass(this.env, actual, this, true);
    
    return positive;
};

/**
 * Waits a fixed time period before moving to the next block.
 *
 * @deprecated Use waitsFor() instead
 * @param {Number} timeout milliseconds to wait
 */
jasmine.Spec.prototype.waits = function(timeout) {
    var waitsFunc = new jasmine.WaitsBlock(this.env, timeout, this);
    
    this.addToQueue(waitsFunc);
    
    return this;
};

/**
 * Waits for the latchFunction to return true before proceeding to the next block.
 *
 * @param {Function} latchFunction Function to execute
 * @param {String} [timeoutMessage] Message to use if the condition is never met
 * @param {Number} [timeout] Time to wait for condition to be met.
 * @param {Number} [timeout_increment] Number of milliseconds to wait between invocations.
 */
jasmine.Spec.prototype.waitsFor = function() {
    var _latchFunction = null;
    var _timeoutMessage = null;
    var _timeout = null;
    var _timeout_increment = null;
    var numberFound = false;
    
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        
        switch (typeof arg) {
            case 'function':
                _latchFunction = arg;
                break;
            
            case 'string':
                _timeoutMessage = arg;
                break;
            
            case 'number':
                // SECOND number is the increment
                if (numberFound) {
                    _timeout_increment = arg;
                }
                // FIRST number is the timeout
                else {
                    _timeout = arg;
                    numberFound = true;
                }
                
                break;
        }
    }
    
    var waitsForFunc = new jasmine.WaitsForBlock(
        this.env,
        _timeout,
        _latchFunction,
        _timeoutMessage,
        _timeout_increment,
        this
    );
    
    this.addToQueue(waitsForFunc);
    
    return this;
};

jasmine.Spec.prototype.fail = function(e) {
    var params = {
        keepPassed: this.env.keepPassedResults,
        passed: false,
        message: e ? jasmine.util.formatException(e) : 'Exception'
    };

    if (e instanceof Error) {
        params.error = e;
        params.trace = {
            stack: e.stack
        };
    }
    else if (e && e.stack) {
        params.message += '\n' + e.stack;
    }
    
    var expectationResult = new jasmine.ExpectationResult(params);
    
    this._results.addResult(expectationResult);
};

jasmine.Spec.prototype._getMatchersClass = function() {
    return this.matchersClass || this.env.matchersClass;
};

jasmine.Spec.prototype.addMatchers = function(matchersPrototype) {
    var parent = this._getMatchersClass();
    
    var newMatchersClass = function() {
        parent.apply(this, arguments);
    };
    
    jasmine.util.inherit(newMatchersClass, parent);
    jasmine.Matchers._wrapInto(matchersPrototype, newMatchersClass);
    
    this.matchersClass = newMatchersClass;
};

jasmine.Spec.prototype.execute = function(onComplete) {
    var spec = this,
        todo;

    spec.env.reporter.reportSpecStarting(spec);
    
    if (!spec.env.specFilter(spec) || spec.isDisabled()) {
        spec._results.skipped = true;
        spec.finish(onComplete);
        
        return;
    }
    
    if (todo = spec.ToDo) {
        spec.invertResults = todo.resolve();
        
        if (spec.invertResults) {
            spec.todoDescription = todo.getDescription();
        }
        
        // We don'need this anymore
        spec.ToDo = null;
    }
    
    spec.env.currentSpec = spec;
    
    if (!spec.skipBeforesAndAfters) {
        spec.addBeforesAndAftersToQueue();
    }
    
    if (spec.debugBlocks && jasmine.getOptions().debug === true) {
        var blockIdx = jasmine.getOptions().block;
        
        if (typeof blockIdx !== 'undefined') {
            blockIdx = parseInt(blockIdx);
            
            var blocks = this.queue.blocks,
                block, i, len;
            
            for (i = 0, len = blocks.length; i < len; i++) {
                block = blocks[i];
                
                if (i === blockIdx) {
                    block.func = jasmine.generateDebuggableBlock(block.func);
                }
            }
        }
        
        jasmine.showDebugPrompt(function() {
            spec.queue.start(function() {
                spec.finish(onComplete);
            });
        });
    }
    else {
        spec.queue.start(function() {
            spec.finish(onComplete);
        });
    }
};

jasmine.Spec.prototype.addBeforesAndAftersToQueue = function() {
    var queue = this.queue,
        suite = this.suite,
        env = this.env,
        blocks = [],
        befores, afters, block, i, len;
    
    befores = suite.getBefores();
    
    // Befores and afters are arrays of functions, we need to create blocks for them.
    // We also must not mutate the original arrays on the suite, because they're cached
    // and reused between different specs.
    for (i = 0, len = befores.length; i < len; i++) {
        block = new jasmine.Block(env, befores[i], this);
        
        // Note that we don't call queue.addBefore here because it would unshift
        // the block to the head of the queue; we have the before and after arrays
        // in the order we want them here so just push on.
        blocks.push(block);
    }
    
    for (i = 0, len = queue.blocks.length; i < len; i++) {
        blocks.push(queue.blocks[i]);
    }
    
    afters = suite.getAfters();
    
    for (i = 0, len = afters.length; i < len; i++) {
        block = new jasmine.Block(env, afters[i], this);
        block.ensured = true;
        
        // Ditto with after functions; we have them in proper order already.
        blocks.push(block);
    }
    
    queue.blocks = blocks;
};

jasmine.Spec.prototype.finish = function(onComplete) {
    this.removeAllSpies();
    
    // We run resource checks *before* reporting, so that if anything leaked
    // the spec would have a chance to fail
    if (jasmine.CHECK_LEAKS) {
        this.env.checkResourceLeaks(this);
    }

    if (this.forcedResult != null) {
        this._results.forcedResult = this.forcedResult;
    }
    else if (this.invertResults) {
        if (this._results.passed()) {
            expect(this).toHaveFailed(this.todoDescription);
        }
        else {
            this._results.forcedResult = true;
        }
    }

    this.finished = true;
    this._spies = this.matchersClass = this.queue = null;

    this.env.reporter.reportSpecResults(this);
    
    this.env.currentSpec = null;
    
    if (onComplete) {
        onComplete();
    }
};

jasmine.Spec.prototype.explodes = function() {
    throw 'explodes function should not have been called';
};

jasmine.Spec.prototype.spyOn = function(obj, methodName, ignoreMethodDoesntExist) {
    var className = obj.$className;

    if (obj == jasmine.undefined) {
        throw "spyOn could not find an object to spy upon for " + methodName + "()";
    }
    
    if (!ignoreMethodDoesntExist && obj[methodName] === jasmine.undefined) {
        throw methodName + '() method does not exist';
    }
    
    if (!ignoreMethodDoesntExist && obj[methodName] && obj[methodName].isSpy) {
        throw new Error(methodName + ' has already been spied upon');
    }
    
    var spyObj = jasmine.createSpy(methodName);
    
    this._spies.push(spyObj);
    
    spyObj.baseObj = obj;
    spyObj.methodName = methodName;
    spyObj.originalValue = obj[methodName];
    
    // If we are spying on a prototype property of an instance, we must
    // set up to delete the property
    if (className) {
        if (obj !== Ext.ClassManager.get(className).prototype) {
            spyObj.wasPrototypeValue = !obj.hasOwnProperty(methodName);
        }
    }
    obj[methodName] = spyObj;
    
    return spyObj;
};

jasmine.Spec.prototype.removeAllSpies = function() {
    var spies = this._spies,
        spy, i, len;
        
    for (i = 0, len = spies.length; i < len; i++) {
        spy = spies[i];

        // If we injected an instance value, overrideing what was a prototype method
        // we must delete the property
        if (spy.wasPrototypeValue) {
            delete spy.baseObj[spy.methodName];
        } else {
            spy.baseObj[spy.methodName] = spy.originalValue;
        }
    }
    
    this._spies.length = 0;
};

jasmine.Spec.prototype.isEnabled = function() {
    return this.enabled;
};

jasmine.Spec.prototype.isDisabled = function() {
    return !this.enabled;
};

jasmine.Spec.prototype.disable = function() {
    this.enabled = false;
    
    // Release bound contexts and closures
    this.queue = null;

    return this;
};

jasmine.Spec.prototype.enable = function() {
    this.enabled = true;

    return this;
};

jasmine.Spec.prototype.getParentSuite = function() {
    return this.suite;
};

jasmine.Spec.prototype.getTopSuite = function() {
    return this.suite.getTopSuite();
};

/**
 * Blocks are functions with executable code that make up a spec.
 *
 * @constructor
 * @param {jasmine.Env} env
 * @param {Function} func
 * @param {jasmine.Spec} spec
 */
jasmine.Block = function(env, func, spec) {
    this.env = env;
    this.func = func;
    this.spec = spec;
};

(function() {
// We *have* to assign setTimeout and clearTimeout to separate variables,
// otherwise browsers would freak out. Differently.
var setTimeout = jasmine._setTimeout,
    clearTimeout = jasmine._clearTimeout;

jasmine.Block.prototype.execute = function(onComplete) {
    var me = this,
        spec = me.spec,
        func = me.func,
        wantCallback = func.length > 0,
        disableTryCatch, timeout, done;
    
    // We store onComplete on the block itself in case it times out.
    // If that happens Runner's watchdog timer will expire and Runner
    // will kick the queue to move along. We will need onComplete then.
    me.onComplete = onComplete;
    
    // A block can be created in numerous ways, and the property may or may not be set.
    // We can't assume that it will be always properly configured so have to fall back
    // to the global variables at run time.
    disableTryCatch = func.disableTryCatch != null ? func.disableTryCatch : !jasmine.CATCH_EXCEPTIONS;
    
    if (this.timeout != null) {
        this.timeoutId = setTimeout(function() {
            me.stop();
        }, this.timeout);
    }
    
    // We pass this callback to the block fn so that it could finish block execution
    // immediately after doing its thing, if the block is aware of that.
    // If it's not then we're going to do the cleanup automatically.
    if (wantCallback) {
        done = function() {
            done = null;
            
            me.finish();
        };
    }

    if (disableTryCatch) {
        func.call(spec, done);
        
        if (!wantCallback) {
            me.finish();
        }
    }
    else {
        try {
            func.call(spec, done);
        }
        catch (e) {
            if (jasmine.DEBUG_ON_ERROR) {
                // The function below contains only one debugger statement and nothing else.
                // This is because some browsers have trouble optimizing functions with
                // debugger statements even if conditional. We can't afford Block.execute
                // not to be optimized.
                jasmine.debuggerStatement(e);
            }
            
            spec.fail(e, func.typeName);
        }
        finally {
            if (!wantCallback) {
                me.finish();
            }
        }
    }
};

jasmine.Block.prototype.finish = function() {
    var onComplete = this.onComplete;
    
    this.onComplete = null;
    delete this.onComplete;
    
    if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        delete this.timeoutId;
    }
    
    this.finished = true;
    
    // Could have been nulled already, if this kicks in from watchdogFn
    if (onComplete) {
        if (this.asyncOnComplete) {
            setTimeout(onComplete, 0);
        }
        else {
            onComplete();
        }
    }
};

// DO NOT CALL THIS METHOD `abort`! It will conflict with the boolean of the same name!
jasmine.Block.prototype.stop = function(exception) {
    var spec = this.spec,
        func = this.func,
        timeout;
    
    if (spec) {
        spec.fail(exception || {
            name: 'timeout',
            message: this.message || 
                ('Spec execution timed out after ' + 
                 (this.timeout != null ? this.timeout : jasmine.DEFAULT_WATCHDOG_INTERVAL) +
                 ' milliseconds')
        }, func ? func.typeName : null);
    }
    
    this.abort = true;
    
    this.finish();
};
})();

jasmine.WaitsBlock = function(env, timeout, spec) {
    this.timeout = timeout;
    jasmine.Block.call(this, env, null, spec);
};

jasmine.util.inherit(jasmine.WaitsBlock, jasmine.Block);

(function() {
var setTimeout = jasmine._setTimeout;

jasmine.WaitsBlock.prototype.execute = function(onComplete) {
    var me = this;
    
    me.onComplete = onComplete;
    
    me.timeoutId = setTimeout(function() {
        me.finish();
    }, me.timeout);
};
})();

/**
 * A block which waits for some condition to become true, with timeout.
 *
 * @constructor
 * @extends jasmine.Block
 * @param {jasmine.Env} env The Jasmine environment.
 * @param {Number} timeout The maximum time in milliseconds to wait for the condition to become true.
 * @param {Function} latchFunction A function which returns true when the desired condition has been met.
 * @param {String} message The message to display if the desired condition hasn't been met within the given time period.
 * @param {NUmber} timeout_increment Time in milliseconds to wait between invocations.
 * @param {jasmine.Spec} spec The Jasmine spec.
 */
jasmine.WaitsForBlock = function(env, timeout, latchFunction, message, timeout_increment, spec) {
    jasmine.Block.call(this, env, null, spec);
    
    this.timeout = timeout != null ? timeout : env.defaultTimeoutInterval;
    this.latchFunction = latchFunction;
    this.message = message;
    this.totalTimeSpentWaitingForLatch = 0;
    this.timeout_increment = timeout_increment != null ? timeout_increment : jasmine.WaitsForBlock.TIMEOUT_INCREMENT;
};

jasmine.util.inherit(jasmine.WaitsForBlock, jasmine.Block);

jasmine.WaitsForBlock.prototype.isWaitsForBlock = true;
jasmine.WaitsForBlock.prototype.asyncOnComplete = true;

// Longer poll interval in slower browser to allow intervening events to fire.
jasmine.WaitsForBlock.TIMEOUT_INCREMENT = jasmine.browser.isIE8m ? 50 : 10;

(function() {
// We assign these variables once and close over them instead of calling me.env.setTimeout()
// etc to avoid closing over the block instance. Blocks are numerous and their closure scopes
// are hard on memory.
var setTimeout = jasmine._setTimeout,
    clearTimeout = jasmine._clearTimeout;

jasmine.WaitsForBlock.prototype.execute = function(onComplete) {
    this.wantCallback = this.latchFunction.length > 0;
    this.onComplete = onComplete;
    
    this.fail = this.fail.bind(this);
    this.done = this.done.bind(this);
    this.next = this.next.bind(this);
    
    if (this.wantCallback) {
        this.watchdogTimeout = setTimeout(this.fail, this.timeout);
    }
    
    this.next();
};

// Fail callback can be fired either upon expiration of watchdog timeout,
// or explicitly if latch function throws an exception. In latter case
// we will have an exception to report.
jasmine.WaitsForBlock.prototype.fail = function(exception) {
    this.stop(exception || {
        name: 'timeout',
        message: 'Timed out after ' + this.timeout + ' msec waiting for ' +
                 (this.message || 'something to happen')
    });
};

// We pass this callback to the latch function so that it could yield control
// and finish waiting asynchronously after its condition was met, without polling
// every now and then. The latch function needs to be aware of that though,
// which is optional.
jasmine.WaitsForBlock.prototype.done = function() {
    // This too can be reached via various paths.
    if (this.watchdogTimeout) {
        clearTimeout(this.watchdogTimeout);
        delete this.watchdogTimeout;
    }
    
    if (this.nextTimeout) {
        clearTimeout(this.nextTimeout);
        delete this.nextTimeout;
    }
    
    if (!this.abort) {
        this.finish();
    }
};

jasmine.WaitsForBlock.prototype.next = function() {
    var result;
    
    // Watchdog could have kicked in and aborted the latch sequence.
    // Sometimes nextTimeout fails to clear in IE. :(
    if (this.abort) {
        return;
    }
    
    // We can't avoid try/catch block here because any unhandled exception
    // will wreak queue flow.
    try {
        result = !!this.latchFunction.call(this.spec, this.done, this.fail);
    }
    catch(e) {
        this.fail(e);
        
        return;
    }
    
    // We only poll if the latch function does not accept arguments.
    // If it does we assume that it is responsible for calling done()
    // when it's done. If it so happens that the latch function accepts
    // some arguments by mistake and is not aware of the done() callback,
    // it's no big deal - there's a global watchdog in the Env that will
    // take care of this.
    if (!this.finished && !this.wantCallback) {
        if (result) {
            this.done();
        }
        else {
            this.totalTimeSpentWaitingForLatch += this.timeout_increment;
            
            if (this.totalTimeSpentWaitingForLatch >= this.timeout) {
                this.fail();
                
                return;
            }
            
            this.nextTimeout = setTimeout(this.next, this.timeout_increment);
        }
    }
};

jasmine.WaitsForBlock.prototype.finish = function() {
    if (this.watchdogTimeout) {
        clearTimeout(this.watchdogTimeout);
        delete this.watchdogTimeout;
    }
    
    if (this.nextTimeout) {
        clearTimeout(this.nextTimeout);
        delete this.nextTimeout;
    }
    
    this.fail = this.done = this.next = this.latchFunction = null;
    delete this.fail;
    delete this.done;
    delete this.next;
    
    jasmine.Block.prototype.finish.call(this);
};
})();

jasmine.WaitsForEventBlock = function(env, target, event, message, timeout, spec) {
    var latchFn = this.waitFn.bind(this);
    
    jasmine.WaitsForBlock.call(this, env, timeout, latchFn, message, null, spec);
    
    this.target = target;
    this.event = event;
};

jasmine.util.inherit(jasmine.WaitsForEventBlock, jasmine.WaitsForBlock);

jasmine.WaitsForEventBlock.prototype.isWaitsForEventBlock = true;

jasmine.WaitsForEventBlock.prototype.waitFn = function(done) {
    var noTarget;
    
    if (!this.target) {
        this.fail({
            name: 'Error',
            message: 'Expected valid event source, got ' + jasmine.pp(this.target)
        });
        
        noTarget = true;
    }
    
    if (noTarget || this.alreadyDone()) {
        done();
    }
    else {
        this.listenerFunction = done;
        this.addListener();
    }
};

jasmine.WaitsForEventBlock.prototype.focusEvents = {
    focus: true,
    focusin: true
};

jasmine.WaitsForEventBlock.prototype.blurEvents = {
    blur: true,
    focusout: true
};

jasmine.WaitsForBlock.prototype.specialEvents = {
    render: 'rendered',
    hide: 'hidden',
    show: function(target) {
        return !target.hidden;
    }
};

jasmine.WaitsForEventBlock.prototype.alreadyDone = function() {
    var event = this.event,
        target = this.target,
        focusEl, test;
    
    if (this.focusEvents[event] || this.blurEvents[event]) {
        // We do target resolution at *block execution time* to allow Components to render!
        if (target.$isFocusableEntity) {
            focusEl = target.getFocusEl();
                
            // Drill down to the actual element
            while (focusEl && !focusEl.isElement) {
                focusEl = focusEl.getFocusEl();
            }
            
            focusEl = focusEl && focusEl.dom;
        }
        else if (target.isElement) {
            focusEl = target.dom;
        }
        else {
            focusEl = target;
        }
        
        if (!focusEl) {
            this.fail({
                name: 'Error',
                message: "Cannot find focusable HTMLElement" +
                         (target && target.$className ? " for " + target.$className + '#' + target.id : '') + '!'
            });
            
            // If there is nothing to wait for, we're done
            return true;
        }
        
        this.target = target = focusEl;
        
        return (this.focusEvents[event] && document.activeElement === target) ||
               (this.blurEvents[event] && document.activeElement !== target);
    }
    // Assignment is intentional
    else if (test = this.specialEvents[event]) {
        if (typeof test === 'function') {
            return target && test(target);
        }
        else {
            return target && target[test];
        }
    }
    
    return false;
};

jasmine.WaitsForEventBlock.prototype.addListener = function() {
    var event = this.event,
        target = this.target;
    
    if (target.isObservable) {
        // We have to introduce a delay to allow the stack to unwind
        target.addListener(event, this.listenerFunction, this, { single: true, delay: 1 });
    }
    else if (target.addEventListener) {
        target.addEventListener(event, this.listenerFunction);
    }
    else {
        target.attachEvent('on' + event, this.listenerFunction);
    }
    
    this.listenerInstalled = true;
};

jasmine.WaitsForEventBlock.prototype.removeListener = function() {
    if (!this.listenerInstalled) {
        return;
    }
    
    var event = this.event,
        target = this.target;
    
    if (target) {
        if (target.isObservable) {
            target.removeListener(event, this.listenerFunction);
        }
        else if (target.removeEventListener) {
            target.removeEventListener(event, this.listenerFunction);
        }
        else {
            target.detachEvent('on' + event, this.listenerFunction);
        }
    }
    
    this.listenerInstalled = false;
};

jasmine.WaitsForEventBlock.prototype.done = function() {
    this.removeListener();
    this.listenerFunction = null;
    this.target = null;
    
    jasmine.WaitsForBlock.prototype.done.call(this);
};

jasmine.WaitsForEventBlock.prototype.fail = function(exception) {
    this.removeListener();
    this.listenerFunction = null;
    this.target = null;
    
    jasmine.WaitsForBlock.prototype.fail.call(this, exception);
};

jasmine.env = new jasmine.Env();

// Mock setTimeout, clearTimeout
// Contributed by Pivotal Computer Systems, www.pivotalsf.com

jasmine.FakeTimer = function() {
    var me = this;
    
    me.reset();
    
    me.setTimeout = function(funcToCall, millis) {
        me.timeoutsMade++;
        me.scheduleFunction(me.timeoutsMade, funcToCall, millis, false);
        
        return me.timeoutsMade;
    };
    
    me.setInterval = function(funcToCall, millis) {
        me.timeoutsMade++;
        me.scheduleFunction(me.timeoutsMade, funcToCall, millis, true);
        
        return me.timeoutsMade;
    };
    
    me.clearTimeout = me.clearInterval = function(timeoutKey) {
        me.scheduledFunctions[timeoutKey] = null;
    };
};

jasmine.FakeTimer.prototype.reset = function() {
    this.timeoutsMade = 0;
    this.scheduledFunctions = {};
    this.nowMillis = 0;
};

jasmine.FakeTimer.prototype.tick = function(millis) {
    var oldMillis = this.nowMillis,
        newMillis = oldMillis + millis;
    
    this.runFunctionsWithinRange(oldMillis, newMillis);
    this.nowMillis = newMillis;
};

jasmine.FakeTimer.prototype.runFunctionsWithinRange = function(oldMillis, nowMillis) {
    var funcsToRun = [],
        fn, timeoutKey, i;
    
    for (timeoutKey in this.scheduledFunctions) {
        fn = this.scheduledFunctions[timeoutKey];
        
        if (fn != null && fn.runAtMillis >= oldMillis && fn.runAtMillis <= nowMillis) {
            funcsToRun.push(fn);
            this.scheduledFunctions[timeoutKey] = null;
        }
    }
    
    if (funcsToRun.length > 0) {
        funcsToRun.sort(function(a, b) {
            return a.runAtMillis - b.runAtMillis;
        });
        
        for (i = 0; i < funcsToRun.length; ++i) {
            try {
                fn = funcsToRun[i];
                
                this.nowMillis = fn.runAtMillis;
                
                fn.funcToCall();
                
                if (fn.recurring) {
                    this.scheduleFunction(fn.timeoutKey, fn.funcToCall, fn.millis, true);
                }
            }
            catch(e) {};
        }
        
        this.runFunctionsWithinRange(oldMillis, nowMillis);
    }
};

jasmine.FakeTimer.prototype.scheduleFunction = function(timeoutKey, funcToCall, millis, recurring) {
    this.scheduledFunctions[timeoutKey] = {
        runAtMillis: this.nowMillis + millis,
        funcToCall: funcToCall,
        recurring: recurring,
        timeoutKey: timeoutKey,
        millis: millis
    };
};

/**
 * @namespace
 */
jasmine.Clock = (function() {
    var scheduledFunctions = {},
        global = jasmine.getGlobal(),
        realSetTimeout = global.setTimeout,
        realClearTimeout = global.clearTimeout,
        realSetInterval = global.setInterval,
        realClearInterval = global.clearInterval,
        realSetImmediate = global.setImmediate,
        realClearImmediate = global.clearImmediate,
        noOp = function() {},
        me = {
            scheduledFunctions: scheduledFunctions,

            reset: function() {
                var timeoutKey;

                for (timeoutKey in scheduledFunctions) {
                    me.installed.clearTimeout(timeoutKey);
                }
            },

            tick: noOp,

            runFunctionsWithinRange: noOp,

            useMock: noOp,

            installMock: noOp,

            unInstallMock: noOp,

            scheduleFunction: function() {
                throw "Not supported";
            },

            nextTimeoutKey: 100000,

            installed: {
                setTimeout: function(funcToCall, millis) {
                    var wrapFunc = function() {
                            delete scheduledFunctions[timeoutKey];
                            funcToCall();
                        },
                        timeoutKey = me.nextTimeoutKey++,
                        realTimeoutKey,
                        spec = jasmine.env.currentSpec;
                    
//                     if (timeoutKey === 100005) {
//                         debugger;
//                     }

                    if (jasmine.browser.isIE8) {
                        global.setTimeout = realSetTimeout;
                        realTimeoutKey = setTimeout(wrapFunc, millis);
                        global.setTimeout = jasmine.Clock.installed.setTimeout;
                    }
                    else {
                        realTimeoutKey = realSetTimeout.apply(global, [wrapFunc, millis]);
                    }
                    
                    // Functions deemed safe will have the flag set
                    scheduledFunctions[timeoutKey] = {
                        type: 'setTimeout',
                        realTimeoutKey: realTimeoutKey,
                        scheduledFn: funcToCall,
                        funcToCall: wrapFunc,
                        created: jasmine.CAPTURE_CALL_STACK ? new Error().stack : null,
                        spec: spec ? spec.getFullName(true) : null,
                        $skipTimerCheck: funcToCall.$skipTimerCheck
                    };
                    
                    return timeoutKey;
                },

                setInterval: function(funcToCall, millis) {
                    var timeoutKey = me.nextTimeoutKey++,
                        realTimeoutKey,
                        spec = jasmine.env.currentSpec;
                    
//                     if (timeoutKey === 100004) {
//                         debugger;
//                     }

                    if (jasmine.browser.isIE8) {
                        global.setInterval = realSetInterval;
                        realTimeoutKey = setTimeout(funcToCall, millis);
                        global.setInterval = jasmine.Clock.installed.setInterval;
                    }
                    else {
                        realTimeoutKey = realSetInterval.apply(global, [funcToCall, millis]);
                    }

                    scheduledFunctions[timeoutKey] = {
                        type: 'setInterval',
                        realTimeoutKey: realTimeoutKey,
                        scheduledFn: funcToCall,
                        funcToCall: funcToCall,
                        created: jasmine.CAPTURE_CALL_STACK ? new Error().stack : null,
                        spec: spec ? spec.getFullName(true) : null,
                        $skipTimerCheck: funcToCall.$skipTimerCheck
                    };
                    
                    return timeoutKey;
                },

                clearTimeout: function(timeoutKey) {
                    var scheduledObject = scheduledFunctions[timeoutKey],
                        realTimeoutKey;

                    // We can only handle it if it is one of ours
                    if (scheduledObject) {
                        realTimeoutKey = scheduledObject.realTimeoutKey;
                        delete scheduledFunctions[timeoutKey];
                        
                        if (jasmine.browser.isIE8) {
                            global.clearTimeout = realClearTimeout;
                            global.clearInterval = realClearInterval;
                            clearInterval(realTimeoutKey);
                            clearTimeout(realTimeoutKey);
                            global.clearTimeout = jasmine.Clock.installed.clearTimeout;
                            global.clearInterval = jasmine.Clock.installed.clearInterval;
                        }
                        else {
                            realClearTimeout.call(global, realTimeoutKey);
                            realClearInterval.call(global, realTimeoutKey);
                        }
                        
                        if (realClearImmediate) {
                            realClearImmediate.call(global, realTimeoutKey);
                        }
                    }
                },

                clearInterval: function(timeoutKey) {
                    me.installed.clearTimeout(timeoutKey);
                }
            }
        };
    
    if (realSetImmediate && realClearImmediate) {
        me.installed.setImmediate = function(funcToCall) {
            var timeoutKey = me.nextTimeoutKey++,
                realTimeoutKey,
                spec = jasmine.env.currentSpec;

            realTimeoutKey = realSetImmediate.apply(jasmine.getGlobal(), [funcToCall]);

            scheduledFunctions[timeoutKey] = {
                type: 'setImmediate',
                realTimeoutKey: realTimeoutKey,
                scheduledFn: funcToCall,
                funcToCall: funcToCall,
                created: jasmine.CAPTURE_CALL_STACK ? new Error().stack : null,
                spec: spec ? spec.getFullName(true) : null,
                $skipTimerCheck: funcToCall.$skipTimerCheck
            };
            
            return timeoutKey;
        };
        
        me.installed.clearImmediate = function(timeoutKey) {
            me.installed.clearTimeout(timeoutKey);
        };
    }

    return me;
})();

// Use the instrumented timer functions
(function() {
    var global = jasmine.getGlobal();
    
    global.setTimeout = jasmine.Clock.installed.setTimeout;
    global.setInterval = jasmine.Clock.installed.setInterval;
    global.clearTimeout = jasmine.Clock.installed.clearTimeout;
    global.clearInterval = jasmine.Clock.installed.clearInterval;
    
    if (global.setImmediate) {
        jasmine._setImmediate = global.setImmediate;
        global.setImmediate = jasmine.Clock.installed.setImmediate;
    }
    
    if (global.clearImmediate) {
        jasmine._clearImmediate = global.clearImmediate;
        global.clearImmediate = jasmine.Clock.installed.clearImmediate;
    }
})();

jasmine.mouseToTypeMap = {
    mousedown: 'start',
    mousemove: 'move',
    mouseup: 'end',
    mouseover: 'over',
    mouseout: 'out',
    mouseenter: 'enter',
    mouseleave: 'leave'
};

jasmine.focusEvents = {
    mousedown: true,
    click: true
};

// This requires initialized Ext core
jasmine.env.addStartupHook(function() {
    jasmine.pointerEventsMap = Ext.supports.MSPointerEvents && !Ext.supports.PointerEvents ? {
        // translation map for IE10
        pointerdown: 'MSPointerDown',
        pointermove: 'MSPointerMove',
        pointerup: 'MSPointerUp',
        pointerover: 'MSPointerOver',
        pointerout: 'MSPointerOut',
        // IE10 does not have pointer events for enter/leave
        pointerenter: 'mouseenter',
        pointerleave: 'mouseleave'
    } : {};
});

/**
 * Utility function to fire a fake mouse event to a given target element
 */
jasmine.fireMouseEvent = function(target, type, x, y, button, shiftKey, ctrlKey, altKey, relatedTarget) {
    var e, doc, ret, focusable, oldActiveEl, centre;

    target = Ext.getDom(target && target.isComponent ? target.el : target);
    centre = Ext.fly(target, '_testFireEvent').getAnchorXY('c');

    if (!target) {
        throw 'Cannot fire mouse event on null element';
    }
    
    doc = target.ownerDocument || document;
    if (x == null) {
        x = centre[0];
    } else {
        // Allow '+10'/'-10' to mean offsets from last used position.
        // Useful when dragging.
        if (typeof x === 'string') {
            x = jasmine.mouseX + parseInt(x, 10);
        }
    }
    if (y == null) {
        y = centre[1];
    } else {
        if (typeof y === 'string') {
            y = jasmine.mouseY + parseInt(y, 10);
        }
    }
    jasmine.mouseX = x;
    jasmine.mouseY = y;

    // Mousedown might lead to focus (not context menu mousedown)
    if (jasmine.focusEvents[type] && !button) {
        // Find a click target which is potentially focusable.
        // Not immediately tabbable; the mousedown handling might MAKE it tabbable.
        focusable = Ext.fly(target).findParent(function(e) {return Ext.fly(e).isFocusable();}, null);

        // Mousedown is followed by focus, unless a listener prevented default, or the focus was moved by a prior listener
        if (focusable) {
            oldActiveEl = document.activeElement;
            
            if (focusable !== oldActiveEl) {
                Ext.getDoc().on({
                    mousedown: function(e) {
                        var fly;
                        
                        if (!e.defaultPrevented && document.activeElement === oldActiveEl &&
                            (fly = Ext.fly(focusable)) && fly.isFocusable())
                        {
                            fly.focus();
                        }
                    },
                    single: true,
                    priority: -10000
                });
            }
        }
    }

    if (type === 'click') {
        Ext.testHelper.tap(target, {
            x: x,
            y: y,
            button: button,
            shiftKey: shiftKey,
            ctrlKey: ctrlKey,
            altKey: altKey,
            relatedTarget: relatedTarget
        });
    } else if (type === 'dblclick') {
        jasmine.fireMouseEvent(target, 'click', x, y, button, shiftKey, ctrlKey, altKey);
        jasmine.fireMouseEvent(target, 'click', x, y, button, shiftKey, ctrlKey, altKey);
        
        // Multi-phase mouse events are done with gestures now, so ensure there's a real dblclick fired.
        jasmine.doFireMouseEvent(target, 'dblclick', x, y, button, shiftKey, ctrlKey, altKey);
    } else if (type === 'contextmenu') {
        jasmine.doFireMouseEvent(target, type, x, y, button, shiftKey, ctrlKey, altKey);
    } else {
        Ext.testHelper.fireEvent(jasmine.mouseToTypeMap[type], target, {
            x: x,
            y: y,
            button: button,
            shiftKey: shiftKey,
            ctrlKey: ctrlKey,
            altKey: altKey,
            relatedTarget: relatedTarget
        });
    }

    // If they asked for button 2, it means they wanted a contextmenu event too.
    if (type === 'mousedown' && button === 2) {

        // IE, CTRL+SHIFT+CLICK is contextmenu
        if (Ext.isIE) {
            jasmine.doFireMouseEvent(target, 'click', x, y, button, true, true);
        }
        // Other browsers support contextmenu
        else {
            jasmine.doFireMouseEvent(target, 'contextmenu', x, y);
        }
    }

    return (ret === false) ? ret : e;
};

jasmine.doFireMouseEvent = function(target, type, x, y, button, shiftKey, ctrlKey, altKey, relatedTarget) {
    // Save a function call
    target = target.nodeName ? target : Ext.getDom(target);
    
    if (relatedTarget) {
        relatedTarget = relatedTarget.nodeName ? relatedTarget : Ext.getDom(relatedTarget);
    }
    else {
        if (type === 'mouseover' || type === 'mouseout' || type === 'mousenter' || type === 'mouseleave') {
            relatedTarget = target.parentNode;
        } else {
            relatedTarget = null;
        }
    }

    var doc = target.ownerDocument || document,
        e, docEl = doc.documentElement, body;

    // Ensure the mouse position is registered at the point of contact
    if (type === 'mousedown') {
        jasmine.doFireMouseEvent(docEl, 'mousemove', x, y);
        
        // We need to clean up any pending mouseup listeners
        jasmine.doFireMouseEvent.needMouseup = true;
    }
    else if (type === 'mouseup') {
        jasmine.doFireMouseEvent.needMouseup = false;
    }

    // We are using old IE event model for IE9 too, because it has problems
    // with synthetic events created and dispatched in the standard way.
    if (Ext.isIE9m && doc.createEventObject) {
        e = doc.createEventObject();
        body = doc.body;
        x = x + (docEl && docEl.clientLeft || 0) + (body && body.clientLeft || 0);
        y = y + (docEl && docEl.clientTop || 0) + (body && body.clientTop || 0);

        Ext.apply(e, {
            bubbles: true,
            cancelable: true,
            screenX: x,
            screenY: y,
            clientX: x,
            clientY: y,
            button: button || 1,
            shiftKey: !!shiftKey,
            ctrlKey: !!ctrlKey,
            altKey: !!altKey,
            relatedTarget: relatedTarget
        });
        
        if (jasmine.CAPTURE_CALL_STACK) {
            e.created = new Error().stack;
        }
        
        return target.fireEvent('on' + type, e);
    }
    else {
        if (jasmine.supportsMouseConstructor) {
            e = new MouseEvent(type, {
                view: doc.defaultView || doc.parentWindow,
                bubbles: true,
                cancelable: true,
                screenX: x,
                screenY: y,
                clientX: x,
                clientY: y,
                button: button || 1,
                shiftKey: !!shiftKey,
                ctrlKey: !!ctrlKey,
                altKey: !!altKey,
                relatedTarget: relatedTarget
            });
        }
        else {
            e = doc.createEvent("MouseEvents");
        }
        
        e.initMouseEvent(type, true, true, doc.defaultView || doc.parentWindow, 1, x, y, x, y, !!ctrlKey, !!altKey, !!shiftKey, false, button || 0, relatedTarget);
        
        if (jasmine.CAPTURE_CALL_STACK) {
            e.created = new Error().stack;
        }
        
        return target.dispatchEvent(e);
    }
};

jasmine.pointerTypeMap = {
    touch: 2,
    pen: 3,
    mouse: 4
};

/**
 * Fires a pointer event.  Since PointerEvents cannot yet be directly constructed,
 * we fake it by constructing a mouse event and setting its pointer id.  This method
 * should typically be used when (Ext.supports.PointerEvents || Ext.supports.MSPointerEvents).
 * @param {String/Ext.Element/HTMLElement} target
 * @param {String} type The name of the event to fire
 * @param {Number} [pointerId] A unique id for the pointer, for more on pointerId see
 * http://www.w3.org/TR/pointerevents/
 * @param {Number} [x] The x coordinate
 * @param {Number} [y] The y coordinate
 * @param {Number} [button]
 * @param {Boolean} [shiftKey]
 * @param {Boolean} [ctrlKey]
 * @param {Boolean} [altKey]
 * @param {String/Ext.Element/HTMLElement} relatedTarget
 * @param {String} [pointerType=mouse]
 * @return {Boolean} true if the event was successfully dispatched
 */
jasmine.firePointerEvent = function(target, type, pointerId, x, y, button, shiftKey, ctrlKey, altKey, relatedTarget, pointerType) {
    target = Ext.getDom(target);
    if (relatedTarget) {
        relatedTarget = Ext.getDom(relatedTarget);
    } else {
        if (type === 'mouseover' || type === 'mouseout' || type === 'mousenter' || type === 'mouseleave') {
            relatedTarget = target.parentNode;
        } else {
            relatedTarget = null;
        }
    }

    var doc = target.ownerDocument || document,
        pointerTypeValue = jasmine.pointerTypeMap[pointerType ? pointerType.toLowerCase() : 'mouse'],
        e, dispatched;

    if (!target) {
        throw 'Cannot fire pointer event on null element';
    }
    
    // Ensure the pointer position is registered at the point of contact
    if (type === 'mousedown') {
        jasmine.firePointerEvent(doc.defaultView || doc.parentWindow, 'mousemove', x, y);
    }

    type = jasmine.pointerEventsMap[type] || type;

    // Broken IE10 implementation
    if (Ext.supports.MSPointerEvents && !Ext.supports.PointerEvents) {
        e = doc.createEvent("MouseEvents");
        e.initMouseEvent(
            type, // type
            true, // canBubble
            true, // cancelable
            doc.defaultView || doc.parentWindow, // view
            1, // detail
            x, // screenX
            y, // screenY
            x, // clientX
            y, // clientY
            !!ctrlKey, // ctrlKey
            !!altKey,   // altKey
            !!shiftKey, // shiftKey
            false, // metaKey
            button || 0, // button
            relatedTarget // relatedTarget
        );
        e.pointerId = pointerId || 1;
        e.pointerType = pointerType || 'mouse';
    }
    // PointerEvents standard
    else {
        if (jasmine.supportsPointerEventConstructor) {
            e = new PointerEvent(type, {
                // Event
                bubbles: true,
                cancelable: true,

                // UIEvent
                detail: 1,
                view: doc.defaultView || doc.parentWindow,

                // MouseEvent
                screenX: x,
                screenY: y,
                clientX: x,
                clientY: y,
                ctrlKey: !!ctrlKey,
                shiftKey: !!shiftKey,
                altKey: !!altKey,
                metaKey: false,
                button: button || 0,
                relatedTarget: relatedTarget,

                // PointerEvent
                pointerId: pointerId || 1,
                width: 1,
                height: 1,
                pressure: 0.5,
                tiltX: 0,
                tiltY: 0,
                pointerType: pointerType,
                isPrimary: true
            });
        } else {
            e = doc.createEvent('PointerEvent');
            e.initPointerEvent(
                type, // type
                true, // canBubble
                true, // cancelable
                doc.defaultView || doc.parentWindow, // view
                1, // detail
                x, // screenX
                y, // screenY
                x, // clientX
                y, // clientY
                !!ctrlKey, // ctrlKey
                !!altKey,   // altKey
                !!shiftKey, // shiftKey
                false, // metaKey
                button || 0, // button
                relatedTarget, // relatedTarget,
                1, // element offset X
                1, // element offset Y
                1, // width
                1, // height
                0.5, // pressure
                0, // rotation
                0, // tiltX
                0, // tiltY
                1, // id,
                pointerTypeValue, // pointerType
                Ext.now(), // timestamp
                true    // primary, ie: the mouse
            );
        }
    }
    
    if (jasmine.CAPTURE_CALL_STACK) {
        e.created = new Error().stack;
    }
    
    dispatched = target.dispatchEvent(e);
    
    return (dispatched === false) ? dispatched : e;
};

// Test all three ways that we can use to create touch events.
jasmine.supportsTouch = (function() {
    var maxTouchPoints = navigator.msMaxTouchPoints || navigator.maxTouchPoints,
        touchEvent, touch;

    // See if we can create TouchEvents using a constructor.
    // If not, we will fall back to using a CustomEvent.
    try {
        touchEvent = new TouchEvent('touchstart', {
            target: document,
            bubbles: true
        });
        jasmine.supportsObjectTouchEventConstructor = touchEvent.bubbles === true;
    } catch (e) {
    }

    if (!jasmine.supportsObjectTouchEventConstructor) {
        try {
            touch = new TouchEvent(
                'touchstart'
            );
            jasmine.supportsTouchEventConstructor = true;
        } catch (e) {
        }
    }

    try {
        if (!touchEvent) {
            touchEvent = new CustomEvent('touchstart', {
                bubbles: true,
                cancelable: true
            });
        }
    } catch (e) {
    }

    // See if we can create individual Touches using the constructor.
    // If not, we will fall back to using document.createTouch.
    try {
        touch = new Touch({
            identifier: 1,
            target: document
        });
        jasmine.supportsTouchConstructor = touch.target === document;
    } catch (e) {
    }
    
    if (!jasmine.supportsTouchConstructor) {
        try {
            touch = document.createTouch(
                document.defaultView,
                document,
                1,0, 0, 0, 0
            );
        } catch (e) {
            return false;
        }
    }

    // See if we can create a filled TouchList using the constructor.
    // If not, the TouchEvent accepts raw arrays of Touches.
    if (!document.createTouchList) {
        try {
            var touchList = new TouchList(touch);
            jasmine.supportsTouchListConstructor = touchList.length > 0;
        } catch (e) {
        }
    }

    return 'ontouchend' in window || maxTouchPoints > 0;
})();

jasmine.supportsMouseConstructor = (function() {
    var e,
        supports = false;

    if (document.addEventListener) {
        try {
            function setFlag(e) {
                supports = !!e;
            }
            document.addEventListener('mousedown', setFlag);
            e = new MouseEvent('mousedown', {bubbles: true});
            document.querySelector('script').dispatchEvent(e);
        } catch (e) {
        } finally {
            document.removeEventListener('mousedown', setFlag);
        }
    }
    return supports;
})();

jasmine.supportsPointerEventConstructor = (function () {
    var e;

    try {
        if (window.PointerEvent) {
            // IE11 throws an error when you invoke the PointerEvent constructor.
            // In IE11 we can use document.createEvent('PointerEvent') to create a pointer
            // event instance.  In Chrome, document.createEvent('PointerEvent') throws
            // an error, so we have to use the PointerEvent constructor in Chrome.
            e = new PointerEvent('pointerdown', { clientX: 100 });

            // Detect https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11208119/
            // If bug is present we cannot use the PointerEvent constructor due to incorrect pageX/pageY
            if (e.pageX !== 100) {
                return false;
            }

            return true;
        }
    } catch (e) {}

    return false;
})();

jasmine.createTouchList = function(touchList, target) {
    target = touchList[0].target || target;

    var doc = document = target.ownerDocument || document,
        touch,
        touches = [],
        touchCfg, i, len;

    for (i = 0, len = touchList.length; i < len; i++) {
        touchCfg = touchList[i];

        // W3 standard compliant.
        if (jasmine.supportsTouchConstructor) {
            touch = new Touch({
                target: target,
                identifier: touchCfg.identifier || 1,
                pageX: touchCfg.pageX,
                pageY: touchCfg.pageY,
                screenX: touchCfg.screenX || touchCfg.pageX, // use pageX/Y as the default for screenXY
                screenY: touchCfg.screenY || touchCfg.pageY,
                clientX: touchCfg.screenX || touchCfg.pageX, // use pageX/Y as the default for clientXY
                clientY: touchCfg.screenY || touchCfg.pageY,
                radiusX: 1,
                radiusY: 1,
                rotationAngle: 0,
                force: 0.5
            });
        } else {
            touch = doc.createTouch(
                doc.defaultView || doc.parentWindow,
                target,
                // use 1 as the default ID, so that tests that are only concerned with a single
                // touch event don't need to worry about providing an ID
                touchCfg.identifier || 1,
                touchCfg.pageX,
                touchCfg.pageY,
                touchCfg.screenX || touchCfg.pageX, // use pageX/Y as the default for screenXY
                touchCfg.screenY || touchCfg.pageY
            );
        }
        touches.push(touch);
    }
    
    return jasmine.supportsTouchListConstructor ? new TouchList(touches) : doc.createTouchList ? doc.createTouchList.apply(doc, touches) : touches;
};

/**
 * Utility for emulating a touch event.  This method should typically only be used when
 * Ext.supports.TouchEvents.  Recommended reading for understanding how touch events work:
 * http://www.w3.org/TR/touch-events/
 * @param {String/Ext.Element/HTMLElement} target
 * @param {String} type The name of the event to fire
 * @param {Object[]} touches An array of config objects for constructing the event object's
 * "touches".  The config objects conform to the following interface:
 * http://www.w3.org/TR/touch-events/#idl-def-Touch The only required properties
 * are pageX and pageY. this method provides defaults for the others.
 * @param {Object[]} changedTouches An array of config objects for constructing the event
 * object's "changedTouches" (defaults to the same value as the `touches` param)
 * @param {Object[]} targetTouches An array of config objects for constructing the event
 * object's "targetTouches" (defaults to the same value as the `touches` param)
 * @return {Event} The browser event if the event was successfully dispatched, otherwise `false`
 */
jasmine.fireTouchEvent = function(target, type, touchesParam, changedTouches, targetTouches) {
    var target = Ext.getDom(target),
        touches, e, dispatched, centre;

    if (!target) {
        throw 'Cannot fire touch event on null element';
    }

    if (!touchesParam) {
        centre = Ext.fly(target, '_testFireEvent').getAnchorXY('c');
        touchesParam = [{
            pageX: centre[0],
            pageY: centre[1]
        }];
    }

    touches = jasmine.createTouchList(touchesParam, target);
    changedTouches = jasmine.createTouchList(changedTouches || touchesParam, target);
    targetTouches = jasmine.createTouchList(targetTouches || touchesParam, target);

    e = jasmine.createTouchEvent(type, target, {
        target: target,
        touches: touches,
        changedTouches: changedTouches,
        targetTouches: targetTouches,
        bubbles: true,
        cancelable: true,
        shiftKey: !!touchesParam[0].shiftKey,
        ctrlKey: !!touchesParam[0].ctrlKey,
        altKey: !!touchesParam[0].altKey
    });
    
    if (jasmine.CAPTURE_CALL_STACK) {
        e.created = new Error().stack;
    }
    
    dispatched = target.dispatchEvent(e);
    
    return (dispatched === false) ? dispatched : e;
};

jasmine.createTouchEvent = function(type, target, cfg) {
    var doc = target.ownerDocument || document,
        result;

    if (jasmine.supportsObjectTouchEventConstructor) {
        result = new TouchEvent(type, {
            target: target,
            touches: cfg.touches,
            changedTouches: cfg.changedTouches,
            targetTouches: cfg.touches,
            bubbles: true,
            cancelable: true,
            shiftKey: cfg.shiftKey,
            ctrlKey: cfg.ctrlKey,
            altKey: cfg.altKey
        });
    } else if (jasmine.supportsTouchEventConstructor) {
        result = new TouchEvent(
            type, // type
            true, // canBubble
            true, // cancelable
            doc.defaultView || doc.parentWindow, // view
            1, // detail
            cfg.pageX,
            cfg.pageY,
            cfg.screenX || cfg.pageX, // use pageX/Y as the default for clientXY
            cfg.screenY || cfg.pageY,
            cfg.ctrlKey, // ctrlKey
            cfg.altKey,   // altKey
            cfg.shiftKey, // shiftKey
            false, // metaKey
            cfg.touches,
            cfg.changedTouches,
            cfg.touches,
            1, // scale
            0 // rotation
        );
    } else {
        result = new CustomEvent(type, {
            bubbles: true,
            cancelable: true
        });
        Ext.apply(result, {
            target: target,
            touches: cfg.touches,
            changedTouches: cfg.changedTouches,
            targetTouches: cfg.touches
        });
    }
    return result;
};

/**
 * Utility function to fire a fake key event to a given target element
 */
jasmine.fireKeyEvent = function(target, type, key, shiftKey, ctrlKey, altKey) {
    var doc, e;
    
    target = Ext.getDom(target);
    
    if (!target) {
        throw 'Cannot fire key event on null element';
    }
    
    doc = target.ownerDocument || document;
    
    // We are using old IE event model for IE9 too, because it has problems
    // with synthetic events created and dispatched in the standard way.
    if (Ext.isIE9m && doc.createEventObject) {
        e = doc.createEventObject();
        Ext.apply(e, {
            bubbles: true,
            cancelable: true,
            keyCode: key,
            shiftKey: !!shiftKey,
            ctrlKey: !!ctrlKey,
            altKey: !!altKey
        });
        
        return target.fireEvent('on' + type, e);
    }
    else {
        e = doc.createEvent("Events");
        e.initEvent(type, true, true);
        Ext.apply(e, {
            keyCode: key,
            shiftKey: !!shiftKey,
            ctrlKey: !!ctrlKey,
            altKey: !!altKey
        });
        
        return target.dispatchEvent(e);
    }
};

// This implementation is pretty naïve but since it's not easy to simulate
// real Tab key presses (if at all possible), it doesn't make sense to go
// any further than this.
jasmine.simulateTabKey = jasmine.syncPressTabKey = function(from, forward) {
    function getNextTabTarget(currentlyFocused, forward) {
        var selector = 'a[href],button,iframe,input,select,textarea,[tabindex],[contenteditable="true"]',
            body = Ext.getBody(),
            currentDom, focusables, node, next,
            len, lastIdx, currIdx, i, to, step;
        
        currentDom = Ext.getDom(currentlyFocused);
        focusables = body.dom.querySelectorAll(selector);
        len        = focusables.length;
        lastIdx    = focusables.length - 1;
        currIdx    = Ext.Array.indexOf(focusables, currentDom);
        
        // If the currently focused element is not present in the list,
        // it must be the body itself. Just focus the first or last
        // tabbable element.
        if (currIdx < 0) {
            if (forward) {
                i    = 0;
                to   = len - 1;
                step = 1;
            }
            else {
                i    = len - 1;
                to   = 0;
                step = -1;
            }
        }
        else {
            if (forward) {
                i    = currIdx + 1;
                to   = len - 1;
                step = 1;
            }
            else {
                i    = currIdx - 1;
                to   = 0;
                step = -1;
            }
        }
        
        // We're only interested in the elements that an user can *tab into*,
        // not all programmatically focusable elements. So we have to filter
        // these out.
        for (;; i += step) {
            if ((step > 0 && i > to) || (step < 0 && i < to)) {
                break;
            }
            
            node = focusables[i];
            
            if (Ext.fly(node).isTabbable()) {
                next = node;
                break;
            }
        }
        
        // We *need* to return Ext.Element instance here because later on
        // we will try to focus it and it's just not that simple. :(
        // There are Element overrides that deal with IE bugs.
        return Ext.get(next || body);
    }
    
    if (!from) {
        from = document.activeElement;
    }
    
    if (forward == null) {
        forward = true;
    }
    
    from = from.getFocusEl ? from.getFocusEl() : from;
    
    // A handler can call preventDefault() on the event in which case
    // we don't proceed with changing focus. It is also possible that
    // element tabbability could have changed in a tab key handler,
    // and activeElement could have changed as well, so we have to
    // compute the next target *after* firing successful keydown.
    // Whoa that escalates quickly!
    if (jasmine.fireKeyEvent(from, 'keydown', 9, !forward)) {
        var to = getNextTabTarget(document.activeElement || from, forward);
        
        if (to) {
            to.focus();
        }
    }
    
    jasmine.fireKeyEvent(document.activeElement, 'keyup',   9, !forward);

    return document.activeElement;
};

var simulateTabKey = jasmine.simulateTabKey;

jasmine.simulateArrowKey = jasmine.syncPressArrowKey =
jasmine.simulateKey = jasmine.syncPressKey = function(from, key, options) {
    var keyCode = typeof key === 'number' ? key : Ext.event.Event[key.toUpperCase()];
    
    if (keyCode === undefined) {
        throw 'Cannot fire undefined key event!';
    }

    from = from.getFocusEl ? from.getFocusEl() : from;

    var target = Ext.getDom(from);

    if (!target) {
        throw 'Cannot fire arrow key event on null element';
    }
    
    var shiftKey, ctrlKey, altKey;
    
    if (options) {
        shiftKey = options.shift || options.shiftKey;
        ctrlKey = options.ctrl || options.ctrlKey;
        altKey = options.alt || options.altKey;
    }

    jasmine.fireKeyEvent(target, 'keydown', keyCode, shiftKey, ctrlKey, altKey);
    jasmine.fireKeyEvent(target, 'keyup', keyCode, shiftKey, ctrlKey, altKey);
};

jasmine.usesViewport = function (config) {
    beforeAll(function () {
        if (Ext.isModern) {
            Ext.viewport.Viewport.setup(config);
        }
    });

    afterAll(function () {
        if (Ext.isModern) {
            Ext.Viewport = Ext.destroy(Ext.Viewport);
        }
    });
};

jasmine.waitsForFocusOrBlur = function(event, target, message, timeout) {
    if (target == null) {
        throw new Error("Expected something focusable, got " + target + " instead!");
    }
    
    if (target.$isFocusableEntity && !target.rendered) {
        jasmine.env.waitsForEvent(target, 'render', target.$className + '#' + target.id + ' to render');
    }
    
    jasmine.env.waitsForEvent(target, event, message, timeout);
};

/**
 * Scrolls the passed scroller until the isDone callback returns true,
 * That is passed te scroller, x, and y scroll positions.
 * @param {Ext.scroll.Scroller} scroller The scroller to scroll.
 * @param {Function/Number[]} isDone The callback to test whether scrolling is finished.
 * If this parameter is an array of numbers, they are interpreted to be the desired scroll
 * positions followed by the tolerance values, both in x,y order. In other words, that is
 * `[targetX, targetY, toleranceX, toleranceY]`. The target values can be `null` if they
 * are not important. The tolerance values default to `0`.
 * @param {Ext.scroll.Scroller} isDone.scroller The scroller.
 * @param {Number} isDone.x The current x position.
 * @param {Number} isDone.y The current y position.
 * @param {String} msg Descriptions of the wait condition.
 * @param {Number} timeout The time to wait in milliseconds.
 */
jasmine.waitForScroll = jasmine.waitsForScroll = function(scroller, isDone, msg, timeout) {
    if (!scroller.isScroller && scroller.getScrollable) {
        scroller = scroller.getScrollable();
    }

    if (Ext.isArray(isDone)) {
        var goal = isDone;

        isDone = function (sc, x, y) {
            var targetX = goal[0],
                targetY = goal[1],
                toleranceX = goal[2] || 0,
                toleranceY = goal[3] || 0;

            var dx = (targetX === null) ? 0 : Math.abs(x - targetX),
                dy = (targetY === null) ? 0 : Math.abs(y - targetY);

            return dx <= toleranceX && dy <= toleranceY;
        };
    }

    waitsFor(function() {
        var position;

        position = scroller.readPosition();

        if (isDone(scroller, Math.round(position.x), Math.round(position.y))) {
            position = scroller = null;
            return true;
        }
        return false;
    }, timeout, msg);
};

// In IE (all of 'em), focus/blur events are asynchronous. To us it means
// not only that we have to wait for the actual element to focus but
// also for its container-injected focus handler to fire; and since
// container focus handler may focus yet another element we have to yield
// for *that* focus handler to fire, too. The third `waits` is to
// accommodate for any repercussions caused by secondary focus handler,
// and of course as a good luck charm.
// Note that the timeout value is not important here because effectively
// we just want to yield enough cycles to unwind all the async event handlers
// before the test checks done in the specs, so we default to 1 ms.
jasmine.waitAWhile = jasmine.waitsAWhile = function(timeout) {
    timeout = timeout != null ? timeout : 1;

    waits(timeout);
    waits(timeout);
    waits(timeout);
};

var waitAWhile = jasmine.waitAWhile;

jasmine.focusAndWait = function(cmp, waitFor, desc) {
    // Apparently IE has yet another odd problem with focusing some elements;
    // if dom.focus() is called before the element is fully initialized, focusing
    // will fail and focus will jump to the document body. This happens with
    // text inputs at the very least, maybe with some others as well.
    // In IE9-10 we work around this issue by giving it a bit of time to finish
    // whatever initialization it was doing; in IE8 some harsher measures are
    // required, see Ext.dom.Element override.
    if (Ext.isIE10m) {
        jasmine.waitAWhile();
    }
    
    runs(function() {
        cmp.focus();
    });
    
    jasmine.waitsForFocus(waitFor || cmp, desc);

    jasmine.waitAWhile();
};

var focusAndWait = jasmine.focusAndWait;

jasmine.fireTabAndWait = function(target, waitFor, desc) {
    runs(function() {
        jasmine.fireKeyEvent(target, 'keydown', Ext.event.Event.TAB);
    });
    waitsForFocus(waitFor, desc);
};

var fireTabAndWait = jasmine.fireTabAndWait;

jasmine.blurAndWait = function(cmp, waitFor) {
    runs(function() {
        (cmp.findFocusTarget() || document.body).focus();
        cmp.blur();
    });

    jasmine.waitForBlur(waitFor || cmp);

    jasmine.waitAWhile();
};

jasmine.pressTabKey = jasmine.asyncPressTabKey = function(from, forward) {
    jasmine.focusAndWait(from, from);

    runs(function() {
        jasmine.simulateTabKey(from, forward);
    });

    jasmine.waitAWhile();
};

var pressTabKey = jasmine.pressTabKey;

jasmine.pressArrowKey = jasmine.asyncPressArrowKey =
jasmine.pressKey = jasmine.asyncPressKey = function(from, key, options) {
    jasmine.focusAndWait(from);

    runs(function() {
        jasmine.simulateArrowKey(from, key, options);
    });

    jasmine.waitAWhile();
};

var pressKey = jasmine.pressKey;

// Can't add this one and below as simple matchers,
// because there's async waiting involved
jasmine.expectFocused = jasmine.expectsFocused = function(want, noWait) {
    if (!noWait) {
        jasmine.waitsForFocus(want);
    }

    runs(function() {
        var have = want.$isFocusableEntity ? Ext.ComponentManager.getActiveComponent()
                 : want.isElement          ? Ext.fly(document.activeElement)
                 :                           document.activeElement
                 ;
        
        expect(have).toBe(want);
    });
};

var expectFocused = jasmine.expectFocused;

// Focus and optionally wait for another element - FocusableContainers shift focus!
jasmine.focusAndExpect = function(whatFocus, whatExpect) {
    jasmine.focusAndWait(whatFocus, whatExpect);
    jasmine.expectFocused(whatExpect || whatFocus);
};

var focusAndExpect = jasmine.focusAndExpect;

var fakeScope = {
    id: "fakeScope",
    fakeScope: true
};

/**
 * Class to act as a bridge between the MockAjax class and Ext.data.Request
 */
var MockAjaxManager = {
    getXhrInstance: null,
    
    /**
     * Pushes methods onto the Request prototype to make it easier to deal with
     */
    addMethods: function() {
        var Connection = Ext.data.Connection,
            connectionProto = Connection.prototype,
            requestProto = Ext.data.request.Ajax.prototype;
            
        Connection.requestId = 0;
        MockAjaxManager.getXhrInstance = requestProto.getXhrInstance;
        
        /**
         * Template method to create the AJAX request
         */
        requestProto.getXhrInstance = function() {
            return new MockAjax();
        };
        
        /**
         * Method to simulate a request completing
         * @param {Object} response The response
         * @param {String} id (optional) The id of the completed request
         */
        connectionProto.mockComplete = function(response, id) {
            var request = this.mockGetRequestXHR(id);
            
            if (request) {
                request.xhr.complete(response);
            }
        };

        connectionProto.mockCompleteWithData = function(data, id) {
            this.mockComplete({
                status: 200,
                responseText: Ext.JSON.encode(data)
            }, id);
        };
        
        /**
         * Get a particular request
         * @param {String} id (optional) The id of the request
         */
        connectionProto.mockGetRequestXHR = function(id) {
            var request;
                
            if (id) {
                request = this.requests[id];
            }
            else {
                // get the first one
                request = this.mockGetAllRequests()[0];
            }
            
            return request ? request : null;
        };
        
        /**
         * Gets all the requests from the Connection
         */
        connectionProto.mockGetAllRequests = function() {
            var requests = this.requests,
                out = [],
                id;
            
            for (id in requests) {
                if (requests.hasOwnProperty(id)) {
                    out.push(requests[id]);
                }
            }
            
            return out;
        };
        
        if (Ext.data.JsonP) {
            Ext.data.JsonP.loadScript = Ext.emptyFn;
            Ext.data.JsonP.createScript = function() {
                return document.createElement('script');
            };
            
            Ext.data.JsonP.mockComplete = function(url, data) {
                var requests = this.requests,
                    id, request, callbackName;
                
                // We have the request itself, yey!
                if (typeof url === 'object') {
                    request = url;
                }
                
                // If we happen to know id, let's use it
                else if (typeof url === 'number') {
                    request = requests[url];
                }
                
                else {
                    for (id in requests) {
                        if (requests[id].url.indexOf(url) === 0) {
                            request = requests[id];
                            break;
                        }
                    }
                }
                
                if (!request) {
                    return;
                }
                
                callbackName = request.callbackName;
                
                this[callbackName](data);
            }
        }
        
        this.originalExtAjax = Ext.Ajax;
        Ext.Ajax = new Connection({ autoAbort : false });
    },
    
    /**
     * Restore any changes made by addMethods
     */
    removeMethods: function() {
        var proto = Ext.data.Connection.prototype;

        Ext.Ajax.abortAll();
        if (this.originalExtAjax) {
            delete proto.mockComplete;
            delete proto.mockGetRequestXHR;
            Ext.Ajax = this.originalExtAjax;
            delete this.originalExtAjax;
            
            if (Ext.data.JsonP) {
                delete Ext.data.JsonP.loadScript;
                delete Ext.data.JsonP.mockComplete;
            }

            Ext.data.request.Ajax.prototype.getXhrInstance = MockAjaxManager.getXhrInstance;
            MockAjaxManager.getXhrInstance = null;
        }
    }
};

/**
 * Simple Mock class to represent an XMLHttpRequest
 */
var MockAjax = function() {
    /**
     * Contains all request headers
     */
    this.headers = {};
    
    /**
     * Contains any options specified during sending
     */
    this.ajaxOptions = {};
    
    this.readyState = 0;
    
    this.status = null;
    
    this.responseText = this.responseXML = null;
};

/**
 * Contains a default response for any synchronous request.
 */
MockAjax.prototype.syncDefaults = {
    responseText: 'data',
    status: 200,
    statusText: '',
    responseXML: null,
    responseHeaders: {"Content-type": "application/json" }
};

MockAjax.prototype.readyChange = function() {
    if (this.onreadystatechange) {
        this.onreadystatechange();
    }
};

/**
 * Simulate the XHR open method
 * @param {Object} method
 * @param {Object} url
 * @param {Object} async
 * @param {Object} username
 * @param {Object} password
 */
MockAjax.prototype.open = function(method, url, async, username, password) {
    var options = this.ajaxOptions;
    
    options.method = method;
    options.url = url;
    options.async = async;
    options.username = username;
    options.password = password;
    
    this.readyState = 1;
    this.readyChange();
};

/**
 * Simulate the XHR send method
 * @param {Object} data
 */
MockAjax.prototype.send = function(data) {
    this.ajaxOptions.data = data;
    this.readyState = 2;
    
    // if it's a synchronous request, let's just assume it's already finished
    if (!this.ajaxOptions.async) {
        this.complete(this.syncDefaults);
    }
    else {
        this.readyChange();
    }
};

/**
 * Simulate the XHR abort method
 */
MockAjax.prototype.abort = function() {
    this.readyState = 0;
    this.readyChange();
};

/**
 * Simulate the XHR setRequestHeader method
 * @param {Object} header
 * @param {Object} value
 */
MockAjax.prototype.setRequestHeader = function(header, value) {
    this.headers[header] = value;
};

/**
 * Simulate the XHR getAllResponseHeaders method
 */
MockAjax.prototype.getAllResponseHeaders = function() {
    var headers = this.responseHeaders,
        lines = [],
        header;
    
    for (header in headers) {
        if (headers.hasOwnProperty(header)) {
            lines.push(header + ': ' + headers[header]);
        }
    }
    
    return lines.join('\r\n');
};

/**
 * Simulate the XHR getResponseHeader method
 * @param {Object} name
 */
MockAjax.prototype.getResponseHeader = function(name) {
    return this.responseHeaders[name];
};

/**
 * Simulate the XHR onreadystatechange method
 */
MockAjax.prototype.onreadystatechange = function() {
};

/**
 * Method for triggering a response completion
 */
MockAjax.prototype.complete = function(response) {
    this.responseText = response.responseText || '';
    this.status = response.status;
    this.statusText = response.statusText;
    this.responseXML = response.responseXML || this.xmlDOM(response.responseText);
    this.responseHeaders = response.responseHeaders || {"Content-type": response.contentType || "application/json" };
    
    this.readyState = 4;
    this.readyChange();
};

/**
 * Converts string to XML DOM
 */
MockAjax.prototype.xmlDOM = function(xml) {
    // IE DOMParser support
    if (!window.DOMParser && window.ActiveXObject) {
        doc = new ActiveXObject('Microsoft.XMLDOM');
        doc.async = 'false';
        DOMParser = jasmine.emptyFn;
        DOMParser.prototype.parseFromString = function(xmlString) {
            var doc = new ActiveXObject('Microsoft.XMLDOM');
            doc.async = 'false';
            doc.loadXML(xmlString);
            return doc;
        };
    }
    
    if (xml && xml.substr(0, 1) === '<') {
        try {
            return (new DOMParser()).parseFromString(xml, "text/xml");
        }
        catch (e) {}
    }
    
    return null;
};

/**
 * Exports go here
 */
if (typeof window === "undefined" && typeof exports === "object") {
    exports.jasmine = jasmine;
    exports.spyOn = spyOn;
    exports.it = it;
    exports.xit = xit;
    exports.specFor = specFor;
    exports.xspecFor = xspecFor;
    exports.expect = expect;
    exports.runs = runs;
    exports.waits = waits;
    exports.waitsFor = waitsFor;
    exports.waitsForSpy = waitsForSpy;
    exports.waitsForAnimation = waitsForAnimation;
    exports.beforeEach = beforeEach;
    exports.afterEach = afterEach;
    exports.describe = describe;
    exports.xdescribe = xdescribe;
    exports.waitForFocus = waitForFocus;
    exports.waitAWhile = jasmine.waitAWhile;
    exports.focusAndWait = focusAndWait;
    exports.pressTabKey = jasmine.pressTabKey;
    exports.pressKey = pressKey;
    exports.expectFocused = jasmine.expectFocused;
    exports.focusAndExpect = jasmine.focusAndExpect;
}

var addGlobal = function(property) {
    jasmine.env.addAllowedGlobalVariable(property);
};

jasmine.addAllowedComponent = function(c, preventDestruction, marker) {
    this.env.addAllowedComponent(c, preventDestruction, marker);
};

jasmine.removeAllowedComponent = function(c, marker) {
    this.env.removeAllowedComponent(c, marker);
};

jasmine.preventGarbageCollection = function(c) {
    this.env.preventGarbageCollection(c);
}

jasmine.addAllowedListener = function(eventName) {
    this.env.addAllowedListener(eventName);
};

// This requires loaded Ext so needs to be done right before tests are starting
jasmine.env.addStartupHook(function() {
    var stickyElements;
    
    if (Ext.isModern) {
        // all tests run in normal mode by default regardless of the device
        // it is the responsibility of the tests/suites that need to test big mode
        // to add the x-big class to the documentElement before testing and remove it when done.
        Ext.theme.getDocCls = function() {};
    }
    
    if (Ext.Element) {
        jasmine._bodyRegion = new Ext.util.Region(0, window.innerWidth || document.documentElement.clientWidth, window.innerHeight || document.documentElement.clientHeight, 0);
        stickyElements = Ext.getBody().query('[data-sticky]');
        
        // calling setCapture() can cause problem with emulated mouse events
        Ext.Element.prototype.setCapture = Ext.emptyFn;
        
        // All pixels are just one pixel for test purposes
        Ext.Element.getViewportScale = function() {
            return 1;
        };
    }

    // In case some tests which access the Ext.EventObject are invoked before the first DOM event.
//         Ext.EventObject = new Ext.event.Event({});

    // ensures the body begins absolutely empty (some browsers have a default text node)
    document.body.innerHTML = '';

    // Elements which are flagged as sticky must persist as if the tests were one long running application.
    // Test code will assume that there has been no teardown.
    if (stickyElements) {
        Ext.getBody().appendChild(stickyElements);
    }

    // The deferCallback method defers execution of a function until the next animation frame.
    // In unit tests, we do not want this, we need everything to execute synchronously.
    Ext.deferCallback = Ext.callback;

    // In IE8 and below, trying to delete a property in window object will throw
    // an exception. This means we can't really remove defined named classes from
    // global namespace, and this is a problem for unit tests because it will create
    // uncleanable global variable leaks. Since there is no real solution we just cheat
    // by intercepting Ext.undefine and adding whatever top namespace it was undefining
    // to the allowedGlobals pool. We don't care about any nested namespaces here.
    if (Ext.isIE8m) {
        (function(oldFunc) {
            var global = jasmine.getGlobal();
            
            Ext.undefine = function(className) {
                var entryName = oldFunc(className);
                
                if (entryName && (entryName in global)) {
                    addGlobal(entryName);
                }
            };
        })(Ext.undefine);
    }
    
    // Errors thrown by XTemplate-generated code should not be caught;
    // they should cause test failures
    Ext.define(null, {
        override: 'Ext.XTemplate',
        
        strict: true
    });
    
    // Exceptions in TaskRunner are normally trapped but in unit tests we want them
    // to blow up and cause failures.
    Ext.define(null, {
        override: 'Ext.util.TaskRunner',
        
        disableTryCatch: true
    });
    
    // This should fire after onReady when the timer has been installed
    if (Ext.scroll && Ext.scroll.Scroller) {
        if (Ext.scroll.Scroller.initViewportScrollerTimer) {
            window.clearTimeout(Ext.scroll.Scroller.initViewportScrollerTimer);
            Ext.scroll.Scroller.initViewportScroller();
        }
    }

    // For unit tests we want to clear properties synchronously
    Ext.define(null, {
        override: 'Ext.Component',
        
        clearPropertiesOnDestroy: true
    });
    
    // We seriously want our scroller to be FASTER for testing
    Ext.define(null, {
        override: 'Ext.scroll.Scroller',
        
        scrollEndBuffer: 16
    });
    
    if (jasmine.CLEAR_PROTOTYPE) {
        Ext.define(null, {
            override: 'Ext.Base',
            
            clearPrototypeOnDestroy: true
        });
    }
    
    // Many unit tests involve Ajax requests, for which we use MockAjax object.
    // Whenever a real XMLHttpRequest object is used to make an Ajax request
    // in unit tests, most probably that's a bug and we want to catch it.
    XMLHttpRequest.prototype.send = function() {
        throw new Error("Attempt at sending XMLHttpRequest!");
    };

    // We don't want ARIA warnings to pollute the console
    Ext._ariaWarn = Ext.ariaWarn;
    Ext.ariaWarn = Ext.emptyFn;
    
    (function() {
        var global = jasmine.getGlobal(),
            lastTime = 0,
            clock = jasmine.Clock,
            setTimeout = jasmine._setTimeout,
            clearTimeout = jasmine._clearTimeout,
            realExtAsap = Ext.asap,
            realExtAsapCancel = Ext.asapCancel,
            requestAnimFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame ||
                global.mozRequestAnimationFrame || global.oRequestAnimationFrame ||
                function(callback) {
                    var currTime = Ext.now(),
                        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                        id = setTimeout(function() {
                            callback(currTime + timeToCall);
                        }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                },
            cancelAnimFrame = global.cancelAnimationFrame || global.webkitCancelAnimationFrame ||
                global.mozCancelAnimationFrame || global.oCancelAnimationFrame ||
                function(timerId) {
                    clearTimeout(timerId);
                };
        
        // Track animation frame requests too.
        Ext.Function.requestAnimationFrame = function(funcToCall, scope, args) {
            var wrapFunc = function() {
                    delete clock.scheduledFunctions[timeoutKey];
                    
                    if (args && args.length) {
                        funcToCall.apply(scope, args);
                    }
                    else {
                        funcToCall.call(scope);
                    }
                },
                timeoutKey = clock.nextTimeoutKey++,
                realTimeoutKey,
                spec = jasmine.env.currentSpec;
            
//             if (timeoutKey === 100009) {
//                 debugger;
//             }
    
            // Must use bind. pass passes an extra parameter on the end!
            if (Ext.elevateFunction) {
                wrapFunc = Ext.Function.bind(Ext.elevateFunction, null, [wrapFunc, scope, args]);
            }
            
            realTimeoutKey = requestAnimFrame(wrapFunc);
    
            clock.scheduledFunctions[timeoutKey] = {
                type: 'requestAnimationFrame',
                realTimeoutKey: realTimeoutKey,
                scheduledFn: funcToCall,
                funcToCall: wrapFunc,
                created: jasmine.CAPTURE_CALL_STACK ? new Error().stack : null,
                spec: spec ? spec.getFullName(true) : null,
                $skipTimerCheck: funcToCall.$skipTimerCheck
            };
            
            return timeoutKey;
        };
        
        Ext.Function.cancelAnimationFrame = function(timeoutKey) {
            var scheduledObject = clock.scheduledFunctions[timeoutKey];
    
            // We can only handle it if it is one of ours
            if (scheduledObject) {
                delete clock.scheduledFunctions[timeoutKey];
                cancelAnimFrame(scheduledObject.realTimeoutKey);
            }
        };
        
        // Also, for platforms which do not have setImmediate, ensure that no Ext.asap
        // consequences leak into the next spec.
        Ext.asap = function(funcToCall, scope, args) {
            var wrapFunc = function() {
                    delete clock.scheduledFunctions[timeoutKey];
                    
                    if (args && args.length) {
                        funcToCall.apply(this, args);
                    }
                    else {
                        funcToCall.call(this);
                    }
                },
                timeoutKey = clock.nextTimeoutKey++,
                spec = jasmine.env.currentSpec,
                realTimeoutKey;
            
            // Real Ext.asap will call either window.setImmediate() or window.setTimeout(),
            // both of which are be intercepted by jasmine.Clock. We don't need that additional
            // layer of interception here.
            if (global.setImmediate) {
                global.setImmediate = jasmine._setImmediate;
            }
            else {
                global.setTimeout = jasmine._setTimeout;
            }
            
            realTimeoutKey = realExtAsap.call(Ext, wrapFunc, scope, args);
            
            if (global.setImmediate) {
                global.setImmediate = clock.installed.setImmediate;
            }
            else {
                global.setTimeout = clock.installed.setTimeout;
            }
    
            clock.scheduledFunctions[timeoutKey] = {
                type: 'asap',
                realTimeoutKey: realTimeoutKey,
                scheduledFn: funcToCall,
                funcToCall: wrapFunc,
                created: jasmine.CAPTURE_CALL_STACK ? new Error().stack : null,
                spec: spec ? spec.getFullName(true) : null,
                $skipTimerCheck: funcToCall.$skipTimerCheck
            };
            
            return timeoutKey;
        };
        
        Ext.asapCancel = function(timeoutKey) {
            var scheduledObject = clock.scheduledFunctions[timeoutKey];
    
            // We can only handle it if it is one of ours
            if (scheduledObject) {
                delete clock.scheduledFunctions[timeoutKey];
                
                if (global.clearImmediate) {
                    global.clearImmediate = jasmine._clearImmediate;
                }
                else {
                    global.clearTimeout = jasmine._clearTimeout;
                }
                
                realExtAsapCancel.call(Ext.Function, scheduledObject.realTimeoutKey);
                
                if (global.clearImmediate) {
                    global.clearImmediate = clock.installed.clearImmediate;
                }
                else {
                    global.clearTimeout = clock.installed.clearTimeout;
                }
            }
        };
    })();
    
    // We would love to catch runaway Promises, too, but there's a tiny problem
    // of what to do with them when that happens. See comment in checkResourceLeaks()
//     if (jasmine.DEBUGGING_MODE) {
//         (function() {
//             var id = 0;
//             
//             Ext.define(null, {
//                 override: 'Ext.promise.Consequence',
//                 
//                 schedule: function(callback) {
//                     if (jasmine.CAPTURE_CALL_STACK) {
//                         callback.$createdAt = new Error().stack;
//                     }
//                     
//                     // IE8 does not support collecting stack trace,
//                     // so we have to use another way.
//                     callback.$id = ++id;
//                     
//                     return this.callParent([callback]);
//                 }
//             });
//         })();
//     }

    if (Ext.isClassic) {
        // Our test suite assumes that unspecified header text will still show headers.
        // 6.2 sets hideHeaders if there is no header text, no grouped headers,
        // and hideHeaders is not in the class.
        // So we override it just for tests.
        // This is tested in Ext.tree.TreeGrid tests, "collapsing locked TreeGrid" suite.
        //
        // Note that tests which test auto-selection of header visibility must override this.
        Ext.define(null, {
            override: 'Ext.grid.Panel',

            config: {
                hideHeaders: false
            }
        });
        
        // Testing always uses the classic row height
        Ext.define(null, {
            override: 'Ext.grid.plugin.BufferedRenderer'
        },
        function(BufferedRenderer) {
            BufferedRenderer.prototype.themeRowHeight = BufferedRenderer.prototype.rowHeight;
        });
        
        Ext.define(null, {
            override: 'Ext.form.Basic',
            
            taskDelay: 0
        });
        
        // The Ext.form.* unit tests test the layout of msgTarget: 'qtip'
        // So when that is defaulted to 'side' on touch platforms, we must fix it.
        Ext.define(null, {
            override: 'Ext.form.field.Base',
            
            msgTarget: 'qtip'
        });
        
        Ext.define(null, {
            override: 'Ext.form.Labelable',
            
            msgTarget: 'qtip'
        });
        
        // We do not want waits when we control the mouse in tests
        Ext.define(null, {
            override: 'Ext.menu.Item',
            
            menuExpandDelay: 0
        });

        // Usually MenuManager will register these listeners lazily but we need them
        // upfront to be accounted as allowed for leak checks
        Ext.define(null, {
            override: 'Ext.menu.Manager'
        },
        function() {
            Ext.menu.Manager.registerGlobalListeners();
        });
        
        // QuickTips should also be there before tests start, if any of the tests require it
        Ext.define(null, {
            override: 'Ext.tip.QuickTipManager'
        }, function() {
            var tip;
            
            Ext.QuickTips.init();
            
            if (tip = Ext.QuickTips.tip) {
                jasmine.addAllowedComponent(tip, true, true);
                jasmine.preventGarbageCollection(tip);
            }
        });
    }
    
    if (!jasmine.CHECK_LEAKS) {
        Ext.Base.prototype.clearReferencesOnDestroy = false;
    }
    else {
        var env = jasmine.env;
        
        addGlobal([
            // IE10 needs this
            'devicePixelRatio',
            
            // Old Firefox needs these
            'getInterface',
            'loadFirebugConsole',
            '_createFirebugConsole',
            'netscape',
            'XPCSafeJSObjectWrapper',
            'XPCNativeWrapper',
            'Components',
            '_firebug',
            
            // IE10+ F12 dev tools adds these properties when opened.
            '_IE_DEVTOOLBAR_CONSOLE_COMMAND_LINE',
            '__BROWSERTOOLS_CONSOLE_BREAKMODE_FUNC',
            '__BROWSERTOOLS_CONSOLE_SAFEFUNC',
            
            // in IE8 jasmine's overrides of setTimeout/setInterval make them iterable
            'setTimeout',
            'setInterval',
            'clearTimeout',
            'clearInterval'
        ]);
        
        if (document.addEventListener) {
            // Browsers that don't support passive events will interpret the options object
            // as truthy value, with effectively the same result. Browsers that do support
            // passive listeners might run a bit snappier.
            document.body.addEventListener('scroll', env.bodyScrollListener, {
                capture: true,
                passive: true
            });
        }
        else {
            document.body.attachEvent('onscroll', env.bodyScrollListener);
        }
        
        if (Ext.Element) {
            // We need to check if these Ext.dom.Element instances' methods
            // were overridden or new methods were injected. We only care about
            // important persistent ones hence the name.
            env.importantElementInstances.push(
                Ext.getWin(),
                Ext.getDoc(),
                Ext.getHead(),
                Ext.getBody(),
                Ext.getDetachedBody()
            );
            
            // These methods are allowed to be added to the instance
            env.allowedImportantElementInstanceMethods.getUniqueId = true;
            
            env.detachedBody = Ext.getDetachedBody().dom;
        }
        
        // Tag all instances of Ext classes with their full origin and id.
        // This helps greatly tracking down component leaks.
        Ext.Base.prototype.constructor = Ext.Function.createInterceptor(Ext.Base.prototype.constructor, function() {
            var spec = jasmine.env.currentSpec;
            
            if (jasmine.CAPTURE_CALL_STACK) {
                this.$createdAt = new Error().stack;
            }
            
            // If we are within a spec, capture the full name
            if (spec) {
                this.$spec = spec.getFullName();
            }
            
            if (this.id == null) {
                Ext.id(this, (this.$className ? this.$className.replace(/\./g, '-') : 'ext-'));
            }
        });

        // Ext.sparkline.Base puts this tooltip on its prototype
        Ext.define(null, {
            override: 'Ext.sparkline.Base'
        }, function() {
            Ext.onInternalReady(function() {
                var tooltip = Ext.sparkline.Base.prototype.tooltip;
                
                if (tooltip) {
                    jasmine.addAllowedComponent(tooltip, true, true);
                    jasmine.preventGarbageCollection(tooltip);
                }
            });
        });
        
        // Block unregistration of allowed components
        Ext.define(null, {
            override: 'Ext.ComponentManager',
            
            unregister: function(cmp) {
                var spec;
                
                if (cmp.$allowedComponent) {
                    spec = jasmine.env.currentSpec;
                    
                    if (spec) {
                        jasmine.console.error(spec.getFullName() + ' attempted to unregister ' + cmp.id);
                        spec.fail('attempted to unregister ' + cmp.id);
                    }
                    else {
                        jasmine.console.error('Attempted to unregister allowed component: ' + cmp.id);
                    }
                }
                else {
                    this.callParent([cmp]);
                }
            }
        });
        
        // Make sure MessageBox is allowed and stickied upfront
        Ext.define(null, {
            override: Ext.isModern ? 'Ext.MessageBox' : 'Ext.window.MessageBox'
        },
        function() {
            // This should come right after the function that creates MessageBox instance
            Ext.onInternalReady(function() {
                var msgbox = Ext.Msg;

                // Allow the MessageBox's centering window resize listener to persist.
                if (msgbox && Ext.isModern) {
                    msgbox.show(null);
                    jasmine.addAllowedListener('resize');
                    msgbox.hide(null);
                }

                jasmine.addAllowedComponent(msgbox, true, true);
                jasmine.preventGarbageCollection(msgbox);
        
                // Tag the MessageBox el with stickness so it doesn't get detected as leaked DOM
                if (msgbox.rendered) {
                    msgbox.el.dom.setAttribute('data-sticky', 'true');
                }
                else {
                    msgbox.on({
                        render: function(cmp) {
                            cmp.el.dom.setAttribute('data-sticky', 'true');
                        },
                        single: true
                    });
                }
            });
        });
        
        // Default ZIndexManager is not a component but we want
        // to allow its listeners to linger on GlobalEvents
        Ext.define(null, {
            override: 'Ext.ZIndexManager'
        },
        function() {
            if (Ext.WindowManager) {
                jasmine.addAllowedComponent(Ext.WindowManager.id);
            }
        });
        
        Ext.define(null, {
            override: 'Ext.data.StoreManager',
            
            lookup: function(store, defaultType) {
                var result = this.callParent([store, defaultType]);
                
                if (result && result.autoDestroy && !result.isEmptyStore && !result.$trackedResource) {
                    result.$trackedResource = true;
                    this.autoCreatedStores.push(result);
                }
                
                return result;
            },
            
            clear: function() {
                this.callParent();
                this.autoCreatedStores.length = 0;
            }
        },
        function(StoreManager) {
            StoreManager.autoCreatedStores = [];
        });
        
        Ext.define(null, {
            override: 'Ext.TaskQueue'
        },
        function() {
            // Ext.TaskQueue usage is just too contrived to clean it up at this time
            Ext.TaskQueue.run.$skipTimerCheck = Ext.TaskQueue.run.$clearTimer = true;
        });
        
        Ext.define(null, {
            override: 'Ext.AnimationQueue'
        }, function() {
            // Same goes for AnimationQueue
            Ext.AnimationQueue.run.$skipTimerCheck = Ext.AnimationQueue.run.$clearTimer = true;
        });

        // The number of classes in the framework. Tests must not add or remove.
        env.baseClassCount = Ext.ClassManager.classCount;
        
        if (Ext.ComponentMgr) {
            // This warrants an additional check because Component might not be loaded
            // if we're only testing Widgets!
            if (Ext.Component && Ext.ComponentMgr.installFocusListener) {
                Ext.ComponentMgr.installFocusListener();
            }
        }
        
        env.rootSuite.it('There should be no resource leaks before test suite start', function() {
            var allowedComponents = this.env.allowedComponents,
                leaks = [],
                components, cmp, i, len;
            
            if (Ext.ComponentMgr) {
                components = Ext.ComponentMgr.getAll();
                
                // Ext.MessageBox and its children are going to be present in all tests.
                // The reason why we don't just add allow everything that is already present
                // in Ext.ComponentMgr collection is that sometimes components are created
                // by mistake in spec definition. We want to catch these as well.
                for (i = 0, len = components.length; i < len; i++) {
                    cmp = components[i];
                    
                    if (!allowedComponents[cmp.id]) {
                        leaks.push(cmp);
                    }
                }
                
                if (leaks.length) {
                    jasmine.console.error('COMPONENTS EXIST BEFORE TEST SUITE START');
                    jasmine.console.dir(leaks);
                    
                    expect(leaks).toCleanup('Components exist before test suite start');
                }
                
                // Destroy only disallowed components
                if (leaks.length) {
                    Ext.destroy(leaks);
                }
            }
            
            // beforeAll will automatically enumerate resources the first time it kicks in,
            // but we need the list to be up to snuff before that ever happens
            this.env.enumerateResources(false, true);
        }, { toStart: true, totalSpecs: 0, skipBeforesAndAfters: true });
    }
});
