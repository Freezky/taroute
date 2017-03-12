  

    /* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "320px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function updateMean(sender)
{
  var ParsedName = sender.src.split("_");
  var extension
  if (ParsedName[1] == "unclick.png")
  {
    extension = "click.png"
    sender.value = "click"
  }
  else
  {
    extension = "unclick.png"
    sender.value = "unclick"
  }

  sender.src = ParsedName[0] + "_" + extension;
  
  updateMap();
}

function updateMap()
{
  var Travel_mode_List =  document.getElementById("mode");
  var bikeLayerAppear = false;
  var transitLayerAppear = false;

  for(i = 1; i < 8; i+=2)
  {
    switch(i) {
    case 1:
        if(Travel_mode_List.childNodes[i].value == "click" || Travel_mode_List.childNodes[7].value == "click")
        {
            bikeLayerAppear = true;
        }
        break;
    case 3:
        if(Travel_mode_List.childNodes[i].value == "click" )
        {
            transitLayerAppear = true;
        }
        break;
    default:
        break;
      } 
    }
      
      bikeLayer.setMap(null); 
      transitLayer.setMap(null);

    if(bikeLayerAppear && transitLayerAppear)
    {
        bikeLayer.setMap(map);
        transitLayer.setMap(map);

    }else if(transitLayerAppear)
    {
       transitLayer.setMap(map);
    }
    else if(bikeLayerAppear)
    {
       bikeLayer.setMap(map);
    }

}

function AddPath()
{
  var flightPlanCoordinates = [
    {lat: 37.772, lng: -122.214},
    {lat: 21.291, lng: -157.821},
    {lat: -18.142, lng: 178.431},
    {lat: -27.467, lng: 153.027}
  ];
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 5
  });

  flightPath.setMap(map);
}

function geocodePlaceId(originId, destinationId) {
lat1 = 0, lat2 = 0, lng1 = 0, lng2 = 0;

  if(originId != null){
    geocoder.geocode({'placeId': originId}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        map.setZoom(11);
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        lat1 = results[0].geometry.location.lat();
        lng1 = results[0].geometry.location.lng(); 
       
        infowindow.setContent(lat1 + ", " + lng1 + ", " + lat2 + ", " + lng2);
        infowindow.open(map, marker);
        if(lat1 != 0 && lat2 != 0){
            $.post('directions', {lat1: lat1, lng1: lng1, lat2: lat2, lng2: lng2 }, function(resp){
              alert(resp);
            })
        }
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
    
  }
  
if(destinationId != null)
{
  geocoder.geocode({'placeId': destinationId}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        map.setZoom(11);
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        lat2 = results[0].geometry.location.lat();
        lng2 = results[0].geometry.location.lng(); 
       
        infowindow.setContent(lat1 + ", " + lng1 + ", " + lat2 + ", " + lng2);
        infowindow.open(map, marker);
        if(lat1 != 0 && lat2 != 0){
            $.post('directions', {lat1: lat1, lng1: lng1, lat2: lat2, lng2: lng2 }, function(resp){alert(resp)})
        }
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}
  

  
}

function initMap() {
var origin_place_id = null;
  var destination_place_id = null;
  var travel_mode = google.maps.TravelMode.WALKING;
  map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    center: {lat:  45.508, lng: -73.587},
    zoom: 13,
    fullscreenControl: true
  });

  infowindow = new google.maps.InfoWindow;
  geocoder = new google.maps.Geocoder;
  bikeLayer = new google.maps.BicyclingLayer();
  transitLayer = new google.maps.TransitLayer();
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);

  var origin_input = document.getElementById('origin-input');
  var destination_input = document.getElementById('destination-input');

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(origin_input);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(destination_input);

  var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  origin_autocomplete.bindTo('bounds', map);
  var destination_autocomplete =
      new google.maps.places.Autocomplete(destination_input);
  destination_autocomplete.bindTo('bounds', map);

  function expandViewportToFitPlace(map, place) {
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);

    }
  }

  origin_autocomplete.addListener('place_changed', function() {
    var place = origin_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    expandViewportToFitPlace(map, place);
    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    origin_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
          directionsService, directionsDisplay);
  });

  destination_autocomplete.addListener('place_changed', function() {
    var place = destination_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    
    expandViewportToFitPlace(map, place);
    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    destination_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
          directionsService, directionsDisplay);
  });

  function route(origin_place_id, destination_place_id, travel_mode,
                 directionsService, directionsDisplay) {
                   
    geocodePlaceId(origin_place_id, destination_place_id, AddPath);
  }
}