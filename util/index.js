
exports.parallel = function () {
  var count = 0;

  return function parallel(fn) {
    count++;
    fn = fn || function () {};

    return function () {
      fn.apply(fn, arguments);
      if (!--count) {
        parallel.callback();
      }
    };
  };
};
