var room_ids = {
    '8490': 'Barclay',
    '8491': 'Orientale',
    '8492': 'Louisiane',
    '8493': 'Suite Junior',
    '8494': 'Lodge',
    '8495': 'Pavillon',
    '21546': 'Ty Nid',
    '9059056555': 'Carte cadeau 100€',
    '9053164897': 'Carte cadeau 150€',
};

bookingRoomDataLayer = function() {
    var items = [];
    $('form.room_booked').each(function(i, elt) { 
        var item= {}; 
        item.item_id = ''+$('input#room_booked_room_id', $(elt)).attr('value'); 
        item.item_name = room_ids[$('input#room_booked_room_id', $(elt)).attr('value')]; 
        item.item_category = $('input#room_booked_arrival_date', $(elt)).attr('value')+'-'+$('input#room_booked_departure_date', $(elt)).attr('value')+'/'+
                             $('input#room_booked_total_adult', $(elt)).attr('value')+' adultes-'+$('input#room_booked_total_children', $(elt)).attr('value')+' enfants'; 
        item.price = $('input#room_booked_total_price', $(elt)).attr('value'); 
        item.promotion_id = $('input#room_booked_pricing_type_id', $(elt)).attr('value'); 
        items[i] = item;
    });

    dataLayer.push({
        event: "view_item",
        ecommerce: {
            currency: "EUR",
            value:  items[0].price,
            items: items
        }
    });
};

/**
 * set dataLayer on formSubmit
 */
$( document ).ready(function() {
	$('form').submit(function(e) { 
//		e.preventDefault(); 
        var f = $(e.target[0]).parents('form');
        var evtName = 'add_to_cart';
        var item= { price: 0 }; 

        if (f.attr('action').includes('add-room-to-cart')) {
            item.item_id = ''+$('input#room_booked_room_id', f).attr('value'); 
            item.item_name = room_ids[item.item_id]; 
            item.item_category = $('input#room_booked_arrival_date', f).attr('value')+'-'+$('input#room_booked_departure_date', f).attr('value')+'/'+
                                 $('input#room_booked_total_adult', f).attr('value')+' adultes-'+$('input#room_booked_total_children', f).attr('value')+' enfants'; 
            item.price = $('input#room_booked_total_price', f).attr('value'); 
            item.promotion_id = $('input#room_booked_pricing_type_id', f).attr('value'); 
            item.item_list_id = $('input[name="cart_id"]', f).attr('value'); 
                
        } else if (f.attr('action').includes('add-gift-card-to-cart')) {
            item.item_id = f.attr('action').match(/\d+/g)[0];
            item.item_name = room_ids[item.item_id]; 
            item.item_category = 'Carte Cadeau';
            item.price = item.item_name.match(/\d+/g)[0];
        } else {
            evtName = '';
        }

        if (evtName) {
            dataLayer.push({
                event: evtName,
                ecommerce: {
                    currency: "EUR",
                    value:  item.price,
                    items: [item]
                }
            })
        }
    });    
});