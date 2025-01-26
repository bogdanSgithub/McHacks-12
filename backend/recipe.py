from openai import OpenAI
from dotenv import load_dotenv
import os
import requests
import json

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = None

if api_key:
    client = OpenAI(api_key=api_key)


def get_items():
    response = requests.get("http://localhost:8000/items/")
    response.raise_for_status()
    return response.json()

def get_recipes():
    #items = get_items()
    with open('items.json', 'r') as file:
        items = json.load(file)  

    if client is None:
        return ""
    completion = client.chat.completions.create(
    model="gpt-4",
    store=True,
    messages=[
        {"role": "user", "content": f"Provide up to 2 recipes that I can make with the list of ingredients. You can only use an ingredient for 1 dish. ITS OKAY IF THERE IS 1 Recipe!. Divide the 2 Recipies by ' || ' so i can split it. Look at the weight and quantity of each ingredient and make the proportions of the used ingredients nice round numbers. ex: 50 g of bread which is 100 g total. If I don't have the ingredient then DO NOT PROVIDE ME THAT RECIPE! Provide exact ingredient measurements: {items}"},
    ]
    )
    recipies = completion.choices[0].message.content.split("||")
    return recipies