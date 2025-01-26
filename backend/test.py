from openai import OpenAI
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()


client = OpenAI(
  api_key=os.getenv("OPENAI_API_KEY")
)
product = "Lait"
bought_date = datetime.strptime("24/11/10", "%y/%m/%d")

completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  store=True,
  messages=[
    {"role": "user", "content": f"Only give me the date. Only that. Only return datetime. Provide the expiration date of this product {product} which was bought on {bought_date}."},
  ]
)
answer = completion.choices[0].message.content
print(answer)
