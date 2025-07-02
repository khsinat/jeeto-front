import { createContext, useEffect, useState } from "react";
import { account, databases } from "../appwrite";
import { ID, Query } from "appwrite";
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
    onBoarded: string,
    setOnBoarded: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthContext = createContext<AuthType | undefined>(undefined);

const AuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [data, setData] = useState<UserData | null>(null); // Properly typed as UserData | null
    const [userId, setUserId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [onBoarded, setOnBoarded] = useState<string>("0");
    const [email, setemail] = useState<string>("")
    console.log("user", user)
    console.log("userId", userId)
    console.log("onboarded", onBoarded)
    const navigate = useNavigate();
    useEffect(() => {
        const authState = async () => {
            try {
                const res = await account.get();
                setUser(res);
                console.log("Auth State", res);
                setUserId(res.$id);
                try {
                    const userData = await databases.listDocuments(
                        '685d619e00286d9805b7',
                        'users',
                        [Query.equal('userId', res.$id)]
                    )
                    console.log("onboarded on this step right now !!!!!!!", userData.documents[0].onBoardstep);
                    setOnBoarded(userData.documents[0].onBoardstep);
                } catch (error) {
                    console.error("error fetching the data", error)
                }
                // Check if user data exists in the database
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
            setemail(email)
            console.log("email", email)
            const res = await account.createEmailToken(ID.unique(), email);
            console.log("Email Token Response:", res);
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
            try {
                const userData = await databases.listDocuments('685d619e00286d9805b7', 'users',
                    [Query.equal('userId', userId)]
                )
                if (userData.total === 0) {
                    // If user data does not exist, create it
                    try {
                        await databases.createDocument('685d619e00286d9805b7', 'users', ID.unique(), {
                            userId: res.$id,
                            email: email,
                            joinedAt: new Date().toISOString(),
                            userName: "tanishk",
                            onBoardstep: "1", // Initial onboarding step
                        })
                        setOnBoarded("1");
                        console.log("User created successfully");
                        navigate("/onboarding/step1");
                    } catch (error) {
                        console.error("error creating user first time ", error)
                    }
                } else {
                    try {
                        console.log("user data exists", userData.documents[0])
                        const doc = await databases.listDocuments('685d619e00286d9805b7', 'users',
                            [Query.equal('userId', res.$id)]
                        )
                        if (doc.documents[0].onBoardstep == "1") {
                            console.log("onBoarding step 1")
                            navigate("/onboarding/step1");
                        } else if (doc.documents[0].onBoardstep == "0") {
                            navigate('/login')
                        } else {
                            navigate('/notifications')
                        }
                    } catch (error) {
                        console.error("error in the shit", error)
                    }
                }
            } catch (error) {
                console.error("verify email error", error)
            }
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
        <AuthContext.Provider value={{ user, register, login, logout, data, verifyEmailToken, userId, loading, onBoarded, setOnBoarded }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;