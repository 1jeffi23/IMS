import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeleteProductBatchMutation, useGetProductBatchesQuery } from "@/features/products/productBatchApi";


const ViewProductBatches = () => {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useGetProductBatchesQuery();

   const [
    deleteProductBatch,
    { isLoading: isDeleting },
  ] = useDeleteProductBatchMutation();

  if (isLoading) {
    return <div className="p-6">Loading batches...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load batches
      </div>
    );
  }
   const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this batch?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProductBatch(id).unwrap();

      console.log("Batch deleted successfully");
    } catch (error) {
      console.log("Delete failed:", error);
    }
  };

  const batches = data?.batches || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Product Batches
          </h1>

          <p className="text-muted-foreground">
            Manage product stock batches
          </p>
        </div>

        <Button
          onClick={() => navigate("/product-batches/add")}
        >
          Add Batch
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Cost Price</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {batches.map((batch) => (
            <TableRow key={batch.id}>

              <TableCell className="font-medium">
                {batch.productName}
              </TableCell>

              <TableCell>
                <Badge variant="outline">
                  {batch.batchNumber}
                </Badge>
              </TableCell>

              <TableCell>
                {batch.quantity}
              </TableCell>

              <TableCell>
                Rs. {batch.costPrice}
              </TableCell>

              <TableCell>
                {batch.receivedDate
                  ? new Date(batch.receivedDate).toLocaleDateString()
                  : "—"}
              </TableCell>

              <TableCell>
                {batch.expiryDate
                  ? new Date(batch.expiryDate).toLocaleDateString()
                  : "—"}
              </TableCell>

              <TableCell>
                {batch.storageLocation || "—"}
              </TableCell>

              <TableCell>
                <div className="flex gap-2">

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      navigate(
                        `/product-batches/update-batch/${batch.id}`
                      )
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                     disabled={isDeleting}
                    onClick={() =>
                      handleDelete(batch.id)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                </div>
              </TableCell>

            </TableRow>
          ))}

          {batches.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8"
              >
                No product batches found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewProductBatches;