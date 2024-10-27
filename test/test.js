'use strict';

const { enc, dec } = require('../index');

const eq = require('./eq');

function test1() {
	let n = 0;
	for (let i = 0; i < 100; i++) {
		for (let f = 1; f <= 47; f++) {
			n++;
			let a = Math.trunc((Math.random() > 0.5 ? 1 : -1) * Math.random() * Math.pow(2, f));
			let b = enc(a);
			let c = dec(b);
			if (a !== c) {
				throw new Error(`INT encoding test #${n} fails: ${a} => ${c} [${c.len}]: ${b.join(',')}`);
			}
		}
	}
}

function test2() {
	let n = 0;
	for (let i = 0; i < 100; i++) {
		for (let f = -300; f <= 300; f++) {
			n++;
			let a = Math.random() * Math.pow(10, f);
			let b = enc(a);
			let c = dec(b);
			if (a !== c) {
				throw new Error(`Double encoding test #${n} fails: ${a} => ${c} [$c.len]: ${b.join(',')}`);
			}
		}
	}
}

function test3() {
	let n = 0;
	for (let i = 0; i < 10; i++) {
		n++;
		let a = null;
		let b = enc(a);
		let c = dec(b);
		if (a !== c) {
			throw new Error(`NULL encoding test #${n} fails: ${a} => ${c} [${c.len}]: ${b.join(',')}`);
		}
	}
}

function test4() {
	let n = 0;
	for (let i = 0; i < 100000; i++) {
		n++;
		let a = (Math.random() > 0.5 ? true : false);
		let b = enc(a);
		let c = dec(b);
		if (a !== c) {
			throw new Error(`BOOLEAN encoding test #${n} fails: ${a} => ${c} [${c.len}]: ${b.join(',')}`);
		}
	}
}

function test5() {
	for (let i = 0; i < 10000; i++) {
		for (let m of [ 127, 2047, 65535 ]) {
			let a = '';
			let l = Math.floor(Math.random() * 300);
			while (a.length < l) {
				a += String.fromCharCode(Math.floor(Math.random() * m));
			}
			let b = enc(a);
			let c = dec(b);
			if (c !== a) {
				throw new Error('Contents mismatch');
			}
		}
	}
}

function test6() {
	let z = [];
	let y = [];
	let x = [];
	x.push([],[],[],[],[]);
	y.push(x,x,x,x,x,x,x,x,x);
	z.push(y,y,y,y,y,y,y,y,y);
	for (let a of [[],
				   z,
				   [1,null,true,'','x'],
				   [1,2,3,10000,1e100,true,false,null,'1.000.000.000€','',[1,[],[[[[true],false],null],[]],''],'ö']]) {
		let aa = JSON.stringify(a);
		let b = enc(a);
		let c = dec(b);
		let cc = JSON.stringify(c);
		//console.log(`${aa}\n${cc}\n${(aa===cc)}\n${b.join(',')}\n(${aa.length} vs ${b.length} ${Math.round(((b.length - aa.length) / aa.length) * 100)}%)`);
		if (aa !== cc) {
			throw('Array encoding mismatch');
		}
	}
	/*
    // This would give circular reference error
	try {
		x.push(z);
		let a = enc(x);
	} catch (e) {
		console.log(e);
    }
	*/
}

function test7() {
	for (let a of [{},
				   { one: 1, two: 2 },
				   { arr: [1,2,3], obj: { one: 1, two: 2 }, num1: 1, numM: 1000000, numGGGG: 1e36, t: true, f: false, n: null, s1: '', s2: '100€' }]) {
		let b = enc(a);
		let c = dec(b);
		if (! eq(a,c)) {
			throw('Object encoding mismatch');
		}
		//console.log(JSON.stringify(a, null, 2));
		//console.log(JSON.stringify(c, null, 2));
		//console.log(b.join(','));
	}
}

test1();
test2();
test3();
test4();
test5();
test6();
test7();
