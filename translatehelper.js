// Traduction Amenitiz

// - changer de section:
$('li[data-section-loaded="menus"]').click()

// liste des sections (rooms, website, menus, extras, pricing_types, sales_terms, amenities):
var sections = [];
sections.push($('li:not([id]).current[data-section-loaded]').attr('data-section-loaded')) 
$('li:not([id]):not(.current)[data-section-loaded]').each(function() { sections.push($(this).attr('data-section-loaded')); });


//- changer de langue:
$('select#selected_language_language_to').val('de').parents('form').submit()


//- changer de page dans la section 'website':
$('li[data-page-id="27213"]').click() 

// liste des pages array of id, name:
var pages = []; 
pages.push({ 'id': $('li.j-select-page.current').attr('data-page-id'), 'name': $('li.j-select-page.current').text() });
$('li.j-select-page:not(.current)').each(function() { pages.push({ 'id': $(this).attr('data-page-id'), 'name': $(this).text() }) });


downloadCsv = function(arr) {
    var data = arr.map(row => row.join(",")).join("\n");
   
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], {
        type: 'application/octet-stream'
      }));
      a.setAttribute('download', 'test.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    
};

// get source and dest lang
var src_lang = $('#selected_language_language_from').val();
var dst_lang = $('#selected_language_language_to').val();
var entries = [ ['section', 'page', 'src_ident', src_lang, 'dest_ident', dst_lang] ];
var section = $('ul.translations__type-selector-list-mainlevel li.j-section-loaded.current').attr('data-section-loaded');
var page = (section=='website' ? $('ul.translations__type-selector-list-sublevel li.j-section-loaded.current').attr('data-page-id') : '');

$('input[readonly], textarea[readonly]').each(function() { 
    // console.log('form#'+$(this).parents('form').attr('id')+' '+$(this).prop("tagName")+'[name="'+$(this).attr('name').replace("_"+src_lang, "_"+dst_lang)+'"]'); 
    // console.log($(this).val()); 
    var src_ident = 'form#'+$(this).parents('form').attr('id')+' '+$(this).prop("tagName")+'[name=\''+$(this).attr('name')+'\']';
    var src_str = $(this).val().replace(/"/, '\'');
    
    var dst_ident = src_ident.replace("_"+src_lang, "_"+dst_lang);
    var dst_str = $(dst_ident).val().replace(/"/, '\"');

    entries.push( [section, page, '"'+src_ident+'"', '"'+$.trim(src_str.replace(/\s+/,' '))+'"', '"'+dst_ident+'"', '"'+$.trim(dst_str.replace(/\s+/,' '))+'"'] );
})

downloadCsv(entries);
