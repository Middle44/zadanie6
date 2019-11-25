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
var AllMyLayers = new ImageLayer(
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
var MyLayers = new ImageLayer(
  {
    extent: [17.84506885869866, 48.731926770588124, 17.93695929993104, 48.764736748435276],
    source: new ImageWMS(
      {
        url: 'http://localhost:8080/geoserver/ows?',
        params: { LAYERS: ['Blasko:Budova'] },
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
        center: [17.888000, 48.741500],
        zoom: 14
      }
    )
  }
);
//////////////////////////////////////////////////////
//const checkedlayers
var parser = new WMSCapabilities();
var isTablevisible = 0;
////Funkcie//////////////////////////////////////////
function AddTable() 
{
  fetch('http://localhost:8080/geoserver/Blasko/wms?service=WMS&version=1.3.0&request=GetCapabilities').then(function (response) 
  {
    return response.text();
  }).then(function (text) 
  {
    switch(isTablevisible) 
    {
    case 1:
      alert("Už si zobrazil všetky dostuplné vrstvy!");
    break;
    case 0:
      var data = parser.read(text);
      var table = "<th>Name</th><th>Queryable</th><th>Checkbox</th>";
      var rows = data.Capability.Layer.Layer.length;
      for (var r = 1; r < rows; r++) 
      {
        table += '<h2>';
        for (var c=1; c<=1; c++) 
        {
          table += '<tr>'+'<td>'+data.Capability.Layer.Layer[r-1].Name+'</td>'+'<td>'+ data.Capability.Layer.Layer[r-1].queryable +'</td>'+
          '<td>'+`<input class="layer-checkbox" id="MyLayer${r}" onclick="AddMyLayers()" type="checkbox"/>`+'</td>'+'</tr>';
          //'<td>'+`<input class="${r}" id="MyLayer${r}" onclick="AddLayer()" type="checkbox"/>`+'</td>'+'</tr>';
        }
        table += '</tr>';
      }
      document.body.insertAdjacentHTML('beforeend','<table id="tabulka">' + table + '</table>');
      isTablevisible = 1;
    break;
    }
  })
}
function AddAllMyLayers() 
{
  map.addLayer(AllMyLayers)
  var layers = [
    AllMyLayers
  ];
}
function isChecked(stav) 
{
  for (var i = 0; i < 9; i++) 
  {
    var MyLayer = document.getElementsByClassName('layer-checkbox')[i].id;
    var stav = [MyLayer,document.getElementById(MyLayer).checked];
    //console.log(MyLayer)
    console.log(stav)
  }
} 
function AddMyLayers() 
{
  //console.log(stav)
  for (var i = 0; i < 9; i++) 
  {
    //var MyLayer = document.getElementsByClassName('layer-checkbox')[i].id;
    //var stav = [MyLayer,document.getElementById(MyLayer).checked];
    //var stav = [MyLayer];
    //console.log(stav)
    var MyLayer = document.getElementsByClassName('layer-checkbox')[i].id;
    var stav = [
      {
        vrstva: MyLayer,
        stav: document.getElementById(MyLayer).checked
      }
    ];
    for(var a = 0; a < 9; a++)
    {
      switch(document.getElementById(stav[a].vrstva).checked) 
      {
        case true:
          map.addLayer(MyLayers)
          var layers = [
            MyLayers
          ];
          //console.log(stav[a].vrstva)
        break;
        case false:
          map.removeLayer(MyLayers)
        break;
      }
    }
    //console.log(stav[a].vrstva)
  }
  //console.log(stav)
}
function AddLayer() 
{
  switch (document.getElementById("MyLayer1").checked)
  {
    case true:
    {
      map.addLayer(MyLayers)
      var layers = [
        MyLayers
      ];
    }
    break;
    case false:
    {
      map.removeLayer(MyLayers)
    }
    break;
  }
}
function RemoveAllMyLayers() 
{
  map.removeLayer(AllMyLayers)
}
function RemoveTable() 
{
  var x = document.getElementById("tabulka");
  //switch(isTablevisible) 
  //{
    //case 1:
      //x.style.display = "none";
    //break;
    //case 0:
      //x.style.display = "none";
    //break;
  //}
  isTablevisible = 0;
  return x.style.display = "none";
}
/*
var add = (function () {
  var counter = 0;
  return function () {counter += 1; return counter;}
})();
*/
function pocet()
{
  console.log(isTablevisible) 
}
