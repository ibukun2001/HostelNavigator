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
    color:"black",
    weight:1,
    radius:4,
    fillColor:"red",
    opacity:1
}


var from = []
var to = []
var start_end = {
    'from': from,
    'to': to
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
            all_hostels = L.geoJSON(data, {
                //style: hostel_style, 
                onEachFeature: function(feature, layer) {
                    const label = `Name: ${feature.properties.Name} hostel`;
                    layer.bindPopup(label);
                },
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 4,              // Size of the circle
                        fillColor: "#000",      // Black fill color
                        color: "#000",          // Black border color
                        weight: 1,              // Border weight
                        opacity: 1,             // Border opacity
                        //fillOpacity: 1          // Fill opacity
                    });
                }
            }).addTo(map);

            zoomToLayer(all_hostels)
        }
    },
    error: function(data){
        alert("An error occured while trying to retrieve data.")
    }

})


let mode;

$('input[name="mode"]').on('change', function() {
    mode = $(this).val();
});





function search(type){
    let search_text = $(`#${type}_search_box`).val()
    
    //console.log('Search text: '+ search_text)
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
                zoomToLayer(hostel)
                map.removeLayer(all_hostels)

                var coords = data.features[0].geometry.coordinates
                var location = {
                    lat: coords[1],
                    lng: coords[0]
                };
                if (type == 'from'){
                    start_end.from = location
                }
                if (type == 'to'){
                    start_end.to = location
                }
                console.log(start_end)

            }
        },
        error: function(data){
            alert("Name not found in the database.\nClick on one of the suggested names")
        }
    })
}

function append_suggestion(button,type) {
    let suggestion = button.innerHTML;
    $(`#${type}_search_box`).val(suggestion)
    search(type)
    $(`#${type}_suggestions`).hide()
}

function suggest(type) {
    const search_text = $(`#${type}_search_box`).val();
    
    if (search_text.length > 1) {
        $.ajax({
            url: './services/suggest.py?' + 'query=' + search_text,
            type: 'GET',
            success: function(response) {
                $(`#${type}_suggestions`).empty().show();
                
                const suggestions = response.results;
                suggestions.forEach(suggestion => {
                    $(`#${type}_suggestions`).append(
                        `<textarea onclick="append_suggestion(this, '${type}')" class="suggestion-item">${suggestion.Name}</textarea>`
                    );
                });
            }
        });
    } else {
        $(`#${type}_suggestions`).hide();
    }
}

// Hide suggestions when clicking outside
$(document).click(function(e) {
    if (!$(e.target).closest('#search').length) {
        $('#suggestions').hide();
    }
});




var loc
function my_location(type) {
    map.locate({setView: true, maxZoom: 16}); // Locate and zoom in to the user's location

    function onLocationFound(e) {
        var radius = e.accuracy / 2;

        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();
        loc = e.latlng
        L.circle(loc, radius).addTo(map);

        if (type == 'from'){
            start_end.from = loc
        }
        if (type == 'to'){
            start_end.to = loc
        }
        console.log(start_end)
        $(`#${type}_search_box`).val(loc.lat+','+loc.lng)

    }

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

}

let route
function route_func(){
    // IF BOTH FROM AND TO LOCATIONS ARE DEFINED
    if (start_end.from && start_end.to &&
        typeof start_end.from.lat === 'number' && typeof start_end.from.lng === 'number' &&
        typeof start_end.to.lat === 'number' && typeof start_end.to.lng === 'number' && mode) {

            if (route){map.removeLayer(route)}

            from_lat = start_end.from.lat
            from_lng = start_end.from.lng
            to_lat = start_end.to.lat
            to_lng = start_end.to.lng
            

        console.log(start_end)
        $.ajax({
            url:'./services/route.py?'+
            'from_lat=' + from_lat+
            '&from_lng=' + from_lng+
            '&to_lat=' + to_lat+
            '&to_lng=' + to_lng+
            '&mode=' + mode,


            type: 'GET',
            success: function(data){
                if (data.length != 0) {
                    // LOAD THE DATA
                    route = L.geoJSON(data, {
                        style: function (feature) {
                            return {
                                color: 'red',
                                weight: 5,
                                opacity: 0.7
                            };
                        }
                    }).addTo(map)
                    zoomToLayer(route)
        
                }
            },
            error: function(data){
                alert("An error occured while trying to create route.")
            }
        
        })
    }
    else{
        alert("Ensure that the 'From' and 'to' values are filled and navigation mode is selected")
    }
}

