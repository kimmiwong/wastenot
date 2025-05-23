import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditModal from "./EditModal";
import EditItem from "./EditItem";
import ItemTable from "./ItemTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export default function ShowItems() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState([]);
  const [sortedButton, setSortedButton] = useState(false);
  const [sortedData, setSortedData] = useState([]);

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

      setSortedData(json);
    } catch (error) {
      setError(error);
      console.error("Error fetching items", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Needs to be fixed
  const selectedIngredients = (itemName, isChecked) => {
    console.log(itemName, isChecked);
    if (isChecked) {
      return setSelectedIngredient(...selectedIngredient, itemName);
    } else {
      return selectedIngredient.filter((item) => item !== itemName);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return <p>Something went wrong. Please refresh.</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="item-container">
      <button type="button" onClick={() => setSortedButton(!sortedButton)}>
        Sort by {sortedButton === true ? "Name" : "Expiration Date"}
      </button>
      <div className="pantry-items">
        <h3>Pantry Items</h3>
        <ItemTable>
          {sortItems(data).map((item) =>
            item.category_id === 1 ? (
              <tr key={item.id}>
                <td>
                  <input
                    className="checkbox"
                    type="checkbox"
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

          {selectedItem && (
            <EditModal onClose={closeEdit}>
              <EditItem
                fetchItems={fetchData}
                id={selectedItem}
                closeModal={closeEdit}
              />
            </EditModal>
          )}
        </ItemTable>
      </div>

      <div className="fridge-items">
        <h3>Fridge Items</h3>
        <ItemTable>
          {sortItems(data).map((item) =>
            item.category_id === 2 ? (
              <tr key={item.id}>
                <td>
                  <input
                    className="checkbox"
                    type="checkbox"
                    onChange={(e) => setSelectedIngredient(e.target.value)}
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
          {selectedItem && (
            <EditModal onClose={closeEdit}>
              <EditItem
                fetchItems={fetchData}
                id={selectedItem}
                closeModal={closeEdit}
              />
            </EditModal>
          )}
        </ItemTable>
      </div>
    </div>
  );
}
