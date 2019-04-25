/**
 * We use Test namespace for all Reporter code to avoid contaminating either
 * jasmine or Ext.
 */

var Test = Test || {};

/**
 * Maximum levels of nesting that will be included when an object is pretty-printed
 */
Test.MAX_PRETTY_PRINT_DEPTH = 40;

/**
 * Maximum number of test specs to run individually via URL parameters.
 * This number depends on the browser and server URL length limitations.
 */
Test.MAX_INDIVIDUAL_SPECS = 180;

/**
 * Status update interval in ms. By default the interval is 0, and status is updated
 * immediately whenever a new spec is started. However updating the status is quite taxing
 * on time in slower browsers, and is almost completely useless in CI environment
 * so it's better to set this to something reasonable for unattended test runs.
 */
Test.STATUS_UPDATE_INTERVAL = 100;

(function() {
    var objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        enumerables = ['valueOf', 'toLocaleString', 'toString', 'constructor'];
    
    for (var i in { toString: 1 }) {
        enumerables = null;
    }
    
    Test.apply = function(object, config, defaults) {
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
    
    Test.apply(Test, {
        array: {},
        browser: {},
        
        util: {
            isArray: function(value) {
                return toString.apply(value) === '[object Array]';
            },
            
            isObjectEmpty: function(object) {
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        return false;
                    }
                }
                
                return true;
            },
            
            cloneObject: function(object) {
                var result = {},
                    key;
                
                if (object) {
                    for (key in object) {
                        if (object.hasOwnProperty(key)) {
                            result[key] = object[key];
                        }
                    }
                }
                
                return result;
            },
            
            htmlEscape: function(str) {
                if (!str) {
                    return str;
                }
                
                // Avoid mangling &smth; HTML entities by matching only ampersand
                // characters _not_ followed by either one or more word chars or
                // # and one or more digits, finished by semicolon
                return str.replace(/&(?!(?:#\d+|\w+);)/g, '&amp;').
                           replace(/</g, '&lt;').
                           replace(/>/g, '&gt;');
            }
        }
    });
})();

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

/**
 * Basic browsers detection.
 */
Test.browser = (function() {
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


/**
 * Checks whether or not the specified item exists in the array.
 * Array.prototype.indexOf is missing in Internet Explorer, unfortunately.
 * We always have to use this static method instead for consistency
 * @param {Array} array The array to check
 * @param {Mixed} item The item to look for
 * @param {Number} from (Optional) The index at which to begin the search
 * @return {Number} The index of item in the array (or -1 if it is not found)
 */
Test.array.indexOf = function(array, item, from) {
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
 * @param {Array} array The array
 * @param {Mixed} item The item to remove
 * @return {Array} The passed array itself
 */
Test.array.remove = function(array, item) {
    var index = Test.array.indexOf(array, item);
    
    if (index !== -1) {
        array.splice(index, 1);
    }
    
    return array;
};

/**
 * Pretty printer for expectations. Takes any object and turns it into a human-readable string.
 *
 * @param {Mixed} value A value to be outputted
 *
 * @return {String} Resulting string representation
 */
Test.pp = function(value) {
    var prettyPrinter = new Test.PrettyPrinter();
    
    prettyPrinter.format(value);
    
    return prettyPrinter.toString();
};

Test.PrettyPrinter = function(config) {
    Test.apply(this, config);
    
    this.ppNestLevel = 0;
    this.string = '';
    
    if (!this.MAX_PRETTY_PRINT_DEPTH) {
        this.MAX_PRETTY_PRINT_DEPTH = Test.MAX_PRETTY_PRINT_DEPTH;
    }
};

Test.apply(Test.PrettyPrinter.prototype, {
    /**
     * Takes the passed value and formats it into the internal string
     * representation. Returns nothing. To get the resulting string value,
     * do not forget to call prettyPrinter.toString().
     * 
     * @param {Mixed} value
     */
    format: function(value) {
        var className, superclass, isArray;
        
        if (this.ppNestLevel > this.MAX_PRETTY_PRINT_DEPTH) {
            throw new Error('Test.PrettyPrinter: format() nested too deeply!');
        }
        
        this.ppNestLevel++;
        
        try {
            if (value === undefined) {
                this.append('undefined');
            }
            else if (value === null) {
                this.append('null');
            }
            // If all these are present it's most probably a Window
            else if (value.document && value.location && value.alert && value.setInterval) {
                this.append('<window>');
            }
            else if (typeof value === 'string') {
                this.append('"' + value + '"');
            }
            else if (value instanceof RegExp) {
                this.append(value.toString());
            }
            else if (value.expectedClass) {   //override of value instanceof jasmine.Matchers.Any
                this.append(value.toString());
            }
            else if (value.isSpy) {
                this.append("spy on " + (value.identity || 'unknown'));
            }
            else if (typeof value === 'function') {
                this.append('Function');
            }
            else if (typeof value.nodeType === 'number') {
                this.append('HTMLNode');
            }
            else if (value instanceof Date) {
                this.append('Date(' + value + ')');
            }
            // Assignment in conditional is intended
            else if ((className = value.$className) !== undefined) {
                // support for pretty printing instances of Ext classes
    
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
                
                this.append(className + '#' + (value.id || (value.getId && value.getId())));
            }
            else if (value.__Jasmine_been_here_before__) {
                this.append('<circular reference: ' + (Test.util.isArray(value) ? 'Array' : 'Object') + '>');
            }
            else if ((isArray = Test.util.isArray(value)) || typeof value === 'object') {
                value.__Jasmine_been_here_before__ = true;
                
                if (isArray) {
                    this.emitArray(value);
                }
                else {
                    this.emitObject(value);
                }
                
                delete value.__Jasmine_been_here_before__;
            }
            else {
                this.append(value.toString());
            }
        }
        catch (e) {}
        finally {
            this.ppNestLevel--;
        };
    },
    
    append: function(value) {
        this.string += value;
    },
    
    iterateObject: function(obj, fn, scope) {
        var property;
        
        scope = scope || this;
        
        for (property in obj) {
            if (!obj.hasOwnProperty(property) || property === '__Jasmine_been_here_before__') {
                continue;
            }
            
            fn.call(
                scope,
                property,
                obj.__lookupGetter__ ? (obj.__lookupGetter__(property) !== undefined && 
                obj.__lookupGetter__(property) !== null) : false
            );
        }
    },
    
    emitArray: function(array) {
        var i, len;
        
        if (this.ppNestLevel > this.MAX_PRETTY_PRINT_DEPTH) {
            this.append("Array");
            
            return;
        }
        
        this.append('[ ');
        
        for (i = 0, len = array.length; i < len; i++) {
            if (i > 0) {
                this.append(', ');
            }
            
            this.format(array[i]);
        }
        
        this.append(' ]');
    },
    
    emitObject: function(obj) {
        var first = true,
            i = 0,
            indent;
        
        if (this.ppNestLevel > this.MAX_PRETTY_PRINT_DEPTH) {
            this.append("Object");
            
            return;
        }
        
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
        
        this.append(indent + '\n' + indent + '}');
    },
    
    getIndent: function() {
        var whiteSpaces = [],
            i, len;
            
        for (i = 0, len = this.ws; i < len; i++) {
            whiteSpaces.push(' ');
        }
    
        return whiteSpaces.join('');
    },
    
    toString: function() {
        return this.string;
    }
});

/**
 * Creates an HTMLElement.
 * @param {Object/HTMLElement} config Ext DomHelper style element config object.
 * If no tag is specified (e.g., {tag:'input'}) then a div will be automatically generated with the specified attributes.
 * @return {HTMLElement} The created HTMLElement
 */
Test.Dom = function(config) {
    var element, children, length, child, i, property;
    
    config = config || {};
    
    if (config.tagName) {
        return config;
    }
    
    element = document.createElement(config.tag || "div");
    children = config.children || [];
    length = children.length;

    delete config.tag;
    
    for (i = 0; i < length; i++) {
        child = children[i];
        element.appendChild(new Test.Dom(child));
    }
    delete config.children;
    
    if (config.cls) {
        Test.Dom.setCls(element, config.cls);
        delete config.cls;
    }

    if (config.html) {
        Test.Dom.setHTML(element, config.html);
        delete config.html;
    }

    if (config.style) {
        Test.Dom.setStyle(element, config.style);
        delete config.style;
    }
    
    for (property in config) {
        if (!config.hasOwnProperty(property)) {
            continue;
        }
        element[property] = config[property];
    }

    return element;
};

/**
 * Adds className to an HTMLElement.
 * @param {HTMLElement} element The HTMLElement
 * @param {String} cls The className string
 */
Test.Dom.addCls = function(element, cls) {
    var split, len, i;
    
    if (cls.indexOf(' ') !== -1) {
        split = cls.split(' ');
        
        for (i = 0, len = split.length; i < len; i++) {
            Test.Dom.addCls(element, split[i]);
        }
        
        return;
    }
    
    if (!element.className) {
        Test.Dom.setCls(element, cls);
        
        return;
    }
    
    split = element.className.split(" ");
    
    for (i = 0, len = split.length; i < len; i++) {
        if (split[i] == cls) {
            return;
        }
    }
    
    element.className = element.className + " " + cls;
};

/**
 * Removes className to HTMLElement.
 * @param {HTMLElement} element The HTMLElement
 * @param {String} cls The className string
 */
Test.Dom.removeCls = function(element, cls) {
    var split, len, classArray, i;
    
    if (!element.className) {
        return;
    }
    
    if (cls.indexOf(' ') !== -1) {
        split = cls.split(' ');
        
        for (i = 0, len = split.length; i < len; i++) {
            Test.Dom.removeCls(element, split[i]);
        }
        
        return;
    }
    
    classArray = [];
    split = element.className.split(" ");
    
    for (i = 0, len = split.length; i < len; i++) {
        if (split[i] !== cls) {
            classArray.push(split[i]);
        }
    }
    
    element.className = classArray.join(" ");    
};

/**
 * Checks if a dom element has a className.
 * @param {HTMLElement} element The HTMLElement
 * @param {String} cls The className string
 * @return {Boolean}
 */
Test.Dom.hasCls = function(element, cls) {
    var split, length, classArray, i;
    
    if (!element.className) {
        return;
    }
    
    split = element.className.split(" ");
    length = split.length;
    
    for (i = 0; i < length; i++) {
        if (split[i] === cls) {
            return true;
        }
    }
    
    return false;   
};

/**
 * Sets HTMLElement className.
 * @param {HTMLElement} element The HTMLElement
 * @param {String} cls The className string
 */
Test.Dom.setCls = function(element, cls) {
    element.className = cls;
};

/**
 * Sets HTMLElement innerHTML
 * @param {HTMLElement} element The HTMLElement
 * @param {String} html The innerHTML text
 */
Test.Dom.setHTML = function(element, html) {
    element.innerHTML = html;
};

/**
 * Sets HTMLElement style
 * @param {HTMLElement} element The HTMLElement
 * @param {String} style The style property to set
 */
Test.Dom.setStyle = function(element, style) {
    var property;
    for (property in style) {
        if (style.hasOwnProperty(property)) {
            element.style[property] = style[property];
        }
    }
};

Test.OptionsImpl = function() {
    this.optionCheckBoxesEl = {};
    this.options = this.urlDecode(window.location.search.substring(1));
    this.options.remote = window.location.toString().search("http:") !== -1;
    this.startAutoReloadTask();
};

Test.OptionsImpl.prototype.get = function() {
    return this.options;
};

Test.OptionsImpl.prototype.getCurrentChunk = function(array, split) {
    var chunkerFn = Test.chunker,
        chunk, numChunks, len, chunks, i, size;

    split = split || this.options['chunkify'] || this.options['cmd-test-split'];

    if (split) {
        split = split.split('/');
        chunk = +split[0];
        numChunks = +split[1];

        if (chunkerFn) {
            chunks = chunkerFn(array, chunk, numChunks);
            
            if (chunks !== false) {
                return chunks;
            }
        }

        chunks = [];

        for (i = 0, len = array.length; i < len; ) {
            size = Math.ceil((len - i) / numChunks--);  // TODO "numChunks--" ???
            chunks.push(array.slice(i, i += size));
        }

        array = chunks[chunk];
    }

    return array;
};

/**
 * Takes an object and converts it to an encoded URL.
 * @param {Object} object The object to encode
 * @return {String}
 */
Test.OptionsImpl.prototype.urlEncode = function(object) {
    var buf = [],
        testIds = {},
        topSuites, property, value, id, length, i;
    
    // We don't want to mutate the original options object
    topSuites = Test.util.cloneObject(object.topSuites);
    
    if (object.testIds) {
        for (id in object.testIds) {
            value = object.testIds[id];
            testIds[id] = value.toString(16);
        }
    }
    
    for (property in object) {
        if (property === 'topSuites' || property === 'testIds') {
            continue;
        }
        
        value = object[property];
        
        if (Test.util.isArray(value)) {
            length = value.length;
            
            for (i = 0; i < length; i++) {
                buf.push(property + '=' + encodeURIComponent(value[i]));
            }
        }
        else {
            buf.push(property + '=' + encodeURIComponent(value));
        }
    }
    
    for (id in topSuites) {
        // This looks shorter than topSuites * number of suites
        buf.push('load=' + encodeURIComponent(id));
    }
    
    // Make sure test ids are always coming last in the URI
    for (id in testIds) {
        value = testIds[id];
        
        // Again looks shorter than testIds * number of ids
        buf.push('run=' + encodeURIComponent(value));
    }
    
    return buf.join('&');
};

/**
 * Takes an encoded URL and and converts it to an object. Example:
 * @param {String} string
 * @return {Object} A literal with members
 */
Test.OptionsImpl.prototype.urlDecode = function(string) {
    var obj = {},
        pairs, name, value, pair, i, len;
    
    if (string != "") {
        pairs = string.split('&');
        
        for (i = 0, len = pairs.length; i < len; i++) {
            pair = pairs[i].split('=');
            name = decodeURIComponent(pair[0]);
            value = decodeURIComponent(pair[1]);
            value = value === 'true' ? true : value === 'false' ? false : value;
            obj[name] = !obj[name] ? value : [].concat(obj[name], value);
        }
    }
    
    obj.topSuites = {};
    obj.testIds = {};
    
    // If load map is populated, only top level suites listed in it
    // will be allowed to load and run describe(). Any other top level
    // suites will be rejected by the filter.
    // We convert input array to map for speedier lookups.
    if (obj.load) {
        pairs = Test.util.isArray(obj.load) ? obj.load : [obj.load];
        
        for (i = 0, len = pairs.length; i < len; i++) {
            obj.topSuites[pairs[i]] = true;
        }
        
        delete obj.load;
    }
    
    // The run map contains ids for suites and specs allowed to execute.
    if (obj.run) {
        pairs = Test.util.isArray(obj.run) ? obj.run : [obj.run];
        
        for (i = 0, len = pairs.length; i < len; i++) {
            value = parseInt(pairs[i], 16);
            obj.testIds[value] = value;
        }
        
        delete obj.run;
    }
    
    // Old array holds the originally requested top suites, saved for coming back
    // from Checked or Failed runs.
    if (obj.old) {
        obj.old = Test.util.isArray(obj.old) ? obj.old : [obj.old];
    }
    
    // suites and specs parameters are supported for backwards compatibility
    if (obj.suites) {
        pairs = Test.util.isArray(obj.suites) ? obj.suites : [obj.suites];
        
        for (i = 0, len = pairs.length; i < len; i++) {
            // This could be either top suite name or decimal id
            if (isNaN(+pairs[i])) {
                obj.topSuites[pairs[i]] = true;
            }
            else {
                obj.testIds[value] = +pairs[i];
            }
        }
        
        delete obj.suites;
    }
    
    if (obj.specs) {
        pairs = Test.util.isArray(obj.specs) ? obj.specs : [obj.specs];
        
        for (i = 0, len = pairs.length; i < len; i++) {
            // This can only be decimal id
            value = +pairs[i];
            obj.testIds[value] = value;
        }
        
        delete obj.specs;
    }
    
    return obj;
};

Test.OptionsImpl.prototype.mapNameToId = function(name, id) {
    var tests = this.options.testIds;
    
    if (tests[name]) {
        delete tests[name];
        tests[id] = name;
    }
};

/**
 * Renders option checkbox and label.
 * @param {String} name The option name.
 * @param {String} labelText The label text.
 * @return {HTMLElement} The option HTMLElement
 */ 
Test.OptionsImpl.prototype.renderCheckbox = function(name, labelText) {
    var me = this,
        checkbox = new Test.Dom({
            tag: "input",
            cls: "option " + name,
            id: name,
            type: "checkbox",
            onclick: function() {
                me.onCheckboxClick.apply(me, arguments);
            }
        });
        
    me.optionCheckBoxesEl[name] = checkbox; 
      
    return new Test.Dom({
        tag: "span",
        cls: "show",
        children: [checkbox,{
            tag: "label",
            html: labelText,
            htmlFor: name
        }]
    });
};

/**
 * Checks options checkboxs if needed. 
 */
Test.OptionsImpl.prototype.check = function() {
    var property, checkbox;
    
    for (property in this.options) {
        if (!this.options.hasOwnProperty(property)) {
            continue;
        }
        
        checkbox = this.optionCheckBoxesEl[property];
        
        if (checkbox) {
            checkbox.checked = this.options[property];
        }
    }
};

/**
 * Options checkbox check/uncked handler.
 * @param {HTMLElement} el The checkbox HTMLElement
 */
Test.OptionsImpl.prototype.onCheckboxClick = function(event) {
    var el, i, opt, url;

    event = event || window.event;
    el = event.target || event.srcElement;
    opt = el.className.split(" ")[1];
    
    if (el.checked) { 
       this.options[opt] = true;
    }
    else {
        delete this.options[opt];
    }

    // Put the proper URL in the address bar but don't reload
    if (history.pushState) {
        url = location.href;

        i = url.indexOf('?');
        if (i > -1) {
            url = url.substr(0, i);
        }

        url += '?' + this.formLoadUrl(false);

        history.pushState(null, '', url);
    }
};

Test.OptionsImpl.prototype.mergeSuites = function(options) {
    // This is a dirty hack, no time to do it properly now :/
    var treeGrid = Test.SandBox.reporter.treeGrid,
        suites = treeGrid.suites,
        specs = treeGrid.specs,
        topSuites, testIds, result, old, id, suiteOrSpec, topSuite;
    
    // We don't want to mutate inbound objects
    result = Test.util.cloneObject(options);
    topSuites = Test.util.cloneObject(options.topSuites);
    testIds = Test.util.cloneObject(options.testIds);
    
    // topSuiteRe should be regenerated every time
    if (result.topSuiteRe) {
        delete result.topSuiteRe;
        old = [];
        
        if (!Test.util.isObjectEmpty(testIds)) {
            // Reducing the object dynamically is safe
            for (topSuite in topSuites) {
                if (topSuite.substr(topSuite.length - 1) === '*') {
                    old.push(topSuite);
                    delete topSuites[topSuite];
                }
            }
        }
        
        if (old.length) {
            result.old = old;
        }
    }
    
    for (id in options.testIds) {
        suiteOrSpec = specs[id] || suites[id];
        
        if (suiteOrSpec) {
            topSuite = suiteOrSpec.getTopSuite();
            topSuites[topSuite.fullName] = true;
            
            // If top suite is marked to run, unmark child suite/spec
            if (options.testIds[topSuite.getId()]) {
                delete testIds[id];
            }
        }
    }
    
    result.topSuites = topSuites;
    result.testIds = testIds;
    
    return result;
};

/**
 * Forms the URL for further window reloading
 */
Test.OptionsImpl.prototype.formLoadUrl = function(reset, options) {
    var suite, i, len;

    options = options || Test.util.cloneObject(this.options);
    
    if (reset) {
        options.topSuites = {};
        options.testIds = {};
        
        if (options.old && options.old.length) {
            for (i = 0, len = options.old.length; i < len; i++) {
                suite = options.old[i];
                options.topSuites[suite] = true;
            }
            
            delete options.old;
        }
    }
    
    return this.urlEncode(this.mergeSuites(options));
};

/**
 * Reloads current page with reporter options.
 */
Test.OptionsImpl.prototype.reloadWindow = function(reset) {
    var location = window.location,
        encoded;
    
    encoded = this.formLoadUrl(reset);
    
    if (location.search === '?' + encoded) {
        location.reload();
    }
    else {
        location.search = encoded;
    }
};

/**
 * Collect the failed test suite ids into the options.
 */
Test.OptionsImpl.prototype.collectFailed = function(limit) {
    var items = document.querySelectorAll('.spec.failed'),
        options = Test.util.cloneObject(Test.Options.options),
        specs = [],
        id, spec, suites, i, len, compressed;
    
    // reset so as not to compete with any previously set checkboxes
    if (options.topSuiteRe) {
        delete options.topSuiteRe;
        suites = [];
        
        for (id in options.topSuites) {
            if (id.substr(id.length - 1) === '*') {
                suites.push(id);
            }
        }
        
        if (suites.length) {
            options.old = suites;
        }
    }
    
    options.topSuites = {};
    options.testIds = {};
    
    for (i = 0, len = items.length; i < len; i++) {
        id = items[i].id.replace('spec-', '');
        spec = this.specs[id];
        
        if (spec) {
            specs.push(spec);
        }
        else {
            throw 'Spec not found: ' + id;
        }
    }
    
    // With a large number of specs we can hit URL length limit;
    // it depends on the browser and server configuration but generally
    // we can fit about 180 spec ids in the URL. If there's more specs
    // to run, we need to compress the list by finding parent suite
    // for two or more specs and running the suite instead of the
    // individual specs.
    compressed = true;
    while (specs.length > Test.MAX_INDIVIDUAL_SPECS && compressed) {
        suites = {};

        // Replace specs with suites
        compressed = false;
        for (i = 0, len = specs.length; i < len; i++) {
            if (specs[i].getParentSuite) {
                spec = specs[i].getParentSuite();

                // If we hit the root, do not include it.
                if (!spec.getParentSuite()) {
                    continue;
                }
                compressed = true;
            }
            suites[spec.getId()] = spec;
        }
        
        specs.length = 0;
        
        for (id in suites) {
            specs.push(suites[id]);
        }        
    }
    
    len = limit != null ? limit : specs.length;
    
    for (i = 0; i < len; i++) {
        spec = specs[i];
        
        // These will always be Spec or Suite objects
        if (spec.id) {
            options.testIds[spec.id] = spec.id;
        }        
    }
    
    return options;
};

/**
 * Starts autoReload task.
 */
Test.OptionsImpl.prototype.startAutoReloadTask = function() {
    var me = this;
    
    if (me.options.autoReload) {
        var interval = setInterval(function() {
            if (Test.SandBox.isRunning()) {
                clearInterval(interval);
            
                setTimeout(function() {
                    me.reloadWindow();
                }, 2000);
            }
        }, 1500);
    }
};

Test.OptionsImpl.prototype.isChecked = function(o) {
    var options = this.options;
    
    return options.testIds[o.getId()] || (options.topSuites[o.fullName] && !o.filtered);
};

Test.Options = new Test.OptionsImpl();
Test.SandBoxImpl = function() {};

Test.SandBoxImpl.prototype.domReady = function(fn) {
    if (window.addEventListener) {
        window.addEventListener('load', fn, false);
    }
    else {
        window.attachEvent('onload', fn);
    }
};  

Test.SandBoxImpl.prototype.setup = function(config) {
    var me = this;
    
    Test.apply(me, config);
    
    me.domReady(function() {
        me.reporter = new Test.Reporter(config);
        
        me.reporter.treeGrid.setStatus("Setting up iframe and loading contents...");
        
        me.createIframe();
    });
};

Test.SandBoxImpl.prototype.createIframe = function() {
    var me = this,
        options, iframe, win, doc, kickStart, prop, hasTopSuites;

    me.options = options = Test.Options.get();
    
    // loadSpecs is a legacy option for 4.x spec bootstrap
    var src = options.quirksMode ? 'iframe-quirks.html?loadSpecs=true' : 'iframe.html?loadSpecs=true';
    
    src += '&compiled=' + !!me.options.compiled;

    if (options.specsset) {
        src += '&specsset=' + options.specsset;
    }
    
    iframe = new Test.Dom({
        tag: "iframe",
        id: 'sandboxIframe',
        cls: "sandboxIframe",
        name: "sandbox",
        frameBorder: 0,
        src: src
    });
    
    me.reporter.getIframeContainer().appendChild(iframe);
    
    win = iframe.contentWindow || window.frames[iframe.name];
    doc = iframe.contentDocument || win.document;
    
    this.iframe = iframe;
    this.win = win;
    this.doc = doc;
    
    // We need to kick off loading the specs and then starting tests
    // from the reporter. This is what external reporters like Orion
    // will do.
    kickStart = function() {
        me.bootstrapTests();
    };

    // See if there *are* any top suites.
    for (prop in options.topSuites) {
        hasTopSuites = true;
        break;
    }
    
    // We load the specs from bootstrap-specs.js prepared by Cmd.
    // There's a big array of URLs in there, which we can filter
    // by installing a hook function called from bootstrap-specs.
    // Returning URLs for only the specs we need is especially
    // helpful on low-powered devices like tablets that struggle
    // with loading many megabytes of code.
    if (hasTopSuites) {
        Test.Options.getCurrentChunk = function (urls) {
            var topSuites = options.topSuites,
                topSuiteMatchers = [],
                result = [],
                matchers = [],
                topSuite, re, url, i, len;
            
            for (topSuite in topSuites) {
                // Only basic wildcards now
                if (topSuite.substr(topSuite.length - 1) === '*') {
                    re = topSuite.replace(/\./g, '\\.');
                    topSuiteMatchers.push(re.replace(/\*$/, '\.*$'));
                    topSuite = topSuite.replace(/\*$/, '.*');
                }
                
                topSuite = topSuite.replace(/^Ext\./, 'specs.');
                matchers.push(topSuite + '\.js$');
            }
            
            if (topSuiteMatchers.length) {
                options.topSuiteRe = new RegExp(topSuiteMatchers.join('|'));
            }
            
            re = new RegExp(matchers.join('|'));
            
            for (i = 0, len = urls.length; i < len; i++) {
                url = urls[i];
                
                if (re.test(url)) {
                    result.push(url);
                }
            }
            
            // We need to let Jasmine know early on if we're loading
            // everything or just part of it
            if (result.length) {
                win.__PARTIAL_UNIT_TEST_SUITE__ = true;
            }
            
            // If we can't find anything, default to load everything.
            // Potential speedups are not worth breaking the world.
            return result.length ? result : urls;
        };
    }
    
    if (iframe.addEventListener) {
        iframe.addEventListener('load', kickStart);
    }
    else {
        iframe.attachEvent('onload', kickStart);
    }

    win.id = 'sandboxWindow';
    
    // We need a reliable way to detect if we're running under the test harness
    // while executing Ext startup code; we need to know what options were passed
    // to the runner as well. IE9- can't access objects cross-iframe so we work
    // around that.
    win.__UNIT_TESTING__ = JSON.stringify(options);
};

Test.SandBoxImpl.prototype.bootstrapTests = function() {
    var me = this,
        specUrls = me.specUrls,
        win = me.getWin();
    
    win.Ext.onReady(function() {
        me.reporter.treeGrid.setStatus("Loading test spec files...");
        
        win.Ext.Loader.loadScripts({
            // specUrls are passed into Test.SandBox.setup() from index.html
            url: specUrls
        });
    });
};

Test.SandBoxImpl.prototype.stopAllTests = function() {
    this.getWin().jasmine.abortAll();
};

Test.SandBoxImpl.prototype.getIframe = function() {
    return this.iframe;
};

Test.SandBoxImpl.prototype.getWin = function() {
    return this.win;
};

Test.SandBoxImpl.prototype.getDoc = function() {
    return this.iframeDoc ||
          (this.iframeDoc = (this.getIframe().contentDocument || this.getWin().document));
};

Test.SandBoxImpl.prototype.getBody = function() {
    return this.iframeBody || (this.iframeBody = this.getDoc().body);
};

Test.SandBoxImpl.prototype.getHead = function() {
    return this.iframeHead || (this.iframeHead = this.getDoc().getElementsByTagName("head")[0]);
};

Test.SandBoxImpl.prototype.save = function(spec) {
    var doc = this.getDoc(),
        body = this.getBody(),
        children = body && body.childNodes || [],
        length = children.length,
        i = 0,
        child,
        lwas = this.lengthWas || (this.lengthWas = 0),
        specs = {},
        loadUrl;

    if (length != lwas) {
        if (!window.headless) {
            var specId = spec.getId();
            
            specs[specId] = specId;
            
            loadUrl = Test.Options.urlEncode(
                Test.Options.mergeSuites({
                    tests: specs,
                    disableBodyClean: true
                })
            );
            
            this.reporter.log(">> Warning the document.body dom element contains childNodes after spec execution !<br/>" +
                "Spec : " + Test.util.htmlEscape(spec.getFullName()) + ' <a href="?' + loadUrl +
                 '">Load this spec only and disable body autoclean</a><br/>',
                "warning");
        }
        else {
            this.reporter.log("Warning: " + spec.getFullName() + "doesn't clean properly the document.body.");
        }
        
        this.lengthWas = length;
    }

};

Test.SandBoxImpl.prototype.isRunning = function() {
    return !this.getWin().jasmine.getEnv().currentRunner_.queue.isRunning();
};

Test.SandBoxImpl.prototype.iScope = function(o) {
    if (typeof o === "function") {
        o = "(" + o.toString() + ")();";
    }
    return Test.SandBox.getWin().eval(o);
};

Test.SandBox = new Test.SandBoxImpl();
var iScope = Test.SandBox.iScope;

/**
 * @class Test.CodeHighLighter
 * A javascript simple source code higlighter and beautifier (optional).
 */
Test.CodeHighLighter = function(config) {        
    /**
     * @cfg {String} source The source string to process.
     */
    this.source = config.source;
    this.lineNumber = config.lineNumber;
    this.linesFromJsCoverage = config.linesFromJsCoverage;
    
    this.beautify = config.beautify || this.lineNumber === undefined;
    this.highLightCode = config.highLightCode === false ? false : true;
    
    this.matchedComments = [];
    this.matchedStrings = [];
};

/**
 * Regular expressions.
 */
Test.CodeHighLighter.prototype.regExps = {
    strings: /"([^\\"\n]|\\.)*"|'([^\\'\n]|\\.)*'|"([^\\"\n]|\\\n)*"|'([^\\'\n]|\\\n)*'/gm,
    comments: /\/\/.*$|\/\*[\s\S]*?\*\//gm,
    operators: /([\+\-\*\/=\?!]{1,3}|[\-\+]{1,2})/g,
    numbers: /\b([0-9]+)\b/g,
    keywords: [/\b(break)\b/g, /\b(case)\b/g, /\b(catch)\b/g, /\b(continue)\b/g, /\b(default)\b/g,
                /\b(delete)\b/g, /\b(do)\b/g, /\b(else)\b/g, /\b(false)\b/g, /\b(for)\b/g, /\b(function)\b/g,
                /\b(if)\b/g, /\b(in)\b/g, /\b(instanceof)\b/g, /\b(new)\b/g, /\b(null)\b/g,
                /\b(return)\b/g, /\b(switch)\b/g, /\b(this)\b/g, /\b(throw)\b/g, /\b(true)\b/g,
                /\b(try)\b/g,/\b(typeof)\b/g, /\b(var)\b/g, /\b(while)\b/g, /\b(with)\b/g],
    commasInsideParenthesis: /\(([^\(\)\{\}])+\)/g,
    arrayWithOneElement: /\[\n([^,\]]*)\n\]/g,
    commaBracket: /,\n\s*\{/g,
    multipleWhiteSpaces: /(\s+)/g,
    semiColon: /;/g,
    comma: /,/g,
    openedBrackets: /([\{\[])/g,
    closedBrackets: /([\}\]])/g,
    emptyObject: /\{\n\s*\n\}/g,
    openedBracketsWithNewLine: /[\{\[]$/g,
    closedBracketsWithNewLine: /^\s*[\}\]]/g,
    unwantedNewLines: /\n([\n,;\)])/g,
    newLine: /\n/g,
    firstSpaces: /^(\s)+/
};

/**
 * Populates an array of matched objects.
 * @param {String} value The match result.
 * @param {Number} index The index of the match.
 * @param {Array} matchedObjects The array of matches to populate.
 * @param {String} css The css to apply to the match.
 * @return {Boolean} Returns <tt>true</tt> is the match is inside another.
 */
Test.CodeHighLighter.prototype.matchObjects = function(value, index, matchedObjects, css) {
    matchedObjects.push({
        origValue: value,
        value: '<span class="jsHl'+ css +'">' + Test.util.htmlEscape(value).replace("$","$\b") + '</span>',
        start: index,
        end: index + value.length
    });
};

/**
 * Checks if a match is inside another matches.
 * @param {Object} matchedObject The checked match.
 * @param {Array} matchedOthers The array that contains other matches.
 * @return {Boolean} Returns <tt>true</tt> is the match is inside another.
 */
Test.CodeHighLighter.prototype.isInside = function(matchedObject, matchedOthers) {
    var start = matchedObject.start,
        end = matchedObject.end,
        length = matchedOthers.length,
        matchedOther, i;

    for (i = 0; i < length; i++) {
        matchedOther = matchedOthers[i];
        if (matchedOther.start < start && start < matchedOther.end) {
            return true;
        } 
    }
    return false;
};

/**
 * This function get rid of any matches that are inside of other matches.
 * If a match isn't inside another it is replaced by a string in {@link #source}
 * in order to protect it from {@link #processOperatorsNumbersKeywords} replace tricks.
 * @param {Array} matchedObjects The array of matches to check.
 * @param {Array} matchedOthers The array that contains other matches.
 * @param {String} protect The replacement string
 */
Test.CodeHighLighter.prototype.fixOverlaps = function(matchedObjects, matchedOthers, protect) {
    var result = [],
        length = matchedObjects.length,
        matchedObject,
        i;
        
    for (i = 0; i < length; i++) {
        matchedObject = matchedObjects[i];
        if (!this.isInside(matchedObject, matchedOthers)) {
            this.source = this.source.replace(matchedObject.origValue, protect);
            result.push(matchedObject);
        }
    }
    return result;
};

/**
 * Replaces Strings and Comments in javascript source code.
 */
Test.CodeHighLighter.prototype.saveStringsAndComments = function() {
    var commentsRe = this.regExps.comments,
        stringsRe = this.regExps.strings,
        exec;
        
    
    while((exec = commentsRe.exec(this.source))) {
        this.matchObjects(exec[0], exec.index, this.matchedComments, "Comment");
    }
    
    while((exec = stringsRe.exec(this.source))) {
        this.matchObjects(exec[0], exec.index, this.matchedStrings, "String");
    }

    this.matchedComments = this.fixOverlaps(this.matchedComments, this.matchedStrings, "%%%%comment%%%%");
    this.matchedStrings = this.fixOverlaps(this.matchedStrings, this.matchedComments, '%%%%string%%%%');
};

/**
 * Process strings and comments saved by {@link #saveStringsAndComments}.
 */
Test.CodeHighLighter.prototype.processStringsAndComments = function() {
    var matches = this.matchedComments,
        length = matches ? matches.length : 0,
        value, i;

    for (i = 0; i < length; i++) {
        value = matches[i].value;
        this.source = this.source.replace("%%%%comment%%%%", value);
    }
    
    matches = this.matchedStrings;
    length = matches ? matches.length : 0;
    
    for (i = 0; i < length; i++) {
        value = matches[i].value;
        this.source = this.source.replace('%%%%string%%%%', value);
    }
};

/**
 * Highlight operators, numbers and keywords.
 */
Test.CodeHighLighter.prototype.processOperatorsNumbersKeywords = function() {
   var regexps = this.regExps,
        keywords = regexps.keywords,
        length = keywords.length,
        i;
        
    this.source = Test.util.htmlEscape(this.source).replace(
        regexps.operators, '<span class="jsHlOperator">$1</span>').replace(
        regexps.numbers, '<span class="jsHlNumber">$1</span>');
            
    for (i = 0; i < length; i++) {
        this.source = this.source.replace(keywords[i], '<span class="jsHlKeyword">$1</span>');
    }
};
    
/**
 * Format and highligth javascript sources.
 * @return The HTML formatted and highlighted code
 */
Test.CodeHighLighter.prototype.process = function() {
    this.saveStringsAndComments();
    
    if (this.beautify) {
        this.prepareIndent();
        this.doIndent();
    }
    
    this.processOperatorsNumbersKeywords();

    this.processStringsAndComments();

    return this.source;
};

/**
 * Render sources with line numbers.
 * @return The HTML formatted and highlighted code
 */
Test.CodeHighLighter.prototype.renderJsSources = function() {
    var result = 'No code found.',
        linesFromJsCoverage = this.linesFromJsCoverage,
        lineNumber = this.lineNumber,
        source = this.source,
        lines, line, i, errorCls, length, lineNumberCls;

    if (source) {
        source = this.highLightCode ? this.process() : source;
        lines = source.split("\n");
        length = lines.length;
     
        result = '<table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td class="lineNumbers">';
        for (i = 0; i < length; i++) {
            errorCls = "";
            lineNumberCls = "";
            if (lineNumber) {
                errorCls = i === (lineNumber - 1) ? " error" : "";
            }
            if (linesFromJsCoverage) {
                lineNumberCls = !isNaN(linesFromJsCoverage[i + 1]) ? " lineNumberGreen" : "";
                lineNumberCls = linesFromJsCoverage[i + 1] === 0 ? " lineNumberRed" : lineNumberCls;

            }
            result += '<div class="lineNumber' + errorCls + lineNumberCls + '">' + (i + 1) +'</div>';
        }

        result += '</td><td><pre class="code">'+ source +'</pre></td></tr></tbody></table>';
    }
    
    this.source = result;

    return this.source;
};

/**
 * Prepares source code. It crops double whitespace and append new lines.
 * This function is used generally to preformat the code that come from a 
 * Function.prototype.toString.
 */
Test.CodeHighLighter.prototype.prepareIndent = function() {
    var regexps = this.regExps,
        matches, length, i, m;
        
    this.source = this.source.replace(
                regexps.multipleWhiteSpaces, " ").replace(
                regexps.semiColon, ";\n").replace(
                regexps.comma, ",\n").replace(
                regexps.openedBrackets, "$1\n").replace(
                regexps.closedBrackets, "\n$1\n");

    
    // remove newline after commas inside code parenthesis
    matches = this.source.match(regexps.commasInsideParenthesis);

    length = matches ? matches.length : 0;
    for (i = 0; i < length; i++) {
        m = matches[i];
        this.source = this.source.replace(m, m.replace(regexps.newLine, ""));
    }
    
    // fixes various bad formatting
    this.source = this.source.replace(regexps.arrayWithOneElement, "[$1]").replace(
        regexps.emptyObject, "{}").replace(
        regexps.commaBracket, ", {").replace(
        regexps.unwantedNewLines, "$1");
};

/**
 * Creates a string composed of n whitespaces
 * @param {Number} number The number of white spaces.
 * @return {String} A multiple whitespace string.
 */
Test.CodeHighLighter.prototype.addWhiteSpaces = function(number) {
    var whiteSpaces = "",
        i;
        
    for (i = 0; i < number; i++) {
        whiteSpaces += " ";
    }

    return whiteSpaces;
};

/**
 * Indents pre-formatted source code.
 */
Test.CodeHighLighter.prototype.doIndent = function() {
    var regexps = this.regExps, 
        results = [],
        indent = 0,
        sources = this.source.split("\n"),
        length = sources.length,
        whiteSpaces = "",
        source, i;

    for (i = 0; i < length; i++) {
        source = sources[i].replace(regexps.firstSpaces, '');
        if (source !== "") {
            if (source.search(regexps.closedBracketsWithNewLine) !== -1) {
                indent = Math.max(indent - 4, 0);
                whiteSpaces = this.addWhiteSpaces(indent);
            }
            results.push(whiteSpaces + source);
            if (source.search(regexps.openedBracketsWithNewLine) !== -1) {
                indent += 4;
                whiteSpaces = this.addWhiteSpaces(indent);
            }
        }
    }
    this.source = results.join("\n");
};

/**
 * Init allowedGlobals array.
 */
Test.BadGlobalsImpl = function(reporter) {
    this.results = [];
};

Test.BadGlobalsImpl.prototype.setup = function() {
    var me = this, 
        win = Test.SandBox.getWin(),
        property;
        
    // whitelist support    
    win.addGlobal = function() {
        me.addGlobal.apply(me, arguments);
    };
    
    me.allowedGlobals = {};
    for (property in win) {
        me.allowedGlobals[property] = true;
    }
    // add firebug globals variables to white list
    me.allowedGlobals._firebug = true;
    me.allowedGlobals._createFirebugConsole = true;
    me.allowedGlobals.loadFirebugConsole = true;
    me.allowedGlobals.console = true;
};

/**
 * Append to suite HTMLElement warning messages if improper global variables are found.
 * @param {HTMLElement} suiteEl The suite HTMLElement.
 */
Test.BadGlobalsImpl.prototype.report = function(info, suite) {
    var allowedGlobals = this.allowedGlobals,
        win = Test.SandBox.getWin(),
        property, message, value;
    
    for (property in win) {
        if (!allowedGlobals[property]) {
            value = Test.pp(win[property]);
            message = ">> Bad global variable found in " + (suite ? suite.description : "global scope") + "<br/>" + property + " = " + value;
            info.log(message, "warning");        
            this.results[property] = {
                where: (suite ? ('in suite' + suite.description) : "global scope"),
                value: value
            };
            allowedGlobals[property] = true;
        }
    }    
};

Test.BadGlobalsImpl.prototype.addGlobal = function(property) {
    this.allowedGlobals[property] = true;
};

if (!Test.browser.isIE && !Test.browser.isOpera) {
    Test.BadGlobals = new Test.BadGlobalsImpl();
}

/**
 * @singleton Test.jsCoverage
 * The jscoverage manager.
 */
Test.jsCoverage = {
    executed: 0,
    coverage: {},

    isEnabled: function() {
        return !!Test.SandBox.getWin()._$jscoverage;
    },

    getCoverage: function() {
        return this.coverage;
    },
    
    getSandBoxCoverage: function() {
        return Test.SandBox.getWin()._$jscoverage;
    },
    
    /**
     * Adds suite to the jscoverage manager.
     * @param {jasmine.Suite} The jasmine suite.
     */
    add: function(suite) {
        var coverage = this.getSandBoxCoverage(),
        filename, file, property, statement;
        
        if (!coverage) {
            return;
        }
        
        filename = this.getFileName(suite.coverageFile);
        file = coverage[filename];
        
        if (coverage && file) {
            for (property in file) {
                if (!file.hasOwnProperty(property)) {
                   continue;
                }
                statement = file[property];
            }
        }  
    },
    
    /**
     * This methods try to find the corresponding javascript source file.
     * @param {String} The filename.
     */
    getFileName: function(filename) {
        var coverage = this.getSandBoxCoverage(), 
        property;
        
        if (!coverage || !filename) {
            return;
        }
        
        if (coverage[filename]) {
            return filename;
        }
        
        for (property in coverage) {
            if (property.search(filename) !== -1) {
                return property;
            }
        }
    },
    
    /**
     * Updates suite coverage results after execution.
     * @param {jasmine.Suite} The jasmine suite.
     */
    update: function(suite) {
        var coverage = this.getSandBoxCoverage(),
            statements = 0,
            executed = 0,
            property, statement, filename, file;
            
        if (!coverage) {
            return;
        }
        
        filename = this.getFileName(suite.coverageFile);
        file = coverage[filename];
        
        if (file) {
            suite.jscoverage = {
                file: []
            };
            
            for (property in file) {
                if (!file.hasOwnProperty(property)) {
                   continue;
                }
                statement = file[property];
                
                suite.jscoverage.file[property] = statement;
                
                if (!isNaN(property) && statement !== undefined) {
                    statements = statements + 1;
                    if (statement !== 0) {
                        this.executed = this.executed + 1;
                        executed = executed + 1;
                    }
                }
            }
            suite.jscoverage.percentage = ((executed/statements) * 100).toFixed(2);
            suite.jscoverage.statements = statements;
            suite.jscoverage.executed = executed;
            this.coverage[filename] = suite.jscoverage.file;
            this.coverage[filename].percentage = suite.jscoverage.percentage;
            this.coverage[filename].statements = suite.jscoverage.statements;
            this.coverage[filename].executed = suite.jscoverage.executed;
        }
    },
    
    /**
     * Returns suite coverage text.
     * @param {jasmine.Suite} The jasmine suite.
     * @return {String} The Code coverage text<
     */
    getSuiteCoverage: function(suite) {
        if (suite.jscoverage) {
            return " - Code coverage: " + suite.jscoverage.percentage + "%";
        }
        
        return '';
    },
    
    /**
     * Gets total code coverage.
     * @return {String} A string with total code coverage.
     */
    getTotal: function() {
        if (this.percentage) {
            return " - Code coverage: " + this.percentage + "%";
        }
        
        return '';
    },

    updateTotal: function() {
        var coverage = this.getSandBoxCoverage(),
            statements = 0,
            file, filename, statement, property, fstatements, fexecuted, create;
        
        if(!coverage) {
            return "";
        }
        
        for (filename in coverage) {
            if (!coverage.hasOwnProperty(filename)) {
               continue;
            }
            file = coverage[filename];
            fstatements = 0;
            fexecuted = 0;
            
            create = !this.coverage[filename];
            if (create) {
                this.coverage[filename] = [];
            }
            for (property in file) {
                if (!file.hasOwnProperty(property)) {
                   continue;
                }
                statement = file[property];
  
                if (!isNaN(property)) {
                    if (statement !== undefined) {
                        statements = statements + 1;
                        fstatements = fstatements + 1;
                    }
                    if (create) {
                        this.coverage[filename][property] = 0;
                    }
                }
            }
            
            if (create) {
                this.coverage[filename].source = file.source;
                this.coverage[filename].statements = fstatements;
                this.coverage[filename].executed = fexecuted;
                this.coverage[filename].percentage = ((fexecuted/fstatements) * 100).toFixed(2);
            } 

        }
        this.statements = statements;
        this.percentage = ((this.executed/statements) * 100).toFixed(2);
    }
    
};

Test.panel = {};

/**
 * Renders Jasmine Blocks executed by spec.
 * @param {Jasmine.spec} spec The spec.
 * @param {HTMLElement} panelsEl The HTMLElement which encapsulate the tools panels.
 */
Test.panel.Blocks = function(config) {
    var blocks = config.spec.queue.blocks,
        length = blocks.length,
        cls = "panel blocks",
        children = [],
        i, block, codeHighLighter;

    for (i = 0; i < length; i++) {
        block = blocks[i];
        
        if (block.func) {
            children.push({
                cls: "blockTitle " + (block.func.typeName || "specSources"),
                html: block.func.typeName || 'it("' + Test.util.htmlEscape(config.spec.description) + '")'
            });

            codeHighLighter = new Test.CodeHighLighter({
                source: block.func.toString()
            });

            children.push({
                cls: "sources",
                html: codeHighLighter.renderJsSources()
            });
        }
    }
    
    this.el = new Test.Dom({
        cls: cls, 
        children: children
    });

    return this;
};

Test.panel.Blocks.prototype.remove = function() {
    this.el.parentNode.removeChild(this.el);
};

/**
 * Renders spec dom sandbox tool.
 * @param {Jasmine.spec} spec The spec.
 * @param {HTMLElement} panelsEl The HTMLElement which encapsulate the tools panels.
 */
Test.panel.Sandbox = function(config) {
    this.persist = true;

    this.render();

    return this;
};

/**
 * Renders spec dom sandbox innerHTML.
 * @return {HTMElement} The formatted dom sandbox innerHTML.
 */
Test.panel.Sandbox.prototype.render = function() {
    this.el = new Test.Dom({
        //cls: "panel sandbox hideMe"
        cls: "panel sandbox"
    });
};

/**
 * Renders infos panel.
 */
Test.panel.Infos = function() {
    this.el = new Test.Dom({
        tag: "div",
        cls: "panel infos",
        children: [{
            cls: "logs"
        }]
    });
    
    this.logs = this.el.childNodes[0];
    this.persist = true;
    
    return this;
};

/**
 * Print a message into console.
 * @param {String} message The message.
 * @param {String} cls (optional) an extra cls to add to the message.
 */
Test.panel.Infos.prototype.log = function(message, cls) {
    var log = this.logs.appendChild(new Test.Dom({
        cls: "infoMessage",
        html: message
    }));
    
    if (cls) {
        Test.Dom.addCls(log, cls);
    }
};

/**
 * @class jasmine.panel.jsCoverage
 * Creates and renders a per spec jscoverage panel.
 * @param {Object} config The configuration object.
 */
Test.panel.jsCoverage = function(config) {
    this.el = new Test.Dom({
        tag: "div",
        cls: "panel jsCoverage",
        children: [{
            cls: "sources",
            html: new Test.CodeHighLighter({
                        source: config.suite.jscoverage.file.source.join("\n"),
                        linesFromJsCoverage: config.suite.jscoverage.file,
                        highLightCode: false
                    }).renderJsSources()
        }]
    });
    
    return this; 
};

Test.panel.jsCoverage.prototype.remove = function() {
    this.el.parentNode.removeChild(this.el);
};

/**
 * @class jasmine.panel.jsCoverageSummary
 * Creates and renders the persistant jscoverage summary panel.
 * @param {Object} config The configuration object.
 */
Test.panel.jsCoverageSummary = function(config) {
    var me = this;
    
    me.el = new Test.Dom({
        tag: "div",
        cls: "panel jsCoverageSummary hideMe",
        onclick: function() {
            me.onClick.apply(me, arguments);
        },
        children: [{
            cls: "sbody"
        }]
    });
    
    me.body = me.el.childNodes[0];
    me.persist = true;
    this.renderSummary();
    
    return me; 
};

/**
 * Renders summary view.
 */
Test.panel.jsCoverageSummary.prototype.renderSummary = function() {
    var coverage = Test.jsCoverage.getCoverage(),
        filename, result;
        
    if (!this.summary) {
        result = '<table class="summary" border="0" cellpadding="0" cellspacing="0"><tbody>';
        result += '<tr class="line header"><td class="fileName">File</td><td class="statements">Statements</td><td class="executed">Executed</td><td class="percentage">Percentage</td></tr>';    
        result += '<tr class="line total">';
        result += '<td class="fileName">Total</td>';
        result += '<td class="statements">' + Test.jsCoverage.statements + "</td>";
        result += '<td class="executed">' + Test.jsCoverage.executed + "</td>";
        result += '<td class="percentage">' + this.renderPercentage(Test.jsCoverage.percentage) + "</td>";
        result += '</tr>';
        
        for (filename in coverage) {
            if (!coverage.hasOwnProperty(filename)) {
                continue;
            }
            result += '<tr class="line">';
            result += '<td class="fileName"><a>' + filename + "</a></td>";
            result += '<td class="statements">' + coverage[filename].statements + "</td>";
            result += '<td class="executed">' + coverage[filename].executed + "</td>";
            result += '<td class="percentage">' + this.renderPercentage(coverage[filename].percentage) + "</td>";
            result += '</tr>';
        }
        result += '</tbody></table>';
        this.summary = result;
    }
    
    this.body.innerHTML = this.summary;
};

/**
 * Renders percentage progress bar.
 * @return {String} The progressbar html.
 */
Test.panel.jsCoverageSummary.prototype.renderPercentage = function(percent) {
    var result = percent + '%<div class="limit" style="width:300px;">';
    
    result += '<div class="result" style="width:' + 3 * percent + 'px;"></div>';
    result += '</div>';
    
    return result;
};

/**
 * Renders percentage progress bar.
 * @return {String} The progressbar html.
 */
Test.panel.jsCoverageSummary.prototype.onClick = function(event) {
    var el;
        event = event || window.event;
        el = event.target || event.srcElement;

    if (el.tagName === "A") {
        this.renderSource(Test.jsCoverage.getCoverage()[el.innerHTML]);
    }
    
    if (Test.Dom.hasCls(el,"back")) {
        this.renderSummary();
    }
};

/**
 * Renders file source.
 */
Test.panel.jsCoverageSummary.prototype.renderSource = function(coverage) {
    this.body.innerHTML = "";
    this.body.appendChild(new Test.Dom({
        cls: "back",
        html: "Back"
    }));
    
    this.body.appendChild(new Test.Dom({
            cls: "sources",
            html: new Test.CodeHighLighter({
                        source: coverage.source.join("\n"),
                        linesFromJsCoverage: coverage,
                        highLightCode: false
                    }).renderJsSources()
    }));
};

/**
 * Renders stack trace tool.
 * @param {Jasmine.spec} The jasmine spec.
 * @return {HTMLElement} The created HTMLElement.
 */
Test.panel.StackTrace = function(config) {
    this.spec = config.spec;
    this.badLinesEls = [];
    
    var resultItems = this.spec.results().items(),
        length = resultItems.length,
        result,
        error,
        lines,
        i;

    if (Test.browser.isIE || !this.spec.hasError) {
        return this;
    }
    
    for (i = 0; i < length; i++) {
        result = resultItems[i];
        
        if (result.type == "expect" && result.passed && !result.passed()) {
            if (result.error) {
                error = result.error;
                break;
            }
        }
    }   
    
    if (error) {
        lines = this.extractStackTrace(error);

        this.el = new Test.Dom({
                tag: "div",
                cls: "panel stackTrace",
                children: this.renderStackLines(lines)
        });
    }

    return this;
};

/**
 * Extracts error stack trace.
 * @param {Error} e The javascript error object.
 * @return {Array} An array which contains all stack trace files and lineNumbers.
 */
Test.panel.StackTrace.prototype.extractStackTrace = function(error) {
    var stack = error.stack || error.stackTrace,
        results = [],
        lines, line, length, i, extract, file, lineNumber;
    
    if (stack) {
        lines = stack.split("\n");
        length = lines.length;
        
        for(i = 0; i < length; i++) {
            line = lines[i];
            if (line.search("jasmine.js") === -1) {
                extract = this.extractFileAndLine(line);
                if (extract) {
                    results.push(extract);
                }
            }
        }
    }
    else {
        file = error.sourceURL || error.fileName;  
        lineNumber = error.line || error.lineNumber;

        if (file && lineNumber) {
            results.push({
                file: file,
                lineNumber: lineNumber
            });
        }
    }
    
    return results;
};

/**
 * Extracts filename and line number from a stack trace line.
 * @param {String} line The stack trace line.
 * @return {Object} An object containing the filename and the line number or null.
 */
Test.panel.StackTrace.prototype.extractRe = /((http:\/\/|file:\/\/\/).*\.js)[^:]*:(\d*)/;
Test.panel.StackTrace.prototype.extractFileAndLine = function(line) {
    var result = line.match(this.extractRe);

    if (!result) {
        return null;
    }

    return {
        file: result[1],
        lineNumber: result[3]
    }; 
};

/**
 * Render stack trace lines.
 * @param {String} file The filename.
 * @param {String/Number} lineNumber The line number.
 * @return {Array} An array containing all strace trace HTMLElements.
 */
Test.panel.StackTrace.prototype.renderStackLines = function(lines) {
    var els = [],
        length = lines.length,
        el, line, i, file, lineNumber;

    for (i = 0; i < length; i++) {
        line = lines[i];
        file = line.file;
        lineNumber = parseInt(line.lineNumber, 0);
        
        el = new Test.Dom({
            cls: "stackTraceLine",
            children: [{
                cls: "fileName",
                html: "File: "+ file + " (line " + lineNumber + ")"
            },{
                cls: "sources",
                html: this.renderTraceFileSource(file, lineNumber) 
            }]
        });
        
        this.badLinesEls.push({
            el: el.childNodes[1],
            line: lineNumber
        });
        
        els.push(el);
    }
    
    return els;
};

/**
 * Downloads source file.
 * @param {String} url The filename url.
 * @return {String} The file source or null.
 */
Test.panel.StackTrace.prototype.getFile = function(file) {
    var request;

    if (Test.browser.isIE || Test.Options.remote) {
        return null;
    }
    
    this.downloadedFiles = this.downloadedFiles || {};

    if (!this.downloadedFiles[file]) {
        request = new XMLHttpRequest();
        
        if (!request) {
            return null;
        }
        request.open("GET", file + "?" + (new Date()).getTime(), false);

        request.send("");

        this.downloadedFiles[file] = request.responseText;        
    }
    
    return this.downloadedFiles[file];
};

/**
 * Renders stack trace source file.
 * @param {String} file The filename.
 * @param {String/Number} lineNumber The line number.
 * @return {HTMLElement} The javascript source file HTMLElement.
 */
Test.panel.StackTrace.prototype.jscoverageFileRe = /(http:\/\/|file:\/\/\/)[^\/]*/;

Test.panel.StackTrace.prototype.renderTraceFileSource = function(file, lineNumber) {
    var highLightCode = true,
        source, instrumented_file, i, length, line;

    if (Test.SandBox.getWin()._$jscoverage) {
        instrumented_file = SandBox.getWin()._$jscoverage[file.replace(this.jscoverageFileRe, "")];
        if (instrumented_file) {
            highLightCode = false;
            source = instrumented_file.source.join("\n");
            linesFromJsCoverage = {};
            length = instrumented_file.length;
            for (i = 0; i < length; i++) {
                line = instrumented_file[i];
                if (line === 0) {
                    linesFromJsCoverage[i-1] = true;
                }
            }
        }
    }
    
    source = source || this.getFile(file);
    
    return new Test.CodeHighLighter({
        source: source,
        highLightCode: highLightCode,
        lineNumber: lineNumber
    }).renderJsSources();
};

/**
 * Ensure that line which contains the error is visible without scroll.
 */
Test.panel.StackTrace.prototype.afterRender = function() {
    var length = this.badLinesEls.length,
        badLine, firstChild, el, i, lineHeigth, visiblesLines;

    for (i = 0; i < length; i++) {
        badLine = this.badLinesEls[i];
        el = badLine.el;
        lineHeigth = 16;
        visiblesLines = el.clientHeight/lineHeigth;
        el.scrollTop = Math.max(badLine.line - visiblesLines/2, 0) * lineHeigth;
    }
    
    this.badLinesEls = [];
};

Test.panel.StackTrace.prototype.remove = function() {
    this.el.parentNode.removeChild(this.el);
};

/**
 * @class Test.panel.TabPanel
 * Renders inspection tools htmlElement.
 * @param {Object} config The configuration object.
 */
Test.panel.TabPanel = function(config) {
    var me = this;  
    
    me.options = Test.Options.get();
    
    me.spec = config.spec;
    me.container = config.container;
    me.el = new Test.Dom({
        cls: "tabpanel",
        onclick: function() {
            me.onTabPanelClick.apply(me, arguments);
        },
        children: [{
            cls: "toolBar"
        }, {
            cls: "panels"
        }]
    });
        
    me.toolbar = me.el.childNodes[0];
    me.body = me.el.childNodes[1];
    
    // Some tests cause the panels body element to scroll.
    // If that happens we need to reset scroll position.
    me.panelScrollListener = function() {
        me.panelScrolled = true;
    };
    
    if (document.addEventListener) {
        me.body.addEventListener('scroll', me.panelScrollListener, { capture: true, passive: true });
    }
    else {
        me.body.attachEvent('onscroll', me.panelScrollListener);
    }

    me.children = [];
    me.tabs = [];
    
    me.container.appendChild(me.el);
    me.renderToolBar();
    //me.add(new Test.panel.Infos({}));
    me.add(new Test.panel.Sandbox({}));
    
    if (me.options.panel) {
        me.activatePanel(me.options.panel);
    }
    
    return me;
};

Test.panel.TabPanel.prototype.resetPanelScroll = function() {
    if (this.panelScrolled) {
        this.body.scrollTop = this.body.scrollLeft = 0;
        this.panelScrolled = false;
    }
};

/**
 * Adds a panel.
 * @param {Object} panel the panel to be added to this tabPanel.
 */
Test.panel.TabPanel.prototype.add = function(panel) {
    if (panel.el) {
        this.body.appendChild(panel.el);
    }
    
    if (panel.afterRender) {
        panel.afterRender();
    }
    
    this.children.push(panel);
    
    if (panel.afterRender) {
        panel.afterRender();
    }
};

/**
 * Adds a tab
 * @param {Object} panel the panel to be added to this tabPanel.
 */
Test.panel.TabPanel.prototype.addTab = function(cls, name, persist) {
    var el = this.toolbar.appendChild(new Test.Dom({
        tag: "span",
        cls: "toolbarTab " + cls,
        html: name
    }));
    
    this.tabs.push({
        el: el, 
        persist: persist
    });
};

/**
 * Activate a tool panel and render it if needed.
 * @param {String} cls The panel className.
 */
Test.panel.TabPanel.prototype.activatePanel = function(cls) {
    var children = this.children,
        length = children.length,
        rendered = false,
        child, i;
        
    for(i = 0; i < length; i++) {
        child = children[i].el;
        Test.Dom.addCls(child, "hideMe"); 
        
        if (Test.Dom.hasCls(child, cls)) {
            Test.Dom.removeCls(child, "hideMe");
            
            if (children[i].persist && cls !== "jsCoverageSummary") {
                this.options.panel = cls;
            }
            else {
                delete this.options.panel;
            }
            
            rendered = true;
        }
    }

    if (rendered) {
        return;
    }
    
    if (this.spec) {
        if (cls === "blocks") {
            this.add(new Test.panel.Blocks({
                spec: this.spec
            }));
        }

        if (cls === "stackTrace") {
            this.add(new Test.panel.StackTrace({
                spec: this.spec
            })); 
        }
    }
    
    if (this.suite && this.suite.jscoverage) {
        if (cls === "jsCoverage") {
            this.add(new Test.panel.jsCoverage({
                suite: this.suite
            })); 
        }        
    }
};

/**
 * Reporter HTMLElement click dispatcher.
 * @param {Event} event The event
 */
Test.panel.TabPanel.prototype.onTabPanelClick = function(event) {
    var el;
        event = event || window.event;
        el = event.target || event.srcElement;

    if (Test.Dom.hasCls(el, "toolbarTab")) {
        this.onTabClick(el);
    }
};

/**
 * Handle spec tools tab click.
 * @param {HTMLElement} el The tab HTMLElement.
 */
Test.panel.TabPanel.prototype.onTabClick = function(el) {
    var tools, panels, length, child, i;
    
    Test.Dom.addCls(el, "selected");

    tools = this.toolbar.childNodes;
    panels = this.body.childNodes;

    for (i = 0, length = tools.length; i < length; i++) {
        child = tools[i];
        
        if (child != el) {    
            Test.Dom.removeCls(child, "selected");
        }
    }
    
    this.activatePanel(el.className.split(" ")[1]);
};


/**
 * Renders inspection tabpanel toolbar which contain tabs.
 * @param {jasmine.Spec} spec The jasmine spec.
 * @param {HTMLElement} toolBarEl The toolbar HTMLElement
 */
Test.panel.TabPanel.prototype.renderToolBar = function() {
    var spec = this.spec,
        suite = this.suite,
        toolbar = this.toolbar;
        
    if (this.tabs.length === 0) {
        this.addTab("infos selected", "Console", true);
        this.addTab("sandbox", "Iframe", true);
    }
    else {
        Test.Dom.addCls(this.tabs[0].el, "selected");
    }
    
    if (spec) {
        this.addTab("blocks", "Blocks");
        
        if (!Test.browser.isIE && !Test.browser.isOpera && this.spec.hasError) {
            this.addTab("stackTrace", "Stack Trace");
        }
    }
    
    if (suite && suite.jscoverage) {
        this.addTab("jsCoverage", "Suite Coverage");      
    }
};

/**
 * Removes all non-persistant tabs.
 */
Test.panel.TabPanel.prototype.resetToolBar = function() {
    var children = this.tabs,
        length = children.length, 
        child, i;

    for (i = length - 1; i >= 0; i--) {
        child = children[i];
        if (!child.persist) {
            this.toolbar.removeChild(child.el);
            Test.array.remove(children, child);
        }
        Test.Dom.removeCls(child.el, "selected");
    }
    
    this.renderToolBar();
};

/**
 * Removes all non-persistant panels.
 */
Test.panel.TabPanel.prototype.resetPanels = function() {
    var children = this.children,
        length = children.length, 
        child, i;

    for (i = length - 1; i >= 0; i--) {
        child = children[i];
        if (!child.persist) {
            child.remove();
            Test.array.remove(children, child);
        }
        Test.Dom.addCls(child.el, "hideMe");
    }
    
    if (children[0]) {
        Test.Dom.removeCls(children[0].el, "hideMe");
    }
};

/**
 * Sets TabPanel current spec.
 */
Test.panel.TabPanel.prototype.setSpec = function(spec) {
    this.spec = spec;
    delete this.suite;
    this.resetToolBar();
    this.resetPanels();
};

/**
 * Sets TabPanel current suite.
 */
Test.panel.TabPanel.prototype.setSuite = function(suite) {
    this.suite = suite;
    delete this.spec;
    this.resetToolBar();
    this.resetPanels();
};

/**
 * Resize TabPanel dom element.
 */
Test.panel.TabPanel.prototype.resize = function(val) {
    this.el.style.height = val + "px";
    
    // IE8 balks at setting negative height :)
    this.body.style.height = (val || 40) - 40 + "px";
};

/**
 * Adds jscoverage persistant panel.
 */
Test.panel.TabPanel.prototype.addCoverageSummary = function() {
    this.addTab("jsCoverageSummary", "Coverage Summary", true);
    this.add(new Test.panel.jsCoverageSummary({}));
};

/**
 * @class Test.panel.TreeGrid
 * Creates and renders reporter treegrid.
 * @param {Object} config The configuration object.
 */
Test.panel.TreeGrid = function(config) {
    var me = this,
        toolbar;
    
    me.options = Test.Options.get();
    
    toolbar = [
        Test.Options.renderCheckbox("showPassed", "Show passed"),
        Test.Options.renderCheckbox("showDisabled", "Show disabled"),
        Test.Options.renderCheckbox("collapseAll", "Collapse all"),
        Test.Options.renderCheckbox("expandResults", "Expand results"),
        Test.Options.renderCheckbox("disableTryCatch", "No Jasmine try/catch")
        //Test.Options.renderCheckbox("disableBodyClean", "Disable Body Autoclean"),
        //Test.Options.renderCheckbox("disableCacheBuster", "Disable CacheBuster"),
        //Test.Options.renderCheckbox("showTimings", "Show Timings"),
        //Test.Options.renderCheckbox("verbose", "Show jasmine logs"),
        //Test.Options.renderCheckbox("autoReload", "Automatic reload"),
        //
    ];
    
    toolbar.push(Test.Options.renderCheckbox("disableLeakChecks", "Disable leak checks"));
    
    if (window.console && window.console.profile) {
        toolbar.push(Test.Options.renderCheckbox("profile", "Profile CPU"));
    }
        
    if (Object.setPrototypeOf) {
//         toolbar.push(Test.Options.renderCheckbox("dukeNukem", '<span style="font-size:20px\">&#x2622;</span>'));
    }
    
    if (config.enableQuirksMode) {
        toolbar.push(Test.Options.renderCheckbox("quirksMode", "Quirks Mode"));
    }

    me.el = document.body.appendChild(new Test.Dom({
        tag: "div",
        cls: "treegrid",
        children: [{
            cls: "header",
            children: [{
                cls: "logo",
                html: "Sencha"
            }, {
                cls: 'headerBar',
                children: [{
                    cls: "statusMessage",
                    children: [{
                        tag: 'span',
                        cls: 'statusMessageText',
                        html: '&#160;'
                    }, {
                        // This is the actual *progressBar* -- it fills up to 100% and
                        // is then hidden.
                        cls: 'progressBar passed'
                    }, {
                        // This is actually the bottom border of the status area when
                        // done but is the unfinished part of the progressBar during the
                        // run.
                        cls: 'progressBar'
                    }]
                }, {
                    cls: 'runActions',
                    children: [{
                        tag: 'a',
                        'data-ref': 'stopAll',
                        cls: 'actionLink stop-all',
                        title: 'Stop all tests currently in progress',
                        onmousedown: function(e) {
                            Test.SandBox.stopAllTests();
                        }
                    }, {
                        tag: "span",
                        cls: "runLabel",
                        html: "Run:"
                    }, {
                        tag: "div",
                        cls: "actionLink run-failed",
                        unselectable: 'on',
                        //html: "Failed",
                        title: "Run only failed specs in the current set\n" +
                               "Shift-click to run only first failed spec",
                        onmousedown: function(e) {
                            e = e || window.event;
                            var target = e.target || e.srcElement,
                                options, limit;
                            
                            // Stop text selection
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                            else {
                                e.returnValue = false;
                            }
                            
                            limit = e.shiftKey ? 1 : null;
                            
                            options = Test.Options.collectFailed.call(me, limit);
                            
                            if (limit) {
                                options.expandResults = true;
                            }
                            
                            if (e.ctrlKey) {
                                options.disableTryCatch = true;
                            }
                            
                            window.location.href = '?' + Test.Options.formLoadUrl(false, options);
                        }
                    }, {
                        tag: "a",
                        href: '#',
                        cls: "actionLink run-checked",
                        //html: "Checked",
                        title: "Run only checked specs in the current set",
                        onmousedown: function(e) {
                            e = e || window.event;
                            var target = e.target || e.srcElement;

                            target.href = '?' + Test.Options.formLoadUrl();
                        }
                    }, {
                        tag: "a",
                        href: '#',
                        cls: "actionLink run-all",
                        //html: "All",
                        title: "Run all suites and specs in the original set",
                        onmousedown: function(e) {
                            e = e || window.event;
                            var target = e.target || e.srcElement;

                            e.target.href = '?' + Test.Options.formLoadUrl(true);
                        }
                    }, {
                        tag: 'a',
                        cls: 'actionLink',
                        html: '&#9986;',
                        title: "Run a chunk like TeamCity",
                        onmousedown: function (e) {
                            if (e.button === 0) {
                                var chunk = prompt('Enter chunk descriptor (e.g., "0/3")');

                                // qs = 'chunkify=2%2F1';
                                if (chunk) {
                                    var qs = Test.Options.formLoadUrl(true);
                                    if (qs) {
                                        qs += '&';
                                    }

                                    qs += 'chunkify=' + encodeURIComponent(chunk);

                                    location.search = '?' + qs;
                                }
                            }
                        }
                    }]
                }]
            }, {
                cls: "toolBar",
                children: [{
                    tag: "span",
                    cls: "options",
                    children: toolbar
                }]
            }]
        }, {
            tag: "div",
            cls: "tbody",
            onclick: function() {
                me.onBodyClick.apply(me, arguments);
            }
        }, {
          cls: "resizer",
          html: "&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;",
            ondblclick: function(e) {
                me.onDoubleClick(e);
            },
            onmousedown: function() {
                me.onMouseDown.apply(me, arguments);
            }
        }]
    }));
    
    me.tabPanel = new Test.panel.TabPanel({
        container: me.el
    });
  
    Test.Options.check();
    me.header = me.el.childNodes[0];
    me.statusMessage = me.header.childNodes[1].childNodes[0];
    me.progressBar = me.statusMessage.childNodes[1];
    me.toolBar = me.header.childNodes[2];
    me.body = me.el.childNodes[1];
    me.resizer = me.el.childNodes[2];    

    me.suites = {};
    me.specs = {};
    me.suitesEls = {};
    me.specsEls = {};
    
    if (me.options.resizer) {
        me.tabPanel.resize(parseInt(me.options.resizer, 10));
    }
    else {
        // Usually it is more important to see what is happening in iframe
        // while tests are running than watching results
        me.tabPanel.resize(me.getInnerHeight() * 0.7);
    }
    
    me.resizeBody();
    
    window.onresize = function() {
        me.resizeBody();
    };
    
    // Top document body can scroll, we need to track and reset it
    me.bodyScrollListener = function() {
        me.bodyScrolled = true;
    };
    
    if (document.addEventListener) {
        document.body.addEventListener('scroll', me.bodyScrollListener, { capture: true, passive: true });
    }
    else {
        document.body.attachEvent('onscroll', me.bodyScrollListener);
    }
};

Test.panel.TreeGrid.prototype.resetBodyScroll = function() {
    if (this.bodyScrolled) {
        document.body.scrollTop = document.body.scrollLeft = 0;
        this.bodyScrolled = false;
    }
};

Test.panel.TreeGrid.prototype.checkUpdateTimer = function() {
    if (Test.STATUS_UPDATE_INTERVAL && !this.statusUpdateTimer) {
        this.statusUpdateTimer = setInterval(
            this.updateRunningSpec.bind(this), Test.STATUS_UPDATE_INTERVAL
        );
    }
};

Test.panel.TreeGrid.prototype.stopUpdateTimer = function() {
    if (this.statusUpdateTimer) {
        clearTimeout(this.statusUpdateTimer);
    }
};

/**
 * Renders suite htmlElement.
 * @param {jasmine.Suite} suite The jasmine suite.
 * @return {HTMLElement} The suite HTMLElement
 */
Test.panel.TreeGrid.prototype.addSuite = function(suite) {
    var topSuite = suite.isTopSuite,
        padding = suite.level * 18,
        parent = suite.parentSuite,
        suiteId = suite.getId(),
        disabled = suite.isDisabled(),
        prefix = disabled ? "xdescribe: " : "describe: ",
        cls = "noexpand", 
        suiteEl, row, property;
    
    if (suite.children().length !== 0) {
        cls = this.options.collapseAll ? "expand" : "collapse";
    } 
    
    if (parent && !parent.isRootSuite) {
        if (!this.suitesEls[parent.getId()]) {
            this.addSuite(parent);
        }
    }
    
    this.suites[suiteId] = suite;
    
    row = this.createRow(this.options.collapseAll && !topSuite, suite);
    
    this.suitesEls[suiteId] = suiteEl = new Test.Dom({
        tag: "div",
        id: "suite-" + suiteId,
        cls: "suite" + (disabled ? " disabled" : "") + (topSuite ? " parent-suite" : ""),
        style: {
            "paddingLeft": padding + "px"
        },
        children: [{
            cls: cls
        }, {
            tag: "span",
            cls: "description",
            html: prefix + suite.description
        }]
    });
    
    if (suite.isDisabled()) {
        Test.Dom.addCls(row, 'disabled');
    }
    
    suiteEl.topSuite = topSuite;
    row.appendChild(suiteEl);
    
    var clear = new Test.Dom({ tag: 'div' });
    clear.style.clear = 'both';
    row.appendChild(clear);
    
    return suiteEl;
};

/**
 * Updates suite dom element by adding a code coverage percentage to it's description.
 * @param {HTMLElement} The suite dom element.
 * @param {jasmine.Suite} The jasmine suite.
 */
Test.panel.TreeGrid.prototype.updateSuiteEl = function(suite, text) {
    var description = this.suitesEls[suite.getId()].childNodes[1];
    
    Test.Dom.setHTML(description, description.innerHTML + text);
};

/**
 * Renders spec htmlElement.
 * @param {jasmine.Spec} spec The jasmine spec.
 * @return {HTMLElement} The spec HTMLElement
 */
Test.panel.TreeGrid.prototype.addSpec = function(spec) {
    var suite = spec.suite,
        padding = (suite.level + 1) * 18,
        specId = spec.getId(),
        enabled = spec.isEnabled(),
        suffix = spec.time ? " (" + spec.time + "s)" : "",
        row, clear, prefix, status, property, specEl, resultPanel;
        
    if (enabled) {
        prefix = "it ";
        status = spec.results().passed() ? "passed" : "failed";
    }
    else {
        prefix = "xit ";
        status = "disabled";
    }
    
    if (suite) {
        if (!this.suitesEls[suite.getId()]) {
            this.addSuite(suite);
        }
    }
    
    this.specs[specId] = spec;
    
    row = this.createRow(this.options.collapseAll, spec);
    resultPanel = this.renderSpecResults(spec, this.options.expandResults);
    
    specEl = {
        id: "spec-" + specId,
        cls: "spec " + status,
        style: {
            "paddingLeft": padding + "px"
        },
        children: [{
            tag: "span",
            cls: "description",
            html: prefix + spec.description + suffix
        }]
    };
    
    if (enabled) {
        specEl.children.unshift({
            cls: this.options.collapseAll ? "expand" : "collapse"
        });
    }

    if (this.options.collapseAll) {
        resultPanel.style.display = "none";
    }
    
    if (resultPanel.innerHTML === "") {
        specEl.children[0].cls = "noexpand";
    }
    
    specEl.children.push(resultPanel);
    
    specEl = new Test.Dom(specEl);
    this.specsEls[specId] = specEl;
    
    row.appendChild(specEl);
    Test.Dom.addCls(row, status);
    
    clear = new Test.Dom({ tag: 'div' });
    clear.style.clear = 'both';
    row.appendChild(clear);
    
    if (resultPanel.scrollHeight > 26) {
        Test.Dom.addCls(row, 'results-collapsed')
    }
};

/**
 * Returns a suite by id.
 * @param {String/Number} id The suite id.
 * @return {jasmine.Suite} The jasmine suite.
 */
Test.panel.TreeGrid.prototype.getSuite = function(id) {
    return this.suites[id];
};

/**
 * Returns a spec by id.
 * @param {String/Number} id The spec id.
 * @return {jasmine.Spec} The jasmine spec.
 */
Test.panel.TreeGrid.prototype.getSpec = function(id) {
    return this.specs[parseInt(id, 10)];
};

/**
 * Body elements click event dispatcher.
 */
Test.panel.TreeGrid.prototype.onBodyClick = function(event) {
    event = event || window.event;
    var el = event.target || event.srcElement,
        cls = el.className,
        i;
        
    if (cls) {
        if (Test.Dom.hasCls(el, "results-expander")) {
            return;
        }

        if (Test.Dom.hasCls(el, "collapse")) {
            this.onCollapse(el);
            return;
        }

        if (Test.Dom.hasCls(el, "expand")) {
            this.onExpand(el);
            return;
        }
        
        if (Test.Dom.hasCls(el, "select-checkbox")) {
            this.onCheck(el);
            return;
        }
        
        for (i = 0; i < 6; i++) {
            if (cls && Test.Dom.hasCls(el, "row")) {
                this.onRowClick(el);
                return;
            }
            
            el = el.parentNode;
            
            if (!el) {
                break;
            }
            
            cls = el.className;
        }
    }
};

/**
 * Checkboxes listener.
 */
Test.panel.TreeGrid.prototype.onCheck = function(el) {
    var next = el.parentNode.nextSibling,
        id;

    if (Test.Dom.hasCls(next, "spec")) {
        id = parseInt(next.id.replace("spec-", ""), 10);
    }
    else {
        id = parseInt(next.id.replace("suite-", ""), 10);
    }
    
    if (el.checked) {
        this.options.testIds[id] = id;
    }
    else {
        delete this.options.testIds[id];
    }
};

/**
 * Returns row dom element by spec or suite.
 * @param {jasmine.Suite/jasmine.Spec} o A suite or a spec.
 * @return {HTMLElement} The row dom element.
 */
Test.panel.TreeGrid.prototype.getRow = function(o) {
    var id = o.getId();
    
    if (o.isSuite && this.suitesEls[id]) {
        return this.suitesEls[id].parentNode;
    }
    else if (this.specsEls[id]) {
        return this.specsEls[id].parentNode;
    }
};

/**
 * Iterates nested rows calling the supplied function.
 * @param {HTMLElement} row The row.
 * @param {Function} fn The function.
 * @param {Boolean} recursive recurse in all children suite (default to true)
 */
Test.panel.TreeGrid.prototype.onEachRow = function(row, fn, recursive) {
    var me = this,
        id = row.childNodes[1].id,
        suite, spec;
        
    function traverse(s, func) {
        var children = s.children && s.children(),
            child, i, len, r;
    
        if (children && children.length) {
            for (i = 0, len = children.length; i < len; i++) {
                child = children[i];
                r = me.getRow(child);
                
                if (r) {
                    func.call(me, r, child);
                    
                    if (child.children && recursive !== false) {
                        traverse(child, func);
                    }
                }
            }
        }
    };
    
    if (id.search("suite") !== -1) {
        suite = this.getSuite(id.replace("suite-", ""));
        traverse(suite, fn);
    }
    else {
        spec = this.getSpec(id.replace("spec-", ""));
        traverse(spec, fn);
    }
};

/**
 * Collapse click handler.
 */
Test.panel.TreeGrid.prototype.onCollapse = function(el) {
    el = el.parentNode;
    Test.Dom.setCls(el.childNodes[0], "expand");
    
    if (Test.Dom.hasCls(el, "suite")) {
        this.onEachRow(el.parentNode, function(row, o) {
            var childNode = row.childNodes[1],
                icon = childNode.childNodes[0],
                content = childNode.childNodes[2];
                
            row.style.display = "none";
            
            if (Test.Dom.hasCls(icon, "collapse")) {
                Test.Dom.setCls(icon, "expand");
            }
            
            if (o.suite) {
                content.style.display = "none";
            }
        });
    }
    else {
        el.childNodes[2].style.display = "none";
    }
};

/**
 * Expand click handler.
 */
Test.panel.TreeGrid.prototype.onExpand = function(el) {
    el = el.parentNode;
    Test.Dom.setCls(el.childNodes[0], "collapse");
    
    if (Test.Dom.hasCls(el, "suite")) {
        this.onEachRow(el.parentNode, function(row, o) {
            row.style.display = "block";
        }, false);
    }
    else {
        el.childNodes[2].style.display = "block";
    }
};

/**
 * Row click click handler.
 */
Test.panel.TreeGrid.prototype.onRowClick = function(el) {
    var rows = el.parentNode.childNodes,
        length = rows.length, 
        id, i;
        
    for (i = 0; i < length; i++) {
        Test.Dom.removeCls(rows[i], "selected");
    }
    Test.Dom.addCls(el, "row selected");
    id = el.childNodes[1].id;
    
    if (id.search("spec") !== -1) {
        this.tabPanel.setSpec(this.getSpec(id.replace("spec-", "")));
    }
    if (id.search("suite") !== -1) {
        this.tabPanel.setSuite(this.getSuite(id.replace("suite-", "")));
    }
};

/**
 * Creates row dom element.
 * @param {Boolean} hide Sets the row visibility.
 * @param {jasmine.Suite/jasmine.Spec} The suite or the spec.
 * @return {HTMLElement} The row.
 */
Test.panel.TreeGrid.prototype.createRow = function(hide, o) {
    var row = this.body.appendChild(new Test.Dom({
            tag: "div",
            cls: "row",
            style: {
                display: hide ? "none" : "block" 
            },
            children: [{
                cls: "checkbox-col",
                children: [{
                    tag: "input",
                    cls: "select-checkbox",
                    type: "checkbox"
                }]
            }]
        }));
    
    if (Test.Options.isChecked(o)) {
        row.childNodes[0].childNodes[0].checked = true;
    }
        
    return row;
};

/**
 * Resizer
 */
Test.panel.TreeGrid.prototype.onDoubleClick = function(event) {
    var el;

    event = event || window.event;
    el = event.target || event.srcElement;

    if (Test.Dom.hasCls(el, "resizer")) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        else {
            event.returnValue = false;
        }

        this.options.resizer = 0;
        this.tabPanel.el.style.height = '0';
        this.resizeBody();
    }
};

/**
 * MouseDown event listener. (resizing starts)
 */
Test.panel.TreeGrid.prototype.onMouseDown = function(event) {
    var me = this,
        el;
    
    event = event || window.event;
    el = event.target || event.srcElement;

    if (event.preventDefault) {
        event.preventDefault();
    }
    else {
        event.returnValue = false;
    }

    this.pageY = event.pageY || event.clientY;

    this.startHeight = this.tabPanel.el.clientHeight;
    document.body.style.cursor = "row-resize";
    document.onmousemove = function(e) {
        me.onMouseMove(e);
    };
    document.onmouseup = function(e) {
        me.onMouseUp(e);
    };
};

/**
 * MouseDown event listener. (resize in progress)
 */
Test.panel.TreeGrid.prototype.onMouseMove = function(event) {
    var el, diff;
    if (this.pageY) {
        event = event || window.event;
        el = event.target || event.srcElement;
        diff = Math.max(200, this.startHeight - ((event.pageY || event.clientY)- this.pageY));
        diff = Math.min(diff, document.body.clientHeight - 200);
        
        this.tabPanel.resize(diff);
        this.options.resizer = diff;
        this.resizeBody();
    }
};

/**
 * MouseUp event listener. (resize ends)
 */
Test.panel.TreeGrid.prototype.onMouseUp = function(event) {
    document.body.style.cursor = "auto";
    delete this.pageY;
    document.onmousemove = document.onmouseup = null;
};

/**
 * Returns treegrid innerHeight.
 * @return {Number} The innerHeight.
 */
Test.panel.TreeGrid.prototype.getInnerHeight = function() {
   return (window.innerHeight || document.documentElement.clientHeight) - this.header.offsetTop * 2;
};

/**
 * Resizes treegrid.
 */
Test.panel.TreeGrid.prototype.resizeBody = function() {
    var height = this.getInnerHeight();
    
    height -= this.resizer.offsetHeight + this.tabPanel.el.offsetHeight + this.header.offsetHeight;
    height -= 2;
    height = Math.max(30, height);
    this.body.style.height = height + 'px';
};

/**
 * Results expander click toggle handler.
 * @param {Event} event The event
 */
Test.panel.TreeGrid.prototype.onExpanderClick = function(resultsEl, e) {
    var el = e.target || e.srcElement,
      expanderCollapseCls = 'expander-collapse',
      resultsExpandedCls = 'results-expanded',
      isCollapsed = Test.Dom.hasCls(el, expanderCollapseCls) ? 'removeCls' : 'addCls';

    Test.Dom[isCollapsed](el, expanderCollapseCls);
    Test.Dom[isCollapsed](resultsEl, resultsExpandedCls);
};

/**
 * Renders specs results.
 * @param {jasmine.Spec} spec The spec.
 * @return {HTMLElement} The spec results dom element.
 */
Test.panel.TreeGrid.prototype.renderSpecResults = function(spec, expand) {
     var me = this,
        resultItems = spec.results().items(),
        length = resultItems.length,
        resultsEl,
        resultEl,
        result,
        i;
            
    resultsEl = new Test.Dom({
        cls: "results",
        children: [{
            cls: 'results-expander expander-expand',
            onclick: function(e) {
                e = e || window.event;
                me.onExpanderClick.apply(me, [resultsEl, e]);
            }
        }]
    });
        
    for (i = 0; i < length; i++) {
        result = resultItems[i];
        
        if (result.type === "expect" && result.passed) {
            
            if (result.passed()) {
                resultEl = this.renderPassedResult(result);
            }
            else {
                resultEl = this.renderFailedResult(result);
            }
            
            if (i === 0) {
                Test.Dom.addCls(resultEl, "first");
            }
            
            resultsEl.appendChild(resultEl);

            if (result.error) {
                break;
            }
        }
    }
    
    if (expand) {
        me.onExpanderClick(resultsEl, { target: resultsEl.firstChild });
    }

    return resultsEl;
};

/**
 * Renders failed spec result.
 * @param {Object} result The spec result.
 * @return {HTMLElement} The spec result message HTMLElement
 */
Test.panel.TreeGrid.prototype.renderFailedResult = function(result) {
    var message = result.message,
        children;

    children = [{
        cls: "prettyPrint",
        html: Test.util.htmlEscape(message)
    }];
    
    return new Test.Dom({
        cls: "resultMessage fail",
        children: children
    });
};

/**
 * Renders failed spec result.
 * @param {Object} result The spec result.
 * @return {HTMLElement} The spec result message HTMLElement
 */
Test.panel.TreeGrid.prototype.renderPassedResult = function(result) {
    var children = [{
        cls: "prettyPrint",
        html: "Actual: " + Test.pp(result.actual) +
              // Spies do not have an expected value
              (result.actual && result.actual.isSpy ? '' : "\nExpected: " + Test.pp(result.expected)) +
              "\nMatcher: " + result.matcherName + "."
    }];
    
    return new Test.Dom({
        cls: "resultMessage pass",
        children: children
    });
};

/**
 * Returns tabPanel console.
 */
Test.panel.TreeGrid.prototype.getInfoPanel = function() {
    return this.tabPanel.children[0];
};

/**
 * Print a message into info console.
 * @param {String} message The message.
 * @param {String} cls (optional) an extra cls to add to the message.
 */
Test.panel.TreeGrid.prototype.log = function(message, cls) {
    //this.getInfoPanel().log(message, cls);
};

/**
 * Sets statubar message, this method can also add a className.
 * @param {String} message The message.
 * @param {String} cls The className (optional).
 */ 
Test.panel.TreeGrid.prototype.setStatus = function(message, cls) {
    Test.Dom.setHTML(this.statusMessage.firstChild, message);
    if (cls) {
        Test.Dom.addCls(this.statusMessage, cls);
    }
    // Some test (somehow) cause the body to scroll, so fix it
//     document.body.scrollTop = 0;
};

Test.panel.TreeGrid.prototype.setRunningSpec = function(specName) {
    this.runningSpec = specName;
    
    if (Test.STATUS_UPDATE_INTERVAL === 0) {
        this.updateRunningSpec();
    }
};

Test.panel.TreeGrid.prototype.updateRunningSpec = function() {
    this.setStatus("Running: " + Test.util.htmlEscape(this.runningSpec));
};

/**
 * @class Test.Reporter
 * The Sencha Unit Tests Reporter
 */

Test.Reporter = function(config) {
    config = config || {};
    
    this.options = Test.Options.get();
    this.runnedSpecsCount = 0;
    this.failedSpecsCount = 0;
    this.disabledSpecsCount = 0;
    this.optionCheckBoxesEl = {};
    this.treeGrid = new Test.panel.TreeGrid(config);
};

Test.Reporter.prototype.reportDependencyLoadStarting = function() {
    this.treeGrid.setStatus("Loading test dependencies...");
};

Test.Reporter.prototype.reportDependencyLoadFinishing = function() {
    this.treeGrid.setStatus("Finished loading test dependencies.");
};

Test.Reporter.prototype.reportEnvSetupStarting = function(env) {
    var options = this.options,
        suites = options.topSuites,
        topSuiteRe = options.topSuiteRe;
    
    // By default we do not keep passed suites' results to conserve RAM
    if (!options.showPassed) {
        env.keepPassedResults = false;
    }
    
    this.treeGrid.setStatus("Executing describe() blocks...");
    
    if (!Test.util.isObjectEmpty(suites)) {
        env.topSuiteFilter = function(name) {
            return !!suites[name] || (topSuiteRe && topSuiteRe.test(name));
        };
    }
};

Test.Reporter.prototype.reportEnvSetupFinishing = function(env) {
    var tests = this.options.testIds;
    
    if (!Test.util.isObjectEmpty(tests)) {
        this.treeGrid.setStatus("Filtering tests...");
        env.currentRunner().filter(tests);
    }
    
    this.treeGrid.setStatus("Preparing to run tests...");
};

/**
 * Called before runner execution.
 * @param {jasmine.Runner} runner The Jasmine Runner
 */ 
Test.Reporter.prototype.reportRunnerStarting = function(runner) {
    this.startedAt = new Date();
    
    Test.Dom.addCls(this.treeGrid.header, 'running');
    
    if (Test.BadGlobals) {
        Test.BadGlobals.setup();
    }
    
    this.logger = this.treeGrid;
    
    this.log(">> Started at " + this.startedAt.toString(), "info");
    
    if (!this.options.remote) {
        this.log(">> Warning! Because you access TestReporter locally, stack trace report isn't available.", "warning");
    }
    
    if (this.options.profile && window.console && window.console.profile) {
        console.profile('Unit tests');
    }
    
    if (Test.BadGlobals) {
        Test.BadGlobals.report(this.logger);
    }
    
    this.treeGrid.checkUpdateTimer();
};

/**
 * Called after Jasmine runner execution ends.
 * @param {jasmine.Runner} runner The Jasmine Runner
 */ 
Test.Reporter.prototype.reportRunnerResults = function(runner) {
    if (this.options.profile && window.console && window.console.profileEnd) {
        console.profileEnd('Unit tests');
    }
    
    this.treeGrid.stopUpdateTimer();
    
    Test.Dom.removeCls(this.treeGrid.header, 'running');

    Test.jsCoverage.updateTotal();
    this.renderResults(runner);
    
    if (!this.options.resizer) {
        var treeGrid = this.treeGrid;
        
        treeGrid.tabPanel.resize(0);
        treeGrid.resizeBody();
    }
};

/**
 * Called before spec execution.
 * @param {jasmine.Runner} suite The Jasmine spec
 */ 
Test.Reporter.prototype.reportSuiteStarting = function(suite) {
    if (this.options.showTimings) {
        suite.startedAt = new Date();
    }
    
    if (Test.jsCoverage.isEnabled()) {
        Test.jsCoverage.add(suite);
    }
};

/**
 * Called after suite execution ends.
 * @param {jasmine.Runner} suite A Jasmine suite
 */ 
Test.Reporter.prototype.reportSuiteResults = function(suite) {
    var suiteId = suite.getId(),
        suiteEl = this.treeGrid ? this.treeGrid.suitesEls[suiteId] : undefined,
        status;
    
    if (suite.isTopSuite) {
        Test.Options.mapNameToId(suite.fullName, suiteId);
        
        if (this.treeGrid) {
            this.treeGrid.suites[suiteId] = suite;
        }
    }
    
    if (suite.isEnabled()) {
        if (this.options.showTimings) {
            suite.time = (((new Date()).getTime() - suite.startedAt.getTime())/ 1000).toFixed(3);
        }
        
        Test.jsCoverage.update(suite);
        
        if (suite.isTopSuite && Test.BadGlobals) {
            Test.BadGlobals.report(this.logger, suite);
        }
        
        if (this.treeGrid && this.options.showPassed && !suiteEl) {
            suiteEl = this.treeGrid.addSuite(suite);
        }
        
        if (suiteEl) {
            status = suite.results().passed() ? "passed" : "failed";
            Test.Dom.addCls(suiteEl, status);
            Test.Dom.addCls(suiteEl.parentNode, status);
            
            if (Test.jsCoverage.isEnabled()) {
                this.treeGrid.updateSuiteEl(suite, Test.jsCoverage.getSuiteCoverage(suite));
            }
            
            if (suite.time) {
                this.treeGrid.updateSuiteEl(suite, " (" + suite.time + "s)");
            }
        }
    }
    else if (this.treeGrid && this.options.showDisabled && !suiteEl) {
        this.treeGrid.addSuite(suite);
    }
};

/**
 * Called before spec execution.
 * @param {jasmine.Runner} suite The Jasmine spec
 */ 
Test.Reporter.prototype.reportSpecStarting = function(spec) {
    if (spec.isEnabled()) {
        if (this.options.showTimings) {
            spec.startedAt = new Date();
        }
        
        this.treeGrid.setRunningSpec(spec.getFullName());
    }
};

/**
 * Called after spec execution.
 * @param {jasmine.Runner} suite The Jasmine spec
 */
Test.Reporter.prototype.reportSpecResults = function(spec) {
    var options = this.options,
        treeGrid = this.treeGrid,
        progressBar = treeGrid.progressBar,
        results, status, total, remaining, percent;

    if (spec.isEnabled()) {
        if (options.showTimings) {
            spec.time = (((new Date()).getTime() - spec.startedAt.getTime()) / 1000).toFixed(3);
        }
        
        results = spec.results();
        status = results.passed() ? "passed" : "failed";

        if (status === "failed") {
            if (!this.failedSpecsCount++) {
                progressBar.className += ' failed';
            }
        }

        if ((status === "failed" || options.showPassed) && spec.isEnabled()) {
            treeGrid.addSpec(spec);
        }

        Test.SandBox.save(spec);

        this.runnedSpecsCount += spec.totalSpecs;
    }
    else {
        this.disabledSpecsCount += spec.totalSpecs;
        
        if (options.showDisabled) {
            treeGrid.addSpec(spec);
        }
    }

    spec.env.remainingSpecs -= spec.totalSpecs;
    
    total = spec.env.totalSpecs;
    remaining = spec.env.remainingSpecs;

    if (remaining) {
        percent = Math.round((total - remaining) / total * 1000) / 10;
        progressBar.style.width = (percent || 0) + '%';
    }
    else {
        progressBar.style.display = 'none';
    }
    
    this.treeGrid.resetBodyScroll();
    this.treeGrid.tabPanel.resetPanelScroll();
};

/**
 * Updates runner message with failed and passed specs
 * @param {jasmine.Runner} runner The jasmine runner.
 */
Test.Reporter.prototype.renderResults = function(runner) {
    var cls, runTime, message;
    
    if (runner.errorNoTestsFound) {
        cls = "failed";
        message = "No tests found!";
    }
    else {
        cls = (this.failedSpecsCount > 0) ? "failed" : "passed";
        
        runTime = (new Date().getTime() - this.startedAt.getTime()) / 1000;
    
        message = this.runnedSpecsCount + " spec" +
                  (this.runnedSpecsCount === 1 ? "" : "s" ) + " ran, " +
                  this.failedSpecsCount + " failure" +
                  (this.failedSpecsCount === 1 ? "" : "s") +
                  " and " + this.disabledSpecsCount + " disabled " +
                  "(" + runner.env.totalSpecs + " specs total)";
                     
        message += " in " + runTime + "s";
        
        message += Test.jsCoverage.getTotal() + ".";
    }
    
    if (this.treeGrid) {
        if (Test.SandBox.getWin()._$jscoverage) {
            this.treeGrid.tabPanel.addCoverageSummary();
        }
        
        this.treeGrid.setStatus(message, cls);
    }
    
    this.log(">> Finished at " + new Date().toString(), "info");
};

Test.Reporter.prototype.log = function() {        
    if (this.options.verbose || arguments.length === 2) {
        this.logger.log.apply(this.logger, arguments);
    }
};

Test.Reporter.prototype.getIframeContainer = function() {
    if (this.treeGrid) {
        //return this.treeGrid.tabPanel.children[1].el;
        return this.treeGrid.tabPanel.children[0].el;
    }
    return document.body;
};
