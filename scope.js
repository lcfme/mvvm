(function(MVVM) {
  var counter = 0;
  // var identifier = "[$_A-Za-z]([$_0-9A-Za-z])*";
  // var memberExpOrIdentifier = identifier + "(?:\\." + identifier + ")*";
  // var identOrMemExpReg = new RegExp(memberExpOrIdentifier, "g");

  MVVM.$$Scope = Scope;

  function $$digest(scope) {
    var count = 0;
    var shoudRender = false;
    do {
      var dirty = false;
      if (count++ === 10) {
        MVVM.$$error("too many $$digest");
      }
      for (var i = 0; i < scope.watchers.length; i++) {
        var watcher = scope.watchers[i];
        if (watcher.$$checkDirty()) {
          dirty = true;
          shoudRender = true;
        }
      }
    } while (dirty);
    return shoudRender;
  }

  function Scope(parent) {
    this.id = counter++;
    this.children = [];
    this.watchers = [];

    if (parent instanceof Scope) {
      this.parent = parent;
      parent.$$child(this);
    }

    MVVM.$$scope(String(this.id), this);
  }
  Scope.prototype.$$child = function(scope) {
    if (!(scope instanceof Scope)) {
      MVVM.$$error();
    }
    scope.__proto__ = this;
    this.children.push(scope);
    return scope;
  };
  Scope.prototype.$$watch = function(expr, cb) {
    if (
      !(typeof expr === "string" || typeof expr === "function") ||
      typeof cb !== "function"
    ) {
      MVVM.$$error();
    }
    var watcher = new MVVM.$$Watcher(expr, cb, this);
    this.watchers.push(watcher);
    return watcher;
  };

  Scope.prototype.$$digest = function() {
    var s = this;
    var arr = [];
    arr.push(s);
    while (s.parent) {
      s = s.parent;
      arr.push(s);
    }
    while (arr.length) {
      s = arr.pop();
      if ($$digest(s)) {
        s.$$render();
      }
    }

    for (var i = this.children.length; i--; ) {
      arr.push(this.children[i]);
    }
    while (arr.length) {
      s = arr.pop();
      s.$$render();
      for (var i = s.children.length; i--; ) {
        arr.push(s.children[i]);
      }
    }
  };
  Scope.prototype.$$removeChild = function(scope) {
    for (var i = this.children.length; i--; ) {
      if (this.children[i] === scope) {
        this.children.splice(i, 1);
      }
    }
  };
  Scope.prototype.$$render = function() {
    for (var i = 0; i < this.watchers.length; i++) {
      var watcher = this.watchers[i];
      watcher.cb.call(this, watcher.value);
    }
  };
  Scope.prototype.$$apply = function(fn) {
    this.$$eval(fn);
    this.$$digest();
  };
  Scope.prototype.$$eval = function(expr) {
    var val;
    try {
      if (typeof expr === "function") {
        val = expr.call(this, this);
      } else {
        with (this) {
          val = eval(expr);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      return MVVM.util.clone(val);
    }
  };
  Scope.prototype.$$destroy = function() {
    for (var i = this.children.length; i--; ) {
      this.children[i].$$destroy();
    }
    if (this.parent) {
      this.parent.$$removeChild(this);
    }
    this.watchers.length = 0;
    MVVM.$$unregister(MVVM.__prefix_scope + this.id);
  };
  // Scope.prototype.$$replaceEvalStr = function(expr, replaceFunc) {
  //   if (typeof expr !== "string" || typeof replaceFunc !== "function") {
  //     MVVM.$$error();
  //   }
  //   return expr.replace(identOrMemExpReg, replaceFunc);
  // };

  // Scope.prototype.$$lookupScopeWithProperty = function(key) {
  //   var arr = [],
  //     s = this,
  //     varsArr = key.split("."),
  //     r = "this";
  //   arr.push(s);
  //   while (arr.length) {
  //     s = arr.pop();
  //     if (s.hasOwnProperty(varsArr[0])) {
  //       return r + "." + varsArr.join(".");
  //     }
  //     if (s.parent) {
  //       r += ".__protp__";
  //       arr.push(s.parent);
  //     }
  //   }
  //   MVVM.$$error("Cannot resolve exp: " + key);
  // };
})(MVVM);
