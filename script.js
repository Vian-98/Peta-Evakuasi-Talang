let map;
let currentMode = 'static';
let userMarker = null;
let userCircle = null;

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
  L.imageOverlay('peta/peta_evakuasi_talang_2026.png', bounds).addTo(map);

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
  
  setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
    map.invalidateSize();
  }, 1000);
}

// INISIALISASI PETA INTERAKTIF (LIVE)
function initLiveMap() {
  // TITIK KOORDINAT LOKASI
  const titik1 = [-5.449776007968228, 105.25698213913022];
  const titik2 = [-5.449690565244476, 105.25818913319254];
  const titik3 = [-5.449615802848255, 105.25920837261762];
  
  // Pusat peta (rata-rata dari 3 titik)
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
      html: '<div style="background:#22c55e;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;"><i class="fas fa-arrow-right"></i></div>',
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker1.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;">
      <h3 style="margin:0 0 8px 0;color:#22c55e;">📍 Titik 1</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik1[0]}, ${titik1[1]}</p>
    </div>
  `);

  // TITIK 2
  const marker2 = L.marker(titik2, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: '<div style="background:#3b82f6;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;"><i class="fas fa-arrow-right"></i></div>',
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker2.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;">
      <h3 style="margin:0 0 8px 0;color:#3b82f6;">📍 Titik 2</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik2[0]}, ${titik2[1]}</p>
    </div>
  `);

  // TITIK 3
  const marker3 = L.marker(titik3, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: '<div style="background:#ef4444;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;"><i class="fas fa-arrow-right"></i></div>',
      iconSize: [36, 36]
    })
  }).addTo(map);

  marker3.bindPopup(`
    <div style="font-family:sans-serif;padding:8px;">
      <h3 style="margin:0 0 8px 0;color:#ef4444;">📍 Titik 3</h3>
      <p style="margin:0;font-size:12px;"><b>Koordinat:</b><br>${titik3[0]}, ${titik3[1]}</p>
    </div>
  `);

  // Polygon simulasi area rawan (contoh)
  const floodZones = [
    {
      coords: [
        [-5.428, 105.261],
        [-5.428, 105.264],
        [-5.431, 105.264],
        [-5.431, 105.261]
      ],
      color: '#eab308',
      label: 'Zona Rawan'
    },
    {
      coords: [
        [-5.426, 105.262],
        [-5.426, 105.263],
        [-5.427, 105.263],
        [-5.427, 105.262]
      ],
      color: '#f97316',
      label: 'Zona Sangat Rawan'
    }
  ];

  floodZones.forEach(zone => {
    L.polygon(zone.coords, {
      color: zone.color,
      fillColor: zone.color,
      fillOpacity: 0.4,
      weight: 2
    }).addTo(map).bindPopup(`<b>${zone.label}</b>`);
  });

  // Jalur yang menghubungkan Titik 1 → 2 → 3
  const evacuationRoute = [
    titik1,  // Titik 1 (Start)
    titik2,  // Titik 2 (Middle)
    titik3   // Titik 3 (End)
  ];

  const routeLine = L.polyline(evacuationRoute, {
    color: '#facc15',
    weight: 5,
    opacity: 0.8,
    dashArray: '10, 5'
  }).addTo(map).bindPopup('<b>Jalur Evakuasi</b><br>Menghubungkan Titik 1 → 2 → 3');

  // Tambahkan panah pada jalur evakuasi
  L.polylineDecorator(routeLine, {
    patterns: [
      {
        offset: '10%',
        repeat: 100,
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

  setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
  }, 1000);
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

// EMERGENCY
function showEmergency() {
  alert('🚨 NOMOR DARURAT\n\n' +
        '112 - Layanan Darurat Nasional\n' +
        '021-XXX-XXXX - Posko Banjir Kelurahan Talang\n\n' +
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
      
      const dist1 = calculateDistance(lat, lng, titik1[0], titik1[1]);
      const dist2 = calculateDistance(lat, lng, titik2[0], titik2[1]);
      const dist3 = calculateDistance(lat, lng, titik3[0], titik3[1]);
      
      const minDist = Math.min(dist1, dist2, dist3);
      let nearestPoint = 'Titik 1';
      if (minDist === dist2) nearestPoint = 'Titik 2';
      if (minDist === dist3) nearestPoint = 'Titik 3';
      
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
