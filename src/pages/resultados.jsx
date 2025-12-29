import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Resultados = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

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
    const timer = setTimeout(() => {
      setIsLoading(false);
      setPuntuacionAnimada(porcentajeReal);
    }, 1200);
    return () => clearTimeout(timer);
  }, [porcentajeReal]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#f6f8f7] flex items-center justify-center p-4 font-sans">
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap" rel="stylesheet" />
        <div className="relative w-full max-w-[420px] h-[90vh] flex flex-col bg-white shadow-xl rounded-[2.5rem] overflow-hidden border border-gray-100">
          <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
            <Skeleton circle height={40} width={40} />
            <Skeleton height={24} width={120} />
            <div className="w-10" />
          </header>

          <main className="flex-1 overflow-y-auto pb-32 bg-white custom-scroll px-6">
            <div className="flex flex-col items-center pt-8 pb-6">
              <Skeleton height={36} width="60%" />
              <div className="relative size-48 flex items-center justify-center mb-2 mt-8">
                <Skeleton circle height={192} width={192} />
              </div>
              <Skeleton height={16} width="40%" />
            </div>

            <div className="px-6 py-4 border-t border-gray-50">
              <div className="flex items-center justify-between mb-4">
                <Skeleton height={24} width="80px" />
                <Skeleton height={24} width="60px" />
              </div>
              <Skeleton height={80} count={2} />
            </div>

            <div className="pb-16 border-t border-gray-50">
              <Skeleton height={24} width="120px" style={{ marginBottom: '24px', marginTop: '24px' }} />
              <Skeleton height={72} count={5} />
            </div>
          </main>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-12">
            <Skeleton circle height={56} width={56} />
            <Skeleton circle height={56} width={56} />
            <Skeleton circle height={56} width={56} />
          </div>
        </div>
      </div>
    );
  }

  const dashArray = 283;
  const dashOffset = dashArray - (dashArray * puntuacionAnimada) / 100;

  const puntosMaximos = 25;
  const puntosObtenidos = Object.values(detallesReal).reduce((sum, item) => sum + (Number(item?.score) || 0), 0);
  const puntosRestados = tieneDatos ? (puntosMaximos - puntosObtenidos) : 0;
  const puntosRestadosTexto = puntosRestados > 0 ? `-${puntosRestados} ptos` : "0 ptos";

  const obtenerMensajeDinamico = (score) => {
    if (!tieneDatos) return { t: "Esperando Auditoría", d: "Cargue datos para ver el análisis.", c: "text-gray-400", bg: "bg-gray-50", b: "border-gray-100" };
    if (score < 40) return { t: "Nivel de Cumplimiento: Crítico", d: "Puntaje muy por debajo del estándar.", c: "text-red-700", bg: "bg-red-50", b: "border-red-200" };
    if (score < 80) return { t: "Nivel de Cumplimiento: Regular", d: "Cumplimiento parcial de la normativa.", c: "text-yellow-700", bg: "bg-yellow-50", b: "border-yellow-200" };
    return { t: "Nivel de Cumplimiento: Sobresaliente", d: "Área cumple con todos los estándares.", c: "text-emerald-700", bg: "bg-emerald-50", b: "border-emerald-200" };
  };

  const msg = obtenerMensajeDinamico(porcentajeReal);

  const etapas = [
    { id: 1, n: "Clasificar (Seiri)", i: "inventory_2", c: "bg-green-50 text-green-600" },
    { id: 2, n: "Ordenar (Seiton)", i: "grid_view", c: "bg-orange-50 text-orange-600" },
    { id: 3, n: "Limpiar (Seiso)", i: "cleaning_services", c: "bg-blue-50 text-blue-600" },
    { id: 4, n: "Estandarizar (Seiketsu)", i: "fact_check", c: "bg-purple-50 text-purple-600" },
    { id: 5, n: "Disciplina (Shitsuke)", i: "verified_user", c: "bg-emerald-50 text-emerald-600" }
  ];

  const generarTabla = (doc, startY) => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text(`Auditoría ID: #${idAuditoria || 'SINID'}`, 14, startY);
    doc.text(`Fecha: ${fecha}`, 14, startY + 8);
    doc.text(`Puntaje Final: ${Math.round(porcentajeReal)}%`, 14, startY + 16);
    doc.text(`Área: ${area}`, 14, startY + 24);
    doc.text(`Representante: ${representante}`, 14, startY + 32);
    doc.text(`Auditor: ${auditor}`, 14, startY + 40);

    const tableData = etapas.map(etapa => {
      const info = detallesReal[etapa.id] || {};
      const scoreRaw = info.score;
      const score = scoreRaw != null ? Math.round(Number(scoreRaw)) : null;
      const textoPuntaje = score != null ? `${score}/5` : 'N/D';
      const comentario = info.comment || "Sin observaciones";
      return [etapa.n, textoPuntaje, comentario];
    });

    autoTable(doc, {
      startY: startY + 55,
      head: [['Etapa', 'Puntaje', 'Observaciones']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [43, 238, 121],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 12
      },
      styles: {
        fontSize: 11,
        cellPadding: 5,
        overflow: 'linebreak',
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 65, halign: 'left' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 95, halign: 'left' }
      }
    });
    return doc.lastAutoTable.finalY;
  };

  const exportarPDF = () => {
    if (!tieneDatos || porcentajeReal === 0) {
      alert("No hay datos de auditoría cargados. Completa la evaluación primero.");
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFontSize(22);
    doc.setTextColor(43, 238, 121);
    doc.text("Reporte de Auditoría 5S", 105, 22, { align: 'center' });

    let startY = 40;
    startY = generarTabla(doc, startY);

    if (fotoArea) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 120;
          const maxHeight = 90;
          let { width: imgWidth, height: imgHeight } = img;
          
          const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
          const targetWidth = imgWidth * ratio;
          const targetHeight = imgHeight * ratio;
          
          canvas.width = targetWidth * 6;
          canvas.height = targetHeight * 6;
          ctx.scale(6, 6);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          
          const imgData = canvas.toDataURL('image/jpeg', 0.98);
          const xCenter = (210 - targetWidth) / 2;
          doc.addImage(imgData, 'JPEG', xCenter, startY + 10, targetWidth, targetHeight);
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text('Foto del Área Auditada', 105, startY + targetHeight + 25, { align: 'center' });
          
          doc.save(`Reporte_Auditoria_5S_${idAuditoria || 'SINID'}.pdf`);
        } catch (error) {
          console.warn('Error procesando imagen:', error);
          doc.save(`Reporte_Auditoria_5S_${idAuditoria || 'SINID'}.pdf`);
        }
        setMostrarModalExportar(false);
      };
      
      img.onerror = () => {
        console.warn('No se pudo cargar la imagen');
        doc.save(`Reporte_Auditoria_5S_${idAuditoria || 'SINID'}.pdf`);
        setMostrarModalExportar(false);
      };
      
      img.src = fotoArea;
    } else {
      doc.save(`Reporte_Auditoria_5S_${idAuditoria || 'SINID'}.pdf`);
      setMostrarModalExportar(false);
    }
  };

  const exportarExcelConHistorial = async () => {
    try {
      const wb = XLSX.utils.book_new();
      const idString = idAuditoria || "SINID";

      const resumenData = [
        ["auditoria_id", "fecha", "area", "representante", "auditor", "puntaje_final", "puntos_restados"],
        [idString, fecha, area, representante, auditor, `${Math.round(porcentajeReal)}%`, puntosRestadosTexto]
      ];
      const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
      wsResumen['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, wsResumen, "resumen");

      let registrosData = [["ID", "Fecha", "Área", "Representante", "Auditor", "Porcentaje", "Puntos Restados"]];

       try {
        const res = await fetch(`${API_URL}/api/auditorias-5s`);
        if (!res.ok) throw new Error('Error en API');
        const data = await res.json();

        const sortedData = data.sort((a, b) => a.id_auditoria - b.id_auditoria);

        sortedData.forEach((row) => {
          registrosData.push([
            row.id_auditoria || "SINID",
            new Date(row.fecha_inspeccion).toLocaleDateString('es-ES'),
            row.id_area || 'No especificada',
            row.nombre_representante || 'Sin representante',
            row.id_auditor || 'Alex Ruiz',
            `${Math.round(Number(row.porcentaje_final || 0))}%`,
            Number(row.puntos_restados || 0) > 0 ? `-${Number(row.puntos_restados)} ptos` : "0 ptos"
          ]);
        });
      } catch (apiError) {
        console.warn('API no disponible, usando localStorage:', apiError);
        const historialLocal = JSON.parse(localStorage.getItem('auditorias_5S') || '[]');
        historialLocal.sort((a, b) => (a.id_auditoria || a.id) - (b.id_auditoria || b.id));
        historialLocal.forEach((auditoria) => {
          registrosData.push([
            auditoria.id_auditoria || auditoria.id || "SINID",
            auditoria.fecha || '',
            auditoria.area || 'No especificada',
            auditoria.representante || 'No especificado',
            auditoria.auditor || 'Alex Ruiz',
            auditoria.score || `${Math.round(auditoria.scoreNum || 0)}%`,
            auditoria.puntosRestados || '0 ptos'
          ]);
        });
      }

      const wsRegistros = XLSX.utils.aoa_to_sheet(registrosData);
      wsRegistros['!cols'] = [{ wch: 8 }, { wch: 12 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 12 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, wsRegistros, "registros");

      const auditoriaActualData = [
        ["auditoria_id", "fecha", "area", "puntaje_final"],
        [idString, fecha, area, `${Math.round(porcentajeReal)}%`]
      ];
      const wsActual = XLSX.utils.aoa_to_sheet(auditoriaActualData);
      wsActual['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, wsActual, "auditoria_actual");

      XLSX.writeFile(wb, `Auditoria_5S_${idString}.xlsx`);
      setMostrarModalExportar(false);
    } catch (error) {
      console.error("❌ Error al exportar Excel:", error);
      alert("Error al exportar Excel. Intenta de nuevo.");
    }
  };

  const finalizarProceso = () => {
    alert("¡Proceso finalizado con éxito! Los datos han sido guardados.");
    navigate('/');
  };

  const abrirModalExportar = () => {
    setMostrarModalExportar(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f8f7] flex items-center justify-center p-4 font-sans">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap" rel="stylesheet" />

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>

      <div className="relative w-full max-w-[420px] h-[90vh] flex flex-col bg-white shadow-xl rounded-[2.5rem] overflow-hidden border border-gray-100">
        <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-700">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">Auditoría</h2>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto pb-32 bg-white custom-scroll px-6">
          <div className="flex flex-col items-center pt-8 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Resultados</h1>
            <div className="relative size-48 flex items-center justify-center mb-2">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle className="text-gray-200" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8" />
                <circle
                  className="text-[#2bee79] transition-all duration-1000 ease-out"
                  cx="50" cy="50" fill="none" r="45"
                  stroke="currentColor" strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round" strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-extrabold text-gray-900 tracking-tight leading-none">
                  {Math.round(puntuacionAnimada)}
                </span>
                <span className="text-3xl font-bold text-gray-600 mt-1">%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-400 mt-2 uppercase tracking-widest">Puntaje Total</p>
          </div>

          <div className="px-6 py-4 border-t border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Hallazgos</h3>
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${puntosRestados > 0 && tieneDatos ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                {puntosRestadosTexto}
              </span>
            </div>

            <div className={`mb-6 p-4 rounded-xl border ${msg.bg} ${msg.b}`}>
              <p className={`font-bold text-sm mb-1 ${msg.c}`}>{msg.t}</p>
              <p className="text-xs text-gray-700 leading-relaxed">{msg.d}</p>
            </div>

            {hallazgosReal.length > 0 && (
              <>
                <div className="mb-4 text-sm font-medium text-gray-700">
                  Se identificaron <span className="font-bold text-red-600">{hallazgosReal.length}</span> 
                  {hallazgosReal.length === 1 ? ' desviación' : ' desviaciones'} crítica(s)
                </div>
                <div className="space-y-4 mb-8">
                  {hallazgosReal.map((hallazgo, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col gap-4">
                      <div className="flex gap-4">
                        {hallazgo.imagen && (
                          <div className="w-24 h-24 shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                            <img alt="Evidencia del hallazgo" className="w-full h-full object-cover" src={hallazgo.imagen} />
                          </div>
                        )}
                        <div className="flex flex-col flex-1 py-1">
                          <div className="flex justify-between items-start">
                            <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-wider mb-2">
                              {hallazgo.categoria || "S/C"}
                            </span>
                            <span className="font-bold text-red-600 text-sm">-{hallazgo.puntos || 1}</span>
                          </div>
                          <h4 className="font-bold text-gray-900 leading-tight mb-1">{hallazgo.titulo}</h4>
                          <p className="text-sm text-gray-600 leading-snug line-clamp-2">{hallazgo.descripcion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="pb-16 border-t border-gray-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pt-6 tracking-tight">Resultados por Etapa</h3>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              {etapas.map((etapa, index) => {
                const info = detallesReal[etapa.id] || {};
                const scoreRaw = info.score;
                const score = scoreRaw != null ? Math.round(Number(scoreRaw)) : null;
                const textoPuntaje = score != null ? `${score}/5` : 'N/D';
                const perc = score != null ? (score / 5) * 100 : 0;
                const barColor = score == null ? 'bg-gray-200' : score >= 4 ? 'bg-[#2bee79]' : score === 3 ? 'bg-yellow-500' : 'bg-red-500';
                return (
                  <div key={etapa.id} className={`flex items-center justify-between p-4 border-b border-gray-100 ${index === etapas.length - 1 ? 'border-none pb-6' : ''}`}>
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${etapa.c} flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-[20px]">{etapa.i}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{etapa.n}</p>
                        <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${perc}%` }} />
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{textoPuntaje}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        <footer className="absolute bottom-0 left-0 w-full z-20">
          <div className="h-24 bg-white border-t-4 border-gray-100 shadow-2xl" />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-12 z-30">
            <button
              onClick={abrirModalExportar}
              className="w-14 h-14 bg-[#2bee79] text-white rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-3xl active:scale-95 transition-all border-4 border-white"
              title="Exportar Datos"
            >
              <span className="material-symbols-outlined text-lg">download</span>
            </button>
            <button
              onClick={() => navigate('/historial')}
              className="w-14 h-14 bg-white text-[#2bee79] rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-3xl active:scale-95 transition-all border-4 border-[#2bee79]"
              title="Ir a Historial"
            >
              <span className="material-symbols-outlined text-lg">history_toggle_off</span>
            </button>
            <button
              onClick={finalizarProceso}
              className="w-14 h-14 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-3xl active:scale-95 transition-all border-4 border-white"
              title="Finalizar"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </footer>

        {mostrarModalExportar && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto bg-[#e6f9ef] rounded-3xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-[#2bee79]">download</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Exportar Datos</h3>
                <p className="text-gray-600">Selecciona el formato:</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <button
                  onClick={exportarPDF}
                  className="w-full h-14 border-2 border-[#2bee79] text-[#2bee79] rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#2bee79] hover:text-white transition-all shadow-md"
                >
                  <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                  PDF
                </button>
                <button
                  onClick={exportarExcelConHistorial}
                  className="w-full h-14 bg-[#2bee79] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
                >
                  <span className="material-symbols-outlined text-xl">table_chart</span>
                  Excel (3 hojas)
                </button>
              </div>
              
              <button
                onClick={() => setMostrarModalExportar(false)}
                className="w-full h-12 text-gray-500 hover:text-gray-700 font-semibold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resultados;
