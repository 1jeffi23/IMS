import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductBatchForm from "./ProductBatchForm";
import { useCreateProductBatchMutation } from "@/features/products/productBatchApi";

const AddProductBatch = () => {
  const navigate = useNavigate();

  const [
    createProductBatch,
    { isLoading: isCreating },
  ] = useCreateProductBatchMutation();

  const handleSubmit = async (data) => {
    try {
      await createProductBatch(data).unwrap();

      navigate("/");

    } catch (error) {
      console.log("Failed to add stock:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Product Stock</CardTitle>
        </CardHeader>

        <CardContent>
          <ProductBatchForm
            isEditing={false}
            onSubmit={handleSubmit}
            isSubmitting={isCreating}
            onCancel={() => navigate("/")}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductBatch;