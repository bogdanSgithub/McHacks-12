import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, CookingPot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Initial recipes data
const initialRecipes = [
  {
    id: 1,
    title: "Baked Chicken with Potatoes",
    ingredients: [
      { name: "Whole Air Chilled Chicken", amount: "1.6 kg" },
      { name: "Half-salted Butter", amount: "454 g" },
      { name: "Yellow Potatoes", amount: "4.54 kg" },
    ],
    steps: [
      "Preheat your oven to 200°C (400°F)",
      "Wash the chicken inside and out. Pat it dry with paper towels",
      "Rub the butter over the chicken and season it with salt and pepper",
      "Peel the potatoes and cut them into chunks",
      "Place the chicken in a roasting pan and surround it with the potatoes",
      "Roast in the oven for about 1 hour and 30 minutes, until the chicken is golden brown and the juices run clear when a skewer is inserted into the thickest part of the thigh. The potatoes should be tender",
      "Serve the chicken with the roasted potatoes",
    ],
  },
  {
    id: 2,
    title: "Strawberry and Peanut Butter Sandwich",
    ingredients: [
      { name: "Whole Wheat Thick Sliced Bread", amount: "675 g" },
      { name: "Organic Creamy Peanut Butter", amount: "500 g" },
      { name: "Strawberry Fruit Spread", amount: "365 ml" },
    ],
    steps: [
      "Spread the peanut butter evenly on one slice of bread",
      "Spread the strawberry fruit spread on another slice",
      "Press the two slices together to form a sandwich",
      "Repeat the process with the remaining slices of bread and fillings",
      "Serve immediately or pack for later",
    ],
  },
];

const Recipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState(initialRecipes);

  const handleCook = async (recipeId: number) => {
    try {
      // Simulate deleting related items in the backend
      let indexes = [];
      if (recipeId === 1) {
        indexes = [5, 6, 7];
      } else {
        indexes = [8, 9, 10];
      }

      await Promise.all(
        indexes.map((index) => axios.delete(`http://localhost:8000/items/${index}`))
      );

      // Remove the recipe from the state
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== recipeId)
      );

      // Navigate back to the dashboard/fridge view
      navigate("/dashboard");
    } catch (error) {
      console.error("Error handling cook:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Recipes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recipes.map((recipe) => (
            <Collapsible key={recipe.id} className="border rounded-lg p-2">
              <div className="flex items-center justify-between w-full">
                <CollapsibleTrigger className="flex items-center justify-between flex-1 p-2 hover:bg-accent rounded-md">
                  <span className="text-lg font-semibold">{recipe.title}</span>
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <Button
                  onClick={() => handleCook(recipe.id)}
                  className="ml-2"
                  variant="secondary"
                >
                  <CookingPot className="mr-2 h-4 w-4" />
                  Cook
                </Button>
              </div>
              <CollapsibleContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Ingredients:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient.name} ({ingredient.amount})
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Steps:</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    {recipe.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Recipes;
