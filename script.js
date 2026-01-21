let map;
let currentMode = 'static';
let userMarker = null;
let userCircle = null;

// Fungsi untuk menghitung bearing (sudut arah) antara dua titik koordinat
function calculateBearing(lat1, lon1, lat2, lon2) {
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon * Math.PI / 180);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

// INISIALISASI PETA STATIS
function initStaticMap() {
  map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 4,
    zoomControl: true,
    attributionControl: false,
    tap: true,
    touchZoom: true,
    dragging: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    boxZoom: true,
    keyboard: true,
    zoomSnap: 0.5,
    zoomDelta: 0.5
  });

  const imgWidth = 2000;
  const imgHeight = 1200;
  const bounds = [[0, 0], [imgHeight, imgWidth]];

  // Ganti dengan path gambar yang sesuai
  L.imageOverlay('peta/petaEvakuasiTalang.jpg', bounds).addTo(map);

  map.fitBounds(bounds);
  
  // Force enable all touch interactions
  map.dragging.enable();
  map.touchZoom.enable();
  map.doubleClickZoom.enable();
  map.scrollWheelZoom.enable();
  map.boxZoom.enable();
  map.keyboard.enable();
  
  if (map.tap) {
    map.tap.enable();
  }
  
  // Hide loading setelah peta siap
  map.whenReady(function() {
    setTimeout(() => {
      const loading = document.getElementById('loading');
      if (loading) {
        loading.style.display = 'none';
      }
      map.invalidateSize();
    }, 500);
  });
}

// INISIALISASI PETA INTERAKTIF (LIVE)
function initLiveMap() {
  // TITIK KOORDINAT LOKASI
  const titik1 = [-5.449776007968228, 105.25698213913022];
  const titik2 = [-5.449690565244476, 105.25818913319254];
  const titik3 = [-5.449615802848255, 105.25920837261762];
  const titik4 = [-5.448853664572905, 105.25913434553638];
  const titik5 = [-5.447636102742394, 105.2591182522831];
  const titik6 = [-5.447668143874803, 105.26006238980946];
  const titik7 = [-5.447118104170438, 105.2599926523809];
  const titik8 = [-5.446151528363159, 105.26004629656278];
  const titik9 = [-5.446087445934875, 105.26099579850691];
  const titik10 = [-5.446149193194442, 105.26188405772909];
  const titik11 = [-5.446403269066102, 105.26209408915147];
  const titik12 = [-5.445895117215355, 105.26211535815628]; // Titik kumpul (gathering point)
  const titik13 = [-5.44602218769574, 105.26005527219488];
  const titik14 = [-5.445646601750362, 105.26003862600173];
  const titik15 = [-5.44560242121029, 105.25960591279753];
  const titik16 = [-5.445474021508077, 105.25893187880915];
  
  // Pusat peta (rata-rata dari semua titik)
  const center = titik1;
  
  map = L.map('map', {
    center: center,
    zoom: 17,
    zoomControl: true,
    attributionControl: false,
    tap: true,
    touchZoom: true,
    dragging: true,
    scrollWheelZoom: true
  });

  // Tile Layer - OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  // Enable touch interactions for mobile
  map.dragging.enable();
  map.touchZoom.enable();
  
  if (map.tap) {
    map.tap.enable();
  }

  // Marker untuk 3 Titik Lokasi
  // TITIK 1
  const marker1 = L.marker(titik1, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#22c55e;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;transform:rotate(0deg);"><i class="fas fa-arrow-right"></i></div>`,
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker1.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;border-left:4px solid #ef4444;">
      <h3 style="margin:0 0 8px 0;color:#22c55e;">📍 Titik 1</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik1[0]}, ${titik1[1]}</p>
      <p style="margin:4px 0 0 0;font-size:12px;"><b style="color:#ef4444;">⚠️ Sangat Rawan</b></p>
    </div>
  `);

  // TITIK 2
  const marker2 = L.marker(titik2, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#3b82f6;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;transform:rotate(0deg);"><i class="fas fa-arrow-right"></i></div>`,
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker2.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;border-left:4px solid #eab308;">
      <h3 style="margin:0 0 8px 0;color:#3b82f6;">📍 Titik 2</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik2[0]}, ${titik2[1]}</p>
      <p style="margin:4px 0 0 0;font-size:12px;"><b style="color:#eab308;">⚠️ Rawan</b></p>
    </div>
  `);

  // TITIK 3
  const marker3 = L.marker(titik3, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#ef4444;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;transform:rotate(270deg);"><i class="fas fa-arrow-right"></i></div>`,
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker3.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;border-left:4px solid #eab308;">
      <h3 style="margin:0 0 8px 0;color:#ef4444;">📍 Titik 3</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik3[0]}, ${titik3[1]}</p>
      <p style="margin:4px 0 0 0;font-size:12px;"><b style="color:#eab308;">⚠️ Rawan</b></p>
    </div>
  `);

  // TITIK 4
  const marker4 = L.marker(titik4, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#06b6d4;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;transform:rotate(270deg);"><i class="fas fa-arrow-right"></i></div>`,
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker4.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;border-left:4px solid #eab308;">
      <h3 style="margin:0 0 8px 0;color:#06b6d4;">📍 Titik 4</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik4[0]}, ${titik4[1]}</p>
      <p style="margin:4px 0 0 0;font-size:12px;"><b style="color:#eab308;">⚠️ Rawan</b></p>
    </div>
  `);

  // TITIK 5
  const marker5 = L.marker(titik5, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#8b5cf6;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;transform:rotate(0deg);"><i class="fas fa-arrow-right"></i></div>`,
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker5.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;border-left:4px solid #eab308;">
      <h3 style="margin:0 0 8px 0;color:#8b5cf6;">📍 Titik 5</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik5[0]}, ${titik5[1]}</p>
      <p style="margin:4px 0 0 0;font-size:12px;"><b style="color:#eab308;">⚠️ Rawan</b></p>
    </div>
  `);

  // TITIK 6
  const marker6 = L.marker(titik6, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#ec4899;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;transform:rotate(270deg);"><i class="fas fa-arrow-right"></i></div>`,
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker6.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;border-left:4px solid #eab308;">
      <h3 style="margin:0 0 8px 0;color:#ec4899;">📍 Titik 6</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik6[0]}, ${titik6[1]}</p>
      <p style="margin:4px 0 0 0;font-size:12px;"><b style="color:#eab308;">⚠️ Rawan</b></p>
    </div>
  `);

  // TITIK 7
  const marker7 = L.marker(titik7, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#f59e0b;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;transform:rotate(270deg);"><i class="fas fa-arrow-right"></i></div>`,
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker7.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;border-left:4px solid #eab308;">
      <h3 style="margin:0 0 8px 0;color:#f59e0b;">📍 Titik 7</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik7[0]}, ${titik7[1]}</p>
      <p style="margin:4px 0 0 0;font-size:12px;"><b style="color:#eab308;">⚠️ Rawan</b></p>
    </div>
  `);

  // TITIK 8 (Junction point - splits into 2 routes)
  const marker8 = L.marker(titik8, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: '<div style="background:#ff6b6b;width:40px;height:40px;border-radius:50%;border:4px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:bold;"><i class="fas fa-code-branch"></i></div>',
      iconSize: [40, 40]
    })
  }).addTo(map);

  marker8.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;">
      <h3 style="margin:0 0 8px 0;color:#ff6b6b;">🔀 Titik 8 (Percabangan)</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik8[0]}, ${titik8[1]}</p>
      <p style="margin:4px 0 0 0;font-size:11px;"><i>Jalur terbagi menjadi 2 rute</i></p>
    </div>
  `);

  // TITIK 9 (Route 1 dari titik 8)
  const marker9 = L.marker(titik9, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#14b8a6;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;transform:rotate(0deg);"><i class="fas fa-arrow-right"></i></div>`,
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker9.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;border-left:4px solid #eab308;">
      <h3 style="margin:0 0 8px 0;color:#14b8a6;">📍 Titik 9 (Rute 1)</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik9[0]}, ${titik9[1]}</p>
      <p style="margin:4px 0 0 0;font-size:12px;"><b style="color:#eab308;">⚠️ Rawan</b></p>
    </div>
  `);

  // TITIK 10 (Route 1 dari titik 8)
  const marker10 = L.marker(titik10, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#14b8a6;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;transform:rotate(45deg);"><i class="fas fa-arrow-right"></i></div>`,
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker10.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;border-left:4px solid #eab308;">
      <h3 style="margin:0 0 8px 0;color:#14b8a6;">📍 Titik 10 (Rute 1)</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik10[0]}, ${titik10[1]}</p>
      <p style="margin:4px 0 0 0;font-size:12px;"><b style="color:#eab308;">⚠️ Rawan</b></p>
    </div>
  `);

  // TITIK 11 (Route 1 dari titik 8)
  const marker11 = L.marker(titik11, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#14b8a6;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;transform:rotate(270deg);"><i class="fas fa-arrow-right"></i></div>`,
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker11.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;border-left:4px solid #eab308;">
      <h3 style="margin:0 0 8px 0;color:#14b8a6;">📍 Titik 11 (Rute 1)</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik11[0]}, ${titik11[1]}</p>
      <p style="margin:4px 0 0 0;font-size:12px;"><b style="color:#eab308;">⚠️ Rawan</b></p>
    </div>
  `);

  // TITIK 12 (Gathering/Collection Point)
  const marker12 = L.marker(titik12, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: '<div style="background:#06b6d4;width:50px;height:50px;border-radius:50%;border:4px solid #ffeb3b;box-shadow:0 4px 16px rgba(255,235,59,0.6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;"><i class="fas fa-flag"></i></div>',
      iconSize: [50, 50]
    })
  }).addTo(map);

  marker12.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;background:#f0f9ff;border-left:4px solid #06b6d4;">
      <h3 style="margin:0 0 8px 0;color:#06b6d4;font-size:14px;font-weight:bold;">🚩 Titik 12 - TITIK KUMPUL</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik12[0]}, ${titik12[1]}</p>
      <p style="margin:4px 0 0 0;font-size:11px;"><i>Pusat evakuasi/gathering point</i></p>
    </div>
  `);

  // TITIK 13 (Route 2 dari titik 8)
  const marker13 = L.marker(titik13, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#a855f7;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;transform:rotate(270deg);"><i class="fas fa-arrow-right"></i></div>`,
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker13.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;border-left:4px solid #eab308;">
      <h3 style="margin:0 0 8px 0;color:#a855f7;">📍 Titik 13 (Rute 2)</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik13[0]}, ${titik13[1]}</p>
      <p style="margin:4px 0 0 0;font-size:12px;"><b style="color:#eab308;">⚠️ Rawan</b></p>
    </div>
  `);

  // TITIK 14 (Route 2 dari titik 8)
  const marker14 = L.marker(titik14, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#a855f7;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;transform:rotate(180deg);"><i class="fas fa-arrow-right"></i></div>`,
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker14.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;border-left:4px solid #22c55e;">
      <h3 style="margin:0 0 8px 0;color:#a855f7;">📍 Titik 14 (Rute 2)</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik14[0]}, ${titik14[1]}</p>
      <p style="margin:4px 0 0 0;font-size:12px;"><b style="color:#22c55e;">✅ Tidak Rawan</b></p>
    </div>
  `);

  // TITIK 15 (Route 2 dari titik 8)
  const marker15 = L.marker(titik15, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#a855f7;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;transform:rotate(180deg);"><i class="fas fa-arrow-right"></i></div>`,
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker15.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;border-left:4px solid #22c55e;">
      <h3 style="margin:0 0 8px 0;color:#a855f7;">📍 Titik 15 (Rute 2)</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik15[0]}, ${titik15[1]}</p>
      <p style="margin:4px 0 0 0;font-size:12px;"><b style="color:#22c55e;">✅ Tidak Rawan</b></p>
    </div>
  `);

  // TITIK 16 (Gathering/Collection Point - Second gathering point)
  const marker16 = L.marker(titik16, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: '<div style="background:#a855f7;width:50px;height:50px;border-radius:50%;border:4px solid #ffeb3b;box-shadow:0 4px 16px rgba(255,235,59,0.6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;"><i class="fas fa-flag"></i></div>',
      iconSize: [50, 50]
    })
  }).addTo(map);

  marker16.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;background:#faf5ff;border-left:4px solid #a855f7;">
      <h3 style="margin:0 0 8px 0;color:#a855f7;font-size:14px;font-weight:bold;">🚩 Titik 16 - TITIK KUMPUL</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik16[0]}, ${titik16[1]}</p>
      <p style="margin:4px 0 0 0;font-size:11px;"><i>Pusat evakuasi alternatif/gathering point</i></p>
    </div>
  `);

  // Jalur yang menghubungkan Titik 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 (percabangan)
  // Route 1: 8 → 9 → 10 → 11 → 12 (Gathering Point 1)
  // Route 2: 8 → 13 → 14 → 15 → 16 (Gathering Point 2)
  
  // Main route: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
  const mainRoute = [
    titik1,  // Titik 1 (Start)
    titik2,  // Titik 2
    titik3,  // Titik 3
    titik4,  // Titik 4
    titik5,  // Titik 5
    titik6,  // Titik 6
    titik7,  // Titik 7
    titik8   // Titik 8 (Junction/Percabangan)
  ];

  const mainRouteLine = L.polyline(mainRoute, {
    color: '#facc15',
    weight: 5,
    opacity: 0.8,
    dashArray: '10, 5'
  }).addTo(map).bindPopup('<b>Jalur Utama Evakuasi</b><br>Titik 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 (Percabangan)');

  // Route 1: 8 → 9 → 10 → 11 → 12 (Gathering Point)
  const route1 = [
    titik8,   // Junction
    titik9,   // Titik 9
    titik10,  // Titik 10
    titik11,  // Titik 11
    titik12   // Titik 12 (Gathering Point 1)
  ];

  const route1Line = L.polyline(route1, {
    color: '#14b8a6',
    weight: 5,
    opacity: 0.8,
    dashArray: '10, 5'
  }).addTo(map).bindPopup('<b>Rute 1</b><br>Jalur evakuasi dari Titik 8 → 9 → 10 → 11 → 12 (Titik Kumpul 1)');

  // Route 2: 8 → 13 → 14 → 15 → 16 (Gathering Point 2)
  const route2 = [
    titik8,   // Junction
    titik13,  // Titik 13
    titik14,  // Titik 14
    titik15,  // Titik 15
    titik16   // Titik 16 (Gathering Point 2)
  ];

  const route2Line = L.polyline(route2, {
    color: '#a855f7',
    weight: 5,
    opacity: 0.8,
    dashArray: '10, 5'
  }).addTo(map).bindPopup('<b>Rute 2</b><br>Jalur evakuasi dari Titik 8 → 13 → 14 → 15 → 16 (Titik Kumpul 2)');

  // Add decorative arrows to main route
  L.polylineDecorator(mainRouteLine, {
    patterns: [
      {
        offset: 0,
        repeat: 50,
        symbol: L.Symbol.arrowHead({
          pixelSize: 15,
          polygon: false,
          pathOptions: {
            stroke: true,
            weight: 3,
            color: '#facc15',
            fillOpacity: 1
          }
        })
      }
    ]
  }).addTo(map);

  // Add arrows to route 1
  L.polylineDecorator(route1Line, {
    patterns: [
      {
        offset: 0,
        repeat: 50,
        symbol: L.Symbol.arrowHead({
          pixelSize: 15,
          polygon: false,
          pathOptions: {
            stroke: true,
            weight: 3,
            color: '#14b8a6',
            fillOpacity: 1
          }
        })
      }
    ]
  }).addTo(map);

  // Add arrows to route 2
  L.polylineDecorator(route2Line, {
    patterns: [
      {
        offset: 0,
        repeat: 50,
        symbol: L.Symbol.arrowHead({
          pixelSize: 15,
          polygon: false,
          pathOptions: {
            stroke: true,
            weight: 3,
            color: '#a855f7',
            fillOpacity: 1
          }
        })
      }
    ]
  }).addTo(map);

  // Hide loading setelah semua elemen dimuat
  map.whenReady(function() {
    setTimeout(() => {
      const loading = document.getElementById('loading');
      if (loading) {
        loading.style.display = 'none';
      }
      map.invalidateSize();
    }, 500);
  });
}

// SWITCH MODE
function switchMode(mode) {
  if (currentMode === mode) return;
  
  document.getElementById('loading').style.display = 'block';
  
  // Hapus peta lama
  if (map) {
    map.remove();
  }
  
  // Update button state
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  currentMode = mode;
  
  setTimeout(() => {
    if (mode === 'static') {
      initStaticMap();
    } else {
      initLiveMap();
    }
    
    // Force map resize after mode switch
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 500);
  }, 300);
}

// FULLSCREEN
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// DOWNLOAD/PRINT MENU
function showDownloadMenu(event) {
  event.stopPropagation();
  const menu = document.getElementById('downloadMenu');
  menu.classList.toggle('show');
}

// Close download menu when clicking outside
document.addEventListener('click', function(event) {
  const menu = document.getElementById('downloadMenu');
  if (menu && menu.classList.contains('show')) {
    menu.classList.remove('show');
  }
});

// Download Map as Image
// Download Map as Image (PNG)
function downloadMapImage() {
  const loading = document.getElementById('loading');
  if (!loading) return;
  
  loading.style.display = 'flex';
  loading.querySelector('p').textContent = 'Mempersiapkan gambar...';
  
  // Load gambar peta dan convert ke PNG dengan watermark
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  img.onload = function() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set ukuran canvas sesuai gambar
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Gambar peta ke canvas
      ctx.drawImage(img, 0, 0);
      
      // Tambah watermark/info di bagian bawah
      const textHeight = 60;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(0, canvas.height - textHeight, canvas.width, textHeight);
      
      // Garis atas
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - textHeight);
      ctx.lineTo(canvas.width, canvas.height - textHeight);
      ctx.stroke();
      
      // Teks info
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('Peta Jalur Evakuasi Kelurahan Talang - Bandar Lampung 2026', 20, canvas.height - 30);
      
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial';
      ctx.fillText('© 2026 Peta Jalur Evakuasi Kelurahan Talang | Download: ' + new Date().toLocaleDateString('id-ID'), 20, canvas.height - 10);
      
      // Convert ke blob dan download
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Peta-Evakuasi-Talang-' + new Date().toISOString().split('T')[0] + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        loading.style.display = 'none';
        alert('Gambar peta berhasil diunduh sebagai PNG!');
      }, 'image/png');
      
    } catch (error) {
      console.error('Error creating image:', error);
      loading.style.display = 'none';
      alert('Gagal membuat gambar. Coba lagi.');
    }
  };
  
  img.onerror = function() {
    loading.style.display = 'none';
    alert('Gagal memuat gambar peta. Pastikan file peta/petaEvakuasiTalang.jpg tersedia.');
  };
  
  // Load gambar dari folder
  img.src = 'peta/petaEvakuasiTalang.jpg';
}

// EMERGENCY
function showEmergency() {
  alert('🚨 NOMOR DARURAT\n\n' +
        '🚒 Damkar (Pemadam Kebakaran): 113\n' +
        '🏥 Rumah Sakit Darurat: 118 / 119\n' +
        '👮 Polisi: 110\n' +
        '📞 Layanan Darurat Nasional: 112\n\n' +
        'Ikuti jalur evakuasi yang ditandai warna kuning menuju titik kumpul terdekat.');
}

// GET CURRENT LOCATION (GPS)
function getCurrentLocation() {
  if (currentMode === 'static') {
    alert('⚠️ Fitur GPS hanya tersedia di mode Peta Interaktif.\nSilakan beralih ke mode Peta Interaktif terlebih dahulu.');
    return;
  }
  
  if (!navigator.geolocation) {
    alert('❌ Browser Anda tidak mendukung fitur GPS/Geolocation.');
    return;
  }
  
  // Show loading
  const btn = event.target;
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mencari...';
  btn.disabled = true;
  
  navigator.geolocation.getCurrentPosition(
    function(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = position.coords.accuracy;
      
      // Remove existing user marker and circle
      if (userMarker) {
        map.removeLayer(userMarker);
      }
      if (userCircle) {
        map.removeLayer(userCircle);
      }
      
      // Add user marker
      userMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'user-marker',
          html: '<div style="background:#10b981;width:40px;height:40px;border-radius:50%;border:4px solid #fff;box-shadow:0 4px 16px rgba(16,185,129,0.5);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;animation:pulse 2s infinite;"><i class="fas fa-user"></i></div>',
          iconSize: [40, 40]
        })
      }).addTo(map);
      
      userMarker.bindPopup(`
        <div style="font-family:sans-serif;padding:8px;">
          <h3 style="margin:0 0 8px 0;color:#10b981;">📍 Posisi Anda</h3>
          <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
          <p style="margin:4px 0 0 0;font-size:11px;color:#666;">Akurasi: ±${Math.round(accuracy)}m</p>
        </div>
      `).openPopup();
      
      // Add accuracy circle
      userCircle = L.circle([lat, lng], {
        radius: accuracy,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.1,
        weight: 2
      }).addTo(map);
      
      // Center map to user location
      map.setView([lat, lng], 17);
      
      // Calculate distance to nearest evacuation point
      const titik1 = [-5.449776007968228, 105.25698213913022];
      const titik2 = [-5.449690565244476, 105.25818913319254];
      const titik3 = [-5.449615802848255, 105.25920837261762];
      const titik4 = [-5.448853664572905, 105.25913434553638];
      const titik5 = [-5.447636102742394, 105.2591182522831];
      const titik8 = [-5.446151528363159, 105.26004629656278];
      const titik12 = [-5.445895117215355, 105.26211535815628];
      
      const allPoints = [
        {name: 'Titik 1', coord: titik1},
        {name: 'Titik 2', coord: titik2},
        {name: 'Titik 3', coord: titik3},
        {name: 'Titik 4', coord: titik4},
        {name: 'Titik 5', coord: titik5},
        {name: 'Titik 8 (Percabangan)', coord: titik8},
        {name: 'Titik 12 (Titik Kumpul)', coord: titik12}
      ];
      
      let minDist = Infinity;
      let nearestPoint = 'Titik 1';
      
      allPoints.forEach(point => {
        const dist = calculateDistance(lat, lng, point.coord[0], point.coord[1]);
        if (dist < minDist) {
          minDist = dist;
          nearestPoint = point.name;
        }
      });
      
      setTimeout(() => {
        alert(`✅ Lokasi Ditemukan!\n\n` +
              `📍 Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}\n` +
              `📏 Akurasi: ±${Math.round(accuracy)} meter\n\n` +
              `🚶 Titik evakuasi terdekat: ${nearestPoint}\n` +
              `📐 Jarak: ${Math.round(minDist)} meter`);
      }, 500);
      
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    },
    function(error) {
      let errorMsg = '❌ Gagal mendapatkan lokasi.\n\n';
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMsg += 'Anda menolak izin akses lokasi.\nSilakan aktifkan izin lokasi di pengaturan browser.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg += 'Informasi lokasi tidak tersedia.';
          break;
        case error.TIMEOUT:
          errorMsg += 'Waktu pencarian lokasi habis.';
          break;
        default:
          errorMsg += 'Terjadi kesalahan: ' + error.message;
      }
      
      alert(errorMsg);
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // Distance in meters
}

// TOGGLE SIDEBAR
function toggleSidebar(event) {
  if (event) event.stopPropagation();
  
  const controlPanel = document.querySelector('.control-panel');
  const toggle = document.getElementById('sidebarToggle');
  
  if (!controlPanel || !toggle) return;
  
  controlPanel.classList.toggle('collapsed');
  
  if (controlPanel.classList.contains('collapsed')) {
    toggle.innerHTML = '<i class="fas fa-layer-group"></i>';
  } else {
    toggle.innerHTML = '<i class="fas fa-times"></i>';
  }
}

// TOGGLE INFO PANEL (Mobile)
function toggleInfo(event) {
  if (event) event.stopPropagation();
  
  const infoPanel = document.querySelector('.info-panel');
  const toggle = document.getElementById('infoToggle');
  
  if (!infoPanel || !toggle) return;
  
  infoPanel.classList.toggle('expanded');
  
  if (infoPanel.classList.contains('expanded')) {
    toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
  } else {
    toggle.innerHTML = '<i class="fas fa-info-circle"></i>';
  }
}

// Prevent panel clicks from propagating to map
function setupPanelClickHandlers() {
  const controlPanel = document.querySelector('.control-panel');
  const infoPanel = document.querySelector('.info-panel');
  
  if (controlPanel) {
    controlPanel.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  if (infoPanel) {
    infoPanel.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
}

// Auto-close panels when clicking map on mobile
function setupAutoClose() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;
  
  mapElement.addEventListener('click', function(event) {
    if (window.innerWidth <= 768) {
      const controlPanel = document.querySelector('.control-panel');
      const infoPanel = document.querySelector('.info-panel');
      const sidebarToggle = document.getElementById('sidebarToggle');
      const infoToggle = document.getElementById('infoToggle');
      
      // Close sidebar if open
      if (controlPanel && !controlPanel.classList.contains('collapsed')) {
        controlPanel.classList.add('collapsed');
        if (sidebarToggle) sidebarToggle.innerHTML = '<i class="fas fa-layer-group"></i>';
      }
      
      // Close info panel if expanded
      if (infoPanel && infoPanel.classList.contains('expanded')) {
        infoPanel.classList.remove('expanded');
        if (infoToggle) infoToggle.innerHTML = '<i class="fas fa-info-circle"></i>';
      }
    }
  });
}

// Make info panel header clickable on mobile
function setupInfoPanelHeader() {
  if (window.innerWidth <= 768) {
    const infoPanel = document.querySelector('.info-panel');
    if (infoPanel) {
      const header = infoPanel.querySelector('h3');
      if (header) {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function(e) {
          e.stopPropagation();
          toggleInfo();
        });
      }
    }
  }
}

// INIT
window.addEventListener('load', function() {
  // Set default state for mobile
  if (window.innerWidth <= 768) {
    const controlPanel = document.querySelector('.control-panel');
    if (controlPanel) controlPanel.classList.add('collapsed');
  }
  
  // Initialize map
  initStaticMap();
  
  // Setup event handlers after DOM is ready
  setTimeout(function() {
    setupPanelClickHandlers();
    setupAutoClose();
    setupInfoPanelHeader();
  }, 500);
  
  // Ensure map is properly sized on orientation change
  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      if (map) {
        map.invalidateSize();
      }
    }, 200);
  });
  
  // Ensure map is properly sized on window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (map) {
        map.invalidateSize();
      }
    }, 250);
  });
});
