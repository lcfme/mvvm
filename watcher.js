(function(MVVM) {
  MVVM.$$Watcher = Watcher;
  function Watcher(expr, cb, scope) {
    this.expr = expr;
    this.scope = scope;
    this.cb = cb;
    this.value = this.$$eval();
  }
  Watcher.prototype.$$eval = function() {
    return this.scope.$$eval(this.expr);
  };
  Watcher.prototype.$$checkDirty = function() {
    var dirty = false;
    var val = this.$$eval();
    if (!MVVM.util.equal(val, this.value)) {
      dirty = true;
    }
    this.value = val;
    return dirty;
  };
})(MVVM);
