import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoSTG from '../assets/logo.jfif'; 

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f6f8f7] flex items-center justify-center p-4 font-sans">
      {/* Import de iconos Material Symbols */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Contenedor estilo celular */}
      <div className="relative w-full max-w-[420px] h-[90vh] flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl sm:shadow-2xl md:shadow-2xl">
        {/* 
          shadow-xl en móvil (pequeño y sutil)
          shadow-2xl solo en pantallas sm (≥640px) y md (≥768px)
        */}
        
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          {/* Logo Central */}
          <div className="w-56 h-56 flex items-center justify-center mb-8">
            <img 
              src={logoSTG} 
              alt="Logo STG" 
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>

          {/* Textos */}
          <div className="mb-12">
            <h1 className="text-[#121714] text-3xl font-black tracking-tight mb-2">
              5S Audit System
            </h1>
            <p className="text-gray-500 text-base font-medium">
              Plataforma Digital de Auditorías
            </p>
          </div>

          {/* Botón circular con flechita */}
          <div className="flex flex-col items-center gap-8 w-full">
            <button 
              onClick={() => navigate('/auditoria')}
              className="w-16 h-16 rounded-full bg-[#25d466] flex items-center justify-center shadow-[0_10px_25px_rgba(37,212,102,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-white text-3xl group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>

            {/* Créditos */}
            <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">
              v1.0.2 | © Scandinavian Tobacco Group
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;