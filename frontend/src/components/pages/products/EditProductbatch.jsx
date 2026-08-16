import { useNavigate, useParams } from "react-router-dom";



import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ProductBatchForm from "./ProductBatchForm";
import { useGetProductBatchByIdQuery, useUpdateProductBatchMutation } from "@/features/products/productBatchApi";

const EditProductBatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useGetProductBatchByIdQuery(id);


  const [
    updateProductBatch,
    { isLoading: isUpdating },
  ] = useUpdateProductBatchMutation();

  if (isLoading) {
    return (
      <div className="p-6">
        Loading batch...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load batch
      </div>
    );
  }

  const batch = data?.batch;

  const handleUpdate = async (formData) => {
    try {
     const result =  await updateProductBatch({
        id,
        data: formData,
      }).unwrap();

      navigate("/");

    } catch (error) {
      console.log("Update failed:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product Batch</CardTitle>
        </CardHeader>

        <CardContent>
          <ProductBatchForm
            initialData={batch}
            isEditing={true}
            onSubmit={handleUpdate}
            isSubmitting={isUpdating}
            onCancel={() => navigate("/")}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductBatch;