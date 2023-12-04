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

});