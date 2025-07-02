import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const ProtectedRoutes = () => {
    const { user, loading, onBoarded } = useAuth();
    console.log("ProtectedRoutes user", user);
    if (loading) return null
    return onBoarded == "0" ? <Navigate to="/login" /> : onBoarded == "1" ? <Navigate to="/onboarding/step1" /> : <Outlet />
}

export default ProtectedRoutes;