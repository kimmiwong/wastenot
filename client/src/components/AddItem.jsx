import { useState } from "react";
import ShelfLifeModal from "./ShelflifeModal";
import ShelfLife from "../assets/shelf.png";

export default function AddItem() {
  const [name, setName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [category, setCategory] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const apiHost = import.meta.env.VITE_API_HOST;

      const response = await fetch(`${apiHost}/api/food-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name,
          expiration_date: expirationDate,
          category_id: category,
        }),
      });

      if (!response.ok) throw new Error("Failed to add food item");
    } catch (error) {
      console.error("Error adding food item", error);
    }
  };

  return (
    <div className="top-section">
      <div className="form-overlay">
        <h2>Add new food item</h2>
        <form className="add-item-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Food Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiration-date">Expiration Date:</label>
            <input
              type="date"
              id="expiration-date"
              value={expirationDate}
              onChange={(e) => {
                const rawDate = e.target.value;
                const isoDate = new Date(rawDate).toISOString().split("T")[0];
                setExpirationDate(isoDate);
              }}
            ></input>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="1">Pantry</option>
              <option value="2">Fridge/Freezer</option>
            </select>
          </div>

          <button type="submit">Add Food Item</button>
          <div className="no-exp-button">
            <button type="button" onClick={openModal}>
              No expiration date?
            </button>
            <ShelfLifeModal isOpen={isModalOpen} closeModal={closeModal}>
              <img
                src={ShelfLife}
                alt="ShelfLifeLogo"
                className="Shelf-Life"
              ></img>
            </ShelfLifeModal>
          </div>
        </form>
      </div>
    </div>
  );
}
