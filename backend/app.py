import numpy as np
from fastapi import FastAPI, UploadFile, APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ocr_scraping import perform_ocr
from recipe import get_recipes, cook_recipe
from routes import routes

app = FastAPI()
router = APIRouter()

app.include_router(routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to MyFridge"}

@app.post("/ocr/")
async def ocr_receipt(file: UploadFile):
    if file.content_type.startswith("image"):
        image_bytes = await file.read()
        img_array = np.frombuffer(image_bytes, np.uint8)

        ocr_text = perform_ocr(img_array)
        return JSONResponse(content={"result": ocr_text}, status_code=200)
    else:
        return {"error": "Uploaded file is not an image"}

@app.post("/recipe/")
async def recipes():
    print("Getting recipes")
    return get_recipes()

@app.post("/cook_recipe")
async def cooking(recipe: str):
    return cook_recipe(recipe)
