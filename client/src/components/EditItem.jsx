import { useState } from "react"

export default function EditItem({fetchItems, id, closeModal}) {


    const [name, setName] = useState('')
    const [expirationDate, setExpirationDate] = useState('')
    const [category, setCategory] = useState('pantry')

    const handleSubmit = async(e) =>    {

        e.preventDefault()

        try {

            const response = await fetch(`http://localhost:8000/api/food-items/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify ({
                    'name': name,
                    'expiration_date': expirationDate,
                    'category': category

                })

            });

            if(!response.ok) throw new Error ('Failed to edit food item')
            closeModal()
            fetchItems()

        }

        catch(error) {console.error('Error editing food item', error)

        }

    }

    return (

        <div className = 'edit-item-container'>
            <h2>Edit food item</h2>
            <form className = 'edit-item-form' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='name'>Food Name:</label>
                    <input type='text' id='name' defaultValue={name} onChange={e => setName(e.target.value)}></input>
                </div>

                <div>
                    <label htmlFor='expiration-date'>Expiration Date:</label>
                    <input type='date' id='expiration-date' defaultValue={expirationDate} onChange={e => setExpirationDate(e.target.value)}></input>
                </div>

                <div>
                    <label htmlFor='category'>Category:</label>
                    <select id='category' name='category' defaultValue={category} onChange={e => setCategory(e.target.value)}>
                        <option value='pantry'>Pantry</option>
                        <option value='fridge'>Fridge/Freezer</option>
                    </select>
                </div>
                <button type='submit'>Done</button>

            </form>

        </div>
    )

}
