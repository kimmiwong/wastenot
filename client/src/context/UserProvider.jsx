import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const apiHost = import.meta.env.VITE_API_HOST;

const UserContext = createContext({ user: null, refreshUser: async () => {} });
export function UserProvider({ children }) {
  // user holds the current user's info, or null if not logged in.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the current user from the backend and updates state.
   * useCallback memoizes the function so it keeps the same reference between renders
   * unless its dependencies change. This prevents unnecessary re-renders and ensures
   * useEffect only runs when refreshUser actually changes.
   */
  const refreshUser = useCallback(async () => {
    // Call the backend to get current user info. 'credentials: "include"' sends cookies for session auth.
    const res = await fetch(`${apiHost}/api/me`, {
      credentials: "include",
    });
    if (res.ok) {
      setUser(await res.json());
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  // On mount, fetch the current user to initialize auth state.
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
