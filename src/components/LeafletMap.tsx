import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Globe, MapPin } from 'lucide-react';

const LeafletSafe = L ? ((L as any).divIcon ? L : ((L as any).default || L)) : null;

interface LocationPreset {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface LeafletMapProps {
  currentCoords: { lat: number; lng: number };
  addressInput: string;
  setAddressInput: (val: string) => void;
  latInput: string;
  setLatInput: (val: string) => void;
  lngInput: string;
  setLngInput: (val: string) => void;
  triggerUpdate: (lugar: string, lat: number, lng: number) => void;
  handleSelectPreset: (preset: LocationPreset) => void;
  PERU_PRESETS: LocationPreset[];
  loading: boolean;
  onSearch: () => void;
}

export default function LeafletMap({
  currentCoords,
  addressInput,
  setAddressInput,
  latInput,
  setLatInput,
  lngInput,
  setLngInput,
  triggerUpdate,
  handleSelectPreset,
  PERU_PRESETS,
  loading,
  onSearch
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !LeafletSafe) return;

    // Custom premium pin with pulsing circle and map pin icon inside
    const customIcon = LeafletSafe.divIcon({
      html: `
        <div class="relative flex items-center justify-center" style="transform: translate(-16px, -32px);">
          <div class="absolute w-8 h-8 bg-red-400/40 rounded-full animate-ping"></div>
          <div class="relative bg-red-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>
      `,
      className: 'custom-leaflet-pin',
      iconSize: [32, 32],
      iconAnchor: [0, 0]
    });

    // Single-entry initialization guard
    if (!mapInstanceRef.current) {
      const map = LeafletSafe.map(mapContainerRef.current, {
        center: [currentCoords.lat, currentCoords.lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // High-quality OpenStreetMap style layer
      LeafletSafe.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(map);

      // Create interactive draggable marker
      const marker = LeafletSafe.marker([currentCoords.lat, currentCoords.lng], {
        icon: customIcon,
        draggable: true
      }).addTo(map);

      // Map click handler to relocate pin
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setLatInput(String(lat.toFixed(6)));
        setLngInput(String(lng.toFixed(6)));
        triggerUpdate(addressInput, lat, lng);
      });

      // Marker drag event handler
      marker.on('dragend', () => {
        const newLatLng = marker.getLatLng();
        setLatInput(String(newLatLng.lat.toFixed(6)));
        setLngInput(String(newLatLng.lng.toFixed(6)));
        triggerUpdate(addressInput, newLatLng.lat, newLatLng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    // Clean up when component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Sync internal Leaflet coordinates if modified externally via presets or search input
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const { lat, lng } = currentCoords;
      const markerPos = markerRef.current.getLatLng();
      
      // Update marker position
      markerRef.current.setLatLng([lat, lng]);
      
      // Fly or pan map center with small threshold to prevent infinite drag-render triggers
      const latDiff = Math.abs(markerPos.lat - lat);
      const lngDiff = Math.abs(markerPos.lng - lng);
      if (latDiff > 0.0001 || lngDiff > 0.0001) {
        mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());
      }
    }
  }, [currentCoords]);

  return (
    <div className="space-y-3" id="live-osm-leaflet-container">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
          Ubicación en OpenStreetMap (Leaflet interactivo)
        </label>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium flex items-center gap-1 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          Mapa Satélite / Vial Activo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="block text-[10px] text-slate-500 mb-0.5">Dirección / Referencia de Hecho</label>
          <div className="relative">
            <input
              type="text"
              value={addressInput}
              onChange={(e) => {
                setAddressInput(e.target.value);
                triggerUpdate(e.target.value, parseFloat(latInput) || -12.0463, parseFloat(lngInput) || -77.0427);
              }}
              className="w-full pl-2.5 pr-20 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-300 shadow-xs"
              placeholder="Ej: Av. Abancay Cuadra 5, Cercado de Lima"
              id="crime-address-input-osm"
            />
            <button
              type="button"
              onClick={onSearch}
              disabled={loading}
              className="absolute right-1 top-1 text-[10px] bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium py-1 px-2.5 rounded-md flex items-center gap-1 transition"
            >
              {loading ? (
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Localizar'
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 mb-0.5">Atajos de Ubicación Rápida</label>
          <select
            value=""
            onChange={(e) => {
              const preset = PERU_PRESETS[parseInt(e.target.value)];
              if (preset) handleSelectPreset(preset);
            }}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none text-slate-700"
            id="presets-dropdown-leaflet"
          >
            <option value="">-- Seleccionar Lugar --</option>
            {PERU_PRESETS.map((p, idx) => (
              <option key={p.name} value={idx}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Real Interactive Leaflet Canvas */}
      <div className="relative border border-slate-200 rounded-xl overflow-hidden shadow-xs z-10 bg-slate-50">
        <div 
          ref={mapContainerRef} 
          style={{ width: '100%', height: '240px' }} 
          id="leaflet-canvas-root"
          className="relative outline-none"
        />
        <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur z-[1000] pointer-events-none flex items-center gap-1 font-sans">
          <MapPin className="w-2.5 h-2.5 text-red-400" />
          Haga clic o arrastre la chincheta para posicionar
        </div>
      </div>

      {/* Lat/Lng readout */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="block text-xxs text-slate-400 font-medium mb-0.5">Latitud</span>
          <input
            type="text"
            disabled
            value={latInput}
            className="w-full px-2.5 py-1 text-xs border border-slate-100 bg-slate-50 rounded text-slate-500 font-mono shadow-inner cursor-not-allowed"
          />
        </div>
        <div>
          <span className="block text-xxs text-slate-400 font-medium mb-0.5">Longitud</span>
          <input
            type="text"
            disabled
            value={lngInput}
            className="w-full px-2.5 py-1 text-xs border border-slate-100 bg-slate-50 rounded text-slate-500 font-mono shadow-inner cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
