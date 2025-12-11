export function decodeToken(token) {
    if (!token) return null;

    const payload = token.split(".")[1];
    if (!payload) return null;

    try {
        return JSON.parse(atob(payload));
    } catch (e) {
        return null;
    }
}