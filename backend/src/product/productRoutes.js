import express from "express";
import { createProduct, createProductBatch, getProducts } from "./productController.js";

const router = express.Router();
//add product controller
export const addProductRoute =   router.post("/add",createProduct);

export const addProductBatchRoute = router.post("/add-batch",createProductBatch);

export const getAllProducts = router.get("/",getProducts);


