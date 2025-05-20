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
        <>
        <ul>
            {data && data.map(item => (
                <li key={item.id}>
                        <div>{item.name}</div>
                        <div>{item.expiration_date}</div>
                        <div>{item.category}</div>
                </li>
            ))}
        </ul>
        </>

    );
};
