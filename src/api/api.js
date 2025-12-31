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

    // --- INTERCEPTOR DE SESIÓN ---
    if (res.status === 401 || res.status === 403) {
        // Si el backend no reconoce el token (ej: por reinicio), limpiamos todo
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirigimos al login con un parámetro para mostrar el mensaje de "Sesión expirada"
        if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login?session=expired";
        }

        throw new Error("Sesión expirada o inválida");
    }

    // Manejo de errores genéricos
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