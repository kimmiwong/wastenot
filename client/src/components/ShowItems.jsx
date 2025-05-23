import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditModal from "./EditModal";
import EditItem from "./EditItem";

export default function ShowItems() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState([]);
  const [sortedButton, setSortedButton] = useState(false);

  function openEdit(itemId) {
    setSelectedItem(itemId);
  }

  function closeEdit() {
    setSelectedItem(null);
  }

  function sortItems(data) {
    console.log("!", data);
    if (sortedButton) {
      data.sort((a, b) => {
        return new Date(a.expiration_date) - new Date(b.expiration_date);
      });
    }
    console.log(sortedButton);
    return data;
  }

  async function deleteItem(id) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/food-items/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete food item");

      const newData = data.filter((item) => item.id !== id);
      setData(newData);
    } catch (error) {
      console.error("Error deleting food item", error);
    }
  }

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:8000/api/food-items");
      const json = await res.json();
      setData(json);
    } catch (error) {
      setError(error);
      console.error("Error fetching items", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return <p>Something went wrong. Please refresh.</p>;
  }

  if (isLoading) {
    return <p>Loading games...</p>;
  }

  return (
    <div className="item-container">
      <div className="pantry-items">
        <h3>Pantry Items</h3>
        <button type="button" onClick={() => setSortedButton(!sortedButton)}>
          Sort by expiration date
        </button>
        <ul>
          {sortItems(data).map((item) =>
            item.category === "pantry" ? (
              <li key={item.id}>
                <input
                  type="checkbox"
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                />
                <div>{item.name}</div>
                <div>{item.expiration_date}</div>
                <button type="button" onClick={() => deleteItem(item.id)}>
                  Delete item
                </button>
                <button type="button" onClick={() => openEdit(item.id)}>
                  Edit item
                </button>
              </li>
            ) : null
          )}

          {selectedItem && (
            <EditModal onClose={closeEdit}>
              <EditItem
                fetchItems={fetchData}
                id={selectedItem}
                closeModal={closeEdit}
              />
            </EditModal>
          )}
        </ul>
      </div>

      <div className="fridge-items">
        <h3>Fridge Items</h3>
        <button type="button" onClick={() => setSortedButton(!sortedButton)}>
          Sort by expiration date
        </button>
        <ul>
          {sortItems(data).map((item) =>
            item.category === "fridge" ? (
              <li key={item.id}>
                <input type="checkbox" />
                <div>{item.name}</div>
                <div>{item.expiration_date}</div>
                <button type="button" onClick={() => deleteItem(item.id)}>
                  Delete item
                </button>
                <button type="button" onClick={() => openEdit(item.id)}>
                  Edit item
                </button>
              </li>
            ) : null
          )}
          {selectedItem && (
            <EditModal onClose={closeEdit}>
              <EditItem
                fetchItems={fetchData}
                id={selectedItem}
                closeModal={closeEdit}
              />
            </EditModal>
          )}
        </ul>
      </div>
    </div>
  );
}
