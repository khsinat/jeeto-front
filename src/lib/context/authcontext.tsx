import { createContext, useEffect, useState } from "react";
import { account, databases } from "../appwrite";
import { ID } from "appwrite";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface Props {
    children: React.ReactNode;
}

interface User {
    $id: string;
    email: string;
    name: string;
}

interface UserData {
    $id: string;
    name: string;
    email: string;
    role: string;
    gender: string;
    bio?: string;
}

interface AuthType {
    user: User | null;
    data: UserData | null;
    userId: string;
    register: (
        email: string,
    ) => Promise<void>;
    verifyEmailToken: (userId: string, secret: string) => Promise<void>;
    login: (email: string, password: string) => void
    logout: () => Promise<void>;
    loading: boolean,
}

export const AuthContext = createContext<AuthType | undefined>(undefined);

const AuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [data, setData] = useState<UserData | null>(null); // Properly typed as UserData | null
    const [userId, setUserId] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const authState = async () => {
            try {
                const res = await account.get();
                setUser(res);
                console.log("Auth State", res);
                // await getUserData(res.$id);
            } catch (error) {
                console.log("Auth State", error);
            } finally {
                setLoading(false);
            }
        };
        authState();
    }, []);

    const register = async (email: string) => {
        try {
            const res = await account.createEmailToken(ID.unique(), email);
            setUserId(res.userId);
        } catch (err) {
            console.error("Registration failed:", err);
            throw err;
        }
    };
    const verifyEmailToken = async (userId: string, secret: string) => {
        try {
            console.log("inside vefifyemial")
            console.log(userId, secret)
            await account.createSession(userId, secret);
            const res = await account.get();
            setUser(res);
            navigate("/notifications");
            toast("completed the verification")
        } catch (err) {
            console.error("Verification failed:", err);
            toast.error("Invalid OTP. Try again.");
        }
    };

    const login = (email: string, password: string) => {
        toast.promise(
            account.createEmailPasswordSession(email, password),
            {
                loading: "Logging In",
                success: (res) => {
                    console.log(res);
                    return `Welcome, ${user?.name}`
                },
                error: (err) => {
                    console.log(err);
                    return `Login failed: ${err.message}`
                }
            }
        )
    };

    const userData = async (
        id: string,
        name: string,
        email: string,
        role: string,
        gender: string
    ) => {
        try {
            const response = await databases.createDocument("twcdb", "users", id, {
                name,
                email,
                role,
                gender,
            });
            console.log(response);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const getUserData = async (id: string) => {
        try {
            const response = await databases.getDocument("twcdb", "users", id);
            const userData: UserData = {
                $id: response.$id,
                name: response.name,
                email: response.email,
                role: response.role,
                gender: response.gender,
                bio: response.bio,
            };
            setData(userData);
        } catch (error) {
            console.log("User Data", error);
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
            setData(null); // Clear user data on logout
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, data, verifyEmailToken, userId, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;