import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import TorneoPublico from "./pages/TorneoPublico";
import ProgramacionZona from "./pages/ProgramacionZona.jsx";
import ProgramacionFechaWrapper from "./pages/ProgramacionFechaWrapper";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Página pública */}
                <Route path="/" element={<Home />} />
                <Route path="/torneos/:torneoId" element={<TorneoPublico />} />

                {/* Panel admin */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Programación de fecha (ADMIN) */}
                <Route
                    path="/dashboard/programacion/zona/:zonaId"
                    element={<ProgramacionFechaWrapper />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
