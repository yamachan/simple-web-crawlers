const nedb = require('nedb');
const nedb_promise = require('nedb-promise');

if (process.argv.length !== 3) {
	console.log('nedb_open.js');
	console.log('  Open a nedb file, and just count # of items.');
	console.log('  2019/01/20 by github.com/yamachan\n');
	console.log('  node nedb_open list-ibm-patterns.nedb');
	console.log('  node nedb_open list-ibmjp-patterns.nedb');
	return;
}

const db = new nedb_promise({
	filename: process.argv[2],
	autoload: true
});

(async () => {
	let docs = await db.cfind({}).exec();
	let count = 0;
	docs.forEach(doc => {
		count++;
	});
	console.log(count);
})();
