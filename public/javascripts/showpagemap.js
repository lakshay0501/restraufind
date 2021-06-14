
mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, 
    zoom: 9 
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h4><b>${campground.title}</b></h4><h5>${campground.location}</h5>`
    )
)
.addTo(map)