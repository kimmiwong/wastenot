import { useState, useEffect } from "react";
import { useNotifications } from "../context/NotificationsContext";

export default function EditItem({ fetchItems, id, closeModal }) {
  const [name, setName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [category, setCategory] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchNotifications } = useNotifications();

  const apiHost = import.meta.env.VITE_API_HOST;

  useEffect(() => {
    const pullDetails = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(`${apiHost}/api/food-items/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        setName(json.name);
        setExpirationDate(json.expiration_date);
        setCategory(json.category_id);
      } catch (error) {
        setError(error);
        console.error("Error fetching food item details", error);
      } finally {
        setIsLoading(false);
      }
    };
    pullDetails();
  }, [id]);

  if (error) {
    return <p>Error getting food item details</p>;
  }

  if (isLoading) {
    return <p>Loading data...</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiHost}/api/food-items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name,
          expiration_date: expirationDate,
          category_id: category,
        }),
      });

      if (!response.ok) throw new Error("Failed to edit food item");

      await fetchNotifications();
      closeModal();
      fetchItems();
    } catch (error) {
      console.error("Error editing food item", error);
    }
  };

  return (
    <div className="edit-item-container">
      <h2>Edit food item</h2>
      <form className="edit-item-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Food Name:</label>
          <input
            type="text"
            id="name"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>

        <div>
          <label htmlFor="expiration-date">Expiration Date:</label>
          <input
            type="date"
            id="expiration-date"
            defaultValue={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          ></input>
        </div>

        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            defaultValue={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="1">Pantry</option>
            <option value="2">Fridge/Freezer</option>
          </select>
        </div>
        <button type="submit">Done</button>
      </form>
    </div>
  );
}
