import { useParams, useNavigate } from "react-router-dom";
import {
    useGetProductByidQuery,
  useUpdateProductMutation,
} from "@/features/products/productApi";
import CreateProduct from "./createProduct";

const EditProduct = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  
  const {data,isLoading} = useGetProductByidQuery(id);

  const [updateProduct,{isLoading:isUpdating}] = useUpdateProductMutation();

  if(isLoading){
    return <div className="p-6">Loading product...</div>
  }

  const product = data?.product;

  const handleUpdate = async (formData) => {

    try {
        await updateProduct({
            id,
            data: formData,
        }).unwrap();
        navigate("/products");
        
    } catch (error) {
        console.log("update failed",error);
    }
  }

  

  return (
    <div className="p-6">
      <CreateProduct
        product={product}
        onSubmit={handleUpdate}
        isSubmitting={isUpdating}
        mode="edit"
      />
    </div>
  );
};

export default EditProduct;