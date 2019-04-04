var MVVM = {
  $$error(msg) {
    throw new Error(msg || "Oops, You are in trouble.");
  },
  __prefix_mvvm: "mvvm-",
  __prefix_controller: "__controller__",
  __prefix_directive: "__directive__",
  __prefix_scope: "__scope__",
  $$register(key, value) {
    if (!key || typeof key !== "string") {
      this.$$error();
    }
    this.__cache[key] = value;
    return value;
  },
  $$get(key) {
    return this.__cache[key];
  },
  $$unregister(key) {
    if (typeof key !== "string") {
      this.$$error();
    }
    delete this.__cache[key];
  },
  $$scope(name, value) {
    if (!name || typeof name !== "string") {
      this.$$error();
    }
    if (value === undefined) {
      return this.$$get(this.__prefix_scope + name);
    }
    if (!(value instanceof MVVM.$$Scope)) {
      this.$$error();
    }
    return this.$$register(this.__prefix_scope + name, value);
  },
  controller(name, fn) {
    if (!name || typeof name !== "string") {
      this.$$error();
    }
    if (fn === undefined) {
      return this.$$get(this.__prefix_controller + name);
    }
    if (typeof fn !== "function") {
      this.$$error();
    }
    return this.$$register(this.__prefix_controller + name, fn);
  },
  directive(name, obj) {
    if (!name || typeof name !== "string") {
      this.$$error();
    }
    if (obj === undefined) {
      return this.$$get(this.__prefix_directive + name);
    }
    if (!obj || typeof obj !== "object") {
      this.$$error();
    }
    return this.$$register(this.__prefix_directive + name, obj);
  },
  $$bootstrap(el) {
    if (!(el instanceof HTMLElement)) {
      this.$$error();
    }
    MVVM.$$compile(el);
  },
  __cache: {}
};

(function(MVVM) {
  function once(obj, event, fn, ctx) {
    function foo() {
      fn.call(ctx);
      obj.removeEventListener(event, foo);
    }
    obj.addEventListener(event, foo, ctx);
  }
  once(window, "load", function() {
    document
      .querySelectorAll("[" + MVVM.__prefix_mvvm + "app]")
      .forEach(function(el) {
        MVVM.$$bootstrap(el);
      });
  });
})(MVVM);
