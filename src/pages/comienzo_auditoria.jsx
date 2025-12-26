import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatosInicio, iniciarAuditoriaEnBD } from '../services/auditoriaService';

const ComienzoAuditoria = () => {
  const navigate = useNavigate();
  
  // ESTADOS
  const [areasBD, setAreasBD] = useState([]);
  const [area, setArea] = useState("");
  const [representante, setRepresentante] = useState("");
  const [nombreAuditor, setNombreAuditor] = useState("Alex Ruiz");
  const [editando, setEditando] = useState(false);
  const [fechaAutomatica, setFechaAutomatica] = useState("");

  useEffect(() => {
    const cargarInfo = async () => {
      try {
        const data = await getDatosInicio();
        setAreasBD(data.areas);
      } catch (err) {
        console.log("Servidor no disponible", err);
      }
    };
    cargarInfo();

    const hoy = new Date();
    setFechaAutomatica(`${String(hoy.getDate()).padStart(2, '0')}/${String(hoy.getMonth() + 1).padStart(2, '0')}/${hoy.getFullYear()}`);
  }, []);

  const manejarInicio = async () => {
    if (!area || !representante) {
      alert("⚠️ El área y el representante son obligatorios.");
      return;
    }

    try {
      // GUARDAR EN BD
      const resultado = await iniciarAuditoriaEnBD({
        id_area: area,
        nombre_representante: representante,
        nombre_auditor: nombreAuditor
      });

      console.log("Auditoría creada en BD:", resultado); // Debug: verifica que id_auditoria sea real

      // PASAR AL SIGUIENTE PASO CON EL ID REAL
      navigate('/captura-foto', { 
        state: { 
          id: resultado.id_auditoria,         // ← Cambiado a "id" para consistencia
          area,
          auditor: nombreAuditor,
          representante,
          fecha: fechaAutomatica 
        } 
      });
    } catch (err) {
      console.error("Error al iniciar auditoría:", err);
      alert("Error al conectar con la base de datos.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f8f7] flex items-center justify-center p-4 font-sans overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap" rel="stylesheet" />
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      <div className="relative w-full max-w-[420px] h-[90vh] flex flex-col bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-gray-100">
        <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white z-10">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-gray-700">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">Inicio de Auditoría</h2>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 bg-white no-scrollbar">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">Comenzar Inspección</h1>
            <p className="text-gray-600 text-sm font-medium">Complete los detalles de la sesión.</p>
          </div>

          {/* Card del Auditor */}
          <div className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between border border-gray-200 mb-8 shadow-sm">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                <img src={`https://ui-avatars.com/api/?name=${nombreAuditor}&background=25d466&color=fff`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.15em] mb-0.5">Auditor asignado</p>
                {editando ? (
                  <input autoFocus className="bg-white border border-[#25d466] rounded px-2 py-0.5 text-sm w-full outline-none" value={nombreAuditor} onChange={(e) => setNombreAuditor(e.target.value)} onBlur={() => setEditando(false)} />
                ) : (
                  <p className="text-gray-900 font-bold text-base">{nombreAuditor}</p>
                )}
              </div>
            </div>
            <button onClick={() => setEditando(!editando)} className="text-gray-400">
              <span className="material-symbols-outlined">{editando ? 'check_circle' : 'edit'}</span>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Área de trabajo *</label>
              <div className="relative">
                <select 
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-700 text-sm font-medium focus:ring-2 focus:ring-[#25d466]/20 appearance-none outline-none"
                >
                  <option value="">Seleccionar área</option>
                  <option value="galera_1">Galera 1</option>
                  <option value="galera_2">Galera 2</option>
                  <option value="galera_3">Galera 3</option>
                  <option value="galera_4">Galera 4</option>
                  <option value="galera_5">Galera 5</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Representante del Área *</label>
              <input type="text" value={representante} onChange={(e) => setRepresentante(e.target.value)} placeholder="Nombre del responsable" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-700 font-medium focus:ring-2 focus:ring-[#25d466]/20 outline-none" />
            </div>

            <div className="pt-4">
              <div className="bg-[#25d466]/10 rounded-2xl p-4 border border-[#25d466]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#25d466]">calendar_today</span>
                  <div className="flex flex-col"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Fecha</span><span className="text-sm font-bold text-gray-800">Sincronizada</span></div>
                </div>
                <div className="bg-white px-3 py-1 rounded-lg shadow-sm border border-[#25d466]/20"><span className="text-sm font-black text-[#25d466]">{fechaAutomatica}</span></div>
              </div>
            </div>
          </div>
        </main>

        <div className="p-6 bg-white border-t border-gray-100">
          <button onClick={manejarInicio} className="w-full h-14 bg-[#25d466] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-[#25d466]/30 active:scale-95 transition-all">
            <span>Continuar</span><span className="material-symbols-outlined text-2xl">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComienzoAuditoria;