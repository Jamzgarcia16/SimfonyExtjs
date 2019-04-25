(function() {
    if (typeof window.Cmd === 'undefined') {
        return;
    }
    
    if (typeof window.jasmine === 'undefined') {
        throw new Error("Jasmine library does not exist in global namespace!");
    }

    var exportGlobal = function(instance, name) {
        window[name] = function() {
            instance[name].apply(instance, arguments);
        }
        addGlobal(name);
    }

    var JasmineReporter = function() {
        var me = this;
        exportGlobal(me, 'waitsForScreenshot');
        exportGlobal(me, 'waitsForClick');
        exportGlobal(me, 'waitsForSendKeys');
    };

    JasmineReporter.prototype = {

        waitsForScreenshot: function(name) {
            var done = false
            runs(function() {
                Cmd.native.screenshot(name, function() {
                    done = true;
                });
            });
            waitsFor(function() {
                return done;
            });
        },

        waitsForClick: function(domElement) {
            var done = false
            runs(function() {
                Cmd.native.click(domElement, function() {
                    done = true;
                });
            });
            waitsFor(function() {
                return done;
            });
        },

        waitsForSendKeys: function(domElement, keys) {
            var done = false;
            runs(function() {
                Cmd.native.sendKeys(domElement, keys, function() {
                    done = true;
                });
            });
            waitsFor(function() {
                return done;
            });
        },

        reportRunnerStarting: function(runner) {
            Cmd.status.runStarted();
        },

        reportRunnerResults: function(runner) {
            Cmd.status.runFinished();
        },

        reportSpecResults: function() {},

        reportSpecStarting: function() {},

        reportSuiteStarting: function(suite) {
            Cmd.status.suiteStarted(suite.description);
        },

        reportSuiteResults: function(suite) {
            var results = suite.results().items(),
                result, items, item, i, ilen, j, jlen;
            
            for (i = 0, ilen = results.length; i < ilen; i++) {
                result = results[i];
                
                if (result.isSpecResults) {
                    Cmd.status.testStarted(result.description);
                    
                    if (!result.passed()) {
                        items = result.items();
                        
                        for (j = 0, jlen = items.length; j < jlen; j++) {
                            item = items[j];
                            
                            if (!item.passed()) {
                                Cmd.status.testFailed(result.description, item.message, item.trace.stack);
                            }
                        }
                    }
                    
                    Cmd.status.testFinished(result.description);
                }
            }

            Cmd.status.suiteFinished(suite.description);
        }
    };
    
    Cmd.jasmine = {
        Reporter: JasmineReporter
    };
})();
