 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import logoSTG from '../assets/logo.jfif';


const Welcome = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Simulamos un tiempo de carga o esperamos a que los recursos pesados listos
    // También puedes quitar el timeout y usar el onLoad de la imagen
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="min-h-screen w-full bg-[#f6f8f7] flex items-center justify-center p-4 font-sans">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />


      <div className="relative w-full max-w-[420px] h-[90vh] flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl">
       
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
         
          {/* Logo Central con Skeleton */}
          <div className="w-56 h-56 flex items-center justify-center mb-8">
            {isLoading ? (
              <Skeleton circle height={180} width={180} />
            ) : (
              <img
                src={logoSTG}
                alt="Logo STG"
                className="w-full h-full object-contain drop-shadow-xl animate-fade-in"
              />
            )}
          </div>


          {/* Textos con Skeleton */}
          <div className="mb-12 w-full">
            {isLoading ? (
              <>
                <Skeleton height={35} width="80%" style={{ marginBottom: '10px' }} />
                <Skeleton height={20} width="60%" />
              </>
            ) : (
              <>
                <h1 className="text-[#121714] text-3xl font-black tracking-tight mb-2">
                  5S Audit System
                </h1>
                <p className="text-gray-500 text-base font-medium">
                  Plataforma Digital de Auditorías
                </p>
              </>
            )}
          </div>


          {/* Botón con Skeleton */}
          <div className="flex flex-col items-center gap-8 w-full">
            {isLoading ? (
              <Skeleton circle height={64} width={64} />
            ) : (
              <button
                onClick={() => navigate('/auditoria')}
                className="w-16 h-16 rounded-full bg-[#25d466] flex items-center justify-center shadow-[0_10px_25px_rgba(37,212,102,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
              >
                <span className="material-symbols-outlined text-white text-3xl group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            )}


            {/* Créditos siempre visibles o con skeleton pequeño */}
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