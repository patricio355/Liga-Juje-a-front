import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import TorneoPublico from "../pages/TorneoPublico";
import ProtectedRoute from "./ProtectedRoute";
import ProgramacionFechaWrapper from "../pages/ProgramacionFechaWrapper";
import TorneoDetalleAdmin from "../pages/TorneoDetalleAdmin.jsx";
import GestionPartidosFixture from "../pages/GestionPartidosFixture.jsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* HOME público */}
                <Route path="/" element={<Home />} />

                {/* TORNEO PÚBLICO */}
                <Route path="/torneo/:id" element={<TorneoPublico />} />

                <Route path="/dashboard/torneos/:id" element={<TorneoDetalleAdmin />} />

                {/* LOGIN */}
                <Route path="/login" element={<Login />} />

                {/* DASHBOARD */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* PROGRAMACIÓN DE FECHA (ADMIN) */}
                <Route
                    path="/dashboard/programacion/zona/:zonaId"
                    element={
                        <ProtectedRoute>
                            <ProgramacionFechaWrapper />
                        </ProtectedRoute>
                    }
                />

                {/* PROGRAMACIÓN DE fixture (ADMIN) */}
                <Route path="/dashboard/gestion-partidos/:id" element={<GestionPartidosFixture />} />

                {/* fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}