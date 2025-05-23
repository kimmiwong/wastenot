import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EditModal from './EditModal';
import EditItem from './EditItem';
import ItemTable from './ItemTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';





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

    function closeEdit() {
        setSelectedItem(null)

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
            const response = await fetch(`http://localhost:8000/api/food-items/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Failed to delete food item')

            const newData = data.filter((item) => item.id !== id);
            setData(newData)

        }
      );

        catch (error) {
            console.error('Error deleting food item', error)

        }

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

    return (
        <div className="item-container">
            <div className="pantry-items">
                <h3>Pantry Items</h3>
                <button type="button" onClick={() => setSortedButton(!sortedButton)}>
                    Sort by expiration date
                </button>
                <ItemTable>
                    {sortItems(data).map((item) =>

  if (isLoading) {
    return <p>Loading games...</p>;
  }

                            <tr key={item.id}>
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    onChange={(e) => setSelectedIngredient(e.target.value)}
                                />
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

                                    <button type="button" onClick={() => openEdit(item.id)} aria-label="Edit item">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>

                                </td>

                            </tr>
                        ) : null

                    )}

                    {selectedItem && (
                        <EditModal onClose={closeEdit}>
                            <EditItem fetchItems={fetchData} id={selectedItem} closeModal={closeEdit} />
                        </EditModal>
                    )}
                </ItemTable>
            </div>


            <div className="fridge-items">
                <h3>Fridge Items</h3>
                <button type="button" onClick={() => setSortedButton(!sortedButton)}>
                    Sort by expiration date
                </button>

                <ItemTable>
                    {sortItems(data).map((item) =>

                        item.category === "fridge" ? (

                            <tr key={item.id}>
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    onChange={(e) => setSelectedIngredient(e.target.value)}
                                />
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


                                    <button type="button" onClick={() => openEdit(item.id)} aria-label="Edit item">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>

                                </td>


                            </tr>
                        ) : null

                    )}
                    {selectedItem && (
                        <EditModal onClose={closeEdit}>
                            <EditItem fetchItems={fetchData} id={selectedItem} closeModal={closeEdit} />
                        </EditModal>
                    )}
                </ItemTable>
            </div>
        </div>

    );
};
