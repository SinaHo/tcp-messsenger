module.exports.syncSleep = function(tm) {
  // insufficient just for test
  let bound = new Date();
  bound.setSeconds(bound.getSeconds() + tm);
  while (bound > new Date()) {}
  return "waited";
};

module.exports.asyncSleep = function(tm) {
  // return new Promise(((res, rej) = {}));
};
