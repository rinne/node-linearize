# Linearize - Encode and Decode Data

## In a Nutshell

Linearizer does basically what JSON.stringify() and JSON.parse() does,
but instead of a JSON string, the encoded blob is an compact array of
bytes (Uint8Array in JavaScript).

## Caution!

This is work in progress. Wait for version 1.0.

## Reference

```
const { enc, dec } = require('linearize');

let a = { a: [1,2,3],  b: 123, c: Math.pow(Math.PI, 200), t: [ true, false ], str: '100.000.000€' };
let b = enc(a);
console.log(`len=${b.length}: ${b.join(',')}`);
let c = dec(b);
let d = JSON.stringify(c);
console.log(`len=${d.length}: ${d}`);
```

```
len=63: 81,31,60,61,22,97,0,71,23,21,22,23,61,22,98,0,31,123,61,22,99,0,10,220,101,181,252,15,176,147,84,61,24,115,116,114,0,61,31,15,49,48,48,46,48,48,48,46,48,48,48,226,130,172,0,61,22,116,0,71,22,1,2
len=85: {"a":[1,2,3],"b":123,"c":2.691377013238864e+99,"str":"100.000.000€","t":[true,false]}
```

## Encoding

- The encoded data is not a printable string but instead a binary blob.
- Undefined value can not be encoded and there is no implicit
  conversion from undefined to null.
- Strings are UTF-8 encoded and encoding of a string includes an extra
  NUL byte after the string itself, so that some implementations may
  refer to the string in-place rather than copying it. That NUL is
  _not_ included into to the decoded string.
- Object encoding does not maintain key order. In fact keys are sorted to
  alphabetical order as implemented by Array.sort() in JavaScript

## Author

Timo J. Rinne <tri@iki.fi>

## License

MIT License
