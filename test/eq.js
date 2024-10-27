'use strict';

function eq_int(a, b, refs_a, refs_b) {
	if (refs_a.has(a) || refs_b.has(b)) {
		throw new Error('Circular reference');
	}
	if (a instanceof Boolean) {
		a = a ? true : false;
	}
	if (b instanceof Boolean) {
		b = b ? true : false;
	}
	if (a === b) {
		return true;
	}
	let scalars = ['string','number','boolean','undefined'];
	if (scalars.includes(typeof(a)) || scalars.includes(typeof(b))) {
		return false;
	}
	if ((a === null) || (b === null)) {
		return false;
	}
    if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length != b.length) {
			return false;
		}
		let r, err;
		try {
			refs_a.add(a);
			refs_b.add(b);
			r = true;
			for (let i = 0; i < a.length; i++) {
				if (! eq_int(a[i], b[i], refs_a, refs_b)) {
					r = false;
					break;
				}
			}
		} catch(e) {
			err = e ?? new Error('Interal error');
			r = undefined;
		} finally {
			refs_a.delete(a);
			refs_b.delete(b);
		}
		if (err) {
			throw err;
		}
		return r;
	}
    if (a && b && (typeof(a) === 'object') && (typeof(a) === 'object')) {
		let ka = Object.keys(a).sort(), kb = Object.keys(b).sort(), es = new Set();
		if (! eq_int(ka, kb, es, es)) {
			return false;
		}
		let r, err;
		try {
			refs_a.add(a);
			refs_b.add(b);
			r = true;
			for (let k of ka) {
				if (! eq_int(a[k], b[k], refs_a, refs_b)) {
					r = false;
					break;
				}
			}
		} catch(e) {
			err = e ?? new Error('Interal error');
			r = undefined;
		} finally {
			refs_a.delete(a);
			refs_b.delete(b);
		}
		if (err) {
			throw err;
		}
		return r;
	}
	return false;
}

function eq(a, b) {
	return eq_int(a, b, new Set(), new Set());
}

module.exports = eq;
