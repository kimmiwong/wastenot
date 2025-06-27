// @ts-check
import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";

const API_BASE = "http://localhost:8000";

/**
 * User context for authentication state and refresh logic.
 * @typedef {{ user: null | { username: string }, refreshUser: () => Promise<void> }} UserContextType
 */

/** @type {import('react').Context<UserContextType>} */
const UserContext = createContext(
    /** @type {UserContextType} */ ({ user: null, refreshUser: async () => {} })
);

/**
 * Provides user authentication state and refresh logic to children.
 * @param {{ children: import('react').ReactNode }} props
 * @returns {import('react').ReactElement}
 */
export function UserProvider({ children }) {
    // user holds the current user's info, or null if not logged in.
    const [user, setUser] = useState(null);

    /**
     * Fetches the current user from the backend and updates state.
     * useCallback memoizes the function so it keeps the same reference between renders
     * unless its dependencies change. This prevents unnecessary re-renders and ensures
     * useEffect only runs when refreshUser actually changes.
     * @returns {Promise<void>}
     */
    const refreshUser = useCallback(async () => {
        // Call the backend to get current user info. 'credentials: "include"' sends cookies for session auth.
        const res = await fetch(`${API_BASE}/api/me`, {
            credentials: "include",
        });
        if (res.ok) {
            setUser(await res.json());
        } else {
            setUser(null);
        }
    }, []);

    // On mount, fetch the current user to initialize auth state.
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    return (
        <UserContext.Provider value={{ user, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
}

/**
 * Custom hook to access user context.
 * @returns {UserContextType}
 */
export function useUser() {
    return useContext(UserContext);
}
