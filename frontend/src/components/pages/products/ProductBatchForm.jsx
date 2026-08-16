import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { useGetProductsQuery } from "@/features/products/productApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProductBatchForm = ({
  initialData,
  isEditing = false,
  onSubmit,
  isSubmitting = false,
  onCancel,
}) => {
  const { data, isLoading: isProductsLoading } = useGetProductsQuery();

  const products = data?.products || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productId: "",
      batchNumber: "",
      quantity: "",
      costPrice: "",
      receivedDate: "",
      expiryDate: "",
      storageLocation: "",
    },
  });

  // Sirf ek dafa initial API data se form fill hoga
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (initialData && !hasInitialized.current) {
      reset({
        productId: initialData.productId ?? "",
        batchNumber: initialData.batchNumber ?? "",
        quantity: initialData.quantity ?? "",
        costPrice: initialData.costPrice ?? "",
        receivedDate:
          initialData.receivedDate?.split("T")[0] ?? "",
        expiryDate:
          initialData.expiryDate?.split("T")[0] ?? "",
        storageLocation:
          initialData.storageLocation ?? "",
      });

      hasInitialized.current = true;
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Product */}
      {!isEditing && (
        <div className="space-y-2">
          <Label>Product</Label>

          <select
            {...register("productId", {
              required: "Please select a product",
            })}
            disabled={isProductsLoading}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">
              {isProductsLoading
                ? "Loading products..."
                : "Select Product"}
            </option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.name} — {product.sku}
              </option>
            ))}
          </select>

          {errors.productId && (
            <p className="text-sm text-red-500">
              {errors.productId.message}
            </p>
          )}
        </div>
      )}

      {/* Batch Number */}
      <div className="space-y-2">
        <Label>Batch Number</Label>

        <Input
          placeholder="e.g. CC-B001"
          {...register("batchNumber", {
            required: "Batch number is required",
          })}
        />

        {errors.batchNumber && (
          <p className="text-sm text-red-500">
            {errors.batchNumber.message}
          </p>
        )}
      </div>

      {/* Quantity + Cost Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="space-y-2">
          <Label>Quantity</Label>

          <Input
            type="number"
            min="1"
            {...register("quantity", {
              required: "Quantity is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Quantity must be at least 1",
              },
            })}
          />

          {errors.quantity && (
            <p className="text-sm text-red-500">
              {errors.quantity.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Cost Price</Label>

          <Input
            type="number"
            step="0.01"
            min="0"
            {...register("costPrice", {
              required: "Cost price is required",
              valueAsNumber: true,
              min: {
                value: 0,
                message: "Cost price cannot be negative",
              },
            })}
          />

          {errors.costPrice && (
            <p className="text-sm text-red-500">
              {errors.costPrice.message}
            </p>
          )}
        </div>

      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="space-y-2">
          <Label>Received Date</Label>

          <Input
            type="date"
            {...register("receivedDate", {
              required: "Received date is required",
            })}
          />

          {errors.receivedDate && (
            <p className="text-sm text-red-500">
              {errors.receivedDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Expiry Date</Label>

          <Input
            type="date"
            {...register("expiryDate")}
          />
        </div>

      </div>

      {/* Storage Location */}
      <div className="space-y-2">
        <Label>Storage Location</Label>

        <Input
          placeholder="e.g. Shelf A1"
          {...register("storageLocation", {
            required: "Storage location is required",
          })}
        />

        {errors.storageLocation && (
          <p className="text-sm text-red-500">
            {errors.storageLocation.message}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
  type="submit"
  disabled={isSubmitting}
>
  {isSubmitting
    ? isEditing
      ? "Saving..."
      : "Adding..."
    : isEditing
      ? "Save"
      : "Add Batches"}
</Button>

      </div>
    </form>
  );
};

export default ProductBatchForm;