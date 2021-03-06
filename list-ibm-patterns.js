const client = require('cheerio-httpcli')
const nedb = require('nedb');
const nedb_promise = require('nedb-promise');

if (process.argv.length !== 2) {
	console.log('list-ibm-patterns.js');
	console.log('  Simple crawler tool to list patterns from IBM Code patterns site.');
	console.log('  2018/11/24 by github.com/yamachan');
	return;
}

const nedb_file_name = 'list-ibm-patterns.nedb';
const list_item_query = '.cpt-content .ibm--card';

function getListURL(_page) {
	if (_page == 1) {
		return 'https://developer.ibm.com/patterns/';
	} else {
		return 'https://developer.ibm.com/patterns/page/' + _page + '/';
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
			number_of_items = 0;
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
		title: _ret.$('h3', _item).text().trim(),
		url: _ret.$('a.ibm--card__block_link', _item).url(),
		date: _ret.$('.ibm--card__date', _item).text().trim(),
		tech: _ret.$('span.bx--tag--category', _item).map(function(){
			return _ret.$(this).text().trim()
		}).get().sort()
	};
}

function checkUpdateObject(_obj, _doc) {
	return JSON.stringify(_obj) !== JSON.stringify({
		title: _doc.title,
		url: _doc.url,
		date: _doc.date,
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
