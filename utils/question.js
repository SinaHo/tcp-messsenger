const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
module.exports = function(text, callback) {
  rl.question(text, answer => {
    callback.call(this, answer);
    // rl.close();
  });
};
