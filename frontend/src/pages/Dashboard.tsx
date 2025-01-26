import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Weight, Clock, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import '/src/components/style.css';

const Dashboard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from the FastAPI endpoint
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/items/");
        setProducts(response.data);
        console.log("Fetched products:", response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Group products into shelves (3 products per shelf)
  const shelves = products.reduce((acc: typeof products[][], product, index) => {
    const shelfIndex = Math.floor(index / 3);
    if (!acc[shelfIndex]) {
      acc[shelfIndex] = [];
    }
    acc[shelfIndex].push(product);
    return acc;
  }, []);

  

  return (
    <div className="container mx-auto p-6 relative min-h-screen">
      {/* Fridge container */}
      <div className="">
        <div className="space-y-8">
          {/* 3D Fridge Model */}
          <div className="wrapper">
            <div id="left-door" className="door">
              <div className="door-knob"></div>
              {/* Left door content */}
            </div>
            <div id="right-door" className="door">
              <div className="door-knob"></div>
              {/* Right door content */}
            </div>
            <div className="hardcoded-line"></div> 
            <div className="hardcoded-line1"></div> 
            <div className="hardcoded-line2"></div> 
            <div className="hardcoded-line3"></div>
            <div className="rectangle"></div>
            <div className="rectangle2"></div>
            {/* Shelves container inside the fridge */}
            <div className="shelves-container">
              <TooltipProvider>
                {shelves.map((shelf, shelfIndex) => (
                  <div key={shelfIndex} className="shelf">
                    {shelf.map((product) => (
                      <Tooltip key={product.id}>
                        <TooltipTrigger asChild>
                          <Card
                            className="product"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                            />
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{product.name}</p>
                          <p>Expires: {product.expiration_date}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Recipes button positioned at bottom right */}
      <div className="fixed bottom-6 right-6">
        <Button 
          onClick={() => navigate('/recipes')} 
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Recipes
        </Button>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-purple-700">
                  {selectedProduct.name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 text-purple-700">
                        <Tag className="w-4 h-4" />
                        Brand
                      </h4>
                      <p className="text-purple-600">
                        {selectedProduct.brand || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 text-purple-700">
                        <Weight className="w-4 h-4" />
                        Weight
                      </h4>
                      <p className="text-purple-600">
                        {selectedProduct.weight.split(",")[0] || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 text-purple-700">
                        <Calendar className="w-4 h-4" />
                        Expiration Date
                      </h4>
                      <p className="text-purple-600">
                        {selectedProduct.expiration_date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;