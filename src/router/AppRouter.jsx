import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import TorneoPublico from "../pages/TorneoPublico";
import ProtectedRoute from "./ProtectedRoute";
import ProgramacionFechaWrapper from "../pages/ProgramacionFechaWrapper";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* HOME público */}
                <Route path="/" element={<Home />} />

                {/* TORNEO PÚBLICO */}
                <Route path="/torneo/:id" element={<TorneoPublico />} />

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

                {/* fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
