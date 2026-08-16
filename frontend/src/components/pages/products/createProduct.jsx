import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateProductMutation } from "@/features/products/productApi";
import { toast } from "sonner";

const CreateProduct = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [createProduct, {isLoading}] = useCreateProductMutation();

    const onSubmit = async(data) => {
       try {
         const result = await createProduct({
            name: data.name,
            sku: data.sku,
            unit: data.unit,
            unitPrice: data.unitPrice,
            quantity: data.quantity,
            reorderLevel: data.reorderLevel,
            storageTime: data.storageTime || null,

        }).unwrap();
        console.log("added",result)
        toast.success("Product added successfully!");
        
       } catch (error) {
        console.log(error.message);
        toast.error(error.message || "Faild to add product");
        
       }

    };

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Add Product</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Product Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>

                        <Input
                            id="name"
                            placeholder="e.g. Coca Cola"
                            {...register("name", {
                                required: "Product name is required",
                            })}
                        />

                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* SKU */}
                    <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>

                        <Input
                            id="sku"
                            placeholder="e.g. CC-001"
                            {...register("sku", {
                                required: "SKU is required",
                            })}
                        />

                        {errors.sku && (
                            <p className="text-sm text-destructive">
                                {errors.sku.message}
                            </p>
                        )}
                    </div>

                    {/* Unit */}
                    <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>

                        <Input
                            id="unit"
                            placeholder="e.g. piece, kg, liter"
                            defaultValue="piece"
                            {...register("unit", {
                                required: "Unit is required",
                            })}
                        />

                        {errors.unit && (
                            <p className="text-sm text-destructive">
                                {errors.unit.message}
                            </p>
                        )}
                    </div>

                    {/* Unit Price */}
                    <div className="space-y-2">
                        <Label htmlFor="unitPrice">Unit Price</Label>

                        <Input
                            id="unitPrice"
                            type="number"
                            step="0.01"
                            placeholder="e.g. 120"
                            {...register("unitPrice", {
                                required: "Unit price is required",
                                min: {
                                    value: 0,
                                    message: "Price cannot be negative",
                                },
                            })}
                        />

                        {errors.unitPrice && (
                            <p className="text-sm text-destructive">
                                {errors.unitPrice.message}
                            </p>
                        )}
                    </div>

                    {/* Reorder Level */}
                    <div className="space-y-2">
                        <Label htmlFor="reorderLevel">Reorder Level</Label>

                        <Input
                            id="reorderLevel"
                            type="number"
                            min="0"
                            defaultValue="10"
                            placeholder="e.g. 10"
                            {...register("reorderLevel", {
                                required: "Reorder level is required",
                                min: {
                                    value: 0,
                                    message: "Reorder level cannot be negative",
                                },
                            })}
                        />

                        <p className="text-xs text-muted-foreground">
                            You'll get a low-stock warning when stock reaches this level.
                        </p>

                        {errors.reorderLevel && (
                            <p className="text-sm text-destructive">
                                {errors.reorderLevel.message}
                            </p>
                        )}
                    </div>

                    {/* Storage Time */}
                    <div className="space-y-2">
                        <Label htmlFor="storageTime">
                            Storage Time (Days)
                        </Label>

                        <Input
                            id="storageTime"
                            type="number"
                            min="0"
                            placeholder="e.g. 30"
                            {...register("storageTime", {
                                min: {
                                    value: 0,
                                    message: "Storage time cannot be negative",
                                },
                            })}
                        />

                        <p className="text-xs text-muted-foreground">
                            Maximum recommended storage duration in days.
                        </p>

                        {errors.storageTime && (
                            <p className="text-sm text-destructive">
                                {errors.storageTime.message}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>

                        <Button type="submit"  disabled={isLoading} >
                           {isLoading ? "Adding...." : "Add Product"}
                        </Button>
                    </div>

                </form>
            </CardContent>
        </Card>
    );
};

export default CreateProduct;