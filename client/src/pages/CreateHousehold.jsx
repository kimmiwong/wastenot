import { useState } from "react";
import { useNavigate } from "react-router";


export default function CreateHousehold() {

    const navigate = useNavigate();
    const [name, setName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apiHost = import.meta.env.VITE_API_HOST;

            const response = await fetch(`${apiHost}/api/households`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({
                    'name': name
                })

            });

            if (!response.ok) throw new Error('Failed to create household')
        }

        catch (error) {
            console.error('Error creating household')

        }

        navigate('/Home');
    }

    return (
        <>
        <h1>Create household</h1>
        <form className = "create-household-form" onSubmit={handleSubmit}>
            <input type="text" value={name} onChange ={(e) => setName(e.target.value)} ></input>
            <button type="submit">Submit</button>

        </form>

        </>
    )


}
