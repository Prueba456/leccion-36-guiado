function initMap() {
  var laboratoriaLima = {lat: -12.1191427, lng: -77.0349046};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: laboratoriaLima
  });

  var markadorLaboratoria = new google.maps.Marker({
    position: laboratoriaLima,
    map: map
  });

  function buscar(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(funcionExito, funcionError)
    }
  }


  var inputPartida = document.getElementById("punto-partida");
  var inputDestino = document.getElementById("punto-destino");

  new google.maps.places.Autocomplete(inputPartida);
  new google.maps.places.Autocomplete(inputDestino);

  //hallar latitud y longitud
  var latitud, longitud, miUbicacion;

  var funcionExito = function(position){
    latitud = position.coords.latitude; //obtendra la latitud
    longitud = position.coords.longitude; //obtendra la longitud

    miUbicacion = new google.maps.Marker({
      position: {lat:latitud, lng:longitud},
      map: map
    });

    map.setZoom(18);
    map.setCenter({lat:latitud, lng:longitud});
  }

  var funcionError = function(error){
     alert("Tenemos un problema con encontrar tu ubicación");
  }

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    var calculateAndDisplayRoute = function(directionsService, directionsDisplay){
      directionsService.route({
        origin: inputPartida.value,
        destination: inputDestino.value,
        travelMode: 'DRIVING'
      },function(response, status){
        if(status === 'OK'){
          console.log(response.routes[0].legs[0].distance.text);
          var numero =(response.routes[0].legs[0].distance.text);
          var distancia = numero.replace('km','');
          var puntoDistancia = distancia.replace(',','.');
          var valorDistancia =Number(puntoDistancia);
          console.log(valorDistancia);

          var tarifa = document.getElementById("precio");
          tarifa.classList.remove("none");
          var costo = valorDistancia*1.75;
          if(costo<4){
            tarifa.innerHTML = "S/.4"
          }
          tarifa.innerHTML = "S/." + parseInt(costo);

          console.log(tarifa);
          console.log(costo);

          directionsDisplay.setDirections(response);

          miUbicacion.setMap(null);
          markadorLaboratoria.setMap(null);
          } else{
            window.alert("No encontramos una ruta.");
          }
   });
   }
   directionsDisplay.setMap(map);
   var trazarRuta = function(){
     calculateAndDisplayRoute(directionsService, directionsDisplay);
   };
   document.getElementById("trazar-ruta").addEventListener("click", trazarRuta);
   document.getElementById("encuentrame").addEventListener("click", buscar);
}
