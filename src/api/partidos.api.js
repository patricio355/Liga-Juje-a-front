const BASE_URL = "http://localhost:8080/api/partidos";

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// LISTAR PARTIDOS
export async function getPartidos() {
    const res = await fetch(BASE_URL, {
        headers: authHeaders(),
    });

    if (!res.ok) throw await res.json();
    return res.json();
}

// CERRAR PARTIDO (admin)
export async function cerrarPartido(partidoId, data) {
    const res = await fetch(
        `http://localhost:8080/api/partidos/${partidoId}/cerrar`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    if (!res.ok) throw await res.json();
    return res.json();
}

// SOLICITAR CIERRE
export async function solicitarCierre(partidoId, data) {
    const res = await fetch(`${BASE_URL}/${partidoId}/solicitar-cierre`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });

    if (!res.ok) throw await res.json();
    return res.json();
}
