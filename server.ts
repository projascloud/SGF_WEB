/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured in the environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API Route: Analyze Case details with Gemini Flash
app.post("/api/analyze-case", async (req, res) => {
  try {
    const { caseData, calculationResult, crimeDetails } = req.body;

    if (!caseData || !calculationResult) {
      res.status(400).json({ error: "Faltan parámetros requeridos 'caseData' o 'calculationResult'." });
      return;
    }

    const ai = getGeminiClient();

    // Construct highly context-aware prompt customized for Peruvian criminal law (MPFN context)
    const prompt = `
Analiza la prescripción de la acción penal para el Ministerio Público del Perú (MPFN). El usuario es un Fiscal a cargo de la calificación y control del caso.

DATOS DEL CASO FISCAL:
- Caso N°: ${caseData.id}
- Fiscal Responsable: ${caseData.fiscalResponsable || 'No especificado'}
- Delito Calificado: ${crimeDetails?.delito || 'Personalizado'} (${crimeDetails?.articulo || 'Sin artículo'})
- Pena Prevista: Máximo de ${crimeDetails?.penaMaxima || 0} años de pena privativa de libertad.
- Fecha de la Comisión del Hecho: ${caseData.fechaHecho}
- Edad del Imputado al momento de los hechos: ${caseData.imputadoEdad} años.
- Imputado es Funcionario Público: ${caseData.imputadoFuncionarioPublico ? 'SÍ' : 'NO'}. Delito califica como corrupción/contra administración del Estado: ${crimeDetails?.esContraEstado ? 'SÍ' : 'NO'}.
- Fecha de la Formalización de la Investigación Preparatoria: ${caseData.fechaFormalizacion || 'No Formalizado / Sin Fecha'}.
- Etapa Procesal de Investigación Actual: ${caseData.etapaActual === 'DILIGENCIAS_PRELIMINARES' ? 'Diligencias Preliminares' : 'Investigación Preparatoria Formalizada'}.
- Complejidad del caso: ${caseData.complejidad} (${caseData.esProrrogado ? 'Prorrogado' : 'Plazo Ordinario'}).

CÁLCULOS DETERMINÍSTICOS REALIZADOS:
- Plazo de Prescripción Ordinaria: ${calculationResult.plazoOrdinario} años (Vence: ${calculationResult.fechaLimiteOrdinaria})
- Plazo de Prescripción Extraordinaria: ${calculationResult.plazoExtraordinario} años (Vence: ${calculationResult.fechaLimiteExtraordinaria})
- Suspensión de la Prescripción Aplicada (Ley 31751): ${calculationResult.suspensionAplicadaVal} año(s)
- FECHA LÍMITE FINAL CALCULADA DE VIGENCIA DE ACCIÓN PENAL: ${calculationResult.fechaLimiteFinal}
- Tiempo Restante: ${calculationResult.díasRestantes} días (Aproximadamente ${calculationResult.añosRestantes} años)
- Estado de vigencia de la acción penal: **${calculationResult.estaPrescrito ? 'PRESCRITO' : 'VIGENTE'}**
- Nivel de alerta: ${calculationResult.alertaNivel}

Por favor, genera un informe legal conciso, sumamente formal, estructurado con el estilo institucional del Ministerio Público de la República del Perú. No incluyas explicaciones de IA ni introducciones informales. Debe estar titulado: "INFORME FISCAL: DIAGNÓSTICO JURÍDICO DE VIGENCIA DE LA ACCIÓN PENAL".

Debe contener los siguientes apartados detalladamente:
1. SÍNTESIS DE LA CALIFICACIÓN FISCAL: Resumen formal del delito, hecho, imputado y sus condiciones especiales (edad, rol funcionarial).
2. ANÁLISIS JURÍDICO EXPLICATIVO: Justifica la aplicación o no del beneficio por edad (Art. 81 Código Penal), la duplicidad de la pena contra el patrimonio del Estado (Art. 80 último párrafo y Art. 41 de la Constitución), la concurrencia de la prescripción extraordinaria con sustento del plazo por la interrupción (Art. 83), y de forma CLAVE, la suspensión del plazo y la limitación de UN AÑO regulado por la Ley N° 31751 ("Ley Soto"). Explica cómo llegamos a la fecha límite ${calculationResult.fechaLimiteFinal}.
3. DIAGNÓSTICO Y ALERTA: Dictamen claro sobre si la acción penal del Estado se encuentra VIGENTE o PRESCRITA. Evalúa el nivel de urgencia o riesgo del caso.
4. PLAN FISCAL DE ACCIÓN RECOMENDADO: 
   - Si está VIGENTE: Qué actos realizar de manera urgente para impulsar la causa (ej. formalizar investigación, acusar, peritajes, etc.) y evitar la prescripción.
   - Si ya está PRESCRITO: Sugerir la emisión de la 'Disposición de Archivo por Prescripción de la Acción Penal', justificando legalmente la devaluación de la persecución estatal para aliviar la carga procesal de la fiscalía.
5. APÉNDICE: BORRADOR DE NOTIFICACIÓN AUTOMÁTICA O PARTE RESOLUTIVA: Un borrador listo para ser copiado del dictamen final del fiscal para notificar a los sujetos procesales.

Formatea todo usando Markdown elegante con tablas y viñetas nítidas. Emplea un lenguaje jurídico riguroso y persuasivo propio de un fiscal peruano.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Error al procesar el análisis de Gemini:", error);
    res.status(500).json({ error: error.message || "Error interno del servidor al consultar a Gemini." });
  }
});

// 2. Integration with Vite Dev/Prod Middlewares
async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(path.join(distPath, "index.html"));

  if (process.env.NODE_ENV !== "production" || !hasDist) {
    console.log("Configurando servidor en modo DESARROLLO (Vite middleware)...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Servir index.html de forma explícita transformado con Vite en desarrollo
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    console.log("Configurando servidor en modo PRODUCCIÓN (Static assets)...");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OK] Servidor escuchando en: http://0.0.0.0:${PORT}`);
  });
}

startServer();
