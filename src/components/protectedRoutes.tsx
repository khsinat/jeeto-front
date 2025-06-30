import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const ProtectedRoutes = () => {
    const { user, loading } = useAuth();
    console.log("ProtectedRoutes user", user);
    if (loading) return null
    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;