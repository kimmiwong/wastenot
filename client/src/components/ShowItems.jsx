import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function ShowItems() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const res = await fetch('http://localhost:8000/api/pantry')
                const json = await res.json();
                setData(json);
            } catch (error) {
                setError(error);
                console.error("Error fetching items", error)
            } finally {
                setIsLoading(false)
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <p>Something went wrong. Please refresh.</p>
    }

    if (isLoading) {
        return <p>Loading games...</p>
    }

    return (
        <div className="item-container">
            <div className = "pantry-items">
                <h3>Pantry Items</h3>
                <ul>
                    {data && data.map(item =>

                        item.category === "pantry" ? (

                            <li key={item.id}>
                                <div>{item.name}</div>
                                <div>{item.expiration_date}</div>
                                <div></div>
                        </li>
                        ) : null

                    )}
                </ul>
            </div>


            <div className = "fridge-items">
                <h3>Fridge Items</h3>
                <ul>
                    {data && data.map(item =>

                        item.category === "fridge" ? (

                            <li key={item.id}>
                                <div>{item.name}</div>
                                <div>{item.expiration_date}</div>
                                <div></div>
                        </li>
                        ) : null

                    )}
                </ul>
            </div>
        </div>

    );
};
