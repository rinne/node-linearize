'use strict';

const { dec_internal, enc_internal } = require('./linearize');

function dec(b) {
	if (! (b instanceof Uint8Array)) {
		throw new Error('Invalid input');
	}
	return dec_internal(b, false).val;
}

function enc(x) {
	return enc_internal(x, new Set());
}

module.exports = { dec, enc };
