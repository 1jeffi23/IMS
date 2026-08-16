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
import { useDeleteProductMutation, useGetProductsQuery } from "../../../features/products/productApi";
import { useNavigate } from "react-router-dom";

const ProductsList = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, isError} = useGetProductsQuery();
   const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
   

  if (isLoading) {
    return <div className="p-6">Loading products...</div>
  }

  if (isError) {
    return <div>Failed to Load products... </div>
    
  }

  const products = data?.products || [];

  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity === 0) {
      return {
        label: "Out of Stock",
        variant: "destructive",
      };
    }

    if (quantity <= reorderLevel) {
      return {
        label: "Low Stock",
        variant: "secondary",
      };
    }

    return {
      label: "In Stock",
      variant: "default",
    };
  };

 

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();

    } catch (error) {
      console.log("failed delet", error);

    }

  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Unit Price</TableHead>
          <TableHead>Cost Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((product) => {
          const status = getStockStatus(product.quantity, product.reorderLevel);

          return (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                {product.name}
              </TableCell>

              <TableCell>Rs. {product.unitPrice}</TableCell>

              {/* <TableCell>Rs. {product.costPrice}</TableCell> */}

              <TableCell>{product.quantity}</TableCell>

              <TableCell>
                <Badge variant={status.variant}>
                  {status.label}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon"
                    onClick={() => navigate(`/products/edit/${product.id}`)}>
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button variant="ghost" size="icon"
                    onClick={() => handleDelete(product.id)}
                    disabled={isDeleting}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ProductsList;