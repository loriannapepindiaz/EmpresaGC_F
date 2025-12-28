import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Historial = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [expandedCard, setExpandedCard] = useState(null);
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroYear, setFiltroYear] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroDia, setFiltroDia] = useState('');
  const [añosDisponibles, setAñosDisponibles] = useState([]);

  useEffect(() => {
    const cargarAuditorias = async () => {
 try {
        setLoading(true);
        // ✅ Fragmento corregido usando la variable dinámica
        const res = await fetch(`${API_URL}/api/auditorias-5s`);
        const data = await res.json();

    const formateadas = data.map((row) => {
      const scoreNum = Number(row.porcentaje_final || 0);
      const puntosRestados = Number(row.puntos_restados || 0);

      // Creamos el mapa de detalles
      const detallesMap = {};
      
      // ✅ IMPORTANTE: Usar el nombre exacto que envía el Backend (detalles_5s)
      const listaDetalles = row.detalles_5s || row.detalle_5s || row.detalle_evaluacion_5s;

      if (Array.isArray(listaDetalles)) {
        listaDetalles.forEach(det => {
          detallesMap[det.seccion_id] = {
            score: det.puntuacion,
            comment: det.comentario
          };
        });
      }

      return {
        id: row.id_auditoria,
        area: row.area?.nombre_galera || `Área ${row.id_area}`,
        representante: row.nombre_representante || 'Sin representante',
        auditor: row.auditor?.nombre_completo || `Auditor ${row.id_auditor}`,
        fecha: new Date(row.fecha_inspeccion).toLocaleDateString('es-ES', { 
          day: 'numeric', month: 'short', year: 'numeric' 
        }),
        fechaCompleta: row.fecha_inspeccion,
        dia: new Date(row.fecha_inspeccion).getDate(),
        mes: new Date(row.fecha_inspeccion).getMonth() + 1,
        year: new Date(row.fecha_inspeccion).getFullYear(),
        scoreNum,
        score: `${Math.round(scoreNum)}%`,
        fotoArea: row.foto_evidencia_general || null,
        puntosRestadosTexto: puntosRestados > 0 ? `-${puntosRestados} ptos` : '0 ptos',
        detalles: detallesMap // Este objeto ahora sí tendrá datos
      };
    }).sort((a, b) => new Date(b.fechaCompleta).getTime() - new Date(a.fechaCompleta).getTime());

    setAuditorias(formateadas);

        // Años disponibles
        const añoActual = new Date().getFullYear();
        const añosConDatos = [...new Set(formateadas.map(a => a.year))].sort((a, b) => b - a);
        const añosUnicos = [...new Set([añoActual, ...añosConDatos])].sort((a, b) => b - a);
        setAñosDisponibles(añosUnicos);
      } catch (err) {
        console.error('Error cargando historial:', err);
        setAñosDisponibles([new Date().getFullYear()]);
      } finally {
        setLoading(false);
      }
    };

    cargarAuditorias();
  }, []);

  const auditoriasFiltradas = auditorias.filter((auditoria) => {
    const matchesArea = auditoria.area.toLowerCase().includes(filtroArea.toLowerCase());
    const matchesYear = !filtroYear || auditoria.year.toString() === filtroYear;
    const matchesMes = !filtroMes || auditoria.mes.toString() === filtroMes;
    const matchesDia = !filtroDia || auditoria.dia.toString() === filtroDia;
    return matchesArea && matchesYear && matchesMes && matchesDia;
  });

  const agrupadasPorArea = auditoriasFiltradas.reduce((acc, audit) => {
    const key = audit.id_area;
    if (!acc[key]) {
      acc[key] = {
        id_area: audit.id_area,
        nombre: audit.area,
        auditorias: [],
      };
    }
    acc[key].auditorias.push(audit);
    return acc;
  }, {});

  const stats = {
    total: auditorias.length,
    promedio: auditorias.reduce((sum, a) => sum + (a.scoreNum || 0), 0) / (auditorias.length || 1),
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#f6f8f7] flex items-center justify-center p-4 font-sans">
        <div className="relative w-full max-w-[420px] h-[90vh] flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl">
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 border-4 border-[#2bee79]/30 border-t-[#2bee79] rounded-full animate-spin" />
            <p className="text-gray-700 font-semibold">Cargando historial...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f6f8f7] flex items-center justify-center p-4 font-sans">
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0&display=swap"
        rel="stylesheet"
      />

      <div className="relative w-full max-w-[420px] h-[90vh] flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl sm:shadow-2xl md:shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-all flex items-center justify-center"
            title="Volver"
          >
            <span className="material-symbols-outlined text-xl text-gray-700">arrow_back</span>
          </button>
          <h1 className="text-base font-bold text-gray-900 tracking-tight">Historial 5S</h1>
          <div className="w-8" />
        </header>

        <main className="flex-1 overflow-y-auto px-6 pt-4 pb-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-emerald-100">
              <p className="text-[11px] text-gray-600 uppercase tracking-[0.18em] mb-1 font-semibold">
                Promedio General
              </p>
              <p className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-[#2bee79] bg-clip-text text-transparent">
                {stats.promedio.toFixed(1)}%
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-emerald-100">
              <p className="text-[11px] text-gray-600 uppercase tracking-[0.18em] mb-1 font-semibold">
                Total Auditorías
              </p>
              <p className="text-3xl font-black text-gray-900">{stats.total}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-[0.18em] mb-1 block">
                  Área
                </label>
                <input
                  value={filtroArea}
                  onChange={(e) => setFiltroArea(e.target.value)}
                  placeholder="Buscar área..."
                  className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm focus:border-[#25d466] focus:ring-2 focus:ring-[#25d466]/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-[0.18em] mb-1 block">
                  Año
                </label>
                <select
                  value={filtroYear}
                  onChange={(e) => setFiltroYear(e.target.value)}
                  className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm focus:border-[#25d466] focus:ring-2 focus:ring-[#25d466]/20 outline-none transition-all"
                >
                  <option value="">Todos</option>
                  {añosDisponibles.map((año) => (
                    <option key={año} value={año.toString()}>
                      {año}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-[0.18em] mb-1 block">
                  Mes
                </label>
                <select
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
                  className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm focus:border-[#25d466] focus:ring-2 focus:ring-[#25d466]/20 outline-none transition-all"
                >
                  <option value="">Todos</option>
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-[0.18em] mb-1 block">
                  Día
                </label>
                <select
                  value={filtroDia}
                  onChange={(e) => setFiltroDia(e.target.value)}
                  className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm focus:border-[#25d466] focus:ring-2 focus:ring-[#25d466]/20 outline-none transition-all"
                >
                  <option value="">Todos</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => (
                    <option key={dia} value={dia.toString()}>
                      {dia}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Áreas + auditorías */}
          <div className="space-y-5">
            {Object.keys(agrupadasPorArea).length === 0 ? (
              <div className="text-center py-16 text-gray-500 bg-[#f8faf9] rounded-2xl border border-dashed border-gray-300">
                <span className="material-symbols-outlined text-5xl text-gray-300 mb-2 block" style={{ fontVariationSettings: '"FILL" 0, "wght" 300, "GRAD" 0, "opsz" 48' }}>
                  search_off
                </span>
                <p className="font-semibold text-sm">No hay resultados para esos filtros.</p>
              </div>
            ) : (
              Object.values(agrupadasPorArea).map((grupo) => (
                <section key={grupo.id_area} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#e6f9ef] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#25d466] text-lg" style={{ fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24' }}>
                          warehouse
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{grupo.nombre}</p>
                        <p className="text-[11px] text-gray-500">
                          {grupo.auditorias.length} auditoría{grupo.auditorias.length !== 1 && 's'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {grupo.auditorias.map((audit) => (
                      <div
                        key={audit.id}
                        className="group bg-white/95 rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg"
                      >
                        <div className="h-48 relative overflow-hidden bg-gray-100">
                          <img
                            src={audit.fotoArea || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=500'}
                            alt={audit.area}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=500';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-[#2bee79] to-emerald-500 px-3 py-1.5 rounded-full text-white text-sm font-bold shadow-lg">
                            {audit.score}
                          </div>
                          <div className="absolute bottom-3 left-3 text-white">
                            <p className="text-xs font-semibold">{audit.fecha}</p>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-[11px] text-gray-500">Representante</p>
                              <p className="text-sm font-semibold text-gray-900">{audit.representante}</p>
                              <p className="text-[11px] text-gray-500 mt-1">Auditor: {audit.auditor}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-[11px] text-gray-500">Puntos restados</span>
                              <span className="text-sm font-bold text-red-500">{audit.puntosRestadosTexto}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => setExpandedCard(expandedCard === audit.id ? null : audit.id)}
                            className="w-full mt-2 flex items-center justify-between px-3 py-2 rounded-xl bg-[#f8faf9] hover:bg-[#f0f5f2] transition-all border border-gray-200"
                          >
                            <span className="text-xs font-semibold text-gray-700">Ver calificación por cada 5S</span>
                            <span 
                              className="material-symbols-outlined text-gray-500 text-xl" 
                              style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20' }}
                            >
                              {expandedCard === audit.id ? 'expand_less' : 'expand_more'}
                            </span>
                          </button>

                          {expandedCard === audit.id && (
                            <div className="mt-3 space-y-2">
                              {[
                                { id: 1, nombre: 'Clasificar (Seiri)' },
                                { id: 2, nombre: 'Ordenar (Seiton)' },
                                { id: 3, nombre: 'Limpiar (Seiso)' },
                                { id: 4, nombre: 'Estandarizar (Seiketsu)' },
                                { id: 5, nombre: 'Disciplina (Shitsuke)' },
                              ].map((etapa) => {
                                const detalle = audit.detalles?.[etapa.id];
                                const puntaje = detalle?.score != null ? Math.round(Number(detalle.score)) : null;
                                const texto = puntaje != null ? `${puntaje}/5` : 'N/D';

                                return (
                                  <div key={etapa.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#f6f8f7]">
                                    <span className="text-xs font-medium text-gray-700">{etapa.nombre}</span>
                                    <span className="text-sm font-bold text-emerald-600">
                                      {texto}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Historial;