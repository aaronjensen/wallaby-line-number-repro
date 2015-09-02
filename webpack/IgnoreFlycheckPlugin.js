var DirectoryWatcher = require('watchpack/lib/DirectoryWatcher');

function IgnoreFlycheckPlugin() {
}

function wrapWithFlycheckIgnore(watcher, property) {
  var original = watcher.prototype[property];

  watcher.prototype[property] = function(filePath, stat) {
    if (filePath.indexOf('flycheck_') !== -1) return;
    original.apply(this, [filePath, stat]);
  };
}

IgnoreFlycheckPlugin.prototype.apply = function(compiler) {
  compiler.plugin('after-environment', function() {
    wrapWithFlycheckIgnore(DirectoryWatcher, 'onChange');
    wrapWithFlycheckIgnore(DirectoryWatcher, 'onFileAdded');
    wrapWithFlycheckIgnore(DirectoryWatcher, 'onFileUnlinked');
  });
};

module.exports = IgnoreFlycheckPlugin;
