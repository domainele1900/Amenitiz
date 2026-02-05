'use strict';

let timestamps = [];

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { 
// 	if (changeInfo.status === 'complete' && tab.url.includes('amenitiz.io') && tab.url.includes('translations')) { 
// 		chrome.scripting.executeScript({ target: { tabId: tabId }, files: ['content.js'] }); } 
// });

// chrome.action.onClicked.addListener((tab) => {
// 	chrome.scripting.executeScript({
// 	  target: { tabId: tab.id },
// 	  files: ['content.js']
// 	});
//   });
  
// chrome.runtime.onInstalled.addListener(function() {

//   	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//    		chrome.declarativeContent.onPageChanged.addRules([{
//         	conditions: [
//         		new chrome.declarativeContent.PageStateMatcher({
//           			pageUrl: {hostEquals: 'analytics.google.com'},
//         		})
//         	],
//             actions: [new chrome.declarativeContent.ShowPageAction()]
//       }]);
//     });

// 	chrome.contextMenus.create({
// 	  "id": "timestampconvertMenu",
// 	  "title": "Convertisseur de timestamp",
// 	  "contexts": ["selection"]
// 	});

// 	chrome.contextMenus.create({
// 	  "id": "timestampSearchMenu",
// 	  "title": "Trouver et convertit les timestamp",
// 	  "contexts": ["page"]
// 	});

// 	chrome.contextMenus.onClicked.addListener(function(info, tab) {
// 		switch (info.menuItemId) {
// 			case "timestampconvertMenu": 
// 				let ts = parseInt(info.selectionText);
// 				if(info.selectionText.length==10){
// 					ts *= 1000;
// 				}
// 				let date = new Date(ts);
// 				alert(date.toDateString())
// 				break;

// 			case "timestampSearchMenu":
// 				chrome.tabs.executeScript(
// 					tab.id, 
// 					{
// 						file: 'convert_timestamps.js'
// 					}
// 					// { code: 'timestamps = document.body.textContent.match(/check(In|Out)=\\d{13}/g); ' 
// 					// 		+'if (!timestamps && document.getElementById("galaxyIframe")) { '+
// 					// 			'timestamps = document.getElementById("galaxyIframe").contentWindow.document.getElementsByTagName("body")[0].innerText.match(/check(In|Out)=\\d{13}/g); }'
// 					//  		+'if (timestamps) { timestamps.forEach(function(elt, i, arr) { let d = new Date(parseInt(elt.replace(/\\D/g, ""))); arr[i] = elt.replace(/\\d+/, d.toDateString()); });'
// 					//  		+'alert((timestamps.length/2)+" periodes:\\r" + timestamps.join("\\r")); }' }
// 				);
// 				break;
// 		}
// 	});

// });
