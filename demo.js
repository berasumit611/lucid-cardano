// demo.ts
// Defining a variable with a type annotation
var message = "Hello, TypeScript!";
// Function that takes two numbers and returns their sum
function addNumbers(a, b) {
    return a + b;
}
// Calling the function with arguments
var result = addNumbers(5, 10);
// Logging the message and the result to the console
console.log(message); // Output: Hello, TypeScript!
console.log("The sum is: " + result); // Output: The sum is: 15
var person = {
    name: "Alice",
    age: 30
};
console.log("".concat(person.name, " is ").concat(person.age, " years old.")); // Output: Alice is 30 years old.
