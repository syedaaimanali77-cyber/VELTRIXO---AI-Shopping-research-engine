from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json

app = FastAPI(title="Veltrixo API")

# ---------------- CORS ---------------- #

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Load Products ---------------- #

with open("products.json", "r", encoding="utf-8") as file:
    PRODUCTS = json.load(file)

# ---------------- Home ---------------- #

@app.get("/")
def home():
    return {
        "name": "Veltrixo API",
        "status": "Running",
        "version": "1.0"
    }

# ---------------- Search Products ---------------- #

@app.get("/products/{query}")
def search_products(query: str):

    results = []

    for product in PRODUCTS:

        if query.lower() in product["name"].lower():

            results.append(product)

    return JSONResponse(content=results)

# ---------------- AI Recommendation ---------------- #

@app.get("/recommend/{query}")
def recommend(query: str):

    matches = []

    for product in PRODUCTS:

        if query.lower() in product["name"].lower():

            matches.append(product)

    if not matches:

        return {"message": "No products found"}

    cheapest = min(matches, key=lambda x: x["price"])
    highest = max(matches, key=lambda x: x["rating"])
    fastest = min(matches, key=lambda x: x["shippingDays"])

    return {

        "bestOverall": highest,

        "cheapest": cheapest,

        "highestRated": highest,

        "fastestDelivery": fastest

    }