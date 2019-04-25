var ST = window.ST || {};

(function() {
    // By default jasmine computes the "fullName" of a spec or suite by joining it
    // with the descriptions of all its ancestors using " " as the delimiter.
    // We set jasmine.FULL_NAME_DELIMITER property to " -> " to avoid a situation
    // where the following two specs have the same fullName:
    //
    // describe("foo bar", function() {
    //     it("baz", function() {});
    // });
    //
    // describe("foo", function() {
    //     it("bar baz", function() {});
    // });
    //
    jasmine.FULL_NAME_DELIMITER = " -> ";

    ST.rootSuiteIdsByFile = {};

    (function() {
        var superDescribe = window.describe,
            superAfterFiles = ST.afterFiles;
        
        window.describe = function(desc, specs) {
            if (ST.currentTestFile) {
                specs.orionTestFile = ST.currentTestFile;
            }
            
            return superDescribe.apply(this, arguments);
        };
        
        ST.afterFiles = function() {
            superAfterFiles.call(ST);
            
            jasmine.onReady(function() {
                jasmine.getEnv().setup();
            });
        };
    })();
    
    ST.JazzmanReporter = {
        reportSuiteDescribeStarting: function(suite) {
            var id = suite.getId(),
                fileName = null,
                rootSuiteIdsByFile = ST.rootSuiteIdsByFile,
                rootSuiteIds;

            if (suite.isTopSuite) {
                fileName = suite.orionTestFile;
                rootSuiteIds = rootSuiteIdsByFile[fileName] || (rootSuiteIdsByFile[fileName] = []);
                rootSuiteIds.push(id);
            }

            ST.status.suiteEnter({
                id: id,
                name: suite.description,
                fileName: fileName,
                disabled: suite.isDisabled()
            });
        },
        
        reportSpecAdded: function(spec) {
            ST.status.testAdded({
                id: spec.getId(),
                name: spec.description,
                disabled: spec.isDisabled()
            });
        },
        
        reportSuiteDescribeFinishing: function(suite) {
            ST.status.suiteLeave({
                id: suite.getId(),
                name: suite.description
            });
        },
        
        reportRunnerStarting: function(runner) {
            ST.status.runStarted();
        },
        
        reportRunnerResults: function(runner) {
            ST.status.runFinished();
        },
        
        reportSuiteStarting: function(suite) {
            ST.status.suiteStarted({
                id: suite.getId(),
                name: suite.description
            });
        },
        
        reportSuiteResults: function(suite) {
            ST.status.suiteFinished({
                id: suite.getId(),
                name: suite.description
            });
        },
        
        reportSpecStarting: function(spec) {
            ST.JazzmanReporter._currentSpec = spec;
            ST.JazzmanReporter._screenshotCount = 1;
            
            ST.status.testStarted({
                id: spec.getId(),
                name: spec.description
            });
        },
        
        reportSpecResults: function(spec) {
            var results, expectations, expectation, i, len;
            
            results = spec.results();
            expectations = results.items();
            
            for (i = 0, len = expectations.length; i < len; i++) {
                expectation = expectations[i];
                
                ST.status.addResult({
                    passed: expectation.passed(),
                    message: expectation.toString()
                });
            }
            
            ST.status.testFinished({
                id: spec.getId(),
                name: spec.description,
                disabled: spec.isDisabled()
            });
            
            ST.JazzmanReporter._currentSpec = null;
        }
    };

    ST.TestController = {
        startTestRun: function(message) {
            var testIds = message.testIds;
            
            ST.onReady(function() {
                var env = jasmine.getEnv();
                
                // We want to keep all expected/actual values
                env.keepPassedResults = true;
                env.execute(testIds);
            });
        },
        
        setTestTimeout: function(message) {
            var timeout = message.timeout;
            ST.TestController.timeoutWas = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
        },
        
        resetTestTimeout: function(message) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = ST.TestController.timeoutWas;
        }
    };

    ST.compareScreenshot = function(name, callback) {
        name = name || ST.JasmineReporter._screenshotCount++;
        
        ST.system.screenshot(name, function(screenshot, err) {
            var result = ST.JasmineReporter._currentSpecResult,
                expectations = result.orionExpectations || (result.orionExpectations = []);
            
            if (screenshot) {
                expectations.push({
                    passed: screenshot.passed,
                    message: 'Expected screenshot ' + name + ' to match baseline.',
                    screenshot: screenshot.path
                });
            }
            else if (err) {
                expectations.push({
                    passed: false,
                    message: err
                });
            }
            else {
                expectations.push({
                    passed: true,
                    message: 'Screenshot comparison unsupported for this session'
                });
            }
            
            callback();
        });
    };

    //window.playEvents = function(events, callback) {
    //    top.playEvents(events, callback);
    //}

    ST.addController(ST.TestController);
    
    jasmine.getEnv().addReporter(ST.JazzmanReporter);
    
    ST.onReady(function() {
        jasmine.unblockReady();
    });
})();
