function search(){
    let search_text = $('search_box_to').val()
    $.ajax({
        url:'./services/search.py?'
        +'query=' + search_text,
        type: 'GET',
        success: function(data){
            if (data.length != 0) {
                // LOAD THE DATA
                hostel = L.geoJSON(data,{style: hostel_style, onEachFeature:function(feature,layer){
                    label = `Name: ${feature.properties.Name} hostel`
                    layer.bindPopup(label)
                    }}).addTo(map)
                //zoomToLayer(hostel)
                map.removeLayer(all_hostels)
                return hostel
            }
        },
        error: function(data){
            alert("An error occured while trying to retrieve data.")
        }
    
    })
}

function append_suggestion(element) {
    search()
    let suggestion = element.innerHTML;
    $('#search_box').val(suggestion)
}

function suggest() {
    const search_text = $('#search_box_to').val();
    
    if (search_text.length > 1) {
        $.ajax({
            url: './services/suggest.py?' + 'query=' + search_text,
            type: 'GET',
            success: function(response) {
                $('#suggestions_to').empty().show();
                
                const suggestions = response.results;
                
                suggestions.forEach(suggestion => {
                    $('#suggestions_to').append(
                        `<textarea onclick="append_suggestion(this)" id="suggestion_to">${suggestion.Name}</textarea>`
                    );
                });
            }
        });
    } else {
        $('#suggestions').hide();
    }
}

// Hide suggestions when clicking outside
$(document).click(function(e) {
    if (!$(e.target).closest('#search-to').length) {
        $('#suggestions_to').hide();
    }
});