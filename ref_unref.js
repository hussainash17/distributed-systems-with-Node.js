const t1 = setTimeout(() => {
  console.log('Hello from t1');
}, 100000000);
const t2 = setTimeout(() => {
  console.log('Hello from t2');
}, 100000000);

t1.unref();

clearTimeout(t2);

t2.ref()
