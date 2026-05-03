import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import type { UserType } from "./type";
import { serverApi } from "./api";

type UserContextType = {
  users: UserType | null;
  setUsers: Dispatch<SetStateAction<UserType | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await serverApi.get("/api/me");
        setUsers(response.data);
      } catch (error) {
        console.log("Error at UserProvider:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
}
