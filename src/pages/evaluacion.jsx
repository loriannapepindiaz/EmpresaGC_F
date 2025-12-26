import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Evaluacion = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ID creado en pantalla2 (o fallback a id)
  const id = location.state?.id_auditoria || location.state?.id;
  const areaSeleccionada = location.state?.area || 'Área no especificada';
  const fechaSeleccionada = location.state?.fecha || '';
  const auditor = location.state?.auditor || '';

  const [data, setData] = useState({
    1: { score: null, comment: '' },
    2: { score: null, comment: '' },
    3: { score: null, comment: '' },
    4: { score: null, comment: '' },
    5: { score: null, comment: '' },
  });

  const secciones = [
    {
      id: 1,
      titulo: '1. Clasificar',
      desc: '¿Se han separado los elementos innecesarios de los necesarios?',
      icon: 'inventory_2',
    },
    {
      id: 2,
      titulo: '2. Orden',
      desc: '¿Tienen los elementos un lugar designado y están etiquetados?',
      icon: 'grid_view',
    },
    {
      id: 3,
      titulo: '3. Limpieza',
      desc: '¿Están limpias las áreas de trabajo, pisos y equipos?',
      icon: 'cleaning_services',
    },
    {
      id: 4,
      titulo: '4. Estandarizar',
      desc: '¿Existen estándares claros y visibles para mantener las 3S?',
      icon: 'fact_check',
    },
    {
      id: 5,
      titulo: '5. Disciplina',
      desc: '¿Se siguen las normas de manera constante?',
      icon: 'verified',
    },
  ];

  const getColorByScore = (score) => {
    if (score === null)
      return 'bg-gray-100 text-gray-400 border-gray-100';
    if (score <= 1) return 'bg-[#D32F2F] text-white border-[#D32F2F]';
    if (score === 2) return 'bg-[#FFA000] text-white border-[#FFA000]';
    if (score <= 4) return 'bg-[#7CB342] text-white border-[#7CB342]';
    return 'bg-[#25d466] text-white border-[#25d466]';
  };

  const handleScore = (idSec, val) => {
    setData({ ...data, [idSec]: { ...data[idSec], score: val } });
  };

  const handleComment = (idSec, val) => {
    setData({ ...data, [idSec]: { ...data[idSec], comment: val } });
  };

  const isComplete = Object.values(data).every(
    (item) => item.score !== null
  );

  const totalPuntos = Object.values(data).reduce(
    (acc, curr) => acc + (curr.score || 0),
    0
  );
  const porcentajeFinal = Math.round((totalPuntos / 25) * 100);

  const finalizarAuditoria = async () => {
    if (!id) {
      alert('Error: No se encontró el ID de la auditoría.');
      return;
    }

    try {
      // Guardar detalles + actualizar maestro en BD
      await axios.post(
        'http://localhost:3000/api/evaluacion/guardar',
        {
          id_auditoria: id,
          detalles: data,
          porcentaje_final: porcentajeFinal,
        }
      );

      // Pasar a Resultados con toda la info necesaria
      navigate('/resultados', {
        state: {
          ...location.state,
          id,
          porcentaje: porcentajeFinal,
          detalles: data,
          hallazgos: [], // aquí luego puedes pasar hallazgos reales
        },
      });
    } catch (err) {
      console.error('Error al guardar evaluación:', err);
      alert(
        'No se pudo guardar la evaluación en la base de datos.'
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f8f7] flex items-center justify-center p-4 font-sans">
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <div className="relative w-full max-w-[420px] h-[90vh] flex flex-col bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-gray-100">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-gray-700">
              arrow_back
            </span>
          </button>
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">
            Evaluación 5S
          </h2>
          <div className="w-10" />
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto px-6 py-4 space-y-8 bg-[#fcfdfc] custom-scrollbar no-scrollbar">
          <div className="mb-2">
            <p className="text-[10px] font-bold text-[#25d466] uppercase tracking-widest">
              {areaSeleccionada}
            </p>
            <p className="text-xs text-gray-500 font-medium tracking-tight">
              Complete los 5 pasos de la metodología:
            </p>
          </div>

          {secciones.map((s) => (
            <article key={s.id} className="transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-300 ${getColorByScore(
                    data[s.id].score
                  )}`}
                >
                  {s.id}
                </div>
                <h3
                  className={`text-lg font-black transition-colors ${
                    data[s.id].score !== null
                      ? 'text-gray-800'
                      : 'text-gray-300'
                  }`}
                >
                  {s.titulo}
                </h3>
              </div>

              <p className="text-gray-400 text-[13px] leading-snug mb-4">
                {s.desc}
              </p>

              {/* Botones de puntaje 0–5 */}
              <div className="flex justify-between gap-1 mb-4">
                {[0, 1, 2, 3, 4, 5].map((num) => {
                  const isActive = data[s.id].score === num;
                  const activeColor =
                    num <= 1
                      ? 'bg-[#D32F2F] border-[#D32F2F]'
                      : num === 2
                      ? 'bg-[#FFA000] border-[#FFA000]'
                      : num <= 4
                      ? 'bg-[#7CB342] border-[#7CB342]'
                      : 'bg-[#25d466] border-[#25d466]';

                  return (
                    <button
                      key={num}
                      onClick={() => handleScore(s.id, num)}
                      className={`w-11 h-11 rounded-xl font-bold text-sm transition-all border-2 
                        ${
                          isActive
                            ? `${activeColor} text-white shadow-lg scale-110`
                            : 'bg-white border-gray-100 text-gray-300 hover:border-gray-200'
                        }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              {/* Comentario */}
              <textarea
                onChange={(e) =>
                  handleComment(s.id, e.target.value)
                }
                value={data[s.id].comment}
                className="w-full rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#25d466]/10 p-3 text-xs text-gray-600 italic transition-all shadow-inner outline-none"
                placeholder="Añadir nota de hallazgo..."
                rows="2"
              />
            </article>
          ))}

          <div className="h-6" />
        </main>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-gray-100">
          <button
            onClick={finalizarAuditoria}
            disabled={!isComplete}
            className={`w-full h-14 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg
              ${
                isComplete
                  ? 'bg-[#25d466] text-white shadow-[#25d466]/20'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              }`}
          >
            <span>Finalizar Auditoría</span>
            <span className="material-symbols-outlined text-[22px]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Evaluacion;
