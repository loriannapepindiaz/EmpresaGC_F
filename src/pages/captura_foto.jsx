import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CapturaFoto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [hasPhoto, setHasPhoto] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fechaAuto, setFechaAuto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // <--- Estado para el Skeleton

  // Recuperamos los datos que vienen de la pantalla anterior
  const id = location.state?.id;
  const areaRecibida = location.state?.area || "Área General";
  const auditor = location.state?.auditor || "Auditor";

  useEffect(() => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();
    setFechaAuto(`${dia}/${mes}/${anio}`);

    // Simulamos un tiempo de carga breve para el efecto visual
    const timer = setTimeout(() => setIsLoading(false), 800);

    if (!id) {
      console.error("No se recibió el ID de la auditoría");
    }

    return () => clearTimeout(timer);
  }, [id, location.state]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHasPhoto(true);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const irAEvaluacion = async () => {
    if (!id) {
      alert("Error técnico: No hay ID de auditoría. Reintente el inicio.");
      return;
    }

    setCargando(true);
    try {
      await axios.put(`${API_URL}/api/actualizar-foto/${id}`, {
        nombreFoto: `foto_evidencia_${id}.jpg`
      });

      navigate('/evaluacion', { 
        state: { 
          ...location.state,
          id,
          fotoArea: previewUrl 
        } 
      });
    } catch (err) {
      console.error("Error al vincular foto:", err);
      alert("No se pudo guardar la referencia de la foto en la base de datos.");
    } finally {
      setCargando(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full bg-[#f6f8f7] flex items-center justify-center p-4 font-sans overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap" rel="stylesheet" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="relative w-full max-w-[420px] h-[90vh] flex flex-col bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-gray-100">
        
        <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white z-10">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-700">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">Evidencia Visual</h2>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 bg-white no-scrollbar">
          
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex gap-3">
            <span className="material-symbols-outlined text-blue-500 text-2xl flex-shrink-0">info</span>
            <div className="text-sm text-blue-900">
              <p className="font-bold mb-1 text-xs">Instrucción:</p>
              <p className="leading-relaxed opacity-90 text-xs">
                Tome una foto clara del área completa. Esta imagen se usará en el reporte PDF final.
              </p>
            </div>
          </div>

          {/* Área de Captura con Skeleton */}
          <label className="group relative flex flex-col items-center justify-center w-full aspect-[4/3] rounded-[2.5rem] border-2 border-dashed border-gray-200 hover:border-[#25d466] bg-gray-50 transition-all cursor-pointer overflow-hidden shadow-inner">
            {isLoading ? (
              <div className="absolute inset-0">
                <Skeleton height="100%" borderRadius={40} />
              </div>
            ) : hasPhoto && previewUrl ? (
              <div className="absolute inset-0 w-full h-full">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 p-3 rounded-full shadow-lg">
                    <span className="material-symbols-outlined text-[#25d466] text-3xl">add_a_photo</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 p-6 text-center z-10 group-hover:scale-105 transition-transform">
                <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center text-[#25d466]">
                  <span className="material-symbols-outlined text-[40px]">photo_camera</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-800 block">Subir Foto</span>
                  <p className="text-xs text-gray-500 mt-1">Haga clic para capturar</p>
                </div>
              </div>
            )}
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>

          <div className="mt-8 p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 w-full">
                <span className="material-symbols-outlined text-gray-400 text-xl">location_on</span>
                <div className="w-full">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Área Seleccionada</p>
                  {isLoading ? <Skeleton width="50%" /> : <p className="text-sm font-bold text-gray-800">{areaRecibida}</p>}
                </div>
              </div>
            </div>
            
            <div className="h-[1px] bg-gray-200 w-full"></div>

            <div className="flex items-center gap-3 w-full">
              <span className="material-symbols-outlined text-gray-400 text-xl">person</span>
              <div className="w-full">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Auditor Asignado</p>
                {isLoading ? <Skeleton width="40%" /> : <p className="text-sm font-bold text-gray-800">{auditor}</p>}
              </div>
            </div>
          </div>
        </main>

        <div className="p-6 bg-white border-t border-gray-100">
          {isLoading ? (
            <Skeleton height={56} borderRadius={16} />
          ) : (
            <button 
              onClick={irAEvaluacion}
              disabled={!hasPhoto || cargando}
              className={`w-full h-14 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg
                ${hasPhoto && !cargando
                  ? 'bg-[#25d466] text-white shadow-[#25d466]/30' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
            >
              <span>{cargando ? "Guardando..." : "Comenzar Evaluación"}</span>
              {!cargando && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CapturaFoto;