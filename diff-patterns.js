const fs = require('fs')

if (process.argv.length !== 2) {
	console.log('diff-patterns.js');
	console.log('  Diff JSON files from list-ibm-patterns and list-ibmjp-patterns.');
	console.log('  2018/12/10 by github.com/yamachan');
	return;
}

const json_file_name = 'list-ibm-patterns.json';
const json_file_jp_name = 'list-ibmjp-patterns.json';

// ----- Init -----

let list = JSON.parse(fs.readFileSync(json_file_name).toString());
let list_jp = JSON.parse(fs.readFileSync(json_file_jp_name).toString());

function setKey(_list) {
	for (let l=0; l<_list.length; l++) {
		let reg = _list[l].url.match(/\/([^/]+)\/$/);
		if (reg) {
			_list[l].key = reg[1];
		} else {
			console.log("Error: " + _list[l].url);
			return;
		}
	}
}
setKey(list);
setKey(list_jp);

// ----- Quick fix -----

quick_fix = {
	// Final fix
    "blockchain-donation-tracking":"track-donations-blockchain",
    "decentralized-energy-with-hyperledger-composer":"decentralized-energy-hyperledger-composer",
    "deploy-spring-boot-microservices-on-kubernetes-4":"deploy-spring-boot-microservices-on-kubernetes",
    "identify-cities-from-space":"identify-cities-from-space-using-watson-visual-recognition"
};
for (let l=0; l<list_jp.length; l++) {
	list_jp[l].key = quick_fix[list_jp[l].key] || list_jp[l].key;
}

// ----- Nain Loop -----

function getByKey(_list, _key) {
	for (let l=0; l<_list.length; l++) {
		if (_list[l].key == _key) {
			return _list[l];
		}
	}
	return null;
}
function _main(_list, _list2) {
	for (let l=0; l<_list.length; l++) {
		_list[l]._obj = getByKey(_list2, _list[l].key);
	}
}
_main(list, list_jp);
_main(list_jp, list);

// ----- Output -----

list = list.filter(o => !o._obj).map(o => o.key).sort();
console.log('\n' + json_file_name + ': ' + list.length + '\n');
console.log(list.join('\n'));

list_jp = list_jp.filter(o => !o._obj).map(o => o.key).sort();
console.log('\n' + json_file_jp_name + ': ' + list_jp.length + '\n');
console.log(list_jp.join('\n'));
