// src/components/ReporteAuditoriaPDF.jsx
import React from 'react';

const ReporteAuditoriaPDF = ({ idAuditoria = 3, porcentaje = 0, detalles = {}, etapas = [], auditor = "Juan Pérez" }) => {
  const totalChecked = etapas.length;
  const passCount = etapas.filter(e => Math.round(detalles[e.id]?.score ?? 0) >= 4).length;
  const failCount = totalChecked - passCount;

  return (
    <div className="p-8 bg-white font-sans max-w-4xl mx-auto text-charcoal">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-[#2bee79] tracking-tight">Reporte de Auditoría 5S</h1>
          <p className="text-sm text-gray-600 mt-1">Auditoría ID: #{idAuditoria.toString().padStart(3, '0')}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Fecha: {new Date().toLocaleDateString('es-ES')}</p>
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Puntaje Total */}
        <div className="bg-gradient-to-br from-[#2bee79]/10 to-white p-6 rounded-2xl border border-[#2bee79]/30 shadow-sm">
          <p className="text-sm font-semibold uppercase text-[#2bee79] mb-2">Puntaje Total</p>
          <p className="text-5xl font-black text-[#2bee79]">{porcentaje}%</p>
        </div>

        {/* Puntos Revisados */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-semibold uppercase text-gray-600 mb-2">Puntos Revisados</p>
          <p className="text-4xl font-bold">{totalChecked}</p>
          <p className="text-sm text-gray-500 mt-1">{passCount} Pass / {failCount} Fail</p>
        </div>

        {/* Auditor */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm font-semibold uppercase text-gray-600 mb-2">Auditor</p>
          <p className="text-xl font-bold">{auditor}</p>
          <p className="text-sm text-gray-500">Especialista QA</p>
        </div>
      </div>

      {/* Tabla principal */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#2bee79] text-white">
            <tr>
              <th className="px-6 py-4 font-bold uppercase text-sm">Etapa</th>
              <th className="px-6 py-4 font-bold uppercase text-sm w-1/2">Observación Detallada</th>
              <th className="px-6 py-4 font-bold uppercase text-sm">Puntaje</th>
              <th className="px-6 py-4 font-bold uppercase text-sm text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {etapas.map((etapa) => {
              const score = Math.round(detalles[etapa.id]?.score ?? 0);
              const status = score >= 4 ? "Pass" : "Fail";
              const statusColor = score >= 4 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

              return (
                <tr key={etapa.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{etapa.n}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {detalles[etapa.id]?.comment || "Sin observaciones detalladas"}
                  </td>
                  <td className="px-6 py-4 font-bold">{score}/5</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer simple */}
      <div className="mt-12 text-center text-sm text-gray-500">
        Generado por Quality Control Hub • {new Date().toLocaleDateString('es-ES')}
      </div>
    </div>
  );
};

export default ReporteAuditoriaPDF;