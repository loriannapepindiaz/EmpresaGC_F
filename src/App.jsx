import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/welcome';
import ComienzoAuditoria from './pages/comienzo_auditoria';
import CapturaFoto from './pages/captura_foto';
import Evaluacion from './pages/evaluacion';
import Resultados from './pages/resultados';
import Historial from './pages/Historial'; // ← IMPORTA TU COMPONENTE AQUÍ

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/auditoria" element={<ComienzoAuditoria />} />
      <Route path="/captura-foto" element={<CapturaFoto />} />
      <Route path="/evaluacion" element={<Evaluacion />} />
      <Route path="/resultados" element={<Resultados />} />
      <Route path="/historial" element={<Historial />} /> {/* ← AGREGA ESTA LÍNEA */}
    </Routes>
  );
}

export default App;