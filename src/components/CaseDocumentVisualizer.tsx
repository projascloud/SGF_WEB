import React, { useState, useRef, useEffect } from 'react';
import { Attachment, CaseData } from '../types';
import { 
  FileText, 
  Play, 
  Pause, 
  Volume2, 
  Image as ImageIcon, 
  Upload, 
  FileDown, 
  Eye, 
  Music, 
  Clock, 
  Trash2, 
  HelpCircle, 
  CheckCircle,
  AlertCircle,
  FileCode,
  Search,
  Maximize2
} from 'lucide-react';

interface CaseDocumentVisualizerProps {
  currentCase: CaseData;
  onUpdateCase: (updatedCase: CaseData) => void;
}

// Default preloaded evidence files based on standard casework
const getPreloadedAttachments = (caseId: string): Attachment[] => {
  if (caseId.includes('3419') || caseId === 'CASO-2021-3419') {
    return [
      {
        id: 'doc-001',
        name: 'Acta_de_Intervencion_Policial_PNP_Flagrancia_Wilson.pdf',
        type: 'document',
        size: '1.2 MB',
        uploadedAt: '2021-04-12 16:30',
        mockContent: {
          header: 'POLICÍA NACIONAL DEL PERÚ - MACROREGIÓN DE LIMA',
          sections: [
            { 
              title: '1. DATOS DE LA INTERVENCIÓN', 
              body: 'En la ciudad de Lima, el 12 de Abril del 2021 a horas 15:45, a inmediaciones de la Av. Inca Garcilaso de la Vega (Av. Wilson) Cdra. 12, el personal de patrullaje a pie integrado por el SO1 PNP Víctor Arana interviene al investigado Juan Castro Benítez en flagrante delito contra el patrimonio.' 
            },
            { 
              title: '2. SUCESO DE LOS HECHOS', 
              body: 'El encargado de prevención del establecimiento "Supermercados del Sur S.A." solicitó auxilio manifestando que el intervenido acababa de cruzar la línea de cajas sin abonar, sustrayendo licores y enlatados ocultos en un bolso de lona doble fondo.' 
            },
            { 
              title: '3. BIENES RETENIDOS', 
              body: 'Se incautaron tres (03) botellas de whisky marca "Chivas Regal 12 años" valorizadas en S/. 450.00 y doce (12) conservas importadas valorizadas en S/. 750.00, sumando un valor patrimonial total de S/. 1,200.00 nuevos soles.' 
            },
            { 
              title: '4. OBSERVACIÓN Y CONDUCCIÓN', 
              body: 'El imputado admitió verbalmente haber ocultado la mercadería por necesidad familiar inmediata. Es trasladado a la Comisaría PNP Cotabambas de conformidad con las disposiciones fiscales preliminares.' 
            }
          ],
          footer: 'Comisaría PNP Cotabambas • Sello Judicial de Recepción'
        }
      },
      {
        id: 'aud-001',
        name: 'Grabacion_Lectura_de_Derechos_Juan_Castro.mp3',
        type: 'audio',
        size: '480 KB',
        uploadedAt: '2021-04-12 16:55',
        mockContent: {
          duration: '0:42',
          transcription: `[00:01] SO1 PNP: "Señor Juan Castro Benítez, usted se encuentra detenido en flagrancia de conformidad con el Art. 259 del Código Procesal Penal. Le asiste el derecho de guardar silencio. De manifestar algo, esta declaración será en presencia de un abogado."\n[00:15] Juan Castro: "Sí, oficial... no quise robar... fue una tontería."\n[00:21] SO1 PNP: "Tiene derecho a comunicarse con un familiar y designar un abogado defensor de su elección inmediatamente. De no contar con uno, el Estado le designará un Defensor Público de turno. ¿Entiende sus garantías legales?"\n[00:35] Juan Castro: "Sí, entiendo perfectamente mis derechos. Quiero llamar a mi hermano para que avise al abogado públicos."`,
          audioUrl: '' // Falls back to interactive voice synthethic waveform
        }
      },
      {
        id: 'img-001',
        name: 'Registro_CCTV_Fotograma_Pasillo_Licores.jpg',
        type: 'image',
        size: '2.1 MB',
        uploadedAt: '2021-04-12 17:10',
        mockContent: {
          imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600' // Security camera high contrast black and white mockup
        }
      }
    ];
  } else if (caseId.includes('0805') || caseId === 'CASO-2022-0805') {
    return [
      {
        id: 'doc-002',
        name: 'Informe_Contable_DIRCOCOR_N_042_2023.pdf',
        type: 'document',
        size: '3.4 MB',
        uploadedAt: '2023-05-18 11:20',
        mockContent: {
          header: 'DIRECCIÓN CONTRA LA CORRUPCIÓN DE LIMA (DIRCOCOR) • DIVISIÓN DE PERICIAS',
          sections: [
            {
              title: '1. OBJETO DE EXAMEN',
              body: 'Peritaje contable financiero practicado a las cuentas de caudales e ingresos estatales de la Tesorería Municipal de Huara, correspondiente al ejercicio fiscal de enero a diciembre de 2022.'
            },
            {
              title: '2. IRREGULARIDAD DETECTADA',
              body: 'Arqueo físico revela un desbalance financiero ascendente a S/. 145,000.00 nuevos soles en la partida "Fondo de Apoyo Comunal S-2". Los descargos presentados por la tesorera Maria Alva Quispe muestran duplicidades contables y recibos de egreso visados sin firma de contraparte autorizada.'
            },
            {
              title: '3. CONCLUSIÓN PERICIAL',
              body: 'Se determina perjuicio económico directo al Estado por apropiación indebida de fondos asignados a comedores populares. La custodia directa y administración absoluta de estos valores pertenecía estrictamente a la tesorera firmante.'
            }
          ],
          footer: 'CPC Roberto Benites Luna • Reg. Cert. Pericial N° 881-DIRCOCOR'
        }
      },
      {
        id: 'aud-002',
        name: 'Audio_Llamada_Denuncia_Anonima_Operadora_MP.wav',
        type: 'audio',
        size: '1.8 MB',
        uploadedAt: '2022-01-20 09:12',
        mockContent: {
          duration: '1:15',
          transcription: `[00:02] Operadora M.P.: "Mesa de Denuncias Anticorrupción del Distrito Fiscal del Callao, buen día."\n[00:08] Denunciante (Voz distorsionada): "Buenas, quiero denunciar que la señora Maria Alva Quispe de Tesorería está adulterando los vouchers. Saca efectivo de los cobros prediales los viernes y los mete a su cuenta."\n[00:23] Operadora M.P.: "¿Señor, tiene alguna fecha de estos desvíos patrimoniales o pruebas del sistema?"\n[00:29] Denunciante: "Revisen las carpetas de arqueo del 15 de enero de este año. El sistema dice que hubo cuadre, pero si comprueban las firmas físicas verán firmas falsas de proveedores de comedores. Todo el equipo de tesorería lo sabe pero nadie habla por temor. Intervengan de sorpresa."`,
          audioUrl: ''
        }
      },
      {
        id: 'doc-003',
        name: 'Declaracion_Jurada_Bienes_Municipalidad.pdf',
        type: 'document',
        size: '1.7 MB',
        uploadedAt: '2022-03-30 14:05',
        mockContent: {
          header: 'CONTRALORÍA GENERAL DE LA REPÚBLICA del PERÚ',
          sections: [
            {
              title: 'DECLARACIÓN JURADA DE INGRESOS Y BIENES',
              body: 'Declaración jurada anual presentada por la funcionaria pública Maria Alva Quispe en calidad de Tesorera Titular. Declara un patrimonio neto personal ascendente a S/. 85,000.00 y egresos equilibrados.'
            },
            {
              title: 'CONTRADICCIÓN REGISTRAL',
              body: 'Cruces de información de la Unidad de Inteligencia Financiera (UIF) indican la adquisición de dos bienes raíces en Cañete durante el período auditado, pagados al contado por terceros asociados, que ascienden a más de S/. 220,000.00 no declarados en el informe patrimonial.'
            }
          ],
          footer: 'Oficina de Lavado de Activos y Enriquecimiento Ilícito MPFN'
        }
      }
    ];
  } else if (caseId.includes('0112') || caseId === 'CASO-2020-0112') {
    return [
      {
        id: 'doc-004',
        name: 'Contrato_Vial_Adjudicacion_Directa_GRC_12_2020.pdf',
        type: 'document',
        size: '5.2 MB',
        uploadedAt: '2020-03-30 10:15',
        mockContent: {
          header: 'GOBIERNO REGIONAL DEL CALLAO • GERENCIA GENERAL DE INFRAESTRUCTURA',
          sections: [
            {
              title: 'CONTRATO Nro. 012-2020-GRC - ADJUDICACIÓN DE OBRA PÚBLICA',
              body: 'Acuerdo suscrito entre el Gerente de Infraestructura, Roberto Rojas Pérez, y el Consorcio Constructor Vial Callao, para el asfaltado y parchado extraordinario de avenidas de la Jurisdicción Costera.'
            },
            {
              title: 'PLIEGOS DE IRREGULARIDAD',
              body: 'La adjudicacion se realizó de manera directa invocando "Excepción de Emergencia por Derrumbes No Registrados". El valor con el que se adjudicaron las obras se fijó en S/. 1,890,000.00, el monto exacto límite para evadir la Licitación Pública Plenaria Nacional.'
            },
            {
              title: 'ANOMALÍA TÉCNICA',
              body: 'Las bases técnicas y el otorgamiento de la Buena Pro se formularon, aprobaron y firmaron en menos de 4 horas hábiles del mismo día 10 de marzo del 2020, sin estudios de impacto vial previos.'
            }
          ],
          footer: 'Sello del Órgano de Control Institucional Callao'
        }
      },
      {
        id: 'aud-003',
        name: 'Colaborador_Eficaz_Sesion_Falsa_Adjudicacion.mp3',
        type: 'audio',
        size: '2.5 MB',
        uploadedAt: '2023-01-14 18:00',
        mockContent: {
          duration: '2:08',
          transcription: `[00:03] Fiscal Provincial: "Iniciamos grabación de la declaración del Colaborador Eficaz N° 03-2023 con resguardo de identidad. Describa las reuniones sostenidas con el investigado Roberto Rojas Pérez."\n[00:15] Colaborador: "Fueron dos reuniones. La primera fue en el restaurante de La Punta a fines de febrero del 2020. Roberto nos dijo claro: 'La obra sale sí o sí, pero el retorno es del 5%'. Nos exigió depositar la garantía en una cuenta offshore que su cuñado manejaba."\n[00:40] Fiscal Provincial: "¿El investigado sabía del desabastecimiento de maquinarias de su consorcio?"\n[00:45] Colaborador: "Por supuesto. Nosotros le presentamos el perfil ficticio diciéndole que arrendaríamos los camiones en el camino. Él mismo redactó el informe de emergencia el 10 de marzo para justificar la adjudicación express en un solo día. Recibió el primer pago de S/. 50,000 apenas se firmó el cheque de adelanto estatal."`,
          audioUrl: ''
        }
      }
    ];
  }

  // Generic fallback case files
  return [
    {
      id: 'doc-generic-01',
      name: 'Acta_de_Constatacion_Fiscal_General.pdf',
      type: 'document',
      size: '800 KB',
      uploadedAt: '2026-05-12 10:00',
      mockContent: {
        header: 'MINISTERIO PÚBLICO • FISCALÍA DE LA NACIÓN',
        sections: [
          {
            title: 'ACTA DE CONSTACIÓN Y APERTURA DE INVESTIGACIÓN penal',
            body: 'En el distrito judicial de la jurisdicción nacional, el Fiscal responsable procede a asentar la apertura de la presente diligencia de calificación procesal y evaluación documentaria.'
          },
          {
            title: 'REQUERIMIENTO INFORMATIVO',
            body: 'Se exhorta a las dependencias policiales intervinientes a remitir de inmediato las grabaciones, actas foliadas y peritajes complementarios bajo apercibimiento de ley.'
          }
        ],
        footer: 'Área de Control Determinístico de Plazos y Prescripciones'
      }
    },
    {
      id: 'aud-generic-01',
      name: 'Grabacion_Declaracion_Testigo_Ocular.wav',
      type: 'audio',
      size: '640 KB',
      uploadedAt: '2026-05-12 11:30',
      mockContent: {
        duration: '0:30',
        transcription: `[00:01] Fiscal adjunto: "¿Pudo observar al presunto autor del hecho?"\n[00:05] Testigo: "Sí, señor fiscal, yo estaba parado en la esquina. Un vehículo oscuro huyó velozmente del pasaje segundos después del tumulto. Llegaron los serenazgos y la policía a levantar el reporte. Reconocí al imputado de inmediato."`,
        audioUrl: ''
      }
    }
  ];
};

export default function CaseDocumentVisualizer({ currentCase, onUpdateCase }: CaseDocumentVisualizerProps) {
  // Ensure we extract files. If nonexistent on the case, seed them!
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Custom Audio Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioVolume, setAudioVolume] = useState<number>(80);
  const [audioTime, setAudioTime] = useState<string>('0:00');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Sync state whenever the case ID shifts
  useEffect(() => {
    let currentAttachments = currentCase.attachments;
    if (!currentAttachments || currentAttachments.length === 0) {
      currentAttachments = getPreloadedAttachments(currentCase.id);
      // Keep case updated
      onUpdateCase({
        ...currentCase,
        attachments: currentAttachments
      });
    }
    setAttachments(currentAttachments);
    setSelectedAttachment(currentAttachments[0] || null);
    setIsPlaying(false);
  }, [currentCase.id]);

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update audio progression dynamically
  const updateAudioProgress = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 1;
      setAudioProgress((cur / dur) * 100);
      
      const min = Math.floor(cur / 60);
      const sec = Math.floor(cur % 60);
      setAudioTime(`${min}:${sec < 10 ? '0' : ''}${sec}`);
      
      if (audioRef.current.ended) {
        setIsPlaying(false);
        setAudioProgress(0);
        setAudioTime('0:00');
      } else {
        animationFrameRef.current = requestAnimationFrame(updateAudioProgress);
      }
    }
  };

  // Toggle Play State
  const handlePlayToggle = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    } else {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.volume = audioVolume / 100;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        animationFrameRef.current = requestAnimationFrame(updateAudioProgress);
      }).catch(err => {
        // Fallback for sandboxed environments representing a fully simulated experience
        console.warn("Audio play blocked by browser sandbox / no elements, initiating high-fidelity simulated playback.", err);
        setIsPlaying(true);
        simulateAudioPlayback();
      });
    }
  };

  // Safe Simulated Playback for testing sandbox
  const simulateAudioPlayback = () => {
    let currentSeconds = 0;
    const totalParts = 100;
    const totalDurationSeconds = parseFloat(selectedAttachment?.mockContent?.duration?.split(':')[1] || '45');
    
    const interval = setInterval(() => {
      if (!isPlaying) {
        clearInterval(interval);
        return;
      }
      currentSeconds += 0.5 * playbackSpeed;
      const progress = (currentSeconds / totalDurationSeconds) * 100;
      
      if (progress >= 100) {
        setIsPlaying(false);
        setAudioProgress(100);
        setAudioTime(selectedAttachment?.mockContent?.duration || '0:45');
        clearInterval(interval);
      } else {
        setAudioProgress(progress);
        const m = Math.floor(currentSeconds / 60);
        const s = Math.floor(currentSeconds % 60);
        setAudioTime(`${m}:${s < 10 ? '0' : ''}${s}`);
      }
    }, 500);
  };

  // Speed adjustor
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Progress slider seeker
  const handleProgressSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAudioProgress(val);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
    }
  };

  // Volume slider control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value);
    setAudioVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processUploadedFiles = (files: FileList) => {
    const newAttachments = [...attachments];
    
    Array.from(files).forEach((file, index) => {
      let fType: 'document' | 'audio' | 'image' = 'document';
      if (file.type.startsWith('audio/')) fType = 'audio';
      else if (file.type.startsWith('image/')) fType = 'image';
      
      const blobUrl = URL.createObjectURL(file);
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

      const newFile: Attachment = {
        id: `upload-${Date.now()}-${index}`,
        name: file.name,
        type: fType,
        size: sizeStr,
        uploadedAt: dateStr,
        contentUrl: blobUrl,
        mockContent: {
          header: 'DOCUMENTO CARGADO POR EL FISCAL',
          sections: [
            { 
              title: 'Información del Archivo Digital', 
              body: `Archivo: ${file.name}\nTipo Mime: ${file.type}\nTamaño Completo: ${sizeStr}\nCargado Localmente: ${dateStr}.\n\nEste archivo está cargado de forma temporal en la memoria del navegador para auditoría interactiva.` 
            }
          ],
          footer: 'Módulo de Gestión de Evidencia • Ministerio Público Perú',
          duration: fType === 'audio' ? '1:30' : undefined,
          transcription: fType === 'audio' ? '[Simulado] Procesando cargamento de audio vía transcriptor fiscal... El audio está listo para ser escuchado.' : undefined,
          imageUrl: fType === 'image' ? blobUrl : undefined
        }
      };

      newAttachments.push(newFile);
    });

    setAttachments(newAttachments);
    // Keep parent case synchronised so clicking save persists this in localStorage under the Case!
    const updated = {
      ...currentCase,
      attachments: newAttachments
    };
    onUpdateCase(updated);
    
    // Select the newly uploaded file
    if (newAttachments.length > attachments.length) {
      setSelectedAttachment(newAttachments[newAttachments.length - 1]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFiles(e.target.files);
    }
  };

  const handleDeleteAttachment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(`¿Está seguro de remover este archivo de la carpeta fiscal?`);
    if (!confirmed) return;

    const filtered = attachments.filter(a => a.id !== id);
    setAttachments(filtered);
    
    const updated = {
      ...currentCase,
      attachments: filtered
    };
    onUpdateCase(updated);

    if (selectedAttachment?.id === id) {
      setSelectedAttachment(filtered[0] || null);
      setIsPlaying(false);
    }
  };

  // Filter attachments for search
  const filteredAttachments = attachments.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="case-document-visualizer">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4.5 h-4.5 text-amber-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Expediente Digital: Evidencias, Audios y Actas PNP/Fiscalía
          </h4>
        </div>
        <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700/60 flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3 text-amber-500" />
          {attachments.length} Archivos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
        {/* Left Side: Attachment manager / File search / Upload Box */}
        <div className="md:col-span-5 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-3 border-b border-slate-150 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar evidencia..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[300px] p-2 space-y-1">
            {filteredAttachments.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No se encontraron registros de evidencia en esta carpeta.
              </div>
            ) : (
              filteredAttachments.map((file) => {
                const isSelected = selectedAttachment?.id === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      setSelectedAttachment(file);
                      setIsPlaying(false);
                      setAudioProgress(0);
                    }}
                    className={`group w-full text-left p-2.5 rounded-lg border flex items-start gap-2.5 cursor-pointer transition ${
                      isSelected 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                        : 'border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50/80 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {file.type === 'document' && <FileText className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />}
                      {file.type === 'audio' && <Music className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />}
                      {file.type === 'image' && <ImageIcon className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-tight truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {file.size}
                        </span>
                        <span className="text-[9px] text-slate-400">•</span>
                        <span className="text-[9px] text-slate-400">
                          {file.uploadedAt.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteAttachment(file.id, e)}
                      className={`text-slate-400 hover:text-red-500 p-1 rounded transition opacity-0 group-hover:opacity-100 ${
                        isSelected ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Drag & Drop Upload Zone */}
          <div className="p-3 border-t border-slate-150 bg-slate-50">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border border-dashed rounded-lg p-3 text-center transition flex flex-col items-center justify-center cursor-pointer ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700' 
                  : 'border-slate-250 bg-white hover:bg-slate-50 text-slate-600 hover:border-slate-400'
              }`}
            >
              <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
              <p className="text-[11px] font-semibold text-slate-700">Arrastre su evidencia aquí</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Soporta Actas PDF, Audios MP3/WAV o Fotos JPG</p>
              
              <label className="mt-2 text-[10px] bg-slate-900 hover:bg-slate-800 text-white font-medium px-2 py-1 rounded shadow-sm cursor-pointer inline-flex items-center gap-1.5 transition">
                <span>Seleccionar Archivos</span>
                <input
                  type="file"
                  multiple
                  accept="audio/*,image/*,.pdf,text/*"
                  onChange={handleManualUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Render Active Evidence / Document Reader / Audio Wave Player */}
        <div className="md:col-span-7 p-4 bg-white flex flex-col justify-between">
          {selectedAttachment ? (
            <div className="space-y-4 h-full flex flex-col justify-between">
              
              {/* Document Header Panel */}
              <div className="border-b border-slate-100 pb-2.5">
                <span className="bg-slate-100 text-slate-800 text-[9px] uppercase font-bold px-2 py-0.5 rounded tracking-wide">
                  Visualizador Integrado: {selectedAttachment.type.toUpperCase()}
                </span>
                <h5 className="text-xs font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
                  {selectedAttachment.name}
                </h5>
                <p className="text-[10px] text-slate-500">Cargado: {selectedAttachment.uploadedAt} • Peso: {selectedAttachment.size}</p>
              </div>

              {/* Central render portal for files */}
              <div className="flex-1 flex flex-col justify-center my-2">
                {selectedAttachment.type === 'document' && (
                  <div className="border border-slate-150 rounded-lg p-3.5 bg-slate-50/50 max-h-[250px] overflow-y-auto text-slate-800 space-y-3 font-sans relative shadow-sm">
                    {/* Official Document Layout Mockup */}
                    {selectedAttachment.mockContent?.header && (
                      <div className="text-center border-b border-slate-200 pb-2 mb-3">
                        <span className="text-[9px] tracking-wider text-slate-500 font-bold block">REPUBLICA DEL PERU</span>
                        <span className="text-[9px] uppercase tracking-wide font-extrabold text-slate-800 block">
                          {selectedAttachment.mockContent.header}
                        </span>
                      </div>
                    )}
                    
                    {selectedAttachment.mockContent?.sections?.map((sec, sIdx) => (
                      <div key={sIdx} className="space-y-1">
                        <h6 className="text-[10px] uppercase font-extrabold tracking-wide text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded inline-block">
                          {sec.title}
                        </h6>
                        <p className="text-xs text-slate-700 leading-relaxed font-normal pl-1">
                          {sec.body}
                        </p>
                      </div>
                    ))}

                    {/* Official Stamp Mockup */}
                    <div className="pt-4 flex justify-between items-end border-t border-slate-100 mt-4 text-[9px] text-slate-400">
                      <span>{selectedAttachment.mockContent?.footer || 'Ministerio Público del Perú'}</span>
                      <div className="text-center mr-4">
                        <div className="w-16 h-16 rounded-full border-2 border-indigo-600/30 border-dashed flex items-center justify-center leading-none text-indigo-600/50 text-[8px] font-bold p-1 italic rotate-[-12deg]">
                          <div>Cargo de<br />Recepcion • MPFN</div>
                        </div>
                        <span className="block mt-1 font-mono">Foliado N° 04</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAttachment.type === 'image' && (
                  <div className="text-center border border-slate-100 rounded-lg overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-2 shadow-inner relative group min-h-[180px]">
                    {selectedAttachment.mockContent?.imageUrl ? (
                      <>
                        <img 
                          src={selectedAttachment.mockContent.imageUrl} 
                          alt={selectedAttachment.name}
                          className="max-h-[180px] object-contain rounded border border-white/10 opacity-90 hover:opacity-100 transition"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[8px] font-mono px-1.5 py-0.5 rounded tracking-widest uppercase">
                          REC CCTV-PASS-04
                        </div>
                      </>
                    ) : (
                      <div className="p-8 text-slate-400 text-xs flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 text-slate-600 mb-2" />
                        No hay una imagen disponible para este archivo.
                      </div>
                    )}
                  </div>
                )}

                {selectedAttachment.type === 'audio' && (
                  <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-md relative overflow-hidden flex flex-col">
                    
                    {/* Underlying standard HTML5 audio element for actual uploads */}
                    {selectedAttachment.contentUrl && (
                      <audio
                        ref={audioRef}
                        src={selectedAttachment.contentUrl}
                        className="hidden"
                      />
                    )}

                    {/* Dynamic Sound Wave Form Rendering */}
                    <div className="h-12 flex items-center gap-1 justify-center px-4 my-2">
                      {Array.from({ length: 32 }).map((_, idx) => {
                        // Create a realistic pulsating bar waveform
                        let height = 8 + (Math.sin(idx * 0.4) * 14) + (idx % 2 === 0 ? 12 : 2);
                        if (!isPlaying) {
                          height = 6 + (idx % 3 === 0 ? 6 : 2);
                        } else {
                          // Make heights highly volatile/responsive to play state
                          height = height * (0.6 + Math.random() * 0.8);
                        }
                        
                        return (
                          <div
                            key={idx}
                            style={{ height: `${Math.max(4, Math.min(48, height))}px` }}
                            className={`w-1 rounded-full transition-all duration-300 ${
                              isPlaying ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'
                            }`}
                          />
                        );
                      })}
                    </div>

                    {/* Audio Player Row */}
                    <div className="flex items-center justify-between gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePlayToggle}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow transition-all focus:outline-none ${
                            isPlaying 
                              ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' 
                              : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                        </button>

                        <div className="text-left">
                          <span className="text-[10px] font-extrabold text-indigo-400 block tracking-wider uppercase font-mono">
                            {isPlaying ? 'REPRODUCIENDO..' : 'PAUSADO'}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-300">
                            {audioTime} / {selectedAttachment.mockContent?.duration || '1:30'}
                          </span>
                        </div>
                      </div>

                      {/* Playback rate speed settings selector */}
                      <div className="flex items-center gap-1">
                        {[0.5, 1, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSpeedChange(s)}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition ${
                              playbackSpeed === s 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Scrubber Progress Slider */}
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={audioProgress}
                        onChange={handleProgressSeek}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                      />
                    </div>

                    {/* Volume Row wrapper */}
                    <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-800/60 justify-end">
                      <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={audioVolume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Transcription & Details pane for audio files */}
              {selectedAttachment.type === 'audio' && selectedAttachment.mockContent?.transcription && (
                <div className="mt-1 bg-slate-50 border border-slate-150 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="p-0.5 bg-indigo-100 text-indigo-800 rounded text-[8px] font-bold uppercase">Fiscal-AI</span>
                    <h6 className="text-[10px] font-extrabold text-slate-700 uppercase tracking-tight">Transcripción Procesal Legal</h6>
                  </div>
                  <p className="text-xxs text-slate-650 leading-relaxed font-mono whitespace-pre-line max-h-[85px] overflow-y-auto pl-1 bg-white p-1.5 rounded border border-slate-100 border-dashed">
                    {selectedAttachment.mockContent.transcription}
                  </p>
                </div>
              )}

              {/* Action Buttons: Download evidence / External Audit */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2 mt-2">
                <a
                  href={selectedAttachment.contentUrl || '#'}
                  download={selectedAttachment.name}
                  onClick={(e) => {
                    // Prevent actual downloading empty hashes
                    if (!selectedAttachment.contentUrl) {
                      e.preventDefault();
                      alert('Este archivo de ejemplo está cargado como simulador fidedigno. Puede cargar sus propios archivos usando la zona de drag&drop para descargarlos real-time.');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xxs font-bold rounded-lg inline-flex items-center gap-1.5 transition"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Descargar Archivo Original
                </a>
                <button
                  type="button"
                  onClick={() => alert(`El Ministerio Público certifica la integridad criptográfica de este archivo (Hash SHA-256 verificado por los peritos del Distrito Fiscal).`)}
                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xxs font-semibold rounded-lg inline-flex items-center gap-1 transition"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Firmado / Validado (SHA256)
                </button>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <HelpCircle className="w-10 h-10 text-slate-200 mb-2" />
              <p className="text-xs font-sans">
                Por favor seleccione un archivo del listado izquierdo o arrastre una grabacion o documento clínico/policial para auditar su validez jurídica.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
