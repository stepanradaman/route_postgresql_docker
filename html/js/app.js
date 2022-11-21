const geoserverUrl = "http://localhost:3000/geoserver";
let selectedPoint = null;
let source = null;
let target = null;

let pathLayer = L.geoJSON(null);

const map = L.map('map', {
    center:[40.61721985199287, -73.96135483719436],
    zoom:15
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let coordinates = {
	sx: -73.97235750790271,
	sy: 40.61943586569589,
	tx: -73.94796504888575,
	ty: 40.62029417646616
};

const sourceMarker = L.marker([coordinates.sy, coordinates.sx], {
	draggable: true
})
	.on("dragend", function(e) {
		selectedPoint = e.target.getLatLng();
		getVertex(selectedPoint);
		getRoute();
		sourceMarker._popup.setContent(JSON.stringify(selectedPoint.lng) + ', ' + JSON.stringify(selectedPoint.lat));
	})
	.bindPopup(JSON.stringify(coordinates.sx) + ', ' + JSON.stringify(coordinates.sy))
	.addTo(map)


const targetMarker = L.marker([coordinates.ty, coordinates.tx], {
	draggable: true
})
	.on("dragend", function(e) {
		selectedPoint = e.target.getLatLng();
		getVertex(selectedPoint);
		getRoute();
		targetMarker._popup.setContent(JSON.stringify(selectedPoint.lng) + ', ' + JSON.stringify(selectedPoint.lat));
	})
	.bindPopup(JSON.stringify(coordinates.tx) + ', ' + JSON.stringify(coordinates.ty))
	.addTo(map)

function getVertex(selectedPoint) {
	const url = geoserverUrl + '/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=route:vertex&outputformat=application/json&viewparams=x:' + selectedPoint.lng + ';y:' + selectedPoint.lat;
	$.ajax({
		url: url,
		async: false,
		success: function(data) {
			loadVertex(
				data,
				selectedPoint.toString() === sourceMarker.getLatLng().toString()
			);
		},
	});
}

function loadVertex(response, isSource) {
	const features = response.features;
	map.removeLayer(pathLayer);
	if (isSource) {
		source = features[0].properties.id;
	} else {
		target = features[0].properties.id;
	}
}

function getRoute() {
	const url = geoserverUrl +  '/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=route:path&outputformat=application/json&viewparams=source:'+ source + ';target:' + target;
	$.getJSON(url, function(data) {
		map.removeLayer(pathLayer);

		coordinates = {
			sx: sourceMarker.getLatLng().lng,
			sy: sourceMarker.getLatLng().lat,
			tx: targetMarker.getLatLng().lng,
			ty: targetMarker.getLatLng().lat,
		};

		// pathLayer = L.geoJSON(data);
		pathLayer = L.geoJson(data, {
			onEachFeature: function (feature, layer) {
				fetch('/api/edges', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(coordinates)
				})
				.then(function(response) {
					if(response.ok) return response.json();
					throw new Error('Request failed.');
				})
				.then(function(data) {
					layer.bindPopup(JSON.stringify(data[0].sum.toFixed()).replace(/[^\w\s]/gi, '') + " meters");
				})
				.catch(function(error) {
					console.log(error);
				});
			}
		});

		map.addLayer(pathLayer);
	});
}

getVertex(sourceMarker.getLatLng());
getVertex(targetMarker.getLatLng());
getRoute();


