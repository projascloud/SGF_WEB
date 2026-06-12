/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CaseData, 
  CrimeDefinition, 
  PrescripcionResult, 
  PlazoProcesalResult,
  EtapaInvestigacion,
  ComplexidadStage,
  AlertLevel
} from '../types';
import { 
  COMMON_DELITOS, 
  calcularPrescripcion, 
  calcularPlazoProcesal,
  defaultNewCase,
  formatToDMY,
  formatRemainingTimeToDMY
} from '../utils/calculations';
import { 
  Scale, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  Save,
  Info,
  ChevronRight,
  FileText,
  MapPin,
  ClipboardList
} from 'lucide-react';
import CrimeSceneMap from './CrimeSceneMap';
import CaseDocumentVisualizer from './CaseDocumentVisualizer';
import CasePartiesManager from './CasePartiesManager';

const PERU_POLICE_DEPARTMENTS = [
  "Comisaría PNP Alfonso Ugarte (Lima Centro)",
  "Comisaría PNP Cotabambas (Cercado de Lima)",
  "Comisaría PNP Petit Thouars (Lima)",
  "Comisaría PNP Miraflores (Lima)",
  "Comisaría PNP San Isidro (Lima)",
  "Comisaría PNP Barranco (Lima)",
  "Comisaría PNP Santiago de Surco (Lima)",
  "Comisaría PNP San Borja (Lima)",
  "Comisaría PNP Lince (Lima)",
  "Comisaría PNP La Victoria (Lima)",
  "Comisaría PNP Sol de Oro (Los Olivos)",
  "Comisaría PNP Laura Caller (Los Olivos)",
  "Comisaría PNP Callao Centro (Callao)",
  "Comisaría PNP Bellavista (Callao)",
  "Comisaría PNP Chorrillos (Lima)",
  "Comisaría PNP Yanahuara (Arequipa)",
  "Comisaría PNP Cusco Centro (Cusco)",
  "Comisaría PNP Trujillo Centro (La Libertad)",
  "Comisaría PNP Chiclayo Centro (Lambayeque)",
  "Comisaría PNP Piura Centro (Piura)",
  "Comisaría PNP Huancayo Centro (Junín)",
  "Comisaría PNP Iquitos Centro (Loreto)",
  "Comisaría PNP Puno (Puno)",
  "Comisaría PNP Cajamarca (Cajamarca)",
  "Comisaría PNP Tacna (Tacna)",
  "Comisaría PNP Pucallpa (Ucayali)",
  "DIRINCRI (Dirección de Investigación Criminal - Av. España)",
  "DIVINCRI (División de Investigación Criminal)",
  "DIRANDRO (Dirección Antidrogas)",
  "DIRCOCOR (Dirección contra la Corrupción)",
  "DIRILA (Dirección de Lavado de Activos)"
];

interface CaseAnalyzerProps {
  caseData: CaseData;
  onChange: (caseData: CaseData) => void;
  onSave: (caseData: CaseData) => void;
}

export default function CaseAnalyzer({ caseData, onChange, onSave }: CaseAnalyzerProps) {
  const [activeTab, setActiveTab] = useState<'prescripcion' | 'plazos'>('prescripcion');

  if (!caseData) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 shadow-sm">
        No se ha cargado ningún expediente fiscal para calificar. Por favor use el botón "Nueva Calificación" o elija un caso del listado.
      </div>
    );
  }

  // Determine current crime variables
  const isCustom = caseData.delitoId === 'custom';
  const selectedCrime = COMMON_DELITOS.find(d => d.id === caseData.delitoId);
  const crimeDetails = isCustom 
    ? {
        articulo: caseData.delitoPersonalizado?.articulo || 'Art. ?',
        delito: caseData.delitoPersonalizado?.delito || 'Delito Especial',
        penaMaxima: caseData.delitoPersonalizado?.penaMaxima || 0,
        esContraEstado: caseData.delitoPersonalizado?.esContraEstado || false
      }
    : {
        articulo: selectedCrime?.articulo || '',
        delito: selectedCrime?.delito || '',
        penaMaxima: selectedCrime?.penaMaxima || 0,
        esContraEstado: selectedCrime?.esContraEstado || false
      };

  // Run Calculations
  const calculatedPrescripcion = calcularPrescripcion(caseData);
  const calculatedPlazo = calcularPlazoProcesal(caseData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    onChange({
      ...caseData,
      [name]: name === 'imputadoEdad' ? parseInt(value) || 0 : val
    });
  };

  const handleCustomCrimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    onChange({
      ...caseData,
      delitoPersonalizado: {
        ...(caseData.delitoPersonalizado || { articulo: 'Art. ', delito: '', penaMaxima: 5, esContraEstado: false }),
        [name]: name === 'penaMaxima' ? parseInt(value) || 0 : val
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(caseData);
  };

  const getAlertStyles = (level: AlertLevel) => {
    switch (level) {
      case AlertLevel.PRESCRITO:
        return {
          bg: 'bg-red-50 border-red-200 text-red-950',
          badge: 'bg-red-600 text-white',
          icon: <ShieldAlert className="w-8 h-8 text-red-600" />,
          label: 'PRESCRITO',
          desc: 'La acción penal ha vencido. Legalmente corresponde emitir Disposición de Archivos.'
        };
      case AlertLevel.RIESGO_ALTO:
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950 animate-pulse',
          badge: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
          label: 'ALERTA: RIESGO ALTO',
          desc: 'El plazo de prescripción extraordinario vence en menos de 1 año. Impulsar el caso de inmediato.'
        };
      case AlertLevel.RIESGO_BAJO:
        return {
          bg: 'bg-yellow-50 border-yellow-200 text-yellow-900',
          badge: 'bg-yellow-500 text-white',
          icon: <Clock className="w-8 h-8 text-yellow-500" />,
          label: 'ALERTA: RIESGO MODERADO',
          desc: 'Quedan menos de 2 años de vigencia. Monitorear los plazos del proceso penal de forma periódica.'
        };
      case AlertLevel.VIGENTE:
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
          icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
          label: 'ACCION VIGENTE',
          desc: 'La acción penal se encuentra plenamente activa y fuera de riesgos inminentes.'
        };
    }
  };

  const alertStyle = getAlertStyles(calculatedPrescripcion.alertaNivel);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="case-analyzer-form">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-slate-700" />
            Calificación y Análisis de Vigencia
          </h2>
          <p className="text-xs text-slate-500">Módulo de Control Determinístico de Prescripción y Plazos Procesales</p>
        </div>
        <button
          type="submit"
          className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2 shadow-sm transition"
        >
          <Save className="w-4 h-4" />
          Guardar Registro
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-7 p-6 border-r border-slate-100 space-y-6">
          
          {/* Identificación Básica */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              Identificación del Caso Fiscal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nro. de Caso / Carpeta Fiscal</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    name="id"
                    value={caseData.id}
                    onChange={handleChange}
                    className="w-full pl-3 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    placeholder="Eje: F-2026-681"
                    id="case-num-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Fiscal Responsable</label>
                <input
                  type="text"
                  name="fiscalResponsable"
                  value={caseData.fiscalResponsable}
                  onChange={handleChange}
                  className="w-full pl-3 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  placeholder="Abog. Fiscal Adjunto"
                  id="fiscal-responsible-input"
                />
              </div>
              <div className="md:col-span-2 pt-2">
                <CasePartiesManager
                  caseData={caseData}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          {/* Hechos, Ocurrencia y Denuncia Policial */}
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/60 space-y-4">
            <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
              <ClipboardList className="w-4.5 h-4.5 text-slate-550" />
              Detalles del Suceso y Registro Policial
            </h4>
            
            {/* Narración de Hechos */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                Narración de los Hechos
              </label>
              <textarea
                name="narracionHechos"
                value={caseData.narracionHechos || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
                placeholder="Describa de manera detallada pero puntual la narración fáctica o sucesos motivo de la investigación..."
                id="facts-narrative-textarea"
              />
            </div>

            {/* Informe Policial, Dependencia Policial y Fecha Denuncia */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Informe Policial / N° Denuncia</label>
                <input
                  type="text"
                  name="informePolicial"
                  value={caseData.informePolicial || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
                  placeholder="Ej: Inf. N° 124-2026-PNP"
                  id="police-report-input"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Dependencia Policial (Perú)</label>
                <select
                  name="dependenciaPolicial"
                  value={caseData.dependenciaPolicial || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
                  id="police-dept-selector"
                >
                  <option value="">-- Seleccionar Comisaría --</option>
                  {PERU_POLICE_DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Fecha Denuncia Policial</label>
                <input
                  type="date"
                  name="fechaDenunciaPolicial"
                  value={caseData.fechaDenunciaPolicial || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
                  id="police-report-date"
                />
              </div>
            </div>

            {/* Lugar y Google Maps */}
            <hr className="border-slate-200/50 my-2" />
            <CrimeSceneMap
              lugarHechos={caseData.lugarHechos || ''}
              lugarLatLng={caseData.lugarLatLng}
              onLocationChange={(lugar, latLng) => {
                onChange({
                  ...caseData,
                  lugarHechos: lugar,
                  lugarLatLng: latLng
                });
              }}
            />

            {/* Visualizador de documentos, archivos y audios */}
            <hr className="border-slate-200/50 my-3" />
            <CaseDocumentVisualizer
              currentCase={caseData}
              onUpdateCase={(updatedCase) => {
                onChange(updatedCase);
              }}
            />
          </div>

          <hr className="border-slate-100" />

          {/* Calificación de Hechos y Delito */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              Tipo Penal y Circunstancias Especiales
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Fecha de Comisión del Hecho</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      name="fechaHecho"
                      value={caseData.fechaHecho}
                      onChange={handleChange}
                      className="w-full pl-3 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                      id="fecha-hecho-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Delito Imputado</label>
                  <select
                    name="delitoId"
                    value={caseData.delitoId}
                    onChange={handleChange}
                    className="w-full pl-3 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    id="delito-selector"
                  >
                    {COMMON_DELITOS.map(d => (
                      <option key={d.id} value={d.id}>{d.delito} ({d.articulo})</option>
                    ))}
                    <option value="custom">-- Otro Delito (Personalizado) --</option>
                  </select>
                </div>
              </div>

              {/* Si es Personalizado */}
              {isCustom && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 animate-fadeIn">
                  <h4 className="text-xs font-medium text-slate-700">Configuración de Delito Personalizado</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xxs font-medium text-slate-500 mb-1">Artículo del C. Penal</label>
                      <input
                        type="text"
                        name="articulo"
                        value={caseData.delitoPersonalizado?.articulo}
                        onChange={handleCustomCrimeChange}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 bg-white rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                        placeholder="Ej: Art. 190"
                        id="custom-articulo"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xxs font-medium text-slate-500 mb-1">Nombre del Delito</label>
                      <input
                        type="text"
                        name="delito"
                        value={caseData.delitoPersonalizado?.delito}
                        onChange={handleCustomCrimeChange}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 bg-white rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                        placeholder="Ej: Apropiación ilícita común"
                        id="custom-delito"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xxs font-medium text-slate-500 mb-1">Pena Máxima Prevista (Años)</label>
                      <input
                        type="number"
                        min="1"
                        max="35"
                        name="penaMaxima"
                        value={caseData.delitoPersonalizado?.penaMaxima}
                        onChange={handleCustomCrimeChange}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 bg-white rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                        placeholder="Pena Máxima"
                        id="custom-pena"
                      />
                    </div>
                    <div className="flex items-center pt-5">
                      <label className="inline-flex items-center text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          name="esContraEstado"
                          checked={caseData.delitoPersonalizado?.esContraEstado}
                          onChange={handleCustomCrimeChange}
                          className="rounded text-slate-950 focus:ring-slate-900 border-slate-300 w-4 h-4 mr-2"
                          id="custom-contra-estado"
                        />
                        ¿Delito afecta al Estado / Org. Estatal?
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Parámetros Personales que reducen o duplican la Prescripción */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Edad del Imputado al Cometer Hecho</label>
                    <input
                      type="number"
                      name="imputadoEdad"
                      value={caseData.imputadoEdad}
                      onChange={handleChange}
                      className="w-full pl-3 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                      id="imputado-edad"
                    />
                    {caseData.imputadoEdad < 21 || caseData.imputadoEdad > 65 ? (
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                        <Info className="w-3 h-3 shrink-0" />
                        Aplica Reducción a la Mitad (Art. 81 CP)
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Menos de 21 o más de 65 años reduce la prescripción a la mitad.
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="inline-flex items-center text-xs text-slate-600 font-medium cursor-pointer py-1">
                      <input
                        type="checkbox"
                        name="imputadoFuncionarioPublico"
                        checked={caseData.imputadoFuncionarioPublico}
                        onChange={handleChange}
                        className="rounded text-slate-950 focus:ring-slate-900 border-slate-300 w-4 h-4 mr-2"
                        id="imputado-funcionario"
                      />
                      Imputado es Funcionario Público
                    </label>
                    <p className="text-[10px] text-slate-400">
                      Se duplica el plazo para delitos funcionariales que dañan el erario público (Constitución Art. 41).
                    </p>
                    {caseData.imputadoFuncionarioPublico && crimeDetails.esContraEstado && (
                      <span className="text-[11px] text-red-700 font-medium flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        ¡DUPLICIDAD ACTIVADA! Plazo ordinario × 2.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Milito de Suspensión (Investigación Preparatoria / Ley 31751) */}
              <div className="p-4 rounded-xl border border-dashed border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Formalización e Hitos Procesales (Suspensión)
                  </h4>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    Ley N° 31751
                  </span>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Fecha de Formalización de Investigación Preparatoria
                  </label>
                  <input
                    type="date"
                    name="fechaFormalizacion"
                    value={caseData.fechaFormalizacion || ''}
                    onChange={handleChange}
                    className="w-full pl-3 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    id="fecha-formalizacion"
                  />
                  {caseData.fechaFormalizacion ? (
                    <span className="text-[11px] text-indigo-700 font-medium flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      Suspensión activa: Max 1 año de suspensión de la prescripción.
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Suspende el curso ordinario del plazo legal por un año calendario como límite.
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Control de Plazos Fiscales (Diligencias / Preparatoria) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                Control de Plazos Procesales de la Investigación
              </h3>
            </div>
            
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 font-sans">Etapa Procesal Actual</label>
                  <select
                    name="etapaActual"
                    value={caseData.etapaActual}
                    onChange={handleChange}
                    className="w-full pl-3 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none"
                    id="etapa-actual"
                  >
                    <option value={EtapaInvestigacion.DILIGENCIAS_PRELIMINARES}>Diligencias Preliminares</option>
                    <option value={EtapaInvestigacion.INVESTIGACION_PREPARATORIA}>Investigación Preparatoria Formalizada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Fecha Inicio de la Etapa</label>
                  <input
                    type="date"
                    required
                    name="fechaInicioEtapa"
                    value={caseData.fechaInicioEtapa}
                    onChange={handleChange}
                    className="w-full pl-3 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none"
                    id="fecha-inicio-etapa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Complejidad decretada</label>
                  <select
                    name="complejidad"
                    value={caseData.complejidad}
                    onChange={handleChange}
                    className="w-full pl-3 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                    id="complejidad-select"
                  >
                    <option value={ComplexidadStage.SIMPLE}>Caso Simple</option>
                    <option value={ComplexidadStage.COMPLEJO}>Caso Complejo</option>
                    <option value={ComplexidadStage.CRIMEN_ORGANIZADO}>Crimen Organizado</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center text-xs text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      name="esProrrogado"
                      checked={caseData.esProrrogado}
                      onChange={handleChange}
                      className="rounded text-slate-950 focus:ring-slate-900 border-slate-300 w-4 h-4 mr-2"
                      id="prorrogado"
                    />
                    Etapa Prorrogada / Ampliada
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Deterministic Results & Badges */}
        <div className="lg:col-span-5 bg-slate-50/50 p-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Resultado de Diagnóstico Penal
              </h4>

              {/* Large Indicator */}
              <div className={`p-4 rounded-xl border ${alertStyle.bg} flex items-center gap-4 transition duration-300`}>
                <div className="shrink-0">
                  {alertStyle.icon}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Estado Acción Penal</div>
                  <div className="text-lg font-extrabold flex items-center gap-2">
                    {alertStyle.label}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{alertStyle.desc}</p>
                </div>
              </div>

              {/* Time Remaining Metric */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Años de Vigencia</div>
                    <div className="text-xl font-black text-slate-800">
                      {calculatedPrescripcion.estaPrescrito ? '0.00' : `${calculatedPrescripcion.añosRestantes} años`}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Días Restantes</div>
                    <div className="text-xl font-black text-slate-800">
                      {calculatedPrescripcion.estaPrescrito ? '0' : `${calculatedPrescripcion.díasRestantes} días`}
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
                  <div className="text-[10px] uppercase font-bold text-slate-450 mb-0.5">Vigencia (días / mes / año)</div>
                  <div className="text-sm font-bold text-indigo-900 font-mono">
                    {calculatedPrescripcion.estaPrescrito ? '0 días / 0 meses / 0 años' : formatRemainingTimeToDMY(calculatedPrescripcion.díasRestantes)}
                  </div>
                </div>
              </div>
            </div>

            {/* Arithmetic Steps Explained */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Matemática Procesal Aplicada
              </h4>
              
              <div className="space-y-3 divide-y divide-slate-100 text-xs">
                
                <div className="flex justify-between py-2 first:pt-0">
                  <span className="text-slate-500">Pena Máxima Imputable:</span>
                  <span className="font-semibold text-slate-800 font-mono">{crimeDetails.penaMaxima} años de cárcel</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Factores Multiplicativos/Reductores:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {calculatedPrescripcion.duplicadoPorFuncionario && (
                      <span className="block text-red-650 font-bold">Duplicado (+100%) por Funcionario</span>
                    )}
                    {calculatedPrescripcion.reduccionPorEdad && (
                      <span className="block text-emerald-600 font-bold">Medio Plazo (-50%) por Edad</span>
                    )}
                    {!calculatedPrescripcion.duplicadoPorFuncionario && !calculatedPrescripcion.reduccionPorEdad && (
                      <span className="text-slate-400">Ningún factor personal</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Prescripción Ordinaria (Art. 80):</span>
                  <div>
                    <span className="font-extrabold text-slate-800 font-mono block text-right">{calculatedPrescripcion.plazoOrdinario} años</span>
                    <span className="text-[10px] text-slate-400">Vencimiento ordinario: {formatToDMY(calculatedPrescripcion.fechaLimiteOrdinaria)}</span>
                  </div>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Prescripción Extraordinaria (Art. 83):</span>
                  <div>
                    <span className="font-extrabold text-slate-850 font-mono block text-right">
                      {calculatedPrescripcion.plazoExtraordinario} años
                    </span>
                    <span className="text-[10px] text-slate-400">Ordinario + 50%: {formatToDMY(calculatedPrescripcion.fechaLimiteExtraordinaria)}</span>
                  </div>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Suspensión Formalización (Ley 31751):</span>
                  <div>
                    <span className="font-extrabold text-indigo-700 font-mono block text-right">
                      {calculatedPrescripcion.suspensionAplicadaVal > 0 ? `+ ${calculatedPrescripcion.suspensionAplicadaVal} año` : 'Sin Formalización (0 Años)'}
                    </span>
                    <span className="text-[10px] text-slate-450 block text-right leading-none mt-0.5">
                      {calculatedPrescripcion.suspensionAplicadaVal > 0 ? "Aplica suspensión de un año" : "No aplica extensión"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between py-2 bg-indigo-50/50 p-2 rounded border border-indigo-100 font-semibold text-xs">
                  <span className="text-indigo-950">VENCIMIENTO FINAL ESTIMADO:</span>
                  <span className="text-indigo-900 font-mono">{formatToDMY(calculatedPrescripcion.fechaLimiteFinal)}</span>
                </div>

              </div>
            </div>

            {/* Stage Duration Control */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Estado de Plazo de Investigación</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  calculatedPlazo.vencido ? 'bg-red-150 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {calculatedPlazo.vencido ? 'PLAZO VENCIDO' : 'DENTRO DE PLAZO'}
                </span>
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Límite oficial decretado:</span>
                  <span className="font-semibold text-slate-800 font-mono">{calculatedPlazo.plazoDiasPermitidos} días hábiles/calendarios</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Días transcurridos:</span>
                  <span className="font-semibold text-slate-800 font-mono">{calculatedPlazo.díasTranscurridos} días consumidos</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Fecha oficial de vencimiento:</span>
                  <span className="font-bold text-slate-950 font-mono text-right">{formatToDMY(calculatedPlazo.fechaVencimiento)}</span>
                </div>

                {calculatedPlazo.vencido ? (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-950 rounded-lg flex items-start gap-2 text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-650 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">¡DILACIÓN DE PLAZO DETECTADA!</span>
                      El plazo procesal para culminar esta etapa de investigación culminó el {formatToDMY(calculatedPlazo.fechaVencimiento)}. El fiscal a cargo podría afrontar quejas por dilaciones.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-950 rounded-lg flex items-center gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-650 shrink-0" />
                    <span>Quedan <b>{calculatedPlazo.díasRestantes} días</b> para realizar las diligencias programadas en carpeta.</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="mt-6 p-4 bg-slate-150/70 border border-slate-200 rounded-xl">
            <p className="text-slate-500 text-xxs text-center leading-relaxed">
              Base Jurídica: Código Penal (D.S. N° 017-93-JUS) Arts. 80, 81, 83 y 84; Código Procesal Penal de 2004; y Ley N° 31751 ("Ley de Regulación de la Suspensión de la Prescripción de la Acción Penal").
            </p>
          </div>

        </div>
      </div>
    </form>
  );
}
