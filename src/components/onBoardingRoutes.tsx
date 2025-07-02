
import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const OnBoardingRoutes = () => {
    const { user, loading, onBoarded } = useAuth();
    console.log("onboarding", user);
    console.log(onBoarded)
    if (loading) return null
    return onBoarded == '1' ? <Outlet /> : onBoarded == "0" ? <Navigate to="/login" /> : <Navigate to="/notifications" />;
}

export default OnBoardingRoutes;