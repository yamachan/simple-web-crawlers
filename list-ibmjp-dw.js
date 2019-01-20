const client = require('cheerio-httpcli')
const nedb = require('nedb');
const nedb_promise = require('nedb-promise');

if (process.argv.length !== 2) {
	console.log('list-ibmjp-dw.js');
	console.log('  Simple crawler tool to list patterns from IBM developerWorks JP site.');
	console.log('  2019/01/20 by github.com/yamachan');
	return;
}

const nedb_file_name = 'list-ibmjp-dw.nedb';
const list_item_query = '.ibm-col-1-1 > .ibm-data-table tbody tr';

function getListURL(_page) {
	let start = (_page - 1) * 100 + 1;
	return 'https://www.ibm.com/developerworks/jp/views/global/libraryview.jsp?site_id=60&contentarea_by=global&sort_by=&sort_order=2&start=' + start + '&end=' + (start + 99) + '&type_by=%E3%81%99%E3%81%B9%E3%81%A6%E3%81%AE%E7%A8%AE%E9%A1%9E&show_abstract=true';
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

function tconv(_text) {
	return (_text||'').replace('\t', '  ').replace('\n', ' ').replace('\r', '').trim();
}
function itemToObject(_ret, _item) {
	return {
		title: tconv(_ret.$('a', _item).text()),
		url: _ret.$('a', _item).url(),
		description: tconv(_ret.$('td:first-child div', _item).text()),
		type: tconv(_ret.$('td:nth-child(2)', _item).text()),
		date: tconv(_ret.$('td:nth-child(3)', _item).text())
	};
}

function checkUpdateObject(_obj, _doc) {
	return JSON.stringify(_obj) !== JSON.stringify({
		title: _doc.title,
		url: _doc.url,
		description: _doc.description,
		type: _doc.type,
		date: _doc.date
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
