from openai import OpenAI
from dotenv import load_dotenv
import os
import requests
import json
import ast
import re

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = None

if api_key:
    client = OpenAI(api_key=api_key)


def get_items():

    response = requests.get("http://localhost:8000/items/")
    print(response.json())
    response.raise_for_status()
    return response.json()

def get_recipes():
    with open('good_saved.json', 'r') as file:
        recipes = json.load(file)
    return recipes
    #items = get_items()
    with open('items.json', 'r') as file:
        items = json.load(file)  
    print(items)
    if client is None:
        return ""
    completion = client.chat.completions.create(
    model="gpt-4",
    store=True,
    messages=[
        {"role": "user", "content": f"Provide up to 2 recipes that I can make with the list of ingredients. After each receipt, provide a dictionary of tuples of the ingredients. I only want the ingredient's id and weight (ex: (4, '1 kg')) that is used for the recipe. This is not displayed to the user. So it's Recipe || dct || Recipe || dct. You can only use an ingredient for 1 dish. ITS OKAY IF THERE IS 1 Recipe!. Divide them by ' || '  so i can split it. TRANSLATE THE INGREDIENT NAME from FRENCH to ENGLISH when you list them in ingredients. Look at the weight and quantity of each ingredient and make the proportions of the used ingredients nice round numbers. ex: 50 g of bread which is 100 g total. Keep the unit of measurement the same as it is on the product. DO NOT CHANGE FROM kg to g OR l to ml. If I don't have the ingredient then DO NOT PROVIDE ME THAT RECIPE! Provide exact ingredient measurements: {items}"},
    ]
    )
    info = completion.choices[0].message.content.split("||")
    print(info)
    final = [
        {"recipe": info[0], "dct": info[1]},
        {"recipe": info[2], "dct": info[3]}
    ]
    return final

def extract_quantity(value):
    match = re.match(r'(\d+)', value)
    if match:
        return int(match.group(1))
    return None

def cook_recipe(info):
    #items = get_items()
    with open('items.json', 'r') as file:
        items = json.load(file)
    if client is None:
        return ""
    print(info)
    tuples = re.findall(r"\((\d+),\s*'([^']+)'\)", info)
    tuple_list = [(int(id), extract_quantity(value)) for id, value in tuples]
    print(tuple_list)
    for key, value in tuple_list:
        for item in items:
            if item["id"] == key:
                available_quantity = extract_quantity(item["weight"])
                if available_quantity <= value:
                    print(f"Deleting item {key}")
                    requests.delete(f"http://localhost:8000/items/{item['id']}")
                else:
                    print(f"reducing item {key}")
                    response = requests.put(f"http://localhost:8000/items/{item['id']}", json={"weight": f"{available_quantity - value} {item['weight'].split()[1]}"})