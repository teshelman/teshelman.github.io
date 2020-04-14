"use strict"; // JS strict mode 

window.onload = function() {// Bandelier Hall East lat/long: 35.0843° N, 106.6241° W
// create a map variable "mymap" that points to the map placed in the mapID <div>
// zoom the view on Bandelier Hall East building at a 17 zoom level 
var mymap = L.map('mapId').setView([35.08444, -106.6247], 17);

// create a variable named "osm" that is used to hold OpentStreetMap tile layer 
var osm = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

// add the OpenStreetMap tile layer (i.e., the variable osm you defined above) to the map
osm.addTo(mymap);
}