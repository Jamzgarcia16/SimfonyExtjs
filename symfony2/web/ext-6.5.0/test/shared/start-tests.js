(function() {
    var jasmine = this.jasmine,
        env = jasmine.getEnv();
    
    if (!/local\-reporter=false/i.test(top.location.search)) {
        env.addReporter(parent.Test.SandBox.reporter);
    }
    
    // Local runner hooks into window.Cmd object as well
    if (window.Cmd && window.Cmd['native']) {
        top.Cmd = Cmd;
        
        jasmine.CI_ENVIRONMENT = true;
        jasmine.DEBUGGING_MODE = false;
        
        // Android does not have maxTouchPoints, so it will fail feature detection.
        // We can't use presence of methods because they are there on desktop browsers.
        // So if Android, we assume touch is used.
        jasmine.supportsTouch = jasmine.supportsTouch || Ext.isAndroid;
        
        env.addReporter(new Cmd.jasmine.Reporter());
        
        // Firefox driver keeps the focus in the address bar after driver.get(url), which 
        // causes many specs to fail, so we click on a focusable element to workaround
        // this behavior
        // https://code.google.com/p/selenium/issues/detail?id=8100
        Cmd.native.click(top.document.getElementById('collapseAll'));
        
        Cmd.native.switchTo({frame: 'sandbox'}, function() {
            env.execute();
        });
    }
    else {
        env.execute();
    }
})();
