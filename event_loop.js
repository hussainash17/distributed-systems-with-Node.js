const fs = require('fs');
// setImmediate goes to queue for printing log
setImmediate(() => console.log(1));
// promise resolve also goes to queue for printing
Promise.resolve().then(() => console.log(2));
// nextTick() runs next, adding callback 3 to the next tick
// microtask queue. 
process.nextTick(() => console.log(3));

fs.readFile(__filename, () => {
  console.log(4);
  setTimeout(() => console.log(5));
  setImmediate(() => console.log(6));
  process.nextTick(() => console.log(7));
});
console.log(8);
