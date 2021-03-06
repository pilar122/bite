// Map view (permissions)
let map;
let marker;
let infowindow;
let directionsDisplay;
let directionsService;
let autocomplete;
let latitude = 40.7608;
let longitude = 111.8910;
let mapCenter;
let searchResultsList = [];
let mapCanvas = document.getElementById("map");
let inputAddress;
let numOfResults = 10;

const markerImages = {
  'Indian': '#',
  'Italian' : '#',
  'Cafe' : '#',  
  'All' : '#',
  'Mexican' : '#',
  'Chinese' : '#'
}



// Settings
function initMap() {

	mapCenter = {
		lat: latitude, 
		lng: longitude
	};

	mapOptions = {
		zoom: 14,
		center: mapCenter
	}

	map = new google.maps.Map(mapCanvas, mapOptions);
  
}

// Settings Part 2


// Input - > Lat/Long --> Map
function drawInitMap(){	

	initMap();
	inputAddress = localStorage.getItem('input-address');

	getLatLong(inputAddress, function(latlng){

		map.setCenter(
		{
			lat: latlng.latitude,
			lng: latlng.longitude
		});

		createMarker({
						lat: latlng.latitude,
						lng: latlng.longitude
					 }, 
					"YOU ARE HERE! @ " + inputAddress, 
					12, 
					'assets/images/home.png',
					40, 
          //google.maps.Animation.BOUNCE
          );

  });
}
		

// Yelp Results
function displayMarkers(yelpResponse){

	console.log("**Yelp Results**", numOfResults, yelpResponse);
  let markerImage = getMarkerIcon();

	for(let i = 0; i < numOfResults; i++){

    if(yelpResponse[i] && yelpResponse[i] != null && yelpResponse[i] != undefined ){
  		let latitude_business = yelpResponse[i].coordinates.latitude;
  		let longitude_business = yelpResponse[i].coordinates.longitude;

      let price = yelpResponse[i].price != undefined ? yelpResponse[i].price : "";
      let infoText = yelpResponse[i].name +'<br> Price : ' + price  + "<br> Rating : " + getRatingStars(parseInt(yelpResponse[i].rating));    

  		createMarker(
  			{
  				lat: latitude_business, 
  				lng: longitude_business
  			},
  			infoText, 
  			22, 
  			markerImage, 
  			50,
  			google.maps.Animation.DROP);
    }else{
      console.log("End of results");
      break; 
    }
												
	}		
}

function getMarkerIcon(){
  let category = localStorage.getItem("input-category");

  if(category){
    return markerImages[category];
  }
  
  return 'assets/images/food-pin.png';
}

// Maps
function createMarker(latlng, txt, zoom, image, size, anime) {

  infowindow = new google.maps.InfoWindow;

  marker = new google.maps.Marker({
      position: latlng,
      map: map,
      animation: anime,
      icon: {
        url: image,
        scaledSize : new google.maps.Size(size, size),        	
      }
  });

  google.maps.event.addListener(marker, 'mouseover', function() {
      infowindow.setContent("<p class='infotext'>" + txt + "</p>"); 
      infowindow.open(map, this);
  });

  google.maps.event.addListener(marker, 'mouseout', function() {
      infowindow.close(map, this);
  });

  google.maps.event.addListener(marker,'click',function() {
    var pos = map.getZoom();
    var center = map.getCenter();
    map.setZoom(18);
    map.setCenter(this.getPosition());
    window.setTimeout(
      function() {
        map.setZoom(pos);
        map.setCenter(center);
      },3000);
  });

  marker.setMap(map);
  marker.MyZoom = zoom; 
}

function zoomToLocation(latitude, longitude, zoom){
	var center = new google.maps.LatLng(latitude, longitude);
 	 map.setCenter(center);
    map.setZoom(zoom); 	
    
}

// Testing
function getLatLong(address, callback){

	var geocoder = new google.maps.Geocoder();

	geocoder.geocode(
		{
		'address': address
		}, function(results, status) {
			if (status === 'OK') {
				callback(
					{
						latitude : results[0].geometry.location.lat(),
						longitude : results[0].geometry.location.lng()
					});
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
    });
}

function getAddressTxt(latitude, longitude, callback){

  var latlng = new google.maps.LatLng(latitude, longitude);
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({ 'latLng': latlng }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      callback(results[0].formatted_address);
    }else{
      alert(status);
    }
  });
}

function getDirections(start, end, id){

  let mode = localStorage.getItem('mode');
  console.log(mode);

  if(mode == undefined || mode == null || mode == "")
    mode = "WALKING";
    //mode = "DRIVING";

  console.log("Mode set", mode);

  if (directionsDisplay != null) {
    directionsDisplay.setMap(null);
    directionsDisplay = null;
  }

  directionsDisplay = new google.maps.DirectionsRenderer;
  directionsService = new google.maps.DirectionsService;

  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById(id));

  document.getElementById(id).innerHTML = "";
  directionsDisplay.setOptions( { suppressMarkers: true } );

  directionsService.route({
    origin: start,
    destination: end,
    travelMode: mode
  }, function(response, status) {
  
    if (status === 'OK') {
      console.log('directions', response);
      directionsDisplay.set('directions', null);
      directionsDisplay.setDirections(response);

    } else {
      console.log('Directions request failed due to ' + status);
    }
  });
}