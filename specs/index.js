require('./specHelper');
var testsContext = require.context(".", true, /\/(?!(flycheck))[^/]+\.spec$/);
testsContext.keys().forEach(testsContext);
