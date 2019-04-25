if (top.location.search.indexOf("cmd-test=true") > 0) {
    var Cmd = {
        sendMessage: function(message, callback) {
            if (typeof message != 'object') {
                message = {
                    type: message
                };
            }

            message.seq = ++Cmd._seq;
            
            if (callback) {
                Cmd._callbacks[message.seq] = callback;
                message.callback = true;
            }
            
            Cmd._messageQueue[Cmd._queueSize++] = message;
            
            Cmd._notifyWebDriver();
        },

        native: {
            getWindowHandle: function(callback) {
                Cmd.sendMessage({
                    type: 'getWindowHandle'
                }, callback);
            },

            getWindowHandles: function(callback) {
                Cmd.sendMessage({
                    type: 'getWindowHandles'
                }, callback);
            },
            
            switchTo: function(options, callback) {
                options.type = 'switchTo';
                Cmd.sendMessage(options, callback);
            },

            close: function(callback) {
                Cmd.sendMessage({
                    type: 'close'
                }, callback);
            },

            screenshot: function(name, callback) {
                Cmd.sendMessage({
                    type: 'screenshot',
                    name: name
                }, callback);
            },

            click: function(domElement, callback) {
                Cmd.sendMessage({
                    type: 'click',
                    elementId: domElement.id
                }, callback);
            },

            sendKeys: function(domElement, keys, callback) {
                Cmd.sendMessage({
                    type: 'sendKeys',
                    elementId: domElement.id,
                    keys: keys
                }, callback);
            }
        },

        // ----------------------------------------------------------------------------
        // Internal API used by test runners to report results and progress

        status: {
            runStarted: function(callback) {
                Cmd.sendMessage('testRunnerStarted', callback);
            },

            runFinished: function(callback) {
                Cmd.sendMessage('testRunnerFinished', callback);
            },

            suiteStarted: function(name, callback) {
                Cmd.sendMessage({
                    type: 'testSuiteStarted',
                    name: name
                }, callback);
            },

            suiteFinished: function(name, callback) {
                Cmd.sendMessage({
                    type: 'testSuiteFinished',
                    name: name
                }, callback);
            },

            testStarted: function(name, callback) {
                Cmd.sendMessage({
                    type: 'testStarted',
                    name: name
                }, callback);
            },

            testFinished: function(name, callback) {
                Cmd.sendMessage({
                    type: 'testFinished',
                    name: name
                }, callback);
            },

            testFailed: function(name, error, details, callback) {
                Cmd.sendMessage({
                    type: 'testFailed',
                    name: name,
                    error: error,
                    details: details
                }, callback);
            },

            getCurrentChunk: function(array) {
                return Test.Options.getCurrentChunk(array);
            }
        },

        // ----------------------------------------------------------------------------
        // Private API

        // Reduce GC churn by pre-sizing the queue
        _messageQueue: new Array(10000),
        _queueSize: 0,
        _seq: 0,
        _callbacks: {},

        _callback: function(seq, result) {
            var fn = Cmd._callbacks[seq];
            delete Cmd._callbacks[seq];
            fn(result);
        },


        _getUrlParam: function (name) {
            var re = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)');
            var m = re.exec(top.location.search);

            return m && decodeURIComponent(m[1]);
        },

        _purgeMessages: function(count) {
            // We purge messages when extracting them to reduce lags and CPU load
        },

        _notifyWebDriver: function() {
            if (Cmd._pendingNotifier) {
                return;
            }

            var notifier = function() {
                var webDriverCallback = Cmd._webDriverCallback,
                    messages, error;
                
                if (webDriverCallback) {
                    try {
                        messages = JSON.stringify(Cmd._messageQueue.slice(0, Cmd._queueSize));
                    }
                    catch (e) {
                        error = e + '';
                    };
                    
                    Cmd._messageQueue.length = Cmd._queueSize = 0;
                    Cmd._webDriverCallback = null;
                    Cmd._pendingNotifier = null;
                    
                    webDriverCallback(messages || error);
                }
                else {
                    Cmd._pendingNotifier = notifier;
                }
            };

            notifier();
        }
    };
}
