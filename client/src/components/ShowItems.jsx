import { useEffect, useState } from "react";
import EditModal from "./EditModal";
import EditItem from "./EditItem";
import ItemTable from "./ItemTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useIngredients } from "../context/RecipesContext";
import { useNotifications } from "../context/NotificationsContext";

export default function ShowItems({ refreshTrigger }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { selectedIngredient, setSelectedIngredient } = useIngredients();
  const [sortedButton, setSortedButton] = useState(false);
  const { fetchNotifications } = useNotifications();
  const apiHost = import.meta.env.VITE_API_HOST;

  function openEdit(itemId) {
    setSelectedItem(itemId);
  }

  function closeEdit() {
    setSelectedItem(null);
  }

  function sortItems(data) {
    if (sortedButton) {
      data.sort((a, b) => {
        return new Date(a.expiration_date) - new Date(b.expiration_date);
      });
    } else {
      data.sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      });
    }

    return data;
  }

  function isExpired(expirationDate) {
    const today = new Date();
    const expDate = new Date(expirationDate);

    today.setHours(0, 0, 0, 0);
    expDate.setHours(0, 0, 0, 0);

    const diffTime = today - expDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays > 1;
  }

  async function deleteItem(id) {
    try {
      const response = await fetch(`${apiHost}/api/food-items/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete food item");

      const newData = data.filter((item) => item.id !== id);

      setData(newData);

      await fetchNotifications();
    } catch (error) {
      console.error("Error deleting food item", error);
    }
  }

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${apiHost}/api/food-items`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (error) {
      setError(error);
      console.error("Error fetching items", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedIngredients = (itemName, isChecked) => {
    if (isChecked) {
      return setSelectedIngredient([...selectedIngredient, itemName]);
    } else {
      return setSelectedIngredient(
        selectedIngredient.filter((name) => name !== itemName)
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  if (error) {
    return (
      <p>Create a household to see your food inventory. Please refresh.</p>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="item-container">
      <div className="exp-date-wrapper">
        <button
          className="exp-date-button"
          type="button"
          onClick={() => setSortedButton(!sortedButton)}
        >
          Sort by {sortedButton === true ? "Name" : "Expiration Date"}
        </button>
      </div>

      <div className="item-sections">
        <div className="pantry-items">
          <h3>Pantry Items</h3>
          <ItemTable>
            {sortItems(data).map((item) =>
              item.category_id === 1 ? (
                <tr
                  key={item.id}
                  className={
                    isExpired(item.expiration_date) ? "row-expired" : ""
                  }
                >
                  <td>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={selectedIngredient.includes(item.name)}
                      onChange={(e) =>
                        selectedIngredients(item.name, e.target.checked)
                      }
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.expiration_date}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="delete-button"
                      aria-label="Delete item"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => openEdit(item.id)}
                      aria-label="Edit item"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                </tr>
              ) : null
            )}
          </ItemTable>
        </div>

        <div className="fridge-items">
          <h3>Fridge/Freezer Items</h3>
          <ItemTable>
            {sortItems(data).map((item) =>
              item.category_id === 2 ? (
                <tr
                  key={item.id}
                  className={
                    isExpired(item.expiration_date) ? "row-expired" : ""
                  }
                >
                  <td>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={selectedIngredient.includes(item.name)}
                      onChange={(e) =>
                        selectedIngredients(item.name, e.target.checked)
                      }
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.expiration_date}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="delete-button"
                      aria-label="Delete item"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => openEdit(item.id)}
                      aria-label="Edit item"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                </tr>
              ) : null
            )}
          </ItemTable>
        </div>
      </div>
      {selectedItem && (
        <EditModal onClose={closeEdit}>
          <EditItem
            fetchItems={fetchData}
            id={selectedItem}
            closeModal={closeEdit}
          />
        </EditModal>
      )}
    </div>
  );
}
