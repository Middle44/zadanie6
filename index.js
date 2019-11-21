const Map = ol.Map;
const View = ol.View;
const ImageLayer = ol.layer.Image;
const TileLayer = ol.layer.Tile;
const ImageWMS = ol.source.ImageWMS;
const OSM = ol.source.OSM;
const WMSCapabilities = ol.format.WMSCapabilities;
//////////////////////////////////////////////////
var OSM_layer = new TileLayer(
  {
    source: new OSM()
  }
);
var MY_layer = new ImageLayer(
  {
    extent: [17.84506885869866, 48.731926770588124, 17.93695929993104, 48.764736748435276],
    source: new ImageWMS(
      {
        url: 'http://localhost:8080/geoserver/ows?',
        params: { LAYERS: ['Blasko:Cesta', 'Blasko:Budova', 'Blasko:Chodnik', 'Blasko:Znacka', 'Blasko:Kos', 'Blasko:Park'] },
        ratio: 1,
        serverType: 'geoserver'
      }
    ),
  }
);
var layers = [
  OSM_layer
];
var map = new Map(
  {
    layers: layers,
    target: 'map',
    view: new View(
      {
        projection: 'EPSG:4326',
        center: [17.888738, 48.746600],
        zoom: 14
      }
    )
  }
);
//////////////////////////////////////////////////////
//const checkedlayers
var parser = new WMSCapabilities();
////Funkcie//////////////////////////////////////////
function AddTable() 
{
  fetch('http://localhost:8080/geoserver/Blasko/wms?service=WMS&version=1.3.0&request=GetCapabilities').then(function (response) 
  {
    return response.text();
  }).then(function (text) 
  {
    var data = parser.read(text);
    data.Capability.Layer.Layer.forEach(layer => 
      {
        //console.log(layer.Name, layer.Title, layer.queryable)
      });
    var table = "<th>Name</th><th>Queryable</th><th>Checkbox</th>";
    var rows = data.Capability.Layer.Layer.length;
    for (var r = 1; r < rows; r++) 
    {
      table += '<h2>';
      for (var c=1; c<=1; c++) 
      {
        //const checkbox = 
        table += '<tr>'+'<td>'+data.Capability.Layer.Layer[r-1].Name+'</td>'+'<td>'+ data.Capability.Layer.Layer[r-1].queryable +'</td>'+
        '<td>'+'<input class="layer-checkbox" id="layers-${index}" onclick="AddMYLayers()" type="checkbox"/>'+'</td>'+'</tr>';
      }
      table += '</tr>'; 
    }
    document.body.insertAdjacentHTML('beforeend','<table border="1">' + table + '</table>')
  })
}
function AddMYLayers() 
{
  map.addLayer(MY_layer)
  var layers = [
    MY_layer
  ];
}
function RemoveMYLayers() 
{
  map.removeLayer(MY_layer)
}
function RemoveTable() 
{
  //var tbl = document.getElementById(tabulka);
  //tbl.remove();
}