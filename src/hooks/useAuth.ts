import { useContext } from "react";
import { AuthContext } from "../lib/context/authcontext";

const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("useAuth must be used within a AuthProvider");
    }

    const { user, register, login, logout, userId, verifyEmailToken, loading, onBoarded, setOnBoarded } = authContext;

    return { user, register, login, logout, userId, verifyEmailToken, loading, onBoarded, setOnBoarded };
};

export default useAuth;