import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const apiHost = import.meta.env.VITE_API_HOST;

const UserContext = createContext({
  user: null,
  refreshUser: async () => {},
  clearUser: () => {},
});
export function UserProvider({ children, shouldFetch = true }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${apiHost}/api/me`, {
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          if (import.meta.env.DEV) {
            console.warn("Not logged in:", res.status);
          }
          setUser(null);
          return;
        }

        if (import.meta.env.DEV) {
          console.warn("Unexpected error fetching user:", res.status);
        }
        setUser(null);
        return;
      }
      const json = await res.json();
      setUser(json);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Network or parsing error in refreshUser:", err);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearUser = () => {
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    if (shouldFetch) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, [refreshUser, shouldFetch]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
