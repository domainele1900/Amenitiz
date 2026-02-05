console.log('content loaded');
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {

//   	// if message is a function name, call the function !
//   	if (typeof window[request.message] === "function") {
// 		sendResponse( window[request.message]() );
//   		;
//   	}

//   }
// );

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// 	if (request.action === 'convert') {
// 	  convert();
// 	}
//   });

window.addEventListener ("load", initCommands, false);

function initCommands (evt) {
	// translation page
	if ($("select#selected_language_language_to").length) {
		
		var cmdbar = '<div class="a__box row" id="translateHelper">'+
		'<div class="col-sm-6"><h5>Export CSV</h5><a href="#" class="btn btn ml2" id="exportCurrent">Page actuelle</a><a href="#" class="btn btn ml2" id="exportAll">Toutes les pages</a></div>'+
		'<div class="col-sm-6"><h5>Import CSV</h5><a href="#" class="btn btn ml2" id="importCsvStart">Options</a></div>'+
		// '<div class="col-sm-12 mt-2" id="langList"><h5>Selectionnez les langues à traduire</h5></div>'+
		'</div>';
		$('div.a__page-title').after($(cmdbar));

		// get available destination languages
		// var checkboxes = '';
		// $.each($("select#selected_language_language_to").prop("options"), function(i, opt) {
		// 	checkboxes += '<div class="inline-block mx-2"><input type="checkbox" name="option" value="'+opt.value+'" id="destLang_'+opt.value+'"><label for="destLang_'+opt.value+'">&nbsp;'+opt.textContent+'</label></div>';
		// })
		// $('#langList').append(checkboxes);

		$("#exportCurrent").on('click', exportCurrent);
		$("#exportAll").on('click', exportAll);
		$("#importCsvStart").on('click', importCsvStart);
	} 
	// meta variables page
	else if ($('input[name*="builder_page[meta_title_"]').length) {
		var cmdbar = '<div class="a__box row" id="translateHelper">'+
		'<div class="col-sm-6"><a href="#" class="btn btn ml2" id="exportMetas">Export CSV</a></div>'+
		'<div class="col-sm-6"><a href="#" class="btn btn ml2" id="importMetas">Import CSV</a></div>'+
		'</div>';
		$('hr#hr-reporting').after($(cmdbar));

		$("#exportMetas").on('click', exportMetas);
		$("#importMetas").on('click', importMetas);
		
	}
}

function exportCurrent() {
	
	var src_lang = $('#selected_language_language_from').val();
	var dst_lang = $('#selected_language_language_to').val();
	var entries = [ ['section', 'page', 'src_ident', src_lang, 'dest_ident', dst_lang] ];
	
	var section = $('ul.translations__type-selector-list-mainlevel li.j-section-loaded.current').attr('data-section-loaded');
	var page = (section=='website' ? $('ul.translations__type-selector-list-sublevel li.j-section-loaded.current').attr('data-page-id') : 0);
	
	// var langs = []; 
	// $('input[name="option"]:checked').each(function(i) { 
	// 	langs.push($(this).val()); 

	// 	var lang = $(this).val();

	// 	$('select#selected_language_language_to').val('de').parents('form').submit();		
	// })

	extractCsv(src_lang, dst_lang, section, page, entries);
	downloadCsv('trad_'+section+'_'+(page!='' ? page+'_':'')+'_'+src_lang+'_'+dst_lang, entries);
}

function exportAll() {
	// liste des sections (rooms, website, menus, extras, pricing_types, sales_terms, amenities):
	var sections = [];
	sections.push($('li:not([id]).current[data-section-loaded]').attr('data-section-loaded')) 
	$('li:not([id]):not(.current)[data-section-loaded]').each(function() { sections.push($(this).attr('data-section-loaded')); });
	
	// liste des pages tableau de id, nom:
	var pages = []; 
	pages.push({ 'id': $('li.j-select-page.current').attr('data-page-id'), 'name': $('li.j-select-page.current').text() });
	$('li.j-select-page:not(.current)').each(function() { pages.push({ 'id': $(this).attr('data-page-id'), 'name': $(this).text() }) });

	var src_lang = $('#selected_language_language_from').val();
	var dst_lang = $('#selected_language_language_to').val();
	var entries = [ ['section', 'page_id', 'src_ident', src_lang, 'dest_ident', dst_lang] ];


	exportSection(sections, 0, pages, 0, '', src_lang, dst_lang, entries);
	
	// downloadCsv('trad_all_'+src_lang+'_'+dst_lang, entries);
}

function exportSection(sections, s, pages, p, lastId, src_lang, dst_lang, entries) {
console.log('exportSection(sections, "'+sections[s]+'",pages, "'+pages[p].id+'", '+lastId+',...entries length='+entries.length);
	
	// check if new section displayed
	if (lastId!=$('.translations__table tr:first-child form').attr('id')) {
		//extract to csv
		extractCsv(src_lang, dst_lang, sections[s], pages[p].id, entries);
		
		//set last extracted section id and increment section processed count
		lastId = $('.translations__table tr:first-child form').attr('id');
		var nextExtract='';

		if (sections[s]=='website' && p<pages.length-1) {
			p++;
			nextExtract = 'li[data-page-id="'+pages[p].id+'"]';
		} else {
			s++;
			nextExtract = 'li:not([id])[data-section-loaded="'+sections[s]+'"]';
		}

console.log('data extracted, lastid set to "'+lastId+'", moving to section "'+sections[s]+'", page "'+pages[p].id+'"');

		// if some sections still to extract, click on it and call extractSection after 100ms
		if (s<sections.length && p<pages.length) {
			$(nextExtract).click();
			setTimeout(exportSection, 1000, sections, s, pages, p, lastId, src_lang, dst_lang, entries);
		} 
		// otherwise download file
		else {
console.log('download file');
			$('li:not([id])[data-section-loaded="'+sections[0]+'"]').click();
			downloadCsv('trad_all_'+src_lang+'_'+dst_lang, entries);
		}
	}
	// else if still not loaded, wait for another 100ms
	else {
console.log('"'+sections[s]+'", page '+p+' keep waiting');
		setTimeout(exportSection, 1000, sections, s, pages, p, lastId, src_lang, dst_lang, entries);
	}
}

function extractCsv(src_lang, dst_lang, section, page, entries){
	// get source and dest lang

	$('input[readonly], textarea[readonly]').each(function() { 
		// console.log('form#'+$(this).parents('form').attr('id')+' '+$(this).prop("tagName")+'[name="'+$(this).attr('name').replace("_"+src_lang, "_"+dst_lang)+'"]'); 
		// console.log($(this).val()); 
		var src_ident = 'form#'+$(this).parents('form').attr('id')+' '+$(this).prop("tagName")+'[name=\''+$(this).attr('name')+'\']';
		var src_str = $(this).val() ? $(this).val().replace(/"/g, '""').replace(/(\r\n|\n|\r)/gm, "") : '';
		
		var dst_ident = src_ident.replace("_"+src_lang, "_"+dst_lang);
		var dst_str = $(dst_ident).val() ? $(dst_ident).val().replace(/"/g, '""').replace(/(\r\n|\n|\r)/gm, "") : '';

		entries.push( [section, page, '"'+src_ident+'"', '"'+$.trim(src_str.replace(/\s+/g,' '))+'"', '"'+dst_ident+'"', '"'+$.trim(dst_str.replace(/\s+/g,' '))+'"'] );
	})
}

function downloadCsv(fname, entries) {

	var csvStr = entries.map(row => row.join(",")).join("\n");
	
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csvStr], {
        type: 'application/octet-stream'
      }));
      a.setAttribute('download', fname + '.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
};

function importCsvStart() {

	var dst_lang = $('#selected_language_language_to').text();

	var sctn = $('li:not([id]).current[data-section-loaded]').attr('data-section-loaded');
	var page = (sctn=='website' ? $('li.j-select-page.current').attr('data-page-id') : '');
	var sctnName = $('li:not([id]).current[data-section-loaded]').text() + (page ? ': '+$('li.j-select-page.current').text(): '');
	
	$('#j-sidepanel .content').append('<div class="row mb4"><div class="col-sm-12"><label for="" class="mb1">Fichier CSV avec texte en "'+dst_lang+'"</label>'+
		'<input type="file" id="translateHelper_fileInput" accept=".csv" /></div></div>'+
		'<div class="row mb4">'+
		'<div class="col-sm-6"><a href="#" class="btn btn ml2" id="importCurrentTrad">Importer traduction de: '+sctnName+'</a></div>'+
		'<div class="col-sm-6"><a href="#" class="btn btn ml2" id="importAllTrad">Import toutes les traductions</a></div>'+
		'</div>');

	$('#j-sidepanel').attr('data-sidepanel-size','large');
	$('body').attr('data-sidepanel-size','large');
	$('body').attr('data-sidepanel', 'open');

	$('#translateHelper_fileInput').on('change', loadCSVFile)
	$("#importCurrentTrad").on('click', exportCurrentTrad);
	$("#importAllTrad").on('click', exportAllTrad);
}

function loadCSVFile(event) {
	var file = event.target.files[0];
	var reader = new FileReader();

	var src_lang = $('#selected_language_language_from').val();
	var dst_lang = $('#selected_language_language_to').val();

	reader.onload = function(evt){
		var csv = $.csv2Array(evt.target.result);
		localStorage.setItem('importCsv', csv);
	};
	reader.onerror = function(){ alert('Erreur de lecture de fichier...'); };
	reader.readAsText(file);
}

function exportCurrentTrad() {
	const csv = localStorage.getItem('importCsv');

	if (!csv) {
		alert('pas de donnée à importer! Charger fichier csv');
		exit;
	}
}

function exportAllTrad() {
}



/**
 * Metas variables import/export
 */

function exportMetas() {
	$('form.edit_builder_page').each(function (i) {
		
	});
}

function importMetas() {
	
}