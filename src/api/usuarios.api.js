// src/api/usuarios.api.js
import { apiFetch } from "./api";

export const getUsuarios = () =>
    apiFetch("/api/usuarios");

export const crearUsuario = (data) =>
    apiFetch("/api/usuarios", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const editarUsuario = (id, data) =>
    apiFetch(`/api/usuarios/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const eliminarUsuario = (id) =>
    apiFetch(`/api/usuarios/${id}`, {
        method: "DELETE",
    });
