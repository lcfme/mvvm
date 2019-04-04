(function(MVVM) {
  MVVM.directive("app", {});
  MVVM.directive("controller", {
    scope: true,
    link: function(el, value, scope) {
      var controller = MVVM.controller(value);
      if (!controller) {
        MVVM.$$error("Cannot find controller: " + value);
      }
      controller(scope);
    }
  });
  MVVM.directive("bind", {
    link: function(el, value, scope) {
      scope.$$watch(value, function(value) {
        el.innerHTML = value;
      });
    }
  });

  MVVM.directive("click", {
    scope: true,
    link: function(el, value, scope) {
      el.addEventListener("click", function($event) {
        scope.$event = $event;
        scope.$$apply(value);
        delete scope.$event;
      });
    }
  });

  MVVM.directive("model", {
    link: function(el, value, scope) {
      el.addEventListener("input", function($event) {
        scope.$event = $event;
        scope.$$apply(function(scope) {
          scope[value] = $event.target.value;
        });
        delete scope.$event;
      });
      scope.$$watch(value, function(value) {
        el.value = value;
      });
    }
  });

  MVVM.directive("for", {
    norecursion: true,
    link: function(el, value, scope) {
      var var_reg = "[$_A-Za-z][$_0-9A-Za-z]*";
      var var_regs =
        "\\s*" + var_reg + "\\s*" + "(?:,\\s*" + var_reg + "\\s*)*";
      var for_reg =
        "^\\s*(?:\\((" + var_regs + ")\\)\\s+in\\s+)?(" + var_reg + ")\\s*$";
      var for_reg_compiled = new RegExp(for_reg);
      var m = value.match(for_reg_compiled);
      if (!m) {
        MVVM.$$error("invalid mvvm-for=" + value);
      }
      var itemKey;
      var indexKey;
      var argsStr = m[1];
      if (!argsStr) {
        argsStr = "$item, $index";
      }
      value = m[2];
      var argsArr = argsStr.split(",").map(function(arg) {
        return arg.trim();
      });
      itemKey = argsArr[0] || "$item";
      indexKey = argsArr[1] || "$index";
      el.removeAttribute(MVVM.__prefix_mvvm + "for");
      var template = el.cloneNode(true);
      var startAnchor = document.createComment("mvvm-for-start");
      var endAnchor = document.createComment("mvvm-for-end");
      el.parentNode.replaceChild(endAnchor, el);
      endAnchor.parentNode.insertBefore(startAnchor, endAnchor);

      var scopeCache = [];
      var templateCache = [];
      scope.$$watch(value, function(value) {
        for (var i = 0; i < value.length; i++) {
          var ss = scopeCache[i];
          if (ss && !MVVM.util.equal(ss[itemKey], value[i])) {
            ss = scopeCache.pop();
            ss.$$destroy();
            MVVM.util.removeNode(templateCache[i]);
            ss = scopeCache[i] = undefined;
            templateCache[i] = undefined;
          }
          if (!ss) {
            ss = new MVVM.$$Scope(scope);
            ss[itemKey] = value[i];
            ss[indexKey] = i;
            scopeCache[i] = ss;
            var t = template.cloneNode(true);
            templateCache.push(t);
            MVVM.$$compile(t, ss);
            endAnchor.parentNode.insertBefore(t, endAnchor);
          }
        }
        while (scopeCache.length > value.length) {
          var ss = scopeCache.pop();
          var tp = templateCache.pop();
          ss.$$destroy();
          MVVM.util.removeNode(tp);
        }
      });
    }
  });
})(MVVM);
