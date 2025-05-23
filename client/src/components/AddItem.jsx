import { useEffect, useState } from 'react'
import { TextInput, Select, Button } from '@mantine/core';


export default function AddItem() {



    const [name, setName] = useState('')
    const [expirationDate, setExpirationDate] = useState('')
    const [category, setCategory] = useState('pantry')

    const handleSubmit = async (e) => {


        console.log('form submitted', { name, expirationDate, category })



        try {

            const response = await fetch('http://localhost:8000/api/food-items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'name': name,
                    'expiration_date': expirationDate,
                    'category': category
                })

            });

            if (!response.ok) throw new Error('Failed to add food item')

        }

        catch (error) {
            console.error('Error adding food item', error)

        }

    }


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
                        <label htmlFor='expiration-date'>Expiration Date:</label>
                        <input type='date' id='expiration-date' value={expirationDate} onChange={e => setExpirationDate(e.target.value)}></input>

                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category:</label>
                        <select
                            id="category"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="pantry">Pantry</option>
                            <option value="fridge">Fridge/Freezer</option>
                        </select>
                    </div>

                    <button type="submit">Add Food Item</button>
                </form>
            </div>
        </div>


    )


}
