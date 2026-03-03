const BASEMAPS = {
  osm: {
    version: 8,
    sources: { osm: { type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256, attribution: '&copy; OpenStreetMap contributors' }},
    layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm' }]
  },
  satellite: {
    version: 8,
    sources: { satellite: { type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256, attribution: 'Esri World Imagery' }},
    layers: [{ id: 'satellite-tiles', type: 'raster', source: 'satellite' }]
  }
};

const map = new maplibregl.Map({
  container: 'map',
  style: BASEMAPS.osm,
  center: [-77.44, 37.54],
  zoom: 14
});

map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
map.addControl(new maplibregl.ScaleControl({ unit: 'imperial' }), 'bottom-left');

function addLayers() {
  if (map.getSource('structures')) return;
  map.addSource('structures', { type: 'geojson', data: 'data/structures.geojson' });

  map.addLayer({
    id: 'structures-fill',
    type: 'fill',
    source: 'structures',
    paint: {
      'fill-color': '#a89f91',
      'fill-opacity': 0.6
    }
  });

  map.addLayer({
    id: 'structures-outline',
    type: 'line',
    source: 'structures',
    paint: {
      'line-color': '#e74c3c',
      'line-width': 2
    }
  });

  map.on('mouseenter', 'structures-fill', () => map.getCanvas().style.cursor = 'pointer');
  map.on('mouseleave', 'structures-fill', () => map.getCanvas().style.cursor = '');
  map.on('click', 'structures-fill', (e) => {
    const props = e.features[0].properties;
    const rows = Object.entries(props)
      .filter(([k]) => !k.startsWith('_'))
      .map(([k, v]) => '<p><strong>' + k + ':</strong> ' + (v ?? 'N/A') + '</p>')
      .join('');
    new maplibregl.Popup().setLngLat(e.lngLat)
      .setHTML('<h3>Structure</h3>' + rows).addTo(map);
  });
}

map.on('load', addLayers);

document.querySelectorAll('.basemap-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.basemap-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    map.setStyle(BASEMAPS[btn.dataset.basemap]);
    map.once('styledata', addLayers);
  });
});

document.getElementById('toggle-structures').addEventListener('change', (e) => {
  const v = e.target.checked ? 'visible' : 'none';
  ['structures-fill', 'structures-outline'].forEach(id => {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', v);
  });
});
