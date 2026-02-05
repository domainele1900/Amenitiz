'use strict';


// document.getElementById('exportCurrent').addEventListener('click', () => {
// 	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
// 	  chrome.scripting.executeScript({
// 		target: { tabId: tabs[0].id },
// 		function: retrievePageInfo
// 	  }, (results) => {
// 		if (results && results[0] && results[0].result) {
// 		  alert('Infos de la page: ' + results[0].result);
// 		}
// 	  });
// 	});
//   });
  
//   function retrievePageInfo() {
// 	return document.body.innerText;
//   }
  
//   document.getElementById('call-content-script').addEventListener('click', () => {
// 	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
// 	  chrome.scripting.executeScript({
// 		target: { tabId: tabs[0].id },
// 		function: callContentScriptFunction
// 	  });
// 	});
//   });
  
  
// send active tab message
// 



function downloadCsv(csvStr) {
   
   
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csvStr], {
        type: 'application/octet-stream'
      }));
      a.setAttribute('download', 'test.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    
};

function callConvertCsv() {
	chrome.runtime.sendMessage({ action: 'convert' }, null, function(response) {
	  	// downloadCsv( response && response.csvStr ? response.csvStr : null );
		console.log( response && response.csvStr ? response.csvStr : null );
	});
}

$('a#exportCurrent').on('click', function() {
	console.log('#current click');
	// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	// 	chrome.scripting.executeScript({
	// 	  target: { tabId: tabs[0].id },
	// 	  function: callConvertCsv
	// 	});
	//   });	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage( tabs[0].id, { "message": "convert"}, null, function(response) {
			console.log( response && response.csvStr ? response.csvStr : null );
			// downloadCsv( response && response.csvStr ? response.csvStr : null );
		} );
	  });
})


function fillTimestamps(tslist) {

	// check for null or empty list
	if (!tslist || tslist.length==0) {
		$('#emptyList').show();
	} else {
		$('#emptyList').hide();

		let r, key;

		// loop on list
		for (var i = 0; i < tslist.length; i++) {

			r = $('#template').clone().removeAttr('id');
			for (key in tslist[i] ) {
				$('.'+key, r).text( tslist[i][key] );
			}
			
			r.show().appendTo('#demands');
		}

	}
}