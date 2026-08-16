import express from "express";
import { createProductBatch, deleteProductBatch, getProductBatches, getProductBtachById, updateProductBatch } from "./productController.js";

const router = express.Router();
//productbatch
export const addProductBatchRoute = router.post("/add-batch",createProductBatch);

export const getAllBatches = router.get("/",getProductBatches);

export const getProdBatchById = router.get("/:id",getProductBtachById);

export const updateBatch = router.put("/update-batch/:id",updateProductBatch);

export const deleteBatch = router.delete("/delete/:id",deleteProductBatch);