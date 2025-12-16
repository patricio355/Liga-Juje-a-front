export async function apiFetch(url, options = {}) {

    const res = await fetch(
        import.meta.env.VITE_API_URL + url,
        {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        }
    );

    // Manejo de errores
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error en la API");
    }

    // 👇 CLAVE: si es 204, no hay JSON
    if (res.status === 204) {
        return null;
    }

    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        return res.json();
    }

    // Si no hay JSON, devolvemos null
    return null;
}
