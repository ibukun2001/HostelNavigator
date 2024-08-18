// INITIALIZE MAP
var map = L.map('map').setView([7.307124,5.139946], 15);
L.control.scale().addTo(map)


// ADD BASEMAPS
var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']}).addTo(map)
var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});


var hostel_style = {
    color:"red",
    weight:1,
    radius:2,
    fillColor:"red",
    opacity:1
}

// DECLARE A FUNCTION TO ZOOM TO LAYER
function zoomToLayer(layer) {
    map.fitBounds(layer.getBounds());
}

var all_hostels
$.ajax({
    url:'./services/hostels_init.py',
    type: 'GET',
    success: function(data){
        if (data.length != 0) {
            // LOAD THE DATA
            all_hostels = L.geoJSON(data,{style: hostel_style, onEachFeature:function(feature,layer){
            label = `Name: ${feature.properties.Name} hostel`
            layer.bindPopup(label)
            }}).addTo(map)
            zoomToLayer(all_hostels)
            return all_hostels
        }
    },
    error: function(data){
        alert("An error occured while trying to retrieve data.")
    }

})

function search(){
    let search_text = $('#search_box').val()
    console.log(search_text)
    $.ajax({
        url:'./services/search.py?'
        +'query=' + search_text,
        type: 'GET',
        success: function(data){
            if (data.length != 0) {
                // LOAD THE DATA
                console.log(data)
                hostel = L.geoJSON(data,{style: hostel_style, onEachFeature:function(feature,layer){
                    label = `Name: ${feature.properties.Name} hostel`
                    layer.bindPopup(label)
                    }}).addTo(map)
                zoomToLayer(hostel)
                map.removeLayer(all_hostels)
                return hostel
            }
        },
        error: function(data){
            alert("An error occured while trying to retrieve data.")
        }
    
    })
}

function append_suggestion(button) {
    let suggestion = button.innerHTML;
    $('#search_box').val(suggestion)
    search()
}

function suggest() {
    const search_text = $('#search_box').val();
    
    if (search_text.length > 1) {
        $.ajax({
            url: './services/suggest.py?' + 'query=' + search_text,
            type: 'GET',
            success: function(response) {
                $('#suggestions').empty().show();
                
                const suggestions = response.results;
                
                suggestions.forEach(suggestion => {
                    $('#suggestions').append(
                        `<textarea onclick="append_suggestion(this)" class="suggestion-item">${suggestion.Name}</textarea>`
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
    if (!$(e.target).closest('#search').length) {
        $('#suggestions').hide();
    }
});






function my_location() {
    map.locate({setView: true, maxZoom: 16}); // Locate and zoom in to the user's location

    function onLocationFound(e) {
        var radius = e.accuracy / 2;

        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();

        L.circle(e.latlng, radius).addTo(map);
    }

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
}