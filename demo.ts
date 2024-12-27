// demo.ts

// Defining a variable with a type annotation
let message: string = "Hello, TypeScript!";

// Function that takes two numbers and returns their sum
function addNumbers(a: number, b: number): number {
  return a + b;
}

// Calling the function with arguments
let result = addNumbers(5, 10);

// Logging the message and the result to the console
console.log(message); // Output: Hello, TypeScript!
console.log("The sum is: " + result); // Output: The sum is: 15

// An example of using an interface
interface Person {
  name: string;
  age: number;
}

const person: Person = {
  name: "Alice",
  age: 30
};

console.log(`${person.name} is ${person.age} years old.`); // Output: Alice is 30 years old.
