(function(MVVM) {
  var dirsWeight = ["click", "for"];

  function equal(a, b) {
    if (!a || typeof a !== "object") {
      return a === b;
    }
    var eq = true;
    try {
      for (var k in a) {
        if (!equal(a[k], b[k])) {
          eq = false;
        }
      }
    } catch (err) {
      eq = false;
    }
    return eq;
  }
  MVVM.util = {
    equal: function(a, b) {
      var eq = equal(a, b);
      if (eq) {
        eq = equal(b, a);
      }
      return eq;
    },
    clone: function(obj) {
      if (obj === null || typeof obj !== "object") {
        return obj;
      }
      if (Array.isArray(obj)) {
        var arr = [];
        for (var i = 0; i < obj.length; i++) {
          arr[i] = obj[i];
        }
        return arr;
      }
      var proto = obj;
      while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
      }
      if (
        Object.getPrototypeOf(obj) === proto ||
        Object.getPrototypeOf(obj) === null
      ) {
        var o = {};
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            o[i] = obj[i];
          }
        }
        return o;
      }
      return obj;
    },
    filterDirs: function(attrs) {
      var mvvm_reg = new RegExp("^" + MVVM.__prefix_mvvm + "([\\s\\S]*)");
      var arr = [];
      for (var i = 0; i < attrs.length; i++) {
        var attrName = attrs[i].name;
        var attrVal = attrs[i].value;
        var match = attrName.match(mvvm_reg);
        if (!match) continue;
        var dirStr = match[1];
        arr.push({
          name: dirStr,
          value: attrVal
        });
      }
      var arr = arr.sort(function(a, b) {
        return dirsWeight.indexOf(b.name) - dirsWeight.indexOf(a.name);
      });
      return arr;
    },
    removeNode(el) {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  };
})(MVVM);
