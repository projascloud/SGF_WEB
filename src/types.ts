/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PrescripcionType {
  ORDINARIA = 'ORDINARIA',
  EXTRAORDINARIA = 'EXTRAORDINARIA',
}

export enum AlertLevel {
  VIGENTE = 'VIGENTE',      // Safe, still has time
  RIESGO_BAJO = 'RIESGO_BAJO',  // > 1 year remaining but getting closer
  RIESGO_ALTO = 'RIESGO_ALTO',  // < 1 year remaining
  PRESCRITO = 'PRESCRITO',    // Prescribed!
}

export enum ComplexidadStage {
  SIMPLE = 'SIMPLE',
  COMPLEJO = 'COMPLEJO',
  CRIMEN_ORGANIZADO = 'CRIMEN_ORGANIZADO',
}

export enum EtapaInvestigacion {
  DILIGENCIAS_PRELIMINARES = 'DILIGENCIAS_PRELIMINARES',
  INVESTIGACION_PREPARATORIA = 'INVESTIGACION_PREPARATORIA',
}

export interface CrimeDefinition {
  id: string;
  articulo: string;
  delito: string;
  penaMinima: number; // in years
  penaMaxima: number; // in years
  esContraEstado: boolean; // True for corruption/administration - triggers duplicity if public official
}

export interface CaseData {
  id: string; // Case Number / File ID
  fiscalResponsable: string;
  denunciante: string;
  denunciado: string;
  fechaHecho: string; // YYYY-MM-DD
  delitoId: string; // references pre-defined or "custom"
  delitoPersonalizado?: {
    articulo: string;
    delito: string;
    penaMaxima: number;
    esContraEstado: boolean;
  };
  imputadoEdad: number; // Age at time of commission (triggers halving if < 21 or > 65)
  imputadoFuncionarioPublico: boolean; // Triggers duplicity for administrative crimes
  
  // New Case details fields requested by user
  narracionHechos?: string;
  lugarHechos?: string;
  lugarLatLng?: { lat: number; lng: number };
  informePolicial?: string;
  dependenciaPolicial?: string;
  fechaDenunciaPolicial?: string;
  attachments?: Attachment[];
  partes?: CaseParty[];
  
  // Investigation milestones (milestones that interrupt/suspend)
  fechaFormalizacion?: string; // Suspends prescription (Ley 31751, max 1 year)
  fechaAcusacion?: string; // Interrupts prescription
  fechaOtrasDiligencias?: string; // Dates of key acts that interrupt (fiscal orders, etc.)
  
  // Plazos Procesales Tracker (investigation durations)
  etapaActual: EtapaInvestigacion;
  fechaInicioEtapa: string; // YYYY-MM-DD
  complejidad: ComplexidadStage;
  esProrrogado: boolean; // Stage is extended
  
  fechaCreacion: string;
}

export interface PrescripcionResult {
  plazoOrdinario: number; // in years
  plazoExtraordinario: number; // in years
  reduccionPorEdad: boolean;
  duplicadoPorFuncionario: boolean;
  suspensionAplicadaVal: number; // in years (max 1 year under Ley 31751)
  fechaLimiteOrdinaria: string;
  fechaLimiteExtraordinaria: string;
  fechaLimiteFinal: string; // The ultimate date considering suspension
  añosRestantes: number;
  díasRestantes: number;
  estaPrescrito: boolean;
  alertaNivel: AlertLevel;
}

export interface PlazoProcesalResult {
  plazoDiasPermitidos: number;
  fechaVencimiento: string;
  díasTranscurridos: number;
  díasRestantes: number;
  vencido: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'document' | 'audio' | 'image';
  size: string;
  uploadedAt: string;
  contentUrl?: string; // Standard file URL (Blob URL, object URL, or server-side asset)
  mockContent?: {
    header?: string;
    sections?: { title: string; body: string }[];
    footer?: string;
    transcription?: string;
    duration?: string;
    audioUrl?: string;
    imageUrl?: string;
  };
}

export interface CaseParty {
  id: string;
  name: string;
  type: 'denunciante' | 'denunciado' | 'imputado' | 'agraviado';
  documentType?: 'DNI' | 'RUC' | 'CE' | 'Pasaporte';
  documentNumber?: string;
  notes?: string;
}

