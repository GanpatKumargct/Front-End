function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("ggg")


// Function expression
const multiply = function(x, y) {
  return x * y;
};

console.log(multiply(4, 5)); // Output: 20

//Arrow function
const square = (x) => {
  return x * x;
};

console.log(square(5)); // Output: 25

//nested function
function calculateBill(amount, taxRate) {
  function addTax(value) {
    return value + (value * taxRate);
  }
  return addTax(amount);
}

console.log(calculateBill(100, 0.05)); // Output: 105