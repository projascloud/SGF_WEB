import React, { useState, useEffect } from 'react';
import { CaseData, CaseParty } from '../types';
import { 
  User, 
  Plus, 
  Trash2, 
  UserPlus, 
  FileCheck, 
  ShieldAlert, 
  HeartHandshake, 
  Scale,
  Contact,
  HelpCircle
} from 'lucide-react';

interface CasePartiesManagerProps {
  caseData: CaseData;
  onChange: (updatedCase: CaseData) => void;
}

const PARTY_CONFIG = {
  denunciante: {
    label: 'Denunciante',
    colorClass: 'bg-blue-50 border-blue-200 text-blue-700',
    iconColor: 'text-blue-500 bg-blue-100',
    badgeClass: 'bg-blue-100 text-blue-800'
  },
  denunciado: {
    label: 'Denunciado',
    colorClass: 'bg-amber-50 border-amber-200 text-amber-850',
    iconColor: 'text-amber-500 bg-amber-100',
    badgeClass: 'bg-amber-100 text-amber-900'
  },
  imputado: {
    label: 'Imputado',
    colorClass: 'bg-rose-50 border-rose-200 text-rose-700',
    iconColor: 'text-rose-500 bg-rose-100',
    badgeClass: 'bg-rose-100 text-rose-800'
  },
  agraviado: {
    label: 'Agraviado',
    colorClass: 'bg-emerald-50 border-emerald-200 text-emerald-750',
    iconColor: 'text-emerald-500 bg-emerald-100',
    badgeClass: 'bg-emerald-100 text-emerald-800'
  }
};

export default function CasePartiesManager({ caseData, onChange }: CasePartiesManagerProps) {
  const [parties, setParties] = useState<CaseParty[]>([]);
  
  // New party form state
  const [isOpenCreator, setIsOpenCreator] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<CaseParty['type']>('denunciante');
  const [newDocType, setNewDocType] = useState<CaseParty['documentType']>('DNI');
  const [newDocNum, setNewDocNum] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Synchronise state with incoming caseData or legacy strings
  useEffect(() => {
    if (caseData.partes && caseData.partes.length > 0) {
      setParties(caseData.partes);
    } else {
      // Seed from standard caseData properties for compatibility
      const initialized: CaseParty[] = [];
      if (caseData.denunciante) {
        initialized.push({
          id: `seed-denunciante-${Date.now()}`,
          name: caseData.denunciante,
          type: 'denunciante',
          documentType: 'DNI',
          documentNumber: '',
          notes: 'Pre-declarado en expediente'
        });
      }
      if (caseData.denunciado) {
        // Splitting comma lists if multiple were given already
        const devs = caseData.denunciado.split(',');
        devs.forEach((dName, dIdx) => {
          const trimmed = dName.trim();
          if (trimmed) {
            initialized.push({
              id: `seed-denunciado-${Date.now()}-${dIdx}`,
              name: trimmed,
              type: 'imputado', // default suspect role
              documentType: 'DNI',
              documentNumber: '',
              notes: 'Pre-declarado en expediente'
            });
          }
        });
      }
      setParties(initialized);
      
      // Update caseData.partes with initial array
      if (initialized.length > 0) {
        onChange({
          ...caseData,
          partes: initialized
        });
      }
    }
  }, [caseData.id]);

  // Sync back to parents and general fields whenever parties change
  const updateCaseParties = (updatedParties: CaseParty[]) => {
    setParties(updatedParties);

    // Sync legacy text properties so the rest of the app compiles and is elegant
    const firstDenunciante = updatedParties.find(p => p.type === 'denunciante')?.name || 
                            updatedParties.find(p => p.type === 'agraviado')?.name || '';
                            
    const suspects = updatedParties
      .filter(p => p.type === 'imputado' || p.type === 'denunciado')
      .map(p => p.name);
      
    const combinedDenunciado = suspects.length > 0 ? suspects.join(', ') : '';

    onChange({
      ...caseData,
      partes: updatedParties,
      denunciante: firstDenunciante,
      denunciado: combinedDenunciado
    });
  };

  const handleAddParty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const added: CaseParty = {
      id: `party-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: newName.trim(),
      type: newType,
      documentType: newDocType,
      documentNumber: newDocNum.trim() || undefined,
      notes: newNotes.trim() || undefined
    };

    const newPartiesList = [...parties, added];
    updateCaseParties(newPartiesList);

    // Clear form
    setNewName('');
    setNewDocNum('');
    setNewNotes('');
    setIsOpenCreator(false);
  };

  const handleRemoveParty = (id: string) => {
    const confirmation = window.confirm('¿Está seguro de de-vincular a este sujeto procesal de la carpeta?');
    if (!confirmation) return;

    const filtered = parties.filter(p => p.id !== id);
    updateCaseParties(filtered);
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4" id="parties-manager-container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Contact className="w-5 h-5 text-slate-800" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Sujetos Procesales / Partes del Caso
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setIsOpenCreator(!isOpenCreator)}
          className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition"
        >
          <UserPlus className="w-3.5 h-3.5" />
          {isOpenCreator ? 'Cancelar' : 'Vincular Sujeto'}
        </button>
      </div>

      {/* Creation form */}
      {isOpenCreator && (
        <form onSubmit={handleAddParty} className="bg-white border border-slate-200 rounded-lg p-3 space-y-3 shadow-inner">
          <div className="text-[11px] font-extrabold text-slate-850 uppercase border-b border-slate-100 pb-1.5 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5 text-indigo-500" />
            Vincular Nueva Persona / Entidad
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Nombre Completo o Razón Social</label>
              <input
                type="text"
                required
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Ej: Manuel Gonzales Soto S.A.C."
                className="w-full px-2.5 py-1.5 text-xs border border-slate-250 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Rol Procesal</label>
              <div className="grid grid-cols-4 gap-1">
                {(Object.keys(PARTY_CONFIG) as CaseParty['type'][]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewType(type)}
                    className={`text-[9px] font-semibold py-1.5 px-0.5 rounded-md border text-center transition capitalize ${
                      newType === type 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                        : 'bg-slate-50 border-slate-205 text-slate-650 hover:bg-slate-100'
                    }`}
                  >
                    {PARTY_CONFIG[type].label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Documento de Identidad</label>
              <div className="flex gap-1">
                <select
                  value={newDocType}
                  onChange={e => setNewDocType(e.target.value as CaseParty['documentType'])}
                  className="px-1.5 py-1.5 text-xs border border-slate-250 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                  <option value="CE">C.E.</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
                <input
                  type="text"
                  value={newDocNum}
                  onChange={e => setNewDocNum(e.target.value)}
                  placeholder="Nro. Documento"
                  className="flex-1 px-2 py-1.5 text-xs border border-slate-250 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Anotaciones / Domicilio o Perfil</label>
              <input
                type="text"
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                placeholder="Ej: Declarante, no cooperativo"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-250 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-sm transition"
            >
              Confirmar Vinculación
            </button>
          </div>
        </form>
      )}

      {/* Parties List Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {parties.length === 0 ? (
          <div className="col-span-2 text-center py-6 text-slate-400 text-xs flex flex-col items-center justify-center bg-white rounded-lg border border-slate-100">
            <HelpCircle className="w-8 h-8 text-slate-200 mb-1" />
            No hay sujetos vinculados. Agregue uno usando el botón.
          </div>
        ) : (
          parties.map((p) => {
            const cfg = PARTY_CONFIG[p.type] || PARTY_CONFIG.denunciante;
            return (
              <div
                key={p.id}
                className={`flex items-start justify-between p-2.5 rounded-lg border shadow-sm transition ${cfg.colorClass}`}
              >
                <div className="flex items-start gap-2 min-w-0">
                  {/* Persona avatar ("Muñequito") with individual role color background */}
                  <div className={`p-1.5 rounded-md shrink-0 flex items-center justify-center ${cfg.iconColor} shadow-inner`}>
                    <User className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-snug text-slate-900 truncate">
                      {p.name}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1 items-center">
                      <span className={`text-[8px] font-extrabold uppercase px-1 py-0.2 rounded-sm ${cfg.badgeClass}`}>
                        {cfg.label}
                      </span>
                      {p.documentNumber && (
                        <span className="text-[9px] font-mono text-slate-500">
                          {p.documentType}: {p.documentNumber}
                        </span>
                      )}
                    </div>
                    {p.notes && (
                      <p className="text-[9px] text-slate-500 italic mt-1 leading-tight line-clamp-1">
                        "{p.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveParty(p.id)}
                  className="text-slate-400 hover:text-red-500 p-0.5 rounded transition shrink-0 ml-1 hover:bg-white/10"
                  title="Desvincular"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
