import React, { useState, useEffect, Suspense } from 'react';
import { Globe, MapPin, Loader2 } from 'lucide-react';

const LeafletMap = React.lazy(() => import('./LeafletMap'));

// Error boundary to prevent any Leaflet-level errors from breaking the page
class MapsErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  props!: { children: React.ReactNode };
  state = { hasError: false, error: null as any };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("MapsErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || String(this.state.error);
      return (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg font-medium space-y-2">
          <div className="font-semibold text-amber-950">⚠️ Hubo un inconveniente al inicializar OpenStreetMap con Leaflet.</div>
          <div className="text-[10px] font-mono text-amber-700 bg-amber-100/40 p-2 rounded max-h-24 overflow-auto border border-amber-200">
            Detalle del error: {errorMsg}
          </div>
          <div className="text-xxs text-slate-500 font-normal leading-relaxed">
            Se activó el modo de georreferenciación manual segura. Puede continuar ingresando y sincronizando las coordenadas manualmente a continuación sin perder funcionalidad.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface LocationPreset {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const PERU_PRESETS: LocationPreset[] = [
  { name: 'Palacio de Justicia, Lima', address: 'Av. Paseo de la República S/N, Cercado de Lima', lat: -12.055819, lng: -77.033671 },
  { name: 'Fiscalía de la Nación, Lima', address: 'Av. Abancay 491, Cercado de Lima', lat: -12.047467, lng: -77.027582 },
  { name: 'Aeropuerto Jorge Chávez, Callao', address: 'Av. Elmer Faucett, Callao', lat: -12.022353, lng: -77.108428 },
  { name: 'Plaza Mayor de Cusco', address: 'Portal de Panes, Cusco', lat: -13.516002, lng: -71.978546 },
  { name: 'Plaza de Armas de Arequipa', address: 'General Morán 110, Arequipa', lat: -16.401243, lng: -71.536961 },
  { name: 'Plaza de Armas de Trujillo', address: 'Diego de Almagro S/N, Trujillo', lat: -8.111816, lng: -79.028713 },
  { name: 'Comisaría Alfonso Ugarte, Lima', address: 'Av. Alfonso Ugarte 1200, Breña', lat: -12.054415, lng: -77.045095 }
];

interface CrimeSceneMapProps {
  lugarHechos: string;
  lugarLatLng?: { lat: number; lng: number };
  onLocationChange: (lugar: string, latLng: { lat: number; lng: number }) => void;
}

export default function CrimeSceneMap({ lugarHechos, lugarLatLng, onLocationChange }: CrimeSceneMapProps) {
  const currentCoords = {
    lat: isNaN(parseFloat(String(lugarLatLng?.lat))) ? -12.046374 : parseFloat(String(lugarLatLng?.lat)),
    lng: isNaN(parseFloat(String(lugarLatLng?.lng))) ? -77.042793 : parseFloat(String(lugarLatLng?.lng)),
  };

  const [addressInput, setAddressInput] = useState(lugarHechos || 'Centro de Lima, Perú');
  const [latInput, setLatInput] = useState(String(currentCoords.lat));
  const [lngInput, setLngInput] = useState(String(currentCoords.lng));
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

  useEffect(() => {
    if (lugarHechos) {
      setAddressInput(lugarHechos);
    }
  }, [lugarHechos]);

  useEffect(() => {
    setLatInput(String(currentCoords.lat));
    setLngInput(String(currentCoords.lng));
  }, [currentCoords.lat, currentCoords.lng]);

  const triggerUpdate = (lugar: string, lat: number, lng: number) => {
    onLocationChange(lugar, { lat, lng });
  };

  const handleSelectPreset = (preset: LocationPreset) => {
    setAddressInput(preset.address);
    setLatInput(String(preset.lat.toFixed(6)));
    setLngInput(String(preset.lng.toFixed(6)));
    setStatusMsg({ type: 'success', text: `Ubicación cargada: ${preset.name}` });
    triggerUpdate(preset.name, preset.lat, preset.lng);
  };

  // Real-time OSM Nominatim geocoding lookup
  const handleGeocodeLookup = async () => {
    if (!addressInput.trim()) {
      setStatusMsg({ type: 'error', text: 'Por favor, ingrese una dirección antes de buscar.' });
      return;
    }
    setIsLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      // Step 1: Pre-match in local presets for native latency-free matching
      const searchLower = addressInput.toLowerCase();
      const localMatch = PERU_PRESETS.find(p => 
        p.name.toLowerCase().includes(searchLower) || p.address.toLowerCase().includes(searchLower)
      );

      if (localMatch) {
        setLatInput(String(localMatch.lat.toFixed(6)));
        setLngInput(String(localMatch.lng.toFixed(6)));
        triggerUpdate(localMatch.name, localMatch.lat, localMatch.lng);
        setStatusMsg({ type: 'success', text: `Encontrado (Atajo Perú): ${localMatch.name}` });
        setIsLoading(false);
        return;
      }

      // Step 2: Live seek in OSM Nominatim geared for Perù
      const encodedQuery = encodeURIComponent(addressInput + ", Peru");
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1`;
      
      const response = await fetch(url, {
        headers: { 
          'Accept-Language': 'es',
          'User-Agent': 'FiscaliaCaseAnalyzerApplet/1.0' // friendly user-agent representation
        }
      });
      
      if (!response.ok) {
        throw new Error('Servicio de búsqueda OSM no disponible de momento.');
      }

      const results = await response.json();
      if (results && results.length > 0) {
        const topResult = results[0];
        const newLat = parseFloat(topResult.lat);
        const newLng = parseFloat(topResult.lon);
        
        setLatInput(String(newLat.toFixed(6)));
        setLngInput(String(newLng.toFixed(6)));
        triggerUpdate(addressInput, newLat, newLng);
        setStatusMsg({ 
          type: 'success', 
          text: `Ubicación geocodificada con éxito en OpenStreetMap.` 
        });
      } else {
        setStatusMsg({ 
          type: 'error', 
          text: 'No se encontraron coordenadas exactas en Perú para esta dirección. Puede arrastrar la chincheta libremente.' 
        });
      }
    } catch (error) {
      console.error('Error finding address coordinates:', error);
      setStatusMsg({ 
        type: 'error', 
        text: 'Error de conexión con el servicio del mapa. Puede ingresar coordenadas interactivamente o arrastrando la chincheta.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const mapCoords = {
    lat: isNaN(parseFloat(latInput)) ? currentCoords.lat : parseFloat(latInput),
    lng: isNaN(parseFloat(lngInput)) ? currentCoords.lng : parseFloat(lngInput)
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3" id="crime-scene-map-card">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-red-500 animate-pulse" />
          Ubicación Georreferenciada del Hecho Imputado
        </label>
        <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 border border-blue-100">
          <Globe className="w-3 h-3 text-blue-500 animate-spin-slow" />
          Servicio OpenStreetMap Libre
        </span>
      </div>

      {statusMsg.text && (
        <div className={`p-2.5 text-xs rounded-lg transition duration-200 ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
            : 'bg-amber-50 text-amber-800 border border-amber-100'
        }`}>
          {statusMsg.type === 'success' ? '✓ ' : '⚠ '}
          {statusMsg.text}
        </div>
      )}

      <MapsErrorBoundary>
        <Suspense fallback={
          <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-center h-[240px] text-xs text-slate-500 font-medium animate-pulse gap-2">
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            Inicializando OpenStreetMap con Leaflet...
          </div>
        }>
          <LeafletMap
            currentCoords={mapCoords}
            addressInput={addressInput}
            setAddressInput={setAddressInput}
            latInput={latInput}
            setLatInput={setLatInput}
            lngInput={lngInput}
            setLngInput={setLngInput}
            triggerUpdate={triggerUpdate}
            handleSelectPreset={handleSelectPreset}
            PERU_PRESETS={PERU_PRESETS}
            loading={isLoading}
            onSearch={handleGeocodeLookup}
          />
        </Suspense>
      </MapsErrorBoundary>

      {/* Manual Coordinates Input Option */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <span className="block text-[10px] text-slate-500 font-medium mb-1">Ajuste Manual Latitud</span>
          <input
            type="number"
            step="any"
            value={latInput}
            onChange={(e) => {
              setLatInput(e.target.value);
              const numLat = parseFloat(e.target.value);
              if (!isNaN(numLat)) {
                triggerUpdate(addressInput, numLat, mapCoords.lng);
              }
            }}
            className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono shadow-inner"
            placeholder="-12.0463"
          />
        </div>
        <div>
          <span className="block text-[10px] text-slate-500 font-medium mb-1">Ajuste Manual Longitud</span>
          <input
            type="number"
            step="any"
            value={lngInput}
            onChange={(e) => {
              setLngInput(e.target.value);
              const numLng = parseFloat(e.target.value);
              if (!isNaN(numLng)) {
                triggerUpdate(addressInput, mapCoords.lat, numLng);
              }
            }}
            className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono shadow-inner"
            placeholder="-77.0427"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              const lat = parseFloat(latInput);
              const lng = parseFloat(lngInput);
              if (!isNaN(lat) && !isNaN(lng)) {
                triggerUpdate(addressInput, lat, lng);
                setStatusMsg({ type: 'success', text: 'Coordenadas consolidadas y guardadas.' });
              } else {
                setStatusMsg({ type: 'error', text: 'Coordenadas ingresadas inválidas.' });
              }
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg font-medium transition cursor-pointer"
          >
            Sincronizar Manual
          </button>
        </div>
      </div>
    </div>
  );
}
