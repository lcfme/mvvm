(function(MVVM) {
  MVVM.$$compile = Compiler;
  function Compiler(el, scope) {
    var mvvm_reg = new RegExp("^" + MVVM.__prefix_mvvm + "([\\s\\S]*)");
    if (!(el instanceof HTMLElement)) {
      MVVM.$$error();
    }
    var norecursion = false;
    scope = scope || new MVVM.$$Scope();
    var attrs = MVVM.util.filterDirs(Array.prototype.slice.call(el.attributes));
    attrs.forEach(function(attr) {
      if (norecursion) return;
      var attrName = attr.name;
      var attrVal = attr.value;
      var directive = MVVM.directive(attrName);
      if (!directive) {
        console.warn("Unable to find directive: " + attrName);
        return;
      }
      if (directive.scope) {
        scope = new MVVM.$$Scope(scope);
      }
      if (directive.link) {
        directive.link(el, attrVal, scope);
      }
      if (directive.norecursion) {
        norecursion = true;
      }
    });

    scope.$$digest();
    scope.$$render();

    if (!norecursion && el.children) {
      Array.prototype.slice.call(el.children).forEach(function(el) {
        Compiler(el, scope);
      });
    }
  }
})(MVVM);
