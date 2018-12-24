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
	// 1st fix
	//"analyze-starcraft-ii-replays-jupyter-notebooks":"analyze-starcraft-ii-replays-with-jupyter-notebooks",
	//"apply-cognitive-mobile-images-go":"apply-cognitive-to-mobile-images-on-the-go",
	// 2nd fix
	"blockchain-donation-tracking":"track-donations-blockchain",
	"build-a-cognitive-recommendation-app-with-swift-2":"build-a-cognitive-recommendation-app-with-swift",
	"build-blockchain-network":"build-a-blockchain-network",
	"build-enterprise-swift-app-using-services":"build-an-enterprise-swift-app-using-services",
	"build-serverless-api-handlers-3":"build-serverless-api-handlers",
	"create-a-movie-recommendation-system":"creating-a-movie-recommendation-with-turi-create-on-watson-studio-coreml",
	"create-investment-management-chatbot":"create-an-investment-management-chatbot",
	"create-list-app-using-blockchain":"create-a-to-do-list-app-using-blockchain",
	"decentralized-energy-with-hyperledger-composer":"decentralized-energy-hyperledger-composer",
	"deploy-asset-transfer-app-using-blockchain":"deploy-an-asset-transfer-app-using-blockchain",
	"deploy-java-microservices-kubernetes-polyglot-support":"deploy-java-microservices-on-kubernetes-with-polyglot-support",
	"deploy-microprofile-based-java-microservices-kubernetes":"deploy-microprofile-java-microservices-on-kubernetes",
	"deploy-scalable-apache-cassandra-database-kubernetes":"deploy-a-scalable-apache-cassandra-database-on-kubernetes",
	"deploy-spring-boot-microservices-on-kubernetes-4":"deploy-spring-boot-microservices-on-kubernetes",
	"identify-cities-from-space":"identify-cities-from-space-using-watson-visual-recognition",
	"image-recognition-training-with-powerai-notebooks":"image-recognition-training-powerai-notebooks",
	"implement-voice-controls-serverless-home-automation-hub":"implement-voice-controls-for-serverless-home-automation-hub",
	"integrate-lagom-application-ibm-cloud-object-storage":"integrating-a-lagom-microservices-application-with-ibm-cloud-object-storage",
	"make-apps-smarter-with-serverless-3":"make-apps-smarter-with-serverless",
	"real-time-payments-chatbot":"fintech-create-a-chatbot-for-real-time-payment",
	"respond-to-messages-and-handle-streams-3":"respond-messages-handle-streams",
	"run-cloud-native-workloads-on-a-linux-mainframe":"run-cloud-native-workloads-on-linux-mainframe"
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
