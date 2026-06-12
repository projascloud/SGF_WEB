/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CaseData, PrescripcionResult } from '../types';
import { COMMON_DELITOS } from '../utils/calculations';
import { Sparkles, Copy, Check, AlertTriangle, FileText, Loader2, RefreshCw } from 'lucide-react';

interface LegalAssistantProps {
  currentCase: CaseData;
  calculationResult: PrescripcionResult;
}

// Simple but elegant markdown to HTML parser to avoid dependency issues while maintaining professional typography
function renderSimpleMarkdown(markdownText: string): React.ReactNode {
  if (!markdownText) return <p className="text-slate-400 italic">No hay contenido disponible.</p>;

  const lines = markdownText.split('\n');
  return (
    <div className="space-y-4 text-xs tracking-wide leading-relaxed text-slate-800 font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        
        // Headers
        if (trimmed.startsWith('###')) {
          return (
            <h4 key={idx} className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 mt-4 mb-2 flex items-center gap-1.5 uppercase font-sans">
              <span className="w-1 h-3 bg-slate-900 rounded-full"></span>
              {trimmed.replace('###', '').trim()}
            </h4>
          );
        }
        if (trimmed.startsWith('##')) {
          return (
            <h3 key={idx} className="text-sm font-extrabold text-slate-950 border-b border-slate-200 pb-1.5 mt-5 mb-3 flex items-center gap-2 uppercase font-sans">
              <span className="w-1.5 h-4 bg-slate-900 rounded"></span>
              {trimmed.replace('##', '').trim()}
            </h3>
          );
        }
        if (trimmed.startsWith('#')) {
          return (
            <h2 key={idx} className="text-base font-black text-slate-950 border-b-2 border-slate-900 pb-2 mt-6 mb-4 flex items-center gap-2 font-display">
              {trimmed.replace('#', '').trim()}
            </h2>
          );
        }

        // Bullet points
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const content = trimmed.substring(1).trim();
          return (
            <div key={idx} className="pl-4 relative flex items-start gap-1.5 my-1 font-sans text-xs">
              <span className="text-slate-900 font-bold shrink-0 select-none">•</span>
              <span>{parseBoldItalic(content)}</span>
            </div>
          );
        }

        // Table Rows
        if (trimmed.startsWith('|') && trimmed.endsWith('|') && !trimmed.includes('---')) {
          const cells = trimmed.split('|').map(c => c.trim()).filter(c => c !== '');
          return (
            <div key={idx} className="bg-slate-50/50 border-x border-b border-slate-200 flex first:border-t text-[11px] font-sans">
              {cells.map((cell, cIdx) => (
                <div key={cIdx} className="flex-1 p-2 border-r last:border-r-0 font-medium text-slate-700">
                  {parseBoldItalic(cell)}
                </div>
              ))}
            </div>
          );
        }

        // Blockquotes
        if (trimmed.startsWith('>')) {
          return (
            <blockquote key={idx} className="border-l-4 border-amber-500 bg-amber-55/30 px-3 py-2 text-xs text-slate-700 rounded-r italic my-2">
              {parseBoldItalic(trimmed.substring(1).trim())}
            </blockquote>
          );
        }

        // Empty lines
        if (trimmed === '') {
          return <div key={idx} className="h-2"></div>;
        }

        // Default paragraph
        return (
          <p key={idx} className="text-xs leading-relaxed font-sans text-slate-750">
            {parseBoldItalic(line)}
          </p>
        );
      })}
    </div>
  );
}

// Inline formatting parser for **bold** and *italic*
function parseBoldItalic(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let keyIdx = 0;

  // Pattern for Bold
  const boldRegex = /\*\*([^*]+)\*\*/;
  
  while (currentText) {
    const boldMatch = boldRegex.exec(currentText);
    
    if (boldMatch) {
      const matchIndex = boldMatch.index;
      const matchLength = boldMatch[0].length;
      
      if (matchIndex > 0) {
        parts.push(<span key={keyIdx++}>{currentText.substring(0, matchIndex)}</span>);
      }
      
      parts.push(<strong key={keyIdx++} className="font-bold text-slate-900">{boldMatch[1]}</strong>);
      currentText = currentText.substring(matchIndex + matchLength);
    } else {
      parts.push(<span key={keyIdx++}>{currentText}</span>);
      break;
    }
  }

  return parts;
}

export default function LegalAssistant({ currentCase, calculationResult }: LegalAssistantProps) {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loadStep, setLoadStep] = useState<number>(0);

  const getCrimeDetails = () => {
    if (currentCase.delitoId === 'custom') {
      return {
        articulo: currentCase.delitoPersonalizado?.articulo || 'Art. ?',
        delito: currentCase.delitoPersonalizado?.delito || 'Delito Especial',
        penaMaxima: currentCase.delitoPersonalizado?.penaMaxima || 0,
        esContraEstado: currentCase.delitoPersonalizado?.esContraEstado || false
      };
    }
    return COMMON_DELITOS.find(d => d.id === currentCase.delitoId) || null;
  };

  const executeAnalysis = async () => {
    setLoading(true);
    setError('');
    setAnalysis('');
    setLoadStep(0);

    // Animation interval to make loader feel responsive and instructional
    const interval = setInterval(() => {
      setLoadStep(prev => (prev + 1) % 3);
    }, 2800);

    try {
      const crimeDetails = getCrimeDetails();
      const response = await fetch('/api/analyze-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseData: currentCase,
          calculationResult,
          crimeDetails
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'No se pudo completar el análisis fiscal.');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'No se pudo conectar con el servidor de análisis fiscal de IA.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loaderSteps = [
    'Analizando hechos, plazos y edad según Código Penal del Perú...',
    'Evaluando la interrupción procesal y el límite absoluto (Art. 83)...',
    ' contrastando plazos de suspensión e impacto de la Ley de Impugnación 31751...'
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full" id="legal-assistant-panel">
      {/* Panel Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Asistente Fiscal de Inteligencia Artificial (IA)
          </h3>
          <p className="text-xs text-slate-500 font-sans">Argumentación jurídica y borrador de disposición fiscal de archivo</p>
        </div>
        {analysis && (
          <button
            onClick={executeAnalysis}
            disabled={loading}
            className="text-xs text-indigo-750 hover:text-indigo-900 font-medium inline-flex items-center gap-1.5 hover:underline disabled:opacity-50"
            title="Volver a generar"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Recalcular IA
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-center min-h-[350px]">
        
        {loading && (
          <div className="text-center py-10 max-w-sm mx-auto space-y-4 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-slate-900">Configurando Informe Fiscal</h4>
              <p className="text-xs text-slate-500 font-mono italic animate-pulse">
                {loaderSteps[loadStep]}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center max-w-md mx-auto space-y-3 animate-fadeIn">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-red-950">Error al Analizar Carpeta</h4>
              <p className="text-xs text-red-700 leading-relaxed font-sans">{error}</p>
            </div>
            <div className="pt-2 text-xxs text-slate-400">
              Por favor, asegúrate de que tu clave secreta de Gemini API esté cargada en la barra de Ajustes (Secrets).
            </div>
            <button
              onClick={executeAnalysis}
              className="bg-red-100 hover:bg-red-200 text-red-900 text-xs px-3 py-1.5 rounded-lg font-medium transition"
            >
              Reintentar Consulta
            </button>
          </div>
        )}

        {!loading && !error && !analysis && (
          <div className="text-center max-w-md mx-auto py-10 space-y-5 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl text-slate-500 border border-slate-250">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-800">Cargar Argumentación Legal de Fiscalía</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Genera al instante un diagnóstico jurídico completo y formal idóneo para fundar tus disposiciones de archivo penal por prescripción de acción legal (Arts. CP 80-84) o plantear actos urgentes bajo el marco legal peruano.
              </p>
            </div>
            <button
              onClick={executeAnalysis}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg inline-flex items-center gap-2 shadow-md transition"
              id="generate-ia-analysis-btn"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              Generar Diagnóstico Fiscal de IA
            </button>
          </div>
        )}

        {/* Display Text Analysis */}
        {!loading && !error && analysis && (
          <div className="flex flex-col h-full space-y-4 animate-fadeIn">
            
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
              <span className="text-[11px] text-indigo-950 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-650" />
                Informe generado de forma segura. Listo para transferir o incorporar.
              </span>
              <button
                onClick={handleCopy}
                className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-700 hover:text-slate-900 px-3 py-1 rounded inline-flex items-center gap-1 text-[11px] font-semibold rounded-md shadow-xs transition"
                title="Copiar informe al portapapeles"
                id="copy-analysis-btn"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    Copiar
                  </>
                )}
              </button>
            </div>

            {/* Rendered Document View */}
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/10 shadow-inner overflow-y-auto max-h-[500px]">
              {renderSimpleMarkdown(analysis)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
