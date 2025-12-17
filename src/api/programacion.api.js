// src/api/programacion.api.js
import { apiFetch } from "./api";

export const getOpcionesProgramacion = (zonaId, fecha) =>
    apiFetch(`/api/programacion/zona/${zonaId}/fecha/${fecha}/opciones`);

export const getProgramacionFecha = (zonaId, fecha) =>
    apiFetch(`/api/programacion/zona/${zonaId}/fecha/${fecha}`);

export const programarPartido = (zonaId, fecha, partidoId) =>
    apiFetch(
        `/api/programacion/zona/${zonaId}/fecha/${fecha}/partido/${partidoId}`,
        { method: "POST" }
    );
