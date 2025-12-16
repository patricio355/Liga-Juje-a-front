import { apiFetch } from "./api";

export const getEquiposActivos = () =>
    apiFetch("/api/equipos");

export const getTodosEquipos = () =>
    apiFetch("/api/equipos/todos");

export const editarEquipo = (id, data) =>
    apiFetch(`/api/equipos/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });

export const eliminarEquipo = (id) =>
    apiFetch(`/api/equipos/${id}`, { method: "DELETE" });

export const crearEquipo = (data) =>
    apiFetch("/api/equipos", {
        method: "POST",
        body: JSON.stringify(data)
    });