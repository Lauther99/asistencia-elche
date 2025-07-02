import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from "./pages/Inicio";  // Componente de inicio
import Verificacion from "./pages/verificacion/Verificacion";  // Componente de verificación
import Asistencia from "./pages/asistencia/Asistencia";  // Componente de verificación
// import VerificacionFace from "./pages/verificacion/VerificacionFace";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from './components/AuthProvider';
import Admin from "./pages/admin/Admin";
// import Registro from "./pages/registro/Registro";  // Componente de registro


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          <Route
            path="/"
            element={
              <PublicRoute>
                <Inicio />
              </PublicRoute>
            }
          />

          {/* <Route
            path="/registro"
            element={
              <PublicRoute>
                <Registro />
              </PublicRoute>
            }
          /> */}

          <Route
            path="/verificacion/:id"
            element={
              <PublicRoute>
                <Verificacion />
              </PublicRoute>
            }
          />

          {/* <Route
            path="/verificacion/f"
            element={
              <PublicRoute>
                <VerificacionFace />
              </PublicRoute>
            }
          /> */}

          <Route
            path="/asistencia"
            element={
              <ProtectedRoute>
                <Asistencia />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
