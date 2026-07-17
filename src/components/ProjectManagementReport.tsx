import React, { useState } from 'react';
import { Briefcase, Download, CheckCircle, Calendar, Users, Cpu, Layers, FileText, AlertTriangle } from 'lucide-react';

export default function ProjectManagementReport() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadDoc = () => {
    setDownloading(true);
    try {
      const htmlContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>Informe Ejecutivo - SIA-CT</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 8.5in 11in;
      margin: 1.0in 1.0in 1.0in 1.0in;
    }
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      line-height: 1.6;
      color: #1e293b;
      margin: 0;
      padding: 0;
    }
    .header-box {
      border: 1.5pt solid #0f172a;
      padding: 18px;
      background-color: #f8fafc;
      margin-bottom: 25pt;
    }
    .header-title {
      color: #0f172a;
      font-size: 20pt;
      font-weight: bold;
      text-align: center;
      margin-top: 0;
      margin-bottom: 10pt;
      text-transform: uppercase;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 10px;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10pt;
    }
    .meta-table td {
      border: none !important;
      padding: 4px 0;
      font-size: 10.5pt;
    }
    .meta-label {
      font-weight: bold;
      color: #475569;
      width: 30%;
    }
    .meta-value {
      color: #0f172a;
    }
    h1 {
      color: #0f172a;
      font-size: 16pt;
      font-weight: bold;
      border-bottom: 1.5pt solid #0f172a;
      padding-bottom: 4px;
      margin-top: 24pt;
      margin-bottom: 12pt;
    }
    h2 {
      color: #1e3a8a;
      font-size: 13pt;
      font-weight: bold;
      margin-top: 18pt;
      margin-bottom: 8pt;
      border-bottom: 0.75pt solid #e2e8f0;
      padding-bottom: 2px;
    }
    h3 {
      color: #2563eb;
      font-size: 11pt;
      font-weight: bold;
      margin-top: 12pt;
      margin-bottom: 6pt;
    }
    p {
      font-size: 11pt;
      margin-top: 0;
      margin-bottom: 10pt;
      text-align: justify;
    }
    ul, ol {
      margin-top: 0;
      margin-bottom: 10pt;
      padding-left: 20pt;
    }
    li {
      font-size: 11pt;
      margin-bottom: 4pt;
      text-align: justify;
    }
    .highlight-box {
      border-left: 3.5pt solid #3b82f6;
      padding: 10px 15px;
      background-color: #eff6ff;
      margin-top: 12pt;
      margin-bottom: 12pt;
    }
    .highlight-box p {
      margin: 0;
      font-style: italic;
      color: #1e40af;
    }
    .alert-box {
      border-left: 3.5pt solid #e11d48;
      padding: 10px 15px;
      background-color: #fff1f2;
      margin-top: 12pt;
      margin-bottom: 12pt;
    }
    .alert-box p {
      margin: 0;
      color: #9f1239;
      font-weight: 500;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12pt;
      margin-bottom: 16pt;
    }
    table.data-table th {
      background-color: #0f172a;
      color: #ffffff;
      font-weight: bold;
      font-size: 10pt;
      border: 1px solid #1e293b;
      padding: 8px 10px;
      text-align: left;
    }
    table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      font-size: 10pt;
      vertical-align: top;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      font-size: 8.5pt;
      font-weight: bold;
      border-radius: 4px;
      background-color: #f1f5f9;
      color: #334155;
    }
    .footer-note {
      font-size: 9pt;
      color: #64748b;
      text-align: center;
      margin-top: 40pt;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
    }
  </style>
</head>
<body>

  <div class="header-box">
    <div class="header-title">Informe Técnico Ejecutivo de Viabilidad</div>
    <p style="text-align: center; font-weight: bold; margin-bottom: 15px; color: #475569;">
      SISTEMA INTELIGENTE DE ALERTAS DE PRESCRIPCIÓN Y CONTROL DE TIPICIDAD (SIA-CT)
    </p>
    <table class="meta-table">
      <tr>
        <td class="meta-label">Para:</td>
        <td class="meta-value">Distrito Fiscal - Ministerio Público - Fiscalía de la Nación del Perú</td>
      </tr>
      <tr>
        <td class="meta-label">Atención:</td>
        <td class="meta-value">Despachos Fiscales Penales y Unidades de Tecnologías de la Información</td>
      </tr>
      <tr>
        <td class="meta-label">De:</td>
        <td class="meta-value">Director de Proyectos de TI / Gestor de Proyecto (Project Manager)</td>
      </tr>
      <tr>
        <td class="meta-label">Fecha:</td>
        <td class="meta-value">30 de junio de 2026</td>
      </tr>
      <tr>
        <td class="meta-label">Asunto:</td>
        <td class="meta-value">Arquitectura de Requerimientos y Viabilidad de Desarrollo para el SIA-CT</td>
      </tr>
      <tr>
        <td class="meta-label">Clasificación:</td>
        <td class="meta-value"><span class="badge" style="background-color: #fee2e2; color: #991b1b;">RESERVADO - USO INTERNO</span></td>
      </tr>
    </table>
  </div>

  <h1>1. Resumen Ejecutivo</h1>
  <p>
    El presente documento expone las especificaciones de negocio, arquitectura funcional y requerimientos técnicos necesarios para la ejecución y desarrollo del <b>Sistema Inteligente de Alertas de Prescripción y Control de Tipicidad (SIA-CT)</b>. Este sistema de información está diseñado para ser una herramienta asistencial crítica para los despachos fiscales de la Nación. Su objetivo es doble: automatizar de forma determinista el control de plazos procesales y plazos de prescripción penal, y proporcionar un motor de inteligencia artificial (IA) con procesamiento de lenguaje natural (PLN) para estructurar dogmáticamente la tipicidad penal y parametrizar los medios probatorios.
  </p>
  <div class="highlight-box">
    <p>
      <b>Visión Tecnológico-Legal:</b> Descargar la carga operativa del fiscal mediante automatización rigurosa, garantizando de manera irrestricta el debido proceso bajo el principio fundamental de control humano (human-in-the-loop).
    </p>
  </div>

  <h1>2. Arquitectura de Módulos Funcionales</h1>
  <p>
    El SIA-CT se compone de tres núcleos funcionales interconectados, diseñados para abarcar todo el ciclo de calificación inicial de la denuncia y el monitoreo del plazo procesal.
  </p>

  <h2>Módulo A: Alertas de Prescripción y Monitoreo de Plazos Procesales</h2>
  <p>
    Este módulo opera sobre reglas lógicas puramente deterministas de la dogmática penal peruana, eliminando cualquier margen de incertidumbre interpretativa mediante algoritmos exactos de cálculo procesal:
  </p>
  <ul>
    <li><b>Cálculo de Prescripción Ordinaria y Extraordinaria:</b> Automatización fundamentada en el artículo 80 (límite ordinario equivalente a la pena máxima del delito) y el artículo 83 (límite extraordinario equivalente al plazo ordinario más una mitad adicional) del Código Penal.</li>
    <li><b>Cálculo de Reducción por Edad (Art. 81 CP):</b> Detección de imputados de responsabilidad restringida (mayores de 18 y menores de 21 años, o mayores de 65 años de edad al momento de cometer el ilícito), reduciendo a la mitad los plazos de prescripción de forma automática.</li>
    <li><b>Duplicidad de Plazos (Art. 41 de la Constitución):</b> Identificación de delitos cometidos contra el patrimonio del Estado o contra organismos asistenciales, perpetrados por funcionarios o servidores públicos, aplicando de forma sistemática la duplicidad del plazo de prescripción.</li>
    <li><b>Regulación por Ley N° 31751 (Ley de Suspensión):</b> Configuración automatizada de la suspensión de prescripción por formalización de la investigación preparatoria, estableciendo un límite máximo de un (01) año, tras el cual se reanuda el conteo del plazo de prescripción extraordinaria.</li>
    <li><b>Monitoreo Dinámico de Plazos Procesales:</b> Seguimiento en tiempo real de los plazos de Diligencias Preliminares e Investigación Preparatoria, alertando de forma visual (semáforos de alerta) según el tipo de caso (Simple: 60/120 días; Complejo: 8 meses; Crimen Organizado: 36 meses), incluyendo el cómputo de prórrogas autorizadas.</li>
  </ul>

  <h2>Módulo B: Control de Tipicidad de Casos (Motor de IA)</h2>
  <p>
    Este módulo implementa algoritmos de Procesamiento de Lenguaje Natural (PLN) y modelos fundacionales para estructurar la calificación jurídica y combatir la saturación fiscal. Su funcionamiento comprende la siguiente secuencia de etapas lógicas:
  </p>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%">Etapa del Modelo</th>
        <th style="width: 45%">Descripción Funcional</th>
        <th style="width: 30%">Tecnología Clave</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>1. Filtro Inicial de Atipicidad</b></td>
        <td>Análisis automatizado de la denuncia escrita para descartar hechos con relevancia estrictamente civil, administrativa o manifiestamente atípicos. Permite archivar preliminarmente las causas que no constituyen delito penal.</td>
        <td>Clasificador binario semántico / Modelos de Embeddings (Gemini embeddings)</td>
      </tr>
      <tr>
        <td><b>2. Extracción de Datos Críticos</b></td>
        <td>Aislamiento automático de variables críticas: fechas exactas (establecimiento del <i>dies a quo</i>), locaciones geográficas, montos de afectación patrimonial, identidades e historial de las partes.</td>
        <td>Reconocimiento de Entidades Nombradas (NER) / Estructuración JSON mediante LLM</td>
      </tr>
      <tr>
        <td><b>3. Análisis Lingüístico y Verbos Rectores</b></td>
        <td>Procesamiento semántico del texto para identificar preposiciones fácticas clave. Aisla los <b>verbos rectores</b> enunciados en el relato de hechos (ej. "apropiarse", "inducir", "solicitar", "ofrecer") y los contrasta con los verbos del tipo penal.</td>
        <td>Análisis de Dependencia Sintáctica / Modelamiento de Tokens de Verbo</td>
      </tr>
      <tr>
        <td><b>4. Identificación de Patrones Criminales</b></td>
        <td>Mapeo de códigos operativos y <i>modus operandi</i> recurrentes en la narración de los hechos. Compara patrones históricos con bases de datos criminales activas para detectar actividades sistemáticas.</td>
        <td>Algoritmos de Agrupación (Clustering) y Búsqueda Vectorial por Modus Operandi</td>
      </tr>
      <tr>
        <td><b>5. Asociación por Vinculación</b></td>
        <td>Conexión automática de los sujetos (imputados, agraviados y empresas fachada) con carpetas fiscales preexistentes, revelando vinculaciones no evidentes de criminalidad organizada o reincidencia.</td>
        <td>Bases de Datos de Grafos (Neo4j / NetworkX) / Análisis de Redes de Enlace</td>
      </tr>
      <tr>
        <td><b>6. Análisis de Tipicidad Objetivo-Subjetiva</b></td>
        <td>Contraste automático del cuadro de proposiciones fácticas extraídas contra los elementos normativos del tipo penal seleccionado del Código Penal Peruano.</td>
        <td>Matriz de Coincidencia Fáctico-Jurídica</td>
      </tr>
      <tr>
        <td><b>7. Estructuración Dogmática Digital</b></td>
        <td>Verificación sistemática de la concurrencia obligatoria de los elementos dogmáticos:
          <ul>
            <li><b>Sujetos:</b> Activo (común/especial) y Pasivo.</li>
            <li><b>Conducta:</b> Acción u Omisión.</li>
            <li><b>Objeto Material:</b> Elemento físico/patrimonial sobre el cual recae la conducta.</li>
          </ul>
        </td>
        <td>Validación de Esquema Dogmático Penal asistido por RAG</td>
      </tr>
      <tr>
        <td><b>8. Sugerencia de Subsunción</b></td>
        <td>Propuesta algorítmica de los tipos penales específicos más probables, asignando un porcentaje de confianza semántica y mostrando precedentes jurisprudenciales vinculantes.</td>
        <td>Sistema de RAG (Generación Aumentada por Recuperación) / Base de Datos Judicial</td>
      </tr>
      <tr>
        <td><b>9. Control Humano Garantizado</b></td>
        <td>Garantía ineludible del debido proceso. El sistema presenta la subsunción como una <b>propuesta editable</b>. El fiscal valida, corrige o complementa la calificación jurídica, firmando digitalmente la decisión.</td>
        <td>Interfaz de Validación Humana (Human-in-the-Loop Workflow)</td>
      </tr>
    </tbody>
  </table>

  <h2>Módulo C: Parámetros de Calificación de la Prueba</h2>
  <p>
    Para asegurar que la Teoría del Caso formulada por el fiscal soporte las etapas de Control de Acusación y Juicio Oral, el sistema califica la suficiencia y pertinencia de los elementos de convicción aportados mediante cinco reglas métricas:
  </p>
  <ol>
    <li><b>Pertinencia (Relación Directa):</b> El sistema analiza semánticamente si el medio de prueba ofrecido (ej. pericia contable, testimonial) guarda vinculación fáctica directa con el hecho constitutivo del delito investigado.</li>
    <li><b>Utilidad (Aporte de Certeza):</b> Evaluación del nivel de certeza que el medio probatorio aporta a la carpeta. Descarta elementos irrelevantes que no colaboren con el esclarecimiento de la verdad jurídica del caso histórico.</li>
    <li><b>Conducencia (Idoneidad Procesal):</b> Control del cumplimiento estricto de las exigencias procesales para la validez de la prueba (ej. control del levantamiento de secreto bancario con orden judicial, cadena de custodia, actas firmadas sin vicios).</li>
    <li><b>Necesidad (Indispensabilidad):</b> Verificación de cobertura probatoria. El sistema detecta si existen vacíos críticos en la acreditación de alguno de los elementos del tipo penal (ej. imputar estafa sin haber aportado el medio probatorio que acredite el engaño previo).</li>
    <li><b>No Sobreabundancia (Optimización):</b> Detección automática de duplicidad probatoria innecesaria. Emite alertas cuando se registran múltiples medios de convicción dirigidos a probar exactamente la misma proposición fáctica, promoviendo la simplificación y celeridad procesal.</li>
  </ol>

  <h2>Módulo D: Módulo de Gestión y Valoración de Elementos de Convicción</h2>
  <p>
    Este módulo se encarga del análisis inteligente, sistematizado y estructurado del acervo probatorio disponible en la carpeta fiscal o recabado durante las diligencias preliminares. Su objetivo es evaluar la suficiencia y la utilidad de cada elemento para el debido sustento de la imputación penal:
  </p>
  <ul>
    <li><b>Objetivo del Módulo:</b> Analizar y diagnosticar la suficiencia y la utilidad real de los elementos de convicción vinculados a la teoría del caso.</li>
    <li><b>Clasificación Automática de los Elementos de Convicción:</b> Utilizando de forma integrada modelos avanzados de procesamiento de lenguaje natural (PLN), el sistema cataloga e indexa los elementos de convicción en cinco categorías operativas estándar:
      <ul>
        <li><b>Documentales:</b> Contratos, escrituras, comprobantes de pago, correos electrónicos, estados de cuenta bancarios y registros públicos.</li>
        <li><b>Testimoniales:</b> Declaraciones de testigos directos, de oídas, de agraviados, imputados, y actas transcritas.</li>
        <li><b>Periciales:</b> Informes periciales oficiales, dictámenes de peritos de parte (contables, informáticos, forenses, dactiloscópicos, etc.).</li>
        <li><b>Actas:</b> Actas de intervenciones fiscales y policiales, allanamientos, incautaciones, deslacrado y cadenas de custodia.</li>
        <li><b>Informes Técnicos:</b> Informes emitidos por entidades técnicas especializadas como la Contraloría, SBS, SUNAT o empresas supervisoras.</li>
      </ul>
    </li>
    <li><b>Criterios de Valoración Estructurada:</b> Cada elemento de convicción es procesado individualmente bajo la triple dimensión valorativa:
      <ul>
        <li><b>Pertinencia:</b> Evaluación de la conexión lógica y la relación directa o indirecta con la imputación fáctica.</li>
        <li><b>Conducencia:</b> Verificación de la licitud legal y cumplimiento riguroso de las formalidades (descarte de prueba prohibida).</li>
        <li><b>Utilidad:</b> Determinación del aporte cognoscitivo real para esclarecer los hechos e inducir certeza procesal.</li>
      </ul>
    </li>
    <li><b>Resultado de la Evaluación de Suficiencia:</b> Con base en la ponderación de las reglas de convicción, el sistema formula un diagnóstico del caso sugiriendo:
      <ul>
        <li><b>Elementos Suficientes:</b> Conclusión favorable de sospecha suficiente para proceder con la formalización o acusación.</li>
        <li><b>Elementos Insuficientes:</b> Alerta de debilidad probatoria o vacíos fácticos graves para evitar un archivo inminente.</li>
        <li><b>Necesidad de Actos de Investigación Adicional:</b> Recomendación automática y sugerencia de diligencias urgentes necesarias para subsanar deficiencias del caso (ej. solicitar pericia contable complementaria, recabar declaración testimonial pendiente, etc.).</li>
      </ul>
    </li>
  </ul>

  <h1>3. Requerimientos Técnicos e Infraestructura Tecnológica</h1>
  <p>
    Para garantizar la escalabilidad, seguridad informática y alto rendimiento del sistema SIA-CT en la red corporativa del Ministerio Público, se propone la siguiente arquitectura de software de última generación:
  </p>

  <h3>Tecnología de la Solución (Stack Recomendado):</h3>
  <ul>
    <li><b>Frontend de Usuario:</b> Desarrollado en <b>React 19</b> y <b>Vite</b>, empleando <b>Tailwind CSS</b> para un diseño de interfaz modular y limpio (Dashboard de tipo bento, adaptativo y responsivo).</li>
    <li><b>Backend API:</b> Implementado en <b>Python (FastAPI)</b> o <b>Node.js (Express con TypeScript)</b>. La opción de Python es preferida para el procesamiento de IA debido a su ecosistema nativo de ciencia de datos.</li>
    <li><b>Base de Datos Relacional:</b> <b>PostgreSQL (Cloud SQL)</b> para almacenar de manera consistente los registros de las carpetas, el catálogo unificado de delitos, plazos procesales legales e históricos. Se utilizará la extensión <b>pgvector</b> para búsquedas rápidas por similitud semántica de casos.</li>
    <li><b>Base de Datos Documental y Cache:</b> <b>Google Cloud Firestore / Redis</b> para la persistencia ágil de flujos de trabajo, estados intermedios del análisis lingüístico y sincronización en tiempo real del semáforo de plazos.</li>
    <li><b>Procesamiento de Lenguaje Natural (PLN) e Inteligencia Artificial:</b> Integración del SDK oficial de Google <b>@google/genai</b> para consumir modelos fundacionales de la familia <b>Gemini (Gemini 2.5 Flash / Pro)</b> de forma server-side protegida. Para la estructuración dogmática y verbos rectores, se implementará un flujo de <b>RAG (Generación Aumentada por Recuperación)</b> conectado a un almacén vectorial que aloje el Código Penal, el Código Procesal Penal, Acuerdo Plenarios y Casaciones vinculantes de la Corte Suprema.</li>
  </ul>

  <div class="alert-box">
    <p>
      <b>Directiva Crítica de Seguridad:</b> De acuerdo con la Ley de Protección de Datos Personales peruana y la confidencialidad de la investigación fiscal (Art. 324 del Código Procesal Penal), todas las credenciales, llaves de API de Gemini y datos de carpetas penales deben ser procesados mediante rutas protegidas del servidor (server-side proxies), prohibiendo rigurosamente la exposición de API Keys en el cliente.
    </p>
  </div>

  <h1>4. Perfiles del Equipo de Desarrollo (Roles Clave)</h1>
  <p>
    Para llevar a cabo con éxito este proyecto en un plazo estimado de 24 semanas, es fundamental constituir un equipo multidisciplinario (célula ágil) compuesto por los siguientes perfiles:
  </p>
  <ol>
    <li><b>Gestor de Proyecto (Project Manager / Scrum Master):</b> Responsable de la planificación de sprints, control de riesgos, remoción de impedimentos y cumplimiento de hitos.</li>
    <li><b>Ingeniero Legal (Legal Engineer) / Analista de Negocio Legal:</b> Profesional de derecho con formación tecnológica, encargado de traducir las reglas de la dogmática penal (prescripciones, tipicidad, parámetros probatorios) a lógica estructurada (pseudocódigo/reglas de negocio) utilizable por los desarrolladores.</li>
    <li><b>Científico de Datos / Especialista en PLN (ML Engineer):</b> Encargado de la calibración de prompts, la arquitectura RAG, la extracción de entidades (NER), detección de verbos rectores y afinamiento de algoritmos de tipicidad semántica.</li>
    <li><b>Desarrollador Backend Senior:</b> Responsable de la construcción de APIs seguras, la integración con sistemas del Ministerio Público (SGF - Sistema de Gestión Fiscal), bases de datos y la implementación determinista de reglas procesales.</li>
    <li><b>Desarrollador Frontend UX/UI:</b> Especializado en React para crear interfaces ágiles, visualizaciones claras del semáforo de alertas, flujos de arrastre de carpetas de pruebas y validaciones humanas interactivas.</li>
    <li><b>Analista de Calidad (QA Specialist):</b> Diseñador de pruebas unitarias legales e informáticas, asegurando que los cálculos de plazos arrojen desviaciones cero de error respecto de la ley.</li>
  </ol>

  <h1>5. Plan de Implementación y Cronograma Estimado</h1>
  <p>
    El desarrollo se estructurará bajo el marco de trabajo SCRUM, completando el producto mínimo viable en un periodo total de <b>24 semanas</b>:
  </p>
  <ul>
    <li><b>Fase 1: Requerimientos, Modelado Dogmático e Ingeniería de Datos (Semanas 1-4)</b><br />
    Levantamiento de especificaciones, modelamiento detallado de tipos penales críticos del catálogo fiscal e integración inicial de RAG procesal.</li>
    <li><b>Fase 2: Construcción del Núcleo Determinista de Plazos y Prescripciones (Semanas 5-8)</b><br />
    Desarrollo y testeo riguroso del algoritmo de prescripciones considerando la Ley 31751, duplicidad del Art. 41 y atenuaciones del Art. 81.</li>
    <li><b>Fase 3: Desarrollo de Inteligencia Artificial para Tipicidad y PLN (Semanas 9-16)</b><br />
    Entrenamiento y conexión del clasificador de atipicidad preliminar, extracción de variables críticas por NER, y mapeo estructurado de verbos rectores.</li>
    <li><b>Fase 4: Desarrollo de Parametrización Probatoria (Semanas 17-20)</b><br />
    Implementación del motor de calificación probatoria: reglas de pertinencia, conducencia, utilidad, necesidad y no sobreabundancia.</li>
    <li><b>Fase 5: Integración de Sistemas, Pruebas y Piloto en Despacho (Semanas 21-24)</b><br />
    Integración de API con base de datos real en Cloud SQL, pruebas de estrés con carpetas fiscales reales (anonimizadas), capacitación a fiscales piloto y pase a producción.</li>
  </ul>

  <h1>6. Conclusiones y Viabilidad</h1>
  <p>
    El desarrollo del <b>SIA-CT</b> es plenamente viable tecnológica y jurídicamente. Representa una innovación disruptiva en el sector público de administración de justicia penal en el Perú. Al delegar las tareas mecánicas de cálculo matemático-procesal y la estructuración lingüística primaria en un sistema inteligente, se le restituye al fiscal de la Nación su rol fundamental de análisis crítico de alto nivel.
  </p>
  <p>
    La inclusión de la etapa de <b>Control Humano</b> blinda el sistema contra contingencias constitucionales, asegurando que la IA actúe de manera exclusiva como un asistente copiloto de alta fidelidad, disminuyendo en un estimado de 45% el tiempo de calificación inicial de denuncias penales ordinarias y erradicando en un 100% los archivos de casos por prescripción no detectada.
  </p>

  <div class="footer-note">
    Documento autogenerado para el Distrito Fiscal del Ministerio Público de la Nación del Perú.<br />
    &copy; 2026 SIA-CT Project Management Office. Todos los derechos reservados.
  </div>

</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Informe_Ejecutivo_SIA_CT.doc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating word file', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto max-h-[600px] p-5 font-sans" id="project-management-report-container">
      {/* Download Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm mb-5">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none">Informe Ejecutivo - Gestor de Proyecto</h3>
            <p className="text-xxs text-slate-500 mt-1">Formato de descarga compatible con Microsoft Word (.doc)</p>
          </div>
        </div>
        <button
          onClick={handleDownloadDoc}
          disabled={downloading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg inline-flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
          id="download-doc-btn"
        >
          <Download className="w-3.5 h-3.5" />
          {downloading ? 'Generando...' : 'Descargar Word (.doc)'}
        </button>
      </div>

      {/* Visual Report Rendering */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
        
        {/* Document Header Panel */}
        <div className="border-b border-slate-200 pb-5">
          <div className="text-center">
            <span className="px-2 py-1 text-[9px] font-bold text-red-700 bg-red-50 border border-red-200 rounded-md tracking-wider uppercase">
              Uso Reservado - Interno MPFN
            </span>
            <h1 className="text-lg font-extrabold text-slate-900 mt-3 tracking-tight">
              INFORME TÉCNICO DE VIABILIDAD Y REQUERIMIENTOS
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-1">
              SISTEMA INTELIGENTE DE ALERTAS DE PRESCRIPCIÓN Y CONTROL DE TIPICIDAD (SIA-CT)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-5 text-xs border-t border-slate-100 pt-4">
            <div>
              <p className="text-slate-400 font-medium">Destinatario:</p>
              <p className="text-slate-800 font-semibold">Distrito Fiscal - Ministerio Público del Perú</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Remitente:</p>
              <p className="text-slate-800 font-semibold">Director de Proyectos de TI / PM</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Fecha de Emisión:</p>
              <p className="text-slate-800 font-semibold">30 de Junio de 2026</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Asunto:</p>
              <p className="text-slate-800 font-semibold">Arquitectura y Viabilidad del Modelo SIA-CT</p>
            </div>
          </div>
        </div>

        {/* 1. Resumen Ejecutivo */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            1. Resumen Ejecutivo
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed text-justify">
            Este informe expone detalladamente la viabilidad y los requerimientos para el desarrollo de un sistema informático asistencial diseñado específicamente para los despachos fiscales de la Nación. Su objetivo es automatizar de forma determinista el control de plazos procesales y fechas de prescripción penal, así como proporcionar un motor de inteligencia artificial (IA) y procesamiento de lenguaje natural (PLN) para la estructuración dogmática del caso penal, la tipicidad y la calificación probatoria.
          </p>
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r-lg mt-2">
            <p className="text-[11px] italic text-indigo-900 font-medium leading-relaxed">
              <b>Visión de Gestión:</b> Reducir significativamente la carga operativa mecánica del fiscal, garantizando el debido proceso bajo el principio fundamental de control humano garantizado (human-in-the-loop).
            </p>
          </div>
        </div>

        {/* 2. Módulos del Sistema */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <Layers className="w-4 h-4 text-blue-500" />
            2. Arquitectura de Módulos Funcionales
          </h2>

          {/* Modulo A */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Módulo A: Alertas de Prescripción y Plazos Procesales
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Basado en reglas de negocio 100% deterministas del Código Penal Peruano para dar certeza matemática absoluta:
            </p>
            <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
              <li><b>Prescripción Ordinaria y Extraordinaria:</b> Artículos 80 y 83 del Código Penal.</li>
              <li><b>Reducción por Edad:</b> Artículo 81 del Código Penal (menores de 21 o mayores de 65 años).</li>
              <li><b>Duplicidad de Plazos:</b> Artículo 41 de la Constitución para delitos de funcionarios contra el patrimonio del Estado.</li>
              <li><b>Ley N° 31751:</b> Límite máximo de suspensión de la prescripción de 1 año tras la formalización de investigación preparatoria.</li>
              <li><b>Monitoreo de Plazos Procesales:</b> Semáforos dinámicos basados en la complejidad (Simple, Complejo, Crimen Organizado).</li>
            </ul>
          </div>

          {/* Modulo B */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              Módulo B: Control de Tipicidad de Casos (Proceso IA)
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
              Flujo integrado mediante técnicas de Inteligencia Artificial para el análisis lingüístico de tipicidad:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
              <div className="p-2.5 bg-white border border-slate-150 rounded-md">
                <p className="font-bold text-indigo-700">1. Filtro Inicial</p>
                <p className="text-slate-500 mt-0.5">Identificación automatizada de hechos con relevancia penal (descarte de conflictos puramente civiles, administrativos o atípicos).</p>
              </div>
              <div className="p-2.5 bg-white border border-slate-150 rounded-md">
                <p className="font-bold text-indigo-700">2. Extracción de Datos</p>
                <p className="text-slate-500 mt-0.5">Aislamiento de variables críticas: fechas (dies a quo), lugares de los hechos, cuantía o montos e identidades clave.</p>
              </div>
              <div className="p-2.5 bg-white border border-slate-150 rounded-md">
                <p className="font-bold text-indigo-700">3. Análisis Lingüístico (PLN)</p>
                <p className="text-slate-500 mt-0.5">Detección de preposiciones fácticas mediante PLN. Identificación precisa de los <b>verbos rectores</b> típicos.</p>
              </div>
              <div className="p-2.5 bg-white border border-slate-150 rounded-md">
                <p className="font-bold text-indigo-700">4. Patrones de Conducta</p>
                <p className="text-slate-500 mt-0.5">Mapeo de códigos operativos y modus operandi recurrentes a partir de registros y denuncias históricas.</p>
              </div>
              <div className="p-2.5 bg-white border border-slate-150 rounded-md">
                <p className="font-bold text-indigo-700">5. Asociación por Vinculación</p>
                <p className="text-slate-500 mt-0.5">Conexión automática de hechos con imputados, agraviados y empresas fachada en carpetas preexistentes.</p>
              </div>
              <div className="p-2.5 bg-white border border-slate-150 rounded-md">
                <p className="font-bold text-indigo-700">6. Análisis de Tipicidad</p>
                <p className="text-slate-500 mt-0.5">Contraste automatizado de proposiciones fácticas frente a la descripción legal del tipo penal.</p>
              </div>
              <div className="p-2.5 bg-white border border-slate-150 rounded-md">
                <p className="font-bold text-indigo-700">7. Estructuración Dogmática</p>
                <p className="text-slate-500 mt-0.5">Verificación digital de sujetos (activo/pasivo), conducta (acción/omisión) y objeto material del delito.</p>
              </div>
              <div className="p-2.5 bg-white border border-slate-150 rounded-md">
                <p className="font-bold text-indigo-700">8. Sugerencia de Subsunción</p>
                <p className="text-slate-500 mt-0.5">El sistema propone la calificación y tipos penales más probables según la matriz jurisprudencial.</p>
              </div>
            </div>

            <div className="p-2.5 bg-indigo-50 border border-indigo-150 rounded-md text-[10px] flex items-start gap-1.5 mt-2">
              <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-indigo-900">9. Control Humano Obligatorio</p>
                <p className="text-indigo-800 mt-0.5">Garantía ineludible del debido proceso. El fiscal siempre valida, corrige o complementa la propuesta del software.</p>
              </div>
            </div>
          </div>

          {/* Modulo C */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              Módulo C: Calificación y Parámetros de la Prueba
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Métricas dinámicas para evaluar de forma técnica la suficiencia de cada elemento de convicción:
            </p>
            <div className="space-y-1.5 text-[10.5px]">
              <div className="flex gap-1.5"><span className="font-bold text-slate-700 shrink-0">Pertinencia:</span> <span className="text-slate-600">Relación directa entre el medio de prueba ofrecido y el hecho punible investigado.</span></div>
              <div className="flex gap-1.5"><span className="font-bold text-slate-700 shrink-0">Utilidad:</span> <span className="text-slate-600">Aporte real de certeza o probabilidad para el esclarecimiento de la verdad jurídica.</span></div>
              <div className="flex gap-1.5"><span className="font-bold text-slate-700 shrink-0">Conducencia:</span> <span className="text-slate-600">Idoneidad legal del medio probatorio (cumplimiento estricto de las formalidades procesales).</span></div>
              <div className="flex gap-1.5"><span className="font-bold text-slate-700 shrink-0">Necesidad:</span> <span className="text-slate-600">Indispensabilidad del elemento para sustentar la teoría del caso sin dejar vacíos críticos.</span></div>
              <div className="flex gap-1.5"><span className="font-bold text-slate-700 shrink-0">No Sobreabundancia:</span> <span className="text-slate-600">Evitar la repetición innecesaria de múltiples elementos que acrediten exactamente lo mismo.</span></div>
            </div>
          </div>

          {/* Modulo D */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
              Módulo D: Gestión y Valoración de Elementos de Convicción
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Análisis inteligente para evaluar la pertinencia, conducencia, utilidad, suficiencia y catalogación automática del acervo probatorio:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[10px]">
              <div className="p-2.5 bg-white border border-slate-150 rounded-md space-y-1">
                <p className="font-bold text-indigo-700">Clasificación Automática (IA/PLN)</p>
                <p className="text-slate-500 leading-relaxed">El sistema clasifica los documentos en cinco categorías:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-medium border border-slate-200">Documentales</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-medium border border-slate-200">Testimoniales</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-medium border border-slate-200">Periciales</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-medium border border-slate-200">Actas</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-medium border border-slate-200">Informes Técnicos</span>
                </div>
              </div>
              
              <div className="p-2.5 bg-white border border-slate-150 rounded-md space-y-1">
                <p className="font-bold text-indigo-700">Criterios de Valoración</p>
                <p className="text-slate-500 leading-relaxed">Triple dimensión de análisis bajo estándar legal peruano:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5 mt-1 pl-0.5">
                  <li><b>Pertinencia:</b> Relación lógica y directa fáctica con la imputación.</li>
                  <li><b>Conducencia:</b> Licitud e idoneidad formal / procesal.</li>
                  <li><b>Utilidad:</b> Aporte cognoscitivo de certeza y probabilidad fáctica.</li>
                </ul>
              </div>

              <div className="p-2.5 bg-white border border-slate-150 rounded-md space-y-1">
                <p className="font-bold text-indigo-700">Resultados de Suficiencia</p>
                <p className="text-slate-500 leading-relaxed">Ponderación algorítmica sugerida para el despacho:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5 mt-1 pl-0.5">
                  <li className="text-emerald-700 font-medium"><b>Elementos suficientes:</b> Supera el estándar de sospecha reveladora.</li>
                  <li className="text-rose-700 font-medium"><b>Elementos insuficientes:</b> Alerta sobre debilidad probatoria.</li>
                  <li className="text-amber-700 font-medium"><b>Diligencias adicionales:</b> Sugerencia inteligente de actos pendientes.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Requerimientos Tecnicos */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <Cpu className="w-4 h-4 text-purple-500" />
            3. Infraestructura y Stack Tecnológico
          </h2>
          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1 leading-relaxed">
            <li><b>Capas del Frontend:</b> React JS, Vite, Tailwind CSS (Inter e hilos vectoriales de visualización de grafos).</li>
            <li><b>Capas del Backend:</b> FastAPI (Python) para integraciones de NLP de alto desempeño / Node.js Express.</li>
            <li><b>Base de Datos Relacional:</b> PostgreSQL (con pgvector) en Cloud SQL para catalogar delitos, plazos procesales y búsqueda semántica.</li>
            <li><b>Inteligencia Artificial:</b> Modelos de lenguajes fundacionales de la familia <b>Gemini 2.5</b> vía API Server-Side protegida, configurada con RAG (Retrieval Augmented Generation) sobre legislación y jurisprudencia penal nacional.</li>
          </ul>
        </div>

        {/* 4. Perfiles del Equipo */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <Users className="w-4 h-4 text-amber-500" />
            4. Roles de Equipo Clave (Célula Ágil)
          </h2>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 leading-relaxed">
            <div className="p-2 bg-slate-50 border border-slate-150 rounded">
              <span className="font-bold text-slate-800 block">Project Manager / Scrum Master</span>
              Planificación ágil, mitigación de riesgos y supervisión de hitos contractuales.
            </div>
            <div className="p-2 bg-slate-50 border border-slate-150 rounded">
              <span className="font-bold text-slate-800 block">Legal Engineer (Ingeniero Legal)</span>
              Traductor de reglas dogmáticas del derecho penal a algoritmos lógicos estructurados.
            </div>
            <div className="p-2 bg-slate-50 border border-slate-150 rounded">
              <span className="font-bold text-slate-800 block">Científico de Datos / Especialista NLP</span>
              Calibración de RAG, embeddings vectoriales, extracción de verbos rectores y entidades.
            </div>
            <div className="p-2 bg-slate-50 border border-slate-150 rounded">
              <span className="font-bold text-slate-800 block">Full-stack Developers (React + Backend)</span>
              Construcción de APIs, front-end visual e integraciones directas con el SGF del Ministerio Público.
            </div>
          </div>
        </div>

        {/* 5. Cronograma */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <Calendar className="w-4 h-4 text-rose-500" />
            5. Plan de Trabajo Estimado (24 Semanas)
          </h2>
          <div className="space-y-2 mt-2">
            <div className="flex gap-2 items-start text-[10.5px]">
              <span className="px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 bg-indigo-50 rounded shrink-0">W1-W4</span>
              <p className="text-slate-600"><b>Fase 1: Requerimientos, Modelado Dogmático e Ingeniería de Datos.</b> Modelado formal de tipos penales, diseño de la ontología jurídica e inicio de indexación de jurisprudencia.</p>
            </div>
            <div className="flex gap-2 items-start text-[10.5px]">
              <span className="px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 bg-indigo-50 rounded shrink-0">W5-W8</span>
              <p className="text-slate-600"><b>Fase 2: Construcción del Núcleo Determinista de Prescripciones.</b> Programación y validación con desviación cero de las reglas del Código Penal peruano y la Ley 31751.</p>
            </div>
            <div className="flex gap-2 items-start text-[10.5px]">
              <span className="px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 bg-indigo-50 rounded shrink-0">W9-W16</span>
              <p className="text-slate-600"><b>Fase 3: Desarrollo de IA para Tipicidad y PLN.</b> Entrenamiento del clasificador de atipicidad penal, extracción de verbos rectores y mapeo fáctico semántico.</p>
            </div>
            <div className="flex gap-2 items-start text-[10.5px]">
              <span className="px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 bg-indigo-50 rounded shrink-0">W17-W20</span>
              <p className="text-slate-600"><b>Fase 4: Desarrollo de Parametrización Probatoria.</b> Desarrollo del motor de calificación probatoria (Pertinencia, Conducencia, Utilidad, Necesidad).</p>
            </div>
            <div className="flex gap-2 items-start text-[10.5px]">
              <span className="px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 bg-indigo-50 rounded shrink-0">W21-W24</span>
              <p className="text-slate-600"><b>Fase 5: Pruebas, Integración al SGF y Despliegue Piloto.</b> Simulación con carpetas reales (anonimizadas) y despliegue del software en despachos penales de prueba.</p>
            </div>
          </div>
        </div>

        {/* 6. Conclusión y Viabilidad */}
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            6. Conclusiones de Viabilidad
          </h2>
          <p className="text-[11px] text-slate-600 leading-relaxed text-justify">
            El desarrollo del <b>SIA-CT</b> es técnica y jurídicamente viable. Su implementación disminuirá la carga de calificación del despacho fiscal hasta en un <b>45%</b> de forma estimada. El módulo determinista garantiza blindaje de responsabilidad de prescripción penal con cero errores fácticos, convirtiendo este sistema en un co-piloto fiscal sumamente avanzado y seguro.
          </p>
        </div>

        {/* Bottom Download Button */}
        <div className="flex justify-center border-t border-slate-100 pt-4">
          <button
            onClick={handleDownloadDoc}
            disabled={downloading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg inline-flex items-center gap-2 shadow-md transition disabled:opacity-50"
            id="download-doc-btn-bottom"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generando Archivo Word...' : 'Descargar Informe Completo para Word (.doc)'}
          </button>
        </div>

      </div>
    </div>
  );
}
