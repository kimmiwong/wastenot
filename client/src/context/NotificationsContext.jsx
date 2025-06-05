import { createContext, useState, useEffect, useContext } from "react";

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const apiHost = import.meta.env.VITE_API_HOST;

  const fetchNotifications = async () => {
    try {

      const res = await fetch(`${apiHost}/api/notifications`);
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }

      const json = await res.json();
      setNotifications(json);

    } catch (error) {
      console.error("Error occurred while loading recipes.", error);
    }

  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, fetchNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
