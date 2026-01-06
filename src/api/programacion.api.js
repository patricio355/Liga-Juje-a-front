import { apiFetch } from "./api";

/**
 * Obtiene las tarjetas de opciones (Equipos disponibles para enfrentar)
 * Se usa 'no-store' para que si un equipo se ocupa, desaparezca de la lista de inmediato.
 */
export const getOpcionesProgramacion = (zonaId, fecha) =>
    apiFetch(`/api/programacion/zona/${zonaId}/fecha/${fecha}/opciones`, {
        cache: "no-store"
    });

/**
 * Obtiene los partidos ya programados para la jornada (Caja derecha)
 * Es vital el 'no-store' para evitar el error de "Página no cambia" al actualizar.
 */
export const getProgramacionFecha = (zonaId, fecha) =>
    apiFetch(`/api/programacion/zona/${zonaId}/fecha/${fecha}`, {
        cache: "no-store"
    });

/**
 * Ejecuta la programación del partido.
 * Nota: La URL debe coincidir con el @PostMapping de tu Controller en Java.
 */
export const programarPartido = (zonaId, fecha, partidoId) =>
    apiFetch(
        `/api/programacion/zona/${zonaId}/fecha/${fecha}/partido/${partidoId}`,
        { method: "POST" }
    );

export const actualizarDetallesProgramacion = (zonaId, fecha, partidoId, data) => {
    // Verificamos que partidoId exista para evitar URLs malformadas
    if (!partidoId) throw new Error("ID de partido no definido");

    return apiFetch(
        `/api/programacion/zona/${zonaId}/fecha/${fecha}/partido/${partidoId}/detalles`,
        {
            method: "PUT", // Spring Security necesita ver el método PUT explícito
            body: data
        }
    );
};