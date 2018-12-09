const client = require('cheerio-httpcli')
const nedb = require('nedb');
const nedb_promise = require('nedb-promise');

if (process.argv.length !== 2) {
	console.log('list-ibmjp-patterns.js');
	console.log('  Simple crawler tool to list patterns from IBM Code JP site.');
	console.log('  2018/11/24 by github.com/yamachan');
	return;
}

const nedb_file_name = 'list-ibmjp-patterns.nedb';
const list_item_query = '#scenarios .ibm-card';

function getListURL(_page) {
	if (_page == 1) {
		return 'https://developer.ibm.com/jp/patterns/';
	} else {
		return 'https://developer.ibm.com/jp/patterns/page/' + _page + '/';
	}
}

const db = new nedb_promise({
	filename: nedb_file_name,
	autoload: true
});

// ----- Main Loop -----
(async () => {
	let page = 1;
	let number_of_items = 0;
	let count_of_items = 0;
	do {
		console.log('LOOP: page = ' + page);
		let url = getListURL(page);
		let ret = client.fetchSync(url);
		if (ret.error || !ret.response || ret.response.statusCode !== 200) {
			console.log('ERROR:' + url);
			return;
		} else {
			let items = ret.$(list_item_query);
			number_of_items = items.length;
			processListItems(ret, items, page);
			count_of_items += number_of_items;
			console.log('number_of_items = ' + number_of_items);
			page++;
		}
	} while (number_of_items > 0);
	console.log('count_of_items = ' + count_of_items);
})();

function itemToObject(_ret, _item) {
	return {
		title: _ret.$('.ibm-h3', _item).text().trim(),
		desc: _ret.$('.ibm-card__content p', _item).text().trim(),
		url: _ret.$('.ibm-card__bottom p:first-child a:first-child', _item).url(),
		github: _ret.$('.ibm-card__bottom p:nth-child(2) a:first-child', _item).url().replace(/\?cm_sp=IBMCodeJP-_-.*$/, ''),
		tech: _ret.$('.ibm-card__heading-pattern .journey-cat a', _item).map(function(){
			return _ret.$(this).text().trim()
		}).get().sort()
	};
}

function checkUpdateObject(_obj, _doc) {
	return JSON.stringify(_obj) !== JSON.stringify({
		title: _doc.title,
		desc: _doc.desc,
		url: _doc.url,
		github: _doc.github,
		tech: _doc.tech
	});
}
async function processListItems(_ret, _items, _page) {
	for (let loop = 0; loop < _items.length; loop++) {
		let obj = itemToObject(_ret, _items[loop]);
		let doc = await db.findOne({url: obj.url});
		if (doc) {
			if (checkUpdateObject(obj, doc)) {
				await db.update({url: obj.url}, {$set: obj});
				console.log('DB_UPDATE: ' + obj.url);
			}
		} else {
			await db.insert(obj);
			console.log('DB_ADD: ' + obj.url);
		}
	}
}
