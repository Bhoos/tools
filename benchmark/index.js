#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const numeral = require('numeral');
const program = require('commander');
const pkg = require('./package.json');

const timeUnits = ['ns', 'µs', 'ms', 's'];
let iterations = 1000000;

const noop = () => {};
const setup = () => {
  const n = 10000000; // Run a million times to setup a benchmarking function
  const samples = 15;
  const setupTimes = [];
  for (let t = 0; t < samples; t += 1) {
    const start = process.hrtime.bigint();
    for (let i = 0; i < n; i += 1) {
      noop(i);
    }
    const timeTaken = (process.hrtime.bigint() - start);
    setupTimes.push(Number(timeTaken) / n);
  }

  return setupTimes[Math.floor(samples / 2)];
};

let invoked = false;


function benchmark(description, fn, loops) {
  const n = loops || iterations;
  invoked = true;
  const start = process.hrtime.bigint();
  for (let i = 0; i < n; i += 1) {
    fn(i);
  }
  const interval = Number(process.hrtime.bigint() - start); //  - (setupTime * n);
  let unit = 0;
  let perIteration = interval / n;
  while (perIteration >= 1000) {
    perIteration /= 1000;
    unit += 1;
  }
  console.log(`${description}::${numeral(n).format('#,##')} iterations, ${interval / (1000 * 1000)}ms, Per Iteration: ${Math.round(perIteration)}${timeUnits[unit]}`);
}

program
  .version(pkg.version)
  .arguments('<file>')
  .option('-n, --loops <n>', 'Number of iterations', n => parseInt(n, 10), iterations)
  .action((file) => {
    if (!fs.existsSync(file)) {
      console.log(`Path not found ${file}`);
      return;
    }

    iterations = program.loops || iterations;
    const setupTime = setup();
    console.log(`Approx setup time: ${setupTime}ns`);
    console.log('======================================');
    // eslint-disable-next-line import/no-dynamic-require, global-require
    require(path.resolve(file));
  });

// Add benchmark as global function
global.benchmark = benchmark;
program.parse(process.argv);

// Require the path
if (!invoked) {
  console.log('Example file.js');
  console.log('  benchmark(\'createClass\', () => createClass());');
  console.log('  benchmark(\'constructor\', () => new Class());');
}
