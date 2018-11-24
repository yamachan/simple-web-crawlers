const fs = require('fs')

if (process.argv.length !== 3 || process.argv[2].startsWith('-')) {
	console.log('nedb2json.js');
	console.log('  Convert a nedb file to a json file.');
	console.log('  2018/11/24 by github.com/yamachan\n');
	console.log('  node nedb2json list-ibmjp-patterns.nedb > list-ibmjp-patterns.json');
	return;
}

let list = fs.readFileSync(process.argv[2])
	.toString()
	.split('\n')
	.filter(s => s.trim() !== '');

console.log('[\n' + list.join(',\n') + '\n]');
