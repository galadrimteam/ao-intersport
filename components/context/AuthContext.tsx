import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserContextType {
  isConnected: boolean;
  token: string | null;
  setIsConnected: (isConnected: boolean) => void;
  login: (token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    console.log(
      "_________________________________________________________________________________________________________"
    );
    const fetchToken = async () => {
      const savedToken = await AsyncStorage.getItem("userToken");
      if (savedToken) {
        setToken(savedToken);
        setIsConnected(true);
      }
    };
    fetchToken();
  }, []);

  const login = async (newToken: string) => {
    setToken(newToken);
    setIsConnected(true);
    await AsyncStorage.setItem("userToken", newToken);
  };

  const logout = async () => {
    setToken(null);
    setIsConnected(false);
    await AsyncStorage.removeItem("userToken");
  };

  return (
    <UserContext.Provider
      value={{ isConnected, token, login, logout, setIsConnected }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
