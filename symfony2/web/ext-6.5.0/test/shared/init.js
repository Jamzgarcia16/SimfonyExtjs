// Jasmine should be loaded by this time. addGlobal() is defined in jasmine.js
addGlobal([
    'spec',
    // Seems to be some weird issue with firebug where it will randomly introduce this
    // global, so lets ignore it for now.
    '_xdc_'
]);
