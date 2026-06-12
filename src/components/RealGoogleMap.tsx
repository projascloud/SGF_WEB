import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Globe, Search, Loader2 } from 'lucide-react';

interface LocationPreset {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface RealGoogleMapProps {
  API_KEY: string;
  currentCoords: { lat: number; lng: number };
  addressInput: string;
  setAddressInput: (val: string) => void;
  latInput: string;
  setLatInput: (val: string) => void;
  lngInput: string;
  setLngInput: (val: string) => void;
  triggerUpdate: (lugar: string, lat: number, lng: number) => void;
  handleSelectPreset: (preset: LocationPreset) => void;
  handleMapClick: (e: any) => void;
  PERU_PRESETS: LocationPreset[];
  loading: boolean;
  onSearch: () => void;
}

export default function RealGoogleMap({
  API_KEY,
  currentCoords,
  addressInput,
  setAddressInput,
  latInput,
  setLatInput,
  lngInput,
  setLngInput,
  triggerUpdate,
  handleSelectPreset,
  handleMapClick,
  PERU_PRESETS,
  loading,
  onSearch
}: RealGoogleMapProps) {
  return (
    <div className="space-y-3" id="live-google-maps-container">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-1">
        <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
          Ubicación en Google Maps (Mapa Activo)
        </label>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          Servicio de Google Live
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
              className="w-full pl-2.5 pr-20 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              placeholder="Ej: Av. Abancay Cuadra 5, Cercado de Lima"
              id="crime-address-input"
            />
            <button
              type="button"
              onClick={onSearch}
              disabled={loading}
              className="absolute right-1 top-1 text-[10px] bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium py-1 px-2.5 rounded-md flex items-center gap-1 transition"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
              Localizar
            </button>
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 mb-0.5">Puntos de Referencia Rápidos</label>
          <select
            value=""
            onChange={(e) => {
              const preset = PERU_PRESETS[parseInt(e.target.value)];
              if (preset) handleSelectPreset(preset);
            }}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"
            id="presets-dropdown-live"
          >
            <option value="">-- Seleccionar Atajo --</option>
            {PERU_PRESETS.map((p, idx) => (
              <option key={p.name} value={idx}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Real Dynamic Map */}
      <div className="relative border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <APIProvider apiKey={API_KEY} version="weekly">
          <div style={{ width: '100%', height: '240px' }} id="gmp-canvas-root">
            <Map
              defaultCenter={currentCoords}
              center={currentCoords}
              defaultZoom={15}
              gestureHandling={'greedy'}
              onClick={handleMapClick}
              clickableIcons={true}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
            >
              <AdvancedMarker position={currentCoords}>
                <Pin background="#ef4444" glyphColor="#ffffff" borderColor="#b91c1c" />
              </AdvancedMarker>
            </Map>
          </div>
        </APIProvider>
        <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur">
          Haga clic en el mapa para ajustar la chincheta
        </div>
      </div>

      {/* Coords Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="block text-xxs text-slate-400">Latitud</span>
          <input
            type="text"
            disabled
            value={latInput}
            className="w-full px-2.5 py-1 text-xs border border-slate-100 bg-slate-50 rounded text-slate-500 font-mono"
          />
        </div>
        <div>
          <span className="block text-xxs text-slate-400">Longitud</span>
          <input
            type="text"
            disabled
            value={lngInput}
            className="w-full px-2.5 py-1 text-xs border border-slate-100 bg-slate-50 rounded text-slate-500 font-mono"
          />
        </div>
      </div>
    </div>
  );
}

