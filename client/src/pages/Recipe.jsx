import { useEffect, useState } from "react";
import RecipeCarousel from '../components/RecipeCarousel';
import SimpleHeader from '../components/Header'

export default function Recipe() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recipes, setRecipes] = useState([]);

    const getRecipe = async () => {
        try {
            setLoading(true);
            const itemResponse = await fetch("http://localhost:8000/api/food-items");

            if (!itemResponse.ok) {
                throw new Error(`${itemResponse.status}`);
            }

            const items = await itemResponse.json();
            const ingredients = items
                .map((item) => item.name.trim().toLowerCase())
                .join(",+");

            const response = await fetch(
                `http://localhost:8000/api/recipes?ingredients=${ingredients}`
            );

            if (!response.ok) {
                throw new Error(`${response.status}`);
            }

            const data = await response.json();
            setRecipes(data);
        } catch (error) {
            console.error("Error occurred while loading recipes.", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getRecipe();
    }, []);

    return (
        <div className='page-content'>
            <SimpleHeader />
            <div className="carousel-wrapper">
                <h2>Recipe Carousel</h2>
                {loading && <p>Loading...</p>}
                {error && <p>Error loading recipes.</p>}
                {!loading && !error && <RecipeCarousel recipes={recipes} />}
            </div>
        </div >
    );
}
