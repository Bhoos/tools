const fs = require('fs');
const path = require('path');
const numeral = require('numeral');
const timeUnits = ['ms', 'µs', 'ns', 'ps'];

let invoked = false;

function benchmark(description, fn, n = 100000) {
  invoked = true;
  const start = Date.now();
  for (let i = 0; i < n ;i += 1) {
    fn(i);
  }

  const interval = Date.now() - start;
  const rate = Math.round(n * 1000 / interval);
  let unit = 0;
  let perIteration = interval / n;
  while (perIteration < 1) {
    perIteration *= 1000;
    unit += 1;
  }
  console.log(`${description}::${numeral(n).format('#,##')} iterations, ${interval}ms, Per Iteration: ${Math.round(perIteration)}${timeUnits[unit]}`);
}

global.benchmark = benchmark;
const file = process.argv[2];

if (!fs.existsSync(file)) {
  console.log(`Path not found ${file}`);
  return;
}

// Require the path
require(path.resolve(file));

if (!invoked) {
  console.log('Usage: ');
  console.log('  benchmark <file.js>');
  console.log('');
  console.log('Example file.js');
  console.log('  benchmark(\'createClass\', () => createClass());');
  console.log('  benchmark(\'constructor\', () => new Class());');
}
