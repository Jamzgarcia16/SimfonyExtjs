// We need this REALLY early on so that specs and suites could check
// various conditions and disable themselves if necessary.
(function() {
    // The roundabout way of passing options is to avoid assigning objects across iframes.
    // Older IEs freak out mightily over that, but assigning primitives is OK.
    var options = jasmine._options = JSON.parse(window.__UNIT_TESTING__ || '{}');
    
    if (options.disableTryCatch) {
        jasmine.CATCH_EXCEPTIONS = false;
    }
    
    if (options.debug) {
        jasmine.DEBUG_ON_ERROR = true;
    }
    
    if (options.logElementGarbage) {
        jasmine.LOG_ELEMENT_GARBAGE = true;
    }
    
    if (!options.disableLeakChecks) {
        jasmine.CHECK_LEAKS = true;
    }
    
    if (options.dukeNukem === false || options.clearPrototype === false) {
        jasmine.CLEAR_PROTOTYPE = false;
    }
    
    // This needs to kick in early on
    if (options.topSuites && jasmine.object.keys(options.topSuites).length) {
        jasmine.DEBUGGING_MODE = true;
        top.Test.STATUS_UPDATE_INTERVAL = 0;
    }
    // Sencha Test will do these pieces automatically, so we have split these
    // out so we can only use them when not using ST.
    else {
        jasmine.getEnv().require([
            '*',
            // These are required by Pivot grid tests
            'Ext.ux.ajax.JsonSimlet',
            'Ext.ux.ajax.XmlSimlet',
            'Ext.ux.ajax.SimManager'
        ]);
        
        if (!Ext.isModern) {
            jasmine.getEnv().require('Ext.ux.PreviewPlugin');
        }
    }
    
    if (options.ci) {
        jasmine.DEBUGGING_MODE = false;
        jasmine.CI_ENVIRONMENT = true;
    }

    if (Ext && Ext.theme) {
        // To avoid complicating layout specs we never run in big mode.
        delete Ext.theme.getDocCls;
    }
})();

Ext.Loader.setConfig({ enabled: true });

// These need to be assigned after Ext has been loaded
jasmine.startLoadingDependencies = Ext.require;

jasmine.installDependenciesCallback = function(callback) {
    // We unblock the queue on ready instead of require callback
    // becase we want `uses` classes to finish loading, too
    Ext.onReady(callback, null, { priority: -9000 });
};

// Native Promises are really annoying in that they're throwing "unhandled rejection"
// exceptions whenever a Promise is rejected and is not handled. This makes writing
// tests too complicated, so we use Ext promises instead for tests.
Ext.useExtPromises = true;
