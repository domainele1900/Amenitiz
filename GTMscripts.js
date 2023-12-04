bookingRoomDataLayer = function() {
    var items = [];
    var room_ids = {
        '8490': 'Barclay',
        '8491': 'Orientale',
        '8492': 'Louisiane',
        '8493': 'Suite Junior',
        '8494': 'Lodge',
        '8495': 'Pavillon',
        '21546': 'Ty Nid',
    };

    $('form.room_booked').each(function(i, elt) { 
        var item= {}; 
        item.item_id = ''+$('input#room_booked_room_id', $(elt)).attr('value'); 
        item.item_name = room_ids[$('input#room_booked_room_id', $(elt)).attr('value')]; 
        item.item_category = $('input#room_booked_arrival_date', $(elt)).attr('value')+'-'+$('input#room_booked_departure_date', $(elt)).attr('value')+'/'+
                             $('input#room_booked_total_adult', $(elt)).attr('value')+' adultes-'+$('input#room_booked_total_children', $(elt)).attr('value')+' enfants'; 
        item.price = $('input#room_booked_total_price', $(elt)).attr('value'); 
        item.promotion_id = $('input#room_booked_pricing_type_id', $(elt)).attr('value'); 
        items[i] = item;
        console.log(item); 
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