import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

// Sample receipt data that would come from OCR
/*const sampleReceipt = {
  items: [
    {
      id: 4,
      title: "Chicken Breast",
      description: "Fresh boneless chicken breast",
      quantity: 2,
      pricePerUnit: 5.99,
      nutritionValue: {
        calories: 165,
        protein: "31g",
        carbs: "0g",
        fat: "3.6g"
      },
      image: "/placeholder.svg",
      expirationDate: "2024-04-19",
      dateBought: "2024-04-13",
      brand: "Perdue"
    },
    {
      id: 5,
      title: "Greek Yogurt",
      description: "Plain Greek yogurt",
      quantity: 1,
      pricePerUnit: 4.99,
      nutritionValue: {
        calories: 130,
        protein: "12g",
        carbs: "9g",
        fat: "0g"
      },
      image: "/placeholder.svg",
      expirationDate: "2024-04-27",
      dateBought: "2024-04-13",
      brand: "Fage"
    }
  ]
};*/


const AddProduct = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processReceipt = async (file: File) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch("http://127.0.0.1:8000/ocr/", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to process receipt");
      }
  
      const data = await response.json();
      console.log(data);
  
      // Directly handle `result` as an array
      if (Array.isArray(data.result)) {
        const itemsWithNames = data.result.map((item) => ({
          ...item,
        }));
        setItems(itemsWithNames);
        toast.success("Receipt processed successfully!");
      } else {
        setItems([]);
        throw new Error("Invalid data format: result is not an array");
      }
    } catch (error) {
      toast.error("Failed to process receipt. Please try again.");
      console.error("Error processing receipt:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const updateItem = (index: number, field: string, value: string | number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processReceipt(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processReceipt(files[0]);
    }
  };

  const handleSaveOrder = async () => {
    if (items.length === 0) {
      toast.error("No items to save. Please upload a receipt first.");
      return;
    }
  
    // Transform data to match backend expectations
    const transformedItems = items.map((item) => ({
      name: item.name,
      weight: item.weight,
      expiration_date: "2025-01-01", // Placeholder, you can replace this with actual logic
      image: item.image,  
    }));
  
    console.log("Transformed items:", transformedItems);
    console.log(items);
    try {
      // Assuming you only want to send the first item
      const response = await fetch("http://127.0.0.1:8000/additems/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedItems), // Send just the first item (or the item you're trying to save)
      });
  
      if (!response.ok) {
        throw new Error("Failed to save order to the database.");
      }
  
      const result = await response.json();

      toast.success("Order saved successfully!");
      console.log("Saved order:", result);
  
      // Redirect to another page (e.g., dashboard or home page)
      navigate("/");
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Failed to save order. Please try again.");
    }
  };
  
  
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Add Products</h1>

      <Card
        className={`p-8 mb-8 border-2 border-dashed ${isDragging ? "border-primary bg-primary/10" : "border-gray-200"
          } transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Upload Receipt</h3>
          <p className="text-gray-500 mb-4">Drag and drop your receipt image here</p>
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button variant="outline" disabled={isProcessing} asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Select File"
                )}
              </label>
            </Button>
          </div>
        </div>
      </Card>

      {items.map((item, index) => (
        <Card key={item.product_code || index} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image Section */}
            <div className="flex justify-center items-center">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gray-100 text-gray-400 text-sm rounded-lg shadow-sm">
                  No Image
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="col-span-2 space-y-4">
              <div>
                <Label htmlFor={`title-${index}`}>Name</Label>
                <Input
                  id={`title-${index}`}
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", parseInt(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`brand-${index}`}>Brand</Label>
                  <Input
                    id={`brand-${index}`}
                    value={item.brand}
                    onChange={(e) => updateItem(index, "brand", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`expiration-${index}`}>Expiration Date</Label>
                <Input
                  id={`expiration-${index}`}
                  type="date"
                  value={item.expirationDate}
                  onChange={(e) =>
                    updateItem(index, "expirationDate", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
      {items.length > 0 && (
        <div className="text-right mt-6">
          <Button onClick={handleSaveOrder} variant="default">
            Save Order
          </Button>
        </div>
      )}
    </div>
  )
}
export default AddProduct;