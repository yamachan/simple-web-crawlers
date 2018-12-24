const nedb = require('nedb');
const nedb_promise = require('nedb-promise');

if (process.argv.length !== 3 || process.argv[2].startsWith('-')) {
	console.log('nedb2csv.js');
	console.log('  Convert a nedb file to a json file.');
	console.log('  2018/12/24 by github.com/yamachan\n');
	console.log('  node nedb2csv list-ibmjp-patterns.nedb > list-ibmjp-patterns.csv');
	return;
}

const db = new nedb_promise({
	filename: process.argv[2],
	autoload: true
});

// ----- Main Loop -----
(async () => {
	let docs = await db.cfind({}).exec();
	// ----- List up col labels -----
	let cols = [];
	docs.forEach(doc => {
		for (let key in doc) {
			if (key !== '_id' && !cols.includes(key)) {
				cols.push(key);
			}
		}
	});
	// ----- Output CSV data -----
	console.log('"' + cols.join('","') + '"');
	docs.forEach(doc => {
		let line = cols.map(col => (doc[col]||'').toString().replace(/"/g,'""'));
		console.log('"' + line.join('","') + '"');
	});
})();
