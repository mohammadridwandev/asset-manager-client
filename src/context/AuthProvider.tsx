import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface AuthType {
  user: any;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  login: (userData: any, token: string) => void;
  logout: () => void;

  updateAuthUser: (updatedUser: any) => void;
}

const authContext = createContext<AuthType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storeUser = localStorage.getItem("user");

    if (storeUser && storeUser !== "undefined") {
      try {
        setUser(JSON.parse(storeUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // login function here
  const login = (userData: any, token: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setLoading(false);
  };

  // logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateAuthUser = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const ContextData = {
    loading,
    setLoading,
    user,
    setUser,
    login,
    logout,
    updateAuthUser, // UPDATED
  };

  return (
    <authContext.Provider value={ContextData}>{children}</authContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
