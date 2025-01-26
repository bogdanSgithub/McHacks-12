import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar, ShoppingBag } from "lucide-react";
import '/src/components/style.css';

const Dashboard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-purple-700">Food Inventory</h1>

      {/* Fridge container */}
      <div className="bg-[#F1F0FB] rounded-2xl p-8 shadow-xl border-4 border-[#8E9196]">
        <div className="space-y-8">
          {/* 3D Fridge Model */}
          <div className="wrapper">
            <div
              id="left-door"
              className="door"
            >
              {/* Left door content */}
            </div>
            <div
              id="right-door"
              className="door"
            >
              {/* Right door content */}
            </div>

            {/* Shelves container inside the fridge */}
            <div className="shelves-container">
              <div className="shelf">
                {shelves[0]?.map((product) => (
                  <Card
                    key={product.id}
                    className="product"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                    />
                    <h3 className="text-sm text-purple-700">{product.name}</h3>
                  </Card>
                ))}
              </div>
              <div className="shelf">
                {shelves[1]?.map((product) => (
                  <Card
                    key={product.id}
                    className="product"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                    />
                    <h3 className="text-sm text-purple-700">{product.name}</h3>
                  </Card>
                ))}
              </div>
            </div>
          </div>
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
                    src={selectedProduct.image || "/placeholder.svg"}
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
