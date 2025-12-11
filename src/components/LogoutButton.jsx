export default function LogoutButton() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-2 rounded">
            Cerrar sesión
        </button>
    );
}
