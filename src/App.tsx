/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CaseData, PrescripcionResult, PlazoProcesalResult, EtapaInvestigacion, ComplexidadStage } from './types';
import { calcularPrescripcion, calcularPlazoProcesal, defaultNewCase } from './utils/calculations';
import CaseAnalyzer from './components/CaseAnalyzer';
import CaseList from './components/CaseList';
import LegalAssistant from './components/LegalAssistant';
import NotificationDraft from './components/NotificationDraft';
import FigmaExporterModal from './components/FigmaExporterModal';
import { Scale, Clock, Sparkles, FileText, ChevronRight, Gavel, HelpCircle, Figma } from 'lucide-react';

const SEED_CASES: CaseData[] = [
  {
    id: 'CASO-2021-3419',
    fiscalResponsable: 'Dr. Manuel Benavides Lopez',
    denunciante: 'Supermercados del Sur S.A.',
    denunciado: 'Juan Castro Benitez',
    fechaHecho: '2021-04-12',
    delitoId: 'hurto_simple', // Max 3 years
    imputadoEdad: 35,
    imputadoFuncionarioPublico: false,
    fechaFormalizacion: '',
    etapaActual: EtapaInvestigacion.DILIGENCIAS_PRELIMINARES,
    fechaInicioEtapa: '2026-05-01',
    complejidad: ComplexidadStage.SIMPLE,
    esProrrogado: true,
    fechaCreacion: '2021-04-12',
    partes: [
      { id: 'p1-1', name: 'Supermercados del Sur S.A.', type: 'denunciante', documentType: 'RUC', documentNumber: '20102030405', notes: 'Empresa agraviada directa' },
      { id: 'p1-2', name: 'Juan Castro Benitez', type: 'imputado', documentType: 'DNI', documentNumber: '45678912', notes: 'Capturado in-flagranti' },
      { id: 'p1-3', name: 'Pedro Gomez Diaz (Seguridad)', type: 'agraviado', documentType: 'DNI', documentNumber: '10203040', notes: 'Personal de seguridad agredido físico' }
    ]
  },
  {
    id: 'CASO-2022-0805',
    fiscalResponsable: 'Dra. Patricia Valdivia Ruíz',
    denunciante: 'Procuraduría Anticorrupción',
    denunciado: 'Maria Alva Quispe (Ex-Tesorera)',
    fechaHecho: '2022-01-15',
    delitoId: 'peculado_doloso', // Max 8 years, anticorrupcion = duplicidad
    imputadoEdad: 68, // Reduccion por edad (Art. 81)
    imputadoFuncionarioPublico: true,
    fechaFormalizacion: '2024-02-15', // Suspende 1 año (Ley 31751)
    etapaActual: EtapaInvestigacion.INVESTIGACION_PREPARATORIA,
    fechaInicioEtapa: '2026-02-01',
    complejidad: ComplexidadStage.COMPLEJO,
    esProrrogado: false,
    fechaCreacion: '2022-01-15',
    partes: [
      { id: 'p2-1', name: 'Procuraduría Anticorrupción', type: 'denunciante', documentType: 'RUC', documentNumber: '20234567890', notes: 'Abogado técnico del Estado' },
      { id: 'p2-2', name: 'Maria Alva Quispe', type: 'imputado', documentType: 'DNI', documentNumber: '09876543', notes: 'Responsable directa de la custodia' },
      { id: 'p2-3', name: 'Carlos Mendoza Ruiz', type: 'denunciado', documentType: 'DNI', documentNumber: '23456781', notes: 'Asistente de tesorería y cómplice primario' },
      { id: 'p2-4', name: 'Municipalidad de Huara', type: 'agraviado', documentType: 'RUC', documentNumber: '20987654321', notes: 'Institución pública malversada' }
    ]
  },
  {
    id: 'CASO-2020-0112',
    fiscalResponsable: 'Dr. Christian Torres Prado',
    denunciante: 'Gobierno Regional del Callao',
    denunciado: 'Roberto Rojas Perez (Ex-Gerente)',
    fechaHecho: '2020-03-10',
    delitoId: 'colusion_simple', // Max 6 years, anticorrupcion = duplicidad
    imputadoEdad: 42,
    imputadoFuncionarioPublico: true,
    fechaFormalizacion: '',
    etapaActual: EtapaInvestigacion.DILIGENCIAS_PRELIMINARES,
    fechaInicioEtapa: '2026-04-15',
    complejidad: ComplexidadStage.COMPLEJO,
    esProrrogado: false,
    fechaCreacion: '2020-03-10',
    partes: [
      { id: 'p3-1', name: 'Gobierno Regional del Callao', type: 'denunciante', documentType: 'RUC', documentNumber: '20555666777', notes: 'Denuncia interpuesta por Procuraduría Regional' },
      { id: 'p3-2', name: 'Roberto Rojas Perez', type: 'imputado', documentType: 'DNI', documentNumber: '12345678', notes: 'Ex Gerente de Infraestructura' },
      { id: 'p3-3', name: 'Consorcio Constructor Vial Callao S.A.', type: 'denunciado', documentType: 'RUC', documentNumber: '20888999111', notes: 'Contratista beneficiario de obra' },
      { id: 'p3-4', name: 'El Estado Peruano', type: 'agraviado', documentType: 'RUC', documentNumber: '20000000001', notes: 'Erario nacional perjudicado' }
    ]
  }
];

export default function App() {
  const [cases, setCases] = useState<CaseData[]>(SEED_CASES);
  const [selectedCase, setSelectedCase] = useState<CaseData>(SEED_CASES[0]);

  // Tab controller for the right column panel: AI vs Automatic Cédula Notificación
  const [activeRightTab, setActiveRightTab] = useState<'ai' | 'cedula'>('ai');

  // Figma modal controller
  const [isFigmaModalOpen, setIsFigmaModalOpen] = useState(false);

  // Real-time local time clock
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Clock tick
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('es-PE', { 
        timeZone: 'America/Lima',
        hour12: false, 
        weekday: 'short',
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync to/from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem('mpfn_fiscal_cases');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CaseData[];
        
        // Transparent schema migration: make sure old entries match current structure
        let migrated = Array.isArray(parsed) ? parsed : [];
        let hasModifiedAny = false;

        migrated = migrated.map(c => {
          if (!c) return c;
          let needsChange = false;
          const updatedCase = { ...c };

          // 1. Ensure partes array exists
          if (!updatedCase.partes || !Array.isArray(updatedCase.partes)) {
            const initializedParties: any[] = [];
            if (updatedCase.denunciante) {
              initializedParties.push({
                id: `migrated-denunciante-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                name: updatedCase.denunciante,
                type: 'denunciante',
                documentType: 'DNI',
                documentNumber: '',
                notes: 'Migrado de registro previo'
              });
            }
            if (updatedCase.denunciado) {
              const devs = String(updatedCase.denunciado).split(',');
              devs.forEach((dName, dIdx) => {
                const trimmed = dName.trim();
                if (trimmed) {
                  initializedParties.push({
                    id: `migrated-denunciado-${Date.now()}-${dIdx}-${Math.floor(Math.random() * 1000)}`,
                    name: trimmed,
                    type: 'imputado',
                    documentType: 'DNI',
                    documentNumber: '',
                    notes: 'Migrado de registro previo'
                  });
                }
              });
            }
            updatedCase.partes = initializedParties;
            needsChange = true;
          }

          // 2. Ensure attachments array exists
          if (!updatedCase.attachments || !Array.isArray(updatedCase.attachments)) {
            updatedCase.attachments = [];
            needsChange = true;
          }

          if (needsChange) {
            hasModifiedAny = true;
          }
          return updatedCase;
        }).filter(Boolean);

        // Save back clean migrated list if modifications were introduced
        if (hasModifiedAny && migrated.length > 0) {
          localStorage.setItem('mpfn_fiscal_cases', JSON.stringify(migrated));
        }

        setCases(migrated);
        if (migrated.length > 0) {
          setSelectedCase(migrated[0]);
        } else {
          setCases(SEED_CASES);
          setSelectedCase(SEED_CASES[0]);
        }
      } catch (err) {
        console.error("No se pudo cargar de LocalStorage, resembrando", err);
        setCases(SEED_CASES);
        setSelectedCase(SEED_CASES[0]);
      }
    } else {
      localStorage.setItem('mpfn_fiscal_cases', JSON.stringify(SEED_CASES));
      setCases(SEED_CASES);
      setSelectedCase(SEED_CASES[0]);
    }
  }, []);

  // Derivate calculations synchronously during render to eliminate any possibility of infinite loops
  const currentPrescripcion = selectedCase ? calcularPrescripcion(selectedCase) : null;
  const currentPlazo = selectedCase ? calcularPlazoProcesal(selectedCase) : null;

  const handleSelectCase = (id: string) => {
    const match = cases.find(c => c.id === id);
    if (match) {
      setSelectedCase(match);
    }
  };

  const handleNewCase = () => {
    setSelectedCase(defaultNewCase());
  };

  const handleDeleteCase = (id: string) => {
    const confirmed = window.confirm(`¿Está seguro de eliminar el registro de la carpeta ${id}?`);
    if (!confirmed) return;

    const filtered = cases.filter(c => c.id !== id);
    setCases(filtered);
    localStorage.setItem('mpfn_fiscal_cases', JSON.stringify(filtered));
    
    if (selectedCase?.id === id) {
      if (filtered.length > 0) {
        setSelectedCase(filtered[0]);
      } else {
        setSelectedCase(defaultNewCase());
      }
    }
  };

  const handleSaveCase = (updatedCase: CaseData) => {
    const exists = cases.some(c => c.id === updatedCase.id);
    let newCasesList: CaseData[] = [];

    if (exists) {
      // Update
      newCasesList = cases.map(c => c.id === updatedCase.id ? updatedCase : c);
      alert(`Carpeta fiscal ${updatedCase.id} actualizada correctamente.`);
    } else {
      // Inset
      newCasesList = [updatedCase, ...cases];
      alert(`Nueva carpeta fiscal ${updatedCase.id} registrada e incorporada al sistema.`);
    }

    setCases(newCasesList);
    localStorage.setItem('mpfn_fiscal_cases', JSON.stringify(newCasesList));
    setSelectedCase(updatedCase);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 p-4 lg:p-6 flex flex-col font-sans">
      
      {/* State Administration Header */}
      <header className="bg-slate-900 text-white rounded-2xl p-6 mb-6 shadow-md border-b-4 border-amber-500 relative overflow-hidden" id="dashboard-navbar">
        {/* Subtle background graphic design pattern representing stability/justice */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-2 select-none">
          <Gavel className="w-80 h-80 text-white" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-amber-500 text-slate-950 text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-md tracking-wider">
                Sistema Integrado de Gestión Fiscal
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                v1.8.2-Perú
              </span>
            </div>
            
            <h1 className="text-xl lg:text-2xl font-black tracking-tight" id="main-header-title">
              MINISTERIO PÚBLICO • FISCALÍA DE LA NACIÓN
            </h1>
            <p className="text-xs lg:text-sm text-slate-350 font-medium">
              Módulo Web de Control Procesal y Alertas Inteligentes de Prescripción y Plazos de Investigación
            </p>
          </div>

          {/* Time & Agency Metadata / Figma Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setIsFigmaModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-3 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all border border-rose-500/20 tracking-wide shrink-0 cursor-pointer"
              id="export-figma-btn"
            >
              <Figma className="w-4 h-4 fill-white shrink-0" />
              <span>Exportar a Figma</span>
            </button>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 flex items-center gap-3.5 shadow-inner">
            <div className="text-right shrink-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Reloj Oficial Judicial</div>
              <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5" id="lima-clock">
                <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                {currentTime || 'Sincronizando hora...'}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-700"></div>
            <div className="text-[10px] leading-tight text-slate-300 font-medium max-w-[130px]">
              Distrito Fiscal Perú<br />
              <b>Área Penal Ordinaria</b>
            </div>
          </div>
        </div>
      </div>
    </header>

      {/* Main Workspace split */}
      <main className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 items-start">
        
        {/* Left Span: Analyzer and parameters */}
        <section className="xl:col-span-7 space-y-6">
          <CaseAnalyzer 
            caseData={selectedCase}
            onChange={setSelectedCase}
            onSave={handleSaveCase}
          />
        </section>

        {/* Right Span: Dynamic Output analysis tools */}
        <section className="xl:col-span-5 h-full flex flex-col space-y-6">
          
          {/* Action Tabs for outputs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
            
            {/* Tabs Header */}
            <div className="border-b border-slate-200 bg-slate-50 p-1 flex">
              <button
                onClick={() => setActiveRightTab('ai')}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-1.5 transition ${
                  activeRightTab === 'ai' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id="tab-ai-btn"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Informe de Acción Penal de IA
              </button>
              <button
                onClick={() => setActiveRightTab('cedula')}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-1.5 transition ${
                  activeRightTab === 'cedula' 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id="tab-cedula-btn"
              >
                <FileText className="w-3.5 h-3.5" />
                Cédula de Alerta de Plazos
              </button>
            </div>

            {/* Render selected output workspace */}
            <div className="flex-1">
              {selectedCase && currentPrescripcion && currentPlazo ? (
                activeRightTab === 'ai' ? (
                  <LegalAssistant 
                    currentCase={selectedCase}
                    calculationResult={currentPrescripcion}
                  />
                ) : (
                  <NotificationDraft 
                    currentCase={selectedCase}
                    prescripcion={currentPrescripcion}
                    plazo={currentPlazo}
                  />
                )
              ) : (
                <div className="p-10 text-center text-slate-400 flex flex-col justify-center items-center h-full min-h-[350px]">
                  <HelpCircle className="w-10 h-10 text-slate-200 mb-2" />
                  <p className="text-xs font-sans">Selecciona o califica un caso en el panel izquierdo para iniciar el diagnóstico procesal inteligente.</p>
                </div>
              )}
            </div>

          </div>

        </section>

      </main>

      {/* Full-width bottom section: Saved cases list tray */}
      <footer className="mt-6">
        <CaseList 
          cases={cases}
          selectedCaseId={selectedCase?.id}
          onSelectCase={handleSelectCase}
          onDeleteCase={handleDeleteCase}
          onNewCase={handleNewCase}
        />
      </footer>

      {/* Figma Exporter and Interactive Prototyping Modal */}
      {selectedCase && currentPrescripcion && currentPlazo && (
        <FigmaExporterModal
          isOpen={isFigmaModalOpen}
          onClose={() => setIsFigmaModalOpen(false)}
          currentCase={selectedCase}
          prescripcion={currentPrescripcion}
          plazo={currentPlazo}
        />
      )}

    </div>
  );
}
