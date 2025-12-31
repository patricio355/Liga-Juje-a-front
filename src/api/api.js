export async function apiFetch(url, options = {}) {

    const token = localStorage.getItem("token");

    const res = await fetch(
        import.meta.env.VITE_API_URL + url,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        }
    );

    // Manejo de errores
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error en la API");
    }

    // 204 No Content
    if (res.status === 204) {
        return null;
    }

    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        return res.json();
    }

    return null;
}
