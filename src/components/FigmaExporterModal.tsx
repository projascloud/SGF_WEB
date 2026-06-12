import React, { useState } from 'react';
import { CaseData, PrescripcionResult, PlazoProcesalResult } from '../types';
import { formatToDMY } from '../utils/calculations';
import { Copy, Download, Figma, X, Sparkles, Check, HelpCircle, Layers, Kanban, Terminal, LayoutGrid, FileCheck } from 'lucide-react';

interface FigmaExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: CaseData;
  prescripcion: PrescripcionResult;
  plazo: PlazoProcesalResult;
}

type FigmaViewType = 'dashboard' | 'caselist' | 'analyzer' | 'aiassistant';

export default function FigmaExporterModal({
  isOpen,
  onClose,
  currentCase,
  prescripcion,
  plazo
}: FigmaExporterModalProps) {
  const [copiedHTML, setCopiedHTML] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);
  const [activeTab, setActiveTab] = useState<'svg' | 'html' | 'design-system' | 'guide'>('svg');
  const [selectedHtmlView, setSelectedHtmlView] = useState<FigmaViewType>('dashboard');

  if (!isOpen) return null;

  // Generate HTML templates for different views
  const getFigmaHtmlCode = (view: FigmaViewType) => {
    switch (view) {
      case 'dashboard':
        return `<div id="figma-import-dashboard" style="width: 1440px; min-height: 900px; font-family: 'Inter', sans-serif; background-color: #f1f5f9; padding: 24px; box-sizing: border-box; display: flex; flex-direction: column; gap: 20px;">
  <!-- Header Area -->
  <header style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 18px 24px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; color: #ffffff;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="background-color: #e2e8f0; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #0f172a; font-size: 18px;">⚖️</div>
      <div>
        <h1 style="font-size: 16px; font-weight: 800; margin: 0; letter-spacing: -0.02em;">SISTEMA CONTROL DE PLAZOS Y PRECRIPCIÓN MINISTERIAL</h1>
        <p style="font-size: 11px; color: #94a3b8; margin: 2px 0 0 0;">Ministerio Público - Fiscalía de la Nación del Perú</p>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 16px;">
      <div style="text-align: right;">
        <span style="font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Reloj Oficial Judicial</span>
        <div style="color: #fbbf24; font-family: monospace; font-size: 13px; font-weight: bold;">09:52:34 a.m. (Lima)</div>
      </div>
    </div>
  </header>

  <!-- Columns Grid -->
  <div style="display: grid; grid-template-columns: 350px 1fr 380px; gap: 20px; flex: 1;">
    <!-- Column 1: Case List -->
    <div style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 18px; display: flex; flex-direction: column; gap: 12px;">
      <h3 style="font-size: 13px; font-weight: 800; color: #334155; margin: 0;">Bandeja de Carpeta Fiscales</h3>
      <div style="border-radius: 6px; border: 1px solid #cbd5e1; padding: 8px; font-size: 12px;">🔍 Buscar expediente o fiscal...</div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 10px; border-radius: 8px;">
          <div style="font-size: 12px; font-weight: bold; color: #1e3a8a;">Caso: ${currentCase.id}</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Hecho: ${currentCase.fechaHecho} | Fiscal: Projas</div>
        </div>
      </div>
    <!-- Column 2: Analyser Form -->
    <div style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; display: flex; flex-direction: column; gap: 16px;">
      <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0;">Calificación Jurídico-Penal</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <span style="font-size: 11px; color: #64748b;">Código Carpeta Fiscal</span>
          <div style="border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; font-size: 12px; font-weight: bold;">${currentCase.id}</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <span style="font-size: 11px; color: #64748b;">Fecha del Hecho Púnico</span>
          <div style="border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; font-size: 12px; font-weight: bold;">${currentCase.fechaHecho}</div>
        </div>
      </div>
    </div>

    <!-- Column 3: AI Output & Documents -->
    <div style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 18px; display: flex; flex-direction: column; gap: 14px;">
      <h3 style="font-size: 13px; font-weight: 800; color: #334155; margin: 0;">Asistente legal IA y Reporte</h3>
      <div style="background: #fafaf9; border: 1px dashed #e2e8f0; padding: 14px; border-radius: 8px; font-size: 11px; line-height: 1.5; color: #44403c;">
         <b>SINOPSIS DEL INFORME FISCAL:</b> El delito materia de investigación versa sobre "${currentCase.delitoId || 'Peculado'}". El cómputo para la prescripción de la acción penal arroja un vencimiento de plazo ordinario en fecha ${formatToDMY(prescripcion.fechaLimiteOrdinaria)}.
      </div>
    </div>
  </div>
</div>`;

      case 'caselist':
        return `<div id="figma-import-caselist" style="width: 380px; font-family: 'Inter', sans-serif; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 14px;">
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0;">Bandeja Fiscal</h3>
    <span style="background-color: #eef2ff; color: #4f46e5; font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 12px;">Base de Datos Real</span>
  </div>
  <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px; font-size: 11px; color: #64748b;">🔍 Filtrar carpetas...</div>
  
  <div style="display: flex; flex-direction: column; gap: 8px; max-height: 350px; overflow-y: auto;">
    <div style="background-color: #eff6ff; border: 1.5px solid #3b82f6; border-radius: 8px; padding: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; font-weight: 800; color: #1e3a8a;">${currentCase.id}</span>
        <span style="font-size: 8px; font-weight: bold; background-color: #dcfce7; color: #15803d; padding: 2px 6px; border-radius: 4px;">ACTIVO</span>
      </div>
      <p style="font-size: 10px; color: #475569; margin: 4px 0 0 0; font-weight: 500;">Imputado: ${currentCase.denunciado || 'En investigación'}</p>
      <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 9px; color: #64748b; font-family: monospace;">
        <span>F.Hecho: ${formatToDMY(currentCase.fechaHecho)}</span>
        <span style="font-weight: bold; color: #1e293b;">Vence: ${formatToDMY(prescripcion.fechaLimiteFinal)}</span>
      </div>
    </div>
  </div>
</div>`;

      case 'analyzer':
        return `<div id="figma-import-analyzer" style="width: 580px; font-family: 'Inter', sans-serif; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-sizing: border-box; display: flex; flex-direction: column; gap: 18px;">
  <div style="border-bottom: 2px solid #ef4444; padding-bottom: 12px;">
    <span style="font-size: 10px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.05em;">ANÁLISIS CONSTITUCIONAL</span>
    <h3 style="font-size: 18px; font-weight: 900; color: #0f172a; margin: 4px 0 0 0;">Evaluación Técnica del Delito</h3>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    <div>
      <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">Delito Clasificado</span>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-size: 12px; font-weight: bold; color: #0f172a; margin-top: 4px;">
        ${currentCase.delitoId || 'Peculado Doloso'}
      </div>
    </div>
    <div>
      <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">Marco Legal Sancionador</span>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-size: 12px; font-weight: bold; color: #0f172a; margin-top: 4px;">
        Mín: ${Math.max(1, Math.round(prescripcion.plazoOrdinario / 3))} años | Máx: ${prescripcion.plazoOrdinario} años
      </div>
    </div>
  </div>

  <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px; padding: 12px; display: flex; gap: 10px; align-items: start;">
    <span style="font-size: 16px;">⚠️</span>
    <div>
      <h4 style="font-size: 11px; font-weight: 855; color: #991b1b; margin: 0;">PREVENCIÓN DE IMPUNIDAD / PLAZOS DE PRESCRIPCIÓN</h4>
      <p style="font-size: 10px; color: #7f1d1d; margin: 4px 0 0 0; line-height: 1.4;">
        El plazo extraordinario de prescripción asciende a <b>${prescripcion.plazoExtraordinario} años</b> completándose ineludiblemente el <b>${formatToDMY(prescripcion.fechaLimiteExtraordinaria)}</b>.
      </p>
    </div>
  </div>
</div>`;

      case 'aiassistant':
        return `<div id="figma-import-aiassistant" style="width: 380px; font-family: 'Inter', sans-serif; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px;">
  <div style="background-color: #0f172a; padding: 12px; border-radius: 8px; color: #ffffff; display: flex; align-items: center; gap: 8px;">
    <span style="font-size: 14px;">🤖</span>
    <div>
      <h4 style="font-size: 12px; font-weight: bold; margin: 0;">Asistente Fiscal IA</h4>
      <p style="font-size: 9px; color: #94a3b8; margin: 0;">Modelo entrenado en jurisprudencia peruana</p>
    </div>
  </div>

  <div style="background-color: #f5f5f4; border-radius: 8px; padding: 12px; font-size: 11px; line-height: 1.5; color: #1c1917;">
    Estimado magistrado, para el caso <b>${currentCase.id}</b>, el delito imputado conlleva una pena máxima de <b>${prescripcion.plazoOrdinario} años</b>. Se ha adicionado un hito de suspensión de 1 año conforme a la Ley N° 31751, resultando una fecha definitiva estimada para el <b>${formatToDMY(prescripcion.fechaLimiteFinal)}</b>.
  </div>

  <div style="display: flex; gap: 8px;">
    <button style="flex: 1; background-color: #4f46e5; color: #ffffff; border: none; padding: 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">Redactar Cédula</button>
    <button style="background-color: #e2e8f0; color: #0f172a; border: none; padding: 8px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">Copiar</button>
  </div>
</div>`;
    }
  };

  // Figma interactive transition mapping instructions
  const getFigmaStateFlowSpec = () => {
    return `// ESQUEMA ARQUITECTÓNICO COMPLETO - REGISTRO DE ARCIHVOS FIGMA
// Mapeo detallado de interacciones, componentes y flujos lógicos de la fiscalía.

1. ESTRUCTURACIÓN DE LIENZOS (Frames de Alta Fidelidad)
   * Frame [A]: BANDEJA_FISCAL_INICIO
     - Contiene el listado de todos los casos de la sede fiscal.
     - Interacción: Clic en cualquier fila del expediente -> Transiciona a [B].
   * Frame [B]: DIAGNOSTICO_ACTIVO_VIGENTE
     - Muestra el formulario con los parámetros del caso seleccionado y las píldoras de vigencia en color verde/azul.
   * Frame [C]: EXCESO_PLAZOS_ALERTA
     - Variación de interfaz con indicador de exención extraordinario de plazos o dilación fiscal (rojizos).
   * Frame [D]: INFORME_IA_GENERADO
     - Despliega en la columna lateral el análisis jurisprudencial con las leyes 31751 y regulaciones fiscales.
   * Frame [E]: NOTIFICACION_FISCAL_PDF
     - Plantilla interactiva de la Cédula de Notificación oficial de vencimiento automatizado.

2. ASIGNACIÓN DE TIPOGRAFÍAS DE DISTRITO PERICIAL:
   - Primary Headings: "Outfit" o "Inter" (Boldest 800 - 900 tracking-tight)
   - Readability Base: "Inter" (Standard 400 - 550)
   - Code & Legal Chronology: "JetBrains Mono" o "Andale Mono" (Consistente para fechas oficiales)

3. COORDENADAS COLORIMÉTRICAS OFICIALES (HEX):
   - Azul Presidencial Ministerio: #0F172A (Slate-900)
   - Indigo Contrato Digital:     #4F46E5 (Indigo-600)
   - Alerta Crítica (Prescrito):  #DC2626 (Red-600)
   - Alerta Preventiva (Holgura): #F59E0B (Amber-500)
   - Vigencia Estable (Óptimo):   #10B981 (Emerald-500)

4. TRIGGERS SENSORIALES SÁNDWICH (Smart Animate Parameters):
   - Tipo de Transición: Smart Animate
   - Duración de Transición: 220ms (Fisiológico)
   - Curva de Aceleración: Cubic Bezier (0.25, 1, 0.5, 1) [Smooth Glide]`;
  };

  const handleCopyHTML = () => {
    navigator.clipboard.writeText(getFigmaHtmlCode(selectedHtmlView));
    setCopiedHTML(true);
    setTimeout(() => setCopiedHTML(false), 2000);
  };

  const handleCopySpec = () => {
    navigator.clipboard.writeText(getFigmaStateFlowSpec());
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  // Dynamically generate a massive layered SVG mockup containing the ENTIRE dashboard view of the project!
  const downloadFullDashboardSVG = () => {
    const alertColor = prescripcion.estaPrescrito ? '#ef4444' : '#10b981';
    const alertBg = prescripcion.estaPrescrito ? '#fef2f2' : '#ecfdf5';
    
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900" style="background-color: #f1f5f9;">
  <!-- Background grids and specs -->
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="0.7" />
    </pattern>
  </defs>
  <rect width="1440" height="900" fill="#f8fafc" />
  <rect width="1440" height="900" fill="url(#grid)" opacity="0.5" />

  <!-- FIGMA METADATA DECORATOR BANNER -->
  <rect width="1440" height="42" fill="#0f172a" />
  <circle cx="20" cy="21" r="6" fill="#ef4444" />
  <circle cx="36" cy="21" r="6" fill="#f59e0b" />
  <circle cx="52" cy="21" r="6" fill="#10b981" />
  <text x="80" y="26" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="11" font-weight="805">PROYECTO COMPLETO FIGMA: MÓDULO DE ALERTAS DE PRESCRIPCIÓN Y PLAZOS FISCALES</text>
  <text x="1420" y="26" fill="#3b82f6" font-family="'Inter', sans-serif" font-weight="900" font-size="11" text-anchor="end">100% VECTORIAL EDITABLE</text>

  <!-- APP HEADER (From 1440px desktop structure) -->
  <g transform="translate(30, 72)">
    <rect width="1380" height="74" rx="14" fill="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" />
    <text x="24" y="38" fill="#ffffff" font-family="'Inter', sans-serif" font-size="16" font-weight="900" letter-spacing="-0.03em">MÓDULO DIGITAL DE ALERTAS DE PRESCRIPCIÓN Y PLAZOS PROCEDIMENTALES</text>
    <text x="24" y="56" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="11">Ministerio Público del Perú | Sede Tecnológica de Control de Plazos de la Nación</text>
    
    <!-- Real-time Clock Graphic -->
    <rect x="1140" y="18" width="216" height="38" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    <circle cx="1160" cy="37" r="4" fill="#fbbf24" />
    <text x="1172" y="41" fill="#fbbf24" font-family="'Courier New', monospace" font-size="12" font-weight="bold">09:52:34 AM - HORA LIMA</text>
  </g>

  <!-- BODY CONTENT AREA: Divided into three semantic columns -->
  <!-- COLUMN 1: BANDEJA DE CASOS (List) -->
  <g transform="translate(30, 166)">
    <!-- Column body background -->
    <rect width="320" height="690" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
    <text x="20" y="36" fill="#0f172a" font-family="'Inter', sans-serif" font-size="14" font-weight="900">Bandeja de Investigación</text>
    <text x="20" y="52" fill="#64748b" font-family="'Inter', sans-serif" font-size="10">Registro de Carpetas Asignadas</text>

    <!-- Search Tool mock -->
    <rect x="20" y="70" width="280" height="36" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
    <text x="36" y="92" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="11">🔍 Buscar expediente o fiscal responsabile...</text>

    <!-- Case Item 1 (Selected Active) -->
    <g transform="translate(20, 126)">
      <rect width="280" height="92" rx="10" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5" />
      <text x="14" y="24" fill="#1e3a8a" font-family="'Inter', sans-serif" font-size="12" font-weight="bold">Exp. ${currentCase.id}</text>
      <text x="14" y="44" fill="#475569" font-family="'Inter', sans-serif" font-size="10.5">Delito: ${currentCase.delitoId || 'Peculado de Fondos'}</text>
      <text x="14" y="62" fill="#64748b" font-family="'Inter', sans-serif" font-size="9.5">Imputado: ${currentCase.denunciado || 'En investigación'}</text>
      <!-- Date info and badge -->
      <line x1="14" y1="72" x2="266" y2="72" stroke="#dbeafe" stroke-width="1" />
      <text x="14" y="84" fill="#1e40af" font-family="monospace" font-size="8.5">Vencimiento Final: ${formatToDMY(prescripcion.fechaLimiteFinal)}</text>
      <rect x="210" y="10" width="56" height="18" rx="4" fill="#dcfce7" />
      <text x="238" y="22" fill="#166534" font-family="'Inter', sans-serif" font-weight="bold" font-size="8.5" text-anchor="middle">ACTIVE</text>
    </g>

    <!-- Case Item 2 (Standard) -->
    <g transform="translate(20, 230)">
      <rect width="280" height="92" rx="10" fill="#ffffff" stroke="#f1f5f9" stroke-width="1.5" />
      <text x="14" y="24" fill="#334155" font-family="'Inter', sans-serif" font-size="12" font-weight="bold">Exp. 506015505-2022-88</text>
      <text x="14" y="44" fill="#475569" font-family="'Inter', sans-serif" font-size="10.5">Delito: Colusión Agravada</text>
      <text x="14" y="62" fill="#64748b" font-family="'Inter', sans-serif" font-size="9.5">Imputado: Juan Rosales Medina</text>
      <line x1="14" y1="72" x2="266" y2="72" stroke="#e2e8f0" stroke-width="1" />
      <text x="14" y="84" fill="#334155" font-family="monospace" font-size="8.5">Vencimiento Final: 18/09/2029</text>
      <rect x="210" y="10" width="56" height="18" rx="4" fill="#fef3c7" />
      <text x="238" y="22" fill="#d97706" font-family="'Inter', sans-serif" font-weight="bold" font-size="8.5" text-anchor="middle">ALERT</text>
    </g>
    
    <!-- Case Item 3 (Prescribed) -->
    <g transform="translate(20, 334)">
      <rect width="280" height="92" rx="10" fill="#fafafa" stroke="#f1f5f9" stroke-width="1" />
      <text x="14" y="24" fill="#475569" font-family="'Inter', sans-serif" font-size="12" font-weight="bold">Exp. 440212005-2019-32</text>
      <text x="14" y="44" fill="#64748b" font-family="'Inter', sans-serif" font-size="10.5">Delito: Negociación Incompatible</text>
      <text x="14" y="62" fill="#64748b" font-family="'Inter', sans-serif" font-size="9.5">Imputado: Consorcio Vial Lima</text>
      <line x1="14" y1="72" x2="266" y2="72" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2" />
      <text x="14" y="84" fill="#dc2626" font-family="monospace" font-size="8.5" font-weight="bold">VENCIMIENTO FINAL: 02/03/2024 (PRESCRITA)</text>
      <rect x="210" y="10" width="56" height="18" rx="4" fill="#fee2e2" />
      <text x="238" y="22" fill="#b91c1c" font-family="'Inter', sans-serif" font-weight="bold" font-size="8.5" text-anchor="middle">EXPIRED</text>
    </g>
  </g>

  <!-- COLUMN 2: REGISTRO/DIAGNÓSTICO PENAL (Main Analyzer) -->
  <g transform="translate(370, 166)">
    <rect width="660" height="690" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
    <text x="24" y="36" fill="#0f172a" font-family="'Inter', sans-serif" font-size="15" font-weight="950">Sección de Calificación y Diagnóstico Fiscal</text>
    <text x="24" y="52" fill="#64748b" font-family="'Inter', sans-serif" font-size="11">Parámetros objetivos para la liquidación constitucional de investigación</text>

    <!-- Qualification Form Mockup (Fields) -->
    <g transform="translate(24, 76)">
      <!-- Field 1 -->
      <rect width="288" height="64" rx="10" fill="#f8fafc" stroke="#e2e8f0" />
      <text x="16" y="22" fill="#64748b" font-family="'Inter', sans-serif" font-size="10" font-weight="bold">CÓDIGO DEL EXPEDIENTE PENAL</text>
      <text x="16" y="46" fill="#0f172a" font-family="'Inter', sans-serif" font-size="14" font-weight="bold">${currentCase.id}</text>
      
      <!-- Field 2 -->
      <g transform="translate(310, 0)">
        <rect width="288" height="64" rx="10" fill="#f8fafc" stroke="#e2e8f0" />
        <text x="16" y="22" fill="#64748b" font-family="'Inter', sans-serif" font-size="10" font-weight="bold">FECHA DEL HECHO IMPUTOR</text>
        <text x="16" y="46" fill="#0f172a" font-family="'Inter', sans-serif" font-size="14" font-weight="bold">${currentCase.fechaHecho}</text>
      </g>
    </g>

    <!-- Section 2: Diagnóstico Result Widget -->
    <g transform="translate(24, 160)">
      <rect width="600" height="280" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
      <!-- Light Gradient inner border -->
      <path d="M 0,10 A 10,10 0 0,1 10,0 L 590,0 A 10,10 0 0,1 600,10 L 600,60 L 0,60 Z" fill="#0F172A" />
      <text x="20" y="34" fill="#ffffff" font-family="'Inter', sans-serif" font-size="13" font-weight="bold">RESULTADO TÉCNICO DE PRESCRIPCIÓN PENAL</text>
      
      <!-- Active Case Badge in dark area -->
      <rect x="490" y="16" width="90" height="26" rx="6" fill="${alertBg}" stroke="${alertColor}" />
      <text x="535" y="32" fill="${alertColor}" font-family="'Inter', sans-serif" font-weight="bold" font-size="10" text-anchor="middle">${prescripcion.estaPrescrito ? 'PRESCRITO' : 'VIGENTE'}</text>

      <!-- Numerical Metrics -->
      <g transform="translate(20, 80)">
        <!-- Metric A -->
        <rect width="168" height="68" rx="8" fill="#f8fafc" stroke="#e2e8f0" />
        <text x="84" y="25" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="9" font-weight="bold" text-anchor="middle">AÑOS ASIGNADOS VIGENTE</text>
        <text x="84" y="52" fill="#1e293b" font-family="'Inter', sans-serif" font-size="18" font-weight="900" text-anchor="middle">${prescripcion.añosRestantes} Años</text>

        <!-- Metric B -->
        <g transform="translate(188, 0)">
          <rect width="168" height="68" rx="8" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="84" y="25" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="9" font-weight="bold" text-anchor="middle">DÍAS ÚTILES RESTANTES</text>
          <text x="84" y="52" fill="#1e293b" font-family="'Inter', sans-serif" font-size="18" font-weight="900" text-anchor="middle">${prescripcion.díasRestantes} Días</text>
        </g>

        <!-- Metric C -->
        <g transform="translate(376, 0)">
          <rect width="184" height="68" rx="8" fill="#eef2ff" stroke="#e0e7ff" />
          <text x="92" y="25" fill="#4f46e5" font-family="'Inter', sans-serif" font-size="9" font-weight="bold" text-anchor="middle">VIGENCIA FINAL EXACTA</text>
          <text x="92" y="52" fill="#312e81" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">${formatToDMY(prescripcion.fechaLimiteFinal)}</text>
        </g>
      </g>

      <!-- Detailed timelines -->
      <g transform="translate(20, 166)">
        <text x="0" y="20" fill="#475569" font-family="'Inter', sans-serif" font-size="11">Plazo de Presitración Ordinaria (Art. 80 CP):</text>
        <text x="560" y="20" fill="#0f172a" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end">${prescripcion.plazoOrdinario} años (F. Vto: ${formatToDMY(prescripcion.fechaLimiteOrdinaria)})</text>

        <text x="0" y="42" fill="#475569" font-family="'Inter', sans-serif" font-size="11">Plazo de Presitración Extraordinaria (Art. 83 CP):</text>
        <text x="560" y="42" fill="#0f172a" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end">${prescripcion.plazoExtraordinario} años (F. Vto: ${formatToDMY(prescripcion.fechaLimiteExtraordinaria)})</text>

        <text x="0" y="64" fill="#475569" font-family="'Inter', sans-serif" font-size="11">Suspensión Formalizada (Ley N° 31751):</text>
        <text x="560" y="64" fill="#4f46e5" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end">${prescripcion.suspensionAplicadaVal > 0 ? 'Aplicada SÍ (+1 Año de Extensión)' : 'Ninguna'}</text>
      </g>
    </g>

    <!-- Block 3: Deadlines for Investigation -->
    <g transform="translate(24, 460)">
      <rect width="600" height="200" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
      <text x="20" y="32" fill="#0f172a" font-family="'Inter', sans-serif" font-size="13" font-weight="bold">CONTROL DE ETAPA PROCESAL DE INVESTIGACIÓN</text>
      <text x="20" y="48" fill="#64748b" font-family="'Inter', sans-serif" font-size="10">Control operativo de plazos preclusivos de investigación fiscal</text>

      <!-- Progress bar mockup -->
      <rect x="20" y="74" width="560" height="20" rx="10" fill="#e2e8f0" />
      <rect x="20" y="74" width="340" height="20" rx="10" fill="#4f46e5" opacity="0.8" />
      <text x="180" y="88" fill="#ffffff" font-family="'Inter', sans-serif" font-size="10" font-weight="bold" text-anchor="middle">Plazo Consumido: 60%</text>

      <g transform="translate(20, 116)">
        <text x="0" y="20" fill="#475569" font-family="'Inter', sans-serif" font-size="11">Etapa de la Carpeta Penal:</text>
        <text x="560" y="20" fill="#0f172a" font-family="'Inter', sans-serif" font-weight="bold" text-anchor="end">DILIGENCIAS PRELIMINARES S.P. (60 + 60 DÍAS)</text>

        <text x="0" y="44" fill="#475569" font-family="'Inter', sans-serif" font-size="11">Vencimiento Máximo Oficial Decretado:</text>
        <text x="560" y="44" fill="#ef4444" font-family="monospace" font-size="11.5" font-weight="bold" text-anchor="end">${formatToDMY(plazo.fechaVencimiento)} (${plazo.plazoDiasPermitidos} días)</text>
      </g>
    </g>
  </g>

  <!-- COLUMN 3: IA JURISPRUDENCIAL Y CEDULA (AI & Documents) -->
  <g transform="translate(1050, 166)">
    <rect width="360" height="690" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
    
    <!-- Header visual -->
    <rect width="360" height="66" rx="12" fill="#0f172a" />
    <text x="20" y="32" fill="#ffffff" font-family="'Inter', sans-serif" font-size="13" font-weight="bold">🤖 Asistente Jurídico IA</text>
    <text x="20" y="48" fill="#64748b" font-family="'Inter', sans-serif" font-size="10">Jurisprudencia Integrada MPFN del Perú</text>

    <!-- Feedback text box -->
    <g transform="translate(20, 86)">
      <rect width="320" height="300" rx="10" fill="#334155" stroke="#475569" />
      <text x="16" y="28" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="10.5" font-weight="bold">ESTUDIO DE CASOS Y MARCO CONSTITUCIONAL</text>
      
      <!-- Multiline simulated response -->
      <text x="16" y="56" fill="#f8fafc" font-family="'Inter', sans-serif" font-size="11" leading="18">
        <tspan x="16" dy="0">De conformidad con la Ley N° 31751,</tspan>
        <tspan x="16" dy="18">el hito suspensivo extiende el cómputo</tspan>
        <tspan x="16" dy="18">por un periodo único e inmodificable</tspan>
        <tspan x="16" dy="18">de 1 año de vigencia.</tspan>
        <tspan x="16" dy="24">Se advierte al Magistrado de Turno</tspan>
        <tspan x="16" dy="18">tomar las providencias preventivas</tspan>
        <tspan x="16" dy="18">en virtud que restan ${prescripcion.díasRestantes} días</tspan>
        <tspan x="16" dy="18">antes de consumarse la prescripción</tspan>
        <tspan x="16" dy="18">ordinaria de esta causa judicial penal.</tspan>
      </text>
    </g>

    <!-- Action Bar -->
    <g transform="translate(20, 410)">
      <rect width="320" height="200" rx="10" fill="#0f172a" stroke="#334155" />
      <text x="16" y="30" fill="#ffffff" font-family="'Inter', sans-serif" font-size="11.5" font-weight="bold">DESPACHO / CÉDULA DE ADVERTENCIA</text>
      
      <rect x="16" y="52" width="288" height="38" rx="6" fill="#4f46e5" />
      <text x="160" y="76" fill="#ffffff" font-family="'Inter', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">⚙️ REDACTAR CÉDULA AUTOMÁTICA</text>

      <rect x="16" y="100" width="288" height="38" rx="6" fill="#10b981" />
      <text x="160" y="124" fill="#ffffff" font-family="'Inter', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">🖨️ IMPRIMIR REPORTE FISCALÍA</text>
      
      <text x="16" y="172" fill="#64748b" font-family="'Inter', sans-serif" font-size="9.5" text-anchor="start">Módulo de Integridad Digital - MPFN 2026</text>
    </g>
  </g>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `figma_full_dashboard_${currentCase.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in" id="figma-exporter-modal">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Modal Header */}
        <div className="bg-slate-950 text-white p-6 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg">
              <Figma className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                Exportador Completo a Figma (Edición 2026)
              </h2>
              <p className="text-xs text-slate-400">
                Lleva todo el Módulo de Alertas de Prescripción y Plazos a Figma con capas e interactividad real.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6">
          <button 
            onClick={() => setActiveTab('svg')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'svg' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            1. Lienzo Completo (Full Dashboard SVG)
          </button>
          <button 
            onClick={() => setActiveTab('html')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'html' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            2. Código Copiable (HTML to Figma)
          </button>
          <button 
            onClick={() => setActiveTab('design-system')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'design-system' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            3. Sistema de Diseño (Design Tokens)
          </button>
          <button 
            onClick={() => setActiveTab('guide')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'guide' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Kanban className="w-4 h-4" />
            4. Guía de Conexión de Prototipo
          </button>
        </div>

        {/* Tab contents (Scrollable body) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {activeTab === 'svg' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3.5 text-xs text-indigo-900">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="font-bold">Lienzo Vectorial Completo de Tres Columnas (Dashboard Master)</p>
                  <p className="text-indigo-850 mt-1">
                    Exporta una plantilla vectorial completa que replica los tres bloques principales del proyecto: <b>Bandeja de Investigación (Lista)</b>, <b>Diagnóstico de Prescripción (Calculadora)</b>, y el <b>Asistente IA (Generador de Cédulas)</b> con los datos consolidados del caso actual.
                  </p>
                </div>
              </div>

              {/* Desktop Preview layout card */}
              <div className="border border-slate-200 rounded-xl p-8 bg-slate-950 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-radial-gradient from-slate-900 to-slate-950 opacity-90"></div>
                
                {/* Simulated workspace skeleton preview */}
                <div className="z-10 w-full max-w-lg bg-slate-900/40 border border-slate-800 rounded-lg p-3 grid grid-cols-3 gap-2 opacity-60 mb-6 group-hover:scale-105 transition-all">
                  <div className="h-20 bg-slate-800 rounded-md border border-slate-705"></div>
                  <div className="h-20 bg-slate-800 rounded-md border border-slate-705"></div>
                  <div className="h-20 bg-slate-800 rounded-md border border-slate-705"></div>
                </div>

                <div className="text-center space-y-3 z-10 max-w-md">
                  <h4 className="text-white font-bold text-sm">Descargar Lienzo de Alta Fidelidad (.SVG)</h4>
                  <p className="text-slate-400 text-xs">
                    Arrástralo directamente en Figma para desagrupar las capas, editar textos con Inter y aplicar tus estilos.
                  </p>
                  <button 
                    onClick={downloadFullDashboardSVG}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition shadow-lg hover:shadow-indigo-500/20"
                  >
                    <Download className="w-4 h-4" />
                    Descargar Lienzo Dashboard Completo
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'html' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-xs text-slate-700">
                <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">¿Cómo importar código HTML con Auto-Layout editable en Figma?</p>
                  <p className="mt-1 leading-relaxed">
                    1. En Figma, instala o abre el plugin gratuito <b>html.to.design</b> o <b>Builder.io</b>.<br />
                    2. Selecciona la pestaña/pantalla que deseas exportar abajo.<br />
                    3. Haz clic en "Copiar Código", regresa a la consola del plugin de Figma y pega para renderizar capas reales con auto-layout y tipografía pericial.
                  </p>
                </div>
              </div>

              {/* Selector de Pantallas */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedHtmlView('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedHtmlView === 'dashboard' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Dashboard Completo (1440px)
                </button>
                <button
                  onClick={() => setSelectedHtmlView('caselist')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedHtmlView === 'caselist' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Bandeja de Casos (Columna 1)
                </button>
                <button
                  onClick={() => setSelectedHtmlView('analyzer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedHtmlView === 'analyzer' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Calificador & Diagnóstico (Columna 2)
                </button>
                <button
                  onClick={() => setSelectedHtmlView('aiassistant')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedHtmlView === 'aiassistant' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Asistente legal IA (Columna 3)
                </button>
              </div>

              {/* Code display box */}
              <div className="relative">
                <button
                  onClick={handleCopyHTML}
                  className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-lg transition text-[10px] uppercase font-bold flex items-center gap-1 z-10 shadow-sm"
                >
                  {copiedHTML ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Código
                    </>
                  )}
                </button>
                <pre className="p-4 bg-slate-900 text-slate-300 font-mono text-[11px] rounded-xl overflow-x-auto max-h-[260px] leading-relaxed border border-slate-800">
                  {getFigmaHtmlCode(selectedHtmlView)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'design-system' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                <p className="font-bold text-slate-900">Variables Globales y Tokens del Proyecto</p>
                <p className="mt-1 text-slate-500">Puedes recrear de forma manual o automatizada el look-and-feel corporativo utilizando los siguientes parámetros del sistema de la Fiscalía:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-3 border border-slate-150 rounded-lg bg-white space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Palette Primario</span>
                    <div className="flex gap-1.5 items-center">
                      <div className="w-4 h-4 rounded bg-slate-900"></div>
                      <span className="font-mono text-xs font-bold">#0F172A</span>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <div className="w-4 h-4 rounded bg-indigo-600"></div>
                      <span className="font-mono text-xs font-bold">#4F46E5</span>
                    </div>
                  </div>

                  <div className="p-3 border border-slate-150 rounded-lg bg-white space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Píldoras Informativas</span>
                    <div className="flex gap-1.5 items-center">
                      <div className="w-4 h-4 rounded bg-emerald-500"></div>
                      <span className="font-mono text-xs font-bold">Vigente: #10B981</span>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <div className="w-4 h-4 rounded bg-red-500"></div>
                      <span className="font-mono text-xs font-bold">Prescrito: #EF4444</span>
                    </div>
                  </div>

                  <div className="p-3 border border-slate-150 rounded-lg bg-white space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Tipografía de Capa</span>
                    <p className="font-bold text-xs">Inter / Outfit</p>
                    <p className="text-[11px] text-slate-500">Filtro de pesos desde Regular (400) hasta Ultra-Black (950).</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-xs text-amber-900">
                <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Especificaciones Generales de la Arquitectura Lógica de Fiscales</p>
                  <p className="mt-1">
                    Copia la especificación estructural abajo y utilízala para configurar las interacciones Smart Animate o mapeos condicionales en el distrito de diseño de Figma.
                  </p>
                </div>
              </div>

              {/* Spec view */}
              <div className="relative">
                <button
                  onClick={handleCopySpec}
                  className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-lg transition text-[10px] uppercase font-bold flex items-center gap-1"
                >
                  {copiedSpec ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Parámetros
                    </>
                  )}
                </button>
                <pre className="p-4 bg-slate-900 text-amber-400 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                  {getFigmaStateFlowSpec()}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-900 border-t border-slate-800 px-6 py-4 flex justify-between items-center bg-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Figma className="w-4 h-4 text-rose-500 fill-rose-500" />
            Control de Prototipos de Alta Fidelidad de la Fiscalía
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            Listo, Volver al Workspace
          </button>
        </div>

      </div>
    </div>
  );
}
