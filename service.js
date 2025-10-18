(function () {
  window.myAwesomeService = {
    greet: function (name) {
      return `Hello, ${name}!`;
    },
    add: function (a, b) {
      return a + b;
    },
    subtract: function (a, b) {
      return a - b;
    },
    multiply: function (a, b) {
      return a * b;
    },
    divide: function (a, b) {
      if (b === 0) {
        return "Error: Division by zero";
      }
      return a / b;
    },
  };
})();
