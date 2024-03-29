/////////////////////////////////////////////////////
const Map = ol.Map;
const View = ol.View;
const ImageLayer = ol.layer.Image;
const TileLayer = ol.layer.Tile;
const ImageWMS = ol.source.ImageWMS;
const OSM = ol.source.OSM;
const WMSCapabilities = ol.format.WMSCapabilities;
//////////////////////////////////////////////////
var layers = [];
var OSM_layer = [
  new TileLayer(
  {
    source: new OSM()
  })
];
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
var map = new Map(
  {
    layers: OSM_layer,
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
var parser = new WMSCapabilities();
var isTablevisible = 0;
////Funkcie///////////////////////////////////////////
function functionURL() 
{
  const x = document.getElementById("myURL").value;
  alert("URL úspešne vložená");
  if (!x) 
  {
    alert('No url')
    return;
  }
  Fun();
}
let capabilitiesJson;
function Fun() 
{  
  const url = document.getElementById("myURL").value;
  if (!url) 
  {
    return;
  }
  fetch(url,{mode:'cors'})
  .then(function(response) 
  {
    return response.text();
  })
  .then(function(text) 
  {
    capabilitiesJson = parser.read(text);
  });
}
function AddTable() 
{
  if(capabilitiesJson)
  {
    switch(isTablevisible) 
    {
    case 1:
      alert("Už si zobrazil všetky dostuplné vrstvy!");
      break;
    case 0:
      let layername = capabilitiesJson.Capability.Layer.Layer;
      let table = "<th>Vrstva</th><th>Dopytovateľnosť</th><th>Pridať<br>Odobrať</th>";
      for (let rows = 1; rows < layername.length; rows++)
      {
        const layer = new ImageLayer(
          {
            extent: [17.79569523402574, 48.71936026587261, 17.957725778672316, 48.79917418319719],
            source: new ImageWMS(
              {
                url: 'http://localhost:8080/geoserver/ows?',
                params: { LAYERS: [layername[rows].Name] },
                ratio: 1,
                serverType: 'geoserver'
              }),
          }
        )
        OSM_layer.push(layer)
        table += '<tr>';
        for (let stlpce = 1; stlpce <= 1; stlpce++) 
        {
          table += '<tr>' + '<td>' + layername[rows].Name + '</td>' + '<td>' + layername[rows].queryable + '</td>' + '<td>' + `<input class="checkbox-class" center id="checkbox-${rows - 1}" onclick="isChecked()" type = "checkbox"/>` + '</td>' + '</tr>';
        }
        table += '</tr>';
      }
      //var t = document.getElementById("mytab");
      document.body.insertAdjacentHTML('beforeend','<p><table id="tabulka" cellpadding="0" cellspacing="0" border="0">' + table + '</table></p>');
      isTablevisible = 1;
      break;
    }
  }
}
function AddAllMyLayers() 
{
  map.addLayer(AllMyLayers)
  OSM_layer = [AllMyLayers];
}
function isChecked() 
{
  const checkboxes = document.getElementsByClassName("checkbox-class");
  const checboxArray = Array.from(checkboxes);
  checboxArray.forEach(function whichOneIs(checkbox) 
  {
    var index = checkbox.id.split('-')[1];
    var integerindex = parseInt(index, 10);
    var i = integerindex + 1;
    const layer = OSM_layer[i];
    if (checkbox.checked)
    {
      try 
      {
        map.addLayer(layer)
      } 
      catch (error) 
      {
        //console.log(error)
      }
    } 
    else 
    {
      map.removeLayer(layer)
    }
  })
}
function RemoveAllMyLayers() 
{
  map.removeLayer(AllMyLayers)
}
function RemoveTable() 
{
  if (isTablevisible = 1)
  {
    var x = document.getElementById("tabulka");
    isTablevisible = 0;
    return x.style.display = "none";
  }
  else
  {
    alert("Už si skrzl tabuľku s dostupnými vrstvami dostuplné vrstvy!");
  }
}
map.on('singleclick', function(evt) 
  {
    document.getElementById('info').innerHTML = '';
    var viewResolution = /** @type {number} */ (map.values_.view.getResolution());
    var url = AllMyLayers.values_.source.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:4326', {'INFO_FORMAT': 'text/html'});
    if (url) 
    {
      fetch(url)
        .then(function (response) { return response.text(); })
        .then(function (html) 
        {
          document.getElementById('info').innerHTML = html;
        });
    }
  }
);
map.on('pointermove', function(evt) 
  {
    if (evt.dragging) 
    {
      return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var hit = map.forEachLayerAtPixel(pixel, function() 
    {
      return true;
    });
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  }
);
////DIALOGOVE OKNO///////////////////////////////////////////
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() 
{
  modal.style.display = "block";
}
span.onclick = function() 
{
  modal.style.display = "none";
}
window.onclick = function(event) 
{
  if (event.target == modal) 
  {
    modal.style.display = "none";
  }
}
/*
var add = (function () {
  var counter = 0;
  return function () {counter += 1; return counter;}
})();
*/