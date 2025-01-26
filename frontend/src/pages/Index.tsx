import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, ShoppingBag } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Food Inventory Manager</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Keep track of your food items, manage expiration dates, and monitor nutrition values.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/dashboard")}>
            <ShoppingBag className="mr-2 h-5 w-5" />
            View Inventory
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/add-product")}>
            <Plus className="mr-2 h-5 w-5" />
            Add Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;