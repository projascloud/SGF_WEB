import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<Props, State> {
  props!: Props;
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error at root:", error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('mpfn_fiscal_cases');
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full bg-slate-800 border-t-4 border-amber-500 rounded-2xl p-6 shadow-2xl relative overflow-hidden" id="root-error-panel">
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none translate-x-8 translate-y-2 select-none text-[150px]">
              ⚖️
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-amber-500 text-slate-950 text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                Ministerio Público de la Nación
              </span>
              <span className="bg-slate-700 text-[9px] text-slate-300 font-mono px-1.5 py-0.5 rounded border border-slate-700">
                Error de Arranque
              </span>
            </div>

            <h2 className="text-xl font-extrabold tracking-tight mb-2">
              Inconveniente en el Módulo de Control Procesal
            </h2>
            
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Para asegurar un desempeño óptimo y la integridad de los plazos de prescripción procesal, el sistema ha suspendido el arranque debido a una incompatibilidad de registros en la caché local o un problema de renderizado del mapa.
            </p>

            {this.state.error && (
              <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-700/60 mb-5">
                <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">
                  Detalle Técnico del Error:
                </div>
                <pre className="text-[10px] font-mono text-slate-400 overflow-auto max-h-24 leading-normal whitespace-pre-wrap">
                  {this.state.error.message || String(this.state.error)}
                </pre>
              </div>
            )}

            <div className="space-y-2.5">
              <button
                onClick={this.handleReset}
                className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                id="reset-local-cache-btn"
              >
                🗑️ Restaurar Base de Datos / Limpiar Caché
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-slate-750 hover:bg-slate-700 text-white font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer border border-slate-700"
                id="retry-reload-btn"
              >
                Reintentar Carga Básica
              </button>
            </div>

            <div className="mt-5 text-center text-[9px] text-slate-500">
              Módulo Web de Control Procesal • Licencia Institucional MPFN
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);
