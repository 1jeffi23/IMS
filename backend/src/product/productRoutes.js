import express from "express";
import { createProduct,  deleteProduct,  getProductById, getProducts, updateProduct } from "./productController.js";

const router = express.Router();
//product CRUD
export const addProductRoute =   router.post("/add",createProduct);

export const getAllProducts = router.get("/",getProducts);

 export const getProductByid = router.get("/:id",getProductById);

export const updateproduct = router.put("/update/:id",updateProduct);

export const deleteproduct = router.delete("/delete/:id",deleteProduct);




