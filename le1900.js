var curHash = '';

$( document ).ready(function() {
	$("#block_112785 a.style__button").clone().appendTo(".mobile__header-model-1 #header .calendar")
	/* --- copy the menu language in mobile site header --- */
	$('<div class="col-xs-1"></div>').append($('li.site__navbar-language--dropbtn').clone()).insertAfter('nav.mobile__header-model-1 div.u-text-center')
	$(".mobile__header-model-1 #header .col-xs-3:last-child").addClass("col-xs-2").removeClass("col-xs-3");
	$('.j-fit-text-title-112785').removeClass('j-fit-text-title-112785');
	/* --- copy the menu language in mobile site header --- */

	if ($(".room-model-2__desc .see_more").length) {
		// hide short descriptions 'see more' link
	    $(".room-model-2__desc .j-block-text>p, .room-model-2__desc .see_more").hide()
	    // move full description in visible area
    	$(".room-model-2__desc .modal-body>div>div").insertBefore(".room-model-2__desc .j-block-text:first-child");
	}

	if ($(".room__amenities--list .see_more").length) {
		// hide short amenities list and 'see more' link
	    $(".room-model-2__amenities>.room__amenities--list, .room__amenities--list .see_more").hide()
	    // move full amenities list in visible area
	    $(".room__amenities--list .modal-body .room__amenities--list").insertBefore(".room-model-2__amenities>.room__amenities--list");
	}

	// change the search button to be book
	/* 
  $("#check-avail-button").text($('.site__navbar--actions .j-block-button').text()).removeClass('hidden-xs')
	$('#site-date-selector__button .visible-xs').remove()
  */
  
	// add booking cta
	$('.site__navbar--side-div a').clone().addClass('hidden-md').appendTo('.room-model-2__desc, .room-model-2__amenities')

	// grandes marées table hover and click to booking page
	$('.pricing_table_block td').on("mouseenter", function(e) {
		$(this).addClass('highlight');
		var t = $(this).parents('table');
		$('td[row-coordinate="'+$(this).attr('row-coordinate')+'"][column-coordinate="1"]', t).addClass('highlight');
		$('td[column-coordinate="'+($(this).attr('column-coordinate') - $(this).attr('column-coordinate')%2)+'"][row-coordinate="1"]', t).addClass('highlight');
		$('td[column-coordinate="'+$(this).attr('column-coordinate')+'"][row-coordinate="2"]', t).addClass('highlight');
	}).on("mouseleave", function(e) {
		$(this).removeClass('highlight');
		var t = $(this).parents('table');
		$('td[row-coordinate="'+$(this).attr('row-coordinate')+'"][column-coordinate="1"]', t).removeClass('highlight');
		$('td[column-coordinate="'+($(this).attr('column-coordinate') - $(this).attr('column-coordinate')%2)+'"][row-coordinate="1"]', t).removeClass('highlight');
		$('td[column-coordinate="'+$(this).attr('column-coordinate')+'"][row-coordinate="2"]', t).removeClass('highlight');
	});

	$('.pricing_table_block td').on("click", function(e) {
		// if not on grades marees, return
		if (!$('.grandes_marees').length) {
			return;
		}
		// get day in 1st col
		var d = $('td[row-coordinate="'+Math.max($(this).attr('row-coordinate'), 3)+'"][column-coordinate="1"]', $(this).parents('table')).text()
			+' '+
		// get month in title above table
			$('h2', $(this).parents('.pricing_table_wrapper').parent()).text();
		
		// change Month to MM in string
		var ms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
				'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
				"Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember",
				"Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
				"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
				"Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"
            ];
		d = d.replace(/([a-zA-Zéû]+)/g, function(m) { var i=ms.indexOf(m) % 12 + 1; return i==0? '' : (i<10 ? '0' : '' ) + i; });
		// change date format to yyyy/mm/dd
		d = d.replace(/([a-zA-Z\s]+)(\d{1,2})\s+(\d{2})\s+(\d{4})\s+/, '$4/$3/$2')

		var dt = new Date(d);

        var url = window.location.origin + window.location.pathname + '?start_date='+dt.toISOString().split('T')[0];
		dt.setDate((dt.getDate()+1));
		url += '&end_date='+dt.toISOString().split('T')[0]+'&adults=2&children=0#RoomSelection-BE';
	
		// open url
		window.open(url, '_blank');
	});

	var myInterval = setInterval(checkBookingProcess, 100);
});


checkBookingProcess = function () {
    if (curHash!=window.location.hash) {
        
        if (window.location.hash=='#RoomSelection-BE') {
            // do something only if rooms selection displayed
            if ($('div[data-testid="rooms-available"]').length) {
                curHash = window.location.hash;

                // reorder price rates to have 30% first
                $('div[data-testid="rates"]').each(function() {
                    $('div[class*="styles-module__rate__"]:contains("30%")', $(this)).insertAfter($('div[class*="styles-module__header_"]', $(this)));
                })

                // get search params
                var params = new URLSearchParams(window.location.search)
                var nbTotOccup = parseInt(params.get('adults'))+parseInt(params.get('children'));

                // hide guest rooms if search contains children
                if (params.get('children') > 0) {
                    $('div[data-testid="room-tile"]:contains("Barclay")').addClass('hide');
                    $('div[data-testid="room-tile"]:contains("Orientale")').addClass('hide');
                    $('div[data-testid="room-tile"]:contains("Louisiane")').addClass('hide');
                    $('div[data-testid="room-tile"]:contains("Suite")').addClass('hide');
                    // hide Ty Nid if search for 4 including 1+ child
                    $('div[data-testid="room-tile"]:contains("Ty Nid")').toggleClass('hide', nbTotOccup==4);
            
                    // update available rooms number
                    var nb = $('div[data-testid="room-tile"]:visible').length;
                    var nbMax = $('div[data-testid="room-tile"]').length;
                    var s = $('div[data-testid="rooms-available"]').text();
                    $('div[data-testid="rooms-available"]').text(s.replace(nbMax, nb));
                }

                // reorder rooms given occupancy requested
                /* if (nbTotOccup==2) {
                    $('div[data-testid="room-tile"]:contains("Suite")').insertAfter($('div[data-testid="rooms-available"]'));
                    $('div[data-testid="room-tile"]:contains("Louisiane")').insertAfter($('div[data-testid="rooms-available"]'));
                    $('div[data-testid="room-tile"]:contains("Orientale")').insertAfter($('div[data-testid="rooms-available"]'));
                    $('div[data-testid="room-tile"]:contains("Barclay")').insertAfter($('div[data-testid="rooms-available"]'));
                } else*/ if (nbTotOccup==3) {
                    $('div[data-testid="room-tile"]:contains("Pavillon")').insertAfter($('div[data-testid="rooms-available"]'));
                    $('div[data-testid="room-tile"]:contains("Lodge")').insertAfter($('div[data-testid="rooms-available"]'));
                    $('div[data-testid="room-tile"]:contains("Ty Nid")').insertAfter($('div[data-testid="rooms-available"]'));
                } else if(nbTotOccup>=4) {
                    $('div[data-testid="room-tile"]:contains("Pavillon")').insertAfter($('div[data-testid="rooms-available"]'));
                    $('div[data-testid="room-tile"]:contains("Lodge")').insertAfter($('div[data-testid="rooms-available"]'));
                }

                $('#near_avail').remove()

                if ($('div[data-testid="room-tile"]:visible').length==0) {
                    checkNearDates();
                }
            }
        } else {
            curHash = window.location.hash;
        }
    }
}

/**
 * no availability handling: propose other date
 */
checkNearDates = function () {
        // get arrival and departure dates from query string
        var search = new URLSearchParams(window.location.search);
        var arr = search.get('start_date') ? new Date(search.get('start_date')) : null;
        var dep = search.get('end_date') ? new Date(search.get('end_date')) : null;
        // if no departure, set it to arrival +2 days
        if (!dep) {
            dep = arr; 
            if (arr) {
                dep.setDate(arr.getDate()+2)
            }
        }
        // if no dates, get out
        if (!arr ||!dep) {
            return;
        }
        var today = new Date(); today.setTime(0,0,0,0);
        var nb_days = (dep-arr) / (1000*60*60*24);

        var locale=JSON.parse($('div[data-react-props]').attr('data-react-props')).locale || 'fr';

        var texte = { fr: 'Disponibilités approchantes', en: 'Nearby availabities', 
                    de: 'Nahe liegende Verfügbarkeiten', it: 'Disponibilità nelle vicinanze', 
                    es: 'Disponibilidades cercanas', nl: 'Beschikbaarheid in de buurt', }


        // add html elements to the not available rooms div
        $('div[data-testid="rooms-available"]').after('<div class="row small" id="near_avail" style="margin: 1.5em 1em"></div>');
        $('#near_avail').append(
            $('<h5></h5>').text(texte[locale] + ':')
        );

        // get starting dates: either from tomorrow on or -2 days of original request
        if (Math.round((arr-today)/(1000*60*60*24),0) > 2) {
            arr.setDate(arr.getDate()-2); 
            dep.setDate(dep.getDate()-2); 
        } else {
            arr = today; arr.setDate(arr.getDate()+1);
            dep = arr; dep.setDate(arr.getDate() + nb_days);
        }
        
        // Loop on 5 days
        for (let i = 1; i < 6; i++) {
            if(arr.toISOString().split('T')[0]!=search.get('start_date') || dep.toISOString().split('T')[0]!=search.get('end_date')) {
                checkAddNearAvail(search, arr, dep, locale);
            }

            arr.setDate(arr.getDate()+1);
            if (arr < dep) {
                checkAddNearAvail(search, arr, dep, locale);
            }
            
            dep.setDate(dep.getDate()+1);
        }
}

checkAddNearAvail = function(search, arr, dep, locale) {
    // set request params and rebuild url
    let arr_str = arr.toISOString().split('T')[0];
    let dep_str = dep.toISOString().split('T')[0];
    search.set('start_date', arr_str);
    search.set('end_date', dep_str);

    let apiurl = 'https://www.le1900.com/'+locale+'/api_public/v1/client_booking_engine/room_availability?'+
        'arrival_date='+search.get('start_date')+'&departure_date='+search.get('end_date')+'&total_adults='+search.get('adults')+'&total_children='+search.get('children');
    
    // link urk
    let url = window.location.origin + window.location.pathname + '?' + search.toString() + window.location.hash;
    
    // make display string (in local context)
    let s = arr.toLocaleDateString(locale, { dateStyle: "medium" }) + ' -> ' + dep.toLocaleDateString(locale, { dateStyle: "medium" });

    $('#near_avail').append(
        $('<div id="chk-'+arr_str+'-'+dep_str+'"></div>')
        .addClass('col-md-6 col-lg-4')
        .append('<a>'+s+'</a>')
        .append('&nbsp;<i class="fas fa-spinner fa-spin "></i>')
        );

    
    // ajax get request
    $.ajax({
        url: apiurl,
        success: function(data){
            let nbRooms = data && data['success'] && data['data'] && data['data']['rooms'] ? data['data']['rooms'].length : 0;
            // if search with children, remove guest rooms from count, and Ty Nid as well if tot occuppancy is 4
            if (parseInt(search.get('children'))) {
                nbRooms -= data['data']['rooms'].filter( r => r.name.match(/Barclay|Orientale|Louisiane|Suite/i)).length;
                if (parseInt(search.get('adults'))+parseInt(search.get('children'))==4) {
                    nbRooms -= data['data']['rooms'].filter( r => r.name.match(/Ty N/i)).length;
                }
            }

			// when answer received, set link url or strike through
            if ( nbRooms>0 ) {
                $('#chk-'+arr_str+'-'+dep_str+' a').attr('href', url);
                $('#chk-'+arr_str+'-'+dep_str+' i').removeClass('fa-spinner fa-spin').addClass('fa-check');
            } else {
                $('#chk-'+arr_str+'-'+dep_str+' a').css('text-decoration', 'line-through')
                $('#chk-'+arr_str+'-'+dep_str+' i').removeClass('fa-spinner fa-spin').addClass('fa-times');
            }
        }
    });
}
