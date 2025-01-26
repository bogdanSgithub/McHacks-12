import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, CookingPot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const recipes = [
  {
    id: 1,
    title: "Classic Spaghetti Bolognese",
    steps: [
      "Heat oil in a large pot over medium heat",
      "Add onions, carrots, and celery. Cook until softened",
      "Add ground beef and cook until browned",
      "Add tomato sauce and simmer for 30 minutes",
      "Cook pasta according to package instructions",
      "Serve sauce over pasta with grated parmesan"
    ]
  },
  {
    id: 2,
    title: "Chicken Stir Fry",
    steps: [
      "Cut chicken into bite-sized pieces",
      "Chop all vegetables",
      "Heat wok over high heat",
      "Stir-fry chicken until cooked through",
      "Add vegetables and stir-fry until crisp-tender",
      "Add sauce and cook until thickened"
    ]
  }
];

const Recipes = () => {
  const navigate = useNavigate();

  const handleCook = (recipeId: number) => {
    // Navigate back to the dashboard/fridge view
    navigate('/dashboard');
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
              <CollapsibleContent className="p-4 space-y-2">
                {recipe.steps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="font-medium">{index + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Recipes;