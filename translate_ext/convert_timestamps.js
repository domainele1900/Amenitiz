(function() {
	
	let timestamps = document.body.textContent.match(/check(In|Out)=\d{13}/g);

	if (!timestamps && document.getElementById("galaxyIframe")) {
		timestamps = document.getElementById("galaxyIframe").contentWindow.document.getElementsByTagName("body")[0].innerText.match(/check(In|Out)=\d{13}/g); 
	}

	if (timestamps) {
		timestamps.forEach(function(elt, i, arr) { 
			let d = new Date(parseInt(elt.replace(/\\D/g, ""))); 
			arr[i] = elt.replace(/\\d+/, d.toDateString()); 
		});
		alert((timestamps.length/2)+" periodes:\\r" + timestamps.join("\\r")); 
	} 
})();