/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CaseData, AlertLevel, EtapaInvestigacion } from '../types';
import { calcularPrescripcion, COMMON_DELITOS, formatToDMY } from '../utils/calculations';
import { 
  Search, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  Plus, 
  FileSpreadsheet, 
  ChevronRight,
  FolderOpen,
  User
} from 'lucide-react';

interface CaseListProps {
  cases: CaseData[];
  selectedCaseId?: string | null;
  onSelectCase: (caseId: string) => void;
  onDeleteCase: (caseId: string) => void;
  onNewCase: () => void;
}

export default function CaseList({ cases, selectedCaseId, onSelectCase, onDeleteCase, onNewCase }: CaseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [alertFilter, setAlertFilter] = useState<string>('ALL');
  const [etapaFilter, setEtapaFilter] = useState<string>('ALL');

  const getAlertBadge = (level: AlertLevel) => {
    switch (level) {
      case AlertLevel.PRESCRITO:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 px-1 py-0.5 rounded-full bg-red-100 text-red-800">
            <ShieldAlert className="w-3 w-3 h-3 text-red-600" />
            Prescrito
          </span>
        );
      case AlertLevel.RIESGO_ALTO:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Riesgo Alto
          </span>
        );
      case AlertLevel.RIESGO_BAJO:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 text-yellow-600" />
            Moderado
          </span>
        );
      case AlertLevel.VIGENTE:
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Vigente
          </span>
        );
    }
  };

  // Enriquecemos la lista localmente calculando los estados frescos
  const processedCases = cases.map(c => {
    const calc = calcularPrescripcion(c);
    const originalCrime = COMMON_DELITOS.find(d => d.id === c.delitoId);
    const delitoLabel = c.delitoId === 'custom' 
      ? c.delitoPersonalizado?.delito || 'Personalizado'
      : originalCrime?.delito || 'Delito Especial';
    
    return {
      ...c,
      calculo: calc,
      delitoLabel
    };
  });

  // Filtros aplicados
  const filteredCases = processedCases.filter(c => {
    const matchesSearch = 
      (c.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.denunciado || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.denunciante || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.delitoLabel || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesAlert = alertFilter === 'ALL' || c.calculo.alertaNivel === alertFilter;
    const matchesEtapa = etapaFilter === 'ALL' || c.etapaActual === etapaFilter;

    return matchesSearch && matchesAlert && matchesEtapa;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="case-list-panel">
      {/* List Header */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-slate-50">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-slate-700" />
            Carpeta de Casos Evaluados
          </h3>
          <p className="text-xs text-slate-500">Historial integrado y monitoreo de plazos fiscales activos</p>
        </div>
        <button
          onClick={onNewCase}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Nueva Calificación
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 border-b border-slate-100 bg-white grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            placeholder="Buscar por carpeta, denunciado, delito..."
            id="search-cases-input"
          />
        </div>

        {/* Filter Alert Level */}
        <div>
          <select
            value={alertFilter}
            onChange={(e) => setAlertFilter(e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
            id="filter-alert"
          >
            <option value="ALL">Todos los Diagnósticos</option>
            <option value={AlertLevel.VIGENTE}>Vigentes sin Riesgo</option>
            <option value={AlertLevel.RIESGO_BAJO}>Riesgo Moderado</option>
            <option value={AlertLevel.RIESGO_ALTO}>Riesgo Crítico</option>
            <option value={AlertLevel.PRESCRITO}>Prescritos</option>
          </select>
        </div>

        {/* Filter Investigation Stage */}
        <div>
          <select
            value={etapaFilter}
            onChange={(e) => setEtapaFilter(e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
            id="filter-etapa"
          >
            <option value="ALL">Todas las Etapas</option>
            <option value={EtapaInvestigacion.DILIGENCIAS_PRELIMINARES}>Diligencias Preliminares</option>
            <option value={EtapaInvestigacion.INVESTIGACION_PREPARATORIA}>Investigación Preparatoria</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Carpeta Fiscal / Caso</th>
              <th className="py-3 px-4">Investigado / Denunciado</th>
              <th className="py-3 px-4">Delito Imputado</th>
              <th className="py-3 px-4">Fecha Comisión</th>
              <th className="py-3 px-4">Límite Final</th>
              <th className="py-3 px-4 text-center">Vigencia</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400">
                  <FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                  Ningún caso registrado coincide con los filtros especificados.
                </td>
              </tr>
            ) : (
              filteredCases.map((c) => {
                const isSelected = selectedCaseId === c.id;
                return (
                  <tr 
                    key={c.id} 
                    onClick={() => onSelectCase(c.id)}
                    className={`hover:bg-slate-50 transition cursor-pointer group ${isSelected ? 'bg-indigo-50/45' : ''}`}
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 font-mono">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.partes && Array.isArray(c.partes) && c.partes.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[240px]">
                          {c.partes.slice(0, 4).map((p) => {
                            if (!p) return null;
                            let colorBg = 'bg-blue-50 text-blue-700 border-blue-150';
                            let label = 'DEN';
                            if (p.type === 'denunciado') {
                              colorBg = 'bg-amber-50 text-amber-800 border-amber-200';
                              label = 'DENCO';
                            } else if (p.type === 'imputado') {
                              colorBg = 'bg-rose-50 text-rose-700 border-rose-150';
                              label = 'IMP';
                            } else if (p.type === 'agraviado') {
                              colorBg = 'bg-emerald-50 text-emerald-700 border-emerald-150';
                              label = 'AGR';
                            }

                            return (
                              <span 
                                key={p.id || `p-${Math.random()}`} 
                                className={`inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded border ${colorBg}`}
                                title={`${label}: ${p.name || ''}`}
                              >
                                <User className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate max-w-[70px]">{p.name || ''}</span>
                              </span>
                            );
                          })}
                          {c.partes.length > 4 && (
                            <span className="text-[8px] font-medium bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">
                              +{c.partes.length - 4}
                            </span>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="font-medium text-slate-800 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            {c.denunciado || 'Sin imputado'}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            Den: {c.denunciante || 'No figura'}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 max-w-[150px] truncate">{c.delitoLabel}</div>
                      <div className="text-[10px] font-mono text-indigo-700 font-medium">
                        {c.etapaActual === EtapaInvestigacion.DILIGENCIAS_PRELIMINARES ? 'PRELIMINAR' : 'PREPARATORIA'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-550 font-mono">
                      {formatToDMY(c.fechaHecho)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 font-mono">
                      {formatToDMY(c.calculo.fechaLimiteFinal)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getAlertBadge(c.calculo.alertaNivel)}
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1 items-center">
                        <button
                          onClick={() => onSelectCase(c.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                          title="Cargar Caso para Modificación / Calificación"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteCase(c.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                          title="Eliminar Caso"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Total Count bar */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xxs text-slate-400 font-medium">
        <span>Mostrando {filteredCases.length} de {cases.length} expedientes calificados</span>
        <span>Local Storage Actualizado</span>
      </div>
    </div>
  );
}
