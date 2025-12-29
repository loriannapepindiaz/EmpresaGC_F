import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Skeleton from 'react-loading-skeleton';  // ← Nueva importación
import 'react-loading-skeleton/dist/skeleton.css';  // ← CSS requerido

const Resultados = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  // ← Estado de carga nuevo
  const [isLoading, setIsLoading] = useState(true);
  const [puntuacionAnimada, setPuntuacionAnimada] = useState(0);
  const [mostrarModalExportar, setMostrarModalExportar] = useState(false);

  if (!location.state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error al cargar resultados</h1>
          <p className="text-gray-700 mb-4">No se recibieron los datos de la evaluación.</p>
          <p className="text-sm text-gray-500">Vuelve atrás y completa la auditoría de nuevo.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 bg-[#2bee79] text-white rounded-lg font-bold shadow-md hover:bg-[#25c265] transition"
          >
            Volver a Evaluación
          </button>
        </div>
      </div>
    );
  }

  const tieneDatos = !!location.state;
  const porcentajeReal = location.state?.porcentaje ?? 0;
  const detallesReal = location.state?.detalles ?? {};
  const hallazgosReal = location.state?.hallazgos ?? [];
  const fotoArea = location.state?.fotoArea || null;
  const idAuditoria = location.state?.id || location.state?.id_auditoria;
  const area = location.state?.area || "No especificada";
  const representante = location.state?.representante || "No especificado";
  const auditor = location.state?.auditor || "Alex Ruiz";
  const fecha = location.state?.fecha || new Date().toLocaleDateString('es-ES');

  useEffect(() => {
    // ← Simula carga de datos + animación
    const timer = setTimeout(() => {
      setIsLoading(false);
      setPuntuacionAnimada(porcentajeReal);
    }, 1200); // 1.2s de skeleton
    return () => clearTimeout(timer);
  }, [porcentajeReal]);

  // ← Si está cargando, muestra skeletons
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#f6f8f7] flex items-center justify-center p-4 font-sans">
        <div className="relative w-full max-w-[420px] h-[90vh] flex flex-col bg-white shadow-xl rounded-[2.5rem] overflow-hidden border border-gray-100">
          
          {/* Header con skeleton */}
          <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
            <Skeleton circle height={40} width={40} />
            <Skeleton height={24} width={120} />
            <div className="w-10" />
          </header>

          <main className="flex-1 overflow-y-auto pb-32 bg-white px-6">
            {/* Título y círculo principal */}
            <div className="flex flex-col items-center pt-8 pb-6">
              <Skeleton height={36} width="60%" />
              <div className="relative size-48 flex items-center justify-center mb-2 mt-8">
                <Skeleton circle height={192} width={192} />
              </div>
              <Skeleton height={16} width="40%" />
            </div>

            {/* Sección Hallazgos */}
            <div className="px-6 py-4 border-t border-gray-50">
              <div className="flex items-center justify-between mb-4">
                <Skeleton height={24} width="80px" />
                <Skeleton height={24} width="60px" />
              </div>
              <Skeleton height={80} count={2} />
            </div>

            {/* Resultados por Etapa */}
            <div className="pb-16 border-t border-gray-50">
              <Skeleton height={24} width="120px" style={{ marginBottom: '24px' }} />
              <Skeleton height={72} count={5} />
            </div>
          </main>

          {/* Footer con botones skeleton */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-12">
            <Skeleton circle height={56} width={56} />
            <Skeleton circle height={56} width={56} />
            <Skeleton circle height={56} width={56} />
          </div>
        </div>
      </div>
    );
  }

  // ← TODO EL RESTO DEL CÓDIGO ORIGINAL (desde dashArray hasta el return final)
  const dashArray = 283;
  const dashOffset = dashArray - (dashArray * puntuacionAnimada) / 100;

  // ... (mantén todo el código original sin cambios desde aquí)
  // Solo pega el resto del código que ya tenías (puntosMaximos, obtenerMensajeDinamico, etc.)
  // hasta el final del return principal

  // ← El return original va aquí (sin cambios)
  return (
    // ... tu JSX original completo
  );
};

export default Resultados;
