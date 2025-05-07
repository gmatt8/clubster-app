// context/UserContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
  } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  type Role = 'manager' | 'code-user' | null;
  
  type UserContextType = {
    clubId: string | null;
    codeId: string | null;
    role: Role;
    loginWithCode: (clubId: string, codeId: string) => void;
    logout: () => Promise<void>;
    setRole: (role: Role) => void;
  };
  
  const defaultContext: UserContextType = {
    clubId: null,
    codeId: null,
    role: null,
    loginWithCode: () => {},
    logout: async () => {},
    setRole: () => {},
  };
  
  const UserContext = createContext<UserContextType>(defaultContext);
  
  export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [clubId, setClubId] = useState<string | null>(null);
    const [codeId, setCodeId] = useState<string | null>(null);
    const [role, setRole] = useState<Role>(null);
  
    const loginWithCode = (club: string, code: string) => {
      setClubId(club);
      setCodeId(code);
      setRole('code-user');
    };
  
    const logout = async () => {
      setClubId(null);
      setCodeId(null);
      setRole(null);
      await AsyncStorage.removeItem('code_session');
    };
  
    return (
      <UserContext.Provider
        value={{
          clubId,
          codeId,
          role,
          loginWithCode,
          logout,
          setRole,
        }}
      >
        {children}
      </UserContext.Provider>
    );
  };
  
  export const useUser = () => useContext(UserContext);
  