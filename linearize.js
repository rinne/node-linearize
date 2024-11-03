'use strict';

const T_CONSTANT_NULL = 0;
const T_CONSTANT_TRUE = 1;
const T_CONSTANT_FALSE = 2;
const T_DOUBLE = 10;
const T_INT_CONSTANT_0 = 20;
const T_INT_CONSTANT_1 = 21;
const T_INT_CONSTANT_2 = 22;
const T_INT_CONSTANT_3 = 23;
const T_INT_CONSTANT_4 = 24;
const T_INT_CONSTANT_5 = 25;
const T_INT_CONSTANT_6 = 26;
const T_INT_CONSTANT_7 = 27;
const T_INT_CONSTANT_8 = 28;
const T_INT_CONSTANT_9 = 29;
const T_INT_L1 = 31;
const T_INT_L2 = 32;
const T_INT_L3 = 33;
const T_INT_L4 = 34;
const T_INT_L5 = 35;
const T_INT_L6 = 36;
const T_INT_L7 = 37;
const T_INT_L8 = 38;
const T_INT_NEG_CONSTANT_1 = 41;
const T_INT_NEG_CONSTANT_2 = 42;
const T_INT_NEG_CONSTANT_3 = 43;
const T_INT_NEG_CONSTANT_4 = 44;
const T_INT_NEG_CONSTANT_5 = 45;
const T_INT_NEG_CONSTANT_6 = 46;
const T_INT_NEG_CONSTANT_7 = 47;
const T_INT_NEG_CONSTANT_8 = 48;
const T_INT_NEG_CONSTANT_9 = 49;
const T_INT_NEG_L1 = 51;
const T_INT_NEG_L2 = 52;
const T_INT_NEG_L3 = 53;
const T_INT_NEG_L4 = 54;
const T_INT_NEG_L5 = 55;
const T_INT_NEG_L6 = 56;
const T_INT_NEG_L7 = 57;
const T_INT_NEG_L8 = 58;
const T_STRING_CONSTANT_EMPTY = 60;
const T_STRING = 61;
const T_ARRAY_CONSTANT_EMPTY = 70;
const T_ARRAY = 71;
const T_OBJECT_CONSTANT_EMPTY = 80;
const T_OBJECT = 81;

const [ floatBufInternalize, floatBufExternalize ] = (function() {
	let lt = (function() {
		let b = new ArrayBuffer(8);
		let d = (new Float64Array(b))[0] =  3.14159265;
		let a = Array.from((new Uint8Array(b)));
		let l = [ a.indexOf(0xf1), a.indexOf(0xd4), a.indexOf(0xc8), a.indexOf(0x53), a.indexOf(0xfb), a.indexOf(0x21), a.indexOf(0x09), a.indexOf(0x40) ];
		if (l.indexOf(-1) != -1) {
			throw new Error("Can't find endianness for float encoding");
		}
		return Uint8Array.from(l);
	})();
	if ((lt[0] == 0) && (lt[1] == 1) && (lt[2] == 2) && (lt[3] == 3) && (lt[4] == 4) && (lt[5] == 5) && (lt[6] == 6) && (lt[7] == 7)) {
		return [ (function(b) { return b; }), (function(b) { return b; }) ];
	}
	let rt = Uint8Array.from([ lt.indexOf(0), lt.indexOf(1), lt.indexOf(2), lt.indexOf(3), lt.indexOf(4), lt.indexOf(5), lt.indexOf(6), lt.indexOf(7) ]);
	return [
		(function(b) {
			return new Uint8Array([ b[rt[0]], b[rt[1]], b[rt[2]], b[rt[3]], b[rt[4]], b[rt[5]], b[rt[6]], b[rt[7]] ]);
		}),
		(function(b) {
			return new Uint8Array([ b[lt[0]], b[lt[1]], b[lt[2]], b[lt[3]], b[lt[4]], b[lt[5]], b[lt[6]], b[lt[7]] ]);
		})
	];
})();

var decoder;

function number_dec(b) {
	let neg = false, n;
	switch (b[0]) {
	case T_INT_CONSTANT_0:
		return { val: 0, len: 1 };
	case T_INT_CONSTANT_1:
		return { val: 1, len: 1 };
	case T_INT_CONSTANT_2:
		return { val: 2, len: 1 };
	case T_INT_CONSTANT_3:
		return { val: 3, len: 1 };
	case T_INT_CONSTANT_4:
		return { val: 4, len: 1 };
	case T_INT_CONSTANT_5:
		return { val: 5, len: 1 };
	case T_INT_CONSTANT_6:
		return { val: 6, len: 1 };
	case T_INT_CONSTANT_7:
		return { val: 7, len: 1 };
	case T_INT_CONSTANT_8:
		return { val: 8, len: 1 };
	case T_INT_CONSTANT_9:
		return { val: 9, len: 1 };
	case T_INT_NEG_CONSTANT_1:
		return { val: -1, len: 1 };
	case T_INT_NEG_CONSTANT_2:
		return { val: -2, len: 1 };
	case T_INT_NEG_CONSTANT_3:
		return { val: -3, len: 1 };
	case T_INT_NEG_CONSTANT_4:
		return { val: -4, len: 1 };
	case T_INT_NEG_CONSTANT_5:
		return { val: -5, len: 1 };
	case T_INT_NEG_CONSTANT_6:
		return { val: -6, len: 1 };
	case T_INT_NEG_CONSTANT_7:
		return { val: -7, len: 1 };
	case T_INT_NEG_CONSTANT_8:
		return { val: -8, len: 1 };
	case T_INT_NEG_CONSTANT_9:
		return { val: -9, len: 1 };
	case T_DOUBLE:
		{
			if (b.length < 9) {
				throw new Error('Truncated input');
			}
			let n = (new Float64Array(floatBufInternalize(b.slice(1, 9)).buffer))[0];
			if (! Number.isFinite(n)) {
				throw new Error('Invalid input');
			}
			return { val: n, len: 9 };
		}
	case T_INT_NEG_L1:
		neg = true;
	case T_INT_L1:
		if (b.length < 2) {
			throw new Error('Truncated input');
		}
		n = b[1];
		if (n < 10) {
			throw new Error('Invalid input');
		}
		return { val: neg ? -n : n, len: 2 };
	case T_INT_NEG_L2:
		neg = true;
	case T_INT_L2:
		if (b.length < 3) {
			throw new Error('Truncated input');
		}
		if (b[2] == 0) {
			throw new Error('Invalid input');
		}
		n = (b[2] << 8) | b[1];
		return { val: neg ? -n : n, len: 3 };
	case T_INT_NEG_L3:
		neg = true;
	case T_INT_L3:
		if (b.length < 4) {
			throw new Error('Truncated input');
		}
		if (b[3] == 0) {
			throw new Error('Invalid input');
		}
		n = (b[3] << 16) | (b[2] << 8) | b[1];
		return { val: neg ? -n : n, len: 4 };
	case T_INT_NEG_L4:
		neg = true;
	case T_INT_L4:
		if (b.length < 5) {
			throw new Error('Truncated input');
		}
		if (b[4] == 0) {
			throw new Error('Invalid input');
		}
		n = (b[4] * 0x1000000) + ((b[3] << 16) | (b[2] << 8) | b[1]);
		return { val: neg ? -n : n, len: 5 };
	case T_INT_NEG_L5:
		neg = true;
	case T_INT_L5:
		if (b.length < 6) {
			throw new Error('Truncated input');
		}
		if (b[5] == 0) {
			throw new Error('Invalid input');
		}
		n = (b[5] * 0x100000000) + (b[4] * 0x1000000) + ((b[3] << 16) | (b[2] << 8) | b[1]);
		return { val: neg ? -n : n, len: 6 };
	case T_INT_NEG_L6:
		neg = true;
	case T_INT_L6:
		if (b.length < 7) {
			throw new Error('Truncated input');
		}
		if (b[6] == 0) {
			throw new Error('Invalid input');
		}
		n = (b[6] * 0x10000000000) + (b[5] * 0x100000000) + (b[4] * 0x1000000) + ((b[3] << 16) | (b[2] << 8) | b[1]);
		return { val: neg ? -n : n, len: 7 };

	case T_INT_NEG_L7:
		neg = true;
	case T_INT_L7:
		// In Javascript this results to a safe integer only if the encoded
		// value is -9007199254740991 ≤ x ≤ 9007199254740991.
		// Javascript encoder never produces these.
		if (b.length < 8) {
			throw new Error('Truncated input');
		}
		if (b[7] == 0) {
			throw new Error('Invalid input');
		}
		n = (b[7] * 0x1000000000000) + (b[6] * 0x10000000000) + (b[5] * 0x100000000) + (b[4] * 0x1000000) + ((b[3] << 16) | (b[2] << 8) | b[1]);
		return { val: neg ? -n : n, len: 8 };
	case T_INT_NEG_L8:
		neg = true;
	case T_INT_L8:
		// In Javascript this gives a safe integer only if the encoded
		// value is -9007199254740991 ≤ x ≤ 9007199254740991.
		// Javascript encoder never produces these.
		if (b.length < 9) {
			throw new Error('Truncated input');
		}
		if (b[8] == 0) {
			throw new Error('Invalid input');
		}
		n = (b[8] * 0x100000000000000) + (b[7] * 0x1000000000000) + (b[6] * 0x10000000000) + (b[5] * 0x100000000) + (b[4] * 0x1000000) + ((b[3] << 16) | (b[2] << 8) | b[1]);
		return { val: neg ? -n : n, len: 9 };
	}
	throw new Error('Invalid input');
}

function number_enc(n) {
	if (! Number.isFinite(n)) {
		throw new Error('Invalid input');
	}
	if (Number.isSafeInteger(n)) {
		switch (n) {
		case 0:
			return Uint8Array.from([ T_INT_CONSTANT_0 ]);
		case 1:
			return Uint8Array.from([ T_INT_CONSTANT_1 ]);
		case 2:
			return Uint8Array.from([ T_INT_CONSTANT_2 ]);
		case 3:
			return Uint8Array.from([ T_INT_CONSTANT_3 ]);
		case 4:
			return Uint8Array.from([ T_INT_CONSTANT_4 ]);
		case 5:
			return Uint8Array.from([ T_INT_CONSTANT_5 ]);
		case 6:
			return Uint8Array.from([ T_INT_CONSTANT_6 ]);
		case 7:
			return Uint8Array.from([ T_INT_CONSTANT_7 ]);
		case 8:
			return Uint8Array.from([ T_INT_CONSTANT_8 ]);
		case 9:
			return Uint8Array.from([ T_INT_CONSTANT_9 ]);
		case -1:
			return Uint8Array.from([ T_INT_NEG_CONSTANT_1 ]);
		case -2:
			return Uint8Array.from([ T_INT_NEG_CONSTANT_2 ]);
		case -3:
			return Uint8Array.from([ T_INT_NEG_CONSTANT_3 ]);
		case -4:
			return Uint8Array.from([ T_INT_NEG_CONSTANT_4 ]);
		case -5:
			return Uint8Array.from([ T_INT_NEG_CONSTANT_5 ]);
		case -6:
			return Uint8Array.from([ T_INT_NEG_CONSTANT_6 ]);
		case -7:
			return Uint8Array.from([ T_INT_NEG_CONSTANT_7 ]);
		case -8:
			return Uint8Array.from([ T_INT_NEG_CONSTANT_8 ]);
		case -9:
			return Uint8Array.from([ T_INT_NEG_CONSTANT_9 ]);
		}
		let neg = false;
		if (n < 0) {
			neg = true;
			n = -n;
		}
		if (n < 0x100) {
			return Uint8Array.from([ neg ? T_INT_NEG_L1 : T_INT_L1,
									 n ]);
		}
		if (n < 0x10000) {
			return Uint8Array.from([ neg ? T_INT_NEG_L2 : T_INT_L2,
									 n & 0xff,
									 n >> 8 ]);
		}
		if (n < 0x1000000) {
			return Uint8Array.from([ neg ? T_INT_NEG_L3 : T_INT_L3,
									 n & 0xff,
									 (n >> 8) & 0xff,
									 n >> 16 ]);
		}
		if (n < 0x100000000) {
			return Uint8Array.from([ neg ? T_INT_NEG_L4 : T_INT_L4,
									 n & 0xff,
									 (n >> 8) & 0xff,
									 (n >> 16) & 0xff,
									 n >> 24 ]);
		}
		if (n < 0x10000000000) {
			let l = n % 0x1000000;
			let h = (n - l) / 0x1000000;
			return Uint8Array.from([ neg ? T_INT_NEG_L5 : T_INT_L5,
									 l & 0xff,
									 (l >> 8) & 0xff,
									 l >> 16,
									 h & 0xff,
									 h >> 8 ]);
		}
		if (n < 0x1000000000000) {
			let l = n % 0x1000000;
			let h = (n - l) / 0x1000000;
			return Uint8Array.from([ neg ? T_INT_NEG_L6 : T_INT_L6,
									 l & 0xff,
									 (l >> 8) & 0xff,
									 l >> 16,
									 h & 0xff,
									 (h >> 8) & 0xff,
									 h >> 16 ]);
		}
	}
	let b = new ArrayBuffer(8);
	(new Float64Array(b))[0] = n;
	return new Uint8Array([ T_DOUBLE, ...(floatBufExternalize(new Uint8Array(b))) ]);
}

function null_dec(b) {
	if (b[0] === T_CONSTANT_NULL) {
		return { val: null, len: 1 };
	}
	throw new Error('Invalid input');
}

function null_enc(n) {
	if (n !== null) {
		throw new Error('Invalid input');
	}
	return Uint8Array.from([ T_CONSTANT_NULL ]);
}

function boolean_dec(b) {
	switch (b[0]) {
	case T_CONSTANT_TRUE:
		return { val: true, len: 1 };
	case T_CONSTANT_FALSE:
		return { val: false, len: 1 };
	}
	throw new Error('Invalid input');
}

function boolean_enc(n) {
	switch (n) {
	case true:
		return Uint8Array.from([ T_CONSTANT_TRUE ]);
	case false:
		return Uint8Array.from([ T_CONSTANT_FALSE ]);
	}
	throw new Error('Invalid input');
}

function string_dec(b) {
	switch (b[0]) {
	case T_STRING_CONSTANT_EMPTY:
		return { val: '', len: 1 };
	case T_STRING:
		break;
	default:
		throw new Error('Invalid input');
	}
	let l = number_dec(b.slice(1));
	if (l === undefined) {
		throw new Error('Invalid input');
	}
	if ((l.len + l.val) >= b.len) {
		throw new Error('Truncated input');
	}
	b = b.slice(1 + l.len, 1 + l.len + l.val);
	let s = '';
	for (let i = 0; i < b.length; /*NOTHING*/) {
		if (b[i] < 0x80) {
			s += String.fromCharCode(b[i]);
			i += 1;
		} else if (((b[i] & 0b11100000) == 0b11000000) &&
				   (b.length > (i + 1)) &&
				   ((b[i + 1] & 0b11000000) == 0b10000000)) {
			s += String.fromCharCode(((b[i] & 0b00011111) << 6) |
									 (b[i + 1] & 0b00111111));
			i += 2;
		} else if (((b[i] & 0b11110000) == 0b11100000) &&
				   (b.length > (i + 2)) &&
				   ((b[i + 1] & 0b11000000) == 0b10000000) &&
				   ((b[i + 2] & 0b11000000) == 0b10000000)) {
			s += String.fromCharCode(((b[i] & 0b00001111) << 12) |
									 ((b[i + 1] & 0b00111111) << 6) |
									 (b[i + 2] & 0b00111111));
			i += 3;
		} else {
			throw new Error('Invalid input');
		}
	}
	if (s.charCodeAt(s.length - 1) != 0) {
		throw new Error('Invalid input');
	}
	return { len: 1 + l.len + l.val, val: s.slice(0, -1) };
}

function string_enc(s) {
	if (typeof(s) !== 'string') {
		throw new Error('Invalid input');
	}
	if (s === '') {
		return Uint8Array.from([ T_STRING_CONSTANT_EMPTY ]);
	}
	let a = [];
	for (let i = 0; i < s.length; i++) {
		let c = s.charCodeAt(i);
		if (c < 0x80) {
			a.push(c);
		} else if (c < 0x800) {
			a.push(0b11000000 | ((c >> 6) & 0b00011111),
				   0b10000000 | (c & 0b00111111));
		} else if (c < 0x10000) {
			a.push(0b11100000 | ((c >> 12) & 0b00001111),
				   0b10000000 | ((c >> 6) & 0b00111111),
				   0b10000000 | (c & 0b00111111));
		} else {
			throw new Error('Invalid input');
		}
	}
	a.push(0);
	return new Uint8Array([ T_STRING, ...(number_enc(a.length)), ...a ]);
}

function array_dec(b) {
	switch (b[0]) {
	case T_ARRAY_CONSTANT_EMPTY:
		return { val: [], len: 1 };
	case T_ARRAY:
		break;
	default:
		throw new Error('Invalid input');
	}
	let l = number_dec(b.slice(1));
	if (l === undefined) {
		throw new Error('Invalid input');
	}
	if ((l.len + l.val) >= b.len) {
		throw new Error('Truncated input');
	}
	let r = [];
	b = b.slice(1 + l.len, 1 + l.len + l.val);
	for (let i = 0; i < b.length; /*NOTHING*/) {
		let v = dec_internal(b.slice(i), true);
		if (! v) {
			throw new Error('Invalid input');
		}
		i += v.len;
		if (i > b.length) {
			throw new Error('Invalid input');
		}
		r.push(v.val);
	}
	return { val: r, len: 1 + l.len + l.val };
}

function array_enc(a, refs) {
	if (! Array.isArray(a)) {
		throw new Error('Invalid input');
	}
	if (a.length == 0) {
		return Uint8Array.from([ T_ARRAY_CONSTANT_EMPTY ]);
	}
	let r = [];
	for (let i = 0; i < a.length; i++) {
		r.push(...(enc_internal(a[i], refs)));
	}
	r.unshift(T_ARRAY, ...(number_enc(r.length)));
	return Uint8Array.from(r);
}

function object_dec(b) {
	switch (b[0]) {
	case T_OBJECT_CONSTANT_EMPTY:
		return { val: {}, len: 1 };
	case T_OBJECT:
		break;
	default:
		throw new Error('Invalid input');
	}
	let l = number_dec(b.slice(1));
	if (l === undefined) {
		throw new Error('Invalid input');
	}
	if ((l.len + l.val) >= b.len) {
		throw new Error('Truncated input');
	}
	let r = {};
	b = b.slice(1 + l.len, 1 + l.len + l.val);
	for (let i = 0; i < b.length; /*NOTHING*/) {
		let k = string_dec(b.slice(i));
		if (! k) {
			throw new Error('Invalid input');
		}
		i += k.len;
		if (i >= b.length) {
			throw new Error('Invalid input');
		}
		let v = dec_internal(b.slice(i), true);
		if (! v) {
			throw new Error('Invalid input');
		}
		i += v.len;
		if (i > b.length) {
			throw new Error('Invalid input');
		}
		r[k.val] = v.val;
	}
	return { val: r, len: 1 + l.len + l.val };
}

function object_enc(o, refs) {
	if (! (o && (o instanceof Object) && (typeof(o) === 'object'))) {
		throw new Error('Invalid input');
	}
	let keys;
	try {
		keys = Object.keys(o);
	} catch (e) {
		keys = undefined;
	}
	if (! Array.isArray(keys)) {
		throw new Error('Invalid input');
	}
	if (keys.length == 0) {
		return Uint8Array.from([ T_OBJECT_CONSTANT_EMPTY ]);
	}
	let r = [];
	for (let k of keys.sort()) {
		r.push(...(string_enc(k)));
		r.push(...(enc_internal(o[k], refs)));
	}
	r.unshift(T_OBJECT, ...(number_enc(r.length)));
	return Uint8Array.from(r);
}

function dec_internal(b, ignoreTail) {
	let r = (decoder(b[0]))(b);
	if ((! ignoreTail) && (r.len != b.length)) {
		throw new Error('Invalid input');
	}
	return r;
}

function enc_internal(x, refs) {
	if (refs.has(x)) {
		throw new Error('Invalid input (circular)');
	}
	if (x instanceof Boolean) {
		x = x ? true : false;
	}
	let r;
	if (x === null) {
		r = null_enc(null, refs);
	} else if (x === true) {
		r = boolean_enc(true, refs);
	} else if (x === false) {
		r = boolean_enc(false, refs);
	} else if (typeof(x) === 'string') {
		r = string_enc(x, refs);
	} else if (typeof(x) === 'number') {
		r = number_enc(x, refs);
	} else if (Array.isArray(x)) {
		let err;
		try {
			refs.add(x);
			r = array_enc(x, refs);
		} catch (e) {
			err = e ?? new Error('Invalid input');
		} finally {
			refs.delete(x);
		}
		if (err) {
			throw err;
		}
	} else if (x && (x instanceof Object)) {
		let err;
		try {
			refs.add(x);
			r = object_enc(x, refs);
		} catch (e) {
			err = e ?? new Error('Invalid input');
		} finally {
			refs.delete(x);
		}
		if (err) {
			throw err;
		}
	} else {
		throw new Error('Invalid input');
	}
	return r;
}

decoder = (function() {
	let decoders = new Map( [
		[ T_CONSTANT_NULL, null_dec ],
		[ T_CONSTANT_TRUE, boolean_dec ],
		[ T_CONSTANT_FALSE, boolean_dec ],
		[ T_DOUBLE, number_dec ],
		[ T_INT_CONSTANT_0, number_dec ],
		[ T_INT_CONSTANT_1, number_dec ],
		[ T_INT_CONSTANT_2, number_dec ],
		[ T_INT_CONSTANT_3, number_dec ],
		[ T_INT_CONSTANT_4, number_dec ],
		[ T_INT_CONSTANT_5, number_dec ],
		[ T_INT_CONSTANT_6, number_dec ],
		[ T_INT_CONSTANT_7, number_dec ],
		[ T_INT_CONSTANT_8, number_dec ],
		[ T_INT_CONSTANT_9, number_dec ],
		[ T_INT_L1, number_dec ],
		[ T_INT_L2, number_dec ],
		[ T_INT_L3, number_dec ],
		[ T_INT_L4, number_dec ],
		[ T_INT_L5, number_dec ],
		[ T_INT_L6, number_dec ],
		[ T_INT_L7, number_dec ],
		[ T_INT_L8, number_dec ],
		[ T_INT_NEG_CONSTANT_1, number_dec ],
		[ T_INT_NEG_CONSTANT_2, number_dec ],
		[ T_INT_NEG_CONSTANT_3, number_dec ],
		[ T_INT_NEG_CONSTANT_4, number_dec ],
		[ T_INT_NEG_CONSTANT_5, number_dec ],
		[ T_INT_NEG_CONSTANT_6, number_dec ],
		[ T_INT_NEG_CONSTANT_7, number_dec ],
		[ T_INT_NEG_CONSTANT_8, number_dec ],
		[ T_INT_NEG_CONSTANT_9, number_dec ],
		[ T_INT_NEG_L1, number_dec ],
		[ T_INT_NEG_L2, number_dec ],
		[ T_INT_NEG_L3, number_dec ],
		[ T_INT_NEG_L4, number_dec ],
		[ T_INT_NEG_L5, number_dec ],
		[ T_INT_NEG_L6, number_dec ],
		[ T_INT_NEG_L8, number_dec ],
		[ T_INT_NEG_L7, number_dec ],
		[ T_STRING_CONSTANT_EMPTY, string_dec ],
		[ T_STRING, string_dec ],
		[ T_ARRAY_CONSTANT_EMPTY, array_dec ],
		[ T_ARRAY, array_dec ],
		[ T_OBJECT_CONSTANT_EMPTY, object_dec ],
		[ T_OBJECT, object_dec ]
	]);
	return function(tag) {
		let r = decoders.get(tag);
		if (! r) {
			throw new Error('Invalid input');
		}
		return r;
	}
})();

module.exports = { dec_internal, enc_internal };
