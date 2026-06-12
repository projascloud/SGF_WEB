/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CaseData, PrescripcionResult, PlazoProcesalResult } from '../types';
import { COMMON_DELITOS, formatToDMY } from '../utils/calculations';
import { FileText, Copy, Check, Printer, Send } from 'lucide-react';

interface NotificationDraftProps {
  currentCase: CaseData;
  prescripcion: PrescripcionResult;
  plazo: PlazoProcesalResult;
}

export default function NotificationDraft({ currentCase, prescripcion, plazo }: NotificationDraftProps) {
  const [copied, setCopied] = useState(false);

  const crimeObj = COMMON_DELITOS.find(d => d.id === currentCase.delitoId);
  const delitoText = currentCase.delitoId === 'custom'
    ? `${currentCase.delitoPersonalizado?.delito || 'Personalizado'} (${currentCase.delitoPersonalizado?.articulo || 'Art. ?'})`
    : `${crimeObj?.delito || 'Delito'} (${crimeObj?.articulo || 'Art.'})`;

  const buildNotificationText = () => {
    const hoyStr = new Date().toISOString().split('T')[0];
    const statusText = prescripcion.estaPrescrito 
      ? '🔴 PRESCRITA (PLAZO VENCIDO)' 
      : `🟢 VIGENTE (FECHA LÍMITE: ${formatToDMY(prescripcion.fechaLimiteFinal)})`;

    return `MINISTERIO PÚBLICO DEL PERÚ
FISCALÍA DE LA NACIÓN
SISTEMA DE CALIFICACIÓN Y ALERTA DE PRESCRIPCIÓN FISCAL

CÉDULA DE NOTIFICACIÓN AUTOMÁTICA DE VIGENCIA DE ACCIÓN PENAL
----------------------------------------------------------------------
CARPETA FISCAL : ${currentCase.id}
FISCAL DE CASO : ${currentCase.fiscalResponsable || 'Abog. Fiscal Provincial Responsable'}
DENUNCIANTE    : ${currentCase.denunciante || 'MINISTERIO PÚBLICO DEL PERU'}
IMPUTADO       : ${currentCase.denunciado || 'INVESTIGADO EN INVESTIGACIÓN'}
DELITO         : ${delitoText}
FECHA HECHO    : ${formatToDMY(currentCase.fechaHecho)}
----------------------------------------------------------------------

Por medio de la presente, el Sistema Tecnológico de Control de Plazos y Alertas de la Fiscalía de la Nación, emite el siguiente REPORTE DE CONTROL AUTOMÁTICO DE VENCIMIENTO FISCAL:

Habiendo calificado e ingresado los parámetros objetivos del presente expediente penal, se determinan los siguientes extremos legales:

1. CONTROL DE LA ACCIÓN PENAL (PRESCRIPCIÓN):
   - Plazo de Prescripción Ordinaria (Art. 80 CP)    : ${prescripcion.plazoOrdinario} años (F. Vencimiento: ${formatToDMY(prescripcion.fechaLimiteOrdinaria)})
   - Plazo de Prescripción Extraordinaria (Art. 83 CP): ${prescripcion.plazoExtraordinario} años (F. Vencimiento: ${formatToDMY(prescripcion.fechaLimiteExtraordinaria)})
   - Suspensión Aplicada por Formalización (Ley 31751): ${prescripcion.suspensionAplicadaVal > 0 ? 'SÍ (1 Año de extensión)' : 'NO (Sin hito de suspensión)'}
   - FECHA DE VENCIMIENTO FINAL DEL PROCESO        : ${formatToDMY(prescripcion.fechaLimiteFinal)}
   - ESTADO ACTUAL DE LA ACCIÓN PENAL              : ${statusText}

2. CONTROL DE PLAZO PROCEDIMENTAL DE INVESTIGACIÓN:
   - Etapa Procesal Evaluada : ${currentCase.etapaActual === 'DILIGENCIAS_PRELIMINARES' ? 'DILIGENCIAS PRELIMINARES' : 'INVESTIGACIÓN PREPARATORIA'}
   - Plazo Máximo Permitido  : ${plazo.plazoDiasPermitidos} días procesales.
   - Fecha de Vencimiento de Etapa : ${formatToDMY(plazo.fechaVencimiento)}
   - DIAGNÓSTICO PROCEDIMENTAL    : ${plazo.vencido ? '⚠️ PLAZO DE INVESTIGACIÓN EXCEDIDO' : '✅ DENTRO DE PLAZO DE INVESTIGACIÓN'}

3. NOTIFICACIÓN DE EXPEDICIÓN E INTEGRACIÓN:
   Se dispone poner en inmediato conocimiento al Despacho Fiscal de Turno a efectos de que procese la emisión de la Disposición de Archivo Final (en caso de prescripción verificada), o impulse de forma prioritaria los actos de prueba periciales y declaraciones urgentes para evitar dilaciones bajo apercibimiento de ley.

Expedido de forma automática en el Sistema de Gestión Fiscal del Perú.
Fecha de Emisión de Reporte: ${formatToDMY(hoyStr)}
Módulo de Gestión Tecnológica - MPFN`;
  };

  const handleCopy = () => {
    const text = buildNotificationText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const textOutput = buildNotificationText();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full" id="notification-panel">
      {/* Panel Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-900" />
            Notificación Automática del Sistema
          </h3>
          <p className="text-xs text-slate-500 font-sans font-medium">Borrador de Notificación para Carpeta Fiscal o Sujetos Procesales</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="bg-slate-905 hover:bg-slate-900 border border-slate-250 bg-white text-slate-700 hover:text-slate-950 px-3 py-1.5 rounded inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg shadow-xs transition"
            id="copy-notification-btn"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                Copiar Cédula
              </>
            )}
          </button>
        </div>
      </div>

      {/* Renders Notification Paper */}
      <div className="p-6 flex-1 flex flex-col bg-slate-50/50">
        <div className="bg-white border border-slate-200 hover:border-slate-300 p-6 shadow-sm rounded-xl flex-1 font-mono text-[11px] leading-relaxed text-slate-700 select-all whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar">
          {textOutput}
        </div>

        <div className="mt-4 p-3.5 bg-yellow-50 border border-yellow-250 rounded-xl flex gap-2">
          <span className="shrink-0 text-yellow-550 select-none">⚠️</span>
          <p className="text-[11px] text-yellow-950 leading-relaxed font-sans">
            <strong>Advertencia de Responsabilidad:</strong> Este formato representa el cálculo del Control Interno de Plazos. El Fiscal Provincial es el único capacitado constitucionalmente para refrendar y dictaminar la Disposición de Archivo Final pertinente en base a los cuadernos de investigación.
          </p>
        </div>
      </div>
    </div>
  );
}
