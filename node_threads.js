// libuv maintains a thread pool for managing I/O operations, as well as
// CPU-heavy operations like crypto and zlib.

// finite size of pool

const fs = require('fs');

// /etc/passwd --> it scheduled by libuv
fs.readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log('Hello');
  console.log(data);
});

setImmediate(() => {
  // this callback scheduled by V8
  console.log('This runs while file is being read');
});

setTimeout(() => {
  console.log('Hello setTimeout');
}, 0);
