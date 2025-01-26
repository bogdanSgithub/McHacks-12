import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar, DollarSign, Info, ShoppingBag } from "lucide-react";

// Sample data
/*export const products = [
  {
    id: 1,
    title: "Organic Bananas",
    description: "Fresh organic bananas from Ecuador",
    quantity: 6,
    pricePerUnit: 0.33,
    nutritionValue: {
      calories: 105,
      protein: "1.3g",
      carbs: "27g",
      fat: "0.3g"
    },
    image: "/placeholder.svg",
    expirationDate: "2024-04-20",
    dateBought: "2024-04-13",
    brand: "Dole"
  },
  {
    id: 2,
    title: "Whole Milk",
    description: "Fresh whole milk, pasteurized",
    quantity: 1,
    pricePerUnit: 3.99,
    nutritionValue: {
      calories: 150,
      protein: "8g",
      carbs: "12g",
      fat: "8g"
    },
    image: "/placeholder.svg",
    expirationDate: "2024-04-25",
    dateBought: "2024-04-13",
    brand: "Horizon Organic"
  },
  {
    id: 3,
    title: "Sourdough Bread",
    description: "Artisanal sourdough bread",
    quantity: 1,
    pricePerUnit: 4.99,
    nutritionValue: {
      calories: 120,
      protein: "4g",
      carbs: "24g",
      fat: "0g"
    },
    image: "/placeholder.svg",
    expirationDate: "2024-04-18",
    dateBought: "2024-04-13",
    brand: "Local Bakery"
  }
];
*/
const Dashboard = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-purple-700">Food Inventory</h1>
      
      {/* Fridge container */}
      <div className="bg-[#F1F0FB] rounded-2xl p-8 shadow-xl border-4 border-[#8E9196]">
        {/* Shelves */}
        <div className="space-y-8">
          {shelves.map((shelf, shelfIndex) => (
            <div 
              key={shelfIndex}
              className="relative bg-[#F3F3F3] p-4 rounded-lg shadow-md"
              style={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.1), 0 -1px 1px rgba(255,255,255,0.8) inset'
              }}
            >
              {/* Products on the shelf */}
              <div className="grid grid-cols-3 gap-4">
                {shelf.map((product) => (
                  <Card 
                    key={product.id}
                    className="p-2 cursor-pointer hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="aspect-square mb-2 relative overflow-hidden rounded-lg">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h3 className="font-semibold text-sm mb-1 text-purple-700 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-purple-600">
                      <ShoppingBag className="w-3 h-3" />
                      <span>Qty: {product.quantity}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-purple-700">{selectedProduct.title}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 text-purple-700">
                        <ShoppingBag className="w-4 h-4" />
                        Quantity
                      </h4>
                      <p className="text-purple-600">{selectedProduct.quantity}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 text-purple-700">
                        <Calendar className="w-4 h-4" />
                        Expiration
                      </h4>
                      <p className="text-purple-600">{format(new Date(selectedProduct.expirationDate), "MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 text-purple-700">
                        <Info className="w-4 h-4" />
                        Brand
                      </h4>
                      <p className="text-purple-600">{selectedProduct.brand}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-700">Nutrition Value</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-purple-600">
                      <p>Calories: {selectedProduct.nutritionValue.calories}</p>
                      <p>Protein: {selectedProduct.nutritionValue.protein}</p>
                      <p>Carbs: {selectedProduct.nutritionValue.carbs}</p>
                      <p>Fat: {selectedProduct.nutritionValue.fat}</p>
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