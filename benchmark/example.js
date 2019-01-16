const obj = { a: 1, b: 2 };
class P {
  constructor(obj) {
    this.obj = obj;
  }
}

benchmark('Example exponentiation', () => 2 ** 8);
benchmark('Example shift', () => 2 << 8);
benchmark('Spread operation', () => ({...obj, c: 3 }));
benchmark('Object.assign', () => Object.assign({}, { c: 3 }, obj));
benchmark('New Object', () => { obj.c = 3; new P(obj); });