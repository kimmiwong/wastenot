from fastapi import FastAPI, HTTPException
import requests
import os


api_key = os.getenv("API_KEY")

def fetch_recipes(ingredients: str):

    url = f"https://api.spoonacular.com/recipes/findByIngredients?ingredients={ingredients}&number=4&apiKey={api_key}"

    try:
        response = requests.get(url)

        if response.status_code != 200:
            raise HTTPException(
                status_code = 502,
                detail = "Error fetching recipe ID."
            )

        data = response.json()

        if not data:
            print("No recipes found by Spoonacular.")
            return []

        ids = ",".join(str(recipe["id"]) for recipe in data)

        recipe_url = f"https://api.spoonacular.com/recipes/informationBulk?ids={ids}&apiKey={api_key}"
        id_response = requests.get(recipe_url)

        if id_response.status_code != 200:
            raise HTTPException(
                status_code = 502,
                detail = "Error fetching recipe."
            )

        recipes = id_response.json()

        return recipes

    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=503,
            detail=f"External API call failed: {str(e)}"
        )
