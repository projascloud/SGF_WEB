/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CaseData,
  CrimeDefinition,
  PrescripcionResult,
  PlazoProcesalResult,
  AlertLevel,
  EtapaInvestigacion,
  ComplexidadStage,
} from '../types';

// Curated list of common Peruvian Crimes as per Criminal Code (Código Penal)
export const COMMON_DELITOS: CrimeDefinition[] = [
  { id: 'hurto_simple', articulo: 'Art. 185', delito: 'Hurto Simple', penaMinima: 1, penaMaxima: 3, esContraEstado: false },
  { id: 'hurto_agravado', articulo: 'Art. 186', delito: 'Hurto Agravado', penaMinima: 3, penaMaxima: 6, esContraEstado: false },
  { id: 'robo_simple', articulo: 'Art. 188', delito: 'Robo Simple', penaMinima: 3, penaMaxima: 8, esContraEstado: false },
  { id: 'robo_agravado', articulo: 'Art. 189', delito: 'Robo Agravado', penaMinima: 12, penaMaxima: 20, esContraEstado: false },
  { id: 'homicidio_simple', articulo: 'Art. 106', delito: 'Homicidio Simple', penaMinima: 6, penaMaxima: 20, esContraEstado: false },
  { id: 'estafa_simple', articulo: 'Art. 196', delito: 'Estafa Simple', penaMinima: 1, penaMaxima: 6, esContraEstado: false },
  { id: 'omision_asistencia', articulo: 'Art. 149', delito: 'Omisión de Asistencia Familiar', penaMinima: 1, penaMaxima: 3, esContraEstado: false },
  { id: 'trafico_drogas_base', articulo: 'Art. 296', delito: 'Tráfico Ilícito de Drogas (Tipo Base)', penaMinima: 8, penaMaxima: 15, esContraEstado: false },
  
  // Crimes against state (Corruption) - These trigger Duplicity if official commits them
  { id: 'peculado_doloso', articulo: 'Art. 387', delito: 'Peculado Doloso por Apropiación', penaMinima: 4, penaMaxima: 8, esContraEstado: true },
  { id: 'colusion_simple', articulo: 'Art. 384', delito: 'Colusión Simple', penaMinima: 3, penaMaxima: 6, esContraEstado: true },
  { id: 'colusion_agravada', articulo: 'Art. 384', delito: 'Colusión Agravada', penaMinima: 6, penaMaxima: 15, esContraEstado: true },
  { id: 'cohecho_pasivo_propio', articulo: 'Art. 393', delito: 'Cohecho Pasivo Propio (Coima)', penaMinima: 5, penaMaxima: 8, esContraEstado: true },
  { id: 'negociacion_incompatible', articulo: 'Art. 399', delito: 'Negociación Incompatible', penaMinima: 4, penaMaxima: 6, esContraEstado: true },
];

/**
 * Helper to add days to a date string (YYYY-MM-DD)
 */
export function addDays(dateStr: string, days: number): string {
  const safeDateStr = (dateStr ? String(dateStr) : '').trim() || new Date().toISOString().split('T')[0];
  const date = new Date(safeDateStr + 'T12:00:00'); // Use noon to avoid local timezone issues
  if (isNaN(date.getTime())) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + days);
    return fallback.toISOString().split('T')[0];
  }
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Helper to add months to a date string (YYYY-MM-DD)
 */
export function addMonths(dateStr: string, months: number): string {
  const safeDateStr = (dateStr ? String(dateStr) : '').trim() || new Date().toISOString().split('T')[0];
  const date = new Date(safeDateStr + 'T12:00:00');
  if (isNaN(date.getTime())) {
    const fallback = new Date();
    fallback.setMonth(fallback.getMonth() + months);
    return fallback.toISOString().split('T')[0];
  }
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
}

/**
 * Helper to add years to a date string (YYYY-MM-DD)
 */
export function addYears(dateStr: string, years: number): string {
  const safeDateStr = (dateStr ? String(dateStr) : '').trim() || new Date().toISOString().split('T')[0];
  const date = new Date(safeDateStr + 'T12:00:00');
  if (isNaN(date.getTime())) {
    const fallback = new Date();
    fallback.setFullYear(fallback.getFullYear() + years);
    return fallback.toISOString().split('T')[0];
  }
  date.setFullYear(date.getFullYear() + years);
  return date.toISOString().split('T')[0];
}

/**
 * Helper to calculate difference in days between two date strings
 */
export function daysBetween(startStr: string, endStr: string): number {
  const safeStart = (startStr ? String(startStr) : '').trim() || new Date().toISOString().split('T')[0];
  const safeEnd = (endStr ? String(endStr) : '').trim() || new Date().toISOString().split('T')[0];
  
  let start = new Date(safeStart + 'T12:00:00');
  let end = new Date(safeEnd + 'T12:00:00');
  
  if (isNaN(start.getTime())) start = new Date();
  if (isNaN(end.getTime())) end = new Date();
  
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Performs complete statute of limitation analysis for a given case
 */
export function calcularPrescripcion(caseData: CaseData, customDelito?: CrimeDefinition): PrescripcionResult {
  // 1. Get Crime Definition
  let delito: CrimeDefinition | undefined;
  if (caseData.delitoId === 'custom' && customDelito) {
    delito = customDelito;
  } else if (caseData.delitoId === 'custom' && caseData.delitoPersonalizado) {
    delito = {
      id: 'custom',
      articulo: caseData.delitoPersonalizado.articulo,
      delito: caseData.delitoPersonalizado.delito,
      penaMinima: 0,
      penaMaxima: caseData.delitoPersonalizado.penaMaxima,
      esContraEstado: caseData.delitoPersonalizado.esContraEstado,
    };
  } else {
    delito = COMMON_DELITOS.find((d) => d.id === caseData.delitoId) || COMMON_DELITOS[0];
  }

  // 2. Determine base ordinary limit (Plazo Ordinario Base)
  let plazoOrdinario = delito.penaMaxima;

  // Under Article 80: Ordinary prescription cannot be less than 3 years for prison-sentence crimes
  // We'll treat this as general rule in criminal cases
  if (plazoOrdinario < 3) {
    plazoOrdinario = 3;
  }

  // 3. Double check State/Corruption duplicity (Duplicidad conforme al Art. 80 y Art. 41 de la Constitución)
  let duplicadoPorFuncionario = false;
  if (delito.esContraEstado && caseData.imputadoFuncionarioPublico) {
    plazoOrdinario = plazoOrdinario * 2;
    duplicadoPorFuncionario = true;
  }

  // 4. Reduce by half due to age (Art. 81 CP: < 21 o > 65)
  let reduccionPorEdad = false;
  if (caseData.imputadoEdad < 21 || caseData.imputadoEdad > 65) {
    plazoOrdinario = plazoOrdinario / 2;
    reduccionPorEdad = true;
  }

  // 5. Calculate extraordinary limit (Plazo Extraordinario)
  // Extraordinary prescription is ordinary + 50%
  let plazoExtraordinario = plazoOrdinario * 1.5;

  // When calculating final dates, we must add these years to the Date of the Crime
  const fechaHecho = caseData.fechaHecho;
  
  // Calculate raw limits based in years
  // Note: if years has Decimals (like 4.5), we add full days (0.5 year = 182 days)
  const addFlexibleYears = (baseDate: string, years: number): string => {
    const fullYears = Math.floor(years);
    const decimal = years - fullYears;
    let computedDate = addYears(baseDate, fullYears);
    if (decimal > 0) {
      const extraDays = Math.round(decimal * 365);
      computedDate = addDays(computedDate, extraDays);
    }
    return computedDate;
  };

  const fechaLimiteOrdinaria = addFlexibleYears(fechaHecho, plazoOrdinario);
  let fechaLimiteExtraordinaria = addFlexibleYears(fechaHecho, plazoExtraordinario);

  // 6. Application of Suspension due to Preparatory Investigation (Ley 31751)
  // Under Ley 31751, formalization suspends prescription for up to 1 year.
  let suspensionAplicadaVal = 0; // in years
  let fechaLimiteFinal = fechaLimiteExtraordinaria; // Under investigation, extraordinary limit is the critical one

  if (caseData.fechaFormalizacion) {
    suspensionAplicadaVal = 1; // 1 year suspension
    fechaLimiteFinal = addYears(fechaLimiteExtraordinaria, 1);
  }

  // 7. Calculate time left in comparison to Current Date
  // The user profile or local time is 2026-06-09
  // We will compare against the actual current date parsed
  const hoyStr = new Date().toISOString().split('T')[0];
  const totalDiasRestantes = daysBetween(hoyStr, fechaLimiteFinal);
  const totalAnosRestantes = totalDiasRestantes / 365;

  // 8. Analyze validity and establish Alert Nivel
  const estaPrescrito = totalDiasRestantes <= 0;
  let alertaNivel = AlertLevel.VIGENTE;

  if (estaPrescrito) {
    alertaNivel = AlertLevel.PRESCRITO;
  } else if (totalDiasRestantes < 180) { // < 6 months is extremely dangerous
    alertaNivel = AlertLevel.RIESGO_ALTO;
  } else if (totalDiasRestantes < 365) { // < 1 year is medium-high risk
    alertaNivel = AlertLevel.RIESGO_ALTO;
  } else if (totalDiasRestantes < 730) { // < 2 years is low-medium risk
    alertaNivel = AlertLevel.RIESGO_BAJO;
  }

  return {
    plazoOrdinario,
    plazoExtraordinario,
    reduccionPorEdad,
    duplicadoPorFuncionario,
    suspensionAplicadaVal,
    fechaLimiteOrdinaria,
    fechaLimiteExtraordinaria,
    fechaLimiteFinal,
    añosRestantes: Math.max(0, parseFloat(totalAnosRestantes.toFixed(2))),
    díasRestantes: Math.max(0, totalDiasRestantes),
    estaPrescrito,
    alertaNivel,
  };
}

/**
 * Calculates research duration and status based on fiscal stages
 */
export function calcularPlazoProcesal(caseData: CaseData): PlazoProcesalResult {
  let plazoDiasPermitidos = 60;
  const etapa = caseData.etapaActual;
  const complejidad = caseData.complejidad;
  const prorrogado = caseData.esProrrogado;
  
  if (etapa === EtapaInvestigacion.DILIGENCIAS_PRELIMINARES) {
    if (complejidad === ComplexidadStage.SIMPLE) {
      plazoDiasPermitidos = prorrogado ? 120 : 60;
    } else if (complejidad === ComplexidadStage.COMPLEJO) {
      plazoDiasPermitidos = 240; // 8 months as 240 days
    } else if (complejidad === ComplexidadStage.CRIMEN_ORGANIZADO) {
      plazoDiasPermitidos = 1080; // 36 months as 1080 days
    }
  } else { // INVESTIGACION_PREPARATORIA
    if (complejidad === ComplexidadStage.SIMPLE) {
      plazoDiasPermitidos = prorrogado ? 180 : 120; // 120 + 60 days
    } else if (complejidad === ComplexidadStage.COMPLEJO) {
      plazoDiasPermitidos = prorrogado ? 480 : 240; // 8 months (240 days) + 8 months (240 days)
    } else if (complejidad === ComplexidadStage.CRIMEN_ORGANIZADO) {
      plazoDiasPermitidos = prorrogado ? 2160 : 1080; // 36 months (1080 days) + 36 months (1080 days)
    }
  }

  const hoyStr = new Date().toISOString().split('T')[0];
  const fechaInicio = caseData.fechaInicioEtapa;
  
  // Calculate ending date
  const fechaVencimiento = addDays(fechaInicio, plazoDiasPermitidos);
  
  const díasTranscurridos = Math.max(0, daysBetween(fechaInicio, hoyStr));
  const díasRestantes = daysBetween(hoyStr, fechaVencimiento);
  const vencido = díasRestantes < 0;

  return {
    plazoDiasPermitidos,
    fechaVencimiento,
    díasTranscurridos,
    díasRestantes: vencido ? 0 : díasRestantes,
    vencido,
  };
}

export const defaultNewCase = (): CaseData => {
  const hoyStr = new Date().toISOString().split('T')[0];
  return {
    id: `F-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
    fiscalResponsable: '',
    denunciante: '',
    denunciado: '',
    fechaHecho: hoyStr,
    delitoId: COMMON_DELITOS[0].id,
    delitoPersonalizado: {
      articulo: 'Art. ',
      delito: '',
      penaMaxima: 5,
      esContraEstado: false
    },
    imputadoEdad: 35,
    imputadoFuncionarioPublico: false,
    narracionHechos: '',
    lugarHechos: 'Centro de Lima, Perú',
    lugarLatLng: { lat: -12.046374, lng: -77.042793 },
    informePolicial: '',
    dependenciaPolicial: '',
    fechaDenunciaPolicial: '',
    fechaFormalizacion: '',
    etapaActual: EtapaInvestigacion.DILIGENCIAS_PRELIMINARES,
    fechaInicioEtapa: hoyStr,
    complejidad: ComplexidadStage.SIMPLE,
    esProrrogado: false,
    fechaCreacion: hoyStr,
    partes: []
  };
};

/**
 * Formats a YYYY-MM-DD date string into DD/MM/YYYY (dias/mes/año)
 */
export function formatToDMY(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const parts = dateStr.trim().split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Decomposes a total number of remaining days into "días / meses / años" (formato dias/mes/año)
 */
export function formatRemainingTimeToDMY(daysLeft: number): string {
  if (daysLeft <= 0) return '0 días / 0 meses / 0 años';
  
  const years = Math.floor(daysLeft / 365);
  const remainingDaysAfterYears = daysLeft % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = remainingDaysAfterYears % 30;

  const parts: string[] = [];
  parts.push(`${days} ${days === 1 ? 'día' : 'días'}`);
  parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);
  parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
  
  return parts.join(' / ');
}

